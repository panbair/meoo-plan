<template>
  <div class="mercury-container" ref="containerRef">
    <!-- 背景图片层 -->
    <div class="mercury-image" ref="imageRef">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        alt="Mountain Landscape"
      />
    </div>

    <!-- 左侧液态金属遮罩 -->
    <div class="mercury-left" ref="leftRef">
      <img
        class="mercury-image-bg"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        alt=""
      />
      <div class="mercury-liquid-surface">
        <div class="mercury-highlight-left" ref="highlightLeftRef"></div>
      </div>
      <!-- 边缘银丝 -->
      <div class="mercury-filaments" ref="filamentsLeftRef"></div>
    </div>

    <!-- 右侧液态金属遮罩 -->
    <div class="mercury-right" ref="rightRef">
      <img
        class="mercury-image-bg"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        alt=""
      />
      <div class="mercury-liquid-surface">
        <div class="mercury-highlight-right" ref="highlightRightRef"></div>
      </div>
      <!-- 边缘银丝 -->
      <div class="mercury-filaments" ref="filamentsRightRef"></div>
    </div>

    <!-- 中央亮线 -->
    <div class="mercury-center-line" ref="centerLineRef">
      <div class="center-glow"></div>
    </div>

    <!-- 聚光灯效果 -->
    <div class="mercury-spotlight" ref="spotlightRef"></div>

    <!-- 装饰性金属饰条 -->
    <div class="mercury-border-left" ref="borderLeftRef"></div>
    <div class="mercury-border-right" ref="borderRightRef"></div>

    <!-- 标题 -->
    <div class="mercury-title" ref="titleRef">
      <span>Liquid Metal</span>
    </div>

    <!-- 副标题 -->
    <div class="mercury-subtitle" ref="subtitleRef">
      <span>Mercury Reveal</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const containerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const leftRef = ref<HTMLElement | null>(null)
const rightRef = ref<HTMLElement | null>(null)
const highlightLeftRef = ref<HTMLElement | null>(null)
const highlightRightRef = ref<HTMLElement | null>(null)
const filamentsLeftRef = ref<HTMLElement | null>(null)
const filamentsRightRef = ref<HTMLElement | null>(null)
const centerLineRef = ref<HTMLElement | null>(null)
const spotlightRef = ref<HTMLElement | null>(null)
const borderLeftRef = ref<HTMLElement | null>(null)
const borderRightRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let tickerCallback: ((...args: unknown[]) => void) | null = null
let mouseX = 0.5
let mouseY = 0.5

const createFilaments = () => {
  const leftContainer = filamentsLeftRef.value
  const rightContainer = filamentsRightRef.value
  if (!leftContainer || !rightContainer) return

  const createFilament = (container: HTMLElement, isLeft: boolean) => {
    for (let i = 0; i < 5; i++) {
      const filament = document.createElement('div')
      filament.className = 'filament'
      filament.style.cssText = `
        position: absolute;
        ${isLeft ? 'right: 0' : 'left: 0'};
        width: 1px;
        height: ${15 + Math.random() * 25}px;
        background: linear-gradient(to top, rgba(255,255,255,0.6), transparent);
        transform-origin: ${isLeft ? 'bottom right' : 'bottom left'};
        top: ${30 + Math.random() * 40}%;
      `
      container.appendChild(filament)
    }
  }

  createFilament(leftContainer, true)
  createFilament(rightContainer, false)
}

const initAnimation = () => {
  const container = containerRef.value
  const image = imageRef.value
  const left = leftRef.value
  const right = rightRef.value
  const highlightLeft = highlightLeftRef.value
  const highlightRight = highlightRightRef.value
  const filamentsLeft = filamentsLeftRef.value
  const filamentsRight = filamentsRightRef.value
  const centerLine = centerLineRef.value
  const spotlight = spotlightRef.value
  const borderLeft = borderLeftRef.value
  const borderRight = borderRightRef.value
  const title = titleRef.value
  const subtitle = subtitleRef.value

  if (
    !container ||
    !image ||
    !left ||
    !right ||
    !highlightLeft ||
    !highlightRight ||
    !centerLine ||
    !spotlight ||
    !borderLeft ||
    !borderRight ||
    !title ||
    !subtitle
  )
    return

  createFilaments()

  // 主时间线
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 1.5
    }
  })

  // 初始状态
  gsap.set([left, right], { scaleX: 1 })
  gsap.set(left, { transformOrigin: 'right center' })
  gsap.set(right, { transformOrigin: 'left center' })
  gsap.set(highlightLeft, { x: 0, opacity: 0.3 })
  gsap.set(highlightRight, { x: 0, opacity: 0.3 })
  gsap.set([borderLeft, borderRight], { scaleX: 0, opacity: 0 })
  gsap.set([title, subtitle], { opacity: 0, y: 20 })
  gsap.set(spotlight, { opacity: 0, scale: 0.5 })

  // 入场动画
  tl.fromTo(
    centerLine,
    { opacity: 0, scaleY: 0 },
    { opacity: 1, scaleY: 1, duration: 0.3, ease: 'power2.out' }
  )

  // 遮罩展开 - 液态效果
  tl.to(
    left,
    {
      scaleX: 0,
      duration: 0.6,
      ease: 'power4.out',
      onStart: () => {
        gsap.to(left, {
          skewX: -1,
          duration: 0.15,
          yoyo: true,
          repeat: 3,
          ease: 'power2.inOut'
        })
      }
    },
    '>'
  )
  tl.to(
    right,
    {
      scaleX: 0,
      duration: 0.6,
      ease: 'power4.out',
      onStart: () => {
        gsap.to(right, {
          skewX: 1,
          duration: 0.15,
          yoyo: true,
          repeat: 3,
          ease: 'power2.inOut'
        })
      }
    },
    '<'
  )

  // 边缘银丝飘动
  tl.to(
    '.filament',
    {
      y: -30,
      opacity: 0,
      stagger: 0.05,
      duration: 0.5,
      ease: 'power2.out'
    },
    '<0.2'
  )

  // 中央亮线消失
  tl.to(
    centerLine,
    { opacity: 0, scaleY: 0, duration: 0.3, ease: 'power2.in' },
    '<0.3'
  )

  // 金属饰条出现
  tl.to(
    [borderLeft, borderRight],
    {
      scaleX: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'back.out(1.5)'
    },
    '>-0.1'
  )

  // 图片亮度提升
  tl.fromTo(
    image,
    { filter: 'brightness(0.85)' },
    { filter: 'brightness(1)', duration: 0.3 },
    '<'
  )

  // 聚光灯效果
  tl.to(
    spotlight,
    {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    },
    '<0.1'
  )

  // 标题动画
  tl.to(
    [title, subtitle],
    {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.4,
      ease: 'power3.out'
    },
    '>-0.2'
  )

  // 高光流动循环
  const highlightTl = gsap.timeline({ repeat: -1 })
  highlightTl
    .to(highlightLeft, { x: 80, duration: 2, ease: 'sine.inOut' })
    .to(
      highlightLeft,
      { x: 0, duration: 2, ease: 'sine.inOut' },
      '>'
    )
  highlightTl
    .to(highlightRight, { x: -80, duration: 2, ease: 'sine.inOut' }, '<')
    .to(
      highlightRight,
      { x: 0, duration: 2, ease: 'sine.inOut' },
      '>'
    )

  cleanupFns.push(() => highlightTl.kill())

  // 液面边缘波动
  let wavePhase = 0
  tickerCallback = () => {
    wavePhase += 0.02
    const waveOffset = Math.sin(wavePhase) * 2

    if (left && gsap.isTweening(left)) {
      gsap.set(left, { skewY: waveOffset })
    }
    if (right && gsap.isTweening(right)) {
      gsap.set(right, { skewY: -waveOffset })
    }
  }

  gsap.ticker.add(tickerCallback)
  cleanupFns.push(() => {
    if (tickerCallback) {
      gsap.ticker.remove(tickerCallback)
    }
  })

  // 鼠标移动交互
  const handleMouseMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect()
    mouseX = (e.clientX - rect.left) / rect.width
    mouseY = (e.clientY - rect.top) / rect.height

    const offsetX = (mouseX - 0.5) * 10
    const offsetY = (mouseY - 0.5) * 5

    gsap.to(borderLeft, {
      skewY: (mouseY - 0.5) * 3,
      duration: 0.5,
      ease: 'power2.out'
    })
    gsap.to(borderRight, {
      skewY: (mouseY - 0.5) * -3,
      duration: 0.5,
      ease: 'power2.out'
    })

    gsap.to(highlightLeft, {
      opacity: 0.5 + mouseX * 0.3,
      duration: 0.3
    })
    gsap.to(highlightRight, {
      opacity: 0.5 + (1 - mouseX) * 0.3,
      duration: 0.3
    })
  }

  container.addEventListener('mousemove', handleMouseMove)
  cleanupFns.push(() => {
    container.removeEventListener('mousemove', handleMouseMove)
  })

  // 标题滚动视差
  const titleParallax = gsap.to([title, subtitle], {
    y: -50,
    scrollTrigger: {
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })
  cleanupFns.push(() => titleParallax.kill())

  // 关闭动画（向上滚动时）
  const closeTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'bottom 100%',
      end: 'bottom -100%',
      scrub: 1
    }
  })

  closeTl.to(
    [title, subtitle],
    {
      opacity: 0,
      y: -30,
      duration: 0.2,
      ease: 'power2.in'
    },
    0
  )
  closeTl.to(
    spotlight,
    {
      opacity: 0,
      scale: 0.8,
      duration: 0.2
    },
    '<'
  )
  closeTl.to(
    [borderLeft, borderRight],
    {
      scaleX: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    },
    '>'
  )
  closeTl.to(
    left,
    {
      scaleX: 1,
      duration: 0.5,
      ease: 'power4.inOut'
    },
    '<0.1'
  )
  closeTl.to(
    right,
    {
      scaleX: 1,
      duration: 0.5,
      ease: 'power4.inOut'
    },
    '<'
  )
  closeTl.to(
    centerLine,
    {
      opacity: 1,
      scaleY: 1,
      duration: 0.2,
      ease: 'power2.out'
    },
    '>-0.3'
  )
  closeTl.to(
    image,
    {
      filter: 'brightness(0.85)',
      duration: 0.3
    },
    '<'
  )

  cleanupFns.push(() => {
    tl.kill()
    closeTl.kill()
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === container) {
        st.kill()
      }
    })
  })
}

onMounted(() => {
  initAnimation()
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
  cleanupFns = []
})
</script>

<style lang="scss" scoped>
.mercury-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%);
}

.mercury-image {
  position: absolute;
  inset: 0;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.85);
  }
}

// 液态金属遮罩
.mercury-left,
.mercury-right {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 10;
  overflow: hidden;
}

.mercury-left {
  left: 0;
  transform-origin: right center;
}

.mercury-right {
  right: 0;
  transform-origin: left center;
}

.mercury-liquid-surface {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 30%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.08) 70%,
      transparent 100%
    );
    animation: liquidShimmer 4s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 30% 50%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 60%
    );
  }
}

.mercury-image-bg {
  position: absolute;
  inset: 0;
  width: 200%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  filter: saturate(0.6) brightness(0.7);

  .mercury-left & {
    left: 0;
  }

  .mercury-right & {
    left: -100%;
  }
}

@keyframes liquidShimmer {
  0%,
  100% {
    transform: translateX(-20%);
    opacity: 0.3;
  }
  50% {
    transform: translateX(20%);
    opacity: 0.6;
  }
}

.mercury-highlight-left,
.mercury-highlight-right {
  position: absolute;
  top: 0;
  width: 150%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 30%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0.15) 70%,
    transparent 100%
  );
  pointer-events: none;
}

.mercury-highlight-left {
  left: 0;
}

.mercury-highlight-right {
  right: 0;
  left: auto;
}

// 边缘银丝
.mercury-filaments {
  position: absolute;
  top: 0;
  width: 20px;
  height: 100%;
  pointer-events: none;
}

// 中央亮线
.mercury-center-line {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 3px;
  height: 60%;
  z-index: 20;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.8) 20%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0.8) 80%,
    transparent
  );
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.5),
    0 0 20px rgba(255, 255, 255, 0.3),
    0 0 40px rgba(255, 255, 255, 0.2);

  .center-glow {
    position: absolute;
    inset: -50px;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
  }
}

// 聚光灯效果
.mercury-spotlight {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: radial-gradient(
    ellipse 80% 60% at 50% 50%,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 70%
  );
  pointer-events: none;
}

// 金属饰条
.mercury-border-left,
.mercury-border-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  z-index: 15;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(180, 180, 200, 0.8) 10%,
    rgba(220, 220, 240, 1) 50%,
    rgba(180, 180, 200, 0.8) 90%,
    transparent
  );
  box-shadow:
    0 0 8px rgba(200, 200, 220, 0.6),
    0 0 15px rgba(180, 180, 200, 0.4);
}

.mercury-border-left {
  left: 2%;
  transform-origin: right center;
}

.mercury-border-right {
  right: 2%;
  transform-origin: left center;
}

// 标题
.mercury-title {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 300;
  color: transparent;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(200, 200, 220, 0.8) 50%,
    rgba(255, 255, 255, 0.9) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  opacity: 0;
}

.mercury-subtitle {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  font-size: clamp(0.7rem, 1.5vw, 1rem);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5em;
  text-transform: uppercase;
  opacity: 0;
}
</style>
