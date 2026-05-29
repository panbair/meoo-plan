<script setup lang="ts">
/**
 * ==================== Chrono Gallery ====================
 * 时空画廊 —— 混合 burn(远古)/pixel(8-bit)/flip-book(中世纪)/glitch(现代)/vortex-unveil(未来)
 * 时间线美学：每屏切换对应一个时代的独特过渡效果。
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

// 时间线风格：burn → pixel → flip-book → glitch → vortex
const eraStyles = ['burn', 'pixel', 'flip', 'glitch', 'vortex', 'vortex']

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'cg-nav-dot' + (i === 0 ? ' cg-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.cg-nav-dot').forEach((dot, i) => dot.classList.toggle('cg-active', i === index))
  const el = document.querySelector('.cg-page-indicator .cg-current')
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
  gsap.set(panels, { opacity: 1, filter: 'none', clipPath: 'none', rotateY: 0, scale: 1 })

  for (let i = 0; i < segments; i++) {
    const era = eraStyles[i]
    // 出：根据旧时代选择消散动画
    switch (era) {
      case 'burn':
        tl.to(panels[i], { filter: 'brightness(3) saturate(0) contrast(2)', opacity: 0, duration: 0.45, ease: 'power3.in' }, i)
        break
      case 'pixel':
        tl.to(panels[i], { filter: 'blur(8px) contrast(0.5)', scale: 1.1, opacity: 0, duration: 0.45, ease: 'power3.in' }, i)
        break
      case 'flip':
        tl.to(panels[i], { rotateY: -120, scale: 0.5, opacity: 0, duration: 0.5, ease: 'power3.in' }, i)
        break
      case 'glitch':
        tl.to(panels[i], { filter: 'hue-rotate(180deg) saturate(2) brightness(0.5)', opacity: 0, duration: 0.4, ease: 'power3.in' }, i)
        break
      case 'vortex':
        tl.to(panels[i], { clipPath: 'circle(0% at 50% 50%)', filter: 'blur(8px)', opacity: 0, duration: 0.5, ease: 'power3.in' }, i)
        break
    }
    // 入：根据新时代入场
    const nextEra = eraStyles[Math.min(i + 1, eraStyles.length - 1)]
    switch (nextEra) {
      case 'burn':
        tl.fromTo(panels[i + 1], { filter: 'brightness(5) blur(4px)', scale: 1.2, opacity: 0 }, { filter: 'brightness(1) blur(0px)', scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, i + 0.4)
        break
      case 'pixel':
        tl.fromTo(panels[i + 1], { clipPath: 'polygon(0% 0%, 10% 0%, 10% 100%, 0% 100%, 20% 0%, 30% 0%, 30% 100%, 20% 100%, 40% 0%, 50% 0%, 50% 100%, 40% 100%, 60% 0%, 70% 0%, 70% 100%, 60% 100%, 80% 0%, 90% 0%, 90% 100%, 80% 100%)', filter: 'contrast(3) brightness(0.5)', opacity: 0 }, { clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)', filter: 'contrast(1) brightness(1)', opacity: 1, duration: 0.5, ease: 'power3.out' }, i + 0.4)
        tl.call(() => { panels[i + 1].style.clipPath = 'none' }, [], i + 0.95)
        break
      case 'flip':
        tl.fromTo(panels[i + 1], { rotateY: 120, scale: 0.3, opacity: 0, filter: 'blur(4px)' }, { rotateY: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'back.out(1.5)' }, i + 0.4)
        break
      case 'glitch':
        tl.fromTo(panels[i + 1], { filter: 'hue-rotate(-120deg) saturate(3) brightness(2)', opacity: 0, scale: 1.1 }, { filter: 'hue-rotate(0deg) saturate(1) brightness(1)', opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' }, i + 0.4)
        break
      case 'vortex':
        tl.fromTo(panels[i + 1], { clipPath: 'circle(0% at 50% 50%)', rotateZ: -360, scale: 0.1, opacity: 0 }, { clipPath: 'circle(100% at 50% 50%)', rotateZ: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' }, i + 0.4)
        tl.call(() => { panels[i + 1].style.clipPath = 'none' }, [], i + 1.0)
        break
    }
    // 清理所有 clipPath 和 filter
    tl.call(() => { panels[i].style.clipPath = 'none'; panels[i].style.filter = '' }, [], i + 1.1)
    if (i === segments - 1) {
      tl.call(() => { panels[i + 1].style.clipPath = 'none'; panels[i + 1].style.filter = '' }, [], i + 1.15)
    }
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
  scrollArea = document.getElementById('cgScrollArea') as HTMLElement; stage = document.getElementById('cgStage') as HTMLElement
  progressBar = document.getElementById('cgProgressBar'); navDots = document.getElementById('cgNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.cg-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="cg-page">
    <div id="cgProgressBar" class="cg-progress-bar"></div>
    <nav id="cgNavDots" class="cg-nav-dots"></nav>
    <div class="cg-page-indicator"><span class="cg-current">1</span><span class="cg-total"> / {{ totalPanels }}</span></div>
    <div id="cgScrollArea" class="cg-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="cgStage" class="cg-stage">
        <section class="cg-panel cg-panel-0"><div class="cg-content"><h2>01</h2></div></section>
        <section class="cg-panel cg-panel-1"><div class="cg-content"><h2>02</h2></div></section>
        <section class="cg-panel cg-panel-2"><div class="cg-content"><h2>03</h2></div></section>
        <section class="cg-panel cg-panel-3"><div class="cg-content"><h2>04</h2></div></section>
        <section class="cg-panel cg-panel-4"><div class="cg-content"><h2>05</h2></div></section>
        <section class="cg-panel cg-panel-5"><div class="cg-content"><h2>06</h2></div></section>
        <section class="cg-panel cg-panel-6"><div class="cg-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cg-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.cg-scroll-area { position: relative; }
.cg-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1800px; }
.cg-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.cg-content { text-align: center; z-index: 2; h2 { font-size: 6rem; font-weight: 900; margin: 0; letter-spacing: 4px; opacity: .85; } }
.cg-panel-0 { background: linear-gradient(135deg, #ece6e0, #eedad2); }
.cg-panel-1 { background: linear-gradient(135deg, #e8ece8, #d8eed8); }
.cg-panel-2 { background: linear-gradient(135deg, #dcdcf0, #d6d6ee); }
.cg-panel-3 { background: linear-gradient(135deg, #e4dcf0, #eed8e4); }
.cg-panel-4 { background: linear-gradient(135deg, #dce2f0, #d6e4ee); }
.cg-panel-5 { background: linear-gradient(135deg, #ead8e0, #eed6e2); }
.cg-panel-6 { background: linear-gradient(135deg, #e0eaf2, #d8e8f0); }
@media (max-width: 768px) { .cg-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.cg-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.cg-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,200,100,.2); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,200,100,.5); transform: scale(1.3); }
  &.cg-active { background: #ffc864; border-color: rgba(255,200,100,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(255,200,100,.5); }
}
.cg-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #ff6b35, #2ecc71, #3498db, #9b59b6, #e74c3c, #f39c12); box-shadow: 0 0 10px rgba(255,200,100,.4); }
.cg-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .cg-nav-dots { gap: 10px; } .cg-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
