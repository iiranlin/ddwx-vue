import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;
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


