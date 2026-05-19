<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const img1Ref = ref<HTMLElement | null>(null)
const img2Ref = ref<HTMLElement | null>(null)
const img3Ref = ref<HTMLElement | null>(null)
const mercuryRef = ref<HTMLElement | null>(null)
const reflectionRef = ref<HTMLElement | null>(null)
const ripple1Ref = ref<HTMLElement | null>(null)
const ripple2Ref = ref<HTMLElement | null>(null)
const ripple3Ref = ref<HTMLElement | null>(null)
const captionRef = ref<HTMLElement | null>(null)
const dropletRefs: HTMLElement[] = []

const cleanupFns: TweenCleanup[] = []

const images = [
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    title: '山峦叠嶂',
    sub: 'MOUNTAINS'
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80',
    title: '晨雾森林',
    sub: 'FOREST'
  },
  {
    url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80',
    title: '深邃湖泊',
    sub: 'LAKE'
  },
]

function setDropletRef(el: unknown, i: number) {
  if (el) {
    dropletRefs[i] = el as HTMLElement
  }
}

onMounted(() => {
  const parent = parentRef.value
  const frame = frameRef.value
  if (!parent || !frame) {
    return
  }
  if (!img1Ref.value || !img2Ref.value || !img3Ref.value) {
    return
  }

  // 初始状态
  gsap.set(img1Ref.value, { opacity: 1 })
  gsap.set(img2Ref.value, { opacity: 0, scale: 1.08 })
  gsap.set(img3Ref.value, { opacity: 0, scale: 1.08 })
  gsap.set(mercuryRef.value, { opacity: 0, scale: 0.6 })
  gsap.set(reflectionRef.value, { opacity: 0 })
  gsap.set([ripple1Ref.value, ripple2Ref.value, ripple3Ref.value], { scale: 0, opacity: 0 })
  gsap.set(captionRef.value, { opacity: 0, y: 30 })

  // 水滴初始化
  dropletRefs.filter(Boolean).forEach((d) => {
    gsap.set(d, {
      opacity: 0,
      scale: 0,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200
    })
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 100%',
      end: 'bottom -80%',
      scrub: 2,
      toggleActions: 'play reverse play reverse'
    }})

  // === 阶段1: 图1稳定展示 + 水银球出现 (0-15%) ===
  tl.to(
    mercuryRef.value,
    {
      opacity: 1,
      scale: 1,
      duration: 0.12,
      ease: 'back.out(1.5)'
    },
    0.03
  )

  tl.to(reflectionRef.value, { opacity: 0.6, duration: 0.08 }, 0.08)

  // === 阶段2: 第一次液态变形 — 图1→图2 (15-40%) ===
  // 水银扩展覆盖画面
  tl.to(
    mercuryRef.value,
    {
      scale: 8,
      opacity: 0.9,
      duration: 0.12,
      ease: 'power2.in'
    },
    0.15
  )

  // 波纹1爆发
  tl.to(
    ripple1Ref.value,
    {
      scale: 4,
      opacity: 0.6,
      duration: 0.06,
      ease: 'power2.out'
    },
    0.18
  )
  tl.to(ripple1Ref.value, { scale: 8, opacity: 0, duration: 0.08 }, 0.24)

  // 图片切换
  tl.to(
    img1Ref.value,
    {
      opacity: 0,
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.in'
    },
    0.22
  )
  tl.to(
    img2Ref.value,
    {
      opacity: 1,
      scale: 1,
      duration: 0.1,
      ease: 'power2.out'
    },
    0.28
  )

  // 水银收回
  tl.to(
    mercuryRef.value,
    {
      scale: 1,
      opacity: 1,
      duration: 0.1,
      ease: 'power2.out'
    },
    0.32
  )

  // 水滴飞溅
  dropletRefs.filter(Boolean).forEach((d, i) => {
    if (i < 6) {
      tl.to(
        d,
        {
          opacity: 0.7,
          scale: 1,
          duration: 0.06,
          ease: 'power2.out'
        },
        0.2 + i * 0.01
      )
      tl.to(d, { opacity: 0, scale: 0, duration: 0.08 }, 0.3 + i * 0.01)
    }
  })

  // === 阶段3: 稳态 + 微漂浮 (40-55%) ===
  tl.to(mercuryRef.value, { y: -8, duration: 0.15, ease: 'sine.inOut' }, 0.4)

  tl.to(
    captionRef.value,
    {
      opacity: 1,
      y: 0,
      duration: 0.1,
      ease: 'power2.out'
    },
    0.42
  )

  // === 阶段4: 第二次液态变形 — 图2→图3 (55-80%) ===
  tl.to(captionRef.value, { opacity: 0, y: -20, duration: 0.06 }, 0.55)

  tl.to(
    mercuryRef.value,
    {
      scale: 10,
      opacity: 0.85,
      y: 0,
      duration: 0.12,
      ease: 'power3.in'
    },
    0.57
  )

  // 波纹2
  tl.to(
    ripple2Ref.value,
    {
      scale: 5,
      opacity: 0.5,
      duration: 0.06,
      ease: 'power2.out'
    },
    0.6
  )
  tl.to(ripple2Ref.value, { scale: 10, opacity: 0, duration: 0.08 }, 0.66)

  // 图片切换
  tl.to(
    img2Ref.value,
    {
      opacity: 0,
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.in'
    },
    0.62
  )
  tl.to(
    img3Ref.value,
    {
      opacity: 1,
      scale: 1,
      duration: 0.1,
      ease: 'power2.out'
    },
    0.68
  )

  // 收回
  tl.to(
    mercuryRef.value,
    {
      scale: 1.2,
      opacity: 0.9,
      duration: 0.1,
      ease: 'back.out(1.2)'
    },
    0.72
  )

  // 水滴飞溅第二波
  dropletRefs.filter(Boolean).forEach((d, i) => {
    if (i >= 6) {
      tl.to(d, { opacity: 0.6, scale: 1, duration: 0.06 }, 0.62 + (i - 6) * 0.01)
      tl.to(d, { opacity: 0, scale: 0, duration: 0.08 }, 0.72 + (i - 6) * 0.01)
    }
  })

  // === 阶段5: 最终消散 (80-100%) ===
  tl.to(
    ripple3Ref.value,
    {
      scale: 6,
      opacity: 0.4,
      duration: 0.08,
      ease: 'power2.out'
    },
    0.82
  )
  tl.to(ripple3Ref.value, { scale: 12, opacity: 0, duration: 0.1 }, 0.9)

  tl.to(
    mercuryRef.value,
    {
      scale: 0,
      opacity: 0,
      duration: 0.12,
      ease: 'power3.in'
    },
    0.85
  )

  tl.to(reflectionRef.value, { opacity: 0, duration: 0.1 }, 0.88)

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
  <div ref="parentRef" class="liquid-morph-section">
    <!-- 背景 -->
    <div class="lm-bg">
      <div class="lm-gradient"></div>
      <div class="lm-noise"></div>
    </div>

    <!-- 画框 -->
    <div ref="frameRef" class="lm-frame">
      <!-- 3张图片层 -->
      <div ref="img1Ref" class="lm-image-layer">
        <img :src="images[0].url" :alt="images[0].title" class="lm-img" />
      </div>
      <div ref="img2Ref" class="lm-image-layer">
        <img :src="images[1].url" :alt="images[1].title" class="lm-img" />
      </div>
      <div ref="img3Ref" class="lm-image-layer">
        <img :src="images[2].url" :alt="images[2].title" class="lm-img" />
      </div>

      <!-- 水银球 -->
      <div ref="mercuryRef" class="mercury-orb">
        <div class="mercury-inner"></div>
        <div class="mercury-highlight"></div>
      </div>

      <!-- 金属反射 -->
      <div ref="reflectionRef" class="mercury-reflection"></div>

      <!-- 波纹 -->
      <div ref="ripple1Ref" class="lm-ripple"></div>
      <div ref="ripple2Ref" class="lm-ripple"></div>
      <div ref="ripple3Ref" class="lm-ripple"></div>

      <!-- 水滴飞溅 -->
      <div
        v-for="i in 12"
        :key="`drop-${i}`"
        :ref="(el) => setDropletRef(el, i - 1)"
        class="mercury-droplet"
      ></div>

      <!-- 文字标注 -->
      <div ref="captionRef" class="lm-caption">
        <span class="caption-sub">LIQUID MORPH</span>
        <h3 class="caption-title">流体变形</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.liquid-morph-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #08080f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lm-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.lm-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, rgba(40, 40, 80, 0.3) 0%, transparent 70%);
}

.lm-noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* 画框 */
.lm-frame {
  position: relative;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  overflow: hidden;
  z-index: 10;
}

/* 图片层 */
.lm-image-layer {
  position: absolute;
  inset: 0;
  will-change: transform, opacity;
}

.lm-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 水银球 */
.mercury-orb {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  z-index: 30;
  will-change: transform, opacity;
  pointer-events: none;
}

.mercury-inner {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(200, 210, 230, 0.95) 0%,
    rgba(120, 130, 160, 0.9) 40%,
    rgba(60, 65, 85, 0.95) 70%,
    rgba(180, 190, 210, 0.9) 100%
  );
  box-shadow:
    inset 0 -3px 8px rgba(0, 0, 0, 0.4),
    inset 0 3px 6px rgba(255, 255, 255, 0.3),
    0 0 30px rgba(160, 170, 200, 0.3),
    0 0 60px rgba(120, 130, 160, 0.15);
}

.mercury-highlight {
  position: absolute;
  top: 15%;
  left: 25%;
  width: 35%;
  height: 25%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255, 255, 255, 0.75), transparent 70%);
}

/* 金属反射 */
.mercury-reflection {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(200, 220, 255, 0.08),
    rgba(255, 200, 180, 0.06),
    rgba(180, 255, 220, 0.08),
    rgba(200, 180, 255, 0.06),
    rgba(200, 220, 255, 0.08)
  );
  filter: blur(20px);
  z-index: 25;
  pointer-events: none;
}

/* 波纹 */
.lm-ripple {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1.5px solid rgba(200, 210, 230, 0.4);
  z-index: 28;
  pointer-events: none;
  will-change: transform, opacity;
}

/* 水滴 */
.mercury-droplet {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(200, 210, 230, 0.9), rgba(100, 110, 140, 0.8));
  box-shadow: 0 0 8px rgba(160, 170, 200, 0.4);
  z-index: 32;
  pointer-events: none;
  will-change: transform, opacity;
}

/* 文字标注 */
.lm-caption {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 35;
  will-change: opacity, transform;
}

.caption-sub {
  display: block;
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(200, 210, 230, 0.5);
  margin-bottom: 6px;
}

.caption-title {
  font-size: clamp(20px, 3.5vw, 32px);
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 0 20px rgba(160, 170, 200, 0.3);
}

@media (max-width: 768px) {
  .lm-frame {
    width: 100vw;
    height: 100vh;
  }

  .mercury-orb {
    width: 40px;
    height: 40px;
  }
}
</style>



