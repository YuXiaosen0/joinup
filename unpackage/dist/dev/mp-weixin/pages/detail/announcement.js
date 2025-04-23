"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const _sfc_main = {
  __name: "announcement",
  setup(__props) {
    const announcementDetails = common_vendor.ref(null);
    common_vendor.ref(true);
    common_vendor.onLoad(async (opt) => {
      try {
        let item = opt.item;
        if (!item)
          return;
        item = JSON.parse(decodeURIComponent(item));
        if (item && item.id) {
          const res = await api_api.getAnnouncementDetails(item.id);
          if (res) {
            announcementDetails.value = res;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/announcement.vue:55", "获取公告详情失败：", error);
        announcementDetails.value = null;
        emit("loadError", error);
      }
    });
    const formattedCreateTime = common_vendor.computed(() => {
      if (!announcementDetails.value || !announcementDetails.value.createTime)
        return "";
      const date = new Date(announcementDetails.value.createTime);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    });
    return (_ctx, _cache) => {
      return {
        a: announcementDetails.value.cover,
        b: common_vendor.t(announcementDetails.value.title),
        c: announcementDetails.value.posterAvatar,
        d: common_vendor.t(announcementDetails.value.posterUsername),
        e: common_vendor.t(formattedCreateTime.value),
        f: common_vendor.t(announcementDetails.value.content)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/announcement.js.map
