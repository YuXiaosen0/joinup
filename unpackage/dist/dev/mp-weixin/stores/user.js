"use strict";
const common_vendor = require("../common/vendor.js");
common_vendor.defineStore(
  "user",
  () => {
    const token = common_vendor.ref("");
    const setToken = (newToken) => {
      token.value = newToken;
    };
    const removeToken = () => {
      token.value = "";
    };
    return {
      token,
      setToken,
      removeToken
    };
  },
  {
    persist: true
  }
);
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/user.js.map
