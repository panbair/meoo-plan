<script setup lang="ts">
/**
 * ==================== Neon City ====================
 * 霓虹都市 —— 混合 neon-slice(霓虹切片) + glitch(数字故障) + hue-shift(色相轮转) + wipe(扫光)
 * 赛博朋克风格：切片RGB偏移翻出 → 色相轮转切换 → 扫光擦拭入场 → 霓虹发光边框
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
const sliceCount = 6
let vh = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let stage: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let panels: HTMLElement[] = []
let mainTL: gsap.core.Timeline | null = null
const sliceContainers: HTMLElement[][] = []

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'nc-nav-dot' + (i === 0 ? ' nc-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.nc-nav-dot').forEach((dot, i) => dot.classList.toggle('nc-active', i === index))
  const el = document.querySelector('.nc-page-indicator .nc-current')
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

function setupSlices() {
  sliceContainers.length = 0
  panels.forEach(panel => {
    const slices: HTMLElement[] = []
    let container = panel.querySelector('.nc-slice-container') as HTMLElement
    if (!container) { container = document.createElement('div'); container.className = 'nc-slice-container'; panel.appendChild(container) }
    container.innerHTML = ''
    const h = 100 / sliceCount
    for (let s = 0; s < sliceCount; s++) {
      const wrap = document.createElement('div')
      wrap.className = 'nc-slice-wrap'
      wrap.style.cssText = `position:absolute;left:0;width:100%;height:${h}%;top:${s * h}%;overflow:hidden;backface-visibility:hidden;`
      const main = document.createElement('div')
      main.className = 'nc-slice-main'
      main.style.cssText = `position:absolute;inset:0;background:inherit;transform:translateY(-${s * h}vh);`
      const r = document.createElement('div')
      r.className = 'nc-slice-r'
      r.style.cssText = `position:absolute;inset:0;background:inherit;transform:translateY(-${s * h}vh);opacity:0;mix-blend-mode:screen;filter:brightness(1.5) sepia(1) hue-rotate(-30deg) saturate(3);`
      const b = document.createElement('div')
      b.className = 'nc-slice-b'
      b.style.cssText = `position:absolute;inset:0;background:inherit;transform:translateY(-${s * h}vh);opacity:0;mix-blend-mode:screen;filter:brightness(1.5) sepia(1) hue-rotate(200deg) saturate(3);`
      const border = document.createElement('div')
      border.className = 'nc-slice-border'
      border.style.cssText = `position:absolute;inset:0;border-left:2px solid transparent;border-right:2px solid transparent;opacity:0;pointer-events:none;`
      wrap.append(main, r, b, border)
      container.appendChild(wrap)
      slices.push(wrap)
    }
    sliceContainers.push(slices)
  })
}

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1 })

  for (let i = 0; i < segments; i++) {
    const slices = sliceContainers[i]
    if (!slices?.length) continue
    // 阶段1：切片RGB偏移 + 霓虹边框闪烁
    for (let s = 0; s < sliceCount; s++) {
      const wrap = slices[s]
      const rLayer = wrap.querySelector('.nc-slice-r') as HTMLElement
      const bLayer = wrap.querySelector('.nc-slice-b') as HTMLElement
      const border = wrap.querySelector('.nc-slice-border') as HTMLElement
      tl.to([rLayer, bLayer], { opacity: 0.3, duration: 0.12 }, i + s * 0.03)
      tl.to(rLayer, { x: '-15px', opacity: 0, duration: 0.3 }, i + 0.15 + s * 0.03)
      tl.to(bLayer, { x: '15px', opacity: 0, duration: 0.3 }, i + 0.15 + s * 0.03)
      tl.to(border, { borderLeftColor: '#0ff', borderRightColor: '#f0f', opacity: 0.7, boxShadow: '0 0 20px rgba(0,255,255,.4)', duration: 0.12 }, i + s * 0.03)
      tl.to(border, { opacity: 0, duration: 0.3 }, i + 0.3 + s * 0.03)
      // 切片缩进消失
      tl.to(wrap, { x: s % 2 === 0 ? '-120%' : '120%', duration: 0.45, ease: 'power2.in' }, i + 0.2 + s * 0.04)
    }
    // 阶段2：色相轮转（glitch色偏） + 面板淡出
    tl.to(panels[i], { filter: 'hue-rotate(180deg) saturate(3) brightness(0.5)', duration: 0.3 }, i + 0.5)
    tl.to(panels[i], { opacity: 0, filter: 'hue-rotate(360deg) saturate(0) brightness(0)', duration: 0.3 }, i + 0.8)
    // 阶段3：扫光擦拭入场（clip-path wipe + 霓虹色相恢复）
    tl.fromTo(panels[i + 1],
      { clipPath: 'inset(0 100% 0 0)', filter: 'hue-rotate(-120deg) brightness(2)', opacity: 0 },
      { clipPath: 'inset(0 0% 0 0)', filter: 'hue-rotate(0deg) brightness(1)', opacity: 1, duration: 0.6, ease: 'power3.out' },
      i + 0.7
    )
    // 清除 clip-path
    tl.call(() => { panels[i + 1].style.clipPath = 'none' }, [], i + 1.35)
  }
  return tl
}

function startTimeline() {
  setupSlices()
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
  sliceContainers.forEach(sl => sl.forEach(w => gsap.set(w, { clearProps: 'all' })))
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('ncScrollArea') as HTMLElement; stage = document.getElementById('ncStage') as HTMLElement
  progressBar = document.getElementById('ncProgressBar'); navDots = document.getElementById('ncNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.nc-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="nc-page">
    <div id="ncProgressBar" class="nc-progress-bar"></div>
    <nav id="ncNavDots" class="nc-nav-dots"></nav>
    <div class="nc-page-indicator"><span class="nc-current">1</span><span class="nc-total"> / {{ totalPanels }}</span></div>
    <div id="ncScrollArea" class="nc-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="ncStage" class="nc-stage">
        <section class="nc-panel nc-panel-0"><div class="nc-content"><h2>01</h2></div></section>
        <section class="nc-panel nc-panel-1"><div class="nc-content"><h2>02</h2></div></section>
        <section class="nc-panel nc-panel-2"><div class="nc-content"><h2>03</h2></div></section>
        <section class="nc-panel nc-panel-3"><div class="nc-content"><h2>04</h2></div></section>
        <section class="nc-panel nc-panel-4"><div class="nc-content"><h2>05</h2></div></section>
        <section class="nc-panel nc-panel-5"><div class="nc-content"><h2>06</h2></div></section>
        <section class="nc-panel nc-panel-6"><div class="nc-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nc-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.nc-scroll-area { position: relative; }
.nc-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.nc-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(0,255,255,.05); border-radius: 24px; pointer-events: none; z-index: 1; box-shadow: inset 0 0 40px rgba(0, 255, 255, 0.02); }
}
.nc-slice-container { position: absolute; inset: 0; z-index: 0; }
.nc-content { text-align: center; z-index: 2; position: relative; h2 { font-size: 6rem; font-weight: 900; margin: 0; text-shadow: 0 0 40px rgba(0,255,255,.25), 0 0 80px rgba(255,0,255,.15), 0 0 120px rgba(0,255,255,.08); letter-spacing: 6px; } }
.nc-panel-0 { background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,255,255,0.06) 0%, transparent 70%), linear-gradient(135deg, #f0f1f8 0%, #e0e4f2 50%, #eceef4 100%); }
.nc-panel-1 { background: radial-gradient(ellipse 50% 50% at 30% 60%, rgba(0,200,200,0.06) 0%, transparent 65%), linear-gradient(135deg, #f0f4f5 0%, #e0eaf2 50%, #eef2f4 100%); }
.nc-panel-2 { background: radial-gradient(ellipse 50% 50% at 70% 30%, rgba(200,0,255,0.06) 0%, transparent 65%), linear-gradient(135deg, #f0eef8 0%, #e4e2f2 50%, #ece8f4 100%); }
.nc-panel-3 { background: radial-gradient(ellipse 50% 50% at 40% 60%, rgba(0,255,180,0.06) 0%, transparent 65%), linear-gradient(135deg, #eef6f2 0%, #e0f0e8 50%, #eef4f0 100%); }
.nc-panel-4 { background: radial-gradient(ellipse 50% 50% at 60% 40%, rgba(255,150,0,0.05) 0%, transparent 65%), linear-gradient(135deg, #f4f0ee 0%, #eee8e0 50%, #f2eee8 100%); }
.nc-panel-5 { background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,0,80,0.06) 0%, transparent 65%), linear-gradient(135deg, #f4f0f0 0%, #f0e4e6 50%, #f2ecee 100%); }
.nc-panel-6 { background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,100,255,0.06) 0%, transparent 70%), linear-gradient(135deg, #f0f2f8 0%, #e0e4f2 50%, #f0f2f6 100%); }
@media (max-width: 768px) { .nc-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.nc-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.nc-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(0,255,255,.15); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(0,255,255,.4); transform: scale(1.3); }
  &.nc-active { background: #0ff; border-color: rgba(0,255,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(0,255,255,.6); }
}
.nc-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #0ff, #f0f, #0ff); background-size: 200% 100%; animation: ncShine 1.5s linear infinite; box-shadow: 0 0 15px rgba(0,255,255,.5); }
@keyframes ncShine { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
.nc-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(0,255,255,.2); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .nc-nav-dots { gap: 10px; } .nc-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
