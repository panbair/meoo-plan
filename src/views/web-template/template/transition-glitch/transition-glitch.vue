<script setup lang="ts">
/**
 * ==================== Transition Glitch ====================
 * 数字故障 —— RGB色差分离 + clip位移错位 + 抖动，
 * 模拟显示器/数字信号故障效果，滚动驱动。
 *
 * 核心机制：
 * 1. 文本伪元素 RGB 分离：红色→左偏移，蓝色→右偏移
 * 2. clip-path 切片随机位移，营造扫描线撕裂感
 * 3. keyframes 抖动震动效果
 * 4. 过渡时信号噪声（random flicker）
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
let glitchOverlays: HTMLElement[] = [] // RGB 叠加层
let mainTL: gsap.core.Timeline | null = null

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tgl-nav-dot' + (i === 0 ? ' tgl-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tgl-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tgl-active', i === index)
  })
  const el = document.querySelector('.tgl-page-indicator .tgl-current')
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

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, {
    position: 'absolute', width: '100vw', height: '100vh',
    clipPath: 'inset(0 0 0 0)'
  })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1 })
  // 初始隐藏所有 glitch overlay
  glitchOverlays.forEach(o => { o.style.opacity = '0' })

  for (let i = 0; i < segments; i++) {
    // 阶段1：RGB撕裂出现 + 面板抖动
    tl.call(() => {
      glitchOverlays[i].style.opacity = '1'
      panels[i].classList.add('tgl-glitching')
    }, [], i)

    // 阶段2：clip-path 随机切片位移（模拟扫描线撕裂）
    for (let s = 0; s < 3; s++) {
      const offsetPct = 5 + s * 25
      tl.call(() => {
        panels[i].style.clipPath = `inset(${offsetPct}% 0 ${95 - offsetPct}% 0)`
        panels[i].style.transform = `translateX(${(s % 2 === 0 ? 1 : -1) * 15}px)`
      }, [], i + 0.1 + s * 0.12)
    }

    // 阶段3：完全故障化 + 面板缩小消失
    tl.to(panels[i], {
      opacity: 0,
      scale: 1.1,
      filter: 'contrast(3) brightness(2) saturate(0)',
      duration: 0.4,
      ease: 'power3.in',
      onStart: () => { panels[i].style.clipPath = 'inset(0 0 0 0)' }
    }, i + 0.5)

    // 同时隐藏 glitch overlay
    tl.to(glitchOverlays[i], {
      opacity: 0,
      duration: 0.4
    }, i + 0.5)

    // 阶段4：故障信号切换到下一屏（下一屏以 noise 闪入）
    tl.fromTo(panels[i + 1],
      { filter: 'contrast(1.5) brightness(1.5) hue-rotate(90deg)', scale: 1.06, opacity: 0 },
      {
        filter: 'contrast(1) brightness(1) hue-rotate(0deg)', scale: 1, opacity: 1,
        duration: 0.5, ease: 'power2.out',
        onStart: () => { panels[i + 1].classList.add('tgl-glitching') },
        onComplete: () => { panels[i + 1].classList.remove('tgl-glitching') }
      },
      i + 0.75
    )
  }

  return tl
}

function startTimeline() {
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
  panels.forEach(p => p.classList.remove('tgl-glitching'))
  glitchOverlays.forEach(o => { o.style.opacity = '0' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tglScrollArea') as HTMLElement
  stage = document.getElementById('tglStage') as HTMLElement
  progressBar = document.getElementById('tglProgressBar')
  navDots = document.getElementById('tglNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tgl-panel') as HTMLElement[]
  glitchOverlays = gsap.utils.toArray('.tgl-overlay') as HTMLElement[]

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
  <div class="tgl-page">
    <div id="tglProgressBar" class="tgl-progress-bar"></div>
    <nav id="tglNavDots" class="tgl-nav-dots"></nav>
    <div class="tgl-page-indicator">
      <span class="tgl-current">1</span>
      <span class="tgl-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tglScrollArea" class="tgl-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tglStage" class="tgl-stage">
        <section class="tgl-panel tgl-panel-0">
          <div class="tgl-overlay tgl-overlay-r tgl-overlay-0"></div>
          <div class="tgl-overlay tgl-overlay-b tgl-overlay-0b"></div>
          <div class="tgl-content"><h2>Panel 1</h2></div>
        </section>
        <section class="tgl-panel tgl-panel-1">
          <div class="tgl-overlay tgl-overlay-r tgl-overlay-1"></div>
          <div class="tgl-overlay tgl-overlay-b tgl-overlay-1b"></div>
          <div class="tgl-content"><h2>Panel 2</h2></div>
        </section>
        <section class="tgl-panel tgl-panel-2">
          <div class="tgl-overlay tgl-overlay-r tgl-overlay-2"></div>
          <div class="tgl-overlay tgl-overlay-b tgl-overlay-2b"></div>
          <div class="tgl-content"><h2>Panel 3</h2></div>
        </section>
        <section class="tgl-panel tgl-panel-3">
          <div class="tgl-overlay tgl-overlay-r tgl-overlay-3"></div>
          <div class="tgl-overlay tgl-overlay-b tgl-overlay-3b"></div>
          <div class="tgl-content"><h2>Panel 4</h2></div>
        </section>
        <section class="tgl-panel tgl-panel-4">
          <div class="tgl-overlay tgl-overlay-r tgl-overlay-4"></div>
          <div class="tgl-overlay tgl-overlay-b tgl-overlay-4b"></div>
          <div class="tgl-content"><h2>Panel 5</h2></div>
        </section>
        <section class="tgl-panel tgl-panel-5">
          <div class="tgl-overlay tgl-overlay-r tgl-overlay-5"></div>
          <div class="tgl-overlay tgl-overlay-b tgl-overlay-5b"></div>
          <div class="tgl-content"><h2>Panel 6</h2></div>
        </section>
        <section class="tgl-panel tgl-panel-6">
          <div class="tgl-overlay tgl-overlay-r tgl-overlay-6"></div>
          <div class="tgl-overlay tgl-overlay-b tgl-overlay-6b"></div>
          <div class="tgl-content"><h2>Panel 7</h2></div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Glitch 抖动 keyframes
@keyframes tglShake {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-4px, 2px); }
  20% { transform: translate(3px, -3px); }
  30% { transform: translate(-5px, 1px); }
  40% { transform: translate(2px, -2px); }
  50% { transform: translate(-3px, 4px); }
  60% { transform: translate(1px, -1px); }
  70% { transform: translate(-6px, 3px); }
  80% { transform: translate(4px, -4px); }
  90% { transform: translate(-2px, 2px); }
}

.tgl-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0f; color: #fff; }
.tgl-scroll-area { position: relative; }
.tgl-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tgl-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 0; }
  &.tgl-glitching {
    animation: tglShake 0.15s infinite;
  }
}
// RGB 分离叠加层
.tgl-overlay {
  position: absolute; inset: 0; width: 100%; height: 100%;
  mix-blend-mode: screen; pointer-events: none; z-index: 1; opacity: 0;
  transition: opacity 0.1s;
  &::after {
    content: 'Panel';
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 3.5rem; font-weight: 900;
  }
}
// 红色通道偏移
.tgl-overlay-r {
  background: rgba(255, 0, 0, 0.15);
  transform: translateX(-8px);
  clip-path: polygon(0 0, 100% 10%, 100% 30%, 0 20%, 0 50%, 100% 60%, 100% 80%, 0 70%);
}
// 蓝色通道偏移
.tgl-overlay-b {
  background: rgba(0, 100, 255, 0.15);
  transform: translateX(8px);
  clip-path: polygon(0 10%, 100% 0, 100% 20%, 0 30%, 0 60%, 100% 50%, 100% 70%, 0 80%);
}

.tgl-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tgl-panel-0 { background: linear-gradient(135deg, #0a0a0a, #1a1a1a); }
.tgl-panel-1 { background: linear-gradient(135deg, #0d0d0d, #2a2a2a); }
.tgl-panel-2 { background: linear-gradient(135deg, #050510, #151530); }
.tgl-panel-3 { background: linear-gradient(135deg, #0a0a0f, #0f0f23); }
.tgl-panel-4 { background: linear-gradient(135deg, #080814, #181830); }
.tgl-panel-5 { background: linear-gradient(135deg, #101018, #202040); }
.tgl-panel-6 { background: linear-gradient(135deg, #050510, #151528); }
@media (max-width: 768px) { .tgl-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tgl-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tgl-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.5); transform: scale(1.3); }
  &.tgl-active { background: #ff0044; border-color: rgba(255,0,68,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(255,0,68,.5); }
}
.tgl-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #ff0044, #0ff, #ff0044); background-size: 200% 100%; animation: tglProgressShine 2s linear infinite; box-shadow: 0 0 10px rgba(255,0,68,.4); }
@keyframes tglProgressShine { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
.tgl-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .tgl-nav-dots { gap: 10px; } .tgl-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
