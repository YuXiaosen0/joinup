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
					<!-- 兴趣 -->
					<view class="u-item" @click="goToTechnology">
						<view class="icon-wrapper">
							<uni-icons  type="star" size="30" color="#FF4D4F"></uni-icons>
						</view>
						<view class="u-tit">技术</view>
					</view>

					<!-- 加入队伍 -->
					<view class="u-item">
						<view class="num">{{ userInfo.joinedTeamCount }}</view>
						<view class="u-tit">加入队伍</view>
					</view>

					<!-- 创建队伍 -->
					<view class="u-item">
						<view class="num">{{ userInfo.createdTeamCount }}</view>
						<view class="u-tit">创建队伍</view>
					</view>

				</view>
			</view>
		</view>
		<!-- 功能项列表 -->
		<view class="listBox">
		    <view class="lists">
		        <u-cell-group>
		            <!-- 列出多个功能项，点击时跳转到相应页面 -->

					<u-cell  title="浏览历史" is-link url="/pages/detail/browseHistory"></u-cell>
		            <u-cell  title="课程助手" is-link 
								:url="userInfo.studentId ? '/pages/course/course' : '/pages/veri/veri'"></u-cell>
		            <u-cell  title="博雅助手" is-link url="/pages/boya/boya"></u-cell>
								<u-cell 
									title="反馈问题" 
									is-link 
									@click="openFeedbackPopup"
								/>
								<up-popup closeable @close="closeFeedbackPopup" :show="showFeedbackPopup" round="20">
									<view class="popup">
										<view class="title">反馈问题</view>

										<!-- 反馈主题选择框 -->
										<view class="form-item">
											<view class="form-label">反馈主题</view>
											<picker 
												class="form-picker" 
												:range="subjectOptions" 
												@change="onSubjectChange"
											>
												<view class="form-value">
													{{ selectedSubject || '请选择反馈主题' }}
												</view>
											</picker>
										</view>

										<!-- 反馈内容输入框 -->
										<view class="form-item">
											<view class="form-label">反馈内容</view>
											<textarea 
												class="feedback-textarea" 
												placeholder="请输入您的反馈内容..." 
												v-model="feedbackContent"
											></textarea>
										</view>

										<!-- 联系方式输入框 -->
										<view class="form-item">
											<view class="form-label">联系方式</view>
											<input 
												class="form-input" 
												type="text" 
												placeholder="请输入您的联系方式（选填）" 
												v-model="contactInfo"
											/>
										</view>

										<!-- 提交按钮 -->
										<button 
											class="submit-button" 
											@click="submitFeedback"
										>
											提交
										</button>
									</view>
								</up-popup>
		        </u-cell-group>
		    </view>
		</view>
		<!-- 弹出层，用于获取昵称和头像 -->
		<!-- @close: 这个事件监听器用于处理弹出层关闭时的事件。
		:show: 这个属性用于控制弹出层的显示状态。 -->
		<up-popup closeable @close="close" :show="show" round="20">
		  <view class="popup">
			<view class="title">获取您的昵称、头像</view>

			<!-- 获取用户头像 -->
			<view class="flex">
				<view class="label">上传头像：</view>
				<button class="upload-btn" @click="chooseFile">选择文件</button>
			</view>

			<!-- 获取用户昵称 -->
			<view class="flex">
			  <view class="label">获取用户昵称：</view>
			  <input @input="changeName" type="nickname" placeholder="请输入昵称">
			</view>

			<!-- 选择性别 -->
			<view class="flex">
			  <view class="label">选择性别：</view>
			  <picker :range="genderOptions" @change="changeGender">
				<view class="picker-value">{{ userInfo.gender || '请选择性别' }}</view>
			  </picker>
			</view>

			<!-- 输入北航密码 -->
			<view class="flex">
			  <view class="label">北航密码：</view>
			  <input v-model="userInfo.ssoPassword" type="password" placeholder="请输入北航密码（可选）">
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
	import { getUserInfo, login,modifyUserInfo,getSignRecord,feedback,uploadFile } from "../../api/api"
	const userInfo = ref({
			username: '',
			avatar: '',
			studentId: '',
			gender:'',
			joinedTeamCount: 0,
			createdTeamCount: 0,
			createTime: '',
			ssoPassword: ''
	})
	// 性别选项
	const genderOptions = ["男", "女"];
	
	// 修改性别
	const changeGender = (e) => {
	  userInfo.value.gender = genderOptions[e.detail.value];
	};

// 控制反馈弹窗的显示
const showFeedbackPopup = ref(false);

// 反馈主题选项
const subjectOptions = ["功能建议", "使用问题", "界面优化", "其他"];
const selectedSubject = ref(""); // 当前选择的主题

// 反馈内容
const feedbackContent = ref("");

// 联系方式
const contactInfo = ref("");
const fileInput = ref(); // 引用文件输入框


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
      url: 'https://joinup.org.cn/api-dev/oss/file/upload', // 替换为实际的上传接口
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
			userInfo.value.avatar = data.data.url
      uni.showToast({
        title: "上传成功",
        icon: "success",
      });
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
// 打开反馈弹窗
const openFeedbackPopup = () => {
  showFeedbackPopup.value = true;
};

// 关闭反馈弹窗
const closeFeedbackPopup = () => {
  showFeedbackPopup.value = false;
};

// 选择反馈主题
const onSubjectChange = (e) => {
  selectedSubject.value = subjectOptions[e.detail.value];
};

// 提交反馈
const submitFeedback = async() => {
  if (!selectedSubject.value) {
    uni.showToast({
      title: "请选择反馈主题",
      icon: "none",
    });
    return;
  }

  if (!feedbackContent.value.trim()) {
    uni.showToast({
      title: "请输入反馈内容",
      icon: "none",
    });
    return;
  }

  // 模拟提交反馈
  console.log("反馈主题:", selectedSubject.value);
  console.log("反馈内容:", feedbackContent.value);
  console.log("联系方式:", contactInfo.value);
	const data={
		"subject" :selectedSubject.value,
		"content":feedbackContent.value,
		"contact":contactInfo.value
	}
	const res=await feedback(data)
	console.log("feedback",res)
  uni.showToast({
    title: "反馈已提交",
    icon: "success",
  });

  // 清空输入框并关闭弹窗
  selectedSubject.value = "";
  feedbackContent.value = "";
  contactInfo.value = "";
  closeFeedbackPopup();
	};
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
		uni.navigateTo({
			url: '/pages/sign/sign' // 跳转到签到记录页面
		});
	    // showSignPopup.value = true; // 显示弹窗
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
				uni.setStorageSync('userInfo', userInfo);
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
	
	//提交用户信息，保存到本地存储  TODO
	const userSubmit = async() => {
		// 同步地将数据存储到本地存储（Local Storage）中,'userInfo'为键，后者为值
		const data={
			"username":userInfo.value.username ,
			"avatar": userInfo.value.avatar,
			"gender":userInfo.value.gender,
			"ssoPassword":userInfo.value.ssoPassword
		}		
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
.icon-lightbulb {
  width: 30rpx;
  height: 30rpx;
  filter: drop-shadow(0 0 10px #FFD700); /* 发光效果 */
}
.content {
    height: 100vh;
    background-color: #f5f5f5;
		.popup-container {
			padding: 20rpx;
			background-color: #fff;
			border-radius: 20rpx 20rpx 0 0;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		}

		.popup-header {
			margin-bottom: 20rpx;
			text-align: center;
		}

		.popup-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}

		.popup-subtitle {
			font-size: 28rpx;
			color: #999;
			margin-top: 8rpx;
		}

		.filter-section {
			padding: 20rpx;
			background-color: #f9f9f9;
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
					background-color: white;
					border-radius: 16rpx;
				}

				.u-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					height: 120rpx;
					background-color: white;
				}

				.u-item:hover {
					transform: scale(1.05);
				}

				.icon-wrapper {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 60rpx;
					height: 60rpx;
					background-color: #fff;
					border-radius: 50%;
					box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
					margin-bottom: 10rpx;
				}

				.u-tit {
					font-size: 26rpx;
					color: #666;
					margin-top: 10rpx;
				}

				.num {
					font-size: 50rpx;
					font-weight: bold;
					color: #333;
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
						.file-input {
						width: 100%;
						height: 80rpx;
						border: 1rpx solid #ccc;
						border-radius: 10rpx;
						padding: 10rpx;
						font-size: 28rpx;
						box-sizing: border-box;
						background-color: #fff;
						color: #666;
					}
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

.popup {
  padding: 20rpx;
  border-radius: 20rpx 20rpx 0 0;
  background-color: #fff;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20rpx;
}

.form-item {
  margin-bottom: 20rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.form-picker,
.form-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #ccc;
  border-radius: 10rpx;
  padding: 10rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-value {
  line-height: 80rpx;
  color: #666;
}

.feedback-textarea {
  width: 100%;
  height: 200rpx;
  border: 1rpx solid #ccc;
  border-radius: 10rpx;
  padding: 10rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.submit-button {
  width: 100%;
  height: 80rpx;
  background-color: #2979ff;
  color: #fff;
  font-size: 30rpx;
  text-align: center;
  line-height: 80rpx;
  border-radius: 10rpx;
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

.upload-btn {
  padding: 10rpx 20rpx;
  background-color: #2979ff;
  color: #fff;
  font-size: 28rpx;
  border-radius: 10rpx;
  text-align: center;
  line-height: 40rpx;
  margin-left: 20rpx;
}
</style>
