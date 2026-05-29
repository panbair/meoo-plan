<script setup lang="ts">
/**
 * ==================== Transition Shutter Wind ====================
 * 百叶风吹 —— 混合 shutter(竖帘翻转) + wind(风卷残云)
 * 面板先被10片竖帘百叶窗翻转剥离，然后残余碎片被风吹走（rotate+skew+scale+translate）
 * CSS 3D 增强：preserve-3d 层级 + translateZ 风吹深度 + backface-visibility
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
const shutterCount = 10
let vh = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let stage: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let panels: HTMLElement[] = []
let mainTL: gsap.core.Timeline | null = null
const shutterContainers: HTMLElement[][] = []

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tsw-nav-dot' + (i === 0 ? ' tsw-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.tsw-nav-dot').forEach((dot, i) => dot.classList.toggle('tsw-active', i === index))
  const el = document.querySelector('.tsw-page-indicator .tsw-current')
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

function setupShutters() {
  shutterContainers.length = 0
  panels.forEach(panel => {
    let container = panel.querySelector('.tsw-shutter-container') as HTMLElement
    if (!container) { container = document.createElement('div'); container.className = 'tsw-shutter-container'; panel.appendChild(container) }
    container.innerHTML = ''
    const shuts: HTMLElement[] = []
    const w = 100 / shutterCount
    for (let s = 0; s < shutterCount; s++) {
      const shut = document.createElement('div')
      shut.className = 'tsw-shutter'
      shut.style.cssText = `position:absolute;top:0;left:${s * w}%;width:${w}%;height:100%;background:inherit;transform-origin:left center;perspective:800px;backface-visibility:hidden;`
      container.appendChild(shut)
      shuts.push(shut)
    }
    shutterContainers.push(shuts)
  })
}

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1 })
  shutterContainers.forEach(s => gsap.set(s, { rotateY: 0, x: 0, y: 0, opacity: 1 }))

  for (let i = 0; i < segments; i++) {
    const shuts = shutterContainers[i]
    if (!shuts || shuts.length === 0) continue

    // 阶段1：百叶窗依次翻转（rotateY -90deg）
    for (let s = 0; s < shutterCount; s++) {
      const stagger = s * 0.04
      tl.to(shuts[s], {
        rotateY: -95,
        duration: 0.5,
        ease: 'power3.in'
      }, i + stagger)
    }

    // 阶段2：翻转后被风吹走（wind 四联：rotate+skew+scale+translate + translateZ深度）
    for (let s = 0; s < shutterCount; s++) {
      const delay = i + 0.3 + s * 0.03
      const windDir = s % 2 === 0 ? 1 : -1 // 交替左右飞
      tl.to(shuts[s], {
        x: `${windDir * 60}%`,
        y: `${(s % 3 - 1) * 30}%`,
        z: -300,
        rotate: windDir * 40,
        skewX: windDir * 20,
        scale: 0.15,
        opacity: 0,
        duration: 0.6,
        ease: 'power4.in'
      }, delay)
    }

    // 面板本身淡出
    tl.to(panels[i], { opacity: 0, duration: 0.2 }, i + 0.85)

    // 下一屏：从 3D 深度展开恢复（translateZ 从远飞到近）
    tl.fromTo(panels[i + 1],
      { z: -200, scale: 0.75, opacity: 0, rotateZ: -5, filter: 'brightness(2)' },
      { z: 0, scale: 1, opacity: 1, rotateZ: 0, filter: 'brightness(1)', duration: 0.6, ease: 'back.out(1.3)' },
      i + 0.6
    )
  }
  return tl
}

function startTimeline() {
  setupShutters()
  const tl = buildTimeline(); mainTL = tl
  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.8,
    animation: tl,
    onUpdate: (self) => { const idx = Math.round(self.progress * (totalPanels - 1)); if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) } }
  })
}
function killCurrent() { ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() }); mainTL?.kill(); mainTL = null; gsap.set(panels, { clearProps: 'all' }); shutterContainers.forEach(s => gsap.set(s, { rotateY: 0, x: 0, y: 0, z: 0, opacity: 1 })) }
function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tswScrollArea') as HTMLElement; stage = document.getElementById('tswStage') as HTMLElement
  progressBar = document.getElementById('tswProgressBar'); navDots = document.getElementById('tswNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tsw-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}
function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="tsw-page">
    <div id="tswProgressBar" class="tsw-progress-bar"></div>
    <nav id="tswNavDots" class="tsw-nav-dots"></nav>
    <div class="tsw-page-indicator"><span class="tsw-current">1</span><span class="tsw-total"> / {{ totalPanels }}</span></div>
    <div id="tswScrollArea" class="tsw-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tswStage" class="tsw-stage">
        <section class="tsw-panel tsw-panel-0"><div class="tsw-content"><h2>Panel 1</h2></div></section>
        <section class="tsw-panel tsw-panel-1"><div class="tsw-content"><h2>Panel 2</h2></div></section>
        <section class="tsw-panel tsw-panel-2"><div class="tsw-content"><h2>Panel 3</h2></div></section>
        <section class="tsw-panel tsw-panel-3"><div class="tsw-content"><h2>Panel 4</h2></div></section>
        <section class="tsw-panel tsw-panel-4"><div class="tsw-content"><h2>Panel 5</h2></div></section>
        <section class="tsw-panel tsw-panel-5"><div class="tsw-content"><h2>Panel 6</h2></div></section>
        <section class="tsw-panel tsw-panel-6"><div class="tsw-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tsw-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a14; color: #1a1a2e; perspective: 1200px; }
.tsw-scroll-area { position: relative; }
.tsw-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1200px; transform-style: preserve-3d; }
.tsw-panel { position: absolute; inset: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.tsw-shutter-container { position: absolute; inset: 0; z-index: 0; transform-style: preserve-3d; }
.tsw-content { text-align: center; z-index: 2; position: relative; h2 { font-size: 3.5rem; font-weight: 900; margin: 0; } }
.tsw-panel-0 { background: linear-gradient(135deg, #1a2a5e, #2a1a4e); }
.tsw-panel-1 { background: linear-gradient(135deg, #2a5e1a, #4e1a1a); }
.tsw-panel-2 { background: linear-gradient(135deg, #eedad2, #5e5e1a); }
.tsw-panel-3 { background: linear-gradient(135deg, #1a5e5e, #d8daf0); }
.tsw-panel-4 { background: linear-gradient(135deg, #5e1a5e, #5e1a2a); }
.tsw-panel-5 { background: linear-gradient(135deg, #d6d6ee, #1a5e4e); }
.tsw-panel-6 { background: linear-gradient(135deg, #4e2a1a, #5e4e1a); }
@media (max-width: 768px) { .tsw-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tsw-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tsw-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46,.15); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.4); transform: scale(1.3); }
  &.tsw-active { background: #f1c40f; border-color: rgba(241,196,15,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(241,196,15,.5); }
}
.tsw-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #f1c40f, #e67e22, #e74c3c); box-shadow: 0 0 10px rgba(241,196,15,.4); }
.tsw-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .tsw-nav-dots { gap: 10px; } .tsw-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
