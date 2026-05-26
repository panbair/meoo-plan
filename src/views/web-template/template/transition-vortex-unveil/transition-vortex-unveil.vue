<script setup lang="ts">
/**
 * ==================== Transition Vortex Unveil ====================
 * 漩涡揭开 —— 混合 circle mask(圆形扩张) + swirl(旋转涡旋) + scale(缩放)
 * 面板像被黑洞吸入中心，旋转+缩小消失，同时圆形遮罩从中心扩散露出下一屏。
 * CSS 3D 增强：perspective + translateZ 黑洞纵深吸入
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
    dot.className = 'tvu-nav-dot' + (i === 0 ? ' tvu-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.tvu-nav-dot').forEach((dot, i) => dot.classList.toggle('tvu-active', i === index))
  const el = document.querySelector('.tvu-page-indicator .tvu-current')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}
function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  const targetTop = (scrollArea?.offsetTop || 0) + index * vh
  window.scrollTo({ top: targetTop, behavior: 'smooth' })
}
function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }
  if (keyMap[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(keyMap[e.key]) : goToPanel(currentIndex + keyMap[e.key]) }
}
let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) { const diff = touchStartY - e.changedTouches[0].clientY; if (Math.abs(diff) > 50) goToPanel(currentIndex + (diff > 0 ? 1 : -1)) }

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1, scale: 1, rotate: 0 })

  for (let i = 0; i < segments; i++) {
    const vortexObj = { progress: 0 }
    // 当前面板：旋转涡旋 + 缩小 + 黑洞吸入（translateZ 退远），同时 circle mask 收缩
    tl.to(vortexObj, {
      progress: 1, duration: 1, ease: 'power3.in',
      onUpdate: () => {
        const p = vortexObj.progress
        // circle mask：半径从100%缩到0%（面板从外向内消失）
        const radius = (1 - p) * 100
        panels[i].style.clipPath = `circle(${radius}% at 50% 50%)`
        // 旋转涡旋 + 缩小 + 3D 纵深退远（黑洞吸入感）
        const zDepth = -p * 400
        panels[i].style.transform = `rotate(${p * 540}deg) scale(${1 - p * 0.6}) translateZ(${zDepth}px)`
      }
    }, i)
    // 面板淡出
    tl.to(panels[i], { opacity: 0, duration: 0.3, ease: 'power2.in' }, i + 0.7)
    // 清除 clip-path
    tl.call(() => { panels[i].style.clipPath = 'none'; panels[i].style.transform = '' }, [], i + 1.05)
    // 下一屏：从 3D 黑洞深处弹出（translateZ 从远飞到近 + 旋转回弹）
    tl.fromTo(panels[i + 1],
      { z: -400, rotateZ: -180, scale: 0.3, opacity: 0, filter: 'brightness(3)' },
      { z: 0, rotateZ: 0, scale: 1, opacity: 1, filter: 'brightness(1)', duration: 0.6, ease: 'back.out(1.7)' },
      i + 0.65
    )
  }
  return tl
}

function startTimeline() {
  const tl = buildTimeline(); mainTL = tl
  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.8,
    animation: tl,
    onUpdate: (self) => { const idx = Math.round(self.progress * (totalPanels - 1)); if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) } }
  })
}
function killCurrent() { ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() }); mainTL?.kill(); mainTL = null; gsap.set(panels, { clearProps: 'all' }) }
function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tvuScrollArea') as HTMLElement; stage = document.getElementById('tvuStage') as HTMLElement
  progressBar = document.getElementById('tvuProgressBar'); navDots = document.getElementById('tvuNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tvu-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}
function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="tvu-page">
    <div id="tvuProgressBar" class="tvu-progress-bar"></div>
    <nav id="tvuNavDots" class="tvu-nav-dots"></nav>
    <div class="tvu-page-indicator"><span class="tvu-current">1</span><span class="tvu-total"> / {{ totalPanels }}</span></div>
    <div id="tvuScrollArea" class="tvu-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tvuStage" class="tvu-stage">
        <section class="tvu-panel tvu-panel-0"><div class="tvu-content"><h2>Panel 1</h2></div></section>
        <section class="tvu-panel tvu-panel-1"><div class="tvu-content"><h2>Panel 2</h2></div></section>
        <section class="tvu-panel tvu-panel-2"><div class="tvu-content"><h2>Panel 3</h2></div></section>
        <section class="tvu-panel tvu-panel-3"><div class="tvu-content"><h2>Panel 4</h2></div></section>
        <section class="tvu-panel tvu-panel-4"><div class="tvu-content"><h2>Panel 5</h2></div></section>
        <section class="tvu-panel tvu-panel-5"><div class="tvu-content"><h2>Panel 6</h2></div></section>
        <section class="tvu-panel tvu-panel-6"><div class="tvu-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tvu-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #020210; color: #fff; perspective: 1800px; }
.tvu-scroll-area { position: relative; }
.tvu-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1800px; transform-style: preserve-3d; }
.tvu-panel { position: absolute; inset: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.06); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.tvu-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0; } }
.tvu-panel-0 { background: radial-gradient(circle at 50% 50%, #1a0a3e, #050520); }
.tvu-panel-1 { background: radial-gradient(circle at 50% 50%, #0a1a3e, #051020); }
.tvu-panel-2 { background: radial-gradient(circle at 50% 50%, #1a3e0a, #102005); }
.tvu-panel-3 { background: radial-gradient(circle at 50% 50%, #3e0a1a, #200510); }
.tvu-panel-4 { background: radial-gradient(circle at 50% 50%, #0a3e3a, #052020); }
.tvu-panel-5 { background: radial-gradient(circle at 50% 50%, #3e1a0a, #201005); }
.tvu-panel-6 { background: radial-gradient(circle at 50% 50%, #2a0a3e, #100520); }
@media (max-width: 768px) { .tvu-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tvu-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tvu-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.15); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.4); transform: scale(1.3); }
  &.tvu-active { background: #9b59b6; border-color: rgba(155,89,182,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(155,89,182,.5); }
}
.tvu-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #9b59b6, #3498db, #2ecc71); box-shadow: 0 0 10px rgba(155,89,182,.4); }
.tvu-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .tvu-nav-dots { gap: 10px; } .tvu-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
