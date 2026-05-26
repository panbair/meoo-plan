<script setup lang="ts">
/**
 * ==================== Transition Flip Book ====================
 * 翻书效果 —— 面板从右向左翻过（transform-origin: left center），
 * 如翻书页般揭开当前屏露出下一屏，滚动驱动。
 *
 * 核心机制：
 * - transform-origin: left center（以左侧为轴旋转）
 * - rotateY(0) → rotateY(-180deg)，面板绕左边缘翻出
 * - backface-visibility: hidden 控制正反面
 * - 下一屏从右侧放大弹入，补偿折叠形成的时间差
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
    dot.className = 'tfb-nav-dot' + (i === 0 ? ' tfb-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tfb-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tfb-active', i === index)
  })
  const el = document.querySelector('.tfb-page-indicator .tfb-current')
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
    transformOrigin: 'left center',
    backfaceVisibility: 'hidden'
  })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1, rotateY: 0 })

  // 添加书脊阴影效果（翻页时在当前页左侧投射阴影）
  const addShadow = (el: HTMLElement, progress: number) => {
    const alpha = Math.sin(progress * Math.PI) * 0.5
    el.style.boxShadow = `${alpha * 30}px 0 ${alpha * 20 + 10}px rgba(0,0,0,${alpha})`
  }

  for (let i = 0; i < segments; i++) {
    // 当前面板：以左边缘为轴，向左侧翻出（rotateY 0 → -180deg）
    const pageObj = { rotateY: 0, shadowProgress: 0 }
    tl.to(pageObj, {
      rotateY: -180,
      duration: 1.2,
      ease: 'power3.inOut',
      onUpdate: function(this: any) {
        panels[i].style.transform = `rotateY(${pageObj.rotateY}deg)`
        addShadow(panels[i], this.progress())
        // 翻过 90 度后隐藏（反面）
        if (Math.abs(pageObj.rotateY) > 90) {
          panels[i].style.opacity = '0'
        } else {
          panels[i].style.opacity = '1'
        }
      },
      onComplete: () => {
        panels[i].style.opacity = '0'
        panels[i].style.boxShadow = 'none'
      }
    }, i)

    // 翻到一半时（90°），面板不可见，下一屏已经可以开始显示
    // 下一屏以缩放+轻微Z轴旋转弹入
    tl.fromTo(panels[i + 1],
      { scale: 0.85, opacity: 0, rotateZ: -3 },
      { scale: 1, opacity: 1, rotateZ: 0, duration: 0.6, ease: 'back.out(1.2)' },
      i + 0.5
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
  panels.forEach(p => { p.style.boxShadow = 'none' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tfbScrollArea') as HTMLElement
  stage = document.getElementById('tfbStage') as HTMLElement
  progressBar = document.getElementById('tfbProgressBar')
  navDots = document.getElementById('tfbNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tfb-panel') as HTMLElement[]

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
  <div class="tfb-page">
    <div id="tfbProgressBar" class="tfb-progress-bar"></div>
    <nav id="tfbNavDots" class="tfb-nav-dots"></nav>
    <div class="tfb-page-indicator">
      <span class="tfb-current">1</span>
      <span class="tfb-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tfbScrollArea" class="tfb-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tfbStage" class="tfb-stage">
        <section class="tfb-panel tfb-panel-0"><div class="tfb-content"><h2>Panel 1</h2></div></section>
        <section class="tfb-panel tfb-panel-1"><div class="tfb-content"><h2>Panel 2</h2></div></section>
        <section class="tfb-panel tfb-panel-2"><div class="tfb-content"><h2>Panel 3</h2></div></section>
        <section class="tfb-panel tfb-panel-3"><div class="tfb-content"><h2>Panel 4</h2></div></section>
        <section class="tfb-panel tfb-panel-4"><div class="tfb-content"><h2>Panel 5</h2></div></section>
        <section class="tfb-panel tfb-panel-5"><div class="tfb-content"><h2>Panel 6</h2></div></section>
        <section class="tfb-panel tfb-panel-6"><div class="tfb-content"><h2>Panel 7</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tfb-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0f; color: #fff; perspective: 1200px; }
.tfb-scroll-area { position: relative; }
.tfb-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1200px; }
.tfb-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 0; }
}
.tfb-content { text-align: center; z-index: 0; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } }
.tfb-panel-0 { background: linear-gradient(135deg, #2d1b4e, #1a1a3e); }
.tfb-panel-1 { background: linear-gradient(135deg, #1b3a4b, #2c5f7c); }
.tfb-panel-2 { background: linear-gradient(135deg, #3d2c2c, #5c3d3d); }
.tfb-panel-3 { background: linear-gradient(135deg, #1a3a2a, #2d5a3f); }
.tfb-panel-4 { background: linear-gradient(135deg, #2a1a3a, #4a2d5e); }
.tfb-panel-5 { background: linear-gradient(135deg, #3a2a1a, #5e4a2d); }
.tfb-panel-6 { background: linear-gradient(135deg, #1a2a3a, #2d3d5e); }
@media (max-width: 768px) { .tfb-content { h2 { font-size: 2.2rem; } } }
</style>

<style lang="scss">
.tfb-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tfb-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.5); transform: scale(1.3); }
  &.tfb-active { background: #ffd700; border-color: rgba(255,215,0,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(255,215,0,.5); }
}
.tfb-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #ffd700, #ff6b6b, #a78bfa); box-shadow: 0 0 10px rgba(255,215,0,.4); }
.tfb-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .tfb-nav-dots { gap: 10px; } .tfb-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
