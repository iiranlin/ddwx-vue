import request from '@/utils/request'

let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER

// 获取登录日志分页数据
export function getLoginLogByPage(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/log/login/list`,
    method: 'get',
    params
  })
}
