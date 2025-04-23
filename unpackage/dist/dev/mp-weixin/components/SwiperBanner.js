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
    const props = __props;
    const handleClick = (index) => {
      const item = props.swiperList[index];
      if (!item || !item.id) {
        common_vendor.index.__f__("error", "at components/SwiperBanner.vue:40", "无效的 item 对象", item);
        return;
      }
      emit("itemClick", item);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.swiperList.length === 0
      }, __props.swiperList.length === 0 ? {} : {}, {
        b: __props.swiperList.length > 0
      }, __props.swiperList.length > 0 ? {
        c: common_vendor.o(handleClick),
        d: common_vendor.p({
          list: __props.swiperList,
          keyName: "image",
          showTitle: true,
          radius: "8",
          autoplay: true,
          height: "160"
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b9a16aa3"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/SwiperBanner.js.map
