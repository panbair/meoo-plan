<script setup lang="ts">
/**
 * ==================== Scroll Parallax Depth ====================
 * 纵深视差 —— 面板从远处飞向镜头：
 *   背景层：scale极小+模糊+慢速 → 滞后到达
 *   内容层：scale小+清晰+中速 → 正常速度放大
 *   前景层：scale适中+快速 → 先到达，形成"穿过"感
 * 像穿越一层层玻璃门
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8

// 三层的缩放范围和速度
const LAYERS = [
  { startScale: 0.2, endScale: 1, speed: 0.5, startBlur: 8, endBlur: 0 },   // 背景(最慢)
  { startScale: 0.4, endScale: 1, speed: 1, startBlur: 2, endBlur: 0 },     // 内容(正常)
  { startScale: 0.6, endScale: 1, speed: 1.6, startBlur: 0, endBlur: 0 },   // 前景(最快)
]

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
    dot.className = 'pdp-dot' + (i === 0 ? ' pdp-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.pdp-dot').forEach((d, i) => d.classList.toggle('pdp-active', i === index))
  const el = document.querySelector('.pdp-indicator .pdp-cur')
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
  scrollArea = document.getElementById('pdpArea') as HTMLElement
  progressBar = document.getElementById('pdpProgress')
  navDots = document.getElementById('pdpNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const groups = gsap.utils.toArray('.pdp-group') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      groups.forEach((group, i) => {
        const dist = i - focus
        const layers = group.querySelectorAll('.pdp-layer') as NodeListOf<HTMLElement>

        layers.forEach((layer, li) => {
          const cfg = LAYERS[li]
          if (dist <= -1) {
            // 已过：正常尺寸，继续放大飞过(前景最大)
            const overScale = 1 + (1 - dist) * 0.1 * cfg.speed
            layer.style.transform = `scale(${Math.min(overScale, 2.5)})`
            layer.style.opacity = String(Math.max(0, 1 + dist * 0.8))
            layer.style.filter = 'blur(0px)'
          } else if (dist >= 1) {
            // 远处：缩小+模糊
            layer.style.transform = `scale(${cfg.startScale})`
            layer.style.opacity = '0'
            layer.style.filter = `blur(${cfg.startBlur}px)`
          } else if (dist > 0) {
            // 正在飞来 (0 < dist < 1)
            const rawP = 1 - dist
            const p = Math.min(1, rawP * cfg.speed) // 速度差
            const scale = cfg.startScale + (cfg.endScale - cfg.startScale) * p
            const blur = cfg.startBlur + (cfg.endBlur - cfg.startBlur) * p
            layer.style.transform = `scale(${scale})`
            layer.style.opacity = String(Math.min(1, rawP * 2.5))
            layer.style.filter = `blur(${blur}px)`
          } else {
            // 到位(dist = 0 ~ -1)
            const overP = -dist
            const overScale = 1 + overP * 0.3 * cfg.speed
            layer.style.transform = `scale(${overScale})`
            layer.style.opacity = String(Math.max(0, 1 - overP * 1.2))
            layer.style.filter = 'blur(0px)'
          }
        })
        group.style.zIndex = dist > 0 ? String(TOTAL + i) : String(TOTAL - i)
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
  <div class="pdp-page">
    <div id="pdpProgress" class="pdp-progress-bar"></div>
    <nav id="pdpNav" class="pdp-nav-dots"></nav>
    <div class="pdp-indicator"><span class="pdp-cur">1</span> / {{ TOTAL }}</div>
    <div id="pdpArea" class="pdp-scroll-area">
      <div class="pdp-viewport">
        <div v-for="n in TOTAL" :key="n" class="pdp-group">
          <!-- 背景层(最慢到达) -->
          <div class="pdp-layer pdp-back"
            :style="{ background: `radial-gradient(circle at 50% 50%, hsl(${(n-1)*44}, 45%, 24%), hsl(${(n-1)*44+20}, 32%, 92%))` }">
            <div class="pdp-ring" :style="{ borderColor: `hsla(${(n-1)*44}, 40%, 70%,0.06)` }"></div>
          </div>
          <!-- 内容层 -->
          <div class="pdp-layer pdp-content">
            <span class="pdp-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
          <!-- 前景层(最快到达) -->
          <div class="pdp-layer pdp-front">
            <div class="pdp-glass" :style="{ borderColor: `hsla(${(n-1)*44+10}, 50%, 75%,0.05)` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pdp-page { font-family: system-ui, sans-serif; background: #020206; color: #1a1a2e; }
.pdp-scroll-area { position: relative; }
.pdp-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }

.pdp-group { position: absolute; inset: 0; }
.pdp-layer { position: absolute; inset: 0; will-change: transform, opacity, filter; display: flex; align-items: center; justify-content: center; }

.pdp-num { font-size: clamp(5rem, 14vw, 12rem); font-weight: 900; color: rgba(26, 26, 46,0.06); user-select: none; pointer-events: none; }

.pdp-ring {
  width: 60vw; height: 60vw; max-width: 600px; max-height: 600px;
  border-radius: 50%; border: 1px solid; pointer-events: none;
}

.pdp-glass {
  width: 80vw; height: 80vh; border-radius: 30px; border: 1px solid;
  pointer-events: none;
}
</style>

<style lang="scss">
$accent: #22c55e;
.pdp-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #86efac); z-index: 1001; }
.pdp-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.pdp-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.pdp-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.pdp-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .pdp-cur { color: $accent; font-weight: 700; }
}
</style>

