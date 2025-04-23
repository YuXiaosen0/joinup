"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
if (!Array) {
<<<<<<< HEAD
  const _easycom_up_tabs2 = common_vendor.resolveComponent("up-tabs");
  const _easycom_up_sticky2 = common_vendor.resolveComponent("up-sticky");
  (_easycom_up_tabs2 + _easycom_up_sticky2)();
}
const _easycom_up_tabs = () => "../../uni_modules/uview-plus/components/u-tabs/u-tabs.js";
const _easycom_up_sticky = () => "../../uni_modules/uview-plus/components/u-sticky/u-sticky.js";
if (!Math) {
  (SearchBar + SwiperBanner + _easycom_up_tabs + _easycom_up_sticky + WaterfallList)();
}
const WaterfallList = () => "../../components/WaterfallList.js";
const SearchBar = () => "../../components/SearchBar.js";
const SwiperBanner = () => "../../components/SwiperBanner.js";
=======
  const _easycom_up_swiper2 = common_vendor.resolveComponent("up-swiper");
  const _easycom_up_tabs2 = common_vendor.resolveComponent("up-tabs");
  const _easycom_up_sticky2 = common_vendor.resolveComponent("up-sticky");
  (_easycom_up_swiper2 + _easycom_up_tabs2 + _easycom_up_sticky2)();
}
const _easycom_up_swiper = () => "../../uni_modules/uview-plus/components/u-swiper/u-swiper.js";
const _easycom_up_tabs = () => "../../uni_modules/uview-plus/components/u-tabs/u-tabs.js";
const _easycom_up_sticky = () => "../../uni_modules/uview-plus/components/u-sticky/u-sticky.js";
if (!Math) {
  (SearchBar + _easycom_up_swiper + _easycom_up_tabs + _easycom_up_sticky + WaterfallList)();
}
const WaterfallList = () => "../../components/WaterfallList.js";
const SearchBar = () => "../../components/SearchBar.js";
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const keyword = common_vendor.ref("");
<<<<<<< HEAD
    const themes = common_vendor.reactive([]);
    const swiperList = common_vendor.ref([]);
    let currentTab = common_vendor.ref(0);
    let flowList = common_vendor.ref([]);
    common_vendor.onShow(() => {
      var _a;
      fetchSwiperList();
      fetchThemes();
      loadList((_a = themes[currentTab.value]) == null ? void 0 : _a.id);
    });
    common_vendor.onMounted(() => {
      var _a;
      fetchSwiperList();
      fetchThemes();
      loadList((_a = themes[currentTab.value]) == null ? void 0 : _a.id);
    });
    function onTabChange(index) {
      currentTab.value = index.index;
      const themeId = themes[currentTab.value].id;
      loadList(themeId);
    }
    function loadList(themeId) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:62", "当前 themeId:", themeId);
      api_api.getTeamList(themeId).then((res) => {
        if (res && res.list) {
          flowList.value = res.list || [];
        } else {
          common_vendor.index.__f__("error", "at pages/index/index.vue:67", "接口返回数据结构不正确:", res);
          flowList.value = [];
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/index/index.vue:71", "API 请求失败:", error);
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
        common_vendor.index.__f__("error", "at pages/index/index.vue:91", "获取主题列表失败:", error);
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
          common_vendor.index.__f__("warn", "at pages/index/index.vue:107", "轮播图返回的不是数组:", res);
          swiperList.value = [];
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:111", "请求轮播图接口异常:", err);
        swiperList.value = [];
      }
    };
=======
    const swiperList = common_vendor.ref([]);
    const categories = common_vendor.reactive([
      { name: "课程" },
      { name: "旅游" },
      { name: "游戏" }
    ]);
    let currentTab = common_vendor.ref(0);
    let flowList = common_vendor.ref([]);
    function onTabChange(index) {
      currentTab.value = index.index;
      loadList();
    }
    common_vendor.onMounted(() => {
      loadList();
      initSwiper();
    });
    function initSwiper() {
      swiperList.value = [
        // { image: 'https://survey-planet-test.oss-cn-beijing.aliyuncs.com/9ec3b3d8670e11a01fbc7d586f3433f.png' },
        // { image: 'https://survey-planet-test.oss-cn-beijing.aliyuncs.com/9ec3b3d8670e11a01fbc7d586f3433f.png' },
        // { image: 'https://survey-planet-test.oss-cn-beijing.aliyuncs.com/9ec3b3d8670e11a01fbc7d586f3433f.png' }
      ];
    }
    function loadList() {
      api_api.getIndexList().then((res) => {
        common_vendor.index.__f__("log", "at pages/index/index.vue:70", res);
        flowList.value = [res];
      });
    }
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
    function onSearch(value) {
      if (!value.trim()) {
        common_vendor.index.showToast({ title: "请输入关键字", icon: "none" });
        return;
      }
<<<<<<< HEAD
      common_vendor.index.navigateTo({
        url: `/pages/detail/searchResult?keyword=${encodeURIComponent(value)}`
=======
      api_api.searchList({ keyword: value, category: categories[currentTab.value].name }).then((res) => {
        flowList.value = [res];
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
      });
    }
    function onClear() {
      keyword.value = "";
<<<<<<< HEAD
    }
    const goDetail = (item) => {
      if (!item || !item.id) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:135", "无效的 item 对象", item);
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`
        // 使用 encodeURIComponent 进行编码
      });
    };
    const goAnnouncement = (item) => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:144", item);
      if (!item || !item.id) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:146", "无效的 item 对象", item);
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/detail/announcement?item=${encodeURIComponent(JSON.stringify(item))}`
        // 使用 encodeURIComponent 进行编码
      });
    };
    return (_ctx, _cache) => {
      var _a;
=======
      loadList();
    }
    const goDetail = (item) => {
      const can = JSON.stringify(item);
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?item=${encodeURIComponent(can)}`
      });
    };
    return (_ctx, _cache) => {
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
      return common_vendor.e({
        a: common_vendor.o(onSearch),
        b: common_vendor.o(onClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          modelValue: keyword.value
        }),
<<<<<<< HEAD
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
        i: common_vendor.p({
          bgColor: "#fff"
        }),
        j: themes.length
      }, themes.length ? {
        k: common_vendor.t(((_a = themes[common_vendor.unref(currentTab)]) == null ? void 0 : _a.description) || "暂无描述")
      } : {}, {
        l: common_vendor.o(goDetail),
        m: common_vendor.o(($event) => common_vendor.isRef(flowList) ? flowList.value = $event : flowList = $event),
        n: common_vendor.p({
          modelValue: common_vendor.unref(flowList)
        })
=======
        e: common_vendor.p({
          list: swiperList.value,
          keyName: "image",
          radius: "8",
          autoplay: true,
          height: "160"
        }),
        f: common_vendor.o(onTabChange),
        g: common_vendor.p({
          list: categories,
          current: common_vendor.unref(currentTab),
          ["active-color"]: "#3c9cff"
        }),
        h: common_vendor.p({
          bgColor: "#fff"
        }),
        i: common_vendor.unref(currentTab) === 0
      }, common_vendor.unref(currentTab) === 0 ? {
        j: common_vendor.o(goDetail),
        k: common_vendor.o(($event) => common_vendor.isRef(flowList) ? flowList.value = $event : flowList = $event),
        l: common_vendor.p({
          modelValue: common_vendor.unref(flowList)
        })
      } : common_vendor.unref(currentTab) === 1 ? {} : common_vendor.unref(currentTab) === 2 ? {} : {}, {
        m: common_vendor.unref(currentTab) === 1,
        n: common_vendor.unref(currentTab) === 2
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
