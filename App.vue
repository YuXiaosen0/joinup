<script>
import { useWebSocket } from '@/utils/useWebSocket.js'
import { getUserInfo, login, modifyUserInfo, getSignRecord, feedback, uploadFile } from "@/api/api"
export default {
  onLaunch: function() {
    uni.setEnableDebug({ enableDebug: true });
    console.log('App Launch');

    uni.login({
      success: async (data) => {
        console.log("微信登录 code:", data.code);
        try {
          const { token } = await login(data.code);
          uni.setStorageSync('token', token);
          console.log("登录成功，获取到 token:", token);
          // 获取用户信息
          const res = await getUserInfo();
          uni.setStorageSync('userInfo', res);
          console.log("用户信息:", res);
          // 登录成功后再初始化 WebSocket
          const ws = useWebSocket(token);
          ws.connect();

          // 全局监听消息
          ws.onMessage((event) => {
            console.log('全局收到消息:', event.data);
          });

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
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
  /*每个页面公共css */
</style>