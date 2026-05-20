<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 物理参数 ====================
const gravity = ref(9.8)
const restitution = ref(0.6)
const friction = ref(0.3)
const gravityDir = ref('down')
const showVectors = ref(true)

const gravityDirs = [
  { label: 'down', icon: '⬇️' },
  { label: 'up', icon: '⬆️' },
  { label: 'left', icon: '⬅️' },
  { label: 'right', icon: '➡️' }
]

const parentRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)

// ==================== 物体定义 ====================
interface Body {
  id: number
  shape: 'box' | 'circle'
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  mass: number
  rotation: number
  angularVel: number
  color: string
  emoji: string
  dragging: boolean
}

let bodyIdCounter = 0
const bodies = reactive<Body[]>([])

interface Spark {
  id: number
  x: number
  y: number
}
const sparks = reactive<Spark[]>([])
let sparkIdCounter = 0

const COLORS = [
  '#4488ff',
  '#ff5544',
  '#44cc88',
  '#ffaa33',
  '#cc44ff',
  '#44dddd',
  '#ff6699',
  '#88aa22'
]
const EMOJIS_BOX = ['📦', '🧊', '🎁', '🧱', '💎']
const EMOJIS_CIRCLE = ['⚽', '🏀', '🌕', '🔮', '🍊']

let seed = 12345
const rng = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const pick = (arr: string[]) => arr[Math.floor(rng() * arr.length)]

const createBody = (shape: 'box' | 'circle', x: number, y: number): Body => {
  const size = 36 + rng() * 30
  return {
    id: bodyIdCounter++,
    shape,
    x,
    y,
    vx: (rng() - 0.5) * 3,
    vy: -2 - rng() * 3,
    w: size,
    h: shape === 'circle' ? size : size * (0.7 + rng() * 0.6),
    mass: size / 30,
    rotation: rng() * 360,
    angularVel: (rng() - 0.5) * 4,
    color: COLORS[Math.floor(rng() * COLORS.length)],
    emoji: shape === 'box' ? pick(EMOJIS_BOX) : pick(EMOJIS_CIRCLE),
    dragging: false
  }
}

const addBody = (shape: 'box' | 'circle') => {
  const scene = sceneRef.value
  if (!scene) {
    return
  }
  const w = scene.clientWidth
  const x = 80 + rng() * (w - 260)
  const y = 40 + rng() * 80
  bodies.push(createBody(shape, x, y))
}

const resetScene = () => {
  bodies.length = 0
  seed = 12345
  initBodies()
}

const initBodies = () => {
  const scene = sceneRef.value
  if (!scene) {
    return
  }
  const w = scene.clientWidth

  for (let i = 0; i < 4; i++) {
    bodies.push(createBody('box', 100 + rng() * (w - 300), 60 + rng() * 150))
  }
  for (let i = 0; i < 3; i++) {
    bodies.push(createBody('circle', 100 + rng() * (w - 300), 60 + rng() * 150))
  }
}

// ==================== 样式计算 ====================
const bodyStyle = (b: Body) => ({
  left: `${b.x - b.w / 2}px`,
  top: `${b.y - b.h / 2}px`,
  width: `${b.w}px`,
  height: `${b.h}px`,
  transform: `rotate(${b.rotation}deg)`,
  borderRadius: b.shape === 'circle' ? '50%' : '6px'
})

const vectorStyle = (b: Body) => ({ left: `${b.w / 2}px`,
  top: `${b.h / 2}px`,
  overflow: 'visible'
})

// ==================== 拖拽 ====================
const dragId = ref(-1)
let dragOffX = 0
let dragOffY = 0
let prevDragX = 0
let prevDragY = 0
let prevDragTime = 0

const getSceneCoords = (e: PointerEvent) => {
  const rect = sceneRef.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

const onPointerDown = (e: PointerEvent) => {
  const { x, y } = getSceneCoords(e)
  // 找到点击的物体（最上层优先）
  for (let i = bodies.length - 1; i >= 0; i--) {
    const b = bodies[i]
    const dx = x - b.x,
      dy = y - b.y
    const hit =
      b.shape === 'circle'
        ? dx * dx + dy * dy <= (b.w / 2) ** 2
        : Math.abs(dx) <= b.w / 2 && Math.abs(dy) <= b.h / 2

    if (hit) {
      dragId.value = b.id
      b.dragging = true
      b.vx = 0
      b.vy = 0
      b.angularVel = 0
      dragOffX = dx
      dragOffY = dy
      prevDragX = x
      prevDragY = y
      prevDragTime = Date.now()
      ;(e.target as HTMLElement)?.setPointerCapture?.(e.pointerId)
      break
    }
  }
}

const onPointerMove = (e: PointerEvent) => {
  if (dragId.value < 0) {
    return
  }
  const { x, y } = getSceneCoords(e)
  const b = bodies.find((b) => b.id === dragId.value)
  if (!b) {
    return
  }

  b.x = x - dragOffX
  b.y = y - dragOffY

  const now = Date.now()
  const dt = now - prevDragTime || 16
  b.vx = ((x - prevDragX) / dt) * 16
  b.vy = ((y - prevDragY) / dt) * 16
  prevDragX = x
  prevDragY = y
  prevDragTime = now
}

const onPointerUp = () => {
  if (dragId.value >= 0) {
    const b = bodies.find((b) => b.id === dragId.value)
    if (b) {
      b.dragging = false
    }
    dragId.value = -1
  }
}

// ==================== 物理循环 ====================
let rafId = 0
const FIXED_DT = 1 / 60

const getGravityVec = () => {
  const g = gravity.value
  switch (gravityDir.value) {
    case 'up':
      return { gx: 0, gy: -g }
    case 'left':
      return { gx: -g, gy: 0 }
    case 'right':
      return { gx: g, gy: 0 }
    default:
      return { gx: 0, gy: g }
  }
}

const physicsStep = () => {
  const scene = sceneRef.value
  if (!scene) {
    return
  }
  const sw = scene.clientWidth
  const sh = scene.clientHeight
  const { gx, gy } = getGravityVec()
  const rest = restitution.value
  const fric = friction.value

  bodies.forEach((b) => {
    if (b.dragging) {
      return
    }

    // 重力
    b.vx += gx * FIXED_DT * 3
    b.vy += gy * FIXED_DT * 3

    // 空气阻力
    b.vx *= 1 - 0.01 * fric
    b.vy *= 1 - 0.01 * fric
    b.angularVel *= 1 - 0.02 * fric

    // 位移
    b.x += b.vx
    b.y += b.vy
    b.rotation += b.angularVel

    // 边界碰撞
    const hw = b.w / 2,
      hh = b.h / 2

    if (b.y + hh > sh) {
      b.y = sh - hh
      b.vy = -Math.abs(b.vy) * rest
      b.angularVel += b.vx * 0.05 * (1 - fric)
      if (Math.abs(b.vy) > 2) {
        addSpark(b.x, sh)
      }
    }
    if (b.y - hh < 0) {
      b.y = hh
      b.vy = Math.abs(b.vy) * rest
    }
    if (b.x + hw > sw) {
      b.x = sw - hw
      b.vx = -Math.abs(b.vx) * rest
      if (Math.abs(b.vx) > 2) {
        addSpark(sw, b.y)
      }
    }
    if (b.x - hw < 0) {
      b.x = hw
      b.vx = Math.abs(b.vx) * rest
      if (Math.abs(b.vx) > 2) {
        addSpark(0, b.y)
      }
    }
  })

  // 物体间碰撞（简化圆形碰撞）
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i],
        b_obj = bodies[j]
      if (a.dragging || b_obj.dragging) {
        continue
      }

      const dx = b_obj.x - a.x
      const dy = b_obj.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const minDist = ((a.w + b_obj.w) / 2) * 0.8

      if (dist < minDist && dist > 0) {
        const nx = dx / dist
        const ny = dy / dist
        const overlap = minDist - dist

        // 分离
        const totalMass = a.mass + b_obj.mass
        a.x -= nx * overlap * (b_obj.mass / totalMass)
        a.y -= ny * overlap * (b_obj.mass / totalMass)
        b_obj.x += nx * overlap * (a.mass / totalMass)
        b_obj.y += ny * overlap * (a.mass / totalMass)

        // 速度交换
        const dvx = a.vx - b_obj.vx
        const dvy = a.vy - b_obj.vy
        const dvn = dvx * nx + dvy * ny
        if (dvn > 0) {
          const impulse = (dvn * (1 + rest)) / totalMass
          a.vx -= impulse * b_obj.mass * nx
          a.vy -= impulse * b_obj.mass * ny
          b_obj.vx += impulse * a.mass * nx
          b_obj.vy += impulse * a.mass * ny

          // 碰撞火花
          if (Math.abs(dvn) > 1.5) {
            addSpark((a.x + b_obj.x) / 2, (a.y + b_obj.y) / 2)
          }
        }
      }
    }
  }

  rafId = requestAnimationFrame(physicsStep)
}

const addSpark = (x: number, y: number) => {
  const id = sparkIdCounter++
  sparks.push({ id, x, y })
  setTimeout(() => {
    const idx = sparks.findIndex((s) => s.id === id)
    if (idx >= 0) {
      sparks.splice(idx, 1)
    }
  }, 400)
}

// ==================== 生命周期 ====================
onMounted(() => {
  initBodies()
  rafId = requestAnimationFrame(physicsStep)

  if (panelRef.value) {
    gsap.from(panelRef.value, {
      x: -60,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
  }
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <div ref="parentRef" class="drag-physics-engine">
    <!-- 物理参数面板 -->
    <div ref="panelRef" class="dpe-panel">
      <div class="dpe-panel-title">物理参数</div>
      <div class="dpe-param">
        <label
          >重力 <span>{{ gravity.toFixed(1) }}</span></label
        >
        <input
          v-model.number="gravity"
          type="range"
          min="0"
          max="20"
          step="0.5"
          class="dpe-slider"
        />
      </div>
      <div class="dpe-param">
        <label
          >弹性 <span>{{ restitution.toFixed(2) }}</span></label
        >
        <input
          v-model.number="restitution"
          type="range"
          min="0"
          max="1"
          step="0.05"
          class="dpe-slider"
        />
      </div>
      <div class="dpe-param">
        <label
          >摩擦 <span>{{ friction.toFixed(2) }}</span></label
        >
        <input
          v-model.number="friction"
          type="range"
          min="0"
          max="1"
          step="0.05"
          class="dpe-slider"
        />
      </div>
      <div class="dpe-param">
        <label>重力方向</label>
        <div class="dpe-dir-group">
          <button
            v-for="d in gravityDirs"
            :key="d.label"
            class="dpe-dir-btn"
            :class="{ active: gravityDir === d.label }"
            @click="gravityDir = d.label"
          >
            {{ d.icon }}
          </button>
        </div>
      </div>
      <div class="dpe-actions">
        <button class="dpe-action-btn" @click="addBody('box')">＋ 方块</button>
        <button class="dpe-action-btn" @click="addBody('circle')">＋ 圆球</button>
        <button class="dpe-action-btn dpe-reset" @click="resetScene">重置</button>
      </div>
    </div>

    <!-- 物理场景 -->
    <div
      ref="sceneRef"
      class="dpe-scene"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <!-- 物体 DOM -->
      <div
        v-for="body in bodies"
        :key="body.id"
        class="dpe-body"
        :class="[`dpe-${body.shape}`, { dragging: body.id === dragId }]"
        :style="bodyStyle(body)"
      >
        <div class="dpe-body-inner" :style="{ background: body.color }">
          <span class="dpe-body-emoji">{{ body.emoji }}</span>
        </div>
        <!-- 速度矢量 -->
        <svg v-if="showVectors && !body.dragging" class="dpe-vector" :style="vectorStyle(body)">
          <line
            x1="0"
            y1="0"
            :x2="body.vx * 4"
            :y2="body.vy * 4"
            stroke="rgba(255,200,0,0.6)"
            stroke-width="2"
            marker-end="url(#arrowhead)"
          />
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="rgba(255,200,0,0.6)" />
            </marker>
          </defs>
        </svg>
      </div>

      <!-- 碰撞闪光 -->
      <div
        v-for="spark in sparks"
        :key="spark.id"
        class="dpe-spark"
        :style="{ left: spark.x + 'px', top: spark.y + 'px' }"
      ></div>

      <!-- 边界线 -->
      <div class="dpe-boundary dpe-boundary-floor"></div>
      <div class="dpe-boundary dpe-boundary-left"></div>
      <div class="dpe-boundary dpe-boundary-right"></div>
      <div class="dpe-boundary dpe-boundary-ceil"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.drag-physics-engine {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #0c0c1a;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  font-family: 'Segoe UI', sans-serif;
}

// ==================== 参数面板 ====================
.dpe-panel {
  width: 190px;
  min-width: 190px;
  background: rgba(15, 15, 35, 0.9);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
}

.dpe-panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #8cf;
  letter-spacing: 1px;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(100, 180, 255, 0.12);
}

.dpe-param {
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #889;

    span {
      color: #adf;
      font-family: 'Consolas', monospace;
      font-weight: 700;
    }
  }
}

.dpe-slider {
  width: 100%;
  accent-color: #648cff;
}

.dpe-dir-group {
  display: flex;
  gap: 4px;
}

.dpe-dir-btn {
  flex: 1;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s;

  &.active {
    background: rgba(100, 140, 255, 0.25);
    border-color: rgba(100, 140, 255, 0.5);
    box-shadow: 0 0 8px rgba(100, 140, 255, 0.2);
  }
}

.dpe-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.dpe-action-btn {
  padding: 7px;
  border: 1px solid rgba(100, 200, 150, 0.2);
  border-radius: 6px;
  background: rgba(100, 200, 150, 0.08);
  color: #8cb;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: rgba(100, 200, 150, 0.18);
  }

  &.dpe-reset {
    border-color: rgba(255, 100, 100, 0.2);
    background: rgba(255, 100, 100, 0.08);
    color: #f99;

    &:hover {
      background: rgba(255, 100, 100, 0.18);
    }
  }
}

// ==================== 物理场景 ====================
.dpe-scene {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, rgba(20, 20, 50, 1), rgba(8, 8, 20, 1));
  touch-action: none;
  cursor: default;

  // 网格背景
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(100, 180, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100, 180, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }
}

// ==================== 物体 ====================
.dpe-body {
  position: absolute;
  pointer-events: none;
  transition: none;

  &.dragging {
    z-index: 100;
    filter: brightness(1.3);

    .dpe-body-inner {
      box-shadow: 0 0 25px rgba(255, 255, 255, 0.25);
    }
  }
}

.dpe-body-inner {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.2s;
}

.dpe-body-emoji {
  font-size: 20px;
  pointer-events: none;
  user-select: none;
}

.dpe-vector {
  position: absolute;
  width: 200px;
  height: 200px;
  pointer-events: none;
  transform: translate(-100px, -100px);
  overflow: visible;
}

// ==================== 碰撞闪光 ====================
.dpe-spark {
  position: absolute;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  margin-top: -6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 220, 100, 0.9), rgba(255, 150, 50, 0) 70%);
  pointer-events: none;
  animation: dpe-spark-anim 0.4s ease-out forwards;
  z-index: 200;
}

@keyframes dpe-spark-anim {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

// ==================== 边界线 ====================
.dpe-boundary {
  position: absolute;
  pointer-events: none;

  &-floor {
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.15), transparent);
  }

  &-left {
    top: 0;
    left: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, rgba(100, 180, 255, 0.1), transparent);
  }

  &-right {
    top: 0;
    right: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, rgba(100, 180, 255, 0.1), transparent);
  }

  &-ceil {
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.08), transparent);
  }
}
</style>


