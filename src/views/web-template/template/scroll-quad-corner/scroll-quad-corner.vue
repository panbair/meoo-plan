<script setup lang="ts">
/**
 * ==================== Scroll Quad Corner ====================
 * 四角汇聚 —— 面板拆成4块(左上/右上/左下/右下)，
 * 分别从四个角飞入中央拼合成完整面板
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
    dot.className = 'qdc-dot' + (i === 0 ? ' qdc-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.qdc-dot').forEach((d, i) => d.classList.toggle('qdc-active', i === index))
  const el = document.querySelector('.qdc-indicator .qdc-cur')
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
  scrollArea = document.getElementById('qdcArea') as HTMLElement
  progressBar = document.getElementById('qdcProgress')
  navDots = document.getElementById('qdcNav')
  if (!scrollArea) return

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const groups = gsap.utils.toArray('.qdc-group') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      groups.forEach((group, i) => {
        const dist = i - focus
        const tl = group.querySelector('.qdc-tl') as HTMLElement
        const tr = group.querySelector('.qdc-tr') as HTMLElement
        const bl = group.querySelector('.qdc-bl') as HTMLElement
        const br = group.querySelector('.qdc-br') as HTMLElement
        if (!tl || !tr || !bl || !br) return

        if (dist <= -1) {
          tl.style.transform = 'translate(0,0)'; tr.style.transform = 'translate(0,0)'
          bl.style.transform = 'translate(0,0)'; br.style.transform = 'translate(0,0)'
          group.style.zIndex = String(i); group.style.opacity = '1'
        } else if (dist >= 1) {
          tl.style.transform = 'translate(-100%,-100%)'; tr.style.transform = 'translate(100%,-100%)'
          bl.style.transform = 'translate(-100%,100%)'; br.style.transform = 'translate(100%,100%)'
          group.style.zIndex = String(TOTAL + i); group.style.opacity = '0'
        } else if (dist > 0) {
          const p = 1 - dist
          const off = 100 * (1 - p)
          tl.style.transform = `translate(${-off}%,${-off}%)`
          tr.style.transform = `translate(${off}%,${-off}%)`
          bl.style.transform = `translate(${-off}%,${off}%)`
          br.style.transform = `translate(${off}%,${off}%)`
          group.style.zIndex = String(TOTAL + i)
          group.style.opacity = String(Math.min(1, p * 2))
        } else {
          tl.style.transform = 'translate(0,0)'; tr.style.transform = 'translate(0,0)'
          bl.style.transform = 'translate(0,0)'; br.style.transform = 'translate(0,0)'
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
  <div class="qdc-page">
    <div id="qdcProgress" class="qdc-progress-bar"></div>
    <nav id="qdcNav" class="qdc-nav-dots"></nav>
    <div class="qdc-indicator"><span class="qdc-cur">1</span> / {{ TOTAL }}</div>
    <div id="qdcArea" class="qdc-scroll-area">
      <div class="qdc-viewport">
        <!-- 十字线装饰 -->
        <div class="qdc-cross-h"></div>
        <div class="qdc-cross-v"></div>

        <div v-for="n in TOTAL" :key="n" class="qdc-group">
          <!-- 四个象限 -->
          <div class="qdc-quad qdc-tl"
            :style="{ background: `linear-gradient(135deg, hsl(${(n-1)*44}, 52%, 32%), hsl(${(n-1)*44+15}, 40%, 18%))` }">
            <span class="qdc-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
          <div class="qdc-quad qdc-tr"
            :style="{ background: `linear-gradient(225deg, hsl(${(n-1)*44+5}, 48%, 72%), hsl(${(n-1)*44+20}, 38%, 84%))` }">
          </div>
          <div class="qdc-quad qdc-bl"
            :style="{ background: `linear-gradient(45deg, hsl(${(n-1)*44+10}, 46%, 28%), hsl(${(n-1)*44+25}, 36%, 15%))` }">
          </div>
          <div class="qdc-quad qdc-br"
            :style="{ background: `linear-gradient(315deg, hsl(${(n-1)*44+15}, 44%, 26%), hsl(${(n-1)*44+30}, 34%, 86%))` }">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.qdc-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.qdc-scroll-area { position: relative; }
.qdc-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }

.qdc-group { position: absolute; inset: 0; will-change: opacity; }

.qdc-quad {
  position: absolute; display: flex; align-items: center; justify-content: center; will-change: transform;
  overflow: hidden;
}
.qdc-tl { top: 0; left: 0; width: 50%; height: 50%; }
.qdc-tr { top: 0; right: 0; width: 50%; height: 50%; }
.qdc-bl { bottom: 0; left: 0; width: 50%; height: 50%; }
.qdc-br { bottom: 0; right: 0; width: 50%; height: 50%; }

.qdc-num {
  font-size: clamp(4rem, 10vw, 8rem); font-weight: 900;
  color: rgba(26, 26, 46,0.05); user-select: none; pointer-events: none;
  /* 数字在左上角象限，但视觉上居中于整个屏幕 */
  position: absolute; bottom: 0; right: 0;
  transform: translate(50%, 50%);
}

/* 十字线装饰 */
.qdc-cross-h, .qdc-cross-v { position: fixed; z-index: 500; pointer-events: none; background: rgba(26, 26, 46,0.03); }
.qdc-cross-h { left: 0; right: 0; top: 50%; height: 1px; }
.qdc-cross-v { top: 0; bottom: 0; left: 50%; width: 1px; }
</style>

<style lang="scss">
$accent: #ec4899;
.qdc-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #8b5cf6); z-index: 1001; }
.qdc-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.qdc-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.qdc-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.qdc-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .qdc-cur { color: $accent; font-weight: 700; }
}
</style>

