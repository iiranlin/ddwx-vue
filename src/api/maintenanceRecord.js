import request from '@/utils/request'

let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER

export const maintenanceRecordTemplateUrl = `${VUE_APP_BASE_PREFIX}/maintenanceRecord/template`
export const maintenanceRecordImportUrl = `${process.env.VUE_APP_BASE_API}/${VUE_APP_BASE_PREFIX}/maintenanceRecord/import`

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

//维保记录-修改
export function maintenanceRecordUpdate(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/maintenanceRecord/update`,
    method: 'post',
    data
  })
}

//维保记录-删除
export function maintenanceRecordDelete(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/maintenanceRecord/delete`,
    method: 'post',
    data
  })
}
//维保记录-提交
export function maintenanceRecordSubmit(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/maintenanceRecord/submit`,
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

/**
 * 根据id获取详情
 * @param id
 */
export function getMaintenanceDetailById(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/maintenanceRecord/${id}/detail`,
    method: 'get'
  })
}

//维保记录-导入保存
export function maintenanceRecordImportSave(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/maintenanceRecord/import/save`,
    method: 'post',
    data
  })
}