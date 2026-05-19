<template>
  <section ref="parentRef" class="frost-melt-container">
    <div class="fm-base-layer">
      <img :src="imageUrl" alt="" class="fm-base-img" />
    </div>
    <div ref="frostLayerRef" class="fm-frost-layer">
      <img :src="imageUrl" alt="" class="fm-frost-img" />
      <div class="fm-frost-overlay"></div>
    </div>
    <div class="fm-crystal-layer">
      <div
        v-for="i in 20"
        :key="`c-${i}`"
        :ref="(el) => setCrystalRef(el, i - 1)"
        class="fm-crystal"
      ></div>
    </div>
    <div class="fm-drop-layer">
      <div
        v-for="i in 25"
        :key="`d-${i}`"
        :ref="(el) => setDropRef(el, i - 1)"
        class="fm-drop"
      ></div>
    </div>
    <div ref="steamRef" class="fm-steam"></div>
    <div ref="flashRef" class="fm-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const frostLayerRef = ref<HTMLElement | null>(null)
const steamRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const crystalRefs: HTMLElement[] = []
const dropRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80'

let seed = 44455
const random = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}

const setCrystalRef = (el: unknown, i: number) => {
  if (el) {
    crystalRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}
const setDropRef = (el: unknown, i: number) => {
  if (el) {
    dropRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}

onMounted(() => {
  if (!parentRef.value) {
    return
  }
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) {
    return
  }

  gsap.set(frostLayerRef.value, { opacity: 1 })
  gsap.set(steamRef.value, { opacity: 0 })
  gsap.set(flashRef.value, { opacity: 0 })

  crystalRefs.filter(Boolean).forEach((c) => {
    const size = 4 + random() * 10
    gsap.set(c, {
      opacity: 0,
      scale: 0,
      left: `${random() * 100}%`,
      top: `${random() * 80}%`,
      width: size,
      height: size * 1.3,
      rotation: random() * 360,
    })
  })

  dropRefs.filter(Boolean).forEach((d) => {
    gsap.set(d, {
      opacity: 0,
      left: `${random() * 100}%`,
      top: `${10 + random() * 60}%`,
      width: 2 + random() * 3,
      height: 6 + random() * 10,
    })
  })

  const meltTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 10%',
      scrub: 1.8,
    },
  })

  crystalRefs.filter(Boolean).forEach((c, i) => {
    meltTl.to(c, { opacity: 0.7, scale: 1, duration: 0.1 }, i * 0.015)
    meltTl.to(c, {
      opacity: 0,
      y: 50 + random() * 100,
      rotation: `+=${random() * 180}`,
      scale: 0.3,
      duration: 0.3,
    }, i * 0.015 + 0.1)
  })

  meltTl.to(frostLayerRef.value, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
  }, 0.15)

  dropRefs.filter(Boolean).forEach((d, i) => {
    const delay = 0.1 + i * 0.015
    meltTl.to(d, { opacity: 0.6, duration: 0.08 }, delay)
    meltTl.to(d, {
      y: `+=${100 + random() * 200}`,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    }, delay + 0.08)
  })

  meltTl.to(steamRef.value, { opacity: 0.25, duration: 0.3 }, 0.2)
  meltTl.to(steamRef.value, { opacity: 0, y: -30, duration: 0.3 }, 0.55)

  meltTl.to(flashRef.value, { opacity: 0.4, duration: 0.08 }, 0.5)
  meltTl.to(flashRef.value, { opacity: 0, duration: 0.3 }, 0.58)

  cleanupFns.push(() => {
    meltTl.scrollTrigger?.kill()
    meltTl.kill()
  })
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.frost-melt-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #080a10;
}

.fm-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .fm-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.fm-frost-layer {
  position: absolute;
  inset: 0;
  z-index: 5;

  .fm-frost-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(1.3) contrast(0.8) saturate(0.3);
  }

  .fm-frost-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(180, 220, 255, 0.25) 0%,
      rgba(220, 245, 255, 0.2) 50%,
      rgba(180, 220, 255, 0.25) 100%
    );
    mix-blend-mode: overlay;
  }
}

.fm-crystal-layer {
  position: absolute;
  inset: 0;
  z-index: 12;
  pointer-events: none;
}

.fm-crystal {
  position: absolute;
  background: rgba(200, 240, 255, 0.6);
  clip-path: polygon(50% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%);
  will-change: transform, opacity;
}

.fm-drop-layer {
  position: absolute;
  inset: 0;
  z-index: 11;
  pointer-events: none;
}

.fm-drop {
  position: absolute;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: linear-gradient(180deg, rgba(200, 240, 255, 0.6), rgba(180, 230, 255, 0.3));
  will-change: transform, opacity;
}

.fm-steam {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 10%;
  height: 30%;
  z-index: 8;
  background: linear-gradient(0deg, rgba(200, 230, 255, 0.1), transparent);
  filter: blur(20px);
  pointer-events: none;
}

.fm-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at center,
    rgba(200, 240, 255, 0.8) 0%,
    rgba(180, 220, 255, 0.3) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

