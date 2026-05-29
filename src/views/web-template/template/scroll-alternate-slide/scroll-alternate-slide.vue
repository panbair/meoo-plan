<script setup lang="ts">
/**
 * ==================== Scroll Alternate Slide ====================
 * 交替滑入 —— 面板按固定规律从不同方向滑入覆盖：
 *   面板1: ↓ 从上往下
 *   面板2: → 从左往右
 *   面板3: ↓ 从上往下
 *   面板4: ← 从右往左
 *   面板5: ↓ 从上往下
 *   面板6: → 从左往右
 *   ... 循环 ↓→↓← 四拍
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8

type Dir = 'down' | 'right' | 'left'
// 四拍循环：↓ → ↓ ←
const PATTERN: Dir[] = ['down', 'right', 'down', 'left']

function getDir(index: number): Dir {
  return PATTERN[index % 4]
}

function getDirLabel(dir: Dir): string {
  switch (dir) {
    case 'down': return '↓'
    case 'right': return '→'
    case 'left': return '←'
  }
}

// 方向对应的起始偏移
function getStartOffset(dir: Dir): { x: number; y: number } {
  switch (dir) {
    case 'down': return { x: 0, y: -100 }
    case 'right': return { x: -100, y: 0 }
    case 'left': return { x: 100, y: 0 }
  }
}

let currentIndex = 0
let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'als-dot' + (i === 0 ? ' als-active' : '')
    dot.setAttribute('data-dir', getDir(i))
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.als-dot').forEach((d, i) => {
    d.classList.toggle('als-active', i === index)
  })
  const el = document.querySelector('.als-indicator .als-cur')
  if (el) el.textContent = String(index + 1)
  const dirEl = document.querySelector('.als-indicator .als-dir')
  if (dirEl) dirEl.textContent = getDirLabel(getDir(index))
  if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
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
  scrollArea = document.getElementById('alsArea') as HTMLElement
  progressBar = document.getElementById('alsProgress')
  navDots = document.getElementById('alsNav')
  if (!scrollArea) return

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.als-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)

      panels.forEach((panel, i) => {
        const dist = i - focus
        const dir = getDir(i)
        const start = getStartOffset(dir)

        if (dist <= -1) {
          // 已通过
          panel.style.transform = 'translate(0%, 0%)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
        } else if (dist >= 1) {
          // 还没到：在起始位置
          panel.style.transform = `translate(${start.x}%, ${start.y}%)`
          panel.style.opacity = '0'
          panel.style.zIndex = String(TOTAL + i)
        } else if (dist > 0) {
          // 正在入场 (0 < dist < 1)
          const p = 1 - dist // 0→1
          const tx = start.x * (1 - p)
          const ty = start.y * (1 - p)
          panel.style.transform = `translate(${tx}%, ${ty}%)`
          panel.style.opacity = String(Math.min(1, p * 2))
          panel.style.zIndex = String(TOTAL + i)
        } else {
          // 已到位
          panel.style.transform = 'translate(0%, 0%)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
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
  <div class="als-page">
    <div id="alsProgress" class="als-progress-bar"></div>
    <nav id="alsNav" class="als-nav-dots"></nav>
    <div class="als-indicator">
      <span class="als-dir">↓</span>
      <span class="als-cur">1</span>
      <span class="als-tot"> / {{ TOTAL }}</span>
    </div>

    <div id="alsArea" class="als-scroll-area">
      <div class="als-viewport">
        <section
          v-for="n in TOTAL"
          :key="n"
          class="als-panel"
          :style="{
            background: `linear-gradient(${[180,90,180,270][(n-1)%4]}deg, hsl(${(n-1)*44}, 50%, 72%), hsl(${(n-1)*44+20}, 38%, 84%))`,
          }"
        >
          <span class="als-num">{{ String(n).padStart(2, '0') }}</span>
          <div class="als-dir-hint">{{ getDirLabel(getDir(n - 1)) }}</div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.als-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f0f8;
  color: #1a1a2e;
}

.als-scroll-area {
  position: relative;
}

.als-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.als-panel {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
  gap: 16px;

  &::before {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    pointer-events: none;
  }
}

.als-num {
  font-size: clamp(5rem, 12vw, 10rem);
  font-weight: 900;
  color: rgba(26, 26, 46, 0.05);
  user-select: none;
  pointer-events: none;
}

.als-dir-hint {
  font-size: 1.5rem;
  color: rgba(26, 26, 46, 0.06);
  pointer-events: none;
  user-select: none;
}
</style>

<style lang="scss">
$c-down: #60a5fa;
$c-right: #34d399;
$c-left: #f472b6;

.als-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $c-down, $c-right, $c-down, $c-left);
  z-index: 1001;
}

.als-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.als-dot {
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

  &[data-dir='down'].als-active {
    background: $c-down;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-down, 0.5);
  }

  &[data-dir='right'].als-active {
    background: $c-right;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-right, 0.5);
  }

  &[data-dir='left'].als-active {
    background: $c-left;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-left, 0.5);
  }
}

.als-indicator {
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

  .als-dir {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .als-cur {
    font-weight: 700;
  }
}
</style>

