<template>
  <section ref="parentRef" class="ripple-container">
    <div class="ripple-wrapper">
      <!-- SVG滤镜定义 - 同心涟漪扭曲 -->
      <svg class="filter-svg" aria-hidden="true">
        <defs>
          <!-- 径向渐变生成同心涟漪纹理 -->
          <radialGradient id="ripple-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
            <stop offset="40%" stop-color="#87ceeb" stop-opacity="0.3" />
            <stop offset="60%" stop-color="#87ceeb" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#1e90ff" stop-opacity="0.2" />
          </radialGradient>

          <!-- 同心涟漪噪声滤镜 -->
          <filter id="water-ripple-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <!-- 同心圆涟漪噪声 -->
            <feTurbulence
              ref="turbulenceRef"
              type="turbulence"
              baseFrequency="0.015"
              numOctaves="3"
              result="ripple-noise"
              seed="8"
            />
            <!-- 边缘模糊 -->
            <feGaussianBlur
              in="ripple-noise"
              stdDeviation="0.5"
              result="blurred-ripple"
            />
            <!-- 位移映射 -->
            <feDisplacementMap
              ref="displacementMapRef"
              in="SourceGraphic"
              in2="blurred-ripple"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <!-- 颜色增强 -->
            <feColorMatrix
              in="displaced"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0.1 0 0.05
                      0 0 1 0 0.1
                      0 0 0 1 0"
              result="colored"
            />
          </filter>

          <!-- 水面折射模糊 -->
          <filter id="water-blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>

          <!-- 发光效果 -->
          <filter id="glow-effect">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <!-- 水色遮罩层 -->
      <div ref="waterMaskRef" class="water-mask"></div>

      <!-- 主图片 -->
      <div ref="imageWrapperRef" class="image-wrapper">
        <img
          ref="mainImageRef"
          class="ripple-image"
          src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80"
          alt="Ocean Waves"
          style="filter: url(#water-ripple-displacement)"
        />

        <!-- 涟漪扩散圈 -->
        <div ref="rippleRing1Ref" class="ripple-ring ripple-ring-1"></div>
        <div ref="rippleRing2Ref" class="ripple-ring ripple-ring-2"></div>
        <div ref="rippleRing3Ref" class="ripple-ring ripple-ring-3"></div>

        <!-- 中心涟漪脉冲 -->
        <div ref="centerPulseRef" class="center-pulse"></div>
      </div>

      <!-- 四角水光折射 -->
      <div ref="cornerFlashRef" class="corner-flash"></div>

      <!-- 底部水波 -->
      <div ref="bottomWaveRef" class="bottom-wave"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const turbulenceRef = ref<SVGElement | null>(null)
const displacementMapRef = ref<SVGElement | null>(null)
const waterMaskRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const rippleRing1Ref = ref<HTMLElement | null>(null)
const rippleRing2Ref = ref<HTMLElement | null>(null)
const rippleRing3Ref = ref<HTMLElement | null>(null)
const centerPulseRef = ref<HTMLElement | null>(null)
const cornerFlashRef = ref<HTMLElement | null>(null)
const bottomWaveRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value) return

  const turbulenceEl = turbulenceRef.value
  const displacementEl = displacementMapRef.value
  const waterMask = waterMaskRef.value
  const wrapper = imageWrapperRef.value
  const image = mainImageRef.value
  const ring1 = rippleRing1Ref.value
  const ring2 = rippleRing2Ref.value
  const ring3 = rippleRing3Ref.value
  const pulse = centerPulseRef.value
  const corners = cornerFlashRef.value
  const bottomWave = bottomWaveRef.value

  if (!turbulenceEl || !displacementEl || !wrapper || !image) return

  // ========== 主涟漪扭曲消退动画 ==========
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'center center',
      scrub: 1.5,
    },
  })

  // 初始状态设置
  gsap.set(image, { opacity: 0.4 })
  gsap.set(wrapper, { scale: 1.08, filter: 'brightness(0.7) saturate(0.9)' })
  if (waterMask) gsap.set(waterMask, { opacity: 0.3 })

  // 同心涟漪扩散动画
  if (ring1) {
    gsap.set(ring1, { scale: 0.1, opacity: 0 })
    mainTl.to(ring1, {
      scale: 2.5,
      opacity: 0.8,
      duration: 0.3,
      ease: 'power2.out',
    }, 0)
    mainTl.to(ring1, {
      scale: 3.5,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.in',
    }, 0.2)
  }

  if (ring2) {
    gsap.set(ring2, { scale: 0.1, opacity: 0 })
    mainTl.to(ring2, {
      scale: 2.8,
      opacity: 0.6,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.15)
    mainTl.to(ring2, {
      scale: 4,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
    }, 0.35)
  }

  if (ring3) {
    gsap.set(ring3, { scale: 0.1, opacity: 0 })
    mainTl.to(ring3, {
      scale: 3,
      opacity: 0.4,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.3)
    mainTl.to(ring3, {
      scale: 4.5,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, 0.5)
  }

  // 中心脉冲效果 - 石子落水
  if (pulse) {
    gsap.set(pulse, { scale: 0, opacity: 0 })
    mainTl.fromTo(pulse,
      { scale: 0.2, opacity: 0.8 },
      { scale: 2, opacity: 0, duration: 1.2, ease: 'power2.out' },
      0.1
    )
  }

  // 位移强度主消退 (从8到0)
  mainTl.to(displacementEl, {
    attr: { scale: 0 },
    duration: 2.2,
    ease: 'sine.inOut',
  }, 0)

  // 涟漪消退前的石子落水脉冲 - 在归零前0.3s短暂升至4后急速归零
  mainTl.to(displacementEl, {
    attr: { scale: 4 },
    duration: 0.15,
    ease: 'power2.out',
  }, 1.9)
  mainTl.to(displacementEl, {
    attr: { scale: 0 },
    duration: 0.15,
    ease: 'power2.in',
  }, 2.05)

  // 噪声频率降低 - 涟漪趋于平静
  mainTl.to(turbulenceEl, {
    attr: { baseFrequency: '0.002' },
    duration: 2.2,
    ease: 'power2.inOut',
  }, 0)

  cleanupFns.push(() => mainTl.scrollTrigger?.kill())
  cleanupFns.push(() => mainTl.kill())

  // ========== 透明度溶解动画 ==========
  if (image) {
    const opacityTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5,
      },
    })

    opacityTl.to(image, {
      opacity: 1,
      duration: 2,
      ease: 'power2.inOut',
    }, 0)

    // 图片缩放还原 + 亮度提升
    opacityTl.to(wrapper, {
      scale: 1,
      filter: 'brightness(1) saturate(1.05)',
      duration: 2,
      ease: 'power2.out',
    }, 0.1)

    cleanupFns.push(() => opacityTl.scrollTrigger?.kill())
    cleanupFns.push(() => opacityTl.kill())
  }

  // ========== 水色遮罩消退 ==========
  if (waterMask) {
    const maskTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5,
      },
    })

    maskTl.to(waterMask, {
      opacity: 0,
      duration: 2.2,
      ease: 'sine.inOut',
    }, 0)

    cleanupFns.push(() => maskTl.scrollTrigger?.kill())
    cleanupFns.push(() => maskTl.kill())
  }

  // ========== 四角水光折射微闪 ==========
  if (corners) {
    gsap.set(corners, { opacity: 0 })

    const cornerTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'center center',
        end: 'bottom top',
        scrub: 2,
      },
    })

    // 入场时微闪
    cornerTl.to(corners, {
      opacity: 0.6,
      duration: 0.3,
      ease: 'power2.out',
    }, 0)
    // 低频呼吸动画
    cornerTl.to(corners, {
      opacity: 0.3,
      duration: 1,
      ease: 'sine.inOut',
    }, 0.2)
    // 消散
    cornerTl.to(corners, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.in',
    }, 0.8)

    cleanupFns.push(() => cornerTl.scrollTrigger?.kill())
    cleanupFns.push(() => cornerTl.kill())
  }

  // ========== 底部水波动画 ==========
  if (bottomWave) {
    gsap.set(bottomWave, { opacity: 0 })

    const waveTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5,
      },
    })

    waveTl.to(bottomWave, {
      opacity: 0.4,
      duration: 0.5,
      ease: 'power2.out',
    }, 0)
    waveTl.to(bottomWave, {
      opacity: 0,
      y: -30,
      duration: 1.5,
      ease: 'power2.inOut',
    }, 0.3)

    cleanupFns.push(() => waveTl.scrollTrigger?.kill())
    cleanupFns.push(() => waveTl.kill())
  }

  // ========== 持续微波动画 ==========
  gsap.to(wrapper, {
    y: '3px',
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.ripple-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #0a1628 0%,
    #0d2847 30%,
    #0a3d62 60%,
    #0d2847 100%
  );
}

.ripple-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
}

/* SVG滤镜容器 */
.filter-svg {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* 水色遮罩 */
.water-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 144, 255, 0.25) 0%,
    rgba(135, 206, 235, 0.2) 30%,
    rgba(72, 209, 204, 0.25) 60%,
    rgba(30, 144, 255, 0.2) 100%
  );
  pointer-events: none;
  z-index: 5;
}

/* 图片包装器 */
.image-wrapper {
  position: relative;
  width: min(90vw, 1100px);
  height: min(70vh, 750px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 0 80px rgba(30, 144, 255, 0.3),
    0 0 160px rgba(72, 209, 204, 0.2),
    inset 0 0 60px rgba(135, 206, 235, 0.1);

  .ripple-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform-origin: center center;
  }
}

/* 涟漪圈 */
.ripple-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(135, 206, 235, 0.6);
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow:
    0 0 20px rgba(135, 206, 235, 0.4),
    inset 0 0 20px rgba(135, 206, 235, 0.2);
}

.ripple-ring-1 {
  border-color: rgba(30, 144, 255, 0.7);
}

.ripple-ring-2 {
  border-color: rgba(72, 209, 204, 0.5);
}

.ripple-ring-3 {
  border-color: rgba(135, 206, 235, 0.4);
}

/* 中心脉冲 */
.center-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(135, 206, 235, 0.4) 40%,
    transparent 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow:
    0 0 30px rgba(135, 206, 235, 0.8),
    0 0 60px rgba(72, 209, 204, 0.5);
}

/* 四角水光折射 */
.corner-flash {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background:
    /* 左上角 */
    radial-gradient(
      ellipse 150px 150px at 5% 5%,
      rgba(135, 206, 235, 0.4) 0%,
      transparent 70%
    ),
    /* 右上角 */
    radial-gradient(
      ellipse 150px 150px at 95% 5%,
      rgba(72, 209, 204, 0.4) 0%,
      transparent 70%
    ),
    /* 左下角 */
    radial-gradient(
      ellipse 150px 150px at 5% 95%,
      rgba(72, 209, 204, 0.3) 0%,
      transparent 70%
    ),
    /* 右下角 */
    radial-gradient(
      ellipse 150px 150px at 95% 95%,
      rgba(135, 206, 235, 0.4) 0%,
      transparent 70%
    );
  filter: blur(8px);
  animation: cornerBreath 2s ease-in-out infinite;
}

@keyframes cornerBreath {
  0%, 100% {
    opacity: 0.3;
    filter: blur(8px);
  }
  50% {
    opacity: 0.6;
    filter: blur(10px);
  }
}

/* 底部水波 */
.bottom-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    to top,
    rgba(30, 144, 255, 0.15) 0%,
    rgba(135, 206, 235, 0.1) 30%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 3;
  filter: blur(4px);
}

/* 入场前的微光效果 */
.image-wrapper::before {
  content: '';
  position: absolute;
  inset: -5px;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(135, 206, 235, 0.1) 50%,
    transparent 70%
  );
  animation: shimmerMove 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 15;
  border-radius: 12px;
}

@keyframes shimmerMove {
  0%, 100% {
    transform: translateX(-100%) rotate(45deg);
    opacity: 0;
  }
  50% {
    transform: translateX(100%) rotate(45deg);
    opacity: 1;
  }
}

/* 水面光泽效果 */
.ripple-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 40%,
    transparent 60%,
    rgba(135, 206, 235, 0.03) 100%
  );
  pointer-events: none;
  z-index: 20;
}
</style>
