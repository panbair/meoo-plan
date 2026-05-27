<script setup lang="ts">
/**
 * ==================== Scroll Bullet Screen ====================
 * 弹幕穿越 —— 面板被切成多条横条，像弹幕一样从右向左飞入：
 *   每条有不同速度和高度，形成弹幕密集飞过的效果
 *   先到的条带先就位，最终拼合成完整面板
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const STRIPS = 8 // 横条数量
// 每条的速度/延迟预设(模拟弹幕随机性)
const STRIP_CONFIGS = [
  { speed: 1.6, yJitter: -8 },
  { speed: 1.0, yJitter: 5 },
  { speed: 2.0, yJitter: -3 },
  { speed: 0.8, yJitter: 10 },
  { speed: 1.4, yJitter: -12 },
  { speed: 1.1, yJitter: 7 },
  { speed: 1.8, yJitter: -5 },
  { speed: 0.9, yJitter: 3 },
]

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
    dot.className = 'blt-dot' + (i === 0 ? ' blt-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.blt-dot').forEach((d, i) => d.classList.toggle('blt-active', i === index))
  const el = document.querySelector('.blt-indicator .blt-cur')
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
  scrollArea = document.getElementById('bltArea') as HTMLElement
  progressBar = document.getElementById('bltProgress')
  navDots = document.getElementById('bltNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const groups = gsap.utils.toArray('.blt-group') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.3,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      groups.forEach((group, i) => {
        const dist = i - focus
        const strips = group.querySelectorAll('.blt-strip') as NodeListOf<HTMLElement>

        strips.forEach((strip, si) => {
          const cfg = STRIP_CONFIGS[si % STRIP_CONFIGS.length]
          if (dist <= -1) {
            strip.style.transform = 'translateX(0) translateY(0)'
            strip.style.opacity = '1'
          } else if (dist >= 1) {
            strip.style.transform = `translateX(120%) translateY(${cfg.yJitter}px)`
            strip.style.opacity = '0'
          } else if (dist > 0) {
            const rawP = 1 - dist
            const stripP = Math.max(0, Math.min(1, rawP * cfg.speed))
            const xOff = 120 * (1 - stripP)
            const yOff = cfg.yJitter * (1 - stripP)
            strip.style.transform = `translateX(${xOff}%) translateY(${yOff}px)`
            strip.style.opacity = String(Math.min(1, stripP * 2))
          } else {
            strip.style.transform = 'translateX(0) translateY(0)'
            strip.style.opacity = '1'
          }
        })
        group.style.zIndex = dist > 0 ? String(TOTAL + i) : String(i)
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
  <div class="blt-page">
    <div id="bltProgress" class="blt-progress-bar"></div>
    <nav id="bltNav" class="blt-nav-dots"></nav>
    <div class="blt-indicator"><span class="blt-cur">1</span> / {{ TOTAL }}</div>
    <div id="bltArea" class="blt-scroll-area">
      <div class="blt-viewport">
        <div v-for="n in TOTAL" :key="n" class="blt-group">
          <div
            v-for="s in STRIPS" :key="s"
            class="blt-strip"
            :style="{
              top: ((s - 1) / STRIPS * 100) + '%',
              height: (100 / STRIPS) + '%',
              background: `linear-gradient(90deg, hsl(${(n-1)*44}, ${48 + (s%3)*4}%, ${24 + (s%4)*3}%) 0%, hsl(${(n-1)*44+15}, ${40 + (s%3)*4}%, ${16 + (s%4)*2}%) 100%)`,
            }"
          >
            <span v-if="s === Math.ceil(STRIPS / 2)" class="blt-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blt-page { font-family: system-ui, sans-serif; background: #060610; color: #fff; }
.blt-scroll-area { position: relative; }
.blt-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.blt-group { position: absolute; inset: 0; }
.blt-strip {
  position: absolute; left: 0; width: 100%; will-change: transform, opacity;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.blt-num { font-size: clamp(4rem, 10vw, 8rem); font-weight: 900; color: rgba(255,255,255,0.05); user-select: none; pointer-events: none; }
</style>

<style lang="scss">
$accent: #f43f5e;
.blt-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #fb7185); z-index: 1001; }
.blt-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.blt-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255,255,255,0.4); transform: scale(1.3); }
  &.blt-active { background: $accent; border-color: rgba(255,255,255,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.blt-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(0,0,0,0.4); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.75);
  .blt-cur { color: $accent; font-weight: 700; }
}
</style>

