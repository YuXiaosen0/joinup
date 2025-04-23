<template>
	<view class="homePage">
		<!-- 封装的搜索框 -->
		<SearchBar v-model="keyword" @search="onSearch" @clear="onClear" />
		
		<!-- 轮播图 -->
		<up-swiper :list="swiperList" keyName="image" radius="8" :autoplay="true" height="160"></up-swiper>

		<!-- Tabs -->
		<up-sticky bgColor="#fff">
			<up-tabs :list="categories" :current="currentTab" @change="onTabChange" active-color="#3c9cff" />
		</up-sticky>

		<!-- 内容区 -->
		<view v-if="currentTab === 0">
			<WaterfallList v-model="flowList" @itemClick="goDetail" />
		</view>

		<view v-else-if="currentTab === 1">
			<text>这是旅游内容</text>
		</view>

		<view v-else-if="currentTab === 2">
			<text>这是游戏内容</text>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getIndexList, searchList } from '../../api/api' // 假设 searchList 是你的搜索接口
import WaterfallList from '@/components/WaterfallList.vue'
import SearchBar from '@/components/SearchBar.vue'

const keyword = ref('')
const swiperList = ref([])

const categories = reactive([
	{ name: '课程' },
	{ name: '旅游' },
	{ name: '游戏' }
])

let currentTab = ref(0)
let flowList = ref([])

// 分类切换
function onTabChange(index) {
	currentTab.value = index.index
	loadList()
}

// 初始加载
onMounted(() => {
	loadList()
	initSwiper()
})

function initSwiper() {
    swiperList.value = [
        // { image: 'https://survey-planet-test.oss-cn-beijing.aliyuncs.com/9ec3b3d8670e11a01fbc7d586f3433f.png' },
        // { image: 'https://survey-planet-test.oss-cn-beijing.aliyuncs.com/9ec3b3d8670e11a01fbc7d586f3433f.png' },
        // { image: 'https://survey-planet-test.oss-cn-beijing.aliyuncs.com/9ec3b3d8670e11a01fbc7d586f3433f.png' }
    ]
}

// 加载首页列表数据
function loadList() {
	getIndexList().then(res => {
		console.log(res)
		flowList.value = [res]
	})
}

// 搜索触发
function onSearch(value) {
	if (!value.trim()) {
		uni.showToast({ title: '请输入关键字', icon: 'none' })
		return
	}
	searchList({ keyword: value, category: categories[currentTab.value].name }).then(res => {
		flowList.value = [res]
	})
}

// 清空搜索
function onClear() {
	keyword.value = ''
	loadList()
}

// 跳转详情页
const goDetail = (item) => {
	const can = JSON.stringify(item)
	uni.navigateTo({
		url: `/pages/detail/detail?item=${encodeURIComponent(can)}`
	})
}
</script>