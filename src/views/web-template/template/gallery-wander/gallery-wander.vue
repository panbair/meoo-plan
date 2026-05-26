<script setup lang="ts">
/**
 * ==================== Gallery Wander ====================
 * 画廊漫游 —— fake-horizontal-scroll 增强版
 * 面板宽度不一：奇数面板全屏、偶数面板半屏卡片
 * 在横移中产生"宽→窄→宽→窄"的节奏变化，如同漫步画廊看到不同尺寸的画框
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const totalPanels = 7
let vw = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button'); dot.className = 'gw-nav-dot' + (i === 0 ? ' gw-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.gw-nav-dot').forEach((d, i) => d.classList.toggle('gw-active', i === index))
  const el = document.querySelector('.gw-page-indicator .gw-current'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}
function goToPanel(index: number) { index = Math.max(0, Math.min(index, totalPanels - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { const m: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }; if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) } }
let tsY = 0; function onTouchStart(e: TouchEvent) { tsY = e.touches[0].clientY }; function onTouchEnd(e: TouchEvent) { const d = tsY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function init() {
  vw = window.innerWidth
  scrollArea = document.getElementById('gwScrollArea') as HTMLElement
  track = document.getElementById('gwTrack') as HTMLElement
  progressBar = document.getElementById('gwProgressBar')
  navDots = document.getElementById('gwNavDots')
  if (!scrollArea || !track) return

  const panels = gsap.utils.toArray('.gw-panel') as HTMLElement[]

  // 计算轨道总宽度：全屏面板=100vw，半屏=45vw，间距5vw
  let totalTrackWidth = 0
  panels.forEach((p, i) => {
    const halfW = i % 2 === 0 ? vw : vw * 0.45
    p.style.width = halfW + 'px'
    p.style.minWidth = halfW + 'px'
    totalTrackWidth += halfW
  })

  // 可移动距离 = 轨道总宽 - 视口宽
  const moveDistance = totalTrackWidth - vw

  const tween = gsap.to(track, {
    x: () => -(moveDistance), ease: 'none',
    scrollTrigger: {
      trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
      onUpdate: (self) => {
        if (progressBar) progressBar.style.width = (self.progress * 100) + '%'

        // 根据实际X位置判定当前面板
        const trackX = -self.progress * moveDistance
        let accumulatedW = 0
        let foundIdx = 0
        for (let pi = 0; pi < panels.length; pi++) {
          const panelW = pi % 2 === 0 ? vw : vw * 0.45
          accumulatedW += panelW
          if (trackX <= accumulatedW - panelW * 0.5) { foundIdx = pi; break }
        }
        if (foundIdx !== currentIndex) { currentIndex = foundIdx; updateUI(foundIdx) }
      }
    }
  })
  mainST = tween.scrollTrigger

  // 面板内容动画
  panels.forEach((panel, i) => {
    const content = panel.querySelector('.gw-content') as HTMLElement
    if (!content) return
    gsap.set(content, { opacity: 0, y: 40 })
    ScrollTrigger.create({
      trigger: panel, containerAnimation: tween, start: 'left 85%', end: 'left 35%', scrub: 0.4,
      onEnter: () => gsap.to(content, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }),
      onLeaveBack: () => gsap.set(content, { opacity: 0, y: 40 })
    })
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
  <div class="gw-page">
    <div id="gwProgressBar" class="gw-progress-bar"></div>
    <nav id="gwNavDots" class="gw-nav-dots"></nav>
    <div class="gw-page-indicator"><span class="gw-current">1</span><span class="gw-total"> / {{ totalPanels }}</span></div>
    <div id="gwScrollArea" class="gw-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div class="gw-pinned">
        <div id="gwTrack" class="gw-track">
          <section v-for="n in totalPanels" :key="n" class="gw-panel gw-panel-bg" :style="{
            background: n % 2 === 1
              ? `linear-gradient(135deg, hsl(${(n-1)*52}, 35%, 14%), hsl(${(n-1)*52+30}, 25%, 8%))`
              : `linear-gradient(135deg, hsl(${(n-1)*52+60}, 30%, 12%), hsl(${(n-1)*52+90}, 20%, 6%))`,
            borderRadius: n % 2 === 0 ? '0' : '20px',
            margin: n % 2 === 0 ? '0' : '0 12px'
          }">
            <div class="gw-content"><h2>{{ n }}</h2></div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gw-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #080810; color: #fff; }
.gw-scroll-area { position: relative; }
.gw-pinned { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.gw-track { display: flex; will-change: transform; align-items: center; }
.gw-panel { height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; flex-shrink: 0; transition: border-radius .3s; }
.gw-content { text-align: center; z-index: 1; h2 { font-size: 4rem; font-weight: 900; margin: 0; letter-spacing: 6px; opacity: .6; } }
@media (max-width: 768px) {
  .gw-content h2 { font-size: 2.5rem; }
  .gw-panel { border-radius: 12px !important; }
}
</style>

<style lang="scss">
.gw-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.gw-nav-dot { width: 10px; height: 10px; border-radius: 2px; background: rgba(255,255,255,.1); cursor: pointer; transition: all .3s;
  &:hover { background: rgba(255,255,255,.4); transform: scale(1.3); }
  &.gw-active { background: #f0a060; width: 22px; border-radius: 5px; box-shadow: 0 0 14px rgba(240,160,96,.4); }
}
.gw-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #f0a060, #e07050, #f0a060); }
.gw-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.35); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .gw-nav-dots { gap: 10px; } .gw-page-indicator { top: 16px; right: 14px; } }
</style>
