import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;


//考勤管理-列表
export function gcjcDriverLeaveListPage(params) {
  return request({
      url: `${VUE_APP_BASE_prefix}/gcjcDriverLeave/listPage`,
      method: 'get',
      params
  })
}

//考勤管理-新增
export function gcjcDriverLeaveSave(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcjcDriverLeave/save`,
        method: 'post',
        data
    })
}

//考勤管理-修改
export function gcjcDriverLeaveModify(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcjcDriverLeave/modify`,
        method: 'post',
        data
    })
}

//考勤管理-删除
export function gcjcDriverLeaveDel(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcjcDriverLeave/del`,
        method: 'post',
        data
    })
}

//考勤管理-请假司机列表
export function gcjcDriverLeaveList(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcjcDriver/leaveList`,
        method: 'get',
        params
    })
}



