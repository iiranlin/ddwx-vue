import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 查询岗位列表
export function listPost(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/post/list`,
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/post/detail/` + id,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/post/create`,
    method: 'post',
    data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/post/modify`,
    method: 'post',
    data
  })
}

// 删除岗位
export function delPost(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/post/deleteBatch`,
    method: 'post',
    data
  })
}
