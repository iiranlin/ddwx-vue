import request from '@/utils/request'

let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER

// 获取操作日志分页数据
export function getOperateLogByPage(params) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/log/operate/list`,
    method: 'get',
    params
  })
}
