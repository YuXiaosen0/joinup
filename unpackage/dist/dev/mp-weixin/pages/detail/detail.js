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
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:358", "res===================", res);
          if (res) {
            teamDetails.value = res;
            common_vendor.index.__f__("log", "at pages/detail/detail.vue:361", "!!!!!!!", teamDetails.cover);
          }
          const roleRes = await api_api.judgeRole(item.id);
          if (roleRes === null) {
            userRole.value = "vistor";
          } else if (roleRes === "成员") {
            userRole.value = "teamMember";
          } else {
            userRole.value = "creator";
          }
          common_vendor.index.__f__("log", "at pages/detail/detail.vue:372", "!!!", userRole.value);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/detail.vue:380", "加载失败：", error);
        teamDetails.value = null;
      }
    });
    common_vendor.onShow(async () => {
      if (teamId.value) {
        await api_api.uploadBrowse(teamId.value);
        const res = await api_api.getTeamDetails(teamId.value);
        teamDetails.value = res;
        const roleRes = await api_api.judgeRole(teamId.value);
        if (roleRes === null) {
          userRole.value = "visitor";
        } else if (roleRes === "成员") {
          userRole.value = "teamMember";
        } else {
          userRole.value = "creator";
        }
      }
    });
    const add = async (userId) => {
      const res = await api_api.faQiConversation(userId);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:415", "res", res);
      const res1 = await api_api.getConDetail(res.id);
      const conversation = {
        id: res.id,
        type: "private",
        name: res1.name,
        cover: res1.cover
      };
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:424", "跳转到聊天页面conversation", conversation);
      const conversationStr = encodeURIComponent(JSON.stringify(conversation));
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?conversation=${conversationStr}`
      });
    };
    const openDialog = (currentMembersCount, maxMembers) => {
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:434", currentMembersCount);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:435", maxMembers);
      if (currentMembersCount >= maxMembers) {
        common_vendor.wx$1.showToast({
          title: "团队已满员",
          icon: "none"
        });
      } else {
        showInputArea.value = true;
      }
    };
    const modifyTeamInfo = (name, description, currentMembersCount, cover) => {
      common_vendor.index.navigateTo({
        url: `/pages/detail/modifyTeam?teamId=${teamId.value}&currentMembers=${currentMembersCount}&name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&cover=${encodeURIComponent(cover)}`
      });
    };
    const handleDisbandTeam = async () => {
      common_vendor.index.showModal({
        title: "确认操作",
        content: "确定要解散该队伍吗？此操作不可恢复。",
        success: async (res) => {
          if (res.confirm) {
            try {
              await api_api.disbandTeam(teamId.value);
              common_vendor.wx$1.showToast({
                title: "已解散",
                icon: "success"
              });
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1e3);
            } catch (err) {
              common_vendor.wx$1.showToast({
                title: "解散失败",
                icon: "none"
              });
              common_vendor.index.__f__("error", "at pages/detail/detail.vue:478", err);
            }
          }
        }
      });
    };
    const contacts = common_vendor.ref();
    const goShare = async () => {
      if (!teamId.value)
        return;
      const res = await api_api.getListByPage(1, 100);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:490", "获取联系人列表:", res);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:491", "teamId.value", teamId.value);
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
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:518", "Sending message to:", contact);
      const res = await api_api.getTeamDetails(teamId.value);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:520", "res", res);
      const res1 = await api_api.faQiDuiWuConversation(teamId.value);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:522", "res1", res1);
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
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:529", "msgObj", msgObj);
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
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:542", "res", res);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:543", "teamId.value", teamId.value);
      const res1 = await api_api.faQiDuiWuConversation(teamId.value);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:545", "res1", res1);
      const conversation = {
        id: res1.id,
        type: "group",
        name: res.name,
        cover: res.cover,
        members: res.members
      };
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:553", "跳转到聊天页面conversation", conversation);
      const conversationStr = encodeURIComponent(JSON.stringify(conversation));
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?conversation=${conversationStr}`
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
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:580", "!!!!!!!!!!!!!!!!!!");
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:581", teamDetails.value.id);
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:582", memberId);
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
        l: common_vendor.o(goToApplicationList),
        m: common_vendor.o(($event) => modifyTeamInfo(teamDetails.value.name, teamDetails.value.description, teamDetails.value.currentMembersCount, teamDetails.value.cover)),
        n: common_vendor.o(handleDisbandTeam),
        o: common_vendor.o(goShare),
        p: common_vendor.o(goToChat),
        q: showContactModal.value
      }, showContactModal.value ? {
        r: common_vendor.o(closeModal),
        s: common_vendor.f(contacts.value, (contact, k0, i0) => {
          return {
            a: contact.cover,
            b: common_vendor.t(contact.name),
            c: contact.id,
            d: common_vendor.o(($event) => selectContact(contact), contact.id)
          };
        }),
        t: common_vendor.o(closeModal),
        v: common_vendor.p({
          type: "custom"
        })
      } : {}) : userRole.value === "teamMember" ? common_vendor.e({
        x: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        y: teamDetails.value.cover || "https://joinup.oss-cn-beijing.aliyuncs.com/images/img-0424/11.png",
        z: common_vendor.t(teamDetails.value.name),
        A: common_vendor.t(teamDetails.value.description),
        B: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        C: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.name),
            b: tag.id,
            c: common_vendor.o(($event) => onSearch(tag.name), tag.id)
          };
        })
      } : {}, {
        D: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        E: common_vendor.t(teamDetails.value.maxMembers),
        F: common_vendor.t(teamDetails.value.currentMembersCount),
        G: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
          return {
            a: member.avatar || defaultAvatar,
            b: common_vendor.o(($event) => add(member.userId), member.id),
            c: common_vendor.t(member.userName),
            d: common_vendor.t(member.role),
            e: member.id
          };
        })
      } : {}) : {}, {
        H: common_vendor.o(leaveTeam),
        I: common_vendor.o(goShare),
        J: common_vendor.o(goToChat),
        K: showContactModal.value
      }, showContactModal.value ? {
        L: common_vendor.o(closeModal),
        M: common_vendor.f(contacts.value, (contact, k0, i0) => {
          return {
            a: contact.cover,
            b: common_vendor.t(contact.name),
            c: contact.id,
            d: common_vendor.o(($event) => selectContact(contact), contact.id)
          };
        }),
        N: common_vendor.o(closeModal),
        O: common_vendor.p({
          type: "custom"
        })
      } : {}) : common_vendor.e({
        Q: teamDetails.value
      }, teamDetails.value ? common_vendor.e({
        R: teamDetails.value.cover || "https://joinup.oss-cn-beijing.aliyuncs.com/images/img-0424/11.png",
        S: common_vendor.t(teamDetails.value.name),
        T: common_vendor.t(teamDetails.value.description),
        U: teamDetails.value.tags && teamDetails.value.tags.length > 0
      }, teamDetails.value.tags && teamDetails.value.tags.length > 0 ? {
        V: common_vendor.f(teamDetails.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.name),
            b: tag.id,
            c: common_vendor.o(($event) => onSearch(tag.name), tag.id)
          };
        })
      } : {}, {
        W: teamDetails.value.members && teamDetails.value.members.length > 0
      }, teamDetails.value.members && teamDetails.value.members.length > 0 ? {
        X: common_vendor.t(teamDetails.value.maxMembers),
        Y: common_vendor.t(teamDetails.value.currentMembersCount),
        Z: common_vendor.f(teamDetails.value.members, (member, k0, i0) => {
          return {
            a: member.avatar || defaultAvatar,
            b: common_vendor.o(($event) => add(member.userId), member.id),
            c: common_vendor.t(member.userName),
            d: common_vendor.t(member.role),
            e: member.id
          };
        })
      } : {}) : {}, {
        aa: common_vendor.o(($event) => openDialog(teamDetails.value.currentMembersCount, teamDetails.value.maxMembers)),
        ab: common_vendor.o(($event) => showInputArea.value = $event),
        ac: common_vendor.p({
          show: showInputArea.value,
          teamId: (_a = teamDetails.value) == null ? void 0 : _a.id
        })
      }), {
        w: userRole.value === "teamMember",
        P: userRole.value === "visitor"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
