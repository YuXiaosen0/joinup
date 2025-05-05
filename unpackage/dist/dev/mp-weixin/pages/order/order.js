"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
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
      // 图标页面链接
      pageLinks: {
        team: "/pages/team/team",
        boya: "/pages/boya/boya",
        checkin: "/pages/checkin/checkin",
        newFeature: "/pages/team/team"
      }
    };
  },
  methods: {
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
        common_vendor.index.__f__("error", "at pages/order/order.vue:237", "获取消息失败", err);
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
        common_vendor.index.__f__("error", "at pages/order/order.vue:287", "加载更多消息失败", err);
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
              common_vendor.index.__f__("error", "at pages/order/order.vue:344", "确认消息失败", err);
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
      api_api.deleteMessage().then((res) => {
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
        common_vendor.index.__f__("error", "at pages/order/order.vue:411", "删除消息失败", err);
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentType === 0 ? 1 : "",
    b: $data.currentType === 0 ? 1 : "",
    c: common_vendor.o(($event) => $options.selectMessageType(0)),
    d: $data.currentType === 2 ? 1 : "",
    e: $data.currentType === 2 ? 1 : "",
    f: common_vendor.o(($event) => $options.selectMessageType(2)),
    g: $data.currentType === 1 ? 1 : "",
    h: $data.currentType === 1 ? 1 : "",
    i: common_vendor.o(($event) => $options.selectMessageType(1)),
    j: common_vendor.o(($event) => $options.navigateTo("newFeature")),
    k: $data.hasSelectedType
  }, $data.hasSelectedType ? {
    l: $data.readStatus === null ? 1 : "",
    m: common_vendor.o(($event) => $options.switchReadStatus(null)),
    n: $data.readStatus === false ? 1 : "",
    o: common_vendor.o(($event) => $options.switchReadStatus(false)),
    p: $data.readStatus === true ? 1 : "",
    q: common_vendor.o(($event) => $options.switchReadStatus(true))
  } : {}, {
    r: !$data.hasSelectedType
  }, !$data.hasSelectedType ? {
    s: common_assets._imports_0
  } : common_vendor.e({
    t: common_vendor.f($data.messageList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.formatTime(item.createTime)),
        b: item.read
      }, item.read ? {} : {}, {
        c: common_vendor.t(item.title),
        d: common_vendor.t(item.content),
        e: common_vendor.t(item.read ? "已确认" : "确认收到"),
        f: common_vendor.o(($event) => $options.confirmMessage(item.id, index), index),
        g: item.read,
        h: common_vendor.o(($event) => $options.handleDeleteMessage(item.id, item.read, index), index),
        i: index
      });
    }),
    v: $data.messageList.length === 0
  }, $data.messageList.length === 0 ? {
    w: common_assets._imports_1,
    x: common_vendor.t($options.getReadStatusText()),
    y: common_vendor.t($options.getTypeText($data.currentType))
  } : {}, {
    z: $data.isLoading
  }, $data.isLoading ? {} : {}), {
    A: $data.hasSelectedType ? 1 : "",
    B: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    C: $data.isRefreshing,
    D: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
