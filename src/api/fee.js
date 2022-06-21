import request from '@/utils/request'

let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER

let path = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : ''
let uploadPath = process.env.NODE_ENV === 'development' ? path : '/api'

export const carContractTemplateUrl = `${path}${VUE_APP_BASE_PREFIX}/gcywCarContract/template`

export const carContractImportUrl = `${uploadPath}${VUE_APP_BASE_PREFIX}/gcywCarContract/import`

export const carContractExportUrl = `${path}${VUE_APP_BASE_PREFIX}/gcywCarContract/export`


/**
 * @function getCarContract
 * @description 业务外包费用台账列表-分页
 * @param params.unitCode { Sting } "使用单位",
 * @param params.contractCode { Sting } "合同编号",
 * @param params.contractBeginDateStr { String } 起始时间
 */
export function getCarContract(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywCarContract/listPage`,
    method: 'get',
    params
  })
}

/**
 * @function createCarContract
 * @description 新增业务外包费用台账
 * @param params.unitCode { Sting } 使用单位
 * @param params.contractCode { Sting } 合同编号,
 * @param params.contractAmount { Sting } 合同金额
 * @param params.contractBegindate { Sting } 合同开始日期 yyyy-MM-dd
 * @param params.contractEnddate { Sting } 合同结束日期 yyyy-MM-dd
 * @param params.useType { Sting } 车辆用途 1:通勤,2:其他
 * @param params.details { Array } 线路明细,
 * @param params.details.carTypeCode { String } 车辆类型,
 * @param params.details.lineKm { String } 往返里程,
 * @param params.details.lineStart { String } 线路起点,
 * @param params.details.lineEnd { String } 线路终点,
 * @param params.details.lineTripnum { String } 每天趟数,
 * @param params.details.carNum { String } 车辆数,
 * @param params.details.commute { String } 通勤人数,
 * @param params.details.quasiCarrier { String } 准载人数,
 * @param params.details.remark { String } 备注,
 */

export function createCarContract(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywCarContract/create`,
    method: 'post',
    data: params
  })
}

