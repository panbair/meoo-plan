<template>
  <div ref="containerRef" class="double-edge-container">
    <!-- 背景渐变 -->
    <div class="bg-gradient" />

    <!-- 主图片 -->
    <div class="image-wrapper">
      <img
        ref="mainImageRef"
        class="main-image"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        alt="Mountain Landscape"
      />
      <div class="image-brightness" />
    </div>

    <!-- 四块三角形遮罩 -->
    <div class="mask-container">
      <!-- 左上遮罩 -->
      <div ref="maskTLRef" class="mask mask-tl">
        <div class="mask-content" />
        <div class="mask-edge edge-right" />
        <div class="mask-edge edge-bottom" />
      </div>

      <!-- 右上遮罩 -->
      <div ref="maskTRRef" class="mask mask-tr">
        <div class="mask-content" />
        <div class="mask-edge edge-left" />
        <div class="mask-edge edge-bottom" />
      </div>

      <!-- 左下遮罩 -->
      <div ref="maskBLRef" class="mask mask-bl">
        <div class="mask-content" />
        <div class="mask-edge edge-right" />
        <div class="mask-edge edge-top" />
      </div>

      <!-- 右下遮罩 -->
      <div ref="maskBRRef" class="mask mask-br">
        <div class="mask-content" />
        <div class="mask-edge edge-left" />
        <div class="mask-edge edge-top" />
      </div>

      <!-- 中心十字闪光 -->
      <div ref="centerFlashRef" class="center-flash">
        <div class="flash-line flash-h" />
        <div class="flash-line flash-v" />
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="decorations">
      <div class="corner-mark top-left" />
      <div class="corner-mark top-right" />
      <div class="corner-mark bottom-left" />
      <div class="corner-mark bottom-right" />
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <div class="content-wrapper">
        <div ref="tagRef" class="content-tag">DUAL SLASH</div>
        <h2 ref="titleRef" class="content-title">Mountain Peaks</h2>
        <p ref="subtitleRef" class="content-subtitle">
          Where Earth Meets Sky
        </p>
        <div ref="ctaRef" class="content-cta">
          <span class="cta-text">Discover More</span>
          <svg class="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-bar">
      <div ref="progressBarRef" class="progress-track">
        <div ref="progressFillRef" class="progress-fill" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const containerRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLElement | null>(null)
const maskTLRef = ref<HTMLElement | null>(null)
const maskTRRef = ref<HTMLElement | null>(null)
const maskBLRef = ref<HTMLElement | null>(null)
const maskBRRef = ref<HTMLElement | null>(null)
const centerFlashRef = ref<HTMLElement | null>(null)
const tagRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)

function initAnimations() {
  if (!containerRef.value) return

  // 初始状态 - 遮罩在原位
  gsap.set([maskTLRef.value, maskTRRef.value, maskBLRef.value, maskBRRef.value], {
    x: 0,
    y: 0,
    opacity: 1
  })

  // 主图初始暗
  gsap.set(mainImageRef.value, {
    filter: 'brightness(0.7)',
    scale: 1.02
  })

  // 十字闪光初始隐藏
  gsap.set(centerFlashRef.value, {
    opacity: 0,
    scale: 0
  })

  // 内容初始隐藏
  gsap.set([tagRef.value, titleRef.value, subtitleRef.value, ctaRef.value], {
    opacity: 0,
    y: 25
  })

  // 进度条初始
  gsap.set(progressFillRef.value, {
    scaleX: 0,
    transformOrigin: 'left center'
  })

  // 创建 ScrollTrigger 驱动的 Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 0%',
      scrub: 1.5
    }
  })

  cleanupFns.push(() => tl.kill())

  // 阶段1: 遮罩沿对角线滑出 (0-60%)
  // 左上向左上滑
  tl.to(maskTLRef.value, {
    x: '-110%',
    y: '-110%',
    duration: 0.5,
    ease: 'power3.inOut'
  }, 0)

  // 右上向右上滑
  tl.to(maskTRRef.value, {
    x: '110%',
    y: '-110%',
    duration: 0.5,
    ease: 'power3.inOut'
  }, 0)

  // 左下向左下滑
  tl.to(maskBLRef.value, {
    x: '-110%',
    y: '110%',
    duration: 0.5,
    ease: 'power3.inOut'
  }, 0)

  // 右下向右下滑
  tl.to(maskBRRef.value, {
    x: '110%',
    y: '110%',
    duration: 0.5,
    ease: 'power3.inOut'
  }, 0)

  // 十字闪光在滑出中途闪过
  tl.to(centerFlashRef.value, {
    opacity: 1,
    scale: 1.5,
    duration: 0.15,
    ease: 'power4.out'
  }, 0.35)

  tl.to(centerFlashRef.value, {
    opacity: 0,
    scale: 2,
    duration: 0.2,
    ease: 'power2.out'
  }, 0.45)

  // 阶段2: 图片亮度恢复 (50-80%)
  tl.to(mainImageRef.value, {
    filter: 'brightness(1)',
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  }, 0.4)

  // 阶段3: 内容淡入 (60-100%)
  tl.to(tagRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.2,
    ease: 'power2.out'
  }, 0.5)

  tl.to(titleRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.2,
    ease: 'power2.out'
  }, 0.55)

  tl.to(subtitleRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.2,
    ease: 'power2.out'
  }, 0.6)

  tl.to(ctaRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.2,
    ease: 'power2.out'
  }, 0.65)

  // 进度条
  tl.to(progressFillRef.value, {
    scaleX: 1,
    duration: 0.5,
    ease: 'power2.inOut'
  }, 0.3)

  // 注册额外的 ScrollTrigger 清理
  ScrollTrigger.getAll().forEach(st => {
    cleanupFns.push(() => st.kill())
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style lang="scss" scoped>
.double-edge-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

// 背景渐变
.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(233, 69, 96, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(67, 97, 238, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(76, 201, 240, 0.1) 0%, transparent 60%);
  z-index: 1;
}

// 主图片
.image-wrapper {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-brightness {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.4) 100%
  );
  pointer-events: none;
}

// 遮罩容器
.mask-container {
  position: absolute;
  inset: 0;
  z-index: 10;
}

// 三角形遮罩基础
.mask {
  position: absolute;
  overflow: hidden;

  .mask-content {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%);
  }

  .mask-edge {
    position: absolute;
    background: linear-gradient(90deg, rgba(233, 69, 96, 0.6), rgba(67, 97, 238, 0.6));
    z-index: 2;
  }
}

// 左上遮罩 - 右斜边 + 下斜边
.mask-tl {
  top: 0;
  left: 0;
  width: 70.7%;
  height: 70.7%;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  transform-origin: right bottom;

  .edge-right {
    width: 3px;
    height: 200%;
    top: 0;
    left: 100%;
    transform-origin: top left;
    transform: rotate(-45deg);
    box-shadow: 0 0 10px rgba(233, 69, 96, 0.8);
  }

  .edge-bottom {
    width: 200%;
    height: 3px;
    bottom: 0;
    left: 0;
    transform-origin: left top;
    transform: rotate(-45deg);
    box-shadow: 0 0 10px rgba(233, 69, 96, 0.8);
  }
}

// 右上遮罩
.mask-tr {
  top: 0;
  right: 0;
  width: 70.7%;
  height: 70.7%;
  clip-path: polygon(100% 0, 100% 100%, 0 0);
  transform-origin: left bottom;

  .edge-left {
    width: 3px;
    height: 200%;
    top: 0;
    right: 100%;
    transform-origin: top right;
    transform: rotate(45deg);
    box-shadow: 0 0 10px rgba(67, 97, 238, 0.8);
  }

  .edge-bottom {
    width: 200%;
    height: 3px;
    bottom: 0;
    right: 0;
    transform-origin: right top;
    transform: rotate(45deg);
    box-shadow: 0 0 10px rgba(67, 97, 238, 0.8);
  }
}

// 左下遮罩
.mask-bl {
  bottom: 0;
  left: 0;
  width: 70.7%;
  height: 70.7%;
  clip-path: polygon(0 0, 0 100%, 100% 100%);
  transform-origin: right top;

  .edge-right {
    width: 3px;
    height: 200%;
    bottom: 0;
    left: 100%;
    transform-origin: bottom left;
    transform: rotate(45deg);
    box-shadow: 0 0 10px rgba(76, 201, 240, 0.8);
  }

  .edge-top {
    width: 200%;
    height: 3px;
    top: 0;
    left: 0;
    transform-origin: left bottom;
    transform: rotate(45deg);
    box-shadow: 0 0 10px rgba(76, 201, 240, 0.8);
  }
}

// 右下遮罩
.mask-br {
  bottom: 0;
  right: 0;
  width: 70.7%;
  height: 70.7%;
  clip-path: polygon(0 100%, 100% 100%, 100% 0);
  transform-origin: left top;

  .edge-left {
    width: 3px;
    height: 200%;
    bottom: 0;
    right: 100%;
    transform-origin: bottom right;
    transform: rotate(-45deg);
    box-shadow: 0 0 10px rgba(230, 180, 50, 0.8);
  }

  .edge-top {
    width: 200%;
    height: 3px;
    top: 0;
    right: 0;
    transform-origin: right bottom;
    transform: rotate(-45deg);
    box-shadow: 0 0 10px rgba(230, 180, 50, 0.8);
  }
}

// 中心十字闪光
.center-flash {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  pointer-events: none;

  .flash-line {
    position: absolute;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.9) 50%,
      transparent 100%
    );

    &.flash-h {
      width: 100%;
      height: 2px;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }

    &.flash-v {
      width: 2px;
      height: 100%;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      background: linear-gradient(
        180deg,
        transparent 0%,
        rgba(255, 255, 255, 0.9) 50%,
        transparent 100%
      );
    }
  }
}

// 角落装饰
.decorations {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;

  .corner-mark {
    position: absolute;
    width: 60px;
    height: 60px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: linear-gradient(135deg, rgba(233, 69, 96, 0.8), rgba(67, 97, 238, 0.8));
    }

    &::before {
      width: 2px;
      height: 100%;
    }

    &::after {
      width: 100%;
      height: 2px;
    }

    &.top-left {
      top: 30px;
      left: 30px;
      &::before { top: 0; left: 0; }
      &::after { top: 0; left: 0; }
    }

    &.top-right {
      top: 30px;
      right: 30px;
      &::before { top: 0; right: 0; }
      &::after { top: 0; right: 0; transform: scaleX(-1); }
    }

    &.bottom-left {
      bottom: 80px;
      left: 30px;
      &::before { bottom: 0; left: 0; transform: scaleY(-1); }
      &::after { bottom: 0; left: 0; transform: scaleY(-1); }
    }

    &.bottom-right {
      bottom: 80px;
      right: 30px;
      &::before { bottom: 0; right: 0; transform: scale(-1); }
      &::after { bottom: 0; right: 0; transform: scale(-1); }
    }
  }
}

// 内容区域
.content-area {
  position: absolute;
  bottom: 120px;
  left: 60px;
  z-index: 20;
}

.content-wrapper {
  max-width: 500px;
}

.content-tag {
  display: inline-block;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: #e94560;
  background: rgba(233, 69, 96, 0.15);
  border: 1px solid rgba(233, 69, 96, 0.3);
  padding: 8px 16px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.content-title {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
  line-height: 1.1;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.content-subtitle {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 32px 0;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.content-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  padding: 14px 28px;
  background: linear-gradient(135deg, #e94560 0%, #4361ee 100%);
  border-radius: 50px;
  box-shadow:
    0 4px 20px rgba(233, 69, 96, 0.4),
    0 0 40px rgba(233, 69, 96, 0.2);
  transition: all 0.3s ease;

  .cta-text {
    letter-spacing: 0.05em;
  }

  .cta-arrow {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateX(5px);
    box-shadow:
      0 6px 30px rgba(233, 69, 96, 0.5),
      0 0 60px rgba(233, 69, 96, 0.3);

    .cta-arrow {
      transform: translateX(5px);
    }
  }
}

// 底部进度条
.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 60px;
  z-index: 20;
}

.progress-track {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  .progress-fill {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #e94560 0%, #4361ee 100%);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
  }
}
</style>
