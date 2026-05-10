<template>
  <div class="infinity-container" ref="containerRef">
    <svg class="infinity-svg" viewBox="0 0 200 100">
      <defs>
        <linearGradient id="infinity-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :style="{ stopColor: colors[0] }" />
          <stop offset="50%" :style="{ stopColor: colors[1] }" />
          <stop offset="100%" :style="{ stopColor: colors[2] }" />
        </linearGradient>
      </defs>
      <path
        ref="pathRef"
        class="infinity-path"
        d="M 25 50 C 25 25, 75 25, 100 50 C 125 75, 175 75, 175 50 C 175 25, 125 25, 100 50 C 75 75, 25 75, 25 50"
        fill="none"
        stroke="url(#infinity-gradient)"
        stroke-width="4"
        stroke-linecap="round"
      />
      <circle
        ref="dotRef"
        class="moving-dot"
        cx="0"
        cy="0"
        r="8"
        :fill="colors[0]"
      />
    </svg>
    <div class="glow-effect" ref="glowRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  size?: number
  colors?: string[]
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  colors: () => ['#f472b6', '#8b5cf6', '#3b82f6'],
  speed: 3
})

const containerRef = ref<HTMLElement>()
const pathRef = ref<SVGPathElement>()
const dotRef = ref<SVGCircleElement>()
const glowRef = ref<HTMLElement>()
let ctx: gsap.Context

onMounted(() => {
  if (!pathRef.value || !dotRef.value) return

  ctx = gsap.context(() => {
    const path = pathRef.value!
    const dot = dotRef.value!

    // 获取路径总长度
    const pathLength = path.getTotalLength()

    // 创建点沿路径移动的动画
    gsap.to(dot, {
      motionPath: {
        path: path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      },
      duration: props.speed,
      repeat: -1,
      ease: 'none'
    })

    // 颜色渐变动画
    gsap.to(dot, {
      fill: props.colors[1],
      duration: props.speed / 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 辉光效果
    gsap.to(glowRef.value, {
      scale: 1.5,
      opacity: 0,
      duration: 1,
      repeat: -1,
      ease: 'power2.out'
    })

    // 路径脉冲效果
    gsap.to(path, {
      strokeWidth: 6,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 鼠标悬停效果
    containerRef.value?.addEventListener('mouseenter', () => {
      gsap.to(dot, { scale: 1.5, duration: 0.3 })
      gsap.to(path, { strokeWidth: 8, duration: 0.3 })
    })

    containerRef.value?.addEventListener('mouseleave', () => {
      gsap.to(dot, { scale: 1, duration: 0.3 })
      gsap.to(path, { strokeWidth: 4, duration: 0.3 })
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.infinity-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 20px;
}

.infinity-svg {
  width: 300px;
  height: 150px;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.3));
}

.infinity-path {
  filter: drop-shadow(0 0 5px currentColor);
}

.moving-dot {
  filter: drop-shadow(0 0 8px currentColor);
}

.glow-effect {
  position: absolute;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.6), transparent);
  border-radius: 50%;
  pointer-events: none;
}

@media (max-width: 768px) {
  .infinity-svg {
    width: 200px;
    height: 100px;
  }
}
</style>
