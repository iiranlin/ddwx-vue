import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

/**
 * @function getAllAvailableDept
 * @description 获取 当前用户有权限的部门
 */
 export function getAllAvailableDept(params = {}) {
  return request({
    url: `${VUE_APP_BASE_PREFIX}/dept/getAvailableDept`,
    method: "get",
    params,
  });
}
