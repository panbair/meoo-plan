<template>
  <section ref="parentRef" class="infrared-container">
    <!-- 真实图片 -->
    <div class="ir-real-layer">
      <img :src="imageUrl" alt="" class="ir-img" />
    </div>
    <!-- 热成像层 -->
    <div ref="thermalLayerRef" class="ir-thermal-layer">
      <img :src="imageUrl" alt="" class="ir-img ir-thermal" />
      <div class="ir-thermal-overlay"></div>
    </div>
    <!-- 温度扫描条 -->
    <div ref="scanBarRef" class="ir-scan-bar"></div>
    <!-- 热点标记 -->
    <div
      v-for="(spot, i) in hotspots"
      :key="`spot-${i}`"
      :ref="(el) => setSpotRef(el, i)"
      class="ir-hotspot"
      :style="{ left: spot.x, top: spot.y }"
    >
      <div class="ir-hotspot-ring"></div>
      <div class="ir-hotspot-label">{{ spot.temp }}</div>
    </div>
    <!-- 温度色阶条 -->
    <div ref="scaleRef" class="ir-scale">
      <div class="ir-scale-bar"></div>
      <div class="ir-scale-labels">
        <span>-20°C</span>
        <span>0°C</span>
        <span>25°C</span>
        <span>50°C</span>
        <span>80°C</span>
      </div>
    </div>
    <!-- 数据面板 -->
    <div ref="panelRef" class="ir-panel">
      <div class="ir-panel-row">
        <span class="ir-p-label">MODE</span>
        <span class="ir-p-value">INFRARED</span>
      </div>
      <div class="ir-panel-row">
        <span class="ir-p-label">AVG TEMP</span>
        <span class="ir-p-value">34.7°C</span>
      </div>
      <div class="ir-panel-row">
        <span class="ir-p-label">MAX TEMP</span>
        <span class="ir-p-value ir-hot">68.2°C</span>
      </div>
    </div>
    <div ref="flashRef" class="ir-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const thermalLayerRef = ref<HTMLElement | null>(null)
const scanBarRef = ref<HTMLElement | null>(null)
const scaleRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const spotRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80'

const hotspots = [
  { x: '30%', y: '40%', temp: '62°C' },
  { x: '65%', y: '35%', temp: '71°C' },
  { x: '50%', y: '60%', temp: '45°C' },
  { x: '20%', y: '70%', temp: '38°C' },
]

const setSpotRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) {
    spotRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}

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

  // 初始：热成像可见
  gsap.set(thermalLayerRef.value, { opacity: 1 })
  gsap.set(scanBarRef.value, { top: '-5%', opacity: 0 })
  gsap.set(scaleRef.value, { opacity: 0, x: -20 })
  gsap.set(panelRef.value, { opacity: 0, y: 20 })
  gsap.set(flashRef.value, { opacity: 0 })
  spotRefs.forEach((s) => {
    if (s) {
      gsap.set(s, { opacity: 0, scale: 0 })
    }
  })

  // ===== 阶段1: 热成像展示 + UI入场 =====
  const thermalTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 10%',
      scrub: 1.8,
    },
  })

  // 扫描条从上到下
  thermalTl.to(scanBarRef.value, {
    opacity: 1,
    duration: 0.05,
  }, 0)
  thermalTl.to(scanBarRef.value, {
    top: '110%',
    duration: 0.4,
    ease: 'none',
  }, 0.02)
  thermalTl.to(scanBarRef.value, {
    opacity: 0,
    duration: 0.05,
  }, 0.4)

  // 色阶条
  thermalTl.to(scaleRef.value, {
    opacity: 1,
    x: 0,
    duration: 0.15,
    ease: 'power2.out',
  }, 0.05)

  // 数据面板
  thermalTl.to(panelRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.15,
    ease: 'power2.out',
  }, 0.08)

  // 热点标记逐个出现
  spotRefs.forEach((s, i) => {
    if (!s) {
      return
    }
    thermalTl.to(s, {
      opacity: 1,
      scale: 1,
      duration: 0.12,
      ease: 'back.out(1.5)',
    }, 0.1 + i * 0.05)
  })

  // ===== 阶段2: 渐变回真实色彩 =====
  thermalTl.to(thermalLayerRef.value, {
    opacity: 0,
    duration: 0.25,
    ease: 'power2.inOut',
  }, 0.5)

  // UI消退
  spotRefs.forEach((s, i) => {
    if (!s) {
      return
    }
    thermalTl.to(s, {
      opacity: 0,
      scale: 0.5,
      duration: 0.1,
    }, 0.6 + i * 0.03)
  })

  thermalTl.to(scaleRef.value, {
    opacity: 0,
    x: -10,
    duration: 0.1,
  }, 0.65)
  thermalTl.to(panelRef.value, {
    opacity: 0,
    y: 10,
    duration: 0.1,
  }, 0.68)

  // 闪光
  thermalTl.to(flashRef.value, { opacity: 0.5, duration: 0.08 }, 0.55)
  thermalTl.to(flashRef.value, { opacity: 0, duration: 0.2 }, 0.63)

  cleanupFns.push(() => {
    thermalTl.scrollTrigger?.kill()
    thermalTl.kill()
  })
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.infrared-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0808;
}

.ir-real-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.ir-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ir-thermal {
  filter: saturate(2) contrast(1.4) brightness(1.1);
}

.ir-thermal-layer {
  position: absolute;
  inset: 0;
  z-index: 5;
  will-change: opacity;
}

.ir-thermal-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 0, 0, 0.25) 0%,
    rgba(255, 100, 0, 0.2) 20%,
    rgba(255, 200, 0, 0.2) 40%,
    rgba(0, 255, 100, 0.15) 60%,
    rgba(0, 100, 255, 0.2) 80%,
    rgba(30, 0, 100, 0.25) 100%
  );
  mix-blend-mode: overlay;
}

// 扫描条
.ir-scan-bar {
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 12;
  background: rgba(255, 100, 0, 0.8);
  box-shadow:
    0 0 10px rgba(255, 80, 0, 0.6),
    0 0 30px rgba(255, 80, 0, 0.2),
    0 -20px 40px rgba(255, 80, 0, 0.05),
    0 20px 40px rgba(255, 80, 0, 0.05);
  pointer-events: none;
}

// 热点
.ir-hotspot {
  position: absolute;
  z-index: 15;
  pointer-events: none;
  will-change: transform, opacity;

  .ir-hotspot-ring {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid rgba(255, 80, 0, 0.7);
    box-shadow: 0 0 10px rgba(255, 80, 0, 0.3);
    animation: ir-pulse 2s ease-in-out infinite;
  }

  .ir-hotspot-label {
    position: absolute;
    top: -22px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    font-weight: 700;
    color: rgba(255, 200, 100, 0.9);
    font-family: 'Courier New', monospace;
    white-space: nowrap;
    text-shadow: 0 0 6px rgba(255, 80, 0, 0.4);
  }
}

@keyframes ir-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.7;
  }
}

// 色阶条
.ir-scale {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 18;
  will-change: opacity, transform;

  .ir-scale-bar {
    width: 12px;
    height: 200px;
    border-radius: 6px;
    background: linear-gradient(
      180deg,
      #ff0000,
      #ff6600,
      #ffcc00,
      #00ff66,
      #0066ff,
      #1e0064
    );
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .ir-scale-labels {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    left: 20px;
    top: 0;
    height: 200px;

    span {
      font-size: 9px;
      color: rgba(255, 200, 100, 0.6);
      font-family: 'Courier New', monospace;
    }
  }
}

// 数据面板
.ir-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 18;
  padding: 14px 18px;
  background: rgba(30, 10, 0, 0.7);
  border: 1px solid rgba(255, 100, 0, 0.3);
  border-radius: 6px;
  backdrop-filter: blur(6px);
  will-change: opacity, transform;

  .ir-panel-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 5px;
  }

  .ir-p-label {
    font-size: 10px;
    letter-spacing: 0.12em;
    color: rgba(255, 180, 100, 0.5);
    font-family: 'Courier New', monospace;
  }

  .ir-p-value {
    font-size: 10px;
    color: rgba(255, 200, 100, 0.9);
    font-family: 'Courier New', monospace;
    font-weight: 700;
  }

  .ir-hot {
    color: rgba(255, 80, 0, 1);
  }
}

.ir-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: rgba(255, 150, 50, 0.4);
  pointer-events: none;
}
</style>

