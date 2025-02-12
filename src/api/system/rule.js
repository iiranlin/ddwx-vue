import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 查询数据规则列表
export function listRule(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/rule/list`,
    method: 'get',
    params: query
  })
}

// 查询数据规则详细
export function getRule(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/rule/detail/` + id,
    method: 'get'
  })
}

// 新增数据规则
export function addRule(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/rule/create`,
    method: 'post',
    data
  })
}

// 修改数据规则
export function updateRule(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/rule/modify`,
    method: 'post',
    data
  })
}

// 删除数据规则
export function delRule(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/rule/deleteBatch`,
    method: 'post',
    data
  })
}