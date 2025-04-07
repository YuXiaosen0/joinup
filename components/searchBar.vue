<template>
	<view class="search-bar">
		<up-search
			placeholder="搜索组队信息"
			bg-color="#e3e3e3"
			v-model="searchValue"
			@search="handleSearch"
			@clear="handleClear"
		></up-search>
	</view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const searchValue = ref(props.modelValue)

// 双向绑定父组件数据
watch(searchValue, (newVal) => {
	emit('update:modelValue', newVal)
})

function handleSearch() {
	emit('search', searchValue.value)
}

function handleClear() {
	emit('clear')
}
</script>

<style scoped>
.search-bar {
	padding: 16rpx;
	background-color: #fff;
}
</style>
