import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

//常用地址-分页
export function getAvailableDriver(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/gcjcDriverClass/getAvailableDriver`,
      method: 'get',
      params
    })
}