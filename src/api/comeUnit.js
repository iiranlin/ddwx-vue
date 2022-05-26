import request from '@/utils/request'

let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER

/**
 * 获取来往单位下拉列表
 * @param params
 */
export function getComeUnitList(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywComeUnit/listAll`,
    method: 'get',
    params
  })
}

/**
 * 来往单位分页查询
 * @param params
 */
export function getComeUnitByPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywComeUnit/listPage`,
    method: 'get',
    params
  })
}

/**
 * 新增往来单位
 * @param data
 */
export function addComeUnit(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywComeUnit/addCU`,
    method: 'post',
    data
  })
}

/**
 * 更新往来单位
 * @param data
 */
export function updateComeUnit(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywComeUnit/updateCU`,
    method: 'post',
    data
  })
}

/**
 * 删除往来单位
 * @param data
 */
export function deleteComeUnit(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcywComeUnit/delCU`,
    method: 'post',
    data
  })
}
