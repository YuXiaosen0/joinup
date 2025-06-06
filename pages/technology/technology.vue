<template>
  <view class="container">
    <!-- 标题 -->
    <view class="header">
      <text class="title">兴趣分类</text>
      <text class="subtitle">点击分类节点展开/收起，点击叶子节点添加/删除兴趣</text>
    </view>

    <!-- 树状图可视化区域 -->
    <view class="tree-visualization">
      <canvas canvas-id="treeCanvas" class="tree-canvas" @touchstart="handleCanvasTouch"></canvas>
    </view>

    <!-- 操作按钮 -->
    <view class="action-bar">
      <button class="refresh-btn" @click="getInterest">刷新兴趣列表</button>
      <button class="reset-btn" @click="resetView">重置视图</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, nextTick } from "vue"
import { onLoad, onReady } from '@dcloudio/uni-app'
import { listAll, getMyInterest, addMyInterest, deleteMyInterest } from "../../api/api"

// 数据状态
const treeData = ref([])
const interestIds = ref(new Set())
const expandedKeys = ref(new Set())

// 树图配置
const config = {
  width: 0,
  height: 0,
  nodeRadius: 15,
  levelHeight: 60,
}

const NODE_COLORS = {
  default: '#666666',    // 默认颜色
  selected: '#1890ff',   // 已加入兴趣的颜色
  hover: '#40a9ff'       // 悬停颜色（可选）
}	

// 获取兴趣数据
const getInterest = async () => {
  try {
    const res = await getMyInterest()
    if (res) {
      //interestIds.value = new Set(res.map(item => item.id))
	  interestIds.value = new Set(res.map(item => Number(item.id)))
      renderTree() // 重新渲染树以更新选中状态
      uni.showToast({
        title: '兴趣列表已更新',
        icon: 'success'
      })
    } else {
      uni.showToast({
        title: res.msg || '获取兴趣失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error("兴趣查询失败:", error)
    uni.showToast({
      title: '获取兴趣失败',
      icon: 'none'
    })
  }
}

// 处理节点点击
const handleNodeClick = async (nodeId) => {
  // 查找对应的节点
  // const findNode = (nodes, id) => {
  //   for (const node of nodes) {
		// console.log(node)
		// console.log(node.id)
		// console.log(id)
		// if (id) {
		// 	console.log("???????????")
		// }
  //     if (node.id === id) {
		//   console.log("success!!!!")
		//   return node
	 //  } else {
		//   console.log("lose!!!")
	 //  }
  //     if (node.children) {
  //       const found = findNode(node.children, id)
  //       if (found) return found
  //     }
  //   }
  //   return null
  // }
  
  const findNode = (nodes, id) => {
    for (const node of nodes) {
      if (Number(node.id) === Number(id)) return node
      if (node.children) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }
  
  //console.log(treeData.value)
  //console.log(nodeId)
  const node = findNode(treeData.value, nodeId)
  //console.log(node)
  //console.log("11111")
  if (!node) return
  
  // 如果有子节点，则展开/收起
  if (node.children?.length) {
    toggleExpand(node)
    renderTree()
    return
  }
  
  // 如果是叶子节点，则添加/删除兴趣
  try {
	  console.log(nodeId)
	  console.log(interestIds)
	  console.log(interestIds.value)
    if (interestIds.value.has(Number(nodeId))) {
      const res = await deleteMyInterest(nodeId)
	  console.log(res)
	  interestIds.value.delete(nodeId)
	  
	  uni.showToast({
	    title: '已移除该兴趣',
	    icon: 'success'
	  })
	  
      // if (res) {
      //   interestIds.value.delete(nodeId)
      //   uni.showToast({
      //     title: '已移除兴趣',
      //     icon: 'success'
      //   })
      // } else {
      //   uni.showToast({
      //     title: res || '移除失败',
      //     icon: 'none'
      //   })
      // }
    } else {
      const res = await addMyInterest(nodeId)
	  console.log(res)
	  
	  interestIds.value.add(nodeId)
	  uni.showToast({
	    title: '已添加该兴趣',
	    icon: 'success'
	  })
	  
      // if (res) {
      //   interestIds.value.add(nodeId)
      //   uni.showToast({
      //     title: '已添加兴趣',
      //     icon: 'success'
      //   })
      // } else {
      //   uni.showToast({
      //     title: res || '添加失败',
      //     icon: 'none'
      //   })
      // }
    }
    renderTree() // 重新渲染以更新视觉效果
  } catch (error) {
    console.error("操作失败:", error)
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

// 查找树节点（确保在调用前定义）
const findNode = (nodes, id) => {
  for (const node of nodes) {
    if (Number(node.id) === Number(id)) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

// 关闭与当前节点同层的其他节点的展开状态
const collapseSiblings = (node) => {
  const parentNode = findNode(treeData.value, node.parentId)
  if (parentNode) {
    parentNode.children.forEach(sibling => {
      if (sibling.id !== node.id && expandedKeys.value.has(sibling.id)) {
        expandedKeys.value.delete(sibling.id) // 关闭其他兄弟节点的展开状态
      }
    })
  }
}

// 展开/折叠节点
const toggleExpand = (node) => {
	console.log("toggleExpand !!!")
  // 关闭同层其他节点的展开状态
  collapseSiblings(node)

  // 切换当前节点的展开状态
  expandedKeys.value.has(node.id)
    ? expandedKeys.value.delete(node.id)
    : expandedKeys.value.add(node.id)

  // 重新渲染树状图
  renderTree()
}

// 处理Canvas触摸事件
const handleCanvasTouch = (e) => {
  const x = e.touches[0].x
  const y = e.touches[0].y
  
  // 检测点击的是哪个节点
  const findTouchedNode = () => {
    for (const nodeId in nodePositions) {
      const pos = nodePositions[nodeId]
      const dx = pos.x - x
      const dy = pos.y - y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance <= config.nodeRadius) {
        return parseInt(nodeId)
      }
    }
    return null
  }
  
  const touchedNodeId = findTouchedNode()
  if (touchedNodeId) {
    handleNodeClick(touchedNodeId)
  }
}

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
  try {
    const res = await listAll()
	console.log(res)
    if (res) {
      treeData.value = buildTree(res)
	  console.log(treeData)
      if (treeData.value.length) {
        expandedKeys.value.add(treeData.value[0].id)
      }
      console.log(treeData)
      // 初始数据加载后渲染树
      nextTick(() => {
        renderTree()
      })
    } else {
      uni.showToast({
        title: res.msg || '获取分类失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error("获取分类失败:", error)
    uni.showToast({
      title: '获取分类失败',
      icon: 'none'
    })
  }
}

// 重置视图
const resetView = () => {
  // 展开所有一级节点
  expandedKeys.value.clear()
  treeData.value.forEach(node => {
    expandedKeys.value.add(node.id)
  })
  renderTree()
}

// 节点位置存储
const nodePositions = {}

// 渲染树 - 主要函数
const renderTree = () => {
	console.log("renderTree")
  const ctx = uni.createCanvasContext('treeCanvas')
  ctx.clearRect(0, 0, config.width, config.height)
  
  // 设置画布原点为中心
  const originX = config.width / 2
  const originY = 50
  
  // 计算可见节点
  const visibleNodes = getVisibleNodes(treeData.value)
  
  // 计算节点位置
  calculateNodePositions(visibleNodes, originX, originY)
  
  // 绘制连接线
  drawTreeConnections(ctx, visibleNodes)
  
  // 绘制节点
  drawTreeNodes(ctx, visibleNodes)
  
  ctx.draw()
}

// 获取可见节点
const getVisibleNodes = (nodes) => {
  const result = []
  
  const traverse = (nodes, parentId = null) => {
    nodes.forEach(node => {
      const newNode = { ...node, parentId }
      result.push(newNode)
      
      if (node.children && expandedKeys.value.has(node.id)) {
        traverse(node.children, node.id)
      }
    })
  }
  
  traverse(nodes)
  return result
}

// 计算节点位置
const calculateNodePositions = (nodes, centerX, startY) => {
  // 清空之前的位置
  Object.keys(nodePositions).forEach(key => delete nodePositions[key])
  
  // 按层级分组节点
  const levelNodes = {}
  nodes.forEach(node => {
    // 计算节点层级
    let level = 0
    let currentId = node.parentId
    while (currentId !== null) {
      level++
      currentId = nodes.find(n => n.id === currentId)?.parentId
    }
    
    if (!levelNodes[level]) levelNodes[level] = []
    levelNodes[level].push(node)
  })
  
  // 为每层分配垂直位置
  const levels = Object.keys(levelNodes).sort((a, b) => a - b)
  const maxNodesPerRow = 6 // 每行最多6个节点
  let currentY = startY
  
  levels.forEach((level, levelIndex) => {
    const nodesInLevel = levelNodes[level]
    
    // 计算该层需要多少行
    const rowsNeeded = Math.ceil(nodesInLevel.length / maxNodesPerRow)
    
    // 为该层的每一行分配节点
    for (let row = 0; row < rowsNeeded; row++) {
      const startIndex = row * maxNodesPerRow
      const endIndex = Math.min(startIndex + maxNodesPerRow, nodesInLevel.length)
      const nodesInRow = nodesInLevel.slice(startIndex, endIndex)
      
      // 计算该行的Y坐标
      const y = currentY + row * config.levelHeight
      
      // 计算水平间距
      const totalWidth = config.width * 0.8
      const spacing = totalWidth / (nodesInRow.length + 1)
      
      // 分配水平位置
      nodesInRow.forEach((node, i) => {
        const x = (i + 1) * spacing + (config.width - totalWidth) / 2
        nodePositions[node.id] = { x, y }
      })
    }
    
    // 更新下一层的起始Y坐标
    currentY += rowsNeeded * config.levelHeight
  })
}

// 绘制连接线
const drawTreeConnections = (ctx, nodes) => {
  ctx.beginPath()
  ctx.strokeStyle = '#aaa'
  ctx.lineWidth = 1
  
  nodes.forEach(node => {
    if (node.parentId !== null) {
      const childPos = nodePositions[node.id]
      const parentPos = nodePositions[node.parentId]
      
      if (childPos && parentPos) {
        ctx.moveTo(parentPos.x, parentPos.y + config.nodeRadius)
        ctx.bezierCurveTo(
          parentPos.x, parentPos.y + config.levelHeight / 2,
          childPos.x, childPos.y - config.levelHeight / 2,
          childPos.x, childPos.y - config.nodeRadius
        )
      }
    }
  })
  
  ctx.stroke()
}

// 绘制节点
const drawTreeNodes = (ctx, nodes) => {
  nodes.forEach(node => {
    const pos = nodePositions[node.id]
    if (!pos) return
    
    const isSelected = interestIds.value.has(Number(node.id))
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedKeys.value.has(Number(node.id))
    
    // 绘制节点圆形
    ctx.beginPath()
    ctx.fillStyle = isSelected ? '#8bc34a' : (hasChildren ? '#6c757d' : '#2196f3')
    ctx.arc(pos.x, pos.y, config.nodeRadius * 1.2, 0, Math.PI * 2)
    ctx.fill()
    
    // 绘制边框
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 绘制展开/折叠图标
    if (hasChildren) {
      ctx.fillStyle = '#fff'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(isExpanded ? '-' : '+', pos.x, pos.y)
    }
    
    // 绘制名称
    ctx.fillStyle = '#333'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(node.name, pos.x, pos.y + config.nodeRadius + 15)
    
    // 绘制选中标记
    if (!hasChildren && isSelected) {
		console.log("ffffff")
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(pos.x + config.nodeRadius - 5, pos.y - config.nodeRadius + 5, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

// 检测环境支持并设置Canvas大小
const setupCanvas = () => {
  uni.getSystemInfo({
    success: (res) => {
      config.width = res.windowWidth
      config.height = res.windowHeight - 120 // 减去头部和底部的高度
    }
  })
}

onLoad(() => {
  listAllInterest()
  getInterest()
})

onReady(() => {
  setupCanvas()
})
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
}

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

.tree-visualization {
  flex: 1;
  position: relative;
  background-color: #fff;
}

.tree-canvas {
  width: 100%;
  height: 100%;
}

.action-bar {
  padding: 15px;
  display: flex;
  gap: 10px;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.refresh-btn, .reset-btn {
  flex: 1;
  background-color: #2196f3;
  color: white;
  font-size: 14px;
  border-radius: 4px;
}

.reset-btn {
  background-color: #6c757d;
}
</style>