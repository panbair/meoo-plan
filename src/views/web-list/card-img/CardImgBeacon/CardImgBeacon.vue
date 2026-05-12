<template>
  <section ref="parentRef" class="beacon-drop">
    <!-- 背景 -->
    <div class="beacon-bg">
      <div class="bg-glow" />
      <div class="bg-vignette" />
    </div>

    <!-- 尘埃粒子容器 -->
    <div class="dust-container" ref="dustContainerRef" />

    <!-- 信标图片 -->
    <div class="beacon-wrapper" ref="beaconWrapperRef">
      <!-- 气垫光晕 -->
      <div class="air-cushion" ref="airCushionRef" />
      <!-- 主图片 -->
      <div class="beacon-image-container" ref="beaconRef">
        <img
          :src="image.src"
          :alt="image.alt"
          class="beacon-image"
          ref="beaconImageRef"
        />
        <div class="beacon-frame" />
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="beacon-title">
      <span class="title-line">静默空降</span>
      <span class="title-sub">Silent Beacon</span>
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-decor">
      <span class="decor-line" />
      <span class="decor-dot" />
      <span class="decor-line" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ImageItem {
  src: string
  alt: string
}

const image: ImageItem = {
  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85',
  alt: 'Mountain Peak'
}

// DOM refs
const parentRef = ref<HTMLElement | null>(null)
const beaconRef = ref<HTMLElement | null>(null)
const beaconImageRef = ref<HTMLElement | null>(null)
const beaconWrapperRef = ref<HTMLElement | null>(null)
const airCushionRef = ref<HTMLElement | null>(null)
const dustContainerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

// Animation state
let scrollTriggerInstance: ScrollTrigger | null = null
let dustParticles: gsap.core.Tween[] = []
let settledTween: gsap.core.Tween | null = null

const initAnimations = () => {
  if (!parentRef.value || !beaconRef.value) return

  // 设置初始状态 - 从高处降落前的状态
  gsap.set(beaconRef.value, {
    y: -150,
    scale: 0.82,
    opacity: 0,
    filter: 'blur(18px)'
  })

  gsap.set(airCushionRef.value, {
    scaleY: 0.3,
    opacity: 0
  })

  gsap.set(titleRef.value, {
    opacity: 0,
    y: 30
  })

  // 创建 ScrollTrigger
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 80%',
    end: 'bottom 30%',
    scrub: 1.5,
    onUpdate: (self) => {
      const progress = self.progress

      // 信标降落动画
      // y: -150 -> 0 (下落)
      // scale: 0.82 -> 1.0 (放大)
      // opacity: 0 -> 1 (显现)
      // blur: 18px -> 0 (清晰)

      const y = -150 + 150 * progress
      const scale = 0.82 + 0.18 * progress
      const opacity = progress
      const blur = 18 - 18 * progress

      // 触地后的微弹效果 (progress > 0.9)
      let overshoot = 0
      if (progress > 0.92) {
        const landProgress = (progress - 0.92) / 0.08
        overshoot = Math.sin(landProgress * Math.PI) * 3 * (1 - landProgress)
      }

      gsap.set(beaconRef.value, {
        y: y + overshoot,
        scale,
        opacity,
        filter: `blur(${blur}px)`
      })

      // 气垫光晕效果 - 触地时最大
      if (progress > 0.7 && progress < 0.95) {
        const cushionProgress = (progress - 0.7) / 0.25
        const cushionScale = cushionProgress * 1.5
        const cushionOpacity = cushionProgress * 0.6
        gsap.set(airCushionRef.value, {
          scaleY: cushionScale,
          opacity: cushionOpacity
        })
      } else if (progress >= 0.95) {
        gsap.set(airCushionRef.value, {
          scaleY: 0,
          opacity: 0
        })
      }

      // box-shadow 变化
      const shadowIntensity = Math.min(1, progress * 1.5)
      const shadowBlur = 20 + shadowIntensity * 40
      const shadowY = 20 + shadowIntensity * 30
      ;(beaconRef.value as HTMLElement).style.boxShadow = `
        0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${0.2 + shadowIntensity * 0.3}),
        0 0 ${30 + shadowIntensity * 50}px rgba(100, 180, 255, ${shadowIntensity * 0.1})
      `

      // 标题显现
      if (progress > 0.75) {
        const titleProgress = (progress - 0.75) / 0.25
        gsap.set(titleRef.value, {
          opacity: titleProgress,
          y: 30 - 30 * titleProgress
        })
      } else {
        gsap.set(titleRef.value, { opacity: 0, y: 30 })
      }

      // 触地瞬间生成尘埃粒子
      if (progress >= 0.92 && progress < 0.94) {
        createDustParticles()
      }
    }
  })
}

const createDustParticles = () => {
  if (!dustContainerRef.value || dustParticles.length > 0) return

  const particleCount = 10

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'dust-particle'
    dustContainerRef.value.appendChild(particle)

    // 随机位置和方向
    const startX = (Math.random() - 0.5) * 200
    const angle = Math.random() * Math.PI - Math.PI / 2 // 向上的角度
    const velocity = 30 + Math.random() * 40
    const vx = Math.cos(angle) * velocity
    const vy = -Math.abs(Math.sin(angle) * velocity) // 向上

    const tween = gsap.fromTo(
      particle,
      {
        x: startX,
        y: 0,
        opacity: 0.8,
        scale: 1
      },
      {
        x: `+=${vx}`,
        y: `+=${vy}`,
        opacity: 0,
        scale: 0.3,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove()
        }
      }
    )

    dustParticles.push(tween)
  }

  // 清理粒子数组
  setTimeout(() => {
    dustParticles = []
  }, 700)
}

const startSettledAnimation = () => {
  if (settledTween) return

  settledTween = gsap.to(beaconRef.value, {
    y: -2,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  })
}

onMounted(() => {
  nextTick(() => {
    initAnimations()
  })
})

onUnmounted(() => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
    scrollTriggerInstance = null
  }

  if (settledTween) {
    settledTween.kill()
    settledTween = null
  }

  dustParticles.forEach(t => t.kill())
  dustParticles = []

  gsap.killTweensOf(beaconRef.value)
  gsap.killTweensOf(airCushionRef.value)
  gsap.killTweensOf(titleRef.value)
})
</script>

<style scoped lang="scss">
.beacon-drop {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #0d1520 0%, #0a1018 50%, #0f1825 100%);
}

.beacon-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 60% 40% at 50% 60%,
    rgba(100, 180, 255, 0.08) 0%,
    transparent 60%
  );
}

.bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.dust-container {
  position: absolute;
  bottom: 35%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 100px;
  pointer-events: none;
  z-index: 5;

  :global(.dust-particle) {
    position: absolute;
    width: 4px;
    height: 4px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(200, 220, 255, 0.4) 50%,
      transparent 100%
    );
    border-radius: 50%;
    filter: blur(1px);
  }
}

.beacon-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.air-cushion {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%) scaleY(0.3);
  width: 280px;
  height: 40px;
  background: radial-gradient(
    ellipse at center top,
    rgba(100, 180, 255, 0.3) 0%,
    rgba(100, 180, 255, 0.1) 40%,
    transparent 70%
  );
  transform-origin: center top;
  filter: blur(10px);
  pointer-events: none;
  z-index: 0;
}

.beacon-image-container {
  position: relative;
  width: 500px;
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(100, 180, 255, 0.1);
  z-index: 1;
  transform-style: preserve-3d;
  perspective: 1000px;

  .beacon-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .beacon-frame {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    pointer-events: none;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      border: 2px solid rgba(100, 180, 255, 0.3);
    }

    &::before {
      top: 10px;
      left: 10px;
      border-right: none;
      border-bottom: none;
    }

    &::after {
      bottom: 10px;
      right: 10px;
      border-left: none;
      border-top: none;
    }
  }
}

.beacon-title {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;

  .title-line {
    display: block;
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: 36px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 12px;
    text-shadow:
      0 0 40px rgba(100, 180, 255, 0.5),
      0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .title-sub {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    color: rgba(100, 180, 255, 0.7);
    letter-spacing: 8px;
    margin-top: 12px;
    text-transform: uppercase;
  }
}

.bottom-decor {
  position: absolute;
  bottom: 40px;
  display: flex;
  align-items: center;
  gap: 12px;

  .decor-line {
    width: 50px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(100, 180, 255, 0.3),
      transparent
    );
  }

  .decor-dot {
    width: 6px;
    height: 6px;
    background: rgba(100, 180, 255, 0.5);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(100, 180, 255, 0.5);
  }
}

@media (max-width: 768px) {
  .beacon-image-container {
    width: 320px;
    height: 220px;
  }

  .air-cushion {
    width: 200px;
  }

  .beacon-title {
    bottom: 70px;

    .title-line {
      font-size: 24px;
      letter-spacing: 6px;
    }

    .title-sub {
      font-size: 11px;
      letter-spacing: 4px;
    }
  }
}

@media (max-width: 480px) {
  .beacon-image-container {
    width: 260px;
    height: 180px;
  }

  .beacon-title {
    bottom: 50px;

    .title-line {
      font-size: 20px;
      letter-spacing: 4px;
    }
  }
}
</style>
