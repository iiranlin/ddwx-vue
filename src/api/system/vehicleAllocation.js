import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

//车辆分配-分页(usageUnitCode)
export function vehicleInfoUsagelistPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/vehicleInfo/usagelistPage`,
    method: 'get',
    params
  })
}

//车辆分配-修改
export function vehicleInfoUpdGVC(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/vehicleInfo/updGVC`,
    method: 'post',
    data
  })
}

//车辆分配-取消
export function vehicleInfoRemoveUsages(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/vehicleInfo/removeUsages`,
    method: 'post',
    data
  })
}
