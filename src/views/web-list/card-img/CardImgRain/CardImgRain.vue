<template>
  <div ref="containerRef" class="rain-container">
    <!-- 宣纸背景 -->
    <div class="rain-paper-bg"></div>

    <!-- 内容区域 -->
    <div class="rain-content">
      <h2 class="rain-title" ref="titleRef">
        <span class="rain-title-text">砚池墨雨</span>
      </h2>
      <p class="rain-subtitle" ref="subtitleRef">
        <span class="rain-subtitle-text">多点晕染 · 径向展开</span>
      </p>
    </div>

    <!-- 图片容器 -->
    <div class="rain-image-wrapper" ref="wrapperRef">
      <!-- 原始图片 -->
      <img
        ref="imageRef"
        class="rain-image"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
        alt="砚池墨雨"
        crossorigin="anonymous"
      />

      <!-- 墨滴遮罩层 -->
      <div ref="maskLayerRef" class="rain-mask-layer">
        <div
          v-for="(drop, i) in inkDrops"
          :key="i"
          :ref="el => setDropRef(el, i)"
          class="ink-drop-circle"
          :style="getDropStyle(drop)"
        ></div>
      </div>

      <!-- 墨丝群 -->
      <div ref="linesLayerRef" class="rain-lines-layer">
        <svg
          v-for="(line, i) in inkLines"
          :key="i"
          class="ink-line-svg"
          :style="{
            '--line-x': `${line.x}%`,
            '--line-y': `${line.y}%`,
            '--line-angle': `${line.angle}deg`,
            '--line-length': `${line.length}px`,
            '--line-delay': `${line.delay}s`
          }"
          viewBox="0 0 200 200"
        >
          <path
            :ref="el => setLineRef(el, i)"
            class="ink-line-path"
            :d="line.path"
          />
        </svg>
      </div>

      <!-- 水渍边缘 -->
      <div ref="stainRef" class="rain-stain"></div>
    </div>

    <!-- 落点指示器 -->
    <div class="rain-drop-indicators">
      <div
        v-for="(drop, i) in inkDrops"
        :key="i"
        class="drop-indicator"
        :style="{
          left: `${drop.x}%`,
          top: `${drop.y}%`,
          '--drop-delay': `${i * 0.15}s`
        }"
      ></div>
    </div>

    <!-- 印章 -->
    <div class="rain-seal" ref="sealRef">
      <span>墨</span>
    </div>

    <!-- 滚动进度 -->
    <div class="rain-progress" ref="progressRef">
      <div class="rain-progress-track">
        <div class="rain-progress-fill"></div>
      </div>
      <span class="rain-progress-text">0%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface InkDrop {
  x: number
  y: number
  size: number
}

interface InkLine {
  x: number
  y: number
  angle: number
  length: number
  delay: number
  path: string
}

const containerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const maskLayerRef = ref<HTMLElement | null>(null)
const linesLayerRef = ref<HTMLElement | null>(null)
const stainRef = ref<HTMLElement | null>(null)
const sealRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

const dropRefs = ref<(HTMLElement | null)[]>([])
const lineRefs = ref<(SVGPathElement | null)[]>([])

// 生成7个随机墨滴位置
const inkDrops: InkDrop[] = [
  { x: 50, y: 50, size: 120 },   // 中心
  { x: 20, y: 30, size: 80 },   // 左上
  { x: 80, y: 25, size: 70 },   // 右上
  { x: 15, y: 65, size: 75 },   // 左下
  { x: 85, y: 70, size: 85 },   // 右下
  { x: 35, y: 45, size: 60 },   // 左中
  { x: 65, y: 55, size: 65 },   // 右中
]

// 生成墨丝
const inkLines: InkLine[] = Array.from({ length: 20 }, (_, i) => {
  const angle = Math.random() * 360
  const length = 60 + Math.random() * 100
  const drop = inkDrops[Math.floor(Math.random() * inkDrops.length)]
  return {
    x: drop.x,
    y: drop.y,
    angle,
    length,
    delay: Math.random() * 0.5,
    path: `M 100 100 Q ${50 + Math.random() * 100} ${50 + Math.random() * 100} ${length} ${length * 0.3}`
  }
})

const setDropRef = (el: HTMLElement | null, index: number) => {
  dropRefs.value[index] = el
}

const setLineRef = (el: SVGPathElement | null, index: number) => {
  lineRefs.value[index] = el
}

const getDropStyle = (drop: InkDrop) => ({
  left: `${drop.x}%`,
  top: `${drop.y}%`,
  width: `${drop.size}px`,
  height: `${drop.size}px`,
  transform: 'translate(-50%, -50%)'
})

interface TweenCleanup {
  kill: () => void
  revert?: () => void
}

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!containerRef.value) return

  const ctx = gsap.context(() => {
    // 初始化墨滴 - 全部在中心点（scale: 0）
    dropRefs.value.forEach((drop) => {
      if (drop) {
        gsap.set(drop, {
          scale: 0,
          opacity: 0.9
        })
      }
    })

    // 初始化墨丝
    lineRefs.value.forEach((line) => {
      if (line) {
        const length = line.getTotalLength?.() || 80
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0
        })
      }
    })

    // 初始化水渍
    if (stainRef.value) {
      gsap.set(stainRef.value, { opacity: 0, scale: 0.8 })
    }

    // 初始化印章
    if (sealRef.value) {
      gsap.set(sealRef.value, { opacity: 0, scale: 0.5, rotate: -10 })
    }

    // 创建主时间线
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          // 更新进度
          const progressFill = progressRef.value?.querySelector('.rain-progress-fill')
          const progressText = progressRef.value?.querySelector('.rain-progress-text')
          if (progressFill) {
            gsap.set(progressFill, { scaleX: self.progress })
          }
          if (progressText) {
            progressText.textContent = `${Math.round(self.progress * 100)}%`
          }
        }
      }
    })

    // 墨滴依次落入并扩散
    inkDrops.forEach((drop, i) => {
      const dropEl = dropRefs.value[i]
      if (!dropEl) return

      // 墨滴落入
      tl.fromTo(
        dropEl,
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 0.9,
          duration: 0.4,
          ease: 'power2.out'
        },
        i * 0.12
      )

      // 墨滴扩散消失
      tl.to(
        dropEl,
        {
          scale: 3,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out'
        },
        i * 0.12 + 0.3
      )
    })

    // 墨丝渗透
    lineRefs.value.forEach((line, i) => {
      if (!line) return
      tl.fromTo(
        line,
        {
          strokeDashoffset: line.getTotalLength?.() || 80,
          opacity: 0
        },
        {
          strokeDashoffset: 0,
          opacity: 0.5,
          duration: 0.6,
          ease: 'power2.out'
        },
        0.8 + i * 0.08
      )

      // 墨丝消退
      tl.to(
        line,
        {
          opacity: 0.15,
          duration: 0.4,
          ease: 'power2.in'
        },
        1.5 + i * 0.08
      )
    })

    // 落点指示器闪烁
    const indicators = containerRef.value.querySelectorAll('.drop-indicator')
    tl.fromTo(
      indicators,
      {
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 0.6,
        duration: 0.3,
        stagger: { each: 0.08, from: 'random' }
      },
      0
    )

    tl.to(
      indicators,
      {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: { each: 0.05, from: 'random' }
      },
      0.6
    )

    // 标题显现
    if (titleRef.value) {
      tl.fromTo(
        titleRef.value,
        {
          opacity: 0,
          y: 50,
          filter: 'blur(15px)'
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out'
        },
        0.3
      )
    }

    // 副标题显现
    if (subtitleRef.value) {
      tl.fromTo(
        subtitleRef.value,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        },
        0.5
      )
    }

    // 水渍边缘残留
    tl.fromTo(
      stainRef.value,
      {
        opacity: 0,
        scale: 0.8
      },
      {
        opacity: 0.12,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
      },
      1.2
    )

    // 印章显现
    if (sealRef.value) {
      tl.fromTo(
        sealRef.value,
        {
          opacity: 0,
          scale: 0.5,
          rotate: -10
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.6,
          ease: 'back.out(2)'
        },
        1.5
      )
    }

    cleanupFns.push({ kill: () => tl.kill() })

    // 完成后呼吸动画
    ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'bottom 30%',
      onEnter: () => {
        // 水渍呼吸
        if (stainRef.value) {
          gsap.to(stainRef.value, {
            opacity: 0.18,
            scale: 1.03,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          })
        }

        // 印章微动
        if (sealRef.value) {
          gsap.to(sealRef.value, {
            rotate: 4,
            duration: 4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          })
        }

        // 图片微浮动
        if (imageRef.value) {
          gsap.to(imageRef.value, {
            scale: 1.02,
            duration: 5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          })
        }
      }
    })

    // 落点指示器动画
    indicators.forEach((indicator) => {
      gsap.to(indicator, {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
        repeat: -1,
        repeatDelay: 2 + Math.random() * 2
      })
    })
  }, containerRef.value)

  cleanupFns.push({ kill: () => ctx.revert() })
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
$ink-black: #1a1a1a;
$ink-gray: #3a3a3a;
$ink-light: #5a5a5a;
$paper-white: #faf8f5;
$paper-cream: #f5f0e8;
$stain-blue: #c8d4e0;

.rain-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(150deg, $paper-white 0%, $paper-cream 50%, #e8e2d8 100%);
  font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
}

// 宣纸纹理
.rain-paper-bg {
  position: absolute;
  inset: 0;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
  opacity: 0.5;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 15%, rgba(255, 252, 245, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 85%, rgba(245, 240, 232, 0.5) 0%, transparent 50%);
  }
}

// 内容区域
.rain-content {
  position: absolute;
  top: 10%;
  left: 6%;
  z-index: 20;
  pointer-events: none;
}

.rain-title {
  margin: 0 0 20px 0;
  font-size: 52px;
  font-weight: 700;
  letter-spacing: 10px;
  color: $ink-black;
  opacity: 0;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.08);
}

.rain-title-text {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, $ink-black 0%, rgba($ink-black, 0.3) 100%);
  }
}

.rain-subtitle {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 6px;
  color: $ink-gray;
  opacity: 0;
}

.rain-subtitle-text {
  position: relative;
  padding-left: 24px;

  &::before {
    content: '—';
    position: absolute;
    left: 0;
    opacity: 0.5;
  }
}

// 图片容器
.rain-image-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  max-width: 850px;
  height: 50vh;
  max-height: 550px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.12),
    0 15px 30px rgba(0, 0, 0, 0.08);
}

.rain-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 墨滴遮罩层
.rain-mask-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.ink-drop-circle {
  position: absolute;
  background: radial-gradient(
    circle,
    $ink-black 0%,
    rgba($ink-black, 0.95) 30%,
    rgba($ink-black, 0.7) 60%,
    transparent 100%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  mix-blend-mode: multiply;
  filter: blur(3px);
}

// 墨丝层
.rain-lines-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
  overflow: visible;
}

.ink-line-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ink-line-path {
  fill: none;
  stroke: $ink-black;
  stroke-width: 1.2;
  stroke-linecap: round;
  opacity: 0;
  filter: blur(0.8px);
}

// 水渍边缘
.rain-stain {
  position: absolute;
  inset: -8px;
  border-radius: 10px;
  background:
    radial-gradient(ellipse at 15% 15%, rgba($stain-blue, 0.12) 0%, transparent 35%),
    radial-gradient(ellipse at 85% 85%, rgba($stain-blue, 0.1) 0%, transparent 30%),
    radial-gradient(ellipse at 50% 50%, transparent 40%, rgba($stain-blue, 0.06) 100%);
  opacity: 0;
  pointer-events: none;
  filter: blur(4px);
  z-index: 7;
}

// 落点指示器
.rain-drop-indicators {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
}

.drop-indicator {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, $ink-black 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  box-shadow: 0 0 15px rgba($ink-black, 0.5);
}

// 印章
.rain-seal {
  position: absolute;
  bottom: 12%;
  right: 8%;
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #b31e1e;
  border-radius: 4px;
  background: rgba(#b31e1e, 0.04);
  opacity: 0;
  z-index: 20;

  span {
    font-size: 32px;
    font-weight: 700;
    color: #b31e1e;
    writing-mode: vertical-rl;
    letter-spacing: 3px;
  }
}

// 滚动进度
.rain-progress {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 20;
}

.rain-progress-track {
  width: 180px;
  height: 2px;
  background: rgba($ink-gray, 0.2);
  border-radius: 1px;
  overflow: hidden;
}

.rain-progress-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, $ink-light 0%, $ink-black 100%);
  transform-origin: left;
  transform: scaleX(0);
}

.rain-progress-text {
  font-size: 11px;
  letter-spacing: 2px;
  color: $ink-gray;
  font-family: 'Courier New', monospace;
}

// 响应式
@media (max-width: 1024px) {
  .rain-image-wrapper {
    width: 75vw;
    height: 45vh;
  }

  .rain-title {
    font-size: 40px;
    letter-spacing: 6px;
  }
}

@media (max-width: 768px) {
  .rain-content {
    top: 8%;
    left: 5%;
  }

  .rain-title {
    font-size: 32px;
    letter-spacing: 4px;
  }

  .rain-subtitle {
    font-size: 13px;
    letter-spacing: 3px;
  }

  .rain-image-wrapper {
    width: 88vw;
    height: 40vh;
  }

  .rain-seal {
    width: 50px;
    height: 50px;
    bottom: 8%;
    right: 6%;

    span {
      font-size: 24px;
    }
  }
}
</style>
