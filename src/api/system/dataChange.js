import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 数据变更工单导出地址
export const dataChangeOrderExportUrl = `${VUE_APP_BASE_PREFIX}/gcywChangeRequest/download`

// 数据变更工单-分页
export function gcywChangeRequestListPage(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/gcywChangeRequest/listPage`,
        method: 'get',
        params
    })
}

// 数据变更工单-增加
export function gcywChangeRequestAdd(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/gcywChangeRequest/add`,
        method: 'post',
        data
    })
}

// 数据变更工单-修改、提交、删除
export function gcywChangeRequestUpdate(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/gcywChangeRequest/update`,
        method: 'post',
        data
    })
}

// 数据变更工单-处理
export function gcywChangeRequestUpdateRes(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/gcywChangeRequest/updateRes`,
        method: 'post',
        data
    })
}

// 数据变更工单-申请人
export function userListAll(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/user/listAll`,
        method: 'get',
        params
    })
}

// 数据变更工单-审批记录
export function gcywChangeRequestActivitiList(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/gcywChangeRequest/activitiList`,
        method: 'get',
        params
    })
}

// 数据变更工单-审批日志
export function gcywChangeRequestActivitiLog(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/gcywChangeRequest/activitiLog`,
        method: 'get',
        params
    })
}

// 数据变更工单-审批通过
export function gcywChangeRequestComplete(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/gcywChangeRequest/complete`,
        method: 'post',
        data
    })
}
// 数据变更工单-审批拒绝
export function gcywChangeRequestReject(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/gcywChangeRequest/reject`,
        method: 'post',
        data
    })
}
