let baseUrl = 'https://joinup.org.cn/api-dev'
// let baseUrl = 'https://joinup.org.cn/api'
import { useUserStore } from '../stores/user.js'
// 给参数 data 设置了一个默认值，即一个空对象 {}
export default function http(url1, data = {}, method) {
  
  return new Promise((resolve, reject) => {
    uni.request({
      url:baseUrl + url1,
      data,
      method:method,
      header:{
        'Content-Type': 'application/json',
        'Authorization':   uni.getStorageSync('token') || ''
      },
      
      success: res => {
        if (res.statusCode == 200||res.statusCode == 201) {
          if(data=='r'||url1=="/user/verify"||url1=="/course/task/add"){
			if (res.data.code == 1) {
              resolve(res.data)
            } else if (res.data.code == 0) {
              uni.showToast({
                title:res.data.msg,
                icon:'none'
              })
              reject(res.data.msg)
            }
//             resolve(res.data)
          }else{
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
        }
      },
      
      fail: (err) => {
        console.log("请求失败:", err);
        uni.showToast({
          title: '服务器请求错误',
          icon: 'none'
        });
        reject(err);
      }
    })
  })
}

