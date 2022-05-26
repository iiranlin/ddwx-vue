import request from '@/utils/request'

let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER

/**
 * 添加维保记录
 * @param data 维保记录信息
 */
export function addMaintenanceRecord(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/maintenanceRecord/add`,
    method: 'post',
    data
  })
}

/**
 * 获取分页数据
 * @param params 查询参数
 */
export function getMaintenanceRecordByPage(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/maintenanceRecord/listPage`,
    method: 'get',
    params
  })
}
