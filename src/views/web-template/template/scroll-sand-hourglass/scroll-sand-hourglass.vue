<script setup lang="ts">
/**
 * ==================== Scroll Sand Hourglass ====================
 * 沙漏 —— 上面板像沙子从中间漏口往下流走，流完露出下一个面板
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
    dot.className = 'shg-dot' + (i === 0 ? ' shg-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.shg-dot').forEach((d, i) => d.classList.toggle('shg-active', i === index))
  const el = document.querySelector('.shg-indicator .shg-cur')
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
  scrollArea = document.getElementById('shgArea') as HTMLElement
  progressBar = document.getElementById('shgProgress')
  navDots = document.getElementById('shgNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.shg-panel') as HTMLElement[]
  const sandStream = document.querySelector('.shg-stream') as HTMLElement

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      panels.forEach((panel, i) => {
        const dist = i - focus
        if (dist <= -1) {
          panel.style.clipPath = 'inset(100% 0 0 0)'; panel.style.zIndex = String(i); panel.style.opacity = '1'
        } else if (dist >= 1) {
          panel.style.clipPath = 'inset(0 0 100% 0)'; panel.style.zIndex = String(TOTAL + i); panel.style.opacity = '0'
        } else if (dist > 0) {
          const p = 1 - dist; const eased = p * p
          panel.style.clipPath = `inset(0 0 ${100*(1-eased)}% 0)`; panel.style.zIndex = String(TOTAL + i); panel.style.opacity = '1'
        } else if (dist > -1) {
          const drainP = -dist; const eased = drainP * drainP
          panel.style.clipPath = `inset(${100*eased}% 0 0 0)`; panel.style.zIndex = String(TOTAL - 1); panel.style.opacity = '1'
        }
      })
      const frac = focus % 1
      if (sandStream) {
        sandStream.style.opacity = frac > 0.05 && frac < 0.95 ? String(Math.sin(frac * Math.PI) * 0.6) : '0'
      }
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
  <div class="shg-page">
    <div id="shgProgress" class="shg-progress-bar"></div>
    <nav id="shgNav" class="shg-nav-dots"></nav>
    <div class="shg-indicator"><span class="shg-cur">1</span> / {{ TOTAL }}</div>
    <div class="shg-hourglass">
      <div class="shg-neck"></div>
      <div class="shg-stream"></div>
    </div>
    <div id="shgArea" class="shg-scroll-area">
      <div class="shg-viewport">
        <section v-for="n in TOTAL" :key="n" class="shg-panel"
          :style="{ background: `linear-gradient(180deg, hsl(${(n-1)*44+30}, 45%, 28%), hsl(${(n-1)*44+50}, 35%, 14%))` }">
          <span class="shg-num">{{ String(n).padStart(2, '0') }}</span>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shg-page { font-family: system-ui, sans-serif; background: #0a0808; color: #fff; }
.shg-scroll-area { position: relative; }
.shg-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.shg-panel {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: clip-path, opacity;
  &::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(255,255,255,0.04); border-radius: 20px; pointer-events: none; }
}
.shg-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(255,255,255,0.04); user-select: none; pointer-events: none; }
.shg-hourglass { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 500; }
.shg-neck {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 4px; height: 20px; background: rgba(210,180,120,0.15); border-radius: 2px;
  box-shadow: 0 0 20px rgba(210,180,120,0.1);
}
.shg-stream {
  position: absolute; left: 50%; top: 35%; transform: translateX(-50%);
  width: 2px; height: 30vh; background: linear-gradient(180deg, rgba(210,180,120,0.4), rgba(210,180,120,0.1));
  opacity: 0; will-change: opacity; border-radius: 1px;
}
</style>

<style lang="scss">
$accent: #d4a55a;
.shg-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #b8860b); z-index: 1001; }
.shg-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.shg-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(210,180,120,0.4); transform: scale(1.3); }
  &.shg-active { background: $accent; border-color: rgba(255,255,255,0.25); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.shg-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(10,8,8,0.5); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(210,180,120,0.1); color: rgba(255,255,255,0.6);
  .shg-cur { color: $accent; font-weight: 700; }
}
</style>

