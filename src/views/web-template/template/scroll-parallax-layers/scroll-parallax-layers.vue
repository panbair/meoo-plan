<script setup lang="ts">
/**
 * ==================== Scroll Parallax Layers ====================
 * 层叠视差 —— 每个面板内含3层(背景/中景/前景)，
 * 入场时各层以不同速度从上方滑入：
 *   背景层：慢速(0.3x)
 *   中景层：正常速(1x) — 承载编号
 *   前景层：快速(1.8x)
 * 形成强烈的深度视差效果
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const LAYER_SPEEDS = [0.3, 1, 1.8] // 背景/中景/前景 速度倍率

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
    dot.className = 'plx-dot' + (i === 0 ? ' plx-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.plx-dot').forEach((d, i) => d.classList.toggle('plx-active', i === index))
  const el = document.querySelector('.plx-indicator .plx-cur')
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
  scrollArea = document.getElementById('plxArea') as HTMLElement
  progressBar = document.getElementById('plxProgress')
  navDots = document.getElementById('plxNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const groups = gsap.utils.toArray('.plx-group') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      groups.forEach((group, i) => {
        const dist = i - focus
        const layers = group.querySelectorAll('.plx-layer') as NodeListOf<HTMLElement>

        layers.forEach((layer, li) => {
          const speed = LAYER_SPEEDS[li]
          if (dist <= -1) {
            layer.style.transform = 'translateY(0%)'
            layer.style.opacity = '1'
          } else if (dist >= 1) {
            layer.style.transform = `translateY(${-100 * speed}%)`
            layer.style.opacity = '0'
          } else if (dist > 0) {
            const p = 1 - dist
            const yOff = -100 * speed * (1 - p)
            layer.style.transform = `translateY(${yOff}%)`
            layer.style.opacity = String(Math.min(1, p * (2 - li * 0.3)))
          } else {
            layer.style.transform = 'translateY(0%)'
            layer.style.opacity = '1'
          }
        })
        group.style.zIndex = dist > 0 ? String(TOTAL + i) : String(i)
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
  <div class="plx-page">
    <div id="plxProgress" class="plx-progress-bar"></div>
    <nav id="plxNav" class="plx-nav-dots"></nav>
    <div class="plx-indicator"><span class="plx-cur">1</span> / {{ TOTAL }}</div>
    <div id="plxArea" class="plx-scroll-area">
      <div class="plx-viewport">
        <div v-for="n in TOTAL" :key="n" class="plx-group">
          <!-- 背景层(最慢) -->
          <div class="plx-layer plx-bg"
            :style="{ background: `radial-gradient(ellipse at 50% 60%, hsl(${(n-1)*44}, 40%, 78%), hsl(${(n-1)*44+20}, 30%, 90%))` }">
            <div class="plx-bg-shape plx-bg-circle"></div>
            <div class="plx-bg-shape plx-bg-line"></div>
          </div>
          <!-- 中景层(标准速度) -->
          <div class="plx-layer plx-mid"
            :style="{ background: `linear-gradient(180deg, transparent 30%, hsla(${(n-1)*44}, 45%, 25%, 0.6) 100%)` }">
            <span class="plx-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
          <!-- 前景层(最快) -->
          <div class="plx-layer plx-fg">
            <div class="plx-fg-bar" :style="{ background: `hsla(${(n-1)*44+10}, 50%, 70%,0.15)` }"></div>
            <div class="plx-fg-dot" :style="{ background: `hsla(${(n-1)*44+20}, 55%, 75%,0.1)` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.plx-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.plx-scroll-area { position: relative; }
.plx-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.plx-group { position: absolute; inset: 0; }
.plx-layer { position: absolute; inset: 0; will-change: transform, opacity; }

/* 背景层 */
.plx-bg { display: flex; align-items: center; justify-content: center; }
.plx-bg-shape { position: absolute; pointer-events: none; }
.plx-bg-circle { width: 50vw; height: 50vw; max-width: 500px; max-height: 500px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.03); top: 20%; left: 25%; }
.plx-bg-line { width: 60%; height: 1px; background: rgba(26, 26, 46,0.02); bottom: 30%; left: 20%; }

/* 中景层 */
.plx-mid { display: flex; align-items: center; justify-content: center; }
.plx-num { font-size: clamp(5rem, 14vw, 12rem); font-weight: 900; color: rgba(26, 26, 46,0.06); user-select: none; pointer-events: none; }

/* 前景层 */
.plx-fg { pointer-events: none; }
.plx-fg-bar { position: absolute; bottom: 0; left: 10%; width: 30%; height: 40%; border-radius: 20px 20px 0 0; }
.plx-fg-dot { position: absolute; top: 15%; right: 12%; width: 80px; height: 80px; border-radius: 50%; }
</style>

<style lang="scss">
$accent: #6366f1;
.plx-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #8b5cf6); z-index: 1001; }
.plx-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.plx-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.plx-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.plx-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .plx-cur { color: $accent; font-weight: 700; }
}
</style>

