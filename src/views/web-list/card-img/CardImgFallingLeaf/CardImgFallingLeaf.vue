<template>
  <section ref="parentRef" class="falling-leaf">
    <!-- 背景 -->
    <div class="leaf-bg">
      <div class="bg-gradient" />
      <div class="bg-particles" />
    </div>

    <!-- 尘埃容器 -->
    <div class="dust-container" ref="dustContainerRef" />

    <!-- 秋叶图片 -->
    <div class="leaf-wrapper" ref="leafWrapperRef">
      <!-- 地面阴影 -->
      <div class="ground-shadow" ref="shadowRef" />
      <!-- 主图片 -->
      <div class="leaf-container" ref="leafRef">
        <img
          :src="image.src"
          :alt="image.alt"
          class="leaf-image"
          ref="leafImageRef"
        />
        <!-- 叶柄效果 -->
        <div class="leaf-stem" ref="stemRef" />
        <!-- 叶脉装饰 -->
        <div class="leaf-vein" />
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="leaf-title">
      <span class="title-line">叶落归根</span>
      <span class="title-sub">Falling Leaf</span>
    </div>

    <!-- 装饰 -->
    <div class="decor-elements">
      <span class="decor-leaf decor-leaf-1">🍂</span>
      <span class="decor-leaf decor-leaf-2">🍃</span>
      <span class="decor-leaf decor-leaf-3">🍁</span>
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
  src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85',
  alt: 'Autumn Scene'
}

// DOM refs
const parentRef = ref<HTMLElement | null>(null)
const leafRef = ref<HTMLElement | null>(null)
const leafImageRef = ref<HTMLElement | null>(null)
const leafWrapperRef = ref<HTMLElement | null>(null)
const stemRef = ref<HTMLElement | null>(null)
const shadowRef = ref<HTMLElement | null>(null)
const dustContainerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

// Animation state
let scrollTriggerInstance: ScrollTrigger | null = null
let dustParticles: gsap.core.Tween[] = []
let stemTween: gsap.core.Tween | null = null
let isLanded = false

const initAnimations = () => {
  if (!parentRef.value || !leafRef.value) return

  // 设置初始状态
  gsap.set(leafRef.value, {
    y: -120,
    x: 0,
    scale: 0.8,
    scaleY: 1,
    opacity: 0,
    rotation: 0,
    filter: 'blur(15px)'
  })

  gsap.set(shadowRef.value, {
    scaleX: 0.1,
    opacity: 0
  })

  gsap.set(titleRef.value, {
    opacity: 0,
    y: 30
  })

  gsap.set(stemRef.value, {
    rotation: 0
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
      const y = -120 + 120 * progress
      const scale = 0.8 + 0.2 * progress
      const opacity = progress
      const blur = 15 - 15 * progress

      // 正弦波横向摇曳
      const swayAmount = 15 * Math.sin(progress * Math.PI * 3)
      const x = swayAmount

      // 自转效果
      const rotation = 12 * Math.sin(progress * Math.PI * 2)

      // 触地压缩效果
      let scaleY = 1
      if (progress > 0.92 && progress < 0.96) {
        const landProgress = (progress - 0.92) / 0.04
        scaleY = 1 - 0.04 * Math.sin(landProgress * Math.PI)
      }

      gsap.set(leafRef.value, {
        y,
        x,
        scale,
        scaleY,
        opacity,
        rotation,
        filter: `blur(${blur}px)`
      })

      // 阴影变化
      if (progress > 0.6) {
        const shadowProgress = (progress - 0.6) / 0.4
        const shadowScale = 0.1 + 0.9 * shadowProgress
        const shadowOpacity = shadowProgress * 0.5
        gsap.set(shadowRef.value, {
          scaleX: shadowScale,
          opacity: shadowOpacity
        })
      }

      // 标题显现
      if (progress > 0.7) {
        const titleProgress = (progress - 0.7) / 0.3
        gsap.set(titleRef.value, {
          opacity: titleProgress,
          y: 30 - 30 * titleProgress
        })
      } else {
        gsap.set(titleRef.value, { opacity: 0, y: 30 })
      }

      // 触地瞬间生成尘埃
      if (progress >= 0.93 && progress < 0.95 && !isLanded) {
        isLanded = true
        createDustParticles()
        startStemAnimation()
      }

      // 重新进入视野时重置
      if (progress < 0.9) {
        isLanded = false
      }
    }
  })
}

const createDustParticles = () => {
  if (!dustContainerRef.value) return

  const particleCount = 4

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'dust-particle'
    dustContainerRef.value.appendChild(particle)

    const startX = (Math.random() - 0.5) * 150
    const angle = Math.random() * Math.PI - Math.PI / 2
    const velocity = 15 + Math.random() * 25
    const vx = Math.cos(angle) * velocity
    const vy = -Math.abs(Math.sin(angle) * velocity)

    const tween = gsap.fromTo(
      particle,
      {
        x: startX,
        y: 0,
        opacity: 0.6,
        scale: 1
      },
      {
        x: `+=${vx}`,
        y: `+=${vy}`,
        opacity: 0,
        scale: 0.2,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove()
        }
      }
    )

    dustParticles.push(tween)
  }

  setTimeout(() => {
    dustParticles = []
  }, 600)
}

const startStemAnimation = () => {
  if (stemTween) return

  stemTween = gsap.to(stemRef.value, {
    rotation: 3,
    duration: 1,
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

  if (stemTween) {
    stemTween.kill()
    stemTween = null
  }

  dustParticles.forEach(t => t.kill())
  dustParticles = []

  gsap.killTweensOf(leafRef.value)
  gsap.killTweensOf(shadowRef.value)
  gsap.killTweensOf(titleRef.value)
  gsap.killTweensOf(stemRef.value)
})
</script>

<style scoped lang="scss">
.falling-leaf {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #1a1510 0%, #0f0a08 50%, #1a1208 100%);
}

.leaf-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 50% 50% at 50% 60%,
    rgba(180, 120, 60, 0.1) 0%,
    transparent 50%
  );
}

.bg-particles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255, 200, 150, 0.15) 0%, transparent 100%),
    radial-gradient(1px 1px at 40% 70%, rgba(255, 200, 150, 0.1) 0%, transparent 100%),
    radial-gradient(1px 1px at 60% 40%, rgba(255, 200, 150, 0.12) 0%, transparent 100%),
    radial-gradient(1px 1px at 80% 60%, rgba(255, 200, 150, 0.08) 0%, transparent 100%);
}

.dust-container {
  position: absolute;
  bottom: 32%;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 80px;
  pointer-events: none;
  z-index: 5;

  :global(.dust-particle) {
    position: absolute;
    width: 3px;
    height: 3px;
    background: radial-gradient(
      circle,
      rgba(255, 220, 180, 0.9) 0%,
      rgba(200, 160, 120, 0.4) 50%,
      transparent 100%
    );
    border-radius: 50%;
    filter: blur(0.5px);
  }
}

.leaf-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ground-shadow {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 20px;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 70%
  );
  filter: blur(8px);
  transform-origin: center center;
}

.leaf-container {
  position: relative;
  width: 380px;
  height: 480px;
  border-radius: 12px 60px 12px 60px;
  overflow: hidden;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(180, 120, 60, 0.15);
  transform-style: preserve-3d;
  perspective: 800px;
  z-index: 1;

  .leaf-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(1.1);
  }

  .leaf-stem {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 40px;
    background: linear-gradient(
      to bottom,
      rgba(120, 80, 40, 0.8),
      rgba(100, 60, 30, 0.4)
    );
    border-radius: 2px;
    transform-origin: bottom center;
  }

  .leaf-vein {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, transparent 49%, rgba(200, 150, 100, 0.05) 50%, transparent 51%),
      linear-gradient(0deg, transparent 49%, rgba(200, 150, 100, 0.03) 50%, transparent 51%);
    pointer-events: none;
  }
}

.leaf-title {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;

  .title-line {
    display: block;
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: 34px;
    font-weight: 600;
    color: #ffd699;
    letter-spacing: 10px;
    text-shadow:
      0 0 40px rgba(255, 180, 100, 0.5),
      0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .title-sub {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    color: rgba(255, 200, 150, 0.6);
    letter-spacing: 6px;
    margin-top: 10px;
    text-transform: uppercase;
  }
}

.decor-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.decor-leaf {
  position: absolute;
  font-size: 20px;
  opacity: 0.4;
  filter: blur(1px);
}

.decor-leaf-1 {
  top: 15%;
  left: 10%;
  transform: rotate(-20deg);
  animation: floatLeaf 6s ease-in-out infinite;
}

.decor-leaf-2 {
  top: 25%;
  right: 12%;
  transform: rotate(15deg);
  animation: floatLeaf 7s ease-in-out infinite 1s;
}

.decor-leaf-3 {
  bottom: 20%;
  left: 15%;
  transform: rotate(30deg);
  animation: floatLeaf 5s ease-in-out infinite 2s;
}

@keyframes floatLeaf {
  0%, 100% {
    transform: translateY(0) rotate(-20deg);
  }
  50% {
    transform: translateY(-10px) rotate(-15deg);
  }
}

@media (max-width: 768px) {
  .leaf-container {
    width: 260px;
    height: 330px;
  }

  .ground-shadow {
    width: 200px;
  }

  .leaf-title {
    bottom: 70px;

    .title-line {
      font-size: 24px;
      letter-spacing: 6px;
    }

    .title-sub {
      font-size: 11px;
      letter-spacing: 3px;
    }
  }
}

@media (max-width: 480px) {
  .leaf-container {
    width: 200px;
    height: 260px;
    border-radius: 8px 40px 8px 40px;
  }

  .ground-shadow {
    width: 160px;
  }

  .leaf-title {
    bottom: 50px;

    .title-line {
      font-size: 20px;
      letter-spacing: 4px;
    }
  }

  .decor-elements {
    display: none;
  }
}
</style>
