import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'
import { getUserMenu } from '@/api/menu'
// import Element from 'element-ui'
import { menuList1 } from '../../utils/menuJson'
// //ws对应http、wss对应https。
// var socket = new WebSocket(`${process.env.VUE_APP_BASE_WS}/blcd-auth/websocket/1481440740705382400`);
// //连接打开事件
// socket.onopen = function() {};
// //收到消息事件
// socket.onmessage = function(msg) {
//     const data = JSON.parse(msg.data);
//     Element.Notification({
//         title: data.noticeTitle,
//         message: data.noticeMessage,
//         type: 'success'
//     });
// };

// //连接关闭事件
// socket.onclose = function() {};
// //发生了错误事件
// socket.onerror = function() {}

// //窗口关闭时，关闭连接
// window.unload=function() {
//     socket.close();
// };


const permission = {
    state: {
        routes: [],
        addRoutes: [],
        defaultRoutes: [],
        topbarRouters: [],
        sidebarRouters: [],
        menuList1:menuList1
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        },
        SET_DEFAULT_ROUTES: (state, routes) => {
            state.defaultRoutes = constantRoutes.concat(routes)
        },
        SET_TOPBAR_ROUTES: (state, routes) => {
            // 顶部导航菜单默认添加统计报表栏指向首页
            const index = [{
                path: 'index',
                meta: { title: '首页', icon: 'dashboard' }
            }]
            state.topbarRouters = index.concat(routes);
        },
        SET_SIDEBAR_ROUTERS: (state, routes) => {
            state.sidebarRouters = routes
        },
    },
    actions: {
        // 生成路由
        GenerateRoutes({ commit }) {
            return new Promise(async resolve => {
                // 向后端请求路由数据
                const menuList1 = await getUserMenu();
                let menuList = filterAsyncRoutes(menuList1.data, true);
                const sdata = JSON.parse(JSON.stringify(menuList))
                const rdata = JSON.parse(JSON.stringify(menuList))
                const sidebarRoutes = filterAsyncRouter(sdata)
                const rewriteRoutes = filterAsyncRouter(rdata, false, true)
                const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
                rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
                router.addRoutes(asyncRoutes);
                commit('SET_ROUTES', rewriteRoutes)
                commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
                commit('SET_DEFAULT_ROUTES', sidebarRoutes)
                commit('SET_TOPBAR_ROUTES', sidebarRoutes)
                resolve(rewriteRoutes)
            })
        }
    }
}

export function filterAsyncRoutes(menuList, flag) {
    let res = [];
    menuList.forEach(item => {
        let params = null;
        if(flag && item.component != 'Layout'){
            params = {
                path: '',
                component: 'Layout',
                redirect: item.menuUrl,
                children: [
                    {
                        alwaysShow: item.children.length != 0 ? true : false,
                        name: item.menuUrl,
                        path: flag ? `/${item.menuUrl}` : item.menuUrl,
                        component: item.component,
                        hidden: item.isHide == 1? true : false,
                        meta: {
                            title: item.menuName,
                            icon: item.menuIcon || 'system',
                            noCache: item.isCache == 1?false:true,
                            link: null,
                            id: item.id,
                        },
                    }
                ]
            }
        }else{
            params = {
                alwaysShow: item.children.length != 0 ? true : false,
                name: item.menuUrl,
                path: flag ? `/${item.menuUrl}` : item.menuUrl,
                component: item.component,
                hidden: item.isHide == 1? true : false,
                meta: {
                    title: item.menuName,
                    icon: item.menuIcon || 'system',
                    noCache: item.isCache == 1?false:true,
                    link: null,
                    id: item.id,
                },
            }
        }
        if (item.children && item.children.length) {
            params.children = filterAsyncRoutes(item.children, false);
        };
        res.push(params);
    });
    return res;
}


// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
    return asyncRouterMap.filter(route => {
        if (type && route.children) {
            route.children = filterChildren(route.children)
        }
        if (route.component) {
            // Layout ParentView 组件特殊处理
            if (route.component === 'Layout') {
                route.component = Layout
            } else if (route.component === 'ParentView') {
                route.component = ParentView
            } else if (route.component === 'InnerLink') {
                route.component = InnerLink
            } else {
                route.component = loadView(route.component)
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, route, type)
        } else {
            delete route['children']
            delete route['redirect']
        }
        return true
    })
}

function filterChildren(childrenMap, lastRouter = false) {
    var children = []
    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) {
            if (el.component === 'ParentView' && !lastRouter) {
                el.children.forEach(c => {
                    c.path = el.path + '/' + c.path
                    if (c.children && c.children.length) {
                        children = children.concat(filterChildren(c.children, c))
                        return
                    }
                    children.push(c)
                })
                return
            }
        }
        if (lastRouter) {
            el.path = lastRouter.path + '/' + el.path
        }
        children = children.concat(el)
    })
    return children
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

export const loadView = (view) => {
    if (process.env.NODE_ENV === 'development') {
        return (resolve) => require([`@/views/${view}`], resolve)
    } else {
        // 使用 import 实现生产环境的路由懒加载
        // return () =>
        //     import (`@/views/${view}`)
        return (resolve) => require([`@/views/${view}`], resolve)
    }
}

export default permission