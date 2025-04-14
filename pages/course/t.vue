<template>
  <view class="course-container">
    <!-- 日期选择器 -->
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
          <up-icon name="calendar" size="18" color="#1890ff"></up-icon>
          <text class="picker-text">{{ date }}</text>
          <up-icon name="arrow-down" size="14" color="#999"></up-icon>
        </view>
      </picker>
    </view>

    <!-- 获取课程信息按钮 -->
    <up-button 
      type="primary" 
      shape="circle" 
      @click="getCouInfo" 
      class="get-course-btn"
      icon="search"
    >
      获取课程信息
    </up-button>

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
            <up-icon name="account-fill" size="14" color="#666"></up-icon>
            <text>{{ course.teacherName }}</text>
          </view>
          <view class="meta-item">
            <up-icon name="home-fill" size="14" color="#666"></up-icon>
            <text>{{ course.classroomName }}</text>
          </view>
        </view>
        
        <view class="course-time">
          <up-icon name="clock" size="14" color="#666"></up-icon>
          <text>{{ formatTime(course.classBeginTime) }} - {{ formatTime(course.classEndTime) }}</text>
        </view>
        
        <view class="course-status" :class="getStatusClass(course.signStatus)">
          {{ course.signStatus }}
        </view>
      </view>
	  
    </view>
    <!-- 获取自动签到打卡列表按钮 -->
    <up-button
      type="primary" 
      shape="circle" 
      @click="openSignListPopup" 
      class="get-course-btn"
      icon="search"
    >
      获取自动签到打卡列表
    </up-button>

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
          <view v-if="signList.length > 0" class="sign-list">
            <view v-for="(item, index) in signList" :key="index" class="sign-item">
              <text class="sign-item-text">任务id：{{ item.id }};
                {{ item.userId }},{{ item.studentID }},{{ item.courseId }},
                {{ item.status }},{{ item.createTime }},{{ item.updateTime }},{{ item.lastSignTime }}
              </text>
              <up-button
                type="warn"
                @click="deleteSignC(item.id)"
                class="delete-btn"
              >
                删除
              </up-button>
            </view>
          </view>
          <view v-else class="empty-list">
            <text>暂无签到打卡信息</text>
          </view>
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
              <up-icon name="lock" size="18" color="#1890ff"></up-icon>
              <text class="info-label">课程Id</text>
              <text class="info-value">{{ selectedCourse.courseId }}</text>
            </view>			  
            <view class="info-row">
              <up-icon name="bookmark" size="18" color="#1890ff"></up-icon>
              <text class="info-label">课程类型</text>
              <text class="info-value">{{ selectedCourse.courseType }}</text>
            </view>
            
            <view class="info-row">
              <up-icon name="account-fill" size="18" color="#1890ff"></up-icon>
              <text class="info-label">授课教师</text>
              <text class="info-value">{{ selectedCourse.teacherName }}</text>
            </view>
            
            <view class="info-row">
              <up-icon name="home-fill" size="18" color="#1890ff"></up-icon>
              <text class="info-label">教室</text>
              <text class="info-value">{{ selectedCourse.classroomName }}</text>
            </view>
          </view>
          
          <!-- 时间信息卡片 -->
          <view class="time-card">
            <view class="time-row">
              <up-icon name="calendar" size="18" color="#1890ff"></up-icon>
              <text class="time-label">上课日期</text>
              <text class="time-value">{{ formatDate(selectedCourse.classBeginTime) }}</text>
            </view>
            
            <view class="time-row">
              <up-icon name="clock" size="18" color="#1890ff"></up-icon>
              <text class="time-label">上课时间</text>
              <text class="time-value">
                {{ formatTime(selectedCourse.classBeginTime) }} - {{ formatTime(selectedCourse.classEndTime) }}
              </text>
            </view>
          </view>
          
          
        </view>
        <!-- 添加到自动打卡按钮 -->
        <up-button 
          type="primary" 
          shape="circle" 
          @click="addSignC(selectedCourse.courseId)" 
          class="sign-btn"
          size="large"
        >
          添加该课自动打卡
        </up-button>
        <!-- 签到按钮 -->
        <up-button 
          type="primary" 
          shape="circle" 
          @click="sign(selectedCourse.id)" 
          class="sign-btn"
          :disabled="selectedCourse.signStatus === '已签到'"
          size="large"
        >
          {{ selectedCourse.signStatus === '已签到' ? '已签到' : '立即签到' }}
        </up-button>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
	import {reactive,ref} from "vue"
	import {onLoad} from '@dcloudio/uni-app'
	import { getCourseInfo,signClass,getSign,addSign,deleteSign} from "../../api/api"
	const date = ref('2025-04-08')
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
	const showPopup=ref(false)
  const showSignListPopup = ref(false); // 控制签到列表弹窗的显示
  const signList = ref([]); // 存储签到打卡列表数据
  const addSignC = async (courseId) => {
  try {
    const res = await addSign(courseId); // 调用添加接口
    console.log("添加自动打卡接口返回数据:", res); // 调试日志

    if (res.code === 1) {
      // 添加成功提示
      uni.showToast({
        title: "添加成功",
        icon: "success",
        duration: 2000,
      });
    } else {
      // 添加失败提示
      uni.showToast({
        title: res.message || "添加失败",
        icon: "none",
        duration: 2000,
      });
    }
  } catch (error) {
    console.error("添加失败:", error); // 调试日志
    // 网络或其他错误提示
    uni.showToast({
      title: "添加失败，请稍后重试",
      icon: "none",
      duration: 2000,
    });
  }
};
  const deleteSignC = async (courseId) => {
  try {
    const res = await deleteSign(courseId); // 调用删除接口
    console.log("删除自动打卡接口返回数据:", res); // 调试日志

    if (res.code === 1) {
      // 删除成功后更新本地列表
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
  // 打开签到列表弹窗
  const openSignListPopup = async () => {
    const res=await getSign("RUNNING")
		console.log("res",res)
    if (res && Array.isArray(res)) {
      signList.value = res; // 将返回的数据存储到 signList 中
    } else {
      signList.value = []; // 如果没有数据，设置为空数组
    }
    showSignListPopup.value = true; // 显示弹窗
  };

  // 关闭签到列表弹窗
  const closeSignListPopup = () => {
    showSignListPopup.value = false; // 隐藏弹窗
  };
	const bindDateChange=async(e) =>{
		date.value = e.detail.value
	}
	// 显示弹窗并设置选中的课程
	const showDetails = (course) => {
		selectedCourse.value = course;
		showPopup.value = true;
	};
	// 关闭弹窗
	const closePopup = () => {
		showPopup.value = false;
	};
	const sign=async(id) =>{
		const res=await signClass(id)
		console.log("签到接口返回数据:", res); // 调试日志
		if(res.code==1){
			uni.showToast({
				title: "签到成功",
				icon: "success",
				duration: 3000, // 显示时间（毫秒）
				position: "bottom", // 提示框位置，可选值：top/center/bottom
			});
		}else{
			uni.showToast({
				title: "签到失败",
				icon: "none",
				duration: 3000, // 显示时间（毫秒）
				position: "bottom", // 提示框位置，可选值：top/center/bottom
			});
		}
	}
	
	const getCouInfo = async () => {
		const res = await getCourseInfo(date.value);
		console.log("接口返回数据:", res); // 调试日志
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
			console.log("courseInfo.value", courseInfo.value); // 调试日志
		} else {
			console.error("获取课程信息失败或数据格式不正确");
			courseInfo.value = [];
		}
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
</script>

<style lang="scss" scoped>
.course-container {
  padding: 24rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.date-picker-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  
  .picker-label {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 16rpx;
  }
  
  .custom-picker {
    .picker-display {
      display: flex;
      align-items: center;
      padding: 20rpx;
      background-color: #f8f9fa;
      border-radius: 12rpx;
      
      .picker-text {
        flex: 1;
        margin: 0 16rpx;
        font-size: 32rpx;
        color: #333;
      }
    }
  }
}

.get-course-btn {
  margin: 24rpx 0;
  width: 100%;
}

.course-list {
  .course-card {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    
    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .course-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .course-type {
        font-size: 24rpx;
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
        
        &.required {
          background-color: #f0f7ff;
          color: #1890ff;
        }
        
        &.elective {
          background-color: #fff5f0;
          color: #fa8c16;
        }
      }
    }
    
    .course-meta {
      display: flex;
      gap: 24rpx;
      margin-bottom: 16rpx;
      
      .meta-item {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #666;
        
        text {
          margin-left: 8rpx;
        }
      }
    }
    
    .course-time {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 16rpx;
      
      text {
        margin-left: 8rpx;
      }
    }
    
    .course-status {
      font-size: 26rpx;
      text-align: right;
      
      &.signed {
        color: #52c41a;
      }
      
      &.unsigned {
        color: #fa8c16;
      }
    }
  }
}

.course-detail-popup {
  width: 90%;
  max-width: 700rpx;
}

.popup-container {
  padding: 40rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.course-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.close-icon {
  color: #999;
  font-size: 32rpx;
}

.popup-body {
  margin-bottom: 40rpx;
}

.info-card,
.time-card {
  background-color: #f8f9fa;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
}

.info-row,
.time-row {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  font-size: 30rpx;
}

.info-row:last-child,
.time-row:last-child {
  margin-bottom: 0;
}

.info-label,
.time-label {
  color: #666;
  margin-left: 16rpx;
  width: 140rpx;
}

.info-value,
.time-value {
  color: #333;
  flex: 1;
}

.status-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.status-card.signed {
  background-color: #f6ffed;
  border: 1rpx solid #b7eb8f;
}

.status-card.unsigned {
  background-color: #fff7e6;
  border: 1rpx solid #ffd591;
}

.status-text {
  font-size: 32rpx;
  margin-left: 16rpx;
  font-weight: 500;
}

.sign-btn {
  width: 100%;
  height: 90rpx;
  font-size: 32rpx;
}

.sign-btn[disabled] {
  background-color: #d9d9d9 !important;
  color: #999 !important;
}
</style>
