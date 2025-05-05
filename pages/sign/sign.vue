<template>
  <view class="sign-page">
    <view class="header">
      <text class="title">签到记录</text>
      <text class="subtitle">查看您的历史签到情况</text>
    </view>

    <view class="filter-section">
      <!-- 页码选择 -->
      <view class="filter-row">
        <text class="filter-label">页码</text>
        <picker 
          :value="pageQuery.pageNo - 1" 
          class="filter-picker" 
          :range="[1, 2, 3, 4, 5]" 
          @change="(e) => pageQuery.pageNo = e.detail.value + 1"
        >
          <view class="filter-value">
            {{ pageQuery.pageNo }}
            <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
          </view>
        </picker>
      </view>

      <!-- 每页条数选择 -->
      <view class="filter-row">
        <text class="filter-label">每页条数</text>
        <picker 
          @change="(e) => pageQuery.pageSize = e.detail.value + 1"
          class="filter-picker" 
          :range="[5, 10, 15, 20]" 
          :value="pageQuery.pageSize / 5 - 1"
        >
          <view class="filter-value">
            {{ pageQuery.pageSize }}
            <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
          </view>
        </picker>
      </view>

      <!-- 排序方式选择 -->
      <view class="filter-row">
        <text class="filter-label">排序方式</text>
        <picker 
          @change="(e) => pageQuery.isAsc = e.detail.value"
          class="filter-picker" 
          :range="['升序', '降序']" 
          :value="pageQuery.isAsc === 'true' ? 0 : 1"
        >
          <view class="filter-value">
            {{ pageQuery.isAsc === 'true' ? '升序' : '降序' }}
            <uni-icons type="arrowdown" size="14" color="#666"></uni-icons>
          </view>
        </picker>
      </view>
      
      <button class="query-button" @click="getSignList">查询记录</button>
    </view>

    <!-- 签到记录列表 -->
    <scroll-view v-if="signList.length > 0" class="sign-list" scroll-y>
      <view v-for="(item, index) in signList" :key="index" class="sign-card">
        <view class="sign-card-header">
          <text class="course-id">课程ID: {{ item.courseId }}</text>
          <view :class="['sign-status', item.success ? 'success' : 'fail']">
            {{ item.success ? '签到成功' : '签到失败' }}
          </view>
        </view>
        <view class="sign-time">
          <uni-icons type="calendar" size="14" color="#999"></uni-icons>
          <text>{{ formatTime(item.createTime) }}</text>
        </view>
      </view>
    </scroll-view>

    <view v-else class="empty-state">
      <text class="empty-text">暂无签到记录</text>
      <text class="empty-tip">尝试调整查询条件或刷新页面</text>
    </view>
  </view>
</template>

<script setup>
	import {reactive,ref} from "vue"
	import {onLoad} from '@dcloudio/uni-app'
import { getSignRecord } from '../../api/api';

const signList = ref([]); // 签到记录列表
const pageQuery = reactive({
  pageNo: 1, // 页码
  pageSize: 10, // 每页条数
  isAsc: true // 排序方式（升序/降序）
});

// 格式化时间
const formatTime = (time) => {
  if (!time) return '--';
  const date = new Date(time);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 获取签到记录
const getSignList = async () => {
  try {
    const res = await getSignRecord(pageQuery);
    console.log('签到记录:', res);
    signList.value = res.list;
  } catch (error) {
    console.error('获取签到记录失败:', error);
  }
};

// 页面加载时获取签到记录
onLoad(() => {
  getSignList();
});
</script>

<style scoped>
.sign-page {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.subtitle {
  font-size: 28rpx;
  color: #999;
  margin-top: 8rpx;
}

.filter-section {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.filter-label {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.filter-picker {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 20rpx;
  border: 1rpx solid #ccc;
  border-radius: 10rpx;
  background-color: #fff;
  font-size: 28rpx;
  color: #666;
}

.filter-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.query-button {
  width: 100%;
  height: 80rpx;
  background-color: #2979ff;
  color: #fff;
  font-size: 30rpx;
  text-align: center;
  line-height: 80rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.query-button:active {
  background-color: #1a5fbf;
}

.sign-list {
  max-height: 50vh;
  overflow-y: auto;
  margin-bottom: 24rpx;
}

.sign-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.sign-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.course-id {
  font-size: 28rpx;
  color: #333;
}

.sign-status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 24rpx;
}

.sign-status.success {
  background-color: #e8f5e9;
  color: #4caf50;
}

.sign-status.fail {
  background-color: #ffebee;
  color: #f44336;
}

.sign-time {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.empty-tip {
  font-size: 24rpx;
  color: #ccc;
}
</style>