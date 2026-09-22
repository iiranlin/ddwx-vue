/**
 * 功能：判断路由路径是否为 SSO 过渡页，并兼容末尾斜杠。
 * 参数：path，Vue Router 提供的路由路径字符串。
 * 使用：调用 isSsoRoute(to.path)，返回 true 时应由 SSO 页面处理 URL 登录凭证。
 */
function isSsoRoute(path) {
  if (typeof path !== 'string') {
    return false
  }

  return path.replace(/\/+$/, '') === '/sso'
}

module.exports = {
  isSsoRoute
}
