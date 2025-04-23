"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const _sfc_main = {
  __name: "boya",
  setup(__props) {
    const allCourses = common_vendor.ref([
      {
        course_id: 1,
        name: "中国传统文化",
        start_date: "2023-09-01",
        end_date: "2023-12-31",
        college: "人文学院",
        position: "主楼201",
        select_identifier: "Boya-2023-001"
      },
      {
        course_id: 2,
        name: "西方艺术史",
        start_date: "2023-09-15",
        end_date: "2024-01-10",
        college: "艺术学院",
        position: "艺术楼101",
        select_identifier: "Boya-2023-002"
      },
      {
        course_id: 3,
        name: "科技创新与创业",
        start_date: "2023-10-01",
        end_date: "2023-12-15",
        college: "工程学院",
        position: "工程楼301",
        select_identifier: "Boya-2023-003"
      }
    ]);
    const selectedCourses = common_vendor.ref([
      {
        course_id: 1,
        name: "中国传统文化",
        start_date: "2023-09-01",
        end_date: "2023-12-31",
        college: "人文学院",
        position: "主楼201",
        select_identifier: "Boya-2023-001"
      }
    ]);
    const appointments = common_vendor.ref([
      {
        appointment_id: 1,
        course_id: 1,
        name: "中国传统文化",
        select_start_date: "2023-09-01 14:00"
      }
    ]);
    const activeTab = common_vendor.ref("all");
    const isAuthenticated = common_vendor.ref(false);
    const pageNumber = common_vendor.ref(1);
    const switchTab = (tab) => {
      activeTab.value = tab;
    };
    const isCourseSelected = (courseId) => {
      return selectedCourses.value.some((course) => course.course_id === courseId);
    };
    const hasAppointment = (courseId) => {
      return appointments.value.some((app) => app.course_id === courseId);
    };
    const showToast = (title) => {
      common_vendor.index.showToast({
        title,
        icon: "none"
      });
    };
    const prevPage = () => {
      if (pageNumber.value > 1) {
        pageNumber.value--;
        showToast(`切换到第 ${pageNumber.value} 页(模拟)`);
      }
    };
    const nextPage = () => {
      pageNumber.value++;
      showToast(`切换到第 ${pageNumber.value} 页(模拟)`);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(activeTab.value === "all" ? "active" : ""),
        b: common_vendor.o(($event) => switchTab("all")),
        c: common_vendor.n(activeTab.value === "selected" ? "active" : ""),
        d: common_vendor.o(($event) => switchTab("selected")),
        e: common_vendor.n(activeTab.value === "appointments" ? "active" : ""),
        f: common_vendor.o(($event) => switchTab("appointments")),
        g: activeTab.value === "all"
      }, activeTab.value === "all" ? {
        h: common_vendor.f(allCourses.value, (course, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(course.name),
            b: common_vendor.t(course.start_date),
            c: common_vendor.t(course.end_date),
            d: common_vendor.t(course.college),
            e: !isCourseSelected(course.course_id)
          }, !isCourseSelected(course.course_id) ? {
            f: common_vendor.o(($event) => showToast("选课功能(模拟)"), course.course_id)
          } : {
            g: common_vendor.o(($event) => showToast("退选功能(模拟)"), course.course_id)
          }, {
            h: common_vendor.o(($event) => showToast("预约功能(模拟)"), course.course_id),
            i: course.course_id
          });
        }),
        i: pageNumber.value === 1,
        j: common_vendor.o(prevPage),
        k: common_vendor.t(pageNumber.value),
        l: common_vendor.o(nextPage)
      } : activeTab.value === "selected" ? common_vendor.e({
        n: selectedCourses.value.length === 0
      }, selectedCourses.value.length === 0 ? {} : {}, {
        o: common_vendor.f(selectedCourses.value, (course, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(course.name),
            b: common_vendor.t(course.start_date),
            c: common_vendor.t(course.end_date),
            d: common_vendor.t(course.college),
            e: common_vendor.t(course.position),
            f: common_vendor.t(course.select_identifier),
            g: common_vendor.o(($event) => showToast("退选功能(模拟)"), course.course_id),
            h: !hasAppointment(course.course_id)
          }, !hasAppointment(course.course_id) ? {
            i: common_vendor.o(($event) => showToast("预约打卡功能(模拟)"), course.course_id)
          } : {}, {
            j: course.course_id
          });
        })
      }) : common_vendor.e({
        p: appointments.value.length === 0
      }, appointments.value.length === 0 ? {} : {}, {
        q: common_vendor.f(appointments.value, (appointment, k0, i0) => {
          return {
            a: common_vendor.t(appointment.name),
            b: common_vendor.t(appointment.select_start_date),
            c: common_vendor.o(($event) => showToast("撤销预约功能(模拟)"), appointment.appointment_id),
            d: appointment.appointment_id
          };
        })
      }), {
        m: activeTab.value === "selected",
        r: isAuthenticated.value
      }, isAuthenticated.value ? {} : {
        s: common_vendor.o(($event) => showToast("校园认证功能(模拟)"))
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/boya/boya.js.map
