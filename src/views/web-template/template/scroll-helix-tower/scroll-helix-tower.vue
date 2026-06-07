<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 10
const ANGLE_STEP = 60
const Y_STEP = 80
const RADIUS = 350
let currentIndex = 0
let scrollArea: HTMLElement | null = null
let tower: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'hlx-dot' + (i === 0 ? ' hlx-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.hlx-dot').forEach((d, i) => d.classList.toggle('hlx-active', i === index))
  const el = document.querySelector('.hlx-indicator .hlx-cur')
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
  scrollArea = document.getElementById('hlxArea') as HTMLElement
  tower = document.getElementById('hlxTower')
  progressBar = document.getElementById('hlxProgress')
  navDots = document.getElementById('hlxNav')
  if (!scrollArea || !tower) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const steps = gsap.utils.toArray('.hlx-step') as HTMLElement[]
  steps.forEach((step, i) => {
    step.style.transform = `rotateY(${i * ANGLE_STEP}deg) translateZ(${RADIUS}px) translateY(${i * Y_STEP}px)`
  })
  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focusIdx = self.progress * (TOTAL - 1)
      const towerRotY = -focusIdx * ANGLE_STEP
      tower!.style.transform = `rotateY(${towerRotY}deg) translateY(${-focusIdx * Y_STEP}px)`
      steps.forEach((step, i) => {
        const worldAngle = ((i * ANGLE_STEP + towerRotY) % 360 + 360) % 360
        const distToFront = Math.min(worldAngle, 360 - worldAngle)
        step.style.opacity = String(distToFront < ANGLE_STEP * 0.8 ? 1 : Math.max(0.15, 1 - distToFront / 180))
        step.classList.toggle('hlx-front', distToFront < ANGLE_STEP * 0.8)
      })
      const idx = Math.round(focusIdx)
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
  <div class="hlx-page">
    <div id="hlxProgress" class="hlx-progress-bar"></div>
    <nav id="hlxNav" class="hlx-nav-dots"></nav>
    <div class="hlx-indicator"><span class="hlx-cur">1</span> / {{ TOTAL }}</div>
    <div id="hlxArea" class="hlx-scroll-area">
      <div class="hlx-viewport">
        <div id="hlxTower" class="hlx-tower">
          <div v-for="n in TOTAL" :key="n" class="hlx-step"
            :style="{ background: `linear-gradient(150deg, hsl(${(n-1)*36}, 50%, 72%), hsl(${(n-1)*36+18}, 38%, 15%))` }">
            <span class="hlx-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hlx-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.hlx-scroll-area { position: relative; }
.hlx-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; perspective: 1200px; perspective-origin: 50% 45%; display: flex; align-items: center; justify-content: center; }
.hlx-tower { position: relative; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }
.hlx-step {
  position: absolute; width: 260px; height: 180px; margin-left: -130px; margin-top: -90px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; backface-visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 6px 24px rgba(255, 255, 255, 0.75); will-change: opacity; transition: box-shadow 0.3s;
  &.hlx-front { box-shadow: 0 8px 40px rgba(100, 140, 255, 0.12); }
}
.hlx-num { font-size: 2.5rem; font-weight: 900; color: rgba(26, 26, 46, 0.06); user-select: none; pointer-events: none; }
</style>

<style lang="scss">
$accent: #818cf8;
.hlx-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #c084fc); z-index: 1001; }
.hlx-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 8px; }
.hlx-dot {
  width: 8px; height: 8px; border-radius: 50%; background: rgba(26, 26, 46, 0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46, 0.4); transform: scale(1.3); }
  &.hlx-active { background: $accent; border-color: rgba(26, 26, 46, 0.35); transform: scale(1.5); box-shadow: 0 0 12px rgba($accent, 0.5); }
}
.hlx-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(26, 26, 46, 0.75);
  .hlx-cur { color: $accent; font-weight: 700; }
}
</style>

