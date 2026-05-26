<script setup lang="ts">
/**
 * ==================== Perspective Tilt Grid ====================
 * 纯动画架构：滚动驱动 3D 透视倾斜 + 行列渐变遮罩
 * 核心：整个网格绕 X 轴旋转，滚动改变倾斜角度
 * 浏览器原生 3D perspective 渲染远近大小差异
 * 叠加每格独立的 opacity 梯度，模拟扫掠聚焦
 * 仿 scrollArea → sticky viewport → GSAP scrub → CSS 3D rotateX + translateY
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ═══════ 配置 ═══════ */
const ROWS = 5
const COLS = 6
const N = ROWS * COLS

let vh = 0

/* ═══════ DOM refs ═══════ */
let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null
let opacityST: ScrollTrigger | null = null
let rowNav: HTMLElement | null = null

/* ═══════ 导航点 ═══════ */
function createDots() {
  if (!rowNav) return
  rowNav.innerHTML = ''
  for (let i = 0; i < ROWS; i++) {
    const d = document.createElement('button')
    d.className = 'per-dot'
    d.addEventListener('click', () => {
      window.scrollTo({ top: i * vh, behavior: 'smooth' })
    })
    rowNav.appendChild(d)
  }
}

/* ═══════ UI 更新 ═══════ */
let lastRow = -1
function updateUI(progress: number) {
  const r = Math.round(progress * (ROWS - 1))
  if (r !== lastRow) {
    lastRow = r
    document.querySelectorAll('.per-dot').forEach((d, i) => d.classList.toggle('per-active', i === r))
  }
  if (progressBar) progressBar.style.width = (progress * 100) + '%'
}

/* ═══════ 初始化 ═══════ */
function init() {
  vh = window.innerHeight
  lastRow = -1

  scrollArea = document.getElementById('perScrollArea') as HTMLElement
  track = document.getElementById('perTrack') as HTMLElement
  progressBar = document.getElementById('perProgressBar')
  rowNav = document.getElementById('perRowNav')
  if (!scrollArea || !track) return

  // 高度 = ROWS 屏（每屏对应一个"焦点行"扫过）
  scrollArea.style.height = ROWS * 100 + 'vh'

  const rowH = vh

  /* ────── 1. 网格整体 3D 倾斜（fromTo 对称扫掠） ────── */
  const tiltTween = gsap.fromTo(track,
    { rotateX: -20, y: 0 },
    { rotateX: 20, y: -rowH * 0.06, ease: 'none',
      scrollTrigger: {
        trigger: scrollArea,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => updateUI(self.progress)
      }
    }
  )
  mainST = tiltTween.scrollTrigger

  /* ────── 2. 每格 opacity 梯度：距离焦点行越远越暗 ────── */
  const cells = gsap.utils.toArray('.per-cell') as HTMLElement[]
  const RAMP = 1 / (ROWS - 1) // 相邻行间距
  const oST = ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate(self) {
      const p = self.progress
      cells.forEach((cell, i) => {
        const ri = Math.floor(i / COLS)
        const peak = ri / (ROWS - 1)
        const dist = Math.abs(p - peak) / RAMP
        const opacity = 0.08 + 0.92 * Math.max(0, 1 - dist)
        cell.style.opacity = String(Math.round(opacity * 1000) / 1000)
      })
    }
  })
  opacityST = oST

  createDots()
  updateUI(0)
}

function onResize() {
  vh = window.innerHeight
  if (scrollArea) scrollArea.style.height = ROWS * 100 + 'vh'
  if (mainST) mainST.refresh()
  if (opacityST) opacityST.refresh()
  lastRow = -1
}

function destroy() {
  mainST?.kill()
  mainST = null
  opacityST?.kill()
  opacityST = null
  window.removeEventListener('resize', onResize)
}

onMounted(() => {
  nextTick(init)
  window.addEventListener('resize', onResize)
})
onUnmounted(destroy)
</script>

<template>
  <div class="per-page">
    <!-- 进度条 -->
    <div id="perProgressBar" class="per-progress-bar"></div>

    <!-- 行导航点 -->
    <nav id="perRowNav" class="per-row-nav"></nav>

    <!-- 滚动空间 -->
    <div id="perScrollArea" class="per-scroll-area">
      <!-- 吸顶视口 + 3D 透视舞台 -->
      <div class="per-viewport">
        <!-- 3D 旋转轨道 -->
        <div id="perTrack" class="per-track">
          <section
            v-for="i in N"
            :key="i"
            class="per-cell"
            :class="'c' + (i - 1)"
          >
            <span class="per-num">{{ String(i).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #060610;
$accent: #7c8cfc;

.per-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: $bg;
}

/* ═══════ 滚动空间 ═══════ */
.per-scroll-area { position: relative; }

/* ═══════ 吸顶视口 + 3D 舞台 ═══════ */
.per-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  /* 3D 透视摄像机 */
  perspective: 700px;
  perspective-origin: 50% 40%;
}

/* ═══════ 3D 旋转轨道 ═══════ */
.per-track {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  width: 100%;
  height: 100%;
  will-change: transform;
  transform-style: preserve-3d;
}

/* ═══════ 单元格 ═══════ */
.per-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  backface-visibility: visible;
}

.per-num {
  font-size: clamp(1.5rem, 4vw, 3.5rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.12);
  pointer-events: none;
  user-select: none;
}

/* ═══════ 单元格背景（行列渐变色轮） ═══════ */
@for $ri from 0 through 4 {
  @for $ci from 0 through 5 {
    $i: $ri * 6 + $ci;
    $hue: $ri * 32 + $ci * 12;
    .c#{$i} {
      background: linear-gradient(
        135deg,
        hsl($hue, 35%, 6%),
        hsl($hue + 15, 40%, 10%),
        hsl($hue + 30, 30%, 7%)
      );
      border: 1px solid hsla($hue, 30%, 45%, 0.08);
    }
  }
}

/* ═══════ 响应式 ═══════ */
@media (max-width: 600px) {
  .per-track {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(10, 1fr);
  }
}
</style>

<style lang="scss">
$accent: #7c8cfc;

/* ═══════ 进度条 ═══════ */
.per-progress-bar {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #a78bfa, #f472b6);
  z-index: 1001;
}

/* ═══════ 行导航点（右侧垂直居中） ═══════ */
.per-row-nav {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.per-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition: all 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.3);
  }
  &.per-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.4);
    box-shadow: 0 0 16px rgba($accent, 0.45);
  }
}
</style>
