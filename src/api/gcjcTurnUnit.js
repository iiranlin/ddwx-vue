import request from '@/utils/request'
let VUE_APP_BASE_prefix = process.env.VUE_APP_AUTH_SERVER;
//调度工作台-分页
export function gcjcTurnUnitListAll(params) {
    return request({
      url: `${VUE_APP_BASE_prefix}/gcjcTurnUnit/listAll`,
      method: 'get',
      params
    })
}