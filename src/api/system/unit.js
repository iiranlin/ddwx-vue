import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 查询单位列表
export function listUnit(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/unit/listPage`,
    method: 'get',
    params: query
  })
}

// 查询单位详细
export function getUnit(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/unit/detail/` + id,
    method: 'get'
  })
}

// 新增单位
export function addUnit(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/unit/create`,
    method: 'post',
    data
  })
}

// 修改单位
export function updateUnit(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/unit/modify`,
    method: 'post',
    data
  })
}

// 删除单位
export function delUnit(data) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/unit/deleteBatch`,
    method: 'post',
    data
  })
}
//查询所有单位
export function allUnit() {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/unit/listAll`,
    method: 'get'
  })
}


/**
 * @function getAllAvailableUnit
 * @description 获取 当前用户有权限的单位
 */
 export function getAllAvailableUnit(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/unit/getAvailableUnit`,
    method: "get",
    params,
  });
}

export function getDisAvailableUnit(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/unit/getDisAvailableUnit`,
    method: "get",
    params,
  });
}

