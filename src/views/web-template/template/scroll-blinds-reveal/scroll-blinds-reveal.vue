<script setup lang="ts">
/**
 * ==================== Scroll Blinds Reveal ====================
 * 百叶窗 —— 面板被切成6条横条，奇数条从左滑入，偶数条从右滑入，
 * 拼合成完整面板。像百叶窗叶片合拢。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const SLATS = 6
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
    dot.className = 'bld-dot' + (i === 0 ? ' bld-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.bld-dot').forEach((d, i) => d.classList.toggle('bld-active', i === index))
  const el = document.querySelector('.bld-indicator .bld-cur')
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
  scrollArea = document.getElementById('bldArea') as HTMLElement
  progressBar = document.getElementById('bldProgress')
  navDots = document.getElementById('bldNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const groups = gsap.utils.toArray('.bld-group') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      groups.forEach((group, i) => {
        const dist = i - focus
        const slats = group.querySelectorAll('.bld-slat') as NodeListOf<HTMLElement>

        slats.forEach((slat, s) => {
          const fromLeft = s % 2 === 0
          // 每条叶片有不同的延迟
          const delay = s * 0.08

          if (dist <= -1) {
            slat.style.transform = 'translateX(0)'
            slat.style.opacity = '1'
          } else if (dist >= 1) {
            const xOff = fromLeft ? -110 : 110
            slat.style.transform = `translateX(${xOff}%)`
            slat.style.opacity = '0'
          } else if (dist > 0) {
            const rawProg = 1 - dist
            const slatProg = Math.max(0, Math.min(1, (rawProg - delay) / (1 - delay * SLATS + delay)))
            const xOff = (fromLeft ? -110 : 110) * (1 - slatProg)
            slat.style.transform = `translateX(${xOff}%)`
            slat.style.opacity = String(Math.min(1, slatProg * 2))
          } else {
            slat.style.transform = 'translateX(0)'
            slat.style.opacity = '1'
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
  <div class="bld-page">
    <div id="bldProgress" class="bld-progress-bar"></div>
    <nav id="bldNav" class="bld-nav-dots"></nav>
    <div class="bld-indicator"><span class="bld-cur">1</span> / {{ TOTAL }}</div>
    <div id="bldArea" class="bld-scroll-area">
      <div class="bld-viewport">
        <div v-for="n in TOTAL" :key="n" class="bld-group">
          <div
            v-for="s in SLATS" :key="s"
            class="bld-slat"
            :style="{
              top: ((s - 1) / SLATS * 100) + '%',
              height: (100 / SLATS) + '%',
              background: `linear-gradient(${90 + (s % 2 === 0 ? 0 : 180)}deg, hsl(${(n-1)*44}, 50%, ${28 + s}%) 0%, hsl(${(n-1)*44+20}, 38%, ${14 + s}%) 100%)`,
            }"
          >
            <span v-if="s === Math.ceil(SLATS / 2)" class="bld-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bld-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.bld-scroll-area { position: relative; }
.bld-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.bld-group { position: absolute; inset: 0; }
.bld-slat {
  position: absolute; left: 0; width: 100%; will-change: transform, opacity; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  border-top: 1px solid rgba(255,255,255,0.02);
}
.bld-num { font-size: clamp(4rem, 10vw, 8rem); font-weight: 900; color: rgba(26, 26, 46,0.05); user-select: none; pointer-events: none; }
</style>

<style lang="scss">
$accent: #06b6d4;
.bld-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #0284c7); z-index: 1001; }
.bld-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.bld-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.bld-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.bld-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .bld-cur { color: $accent; font-weight: 700; }
}
</style>

