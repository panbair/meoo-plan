<script setup lang="ts">
/**
 * ==================== Scroll Radar Sweep ====================
 * 雷达扫描 —— 滚动驱动一根扇形扫描线围绕圆心旋转，
 * 扫到的网格单元亮起并缓慢消退，形成经典雷达/声纳视觉
 * 核心：用极坐标将网格单元定位在圆盘上，scroll → 扫描角度 0→720°
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const RINGS = 4       // 同心圆环数
const SECTORS = 12    // 每环扇区数
const N = RINGS * SECTORS
const SWEEP_WIDTH = 35 // 扫描线影响宽度(度)
const TOTAL_SWEEP = 720 // 扫描总角度

let scrollArea: HTMLElement | null = null
let sweepLine: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

// 每个 blip 的"余晖"强度 (0~1)
const glows = new Float32Array(N)

function init() {
  scrollArea = document.getElementById('rsArea') as HTMLElement
  sweepLine = document.getElementById('rsSweep')
  progressBar = document.getElementById('rsProgress')
  if (!scrollArea) return

  scrollArea.style.height = '600vh'

  const blips = gsap.utils.toArray('.rs-blip') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
    onUpdate: (self) => {
      const angle = self.progress * TOTAL_SWEEP // 当前扫描角
      // 旋转扫描线
      if (sweepLine) sweepLine.style.transform = `rotate(${angle}deg)`

      // 更新每个 blip
      blips.forEach((el, idx) => {
        const ring = Math.floor(idx / SECTORS)
        const sector = idx % SECTORS
        const blipAngle = sector * (360 / SECTORS)

        // 扫描线与此blip的角度差(取最小弧)
        const diff = ((angle % 360) - blipAngle + 540) % 360 - 180
        const absDiff = Math.abs(diff)

        if (absDiff < SWEEP_WIDTH) {
          // 被扫到 → 亮度拉满
          glows[idx] = 1
        } else {
          // 缓慢衰减
          glows[idx] = Math.max(0, glows[idx] - 0.015)
        }

        const g = glows[idx]
        const brightness = 0.08 + g * 0.92
        const scale = 0.7 + g * 0.3
        const borderGlow = g > 0.5 ? `0 0 ${g * 20}px rgba(0,255,120,${g * 0.5})` : 'none'

        el.style.opacity = String(brightness)
        el.style.transform = `translate(-50%, -50%) scale(${scale})`
        el.style.boxShadow = borderGlow
      })

      if (progressBar) progressBar.style.width = (self.progress * 100) + '%'
    }
  })

  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
}

function destroy() {
  mainST?.kill()
  mainST = null
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="rs-page">
    <div id="rsProgress" class="rs-progress-bar"></div>

    <div id="rsArea" class="rs-scroll-area">
      <div class="rs-viewport">
        <!-- 雷达圆盘 -->
        <div class="rs-radar">
          <!-- 同心圆环(装饰) -->
          <div v-for="r in RINGS" :key="'ring'+r" class="rs-ring" :style="{ width: (r/RINGS*80)+'%', height: (r/RINGS*80)+'%' }"></div>
          <!-- 十字线(装饰) -->
          <div class="rs-cross-h"></div>
          <div class="rs-cross-v"></div>

          <!-- 扫描线 -->
          <div id="rsSweep" class="rs-sweep"></div>

          <!-- Blips: 极坐标定位 -->
          <div
            v-for="idx in N"
            :key="idx"
            class="rs-blip"
            :style="{
              left: `${50 + Math.cos((((idx-1) % SECTORS) * 360 / SECTORS - 90) * Math.PI/180) * (Math.floor((idx-1)/SECTORS)+1) / RINGS * 38}%`,
              top: `${50 + Math.sin((((idx-1) % SECTORS) * 360 / SECTORS - 90) * Math.PI/180) * (Math.floor((idx-1)/SECTORS)+1) / RINGS * 38}%`
            }"
          >
            <span class="rs-blip-id">{{ String(idx).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #020a06;
$green: #00ff78;

.rs-page { font-family: 'Courier New', monospace; background: $bg; color: $green; }
.rs-scroll-area { position: relative; }
.rs-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}

.rs-radar {
  position: relative; width: min(85vw, 85vh); height: min(85vw, 85vh);
  border-radius: 50%; border: 1px solid rgba($green, .15);
  background: radial-gradient(circle, rgba($green, .03) 0%, transparent 70%);
}

.rs-ring {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  border-radius: 50%; border: 1px solid rgba($green, .08);
  pointer-events: none;
}

.rs-cross-h, .rs-cross-v {
  position: absolute; pointer-events: none; background: rgba($green, .06);
}
.rs-cross-h { top: 50%; left: 0; right: 0; height: 1px; }
.rs-cross-v { left: 50%; top: 0; bottom: 0; width: 1px; }

.rs-sweep {
  position: absolute; top: 50%; left: 50%; width: 50%; height: 2px;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, rgba($green, .6), transparent);
  will-change: transform;
  &::before {
    content: '';
    position: absolute; top: -60px; left: 0; width: 100%; height: 120px;
    background: conic-gradient(from -15deg, transparent, rgba($green, .12) 30deg, transparent 35deg);
    transform-origin: 0 50%;
  }
}

.rs-blip {
  position: absolute; width: 36px; height: 36px;
  transform: translate(-50%, -50%) scale(0.7);
  border-radius: 50%;
  background: rgba($green, .12);
  border: 1px solid rgba($green, .2);
  display: flex; align-items: center; justify-content: center;
  opacity: 0.08;
  will-change: transform, opacity, box-shadow;
  transition: background .1s;
}
.rs-blip-id {
  font-size: .55rem; color: rgba($green, .7);
  pointer-events: none; user-select: none;
}
</style>

<style lang="scss">
$green: #00ff78;
.rs-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $green, #00c8ff); z-index: 1001;
}
</style>

