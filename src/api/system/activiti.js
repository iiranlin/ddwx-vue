import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;
// 工作流列表
export function modelListPage(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/activiti/model/listPage`,
        method: 'get',
        params
    })
}
// 返回工作流服务器请求地址
export function modelEditUrl(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/activiti/model/editUrl`,
        method: 'get',
        params
    })
}

// 新建工作流
export function modelNewModel(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/activiti/model/newModel`,
        method: 'get',
        params
    })
}
