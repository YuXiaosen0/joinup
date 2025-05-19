"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const MessagePopup = () => "../message/message2.js";
const _sfc_main = {
  components: {
    MessagePopup
  },
  setup() {
    const currentTypeMessage = common_vendor.ref(null);
    const showMessagePopup = common_vendor.ref(false);
    const openMessagePopup = (type) => {
      currentTypeMessage.value = type;
      showMessagePopup.value = true;
    };
    const closeMessagePopup = () => {
      showMessagePopup.value = false;
    };
    return {
      currentTypeMessage,
      showMessagePopup,
      openMessagePopup,
      closeMessagePopup
    };
  },
  data() {
    return {
      isRefreshing: false,
      isLoading: false,
      currentType: null,
      // 使用null表示未选择类型
      readStatus: null,
      // null: 全部, false: 未读, true: 已读
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      hasSelectedType: false,
      // 标记是否已选择消息类型
      // 消息列表
      messageList: [],
      // 队伍列表
      createdTeams: [],
      // 用户创建的队伍
      joinedTeams: [],
      // 用户加入的队伍
      // 图标页面链接
      pageLinks: {
        team: "/pages/team/team",
        boya: "/pages/boya/boya",
        checkin: "/pages/checkin/checkin",
        newFeature: "/pages/team/team"
      }
    };
  },
  // 页面加载时获取队伍信息
  onLoad() {
    this.fetchTeams();
  },
  methods: {
    // 获取用户相关的队伍
    fetchTeams() {
      api_api.getMyTeam({
        role: "CREATOR"
      }).then((res) => {
        if (res) {
          this.createdTeams = res || [];
        } else {
          common_vendor.index.__f__("error", "at pages/order/order.vue:262", "获取创建的队伍失败:", res.msg);
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/order/order.vue:265", "获取创建的队伍异常:", err);
      });
      api_api.getMyTeam({
        role: "MEMBER"
      }).then((res) => {
        if (res.code === 1) {
          this.joinedTeams = res.data || [];
        } else {
          common_vendor.index.__f__("error", "at pages/order/order.vue:275", "获取加入的队伍失败:", res.msg);
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/order/order.vue:278", "获取加入的队伍异常:", err);
      });
    },
    // 跳转到队伍详情
    goTeamDetail(team) {
      if (!team || !team.id) {
        common_vendor.index.__f__("error", "at pages/order/order.vue:285", "无效的队伍对象", team);
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/team/detail?teamId=${team.id}`
      });
    },
    // 导航到对应页面
    navigateTo(type) {
      const url = this.pageLinks[type] || "/pages/index/index";
      common_vendor.index.navigateTo({
        url
      });
    },
    // 获取消息类型对应的文本
    getTypeText(type) {
      const typeMap = {
        0: "组队",
        1: "课程",
        2: "博雅"
      };
      return typeMap[type] || "";
    },
    // 获取阅读状态对应的文本
    getReadStatusText() {
      if (this.readStatus === true)
        return "已读";
      if (this.readStatus === false)
        return "未读";
      return "";
    },
    // 选择消息类型
    selectMessageType(type) {
      if (type === null || type === void 0) {
        return;
      }
      this.currentType = type;
      this.hasSelectedType = true;
      this.readStatus = null;
      this.fetchMessages();
    },
    // 切换阅读状态
    switchReadStatus(status) {
      if (this.readStatus === status)
        return;
      this.readStatus = status;
      this.fetchMessages();
    },
    // 获取指定类型和阅读状态的消息
    fetchMessages() {
      this.isLoading = true;
      this.currentPage = 1;
      this.messageList = [];
      const params = {
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        type: this.currentType
      };
      if (this.readStatus !== null) {
        params.read = this.readStatus;
      }
      api_api.getMyMessage(params).then((res) => {
        if (res) {
          this.messageList = res.list || [];
          this.totalPages = res.pages || 0;
        } else {
          this.messageList = [];
          common_vendor.index.showToast({
            title: res.msg || "获取消息失败",
            icon: "none"
          });
        }
        this.isLoading = false;
        if (this.isRefreshing) {
          this.isRefreshing = false;
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/order/order.vue:373", "获取消息失败", err);
        this.messageList = [];
        this.isLoading = false;
        if (this.isRefreshing) {
          this.isRefreshing = false;
        }
        common_vendor.index.showToast({
          title: "获取消息失败",
          icon: "none"
        });
      });
    },
    // 下拉刷新
    onRefresh() {
      this.isRefreshing = true;
      if (this.hasSelectedType) {
        this.fetchMessages();
      } else {
        this.isRefreshing = false;
      }
    },
    // 加载更多
    loadMore() {
      if (this.isLoading || this.currentPage >= this.totalPages || !this.hasSelectedType)
        return;
      this.isLoading = true;
      this.currentPage++;
      const params = {
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        type: this.currentType
      };
      if (this.readStatus !== null) {
        params.read = this.readStatus;
      }
      api_api.getMyMessage(params).then((res) => {
        if (res) {
          const newList = res.data.list || [];
          this.messageList = [...this.messageList, ...newList];
        }
        this.isLoading = false;
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/order/order.vue:423", "加载更多消息失败", err);
        this.isLoading = false;
        common_vendor.index.showToast({
          title: "加载更多失败",
          icon: "none"
        });
      });
    },
    // 确认收到消息
    confirmMessage(id, index) {
      if (this.messageList[index] && this.messageList[index].read) {
        return;
      }
      common_vendor.index.showModal({
        title: "确认",
        content: "是否确认收到该消息？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "确认中..."
            });
            api_api.markMessageRead(id).then((res2) => {
              common_vendor.index.hideLoading();
              if (res2.code === 1) {
                common_vendor.index.showToast({
                  title: "确认成功",
                  icon: "success"
                });
                if (this.readStatus === false) {
                  this.messageList.splice(index, 1);
                } else {
                  if (this.messageList[index]) {
                    this.messageList[index].read = true;
                    this.$set(this.messageList, index, { ...this.messageList[index] });
                  }
                }
              } else {
                common_vendor.index.showToast({
                  title: res2.msg || "确认失败",
                  icon: "none"
                });
              }
            }).catch((err) => {
              common_vendor.index.hideLoading();
              common_vendor.index.__f__("error", "at pages/order/order.vue:480", "确认消息失败", err);
              common_vendor.index.showToast({
                title: "确认失败，请稍后重试",
                icon: "none"
              });
            });
          }
        }
      });
    },
    // 处理删除消息逻辑
    handleDeleteMessage(id, isRead, index) {
      if (!isRead) {
        common_vendor.index.showModal({
          title: "提示",
          content: "该消息未读，确定要删除吗？",
          success: (res) => {
            if (res.confirm) {
              this.performDeleteMessage(id, index);
            }
          }
        });
      } else {
        common_vendor.index.showModal({
          title: "提示",
          content: "确定要删除这条消息吗？",
          success: (res) => {
            if (res.confirm) {
              this.performDeleteMessage(id, index);
            }
          }
        });
      }
    },
    // 执行删除消息API调用
    performDeleteMessage(id, index) {
      common_vendor.index.showLoading({
        title: "删除中..."
      });
      api_api.deleteMessage(id).then((res) => {
        common_vendor.index.hideLoading();
        if (res.code === 1) {
          common_vendor.index.showToast({
            title: "删除成功",
            icon: "success"
          });
          this.messageList.splice(index, 1);
        } else {
          common_vendor.index.showToast({
            title: res.msg || "删除失败",
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/order/order.vue:547", "删除消息失败", err);
        common_vendor.index.showToast({
          title: "删除失败，请稍后重试",
          icon: "none"
        });
      });
    },
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr)
        return "";
      const date = new Date(timeStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }
  }
};
if (!Array) {
  const _component_message_popup = common_vendor.resolveComponent("message-popup");
  _component_message_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentType === 0 ? 1 : "",
    b: $data.currentType === 0 ? 1 : "",
    c: common_vendor.o(($event) => ($options.selectMessageType(0), $setup.openMessagePopup(0))),
    d: $data.currentType === 2 ? 1 : "",
    e: $data.currentType === 2 ? 1 : "",
    f: common_vendor.o(($event) => ($options.selectMessageType(2), $setup.openMessagePopup(2))),
    g: $data.currentType === 1 ? 1 : "",
    h: $data.currentType === 1 ? 1 : "",
    i: common_vendor.o(($event) => ($options.selectMessageType(1), $setup.openMessagePopup(1))),
    j: $data.createdTeams.length > 0
  }, $data.createdTeams.length > 0 ? {
    k: common_vendor.f($data.createdTeams, (team, index, i0) => {
      return {
        a: common_vendor.t(team.name),
        b: "created-" + team.id,
        c: common_vendor.o(($event) => $options.goTeamDetail(team), "created-" + team.id)
      };
    })
  } : {}, {
    l: $data.joinedTeams.length > 0
  }, $data.joinedTeams.length > 0 ? {
    m: common_vendor.f($data.joinedTeams, (team, index, i0) => {
      return {
        a: common_vendor.t(team.name),
        b: "joined-" + team.id,
        c: common_vendor.o(($event) => $options.goTeamDetail(team), "joined-" + team.id)
      };
    })
  } : {}, {
    n: $data.createdTeams.length === 0 && $data.joinedTeams.length === 0
  }, $data.createdTeams.length === 0 && $data.joinedTeams.length === 0 ? {} : {}, {
    o: $setup.showMessagePopup
  }, $setup.showMessagePopup ? {
    p: common_vendor.o($setup.closeMessagePopup),
    q: common_vendor.p({
      type: $setup.currentTypeMessage
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
