"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const _sfc_main = {
  data() {
    return {
      teamId: null,
      applications: [],
      loading: true,
      error: "",
      teamDetails: null,
      maxMember: 0,
      currentMember: 0
    };
  },
  async onLoad(options) {
    try {
      this.teamId = parseInt(options.teamId);
      const teamRes = await api_api.getTeamDetails(this.teamId);
      const memberList = teamRes.members || [];
      this.maxMember = teamRes.maxMembers || 0;
      this.currentMember = teamRes.currentMembersCount || 0;
      common_vendor.index.__f__("log", "at pages/detail/applicationList.vue:56", "!!!!!!!!!", this.maxMember);
      const memberUserIds = memberList.map((m) => String(m.userId));
      const appRes = await api_api.getApplicationList(this.teamId);
      const rawList = appRes || [];
      this.applications = rawList.filter((item) => {
        return item.status === "待处理" && !memberUserIds.includes(String(item.userId));
      });
    } catch (err) {
      this.error = "获取申请列表失败，请稍后再试";
      common_vendor.index.__f__("error", "at pages/detail/applicationList.vue:72", err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async handleProcess(applicationId, action) {
      if (action === 0) {
        if (this.currentMember >= this.maxMember) {
          common_vendor.index.showToast({
            title: "队伍已满员，无法再同意新成员",
            icon: "none"
          });
          return;
        }
      }
      try {
        await api_api.processApplication(this.teamId, applicationId, action);
        this.applications = this.applications.filter((item) => item.id !== applicationId);
        if (action === 0) {
          this.currentMember += 1;
        }
        common_vendor.index.showToast({
          title: action === 0 ? "已同意" : "已拒绝",
          icon: "success"
        });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/detail/applicationList.vue:100", err);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {} : $data.error ? {
    c: common_vendor.t($data.error)
  } : common_vendor.e({
    d: $data.applications.length > 0
  }, $data.applications.length > 0 ? {
    e: common_vendor.f($data.applications, (item, index, i0) => {
      return {
        a: item.avatar,
        b: common_vendor.t(item.username),
        c: common_vendor.t(item.applicationMessage),
        d: common_vendor.o(($event) => $options.handleProcess(item.id, 0), index),
        e: common_vendor.o(($event) => $options.handleProcess(item.id, 1), index),
        f: index
      };
    })
  } : {}), {
    b: $data.error
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1854d6c3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/applicationList.js.map
