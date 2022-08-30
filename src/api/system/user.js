import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 查询用户列表
export function userPage(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/listPage`,
    method: 'get',
    params
  })
}

// 新增用户
export function userCreate(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/create`,
    method: 'post',
    data
  })
}

// 用户详情
export function userDetail(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/detail/${id}`,
    method: 'get',
  })
}
// 用户详情
export function userDetailUL(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/detailUL/${id}`,
    method: 'get',
  })
}
// 角色修改
export function userModify(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/modify`,
    method: 'post',
    data
  })
}

export function updateGrantStatus(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/updateGrantStatus`,
    method: 'post',
    data
  })
}

// 用户批量删除
export function userDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/deleteBatch`,
    method: 'post',
    data
  })
}
// 用户单个删除
export function userDelete(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/delete/${id}`,
    method: 'post',
  })
}

export function userBindRole(data, id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/bindRole/${id}`,
    method: 'post',
    data
  })
}


// 用户角色树
export function userRoleList(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/roleList/${id}`,
    method: 'get',
  })
}


export function resetPwd(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/resetPwd`,
    method: 'post',
    data
  })
}

//修改短信状态
export function userModifys(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/user/modifys`,
    method: 'post',
    data
  })
}