<template>
  <div ref="parentRef" class="card-img-stage">
    <!-- 背景层 -->
    <div ref="bgRef" class="stage-bg">
      <div class="bg-gradient"></div>
    </div>

    <!-- 远景暗影层 -->
    <div ref="shadowLayerRef" class="shadow-layer">
      <div class="shadow-element shadow-1"></div>
      <div class="shadow-element shadow-2"></div>
      <div class="shadow-element shadow-3"></div>
    </div>

    <!-- 主图层 -->
    <div ref="mainContainerRef" class="main-container">
      <!-- 画框 -->
      <div ref="frameRef" class="stage-frame">
        <!-- 内发光 -->
        <div ref="innerGlowRef" class="frame-inner-glow"></div>
        
        <!-- 图片 -->
        <div ref="imageWrapperRef" class="image-wrapper">
          <img
            ref="imageRef"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
            alt="光影舞台"
            class="stage-image"
          />
          <!-- 扫描顶光 -->
          <div ref="topLightRef" class="top-light"></div>
          <!-- 边缘光 -->
          <div ref="edgeLightRef" class="frame-edge-light"></div>
        </div>
      </div>
    </div>

    <!-- 前景光斑层 -->
    <div ref="foregroundLayerRef" class="foreground-layer">
      <div ref="lightSpot1Ref" class="light-spot spot-1"></div>
      <div ref="lightSpot2Ref" class="light-spot spot-2"></div>
      <div ref="lightSpot3Ref" class="light-spot spot-3"></div>
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
const bgRef = ref<HTMLElement | null>(null)
const shadowLayerRef = ref<HTMLElement | null>(null)
const mainContainerRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const innerGlowRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const topLightRef = ref<HTMLElement | null>(null)
const edgeLightRef = ref<HTMLElement | null>(null)
const foregroundLayerRef = ref<HTMLElement | null>(null)
const lightSpot1Ref = ref<HTMLElement | null>(null)
const lightSpot2Ref = ref<HTMLElement | null>(null)
const lightSpot3Ref = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value) return
  if (!shadowLayerRef.value || !mainContainerRef.value || !foregroundLayerRef.value) return
  if (!frameRef.value || !imageWrapperRef.value || !imageRef.value) return
  if (!topLightRef.value || !edgeLightRef.value || !innerGlowRef.value) return
  if (!lightSpot1Ref.value || !lightSpot2Ref.value || !lightSpot3Ref.value) return

  // 初始状态
  gsap.set(imageWrapperRef.value, {
    rotateY: -2.5,
    translateZ: -15,
    translateX: 0
  })
  gsap.set(imageRef.value, { filter: 'brightness(0.7)' })
  gsap.set(topLightRef.value, { x: '-20%', opacity: 0 })
  gsap.set(innerGlowRef.value, { opacity: 0 })
  gsap.set(edgeLightRef.value, { opacity: 0 })
  gsap.set([lightSpot1Ref.value, lightSpot2Ref.value, lightSpot3Ref.value], {
    opacity: 0.1,
    y: 0
  })
  gsap.set(shadowLayerRef.value, { opacity: 0.3, y: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: true
    }
  })

  // 主图 3D 动画
  tl.to(imageWrapperRef.value, {
    rotateY: 0,
    translateZ: 0,
    translateX: 4,
    duration: 1,
    ease: 'power2.out'
  }, 0)

  // 图片亮度
  tl.to(imageRef.value, {
    filter: 'brightness(1)',
    duration: 1,
    ease: 'power2.out'
  }, 0)

  // 扫描顶光
  tl.to(topLightRef.value, {
    x: '120%',
    opacity: 0.12,
    duration: 1,
    ease: 'none'
  }, 0)

  // 内发光
  tl.to(innerGlowRef.value, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, 0)

  // 边缘光
  tl.to(edgeLightRef.value, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, 0.2)

  // 前景光斑 - 快速掠动
  tl.to(lightSpot1Ref.value, {
    y: -80,
    opacity: 0.25,
    duration: 1,
    ease: 'power1.out'
  }, 0)
  tl.to(lightSpot2Ref.value, {
    y: -60,
    opacity: 0.2,
    duration: 1,
    ease: 'power1.out'
  }, 0)
  tl.to(lightSpot3Ref.value, {
    y: -100,
    opacity: 0.18,
    duration: 1,
    ease: 'power1.out'
  }, 0)

  // 远景暗影 - 缓慢后撤
  tl.to(shadowLayerRef.value, {
    y: -30,
    opacity: 0.5,
    duration: 1,
    ease: 'power1.out'
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
.card-img-stage {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0d0d12 0%, #151520 50%, #0d0d12 100%);
  overflow: hidden;
  position: relative;
}

// 背景层
.stage-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 60% at 50% 50%,
      rgba(40, 40, 60, 0.3) 0%,
      transparent 70%
    );
  }
}

// 远景暗影层
.shadow-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  perspective: 1500px;
}

.shadow-element {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 70%
  );
  filter: blur(40px);
}

.shadow-1 {
  top: 20%;
  left: 10%;
  width: 300px;
  height: 200px;
}

.shadow-2 {
  top: 60%;
  right: 15%;
  width: 250px;
  height: 180px;
}

.shadow-3 {
  bottom: 15%;
  left: 30%;
  width: 200px;
  height: 150px;
}

// 主容器
.main-container {
  position: relative;
  z-index: 10;
  perspective: 1500px;
}

// 画框
.stage-frame {
  position: relative;
  width: 70vmin;
  height: 50vmin;
  max-width: 700px;
  max-height: 500px;
  background: linear-gradient(145deg, #252530 0%, #18181f 50%, #101018 100%);
  border-radius: 6px;
  box-shadow: 
    0 40px 100px rgba(0, 0, 0, 0.7),
    0 15px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.frame-inner-glow {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  background: radial-gradient(
    ellipse 60% 40% at 50% 30%,
    rgba(255, 250, 240, 0.06) 0%,
    transparent 60%
  );
  pointer-events: none;
  opacity: 0;
}

.image-wrapper {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  border-radius: 4px;
  overflow: hidden;
  transform-style: preserve-3d;
  transform: rotateY(-2.5deg) translateZ(-15px);
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.4);
}

.stage-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

// 扫描顶光
.top-light {
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 250, 240, 0.15) 40%,
    rgba(255, 250, 240, 0.25) 50%,
    rgba(255, 250, 240, 0.15) 60%,
    transparent 100%
  );
  pointer-events: none;
  opacity: 0;
  transform: translateX(-20%);
}

.frame-edge-light {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  pointer-events: none;
  opacity: 0;
  box-shadow: 
    inset 0 0 30px rgba(255, 255, 255, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

// 前景光斑层
.foreground-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
}

.light-spot {
  position: absolute;
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.1;
}

.spot-1 {
  top: 30%;
  left: 15%;
  width: 120px;
  height: 80px;
  background: radial-gradient(circle, rgba(255, 220, 180, 0.6) 0%, transparent 70%);
}

.spot-2 {
  top: 50%;
  right: 20%;
  width: 100px;
  height: 70px;
  background: radial-gradient(circle, rgba(255, 240, 220, 0.5) 0%, transparent 70%);
}

.spot-3 {
  top: 25%;
  right: 25%;
  width: 80px;
  height: 60px;
  background: radial-gradient(circle, rgba(255, 230, 200, 0.5) 0%, transparent 70%);
}
</style>
