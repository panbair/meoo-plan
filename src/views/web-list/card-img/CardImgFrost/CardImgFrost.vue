<template>
  <div class="frost-space" ref="parentRef">
    <!-- 寒冷背景 -->
    <div class="frost-bg" ref="bgRef">
      <!-- 极光层 -->
      <div class="aurora-layer" ref="auroraRef"></div>
      <!-- 冰晶粒子 -->
      <div class="ice-particles" ref="particlesRef"></div>
    </div>

    <!-- 霜花 SVG 滤镜 -->
    <svg class="frost-svg-filter" aria-hidden="true">
      <defs>
        <filter id="frost-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            ref="turbulenceRef"
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            ref="displacementRef"
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="frost-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur ref="blurRef" stdDeviation="12" />
        </filter>
      </defs>
    </svg>

    <!-- 霜花遮罩层 -->
    <div class="frost-overlay" ref="frostOverlayRef">
      <div class="frost-texture"></div>
      <div class="frost-ice-shards" ref="iceShardsRef"></div>
    </div>

    <!-- 中心发光环 -->
    <div class="ice-rings" ref="ringsRef">
      <div class="ice-ring ring-outer" ref="ringOuterRef"></div>
      <div class="ice-ring ring-inner" ref="ringInnerRef"></div>
    </div>

    <!-- 主图容器 -->
    <div class="frost-container" ref="containerRef">
      <!-- 外层冰蓝光晕 -->
      <div class="frost-glow" ref="glowRef"></div>

      <!-- 图片框架 -->
      <div class="frost-frame" ref="frameRef">
        <div class="frame-inner">
          <!-- 霜花遮罩图片 -->
          <div class="frost-image-wrapper" ref="imageWrapperRef">
            <div class="frost-image" ref="imageRef">
              <img :src="imageUrl" alt="Frost Memory" />
              <!-- 冷光叠加 -->
              <div class="cold-light" ref="coldLightRef"></div>
              <!-- 边缘冰霜 -->
              <div class="edge-frost" ref="edgeFrostRef"></div>
            </div>
            <!-- 霜花层 -->
            <div class="frost-layer" ref="frostLayerRef">
              <div class="frost-patch" v-for="n in 8" :key="n" :class="`patch-${n}`"></div>
            </div>
          </div>
          <!-- 内层边框 -->
          <div class="frame-border" ref="frameBorderRef"></div>
        </div>
      </div>

      <!-- 脉冲冰晕 -->
      <div class="pulse-ice-halo" ref="pulseHaloRef"></div>

      <!-- 暗角 -->
      <div class="frost-vignette" ref="vignetteRef"></div>

      <!-- 边框角装饰 -->
      <div class="frame-corners" ref="cornersRef">
        <div class="corner corner-tl" ref="cornerTlRef"></div>
        <div class="corner corner-tr" ref="cornerTrRef"></div>
        <div class="corner corner-bl" ref="cornerBlRef"></div>
        <div class="corner corner-br" ref="cornerBrRef"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="frost-title" ref="titleRef">
      <span class="title-cn">冰霜融显</span>
      <span class="title-en">FROST REVELATION</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  revert: () => void
}

const imageUrl = 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const auroraRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const turbulenceRef = ref<SVGFEPrimeTransferTextureElement | null>(null)
const displacementRef = ref<SVGFEPrimeTransferTextureElement | null>(null)
const blurRef = ref<SVGFEPrimeTransferTextureElement | null>(null)
const frostOverlayRef = ref<HTMLElement | null>(null)
const iceShardsRef = ref<HTMLElement | null>(null)
const ringsRef = ref<HTMLElement | null>(null)
const ringOuterRef = ref<HTMLElement | null>(null)
const ringInnerRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const coldLightRef = ref<HTMLElement | null>(null)
const edgeFrostRef = ref<HTMLElement | null>(null)
const frostLayerRef = ref<HTMLElement | null>(null)
const frameBorderRef = ref<HTMLElement | null>(null)
const pulseHaloRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const cornersRef = ref<HTMLElement | null>(null)
const cornerTlRef = ref<HTMLElement | null>(null)
const cornerTrRef = ref<HTMLElement | null>(null)
const cornerBlRef = ref<HTMLElement | null>(null)
const cornerBrRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !containerRef.value || !imageRef.value) return

  const ctx = gsap.context(() => {
    // 初始化状态 - 完全被霜覆盖
    gsap.set(containerRef.value, {
      opacity: 0,
      scale: 0.9,
      y: 25,
    })

    gsap.set(imageRef.value, {
      filter: 'url(#frost-blur) blur(8px)',
      scale: 0.9,
    })

    gsap.set(frostLayerRef.value, {
      opacity: 1,
    })

    gsap.set(frostOverlayRef.value, {
      opacity: 1,
    })

    gsap.set(glowRef.value, {
      opacity: 0,
      scale: 0.8,
    })

    gsap.set(pulseHaloRef.value, {
      opacity: 0,
      scale: 0.6,
    })

    gsap.set(ringsRef.value, {
      opacity: 0,
      scale: 0.7,
    })

    gsap.set(vignetteRef.value, {
      opacity: 0.9,
    })

    gsap.set(titleRef.value, {
      opacity: 0,
      y: 20,
      filter: 'blur(6px)',
    })

    gsap.set([cornerTlRef.value, cornerTrRef.value, cornerBlRef.value, cornerBrRef.value], {
      opacity: 0,
      scale: 0.5,
    })

    gsap.set(iceShardsRef.value, {
      opacity: 1,
    })

    gsap.set(coldLightRef.value, {
      opacity: 0,
    })

    gsap.set(edgeFrostRef.value, {
      opacity: 1,
    })

    // 创建冰晶粒子
    if (particlesRef.value) {
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div')
        particle.className = 'ice-particle'
        particle.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: ${1 + Math.random() * 3}px;
          height: ${1 + Math.random() * 3}px;
          animation-duration: ${4 + Math.random() * 6}s;
          animation-delay: ${Math.random() * 8}s;
        `
        particlesRef.value.appendChild(particle)
      }
    }

    // 创建冰晶碎片
    if (iceShardsRef.value) {
      for (let i = 0; i < 12; i++) {
        const shard = document.createElement('div')
        shard.className = 'ice-shard'
        shard.style.cssText = `
          left: ${10 + Math.random() * 80}%;
          top: ${10 + Math.random() * 80}%;
          width: ${20 + Math.random() * 40}px;
          height: ${20 + Math.random() * 40}px;
          animation-duration: ${5 + Math.random() * 8}s;
          animation-delay: ${Math.random() * 5}s;
        `
        iceShardsRef.value.appendChild(shard)
      }
    }

    // ===== 滚动融霜动画 (scrub: true) =====
    // 霜花消融 - 核心滚动效果
    const frostTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 100%',
        end: 'top 20%',
        scrub: 1.5,
      },
    })

    // 主容器显现
    frostTl.to(containerRef.value, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1,
      ease: 'none',
    })

    // 图片解模糊 + 放大
    frostTl.to(imageRef.value, {
      filter: 'blur(0px)',
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    // 霜花层消融
    frostTl.to(frostLayerRef.value, {
      opacity: 0,
      duration: 1,
      ease: 'none',
    }, '<')

    // 霜花遮罩消退
    frostTl.to(frostOverlayRef.value, {
      opacity: 0,
      duration: 1,
      ease: 'none',
    }, '<')

    // 冰晶碎片消失
    frostTl.to(iceShardsRef.value, {
      opacity: 0,
      duration: 1,
      ease: 'none',
    }, '<')

    // 光晕显现
    frostTl.to(glowRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    // 脉冲冰晕显现
    frostTl.to(pulseHaloRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    // 光环显现
    frostTl.to(ringsRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    // 暗角消退
    frostTl.to(vignetteRef.value, {
      opacity: 0.45,
      duration: 1,
      ease: 'none',
    }, '<')

    // 标题显现
    frostTl.to(titleRef.value, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'none',
    }, '<')

    // 边框角显现
    frostTl.to([cornerTlRef.value, cornerTrRef.value, cornerBlRef.value, cornerBrRef.value], {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    // 冷光显现
    frostTl.to(coldLightRef.value, {
      opacity: 0.4,
      duration: 1,
      ease: 'none',
    }, '<')

    // 边缘冰霜消退
    frostTl.to(edgeFrostRef.value, {
      opacity: 0.2,
      duration: 1,
      ease: 'none',
    }, '<')

    cleanupFns.push({
      revert: () => frostTl.kill(),
    })

    // ===== 独立循环动画 =====

    // 脉冲冰晕呼吸
    const pulseTl = gsap.timeline({ repeat: -1, yoyo: true })
    pulseTl.to(pulseHaloRef.value, {
      scale: 1.12,
      opacity: 0.6,
      duration: 3.5,
      ease: 'sine.inOut',
    })

    // 外层光环旋转
    const outerRingTl = gsap.timeline({ repeat: -1 })
    outerRingTl.to(ringOuterRef.value, {
      rotation: 360,
      duration: 50,
      ease: 'none',
    })

    // 内层光环逆旋
    const innerRingTl = gsap.timeline({ repeat: -1 })
    innerRingTl.to(ringInnerRef.value, {
      rotation: -360,
      duration: 40,
      ease: 'none',
    })

    // 光晕呼吸
    const glowTl = gsap.timeline({ repeat: -1, yoyo: true })
    glowTl.to(glowRef.value, {
      scale: 1.08,
      opacity: 0.8,
      duration: 5,
      ease: 'sine.inOut',
    })

    // 暗角呼吸
    const vignetteTl = gsap.timeline({ repeat: -1, yoyo: true })
    vignetteTl.to(vignetteRef.value, {
      opacity: 0.35,
      duration: 6,
      ease: 'sine.inOut',
    })

    // 极光动画
    const auroraTl = gsap.timeline({ repeat: -1 })
    auroraTl.to(auroraRef.value, {
      backgroundPosition: '200% 50%',
      duration: 20,
      ease: 'none',
    })

    // 冷光闪烁
    const coldLightTl = gsap.timeline({ repeat: -1, yoyo: true })
    coldLightTl.to(coldLightRef.value, {
      opacity: 0.5,
      duration: 4,
      ease: 'sine.inOut',
    })

    cleanupFns.push(
      { revert: () => pulseTl.kill() },
      { revert: () => outerRingTl.kill() },
      { revert: () => innerRingTl.kill() },
      { revert: () => glowTl.kill() },
      { revert: () => vignetteTl.kill() },
      { revert: () => auroraTl.kill() },
      { revert: () => coldLightTl.kill() },
    )
  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn.revert())
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style lang="scss" scoped>
.frost-space {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0a1520 0%,
    #0d2535 25%,
    #102535 50%,
    #0d2535 75%,
    #0a1520 100%
  );
}

.frost-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.aurora-layer {
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(ellipse 80% 50% at 30% 20%, rgba(100, 200, 220, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 70% 60%, rgba(80, 180, 200, 0.1) 0%, transparent 45%),
    radial-gradient(ellipse 100% 60% at 50% 80%, rgba(60, 160, 180, 0.08) 0%, transparent 50%);
  opacity: 0.5;
  will-change: background-position;
}

.ice-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.ice-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(200, 240, 255, 0.9) 0%, rgba(150, 220, 255, 0.4) 50%, transparent 70%);
  border-radius: 50%;
  animation: iceTwinkle ease-in-out infinite;
  filter: blur(0.3px);
}

@keyframes iceTwinkle {
  0%, 100% {
    opacity: 0.1;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.8;
    transform: scale(1);
  }
}

.frost-svg-filter {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.frost-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  transition: opacity 0.3s;
}

.frost-texture {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 100% 100% at 50% 50%, rgba(200, 240, 255, 0.08) 0%, transparent 60%);
  animation: frostTexturePulse 8s ease-in-out infinite;
}

@keyframes frostTexturePulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.ice-shards {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ice-shard {
  position: absolute;
  background: linear-gradient(135deg, rgba(200, 240, 255, 0.15) 0%, rgba(150, 220, 255, 0.05) 100%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation: shardGlint ease-in-out infinite;
}

@keyframes shardGlint {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1) rotate(5deg);
  }
}

.ice-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 130%;
  height: 130%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  will-change: transform, opacity;
}

.ice-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid;

  &.ring-outer {
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    border-color: rgba(150, 220, 255, 0.15);
    box-shadow:
      0 0 30px rgba(100, 200, 255, 0.1),
      inset 0 0 30px rgba(100, 200, 255, 0.08);
  }

  &.ring-inner {
    width: 85%;
    height: 85%;
    transform: translate(-50%, -50%);
    border-color: rgba(180, 230, 255, 0.12);
    box-shadow:
      0 0 20px rgba(120, 210, 255, 0.08),
      inset 0 0 20px rgba(120, 210, 255, 0.05);
  }
}

.frost-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, opacity, filter;
}

.frost-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110%;
  height: 110%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, rgba(100, 200, 255, 0.2) 0%, rgba(60, 160, 220, 0.08) 40%, transparent 70%);
  border-radius: 20px;
  will-change: transform, opacity;
  pointer-events: none;
}

.frost-frame {
  position: relative;
  padding: 10px;
  background: linear-gradient(135deg, rgba(80, 180, 220, 0.1) 0%, rgba(40, 120, 180, 0.06) 100%);
  border-radius: 12px;
  box-shadow:
    0 0 40px rgba(100, 200, 255, 0.12),
    inset 0 0 20px rgba(100, 200, 255, 0.04);
}

.frame-inner {
  position: relative;
}

.frost-image-wrapper {
  position: relative;
}

.frost-image {
  position: relative;
  width: 60vw;
  max-width: 850px;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 30px 80px rgba(0, 20, 40, 0.5),
    0 60px 120px rgba(20, 60, 100, 0.3),
    inset 0 0 60px rgba(100, 200, 255, 0.1);
  will-change: filter, transform;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(1.1) contrast(1.05);
  }
}

.cold-light {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 30% 30%, rgba(200, 240, 255, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 70% 70%, rgba(100, 200, 255, 0.15) 0%, transparent 45%);
  pointer-events: none;
  will-change: opacity;
}

.edge-frost {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  box-shadow:
    inset 3px 3px 25px rgba(200, 240, 255, 0.2),
    inset -3px -3px 25px rgba(100, 180, 220, 0.15);
  pointer-events: none;
  will-change: opacity;
}

.frost-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  will-change: opacity;
}

.frost-patch {
  position: absolute;
  background: radial-gradient(ellipse at center, rgba(200, 240, 255, 0.12) 0%, rgba(180, 230, 255, 0.06) 50%, transparent 70%);
  border-radius: 50%;
  animation: frostPatchPulse 6s ease-in-out infinite;

  &.patch-1 { top: 10%; left: 15%; width: 120px; height: 100px; animation-delay: 0s; }
  &.patch-2 { top: 5%; left: 50%; width: 150px; height: 120px; animation-delay: 0.8s; }
  &.patch-3 { top: 8%; right: 10%; width: 100px; height: 90px; animation-delay: 1.6s; }
  &.patch-4 { top: 40%; left: 5%; width: 80px; height: 100px; animation-delay: 2.4s; }
  &.patch-5 { bottom: 15%; left: 20%; width: 130px; height: 110px; animation-delay: 3.2s; }
  &.patch-6 { bottom: 8%; left: 55%; width: 140px; height: 100px; animation-delay: 4s; }
  &.patch-7 { bottom: 12%; right: 15%; width: 110px; height: 95px; animation-delay: 4.8s; }
  &.patch-8 { top: 50%; right: 8%; width: 90px; height: 80px; animation-delay: 5.6s; }
}

@keyframes frostPatchPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.frame-border {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(150, 220, 255, 0.2);
  border-radius: 8px;
  pointer-events: none;
}

.pulse-ice-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 105%;
  height: 105%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, rgba(120, 210, 255, 0.18) 0%, rgba(80, 180, 240, 0.06) 50%, transparent 70%);
  border-radius: 16px;
  pointer-events: none;
  will-change: transform, opacity;
}

.frost-vignette {
  position: absolute;
  inset: -30px;
  border-radius: 20px;
  background: radial-gradient(
    ellipse at center,
    transparent 25%,
    rgba(5, 20, 35, 0.5) 60%,
    rgba(0, 10, 25, 0.8) 100%
  );
  pointer-events: none;
  will-change: opacity;
}

.frame-corners {
  position: absolute;
  inset: -12px;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: rgba(150, 220, 255, 0.5);
  border-style: solid;

  &.corner-tl {
    top: 0;
    left: 0;
    border-width: 2px 0 0 2px;
    border-radius: 4px 0 0 0;
  }

  &.corner-tr {
    top: 0;
    right: 0;
    border-width: 2px 2px 0 0;
    border-radius: 0 4px 0 0;
  }

  &.corner-bl {
    bottom: 0;
    left: 0;
    border-width: 0 0 2px 2px;
    border-radius: 0 0 0 4px;
  }

  &.corner-br {
    bottom: 0;
    right: 0;
    border-width: 0 2px 2px 0;
    border-radius: 0 0 4px 0;
  }
}

.frost-title {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  will-change: transform, opacity, filter;

  .title-cn {
    display: block;
    font-size: 28px;
    font-weight: 600;
    color: #d8f0ff;
    letter-spacing: 10px;
    text-shadow:
      0 0 20px rgba(100, 200, 255, 0.6),
      0 0 40px rgba(80, 180, 240, 0.4),
      0 2px 4px rgba(0, 10, 20, 0.5);
    margin-bottom: 8px;
  }

  .title-en {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: rgba(200, 235, 255, 0.6);
    letter-spacing: 8px;
    text-transform: uppercase;
  }
}
</style>
