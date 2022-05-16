/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
import router, { asyncRoutes, constantRoutes, dynamicRoutes } from '@/router'
import store from '../index'
import Layout from '@/layout'
import auth from '@/plugins/auth'

export function filterAsyncRoutes(menuList, flag) {
	let res = [];
	menuList.forEach(item => {
		let menuCode = item.menuUrl.substring(item.menuUrl.lastIndexOf('/')+1);
		let params = {
			name: menuCode,
			path: flag ? `/${menuCode || 'a'}`: menuCode,
			component: flag ? Layout : () => import(`@/views${item.menuUrl}`),
			meta: {
				menuUrl: item.menuUrl,
				title: item.menuName,
				icon: item.menuIcon,
				menuLevel: item.menuLevel
			}
		}
		if (item.child && item.child.length) {
			params.children = filterAsyncRoutes(item.child, false);
		};
		res.push(params);
	});
	return res;
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
	const res = []
	routes.forEach(route => {
		if (route.permissions) {
			if (auth.hasPermiOr(route.permissions)) {
				res.push(route)
			}
		} else if (route.roles) {
			if (auth.hasRoleOr(route.roles)) {
				res.push(route)
			}
		}
	})
	return res
}



const state = {
	routes: [],
	sidebarRouters: [],
	addRoutes: [],
}

const mutations = {
	SET_ROUTES: (state, routes) => {
		state.addRoutes = routes
		state.routes = constantRoutes.concat(routes)
	},
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      	state.sidebarRouters = routes
    },
}

const actions = {
	generateRoutes({ commit, state }, menuData) {
		return new Promise(resolve => {
			let accessedRoutes = [{ path: '*', redirect: '/404', hidden: true }]
			
			let filterMenu = filterAsyncRoutes(menuData.menuList, true);

			let newFilterMenu = filterMenu.splice(state.otherLeng).map((item) => {
				item.meta.menuLevel = false;
				return item;
			});

			accessedRoutes = accessedRoutes.concat(newFilterMenu).concat(dynamicRoutes);
			// console.log(dynamicRoutes)
			// const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
			
			commit('SET_ROUTES', accessedRoutes);

			commit('SET_SIDEBAR_ROUTERS', accessedRoutes);

			resolve(accessedRoutes)
		})
	},

	async changeNavigation ({commit, dispatch, state}, flag) {
		return new Promise(async (resolve) => {
			const menuList = await store.dispatch('getInfo');
			const accessRoutes = await dispatch('generateRoutes', {menuList});
			console.log(accessRoutes)
			router.addRoutes(accessRoutes)
			resolve();
		})
	},
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}
