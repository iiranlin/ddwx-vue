import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;

export function getListByParent(code) {
  return request({
    url: `${VUE_APP_BASE_prefix}/dict/common/getListByParent/${code}`,
    method: 'get'
  })
}

export function getUnitDictList() {
  return request({
    url: `${VUE_APP_BASE_prefix}/unitDict/getList`,
    method: 'get'
  })
}

export function deptListAll(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/dept/listAll`,
    method: 'get',
    params
  })
}

// 用户列表-部门的全部用户(tree)
export function userListAllForDept(params) {
  return request({
    url: `${VUE_APP_BASE_prefix}/user/listAllForDept`,
    method: 'get',
    params
  })
}
