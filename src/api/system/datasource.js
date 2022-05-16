import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 查询数据源列表
export function listDatasource(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datasource/list`,
    method: 'get',
    params: query
  })
}

// 查询数据源详细
export function getDatasource(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datasource/detail/` + id,
    method: 'get'
  })
}

// 新增数据源
export function addDatasource(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datasource/create`,
    method: 'post',
    data
  })
}

// 修改数据源
export function updateDatasource(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datasource/modify`,
    method: 'post',
    data
  })
}

// 删除数据源
export function delDatasource(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datasource/deleteBatch`,
    method: 'post',
    data
  })
}
