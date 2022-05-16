import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 查询角色列表
export function rolePage(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/listPage`,
    method: 'get',
    params
  })
}

// 新增角色
export function roleCreate(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/create`,
    method: 'post',
    data: data
  })
}

// 角色详情
export function roleDetail(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/detail/${id}`,
    method: 'get',
  })
}

// 角色修改
export function roleModify(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/modify`,
    method: 'post',
    data
  })
}

// 角色删除
export function roleDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/deleteBatch`,
    method: 'post',
    data
  })
}

// 角色分组
export function roleGroupList(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/groupList`,
    method: 'get',
  })
}

// 角色树
export function roleTree(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/tree`,
    method: 'get',
  })
}


// 角色菜单
export function roleMenuList(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/menuList/${id}`,
    method: 'get',
  })
}

// 角色绑定菜单
export function roleBindMenu(data, id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/bindMenu/${id}`,
    method: 'post',
    data
  })
}

// 角色菜单树
export function roleMenuTree(roleId) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/menuTree/${roleId}`,
    method: 'get',
  })
}
//获得数据规则树
export function roleDataRuleTree(roleId) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/dataRuleTree/${roleId}`,
    method: 'get',
  })
}

//角色绑定数据规则
export function roleBindDataRule(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/bindDataRule`,
    method: 'post',
    data
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/authUser/allocatedList`,
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/authUser/unallocatedList`,
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(roleId, data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/${roleId}/authUser/cancel`,
    method: 'post',
    data
  })
}

// 授权用户选择
export function authUser(roleId, data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/role/${roleId}/authUser`,
    method: 'post',
    data
  })
}