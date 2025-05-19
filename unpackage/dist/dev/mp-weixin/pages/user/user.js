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
      createTime: "",
      ssoPassword: ""
    });
    const genderOptions = ["男", "女"];
    const changeGender = (e) => {
      userInfo.value.gender = genderOptions[e.detail.value];
    };
    const showFeedbackPopup = common_vendor.ref(false);
    const subjectOptions = ["功能建议", "使用问题", "界面优化", "其他"];
    const selectedSubject = common_vendor.ref("");
    const feedbackContent = common_vendor.ref("");
    const contactInfo = common_vendor.ref("");
    common_vendor.ref();
    const chooseFile = async () => {
      try {
        const res = await common_vendor.index.chooseImage({
          count: 1,
          // 只允许选择一个文件
          sizeType: ["compressed"],
          // 压缩图像
          sourceType: ["album", "camera"]
          // 允许从相册或拍照选择
        });
        const filePath = res.tempFilePaths[0];
        common_vendor.index.__f__("log", "at pages/user/user.vue:303", "选择的文件路径:", filePath);
        const uploadRes = await common_vendor.index.uploadFile({
          url: "https://joinup.org.cn/api-dev/oss/file/upload",
          // 替换为实际的上传接口
          filePath,
          // 文件路径
          name: "file",
          // 后端接收文件的字段名
          header: {
            "Authorization": common_vendor.index.getStorageSync("token") || ""
            // 如果需要鉴权，传递 token
          },
          formData: {
            // 如果需要额外的表单数据，可以在这里添加
            userId: "12345"
            // 示例：用户 ID
          }
        });
        if (uploadRes.statusCode === 200) {
          const data = JSON.parse(uploadRes.data);
          common_vendor.index.__f__("log", "at pages/user/user.vue:322", "上传成功:", data);
          userInfo.value.avatar = data.data.url;
          common_vendor.index.showToast({
            title: "上传成功",
            icon: "success"
          });
        } else {
          common_vendor.index.__f__("error", "at pages/user/user.vue:329", "上传失败，状态码:", uploadRes.statusCode);
          common_vendor.index.showToast({
            title: "上传失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/user.vue:336", "文件选择或上传失败:", error);
        common_vendor.index.showToast({
          title: "上传失败",
          icon: "none"
        });
      }
    };
    const openFeedbackPopup = () => {
      showFeedbackPopup.value = true;
    };
    const closeFeedbackPopup = () => {
      showFeedbackPopup.value = false;
    };
    const onSubjectChange = (e) => {
      selectedSubject.value = subjectOptions[e.detail.value];
    };
    const submitFeedback = async () => {
      if (!selectedSubject.value) {
        common_vendor.index.showToast({
          title: "请选择反馈主题",
          icon: "none"
        });
        return;
      }
      if (!feedbackContent.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入反馈内容",
          icon: "none"
        });
        return;
      }
      common_vendor.index.__f__("log", "at pages/user/user.vue:377", "反馈主题:", selectedSubject.value);
      common_vendor.index.__f__("log", "at pages/user/user.vue:378", "反馈内容:", feedbackContent.value);
      common_vendor.index.__f__("log", "at pages/user/user.vue:379", "联系方式:", contactInfo.value);
      const data = {
        "subject": selectedSubject.value,
        "content": feedbackContent.value,
        "contact": contactInfo.value
      };
      const res = await api_api.feedback(data);
      common_vendor.index.__f__("log", "at pages/user/user.vue:386", "feedback", res);
      common_vendor.index.showToast({
        title: "反馈已提交",
        icon: "success"
      });
      selectedSubject.value = "";
      feedbackContent.value = "";
      contactInfo.value = "";
      closeFeedbackPopup();
    };
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
      common_vendor.index.__f__("log", "at pages/user/user.vue:413", "res", res);
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
      common_vendor.index.navigateTo({
        url: "/pages/sign/sign"
        // 跳转到签到记录页面
      });
    };
    const closeSignPopup = () => {
      showSignPopup.value = false;
    };
    common_vendor.onLoad(async () => {
      common_vendor.index.login({
        success: async (data) => {
          common_vendor.index.__f__("log", "at pages/user/user.vue:444", "微信登录 code:", data.code);
          try {
            const { token } = await api_api.login(data.code);
            common_vendor.index.setStorageSync("token", token);
            common_vendor.index.__f__("log", "at pages/user/user.vue:448", "登录成功，获取到 token:", token);
            const res = await api_api.getUserInfo();
            Object.assign(userInfo.value, res);
            common_vendor.index.__f__("log", "at pages/user/user.vue:454", "用户信息:", userInfo);
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/user/user.vue:456", "登录或获取用户信息失败:", error);
            common_vendor.index.showToast({
              title: "登录失败，请稍后重试",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/user/user.vue:464", "微信登录失败:", err);
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
        "gender": userInfo.value.gender,
        "ssoPassword": userInfo.value.ssoPassword
      };
      const res = await api_api.modifyUserInfo(data);
      common_vendor.index.__f__("log", "at pages/user/user.vue:483", "modifyUserInfo", res);
      show.value = false;
    };
    const changeName = (e) => {
      userInfo.value.username = e.detail.value;
      common_vendor.index.__f__("log", "at pages/user/user.vue:495", "userInfo", userInfo);
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
        E: common_vendor.p({
          type: "star",
          size: "30",
          color: "#FF4D4F"
        }),
        F: common_vendor.o(goToTechnology),
        G: common_vendor.t(userInfo.value.joinedTeamCount),
        H: common_vendor.t(userInfo.value.createdTeamCount),
        I: common_vendor.p({
          title: "课程助手",
          ["is-link"]: true,
          url: userInfo.value.studentId ? "/pages/course/course" : "/pages/veri/veri"
        }),
        J: common_vendor.p({
          title: "博雅助手",
          ["is-link"]: true,
          url: "/pages/boya/boya"
        }),
        K: common_vendor.o(openFeedbackPopup),
        L: common_vendor.p({
          title: "反馈问题",
          ["is-link"]: true
        }),
        M: common_vendor.t(selectedSubject.value || "请选择反馈主题"),
        N: subjectOptions,
        O: common_vendor.o(onSubjectChange),
        P: feedbackContent.value,
        Q: common_vendor.o(($event) => feedbackContent.value = $event.detail.value),
        R: contactInfo.value,
        S: common_vendor.o(($event) => contactInfo.value = $event.detail.value),
        T: common_vendor.o(submitFeedback),
        U: common_vendor.o(closeFeedbackPopup),
        V: common_vendor.p({
          closeable: true,
          show: showFeedbackPopup.value,
          round: "20"
        }),
        W: common_vendor.o(chooseFile),
        X: common_vendor.o(changeName),
        Y: common_vendor.t(userInfo.value.gender || "请选择性别"),
        Z: genderOptions,
        aa: common_vendor.o(changeGender),
        ab: userInfo.value.ssoPassword,
        ac: common_vendor.o(($event) => userInfo.value.ssoPassword = $event.detail.value),
        ad: common_vendor.o(userSubmit),
        ae: common_vendor.o(close),
        af: common_vendor.p({
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
