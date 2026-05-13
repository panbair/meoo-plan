<template>
  <section ref="parentRef" class="mirage-container">
    <div class="mirage-wrapper">
      <!-- SVG滤镜定义 -->
      <svg class="filter-svg" aria-hidden="true">
        <defs>
          <filter ref="displacementFilterRef" id="mirage-displacement">
            <!-- 动态噪声 -->
            <feTurbulence
              ref="turbulenceRef"
              type="turbulence"
              baseFrequency="0.04"
              numOctaves="3"
              result="turbulence"
              seed="5"
            />
            <!-- 位移映射 -->
            <feDisplacementMap
              ref="displacementMapRef"
              in="SourceGraphic"
              in2="turbulence"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <!-- 高光增强 -->
            <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred" />
            <feComposite in="displaced" in2="blurred" operator="over" />
          </filter>
        </defs>
      </svg>

      <!-- 主图片 -->
      <div ref="imageWrapperRef" class="image-wrapper">
        <img
          ref="mainImageRef"
          class="mirage-image"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Mountain Landscape"
          style="filter: url(#mirage-displacement)"
        />
        <!-- 热晕层 -->
        <div ref="heatGlowRef" class="heat-glow"></div>
      </div>

      <!-- 边缘光晕 -->
      <div ref="edgeGlowRef" class="edge-glow"></div>
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
const displacementFilterRef = ref<SVGFilterElement | null>(null)
const turbulenceRef = ref<SVGFEBlendElement | SVGElement | null>(null)
const displacementMapRef = ref<SVGFEBlendElement | SVGElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const heatGlowRef = ref<HTMLElement | null>(null)
const edgeGlowRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value) return

  // 获取滤镜元素
  const filterEl = displacementFilterRef.value
  const turbulenceEl = turbulenceRef.value
  const displacementEl = displacementMapRef.value
  const wrapper = imageWrapperRef.value
  const image = mainImageRef.value
  const heatGlow = heatGlowRef.value
  const edgeGlow = edgeGlowRef.value

  if (!filterEl || !turbulenceEl || !displacementEl || !wrapper || !image) return

  // ========== 主扭曲消退动画 ==========
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top center',
      end: 'bottom top',
      scrub: 2,
    },
  })

  // 位移强度消退
  mainTl.to(displacementEl, {
    attr: { scale: 0 },
    duration: 1,
    ease: 'power3.out',
  })

  // 噪声平息
  mainTl.to(turbulenceEl, {
    attr: { baseFrequency: '0.005' },
    duration: 1,
    ease: 'power2.out',
  }, 0)

  cleanupFns.push(() => mainTl.scrollTrigger?.kill())
  cleanupFns.push(() => mainTl.kill())

  // ========== 透明度溶解 ==========
  if (image) {
    const opacityTween = gsap.to(image, {
      opacity: 1,
      filter: 'url(#mirage-displacement) brightness(1)',
      duration: 1,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top center',
        end: 'bottom top',
        scrub: 2,
      },
    })
    cleanupFns.push(() => opacityTween.scrollTrigger?.kill())
    cleanupFns.push(() => opacityTween.kill())
  }

  // ========== 包装容器动画 ==========
  if (wrapper) {
    const wrapperTween = gsap.fromTo(wrapper,
      {
        filter: 'brightness(0.6) saturate(0.8)',
        transform: 'scale(1.05)',
      },
      {
        filter: 'brightness(1) saturate(1.1)',
        transform: 'scale(1)',
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top center',
          end: 'bottom top',
          scrub: 2,
        },
      }
    )
    cleanupFns.push(() => wrapperTween.scrollTrigger?.kill())
    cleanupFns.push(() => wrapperTween.kill())
  }

  // ========== 热晕余韵 ==========
  if (heatGlow) {
    const heatTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top center',
        end: 'bottom top',
        scrub: 2,
      },
    })

    heatTl
      .fromTo(heatGlow,
        { opacity: 0.3, scale: 0.8 },
        { opacity: 0.5, scale: 1.1, duration: 0.4 },
        0.6
      )
      .to(heatGlow,
        { opacity: 0, duration: 0.6 },
        0.8
      )

    cleanupFns.push(() => heatTl.scrollTrigger?.kill())
    cleanupFns.push(() => heatTl.kill())
  }

  // ========== 边缘光晕 ==========
  if (edgeGlow) {
    const edgeTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top center',
        end: 'bottom top',
        scrub: 2,
      },
    })

    edgeTl
      .fromTo(edgeGlow,
        { opacity: 0, scale: 0.9 },
        { opacity: 0.4, scale: 1.05, duration: 0.3 },
        0.7
      )
      .to(edgeGlow,
        { opacity: 0, duration: 0.5 },
        0.85
      )

    cleanupFns.push(() => edgeTl.scrollTrigger?.kill())
    cleanupFns.push(() => edgeTl.kill())
  }

  // ========== 波动效果入场 ==========
  // 初始时添加微弱的波动动画
  gsap.set(wrapper, {
    '--wave-x': '0deg',
  })

  gsap.to(wrapper, {
    '--wave-x': '360deg',
    duration: 8,
    repeat: -1,
    ease: 'none',
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.mirage-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #1a0a05 0%,
    #2d1810 25%,
    #1a0a05 50%,
    #2d1810 75%,
    #1a0a05 100%
  );
}

.mirage-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

/* SVG滤镜容器 */
.filter-svg {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* 图片包装器 */
.image-wrapper {
  position: relative;
  width: min(85vw, 1000px);
  height: min(65vh, 700px);
  transform: scale(1.05);
  filter: brightness(0.6) saturate(0.8);
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 0 60px rgba(255, 150, 50, 0.2),
    0 0 120px rgba(255, 100, 30, 0.15);

  .mirage-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.5;
    transform-origin: center center;
  }

  .heat-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 60% at 50% 50%,
      rgba(255, 180, 100, 0.3) 0%,
      rgba(255, 120, 50, 0.15) 40%,
      transparent 70%
    );
    pointer-events: none;
    opacity: 0.3;
    mix-blend-mode: overlay;
  }
}

/* 边缘光晕 */
.edge-glow {
  position: absolute;
  inset: 10%;
  border-radius: 12px;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    rgba(255, 160, 80, 0.1) 50%,
    rgba(255, 120, 50, 0.15) 70%,
    transparent 85%
  );
  pointer-events: none;
  opacity: 0;
  filter: blur(20px);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    border: 1px solid rgba(255, 200, 150, 0.2);
  }
}

/* 热浪波纹效果 */
@keyframes heatWave {
  0% {
    transform: translateX(-2px) scaleY(1.002);
  }
  50% {
    transform: translateX(2px) scaleY(0.998);
  }
  100% {
    transform: translateX(-2px) scaleY(1.002);
  }
}

.image-wrapper::before {
  content: '';
  position: absolute;
  inset: -10px;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    rgba(255, 200, 150, 0.03) 1px,
    transparent 2px,
    transparent 8px
  );
  pointer-events: none;
  z-index: 10;
  animation: heatWave 3s ease-in-out infinite;
}

/* 底部热浪效果 */
.mirage-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(
    to top,
    rgba(255, 150, 50, 0.15) 0%,
    transparent 100%
  );
  pointer-events: none;
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% {
    opacity: 0.3;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.5;
    transform: scaleY(1.1);
  }
}
</style>
