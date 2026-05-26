<script setup lang="ts">
/**
 * ==================== Transition Wipe ====================
 * 扫光擦拭 —— 一条高光从左到右扫过，面板随之从左到右被擦除露出下一屏，滚动驱动。
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
let wipeBars: HTMLElement[] = []

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'twi-nav-dot' + (i === 0 ? ' twi-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.twi-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('twi-active', i === index)
  })
  const el = document.querySelector('.twi-page-indicator .twi-current')
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

function createWipeBar(parent: HTMLElement): HTMLElement {
  const bar = document.createElement('div')
  bar.className = 'twi-bar'
  bar.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 8px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.8), rgba(255,255,255,.4), transparent);
    filter: blur(2px);
    z-index: 10;
    pointer-events: none;
  `
  parent.appendChild(bar)
  return bar
}

function removeWipeBars() {
  wipeBars.forEach(b => b.remove())
  wipeBars = []
}

function buildTimeline(): gsap.core.Timeline {
  removeWipeBars()
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })

  for (let i = 0; i < totalPanels - 1; i++) {
    wipeBars.push(createWipeBar(panels[i]))
  }

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  gsap.set(panels, { opacity: 1, clipPath: 'inset(0 0 0 0)' })

  for (let i = 0; i < segments; i++) {
    const bar = wipeBars[i]

    // 高光从左扫到右
    tl.fromTo(bar, { x: '-10%' }, { x: '105%', duration: 0.8, ease: 'power2.inOut' }, i)

    // 面板从右向左被裁剪（露出下一屏）
    tl.to(panels[i], {
      clipPath: 'inset(0 0 0 100%)',
      duration: 0.8,
      ease: 'power2.inOut'
    }, i)
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
  removeWipeBars()
  gsap.set(panels, { clearProps: 'all' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('twiScrollArea') as HTMLElement
  stage = document.getElementById('twiStage') as HTMLElement
  progressBar = document.getElementById('twiProgressBar')
  navDots = document.getElementById('twiNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.twi-panel') as HTMLElement[]

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
  <div class="twi-page">
    <div id="twiProgressBar" class="twi-progress-bar"></div>
    <nav id="twiNavDots" class="twi-nav-dots"></nav>
    <div class="twi-page-indicator">
      <span class="twi-current">1</span>
      <span class="twi-total"> / {{ totalPanels }}</span>
    </div>

    <div id="twiScrollArea" class="twi-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="twiStage" class="twi-stage">
        <section class="twi-panel twi-panel-0"><div class="twi-content"><h2>Panel 1</h2></div></section>
        <section class="twi-panel twi-panel-1"><div class="twi-content"><h2>Panel 2</h2></div></section>
        <section class="twi-panel twi-panel-2"><div class="twi-content"><h2>Panel 3</h2></div></section>
        <section class="twi-panel twi-panel-3"><div class="twi-content"><h2>Panel 4</h2></div></section>
        <section class="twi-panel twi-panel-4"><div class="twi-content"><h2>Panel 5</h2></div></section>
        <section class="twi-panel twi-panel-5"><div class="twi-content"><h2>Panel 6</h2></div></section>
        <section class="twi-panel twi-panel-6"><div class="twi-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.twi-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0f; color: #fff; }
.twi-scroll-area { position: relative; }
.twi-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.twi-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.twi-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.twi-panel-0 { background: linear-gradient(135deg, #0a0f24, #1a1a5e); }
.twi-panel-1 { background: linear-gradient(135deg, #0f2027, #2c5364); }
.twi-panel-2 { background: linear-gradient(135deg, #141e30, #243b55); }
.twi-panel-3 { background: linear-gradient(135deg, #1a1a2e, #0f3460); }
.twi-panel-4 { background: linear-gradient(135deg, #0d0d1a, #1a1a3e); }
.twi-panel-5 { background: linear-gradient(135deg, #1a2980, #26d0ce); }
.twi-panel-6 { background: linear-gradient(135deg, #0b1331, #1c2856); }
@media (max-width: 768px) { .twi-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.twi-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.twi-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.5); transform: scale(1.3); }
  &.twi-active { background: #6c8cff; border-color: rgba(255,255,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(108,140,255,.5); }
}
.twi-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6); box-shadow: 0 0 10px rgba(108,140,255,.4); }
.twi-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .twi-nav-dots { gap: 10px; } .twi-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
