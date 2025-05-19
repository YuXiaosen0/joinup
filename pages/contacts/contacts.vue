<template>
  <view class="contact-list">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-container">
        <uni-icons type="search" size="16" color="#999"></uni-icons>
        <input 
          type="text" 
          placeholder="搜索" 
          v-model="searchQuery" 
          placeholder-class="placeholder"
          confirm-type="search"
        />
      </view>
    </view>
    
    <!-- 联系人列表 -->
    <scroll-view class="contacts" scroll-y>
      
      <!-- 联系人列表 -->
      <view 
        v-for="contact in filteredContacts" 
        :key="contact.id" 
        class="contact-item" 
        @click="goToChat(contact.id)"
      >
        <view class="avatar">
          <image :src="contact.avatar" :alt="contact.name" />
          <view v-if="contact.unread" class="badge">{{ contact.unread > 99 ? '99+' : contact.unread }}</view>
        </view>
        <view class="info">
          <view class="name">{{ contact.name }}</view>
          <view class="last-msg">{{ contact.lastMessage }}</view>
        </view>
        <view class="right-content">
          <view class="time">{{ formatTime(contact.lastTime) }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
  <button @click="sendMessage(`Hello, rcx,gaochaole! `)">点击</button>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 搜索框绑定的值
const searchQuery = ref('');

// 联系人列表数据
const contacts = ref([
  {
    id: 1,
    name: '张三',
    avatar: '../../static/resource/images/avatar_def.png',
    lastMessage: '你好，最近怎么样？',
    lastTime: new Date(),
    unread: 2
  },
  {
    id: 2,
    name: '李四',
    avatar: '../../static/resource/images/avatar_def.png',
    lastMessage: '项目文档我已经发给你了',
    lastTime: new Date(Date.now() - 86400000), // 昨天
    unread: 0
  },
  {
    id: 3,
    name: '王五',
    avatar: '../../static/resource/images/avatar_def.png',
    lastMessage: '会议安排在下午3点',
    lastTime: new Date(Date.now() - 3 * 86400000), // 3天前
    unread: 5
  }
]);

// 过滤联系人列表
const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value;
  return contacts.value.filter(contact =>
    contact.name.includes(searchQuery.value) || 
    contact.lastMessage.includes(searchQuery.value)
  );
});
let time=null;
let wss=null;
let url=null;
let isConnected = false; // 自定义连接状态

onLoad(async() => {
  url = "wss://joinup.org.cn/chat";
  // 如果有 Token，将其作为查询参数附加到 URL
  // 使用 encodeURIComponent 对参数值进行编码，避免特殊字符破坏 URL
  let token = uni.getStorageSync('token');
  const separator = url.includes('?') ? '&' : '?';
  url = `${url}${separator}token=${encodeURIComponent(token)}`;
  console.log("WebSocket连接地址:", url);

  // 使用 uni.connectSocket 创建 WebSocket 连接
  wss = uni.connectSocket({
    url: url,
    success: () => {
      console.log("WebSocket连接已创建");
    },
    fail: (err) => {
      console.error("WebSocket连接失败:", err);
    }
  });

  // 绑定事件
  wss.onOpen(openHandle);
  wss.onClose(closeHandle);
  wss.onMessage(messageHandle);
  wss.onError(errorHandle);
  
});

const openHandle = () => {
  isConnected = true;
  console.log("WebSocket连接已打开");
};

const closeHandle = () => {
  isConnected = false;
  console.log("WebSocket连接已关闭");
};

const messageHandle = (event) => {
  console.log("收到消息:", event.data);
};

const errorHandle = () => {
  console.error("WebSocket错误");
};

const sendMessage = (message) => {
  if (isConnected) {
    wss.send({
      data: message,
      success: () => {
        console.log("消息发送成功:", message);
      },
      fail: (err) => {
        console.error("消息发送失败:", err);
      }
    });
  } else {
    console.error("WebSocket未连接");
  }
};

const restart=()=>{
  time=setInterval(() => {
    wss=new WebSocket(url);
    if(wss.readyState===0){
      clearInterval(time);
      time=null;
      wss.addEventListener("open",openHandle);
      wss.addEventListener("close",closeHandle);
      wss.addEventListener("message",messageHandle);
      wss.addEventListener("error",errorHandle);
      console.log("重连成功");
    }
  }, 1000);
};

// 格式化时间显示
const formatTime = (time) => {
  if (!(time instanceof Date)) {
    time = new Date(time);
  }
  
  const now = new Date();
  const diffDays = Math.floor((now - time) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][time.getDay()];
  } else {
    return time.toLocaleDateString([], { month: 'numeric', day: 'numeric' });
  }
};

// 跳转到聊天页面
const goToChat = (contactId) => {
  uni.navigateTo({
    url: `/pages/chat/chat?id=${contactId}`
  });
};

</script>

<style scoped>
.contact-list {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f7f7;
}

.search-bar {
  padding: 10px 15px;
  background-color: #ededed;
}

.search-container {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background-color: #fff;
  border-radius: 5px;
}

.search-container input {
  flex: 1;
  margin-left: 8px;
  font-size: 14px;
}

.placeholder {
  color: #999;
}

.quick-actions {
  background-color: #fff;
  margin-bottom: 10px;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f5f5f5;
}

.action-icon {
  width: 24px;
  height: 24px;
  margin-right: 15px;
}

.action-icon image {
  width: 100%;
  height: 100%;
}

.action-text {
  font-size: 16px;
}

.contacts {
  flex: 1;
  height: calc(100vh - 50px);
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
}

.avatar {
  width: 45px;
  height: 45px;
  margin-right: 12px;
  position: relative;
}

.avatar image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background-color: #f44336;
  color: white;
  border-radius: 9px;
  font-size: 12px;
  text-align: center;
  line-height: 18px;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.name {
  font-size: 16px;
  color: #000;
  margin-bottom: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.last-msg {
  font-size: 13px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 10px;
}

.time {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

</style>