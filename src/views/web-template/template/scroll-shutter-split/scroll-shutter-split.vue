<script setup lang="ts">
/**
 * ==================== Scroll Shutter Split ====================
 * 快门四裂 —— 前一个面板像快门一样从中心向四方裂开消失
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
    dot.className = 'shs-dot' + (i === 0 ? ' shs-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.shs-dot').forEach((d, i) => d.classList.toggle('shs-active', i === index))
  const el = document.querySelector('.shs-indicator .shs-cur')
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
  scrollArea = document.getElementById('shsArea') as HTMLElement
  progressBar = document.getElementById('shsProgress')
  navDots = document.getElementById('shsNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const shutters = gsap.utils.toArray('.shs-shutter') as HTMLElement[]
  const panels = gsap.utils.toArray('.shs-content') as HTMLElement[]
  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      shutters.forEach((shutter, i) => {
        const dist = i - focus
        const tp = shutter.querySelector('.shs-top') as HTMLElement
        const bt = shutter.querySelector('.shs-bottom') as HTMLElement
        const lt = shutter.querySelector('.shs-left') as HTMLElement
        const rt = shutter.querySelector('.shs-right') as HTMLElement
        if (!tp || !bt || !lt || !rt) return
        if (dist <= -1) {
          tp.style.transform = 'translateY(-100%)'; bt.style.transform = 'translateY(100%)'
          lt.style.transform = 'translateX(-100%)'; rt.style.transform = 'translateX(100%)'
          shutter.style.zIndex = String(TOTAL * 2 + i)
        } else if (dist >= 1) {
          tp.style.transform = 'translateY(0)'; bt.style.transform = 'translateY(0)'
          lt.style.transform = 'translateX(0)'; rt.style.transform = 'translateX(0)'
          shutter.style.zIndex = String(TOTAL * 2 + TOTAL - i)
        } else if (dist < 0) {
          const p = -dist
          tp.style.transform = `translateY(${-p*100}%)`; bt.style.transform = `translateY(${p*100}%)`
          lt.style.transform = `translateX(${-p*100}%)`; rt.style.transform = `translateX(${p*100}%)`
          shutter.style.zIndex = String(TOTAL * 2 + TOTAL - i)
        } else {
          tp.style.transform = 'translateY(0)'; bt.style.transform = 'translateY(0)'
          lt.style.transform = 'translateX(0)'; rt.style.transform = 'translateX(0)'
          shutter.style.zIndex = String(TOTAL * 2 + TOTAL - i)
        }
      })
      panels.forEach((panel, i) => { panel.style.zIndex = String(i) })
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
  <div class="shs-page">
    <div id="shsProgress" class="shs-progress-bar"></div>
    <nav id="shsNav" class="shs-nav-dots"></nav>
    <div class="shs-indicator"><span class="shs-cur">1</span> / {{ TOTAL }}</div>
    <div id="shsArea" class="shs-scroll-area">
      <div class="shs-viewport">
        <section v-for="n in TOTAL" :key="'p'+n" class="shs-content"
          :style="{ background: `linear-gradient(${140+(n-1)*20}deg, hsl(${(n-1)*44}, 50%, 72%), hsl(${(n-1)*44+20}, 38%, 84%))` }">
          <span class="shs-num">{{ String(n).padStart(2, '0') }}</span>
        </section>
        <div v-for="n in TOTAL" :key="'s'+n" class="shs-shutter">
          <div class="shs-blade shs-top" :style="{ background: `hsl(${(n-1)*44}, 30%, 84%)` }"></div>
          <div class="shs-blade shs-bottom" :style="{ background: `hsl(${(n-1)*44}, 30%, 86%)` }"></div>
          <div class="shs-blade shs-left" :style="{ background: `hsl(${(n-1)*44}, 32%, 15%)` }"></div>
          <div class="shs-blade shs-right" :style="{ background: `hsl(${(n-1)*44}, 28%, 13%)` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shs-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.shs-scroll-area { position: relative; }
.shs-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.shs-content {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  &::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; pointer-events: none; }
}
.shs-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(26, 26, 46,0.05); user-select: none; pointer-events: none; }
.shs-shutter { position: absolute; inset: 0; pointer-events: none; }
.shs-blade { position: absolute; will-change: transform; }
.shs-top { top: 0; left: 0; width: 100%; height: 50%; clip-path: polygon(0 0, 100% 0, 50% 100%); }
.shs-bottom { bottom: 0; left: 0; width: 100%; height: 50%; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.shs-left { top: 0; left: 0; width: 50%; height: 100%; clip-path: polygon(0 0, 100% 50%, 0 100%); }
.shs-right { top: 0; right: 0; width: 50%; height: 100%; clip-path: polygon(0 50%, 100% 0, 100% 100%); }
</style>

<style lang="scss">
$accent: #ef4444;
.shs-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #f97316); z-index: 1001; }
.shs-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.shs-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.shs-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.shs-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .shs-cur { color: $accent; font-weight: 700; }
}
</style>

