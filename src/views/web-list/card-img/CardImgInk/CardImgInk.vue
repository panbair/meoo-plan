<template>
  <div class="ink-container">
    <!-- SVG 滤镜定义 -->
    <svg class="ink-filters" aria-hidden="true">
      <defs>
        <!-- 墨迹扰动滤镜 -->
        <filter id="ink-distortion">
          <feTurbulence
            ref="inkTurbulence"
            type="turbulence"
            baseFrequency="0.05"
            numOctaves="3"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>

        <!-- 墨晕模糊滤镜 -->
        <filter id="ink-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <!-- 纸张纹理 -->
        <filter id="paper-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDiffuseLighting in="noise" lighting-color="#faf8f5" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>
      </defs>
    </svg>

    <!-- 宣纸背景 -->
    <div class="ink-paper-bg"></div>

    <!-- 装饰元素 -->
    <div class="ink-decorations">
      <div
        v-for="i in 12"
        :key="i"
        class="ink-dot"
        :style="{
          '--angle': `${i * 30}deg`,
          '--delay': `${i * 0.1}s`,
          '--distance': `${120 + Math.random() * 60}px`
        }"
      ></div>
    </div>

    <!-- 内容区域 -->
    <div class="ink-content">
      <h2 class="ink-title" ref="inkTitleRef">
        <span class="ink-title-text">墨漪生花</span>
      </h2>
      <p class="ink-subtitle" ref="inkSubtitleRef">
        <span class="ink-subtitle-text">水墨浸染 · 径向展开</span>
      </p>
    </div>

    <!-- 图片容器 -->
    <div class="ink-image-wrapper" ref="inkImageWrapperRef">
      <!-- 原始图片 -->
      <img
        ref="inkImageRef"
        class="ink-image"
        src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80"
        alt="墨韵水景"
        crossorigin="anonymous"
      />

      <!-- 墨迹遮罩层 -->
      <div ref="inkMaskRef" class="ink-mask"></div>

      <!-- 墨丝群 -->
      <div ref="inkInkLinesRef" class="ink-lines">
        <svg
          v-for="i in 16"
          :key="i"
          class="ink-line-svg"
          :style="{
            '--line-angle': `${i * 22.5 + Math.random() * 10}deg`,
            '--line-length': `${80 + Math.random() * 120}px`,
            '--line-delay': `${i * 0.08}s`
          }"
          viewBox="0 0 200 200"
        >
          <path
            class="ink-line-path"
            :d="`M 100 100 Q ${100 + (Math.random() - 0.5) * 40} ${100 + (Math.random() - 0.5) * 40} ${100 + (Math.random() - 0.5) * 80} ${100 + (Math.random() - 0.5) * 80}`"
          />
        </svg>
      </div>

      <!-- 水渍边缘 -->
      <div ref="inkStainRef" class="ink-stain"></div>
    </div>

    <!-- 墨滴落点 -->
    <div ref="inkDropRef" class="ink-drop"></div>

    <!-- 边缘光晕 -->
    <div ref="inkGlowRef" class="ink-edge-glow"></div>

    <!-- 墨香 -->
    <div class="ink-seal" ref="inkSealRef">
      <span>墨</span>
    </div>

    <!-- 滚动进度 -->
    <div class="ink-progress" ref="inkProgressRef">
      <div class="ink-progress-bar"></div>
      <span class="ink-progress-text">0%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
  revert?: () => void
}

const inkContainerRef = ref<HTMLElement | null>(null)
const inkTitleRef = ref<HTMLElement | null>(null)
const inkSubtitleRef = ref<HTMLElement | null>(null)
const inkImageRef = ref<HTMLImageElement | null>(null)
const inkImageWrapperRef = ref<HTMLElement | null>(null)
const inkMaskRef = ref<HTMLElement | null>(null)
const inkInkLinesRef = ref<HTMLElement | null>(null)
const inkStainRef = ref<HTMLElement | null>(null)
const inkDropRef = ref<HTMLElement | null>(null)
const inkGlowRef = ref<HTMLElement | null>(null)
const inkSealRef = ref<HTMLElement | null>(null)
const inkProgressRef = ref<HTMLElement | null>(null)
const inkTurbulence = ref<SVGElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!inkContainerRef.value) return

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: inkContainerRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })

    // 墨滴落点闪烁
    tl.fromTo(
      inkDropRef.value,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.8, duration: 0.3, ease: 'power2.out' },
      0
    )

    // 墨滴消失
    tl.to(
      inkDropRef.value,
      { scale: 2, opacity: 0, duration: 0.5, ease: 'power2.out' },
      0.2
    )

    // 图片初始状态（被遮罩覆盖）
    if (inkImageRef.value) {
      gsap.set(inkImageRef.value, {
        filter: 'brightness(1.3)',
        scale: 1.05
      })
    }

    // 遮罩径向扩散 - 核心动画（从完全覆盖到完全消失）
    tl.fromTo(
      inkMaskRef.value,
      {
        clipPath: 'circle(100% at 50% 50%)'
      },
      {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 1.5,
        ease: 'power2.out'
      },
      0
    )

    // 图片显现（亮度沉淀）
    if (inkImageRef.value) {
      tl.to(
        inkImageRef.value,
        { filter: 'brightness(1)', scale: 1, duration: 1.5, ease: 'power2.out' },
        0
      )
    }

    // 墨丝渗透动画
    const inkLines = inkInkLinesRef.value?.querySelectorAll('.ink-line-path')
    if (inkLines) {
      inkLines.forEach((line, i) => {
        const length = (line as SVGPathElement).getTotalLength?.() || 100
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0.6
        })

        tl.to(
          line,
          {
            strokeDashoffset: 0,
            opacity: 0.3,
            duration: 0.8,
            ease: 'power2.out'
          },
          0.3 + i * 0.05
        )
      })
    }

    // 水渍边缘显现
    tl.fromTo(
      inkStainRef.value,
      { opacity: 0, scale: 0.5 },
      { opacity: 0.15, scale: 1, duration: 1, ease: 'power2.out' },
      0.8
    )

    // 边缘光晕消退
    tl.fromTo(
      inkGlowRef.value,
      { opacity: 0.6, scale: 0.8 },
      { opacity: 0, scale: 1.5, duration: 1.2, ease: 'power2.out' },
      0
    )

    // 标题显现
    if (inkTitleRef.value) {
      tl.fromTo(
        inkTitleRef.value,
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
        0.5
      )
    }

    // 副标题显现
    if (inkSubtitleRef.value) {
      tl.fromTo(
        inkSubtitleRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.7
      )
    }

    // 印章显现
    if (inkSealRef.value) {
      tl.fromTo(
        inkSealRef.value,
        { opacity: 0, scale: 0.5, rotate: -15 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)' },
        1
      )
    }

    // 墨点闪烁
    const inkDots = inkContainerRef.value.querySelectorAll('.ink-dot')
    tl.to(
      inkDots,
      {
        opacity: 0.8,
        scale: 1,
        duration: 0.5,
        stagger: { each: 0.05, from: 'random' }
      },
      0.3
    )

    // 进度条
    if (inkProgressRef.value) {
      const progressBar = inkProgressRef.value.querySelector('.ink-progress-bar')
      const progressText = inkProgressRef.value.querySelector('.ink-progress-text')

      tl.to(
        progressBar,
        { width: '100%', ease: 'none' },
        0
      )

      tl.to(
        progressText,
        {
          textContent: '100%',
          snap: { textContent: 1 },
          duration: 1
        },
        0
      )
    }

    // 保存清理函数
    cleanupFns.push({
      kill: () => tl.kill()
    })

    // 完成后微呼吸动画
    const breatheTl = gsap.timeline({
      scrollTrigger: {
        trigger: inkContainerRef.value,
        start: 'bottom 30%',
        end: 'bottom top',
        toggleActions: 'play none none reverse'
      }
    })

    // 水渍低频呼吸
    breatheTl.to(
      inkStainRef.value,
      {
        opacity: 0.2,
        scale: 1.02,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      },
      0
    )

    // 印章微动
    if (inkSealRef.value) {
      breatheTl.to(
        inkSealRef.value,
        {
          rotate: 3,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        },
        0
      )
    }

    cleanupFns.push({
      kill: () => breatheTl.kill()
    })
  }, inkContainerRef.value!)

  cleanupFns.push({
    kill: () => ctx.revert()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === inkContainerRef.value) {
      st.kill()
    }
  })
})
</script>

<style lang="scss" scoped>
$ink-black: #1a1a1a;
$ink-gray: #4a4a4a;
$paper-white: #faf8f5;
$paper-cream: #f5f0e8;
$stain-blue: #d0d8e0;

.ink-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(145deg, $paper-white 0%, $paper-cream 50%, #ebe6dc 100%);
  font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
}

.ink-filters {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

// 宣纸纹理背景
.ink-paper-bg {
  position: absolute;
  inset: 0;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
  opacity: 0.6;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(255, 252, 245, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(245, 240, 232, 0.4) 0%, transparent 50%);
  }
}

// 装饰墨点
.ink-decorations {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ink-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, $ink-gray 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transform: translate(
    calc(cos(var(--angle)) * var(--distance)),
    calc(sin(var(--angle)) * var(--distance))
  );

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: inherit;
    filter: blur(2px);
  }
}

// 内容区域
.ink-content {
  position: absolute;
  top: 12%;
  left: 8%;
  z-index: 10;
  pointer-events: none;
}

.ink-title {
  margin: 0 0 16px 0;
  font-size: 56px;
  font-weight: 700;
  letter-spacing: 12px;
  color: $ink-black;
  opacity: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
}

.ink-title-text {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, $ink-black 0%, transparent 100%);
  }
}

.ink-subtitle {
  margin: 0;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 8px;
  color: $ink-gray;
  opacity: 0;
}

.ink-subtitle-text {
  position: relative;
  padding-left: 20px;

  &::before {
    content: '—';
    position: absolute;
    left: 0;
    opacity: 0.5;
  }
}

// 图片容器
.ink-image-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65vw;
  max-width: 900px;
  height: 55vh;
  max-height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.15),
    0 10px 20px rgba(0, 0, 0, 0.1);
}

.ink-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.3);
}

// 墨迹遮罩层
.ink-mask {
  position: absolute;
  inset: 0;
  background: $ink-black;
  clip-path: circle(100% at 50% 50%);
}

// 墨丝群
.ink-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
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
  stroke-width: 1.5;
  stroke-linecap: round;
  filter: blur(0.5px);
}

// 水渍边缘
.ink-stain {
  position: absolute;
  inset: -5px;
  border: 2px solid transparent;
  border-radius: 12px;
  background:
    radial-gradient(ellipse at 10% 10%, rgba($stain-blue, 0.15) 0%, transparent 40%),
    radial-gradient(ellipse at 90% 90%, rgba($stain-blue, 0.12) 0%, transparent 35%),
    radial-gradient(ellipse at 50% 50%, transparent 30%, rgba($stain-blue, 0.08) 100%);
  opacity: 0;
  pointer-events: none;
  filter: blur(3px);
}

// 墨滴落点
.ink-drop {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%) scale(0);
  background: radial-gradient(circle, $ink-black 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  filter: blur(8px);
}

// 边缘光晕
.ink-edge-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80vw;
  height: 70vh;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgba($ink-gray, 0.1) 0%,
    transparent 60%
  );
  opacity: 0;
  pointer-events: none;
  filter: blur(40px);
}

// 印章
.ink-seal {
  position: absolute;
  bottom: 15%;
  right: 10%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #c41e1e;
  border-radius: 4px;
  background: rgba(#c41e1e, 0.05);
  opacity: 0;
  transform: scale(0.5) rotate(-15deg);
  pointer-events: none;

  span {
    font-size: 36px;
    font-weight: 700;
    color: #c41e1e;
    writing-mode: vertical-rl;
    letter-spacing: 4px;
  }
}

// 滚动进度
.ink-progress {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.ink-progress-bar {
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, $ink-gray 0%, $ink-black 100%);
  border-radius: 1px;
}

.ink-progress-text {
  font-size: 12px;
  letter-spacing: 2px;
  color: $ink-gray;
  font-family: 'Courier New', monospace;
}

// 响应式
@media (max-width: 768px) {
  .ink-title {
    font-size: 36px;
    letter-spacing: 6px;
  }

  .ink-subtitle {
    font-size: 14px;
    letter-spacing: 4px;
  }

  .ink-content {
    top: 8%;
    left: 5%;
  }

  .ink-image-wrapper {
    width: 85vw;
    height: 45vh;
  }

  .ink-seal {
    width: 50px;
    height: 50px;
    bottom: 10%;
    right: 8%;

    span {
      font-size: 24px;
    }
  }
}
</style>
