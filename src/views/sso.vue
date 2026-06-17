<template>
  <div class="sso-container">
    <!-- 动态背景网格与粒子微光 -->
    <div class="sso-bg-glow"></div>
    <div class="sso-bg-grid"></div>

    <!-- 核心过渡卡片 -->
    <div class="sso-card" :class="status">
      <!-- 统一身份认证徽标 -->
      <div class="logo-area">
        <img src="../assets/logo/StationLogo.svg" alt="Logo" class="sso-logo" />
        <span class="system-title">机关维修系统</span>
      </div>

      <!-- 动画状态区 -->
      <div class="status-anim-wrapper">
        <!-- 1. 验证中：炫酷双环雷达脉冲 -->
        <div v-if="status === 'verifying'" class="pulse-loader">
          <div class="circle Circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
          <div class="center-dot">
            <svg class="lock-svg" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          </div>
        </div>

        <!-- 2. 成功：精美绿色勾选圈 -->
        <div v-else-if="status === 'success'" class="success-mark">
          <div class="success-circle">
            <svg class="check-svg" viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
        </div>

        <!-- 3. 失败：警示红色感叹号 -->
        <div v-else-if="status === 'error'" class="error-mark">
          <div class="error-circle">
            <svg class="cross-svg" viewBox="0 0 52 52">
              <circle class="cross-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="cross-line-1" fill="none" d="M16 16 36 36"/>
              <path class="cross-line-2" fill="none" d="M36 16 16 36"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 文字与交互区 -->
      <div class="info-area">
        <h3 class="status-title">{{ getStatusTitle }}</h3>
        <p class="status-tip">{{ getStatusTip }}</p>

        <!-- 只有在失败时显示的重试/返回按钮 -->
        <div v-if="status === 'error'" class="action-btn-group">
          <button class="btn btn-primary" @click="handleRetry">重新尝试</button>
        </div>
      </div>
    </div>

    <!-- 底部页脚 -->
    <div class="sso-footer">
      <span>技术支持：中国铁道科学研究院集团有限公司电子计算技术研究所</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SSO',
  data() {
    return {
      status: 'verifying', // verifying | success | error
      errorMessage: '',
      idToken: '',
      startTime: 0,
      minDuration: 1200 // 最小过渡动画展示时间(ms)，保证界面流畅性
    }
  },
  computed: {
    getStatusTitle() {
      if (this.status === 'verifying') return '安全认证中'
      if (this.status === 'success') return '认证成功'
      return '认证失败'
    },
    getStatusTip() {
      if (this.status === 'verifying') return '正在验证您的统一身份凭证，请稍候...'
      if (this.status === 'success') return '登录身份验证成功，正在进入系统...'
      return this.errorMessage || '无效的登录凭证或账号权限受限。'
    }
  },
  created() {
    // 提取并保存重定向目标
    this.redirect = this.$route.query.redirect || '/'
    this.idToken = this.$route.query.id_token || this.$route.query.username
  },
  mounted() {
    this.initSSOLogin()
  },
  methods: {
    async initSSOLogin() {
      if (!this.idToken) {
        this.status = 'error'
        this.errorMessage = '未检测到合法的 SSO 令牌参数，请返回重新授权或联系管理员。'
        
        return
      }

      this.status = 'verifying'
      this.startTime = Date.now()

      try {
        // 1. 清理以往的登录凭证，确保是全新登录身份
        await this.$store.dispatch('LogOut')

        // 2. 触发 SSO 接口验证登录
        await this.$store.dispatch('UrlLogin', this.idToken)

        // 3. 登录请求顺利完成，计算已消耗时间，确保动画的最小呈现时长
        const elapsed = Date.now() - this.startTime
        const delay = Math.max(0, this.minDuration - elapsed)

        setTimeout(() => {
          this.status = 'success'
          // 4. 展示成功动效后，优雅延时 800ms 重定向至系统首页
          setTimeout(() => {
            this.$router.push({ path: this.redirect }).catch(() => {})
          }, 1200)
        }, delay)

      } catch (error) {
        console.error('SSO 统一认证登录失败:', error)
        const elapsed = Date.now() - this.startTime
        const delay = Math.max(0, this.minDuration - elapsed)

        setTimeout(() => {
          this.status = 'error'
          this.errorMessage = error.msg || error.message || '身份凭证无效，请联系管理员或重新授权。'
        }, delay)
      }
    },
    handleRetry() {
      this.initSSOLogin()
    },
    goLogin() {
      this.$router.push('/login').catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
.sso-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: radial-gradient(circle at center, #0d1b2a 0%, #080f18 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 渐变流光与粒子微光 */
.sso-bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.15) 0%, rgba(24, 144, 255, 0) 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: glowPulse 8s infinite alternate ease-in-out;
}

/* 精细的高科技感网格背景 */
.sso-bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.15;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 25px 25px;
  background-position: center;
  pointer-events: none;
}

@keyframes glowPulse {
  0% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.9); }
  100% { opacity: 1.2; transform: translate(-50%, -50%) scale(1.1); }
}

/* 玻璃拟态卡片 */
.sso-card {
  position: relative;
  width: 420px;
  padding: 40px 30px;
  background: rgba(16, 28, 48, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.37),
    inset 0 0 16px rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  text-align: center;
  z-index: 10;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: translateY(0);

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(24, 144, 255, 0.2);
  }

  &.success {
    border-color: rgba(46, 204, 113, 0.25);
    background: rgba(10, 32, 22, 0.65);
  }

  &.error {
    border-color: rgba(231, 76, 60, 0.25);
    background: rgba(35, 17, 17, 0.65);
  }
}

/* 系统标识区 */
.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 35px;

  .sso-logo {
    width: 60px;
    height: 32px;
    margin-right: 12px;
  }

  .system-title {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 1.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

/* 状态动画区 */
.status-anim-wrapper {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
}

/* 1. 验证中：炫酷双环雷达脉冲样式 */
.pulse-loader {
  position: relative;
  width: 100px;
  height: 100px;

  .circle {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 2px solid transparent;
    border-radius: 50%;
    animation: rotateAndScale 2s linear infinite;
  }

  .circle-1 {
    border-top-color: #1890ff;
    border-bottom-color: rgba(24, 144, 255, 0.1);
    animation-duration: 1.5s;
  }

  .circle-2 {
    border-right-color: #36cfc9;
    border-left-color: rgba(54, 207, 201, 0.1);
    animation-duration: 2.2s;
    animation-direction: reverse;
  }

  .circle-3 {
    border: 1px dashed rgba(255, 255, 255, 0.15);
    transform: scale(1.2);
    animation: pulseGlow 2s infinite ease-in-out;
  }

  .center-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 44px;
    height: 44px;
    transform: translate(-50%, -50%);
    background: rgba(24, 144, 255, 0.1);
    border: 1px solid rgba(24, 144, 255, 0.3);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: floatDot 3s infinite ease-in-out;

    .lock-svg {
      width: 20px;
      height: 20px;
      fill: #1890ff;
    }
  }
}

@keyframes rotateAndScale {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes pulseGlow {
  0%, 100% { transform: scale(1.1); opacity: 0.3; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

@keyframes floatDot {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.08); background: rgba(24, 144, 255, 0.18); }
}

/* 2. 成功：精美绿色勾选圈样式 */
.success-mark {
  .success-circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #2ecc71;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #2ecc71;
    animation: fillSuccess .4s ease-in-out .4s forwards, scaleSuccess .3s ease-in-out .9s both;
  }

  .checkmark-circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #2ecc71;
    fill: none;
    animation: strokeSuccess 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark-check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    stroke-width: 3;
    stroke: #2ecc71;
    animation: strokeSuccess 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
  }
}

@keyframes strokeSuccess {
  100% { stroke-dashoffset: 0; }
}

@keyframes fillSuccess {
  100% { box-shadow: inset 0px 0px 0px 45px rgba(46, 204, 113, 0.1); }
}

@keyframes scaleSuccess {
  0%, 100% { transform: none; }
  50% { transform: scale3d(1.1, 1.1, 1); }
}

/* 3. 失败：警示红色交叉线样式 */
.error-mark {
  .error-circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #e74c3c;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #e74c3c;
    animation: fillError .4s ease-in-out .4s forwards, scaleSuccess .3s ease-in-out .9s both;
  }

  .cross-circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #e74c3c;
    fill: none;
    animation: strokeSuccess 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .cross-line-1, .cross-line-2 {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    stroke-width: 3;
    stroke: #e74c3c;
  }

  .cross-line-1 {
    animation: strokeSuccess 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
  }

  .cross-line-2 {
    animation: strokeSuccess 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.7s forwards;
  }
}

@keyframes fillError {
  100% { box-shadow: inset 0px 0px 0px 45px rgba(231, 76, 60, 0.1); }
}

/* 信息提示区 */
.info-area {
  .status-title {
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
    margin: 0 0 10px 0;
  }

  .status-tip {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin: 0 0 25px 0;
    padding: 0 10px;
  }
}

/* 按钮组 */
.action-btn-group {
  display: flex;
  gap: 15px;
  justify-content: center;

  .btn {
    padding: 10px 22px;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  .btn-primary {
    background: #1890ff;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.35);

    &:hover {
      background: #40a9ff;
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.5);
    }
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.15);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
    }
  }
}

/* 页脚 */
.sso-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  line-height: 42px;
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
  font-size: 13px;
  background-color: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  letter-spacing: 0.5px;
}
</style>
