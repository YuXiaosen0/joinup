"use strict";
const common_vendor = require("../common/vendor.js");
if (!Array) {
  const _easycom_up_swiper2 = common_vendor.resolveComponent("up-swiper");
  _easycom_up_swiper2();
}
const _easycom_up_swiper = () => "../uni_modules/uview-plus/components/u-swiper/u-swiper.js";
if (!Math) {
  _easycom_up_swiper();
}
const _sfc_main = {
  __name: "SwiperBanner",
  props: {
    swiperList: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue", "itemClick"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleClick = (item) => {
      emit("itemClick", item);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.swiperList, (item, index, i0) => {
          return {
            a: index,
            b: common_vendor.o(($event) => handleClick(item), index),
            c: "b9a16aa3-0-" + i0,
            d: common_vendor.p({
              list: [item],
              keyName: "image",
              showTitle: "",
              radius: "8",
              autoplay: true,
              height: "160"
            }),
            e: index
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b9a16aa3"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/SwiperBanner.js.map
