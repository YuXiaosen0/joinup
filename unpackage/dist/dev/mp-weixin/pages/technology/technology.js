"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const _sfc_main = {
  __name: "technology",
  setup(__props) {
    const treeData = common_vendor.ref([]);
    const interestIds = common_vendor.ref(/* @__PURE__ */ new Set());
    const expandedKeys = common_vendor.ref(/* @__PURE__ */ new Set());
    const getInterest = async () => {
      try {
        const res = await api_api.getMyInterest();
        interestIds.value = new Set(res.map((item) => item.id));
        common_vendor.index.showToast({
          title: "兴趣列表已更新",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/technology/technology.vue:69", "兴趣查询失败:", error);
        common_vendor.index.showToast({
          title: "查询失败",
          icon: "error"
        });
      }
    };
    const handleItemClick = async (item) => {
      const isInterested = interestIds.value.has(item.id);
      common_vendor.index.showActionSheet({
        title: `操作: ${item.name}`,
        itemList: isInterested ? ["移除兴趣"] : ["添加兴趣"],
        success: async (res) => {
          try {
            if (isInterested) {
              await api_api.deleteMyInterest(item.id);
              interestIds.value.delete(item.id);
              common_vendor.index.showToast({
                title: "已移除",
                icon: "success"
              });
            } else {
              await api_api.addMyInterest(item.id);
              interestIds.value.add(item.id);
              common_vendor.index.showToast({
                title: "已添加",
                icon: "success"
              });
            }
          } catch (error) {
            common_vendor.index.showToast({
              title: "操作失败",
              icon: "error"
            });
          }
        }
      });
    };
    const toggleExpand = (item) => {
      expandedKeys.value.has(item.id) ? expandedKeys.value.delete(item.id) : expandedKeys.value.add(item.id);
    };
    const visibleTree = common_vendor.computed(() => {
      const result = [];
      const traverse = (nodes, level = 0, parentExpanded = true) => {
        nodes.forEach((node) => {
          var _a;
          const isExpanded = expandedKeys.value.has(node.id);
          if (level === 0 || parentExpanded) {
            result.push({
              ...node,
              level,
              expanded: isExpanded,
              isLeaf: !((_a = node.children) == null ? void 0 : _a.length)
            });
          }
          if (node.children && isExpanded) {
            traverse(node.children, level + 1, isExpanded);
          }
        });
      };
      traverse(treeData.value);
      return result;
    });
    const buildTree = (data) => {
      const map = {};
      const roots = [];
      data.forEach((item) => {
        map[item.id] = { ...item, children: [] };
      });
      data.forEach((item) => {
        var _a;
        item.parentId ? (_a = map[item.parentId]) == null ? void 0 : _a.children.push(map[item.id]) : roots.push(map[item.id]);
      });
      return roots;
    };
    const listAllInterest = async () => {
      const res = await api_api.listAll();
      treeData.value = buildTree(res);
      if (treeData.value.length) {
        expandedKeys.value.add(treeData.value[0].id);
      }
    };
    common_vendor.onLoad(() => {
      listAllInterest();
      getInterest();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(visibleTree.value, (item, k0, i0) => {
          var _a, _b;
          return common_vendor.e({
            a: (_a = item.children) == null ? void 0 : _a.length
          }, ((_b = item.children) == null ? void 0 : _b.length) ? {
            b: common_vendor.t(item.expanded ? "▼" : "▶"),
            c: common_vendor.o(($event) => toggleExpand(item), item.id)
          } : {}, {
            d: common_vendor.t(item.name),
            e: item.level > 0
          }, item.level > 0 ? {
            f: common_vendor.t(item.level)
          } : {}, {
            g: interestIds.value.has(item.id)
          }, interestIds.value.has(item.id) ? {} : {}, {
            h: common_vendor.o(($event) => item.isLeaf ? handleItemClick(item) : null, item.id),
            i: item.id,
            j: `${item.level * 20 + 15}px`,
            k: interestIds.value.has(item.id) ? 1 : ""
          });
        }),
        b: common_vendor.o(getInterest)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/technology/technology.js.map
