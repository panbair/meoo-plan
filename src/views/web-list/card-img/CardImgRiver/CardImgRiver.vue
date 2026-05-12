<template>
  <div ref="parentRef" class="river-container">
    <!-- 深蓝渐变背景 -->
    <div class="river-bg">
      <div class="bg-layer layer-1" />
      <div class="bg-layer layer-2" />
      <div class="bg-particles" />
    </div>

    <!-- 气泡粒子容器 -->
    <div ref="bubblesRef" class="bubbles-container">
      <div v-for="i in 20" :key="i" :ref="(el) => setBubbleRef(el, i)" class="bubble" />
    </div>

    <!-- 主内容 -->
    <div class="river-content">
      <!-- 左侧标题 -->
      <div class="river-text">
        <div ref="subtitleRef" class="subtitle">
          <span class="line"></span>
          <span class="text">DEEP WATER</span>
          <span class="line"></span>
        </div>
        <h1 ref="titleRef" class="title">
          <span class="char" v-for="(char, i) in '暗'" :key="`title-0-${i}`">{{ char }}</span>
          河
          <span class="char" v-for="(char, i) in '浮'" :key="`title-1-${i}`">{{ char }}</span>
          碑
        </h1>
        <p ref="descRef" class="description">
          从幽暗深处缓缓浮升<br>
          穿越时光的沉睡记忆
        </p>
        <div ref="dividerRef" class="divider">
          <span class="dot" />
          <span class="line-h" />
          <span class="dot" />
        </div>
        <div ref="scrollHintRef" class="scroll-hint">
          <span class="hint-text">SCROLL TO REVEAL</span>
          <div class="hint-arrow">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 右侧图片区域 -->
      <div class="river-image-wrapper">
        <!-- 深蓝遮罩 -->
        <div ref="darkOverlayRef" class="dark-overlay" />

        <!-- 图片 -->
        <div ref="imageContainerRef" class="image-container">
          <img
            ref="imageRef"
            src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1400&q=85"
            alt="深水浮碑"
            class="river-image"
          />

          <!-- 水膜光泽 -->
          <div ref="waterSheenRef" class="water-sheen" />
        </div>

        <!-- 水流光纹 -->
        <div ref="lightStreamRef" class="light-stream">
          <div class="stream-line" v-for="i in 5" :key="i" />
        </div>

        <!-- 边框装饰 -->
        <div class="frame-corner top-left" />
        <div class="frame-corner top-right" />
        <div class="frame-corner bottom-left" />
        <div class="frame-corner bottom-right" />
      </div>
    </div>

    <!-- 底部装饰 -->
    <div ref="bottomDecorRef" class="bottom-decor">
      <div class="depth-marker">
        <span class="depth-label">DEPTH</span>
        <div class="depth-bar">
          <div ref="depthFillRef" class="depth-fill" />
        </div>
        <span ref="depthValueRef" class="depth-value">0M</span>
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

const parentRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const darkOverlayRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const scrollHintRef = ref<HTMLElement | null>(null)
const lightStreamRef = ref<HTMLElement | null>(null)
const waterSheenRef = ref<HTMLElement | null>(null)
const bubblesRef = ref<HTMLElement | null>(null)
const bottomDecorRef = ref<HTMLElement | null>(null)
const depthFillRef = ref<HTMLElement | null>(null)
const depthValueRef = ref<HTMLElement | null>(null)

const bubbleRefs: (HTMLElement | null)[] = []

const setBubbleRef = (el: unknown, index: number) => {
  bubbleRefs[index] = el as HTMLElement | null
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

  // 深度指示器
  tl.fromTo(
    depthFillRef.value,
    { scaleX: 0 },
    { scaleX: 1, duration: 1 },
    0
  )
  tl.fromTo(
    depthValueRef.value,
    { textContent: '0M' },
    { textContent: '500M', duration: 1, snap: { textContent: 10 } },
    0
  )

  // 图片浮升核心动画
  tl.fromTo(
    imageContainerRef.value,
    {
      y: 100,
      opacity: 0,
      scale: 0.85,
      filter: 'blur(20px) brightness(0.3)'
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px) brightness(1)',
      duration: 1.8,
      ease: 'power3.out'
    },
    0.2
  )

  // 深蓝遮罩消退
  tl.fromTo(
    darkOverlayRef.value,
    { opacity: 1 },
    { opacity: 0, duration: 1.5 },
    0.3
  )

  // 水膜光泽
  tl.fromTo(
    waterSheenRef.value,
    { opacity: 0 },
    { opacity: 0.3, duration: 0.5 },
    1.2
  )

  // 水流光纹
  const streamLines = lightStreamRef.value?.querySelectorAll('.stream-line')
  if (streamLines) {
    streamLines.forEach((line, i) => {
      tl.fromTo(
        line,
        {
          opacity: 0,
          x: '-100%'
        },
        {
          opacity: 0.6,
          x: '200%',
          duration: 0.8,
          ease: 'power2.inOut'
        },
        0.5 + i * 0.15
      )
    })
  }

  // 文字入场
  tl.fromTo(
    subtitleRef.value,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.6 },
    0.4
  )

  tl.fromTo(
    titleRef.value,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' },
    0.5
  )

  tl.fromTo(
    descRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 },
    0.7
  )

  tl.fromTo(
    dividerRef.value,
    { scaleX: 0 },
    { scaleX: 1, duration: 0.6 },
    0.9
  )

  tl.fromTo(
    scrollHintRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
    1.1
  )

  // 底部装饰
  tl.fromTo(
    bottomDecorRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 },
    0.3
  )

  // 气泡动画
  bubbleRefs.forEach((bubble, i) => {
    if (!bubble) return
    const delay = Math.random() * 2
    gsap.fromTo(
      bubble,
      {
        y: 100 + Math.random() * 200,
        x: Math.random() * 40 - 20,
        opacity: 0,
        scale: Math.random() * 0.5 + 0.3
      },
      {
        y: -50 - Math.random() * 100,
        x: Math.random() * 60 - 30,
        opacity: 0.8,
        scale: Math.random() * 0.3 + 0.2,
        duration: 3 + Math.random() * 2,
        delay,
        repeat: -1,
        ease: 'power1.out'
      }
    )
  })

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
.river-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #122a4a 100%);
  color: #e8f4f8;
  font-family: 'Noto Serif SC', serif;
}

// 深蓝渐变背景
.river-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-layer {
    position: absolute;
    inset: 0;

    &.layer-1 {
      background: radial-gradient(ellipse at 70% 50%, rgba(20, 60, 100, 0.4) 0%, transparent 60%);
    }

    &.layer-2 {
      background: radial-gradient(ellipse at 30% 80%, rgba(10, 40, 70, 0.5) 0%, transparent 50%);
    }
  }
}

.bg-particles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 100%),
    radial-gradient(1px 1px at 40% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 100%),
    radial-gradient(1px 1px at 60% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 100%),
    radial-gradient(1px 1px at 80% 60%, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
}

// 气泡
.bubbles-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bubble {
  position: absolute;
  bottom: 20%;
  left: 55%;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2));
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
}

// 主内容
.river-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 60px 80px;
  z-index: 2;
}

// 左侧文字
.river-text {
  flex: 0 0 35%;
  max-width: 450px;
}

.subtitle {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-family: 'Playfair Display', serif;
  letter-spacing: 4px;
  color: #5ba3c0;
  margin-bottom: 20px;
  text-transform: uppercase;

  .line {
    width: 30px;
    height: 1px;
    background: #5ba3c0;
  }
}

.title {
  font-size: 72px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 24px;
  background: linear-gradient(135deg, #ffffff 0%, #a8d8ea 50%, #5ba3c0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(91, 163, 192, 0.3);

  .char {
    display: inline-block;
  }
}

.description {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(168, 216, 234, 0.8);
  margin: 0 0 30px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
  transform-origin: left;

  .dot {
    width: 6px;
    height: 6px;
    background: #5ba3c0;
    border-radius: 50%;
  }

  .line-h {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #5ba3c0 0%, transparent 100%);
  }
}

.scroll-hint {
  display: flex;
  align-items: center;
  gap: 12px;

  .hint-text {
    font-size: 11px;
    letter-spacing: 2px;
    color: rgba(91, 163, 192, 0.6);
  }

  .hint-arrow {
    width: 20px;
    height: 20px;
    color: #5ba3c0;
    animation: bounceDown 2s ease-in-out infinite;
  }
}

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

// 右侧图片
.river-image-wrapper {
  position: relative;
  flex: 0 0 55%;
  height: 75vh;
  max-height: 700px;
}

.dark-overlay {
  position: absolute;
  inset: -20px;
  background: linear-gradient(180deg, rgba(10, 22, 40, 0.9) 0%, rgba(10, 40, 70, 0.95) 100%);
  z-index: 3;
  border-radius: 4px;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.6),
    0 10px 30px rgba(0, 0, 0, 0.4);
}

.river-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.water-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(168, 216, 234, 0.15) 30%,
    transparent 60%,
    rgba(168, 216, 234, 0.1) 100%
  );
  pointer-events: none;
  border-radius: 4px;
}

// 水流光纹
.light-stream {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 4px;

  .stream-line {
    position: absolute;
    width: 200%;
    height: 2px;
    left: -50%;
    background: linear-gradient(90deg, transparent 0%, rgba(168, 216, 234, 0.4) 50%, transparent 100%);
    opacity: 0;

    &:nth-child(1) { top: 20%; }
    &:nth-child(2) { top: 35%; }
    &:nth-child(3) { top: 50%; }
    &:nth-child(4) { top: 65%; }
    &:nth-child(5) { top: 80%; }
  }
}

// 边框装饰
.frame-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: rgba(91, 163, 192, 0.4);
  border-style: solid;
  border-width: 0;

  &.top-left {
    top: -10px;
    left: -10px;
    border-top-width: 2px;
    border-left-width: 2px;
  }

  &.top-right {
    top: -10px;
    right: -10px;
    border-top-width: 2px;
    border-right-width: 2px;
  }

  &.bottom-left {
    bottom: -10px;
    left: -10px;
    border-bottom-width: 2px;
    border-left-width: 2px;
  }

  &.bottom-right {
    bottom: -10px;
    right: -10px;
    border-bottom-width: 2px;
    border-right-width: 2px;
  }
}

// 底部装饰
.bottom-decor {
  position: absolute;
  bottom: 40px;
  left: 80px;
  right: 80px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 10;
}

.depth-marker {
  display: flex;
  align-items: center;
  gap: 12px;

  .depth-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(91, 163, 192, 0.6);
  }

  .depth-bar {
    width: 120px;
    height: 3px;
    background: rgba(91, 163, 192, 0.2);
    border-radius: 2px;
    overflow: hidden;

    .depth-fill {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #5ba3c0 0%, #a8d8ea 100%);
      border-radius: 2px;
      transform-origin: left;
    }
  }

  .depth-value {
    font-size: 14px;
    font-family: 'JetBrains Mono', monospace;
    color: #5ba3c0;
  }
}
</style>
