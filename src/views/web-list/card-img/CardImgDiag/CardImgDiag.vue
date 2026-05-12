<template>
  <div class="card-img-diag" ref="containerRef">
    <div class="diag-scene" ref="sceneRef">
      <!-- 主图片 -->
      <div class="diag-image-container" ref="imageContainerRef">
        <img
          :src="imageUrl"
          alt="Diagonal reveal"
          class="diag-image"
          ref="imageRef"
          loading="lazy"
        />
        <!-- 亮度叠加层 -->
        <div class="image-brightness-overlay" ref="brightnessOverlayRef"></div>
      </div>

      <!-- 对角遮罩 -->
      <div class="diag-mask" ref="maskRef">
        <div class="mask-surface" ref="maskSurfaceRef">
          <!-- 遮罩纹理 -->
          <div class="mask-texture"></div>
        </div>
        <!-- 刀锋边缘 -->
        <div class="mask-edge" ref="maskEdgeRef"></div>
      </div>

      <!-- 内容层 -->
      <div class="diag-content" ref="contentRef">
        <h2 class="diag-title" ref="titleRef">{{ title }}</h2>
        <p class="diag-subtitle" ref="subtitleRef">{{ subtitle }}</p>
        <div class="diag-divider" ref="dividerRef"></div>
        <p class="diag-description" ref="descriptionRef">{{ description }}</p>
        <button class="diag-cta" ref="ctaRef">{{ ctaText }}</button>
      </div>

      <!-- 角落装饰 -->
      <div class="corner-decoration top-left" ref="cornerTLRef"></div>
      <div class="corner-decoration bottom-right" ref="cornerBRRef"></div>
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
  title?: string
  subtitle?: string
  description?: string
  ctaText?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
  title: 'Precision',
  subtitle: '精准切割，锋芒毕露',
  description: '一刀两断，干净利落。每一个角度都经过精密计算，每一次滑落都恰到好处。',
  ctaText: '立即体验'
})

// Refs
const containerRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const brightnessOverlayRef = ref<HTMLElement | null>(null)
const maskRef = ref<HTMLElement | null>(null)
const maskSurfaceRef = ref<HTMLElement | null>(null)
const maskEdgeRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const cornerTLRef = ref<HTMLElement | null>(null)
const cornerBRRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// 创建对角滑入动画
const createDiagAnimation = () => {
  if (!containerRef.value) return

  // 主时间线
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

  // ===== 阶段1: 遮罩滑出 =====
  // 沿对角线方向向右下滑动
  // clip-path: polygon(0% 0%, 100% 100%, 100% 0%) 覆盖的是下半三角
  // 滑出方向: 向右下方
  tl.to(maskRef.value,
    {
      x: '120%',
      y: '120%',
      duration: 1.2,
      ease: 'power3.inOut'
    },
    0
  )

  // 刀锋边缘同步滑出
  tl.to(maskEdgeRef.value,
    {
      x: '120%',
      y: '120%',
      duration: 1.2,
      ease: 'power3.inOut'
    },
    0
  )

  // ===== 阶段2: 亮度恢复 =====
  tl.to(brightnessOverlayRef.value,
    {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    },
    0.9
  )

  // ===== 阶段3: 内容淡入 =====
  // 标题
  tl.fromTo(titleRef.value,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, ease: 'power2.out', duration: 0.4 },
    0.6
  )

  // 副标题
  tl.fromTo(subtitleRef.value,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, ease: 'power2.out', duration: 0.4 },
    0.75
  )

  // 分割线
  tl.fromTo(dividerRef.value,
    { scaleX: 0 },
    { scaleX: 1, ease: 'power2.out', duration: 0.3 },
    0.9
  )

  // 描述
  tl.fromTo(descriptionRef.value,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 },
    1.0
  )

  // CTA按钮
  tl.fromTo(ctaRef.value,
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, ease: 'back.out(1.7)', duration: 0.4 },
    1.1
  )

  // ===== 阶段4: 角落装饰 =====
  tl.fromTo(cornerTLRef.value,
    { opacity: 0, x: -20, y: -20 },
    { opacity: 1, x: 0, y: 0, ease: 'power2.out', duration: 0.5 },
    1.2
  )

  tl.fromTo(cornerBRRef.value,
    { opacity: 0, x: 20, y: 20 },
    { opacity: 1, x: 0, y: 0, ease: 'power2.out', duration: 0.5 },
    1.2
  )
}

// 初始化背景动画
const initAmbientAnimations = () => {
  // 遮罩初始位置 - 覆盖下半三角
  if (maskRef.value) {
    gsap.set(maskRef.value, {
      x: 0,
      y: 0,
      clipPath: 'polygon(0% 0%, 100% 100%, 100% 0%)'
    })
  }

  // 刀锋边缘
  if (maskEdgeRef.value) {
    gsap.set(maskEdgeRef.value, {
      x: 0,
      y: 0,
      clipPath: 'polygon(0% 0%, 100% 100%, 100% 0%)'
    })
  }

  // 初始亮度暗
  if (brightnessOverlayRef.value) {
    gsap.set(brightnessOverlayRef.value, {
      opacity: 0.15,
      backgroundColor: '#000'
    })
  }
}

onMounted(() => {
  initAmbientAnimations()
  requestAnimationFrame(() => {
    createDiagAnimation()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
  gsap.killTweensOf('*')
})
</script>

<style lang="scss" scoped>
.card-img-diag {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #1a1625 0%,
    #252033 25%,
    #1e1a2e 50%,
    #2a2340 75%,
    #1a1625 100%
  );
}

.diag-scene {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

// 主图片容器
.diag-image-container {
  position: relative;
  width: 55vw;
  height: 70vh;
  max-width: 700px;
  max-height: 850px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 
    0 40px 100px rgba(0, 0, 0, 0.5),
    0 20px 50px rgba(0, 0, 0, 0.3);

  .diag-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-brightness-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
}

// 对角遮罩
.diag-mask {
  position: absolute;
  left: calc(50% - 27.5vw);
  top: calc(50% - 35vh);
  width: 55vw;
  height: 70vh;
  max-width: 700px;
  max-height: 850px;
  z-index: 10;
  pointer-events: none;
  transform-origin: left top;
}

.mask-surface {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    #2d2640 0%,
    #1f1a30 50%,
    #252033 100%
  );
  clip-path: polygon(0% 0%, 100% 100%, 100% 0%);

  .mask-texture {
    position: absolute;
    inset: 0;
    background-image: 
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.02) 2px,
        rgba(255, 255, 255, 0.02) 4px
      );
  }
}

// 刀锋边缘
.mask-edge {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 11;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 3px;
    height: 200%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(255, 200, 150, 0.6) 20%,
      rgba(255, 220, 180, 0.8) 50%,
      rgba(255, 200, 150, 0.6) 80%,
      transparent 100%
    );
    transform: translateX(50%) rotate(45deg);
    transform-origin: top center;
    box-shadow: 
      0 0 15px rgba(255, 200, 150, 0.4),
      0 0 30px rgba(255, 200, 150, 0.2);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 200%;
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(50%) rotate(45deg);
    transform-origin: top center;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  }
}

// 内容层
.diag-content {
  position: absolute;
  right: 8vw;
  top: 50%;
  transform: translateY(-50%);
  max-width: 380px;
  text-align: right;
  z-index: 20;
}

.diag-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.3em;
  letter-spacing: 0.02em;
  text-shadow: 
    0 0 60px rgba(255, 200, 150, 0.3),
    0 4px 20px rgba(0, 0, 0, 0.5);
  line-height: 1.05;
}

.diag-subtitle {
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1.5em;
  letter-spacing: 0.2em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.diag-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 200, 150, 0.8) 50%,
    transparent 100%
  );
  margin: 0 0 1.5em;
  margin-left: auto;
  box-shadow: 0 0 15px rgba(255, 200, 150, 0.3);
}

.diag-description {
  font-size: clamp(0.9rem, 1.5vw, 1.05rem);
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.9;
  margin: 0 0 2em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.diag-cta {
  display: inline-block;
  padding: 1em 2.5em;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: #1a1625;
  background: linear-gradient(
    135deg,
    #ffd700 0%,
    #ffb347 50%,
    #ffd700 100%
  );
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 20px rgba(255, 200, 100, 0.4),
    0 2px 10px rgba(255, 180, 80, 0.3);

  &:hover {
    transform: translateX(-5px);
    box-shadow: 
      0 6px 30px rgba(255, 200, 100, 0.6),
      0 3px 15px rgba(255, 180, 80, 0.4);
  }
}

// 角落装饰
.corner-decoration {
  position: absolute;
  width: 80px;
  height: 80px;
  pointer-events: none;
  z-index: 15;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(255, 200, 150, 0.4);
  }

  &.top-left {
    top: 40px;
    left: 40px;

    &::before {
      top: 0;
      left: 0;
      width: 40px;
      height: 2px;
    }

    &::after {
      top: 0;
      left: 0;
      width: 2px;
      height: 40px;
    }
  }

  &.bottom-right {
    bottom: 40px;
    right: 40px;

    &::before {
      bottom: 0;
      right: 0;
      width: 40px;
      height: 2px;
    }

    &::after {
      bottom: 0;
      right: 0;
      width: 2px;
      height: 40px;
    }
  }
}
</style>
