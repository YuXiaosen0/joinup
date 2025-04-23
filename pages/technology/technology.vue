<template>
  <view class="container">
    <!-- 标题 -->
    <view class="header">
      <text class="title">兴趣分类</text>
      <text class="subtitle">点击叶子节点可添加/删除兴趣</text>
    </view>

    <!-- 兴趣树列表 -->
    <scroll-view scroll-y class="tree-container">
      <view 
        v-for="item in visibleTree" 
        :key="item.id" 
        class="list-item"
        :style="{ paddingLeft: `${item.level * 20 + 15}px` }"
        :class="{ 'active': interestIds.has(item.id) }"
      >
        <!-- 展开/折叠图标 -->
        <text 
          v-if="item.children?.length"
          class="expand-icon"
          @click.stop="toggleExpand(item)"
        >
          {{ item.expanded ? '▼' : '▶' }}
        </text>
        <text v-else class="expand-placeholder"></text>
        
        <!-- 节点内容 -->
        <view 
          class="item-content"
          @click="item.isLeaf ? handleItemClick(item) : null"
        >
          <text class="item-text">{{ item.name }}</text>
          <view class="badges">
            <text v-if="item.level > 0" class="level-badge">L{{ item.level }}</text>
            <text v-if="interestIds.has(item.id)" class="selected-badge">已选</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 操作按钮 -->
    <view class="action-bar">
      <button class="refresh-btn" @click="getInterest">刷新兴趣列表</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue"
import { onLoad } from '@dcloudio/uni-app'
import { listAll, getMyInterest, addMyInterest, deleteMyInterest } from "../../api/api"

// 原始数据
const treeData = ref([])
const interestIds = ref(new Set())
const expandedKeys = ref(new Set())

// 获取兴趣数据
const getInterest = async () => {
  try {
    const res = await getMyInterest()
    interestIds.value = new Set(res.map(item => item.id))
    uni.showToast({
      title: '兴趣列表已更新',
      icon: 'success'
    })
  } catch (error) {
    console.error("兴趣查询失败:", error)
    uni.showToast({
      title: '查询失败',
      icon: 'error'
    })
  }
}

// 处理节点点击
const handleItemClick = async (item) => {
  const isInterested = interestIds.value.has(item.id)
  
  uni.showActionSheet({
    title: `操作: ${item.name}`,
    itemList: isInterested ? ['移除兴趣'] : ['添加兴趣'],
    success: async (res) => {
      try {
        if (isInterested) {
          await deleteMyInterest(item.id)
          interestIds.value.delete(item.id)
          uni.showToast({
            title: '已移除',
            icon: 'success'
          })
        } else {
          await addMyInterest(item.id)
          interestIds.value.add(item.id)
          uni.showToast({
            title: '已添加',
            icon: 'success'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '操作失败',
          icon: 'error'
        })
      }
    }
  })
}

// 展开/折叠节点
const toggleExpand = (item) => {
  expandedKeys.value.has(item.id) 
    ? expandedKeys.value.delete(item.id)
    : expandedKeys.value.add(item.id)
}

// 构建可见树
const visibleTree = computed(() => {
  const result = []
  const traverse = (nodes, level = 0, parentExpanded = true) => {
    nodes.forEach(node => {
      const isExpanded = expandedKeys.value.has(node.id)
      if (level === 0 || parentExpanded) {
        result.push({ 
          ...node, 
          level,
          expanded: isExpanded,
          isLeaf: !node.children?.length
        })
      }
      if (node.children && isExpanded) {
        traverse(node.children, level + 1, isExpanded)
      }
    })
  }
  traverse(treeData.value)
  return result
})

// 构建树形结构
const buildTree = (data) => {
  const map = {}
  const roots = []
  
  data.forEach(item => {
    map[item.id] = { ...item, children: [] }
  })
  
  data.forEach(item => {
    item.parentId 
      ? map[item.parentId]?.children.push(map[item.id])
      : roots.push(map[item.id])
  })
  
  return roots
}

// 初始化数据
const listAllInterest = async () => {
  const res = await listAll()
  treeData.value = buildTree(res)
  if (treeData.value.length) {
    expandedKeys.value.add(treeData.value[0].id)
  }
}

onLoad(() => {
  listAllInterest()
  getInterest()
})
</script>

<style>
/* 基础样式 */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
  padding: 0;
}

/* 头部样式 */
.header {
  padding: 20px 16px 10px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: block;
}

.subtitle {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  display: block;
}

/* 树容器 */
.tree-container {
  flex: 1;
  padding: 8px 0;
  background-color: #fff;
}

/* 列表项样式 */
.list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  transition: all 0.2s;
  border-left: 4px solid transparent;
}

.list-item.active {
  background-color: #f0f7ff;
  border-left-color: #1890ff;
}

.list-item:active {
  background-color: #e6f7ff;
}

/* 展开图标 */
.expand-icon {
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  color: #666;
  margin-right: 8px;
  font-size: 12px;
}

.expand-placeholder {
  width: 24px;
}

/* 内容区域 */
.item-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-text {
  font-size: 15px;
  color: #333;
}

/* 徽章样式 */
.badges {
  display: flex;
  gap: 6px;
}

.level-badge {
  font-size: 10px;
  padding: 2px 6px;
  background-color: #f0f0f0;
  color: #666;
  border-radius: 10px;
}

.selected-badge {
  font-size: 10px;
  padding: 2px 6px;
  background-color: #1890ff;
  color: white;
  border-radius: 10px;
}

/* 操作栏 */
.action-bar {
  padding: 12px 16px;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.refresh-btn {
  background-color: #1890ff;
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

/* 层级指示器 */
.list-item[style*="padding-left: 15px"] {
  background-color: #f9f9f9;
}

.list-item[style*="padding-left: 35px"] {
  background-color: #fcfcfc;
}
</style>