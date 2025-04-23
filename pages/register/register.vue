<template>
  <view class="container">
    <!-- 顶部切换按钮 -->
    <view class="switch-tabs">
      <view 
        :class="['tab', activeTab === 'login' ? 'active' : '']"
        @click="switchTab('login')"
      >
        登录
      </view>
      <view 
        :class="['tab', activeTab === 'register' ? 'active' : '']"
        @click="switchTab('register')"
      >
        注册
      </view>
    </view>

    <!-- 登录表单 -->
    <view v-if="activeTab === 'login'" class="form-container">
      <view class="form-item">
        <text class="label">用户名</text>
        <input 
          class="input" 
          type="number" 
          v-model="loginForm.phone" 
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>
      <view class="form-item">
        <text class="label">密码</text>
        <input 
          class="input" 
          type="password" 
          v-model="loginForm.password" 
          placeholder="请输入密码"
        />
      </view>
      <view class="forgot-password" @click="navigateToForgotPassword">
        忘记密码？
      </view>
      <button class="submit-btn" @click="handleLogin">登录</button>
      
      <!-- 微信快捷登录 -->
      <view class="wechat-login">
        <view class="divider">
          <view class="line"></view>
          <text class="text">或使用以下方式登录</text>
          <view class="line"></view>
        </view>
        <button class="wechat-btn" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
          <image src="/static/images/wechat-icon.png" class="wechat-icon"></image>
          <text>微信快捷登录</text>
        </button>
      </view>
    </view>

    <!-- 注册表单 -->
    <view v-else class="form-container">
      <view class="form-item">
        <text class="label">手机号</text>
        <input 
          class="input" 
          type="number" 
          v-model="registerForm.phone" 
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>
      <view class="form-item">
        <text class="label">验证码</text>
        <view class="code-input">
          <input 
            class="input" 
            type="number" 
            v-model="registerForm.code" 
            placeholder="请输入验证码"
            maxlength="6"
          />
          <button 
            class="code-btn" 
            :disabled="codeDisabled"
            @click="getVerificationCode"
          >
            {{ codeBtnText }}
          </button>
        </view>
      </view>
      <view class="form-item">
        <text class="label">密码</text>
        <input 
          class="input" 
          type="password" 
          v-model="registerForm.password" 
          placeholder="请设置6-20位密码"
        />
      </view>
      <view class="form-item">
        <text class="label">确认密码</text>
        <input 
          class="input" 
          type="password" 
          v-model="registerForm.confirmPassword" 
          placeholder="请再次输入密码"
        />
      </view>
      <button class="submit-btn" @click="handleRegister">注册</button>
      
      <view class="agreement">
        <checkbox-group @change="handleAgreementChange">
          <checkbox :checked="agreementChecked" color="#07C160"/> 
          我已阅读并同意<text class="link" @click="navigateToAgreement">《用户协议》</text>和<text class="link" @click="navigateToPrivacy">《隐私政策》</text>
        </checkbox-group>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from "vue"
import { onLoad } from '@dcloudio/uni-app'
import { getUserInfo, login, modifyUserInfo, getSignRecord } from "../../api/api"

const activeTab = ref('login') // 当前激活的标签页
const codeDisabled = ref(false) // 验证码按钮禁用状态
const codeBtnText = ref('获取验证码') // 验证码按钮文本
const agreementChecked = ref(false) // 是否同意协议
const countdown = ref(60) // 倒计时

// 登录表单数据
const loginForm = reactive({
  phone: '',
  password: ''
})

// 注册表单数据
const registerForm = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab
}

// 获取验证码
const getVerificationCode = () => {
  if (!registerForm.phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    })
    return
  }
  
  // 这里调用获取验证码的API
  // ...
  
  // 开始倒计时
  codeDisabled.value = true
  const timer = setInterval(() => {
    countdown.value--
    codeBtnText.value = `${countdown.value}秒后重新获取`
    
    if (countdown.value <= 0) {
      clearInterval(timer)
      codeDisabled.value = false
      codeBtnText.value = '获取验证码'
      countdown.value = 60
    }
  }, 1000)
  
  uni.showToast({
    title: '验证码已发送',
    icon: 'none'
  })
}

// 处理登录
const handleLogin = () => {
  if (!loginForm.phone || !loginForm.password) {
    uni.showToast({
      title: '请输入手机号和密码',
      icon: 'none'
    })
    return
  }
  
  // 调用登录API
  // ...
  
  uni.showLoading({
    title: '登录中...'
  })
  
  // 模拟登录成功
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    // 跳转到首页
    uni.switchTab({
      url: '/pages/index/index'
    })
  }, 1500)
}

// 处理注册
const handleRegister = () => {
  if (!registerForm.phone || !registerForm.code || !registerForm.password || !registerForm.confirmPassword) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    })
    return
  }
  
  if (registerForm.password !== registerForm.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return
  }
  
  if (!agreementChecked.value) {
    uni.showToast({
      title: '请先阅读并同意用户协议和隐私政策',
      icon: 'none'
    })
    return
  }
  
  // 调用注册API
  // ...
  
  uni.showLoading({
    title: '注册中...'
  })
  
  // 模拟注册成功
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    })
    // 自动切换到登录页
    activeTab.value = 'login'
    // 清空表单
    Object.assign(registerForm, {
      phone: '',
      code: '',
      password: '',
      confirmPassword: ''
    })
  }, 1500)
}

// 微信获取手机号
const onGetPhoneNumber = (e) => {
  console.log('获取手机号:', e)
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    // 这里处理获取到的微信手机号
    // 调用微信登录API
    uni.login({
      success: async (data) => {
        console.log("微信登录 code:", data.code);
        try {
          const { token } = await login(data.code);
          uni.setStorageSync('token', token);
          console.log("登录成功，获取到 token:", token);

          // 获取用户信息
          const res = await getUserInfo();
          uni.setStorageSync('userInfo', JSON.stringify(res));
          
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          })
          
          // 跳转到首页
          uni.switchTab({
            url: '/pages/index/index'
          })
        } catch (error) {
          console.error("登录或获取用户信息失败:", error);
          uni.showToast({
            title: '登录失败，请稍后重试',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        console.error("微信登录失败:", err);
        uni.showToast({
          title: '微信登录失败',
          icon: 'none',
        });
      },
    });
  } else {
    uni.showToast({
      title: '获取手机号失败',
      icon: 'none'
    })
  }
}

// 协议勾选
const handleAgreementChange = (e) => {
  agreementChecked.value = e.detail.value.length > 0
}

// 跳转到忘记密码页面
const navigateToForgotPassword = () => {
  uni.navigateTo({
    url: '/pages/forgot-password/forgot-password'
  })
}

// 跳转到用户协议
const navigateToAgreement = () => {
  uni.navigateTo({
    url: '/pages/agreement/agreement?type=user'
  })
}

// 跳转到隐私政策
const navigateToPrivacy = () => {
  uni.navigateTo({
    url: '/pages/agreement/agreement?type=privacy'
  })
}
</script>

<style>
.container {
  padding: 40rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* 切换标签样式 */
.switch-tabs {
  display: flex;
  margin-bottom: 60rpx;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 32rpx;
  color: #666;
  position: relative;
}

.tab.active {
  color: #07C160;
  font-weight: bold;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 6rpx;
  background-color: #07C160;
  border-radius: 3rpx;
}

/* 表单样式 */
.form-container {
  background-color: #fff;
  padding: 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 40rpx;
}

.label {
  display: block;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  color: #333;
}

.input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.code-input {
  display: flex;
  align-items: center;
}

.code-input .input {
  flex: 1;
  margin-right: 20rpx;
}

.code-btn {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  background-color: #07C160;
  color: #fff;
  border-radius: 8rpx;
}

.code-btn[disabled] {
  background-color: #ccc;
}

.forgot-password {
  text-align: right;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #07C160;
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  margin-top: 20rpx;
}

/* 微信登录部分 */
.wechat-login {
  margin-top: 60rpx;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.divider .line {
  flex: 1;
  height: 1px;
  background-color: #eee;
}

.divider .text {
  padding: 0 20rpx;
  font-size: 26rpx;
  color: #999;
}

.wechat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 88rpx;
  background-color: #fff;
  color: #07C160;
  font-size: 32rpx;
  border: 1px solid #07C160;
  border-radius: 44rpx;
}

.wechat-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
}

/* 协议部分 */
.agreement {
  margin-top: 40rpx;
  font-size: 24rpx;
  color: #999;
  display: flex;
  align-items: center;
}

.agreement checkbox {
  transform: scale(0.8);
}

.link {
  color: #07C160;
}
</style>