"use strict";
const common_vendor = require("../common/vendor.js");
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const defaultCover = "https://cdn-icons-png.flaticon.com/512/1055/1055687.png";
const _sfc_main = {
  __name: "WaterfallList",
  props: {
    modelValue: Array,
    highlightKeyword: String
  },
  emits: ["update:modelValue", "itemClick"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const flowList = common_vendor.ref(props.modelValue);
    common_vendor.onMounted(() => {
    });
    common_vendor.watch(() => props.modelValue, (newVal) => {
      flowList.value = newVal;
    });
    common_vendor.watch(flowList, (newVal) => {
      emit("update:modelValue", newVal);
    });
    const handleClick = (item) => {
      emit("itemClick", item);
    };
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
            a: item.cover || defaultCover,
            b: highlight(item.name),
            c: common_vendor.t(item.description),
            d: common_vendor.t(item.currentMembersCount),
            e: common_vendor.t(item.maxMembers),
            f: item.creatorAvatar || defaultAvatar,
            g: common_vendor.t(item.creatorUserName || "匿名用户"),
            h: item.id || `left-${index}`,
            i: common_vendor.o(($event) => handleClick(item), item.id || `left-${index}`)
          };
        }),
        b: common_vendor.f(rightList.value, (item, index, i0) => {
          return {
            a: item.cover || defaultCover,
            b: highlight(item.name),
            c: common_vendor.t(item.description),
            d: common_vendor.t(item.currentMembersCount),
            e: common_vendor.t(item.maxMembers),
            f: item.creatorAvatar ? item.creatorAvatar : defaultAvatar,
            g: common_vendor.t(item.creatorUserName || "匿名用户"),
            h: item.id || `right-${index}`,
            i: common_vendor.o(($event) => handleClick(item), item.id || `right-${index}`)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-50bd2af7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/WaterfallList.js.map
