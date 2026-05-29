<script setup lang="ts">
/**
 * ==================== Scroll Chess Flip ====================
 * 棋盘翻转 —— 面板被切成4x4棋盘格，每个格子独立绕Y轴翻转
 * 翻转后露出下一个面板。格子按对角线波纹顺序依次翻转
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const GRID = 4 // 4x4
const CELLS = GRID * GRID

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
    dot.className = 'csf-dot' + (i === 0 ? ' csf-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.csf-dot').forEach((d, i) => d.classList.toggle('csf-active', i === index))
  const el = document.querySelector('.csf-indicator .csf-cur')
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

// 对角线波纹延迟：左上→右下
function diagDelay(row: number, col: number): number {
  return (row + col) / (GRID * 2 - 2) // 0→1 normalized
}

function init() {
  scrollArea = document.getElementById('csfArea') as HTMLElement
  progressBar = document.getElementById('csfProgress')
  navDots = document.getElementById('csfNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'

  const boards = gsap.utils.toArray('.csf-board') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      boards.forEach((board, i) => {
        const dist = i - focus
        const cells = board.querySelectorAll('.csf-cell') as NodeListOf<HTMLElement>

        cells.forEach((cell, ci) => {
          const row = Math.floor(ci / GRID)
          const col = ci % GRID
          const delay = diagDelay(row, col) * 0.6 // 最大延迟0.6

          if (dist <= -1) {
            cell.style.transform = 'rotateY(180deg)'
          } else if (dist >= 1) {
            cell.style.transform = 'rotateY(0deg)'
          } else if (dist < 0) {
            // 正在翻转 (-1 < dist < 0)
            const rawP = -dist // 0→1
            const cellP = Math.max(0, Math.min(1, (rawP - delay) / (1 - delay)))
            const angle = cellP * 180
            cell.style.transform = `rotateY(${angle}deg)`
          } else {
            // 等待翻转
            cell.style.transform = 'rotateY(0deg)'
          }
        })
        board.style.zIndex = dist > -0.5 && dist < 0.5 ? String(TOTAL + 1) : String(TOTAL - Math.abs(Math.round(dist)))
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
  <div class="csf-page">
    <div id="csfProgress" class="csf-progress-bar"></div>
    <nav id="csfNav" class="csf-nav-dots"></nav>
    <div class="csf-indicator"><span class="csf-cur">1</span> / {{ TOTAL }}</div>
    <div id="csfArea" class="csf-scroll-area">
      <div class="csf-viewport">
        <div v-for="n in TOTAL" :key="n" class="csf-board">
          <div
            v-for="c in CELLS" :key="c"
            class="csf-cell"
            :style="{
              left: ((c - 1) % GRID) * (100 / GRID) + '%',
              top: Math.floor((c - 1) / GRID) * (100 / GRID) + '%',
              width: (100 / GRID) + '%',
              height: (100 / GRID) + '%',
            }"
          >
            <!-- 正面(当前面板颜色) -->
            <div class="csf-face csf-front"
              :style="{ background: `hsl(${(n-1)*44 + ((c-1)%2)*8}, ${48 + ((c-1)%2)*6}%, ${26 + ((c-1)%2)*4}%)` }">
              <span v-if="c === Math.ceil(CELLS/2)" class="csf-num">{{ String(n).padStart(2, '0') }}</span>
            </div>
            <!-- 背面(下一个面板颜色) -->
            <div class="csf-face csf-back"
              :style="{ background: n < TOTAL ? `hsl(${n*44 + ((c-1)%2)*8}, ${48 + ((c-1)%2)*6}%, ${26 + ((c-1)%2)*4}%)` : `hsl(0, 0%, 90%)` }">
              <span v-if="c === Math.ceil(CELLS/2)" class="csf-num">{{ n < TOTAL ? String(n + 1).padStart(2, '0') : '✓' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.csf-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.csf-scroll-area { position: relative; }
.csf-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; perspective: 1200px; }
.csf-board { position: absolute; inset: 0; }
.csf-cell {
  position: absolute; transform-style: preserve-3d; will-change: transform;
}
.csf-face {
  position: absolute; inset: 0; backface-visibility: hidden; display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.03);
}
.csf-front { }
.csf-back { transform: rotateY(180deg); }
.csf-num { font-size: clamp(3rem, 8vw, 6rem); font-weight: 900; color: rgba(26, 26, 46,0.06); user-select: none; pointer-events: none; }
</style>

<style lang="scss">
$accent: #10b981;
.csf-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #34d399); z-index: 1001; }
.csf-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.csf-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.csf-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.csf-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .csf-cur { color: $accent; font-weight: 700; }
}
</style>

