<script setup lang="ts">
/**
 * ==================== Scroll Ripple Reveal ====================
 * 涟漪揭示 —— 从中心泛起涟漪波纹，逐步揭示新面板
 * 用多个同心圆 clip-path 实现，波纹从中心向外扩散
 * 每个波纹圈有不同的扩散速度形成涟漪效果
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const RINGS = 5 // 涟漪圈数

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
    dot.className = 'rpl-dot' + (i === 0 ? ' rpl-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.rpl-dot').forEach((d, i) => d.classList.toggle('rpl-active', i === index))
  const el = document.querySelector('.rpl-indicator .rpl-cur')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
}
function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' })
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) }
}

function init() {
  scrollArea = document.getElementById('rplArea') as HTMLElement
  progressBar = document.getElementById('rplProgress')
  navDots = document.getElementById('rplNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.rpl-panel') as HTMLElement[]

  // 涟漪装饰环
  const rippleRings = document.querySelectorAll('.rpl-ring') as NodeListOf<HTMLElement>

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      panels.forEach((panel, i) => {
        const dist = i - focus
        if (dist <= -1) {
          panel.style.clipPath = 'circle(150% at 50% 50%)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
        } else if (dist >= 1) {
          panel.style.clipPath = 'circle(0% at 50% 50%)'
          panel.style.opacity = '0'
          panel.style.zIndex = String(TOTAL + i)
        } else if (dist > 0) {
          const p = 1 - dist
          // 涟漪式扩散：不是线性扩大，而是带波动
          const wave = Math.sin(p * Math.PI * 3) * 5 // 波动幅度
          const radius = p * 150 + wave
          panel.style.clipPath = `circle(${Math.max(0, radius)}% at 50% 50%)`
          panel.style.opacity = '1'
          panel.style.zIndex = String(TOTAL + i)
        } else {
          panel.style.clipPath = 'circle(150% at 50% 50%)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
        }
      })

      // 涟漪装饰环动画
      const frac = focus % 1
      rippleRings.forEach((ring, ri) => {
        const ringDelay = ri * 0.15
        const ringP = Math.max(0, Math.min(1, (frac - ringDelay) / (1 - ringDelay)))
        const ringScale = ringP * 3
        const ringOpacity = Math.sin(ringP * Math.PI) * 0.15
        ring.style.transform = `translate(-50%, -50%) scale(${ringScale})`
        ring.style.opacity = String(ringOpacity)
      })

      const idx = Math.round(focus)
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    },
  })
  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  document.addEventListener('keydown', onKeydown)
  createNavDots(); updateUI(0)
}
function destroy() { mainST?.kill(); mainST = null; document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="rpl-page">
    <div id="rplProgress" class="rpl-progress-bar"></div>
    <nav id="rplNav" class="rpl-nav-dots"></nav>
    <div class="rpl-indicator"><span class="rpl-cur">1</span> / {{ TOTAL }}</div>

    <!-- 涟漪装饰环 -->
    <div class="rpl-rings-container">
      <div v-for="r in RINGS" :key="r" class="rpl-ring"></div>
    </div>

    <div id="rplArea" class="rpl-scroll-area">
      <div class="rpl-viewport">
        <section v-for="n in TOTAL" :key="n" class="rpl-panel"
          :style="{ background: `radial-gradient(circle at 50% 50%, hsl(${(n-1)*44}, 50%, 32%), hsl(${(n-1)*44+20}, 38%, 12%))` }">
          <span class="rpl-num">{{ String(n).padStart(2, '0') }}</span>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rpl-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.rpl-scroll-area { position: relative; }
.rpl-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.rpl-panel {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: clip-path, opacity;
  &::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; pointer-events: none; }
}
.rpl-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(26, 26, 46,0.05); user-select: none; pointer-events: none; }

.rpl-rings-container {
  position: fixed; top: 50%; left: 50%; z-index: 500; pointer-events: none;
}
.rpl-ring {
  position: absolute; top: 0; left: 0;
  width: 100px; height: 100px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  will-change: transform, opacity;
}
</style>

<style lang="scss">
$accent: #6366f1;
.rpl-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #a78bfa); z-index: 1001; }
.rpl-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.rpl-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.rpl-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.rpl-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .rpl-cur { color: $accent; font-weight: 700; }
}
</style>

