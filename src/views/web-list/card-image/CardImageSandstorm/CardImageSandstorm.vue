<template>
  <section ref="parentRef" class="sandstorm-container">
    <div class="ss-base-layer">
      <img :src="imageUrl" alt="" class="ss-base-img" />
    </div>
    <div ref="grainLayerRef" class="ss-grain-layer">
      <div
        v-for="(grain, index) in grains"
        :key="index"
        :ref="(el) => setGrainRef(el, index)"
        class="ss-grain"
        :style="grain.style"
      >
        <div class="ss-grain-inner" :style="grain.innerStyle">
          <img :src="imageUrl" alt="" />
        </div>
      </div>
    </div>
    <div ref="dustLayerRef" class="ss-dust-layer">
      <div
        v-for="i in 60"
        :key="`dust-${i}`"
        :ref="(el) => setDustRef(el, i - 1)"
        class="ss-dust"
      ></div>
    </div>
    <div ref="hazeRef" class="ss-haze"></div>
    <div ref="sunRef" class="ss-sun"></div>
    <div ref="flashRef" class="ss-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const grainLayerRef = ref<HTMLElement | null>(null)
const dustLayerRef = ref<HTMLElement | null>(null)
const hazeRef = ref<HTMLElement | null>(null)
const sunRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const grainRefs: HTMLElement[] = []
const dustRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const COLS = 8
const ROWS = 6
const imageUrl = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&q=80'

interface Grain {
  style: Record<string, string>
  innerStyle: Record<string, string>
  driftX: number
  driftY: number
  rot: number
  blur: number
  delay: number
}
const grains = reactive<Grain[]>([])

let seed = 24680
const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
const randRange = (a: number, b: number) => a + random() * (b - a)

const initGrains = () => {
  grains.length = 0
  seed = 24680
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellW = 100 / COLS
      const cellH = 100 / ROWS
      // 沙暴从右向左侵蚀：右侧碎片偏移最大
      const edgeFactor = c / (COLS - 1)
      grains.push({
        style: {
          left: `${c * cellW}%`, top: `${r * cellH}%`,
          width: `${cellW}%`, height: `${cellH}%`,
        },
        innerStyle: {
          width: `${COLS * 100}%`, height: `${ROWS * 100}%`,
          left: `${-c * 100}%`, top: `${-r * 100}%`,
        },
        driftX: 80 + edgeFactor * 150 + randRange(-20, 40),
        driftY: randRange(-40, 40),
        rot: randRange(-15, 15),
        blur: 2 + edgeFactor * 6,
        delay: edgeFactor * 0.12 + randRange(0, 0.04),
      })
    }
  }
}

const setGrainRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) { grainRefs[i] = (el as any).$el || (el as HTMLElement) }
}
const setDustRef = (el: unknown, i: number) => {
  if (el) { dustRefs[i] = (el as any).$el || (el as HTMLElement) }
}

onMounted(() => {
  if (!parentRef.value) { return }
  initGrains()
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) { return }

  if (hazeRef.value) { gsap.set(hazeRef.value, { opacity: 0 }) }
  if (sunRef.value) { gsap.set(sunRef.value, { opacity: 0, scale: 0.5 }) }
  if (flashRef.value) { gsap.set(flashRef.value, { opacity: 0 }) }

  // 沙尘粒子初始
  dustRefs.filter(Boolean).forEach((d) => {
    const size = 2 + random() * 4
    gsap.set(d, {
      opacity: 0, scale: 0,
      width: size, height: size,
      left: `${random() * 120 - 10}%`,
      top: `${random() * 100}%`,
    })
  })

  // ===== 阶段1: 沙暴来袭 — 沙尘粒子飞舞 =====
  const dustTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 82%',
      end: 'top 35%',
      scrub: 1.5,
    },
  })

  dustRefs.filter(Boolean).forEach((d, i) => {
    const delay = i * 0.01
    dustTl.to(d, {
      opacity: 0.4 + random() * 0.4, scale: 1,
      x: -(100 + random() * 200), duration: 0.5, ease: 'none',
    }, delay)
    dustTl.to(d, {
      opacity: 0, x: '-=100', duration: 0.3,
    }, delay + 0.45)
  })

  // 沙尘雾霾
  if (hazeRef.value) {
    dustTl.to(hazeRef.value, { opacity: 0.4, duration: 0.4 }, 0)
    dustTl.to(hazeRef.value, { opacity: 0, duration: 0.4 }, 0.5)
  }

  // 暴风中的太阳
  if (sunRef.value) {
    dustTl.to(sunRef.value, { opacity: 0.6, scale: 1, duration: 0.3, ease: 'power2.out' }, 0.1)
    dustTl.to(sunRef.value, { opacity: 0, scale: 1.2, duration: 0.3 }, 0.6)
  }

  cleanupFns.push(() => { dustTl.scrollTrigger?.kill(); dustTl.kill() })

  // ===== 阶段2: 碎片逆风归位 =====
  const grainTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 60%',
      end: 'top 10%',
      scrub: 1.8,
    },
  })

  grainRefs.forEach((grain, idx) => {
    if (!grain) { return }
    const d = grains[idx]
    if (!d) { return }
    gsap.set(grain, {
      x: d.driftX, y: d.driftY, rotation: d.rot,
      opacity: 0, filter: `blur(${d.blur}px) sepia(0.3)`,
    })

    grainTl.to(grain, {
      x: 0, y: 0, rotation: 0, opacity: 1,
      filter: 'blur(0px) sepia(0)', duration: 0.6, ease: 'expo.out',
    }, d.delay)
  })

  cleanupFns.push(() => { grainTl.scrollTrigger?.kill(); grainTl.kill() })

  // ===== 阶段3: 合成闪光 =====
  if (flashRef.value) {
    const flashTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 15%',
        end: 'top 0%',
        scrub: 0.5,
      },
    })
    flashTl.to(flashRef.value, { opacity: 0.7, duration: 0.15 }, 0)
    flashTl.to(flashRef.value, { opacity: 0, duration: 0.5 }, 0.15)
    cleanupFns.push(() => { flashTl.scrollTrigger?.kill(); flashTl.kill() })
  }
}

onUnmounted(() => { cleanupFns.forEach((fn) => fn()) })
</script>

<style lang="scss" scoped>
.sandstorm-container {
  position: relative;
  width: 100vw; height: 100vh;
  overflow: hidden; background: #0c0806;
}
.ss-base-layer {
  position: absolute; inset: 0; z-index: 1;
  .ss-base-img { width: 100%; height: 100%; object-fit: cover; }
}
.ss-grain-layer {
  position: absolute; inset: 0; z-index: 10;
}
.ss-grain {
  position: absolute; overflow: hidden;
  will-change: transform, opacity, filter;
  .ss-grain-inner {
    position: absolute; overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; }
  }
}
.ss-dust-layer {
  position: absolute; inset: 0; z-index: 8;
  pointer-events: none;
}
.ss-dust {
  position: absolute; border-radius: 50%;
  will-change: transform, opacity;
}
.ss-dust:nth-child(odd) {
  background: rgba(220, 180, 120, 0.7);
  box-shadow: 0 0 4px rgba(200, 160, 100, 0.3);
}
.ss-dust:nth-child(even) {
  background: rgba(240, 200, 140, 0.6);
  box-shadow: 0 0 4px rgba(230, 190, 130, 0.3);
}
.ss-dust:nth-child(3n) {
  background: rgba(200, 160, 100, 0.8);
  box-shadow: 0 0 6px rgba(180, 140, 80, 0.4);
}
.ss-haze {
  position: absolute; inset: 0; z-index: 6;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(200, 160, 100, 0.15) 30%,
    rgba(220, 180, 120, 0.2) 50%,
    rgba(200, 160, 100, 0.15) 70%,
    transparent 100%
  );
  pointer-events: none;
}
.ss-sun {
  position: absolute;
  right: 10%; top: 15%;
  width: 100px; height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(255, 220, 150, 0.8) 0%,
    rgba(255, 180, 100, 0.4) 40%,
    transparent 70%
  );
  box-shadow: 0 0 60px rgba(255, 200, 120, 0.3);
  z-index: 5; pointer-events: none;
}
.ss-flash {
  position: absolute; inset: 0; z-index: 20;
  background: radial-gradient(ellipse at 70% 30%,
    rgba(255, 230, 180, 0.9) 0%,
    rgba(255, 200, 130, 0.4) 30%,
    transparent 70%
  );
  pointer-events: none; mix-blend-mode: screen;
}
</style>

