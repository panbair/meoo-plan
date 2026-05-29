<script setup lang="ts">
/**
 * ==================== Transition Neon Slice ====================
 * 霓虹切片 —— 混合 glitch(RGB色差) + strips(DOM切片) + neon glow
 * 8条水平切片带RGB色差偏移依次3D翻出，霓虹发光边框闪烁，赛博朋克风格。
 * CSS 3D 增强：rotateY 翻出 + translateZ 景深 + preserve-3d 层级
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
const sliceCount = 8
let vh = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let stage: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let panels: HTMLElement[] = []
let mainTL: gsap.core.Timeline | null = null

// 为每个面板预建切片 DOM：每条切片含 RGB 偏移子层
const sliceContainers: HTMLElement[][] = []

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tns-nav-dot' + (i === 0 ? ' tns-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tns-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tns-active', i === index)
  })
  const el = document.querySelector('.tns-page-indicator .tns-current')
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
    ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1,
    Home: 0, End: totalPanels - 1
  }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    e.key === 'Home' || e.key === 'End' ? goToPanel(keyMap[e.key]) : goToPanel(currentIndex + keyMap[e.key])
  }
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToPanel(currentIndex + (diff > 0 ? 1 : -1))
}

function setupSlices() {
  sliceContainers.length = 0
  panels.forEach(panel => {
    const slices: HTMLElement[] = []
    let container = panel.querySelector('.tns-slice-container') as HTMLElement
    if (!container) {
      container = document.createElement('div')
      container.className = 'tns-slice-container'
      panel.appendChild(container)
    }
    container.innerHTML = ''
    const h = 100 / sliceCount
    for (let s = 0; s < sliceCount; s++) {
      const wrap = document.createElement('div')
      wrap.className = 'tns-slice-wrap'
      wrap.style.cssText = `position:absolute;left:0;width:100%;height:${h}%;top:${s * h}%;overflow:hidden;backface-visibility:hidden;transform-style:preserve-3d;`
      // 主切片（当前面板内容）
      const main = document.createElement('div')
      main.className = 'tns-slice-main'
      main.style.cssText = `position:absolute;inset:0;background:inherit;transform:translateY(-${s * h}vh);`
      // 红色通道偏移层
      const r = document.createElement('div')
      r.className = 'tns-slice-r'
      r.style.cssText = `position:absolute;inset:0;background:inherit;transform:translateY(-${s * h}vh);opacity:0;mix-blend-mode:screen;`
      // 蓝色通道偏移层
      const b = document.createElement('div')
      b.className = 'tns-slice-b'
      b.style.cssText = `position:absolute;inset:0;background:inherit;transform:translateY(-${s * h}vh);opacity:0;mix-blend-mode:screen;`
      // 霓虹边框
      const border = document.createElement('div')
      border.className = 'tns-slice-border'
      border.style.cssText = `position:absolute;inset:0;border-top:2px solid transparent;border-bottom:2px solid transparent;opacity:0;pointer-events:none;`
      wrap.appendChild(main)
      wrap.appendChild(r)
      wrap.appendChild(b)
      wrap.appendChild(border)
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
    if (!slices || slices.length === 0) continue
    // 每条的滑出方向交替（左/右），RGB激活，霓虹边框闪烁
    for (let s = 0; s < sliceCount; s++) {
      const dir = s % 2 === 0 ? 1 : -1  // 交替左右翻转方向
      const staggerOffset = s * 0.04
      const wrap = slices[s]
      const rLayer = wrap.querySelector('.tns-slice-r') as HTMLElement
      const bLayer = wrap.querySelector('.tns-slice-b') as HTMLElement
      const border = wrap.querySelector('.tns-slice-border') as HTMLElement

      // RGB偏移激活
      tl.to([rLayer, bLayer], { opacity: 0.25, duration: 0.15 }, i + staggerOffset)
      // 主切片 rotateY 3D翻出 + translateZ 深度退远
      tl.to(wrap, {
        rotateY: dir * 110,
        z: -200,
        duration: 0.6, ease: 'power3.in'
      }, i + 0.1 + staggerOffset)
      // RGB偏移增强后消失
      tl.to(rLayer, { x: '-20px', opacity: 0, duration: 0.3 }, i + 0.3 + staggerOffset)
      tl.to(bLayer, { x: '20px', opacity: 0, duration: 0.3 }, i + 0.3 + staggerOffset)
      // 霓虹边框闪烁
      tl.to(border, {
        borderTopColor: '#0ff', borderBottomColor: '#f0f',
        opacity: 0.8, boxShadow: '0 0 30px rgba(0,255,255,.6), 0 0 50px rgba(255,0,255,.4)',
        duration: 0.15
      }, i + 0.1 + staggerOffset)
      tl.to(border, { opacity: 0, duration: 0.3 }, i + 0.5 + staggerOffset)
    }
    // 面板本身淡出
    tl.to(panels[i], { opacity: 0, duration: 0.3 }, i + 0.8)
    // 下一屏：从 3D 深度闪入（translateZ 从远到近 + 霓虹色相）
    tl.fromTo(panels[i + 1],
      { z: -250, rotateY: 8, filter: 'brightness(2.5) saturate(0.5) hue-rotate(90deg)', scale: 1.1, opacity: 0 },
      { z: 0, rotateY: 0, filter: 'brightness(1) saturate(1) hue-rotate(0deg)', scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
      i + 0.7
    )
  }
  return tl
}

function startTimeline() {
  setupSlices()
  const tl = buildTimeline()
  mainTL = tl
  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.8,
    animation: tl,
    onUpdate: (self) => {
      const idx = Math.round(self.progress * (totalPanels - 1))
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
}

function killCurrent() {
  ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() })
  mainTL?.kill(); mainTL = null
  gsap.set(panels, { clearProps: 'all' })
  sliceContainers.forEach(sl => sl.forEach(w => gsap.set(w, { x: 0, y: 0, z: 0, rotateY: 0, clearProps: 'all' })))
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tnsScrollArea') as HTMLElement
  stage = document.getElementById('tnsStage') as HTMLElement
  progressBar = document.getElementById('tnsProgressBar')
  navDots = document.getElementById('tnsNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tns-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="tns-page">
    <div id="tnsProgressBar" class="tns-progress-bar"></div>
    <nav id="tnsNavDots" class="tns-nav-dots"></nav>
    <div class="tns-page-indicator"><span class="tns-current">1</span><span class="tns-total"> / {{ totalPanels }}</span></div>
    <div id="tnsScrollArea" class="tns-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tnsStage" class="tns-stage">
        <section class="tns-panel tns-panel-0"><div class="tns-content"><h2>Panel 1</h2></div></section>
        <section class="tns-panel tns-panel-1"><div class="tns-content"><h2>Panel 2</h2></div></section>
        <section class="tns-panel tns-panel-2"><div class="tns-content"><h2>Panel 3</h2></div></section>
        <section class="tns-panel tns-panel-3"><div class="tns-content"><h2>Panel 4</h2></div></section>
        <section class="tns-panel tns-panel-4"><div class="tns-content"><h2>Panel 5</h2></div></section>
        <section class="tns-panel tns-panel-5"><div class="tns-content"><h2>Panel 6</h2></div></section>
        <section class="tns-panel tns-panel-6"><div class="tns-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tns-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #050510; color: #1a1a2e; perspective: 1500px; }
.tns-scroll-area { position: relative; }
.tns-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1500px; transform-style: preserve-3d; }
.tns-panel { position: absolute; inset: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.tns-slice-container { position: absolute; inset: 0; z-index: 0; }
.tns-slice-wrap { overflow: hidden; }
.tns-slice-r { filter: brightness(1.5) sepia(1) hue-rotate(-30deg) saturate(3); } // 红色调
.tns-slice-b { filter: brightness(1.5) sepia(1) hue-rotate(200deg) saturate(3); } // 蓝色调
.tns-content { text-align: center; z-index: 2; position: relative; h2 { font-size: 3.5rem; font-weight: 900; margin: 0; text-shadow: 0 0 30px rgba(0,255,255,.3), 0 0 60px rgba(255,0,255,.2); } }
.tns-panel-0 { background: linear-gradient(135deg, #e8ebf5, #d8daf0); }
.tns-panel-1 { background: linear-gradient(135deg, #0f1a1a, #1a3a5e); }
.tns-panel-2 { background: linear-gradient(135deg, #1a0f24, #3a1a5e); }
.tns-panel-3 { background: linear-gradient(135deg, #0f241a, #1a5e3a); }
.tns-panel-4 { background: linear-gradient(135deg, #241a0f, #5e3a1a); }
.tns-panel-5 { background: linear-gradient(135deg, #1a0f0f, #5e1a1a); }
.tns-panel-6 { background: linear-gradient(135deg, #0f0f24, #d8daf0); }
@media (max-width: 768px) { .tns-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tns-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tns-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46,.2); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.5); transform: scale(1.3); }
  &.tns-active { background: #0ff; border-color: rgba(0,255,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(0,255,255,.6); }
}
.tns-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #0ff, #f0f, #0ff); background-size: 200% 100%; animation: tnsShine 1.5s linear infinite; box-shadow: 0 0 15px rgba(0,255,255,.5); }
@keyframes tnsShine { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
.tns-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(0,255,255,.2); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .tns-nav-dots { gap: 10px; } .tns-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
