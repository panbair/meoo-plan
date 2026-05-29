<script setup lang="ts">
/**
 * ==================== Transition Strips ====================
 * 条带交错 —— 面板拆分为水平条带，奇偶交错移出/移入，滚动驱动。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
const STRIPS = 8
let vh = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let stage: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let panels: HTMLElement[] = []
let mainTL: gsap.core.Timeline | null = null
let stripLayers: HTMLElement[][] = []

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tst-nav-dot' + (i === 0 ? ' tst-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tst-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tst-active', i === index)
  })
  const el = document.querySelector('.tst-page-indicator .tst-current')
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

function createStripLayer(parent: HTMLElement): HTMLElement[] {
  const strips: HTMLElement[] = []
  const parentBg = getComputedStyle(parent).background
  for (let s = 0; s < STRIPS; s++) {
    const strip = document.createElement('div')
    strip.className = 'tst-strip'
    strip.style.cssText = `
      position: absolute;
      left: 0;
      width: 100%;
      height: ${100 / STRIPS}%;
      top: ${(s / STRIPS) * 100}%;
      background: ${parentBg};
      z-index: 1;
      pointer-events: none;
    `
    parent.appendChild(strip)
    strips.push(strip)
  }
  return strips
}

function removeStripLayers() {
  stripLayers.forEach(strips => strips.forEach(s => s.remove()))
  stripLayers = []
}

function buildTimeline(): gsap.core.Timeline {
  // 清理旧的条带
  removeStripLayers()
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })

  // 为每个出场面板创建条带层
  for (let i = 0; i < totalPanels - 1; i++) {
    stripLayers.push(createStripLayer(panels[i]))
  }

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  gsap.set(panels, { opacity: 0 })
  gsap.set(panels[0], { opacity: 1 })

  for (let i = 0; i < segments; i++) {
    const strips = stripLayers[i]

    // 条带交错移出：偶数左移，奇数右移
    strips.forEach((strip, s) => {
      const direction = s % 2 === 0 ? -1 : 1
      tl.to(strip, {
        x: direction * 150 + '%', opacity: 0,
        duration: 0.8, ease: 'power3.in',
        stagger: 0.06
      }, i)
    })

    // 面板本身也淡出
    tl.to(panels[i], { opacity: 0, duration: 0.6 }, i)

    // 新面板从零开始显现（可配合 clip 或 bare fade）
    tl.fromTo(panels[i + 1],
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' },
      i + 0.5
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
  removeStripLayers()
  gsap.set(panels, { clearProps: 'all' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tstScrollArea') as HTMLElement
  stage = document.getElementById('tstStage') as HTMLElement
  progressBar = document.getElementById('tstProgressBar')
  navDots = document.getElementById('tstNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tst-panel') as HTMLElement[]

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
  <div class="tst-page">
    <div id="tstProgressBar" class="tst-progress-bar"></div>
    <nav id="tstNavDots" class="tst-nav-dots"></nav>
    <div class="tst-page-indicator">
      <span class="tst-current">1</span>
      <span class="tst-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tstScrollArea" class="tst-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tstStage" class="tst-stage">
        <section class="tst-panel tst-panel-0"><div class="tst-content"><h2>Panel 1</h2></div></section>
        <section class="tst-panel tst-panel-1"><div class="tst-content"><h2>Panel 2</h2></div></section>
        <section class="tst-panel tst-panel-2"><div class="tst-content"><h2>Panel 3</h2></div></section>
        <section class="tst-panel tst-panel-3"><div class="tst-content"><h2>Panel 4</h2></div></section>
        <section class="tst-panel tst-panel-4"><div class="tst-content"><h2>Panel 5</h2></div></section>
        <section class="tst-panel tst-panel-5"><div class="tst-content"><h2>Panel 6</h2></div></section>
        <section class="tst-panel tst-panel-6"><div class="tst-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tst-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.tst-scroll-area { position: relative; }
.tst-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tst-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.tst-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tst-panel-0 { background: linear-gradient(135deg, #e8ebf5, #d8daf0); }
.tst-panel-1 { background: linear-gradient(135deg, #e8f0f4, #d0e4ec); }
.tst-panel-2 { background: linear-gradient(135deg, #e8ecf2, #d4e0ec); }
.tst-panel-3 { background: linear-gradient(135deg, #dcdff0, #d0ddf0); }
.tst-panel-4 { background: linear-gradient(135deg, #ececf2, #dcdcf0); }
.tst-panel-5 { background: linear-gradient(135deg, #d0d8f0, #d0f5f4); }
.tst-panel-6 { background: linear-gradient(135deg, #e4e8f5, #d8dff0); }
@media (max-width: 768px) { .tst-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tst-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tst-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.5); transform: scale(1.3); }
  &.tst-active { background: #6c8cff; border-color: rgba(26, 26, 46,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(108,140,255,.5); }
}
.tst-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6, #d0f5f4); box-shadow: 0 0 10px rgba(108,140,255,.4); }
.tst-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .tst-nav-dots { gap: 10px; } .tst-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
