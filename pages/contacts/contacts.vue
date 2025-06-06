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
        @click="goToChat(contact.conversation)"
      >
      <!-- contact.unreadMessageCount为0时不显示,大于99显示99+ -->
        <view class="avatar">
          <image :src="contact.cover" :alt="contact.name" />
          <view v-if="contact.unreadMessageCount" class="badge">{{ contact.unreadMessageCount > 99 ? '99+' : contact.unreadMessageCount }}</view>
        </view>
        <view class="info">
          <view class="name">{{ contact.name }}</view>
          <view class="last-msg">{{ contact.lastMessageContent }}</view>
        </view>
        <view class="right-content">
          <view class="time">{{ formatTime(contact.lastTime) }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad,onShow } from '@dcloudio/uni-app';
import {getListByPage,clearUnread} from "../../api/api";
import { useWebSocket } from '../../utils/useWebSocket.js';
// 搜索框绑定的值
const searchQuery = ref('');
const token = uni.getStorageSync('token');
const ws = useWebSocket(token);
// 联系人列表数据
const contacts = ref([]);

// 过滤联系人列表
const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value;
  return contacts.value.filter(contact =>
    contact.name.includes(searchQuery.value) || 
    contact.lastMessageContent.includes(searchQuery.value)
  );
});
const beforeTime=ref(new Date().getTime()-9000000);
let wsMessageListener = async(event) => {
    try {
      console.log('WebSocket 消息:', event.data);
      const data = JSON.parse(event.data);
      console.log('解析后的消息:', data);
      // 判断当前时间与 beforeTime 的差值是否大于 1 秒
      const now = new Date().getTime();
      console.log('当前时间:', now, '上次更新时间:', beforeTime.value);
      if (now - beforeTime.value > 1000) {
        beforeTime.value = now;
        const res = await getListByPage(1, 100);
        console.log("获取联系人列表:", res);
        contacts.value = res.list.map(item => ({
          id: item.id,
          name: item.name,
          cover: item.cover, 
          lastMessageContent: item.lastMessage?.content?.text || '', 
          lastTime: item.lastMessage?.createTime,
          unreadMessageCount: item.unreadMessageCount,
          type: item.type,
          lastMessage: item.lastMessage,
          conversation: {
            "id": item.id,
            "type": item.type,
            "name": item.name,
            "cover": item.cover
          }
        }));
      } else {
        // 跳过刷新
        console.log('1秒内重复消息，跳过刷新');
      }
    } catch (e) {
      console.error('消息解析失败', e);
    }
};

onShow(async() => {
  const res=await getListByPage(1, 100);
  console.log("获取联系人列表:", res);
  contacts.value = res.list.map(item => ({
      id: item.id,
      name: item.name,
      cover: item.cover, 
      lastMessageContent: item.lastMessage?.content?.text || '', 
      lastTime: item.lastMessage?.createTime ,
      unreadMessageCount: item.unreadMessageCount,
      type: item.type,
      lastMessage:item.lastMessage,
      conversation:{
        "id":item.id,
        "type":item.type,
        "name":item.name,
        "cover":item.cover
      }
  }));
  // 注册 WebSocket 消息监听
  ws.onMessage(wsMessageListener);
});

// 格式化时间显示
const formatTime = (time) => {
  if (!(time instanceof Date)) {
    time = new Date();
    console.log(time)
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
const goToChat = (conversation) => {
  console.log("跳转到聊天页面conversation", conversation);
  const conversationStr = encodeURIComponent(JSON.stringify(conversation));
    uni.navigateTo({
      url: `/pages/chat/chat?conversation=${conversationStr}`
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