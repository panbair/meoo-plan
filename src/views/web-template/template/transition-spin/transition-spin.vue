<script setup lang="ts">
/**
 * ==================== Transition Spin ====================
 * 2D 螺旋入场 —— rotate + scale 旋转缩放切换，滚动驱动。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
let vh = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let stage: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let panels: HTMLElement[] = []
let mainTL: gsap.core.Timeline | null = null

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tsp-nav-dot' + (i === 0 ? ' tsp-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tsp-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tsp-active', i === index)
  })
  const el = document.querySelector('.tsp-page-indicator .tsp-current')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}

function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  const targetTop = (scrollArea?.offsetTop || 0) + index * vh
  window.scrollTo({ top: targetTop, behavior: 'smooth' })
}

function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = {
    ArrowDown: 1, ArrowRight: 1,
    ArrowUp: -1, ArrowLeft: -1,
    Home: 0, End: totalPanels - 1
  }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    e.key === 'Home' || e.key === 'End'
      ? goToPanel(keyMap[e.key])
      : goToPanel(currentIndex + keyMap[e.key])
  }
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToPanel(currentIndex + (diff > 0 ? 1 : -1))
}

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  gsap.set(panels, { opacity: 0, rotate: 0, scale: 1 })
  gsap.set(panels[0], { opacity: 1 })

  // 核心创意：旋转缩小消失，新面板从反向旋转放大出现
  for (let i = 0; i < segments; i++) {
    tl.to(panels[i], {
      rotate: -180, scale: 0.3, opacity: 0,
      duration: 1, ease: 'power2.in'
    }, i)
    tl.fromTo(panels[i + 1],
      { rotate: 180, scale: 0.3, opacity: 0 },
      { rotate: 0, scale: 1, opacity: 1, duration: 1, ease: 'power3.out' },
      i
    )
  }

  return tl
}

function startTimeline() {
  const tl = buildTimeline()
  mainTL = tl

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.8,
    animation: tl,
    onUpdate: (self) => {
      const idx = Math.round(self.progress * (totalPanels - 1))
      if (idx !== currentIndex) {
        currentIndex = idx
        updateUI(idx)
      }
    }
  })
}

function killCurrent() {
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === scrollArea) st.kill()
  })
  mainTL?.kill()
  mainTL = null
  gsap.set(panels, { clearProps: 'all' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tspScrollArea') as HTMLElement
  stage = document.getElementById('tspStage') as HTMLElement
  progressBar = document.getElementById('tspProgressBar')
  navDots = document.getElementById('tspNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tsp-panel') as HTMLElement[]

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  createNavDots()
  updateUI(0)
  startTimeline()
}

function destroy() {
  killCurrent()
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="tsp-page">
    <div id="tspProgressBar" class="tsp-progress-bar"></div>
    <nav id="tspNavDots" class="tsp-nav-dots"></nav>
    <div class="tsp-page-indicator">
      <span class="tsp-current">1</span>
      <span class="tsp-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tspScrollArea" class="tsp-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tspStage" class="tsp-stage">
        <section class="tsp-panel tsp-panel-0"><div class="tsp-content"><h2>Panel 1</h2></div></section>
        <section class="tsp-panel tsp-panel-1"><div class="tsp-content"><h2>Panel 2</h2></div></section>
        <section class="tsp-panel tsp-panel-2"><div class="tsp-content"><h2>Panel 3</h2></div></section>
        <section class="tsp-panel tsp-panel-3"><div class="tsp-content"><h2>Panel 4</h2></div></section>
        <section class="tsp-panel tsp-panel-4"><div class="tsp-content"><h2>Panel 5</h2></div></section>
        <section class="tsp-panel tsp-panel-5"><div class="tsp-content"><h2>Panel 6</h2></div></section>
        <section class="tsp-panel tsp-panel-6"><div class="tsp-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tsp-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.tsp-scroll-area { position: relative; }
.tsp-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tsp-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; }
}
.tsp-content { text-align: center; z-index: 1; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tsp-panel-0 { background: linear-gradient(135deg, #dcdff0, #16213e); }
.tsp-panel-1 { background: linear-gradient(135deg, #d0ddf0, #533483); }
.tsp-panel-2 { background: linear-gradient(135deg, #e94560, #d0ddf0); }
.tsp-panel-3 { background: linear-gradient(135deg, #16213e, #e94560); }
.tsp-panel-4 { background: linear-gradient(135deg, #533483, #dcdff0); }
.tsp-panel-5 { background: linear-gradient(135deg, #1a1a40, #d0ddf0); }
.tsp-panel-6 { background: linear-gradient(135deg, #d0ddf0, #dcdff0); }
@media (max-width: 768px) { .tsp-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tsp-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tsp-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.5); transform: scale(1.3); }
  &.tsp-active { background: #6c8cff; border-color: rgba(26, 26, 46,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(108,140,255,.5); }
}
.tsp-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #e94560, #533483, #d0ddf0, #6c8cff); box-shadow: 0 0 10px rgba(108,140,255,.4); }
.tsp-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .tsp-nav-dots { gap: 10px; } .tsp-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
