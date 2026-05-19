<template>
  <section ref="parentRef" class="phoenix-rise-container">
    <div class="pr-base-layer">
      <img :src="imageUrl" alt="" class="pr-base-img" />
    </div>
    <div ref="ashLayerRef" class="pr-ash-layer">
      <div
        v-for="(ash, index) in ashes"
        :key="index"
        :ref="(el) => setAshRef(el, index)"
        class="pr-ash"
        :style="ash.style"
      >
        <div class="pr-ash-inner" :style="ash.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
        <div class="pr-ember"></div>
      </div>
    </div>
    <div ref="fireLayerRef" class="pr-fire-layer">
      <div
        v-for="i in 20"
        :key="`flame-${i}`"
        :ref="(el) => setFlameRef(el, i - 1)"
        class="pr-flame"
      ></div>
    </div>
    <div ref="heatRef" class="pr-heat-distort"></div>
    <div ref="flashRef" class="pr-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const ashLayerRef = ref<HTMLElement | null>(null)
const fireLayerRef = ref<HTMLElement | null>(null)
const heatRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)

const ashRefs: HTMLElement[] = []
const flameRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 8
const ROWS = 6
const imageUrl = 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80'

interface AshPiece {
  style: Record<string, string>
  innerStyle: Record<string, string>
  riseY: number
  driftX: number
  rotate: number
  delay: number
}

const ashes = reactive<AshPiece[]>([])

let seed = 99887
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const randRange = (min: number, max: number) => min + random() * (max - min)

const initAshes = () => {
  ashes.length = 0
  seed = 99887
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      // 从底部往上逐行延迟（底部先燃烧）
      const rowDelay = (ROWS - 1 - row) * 0.04
      ashes.push({
        style: {
          left: `${col * cellW}%`,
          top: `${row * cellH}%`,
          width: `${cellW}%`,
          height: `${cellH}%`,
        },
        innerStyle: {
          width: `${COLS * 100}%`,
          height: `${ROWS * 100}%`,
          left: `${-col * 100}%`,
          top: `${-row * 100}%`,
        },
        riseY: -(60 + randRange(30, 100)),
        driftX: randRange(-40, 40),
        rotate: randRange(-20, 20),
        delay: rowDelay + randRange(0, 0.03),
      })
    }
  }
}

const setAshRef = (el: Element | null, index: number) => {
  if (el) { ashRefs[index] = el as HTMLElement }
}
const setFlameRef = (el: unknown, index: number) => {
  if (el) { flameRefs[index] = el as HTMLElement }
}

onMounted(() => {
  if (!parentRef.value) { return }
  initAshes()
  requestAnimationFrame(() => setupAnimations())
})

const setupAnimations = () => {
  if (!parentRef.value) { return }

  // 火焰粒子初始化
  flameRefs.filter(Boolean).forEach((f) => {
    const size = 4 + random() * 12
    gsap.set(f, {
      width: size,
      height: size * 1.5,
      left: `${random() * 100}%`,
      bottom: `${random() * 30}%`,
      opacity: 0,
      scale: 0,
    })
  })

  // ===== 阶段1: 灰烬碎片飘散（初始为散开状态，归位 = 重生）=====
  const rebuildTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.8,
    },
  })

  // 碎片初始：散开 + 灰暗
  ashRefs.forEach((ash, idx) => {
    if (!ash) { return }
    const data = ashes[idx]
    if (!data) { return }

    gsap.set(ash, {
      x: data.driftX,
      y: data.riseY,
      rotation: data.rotate,
      opacity: 0,
      filter: 'blur(3px) grayscale(1) brightness(0.3)',
    })

    const ember = ash.querySelector('.pr-ember') as HTMLElement
    if (ember) { gsap.set(ember, { opacity: 0 }) }

    // 逐渐归位 + 颜色恢复
    rebuildTl.to(ash, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      filter: 'blur(0px) grayscale(0) brightness(1)',
      duration: 0.6,
      ease: 'expo.out',
    }, data.delay)

    // 燃烧边缘光
    if (ember) {
      rebuildTl.to(ember, { opacity: 1, duration: 0.08 }, data.delay + 0.15)
      rebuildTl.to(ember, { opacity: 0, duration: 0.25 }, data.delay + 0.3)
    }
  })

  cleanupFns.push(() => {
    rebuildTl.scrollTrigger?.kill()
    rebuildTl.kill()
  })

  // ===== 阶段2: 火焰粒子上升 =====
  const flameTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 75%',
      end: 'top 30%',
      scrub: 1.5,
    },
  })

  flameRefs.filter(Boolean).forEach((f, i) => {
    const delay = i * 0.03
    flameTl.to(f, {
      opacity: 0.7 + random() * 0.3,
      scale: 1,
      y: -(100 + random() * 200),
      duration: 0.5,
      ease: 'power1.out',
    }, delay)
    flameTl.to(f, {
      opacity: 0,
      scale: 0.3,
      y: '-=80',
      duration: 0.3,
    }, delay + 0.4)
  })

  cleanupFns.push(() => {
    flameTl.scrollTrigger?.kill()
    flameTl.kill()
  })

  // ===== 阶段3: 热浪扭曲 =====
  if (heatRef.value) {
    gsap.set(heatRef.value, { opacity: 0 })
    const heatTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 70%',
        end: 'top 25%',
        scrub: 1.2,
      },
    })
    heatTl.to(heatRef.value, { opacity: 0.4, duration: 0.3 }, 0)
    heatTl.to(heatRef.value, { opacity: 0, duration: 0.4 }, 0.5)
    cleanupFns.push(() => {
      heatTl.scrollTrigger?.kill()
      heatTl.kill()
    })
  }

  // ===== 阶段4: 涅槃闪光 =====
  if (flashRef.value) {
    gsap.set(flashRef.value, { opacity: 0 })
    const flashTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 25%',
        end: 'top 10%',
        scrub: 0.5,
      },
    })
    flashTl.to(flashRef.value, { opacity: 0.9, duration: 0.15 }, 0)
    flashTl.to(flashRef.value, { opacity: 0, duration: 0.5 }, 0.15)
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
.phoenix-rise-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0505;
}
.pr-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  .pr-base-img { width: 100%; height: 100%; object-fit: cover; }
}
.pr-ash-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
}
.pr-ash {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity, filter;
  .pr-ash-inner {
    position: absolute;
    overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; }
  }
  .pr-ember {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255, 140, 50, 0.7);
    box-shadow:
      inset 0 0 8px rgba(255, 100, 30, 0.4),
      0 0 12px rgba(255, 80, 20, 0.35),
      0 0 24px rgba(255, 60, 10, 0.15);
    pointer-events: none;
  }
}
.pr-fire-layer {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}
.pr-flame {
  position: absolute;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  will-change: transform, opacity;
}
.pr-flame:nth-child(odd) {
  background: radial-gradient(ellipse, rgba(255, 180, 50, 0.9) 0%, rgba(255, 80, 20, 0.5) 50%, transparent 70%);
}
.pr-flame:nth-child(even) {
  background: radial-gradient(ellipse, rgba(255, 220, 100, 0.8) 0%, rgba(255, 120, 40, 0.4) 50%, transparent 70%);
}
.pr-flame:nth-child(3n) {
  background: radial-gradient(ellipse, rgba(255, 100, 30, 0.9) 0%, rgba(200, 40, 10, 0.4) 50%, transparent 70%);
}
.pr-heat-distort {
  position: absolute;
  inset: 0;
  z-index: 12;
  background: linear-gradient(
    0deg,
    rgba(255, 100, 30, 0.08) 0%,
    rgba(255, 180, 80, 0.05) 30%,
    transparent 60%
  );
  pointer-events: none;
  mix-blend-mode: overlay;
}
.pr-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at 50% 70%,
    rgba(255, 220, 150, 0.95) 0%,
    rgba(255, 140, 50, 0.5) 25%,
    rgba(255, 80, 20, 0.15) 50%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

