<template>
  <div class="sso-container" role="status" aria-live="polite">
    <div v-if="status === 'verifying'" class="app-loading-wrap" aria-label="正在登录，请稍候">
      <svg aria-hidden="true" t="1643094900008" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="723" width="40" height="40"><path d="M0.308053 882.346667A132.693333 132.693333 0 0 0 128.308053 1024h768a132.693333 132.693333 0 0 0 128-141.653333V360.96H0.308053z m716.8-307.626667a34.986667 34.986667 0 0 1-4.693333-47.786667 27.733333 27.733333 0 0 1 42.666667-5.546666l128 117.76a24.746667 24.746667 0 0 1 12.8 23.893333 189.013333 189.013333 0 0 1-8.106667 29.44l-128 136.106667a28.16 28.16 0 0 1-42.666667 0 34.56 34.56 0 0 1 0-47.786667l102.4-108.373333z m-298.666666 208.213333l128-256a29.013333 29.013333 0 0 1 42.666666-14.933333 35.413333 35.413333 0 0 1 12.8 47.786667l-128 256a36.693333 36.693333 0 0 1-25.6 18.346666 22.186667 22.186667 0 0 1-17.493333-5.546666 37.12 37.12 0 0 1-12.8-45.653334z m-277.333334-147.626666l128-117.76a27.733333 27.733333 0 0 1 42.666667 3.84 36.693333 36.693333 0 0 1 0 42.666666l-4.693333 5.546667-102.4 93.866667 102.4 108.8a34.56 34.56 0 0 1 4.693333 42.666666l-4.693333 5.546667a29.013333 29.013333 0 0 1-42.666667 0l-128-136.533333a36.693333 36.693333 0 0 1-8.106667-30.293334c0-3.413333 3.413333-8.96 12.8-18.346666zM896.308053 0H128.308053a132.693333 132.693333 0 0 0-128 141.653333v142.08h1024V141.653333A131.84 131.84 0 0 0 896.308053 0zM179.508053 189.866667h-17.92A33.28 33.28 0 0 1 128.308053 156.16V128a33.28 33.28 0 0 1 33.28-33.706667h17.92A33.706667 33.706667 0 0 1 213.641387 128v28.586667a33.706667 33.706667 0 0 1-34.133334 33.28z m170.666667 0h-17.066667a33.706667 33.706667 0 0 1-34.133333-33.706667V128a33.706667 33.706667 0 0 1 34.133333-34.133333h17.92A33.28 33.28 0 0 1 384.308053 128v28.586667a33.28 33.28 0 0 1-33.28 33.28z m170.666667 0h-17.92a33.28 33.28 0 0 1-33.28-33.706667V128a33.28 33.28 0 0 1 33.28-33.706667h17.92A33.28 33.28 0 0 1 554.97472 128v28.586667a33.28 33.28 0 0 1-34.56 33.28z" p-id="724" fill="#1890ff" /></svg>
      <div class="app-loading-dots" aria-hidden="true">
        <span class="dot"><i /><i /><i /><i /></span>
      </div>
      <div class="app-loading-title">BasePlatform</div>
    </div>
    <div v-else class="login-error">
      <i class="el-icon-warning-outline" aria-hidden="true" />
      <h3>登录失败</h3>
      <p>{{ errorMessage }}</p>
      <el-button type="primary" @click="handleRetry">重新尝试</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SSO',
  data() {
    return {
      status: 'verifying',
      errorMessage: '',
      idToken: '',
      redirect: '/'
    }
  },
  created() {
    this.redirect = this.$route.query.redirect || '/'
    this.idToken = this.$route.query.id_token || this.$route.query.username
  },
  mounted() {
    this.initSSOLogin()
  },
  methods: {
    /**
     * 功能：清理原登录身份并验证 URL 凭证，成功后立即跳转，失败时展示错误。
     * 参数：无；凭证和跳转目标分别读取组件的 idToken 和 redirect。
     * 使用：页面 mounted 或点击重试时调用 this.initSSOLogin()。
     */
    async initSSOLogin() {
      if (!this.idToken) {
        this.status = 'error'
        this.errorMessage = '未检测到合法的 SSO 令牌参数，请返回重新授权或联系管理员。'
        return
      }

      this.status = 'verifying'
      this.errorMessage = ''

      try {
        await this.$store.dispatch('LogOut')
        await this.$store.dispatch('UrlLogin', this.idToken)
        this.$router.push({ path: this.redirect }).catch(() => {})
      } catch (error) {
        console.error('SSO 统一认证登录失败:', error)
        this.status = 'error'
        this.errorMessage = (error && (error.msg || error.message)) || '身份凭证无效，请联系管理员或重新授权。'
      }
    },
    /**
     * 功能：重新执行登录验证。
     * 参数：无。
     * 使用：由“重新尝试”按钮的 click 事件调用。
     */
    handleRetry() {
      this.initSSOLogin()
    }
  }
}
</script>

<style scoped lang="scss">
.sso-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f7f9;
}

.app-loading-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  transform: translate3d(-50%, -50%, 0);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.app-loading-title {
  margin-top: 30px;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.85);
}

.dot {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 48px;
  margin-top: 30px;
  transform: rotate(45deg);
  box-sizing: border-box;
  animation: ssoRotate 1.2s infinite linear;

  i {
    position: absolute;
    display: block;
    width: 20px;
    height: 20px;
    background: #0065cc;
    border-radius: 100%;
    opacity: 0.3;
    transform: scale(0.75);
    animation: ssoSpinMove 1s infinite linear alternate;
    transform-origin: 50% 50%;
  }

  i:nth-child(1) {
    top: 0;
    left: 0;
  }

  i:nth-child(2) {
    top: 0;
    right: 0;
    animation-delay: 0.4s;
  }

  i:nth-child(3) {
    right: 0;
    bottom: 0;
    animation-delay: 0.8s;
  }

  i:nth-child(4) {
    bottom: 0;
    left: 0;
    animation-delay: 1.2s;
  }
}

@keyframes ssoRotate {
  to {
    transform: rotate(405deg);
  }
}

@keyframes ssoSpinMove {
  to {
    opacity: 1;
  }
}

html[data-theme='dark'] .sso-container {
  background: #2c344a;

  .app-loading-title {
    color: rgba(255, 255, 255, 0.85);
  }
}

.login-error {
  max-width: 480px;
  padding: 24px;
  text-align: center;

  i {
    font-size: 36px;
    color: #f56c6c;
  }

  p {
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
  }

  h3 {
    color: #303133;
  }
}
</style>
