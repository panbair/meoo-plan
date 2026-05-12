<template>
  <section ref="parentRef" class="stripes">
    <div ref="containerRef" class="stripes__container">
      <!-- 条带 -->
      <div
        v-for="(_, index) in stripes"
        :key="`stripe-${index}`"
        :ref="el => stripeRefs[index] = el as HTMLElement"
        class="stripes__stripe"
      >
        <img
          :src="`${imageUrl}&crop=entropy&cs=tinysrgb&fit=crop&h=800&w=${Math.round(windowWidth / stripeCount)}&x=${Math.round((windowWidth / stripeCount) * index)}`"
          alt="Strip"
          class="stripes__img"
          draggable="false"
        />
        <div class="stripes__border" />
      </div>
    </div>

    <!-- 光缝 -->
    <div ref="seamsRef" class="stripes__seams">
      <div
        v-for="(_, index) in seamCount"
        :key="`seam-${index}`"
        class="stripes__seam"
        :style="{ left: `${((index + 1) / stripeCount) * 100}%` }"
      />
    </div>

    <!-- 进度 -->
    <div ref="progressRef" class="stripes__progress">
      <div ref="progressBarRef" class="stripes__progress-bar" />
      <span ref="progressTextRef" class="stripes__progress-text">00/08 LOADED</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const imageUrl = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80'
const stripeCount = 8
const seamCount = stripeCount - 1

const parentRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const stripeRefs = ref<(HTMLElement | null)[]>([])
const seamsRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const progressTextRef = ref<HTMLElement | null>(null)

const windowWidth = ref(1920)
const stripes = ref<number[]>(Array.from({ length: stripeCount }, (_, i) => i))

let cleanupFns: (() => void)[] = []
let mainTimeline: gsap.core.Timeline | null = null

onMounted(() => {
  windowWidth.value = window.innerWidth

  const handleResize = () => {
    windowWidth.value = window.innerWidth
  }
  window.addEventListener('resize', handleResize)
  cleanupFns.push(() => window.removeEventListener('resize', handleResize))

  const stripeEls = stripeRefs.value.filter(Boolean) as HTMLElement[]
  if (!stripeEls.length || !parentRef.value) return

  // 初始状态 - 条带隐藏在左侧
  gsap.set(stripeEls, {
    x: '-100%',
    opacity: 0,
  })
  gsap.set(progressRef.value, { opacity: 0 })

  // 主入场 Timeline
  mainTimeline = gsap.timeline({
    paused: true,
  })

  // 条带依次滑入
  stripeEls.forEach((stripe, index) => {
    mainTimeline.to(
      stripe,
      {
        x: '0%',
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
      },
      index * 0.08
    )
  })

  // 最后一个条带入场后的回弹
  stripeEls.forEach((stripe, index) => {
    mainTimeline.to(
      stripe,
      {
        x: '1%',
        duration: 0.1,
        ease: 'power2.out',
      },
      index * 0.08 + 0.6
    )
    mainTimeline.to(
      stripe,
      {
        x: '0%',
        duration: 0.2,
        ease: 'back.out(3)',
      },
      index * 0.08 + 0.7
    )
  })

  // 光缝亮起
  const seamEls = seamsRef.value?.querySelectorAll('.stripes__seam') as NodeListOf<HTMLElement>
  if (seamEls) {
    seamEls.forEach((seam, index) => {
      mainTimeline.to(
        seam,
        {
          opacity: 1,
          scaleY: 1,
          duration: 0.15,
          ease: 'power2.out',
        },
        0.6 + index * 0.03
      )
      mainTimeline.to(
        seam,
        {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
        },
        0.75 + index * 0.03
      )
    })
  }

  // 进度条
  mainTimeline.to(
    progressRef.value,
    { opacity: 1, duration: 0.3 },
    0.3
  )

  // ScrollTrigger 入场触发
  const entryTrigger = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 80%',
    onEnter: () => {
      mainTimeline?.play()
    },
  })
  cleanupFns.push(() => entryTrigger.kill())

  // 滚动控制 - 条带左右移动
  const scrollTl = gsap.timeline()

  stripeEls.forEach((stripe, index) => {
    const direction = index % 2 === 0 ? 1 : -1
    const distance = 20 + (index % 3) * 10

    scrollTl.to(
      stripe,
      {
        x: direction * distance,
        duration: 1,
        ease: 'power1.inOut',
      },
      0
    )
  })

  const scrollTrigger = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1.5,
    animation: scrollTl,
    onUpdate: (self) => {
      // 更新进度
      if (progressTextRef.value) {
        const loaded = Math.min(Math.ceil(self.progress * stripeCount), stripeCount)
        progressTextRef.value.textContent = `${String(loaded).padStart(2, '0')}/${stripeCount} LOADED`
      }
      if (progressBarRef.value) {
        gsap.set(progressBarRef.value, { scaleX: self.progress })
      }
    },
  })
  cleanupFns.push(() => scrollTrigger.kill())

  // 进度条初始化
  if (progressBarRef.value) {
    gsap.set(progressBarRef.value, { scaleX: 0, transformOrigin: 'left center' })
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  mainTimeline?.kill()
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === parentRef.value) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.stripes {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
  }

  &__stripe {
    flex: 1;
    height: 100%;
    overflow: hidden;
    position: relative;

    &:first-child {
      border-left: 1px solid rgba(255, 220, 150, 0.3);
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    filter: brightness(0.95) saturate(1.1);
  }

  &__border {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 220, 150, 0.6) 0%,
      rgba(255, 200, 100, 0.4) 50%,
      rgba(255, 220, 150, 0.6) 100%
    );
    box-shadow:
      0 0 6px rgba(255, 200, 100, 0.4),
      0 0 12px rgba(255, 180, 80, 0.2);
  }

  &__seams {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
  }

  &__seam {
    position: absolute;
    top: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 230, 150, 0.9) 0%,
      rgba(255, 200, 100, 0.7) 50%,
      rgba(255, 230, 150, 0.9) 100%
    );
    box-shadow:
      0 0 10px rgba(255, 220, 120, 0.8),
      0 0 20px rgba(255, 200, 80, 0.5),
      0 0 40px rgba(255, 180, 60, 0.3);
    transform-origin: top center;
    transform: scaleY(0);
    opacity: 0;
  }

  &__progress {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 20;
  }

  &__progress-bar {
    width: 200px;
    height: 3px;
    background: rgba(255, 220, 150, 0.2);
    border-radius: 2px;
    overflow: hidden;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, #ffd700, #ff8c00, #ffd700);
      border-radius: 2px;
      box-shadow: 0 0 10px #ffd700;
    }
  }

  &__progress-text {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    letter-spacing: 3px;
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
}

@media (max-width: 768px) {
  .stripes {
    &__progress {
      bottom: 20px;
    }

    &__progress-bar {
      width: 150px;
    }

    &__progress-text {
      font-size: 10px;
    }
  }
}
</style>
