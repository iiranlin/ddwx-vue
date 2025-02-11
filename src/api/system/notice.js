import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 查询列表
export function noticePage(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/listPage`,
    method: 'get',
    params
  })
}

// 新增
export function noticeCreate(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/create`,
    method: 'post',
    data: data
  })
}

// 详情
export function noticeDetail(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/detail/${id}`,
    method: 'get',
  })
}

// 修改
export function noticeModify(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/modify`,
    method: 'post',
    data
  })
}

// 删除
export function noticeDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/deleteBatch`,
    method: 'post',
    data
  })
}
export function noticePublish(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/publish/${id}`,
    method: 'get'
  })
}
export function noticeCancel(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/cancel/${id}`,
    method: 'get'
  })
}
export function noticeLog(id,params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/log/${id}`,
    method: 'get',
    params
  })
}

export function noticeUser(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/user`,
    method: 'get',
    params
  })
}

export function noticeReaded(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/readed/${id}`,
    method: 'get'
  })
}
export function noticeReadedAll(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/notice/readedAll`,
    method: 'get'
  })
}

