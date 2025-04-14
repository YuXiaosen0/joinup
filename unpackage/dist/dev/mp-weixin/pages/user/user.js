"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_u_cell2 = common_vendor.resolveComponent("u-cell");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  const _easycom_up_popup2 = common_vendor.resolveComponent("up-popup");
  (_easycom_uni_icons2 + _easycom_u_cell2 + _easycom_u_cell_group2 + _easycom_up_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_u_cell = () => "../../uni_modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_u_cell_group = () => "../../uni_modules/uview-plus/components/u-cell-group/u-cell-group.js";
const _easycom_up_popup = () => "../../uni_modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_u_cell + _easycom_u_cell_group + _easycom_up_popup)();
}
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const userInfo = common_vendor.reactive({
      nickName: "",
      avatarUrl: "",
      studentId: "",
      gender: ""
    });
    const show = common_vendor.ref(false);
    const close = () => {
      show.value = false;
    };
    const userSubmit = async () => {
      common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
      const res = await api_api.modifyUserInfo(userInfo);
      common_vendor.index.__f__("log", "at pages/user/user.vue:128", "modifyUserInfo", res);
      show.value = false;
    };
    const onChooseavatar = (e) => {
      userInfo.avatarUrl = e.detail.avatarUrl;
    };
    const changeName = (e) => {
      userInfo.nickName = e.detail.value;
    };
    common_vendor.onLoad(async () => {
      if (common_vendor.index.getStorageSync("token") && !common_vendor.index.getStorageSync("userInfo")) {
        const { avatarUrl, nickName } = await api_api.getUserInfo();
        userInfo.avatarUrl = avatarUrl;
        userInfo.nickName = nickName;
      } else if (common_vendor.index.getStorageSync("token") && common_vendor.index.getStorageSync("userInfo")) {
        const { avatarUrl, nickName } = JSON.parse(common_vendor.index.getStorageSync("userInfo"));
        userInfo.avatarUrl = avatarUrl;
        userInfo.nickName = nickName;
      }
    });
    const setFun = () => {
      common_vendor.index.showModal({
        title: "温馨提升",
        content: "亲，授权微信登录后才能正常使用小程序",
        success(res) {
          if (res.confirm) {
            common_vendor.index.login({
              success: async (data) => {
                show.value = true;
                const { token } = await api_api.login(data.code);
                common_vendor.index.setStorageSync("token", token);
                const res2 = await api_api.getUserInfo();
                userInfo.avatarUrl = res2.avatar;
                userInfo.nickName = res2.username;
                userInfo.studentId = res2.studentId;
                userInfo.gender = res2.gender;
                common_vendor.index.__f__("log", "at pages/user/user.vue:176", "userInfo", userInfo);
              }
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "calendar",
          size: "30",
          color: "#fff"
        }),
        b: common_vendor.p({
          type: "gear",
          size: "30",
          color: "#fff"
        }),
        c: !userInfo.nickName
      }, !userInfo.nickName ? {
        d: common_assets._imports_0
      } : {
        e: userInfo.avatarUrl,
        f: common_vendor.t(userInfo.nickName)
      }, {
        g: common_vendor.o(setFun),
        h: common_vendor.p({
          title: "课程打卡",
          ["is-link"]: true,
          url: userInfo.studentId ? "/pages/course/course" : "/pages/veri/veri"
        }),
        i: common_vendor.p({
          title: "博雅打卡",
          ["is-link"]: true,
          url: "/pages/componentsB/tag/tag"
        }),
        j: userInfo.avatarUrl,
        k: common_vendor.o(onChooseavatar),
        l: common_vendor.o(changeName),
        m: common_vendor.o(userSubmit),
        n: common_vendor.o(close),
        o: common_vendor.p({
          closeable: true,
          show: show.value,
          round: "20"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
