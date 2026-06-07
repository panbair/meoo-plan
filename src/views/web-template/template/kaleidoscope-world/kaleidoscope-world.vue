<script setup lang="ts">
/**
 * ==================== Kaleidoscope World ====================
 * 万花筒 —— 混合 mirror(镜像翻面) + spin(2D旋转) + swirl(涡旋扩散) + hue-shift(色相轮转)
 * 对称的万花筒效果：镜像对称底面 → 旋转棱镜 → 涡旋扩散 → 色相持续流转。
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
    dot.className = 'kw-nav-dot' + (i === 0 ? ' kw-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.kw-nav-dot').forEach((dot, i) => dot.classList.toggle('kw-active', i === index))
  const el = document.querySelector('.kw-page-indicator .kw-current')
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

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1, rotateZ: 0, scale: 1, filter: 'none' })

  for (let i = 0; i < segments; i++) {
    // 阶段1：镜像翻面+旋转（mirror + spin）- 面板旋转180度同时缩小消失
    tl.to(panels[i], {
      rotateZ: 360, rotateY: 180,
      scale: 0.1, opacity: 0,
      filter: 'hue-rotate(180deg) saturate(2)',
      duration: 0.55, ease: 'power3.in'
    }, i)
    // 色相极端旋转
    tl.to(panels[i], { filter: 'hue-rotate(360deg) brightness(3)', duration: 0.2 }, i + 0.4)
    // 阶段2：涡旋扩散（swirl）+ 色相轮转（hue-shift）- 下一屏涡旋展开
    tl.fromTo(panels[i + 1],
      {
        rotateZ: -180, rotateY: -90, scale: 0.15, opacity: 0,
        filter: 'hue-rotate(-120deg) saturate(3) brightness(2)',
        clipPath: 'circle(0% at 50% 50%)'
      },
      {
        rotateZ: 0, rotateY: 0, scale: 1, opacity: 0.6,
        filter: 'hue-rotate(0deg) saturate(2) brightness(1.5)',
        clipPath: 'circle(45% at 50% 50%)',
        duration: 0.35, ease: 'power2.in'
      },
      i + 0.5
    )
    // 阶段3：弹性展开定型（elastic）
    tl.to(panels[i + 1], {
      clipPath: 'circle(100% at 50% 50%)',
      filter: 'hue-rotate(0deg) saturate(1) brightness(1)',
      opacity: 1, scale: 1,
      duration: 0.5, ease: 'elastic.out(1, 0.6)'
    }, i + 0.8)
    // 清理
    tl.call(() => { panels[i + 1].style.clipPath = 'none'; panels[i + 1].style.filter = 'none' }, [], i + 1.35)
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
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('kwScrollArea') as HTMLElement; stage = document.getElementById('kwStage') as HTMLElement
  progressBar = document.getElementById('kwProgressBar'); navDots = document.getElementById('kwNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.kw-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="kw-page">
    <div id="kwProgressBar" class="kw-progress-bar"></div>
    <nav id="kwNavDots" class="kw-nav-dots"></nav>
    <div class="kw-page-indicator"><span class="kw-current">1</span><span class="kw-total"> / {{ totalPanels }}</span></div>
    <div id="kwScrollArea" class="kw-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="kwStage" class="kw-stage">
        <section class="kw-panel kw-panel-0"><div class="kw-content"><h2>01</h2></div></section>
        <section class="kw-panel kw-panel-1"><div class="kw-content"><h2>02</h2></div></section>
        <section class="kw-panel kw-panel-2"><div class="kw-content"><h2>03</h2></div></section>
        <section class="kw-panel kw-panel-3"><div class="kw-content"><h2>04</h2></div></section>
        <section class="kw-panel kw-panel-4"><div class="kw-content"><h2>05</h2></div></section>
        <section class="kw-panel kw-panel-5"><div class="kw-content"><h2>06</h2></div></section>
        <section class="kw-panel kw-panel-6"><div class="kw-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.kw-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.kw-scroll-area { position: relative; }
.kw-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 2000px; }
.kw-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.kw-content { text-align: center; z-index: 2; h2 { font-size: 6rem; font-weight: 900; margin: 0; letter-spacing: 4px; opacity: .85; } }
.kw-panel-0 { background: linear-gradient(135deg, #ff0066, #330066); }
.kw-panel-1 { background: linear-gradient(135deg, #00ff66, #003366); }
.kw-panel-2 { background: linear-gradient(135deg, #0066ff, #660033); }
.kw-panel-3 { background: linear-gradient(135deg, #ff6600, #006633); }
.kw-panel-4 { background: linear-gradient(135deg, #6600ff, #336600); }
.kw-panel-5 { background: linear-gradient(135deg, #ff00cc, #003300); }
.kw-panel-6 { background: linear-gradient(135deg, #00ccff, #330033); }
@media (max-width: 768px) { .kw-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.kw-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.kw-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,100,255,.2); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,100,255,.5); transform: scale(1.3); }
  &.kw-active { background: #ff64ff; border-color: rgba(255,100,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(255,100,255,.6); }
}
.kw-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #ff0066, #00ff66, #0066ff, #ff6600, #ff00cc, #00ccff); background-size: 200% 100%; animation: kwShift 2s linear infinite; box-shadow: 0 0 15px rgba(255,100,255,.5); }
@keyframes kwShift { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
.kw-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,100,255,.2); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .kw-nav-dots { gap: 10px; } .kw-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
