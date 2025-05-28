"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
require("../../utils/useWebSocket.js");
if (!Array) {
  const _easycom_up_tabs2 = common_vendor.resolveComponent("up-tabs");
  _easycom_up_tabs2();
}
const _easycom_up_tabs = () => "../../uni_modules/uview-plus/components/u-tabs/u-tabs.js";
if (!Math) {
  (SearchBar + SwiperBanner + _easycom_up_tabs + WaterfallList)();
}
const WaterfallList = () => "../../components/WaterfallList.js";
const SearchBar = () => "../../components/SearchBar.js";
const SwiperBanner = () => "../../components/SwiperBanner.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.index.getStorageSync("token");
    const keyword = common_vendor.ref("");
    const themes = common_vendor.reactive([]);
    const swiperList = common_vendor.ref([]);
    let currentTab = common_vendor.ref(0);
    let flowList = common_vendor.ref([]);
    common_vendor.onShow(() => {
      fetchSwiperList();
      fetchThemes();
      loadList(0);
    });
    common_vendor.onMounted(() => {
      fetchSwiperList();
      fetchThemes();
      loadList(0);
    });
    function onTabChange(index) {
      currentTab.value = index.index;
      const themeId = themes[currentTab.value].id;
      loadList(themeId);
    }
    function loadList(themeId) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:64", "当前 themeId:", themeId);
      api_api.getTeamList(themeId).then((res) => {
        if (res && res.list) {
          flowList.value = res.list || [];
        } else {
          common_vendor.index.__f__("error", "at pages/index/index.vue:69", "接口返回数据结构不正确:", res);
          flowList.value = [];
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/index/index.vue:73", "API 请求失败:", error);
        flowList.value = [];
      });
    }
    function fetchThemes() {
      api_api.getThemeList().then((res) => {
        res.forEach((item) => {
          themes.push({
            name: item.name,
            id: item.id,
            description: item.description || "暂无描述"
          });
        });
        if (themes.length > 0) {
          loadList(themes[currentTab.value].id);
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/index/index.vue:93", "获取主题列表失败:", error);
      });
    }
    const fetchSwiperList = async () => {
      try {
        const res = await api_api.getSwiperList();
        if (Array.isArray(res)) {
          swiperList.value = res.map((item) => ({
            image: item.cover,
            title: item.title,
            id: item.id
          }));
        } else {
          common_vendor.index.__f__("warn", "at pages/index/index.vue:109", "轮播图返回的不是数组:", res);
          swiperList.value = [];
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:113", "请求轮播图接口异常:", err);
        swiperList.value = [];
      }
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
    function onClear() {
      keyword.value = "";
    }
    const goDetail = (item) => {
      if (!item || !item.id) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:137", "无效的 item 对象", item);
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`
        // 使用 encodeURIComponent 进行编码
      });
    };
    const goAnnouncement = (item) => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:146", item);
      if (!item || !item.id) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:148", "无效的 item 对象", item);
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/detail/announcement?item=${encodeURIComponent(JSON.stringify(item))}`
        // 使用 encodeURIComponent 进行编码
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(onSearch),
        b: common_vendor.o(onClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          modelValue: keyword.value
        }),
        e: common_vendor.o(goAnnouncement),
        f: common_vendor.p({
          swiperList: swiperList.value
        }),
        g: common_vendor.o(onTabChange),
        h: common_vendor.p({
          list: themes.map((item) => ({
            name: item.name
          })),
          current: common_vendor.unref(currentTab),
          ["active-color"]: "#3c9cff"
        }),
        i: common_vendor.o(goDetail),
        j: common_vendor.o(($event) => common_vendor.isRef(flowList) ? flowList.value = $event : flowList = $event),
        k: common_vendor.p({
          modelValue: common_vendor.unref(flowList)
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
