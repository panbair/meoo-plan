<template>
  <div class="card-img-titanium" ref="parentRef">
    <!-- 背景层 -->
    <div class="background">
      <div class="grid-pattern"></div>
    </div>

    <!-- 主图片容器 -->
    <div class="image-wrapper" ref="wrapperRef">
      <img
        class="main-image"
        ref="mainImageRef"
        :src="imageUrl"
        alt="Titanium Gate"
      />

      <!-- 上闸门遮罩 -->
      <div class="gate gate-top" ref="topGateRef">
        <!-- 顶部高光线 -->
        <div class="edge-light top-light" ref="topLightRef"></div>
      </div>

      <!-- 下闸门遮罩 -->
      <div class="gate gate-bottom" ref="bottomGateRef">
        <!-- 底部高光线 -->
        <div class="edge-light bottom-light" ref="bottomLightRef"></div>
      </div>

      <!-- 中央光缝 -->
      <div class="center-gap" ref="centerGapRef"></div>

      <!-- 金属框投影 -->
      <div class="frame-shadow" ref="frameShadowRef"></div>
    </div>

    <!-- 标题 -->
    <div class="title-section" ref="titleRef">
      <h1 class="title">Titanium Gate</h1>
      <p class="subtitle">钛金启幕 · 商务陈列</p>
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

const imageUrl = 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLImageElement | null>(null)
const topGateRef = ref<HTMLElement | null>(null)
const bottomGateRef = ref<HTMLElement | null>(null)
const topLightRef = ref<HTMLElement | null>(null)
const bottomLightRef = ref<HTMLElement | null>(null)
const centerGapRef = ref<HTMLElement | null>(null)
const frameShadowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (
    !parentRef.value ||
    !topGateRef.value ||
    !bottomGateRef.value ||
    !mainImageRef.value ||
    !topLightRef.value ||
    !bottomLightRef.value ||
    !centerGapRef.value ||
    !frameShadowRef.value ||
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

  // 中央光缝呼吸动画
  tl.fromTo(
    centerGapRef.value,
    { scaleY: 0.5, opacity: 0.6 },
    {
      scaleY: 1.2,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut',
      repeat: 1,
      yoyo: true,
    },
    0
  )

  // 上闸门向上滑开
  tl.to(
    topGateRef.value,
    {
      y: '-100%',
      duration: 1.6,
      ease: 'power3.inOut',
    },
    0
  )

  // 下闸门向下滑开
  tl.to(
    bottomGateRef.value,
    {
      y: '100%',
      duration: 1.6,
      ease: 'power3.inOut',
    },
    0
  )

  // 顶部高光线渐隐
  tl.to(
    topLightRef.value,
    {
      opacity: 0,
      y: '-20px',
      duration: 1.4,
      ease: 'power2.out',
    },
    0
  )

  // 底部高光线渐隐
  tl.to(
    bottomLightRef.value,
    {
      opacity: 0,
      y: '20px',
      duration: 1.4,
      ease: 'power2.out',
    },
    0
  )

  // 中央光缝扩大消失
  tl.to(
    centerGapRef.value,
    {
      scaleY: 0,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.inOut',
    },
    0.2
  )

  // 图片亮度提升
  tl.fromTo(
    mainImageRef.value,
    { filter: 'brightness(0.7)' },
    {
      filter: 'brightness(1)',
      duration: 1.5,
      ease: 'power2.inOut',
    },
    0
  )

  // 金属框投影显现
  tl.fromTo(
    frameShadowRef.value,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    },
    1.2
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
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert())
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.card-img-titanium {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0f14 0%, #1a2530 50%, #0a0f14 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.background {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(
        rgba(80, 120, 160, 0.05) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        rgba(80, 120, 160, 0.05) 1px,
        transparent 1px
      );
    background-size: 40px 40px;
  }
}

.image-wrapper {
  position: relative;
  width: 80vw;
  height: 65vh;
  max-width: 1100px;
  max-height: 700px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
  border-radius: 2px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.gate {
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    135deg,
    #2a3540 0%,
    #3d4d5c 30%,
    #4a5a6a 50%,
    #3d4d5c 70%,
    #2a3540 100%
  );
  pointer-events: none;
  z-index: 5;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.03) 0%,
      transparent 30%,
      transparent 70%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0, 20, 40, 0.1) 2px,
      rgba(0, 20, 40, 0.1) 4px
    );
  }

  &.gate-top {
    top: 0;
    border-radius: 2px 2px 0 0;
    background: linear-gradient(
      180deg,
      #1a2530 0%,
      #2a3540 20%,
      #3d4d5c 50%,
      #2a3540 80%,
      #1a2530 100%
    );
  }

  &.gate-bottom {
    bottom: 0;
    border-radius: 0 0 2px 2px;
    background: linear-gradient(
      0deg,
      #1a2530 0%,
      #2a3540 20%,
      #3d4d5c 50%,
      #2a3540 80%,
      #1a2530 100%
    );
  }
}

.edge-light {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(160, 200, 230, 0.9) 20%,
    rgba(200, 230, 255, 1) 50%,
    rgba(160, 200, 230, 0.9) 80%,
    transparent 100%
  );
  box-shadow:
    0 0 10px rgba(160, 200, 230, 0.8),
    0 0 20px rgba(160, 200, 230, 0.5),
    0 0 30px rgba(160, 200, 230, 0.3);

  &.top-light {
    bottom: 0;
  }

  &.bottom-light {
    top: 0;
  }
}

.center-gap {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 3px;
  transform: translateY(-50%);
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(180, 220, 255, 0.9) 10%,
    rgba(220, 240, 255, 1) 50%,
    rgba(180, 220, 255, 0.9) 90%,
    transparent 100%
  );
  box-shadow:
    0 0 15px rgba(160, 200, 230, 1),
    0 0 30px rgba(160, 200, 230, 0.7),
    0 0 50px rgba(160, 200, 230, 0.4);
  z-index: 10;
  opacity: 0.8;
}

.frame-shadow {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  box-shadow:
    inset 0 0 30px rgba(0, 0, 0, 0.3),
    inset 0 3px 10px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 15;
  opacity: 0;
}

.title-section {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  opacity: 0;

  .title {
    font-family: 'Montserrat', 'Arial', sans-serif;
    font-size: clamp(24px, 4vw, 42px);
    font-weight: 700;
    color: #c8d8e8;
    margin: 0 0 8px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    text-shadow: 0 2px 15px rgba(100, 150, 200, 0.3);
  }

  .subtitle {
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: clamp(12px, 2vw, 16px);
    color: rgba(180, 200, 220, 0.7);
    margin: 0;
    letter-spacing: 0.3em;
  }
}
</style>
