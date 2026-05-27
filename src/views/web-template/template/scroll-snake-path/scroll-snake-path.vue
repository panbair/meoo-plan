<script setup lang="ts">
/**
 * ==================== Scroll Snake Path ====================
 * 蛇形路径 —— 面板排列在多列网格中，路径呈 S 型蛇行：
 *   第1列：↓ 下行(面板1~3)
 *   底部：→ 右移到第2列
 *   第2列：↑ 上行(面板4~6)
 *   顶部：→ 右移到第3列
 *   第3列：↓ 下行(面板7~9)
 *
 * 用户始终竖滚，面板沿蛇形路径依次呈现
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const ROWS = 3
const COLS = 3
const TOTAL = ROWS * COLS // 9

// 蛇形路径顺序：每个面板的 (col, row) 位置
// 列0下行: (0,0)(0,1)(0,2) → 右移 → 列1上行: (1,2)(1,1)(1,0) → 右移 → 列2下行: (2,0)(2,1)(2,2)
const PATH: Array<[number, number]> = []
for (let c = 0; c < COLS; c++) {
  const goingDown = c % 2 === 0
  for (let r = 0; r < ROWS; r++) {
    PATH.push([c, goingDown ? r : ROWS - 1 - r])
  }
}

let currentIndex = 0
let vw = 0
let vh = 0
let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
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
    dot.className = 'snk-dot' + (i === 0 ? ' snk-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.snk-dot').forEach((d, i) => {
    d.classList.toggle('snk-active', i === index)
  })
  const el = document.querySelector('.snk-indicator .snk-cur')
  if (el) {
    el.textContent = String(index + 1)
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
  vw = window.innerWidth
  vh = window.innerHeight

  scrollArea = document.getElementById('snkArea') as HTMLElement
  track = document.getElementById('snkTrack') as HTMLElement
  progressBar = document.getElementById('snkProgress')
  navDots = document.getElementById('snkNav')
  if (!scrollArea || !track) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      // 当前在路径上的浮点位置
      const floatIdx = p * (TOTAL - 1)
      const segIdx = Math.min(Math.floor(floatIdx), TOTAL - 2)
      const segProgress = floatIdx - segIdx

      // 当前线段的起止位置
      const [cx, cy] = PATH[segIdx]
      const [nx, ny] = PATH[segIdx + 1]

      // 插值计算 track 位移
      const tx = -(cx + (nx - cx) * segProgress) * vw
      const ty = -(cy + (ny - cy) * segProgress) * vh

      if (track) {
        track.style.transform = `translate(${tx}px, ${ty}px)`
      }

      const idx = Math.round(floatIdx)
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
  if (mainST) {
    mainST.refresh()
  }
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
  <div class="snk-page">
    <div id="snkProgress" class="snk-progress-bar"></div>
    <nav id="snkNav" class="snk-nav-dots"></nav>
    <div class="snk-indicator">
      <span class="snk-cur">1</span> / {{ TOTAL }}
    </div>

    <div id="snkArea" class="snk-scroll-area">
      <div class="snk-viewport">
        <div id="snkTrack" class="snk-track">
          <!-- 3×3 网格，面板按 grid 定位 -->
          <section
            v-for="(pos, i) in PATH"
            :key="i"
            class="snk-panel"
            :style="{
              left: pos[0] * 100 + 'vw',
              top: pos[1] * 100 + 'vh',
              background: `linear-gradient(${140 + i * 22}deg, hsl(${i * 38}, 52%, 32%), hsl(${i * 38 + 25}, 40%, 17%))`,
            }"
          >
            <span class="snk-num">{{ String(i + 1).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.snk-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #08080f;
  color: #fff;
}

.snk-scroll-area {
  position: relative;
}

.snk-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.snk-track {
  position: relative;
  will-change: transform;
  width: 300vw;
  height: 300vh;
}

.snk-panel {
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    pointer-events: none;
  }
}

.snk-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  user-select: none;
  pointer-events: none;
}

@media (max-width: 768px) {
  .snk-num {
    font-size: 3rem;
  }
}
</style>

<style lang="scss">
$accent: #34d399;

.snk-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #60a5fa, $accent);
  z-index: 1001;
}

.snk-nav-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 10px;
}

.snk-dot {
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

  &.snk-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.snk-indicator {
  position: fixed;
  top: 28px;
  right: 28px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.75);

  .snk-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>

