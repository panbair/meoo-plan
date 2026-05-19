<template>
  <section ref="parentRef" class="aurora-wave-container">
    <!-- 底层完整图片 -->
    <div class="aw-base-layer">
      <img :src="imageUrl" alt="" class="aw-base-img" />
    </div>

    <!-- 极光条纹层 -->
    <div ref="stripLayerRef" class="aw-strip-layer">
      <div
        v-for="(strip, index) in strips"
        :key="index"
        :ref="(el) => setStripRef(el, index)"
        class="aw-strip"
        :style="strip.style"
      >
        <div class="aw-strip-img-wrap" :style="strip.imgWrapStyle">
          <img :src="imageUrl" alt="" class="aw-strip-img" />
        </div>
        <div class="aw-strip-glow" :style="strip.glowStyle"></div>
      </div>
    </div>

    <!-- 极光光效层 -->
    <div ref="auroraGlow1Ref" class="aw-aurora-glow aw-glow-1"></div>
    <div ref="auroraGlow2Ref" class="aw-aurora-glow aw-glow-2"></div>
    <div ref="auroraGlow3Ref" class="aw-aurora-glow aw-glow-3"></div>

    <!-- 合成闪光 -->
    <div ref="flashRef" class="aw-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const stripLayerRef = ref<HTMLElement | null>(null)
const auroraGlow1Ref = ref<HTMLElement | null>(null)
const auroraGlow2Ref = ref<HTMLElement | null>(null)
const auroraGlow3Ref = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)

const stripRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const STRIP_COUNT = 12
const imageUrl = 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80'

interface Strip {
  style: Record<string, string>
  imgWrapStyle: Record<string, string>
  glowStyle: Record<string, string>
  waveY: number
  waveX: number
  rotation: number
  blur: number
}

const strips = reactive<Strip[]>([])

let seed = 77777
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (min: number, max: number) => min + random() * (max - min)

const initStrips = () => {
  strips.length = 0
  seed = 77777
  const stripH = 100 / STRIP_COUNT

  for (let i = 0; i < STRIP_COUNT; i++) {
    const topPos = i * stripH
    const direction = i % 2 === 0 ? 1 : -1
    const distFromCenter = Math.abs(i - (STRIP_COUNT - 1) / 2) / ((STRIP_COUNT - 1) / 2)

    strips.push({
      style: {
        top: `${topPos}%`,
        height: `${stripH + 0.5}%`,
      },
      imgWrapStyle: {
        top: `-${topPos}%`,
        height: `${STRIP_COUNT * 100}%`,
      },
      glowStyle: {
        background: `linear-gradient(90deg,
          transparent,
          hsla(${140 + i * 15}, 90%, 60%, 0.25) 30%,
          hsla(${160 + i * 15}, 95%, 55%, 0.35) 50%,
          hsla(${180 + i * 15}, 90%, 60%, 0.25) 70%,
          transparent)`,
      },
      waveY: direction * (40 + randRange(20, 60) * distFromCenter),
      waveX: direction * randRange(30, 80),
      rotation: direction * randRange(1, 4),
      blur: 2 + distFromCenter * 6,
    })
  }
}

const setStripRef = (el: Element | null, index: number) => {
  if (el) {
    stripRefs[index] = el as HTMLElement
  }
}

onMounted(() => {
  if (!parentRef.value) {
    return
  }
  initStrips()
  requestAnimationFrame(() => setupAnimations())
})

const setupAnimations = () => {
  if (!parentRef.value) {
    return
  }

  // ===== 阶段1: 条纹碎裂飘散 =====
  const scatterTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 40%',
      scrub: 1.5,
    },
  })

  // 初始：条纹散开 → 目标：归位
  stripRefs.forEach((strip, idx) => {
    if (!strip) {
      return
    }
    const data = strips[idx]
    if (!data) {
      return
    }

    gsap.set(strip, {
      x: data.waveX,
      y: data.waveY,
      rotation: data.rotation,
      opacity: 0,
      filter: `blur(${data.blur}px)`,
    })

    const glow = strip.querySelector('.aw-strip-glow') as HTMLElement
    if (glow) {
      gsap.set(glow, { opacity: 0 })
    }

    const delay = idx * 0.04

    scatterTl.to(
      strip,
      {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.6,
        ease: 'expo.out',
      },
      delay,
    )

    // 极光边缘发光：先亮后消
    if (glow) {
      scatterTl.to(
        glow,
        { opacity: 1, duration: 0.15 },
        delay + 0.2,
      )
      scatterTl.to(
        glow,
        { opacity: 0, duration: 0.3 },
        delay + 0.35,
      )
    }
  })

  cleanupFns.push(() => {
    scatterTl.scrollTrigger?.kill()
    scatterTl.kill()
  })

  // ===== 阶段2: 极光光效 =====
  const glowTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 60%',
      end: 'top 20%',
      scrub: 1.2,
    },
  })

  // 极光光晕
  if (auroraGlow1Ref.value) {
    gsap.set(auroraGlow1Ref.value, { opacity: 0, y: 30 })
    glowTl.to(
      auroraGlow1Ref.value,
      { opacity: 0.6, y: -20, duration: 0.5, ease: 'power2.out' },
      0,
    )
    glowTl.to(
      auroraGlow1Ref.value,
      { opacity: 0, duration: 0.4 },
      0.6,
    )
  }
  if (auroraGlow2Ref.value) {
    gsap.set(auroraGlow2Ref.value, { opacity: 0, y: 50 })
    glowTl.to(
      auroraGlow2Ref.value,
      { opacity: 0.5, y: -10, duration: 0.5, ease: 'power2.out' },
      0.1,
    )
    glowTl.to(
      auroraGlow2Ref.value,
      { opacity: 0, duration: 0.4 },
      0.6,
    )
  }
  if (auroraGlow3Ref.value) {
    gsap.set(auroraGlow3Ref.value, { opacity: 0, y: 40 })
    glowTl.to(
      auroraGlow3Ref.value,
      { opacity: 0.4, y: -15, duration: 0.5, ease: 'power2.out' },
      0.2,
    )
    glowTl.to(
      auroraGlow3Ref.value,
      { opacity: 0, duration: 0.4 },
      0.6,
    )
  }

  cleanupFns.push(() => {
    glowTl.scrollTrigger?.kill()
    glowTl.kill()
  })

  // ===== 阶段3: 合成闪光 =====
  if (flashRef.value) {
    gsap.set(flashRef.value, { opacity: 0 })

    const flashTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 35%',
        end: 'top 20%',
        scrub: 0.5,
      },
    })

    flashTl.to(flashRef.value, { opacity: 0.8, duration: 0.15 }, 0)
    flashTl.to(flashRef.value, { opacity: 0, duration: 0.4 }, 0.15)

    cleanupFns.push(() => {
      flashTl.scrollTrigger?.kill()
      flashTl.kill()
    })
  }
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.aurora-wave-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #050510;
}

.aw-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .aw-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.aw-strip-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.aw-strip {
  position: absolute;
  left: 0;
  width: 100%;
  overflow: hidden;
  will-change: transform, opacity, filter;
  transform-style: preserve-3d;

  .aw-strip-img-wrap {
    position: absolute;
    left: 0;
    width: 100%;
    overflow: hidden;

    .aw-strip-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .aw-strip-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
  }
}

// 极光光效
.aw-aurora-glow {
  position: absolute;
  left: -10%;
  width: 120%;
  height: 30%;
  z-index: 15;
  pointer-events: none;
  filter: blur(40px);
  will-change: transform, opacity;
}

.aw-glow-1 {
  top: 15%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(80, 255, 180, 0.3) 25%,
    rgba(100, 220, 255, 0.4) 50%,
    rgba(80, 255, 180, 0.3) 75%,
    transparent
  );
}

.aw-glow-2 {
  top: 40%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(150, 100, 255, 0.25) 20%,
    rgba(80, 200, 255, 0.35) 50%,
    rgba(200, 100, 255, 0.25) 80%,
    transparent
  );
}

.aw-glow-3 {
  top: 60%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(100, 255, 200, 0.2) 30%,
    rgba(80, 180, 255, 0.3) 50%,
    rgba(100, 255, 200, 0.2) 70%,
    transparent
  );
}

// 合成闪光
.aw-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at center,
    rgba(180, 255, 220, 0.8) 0%,
    rgba(100, 220, 255, 0.4) 30%,
    rgba(80, 180, 255, 0.15) 60%,
    transparent 80%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

