import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

export function menuButtonPage(params) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/menu/button/listPage`,
        method: 'get',
        params
    })
}

//新增按钮
export function menuButtonCreate(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/menu/button/create`,
        method: 'post',
        data
    })
}

export function menuButtonDetail(id) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/menu/button/detail/${id}`,
        method: 'get',
    })
}

export function menuButtonModify(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/menu/button/modify`,
        method: 'post',
        data
    })
}

export function menuButtonDeleteBatch(data) {
    return request({
        url: `${VUE_APP_BASE_PREFIX}/menu/button/deleteBatch`,
        method: 'post',
        data
    })
}