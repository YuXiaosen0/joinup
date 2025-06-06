"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_useWebSocket = require("./utils/useWebSocket.js");
const api_api = require("./api/api.js");
const uni_modules_uviewPlus_index = require("./uni_modules/uview-plus/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/detail/detail.js";
  "./pages/user/user.js";
  "./pages/order/order.js";
  "./pages/course/course.js";
  "./pages/detail/announcement.js";
  "./pages/veri/veri.js";
  "./pages/detail/applicationList.js";
  "./pages/detail/modifyTeam.js";
  "./pages/detail/createTag.js";
  "./pages/technology/technology.js";
  "./pages/detail/searchResult.js";
  "./pages/boya/boya.js";
  "./pages/blank/blank.js";
  "./pages/team/team.js";
  "./pages/contacts/contacts.js";
  "./pages/chat/chat.js";
  "./pages/message/message.js";
  "./pages/detail/browseHistory.js";
  "./pages/searchResults/searchResults.js";
  "./pages/sign/sign.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.setEnableDebug({ enableDebug: false });
    common_vendor.index.__f__("log", "at App.vue:7", "App Launch");
    common_vendor.index.login({
      success: async (data) => {
        common_vendor.index.__f__("log", "at App.vue:11", "微信登录 code:", data.code);
        try {
          const { token } = await api_api.login(data.code);
          common_vendor.index.setStorageSync("token", token);
          common_vendor.index.__f__("log", "at App.vue:15", "登录成功，获取到 token:", token);
          const res = await api_api.getUserInfo();
          common_vendor.index.setStorageSync("userInfo", res);
          common_vendor.index.__f__("log", "at App.vue:19", "用户信息:", res);
          const ws = utils_useWebSocket.useWebSocket(token);
          ws.connect();
          ws.onMessage((event) => {
            common_vendor.index.__f__("log", "at App.vue:26", "全局收到消息:", event.data);
          });
        } catch (error) {
          common_vendor.index.__f__("error", "at App.vue:30", "登录或获取用户信息失败:", error);
          common_vendor.index.showToast({
            title: "登录失败，请稍后重试",
            icon: "none"
          });
        }
      },
      fail: (err) => {
        common_vendor.index.__f__("error", "at App.vue:38", "微信登录失败:", err);
        common_vendor.index.showToast({
          title: "微信登录失败",
          icon: "none"
        });
      }
    });
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:47", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:50", "App Hide");
  }
};
const pinia1 = common_vendor.createPinia();
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(pinia1);
  app.use(uni_modules_uviewPlus_index.uviewPlus);
  const REFRESH_INTERVAL = 10 * 60 * 1e3;
  api_api.updateToken();
  setInterval(() => {
    api_api.updateToken();
  }, REFRESH_INTERVAL);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
