<template>
	<view>
	  <up-input
	      placeholder="请输入邮箱"
	      border="surround"
	      v-model="email"
	    ></up-input>
		<up-input
		    placeholder="请输入类型"
		    border="surround"
		    v-model="type"
		  ></up-input>
		  <up-button type="primary" text="发送验证码" @click="send"> </up-button>
		  <up-input
		      placeholder="请填写验证码"
		      border="surround"
		      v-model="vcode"
		    ></up-input>
			<up-button type="primary" text="北航身份验证" @click="bhyanzheng"> </up-button>
	</view>
</template>

<script setup>
	import {reactive,ref} from "vue"
	import {onLoad} from '@dcloudio/uni-app'
	import {  sendVerifyCode,yanzheng} from "../../api/api"
	const email = ref('')
	const type = ref('')
	const vcode = ref('')
	const send = async() => {
		const data={
			email: email.value,
			type: 1
		}
		const res=await sendVerifyCode(data)
	};
	const bhyanzheng= async() =>{
		const data={
			email: email.value,
			verifyCode: vcode.value
		}
		const res=await yanzheng(data)
		
	}
</script>

<style>
	       
</style>
