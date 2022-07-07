import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

export function enumUrl(params, url) {
  return request({
    url: `${VUE_APP_BASE_prefix}/${url}`,
    method: 'get',
    params
  })
}