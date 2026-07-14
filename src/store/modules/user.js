import { login, logout, info,loginByAmlbcookie } from '@/api/login'
import { authAuth } from '@/api/auth'

import { getToken, setToken, removeToken, setCookie } from '@/utils/auth'
import md5 from "js-md5";

const user = {
    state: {
        token: getToken(),
        id:'',
        name: '',
        realName: '',
        unitName:"",
        unitCode:"",
        deptName:"",
        deptId:"",
        deptCode:'',
        avatar: '',
        roles: false,
        rank:'',
        userCode:'',
        phone:'',
        sysUserIdentitys: [],
        permissions: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_ID: (state, id) => {
            state.id = id
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
        SET_DEPT_CODE: (state, deptCode) => {
            state.deptCode = deptCode
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_RANK: (state, rank) => {
            state.rank = rank
        },
        SET_USER_CODE: (state, userCode) => {
            state.userCode = userCode
        },
        SET_USER_PHONE: (state, userPhone) => {
            state.phone = userPhone
        },
        SET_SYS_USER_IDENTITYS: (state, sysUserIdentitys) => {
            state.sysUserIdentitys = Array.isArray(sysUserIdentitys) ? sysUserIdentitys : []
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        }
    },

    actions: {
        //url登录
        UrlLogin({ commit },id_token){
            return new Promise((resolve, reject) => {
                authAuth({id_token:id_token}).then(res => {
                    console.log(res)
                  setToken(res.data.token)
                  commit('SET_TOKEN', res.data.token)
                  resolve(res)
                }).catch(error => {
                  reject(error)
                })
            })
        },

        // 正常登录
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
                        commit('SET_ID', user.id)
                        commit('SET_NAME', user.username)
                        commit('SET_UNIT_NAME',user.unitName)
                        commit('SET_UNIT_CODE',user.unitCode)
                        commit('SET_DEPT_NAME',user.deptName)
                        commit('SET_DEPT_ID',user.deptId)
                        commit('SET_DEPT_CODE',user.deptCode)
                        commit('SET_REAL_NAME', user.realName)
                        commit('SET_RANK', user.rank)
                        commit('SET_USER_CODE', user.userCode)
                        commit('SET_USER_PHONE', user.phone)
                        commit('SET_SYS_USER_IDENTITYS', user.sysUserIdentitys)
                        
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

        // 统一身份认证获取token
        GetInfoByAmlbcookie({ commit, state },iPlanetDirectoryPro) {
            return new Promise((resolve, reject) => {
                loginByAmlbcookie({id_token:iPlanetDirectoryPro}).then(res => {
                    setToken(res.data.token)
                    commit('SET_TOKEN', res.data.token)
                    resolve(res)
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
                commit('SET_SYS_USER_IDENTITYS', [])
                removeToken()
                resolve()
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_SYS_USER_IDENTITYS', [])
                removeToken()
                resolve()
            })
        }
    }
}

export default user
