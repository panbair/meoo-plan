<script setup lang="ts">
/**
 * ==================== Scroll Film Reel ====================
 * 胶片卷轴 —— 面板像电影胶片在放映机中纵向滚过：
 *   所有面板连成一长条"胶卷"
 *   当前帧在视口中央，上下帧略可见
 *   两侧有胶片齿孔装饰，带微微晃动
 *   胶片边框+帧号
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const FRAME_GAP = 12 // px 帧间距

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
    dot.className = 'flm-dot' + (i === 0 ? ' flm-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.flm-dot').forEach((d, i) => d.classList.toggle('flm-active', i === index))
  const el = document.querySelector('.flm-indicator .flm-cur')
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
  scrollArea = document.getElementById('flmArea') as HTMLElement
  progressBar = document.getElementById('flmProgress')
  navDots = document.getElementById('flmNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const strip = document.querySelector('.flm-strip') as HTMLElement
  const frames = gsap.utils.toArray('.flm-frame') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)

      // 整条胶片向上移动
      if (strip) {
        const frameH = window.innerHeight * 0.7
        const totalH = TOTAL * (frameH + FRAME_GAP)
        const offsetY = focus * (frameH + FRAME_GAP)
        strip.style.transform = `translateY(${-offsetY}px)`
      }

      // 当前帧高亮
      frames.forEach((frame, i) => {
        const dist = Math.abs(i - focus)
        const brightness = Math.max(0.3, 1 - dist * 0.4)
        const scale = Math.max(0.92, 1 - dist * 0.03)
        frame.style.filter = `brightness(${brightness})`
        frame.style.transform = `scale(${scale})`
      })

      // 胶片晃动(微抖)
      const jitter = Math.sin(focus * Math.PI * 6) * 0.5
      if (strip) {
        strip.style.marginLeft = `${jitter}px`
      }

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
  <div class="flm-page">
    <div id="flmProgress" class="flm-progress-bar"></div>
    <nav id="flmNav" class="flm-nav-dots"></nav>
    <div class="flm-indicator"><span class="flm-cur">1</span> / {{ TOTAL }}</div>

    <!-- 放映机投光口装饰 -->
    <div class="flm-gate-top"></div>
    <div class="flm-gate-bot"></div>

    <div id="flmArea" class="flm-scroll-area">
      <div class="flm-viewport">
        <div class="flm-strip">
          <div v-for="n in TOTAL" :key="n" class="flm-frame"
            :style="{ background: `linear-gradient(180deg, hsl(${(n-1)*44}, 35%, 18%), hsl(${(n-1)*44+20}, 28%, 90%))` }">
            <!-- 帧内容 -->
            <div class="flm-content">
              <span class="flm-num">{{ String(n).padStart(2, '0') }}</span>
            </div>
            <!-- 帧边框 -->
            <div class="flm-border"></div>
            <!-- 帧号 -->
            <div class="flm-frame-id">{{ n }}A</div>
            <!-- 左侧齿孔 -->
            <div class="flm-perfs flm-perfs-l">
              <div v-for="p in 6" :key="p" class="flm-perf"></div>
            </div>
            <!-- 右侧齿孔 -->
            <div class="flm-perfs flm-perfs-r">
              <div v-for="p in 6" :key="p" class="flm-perf"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flm-page { font-family: 'Courier New', monospace; background: #f5f0f8; color: #1a1a2e; }
.flm-scroll-area { position: relative; }
.flm-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}

.flm-strip {
  display: flex; flex-direction: column; gap: 12px; will-change: transform;
  padding: 15vh 0;
}

.flm-frame {
  position: relative; width: 60vw; max-width: 700px; height: 70vh;
  border-radius: 4px; will-change: transform, filter; flex-shrink: 0;
  margin: 0 auto;
}

.flm-content {
  position: absolute; inset: 8px 40px; display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.04); border-radius: 2px;
}

.flm-num { font-size: clamp(4rem, 10vw, 8rem); font-weight: 300; color: rgba(26, 26, 46,0.05); user-select: none; }

.flm-border {
  position: absolute; inset: 4px 36px; border: 2px solid rgba(255,255,255,0.04); border-radius: 2px; pointer-events: none;
}

.flm-frame-id {
  position: absolute; bottom: 12px; right: 44px; font-size: 0.6rem;
  color: rgba(26, 26, 46,0.08); letter-spacing: 2px;
}

/* 齿孔 */
.flm-perfs {
  position: absolute; top: 0; bottom: 0; width: 28px;
  display: flex; flex-direction: column; justify-content: space-evenly;
  align-items: center;
}
.flm-perfs-l { left: 4px; }
.flm-perfs-r { right: 4px; }
.flm-perf {
  width: 14px; height: 10px; border-radius: 2px;
  background: rgba(26, 26, 46,0.03); border: 1px solid rgba(255,255,255,0.04);
}

/* 放映机遮光框 */
.flm-gate-top, .flm-gate-bot {
  position: fixed; left: 0; right: 0; z-index: 100; pointer-events: none;
  background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent);
}
.flm-gate-top { top: 0; height: 12vh; }
.flm-gate-bot { bottom: 0; height: 12vh; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); }
</style>

<style lang="scss">
$accent: #d4d4d4;
.flm-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #888, #ccc); z-index: 1001; }
.flm-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.flm-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.flm-active { background: $accent; border-color: rgba(26, 26, 46,0.3); transform: scale(1.5); box-shadow: 0 0 10px rgba(255,255,255,0.2); }
}
.flm-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.08); color: rgba(26, 26, 46,0.5);
  .flm-cur { color: $accent; font-weight: 700; }
}
</style>

