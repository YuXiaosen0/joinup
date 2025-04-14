<template>
  <view class="auth-container">
    <up-toast ref="uToastRef"></up-toast>
    
    <!-- 主卡片 -->
    <view class="auth-card">
      <!-- 头部标题 -->
      <view class="auth-header">
        <text class="auth-title">北航邮箱验证</text>
        <text class="auth-subtitle">请输入您的@buaa.edu.cn邮箱完成验证</text>
      </view>
      
      <!-- 邮箱输入组 -->
      <view class="input-group">
        <up-input
          v-model="form.email"
          placeholder="请输入北航邮箱"
          border="none"
          clearable
          class="auth-input"
          placeholder-class="input-placeholder"
          :custom-style="inputStyle"
        >
          <template #prefix>
            <up-icon name="email" color="#7d7d7d" size="20"></up-icon>
          </template>
        </up-input>
      </view>
      
      <!-- 验证码输入组 -->
      <view class="input-group code-group">
        <up-input
          v-model="form.code"
          placeholder="请输入验证码"
          border="none"
          class="auth-input"
          placeholder-class="input-placeholder"
          :custom-style="inputStyle"
        >
          <template #prefix>
            <up-icon name="lock" color="#7d7d7d" size="20"></up-icon>
          </template>
        </up-input>
        
        <button
          @click="sendCode"
          class="code-button"
          :disabled="codeButton.disabled"
          :class="{ 'code-button-disabled': codeButton.disabled }"
        >
          {{ codeButton.text }}
        </button>
      </view>
      
      <!-- 验证按钮 -->
      <button
        @click="handleVerify"
        class="auth-button"
        :disabled="!formValid"
        :class="{ 'auth-button-disabled': !formValid }"
      >
        立即验证
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// 表单数据
const form = reactive({
  email: '',
  code: ''
})

// 验证码按钮状态
const codeButton = reactive({
  text: '获取验证码',
  disabled: false,
  seconds: 60
})

// 输入框样式
const inputStyle = {
  backgroundColor: '#f8f9fa',
  borderRadius: '12rpx',
  padding: '24rpx',
  fontSize: '28rpx'
}

// 表单验证
const formValid = computed(() => {
  return form.email && form.code && 
         form.email.endsWith('@buaa.edu.cn') && 
         form.code.length === 6
})

// 发送验证码
const sendCode = () => {
  if (!form.email.endsWith('@buaa.edu.cn')) {
    uni.showToast({
      title: '请输入北航邮箱',
      icon: 'none'
    })
    return
  }
  
  // 模拟发送验证码
  uni.showLoading({ title: '发送中...' })
  setTimeout(() => {
    uni.hideLoading()
    startCountdown()
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    })
  }, 1000)
}

// 开始倒计时
const startCountdown = () => {
  codeButton.disabled = true
  const timer = setInterval(() => {
    codeButton.seconds--
    codeButton.text = `${codeButton.seconds}秒后重试`
    
    if (codeButton.seconds <= 0) {
      clearInterval(timer)
      codeButton.text = '获取验证码'
      codeButton.disabled = false
      codeButton.seconds = 60
    }
  }, 1000)
}

// 处理验证
const handleVerify = () => {
  uni.showLoading({ title: '验证中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '验证成功',
      icon: 'success'
    })
    // 这里可以跳转到下一页
  }, 1500)
}
</script>

<style scoped>
.auth-container {
  padding: 40rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eaf2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 48rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
}

.auth-header {
  margin-bottom: 60rpx;
  text-align: center;
}

.auth-title {
  font-size: 42rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.auth-subtitle {
  font-size: 28rpx;
  color: #7d7d7d;
  line-height: 1.6;
}

.input-group {
  margin-bottom: 40rpx;
}

.code-group {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.auth-input {
  flex: 1;
}

.input-placeholder {
  color: #bdbdbd;
  font-size: 28rpx;
}

.code-button {
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 12rpx;
  padding: 24rpx 32rpx;
  font-size: 28rpx;
  min-width: 200rpx;
  transition: all 0.3s;
  flex-shrink: 0;
}

.code-button-disabled {
  background-color: #d9d9d9 !important;
  color: #999 !important;
}

.auth-button {
  background: linear-gradient(90deg, #1890ff, #096dd9);
  color: white;
  border: none;
  border-radius: 12rpx;
  padding: 28rpx;
  font-size: 32rpx;
  font-weight: 500;
  width: 100%;
  margin-top: 20rpx;
  transition: all 0.3s;
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.3);
}

.auth-button-disabled {
  background: #d9d9d9 !important;
  color: #999 !important;
  box-shadow: none;
}

.code-button:active, 
.auth-button:active {
  opacity: 0.9;
  transform: scale(0.98);
}

/* 响应式调整 */
@media (max-width: 480px) {
  .auth-card {
    padding: 40rpx 32rpx;
  }
  
  .code-group {
    flex-direction: column;
    gap: 20rpx;
  }
  
  .code-button {
    width: 100%;
  }
}
</style>