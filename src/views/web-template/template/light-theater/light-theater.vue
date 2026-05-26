<script setup lang="ts">
/**
 * ==================== Light Theater ====================
 * 光影剧场 —— 混合 reveal(幕布揭幕) + swing(钟摆扫光) + wipe(扫光擦拭) + zoom-blur(缩放模糊)
 * 舞台剧体验：幕布拉开 → 追光灯扫过 → 扫光转场 → 虚焦落幕聚焦下一幕。
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
    dot.className = 'lt-nav-dot' + (i === 0 ? ' lt-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.lt-nav-dot').forEach((dot, i) => dot.classList.toggle('lt-active', i === index))
  const el = document.querySelector('.lt-page-indicator .lt-current')
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
  gsap.set(panels, { opacity: 1, filter: 'none', clipPath: 'none', rotateZ: 0 })

  for (let i = 0; i < segments; i++) {
    // 阶段1：钟摆荡出（swing out）- 面板像钟摆一样旋转+缩小消失
    tl.to(panels[i], {
      rotateZ: -25, scale: 0.7, opacity: 0, filter: 'blur(4px) brightness(0.6)',
      transformOrigin: '50% 100%',
      duration: 0.5, ease: 'power3.in'
    }, i)
    // 阶段2：幕布揭幕（reveal）- 下一屏从上方幕布式降下
    tl.fromTo(panels[i + 1],
      { clipPath: 'inset(0 0 100% 0)', filter: 'brightness(2)', opacity: 0 },
      { clipPath: 'inset(0 0 0% 0)', filter: 'brightness(1)', opacity: 1, duration: 0.5, ease: 'power3.out' },
      i + 0.35
    )
    // 阶段3：扫光擦拭（wipe）- 白色扫光从左到右划过，清除幕布痕迹
    const wipeObj = { progress: 0 }
    tl.to(wipeObj, {
      progress: 1, duration: 0.35,
      onUpdate: () => {
        const p = wipeObj.progress
        panels[i + 1].style.clipPath = `polygon(${p * 100 - 5}% 0%, ${p * 100}% 100%, 0% 100%, 0% 0%)`
      }
    }, i + 0.7)
    // 清除 clip-path
    tl.call(() => { panels[i + 1].style.clipPath = 'none' }, [], i + 1.1)
    // 阶段4：缩放模糊收尾（zoom-blur settle）
    tl.fromTo(panels[i + 1],
      { filter: 'blur(3px)', scale: 1.05 },
      { filter: 'blur(0px)', scale: 1, duration: 0.35, ease: 'power2.out' },
      i + 0.85
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

function killCurrent() {
  ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() })
  mainTL?.kill(); mainTL = null; gsap.set(panels, { clearProps: 'all' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('ltScrollArea') as HTMLElement; stage = document.getElementById('ltStage') as HTMLElement
  progressBar = document.getElementById('ltProgressBar'); navDots = document.getElementById('ltNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.lt-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="lt-page">
    <div id="ltProgressBar" class="lt-progress-bar"></div>
    <nav id="ltNavDots" class="lt-nav-dots"></nav>
    <div class="lt-page-indicator"><span class="lt-current">1</span><span class="lt-total"> / {{ totalPanels }}</span></div>
    <div id="ltScrollArea" class="lt-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="ltStage" class="lt-stage">
        <section class="lt-panel lt-panel-0"><div class="lt-content"><h2>01</h2></div></section>
        <section class="lt-panel lt-panel-1"><div class="lt-content"><h2>02</h2></div></section>
        <section class="lt-panel lt-panel-2"><div class="lt-content"><h2>03</h2></div></section>
        <section class="lt-panel lt-panel-3"><div class="lt-content"><h2>04</h2></div></section>
        <section class="lt-panel lt-panel-4"><div class="lt-content"><h2>05</h2></div></section>
        <section class="lt-panel lt-panel-5"><div class="lt-content"><h2>06</h2></div></section>
        <section class="lt-panel lt-panel-6"><div class="lt-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lt-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #080810; color: #fff; }
.lt-scroll-area { position: relative; }
.lt-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.lt-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.lt-content { text-align: center; z-index: 1; h2 { font-size: 6rem; font-weight: 900; margin: 0; letter-spacing: 4px; opacity: .85; } }
.lt-panel-0 { background: linear-gradient(135deg, #1a1a24, #2a2a3e); }
.lt-panel-1 { background: linear-gradient(135deg, #241a1a, #3e2a2a); }
.lt-panel-2 { background: linear-gradient(135deg, #1a241a, #2a3e2a); }
.lt-panel-3 { background: linear-gradient(135deg, #24241a, #3e3e2a); }
.lt-panel-4 { background: linear-gradient(135deg, #1a2424, #2a3e3e); }
.lt-panel-5 { background: linear-gradient(135deg, #241a24, #3e2a3e); }
.lt-panel-6 { background: linear-gradient(135deg, #1a1a24, #2a2a4e); }
@media (max-width: 768px) { .lt-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.lt-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.lt-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,220,150,.2); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,220,150,.5); transform: scale(1.3); }
  &.lt-active { background: #ffdc96; border-color: rgba(255,220,150,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(255,220,150,.5); }
}
.lt-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #ffdc96, #f9a825, #ff6f00); box-shadow: 0 0 15px rgba(255,220,150,.5); }
.lt-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .lt-nav-dots { gap: 10px; } .lt-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
