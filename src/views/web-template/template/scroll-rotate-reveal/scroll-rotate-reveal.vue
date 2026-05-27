<script setup lang="ts">
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
    dot.className = 'rtr-dot' + (i === 0 ? ' rtr-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.rtr-dot').forEach((d, i) => d.classList.toggle('rtr-active', i === index))
  const el = document.querySelector('.rtr-indicator .rtr-cur')
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
  scrollArea = document.getElementById('rtrArea') as HTMLElement
  progressBar = document.getElementById('rtrProgress')
  navDots = document.getElementById('rtrNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.rtr-panel') as HTMLElement[]
  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      panels.forEach((panel, i) => {
        const dist = i - focus
        const absDist = Math.abs(dist)
        const axis = i % 2 === 0 ? 'Y' : 'X'
        const dir = i % 2 === 0 ? 1 : -1
        const rx = axis === 'X' ? 1 : 0
        const ry = axis === 'Y' ? 1 : 0
        if (absDist < 0.02) {
          panel.style.transform = 'perspective(1200px) rotate3d(0,0,0,0deg) scale(1)'
          panel.style.opacity = '1'; panel.style.zIndex = '10'; panel.style.filter = 'none'
        } else if (dist > 0) {
          const t = Math.min(1, absDist)
          panel.style.transform = 'perspective(1200px) rotate3d(' + rx + ',' + ry + ',0,' + (t * 120 * dir) + 'deg) scale(' + (0.7 + (1 - t) * 0.3) + ')'
          panel.style.opacity = String(Math.max(0, 1 - t * 1.8))
          panel.style.zIndex = String(5 - Math.round(absDist))
          panel.style.filter = t > 0.3 ? 'blur(' + ((t - 0.3) * 10) + 'px)' : 'none'
        } else {
          const t = Math.min(1, absDist)
          panel.style.transform = 'perspective(1200px) rotate3d(' + rx + ',' + ry + ',0,' + (-t * 120 * dir) + 'deg) scale(' + (1 - t * 0.3) + ')'
          panel.style.opacity = String(Math.max(0, 1 - t * 2))
          panel.style.zIndex = String(3 - Math.round(absDist))
          panel.style.filter = t > 0.2 ? 'blur(' + ((t - 0.2) * 12) + 'px)' : 'none'
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
  <div class="rtr-page">
    <div id="rtrProgress" class="rtr-progress-bar"></div>
    <nav id="rtrNav" class="rtr-nav-dots"></nav>
    <div class="rtr-indicator"><span class="rtr-cur">1</span> / {{ TOTAL }}</div>
    <div id="rtrArea" class="rtr-scroll-area">
      <div class="rtr-viewport">
        <div class="rtr-stage">
          <section v-for="n in TOTAL" :key="n" class="rtr-panel"
            :style="{ background: 'linear-gradient(' + (140 + (n - 1) * 22) + 'deg, hsl(' + ((n - 1) * 44) + ', 50%, 30%), hsl(' + ((n - 1) * 44 + 22) + ', 38%, 15%))' }">
            <span class="rtr-num">{{ String(n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.rtr-page { font-family: system-ui, -apple-system, sans-serif; background: #060610; color: #fff; }
.rtr-scroll-area { position: relative; }
.rtr-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; perspective: 1200px; }
.rtr-stage { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; }
.rtr-panel {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: transform, opacity, filter; backface-visibility: hidden;
  &::before { content: ''; position: absolute; inset: 28px; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; pointer-events: none; }
}
.rtr-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(255, 255, 255, 0.05); user-select: none; pointer-events: none; }
</style>
<style lang="scss">
$accent: #8b5cf6;
.rtr-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #06b6d4); z-index: 1001; }
.rtr-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.rtr-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255, 255, 255, 0.15); cursor: pointer;
  border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255, 255, 255, 0.4); transform: scale(1.3); }
  &.rtr-active { background: $accent; border-color: rgba(255, 255, 255, 0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.rtr-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.75);
  .rtr-cur { color: $accent; font-weight: 700; }
}
</style>
