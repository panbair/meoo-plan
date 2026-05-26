<script setup lang="ts">
/**
 * ==================== Transition Explode ====================
 * 爆炸散开 —— 面板切割为 4 个三角形碎片（对角线切割），
 * 从中心向外爆散四角，露出下一屏，滚动驱动。
 *
 * 核心机制：
 * - 4 个 clip-path polygon 三角形碎片
 * - top-left: polygon(0 0, 50% 50%, 0 100%)
 * - top-right: polygon(50% 50%, 100% 0, 100% 100%)
 * - bottom-left: polygon(0 0, 50% 50%, 0 100%)
 * - bottom-right: polygon(100% 0, 50% 50%, 100% 100%)
 * - 分别向四角方向飞出（translate）+ 旋转 + 缩小
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

// 生成碎片 DOM（每个面板套上 4 个碎片）
const fragLists: HTMLElement[][] = [] // [panelIndex][fragIndex]

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tex-nav-dot' + (i === 0 ? ' tex-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tex-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tex-active', i === index)
  })
  const el = document.querySelector('.tex-page-indicator .tex-current')
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
    ArrowDown: 1, ArrowRight: 1,
    ArrowUp: -1, ArrowLeft: -1,
    Home: 0, End: totalPanels - 1
  }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    e.key === 'Home' || e.key === 'End'
      ? goToPanel(keyMap[e.key])
      : goToPanel(currentIndex + keyMap[e.key])
  }
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToPanel(currentIndex + (diff > 0 ? 1 : -1))
}

function setupFragments() {
  fragLists.length = 0
  panels.forEach((panel, pi) => {
    const frags: HTMLElement[] = []
    // 检查是否已有碎片容器
    let container = panel.querySelector('.tex-frag-container') as HTMLElement
    if (!container) {
      container = document.createElement('div')
      container.className = 'tex-frag-container'
      container.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;'
      panel.appendChild(container)
    }
    container.innerHTML = ''
    const clipPaths = [
      'polygon(0 0, 50% 50%, 0 100%)',
      'polygon(0 0, 100% 0, 50% 50%)',
      'polygon(100% 0, 100% 100%, 50% 50%)',
      'polygon(0 100%, 50% 50%, 100% 100%)'
    ]
    const origins = [
      'top left', 'top right', 'bottom right', 'bottom left'
    ]
    for (let fi = 0; fi < 4; fi++) {
      const frag = document.createElement('div')
      frag.className = 'tex-frag'
      frag.style.cssText = `position:absolute;inset:0;background:inherit;clip-path:${clipPaths[fi]};transform-origin:${origins[fi]};`
      container.appendChild(frag)
      frags.push(frag)
    }
    fragLists.push(frags)
  })
}

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, {
    position: 'absolute', width: '100vw', height: '100vh'
  })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1 })
  // 重置所有碎片
  fragLists.forEach(frags => gsap.set(frags, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 }))

  for (let i = 0; i < segments; i++) {
    const frags = fragLists[i]
    if (!frags || frags.length < 4) continue

    // 四个碎片向四角飞散 + 旋转 + 缩小
    const directions = [
      { x: '-60%', y: '-60%', r: -45 },   // 左上
      { x: '60%', y: '-60%', r: 45 },     // 右上
      { x: '60%', y: '60%', r: 135 },     // 右下
      { x: '-60%', y: '60%', r: -135 }    // 左下
    ]

    for (let fi = 0; fi < 4; fi++) {
      tl.to(frags[fi], {
        x: directions[fi].x,
        y: directions[fi].y,
        rotation: directions[fi].r,
        scale: 0.2,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.in'
      }, i)
    }

    // 当前面板淡出
    tl.to(panels[i], { opacity: 0, duration: 0.3, ease: 'power2.in' }, i + 0.6)

    // 下一屏：从碎片聚合恢复（从缩小状态弹入）
    tl.fromTo(panels[i + 1],
      { scale: 0.5, opacity: 0, filter: 'brightness(3)' },
      { scale: 1, opacity: 1, filter: 'brightness(1)', duration: 0.7, ease: 'back.out(1.5)' },
      i + 0.55
    )
  }

  return tl
}

function startTimeline() {
  setupFragments()
  const tl = buildTimeline()
  mainTL = tl

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.8,
    animation: tl,
    onUpdate: (self) => {
      const idx = Math.round(self.progress * (totalPanels - 1))
      if (idx !== currentIndex) {
        currentIndex = idx
        updateUI(idx)
      }
    }
  })
}

function killCurrent() {
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === scrollArea) st.kill()
  })
  mainTL?.kill()
  mainTL = null
  gsap.set(panels, { clearProps: 'all' })
  fragLists.forEach(frags => gsap.set(frags, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 }))
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('texScrollArea') as HTMLElement
  stage = document.getElementById('texStage') as HTMLElement
  progressBar = document.getElementById('texProgressBar')
  navDots = document.getElementById('texNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tex-panel') as HTMLElement[]

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  createNavDots()
  updateUI(0)
  startTimeline()
}

function destroy() {
  killCurrent()
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="tex-page">
    <div id="texProgressBar" class="tex-progress-bar"></div>
    <nav id="texNavDots" class="tex-nav-dots"></nav>
    <div class="tex-page-indicator">
      <span class="tex-current">1</span>
      <span class="tex-total"> / {{ totalPanels }}</span>
    </div>

    <div id="texScrollArea" class="tex-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="texStage" class="tex-stage">
        <section class="tex-panel tex-panel-0"><div class="tex-content"><h2>Panel 1</h2></div></section>
        <section class="tex-panel tex-panel-1"><div class="tex-content"><h2>Panel 2</h2></div></section>
        <section class="tex-panel tex-panel-2"><div class="tex-content"><h2>Panel 3</h2></div></section>
        <section class="tex-panel tex-panel-3"><div class="tex-content"><h2>Panel 4</h2></div></section>
        <section class="tex-panel tex-panel-4"><div class="tex-content"><h2>Panel 5</h2></div></section>
        <section class="tex-panel tex-panel-5"><div class="tex-content"><h2>Panel 6</h2></div></section>
        <section class="tex-panel tex-panel-6"><div class="tex-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tex-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0f; color: #fff; }
.tex-scroll-area { position: relative; }
.tex-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tex-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.tex-content { text-align: center; z-index: 2; position: relative; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tex-frag-container { z-index: 0 !important; }
.tex-panel-0 { background: linear-gradient(135deg, #1a0a2e, #16213e); }
.tex-panel-1 { background: linear-gradient(135deg, #0f2027, #2c5364); }
.tex-panel-2 { background: linear-gradient(135deg, #141e30, #243b55); }
.tex-panel-3 { background: linear-gradient(135deg, #1a1a2e, #0f3460); }
.tex-panel-4 { background: linear-gradient(135deg, #0d0d1a, #1a1a3e); }
.tex-panel-5 { background: linear-gradient(135deg, #3a1c71, #d76d77); }
.tex-panel-6 { background: linear-gradient(135deg, #0b1331, #1c2856); }
@media (max-width: 768px) { .tex-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tex-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tex-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.5); transform: scale(1.3); }
  &.tex-active { background: #ff6d00; border-color: rgba(255,109,0,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(255,109,0,.5); }
}
.tex-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #ff6d00, #ff9100, #ff3d00); box-shadow: 0 0 10px rgba(255,109,0,.4); }
.tex-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .tex-nav-dots { gap: 10px; } .tex-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
