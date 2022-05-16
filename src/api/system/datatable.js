import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 查询结构列表
export function listDbTable(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datatable/list`,
    method: 'get',
    params: query
  })
}

// 查询所有表
export function allListDbTable(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datatable/getListBySourceId`,
    method: 'get',
    params: query
  })
}

// 查询结构详细
export function getDbTable(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datatable/detail/` + id,
    method: 'get'
  })
}

// 新增结构
export function addDbTable(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datatable/create`,
    method: 'post',
    data
  })
}

// 修改结构
export function updateDbTable(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datatable/modify`,
    method: 'post',
    data
  })
}

// 删除结构
export function delDbTable(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datatable/deleteBatch`,
    method: 'post',
    data
  })
}
