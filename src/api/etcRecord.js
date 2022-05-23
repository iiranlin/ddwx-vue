import request from "@/utils/request";
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

/**
 * @function getETCRecordPageList
 * @description 获取etc卡 分页列表
 * @param params.unitCode { String } 单位
 * @param params.incomeOrExp { Sting } "交易类型 充值或消费；Y充值；N消费",
 * @param params.carNumber { Sting } "车牌号",
 * @return void
 */
export function getETCRecordPageList(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywEtcRecord/listPage`,
    method: "get",
    params,
  });
}

/**
 * @function createETCCardRecord
 * @description 新建 新增 ETC卡记录
 * @param params.balance { Number } 余额
 * @param params.cardNumber { Sting } 卡号,
 * @param params.enabled { Sting } Y有效；N无效,
 * @param params.isMcard { Sting } 是否母卡 0-是 1-否,
 * @param params.mcardNumber { Sting } 母卡号,
 * @param params.outcomeMoney { Sting } 支出累计金额,
 * @param params.unitCode { Sting } 单位代码,
 * @return void
 */
 export function createETCCardRecord(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywEtcRecord/add`,
    method: "post",
    data: params,
  });
}

/**
 * @function updateETCCardRecord
 * @description 更新 修改 ETC卡记录
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
 export function updateETCCardRecord(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywEtcRecord/update`,
    method: "post",
    data: params,
  });
}
