"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_uviewPlus_index = require("./uni_modules/uview-plus/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/detail/detail.js";
  "./pages/user/user.js";
  "./pages/order/order.js";
  "./pages/course/course.js";
<<<<<<< HEAD
  "./pages/detail/announcement.js";
  "./pages/detail/applicationList.js";
  "./pages/detail/searchResult.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
const pinia = common_vendor.createPinia();
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(pinia);
=======
  "./pages/veri/veri.js";
  "./pages/technology/technology.js";
  "./pages/boya/boya.js";
  "./pages/register/register.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.setEnableDebug({
      enableDebug: true
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
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
  app.use(uni_modules_uviewPlus_index.uviewPlus);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
<<<<<<< HEAD
exports.pinia = pinia;
=======
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
