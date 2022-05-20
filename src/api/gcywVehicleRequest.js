import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

//我的用车单-分页
export function gcywVehicleRequestListVehiclePage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywVehicleRequest/listVehiclePage`,
    method: 'get',
    params
  })
}
//发起审批
export function activitiStart(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywVehicleRequest/activiti/start`,
    method: 'post',
    data
  })
}

//审批通过
export function activitiComplete(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywVehicleRequest/activiti/complete`,
    method: 'post',
    data
  })
}
//审批拒绝
export function activitiReject(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywVehicleRequest/activiti/reject`,
    method: 'post',
    data
  })
}