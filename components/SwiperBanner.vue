<template>
  <view class="swiper-container">
    <!-- 检查是否有数据 -->
    <view v-if="swiperList.length === 0" class="no-data">
      暂无数据
    </view>
    
    <!-- 轮播图列表 -->
    <up-swiper 
      v-if="swiperList.length > 0"
      :list="swiperList"
      keyName="image"
      showTitle
      radius="8"
      :autoplay="true"
      height="160"
      @click="handleClick"
    />

  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const emit = defineEmits(['update:modelValue', 'itemClick'])

const props = defineProps({
  swiperList: {
    type: Array,
    default: () => []
  }
})



const handleClick = (index) => {
  const item = props.swiperList[index]
  if (!item || !item.id) {
    console.error('无效的 item 对象', item)
    return
  }
  emit('itemClick', item)
}
</script>

<style scoped>
.swiper-container {
  margin: 16rpx 0;
}

.no-data {
  text-align: center;
  font-size: 16px;
  color: #999;
}
</style>
