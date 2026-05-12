<template>
  <div class="darkroom-space" ref="parentRef">
    <!-- 暗房背景 -->
    <div class="darkroom-bg" ref="bgRef">
      <!-- 安全灯琥珀光晕 -->
      <div class="safelight-glow" ref="safelightRef"></div>
      <!-- 银盐颗粒层 -->
      <div class="silver-particles" ref="particlesRef"></div>
    </div>

    <!-- 曝光扫描线指示器 -->
    <div class="exposure-scanner" ref="scannerRef">
      <div class="scanner-line" ref="scannerLineRef"></div>
    </div>

    <!-- 银盐颗粒 SVG 滤镜 -->
    <svg class="darkroom-svg-filter" aria-hidden="true">
      <defs>
        <filter id="silver-grain" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            ref="grainTurbulenceRef"
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="4"
            result="grainNoise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            result="monoGrain"
          />
          <feBlend
            in="SourceGraphic"
            in2="monoGrain"
            mode="overlay"
            result="grainBlend"
          />
          <feComposite in="grainBlend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>

    <!-- 主图容器 -->
    <div class="darkroom-container" ref="containerRef">
      <!-- 外层暖光晕 -->
      <div class="warm-glow" ref="warmGlowRef"></div>

      <!-- 曝光遮罩层 -->
      <div class="exposure-mask" ref="maskRef">
        <div class="mask-texture"></div>
        <div class="mask-edge-glow" ref="edgeGlowRef"></div>
      </div>

      <!-- 图片框架 -->
      <div class="darkroom-frame" ref="frameRef">
        <div class="frame-inner">
          <div class="darkroom-image" ref="imageRef">
            <img :src="imageUrl" alt="Darkroom Memory" />
            <!-- 银盐颗粒层 -->
            <div class="grain-overlay" ref="grainRef"></div>
            <!-- 暗房红光叠加 -->
            <div class="safelight-overlay" ref="safelightOverlayRef"></div>
            <!-- 边缘银光 -->
            <div class="silver-edge" ref="silverEdgeRef"></div>
          </div>
          <!-- 内层边框 -->
          <div class="frame-border" ref="frameBorderRef"></div>
        </div>
      </div>

      <!-- 脉冲光晕 -->
      <div class="pulse-glow" ref="pulseGlowRef"></div>

      <!-- 暗角 -->
      <div class="darkroom-vignette" ref="vignetteRef"></div>

      <!-- 边框角装饰 -->
      <div class="frame-corners" ref="cornersRef">
        <div class="corner corner-tl" ref="cornerTlRef"></div>
        <div class="corner corner-tr" ref="cornerTrRef"></div>
        <div class="corner corner-bl" ref="cornerBlRef"></div>
        <div class="corner corner-br" ref="cornerBrRef"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="darkroom-title" ref="titleRef">
      <span class="title-cn">暗房印相</span>
      <span class="title-en">DARKROOM CONTACT</span>
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

const imageUrl = 'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const safelightRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const scannerRef = ref<HTMLElement | null>(null)
const scannerLineRef = ref<HTMLElement | null>(null)
const grainTurbulenceRef = ref<SVGFEPrimeTransferTextureElement | null>(null)
const maskRef = ref<HTMLElement | null>(null)
const edgeGlowRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const warmGlowRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const grainRef = ref<HTMLElement | null>(null)
const safelightOverlayRef = ref<HTMLElement | null>(null)
const silverEdgeRef = ref<HTMLElement | null>(null)
const frameBorderRef = ref<HTMLElement | null>(null)
const pulseGlowRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const cornersRef = ref<HTMLElement | null>(null)
const cornerTlRef = ref<HTMLElement | null>(null)
const cornerTrRef = ref<HTMLElement | null>(null)
const cornerBlRef = ref<HTMLElement | null>(null)
const cornerBrRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !containerRef.value || !imageRef.value || !maskRef.value) return

  const ctx = gsap.context(() => {
    // 初始化状态 - 完全被遮罩覆盖
    gsap.set(containerRef.value, {
      opacity: 0,
      scale: 0.88,
      y: 20,
    })

    gsap.set(imageRef.value, {
      filter: 'blur(20px) brightness(0.3)',
      scale: 0.88,
    })

    // 遮罩完全覆盖
    gsap.set(maskRef.value, {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
    })

    gsap.set(scannerLineRef.value, {
      top: '0%',
      opacity: 0,
    })

    gsap.set(warmGlowRef.value, {
      opacity: 0,
      scale: 0.85,
    })

    gsap.set(pulseGlowRef.value, {
      opacity: 0,
      scale: 0.7,
    })

    gsap.set(vignetteRef.value, {
      opacity: 0.95,
    })

    gsap.set(titleRef.value, {
      opacity: 0,
      y: 15,
      filter: 'blur(5px)',
    })

    gsap.set([cornerTlRef.value, cornerTrRef.value, cornerBlRef.value, cornerBrRef.value], {
      opacity: 0,
      scale: 0.5,
    })

    gsap.set(edgeGlowRef.value, {
      opacity: 0.3,
    })

    gsap.set(safelightOverlayRef.value, {
      opacity: 0.4,
    })

    gsap.set(silverEdgeRef.value, {
      opacity: 0,
    })

    gsap.set(grainRef.value, {
      opacity: 0.8,
    })

    gsap.set(safelightRef.value, {
      opacity: 0.3,
    })

    // 创建银盐颗粒
    if (particlesRef.value) {
      for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div')
        particle.className = 'silver-particle'
        particle.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: ${0.5 + Math.random() * 1.5}px;
          height: ${0.5 + Math.random() * 1.5}px;
          animation-duration: ${3 + Math.random() * 5}s;
          animation-delay: ${Math.random() * 6}s;
        `
        particlesRef.value.appendChild(particle)
      }
    }

    // ===== 滚动曝光显影动画 (核心 scrub) =====
    const exposureTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 100%',
        end: 'top 20%',
        scrub: 1.5,
      },
    })

    // 容器显现 + 缩放归位
    exposureTl.to(containerRef.value, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1,
      ease: 'none',
    })

    // 遮罩从上方溶出（曝光扫描线效果）
    exposureTl.to(maskRef.value, {
      clipPath: 'inset(100% 0% 0% 0%)',
      duration: 1,
      ease: 'none',
    }, '<')

    // 扫描线移动
    exposureTl.to(scannerLineRef.value, {
      top: '100%',
      opacity: 0.6,
      duration: 1,
      ease: 'none',
    }, '<')

    // 图片属性联动 - 同步于遮罩进度
    exposureTl.to(imageRef.value, {
      filter: 'blur(0px) brightness(1)',
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    // 安全灯叠加消退
    exposureTl.to(safelightOverlayRef.value, {
      opacity: 0.05,
      duration: 1,
      ease: 'none',
    }, '<')

    // 边缘银光显现
    exposureTl.to(silverEdgeRef.value, {
      opacity: 0.4,
      duration: 1,
      ease: 'none',
    }, '<')

    // 银盐颗粒变细
    exposureTl.to(grainRef.value, {
      opacity: 0.3,
      duration: 1,
      ease: 'none',
    }, '<')

    // 暖光晕显现
    exposureTl.to(warmGlowRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    // 脉冲光晕显现
    exposureTl.to(pulseGlowRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    // 暗角消退
    exposureTl.to(vignetteRef.value, {
      opacity: 0.5,
      duration: 1,
      ease: 'none',
    }, '<')

    // 背景安全灯光晕增强
    exposureTl.to(safelightRef.value, {
      opacity: 0.6,
      duration: 1,
      ease: 'none',
    }, '<')

    // 边缘光消退
    exposureTl.to(edgeGlowRef.value, {
      opacity: 0,
      duration: 1,
      ease: 'none',
    }, '<')

    // 边框角显现
    exposureTl.to([cornerTlRef.value, cornerTrRef.value, cornerBlRef.value, cornerBrRef.value], {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    // 标题显现
    exposureTl.to(titleRef.value, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'none',
    }, '<')

    cleanupFns.push({
      revert: () => exposureTl.kill(),
    })

    // ===== 独立循环动画 =====

    // 脉冲光晕呼吸
    const pulseTl = gsap.timeline({ repeat: -1, yoyo: true })
    pulseTl.to(pulseGlowRef.value, {
      scale: 1.1,
      opacity: 0.6,
      duration: 4,
      ease: 'sine.inOut',
    })

    // 暖光晕呼吸
    const warmGlowTl = gsap.timeline({ repeat: -1, yoyo: true })
    warmGlowTl.to(warmGlowRef.value, {
      scale: 1.05,
      opacity: 0.8,
      duration: 5,
      ease: 'sine.inOut',
    })

    // 暗角轻微呼吸
    const vignetteTl = gsap.timeline({ repeat: -1, yoyo: true })
    vignetteTl.to(vignetteRef.value, {
      opacity: 0.4,
      duration: 6,
      ease: 'sine.inOut',
    })

    // 安全灯背景脉动
    const safelightBgTl = gsap.timeline({ repeat: -1, yoyo: true })
    safelightBgTl.to(safelightRef.value, {
      opacity: 0.5,
      duration: 7,
      ease: 'sine.inOut',
    })

    // 银盐颗粒闪烁
    const grainTl = gsap.timeline({ repeat: -1, yoyo: true })
    grainTl.to(grainRef.value, {
      opacity: 0.5,
      duration: 2,
      ease: 'sine.inOut',
    })

    // 边缘银光闪烁
    const silverEdgeTl = gsap.timeline({ repeat: -1, yoyo: true })
    silverEdgeTl.to(silverEdgeRef.value, {
      opacity: 0.3,
      duration: 3,
      ease: 'sine.inOut',
    })

    cleanupFns.push(
      { revert: () => pulseTl.kill() },
      { revert: () => warmGlowTl.kill() },
      { revert: () => vignetteTl.kill() },
      { revert: () => safelightBgTl.kill() },
      { revert: () => grainTl.kill() },
      { revert: () => silverEdgeTl.kill() },
    )
  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn.revert())
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style lang="scss" scoped>
.darkroom-space {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0a0806 0%,
    #1a1008 25%,
    #0d0a06 50%,
    #151008 75%,
    #0a0806 100%
  );
}

.darkroom-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.safelight-glow {
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(ellipse 50% 40% at 50% 50%, rgba(200, 120, 60, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 40% 30% at 30% 70%, rgba(180, 100, 50, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse 35% 35% at 70% 30%, rgba(160, 90, 45, 0.08) 0%, transparent 35%);
  filter: blur(50px);
  opacity: 0.3;
  will-change: opacity;
}

.silver-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.silver-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 220, 180, 0.7) 0%, rgba(200, 180, 150, 0.3) 50%, transparent 70%);
  border-radius: 50%;
  animation: silverGlow ease-in-out infinite;
  filter: blur(0.3px);
}

@keyframes silverGlow {
  0%, 100% {
    opacity: 0.1;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.6;
    transform: scale(1);
  }
}

.exposure-scanner {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.scanner-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 220, 180, 0.6) 20%,
    rgba(255, 230, 200, 0.8) 50%,
    rgba(255, 220, 180, 0.6) 80%,
    transparent 100%
  );
  box-shadow:
    0 0 20px rgba(255, 200, 150, 0.4),
    0 0 40px rgba(255, 180, 120, 0.2);
  will-change: top, opacity;
}

.darkroom-svg-filter {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.darkroom-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, opacity;
}

.warm-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110%;
  height: 110%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, rgba(200, 140, 80, 0.2) 0%, rgba(160, 100, 50, 0.08) 40%, transparent 70%);
  border-radius: 16px;
  will-change: transform, opacity;
  pointer-events: none;
}

.exposure-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    #050403 0%,
    #0a0806 50%,
    #050403 100%
  );
  border-radius: 12px;
  z-index: 5;
  will-change: clip-path, opacity;
  pointer-events: none;
}

.mask-texture {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.03) 2px,
      rgba(0, 0, 0, 0.03) 4px
    );
  opacity: 0.5;
}

.mask-edge-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(
    0deg,
    rgba(200, 150, 80, 0.15) 0%,
    transparent 100%
  );
  border-radius: 0 0 12px 12px;
  will-change: opacity;
}

.darkroom-frame {
  position: relative;
  padding: 10px;
  background: linear-gradient(135deg, rgba(120, 80, 40, 0.15) 0%, rgba(80, 50, 25, 0.1) 100%);
  border-radius: 10px;
  box-shadow:
    0 0 30px rgba(160, 100, 50, 0.1),
    inset 0 0 15px rgba(160, 100, 50, 0.05);
}

.frame-inner {
  position: relative;
}

.darkroom-image {
  position: relative;
  width: 60vw;
  max-width: 850px;
  aspect-ratio: 16 / 10;
  border-radius: 6px;
  overflow: hidden;
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.6),
    0 50px 100px rgba(30, 20, 10, 0.4),
    inset 0 0 40px rgba(160, 120, 60, 0.1);
  will-change: filter, transform;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.95) contrast(1.1);
  }
}

.grain-overlay {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.4;
  mix-blend-mode: overlay;
  pointer-events: none;
  will-change: opacity;
}

.safelight-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(180, 100, 50, 0.15) 0%, transparent 50%);
  pointer-events: none;
  will-change: opacity;
}

.silver-edge {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  box-shadow:
    inset 2px 2px 15px rgba(255, 220, 180, 0.1),
    inset -2px -2px 15px rgba(160, 120, 60, 0.08);
  pointer-events: none;
  will-change: opacity;
}

.frame-border {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(140, 100, 60, 0.2);
  border-radius: 6px;
  pointer-events: none;
}

.pulse-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 105%;
  height: 105%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, rgba(180, 130, 70, 0.18) 0%, rgba(140, 90, 40, 0.06) 50%, transparent 70%);
  border-radius: 14px;
  pointer-events: none;
  will-change: transform, opacity;
}

.darkroom-vignette {
  position: absolute;
  inset: -25px;
  border-radius: 18px;
  background: radial-gradient(
    ellipse at center,
    transparent 20%,
    rgba(5, 3, 2, 0.5) 60%,
    rgba(0, 0, 0, 0.85) 100%
  );
  pointer-events: none;
  will-change: opacity;
}

.frame-corners {
  position: absolute;
  inset: -10px;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 22px;
  height: 22px;
  border-color: rgba(180, 140, 80, 0.45);
  border-style: solid;

  &.corner-tl {
    top: 0;
    left: 0;
    border-width: 2px 0 0 2px;
    border-radius: 3px 0 0 0;
  }

  &.corner-tr {
    top: 0;
    right: 0;
    border-width: 2px 2px 0 0;
    border-radius: 0 3px 0 0;
  }

  &.corner-bl {
    bottom: 0;
    left: 0;
    border-width: 0 0 2px 2px;
    border-radius: 0 0 0 3px;
  }

  &.corner-br {
    bottom: 0;
    right: 0;
    border-width: 0 2px 2px 0;
    border-radius: 0 0 3px 0;
  }
}

.darkroom-title {
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
    color: #ffeedd;
    letter-spacing: 10px;
    text-shadow:
      0 0 20px rgba(200, 150, 80, 0.5),
      0 0 40px rgba(180, 130, 60, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.5);
    margin-bottom: 8px;
  }

  .title-en {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 220, 180, 0.55);
    letter-spacing: 6px;
    text-transform: uppercase;
  }
}
</style>
