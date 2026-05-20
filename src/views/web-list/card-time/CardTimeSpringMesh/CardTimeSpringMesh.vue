<template>
  <section ref="containerRef" class="spring-mesh-section">
    <div class="mesh-bg">
      <div class="bg-dots"></div>
    </div>
    <div ref="headerRef" class="mesh-header">
      <div ref="badgeRef" class="mesh-badge">
        <span class="badge-icon">🔗</span>
        <span class="badge-text">HOOKE'S LAW</span>
      </div>
      <h1 ref="titleRef" class="mesh-title">SPRING MESH</h1>
      <p ref="subtitleRef" class="mesh-subtitle">弹簧质点系统 · 拖拽任意节点体验力的传导</p>
    </div>
    <div ref="meshContainerRef" class="mesh-container">
      <svg ref="svgRef" class="spring-lines" :viewBox="`0 0 ${meshWidth} ${meshHeight}`">
        <line v-for="(line, i) in springLines" :key="'l'+i"
          :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
          :stroke="line.color" stroke-width="1.5" stroke-opacity="0.4"/>
      </svg>
      <div v-for="(node, index) in nodes" :key="index"
        :ref="el => nodeRefs[index] = el as HTMLElement"
        class="mesh-node"
        :style="{ left: node.x + 'px', top: node.y + 'px', '--hue': node.hue }"
        @mousedown.prevent="startDrag(index, $event)"
        @touchstart.prevent="startDragTouch(index, $event)">
        <div class="node-ring"></div>
        <div class="node-core">
          <span class="node-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="node-title">{{ node.title }}</span>
          <span class="node-desc">{{ node.desc }}</span>
        </div>
        <div class="node-glow"></div>
      </div>
    </div>
    <div ref="footerRef" class="mesh-footer">
      <div class="mesh-params">
        <div class="param-item">
          <span class="p-label">刚度 k</span>
          <span class="p-value">0.08</span>
        </div>
        <div class="param-item">
          <span class="p-label">阻尼 c</span>
          <span class="p-value">0.92</span>
        </div>
        <div class="param-item">
          <span class="p-label">节点数</span>
          <span class="p-value">9</span>
        </div>
      </div>
      <span class="footer-text">DRAG ANY NODE</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const meshContainerRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const nodeRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const COLS = 3, ROWS = 3
const SPACING = 180
const K = 0.08 // spring stiffness
const DAMPING = 0.92
const meshWidth = (COLS - 1) * SPACING + 120
const meshHeight = (ROWS - 1) * SPACING + 120

interface Node {
  x: number; y: number
  restX: number; restY: number
  vx: number; vy: number
  title: string; desc: string; hue: number
}

const nodeData = [
  { title: 'Force', desc: '力', hue: 200 },
  { title: 'Mass', desc: '质量', hue: 220 },
  { title: 'Spring', desc: '弹簧', hue: 240 },
  { title: 'Energy', desc: '能量', hue: 260 },
  { title: 'Center', desc: '核心', hue: 280 },
  { title: 'Wave', desc: '波动', hue: 300 },
  { title: 'Damping', desc: '阻尼', hue: 320 },
  { title: 'Elastic', desc: '弹性', hue: 340 },
  { title: 'Hooke', desc: '胡克', hue: 360 },
]

const nodes = reactive<Node[]>(
  nodeData.map((d, i) => {
    const col = i % COLS, row = Math.floor(i / COLS)
    const x = col * SPACING + 60, y = row * SPACING + 60
    return { x, y, restX: x, restY: y, vx: 0, vy: 0, ...d }
  })
)

// Spring connections (horizontal + vertical + diagonal)
const connections: [number, number][] = []
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const idx = r * COLS + c
    if (c < COLS - 1) connections.push([idx, idx + 1])
    if (r < ROWS - 1) connections.push([idx, idx + COLS])
    if (c < COLS - 1 && r < ROWS - 1) connections.push([idx, idx + COLS + 1])
    if (c > 0 && r < ROWS - 1) connections.push([idx, idx + COLS - 1])
  }
}

const springLines = computed(() => {
  return connections.map(([a, b]) => {
    const na = nodes[a], nb = nodes[b]
    const dx = nb.x - na.x, dy = nb.y - na.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const restDist = Math.sqrt((nb.restX - na.restX) ** 2 + (nb.restY - na.restY) ** 2)
    const strain = Math.abs(dist - restDist) / restDist
    const r = Math.min(255, Math.floor(strain * 800))
    const b2 = Math.max(0, 255 - Math.floor(strain * 500))
    return { x1: na.x + 30, y1: na.y + 30, x2: nb.x + 30, y2: nb.y + 30, color: `rgb(${r},100,${b2})` }
  })
})

let draggingIdx = -1
let animFrameId = 0

const physicsStep = () => {
  nodes.forEach((node, i) => {
    if (i === draggingIdx) return
    // Spring force to rest position
    let fx = (node.restX - node.x) * K
    let fy = (node.restY - node.y) * K
    // Spring forces from connections
    connections.forEach(([a, b]) => {
      if (a !== i && b !== i) return
      const other = nodes[a === i ? b : a]
      const dx = other.x - node.x, dy = other.y - node.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const restDist = Math.sqrt((other.restX - node.restX) ** 2 + (other.restY - node.restY) ** 2)
      const displacement = dist - restDist
      fx += (dx / dist) * displacement * K * 0.5
      fy += (dy / dist) * displacement * K * 0.5
    })
    node.vx = (node.vx + fx) * DAMPING
    node.vy = (node.vy + fy) * DAMPING
    node.x += node.vx
    node.y += node.vy
  })
  // Update DOM positions
  nodeRefs.value.forEach((el, i) => {
    if (el && i !== draggingIdx) {
      el.style.left = nodes[i].x + 'px'
      el.style.top = nodes[i].y + 'px'
    }
  })
  animFrameId = requestAnimationFrame(physicsStep)
}

const startDrag = (idx: number, e: MouseEvent) => {
  draggingIdx = idx
  const rect = meshContainerRef.value!.getBoundingClientRect()
  const onMove = (ev: MouseEvent) => {
    nodes[idx].x = ev.clientX - rect.left - 30
    nodes[idx].y = ev.clientY - rect.top - 30
    nodes[idx].vx = 0; nodes[idx].vy = 0
    if (nodeRefs.value[idx]) {
      nodeRefs.value[idx]!.style.left = nodes[idx].x + 'px'
      nodeRefs.value[idx]!.style.top = nodes[idx].y + 'px'
    }
  }
  const onUp = () => {
    draggingIdx = -1
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

const startDragTouch = (idx: number, e: TouchEvent) => {
  draggingIdx = idx
  const rect = meshContainerRef.value!.getBoundingClientRect()
  const onMove = (ev: TouchEvent) => {
    const t = ev.touches[0]
    nodes[idx].x = t.clientX - rect.left - 30
    nodes[idx].y = t.clientY - rect.top - 30
    nodes[idx].vx = 0; nodes[idx].vy = 0
    if (nodeRefs.value[idx]) {
      nodeRefs.value[idx]!.style.left = nodes[idx].x + 'px'
      nodeRefs.value[idx]!.style.top = nodes[idx].y + 'px'
    }
  }
  const onEnd = () => {
    draggingIdx = -1
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('touchend', onEnd)
  }
  window.addEventListener('touchmove', onMove, { passive: false })
  window.addEventListener('touchend', onEnd)
}

onMounted(() => {
  if (!containerRef.value) return

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  })
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Entry animation: nodes fly in from random positions
  const allNodes = nodeRefs.value.filter(Boolean) as HTMLElement[]
  allNodes.forEach((el, i) => {
    gsap.set(el, { opacity: 0, scale: 0.3 })
  })

  const entryTl = gsap.timeline({
    scrollTrigger: { trigger: meshContainerRef.value, start: 'top 80%', toggleActions: 'play none none none' },
    onComplete: () => { animFrameId = requestAnimationFrame(physicsStep) }
  })
  allNodes.forEach((el, i) => {
    entryTl.to(el, {
      opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)'
    }, i * 0.06)
  })
  cleanupFns.push(() => entryTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
  cancelAnimationFrame(animFrameId)
})
</script>

<style scoped lang="scss">
.spring-mesh-section {
  width: 100vw; height: 100vh;
  background: linear-gradient(135deg, #06080e 0%, #0a0e18 50%, #06080e 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.mesh-bg {
  position: absolute; inset: 0; pointer-events: none;
  .bg-dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(100,140,200,0.06) 1px, transparent 1px);
    background-size: 30px 30px;
  }
}
.mesh-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .mesh-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px;
    border-radius: 40px; border: 1px solid rgba(80,180,120,0.2);
    background: rgba(80,180,120,0.06); backdrop-filter: blur(10px); margin-bottom: 12px;
    font-size: 11px; letter-spacing: 5px; color: rgba(140,220,170,0.8);
    .badge-icon { font-size: 14px; }
  }
  .mesh-title {
    font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px;
    background: linear-gradient(180deg, #fff 0%, #60d080 50%, #40c0a0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2));
  }
  .mesh-subtitle { font-size: 16px; color: rgba(140,200,170,0.6); letter-spacing: 6px; margin: 0; }
}
.mesh-container {
  position: relative; z-index: 10;
  width: v-bind(meshWidth + 'px'); height: v-bind(meshHeight + 'px');
}
.spring-lines {
  position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
}
.mesh-node {
  position: absolute; width: 60px; height: 60px;
  cursor: grab; user-select: none; z-index: 5;
  &:active { cursor: grabbing; z-index: 10; }
  .node-ring {
    position: absolute; inset: -4px; border-radius: 50%;
    border: 1.5px solid hsla(var(--hue), 50%, 50%, 0.25);
    transition: border-color 0.2s;
  }
  .node-core {
    width: 100%; height: 100%; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%,
      hsla(var(--hue), 40%, 30%, 0.95),
      hsla(var(--hue), 35%, 15%, 0.98));
    border: 1px solid hsla(var(--hue), 40%, 40%, 0.2);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    box-shadow: 0 4px 15px hsla(var(--hue), 40%, 30%, 0.25);
    .node-index { font-size: 8px; color: rgba(255,255,255,0.4); letter-spacing: 1px; }
    .node-title { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.9); }
    .node-desc { font-size: 7px; color: rgba(255,255,255,0.4); }
  }
  .node-glow {
    position: absolute; inset: -12px; border-radius: 50%;
    background: radial-gradient(circle, hsla(var(--hue), 50%, 50%, 0.08), transparent 70%);
    pointer-events: none;
  }
  &:hover {
    .node-ring { border-color: hsla(var(--hue), 50%, 60%, 0.5); }
    .node-glow { background: radial-gradient(circle, hsla(var(--hue), 50%, 50%, 0.15), transparent 70%); }
  }
}
.mesh-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .mesh-params {
    display: flex; gap: 28px; justify-content: center; margin-bottom: 12px;
    .param-item {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      .p-label { font-size: 14px; color: rgba(140,200,170,0.4); letter-spacing: 1px; }
      .p-value { font-size: 17px; font-weight: 700; color: rgba(140,220,170,0.9); font-family: 'Courier New', monospace; }
    }
  }
  .footer-text { font-size: 14px; letter-spacing: 3px; color: rgba(140,200,170,0.35); }
}
</style>

