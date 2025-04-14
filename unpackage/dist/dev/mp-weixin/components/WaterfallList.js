"use strict";
const common_vendor = require("../common/vendor.js");
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
  },
  emits: ["update:modelValue", "itemClick"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const flowList = common_vendor.ref(props.modelValue);
    common_vendor.watch(() => props.modelValue, (newVal) => {
      flowList.value = newVal;
    });
    common_vendor.watch(flowList, (newVal) => {
      emit("update:modelValue", newVal);
    });
    const handleClick = (item) => {
      emit("itemClick", item);
    };
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
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-50bd2af7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/WaterfallList.js.map
