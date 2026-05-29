<script setup lang="ts">
/**
 * ==================== Transition Cube ====================
 * 立体旋转 —— 面板如立方体面沿 Y 轴旋转，3D 纵深切换，滚动驱动。
 * 需要 perspective 加持，营造立体盒子翻滚感。
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
    dot.className = 'tcb-nav-dot' + (i === 0 ? ' tcb-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tcb-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tcb-active', i === index)
  })
  const el = document.querySelector('.tcb-page-indicator .tcb-current')
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
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh', transformOrigin: 'center center', backfaceVisibility: 'hidden' })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  // 层级管理 + 初始态：只显示面板0
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1, rotateY: 0 })

  for (let i = 0; i < segments; i++) {
    // 当前面板沿 Y 轴翻转到背面
    tl.to(panels[i], {
      rotateY: -90,
      duration: 0.9,
      ease: 'power2.in'
    }, i)

    // 下一屏从背面翻转到正面
    tl.fromTo(panels[i + 1],
      { rotateY: 90 },
      { rotateY: 0, duration: 0.9, ease: 'power2.out' },
      i + 0.4
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
  scrollArea = document.getElementById('tcbScrollArea') as HTMLElement
  stage = document.getElementById('tcbStage') as HTMLElement
  progressBar = document.getElementById('tcbProgressBar')
  navDots = document.getElementById('tcbNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tcb-panel') as HTMLElement[]

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
  <div class="tcb-page">
    <div id="tcbProgressBar" class="tcb-progress-bar"></div>
    <nav id="tcbNavDots" class="tcb-nav-dots"></nav>
    <div class="tcb-page-indicator">
      <span class="tcb-current">1</span>
      <span class="tcb-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tcbScrollArea" class="tcb-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tcbStage" class="tcb-stage">
        <section class="tcb-panel tcb-panel-0"><div class="tcb-content"><h2>Panel 1</h2></div></section>
        <section class="tcb-panel tcb-panel-1"><div class="tcb-content"><h2>Panel 2</h2></div></section>
        <section class="tcb-panel tcb-panel-2"><div class="tcb-content"><h2>Panel 3</h2></div></section>
        <section class="tcb-panel tcb-panel-3"><div class="tcb-content"><h2>Panel 4</h2></div></section>
        <section class="tcb-panel tcb-panel-4"><div class="tcb-content"><h2>Panel 5</h2></div></section>
        <section class="tcb-panel tcb-panel-5"><div class="tcb-content"><h2>Panel 6</h2></div></section>
        <section class="tcb-panel tcb-panel-6"><div class="tcb-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tcb-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.tcb-scroll-area { position: relative; }
.tcb-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1500px; }
.tcb-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  transform-style: preserve-3d;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.tcb-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tcb-panel-0 { background: linear-gradient(135deg, #e8ebf5, #d8daf0); }
.tcb-panel-1 { background: linear-gradient(135deg, #e8f0f4, #d0e4ec); }
.tcb-panel-2 { background: linear-gradient(135deg, #e8ecf2, #d4e0ec); }
.tcb-panel-3 { background: linear-gradient(135deg, #dcdff0, #d0ddf0); }
.tcb-panel-4 { background: linear-gradient(135deg, #ececf2, #dcdcf0); }
.tcb-panel-5 { background: linear-gradient(135deg, #d0d8f0, #d0f5f4); }
.tcb-panel-6 { background: linear-gradient(135deg, #e4e8f5, #d8dff0); }
@media (max-width: 768px) { .tcb-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tcb-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tcb-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.5); transform: scale(1.3); }
  &.tcb-active { background: #6c8cff; border-color: rgba(26, 26, 46,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(108,140,255,.5); }
}
.tcb-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6); box-shadow: 0 0 10px rgba(108,140,255,.4); }
.tcb-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .tcb-nav-dots { gap: 10px; } .tcb-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
