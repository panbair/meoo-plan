<script setup lang="ts">
/**
 * ==================== Scroll Clock Wipe ====================
 * 时钟擦除 —— 像时钟指针一样旋转扫过，
 * 扫过的区域变成新面板(用 conic-gradient clip-path 实现)
 * 指针从12点方向顺时针扫一圈完成切换
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
    dot.className = 'clw-dot' + (i === 0 ? ' clw-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.clw-dot').forEach((d, i) => d.classList.toggle('clw-active', i === index))
  const el = document.querySelector('.clw-indicator .clw-cur')
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

// 用 conic-gradient 做的扇形 clip-path
// angle: 0~360 度，从12点方向顺时针
function conicClip(angleDeg: number): string {
  if (angleDeg <= 0) return 'polygon(50% 50%, 50% 50%, 50% 50%)'
  if (angleDeg >= 360) return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'

  // 用多边形逼近扇形
  const points: string[] = ['50% 50%', '50% 0%'] // 圆心 + 12点
  const rad = (d: number) => (d - 90) * Math.PI / 180

  if (angleDeg > 45) points.push('100% 0%')
  if (angleDeg > 135) points.push('100% 100%')
  if (angleDeg > 225) points.push('0% 100%')
  if (angleDeg > 315) points.push('0% 0%')

  // 终点
  const endRad = rad(angleDeg)
  const ex = 50 + Math.cos(endRad) * 70
  const ey = 50 + Math.sin(endRad) * 70
  points.push(`${ex}% ${ey}%`)

  return `polygon(${points.join(', ')})`
}

function init() {
  scrollArea = document.getElementById('clwArea') as HTMLElement
  progressBar = document.getElementById('clwProgress')
  navDots = document.getElementById('clwNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.clw-panel') as HTMLElement[]
  const hand = document.querySelector('.clw-hand') as HTMLElement

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)

      panels.forEach((panel, i) => {
        const dist = i - focus

        if (dist <= -1) {
          panel.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          panel.style.zIndex = String(i)
          panel.style.opacity = '1'
        } else if (dist >= 1) {
          panel.style.clipPath = 'polygon(50% 50%, 50% 50%, 50% 50%)'
          panel.style.zIndex = String(TOTAL + i)
          panel.style.opacity = '0'
        } else if (dist > 0) {
          // 正在被时钟擦出
          const p = 1 - dist
          const angle = p * 360
          panel.style.clipPath = conicClip(angle)
          panel.style.zIndex = String(TOTAL + i)
          panel.style.opacity = '1'
        } else {
          panel.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          panel.style.zIndex = String(i)
          panel.style.opacity = '1'
        }
      })

      // 时钟指针旋转
      if (hand) {
        const frac = focus % 1
        const angle = frac * 360
        hand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`
        hand.style.transformOrigin = 'bottom center'
        hand.style.opacity = frac > 0.01 && frac < 0.99 ? '1' : '0'
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
  <div class="clw-page">
    <div id="clwProgress" class="clw-progress-bar"></div>
    <nav id="clwNav" class="clw-nav-dots"></nav>
    <div class="clw-indicator"><span class="clw-cur">1</span> / {{ TOTAL }}</div>

    <!-- 时钟装饰 -->
    <div class="clw-clock-face">
      <div class="clw-center-dot"></div>
      <div class="clw-hand"></div>
      <!-- 12个刻度 -->
      <div v-for="h in 12" :key="h" class="clw-tick"
        :style="{ transform: `rotate(${h * 30}deg) translateY(-46vh)` }"></div>
    </div>

    <div id="clwArea" class="clw-scroll-area">
      <div class="clw-viewport">
        <section v-for="n in TOTAL" :key="n" class="clw-panel"
          :style="{ background: `linear-gradient(${(n-1)*45}deg, hsl(${(n-1)*44}, 50%, 28%), hsl(${(n-1)*44+20}, 38%, 86%))` }">
          <span class="clw-num">{{ String(n).padStart(2, '0') }}</span>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.clw-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.clw-scroll-area { position: relative; }
.clw-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.clw-panel {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: clip-path, opacity;
  &::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; pointer-events: none; }
}
.clw-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(26, 26, 46,0.05); user-select: none; pointer-events: none; }

/* 时钟装饰 */
.clw-clock-face {
  position: fixed; top: 50%; left: 50%; z-index: 500; pointer-events: none;
}
.clw-center-dot {
  position: absolute; top: -5px; left: -5px; width: 10px; height: 10px;
  border-radius: 50%; background: rgba(26, 26, 46,0.15);
}
.clw-hand {
  position: absolute; top: 0; left: 50%;
  width: 2px; height: 30vh;
  background: linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0.04));
  transform-origin: bottom center; opacity: 0; will-change: transform;
}
.clw-tick {
  position: absolute; top: 0; left: -0.5px;
  width: 1px; height: 8px; background: rgba(26, 26, 46,0.06);
  transform-origin: center 50vh;
}
</style>

<style lang="scss">
$accent: #eab308;
.clw-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #facc15); z-index: 1001; }
.clw-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.clw-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.clw-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.clw-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .clw-cur { color: $accent; font-weight: 700; }
}
</style>

