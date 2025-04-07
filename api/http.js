let baseUrl = 'http://123.56.43.103:8088'
import { useUserStore } from '../stores/user.js'
// 给参数 data 设置了一个默认值，即一个空对象 {}
export default function http(url, data = {}, method) {
	
	return new Promise((resolve, reject) => {
		uni.request({
			url:baseUrl + url,
			data,
			method:method,
			header:{
				'Content-Type': 'application/json',
				'Authorization':   uni.getStorageSync('token') || ''
				// 'Authorization':   useUserStore().token
				// 'token':   uni.getStorageSync('token') || ''
			},
			
			success: res => {
				console.log("httpres",res)
				if (res.statusCode == 200) {
					if (res.data.code == 1) {
						resolve(res.data.data)
					} else if (res.data.code == 0) {
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
						reject(res.data.msg)
					}
				}
			},
			
			fail: () => {
				console.log("httpfail")
				uni.showToast({
					title:'服务器请求错误',
					icon:'none'
				})
			}
		})
	})
}