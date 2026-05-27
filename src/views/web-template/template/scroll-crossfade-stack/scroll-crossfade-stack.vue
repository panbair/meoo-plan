<script setup lang="ts">
/**
 * ==================== Scroll Crossfade Stack ====================
 * 交叉淡入堆叠 —— 面板绝对定位重叠在同一位置，
 * 竖滚驱动它们交叉淡入淡出，同时伴随微妙的缩放和位移
 *
 * 核心机制：
 *   1. scrollArea 撑出纵向空间
 *   2. sticky viewport 锁住视口
 *   3. 所有面板 position:absolute 重叠
 *   4. scroll progress → 计算每个面板的 opacity/scale/y
 *   5. 当前面板 opacity=1, 前后面板渐隐并缩小
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 7
let currentIndex = 0
let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) { return }
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'cfs-dot' + (i === 0 ? ' cfs-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.cfs-dot').forEach((d, i) => {
    d.classList.toggle('cfs-active', i === index)
  })
  const el = document.querySelector('.cfs-indicator .cfs-cur')
  if (el) { el.textContent = String(index + 1) }
  if (progressBar) { progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
}

function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, {
    scrollTo: { y: index * window.innerHeight, autoKill: false },
    duration: 0.6,
    ease: 'power2.inOut',
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) }
}

function init() {
  scrollArea = document.getElementById('cfsArea') as HTMLElement
  progressBar = document.getElementById('cfsProgress')
  navDots = document.getElementById('cfsNav')
  if (!scrollArea) { return }

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.cfs-layer') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate: (self) => {
      const p = self.progress
      const focus = p * (TOTAL - 1)

      panels.forEach((panel, i) => {
        const dist = i - focus
        const absDist = Math.abs(dist)

        // 当前面板: opacity=1, scale=1
        // 相邻面板: 逐渐淡出 + 缩放 + Y 偏移
        const opacity = Math.max(0, 1 - absDist * 1.2)
        const scale = Math.max(0.85, 1 - absDist * 0.08)
        const yShift = dist * 40
        const blur = absDist > 0.8 ? Math.min(8, (absDist - 0.8) * 10) : 0

        panel.style.opacity = String(opacity)
        panel.style.transform = `scale(${scale}) translateY(${yShift}px)`
        panel.style.filter = blur > 0 ? `blur(${blur}px)` : 'none'
        panel.style.zIndex = String(TOTAL - Math.round(absDist))
        panel.style.pointerEvents = absDist < 0.5 ? 'auto' : 'none'
      })

      const idx = Math.round(focus)
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    },
  })

  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  document.addEventListener('keydown', onKeydown)
  createNavDots()
  updateUI(0)
}

function destroy() {
  mainST?.kill()
  mainST = null
  document.removeEventListener('keydown', onKeydown)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="cfs-page">
    <div id="cfsProgress" class="cfs-progress-bar"></div>
    <nav id="cfsNav" class="cfs-nav-dots"></nav>
    <div class="cfs-indicator"><span class="cfs-cur">1</span> / {{ TOTAL }}</div>

    <div id="cfsArea" class="cfs-scroll-area">
      <div class="cfs-viewport">
        <div class="cfs-stack">
          <div v-for="n in TOTAL" :key="n" class="cfs-layer"
            :style="{
              background: `radial-gradient(ellipse at ${30 + (n - 1) * 8}% ${40 + (n - 1) * 5}%, hsl(${(n - 1) * 50}, 50%, 35%) 0%, hsl(${(n - 1) * 50 + 20}, 35%, 15%) 100%)`,
              opacity: n === 1 ? '1' : '0',
            }">
            <span class="cfs-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cfs-page { font-family: system-ui, -apple-system, sans-serif; background: #0a0a14; color: #fff; }
.cfs-scroll-area { position: relative; }
.cfs-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden;
}
.cfs-stack { position: relative; width: 100%; height: 100%; }
.cfs-layer {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  will-change: transform, opacity, filter;
  border-radius: 0;
  &::before {
    content: ''; position: absolute; inset: 28px;
    border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 20px; pointer-events: none;
  }
}
.cfs-num {
  font-size: clamp(5rem, 14vw, 12rem); font-weight: 900;
  color: rgba(255, 255, 255, 0.04); user-select: none; pointer-events: none;
}
</style>

<style lang="scss">
$accent: #f0a050;
.cfs-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #f06060); z-index: 1001; }
.cfs-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 12px; }
.cfs-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255, 255, 255, 0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255, 255, 255, 0.4); transform: scale(1.3); }
  &.cfs-active { background: $accent; border-color: rgba(255, 255, 255, 0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.cfs-indicator {
  position: fixed; top: 24px; right: 24px; z-index: 1000; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(10px);
  padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; color: rgba(255, 255, 255, 0.65); border: 1px solid rgba(255, 255, 255, 0.08);
  .cfs-cur { color: $accent; font-weight: 700; }
}
</style>



