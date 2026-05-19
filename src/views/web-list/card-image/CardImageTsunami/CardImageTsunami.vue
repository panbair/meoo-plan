<template>
  <section ref="parentRef" class="tsunami-container">
    <div class="ts-base-layer">
      <img :src="imageUrl" alt="" class="ts-base-img" />
    </div>
    <div ref="waveLayerRef" class="ts-wave-layer">
      <div
        v-for="(wave, index) in waves"
        :key="index"
        :ref="(el) => setWaveRef(el, index)"
        class="ts-wave-strip"
        :style="wave.style"
      >
        <div class="ts-wave-img-wrap" :style="wave.imgWrapStyle">
          <img :src="imageUrl" alt="" class="ts-wave-img" />
        </div>
        <div class="ts-wave-foam" :style="wave.foamStyle"></div>
      </div>
    </div>
    <div ref="sprayRef" class="ts-spray">
      <div
        v-for="i in 30"
        :key="`drop-${i}`"
        :ref="(el) => setDropRef(el, i - 1)"
        class="ts-drop"
      ></div>
    </div>
    <div ref="mistRef" class="ts-mist"></div>
    <div ref="flashRef" class="ts-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const waveLayerRef = ref<HTMLElement | null>(null)
const sprayRef = ref<HTMLElement | null>(null)
const mistRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const waveRefs: HTMLElement[] = []
const dropRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const WAVE_COUNT = 10
const imageUrl = 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80'

interface WaveStrip {
  style: Record<string, string>
  imgWrapStyle: Record<string, string>
  foamStyle: Record<string, string>
  waveY: number
  waveRot: number
  scaleY: number
  delay: number
}
const waves = reactive<WaveStrip[]>([])

let seed = 55555
const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
const randRange = (a: number, b: number) => a + random() * (b - a)

const initWaves = () => {
  waves.length = 0
  seed = 55555
  const stripH = 100 / WAVE_COUNT
  for (let i = 0; i < WAVE_COUNT; i++) {
    const topPos = i * stripH
    const distFromTop = i / (WAVE_COUNT - 1)
    // 上方的条纹翻涌幅度更大
    const amplitude = (1 - distFromTop) * 120 + 30
    waves.push({
      style: { top: `${topPos}%`, height: `${stripH + 0.5}%` },
      imgWrapStyle: { top: `-${topPos}%`, height: `${WAVE_COUNT * 100}%` },
      foamStyle: {
        background: `linear-gradient(180deg, rgba(200,240,255,${0.15 + (1 - distFromTop) * 0.2}) 0%, transparent 100%)`,
      },
      waveY: -amplitude + randRange(-20, 20),
      waveRot: randRange(-3, 3) * (1 - distFromTop),
      scaleY: 1 + (1 - distFromTop) * 0.3,
      delay: i * 0.04,
    })
  }
}

const setWaveRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) { waveRefs[i] = (el as any).$el || (el as HTMLElement) }
}
const setDropRef = (el: unknown, i: number) => {
  if (el) { dropRefs[i] = (el as any).$el || (el as HTMLElement) }
}

onMounted(() => {
  if (!parentRef.value) { return }
  initWaves()
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) { return }

  if (mistRef.value) { gsap.set(mistRef.value, { opacity: 0 }) }
  if (flashRef.value) { gsap.set(flashRef.value, { opacity: 0 }) }

  // 水滴初始
  dropRefs.filter(Boolean).forEach((d) => {
    gsap.set(d, {
      opacity: 0, scale: 0,
      x: randRange(-400, 400), y: randRange(-200, 100),
      width: randRange(3, 8), height: randRange(3, 8),
    })
  })

  // ===== 阶段1: 海浪翻涌（条纹散开）→ 平复归位 =====
  const waveTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 15%',
      scrub: 1.8,
    },
  })

  waveRefs.forEach((wave, idx) => {
    if (!wave) { return }
    const d = waves[idx]
    if (!d) { return }
    gsap.set(wave, {
      y: d.waveY, rotation: d.waveRot, scaleY: d.scaleY,
      opacity: 0, filter: 'blur(3px)',
    })
    const foam = wave.querySelector('.ts-wave-foam') as HTMLElement
    if (foam) { gsap.set(foam, { opacity: 0 }) }

    waveTl.to(wave, {
      y: 0, rotation: 0, scaleY: 1, opacity: 1,
      filter: 'blur(0px)', duration: 0.6, ease: 'expo.out',
    }, d.delay)

    if (foam) {
      waveTl.to(foam, { opacity: 1, duration: 0.1 }, d.delay + 0.1)
      waveTl.to(foam, { opacity: 0, duration: 0.3 }, d.delay + 0.3)
    }
  })

  cleanupFns.push(() => { waveTl.scrollTrigger?.kill(); waveTl.kill() })

  // ===== 阶段2: 水花飞溅 =====
  const sprayTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 70%',
      end: 'top 30%',
      scrub: 1.2,
    },
  })

  dropRefs.filter(Boolean).forEach((d, i) => {
    sprayTl.to(d, {
      opacity: 0.6 + random() * 0.4, scale: 1,
      y: randRange(-300, -100), duration: 0.4, ease: 'power1.out',
    }, i * 0.02)
    sprayTl.to(d, {
      opacity: 0, scale: 0.3, y: '+=60',
      duration: 0.3,
    }, i * 0.02 + 0.35)
  })

  cleanupFns.push(() => { sprayTl.scrollTrigger?.kill(); sprayTl.kill() })

  // ===== 阶段3: 雾气弥漫 =====
  if (mistRef.value) {
    const mistTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 65%',
        end: 'top 20%',
        scrub: 1.5,
      },
    })
    mistTl.to(mistRef.value, { opacity: 0.35, duration: 0.4 }, 0)
    mistTl.to(mistRef.value, { opacity: 0, duration: 0.5 }, 0.5)
    cleanupFns.push(() => { mistTl.scrollTrigger?.kill(); mistTl.kill() })
  }

  // ===== 阶段4: 合成闪光 =====
  if (flashRef.value) {
    const flashTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 20%',
        end: 'top 5%',
        scrub: 0.5,
      },
    })
    flashTl.to(flashRef.value, { opacity: 0.6, duration: 0.15 }, 0)
    flashTl.to(flashRef.value, { opacity: 0, duration: 0.5 }, 0.15)
    cleanupFns.push(() => { flashTl.scrollTrigger?.kill(); flashTl.kill() })
  }
}

onUnmounted(() => { cleanupFns.forEach((fn) => fn()) })
</script>

<style lang="scss" scoped>
.tsunami-container {
  position: relative;
  width: 100vw; height: 100vh;
  overflow: hidden; background: #040810;
}
.ts-base-layer {
  position: absolute; inset: 0; z-index: 1;
  .ts-base-img { width: 100%; height: 100%; object-fit: cover; }
}
.ts-wave-layer {
  position: absolute; inset: 0; z-index: 10;
}
.ts-wave-strip {
  position: absolute; left: 0; width: 100%;
  overflow: hidden;
  will-change: transform, opacity, filter;
  .ts-wave-img-wrap {
    position: absolute; left: 0; width: 100%; overflow: hidden;
    .ts-wave-img { width: 100%; height: 100%; object-fit: cover; }
  }
  .ts-wave-foam {
    position: absolute; inset: 0;
    pointer-events: none; z-index: 2;
  }
}
.ts-spray {
  position: absolute; inset: 0; z-index: 12;
  pointer-events: none;
}
.ts-drop {
  position: absolute; left: 50%; top: 50%;
  border-radius: 50%;
  background: rgba(200, 240, 255, 0.7);
  box-shadow: 0 0 6px rgba(180, 230, 255, 0.4);
  will-change: transform, opacity;
}
.ts-mist {
  position: absolute; inset: 0; z-index: 8;
  background: linear-gradient(0deg,
    rgba(180, 220, 240, 0.2) 0%,
    rgba(180, 220, 240, 0.1) 30%,
    transparent 60%
  );
  pointer-events: none;
}
.ts-flash {
  position: absolute; inset: 0; z-index: 20;
  background: radial-gradient(ellipse at 50% 30%,
    rgba(200, 240, 255, 0.9) 0%,
    rgba(150, 210, 240, 0.4) 30%,
    transparent 70%
  );
  pointer-events: none; mix-blend-mode: screen;
}
</style>

