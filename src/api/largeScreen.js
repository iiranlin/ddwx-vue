import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;


//司机值班大屏-值班人员列表
export function largeScreenDriverClass(params) {
  return request({
      url: `${VUE_APP_BASE_prefix}/largeScreen/driver/class`,
      method: 'get',
      params
  })
}

//司机值班大屏-出车/待出车数据
export function largeScreenDriverRequest(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/largeScreen/driver/request`,
        method: 'get',
        params
    })
}

//司机值班大屏-休假/请假数据
export function largeScreenDriverLeave(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/largeScreen/driver/leave`,
        method: 'get',
        params
    })
}

//司机值班大屏-滚动屏数据
export function largeScreenDriverMsg(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/largeScreen/driver/msg`,
        method: 'get',
        params
    })
}

//司机值班大屏-安全驾驶天数
export function largeScreenDriverSecureDay(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/largeScreen/driver/secureDay`,
        method: 'get',
        params
    })
}

//司机值班大屏-安全驾驶天数清零
export function largeScreenDriverSecureClean(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/largeScreen/driver/secureClean`,
        method: 'get',
        params
    })
}

//车辆调度仪表台-数量获取
export function largeScreenRequestCount(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/largeScreen/request/count`,
        method: 'get',
        params
    })
}
//车辆调度仪表台-待派车
export function largeScreenRequestDispatch(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/largeScreen/request/dispatch`,
        method: 'get',
        params
    })
}

//司机队列
export function largeScreenGetTeamDrivers(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/largeScreen/getTeamDrivers`,
        method: 'get',
        params
    })
}



