import { ref } from 'vue';

const wss = ref(null);
const isConnected = ref(false);
const listeners = [];

let url = '';

export function useWebSocket(token) {
  // 初始化连接
  function connect() {
    url = "wss://joinup.org.cn/chat";
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}token=${encodeURIComponent(token)}`;
    wss.value = uni.connectSocket({
      url,
      success: () => console.log("WebSocket连接已创建"),
      fail: (err) => console.error("WebSocket连接失败:", err)
    });
    wss.value.onOpen(() => {
      isConnected.value = true;
      console.log("WebSocket连接已打开");
    });
    wss.value.onClose(() => {
      isConnected.value = false;
      console.log("WebSocket连接已关闭");
    });
    wss.value.onError(() => {
      isConnected.value = false;
      console.error("WebSocket错误");
    });
    wss.value.onMessage((event) => {
      listeners.forEach(fn => fn(event));
    });
  }

  // 发送消息
  function sendMessage(conversation) {
    if (isConnected.value && wss.value) {
      wss.value.send({
        data: JSON.stringify(conversation),
        success: () => console.log("消息发送成功:", conversation),
        fail: (err) => console.error("消息发送失败:", err)
      });
    } else {
      console.error("WebSocket未连接");
    }
  }

  // 注册消息监听
  function onMessage(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  return {
    connect,
    sendMessage,
    onMessage,
    isConnected
  };
}