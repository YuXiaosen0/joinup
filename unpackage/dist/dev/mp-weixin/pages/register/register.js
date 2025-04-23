"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const activeTab = common_vendor.ref("login");
    const codeDisabled = common_vendor.ref(false);
    const codeBtnText = common_vendor.ref("获取验证码");
    const agreementChecked = common_vendor.ref(false);
    const countdown = common_vendor.ref(60);
    const loginForm = common_vendor.reactive({
      phone: "",
      password: ""
    });
    const registerForm = common_vendor.reactive({
      phone: "",
      code: "",
      password: "",
      confirmPassword: ""
    });
    const switchTab = (tab) => {
      activeTab.value = tab;
    };
    const getVerificationCode = () => {
      if (!registerForm.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
        common_vendor.index.showToast({
          title: "手机号格式不正确",
          icon: "none"
        });
        return;
      }
      codeDisabled.value = true;
      const timer = setInterval(() => {
        countdown.value--;
        codeBtnText.value = `${countdown.value}秒后重新获取`;
        if (countdown.value <= 0) {
          clearInterval(timer);
          codeDisabled.value = false;
          codeBtnText.value = "获取验证码";
          countdown.value = 60;
        }
      }, 1e3);
      common_vendor.index.showToast({
        title: "验证码已发送",
        icon: "none"
      });
    };
    const handleLogin = () => {
      if (!loginForm.phone || !loginForm.password) {
        common_vendor.index.showToast({
          title: "请输入手机号和密码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      }, 1500);
    };
    const handleRegister = () => {
      if (!registerForm.phone || !registerForm.code || !registerForm.password || !registerForm.confirmPassword) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
        common_vendor.index.showToast({
          title: "手机号格式不正确",
          icon: "none"
        });
        return;
      }
      if (registerForm.password !== registerForm.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      if (!agreementChecked.value) {
        common_vendor.index.showToast({
          title: "请先阅读并同意用户协议和隐私政策",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "注册中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "注册成功",
          icon: "success"
        });
        activeTab.value = "login";
        Object.assign(registerForm, {
          phone: "",
          code: "",
          password: "",
          confirmPassword: ""
        });
      }, 1500);
    };
    const onGetPhoneNumber = (e) => {
      common_vendor.index.__f__("log", "at pages/register/register.vue:284", "获取手机号:", e);
      if (e.detail.errMsg === "getPhoneNumber:ok") {
        common_vendor.index.login({
          success: async (data) => {
            common_vendor.index.__f__("log", "at pages/register/register.vue:290", "微信登录 code:", data.code);
            try {
              const { token } = await api_api.login(data.code);
              common_vendor.index.setStorageSync("token", token);
              common_vendor.index.__f__("log", "at pages/register/register.vue:294", "登录成功，获取到 token:", token);
              const res = await api_api.getUserInfo();
              common_vendor.index.setStorageSync("userInfo", JSON.stringify(res));
              common_vendor.index.showToast({
                title: "登录成功",
                icon: "success"
              });
              common_vendor.index.switchTab({
                url: "/pages/index/index"
              });
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/register/register.vue:310", "登录或获取用户信息失败:", error);
              common_vendor.index.showToast({
                title: "登录失败，请稍后重试",
                icon: "none"
              });
            }
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/register/register.vue:318", "微信登录失败:", err);
            common_vendor.index.showToast({
              title: "微信登录失败",
              icon: "none"
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "获取手机号失败",
          icon: "none"
        });
      }
    };
    const handleAgreementChange = (e) => {
      agreementChecked.value = e.detail.value.length > 0;
    };
    const navigateToForgotPassword = () => {
      common_vendor.index.navigateTo({
        url: "/pages/forgot-password/forgot-password"
      });
    };
    const navigateToAgreement = () => {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/agreement?type=user"
      });
    };
    const navigateToPrivacy = () => {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/agreement?type=privacy"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(activeTab.value === "login" ? "active" : ""),
        b: common_vendor.o(($event) => switchTab("login")),
        c: common_vendor.n(activeTab.value === "register" ? "active" : ""),
        d: common_vendor.o(($event) => switchTab("register")),
        e: activeTab.value === "login"
      }, activeTab.value === "login" ? {
        f: loginForm.phone,
        g: common_vendor.o(($event) => loginForm.phone = $event.detail.value),
        h: loginForm.password,
        i: common_vendor.o(($event) => loginForm.password = $event.detail.value),
        j: common_vendor.o(navigateToForgotPassword),
        k: common_vendor.o(handleLogin),
        l: common_assets._imports_0$1,
        m: common_vendor.o(onGetPhoneNumber)
      } : {
        n: registerForm.phone,
        o: common_vendor.o(($event) => registerForm.phone = $event.detail.value),
        p: registerForm.code,
        q: common_vendor.o(($event) => registerForm.code = $event.detail.value),
        r: common_vendor.t(codeBtnText.value),
        s: codeDisabled.value,
        t: common_vendor.o(getVerificationCode),
        v: registerForm.password,
        w: common_vendor.o(($event) => registerForm.password = $event.detail.value),
        x: registerForm.confirmPassword,
        y: common_vendor.o(($event) => registerForm.confirmPassword = $event.detail.value),
        z: common_vendor.o(handleRegister),
        A: agreementChecked.value,
        B: common_vendor.o(navigateToAgreement),
        C: common_vendor.o(navigateToPrivacy),
        D: common_vendor.o(handleAgreementChange)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
