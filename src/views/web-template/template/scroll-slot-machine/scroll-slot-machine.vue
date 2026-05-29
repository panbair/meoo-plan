<script setup lang="ts">
/**
 * ==================== Scroll Slot Machine ====================
 * 老虎机 —— 三列面板像老虎机卷轴独立纵向滚动
 * 左列最快停下，中列次之，右列最后停下
 * 竖滚驱动三列以不同速率 translateY
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const ROWS = 4
const COLS = 3
const TOTAL = ROWS // 以行为单位计数
const COL_SPEEDS = [1, 1.3, 1.7] // 三列速度差异

let currentIndex = 0
let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null
let cellH = 0

function createNavDots() {
  if (!navDots) {
    return
  }
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'slm-dot' + (i === 0 ? ' slm-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.slm-dot').forEach((d, i) => {
    d.classList.toggle('slm-active', i === index)
  })
  const el = document.querySelector('.slm-indicator .slm-cur')
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
  scrollArea = document.getElementById('slmArea') as HTMLElement
  progressBar = document.getElementById('slmProgress')
  navDots = document.getElementById('slmNav')
  if (!scrollArea) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'

  const reels = document.querySelectorAll('.slm-reel') as NodeListOf<HTMLElement>
  const windowEl = document.querySelector('.slm-window') as HTMLElement
  if (windowEl) {
    cellH = windowEl.clientHeight
  }

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress

      reels.forEach((reel, colIdx) => {
        const speed = COL_SPEEDS[colIdx]
        // 每列的卷轴偏移（带速度差）
        const rawOffset = p * (ROWS - 1) * cellH * speed
        // 限制在有效范围内
        const maxOffset = (ROWS - 1) * cellH
        const offset = Math.min(rawOffset, maxOffset)
        reel.style.transform = `translateY(${-offset}px)`

        // 高亮当前可见的 cell
        const cells = reel.querySelectorAll('.slm-cell') as NodeListOf<HTMLElement>
        const visibleIdx = Math.round(offset / cellH)
        cells.forEach((cell, rowIdx) => {
          const isVisible = rowIdx === visibleIdx
          cell.classList.toggle('slm-visible', isVisible)
        })
      })

      const idx = Math.round(p * (TOTAL - 1))
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
  <div class="slm-page">
    <div id="slmProgress" class="slm-progress-bar"></div>
    <nav id="slmNav" class="slm-nav-dots"></nav>
    <div class="slm-indicator">
      <span class="slm-cur">1</span> / {{ TOTAL }}
    </div>

    <div id="slmArea" class="slm-scroll-area">
      <div class="slm-viewport">
        <!-- 老虎机外框 -->
        <div class="slm-machine">
          <div class="slm-window">
            <div
              v-for="col in COLS"
              :key="col"
              class="slm-reel-wrapper"
            >
              <div class="slm-reel">
                <div
                  v-for="row in ROWS"
                  :key="row"
                  class="slm-cell"
                  :class="{ 'slm-visible': row === 1 }"
                  :style="{
                    background: `linear-gradient(150deg, hsl(${((col - 1) * 3 + (row - 1)) * 38}, 50%, 28%), hsl(${((col - 1) * 3 + (row - 1)) * 38 + 20}, 38%, 86%))`,
                  }"
                >
                  <span class="slm-num">{{ String((row - 1) * COLS + col).padStart(2, '0') }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 中线指示 -->
          <div class="slm-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slm-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f0f8;
  color: #1a1a2e;
}

.slm-scroll-area {
  position: relative;
}

.slm-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slm-machine {
  position: relative;
  width: 80vw;
  max-width: 900px;
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 8px;
  background: rgba(26, 26, 46, 0.02);
}

.slm-window {
  display: flex;
  gap: 8px;
  height: 60vh;
  overflow: hidden;
  border-radius: 14px;
}

.slm-reel-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 10px;
}

.slm-reel {
  will-change: transform;
}

.slm-cell {
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: box-shadow 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.04);

  &.slm-visible {
    box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.03);
  }
}

.slm-num {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  color: rgba(26, 26, 46, 0.06);
  user-select: none;
  pointer-events: none;
}

.slm-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 200, 50, 0.15), transparent);
  pointer-events: none;
  z-index: 10;
}

@media (max-width: 768px) {
  .slm-machine {
    width: 94vw;
  }
}
</style>

<style lang="scss">
$accent: #fbbf24;

.slm-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #f59e0b);
  z-index: 1001;
}

.slm-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slm-dot {
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

  &.slm-active {
    background: $accent;
    border-color: rgba(26, 26, 46, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.slm-indicator {
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

  .slm-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>

