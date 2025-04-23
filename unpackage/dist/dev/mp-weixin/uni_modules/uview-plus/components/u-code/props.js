"use strict";
const uni_modules_uviewPlus_libs_vue = require("../../libs/vue.js");
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = uni_modules_uviewPlus_libs_vue.defineMixin({
  props: {
    // 倒计时总秒数
    seconds: {
      type: [String, Number],
      default: () => uni_modules_uviewPlus_libs_config_props.props.code.seconds
    },
    // 尚未开始时提示
    startText: {
      type: String,
      default: () => uni_modules_uviewPlus_libs_config_props.props.code.startText
    },
    // 正在倒计时中的提示
    changeText: {
      type: String,
      default: () => uni_modules_uviewPlus_libs_config_props.props.code.changeText
    },
    // 倒计时结束时的提示
    endText: {
      type: String,
      default: () => uni_modules_uviewPlus_libs_config_props.props.code.endText
    },
    // 是否在H5刷新或各端返回再进入时继续倒计时
    keepRunning: {
      type: Boolean,
      default: () => uni_modules_uviewPlus_libs_config_props.props.code.keepRunning
    },
    // 为了区分多个页面，或者一个页面多个倒计时组件本地存储的继续倒计时变了
    uniqueKey: {
      type: String,
      default: () => uni_modules_uviewPlus_libs_config_props.props.code.uniqueKey
    }
  }
});
exports.props = props;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uview-plus/components/u-code/props.js.map
