<script setup lang="ts">
/**
 * ==================== Scroll Iris Open ====================
 * 光圈打开 —— 面板用 clip-path: circle() 从中心小圆逐渐扩大到全屏
 * 像相机光圈/瞳孔张开一样的揭示效果
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
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'irs-dot' + (i === 0 ? ' irs-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.irs-dot').forEach((d, i) => d.classList.toggle('irs-active', i === index))
  const el = document.querySelector('.irs-indicator .irs-cur')
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
  scrollArea = document.getElementById('irsArea') as HTMLElement
  progressBar = document.getElementById('irsProgress')
  navDots = document.getElementById('irsNav')
  if (!scrollArea) return

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.irs-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      panels.forEach((panel, i) => {
        const dist = i - focus
        if (dist <= -1) {
          panel.style.clipPath = 'circle(150% at 50% 50%)'
          panel.style.zIndex = String(i)
          panel.style.opacity = '1'
        } else if (dist >= 1) {
          panel.style.clipPath = 'circle(0% at 50% 50%)'
          panel.style.zIndex = String(TOTAL + i)
          panel.style.opacity = '0'
        } else if (dist > 0) {
          const enterProg = 1 - dist
          const radius = enterProg * 150
          panel.style.clipPath = `circle(${radius}% at 50% 50%)`
          panel.style.zIndex = String(TOTAL + i)
          panel.style.opacity = '1'
        } else {
          panel.style.clipPath = 'circle(150% at 50% 50%)'
          panel.style.zIndex = String(i)
          panel.style.opacity = '1'
        }
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
  <div class="irs-page">
    <div id="irsProgress" class="irs-progress-bar"></div>
    <nav id="irsNav" class="irs-nav-dots"></nav>
    <div class="irs-indicator"><span class="irs-cur">1</span> / {{ TOTAL }}</div>
    <div id="irsArea" class="irs-scroll-area">
      <div class="irs-viewport">
        <!-- 中心准星装饰 -->
        <div class="irs-reticle"></div>
        <section v-for="n in TOTAL" :key="n" class="irs-panel"
          :style="{ background: `radial-gradient(circle at 50% 50%, hsl(${(n-1)*44}, 50%, 32%) 0%, hsl(${(n-1)*44+20}, 38%, 86%) 100%)` }">
          <span class="irs-num">{{ String(n).padStart(2, '0') }}</span>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.irs-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.irs-scroll-area { position: relative; }
.irs-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.irs-panel {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: clip-path, opacity;
  &::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; pointer-events: none; }
}
.irs-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(26, 26, 46,0.05); user-select: none; pointer-events: none; }
.irs-reticle {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 60px; height: 60px;
  border: 1px solid rgba(255,255,255,0.06); border-radius: 50%; z-index: 500; pointer-events: none;
  &::before, &::after { content: ''; position: absolute; background: rgba(26, 26, 46,0.04); }
  &::before { width: 1px; height: 20px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
  &::after { width: 20px; height: 1px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
}
</style>

<style lang="scss">
$accent: #f59e0b;
.irs-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #ef4444); z-index: 1001; }
.irs-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.irs-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.irs-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.irs-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .irs-cur { color: $accent; font-weight: 700; }
}
</style>

