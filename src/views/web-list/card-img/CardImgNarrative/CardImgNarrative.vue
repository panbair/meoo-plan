<template>
  <div class="card-img-narrative" ref="containerRef">
    <div class="narrative-scene" ref="sceneRef">
      <!-- 远景层 - 抽象纹理背景 -->
      <div class="layer-distant" ref="distantRef">
        <div class="distant-pattern"></div>
        <div class="distant-texture"></div>
      </div>

      <!-- 中景层 - 主图 -->
      <div class="layer-middle" ref="middleRef">
        <img
          :src="imageUrl"
          alt="Narrative scene"
          class="narrative-image"
          ref="imageRef"
          loading="lazy"
        />
        <div class="middle-overlay"></div>
      </div>

      <!-- 前景层 - 文案 -->
      <div class="layer-foreground" ref="foregroundRef">
        <div class="foreground-content">
          <h2 class="narrative-title" ref="titleRef">景深叙事</h2>
          <p class="narrative-subtitle" ref="subtitleRef">三层视差图文剧场</p>
          <div class="narrative-line" ref="lineRef"></div>
        </div>
      </div>

      <!-- 装饰元素 -->
      <div class="deco-elements">
        <div class="deco-line deco-1" ref="deco1Ref"></div>
        <div class="deco-line deco-2" ref="deco2Ref"></div>
        <div class="deco-dot deco-dot-1" ref="deco3Ref"></div>
        <div class="deco-dot deco-dot-2" ref="deco4Ref"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

interface Props {
  imageUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
})

// Refs
const containerRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const distantRef = ref<HTMLElement | null>(null)
const middleRef = ref<HTMLElement | null>(null)
const foregroundRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const deco1Ref = ref<HTMLElement | null>(null)
const deco2Ref = ref<HTMLElement | null>(null)
const deco3Ref = ref<HTMLElement | null>(null)
const deco4Ref = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// 创建三层视差动画
const createNarrativeAnimation = () => {
  if (!containerRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  cleanupFns.push({
    kill: () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === containerRef.value) {
          st.kill()
        }
      })
    }
  })

  // 远景层 - 极缓移动 + 缩放呼吸
  tl.fromTo(
    distantRef.value,
    {
      y: 0,
      scale: 1
    },
    {
      y: -80,
      scale: 1.015,
      filter: 'blur(1px)',
      duration: 1,
      ease: 'none'
    },
    0
  )

  // 中景层 - 中速移动 + 亮度渐变
  tl.fromTo(
    middleRef.value,
    {
      y: 0,
      filter: 'brightness(0.85)'
    },
    {
      y: -200,
      filter: 'brightness(1)',
      duration: 1,
      ease: 'none'
    },
    0
  )

  // 前景层 - 快速移动 + 文案淡入
  tl.fromTo(
    foregroundRef.value,
    {
      y: 0
    },
    {
      y: -400,
      duration: 1,
      ease: 'none'
    },
    0
  )

  // 文案淡入动画
  tl.fromTo(
    titleRef.value,
    {
      opacity: 0,
      y: 15
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    },
    0.1
  )

  tl.fromTo(
    subtitleRef.value,
    {
      opacity: 0,
      y: 15
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    },
    0.2
  )

  tl.fromTo(
    lineRef.value,
    {
      scaleX: 0,
      opacity: 0
    },
    {
      scaleX: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    },
    0.35
  )

  // 装饰元素动画
  tl.fromTo(
    deco1Ref.value,
    { opacity: 0, x: -30 },
    { opacity: 0.6, x: 0, duration: 0.5, ease: 'power2.out' },
    0.2
  )

  tl.fromTo(
    deco2Ref.value,
    { opacity: 0, x: 30 },
    { opacity: 0.6, x: 0, duration: 0.5, ease: 'power2.out' },
    0.25
  )

  tl.fromTo(
    deco3Ref.value,
    { opacity: 0, scale: 0 },
    { opacity: 0.8, scale: 1, duration: 0.4, ease: 'back.out(1.7)' },
    0.3
  )

  tl.fromTo(
    deco4Ref.value,
    { opacity: 0, scale: 0 },
    { opacity: 0.8, scale: 1, duration: 0.4, ease: 'back.out(1.7)' },
    0.4
  )
}

onMounted(() => {
  requestAnimationFrame(() => {
    createNarrativeAnimation()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style lang="scss" scoped>
.card-img-narrative {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f4f0 0%, #fdfcfa 50%, #faf7f4 100%);
}

.narrative-scene {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

// ============ 远景层 ============
.layer-distant {
  position: absolute;
  inset: 0;
  z-index: 1;
  filter: blur(1px);
  opacity: 0.4;

  .distant-pattern {
    position: absolute;
    inset: -20%;
    background: 
      radial-gradient(ellipse at 20% 30%, rgba(255, 200, 150, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 70%, rgba(200, 180, 255, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(150, 200, 255, 0.08) 0%, transparent 60%);
  }

  .distant-texture {
    position: absolute;
    inset: 0;
    background-image: 
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 30px,
        rgba(200, 190, 180, 0.03) 30px,
        rgba(200, 190, 180, 0.03) 60px
      );
  }
}

// ============ 中景层 ============
.layer-middle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 65vw;
  height: 70vh;
  max-width: 850px;
  z-index: 2;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.12),
    0 10px 30px rgba(0, 0, 0, 0.08);

  .narrative-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.85);
  }

  .middle-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 30%,
      transparent 70%,
      rgba(255, 255, 255, 0.05) 100%
    );
    pointer-events: none;
  }
}

// ============ 前景层 ============
.layer-foreground {
  position: absolute;
  left: 10%;
  top: 25%;
  z-index: 3;
  max-width: 400px;
}

.foreground-content {
  position: relative;
}

.narrative-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 0.5em 0;
  opacity: 0;
}

.narrative-subtitle {
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 400;
  color: #4a4a4a;
  letter-spacing: 0.1em;
  margin: 0;
  opacity: 0;
}

.narrative-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #e85d4c, #f4a261);
  margin-top: 1.5em;
  transform-origin: left;
  opacity: 0;
}

// ============ 装饰元素 ============
.deco-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
}

.deco-line {
  position: absolute;
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent);

  &.deco-1 {
    top: 20%;
    left: 8%;
  }

  &.deco-2 {
    bottom: 30%;
    right: 10%;
  }
}

.deco-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e85d4c, #f4a261);

  &.deco-dot-1 {
    top: 22%;
    left: calc(8% + 80px);
  }

  &.deco-dot-2 {
    bottom: 28%;
    right: calc(10% + 80px);
  }
}
</style>
