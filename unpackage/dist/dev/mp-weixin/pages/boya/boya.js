"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const _sfc_main = {
  __name: "boya",
  setup(__props) {
    common_vendor.onLoad(async () => {
      const res = await api_api.boyaAuthentication();
      common_vendor.index.__f__("log", "at pages/boya/boya.vue:12", "boyaAuthentication", res);
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/boya/boya.js.map
