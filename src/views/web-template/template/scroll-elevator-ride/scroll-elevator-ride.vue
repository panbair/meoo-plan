<script setup lang="ts">
/**
 * ==================== Scroll Elevator Ride ====================
 * 电梯升降 —— 完整的电梯体验：
 *   阶段1: 电梯门打开(左右分开)
 *   阶段2: 看到楼层内容(当前面板)
 *   阶段3: 电梯门关闭
 *   阶段4: 楼层指示灯变化，到达下一层
 *   重复...
 *
 * 每个面板占2屏滚动空间：1屏展示+1屏关门过渡
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const SCROLL_PER_FLOOR = 2 // 每层2屏
const TOTAL_SCROLL = TOTAL * SCROLL_PER_FLOOR

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
    dot.className = 'elv-dot' + (i === 0 ? ' elv-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.elv-dot').forEach((d, i) => d.classList.toggle('elv-active', i === index))
  const cur = document.querySelector('.elv-indicator .elv-cur')
  if (cur) cur.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
  // 楼层指示
  const floor = document.querySelector('.elv-floor-num')
  if (floor) floor.textContent = `${index + 1}F`
}
function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  const vh = window.innerHeight
  gsap.to(window, { scrollTo: { y: index * SCROLL_PER_FLOOR * vh, autoKill: false }, duration: 0.8, ease: 'power2.inOut' })
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) }
}

function init() {
  scrollArea = document.getElementById('elvArea') as HTMLElement
  progressBar = document.getElementById('elvProgress')
  navDots = document.getElementById('elvNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL_SCROLL * 100 + 'vh'
  const floors = gsap.utils.toArray('.elv-floor') as HTMLElement[]
  const doorL = document.querySelector('.elv-door-l') as HTMLElement
  const doorR = document.querySelector('.elv-door-r') as HTMLElement

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const totalProgress = self.progress * (TOTAL_SCROLL - 1)
      const floorFloat = totalProgress / SCROLL_PER_FLOOR
      const floorIdx = Math.floor(floorFloat)
      const phase = floorFloat - floorIdx // 0→1 within each floor

      // 电梯门动画
      // phase 0~0.2: 门打开
      // phase 0.2~0.7: 展示楼层(门全开)
      // phase 0.7~1.0: 门关闭
      let doorOpen = 0
      if (phase < 0.2) {
        doorOpen = phase / 0.2 // 0→1 打开
      } else if (phase < 0.7) {
        doorOpen = 1 // 全开
      } else {
        doorOpen = 1 - (phase - 0.7) / 0.3 // 1→0 关闭
      }
      if (doorL) doorL.style.transform = `translateX(${-doorOpen * 100}%)`
      if (doorR) doorR.style.transform = `translateX(${doorOpen * 100}%)`

      // 楼层内容
      floors.forEach((floor, i) => {
        if (i === Math.min(floorIdx, TOTAL - 1)) {
          floor.style.opacity = '1'
          floor.style.zIndex = '1'
        } else if (i === Math.min(floorIdx + 1, TOTAL - 1) && phase > 0.85) {
          // 预加载下一层(门即将关上时隐约可见)
          floor.style.opacity = String((phase - 0.85) / 0.15 * 0.3)
          floor.style.zIndex = '0'
        } else {
          floor.style.opacity = '0'
          floor.style.zIndex = '0'
        }
      })

      // 楼层指示灯闪烁(关门时)
      const indicator = document.querySelector('.elv-floor-num') as HTMLElement
      if (indicator) {
        if (phase > 0.7 && phase < 1) {
          const blink = Math.sin((phase - 0.7) / 0.3 * Math.PI * 4)
          indicator.style.opacity = String(0.5 + 0.5 * Math.abs(blink))
        } else {
          indicator.style.opacity = '1'
        }
      }

      const idx = Math.min(floorIdx, TOTAL - 1)
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
  <div class="elv-page">
    <div id="elvProgress" class="elv-progress-bar"></div>
    <nav id="elvNav" class="elv-nav-dots"></nav>
    <div class="elv-indicator"><span class="elv-cur">1</span> / {{ TOTAL }}</div>

    <!-- 楼层指示器 -->
    <div class="elv-floor-display">
      <span class="elv-floor-num">1F</span>
      <div class="elv-arrow">▲</div>
    </div>

    <div id="elvArea" class="elv-scroll-area">
      <div class="elv-viewport">
        <!-- 楼层内容(电梯门后面) -->
        <section v-for="n in TOTAL" :key="n" class="elv-floor"
          :style="{ background: `linear-gradient(180deg, hsl(${(n-1)*44}, 40%, 25%), hsl(${(n-1)*44+20}, 32%, 14%))` }">
          <span class="elv-num">{{ String(n).padStart(2, '0') }}</span>
          <div class="elv-floor-label">{{ n }}F</div>
        </section>

        <!-- 电梯门(在内容前面) -->
        <div class="elv-doors">
          <div class="elv-door elv-door-l">
            <div class="elv-door-panel"></div>
            <div class="elv-door-handle"></div>
          </div>
          <div class="elv-door elv-door-r">
            <div class="elv-door-panel"></div>
            <div class="elv-door-handle"></div>
          </div>
          <!-- 门缝 -->
          <div class="elv-gap"></div>
        </div>

        <!-- 电梯框架 -->
        <div class="elv-frame"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.elv-page { font-family: system-ui, sans-serif; background: #0a0a12; color: #fff; }
.elv-scroll-area { position: relative; }
.elv-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }

.elv-floor {
  position: absolute; inset: 5vh 5vw; border-radius: 4px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  opacity: 0; will-change: opacity;
}
.elv-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(255,255,255,0.04); user-select: none; }
.elv-floor-label { font-size: 1rem; color: rgba(255,255,255,0.15); letter-spacing: 4px; }

/* 电梯门 */
.elv-doors { position: absolute; inset: 0; z-index: 10; pointer-events: none; }
.elv-door {
  position: absolute; top: 3vh; bottom: 3vh; width: 50%; overflow: hidden; will-change: transform;
}
.elv-door-l { left: 0; }
.elv-door-r { right: 0; }
.elv-door-panel {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, #1a1a22 0%, #22222e 50%, #1a1a22 100%);
  border: 1px solid rgba(255,255,255,0.04);
}
.elv-door-handle {
  position: absolute; top: 50%; width: 3px; height: 50px; border-radius: 2px;
  background: rgba(255,255,255,0.08); transform: translateY(-50%);
}
.elv-door-l .elv-door-handle { right: 16px; }
.elv-door-r .elv-door-handle { left: 16px; }

.elv-gap { position: absolute; left: 50%; top: 3vh; bottom: 3vh; width: 2px; margin-left: -1px; background: rgba(0,0,0,0.6); z-index: 11; }

/* 电梯框架 */
.elv-frame {
  position: absolute; inset: 2vh 0; border: 3px solid rgba(255,255,255,0.04); border-radius: 4px;
  pointer-events: none; z-index: 12;
  &::before { content: ''; position: absolute; top: 0; left: 50%; width: 40%; transform: translateX(-50%); height: 3px; background: rgba(255,255,255,0.04); border-radius: 2px; }
}

/* 楼层指示器 */
.elv-floor-display {
  position: fixed; top: 5vh; left: 50%; transform: translateX(-50%); z-index: 1000;
  background: #111118; border: 1px solid rgba(255,255,255,0.08);
  padding: 8px 24px; border-radius: 8px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.elv-floor-num { font-size: 1.4rem; font-weight: 700; color: #f59e0b; font-family: 'Courier New', monospace; will-change: opacity; }
.elv-arrow { font-size: 0.6rem; color: #f59e0b; }
</style>

<style lang="scss">
$accent: #f59e0b;
.elv-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #fbbf24); z-index: 1001; }
.elv-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.elv-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255,255,255,0.4); transform: scale(1.3); }
  &.elv-active { background: $accent; border-color: rgba(255,255,255,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.elv-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(0,0,0,0.4); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.75);
  .elv-cur { color: $accent; font-weight: 700; }
}
</style>

