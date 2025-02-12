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

//转派单位管理-分页 gcjcTurnUnit/listPage
export function gcjcTurnUnitListPage(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcTurnUnit/listPage`,
    method: 'get',
    params
  })
}

//转派单位管理-增加
export function gcjcTurnUnitAddTU(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcTurnUnit/addTU`,
    method: 'post',
    data
  })
}

//转派单位管理-删除
export function gcjcTurnUnitDelTU(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/gcjcTurnUnit/delTU`,
    method: 'post',
    data
  })
}

//获取指定日期范围内的工作日-节假日列表
export function sysWorkDayListWorkDay(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/sysWorkDay/listWorkDay`,
    method: 'get',
    params
  })
}

//设置或者取消工作日-节假日
export function sysWorkDaySetWorkDay(data) {
  return request({
    url: `${VUE_APP_BASE_prefix}/sysWorkDay/setWorkDay`,
    method: 'post',
    data
  })
}
