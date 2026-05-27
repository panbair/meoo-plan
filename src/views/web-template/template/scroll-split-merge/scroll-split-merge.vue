<script setup lang="ts">
/**
 * ==================== Scroll Split Merge ====================
 * 劈合入场 —— 面板交替使用两种入场方式：
 *   奇数面板(1,3,5,7)：整体从上往下平移入场
 *   偶数面板(2,4,6,8)：拆成左右两半，左半从左滑入+右半从右滑入，
 *     到达中间合并成完整面板
 *
 * 核心：
 *   - sticky 视口锁定
 *   - 奇数面板：单个 div，translateY(-100%→0)
 *   - 偶数面板：两个半幅 div(clip-path 裁剪左右半)，分别 translateX 滑入
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8

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
    dot.className = 'spm-dot' + (i === 0 ? ' spm-active' : '')
    dot.setAttribute('data-type', i % 2 === 0 ? 'slide' : 'split')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.spm-dot').forEach((d, i) => {
    d.classList.toggle('spm-active', i === index)
  })
  const el = document.querySelector('.spm-indicator .spm-cur')
  if (el) {
    el.textContent = String(index + 1)
  }
  const typeEl = document.querySelector('.spm-indicator .spm-type')
  if (typeEl) {
    typeEl.textContent = index % 2 === 0 ? '↓' : '⟨⟩'
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
  scrollArea = document.getElementById('spmArea') as HTMLElement
  progressBar = document.getElementById('spmProgress')
  navDots = document.getElementById('spmNav')
  if (!scrollArea) {
    return
  }

  scrollArea.style.height = TOTAL * 100 + 'vh'

  // 收集所有面板组(每个面板组是一个 .spm-group)
  const groups = gsap.utils.toArray('.spm-group') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const focus = p * (TOTAL - 1)

      groups.forEach((group, i) => {
        const dist = i - focus // 负=已过, 正=未到
        const isSlide = i % 2 === 0 // 奇数面板(0-indexed偶数)=下滑
        const isSplit = !isSlide      // 偶数面板=劈合

        if (isSlide) {
          // === 整体下滑入场 ===
          const panel = group.querySelector('.spm-slide') as HTMLElement
          if (!panel) {
            return
          }

          if (dist <= -1) {
            panel.style.transform = 'translateY(0%)'
            panel.style.opacity = '1'
            group.style.zIndex = String(i)
          } else if (dist >= 1) {
            panel.style.transform = 'translateY(-100%)'
            panel.style.opacity = '0'
            group.style.zIndex = String(TOTAL + i)
          } else if (dist > 0) {
            // 正在入场
            const enterProg = 1 - dist
            panel.style.transform = `translateY(${-100 * (1 - enterProg)}%)`
            panel.style.opacity = String(Math.min(1, enterProg * 2))
            group.style.zIndex = String(TOTAL + i)
          } else {
            // 已入场，停留
            panel.style.transform = 'translateY(0%)'
            panel.style.opacity = '1'
            group.style.zIndex = String(i)
          }
        } else {
          // === 左右劈合入场 ===
          const leftHalf = group.querySelector('.spm-left') as HTMLElement
          const rightHalf = group.querySelector('.spm-right') as HTMLElement
          if (!leftHalf || !rightHalf) {
            return
          }

          if (dist <= -1) {
            leftHalf.style.transform = 'translateX(0%)'
            rightHalf.style.transform = 'translateX(0%)'
            leftHalf.style.opacity = '1'
            rightHalf.style.opacity = '1'
            group.style.zIndex = String(i)
          } else if (dist >= 1) {
            leftHalf.style.transform = 'translateX(-100%)'
            rightHalf.style.transform = 'translateX(100%)'
            leftHalf.style.opacity = '0'
            rightHalf.style.opacity = '0'
            group.style.zIndex = String(TOTAL + i)
          } else if (dist > 0) {
            // 正在合并入场
            const enterProg = 1 - dist // 0→1
            const xOff = 100 * (1 - enterProg)
            leftHalf.style.transform = `translateX(${-xOff}%)`
            rightHalf.style.transform = `translateX(${xOff}%)`
            leftHalf.style.opacity = String(Math.min(1, enterProg * 2))
            rightHalf.style.opacity = String(Math.min(1, enterProg * 2))
            group.style.zIndex = String(TOTAL + i)
          } else {
            // 已合并，停留
            leftHalf.style.transform = 'translateX(0%)'
            rightHalf.style.transform = 'translateX(0%)'
            leftHalf.style.opacity = '1'
            rightHalf.style.opacity = '1'
            group.style.zIndex = String(i)
          }
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
  <div class="spm-page">
    <div id="spmProgress" class="spm-progress-bar"></div>
    <nav id="spmNav" class="spm-nav-dots"></nav>
    <div class="spm-indicator">
      <span class="spm-type">↓</span>
      <span class="spm-cur">1</span>
      <span class="spm-tot"> / {{ TOTAL }}</span>
    </div>

    <div id="spmArea" class="spm-scroll-area">
      <div class="spm-viewport">
        <div
          v-for="n in TOTAL"
          :key="n"
          class="spm-group"
        >
          <!-- 奇数面板(1,3,5,7)：整体下滑 -->
          <template v-if="(n - 1) % 2 === 0">
            <div
              class="spm-slide spm-panel"
              :style="{
                background: `linear-gradient(${155 + (n - 1) * 20}deg, hsl(${(n - 1) * 44}, 50%, 30%), hsl(${(n - 1) * 44 + 20}, 38%, 16%))`,
              }"
            >
              <span class="spm-num">{{ String(n).padStart(2, '0') }}</span>
              <div class="spm-mode-label">↓ 整体下滑</div>
            </div>
          </template>

          <!-- 偶数面板(2,4,6,8)：左右劈合 -->
          <template v-else>
            <!-- 左半 -->
            <div
              class="spm-left spm-panel spm-half"
              :style="{
                background: `linear-gradient(${140 + (n - 1) * 20}deg, hsl(${(n - 1) * 44}, 50%, 30%), hsl(${(n - 1) * 44 + 20}, 38%, 16%))`,
              }"
            >
              <span class="spm-num spm-num-left">{{ String(n).padStart(2, '0') }}</span>
              <div class="spm-mode-label">⟨⟩ 劈合</div>
            </div>
            <!-- 右半 -->
            <div
              class="spm-right spm-panel spm-half"
              :style="{
                background: `linear-gradient(${140 + (n - 1) * 20}deg, hsl(${(n - 1) * 44}, 50%, 30%), hsl(${(n - 1) * 44 + 20}, 38%, 16%))`,
              }"
            >
              <span class="spm-num spm-num-right">{{ String(n).padStart(2, '0') }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.spm-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #08080f;
  color: #fff;
}

.spm-scroll-area {
  position: relative;
}

.spm-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.spm-group {
  position: absolute;
  inset: 0;
}

.spm-panel {
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

/* 整体下滑面板 */
.spm-slide {
  /* 默认全屏 */
}

/* 左右半幅面板 */
.spm-half {
  will-change: transform, opacity;
}

.spm-left {
  clip-path: inset(0 50% 0 0); /* 只显示左半 */
}

.spm-right {
  clip-path: inset(0 0 0 50%); /* 只显示右半 */
}

.spm-num {
  font-size: clamp(5rem, 12vw, 10rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  user-select: none;
  pointer-events: none;
}

/* 左半的数字靠右对齐，右半的靠左，合并后刚好重合 */
.spm-num-left {
  position: relative;
}

.spm-num-right {
  position: relative;
}

.spm-mode-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.08);
  letter-spacing: 3px;
  pointer-events: none;
}

/* 合并中缝线(装饰) */
.spm-left::after {
  content: '';
  position: absolute;
  right: 0;
  top: 10%;
  bottom: 10%;
  width: 1px;
  background: rgba(255, 255, 255, 0.03);
  pointer-events: none;
}
</style>

<style lang="scss">
$c-slide: #60a5fa;
$c-split: #f472b6;

.spm-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $c-slide, $c-split, $c-slide, $c-split);
  z-index: 1001;
}

.spm-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spm-dot {
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

  &[data-type='slide'].spm-active {
    background: $c-slide;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-slide, 0.5);
  }

  &[data-type='split'].spm-active {
    background: $c-split;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($c-split, 0.5);
  }
}

.spm-indicator {
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
  display: flex;
  align-items: center;
  gap: 8px;

  .spm-type {
    font-size: 1rem;
    font-weight: 700;
    transition: color 0.3s;
  }

  .spm-cur {
    font-weight: 700;
  }
}
</style>

