<template>
	<view class="list">
		<up-waterfall v-model="flowList" ref="uWaterfallRef">
			<template v-slot:left="{ leftList }">
				<view class="display-card" v-for="(item, index) in leftList" :key="index" @click="handleClick(item)">
					<view class="display-title">
						{{ item.title }}
					</view>
					<view class="display-demand">
						{{ item.demand }}
					</view>
				</view>
			</template>
			<template v-slot:right="{ rightList }">
				<view class="display-card" v-for="(item, index) in rightList" :key="index" @click="handleClick(item)">
					<view class="display-title">
						{{ item.title }}
					</view>
					<view class="display-demand">
						{{ item.demand }}
					</view>
				</view>
			</template>
		</up-waterfall>
	</view>
</template>

<script setup>
import { ref, watch } from 'vue'

// 接收父组件传递的数据和事件
const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	}
})

const emit = defineEmits(['update:modelValue', 'itemClick'])

// 瀑布流数据本地副本
const flowList = ref(props.modelValue)

// 监听父组件数据变化同步到内部
watch(() => props.modelValue, (newVal) => {
	flowList.value = newVal
})

// 双向绑定更新
watch(flowList, (newVal) => {
	emit('update:modelValue', newVal)
})

// 点击事件抛给父组件
const handleClick = (item) => {
	emit('itemClick', item)
}
</script>

<style scoped>
.list {
	margin: 30rpx 0;
}
.display-card {
	margin: 10rpx;
	background-color: #e6f2ff;
	border: 1rpx solid #cce0ff;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 102, 204, 0.1);
	transition: all 0.3s ease;
	break-inside: avoid;
}
.display-card:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 6rpx 16rpx rgba(0, 102, 204, 0.15);
	background-color: #d9e9ff;
}
.display-title {
	font-size: 30rpx;
	margin: 10rpx 0;
	color: #003366;
	font-weight: 600;
}
.display-demand {
	font-size: 26rpx;
	margin: 10rpx 0;
	color: #0066cc;
	line-height: 1.5;
}
</style>
