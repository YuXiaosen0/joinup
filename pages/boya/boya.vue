<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="nav-tabs">
        <view 
          :class="['tab', activeTab === 'all' ? 'active' : '']"
          @click="switchTab('all')"
        >
          全部课程
        </view>
        <view 
          :class="['tab', activeTab === 'selected' ? 'active' : '']"
          @click="switchTab('selected')"
        >
          已选课程
        </view>
        <view 
          :class="['tab', activeTab === 'appointments' ? 'active' : '']"
          @click="switchTab('appointments')"
        >
          预约记录
        </view>
      </view>
    </view>

    <!-- 全部课程列表 -->
    <view v-if="activeTab === 'all'" class="course-list">
      <view v-for="course in allCourses" :key="course.course_id" class="course-card">
        <view class="course-info">
          <text class="course-name">{{ course.name }}</text>
          <text class="course-time">时间: {{ course.start_date }} 至 {{ course.end_date }}</text>
          <text class="course-college">学院: {{ course.college }}</text>
        </view>
        <view class="course-actions">
          <button 
            v-if="!isCourseSelected(course.course_id)"
            class="action-btn select-btn"
            @click="showToast('选课功能(模拟)')"
          >
            选课
          </button>
          <button 
            v-else
            class="action-btn cancel-btn"
            @click="showToast('退选功能(模拟)')"
          >
            退选
          </button>
          <button 
            class="action-btn appointment-btn"
            @click="showToast('预约功能(模拟)')"
          >
            预约
          </button>
        </view>
      </view>
      
      <!-- 分页控制 -->
      <view class="pagination">
        <button 
          :disabled="pageNumber === 1"
          class="page-btn"
          @click="prevPage"
        >
          上一页
        </button>
        <text class="page-info">第 {{ pageNumber }} 页</text>
        <button 
          class="page-btn"
          @click="nextPage"
        >
          下一页
        </button>
      </view>
    </view>

    <!-- 已选课程列表 -->
    <view v-else-if="activeTab === 'selected'" class="course-list">
      <view v-if="selectedCourses.length === 0" class="empty-tip">
        <text>暂无已选课程</text>
      </view>
      <view v-for="course in selectedCourses" :key="course.course_id" class="course-card">
        <view class="course-info">
          <text class="course-name">{{ course.name }}</text>
          <text class="course-time">时间: {{ course.start_date }} 至 {{ course.end_date }}</text>
          <text class="course-college">学院: {{ course.college }}</text>
          <text class="course-position">地点: {{ course.position }}</text>
          <text class="course-identifier">选课标识: {{ course.select_identifier }}</text>
        </view>
        <view class="course-actions">
          <button 
            class="action-btn cancel-btn"
            @click="showToast('退选功能(模拟)')"
          >
            退选
          </button>
          <button 
            v-if="!hasAppointment(course.course_id)"
            class="action-btn appointment-btn"
            @click="showToast('预约打卡功能(模拟)')"
          >
            预约打卡
          </button>
          <button 
            v-else
            class="action-btn disabled-btn"
            disabled
          >
            已预约
          </button>
        </view>
      </view>
    </view>

    <!-- 预约记录 -->
    <view v-else class="appointment-list">
      <view v-if="appointments.length === 0" class="empty-tip">
        <text>暂无预约记录</text>
      </view>
      <view v-for="appointment in appointments" :key="appointment.appointment_id" class="appointment-card">
        <view class="appointment-info">
          <text class="appointment-name">{{ appointment.name }}</text>
          <text class="appointment-time">预约时间: {{ appointment.select_start_date }}</text>
        </view>
        <button 
          class="action-btn cancel-btn"
          @click="showToast('撤销预约功能(模拟)')"
        >
          撤销预约
        </button>
      </view>
    </view>

    <!-- 认证状态 -->
    <view class="auth-status">
      <text v-if="isAuthenticated" class="authenticated">已通过北航校园认证</text>
      <button v-else class="auth-btn" @click="showToast('校园认证功能(模拟)')">进行北航校园认证</button>
    </view>
  </view>
</template>

<script setup>
import {ref} from "vue"
import {onLoad} from '@dcloudio/uni-app'
import { boyaAuthentication, getBoyaCourse,xuanBoya,lookupYiXuan,deleteBoya,appointBoya,getAppointList,cancelAppoint } from "../../api/api"
onLoad(async() => {
	// 页面加载时获取课程列表
	const res = await boyaAuthentication();
	console.log("boyaAuthentication",res);
})
// 静态数据
const allCourses = ref([
  {
    course_id: 1,
    name: "中国传统文化",
    start_date: "2023-09-01",
    end_date: "2023-12-31",
    college: "人文学院",
    position: "主楼201",
    select_identifier: "Boya-2023-001"
  },
  {
    course_id: 2,
    name: "西方艺术史",
    start_date: "2023-09-15",
    end_date: "2024-01-10",
    college: "艺术学院",
    position: "艺术楼101",
    select_identifier: "Boya-2023-002"
  },
  {
    course_id: 3,
    name: "科技创新与创业",
    start_date: "2023-10-01",
    end_date: "2023-12-15",
    college: "工程学院",
    position: "工程楼301",
    select_identifier: "Boya-2023-003"
  }
])

const selectedCourses = ref([
  {
    course_id: 1,
    name: "中国传统文化",
    start_date: "2023-09-01",
    end_date: "2023-12-31",
    college: "人文学院",
    position: "主楼201",
    select_identifier: "Boya-2023-001"
  }
])

const appointments = ref([
  {
    appointment_id: 1,
    course_id: 1,
    name: "中国传统文化",
    select_start_date: "2023-09-01 14:00"
  }
])

// 界面状态
const activeTab = ref('all')
const isAuthenticated = ref(false)
const pageNumber = ref(1)

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab
}

// 检查课程是否已选
const isCourseSelected = (courseId) => {
  return selectedCourses.value.some(course => course.course_id === courseId)
}

// 检查是否有预约
const hasAppointment = (courseId) => {
  return appointments.value.some(app => app.course_id === courseId)
}

// 显示提示
const showToast = (title) => {
  uni.showToast({
    title,
    icon: 'none'
  })
}

// 上一页
const prevPage = () => {
  if (pageNumber.value > 1) {
    pageNumber.value--
    showToast(`切换到第 ${pageNumber.value} 页(模拟)`)
  }
}

// 下一页
const nextPage = () => {
  pageNumber.value++
  showToast(`切换到第 ${pageNumber.value} 页(模拟)`)
}
</script>

<style>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 顶部导航 */
.header {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.nav-tabs {
  display: flex;
  padding: 20rpx 0;
}

.tab {
  flex: 1;
  text-align: center;
  font-size: 30rpx;
  color: #666;
  padding: 20rpx 0;
  position: relative;
}

.tab.active {
  color: #07C160;
  font-weight: bold;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 6rpx;
  background-color: #07C160;
  border-radius: 3rpx;
}

/* 课程卡片 */
.course-list {
  margin-bottom: 100rpx;
}

.course-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.course-info {
  margin-bottom: 20rpx;
}

.course-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.course-time, .course-college, .course-position, .course-identifier {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 6rpx;
}

.course-actions {
  display: flex;
  justify-content: space-between;
}

.action-btn {
  flex: 1;
  margin: 0 10rpx;
  font-size: 28rpx;
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 35rpx;
}

.select-btn {
  background-color: #07C160;
  color: #fff;
}

.cancel-btn {
  background-color: #FF4D4F;
  color: #fff;
}

.appointment-btn {
  background-color: #1890FF;
  color: #fff;
}

.disabled-btn {
  background-color: #ccc;
  color: #fff;
}

/* 预约卡片 */
.appointment-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.appointment-info {
  flex: 1;
}

.appointment-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.appointment-time {
  font-size: 26rpx;
  color: #666;
  display: block;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30rpx 0;
}

.page-btn {
  width: 160rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
  margin: 0 20rpx;
  background-color: #07C160;
  color: #fff;
  border-radius: 30rpx;
}

.page-btn[disabled] {
  background-color: #ccc;
}

.page-info {
  font-size: 28rpx;
  color: #666;
}

/* 空状态提示 */
.empty-tip {
  text-align: center;
  padding: 60rpx 0;
  font-size: 28rpx;
  color: #999;
}

/* 认证状态 */
.auth-status {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx;
  text-align: center;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.authenticated {
  font-size: 28rpx;
  color: #07C160;
}

.auth-btn {
  background-color: #07C160;
  color: #fff;
  font-size: 30rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  width: 80%;
  margin: 0 auto;
}
</style>