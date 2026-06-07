<script setup lang="ts">
/**
 * ==================== Scroll Matrix Rain ====================
 * 矩阵雨 —— 面板分成多列，竖滚驱动面板从顶部依次"下落"入场
 * 每列有不同的下落延迟，形成数字雨般的瀑布效果
 * 面板落到位后停住，继续滚动触发下一批
 *
 * 核心：3列布局，每列的面板依次从 translateY(-100vh) 落到 0
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const COLS = 3
const ROWS = 3
const TOTAL = COLS * ROWS // 9

// 下落顺序：逐行从左到右，但每列有时间差
// 行0: [0,1,2]  行1: [3,4,5]  行2: [6,7,8]
// 实际下落顺序带列延迟：0→1→2→3→4→5→6→7→8

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
    dot.className = 'mxr-dot' + (i === 0 ? ' mxr-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.mxr-dot').forEach((d, i) => {
    d.classList.toggle('mxr-active', i === index)
  })
  const el = document.querySelector('.mxr-indicator .mxr-cur')
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
  scrollArea = document.getElementById('mxrArea') as HTMLElement
  progressBar = document.getElementById('mxrProgress')
  navDots = document.getElementById('mxrNav')
  if (!scrollArea) {
    return
  }

  // 最后一个格子的 dropEnd = 8.2+1.5=9.7，需要足够的滚动空间
  const MAX_DROP = TOTAL + 2 // 11，保证所有格子都能完全落地
  scrollArea.style.height = (TOTAL + 3) * 100 + 'vh'
  const cells = gsap.utils.toArray('.mxr-cell') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate: (self) => {
      const p = self.progress
      // 整体进度映射到足够覆盖所有格子下落的范围
      const dropProgress = p * MAX_DROP

      cells.forEach((cell, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        // 下落顺序索引(行优先+列延迟)
        const orderIdx = row * COLS + col
        // 列延迟：中间列稍快
        const colDelay = col === 1 ? -0.3 : col === 0 ? 0 : 0.2
        const dropStart = orderIdx + colDelay
        const dropEnd = dropStart + 1.5

        // 当前格子的下落进度 0~1
        const cellProg = Math.max(0, Math.min(1, (dropProgress - dropStart) / (dropEnd - dropStart)))

        // 下落动画：从上方飞入
        const yOff = (1 - cellProg) * -120 // 百分比偏移
        const scale = 0.6 + cellProg * 0.4
        const opacity = cellProg
        // 落地弹跳
        const bounce = cellProg > 0.8 ? Math.sin((cellProg - 0.8) / 0.2 * Math.PI) * 8 : 0

        cell.style.transform = `translateY(${yOff}%) scale(${scale}) translateY(${-bounce}px)`
        cell.style.opacity = String(opacity)

        // 落下的格子有微弱发光
        if (cellProg > 0.9) {
          cell.classList.add('mxr-landed')
        } else {
          cell.classList.remove('mxr-landed')
        }
      })

      // 当前高亮的格子
      const idx = Math.min(TOTAL - 1, Math.floor(p * TOTAL))
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
  <div class="mxr-page">
    <div id="mxrProgress" class="mxr-progress-bar"></div>
    <nav id="mxrNav" class="mxr-nav-dots"></nav>
    <div class="mxr-indicator">
      <span class="mxr-cur">1</span> / {{ TOTAL }}
    </div>

    <div id="mxrArea" class="mxr-scroll-area">
      <div class="mxr-viewport">
        <div class="mxr-grid">
          <div
            v-for="n in TOTAL"
            :key="n"
            class="mxr-cell"
            :style="{
              background: `linear-gradient(180deg, hsl(${150 + ((n - 1) % COLS) * 10 + Math.floor((n - 1) / COLS) * 20}, 50%, 28%) 0%, hsl(${170 + ((n - 1) % COLS) * 10 + Math.floor((n - 1) / COLS) * 20}, 35%, 86%) 100%)`,
            }"
          >
            <span class="mxr-num">{{ String(n).padStart(2, '0') }}</span>
            <!-- 下落尾迹装饰 -->
            <div class="mxr-trail"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mxr-page {
  font-family: 'Courier New', monospace;
  background: #f5f0f8;
  color: #1a1a2e;
}

.mxr-scroll-area {
  position: relative;
}

.mxr-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mxr-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  width: 88vw;
  height: 88vh;
}

.mxr-cell {
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  will-change: transform, opacity;
  opacity: 0;
  border: 1px solid rgba(80, 255, 160, 0.06);
  overflow: hidden;
  transition: box-shadow 0.3s;

  &.mxr-landed {
    box-shadow: 0 0 20px rgba(80, 255, 160, 0.08);
  }
}

.mxr-num {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  color: rgba(80, 255, 160, 0.08);
  user-select: none;
  pointer-events: none;
  z-index: 1;
}

.mxr-trail {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 60%;
  background: linear-gradient(to bottom, rgba(80, 255, 160, 0.08), transparent);
  pointer-events: none;
}
</style>

<style lang="scss">
$accent: #34d399;

.mxr-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #059669);
  z-index: 1001;
}

.mxr-nav-dots {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mxr-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(80, 255, 160, 0.12);
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition: all 0.3s;

  &:hover {
    background: rgba(80, 255, 160, 0.4);
    transform: scale(1.3);
  }

  &.mxr-active {
    background: $accent;
    border-color: rgba(26, 26, 46, 0.3);
    transform: scale(1.5);
    box-shadow: 0 0 12px rgba($accent, 0.5);
  }
}

.mxr-indicator {
  position: fixed;
  top: 28px;
  right: 28px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 0.85rem;
  border: 1px solid rgba(80, 255, 160, 0.1);
  color: rgba(80, 255, 160, 0.6);

  .mxr-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>


