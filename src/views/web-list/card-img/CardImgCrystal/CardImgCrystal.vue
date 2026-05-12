<template>
  <div class="card-crystal">
    <div class="crystal-bg">
      <div class="bg-gradient"></div>
      <div class="bg-lines"></div>
      <div class="corner-ornament top-left"></div>
      <div class="corner-ornament top-right"></div>
      <div class="corner-ornament bottom-left"></div>
      <div class="corner-ornament bottom-right"></div>
    </div>

    <div ref="parentRef" class="crystal-container">
      <!-- 底座压痕光晕 -->
      <div ref="baseRef" class="crystal-base"></div>

      <!-- 图片容器 -->
      <div ref="imgWrapperRef" class="crystal-img-wrapper">
        <div ref="innerRef" class="crystal-img-inner">
          <img
            ref="imgRef"
            class="crystal-img"
            src="https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=800&q=85"
            alt="Crystal Display"
          />
        </div>
        <!-- 边缘透光镶边 -->
        <div ref="glowRef" class="crystal-glow"></div>
      </div>

      <!-- 水晶微尘容器 -->
      <div ref="dustContainerRef" class="crystal-dust-container"></div>

      <!-- 装饰 -->
      <div class="crystal-decoration left">
        <div class="decoration-line"></div>
        <div class="decoration-diamond"></div>
      </div>
      <div class="crystal-decoration right">
        <div class="decoration-line"></div>
        <div class="decoration-diamond"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="crystal-title">
      <h2>Crystal Elegance</h2>
      <p>珠宝盒轻奢入场</p>
    </div>

    <!-- 底部装饰 -->
    <div class="crystal-footer">
      <div class="footer-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const imgWrapperRef = ref<HTMLElement | null>(null)
const innerRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLElement | null>(null)
const baseRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dustContainerRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// 创建水晶微尘
const createDustParticle = (progress: number) => {
  if (!dustContainerRef.value) return

  const particle = document.createElement('div')
  particle.className = 'dust-particle'
  const isLeft = Math.random() > 0.5
  particle.style.setProperty('--start-x', isLeft ? '-20px' : '20px')
  particle.style.setProperty('--start-y', '0px')
  particle.style.setProperty('--end-x', `${isLeft ? -30 - Math.random() * 20 : 30 + Math.random() * 20}px`)
  particle.style.setProperty('--end-y', `${-20 - Math.random() * 15}px`)
  particle.style.setProperty('--rotation', `${Math.random() * 360}deg`)

  dustContainerRef.value.appendChild(particle)

  const anim = gsap.fromTo(
    particle,
    { opacity: 0.8, scale: 0.3 },
    {
      opacity: 0,
      scale: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => particle.remove()
    }
  )

  cleanupFns.push(() => anim.kill())
}

// 触底时的双层回弹效果
const calculateBounce = (progress: number) => {
  // 触底点大约在 0.85
  if (progress < 0.85) return 0

  const landProgress = (progress - 0.85) / 0.15
  if (landProgress < 0.3) {
    // 首次弹起
    const p = landProgress / 0.3
    return -6 * Math.sin(p * Math.PI)
  } else if (landProgress < 0.7) {
    // 二次回落
    const p = (landProgress - 0.3) / 0.4
    return -6 * Math.cos((p - 0.3) * Math.PI / 0.4) * 0.5
  }
  return 0
}

onMounted(() => {
  // 初始状态
  gsap.set(imgWrapperRef.value, {
    y: -80,
    opacity: 0,
    scale: 0.78,
    filter: 'blur(15px)'
  })
  gsap.set(innerRef.value, { scaleY: 1, scaleX: 1 })
  gsap.set(baseRef.value, { opacity: 0, scale: 0.5 })
  gsap.set(glowRef.value, { opacity: 0 })
  gsap.set(titleRef.value, { opacity: 0, y: 30 })
  gsap.set('.crystal-decoration', { opacity: 0.3 })

  const trigger = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 85%',
    end: 'bottom 20%',
    scrub: 1.5,
    onEnter: () => {
      gsap.set(imgWrapperRef.value, {
        y: -80,
        opacity: 0,
        scale: 0.78,
        filter: 'blur(15px)'
      })
    },
    onUpdate: (self) => {
      const p = self.progress
      const img = imgWrapperRef.value
      const inner = innerRef.value

      if (!img || !inner) return

      // 主属性：使用能量曲线实现前慢后快
      const easedP = Math.pow(p, 1.3)
      const y = -80 * (1 - easedP) + calculateBounce(p)
      const scale = 0.78 + (1 - 0.78) * Math.min(p * 1.2, 1)
      const opacity = Math.pow(p, 0.8)
      const blur = 15 * (1 - Math.pow(p, 0.7))

      gsap.set(img, { y, opacity, scale, filter: `blur(${blur}px)` })

      // 触底时的 scaleY 压弹
      if (p >= 0.85 && p < 0.95) {
        const landP = (p - 0.85) / 0.1
        const squash = landP < 0.3
          ? 1 - 0.06 * Math.sin(landP / 0.3 * Math.PI)
          : 1 + 0.02 * Math.sin((landP - 0.3) / 0.7 * Math.PI)
        gsap.set(inner, { scaleY: squash, scaleX: 1 / squash })
      } else if (p >= 0.95) {
        gsap.set(inner, { scaleY: 1, scaleX: 1 })
      }

      // 底座压痕光晕
      if (p >= 0.85) {
        const baseP = (p - 0.85) / 0.15
        const baseScale = baseP < 0.3
          ? 0.5 + 0.6 * baseP / 0.3
          : 1.1 - 0.2 * (baseP - 0.3) / 0.7
        const baseOpacity = baseP < 0.4 ? baseP / 0.4 * 0.6 : 0.6 * (1 - (baseP - 0.4) / 0.6)
        gsap.set(baseRef.value, { opacity: baseOpacity, scale: baseScale })
      } else {
        gsap.set(baseRef.value, { opacity: 0 })
      }

      // 触底时创建微尘
      if (p >= 0.85 && p < 0.87 && Math.random() > 0.7) {
        for (let i = 0; i < 3; i++) {
          createDustParticle(p)
        }
      }

      // 边缘透光镶边（落地后呼吸）
      if (p >= 0.9) {
        const breatheP = (p - 0.9) / 0.1
        const glowOpacity = 0.3 + 0.2 * Math.sin(Date.now() / 500)
        gsap.set(glowRef.value, { opacity: glowOpacity })
      }

      // 标题淡入
      if (p >= 0.7) {
        const titleP = (p - 0.7) / 0.3
        gsap.set(titleRef.value, { opacity: titleP, y: 30 * (1 - titleP) })
      }

      // 装饰线
      if (p >= 0.6) {
        const decP = (p - 0.6) / 0.4
        gsap.set('.crystal-decoration', { opacity: 0.3 + 0.5 * decP })
      }
    },
    onLeaveBack: () => {
      gsap.set(imgWrapperRef.value, {
        y: -80,
        opacity: 0,
        scale: 0.78,
        filter: 'blur(15px)'
      })
      gsap.set(baseRef.value, { opacity: 0 })
      gsap.set(glowRef.value, { opacity: 0 })
      gsap.set(titleRef.value, { opacity: 0, y: 30 })
    }
  })

  cleanupFns.push(() => trigger.kill())

  // 持续的边缘光晕呼吸
  const glowAnim = gsap.to(glowRef.value, {
    opacity: 0.5,
    duration: 2.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    paused: true
  })
  cleanupFns.push(() => glowAnim.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.card-crystal {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%);
}

.crystal-bg {
  position: absolute;
  inset: 0;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 50% 30%, rgba(100, 120, 180, 0.08) 0%, transparent 70%),
      radial-gradient(ellipse 80% 60% at 50% 70%, rgba(80, 100, 160, 0.05) 0%, transparent 60%);
  }

  .bg-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(200, 210, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200, 210, 255, 0.02) 1px, transparent 1px);
    background-size: 60px 60px;
  }
}

.corner-ornament {
  position: absolute;
  width: 80px;
  height: 80px;
  opacity: 0.15;

  &.top-left {
    top: 20px;
    left: 20px;
    border-top: 1px solid rgba(180, 200, 255, 0.5);
    border-left: 1px solid rgba(180, 200, 255, 0.5);
  }

  &.top-right {
    top: 20px;
    right: 20px;
    border-top: 1px solid rgba(180, 200, 255, 0.5);
    border-right: 1px solid rgba(180, 200, 255, 0.5);
  }

  &.bottom-left {
    bottom: 20px;
    left: 20px;
    border-bottom: 1px solid rgba(180, 200, 255, 0.5);
    border-left: 1px solid rgba(180, 200, 255, 0.5);
  }

  &.bottom-right {
    bottom: 20px;
    right: 20px;
    border-bottom: 1px solid rgba(180, 200, 255, 0.5);
    border-right: 1px solid rgba(180, 200, 255, 0.5);
  }
}

.crystal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.crystal-base {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 40px;
  background: radial-gradient(ellipse, rgba(150, 170, 220, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.crystal-img-wrapper {
  position: relative;
  width: 340px;
  height: 450px;
}

.crystal-img-inner {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(100, 130, 200, 0.1);
  transform-origin: center bottom;
}

.crystal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.crystal-glow {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  pointer-events: none;
  box-shadow:
    inset 0 0 30px rgba(180, 200, 255, 0.15),
    inset 0 0 60px rgba(150, 180, 255, 0.08);
}

.crystal-dust-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
}

:deep(.dust-particle) {
  position: absolute;
  bottom: 30%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: rgba(200, 220, 255, 0.6);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  transform: translate(var(--start-x), var(--start-y)) rotate(var(--rotation));
  animation: dust-float 0.6s ease-out forwards;

  @keyframes dust-float {
    to {
      opacity: 0;
      transform: translate(calc(50% + var(--end-x)), calc(30% + var(--end-y))) rotate(calc(var(--rotation) + 180deg)) scale(0.3);
    }
  }
}

.crystal-decoration {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &.left {
    left: -80px;

    .decoration-line {
      width: 1px;
      height: 100px;
      background: linear-gradient(to bottom, transparent, rgba(180, 200, 255, 0.4));
    }

    .decoration-diamond {
      width: 8px;
      height: 8px;
      background: rgba(180, 200, 255, 0.5);
      transform: rotate(45deg);
    }
  }

  &.right {
    right: -80px;

    .decoration-line {
      width: 1px;
      height: 100px;
      background: linear-gradient(to bottom, transparent, rgba(180, 200, 255, 0.4));
    }

    .decoration-diamond {
      width: 8px;
      height: 8px;
      background: rgba(180, 200, 255, 0.5);
      transform: rotate(45deg);
    }
  }
}

.crystal-title {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  h2 {
    font-size: 36px;
    font-weight: 300;
    color: #c8d8ff;
    margin: 0 0 12px;
    letter-spacing: 8px;
    text-transform: uppercase;
    text-shadow: 0 0 30px rgba(180, 200, 255, 0.3);
  }

  p {
    font-size: 16px;
    color: rgba(200, 215, 255, 0.6);
    margin: 0;
    letter-spacing: 4px;
  }
}

.crystal-footer {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);

  .footer-line {
    width: 120px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(180, 200, 255, 0.3), transparent);
  }
}
</style>
