import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress, { remove } from 'nprogress'
import 'nprogress/nprogress.css'
import { setToken,getToken,getCookie,removeCookie } from '@/utils/auth'
import { loginByTicket } from '@/api/login'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/sso']

function getSsoToken(to) {
  return to.query.id_token || to.query.sso
}

function removeSsoTokenQuery(to) {
  const query = { ...to.query }
  delete query.id_token
  delete query.sso

  return {
    path: to.path,
    query,
    hash: to.hash,
    replace: true
  }
}

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

  // 如果url参数中包含id_token或sso参数时，强制切换登录身份（排除 /sso 路径，由专门的过渡页进行处理）
  const ssoToken = getSsoToken(to)
  if (ssoToken && to.path !== '/sso') {
    try {
      await store.dispatch('LogOut')
      await store.dispatch('UrlLogin', ssoToken)
      next(removeSsoTokenQuery(to))
    } catch (err) {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.fullPath}`)
      }
      NProgress.done()
    }
    return
  }

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
  
  //统一身份认证登录逻辑
  const iPlanetDirectoryPro = getCookie('iPlanetDirectoryPro');

  if(!!iPlanetDirectoryPro){

    const hasToken = getToken()

    if(!hasToken){
      await store.dispatch('GetInfoByAmlbcookie',iPlanetDirectoryPro).then((res) => {
        next(to.path)
        return;
      }).catch((err) => {
  
      })
    }
  }

  //正常登录逻辑
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
          await store.dispatch('GetInfo')
          const accessRoutes = await store.dispatch('GenerateRoutes')
          router.addRoutes(accessRoutes) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        } catch (error) {
          await store.dispatch('LogOut')
          Message.error(error)
          next({ path: '/' })
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      //   //在免登录白名单，直接进入
        next()
      } else {
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
        NProgress.done()
    }
 
  }
})

router.afterEach(() => {
  NProgress.done()
})
