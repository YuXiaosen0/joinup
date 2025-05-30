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
      restart()
    });
    wss.value.onError(() => {
      isConnected.value = false;
      console.error("WebSocket错误");
      restart()
    });
    wss.value.onMessage((event) => {
      listeners.forEach(fn => fn(event));
      // 解析消息内容
      const data = JSON.parse(event.data);
      console.log("收到消息:", data);
      // 获取当前用户ID（假设当前用户ID存储在localStorage或者Vuex中）
      const userId = uni.getStorageSync('userInfo').id; // 你可以根据实际情况替换这个值
      // 判断消息是否是发给当前用户的
      if (data.receiverId == userId) {
        // 如果消息是发给当前用户，显示全局弹窗
        // uni.showToast({
        //   title: '你有一条新消息',
        //   icon: 'success', // 使用 success 图标，或其他类型如 'none', 'loading'
        //   duration: 3000, // 增加弹窗时长，让用户有足够的时间看到
        // });
        const currentPage = getCurrentPages().pop().route;
        if (currentPage !== 'pages/chat/chat') {
          uni.showModal({
            title: '新消息通知',
            content: '你有一条新消息，点击查看。',
            showCancel: true, // 不显示取消按钮
            confirmText: '查看',
            success: (res) => {
              if (res.confirm) {
                // 用户点击了确认按钮
                uni.navigateTo({
                  url: `/pages/chat/chat?conversation=${JSON.stringify(data.conversation)}` // 修改为你需要跳转的页面路径和参数
                });
              }
            }
          });
        }
      }else{
        console.log("no")
      }
    });
  }

function restart() {
    // Avoid creating multiple intervals or WebSocket connections
    if (wss.value && wss.value.readyState !== wss.value.CLOSED) {
      console.log("WebSocket 已经在连接中或已关闭，不重新连接");
      return;
    }

    // Start attempting to reconnect
    let time = setInterval(() => {
      // Create a new WebSocket if there is no active connection
      wss.value = uni.connectSocket({
        url,
        success: () => console.log("WebSocket连接已创建"),
        fail: (err) => console.error("WebSocket连接失败:", err)
      });

      // Check if the WebSocket is connecting
      wss.value.onOpen(() => {
        clearInterval(time); // Connection established, clear the interval
        time = null;
        isConnected.value = true;
        console.log("WebSocket连接已打开");

        // Add event listeners to the new WebSocket
        wss.value.onClose(() => {
          isConnected.value = false;
          console.log("WebSocket连接已关闭");
          restart();
        });

        wss.value.onError(() => {
          isConnected.value = false;
          console.error("WebSocket错误");
          restart();
        });

        wss.value.onMessage((event) => {
          listeners.forEach(fn => fn(event));
          try {
            const data = JSON.parse(event.data);
            console.log("收到消息:", data);
            const userId = uni.getStorageSync('userInfo').id; 
            if (data.receiverId == userId) {
              uni.showToast({
                title: '你有一条新消息',
                icon: 'success',
                duration: 3000,
              });
            } else {
              console.log("no")
            }
          } catch (error) {
            console.error("消息解析失败:", error);
          }
        });
      });

      // Ensure WebSocket connection is open
      if (wss.value.readyState === wss.value.OPEN) {
        clearInterval(time); // Connection established, clear the interval
        time = null;
        isConnected.value = true;
        console.log("WebSocket连接成功！");
      }

    }, 10000); // Set a more reasonable reconnect interval (e.g., 10 seconds)
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
      restart()
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
    isConnected,
    restart
  };
}