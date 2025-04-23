<template>
  <view class="search-bar">
    <view class="search-input-container">
      <up-search
        v-model="searchValue"
        placeholder="搜索组队信息"
        bg-color="#e3e3e3"
        shape="round"
        :show-action="false"
        @search="handleSearch"
        @confirm="handleSearch"
        @clear="handleClear"
      />
      <button class="search-button" @click="handleSearch">🔍</button>
    </view>
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

// 同步更新父组件的 v-model
watch(searchValue, (newVal) => {
  emit('update:modelValue', newVal)
})

// 搜索事件触发
function handleSearch() {
  console.log('[SearchBar] 触发搜索：', searchValue.value)
  if (!searchValue.value.trim()) {
    uni.showToast({ title: '请输入关键字', icon: 'none' })
    return
  }
  emit('search', searchValue.value)  // ✅ 通过事件发给父组件处理跳转
}

// 清空搜索框
function handleClear() {
  searchValue.value = ''  // 清空输入框
  emit('update:modelValue', '')  // 更新父组件的 v-model，确保父组件同步清空
  emit('clear')  // 通知父组件清空事件
}
</script>



<style scoped>
.search-bar {
  padding: 16rpx;
  background-color: #fff;
}

.search-input-container {
  display: flex;
  align-items: center;
}

.search-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #f0f0f0;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

</style>
