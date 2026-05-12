<template>
  <section ref="parentRef" class="velvet-curtain">
    <!-- 背景 -->
    <div class="velvet-bg">
      <div class="bg-gradient" />
      <div class="bg-pattern" />
    </div>

    <!-- 微尘容器 -->
    <div class="dust-container" ref="dustContainerRef" />

    <!-- 丝绒图片 -->
    <div class="velvet-wrapper" ref="velvetWrapperRef">
      <!-- 地面阴影 -->
      <div class="ground-shadow" ref="shadowRef" />
      <!-- 主图片 -->
      <div class="velvet-container" ref="velvetRef">
        <img
          :src="image.src"
          :alt="image.alt"
          class="velvet-image"
          ref="velvetImageRef"
        />
        <!-- 边缘光晕 -->
        <div class="velvet-glow" ref="glowRef" />
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="velvet-title">
      <span class="title-line">丝绒垂幕</span>
      <span class="title-sub">Velvet Curtain</span>
    </div>

    <!-- 装饰线 -->
    <div class="decor-lines">
      <div class="decor-line decor-line-left" />
      <div class="decor-line decor-line-right" />
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
  src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85',
  alt: 'Luxury Scene'
}

// DOM refs
const parentRef = ref<HTMLElement | null>(null)
const velvetRef = ref<HTMLElement | null>(null)
const velvetImageRef = ref<HTMLElement | null>(null)
const velvetWrapperRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const shadowRef = ref<HTMLElement | null>(null)
const dustContainerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

// Animation state
let scrollTriggerInstance: ScrollTrigger | null = null
let dustParticles: gsap.core.Tween[] = []
let glowTween: gsap.core.Tween | null = null
let isLanded = false

const initAnimations = () => {
  if (!parentRef.value || !velvetRef.value) return

  // 设置初始状态
  gsap.set(velvetRef.value, {
    y: -80,
    scale: 0.88,
    scaleY: 1,
    opacity: 0,
    filter: 'blur(12px)'
  })

  gsap.set(shadowRef.value, {
    scaleX: 0.1,
    opacity: 0
  })

  gsap.set(titleRef.value, {
    opacity: 0,
    y: 30
  })

  gsap.set(glowRef.value, {
    opacity: 0
  })

  // 创建 ScrollTrigger
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 80%',
    end: 'bottom 30%',
    scrub: 1.5,
    onUpdate: (self) => {
      const progress = self.progress

      // 核心四属性动画
      const y = -80 + 80 * progress
      const scale = 0.88 + 0.12 * progress
      const opacity = progress
      const blur = 12 - 12 * progress

      // 纵向压缩形变 - 触底时
      let scaleY = 1
      if (progress > 0.88 && progress < 0.94) {
        const landProgress = (progress - 0.88) / 0.06
        scaleY = 1 - 0.06 * Math.sin(landProgress * Math.PI)
      }

      // 能量曲线 - 前段慢后段快
      const energyCurve = Math.pow(progress, 1.5)
      const adjustedY = -80 + 80 * energyCurve

      gsap.set(velvetRef.value, {
        y: adjustedY,
        scale,
        scaleY,
        opacity,
        filter: `blur(${blur}px)`
      })

      // 阴影变化
      if (progress > 0.5) {
        const shadowProgress = (progress - 0.5) / 0.5
        const shadowScale = 0.1 + 0.9 * shadowProgress
        const shadowOpacity = shadowProgress * 0.6
        gsap.set(shadowRef.value, {
          scaleX: shadowScale,
          opacity: shadowOpacity
        })
      }

      // 标题显现
      if (progress > 0.65) {
        const titleProgress = (progress - 0.65) / 0.35
        gsap.set(titleRef.value, {
          opacity: titleProgress,
          y: 30 - 30 * titleProgress
        })
      } else {
        gsap.set(titleRef.value, { opacity: 0, y: 30 })
      }

      // 触地瞬间生成微尘
      if (progress >= 0.9 && progress < 0.92 && !isLanded) {
        isLanded = true
        createDustParticles()
        startGlowAnimation()
      }

      // 重新进入视野时重置
      if (progress < 0.85) {
        isLanded = false
      }
    }
  })
}

const createDustParticles = () => {
  if (!dustContainerRef.value) return

  const particleCount = 7

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'dust-particle'
    dustContainerRef.value.appendChild(particle)

    const startX = (Math.random() - 0.5) * 200
    const angle = Math.random() * Math.PI - Math.PI / 2
    const velocity = 8 + Math.random() * 15
    const vx = Math.cos(angle) * velocity * 0.5
    const vy = -Math.abs(Math.sin(angle) * velocity)

    const tween = gsap.fromTo(
      particle,
      {
        x: startX,
        y: 0,
        opacity: 0.5,
        scale: 1
      },
      {
        x: `+=${vx}`,
        y: `+=${vy}`,
        opacity: 0,
        scale: 0.15,
        duration: 0.6,
        ease: 'power1.out',
        onComplete: () => {
          particle.remove()
        }
      }
    )

    dustParticles.push(tween)
  }

  setTimeout(() => {
    dustParticles = []
  }, 700)
}

const startGlowAnimation = () => {
  if (glowTween) return

  // 边缘柔光镶边呼吸
  glowTween = gsap.to(glowRef.value, {
    opacity: 0.6,
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

  if (glowTween) {
    glowTween.kill()
    glowTween = null
  }

  dustParticles.forEach(t => t.kill())
  dustParticles = []

  gsap.killTweensOf(velvetRef.value)
  gsap.killTweensOf(shadowRef.value)
  gsap.killTweensOf(titleRef.value)
  gsap.killTweensOf(glowRef.value)
})
</script>

<style scoped lang="scss">
.velvet-curtain {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #12101a 0%, #0a0810 50%, #151218 100%);
}

.velvet-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 40% 50% at 50% 55%,
    rgba(180, 160, 200, 0.06) 0%,
    transparent 60%
  );
}

.bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(200, 180, 220, 0.03) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(180, 160, 200, 0.03) 0%, transparent 40%);
}

.dust-container {
  position: absolute;
  bottom: 32%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 80px;
  pointer-events: none;
  z-index: 5;

  :global(.dust-particle) {
    position: absolute;
    width: 2px;
    height: 2px;
    background: radial-gradient(
      circle,
      rgba(220, 210, 230, 0.8) 0%,
      rgba(200, 190, 210, 0.3) 50%,
      transparent 100%
    );
    border-radius: 50%;
    filter: blur(0.3px);
  }
}

.velvet-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ground-shadow {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 18px;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.5) 0%,
    transparent 70%
  );
  filter: blur(10px);
  transform-origin: center center;
}

.velvet-container {
  position: relative;
  width: 420px;
  height: 560px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(180, 160, 200, 0.1);
  transform-style: preserve-3d;
  perspective: 1000px;
  z-index: 1;

  .velvet-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .velvet-glow {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    box-shadow:
      inset 0 0 30px rgba(220, 210, 230, 0.1),
      inset 2px 0 20px rgba(220, 210, 230, 0.05),
      inset -2px 0 20px rgba(220, 210, 230, 0.05),
      inset 0 2px 15px rgba(220, 210, 230, 0.05),
      inset 0 -2px 15px rgba(220, 210, 230, 0.05);
    pointer-events: none;
    opacity: 0;
  }
}

.velvet-title {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;

  .title-line {
    display: block;
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: 32px;
    font-weight: 600;
    color: #e8e4f0;
    letter-spacing: 10px;
    text-shadow:
      0 0 40px rgba(200, 180, 220, 0.5),
      0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .title-sub {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    color: rgba(200, 190, 220, 0.6);
    letter-spacing: 6px;
    margin-top: 12px;
    text-transform: uppercase;
  }
}

.decor-lines {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 100px;
  pointer-events: none;

  .decor-line {
    width: 80px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(200, 180, 220, 0.3),
      transparent
    );
  }
}

@media (max-width: 768px) {
  .velvet-container {
    width: 280px;
    height: 380px;
  }

  .ground-shadow {
    width: 220px;
  }

  .velvet-title {
    bottom: 70px;

    .title-line {
      font-size: 22px;
      letter-spacing: 6px;
    }

    .title-sub {
      font-size: 10px;
      letter-spacing: 3px;
    }
  }

  .decor-lines {
    gap: 60px;

    .decor-line {
      width: 50px;
    }
  }
}

@media (max-width: 480px) {
  .velvet-container {
    width: 220px;
    height: 300px;
  }

  .ground-shadow {
    width: 180px;
  }

  .velvet-title {
    bottom: 50px;

    .title-line {
      font-size: 18px;
      letter-spacing: 4px;
    }
  }
}
</style>
