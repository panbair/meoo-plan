<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const img1Ref = ref<HTMLElement | null>(null)
const img2Ref = ref<HTMLElement | null>(null)
const img3Ref = ref<HTMLElement | null>(null)
const irisRef = ref<HTMLElement | null>(null)
const leakRef = ref<HTMLElement | null>(null)
const grainRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const barTopRef = ref<HTMLElement | null>(null)
const barBotRef = ref<HTMLElement | null>(null)
const counterRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const crosshairRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

const images = [
  {
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80',
    title: 'SCENE 01'
  },
  {
    url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80',
    title: 'SCENE 02'
  },
  {
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
    title: 'SCENE 03'
  }
]

onMounted(() => {
  const parent = parentRef.value
  const stage = stageRef.value
  if (!parent || !stage) {
    return
  }

  // 初始状态 — 完全黑幕
  gsap.set(stageRef.value, { opacity: 0, scale: 1.05 })
  gsap.set(img1Ref.value, { opacity: 1, scale: 1.1 })
  gsap.set(img2Ref.value, { opacity: 0, scale: 1.1 })
  gsap.set(img3Ref.value, { opacity: 0, scale: 1.1 })

  // 虹膜遮罩 — 从 0% 圆开始
  gsap.set(irisRef.value, {
    clipPath: 'circle(0% at 50% 50%)',
    opacity: 1
  })

  gsap.set(leakRef.value, { opacity: 0, x: '-100%' })
  gsap.set(grainRef.value, { opacity: 0 })
  gsap.set(vignetteRef.value, { opacity: 0 })
  gsap.set(barTopRef.value, { y: '-100%' })
  gsap.set(barBotRef.value, { y: '100%' })
  gsap.set(counterRef.value, { opacity: 0 })
  gsap.set(titleRef.value, { opacity: 0, y: 15 })
  gsap.set(crosshairRef.value, { opacity: 0, scale: 1.5 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 2,
      toggleActions: 'play reverse play reverse'
    }
  })

  // === 阶段1: 电影开幕 — 虹膜打开 (0-20%) ===
  tl.to(
    stageRef.value,
    {
      opacity: 1,
      scale: 1,
      duration: 0.08
    },
    0
  )

  // 胶片颗粒
  tl.to(
    grainRef.value,
    {
      opacity: 0.08,
      duration: 0.05
    },
    0.02
  )

  // 宽银幕黑边入场
  tl.to(
    barTopRef.value,
    {
      y: '0%',
      duration: 0.1,
      ease: 'power2.out'
    },
    0.03
  )
  tl.to(
    barBotRef.value,
    {
      y: '0%',
      duration: 0.1,
      ease: 'power2.out'
    },
    0.03
  )

  // 虹膜打开
  tl.to(
    irisRef.value,
    {
      clipPath: 'circle(80% at 50% 50%)',
      duration: 0.15,
      ease: 'power3.out'
    },
    0.05
  )

  // 准星
  tl.to(
    crosshairRef.value,
    {
      opacity: 0.4,
      scale: 1,
      duration: 0.1,
      ease: 'power2.out'
    },
    0.1
  )

  // 暗角
  tl.to(
    vignetteRef.value,
    {
      opacity: 1,
      duration: 0.1
    },
    0.12
  )

  // 计数器
  tl.to(
    counterRef.value,
    {
      opacity: 1,
      duration: 0.06
    },
    0.15
  )

  // 图1 ken burns
  tl.to(
    img1Ref.value,
    {
      scale: 1,
      duration: 0.3,
      ease: 'none'
    },
    0.05
  )

  // === 阶段2: 光泄漏转场 → 图2 (25-50%) ===
  // 光泄漏扫过
  tl.to(
    leakRef.value,
    {
      opacity: 0.7,
      x: '0%',
      duration: 0.08,
      ease: 'power2.out'
    },
    0.25
  )
  tl.to(
    leakRef.value,
    {
      x: '120%',
      opacity: 0,
      duration: 0.12,
      ease: 'power2.in'
    },
    0.33
  )

  // 换图
  tl.to(
    img1Ref.value,
    {
      opacity: 0,
      duration: 0.08
    },
    0.3
  )
  tl.to(
    img2Ref.value,
    {
      opacity: 1,
      scale: 1.1,
      duration: 0.08
    },
    0.34
  )

  // 准星闪烁
  tl.to(
    crosshairRef.value,
    {
      opacity: 0,
      duration: 0.03
    },
    0.3
  )
  tl.to(
    crosshairRef.value,
    {
      opacity: 0.4,
      duration: 0.03
    },
    0.36
  )

  // 标题入场
  tl.to(
    titleRef.value,
    {
      opacity: 1,
      y: 0,
      duration: 0.1,
      ease: 'power2.out'
    },
    0.4
  )

  // 图2 ken burns
  tl.to(
    img2Ref.value,
    {
      scale: 1,
      duration: 0.25,
      ease: 'none'
    },
    0.35
  )

  // === 阶段3: 虹膜收缩再打开 → 图3 (50-75%) ===
  tl.to(
    titleRef.value,
    {
      opacity: 0,
      y: -10,
      duration: 0.06
    },
    0.52
  )

  // 虹膜收缩
  tl.to(
    irisRef.value,
    {
      clipPath: 'circle(5% at 50% 50%)',
      duration: 0.1,
      ease: 'power3.in'
    },
    0.55
  )

  // 换图
  tl.to(
    img2Ref.value,
    {
      opacity: 0,
      duration: 0.05
    },
    0.62
  )
  tl.to(
    img3Ref.value,
    {
      opacity: 1,
      scale: 1.1,
      duration: 0.05
    },
    0.64
  )

  // 虹膜重新打开
  tl.to(
    irisRef.value,
    {
      clipPath: 'circle(80% at 50% 50%)',
      duration: 0.12,
      ease: 'power2.out'
    },
    0.66
  )

  // 图3 ken burns
  tl.to(
    img3Ref.value,
    {
      scale: 1,
      duration: 0.25,
      ease: 'none'
    },
    0.66
  )

  // === 阶段4: 收幕 (80-100%) ===
  // 虹膜关闭
  tl.to(
    irisRef.value,
    {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 0.15,
      ease: 'power3.in'
    },
    0.82
  )

  // 黑边退出
  tl.to(
    barTopRef.value,
    {
      y: '-100%',
      duration: 0.1,
      ease: 'power2.in'
    },
    0.9
  )
  tl.to(
    barBotRef.value,
    {
      y: '100%',
      duration: 0.1,
      ease: 'power2.in'
    },
    0.9
  )

  // 准星、计数器消散
  tl.to(
    crosshairRef.value,
    {
      opacity: 0,
      duration: 0.05
    },
    0.85
  )
  tl.to(
    counterRef.value,
    {
      opacity: 0,
      duration: 0.05
    },
    0.88
  )
  tl.to(
    grainRef.value,
    {
      opacity: 0,
      duration: 0.05
    },
    0.9
  )
  tl.to(
    vignetteRef.value,
    {
      opacity: 0,
      duration: 0.08
    },
    0.9
  )
  tl.to(
    stageRef.value,
    {
      opacity: 0,
      duration: 0.1
    },
    0.92
  )

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<template>
  <section ref="parentRef" class="cinematic-mask-section">
    <!-- 背景 -->
    <div class="cm-bg"></div>

    <!-- 电影舞台 -->
    <div ref="stageRef" class="cm-stage">
      <!-- 虹膜遮罩容器 -->
      <div ref="irisRef" class="cm-iris">
        <!-- 图片层 -->
        <div ref="img1Ref" class="cm-image-layer">
          <img :src="images[0].url" :alt="images[0].title" class="cm-img" />
        </div>
        <div ref="img2Ref" class="cm-image-layer">
          <img :src="images[1].url" :alt="images[1].title" class="cm-img" />
        </div>
        <div ref="img3Ref" class="cm-image-layer">
          <img :src="images[2].url" :alt="images[2].title" class="cm-img" />
        </div>

        <!-- 暗角 -->
        <div ref="vignetteRef" class="cm-vignette"></div>
      </div>

      <!-- 光泄漏 -->
      <div ref="leakRef" class="cm-light-leak"></div>

      <!-- 胶片颗粒 -->
      <div ref="grainRef" class="cm-grain"></div>

      <!-- 宽银幕黑边 -->
      <div ref="barTopRef" class="cm-letterbox cm-bar-top"></div>
      <div ref="barBotRef" class="cm-letterbox cm-bar-bot"></div>

      <!-- 准星 -->
      <div ref="crosshairRef" class="cm-crosshair">
        <div class="ch-h"></div>
        <div class="ch-v"></div>
        <div class="ch-circle"></div>
      </div>

      <!-- 帧计数器 -->
      <div ref="counterRef" class="cm-counter">
        <span class="counter-frame">FRM 0024</span>
        <span class="counter-tc">01:23:45:12</span>
      </div>

      <!-- 标题 -->
      <div ref="titleRef" class="cm-title">
        <span class="title-label">CINEMATIC MASK</span>
        <h3 class="title-main">电影级遮罩</h3>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cinematic-mask-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cm-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(20, 15, 10, 1) 0%,
    #000 80%
  );
}

/* 舞台 */
.cm-stage {
  position: relative;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  will-change: opacity, transform;
}

/* 虹膜遮罩 */
.cm-iris {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 8px;
  will-change: clip-path;
}

/* 图片 */
.cm-image-layer {
  position: absolute;
  inset: 0;
  will-change: opacity, transform;
}

.cm-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 暗角 */
.cm-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 50%,
    rgba(0, 0, 0, 0.55) 100%
  );
  pointer-events: none;
}

/* 光泄漏 */
.cm-light-leak {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: linear-gradient(
    90deg,
    transparent 10%,
    rgba(255, 200, 100, 0.35) 30%,
    rgba(255, 150, 50, 0.25) 50%,
    rgba(255, 100, 50, 0.15) 70%,
    transparent 90%
  );
  mix-blend-mode: screen;
  pointer-events: none;
  will-change: transform, opacity;
  border-radius: 8px;
}

/* 胶片颗粒 */
.cm-grain {
  position: absolute;
  inset: 0;
  z-index: 22;
  pointer-events: none;
  border-radius: 8px;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  animation: grain-shift 0.5s steps(3) infinite;
}

@keyframes grain-shift {
  0% {
    background-position: 0 0;
  }
  33% {
    background-position: -50px -30px;
  }
  66% {
    background-position: 30px -60px;
  }
  100% {
    background-position: 0 0;
  }
}

/* 宽银幕黑边 */
.cm-letterbox {
  position: absolute;
  left: 0;
  right: 0;
  height: 12%;
  background: #000;
  z-index: 25;
  will-change: transform;
}

.cm-bar-top {
  top: 0;
}

.cm-bar-bot {
  bottom: 0;
}

/* 准星 */
.cm-crosshair {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  z-index: 15;
  pointer-events: none;
  will-change: opacity, transform;
}

.ch-h {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.ch-v {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.ch-circle {
  position: absolute;
  inset: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

/* 帧计数器 */
.cm-counter {
  position: absolute;
  top: 18%;
  left: 20px;
  z-index: 28;
  display: flex;
  flex-direction: column;
  gap: 3px;
  will-change: opacity;
}

.counter-frame,
.counter-tc {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  color: rgba(255, 200, 100, 0.6);
}

/* 标题 */
.cm-title {
  position: absolute;
  bottom: 18%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 28;
  will-change: opacity, transform;
}

.title-label {
  display: block;
  font-size: 9px;
  letter-spacing: 0.4em;
  color: rgba(255, 200, 100, 0.5);
  margin-bottom: 6px;
  text-transform: uppercase;
}

.title-main {
  font-size: clamp(22px, 4vw, 38px);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 180, 80, 0.2);
}

@media (max-width: 768px) {
  .cm-stage {
    width: 100vw;
    height: 100vh;
  }

  .cm-counter {
    display: none;
  }

  .cm-crosshair {
    width: 50px;
    height: 50px;
  }
}
</style>




