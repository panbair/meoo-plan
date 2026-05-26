<script setup lang="ts">
/**
 * ==================== Transition Mirror ====================
 * 镜像翻面 —— 面板 scaleX(-1) 镜像翻转，展示"背面"（下一屏），滚动驱动。
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
    dot.className = 'tmr-nav-dot' + (i === 0 ? ' tmr-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tmr-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tmr-active', i === index)
  })
  const el = document.querySelector('.tmr-page-indicator .tmr-current')
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
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh', transformOrigin: 'center center' })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  gsap.set(panels, { opacity: 1, scaleX: 1 })

  for (let i = 0; i < segments; i++) {
    // 当前面板镜像翻转：scaleX(1 → -1)，中段 opacity 插值以掩藏翻转瞬间
    tl.to(panels[i], {
      scaleX: -1,
      duration: 0.9,
      ease: 'power3.in'
    }, i)

    // 在翻转中点附近淡出
    tl.to(panels[i], {
      opacity: 0,
      duration: 0.15,
      ease: 'power1.in'
    }, i + 0.4)

    // 下一屏从镜像状态翻正
    tl.fromTo(panels[i + 1],
      { scaleX: -1, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.7, ease: 'power2.out' },
      i + 0.35
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
  scrollArea = document.getElementById('tmrScrollArea') as HTMLElement
  stage = document.getElementById('tmrStage') as HTMLElement
  progressBar = document.getElementById('tmrProgressBar')
  navDots = document.getElementById('tmrNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tmr-panel') as HTMLElement[]

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
  <div class="tmr-page">
    <div id="tmrProgressBar" class="tmr-progress-bar"></div>
    <nav id="tmrNavDots" class="tmr-nav-dots"></nav>
    <div class="tmr-page-indicator">
      <span class="tmr-current">1</span>
      <span class="tmr-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tmrScrollArea" class="tmr-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tmrStage" class="tmr-stage">
        <section class="tmr-panel tmr-panel-0"><div class="tmr-content"><h2>Panel 1</h2></div></section>
        <section class="tmr-panel tmr-panel-1"><div class="tmr-content"><h2>Panel 2</h2></div></section>
        <section class="tmr-panel tmr-panel-2"><div class="tmr-content"><h2>Panel 3</h2></div></section>
        <section class="tmr-panel tmr-panel-3"><div class="tmr-content"><h2>Panel 4</h2></div></section>
        <section class="tmr-panel tmr-panel-4"><div class="tmr-content"><h2>Panel 5</h2></div></section>
        <section class="tmr-panel tmr-panel-5"><div class="tmr-content"><h2>Panel 6</h2></div></section>
        <section class="tmr-panel tmr-panel-6"><div class="tmr-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tmr-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0f; color: #fff; }
.tmr-scroll-area { position: relative; }
.tmr-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tmr-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.tmr-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tmr-panel-0 { background: linear-gradient(135deg, #0a0f24, #1a1a5e); }
.tmr-panel-1 { background: linear-gradient(135deg, #0f2027, #2c5364); }
.tmr-panel-2 { background: linear-gradient(135deg, #141e30, #243b55); }
.tmr-panel-3 { background: linear-gradient(135deg, #1a1a2e, #0f3460); }
.tmr-panel-4 { background: linear-gradient(135deg, #0d0d1a, #1a1a3e); }
.tmr-panel-5 { background: linear-gradient(135deg, #1a2980, #26d0ce); }
.tmr-panel-6 { background: linear-gradient(135deg, #0b1331, #1c2856); }
@media (max-width: 768px) { .tmr-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tmr-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tmr-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.5); transform: scale(1.3); }
  &.tmr-active { background: #6c8cff; border-color: rgba(255,255,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(108,140,255,.5); }
}
.tmr-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6); box-shadow: 0 0 10px rgba(108,140,255,.4); }
.tmr-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .tmr-nav-dots { gap: 10px; } .tmr-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
