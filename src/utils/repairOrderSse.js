import { getToken } from "@/utils/auth";

const RECONNECT_DELAYS = [1000, 3000, 5000, 10000, 30000];

/**
 * 拼接基础地址和接口路径，并清理连接处重复或缺失的斜杠。
 * @param {string} baseUrl 接口基础地址。
 * @param {string} path 接口相对路径。
 * @returns {string} 可直接请求的完整接口地址。
 */
function joinUrl(baseUrl, path) {
  return `${(baseUrl || "").replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

/**
 * 解析一个完整的 SSE 文本块，提取事件类型、事件编号和多行数据。
 * @param {string} block 单个 SSE 事件的原始文本。
 * @returns {{event: string, id: string, data: string}|null} 解析结果；无 data 字段时返回 null。
 */
export function parseSseBlock(block) {
  let event = "message";
  let id = "";
  const data = [];

  block.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith(":")) return;
    const separator = line.indexOf(":");
    const field = separator === -1 ? line : line.slice(0, separator);
    let value = separator === -1 ? "" : line.slice(separator + 1);
    if (value.startsWith(" ")) value = value.slice(1);

    if (field === "event") event = value || "message";
    if (field === "id") id = value;
    if (field === "data") data.push(value);
  });

  if (!data.length) return null;
  return { event, id, data: data.join("\n") };
}

/**
 * 创建支持分片数据的 SSE 流解析器，缓存不完整内容并逐个回调完整事件。
 * @param {Function} onEvent 每解析出一个完整事件时执行的回调。
 * @returns {Function} 用于持续接收文本分片的解析函数。
 */
export function createSseParser(onEvent) {
  let buffer = "";
  return (chunk) => {
    buffer += chunk.replace(/\r\n/g, "\n");
    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const parsed = parseSseBlock(buffer.slice(0, boundary));
      buffer = buffer.slice(boundary + 2);
      if (parsed) onEvent(parsed);
      boundary = buffer.indexOf("\n\n");
    }
  };
}

export default class RepairOrderSse {
  /**
   * 创建维修工单 SSE 客户端。
   * @param {Object} options 回调配置。
   * @param {Function} options.onMessage 收到有效工单事件时执行的回调。
   * @param {Function} [options.onStatus] 连接状态变化时执行的可选回调。
   */
  constructor({ onMessage, onStatus }) {
    this.onMessage = onMessage;
    this.onStatus = onStatus;
    this.controller = null;
    this.reconnectTimer = null;
    this.reconnectCount = 0;
    this.closed = true;
  }

  /**
   * 启动 SSE 客户端；客户端已运行时不会重复建立连接。
   * @returns {void}
   */
  start() {
    if (!this.closed) return;
    this.closed = false;
    this.connect();
  }

  /**
   * 停止 SSE 客户端，取消重连定时器并中止当前网络请求。
   * @returns {void}
   */
  stop() {
    this.closed = true;
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    if (this.controller) this.controller.abort();
    this.controller = null;
  }

  /**
   * 使用当前登录令牌建立 SSE 流连接，持续读取并解析服务端事件。
   * 连接异常断开时会通知状态回调并安排重连。
   * @returns {Promise<void>} 当前连接读取流程结束后完成的 Promise。
   */
  async connect() {
    if (this.closed) return;
    this.controller = new AbortController();

    try {
      const response = await fetch(
        joinUrl(process.env.VUE_APP_BASE_API, "/auth/connect"),
        {
          method: "GET",
          headers: {
            Accept: "text/event-stream",
            Authorization: getToken(),
          },
          cache: "no-store",
          signal: this.controller.signal,
        }
      );

      if (!response.ok) throw new Error(`SSE connection failed: ${response.status}`);
      if (!response.body || !response.body.getReader) {
        throw new Error("The browser does not support streaming responses");
      }

      this.reconnectCount = 0;
      if (this.onStatus) this.onStatus("connected");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      const parse = createSseParser((event) => this.handleEvent(event));

      while (!this.closed) {
        const { done, value } = await reader.read();
        if (done) break;
        parse(decoder.decode(value, { stream: true }));
      }
      if (!this.closed) throw new Error("SSE connection closed");
    } catch (error) {
      if (this.closed || error.name === "AbortError") return;
      if (this.onStatus) this.onStatus("disconnected", error);
      this.scheduleReconnect();
    }
  }

  /**
   * 过滤心跳等非业务事件，解析业务数据并转交消息回调。
   * @param {{event: string, id: string, data: string}} event 已解析的 SSE 事件。
   * @returns {void}
   */
  handleEvent(event) {
    if (["heartbeat", "connected"].includes(event.event)) return;
    if (!["message", "new-repair-order"].includes(event.event)) return;

    let data = event.data;
    try {
      data = JSON.parse(event.data);
    } catch (error) {
      data = { faultSiteName: event.data };
    }
    if (this.onMessage) {
      this.onMessage(Object.assign({ eventId: event.id }, data));
    }
  }

  /**
   * 按递增退避时间安排下一次连接，最长等待 30 秒。
   * @returns {void}
   */
  scheduleReconnect() {
    clearTimeout(this.reconnectTimer);
    const index = Math.min(this.reconnectCount, RECONNECT_DELAYS.length - 1);
    const delay = RECONNECT_DELAYS[index];
    this.reconnectCount += 1;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }
}
