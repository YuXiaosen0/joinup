<template>
  <view class="search-result">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">加载中...</view>

    <!-- 无结果 -->
    <view v-else-if="teams.length === 0" class="empty">未找到相关结果</view>

    <!-- 结果列表 -->
    <view v-else>
      <view v-for="item in teams" :key="item.id" class="team-item" @click="goDetail(item)">
        <view class="team-title">{{ item.name || '未命名队伍' }}</view>
        <view class="team-desc">{{ item.description || '暂无描述' }}</view>
		<view class="display-field">
		  <text class="field-name">人数：</text>
		  <text class="field-value">
		    {{ item.currentMembersCount }}/{{ item.maxMembers }}
		  </text>
		</view>
		
		<!-- 用户名和头像显示区域 -->
		<view class="creator-info">
		  <image
		    class="creator-avatar"
		    :src="item.creatorAvatar || defaultAvatar"
		    mode="aspectFill"
		  />
		  <text class="creator-name">{{ item.creatorUserName || '匿名用户' }}</text>
		</view>
      </view>
	  
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { searchTeam } from '../../api/api'

export default {
  setup() {
    const teams = ref([])
    const loading = ref(true)

    const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'

    onLoad(async (option) => {
      const keyword = decodeURIComponent(option.keyword || '')
      console.log('搜索关键词：', keyword)

      try {
        loading.value = true
        const res = await searchTeam(keyword )
        teams.value = res || []
      } catch (error) {
        console.error('搜索失败', error)
        uni.showToast({ title: '搜索失败', icon: 'none' })
      } finally {
        loading.value = false
      }
    })

    const goDetail = (item) => {
      if (!item?.id) return
      uni.navigateTo({
        url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`
      })
    }

    return {
      teams,
      loading,
      goDetail,
      defaultAvatar // ✅ 一定要 return 出去
    }
  }
}
</script>

<style scoped>
.search-result {
  padding: 24rpx;
}

.loading,
.empty {
  text-align: center;
  color: #999;
  padding: 40rpx 0;
}

.team-item {
  padding: 20rpx;
  margin-bottom: 20rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.team-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.team-desc {
  margin-top: 8rpx;
  font-size: 28rpx;
  color: #666;
}
.display-field {
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
}

.field-name {
  font-size: 28rpx;
  color: #555;
  font-weight: 600;
  margin-right: 8rpx;
}

.field-value {
  font-size: 28rpx;
  color: #0055aa;
  flex: 1;
  word-break: break-word;
}
.creator-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16rpx;
}

.creator-avatar {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  margin-right: 8rpx;
}

.creator-name {
  font-size: 28rpx;
  color: #333;
}
</style>
