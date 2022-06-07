import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 登录方法
export function login(data) {

  return request({
    url: `${VUE_APP_BASE_PREFIX}/auth/login`,
    method: 'post',
    data
  })
}

// 用户信息
export function info() {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/auth/info`,
    method: 'get',
  })
}

export function logout() {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/auth/logout`,
    method: 'get',
  })
}

export function getVerificationCode(randomKey) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/auth/randomImage/` + randomKey,
    method: 'get',
  })
}

/**
 * 修改初始密码
 * @param data
 * @returns {*}
 */
export function restInitPwd(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/auth/restPwd`,
    method: 'post',
    data
  })
}

/**
 * 登陆后修改密码
 * @param data
 * @returns {*}
 */
export function changePassword(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/auth/changePassword`,
    method: 'post',
    data
  })
}

export function getList() {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/unitDict/getList`,
    method: 'get',
  })
}

