import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

//车辆固定限行-分页
export function fixedRestrictionListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/fixedRestriction/listPage`,
    method: 'get',
    params
  })
}

//车辆固定限行-增加
export function fixedRestrictionAddFR(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/fixedRestriction/addFR`,
    method: 'post',
    data
  })
}

//车辆固定限行-删除
export function fixedRestrictionEnableFR(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/fixedRestriction/enableFR`,
    method: 'post',
    data
  })
}

//车辆固定限行-修改
export function fixedRestrictionUpdateFR(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/fixedRestriction/updateFR`,
    method: 'post',
    data
  })
}

//车辆临时限行-分页
export function tempRestrictionListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/tempRestriction/listPage`,
    method: 'get',
    params
  })
}

//车辆临时限行-增加
export function tempRestrictionAddTR(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/tempRestriction/addTR`,
    method: 'post',
    data
  })
}

//车辆临时限行-删除
export function tempRestrictionEnableTR(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/tempRestriction/enableTR`,
    method: 'post',
    data
  })
}

//车辆临时限行-修改
export function tempRestrictionUpdateTR(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/tempRestriction/updateTR`,
    method: 'post',
    data
  })
}
