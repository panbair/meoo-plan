<script setup lang="ts">
/**
 * ==================== Scroll Ripple Grid ====================
 * 涟漪网格 —— 滚动驱动同心圆涟漪从中心向外扩散，
 * 网格单元在波纹经过时弹起(scale+translateY)，颜色随波峰变亮
 * 核心：以网格中心为原点，每个单元的极径与波纹半径比较，
 *       波纹半径由 scroll progress 驱动
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const COLS = 8
const ROWS = 6
const N = COLS * ROWS
const MAX_RADIUS = Math.sqrt((COLS/2)**2 + (ROWS/2)**2) // 对角线半径
const RIPPLE_COUNT = 4 // 波纹层数
const RIPPLE_WIDTH = 1.2 // 波纹厚度(格单位)

let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function init() {
  scrollArea = document.getElementById('rpArea') as HTMLElement
  progressBar = document.getElementById('rpProgress')
  if (!scrollArea) return

  scrollArea.style.height = '800vh'

  const cells = gsap.utils.toArray('.rp-cell') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
    onUpdate: (self) => {
      const p = self.progress
      // 波纹从中心扩散到最远角: 产生多层同心波
      // 当前最外圈半径
      const maxR = p * (MAX_RADIUS + RIPPLE_COUNT * 2)

      cells.forEach((el, idx) => {
        const col = idx % COLS
        const row = Math.floor(idx / COLS)
        // 到中心的距离
        const dx = col - (COLS - 1) / 2
        const dy = row - (ROWS - 1) / 2
        const dist = Math.sqrt(dx * dx + dy * dy)

        // 所有波纹层的叠加效果
        let totalWave = 0
        for (let w = 0; w < RIPPLE_COUNT; w++) {
          const rippleR = maxR - w * 2.5
          const diff = Math.abs(dist - rippleR)
          if (diff < RIPPLE_WIDTH) {
            const intensity = 1 - diff / RIPPLE_WIDTH
            totalWave = Math.max(totalWave, intensity * (1 - w * 0.2))
          }
        }

        const yOff = -totalWave * 30
        const scale = 1 + totalWave * 0.25
        const brightness = 0.15 + totalWave * 0.85

        el.style.transform = `translateY(${yOff}px) scale(${scale})`
        el.style.opacity = String(brightness)
        el.style.zIndex = String(Math.round(totalWave * 10))
      })

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
  <div class="rp-page">
    <div id="rpProgress" class="rp-progress-bar"></div>

    <div id="rpArea" class="rp-scroll-area">
      <div class="rp-viewport">
        <div class="rp-grid">
          <div
            v-for="idx in N"
            :key="idx"
            class="rp-cell"
            :style="{
              background: `hsl(${200 + ((idx-1) % COLS) * 8 + Math.floor((idx-1)/COLS) * 12}, 35%, 12%)`
            }"
          >
            <span class="rp-id">{{ String(idx).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #04040c;
.rp-page { font-family: system-ui, -apple-system, sans-serif; background: $bg; }
.rp-scroll-area { position: relative; }
.rp-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.rp-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 6px;
  width: 88vw; height: 80vh;
}
.rp-cell {
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  opacity: 0.15;
  will-change: transform, opacity;
  border: 1px solid rgba(255,255,255,.04);
  position: relative;
  transition: box-shadow .15s;
}
.rp-id {
  font-size: .65rem; color: rgba(255,255,255,.25);
  font-weight: 600; user-select: none; pointer-events: none;
}

@media (max-width: 600px) {
  .rp-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(12, 1fr);
  }
}
</style>

<style lang="scss">
$accent: #40c8ff;
.rp-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $accent, #a060ff, $accent); z-index: 1001;
}
</style>

