import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

//最近三周用车情况汇总
export function vehicleInfoGetAssignCount(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/vehicleInfo/getAssignCount`,
    method: 'get',
    params
  })
}