<script setup lang="ts">
/**
 * ==================== Transition Fold Explode ====================
 * 折叠爆炸 —— 混合 fold(纵向折叠) + explode(碎片飞散)
 * 面板先纵向折叠成条（rotateX折叠），然后碎片化四散炸开。
 * 两阶段动画：Fold → Explode
 * CSS 3D 增强：preserve-3d 层级 + translateZ 碎片深度 + backface-visibility
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
const fragLists: HTMLElement[][] = []

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tfe-nav-dot' + (i === 0 ? ' tfe-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.tfe-nav-dot').forEach((dot, i) => dot.classList.toggle('tfe-active', i === index))
  const el = document.querySelector('.tfe-page-indicator .tfe-current')
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

function setupFragments() {
  fragLists.length = 0
  const clipPaths = [
    'polygon(0 0, 50% 50%, 0 100%)',
    'polygon(0 0, 100% 0, 50% 50%)',
    'polygon(100% 0, 100% 100%, 50% 50%)',
    'polygon(0 100%, 50% 50%, 100% 100%)'
  ]
  panels.forEach(panel => {
    let container = panel.querySelector('.tfe-frag-container') as HTMLElement
    if (!container) { container = document.createElement('div'); container.className = 'tfe-frag-container'; panel.appendChild(container) }
    container.innerHTML = ''
    const frags: HTMLElement[] = []
    for (let fi = 0; fi < 4; fi++) {
      const frag = document.createElement('div')
      frag.className = 'tfe-frag'
      frag.style.cssText = `position:absolute;inset:0;background:inherit;clip-path:${clipPaths[fi]};opacity:1;`
      container.appendChild(frag)
      frags.push(frag)
    }
    fragLists.push(frags)
  })
}

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh', transformOrigin: 'center center', backfaceVisibility: 'hidden' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1 })
  fragLists.forEach(f => gsap.set(f, { x: 0, y: 0, z: 0, rotation: 0, scale: 1, opacity: 1 }))

  for (let i = 0; i < segments; i++) {
    // 阶段1：纵向折叠（rotateX -90deg，以顶部为轴）+ translateZ 深度凹陷
    tl.to(panels[i], {
      rotateX: -85,
      scale: 0.7,
      z: -150,
      duration: 0.45,
      ease: 'power3.in',
      transformOrigin: 'top center'
    }, i)

    // 阶段2：折叠后切换到碎片模式：从折叠位置炸开
    tl.call(() => {
      panels[i].style.visibility = 'hidden'
      fragLists[i].forEach(f => { f.style.visibility = 'visible' })
    }, [], i + 0.45)

    const frags = fragLists[i]
    // 碎片 3D 飞出方向：translateZ 制造深度，远离/靠近相机
    const directions = [
      { x: '-55%', y: '-70%', z: 200, r: -35, rotX: 20 },   // 左上
      { x: '55%', y: '-70%', z: -150, r: 35, rotX: -25 },   // 右上
      { x: '55%', y: '70%', z: 180, r: 145, rotY: 30 },     // 右下
      { x: '-55%', y: '70%', z: -200, r: -145, rotY: -25 }  // 左下
    ]
    for (let fi = 0; fi < 4; fi++) {
      tl.to(frags[fi], {
        x: directions[fi].x, y: directions[fi].y,
        z: directions[fi].z,
        rotation: directions[fi].r,
        rotateX: directions[fi].rotX || 0,
        rotateY: directions[fi].rotY || 0,
        scale: 0.15, opacity: 0,
        duration: 0.55, ease: 'power4.in'
      }, i + 0.45)
    }

    // 当前面板淡出 + 重置
    tl.call(() => {
      panels[i].style.visibility = 'hidden'
      frags.forEach(f => { f.style.visibility = 'hidden' })
    }, [], i + 1.05)

    // 下一屏：从 3D 深度弹出（translateZ 从远到近 + rotateX 翻转恢复）
    tl.fromTo(panels[i + 1],
      { z: -300, rotateX: 15, scale: 0.3, opacity: 0, rotateZ: -15, filter: 'brightness(2) blur(4px)' },
      { z: 0, rotateX: 0, scale: 1, opacity: 1, rotateZ: 0, filter: 'brightness(1) blur(0px)', duration: 0.7, ease: 'back.out(1.5)' },
      i + 0.6
    )
  }
  return tl
}

function startTimeline() {
  setupFragments()
  fragLists.forEach(f => f.forEach(fr => { fr.style.visibility = 'hidden' }))
  const tl = buildTimeline(); mainTL = tl
  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.8,
    animation: tl,
    onUpdate: (self) => { const idx = Math.round(self.progress * (totalPanels - 1)); if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) } }
  })
}
function killCurrent() { ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() }); mainTL?.kill(); mainTL = null; gsap.set(panels, { clearProps: 'all' }); fragLists.forEach(f => gsap.set(f, { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0, scale: 1, opacity: 1, visibility: 'visible' })) }
function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tfeScrollArea') as HTMLElement; stage = document.getElementById('tfeStage') as HTMLElement
  progressBar = document.getElementById('tfeProgressBar'); navDots = document.getElementById('tfeNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tfe-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}
function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="tfe-page">
    <div id="tfeProgressBar" class="tfe-progress-bar"></div>
    <nav id="tfeNavDots" class="tfe-nav-dots"></nav>
    <div class="tfe-page-indicator"><span class="tfe-current">1</span><span class="tfe-total"> / {{ totalPanels }}</span></div>
    <div id="tfeScrollArea" class="tfe-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tfeStage" class="tfe-stage">
        <section class="tfe-panel tfe-panel-0"><div class="tfe-content"><h2>Panel 1</h2></div></section>
        <section class="tfe-panel tfe-panel-1"><div class="tfe-content"><h2>Panel 2</h2></div></section>
        <section class="tfe-panel tfe-panel-2"><div class="tfe-content"><h2>Panel 3</h2></div></section>
        <section class="tfe-panel tfe-panel-3"><div class="tfe-content"><h2>Panel 4</h2></div></section>
        <section class="tfe-panel tfe-panel-4"><div class="tfe-content"><h2>Panel 5</h2></div></section>
        <section class="tfe-panel tfe-panel-5"><div class="tfe-content"><h2>Panel 6</h2></div></section>
        <section class="tfe-panel tfe-panel-6"><div class="tfe-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tfe-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #080814; color: #fff; perspective: 1500px; }
.tfe-scroll-area { position: relative; }
.tfe-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1500px; transform-style: preserve-3d; }
.tfe-panel { position: absolute; inset: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; backface-visibility: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.tfe-frag-container { position: absolute; inset: 0; z-index: 0; }
.tfe-content { text-align: center; z-index: 2; position: relative; h2 { font-size: 3.5rem; font-weight: 900; margin: 0; } }
.tfe-panel-0 { background: linear-gradient(135deg, #2d1b4e, #1a1a3e); }
.tfe-panel-1 { background: linear-gradient(135deg, #1b3a4b, #2c5f7c); }
.tfe-panel-2 { background: linear-gradient(135deg, #3d2c2c, #5c3d3d); }
.tfe-panel-3 { background: linear-gradient(135deg, #1a3a2a, #2d5a3f); }
.tfe-panel-4 { background: linear-gradient(135deg, #2a1a3a, #4a2d5e); }
.tfe-panel-5 { background: linear-gradient(135deg, #3a2a1a, #5e4a2d); }
.tfe-panel-6 { background: linear-gradient(135deg, #1a2a3a, #2d3d5e); }
@media (max-width: 768px) { .tfe-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tfe-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tfe-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.2); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.5); transform: scale(1.3); }
  &.tfe-active { background: #e74c3c; border-color: rgba(231,76,60,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(231,76,60,.5); }
}
.tfe-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #e74c3c, #f39c12, #e74c3c); background-size: 200% 100%; animation: tfePulse 2s ease-in-out infinite; box-shadow: 0 0 10px rgba(231,76,60,.4); }
@keyframes tfePulse { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
.tfe-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .tfe-nav-dots { gap: 10px; } .tfe-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
