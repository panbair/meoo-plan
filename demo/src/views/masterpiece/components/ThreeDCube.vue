<template>
  <div class="cube-container" ref="containerRef">
    <div class="cube" id="cube">
      <div class="cube-face front">{{ icons[0] }}</div>
      <div class="cube-face back">{{ icons[1] }}</div>
      <div class="cube-face right">{{ icons[2] }}</div>
      <div class="cube-face left">{{ icons[3] }}</div>
      <div class="cube-face top">{{ icons[4] }}</div>
      <div class="cube-face bottom">{{ icons[5] }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  size?: number
  icons?: string[]
  rotateSpeed?: number
  hoverSpeedMultiplier?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 300,
  icons: () => ['❄', '⚡', '🔥', '💧', '🌟', '🌙'],
  rotateSpeed: 20,
  hoverSpeedMultiplier: 3
})

const containerRef = ref<HTMLElement>()
const halfSize = computed(() => props.size / 2)
const sizePx = computed(() => `${props.size}px`)
const halfSizePx = computed(() => `${halfSize.value}px`)

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 自动旋转
    gsap.to('#cube', {
      rotationX: 360,
      rotationY: 360,
      duration: props.rotateSpeed,
      repeat: -1,
      ease: 'none'
    })

    // 鼠标悬停加速
    containerRef.value?.addEventListener('mouseenter', () => {
      gsap.to('#cube', { timeScale: props.hoverSpeedMultiplier, duration: 0.5 })
    })

    containerRef.value?.addEventListener('mouseleave', () => {
      gsap.to('#cube', { timeScale: 1, duration: 0.5 })
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.cube-container {
  width: v-bind(sizePx);
  height: v-bind(sizePx);
  perspective: 1000px;
  margin-left: 80px;
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.cube-face {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(124, 58, 237, 0.15);
  border: 2px solid rgba(167, 139, 250, 0.3);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  backdrop-filter: blur(10px);
  backface-visibility: visible;
}

.front { transform: translateZ(v-bind(halfSizePx)); }
.back { transform: rotateY(180deg) translateZ(v-bind(halfSizePx)); }
.right { transform: rotateY(90deg) translateZ(v-bind(halfSizePx)); }
.left { transform: rotateY(-90deg) translateZ(v-bind(halfSizePx)); }
.top { transform: rotateX(90deg) translateZ(v-bind(halfSizePx)); }
.bottom { transform: rotateX(-90deg) translateZ(v-bind(halfSizePx)); }

@media (max-width: 768px) {
  .cube-container {
    width: 200px;
    height: 200px;
    margin: 40px auto 0;
  }

  .cube-face {
    font-size: 2.5rem;
  }
}
</style>
