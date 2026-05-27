<script setup lang="ts">
/**
 * ==================== Scroll Spiral In ====================
 * 螺旋飞入 —— 面板从屏幕外以旋转+缩放方式螺旋飞入中央就位
 * 每个面板的螺旋起始角度不同，形成交替旋转入场效果
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
let currentIndex = 0
let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'spi-dot' + (i === 0 ? ' spi-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.spi-dot').forEach((d, i) => d.classList.toggle('spi-active', i === index))
  const el = document.querySelector('.spi-indicator .spi-cur')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
}
function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' })
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) }
}

function init() {
  scrollArea = document.getElementById('spiArea') as HTMLElement
  progressBar = document.getElementById('spiProgress')
  navDots = document.getElementById('spiNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.spi-panel') as HTMLElement[]

  // 每个面板的螺旋起始参数
  const spirals = [
    { angle: 720, x: 150, y: -120 },
    { angle: -540, x: -140, y: 130 },
    { angle: 630, x: 130, y: 110 },
    { angle: -720, x: -120, y: -140 },
    { angle: 540, x: 150, y: -100 },
    { angle: -630, x: -130, y: 120 },
    { angle: 720, x: 110, y: 140 },
    { angle: -540, x: -150, y: -110 },
  ]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      panels.forEach((panel, i) => {
        const dist = i - focus
        const sp = spirals[i % spirals.length]

        if (dist <= -1) {
          panel.style.transform = 'translate(0, 0) rotate(0deg) scale(1)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
        } else if (dist >= 1) {
          panel.style.transform = `translate(${sp.x}%, ${sp.y}%) rotate(${sp.angle}deg) scale(0.1)`
          panel.style.opacity = '0'
          panel.style.zIndex = String(TOTAL + i)
        } else if (dist > 0) {
          const p = 1 - dist // 0→1 入场进度
          // 螺旋路径：旋转逐渐减少，位移逐渐趋零，缩放逐渐趋1
          const ease = 1 - Math.pow(1 - p, 3) // easeOutCubic
          const rot = sp.angle * (1 - ease)
          const tx = sp.x * (1 - ease)
          const ty = sp.y * (1 - ease)
          const scale = 0.1 + 0.9 * ease
          panel.style.transform = `translate(${tx}%, ${ty}%) rotate(${rot}deg) scale(${scale})`
          panel.style.opacity = String(Math.min(1, p * 2.5))
          panel.style.zIndex = String(TOTAL + i)
        } else {
          panel.style.transform = 'translate(0, 0) rotate(0deg) scale(1)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
        }
      })
      const idx = Math.round(focus)
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    },
  })
  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  document.addEventListener('keydown', onKeydown)
  createNavDots(); updateUI(0)
}
function destroy() { mainST?.kill(); mainST = null; document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="spi-page">
    <div id="spiProgress" class="spi-progress-bar"></div>
    <nav id="spiNav" class="spi-nav-dots"></nav>
    <div class="spi-indicator"><span class="spi-cur">1</span> / {{ TOTAL }}</div>
    <div id="spiArea" class="spi-scroll-area">
      <div class="spi-viewport">
        <section v-for="n in TOTAL" :key="n" class="spi-panel"
          :style="{ background: `conic-gradient(from ${(n-1)*45}deg at 50% 50%, hsl(${(n-1)*44}, 50%, 28%), hsl(${(n-1)*44+30}, 40%, 20%), hsl(${(n-1)*44}, 50%, 28%))` }">
          <span class="spi-num">{{ String(n).padStart(2, '0') }}</span>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.spi-page { font-family: system-ui, sans-serif; background: #040408; color: #fff; }
.spi-scroll-area { position: relative; }
.spi-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.spi-panel {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: transform, opacity;
  &::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; pointer-events: none; }
}
.spi-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(255,255,255,0.05); user-select: none; pointer-events: none; }
</style>

<style lang="scss">
$accent: #a855f7;
.spi-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #ec4899); z-index: 1001; }
.spi-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.spi-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255,255,255,0.4); transform: scale(1.3); }
  &.spi-active { background: $accent; border-color: rgba(255,255,255,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.spi-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(0,0,0,0.4); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.75);
  .spi-cur { color: $accent; font-weight: 700; }
}
</style>

