<script setup lang="ts">
/**
 * ==================== Scroll Radar Scan ====================
 * 雷达扫描 —— 雷达扫描线从12点方向顺时针旋转，
 * 扫描线经过的区域逐渐亮起/揭示新面板内容
 * 扫描线后方留下渐隐的余晖尾迹
 *
 * 与时钟擦除不同：雷达有同心圆、网格线、余晖拖尾、脉冲点
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
    dot.className = 'rdr-dot' + (i === 0 ? ' rdr-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.rdr-dot').forEach((d, i) => d.classList.toggle('rdr-active', i === index))
  const el = document.querySelector('.rdr-indicator .rdr-cur')
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

// 扇形 clip-path(同 clock-wipe 但用于雷达)
function conicClip(angleDeg: number): string {
  if (angleDeg <= 0) return 'polygon(50% 50%, 50% 50%, 50% 50%)'
  if (angleDeg >= 360) return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
  const points: string[] = ['50% 50%', '50% 0%']
  const rad = (d: number) => (d - 90) * Math.PI / 180
  if (angleDeg > 45) points.push('100% 0%')
  if (angleDeg > 135) points.push('100% 100%')
  if (angleDeg > 225) points.push('0% 100%')
  if (angleDeg > 315) points.push('0% 0%')
  const endRad = rad(angleDeg)
  points.push(`${50 + Math.cos(endRad) * 71}% ${50 + Math.sin(endRad) * 71}%`)
  return `polygon(${points.join(', ')})`
}

function init() {
  scrollArea = document.getElementById('rdrArea') as HTMLElement
  progressBar = document.getElementById('rdrProgress')
  navDots = document.getElementById('rdrNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.rdr-panel') as HTMLElement[]
  const sweepLine = document.querySelector('.rdr-sweep') as HTMLElement
  const sweepGlow = document.querySelector('.rdr-sweep-glow') as HTMLElement

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      panels.forEach((panel, i) => {
        const dist = i - focus
        if (dist <= -1) {
          panel.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          panel.style.zIndex = String(i); panel.style.opacity = '1'
        } else if (dist >= 1) {
          panel.style.clipPath = 'polygon(50% 50%, 50% 50%, 50% 50%)'
          panel.style.zIndex = String(TOTAL + i); panel.style.opacity = '0'
        } else if (dist > 0) {
          const p = 1 - dist
          panel.style.clipPath = conicClip(p * 360)
          panel.style.zIndex = String(TOTAL + i); panel.style.opacity = '1'
        } else {
          panel.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          panel.style.zIndex = String(i); panel.style.opacity = '1'
        }
      })
      // 扫描线旋转
      const frac = focus % 1
      const angle = frac * 360
      if (sweepLine) {
        sweepLine.style.transform = `rotate(${angle}deg)`
        sweepLine.style.opacity = frac > 0.01 && frac < 0.99 ? '1' : '0'
      }
      if (sweepGlow) {
        sweepGlow.style.background = `conic-gradient(from ${angle - 40}deg at 50% 50%, transparent 0deg, rgba(0,255,100,0.08) 30deg, rgba(0,255,100,0.02) 40deg, transparent 41deg)`
        sweepGlow.style.opacity = frac > 0.01 && frac < 0.99 ? '1' : '0'
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
  <div class="rdr-page">
    <div id="rdrProgress" class="rdr-progress-bar"></div>
    <nav id="rdrNav" class="rdr-nav-dots"></nav>
    <div class="rdr-indicator"><span class="rdr-cur">1</span> / {{ TOTAL }}</div>

    <!-- 雷达装饰 -->
    <div class="rdr-overlay">
      <div class="rdr-ring rdr-ring-1"></div>
      <div class="rdr-ring rdr-ring-2"></div>
      <div class="rdr-ring rdr-ring-3"></div>
      <div class="rdr-crosshair-h"></div>
      <div class="rdr-crosshair-v"></div>
      <div class="rdr-center-dot"></div>
      <div class="rdr-sweep"></div>
      <div class="rdr-sweep-glow"></div>
    </div>

    <div id="rdrArea" class="rdr-scroll-area">
      <div class="rdr-viewport">
        <section v-for="n in TOTAL" :key="n" class="rdr-panel"
          :style="{ background: `radial-gradient(circle at 50% 50%, hsl(${(n-1)*44+120}, 40%, 20%), hsl(${(n-1)*44+140}, 30%, 8%))` }">
          <span class="rdr-num">{{ String(n).padStart(2, '0') }}</span>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rdr-page { font-family: 'Courier New', monospace; background: #020a04; color: #0f0; }
.rdr-scroll-area { position: relative; }
.rdr-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.rdr-panel {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: clip-path, opacity;
}
.rdr-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 300; color: rgba(0,255,80,0.05); user-select: none; pointer-events: none; }

.rdr-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 500; }

.rdr-ring {
  position: absolute; top: 50%; left: 50%; border-radius: 50%; border: 1px solid rgba(0,255,80,0.06);
  transform: translate(-50%, -50%);
}
.rdr-ring-1 { width: 30vmin; height: 30vmin; }
.rdr-ring-2 { width: 55vmin; height: 55vmin; }
.rdr-ring-3 { width: 80vmin; height: 80vmin; }

.rdr-crosshair-h, .rdr-crosshair-v { position: absolute; background: rgba(0,255,80,0.03); }
.rdr-crosshair-h { top: 50%; left: 0; right: 0; height: 1px; }
.rdr-crosshair-v { left: 50%; top: 0; bottom: 0; width: 1px; }

.rdr-center-dot {
  position: absolute; top: 50%; left: 50%; width: 6px; height: 6px;
  border-radius: 50%; background: rgba(0,255,80,0.3); transform: translate(-50%, -50%);
}

.rdr-sweep {
  position: absolute; top: 50%; left: 50%; width: 1px; height: 40vmin;
  background: linear-gradient(to top, rgba(0,255,80,0.4), rgba(0,255,80,0.02));
  transform-origin: bottom center; will-change: transform; opacity: 0;
}

.rdr-sweep-glow {
  position: absolute; inset: 0; border-radius: 50%; will-change: background; opacity: 0;
}
</style>

<style lang="scss">
$accent: #22c55e;
.rdr-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #4ade80); z-index: 1001; }
.rdr-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.rdr-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(0,255,80,0.4); transform: scale(1.3); }
  &.rdr-active { background: $accent; border-color: rgba(0,255,80,0.4); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.rdr-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(0,10,4,0.6); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(0,255,80,0.1); color: rgba(0,255,80,0.7);
  .rdr-cur { color: $accent; font-weight: 700; }
}
</style>

