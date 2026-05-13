<template>
  <section class="cross-crack-container" ref="containerRef">
    <!-- 背景层 -->
    <div class="crack-bg"></div>

    <!-- 四块残片容器 -->
    <div class="pieces-layer">
      <!-- 左上 -->
      <div class="crack-piece top-left" ref="topLeftRef">
        <img :src="imageUrl" alt="" />
      </div>
      <!-- 右上 -->
      <div class="crack-piece top-right" ref="topRightRef">
        <img :src="imageUrl" alt="" />
      </div>
      <!-- 左下 -->
      <div class="crack-piece bottom-left" ref="bottomLeftRef">
        <img :src="imageUrl" alt="" />
      </div>
      <!-- 右下 -->
      <div class="crack-piece bottom-right" ref="bottomRightRef">
        <img :src="imageUrl" alt="" />
      </div>
    </div>

    <!-- 十字切缝线 -->
    <div class="cross-lines" ref="crossLinesRef">
      <div class="h-line"></div>
      <div class="v-line"></div>
    </div>

    <!-- 中心交汇辉光 -->
    <div class="center-glow" ref="centerGlowRef"></div>

    <!-- 最终十字暗痕 -->
    <div class="final-cross" ref="finalCrossRef">
      <div class="fc-h"></div>
      <div class="fc-v"></div>
    </div>
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
const topLeftRef = ref<HTMLElement | null>(null)
const topRightRef = ref<HTMLElement | null>(null)
const bottomLeftRef = ref<HTMLElement | null>(null)
const bottomRightRef = ref<HTMLElement | null>(null)
const crossLinesRef = ref<HTMLElement | null>(null)
const centerGlowRef = ref<HTMLElement | null>(null)
const finalCrossRef = ref<HTMLElement | null>(null)

const imageUrl = 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80'

onMounted(() => {
  if (!containerRef.value) return

  const container = containerRef.value

  // 初始分离状态
  gsap.set(topLeftRef.value, { x: -35, y: -40, rotation: -3, opacity: 1 })
  gsap.set(topRightRef.value, { x: 35, y: -35, rotation: 4, opacity: 1 })
  gsap.set(bottomLeftRef.value, { x: -40, y: 35, rotation: 4, opacity: 1 })
  gsap.set(bottomRightRef.value, { x: 40, y: 40, rotation: -3, opacity: 1 })

  gsap.set(crossLinesRef.value, { opacity: 0 })
  gsap.set(centerGlowRef.value, { opacity: 0, scale: 0 })
  gsap.set(finalCrossRef.value, { opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      end: 'center center',
      scrub: 1.5,
    },
  })

  // 四块同时合拢
  tl.to([topLeftRef.value, topRightRef.value, bottomLeftRef.value, bottomRightRef.value], {
    x: 0,
    y: 0,
    rotation: 0,
    opacity: 1,
    ease: 'power3.inOut',
    stagger: 0.05,
  }, 0)

  // 十字线显现
  tl.to(crossLinesRef.value, {
    opacity: 0.8,
    duration: 0.3,
  }, 0.5)

  // 中心辉光脉冲
  tl.to(centerGlowRef.value, {
    opacity: 1,
    scale: 1.5,
    duration: 0.2,
    ease: 'power2.out',
  }, 0.75)
  tl.to(centerGlowRef.value, {
    opacity: 0,
    scale: 3,
    duration: 0.4,
    ease: 'power2.out',
  }, 0.9)

  // 十字线消失
  tl.to(crossLinesRef.value, {
    opacity: 0,
    duration: 0.3,
  }, 0.85)

  // 最终暗痕显现
  tl.to(finalCrossRef.value, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.inOut',
  }, 0.95)

  cleanupFns.push(() => {
    ScrollTrigger.getAll().forEach(st => st.kill())
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.cross-crack-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #08080f 0%, #0f0f1a 50%, #08080f 100%);
}

.crack-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 100% 80% at 30% 60%, rgba(80, 50, 120, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse 80% 100% at 70% 40%, rgba(50, 80, 120, 0.2) 0%, transparent 50%);
}

.pieces-layer {
  position: absolute;
  inset: 0;
}

.crack-piece {
  position: absolute;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 左上 - 从左上角出发
.top-left {
  top: 0;
  left: 0;
  width: 52%;
  height: 52%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

// 右上 - 从右上角出发
.top-right {
  top: 0;
  right: 0;
  width: 52%;
  height: 52%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

// 左下 - 从左下角出发
.bottom-left {
  bottom: 0;
  left: 0;
  width: 52%;
  height: 52%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

// 右下 - 从右下角出发
.bottom-right {
  bottom: 0;
  right: 0;
  width: 52%;
  height: 52%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.cross-lines {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;

  .h-line {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(150, 200, 255, 0.9) 20%,
      rgba(200, 230, 255, 1) 50%,
      rgba(150, 200, 255, 0.9) 80%,
      transparent 100%
    );
    transform: translateY(-50%);
    box-shadow:
      0 0 8px rgba(120, 180, 255, 0.6),
      0 0 16px rgba(120, 180, 255, 0.4);
  }

  .v-line {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(150, 200, 255, 0.9) 20%,
      rgba(200, 230, 255, 1) 50%,
      rgba(150, 200, 255, 0.9) 80%,
      transparent 100%
    );
    transform: translateX(-50%);
    box-shadow:
      0 0 8px rgba(120, 180, 255, 0.6),
      0 0 16px rgba(120, 180, 255, 0.4);
  }
}

.center-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(180, 220, 255, 0.7) 30%,
    rgba(120, 180, 255, 0.3) 60%,
    transparent 80%
  );
  z-index: 15;
  pointer-events: none;
  box-shadow:
    0 0 20px rgba(200, 230, 255, 0.9),
    0 0 40px rgba(150, 200, 255, 0.6),
    0 0 80px rgba(100, 180, 255, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.5);
}

.final-cross {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  opacity: 0;

  .fc-h {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(80, 100, 130, 0.3) 20%,
      rgba(80, 100, 130, 0.4) 50%,
      rgba(80, 100, 130, 0.3) 80%,
      transparent 100%
    );
    transform: translateY(-50%);
    filter: blur(1px);
  }

  .fc-v {
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(80, 100, 130, 0.3) 20%,
      rgba(80, 100, 130, 0.4) 50%,
      rgba(80, 100, 130, 0.3) 80%,
      transparent 100%
    );
    transform: translateX(-50%);
    filter: blur(1px);
  }
}
</style>
