"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    common_vendor.onLoad((opt) => {
      JSON.parse(decodeURIComponent(opt.item));
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
