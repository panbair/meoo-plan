<script setup lang="ts">
/**
 * ==================== Scroll Kaleidoscope Drift ====================
 * 万花筒漂移 —— 6折镜面旋转对称 + 滚动驱动内容位移
 *
 * 核心机制：
 *   1. 每个面板中心一个6折万花筒（6个60°楔形）
 *   2. 6个楔形共享同一组几何图形，各旋转60°×n
 *   3. GSAP ScrollTrigger scrub 驱动横向平移
 *   4. 万花筒整体随滚动进度旋转（漂移）
 *   5. 每面板独立的色调和图形排列
 *
 * 纯动画架构 — 无文案内容
 */
import { onMounted, onUnmounted, nextTick, ref, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
let currentIndex = 0
let vw = 0
let vh = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

// ── seeded pseudo-random ──
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

// ── 为每个面板生成几何图形数据 ──
interface Shape {
  type: 'circle' | 'triangle' | 'diamond' | 'square'
  x: number
  y: number
  s: number // size
  hue: number
  rot: number
  alpha: number
}

const panels = computed(() => {
  const result = []
  for (let p = 0; p < TOTAL; p++) {
    const rng = seededRandom(p * 137 + 42)
    const baseHue = (p * 45 + 15) % 360
    const shapes: Shape[] = []
    const count = 16 + Math.floor(rng() * 8)

    for (let i = 0; i < count; i++) {
      const typeIdx = Math.floor(rng() * 4)
      const types: Shape['type'][] = ['circle', 'triangle', 'diamond', 'square']
      shapes.push({
        type: types[typeIdx],
        x: Math.round(rng() * 100),
        y: Math.round(rng() * 100),
        s: Math.round(6 + rng() * 22),
        hue: Math.round((baseHue + rng() * 60 - 30 + 360) % 360),
        rot: Math.round(rng() * 360),
        alpha: Number((0.4 + rng() * 0.5).toFixed(2)),
      })
    }
    result.push({ baseHue, shapes })
  }
  return result
})

function getShapeStyle(shape: Shape) {
  const c = `hsla(${shape.hue},70%,60%,${shape.alpha})`
  const cDark = `hsla(${shape.hue},70%,48%,${shape.alpha})`
  const s = shape.s + 'px'
  const base: Record<string, string> = {
    left: shape.x + '%',
    top: shape.y + '%',
    '--s': s,
  }

  if (shape.type === 'circle') {
    base.width = s; base.height = s; base.borderRadius = '50%'
    base.backgroundColor = c
  } else if (shape.type === 'diamond') {
    base.width = s; base.height = s
    base.backgroundColor = c
    base.transform = `rotate(${shape.rot}deg)`
  } else if (shape.type === 'square') {
    base.width = s; base.height = s
    base.backgroundColor = c
    base.transform = `rotate(${shape.rot}deg)`
  } else if (shape.type === 'triangle') {
    base.width = '0'; base.height = '0'
    base.borderLeft = `calc(var(--s)*0.58) solid transparent`
    base.borderRight = `calc(var(--s)*0.58) solid transparent`
    base.borderBottom = `${s} solid ${cDark}`
  }
  return base
}

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'kld-dot' + (i === 0 ? ' kld-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.kld-dot').forEach((d, i) => {
    d.classList.toggle('kld-active', i === index)
  })
  if (progressBar) {
    progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
  }
}

const driftRotation = ref(0)

function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, {
    scrollTo: { y: index * vh, autoKill: false },
    duration: 0.6,
    ease: 'power2.inOut',
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault(); goTo(currentIndex + 1)
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault(); goTo(currentIndex - 1)
  }
}

function init() {
  vw = window.innerWidth
  vh = window.innerHeight

  scrollArea = document.getElementById('kldArea') as HTMLElement
  track = document.getElementById('kldTrack') as HTMLElement
  progressBar = document.getElementById('kldProgress')
  navDots = document.getElementById('kldNav')
  if (!scrollArea || !track) return

  scrollArea.style.height = TOTAL * 100 + 'vh'

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const tx = -p * (TOTAL - 1) * vw
      if (track) {
        track.style.transform = `translateX(${tx}px)`
      }
      // 万花筒整体旋转 (漂移)
      driftRotation.value = p * 360

      const idx = Math.round(p * (TOTAL - 1))
      if (idx !== currentIndex) {
        currentIndex = idx
        updateUI(idx)
      }
    },
  })

  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  window.addEventListener('resize', onResize)
  document.addEventListener('keydown', onKeydown)
  createNavDots()
  updateUI(0)
}

function onResize() {
  vw = window.innerWidth
  vh = window.innerHeight
  if (mainST) mainST.refresh()
}

function destroy() {
  mainST?.kill()
  mainST = null
  window.removeEventListener('resize', onResize)
  document.removeEventListener('keydown', onKeydown)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="kld-page">
    <div id="kldProgress" class="kld-progress-bar"></div>
    <nav id="kldNav" class="kld-nav-dots"></nav>

    <div id="kldArea" class="kld-scroll-area">
      <div class="kld-viewport">
        <div id="kldTrack" class="kld-track" :style="{ width: TOTAL * 100 + 'vw' }">
          <section
            v-for="(panel, pIdx) in panels"
            :key="pIdx"
            class="kld-panel"
            :style="{ background: `hsl(${panel.baseHue}, 18%, 98%)` }"
          >
            <!-- 万花筒 -->
            <div
              class="kld-kalei"
              :style="{
                transform: `rotate(${driftRotation}deg)`,
                '--base-hue': panel.baseHue,
              }"
            >
              <div
                v-for="w in 6"
                :key="w"
                class="kld-wedge"
                :style="{ transform: `rotate(${(w - 1) * 60}deg)` }"
              >
                <div class="kld-wedge-inner">
                  <div
                    v-for="(shape, sIdx) in panel.shapes"
                    :key="sIdx"
                    class="kld-shape"
                    :class="`kld-${shape.type}`"
                    :style="getShapeStyle(shape)"
                  ></div>
                </div>
              </div>
            </div>

            <!-- 面板序号水印 -->
            <span class="kld-num">{{ String(pIdx + 1).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.kld-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0d0d16;
}

.kld-scroll-area { position: relative; }

.kld-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.kld-track {
  height: 100vh;
  display: flex;
  flex-direction: row;
  will-change: transform;
}

.kld-panel {
  min-width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

/* ── 万花筒容器 ── */
.kld-kalei {
  position: relative;
  width: 56vmin;
  height: 56vmin;
  transition: transform 0.15s linear;
}

/* ── 单个60°楔形 ── */
.kld-wedge {
  position: absolute;
  inset: 0;
  clip-path: polygon(50% 50%, 50% 0%, 93.3% 25%);
  overflow: hidden;
}

.kld-wedge-inner {
  position: absolute;
  inset: 0;
}

/* ── 几何图形 ── */
.kld-shape {
  position: absolute;
  transform-origin: center center;
  pointer-events: none;
}

.kld-circle {
  aspect-ratio: 1;
  border-radius: 50%;
}

.kld-triangle {
  width: 0;
  height: 0;
  border-left: calc(var(--s, 14px) * 0.58) solid transparent;
  border-right: calc(var(--s, 14px) * 0.58) solid transparent;
  border-bottom-style: solid;
  border-bottom-width: var(--s, 14px);
  background: none !important;
}

.kld-diamond {
  transform-origin: center center;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.kld-square {
  border-radius: 2px;
}

/* ── 面板序号 ── */
.kld-num {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 4px;
  color: rgba(0, 0, 0, 0.08);
  user-select: none;
  pointer-events: none;
}

@media (max-width: 768px) {
  .kld-kalei { width: 70vmin; height: 70vmin; }
  .kld-num { font-size: 0.65rem; }
}
</style>

<style lang="scss">
$c-kld: #e879f9;

.kld-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, #f97316, #e879f9, #22d3ee, #a3e635, #facc15, #fb7185, #818cf8, #22d3ee);
  z-index: 1001;
}

.kld-nav-dots {
  position: fixed;
  z-index: 1000;
  display: flex;
  gap: 9px;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.kld-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    background: rgba(0, 0, 0, 0.3);
    transform: scale(1.3);
  }

  &.kld-active {
    background: $c-kld;
    border-color: rgba(0, 0, 0, 0.2);
    transform: scale(1.6);
    box-shadow: 0 0 16px rgba($c-kld, 0.6);
  }
}

@media (max-width: 768px) {
  .kld-nav-dots { gap: 7px; }
}
</style>
