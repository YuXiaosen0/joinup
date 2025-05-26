<template>
	<!-- // 创建者 -->
	<view v-if="userRole === 'creator'">
		<view class="team-detail" v-if="teamDetails">
		    <!-- 团队介绍部分 -->
		    <view class="team-intro">
		      <view class="team-header">
		        <view class="team-info">
				  <image
				    :src="teamDetails.cover || 'https://joinup.oss-cn-beijing.aliyuncs.com/images/img-0424/11.png'"
				    class="cover-img"
				    mode="aspectFill"
				  />

		          <view class="team-name">{{ teamDetails.name }}</view>
		          <view class="team-description">🌟{{ teamDetails.description }}</view>
		        </view>
		      </view>
		    </view>
		
		    <!-- <view class="divider"></view> -->
		
		    <!-- 状态 & 时间 -->
		    <!-- <view class="status-time">
		      <view class="status">🔒状态: <span class="status-text">{{ teamDetails.status }}</span></view>
		      <view class="time">📅创建: {{ formatDate(teamDetails.createTime) }}</view>
		    </view> -->
		
		    <view class="divider"></view>
		
		    <!-- 标签 -->
		    <view v-if="teamDetails.tags && teamDetails.tags.length > 0">
		      <view class="tag-title">🏷️标签：</view>
		      <view class="tags">
		        <view
		          v-for="tag in teamDetails.tags"
		          :key="tag.id"
		          class="tag-item"
		          @click="onSearch(tag.name)"
		        >
		          {{ tag.name }}
		        </view>
		      </view>

		    </view>
		
		    <view class="divider"></view>
		
		    <!-- 成员展示 -->
		    <view v-if="teamDetails.members && teamDetails.members.length > 0">
		      <view class="member-header">
		        <view class="member-title">👥成员：</view>
		        <view class="member-count">
		          最大成员数: {{ teamDetails.maxMembers }} | 当前成员数: {{ teamDetails.currentMembersCount }}
		        </view>
		      </view>
		      <view v-for="member in teamDetails.members" :key="member.id" class="member">
		        <image :src="member.avatar || defaultAvatar" class="member-avatar" />
		        <view class="member-info">
		          <view class="member-name">{{ member.userName }}</view>
		          <view class="member-role">角色: {{ member.role }} </view>
		        </view>
				<button
				  v-if="member.role !== '创建者'"
				  class="kick-btn"
				  @click="handleKick(member.userId)"
				>踢出队伍</button>
		      </view>
		    </view>
			
			<!-- 申请列表（仅创建者） -->
			<!-- <view v-if="userRole === 'creator' && applicationList.length > 0">
			  <view class="member-title">📬申请列表：</view>
			  <view v-for="app in applicationList" :key="app.id" class="application-item">
			    <text>{{ app.userName }}</text>
			    <button @click="handleApprove(app.id)">同意</button>
			  </view>
			</view> -->
		  </view>
		
		  <!-- 空状态 -->
		  <view v-else class="empty-message">
		    <text>加载失败或暂无数据</text>
		  </view>
		
		  <view class="creator-btns-row">
		    <button class="application-btn" @click="goToApplicationList">
		      📬 查看加入申请
		    </button>
		    <button class="modify-btn" @click="modifyTeamInfo(teamDetails.name, teamDetails.description, teamDetails.currentMembersCount, teamDetails.cover)">
		      ✏️ 修改队伍信息
		    </button>
		  </view>
		  <!-- 聊天按钮 -->
		  <view class="chat-button-wrapper">
		    <button class="chat-button" @click="goToChat">
		      💬
		    </button>
		  </view>



	</view>
	
	<!-- // 普通队伍成员 -->
	<view v-else-if="userRole === 'teamMember'">
		<view class="team-detail" v-if="teamDetails">
		    <!-- 团队介绍部分 -->
		    <view class="team-intro">
		      <view class="team-header">
		        <view class="team-info">
				  <image src="https://joinup.oss-cn-beijing.aliyuncs.com/images/img-0424/11.png" class="cover-img" mode="aspectFill"/>
		          <view class="team-name">{{ teamDetails.name }}</view>
		          <view class="team-description">🌟{{ teamDetails.description }}</view>
		        </view>
		      </view>
		    </view>
		
		    <!-- <view class="divider"></view> -->
		
		    <!-- 状态 & 时间 -->
		    <!-- <view class="status-time">
		      <view class="status">🔒状态: <span class="status-text">{{ teamDetails.status }}</span></view>
		      <view class="time">📅创建: {{ formatDate(teamDetails.createTime) }}</view>
		    </view> -->
		
		    <view class="divider"></view>
		
		    <!-- 标签 -->
		    <view v-if="teamDetails.tags && teamDetails.tags.length > 0">
		      <view class="tag-title">🏷️标签：</view>
		      <view class="tags">
		        <view
		          v-for="tag in teamDetails.tags"
		          :key="tag.id"
		          class="tag-item"
		          @click="onSearch(tag.name)"
		        >
		          {{ tag.name }}
		        </view>
		      </view>

		    </view>
		
		    <view class="divider"></view>
		
		    <!-- 成员展示 -->
		    <view v-if="teamDetails.members && teamDetails.members.length > 0">
		      <view class="member-header">
		        <view class="member-title">👥成员：</view>
		        <view class="member-count">
		          最大成员数: {{ teamDetails.maxMembers }} | 当前成员数: {{ teamDetails.currentMembersCount }}
		        </view>
		      </view>
		      <view v-for="member in teamDetails.members" :key="member.id" class="member">
		        <image :src="member.avatar || defaultAvatar" class="member-avatar" />
		        <view class="member-info">
		          <view class="member-name">{{ member.userName }}</view>
		          <view class="member-role">角色: {{ member.role }}</view>
		        </view>
		      </view>
		    </view>
		  </view>
		
		  <!-- 空状态 -->
		  <view v-else class="empty-message">
		    <text>加载失败或暂无数据</text>
		  </view>
		
		  <!-- 退出队伍按钮 -->
		  <view class="leave-btn-wrapper">
		    <button class="leave-btn" @click="leaveTeam">退出队伍</button>
		  </view>
		  <!-- 聊天按钮 -->
		  <view class="chat-button-wrapper">
		    <button class="chat-button" @click="goToChat">
		      💬
		    </button>
		  </view>
	</view>
	
	<!-- // 游客 -->
	<view v-else="userRole === 'visitor'">
		<view class="team-detail" v-if="teamDetails">
		    <!-- 团队介绍部分 -->
		    <view class="team-intro">
		      <view class="team-header">
		        <view class="team-info">
				  <image src="https://joinup.oss-cn-beijing.aliyuncs.com/images/img-0424/11.png" class="cover-img" mode="aspectFill"/>
		          <view class="team-name">{{ teamDetails.name }}</view>
		          <view class="team-description">🌟{{ teamDetails.description }}</view>
		        </view>
		      </view>
		    </view>
		
		    <view class="divider"></view>
		
		    <!-- 状态 & 时间 -->
		    <!-- <view class="status-time">
		      <view class="status">🔒状态: <span class="status-text">{{ teamDetails.status }}</span></view>
		      <view class="time">📅创建: {{ formatDate(teamDetails.createTime) }}</view>
		    </view> -->
		
		    <view class="divider"></view>
		
		    <!-- 标签 -->
		    <view v-if="teamDetails.tags && teamDetails.tags.length > 0">
		      <view class="tag-title">🏷️标签：</view>
		      <view class="tags">
		        <view
		          v-for="tag in teamDetails.tags"
		          :key="tag.id"
		          class="tag-item"
		          @click="onSearch(tag.name)"
		        >
		          {{ tag.name }}
		        </view>
		      </view>

		    </view>
		
		    <view class="divider"></view>
		
		    <!-- 成员展示 -->
		    <view v-if="teamDetails.members && teamDetails.members.length > 0">
		      <view class="member-header">
		        <view class="member-title">👥成员：</view>
		        <view class="member-count">
		          最大成员数: {{ teamDetails.maxMembers }} | 当前成员数: {{ teamDetails.currentMembersCount }}
		        </view>
		      </view>
		      <view v-for="member in teamDetails.members" :key="member.id" class="member">
		        <image :src="member.avatar || defaultAvatar" class="member-avatar" />
		        <view class="member-info">
		          <view class="member-name">{{ member.userName }}</view>
		          <view class="member-role">角色: {{ member.role }}</view>
		        </view>
		      </view>
		    </view>
		  </view>
		
		  <!-- 空状态 -->
		  <view v-else class="empty-message">
		    <text>加载失败或暂无数据</text>
		  </view>
		
		  <!-- 加入按钮 -->
		  <view class="apply-btn-wrapper">
		    <button class="apply-btn" @click="openDialog(teamDetails.currentMembersCount, teamDetails.maxMembers)">申请加入</button>
		  </view>
		  <ApplyToJoinDialog :show="showInputArea" :teamId="teamDetails?.id" @update:show="showInputArea = $event" />
	</view>
	
	
	
  
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { onShow } from '@dcloudio/uni-app'
import {
  getTeamDetails,
  judgeRole,
  getApplicationList,
  kickMember,
  leaveTeamApi,
  uploadBrowse
} from '../../api/api'
import ApplyToJoinDialog from '@/components/applyToJoinDialog.vue'

const teamDetails = ref(null)
const showInputArea = ref(false)
const userRole = ref('') // 'creator', 'member', 'visitor'
const applicationList = ref([])
const teamId = ref()

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'

// 页面加载逻辑
onLoad(async (opt) => {
  try {
    let item = opt.item
    if (!item) return
    item = JSON.parse(decodeURIComponent(item))
	
    if (item?.id) {
	  teamId.value = item.id
	  
	  await uploadBrowse(item.id)
	  
      const res = await getTeamDetails(item.id)
      if (res) {
        teamDetails.value = res
      }

      const roleRes = await judgeRole(item.id)
	  if (roleRes === null) {
		  userRole.value = 'vistor'
	  } else if (roleRes === "成员") {
		  userRole.value = 'teamMember'
	  } else {
		  userRole.value = 'creator'
	  }
	  console.log("!!!",userRole.value)

      /*if (userRole.value === 'creator') {
        const list = await getApplicationList(item.id)
        applicationList.value = list || []
      }*/
    }
  } catch (error) {
    console.error('加载失败：', error)
    teamDetails.value = null
  }
})

onShow(async () => {
	
  if (teamId.value) {
	await uploadBrowse(teamId.value)
    const res = await getTeamDetails(teamId.value)
    /* if (res) {
      teamDetails.value = res
    } */
	
	teamDetails.value = res
	
    const roleRes = await judgeRole(teamId.value)
    if (roleRes === null) {
      userRole.value = 'visitor'
    } else if (roleRes === "成员") {
      userRole.value = 'teamMember'
    } else {
      userRole.value = 'creator'
    }

    // 如果是创建者可以加载申请列表（你目前注释掉了）
    // if (userRole.value === 'creator') {
    //   const list = await getApplicationList(teamId.value)
    //   applicationList.value = list || []
    // }
  }
})

// 打开弹窗
const openDialog = (currentMembersCount, maxMembers) => {
	
	console.log(currentMembersCount)
	console.log(maxMembers)
  // 判断是否满员
  if (currentMembersCount >= maxMembers) {
    wx.showToast({
      title: '团队已满员',
      icon: 'none'
    });
  } else {
    // 未满员时打开对话框
    showInputArea.value = true;
  }
}

// 修改队伍信息
const modifyTeamInfo = (name, description,currentMembersCount, cover) => {
	
  uni.navigateTo({
    url: `/pages/detail/modifyTeam?teamId=${teamId.value}&currentMembers=${currentMembersCount}&name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&cover=${encodeURIComponent(cover)}`

  });
};

const goToChat = () => {
  if (!teamId.value) return
  uni.navigateTo({
    url: `/pages/chat/chat?teamId=${teamId.value}`
  })
}


function onSearch(value) {
  if (!value.trim()) {
    uni.showToast({ title: '请输入关键字', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/detail/searchResult?keyword=${encodeURIComponent(value)}`
  })
}

// 同意加入
const handleApprove = async (applicantId) => {
  await processApplication(teamDetails.value.id, applicantId, 0, '')
  const list = await getApplicationList(teamDetails.value.id)
  applicationList.value = list || []
}

// 踢出成员
const handleKick = async (memberId) => {
	console.log('!!!!!!!!!!!!!!!!!!')
	console.log(teamDetails.value.id)
	console.log(memberId)
  await kickMember(teamDetails.value.id, memberId)
  const res = await getTeamDetails(teamDetails.value.id)
  if (res) teamDetails.value = res
}

// 退出队伍
const leaveTeam = async () => {
  await leaveTeamApi(teamDetails.value.id)
  userRole.value = 'visitor'
  const res = await getTeamDetails(teamDetails.value.id)
  if (res) teamDetails.value = res
}

const goToApplicationList = () => {
  uni.navigateTo({
    url: `/pages/detail/applicationList?teamId=${teamId.value}`
  })
}


const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.team-detail {
  padding: 30rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
}

.team-intro {
  margin-bottom: 20rpx;
}

.team-header {
  display: flex;
  align-items: center;
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.team-description {
  font-size: 28rpx;
  color: #666666;
}

.divider {
  height: 2rpx;
  background-color: #eeeeee;
  margin: 20rpx 0;
}

.status-time {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333333;
}

.status-text {
  color: #ff9900;
  font-weight: bold;
}

.tag-title {
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag-item {
  background-color: #f1f1f1;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #444;
}

.member-header {
  margin-bottom: 20rpx;
}

.member-title {
  font-size: 28rpx;
  font-weight: bold;
}

.member-count {
  font-size: 26rpx;
  color: #999999;
  margin-top: 10rpx;
}

.member {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.cover-img {
  width: 100%;
  height: 300rpx;
  border-radius: 16rpx;
  object-fit: cover;
  background-color: #f0f0f0;
  display: block;
}

.member-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  object-fit: cover;
  background-color: #eee;
  margin-right: 20rpx;
}


.member-info {
  flex: 1;
}

.member-name {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.member-role {
  font-size: 26rpx;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kick-btn {
  margin-left: 20rpx;
  padding: 10rpx 20rpx;
  background-color: #ff4d4f;
  color: white;
  font-size: 24rpx;
  border-radius: 8rpx;
  border: none;
  line-height: 1;
}

.kick-btn::after {
  display: none;
}

.application-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10rpx 0;
  padding: 16rpx;
  border: 1px solid #f0f0f0;
  border-radius: 12rpx;
}

.apply-btn-wrapper {
	display: flex;
	justify-content: center;
	margin-top: 20rpx;
}

.apply-btn {
	background: #34d399; /* 绿色到蓝色渐变 */
	color: #fff;
	padding: 20rpx 40rpx;
	border: none;
	border-radius: 50rpx;
	font-size: 30rpx;
	font-weight: bold;
	transition: all 0.3s ease;
	box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
}
.leave-btn-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
}
.leave-btn {
	background: #888; /* 绿色到蓝色渐变 */
	color: #fff;
	padding: 20rpx 40rpx;
	border: none;
	border-radius: 50rpx;
	font-size: 30rpx;
	font-weight: bold;
	transition: all 0.3s ease;
	box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
}

.application-btn-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
}

.application-btn {
  background: linear-gradient(to right, #34d399, #3b82f6); /* 绿色到蓝色渐变 */
  color: #fff;
  padding: 20rpx 40rpx;
  border: none;
  border-radius: 50rpx;
  font-size: 30rpx;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
}

.application-btn:hover {
  opacity: 0.9;
}


.leave-btn {
  background-color: #007aff;
  color: white;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
  border-radius: 12rpx;
}

.apply-btn::after,
.leave-btn::after {
  display: none;
}

.empty-message {
  text-align: center;
  color: #999999;
  margin-top: 60rpx;
}

.modify-btn-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
}

.modify-btn {
  background: #4CAF50; /* 修改按钮的绿色 */
  color: white;
  padding: 20rpx 40rpx;
  border: none;
  border-radius: 50rpx;
  font-size: 30rpx;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
}

.modify-btn:hover {
  opacity: 0.9;
}
.creator-btns-row {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  margin-top: 30rpx;
}

.application-btn,
.modify-btn {
  flex: 1;
  padding: 20rpx;
  font-size: 28rpx;
  border-radius: 12rpx;
  background-color: #4caf50;
  color: white;
  text-align: center;
}

.modify-btn {
  background-color: #2196f3;
}

.chat-button-wrapper {
  position: fixed;
  bottom: 80rpx;
  right: 40rpx;
  z-index: 999;
}

.chat-button {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #007aff;
  color: white;
  font-size: 40rpx;
  text-align: center;
  line-height: 100rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
  border: none;
}

.chat-button::after {
  display: none;
}

</style>
