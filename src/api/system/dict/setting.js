import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

//调度单位管理-分页
export function sysUnitUsedisRelationListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/sysUnitUsedisRelation/listPage`,
    method: 'get',
    params
  })
}

//调度单位管理-增加
export function sysUnitUsedisRelationAddDU(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/sysUnitUsedisRelation/addDU`,
    method: 'post',
    data
  })
}

//调度单位管理-删除
export function sysUnitUsedisRelationDelDU(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/sysUnitUsedisRelation/delDU`,
    method: 'post',
    data
  })
}

//单位列表-全部
export function systemUnitListAll(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/system/unit/listAll`,
    method: 'get',
    params
  })
}


