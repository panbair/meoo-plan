<template>
  <div class="metronome-container" ref="containerRef">
    <div class="metronome-base"></div>
    <div class="metronome-pendulum" ref="pendulumRef">
      <div class="pendulum-rod"></div>
      <div class="pendulum-weight" ref="weightRef"></div>
      <div class="pendulum-pivot"></div>
    </div>
    <div class="metronome-scale">
      <div
        v-for="i in 10"
        :key="i"
        class="scale-mark"
        :style="{ '--position': i }"
      ></div>
    </div>
    <div class="bpm-display">{{ bpm }} BPM</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  initialBpm?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialBpm: 60,
  color: '#8b5cf6'
})

const bpm = ref(props.initialBpm)
const containerRef = ref<HTMLElement>()
const pendulumRef = ref<HTMLElement>()
const weightRef = ref<HTMLElement>()
let swingAnimation: gsap.Tween | null = null
let ctx: gsap.Context

const animateSwing = (duration: number) => {
  if (swingAnimation) swingAnimation.kill()

  swingAnimation = gsap.to(pendulumRef.value, {
    rotate: 45,
    duration: duration / 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    onRepeat: () => {
      // 摆动到端点时的闪烁效果
      gsap.to(weightRef.value, {
        scale: 1.2,
        opacity: 1,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      })
    }
  })
}

onMounted(() => {
  if (!pendulumRef.value) return

  ctx = gsap.context(() => {
    // 初始摆动动画
    const duration = 60 / bpm.value
    animateSwing(duration)

    // 鼠标移动改变 BPM
    containerRef.value?.addEventListener('mousemove', (e) => {
      const rect = containerRef.value!.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const newBpm = Math.round(40 + x * 120)
      bpm.value = newBpm

      const duration = 60 / newBpm
      animateSwing(duration)
    })

    // 点击摆锤
    pendulumRef.value?.addEventListener('click', () => {
      gsap.to(pendulumRef.value, {
        rotate: 90,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          const duration = 60 / bpm.value
          animateSwing(duration)
        }
      })
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (swingAnimation) swingAnimation.kill()
})
</script>

<style scoped lang="scss">
.metronome-container {
  position: relative;
  width: 200px;
  height: 300px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.metronome-base {
  position: absolute;
  bottom: 0;
  width: 100px;
  height: 20px;
  background: linear-gradient(135deg, #374151, #1f2937);
  border-radius: 10px 10px 0 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.metronome-pendulum {
  position: absolute;
  bottom: 20px;
  left: 50%;
  width: 4px;
  height: 200px;
  transform-origin: bottom center;
  transform: translateX(-50%);
}

.pendulum-rod {
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #4b5563, #6b7280);
  border-radius: 2px;
}

.pendulum-weight {
  position: absolute;
  top: 0;
  left: 50%;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, v-bind('props.color'), #4c1d95);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px v-bind('props.color');
  transition: all 0.1s;
}

.pendulum-pivot {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 12px;
  height: 12px;
  background: #9ca3af;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.metronome-scale {
  position: absolute;
  bottom: 30px;
  left: 50%;
  width: 160px;
  height: 140px;
  transform: translateX(-50%);
}

.scale-mark {
  position: absolute;
  left: 50%;
  bottom: calc(var(--position) * 14px);
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-50%);
}

.bpm-display {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
