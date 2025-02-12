import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

export function getReportToken() {
  return request({
    url: `${VUE_APP_BASE_prefix}/report/getReportToken`,
    method: 'get',
  })
}