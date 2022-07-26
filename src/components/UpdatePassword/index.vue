<template>
  <!--用户修改密码对话框-->
  <div class="update-password">
    <el-dialog
      v-loading="updatePasswordLoading"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="40%">
      <el-row slot="title">
        <span>请修改初始密码</span>
      </el-row>
      <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" label-width="100px">
        <el-form-item label="旧密码:" prop="oldPass" v-if="!pwdInitStatus">
          <el-input size="small" style="width: 80%" type="password" clearable v-model.trim="passwordForm.oldPass"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="pass">
          <el-input size="small" style="width: 80%" type="password" clearable v-model.trim="passwordForm.pass"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop="checkPass">
          <el-input size="small" style="width: 80%" type="password" clearable v-model.trim="passwordForm.checkPass"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <el-row slot="footer">
        <el-button size="small" type="primary" @click="updatePassword">提交</el-button>
        <el-button size="small" @click="closeUpdatePassword">关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>

import md5 from "js-md5";
import { changePassword, restInitPwd } from '@/api/login'
import {removeToken} from "@/utils/auth";

export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.passwordForm.oldPass !== '') {
          if (value === this.passwordForm.oldPass) {
            callback(new Error('旧密码和新密码不能相同'))
          }
        }
        if (this.passwordForm.checkPass !== '') {
          this.$refs.passwordForm.validateField('checkPass')
        }
        callback()
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    return {
      updatePasswordLoading: false,
      visible: false,
      passwordForm: {
        oldPass: '',
        pass: '',
        checkPass: '',
      },
      passwordRules: {
        oldPass: [
          {required: true, message: '请输入旧密码', trigger: 'blur'}
        ],
        pass: [
          {required: true, validator: validatePass, trigger: 'blur'},
          {
            pattern: /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9])/,
            message: '密码由大小写字母+特殊字符+数字组成', trigger: 'blur'
          },
          {min: 8, max: 20, message: '请设置8-20位密码', trigger: 'blur'}
        ],
        checkPass: [
          {required: true, validator: validatePass2, trigger: 'blur'}
        ]
      },
      // true表示登陆初始密码检测,false为登录后修改密码
      pwdInitStatus: true,
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.$refs.passwordForm.resetFields()
        if (this.pwdInitStatus) {
          this.$emit('watchVisible', newVal)
        }
      }
    },
    pwdInitStatus(newVal) {
      newVal ? this.passwordRules.oldPass = [] :
        this.passwordRules.oldPass = [{
          required: true,
          message: '请输入旧密码',
          trigger: 'blur'
        }]
    }
  },
  methods: {
    /**针对初始密码进行更新*/
    updatePassword() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          if (this.pwdInitStatus) {
            // 初始密码修改
            const password = md5(this.passwordForm.pass)
            restInitPwd({password, pwdInitStatus: this.pwdInitStatus}).then(res => {
              if (res.code === 0) {
                this.$modal.msgSuccess('重置密码成功,请重新登陆');
                this.visible = false
              }
            })
          } else {
            changePassword({
              oldPass: md5(this.passwordForm.oldPass),
              password: md5(this.passwordForm.pass),
              pwdInitStatus: this.pwdInitStatus
            }).then(res => {
              if (res.code === 0) {
                this.$modal.msgSuccess('修改密码成功');
                this.visible = false
              }
            })
          }
        }
      })
    },
    /**关闭修改初始密码对话框*/
    closeUpdatePassword() {
      this.visible = false
      if (this.pwdInitStatus) {
        this.$store.commit('SET_TOKEN', '')
        this.$store.commit('SET_ROLES', null)
        this.$store.commit('SET_PERMISSIONS', [])
        removeToken()
      }
    },
    /**
     * 重置密码弹窗初始化
     * @param visible 可见,传true
     * @param pwdInitStatus true表示登陆初始密码检测,false为登录后修改密码
     */
    initUpdatePassword(visible, pwdInitStatus) {
      this.visible = visible
      this.pwdInitStatus = pwdInitStatus
    }
  }
}
</script>

<style scoped>
.update-password {
  margin: auto;
}
</style>
