import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_FORM_SERVER;

// 获得分页数据
export function page(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/table/listPage`,
    method: 'get',
    params
  })
}

export function detail(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/table/detail/${id}`,
    method: 'get',
  })
}

export function create(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/table/create`,
    method: 'post',
    data
  })
}

export function modify(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/table/modify`,
    method: 'post',
    data
  })
}

export function deleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/table/deleteBatch`,
    method: 'post',
    data
  })
}