<script setup lang="ts">
/**
 * ==================== Digital Deconstruction ====================
 * 数字解体 —— 混合 pixel(像素融化) + liquid-pixel(液体像素) + glitch(数字故障) + shatter(碎片纷飞)
 * 渐变解体：面板从像素熔化 → 液体像素融合 → 数字故障 → 最终碎片散尽。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
const fragmentCols = 5
const fragmentRows = 4
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
    dot.className = 'dd-nav-dot' + (i === 0 ? ' dd-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.dd-nav-dot').forEach((dot, i) => dot.classList.toggle('dd-active', i === index))
  const el = document.querySelector('.dd-page-indicator .dd-current')
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
  const old = panel.querySelectorAll('.dd-fragment')
  old.forEach(el => el.remove())
  const frags: HTMLElement[] = []
  const w = panel.clientWidth || window.innerWidth
  const h = panel.clientHeight || window.innerHeight
  for (let r = 0; r < fragmentRows; r++) {
    for (let c = 0; c < fragmentCols; c++) {
      const fw = w / fragmentCols
      const fh = h / fragmentRows
      const frag = document.createElement('div')
      frag.className = 'dd-fragment'
      frag.style.cssText = `position:absolute;left:${c * fw}px;top:${r * fh}px;width:${fw}px;height:${fh}px;overflow:hidden;opacity:0;`
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
  gsap.set(panels, { opacity: 1, filter: 'none', clipPath: 'none' })

  for (let i = 0; i < segments; i++) {
    // 阶段1：像素融化（pixel melting）- 面板逐渐降分辨率
    tl.to(panels[i], { filter: 'blur(4px) contrast(0.8) brightness(0.7)', duration: 0.3, ease: 'power2.in' }, i)
    // 像素块化渐变
    const pixelObj = { progress: 0 }
    tl.to(pixelObj, {
      progress: 1, duration: 0.3,
      onUpdate: () => {
        const p = pixelObj.progress
        const blockSize = Math.max(1, Math.floor((1 - p) * 50)) * 2
        const s = blockSize
        panels[i].style.filter = `blur(${p * 6}px) contrast(${0.8 + p * 0.5}) brightness(${0.7 - p * 0.3})`
        if (blockSize > 1 && blockSize < 100) {
          panels[i].style.imageRendering = 'pixelated'
        }
      }
    }, i)
    // 阶段2：液体像素融合（liquid-pixel）- 色相偏移+液体感模糊
    tl.to(panels[i], { filter: 'blur(10px) hue-rotate(90deg) saturate(0.3) brightness(0.4)', duration: 0.3, ease: 'power3.in' }, i + 0.3)
    // 阶段3：数字故障（glitch）- 强色偏+高亮闪烁
    tl.to(panels[i], { filter: 'hue-rotate(180deg) saturate(3) brightness(2)', duration: 0.2 }, i + 0.55)
    tl.to(panels[i], { filter: 'hue-rotate(-90deg) saturate(0) brightness(0)', opacity: 0.5, duration: 0.2 }, i + 0.72)
    // 阶段4：碎片纷飞（shatter）- 面板炸开碎片
    const frags = buildFragments(panels[i])
    tl.set(frags, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 })
    for (let f = 0; f < frags.length; f++) {
      const row = Math.floor(f / fragmentCols)
      const col = f % fragmentCols
      const cx = (col - (fragmentCols - 1) / 2) * 1.5
      const cy = (row - (fragmentRows - 1) / 2) * 1.5
      const dist = 300 + Math.random() * 600
      tl.to(frags[f], {
        x: cx * dist, y: cy * dist + 200,
        scale: 0, rotate: (Math.random() - 0.5) * 720,
        opacity: 0, duration: 0.5,
        ease: 'power3.in'
      }, i + 0.8 + f * 0.015)
    }
    tl.to(panels[i], { opacity: 0, duration: 0.1 }, i + 1.1)
    // 下一屏：从数字状态重建（反向解体过程）
    tl.fromTo(panels[i + 1],
      { filter: 'blur(6px) brightness(3) saturate(0)', scale: 1.2, opacity: 0 },
      { filter: 'blur(0px) brightness(1) saturate(1)', scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
      i + 0.95
    )
    // 清理
    tl.call(() => { panels[i].style.filter = ''; frags.forEach(f => f.remove()) }, [], i + 1.35)
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
  panels.forEach(p => p.querySelectorAll('.dd-fragment').forEach(el => el.remove()))
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('ddScrollArea') as HTMLElement; stage = document.getElementById('ddStage') as HTMLElement
  progressBar = document.getElementById('ddProgressBar'); navDots = document.getElementById('ddNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.dd-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="dd-page">
    <div id="ddProgressBar" class="dd-progress-bar"></div>
    <nav id="ddNavDots" class="dd-nav-dots"></nav>
    <div class="dd-page-indicator"><span class="dd-current">1</span><span class="dd-total"> / {{ totalPanels }}</span></div>
    <div id="ddScrollArea" class="dd-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="ddStage" class="dd-stage">
        <section class="dd-panel dd-panel-0"><div class="dd-content"><h2>01</h2></div></section>
        <section class="dd-panel dd-panel-1"><div class="dd-content"><h2>02</h2></div></section>
        <section class="dd-panel dd-panel-2"><div class="dd-content"><h2>03</h2></div></section>
        <section class="dd-panel dd-panel-3"><div class="dd-content"><h2>04</h2></div></section>
        <section class="dd-panel dd-panel-4"><div class="dd-content"><h2>05</h2></div></section>
        <section class="dd-panel dd-panel-5"><div class="dd-content"><h2>06</h2></div></section>
        <section class="dd-panel dd-panel-6"><div class="dd-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dd-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.dd-scroll-area { position: relative; }
.dd-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.dd-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,50,100,.08); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.dd-content { text-align: center; z-index: 2; h2 { font-size: 6rem; font-weight: 900; margin: 0; letter-spacing: 4px; opacity: .85; } }
.dd-panel-0 { background: linear-gradient(135deg, #1a0a0a, #3e1a1a); }
.dd-panel-1 { background: linear-gradient(135deg, #1a1a0a, #3e3e1a); }
.dd-panel-2 { background: linear-gradient(135deg, #0a1a0a, #1a3e1a); }
.dd-panel-3 { background: linear-gradient(135deg, #0a0a1a, #dcdcf0); }
.dd-panel-4 { background: linear-gradient(135deg, #1a0a1a, #3e1a3e); }
.dd-panel-5 { background: linear-gradient(135deg, #0a1a1a, #1a3e3e); }
.dd-panel-6 { background: linear-gradient(135deg, #1a1a1a, #3e3e3e); }
@media (max-width: 768px) { .dd-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.dd-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.dd-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,50,100,.2); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,50,100,.5); transform: scale(1.3); }
  &.dd-active { background: #ff3264; border-color: rgba(255,50,100,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(255,50,100,.5); }
}
.dd-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #ff3264, #ff6600, #ffcc00); box-shadow: 0 0 15px rgba(255,50,100,.5); }
.dd-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .dd-nav-dots { gap: 10px; } .dd-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
