<template>
  <view class="swiper-container">
    <!-- 轮播图列表或加载状态或空数据占位 -->
	<view v-for="(item, index) in swiperList" :key="index">
	  <up-swiper :key="index" :list="[item]" keyName="image" showTitle="" radius="8" :autoplay="true" height="160" @click="handleClick(item)"/>
	</view>

    
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
const handleClick = (item) => {
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

/* 控制图片展示方式 */
.swiper-images .swiper-slide {
  position: relative;
  z-index: 1; /* 确保图片不被覆盖 */
}

.swiper-title {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 10; /* 确保标题在图片之上 */
}


</style>
