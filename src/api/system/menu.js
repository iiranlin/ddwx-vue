import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 查询菜单列表
export function menuPage(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/menu/listPage`,
    method: 'get',
    params
  })
}

// 新增用户
export function menuCreate(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/menu/create`,
    method: 'post',
    data
  })
}

// 用户详情
export function menuDetail(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/menu/detail/${id}`,
    method: 'get',
  })
}

// 菜单修改
export function menuModify(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/menu/modify`,
    method: 'post',
    data
  })
}

// 用户批量删除
export function menuDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/menu/deleteBatch`,
    method: 'post',
    data
  })
}
// 用户单个删除
export function menuDelete(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/menu/delete/${id}`,
    method: 'post',
  })
}

export function menuBindRole() {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/menu/bindRole/${menuId}`,
    method: 'post',
  })
}

export function menuTree() {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/menu/tree`,
    method: 'get',
  })
}

// 页面属性
export function menuProperty(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/menu/property/${id}`,
    method: 'get',
  })
}
