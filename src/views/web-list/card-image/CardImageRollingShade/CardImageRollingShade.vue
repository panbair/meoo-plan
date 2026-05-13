<template>
  <section ref="parentRef" class="rolling-shade-container">
    <!-- 底层图片 -->
    <div class="image-layer">
      <img :src="imageUrl" alt="背景图" class="main-image" />
    </div>

    <!-- 卷帘层 -->
    <div ref="shadeLayerRef" class="shade-layer">
      <div
        v-for="(slat, index) in slats"
        :key="index"
        :ref="(el) => setSlatRef(el, index)"
        class="slat"
        :class="{ 'is-even': index % 2 === 0 }"
        :style="slat.style"
      >
        <div class="slat-surface"></div>
        <div class="slat-highlight"></div>
      </div>
    </div>

    <!-- 底部渐变遮罩 -->
    <div class="bottom-fade"></div>

    <!-- 顶部渐变遮罩 -->
    <div class="top-fade"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const shadeLayerRef = ref<HTMLElement | null>(null)

const slatRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const SLAT_COUNT = 8

// 选一张色彩丰富的风景图
const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

interface Slat {
  style: Record<string, string>
}

const slats = reactive<Slat[]>([])

const initSlats = () => {
  slats.length = 0

  for (let i = 0; i < SLAT_COUNT; i++) {
    const top = (i / SLAT_COUNT) * 100
    const height = 100 / SLAT_COUNT

    slats.push({
      style: {
        '--slat-top': `${top}%`,
        '--slat-height': `${height}%`,
        '--slat-index': `${i}`,
      },
    })
  }
}

const setSlatRef = (el: Element | null, index: number) => {
  if (el) slatRefs[index] = el as HTMLElement
}

onMounted(() => {
  if (!parentRef.value) return
  initSlats()
  requestAnimationFrame(() => setupAnimations())
})

const setupAnimations = () => {
  if (!parentRef.value || !shadeLayerRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'center center',
      scrub: 1.5,
    },
  })

  // 卷帘依次收起（从上往下）
  slatRefs.forEach((slat, index) => {
    if (!slat) return

    // 初始状态：卷帘关闭（向上收起超出视口）
    gsap.set(slat, {
      yPercent: -100,
      opacity: 1,
    })

    // 依次收起（间隔0.08s）
    tl.to(
      slat,
      {
        yPercent: -200,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut',
      },
      index * 0.08
    )
  })

  // 底部渐变遮罩淡出
  if (parentRef.value) {
    const bottomFade = parentRef.value.querySelector('.bottom-fade') as HTMLElement
    if (bottomFade) {
      tl.to(
        bottomFade,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.3
      )
    }
  }

  // 顶部渐变遮罩淡出
  if (parentRef.value) {
    const topFade = parentRef.value.querySelector('.top-fade') as HTMLElement
    if (topFade) {
      tl.to(
        topFade,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.5
      )
    }
  }

  // 卷帘层整体淡出
  tl.to(
    shadeLayerRef.value,
    {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    },
    SLAT_COUNT * 0.08 + 0.2
  )

  cleanupFns.push(() => tl.scrollTrigger?.kill())
  cleanupFns.push(() => tl.kill())
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
  ScrollTrigger.getAll().forEach((st) => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.rolling-shade-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0d1b2a;
}

// 底层图片
.image-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 卷帘层
.shade-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  perspective: 1500px;
}

// 单条帘片
.slat {
  position: absolute;
  top: var(--slat-top);
  left: 0;
  width: 100%;
  height: var(--slat-height);
  transform-style: preserve-3d;
  will-change: transform, opacity;
  backface-visibility: hidden;

  // 帘片面
  .slat-surface {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      #1a1a2e 0%,
      #16213e 30%,
      #0f3460 70%,
      #1a1a2e 100%
    );
    border-bottom: 1px solid rgba(255, 180, 100, 0.15);
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 200, 150, 0.1);
  }

  // 帘片高光
  .slat-highlight {
    position: absolute;
    top: 2px;
    left: 5%;
    right: 5%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 200, 150, 0.3) 20%,
      rgba(255, 220, 180, 0.5) 50%,
      rgba(255, 200, 150, 0.3) 80%,
      transparent 100%
    );
    filter: blur(0.5px);
  }
}

// 偶数帘片轻微颜色变化
.slat.is-even .slat-surface {
  background: linear-gradient(
    180deg,
    #16213e 0%,
    #1a2744 30%,
    #1a3a5c 70%,
    #16213e 100%
  );
}

// 底部渐变
.bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20%;
  background: linear-gradient(to top, rgba(13, 27, 42, 0.8), transparent);
  z-index: 15;
  pointer-events: none;
}

// 顶部渐变
.top-fade {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 15%;
  background: linear-gradient(to bottom, rgba(13, 27, 42, 0.7), transparent);
  z-index: 15;
  pointer-events: none;
}
</style>
