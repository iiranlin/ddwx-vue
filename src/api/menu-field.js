import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

export function menuFieldPage(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/menu/field/list`,
        method: 'get',
        params
    })
}

// 用户详情
export function menuFieldDetail(id) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/menu/field/detail/${id}`,
        method: 'get',
    })
}

// 新增
export function menuFieldCreate(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/menu/field/create`,
        method: 'post',
        data
    })
}

export function menuFieldModify(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/menu/field/modify`,
        method: 'post',
        data
    })
}

export function menuFieldDeleteBatch(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/menu/field/deleteBatch`,
        method: 'post',
        data
    })
}