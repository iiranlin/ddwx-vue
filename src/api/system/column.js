import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 根据表名获得字段
export function columnByTableName(query) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/system/datatable/column/getColumnByTableName`,
    method: 'get',
    params: query
  })
}
