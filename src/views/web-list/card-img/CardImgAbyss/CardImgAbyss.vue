<template>
  <section ref="abyssRef" class="abyss-section">
    <!-- 深空背景层 -->
    <div class="abyss-bg">
      <div class="bg-stars">
        <div
          v-for="i in 50"
          :key="`star-${i}`"
          :ref="el => setStarRef(el, i)"
          class="star"
        ></div>
      </div>
      <div class="bg-gradient"></div>
    </div>

    <!-- 深渊容器 -->
    <div ref="abyssContainerRef" class="abyss-container">
      <!-- 远景层 - 模糊淡化的图片 -->
      <div
        v-for="(img, i) in abyssImages"
        :key="`layer-back-${img.id}`"
        :ref="el => setLayerBackRef(el, i)"
        class="parallax-layer layer-back"
      >
        <div class="layer-image-wrap">
          <img :src="img.url" :alt="img.title" class="layer-image" />
          <div class="layer-gradient"></div>
        </div>
      </div>

      <!-- 中景层 - 正常清晰度 -->
      <div
        v-for="(img, i) in abyssImages"
        :key="`layer-mid-${img.id}`"
        :ref="el => setLayerMidRef(el, i)"
        class="parallax-layer layer-mid"
      >
        <div class="layer-image-wrap mid-wrap">
          <img :src="img.url" :alt="img.title" class="layer-image" />
          <div class="layer-gradient"></div>
          <div class="layer-content">
            <span class="img-tag">{{ img.tag }}</span>
            <h3 class="img-title">{{ img.title }}</h3>
          </div>
        </div>
      </div>

      <!-- 近景层 - 发光边框 -->
      <div
        v-for="(img, i) in abyssImages"
        :key="`layer-front-${img.id}`"
        :ref="el => setLayerFrontRef(el, i)"
        class="parallax-layer layer-front"
      >
        <div class="layer-image-wrap front-wrap">
          <img :src="img.url" :alt="img.title" class="layer-image" />
          <div class="layer-glow"></div>
        </div>
      </div>

      <!-- 文字信息层 -->
      <div ref="textLayerRef" class="text-layer">
        <div
          v-for="(img, i) in abyssImages"
          :key="`text-${img.id}`"
          :ref="el => setTextRef(el, i)"
          class="text-card"
        >
          <p class="text-description">{{ img.description }}</p>
        </div>
      </div>

      <!-- 光束效果 -->
      <div ref="beamLayerRef" class="beam-layer">
        <div
          v-for="i in 6"
          :key="`beam-${i}`"
          :ref="el => setBeamRef(el, i)"
          class="light-beam"
        ></div>
      </div>
    </div>

    <!-- 深渊核心 -->
    <div ref="coreRef" class="abyss-core"></div>

    <!-- 深度指示器 -->
    <div ref="indicatorRef" class="depth-indicator">
      <div class="indicator-line"></div>
      <span class="indicator-text">ABYSS DEPTH</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
interface AbyssImage {
  id: number
  url: string
  title: string
  tag: string
  description: string
}

// ==================== Refs ====================
const abyssRef = ref<HTMLElement>()
const abyssContainerRef = ref<HTMLElement>()
const coreRef = ref<HTMLElement>()
const textLayerRef = ref<HTMLElement>()
const beamLayerRef = ref<HTMLElement>()
const indicatorRef = ref<HTMLElement>()

const starRefs = ref<HTMLElement[]>([])
const layerBackRefs = ref<HTMLElement[]>([])
const layerMidRefs = ref<HTMLElement[]>([])
const layerFrontRefs = ref<HTMLElement[]>([])
const textRefs = ref<HTMLElement[]>([])
const beamRefs = ref<HTMLElement[]>([])

const setStarRef = (el: any, i: number) => { if (el) starRefs.value[i - 1] = el }
const setLayerBackRef = (el: any, i: number) => { if (el) layerBackRefs.value[i] = el }
const setLayerMidRef = (el: any, i: number) => { if (el) layerMidRefs.value[i] = el }
const setLayerFrontRef = (el: any, i: number) => { if (el) layerFrontRefs.value[i] = el }
const setTextRef = (el: any, i: number) => { if (el) textRefs.value[i] = el }
const setBeamRef = (el: any, i: number) => { if (el) beamRefs.value[i - 1] = el }

// ==================== 深渊图片数据 ====================
const abyssImages = reactive<AbyssImage[]>([
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=90',
    title: '蓝色星球',
    tag: 'ORIGIN',
    description: '宇宙中唯一的生命摇篮'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=90',
    title: '星云深处',
    tag: 'COSMOS',
    description: '亿万星辰的诞生之地'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1920&q=90',
    title: '银河走廊',
    tag: 'GALAXY',
    description: '穿越时空的永恒之旅'
  }
])

// ==================== 动画清理 ====================
let cleanupFns: Array<() => void> = []

function initAbyssAnimation() {
  const abyss = abyssRef.value
  const container = abyssContainerRef.value

  if (!abyss || !container) return

  const allStars = starRefs.value.filter(Boolean)
  const allBack = layerBackRefs.value.filter(Boolean)
  const allMid = layerMidRefs.value.filter(Boolean)
  const allFront = layerFrontRefs.value.filter(Boolean)
  const allTexts = textRefs.value.filter(Boolean)
  const allBeams = beamRefs.value.filter(Boolean)

  // ========== 1. 设置透视 ==========
  gsap.set(container, {
    perspective: 2000,
    transformStyle: 'preserve-3d'
  })

  // ========== 2. 初始状态设置 ==========

  // 星星初始 - 随机散布
  allStars.forEach((star) => {
    gsap.set(star, {
      x: gsap.utils.random(-window.innerWidth, window.innerWidth),
      y: gsap.utils.random(-window.innerHeight, window.innerHeight),
      scale: 0,
      opacity: 0
    })
  })

  // 远景层初始 - 淡出模糊
  allBack.forEach((layer, i) => {
    gsap.set(layer, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 0.4,
      opacity: 0,
      filter: 'blur(8px) brightness(0.4)',
      rotationY: gsap.utils.random(-15, 15),
      rotationX: gsap.utils.random(-10, 10),
      z: -400 + i * 50,
      transformStyle: 'preserve-3d'
    })
  })

  // 中景层初始 - 居中收缩
  allMid.forEach((layer, i) => {
    gsap.set(layer, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 0.3,
      opacity: 0,
      filter: 'brightness(0.6)',
      rotationY: gsap.utils.random(-8, 8),
      z: -200 + i * 40,
      transformStyle: 'preserve-3d'
    })
  })

  // 近景层初始 - 最接近但隐藏
  allFront.forEach((layer, i) => {
    gsap.set(layer, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 0.2,
      opacity: 0,
      filter: 'brightness(0.8)',
      z: -50 + i * 30,
      transformStyle: 'preserve-3d'
    })
  })

  // 文字层初始
  allTexts.forEach((text, i) => {
    gsap.set(text, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: 40 + i * 100,
      opacity: 0,
      filter: 'blur(10px)',
      scale: 0.6,
      z: 200 + i * 50,
      transformStyle: 'preserve-3d'
    })
  })

  // 光束初始
  allBeams.forEach((beam, i) => {
    gsap.set(beam, {
      x: gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2),
      y: window.innerHeight,
      scaleY: 0,
      opacity: 0
    })
  })

  // ========== 3. 创建主时间线 ==========
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: abyss,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 2,
      anticipatePin: 1,
      toggleActions: 'play reverse play reverse'
    }
  })

  // 阶段A: 星星显现 (0 - 0.2)
  tl.to(allStars, {
    scale: 1,
    opacity: 0.8,
    duration: 0.2,
    stagger: {
      each: 0.02,
      from: 'random'
    },
    ease: 'power2.in'
  }, 0)

  // 阶段B: 远景层浮现 (0.1 - 0.4)
  const backPositions = [
    { x: -45, y: -20 },
    { x: 0, y: 0 },
    { x: 45, y: 20 }
  ]

  tl.to(allBack, {
    xPercent: (i) => backPositions[i]?.x || 0,
    yPercent: (i) => backPositions[i]?.y || 0,
    scale: 1.8,
    opacity: 0.5,
    filter: 'blur(4px) brightness(0.7)',
    rotationY: 0,
    rotationX: 0,
    z: 0,
    duration: 0.3,
    stagger: 0.1,
    ease: 'power3.out'
  }, 0.1)

  // 阶段C: 中景层展开 (0.2 - 0.6)
  const midPositions = [
    { x: -35, y: -15 },
    { x: 0, y: 0 },
    { x: 35, y: 15 }
  ]

  tl.to(allMid, {
    xPercent: (i) => midPositions[i]?.x || 0,
    yPercent: (i) => midPositions[i]?.y || 0,
    scale: 1.4,
    opacity: 1,
    filter: 'brightness(1) saturate(1.1)',
    rotationY: 0,
    z: 50,
    duration: 0.4,
    stagger: 0.12,
    ease: 'power4.out'
  }, 0.2)

  // 阶段D: 近景层浮现 (0.3 - 0.7)
  const frontPositions = [
    { x: -25, y: -10 },
    { x: 0, y: 0 },
    { x: 25, y: 10 }
  ]

  tl.to(allFront, {
    xPercent: (i) => frontPositions[i]?.x || 0,
    yPercent: (i) => frontPositions[i]?.y || 0,
    scale: 1,
    opacity: 0.85,
    filter: 'brightness(1.1) saturate(1.2)',
    z: 100,
    duration: 0.4,
    stagger: 0.08,
    ease: 'back.out(1.2)'
  }, 0.3)

  // 阶段E: 文字浮现 (0.4 - 0.8)
  tl.to(allTexts, {
    yPercent: (i) => 35 + i * 12,
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    z: 150,
    duration: 0.4,
    stagger: 0.1,
    ease: 'power2.out'
  }, 0.4)

  // 阶段F: 光束效果 (0.2 - 0.6)
  tl.to(allBeams, {
    scaleY: 1.5,
    opacity: 0.4,
    y: -window.innerHeight * 1.5,
    duration: 0.4,
    stagger: 0.05,
    ease: 'power2.out'
  }, 0.2)

  // ========== 4. 核心深渊动画 ==========
  if (coreRef.value) {
    gsap.to(coreRef.value, {
      scale: 1.3,
      rotation: 180,
      duration: 8,
      repeat: -1,
      ease: 'none'
    })
    cleanupFns.push(() => gsap.killTweensOf(coreRef.value))
  }

  // ========== 5. 指示器动画 ==========
  if (indicatorRef.value) {
    gsap.to(indicatorRef.value.querySelector('.indicator-line'), {
      scaleY: 1.5,
      opacity: 0.6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // ========== 6. 入场淡入 ==========
  gsap.fromTo(abyss, {
    opacity: 0
  }, {
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  })

  // 保存清理函数
  cleanupFns.push(() => {
    tl.kill()
    ScrollTrigger.getAll().forEach(st => st.kill())
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    initAbyssAnimation()
  }, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
  if (abyssRef.value) {
    gsap.set(abyssRef.value, { clearProps: 'all' })
  }
})
</script>

<style lang="scss" scoped>
// ==================== 变量 ====================
$abyss-cyan: #00f2fe;
$abyss-purple: #667eea;
$abyss-pink: #f093fb;
$abyss-dark: #0a0a12;

$abyss-card-width: 420px;
$abyss-card-height: 560px;

// ==================== 主容器 ====================
.abyss-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a18 0%, #12121f 50%, #0a0a18 100%);
  font-family: 'Exo 2', 'Rajdhani', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

// ==================== 深空背景 ====================
.abyss-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-stars {
  position: absolute;
  inset: 0;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px white;

  @for $i from 1 through 50 {
    &:nth-child(#{$i}) {
      width: random(3) + 1 + px;
      height: width;
      animation: starTwinkle 2s ease-in-out infinite;
      animation-delay: random(3) * 0.5 + s;
    }
  }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba($abyss-cyan, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 70% 80%, rgba($abyss-purple, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 50%, rgba($abyss-pink, 0.05) 0%, transparent 50%);
}

// ==================== 深渊核心 ====================
.abyss-core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba($abyss-cyan, 0.3) 0%,
    rgba($abyss-purple, 0.15) 40%,
    transparent 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 5;
}

// ==================== 深渊容器 ====================
.abyss-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  z-index: 10;
}

// ==================== 图片层 ====================
.parallax-layer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
}

.layer-image-wrap {
  position: relative;
  width: $abyss-card-width;
  height: $abyss-card-height;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 40px 100px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.08);

  &.mid-wrap {
    width: $abyss-card-width * 0.85;
    height: $abyss-card-height * 0.85;
    border-radius: 16px;
  }

  &.front-wrap {
    width: $abyss-card-width * 0.7;
    height: $abyss-card-height * 0.7;
    border-radius: 12px;
  }
}

.layer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.layer-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.3) 40%,
    transparent 70%
  );
}

.layer-glow {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba($abyss-cyan, 0.6),
    rgba($abyss-purple, 0.4),
    rgba($abyss-pink, 0.6)
  );
  opacity: 0.5;
  filter: blur(15px);
  z-index: -1;
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

.layer-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  z-index: 5;
}

.img-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 3px;
  color: rgba($abyss-cyan, 0.9);
  text-transform: uppercase;
  padding: 4px 12px;
  border: 1px solid rgba($abyss-cyan, 0.4);
  border-radius: 20px;
  margin-bottom: 12px;
  background: rgba($abyss-cyan, 0.1);
}

.img-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(white, 0.3);
}

// ==================== 文字层 ====================
.text-layer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  pointer-events: none;
}

.text-card {
  transform-style: preserve-3d;
}

.text-description {
  font-size: 14px;
  color: rgba(white, 0.6);
  margin: 0;
  letter-spacing: 3px;
  text-align: center;
  text-shadow: 0 0 20px rgba(white, 0.2);
}

// ==================== 光束层 ====================
.beam-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.light-beam {
  position: absolute;
  width: 2px;
  height: 100vh;
  background: linear-gradient(
    to top,
    transparent 0%,
    rgba($abyss-cyan, 0.3) 30%,
    rgba($abyss-purple, 0.2) 60%,
    transparent 100%
  );
  transform-origin: bottom center;
}

// ==================== 深度指示器 ====================
.depth-indicator {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 30;
}

.indicator-line {
  width: 2px;
  height: 120px;
  background: linear-gradient(
    to top,
    transparent,
    rgba($abyss-cyan, 0.8),
    transparent
  );
  transform-origin: top center;
}

.indicator-text {
  font-size: 9px;
  letter-spacing: 3px;
  color: rgba(white, 0.4);
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

// ==================== 响应式 ====================
@media (max-width: 1200px) {
  $abyss-card-width: 360px;
  $abyss-card-height: 480px;

  .layer-image-wrap {
    width: $abyss-card-width;
    height: $abyss-card-height;

    &.mid-wrap {
      width: $abyss-card-width * 0.85;
      height: $abyss-card-height * 0.85;
    }

    &.front-wrap {
      width: $abyss-card-width * 0.7;
      height: $abyss-card-height * 0.7;
    }
  }

  .img-title {
    font-size: 26px;
  }
}

@media (max-width: 900px) {
  $abyss-card-width: 280px;
  $abyss-card-height: 380px;

  .layer-image-wrap {
    width: $abyss-card-width;
    height: $abyss-card-height;

    &.mid-wrap {
      width: $abyss-card-width * 0.85;
      height: $abyss-card-height * 0.85;
    }

    &.front-wrap {
      width: $abyss-card-width * 0.7;
      height: $abyss-card-height * 0.7;
    }
  }

  .img-title {
    font-size: 20px;
    letter-spacing: 2px;
  }

  .img-tag {
    font-size: 8px;
    padding: 3px 8px;
  }

  .layer-content {
    padding: 20px;
  }

  .text-description {
    font-size: 12px;
  }

  .depth-indicator {
    right: 20px;
  }
}

@media (max-width: 600px) {
  $abyss-card-width: 220px;
  $abyss-card-height: 300px;

  .layer-image-wrap {
    width: $abyss-card-width;
    height: $abyss-card-height;

    &.mid-wrap {
      width: $abyss-card-width * 0.85;
      height: $abyss-card-height * 0.85;
    }

    &.front-wrap {
      width: $abyss-card-width * 0.7;
      height: $abyss-card-height * 0.7;
    }
  }

  .img-title {
    font-size: 16px;
    letter-spacing: 1px;
  }

  .img-tag {
    display: none;
  }

  .text-description {
    display: none;
  }

  .depth-indicator {
    right: 10px;
  }

  .indicator-text {
    display: none;
  }
}
</style>
