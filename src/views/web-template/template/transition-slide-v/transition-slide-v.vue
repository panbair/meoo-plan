<script setup lang="ts">
/**
 * ==================== Transition Slide-V ====================
 * 垂直滑动 —— translateY 上下滑动 + opacity 渐变，7 面版叠加布局，滚动驱动。
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
    dot.className = 'tsv-nav-dot' + (i === 0 ? ' tsv-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tsv-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tsv-active', i === index)
  })
  const el = document.querySelector('.tsv-page-indicator .tsv-current')
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
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  // 垂直滑动：当前面板上滑出，下一面板从下方滑入
  gsap.set(panels, { y: '100%', opacity: 0 })
  gsap.set(panels[0], { y: '0%', opacity: 1 })
  for (let i = 0; i < segments; i++) {
    tl.to(panels[i],     { y: '-100%', opacity: 0, duration: 1, ease: 'power2.inOut' }, i)
    tl.fromTo(panels[i + 1], { y: '100%' }, { y: '0%', opacity: 1, duration: 1, ease: 'power2.inOut' }, i)
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
}

function init() {
  vh = window.innerHeight

  scrollArea = document.getElementById('tsvScrollArea') as HTMLElement
  stage = document.getElementById('tsvStage') as HTMLElement
  progressBar = document.getElementById('tsvProgressBar')
  navDots = document.getElementById('tsvNavDots')
  if (!scrollArea || !stage) return

  panels = gsap.utils.toArray('.tsv-panel') as HTMLElement[]

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
  <div class="tsv-page">
    <div id="tsvProgressBar" class="tsv-progress-bar"></div>
    <nav id="tsvNavDots" class="tsv-nav-dots"></nav>
    <div class="tsv-page-indicator">
      <span class="tsv-current">1</span>
      <span class="tsv-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tsvScrollArea" class="tsv-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tsvStage" class="tsv-stage">
        <section class="tsv-panel tsv-panel-0">
          <div class="tsv-content"><div class="tsv-badge">INTRO</div><h2>第一屏</h2><p>垂直滑动 · 上下滑入</p></div>
        </section>
        <section class="tsv-panel tsv-panel-1">
          <div class="tsv-content"><div class="tsv-badge">FEATURES</div><h2>第二屏</h2><p>产品核心功能</p></div>
        </section>
        <section class="tsv-panel tsv-panel-2">
          <div class="tsv-content"><div class="tsv-badge">WORK</div><h2>第三屏</h2><p>作品案例展示</p></div>
        </section>
        <section class="tsv-panel tsv-panel-3">
          <div class="tsv-content"><div class="tsv-badge">TECH</div><h2>第四屏</h2><p>技术栈与架构</p></div>
        </section>
        <section class="tsv-panel tsv-panel-4">
          <div class="tsv-content"><div class="tsv-badge">TEAM</div><h2>第五屏</h2><p>团队成员</p></div>
        </section>
        <section class="tsv-panel tsv-panel-5">
          <div class="tsv-content"><div class="tsv-badge">STATS</div><h2>第六屏</h2><p>数据统计</p></div>
        </section>
        <section class="tsv-panel tsv-panel-6">
          <div class="tsv-content"><div class="tsv-badge">CONTACT</div><h2>第七屏</h2><p>联系方式</p></div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tsv-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0f; color: #fff; }
.tsv-scroll-area { position: relative; }
.tsv-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tsv-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; }
}
.tsv-content { text-align: center; z-index: 1; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } p { font-size: 1.2rem; opacity: .6; margin: 0; } }
.tsv-badge { display: inline-block; padding: 6px 20px; border: 1px solid rgba(255,255,255,.25); border-radius: 20px; font-size: .75rem; letter-spacing: 3px; margin-bottom: 24px; }
.tsv-panel-0 { background: linear-gradient(135deg, #0a0f24, #1a1a5e); }
.tsv-panel-1 { background: linear-gradient(135deg, #0f2027, #2c5364); }
.tsv-panel-2 { background: linear-gradient(135deg, #141e30, #243b55); }
.tsv-panel-3 { background: linear-gradient(135deg, #1a1a2e, #0f3460); }
.tsv-panel-4 { background: linear-gradient(135deg, #0d0d1a, #1a1a3e); }
.tsv-panel-5 { background: linear-gradient(135deg, #1a2980, #26d0ce); }
.tsv-panel-6 { background: linear-gradient(135deg, #0b1331, #1c2856); }
@media (max-width: 768px) {
  .tsv-content { h2 { font-size: 2.2rem; } p { font-size: 1rem; } }
}
</style>

<style lang="scss">
.tsv-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tsv-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.5); transform: scale(1.3); }
  &.tsv-active { background: #6c8cff; border-color: rgba(255,255,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(108,140,255,.5); }
}
.tsv-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6); box-shadow: 0 0 10px rgba(108,140,255,.4); }
.tsv-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .tsv-nav-dots { gap: 10px; } }
</style>
