<script setup lang="ts">
/**
 * ==================== Gravity Shift ====================
 * 重力偏移 —— slide-h(水平重力) + slide-v(垂直重力) + skew(倾斜重力扭曲) + flyin(空间飞入)
 * 重力场改变概念：面板左右横移出界 → 上下跌出视口 → 倾斜扭曲变形 → 从远距离空间飞入
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
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button'); dot.className = 'gs-nav-dot' + (i === 0 ? ' gs-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.gs-nav-dot').forEach((d, i) => d.classList.toggle('gs-active', i === index))
  const el = document.querySelector('.gs-page-indicator .gs-current'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}
function goToPanel(index: number) { index = Math.max(0, Math.min(index, totalPanels - 1)); window.scrollTo({ top: (scrollArea?.offsetTop || 0) + index * vh, behavior: 'smooth' }) }
function onKeydown(e: KeyboardEvent) { const m: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }; if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) } }
let tsY = 0
function onTouchStart(e: TouchEvent) { tsY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) { const d = tsY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })

  for (let i = 0; i < segments; i++) {
    const cur = panels[i]
    const nxt = panels[i + 1]
    // 当前面板的出口方向循环 [左, 下, 右, 上, 左上, 右下]
    const directions = [0, 1, 2, 3, 0, 1]
    const dir = directions[i % directions.length]

    // === 阶段1: slide-h 水平重力 ===
    if (dir === 0 || dir === 2) {
      tl.to(cur, {
        x: dir === 0 ? '-110%' : '110%',
        rotation: dir === 0 ? -10 : 10,
        duration: 0.4, ease: 'power3.in'
      }, i)
    }
    // === 阶段2: slide-v 垂直重力 ===
    else if (dir === 1 || dir === 3) {
      tl.to(cur, {
        y: dir === 1 ? '110%' : '-110%',
        rotation: dir === 1 ? 5 : -5,
        duration: 0.4, ease: 'power3.in'
      }, i)
    }
    // === 阶段3: skew 倾斜扭曲 ===
    // 剩余面板做倾斜+缩放消失
    tl.to(cur, {
      skewX: dir === 0 ? -15 : dir === 2 ? 15 : 0,
      skewY: dir === 1 ? 10 : dir === 3 ? -10 : 0,
      scale: 0.6, opacity: 0,
      duration: 0.35, ease: 'power2.in'
    }, i + 0.25)

    // === 阶段4: flyin 空间飞入 ===
    // 新面板从远处飞入（从反方向）
    const flyFromX = dir === 2 ? -200 : dir === 0 ? 200 : (dir === 0 ? -100 : 100)
    const flyFromY = dir === 3 ? 200 : dir === 1 ? -200 : 0
    tl.set(nxt, {
      x: flyFromX !== 0 ? flyFromX + '%' : 0,
      y: flyFromY !== 0 ? flyFromY + '%' : 0,
      scale: 0.3, rotationZ: dir * 30, opacity: 0,
      filter: 'blur(8px)'
    }, i + 0.3)
    tl.to(nxt, {
      x: 0, y: 0,
      scale: 1, rotationZ: 0, opacity: 1,
      filter: 'blur(0px)',
      duration: 0.55, ease: 'power3.out'
    }, i + 0.45)

    // 稳定落地微弹
    tl.to(nxt, { scale: 0.97, duration: 0.08, ease: 'power2.out' }, i + 0.9)
    tl.to(nxt, { scale: 1, duration: 0.15, ease: 'elastic.out(1, 0.3)' }, i + 0.98)
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
  scrollArea = document.getElementById('gsScrollArea') as HTMLElement; stage = document.getElementById('gsStage') as HTMLElement
  progressBar = document.getElementById('gsProgressBar'); navDots = document.getElementById('gsNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.gs-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}
function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="gs-page">
    <div id="gsProgressBar" class="gs-progress-bar"></div>
    <nav id="gsNavDots" class="gs-nav-dots"></nav>
    <div class="gs-page-indicator"><span class="gs-current">1</span><span class="gs-total"> / {{ totalPanels }}</span></div>
    <div id="gsScrollArea" class="gs-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="gsStage" class="gs-stage">
        <section class="gs-panel gs-panel-0"><div class="gs-content"><h2>01</h2></div></section>
        <section class="gs-panel gs-panel-1"><div class="gs-content"><h2>02</h2></div></section>
        <section class="gs-panel gs-panel-2"><div class="gs-content"><h2>03</h2></div></section>
        <section class="gs-panel gs-panel-3"><div class="gs-content"><h2>04</h2></div></section>
        <section class="gs-panel gs-panel-4"><div class="gs-content"><h2>05</h2></div></section>
        <section class="gs-panel gs-panel-5"><div class="gs-content"><h2>06</h2></div></section>
        <section class="gs-panel gs-panel-6"><div class="gs-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gs-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #0c0c14; color: #fff; }
.gs-scroll-area { position: relative; }
.gs-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.gs-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::after { content: ''; position: absolute; inset: 30px; border: 1px solid rgba(255,255,255,.05); border-radius: 18px; pointer-events: none; z-index: 1; }
}
.gs-content { text-align: center; z-index: 2; position: relative;
  h2 { font-size: 5rem; font-weight: 900; margin: 0; letter-spacing: 6px; color: rgba(255,255,255,.7); text-shadow: 0 0 50px rgba(255,255,255,.05); }
}
.gs-panel-0 { background: radial-gradient(ellipse at 30% 30%, #2a1a3e, #0c0c14); }
.gs-panel-1 { background: radial-gradient(ellipse at 70% 70%, #1a3e2a, #0c0c14); }
.gs-panel-2 { background: radial-gradient(ellipse at 30% 70%, #3e1a2a, #0c0c14); }
.gs-panel-3 { background: radial-gradient(ellipse at 70% 30%, #1a2a3e, #0c0c14); }
.gs-panel-4 { background: radial-gradient(ellipse at 50% 50%, #3e3e1a, #0c0c14); }
.gs-panel-5 { background: radial-gradient(ellipse at 30% 50%, #1a3e3e, #0c0c14); }
.gs-panel-6 { background: radial-gradient(ellipse at 50% 30%, #2a1a3e, #0c0c14); }
@media (max-width: 768px) { .gs-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.gs-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.gs-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.1); cursor: pointer; border: 1px solid rgba(255,255,255,.15); transition: all .3s;
  &:hover { background: rgba(255,255,255,.3); transform: scale(1.3); }
  &.gs-active { background: #fff; border-color: rgba(255,255,255,.5); transform: scale(1.4); box-shadow: 0 0 16px rgba(255,255,255,.3); }
}
.gs-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #a8f, #4a8, #a8f); animation: gsSlide 2s linear infinite; }
@keyframes gsSlide { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
.gs-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.5); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.15); color: rgba(255,255,255,.7); }
@media (max-width: 768px) { .gs-nav-dots { gap: 10px; } .gs-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
