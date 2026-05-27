<script setup lang="ts">
/**
 * ==================== Scroll Diamond Path ====================
 * 菱形路径 —— 面板沿对角线菱形走位：
 *   ↘ 右下 → ↗ 右上 → ↘ 右下 → ↗ 右上
 *   形成锯齿钻石切面般的运动轨迹
 *
 * 布局（对角线路径）：
 *   01
 *     ↘ 02
 *       ↘ 03
 *     ↗ 04
 *   05
 *     ↘ 06
 *       ↘ 07
 *     ↗ 08
 *   09
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 9

// 菱形路径坐标 (col, row) — 从左上角出发
// 右下→右下→右上→右上 重复形成菱形
const PATH: Array<[number, number]> = [
  [0, 0],       // 01
  [1, 1],       // 02 ↘
  [2, 2],       // 03 ↘
  [3, 1],       // 04 ↗
  [4, 0],       // 05 ↗
  [5, 1],       // 06 ↘
  [6, 2],       // 07 ↘
  [7, 1],       // 08 ↗
  [8, 0],       // 09 ↗
]

// 每步位移的单位 (vw/vh 的比例)
const CELL_W = 0.5 // 每步 X 移动 50vw
const CELL_H = 0.5 // 每步 Y 移动 50vh

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
    dot.className = 'dmd-dot' + (i === 0 ? ' dmd-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.dmd-dot').forEach((d, i) => {
    d.classList.toggle('dmd-active', i === index)
  })
  const el = document.querySelector('.dmd-indicator .dmd-cur')
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

  scrollArea = document.getElementById('dmdArea') as HTMLElement
  track = document.getElementById('dmdTrack') as HTMLElement
  progressBar = document.getElementById('dmdProgress')
  navDots = document.getElementById('dmdNav')
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
      const floatIdx = p * (TOTAL - 1)
      const segIdx = Math.min(Math.floor(floatIdx), TOTAL - 2)
      const segProg = floatIdx - segIdx

      const [cx, cy] = PATH[segIdx]
      const [nx, ny] = PATH[segIdx + 1]

      const tx = -(cx + (nx - cx) * segProg) * CELL_W * vw
      const ty = -(cy + (ny - cy) * segProg) * CELL_H * vh

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
  <div class="dmd-page">
    <div id="dmdProgress" class="dmd-progress-bar"></div>
    <nav id="dmdNav" class="dmd-nav-dots"></nav>
    <div class="dmd-indicator">
      <span class="dmd-cur">1</span> / {{ TOTAL }}
    </div>

    <div id="dmdArea" class="dmd-scroll-area">
      <div class="dmd-viewport">
        <div id="dmdTrack" class="dmd-track">
          <section
            v-for="(pos, i) in PATH"
            :key="i"
            class="dmd-panel"
            :style="{
              left: pos[0] * CELL_W * 100 + 'vw',
              top: pos[1] * CELL_H * 100 + 'vh',
              background: `linear-gradient(${120 + i * 25}deg, hsl(${i * 40}, 52%, 30%), hsl(${i * 40 + 20}, 40%, 16%))`,
            }"
          >
            <span class="dmd-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="dmd-facet" :style="{ transform: `rotate(${45 + i * 10}deg)` }"></div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dmd-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #08080e;
  color: #fff;
}

.dmd-scroll-area {
  position: relative;
}

.dmd-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.dmd-track {
  position: relative;
  will-change: transform;
}

.dmd-panel {
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
    inset: 28px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    pointer-events: none;
  }
}

.dmd-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  user-select: none;
  pointer-events: none;
  z-index: 1;
}

.dmd-facet {
  position: absolute;
  width: 160px;
  height: 160px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  pointer-events: none;
}
</style>

<style lang="scss">
$accent: #f59e0b;

.dmd-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #ef4444, $accent);
  z-index: 1001;
}

.dmd-nav-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 9px;
}

.dmd-dot {
  width: 9px;
  height: 9px;
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

  &.dmd-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.dmd-indicator {
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

  .dmd-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>

