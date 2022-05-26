import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

export function getComeUnitList(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywComeUnit/listAll`,
    method: 'get',
    params
  })
}
