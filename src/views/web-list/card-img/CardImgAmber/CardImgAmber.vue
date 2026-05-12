<template>
  <div class="amber-dream" ref="parentRef">
    <!-- 背景层 -->
    <div class="amber-bg" ref="bgRef">
      <!-- 星光粒子 -->
      <div class="amber-stars" ref="starsRef"></div>
      <!-- 琥珀光晕 -->
      <div class="amber-glow"></div>
    </div>

    <!-- 沙尘粒子 -->
    <div class="amber-dust" ref="dustRef"></div>

    <!-- 主图容器 -->
    <div class="amber-container" ref="containerRef">
      <!-- 外层光环 -->
      <div class="amber-ring amber-ring-1" ref="ring1Ref"></div>
      <div class="amber-ring amber-ring-2" ref="ring2Ref"></div>

      <!-- 热浪扭曲层 -->
      <div class="amber-heat-wave" ref="heatRef">
        <div class="amber-image">
          <img :src="imageUrl" alt="Amber Dream" />
          <div class="image-inner-glow"></div>
        </div>
      </div>

      <!-- 内层光晕 -->
      <div class="amber-inner-glow" ref="innerGlowRef"></div>
    </div>

    <!-- 边框装饰 -->
    <div class="amber-frame">
      <div class="frame-corner frame-tl"></div>
      <div class="frame-corner frame-tr"></div>
      <div class="frame-corner frame-bl"></div>
      <div class="frame-corner frame-br"></div>
    </div>

    <!-- 标题 -->
    <div class="amber-title" ref="titleRef">
      <span class="title-cn">时间琥珀</span>
      <span class="title-en">AMBER DREAM</span>
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

const imageUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80'

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const starsRef = ref<HTMLElement | null>(null)
const dustRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const ring1Ref = ref<HTMLElement | null>(null)
const ring2Ref = ref<HTMLElement | null>(null)
const heatRef = ref<HTMLElement | null>(null)
const innerGlowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value) return

  const ctx = gsap.context(() => {
    // 初始化状态
    gsap.set(containerRef.value, {
      scale: 0.9,
      opacity: 0,
      x: 0,
      y: 0,
    })

    gsap.set(ring1Ref.value, {
      scale: 0.8,
      opacity: 0,
      rotation: 0,
    })

    gsap.set(ring2Ref.value, {
      scale: 0.85,
      opacity: 0,
      rotation: 0,
    })

    gsap.set(innerGlowRef.value, {
      scale: 0.9,
      opacity: 0,
    })

    gsap.set(titleRef.value, {
      opacity: 0,
      y: 30,
    })

    // 创建 ScrollTrigger 时间线
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
      },
    })

    // 主图淡入缩放
    tl.to(containerRef.value, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
    }, 0)

    // 光环旋转淡入
    tl.to(ring1Ref.value, {
      scale: 1,
      opacity: 1,
      rotation: 360,
      duration: 2,
      ease: 'power2.out',
    }, 0.2)

    tl.to(ring2Ref.value, {
      scale: 1,
      opacity: 0.6,
      rotation: -360,
      duration: 2.5,
      ease: 'power2.out',
    }, 0.3)

    // 内层光晕
    tl.to(innerGlowRef.value, {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    }, 0.5)

    // 背景视差
    tl.to(bgRef.value, {
      y: -40,
      duration: 1,
      ease: 'none',
    }, 0)

    // 标题淡入
    tl.to(titleRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.8)

    cleanupFns.push({
      revert: () => tl.kill(),
    })

    // ===== 循环呼吸动画（独立于 ScrollTrigger） =====

    // 创建星光粒子
    if (starsRef.value) {
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div')
        star.className = 'amber-star'
        star.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: ${1 + Math.random() * 2}px;
          height: ${1 + Math.random() * 2}px;
          animation-duration: ${2 + Math.random() * 3}s;
          animation-delay: ${Math.random() * 3}s;
        `
        starsRef.value.appendChild(star)
      }
    }

    // 创建沙尘粒子
    if (dustRef.value) {
      for (let i = 0; i < 30; i++) {
        const dust = document.createElement('div')
        dust.className = 'amber-dust-particle'
        dust.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: ${2 + Math.random() * 3}px;
          height: ${2 + Math.random() * 3}px;
          animation-duration: ${8 + Math.random() * 6}s;
          animation-delay: ${Math.random() * 5}s;
        `
        dustRef.value.appendChild(dust)
      }
    }

    // 主容器：不对称缩放呼吸
    const scaleTl = gsap.timeline({ repeat: -1 })
    scaleTl
      .to(containerRef.value, {
        scale: 1.03,
        duration: 4,
        ease: 'power1.inOut',
      })
      .to(containerRef.value, {
        scale: 1,
        duration: 2.5,
        ease: 'power1.inOut',
      })

    // 外环旋转呼吸
    const ring1Tl = gsap.timeline({ repeat: -1 })
    ring1Tl.to(ring1Ref.value, {
      scale: 1.08,
      opacity: 0.8,
      duration: 5,
      ease: 'sine.inOut',
    }).to(ring1Ref.value, {
      scale: 1,
      opacity: 1,
      duration: 5,
      ease: 'sine.inOut',
    })

    const ring2Tl = gsap.timeline({ repeat: -1 })
    ring2Tl.to(ring2Ref.value, {
      scale: 1.05,
      opacity: 0.5,
      duration: 6,
      ease: 'sine.inOut',
    }).to(ring2Ref.value, {
      scale: 0.98,
      opacity: 0.7,
      duration: 6,
      ease: 'sine.inOut',
    })

    // 内层光晕呼吸
    const glowTl = gsap.timeline({ repeat: -1, yoyo: true })
    glowTl.to(innerGlowRef.value, {
      scale: 1.15,
      opacity: 0.6,
      duration: 3,
      ease: 'sine.inOut',
    })

    // 热浪扭曲
    const heatTl = gsap.timeline({ repeat: -1, yoyo: true })
    heatTl.to(heatRef.value, {
      skewX: 0.8,
      skewY: 0.2,
      duration: 4,
      ease: 'sine.inOut',
    })

    // 色温漂移
    const colorTl = gsap.timeline({ repeat: -1, yoyo: true })
    colorTl.to(containerRef.value, {
      filter: 'sepia(0.4) saturate(1.3) brightness(1.05)',
      duration: 8,
      ease: 'sine.inOut',
    })

    cleanupFns.push(
      { revert: () => scaleTl.kill() },
      { revert: () => ring1Tl.kill() },
      { revert: () => ring2Tl.kill() },
      { revert: () => glowTl.kill() },
      { revert: () => heatTl.kill() },
      { revert: () => colorTl.kill() }
    )
  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn.revert())
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style lang="scss" scoped>
.amber-dream {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    #0a0805 0%,
    #1a1208 20%,
    #2d1f10 40%,
    #1a1208 60%,
    #0a0805 100%
  );
}

.amber-bg {
  position: absolute;
  inset: 0;
  will-change: transform;
}

.amber-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 180, 80, 0.08) 0%,
    rgba(200, 130, 50, 0.04) 30%,
    transparent 60%
  );
  pointer-events: none;
}

.amber-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.amber-star {
  position: absolute;
  background: rgba(255, 200, 150, 0.8);
  border-radius: 50%;
  animation: starTwinkle ease-in-out infinite;

  @for $i from 1 through 50 {
    &:nth-child(#{$i}) {
      opacity: 0.3 + random(50) * 0.01;
    }
  }
}

@keyframes starTwinkle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}

.amber-dust {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.amber-dust-particle {
  position: absolute;
  background: radial-gradient(
    circle,
    rgba(255, 200, 120, 0.4) 0%,
    rgba(255, 180, 100, 0.1) 50%,
    transparent 70%
  );
  border-radius: 50%;
  animation: dustFloat linear infinite;
}

@keyframes dustFloat {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.4;
  }
  100% {
    transform: translate(100px, -100vh) rotate(360deg);
    opacity: 0;
  }
}

.amber-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, filter, opacity;
}

// 光环
.amber-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  pointer-events: none;

  &-1 {
    width: 120%;
    height: 120%;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(255, 180, 80, 0.3);
    box-shadow:
      0 0 30px rgba(255, 180, 80, 0.1),
      inset 0 0 30px rgba(255, 180, 80, 0.05);
    will-change: transform, opacity;
  }

  &-2 {
    width: 110%;
    height: 110%;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(255, 200, 120, 0.2);
    box-shadow:
      0 0 20px rgba(255, 200, 120, 0.08),
      inset 0 0 20px rgba(255, 200, 120, 0.03);
    will-change: transform, opacity;
  }
}

.amber-heat-wave {
  position: relative;
  will-change: transform;
}

.amber-image {
  position: relative;
  width: 55vw;
  max-width: 800px;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 0 60px rgba(255, 180, 80, 0.3),
    0 40px 100px rgba(0, 0, 0, 0.6),
    inset 0 0 60px rgba(255, 200, 150, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: sepia(0.25) saturate(1.2);
  }
}

.image-inner-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 30%, rgba(255, 220, 180, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 70%, rgba(255, 180, 100, 0.1) 0%, transparent 40%);
  pointer-events: none;
}

.amber-inner-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 105%;
  height: 105%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgba(255, 200, 100, 0.15) 0%,
    rgba(255, 180, 80, 0.08) 40%,
    transparent 70%
  );
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
  animation: innerGlowPulse 3s ease-in-out infinite;
}

@keyframes innerGlowPulse {
  0%, 100% {
    box-shadow: 0 0 40px rgba(255, 200, 100, 0.2);
  }
  50% {
    box-shadow: 0 0 60px rgba(255, 200, 100, 0.35);
  }
}

// 边框装饰
.amber-frame {
  position: absolute;
  inset: 40px;
  pointer-events: none;
}

.frame-corner {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 200, 120, 0.3);

  &.frame-tl {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }

  &.frame-tr {
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
  }

  &.frame-bl {
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: none;
  }

  &.frame-br {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }
}

.amber-title {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  will-change: transform, opacity;

  .title-cn {
    display: block;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 12px;
    text-shadow:
      0 0 20px rgba(255, 180, 80, 0.6),
      0 0 40px rgba(255, 180, 80, 0.3);
    margin-bottom: 10px;
  }

  .title-en {
    display: block;
    font-size: 13px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 8px;
    text-transform: uppercase;
  }
}
</style>
