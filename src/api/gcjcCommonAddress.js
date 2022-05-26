import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

//常用地址-分页
export function gcjcCommonAddressListPage(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/gcjcCommonAddress/listPage`,
      method: 'get',
      params
    })
}

//常用地址-下拉框
export function gcjcCommonAddressListAll(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/gcjcCommonAddress/listAll`,
      method: 'get',
      params
    })
}

//往来单位-增加或者修改
export function gcjcCommonAddressSaveorupdate(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcjcCommonAddress/saveorupdate`,
        method: 'post',
        data
    })
}


//常用地址删除
export function gcjcCommonAddressDelAdress(data) {
    return request({
        url: `${VUE_APP_BASE_prefix}/gcjcCommonAddress/delAdress`,
        method: 'post',
        data
    })
}
