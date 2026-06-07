<script setup lang="ts">
/**
 * ==================== Transition Pixel ====================
 * 像素融化 —— 面板逐级降低像素分辨率（image-rendering: pixelated）
 * 配合模糊和缩小，模拟像素化融化消散效果，滚动驱动。
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

// 像素分辨率阶梯（逐级降低）
const pixelSteps = [8, 4, 2, 1] // px

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tpx-nav-dot' + (i === 0 ? ' tpx-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tpx-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tpx-active', i === index)
  })
  const el = document.querySelector('.tpx-page-indicator .tpx-current')
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
  gsap.set(panels, {
    position: 'absolute', width: '100vw', height: '100vh',
    imageRendering: 'auto'
  })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1, scale: 1, filter: 'blur(0px)' })
  // 初始全部清晰
  panels.forEach(p => { p.style.imageRendering = 'auto' })

  for (let i = 0; i < segments; i++) {
    // 当前面板：逐级像素化 → 模糊 → 缩小 → 消失
    const stepCount = pixelSteps.length
    const durPerStep = 0.15
    const totalDur = durPerStep * stepCount + 0.3

    for (let s = 0; s < stepCount; s++) {
      tl.call(() => {
        panels[i].style.imageRendering = 'pixelated'
        panels[i].style.width = `${100 * (pixelSteps[s] / 8)}vw`
        panels[i].style.height = `${100 * (pixelSteps[s] / 8)}vh`
        panels[i].style.transform = `scale(${8 / pixelSteps[s]})`
      }, [], i + s * durPerStep)
    }

    // 最后模糊 + 缩小消失
    tl.to(panels[i], {
      filter: 'blur(20px)',
      scale: 0.3,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in'
    }, i + stepCount * durPerStep)

    // 下一屏：从像素块状恢复清晰 + 放大进入
    tl.fromTo(panels[i + 1],
      { imageRendering: 'pixelated', filter: 'blur(16px)', scale: 3, opacity: 0 },
      {
        imageRendering: 'auto', filter: 'blur(0px)', scale: 1, opacity: 1,
        duration: 0.7, ease: 'power2.out',
        onStart: () => {
          panels[i + 1].style.imageRendering = 'pixelated'
        },
        onUpdate: function(this: any) {
          const p = this.progress()
          if (p > 0.6) {
            panels[i + 1].style.imageRendering = 'auto'
          }
        }
      },
      i + stepCount * durPerStep + 0.15
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
  panels.forEach(p => { p.style.imageRendering = 'auto'; p.style.width = ''; p.style.height = ''; p.style.transform = '' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tpxScrollArea') as HTMLElement
  stage = document.getElementById('tpxStage') as HTMLElement
  progressBar = document.getElementById('tpxProgressBar')
  navDots = document.getElementById('tpxNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tpx-panel') as HTMLElement[]

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
  <div class="tpx-page">
    <div id="tpxProgressBar" class="tpx-progress-bar"></div>
    <nav id="tpxNavDots" class="tpx-nav-dots"></nav>
    <div class="tpx-page-indicator">
      <span class="tpx-current">1</span>
      <span class="tpx-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tpxScrollArea" class="tpx-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tpxStage" class="tpx-stage">
        <section class="tpx-panel tpx-panel-0"><div class="tpx-content"><h2>Panel 1</h2></div></section>
        <section class="tpx-panel tpx-panel-1"><div class="tpx-content"><h2>Panel 2</h2></div></section>
        <section class="tpx-panel tpx-panel-2"><div class="tpx-content"><h2>Panel 3</h2></div></section>
        <section class="tpx-panel tpx-panel-3"><div class="tpx-content"><h2>Panel 4</h2></div></section>
        <section class="tpx-panel tpx-panel-4"><div class="tpx-content"><h2>Panel 5</h2></div></section>
        <section class="tpx-panel tpx-panel-5"><div class="tpx-content"><h2>Panel 6</h2></div></section>
        <section class="tpx-panel tpx-panel-6"><div class="tpx-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tpx-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.tpx-scroll-area { position: relative; }
.tpx-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tpx-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.tpx-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tpx-panel-0 { background: linear-gradient(135deg, #1a0a2e, #16213e); }
.tpx-panel-1 { background: linear-gradient(135deg, #0f0c29, #302b63); }
.tpx-panel-2 { background: linear-gradient(135deg, #dcdff0, #d0ddf0); }
.tpx-panel-3 { background: linear-gradient(135deg, #0d1b2a, #1b263b); }
.tpx-panel-4 { background: linear-gradient(135deg, #1a0a2e, #dcdcf0); }
.tpx-panel-5 { background: linear-gradient(135deg, #2d1b69, #d0d8f0); }
.tpx-panel-6 { background: linear-gradient(135deg, #e4e8f5, #d8dff0); }
@media (max-width: 768px) { .tpx-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tpx-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tpx-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.5); transform: scale(1.3); }
  &.tpx-active { background: #f5f0f8; border-color: rgba(0,255,136,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(0,255,136,.5); }
}
.tpx-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #00ff88, #a78bfa, #f472b6); box-shadow: 0 0 10px rgba(0,255,136,.4); }
.tpx-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .tpx-nav-dots { gap: 10px; } .tpx-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
