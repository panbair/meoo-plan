<template>
  <div class="visualizer-container" ref="containerRef">
    <div class="visualizer-bars" ref="barsRef">
      <div
        v-for="(bar, index) in bars"
        :key="index"
        class="bar"
        :class="`bar-${index}`"
        :style="{ width: barWidth + 'px' }"
      ></div>
    </div>
    <div class="visualizer-info">
      <span class="visualizer-label">{{ label }}</span>
      <div class="visualizer-level">
        <div class="level-bar" ref="levelBarRef"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  barCount?: number
  barWidth?: number
  label?: string
  speed?: number
  intensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  barCount: 20,
  barWidth: 12,
  label: 'AUDIO',
  speed: 0.5,
  intensity: 100
})

const containerRef = ref<HTMLElement>()
const barsRef = ref<HTMLElement>()
const levelBarRef = ref<HTMLElement>()

const bars = ref(Array(props.barCount).fill(0))
let ctx: gsap.Context
let animationInterval: number | null = null

function animateBars() {
  gsap.utils.toArray('.bar').forEach((bar: any, index) => {
    const height = Math.random() * props.intensity + 20
    gsap.to(bar, {
      height: height,
      duration: props.speed,
      ease: 'power2.inOut',
      onComplete: () => {
        const newHeight = Math.random() * props.intensity + 20
        gsap.to(bar, {
          height: newHeight,
          duration: props.speed,
          ease: 'power2.inOut'
        })
      }
    })
  })

  // 音量级别动画
  const level = Math.random() * 100
  gsap.to(levelBarRef.value, {
    width: level + '%',
    duration: props.speed,
    ease: 'power2.inOut'
  })
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始化动画
    animateBars()

    // 持续动画
    animationInterval = window.setInterval(() => {
      animateBars()
    }, props.speed * 1000)

    // 鼠标交互
    containerRef.value?.addEventListener('mouseenter', () => {
      gsap.to('.bar', {
        filter: 'brightness(1.5)',
        duration: 0.3
      })
    })

    containerRef.value?.addEventListener('mouseleave', () => {
      gsap.to('.bar', {
        filter: 'brightness(1)',
        duration: 0.3
      })
    })

    // 彩虹渐变动画
    gsap.to('.bar', {
      background: 'linear-gradient(to top, #8b5cf6, #ec4899, #f59e0b)',
      backgroundSize: '100% 300%',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }, containerRef.value)
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.visualizer-container {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(10px);
}

.visualizer-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  height: 200px;
  margin-bottom: 24px;
}

.bar {
  height: 20px;
  background: linear-gradient(to top, #8b5cf6, #ec4899);
  border-radius: 6px 6px 0 0;
  transition: all 0.3s;
}

.visualizer-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.visualizer-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  letter-spacing: 2px;
}

.visualizer-level {
  flex: 1;
  margin-left: 24px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.level-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  border-radius: 4px;
  transition: width 0.3s;
}
</style>
