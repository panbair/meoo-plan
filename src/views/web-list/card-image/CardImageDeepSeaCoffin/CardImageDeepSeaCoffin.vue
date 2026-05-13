<template>
  <div class="card-image-deep-sea-coffin" ref="parentRef">
    <div class="scene-container" ref="sceneRef">
      <!-- 远景水体层 -->
      <div class="water-layer" ref="waterRef">
        <div class="water-texture"></div>
      </div>

      <!-- 中景青铜棺椁 -->
      <div class="coffin-container" ref="coffinRef">
        <div class="coffin-frame">
          <div class="coffin-body">
            <div class="coffin-image-wrapper" ref="imageWrapperRef">
              <img
                ref="imageRef"
                :src="imageUrl"
                :alt="title"
                class="coffin-image"
              />
            </div>
            <!-- 青铜锈蚀纹理层 -->
            <div class="rust-overlay" ref="rustRef"></div>
            <!-- 光柱效果 -->
            <div class="light-beam" ref="lightBeamRef"></div>
          </div>
        </div>
      </div>

      <!-- 近景深海雪屑 -->
      <div class="particles-layer" ref="particlesRef">
        <div
          v-for="i in 40"
          :key="i"
          class="particle"
          :ref="el => { if (el) particleRefs[i - 1] = el as HTMLElement }"
          :style="getParticleStyle(i)"
        ></div>
      </div>
    </div>

    <!-- 内容 -->
    <div class="content-overlay" ref="contentRef">
      <h2 class="title">{{ title }}</h2>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = { revert: () => void }

const props = withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  title: '深海悬棺',
  subtitle: '多维空间沉浸视差'
})

const parentRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const waterRef = ref<HTMLElement | null>(null)
const coffinRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const rustRef = ref<HTMLElement | null>(null)
const lightBeamRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)

const particleRefs = ref<(HTMLElement | null)[]>([])

let cleanupFns: TweenCleanup[] = []

const getParticleStyle = (index: number) => {
  const size = Math.random() * 3 + 1
  const xPos = Math.random() * 100
  const yPos = Math.random() * 100
  const delay = Math.random() * 5
  const duration = Math.random() * 3 + 4

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${xPos}%`,
    top: `${yPos}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

onMounted(() => {
  if (!parentRef.value) return

  const ctx = gsap.context(() => {
    // ========== 远景水体层 ==========
    const waterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })

    cleanupFns.push({
      revert: () => waterTimeline.kill()
    })

    if (waterRef.value) {
      // 远景水体初始在上方，向下滚动时下沉
      waterTimeline.fromTo(waterRef.value,
        { y: -100 },
        { y: 50, ease: 'none' },
        0
      )

      // 水体透明度随深度降低
      waterTimeline.fromTo(waterRef.value,
        { opacity: 0.5 },
        { opacity: 0.3, ease: 'sine.inOut' },
        0
      )
    }

    // ========== 中景青铜棺椁 ==========
    const coffinTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })

    cleanupFns.push({
      revert: () => coffinTimeline.kill()
    })

    if (coffinRef.value && imageRef.value) {
      // 棺椁初始在上方，向下滚动时下沉
      coffinTimeline.fromTo(coffinRef.value,
        { y: -40 },
        { y: 40, ease: 'sine.inOut' },
        0
      )

      // 棺椁绕Y轴旋转 -1.5deg 至 +1.5deg
      coffinTimeline.fromTo(coffinRef.value,
        { rotateY: 0 },
        { rotateY: 3, ease: 'sine.inOut' },
        0
      )

      // 亮度与对比度联动：初始清晰，向下滚动时略暗增强氛围
      coffinTimeline.fromTo(imageRef.value,
        { filter: 'brightness(1.0) contrast(1.0)' },
        { filter: 'brightness(0.9) contrast(1.05)', ease: 'sine.inOut' },
        0
      )
    }

    // ========== 光柱效果 ==========
    if (lightBeamRef.value && imageWrapperRef.value) {
      const lightTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({
        revert: () => lightTimeline.kill()
      })

      // 光柱从左上向右下移动
      lightTimeline.fromTo(lightBeamRef.value,
        { x: -200, y: -100, opacity: 0.05 },
        { x: 200, y: 100, opacity: 0.12, ease: 'sine.inOut' },
        0
      )
    }

    // ========== 锈蚀纹理联动 ==========
    if (rustRef.value) {
      const rustTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({
        revert: () => rustTimeline.kill()
      })

      // 锈蚀纹理随光柱显现
      rustTimeline.fromTo(rustRef.value,
        { opacity: 0.08 },
        { opacity: 0.25, ease: 'sine.inOut' },
        0
      )
    }

    // ========== 近景雪屑层 ==========
    const particlesTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })

    cleanupFns.push({
      revert: () => particlesTimeline.kill()
    })

    if (particlesRef.value) {
      // 雪屑上浮
      particlesTimeline.fromTo(particlesRef.value,
        { y: 0 },
        { y: -200, ease: 'none' },
        0
      )
    }

    // 粒子闪烁动画
    particleRefs.value.forEach((particle, index) => {
      if (!particle) return

      const flickerDuration = Math.random() * 2 + 1.5
      const flickerDelay = Math.random() * 3

      gsap.set(particle, { opacity: 0 })

      const flickerTl = gsap.timeline({
        repeat: -1,
        delay: flickerDelay
      })

      flickerTl.to(particle, {
        opacity: Math.random() * 0.6 + 0.2,
        duration: flickerDuration * 0.3,
        ease: 'power2.in'
      })
        .to(particle, {
          opacity: Math.random() * 0.3,
          duration: flickerDuration * 0.4,
          ease: 'power2.out'
        })
        .to(particle, {
          opacity: Math.random() * 0.5 + 0.1,
          duration: flickerDuration * 0.3,
          ease: 'power2.inOut'
        })

      cleanupFns.push({
        revert: () => flickerTl.kill()
      })
    })

    // ========== 内容入场动画 ==========
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1
      }
    })

    cleanupFns.push({
      revert: () => contentTl.kill()
    })

    if (contentRef.value) {
      contentTl.fromTo(contentRef.value,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: 'power3.out' },
        0
      )
    }

  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert?.())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.card-image-deep-sea-coffin {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg,
    #0a1628 0%,
    #0d2137 30%,
    #112942 60%,
    #0a1628 100%
  );
}

.scene-container {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1200px;
  overflow: hidden;
}

// ========== 远景水体层 ==========
.water-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.5;

  .water-texture {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(20, 60, 100, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 60%, rgba(15, 50, 90, 0.25) 0%, transparent 40%),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(30, 80, 130, 0.03) 2px,
        rgba(30, 80, 130, 0.03) 4px
      );
    animation: waterFlow 20s linear infinite;
  }
}

@keyframes waterFlow {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50px); }
}

// ========== 中景青铜棺椁 ==========
.coffin-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  perspective: 1000px;
}

.coffin-frame {
  position: relative;
  width: 75vw;
  max-width: 900px;
  aspect-ratio: 16 / 10;
  transform-style: preserve-3d;
}

.coffin-body {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    #2a3a2a 0%,
    #1a2518 25%,
    #2d3d2d 50%,
    #1a2518 75%,
    #2a3a2a 100%
  );
  border-radius: 12px;
  box-shadow:
    0 0 60px rgba(0, 0, 0, 0.8),
    inset 0 0 30px rgba(0, 0, 0, 0.5),
    0 0 120px rgba(20, 50, 40, 0.3);

  // 青铜边框
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    border: 3px solid transparent;
    border-image: linear-gradient(
      135deg,
      #4a5a3a 0%,
      #2a3525 25%,
      #5a6a4a 50%,
      #2a3525 75%,
      #4a5a3a 100%
    ) 1;
    pointer-events: none;
  }

  // 青铜装饰纹
  &::after {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 8px;
    border: 1px solid rgba(90, 106, 74, 0.3);
    pointer-events: none;
  }
}

.coffin-image-wrapper {
  position: absolute;
  inset: 16px;
  border-radius: 6px;
  overflow: hidden;
  background: #000;
}

.coffin-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.0) contrast(1.0);
}

// 锈蚀纹理层
.rust-overlay {
  position: absolute;
  inset: 16px;
  border-radius: 6px;
  background:
    radial-gradient(ellipse at 25% 30%, rgba(80, 100, 60, 0.15) 0%, transparent 30%),
    radial-gradient(ellipse at 75% 70%, rgba(60, 80, 50, 0.12) 0%, transparent 25%),
    radial-gradient(ellipse at 50% 50%, rgba(70, 90, 55, 0.1) 0%, transparent 40%);
  opacity: 0.08;
  mix-blend-mode: overlay;
  pointer-events: none;
}

// 光柱效果
.light-beam {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(150, 200, 255, 0.15) 0%,
    rgba(100, 180, 220, 0.08) 50%,
    transparent 100%
  );
  opacity: 0.05;
  pointer-events: none;
  border-radius: 6px;
}

// ========== 近景雪屑层 ==========
.particles-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(180, 220, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat 5s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) translateX(0);
  }
  20% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
    transform: translateY(-30px) translateX(10px);
  }
  80% {
    opacity: 0.5;
  }
}

// ========== 内容层 ==========
.content-overlay {
  position: absolute;
  bottom: 12vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  opacity: 0;
}

.title {
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: transparent;
  background: linear-gradient(135deg,
    #a8c8d8 0%,
    #c8e0e8 30%,
    #88b0c8 70%,
    #a0c0d0 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  letter-spacing: 0.3em;
  text-shadow: 0 0 40px rgba(150, 200, 220, 0.3);
  margin-bottom: 1rem;
}

.subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(160, 190, 210, 0.7);
  letter-spacing: 0.5em;
  font-weight: 300;
}
</style>
