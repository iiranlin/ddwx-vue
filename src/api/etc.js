
import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;


/**
 * @function getEtcCardPageList
 * @description 获取etc卡 分页列表
 * @param params.unitCode { String } 单位
 * @param params.isMcard { Sting } "ETC类型 是否母卡 0-是 1-否",
 * @param params.cardNumber { Sting } "卡号",
 * @return void
 */
 export function getEtcCardPageList(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcEtcCard/listPage`,
    method: "get",
    params,
  });
}

/**
 * @function createETCCard
 * @description 新建 新增 ETC卡
 * @param params.balance { Number } 余额
 * @param params.cardNumber { Sting } 卡号,
 * @param params.enabled { Sting } Y有效；N无效,
 * @param params.isMcard { Sting } 是否母卡 0?1,
 * @param params.mcardNumber { Sting } 母卡号,
 * @param params.outcomeMoney { Sting } 支出累计金额,
 * @param params.unitCode { Sting } 单位代码,
 * @return void
 */
 export function createETCCard(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcEtcCard/addETC`,
    method: "post",
    data: params,
  });
}

/**
 * @function updateETCCard
 * @description 新建 新增 ETC卡
 * @param params.id { Sting } id
 * @param params.balance { Number } 余额
 * @param params.cardNumber { Sting } 卡号,
 * @param params.enabled { Sting } Y有效；N无效,
 * @param params.isMcard { Sting } 是否母卡 0?1,
 * @param params.mcardNumber { Sting } 母卡号,
 * @param params.outcomeMoney { Sting } 支出累计金额,
 * @param params.unitCode { Sting } 单位代码,
 * @return void
 */
 export function updateETCCard(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcEtcCard/updETC`,
    method: "post",
    data: params,
  });
}


/**
 * @function getAllETCCard
 * @description 获取etc卡 分页列表
 * @param params.unitCode { String } 单位
 * @param params.isMcard { Sting } "ETC类型 是否母卡 0-是 1-否",
 * @return void
 */
 export function getAllETCCard(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcjcEtcCard/listAll`,
    method: "get",
    params,
  });
}
