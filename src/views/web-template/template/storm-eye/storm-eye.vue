<script setup lang="ts">
/**
 * ==================== Storm Eye ====================
 * 风暴之眼 —— 混合 wind(风卷残云) + swirl(涡旋卷入) + vortex-unveil(漩涡揭开) + scale(缩放)
 * 从外风暴到平静风眼：panel被风暴吹散 → 卷入涡旋 → 中心揭开 → 平静缩放
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
    dot.className = 'se-nav-dot' + (i === 0 ? ' se-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.se-nav-dot').forEach((dot, i) => dot.classList.toggle('se-active', i === index))
  const el = document.querySelector('.se-page-indicator .se-current')
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
  gsap.set(panels, { opacity: 1, filter: 'none', clipPath: 'none', rotateZ: 0, scale: 1, x: 0, y: 0 })

  for (let i = 0; i < segments; i++) {
    // 阶段1：风暴吹散（wind out）- 面板被风吹走
    tl.to(panels[i], {
      x: 300, y: -100,
      rotateZ: 30, scale: 0.7,
      filter: 'blur(12px) brightness(0.5)',
      opacity: 0, duration: 0.5, ease: 'power3.in'
    }, i)
    // 阶段2：涡旋卷入收缩（swirl shrink）- 透明面板漩涡消失
    tl.to(panels[i], {
      clipPath: 'circle(0% at 50% 50%)',
      rotateZ: 360, scale: 0.1,
      duration: 0.35, ease: 'power3.in'
    }, i + 0.4)
    // 阶段3：漩涡揭开（vortex-unveil）- 下一屏从中心漩涡展开
    tl.fromTo(panels[i + 1],
      {
        clipPath: 'circle(0% at 50% 50%)',
        rotateZ: -540, scale: 0.1,
        filter: 'blur(6px) brightness(2)',
        opacity: 0
      },
      {
        clipPath: 'circle(70% at 50% 50%)',
        rotateZ: 0, scale: 0.9,
        filter: 'blur(1px) brightness(1.2)',
        opacity: 0.7, duration: 0.35, ease: 'power2.in'
      },
      i + 0.55
    )
    // 阶段4：平静缩放定型（scale settle）- 风暴过后平静
    tl.to(panels[i + 1], {
      clipPath: 'circle(100% at 50% 50%)',
      scale: 1, filter: 'blur(0px) brightness(1)',
      opacity: 1, duration: 0.45, ease: 'power4.out'
    }, i + 0.85)
    // 清理
    tl.call(() => { panels[i + 1].style.clipPath = 'none'; panels[i].style.clipPath = 'none'; panels[i].style.filter = '' }, [], i + 1.35)
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

function killCurrent() {
  ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() })
  mainTL?.kill(); mainTL = null; gsap.set(panels, { clearProps: 'all' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('seScrollArea') as HTMLElement; stage = document.getElementById('seStage') as HTMLElement
  progressBar = document.getElementById('seProgressBar'); navDots = document.getElementById('seNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.se-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="se-page">
    <div id="seProgressBar" class="se-progress-bar"></div>
    <nav id="seNavDots" class="se-nav-dots"></nav>
    <div class="se-page-indicator"><span class="se-current">1</span><span class="se-total"> / {{ totalPanels }}</span></div>
    <div id="seScrollArea" class="se-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="seStage" class="se-stage">
        <section class="se-panel se-panel-0"><div class="se-content"><h2>01</h2></div></section>
        <section class="se-panel se-panel-1"><div class="se-content"><h2>02</h2></div></section>
        <section class="se-panel se-panel-2"><div class="se-content"><h2>03</h2></div></section>
        <section class="se-panel se-panel-3"><div class="se-content"><h2>04</h2></div></section>
        <section class="se-panel se-panel-4"><div class="se-content"><h2>05</h2></div></section>
        <section class="se-panel se-panel-5"><div class="se-content"><h2>06</h2></div></section>
        <section class="se-panel se-panel-6"><div class="se-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.se-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.se-scroll-area { position: relative; }
.se-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1500px; }
.se-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(100,180,255,.08); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.se-content { text-align: center; z-index: 2; h2 { font-size: 6rem; font-weight: 900; margin: 0; letter-spacing: 4px; opacity: .85; } }
.se-panel-0 { background: radial-gradient(circle at 30% 40%, #0a2a5e, #020812); }
.se-panel-1 { background: radial-gradient(circle at 60% 50%, #d8e8f0, #021220); }
.se-panel-2 { background: radial-gradient(circle at 50% 30%, #0a5e2a, #021208); }
.se-panel-3 { background: radial-gradient(circle at 40% 60%, #5e0a2a, #120208); }
.se-panel-4 { background: radial-gradient(circle at 70% 50%, #3e0a5e, #120220); }
.se-panel-5 { background: radial-gradient(circle at 50% 70%, #5e3a0a, #120a02); }
.se-panel-6 { background: radial-gradient(circle at 50% 50%, #1a1a4e, #080812); }
@media (max-width: 768px) { .se-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.se-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.se-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(100,160,220,.2); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(100,160,220,.5); transform: scale(1.3); }
  &.se-active { background: #64a0dc; border-color: rgba(100,160,220,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(100,160,220,.5); }
}
.se-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #64a0dc, #2ecc71, #9b59b6); box-shadow: 0 0 10px rgba(100,160,220,.4); }
.se-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .se-nav-dots { gap: 10px; } .se-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
