"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const _sfc_main = {
  setup() {
    const teams = common_vendor.ref([]);
    const loading = common_vendor.ref(true);
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    common_vendor.onLoad(async (option) => {
      const keyword = decodeURIComponent(option.keyword || "");
      common_vendor.index.__f__("log", "at pages/detail/searchResult.vue:50", "搜索关键词：", keyword);
      try {
        loading.value = true;
        const res = await api_api.searchTeam(keyword);
        teams.value = res || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/searchResult.vue:57", "搜索失败", error);
        common_vendor.index.showToast({ title: "搜索失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    });
    const goDetail = (item) => {
      if (!(item == null ? void 0 : item.id))
        return;
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`
      });
    };
    return {
      teams,
      loading,
      goDetail,
      defaultAvatar
      // ✅ 一定要 return 出去
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $setup.loading
  }, $setup.loading ? {} : $setup.teams.length === 0 ? {} : {
    c: common_vendor.f($setup.teams, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name || "未命名队伍"),
        b: common_vendor.t(item.description || "暂无描述"),
        c: common_vendor.t(item.currentMembersCount),
        d: common_vendor.t(item.maxMembers),
        e: item.creatorAvatar || $setup.defaultAvatar,
        f: common_vendor.t(item.creatorUserName || "匿名用户"),
        g: item.id,
        h: common_vendor.o(($event) => $setup.goDetail(item), item.id)
      };
    })
  }, {
    b: $setup.teams.length === 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9506c49e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/searchResult.js.map
