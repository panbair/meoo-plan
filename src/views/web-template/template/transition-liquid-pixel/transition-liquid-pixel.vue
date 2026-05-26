<script setup lang="ts">
/**
 * ==================== Transition Liquid Pixel ====================
 * 液体像素 —— 混合 pixelation(像素降级) + SVG liquid filter(液体波纹)
 * 面板先逐级像素化（4级），然后SVG液体波纹扭曲融化消失，
 * 下一屏从波纹中像素化重生恢复。
 * CSS 3D 增强：perspective + translateZ 纵深融入
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

const pixelSteps = [8, 4, 2, 1]

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tlp-nav-dot' + (i === 0 ? ' tlp-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.tlp-nav-dot').forEach((dot, i) => dot.classList.toggle('tlp-active', i === index))
  const el = document.querySelector('.tlp-page-indicator .tlp-current')
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
  gsap.set(panels, { opacity: 1, scale: 1, filter: 'none' })
  panels.forEach(p => { p.style.imageRendering = 'auto'; p.style.width = ''; p.style.height = ''; p.style.transform = '' })

  const turbEl = document.getElementById('tlpTurbulence') as SVGFETurbulenceElement | null
  const dispEl = document.getElementById('tlpDisplacement') as SVGFEDisplacementMapElement | null

  for (let i = 0; i < segments; i++) {
    // 阶段1：像素化降级 (4级阶梯)
    const stepCount = pixelSteps.length
    const durPerStep = 0.08
    for (let s = 0; s < stepCount; s++) {
      tl.call(() => {
        panels[i].style.imageRendering = 'pixelated'
        panels[i].style.width = `${100 * (pixelSteps[s] / 8)}vw`
        panels[i].style.height = `${100 * (pixelSteps[s] / 8)}vh`
        panels[i].style.transform = `scale(${8 / pixelSteps[s]})`
      }, [], i + s * durPerStep)
    }

    // 阶段2：液体波纹启动 + 融化消失（SVG filter + scale）
    const liquidObj = { freq: 0.005, scale: 0 }
    tl.to(liquidObj, {
      freq: 0.025, scale: 100, duration: 0.5, ease: 'power2.in',
      onUpdate: () => {
        if (turbEl) turbEl.setAttribute('baseFrequency', liquidObj.freq.toFixed(4))
        if (dispEl) dispEl.setAttribute('scale', liquidObj.scale.toFixed(0))
        panels[i].style.filter = 'url(#tlpLiquidFilter)'
      }
    }, i + stepCount * durPerStep)

    // 融化缩小消失（translateZ 退远制造深度融化感）
    tl.to(panels[i], {
      scale: 1.4, z: -250, filter: 'url(#tlpLiquidFilter) blur(8px)', opacity: 0,
      duration: 0.4, ease: 'power3.in'
    }, i + stepCount * durPerStep + 0.3)

    // 清理 filter
    tl.call(() => {
      panels[i].style.filter = 'none'
      if (turbEl) turbEl.setAttribute('baseFrequency', '0')
      if (dispEl) dispEl.setAttribute('scale', '0')
    }, [], i + stepCount * durPerStep + 0.75)

    // 下一屏：像素化 + 液体波纹 → 清晰恢复（从 3D 深度浮出）
    tl.fromTo(panels[i + 1],
      {
        z: -300, imageRendering: 'pixelated', filter: 'url(#tlpLiquidFilter) blur(12px)',
        scale: 2.5, opacity: 0
      },
      {
        imageRendering: 'auto', filter: 'none', scale: 1, z: 0, opacity: 1,
        duration: 0.7, ease: 'power2.out',
        onStart: () => {
          panels[i + 1].style.imageRendering = 'pixelated'
          if (turbEl) turbEl.setAttribute('baseFrequency', '0.02')
          if (dispEl) dispEl.setAttribute('scale', '80')
        },
        onUpdate: function(this: any) {
          const p = this.progress()
          if (p > 0.5) {
            panels[i + 1].style.imageRendering = 'auto'
            panels[i + 1].style.filter = 'none'
          }
        }
      },
      i + stepCount * durPerStep + 0.45
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
function killCurrent() { ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() }); mainTL?.kill(); mainTL = null; gsap.set(panels, { clearProps: 'all' }); panels.forEach(p => { p.style.imageRendering = 'auto'; p.style.width = ''; p.style.height = ''; p.style.transform = ''; p.style.filter = 'none'; (p.style as any).z = '' }) }
function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tlpScrollArea') as HTMLElement; stage = document.getElementById('tlpStage') as HTMLElement
  progressBar = document.getElementById('tlpProgressBar'); navDots = document.getElementById('tlpNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tlp-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}
function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="tlp-page">
    <svg style="position:absolute;width:0;height:0;overflow:hidden;" aria-hidden="true">
      <defs>
        <filter id="tlpLiquidFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence id="tlpTurbulence" type="fractalNoise" baseFrequency="0" numOctaves="4" result="noise" />
          <feDisplacementMap id="tlpDisplacement" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
    <div id="tlpProgressBar" class="tlp-progress-bar"></div>
    <nav id="tlpNavDots" class="tlp-nav-dots"></nav>
    <div class="tlp-page-indicator"><span class="tlp-current">1</span><span class="tlp-total"> / {{ totalPanels }}</span></div>
    <div id="tlpScrollArea" class="tlp-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tlpStage" class="tlp-stage">
        <section class="tlp-panel tlp-panel-0"><div class="tlp-content"><h2>Panel 1</h2></div></section>
        <section class="tlp-panel tlp-panel-1"><div class="tlp-content"><h2>Panel 2</h2></div></section>
        <section class="tlp-panel tlp-panel-2"><div class="tlp-content"><h2>Panel 3</h2></div></section>
        <section class="tlp-panel tlp-panel-3"><div class="tlp-content"><h2>Panel 4</h2></div></section>
        <section class="tlp-panel tlp-panel-4"><div class="tlp-content"><h2>Panel 5</h2></div></section>
        <section class="tlp-panel tlp-panel-5"><div class="tlp-content"><h2>Panel 6</h2></div></section>
        <section class="tlp-panel tlp-panel-6"><div class="tlp-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tlp-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #060610; color: #fff; perspective: 1200px; }
.tlp-scroll-area { position: relative; }
.tlp-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1200px; transform-style: preserve-3d; }
.tlp-panel { position: absolute; inset: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; will-change: filter, transform;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.06); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.tlp-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0; } }
.tlp-panel-0 { background: linear-gradient(135deg, #1a0a3e, #0a2a5e); }
.tlp-panel-1 { background: linear-gradient(135deg, #0a3e3a, #0a5e2a); }
.tlp-panel-2 { background: linear-gradient(135deg, #3e1a0a, #5e2a0a); }
.tlp-panel-3 { background: linear-gradient(135deg, #1a1a3e, #2a2a5e); }
.tlp-panel-4 { background: linear-gradient(135deg, #3e0a3e, #5e0a5e); }
.tlp-panel-5 { background: linear-gradient(135deg, #0a3e1a, #0a5e3a); }
.tlp-panel-6 { background: linear-gradient(135deg, #1a1a2e, #2a3a5e); }
@media (max-width: 768px) { .tlp-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tlp-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tlp-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.15); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.4); transform: scale(1.3); }
  &.tlp-active { background: #2ecc71; border-color: rgba(46,204,113,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(46,204,113,.5); }
}
.tlp-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #2ecc71, #3498db, #9b59b6); box-shadow: 0 0 10px rgba(46,204,113,.4); }
.tlp-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .tlp-nav-dots { gap: 10px; } .tlp-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
