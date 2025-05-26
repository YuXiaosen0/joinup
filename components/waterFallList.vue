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
        <!-- 封面图 + 标题浮层 -->
        <view class="cover-wrapper">
          <image
            class="cover-image"
            :src="item.cover || defaultCover"
            mode="aspectFill"
            :lazy-load="true"
          />
          <view class="overlay">
            <view class="title" v-html="highlight(item.name)"></view>
          </view>
        </view>

        <!-- 信息内容 -->
        <view class="info-section">
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

          <!-- 创建者信息 -->
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

    <!-- 右列（同上） -->
    <view class="column">
      <view
        v-for="(item, index) in rightList"
        :key="item.id || `right-${index}`"
        class="display-card"
        @click="handleClick(item)"
      >
        <view class="cover-wrapper">
          <image
            class="cover-image"
            :src="item.cover || defaultCover"
            mode="aspectFill"
            :lazy-load="true"
          />
          <view class="overlay">
            <view class="title" v-html="highlight(item.name)"></view>
          </view>
        </view>

        <view class="info-section">
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

          <view class="creator-info">
            <image
              class="creator-avatar"
              :src="item.creatorAvatar ? item.creatorAvatar : defaultAvatar"
              mode="aspectFill"
            />
            <text class="creator-name">{{ item.creatorUserName || '匿名用户' }}</text>
          </view>
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
  // console.log('组件初始接收到的数据：', props.modelValue)
})

watch(() => props.modelValue, (newVal) => {
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
const defaultCover = 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'
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
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.display-card:hover {
  transform: translateY(-8rpx);
}

.cover-wrapper {
  position: relative;
  width: 100%;
  height: 240rpx;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent);
}

.overlay .title {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 8rpx rgba(0, 0, 0, 0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-section {
  padding: 24rpx;
}

.display-field {
  margin-bottom: 16rpx;
  display: flex;
  align-items: flex-start;
}

.field-name {
  font-size: 28rpx;
  color: #555;
  font-weight: 600;
  margin-right: 8rpx;
  white-space: nowrap;
}

.field-value {
  font-size: 28rpx;
  color: #0055aa;
  word-break: break-word;
  flex: 1;
}

mark {
  background-color: #ffeb3b;
  color: black;
  font-weight: bold;
  padding: 0 4rpx;
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
