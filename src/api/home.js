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

//首页-获取常用菜单
export function usemenuList(params) {
    return request({
        url: `${VUE_APP_BASE_prefix}/usemenu/list`,
        method: 'get',
        params
    })
}

//首页-保存常用菜单
export function usemenuSave(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/usemenu/save`,
        method: 'post',
        data
    })
}

//首页-删除常用菜单
export function usemenuDelete(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/usemenu/delete`,
        method: 'post',
        data
    })
}


