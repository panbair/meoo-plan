<template>
  <div class="zen-space" ref="parentRef">
    <!-- 淡雅背景层 -->
    <div class="zen-bg" ref="bgRef">
      <!-- 柔光层 -->
      <div class="ambient-light"></div>
      <!-- 和纸纹理层 -->
      <div class="washi-texture"></div>
    </div>

    <!-- 尘埃粒子 -->
    <div class="zen-dust" ref="dustRef"></div>

    <!-- 窗棂光影 -->
    <div class="zen-window">
      <div class="window-rail window-rail-h"></div>
      <div class="window-rail window-rail-v"></div>
      <div class="window-shadow" ref="shadowRef"></div>
      <!-- 移动光斑 -->
      <div class="light-spot" ref="lightSpotRef"></div>
    </div>

    <!-- 主图容器 -->
    <div class="zen-container" ref="containerRef">
      <!-- 外层光晕 -->
      <div class="zen-outer-glow"></div>

      <!-- 图片框架 -->
      <div class="zen-frame">
        <div class="frame-inner">
          <div class="zen-image">
            <img :src="imageUrl" alt="Zen Still Life" />
            <!-- 暖光层 -->
            <div class="warm-light-overlay"></div>
            <!-- 和纸纹理 -->
            <div class="image-washi-texture"></div>
          </div>
          <!-- 内层边框 -->
          <div class="frame-border"></div>
        </div>
      </div>

      <!-- 脉冲光晕 -->
      <div class="pulse-glow"></div>

      <!-- 暗角 -->
      <div class="zen-vignette" ref="vignetteRef"></div>

      <!-- 边框装饰 -->
      <div class="frame-corners">
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="zen-title" ref="titleRef">
      <span class="title-cn">凝滞空间</span>
      <span class="title-en">ZEN MOMENT</span>
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
const containerRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const shadowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const dustRef = ref<HTMLElement | null>(null)
const lightSpotRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !containerRef.value) return

  const ctx = gsap.context(() => {
    // 入场前隐藏
    gsap.set([containerRef.value, titleRef.value], {
      opacity: 0,
      scale: 0.9,
    })
    gsap.set('.zen-outer-glow', {
      scale: 0.7,
      opacity: 0,
    })
    gsap.set('.pulse-glow', {
      scale: 0.5,
      opacity: 0,
    })

    // 入场动画
    const entryTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
    })

    // 外层光晕入场
    entryTl.to('.zen-outer-glow', {
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out',
    }, 0)

    // 主容器入场
    entryTl.to(containerRef.value, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
    }, 0.2)

    // 脉冲光晕入场
    entryTl.to('.pulse-glow', {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    }, 0.4)

    // 标题淡入
    entryTl.to(titleRef.value, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.5)

    // 创建尘埃粒子
    if (dustRef.value) {
      for (let i = 0; i < 25; i++) {
        const dust = document.createElement('div')
        dust.className = 'zen-dust-particle'
        dust.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: ${1 + Math.random() * 2}px;
          height: ${1 + Math.random() * 2}px;
          animation-duration: ${15 + Math.random() * 20}s;
          animation-delay: ${Math.random() * 15}s;
        `
        dustRef.value.appendChild(dust)
      }
    }

    // ===== 循环呼吸动画 =====

    // 主容器呼吸缩放
    const breathTl = gsap.timeline({ repeat: -1, yoyo: true })
    breathTl.to(containerRef.value, {
      scale: 1.015,
      duration: 8,
      ease: 'sine.inOut',
    })

    // 外层光晕反向呼吸
    const glowTl = gsap.timeline({ repeat: -1, yoyo: true })
    glowTl.to('.zen-outer-glow', {
      scale: 1.08,
      opacity: 0.6,
      duration: 8,
      ease: 'sine.inOut',
    })

    // 脉冲光晕呼吸
    const pulseTl = gsap.timeline({ repeat: -1, yoyo: true })
    pulseTl.to('.pulse-glow', {
      scale: 1.1,
      opacity: 0.5,
      duration: 4,
      ease: 'sine.inOut',
    })

    // 弧形漂移
    const driftTl = gsap.timeline({ repeat: -1, yoyo: true })
    driftTl.to(containerRef.value, {
      x: 2,
      y: 1.5,
      duration: 12,
      ease: 'sine.inOut',
    })

    // 暖光层亮度联动
    const warmLightTl = gsap.timeline({ repeat: -1, yoyo: true })
    warmLightTl.to('.warm-light-overlay', {
      opacity: 0.4,
      duration: 6,
      ease: 'sine.inOut',
    })

    // 暗角呼吸
    const vignetteTl = gsap.timeline({ repeat: -1, yoyo: true })
    vignetteTl.to(vignetteRef.value, {
      opacity: 0.6,
      duration: 8,
      ease: 'sine.inOut',
    })

    // 窗棂投影伸缩
    const shadowTl = gsap.timeline({ repeat: -1, yoyo: true })
    shadowTl.to(shadowRef.value, {
      scaleX: 1.05,
      opacity: 0.25,
      duration: 6,
      ease: 'sine.inOut',
    })

    // 光斑移动
    const lightSpotTl = gsap.timeline({ repeat: -1 })
    lightSpotTl.to(lightSpotRef.value, {
      x: 100,
      y: 50,
      duration: 20,
      ease: 'sine.inOut',
    })
    lightSpotTl.to(lightSpotRef.value, {
      x: -50,
      y: 80,
      duration: 25,
      ease: 'sine.inOut',
    }, '>')
    lightSpotTl.to(lightSpotRef.value, {
      x: 0,
      y: 0,
      duration: 20,
      ease: 'sine.inOut',
    }, '>')

    // 柔光层脉动
    const ambientTl = gsap.timeline({ repeat: -1, yoyo: true })
    ambientTl.to('.ambient-light', {
      opacity: 0.7,
      duration: 10,
      ease: 'sine.inOut',
    })

    cleanupFns.push(
      { revert: () => entryTl.kill() },
      { revert: () => breathTl.kill() },
      { revert: () => glowTl.kill() },
      { revert: () => pulseTl.kill() },
      { revert: () => driftTl.kill() },
      { revert: () => warmLightTl.kill() },
      { revert: () => vignetteTl.kill() },
      { revert: () => shadowTl.kill() },
      { revert: () => lightSpotTl.kill() },
      { revert: () => ambientTl.kill() },
    )
  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn.revert())
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style lang="scss" scoped>
.zen-space {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #f5f2ed 0%,
    #ebe6df 25%,
    #ddd6cb 50%,
    #ece7e0 75%,
    #f5f2ed 100%
  );
}

.zen-bg {
  position: absolute;
  inset: 0;
  will-change: opacity;
}

.ambient-light {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 20%, rgba(255, 248, 240, 0.7) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 20% 80%, rgba(255, 245, 235, 0.4) 0%, transparent 45%);
  opacity: 0.5;
}

.washi-texture {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(180, 170, 160, 0.03) 3px,
      rgba(180, 170, 160, 0.03) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 4px,
      rgba(180, 170, 160, 0.02) 4px,
      rgba(180, 170, 160, 0.02) 5px
    );
  opacity: 0.8;
}

.zen-dust {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.zen-dust-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(200, 190, 175, 0.6) 0%, rgba(200, 190, 175, 0.2) 50%, transparent 70%);
  border-radius: 50%;
  animation: dustFloat ease-in-out infinite;
  filter: blur(0.3px);
}

@keyframes dustFloat {
  0%, 100% {
    opacity: 0.15;
    transform: translate(0, 0);
  }
  25% {
    opacity: 0.5;
    transform: translate(20px, -30px);
  }
  50% {
    opacity: 0.25;
    transform: translate(-15px, -60px);
  }
  75% {
    opacity: 0.6;
    transform: translate(30px, -40px);
  }
}

.zen-window {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.window-rail {
  position: absolute;
  background: rgba(140, 130, 120, 0.08);

  &-h {
    top: 38%;
    left: 0;
    right: 0;
    height: 1px;
  }

  &-v {
    left: 58%;
    top: 0;
    bottom: 0;
    width: 1px;
  }
}

.window-shadow {
  position: absolute;
  bottom: 12%;
  left: 28%;
  width: 55%;
  height: 35%;
  background: linear-gradient(
    130deg,
    rgba(100, 90, 80, 0.1) 0%,
    transparent 55%
  );
  transform-origin: left center;
  will-change: transform, opacity;
}

.light-spot {
  position: absolute;
  top: 10%;
  left: 60%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255, 250, 240, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(20px);
  will-change: transform;
}

.zen-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, opacity;
}

.zen-outer-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 105%;
  height: 105%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, rgba(255, 250, 240, 0.3) 0%, transparent 60%);
  border-radius: 8px;
  will-change: transform, opacity;
  pointer-events: none;
}

.zen-frame {
  position: relative;
  padding: 12px;
  background: linear-gradient(135deg, rgba(180, 170, 160, 0.15) 0%, rgba(200, 195, 188, 0.1) 100%);
  border-radius: 6px;
}

.frame-inner {
  position: relative;
}

.zen-image {
  position: relative;
  width: 55vw;
  max-width: 780px;
  aspect-ratio: 4 / 3;
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 30px 80px rgba(60, 50, 40, 0.12),
    0 60px 120px rgba(60, 50, 40, 0.06),
    inset 0 0 50px rgba(255, 255, 255, 0.4);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.9) contrast(1.05);
  }
}

.warm-light-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(255, 240, 220, 0.35) 0%, transparent 50%);
  pointer-events: none;
  opacity: 0.2;
  will-change: opacity;
}

.image-washi-texture {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.015) 2px,
      rgba(255, 255, 255, 0.015) 3px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.01) 2px,
      rgba(0, 0, 0, 0.01) 3px
    );
  pointer-events: none;
  opacity: 0.6;
}

.frame-border {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(180, 170, 160, 0.2);
  border-radius: 4px;
  pointer-events: none;
}

.pulse-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, rgba(255, 248, 238, 0.25) 0%, transparent 65%);
  border-radius: 8px;
  pointer-events: none;
  will-change: transform, opacity;
}

.zen-vignette {
  position: absolute;
  inset: -25px;
  border-radius: 16px;
  background: radial-gradient(
    ellipse at center,
    transparent 35%,
    rgba(80, 70, 60, 0.12) 65%,
    rgba(60, 50, 40, 0.25) 100%
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
  width: 20px;
  height: 20px;
  border-color: rgba(160, 150, 140, 0.35);
  border-style: solid;

  &.corner-tl {
    top: 0;
    left: 0;
    border-width: 1px 0 0 1px;
    border-radius: 3px 0 0 0;
  }

  &.corner-tr {
    top: 0;
    right: 0;
    border-width: 1px 1px 0 0;
    border-radius: 0 3px 0 0;
  }

  &.corner-bl {
    bottom: 0;
    left: 0;
    border-width: 0 0 1px 1px;
    border-radius: 0 0 0 3px;
  }

  &.corner-br {
    bottom: 0;
    right: 0;
    border-width: 0 1px 1px 0;
    border-radius: 0 0 3px 0;
  }
}

.zen-title {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  will-change: transform, opacity;

  .title-cn {
    display: block;
    font-size: 28px;
    font-weight: 600;
    color: #4a4238;
    letter-spacing: 8px;
    text-shadow:
      0 1px 2px rgba(255, 255, 255, 0.9),
      0 0 20px rgba(255, 250, 240, 0.3);
    margin-bottom: 8px;
  }

  .title-en {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: rgba(74, 66, 56, 0.55);
    letter-spacing: 6px;
    text-transform: uppercase;
  }
}
</style>
