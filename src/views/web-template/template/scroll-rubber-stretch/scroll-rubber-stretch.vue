<script setup lang="ts">
/**
 * ==================== Scroll Rubber Stretch ====================
 * 橡皮拉伸 —— 面板像橡皮筋被拉扯变形：
 *   入场时从上方拉入，经过scaleY拉伸变形→弹回原位
 *   离场时被向下拉扯拉长→弹出屏幕
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
    dot.className = 'rbs-dot' + (i === 0 ? ' rbs-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.rbs-dot').forEach((d, i) => d.classList.toggle('rbs-active', i === index))
  const el = document.querySelector('.rbs-indicator .rbs-cur')
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

// 弹性缓动函数
function elasticOut(t: number): number {
  if (t === 0 || t === 1) return t
  return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1
}

function init() {
  scrollArea = document.getElementById('rbsArea') as HTMLElement
  progressBar = document.getElementById('rbsProgress')
  navDots = document.getElementById('rbsNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.rbs-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.3,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      panels.forEach((panel, i) => {
        const dist = i - focus

        if (dist <= -1) {
          panel.style.transform = 'translateY(0) scaleY(1) scaleX(1)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
        } else if (dist >= 1) {
          panel.style.transform = 'translateY(-100%) scaleY(0.6) scaleX(1.15)'
          panel.style.opacity = '0'
          panel.style.zIndex = String(TOTAL + i)
        } else if (dist > 0) {
          // 入场：从上方拉入+橡皮拉伸
          const rawP = 1 - dist // 0→1
          const eased = elasticOut(rawP)

          const yOff = -100 * (1 - rawP)
          // scaleY: 先被拉长(1.4)再弹回(1.0)
          const scaleY = 1 + (1 - eased) * 0.4
          // scaleX: 被压扁再弹回
          const scaleX = 1 - (1 - eased) * 0.12

          panel.style.transform = `translateY(${yOff}%) scaleY(${scaleY}) scaleX(${scaleX})`
          panel.style.opacity = String(Math.min(1, rawP * 2.5))
          panel.style.zIndex = String(TOTAL + i)
          panel.style.transformOrigin = 'center top'
        } else {
          // 已到位
          panel.style.transform = 'translateY(0) scaleY(1) scaleX(1)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
          panel.style.transformOrigin = 'center center'
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
  <div class="rbs-page">
    <div id="rbsProgress" class="rbs-progress-bar"></div>
    <nav id="rbsNav" class="rbs-nav-dots"></nav>
    <div class="rbs-indicator"><span class="rbs-cur">1</span> / {{ TOTAL }}</div>
    <div id="rbsArea" class="rbs-scroll-area">
      <div class="rbs-viewport">
        <section v-for="n in TOTAL" :key="n" class="rbs-panel"
          :style="{ background: `linear-gradient(180deg, hsl(${(n-1)*44}, 50%, 30%), hsl(${(n-1)*44+20}, 38%, 16%))` }">
          <span class="rbs-num">{{ String(n).padStart(2, '0') }}</span>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rbs-page { font-family: system-ui, sans-serif; background: #08080f; color: #fff; }
.rbs-scroll-area { position: relative; }
.rbs-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.rbs-panel {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: transform, opacity;
  &::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; pointer-events: none; }
}
.rbs-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(255,255,255,0.05); user-select: none; pointer-events: none; }
</style>

<style lang="scss">
$accent: #f97316;
.rbs-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #eab308); z-index: 1001; }
.rbs-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.rbs-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255,255,255,0.4); transform: scale(1.3); }
  &.rbs-active { background: $accent; border-color: rgba(255,255,255,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.rbs-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(0,0,0,0.4); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.75);
  .rbs-cur { color: $accent; font-weight: 700; }
}
</style>

