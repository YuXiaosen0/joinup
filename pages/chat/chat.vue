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
            <image :src="contact?.avatar" :alt="contact?.name" />
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
      @scrolltolower="loadMoreMessages"
    >
      <view class="load-more" v-if="loading">
        <uni-load-more status="loading"></uni-load-more>
      </view>
      <!-- 展示每一条消息 -->
      <view v-for="(msg, index) in messages"  :key="msg.id" 
        class="message-container"
        :class="{'message-left': msg.sender === 'other','message-right': msg.sender === 'me'}">
        <!-- 头像（对方消息显示） -->
        <view class="avatar" v-if="msg.sender === 'other'">
          <image :src="contact?.avatar" :alt="contact?.name" />
        </view>
        
        <!-- 消息内容 -->
        <view class="message-content">
          <view 
            class="message-bubble" 
            :class="{
              'bubble-left': msg.sender === 'other',
              'bubble-right': msg.sender === 'me'
            }"
          >
            <text class="message-text">{{ msg.content }}</text>
            <view class="message-meta">
              <text class="message-time">{{ formatMessageTime(msg.time) }}</text>
            </view>
          </view>
        </view>			
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <view class="input-tools">
        <uni-icons 
          type="mic" 
          size="24" 
          color="#7d7e80" 
          @click="startVoiceInput"
        ></uni-icons>
        <uni-icons 
          type="plus" 
          size="24" 
          color="#7d7e80" 
          @click="toggleMoreTools"
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
import { ref, computed, onMounted, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 当前联系人数据
const contact = ref(null);
const messages = ref([]);
const inputMessage = ref('');
const scrollTop = ref(0);
const loading = ref(false);
const showMoreTools = ref(false);
const voiceInputMode = ref(false);

// 页面加载时获取联系人数据
onLoad((options) => {
  const contactId = Number(options.id);
  
  // 模拟从数据库获取联系人数据
  const contacts = [
    {
      id: 1,
      name: '张三',
      avatar: '../../static/resource/images/avatar_def.png'
    },
    {
      id: 2,
      name: '李四',
      avatar: '../../static/resource/images/avatar_def.png'
    }
  ];
  
  // 根据 ID 查找联系人
  contact.value = contacts.find((c) => c.id === contactId);
  
  // 加载初始消息
  loadMessages();

});

// 加载消息
const loadMessages = () => {
  loading.value = true;
  
  // 模拟从数据库获取消息
  setTimeout(() => {
    const initialMessages = [
      { id: 1, sender: 'other', content: '你好，最近怎么样？', time: new Date(Date.now() - 60000), status: 'sent' },
      { id: 2, sender: 'me', content: '还不错，你呢？', time: new Date(Date.now() - 30000), status: 'sent' }
    ];
    
    messages.value = initialMessages;
    loading.value = false;
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom();
    });
  }, 500);
};

// 加载更多消息
const loadMoreMessages = () => {
  if (loading.value) return;
  
  loading.value = true;
  
  // 模拟加载更多消息
  setTimeout(() => {
    const moreMessages = [
      { id: 3, sender: 'other', content: '上次说的项目进展如何了？', time: new Date(Date.now() - 86400000), status: 'sent' },
      { id: 4, sender: 'me', content: '正在按计划进行，下周可以完成第一阶段', time: new Date(Date.now() - 86300000), status: 'sent' }
    ];
    
    messages.value = [...moreMessages, ...messages.value];
    loading.value = false;
  }, 800);
};

// 发送消息
const sendMessage = () => {
	//  防止空消息发送
  if (!inputMessage.value.trim()) return;
  // TODO 新消息的id设置为
  const newMsg = {
    id: Date.now(),
    sender: 'me',
    content: inputMessage.value,
    time: new Date(),
    status: 'sending'
  };
  
  // 添加到消息列表
  messages.value = [...messages.value, newMsg];
  
  // 清空输入框
  inputMessage.value = '';
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom();
  });
  
  // 模拟发送成功
  setTimeout(() => {
    newMsg.status = 'sent';
    messages.value = [...messages.value];
    
    // 模拟回复
    setTimeout(() => {
      receiveMessage('好的，有进展随时沟通');
    }, 1500);
  }, 800);
};

// 接收消息
const receiveMessage = (content) => {
  const newMsg = {
    id: Date.now(),
    sender: 'other',
    content: content,
    time: new Date(),
    status: 'sent'
  };
  
  messages.value = [...messages.value, newMsg];
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom();
  });
};

// 滚动到底部
const scrollToBottom = () => {
  scrollTop.value = 999999;// 设置一个足够大的值，确保滚动到底部
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

// 返回
const goBack = () => {
  uni.navigateBack();
};

// 切换到语音输入
const startVoiceInput = () => {
  voiceInputMode.value = !voiceInputMode.value;
};

// 开始录音
const startRecording = () => {
  console.log('开始录音');
};

// 停止录音
const stopRecording = () => {
  console.log('停止录音');
  voiceInputMode.value = false;
};

// 发送图片
const sendImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const tempFilePaths = res.tempFilePaths;
      const newMsg = {
        id: Date.now(),
        sender: 'me',
        content: '[图片]',
        time: new Date(),
        status: 'sending',
        image: tempFilePaths[0]
      };
      
      messages.value = [...messages.value, newMsg];
      showMoreTools.value = false;
      
      // 滚动到底部
      nextTick(() => {
        scrollToBottom();
      });
      
      // 模拟发送成功
      setTimeout(() => {
        newMsg.status = 'sent';
        messages.value = [...messages.value];
      }, 800);
    }
  });
};

// 发送拍摄照片
const sendCamera = () => {
  uni.chooseImage({
    sourceType: ['camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths;
      const newMsg = {
        id: Date.now(),
        sender: 'me',
        content: '[照片]',
        time: new Date(),
        status: 'sending',
        image: tempFilePaths[0]
      };
      
      messages.value = [...messages.value, newMsg];
      showMoreTools.value = false;
      
      // 滚动到底部
      nextTick(() => {
        scrollToBottom();
      });
      
      // 模拟发送成功
      setTimeout(() => {
        newMsg.status = 'sent';
        messages.value = [...messages.value];
      }, 800);
    }
  });
};

// 发送位置
const sendLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      const newMsg = {
        id: Date.now(),
        sender: 'me',
        content: `[位置]${res.name}`,
        time: new Date(),
        status: 'sending',
        location: res
      };
      
      messages.value = [...messages.value, newMsg];
      showMoreTools.value = false;
      
      // 滚动到底部
      nextTick(() => {
        scrollToBottom();
      });
      
      // 模拟发送成功
      setTimeout(() => {
        newMsg.status = 'sent';
        messages.value = [...messages.value];
      }, 800);
    }
  });
};

// 切换更多工具
const toggleMoreTools = () => {
  showMoreTools.value = !showMoreTools.value;
};

// 输入框获取焦点
const onInputFocus = () => {
  showMoreTools.value = false;
};

// 输入框失去焦点
const onInputBlur = () => {
  // 延迟处理，避免影响其他点击事件
  setTimeout(() => {
    showMoreTools.value = false;
  }, 200);
};

// 滚动事件
const onScroll = (e) => {
  // 可以在这里实现滚动到顶部加载更多消息
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