<template>
  <view class="homePage">
    <!-- 封装的搜索框 -->
    <SearchBar v-model="keyword" @search="onSearch" @clear="onClear" />

    <!-- 轮播图 -->
    <SwiperBanner :swiperList="swiperList" @itemClick="goAnnouncement" />

    <!-- Tabs：使用 position: sticky 实现吸顶 -->
    <view class="tabs-sticky">
      <up-tabs
        :list="themes.map(item => ({ name: item.name }))"
        :current="currentTab"
        @change="onTabChange"
        active-color="#3c9cff"
      />
    </view>

    <!-- 内容区 -->
    <WaterfallList v-model="flowList" @itemClick="goDetail" />
  </view>
</template>


<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { getTeamList, getThemeList, getSwiperList, searchTeam } from '../../api/api'
import WaterfallList from '@/components/WaterfallList.vue'
import SearchBar from '@/components/SearchBar.vue'
import SwiperBanner from '@/components/SwiperBanner.vue'
import {onShow} from '@dcloudio/uni-app'
import { useWebSocket } from '../../utils/useWebSocket.js';
const token = uni.getStorageSync('token');
const ws = useWebSocket(token);
const keyword = ref('')
const themes = reactive([])
const swiperList = ref([])  // 存储轮播图数据
let currentTab = ref(0)
let flowList = ref([])

onShow(() => {
  fetchSwiperList()  // 获取轮播图数据
  fetchThemes()
  loadList(0)
})

// 页面加载时触发的逻辑
onMounted(() => {
	fetchSwiperList()  // 获取轮播图数据
  fetchThemes()
  loadList(0)
  
})

// 分类切换
function onTabChange(index) {
  currentTab.value = index.index
  const themeId = themes[currentTab.value].id  // 获取当前选中主题的 themeId
  loadList(themeId) 
}

// 加载首页列表数据
function loadList(themeId) {
  console.log('当前 themeId:', themeId)
  getTeamList(themeId).then(res => {
    if (res && res.list) {
      flowList.value = res.list || []
    } else {
      console.error('接口返回数据结构不正确:', res)
      flowList.value = []  // 默认空数据
    }
  }).catch(error => {
    console.error('API 请求失败:', error)
    flowList.value = []  // 请求失败时设置为空
  })
}

// 获取主题列表
function fetchThemes() {
  getThemeList().then(res => {
    themes.splice(0, themes.length, ...res.map(item => ({
      name: item.name,
      id: item.id,
      description: item.description || '暂无描述'
    })))

    if (themes.length > 0) {
      loadList(themes[currentTab.value].id)
    }
  }).catch(error => {
    console.error('获取主题列表失败:', error)
  })
}

// 获取轮播图数据
const fetchSwiperList = async () => {
  try {
    const res = await getSwiperList(); // res 是数组，不是对象

    if (Array.isArray(res)) {
      swiperList.value = res.map(item => ({
        image: item.cover,
        title: item.title,
        id: item.id,
      }));
    } else {
      console.warn('轮播图返回的不是数组:', res);
      swiperList.value = [];
    }
  } catch (err) {
    console.error('请求轮播图接口异常:', err);
    swiperList.value = [];
  }
};

// 搜索触发
function onSearch(value) {
  if (!value.trim()) {
    uni.showToast({ title: '请输入关键字', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/detail/searchResult?keyword=${encodeURIComponent(value)}`
  })
}

// 清空搜索
function onClear() {
  keyword.value = ''
}

// 跳转详情页
const goDetail = (item) => {
  if (!item || !item.id) {
    console.error('无效的 item 对象', item)
    return
  }
  uni.navigateTo({
    url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`  // 使用 encodeURIComponent 进行编码
  })
}

const goAnnouncement = (item) => {
  console.log(item)
  if (!item || !item.id) {
    console.error('无效的 item 对象', item)
    return
  }
  uni.navigateTo({
    url: `/pages/detail/announcement?item=${encodeURIComponent(JSON.stringify(item))}`  // 使用 encodeURIComponent 进行编码
  })
}
</script>

<style scoped>
.tabs-sticky {
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: #fff;
}
</style>
