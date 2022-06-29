import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;
// 查询字典数据列表
export function commonPage(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dict/common/listPage`,
    method: 'get',
    params: query
  })
}

export function commonTree(query) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/dict/common/tree`,
      method: 'get',
      params: query
    })
  }

  export function commonCreate(data) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/dict/common/create`,
      method: 'post',
      data
    })
  }

  export function commonModify(data) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/dict/common/modify`,
      method: 'post',
       data
    })
  }

  export function commonDeleteBatch(data) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/dict/common/deleteBatch`,
      method: 'post',
      data
    })
  }

  export function commonDetail(id) {
    return request({
      url: `${VUE_APP_BASE_PREFIX}/dict/common/detail/${id}`,
      method: 'get',
    })
  }

export function getListByParentId(id) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dict/getListByParentId/${id}`,
    method: 'get',
  })
}

export function getListByParentCode(code) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dict/getListByParentCode/${code}`,
    method: 'get',
  })
}

export function getUserLevel() {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dict/getUserLevel`,
    method: 'get',
  })
}

