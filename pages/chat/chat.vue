<template>
  <view class="chat-page">
    <!-- 聊天头部（添加更多按钮） -->
    <view class="chat-header">
      <view class="header-left">
        <uni-icons type="arrowleft" size="24" color="#fff" @click="goBack"></uni-icons>
        <view class="header-info">
          <view class="avatar">
            <image :src="contact?.cover" :alt="contact?.name" />
          </view>
          <view class="info">
            <text class="name">{{ contact?.name }}</text>
          </view>
        </view>
      </view>
      <view class="header-right">
        <uni-icons 
          type="more" 
          size="24" 
          color="#fff" 
          @click="showSearchPopup"
        ></uni-icons>
      </view>
    </view>
    <!-- 聊天记录搜索弹窗 -->
    <uni-popup 
      v-if="showResults" 
      type="center" 
      :mask-click="false"
      :safe-area="false"
    >
      <view class="search-dialog">
        <view class="dialog-header">
          <text class="header-title">查找聊天记录</text>
          <uni-icons 
            type="close" 
            size="20" 
            color="#999" 
            @click="closeSearchPopup"
          ></uni-icons>
        </view>
        
        <!-- 搜索条件 -->
        <view class="search-conditions">
          <!-- 日期选择 -->
          <view class="condition-item">
            <text class="condition-label">日期</text>
            <picker 
              mode="date" 
              :value="searchDate" 
              @change="onDateChange"
            >
              <view class="picker">
                {{ searchDate || '选择日期' }}
                <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
              </view>
            </picker>
          </view>
          
          <!-- 消息类型选择 -->
          <view class="condition-item">
            <text class="condition-label">消息类型</text>
            <picker 
              mode="selector" 
              :range="messageTypes" 
              range-key="label"
              @change="onTypeChange"
            >
              <view class="picker">
                {{ selectedType.label || '全部类型' }}
                <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
              </view>
            </picker>
          </view>
          
          <!-- 内容搜索 -->
          <view class="condition-item">
            <text class="condition-label">内容包含</text>
            <view class="search-input">
              <input 
                v-model="searchKeyword" 
                placeholder="输入关键词" 
                @confirm="searchMessages"
              />
              <uni-icons 
                v-if="searchKeyword" 
                type="clear" 
                size="16" 
                color="#999" 
                @click="clearSearch"
              ></uni-icons>
            </view>
          </view>
        </view>
        
        <!-- 搜索按钮 -->
        <button class="search-btn" @click="searchMessages">搜索</button>
        
        <!-- 搜索结果 -->
        <view class="search-results" v-if="showResults1">
          <view class="result-count">
            共找到 {{ filteredMessages.length }} 条相关聊天记录
          </view>
          <scroll-view class="result-list" scroll-y>
            <view 
              v-for="(msg, index) in filteredMessages" 
              :key="index" 
              class="result-item"
              @click="selectMessage(msg)"
              :class="{'result-item-active': activeMessageId === msg.id}"
            >
              <view class="result-content">
                <text class="sender" :style="{color: msg.sender.id === userInfo.id ? '#576b95' : '#07c160'}">
                  {{ msg.sender.id === userInfo.id ? '我' : msg.sender.username }}:
                </text>
                <view class="message-bubble">
                  <text class="text">{{ msg.content.text }}</text>
                </view>
              </view>
              <view class="result-meta">
                <text class="time">{{ formatMessageTime(msg.createTime) }}</text>
                <text class="type">{{ getTypeLabel(msg.type) }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </uni-popup>

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
          <view style="margin: 8px;"></view> <!-- 设置 20px 的空白间距 -->
          <view class="message-content">
            <view class="message-bubble bubble-left" v-if="msg.content.text!=null">
              <text class="message-text">{{ msg.content.text }}</text>
              <view class="message-meta">
                <text class="message-time">{{ formatMessageTime(msg.createTime) }}</text>
              </view>
            </view>
			      <view class="message-bubble bubble-left" v-else-if="msg.content.groupName!=null" @click="addQun(msg)">
              <view class="group-card">
                <image class="group-cover" :src="msg.content.cover" alt="Group Cover" />
                <text class="group-name">{{ msg.content.groupName }}</text>
              </view>
              <text class="message-text">点击加入队伍</text>
            </view>
            <view  v-else>
              <image
                class="chat-image"
                :src="msg.content.url"
                mode="aspectFill"
                :lazy-load="true"
                :style="{
                  width: 100 + 'px',
                  height: 100 + 'px'
                }"
              />
              <view class="message-meta">
                <text class="message-time">{{ formatMessageTime(msg.createTime) }}</text>
              </view>
            </view>
          </view>
        </template>
        <!-- 右侧消息（自己） -->
        <template v-else>
          <view class="message-content">
            <view class="message-bubble bubble-right" v-if="msg.content.text!=null">
              <text class="message-text">{{ msg.content.text }}</text>
              <view class="message-meta">
                <text class="message-time">{{ formatMessageTime(msg.createTime) }}</text>
              </view>
            </view>
            <view class="message-bubble bubble-left" v-else-if="msg.content.groupName!=null" @click="addQun(msg)">
              <view class="group-card">
                <image class="group-cover" :src="msg.content.cover" alt="Group Cover" />
                <text class="group-name">{{ msg.content.groupName }}</text>
              </view>
              <text class="message-text">点击加入队伍</text>
            </view>
            <view  v-else>
              <image
                class="chat-image"
                :src="msg.content.url"
                mode="aspectFill"
                :lazy-load="true"
                :style="{
                  width: 100 + 'px',
                  height: 100 + 'px'
                }"
              />
              <view class="message-meta">
                <text class="message-time">{{ formatMessageTime(msg.createTime) }}</text>
              </view>
            </view>
          </view>
          <view style="margin: 8px;"></view> <!-- 设置 20px 的空白间距 -->
          <view class="avatar">
            <image :src="userInfo.avatar" :alt="userInfo.username" />
          </view>
        </template>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <view class="input-tools"  @click="showMoreTools = !showMoreTools">
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
      <view class="tool-item" @click="chooseFile">
        <uni-icons type="location" size="28" color="#7d7e80"></uni-icons>
        <text>上传文件</text>
      </view>
      
        <!-- Group List Dialog -->
        <view v-if="showDialog" class="group-dialog-mask">
          <view class="group-dialog-container">
            <!-- 对话框头部 -->
            <view class="dialog-header">
              <text class="header-title">选择群聊</text>
              <view class="close-btn" @click="closeDialog">
                <uni-icons type="close" size="22" color="#888"></uni-icons>
              </view>
            </view>
            
            <!-- 搜索框 -->
            <view class="search-bar">
              <uni-icons type="search" size="18" color="#999" class="search-icon"></uni-icons>
              <input 
                class="search-input" 
                placeholder="搜索" 
                placeholder-class="placeholder"
              />
            </view>
            
            <!-- 群聊列表 -->
            <scroll-view class="group-list" scroll-y>
              <view 
                v-for="group in groupList" 
                :key="group.teamId" 
                class="group-item"
                @click="selectGroup(group)"
              >
                <image class="group-avatar" :src="group.cover || '/static/images/default-group.png'" mode="aspectFill" />
                <text class="group-name">{{ group.groupName }}</text>
                <view class="group-check">
                  <view class="check-icon" :class="{ 'checked': selectedGroupId === group.teamId }"></view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
    </view>

  </view>

</template>

<script setup>
import { ref, nextTick,computed } from 'vue';
import { onLoad,onShow,onUnload } from '@dcloudio/uni-app';
import { getConversionRecord,clearUnread,searchMessagesApi,getListByPage
  ,getTeamDetails,faQiDuiWuConversation,clearUn,noticeId } from "../../api/api";
import { useWebSocket } from '../../utils/useWebSocket.js';

const userInfo = ref(uni.getStorageSync('userInfo'));
const contact = ref(null);
const messages = ref([]);
const inputMessage = ref('');
const showMoreTools = ref(false);
const showDialog = ref(false);
const scrollTop = ref(0);
const token = uni.getStorageSync('token');
const ws = useWebSocket(token);
const senderNow=ref({id:1,name:2});
const receiverIdNow=ref(null);
const lastSelectId=ref(null);
const isLoading = ref(false);

const searchDate = ref('');
const searchKeyword = ref('');
const selectedType = ref({ value: '', label: '全部类型' });
const showResults = ref(false);
const showResults1 = ref(false);

const groupList = ref([
  { teamId: 1, conversationId: 'abc123', groupName: '群聊 1' },
  { teamId: 2, conversationId: 'def456', groupName: '群聊 2' },
  { teamId: 3, conversationId: 'ghi789', groupName: '群聊 3' },
]);
// 消息类型选项
const messageTypes = ref([
  { value: '', label: '全部类型' },
  { value: 'TEXT', label: '文字' },
	{ value: 'IMAGE', label: '图片' },
	{ value: 'TEAM_SHARE', label: '队伍分享' }
]);
onLoad(async (options) => {
  contact.value = JSON.parse(decodeURIComponent(options.conversation));
  await clearUnread(contact.value.id);
  await loadMessages(String(contact.value.id));
  // await noticeId(contact.value.id)
  const res=await getListByPage(1, 100);
  console.log("获取联系人列表:", res);
  groupList.value = res.list
    .filter(item => item.type === "group" && item.id !== contact.value.id) // Add the filter condition
    .map(item => ({
      teamId: item.teamId,
      groupName: item.name,
      cover: item.cover,
      conversationId: item.id,
    }));
  // 注册 WebSocket 消息监听
  ws.onMessage(wsMessageListener);
});
// onUnload( async()=>{
//   await clearUn()
// }  ) 
// 处理文件上传
const chooseFile = async () => {
  try {
    // 选择文件
    const res = await uni.chooseImage({
      count: 1, // 只允许选择一个文件
      sizeType: ['compressed'], // 压缩图像
      sourceType: ['album', 'camera'], // 允许从相册或拍照选择
    });

    const filePath = res.tempFilePaths[0]; // 获取临时文件路径
    console.log("选择的文件路径:", filePath);

    // 上传文件
    const uploadRes = await uni.uploadFile({
      url: 'https://joinup.org.cn/api/oss/file/upload', // 替换为实际的上传接口
      filePath: filePath, // 文件路径
      name: 'file', // 后端接收文件的字段名
      header: {
        'Authorization': uni.getStorageSync('token') || '', // 如果需要鉴权，传递 token
      },
      formData: {
        // 如果需要额外的表单数据，可以在这里添加
        userId: '12345', // 示例：用户 ID
      },
    });

    // 处理上传结果
    if (uploadRes.statusCode === 200) {
      const data = JSON.parse(uploadRes.data); // 解析返回的数据
      console.log("上传成功:", data);
      uni.showToast({
        title: "上传成功",
        icon: "success",
      });
      // 发送消息
      const senderNow=ref({id:1,name:2});
      senderNow.value.id=uni.getStorageSync('userInfo').id;
      senderNow.value.avatar=uni.getStorageSync('userInfo').avatar;
      const msgObj = {
        conversationId: contact.value.id,
        content: { url:data.data.url,name:data.data.name },
        type: 'IMAGE'
      };
      messages.value = [
        {
          id: 5,
          sender: senderNow ,  //
          content: msgObj.content,
          createTime: new Date(),
          type: msgObj.type,
          receiverId:5,  //
          conversation:contact,  //
        },
        ...messages.value
      ];
      // 通过 WebSocket 发送
      await ws.sendMessage(msgObj);
      nextTick(scrollToBottom);

    } else {
      console.error("上传失败，状态码:", uploadRes.statusCode);
      uni.showToast({
        title: "上传失败",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("文件选择或上传失败:", error);
    uni.showToast({
      title: "上传失败",
      icon: "none",
    });
  }
};

const addQun = async(msg) => {
  const res=await getTeamDetails(msg.content.teamId)
  console.log("res",res)
	const item={id:
		 res.id,
	  };
	console.log(item)
  // const conversationStr = encodeURIComponent(JSON.stringify(conversation));
  uni.navigateTo({
      url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`  // 使用 encodeURIComponent 进行编码
  })
};

const openGroupDialog = () => {
  showDialog.value = true; // Show the dialog when clicked
};

const closeDialog = () => {
  showDialog.value = false; // Close the dialog
};

const selectGroup = async(group) => {
  // Log the teamId and conversationId or perform the share action
  console.log('Selected Group:', group.teamId, group.conversationId);
  
  // Here you can implement the logic to share the group chat
  // For example, you might send a message or navigate to a different page
  senderNow.value.id=uni.getStorageSync('userInfo').id;
  senderNow.value.avatar=uni.getStorageSync('userInfo').avatar;
  const msgObj = {
    conversationId: contact.value.id,
    content: { teamId: group.teamId, conversationId: group.conversationId, 
      groupName: group.groupName, cover: group.cover },
    type: 'TEAM_SHARE'
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
  // Close the dialog after selecting a group
  closeDialog();
};

// 显示搜索弹窗
const showSearchPopup = () => {
  resetSearch();
  showResults.value = true;
};

// 关闭搜索弹窗
const closeSearchPopup = () => {
  showResults.value = false;
  showResults1.value = false;
};

// 日期选择
const onDateChange = (e) => {
  searchDate.value = e.detail.value;
};

// 类型选择
const onTypeChange = (e) => {
  selectedType.value = messageTypes.value[e.detail.value];
};

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = '';
};

// 重置搜索条件
const resetSearch = () => {
  searchDate.value = '';
  searchKeyword.value = '';
  selectedType.value = messageTypes.value[0];
  showResults.value = false;
};

// 搜索消息
const searchMessages = async () => {
  if (!searchDate.value && !searchKeyword.value && !selectedType.value.value) {
    uni.showToast({
      title: '请至少选择一个搜索条件',
      icon: 'none'
    });
    return;
  }
  try {
    const params = {
      senderId:null,
      // messageType: selectedType.value.value,
      messageType: selectedType.value.value,
      messageDate: searchDate.value,
      messageContent: searchKeyword.value,
      pageNumber:1,
      pageSize:10
    };
    // showResults1.value = true;
    console.log('搜索参数:', params);
    const res = await searchMessagesApi( contact.value.id,params);
    console.log('搜索结果:', res.list);
    uni.navigateTo({
      url: `/pages/searchResults/searchResults?data=${encodeURIComponent(JSON.stringify(res.list))}` 
    });
    // filteredMessages.value = res.list;
  } catch (error) {
    uni.showToast({
      title: '搜索失败',
      icon: 'none'
    });
  }
};

// 获取类型标签
const getTypeLabel = (type) => {
  const found = messageTypes.value.find(t => t.value === type);
  return found ? found.label : type;
};

// 计算属性：筛选后的消息
const filteredMessages = computed(() => {
  return messages.value.filter(msg => {
    // 日期筛选
    if (searchDate.value) {
      const msgDate = new Date(msg.createTime).toISOString().split('T')[0];
      if (msgDate !== searchDate.value) return false;
    }
    
    // 类型筛选
    if (selectedType.value.value && msg.type !== selectedType.value.value) {
      return false;
    }
    
    // 内容筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      if (!msg.content.text || !msg.content.text.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    
    return true;
  });
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

/* 搜索弹窗样式 */
.search-dialog {
  width: 90%;
  max-height: 70vh;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 搜索条件样式 */
.search-conditions {
  margin-bottom: 20px;
}

.condition-item {
  margin-bottom: 15px;
}

.condition-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.picker, .search-input {
  height: 40px;
  line-height: 40px;
  padding: 0 12px;
  background-color: #f5f5f5;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  padding: 0 10px;
}

.search-input input {
  flex: 1;
  height: 100%;
  padding: 0 8px;
  font-size: 14px;
}

/* 搜索按钮 */
.search-btn {
  height: 44px;
  line-height: 44px;
  background-color: #07c160;
  color: #fff;
  border-radius: 6px;
  font-size: 16px;
  margin: 10px 0;
}

/* 搜索结果样式 */
.search-results {
  flex: 1;
  margin-top: 15px;
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.result-count {
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
  text-align: center;
}

.result-list {
  max-height: 40vh;
}

.result-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.result-content {
  font-size: 15px;
  line-height: 1.4;
  margin-bottom: 5px;
}

.sender {
  font-weight: bold;
  margin-right: 5px;
}

.result-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.time {
  margin-right: 10px;
}

.type {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}
/* 搜索弹窗样式 */
.search-dialog {
  width: 90vw;
  max-height: 80vh;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 对话框头部 */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 搜索结果区域 */
.search-results {
  flex: 1;
  margin-top: 15px;
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.result-count {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  text-align: center;
}

.result-list {
  max-height: 50vh;
  padding: 0 5px;
}

/* 搜索结果项 */
.result-item {
  padding: 12px 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  transition: all 0.2s;
}

.result-item-active {
  background-color: #e6f7ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-content {
  margin-bottom: 8px;
}

.sender {
  font-weight: bold;
  margin-right: 5px;
  font-size: 15px;
}

.message-bubble {
  background-color: #fff;
  border-radius: 6px;
  padding: 8px 12px;
  margin-top: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.text {
  font-size: 15px;
  line-height: 1.4;
  color: #333;
}

/* 元信息 */
.result-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.time {
  margin-right: 10px;
}

.type {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  color: #666;
}

/* 搜索按钮 */
.search-btn {
  height: 44px;
  line-height: 44px;
  background-color: #07c160;
  color: #fff;
  border-radius: 6px;
  font-size: 16px;
  margin: 10px 0;
  border: none;
}

.search-btn:active {
  background-color: #06ad56;
}

/* 条件项样式优化 */
.condition-item {
  margin-bottom: 16px;
}

.picker, .search-input {
  height: 44px;
  line-height: 44px;
  padding: 0 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  font-size: 15px;
}

.search-input input {
  font-size: 15px;
}

.tool-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.group-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.group-list {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  width: 80%;
  max-height: 70%;
  overflow-y: auto;
}

.group-item {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.group-item:hover {
  background-color: #f9f9f9;
}

.group-card {
  display: flex;
  align-items: center;
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 8px;
}

.group-cover {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.group-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.group-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* Dark overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it appears above other elements */
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px 8px 0 0; /* Rounded top corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.close-icon {
  cursor: pointer;
}

.group-list {
  background-color: #fff;
  border-radius: 0 0 8px 8px; /* Rounded bottom corners */
  padding: 10px;
  width: 90%; /* Adjust width as needed */
  max-height: 70%; /* Limit height */
  overflow-y: auto; /* Enable scrolling */
}

.group-item {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0; /* Divider line */
  cursor: pointer;
  transition: background-color 0.2s; /* Smooth transition */
}

.group-item:hover {
  background-color: #f9f9f9; /* Highlight on hover */
}

.group-card {
  display: flex;
  align-items: center;
}

.group-cover {
  width: 40px; /* Adjust size */
  height: 40px; /* Adjust size */
  border-radius: 50%; /* Circular image */
  margin-right: 10px; /* Space between image and text */
}

.group-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
/* 遮罩层 */
.group-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 999;
}

/* 对话框容器 */
.group-dialog-container {
  width: 100%;
  max-height: 70vh;
  background-color: #fff;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  animation: slide-up 0.3s ease;
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* 对话框头部 */
.dialog-header {
  position: relative;
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
}

.header-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.close-btn {
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 4px;
}

/* 搜索框 */
.search-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 6px;
}

.search-icon {
  margin-right: 8px;
}

.search-input {
  flex: 1;
  height: 36px;
  font-size: 15px;
  color: #333;
}
.message-image {
  max-width: 100%; /* 确保图片不会超出容器宽度 */
  height: auto; /* 保持图片比例 */
  border-radius: 5px; /* 可选：为图片添加圆角 */
}
.placeholder {
  color: #999;
  font-size: 15px;
}

/* 群聊列表 */
.group-list {
  height: calc(70vh - 120px);
  padding: 0 16px;
}

.group-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
}

.group-avatar {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  margin-right: 12px;
  background-color: #f0f0f0;
}

.group-name {
  flex: 1;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  width: 18px;
  height: 18px;
  border: 1px solid #ddd;
  border-radius: 50%;
  position: relative;
}

.check-icon.checked {
  background-color: #07C160;
  border-color: #07C160;
}

.check-icon.checked::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>