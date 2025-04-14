"use strict";
const common_vendor = require("../common/vendor.js");
require("../stores/user.js");
let baseUrl = "http://123.56.43.103:8088";
function http(url1, data = {}, method) {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: baseUrl + url1,
      data,
      method,
      header: {
        "Content-Type": "application/json",
        "Authorization": common_vendor.index.getStorageSync("token") || ""
      },
      success: (res) => {
        common_vendor.index.__f__("log", "at api/http.js:17", "httpre11s", url1);
        if (res.statusCode == 200) {
          if (data == "r" || url1 == "/user/verify" || url1 == "/course/task/add") {
            resolve(res.data);
            common_vendor.index.__f__("log", "at api/http.js:21", "httpasd");
          } else {
            if (res.data.code == 1) {
              resolve(res.data.data);
            } else if (res.data.code == 0) {
              common_vendor.index.showToast({
                title: res.data.msg,
                icon: "none"
              });
              reject(res.data.msg);
            }
          }
        }
      },
      fail: () => {
        common_vendor.index.__f__("log", "at api/http.js:38", "httpfail");
        common_vendor.index.showToast({
          title: "服务器请求错误",
          icon: "none"
        });
      }
    });
  });
}
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/http.js.map
