"use strict";
const common_vendor = require("../common/vendor.js");
const api_api = require("../api/api.js");
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_input2 + _easycom_u_popup2)();
}
const _easycom_u_input = () => "../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_popup = () => "../uni_modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_input + _easycom_u_popup)();
}
const _sfc_main = {
  __name: "applyToJoinDialog",
  props: {
    show: Boolean,
    // 控制弹窗显示
    teamId: String
    // 从父组件接收 teamId
  },
  emits: ["update:show"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const inputValue = common_vendor.ref("");
    const closeDialog = () => {
      emit("update:show", false);
    };
    const cancel = () => {
      closeDialog();
    };
    const submitJoin = async () => {
      var _a;
      try {
        const teamId = props.teamId;
        const reason = (_a = inputValue.value) == null ? void 0 : _a.trim();
        if (!teamId) {
          common_vendor.index.showToast({ title: "团队信息丢失，请稍后再试", icon: "none" });
          return;
        }
        if (!reason) {
          common_vendor.index.showToast({ title: "请输入加入理由", icon: "none" });
          return;
        }
        common_vendor.index.showLoading({ title: "提交中..." });
        await api_api.applyToJoin(teamId, reason);
        common_vendor.index.showToast({ title: "申请成功，等待审核", icon: "success" });
        closeDialog();
      } catch (error) {
        common_vendor.index.__f__("error", "at components/applyToJoinDialog.vue:57", "申请失败", error);
        common_vendor.index.showToast({ title: "申请失败，请稍后重试", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => inputValue.value = $event),
        b: common_vendor.p({
          placeholder: "写点你的加入意愿吧~",
          type: "textarea",
          height: "120",
          modelValue: inputValue.value
        }),
        c: common_vendor.o(cancel),
        d: common_vendor.o(submitJoin),
        e: common_vendor.o(closeDialog),
        f: common_vendor.p({
          show: __props.show,
          mode: "center",
          mask: true,
          ["show-close"]: true
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7f2ae6c7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/applyToJoinDialog.js.map
