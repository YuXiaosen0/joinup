<template>
  <view class="create-tag-container">
    <view class="card">
      <view class="form-item">
        <text class="label">📌 标签名称</text>
        <input v-model="tagName" class="input" placeholder="请输入标签名称" />
      </view>
      <view class="form-item">
        <text class="label">📝 标签描述</text>
        <textarea v-model="tagDescription" class="textarea" placeholder="请输入标签描述" />
      </view>
      <button class="submit-btn" @click="submitTag">✨ 提交申请</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { applyCreateTag } from '../../api/api'

const tagName = ref('')
const tagDescription = ref('')

const submitTag = async () => {
  if (!tagName.value || !tagDescription.value) {
    uni.showToast({ title: '请填写完整内容', icon: 'none' })
    return
  }

  try {
    await applyCreateTag(tagName.value, tagDescription.value)
    uni.showToast({ title: '提交申请成功', icon: 'success' })
    tagName.value = ''
    tagDescription.value = ''
  } catch (err) {
    uni.showToast({ title: '申请失败', icon: 'none' })
  }
}
</script>

<style scoped>
.create-tag-container {
  padding: 40rpx 20rpx;
  background: #f6f8fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 100%;
  max-width: 680rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
  padding: 40rpx;
}

.form-item {
  margin-bottom: 40rpx;
}

.label {
  font-weight: 600;
  font-size: 30rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.input,
.textarea {
  width: 100%;
  background: #f9f9f9;
  border: 2rpx solid #e5e5e5;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 28rpx;
  box-shadow: inset 0 0 6rpx rgba(0, 0, 0, 0.03);
}

.textarea {
  min-height: 160rpx;
}

.submit-btn {
  width: 100%;
  padding: 24rpx;
  font-size: 30rpx;
  font-weight: bold;
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: white;
  border: none;
  border-radius: 16rpx;
  box-shadow: 0 6rpx 12rpx rgba(0, 123, 255, 0.2);
  transition: all 0.3s;
}

.submit-btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}
</style>
