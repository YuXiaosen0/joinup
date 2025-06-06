<template>
	<view class="search-results" >
		<view class="result-count">
			共找到 {{ results.length }} 条相关聊天记录
		</view>
		<scroll-view class="result-list" scroll-y>
			<view 
				v-for="(msg, index) in results" 
				:key="index" 
				class="result-item"
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
</template>

<script setup>
import { ref ,computed} from 'vue';
import { onLoad,onShow,onUnload } from '@dcloudio/uni-app';
const results = ref([]); 
const userInfo = ref(uni.getStorageSync('userInfo'));
const filteredMessages = computed(() => {
  return results.value; // Filter logic
});
onLoad((options) => {
  const data = JSON.parse(decodeURIComponent(options.data));
  results.value = data;
	console.log("data",results.value)
	console.log(filteredMessages.value)
});

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
// 消息类型选项
const messageTypes = ref([
  { value: '', label: '全部类型' },
  { value: 'TEXT', label: '文字' },
	{ value: 'IMAGE', label: '图片' },
	{ value: 'TEAM_SHARE', label: '队伍分享' }
]);
// 获取类型标签
const getTypeLabel = (type) => {
  const found = messageTypes.value.find(t => t.value === type);
  return found ? found.label : type;
};
</script>

<style scoped>
.search-results-page {
  padding: 20px;
}

.results-container {
  margin-top: 20px;
}

.results-container text {
  display: block;
  margin-bottom: 10px;
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

.message-bubble {
  background-color: #fff;
  border-radius: 6px;
  padding: 8px 12px;
  margin-top: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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
  max-height: 140vh;
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
  max-height: 80vh;
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

</style>