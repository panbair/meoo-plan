<template>
  <div class="card-tungsten" ref="parentRef">
    <div class="tungsten-bg">
      <div class="bg-gradient"></div>
      <div class="bg-glow"></div>
    </div>

    <div class="tungsten-container">
      <!-- 主画面 -->
      <div ref="frameRef" class="tungsten-frame">
        <!-- 主图片层 -->
        <img
          ref="mainImgRef"
          class="main-image"
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80"
          alt="Tungsten Ignition"
        />

        <!-- 炫光层 -->
        <div ref="flareRef" class="tungsten-flare"></div>

        <!-- 余热辉晕 -->
        <div ref="afterglowRef" class="tungsten-afterglow"></div>
      </div>

      <!-- 灯丝装饰 -->
      <div class="filament-decoration">
        <svg viewBox="0 0 200 60" class="filament-svg">
          <path
            class="filament-path"
            d="M10,30 Q30,10 50,30 T90,30 T130,30 T170,30 T190,30"
            fill="none"
            stroke="rgba(255,220,150,0.3)"
            stroke-width="1"
          />
          <circle class="filament-glow" cx="100" cy="30" r="3" fill="rgba(255,220,150,0.5)" />
        </svg>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="tungsten-title">
      <h2>Tungsten Ignition</h2>
      <p>钨丝启辉 · 放映灯入场</p>
    </div>

    <!-- 装饰边框 -->
    <div class="tungsten-frame-ornament">
      <div class="ornament-line top"></div>
      <div class="ornament-line bottom"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  revert: () => void
}

const imageUrl = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const mainImgRef = ref<HTMLImageElement | null>(null)
const flareRef = ref<HTMLElement | null>(null)
const afterglowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (
    !parentRef.value ||
    !frameRef.value ||
    !mainImgRef.value ||
    !flareRef.value ||
    !afterglowRef.value ||
    !titleRef.value
  ) {
    return
  }

  // 初始状态设置
  gsap.set(frameRef.value, {
    scale: 0.1,
    opacity: 1,
    filter: 'blur(25px) brightness(2.5)',
  })
  gsap.set(mainImgRef.value, {
    filter: 'hue-rotate(30deg) saturate(1.3)',
  })
  gsap.set(flareRef.value, { opacity: 1, scale: 4 })
  gsap.set(afterglowRef.value, { opacity: 0 })
  gsap.set(titleRef.value, { opacity: 0, y: 20 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5,
    },
  })

  cleanupFns.push({
    revert: () => ScrollTrigger.getAll().forEach(t => t.kill()),
  })

  // 主画面膨胀
  tl.to(frameRef.value, {
    scale: 1,
    duration: 1.6,
    ease: 'power4.out',
  })

  // 模糊消退
  tl.to(
    frameRef.value,
    {
      filter: 'blur(0px) brightness(1)',
      duration: 1.5,
      ease: 'power3.out',
    },
    0
  )

  // 炫光收拢
  tl.to(
    flareRef.value,
    {
      opacity: 0,
      scale: 0.3,
      duration: 1.4,
      ease: 'power2.in',
    },
    0
  )

  // 色温游移 - 先去掉暖色，再微偏暖
  tl.to(
    mainImgRef.value,
    {
      filter: 'hue-rotate(0deg) saturate(1)',
      duration: 1.5,
      ease: 'power2.inOut',
    },
    0
  )

  // 频闪过冲 - 90%时触发
  tl.to(
    frameRef.value,
    {
      opacity: 0.7,
      duration: 0.05,
      ease: 'none',
    },
    1.4
  )
  tl.to(
    frameRef.value,
    {
      opacity: 1,
      duration: 0.05,
      ease: 'none',
    },
    1.45
  )
  tl.to(
    frameRef.value,
    {
      opacity: 0.85,
      duration: 0.05,
      ease: 'none',
    },
    1.5
  )
  tl.to(
    frameRef.value,
    {
      opacity: 1,
      duration: 0.1,
      ease: 'none',
    },
    1.55
  )

  // 对焦过冲 - 轻微模糊后回稳
  tl.to(
    frameRef.value,
    {
      filter: 'blur(2px) brightness(1.1)',
      duration: 0.1,
      ease: 'none',
    },
    1.35
  )
  tl.to(
    frameRef.value,
    {
      filter: 'blur(0px) brightness(1)',
      duration: 0.15,
      ease: 'power2.out',
    },
    1.45
  )

  // 余热辉晕显现
  tl.to(
    afterglowRef.value,
    {
      opacity: 0.15,
      duration: 0.5,
      ease: 'power2.out',
    },
    1.5
  )

  // 标题淡入
  tl.to(
    titleRef.value,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    },
    1.4
  )

  // 余热辉晕持续呼吸
  const glowAnim = gsap.to(afterglowRef.value, {
    opacity: 0.3,
    duration: 6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
  cleanupFns.push({
    revert: () => glowAnim.kill(),
  })

  // 灯丝发光动画
  const filamentAnim = gsap.to('.filament-glow', {
    opacity: 0.8,
    attr: { r: 5 },
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
  cleanupFns.push({
    revert: () => filamentAnim.kill(),
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert())
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.card-tungsten {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0c0806;
}

.tungsten-bg {
  position: absolute;
  inset: 0;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 30% 25% at 50% 50%, rgba(255, 200, 100, 0.08) 0%, transparent 70%),
      linear-gradient(180deg, #0c0806 0%, #140c08 50%, #0c0806 100%);
  }

  .bg-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255, 180, 80, 0.03) 0%, transparent 60%);
  }
}

.tungsten-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tungsten-frame {
  position: relative;
  width: 75vw;
  max-width: 1000px;
  height: 60vh;
  max-height: 600px;
  transform-origin: center;
  overflow: hidden;
  border-radius: 6px;
  box-shadow:
    0 0 80px rgba(255, 200, 100, 0.4),
    0 0 150px rgba(255, 180, 80, 0.2);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tungsten-flare {
  position: absolute;
  inset: -100%;
  background: radial-gradient(
    ellipse 30% 30% at 50% 50%,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 230, 180, 0.7) 20%,
    rgba(255, 180, 80, 0.4) 40%,
    transparent 60%
  );
  pointer-events: none;
  transform-origin: center;
}

.tungsten-afterglow {
  position: absolute;
  inset: -40px;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 220, 150, 0.2) 0%,
    rgba(255, 200, 100, 0.1) 40%,
    transparent 70%
  );
  border-radius: 10px;
}

.filament-decoration {
  margin-top: 30px;
  width: 200px;

  .filament-svg {
    width: 100%;
    height: auto;
  }
}

.tungsten-title {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  h2 {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 200;
    color: #ffeedd;
    margin: 0 0 10px;
    letter-spacing: 10px;
    text-transform: uppercase;
    text-shadow: 0 0 50px rgba(255, 200, 100, 0.5);
  }

  p {
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: clamp(12px, 2vw, 16px);
    color: rgba(255, 220, 150, 0.6);
    margin: 0;
    letter-spacing: 6px;
  }
}

.tungsten-frame-ornament {
  .ornament-line {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 200, 100, 0.3), transparent);

    &.top {
      top: 50px;
    }

    &.bottom {
      bottom: 50px;
    }
  }
}
</style>
