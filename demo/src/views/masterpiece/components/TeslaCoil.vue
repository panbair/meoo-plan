<template>
  <div class="tesla-container" ref="containerRef">
    <svg class="tesla-svg" ref="svgRef">
      <defs>
        <linearGradient id="electric-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#8b5cf6" />
          <stop offset="50%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
        <filter id="electric-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <!-- 电弧 -->
      <g ref="arcsRef" class="arcs"></g>
      <!-- 电火花 -->
      <g ref="sparksRef" class="sparks"></g>
      <!-- 线圈基座 -->
      <g class="coil-base">
        <rect x="200" y="350" width="100" height="30" fill="#374151" rx="5" />
        <rect x="210" y="320" width="80" height="30" fill="#4b5563" rx="5" />
        <rect x="220" y="250" width="60" height="70" fill="linear-gradient(#8b5cf6, #3b82f6)" rx="5" />
      </g>
      <!-- 线圈顶部 -->
      <circle cx="250" cy="150" r="40" fill="url(#electric-gradient)" filter="url(#electric-glow)" />
      <circle cx="250" cy="150" r="30" fill="#1f2937" />
    </svg>
    <div class="tesla-info">
      <h3 class="tesla-title">特斯拉线圈</h3>
      <p class="tesla-subtitle">高压电弧模拟</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  width?: number
  height?: number
  arcCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 500,
  height: 400,
  arcCount: 10
})

const containerRef = ref<HTMLElement>()
const svgRef = ref<SVGSVGElement>()
const arcsRef = ref<SVGGElement>()
const sparksRef = ref<SVGGElement>()
let ctx: gsap.Context
let animationId: number
let arcs: any[] = []
let sparks: any[] = []

const generateLightningPath = (startX: number, startY: number, endX: number, endY: number) => {
  const path = []
  const segments = 8
  const dx = (endX - startX) / segments
  const dy = (endY - startY) / segments

  path.push(`M ${startX} ${startY}`)

  for (let i = 1; i < segments; i++) {
    const x = startX + dx * i + (Math.random() - 0.5) * 40
    const y = startY + dy * i + (Math.random() - 0.5) * 40
    path.push(`L ${x} ${y}`)
  }

  path.push(`L ${endX} ${endY}`)

  return path.join(' ')
}

const initTesla = () => {
  const svg = svgRef.value!
  svg.setAttribute('width', props.width.toString())
  svg.setAttribute('height', props.height.toString())

  arcs = []
  sparks = []

  // 初始化电弧
  for (let i = 0; i < props.arcCount; i++) {
    arcs.push({
      active: false,
      x: 250,
      y: 150,
      targetX: 100 + Math.random() * 300,
      targetY: 50 + Math.random() * 100,
      life: 0
    })
  }

  // 初始化电火花
  for (let i = 0; i < 20; i++) {
    sparks.push({
      x: 200 + Math.random() * 100,
      y: 150 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: Math.random() * 100
    })
  }

  animateTesla()
}

const animateTesla = () => {
  const animate = () => {
    const arcsGroup = arcsRef.value!
    const sparksGroup = sparksRef.value!

    // 清除旧的元素
    arcsGroup.innerHTML = ''
    sparksGroup.innerHTML = ''

    // 更新和绘制电弧
    arcs.forEach((arc, index) => {
      if (Math.random() > 0.98) {
        arc.active = true
        arc.life = 30
        arc.targetX = 100 + Math.random() * 300
        arc.targetY = 50 + Math.random() * 150
      }

      if (arc.active && arc.life > 0) {
        const path = generateLightningPath(arc.x, arc.y, arc.targetX, arc.targetY)
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        pathElement.setAttribute('d', path)
        pathElement.setAttribute('stroke', 'url(#electric-gradient)')
        pathElement.setAttribute('stroke-width', '2')
        pathElement.setAttribute('fill', 'none')
        pathElement.setAttribute('filter', 'url(#electric-glow)')
        pathElement.setAttribute('opacity', (arc.life / 30).toString())
        arcsGroup.appendChild(pathElement)

        arc.life--

        if (arc.life <= 0) {
          arc.active = false
        }
      }
    })

    // 更新和绘制电火花
    sparks.forEach(spark => {
      spark.x += spark.vx
      spark.y += spark.vy
      spark.life--

      if (spark.life <= 0) {
        spark.x = 200 + Math.random() * 100
        spark.y = 150 + Math.random() * 200
        spark.vx = (Math.random() - 0.5) * 2
        spark.vy = (Math.random() - 0.5) * 2
        spark.life = 50 + Math.random() * 50
      }

      if (spark.life > 20) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', spark.x.toString())
        circle.setAttribute('cy', spark.y.toString())
        circle.setAttribute('r', '2')
        circle.setAttribute('fill', '#8b5cf6')
        circle.setAttribute('opacity', (spark.life / 100).toString())
        circle.setAttribute('filter', 'url(#electric-glow)')
        sparksGroup.appendChild(circle)
      }
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  initTesla()

  ctx = gsap.context(() => {
    // 鼠标交互 - 点击产生电弧
    svgRef.value?.addEventListener('click', (e) => {
      const rect = svgRef.value!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // 创建新的电弧
      const newArc = {
        active: true,
        x: 250,
        y: 150,
        targetX: x,
        targetY: y,
        life: 40
      }
      arcs.push(newArc)

      // 确保不会太多电弧
      if (arcs.length > 20) {
        arcs.shift()
      }
    })

    // 鼠标移动影响电弧方向
    svgRef.value?.addEventListener('mousemove', (e) => {
      const rect = svgRef.value!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      arcs.forEach(arc => {
        if (arc.active) {
          arc.targetX = x + (Math.random() - 0.5) * 50
          arc.targetY = y + (Math.random() - 0.5) * 50
        }
      })
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped lang="scss">
.tesla-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0a0a2a, #000010);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.tesla-svg {
  width: 100%;
  height: 100%;
}

.arcs, .sparks {
  pointer-events: none;
}

.tesla-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
}

.tesla-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

.tesla-subtitle {
  font-size: 0.85rem;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .tesla-container {
    height: 300px;
  }
}
</style>
