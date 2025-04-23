"use strict";
const common_vendor = require("../../common/vendor.js");
<<<<<<< HEAD
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
if (!Math) {
  ApplyToJoinDialog();
}
const ApplyToJoinDialog = () => "../../components/applyToJoinDialog.js";
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const teamDetails = common_vendor.ref(null);
    const showInputArea = common_vendor.ref(false);
    const userRole = common_vendor.ref("");
    common_vendor.ref([]);
    const teamId = common_vendor.ref();
    common_vendor.onLoad(async (opt) => {
      try {
        let item = opt.item;
        if (!item)
          return;
        item = JSON.parse(decodeURIComponent(item));
        if (item == null ? void 0 : item.id) {
          teamId.value = item.id;
          const res = await api_api.getTeamDetails(item.id);
          if (res) {
            teamDetails.value = res;
          }
          const roleRes = await api_api.judgeRole(item.id);
          if (roleRes === null) {
            userRole.value = "vistor";
          } else if (roleRes === "成员") {
            userRole.value = "teamMember";
          } else {
            userRole.value = "creator";
          }
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:260", "!!!", userRole.value);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/detail.vue:268", "加载失败：", error);
        teamDetails.value = null;
      }
    });
    const openDialog = () => {
      showInputArea.value = true;
    };
    const handleKick = async (memberId) => {
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:287", "!!!!!!!!!!!!!!!!!!");
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:288", teamDetails.value.id);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:289", memberId);
      await api_api.kickMember(teamDetails.value.id, memberId);
      const res = await api_api.getTeamDetails(teamDetails.value.id);
      if (res)
        teamDetails.value = res;
    };
    const leaveTeam = async () => {
      await api_api.leaveTeamApi(teamDetails.value.id);
      userRole.value = "visitor";
      const res = await api_api.getTeamDetails(teamDetails.value.id);
      if (res)
        teamDetails.value = res;
    };
    const goToApplicationList = () => {
      common_vendor.index.navigateTo({
        url: `/pages/detail/applicationList?teamId=${teamId.value}`
      });
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: userRole.value === "creator"
      }, userRole.value === "creator" ? common_vendor.e({
        b: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        c: common_assets._imports_0,
        d: common_vendor.t(teamDetails.value.name),
        e: common_vendor.t(teamDetails.value.description),
        f: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        g: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.name),
            b: tag.id
          };
        })
      } : {}, {
        h: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        i: common_vendor.t(teamDetails.value.maxMembers),
        j: common_vendor.t(teamDetails.value.currentMembersCount),
        k: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
          return common_vendor.e({
            a: member.avatar,
            b: common_vendor.t(member.userName),
            c: common_vendor.t(member.role),
            d: member.role !== "创建者"
          }, member.role !== "创建者" ? {
            e: common_vendor.o(($event) => handleKick(member.userId), member.id)
          } : {}, {
            f: member.id
          });
        })
      } : {}) : {}, {
        l: common_vendor.o(goToApplicationList)
      }) : userRole.value === "teamMember" ? common_vendor.e({
        n: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        o: common_assets._imports_0,
        p: common_vendor.t(teamDetails.value.name),
        q: common_vendor.t(teamDetails.value.description),
        r: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        s: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.name),
            b: tag.id
          };
        })
      } : {}, {
        t: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        v: common_vendor.t(teamDetails.value.maxMembers),
        w: common_vendor.t(teamDetails.value.currentMembersCount),
        x: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
          return {
            a: member.avatar,
            b: common_vendor.t(member.userName),
            c: common_vendor.t(member.role),
            d: member.id
          };
        })
      } : {}) : {}, {
        y: common_vendor.o(leaveTeam)
      }) : common_vendor.e({
        A: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        B: common_assets._imports_0,
        C: common_vendor.t(teamDetails.value.name),
        D: common_vendor.t(teamDetails.value.description),
        E: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        F: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.name),
            b: tag.id
          };
        })
      } : {}, {
        G: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        H: common_vendor.t(teamDetails.value.maxMembers),
        I: common_vendor.t(teamDetails.value.currentMembersCount),
        J: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
          return {
            a: member.avatar,
            b: common_vendor.t(member.userName),
            c: common_vendor.t(member.role),
            d: member.id
          };
        })
      } : {}) : {}, {
        K: common_vendor.o(openDialog),
        L: common_vendor.o(($event) => showInputArea.value = $event),
        M: common_vendor.p({
          show: showInputArea.value,
          teamId: (_a = teamDetails.value) == null ? void 0 : _a.id
        })
      }), {
        m: userRole.value === "teamMember",
        z: userRole.value === "visitor"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
=======
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    common_vendor.onLoad((opt) => {
      JSON.parse(decodeURIComponent(opt.item));
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
};
wx.createPage(_sfc_main);
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
