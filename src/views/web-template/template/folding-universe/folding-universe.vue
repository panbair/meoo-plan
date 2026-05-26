<script setup lang="ts">
/**
 * ==================== Folding Universe ====================
 * 折叠宇宙 —— 混合 fold(纵向折叠) + fold-explode(折叠爆炸) + cube(立体旋转) + shutter-wind(百叶风吹)
 * 纸艺宇宙：面板折叠消失 → 爆炸碎片飞出 → 立体方块旋转 → 百叶窗吹开下一屏
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
const shredCount = 10
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
    dot.className = 'fu-nav-dot' + (i === 0 ? ' fu-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.fu-nav-dot').forEach((dot, i) => dot.classList.toggle('fu-active', i === index))
  const el = document.querySelector('.fu-page-indicator .fu-current')
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

function buildShredElements(panel: HTMLElement): HTMLElement[] {
  // 清除旧的碎片
  const old = panel.querySelectorAll('.fu-shred')
  old.forEach(el => el.remove())
  const shreds: HTMLElement[] = []
  const w = panel.clientWidth || window.innerWidth
  const h = panel.clientHeight || window.innerHeight
  for (let s = 0; s < shredCount; s++) {
    const shred = document.createElement('div')
    shred.className = 'fu-shred'
    const sw = w / shredCount
    shred.style.cssText = `position:absolute;left:${s * sw}px;top:0;width:${sw}px;height:${h}px;overflow:hidden;`
    const inner = document.createElement('div')
    inner.style.cssText = `position:absolute;inset:0;width:${w}px;height:${h}px;background:inherit;transform:translateX(-${s * sw}px);`
    shred.appendChild(inner)
    panel.appendChild(shred)
    shreds.push(shred)
  }
  return shreds
}

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1, scale: 1, scaleY: 1, rotateY: 0, rotateX: 0 })

  for (let i = 0; i < segments; i++) {
    // 阶段1：纵向折叠（fold）- 当前面板 scaleY→0
    tl.to(panels[i], { scaleY: 0, transformOrigin: 'center center', duration: 0.5, ease: 'power2.in' }, i)
    // 阶段2：折叠爆炸（fold-explode）- 碎片向四周炸开
    const shreds = buildShredElements(panels[i])
    tl.set(shreds, { opacity: 1, scale: 1, y: 0, rotateZ: 0 })
    for (let s = 0; s < shreds.length; s++) {
      const angle = (s / shreds.length) * Math.PI * 2 + Math.random() * 0.5
      const dist = 200 + Math.random() * 400
      tl.to(shreds[s], {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 300,
        rotateZ: (Math.random() - 0.5) * 720,
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, i + 0.4 + s * 0.04)
    }
    // 面板淡出
    tl.to(panels[i], { opacity: 0, duration: 0.2 }, i + 0.8)
    // 阶段3：立体旋转（cube）- 下一屏 rotateY 翻入
    tl.fromTo(panels[i + 1],
      { rotateY: -90, opacity: 0, scale: 0.8 },
      { rotateY: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' },
      i + 0.7
    )
    // 阶段4：百叶风吹（shutter-wind）- 下一屏 clip-path 条带揭开
    tl.fromTo(panels[i + 1],
      { clipPath: 'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 15% 0%, 15% 100%, 15% 100%, 15% 0%, 30% 0%, 30% 100%, 30% 100%, 30% 0%, 45% 0%, 45% 100%, 45% 100%, 45% 0%, 60% 0%, 60% 100%, 60% 100%, 60% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 90% 0%, 90% 100%, 90% 100%, 90% 0%)' },
      { clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 0%)', duration: 0.4, ease: 'power2.in' },
      i + 0.95
    )
    tl.call(() => { panels[i + 1].style.clipPath = 'none'; shreds.forEach(s => s.remove()) }, [], i + 1.4)
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
  panels.forEach(p => p.querySelectorAll('.fu-shred').forEach(el => el.remove()))
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('fuScrollArea') as HTMLElement; stage = document.getElementById('fuStage') as HTMLElement
  progressBar = document.getElementById('fuProgressBar'); navDots = document.getElementById('fuNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.fu-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="fu-page">
    <div id="fuProgressBar" class="fu-progress-bar"></div>
    <nav id="fuNavDots" class="fu-nav-dots"></nav>
    <div class="fu-page-indicator"><span class="fu-current">1</span><span class="fu-total"> / {{ totalPanels }}</span></div>
    <div id="fuScrollArea" class="fu-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="fuStage" class="fu-stage">
        <section class="fu-panel fu-panel-0"><div class="fu-content"><h2>01</h2></div></section>
        <section class="fu-panel fu-panel-1"><div class="fu-content"><h2>02</h2></div></section>
        <section class="fu-panel fu-panel-2"><div class="fu-content"><h2>03</h2></div></section>
        <section class="fu-panel fu-panel-3"><div class="fu-content"><h2>04</h2></div></section>
        <section class="fu-panel fu-panel-4"><div class="fu-content"><h2>05</h2></div></section>
        <section class="fu-panel fu-panel-5"><div class="fu-content"><h2>06</h2></div></section>
        <section class="fu-panel fu-panel-6"><div class="fu-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fu-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #0a0a12; color: #fff; }
.fu-scroll-area { position: relative; }
.fu-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1800px; }
.fu-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; }
}
.fu-content { text-align: center; z-index: 2; h2 { font-size: 6rem; font-weight: 900; margin: 0; letter-spacing: 4px; opacity: .85; } }
.fu-panel-0 { background: linear-gradient(135deg, #1a1a2e, #16213e); }
.fu-panel-1 { background: linear-gradient(135deg, #0f3460, #1a1a2e); }
.fu-panel-2 { background: linear-gradient(135deg, #16213e, #0f3460); }
.fu-panel-3 { background: linear-gradient(135deg, #1a1a2e, #533483); }
.fu-panel-4 { background: linear-gradient(135deg, #16213e, #1a1a2e); }
.fu-panel-5 { background: linear-gradient(135deg, #0f3460, #533483); }
.fu-panel-6 { background: linear-gradient(135deg, #533483, #16213e); }
@media (max-width: 768px) { .fu-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.fu-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.fu-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(200,180,255,.2); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(200,180,255,.5); transform: scale(1.3); }
  &.fu-active { background: #c8b4ff; border-color: rgba(200,180,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(200,180,255,.5); }
}
.fu-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #c8b4ff, #a78bfa, #7c3aed); box-shadow: 0 0 10px rgba(200,180,255,.4); }
.fu-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .fu-nav-dots { gap: 10px; } .fu-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
