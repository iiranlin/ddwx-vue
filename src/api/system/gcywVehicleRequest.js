import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 用车申请单审批列表-分页
export function gcywVehicleRequestListPage(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywVehicleRequest/listPage`,
    method: 'get',
    params
  })
}

// 新增部门
// export function deptCreate(data) {
//   return request({
//     url: `${VUE_APP_BASE_PREFIX}/dept/create`,
//     method: 'post',
//     data
//   })
// }

