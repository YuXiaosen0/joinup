<template>
  <view class="application-list-page">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="error" class="error">{{ error }}</view>
    <view v-else>
      <view v-if="applications.length > 0">
        <view
          v-for="(item, index) in applications"
          :key="index"
          class="application-item"
        >
          <view class="avatar-section">
            <image :src="item.avatar" class="avatar" mode="aspectFill" />
          </view>
          <view class="info">
            <view class="username">{{ item.username }}</view>
            <view class="message">申请理由：{{ item.applicationMessage }}</view>
          </view>
          <view class="actions">
            <button size="mini" type="primary" @click="handleProcess(item.id, 0)">同意</button>
            <button size="mini" type="warn" @click="handleProcess(item.id, 1)">拒绝</button>
          </view>
        </view>
      </view>
      <view v-else class="empty">暂无待处理申请</view>
    </view>
  </view>
</template>


<script>
import { getApplicationList, processApplication, getTeamDetails } from '../../api/api'
import { ref } from 'vue'

export default {
  data() {
    return {
      teamId: null,
      applications: [],
      loading: true,
      error: '',
      teamDetails: null,
	  maxMember: 0,
	  currentMember: 0
    }
  },
  async onLoad(options) {
    try {
      this.teamId = parseInt(options.teamId)
  
      // 获取团队详情并解析成员列表
      const teamRes = await getTeamDetails(this.teamId)
      const memberList = teamRes.members || []
	  this.maxMember = teamRes.maxMembers || 0
	  this.currentMember = teamRes.currentMembersCount || 0
	  console.log('!!!!!!!!!',this.maxMember)
  
      // 提取出成员 userId 列表（注意全是字符串）
      const memberUserIds = memberList.map(m => String(m.userId))
  
      // 获取申请列表
      const appRes = await getApplicationList(this.teamId)
      const rawList = appRes || []
  
      // 筛选：状态为“待处理”，并且申请人不在成员列表中
      this.applications = rawList.filter(item => {
        return item.status === '待处理' && !memberUserIds.includes(String(item.userId))
      })
  
    } catch (err) {
      this.error = '获取申请列表失败，请稍后再试'
      console.error(err)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async handleProcess(applicationId, action) {
		 if (action === 0) { // 同意操作，先判断是否满员
		      if (this.currentMember >= this.maxMember) {
		        uni.showToast({
		          title: '队伍已满员，无法再同意新成员',
		          icon: 'none'
		        });
		        return; // 阻止后续调用
		      }
		    }
      try {
        await processApplication(this.teamId, applicationId, action)
        // 处理成功后从列表中移除该条申请
        this.applications = this.applications.filter(item => item.id !== applicationId)
		if (action === 0) {
		        this.currentMember += 1;
		      }
        uni.showToast({
          title: action === 0 ? '已同意' : '已拒绝',
          icon: 'success'
        })
      } catch (err) {
        console.error(err)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    }
  }
}

</script>

<style scoped>
.application-list-page {
  padding: 20rpx;
}
.loading,
.empty,
.error {
  text-align: center;
  margin-top: 100rpx;
  color: #888;
}
.application-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
.avatar-section {
  margin-right: 20rpx;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
}
.info {
  flex: 1;
}
.username {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}
.message {
  font-size: 26rpx;
  color: #333;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
</style>
