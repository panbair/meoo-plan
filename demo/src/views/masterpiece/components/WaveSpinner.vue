<template>
  <div class="wave-spinner-container" ref="containerRef">
    <div class="spinner-wrapper">
      <div
        v-for="(bar, index) in barCount"
        :key="index"
        ref="barRefs"
        class="wave-bar"
        :style="{ '--delay': index }"
      ></div>
    </div>
    <div class="spinner-core"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  barCount?: number
  colors?: string[]
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  barCount: 12,
  colors: () => ['#8b5cf6', '#3b82f6', '#ec4899'],
  speed: 0.5
})

const containerRef = ref<HTMLElement>()
const barRefs = ref<HTMLElement[]>([])
let ctx: gsap.Context

onMounted(() => {
  if (!containerRef.value || barRefs.value.length === 0) return

  ctx = gsap.context(() => {
    const bars = barRefs.value

    // 创建波浪动画
    bars.forEach((bar, index) => {
      gsap.to(bar, {
        scaleY: [0.3, 1, 0.3],
        opacity: [0.4, 1, 0.4],
        duration: props.speed,
        repeat: -1,
        delay: index * 0.08,
        ease: 'sine.inOut'
      })

      // 颜色循环动画
      gsap.to(bar, {
        backgroundColor: props.colors[(index + 1) % props.colors.length],
        duration: 2,
        repeat: -1,
        delay: index * 0.1,
        ease: 'none'
      })
    })

    // 整体旋转
    const wrapper = containerRef.value.querySelector('.spinner-wrapper') as HTMLElement
    gsap.to(wrapper, {
      rotate: 360,
      duration: 10,
      repeat: -1,
      ease: 'none'
    })

    // 核心脉冲
    const core = containerRef.value.querySelector('.spinner-core') as HTMLElement
    gsap.to(core, {
      scale: 0.8,
      opacity: 0.5,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 鼠标悬停加速
    containerRef.value.addEventListener('mouseenter', () => {
      bars.forEach((bar, index) => {
        gsap.to(bar, {
          duration: props.speed * 0.5,
          overwrite: true
        })
      })
      gsap.to(wrapper, {
        duration: 3,
        overwrite: true
      })
    })

    containerRef.value.addEventListener('mouseleave', () => {
      bars.forEach((bar) => {
        gsap.to(bar, {
          duration: props.speed,
          overwrite: true
        })
      })
      gsap.to(wrapper, {
        duration: 10,
        overwrite: true
      })
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.wave-spinner-container {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wave-bar {
  position: absolute;
  width: 6px;
  height: 60px;
  background: v-bind('props.colors[0]');
  border-radius: 3px;
  transform-origin: center;
  left: 50%;
  top: 50%;
  margin-left: -3px;
  margin-top: -30px;
  box-shadow: 0 0 10px currentColor;
  transform: rotate(calc(var(--delay) * 30deg)) translateY(-70px);
}

.spinner-core {
  position: absolute;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.8), transparent);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

@media (max-width: 768px) {
  .wave-spinner-container {
    width: 150px;
    height: 150px;
  }

  .wave-bar {
    width: 4px;
    height: 45px;
    margin-left: -2px;
    margin-top: -22.5px;
    transform: rotate(calc(var(--delay) * 30deg)) translateY(-52.5px);
  }
}
</style>
