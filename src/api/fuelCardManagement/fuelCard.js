import request from "@/utils/request";
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

/**
 * @function getFuelCardListPage
 * @description 获取加油卡 分页列表
 * @param params.unitCode { String } 单位
 * @param params.isMcard { Sting } "加油卡类型 是否母卡 0-是（主卡） 1-否（副卡）",
 * @param params.carNumber { Sting } "车牌号",
 * @return void
 */
export function getFuelCardListPage(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcFuelCard/listPage`,
    method: "get",
    params,
  });
}


/**
 * @function createFuelCard
 * @description 新建 新增 加油卡
 * @param params.balance { Number } 余额
 * @param params.cardNumber { Sting } 卡号,
 * @param params.enabled { Sting } Y有效；N无效,
 * @param params.isMcard { Sting } 是否母卡 0-是 1-否,
 * @param params.mcardNumber { Sting } 母卡号,
 * @param params.outcomeMoney { Sting } 支出累计金额,
 * @param params.unitCode { Sting } 单位代码,
 * @return void
 */
 export function createFuelCard(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcFuelCard/addFuelCard`,
    method: "post",
    data: params,
  });
}


/**
 * @function updateFuelCard
 * @description 更新 加油卡
 * @param params.id { Sting } id
 * @param params.balance { Number } 余额
 * @param params.cardNumber { Sting } 卡号,
 * @param params.enabled { Sting } Y有效；N无效,
 * @param params.isMcard { Sting } 是否母卡 0-是 1-否,
 * @param params.mcardNumber { Sting } 母卡号,
 * @param params.outcomeMoney { Sting } 支出累计金额,
 * @param params.unitCode { Sting } 单位代码,
 * @return void
 */
 export function updateFuelCard(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcFuelCard/updFuelCard`,
    method: "post",
    data: params,
  });
}

/**
 * @function getAllFuelMainCard
 * @description 获取加油卡主卡
 * @return void
 */
 export function getAllFuelMainCard(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcFuelCard/allMainCard`,
    method: "get",
    params,
  });
}


/**
 * @function getFuelCardByCarNumber
 * @description 根据车牌号获取加油卡
 * @param carNumber { String } 车牌号
 * @return void
 */
 export function getFuelCardByCarNumber(carNumber = '') {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcFuelCard/${carNumber}/list`,
    method: "get",
  });
}

/**
 * @function getFuelCardDetail
 * @description 根据卡id获取详细信息 获取加油卡详情
 * @param id { String } id
 * @return void
 */
 export function getFuelCardDetail(id = '') {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcFuelCard/${id}/detail`,
    method: "get",
  });
}

/**
 * @function distributeChildFuelCard
 * @description 分配副卡
 * @param params.mCardNumber { Sting } 母卡号,
 * @param params.balance { Number } 余额
 * @param params.cardNumber { Sting } 卡号,
 * @param params.assignMoney { Sting } 分配金额,
 * @return void
 */
 export function distributeChildFuelCard(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcFuelCard/assignChildCard`,
    method: "post",
    data: params,
  });
}


/**
 * @function getAllFuelChildrenCard
 * @description  获取未分配副卡
 * @return void
 */
 export function getAllFuelChildrenCard(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcFuelCard/notAssignedChildCard`,
    method: "get",
    params,
  });
}

/**
 * @function switchFuelEnabled
 * @description 批量  启用/停用 加油卡
 * @param params.ids { Array } [id1, id2, id3, ...idn]
 * @param params.enabled { String } Y启用,N停用
 * @return void
 */
 export function switchFuelEnabled(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcFuelCard/switchEnabled`,
    method: "post",
    data: params,
  });
}
