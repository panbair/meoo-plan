<script setup lang="ts">
/**
 * ==================== 二维自由画廊 ====================
 * 结合 fake-horizontal-scroll（竖滚横移）与 infinite-scroll（纵向吸附）：
 * M 行 × N 列 全屏格子矩阵，纵横双轴自由导航。
 *
 * 方向判定：wheel/touch 主方向 → 沿该轴吸附到下一个格子。
 * 键盘 ↑↓←→ / 触控板双指 / 鼠标滚轮 均可驱动。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'

const ROWS = 4
const COLS = 3
const N = ROWS * COLS

let vw = 0,
  vh = 0
let row = 0,
  col = 0
let animating = false

let track: HTMLElement | null = null
let rowBar: HTMLElement | null = null
let colBar: HTMLElement | null = null
let rowDots: HTMLElement | null = null
let colDots: HTMLElement | null = null

/* ==================== 导航 UI ==================== */
function createDots() {
  if (rowDots) {
    rowDots.innerHTML = ''
    for (let i = 0; i < ROWS; i++) {
      const d = document.createElement('button')
      d.className = 't2d-row-dot' + (i === 0 ? ' active' : '')
      d.addEventListener('click', () => go(i, col))
      rowDots.appendChild(d)
    }
  }
  if (colDots) {
    colDots.innerHTML = ''
    for (let i = 0; i < COLS; i++) {
      const d = document.createElement('button')
      d.className = 't2d-col-dot' + (i === 0 ? ' active' : '')
      d.addEventListener('click', () => go(row, i))
      colDots.appendChild(d)
    }
  }
}

function updateUI() {
  document
    .querySelectorAll('.t2d-row-dot')
    .forEach((d, i) => d.classList.toggle('active', i === row))
  document
    .querySelectorAll('.t2d-col-dot')
    .forEach((d, i) => d.classList.toggle('active', i === col))
  document
    .querySelectorAll('.t2d-indicator .t2d-cur-r')
    .forEach((el) => (el.textContent = String(row + 1)))
  document
    .querySelectorAll('.t2d-indicator .t2d-cur-c')
    .forEach((el) => (el.textContent = String(col + 1)))
  if (rowBar) {
    rowBar.style.width = ((row + 1) / ROWS) * 100 + '%'
  }
  if (colBar) {
    colBar.style.width = ((col + 1) / COLS) * 100 + '%'
  }
}

/* ==================== 移动 ==================== */
function go(r: number, c: number) {
  r = Math.max(0, Math.min(ROWS - 1, r))
  c = Math.max(0, Math.min(COLS - 1, c))
  if (r === row && c === col) {
    return
  }
  row = r
  col = c
  animate()
}

function animate() {
  if (!track || animating) {
    return
  }
  animating = true
  gsap.to(track, {
    x: -col * vw,
    y: -row * vh,
    duration: 0.45,
    ease: 'power2.inOut',
    onComplete: () => {
      animating = false
    }
  })
  updateUI()
}

/* ==================== 方向判定 ==================== */
function onWheel(e: WheelEvent) {
  e.preventDefault()
  const absX = Math.abs(e.deltaX),
    absY = Math.abs(e.deltaY)
  if (absX > absY) {
    go(row, col + (e.deltaX > 0 ? 1 : -1))
  } else {
    go(row + (e.deltaY > 0 ? 1 : -1), col)
  }
}

function onKey(e: KeyboardEvent) {
  const m: Record<string, [number, number]> = {
    ArrowDown: [1, 0],
    ArrowUp: [-1, 0],
    ArrowRight: [0, 1],
    ArrowLeft: [0, -1]
  }
  const d = m[e.key]
  if (d) {
    e.preventDefault()
    go(row + d[0], col + d[1])
  }
}

let tsX = 0,
  tsY = 0
function onTS(e: TouchEvent) {
  tsX = e.touches[0].clientX
  tsY = e.touches[0].clientY
}
function onTE(e: TouchEvent) {
  const dx = tsX - e.changedTouches[0].clientX
  const dy = tsY - e.changedTouches[0].clientY
  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
    return
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    go(row, col + (dx > 0 ? 1 : -1))
  } else {
    go(row + (dy > 0 ? 1 : -1), col)
  }
}

/* ==================== 生命周期 ==================== */
function onResize() {
  vw = innerWidth
  vh = innerHeight
  go(row, col)
}
function init() {
  vw = innerWidth
  vh = innerHeight
  track = document.querySelector('.t2d-track') as HTMLElement
  rowBar = document.querySelector('.t2d-row-bar')
  colBar = document.querySelector('.t2d-col-bar')
  rowDots = document.querySelector('.t2d-row-dots')
  colDots = document.querySelector('.t2d-col-dots')
  if (!track) {
    return
  }

  createDots()
  updateUI()

  document.addEventListener('wheel', onWheel, { passive: false })
  document.addEventListener('keydown', onKey)
  document.addEventListener('touchstart', onTS, { passive: true })
  document.addEventListener('touchend', onTE, { passive: true })
  window.addEventListener('resize', onResize)
}

function destroy() {
  document.removeEventListener('wheel', onWheel)
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('touchstart', onTS)
  document.removeEventListener('touchend', onTE)
  window.removeEventListener('resize', onResize)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="t2d-page">
    <!-- 进度条 -->
    <div class="t2d-row-bar"></div>
    <div class="t2d-col-bar"></div>

    <!-- 行列导航点 -->
    <nav class="t2d-row-dots"></nav>
    <nav class="t2d-col-dots"></nav>

    <!-- 位置指示器 -->
    <div class="t2d-indicator">
      (<span class="t2d-cur-r">1</span>, <span class="t2d-cur-c">1</span>) / {{ ROWS }}×{{ COLS }}
    </div>

    <!-- 视口 -->
    <div class="t2d-viewport">
      <div class="t2d-track">
        <section v-for="i in N" :key="i" class="t2d-cell" :class="`c${i}`">{{ i }}</section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #0a0a12;
$accent: #6c8cff;
.t2d-page {
  height: 100vh;
  overflow: hidden;
  font-family: system-ui, sans-serif;
  background: $bg;
  color: #fff;
}
.t2d-viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
.t2d-track {
  display: grid;
  grid-template-columns: repeat(3, 100vw);
  grid-template-rows: repeat(4, 100vh);
  will-change: transform;
  counter-reset: t2d-cell;
}
.t2d-cell {
  counter-increment: t2d-cell;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-size: 6rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.2);
  &::after {
    content: counter(t2d-cell, decimal-leading-zero);
    position: absolute;
    bottom: 30px;
    right: 40px;
    font-size: 8rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.03);
    pointer-events: none;
  }
  // 反色递增：行越深越蓝，列越深越暖
  &.c1 {
    background: linear-gradient(135deg, #0a0e24, #121640);
  }
  &.c2 {
    background: linear-gradient(135deg, #0a1028, #1a1a5e);
  }
  &.c3 {
    background: linear-gradient(135deg, #0f2027, #2c5364);
  }
  &.c4 {
    background: linear-gradient(135deg, #1a1a2e, #0f3460);
  }
  &.c5 {
    background: linear-gradient(135deg, #141e30, #243b55);
  }
  &.c6 {
    background: linear-gradient(135deg, #16213e, #1a1a5e);
  }
  &.c7 {
    background: linear-gradient(135deg, #0d0d1a, #1a1a3e);
  }
  &.c8 {
    background: linear-gradient(135deg, #1a2980, #26d0ce);
  }
  &.c9 {
    background: linear-gradient(135deg, #0b1331, #1c2856);
  }
  &.c10 {
    background: linear-gradient(135deg, #0f1528, #2a1a5e);
  }
  &.c11 {
    background: linear-gradient(135deg, #1a1a2e, #0f3460);
  }
  &.c12 {
    background: linear-gradient(135deg, #141e30, #1a1a5e);
  }
}
@media (max-width: 600px) {
  .t2d-cell {
    font-size: 3rem;
    &::after {
      font-size: 4rem;
      bottom: 20px;
      right: 20px;
    }
  }
}
</style>

<style lang="scss">
$accent: #6c8cff;
/* 行进度条（顶部横向） */
.t2d-row-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  z-index: 1001;
  width: 0%;
  background: linear-gradient(90deg, $accent, #a78bfa, #f472b6);
  box-shadow: 0 0 8px rgba(108, 140, 255, 0.3);
}
/* 列进度条（左侧竖向） */
.t2d-col-bar {
  position: fixed;
  left: 0;
  top: 0;
  width: 3px;
  z-index: 1001;
  height: 0%;
  background: linear-gradient(180deg, $accent, #a78bfa, #f472b6);
  box-shadow: 0 0 8px rgba(108, 140, 255, 0.3);
}
/* 行导航点（底部居中） */
.t2d-row-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: row;
  gap: 14px;
}
.t2d-row-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.3);
  }
  &.active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}
/* 列导航点（右侧垂直居中） */
.t2d-col-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.t2d-col-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.3);
  }
  &.active {
    background: #f472b6;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(244, 114, 182, 0.5);
  }
}
/* 位置指示器 */
.t2d-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  .t2d-cur-r {
    color: $accent;
    font-weight: 700;
  }
  .t2d-cur-c {
    color: #f472b6;
    font-weight: 700;
  }
}
</style>
