<template>
  <section class="diagonal-slice-container" ref="containerRef">
    <!-- 背景层 -->
    <div class="slice-bg"></div>

    <!-- 完整图片层（最终状态） -->
    <div class="base-image-layer" ref="baseLayerRef">
      <img :src="imageUrl" alt="diagonal slice" />
    </div>

    <!-- 对角线刻痕 -->
    <div class="cut-line" ref="cutLineRef"></div>

    <!-- 上半部分（右下三角形） -->
    <div class="slice-piece top-slice" ref="topSliceRef">
      <img :src="imageUrl" alt="" />
    </div>

    <!-- 下半部分（左上三角形） -->
    <div class="slice-piece bottom-slice" ref="bottomSliceRef">
      <img :src="imageUrl" alt="" />
    </div>

    <!-- 合拢辉光 -->
    <div class="closure-glow" ref="closureGlowRef"></div>

    <!-- 最终刻痕暗影 -->
    <div class="final-scar" ref="finalScarRef"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const containerRef = ref<HTMLElement | null>(null)
const baseLayerRef = ref<HTMLElement | null>(null)
const cutLineRef = ref<HTMLElement | null>(null)
const topSliceRef = ref<HTMLElement | null>(null)
const bottomSliceRef = ref<HTMLElement | null>(null)
const closureGlowRef = ref<HTMLElement | null>(null)
const finalScarRef = ref<HTMLElement | null>(null)

const imageUrl = 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80'

onMounted(() => {
  if (!containerRef.value) return

  const container = containerRef.value
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      end: 'center center',
      scrub: 1.5,
    },
  })

  // 初始状态：两块分离
  gsap.set(topSliceRef.value, {
    x: 80,
    y: -60,
    rotation: 4,
    opacity: 1,
  })
  gsap.set(bottomSliceRef.value, {
    x: -80,
    y: 60,
    rotation: -4,
    opacity: 1,
  })
  gsap.set(closureGlowRef.value, { opacity: 0, scale: 0.5 })
  gsap.set(finalScarRef.value, { opacity: 0, scaleX: 0 })

  // 滚动动画：合拢
  tl.to(topSliceRef.value, {
    x: 0,
    y: 0,
    rotation: 0,
    ease: 'power3.inOut',
  }, 0)

  tl.to(bottomSliceRef.value, {
    x: 0,
    y: 0,
    rotation: 0,
    ease: 'power3.inOut',
  }, 0)

  // 辉光脉冲
  tl.to(closureGlowRef.value, {
    opacity: 1,
    scale: 1.5,
    duration: 0.3,
    ease: 'power2.out',
  }, 0.7)
  tl.to(closureGlowRef.value, {
    opacity: 0,
    scale: 2,
    duration: 0.5,
    ease: 'power2.out',
  }, 0.85)

  // 刻痕显现
  tl.to(finalScarRef.value, {
    opacity: 0.15,
    scaleX: 1,
    duration: 0.5,
    ease: 'power2.inOut',
  }, 0.9)

  cleanupFns.push(() => {
    ScrollTrigger.getAll().forEach(st => st.kill())
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.diagonal-slice-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a12 0%, #12121f 50%, #0a0a12 100%);
}

.slice-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 120% 80% at 30% 70%, rgba(60, 40, 100, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 70% 30%, rgba(40, 60, 100, 0.2) 0%, transparent 50%);
}

.base-image-layer {
  position: absolute;
  inset: 0;
  opacity: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cut-line {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 150%;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, rgba(150, 200, 255, 0.8) 30%, rgba(200, 220, 255, 1) 50%, rgba(150, 200, 255, 0.8) 70%, transparent 100%);
  transform: rotate(-55deg);
  transform-origin: center;
  opacity: 0;
  box-shadow:
    0 0 10px rgba(100, 180, 255, 0.5),
    0 0 20px rgba(100, 180, 255, 0.3),
    0 0 40px rgba(100, 180, 255, 0.2);
  z-index: 10;
  pointer-events: none;
}

.slice-piece {
  position: absolute;
  inset: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.top-slice {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.bottom-slice {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.closure-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300vw;
  height: 4px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(200, 220, 255, 0.6) 20%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(200, 220, 255, 0.6) 80%,
    transparent 100%
  );
  transform: translate(-50%, -50%) rotate(-55deg);
  z-index: 15;
  pointer-events: none;
  box-shadow:
    0 0 15px rgba(150, 200, 255, 0.8),
    0 0 30px rgba(150, 200, 255, 0.5),
    0 0 60px rgba(150, 200, 255, 0.3);
}

.final-scar {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 150%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(100, 120, 150, 0.4) 25%,
    rgba(100, 120, 150, 0.6) 50%,
    rgba(100, 120, 150, 0.4) 75%,
    transparent 100%
  );
  transform: rotate(-55deg);
  transform-origin: center;
  z-index: 20;
  pointer-events: none;
  filter: blur(1px);
}
</style>
