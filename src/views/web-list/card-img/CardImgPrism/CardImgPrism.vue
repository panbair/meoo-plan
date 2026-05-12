<template>
  <div ref="parentRef" class="card-img-prism">
    <!-- 背景 -->
    <div class="prism-bg">
      <div class="bg-gradient"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 主容器 -->
    <div ref="containerRef" class="prism-container">
      <!-- 外发光 -->
      <div ref="glowRef" class="prism-glow"></div>

      <!-- 画框 -->
      <div ref="frameRef" class="prism-frame">
        <!-- 色层容器 -->
        <div class="color-layers">
          <!-- 红色层 -->
          <div ref="redLayerRef" class="color-layer layer-red">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
              alt="红色通道"
              class="channel-image"
            />
            <div ref="redBorderRef" class="layer-border border-red"></div>
          </div>

          <!-- 绿色层 -->
          <div ref="greenLayerRef" class="color-layer layer-green">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
              alt="绿色通道"
              class="channel-image"
            />
            <div ref="greenBorderRef" class="layer-border border-green"></div>
          </div>

          <!-- 蓝色层 -->
          <div ref="blueLayerRef" class="color-layer layer-blue">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
              alt="蓝色通道"
              class="channel-image"
            />
            <div ref="blueBorderRef" class="layer-border border-blue"></div>
          </div>
        </div>

        <!-- 主图 -->
        <img
          ref="mainImageRef"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="棱镜聚焦"
          class="main-image"
        />

        <!-- 虹彩镶边 -->
        <div ref="rainbowRef" class="rainbow-edge"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const redLayerRef = ref<HTMLElement | null>(null)
const greenLayerRef = ref<HTMLElement | null>(null)
const blueLayerRef = ref<HTMLElement | null>(null)
const redBorderRef = ref<HTMLElement | null>(null)
const greenBorderRef = ref<HTMLElement | null>(null)
const blueBorderRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLImageElement | null>(null)
const rainbowRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !frameRef.value) return
  if (!redLayerRef.value || !greenLayerRef.value || !blueLayerRef.value) return
  if (!mainImageRef.value || !glowRef.value || !rainbowRef.value) return

  // 初始状态
  gsap.set(redLayerRef.value, {
    translateX: -5,
    rotateY: -1.5,
    opacity: 0.8
  })
  gsap.set(greenLayerRef.value, {
    translateX: 0,
    rotateY: 0,
    opacity: 0.8
  })
  gsap.set(blueLayerRef.value, {
    translateX: 5,
    rotateY: 1.5,
    opacity: 0.8
  })
  gsap.set(mainImageRef.value, {
    filter: 'brightness(0.65) blur(2px)',
    opacity: 0
  })
  gsap.set([redBorderRef.value, greenBorderRef.value, blueBorderRef.value], {
    opacity: 0.6
  })
  gsap.set(rainbowRef.value, { opacity: 0 })
  gsap.set(glowRef.value, { opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: true
    }
  })

  // 红色层聚合
  tl.to(redLayerRef.value, {
    translateX: 0,
    rotateY: 0,
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut'
  }, 0)

  // 绿色层聚合
  tl.to(greenLayerRef.value, {
    translateX: 0,
    rotateY: 0,
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut'
  }, 0)

  // 蓝色层聚合
  tl.to(blueLayerRef.value, {
    translateX: 0,
    rotateY: 0,
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut'
  }, 0)

  // 主图渐显
  tl.to(mainImageRef.value, {
    filter: 'brightness(1) blur(0)',
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  }, 0.2)

  // 虹彩镶边
  tl.fromTo(rainbowRef.value,
    { opacity: 0 },
    { opacity: 0.8, duration: 0.5, ease: 'power2.out' },
    0.6
  )
  tl.to(rainbowRef.value, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in'
  }, 0.9)

  // 外发光
  tl.to(glowRef.value, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, 0.3)

  // 色层边缘镶边淡出
  tl.to([redBorderRef.value, greenBorderRef.value, blueBorderRef.value], {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.inOut'
  }, 0)

  cleanupFns.push(() => {
    ScrollTrigger.getAll().forEach(st => st.kill())
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-img-prism {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%);
  overflow: hidden;
  position: relative;
}

.prism-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 60% 50% at 50% 50%,
      rgba(60, 60, 100, 0.15) 0%,
      transparent 70%
    );
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
  }
}

.prism-container {
  position: relative;
  z-index: 10;
}

.prism-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgba(100, 120, 180, 0.15) 0%,
    rgba(80, 100, 160, 0.08) 40%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(40px);
  opacity: 0;
}

.prism-frame {
  position: relative;
  width: 70vmin;
  height: 50vmin;
  max-width: 700px;
  max-height: 500px;
  background: linear-gradient(145deg, #1a1a24 0%, #0d0d14 100%);
  border-radius: 8px;
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.color-layers {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.color-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  mix-blend-mode: screen;
  transform-style: preserve-3d;
}

.layer-red {
  background: rgba(255, 0, 0, 0.1);
}

.layer-green {
  background: rgba(0, 255, 0, 0.1);
}

.layer-blue {
  background: rgba(0, 0, 255, 0.1);
}

.channel-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(2) contrast(1.2);
}

.layer-red .channel-image {
  filter: saturate(2) contrast(1.3) hue-rotate(-20deg);
}

.layer-green .channel-image {
  filter: saturate(2) contrast(1.2) hue-rotate(0deg);
}

.layer-blue .channel-image {
  filter: saturate(2) contrast(1.3) hue-rotate(20deg);
}

.layer-border {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.6;
}

.border-red {
  box-shadow: inset 0 0 30px rgba(255, 0, 0, 0.3);
}

.border-green {
  box-shadow: inset 0 0 30px rgba(0, 255, 0, 0.3);
}

.border-blue {
  box-shadow: inset 0 0 30px rgba(0, 0, 255, 0.3);
}

.main-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.65) blur(2px);
  opacity: 0;
}

.rainbow-edge {
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  pointer-events: none;
  background: 
    linear-gradient(#1a1a24, #1a1a24) padding-box,
    linear-gradient(135deg, 
      rgba(255, 0, 0, 0.5) 0%,
      rgba(255, 165, 0, 0.4) 17%,
      rgba(255, 255, 0, 0.4) 33%,
      rgba(0, 255, 0, 0.4) 50%,
      rgba(0, 255, 255, 0.4) 67%,
      rgba(0, 0, 255, 0.4) 83%,
      rgba(255, 0, 255, 0.5) 100%
    ) border-box;
  opacity: 0;
}

// 顶部装饰
.prism-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(100, 120, 180, 0.3) 50%,
    transparent 100%
  );
  z-index: 20;
}

// 底部装饰
.prism-frame::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(80, 100, 160, 0.3) 50%,
    transparent 100%
  );
  z-index: 20;
}
</style>
