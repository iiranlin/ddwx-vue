import request from '@/utils/request'
let VUE_APP_BASE_PREFIX = process.env.VUE_APP_AUTH_SERVER;

// 获取路由
export function getUserMenu() {
	return request({
		url: `${VUE_APP_BASE_PREFIX}/user/menu`,
		method: 'GET'
	})
}