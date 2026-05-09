<template>
  <div class="neural-network" ref="networkRef">
    <svg class="network-svg" ref="svgRef">
      <defs>
        <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8b5cf6" />
          <stop offset="50%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#ec4899" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g ref="connectionsRef" class="connections"></g>
      <g ref="nodesRef" class="nodes"></g>
    </svg>
    <div class="network-stats" ref="statsRef">
      <div class="stat-item">
        <span class="stat-label">节点</span>
        <span class="stat-value">{{ nodeCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">连接</span>
        <span class="stat-value">{{ connectionCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">激活</span>
        <span class="stat-value">{{ activeCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'

interface Node {
  id: number
  x: number
  y: number
  layer: number
  active: boolean
}

interface Connection {
  from: Node
  to: Node
  active: boolean
}

interface Props {
  layers?: number[]
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  layers: () => [4, 6, 8, 6, 4],
  width: 600,
  height: 400
})

const networkRef = ref<HTMLElement>()
const svgRef = ref<SVGSVGElement>()
const connectionsRef = ref<SVGGElement>()
const nodesRef = ref<SVGGElement>()
const statsRef = ref<HTMLElement>()
const nodes = ref<Node[]>([])
const connections = ref<Connection[]>([])
let ctx: gsap.Context
let signalInterval: number

const nodeCount = computed(() => nodes.value.length)
const connectionCount = computed(() => connections.value.length)
const activeCount = computed(() => nodes.value.filter(n => n.active).length)

// 初始化网络
const initNetwork = () => {
  const svg = svgRef.value!
  svg.setAttribute('width', props.width.toString())
  svg.setAttribute('height', props.height.toString())

  nodes.value = []
  const layerCount = props.layers.length
  const layerSpacing = props.width / (layerCount + 1)

  // 创建节点
  let nodeId = 0
  props.layers.forEach((nodeCount, layerIndex) => {
    const nodeSpacing = props.height / (nodeCount + 1)
    for (let i = 0; i < nodeCount; i++) {
      nodes.value.push({
        id: nodeId++,
        x: layerSpacing * (layerIndex + 1),
        y: nodeSpacing * (i + 1),
        layer: layerIndex,
        active: false
      })
    }
  })

  // 创建连接
  connections.value = []
  for (let i = 0; i < nodes.value.length; i++) {
    const node = nodes.value[i]
    if (node.layer < layerCount - 1) {
      const nextLayerNodes = nodes.value.filter(n => n.layer === node.layer + 1)
      nextLayerNodes.forEach(nextNode => {
        connections.value.push({
          from: node,
          to: nextNode,
          active: false
        })
      })
    }
  }

  renderNetwork()
}

// 渲染网络
const renderNetwork = () => {
  const connectionsGroup = connectionsRef.value!
  const nodesGroup = nodesRef.value!

  // 清空现有元素
  connectionsGroup.innerHTML = ''
  nodesGroup.innerHTML = ''

  // 渲染连接
  connections.value.forEach((conn, index) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', conn.from.x.toString())
    line.setAttribute('y1', conn.from.y.toString())
    line.setAttribute('x2', conn.to.x.toString())
    line.setAttribute('y2', conn.to.y.toString())
    line.setAttribute('stroke', 'url(#neural-gradient)')
    line.setAttribute('stroke-width', '1')
    line.setAttribute('stroke-opacity', '0.3')
    line.setAttribute('filter', 'url(#glow)')
    line.classList.add('connection')
    connectionsGroup.appendChild(line)
  })

  // 渲染节点
  nodes.value.forEach(node => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', node.x.toString())
    circle.setAttribute('cy', node.y.toString())
    circle.setAttribute('r', '6')
    circle.setAttribute('fill', '#8b5cf6')
    circle.setAttribute('filter', 'url(#glow)')
    circle.classList.add('node')
    nodesGroup.appendChild(circle)
  })

  animateSignals()
}

// 动画信号传输
const animateSignals = () => {
  signalInterval = window.setInterval(() => {
    // 随机激活输入节点
    const inputNodes = nodes.value.filter(n => n.layer === 0)
    inputNodes.forEach(node => {
      node.active = Math.random() > 0.5
      updateNodeVisual(node)
    })

    // 传播信号
    setTimeout(() => propagateSignals(), 100)
  }, 1500)
}

// 传播信号
const propagateSignals = () => {
  for (let layer = 1; layer < props.layers.length; layer++) {
    setTimeout(() => {
      const layerNodes = nodes.value.filter(n => n.layer === layer)
      layerNodes.forEach(node => {
        const inputConnections = connections.value.filter(c => c.to === node)
        const activeInputs = inputConnections.filter(c => c.from.active)

        node.active = activeInputs.length > 0
        updateNodeVisual(node)
      })
    }, layer * 200)
  }
}

// 更新节点视觉效果
const updateNodeVisual = (node: Node) => {
  const nodeElement = nodesRef.value?.querySelector(`.node:nth-of-type(${node.id + 1})`) as SVGCircleElement
  if (!nodeElement) return

  if (node.active) {
    gsap.to(nodeElement, {
      fill: '#ec4899',
      r: 8,
      duration: 0.3,
      ease: 'power2.out'
    })
    gsap.to(nodeElement, {
      fill: '#8b5cf6',
      r: 6,
      duration: 0.3,
      delay: 0.5,
      ease: 'power2.out'
    })
  }
}

onMounted(() => {
  initNetwork()

  ctx = gsap.context(() => {
    // 鼠标交互
    svgRef.value?.addEventListener('mousemove', (e) => {
      const rect = svgRef.value!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // 激活附近的节点
      nodes.value.forEach(node => {
        const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
        if (distance < 50 && !node.active) {
          node.active = true
          updateNodeVisual(node)
          setTimeout(() => {
            node.active = false
            updateNodeVisual(node)
          }, 500)
        }
      })
    })

    // 统计数字动画
    gsap.from('.stat-value', {
      scale: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    })
  }, networkRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (signalInterval) clearInterval(signalInterval)
})
</script>

<style scoped lang="scss">
.neural-network {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.network-svg {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.network-stats {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(0, 0, 0, 0.5);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-size: 0.85rem;
  color: #94a3b8;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #e2e8f0;
}

@media (max-width: 768px) {
  .network-stats {
    position: relative;
    top: 0;
    right: 0;
    margin-top: 20px;
  }
}
</style>
