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
            v-if="!isCourseSelected(course.course_id)
            &&isWithinSelectPeriod(course.select_start_date, course.select_end_date)
			&&course.max_count>course.current_count"
            class="action-btn select-btn"
            @click="xuanKe(course.course_id)"
          >
            选课
          </button>
          <button 
            v-else-if="isCourseSelected(course.course_id)"
            class="action-btn cancel-btn"
            @click="tuiKe(course)"
          >
            退选
          </button>
          <button 
            v-else
            class="action-btn disabled-btn"
          >
            无法选课
          </button>
		  <button
		    v-if="!hasAppointment(course.course_id)
        && new Date() < new Date(course.select_end_date)"
		    class="action-btn appointment-btn"
		    @click="yuYue(course.course_id)"
		  >
		    预约
		  </button>
		  <button 
		    v-else-if="hasAppointment(course.course_id)"
		    class="action-btn disabled-btn"
		    disabled
		  >
		    已预约
		  </button>
      <button 
		    v-else
		    class="action-btn disabled-btn"
		    disabled
		  >
		    当前时间无法预约
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
        
        <picker 
          class="page-picker"
          mode="selector" 
          :range="pageSizeOptions" 
          :value="pageSizeIndex"
          @change="changePageSize"
        >
          <view class="picker-text">
            每页 {{ pageSize }} 条
          </view>
        </picker>
        
        <picker 
          class="page-picker"
          mode="selector" 
          :range="pageNumberOptions" 
          :value="pageNumber"
          @change="changePageNumber"
        >
          <view class="picker-text">
            第 {{ pageNumber }} 页
          </view>
        </picker>
        
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
          <text class="course-time">时间: {{ formatDateTime(course.start_date) }} 至 {{ formatDateTime(course.end_date) }}</text>
          <text class="course-college">学院: {{ course.college }}</text>
          <text class="course-position">地点: {{ course.position }}</text>
        </view>
        <view class="course-actions">
          <button 
            class="action-btn cancel-btn"
            @click="tuiSelectedKe(course.id)"
          >
            退选
          </button>
          <!-- <button 
            v-if="!hasAppointment(course.course_id)"
            class="action-btn appointment-btn"
            @click="yuYue(course.course_id)"
          >
            预约打卡
          </button>
          <button 
            v-else
            class="action-btn disabled-btn"
            disabled
          >
            已预约
          </button> -->
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
          <text class="appointment-time">课程开选时间: {{ formatDateTime(appointment.select_start_date) }}</text>
        </view>
        <button 
          class="action-btn cancel-btn"
          @click="ceXiaoYuYue(appointment.id)"
        >
          撤销预约
        </button>
      </view>
    </view>


  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import {onLoad} from '@dcloudio/uni-app'
import { boyaAuthentication, getBoyaCourse,xuanBoya,lookupYiXuan,deleteBoya,appointBoya,getAppointList,cancelAppoint } from "../../api/api"
const allCourses = ref([])
const selectedCourses = ref([])
const appointments = ref([])
const isWithinSelectPeriod = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
};
const formatDateTime = (dateTime) => {
  if (!dateTime) return '--';
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
//预约
const yuYue = async (courseId) => {
  try {
	  console.log("预约kaishi",courseId)
    const data = { "course_id": courseId };
    const res = await appointBoya(data)
    console.log("预约成功:", res);

    // 更新预约列表
    appointments.value.push({
      id: res.id,
      course_id: courseId,
      name: res.name,
      select_start_date: res.select_start_date,
    });

    uni.showToast({
      title: "预约成功",
      icon: "success",
    });
  } catch (error) {
    console.error("预约失败:", error);
    uni.showToast({
      title: "预约失败，请重试",
      icon: "none",
    });
  }
};

//撤销预约
const ceXiaoYuYue = async (appointmentId) => {
  try {
    const res = await cancelAppoint(appointmentId);
    console.log("撤销预约成功:", res);

    // 从预约列表中移除已撤销的预约
    appointments.value = appointments.value.filter(
      (appointment) => appointment.id !== appointmentId
    );

    uni.showToast({
      title: "撤销预约成功",
      icon: "success",
    });
  } catch (error) {
    console.error("撤销预约失败:", error);
    uni.showToast({
      title: "撤销预约失败，请重试",
      icon: "none",
    });
  }
};
//选课
const xuanKe = async (courseId) => {
  try {
    const data = { course_id: courseId };
    const res = await xuanBoya(data);
    console.log("选课成功:", res);

    // 更新已选课程列表
    selectedCourses.value.push({
      course_id: courseId,
      name: res.name,
      start_date: res.start_date,
      end_date: res.end_date,
      college: res.college,
      position: res.position,
    });

    uni.showToast({
      title: "选课成功",
      icon: "success",
    });
  } catch (error) {
    console.error("选课失败:", error);
    uni.showToast({
      title: "选课失败，请重试",
      icon: "none",
    });
  }
};
//退已选择的课
const tuiSelectedKe = async (Id) => {
  try {
    const res = await deleteBoya(Id);
    console.log("退课成功:", res);

    // 从已选课程列表中移除已退选的课程
    selectedCourses.value = selectedCourses.value.filter(
      (course) => course.id !== Id
    );

    uni.showToast({
      title: "退课成功",
      icon: "success",
    });
  } catch (error) {
    console.error("退课失败:", error);
    uni.showToast({
      title: "退课失败，请重试",
      icon: "none",
    });
  }
};
//退课
const tuiKe = async (course) => {
  // 在 selectedCourses 中查找匹配的课程
  const selectedCourse = selectedCourses.value.find(item => item.course_id === course.course_id);

  if (selectedCourse) {
    try {
      // 调用 deleteBoya 方法，传入找到的课程的 id
      const res1 = await deleteBoya(selectedCourse.id);
      console.log("deleteBoya", res1);

      // 从 selectedCourses 中移除已退选的课程
      selectedCourses.value = selectedCourses.value.filter(item => item.course_id !== course.course_id);

      uni.showToast({
        title: "退课成功",
        icon: "success"
      });
    } catch (error) {
      console.error("退课失败:", error);
      uni.showToast({
        title: "退课失败",
        icon: "none"
      });
    }
  } else {
    console.error("未找到匹配的课程");
    uni.showToast({
      title: "未找到匹配的课程",
      icon: "none"
    });
  }
};
// 加载课程数据的函数
const loadCourseData = async () => {
  try {
    const res = await getBoyaCourse({
      "page_size": pageSize.value,
      "page_number": pageNumber.value
    })
    allCourses.value = res
    uni.showToast({
      title: `已加载第${pageNumber.value}页`,
      icon: 'none'
    })
  } catch (error) {
    uni.showToast({
      title: '加载数据失败',
      icon: 'error'
    })
    console.error('加载数据失败:', error)
  }
}
onLoad(async() => {
  await loadCourseData()

  selectedCourses.value=await lookupYiXuan();
  console.log("selectedCourses.value",selectedCourses.value)

  appointments.value=await getAppointList();
  console.log(" appointments.value", appointments.value)
})

// 界面状态
const activeTab = ref('all')

// 切换标签页
const switchTab = async(tab) => {
  activeTab.value = tab
  if(tab=='all'){
	  const res = await getBoyaCourse({
	    "page_size": pageSize.value,
	    "page_number": pageNumber.value
	  })
	  allCourses.value = res
  }else if(tab=='selected'){
	  selectedCourses.value=await lookupYiXuan();
	  console.log("selectedCourses.value",selectedCourses.value)
  }else{
	  appointments.value=await getAppointList();
	  console.log(" appointments.value", appointments.value)
  }
  
  
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

// 分页相关状态
const pageNumber = ref(1)
const pageSize = ref(6)
const pageSizeOptions = [5, 6, 10, 15, 20]
const pageSizeIndex = ref(1) // 默认选中6条/页

// 计算可选的页码范围
const pageNumberOptions = computed(() => {
  const options = []
  // 假设总页数为10，实际应根据API返回的总页数计算
  const totalPages = 10
  for (let i = 1; i <= totalPages; i++) {
    options.push(`第 ${i} 页`)
  }
  return options
})

const pageNumberIndex = computed(() => pageNumber.value - 1)

// 改变每页显示数量
const changePageSize = (e) => {
  const index = e.detail.value
  pageSizeIndex.value = index
  pageSize.value = pageSizeOptions[index]
  loadCourseData() // 重新加载数据
}

// 改变页码
const changePageNumber = (e) => {
  const index = e.detail.value
  pageNumber.value = parseInt(index, 10) + 1;
  console.log("pageNumber.value",pageNumber.value)
  loadCourseData() // 重新加载数据
}

// 上一页
const prevPage = () => {
  if (pageNumber.value > 1) {
    pageNumber.value--
    loadCourseData()
  }
}

// 下一页
const nextPage = () => {
  pageNumber.value++
  loadCourseData()
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

/* 空状态提示 */
.empty-tip {
  text-align: center;
  padding: 60rpx 0;
  font-size: 28rpx;
  color: #999;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30rpx 0;
}

.page-btn {
  width: 140rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
  margin: 0 10rpx;
  background-color: #07C160;
  color: #fff;
  border-radius: 30rpx;
}

.page-btn[disabled] {
  background-color: #ccc;
}

.page-picker {
  margin: 0 10rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
}

.picker-text {
  color: #333;
}


</style>