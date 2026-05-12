<template>
  <div class="card-curtain" ref="parentRef">
    <div class="curtain-bg">
      <div class="bg-gradient"></div>
      <div class="bg-particles"></div>
    </div>

    <div class="curtain-container">
      <!-- 主画面 -->
      <div ref="frameRef" class="curtain-frame">
        <img
          ref="mainImgRef"
          class="main-image"
          src="https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80"
          alt="Light Curtain"
        />

        <!-- 冷光镶边 -->
        <div ref="edgeRef" class="curtain-edge"></div>
      </div>

      <!-- 上光幕 -->
      <div ref="topCurtainRef" class="curtain curtain-top">
        <div ref="topParticlesRef" class="curtain-particles"></div>
        <div ref="topLineRef" class="curtain-guide-line top-line"></div>
      </div>

      <!-- 下光幕 -->
      <div ref="bottomCurtainRef" class="curtain curtain-bottom">
        <div ref="bottomParticlesRef" class="curtain-particles"></div>
        <div ref="bottomLineRef" class="curtain-guide-line bottom-line"></div>
      </div>

      <!-- 中央柔晕 -->
      <div ref="centerGlowRef" class="center-glow"></div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="curtain-title">
      <h2>Light Curtain</h2>
      <p>光幕裁切 · 商务启幕</p>
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

const parentRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const mainImgRef = ref<HTMLImageElement | null>(null)
const topCurtainRef = ref<HTMLElement | null>(null)
const bottomCurtainRef = ref<HTMLElement | null>(null)
const topParticlesRef = ref<HTMLElement | null>(null)
const bottomParticlesRef = ref<HTMLElement | null>(null)
const topLineRef = ref<HTMLElement | null>(null)
const bottomLineRef = ref<HTMLElement | null>(null)
const centerGlowRef = ref<HTMLElement | null>(null)
const edgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (
    !parentRef.value ||
    !frameRef.value ||
    !mainImgRef.value ||
    !topCurtainRef.value ||
    !bottomCurtainRef.value ||
    !topParticlesRef.value ||
    !bottomParticlesRef.value ||
    !topLineRef.value ||
    !bottomLineRef.value ||
    !centerGlowRef.value ||
    !edgeRef.value ||
    !titleRef.value
  ) {
    return
  }

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

  // 中央柔晕呼吸
  tl.fromTo(
    centerGlowRef.value,
    { opacity: 0.6, scale: 0.8 },
    {
      opacity: 1,
      scale: 1.2,
      duration: 0.4,
      ease: 'sine.inOut',
      repeat: 1,
      yoyo: true,
    },
    0
  )

  // 金色引导线先行滑出
  tl.to(
    topLineRef.value,
    {
      y: '-100%',
      duration: 1.4,
      ease: 'power3.out',
    },
    0.1
  )
  tl.to(
    bottomLineRef.value,
    {
      y: '100%',
      duration: 1.4,
      ease: 'power3.out',
    },
    0.1
  )
  tl.to(
    [topLineRef.value, bottomLineRef.value],
    {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    },
    0.8
  )

  // 上光幕向上滑开
  tl.to(
    topCurtainRef.value,
    {
      y: '-100%',
      duration: 1.6,
      ease: 'power3.inOut',
    },
    0
  )
  tl.to(
    topCurtainRef.value,
    {
      opacity: 0,
      duration: 1.4,
      ease: 'power2.out',
    },
    0.2
  )

  // 下光幕向下滑开
  tl.to(
    bottomCurtainRef.value,
    {
      y: '100%',
      duration: 1.6,
      ease: 'power3.inOut',
    },
    0
  )
  tl.to(
    bottomCurtainRef.value,
    {
      opacity: 0,
      duration: 1.4,
      ease: 'power2.out',
    },
    0.2
  )

  // 光幕微粒消散
  tl.to(
    [topParticlesRef.value, bottomParticlesRef.value],
    {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
    },
    0
  )

  // 中央柔晕消失
  tl.to(
    centerGlowRef.value,
    {
      opacity: 0,
      scale: 2,
      duration: 1,
      ease: 'power2.in',
    },
    0.3
  )

  // 图片亮度提升
  tl.fromTo(
    mainImgRef.value,
    { filter: 'brightness(0.6) saturate(0.9)' },
    {
      filter: 'brightness(1) saturate(1)',
      duration: 1.4,
      ease: 'power2.out',
    },
    0.2
  )

  // 冷光镶边显现
  tl.fromTo(
    edgeRef.value,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    },
    1.4
  )

  // 标题淡入
  tl.fromTo(
    titleRef.value,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    },
    1.3
  )

  // 冷光镶边呼吸
  const edgeAnim = gsap.to(edgeRef.value, {
    opacity: 0.6,
    duration: 4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
  cleanupFns.push({
    revert: () => edgeAnim.kill(),
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert())
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.card-curtain {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0e14 0%, #0f1520 50%, #0a0e14 100%);
}

.curtain-bg {
  position: absolute;
  inset: 0;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200, 220, 255, 0.03) 0%, transparent 70%),
      linear-gradient(180deg, #0a0e14 0%, #141a24 50%, #0a0e14 100%);
  }

  .bg-particles {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(200, 220, 255, 0.02) 1px, transparent 1px),
      radial-gradient(circle at 80% 70%, rgba(200, 220, 255, 0.02) 1px, transparent 1px),
      radial-gradient(circle at 50% 50%, rgba(200, 220, 255, 0.015) 1px, transparent 1px);
    background-size: 60px 60px, 80px 80px, 100px 100px;
  }
}

.curtain-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  max-width: 1100px;
  height: 65vh;
  max-height: 700px;
}

.curtain-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6) saturate(0.9);
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
}

.curtain-edge {
  position: absolute;
  inset: 0;
  border-radius: 4px;
  pointer-events: none;
  box-shadow:
    inset 0 0 30px rgba(180, 200, 230, 0.15),
    inset 0 0 60px rgba(180, 200, 230, 0.08);
  opacity: 0;
}

.curtain {
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(220, 235, 255, 0.95) 0%,
    rgba(200, 220, 250, 0.9) 50%,
    rgba(180, 205, 245, 0.85) 100%
  );
  z-index: 10;
  overflow: hidden;
  backdrop-filter: blur(0px);

  &.curtain-top {
    top: 0;
    border-radius: 4px 4px 0 0;
    background: linear-gradient(
      180deg,
      rgba(240, 248, 255, 0.98) 0%,
      rgba(220, 235, 255, 0.92) 50%,
      rgba(200, 220, 250, 0.88) 100%
    );
  }

  &.curtain-bottom {
    bottom: 0;
    border-radius: 0 0 4px 4px;
    background: linear-gradient(
      0deg,
      rgba(240, 248, 255, 0.98) 0%,
      rgba(220, 235, 255, 0.92) 50%,
      rgba(200, 220, 250, 0.88) 100%
    );
  }
}

.curtain-particles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    radial-gradient(circle at 30% 60%, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
    radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.7) 1px, transparent 1px),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    radial-gradient(circle at 90% 30%, rgba(255, 255, 255, 0.6) 1px, transparent 1px);
  background-size: 40px 40px, 50px 50px, 35px 35px, 45px 45px, 55px 55px;
}

.curtain-guide-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(212, 175, 100, 1) 10%,
    rgba(232, 195, 120, 1) 50%,
    rgba(212, 175, 100, 1) 90%,
    transparent 100%
  );
  box-shadow:
    0 0 8px rgba(212, 175, 100, 0.8),
    0 0 15px rgba(212, 175, 100, 0.5),
    0 0 25px rgba(212, 175, 100, 0.3);

  &.top-line {
    bottom: 0;
  }

  &.bottom-line {
    top: 0;
  }
}

.center-glow {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 60px;
  transform: translateY(-50%);
  background: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(220, 235, 255, 0.2) 50%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 5;
  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.3),
    0 0 40px rgba(220, 235, 255, 0.2);
}

.curtain-title {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  opacity: 0;

  h2 {
    font-family: 'Montserrat', 'Arial', sans-serif;
    font-size: clamp(24px, 4vw, 40px);
    font-weight: 600;
    color: #e8f0ff;
    margin: 0 0 10px;
    letter-spacing: 8px;
    text-transform: uppercase;
    text-shadow: 0 2px 20px rgba(180, 200, 240, 0.4);
  }

  p {
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: clamp(12px, 2vw, 16px);
    color: rgba(200, 215, 240, 0.7);
    margin: 0;
    letter-spacing: 6px;
  }
}
</style>
