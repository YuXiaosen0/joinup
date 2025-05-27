"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_uviewPlus_index = require("./uni_modules/uview-plus/index.js");
const api_api = require("./api/api.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/detail/detail.js";
  "./pages/user/user.js";
  "./pages/order/order.js";
  "./pages/course/course.js";
  "./pages/detail/announcement.js";
  "./pages/veri/veri.js";
  "./pages/detail/applicationList.js";
  "./pages/technology/technology.js";
  "./pages/detail/searchResult.js";
  "./pages/boya/boya.js";
  "./pages/blank/blank.js";
  "./pages/team/team.js";
  "./pages/sign/sign.js";
  "./pages/message/message.js";
  "./pages/contacts/contacts.js";
  "./pages/chat/chat.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.setEnableDebug({
      enableDebug: false
    });
    common_vendor.index.__f__("log", "at App.vue:7", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:13", "App Hide");
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
