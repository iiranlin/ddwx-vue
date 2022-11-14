import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { setToken,getToken,getIdToken } from '@/utils/auth'
import { loginByTicket } from '@/api/login'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

function loginAuth(snapTicket) {
  return new Promise((resolve) => {
    loginByTicket(snapTicket).then(res => {
      if (res.code == 0) {
        resolve(res.data)
      }else{
        resolve()
      }
    })
  })
}

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  // 如果url参数中包含snapTicket参数时
  const snapTicket = to.query.snapTicket;
  if (snapTicket) {
    const data = await loginAuth(snapTicket);
    if(data){
      setToken(data.token)
      next(to.path)
      return;
    }
  }

	const hasToken = getToken()
  if (hasToken) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const roles = store.getters.roles;	// 是否有菜单权限
			if (roles) {		// 动态路由状态请求状态
        next()
        NProgress.done()
      } else {
        try {
          store.dispatch('GetInfo').then(() => {
            store.dispatch('GenerateRoutes').then(accessRoutes => {
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            })
          }).catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({ path: '/' })
            })
          })
        } catch (error) {
          console.log("错误")
          next(`/`)
          NProgress.done()
        }
        next();
      }
    }
  } else {
    // 没有token,判断url是否带有id_token参数
    let id_token = getIdToken();
   
    if(!!id_token){
      store.dispatch('UrlLogin', id_token).then((res) => {
        next({ ...to, replace: true });
        NProgress.done()
      })
      .catch(() => {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
          next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
          NProgress.done()
        }
      })
    }else{
      if (whiteList.indexOf(to.path) !== -1) {
        //   //在免登录白名单，直接进入
          next()
        } else {
          next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
          NProgress.done()
        }
    }
 
  }
})

router.afterEach(() => {
  NProgress.done()
})
