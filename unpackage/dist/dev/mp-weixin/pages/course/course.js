"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
if (!Array) {
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  const _easycom_up_popup2 = common_vendor.resolveComponent("up-popup");
  (_easycom_up_icon2 + _easycom_up_button2 + _easycom_up_popup2)();
}
const _easycom_up_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_up_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_up_popup = () => "../../uni_modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_up_icon + _easycom_up_button + _easycom_up_popup)();
}
const _sfc_main = {
  __name: "course",
  setup(__props) {
    const date = common_vendor.ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const startDate = common_vendor.ref("2024-04-08");
    const endDate = common_vendor.ref("2025-08-08");
    const courseInfo = common_vendor.ref();
    const selectedCourse = common_vendor.ref({
      classBeginTime: "2025-04-08T08:00:00",
      classEndTime: "2025-04-08T09:35:00",
      classroomName: "F121",
      courseName: "计算机网络",
      courseType: "必修",
      id: 2164526,
      courseId: 12358,
      signStatus: "已签到",
      teacherName: "张辉",
      weekDay: "周二"
    });
    const showPopup = common_vendor.ref(false);
    const showSignListPopup = common_vendor.ref(false);
    const signList = common_vendor.ref([]);
    const isSignAdded = (courseId) => {
      return signList.value.some((item) => item.courseId === courseId);
    };
    const bindDateChange = async (e) => {
      date.value = e.detail.value;
    };
    const showDetails = (course) => {
      selectedCourse.value = course;
      showPopup.value = true;
    };
    const closePopup = () => {
      showPopup.value = false;
    };
    const sign = async (id) => {
      const res = await api_api.signClass(id);
      if (res.code == 1) {
        common_vendor.index.showToast({
          title: "签到成功",
          icon: "success",
          duration: 3e3,
          position: "bottom"
        });
      } else {
        common_vendor.index.showToast({
          title: "签到失败",
          icon: "none",
          duration: 3e3,
          position: "bottom"
        });
      }
    };
    const getCouInfo = async () => {
      const res = await api_api.getCourseInfo(date.value);
      common_vendor.index.__f__("log", "at pages/course/course.vue:292", "res", res);
      if (res && Array.isArray(res.result)) {
        courseInfo.value = res.result.map((course) => ({
          id: course.id || "未知ID",
          courseId: course.courseId || "未知COURSEID",
          courseName: course.courseName || "未知课程名",
          courseType: course.courseType || "未知类型",
          teacherName: course.teacherName || "未知教师",
          classroomName: course.classroomName || "未知教室",
          weekDay: course.weekDay || "未知星期",
          classBeginTime: course.classBeginTime || "未知开始时间",
          classEndTime: course.classEndTime || "未知结束时间",
          signStatus: course.signStatus || "未知状态"
        }));
      } else if (res == null || res.result == null) {
        common_vendor.index.showToast({
          title: "当前日期无课程",
          icon: "none",
          duration: 1e3
        });
        courseInfo.value = [];
      } else {
        common_vendor.index.__f__("error", "at pages/course/course.vue:315", "获取课程信息失败或数据格式不正确");
        courseInfo.value = [];
      }
    };
    const addSignC = async (courseId) => {
      try {
        const res = await api_api.addSign(courseId);
        if (res.code === 1) {
          common_vendor.index.showToast({
            title: "添加成功",
            icon: "success",
            duration: 2e3
          });
        } else {
          common_vendor.index.showToast({
            title: res.message || "添加失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/course/course.vue:338", "添加失败:", error);
        common_vendor.index.showToast({
          title: "添加失败，请稍后重试",
          icon: "none",
          duration: 2e3
        });
      }
    };
    const deleteSignC = async (courseId) => {
      try {
        const res = await api_api.deleteSign(courseId);
        if (res.code === 1) {
          signList.value = signList.value.filter((item) => item.id !== courseId);
          common_vendor.index.showToast({
            title: "删除成功",
            icon: "success",
            duration: 2e3
          });
        } else {
          common_vendor.index.showToast({
            title: "删除失败",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/course/course.vue:366", "删除失败:", error);
        common_vendor.index.showToast({
          title: "删除失败",
          icon: "none",
          duration: 2e3
        });
      }
    };
    const openSignListPopup = async () => {
      const res = await api_api.getSign("RUNNING");
      if (res && Array.isArray(res)) {
        signList.value = res;
      } else {
        signList.value = [];
      }
      showSignListPopup.value = true;
    };
    const closeSignListPopup = () => {
      showSignListPopup.value = false;
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "--:--";
      const time = new Date(timeStr);
      return time.toTimeString().substring(0, 5);
    };
    const formatDate = (dateStr) => {
      if (!dateStr)
        return "--";
      const date2 = new Date(dateStr);
      return `${date2.getMonth() + 1}月${date2.getDate()}日`;
    };
    const formatDateTime = (dateStr) => {
      if (!dateStr)
        return "--";
      const date2 = new Date(dateStr);
      return `${date2.getMonth() + 1}/${date2.getDate()} ${date2.getHours()}:${date2.getMinutes().toString().padStart(2, "0")}`;
    };
    const getCourseTypeClass = (type) => {
      return {
        "required": type === "必修",
        "elective": type === "选修"
      };
    };
    const getStatusClass = (status) => {
      return {
        "signed": status === "已签到",
        "unsigned": status === "未签到"
      };
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          name: "calendar",
          size: "18",
          color: "#5A7BFF"
        }),
        b: common_vendor.t(date.value),
        c: common_vendor.p({
          name: "arrow-down",
          size: "14",
          color: "#A0A4B8"
        }),
        d: date.value,
        e: startDate.value,
        f: endDate.value,
        g: common_vendor.o(bindDateChange),
        h: common_vendor.o(getCouInfo),
        i: common_vendor.p({
          type: "primary",
          shape: "circle",
          icon: "search",
          color: "linear-gradient(to right, #5A7BFF, #3D56F0)"
        }),
        j: courseInfo.value != null
      }, courseInfo.value != null ? {
        k: common_vendor.f(courseInfo.value, (course, k0, i0) => {
          return {
            a: common_vendor.t(course.courseName),
            b: common_vendor.t(course.courseType),
            c: common_vendor.n(getCourseTypeClass(course.courseType)),
            d: "ffd98509-3-" + i0,
            e: common_vendor.t(course.teacherName),
            f: "ffd98509-4-" + i0,
            g: common_vendor.t(course.classroomName),
            h: "ffd98509-5-" + i0,
            i: common_vendor.t(formatTime(course.classBeginTime)),
            j: common_vendor.t(formatTime(course.classEndTime)),
            k: common_vendor.t(course.signStatus),
            l: common_vendor.n(getStatusClass(course.signStatus)),
            m: common_vendor.n(getCourseTypeClass(course.courseType)),
            n: course.id,
            o: common_vendor.o(($event) => showDetails(course), course.id)
          };
        }),
        l: common_vendor.p({
          name: "account-fill",
          size: "14",
          color: "#A0A4B8"
        }),
        m: common_vendor.p({
          name: "home-fill",
          size: "14",
          color: "#A0A4B8"
        }),
        n: common_vendor.p({
          name: "clock",
          size: "14",
          color: "#A0A4B8"
        })
      } : {}, {
        o: common_vendor.o(openSignListPopup),
        p: common_vendor.p({
          type: "primary",
          shape: "circle",
          icon: "list",
          color: "linear-gradient(to right, #5A7BFF, #3D56F0)"
        }),
        q: common_vendor.o(closeSignListPopup),
        r: common_vendor.p({
          name: "close"
        }),
        s: signList.value.length > 0
      }, signList.value.length > 0 ? {
        t: common_vendor.f(signList.value, (item, index, i0) => {
          return {
            a: "ffd98509-9-" + i0 + ",ffd98509-7",
            b: common_vendor.t(item.courseId),
            c: "ffd98509-10-" + i0 + ",ffd98509-7",
            d: common_vendor.t(formatDateTime(item.createTime)),
            e: "ffd98509-11-" + i0 + ",ffd98509-7",
            f: common_vendor.t(item.status === "RUNNING" ? "进行中" : "已结束"),
            g: item.status === "RUNNING" ? 1 : "",
            h: common_vendor.o(($event) => deleteSignC(item.id), index),
            i: "ffd98509-12-" + i0 + ",ffd98509-7",
            j: index
          };
        }),
        v: common_vendor.p({
          name: "bookmark",
          size: "18",
          color: "#5A7BFF"
        }),
        w: common_vendor.p({
          name: "calendar",
          size: "18",
          color: "#5A7BFF"
        }),
        x: common_vendor.p({
          name: "setting",
          size: "18",
          color: "#5A7BFF"
        }),
        y: common_vendor.p({
          type: "error",
          size: "mini",
          shape: "circle"
        })
      } : {
        z: common_assets._imports_0
      }, {
        A: common_vendor.o(closeSignListPopup),
        B: common_vendor.p({
          show: showSignListPopup.value,
          mode: "center",
          round: "16"
        }),
        C: common_vendor.t(selectedCourse.value.courseName),
        D: common_vendor.o(closePopup),
        E: common_vendor.p({
          name: "close"
        }),
        F: common_vendor.p({
          name: "lock",
          size: "18",
          color: "#5A7BFF"
        }),
        G: common_vendor.t(selectedCourse.value.courseId),
        H: common_vendor.p({
          name: "bookmark",
          size: "18",
          color: "#5A7BFF"
        }),
        I: common_vendor.t(selectedCourse.value.courseType),
        J: common_vendor.p({
          name: "account-fill",
          size: "18",
          color: "#5A7BFF"
        }),
        K: common_vendor.t(selectedCourse.value.teacherName),
        L: common_vendor.p({
          name: "home-fill",
          size: "18",
          color: "#5A7BFF"
        }),
        M: common_vendor.t(selectedCourse.value.classroomName),
        N: common_vendor.p({
          name: "calendar",
          size: "18",
          color: "#5A7BFF"
        }),
        O: common_vendor.t(formatDate(selectedCourse.value.classBeginTime)),
        P: common_vendor.p({
          name: "clock",
          size: "18",
          color: "#5A7BFF"
        }),
        Q: common_vendor.t(formatTime(selectedCourse.value.classBeginTime)),
        R: common_vendor.t(formatTime(selectedCourse.value.classEndTime)),
        S: common_vendor.t(isSignAdded(selectedCourse.value.courseId) ? "已添加" : "添加自动打卡"),
        T: common_vendor.o(($event) => addSignC(selectedCourse.value.courseId)),
        U: common_vendor.p({
          type: "primary",
          shape: "circle",
          disabled: isSignAdded(selectedCourse.value.courseId),
          color: "linear-gradient(to right, #6A11CB, #2575FC)"
        }),
        V: common_vendor.t(selectedCourse.value.signStatus === "已签到" ? "已签到" : "立即签到"),
        W: common_vendor.o(($event) => sign(selectedCourse.value.id)),
        X: common_vendor.p({
          type: "primary",
          shape: "circle",
          disabled: selectedCourse.value.signStatus === "已签到",
          color: "linear-gradient(to right, #5A7BFF, #3D56F0)"
        }),
        Y: common_vendor.o(closePopup),
        Z: common_vendor.p({
          show: showPopup.value,
          mode: "center",
          round: "16"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ffd98509"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/course/course.js.map
