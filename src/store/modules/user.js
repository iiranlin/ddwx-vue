import { login, logout, info } from '@/api/login'

import { getToken, setToken, removeToken, setCookie } from '@/utils/auth'
import md5 from "js-md5";

const user = {
    state: {
        token: getToken(),
        name: '',
        realName: '',
        unitName:"",
        unitCode:"",
        deptName:"",
        deptId:"",
        avatar: '',
        roles: false,
        permissions: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_REAL_NAME: (state, realName) => {
            state.realName = realName
        },
        SET_UNIT_NAME: (state, unitName) => {
            state.unitName = unitName
        },
        SET_UNIT_CODE: (state, unitCode) => {
            state.unitCode = unitCode
        },
        SET_DEPT_NAME: (state, deptName) => {
            state.deptName = deptName
        },
        SET_DEPT_ID: (state, deptId) => {
            state.deptId = deptId
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            const password = md5(userInfo.password)
            return new Promise((resolve, reject) => {
                login({ username, password, unitId: username == 'ADMINISTRATOR'? 0 : userInfo.unitId, checkCode: userInfo.checkCode, checkKey: userInfo.checkKey}).then(res => {
                  setToken(res.data.token)
                  commit('SET_TOKEN', res.data.token)
                  resolve(res)
                }).catch(error => {
                  reject(error)
                })
            })
        },
        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                info().then(res => {
                    if (res.code === 0) {
                        commit('SET_ROLES', true);
                        const user = res.data
                            // const avatar = user.avatar == "" ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
                            // if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                            //   commit('SET_ROLES', res.roles)
                        commit('SET_PERMISSIONS', ["*:*:*"])
                            // } else {
                            //   commit('SET_ROLES', ['ROLE_DEFAULT'])
                            // }
                        commit('SET_NAME', user.username)
                        commit('SET_UNIT_NAME',user.unitName)
                        commit('SET_UNIT_CODE',user.unitCode)
                        commit('SET_DEPT_NAME',user.deptName)
                        commit('SET_DEPT_ID',user.deptId)
                        commit('SET_REAL_NAME', user.realName)
                        
                        setCookie("unitCode", user.unitCode);
                        setCookie("phone", user.phone || '');
                            // commit('SET_AVATAR', avatar)
                        resolve(res)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 退出系统
        LogOut({ commit, state }) {
            return new Promise(async(resolve, reject) => {
                // let data = await logout();
                commit('SET_TOKEN', '')
                commit('SET_ROLES', null)
                commit('SET_PERMISSIONS', [])
                removeToken()
                resolve()
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user
