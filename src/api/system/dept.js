import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;


//部门列表-分页(单位)
export function deptListPageForUnit(params){
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dept/listPageForUnit`,
    method: 'get',
    params
  })
}

// 查询部门列表
export function deptListPage(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dept/listPage`,
    method: 'get',
    params
  })
}

// 查询部门详细
export function deptDetail(deptId) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dept/detail/${deptId}`,
    method: 'get'
  })
}

// 新增部门
export function deptCreate(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dept/create`,
    method: 'post',
    data
  })
}

// 修改部门
export function deptModify(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dept/modify`,
    method: 'post',
    data
  })
}

// 删除部门
export function deptDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dept/deleteBatch`,
    method: 'post',
    data
  })
}

// 查询部门下拉树结构
export function deptTree(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dept/tree`,
    method: 'get',
    params
  })
}

//修改部门仓库
export function updateStorehouse(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dept/updateStorehouse`,
    method: 'post',
    data
  })
}

