import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 用车信息查询导出地址
export const gcywVehicleRequestExportRequestInfo = `${VUE_APP_BASE_PREFIX}/gcywVehicleRequest/exportRequestInfo`
// 用车评价统计导出地址
export const gcywRequestEvaluateExportList = `${VUE_APP_BASE_PREFIX}/gcywRequestEvaluate/exportList`


// 车辆租赁
export function rentPage(params, roleId) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/vehicleInfo/rentPage`,
        method: 'get',
        params
    })
  }


/**
 * @function getVehicleInfoSelect
 * @description 车辆-下拉框
 * @param params.unitCode { String } 单位
 * @return void
 */
 export function getVehicleInfoSelect(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/vehicleInfo/listAll`,
    method: "get",
    params,
  });
}

/**
 * @function searchCarSelectInfo
 * @description ETC/加油卡-车牌号模糊查询
 * @param params.carNumber  { String } 车牌号
 * @param params.cardType  { String } 查询类型  etc/fuel
 * @return void
 */
 export function searchCarSelectInfo(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/vehicleInfo/card/list`,
    method: "get",
    params,
  });
}

//调度工作台-分页
export function gcywVehicleRequestDispatchList(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywVehicleRequest/dispatchList`,
    method: 'get',
    params
  })
}

//用车信息查询-分页
export function gcywVehicleRequestDispatchListInfo(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywVehicleRequest/dispatchQueryInfo`,
    method: 'get',
    params
  })
}


//用车单日志列表
export function gcywVehicleRequestLogList(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywVehicleRequestLog/list`,
    method: 'get',
    params
  })
}

/**
 * @function getAllAvailableCar
 * @description 选择车辆 根据unitCode 和部门 id（deptId）
 * @param params.unitCode { String } 单位编码
 * @param params.deptId { Sting } 部门id
 * @return void
 */
export function getAllAvailableCar(params ={}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/vehicleInfo/getAvailableCar`,
    method: 'get',
    params
  })
}

/**
 * 
 * 我的用车单-评价
 */
export function gcywRequestEvaluateSave(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywRequestEvaluate/save`,
    method: 'POST',
    data
  })
}

/**
 * 
 * 用车评价统计-报表数据
 */
 export function gcywRequestEvaluateAnalysis(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywRequestEvaluate/analysis`,
    method: 'GET',
    params
  })
}
/**
 * 
 * 用车评价统计-分页
 */
 export function gcywRequestEvaluateList(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywRequestEvaluate/list`,
    method: 'GET',
    params
  })
}