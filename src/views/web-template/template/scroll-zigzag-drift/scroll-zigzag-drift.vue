<script setup lang="ts">
/**
 * ==================== Scroll Zigzag Drift ====================
 * 锯齿漂移 —— 融合 fake-horizontal-scroll 的 scrub 横移
 * 与 infinite-scroll 的纵向布局，但每个面板交替从左/右入场
 *
 * 核心机制：
 *   1. 面板纵向堆叠(每屏 100vh)，用户正常纵向滚动
 *   2. 每个面板具有 X 方向的初始偏移(奇左偶右)
 *   3. ScrollTrigger scrub 驱动每个面板从侧方滑入视口中心
 *   4. 同时伴随轻微旋转(rotate)，形成锯齿蛇形路径感
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 7
const DRIFT_X = 65 // 侧向偏移百分比(vw)
const DRIFT_ROT = 8 // 旋转角度

let currentIndex = 0
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let triggers: ScrollTrigger[] = []

function createNavDots() {
  if (!navDots) {
    return
  }
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'zzd-dot' + (i === 0 ? ' zzd-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.zzd-dot').forEach((d, i) => {
    d.classList.toggle('zzd-active', i === index)
  })
  const el = document.querySelector('.zzd-indicator .zzd-cur')
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
  progressBar = document.getElementById('zzdProgress')
  navDots = document.getElementById('zzdNav')

  const panels = gsap.utils.toArray('.zzd-panel') as HTMLElement[]

  panels.forEach((panel, i) => {
    // 奇数面板从右侧进入，偶数从左侧
    const fromRight = i % 2 === 1
    const xOffset = fromRight ? DRIFT_X : -DRIFT_X
    const rot = fromRight ? DRIFT_ROT : -DRIFT_ROT

    // 设置初始偏移态
    gsap.set(panel, {
      xPercent: i === 0 ? 0 : xOffset,
      rotation: i === 0 ? 0 : rot,
      opacity: i === 0 ? 1 : 0,
      scale: i === 0 ? 1 : 0.85,
    })

    if (i === 0) {
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'top bottom',
        end: 'top 20%',
        scrub: 0.6,
        onEnter: () => {
          if (i !== currentIndex) {
            currentIndex = i
            updateUI(i)
          }
        },
        onEnterBack: () => {
          if (i - 1 !== currentIndex) {
            currentIndex = Math.max(0, i - 1)
            updateUI(currentIndex)
          }
        },
      },
    })

    tl.to(panel, {
      xPercent: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      ease: 'power2.out',
    })

    if (tl.scrollTrigger) {
      triggers.push(tl.scrollTrigger)
    }
  })

  document.addEventListener('keydown', onKeydown)
  createNavDots()
  updateUI(0)
}

function destroy() {
  triggers.forEach((st) => st.kill())
  triggers = []
  document.removeEventListener('keydown', onKeydown)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="zzd-page">
    <div id="zzdProgress" class="zzd-progress-bar"></div>
    <nav id="zzdNav" class="zzd-nav-dots"></nav>
    <div class="zzd-indicator">
      <span class="zzd-cur">1</span> / {{ TOTAL }}
    </div>

    <section
      v-for="n in TOTAL"
      :key="n"
      class="zzd-panel"
      :style="{
        background: `linear-gradient(${135 + (n - 1) * 20}deg, hsl(${(n - 1) * 50}, 55%, 32%), hsl(${(n - 1) * 50 + 30}, 45%, 18%))`,
      }"
    >
      <span class="zzd-num">{{ String(n).padStart(2, '0') }}</span>
      <div class="zzd-dir-hint">
        {{ n % 2 === 0 ? '→' : '←' }}
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.zzd-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0e0e18;
  color: #fff;
}

.zzd-panel {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  will-change: transform, opacity;

  &::before {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    pointer-events: none;
  }
}

.zzd-num {
  font-size: clamp(5rem, 12vw, 10rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.04);
  user-select: none;
  pointer-events: none;
}

.zzd-dir-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.08);
  pointer-events: none;
}
</style>

<style lang="scss">
$accent: #a78bfa;

.zzd-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #f472b6);
  z-index: 1001;
}

.zzd-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.zzd-dot {
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

  &.zzd-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.zzd-indicator {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);

  .zzd-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>



