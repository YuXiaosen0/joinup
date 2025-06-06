"use strict";
const common_vendor = require("../../common/vendor.js");
const api_api = require("../../api/api.js");
const _sfc_main = {
  __name: "technology",
  setup(__props) {
    const treeData = common_vendor.ref([]);
    const interestIds = common_vendor.ref(/* @__PURE__ */ new Set());
    const expandedKeys = common_vendor.ref(/* @__PURE__ */ new Set());
    const config = {
      width: 0,
      height: 0,
      nodeRadius: 15,
      levelHeight: 60
    };
    const getInterest = async () => {
      try {
        const res = await api_api.getMyInterest();
        if (res) {
          interestIds.value = new Set(res.map((item) => Number(item.id)));
          renderTree();
          common_vendor.index.showToast({
            title: "兴趣列表已更新",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: res.msg || "获取兴趣失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/technology/technology.vue:65", "兴趣查询失败:", error);
        common_vendor.index.showToast({
          title: "获取兴趣失败",
          icon: "none"
        });
      }
    };
    const handleNodeClick = async (nodeId) => {
      var _a;
      const findNode2 = (nodes, id) => {
        for (const node2 of nodes) {
          if (Number(node2.id) === Number(id))
            return node2;
          if (node2.children) {
            const found = findNode2(node2.children, id);
            if (found)
              return found;
          }
        }
        return null;
      };
      const node = findNode2(treeData.value, nodeId);
      if (!node)
        return;
      if ((_a = node.children) == null ? void 0 : _a.length) {
        toggleExpand(node);
        renderTree();
        return;
      }
      try {
        common_vendor.index.__f__("log", "at pages/technology/technology.vue:125", nodeId);
        common_vendor.index.__f__("log", "at pages/technology/technology.vue:126", interestIds);
        common_vendor.index.__f__("log", "at pages/technology/technology.vue:127", interestIds.value);
        if (interestIds.value.has(Number(nodeId))) {
          const res = await api_api.deleteMyInterest(nodeId);
          common_vendor.index.__f__("log", "at pages/technology/technology.vue:130", res);
          interestIds.value.delete(nodeId);
          common_vendor.index.showToast({
            title: "已移除该兴趣",
            icon: "success"
          });
        } else {
          const res = await api_api.addMyInterest(nodeId);
          common_vendor.index.__f__("log", "at pages/technology/technology.vue:152", res);
          interestIds.value.add(nodeId);
          common_vendor.index.showToast({
            title: "已添加该兴趣",
            icon: "success"
          });
        }
        renderTree();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/technology/technology.vue:175", "操作失败:", error);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    };
    const findNode = (nodes, id) => {
      for (const node of nodes) {
        if (Number(node.id) === Number(id))
          return node;
        if (node.children) {
          const found = findNode(node.children, id);
          if (found)
            return found;
        }
      }
      return null;
    };
    const collapseSiblings = (node) => {
      const parentNode = findNode(treeData.value, node.parentId);
      if (parentNode) {
        parentNode.children.forEach((sibling) => {
          if (sibling.id !== node.id && expandedKeys.value.has(sibling.id)) {
            expandedKeys.value.delete(sibling.id);
          }
        });
      }
    };
    const toggleExpand = (node) => {
      common_vendor.index.__f__("log", "at pages/technology/technology.vue:209", "toggleExpand !!!");
      collapseSiblings(node);
      expandedKeys.value.has(node.id) ? expandedKeys.value.delete(node.id) : expandedKeys.value.add(node.id);
      renderTree();
    };
    const handleCanvasTouch = (e) => {
      const x = e.touches[0].x;
      const y = e.touches[0].y;
      const findTouchedNode = () => {
        for (const nodeId in nodePositions) {
          const pos = nodePositions[nodeId];
          const dx = pos.x - x;
          const dy = pos.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= config.nodeRadius) {
            return parseInt(nodeId);
          }
        }
        return null;
      };
      const touchedNodeId = findTouchedNode();
      if (touchedNodeId) {
        handleNodeClick(touchedNodeId);
      }
    };
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
      try {
        const res = await api_api.listAll();
        common_vendor.index.__f__("log", "at pages/technology/technology.vue:270", res);
        if (res) {
          treeData.value = buildTree(res);
          common_vendor.index.__f__("log", "at pages/technology/technology.vue:273", treeData);
          if (treeData.value.length) {
            expandedKeys.value.add(treeData.value[0].id);
          }
          common_vendor.index.__f__("log", "at pages/technology/technology.vue:277", treeData);
          common_vendor.nextTick$1(() => {
            renderTree();
          });
        } else {
          common_vendor.index.showToast({
            title: res.msg || "获取分类失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/technology/technology.vue:289", "获取分类失败:", error);
        common_vendor.index.showToast({
          title: "获取分类失败",
          icon: "none"
        });
      }
    };
    const resetView = () => {
      expandedKeys.value.clear();
      treeData.value.forEach((node) => {
        expandedKeys.value.add(node.id);
      });
      renderTree();
    };
    const nodePositions = {};
    const renderTree = () => {
      common_vendor.index.__f__("log", "at pages/technology/technology.vue:312", "renderTree");
      const ctx = common_vendor.index.createCanvasContext("treeCanvas");
      ctx.clearRect(0, 0, config.width, config.height);
      const originX = config.width / 2;
      const originY = 50;
      const visibleNodes = getVisibleNodes(treeData.value);
      calculateNodePositions(visibleNodes, originX, originY);
      drawTreeConnections(ctx, visibleNodes);
      drawTreeNodes(ctx, visibleNodes);
      ctx.draw();
    };
    const getVisibleNodes = (nodes) => {
      const result = [];
      const traverse = (nodes2, parentId = null) => {
        nodes2.forEach((node) => {
          const newNode = { ...node, parentId };
          result.push(newNode);
          if (node.children && expandedKeys.value.has(node.id)) {
            traverse(node.children, node.id);
          }
        });
      };
      traverse(nodes);
      return result;
    };
    const calculateNodePositions = (nodes, centerX, startY) => {
      Object.keys(nodePositions).forEach((key) => delete nodePositions[key]);
      const levelNodes = {};
      nodes.forEach((node) => {
        var _a;
        let level = 0;
        let currentId = node.parentId;
        while (currentId !== null) {
          level++;
          currentId = (_a = nodes.find((n) => n.id === currentId)) == null ? void 0 : _a.parentId;
        }
        if (!levelNodes[level])
          levelNodes[level] = [];
        levelNodes[level].push(node);
      });
      const levels = Object.keys(levelNodes).sort((a, b) => a - b);
      const maxNodesPerRow = 6;
      let currentY = startY;
      levels.forEach((level, levelIndex) => {
        const nodesInLevel = levelNodes[level];
        const rowsNeeded = Math.ceil(nodesInLevel.length / maxNodesPerRow);
        for (let row = 0; row < rowsNeeded; row++) {
          const startIndex = row * maxNodesPerRow;
          const endIndex = Math.min(startIndex + maxNodesPerRow, nodesInLevel.length);
          const nodesInRow = nodesInLevel.slice(startIndex, endIndex);
          const y = currentY + row * config.levelHeight;
          const totalWidth = config.width * 0.8;
          const spacing = totalWidth / (nodesInRow.length + 1);
          nodesInRow.forEach((node, i) => {
            const x = (i + 1) * spacing + (config.width - totalWidth) / 2;
            nodePositions[node.id] = { x, y };
          });
        }
        currentY += rowsNeeded * config.levelHeight;
      });
    };
    const drawTreeConnections = (ctx, nodes) => {
      ctx.beginPath();
      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 1;
      nodes.forEach((node) => {
        if (node.parentId !== null) {
          const childPos = nodePositions[node.id];
          const parentPos = nodePositions[node.parentId];
          if (childPos && parentPos) {
            ctx.moveTo(parentPos.x, parentPos.y + config.nodeRadius);
            ctx.bezierCurveTo(
              parentPos.x,
              parentPos.y + config.levelHeight / 2,
              childPos.x,
              childPos.y - config.levelHeight / 2,
              childPos.x,
              childPos.y - config.nodeRadius
            );
          }
        }
      });
      ctx.stroke();
    };
    const drawTreeNodes = (ctx, nodes) => {
      nodes.forEach((node) => {
        const pos = nodePositions[node.id];
        if (!pos)
          return;
        const isSelected = interestIds.value.has(Number(node.id));
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedKeys.value.has(Number(node.id));
        ctx.beginPath();
        ctx.fillStyle = isSelected ? "#8bc34a" : hasChildren ? "#6c757d" : "#2196f3";
        ctx.arc(pos.x, pos.y, config.nodeRadius * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        if (hasChildren) {
          ctx.fillStyle = "#fff";
          ctx.font = "12px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(isExpanded ? "-" : "+", pos.x, pos.y);
        }
        ctx.fillStyle = "#333";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.name, pos.x, pos.y + config.nodeRadius + 15);
        if (!hasChildren && isSelected) {
          common_vendor.index.__f__("log", "at pages/technology/technology.vue:473", "ffffff");
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(pos.x + config.nodeRadius - 5, pos.y - config.nodeRadius + 5, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };
    const setupCanvas = () => {
      common_vendor.index.getSystemInfo({
        success: (res) => {
          config.width = res.windowWidth;
          config.height = res.windowHeight - 120;
        }
      });
    };
    common_vendor.onLoad(() => {
      listAllInterest();
      getInterest();
    });
    common_vendor.onReady(() => {
      setupCanvas();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleCanvasTouch),
        b: common_vendor.o(getInterest),
        c: common_vendor.o(resetView)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/technology/technology.js.map
