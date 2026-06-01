<script setup lang="ts">
/**
 * ==================== Transition Zoom Blur ====================
 * 缩放模糊 —— 面板放大 + 模糊退出，模拟景深聚焦切换，滚动驱动。
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
    dot.className = 'tzb-nav-dot' + (i === 0 ? ' tzb-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tzb-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tzb-active', i === index)
  })
  const el = document.querySelector('.tzb-page-indicator .tzb-current')
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
  // Keep the first panel on top; subsequent panels are progressively revealed.
  panels.forEach((panel, i) => {
    panel.style.zIndex = String(totalPanels - i)
  })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  // 全屏叠加布局：所有面板从 scale(1) blur(0) 开始
  gsap.set(panels, { scale: 1, filter: 'blur(0px)', opacity: 1, transformOrigin: 'center center' })

  for (let i = 0; i < segments; i++) {
    // 当前面板放大 + 模糊 → 仿佛推远失焦
    tl.to(panels[i], {
      scale: 1.8,
      filter: 'blur(12px)',
      opacity: 0,
      duration: 1,
      ease: 'power2.in'
    }, i)

    // 下一屏从缩小中还原 → 仿佛拉近对焦
    tl.fromTo(panels[i + 1],
      { scale: 0.6, filter: 'blur(8px)', opacity: 0 },
      { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 0.9, ease: 'power2.out' },
      i + 0.1
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
  scrollArea = document.getElementById('tzbScrollArea') as HTMLElement
  stage = document.getElementById('tzbStage') as HTMLElement
  progressBar = document.getElementById('tzbProgressBar')
  navDots = document.getElementById('tzbNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tzb-panel') as HTMLElement[]

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
  <div class="tzb-page">
    <div id="tzbProgressBar" class="tzb-progress-bar"></div>
    <nav id="tzbNavDots" class="tzb-nav-dots"></nav>
    <div class="tzb-page-indicator">
      <span class="tzb-current">1</span>
      <span class="tzb-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tzbScrollArea" class="tzb-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tzbStage" class="tzb-stage">
        <section class="tzb-panel tzb-panel-0"><div class="tzb-content"><h2>Panel 1</h2></div></section>
        <section class="tzb-panel tzb-panel-1"><div class="tzb-content"><h2>Panel 2</h2></div></section>
        <section class="tzb-panel tzb-panel-2"><div class="tzb-content"><h2>Panel 3</h2></div></section>
        <section class="tzb-panel tzb-panel-3"><div class="tzb-content"><h2>Panel 4</h2></div></section>
        <section class="tzb-panel tzb-panel-4"><div class="tzb-content"><h2>Panel 5</h2></div></section>
        <section class="tzb-panel tzb-panel-5"><div class="tzb-content"><h2>Panel 6</h2></div></section>
        <section class="tzb-panel tzb-panel-6"><div class="tzb-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tzb-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.tzb-scroll-area { position: relative; }
.tzb-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tzb-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.tzb-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tzb-panel-0 { background: linear-gradient(135deg, #e8ebf5, #d8daf0); }
.tzb-panel-1 { background: linear-gradient(135deg, #e8f0f4, #d0e4ec); }
.tzb-panel-2 { background: linear-gradient(135deg, #e8ecf2, #d4e0ec); }
.tzb-panel-3 { background: linear-gradient(135deg, #dcdff0, #d0ddf0); }
.tzb-panel-4 { background: linear-gradient(135deg, #ececf2, #dcdcf0); }
.tzb-panel-5 { background: linear-gradient(135deg, #d0d8f0, #d0f5f4); }
.tzb-panel-6 { background: linear-gradient(135deg, #e4e8f5, #d8dff0); }
@media (max-width: 768px) { .tzb-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tzb-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tzb-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.5); transform: scale(1.3); }
  &.tzb-active { background: #6c8cff; border-color: rgba(26, 26, 46,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(108,140,255,.5); }
}
.tzb-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6); box-shadow: 0 0 10px rgba(108,140,255,.4); }
.tzb-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .tzb-nav-dots { gap: 10px; } .tzb-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
