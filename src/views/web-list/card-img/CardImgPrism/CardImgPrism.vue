<template>
  <div ref="parentRef" class="prism-container">
    <!-- 深色展台背景 -->
    <div class="prism-bg">
      <div class="bg-gradient" />
      <div class="bg-grid" />
    </div>

    <!-- 顶部标题 -->
    <div class="prism-header">
      <div ref="headerRef" class="header-content">
        <span class="header-line" />
        <span class="header-text">SPECTRUM CALIBRATION</span>
        <span class="header-line" />
      </div>
    </div>

    <!-- 图片网格 -->
    <div ref="gridRef" class="prism-grid">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        :ref="(el) => setPrismCardRef(el, index)"
        class="prism-card"
      >
        <!-- 色层 -->
        <div :ref="(el) => setColorLayerRef(el, index, 'red')" class="color-layer layer-red" />
        <div :ref="(el) => setColorLayerRef(el, index, 'green')" class="color-layer layer-green" />
        <div :ref="(el) => setColorLayerRef(el, index, 'blue')" class="color-layer layer-blue" />
        
        <!-- 主图 -->
        <img
          :src="photo.url"
          :alt="photo.title"
          class="prism-image"
        />
        
        <!-- 光束效果 -->
        <div :ref="(el) => setBeamRef(el, index)" class="light-beam" />
        
        <!-- 彩虹镶边 -->
        <div :ref="(el) => setBorderRef(el, index)" class="rainbow-border" />
        
        <!-- 标题 -->
        <div class="card-label">
          <span class="label-num">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="label-title">{{ photo.title }}</span>
        </div>
      </div>
    </div>

    <!-- 底部进度 -->
    <div class="prism-footer">
      <div ref="footerRef" class="footer-content">
        <div class="progress-bar">
          <div ref="progressFillRef" class="progress-fill" />
        </div>
        <div class="progress-info">
          <span class="info-label">SPECTRUM</span>
          <span ref="progressTextRef" class="info-value">0 / {{ photos.length }}</span>
        </div>
      </div>
    </div>

    <!-- 校准指示器 -->
    <div class="calibration-marks">
      <div v-for="i in photos.length" :key="i" :ref="(el) => setMarkRef(el, i)" class="calib-mark">
        <span class="mark-dot" />
        <span class="mark-line" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

interface Photo {
  url: string
  title: string
}

const photos: Photo[] = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title: 'Mountain Dawn' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', title: 'Alpine Peak' },
  { url: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=600&q=80', title: 'Ocean Mist' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80', title: 'Forest Valley' }
]

const parentRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const progressTextRef = ref<HTMLElement | null>(null)

const prismCardRefs: (HTMLElement | null)[] = []
const colorLayerRefs: { [key: string]: { [layer: string]: HTMLElement | null } } = {}
const beamRefs: (HTMLElement | null)[] = []
const borderRefs: (HTMLElement | null)[] = []
const markRefs: (HTMLElement | null)[] = []

const setPrismCardRef = (el: unknown, index: number) => {
  prismCardRefs[index] = el as HTMLElement | null
}

const setColorLayerRef = (el: unknown, index: number, layer: string) => {
  if (!colorLayerRefs[index]) {
    colorLayerRefs[index] = {}
  }
  colorLayerRefs[index][layer] = el as HTMLElement | null
}

const setBeamRef = (el: unknown, index: number) => {
  beamRefs[index] = el as HTMLElement | null
}

const setBorderRef = (el: unknown, index: number) => {
  borderRefs[index] = el as HTMLElement | null
}

const setMarkRef = (el: unknown, index: number) => {
  markRefs[index] = el as HTMLElement | null
}

onMounted(() => {
  nextTick(() => {
    initAnimations()
  })
})

const initAnimations = () => {
  if (!parentRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  // 头部入场
  tl.fromTo(
    headerRef.value,
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.6 },
    0
  )

  // 初始化色层位置
  prismCardRefs.forEach((card, index) => {
    if (!card) return

    const redLayer = colorLayerRefs[index]?.red
    const greenLayer = colorLayerRefs[index]?.green
    const blueLayer = colorLayerRefs[index]?.blue

    // 初始：色层错位 + 模糊
    if (redLayer) {
      gsap.set(redLayer, { x: 8, opacity: 0.4, filter: 'blur(4px) saturate(2)' })
    }
    if (greenLayer) {
      gsap.set(greenLayer, { x: 0, opacity: 0.5, filter: 'blur(4px) saturate(1.5)' })
    }
    if (blueLayer) {
      gsap.set(blueLayer, { x: -8, opacity: 0.4, filter: 'blur(4px) saturate(2)' })
    }

    gsap.set(card.querySelector('.prism-image'), {
      filter: 'blur(8px) brightness(0.7)'
    })

    gsap.set(beamRefs[index], { opacity: 0, scale: 0.8 })
    gsap.set(borderRefs[index], { opacity: 0, scale: 0.5 })
  })

  // 依次校准每张图片
  prismCardRefs.forEach((card, index) => {
    if (!card) return

    const redLayer = colorLayerRefs[index]?.red
    const greenLayer = colorLayerRefs[index]?.green
    const blueLayer = colorLayerRefs[index]?.blue

    const startTime = index * 0.25

    // 色层聚拢
    if (redLayer) {
      tl.to(redLayer, {
        x: 0,
        opacity: 0.6,
        filter: 'blur(0px) saturate(1)',
        duration: 0.6,
        ease: 'power3.out'
      }, startTime)
    }
    if (greenLayer) {
      tl.to(greenLayer, {
        x: 0,
        opacity: 0.7,
        filter: 'blur(0px) saturate(1)',
        duration: 0.6,
        ease: 'power3.out'
      }, startTime)
    }
    if (blueLayer) {
      tl.to(blueLayer, {
        x: 0,
        opacity: 0.6,
        filter: 'blur(0px) saturate(1)',
        duration: 0.6,
        ease: 'power3.out'
      }, startTime)
    }

    // 图片锐化
    tl.to(card.querySelector('.prism-image'), {
      filter: 'blur(0px) brightness(1)',
      duration: 0.7,
      ease: 'power3.out'
    }, startTime)

    // 光束穿透
    tl.fromTo(
      beamRefs[index],
      { opacity: 0, scaleX: 0, x: '-50%' },
      { opacity: 0.8, scaleX: 1, x: '0%', duration: 0.3, ease: 'power2.in' },
      startTime + 0.3
    )
    tl.to(
      beamRefs[index],
      { opacity: 0, duration: 0.3, ease: 'power2.out' },
      startTime + 0.6
    )

    // 彩虹镶边爆发
    tl.fromTo(
      borderRefs[index],
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1.5, duration: 0.3, ease: 'power2.out' },
      startTime + 0.5
    )
    tl.to(
      borderRefs[index],
      { opacity: 0, scale: 2, duration: 0.4, ease: 'power2.out' },
      startTime + 0.6
    )

    // 色层淡出（融合完成）
    tl.to([redLayer, greenLayer, blueLayer], {
      opacity: 0,
      duration: 0.3
    }, startTime + 0.7)
  })

  // 校准标记
  markRefs.forEach((mark, index) => {
    if (!mark) return
    tl.fromTo(
      mark,
      { opacity: 0, scaleY: 0 },
      { opacity: 1, scaleY: 1, duration: 0.3, ease: 'back.out(2)' },
      index * 0.25 + 0.2
    )
  })

  // 进度条
  tl.fromTo(
    progressFillRef.value,
    { scaleX: 0 },
    { scaleX: 1, transformOrigin: 'left', duration: photos.length * 0.25 + 0.5 },
    0
  )

  tl.fromTo(
    progressTextRef.value,
    { textContent: `0 / ${photos.length}` },
    {
      textContent: `${photos.length} / ${photos.length}`,
      snap: { textContent: 1 },
      roundProps: 'textContent',
      duration: photos.length * 0.25 + 0.5
    },
    0
  )

  // 底部入场
  tl.fromTo(
    footerRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.5 },
    0.3
  )

  cleanupFns.push(() => {
    ScrollTrigger.getAll().forEach(t => t.kill())
  })
}

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.prism-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0f0f1a 100%);
  color: #ffffff;
  font-family: 'Noto Sans SC', sans-serif;
}

// 深色展台背景
.prism-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 30%, rgba(30, 30, 60, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 80%, rgba(40, 20, 60, 0.3) 0%, transparent 40%),
      radial-gradient(ellipse at 80% 70%, rgba(20, 40, 80, 0.2) 0%, transparent 40%);
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 60px 60px;
  }
}

// 顶部标题
.prism-header {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;

  .header-line {
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }

  .header-text {
    font-size: 11px;
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 6px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
  }
}

// 图片网格
.prism-grid {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 20px;
}

// 棱镜卡片
.prism-card {
  position: relative;
  width: 260px;
  height: 320px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

// 色层
.color-layer {
  position: absolute;
  inset: 0;
  mix-blend-mode: screen;
  pointer-events: none;
  will-change: transform, opacity;

  &.layer-red {
    background: linear-gradient(135deg, rgba(255, 50, 50, 0.3) 0%, rgba(255, 100, 50, 0.2) 100%);
  }

  &.layer-green {
    background: linear-gradient(135deg, rgba(50, 255, 100, 0.3) 0%, rgba(100, 255, 50, 0.2) 100%);
  }

  &.layer-blue {
    background: linear-gradient(135deg, rgba(50, 100, 255, 0.3) 0%, rgba(100, 50, 255, 0.2) 100%);
  }
}

.prism-image {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

// 光束效果
.light-beam {
  position: absolute;
  top: 0;
  left: 50%;
  width: 4px;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.8) 50%,
    transparent 100%
  );
  transform-origin: top center;
  z-index: 10;
  pointer-events: none;
  filter: blur(2px);
}

// 彩虹镶边
.rainbow-border {
  position: absolute;
  inset: -3px;
  border-radius: 6px;
  border: 2px solid transparent;
  background: linear-gradient(#0a0a12, #0a0a12) padding-box,
    linear-gradient(
      135deg,
      #ff0000 0%,
      #ff7f00 20%,
      #ffff00 40%,
      #00ff00 60%,
      #0000ff 80%,
      #8b00ff 100%
    ) border-box;
  z-index: 15;
  pointer-events: none;
}

// 卡片标题
.card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 10px;

  .label-num {
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    color: rgba(255, 255, 255, 0.5);
  }

  .label-title {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 1px;
  }
}

// 底部进度
.prism-footer {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 300px;
}

.progress-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  .progress-fill {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff);
    border-radius: 2px;
    transform-origin: left;
  }
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 16px;

  .info-label {
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(255, 255, 255, 0.4);
  }

  .info-value {
    font-size: 14px;
    font-family: 'JetBrains Mono', monospace;
    color: rgba(255, 255, 255, 0.7);
  }
}

// 校准指示器
.calibration-marks {
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 30px;
  z-index: 20;
}

.calib-mark {
  display: flex;
  align-items: center;
  gap: 8px;

  .mark-dot {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: background 0.3s;
  }

  .mark-line {
    width: 20px;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
