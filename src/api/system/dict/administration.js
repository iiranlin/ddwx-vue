import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

//行政区划-行政区划列表-分页
export function gcjcDivisionListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDivision/listPage`,
    method: 'get',
    params
  })
}

//行政区划-行政区划列表-不分页
export function gcjcDivisionList(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDivision/list`,
    method: 'get',
    params
  })
}

//行政区划-删除行政区划
export function gcjcDivisionDeleteBatch(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDivision/deleteBatch`,
    method: 'post',
    data
  })
}

//行政区划-新增行政区划
export function gcjcDivisionCreate(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDivision/create`,
    method: 'post',
    data
  })
}

//行政区划-修改行政区划
export function gcjcDivisionModify(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcDivision/modify`,
    method: 'post',
    data
  })
}

///行政区划-获取行政区划详细信息
export function gcjcDivisionDetail(id) {
    return request({
      url: `${VUE_APP_BASE_prefix}/gcjcDivision/detail/${id}`,
      method: 'get',
    })
  }
