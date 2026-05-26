<script setup lang="ts">
/**
 * ==================== Z-Tunnel ====================
 * Z轴隧道 —— fake-horizontal-scroll 增强版
 * 面板在横向移动的同时沿Z轴做景深变化：
 *   远处面板(未进入)→缩小+模糊 → 当前面板→1:1清晰 → 离开面板→缩小+模糊消失
 * 模拟穿越一条无限隧道
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
    const dot = document.createElement('button'); dot.className = 'zt-nav-dot' + (i === 0 ? ' zt-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.zt-nav-dot').forEach((d, i) => d.classList.toggle('zt-active', i === index))
  const el = document.querySelector('.zt-page-indicator .zt-current'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}
function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' })
}
function onKeydown(e: KeyboardEvent) { const m: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }; if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) } }
let tsY = 0
function onTouchStart(e: TouchEvent) { tsY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) { const d = tsY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function init() {
  vw = window.innerWidth
  scrollArea = document.getElementById('ztScrollArea') as HTMLElement
  track = document.getElementById('ztTrack') as HTMLElement
  progressBar = document.getElementById('ztProgressBar')
  navDots = document.getElementById('ztNavDots')
  if (!scrollArea || !track) return

  // 横移轨道 + 每面板Z轴景深
  const panels = gsap.utils.toArray('.zt-panel') as HTMLElement[]
  panels.forEach((panel, i) => {
    // 初始状态：远处缩小模糊
    gsap.set(panel, { scale: 0.5, filter: 'blur(6px) brightness(0.4)', opacity: 0.6, transformOrigin: 'center center' })
    if (i === 0) gsap.set(panel, { scale: 1, filter: 'blur(0px) brightness(1)', opacity: 1 })
  })

  // 核心横移
  const tween = gsap.to(track, {
    x: () => -(totalPanels - 1) * vw, ease: 'none',
    scrollTrigger: {
      trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress
        const idx = Math.round(progress * (totalPanels - 1))
        if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
        if (progressBar) progressBar.style.width = (progress * 100) + '%'

        // 每个面板根据当前进度动态计算Z轴深度
        panels.forEach((panel, pi) => {
          const panelCenter = pi / (totalPanels - 1) // 面板在总进度中的位置
          const dist = Math.abs(progress - panelCenter) / (1 / (totalPanels - 1)) // 归一化到0-1范围
          const clampedDist = Math.min(dist, 1)
          const scale = 1 - clampedDist * 0.5 // 0.5~1
          const blur = clampedDist * 6
          const brightness = 1 - clampedDist * 0.6
          const opacity = 1 - clampedDist * 0.5
          gsap.set(panel, { scale, filter: `blur(${blur}px) brightness(${brightness})`, opacity })
        })
      }
    }
  })
  mainST = tween.scrollTrigger

  // 内容入场
  panels.forEach((panel, i) => {
    if (i === 0) return
    const content = panel.querySelector('.zt-content') as HTMLElement
    if (!content) return
    ScrollTrigger.create({
      trigger: panel, containerAnimation: tween, start: 'left 80%', end: 'left 20%', scrub: 0.6,
      onEnter: () => gsap.to(content, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }),
      onLeaveBack: () => gsap.set(content, { opacity: 0, y: 30 })
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
  <div class="zt-page">
    <div id="ztProgressBar" class="zt-progress-bar"></div>
    <nav id="ztNavDots" class="zt-nav-dots"></nav>
    <div class="zt-page-indicator"><span class="zt-current">1</span><span class="zt-total"> / {{ totalPanels }}</span></div>
    <div id="ztScrollArea" class="zt-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div class="zt-pinned">
        <div id="ztTrack" class="zt-track">
          <section v-for="n in totalPanels" :key="n" class="zt-panel zt-panel-bg" :style="{
            background: `radial-gradient(ellipse at 50% 50%, hsl(${(n-1)*52}, 40%, 20%), hsl(${(n-1)*52}, 30%, 8%))`
          }">
            <div class="zt-content"><h2>0{{ n }}</h2></div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.zt-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #060610; color: #fff; }
.zt-scroll-area { position: relative; }
.zt-pinned { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; perspective: 1200px; }
.zt-track { display: flex; will-change: transform; }
.zt-panel { min-width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; flex-shrink: 0; backface-visibility: hidden; }
.zt-content { text-align: center; z-index: 1; h2 { font-size: 5rem; font-weight: 900; margin: 0; letter-spacing: 8px; opacity: .7; } }
@media (max-width: 768px) { .zt-content h2 { font-size: 3rem; } }
</style>

<style lang="scss">
.zt-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.zt-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.12); cursor: pointer; border: 1px solid rgba(255,255,255,.12); transition: all .3s;
  &:hover { background: rgba(255,255,255,.4); transform: scale(1.3); }
  &.zt-active { background: #7c6cff; border-color: rgba(124,108,255,.4); transform: scale(1.4); box-shadow: 0 0 18px rgba(124,108,255,.5); }
}
.zt-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #7c6cff, #a78bfa, #7c6cff); }
.zt-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .zt-nav-dots { gap: 10px; } .zt-page-indicator { top: 16px; right: 14px; } }
</style>
