<script setup lang="ts">
/**
 * ==================== Scroll Shutter Roll ====================
 * 百叶卷帘 —— 面板像水平百叶窗叶片一样排列，
 * 滚动驱动叶片依次绕 X 轴旋转翻转(0→180°)，
 * 翻到背面时露出下一层颜色，形成卷帘翻转效果
 * 核心：横条状面板 + rotateX + backface-visibility 双面切换
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const SLATS = 12 // 叶片数
const FLIP_SPREAD = 0.06 // 翻转延迟(进度比例/叶片)

let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function init() {
  scrollArea = document.getElementById('srArea') as HTMLElement
  progressBar = document.getElementById('srProgress')
  if (!scrollArea) return

  scrollArea.style.height = '600vh'

  const slats = gsap.utils.toArray('.sr-slat') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate: (self) => {
      const p = self.progress

      slats.forEach((slat, i) => {
        const startP = i * FLIP_SPREAD
        const endP = startP + 0.15
        const local = Math.max(0, Math.min(1, (p - startP) / (endP - startP)))

        // 0 → 180° 翻转
        const rotX = local * 180
        // 翻转中间最厚(z最大)
        const zBulge = Math.sin(local * Math.PI) * 40
        // 翻过一半后"背面"颜色
        const isFlipped = local > 0.5

        slat.style.transform = `perspective(800px) rotateX(${rotX}deg) translateZ(${zBulge}px)`
        slat.classList.toggle('sr-flipped', isFlipped)

        // 正在翻转的叶片投射阴影
        const shadow = Math.sin(local * Math.PI) * 0.4
        slat.style.boxShadow = shadow > 0.05
          ? `0 ${shadow * 30}px ${shadow * 40}px rgba(0,0,0,${shadow})`
          : 'none'
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
  <div class="sr-page">
    <div id="srProgress" class="sr-progress-bar"></div>

    <div id="srArea" class="sr-scroll-area">
      <div class="sr-viewport">
        <div class="sr-shutter">
          <div
            v-for="n in SLATS"
            :key="n"
            class="sr-slat"
          >
            <!-- 正面 -->
            <div class="sr-front" :style="{ background: `hsl(${(n-1)*30}, 30%, 14%)` }">
              <span class="sr-label">{{ String(n).padStart(2, '0') }}</span>
            </div>
            <!-- 背面 -->
            <div class="sr-back" :style="{ background: `hsl(${(n-1)*30 + 180}, 35%, 10%)` }">
              <span class="sr-label">{{ String(n).padStart(2, '0') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #08080c;
.sr-page { font-family: system-ui, -apple-system, sans-serif; background: $bg; }
.sr-scroll-area { position: relative; }
.sr-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.sr-shutter {
  width: 80vw; height: 85vh;
  display: flex; flex-direction: column;
  gap: 3px;
}
.sr-slat {
  flex: 1;
  position: relative;
  transform-style: preserve-3d;
  transform-origin: center center;
  will-change: transform;
}
.sr-front, .sr-back {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  display: flex; align-items: center; justify-content: center;
  border-radius: 4px;
}
.sr-back {
  transform: rotateX(180deg);
}
.sr-label {
  font-size: 1.2rem; font-weight: 700;
  color: rgba(255,255,255,.08); user-select: none; pointer-events: none;
}

.sr-slat.sr-flipped .sr-label {
  color: rgba(255,255,255,.15);
}
</style>

<style lang="scss">
$accent: #e0a040;
.sr-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $accent, #e06060); z-index: 1001;
}
</style>

