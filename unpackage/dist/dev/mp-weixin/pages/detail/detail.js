"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const utils_useWebSocket = require("../../utils/useWebSocket.js");
if (!Array) {
  const _component_uni_popup = common_vendor.resolveComponent("uni-popup");
  _component_uni_popup();
}
if (!Math) {
  ApplyToJoinDialog();
}
const ApplyToJoinDialog = () => "../../components/applyToJoinDialog.js";
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const token = common_vendor.index.getStorageSync("token");
    const ws = utils_useWebSocket.useWebSocket(token);
    const teamDetails = common_vendor.ref(null);
    const showInputArea = common_vendor.ref(false);
    const userRole = common_vendor.ref("");
    common_vendor.ref([]);
    const teamId = common_vendor.ref();
    const showContactModal = common_vendor.ref(false);
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
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:354", "res===================", res);
          if (res) {
            teamDetails.value = res;
            common_vendor.index.__f__("log", "at pages/detail/detail.vue:357", "!!!!!!!", teamDetails.cover);
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
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:368", "!!!", userRole.value);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/detail.vue:376", "加载失败：", error);
=======
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
>>>>>>> 90b7105e053ef071c3e3200457250dea19701d6e
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
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:411", "res", res);
      const res1 = await api_api.getConDetail(res.id);
      const conversation = {
        id: res.id,
        type: "private",
        name: res1.name,
        cover: res1.cover
      };
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:420", "跳转到聊天页面conversation", conversation);
      const conversationStr = encodeURIComponent(JSON.stringify(conversation));
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?conversation=${conversationStr}`
      });
    };
    const openDialog = (currentMembersCount, maxMembers) => {
<<<<<<< HEAD
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:430", currentMembersCount);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:431", maxMembers);
=======
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:357", currentMembersCount);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:358", maxMembers);
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
>>>>>>> 90b7105e053ef071c3e3200457250dea19701d6e
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
    const contacts = common_vendor.ref();
    const goShare = async () => {
      if (!teamId.value)
        return;
      const res = await api_api.getListByPage(1, 100);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:457", "获取联系人列表:", res);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:458", "teamId.value", teamId.value);
      contacts.value = res.list.filter((item) => item.teamId !== teamId.value).map((item) => {
        var _a, _b, _c;
        return {
          id: item.id,
          name: item.name,
          cover: item.cover,
          lastMessageContent: ((_b = (_a = item.lastMessage) == null ? void 0 : _a.content) == null ? void 0 : _b.text) || "",
          lastTime: (_c = item.lastMessage) == null ? void 0 : _c.createTime,
          unreadMessageCount: item.unreadMessageCount,
          type: item.type,
          lastMessage: item.lastMessage,
          conversation: {
            "id": item.id,
            "type": item.type,
            "name": item.name,
            "cover": item.cover
          }
        };
      });
      showContactModal.value = true;
    };
    const closeModal = () => {
      showContactModal.value = false;
    };
    const selectContact = async (contact) => {
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:485", "Sending message to:", contact);
      const res = await api_api.getTeamDetails(teamId.value);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:487", "res", res);
      const res1 = await api_api.faQiDuiWuConversation(teamId.value);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:489", "res1", res1);
      const msgObj = {
        conversationId: contact.id,
        content: {
          teamId: teamId.value,
          conversationId: contact.id,
          groupName: res.name,
          cover: res.cover
        },
        type: "TEXT"
      };
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:496", "msgObj", msgObj);
      await ws.sendMessage(msgObj);
      common_vendor.index.showToast({
        title: "发送成功",
        icon: "success",
        // 可选：'success'/'loading'/'none'
        duration: 1500
        // 显示时长（毫秒）
      });
      closeModal();
    };
    const goToChat = async () => {
      if (!teamId.value)
        return;
      const res = await api_api.getTeamDetails(teamId.value);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:509", "res", res);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:510", "teamId.value", teamId.value);
      const res1 = await api_api.faQiDuiWuConversation(teamId.value);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:512", "res1", res1);
      const conversation = {
        id: res1.id,
        type: "group",
        name: res.name,
        cover: res.cover,
        members: res.members
      };
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:520", "跳转到聊天页面conversation", conversation);
      const conversationStr = encodeURIComponent(JSON.stringify(conversation));
      common_vendor.index.navigateTo({
<<<<<<< HEAD
        url: `/pages/chat/chat?conversation=${conversationStr}`
=======
        url: `/pages/chat/chat?teamId=${teamId.value}`
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
>>>>>>> 90b7105e053ef071c3e3200457250dea19701d6e
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
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:547", "!!!!!!!!!!!!!!!!!!");
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:548", teamDetails.value.id);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:549", memberId);
=======
<<<<<<< HEAD
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:369", "!!!!!!!!!!!!!!!!!!");
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:370", teamDetails.value.id);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:371", memberId);
=======
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:407", "!!!!!!!!!!!!!!!!!!");
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:408", teamDetails.value.id);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:409", memberId);
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
>>>>>>> 90b7105e053ef071c3e3200457250dea19701d6e
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
        n: common_vendor.o(goShare),
        o: common_vendor.o(goToChat),
        p: showContactModal.value
      }, showContactModal.value ? {
        q: common_vendor.o(closeModal),
        r: common_vendor.f(contacts.value, (contact, k0, i0) => {
          return {
            a: contact.cover,
            b: common_vendor.t(contact.name),
            c: contact.id,
            d: common_vendor.o(($event) => selectContact(contact), contact.id)
          };
        }),
        s: common_vendor.o(closeModal),
        t: common_vendor.p({
          type: "custom"
        })
      } : {}) : userRole.value === "teamMember" ? common_vendor.e({
        w: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        x: teamDetails.value.cover || "https://joinup.oss-cn-beijing.aliyuncs.com/images/img-0424/11.png",
        y: common_vendor.t(teamDetails.value.name),
        z: common_vendor.t(teamDetails.value.description),
        A: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
<<<<<<< HEAD
        B: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
=======
        t: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
>>>>>>> 90b7105e053ef071c3e3200457250dea19701d6e
          return {
            a: common_vendor.t(tag.name),
            b: tag.id,
            c: common_vendor.o(($event) => onSearch(tag.name), tag.id)
          };
        })
      } : {}, {
<<<<<<< HEAD
        C: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        D: common_vendor.t(teamDetails.value.maxMembers),
        E: common_vendor.t(teamDetails.value.currentMembersCount),
        F: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
=======
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
>>>>>>> 90b7105e053ef071c3e3200457250dea19701d6e
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
        G: common_vendor.o(leaveTeam),
        H: common_vendor.o(goShare),
        I: common_vendor.o(goToChat),
        J: showContactModal.value
      }, showContactModal.value ? {
        K: common_vendor.o(closeModal),
        L: common_vendor.f(contacts.value, (contact, k0, i0) => {
=======
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
>>>>>>> 90b7105e053ef071c3e3200457250dea19701d6e
          return {
            a: contact.cover,
            b: common_vendor.t(contact.name),
            c: contact.id,
            d: common_vendor.o(($event) => selectContact(contact), contact.id)
          };
<<<<<<< HEAD
        }),
        M: common_vendor.o(closeModal),
        N: common_vendor.p({
          type: "custom"
        })
      } : {}) : common_vendor.e({
        P: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        Q: teamDetails.value.cover || "https://joinup.oss-cn-beijing.aliyuncs.com/images/img-0424/11.png",
        R: common_vendor.t(teamDetails.value.name),
        S: common_vendor.t(teamDetails.value.description),
        T: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        U: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.name),
            b: tag.id,
            c: common_vendor.o(($event) => onSearch(tag.name), tag.id)
          };
        })
      } : {}, {
        V: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        W: common_vendor.t(teamDetails.value.maxMembers),
        X: common_vendor.t(teamDetails.value.currentMembersCount),
        Y: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
          return {
            a: member.avatar || defaultAvatar,
            b: common_vendor.o(($event) => add(member.userId), member.id),
            c: common_vendor.t(member.userName),
            d: common_vendor.t(member.role),
            e: member.id
          };
        })
      } : {}) : {}, {
        Z: common_vendor.o(($event) => openDialog(teamDetails.value.currentMembersCount, teamDetails.value.maxMembers)),
        aa: common_vendor.o(($event) => showInputArea.value = $event),
        ab: common_vendor.p({
=======
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
>>>>>>> 90b7105e053ef071c3e3200457250dea19701d6e
          show: showInputArea.value,
          teamId: (_a = teamDetails.value) == null ? void 0 : _a.id
        })
      }), {
<<<<<<< HEAD
        v: userRole.value === "teamMember",
        O: userRole.value === "visitor"
=======
<<<<<<< HEAD
        m: userRole.value === "teamMember",
        y: userRole.value === "visitor"
=======
        o: userRole.value === "teamMember",
        B: userRole.value === "visitor"
>>>>>>> df91c4910e10a832d1cd4950c9120fa042747557
>>>>>>> 90b7105e053ef071c3e3200457250dea19701d6e
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
