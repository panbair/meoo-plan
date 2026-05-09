<template>
  <div class="pyramid-container" ref="containerRef">
    <div class="pyramid" ref="pyramidRef">
      <div class="pyramid-face front">{{ icons[0] }}</div>
      <div class="pyramid-face back">{{ icons[1] }}</div>
      <div class="pyramid-face left">{{ icons[2] }}</div>
      <div class="pyramid-face right">{{ icons[3] }}</div>
      <div class="pyramid-face bottom">{{ icons[4] }}</div>
    </div>
    <div class="pyramid-shadow"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  size?: number
  icons?: string[]
  rotateSpeed?: number
  levitateSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  icons: () => ['💎', '🌙', '⭐', '✨', '🔮'],
  rotateSpeed: 15,
  levitateSpeed: 2
})

// 预计算样式值
const sizePx = computed(() => `${props.size}px`)
const thirdSizePx = computed(() => `${props.size / 3}px`)
const negativeThirdSizePx = computed(() => `${-props.size / 3}px`)
const bottomHeightPx = computed(() => `${props.size * 0.6}px`)
const negativeZeroThreeSizePx = computed(() => `${-props.size * 0.3}px`)
const shadowSizePx = computed(() => `${props.size * 0.8}px`)

const containerRef = ref<HTMLElement>()
const pyramidRef = ref<HTMLElement>()
let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 金字塔自转
    gsap.to(pyramidRef.value, {
      rotateY: 360,
      duration: props.rotateSpeed,
      repeat: -1,
      ease: 'none'
    })

    // 悬浮动画
    gsap.to(containerRef.value, {
      y: -30,
      duration: props.levitateSpeed,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 阴影跟随
    gsap.to('.pyramid-shadow', {
      scale: 0.7,
      opacity: 0.3,
      duration: props.levitateSpeed,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 鼠标悬停效果
    containerRef.value?.addEventListener('mouseenter', () => {
      gsap.to(containerRef.value, { y: -60, duration: 0.5, ease: 'power2.out' })
      gsap.to(pyramidRef.value, { timeScale: 3, duration: 0.5 })
    })

    containerRef.value?.addEventListener('mouseleave', () => {
      gsap.to(containerRef.value, { y: 0, duration: 0.5, ease: 'power2.out' })
      gsap.to(pyramidRef.value, { timeScale: 1, duration: 0.5 })
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.pyramid-container {
  width: v-bind('sizePx');
  height: v-bind('sizePx');
  perspective: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.pyramid {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.pyramid-face {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    rgba(147, 51, 234, 0.2),
    rgba(79, 70, 229, 0.3)
  );
  border: 1px solid rgba(192, 132, 252, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  backdrop-filter: blur(10px);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  backface-visibility: visible;
}

.front {
  transform: translateZ(v-bind('thirdSizePx')) rotateY(0deg);
}

.back {
  transform: translateZ(v-bind('negativeThirdSizePx')) rotateY(180deg);
}

.left {
  transform: translateZ(v-bind('thirdSizePx')) rotateY(-90deg);
}

.right {
  transform: translateZ(v-bind('negativeThirdSizePx')) rotateY(90deg);
}

.bottom {
  width: 100%;
  height: v-bind('bottomHeightPx');
  background: rgba(99, 102, 241, 0.3);
  transform: rotateX(90deg) translateZ(v-bind('negativeZeroThreeSizePx'));
  clip-path: none;
}

.pyramid-shadow {
  width: v-bind('shadowSizePx');
  height: 20px;
  background: radial-gradient(ellipse, rgba(99, 102, 241, 0.4), transparent);
  border-radius: 50%;
  margin-top: 20px;
  filter: blur(8px);
}
</style>
