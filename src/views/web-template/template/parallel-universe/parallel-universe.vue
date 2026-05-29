<script setup lang="ts">
/**
 * ==================== Parallel Universe ====================
 * 平行宇宙 —— fake-horizontal-scroll 增强版
 * 每两个面板成一对"平行世界"：面板1和2型态相同但配色互为补色、
 * 面板3和4互为亮度反转... 横移穿梭于平行现实之间
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const totalPanels = 8 // 4对平行世界
let vw = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

// 4对平行世界的配色方案 (一对两个，互补色)
const pairColors = [
  ['hsl(200, 60%, 18%)', 'hsl(20, 60%, 18%)'],   // 蓝↔橙
  ['hsl(140, 60%, 18%)', 'hsl(320, 60%, 18%)'],  // 绿↔粉
  ['hsl(60, 60%, 18%)', 'hsl(260, 60%, 18%)'],   // 黄↔紫
  ['hsl(0, 60%, 18%)', 'hsl(180, 60%, 18%)'],    // 红↔青
]

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button'); dot.className = 'pu-nav-dot' + (i === 0 ? ' pu-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.pu-nav-dot').forEach((d, i) => d.classList.toggle('pu-active', i === index))
  // 成对高亮（当前对的另一个也亮暗显示）
  const pairIdx = Math.floor(index / 2)
  document.querySelectorAll('.pu-nav-dot').forEach((d, i) => {
    if (Math.floor(i / 2) === pairIdx && i !== index) d.classList.add('pu-pair')
    else d.classList.remove('pu-pair')
  })
  const el = document.querySelector('.pu-page-indicator .pu-current'); if (el) el.textContent = String(index + 1)
  const pairEl = document.querySelector('.pu-pair-label')
  if (pairEl) pairEl.textContent = 'P' + (pairIdx + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}
function goToPanel(index: number) { index = Math.max(0, Math.min(index, totalPanels - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { const m: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }; if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) } }
let tsY = 0; function onTouchStart(e: TouchEvent) { tsY = e.touches[0].clientY }; function onTouchEnd(e: TouchEvent) { const d = tsY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function init() {
  vw = window.innerWidth
  scrollArea = document.getElementById('puScrollArea') as HTMLElement
  track = document.getElementById('puTrack') as HTMLElement
  progressBar = document.getElementById('puProgressBar')
  navDots = document.getElementById('puNavDots')
  if (!scrollArea || !track) return

  const panels = gsap.utils.toArray('.pu-panel') as HTMLElement[]
  panels.forEach((panel, i) => {
    const pairIdx = Math.floor(i / 2)
    const isAlt = i % 2 === 1 // 配对中的第二个（平行面）
    const bg = pairColors[pairIdx][isAlt ? 1 : 0]
    panel.style.background = `radial-gradient(ellipse at 50% 50%, ${bg}, #060610)`
    // 平行面板加左右镜像翻转作为"反转感"
    if (isAlt) {
      const face = panel.querySelector('.pu-face') as HTMLElement
      if (face) face.style.transform = 'scaleX(-1)'
    }
  })

  const tween = gsap.to(track, {
    x: () => -(totalPanels - 1) * vw, ease: 'none',
    scrollTrigger: {
      trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress
        const idx = Math.round(progress * (totalPanels - 1))
        if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
        if (progressBar) progressBar.style.width = (progress * 100) + '%'
      }
    }
  })
  mainST = tween.scrollTrigger

  // 配对入场：同一对之间做镜像过渡
  panels.forEach((panel, i) => {
    const content = panel.querySelector('.pu-content') as HTMLElement
    if (!content) return
    const isAlt = i % 2 === 1
    gsap.set(content, { opacity: 0, x: isAlt ? 80 : -80 })
    if (i === 0) gsap.set(content, { opacity: 1, x: 0 })
    ScrollTrigger.create({
      trigger: panel, containerAnimation: tween, start: 'left 80%', end: 'left 20%', scrub: 0.5,
      onEnter: () => gsap.to(content, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }),
      onLeaveBack: () => gsap.set(content, { opacity: 0, x: isAlt ? 80 : -80 })
    })
    // 配对之间的翻转线
    if (isAlt && i < totalPanels - 1) {
      const divider = panel.querySelector('.pu-divider') as HTMLElement
      if (divider) {
        ScrollTrigger.create({
          trigger: panel, containerAnimation: tween, start: 'right 40%', end: 'right 10%', scrub: 0.3,
          onEnter: () => gsap.to(divider, { scaleY: 1, opacity: 0.6, duration: 0.3 }),
          onLeaveBack: () => gsap.to(divider, { scaleY: 0, opacity: 0, duration: 0.3 })
        })
      }
    }
  })

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0)
}
function destroy() { mainST?.kill(); mainST = null; document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="pu-page">
    <div id="puProgressBar" class="pu-progress-bar"></div>
    <nav id="puNavDots" class="pu-nav-dots"></nav>
    <div class="pu-page-indicator">
      <span class="pu-pair-label">P1</span>
      <span class="pu-current">1</span><span class="pu-total"> / {{ totalPanels }}</span>
    </div>
    <div id="puScrollArea" class="pu-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div class="pu-pinned">
        <div id="puTrack" class="pu-track">
          <section v-for="n in totalPanels" :key="n" class="pu-panel" :class="'pu-panel-' + ((n - 1) % 2 === 0 ? 'a' : 'b')">
            <div v-if="(n - 1) % 2 === 1" class="pu-divider"></div>
            <div class="pu-face">
              <div class="pu-content"><h2>{{ String.fromCharCode(64 + n) }}</h2></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pu-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.pu-scroll-area { position: relative; }
.pu-pinned { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.pu-track { display: flex; will-change: transform; }
.pu-panel { min-width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; flex-shrink: 0; }
.pu-divider { position: absolute; right: 0; top: 0; width: 2px; height: 100%; background: linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.15), rgba(255,255,255,0)); opacity: 0; transform: scaleY(0); transform-origin: center; z-index: 5; pointer-events: none; }
.pu-face { text-align: center; }
.pu-content { h2 { font-size: 6rem; font-weight: 900; margin: 0; letter-spacing: 4px; opacity: .5; } }
@media (max-width: 768px) { .pu-content h2 { font-size: 3.5rem; } }
</style>

<style lang="scss">
.pu-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.pu-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46,.1); cursor: pointer; border: 1px solid rgba(255,255,255,.1); transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.3); transform: scale(1.3); }
  &.pu-active { background: #60d0ff; border-color: rgba(96,208,255,.5); transform: scale(1.4); box-shadow: 0 0 16px rgba(96,208,255,.4); }
  &.pu-pair { background: rgba(255,160,96,.3); border-color: rgba(255,160,96,.2); }
}
.pu-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #60d0ff, #fa9060, #60d0ff, #fa9060); }
.pu-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
.pu-pair-label { font-weight: 700; color: #60d0ff; font-size: .8rem; letter-spacing: 2px; }
@media (max-width: 768px) { .pu-nav-dots { gap: 10px; } .pu-page-indicator { top: 16px; right: 14px; } }
</style>
