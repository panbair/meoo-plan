<script setup lang="ts">
/**
 * ==================== Scroll Magnet Assemble ====================
 * 磁铁拼装 —— 面板被切成12块碎片，碎片从四面八方飞来
 * 像被磁铁吸引一样汇聚到各自位置，拼合成完整面板
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const COLS = 4
const ROWS = 3
const PIECES = COLS * ROWS

// 每块碎片的散射起始位置(模拟从四面八方飞来)
function getScatterPos(index: number): { x: number; y: number; rot: number } {
  const angle = (index / PIECES) * Math.PI * 2 + index * 0.7
  const distance = 120 + (index % 3) * 40
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rot: (index % 2 === 0 ? 1 : -1) * (30 + index * 15),
  }
}

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
    dot.className = 'mga-dot' + (i === 0 ? ' mga-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.mga-dot').forEach((d, i) => d.classList.toggle('mga-active', i === index))
  const el = document.querySelector('.mga-indicator .mga-cur')
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
  scrollArea = document.getElementById('mgaArea') as HTMLElement
  progressBar = document.getElementById('mgaProgress')
  navDots = document.getElementById('mgaNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const groups = gsap.utils.toArray('.mga-group') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      groups.forEach((group, i) => {
        const dist = i - focus
        const pieces = group.querySelectorAll('.mga-piece') as NodeListOf<HTMLElement>

        pieces.forEach((piece, pi) => {
          const scatter = getScatterPos(pi)
          // 从外向内的延迟：边缘碎片先到(像被磁铁吸,近的后到)
          const col = pi % COLS
          const row = Math.floor(pi / COLS)
          const centerDist = Math.sqrt(Math.pow(col - (COLS-1)/2, 2) + Math.pow(row - (ROWS-1)/2, 2))
          const maxCD = Math.sqrt(Math.pow((COLS-1)/2, 2) + Math.pow((ROWS-1)/2, 2))
          const delay = (1 - centerDist / maxCD) * 0.35 // 边缘先到

          if (dist <= -1) {
            piece.style.transform = 'translate(0,0) rotate(0deg) scale(1)'
            piece.style.opacity = '1'
          } else if (dist >= 1) {
            piece.style.transform = `translate(${scatter.x}%, ${scatter.y}%) rotate(${scatter.rot}deg) scale(0.5)`
            piece.style.opacity = '0'
          } else if (dist > 0) {
            const rawP = 1 - dist
            const pieceP = Math.max(0, Math.min(1, (rawP - delay) / (1 - delay)))
            // 磁铁吸引效果：先慢后快(easeInQuad)
            const eased = pieceP * pieceP
            const tx = scatter.x * (1 - eased)
            const ty = scatter.y * (1 - eased)
            const rot = scatter.rot * (1 - eased)
            const scale = 0.5 + 0.5 * eased
            piece.style.transform = `translate(${tx}%, ${ty}%) rotate(${rot}deg) scale(${scale})`
            piece.style.opacity = String(Math.min(1, rawP * 2.5))
          } else {
            piece.style.transform = 'translate(0,0) rotate(0deg) scale(1)'
            piece.style.opacity = '1'
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
  <div class="mga-page">
    <div id="mgaProgress" class="mga-progress-bar"></div>
    <nav id="mgaNav" class="mga-nav-dots"></nav>
    <div class="mga-indicator"><span class="mga-cur">1</span> / {{ TOTAL }}</div>
    <div id="mgaArea" class="mga-scroll-area">
      <div class="mga-viewport">
        <div v-for="n in TOTAL" :key="n" class="mga-group">
          <div
            v-for="p in PIECES" :key="p"
            class="mga-piece"
            :style="{
              left: ((p - 1) % COLS) * (100 / COLS) + '%',
              top: Math.floor((p - 1) / COLS) * (100 / ROWS) + '%',
              width: (100 / COLS) + '%',
              height: (100 / ROWS) + '%',
              background: `hsl(${(n-1)*44 + ((p-1)%5)*3}, ${50 - ((p-1)%3)*4}%, ${26 + ((p-1)%4)*3}%)`,
            }"
          >
            <span v-if="p === Math.ceil(PIECES / 2)" class="mga-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mga-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.mga-scroll-area { position: relative; }
.mga-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.mga-group { position: absolute; inset: 0; }
.mga-piece {
  position: absolute; will-change: transform, opacity; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.02);
}
.mga-num { font-size: clamp(3rem, 8vw, 6rem); font-weight: 900; color: rgba(26, 26, 46,0.06); user-select: none; pointer-events: none; }
</style>

<style lang="scss">
$accent: #8b5cf6;
.mga-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #a78bfa); z-index: 1001; }
.mga-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.mga-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.mga-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.mga-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .mga-cur { color: $accent; font-weight: 700; }
}
</style>

