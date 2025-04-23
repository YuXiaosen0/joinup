"use strict";
const common_vendor = require("../common/vendor.js");
if (!Array) {
  const _easycom_up_search2 = common_vendor.resolveComponent("up-search");
  _easycom_up_search2();
}
const _easycom_up_search = () => "../uni_modules/uview-plus/components/u-search/u-search.js";
if (!Math) {
  _easycom_up_search();
}
const _sfc_main = {
  __name: "SearchBar",
  props: {
    modelValue: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue", "search", "clear"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const searchValue = common_vendor.ref(props.modelValue);
    common_vendor.watch(searchValue, (newVal) => {
      emit("update:modelValue", newVal);
    });
    function handleSearch() {
<<<<<<< HEAD
      common_vendor.index.__f__("log", "at components/SearchBar.vue:40", "[SearchBar] 触发搜索：", searchValue.value);
      if (!searchValue.value.trim()) {
        common_vendor.index.showToast({ title: "请输入关键字", icon: "none" });
        return;
      }
      emit("search", searchValue.value);
    }
    function handleClear() {
      searchValue.value = "";
      emit("update:modelValue", "");
=======
      emit("search", searchValue.value);
    }
    function handleClear() {
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
      emit("clear");
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleSearch),
<<<<<<< HEAD
        b: common_vendor.o(handleSearch),
        c: common_vendor.o(handleClear),
        d: common_vendor.o(($event) => searchValue.value = $event),
        e: common_vendor.p({
          placeholder: "搜索组队信息",
          ["bg-color"]: "#e3e3e3",
          shape: "round",
          ["show-action"]: false,
          modelValue: searchValue.value
        }),
        f: common_vendor.o(handleSearch)
=======
        b: common_vendor.o(handleClear),
        c: common_vendor.o(($event) => searchValue.value = $event),
        d: common_vendor.p({
          placeholder: "搜索组队信息",
          ["bg-color"]: "#e3e3e3",
          modelValue: searchValue.value
        })
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2334f7bd"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/SearchBar.js.map
