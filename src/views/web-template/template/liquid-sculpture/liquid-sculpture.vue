<script setup lang="ts">
/**
 * ==================== Liquid Sculpture ====================
 * 液体雕塑 —— 混合 liquid(液体波纹) + liquid-pixel(液体像素) + circle(圆形扩散) + elastic(弹性定位)
 * 内容从液体波纹中浮现，像素融合成固形，圆形扩散，弹性定形。
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
    dot.className = 'ls-nav-dot' + (i === 0 ? ' ls-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.ls-nav-dot').forEach((dot, i) => dot.classList.toggle('ls-active', i === index))
  const el = document.querySelector('.ls-page-indicator .ls-current')
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
  gsap.set(panels, { opacity: 1, filter: 'none', clipPath: 'none', scale: 1 })

  for (let i = 0; i < segments; i++) {
    // 阶段1：液体波纹消融（liquid）- 圆形波纹收缩 + 扭曲
    const liquidObj = { progress: 0 }
    tl.to(liquidObj, {
      progress: 1, duration: 0.6, ease: 'power3.in',
      onUpdate: () => {
        const p = liquidObj.progress
        const radius = (1 - p) * 100
        panels[i].style.clipPath = `circle(${radius}% at ${50 + Math.sin(p * 6) * 10}% ${50 + Math.cos(p * 6) * 10}%)`
        panels[i].style.filter = `blur(${p * 15}px) hue-rotate(${p * 60}deg)`
      }
    }, i)
    tl.to(panels[i], { opacity: 0, duration: 0.2 }, i + 0.6)
    // 阶段2：液体像素融合（liquid-pixel）- 下一屏像素块融合
    tl.fromTo(panels[i + 1],
      { clipPath: 'circle(8% at 50% 50%)', filter: 'blur(12px) hue-rotate(-60deg) contrast(2)', opacity: 0 },
      { clipPath: 'circle(50% at 50% 50%)', filter: 'blur(4px) hue-rotate(-30deg) contrast(1.5)', opacity: 0.7, duration: 0.3, ease: 'power2.in' },
      i + 0.5
    )
    // 阶段3：圆形扩散（circle）+ 弹性定型（elastic）
    tl.to(panels[i + 1], {
      clipPath: 'circle(100% at 50% 50%)', filter: 'blur(0px) hue-rotate(0deg) contrast(1)',
      opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)'
    }, i + 0.7)
    // 清除
    tl.call(() => { panels[i].style.clipPath = 'none'; panels[i].style.filter = 'none'; panels[i + 1].style.clipPath = 'none'; panels[i + 1].style.filter = 'none' }, [], i + 1.25)
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
  scrollArea = document.getElementById('lsScrollArea') as HTMLElement; stage = document.getElementById('lsStage') as HTMLElement
  progressBar = document.getElementById('lsProgressBar'); navDots = document.getElementById('lsNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.ls-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="ls-page">
    <div id="lsProgressBar" class="ls-progress-bar"></div>
    <nav id="lsNavDots" class="ls-nav-dots"></nav>
    <div class="ls-page-indicator"><span class="ls-current">1</span><span class="ls-total"> / {{ totalPanels }}</span></div>
    <div id="lsScrollArea" class="ls-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="lsStage" class="ls-stage">
        <section class="ls-panel ls-panel-0"><div class="ls-content"><h2>01</h2></div></section>
        <section class="ls-panel ls-panel-1"><div class="ls-content"><h2>02</h2></div></section>
        <section class="ls-panel ls-panel-2"><div class="ls-content"><h2>03</h2></div></section>
        <section class="ls-panel ls-panel-3"><div class="ls-content"><h2>04</h2></div></section>
        <section class="ls-panel ls-panel-4"><div class="ls-content"><h2>05</h2></div></section>
        <section class="ls-panel ls-panel-5"><div class="ls-content"><h2>06</h2></div></section>
        <section class="ls-panel ls-panel-6"><div class="ls-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ls-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #020a14; color: #fff; }
.ls-scroll-area { position: relative; }
.ls-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.ls-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(0,200,255,.08); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.ls-content { text-align: center; z-index: 2; h2 { font-size: 6rem; font-weight: 900; margin: 0; letter-spacing: 4px; opacity: .85; } }
.ls-panel-0 { background: radial-gradient(circle at 50% 50%, #0a2a3e, #020a14); }
.ls-panel-1 { background: radial-gradient(circle at 50% 50%, #0a3e2a, #021410); }
.ls-panel-2 { background: radial-gradient(circle at 50% 50%, #2a0a3e, #140210); }
.ls-panel-3 { background: radial-gradient(circle at 50% 50%, #3e2a0a, #141002); }
.ls-panel-4 { background: radial-gradient(circle at 50% 50%, #3e0a2e, #14021a); }
.ls-panel-5 { background: radial-gradient(circle at 50% 50%, #0a3e3a, #021414); }
.ls-panel-6 { background: radial-gradient(circle at 50% 50%, #2a2a4e, #0a0a14); }
@media (max-width: 768px) { .ls-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.ls-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.ls-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(0,200,255,.2); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(0,200,255,.5); transform: scale(1.3); }
  &.ls-active { background: #00c8ff; border-color: rgba(0,200,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(0,200,255,.6); }
}
.ls-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #00c8ff, #00ff88, #0088ff); box-shadow: 0 0 15px rgba(0,200,255,.5); }
.ls-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(0,200,255,.2); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .ls-nav-dots { gap: 10px; } .ls-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
