"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
if (!Array) {
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
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const keyword = common_vendor.ref("");
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
    function onSearch(value) {
      if (!value.trim()) {
        common_vendor.index.showToast({ title: "请输入关键字", icon: "none" });
        return;
      }
      api_api.searchList({ keyword: value, category: categories[currentTab.value].name }).then((res) => {
        flowList.value = [res];
      });
    }
    function onClear() {
      keyword.value = "";
      loadList();
    }
    const goDetail = (item) => {
      const can = JSON.stringify(item);
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?item=${encodeURIComponent(can)}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onSearch),
        b: common_vendor.o(onClear),
        c: common_vendor.o(($event) => keyword.value = $event),
        d: common_vendor.p({
          modelValue: keyword.value
        }),
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
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
