<template>
	<view class="message-container">
	  <!-- 顶部标题栏 -->
	  <view class="header">
		<text class="title">消息</text>
	  </view>
	  
	  <!-- 四个图标导航区域 -->
	  <view class="icon-nav">
		<view class="icon-item" @tap="selectMessageType(0), openMessagePopup(0)">
		  <view class="icon-box" :class="{ active: currentType === 0 }">
			<image src="https://joinup.oss-cn-beijing.aliyuncs.com/images/message/team.png" mode="aspectFit"></image>
		  </view>
		  <text class="icon-text" :class="{ active: currentType === 0 }">组队</text>
		</view>
		
		<view class="icon-item" @tap="selectMessageType(2), openMessagePopup(2)">
		  <view class="icon-box" :class="{ active: currentType === 2 }">
			<image src="https://joinup.oss-cn-beijing.aliyuncs.com/images/message/boya.png" mode="aspectFit"></image>
		  </view>
		  <text class="icon-text" :class="{ active: currentType === 2 }">博雅</text>
		</view>
		
		<view class="icon-item" @tap="selectMessageType(1), openMessagePopup(1)">
		  <view class="icon-box" :class="{ active: currentType === 1 }">
			<image src="https://joinup.oss-cn-beijing.aliyuncs.com/images/message/course.png" mode="aspectFit"></image>
		  </view>
		  <text class="icon-text" :class="{ active: currentType === 1 }">课程</text>
		</view>
		
	  </view>
	
	</view>
	
	<!-- 消息弹窗组件 -->
	  <message-popup 
	    v-if="showMessagePopup" 
	    :type="currentTypeMessage"
	    @close="closeMessagePopup"
	  />
  </template>
  
  <script>
  import { ref, reactive } from 'vue'
  import MessagePopup from '../message/message.vue'
  import { getUserInfo, login, modifyUserInfo, getMyMessage, markMessageRead, deleteMessage, getMyTeam} from "../../api/api"
  
  // 跳转详情页
  const goDetail = (item) => {
	if (!item || !item.id) {
	  console.error('无效的 item 对象', item)
	  return
	}
	uni.navigateTo({
	  url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`  // 使用 encodeURIComponent 进行编码
	})
  }
  
  export default {
	  
	  components: {
	      MessagePopup
	    },
	    setup() {
	      const currentTypeMessage = ref(null)
	      const showMessagePopup = ref(false)
	      
	      // 打开消息弹窗
	      const openMessagePopup = (type) => {
	        currentTypeMessage.value = type
	        showMessagePopup.value = true
	      }
	      
	      // 关闭消息弹窗
	      const closeMessagePopup = () => {
	        showMessagePopup.value = false
	      }
	      
	      return {
	        currentTypeMessage,
	        showMessagePopup,
	        openMessagePopup,
	        closeMessagePopup
	      }
	    },
		
	data() {
	  return {
		isRefreshing: false,
		isLoading: false,
		currentType: null, // 使用null表示未选择类型
		readStatus: null,  // null: 全部, false: 未读, true: 已读
		currentPage: 1,
		pageSize: 10,
		totalPages: 0,
		hasSelectedType: false, // 标记是否已选择消息类型
		
		// 消息列表
		messageList: [],
		
		// 队伍列表
		createdTeams: [],  // 用户创建的队伍
		joinedTeams: [],   // 用户加入的队伍
		
		// 图标页面链接
		pageLinks: {
		  team: '/pages/team/team',
		  boya: '/pages/boya/boya',
		  checkin: '/pages/checkin/checkin',
		  newFeature: '/pages/team/team' 
		}
	  };
	},
	
	// 页面加载时获取队伍信息
	onLoad() {
		this.fetchTeams();
	},
	
	
	methods: {
		
	// 获取用户相关的队伍
	    fetchTeams() {
	      // 先获取用户创建的队伍
	      getMyTeam({
	        role: 'CREATOR'
	      }).then(res => {
	        if (res) {
	          this.createdTeams = res || [];
	        } else {
	          console.error('获取创建的队伍失败:', res.msg);
	        }
	      }).catch(err => {
	        console.error('获取创建的队伍异常:', err);
	      });
	      
	      // 再获取用户加入的队伍
	      getMyTeam({
	        role: 'MEMBER'
	      }).then(res => {
	        if (res.code === 1) {
	          this.joinedTeams = res.data || [];
	        } else {
	          console.error('获取加入的队伍失败:', res.msg);
	        }
	      }).catch(err => {
	        console.error('获取加入的队伍异常:', err);
	      });
	    },
	    
	    // 跳转到队伍详情
	    goTeamDetail(team) {
	      if (!team || !team.id) {
	        console.error('无效的队伍对象', team);
	        return;
	      }
	      uni.navigateTo({
	        url: `/pages/team/detail?teamId=${team.id}`
	      });
	    },	
		
	  // 导航到对应页面
	  navigateTo(type) {
		const url = this.pageLinks[type] || '/pages/index/index';
		uni.navigateTo({
		  url: url
		});
	  },
	  
	  // 获取消息类型对应的文本
	  getTypeText(type) {
		const typeMap = {
		  0: '组队',
		  1: '课程',
		  2: '博雅'
		};
		return typeMap[type] || '';
	  },
	  
	  // 获取阅读状态对应的文本
	  getReadStatusText() {
		if (this.readStatus === true) return '已读';
		if (this.readStatus === false) return '未读';
		return '';
	  },
	  
	  // 选择消息类型
	  selectMessageType(type) {
		if (type === null || type === undefined) {
		  return;
		}
		
		this.currentType = type;
		this.hasSelectedType = true;
		this.readStatus = null; // 默认显示全部消息
		this.fetchMessages();
	  },
	  
	  // 切换阅读状态
	  switchReadStatus(status) {
		if (this.readStatus === status) return; // 已经是当前状态，不重复加载
		
		this.readStatus = status;
		this.fetchMessages();
	  },
	  
	  // 获取指定类型和阅读状态的消息
	  fetchMessages() {
		this.isLoading = true;
		this.currentPage = 1;
		this.messageList = []; // 清空之前的消息列表
		
		// 构建请求参数
		const params = {
		  pageSize: this.pageSize,
		  pageNumber: this.currentPage,
		  type: this.currentType
		};
		
		// 如果指定了阅读状态（全部/未读/已读）
		if (this.readStatus !== null) {
		  params.read = this.readStatus;
		}
		
		getMyMessage(params).then(res => {
			//console.log(res);
		  if (res) {
			this.messageList = res.list || [];
			this.totalPages = res.pages || 0;
		  } else {
			this.messageList = []; // 确保在出错时也清空消息列表
			uni.showToast({
			  title: res.msg || '获取消息失败',
			  icon: 'none'
			});
		  }
		  this.isLoading = false;
		  if (this.isRefreshing) {
			this.isRefreshing = false;
		  }
		}).catch(err => {
		  console.error("获取消息失败", err);
		  this.messageList = []; // 确保在出错时也清空消息列表
		  this.isLoading = false;
		  if (this.isRefreshing) {
			this.isRefreshing = false;
		  }
		  uni.showToast({
			title: '获取消息失败',
			icon: 'none'
		  });
		});
	  },
	  
	  // 下拉刷新
	  onRefresh() {
		this.isRefreshing = true;
		// 只有已经选择了消息类型才刷新
		if (this.hasSelectedType) {
		  this.fetchMessages();
		} else {
		  this.isRefreshing = false;
		}
	  },
	  
	  // 加载更多
	  loadMore() {
		if (this.isLoading || this.currentPage >= this.totalPages || !this.hasSelectedType) return;
		
		this.isLoading = true;
		this.currentPage++;
		
		// 构建请求参数
		const params = {
		  pageSize: this.pageSize,
		  pageNumber: this.currentPage,
		  type: this.currentType
		};
		
		// 如果指定了阅读状态（全部/未读/已读）
		if (this.readStatus !== null) {
		  params.read = this.readStatus;
		}
		
		getMyMessage(params).then(res => {
		  if (res) {
			const newList = res.data.list || [];
			this.messageList = [...this.messageList, ...newList];
		  }
		  this.isLoading = false;
		}).catch(err => {
		  console.error("加载更多消息失败", err);
		  this.isLoading = false;
		  uni.showToast({
			title: '加载更多失败',
			icon: 'none'
		  });
		});
	  },
	  
	  // 确认收到消息
	  confirmMessage(id, index) {
		// 如果已读，不执行操作
		if (this.messageList[index] && this.messageList[index].read) {
		  return;
		}
		
		uni.showModal({
		  title: '确认',
		  content: '是否确认收到该消息？',
		  success: (res) => {
			if (res.confirm) {
			  // 显示加载中
			  uni.showLoading({
				title: '确认中...'
			  });
			  
			  // 调用标记消息为已读的API
			  markMessageRead(id).then(res => {
				uni.hideLoading();
				
				if (res.code === 1) {
				  // 成功
				  uni.showToast({
					title: '确认成功',
					icon: 'success'
				  });
				  
				  // 如果当前是显示未读消息，则从列表中移除此消息
				  if (this.readStatus === false) {
					this.messageList.splice(index, 1);
				  } else {
					// 否则更新本地消息状态
					if (this.messageList[index]) {
					  this.messageList[index].read = true;
					  // 使用Vue的响应式更新，确保视图更新
					  this.$set(this.messageList, index, {...this.messageList[index]});
					}
				  }
				} else {
				  // 失败
				  uni.showToast({
					title: res.msg || '确认失败',
					icon: 'none'
				  });
				}
			  }).catch(err => {
				uni.hideLoading();
				console.error("确认消息失败", err);
				uni.showToast({
				  title: '确认失败，请稍后重试',
				  icon: 'none'
				});
			  });
			}
		  }
		});
	  },
	  
	  // 处理删除消息逻辑
	  handleDeleteMessage(id, isRead, index) {
		// 如果消息未读，显示特殊提示
		if (!isRead) {
		  uni.showModal({
			title: '提示',
			content: '该消息未读，确定要删除吗？',
			success: (res) => {
			  if (res.confirm) {
				this.performDeleteMessage(id, index);
			  }
			}
		  });
		} else {
		  // 已读消息直接进入常规删除流程
		  uni.showModal({
			title: '提示',
			content: '确定要删除这条消息吗？',
			success: (res) => {
			  if (res.confirm) {
				this.performDeleteMessage(id, index);
			  }
			}
		  });
		}
	  },
	  
	  // 执行删除消息API调用
	  performDeleteMessage(id, index) {
		// 显示加载中
		uni.showLoading({
		  title: '删除中...'
		});
		
		// 调用删除消息API
		deleteMessage(id).then(res => {
		  uni.hideLoading();
		  
		  if (res.code === 1) {
			// 成功
			uni.showToast({
			  title: '删除成功',
			  icon: 'success'
			});
			
			// 从列表中移除该消息
			this.messageList.splice(index, 1);
		  } else {
			// 失败
			uni.showToast({
			  title: res.msg || '删除失败',
			  icon: 'none'
			});
		  }
		}).catch(err => {
		  uni.hideLoading();
		  console.error("删除消息失败", err);
		  uni.showToast({
			title: '删除失败，请稍后重试',
			icon: 'none'
		  });
		});
	  },
	  
	  // 格式化时间
	  formatTime(timeStr) {
		if (!timeStr) return '';
		const date = new Date(timeStr);
		return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
	  }
	}
  };
  </script>
  
  <style lang="scss">
  .message-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f8f8f8;
  }
  
  /* 顶部标题 */
  .header {
	padding: 44rpx 30rpx 20rpx;
	background-color: #fff;
	display: flex;
	justify-content: center;
	
	.title {
	  font-size: 40rpx;
	  font-weight: bold;
	  color: #333;
	}
  }
  
  /* 四个图标导航 */
  .icon-nav {
	display: flex;
	justify-content: space-around;
	align-items: flex-start;
	padding: 30rpx 20rpx;
	background-color: #fff;
	margin-bottom: 0; // 减少底部间距，因为Tab会紧接着
	flex-wrap: wrap;
	
	.icon-item {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  width: 25%;
	  box-sizing: border-box;
	  padding: 0 10rpx;
	  margin-bottom: 20rpx;
	  
	  .icon-box {
		width: 120rpx;
		height: 120rpx;
		border-radius: 30rpx;
		background-color: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
		overflow: hidden;
		transition: background-color 0.3s;
		
		&.active {
		  background-color: #e6f7ff;
		  border: 2px solid #1890ff;
		}
		
		image {
		  width: 60rpx;
		  height: 60rpx;
		}
	  }
	  
	  .icon-text {
		font-size: 26rpx;
		color: #333;
		
		&.active {
		  color: #1890ff;
		  font-weight: bold;
		}
	  }
	}
  }
  
  /* 消息Tab栏 */
  .message-tabs {
	display: flex;
	background-color: #fff;
	border-bottom: 1px solid #f0f0f0;
	margin-bottom: 20rpx;
	
	.tab-item {
	  flex: 1;
	  text-align: center;
	  padding: 24rpx 0;
	  font-size: 28rpx;
	  color: #666;
	  position: relative;
	  
	  &.active {
		color: #1890ff;
		font-weight: 500;
		
		&:after {
		  content: '';
		  position: absolute;
		  bottom: 0;
		  left: 50%;
		  transform: translateX(-50%);
		  width: 40rpx;
		  height: 4rpx;
		  background-color: #1890ff;
		  border-radius: 2rpx;
		}
	  }
	}
  }
  
  /* 消息列表 */
  .message-list {
	flex: 1;
	background-color: #fff;
	
	&.with-tabs {
	  margin-top: 0;
	}
  }
  
  /* 选择类型提示 */
  .select-type-tips {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
	
	image {
	  width: 200rpx;
	  height: 200rpx;
	  margin-bottom: 20rpx;
	}
	
	text {
	  font-size: 32rpx;
	  color: #666;
	  font-weight: 500;
	}
  }
  
  /* 消息项样式 */
  .message-item {
	padding: 30rpx;
	border-bottom: 1px solid #f0f0f0;
	background-color: #fff;
  }
  
  .message-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
  }
  
  .message-info {
	display: flex;
	flex-direction: column;
  }
  
  .message-sender {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 8rpx;
  }
  
  .message-time {
	font-size: 24rpx;
	color: #999;
  }
  
  .message-read-status {
	font-size: 24rpx;
	color: #999;
	
	&.unread {
	  color: #ff4d4f;
	}
  }
  
  .message-content {
	margin-bottom: 24rpx;
  }
  
  .message-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #333;
	margin-bottom: 12rpx;
	display: block;
  }
  
  .message-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
	display: block;
  }
  
  .message-actions {
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
  }
  
  .action-btn {
	min-width: 160rpx;
	padding: 10rpx 20rpx;
	border-radius: 8rpx;
	font-size: 26rpx;
	text-align: center;
	line-height: 1.5;
	
	&.confirm {
	  background-color: #1890ff;
	  color: #fff;
	  
	  &[disabled] {
		background-color: #bae7ff;
		color: #fff;
		opacity: 0.7;
	  }
	}
	
	&.delete {
	  background-color: #ff4d4f;
	  color: #fff;
	}
  }
  
  /* 空状态提示 */
  .empty-tips {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
	
	image {
	  width: 200rpx;
	  height: 200rpx;
	  margin-bottom: 20rpx;
	}
	
	text {
	  font-size: 28rpx;
	  color: #999;
	}
  }
  
  /* 加载提示 */
  .loading-more {
	text-align: center;
	padding: 30rpx 0;
	
	text {
	  font-size: 24rpx;
	  color: #999;
	}
  }
  
  .teams-container {
      padding: 20rpx;
      margin-top: 20rpx;
    }
    
    .team-section {
      margin-bottom: 20rpx;
    }
    
    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
      color: #333;
    }
    
    .team-list {
      background-color: #fff;
      border-radius: 8rpx;
    }
    
    .team-item {
      padding: 20rpx;
      border-bottom: 1px solid #f5f5f5;
    }
    
    .team-item:last-child {
      border-bottom: none;
    }
    
    .empty-team-tips {
      text-align: center;
      color: #999;
      padding: 30rpx 0;
    }
	
	.container {
	  padding: 20px;
	}
	
	.message-types {
	  display: flex;
	  justify-content: space-around;
	  margin-bottom: 20px;
	}
	
	.type-button {
	  padding: 10px 15px;
	  background-color: #f5f5f5;
	  border-radius: 5px;
	  font-size: 14px;
	}
	
	.type-button.active {
	  background-color: #007AFF;
	  color: #ffffff;
	}
  </style>