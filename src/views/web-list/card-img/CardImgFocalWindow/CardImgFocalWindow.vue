<template>
  <div class="card-img-focal" ref="containerRef">
    <div class="focal-scene" ref="sceneRef">
      <!-- 背景肌理层 -->
      <div class="layer-background" ref="bgLayerRef">
        <div class="bg-texture" ref="bgTextureRef"></div>
        <div class="bg-macro"></div>
      </div>

      <!-- 中景主图层 -->
      <div class="layer-midground" ref="midLayerRef">
        <img
          :src="imageUrl"
          alt="Focal window"
          class="midground-image"
          ref="imageRef"
          loading="lazy"
        />
        <div class="midground-overlay"></div>
      </div>

      <!-- 前景文案层 -->
      <div class="layer-foreground" ref="fgLayerRef">
        <div class="fg-content">
          <h2 class="focal-title" ref="titleRef">聚焦视窗</h2>
          <p class="focal-subtitle" ref="subtitleRef">焦距驱动错位视差</p>
          <div class="focal-accent" ref="accentRef"></div>
        </div>
      </div>

      <!-- 扫描光带 -->
      <div class="scan-band" ref="scanBandRef"></div>

      <!-- 色温光晕 -->
      <div class="temp-glow" ref="tempGlowRef"></div>
    </div>

    <!-- 对焦环装饰 -->
    <div class="focus-ring-deco" ref="focusRingRef">
      <div class="ring-outer"></div>
      <div class="ring-inner"></div>
      <div class="ring-marks">
        <span v-for="i in 12" :key="i" class="ring-mark" :style="{ transform: `rotate(${i * 30}deg)` }"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

interface Props {
  imageUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
})

// Refs
const containerRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const bgLayerRef = ref<HTMLElement | null>(null)
const bgTextureRef = ref<HTMLElement | null>(null)
const midLayerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const fgLayerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const accentRef = ref<HTMLElement | null>(null)
const scanBandRef = ref<HTMLElement | null>(null)
const tempGlowRef = ref<HTMLElement | null>(null)
const focusRingRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// 创建焦距驱动错位视差动画
const createFocalAnimation = () => {
  if (!containerRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  cleanupFns.push({
    kill: () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === containerRef.value) {
          st.kill()
        }
      })
    }
  })

  // 阶段1: 前景清晰 → 中景清晰 → 背景苏醒 的焦点传递
  // 前景模糊
  tl.to(
    fgLayerRef.value,
    {
      filter: 'blur(2px)',
      opacity: 0.7,
      duration: 0.5,
      ease: 'power2.inOut'
    },
    0
  )

  // 中景清晰化
  tl.to(
    midLayerRef.value,
    {
      filter: 'blur(0px) brightness(1)',
      duration: 0.8,
      ease: 'power2.out'
    },
    0.1
  )

  // 背景苏醒
  tl.to(
    bgLayerRef.value,
    {
      filter: 'blur(0px)',
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    },
    0.2
  )

  // 阶段2: 三层位移 - 非线性速度差
  // 前景慢速
  tl.to(
    fgLayerRef.value,
    {
      y: -120,
      duration: 1,
      ease: 'power1.inOut'
    },
    0
  )

  // 中景中速（略微加速）
  tl.to(
    midLayerRef.value,
    {
      y: -200,
      duration: 1,
      ease: 'power1.inOut'
    },
    0
  )

  // 背景快速（略微加速）
  tl.to(
    bgLayerRef.value,
    {
      y: -280,
      duration: 1,
      ease: 'power1.inOut'
    },
    0
  )

  // 阶段3: 中段速度差拉大 - 空间被撑开
  tl.to(
    fgLayerRef.value,
    {
      y: -180,
      duration: 0.4,
      ease: 'power2.in'
    },
    0.5
  )

  tl.to(
    midLayerRef.value,
    {
      y: -350,
      duration: 0.4,
      ease: 'power2.in'
    },
    0.5
  )

  tl.to(
    bgLayerRef.value,
    {
      y: -480,
      duration: 0.4,
      ease: 'power2.in'
    },
    0.5
  )

  // 阶段4: 速度差收拢
  tl.to(
    fgLayerRef.value,
    {
      y: -250,
      duration: 0.6,
      ease: 'power2.out'
    },
    0.9
  )

  tl.to(
    midLayerRef.value,
    {
      y: -420,
      duration: 0.6,
      ease: 'power2.out'
    },
    0.9
  )

  tl.to(
    bgLayerRef.value,
    {
      y: -550,
      duration: 0.6,
      ease: 'power2.out'
    },
    0.9
  )

  // 阶段5: 扫描光带
  if (scanBandRef.value) {
    tl.fromTo(
      scanBandRef.value,
      {
        y: '-10%',
        opacity: 0
      },
      {
        y: '110%',
        opacity: 1,
        duration: 1,
        ease: 'none'
      },
      0.2
    )
  }

  // 阶段6: 色温柔和变化
  if (tempGlowRef.value) {
    tl.fromTo(
      tempGlowRef.value,
      {
        opacity: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(200, 220, 255, 0.15) 0%, transparent 70%)'
      },
      {
        opacity: 1,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 240, 220, 0.2) 0%, transparent 70%)',
        duration: 1,
        ease: 'sine.inOut'
      },
      0.3
    )

    tl.to(
      tempGlowRef.value,
      {
        background: 'radial-gradient(ellipse at 50% 50%, rgba(200, 220, 255, 0.15) 0%, transparent 70%)',
        duration: 0.8,
        ease: 'sine.inOut'
      },
      0.8
    )
  }

  // 阶段7: 前景文案入场
  tl.fromTo(
    titleRef.value,
    {
      opacity: 0,
      x: 20,
      filter: 'blur(4px)'
    },
    {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'power2.out'
    },
    0.1
  )

  tl.fromTo(
    subtitleRef.value,
    {
      opacity: 0,
      x: 20,
      filter: 'blur(4px)'
    },
    {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'power2.out'
    },
    0.25
  )

  tl.fromTo(
    accentRef.value,
    {
      scaleX: 0,
      opacity: 0
    },
    {
      scaleX: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    },
    0.4
  )

  // 阶段8: 对焦环旋转
  if (focusRingRef.value) {
    tl.to(
      focusRingRef.value,
      {
        rotate: 180,
        duration: 1.5,
        ease: 'none'
      },
      0
    )
  }
}

onMounted(() => {
  requestAnimationFrame(() => {
    createFocalAnimation()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style lang="scss" scoped>
.card-img-focal {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
}

.focal-scene {
  width: 100%;
  height: 100%;
  position: relative;
}

// ============ 背景肌理层 ============
.layer-background {
  position: absolute;
  inset: 0;
  z-index: 1;
  filter: blur(8px);
  opacity: 0.6;

  .bg-texture {
    position: absolute;
    inset: -20%;
    background: 
      radial-gradient(ellipse at 30% 40%, rgba(80, 100, 150, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 60%, rgba(100, 80, 120, 0.15) 0%, transparent 50%),
      repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.02) 0deg 10deg, transparent 10deg 20deg);
  }

  .bg-macro {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.08;
  }
}

// ============ 中景主图层 ============
.layer-midground {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  height: 65vh;
  max-width: 800px;
  z-index: 2;
  border-radius: 8px;
  overflow: hidden;
  filter: blur(2px) brightness(0.85);
  box-shadow: 
    0 25px 70px rgba(0, 0, 0, 0.3),
    0 10px 30px rgba(0, 0, 0, 0.2);

  .midground-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .midground-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.1) 0%,
      transparent 20%,
      transparent 80%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }
}

// ============ 前景文案层 ============
.layer-foreground {
  position: absolute;
  right: 8%;
  top: 30%;
  z-index: 3;
  max-width: 380px;
  filter: blur(0px);
}

.fg-content {
  position: relative;
}

.focal-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 0.5em 0;
  opacity: 0;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.focal-subtitle {
  font-size: clamp(0.9rem, 1.5vw, 1.2rem);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.15em;
  margin: 0;
  opacity: 0;
}

.focal-accent {
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #64b5f6, #90caf9);
  margin-top: 1.5em;
  transform-origin: left;
  opacity: 0;
}

// ============ 扫描光带 ============
.scan-band {
  position: absolute;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.06) 30%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.06) 70%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  transform: translateY(-10%);
}

// ============ 色温柔和变化 ============
.temp-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  mix-blend-mode: screen;
}

// ============ 对焦环装饰 ============
.focus-ring-deco {
  position: absolute;
  right: 5%;
  bottom: 10%;
  width: 100px;
  height: 100px;
  z-index: 20;
  opacity: 0.4;

  .ring-outer {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(100, 181, 246, 0.4);
    border-radius: 50%;
  }

  .ring-inner {
    position: absolute;
    inset: 15px;
    border: 1px solid rgba(100, 181, 246, 0.3);
    border-radius: 50%;
  }

  .ring-marks {
    position: absolute;
    inset: 0;
    animation: ringRotate 20s linear infinite;

    .ring-mark {
      position: absolute;
      left: 50%;
      top: 0;
      width: 1px;
      height: 8px;
      background: rgba(100, 181, 246, 0.5);
      transform-origin: 50% 50px;
    }
  }
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
