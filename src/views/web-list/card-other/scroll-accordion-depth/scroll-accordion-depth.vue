<script setup lang="ts">
/**
 * ==================== Scroll Accordion Depth ====================
 * 手风琴纵深 —— 面板沿 Z 轴叠在一起(近大远小)，
 * 滚动驱动它们像手风琴一样沿 Z 轴展开/折叠，
 * 展开时每层往远处推，折叠时堆回近处
 * 核心：perspective 容器 + translateZ 驱动层级深度
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const Z_STEP = 250 // 每层 Z 间距(px)

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
    dot.className = 'ad-dot' + (i === 0 ? ' ad-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.ad-dot').forEach((d, i) => d.classList.toggle('ad-active', i === index))
  const el = document.querySelector('.ad-indicator .ad-cur')
  if (el) el.textContent = String(index + 1)
}

function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.5, ease: 'power2.inOut' })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) }
}

function init() {
  scrollArea = document.getElementById('adArea') as HTMLElement
  progressBar = document.getElementById('adProgress')
  navDots = document.getElementById('adNav')
  if (!scrollArea) return

  scrollArea.style.height = (TOTAL * 100) + 'vh'

  const panels = gsap.utils.toArray('.ad-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      // 焦点层索引(浮点)
      const focus = p * (TOTAL - 1)

      panels.forEach((panel, i) => {
        // 与焦点的距离
        const dist = i - focus
        // Z 位移：焦点层在 z=0，前面/后面的层依次推远
        const z = dist * Z_STEP
        // 越远越透明、越小
        const absDist = Math.abs(dist)
        const opacity = Math.max(0.05, 1 - absDist * 0.25)
        const scale = Math.max(0.3, 1 - absDist * 0.08)
        // 轻微 Y 偏移(远层偏上)
        const yShift = dist * 30

        panel.style.transform = `translateZ(${z}px) translateY(${yShift}px) scale(${scale})`
        panel.style.opacity = String(opacity)
        panel.style.zIndex = String(TOTAL - Math.round(absDist))
        panel.style.filter = absDist > 1.5 ? `blur(${Math.min(6, (absDist - 1.5) * 3)}px)` : 'none'
      })

      const idx = Math.round(focus)
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
      if (progressBar) progressBar.style.width = (p * 100) + '%'
    }
  })

  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  createNavDots()
  updateUI(0)
  document.addEventListener('keydown', onKeydown)
}

function destroy() {
  mainST?.kill(); mainST = null
  document.removeEventListener('keydown', onKeydown)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="ad-page">
    <div id="adProgress" class="ad-progress-bar"></div>
    <nav id="adNav" class="ad-nav-dots"></nav>
    <div class="ad-indicator"><span class="ad-cur">1</span> / {{ TOTAL }}</div>

    <div id="adArea" class="ad-scroll-area">
      <div class="ad-viewport">
        <div class="ad-stage">
          <section
            v-for="n in TOTAL"
            :key="n"
            class="ad-panel"
            :style="{
              background: `linear-gradient(145deg, hsl(${220 + (n-1)*18}, 40%, 12%), hsl(${220 + (n-1)*18 + 30}, 30%, 6%))`,
            }"
          >
            <span class="ad-num">{{ String(n).padStart(2, '0') }}</span>
            <div class="ad-depth-label">Z-{{ n }}</div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #06060e;
.ad-page { font-family: system-ui, -apple-system, sans-serif; background: $bg; color: #fff; }
.ad-scroll-area { position: relative; }
.ad-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh;
  overflow: hidden; perspective: 1400px;
}
.ad-stage {
  position: relative; width: 100%; height: 100%;
  transform-style: preserve-3d;
}
.ad-panel {
  position: absolute; inset: 8vh 8vw;
  border-radius: 20px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  will-change: transform, opacity, filter;
  backface-visibility: hidden;
  border: 1px solid rgba(255,255,255,.06);
  box-shadow: 0 8px 40px rgba(0,0,0,.4);
}
.ad-num {
  font-size: clamp(4rem, 10vw, 7rem); font-weight: 900;
  color: rgba(255,255,255,.05); user-select: none; pointer-events: none;
}
.ad-depth-label {
  position: absolute; bottom: 24px; right: 28px;
  font-size: .7rem; letter-spacing: 3px;
  color: rgba(255,255,255,.15); text-transform: uppercase;
}
</style>

<style lang="scss">
$accent: #6c8cff;
.ad-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $accent, #a78bfa); z-index: 1001;
}
.ad-nav-dots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 1000; display: flex; flex-direction: column; gap: 10px;
}
.ad-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,.12); cursor: pointer;
  border: 2px solid transparent; padding: 0; transition: all .3s;
  &:hover { background: rgba(255,255,255,.35); transform: scale(1.3); }
  &.ad-active { background: $accent; transform: scale(1.5); box-shadow: 0 0 12px rgba($accent,.5); }
}
.ad-indicator {
  position: fixed; top: 24px; right: 24px; z-index: 1000;
  background: rgba(0,0,0,.4); backdrop-filter: blur(10px);
  padding: 6px 16px; border-radius: 20px; font-size: .8rem;
  color: rgba(255,255,255,.65); border: 1px solid rgba(255,255,255,.08);
  .ad-cur { color: $accent; font-weight: 700; }
}
</style>

