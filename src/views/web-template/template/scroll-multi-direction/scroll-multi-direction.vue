<script setup lang="ts">
/**
 * ==================== Scroll Multi Direction ====================
 * 多方向入场 —— 面板从四个不同方向交替滑入：
 *   面板1：从上往下滑入
 *   面板2：从下往上滑入
 *   面板3：从左往右滑入
 *   面板4：从右往左滑入
 *   面板5~8：循环重复以上四个方向
 *
 * 核心：sticky 视口锁定，每个面板根据序号决定入场方向
 * 前一个面板停留展示，下一个面板从对应方向滑入覆盖
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8

// 四个方向循环：上→下, 下→上, 左→右, 右→左
type Dir = 'down' | 'up' | 'right' | 'left'
const DIRS: Dir[] = ['down', 'up', 'right', 'left']

function getDir(index: number): Dir {
  return DIRS[index % 4]
}

// 方向对应的偏移起始位置(百分比)
function getOffset(dir: Dir, progress: number): { x: number; y: number } {
  const remaining = 1 - progress // 1→0
  switch (dir) {
    case 'down': return { x: 0, y: -100 * remaining } // 从上方来 → y从-100到0
    case 'up': return { x: 0, y: 100 * remaining }    // 从下方来 → y从100到0
    case 'right': return { x: -100 * remaining, y: 0 } // 从左方来 → x从-100到0
    case 'left': return { x: 100 * remaining, y: 0 }   // 从右方来 → x从100到0
  }
}

// 方向对应的箭头符号
function getDirArrow(dir: Dir): string {
  switch (dir) {
    case 'down': return '↓'
    case 'up': return '↑'
    case 'right': return '→'
    case 'left': return '←'
  }
}

let currentIndex = 0
let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) {
    return
  }
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'mdr-dot' + (i === 0 ? ' mdr-active' : '')
    dot.setAttribute('data-dir', getDir(i))
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.mdr-dot').forEach((d, i) => {
    d.classList.toggle('mdr-active', i === index)
  })
  const el = document.querySelector('.mdr-indicator .mdr-cur')
  if (el) {
    el.textContent = String(index + 1)
  }
  const dirEl = document.querySelector('.mdr-indicator .mdr-dir')
  if (dirEl) {
    dirEl.textContent = getDirArrow(getDir(index))
  }
  if (progressBar) {
    progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
  }
}

function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, {
    scrollTo: { y: index * window.innerHeight, autoKill: false },
    duration: 0.6,
    ease: 'power2.inOut',
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault()
    goTo(currentIndex + 1)
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault()
    goTo(currentIndex - 1)
  }
}

function init() {
  scrollArea = document.getElementById('mdrArea') as HTMLElement
  progressBar = document.getElementById('mdrProgress')
  navDots = document.getElementById('mdrNav')
  if (!scrollArea) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.mdr-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const focus = p * (TOTAL - 1)

      panels.forEach((panel, i) => {
        const dist = i - focus // 负=已过, 正=未到
        const dir = getDir(i)

        if (dist <= -1) {
          // 完全通过：停在原位但被后面的覆盖
          panel.style.transform = 'translate(0%, 0%)'
          panel.style.zIndex = String(i)
          panel.style.opacity = '1'
        } else if (dist >= 1) {
          // 还没到：隐藏在起始位置外
          const off = getOffset(dir, 0)
          panel.style.transform = `translate(${off.x}%, ${off.y}%)`
          panel.style.zIndex = String(TOTAL + i)
          panel.style.opacity = '0'
        } else if (dist > 0) {
          // 正在入场 (0 < dist < 1)
          const enterProg = 1 - dist // 0→1
          const off = getOffset(dir, enterProg)
          panel.style.transform = `translate(${off.x}%, ${off.y}%)`
          panel.style.zIndex = String(TOTAL + i)
          panel.style.opacity = String(Math.min(1, enterProg * 2))
        } else {
          // 正在被覆盖 (-1 < dist < 0) — 保持在位
          panel.style.transform = 'translate(0%, 0%)'
          panel.style.zIndex = String(i)
          panel.style.opacity = '1'
        }
      })

      const idx = Math.round(focus)
      if (idx !== currentIndex) {
        currentIndex = idx
        updateUI(idx)
      }
    },
  })

  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  document.addEventListener('keydown', onKeydown)
  createNavDots()
  updateUI(0)
}

function destroy() {
  mainST?.kill()
  mainST = null
  document.removeEventListener('keydown', onKeydown)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="mdr-page">
    <div id="mdrProgress" class="mdr-progress-bar"></div>
    <nav id="mdrNav" class="mdr-nav-dots"></nav>
    <div class="mdr-indicator">
      <span class="mdr-dir">↓</span>
      <span class="mdr-cur">1</span>
      <span class="mdr-tot"> / {{ TOTAL }}</span>
    </div>

    <div id="mdrArea" class="mdr-scroll-area">
      <div class="mdr-viewport">
        <section
          v-for="n in TOTAL"
          :key="n"
          class="mdr-panel"
          :style="{
            background: `linear-gradient(${[150,30,240,330][(n-1)%4]}deg, hsl(${(n-1)*44}, 50%, 72%), hsl(${(n-1)*44+20}, 38%, 84%))`,
          }"
        >
          <span class="mdr-num">{{ String(n).padStart(2, '0') }}</span>
          <div class="mdr-dir-label">{{ getDirArrow(getDir(n - 1)) }}</div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mdr-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f0f8;
  color: #1a1a2e;
}

.mdr-scroll-area {
  position: relative;
}

.mdr-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.mdr-panel {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
  gap: 20px;

  &::before {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    pointer-events: none;
  }
}

.mdr-num {
  font-size: clamp(5rem, 12vw, 10rem);
  font-weight: 900;
  color: rgba(26, 26, 46, 0.05);
  user-select: none;
  pointer-events: none;
}

.mdr-dir-label {
  font-size: 2rem;
  color: rgba(26, 26, 46, 0.08);
  pointer-events: none;
  user-select: none;
}
</style>

<style lang="scss">
$c-down: #38bdf8;
$c-up: #34d399;
$c-right: #fb923c;
$c-left: #c084fc;

.mdr-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $c-down, $c-up, $c-right, $c-left);
  z-index: 1001;
}

.mdr-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mdr-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(26, 26, 46, 0.15);
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition: all 0.3s;

  &:hover {
    background: rgba(26, 26, 46, 0.4);
    transform: scale(1.3);
  }

  &[data-dir='down'].mdr-active {
    background: $c-down;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-down, 0.5);
  }

  &[data-dir='up'].mdr-active {
    background: $c-up;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-up, 0.5);
  }

  &[data-dir='right'].mdr-active {
    background: $c-right;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-right, 0.5);
  }

  &[data-dir='left'].mdr-active {
    background: $c-left;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-left, 0.5);
  }
}

.mdr-indicator {
  position: fixed;
  top: 28px;
  right: 28px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(26, 26, 46, 0.75);
  display: flex;
  align-items: center;
  gap: 8px;

  .mdr-dir {
    font-size: 1.1rem;
    font-weight: 700;
    transition: color 0.3s;
  }

  .mdr-cur {
    font-weight: 700;
  }
}
</style>

