<template>
  <section ref="parentRef" class="xray-scan-container">
    <!-- 原始图片 -->
    <div class="xr-original-layer">
      <img :src="imageUrl" alt="" class="xr-img" />
    </div>
    <!-- X光反色层 -->
    <div ref="xrayLayerRef" class="xr-xray-layer">
      <img :src="imageUrl" alt="" class="xr-img xr-inverted" />
    </div>
    <!-- 扫描线 -->
    <div ref="scanLineRef" class="xr-scan-line">
      <div class="xr-scan-beam"></div>
      <div class="xr-scan-edge"></div>
    </div>
    <!-- 扫描遮罩（控制X光层可见区域） -->
    <div ref="scanMaskRef" class="xr-scan-mask">
      <img :src="imageUrl" alt="" class="xr-img xr-inverted" />
    </div>
    <!-- 扫描数据UI -->
    <div ref="dataRef" class="xr-data-panel">
      <div class="xr-data-row">
        <span class="xr-label">SCAN MODE</span>
        <span class="xr-value">X-RAY</span>
      </div>
      <div class="xr-data-row">
        <span class="xr-label">DENSITY</span>
        <span class="xr-value">87.3%</span>
      </div>
      <div class="xr-data-row">
        <span class="xr-label">SPECTRUM</span>
        <span class="xr-value">UV-420nm</span>
      </div>
      <div class="xr-progress-bar">
        <div ref="progressRef" class="xr-progress-fill"></div>
      </div>
    </div>
    <!-- 网格 -->
    <div ref="gridRef" class="xr-grid"></div>
    <div ref="flashRef" class="xr-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const xrayLayerRef = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)
const scanMaskRef = ref<HTMLElement | null>(null)
const dataRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

onMounted(() => {
  if (!parentRef.value) {
    return
  }
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) {
    return
  }

  // 初始状态
  gsap.set(scanLineRef.value, { left: '-5%', opacity: 0 })
  gsap.set(scanMaskRef.value, { clipPath: 'inset(0 100% 0 0)' })
  gsap.set(dataRef.value, { opacity: 0, x: 30 })
  gsap.set(gridRef.value, { opacity: 0 })
  gsap.set(flashRef.value, { opacity: 0 })
  if (progressRef.value) {
    gsap.set(progressRef.value, { width: '0%' })
  }

  // ===== 阶段1: 扫描线从左扫到右 =====
  const scanTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 15%',
      scrub: 1.5,
    },
  })

  // 扫描线出现
  scanTl.to(scanLineRef.value, {
    opacity: 1,
    duration: 0.05,
  }, 0)

  // 网格出现
  scanTl.to(gridRef.value, {
    opacity: 0.15,
    duration: 0.1,
  }, 0)

  // 数据面板入场
  scanTl.to(dataRef.value, {
    opacity: 1,
    x: 0,
    duration: 0.15,
    ease: 'power2.out',
  }, 0.05)

  // 扫描线从左移到右 + 遮罩同步展开
  scanTl.to(scanLineRef.value, {
    left: '105%',
    duration: 0.6,
    ease: 'none',
  }, 0.05)

  scanTl.to(scanMaskRef.value, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 0.6,
    ease: 'none',
  }, 0.05)

  // 进度条
  if (progressRef.value) {
    scanTl.to(progressRef.value, {
      width: '100%',
      duration: 0.6,
      ease: 'none',
    }, 0.05)
  }

  // 扫描完成：反色层（遮罩）逐渐消退回正常
  scanTl.to(scanMaskRef.value, {
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
  }, 0.7)

  // 扫描线消失
  scanTl.to(scanLineRef.value, {
    opacity: 0,
    duration: 0.08,
  }, 0.68)

  // 数据面板消退
  scanTl.to(dataRef.value, {
    opacity: 0,
    x: 20,
    duration: 0.15,
  }, 0.75)

  // 网格消退
  scanTl.to(gridRef.value, {
    opacity: 0,
    duration: 0.15,
  }, 0.78)

  // 闪光
  scanTl.to(flashRef.value, { opacity: 0.5, duration: 0.08 }, 0.7)
  scanTl.to(flashRef.value, { opacity: 0, duration: 0.2 }, 0.78)

  cleanupFns.push(() => {
    scanTl.scrollTrigger?.kill()
    scanTl.kill()
  })
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.xray-scan-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a10;
}

.xr-original-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.xr-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.xr-inverted {
  filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.3);
}

// X光层（全屏，但初始不可见）
.xr-xray-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0.15;
}

// 扫描遮罩层
.xr-scan-mask {
  position: absolute;
  inset: 0;
  z-index: 5;
  overflow: hidden;
}

// 扫描线
.xr-scan-line {
  position: absolute;
  top: 0;
  width: 3px;
  height: 100%;
  z-index: 15;
  pointer-events: none;

  .xr-scan-beam {
    position: absolute;
    left: -40px;
    width: 80px;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 200, 255, 0.15) 30%,
      rgba(0, 200, 255, 0.4) 50%,
      rgba(0, 200, 255, 0.15) 70%,
      transparent
    );
  }

  .xr-scan-edge {
    position: absolute;
    left: 0;
    width: 3px;
    height: 100%;
    background: rgba(0, 220, 255, 0.8);
    box-shadow:
      0 0 8px rgba(0, 200, 255, 0.6),
      0 0 20px rgba(0, 200, 255, 0.3);
  }
}

// 数据面板
.xr-data-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 18;
  padding: 16px 20px;
  background: rgba(0, 20, 40, 0.7);
  border: 1px solid rgba(0, 200, 255, 0.3);
  border-radius: 6px;
  backdrop-filter: blur(8px);
  will-change: opacity, transform;

  .xr-data-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 6px;
  }

  .xr-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    color: rgba(0, 200, 255, 0.5);
    font-family: 'Courier New', monospace;
  }

  .xr-value {
    font-size: 10px;
    letter-spacing: 0.1em;
    color: rgba(0, 220, 255, 0.9);
    font-family: 'Courier New', monospace;
    font-weight: 700;
  }

  .xr-progress-bar {
    margin-top: 8px;
    height: 3px;
    background: rgba(0, 200, 255, 0.15);
    border-radius: 2px;
    overflow: hidden;

    .xr-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, rgba(0, 200, 255, 0.6), rgba(0, 255, 200, 0.8));
      border-radius: 2px;
    }
  }
}

// 扫描网格
.xr-grid {
  position: absolute;
  inset: 0;
  z-index: 4;
  background:
    linear-gradient(rgba(0, 200, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 200, 255, 0.06) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.xr-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: rgba(0, 220, 255, 0.3);
  pointer-events: none;
}
</style>

