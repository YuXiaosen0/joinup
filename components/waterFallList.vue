<template>
  <view class="waterfall-container">
    <!-- 左列 -->
    <view class="column">
      <view
        v-for="(item, index) in leftList"
        :key="item.id || `left-${index}`"
        class="display-card"
        @click="handleClick(item)"
      >
        <view class="display-card-header">
          <view class="title" v-html="highlight(item.name)"></view>
        </view>

        <view class="display-field">
          <text class="field-name">简介：</text>
          <view class="field-value">{{ item.description }}</view>
        </view>

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

    <!-- 右列 -->
    <view class="column">
      <view
        v-for="(item, index) in rightList"
        :key="item.id || `right-${index}`"
        class="display-card"
        @click="handleClick(item)"
      >
        <view class="display-card-header">
          <view class="title" v-html="highlight(item.name)"></view>
        </view>

        <view class="display-field">
          <text class="field-name">简介：</text>
          <view class="field-value">{{ item.description }}</view>
        </view>

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

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps({
  modelValue: Array,
  highlightKeyword: String
})

const emit = defineEmits(['update:modelValue', 'itemClick'])

const flowList = ref(props.modelValue)

onMounted(() => {
  //console.log('组件初始接收到的数据：', props.modelValue)
})

watch(() => props.modelValue, (newVal) => {
  //console.log('组件收到的新数据：', newVal)
  flowList.value = newVal
})

watch(flowList, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleClick = (item) => {
  emit('itemClick', item)
}

const leftList = computed(() =>
  flowList.value.filter((_, index) => index % 2 === 0)
)
const rightList = computed(() =>
  flowList.value.filter((_, index) => index % 2 === 1)
)

const highlight = (text) => {
  if (!props.highlightKeyword || !text) return text || ''
  const regex = new RegExp(`(${props.highlightKeyword})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
</script>

<style scoped>
.waterfall-container {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  padding: 16rpx;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.display-card {
  margin-bottom: 24rpx;
  background-color: #e0f7fa;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  break-inside: avoid;
}

.display-card:hover {
  transform: translateY(-8rpx);
  box-shadow: 0 14rpx 28rpx rgba(0, 0, 0, 0.18);
}

.display-card-header {
  text-align: center;
  margin-bottom: 24rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

mark {
  background-color: #ffeb3b;
  color: black;
  font-weight: bold;
}

/* 新增样式 */
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
