<script setup lang="ts">
/**
 * ==================== Scroll Curtain Peel ====================
 * 幕帘剥离 —— 当前面板被从四角"撕开"揭起露出下一个
 * 用 clip-path 从 inset(0) 收缩到 inset(50%) 实现
 * 同时伴随轻微的 scale 和 rotate 模拟纸张被掀起的翘曲
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
    dot.className = 'ctp-dot' + (i === 0 ? ' ctp-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.ctp-dot').forEach((d, i) => d.classList.toggle('ctp-active', i === index))
  const el = document.querySelector('.ctp-indicator .ctp-cur')
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
  scrollArea = document.getElementById('ctpArea') as HTMLElement
  progressBar = document.getElementById('ctpProgress')
  navDots = document.getElementById('ctpNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.ctp-layer') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      panels.forEach((panel, i) => {
        const dist = i - focus
        if (dist <= -1) {
          // 完全剥离消失
          panel.style.clipPath = 'inset(50%)'
          panel.style.opacity = '0'
          panel.style.transform = 'scale(0.8) rotate(4deg)'
          panel.style.zIndex = String(i)
        } else if (dist < 0) {
          // 正在剥离 (-1 < dist < 0)
          const peelProg = -dist // 0→1
          const inset = peelProg * 50 // 0% → 50%
          panel.style.clipPath = `inset(${inset}%)`
          panel.style.opacity = String(1 - peelProg * 0.6)
          panel.style.transform = `scale(${1 - peelProg * 0.15}) rotate(${peelProg * 3}deg)`
          panel.style.zIndex = String(TOTAL + 1)
        } else if (dist < 1) {
          // 当前页 / 即将显示
          panel.style.clipPath = 'inset(0%)'
          panel.style.opacity = '1'
          panel.style.transform = 'scale(1) rotate(0deg)'
          panel.style.zIndex = String(TOTAL)
        } else {
          // 下方等待
          panel.style.clipPath = 'inset(0%)'
          panel.style.opacity = '1'
          panel.style.transform = 'scale(1) rotate(0deg)'
          panel.style.zIndex = String(TOTAL - Math.round(dist))
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
  <div class="ctp-page">
    <div id="ctpProgress" class="ctp-progress-bar"></div>
    <nav id="ctpNav" class="ctp-nav-dots"></nav>
    <div class="ctp-indicator"><span class="ctp-cur">1</span> / {{ TOTAL }}</div>
    <div id="ctpArea" class="ctp-scroll-area">
      <div class="ctp-viewport">
        <div class="ctp-stack">
          <section v-for="n in TOTAL" :key="n" class="ctp-layer"
            :style="{ background: `linear-gradient(${140 + (n-1)*22}deg, hsl(${(n-1)*44}, 50%, 72%), hsl(${(n-1)*44+20}, 38%, 15%))` }">
            <span class="ctp-num">{{ String(n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ctp-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.ctp-scroll-area { position: relative; }
.ctp-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.ctp-stack { position: relative; width: 100%; height: 100%; }
.ctp-layer {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: clip-path, transform, opacity; transform-origin: center center;
  &::before { content: ''; position: absolute; inset: 28px; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; pointer-events: none; }
}
.ctp-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(26, 26, 46,0.05); user-select: none; pointer-events: none; }
</style>

<style lang="scss">
$accent: #e879f9;
.ctp-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #f472b6); z-index: 1001; }
.ctp-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.ctp-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.ctp-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.ctp-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .ctp-cur { color: $accent; font-weight: 700; }
}
</style>

