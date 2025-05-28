<template>
  <view class="chat-page">
    <!-- 聊天头部 -->
    <view class="chat-header">
      <view class="header-left">
        <uni-icons 
          type="arrowleft" 
          size="24" 
          color="#fff" 
          @click="goBack"
        ></uni-icons>
        <view class="header-info" >
          <view class="avatar">
            <image :src="contact?.cover" :alt="contact?.name" />
          </view>
          <view class="info">
            <text class="name">{{ contact?.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 聊天内容区域 -->
    <scroll-view 
      class="chat-container" 
      scroll-y 
      :scroll-top="scrollTop" 
      scroll-with-animation
      @scroll="onScroll"
      @scrolltoupper="loadMoreHistoryMessages"
    >
      <view v-if="isLoading" class="loading-indicator">
        <text>加载中...</text>
      </view>
      <view
        v-for="(msg, index) in messages.slice().reverse()"
        :key="msg.id"
        class="message-container"
        :class="msg.sender?.id !== userInfo.id ? 'message-left' : 'message-right'"
      >
        <!-- 左侧消息（对方） -->
        <template v-if="msg.sender.id !== userInfo.id">
          <view class="avatar" v-if="contact?.type === 'private'">
            <image :src="contact?.cover" :alt="contact?.name" />
          </view>
          <view class="avatar" v-else>
            <image :src="msg.sender.avatar" :alt="msg.sender.username" />
          </view>
          <view class="message-content">
            <view class="message-bubble bubble-left">
              <text class="message-text">{{ msg.content.text }}</text>
              <view class="message-meta">
                <text class="message-time">{{ formatMessageTime(msg.createTime) }}</text>
              </view>
            </view>
          </view>
        </template>
        <!-- 右侧消息（自己） -->
        <template v-else>
          <view class="message-content">
            <view class="message-bubble bubble-right">
              <text class="message-text">{{ msg.content.text }}</text>
              <view class="message-meta">
                <text class="message-time">{{ formatMessageTime(msg.createTime) }}</text>
              </view>
            </view>
          </view>
          <view class="avatar">
            <image :src="userInfo.avatar" :alt="userInfo.username" />
          </view>
        </template>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <view class="input-tools">
        <uni-icons 
          type="mic" 
          size="24" 
          color="#7d7e80" 
        ></uni-icons>
        <uni-icons 
          type="plus" 
          size="24" 
          color="#7d7e80" 
        ></uni-icons>
      </view>
      <view class="input-box">
        <input 
          v-model="inputMessage" 
          type="text" 
          placeholder="输入消息..." 
          confirm-type="send"
          @confirm="sendMessage"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
      </view>
      <view class="send-btn" @click="sendMessage" v-if="inputMessage.trim()">
        <text>发送</text>
      </view>
      <view class="send-btn disabled" v-else>
        <text>发送</text>
      </view>
    </view>
    <!-- 更多工具 -->
    <view class="more-tools" v-if="showMoreTools">
      <view class="tool-item" @click="sendImage">
        <uni-icons type="image" size="28" color="#7d7e80"></uni-icons>
        <text>照片</text>
      </view>
      <view class="tool-item" @click="sendCamera">
        <uni-icons type="camera" size="28" color="#7d7e80"></uni-icons>
        <text>拍摄</text>
      </view>
      <view class="tool-item" @click="sendLocation">
        <uni-icons type="location" size="28" color="#7d7e80"></uni-icons>
        <text>位置</text>
      </view>
    </view>

    <!-- 语音输入 -->
    <view class="voice-input" v-if="voiceInputMode">
      <view class="voice-tip">按住说话</view>
      <button 
        class="voice-btn" 
        @touchstart="startRecording" 
        @touchend="stopRecording"
      ></button>
    </view>

  </view>

</template>

<script setup>
import { ref, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getConversionRecord,clearUnread } from "../../api/api";
import { useWebSocket } from '../../utils/useWebSocket.js';

const userInfo = ref(uni.getStorageSync('userInfo'));
const contact = ref(null);
const messages = ref([]);
const inputMessage = ref('');
const showMoreTools = ref(false);
const voiceInputMode = ref(false);
const scrollTop = ref(0);

const token = uni.getStorageSync('token');
const ws = useWebSocket(token);
const senderNow=ref({id:1,name:2});
const receiverIdNow=ref(null);
const lastSelectId=ref(null);
const isLoading = ref(false);

onLoad(async (options) => {
  contact.value = JSON.parse(decodeURIComponent(options.conversation));
  await clearUnread(contact.value.id);
  await loadMessages(String(contact.value.id));
  // 注册 WebSocket 消息监听
  ws.onMessage(wsMessageListener);
});

const wsMessageListener = async(event) => {
    try {
      console.log('WebSocket 消息:', event.data);
      const data = JSON.parse(event.data);
      console.log('解析后的消息:', data);
      console.log('当前会话 ID:', contact.value.id);
      // 判断是否是当前会话的消息
      if (data.conversation.id === contact.value.id) {
        messages.value = [
          {
            id: data.id,
            sender: data.sender ,
            content: data.content,
            createTime: data.createTime,
            type: data.type,
            receiverId:data.receiverId,
            conversation:data.conversation,
          },
          ...messages.value
        ];  
      }
      nextTick(scrollToBottom);
    } catch (e) {
      console.error('消息解析失败', e);
    }
};

const loadMessages = async () => {
  const res = await getConversionRecord(contact.value.id, 999999999, 10);
  if (res.list.length > 0) {
    lastSelectId.value = res.list[res.list.length - 1].id; // Set lastSelectId to the ID of the last message
  }
  messages.value = [ ...res.list];
  nextTick(scrollToBottom);
  console.log('加载消息记录:', messages);
};


const loadMoreHistoryMessages = async () => {
  if (isLoading.value) return; // 防止重复加载
  isLoading.value = true; // 开始加载

  try {
    const res = await getConversionRecord(contact.value.id, lastSelectId.value, 10);
    if (res.list && res.list.length) {
      // 新历史消息追加到 messages 的末尾
      messages.value = [...messages.value,...res.list]; // 将新消息放在前面
      lastSelectId.value = res.list[res.list.length - 1].id; // Set lastSelectId to the ID of the last message
    } else {
      console.log("没有更多历史消息");
      uni.showToast({
        title: '没有更多历史消息',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('加载历史消息失败', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    isLoading.value = false; // 加载结束
  }
};

const sendMessage = async() => {
  if (!inputMessage.value.trim()) return;
  senderNow.value.id=uni.getStorageSync('userInfo').id;
  senderNow.value.avatar=uni.getStorageSync('userInfo').avatar;
  const msgObj = {
    conversationId: contact.value.id,
    content: { text: inputMessage.value },
    type: 'TEXT'
  };
  receiverIdNow.value= uni.getStorageSync('userInfo').id;
  messages.value = [
    {
      id: 5,
      sender: senderNow ,  //
      content: msgObj.content,
      createTime: new Date(),
      type: msgObj.type,
      receiverId:receiverIdNow,  //
      conversation:contact,  //
    },
    ...messages.value
  ];
  // 通过 WebSocket 发送
  await ws.sendMessage(msgObj);
  nextTick(scrollToBottom);
  inputMessage.value = '';
};

const scrollToBottom = () => {
  scrollTop.value =  scrollTop.value+99999;
};

// 格式化消息时间
const formatMessageTime = (time) => {
  if (!(time instanceof Date)) {
    time = new Date(time);
  }
  
  const now = new Date();
  const diffMinutes = Math.floor((now - time) / (1000 * 60));
  
  if (diffMinutes < 1) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

const goBack = () => {
  uni.navigateBack();
};
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 头部样式 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #1aad19;
  color: #fff;
  height: 44px;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-info {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.header-info .avatar {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
}

.header-info .avatar image {
  width: 100%;
  height: 100%;
}

.header-info .name {
  font-size: 16px;
  font-weight: bold;
}

.header-info .status {
  font-size: 12px;
  margin-top: 2px;
}

.header-right {
  display: flex;
  align-items: center;
}

/* 聊天内容区域 */
.chat-container {
  flex: 1;
  padding: 10px 15px;
  overflow-y: auto;
  background-color: #e5e5e5;
}

.load-more {
  padding: 10px 0;
  text-align: center;
}

.message-container {
  display: flex;
  margin-bottom: 15px;
}

.message-left {
  justify-content: flex-start;
}

.message-right {
  justify-content: flex-end;
}

.avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  align-self: flex-end;
}

.avatar image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.message-content {
  max-width: 70%;
}

.message-bubble {
  padding: 10px 12px;
  border-radius: 5px;
  position: relative;
  word-break: break-word;
}

.bubble-left {
  background-color: #fff;
  margin-left: 0;
}

.bubble-right {
  background-color: #95ec69;
  margin-right: 0;
}

.message-text {
  font-size: 16px;
  line-height: 1.4;
}

.message-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-right: 5px;
}

/* 输入区域 */
.input-area {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background-color: #f7f7f7;
  border-top: 1px solid #ddd;
}

.input-tools {
  display: flex;
  margin-right: 10px;
}

.input-box {
  flex: 1;
  background-color: #fff;
  border-radius: 5px;
  padding: 5px 10px;
}

.input-box input {
  height: 36px;
  font-size: 16px;
}

.send-btn {
  margin-left: 10px;
  padding: 8px 15px;
  background-color: #1aad19;
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
}

.send-btn.disabled {
  background-color: #ccc;
  color: #fff;
}

/* 更多工具 */
.more-tools {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  background-color: #f7f7f7;
  border-top: 1px solid #ddd;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  padding: 10px 0;
}

.tool-item text {
  font-size: 12px;
  color: #7d7e80;
  margin-top: 5px;
}

/* 语音输入 */
.voice-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: #f7f7f7;
  border-top: 1px solid #ddd;
}

.voice-tip {
  font-size: 14px;
  color: #7d7e80;
  margin-bottom: 15px;
}

.voice-btn {
  width: 120px;
  height: 40px;
  background-color: #f1f1f1;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* 操作菜单 */
.action-sheet {
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.action-item {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
  font-size: 16px;
}

.action-item.cancel {
  margin-top: 10px;
  border-top: 1px solid #f5f5f5;
}
</style>