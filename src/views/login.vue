<template>
  <div class="login-app">
    <!-- <div id="loginBg">
			<div id="lottieBg">
				<lottie :options="deraultOptions" id="lottieBg-lottie" :height="loginW" :width="loginW"/>
			</div>
		</div> -->
    <div class="test-title">{{ testTitle }}</div>
    <div id="loginBg">
      <!-- <img
        src="../assets/images/bg.png"
      ></img> -->
    </div>
    <!-- <div style="position:absolute;top:30px;color:red;z-index: 10;right: 110px;font-weight: bold;font-size: 24px;">本系统为测试系统，均为测试数据</div> -->
    <div class="login-right-box">
      <div class="login-right-box-title">
        <img src="../assets/logo/StationLogo.svg" alt="" class="logo">
        <div class="right-title">
          <h2 class="title-h2">机关维修调度系统</h2>
          <!-- <p class="title-p">中国铁路广州局集团有限公司</p> -->
        </div>
      </div>
     
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <!--<el-form-item prop="unitId">-->
        <!--  <el-select-->
        <!--    v-model="loginForm.unitId"-->
        <!--    placeholder="请选择单位"-->
        <!--    style="width: 100%"-->
        <!--  >-->
        <!--    <el-option-->
        <!--      v-for="item in unitList"-->
        <!--      :key="item.id"-->
        <!--      :label="item.unitName"-->
        <!--      :value="item.id"-->
        <!--      style="width: 100%; text-align: center"-->
        <!--    >-->
        <!--    </el-option>-->
        <!--  </el-select>-->
        <!--</el-form-item>-->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
          >
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            />
          </el-input>
          <svg
            @click="showPwd"
            v-show="passwordType"
            focusable="false"
            class="el-input_showPwd"
            data-icon="eye"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
          >
            <path
              d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"
            ></path>
          </svg>
          <svg
            @click="showPwd"
            v-show="!passwordType"
            focusable="false"
            class="el-input_showPwd"
            data-icon="eye-invisible"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
          >
            <path
              d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"
            ></path>
            <path
              d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"
            ></path>
          </svg>
        </el-form-item>
        <el-form-item prop="checkCode">
          <el-input
            v-model="loginForm.checkCode"
            type="text"
            auto-complete="off"
            placeholder="验证码"
            @keyup.enter.native="handleLogin"
            class="login-code"
          >
          </el-input>
          <img
            style="width: 115px; height: 40px; float: left; margin-left: 20px"
            :src="verificationCode"
            @click="getVerificationCode"
            alt=""
          />
        </el-form-item>
        <el-checkbox
          v-model="loginForm.rememberMe"
          style="margin: 0px 0px 25px 0px"
        >记住密码
        </el-checkbox
        >
        <!-- <el-button type="text" style="float: right;">忘记密码？</el-button> -->
        <el-form-item style="width: 100%">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            class="loginButton"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- </div> -->
    <!--  底部  -->
    <div class="footer">
      <span>技术支持：中国铁道科学研究院集团有限公司电子计算技术研究所</span>
    </div>
    <!-- </div> -->
    <!-- </div> -->
    <update-password
      ref="updatePassword"
      @watchVisible="watchUpdatePasswordClose"
    ></update-password>
  </div>
</template>
<script>
import animationData from './../assets/lottie/data.json'
import { getCookie, setCookie, removeCookie } from '@/utils/auth'
import { getVerificationCode, getList } from '@/api/login'
import { generateUUID } from '@/utils'
import UpdatePassword from '@/components/UpdatePassword'

// animationData.assets.forEach((item) => {
//   item.u = ''
//   if (item.w && item.h) {
//     item.p = require(`@/assets/lottie/images/${item.p}`)
//   }
// })
export default {
  name: 'Login',
  components: {
    UpdatePassword
  },
  data() {
    return {

      loginForm: {
        username: '',
        password: '',
        // unitId: '',
        checkCode: '',
        checkKey: '',
        rememberMe: true
      },
      deraultOptions: {
        animationData: animationData,
        renderer: 'svg',
        loop: true,
        autoplay: true
      },
      loginW: 1416,
      loginRules: {
        // unitId: [{ required: true, trigger: 'blur', message: '请选择单位' }],
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' }
        ],
        checkCode: [
          { required: true, trigger: 'blur', message: '请输入验证码' }
        ]
      },
      loading: false,
      redirect: undefined,
      patternSwitch: true,
      passwordType: 'password',
      verificationCode: '',
      unitList: [],
      testTitle: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    // 'loginForm.username': {
    //   handler: function(newUsername) {
    //     this.loginForm.username = newUsername.toLocaleUpperCase()
    //   }
    // }
  },
  created() {
    this.testTitle = process.env.VUE_APP_TITLE
    // const unitId = getCookie('unitId')
    const username = getCookie('username')
    const password = getCookie('password')
    this.loginForm = {
      // unitId: unitId === undefined ? this.loginForm.unitId : unitId,
      username: username === undefined ? this.loginForm.username : username,
      password: password === undefined ? this.loginForm.password : password,
      rememberMe: true,
      checkCode: '',
      checkKey: ''
    }
    this.getVerificationCode()
    // this.getList()
  },
  mounted() {
    let vdo_w = 2560
    let vdo_h = 1440
    // var box_h = document.getElementById('loginBg').clientHeight
    // let box_w = (vdo_w / vdo_h) * box_h
    // document.getElementById('loginBg').style.width = box_w + 'px'

    // 	this.loginW = document.getElementById('loginBg').clientWidth;
    // let lottieBgLottie = document.getElementById('lottieBg-lottie');
    // lottieBgLottie.style.width = this.loginW + 'px';
    // lottieBgLottie.style.height = this.loginW + 'px';
    // window.onresize = () => {
    // 	if (document.getElementById('loginBg')) {
    // 		this.loginW = document.getElementById('loginBg').clientWidth;
    // 		let lottieBgLottie = document.getElementById('lottieBg-lottie');
    // 		lottieBgLottie.style.width = this.loginW + 'px';
    // 		lottieBgLottie.style.height = this.loginW + 'px';
    // 	}
    // }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            setCookie('username', this.loginForm.username)
            setCookie('password', this.loginForm.password)
            // setCookie('unitId', this.loginForm.unitId)
          } else {
            removeCookie('username')
            removeCookie('password')
            // removeCookie('unitId')
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then((res) => {
              this.loading = false

              if (res.code !== 10001) {
                this.$router
                  .push({ path: this.redirect || '/' })
                  .catch(() => {
                  })
              } else {
                // 为初始密码,弹窗提示进行更改
                this.$refs.updatePassword.initUpdatePassword(true, true)
              }
            })
            .catch(() => {
              this.getVerificationCode()
              this.loading = false
            })
        }
      })
    },
    /**获取单位 */
    getList() {
      getList().then((res) => {
        this.unitList = res.data
      })
    },
    /**获取验证码*/
    getVerificationCode() {
      let randomKey = generateUUID(8, 16)
      this.loginForm.checkKey = randomKey
      getVerificationCode(randomKey).then((res) => {
        this.verificationCode = res.data
      })
    },
    pattern() {
      this.patternSwitch = !this.patternSwitch
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    watchUpdatePasswordClose() {
      this.getVerificationCode()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

.test-title {
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translate(-50%, -50%);;
  font-size: 40px;
  color: red;
  z-index: 999;
}

.login-app {
  position: relative;
  width: 100%;
  min-width: 1366px;
  height: 100%;
  overflow: none;
  // background: url(~@/assets/logo/login.jpg) no-repeat;
  background-size: 1220px 800px;
  // background-position-y: 108px;
  // background-position-x: 104px;
  // background-color: #185ec1;
}

#loginLogo {
  position: relative;
  top: 13px;
  left: 0;
  margin-right: 10px;
  width: 52px;
  height: 59px;
}

#loginBg {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background: url('../assets/images/bg.png') center/cover no-repeat fixed;
}

// #loginBg::after {
//   content: "";
//   position: absolute;
//   right: -1px;
//   top: 0;
//   height: 100%;
//   width: 10%;
//   background-image: linear-gradient(90deg, #185ec100 0%, #185ec1 100%);
// }

#loginBg video {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.login-right-box {
  position: absolute;
  top: 8.4%;
  right: 6.2%;
  width: 400px;
  height: 630px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 8px;
  z-index: 6;

  .login-right-box-title {
    display: flex;
  }

  .logo {
    margin-top: 85px;
    width: 105px;
    height: 50px;
  }

  .right-title {
    .title-h2 {
      margin-top: 90px;
      line-height: 80px;
      font-size: 30px;
      text-align: center;
    }

    .title-p {
      margin-top: 14px;
      color: #263e62;
      font-size: 14px;
    }
  }
// .login-right-box .login-form .el-form-item
  .login-form {
    width: 336px;
    border-radius: 6px;
    margin-left: 33px;
    background: #ffffff;

    .el-form-item {
      // margin-bottom: 30px;
    }

    .el-select {
      .el-input__inner {
        text-align: center;
        height: 44px;
      }
    }

    // .el-select.el-input__inner{
    //   text-align: center;
    // }
    .el-input {
      height: 44px;

      input {
        // width: 336px;
        height: 44px;
      }
    }

    .input-icon {
      height: 44px;
      width: 14px;
      margin-left: 2px;
    }

    .login-code {
      width: 200px;
      float: left;
    }

    .loginButton {
      // margin-top: 10px;
      width: 336px;
      height: 30px;
      border-radius: 5px;
    }

    .loading_mode {
      line-height: 50px;
      text-align: center;
      font-size: 12px;
      color: #00000073;

      &:before,
      &:after {
        display: inline-block;
        padding-bottom: 8px;
        width: 135px;
        border-top: 1px solid #d1d1d1;
        transform: translateY(50%);
        content: "";
      }

      span {
        padding: 0 25px;
      }
    }

    .loading_mode_svg {
      display: flex;
      // justify-content: space-evenly;
      justify-content: space-between;
      color: #888;

      span {
        cursor: pointer;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }
}

.el-input_showPwd {
  position: absolute;
  top: 16px;
  right: 12px;
  color: #818286;
  cursor: pointer;

  &:hover {
    color: #2f3031;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  line-height: 38px;
  text-align: center;
  color: #192331;
  font-size: 13px;
  background-color: rgba(255, 255, 255, 0.34);
}

@media screen and (max-width: 1440px) {
  .test-title {
    position: absolute;
    left: 50%;
    top: 5%;
    transform: translate(-50%, -50%);;
    font-size: 30px;
    color: red;
    z-index: 999;
  }
  .login-app {
    background-size: 970px 634px;
    overflow: none;
    // background-position-y: 40px;
    // background-position-x: -21px;
  }
  #loginBg {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
  }
  // #loginBg::after {
  //   content: "";
  //   position: absolute;
  //   right: -1px;
  //   top: 0;
  //   height: 100%;
  //   width: 10%;
  //   background-image: linear-gradient(90deg, #185ec100 0%, #185ec1 100%);
  // }
  #loginBg video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  #loginLogo {
    position: relative;
    top: 13px;
    left: 0;
    margin-right: 10px;
    width: 52px;
    height: 59px;
  }

  .login-right-box {
    width: 340px;
    height: 570px;

    .logo {
      width: 87px;
      height: 42px;
    }

    .right-title {
      .title-h2 {
        margin-top: 75px;
        line-height: 68px;
        font-size: 24px;
      }

      .title-p {
        margin-top: 14px;
        color: #263e62;
        font-size: 14px;
      }
    }

    .login-form {
      width: 290px;
      border-radius: 6px;
      margin-left: 24px;
      background: #ffffff;

      .el-form-item {
        // margin-bottom: 30px;
      }

      .el-input {
        height: 44px;

        input {
          // width: 336px;
          height: 44px;
        }
      }

      .input-icon {
        height: 44px;
        width: 14px;
        margin-left: 2px;
      }

      .login-code {
        width: 154px;
        float: left;
      }

      .loginButton {
        width: 290px;
        height: 50px;
        border-radius: 5px;
      }

      .loading_mode {
        line-height: 50px;
        text-align: center;
        font-size: 12px;
        color: #00000073;

        &:before,
        &:after {
          display: inline-block;
          padding-bottom: 8px;
          width: 135px;
          border-top: 1px solid #d1d1d1;
          transform: translateY(50%);
          content: "";
        }

        span {
          padding: 0 25px;
        }
      }

      .loading_mode_svg {
        display: flex;
        // justify-content: space-evenly;
        justify-content: space-between;
        color: #888;

        span {
          cursor: pointer;

          &:hover {
            color: #1890ff;
          }
        }
      }
    }
  }
  .footer {
    line-height: 30px;
    font-size: 12px;
  }
}
</style>
