<template>
  <section ref="parentRef" class="kaleidoscope-container">
    <div class="ks-base-layer">
      <img :src="imageUrl" alt="" class="ks-base-img" />
    </div>
    <div ref="petalLayerRef" class="ks-petal-layer">
      <div
        v-for="(petal, index) in 6"
        :key="index"
        :ref="(el) => setPetalRef(el, index)"
        class="ks-petal"
        :style="{ '--petal-angle': `${index * 60}deg` }"
      >
        <div class="ks-petal-img-wrap">
          <img :src="imageUrl" alt="" class="ks-petal-img" />
        </div>
        <div class="ks-petal-mirror">
          <img :src="imageUrl" alt="" class="ks-petal-img mirrored" />
        </div>
        <div class="ks-petal-edge"></div>
      </div>
    </div>
    <div ref="centerRef" class="ks-center">
      <div class="ks-center-ring"></div>
      <div class="ks-center-dot"></div>
    </div>
    <div ref="hueBgRef" class="ks-hue-bg"></div>
    <div ref="flashRef" class="ks-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const petalLayerRef = ref<HTMLElement | null>(null)
const centerRef = ref<HTMLElement | null>(null)
const hueBgRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const petalRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80'

const setPetalRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) {
    petalRefs[i] = (el as any).$el || (el as HTMLElement)
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

  // 初始状态：花瓣展开 + 旋转
  petalRefs.forEach((petal, i) => {
    if (!petal) {
      return
    }
    gsap.set(petal, {
      rotation: i * 60 + 120,
      scale: 0.4,
      opacity: 0,
      transformOrigin: 'center center',
      filter: 'blur(4px) hue-rotate(0deg)',
    })
    const edge = petal.querySelector('.ks-petal-edge') as HTMLElement
    if (edge) {
      gsap.set(edge, { opacity: 0 })
    }
  })

  if (centerRef.value) {
    gsap.set(centerRef.value, { opacity: 0, scale: 0, rotation: -180 })
  }
  if (hueBgRef.value) {
    gsap.set(hueBgRef.value, { opacity: 0 })
  }
  if (flashRef.value) {
    gsap.set(flashRef.value, { opacity: 0 })
  }

  // ===== 阶段1: 万花筒旋转展开 =====
  const openTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.8,
    },
  })

  // 色彩背景
  if (hueBgRef.value) {
    openTl.to(hueBgRef.value, {
      opacity: 0.3,
      duration: 0.3,
    }, 0)
  }

  // 中心旋入
  if (centerRef.value) {
    openTl.to(centerRef.value, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'back.out(1.5)',
    }, 0)
  }

  // 花瓣逐片旋转归位
  petalRefs.forEach((petal, i) => {
    if (!petal) {
      return
    }
    const delay = i * 0.06

    openTl.to(petal, {
      rotation: i * 60,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px) hue-rotate(0deg)',
      duration: 0.5,
      ease: 'expo.out',
    }, delay)

    // 棱镜边缘闪光
    const edge = petal.querySelector('.ks-petal-edge') as HTMLElement
    if (edge) {
      openTl.to(edge, { opacity: 1, duration: 0.08 }, delay + 0.3)
      openTl.to(edge, { opacity: 0, duration: 0.2 }, delay + 0.38)
    }
  })

  // 色彩背景消退
  if (hueBgRef.value) {
    openTl.to(hueBgRef.value, {
      opacity: 0,
      duration: 0.3,
    }, 0.6)
  }

  // 中心消退
  if (centerRef.value) {
    openTl.to(centerRef.value, {
      opacity: 0,
      scale: 1.5,
      duration: 0.2,
    }, 0.7)
  }

  cleanupFns.push(() => {
    openTl.scrollTrigger?.kill()
    openTl.kill()
  })

  // ===== 阶段2: 合成闪光 =====
  if (flashRef.value) {
    const flashTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 25%',
        end: 'top 10%',
        scrub: 0.5,
      },
    })
    flashTl.to(flashRef.value, { opacity: 0.7, duration: 0.15 }, 0)
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
.kaleidoscope-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #08060e;
}

.ks-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .ks-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.ks-petal-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.ks-petal {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 50vw;
  height: 50vh;
  transform-origin: 0% 50%;
  transform: rotate(calc(var(--petal-angle)));
  will-change: transform, opacity, filter;
  clip-path: polygon(0% 50%, 100% 0%, 100% 100%);
  overflow: hidden;

  .ks-petal-img-wrap {
    position: absolute;
    inset: 0;
    overflow: hidden;

    .ks-petal-img {
      position: absolute;
      width: 200%;
      height: 200%;
      left: -50%;
      top: -50%;
      object-fit: cover;
    }
  }

  .ks-petal-mirror {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.5;
    mix-blend-mode: screen;

    .mirrored {
      position: absolute;
      width: 200%;
      height: 200%;
      left: -50%;
      top: -50%;
      object-fit: cover;
      transform: scaleY(-1);
    }
  }

  .ks-petal-edge {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255, 200, 255, 0.5);
    box-shadow:
      inset 0 0 10px rgba(200, 150, 255, 0.3),
      0 0 15px rgba(200, 150, 255, 0.2);
    pointer-events: none;
  }
}

.ks-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  z-index: 15;
  pointer-events: none;

  .ks-center-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid rgba(255, 200, 255, 0.5);
    animation: ks-spin 3s linear infinite;
  }

  .ks-center-dot {
    position: absolute;
    inset: 25px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 220, 255, 0.9) 0%,
      rgba(200, 150, 255, 0.5) 50%,
      transparent 80%
    );
  }
}

@keyframes ks-spin {
  to {
    transform: rotate(360deg);
  }
}

.ks-hue-bg {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: conic-gradient(
    from 0deg at 50% 50%,
    rgba(255, 100, 100, 0.15),
    rgba(255, 255, 100, 0.15),
    rgba(100, 255, 100, 0.15),
    rgba(100, 255, 255, 0.15),
    rgba(100, 100, 255, 0.15),
    rgba(255, 100, 255, 0.15),
    rgba(255, 100, 100, 0.15)
  );
  pointer-events: none;
}

.ks-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 220, 255, 0.9) 0%,
    rgba(200, 150, 255, 0.4) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

