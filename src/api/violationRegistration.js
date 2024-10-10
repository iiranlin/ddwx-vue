import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;


//违章登记-分页
export function gcjcDriverPeccancyListPage(params) {
  return request({
      url: `${VUE_APP_BASE_prefix}/gcjcDriverPeccancy/listPage`,
      method: 'get',
      params
  })
}
//违章登记-保存
export function gcjcDriverPeccancySave(data) {
  return request({
      url: `${VUE_APP_BASE_prefix}/gcjcDriverPeccancy/save`,
      method: 'post',
      data
  })
}
//违章登记-修改/提交
export function gcjcDriverPeccancyUpdate(data) {
  return request({
      url: `${VUE_APP_BASE_prefix}/gcjcDriverPeccancy/update`,
      method: 'post',
      data
  })
}






