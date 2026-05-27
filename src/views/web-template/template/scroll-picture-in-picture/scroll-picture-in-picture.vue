<script setup lang="ts">
/**
 * ==================== Scroll Picture In Picture ====================
 * 画中画 —— 上一个面板缩小到右下角(画中画)，新面板全屏入场
 * 画中画窗口停留一会才最终消失，像视频通话挂断
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
// 画中画缩小到的位置(右下角)
const PIP_SCALE = 0.25
const PIP_X = 72 // vw偏移
const PIP_Y = 68 // vh偏移

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
    dot.className = 'pip-dot' + (i === 0 ? ' pip-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.pip-dot').forEach((d, i) => d.classList.toggle('pip-active', i === index))
  const el = document.querySelector('.pip-indicator .pip-cur')
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
  scrollArea = document.getElementById('pipArea') as HTMLElement
  progressBar = document.getElementById('pipProgress')
  navDots = document.getElementById('pipNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.pip-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      panels.forEach((panel, i) => {
        const dist = i - focus

        if (dist <= -2) {
          // 完全消失
          panel.style.transform = `translate(${PIP_X}%, ${PIP_Y}%) scale(${PIP_SCALE})`
          panel.style.opacity = '0'
          panel.style.zIndex = String(i)
          panel.style.borderRadius = '16px'
        } else if (dist <= -1) {
          // 画中画停留→淡出 (-2 < dist <= -1)
          const fadeP = -dist - 1 // 0→1
          panel.style.transform = `translate(${PIP_X}%, ${PIP_Y}%) scale(${PIP_SCALE})`
          panel.style.opacity = String(Math.max(0, 1 - fadeP))
          panel.style.zIndex = String(TOTAL + 5)
          panel.style.borderRadius = '16px'
          panel.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)'
        } else if (dist < 0) {
          // 正在缩小到画中画 (-1 < dist < 0)
          const shrinkP = -dist // 0→1
          const scale = 1 - shrinkP * (1 - PIP_SCALE)
          const tx = shrinkP * PIP_X
          const ty = shrinkP * PIP_Y
          const radius = shrinkP * 16
          panel.style.transform = `translate(${tx}%, ${ty}%) scale(${scale})`
          panel.style.opacity = '1'
          panel.style.zIndex = String(TOTAL + 5)
          panel.style.borderRadius = `${radius}px`
          panel.style.boxShadow = `0 ${8 * shrinkP}px ${30 * shrinkP}px rgba(0,0,0,${0.6 * shrinkP})`
        } else if (dist >= 1) {
          // 未到：隐藏, 准备从下方入场
          panel.style.transform = 'translate(0, 30%) scale(0.95)'
          panel.style.opacity = '0'
          panel.style.zIndex = String(i)
          panel.style.borderRadius = '0px'
          panel.style.boxShadow = 'none'
        } else {
          // 正在入场 (0 <= dist < 1)
          const enterP = 1 - dist // 0→1
          const ty = 30 * (1 - enterP)
          const scale = 0.95 + 0.05 * enterP
          panel.style.transform = `translate(0, ${ty}%) scale(${scale})`
          panel.style.opacity = String(Math.min(1, enterP * 2))
          panel.style.zIndex = String(TOTAL)
          panel.style.borderRadius = '0px'
          panel.style.boxShadow = 'none'
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
  <div class="pip-page">
    <div id="pipProgress" class="pip-progress-bar"></div>
    <nav id="pipNav" class="pip-nav-dots"></nav>
    <div class="pip-indicator"><span class="pip-cur">1</span> / {{ TOTAL }}</div>
    <div id="pipArea" class="pip-scroll-area">
      <div class="pip-viewport">
        <section v-for="n in TOTAL" :key="n" class="pip-panel"
          :style="{ background: `linear-gradient(${140+(n-1)*20}deg, hsl(${(n-1)*44}, 50%, 30%), hsl(${(n-1)*44+20}, 38%, 16%))` }">
          <span class="pip-num">{{ String(n).padStart(2, '0') }}</span>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pip-page { font-family: system-ui, sans-serif; background: #08080f; color: #fff; }
.pip-scroll-area { position: relative; }
.pip-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.pip-panel {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: transform, opacity, border-radius; transform-origin: top left; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; pointer-events: none; }
}
.pip-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(255,255,255,0.05); user-select: none; pointer-events: none; }
</style>

<style lang="scss">
$accent: #3b82f6;
.pip-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #60a5fa); z-index: 1001; }
.pip-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.pip-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255,255,255,0.4); transform: scale(1.3); }
  &.pip-active { background: $accent; border-color: rgba(255,255,255,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.pip-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(0,0,0,0.4); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.75);
  .pip-cur { color: $accent; font-weight: 700; }
}
</style>

