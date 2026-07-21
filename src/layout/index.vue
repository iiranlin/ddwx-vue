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

const SSE_EVENT_CACHE_KEY = 'repair-order-sse-event-ids'

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
      audioContext: null
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
    },
    /**
     * 判断当前登录用户是否包含维修人员身份。
     * 身份数据同时兼容字符串编码和包含 userIdentity 字段的对象结构。
     * @returns {boolean} 具备 REPAIR 身份时返回 true，否则返回 false。
     */
    canReceiveRepairOrder() {
      return (this.$store.getters.sysUserIdentitys || []).some(item => {
        return (typeof item === 'string' ? item : item && item.userIdentity) === 'REPAIR'
      })
    }
  },
  watch: {
    canReceiveRepairOrder: {
      immediate: true,
      /**
       * 根据维修身份变化动态维护工单 SSE 连接。
       * 首次进入页面时立即执行，具备维修身份则连接，否则主动断开。
       * @param {boolean} canReceive 当前用户是否可以接收维修工单通知。
       * @returns {void}
       */
      handler(canReceive) {
        if (canReceive) {
          this.startRepairOrderSse()
        } else {
          this.stopRepairOrderSse()
        }
      }
    }
  },
  /**
   * 布局组件销毁前停止 SSE 连接并关闭音频上下文，避免资源泄漏。
   * @returns {void}
   */
  beforeDestroy() {
    this.stopRepairOrderSse()
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
     * 处理新维修工单事件：去重、弹出通知、播放语音并通知工单页面刷新。
     * @param {Object} message 服务端推送的工单事件数据。
     * @returns {void}
     */
    handleRepairOrderMessage(message) {
      const eventId = message.eventId || message.orderId
      if (eventId && this.hasHandledRepairOrderEvent(eventId)) return
      if (eventId) this.rememberRepairOrderEvent(eventId)

      const siteName = message.faultSiteName || message.siteName || '当前场所'
      const content = `${siteName}有新的维修工单`
      this.$notify({
        title: '新工单提醒',
        message: content,
        type: 'warning',
        duration: 15000,
        position: 'top-right'
      })
      this.playRepairOrderVoice(content)
      this.$root.$emit('repair-order-created', message)
    },
    /**
     * 判断当前会话是否已经处理过指定工单事件，避免重复提醒。
     * @param {string|number} eventId SSE 事件编号或工单编号。
     * @returns {boolean} 已处理返回 true，否则返回 false。
     */
    hasHandledRepairOrderEvent(eventId) {
      try {
        const ids = JSON.parse(sessionStorage.getItem(SSE_EVENT_CACHE_KEY) || '[]')
        return ids.includes(String(eventId))
      } catch (error) {
        return false
      }
    },
    /**
     * 将已处理事件编号写入会话缓存，并仅保留最近 100 条记录。
     * @param {string|number} eventId SSE 事件编号或工单编号。
     * @returns {void}
     */
    rememberRepairOrderEvent(eventId) {
      let ids = []
      try {
        ids = JSON.parse(sessionStorage.getItem(SSE_EVENT_CACHE_KEY) || '[]')
      } catch (error) {
        ids = []
      }
      ids.push(String(eventId))
      sessionStorage.setItem(SSE_EVENT_CACHE_KEY, JSON.stringify(ids.slice(-100)))
    },
    /**
     * 播放提示音并调用浏览器语音合成功能播报新工单内容。
     * @param {string} content 需要语音播报的中文提醒内容。
     * @returns {void}
     */
    playRepairOrderVoice(content) {
      this.playBeep()
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return
      window.speechSynthesis.cancel()
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
