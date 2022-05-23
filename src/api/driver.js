import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

//班次字典-班次列表-分页
export function gcjcClassListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcClass/listPage`,
    method: 'get',
    params
  })
}

//班次字典-班次列表-不分页
export function gcjcClassList(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcClass/list`,
    method: 'get',
    params
  })
}

///班次字典-新增班次
export function gcjcClassCreate(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcClass/create`,
    method: 'post',
    data
  })
}

///班次字典-获取班次详细信息
export function gcjcClassDetail(id) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcClass/detail/${id}`,
    method: 'get',
  })
}

//班次字典-修改班次
export function gcjcClassModify(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcClass/modify`,
    method: 'post',
    data
  })
}

//班次字典-删除班次
export function gcjcClassDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcClass/deleteBatch`,
    method: 'post',
    data
  })
}

//车队管理-车队列表-分页
export function gcjcFleetListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcFleet/listPage`,
    method: 'get',
    params
  })
}

//车队管理-新增车队
export function gcjcFleetCreate(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcFleet/create`,
    method: 'post',
    data
  })
}

//车队管理-修改车队
export function gcjcFleetModify(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcFleet/modify`,
    method: 'post',
    data
  })
}

///车队管理-获取车队详细信息
export function gcjcFleetDetail(id) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcFleet/detail/${id}`,
    method: 'get',
  })
}

//车队管理-删除车队
export function gcjcFleetDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcFleet/deleteBatch`,
    method: 'post',
    data
  })
}

//车队管理-获取单位列表
export function getUnitDictList() {
  return request({
    url: `${VUE_APP_BASE_prefix}/unitDict/getList`,
    method: 'get'
  })
}

//司机档案-司机列表-分页
export function gcjcDriverListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriver/listPage`,
    method: 'get',
    params
  })
}

//司机档案-新增司机
export function gcjcDriverCreate(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriver/create`,
    method: 'post',
    data
  })
}

//司机档案-删除司机
export function gcjcDriverDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriver/deleteBatch`,
    method: 'post',
    data
  })
}

///司机档案-获取司机详细信息
export function gcjcDriverDetail(id) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriver/detail/${id}`,
    method: 'get',
  })
}

//司机档案-修改司机
export function gcjcDriverModify(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriver/modify`,
    method: 'post',
    data
  })
}

// 用户列表-部门的全部用户(list)
export function userListAllForDept2List(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/user/listAllForDept2List`,
    method: 'get',
    params
  })
}

// 车队列表-不分页
export function gcjcFleetList(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcFleet/list`,
    method: 'get',
    params
  })
}

// 驾照类型
export function getListByParentDriverLicenseType(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/dict/common/getListByParentCode/DRIVER_LICENSE_TYPE`,
    method: 'get',
    params
  })
}

// 司机类型
export function getListByParentDriverType(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/dict/common/getListByParentCode/DRIVER_TYPE`,
    method: 'get',
    params
  })
}

// 健康状态
export function getListByParentHealthState(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/dict/common/getListByParent/HEALTH_STATE`,
    method: 'get',
    params
  })
}

// 健康码状态
export function getListByParentHealthCode(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/dict/common/getListByParent/HEALTH_CODE`,
    method: 'get',
    params
  })
}

// 疫苗接种
export function getListByParentVaccinationState(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/dict/common/getListByParent/VACCINATION_STATE`,
    method: 'get',
    params
  })
}

//司机控制台-用车申请单列表-分页
export function gcywVehicleRequestListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywVehicleReqAssignmennt/listPage`,
    method: 'get',
    params
  })
}

//司机控制台-接单
export function gcywVehicleRequesTakeOrder(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywVehicleReqAssignmennt/takeOrder`,
    method: 'get',
    params
  })
}

//司机控制台-拒绝
export function gcywVehicleRequesCancelOrder(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywVehicleReqAssignmennt/cancelOrder`,
    method: 'get',
    params
  })
}

//司机控制台-到达提醒
export function gcywVehicleRequesRemind(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywVehicleReqAssignmennt/remind`,
    method: 'get',
    params
  })
}

//司机控制台-出车
export function gcywVehicleRequesDriving(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywVehicleReqAssignmennt/driving`,
    method: 'post',
    data
  })
}

//司机控制台-还车
export function gcywVehicleRequesReturning(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywVehicleReqAssignmennt/returning`,
    method: 'post',
    data
  })
}

//司机值班-司机值班排班记录列表-最近3周
export function gcjcDriverClassListLast3Weeks(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriverClass/listLast3Weeks`,
    method: 'get',
    params
  })
}

//司机值班-司机值班排班记录列表-分页
export function gcjcDriverClassListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriverClass/listPage`,
    method: 'get',
    params
  })
}

//司机值班-司机值班排班记录列表-不分页
export function gcjcDriverClassList(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriverClass/list`,
    method: 'get',
    params
  })
}

//司机值班-新增司机值班排班记录
export function gcjcDriverClassCreate(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriverClass/create`,
    method: 'post',
    data
  })
}

//司机值班-删除司机值班排班记录
export function gcjcDriverClassDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriverClass/deleteBatch`,
    method: 'post',
    data
  })
}

//司机值班-修改司机值班排班记录
export function gcjcDriverClassModify(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDriverClass/modify`,
    method: 'post',
    data
  })
}



