<script setup lang="ts">
/**
 * ==================== Scroll Parallax Split ====================
 * 视差劈屏 —— 面板分成左右两半，各含视差层
 * 左半从左滑入(结构层快+装饰层慢)，右半从右滑入(相反速度)
 * 两半到中间拼合，内部视差层继续以不同速度微动
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
    dot.className = 'psp-dot' + (i === 0 ? ' psp-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.psp-dot').forEach((d, i) => d.classList.toggle('psp-active', i === index))
  const el = document.querySelector('.psp-indicator .psp-cur')
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
  scrollArea = document.getElementById('pspArea') as HTMLElement
  progressBar = document.getElementById('pspProgress')
  navDots = document.getElementById('pspNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const groups = gsap.utils.toArray('.psp-group') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      groups.forEach((group, i) => {
        const dist = i - focus
        const leftHalf = group.querySelector('.psp-left') as HTMLElement
        const rightHalf = group.querySelector('.psp-right') as HTMLElement
        const leftInner = group.querySelector('.psp-left .psp-inner') as HTMLElement
        const rightInner = group.querySelector('.psp-right .psp-inner') as HTMLElement
        if (!leftHalf || !rightHalf) return

        if (dist <= -1) {
          leftHalf.style.transform = 'translateX(0)'; rightHalf.style.transform = 'translateX(0)'
          if (leftInner) leftInner.style.transform = 'translateX(0)'
          if (rightInner) rightInner.style.transform = 'translateX(0)'
          group.style.zIndex = String(i); group.style.opacity = '1'
        } else if (dist >= 1) {
          leftHalf.style.transform = 'translateX(-120%)'; rightHalf.style.transform = 'translateX(120%)'
          if (leftInner) leftInner.style.transform = 'translateX(-30%)'
          if (rightInner) rightInner.style.transform = 'translateX(30%)'
          group.style.zIndex = String(TOTAL + i); group.style.opacity = '0'
        } else if (dist > 0) {
          const p = 1 - dist
          // 外壳滑入
          leftHalf.style.transform = `translateX(${-120 * (1 - p)}%)`
          rightHalf.style.transform = `translateX(${120 * (1 - p)}%)`
          // 内层视差(比外壳更慢)
          const innerLag = Math.max(0, p - 0.2) / 0.8
          if (leftInner) leftInner.style.transform = `translateX(${-30 * (1 - innerLag)}%)`
          if (rightInner) rightInner.style.transform = `translateX(${30 * (1 - innerLag)}%)`
          group.style.zIndex = String(TOTAL + i)
          group.style.opacity = String(Math.min(1, p * 2))
        } else {
          leftHalf.style.transform = 'translateX(0)'; rightHalf.style.transform = 'translateX(0)'
          if (leftInner) leftInner.style.transform = 'translateX(0)'
          if (rightInner) rightInner.style.transform = 'translateX(0)'
          group.style.zIndex = String(i); group.style.opacity = '1'
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
  <div class="psp-page">
    <div id="pspProgress" class="psp-progress-bar"></div>
    <nav id="pspNav" class="psp-nav-dots"></nav>
    <div class="psp-indicator"><span class="psp-cur">1</span> / {{ TOTAL }}</div>
    <div id="pspArea" class="psp-scroll-area">
      <div class="psp-viewport">
        <div v-for="n in TOTAL" :key="n" class="psp-group">
          <!-- 左半 -->
          <div class="psp-half psp-left"
            :style="{ background: `linear-gradient(90deg, hsl(${(n-1)*44}, 50%, 28%), hsl(${(n-1)*44+10}, 42%, 80%))` }">
            <div class="psp-inner">
              <div class="psp-deco psp-deco-circle" :style="{ borderColor: `hsla(${(n-1)*44+20}, 50%, 75%,0.08)` }"></div>
            </div>
          </div>
          <!-- 右半 -->
          <div class="psp-half psp-right"
            :style="{ background: `linear-gradient(270deg, hsl(${(n-1)*44+10}, 48%, 26%), hsl(${(n-1)*44+20}, 40%, 18%))` }">
            <div class="psp-inner">
              <span class="psp-num">{{ String(n).padStart(2, '0') }}</span>
            </div>
          </div>
          <!-- 中缝线 -->
          <div class="psp-seam"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.psp-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.psp-scroll-area { position: relative; }
.psp-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.psp-group { position: absolute; inset: 0; will-change: opacity; }

.psp-half { position: absolute; top: 0; height: 100%; width: 50%; will-change: transform; overflow: hidden; }
.psp-left { left: 0; }
.psp-right { right: 0; }

.psp-inner { position: absolute; inset: 0; will-change: transform; display: flex; align-items: center; justify-content: center; }

.psp-num { font-size: clamp(4rem, 10vw, 8rem); font-weight: 900; color: rgba(26, 26, 46,0.06); user-select: none; pointer-events: none; }

.psp-deco { position: absolute; pointer-events: none; }
.psp-deco-circle { width: 40vw; height: 40vw; max-width: 350px; max-height: 350px; border-radius: 50%; border: 1px solid; left: 50%; top: 50%; transform: translate(-50%, -50%); }

.psp-seam { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(26, 26, 46,0.03); pointer-events: none; z-index: 10; }
</style>

<style lang="scss">
$accent: #0ea5e9;
.psp-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #38bdf8); z-index: 1001; }
.psp-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.psp-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.psp-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.psp-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .psp-cur { color: $accent; font-weight: 700; }
}
</style>

