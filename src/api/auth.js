import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 根据url地址携带的参数获取用户的token
export function authAuth(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/auth/auth`,
        method: 'get',
        params
    })
  }