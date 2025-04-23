"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
if (!Array) {
  const _easycom_up_toast2 = common_vendor.resolveComponent("up-toast");
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  const _easycom_up_input2 = common_vendor.resolveComponent("up-input");
  const _easycom_up_code2 = common_vendor.resolveComponent("up-code");
  (_easycom_up_toast2 + _easycom_up_icon2 + _easycom_up_input2 + _easycom_up_code2)();
}
const _easycom_up_toast = () => "../../uni_modules/uview-plus/components/u-toast/u-toast.js";
const _easycom_up_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_up_input = () => "../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_up_code = () => "../../uni_modules/uview-plus/components/u-code/u-code.js";
if (!Math) {
  (_easycom_up_toast + _easycom_up_icon + _easycom_up_input + _easycom_up_code)();
}
const _sfc_main = {
  __name: "veri",
  setup(__props) {
    const email = common_vendor.ref("");
    common_vendor.ref("");
    const vcode = common_vendor.ref("");
    const tips = common_vendor.ref("");
    const seconds = common_vendor.ref(10);
    const uCodeRef = common_vendor.ref(null);
    const codeChange = (text) => {
      tips.value = text;
    };
    const getCode = async () => {
      var _a;
      if ((_a = uCodeRef.value) == null ? void 0 : _a.canGetCode) {
        const data = {
          email: email.value,
          type: 4
        };
        const emailRegex = /^[a-zA-Z0-9._%+-]+@buaa\.edu\.cn$/;
        if (!emailRegex.test(email.value)) {
          common_vendor.index.showToast({
            title: "请输入有效的北航邮箱",
            icon: "none",
            duration: 3e3,
            // 显示时间（毫秒）
            position: "bottom"
            // 提示框位置，可选值：top/center/bottom
          });
          email.value = "";
        } else {
          await api_api.sendVerifyCode(data);
          common_vendor.index.showLoading({
            title: "正在获取验证码"
          });
          setTimeout(() => {
            var _a2;
            common_vendor.index.hideLoading();
            (_a2 = uCodeRef.value) == null ? void 0 : _a2.start();
          }, 2e3);
        }
      } else {
        common_vendor.index.$u.toast("倒计时结束后再发送");
      }
    };
    const end = () => {
      common_vendor.index.$u.toast("现在可重新发送");
    };
    const start = () => {
      common_vendor.index.$u.toast("验证码已发送");
    };
    const bhyanzheng = async () => {
      const data = {
        email: email.value,
        verifyCode: vcode.value
      };
      const vcodeRegex = /^\d{6}$/;
      if (!vcodeRegex.test(vcode.value)) {
        common_vendor.index.showToast({
          title: "验证码必须为6位数字",
          icon: "none",
          duration: 3e3,
          // 显示时间（毫秒）
          position: "bottom"
          // 提示框位置，可选值：top/center/bottom
        });
        vcode.value = "";
      } else {
        const res = await api_api.yanzheng(data);
        if (res.code == 1) {
          common_vendor.index.navigateTo({
            url: "/pages/course/course"
          });
        } else {
          common_vendor.index.showToast({
            title: "验证码错误",
            icon: "none",
            duration: 3e3,
            // 显示时间（毫秒）
            position: "bottom"
            // 提示框位置，可选值：top/center/bottom
          });
          vcode.value = "";
        }
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr("uToastRef", "08418ad3-0"),
        b: common_vendor.p({
          name: "email",
          color: "#7d7d7d",
          size: "20"
        }),
        c: common_vendor.o(($event) => email.value = $event),
        d: common_vendor.p({
          placeholder: "请输入邮箱",
          border: "none",
          ["placeholder-class"]: "input-placeholder",
          modelValue: email.value
        }),
        e: common_vendor.t(tips.value),
        f: common_vendor.o(getCode),
        g: common_vendor.p({
          name: "lock",
          color: "#7d7d7d",
          size: "20"
        }),
        h: common_vendor.o(($event) => vcode.value = $event),
        i: common_vendor.p({
          placeholder: "请填写验证码",
          border: "none",
          ["placeholder-class"]: "input-placeholder",
          modelValue: vcode.value
        }),
        j: common_vendor.o(bhyanzheng),
        k: common_vendor.sr(uCodeRef, "08418ad3-5", {
          "k": "uCodeRef"
        }),
        l: common_vendor.o(end),
        m: common_vendor.o(start),
        n: common_vendor.o(codeChange),
        o: common_vendor.p({
          seconds: seconds.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-08418ad3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/veri/veri.js.map
