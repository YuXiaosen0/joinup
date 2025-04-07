<template>
	<view>
		<text>这是测试内容</text>
		<text>这是测试内容</text>
		<text>这是测试内容</text>
		<text>这是测试内容</text>
		<text>这是测试内容</text>
		<text>这是测试内容</text>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	
	onLoad((opt) => {
		JSON.parse(decodeURIComponent(opt.item))
	})
</script>

<style lang="scss">

</style>
