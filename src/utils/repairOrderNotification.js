/**
 * 获取服务端推送的维修工单消息 ID。
 * @param {Object} message SSE 推送的工单消息数据。
 * @returns {string|number|null} 可用于已读接口的消息 ID；不存在时返回 null。
 * @example getRepairMessageId({ id: 1001 })
 */
export function getRepairMessageId(message = {}) {
  const messageDetail = message.message || {}
  const candidates = [
    messageDetail.id,
    message.id,
    message.messageId,
    message.repairMessageId
  ]
  const messageId = candidates.find(value => value !== undefined && value !== null && value !== '')
  return messageId === undefined ? null : messageId
}

/**
 * 获取当前页面内未读通知的唯一键，避免 SSE 重连时重复弹出同一条消息。
 * @param {Object} message SSE 推送的工单消息数据。
 * @returns {string} 当前消息的唯一键；无法识别时返回空字符串。
 * @example getRepairMessageKey({ id: 1001, eventId: 'event-1' })
 */
export function getRepairMessageKey(message = {}) {
  const messageId = getRepairMessageId(message)
  const messageDetail = message.message || {}
  const orderDetail = message.order || {}
  const key = messageId !== null
    ? messageId
    : (message.eventId || messageDetail.orderId || orderDetail.id || message.orderId)
  return key === undefined || key === null || key === '' ? '' : String(key)
}

/**
 * 根据新旧 SSE 数据结构生成工单通知及语音播报文案。
 * @param {Object} message SSE 推送的完整工单消息数据。
 * @returns {string} 格式为“场所名称有新的维修工单”的提示文案。
 * @example getRepairOrderNoticeContent({ order: { faultSiteName: '东辅楼' } })
 */
export function getRepairOrderNoticeContent(message = {}) {
  const orderDetail = message.order || {}
  const siteName = orderDetail.faultSiteName || message.faultSiteName || message.siteName || '当前场所'
  return `${siteName}有新的维修工单`
}

/**
 * 判断 SSE 工单消息是否需要在当前维修后台通知和语音播报。
 * @param {Object} message SSE 推送的完整消息，兼容嵌套及旧版扁平结构。
 * @returns {boolean} USER 身份消息返回 false，其他身份消息返回 true。
 * @example shouldNotifyRepairOrderMessage({ message: { userIdentityEnum: 'REPAIR' } })
 */
export function shouldNotifyRepairOrderMessage(message = {}) {
  const messageDetail = message.message || {}
  const userIdentity = messageDetail.userIdentityEnum || message.userIdentityEnum
  return userIdentity !== 'USER'
}

/**
 * 判断当前 SSE 工单消息是否需要进行提示音和语音播报。
 * @param {Object} message SSE 推送的完整消息。
 * @returns {boolean} 仅顶层 pushCompleted 严格等于 true 时返回 true。
 * @example shouldSpeakRepairOrderMessage({ pushCompleted: true })
 */
export function shouldSpeakRepairOrderMessage(message = {}) {
  return message.pushCompleted === true
}

/**
 * 创建未读工单通知的持久展示配置。
 * @returns {{duration: number, showClose: boolean}} Element Notification 配置片段。
 * @example Object.assign({}, createPersistentNotificationOptions(), otherOptions)
 */
export function createPersistentNotificationOptions() {
  return {
    duration: 0,
    showClose: true
  }
}
