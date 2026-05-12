<template>
  <div ref="parentRef" class="dust-container">
    <!-- 温暖渐变背景 -->
    <div class="dust-bg">
      <div class="bg-gradient" />
      <div class="bg-particles" />
    </div>

    <!-- 尘埃粒子 -->
    <div ref="dustParticlesRef" class="dust-particles">
      <div v-for="i in 30" :key="i" :ref="(el) => setDustRef(el, i)" class="dust-particle" />
    </div>

    <!-- 晨风效果 -->
    <div ref="windStreamRef" class="wind-streams">
      <svg class="wind-svg" viewBox="0 0 400 800" preserveAspectRatio="none">
        <path
          v-for="i in 8"
          :key="i"
          :ref="(el) => setWindPathRef(el, i)"
          class="wind-path"
          :d="getWindPath(i)"
        />
      </svg>
    </div>

    <!-- 主内容 -->
    <div class="dust-content">
      <!-- 左侧区域 -->
      <div class="dust-left">
        <div ref="labelRef" class="time-label">
          <span class="label-line" />
          <span class="label-text">MORNING LIGHT</span>
        </div>
        <h1 ref="titleRef" class="title">
          <span class="char" v-for="(char, i) in '晨风拂尘'" :key="i">{{ char }}</span>
        </h1>
        <p ref="subtitleRef" class="subtitle">
          相纸苏醒
        </p>
        <div ref="descRef" class="description">
          <p>古旧相纸静卧尘光</p>
          <p>晨风徐来，尘埃散逸</p>
          <p>轻柔唤醒沉睡记忆</p>
        </div>
        <div ref="decorRef" class="decorations">
          <span class="deco-line" />
          <span class="deco-dot" />
          <span class="deco-line" />
        </div>
      </div>

      <!-- 右侧相纸区域 -->
      <div class="dust-right">
        <div ref="photoFrameRef" class="photo-frame">
          <!-- 纸角卷曲 -->
          <div class="corner corner-tl" />
          <div class="corner corner-tr" />
          <div class="corner corner-bl" />
          <div class="corner corner-br" />

          <!-- 相纸 -->
          <div ref="photoPaperRef" class="photo-paper">
            <img
              ref="imageRef"
              src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80"
              alt="晨风拂尘"
              class="photo-image"
            />

            <!-- 柔白光泽 -->
            <div ref="whiteSheenRef" class="white-sheen" />
          </div>

          <!-- 边框装饰 -->
          <div class="frame-border" />
        </div>

        <!-- 相纸信息 -->
        <div ref="photoInfoRef" class="photo-info">
          <span class="info-label">PHOTO</span>
          <span class="info-line" />
          <span class="info-value">Memory #024</span>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div ref="scrollHintRef" class="scroll-hint">
      <span class="hint-text">GENTLY WOKEN</span>
      <div class="hint-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <!-- 光束效果 -->
    <div ref="lightBeamRef" class="light-beam" />
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
const dustParticlesRef = ref<HTMLElement | null>(null)
const windStreamRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const labelRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const decorRef = ref<HTMLElement | null>(null)
const photoFrameRef = ref<HTMLElement | null>(null)
const photoPaperRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const whiteSheenRef = ref<HTMLElement | null>(null)
const photoInfoRef = ref<HTMLElement | null>(null)
const scrollHintRef = ref<HTMLElement | null>(null)
const lightBeamRef = ref<HTMLElement | null>(null)

const dustRefs: (HTMLElement | null)[] = []
const windPathRefs: (SVGPathElement | null)[] = []

const setDustRef = (el: unknown, index: number) => {
  dustRefs[index] = el as HTMLElement | null
}

const setWindPathRef = (el: unknown, index: number) => {
  windPathRefs[index] = el as SVGPathElement | null
}

const getWindPath = (index: number): string => {
  const y = 800 - index * 100
  const midX = 150 + Math.sin(index) * 80
  return `M 0 ${y} Q ${midX} ${y - 60} 200 ${y - 30} T 400 ${y - 10}`
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

  // 相纸核心动画
  tl.fromTo(
    photoPaperRef.value,
    {
      y: 50,
      opacity: 0,
      scale: 0.88,
      filter: 'blur(12px) brightness(0.7)',
      boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)'
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px) brightness(1)',
      boxShadow: '0 8px 40px rgba(255,255,255,0.15)',
      duration: 1.6,
      ease: 'power2.out'
    },
    0
  )

  // 纸角微卷动画
  const corners = photoFrameRef.value?.querySelectorAll('.corner')
  if (corners) {
    corners.forEach((corner, i) => {
      const direction = i < 2 ? 1 : -1
      tl.fromTo(
        corner,
        { rotate: 0, scale: 1 },
        {
          rotate: direction * 3,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.inOut'
        },
        0.6 + i * 0.08
      )
      tl.to(
        corner,
        {
          rotate: 0,
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)'
        },
        0.9 + i * 0.08
      )
    })
  }

  // 柔白光泽
  tl.fromTo(
    whiteSheenRef.value,
    { opacity: 0 },
    { opacity: 0.4, duration: 0.8 },
    1.2
  )

  // 光束效果
  tl.fromTo(
    lightBeamRef.value,
    { opacity: 0, x: -100 },
    { opacity: 0.15, x: 0, duration: 1 },
    0.3
  )

  // 文字入场
  tl.fromTo(
    labelRef.value,
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 0.6 },
    0.3
  )

  tl.fromTo(
    titleRef.value,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' },
    0.4
  )

  tl.fromTo(
    subtitleRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 },
    0.6
  )

  tl.fromTo(
    descRef.value,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.6 },
    0.8
  )

  tl.fromTo(
    decorRef.value,
    { scaleX: 0 },
    { scaleX: 1, duration: 0.5 },
    1.0
  )

  // 相纸信息
  tl.fromTo(
    photoInfoRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 },
    1.1
  )

  // 滚动提示
  tl.fromTo(
    scrollHintRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
    1.3
  )

  // 晨风路径动画
  windPathRefs.forEach((path, i) => {
    if (!path) return
    const length = path.getTotalLength()
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })

    tl.to(
      path,
      {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.inOut'
      },
      i * 0.15
    )
  })

  // 尘埃粒子动画
  dustRefs.forEach((dust, i) => {
    if (!dust) return

    const startX = Math.random() * 100 - 50
    const startY = Math.random() * 100 + 50
    const endX = startX + (Math.random() - 0.5) * 200
    const endY = startY - 150 - Math.random() * 200
    const delay = Math.random() * 1.5
    const size = Math.random() * 3 + 1

    gsap.set(dust, {
      x: startX,
      y: startY,
      opacity: 0,
      scale: size
    })

    gsap.to(dust, {
      x: endX,
      y: endY,
      opacity: 0.7,
      scale: size * 0.5,
      duration: 2 + Math.random(),
      delay,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })

    gsap.to(dust, {
      opacity: 0,
      duration: 0.5,
      delay: delay + 1.5,
      ease: 'power2.out'
    })
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
.dust-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #faf6f1 0%, #f8f4ef 50%, #f5f0eb 100%);
  color: #4a4039;
  font-family: 'Noto Serif SC', serif;
}

// 温暖渐变背景
.dust-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 70%, rgba(255, 248, 240, 0.8) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(255, 245, 235, 0.6) 0%, transparent 40%);
  }

  .bg-particles {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1px 1px at 15% 25%, rgba(200, 180, 160, 0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 35% 55%, rgba(200, 180, 160, 0.2) 0%, transparent 100%),
      radial-gradient(1px 1px at 65% 35%, rgba(200, 180, 160, 0.25) 0%, transparent 100%),
      radial-gradient(1px 1px at 85% 75%, rgba(200, 180, 160, 0.2) 0%, transparent 100%);
  }
}

// 尘埃粒子
.dust-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.dust-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, rgba(180, 160, 140, 0.8) 0%, rgba(180, 160, 140, 0.3) 100%);
  border-radius: 50%;
  filter: blur(0.5px);
}

// 晨风效果
.wind-streams {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  overflow: hidden;

  .wind-svg {
    width: 100%;
    height: 100%;
  }

  .wind-path {
    fill: none;
    stroke: rgba(255, 250, 245, 0.4);
    stroke-width: 1;
  }
}

// 光束效果
.light-beam {
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 248, 240, 0.3) 0%,
    rgba(255, 250, 245, 0.15) 50%,
    transparent 100%
  );
  clip-path: polygon(30% 0%, 100% 0%, 80% 100%, 0% 100%);
  pointer-events: none;
  z-index: 2;
}

// 主内容
.dust-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 60px 100px;
  z-index: 10;
}

// 左侧文字
.dust-left {
  flex: 0 0 38%;
  max-width: 480px;
}

.time-label {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  font-size: 11px;
  font-family: 'Playfair Display', serif;
  letter-spacing: 3px;
  color: #b8a090;

  .label-line {
    width: 40px;
    height: 1px;
    background: #b8a090;
  }

  .label-text {
    text-transform: uppercase;
  }
}

.title {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 16px;
  color: #3d3530;

  .char {
    display: inline-block;
    margin-right: 4px;
  }
}

.subtitle {
  font-size: 24px;
  font-weight: 400;
  color: #8b7355;
  margin: 0 0 32px;
  letter-spacing: 8px;
}

.description {
  margin-bottom: 40px;

  p {
    font-size: 15px;
    line-height: 2;
    color: #7a6a5a;
    margin: 0;
  }
}

.decorations {
  display: flex;
  align-items: center;
  gap: 20px;
  transform-origin: left;

  .deco-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #c4b4a4 0%, transparent 100%);
  }

  .deco-dot {
    width: 6px;
    height: 6px;
    background: #b8a090;
    border-radius: 50%;
  }
}

// 右侧相纸
.dust-right {
  flex: 0 0 52%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-frame {
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 4 / 3;
  padding: 20px;
}

// 纸角
.corner {
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f0ebe5 0%, #e8e2db 100%);
  z-index: 5;
  transform-origin: center;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &.corner-tl {
    top: 0;
    left: 0;
    border-radius: 4px 0 4px 0;
  }

  &.corner-tr {
    top: 0;
    right: 0;
    border-radius: 0 4px 0 4px;
  }

  &.corner-bl {
    bottom: 0;
    left: 0;
    border-radius: 0 4px 0 4px;
  }

  &.corner-br {
    bottom: 0;
    right: 0;
    border-radius: 4px 0 4px 0;
  }
}

// 相纸
.photo-paper {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f4ef;
  border-radius: 2px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 20px rgba(0, 0, 0, 0.1),
    inset 0 0 40px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.white-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 40%,
    rgba(255, 255, 255, 0.2) 60%,
    transparent 100%
  );
  pointer-events: none;
}

// 边框
.frame-border {
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(180, 160, 140, 0.3);
  border-radius: 2px;
  pointer-events: none;
}

// 相纸信息
.photo-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding: 12px 24px;
  background: rgba(255, 252, 248, 0.8);
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);

  .info-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: #b8a090;
  }

  .info-line {
    width: 20px;
    height: 1px;
    background: #c4b4a4;
  }

  .info-value {
    font-size: 13px;
    color: #6b5a4a;
    font-style: italic;
  }
}

// 底部提示
.scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .hint-text {
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(180, 160, 140, 0.6);
  }

  .hint-icon {
    width: 24px;
    height: 24px;
    color: #b8a090;
    animation: bounceDown 2s ease-in-out infinite;
  }
}

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}
</style>
