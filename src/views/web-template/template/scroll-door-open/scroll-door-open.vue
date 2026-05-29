<script setup lang="ts">
/**
 * ==================== Scroll Door Open ====================
 * 双开门 —— 前一个面板从中间向左右两侧打开像双开门，
 * 露出后面的下一个面板。每个面板都是"门后的内容"，
 * 被前一扇门打开后才显现。
 *
 * 核心：当前面板拆成左右两扇"门"，
 * scroll 驱动左门 translateX(-100%)，右门 translateX(100%)
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
    dot.className = 'dro-dot' + (i === 0 ? ' dro-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.dro-dot').forEach((d, i) => d.classList.toggle('dro-active', i === index))
  const el = document.querySelector('.dro-indicator .dro-cur')
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
  scrollArea = document.getElementById('droArea') as HTMLElement
  progressBar = document.getElementById('droProgress')
  navDots = document.getElementById('droNav')
  if (!scrollArea) return

  scrollArea.style.height = TOTAL * 100 + 'vh'
  const doors = gsap.utils.toArray('.dro-door') as HTMLElement[]
  const panels = gsap.utils.toArray('.dro-content') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)

      // 门的开合
      doors.forEach((door, i) => {
        const dist = i - focus
        const leftDoor = door.querySelector('.dro-left') as HTMLElement
        const rightDoor = door.querySelector('.dro-right') as HTMLElement
        if (!leftDoor || !rightDoor) return

        // zIndex 规则：门的序号越小越在上面(先打开)
        // 已打开的门沉到最底下，关着的门按从上到下排列
        if (dist <= -1) {
          // 门已完全打开 → 沉底
          leftDoor.style.transform = 'translateX(-100%)'
          rightDoor.style.transform = 'translateX(100%)'
          door.style.zIndex = String(i)
        } else if (dist < 0) {
          // 门正在打开 (-1 < dist < 0) → 最高层
          const openProg = -dist // 0→1
          leftDoor.style.transform = `translateX(${-openProg * 100}%)`
          rightDoor.style.transform = `translateX(${openProg * 100}%)`
          door.style.zIndex = String(TOTAL * 3)
        } else {
          // 门关着(dist >= 0) → 按倒序叠放，序号小的在上
          leftDoor.style.transform = 'translateX(0)'
          rightDoor.style.transform = 'translateX(0)'
          door.style.zIndex = String(TOTAL * 2 - i)
        }
      })

      // 内容面板层叠(在门后面)：序号大的在上(后面的内容先被看到)
      panels.forEach((panel, i) => {
        panel.style.zIndex = String(i)
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
  <div class="dro-page">
    <div id="droProgress" class="dro-progress-bar"></div>
    <nav id="droNav" class="dro-nav-dots"></nav>
    <div class="dro-indicator"><span class="dro-cur">1</span> / {{ TOTAL }}</div>
    <div id="droArea" class="dro-scroll-area">
      <div class="dro-viewport">
        <!-- 内容面板(门后面) -->
        <section v-for="n in TOTAL" :key="'c'+n" class="dro-content"
          :style="{ background: `linear-gradient(${140+(n-1)*20}deg, hsl(${(n-1)*44}, 50%, 72%), hsl(${(n-1)*44+20}, 38%, 84%))` }">
          <span class="dro-num">{{ String(n).padStart(2, '0') }}</span>
        </section>

        <!-- 门(在内容前面) -->
        <div v-for="n in TOTAL" :key="'d'+n" class="dro-door">
          <div class="dro-left"
            :style="{ background: `linear-gradient(90deg, hsl(${(n-1)*44}, 35%, 18%) 0%, hsl(${(n-1)*44}, 40%, 78%) 100%)` }">
            <div class="dro-handle dro-handle-r"></div>
          </div>
          <div class="dro-right"
            :style="{ background: `linear-gradient(270deg, hsl(${(n-1)*44}, 35%, 18%) 0%, hsl(${(n-1)*44}, 40%, 78%) 100%)` }">
            <div class="dro-handle dro-handle-l"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dro-page { font-family: system-ui, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.dro-scroll-area { position: relative; }
.dro-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }

.dro-content {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  &::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; pointer-events: none; }
}
.dro-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(26, 26, 46,0.05); user-select: none; pointer-events: none; }

.dro-door { position: absolute; inset: 0; pointer-events: none; }

.dro-left, .dro-right {
  position: absolute; top: 0; height: 100%; width: 50%; will-change: transform;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.75);
}
.dro-left { left: 0; }
.dro-right { right: 0; }

/* 门把手 */
.dro-handle {
  position: absolute; top: 50%; width: 4px; height: 40px; border-radius: 2px;
  background: rgba(26, 26, 46,0.1); transform: translateY(-50%);
}
.dro-handle-r { right: 20px; }
.dro-handle-l { left: 20px; }

/* 门缝中线 */
.dro-left::after {
  content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 1px;
  background: rgba(255, 255, 255, 0.75);
}
.dro-right::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px;
  background: rgba(255, 255, 255, 0.75);
}
</style>

<style lang="scss">
$accent: #14b8a6;
.dro-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #0ea5e9); z-index: 1001; }
.dro-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.dro-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.dro-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.dro-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .dro-cur { color: $accent; font-weight: 700; }
}
</style>


