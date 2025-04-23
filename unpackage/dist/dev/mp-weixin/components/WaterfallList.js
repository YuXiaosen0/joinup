"use strict";
const common_vendor = require("../common/vendor.js");
<<<<<<< HEAD
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const _sfc_main = {
  __name: "WaterfallList",
  props: {
    modelValue: Array,
    highlightKeyword: String
=======
if (!Array) {
  const _easycom_up_waterfall2 = common_vendor.resolveComponent("up-waterfall");
  _easycom_up_waterfall2();
}
const _easycom_up_waterfall = () => "../uni_modules/uview-plus/components/u-waterfall/u-waterfall.js";
if (!Math) {
  _easycom_up_waterfall();
}
const _sfc_main = {
  __name: "WaterfallList",
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
  },
  emits: ["update:modelValue", "itemClick"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const flowList = common_vendor.ref(props.modelValue);
<<<<<<< HEAD
    common_vendor.onMounted(() => {
    });
=======
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
    common_vendor.watch(() => props.modelValue, (newVal) => {
      flowList.value = newVal;
    });
    common_vendor.watch(flowList, (newVal) => {
      emit("update:modelValue", newVal);
    });
    const handleClick = (item) => {
      emit("itemClick", item);
    };
<<<<<<< HEAD
    const leftList = common_vendor.computed(
      () => flowList.value.filter((_, index) => index % 2 === 0)
    );
    const rightList = common_vendor.computed(
      () => flowList.value.filter((_, index) => index % 2 === 1)
    );
    const highlight = (text) => {
      if (!props.highlightKeyword || !text)
        return text || "";
      const regex = new RegExp(`(${props.highlightKeyword})`, "gi");
      return text.replace(regex, "<mark>$1</mark>");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(leftList.value, (item, index, i0) => {
          return {
            a: highlight(item.name),
            b: common_vendor.t(item.description),
            c: common_vendor.t(item.currentMembersCount),
            d: common_vendor.t(item.maxMembers),
            e: item.creatorAvatar || defaultAvatar,
            f: common_vendor.t(item.creatorUserName || "匿名用户"),
            g: item.id || `left-${index}`,
            h: common_vendor.o(($event) => handleClick(item), item.id || `left-${index}`)
          };
        }),
        b: common_vendor.f(rightList.value, (item, index, i0) => {
          return {
            a: highlight(item.name),
            b: common_vendor.t(item.description),
            c: common_vendor.t(item.currentMembersCount),
            d: common_vendor.t(item.maxMembers),
            e: item.creatorAvatar || defaultAvatar,
            f: common_vendor.t(item.creatorUserName || "匿名用户"),
            g: item.id || `right-${index}`,
            h: common_vendor.o(($event) => handleClick(item), item.id || `right-${index}`)
          };
=======
    return (_ctx, _cache) => {
      return {
        a: common_vendor.w(({
          leftList
        }, s0, i0) => {
          return {
            a: common_vendor.f(leftList, (item, index, i1) => {
              return {
                a: common_vendor.t(item.title),
                b: common_vendor.t(item.demand),
                c: index,
                d: common_vendor.o(($event) => handleClick(item), index)
              };
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "left",
          path: "a",
          vueId: "50bd2af7-0"
        }),
        b: common_vendor.w(({
          rightList
        }, s0, i0) => {
          return {
            a: common_vendor.f(rightList, (item, index, i1) => {
              return {
                a: common_vendor.t(item.title),
                b: common_vendor.t(item.demand),
                c: index,
                d: common_vendor.o(($event) => handleClick(item), index)
              };
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "right",
          path: "b",
          vueId: "50bd2af7-0"
        }),
        c: common_vendor.sr("uWaterfallRef", "50bd2af7-0"),
        d: common_vendor.o(($event) => flowList.value = $event),
        e: common_vendor.p({
          modelValue: flowList.value
>>>>>>> 9301907643163c2aa0a9299b7273cf6a1824f36f
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-50bd2af7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/WaterfallList.js.map
