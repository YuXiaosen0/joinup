<template>
  <view class="popup-overlay" @tap="close">
    <view class="popup-content" @tap.stop>
      <view class="popup-header">
        <text class="popup-title">{{ getTypeText() }}消息</text>
        <view class="close-button" @tap="close">×</view>
      </view>
      
      <!-- 消息阅读状态选项卡 -->
      <view class="read-status-tabs">
		  <!--
        <view 
          class="tab-item" 
          :class="{ active: readStatus === null }" 
          @tap="switchReadStatus(null)"
        >
          全部
        </view>
		-->
        <view 
          class="tab-item" 
          :class="{ active: readStatus === false }" 
          @tap="switchReadStatus(false)"
        >
          未读
        </view>
        <view 
          class="tab-item" 
          :class="{ active: readStatus === true }" 
          @tap="switchReadStatus(true)"
        >
          已读
        </view>
		<view
		  class="tab-item" 
		  :class="{ active: readStatus === null }" 
		  @tap="switchReadStatus(null)"
		>
		  全部
		</view>
      </view>
      
      <!-- 消息列表 -->
      <scroll-view 
        scroll-y 
        class="message-list"
        @scrolltolower="loadMore"
        refresher-enabled
        :refresher-triggered="isRefreshing"
        @refresherrefresh="onRefresh">
        
        <view v-if="messageList.length === 0" class="empty-tips">
          <text>暂无{{getReadStatusText()}}{{getTypeText()}}消息</text>
        </view>
        
        <view v-for="(item, index) in messageList" :key="index" class="message-item">
          <view class="message-header">
            <view class="message-info">
              <text class="message-time">{{formatTime(item.createTime)}}</text>
            </view>
            <text class="message-read-status" v-if="item.read">已读</text>
            <text class="message-read-status unread" v-else>未读</text>
          </view>
          
          <view class="message-content">
            <text class="message-title">{{item.title}}</text>
            <text class="message-text">{{item.content}}</text>
          </view>
          
          <view class="message-actions">
            <button class="action-btn confirm" @tap="confirmMessage(item.id, index)" :disabled="item.read">
              {{ item.read ? '已确认' : '确认收到' }}
            </button>
            <button class="action-btn delete" @tap="handleDeleteMessage(item.id, item.read, index)">删除</button>
          </view>
        </view>
        
        <!-- 加载更多提示 -->
        <view class="loading-more" v-if="isLoading">
          <text>加载中...</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { getMyMessage, markMessageRead, deleteMessage } from "../../api/api"

export default {
  props: {
    type: {
      type: Number,
      required: true
    }
  },
  
  emits: ['close'],
  
  setup(props, { emit }) {
    const readStatus = ref(false)
    const messageList = ref([])
    const isLoading = ref(false)
    const isRefreshing = ref(false)
    const page = ref(1)
    const pageSize = ref(10)
    const hasMore = ref(true)
    
    // 获取消息列表
    const getMessages = async (refresh = false) => {
      if (refresh) {
        page.value = 1
        hasMore.value = true
      }
      
      if (!hasMore.value && !refresh) return
      
      try {
        isLoading.value = true
        const params = {
          type: props.type,
          page: page.value,
          size: pageSize.value
        }
        
        if (readStatus.value !== null) {
          params.read = readStatus.value
        }
		
		console.log("???????")
		console.log(props)
		console.log(props.type)
		//console.log(props.type.type)
		console.log(params)
		console.log(params.type)
		
        
        const res = await getMyMessage(params)
        
        if (res) {
          if (refresh) {
            messageList.value = res.list || []
          } else {
            messageList.value = [...messageList.value, ...(res.list || [])]
          }
          
          hasMore.value = (res.list && res.list.length === pageSize.value)
          
          if (hasMore.value) {
            page.value++
          }
        } else {
          uni.showToast({
            title: res?.msg || '获取消息失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('获取消息出错', error)
        uni.showToast({
          title: '获取消息失败',
          icon: 'none'
        })
      } finally {
        isLoading.value = false
        if (isRefreshing.value) {
          isRefreshing.value = false
        }
      }
    }
    
    // 切换已读/未读状态筛选
    const switchReadStatus = (status) => {
      if (readStatus.value === status) return
      readStatus.value = status
      getMessages(true)
    }
    
    // 确认消息
    const confirmMessage = async (id, index) => {
      try {
        const res = await markMessageRead(id)
        if (res && res.code === 200) {
          if (index >= 0 && index < messageList.value.length) {
            messageList.value[index].read = true
          }
          
          uni.showToast({
            title: '已确认',
            icon: 'success'
          })
		  
        } else {
          uni.showToast({
            title: res?.msg || '确认失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('确认消息出错', error)
        uni.showToast({
          title: '确认失败',
          icon: 'none'
        })
      }
    }
    
    // 删除消息
    const handleDeleteMessage = async (id, isRead, index) => {
      uni.showModal({
        title: '提示',
        content: isRead ? '确定要删除该消息吗？' : '该消息未读，确定要删除吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const res = await deleteMessage(id)
              if (res && res.code === 200) {
                messageList.value.splice(index, 1)
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
              } else {
                uni.showToast({
                  title: res?.msg || '删除失败',
                  icon: 'none'
                })
              }
            } catch (error) {
              console.error('删除消息出错', error)
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    }
    
    // 加载更多
    const loadMore = () => {
      if (!isLoading.value && hasMore.value) {
        getMessages()
      }
    }
    
    // 下拉刷新
    const onRefresh = () => {
      isRefreshing.value = true
      getMessages(true)
    }
    
    // 关闭弹窗
    const close = () => {
      emit('close')
    }
    
    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      
      return `${year}-${month}-${day} ${hour}:${minute}`
    }
    
    // 获取消息类型文本
    const getTypeText = () => {
      switch (props.type) {
        case 0: return '组队'
        case 2: return '博雅'
        case 1: return '课程'
        default: return ''
      }
    }
    
    // 获取已读状态文本
    const getReadStatusText = () => {
      if (readStatus.value === null) return ''
      return readStatus.value ? '已读' : '未读'
    }
    
    // 监听类型变化
    watch(() => props.type, () => {
      readStatus.value = null
      getMessages(true)
    })
    
    // 初始化
    onMounted(() => {
      getMessages()
    })
    
    return {
      readStatus,
      messageList,
      isLoading,
      isRefreshing,
      switchReadStatus,
      confirmMessage,
      handleDeleteMessage,
      loadMore,
      onRefresh,
      close,
      formatTime,
      getTypeText,
      getReadStatusText
    }
  }
}
</script>

<style>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  width: 90%;
  height: 80%;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
}

.close-button {
  font-size: 24px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.read-status-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
}

.tab-item.active {
  color: #007AFF;
  border-bottom: 2px solid #007AFF;
}

.message-list {
  flex: 1;
  padding: 10px;
}

.message-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-read-status {
  font-size: 12px;
  color: #999;
}

.message-read-status.unread {
  color: #ff6b00;
}

.message-content {
  margin-bottom: 12px;
}

.message-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
  display: block;
}

.message-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  margin-left: 10px;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
}

.action-btn.confirm {
  background-color: #007AFF;
  color: white;
}

.action-btn.confirm:disabled {
  background-color: #ccc;
}

.action-btn.delete {
  background-color: #ff3b30;
  color: white;
}

.empty-tips {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.loading-more {
  text-align: center;
  color: #999;
  padding: 10px 0;
}
</style>