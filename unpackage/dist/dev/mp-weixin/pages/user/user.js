"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_up_popup2 = common_vendor.resolveComponent("up-popup");
  const _easycom_u_cell2 = common_vendor.resolveComponent("u-cell");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  (_easycom_uni_icons2 + _easycom_up_popup2 + _easycom_u_cell2 + _easycom_u_cell_group2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_up_popup = () => "../../uni_modules/uview-plus/components/u-popup/u-popup.js";
const _easycom_u_cell = () => "../../uni_modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_u_cell_group = () => "../../uni_modules/uview-plus/components/u-cell-group/u-cell-group.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_up_popup + _easycom_u_cell + _easycom_u_cell_group)();
}
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const userInfo = common_vendor.ref({
      username: "",
      avatar: "",
      studentId: "",
      gender: "",
      joinedTeamCount: 0,
      createdTeamCount: 0,
      createTime: ""
    });
    const show = common_vendor.ref(false);
    const goToTechnology = () => {
      common_vendor.index.navigateTo({
        url: "/pages/technology/technology"
        // 跳转到 technology 页面
      });
    };
    const formatTime = (time) => {
      if (!time)
        return "--";
      const date = new Date(time);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };
    const getSignList = async () => {
      const res = await api_api.getSignRecord(pageQuery);
      common_vendor.index.__f__("log", "at pages/user/user.vue:217", "res", res);
      signList.value = res.list;
    };
    const close = () => {
      show.value = false;
    };
    const showSignPopup = common_vendor.ref(false);
    const signList = common_vendor.ref([]);
    const pageQuery = common_vendor.reactive({
      pageNo: 1,
      // 页码
      pageSize: 10,
      // 每页条数
      isAsc: true
      // 排序方式（升序/降序）
    });
    const openSign = async () => {
      showSignPopup.value = true;
    };
    const closeSignPopup = () => {
      showSignPopup.value = false;
    };
    common_vendor.onLoad(async () => {
      common_vendor.index.login({
        success: async (data) => {
          common_vendor.index.__f__("log", "at pages/user/user.vue:245", "微信登录 code:", data.code);
          try {
            const { token } = await api_api.login(data.code);
            common_vendor.index.setStorageSync("token", token);
            common_vendor.index.__f__("log", "at pages/user/user.vue:249", "登录成功，获取到 token:", token);
            const res = await api_api.getUserInfo();
            Object.assign(userInfo.value, res);
            common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
            common_vendor.index.__f__("log", "at pages/user/user.vue:257", "用户信息:", userInfo);
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/user/user.vue:259", "登录或获取用户信息失败:", error);
            common_vendor.index.showToast({
              title: "登录失败，请稍后重试",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/user/user.vue:267", "微信登录失败:", err);
          common_vendor.index.showToast({
            title: "微信登录失败",
            icon: "none"
          });
        }
      });
    });
    const userSubmit = async () => {
      const data = {
        "username": userInfo.value.username,
        "avatar": userInfo.value.avatar,
        "gender": userInfo.value.gender
      };
      common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
      const res = await api_api.modifyUserInfo(data);
      common_vendor.index.__f__("log", "at pages/user/user.vue:286", "modifyUserInfo", res);
      show.value = false;
    };
    const onChooseavatar = (e) => {
      userInfo.value.avatar = e.detail.avatarUrl;
    };
    const changeName = (e) => {
      userInfo.value.username = e.detail.value;
      common_vendor.index.__f__("log", "at pages/user/user.vue:298", "userInfo", userInfo);
    };
    const setFun = () => {
      common_vendor.index.showModal({
        title: "温馨提升",
        content: "亲，授权微信登录后才能正常使用小程序",
        success(res) {
          if (res.confirm) {
            show.value = true;
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
        b: common_vendor.o(openSign),
        c: common_vendor.t(pageQuery.pageNo),
        d: common_vendor.p({
          type: "arrowdown",
          size: "14",
          color: "#666"
        }),
        e: pageQuery.pageNo - 1,
        f: [1, 2, 3, 4, 5],
        g: common_vendor.o((e) => pageQuery.pageNo = e.detail.value + 1),
        h: common_vendor.t(pageQuery.pageSize),
        i: common_vendor.p({
          type: "arrowdown",
          size: "14",
          color: "#666"
        }),
        j: common_vendor.o((e) => pageQuery.pageSize = e.detail.value + 1),
        k: [5, 10, 15, 20],
        l: pageQuery.pageSize / 5 - 1,
        m: common_vendor.t(pageQuery.isAsc === "true" ? "升序" : "降序"),
        n: common_vendor.p({
          type: "arrowdown",
          size: "14",
          color: "#666"
        }),
        o: common_vendor.o((e) => pageQuery.isAsc = e.detail.value),
        p: ["升序", "降序"],
        q: pageQuery.isAsc === "true" ? 0 : 1,
        r: common_vendor.o(getSignList),
        s: signList.value.length > 0
      }, signList.value.length > 0 ? {
        t: common_vendor.f(signList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.courseId),
            b: common_vendor.t(item.success ? "签到成功" : "签到失败"),
            c: common_vendor.n(item.success ? "success" : "fail"),
            d: "0f7520f0-5-" + i0 + ",0f7520f0-1",
            e: common_vendor.t(formatTime(item.createTime)),
            f: index
          };
        }),
        v: common_vendor.p({
          type: "calendar",
          size: "14",
          color: "#999"
        })
      } : {}, {
        w: common_vendor.o(closeSignPopup),
        x: common_vendor.p({
          closeable: true,
          show: showSignPopup.value,
          round: "20"
        }),
        y: common_vendor.p({
          type: "gear",
          size: "30",
          color: "#fff"
        }),
        z: !userInfo.value.username
      }, !userInfo.value.username ? {} : {
        A: userInfo.value.avatar,
        B: common_vendor.t(userInfo.value.username)
      }, {
        C: common_vendor.o(setFun),
        D: common_vendor.p({
          type: "arrowright",
          size: "30",
          color: "#999"
        }),
        E: common_vendor.o(goToTechnology),
        F: common_vendor.t(userInfo.value.joinedTeamCount),
        G: common_vendor.t(userInfo.value.createdTeamCount),
        H: common_vendor.p({
          title: "课程打卡",
          ["is-link"]: true,
          url: userInfo.value.studentId ? "/pages/course/course" : "/pages/veri/veri"
        }),
        I: common_vendor.p({
          title: "博雅打卡",
          ["is-link"]: true,
          url: "/pages/boya/boya"
        }),
        J: common_vendor.p({
          title: "反馈问题",
          ["is-link"]: true,
          url: "/pages/boya/boya"
        }),
        K: userInfo.value.avatar,
        L: common_vendor.o(onChooseavatar),
        M: common_vendor.o(changeName),
        N: common_vendor.o(userSubmit),
        O: common_vendor.o(close),
        P: common_vendor.p({
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
