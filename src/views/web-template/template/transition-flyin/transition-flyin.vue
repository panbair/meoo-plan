<script setup lang="ts">
/**
 * ==================== Transition FlyIn ====================
 * 空间飞入 —— translateZ + rotateX + scale 3D 深度飞入，滚动驱动。
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
    dot.className = 'tfi-nav-dot' + (i === 0 ? ' tfi-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tfi-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tfi-active', i === index)
  })
  const el = document.querySelector('.tfi-page-indicator .tfi-current')
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

  gsap.set(stage, { perspective: '1200px' })
  gsap.set(panels, { opacity: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' })
  gsap.set(panels[0], { opacity: 1 })

  // 核心创意：面板飞向观众(scale变大+blur)消失，新面板从远处(scale小+rotateX倾斜+blur)飞入
  for (let i = 0; i < segments; i++) {
    tl.to(panels[i], {
      scale: 2.5, opacity: 0, filter: 'blur(12px)',
      duration: 1, ease: 'power3.in'
    }, i)
    tl.fromTo(panels[i + 1],
      { scale: 0.3, rotateX: 15, opacity: 0, filter: 'blur(8px)' },
      { scale: 1, rotateX: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
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
  gsap.set(stage, { clearProps: 'perspective' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tfiScrollArea') as HTMLElement
  stage = document.getElementById('tfiStage') as HTMLElement
  progressBar = document.getElementById('tfiProgressBar')
  navDots = document.getElementById('tfiNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tfi-panel') as HTMLElement[]

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
  <div class="tfi-page">
    <div id="tfiProgressBar" class="tfi-progress-bar"></div>
    <nav id="tfiNavDots" class="tfi-nav-dots"></nav>
    <div class="tfi-page-indicator">
      <span class="tfi-current">1</span>
      <span class="tfi-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tfiScrollArea" class="tfi-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tfiStage" class="tfi-stage">
        <section class="tfi-panel tfi-panel-0"><div class="tfi-content"><h2>Panel 1</h2></div></section>
        <section class="tfi-panel tfi-panel-1"><div class="tfi-content"><h2>Panel 2</h2></div></section>
        <section class="tfi-panel tfi-panel-2"><div class="tfi-content"><h2>Panel 3</h2></div></section>
        <section class="tfi-panel tfi-panel-3"><div class="tfi-content"><h2>Panel 4</h2></div></section>
        <section class="tfi-panel tfi-panel-4"><div class="tfi-content"><h2>Panel 5</h2></div></section>
        <section class="tfi-panel tfi-panel-5"><div class="tfi-content"><h2>Panel 6</h2></div></section>
        <section class="tfi-panel tfi-panel-6"><div class="tfi-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tfi-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0f; color: #fff; }
.tfi-scroll-area { position: relative; }
.tfi-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tfi-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; }
}
.tfi-content { text-align: center; z-index: 1; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tfi-panel-0 { background: linear-gradient(135deg, #1a1a2e, #16213e); }
.tfi-panel-1 { background: linear-gradient(135deg, #0f3460, #533483); }
.tfi-panel-2 { background: linear-gradient(135deg, #e94560, #0f3460); }
.tfi-panel-3 { background: linear-gradient(135deg, #16213e, #e94560); }
.tfi-panel-4 { background: linear-gradient(135deg, #533483, #1a1a2e); }
.tfi-panel-5 { background: linear-gradient(135deg, #1a1a40, #0f3460); }
.tfi-panel-6 { background: linear-gradient(135deg, #0f3460, #1a1a2e); }
@media (max-width: 768px) { .tfi-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tfi-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tfi-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.5); transform: scale(1.3); }
  &.tfi-active { background: #6c8cff; border-color: rgba(255,255,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(108,140,255,.5); }
}
.tfi-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #e94560, #533483, #0f3460, #6c8cff); box-shadow: 0 0 10px rgba(108,140,255,.4); }
.tfi-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .tfi-nav-dots { gap: 10px; } .tfi-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
