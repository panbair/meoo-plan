<script setup lang="ts">
/**
 * ==================== Transition Liquid ====================
 * 液体波纹 —— 使用 SVG filter（feTurbulence + feDisplacementMap）
 * 产生液体扭曲波纹，面板被"液体化"后流动消失，
 * 下一屏从波纹中浮现，滚动驱动。
 *
 * 核心机制：
 * - SVG feTurbulence 生成噪波纹理
 * - feDisplacementMap 用噪波扭曲面板
 * - 动画控制 baseFrequency 和 displacement scale 的值
 * - GSAP 驱动 SVG filter 属性变化
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
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tlq-nav-dot' + (i === 0 ? ' tlq-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tlq-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tlq-active', i === index)
  })
  const el = document.querySelector('.tlq-page-indicator .tlq-current')
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
    filter: 'none'
  })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1, scale: 1 })

  // 获取 SVG filter 元素，通过 JS 直接操作
  const turbEl = document.getElementById('tlqTurbulence') as SVGFETurbulenceElement | null
  const dispEl = document.getElementById('tlqDisplacement') as SVGFEDisplacementMapElement | null

  for (let i = 0; i < segments; i++) {
    // 阶段1：液体波纹增强（baseFrequency 从 0→0.04, scale 从 0→120）
    const liquidObj = { freq: 0, scale: 0, opacity: 1 }
    tl.to(liquidObj, {
      freq: 0.04,
      scale: 120,
      duration: 0.7,
      ease: 'power2.in',
      onUpdate: () => {
        if (turbEl) turbEl.setAttribute('baseFrequency', liquidObj.freq.toFixed(4))
        if (dispEl) dispEl.setAttribute('scale', liquidObj.scale.toFixed(0))
        panels[i].style.filter = `url(#tlqLiquidFilter)`
      }
    }, i)

    // 阶段2：波纹衰减（frequency 回退） + 面板缩小消失
    tl.to(liquidObj, {
      freq: 0.001,
      scale: 200,
      duration: 0.4,
      ease: 'power3.in',
      onUpdate: () => {
        if (turbEl) turbEl.setAttribute('baseFrequency', liquidObj.freq.toFixed(4))
        if (dispEl) dispEl.setAttribute('scale', liquidObj.scale.toFixed(0))
      }
    }, i + 0.7)

    // 面板淡出
    tl.to(panels[i], {
      scale: 1.3,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.in'
    }, i + 0.7)

    // 重置 filter + 清除波纹影响
    tl.call(() => {
      panels[i].style.filter = 'none'
      if (turbEl) turbEl.setAttribute('baseFrequency', '0')
      if (dispEl) dispEl.setAttribute('scale', '0')
    }, [], i + 1.15)

    // 下一屏：从波纹中浮现（带轻微滤镜）
    tl.fromTo(panels[i + 1],
      { filter: 'url(#tlqLiquidFilter)', scale: 0.7, opacity: 0 },
      {
        filter: 'none', scale: 1, opacity: 1,
        duration: 0.6, ease: 'back.out(1.4)',
        onStart: () => {
          if (turbEl) turbEl.setAttribute('baseFrequency', '0.015')
          if (dispEl) dispEl.setAttribute('scale', '60')
        },
        onComplete: () => {
          panels[i + 1].style.filter = 'none'
        }
      },
      i + 0.8
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
  panels.forEach(p => { p.style.filter = 'none' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tlqScrollArea') as HTMLElement
  stage = document.getElementById('tlqStage') as HTMLElement
  progressBar = document.getElementById('tlqProgressBar')
  navDots = document.getElementById('tlqNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tlq-panel') as HTMLElement[]

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
  <div class="tlq-page">
    <!-- 隐藏的 SVG filter 定义 -->
    <svg style="position:absolute;width:0;height:0;overflow:hidden;" aria-hidden="true">
      <defs>
        <filter id="tlqLiquidFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            id="tlqTurbulence"
            type="fractalNoise"
            baseFrequency="0"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            id="tlqDisplacement"
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur" />
        </filter>
      </defs>
    </svg>

    <div id="tlqProgressBar" class="tlq-progress-bar"></div>
    <nav id="tlqNavDots" class="tlq-nav-dots"></nav>
    <div class="tlq-page-indicator">
      <span class="tlq-current">1</span>
      <span class="tlq-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tlqScrollArea" class="tlq-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tlqStage" class="tlq-stage">
        <section class="tlq-panel tlq-panel-0"><div class="tlq-content"><h2>Panel 1</h2></div></section>
        <section class="tlq-panel tlq-panel-1"><div class="tlq-content"><h2>Panel 2</h2></div></section>
        <section class="tlq-panel tlq-panel-2"><div class="tlq-content"><h2>Panel 3</h2></div></section>
        <section class="tlq-panel tlq-panel-3"><div class="tlq-content"><h2>Panel 4</h2></div></section>
        <section class="tlq-panel tlq-panel-4"><div class="tlq-content"><h2>Panel 5</h2></div></section>
        <section class="tlq-panel tlq-panel-5"><div class="tlq-content"><h2>Panel 6</h2></div></section>
        <section class="tlq-panel tlq-panel-6"><div class="tlq-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tlq-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.tlq-scroll-area { position: relative; }
.tlq-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tlq-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  will-change: filter, transform;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.tlq-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tlq-panel-0 { background: linear-gradient(135deg, #0a2a3a, #1a4a6e); }
.tlq-panel-1 { background: linear-gradient(135deg, #0a3a2a, #1a6e4a); }
.tlq-panel-2 { background: linear-gradient(135deg, #1a1a3a, #3a3a6e); }
.tlq-panel-3 { background: linear-gradient(135deg, #2a1a3a, #4e2a6e); }
.tlq-panel-4 { background: linear-gradient(135deg, #3a2a1a, #6e4a2a); }
.tlq-panel-5 { background: linear-gradient(135deg, #1a3a3a, #3a6e6e); }
.tlq-panel-6 { background: linear-gradient(135deg, #0a1a3a, #1a3a6e); }
@media (max-width: 768px) { .tlq-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tlq-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tlq-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.5); transform: scale(1.3); }
  &.tlq-active { background: #f5f0f8; border-color: rgba(0,212,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(0,212,255,.5); }
}
.tlq-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #00d4ff, #00ff88, #00d4ff); background-size: 200% 100%; animation: tlqProgressFlow 2s ease-in-out infinite; box-shadow: 0 0 10px rgba(0,212,255,.4); }
@keyframes tlqProgressFlow { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.tlq-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .tlq-nav-dots { gap: 10px; } .tlq-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
