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

//选择车辆
export function vehicleInfoGetAvailableCar(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/vehicleInfo/getAvailableCar`,
    method: 'get',
    params
  })
}

//判断车辆是否限行
export function vehicleInfoIsRestriction(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/vehicleInfo/isRestriction`,
    method: 'get',
    params
  })
}

// 根据查询条件获取车辆下拉框
export function getVehicleListAll(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/vehicleInfo/listAll`,
    method: 'get',
    params
  })
}
