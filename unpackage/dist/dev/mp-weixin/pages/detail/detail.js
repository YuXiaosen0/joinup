"use strict";
const common_vendor = require("../../common/vendor.js");
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
          await api_api.uploadBrowse(item.id);
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
<<<<<<< HEAD
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:285", "!!!", userRole.value);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/detail.vue:293", "加载失败：", error);
=======
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:307", "!!!", userRole.value);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/detail.vue:315", "加载失败：", error);
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
        teamDetails.value = null;
      }
    });
    common_vendor.onShow(async () => {
      if (teamId.value) {
<<<<<<< HEAD
        const res = await api_api.getTeamDetails(teamId.value);
        if (res) {
          teamDetails.value = res;
        }
        const roleRes = await api_api.judgeRole(teamId.value);
        if (roleRes === null) {
          userRole.value = "vistor";
=======
        await api_api.uploadBrowse(teamId.value);
        const res = await api_api.getTeamDetails(teamId.value);
        teamDetails.value = res;
        const roleRes = await api_api.judgeRole(teamId.value);
        if (roleRes === null) {
          userRole.value = "visitor";
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
        } else if (roleRes === "成员") {
          userRole.value = "teamMember";
        } else {
          userRole.value = "creator";
        }
      }
    });
<<<<<<< HEAD
    const openDialog = (currentMembersCount, maxMembers) => {
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:325", currentMembersCount);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:326", maxMembers);
=======
    const add = async (userId) => {
      const res = await api_api.faQiConversation(userId);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:350", "res", res);
    };
    const openDialog = (currentMembersCount, maxMembers) => {
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:357", currentMembersCount);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:358", maxMembers);
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
      if (currentMembersCount >= maxMembers) {
        common_vendor.wx$1.showToast({
          title: "团队已满员",
          icon: "none"
        });
      } else {
        showInputArea.value = true;
      }
    };
<<<<<<< HEAD
    const modifyTeamInfo = (name, description, currentMembersCount) => {
      common_vendor.index.navigateTo({
        url: `/pages/detail/modifyTeam?teamId=${teamId.value}&currentMembers=${currentMembersCount}&name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`
=======
    const modifyTeamInfo = (name, description, currentMembersCount, cover) => {
      common_vendor.index.navigateTo({
        url: `/pages/detail/modifyTeam?teamId=${teamId.value}&currentMembers=${currentMembersCount}&name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&cover=${encodeURIComponent(cover)}`
      });
    };
    const goToChat = () => {
      if (!teamId.value)
        return;
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?teamId=${teamId.value}`
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
      });
    };
    function onSearch(value) {
      if (!value.trim()) {
        common_vendor.index.showToast({ title: "请输入关键字", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/detail/searchResult?keyword=${encodeURIComponent(value)}`
      });
    }
    const handleKick = async (memberId) => {
<<<<<<< HEAD
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:369", "!!!!!!!!!!!!!!!!!!");
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:370", teamDetails.value.id);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:371", memberId);
=======
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:407", "!!!!!!!!!!!!!!!!!!");
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:408", teamDetails.value.id);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:409", memberId);
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
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
        c: teamDetails.value.cover || "https://joinup.oss-cn-beijing.aliyuncs.com/images/img-0424/11.png",
        d: common_vendor.t(teamDetails.value.name),
        e: common_vendor.t(teamDetails.value.description),
        f: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        g: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.name),
            b: tag.id,
            c: common_vendor.o(($event) => onSearch(tag.name), tag.id)
          };
        })
      } : {}, {
        h: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        i: common_vendor.t(teamDetails.value.maxMembers),
        j: common_vendor.t(teamDetails.value.currentMembersCount),
        k: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
          return common_vendor.e({
            a: member.avatar || defaultAvatar,
            b: common_vendor.o(($event) => add(member.userId), member.id),
            c: common_vendor.t(member.userName),
            d: common_vendor.t(member.role),
            e: member.role !== "创建者"
          }, member.role !== "创建者" ? {
            f: common_vendor.o(($event) => handleKick(member.userId), member.id)
          } : {}, {
            g: member.id
          });
        })
      } : {}) : {}, {
<<<<<<< HEAD
        k: common_vendor.o(goToApplicationList),
        l: common_vendor.o(($event) => modifyTeamInfo(teamDetails.value.name, teamDetails.value.description, teamDetails.value.currentMembersCount))
      }) : userRole.value === "teamMember" ? common_vendor.e({
        n: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        o: common_vendor.t(teamDetails.value.name),
        p: common_vendor.t(teamDetails.value.description),
        q: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        r: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
=======
        l: common_vendor.o(goToApplicationList),
        m: common_vendor.o(($event) => modifyTeamInfo(teamDetails.value.name, teamDetails.value.description, teamDetails.value.currentMembersCount, teamDetails.value.cover)),
        n: common_vendor.o(goToChat)
      }) : userRole.value === "teamMember" ? common_vendor.e({
        p: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        q: common_vendor.t(teamDetails.value.name),
        r: common_vendor.t(teamDetails.value.description),
        s: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        t: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
          return {
            a: common_vendor.t(tag.name),
            b: tag.id,
            c: common_vendor.o(($event) => onSearch(tag.name), tag.id)
          };
        })
      } : {}, {
<<<<<<< HEAD
        s: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        t: common_vendor.t(teamDetails.value.maxMembers),
        v: common_vendor.t(teamDetails.value.currentMembersCount),
        w: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
=======
        v: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        w: common_vendor.t(teamDetails.value.maxMembers),
        x: common_vendor.t(teamDetails.value.currentMembersCount),
        y: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
          return {
            a: member.avatar || defaultAvatar,
            b: common_vendor.o(($event) => add(member.userId), member.id),
            c: common_vendor.t(member.userName),
            d: common_vendor.t(member.role),
            e: member.id
          };
        })
      } : {}) : {}, {
<<<<<<< HEAD
        x: common_vendor.o(leaveTeam)
      }) : common_vendor.e({
        z: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        A: common_vendor.t(teamDetails.value.name),
        B: common_vendor.t(teamDetails.value.description),
        C: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        D: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
=======
        z: common_vendor.o(leaveTeam),
        A: common_vendor.o(goToChat)
      }) : common_vendor.e({
        C: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        D: common_vendor.t(teamDetails.value.name),
        E: common_vendor.t(teamDetails.value.description),
        F: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        G: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
          return {
            a: common_vendor.t(tag.name),
            b: tag.id,
            c: common_vendor.o(($event) => onSearch(tag.name), tag.id)
          };
        })
      } : {}, {
<<<<<<< HEAD
        E: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        F: common_vendor.t(teamDetails.value.maxMembers),
        G: common_vendor.t(teamDetails.value.currentMembersCount),
        H: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
=======
        H: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        I: common_vendor.t(teamDetails.value.maxMembers),
        J: common_vendor.t(teamDetails.value.currentMembersCount),
        K: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
          return {
            a: member.avatar || defaultAvatar,
            b: common_vendor.o(($event) => add(member.userId), member.id),
            c: common_vendor.t(member.userName),
            d: common_vendor.t(member.role),
            e: member.id
          };
        })
      } : {}) : {}, {
<<<<<<< HEAD
        I: common_vendor.o(($event) => openDialog(teamDetails.value.currentMembersCount, teamDetails.value.maxMembers)),
        J: common_vendor.o(($event) => showInputArea.value = $event),
        K: common_vendor.p({
=======
        L: common_vendor.o(($event) => openDialog(teamDetails.value.currentMembersCount, teamDetails.value.maxMembers)),
        M: common_vendor.o(($event) => showInputArea.value = $event),
        N: common_vendor.p({
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
          show: showInputArea.value,
          teamId: (_a = teamDetails.value) == null ? void 0 : _a.id
        })
      }), {
<<<<<<< HEAD
        m: userRole.value === "teamMember",
        y: userRole.value === "visitor"
=======
        o: userRole.value === "teamMember",
        B: userRole.value === "visitor"
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
