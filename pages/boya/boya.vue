<template>
 
</template>

<script setup>
import {ref} from "vue"
import {onLoad} from '@dcloudio/uni-app'
import { boyaAuthentication, getBoyaCourse,xuanBoya,lookupYiXuan,deleteBoya,appointBoya,getAppointList,cancelAppoint } from "../../api/api"
onLoad(async() => {
	// 页面加载时获取课程列表
	const res = await boyaAuthentication();
	console.log("boyaAuthentication",res);
})

</script>

<style>

</style>