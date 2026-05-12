<template>
  <div ref="parentRef" class="card-img-perspective">
    <!-- 深邃展墙背景 -->
    <div class="wall-bg">
      <div class="wall-gradient"></div>
      <div class="wall-grid"></div>
      <div class="ambient-glow"></div>
    </div>

    <!-- 画框组合 -->
    <div ref="frameGroupRef" class="frame-group">
      <!-- 最外层大阴影 -->
      <div ref="outerShadowRef" class="frame-shadow-outer"></div>
      
      <!-- 外层画框 -->
      <div ref="outerFrameRef" class="frame-outer">
        <div class="frame-mat"></div>
      </div>
      
      <!-- 内层画框 -->
      <div ref="innerFrameRef" class="frame-inner">
        <!-- 画框金边 -->
        <div class="frame-gold-edge"></div>
        
        <!-- 图片容器 -->
        <div ref="imageContainerRef" class="image-container">
          <img
            ref="imageRef"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
            alt="3D透视画框"
            class="perspective-image"
          />
          
          <!-- 扫描高光 -->
          <div ref="scanLightRef" class="scan-light"></div>
          
          <!-- 顶部聚光 -->
          <div ref="topLightRef" class="top-light"></div>
          
          <!-- 玻璃反光 -->
          <div ref="glassRef" class="glass-reflection"></div>
        </div>
      </div>
      
      <!-- 画框标签 -->
      <div ref="labelRef" class="frame-label">
        <span class="label-text">ALPINE HORIZON</span>
        <span class="label-line"></span>
      </div>
    </div>

    <!-- 前景装饰 -->
    <div class="foreground-decor">
      <div class="corner-accent corner-tl"></div>
      <div class="corner-accent corner-tr"></div>
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
const frameGroupRef = ref<HTMLElement | null>(null)
const outerShadowRef = ref<HTMLElement | null>(null)
const outerFrameRef = ref<HTMLElement | null>(null)
const innerFrameRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const scanLightRef = ref<HTMLElement | null>(null)
const topLightRef = ref<HTMLElement | null>(null)
const glassRef = ref<HTMLElement | null>(null)
const labelRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !frameGroupRef.value) return
  if (!outerShadowRef.value || !outerFrameRef.value || !innerFrameRef.value) return
  if (!imageContainerRef.value || !imageRef.value) return
  if (!scanLightRef.value || !topLightRef.value || !glassRef.value || !labelRef.value) return

  // 初始状态
  gsap.set(frameGroupRef.value, {
    rotateY: -3,
    rotateX: 2,
    translateZ: -30,
    translateY: 20
  })
  gsap.set(imageRef.value, { 
    filter: 'brightness(0.5) saturate(0.8)',
    scale: 1.05
  })
  gsap.set(scanLightRef.value, { x: '-100%', opacity: 0 })
  gsap.set(topLightRef.value, { opacity: 0 })
  gsap.set(glassRef.value, { opacity: 0 })
  gsap.set(labelRef.value, { opacity: 0, y: 20 })
  gsap.set(outerShadowRef.value, { opacity: 0.3, scale: 0.95 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: true
    }
  })

  // 画框 3D 归位
  tl.to(frameGroupRef.value, {
    rotateY: 0,
    rotateX: 0,
    translateZ: 0,
    translateY: 0,
    duration: 1,
    ease: 'power2.out'
  }, 0)

  // 阴影增强
  tl.to(outerShadowRef.value, {
    opacity: 0.8,
    scale: 1,
    duration: 1,
    ease: 'power2.out'
  }, 0)

  // 图片效果
  tl.to(imageRef.value, {
    filter: 'brightness(1) saturate(1.1)',
    scale: 1,
    duration: 1,
    ease: 'power2.out'
  }, 0)

  // 扫描高光
  tl.to(scanLightRef.value, {
    x: '100%',
    opacity: 0.2,
    duration: 1.2,
    ease: 'power1.inOut'
  }, 0)

  // 顶部聚光
  tl.to(topLightRef.value, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, 0.2)

  // 玻璃反光
  tl.to(glassRef.value, {
    opacity: 0.1,
    duration: 0.6,
    ease: 'power2.out'
  }, 0.4)

  // 标签
  tl.to(labelRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, 0.6)

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
.card-img-perspective {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0a0a0e 0%, #12121a 40%, #0a0a0e 100%);
  overflow: hidden;
  position: relative;
  perspective: 1200px;
}

// 深邃展墙背景
.wall-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .wall-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 60% at 50% 40%,
      rgba(30, 30, 50, 0.4) 0%,
      transparent 60%
    );
  }

  .wall-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .ambient-glow {
    position: absolute;
    top: 20%;
    left: 50%;
    width: 50%;
    height: 40%;
    transform: translateX(-50%);
    background: radial-gradient(
      ellipse at center,
      rgba(255, 250, 240, 0.05) 0%,
      transparent 70%
    );
    filter: blur(60px);
  }
}

// 画框组合
.frame-group {
  position: relative;
  transform-style: preserve-3d;
}

// 最外层阴影
.frame-shadow-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110%;
  height: 110%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 40%,
    transparent 70%
  );
  filter: blur(40px);
  opacity: 0.3;
  z-index: -1;
}

// 外层画框
.frame-outer {
  position: relative;
  width: 70vmin;
  height: 50vmin;
  max-width: 720px;
  max-height: 520px;
  background: linear-gradient(145deg, #2a2820 0%, #1a1815 50%, #0f0e0c 100%);
  border-radius: 3px;
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.8),
    0 10px 30px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 -1px 0 rgba(0, 0, 0, 0.5);
}

.frame-mat {
  position: absolute;
  inset: 16px;
  background: linear-gradient(145deg, #252320 0%, #1a1815 100%);
  border-radius: 2px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
}

// 内层画框
.frame-inner {
  position: absolute;
  top: 32px;
  left: 32px;
  right: 32px;
  bottom: 48px;
  background: linear-gradient(145deg, #3a3830 0%, #252220 100%);
  border-radius: 2px;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

.frame-gold-edge {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(180, 160, 120, 0.3);
  border-radius: 2px;
  box-shadow: 
    inset 0 0 10px rgba(180, 160, 120, 0.1),
    0 0 20px rgba(180, 160, 120, 0.05);
}

// 图片容器
.image-container {
  position: absolute;
  inset: 8px;
  overflow: hidden;
  border-radius: 1px;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.3);
}

.perspective-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5) saturate(0.8);
}

// 扫描高光
.scan-light {
  position: absolute;
  top: 0;
  left: 0;
  width: 35%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 100%
  );
  pointer-events: none;
  transform: skewX(-10deg);
}

// 顶部聚光
.top-light {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 100%
  );
  pointer-events: none;
}

// 玻璃反光
.glass-reflection {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 30%,
    transparent 60%,
    rgba(255, 255, 255, 0.03) 100%
  );
  pointer-events: none;
}

// 画框标签
.frame-label {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;

  .label-text {
    font-family: 'Georgia', serif;
    font-size: 12px;
    letter-spacing: 4px;
    color: rgba(180, 160, 120, 0.6);
    text-transform: uppercase;
  }

  .label-line {
    width: 40px;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(180, 160, 120, 0.3) 0%,
      rgba(180, 160, 120, 0.6) 50%,
      rgba(180, 160, 120, 0.3) 100%
    );
  }
}

// 前景装饰
.foreground-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

.corner-accent {
  position: absolute;
  width: 60px;
  height: 60px;
  border-color: rgba(180, 160, 120, 0.2);
  border-style: solid;
}

.corner-tl {
  top: 30px;
  left: 30px;
  border-width: 1px 0 0 1px;
}

.corner-tr {
  top: 30px;
  right: 30px;
  border-width: 1px 1px 0 0;
}
</style>
