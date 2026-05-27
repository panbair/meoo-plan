<script setup lang="ts">
/**
 * ==================== Scroll Typewriter Cascade ====================
 * 打字机瀑布 —— 全屏网格按列自上而下、自左往右依次揭示，
 * 每个单元像打字机字符一样"敲出"(从透明→可见，伴随轻微弹跳)，
 * 形成逐列瀑布式的打字揭示效果
 * 核心：scroll progress → 当前"光标"位置(列优先扫描)，
 *       光标之前已敲出(可见)，光标处弹跳入场，光标之后隐藏
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const COLS = 6
const ROWS = 8
const N = COLS * ROWS

let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let cursorEl: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

// 列优先顺序索引：col0-row0, col0-row1, ..., col0-rowN, col1-row0 ...
function getCellOrder(idx: number): number {
  // idx 按列优先：第几个被打出
  const col = Math.floor(idx / ROWS)
  const row = idx % ROWS
  // 映射到行优先的 DOM 索引
  return row * COLS + col
}

function init() {
  scrollArea = document.getElementById('twArea') as HTMLElement
  progressBar = document.getElementById('twProgress')
  cursorEl = document.getElementById('twCursor')
  if (!scrollArea) return

  scrollArea.style.height = '700vh'

  const cells = gsap.utils.toArray('.tw-cell') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.2,
    onUpdate: (self) => {
      const p = self.progress
      // 当前光标位置(列优先序号，浮点)
      const cursor = p * N

      for (let order = 0; order < N; order++) {
        const domIdx = getCellOrder(order)
        const cell = cells[domIdx]
        if (!cell) continue

        const diff = cursor - order // 正=已打出, 负=未打出

        if (diff >= 1) {
          // 已打出 - 完全可见
          cell.style.transform = 'scale(1) translateY(0)'
          cell.style.opacity = '1'
          cell.classList.remove('tw-typing')
          cell.classList.add('tw-typed')
        } else if (diff > -0.5 && diff < 1) {
          // 正在打出 - 弹跳动画
          const local = Math.max(0, Math.min(1, diff + 0.5))
          const bounce = Math.sin(local * Math.PI) * 8
          const scale = 0.6 + local * 0.4 + Math.sin(local * Math.PI) * 0.15
          cell.style.transform = `scale(${scale}) translateY(${-bounce}px)`
          cell.style.opacity = String(Math.min(1, local * 2))
          cell.classList.add('tw-typing')
          cell.classList.remove('tw-typed')
        } else {
          // 未打出
          cell.style.transform = 'scale(0.5) translateY(12px)'
          cell.style.opacity = '0'
          cell.classList.remove('tw-typing', 'tw-typed')
        }
      }

      // 光标闪烁位置
      if (cursorEl) {
        const cursorOrder = Math.min(N - 1, Math.floor(cursor))
        const domIdx = getCellOrder(cursorOrder)
        const col = domIdx % COLS
        const row = Math.floor(domIdx / COLS)
        cursorEl.style.gridColumn = String(col + 1)
        cursorEl.style.gridRow = String(row + 1)
        cursorEl.style.opacity = '1'
      }

      if (progressBar) progressBar.style.width = (p * 100) + '%'
    }
  })

  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
}

function destroy() {
  mainST?.kill(); mainST = null
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="tw-page">
    <div id="twProgress" class="tw-progress-bar"></div>

    <div id="twArea" class="tw-scroll-area">
      <div class="tw-viewport">
        <div class="tw-grid">
          <div
            v-for="idx in N"
            :key="idx"
            class="tw-cell"
            :style="{
              background: `hsl(${140 + ((idx-1) % COLS) * 20 + Math.floor((idx-1)/COLS) * 5}, 30%, 12%)`
            }"
          >
            <span class="tw-char">{{ String(idx).padStart(2, '0') }}</span>
          </div>
          <!-- 闪烁光标 -->
          <div id="twCursor" class="tw-cursor"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #040608;
$cursor: #50ff90;

.tw-page { font-family: 'Courier New', monospace; background: $bg; }
.tw-scroll-area { position: relative; }
.tw-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.tw-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 5px;
  width: 80vw; height: 85vh;
  position: relative;
}
.tw-cell {
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  opacity: 0;
  will-change: transform, opacity;
  border: 1px solid rgba(255,255,255,.03);
  transform: scale(0.5) translateY(12px);
}
.tw-cell.tw-typing {
  border-color: rgba($cursor, .3);
  box-shadow: 0 0 15px rgba($cursor, .15);
}
.tw-cell.tw-typed {
  border-color: rgba(255,255,255,.06);
}
.tw-char {
  font-size: .7rem; color: rgba(255,255,255,.3);
  font-weight: 600; user-select: none; pointer-events: none;
}
.tw-cursor {
  position: absolute;
  width: 3px; height: 100%;
  background: $cursor;
  opacity: 0;
  border-radius: 2px;
  animation: tw-blink 0.6s step-end infinite;
  pointer-events: none;
  justify-self: end;
  align-self: stretch;
  box-shadow: 0 0 8px rgba($cursor, .5);
}

@keyframes tw-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 600px) {
  .tw-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(16, 1fr);
  }
}
</style>

<style lang="scss">
$cursor: #50ff90;
.tw-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $cursor, #40c0ff); z-index: 1001;
}
</style>

