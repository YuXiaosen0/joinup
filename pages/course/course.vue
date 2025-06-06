<template>
  <view class="course-container">
    <!-- 顶部日期选择区域 -->
    <view class="top-section">
      <view class="date-picker-card">
        <view class="picker-label">选择日期</view>
        <picker 
          mode="date" 
          :value="date" 
          :start="startDate" 
          :end="endDate" 
          @change="bindDateChange"
          class="custom-picker"
        >
          <view class="picker-display">
            <up-icon name="calendar" size="18" color="#5A7BFF"></up-icon>
            <text class="picker-text">{{ date }}</text>
            <up-icon name="arrow-down" size="14" color="#A0A4B8"></up-icon>
          </view>
        </picker>
      </view>

      <up-button 
        type="primary" 
        shape="circle" 
        @click="getCouInfo" 
        class="get-course-btn"
        icon="search"
        color="linear-gradient(to right, #5A7BFF, #3D56F0)"
      >
        获取课程信息
      </up-button>
    </view>

    <!-- 课程信息列表 -->
    <view v-if="courseInfo!=null" class="course-list">
      <view 
        v-for="course in courseInfo" 
        :key="course.id" 
        class="course-card"
        @click="showDetails(course)"
      >
        <view class="course-header">
          <text class="course-name">{{ course.courseName }}</text>
          <text class="course-type" :class="getCourseTypeClass(course.courseType)">
            {{ course.courseType }}
          </text>
        </view>
        
        <view class="course-meta">
          <view class="meta-item">
            <up-icon name="account-fill" size="14" color="#A0A4B8"></up-icon>
            <text>{{ course.teacherName }}</text>
          </view>
          <view class="meta-item">
            <up-icon name="home-fill" size="14" color="#A0A4B8"></up-icon>
            <text>{{ course.classroomName }}</text>
          </view>
        </view>
        
        <view class="course-time">
          <up-icon name="clock" size="14" color="#A0A4B8"></up-icon>
          <text>{{ formatTime(course.classBeginTime) }} - {{ formatTime(course.classEndTime) }}</text>
        </view>
        
        <view class="course-status" :class="getStatusClass(course.signStatus)">
          {{ course.signStatus }}
        </view>
        
        <view class="course-card-bg" :class="getCourseTypeClass(course.courseType)"></view>
      </view>
    </view>

    <!-- 底部按钮区域 -->
     <view class="bottom-section">
          <view class="button-row">
            <up-button
              type="primary" 
              shape="circle" 
              @click="openSignListPopup" 
              class="action-btn half-width"
              icon="list"
              color="linear-gradient(to right, #5A7BFF, #3D56F0)"
            >
              自动签到打卡列表
            </up-button>
            
            <up-button
              type="primary" 
              shape="circle" 
              @click="goToSignRecord" 
              class="action-btn half-width"
              icon="clock"
              color="linear-gradient(to right, #6A11CB, #2575FC)"
            >
              签到记录
            </up-button>
          </view>
        </view>

    <!-- 签到打卡列表弹窗 -->
    <up-popup 
      :show="showSignListPopup" 
      mode="center" 
      round="16"
      @close="closeSignListPopup"
      class="sign-list-popup"
    >
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">自动签到打卡列表</text>
          <up-icon name="close" @click="closeSignListPopup" class="close-icon"></up-icon>
        </view>

        <view class="popup-body">
          <scroll-view scroll-y="true" class="sign-scroll-view">
            <view v-if="signList.length > 0" class="sign-list">
              <view v-for="(item, index) in signList" :key="index" class="sign-item">
                <view class="sign-item-content">
                  <view class="sign-item-row">
                    <up-icon name="bookmark" size="18" color="#5A7BFF"></up-icon>
                    <text class="sign-item-title">课程ID: {{ item.courseId }}</text>
                  </view>
                  <view class="sign-item-row">
                    <up-icon name="calendar" size="18" color="#5A7BFF"></up-icon>
                    <text class="sign-item-time">创建时间: {{ formatDateTime(item.createTime) }}</text>
                  </view>
                  <view class="sign-item-row">
                    <up-icon name="setting" size="18" color="#5A7BFF"></up-icon>
                    <text class="sign-item-status" :class="{'active': item.status === 'RUNNING'}">
                      状态: {{ item.status === 'RUNNING' ? '进行中' : '已结束' }}
                    </text>
                  </view>
                  <up-button
                    type="error"
                    @click="deleteSignC(item.id)"
                    class="delete-btn"
                    size="mini"
                    shape="circle"
                  >
                    删除
                  </up-button>
                </view>

                
              </view>
            </view>
            <view v-else class="empty-list">
              <image src="../../static/resource/images/empty.png" class="empty-image"></image>
              <text class="empty-text">暂无签到打卡信息</text>
            </view>
          </scroll-view>
        </view>
      </view>
    </up-popup>

    <!-- 课程详情弹窗 -->
    <up-popup 
      :show="showPopup" 
      mode="center" 
      round="16"
      @close="closePopup"
      class="course-detail-popup"
    >
      <view class="popup-container">
        <view class="popup-header">
          <text class="course-title">{{ selectedCourse.courseName }}</text>
          <up-icon name="close" @click="closePopup" class="close-icon"></up-icon>
        </view>
        
        <view class="popup-body">
          <!-- 课程基本信息卡片 -->
          <view class="info-card">
            <view class="info-row">
              <up-icon name="lock" size="18" color="#5A7BFF"></up-icon>
              <text class="info-label">课程Id</text>
              <text class="info-value">{{ selectedCourse.courseId }}</text>
            </view>			  
            <view class="info-row">
              <up-icon name="bookmark" size="18" color="#5A7BFF"></up-icon>
              <text class="info-label">课程类型</text>
              <text class="info-value">{{ selectedCourse.courseType }}</text>
            </view>
            
            <view class="info-row">
              <up-icon name="account-fill" size="18" color="#5A7BFF"></up-icon>
              <text class="info-label">授课教师</text>
              <text class="info-value">{{ selectedCourse.teacherName }}</text>
            </view>
            
            <view class="info-row">
              <up-icon name="home-fill" size="18" color="#5A7BFF"></up-icon>
              <text class="info-label">教室</text>
              <text class="info-value">{{ selectedCourse.classroomName }}</text>
            </view>
          </view>
          
          <!-- 时间信息卡片 -->
          <view class="time-card">
            <view class="time-row">
              <up-icon name="calendar" size="18" color="#5A7BFF"></up-icon>
              <text class="time-label">上课日期</text>
              <text class="time-value">{{ formatDate(selectedCourse.classBeginTime) }}</text>
            </view>
            
            <view class="time-row">
              <up-icon name="clock" size="18" color="#5A7BFF"></up-icon>
              <text class="time-label">上课时间</text>
              <text class="time-value">
                {{ formatTime(selectedCourse.classBeginTime) }} - {{ formatTime(selectedCourse.classEndTime) }}
              </text>
            </view>
          </view>
        </view>
        
        <view class="popup-footer">
          <up-button 
            type="primary" 
            shape="circle" 
            @click="addSignC(selectedCourse.courseId)" 
            class="action-btn"
            :disabled=" isSignAdded(selectedCourse.courseId)"
            color="linear-gradient(to right, #6A11CB, #2575FC)"
          >
          {{ isSignAdded(selectedCourse.courseId) ? '已添加' : '添加自动打卡' }}
          </up-button>
          
          <up-button 
            type="primary" 
            shape="circle" 
            @click="sign(selectedCourse.id)" 
            class="action-btn"
            :disabled="selectedCourse.signStatus === '已签到'"
            color="linear-gradient(to right, #5A7BFF, #3D56F0)"
          >
            {{ selectedCourse.signStatus === '已签到' ? '已签到' : '立即签到' }}
          </up-button>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import {reactive,ref} from "vue"
import {onLoad} from '@dcloudio/uni-app'
import { getCourseInfo,signClass,getSign,addSign,deleteSign} from "../../api/api"

const date = ref(new Date().toISOString().split('T')[0]);
const startDate=ref('2024-04-08')
const endDate=ref('2025-08-08')
const courseInfo=ref()
const selectedCourse=ref({
  classBeginTime: "2025-04-08T08:00:00",
  classEndTime: "2025-04-08T09:35:00",
  classroomName: "F121",
  courseName: "计算机网络",
  courseType: "必修",
  id: 2164526,
  courseId: 12358,
  signStatus: "已签到",
  teacherName: "张辉",
  weekDay: "周二"
})
onLoad(async() => {
  // 页面加载时获取课程列表
  await getCouInfo();
})
const showPopup=ref(false)
const showSignListPopup = ref(false);
const signList = ref([]);
const isSignAdded = (courseId) => {
  return signList.value.some(item => item.courseId === courseId);
};
const bindDateChange=async(e) =>{
  date.value = e.detail.value
  await getCouInfo()
}

const showDetails = (course) => {
  selectedCourse.value = course;
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
};

const sign=async(id) =>{
  const res=await signClass(id)
  if(res.code==1){
    uni.showToast({
      title: "签到成功",
      icon: "success",
      duration: 3000,
      position: "bottom",
    });
  }else{
    uni.showToast({
      title: "签到失败",
      icon: "none",
      duration: 3000,
      position: "bottom",
    });
  }
}

const getCouInfo = async () => {
  const res = await getCourseInfo(date.value);
  console.log("res",res)
  if (res && Array.isArray(res.result)) {
    courseInfo.value = res.result.map(course => ({
      id: course.id || "未知ID",
      courseId:course.courseId || "未知COURSEID",
      courseName: course.courseName || "未知课程名",
      courseType: course.courseType || "未知类型",
      teacherName: course.teacherName || "未知教师",
      classroomName: course.classroomName || "未知教室",
      weekDay: course.weekDay || "未知星期",
      classBeginTime: course.classBeginTime || "未知开始时间",
      classEndTime: course.classEndTime || "未知结束时间",
      signStatus: course.signStatus || "未知状态",
    }));
  } else if(res==null||res.result==null){
      uni.showToast({
        title: "当前日期无课程",
        icon: "none",
        duration: 1000,
      });
    courseInfo.value = [];

  }else{
    console.error("获取课程信息失败或数据格式不正确");
    courseInfo.value = [];
  }
};

const addSignC = async (courseId) => {
  try {
    const res = await addSign(courseId);

    if (res.code === 1) {
      uni.showToast({
        title: "添加成功",
        icon: "success",
        duration: 2000,
      });
    } else {
      uni.showToast({
        title: res.message || "添加失败",
        icon: "none",
        duration: 2000,
      });
    }
  } catch (error) {
    console.error("添加失败:", error);
    uni.showToast({
      title: "添加失败，请稍后重试",
      icon: "none",
      duration: 2000,
    });
  }
};

const deleteSignC = async (courseId) => {
  try {
    const res = await deleteSign(courseId);

    if (res.code === 1) {
      signList.value = signList.value.filter(item => item.id !== courseId);
      uni.showToast({
        title: "删除成功",
        icon: "success",
        duration: 2000,
      });
    } else {
      uni.showToast({
        title: "删除失败",
        icon: "none",
        duration: 2000,
      });
    }
  } catch (error) {
    console.error("删除失败:", error);
    uni.showToast({
      title: "删除失败",
      icon: "none",
      duration: 2000,
    });
  }
};

const openSignListPopup = async () => {
  const res=await getSign("RUNNING")
  if (res && Array.isArray(res)) {
    signList.value = res;
  } else {
    signList.value = [];
  }
  showSignListPopup.value = true;
};

const closeSignListPopup = () => {
  showSignListPopup.value = false;
};

// 新增辅助方法
const formatTime = (timeStr) => {
  if(!timeStr) return '--:--'
  const time = new Date(timeStr)
  return time.toTimeString().substring(0, 5)
}

const formatDate = (dateStr) => {
  if(!dateStr) return '--'
  const date = new Date(dateStr)
  return `${date.getMonth()+1}月${date.getDate()}日`
}

const formatDateTime = (dateStr) => {
  if(!dateStr) return '--'
  const date = new Date(dateStr)
  return `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

const getCourseTypeClass = (type) => {
  return {
    'required': type === '必修',
    'elective': type === '选修'
  }
}

const getStatusClass = (status) => {
  return {
    'signed': status === '已签到',
    'unsigned': status === '未签到'
  }
}

const goToSignRecord = () => {
  uni.navigateTo({
    url: '/pages/sign/sign'
  })
}

</script>

<style lang="scss" scoped>
.course-container {
  padding: 24rpx;
  background-color: #F5F7FA;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-section {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(90, 123, 255, 0.08);
}

.date-picker-card {
  margin-bottom: 24rpx;
  
  .picker-label {
    font-size: 28rpx;
    color: #6E7480;
    margin-bottom: 16rpx;
    font-weight: 500;
  }
  
  .custom-picker {
    .picker-display {
      display: flex;
      align-items: center;
      padding: 20rpx 24rpx;
      background-color: #F5F7FA;
      border-radius: 12rpx;
      border: 1rpx solid #E4E7ED;
      
      .picker-text {
        flex: 1;
        margin: 0 16rpx;
        font-size: 32rpx;
        color: #1A1D28;
        font-weight: 500;
      }
    }
  }
}

.get-course-btn {
  margin: 16rpx 0;
  height: 88rpx;
  font-size: 32rpx;
  font-weight: 500;
  box-shadow: 0 8rpx 16rpx rgba(90, 123, 255, 0.2);
}

.course-list {
  flex: 1;
  margin-bottom: 120rpx;
  
  .course-card {
    background-color: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
    position: relative;
    overflow: hidden;
    border: 1rpx solid #F0F2F7;
    
    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24rpx;
      position: relative;
      z-index: 2;
      
      .course-name {
        font-size: 36rpx;
        font-weight: 600;
        color: #1A1D28;
        max-width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .course-type {
        font-size: 24rpx;
        padding: 6rpx 16rpx;
        border-radius: 8rpx;
        font-weight: 500;
        
        &.required {
          background-color: rgba(90, 123, 255, 0.1);
          color: #5A7BFF;
        }
        
        &.elective {
          background-color: rgba(142, 84, 233, 0.1);
          color: #8E54E9;
        }
      }
    }
    
    .course-meta {
      display: flex;
      gap: 24rpx;
      margin-bottom: 20rpx;
      position: relative;
      z-index: 2;
      
      .meta-item {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #6E7480;
        
        text {
          margin-left: 8rpx;
        }
      }
    }
    
    .course-time {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #6E7480;
      margin-bottom: 20rpx;
      position: relative;
      z-index: 2;
      
      text {
        margin-left: 8rpx;
      }
    }
    
    .course-status {
      font-size: 28rpx;
      text-align: right;
      font-weight: 500;
      position: relative;
      z-index: 2;
      
      &.signed {
        color: #52C41A;
      }
      
      &.unsigned {
        color: #FA8C16;
      }
    }
    
    .course-card-bg {
      position: absolute;
      top: 0;
      right: 0;
      width: 160rpx;
      height: 160rpx;
      opacity: 0.05;
      
      &.required {
        background-color: #5A7BFF;
      }
      
      &.elective {
        background-color: #8E54E9;
      }
    }
  }
}

// .bottom-section {
//   position: fixed;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   padding: 24rpx;
//   background-color: #fff;
//   box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.04);
//   z-index: 10;
  
//   .action-btn {
//     height: 88rpx;
//     font-size: 32rpx;
//     font-weight: 500;
//   }
// }
.bottom-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx;
  background-color: #fff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.04);
  z-index: 10;
  
  .button-row {
    display: flex;
    gap: 24rpx;
  }
  
  .action-btn {
    height: 88rpx;
    font-size: 32rpx;
    font-weight: 500;
    
    &.half-width {
      flex: 1;
    }
  }
}

/* 弹窗样式 */
.sign-list-popup, .course-detail-popup {
  width: 86%;
  max-width: 640rpx;
}

.popup-container {
  padding: 40rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #F0F2F7;
}

.popup-title, .course-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1A1D28;
}

.close-icon {
  color: #A0A4B8;
  font-size: 32rpx;
}

.popup-body {
  flex: 1;
  overflow: hidden;
}

.sign-scroll-view {
  max-height: 60vh;
  padding-right: 8rpx;
}

.sign-list {
  .sign-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    background-color: #F8F9FA;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    
    .sign-item-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .sign-item-title {
      font-size: 28rpx;
      color: #1A1D28;
      font-weight: 500;
      margin-bottom: 8rpx;
    }
    
    .sign-item-time {
      font-size: 24rpx;
      color: #A0A4B8;
      margin-bottom: 8rpx;
    }
    
    .sign-item-status {
      font-size: 24rpx;
      color: #FA8C16;
      
      &.active {
        color: #52C41A;
      }
    }
    
    .delete-btn {
      margin-left: 20rpx;
      width: 120rpx;
    }
  }
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
  
  .empty-image {
    width: 180rpx;
    height: 180rpx;
    margin-bottom: 24rpx;
    opacity: 0.6;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #A0A4B8;
  }
}

.info-card, .time-card {
  background-color: #F8F9FA;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.info-row, .time-row {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  font-size: 30rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.info-label, .time-label {
  color: #6E7480;
  margin-left: 16rpx;
  width: 140rpx;
  font-weight: 500;
}

.info-value, .time-value {
  color: #1A1D28;
  flex: 1;
  font-weight: 500;
}

.popup-footer {
  display: flex;
  gap: 20rpx;
  margin-top: 32rpx;
  
  .action-btn {
    flex: 1;
    height: 88rpx;
    font-size: 32rpx;
    font-weight: 500;
  }
}
.sign-item-row {
  display: flex;
  align-items: center;
  gap: 8rpx; /* 图标和文字之间的间距 */
  margin-bottom: 12rpx; /* 每行之间的间距 */
}

.sign-item-title, .sign-item-time, .sign-item-status {
  font-size: 28rpx;
  color: #333333;
}
</style>