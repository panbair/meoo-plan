<script setup lang="ts">
/**
 * ==================== Memory Fragments ====================
 * 记忆碎片 —— 混合 shatter(碎片反向汇聚) + blur(模糊消融) + mirror(镜像放大)
 * 碎片从四面八方飞回拼成完整画面，模糊消融旧记忆，镜面反射放大新记忆。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
const fragmentCols = 5
const fragmentRows = 4
const fragmentCount = fragmentCols * fragmentRows
let vh = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let stage: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let panels: HTMLElement[] = []
let mainTL: gsap.core.Timeline | null = null
const fragmentContainers: HTMLElement[][] = []

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'mf-nav-dot' + (i === 0 ? ' mf-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.mf-nav-dot').forEach((dot, i) => dot.classList.toggle('mf-active', i === index))
  const el = document.querySelector('.mf-page-indicator .mf-current')
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

function buildFragments(panel: HTMLElement): HTMLElement[] {
  const old = panel.querySelectorAll('.mf-fragment')
  old.forEach(el => el.remove())
  const frags: HTMLElement[] = []
  const w = panel.clientWidth || window.innerWidth
  const h = panel.clientHeight || window.innerHeight
  for (let r = 0; r < fragmentRows; r++) {
    for (let c = 0; c < fragmentCols; c++) {
      const fw = w / fragmentCols
      const fh = h / fragmentRows
      const frag = document.createElement('div')
      frag.className = 'mf-fragment'
      frag.style.cssText = `position:absolute;left:${c * fw}px;top:${r * fh}px;width:${fw}px;height:${fh}px;overflow:hidden;opacity:1;`
      const inner = document.createElement('div')
      inner.style.cssText = `position:absolute;inset:0;width:${w}px;height:${h}px;background:inherit;transform:translate(-${c * fw}px,-${r * fh}px);`
      frag.appendChild(inner)
      panel.appendChild(frag)
      frags.push(frag)
    }
  }
  return frags
}

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1, filter: 'none' })

  for (let i = 0; i < segments; i++) {
    // 阶段1：碎片正向散开（shatter out）
    const frags = buildFragments(panels[i])
    tl.set(frags, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 })
    for (let f = 0; f < frags.length; f++) {
      const row = Math.floor(f / fragmentCols)
      const col = f % fragmentCols
      const cx = (col - (fragmentCols - 1) / 2) / fragmentCols
      const cy = (row - (fragmentRows - 1) / 2) / fragmentRows
      const dist = 300 + Math.random() * 500
      tl.to(frags[f], {
        x: cx * dist, y: cy * dist,
        scale: 0.2 + Math.random() * 0.3,
        rotate: (Math.random() - 0.5) * 360,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in'
      }, i + f * 0.015)
    }
    // 阶段2：模糊消融（blur fade）
    tl.to(panels[i], { filter: 'blur(30px)', opacity: 0, duration: 0.4, ease: 'power2.in' }, i + 0.5)
    // 阶段3：镜像翻面入场（mirror flip in）
    tl.fromTo(panels[i + 1],
      { filter: 'blur(20px)', opacity: 0, scale: 0.5, rotateY: 180 },
      { filter: 'blur(0px)', opacity: 1, scale: 1, rotateY: 0, duration: 0.6, ease: 'back.out(1.4)' },
      i + 0.65
    )
    // 清理
    tl.call(() => { frags.forEach(f => f.remove()) }, [], i + 1.3)
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
  panels.forEach(p => p.querySelectorAll('.mf-fragment').forEach(el => el.remove()))
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('mfScrollArea') as HTMLElement; stage = document.getElementById('mfStage') as HTMLElement
  progressBar = document.getElementById('mfProgressBar'); navDots = document.getElementById('mfNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.mf-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="mf-page">
    <div id="mfProgressBar" class="mf-progress-bar"></div>
    <nav id="mfNavDots" class="mf-nav-dots"></nav>
    <div class="mf-page-indicator"><span class="mf-current">1</span><span class="mf-total"> / {{ totalPanels }}</span></div>
    <div id="mfScrollArea" class="mf-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="mfStage" class="mf-stage">
        <section class="mf-panel mf-panel-0"><div class="mf-content"><h2>01</h2></div></section>
        <section class="mf-panel mf-panel-1"><div class="mf-content"><h2>02</h2></div></section>
        <section class="mf-panel mf-panel-2"><div class="mf-content"><h2>03</h2></div></section>
        <section class="mf-panel mf-panel-3"><div class="mf-content"><h2>04</h2></div></section>
        <section class="mf-panel mf-panel-4"><div class="mf-content"><h2>05</h2></div></section>
        <section class="mf-panel mf-panel-5"><div class="mf-content"><h2>06</h2></div></section>
        <section class="mf-panel mf-panel-6"><div class="mf-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mf-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.mf-scroll-area { position: relative; }
.mf-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1500px; }
.mf-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.06); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.mf-content { text-align: center; z-index: 2; h2 { font-size: 6rem; font-weight: 900; margin: 0; letter-spacing: 4px; opacity: .85; } }
.mf-panel-0 { background: linear-gradient(135deg, #dcdff0, #2d2d4e); }
.mf-panel-1 { background: linear-gradient(135deg, #2d2d4e, #3a3a5e); }
.mf-panel-2 { background: linear-gradient(135deg, #1a2e2d, #2d4e4e); }
.mf-panel-3 { background: linear-gradient(135deg, #2e1a2d, #4e2d4e); }
.mf-panel-4 { background: linear-gradient(135deg, #2d2e1a, #4e4e2d); }
.mf-panel-5 { background: linear-gradient(135deg, #2e1a1a, #4e2d2d); }
.mf-panel-6 { background: linear-gradient(135deg, #dcdcf0, #2d2d6e); }
@media (max-width: 768px) { .mf-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.mf-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.mf-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(100,180,255,.2); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(100,180,255,.5); transform: scale(1.3); }
  &.mf-active { background: #64b4ff; border-color: rgba(100,180,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(100,180,255,.5); }
}
.mf-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #64b4ff, #a78bfa, #f472b6); box-shadow: 0 0 10px rgba(100,180,255,.4); }
.mf-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .mf-nav-dots { gap: 10px; } .mf-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
