<template>
	
	<view class="content">
		<view class="topBox">
			<!-- 设置区块 -->
			<view class="setbox">
				<view class="set-left">
					<!-- 日历图标 -->
					<uni-icons type="calendar" size="30" color="#fff"></uni-icons>
					<view class="txt">签到</view>
				</view>
				<view class="set-right">
					<!-- 设置图标 和 聊天图标 -->
					<uni-icons type="gear" size="30" color="#fff"></uni-icons>
				</view>
			</view>
			<!-- 用户信息展示 -->
			<view class="users" @click="setFun">
				<view class="u-top">
					<!-- 用户未登录时显示默认头像和"注册/登录" -->
					<template v-if="!userInfo.nickName">
						<image
							src="../../static/tt.jpg"
							mode="aspectFill"
						>
						</image>
						<view class="tit">
							注册 / 登录
						</view>
					</template>
					<!-- 用户已登录时显示用户头像和昵称 -->
					<template v-else>
						<image
							:src="userInfo.avatarUrl"
							mode="aspectFill"
						>
						</image>
						<view class="tit">
							{{ userInfo.nickName }}
						</view>
					</template>
				</view>
				<view class="u-bottom">
				    <!-- 展示用户的一些统计数据：点赞、喜欢、浏览、收藏 -->
				    <view class="u-item">
				        <view class="num">12</view>
				        <view class="u-tit">点赞</view>
				    </view>
				    <view class="u-item">
				        <view class="num">12</view>
				        <view class="u-tit">喜欢</view>
				    </view>
				    <view class="u-item">
				        <view class="num">12</view>
				        <view class="u-tit">浏览</view>
				    </view>
				    <view class="u-item">
				        <view class="num">12</view>
				        <view class="u-tit">收藏</view>
				    </view>
				</view>
			</view>
		</view>
		<!-- 功能项列表 -->
		<view class="listBox">
		    <view class="lists">
		        <u-cell-group>
		            <!-- 列出多个功能项，点击时跳转到相应页面 -->

		            <u-cell  title="课程打卡" is-link 
								:url="userInfo.studentId ? '/pages/course/course' : '/pages/veri/veri'"></u-cell>
		            <u-cell  title="博雅打卡" is-link url="/pages/componentsB/tag/tag"></u-cell>
		        </u-cell-group>
		    </view>
		</view>
		<!-- 弹出层，用于获取昵称和头像 -->
		<!-- @close: 这个事件监听器用于处理弹出层关闭时的事件。
		:show: 这个属性用于控制弹出层的显示状态。 -->
		<up-popup closeable @close="close" :show="show" round="20">
		    <view class="popup">
		        <view class="title">获取您的昵称、头像</view>
		        <view class="flex">
		            <view class="label">获取用户头像：</view>
		            <!-- 用户选择头像 -->
					<!-- open-type="chooseAvatar" - 指定按钮类型为选择头像
					@chooseavatar="onChooseavatar" - 当用户选择完头像后触发的事件处理函数
					<image> 标签用于显示当前头像 -->
		            <button class="avatar-warpper" open-type="chooseAvatar" @chooseavatar="onChooseavatar">
		                <image class="avatar" :src="userInfo.avatarUrl"></image>
		            </button>
		        </view>
				<!-- 微信小程序会读取当前已授权的用户信息，并将其提供给相关字段进行自动填充。 -->
		        <view class="flex">
		            <view class="label">获取用户昵称：</view>
		            <!-- 输入昵称 -->
		            <input @input="changeName" type="nickname">
		        </view>
		        <!-- 提交按钮 -->
		        <button size="default" type="primary" @click="userSubmit">确定</button>
		    </view>
		</up-popup>
	</view>
</template>

<script setup>
	import {reactive,ref} from "vue"
	import {onLoad} from '@dcloudio/uni-app'
	import { getUserInfo, login,modifyUserInfo } from "../../api/api"
	const userInfo = reactive({
	    nickName: '',
	    avatarUrl: '',
		studentId: '',
		gender:''
	})
	// 控制弹出层的显示
	const show = ref(false)
	
	// 关闭弹出层
	const close = () => {
	    show.value = false
	}
	
	// 提交用户信息，保存到本地存储
	const userSubmit = async() => {
		// 同步地将数据存储到本地存储（Local Storage）中,'userInfo'为键，后者为值
	    uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		const res = await modifyUserInfo(userInfo)
		console.log("modifyUserInfo",res)
	    show.value = false
	}
	
	// 选择头像时更新头像
	const onChooseavatar = (e) => {
	    userInfo.avatarUrl = e.detail.avatarUrl
	}
	
	// 输入昵称时更新昵称
	const changeName = (e) => {
	    userInfo.nickName = e.detail.value
	}
	// 页面加载时获取用户信息
	onLoad(async () => {
		// 免登逻辑：如果有token且没有缓存用户信息，则请求用户信息
		if(uni.getStorageSync('token') && !uni.getStorageSync('userInfo')) {
			const { avatarUrl, nickName } = await getUserInfo()
			userInfo.avatarUrl = avatarUrl
			userInfo.nickName = nickName
		} else if(uni.getStorageSync('token') && uni.getStorageSync('userInfo')) {
			const { avatarUrl, nickName } = JSON.parse(uni.getStorageSync('userInfo'))
			userInfo.avatarUrl = avatarUrl
			userInfo.nickName = nickName
		}
	})
	// 设置用户信息的方法
	const setFun = () => {
	    // 给用户一个确认的提醒
	    uni.showModal({
	        title: '温馨提升',
	        content: '亲，授权微信登录后才能正常使用小程序',
	        success(res) {
	            if (res.confirm) {
	                // 微信登录
	                uni.login({
	                    success: async (data) => {
	                        show.value = true
	                        const { token } = await login(data.code)
	                        uni.setStorageSync('token', token)
							// userStore.setToken(token)
	                        // 根据token获取用户信息并显示到页面上
	                        const res = await getUserInfo()
							
	                        userInfo.avatarUrl = res.avatar
	                        userInfo.nickName = res.username
							userInfo.studentId=res.studentId
							userInfo.gender=res.gender
							console.log("userInfo",userInfo)
	                    }
	                })
	            }
	        }
	    })
	}
</script>

<style lang="scss" scoped>
.content {
    height: 100vh;
    background-color: #f5f5f5;
    .topBox {
        width: 100%;
        position: relative;
        z-index: 1;
        overflow: hidden;
        padding: 40rpx 20rpx 40rpx;
        box-sizing: border-box;
    }
    .topBox::after {
        content: "";
        width: 140%;
        height: 200px;
        position: absolute;
        z-index: -1;
        top: 0;
        left: -20%;
        background-color: #00aaff;
        border-radius: 0 0 50% 50%;
    }
    .setbox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .set-left {
            width: 18%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .txt {
            color: #fff;
            font-size: 30rpx;
        }
    }
    .users {
        margin-top: 35rpx;
        padding: 30rpx;
        box-sizing: border-box;
        height: 280rpx;
        background-color: #fff;
        box-shadow: 1px 10rpx 20rpx #ececec;
        border-radius: 16rpx;
        .u-top {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 30rpx;
            image {
                width: 100rpx;
                height: 100rpx;
                border-radius: 50%;
                margin-right: 20rpx;
            }
            .tit {
                font-size: 30rpx;
                font-weight: 700;
                color: #333;
            }
        }
        .u-bottom {
            display: flex;
            justify-content: space-around;
            align-items: center;
            .u-item {
                text-align: center;
                .u-tit {
                    color: #757575;
                    font-size: 26rpx;
                    margin-top: 10rpx;
                }
                .num {
                    color: #000;
                    font-size: 33rpx;
                    font-weight: 700;
                }
            }
        }
    }
    .popup {
        padding: 20rpx;
        border-radius: 20rpx 20rpx 0 0;
        .title {
            margin-bottom: 20rpx;
            font-size: 40rpx;
            text-align: center;
        }
        .flex {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-bottom: 1px solid #f5f5f5;
            padding: 24rpx 0;
        }
        image {
            width: 70rpx;
            height: 70rpx;
        }
        .avatar-warpper {
            border: none;
            border-radius: 10rpx;
            width: 70rpx;
            height: 70rpx;
            margin-left: 20rpx;
            padding: 0;
        }
    }
    .listBox {
        height: 200rpx;
        margin: -10rpx auto 0;
        padding: 20rpx;
        box-sizing: border-box;
        border-radius: 12rpx;
    }
}

</style>
