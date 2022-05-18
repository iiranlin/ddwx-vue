
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
