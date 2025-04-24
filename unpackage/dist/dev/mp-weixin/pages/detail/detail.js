"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_api = require("../../api/api.js");
if (!Math) {
  ApplyToJoinDialog();
}
const ApplyToJoinDialog = () => "../../components/applyToJoinDialog.js";
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
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
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:262", "!!!", userRole.value);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/detail.vue:270", "加载失败：", error);
        teamDetails.value = null;
      }
    });
    const openDialog = () => {
      showInputArea.value = true;
    };
    const handleKick = async (memberId) => {
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:289", "!!!!!!!!!!!!!!!!!!");
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:290", teamDetails.value.id);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:291", memberId);
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
        c: common_vendor.t(teamDetails.value.name),
        d: common_vendor.t(teamDetails.value.description),
        e: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        f: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.name),
            b: tag.id
          };
        })
      } : {}, {
        g: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        h: common_vendor.t(teamDetails.value.maxMembers),
        i: common_vendor.t(teamDetails.value.currentMembersCount),
        j: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
          return common_vendor.e({
            a: member.avatar || defaultAvatar,
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
        k: common_vendor.o(goToApplicationList)
      }) : userRole.value === "teamMember" ? common_vendor.e({
        m: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        n: common_assets._imports_0,
        o: common_vendor.t(teamDetails.value.name),
        p: common_vendor.t(teamDetails.value.description),
        q: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        r: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.name),
            b: tag.id
          };
        })
      } : {}, {
        s: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        t: common_vendor.t(teamDetails.value.maxMembers),
        v: common_vendor.t(teamDetails.value.currentMembersCount),
        w: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
          return {
            a: member.avatar || defaultAvatar,
            b: common_vendor.t(member.userName),
            c: common_vendor.t(member.role),
            d: member.id
          };
        })
      } : {}) : {}, {
        x: common_vendor.o(leaveTeam)
      }) : common_vendor.e({
        z: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        A: common_assets._imports_0,
        B: common_vendor.t(teamDetails.value.name),
        C: common_vendor.t(teamDetails.value.description),
        D: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        E: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.name),
            b: tag.id
          };
        })
      } : {}, {
        F: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        G: common_vendor.t(teamDetails.value.maxMembers),
        H: common_vendor.t(teamDetails.value.currentMembersCount),
        I: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
          return {
            a: member.avatar || defaultAvatar,
            b: common_vendor.t(member.userName),
            c: common_vendor.t(member.role),
            d: member.id
          };
        })
      } : {}) : {}, {
        J: common_vendor.o(openDialog),
        K: common_vendor.o(($event) => showInputArea.value = $event),
        L: common_vendor.p({
          show: showInputArea.value,
          teamId: (_a = teamDetails.value) == null ? void 0 : _a.id
        })
      }), {
        l: userRole.value === "teamMember",
        y: userRole.value === "visitor"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
