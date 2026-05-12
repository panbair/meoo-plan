<template>
  <div class="reversal-space" ref="parentRef">
    <!-- 深邃渐变背景 -->
    <div class="reversal-bg" ref="bgRef">
      <!-- 光晕层 -->
      <div class="bg-glow" ref="glowRef"></div>
      <!-- 星光粒子 -->
      <div class="starlight-particles" ref="particlesRef"></div>
    </div>

    <!-- 中心发光环 -->
    <div class="light-rings" ref="ringsRef">
      <div class="light-ring ring-outer" ref="ringOuterRef"></div>
      <div class="light-ring ring-inner" ref="ringInnerRef"></div>
    </div>

    <!-- 主图容器 -->
    <div class="reversal-container" ref="containerRef">
      <!-- 外层光晕 -->
      <div class="reversal-glow" ref="glowContainerRef"></div>

      <!-- 图片框架 -->
      <div class="reversal-frame" ref="frameRef">
        <div class="frame-inner">
          <div class="reversal-image" ref="imageRef">
            <img :src="imageUrl" alt="Reversal Light" />
            <!-- 光晕叠加层 -->
            <div class="light-overlay" ref="lightOverlayRef"></div>
            <!-- 边缘光 -->
            <div class="edge-light" ref="edgeLightRef"></div>
          </div>
          <!-- 内层边框 -->
          <div class="frame-border" ref="frameBorderRef"></div>
        </div>
      </div>

      <!-- 脉冲光晕 -->
      <div class="pulse-halo" ref="pulseHaloRef"></div>

      <!-- 暗角遮罩 -->
      <div class="reversal-vignette" ref="vignetteRef"></div>

      <!-- 边框装饰 -->
      <div class="frame-corners" ref="cornersRef">
        <div class="corner corner-tl" ref="cornerTlRef"></div>
        <div class="corner corner-tr" ref="cornerTrRef"></div>
        <div class="corner corner-bl" ref="cornerBlRef"></div>
        <div class="corner corner-br" ref="cornerBrRef"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="reversal-title" ref="titleRef">
      <span class="title-cn">光影逆转</span>
      <span class="title-en">LIGHT REVERSAL</span>
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

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const ringsRef = ref<HTMLElement | null>(null)
const ringOuterRef = ref<HTMLElement | null>(null)
const ringInnerRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const glowContainerRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const lightOverlayRef = ref<HTMLElement | null>(null)
const edgeLightRef = ref<HTMLElement | null>(null)
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
    // 初始化状态 - 隐藏态
    gsap.set(containerRef.value, {
      opacity: 0,
      scale: 0.85,
      y: 30,
      filter: 'blur(12px)',
    })

    gsap.set(imageRef.value, {
      filter: 'blur(12px) brightness(0.7)',
    })

    gsap.set(glowContainerRef.value, {
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
      opacity: 0.8,
    })

    gsap.set(titleRef.value, {
      opacity: 0,
      y: 25,
      filter: 'blur(8px)',
    })

    gsap.set([cornerTlRef.value, cornerTrRef.value, cornerBlRef.value, cornerBrRef.value], {
      opacity: 0,
      scale: 0.5,
    })

    // 创建星光粒子
    if (particlesRef.value) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div')
        particle.className = 'starlight-particle'
        particle.setAttribute('data-index', String(i))
        particle.style.cssText = `
          left: ${5 + Math.random() * 90}%;
          top: ${5 + Math.random() * 90}%;
          width: ${1 + Math.random() * 3}px;
          height: ${1 + Math.random() * 3}px;
          animation-duration: ${3 + Math.random() * 5}s;
          animation-delay: ${Math.random() * 5}s;
        `
        particlesRef.value.appendChild(particle)
      }
    }

    // ===== 滚动渐显动画 (scrub: true) =====
    // 主容器滚动渐显 + 模糊消退
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 100%',
        end: 'top 20%',
        scrub: 1.5,
      },
    })

    mainTl.to(containerRef.value, {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'none',
    })

    mainTl.to(imageRef.value, {
      filter: 'blur(0px) brightness(1)',
      duration: 1,
      ease: 'none',
    }, '<')

    mainTl.to(glowContainerRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    mainTl.to(pulseHaloRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    mainTl.to(ringsRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    mainTl.to(vignetteRef.value, {
      opacity: 0.5,
      duration: 1,
      ease: 'none',
    }, '<')

    mainTl.to(titleRef.value, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'none',
    }, '<')

    mainTl.to([cornerTlRef.value, cornerTrRef.value, cornerBlRef.value, cornerBrRef.value], {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    mainTl.to(lightOverlayRef.value, {
      opacity: 0.3,
      duration: 1,
      ease: 'none',
    }, '<')

    mainTl.to(edgeLightRef.value, {
      opacity: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    mainTl.to(frameBorderRef.value, {
      opacity: 1,
      duration: 1,
      ease: 'none',
    }, '<')

    cleanupFns.push({
      revert: () => mainTl.kill(),
    })

    // ===== 独立循环动画（不依赖滚动） =====

    // 脉冲光晕呼吸
    const pulseTl = gsap.timeline({ repeat: -1, yoyo: true })
    pulseTl.to(pulseHaloRef.value, {
      scale: 1.15,
      opacity: 0.5,
      duration: 3,
      ease: 'sine.inOut',
    })

    // 外层光环旋转
    const outerRingTl = gsap.timeline({ repeat: -1 })
    outerRingTl.to(ringOuterRef.value, {
      rotation: 360,
      duration: 60,
      ease: 'none',
    })

    // 内层光环反向旋转
    const innerRingTl = gsap.timeline({ repeat: -1 })
    innerRingTl.to(ringInnerRef.value, {
      rotation: -360,
      duration: 45,
      ease: 'none',
    })

    // 光晕缩放呼吸
    const glowTl = gsap.timeline({ repeat: -1, yoyo: true })
    glowTl.to(glowContainerRef.value, {
      scale: 1.1,
      opacity: 0.7,
      duration: 4,
      ease: 'sine.inOut',
    })

    // 边缘光闪烁
    const edgeTl = gsap.timeline({ repeat: -1, yoyo: true })
    edgeTl.to(edgeLightRef.value, {
      opacity: 0.8,
      duration: 2,
      ease: 'sine.inOut',
    })

    // 暗角轻微呼吸
    const vignetteTl = gsap.timeline({ repeat: -1, yoyo: true })
    vignetteTl.to(vignetteRef.value, {
      opacity: 0.4,
      duration: 5,
      ease: 'sine.inOut',
    })

    // 背景光晕脉动
    const bgGlowTl = gsap.timeline({ repeat: -1, yoyo: true })
    bgGlowTl.to(glowRef.value, {
      opacity: 0.6,
      scale: 1.2,
      duration: 6,
      ease: 'sine.inOut',
    })

    cleanupFns.push(
      { revert: () => pulseTl.kill() },
      { revert: () => outerRingTl.kill() },
      { revert: () => innerRingTl.kill() },
      { revert: () => glowTl.kill() },
      { revert: () => edgeTl.kill() },
      { revert: () => vignetteTl.kill() },
      { revert: () => bgGlowTl.kill() },
    )
  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn.revert())
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style lang="scss" scoped>
.reversal-space {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0a0a1a 0%,
    #1a1a3a 25%,
    #0d0d25 50%,
    #151535 75%,
    #0a0a1a 100%
  );
}

.reversal-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-glow {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(ellipse 60% 50% at 50% 50%, rgba(100, 80, 200, 0.2) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 30% 70%, rgba(80, 120, 180, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 50% 60% at 70% 30%, rgba(120, 100, 200, 0.12) 0%, transparent 55%);
  filter: blur(40px);
  opacity: 0.4;
  will-change: transform, opacity;
}

.starlight-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.starlight-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(200, 180, 255, 0.9) 0%, rgba(150, 130, 220, 0.4) 50%, transparent 70%);
  border-radius: 50%;
  animation: starlightTwinkle ease-in-out infinite;
  filter: blur(0.3px);
}

@keyframes starlightTwinkle {
  0%, 100% {
    opacity: 0.1;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.2);
  }
}

.light-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 130%;
  height: 130%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  will-change: transform, opacity;
}

.light-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid;

  &.ring-outer {
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    border-color: rgba(150, 130, 220, 0.15);
    box-shadow:
      0 0 30px rgba(120, 100, 200, 0.1),
      inset 0 0 30px rgba(120, 100, 200, 0.08);
  }

  &.ring-inner {
    width: 85%;
    height: 85%;
    transform: translate(-50%, -50%);
    border-color: rgba(180, 160, 240, 0.12);
    box-shadow:
      0 0 20px rgba(150, 130, 220, 0.08),
      inset 0 0 20px rgba(150, 130, 220, 0.05);
  }
}

.reversal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, opacity, filter;
}

.reversal-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110%;
  height: 110%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, rgba(120, 100, 220, 0.25) 0%, rgba(80, 60, 180, 0.1) 40%, transparent 70%);
  border-radius: 20px;
  will-change: transform, opacity;
  pointer-events: none;
}

.reversal-frame {
  position: relative;
  padding: 10px;
  background: linear-gradient(135deg, rgba(100, 90, 180, 0.12) 0%, rgba(60, 50, 120, 0.08) 100%);
  border-radius: 12px;
  box-shadow:
    0 0 40px rgba(100, 80, 200, 0.15),
    inset 0 0 20px rgba(100, 80, 200, 0.05);
}

.frame-inner {
  position: relative;
}

.reversal-image {
  position: relative;
  width: 60vw;
  max-width: 850px;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.5),
    0 60px 120px rgba(30, 20, 80, 0.3),
    inset 0 0 60px rgba(100, 80, 200, 0.15);
  will-change: filter;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(1.1) contrast(1.05);
  }
}

.light-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 40% at 30% 30%, rgba(200, 180, 255, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 70% 70%, rgba(100, 80, 200, 0.15) 0%, transparent 45%);
  pointer-events: none;
  opacity: 0.1;
  will-change: opacity;
}

.edge-light {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  box-shadow:
    inset 2px 2px 20px rgba(200, 180, 255, 0.15),
    inset -2px -2px 20px rgba(100, 80, 200, 0.1);
  pointer-events: none;
  opacity: 0.3;
  will-change: opacity;
}

.frame-border {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(150, 130, 220, 0.25);
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
}

.pulse-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 105%;
  height: 105%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, rgba(150, 130, 220, 0.2) 0%, rgba(100, 80, 200, 0.08) 50%, transparent 70%);
  border-radius: 16px;
  pointer-events: none;
  will-change: transform, opacity;
}

.reversal-vignette {
  position: absolute;
  inset: -30px;
  border-radius: 20px;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    rgba(10, 10, 30, 0.6) 70%,
    rgba(5, 5, 20, 0.85) 100%
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
  border-color: rgba(180, 160, 240, 0.5);
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

.reversal-title {
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
    color: #e8e4f8;
    letter-spacing: 10px;
    text-shadow:
      0 0 20px rgba(150, 130, 220, 0.6),
      0 0 40px rgba(120, 100, 200, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.5);
    margin-bottom: 8px;
  }

  .title-en {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: rgba(200, 190, 240, 0.6);
    letter-spacing: 8px;
    text-transform: uppercase;
  }
}
</style>
