<script setup lang="ts">
/**
 * ==================== Speed Corridor ====================
 * 变速走廊 —— fake-horizontal-scroll 增强版
 * 面板以不同速度横移，制造视觉纵深：
 *   背景层(慢速) + 中间内容层(中速) + 前景装饰层(快速)
 * 三层视差叠加产生走廊景深——类似透过走廊窗户看到的远近层次
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
    const dot = document.createElement('button'); dot.className = 'sc-nav-dot' + (i === 0 ? ' sc-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.sc-nav-dot').forEach((d, i) => d.classList.toggle('sc-active', i === index))
  const el = document.querySelector('.sc-page-indicator .sc-current'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}
function goToPanel(index: number) { index = Math.max(0, Math.min(index, totalPanels - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { const m: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }; if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) } }
let tsY = 0; function onTouchStart(e: TouchEvent) { tsY = e.touches[0].clientY }; function onTouchEnd(e: TouchEvent) { const d = tsY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function init() {
  vw = window.innerWidth
  scrollArea = document.getElementById('scScrollArea') as HTMLElement
  track = document.getElementById('scTrack') as HTMLElement
  progressBar = document.getElementById('scProgressBar')
  navDots = document.getElementById('scNavDots')
  if (!scrollArea || !track) return

  const panels = gsap.utils.toArray('.sc-panel') as HTMLElement[]

  // 初始化每面板内的三层视差
  panels.forEach((panel, i) => {
    const deepBg = panel.querySelector('.sc-deep-bg') as HTMLElement    // 深景：原地不动
    const midLayer = panel.querySelector('.sc-mid-layer') as HTMLElement // 中景：慢速跟随
    const foreLayer = panel.querySelector('.sc-fore-layer') as HTMLElement // 前景：快速掠过
    if (deepBg) gsap.set(deepBg, { x: 0 })
    if (midLayer) gsap.set(midLayer, { x: i * -20, opacity: 0 })
    if (foreLayer) gsap.set(foreLayer, { x: i * 30, opacity: 0 })
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

        // 每面板三层视差实时更新
        panels.forEach((panel, pi) => {
          const deepBg = panel.querySelector('.sc-deep-bg') as HTMLElement
          const midLayer = panel.querySelector('.sc-mid-layer') as HTMLElement
          const foreLayer = panel.querySelector('.sc-fore-layer') as HTMLElement

          // 面板中心在总进度中的位置
          const panelCenter = pi / (totalPanels - 1)
          const distFromCenter = (progress - panelCenter) / (1 / (totalPanels - 1))
          const clamped = Math.max(-1, Math.min(1, distFromCenter))

          // 深景：不动（速度=0）
          if (deepBg) gsap.set(deepBg, { x: 0 })

          // 中景：慢速跟随（速度=0.3x）
          if (midLayer) {
            const midX = -clamped * vw * 0.3
            gsap.set(midLayer, { x: midX, opacity: 1 - Math.abs(clamped) * 0.7 })
          }

          // 前景：快速掠过（速度=0.8x）
          if (foreLayer) {
            const foreX = -clamped * vw * 0.8
            gsap.set(foreLayer, { x: foreX, opacity: 1 - Math.abs(clamped) * 0.5 })
          }
        })
      }
    }
  })
  mainST = tween.scrollTrigger

  // 面板内容入场
  panels.forEach((panel, i) => {
    if (i === 0) return
    const content = panel.querySelector('.sc-content') as HTMLElement
    if (!content) return
    gsap.set(content, { opacity: 0, y: 30 })
    ScrollTrigger.create({
      trigger: panel, containerAnimation: tween, start: 'left 80%', end: 'left 20%', scrub: 0.5,
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
  <div class="sc-page">
    <div id="scProgressBar" class="sc-progress-bar"></div>
    <nav id="scNavDots" class="sc-nav-dots"></nav>
    <div class="sc-page-indicator"><span class="sc-current">1</span><span class="sc-total"> / {{ totalPanels }}</span></div>
    <div id="scScrollArea" class="sc-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div class="sc-pinned">
        <div id="scTrack" class="sc-track">
          <section v-for="n in totalPanels" :key="n" class="sc-panel" :style="{
            background: `linear-gradient(135deg, hsl(${(n-1)*52+120}, 20%, 90%), hsl(${(n-1)*52}, 15%, 6%))`
          }">
            <!-- 深景层（最远，几乎不动） -->
            <div class="sc-deep-bg" :style="{
              width: '160%', height: '160%', left: '-30%', top: '-30%',
              background: `radial-gradient(ellipse at 50% 50%, hsl(${(n-1)*52+180}, 25%, 12%), transparent 70%)`
            }"></div>
            <!-- 中景层 -->
            <div class="sc-mid-layer" :style="{
              width: '80%', height: '80%',
              background: `radial-gradient(ellipse at 50% 50%, hsl(${(n-1)*52+90}, 30%, 18%), transparent 60%)`
            }"></div>
            <!-- 前景层（最近，最快） -->
            <div class="sc-fore-layer">
              <span v-for="d in 6" :key="d" :style="{
                position: 'absolute', width: '60px', height: '60px', borderRadius: '50%', opacity: '.08',
                background: `hsl(${(n-1)*52+d*30}, 60%, 60%)`,
                left: 20 + d * 12 + '%', top: 30 + (d % 3) * 20 + '%'
              }"></span>
            </div>
            <div class="sc-content"><h2>{{ String.fromCharCode(64 + n) }}</h2></div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sc-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.sc-scroll-area { position: relative; }
.sc-pinned { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.sc-track { display: flex; will-change: transform; }
.sc-panel { min-width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; flex-shrink: 0; }
.sc-deep-bg { position: absolute; pointer-events: none; }
.sc-mid-layer { position: absolute; pointer-events: none; border-radius: 50%; }
.sc-fore-layer { position: absolute; inset: 0; pointer-events: none; }
.sc-content { text-align: center; z-index: 2; position: relative;
  h2 { font-size: 5rem; font-weight: 900; margin: 0; letter-spacing: 4px; opacity: .4; text-shadow: 0 0 30px rgba(255,255,255,.05); }
}
@media (max-width: 768px) { .sc-content h2 { font-size: 3rem; } }
</style>

<style lang="scss">
.sc-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.sc-nav-dot { width: 12px; height: 12px; border-radius: 2px; background: rgba(26, 26, 46,.08); cursor: pointer; border: 1px solid rgba(255,255,255,.06); transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.3); transform: scale(1.3) rotate(45deg); }
  &.sc-active { background: #88dd70; border-color: rgba(136,221,112,.4); width: 24px; border-radius: 6px; box-shadow: 0 0 16px rgba(136,221,112,.3); }
}
.sc-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #88dd70, #44aa88, #88dd70); }
.sc-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .sc-nav-dots { gap: 10px; } .sc-page-indicator { top: 16px; right: 14px; } }
</style>
