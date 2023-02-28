import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 车辆钥匙柜-树
export function gwycCarkeyBoardTree(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gwycCarkeyBoard/tree`,
    method: 'get',
    params
  })
}

//车辆钥匙柜-查询
export function gwycCarkeyBoardList(params) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/gwycCarkeyBoard/list`,
      method: 'get',
      params
    })
}

//车辆钥匙柜-增加
export function gwycCarkeyBoardSave(data) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/gwycCarkeyBoard/save`,
      method: 'post',
      data
    })
}

//车辆钥匙柜-修改
export function gwycCarkeyBoardUpdate(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gwycCarkeyBoard/update`,
    method: 'post',
    data
  })
}

//车辆钥匙位-查询
export function gcywCarkeySeatList(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywCarkeySeat/list`,
    method: 'get',
    params
  })
}

//车辆钥匙位-增加
export function gcywCarkeySeatSave(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywCarkeySeat/save`,
    method: 'post',
    data
  })
}

//车辆钥匙位-删除
export function gcywCarkeySeatDelete(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywCarkeySeat/delete`,
    method: 'post',
    data
  })
}

//车辆钥匙位-修改
export function gcywCarkeySeatUpdate(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywCarkeySeat/update`,
    method: 'post',
    data
  })
}

//车辆钥匙位-修改(表格)
export function gcywCarkeySeatUpdate2(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywCarkeySeat/update2`,
    method: 'post',
    data
  })
}

//车辆钥匙位-删除(表格)
export function gcywCarkeySeatDeleteAll(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/gcywCarkeySeat/deleteAll`,
    method: 'post',
    data
  })
}

