"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
if (!Array) {
  const _easycom_up_input2 = common_vendor.resolveComponent("up-input");
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  (_easycom_up_input2 + _easycom_up_button2)();
}
const _easycom_up_input = () => "../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_up_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_up_input + _easycom_up_button)();
}
const _sfc_main = {
  __name: "course",
  setup(__props) {
    const email = common_vendor.ref("");
    const type = common_vendor.ref("");
    const vcode = common_vendor.ref("");
    const send = async () => {
      const data = {
        email: email.value,
        type: 1
      };
      await api_api.sendVerifyCode(data);
    };
    const bhyanzheng = async () => {
      const data = {
        email: email.value,
        verifyCode: vcode.value
      };
      await api_api.yanzheng(data);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => email.value = $event),
        b: common_vendor.p({
          placeholder: "请输入邮箱",
          border: "surround",
          modelValue: email.value
        }),
        c: common_vendor.o(($event) => type.value = $event),
        d: common_vendor.p({
          placeholder: "请输入类型",
          border: "surround",
          modelValue: type.value
        }),
        e: common_vendor.o(send),
        f: common_vendor.p({
          type: "primary",
          text: "发送验证码"
        }),
        g: common_vendor.o(($event) => vcode.value = $event),
        h: common_vendor.p({
          placeholder: "请填写验证码",
          border: "surround",
          modelValue: vcode.value
        }),
        i: common_vendor.o(bhyanzheng),
        j: common_vendor.p({
          type: "primary",
          text: "北航身份验证"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/course/course.js.map
