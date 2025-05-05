"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const _sfc_main = {
  __name: "boya",
  setup(__props) {
    const allCourses = common_vendor.ref([]);
    const selectedCourses = common_vendor.ref([]);
    const appointments = common_vendor.ref([]);
    const isWithinSelectPeriod = (startDate, endDate) => {
      const now = /* @__PURE__ */ new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      return now >= start && now <= end;
    };
    const formatDateTime = (dateTime) => {
      if (!dateTime)
        return "--";
      const date = new Date(dateTime);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    const yuYue = async (courseId) => {
      try {
        common_vendor.index.__f__("log", "at pages/boya/boya.vue:210", "预约kaishi", courseId);
        const data = { "course_id": courseId };
        const res = await api_api.appointBoya(data);
        common_vendor.index.__f__("log", "at pages/boya/boya.vue:213", "预约成功:", res);
        appointments.value.push({
          id: res.id,
          course_id: courseId,
          name: res.name,
          select_start_date: res.select_start_date
        });
        common_vendor.index.showToast({
          title: "预约成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/boya/boya.vue:228", "预约失败:", error);
        common_vendor.index.showToast({
          title: "预约失败，请重试",
          icon: "none"
        });
      }
    };
    const ceXiaoYuYue = async (appointmentId) => {
      try {
        const res = await api_api.cancelAppoint(appointmentId);
        common_vendor.index.__f__("log", "at pages/boya/boya.vue:240", "撤销预约成功:", res);
        appointments.value = appointments.value.filter(
          (appointment) => appointment.id !== appointmentId
        );
        common_vendor.index.showToast({
          title: "撤销预约成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/boya/boya.vue:252", "撤销预约失败:", error);
        common_vendor.index.showToast({
          title: "撤销预约失败，请重试",
          icon: "none"
        });
      }
    };
    const xuanKe = async (courseId) => {
      try {
        const data = { course_id: courseId };
        const res = await api_api.xuanBoya(data);
        common_vendor.index.__f__("log", "at pages/boya/boya.vue:264", "选课成功:", res);
        selectedCourses.value.push({
          course_id: courseId,
          name: res.name,
          start_date: res.start_date,
          end_date: res.end_date,
          college: res.college,
          position: res.position
        });
        common_vendor.index.showToast({
          title: "选课成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/boya/boya.vue:281", "选课失败:", error);
        common_vendor.index.showToast({
          title: "选课失败，请重试",
          icon: "none"
        });
      }
    };
    const tuiSelectedKe = async (Id) => {
      try {
        const res = await api_api.deleteBoya(Id);
        common_vendor.index.__f__("log", "at pages/boya/boya.vue:292", "退课成功:", res);
        selectedCourses.value = selectedCourses.value.filter(
          (course) => course.id !== Id
        );
        common_vendor.index.showToast({
          title: "退课成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/boya/boya.vue:304", "退课失败:", error);
        common_vendor.index.showToast({
          title: "退课失败，请重试",
          icon: "none"
        });
      }
    };
    const tuiKe = async (course) => {
      const selectedCourse = selectedCourses.value.find((item) => item.course_id === course.course_id);
      if (selectedCourse) {
        try {
          const res1 = await api_api.deleteBoya(selectedCourse.id);
          common_vendor.index.__f__("log", "at pages/boya/boya.vue:320", "deleteBoya", res1);
          selectedCourses.value = selectedCourses.value.filter((item) => item.course_id !== course.course_id);
          common_vendor.index.showToast({
            title: "退课成功",
            icon: "success"
          });
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/boya/boya.vue:330", "退课失败:", error);
          common_vendor.index.showToast({
            title: "退课失败",
            icon: "none"
          });
        }
      } else {
        common_vendor.index.__f__("error", "at pages/boya/boya.vue:337", "未找到匹配的课程");
        common_vendor.index.showToast({
          title: "未找到匹配的课程",
          icon: "none"
        });
      }
    };
    const loadCourseData = async () => {
      try {
        const res = await api_api.getBoyaCourse({
          "page_size": pageSize.value,
          "page_number": pageNumber.value
        });
        allCourses.value = res;
        common_vendor.index.showToast({
          title: `已加载第${pageNumber.value}页`,
          icon: "none"
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: "加载数据失败",
          icon: "error"
        });
        common_vendor.index.__f__("error", "at pages/boya/boya.vue:361", "加载数据失败:", error);
      }
    };
    common_vendor.onLoad(async () => {
      await loadCourseData();
      selectedCourses.value = await api_api.lookupYiXuan();
      common_vendor.index.__f__("log", "at pages/boya/boya.vue:368", "selectedCourses.value", selectedCourses.value);
      appointments.value = await api_api.getAppointList();
      common_vendor.index.__f__("log", "at pages/boya/boya.vue:371", " appointments.value", appointments.value);
    });
    const activeTab = common_vendor.ref("all");
    const switchTab = async (tab) => {
      activeTab.value = tab;
      if (tab == "all") {
        const res = await api_api.getBoyaCourse({
          "page_size": pageSize.value,
          "page_number": pageNumber.value
        });
        allCourses.value = res;
      } else if (tab == "selected") {
        selectedCourses.value = await api_api.lookupYiXuan();
        common_vendor.index.__f__("log", "at pages/boya/boya.vue:388", "selectedCourses.value", selectedCourses.value);
      } else {
        appointments.value = await api_api.getAppointList();
        common_vendor.index.__f__("log", "at pages/boya/boya.vue:391", " appointments.value", appointments.value);
      }
    };
    const isCourseSelected = (courseId) => {
      return selectedCourses.value.some((course) => course.course_id === courseId);
    };
    const hasAppointment = (courseId) => {
      return appointments.value.some((app) => app.course_id === courseId);
    };
    const pageNumber = common_vendor.ref(1);
    const pageSize = common_vendor.ref(6);
    const pageSizeOptions = [5, 6, 10, 15, 20];
    const pageSizeIndex = common_vendor.ref(1);
    const pageNumberOptions = common_vendor.computed(() => {
      const options = [];
      const totalPages = 10;
      for (let i = 1; i <= totalPages; i++) {
        options.push(`第 ${i} 页`);
      }
      return options;
    });
    const pageNumberIndex = common_vendor.computed(() => pageNumber.value - 1);
    const changePageSize = (e) => {
      const index = e.detail.value;
      pageSizeIndex.value = index;
      pageSize.value = pageSizeOptions[index];
      loadCourseData();
    };
    const changePageNumber = (e) => {
      const index = e.detail.value;
      pageNumber.value = index + 1;
      loadCourseData();
    };
    const prevPage = () => {
      if (pageNumber.value > 1) {
        pageNumber.value--;
        loadCourseData();
      }
    };
    const nextPage = () => {
      pageNumber.value++;
      loadCourseData();
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
            e: !isCourseSelected(course.course_id) && isWithinSelectPeriod(course.select_start_date, course.select_end_date)
          }, !isCourseSelected(course.course_id) && isWithinSelectPeriod(course.select_start_date, course.select_end_date) ? {
            f: common_vendor.o(($event) => xuanKe(course.course_id), course.course_id)
          } : isCourseSelected(course.course_id) ? {
            h: common_vendor.o(($event) => tuiKe(course), course.course_id)
          } : {}, {
            g: isCourseSelected(course.course_id),
            i: !hasAppointment(course.course_id) && /* @__PURE__ */ new Date() < new Date(course.select_end_date)
          }, !hasAppointment(course.course_id) && /* @__PURE__ */ new Date() < new Date(course.select_end_date) ? {
            j: common_vendor.o(($event) => yuYue(course.course_id), course.course_id)
          } : hasAppointment(course.course_id) ? {} : {}, {
            k: hasAppointment(course.course_id),
            l: course.course_id
          });
        }),
        i: pageNumber.value === 1,
        j: common_vendor.o(prevPage),
        k: common_vendor.t(pageSize.value),
        l: pageSizeOptions,
        m: pageSizeIndex.value,
        n: common_vendor.o(changePageSize),
        o: common_vendor.t(pageNumber.value),
        p: pageNumberOptions.value,
        q: pageNumberIndex.value,
        r: common_vendor.o(changePageNumber),
        s: common_vendor.o(nextPage)
      } : activeTab.value === "selected" ? common_vendor.e({
        v: selectedCourses.value.length === 0
      }, selectedCourses.value.length === 0 ? {} : {}, {
        w: common_vendor.f(selectedCourses.value, (course, k0, i0) => {
          return {
            a: common_vendor.t(course.name),
            b: common_vendor.t(formatDateTime(course.start_date)),
            c: common_vendor.t(formatDateTime(course.end_date)),
            d: common_vendor.t(course.college),
            e: common_vendor.t(course.position),
            f: common_vendor.o(($event) => tuiSelectedKe(course.id), course.course_id),
            g: course.course_id
          };
        })
      }) : common_vendor.e({
        x: appointments.value.length === 0
      }, appointments.value.length === 0 ? {} : {}, {
        y: common_vendor.f(appointments.value, (appointment, k0, i0) => {
          return {
            a: common_vendor.t(appointment.name),
            b: common_vendor.t(formatDateTime(appointment.select_start_date)),
            c: common_vendor.o(($event) => ceXiaoYuYue(appointment.id), appointment.appointment_id),
            d: appointment.appointment_id
          };
        })
      }), {
        t: activeTab.value === "selected"
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/boya/boya.js.map
