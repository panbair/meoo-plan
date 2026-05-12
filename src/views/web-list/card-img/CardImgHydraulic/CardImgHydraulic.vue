<template>
  <section ref="parentRef" class="hydraulic">
    <div ref="containerRef" class="hydraulic__container">
      <!-- 主图片 -->
      <img
        ref="mainImageRef"
        class="hydraulic__main-image"
        :src="imageUrl"
        alt="Hydraulic Effect"
        draggable="false"
      />

      <!-- 横带容器 -->
      <div ref="stripesContainerRef" class="hydraulic__stripes">
        <div
          v-for="(_, index) in stripeCount"
          :key="`stripe-${index}`"
          :ref="el => stripeRefs[index] = el as HTMLElement"
          class="hydraulic__stripe"
          :style="{
            '--stripe-index': index,
            '--stripe-top': `${(index / stripeCount) * 100}%`
          }"
        >
          <img
            class="hydraulic__stripe-img"
            :src="getStripeImageUrl(index)"
            alt=""
            draggable="false"
          />
          <!-- 金属描边 - 上 -->
          <div class="hydraulic__edge hydraulic__edge--top" />
          <!-- 金属描边 - 下 -->
          <div class="hydraulic__edge hydraulic__edge--bottom" />
          <!-- 高光脉冲层 -->
          <div class="hydraulic__flash" />
        </div>
      </div>

      <!-- 液压指示器 -->
      <div ref="indicatorRef" class="hydraulic__indicator">
        <div class="hydraulic__indicator-bar" />
        <span class="hydraulic__indicator-text">HYDRAULIC SYSTEM</span>
      </div>

      <!-- 装饰元素 -->
      <div class="hydraulic__corner hydraulic__corner--tl" />
      <div class="hydraulic__corner hydraulic__corner--tr" />
      <div class="hydraulic__corner hydraulic__corner--bl" />
      <div class="hydraulic__corner hydraulic__corner--br" />
    </div>

    <!-- 背景粒子 -->
    <div class="hydraulic__particles">
      <div
        v-for="i in 30"
        :key="`particle-${i}`"
        class="hydraulic__particle"
        :style="{
          '--px': `${Math.random() * 100}%`,
          '--py': `${Math.random() * 100}%`,
          '--ps': `${2 + Math.random() * 4}s`,
          '--pd': `${Math.random() * 3}s`
        }"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

const stripeCount = 10

const parentRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const stripesContainerRef = ref<HTMLElement | null>(null)
const stripeRefs = ref<(HTMLElement | null)[]>([])
const indicatorRef = ref<HTMLElement | null>(null)

const cleanupFns: Array<{ kill: () => void }> = []
let mainTimeline: gsap.core.Timeline | null = null
let scrollTimeline: gsap.core.Timeline | null = null

function getStripeImageUrl(index: number): string {
  const baseHeight = 800
  const cropY = Math.round((index / stripeCount) * 1200)
  return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&crop=top&h=${baseHeight}&y=${cropY}`
}

function initHydraulicAnimation() {
  if (!parentRef.value || !stripesContainerRef.value) return

  const stripeEls = stripeRefs.value.filter(Boolean) as HTMLElement[]
  if (!stripeEls.length) return

  // 初始状态 - 所有横带隐藏在上方，压扁
  gsap.set(stripeEls, {
    clipPath: 'inset(0 0 0 0)',
    y: '-100vh',
    scaleY: 0.92,
    filter: 'brightness(0.7)',
  })
  gsap.set(mainImageRef.value, { filter: 'brightness(0.75)' })
  gsap.set(indicatorRef.value, { opacity: 0, y: 20 })

  // 主入场 Timeline - 液压推入效果
  mainTimeline = gsap.timeline({
    paused: true,
    onComplete: () => {
      // 入场完成后触发呼吸动画
      initBreathingAnimation()
    }
  })

  // 液压节奏：每个横带使用不同的缓动组合
  stripeEls.forEach((stripe, index) => {
    const staggerDelay = index * 0.12
    const duration = 0.9

    // 阶段1：缓慢蓄力（power2.in）
    mainTimeline!.to(
      stripe,
      {
        y: '-50vh',
        duration: duration * 0.3,
        ease: 'power2.in',
      },
      staggerDelay
    )

    // 阶段2：中段加速下坠（power3.inOut）
    mainTimeline!.to(
      stripe,
      {
        y: '-15vh',
        duration: duration * 0.35,
        ease: 'power3.inOut',
      },
      staggerDelay + duration * 0.3
    )

    // 阶段3：末段粘滞减速（elastic.out + power4.out 混合）
    mainTimeline!.to(
      stripe,
      {
        y: '0vh',
        duration: duration * 0.45,
        ease: 'power4.out',
      },
      staggerDelay + duration * 0.55
    )

    // 形变恢复动画
    mainTimeline!.to(
      stripe,
      {
        scaleY: 1,
        duration: 0.3,
        ease: 'back.out(1.5)',
      },
      staggerDelay + duration * 0.6
    )

    // 亮度恢复
    mainTimeline!.to(
      stripe,
      {
        filter: 'brightness(1)',
        duration: 0.4,
        ease: 'power2.out',
      },
      staggerDelay + duration * 0.5
    )

    // 描边高光脉冲
    const topEdge = stripe.querySelector('.hydraulic__edge--top') as HTMLElement
    const bottomEdge = stripe.querySelector('.hydraulic__edge--bottom') as HTMLElement
    const flash = stripe.querySelector('.hydraulic__flash') as HTMLElement

    if (topEdge) {
      mainTimeline!.to(
        topEdge,
        {
          opacity: 1,
          boxShadow: '0 0 15px rgba(255, 220, 150, 0.8), 0 0 30px rgba(255, 180, 80, 0.5)',
          duration: 0.1,
          ease: 'power2.out',
        },
        staggerDelay + duration * 0.85
      )
      mainTimeline!.to(
        topEdge,
        {
          opacity: 0.4,
          boxShadow: '0 0 4px rgba(255, 220, 150, 0.3)',
          duration: 0.4,
          ease: 'power2.out',
        },
        staggerDelay + duration * 0.95
      )
    }

    if (bottomEdge) {
      mainTimeline!.to(
        bottomEdge,
        {
          opacity: 1,
          boxShadow: '0 0 15px rgba(255, 220, 150, 0.8), 0 0 30px rgba(255, 180, 80, 0.5)',
          duration: 0.1,
          ease: 'power2.out',
        },
        staggerDelay + duration * 0.9
      )
      mainTimeline!.to(
        bottomEdge,
        {
          opacity: 0.3,
          boxShadow: '0 0 2px rgba(255, 220, 150, 0.2)',
          duration: 0.5,
          ease: 'power2.out',
        },
        staggerDelay + duration * 1
      )
    }

    if (flash) {
      mainTimeline!.to(
        flash,
        {
          opacity: 0.6,
          scaleY: 1,
          duration: 0.08,
          ease: 'power2.out',
        },
        staggerDelay + duration * 0.88
      )
      mainTimeline!.to(
        flash,
        {
          opacity: 0,
          scaleY: 0,
          duration: 0.25,
          ease: 'power2.out',
        },
        staggerDelay + duration * 0.96
      )
    }
  })

  // 全局亮度恢复
  mainTimeline!.to(
    mainImageRef.value,
    {
      filter: 'brightness(1)',
      duration: 1.2,
      ease: 'power2.out',
    },
    0.8
  )

  // 指示器入场
  mainTimeline!.to(
    indicatorRef.value,
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    },
    1.5
  )

  // ScrollTrigger 入场触发
  const entryTrigger = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 80%',
    onEnter: () => {
      mainTimeline?.play()
    },
  })
  cleanupFns.push({ kill: () => entryTrigger.kill() })

  // 滚动控制 - 视差效果
  scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    }
  })

  stripeEls.forEach((stripe, index) => {
    const direction = index % 2 === 0 ? 1 : -1
    const distance = 15 + (index % 3) * 8

    scrollTimeline!.to(
      stripe,
      {
        y: direction * distance,
        duration: 1,
        ease: 'power1.inOut',
      },
      0
    )
  })

  // 入场淡入
  gsap.fromTo(
    containerRef.value,
    { opacity: 0, scale: 1.02 },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 90%',
        once: true,
      }
    }
  )
}

function initBreathingAnimation() {
  if (!stripesContainerRef.value) return

  const stripeEls = stripeRefs.value.filter(Boolean) as HTMLElement[]

  // 微妙的呼吸动画
  stripeEls.forEach((stripe, index) => {
    gsap.to(stripe, {
      scaleY: 1 + Math.sin(index * 0.5) * 0.005,
      duration: 3 + index * 0.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  })
}

function handleMouseMove(e: MouseEvent) {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
  const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)

  // 鼠标跟随视差
  const stripeEls = stripeRefs.value.filter(Boolean) as HTMLElement[]
  stripeEls.forEach((stripe, index) => {
    const factor = (index - stripeCount / 2) / stripeCount
    gsap.to(stripe, {
      x: x * 10 * factor,
      y: y * 5 * factor,
      duration: 0.8,
      ease: 'power2.out',
    })
  })
}

function handleMouseLeave() {
  const stripeEls = stripeRefs.value.filter(Boolean) as HTMLElement[]
  gsap.to(stripeEls, {
    x: 0,
    y: 0,
    duration: 1.2,
    ease: 'elastic.out(1, 0.5)',
  })
}

onMounted(() => {
  initHydraulicAnimation()

  if (containerRef.value) {
    containerRef.value.addEventListener('mousemove', handleMouseMove)
    containerRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  mainTimeline?.kill()
  scrollTimeline?.kill()
  gsap.killTweensOf(stripeRefs.value)

  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', handleMouseMove)
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }

  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === parentRef.value) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.hydraulic {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a0a2e 0%, #16213e 40%, #0f0f23 100%);
  cursor: crosshair;

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__main-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    z-index: 1;
  }

  &__stripes {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
  }

  &__stripe {
    position: absolute;
    top: var(--stripe-top);
    left: 0;
    width: 100%;
    height: calc(100% / v-bind(stripeCount));
    overflow: hidden;
    transform-origin: center bottom;
    will-change: transform, filter;
  }

  &__stripe-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: calc(v-bind(stripeCount) * 100%);
    object-fit: cover;
    object-position: top center;
    transform: translateY(calc(var(--stripe-index) * -100% / v-bind(stripeCount)));
    pointer-events: none;
  }

  &__edge {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 220, 150, 0.6) 20%,
      rgba(255, 240, 200, 0.9) 50%,
      rgba(255, 220, 150, 0.6) 80%,
      transparent 100%
    );
    box-shadow: 0 0 4px rgba(255, 220, 150, 0.3);
    opacity: 0.3;

    &--top {
      top: 0;
    }

    &--bottom {
      bottom: 0;
    }
  }

  &__flash {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 100%
    );
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top center;
    pointer-events: none;
  }

  &__indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 30;
  }

  &__indicator-bar {
    width: 180px;
    height: 4px;
    background: linear-gradient(
      90deg,
      rgba(255, 140, 0, 0.3) 0%,
      rgba(255, 200, 0, 0.6) 50%,
      rgba(255, 140, 0, 0.3) 100%
    );
    border-radius: 2px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 220, 150, 0.9),
        transparent
      );
      animation: indicatorSweep 2s ease-in-out infinite;
    }
  }

  &__indicator-text {
    font-family: 'Orbitron', 'Rajdhani', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 4px;
    color: rgba(255, 200, 100, 0.8);
    text-shadow:
      0 0 10px rgba(255, 180, 0, 0.5),
      0 0 20px rgba(255, 140, 0, 0.3);
  }

  &__corner {
    position: absolute;
    width: 60px;
    height: 60px;
    z-index: 20;
    pointer-events: none;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: linear-gradient(
        135deg,
        rgba(255, 180, 80, 0.7) 0%,
        rgba(255, 140, 0, 0.4) 100%
      );
    }

    &--tl {
      top: 20px;
      left: 20px;

      &::before {
        top: 0;
        left: 0;
        width: 30px;
        height: 2px;
      }

      &::after {
        top: 0;
        left: 0;
        width: 2px;
        height: 30px;
      }
    }

    &--tr {
      top: 20px;
      right: 20px;

      &::before {
        top: 0;
        right: 0;
        width: 30px;
        height: 2px;
      }

      &::after {
        top: 0;
        right: 0;
        width: 2px;
        height: 30px;
      }
    }

    &--bl {
      bottom: 100px;
      left: 20px;

      &::before {
        bottom: 0;
        left: 0;
        width: 30px;
        height: 2px;
      }

      &::after {
        bottom: 0;
        left: 0;
        width: 2px;
        height: 30px;
      }
    }

    &--br {
      bottom: 100px;
      right: 20px;

      &::before {
        bottom: 0;
        right: 0;
        width: 30px;
        height: 2px;
      }

      &::after {
        bottom: 0;
        right: 0;
        width: 2px;
        height: 30px;
      }
    }
  }

  &__particles {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    overflow: hidden;
  }

  &__particle {
    position: absolute;
    left: var(--px);
    top: var(--py);
    width: 3px;
    height: 3px;
    background: radial-gradient(
      circle,
      rgba(255, 200, 100, 0.8) 0%,
      rgba(255, 150, 50, 0.4) 50%,
      transparent 70%
    );
    border-radius: 50%;
    animation: particleFloat var(--ps) ease-in-out infinite;
    animation-delay: var(--pd);
    opacity: 0.6;
  }
}

@keyframes indicatorSweep {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes particleFloat {
  0%,
  100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-40px) translateX(-5px);
    opacity: 0.5;
  }
  75% {
    transform: translateY(-20px) translateX(15px);
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .hydraulic {
    &__indicator {
      bottom: 20px;
    }

    &__indicator-bar {
      width: 140px;
    }

    &__indicator-text {
      font-size: 9px;
      letter-spacing: 2px;
    }

    &__corner {
      width: 40px;
      height: 40px;

      &::before {
        width: 20px !important;
      }

      &::after {
        height: 20px !important;
      }
    }
  }
}
</style>
