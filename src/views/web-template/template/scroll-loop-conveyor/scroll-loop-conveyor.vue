<script setup lang="ts">
/**
 * ==================== Scroll Loop Conveyor ====================
 * 无限循环传送带 —— 多张卡片同时可见，弧形路径，无限循环
 * 用 ScrollTrigger scrub 驱动，modulo 取余实现循环
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const VISIBLE = 5
const HALF = Math.floor(VISIBLE / 2)
// 给足滚动空间让循环看起来流畅(每个面板2屏，多留余量)
const SCROLL_VH = TOTAL * 3

let currentIndex = 0
let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

function createNavDots() {
  const el = document.getElementById('lcvNav')
  if (!el) return
  el.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'lcv-dot' + (i === 0 ? ' lcv-active' : '')
    dot.addEventListener('click', () => goTo(i))
    el.appendChild(dot)
  }
}

function updateUI(index: number) {
  index = mod(index, TOTAL)
  document.querySelectorAll('.lcv-dot').forEach((d, i) => {
    d.classList.toggle('lcv-active', i === index)
  })
  const el = document.querySelector('.lcv-indicator .lcv-cur')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
}

function goTo(index: number) {
  if (!mainST) return
  // 计算目标 progress
  const targetProg = index / (TOTAL * 3 - 1)
  const scrollTarget = mainST.start + (mainST.end - mainST.start) * targetProg
  gsap.to(window, {
    scrollTo: { y: scrollTarget, autoKill: false },
    duration: 0.6,
    ease: 'power2.inOut',
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault()
    goTo(mod(currentIndex + 1, TOTAL))
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault()
    goTo(mod(currentIndex - 1, TOTAL))
  }
}

function layoutCards(scrollPos: number) {
  const cards = document.querySelectorAll('.lcv-card') as NodeListOf<HTMLElement>
  if (!cards.length) return

  const focusIdx = mod(scrollPos, TOTAL)

  cards.forEach((card, i) => {
    let dist = i - focusIdx
    if (dist > TOTAL / 2) dist -= TOTAL
    if (dist < -TOTAL / 2) dist += TOTAL

    const absDist = Math.abs(dist)

    if (absDist > HALF + 0.8) {
      card.style.visibility = 'hidden'
      return
    }
    card.style.visibility = 'visible'

    const xPos = dist * 22
    const yPos = absDist * absDist * 18
    const scale = Math.max(0.55, 1 - absDist * 0.16)
    const rotY = dist * -12
    const opacity = Math.max(0.15, 1 - absDist * 0.3)
    const zIndex = 100 - Math.round(absDist * 10)

    card.style.transform = `perspective(1200px) translateX(${xPos}vw) translateY(${yPos}px) rotateY(${rotY}deg) scale(${scale})`
    card.style.opacity = String(opacity)
    card.style.zIndex = String(zIndex)
  })

  // 滚轮旋转
  const rollers = document.querySelectorAll('.lcv-roller') as NodeListOf<HTMLElement>
  rollers.forEach((r) => {
    r.style.transform = `rotate(${scrollPos * 60}deg)`
  })
}

function init() {
  scrollArea = document.getElementById('lcvArea') as HTMLElement
  progressBar = document.getElementById('lcvProgress')
  if (!scrollArea) return

  scrollArea.style.height = SCROLL_VH * 100 + 'vh'

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
    onUpdate: (self) => {
      // progress 0→1 映射到 0→TOTAL*3 的浮点索引
      const floatIdx = self.progress * (TOTAL * 3 - 1)
      layoutCards(floatIdx)

      const idx = mod(Math.round(floatIdx), TOTAL)
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
  layoutCards(0)
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
  <div class="lcv-page">
    <div id="lcvProgress" class="lcv-progress-bar"></div>
    <nav id="lcvNav" class="lcv-nav-dots"></nav>
    <div class="lcv-indicator">
      <span class="lcv-cur">1</span>
      <span class="lcv-tot"> / {{ TOTAL }}</span>
      <span class="lcv-loop-badge">∞</span>
    </div>

    <div id="lcvArea" class="lcv-scroll-area">
      <div class="lcv-viewport">
        <div class="lcv-track"></div>
        <div class="lcv-stage">
          <div
            v-for="n in TOTAL"
            :key="n"
            class="lcv-card"
            :style="{
              background: `linear-gradient(${150 + (n - 1) * 20}deg, hsl(${(n - 1) * 44 + 200}, 55%, 30%), hsl(${(n - 1) * 44 + 220}, 42%, 17%))`,
            }"
          >
            <span class="lcv-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
        </div>
        <div class="lcv-rollers">
          <div class="lcv-roller"></div>
          <div class="lcv-roller"></div>
          <div class="lcv-roller"></div>
          <div class="lcv-roller"></div>
          <div class="lcv-roller"></div>
        </div>
        <div class="lcv-ground-shadow"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lcv-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #060610;
  color: #fff;
}

.lcv-scroll-area {
  position: relative;
}

.lcv-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lcv-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.lcv-card {
  position: absolute;
  width: 30vw;
  height: 50vh;
  max-width: 400px;
  left: 50%;
  top: 50%;
  margin-left: -15vw;
  margin-top: -25vh;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.5);
  visibility: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 12px;
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 14px;
    pointer-events: none;
  }
}

.lcv-num {
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.06);
  user-select: none;
  pointer-events: none;
}

/* 弧形轨道装饰 */
.lcv-track {
  position: absolute;
  bottom: 18vh;
  left: 5%;
  right: 5%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.03) 20%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.03) 80%, transparent 100%);
  border-radius: 50%;
  pointer-events: none;
}

/* 底部滚轮 */
.lcv-rollers {
  position: absolute;
  bottom: 16vh;
  left: 10%;
  right: 10%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.lcv-roller {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.06);
  will-change: transform;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 2px;
    background: rgba(255, 255, 255, 0.08);
    transform: translate(-50%, -50%);
  }
}

/* 地面阴影 */
.lcv-ground-shadow {
  position: absolute;
  bottom: 12vh;
  left: 30%;
  right: 30%;
  height: 30px;
  background: radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.3), transparent);
  pointer-events: none;
}

@media (max-width: 768px) {
  .lcv-card {
    width: 55vw;
    height: 40vh;
    margin-left: -27.5vw;
    margin-top: -20vh;
  }
}
</style>

<style lang="scss">
$accent: #f472b6;

.lcv-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #c084fc, $accent);
  z-index: 1001;
  box-shadow: 0 0 8px rgba($accent, 0.4);
}

.lcv-nav-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 14px;
}

.lcv-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.45);
    transform: scale(1.3);
  }

  &.lcv-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.4);
    box-shadow: 0 0 18px rgba($accent, 0.5);
  }
}

.lcv-indicator {
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
  gap: 6px;

  .lcv-cur {
    color: $accent;
    font-weight: 700;
  }

  .lcv-loop-badge {
    margin-left: 6px;
    font-size: 0.7rem;
    color: rgba($accent, 0.7);
    border: 1px solid rgba($accent, 0.3);
    padding: 1px 6px;
    border-radius: 8px;
  }
}
</style>

