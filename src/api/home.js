import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;
// // 预算统计导出地址
// export const gcywBudgetExportFile = `${VUE_APP_BASE_prefix}/gcywBudget/exportFile`


//首页-待办事项
export function gcywVehicleRequestPendding(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywVehicleRequest/pendding`,
        method: 'get',
        params
    })
}

//首页-系统帮助
export function documentList(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/document/list`,
        method: 'get',
        params
    })
}

//首页-统计
export function gcywVehicleRequestHomeInfo(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcywVehicleRequest/homeInfo`,
        method: 'get',
        params
    })
}


