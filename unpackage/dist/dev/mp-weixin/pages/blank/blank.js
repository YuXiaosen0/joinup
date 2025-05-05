"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const common_assets = require("../../common/assets.js");
common_vendor.reactive({
  nickName: "",
  avatarUrl: ""
});
const _sfc_main = {
  components: {},
  data() {
    return {
      isRefreshing: false,
      isLoading: false,
      // 是否显示创建表单
      showCreateForm: false,
      // 创建队伍表单数据
      teamForm: {
        name: "",
        description: "",
        themeId: "",
        open: true,
        maxMembers: "",
        tagIdsInput: ""
        // 用于输入，后续会转换为数组
      },
      // 组队列表
      teamList: [],
      // 当前显示的组队类型（全部/我创建的/我加入的）
      currentTeamType: "all",
      // 图标页面链接
      pageLinks: {
        createTeam: "/pages/team/create-team",
        myCreatedTeams: "/pages/team/my-created-teams",
        myJoinedTeams: "/pages/team/my-joined-teams"
      }
    };
  },
  computed: {
    // 当前显示类型文本
    currentTypeText() {
      switch (this.currentTeamType) {
        case "CREATOR":
          return "我已发起的队伍";
        case "MEMBER":
          return "我已加入的队伍";
        default:
          return "全部队伍";
      }
    },
    // 空提示文本
    emptyTipsText() {
      switch (this.currentTeamType) {
        case "CREATOR":
          return "你还没有发起过队伍";
        case "MEMBER":
          return "你还没有加入过队伍";
        default:
          return "暂无组队信息";
      }
    }
  },
  onLoad() {
    this.getTeamList();
  },
  methods: {
    // 切换创建表单显示
    toggleCreateForm() {
      this.showCreateForm = !this.showCreateForm;
      if (!this.showCreateForm) {
        this.currentTeamType = "all";
        this.getTeamList();
      }
    },
    goDetail(item) {
      if (!item || !item.id) {
        common_vendor.index.__f__("error", "at pages/blank/blank.vue:222", "无效的 item 对象", item);
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`
      });
    },
    // 处理是否公开的切换
    onOpenChange(e) {
      this.teamForm.open = e.detail.value;
    },
    // 获取我的队伍（发起的或加入的）
    async getMyTeams(role) {
      try {
        this.isLoading = true;
        this.currentTeamType = role;
        this.showCreateForm = false;
        common_vendor.index.showLoading({
          title: "加载中..."
        });
        const response = await api_api.getMyTeam({
          role
        });
        common_vendor.index.hideLoading();
        this.isLoading = false;
        common_vendor.index.__f__("log", "at pages/blank/blank.vue:255", response);
        if (response) {
          this.teamList = response || [];
        } else {
          common_vendor.index.showToast({
            title: response.msg || "获取队伍信息失败",
            icon: "none"
          });
          this.teamList = [];
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        this.isLoading = false;
        common_vendor.index.showToast({
          title: "获取队伍信息失败，请稍后重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/blank/blank.vue:273", "获取队伍信息失败:", error);
        this.teamList = [];
      }
    },
    // 获取队伍状态样式类
    getStatusClass(status) {
      switch (status) {
        case "DISBANDED":
          return "status-disbanded";
        case "BANNED":
          return "status-banned";
        default:
          return "status-normal";
      }
    },
    // 获取队伍状态文本
    getStatusText(status) {
      switch (status) {
        case "DISBANDED":
          return "已解散";
        case "BANNED":
          return "已封禁";
        default:
          return "正常";
      }
    },
    // 创建新的组队
    async createTeam() {
      try {
        if (!this.teamForm.name || this.teamForm.name.length < 1 || this.teamForm.name.length > 60) {
          common_vendor.index.showToast({
            title: "队伍名称必须在1至60字符之间",
            icon: "none"
          });
          return;
        }
        if (!this.teamForm.themeId) {
          common_vendor.index.showToast({
            title: "请输入队伍主题",
            icon: "none"
          });
          return;
        }
        const maxMembers = parseInt(this.teamForm.maxMembers);
        if (!maxMembers || maxMembers <= 0 || maxMembers > 100) {
          common_vendor.index.showToast({
            title: "最大人数必须在1至100之间",
            icon: "none"
          });
          return;
        }
        let tagIds = [];
        if (this.teamForm.tagIdsInput) {
          tagIds = this.teamForm.tagIdsInput.split(",").map((id) => parseInt(id.trim())).filter((id) => !isNaN(id));
          if (tagIds.length > 10) {
            common_vendor.index.showToast({
              title: "队伍标签不能超过10个",
              icon: "none"
            });
            return;
          }
        }
        common_vendor.index.showLoading({
          title: "创建中..."
        });
        const teamData = {
          name: this.teamForm.name,
          description: this.teamForm.description,
          themeId: parseInt(this.teamForm.themeId),
          open: this.teamForm.open,
          maxMembers,
          tagIds
        };
        const result = await api_api.createNewTeam(teamData);
        common_vendor.index.hideLoading();
        if (result) {
          common_vendor.index.showToast({
            title: "创建成功",
            icon: "success"
          });
          this.resetForm();
          this.getMyTeams("CREATOR");
          this.showCreateForm = false;
          if (result.data && result.data.id) {
            common_vendor.index.navigateTo({
              url: `/pages/team/team-detail?id=${result.data.id}`
            });
          }
        } else {
          common_vendor.index.showToast({
            title: result.msg || "创建失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "创建失败，请稍后重试",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/blank/blank.vue:396", "创建组队失败:", error);
      }
    },
    // 重置表单
    resetForm() {
      this.teamForm = {
        name: "",
        description: "",
        themeId: "",
        open: true,
        maxMembers: "",
        tagIdsInput: ""
      };
    },
    // 获取组队列表
    getTeamList() {
      this.currentTeamType = "all";
      this.teamList = [];
    },
    // 下拉刷新
    onRefresh() {
      this.isRefreshing = true;
      if (this.currentTeamType !== "all") {
        this.getMyTeams(this.currentTeamType);
      } else {
        this.getTeamList();
      }
      setTimeout(() => {
        this.isRefreshing = false;
      }, 1e3);
    },
    // 加载更多
    loadMore() {
      if (this.isLoading)
        return;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1e3);
    },
    // 跳转到组队详情页面
    goToTeamDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail{item.id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.toggleCreateForm && $options.toggleCreateForm(...args)),
    b: common_vendor.o(($event) => $options.getMyTeams("CREATOR")),
    c: common_vendor.o(($event) => $options.getMyTeams("MEMBER")),
    d: $data.showCreateForm
  }, $data.showCreateForm ? {
    e: $data.teamForm.name,
    f: common_vendor.o(($event) => $data.teamForm.name = $event.detail.value),
    g: $data.teamForm.description,
    h: common_vendor.o(($event) => $data.teamForm.description = $event.detail.value),
    i: $data.teamForm.themeId,
    j: common_vendor.o(($event) => $data.teamForm.themeId = $event.detail.value),
    k: $data.teamForm.open,
    l: common_vendor.o((...args) => $options.onOpenChange && $options.onOpenChange(...args)),
    m: $data.teamForm.maxMembers,
    n: common_vendor.o(($event) => $data.teamForm.maxMembers = $event.detail.value),
    o: $data.teamForm.tagIdsInput,
    p: common_vendor.o(($event) => $data.teamForm.tagIdsInput = $event.detail.value),
    q: common_vendor.o((...args) => $options.createTeam && $options.createTeam(...args))
  } : {}, {
    r: $data.currentTeamType !== "all"
  }, $data.currentTeamType !== "all" ? {
    s: common_vendor.t($options.currentTypeText)
  } : {}, {
    t: common_vendor.f($data.teamList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: item.description
      }, item.description ? {
        c: common_vendor.t(item.description)
      } : {}, {
        d: common_vendor.t(item.currentMembersCount),
        e: common_vendor.t(item.maxMembers),
        f: common_vendor.t($options.getStatusText(item.status)),
        g: common_vendor.n($options.getStatusClass(item.status)),
        h: index,
        i: common_vendor.o(($event) => $options.goDetail(item), index)
      });
    }),
    v: $data.teamList.length === 0
  }, $data.teamList.length === 0 ? {
    w: common_assets._imports_0$2,
    x: common_vendor.t($options.emptyTipsText)
  } : {}, {
    y: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    z: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    A: $data.isRefreshing,
    B: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/blank/blank.js.map
