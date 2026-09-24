<template>
  <div :class="classObj" class="app-wrapper" :style="{'--current-color': theme}">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container" v-if="sideTheme == 'theme-dark' || sideTheme == 'theme-dark-top'"/>
    <div :class="{hasTagsView:needTagsView}" class="main-container" :style="sideTheme != 'theme-dark' && sideTheme != 'theme-dark-top'?'margin-left:0px':''">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel>
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import variables from '@/assets/styles/variables.scss'
import RepairOrderSse from '@/utils/repairOrderSse'
import { MessageManagement } from '@/api/maintenance'
import {
  createPersistentNotificationOptions,
  getRepairMessageId,
  getRepairMessageKey,
  getRepairOrderNoticeContent,
  shouldNotifyRepairOrderMessage,
  shouldSpeakRepairOrderMessage
} from '@/utils/repairOrderNotification.js'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      repairOrderSse: null,
      audioContext: null,
      activeRepairOrderNotifications: Object.create(null),
      readingRepairOrderMessages: Object.create(null),
      suppressRepairOrderReadOnClose: false,
      pendingRepairOrderNotificationKeys: Object.create(null),
      repairOrderNotificationQueue: [],
      processingRepairOrderNotificationQueue: false,
      repairOrderNotificationOrder: []
    }
  },
  computed: {
    ...mapState({
      theme: state => state.settings.theme,
      sideTheme: state => state.settings.sideTheme,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables;
    }
  },
  /**
   * 用户进入登录后布局时立即建立工单 SSE 连接，由后端推送该用户的未读消息。
   * @returns {void}
   */
  created() {
    this.startRepairOrderSse()
  },
  /**
   * 布局组件销毁前停止 SSE、清空语音队列并关闭音频上下文，避免退出后继续播报。
   * @returns {void}
   */
  beforeDestroy() {
    this.suppressRepairOrderReadOnClose = true
    this.repairOrderNotificationQueue = []
    this.repairOrderNotificationOrder = []
    this.pendingRepairOrderNotificationKeys = Object.create(null)
    this.stopRepairOrderSse()
    Object.keys(this.activeRepairOrderNotifications).forEach(key => {
      this.activeRepairOrderNotifications[key].close()
    })
    if (window.speechSynthesis) window.speechSynthesis.cancel()
    if (this.audioContext) this.audioContext.close()
  },
  methods: {
    /**
     * 点击侧边栏外部区域时关闭侧边栏，并保留默认关闭动画。
     * @returns {void}
     */
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    /**
     * 为具备维修身份的用户创建并启动唯一的工单 SSE 连接。
     * @returns {void}
     */
    startRepairOrderSse() {
      if (this.repairOrderSse) return
      this.repairOrderSse = new RepairOrderSse({
        onMessage: message => this.handleRepairOrderMessage(message)
      })
      this.repairOrderSse.start()
    },
    /**
     * 主动停止当前工单 SSE 连接并释放实例引用。
     * @returns {void}
     */
    stopRepairOrderSse() {
      if (!this.repairOrderSse) return
      this.repairOrderSse.stop()
      this.repairOrderSse = null
    },
    /**
     * 处理未读维修工单事件：避免页面内重复提示，并持续展示到用户标记已读。
     * @param {Object} message 服务端推送的工单事件数据。
     * @returns {void}
     */
    handleRepairOrderMessage(message) {
      if (!shouldNotifyRepairOrderMessage(message)) return
      const messageKey = getRepairMessageKey(message)
      if (messageKey && (
        this.activeRepairOrderNotifications[messageKey] ||
        this.pendingRepairOrderNotificationKeys[messageKey] ||
        this.readingRepairOrderMessages[messageKey]
      )) return

      this.enqueueRepairOrderNotification(message)
      if (shouldSpeakRepairOrderMessage(message)) {
        const content = getRepairOrderNoticeContent(message)
        this.playRepairOrderVoice(content)
      }
      this.$root.$emit('repair-order-created', message)
    },
    /**
     * 将工单加入原生通知创建队列，避免连续 SSE 消息在同一渲染周期内发生高度计算冲突。
     * @param {Object} message SSE 推送的工单消息数据。
     * @returns {void}
     * @example this.enqueueRepairOrderNotification(message)
     */
    enqueueRepairOrderNotification(message) {
      const messageKey = getRepairMessageKey(message)
      if (messageKey) this.pendingRepairOrderNotificationKeys[messageKey] = true
      this.repairOrderNotificationQueue.push(message)
      this.processRepairOrderNotificationQueue()
    },
    /**
     * 按顺序创建 Element UI 原生通知，并在每条通知完成布局后继续处理下一条。
     * @returns {Promise<void>} 当前通知队列处理完成后的 Promise。
     * @example this.processRepairOrderNotificationQueue()
     */
    async processRepairOrderNotificationQueue() {
      if (this.processingRepairOrderNotificationQueue) return
      this.processingRepairOrderNotificationQueue = true
      try {
        while (this.repairOrderNotificationQueue.length && !this.suppressRepairOrderReadOnClose) {
          const message = this.repairOrderNotificationQueue.shift()
          this.showRepairOrderNotification(message)
          await this.waitForRepairOrderNotificationLayout()
          this.reorderRepairOrderNotifications()
        }
      } finally {
        this.processingRepairOrderNotificationQueue = false
      }
    },
    /**
     * 创建一条持久展示的 Element UI 原生工单通知。
     * @param {Object} message SSE 推送的工单消息数据。
     * @returns {void}
     * @example this.showRepairOrderNotification(message)
     */
    showRepairOrderNotification(message) {
      const messageKey = getRepairMessageKey(message)
      const content = getRepairOrderNoticeContent(message)
      const notification = this.$notify(Object.assign({}, createPersistentNotificationOptions(), {
        title: '新工单提醒',
        message: content,
        type: 'warning',
        position: 'top-right',
        customClass: 'repair-order-notice',
        onClose: () => {
          if (messageKey) delete this.activeRepairOrderNotifications[messageKey]
          this.repairOrderNotificationOrder = this.repairOrderNotificationOrder.filter(
            key => key !== messageKey
          )
          if (!this.suppressRepairOrderReadOnClose) {
            this.$nextTick(() => this.reorderRepairOrderNotifications())
          }
          if (!this.suppressRepairOrderReadOnClose) {
            this.markRepairOrderMessageAsRead(message)
          }
        }
      }))
      if (messageKey) delete this.pendingRepairOrderNotificationKeys[messageKey]
      if (messageKey) {
        this.activeRepairOrderNotifications[messageKey] = notification
        this.repairOrderNotificationOrder.push(messageKey)
      }
    },
    /**
     * 按创建顺序倒序重新排列当前工单通知，使最新通知位于顶部。
     * 每条通知之间保持 16 像素间距，并使用通知渲染后的实际高度计算位置。
     * @returns {void}
     * @example this.reorderRepairOrderNotifications()
     */
    reorderRepairOrderNotifications() {
      let verticalOffset = 16
      this.repairOrderNotificationOrder.slice().reverse().forEach(messageKey => {
        const notification = this.activeRepairOrderNotifications[messageKey]
        if (!notification || !notification.$el) return
        notification.verticalOffset = verticalOffset
        notification.$el.style.top = `${verticalOffset}px`
        verticalOffset += notification.$el.offsetHeight + 16
      })
    },
    /**
     * 等待浏览器完成当前原生通知布局，确保下一条能读取到准确高度。
     * 页面处于后台导致动画帧暂停时，50 毫秒定时器会作为降级保障。
     * @returns {Promise<void>} 两个动画帧完成或降级定时器触发后完成的 Promise。
     * @example await this.waitForRepairOrderNotificationLayout()
     */
    waitForRepairOrderNotificationLayout() {
      return new Promise(resolve => {
        let completed = false
        const finish = () => {
          if (completed) return
          completed = true
          resolve()
        }
        const timer = setTimeout(finish, 50)
        const requestFrame = window.requestAnimationFrame
          ? callback => window.requestAnimationFrame(callback)
          : callback => setTimeout(callback, 16)
        requestFrame(() => {
          requestFrame(() => {
            clearTimeout(timer)
            finish()
          })
        })
      })
    },
    /**
     * 用户关闭原生通知后调用消息修改接口标记已读，失败时恢复该条未读提示。
     * @param {Object} message SSE 推送的工单消息数据。
     * @returns {Promise<void>} 已读请求完成后的 Promise。
     * @example this.markRepairOrderMessageAsRead(message)
     */
    async markRepairOrderMessageAsRead(message) {
      const messageId = getRepairMessageId(message)
      if (messageId === null) {
        this.$message.error('工单消息缺少消息 ID，暂时无法标记已读')
        this.$nextTick(() => {
          if (!this.suppressRepairOrderReadOnClose) this.handleRepairOrderMessage(message)
        })
        return
      }
      const messageKey = String(messageId)
      if (this.readingRepairOrderMessages[messageKey]) return
      this.readingRepairOrderMessages[messageKey] = true
      let shouldRestoreNotification = false
      try {
        await MessageManagement.markMessageAsRead({ id: messageId })
      } catch (error) {
        this.$message.error('标记工单消息已读失败，请重试')
        shouldRestoreNotification = true
      } finally {
        delete this.readingRepairOrderMessages[messageKey]
        if (shouldRestoreNotification && !this.suppressRepairOrderReadOnClose) {
          this.$nextTick(() => this.handleRepairOrderMessage(message))
        }
      }
    },
    /**
     * 播放提示音并将工单内容加入浏览器语音队列，连续消息按接收顺序逐条播报。
     * @param {string} content 需要语音播报的中文提醒内容。
     * @returns {void}
     */
    playRepairOrderVoice(content) {
      this.playBeep()
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return
      const utterance = new window.SpeechSynthesisUtterance(content)
      utterance.lang = 'zh-CN'
      utterance.rate = 1
      window.speechSynthesis.speak(utterance)
    },
    /**
     * 使用 Web Audio API 播放短促提示音；不支持或受限时静默降级。
     * @returns {void}
     */
    playBeep() {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      try {
        this.audioContext = this.audioContext || new AudioContext()
        const oscillator = this.audioContext.createOscillator()
        const gain = this.audioContext.createGain()
        oscillator.frequency.value = 880
        gain.gain.setValueAtTime(0.15, this.audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.18)
        oscillator.connect(gain)
        gain.connect(this.audioContext.destination)
        oscillator.start()
        oscillator.stop(this.audioContext.currentTime + 0.18)
      } catch (error) {
        // 浏览器禁止自动播放时静默降级，不影响消息弹框
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$base-sidebar-width});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px);
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>

<style lang="scss">
.repair-order-notice {
  width: 420px;

  .el-notification__group {
    margin-right: 36px;
  }

  .el-notification__closeBtn {
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    color: #606266;
    font-size: 22px;
    cursor: pointer;
  }
}

@media (max-width: 520px) {
  .repair-order-notice {
    width: calc(100vw - 32px);
  }
}
</style>
