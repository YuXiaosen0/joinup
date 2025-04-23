<template>
	<view class="content">
		<view class="topBox">
			<!-- 设置区块 -->
			<view class="setbox">
				<view class="set-left">
					<!-- 日历图标 -->
					<uni-icons type="calendar" size="30" color="#fff"></uni-icons>
					<view class="txt" @click="openSign">签到记录</view>
				</view>
				<up-popup closeable @close="closeSignPopup" :show="showSignPopup" round="20">
				  <view class="popup-container">
				    <view class="popup-header">
				      <text class="popup-title">签到记录</text>
				      <view class="popup-subtitle">查看您的历史签到情况</view>
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
				</up-popup>
				<view class="set-right">
					<!-- 设置图标 和 聊天图标 -->
					<uni-icons type="gear" size="30" color="#fff"></uni-icons>
				</view>
			</view>
			<!-- 用户信息展示 -->
			<view class="users" >
				<view class="u-top" >
					<!-- 用户未登录时显示默认头像和"注册/登录" -->
					<template v-if="!userInfo.username">
						<image
							src="https://survey-planet-test.oss-cn-beijing.aliyuncs.com/3385f9606a5775ee842d9257248d568.jpg"
							mode="aspectFill"
						>
						</image>
						<view class="tit">
							注册/登录
						</view>
					</template>
					<!-- 用户已登录时显示用户头像和昵称 -->
					<template v-else>
						<image
							:src="userInfo.avatar"
							mode="aspectFill"
						>
						</image>
						<view class="tit">
							{{ userInfo.username }}
						</view>
						
					</template>
					<!-- 添加箭头图标 -->
  				<uni-icons class="arrow-icon" type="arrowright" size="30" color="#999" @click.stop="setFun"></uni-icons>
				</view>
				<view class="u-bottom">
				    <!-- 展示用户的一些统计数据：点赞、喜欢、浏览、收藏 -->
				    <view class="u-item" @click="goToTechnology">
							<view class="num">12</view>
							<view class="u-tit">技术</view>
					</view>
				    <view class="u-item">
				        <view class="num">{{ userInfo.joinedTeamCount }}</view>
				        <view class="u-tit">加入队伍</view>
				    </view>
				    <view class="u-item">
				        <view class="num">{{ userInfo.createdTeamCount }}</view>
				        <view class="u-tit">创建队伍</view>
				    </view>
				    <view class="u-item">
				        <view class="num">12</view>
				        <view class="u-tit">收藏</view>
				    </view>
				</view>
			</view>
		</view>
		<!-- 功能项列表 -->
		<view class="listBox">
		    <view class="lists">
		        <u-cell-group>
		            <!-- 列出多个功能项，点击时跳转到相应页面 -->

		            <u-cell  title="课程打卡" is-link 
								:url="userInfo.studentId ? '/pages/course/course' : '/pages/veri/veri'"></u-cell>
		            <u-cell  title="博雅打卡" is-link url="/pages/boya/boya"></u-cell>
		        </u-cell-group>
		    </view>
		</view>
		<!-- 弹出层，用于获取昵称和头像 -->
		<!-- @close: 这个事件监听器用于处理弹出层关闭时的事件。
		:show: 这个属性用于控制弹出层的显示状态。 -->
		<up-popup closeable @close="close" :show="show" round="20">
		    <view class="popup">
		        <view class="title">获取您的昵称、头像</view>
		        <view class="flex">
		            <view class="label">获取用户头像：</view>
		            <!-- 用户选择头像 -->
					<!-- open-type="chooseAvatar" - 指定按钮类型为选择头像
					@chooseavatar="onChooseavatar" - 当用户选择完头像后触发的事件处理函数
					<image> 标签用于显示当前头像 -->
		            <button class="avatar-warpper" open-type="chooseAvatar" @chooseavatar="onChooseavatar">
		                <image class="avatar" :src="userInfo.avatar"></image>
		            </button>
		        </view>
				<!-- 微信小程序会读取当前已授权的用户信息，并将其提供给相关字段进行自动填充。 -->
		        <view class="flex">
		            <view class="label">获取用户昵称：</view>
		            <!-- 输入昵称 -->
		            <input @input="changeName" type="nickname">
		        </view>
		        <!-- 提交按钮 -->
		        <button size="default" type="primary" @click="userSubmit">确定</button>
		    </view>
		</up-popup>
	</view>
</template>

<script setup>
	import {reactive,ref} from "vue"
	import {onLoad} from '@dcloudio/uni-app'
	import { getUserInfo, login,modifyUserInfo,getSignRecord } from "../../api/api"
	const userInfo = ref({
			username: '',
	    avatar: '',
			studentId: '',
			gender:'',
			joinedTeamCount: 0,
			createdTeamCount: 0,
			createTime: '',
	})
	// 控制弹出层的显示
	const show = ref(false)
	const goToTechnology = () => {
			uni.navigateTo({
					url: '/pages/technology/technology' // 跳转到 technology 页面
			});
	};
	// 定义格式化时间函数
	const formatTime = (time) => {
	  if (!time) return '--';
	  const date = new Date(time);
	  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
	};
	const getSignList = async () => {
			const res = await getSignRecord(pageQuery);
			console.log("res",res)
			signList.value = res.list;
	}
	// 关闭弹出层
	const close = () => {
	    show.value = false
	}
	const showSignPopup = ref(false); // 控制签到记录弹窗的显示
	const signList = ref([]); // 存储签到记录列表
	const pageQuery = reactive({
	  pageNo: 1, // 页码
	  pageSize: 10, // 每页条数
	  isAsc: true // 排序方式（升序/降序）
	});

	// 打开签到记录弹窗
	const openSign = async () => {
	    showSignPopup.value = true; // 显示弹窗
	};
	
	// 关闭签到记录弹窗
	const closeSignPopup = () => {
	  showSignPopup.value = false; // 隐藏弹窗
	};
	// 页面加载时获取用户信息
	onLoad(async () => {
		uni.login({
		  success: async (data) => {
			console.log("微信登录 code:", data.code);
			try {
			  const { token } = await login(data.code);
			  uni.setStorageSync('token', token);
			  console.log("登录成功，获取到 token:", token);

			  // 获取用户信息
			  const res = await getUserInfo();
				Object.assign(userInfo.value, res);

			  // 缓存用户信息
			  uni.setStorageSync('userInfo', JSON.stringify(userInfo));
			  console.log("用户信息:", userInfo);
			} catch (error) {
			  console.error("登录或获取用户信息失败:", error);
			  uni.showToast({
				title: '登录失败，请稍后重试',
				icon: 'none',
			  });
			}
		  },
		  fail: (err) => {
			console.error("微信登录失败:", err);
			uni.showToast({
			  title: '微信登录失败',
			  icon: 'none',
			});
		  },
		});
	});
	
	// 提交用户信息，保存到本地存储
	const userSubmit = async() => {
		// 同步地将数据存储到本地存储（Local Storage）中,'userInfo'为键，后者为值
		const data={
			"username":userInfo.value.username ,
			"avatar": userInfo.value.avatar,
			"gender":userInfo.value.gender
		}
	  uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		const res = await modifyUserInfo(data)
		console.log("modifyUserInfo",res)
	  show.value = false
	}
	
	// 选择头像时更新头像
	const onChooseavatar = (e) => {
	    userInfo.value.avatar = e.detail.avatarUrl
	}
	
	// 输入昵称时更新昵称
	const changeName = (e) => {
	    userInfo.value.username = e.detail.value
			console.log("userInfo",userInfo)
	}
	
	// 设置用户信息的方法
	const setFun = () => {
	    // 给用户一个确认的提醒
	    uni.showModal({
	        title: '温馨提升',
	        content: '亲，授权微信登录后才能正常使用小程序',
	        success(res) {
	            if (res.confirm) {
	                        show.value = true
	            }
	        }
	    })
	}
</script>

<style lang="scss" scoped>
.content {
    height: 100vh;
    background-color: #f5f5f5;
    .topBox {
        width: 100%;
        position: relative;
        z-index: 1;
        overflow: hidden;
        padding: 40rpx 20rpx 40rpx;
        box-sizing: border-box;
    }
    .topBox::after {
        content: "";
        width: 140%;
        height: 200px;
        position: absolute;
        z-index: -1;
        top: 0;
        left: -20%;
        background-color: #00aaff;
        border-radius: 0 0 50% 50%;
    }
    .setbox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .set-left {
            width: 18%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .txt {
            color: #fff;
            font-size: 30rpx;
        }
    }
    .users {
        margin-top: 35rpx;
        padding: 30rpx;
        box-sizing: border-box;
        height: 280rpx;
        background-color: #fff;
        box-shadow: 1px 10rpx 20rpx #ececec;
        border-radius: 16rpx;
        .u-top {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 30rpx;
            image {
                width: 100rpx;
                height: 100rpx;
                border-radius: 50%;
                margin-right: 20rpx;
            }
            .tit {
                font-size: 30rpx;
                font-weight: 700;
                color: #333;
            }
						.arrow-icon {
							margin-left: auto; /* 将箭头推到最右侧 */
						}
        }
        .u-bottom {
            display: flex;
            justify-content: space-around;
            align-items: center;
            .u-item {
                text-align: center;
                .u-tit {
                    color: #757575;
                    font-size: 26rpx;
                    margin-top: 10rpx;
                }
                .num {
                    color: #000;
                    font-size: 33rpx;
                    font-weight: 700;
                }
            }
        }
    }
    .popup {
        padding: 20rpx;
        border-radius: 20rpx 20rpx 0 0;
        .title {
            margin-bottom: 20rpx;
            font-size: 40rpx;
            text-align: center;
        }
        .flex {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-bottom: 1px solid #f5f5f5;
            padding: 24rpx 0;
        }
        image {
            width: 70rpx;
            height: 70rpx;
        }
        .avatar-warpper {
            border: none;
            border-radius: 10rpx;
            width: 70rpx;
            height: 70rpx;
            margin-left: 20rpx;
            padding: 0;
        }
    }
    .listBox {
        height: 200rpx;
        margin: -10rpx auto 0;
        padding: 20rpx;
        box-sizing: border-box;
        border-radius: 12rpx;
    }
}
//自动签到打卡部分的css
.popup-container {
  padding: 24rpx 32rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  margin-bottom: 32rpx;
  text-align: center;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.popup-subtitle {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.filter-section {
  background-color: #f8f8f8;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 32rpx;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.filter-label {
  font-size: 28rpx;
  color: #666;
}

.filter-picker {
  flex: 1;
  text-align: right;
}

.filter-value {
  display: inline-flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
  padding: 8rpx 16rpx;
  background-color: #fff;
  border-radius: 8rpx;
  border: 1rpx solid #eee;
}

.query-button {
  background-color: #2979ff;
  color: white;
  border-radius: 48rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
  margin-top: 16rpx;
}

.sign-list {
  flex: 1;
  max-height: 50vh;
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

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 24rpx;
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
