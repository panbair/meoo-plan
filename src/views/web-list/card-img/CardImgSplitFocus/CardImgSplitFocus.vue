<template>
  <div class="card-split-focus">
    <div class="split-bg">
      <div class="bg-gradient"></div>
      <div class="bg-grid"></div>
      <div class="rangefinder-frame top"></div>
      <div class="rangefinder-frame bottom"></div>
    </div>

    <div ref="parentRef" class="split-container">
      <!-- 取景框主体 -->
      <div ref="frameRef" class="split-frame">
        <!-- 上半区 -->
        <div ref="topHalfRef" class="split-half top">
          <div class="half-inner">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"
              alt=""
            />
          </div>
          <!-- RGB 通道 -->
          <div class="rgb-layer red" style="--offset: -2px">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85" alt="" />
          </div>
          <div class="rgb-layer blue" style="--offset: 2px">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85" alt="" />
          </div>
        </div>

        <!-- 下半区 -->
        <div ref="bottomHalfRef" class="split-half bottom">
          <div class="half-inner">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"
              alt=""
            />
          </div>
          <!-- RGB 通道 -->
          <div class="rgb-layer red" style="--offset: -2px">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85" alt="" />
          </div>
          <div class="rgb-layer blue" style="--offset: 2px">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85" alt="" />
          </div>
        </div>

        <!-- 裂像线 -->
        <div ref="splitLineRef" class="split-line"></div>

        <!-- 暗角遮罩 -->
        <div ref="vignetteRef" class="split-vignette"></div>

        <!-- 镀膜反光 -->
        <div ref="coatingRef" class="split-coating"></div>
      </div>

      <!-- 对焦指示器 -->
      <div class="focus-indicator">
        <div class="indicator-ring outer"></div>
        <div class="indicator-ring inner"></div>
        <div class="indicator-dot"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="split-title">
      <h2>Split Prism</h2>
      <p>裂像对焦</p>
    </div>

    <!-- 装饰 -->
    <div class="split-decoration">
      <div class="decoration-line left"></div>
      <div class="decoration-line right"></div>
      <div class="decoration-circle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const topHalfRef = ref<HTMLElement | null>(null)
const bottomHalfRef = ref<HTMLElement | null>(null)
const splitLineRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const coatingRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  // 初始状态
  gsap.set(frameRef.value, {
    scale: 0.08,
    filter: 'blur(18px)',
    clipPath: 'circle(5% at center)'
  })
  gsap.set(topHalfRef.value, { x: -6 })
  gsap.set(bottomHalfRef.value, { x: 6 })
  gsap.set('.rgb-layer', { opacity: 0.5 })
  gsap.set(splitLineRef.value, { opacity: 1 })
  gsap.set(vignetteRef.value, { opacity: 0 })
  gsap.set(coatingRef.value, { opacity: 0 })
  gsap.set(titleRef.value, { opacity: 0, y: 20 })

  const trigger = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 85%',
    end: 'bottom 20%',
    scrub: 1.5,
    onEnter: () => {
      gsap.set(frameRef.value, {
        scale: 0.08,
        filter: 'blur(18px)',
        clipPath: 'circle(5% at center)'
      })
      gsap.set(topHalfRef.value, { x: -6 })
      gsap.set(bottomHalfRef.value, { x: 6 })
      gsap.set(splitLineRef.value, { opacity: 1 })
    },
    onUpdate: (self) => {
      const p = self.progress
      const frame = frameRef.value
      const topHalf = topHalfRef.value
      const bottomHalf = bottomHalfRef.value

      if (!frame || !topHalf || !bottomHalf) return

      // 主属性：scale + blur
      const scale = 0.08 + (1 - 0.08) * Math.pow(p, 0.6)
      gsap.set(frame, { scale, filter: `blur(${18 * (1 - Math.pow(p, 0.8))}px)` })

      // 上下半区裂像校准（提前于模糊消除）
      const alignP = Math.min(p / 0.75, 1)
      const offset = 6 * (1 - Math.pow(alignP, 1.3))
      gsap.set(topHalf, { x: -offset })
      gsap.set(bottomHalf, { x: offset })

      // RGB 色散
      const rgbOffset = 2 * (1 - Math.pow(Math.min(p / 0.7, 1), 1.5))
      gsap.set('.rgb-layer.red', { x: -rgbOffset, y: -rgbOffset })
      gsap.set('.rgb-layer.blue', { x: rgbOffset, y: rgbOffset })

      // clip-path：从圆形到矩形
      if (p < 0.8) {
        const circleP = p / 0.8
        const radius = 5 + 45 * Math.pow(circleP, 0.7)
        gsap.set(frame, { clipPath: `circle(${radius}% at center)` })
      } else {
        const rectP = (p - 0.8) / 0.2
        const insetX = 5 * (1 - rectP)
        gsap.set(frame, { clipPath: `inset(${insetX}% ${insetX * 1.5}%)` })
      }

      // 对焦过冲（80%-95%）
      let focusOver = 0
      let scaleOver = 0
      if (p >= 0.8 && p < 0.95) {
        const overP = (p - 0.8) / 0.15
        focusOver = 1.2 * Math.sin(overP * Math.PI)
        scaleOver = 0.01 * Math.sin(overP * Math.PI)
      }
      gsap.set(frame, {
        filter: `blur(${18 * (1 - Math.pow(p, 0.8)) + focusOver}px)`,
        scale: scale + scaleOver
      })

      // 裂像线消融
      if (p >= 0.75) {
        const lineP = (p - 0.75) / 0.2
        gsap.set(splitLineRef.value, { opacity: 1 - Math.pow(lineP, 0.5) })
      }

      // 暗角
      if (p >= 0.6) {
        const vigP = (p - 0.6) / 0.4
        gsap.set(vignetteRef.value, { opacity: 0.6 * Math.pow(vigP, 0.4) })
      }

      // 绿色镀膜反光（完成后呼吸）
      if (p >= 0.9) {
        const coatP = (p - 0.9) / 0.1
        const coatOpacity = 0.12 + 0.05 * Math.sin(Date.now() / 600)
        gsap.set(coatingRef.value, { opacity: coatOpacity })
      }

      // 标题
      if (p >= 0.7) {
        const titleP = (p - 0.7) / 0.3
        gsap.set(titleRef.value, { opacity: titleP, y: 20 * (1 - titleP) })
      }
    },
    onLeaveBack: () => {
      gsap.set(frameRef.value, {
        scale: 0.08,
        filter: 'blur(18px)',
        clipPath: 'circle(5% at center)'
      })
      gsap.set(topHalfRef.value, { x: -6 })
      gsap.set(bottomHalfRef.value, { x: 6 })
      gsap.set(splitLineRef.value, { opacity: 1 })
      gsap.set(vignetteRef.value, { opacity: 0 })
      gsap.set(coatingRef.value, { opacity: 0 })
      gsap.set(titleRef.value, { opacity: 0, y: 20 })
    }
  })

  cleanupFns.push(() => trigger.kill())

  // 持续呼吸动画
  const coatingAnim = gsap.to(coatingRef.value, {
    opacity: 0.2,
    duration: 5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    paused: true
  })
  cleanupFns.push(() => coatingAnim.kill())

  const indicatorAnim = gsap.to('.focus-indicator', {
    opacity: 0.3,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  })
  cleanupFns.push(() => indicatorAnim.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.card-split-focus {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #080c0a;
}

.split-bg {
  position: absolute;
  inset: 0;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 40% 35% at 50% 50%, rgba(100, 150, 120, 0.04) 0%, transparent 70%),
      linear-gradient(180deg, #080c0a 0%, #0c100e 50%, #080c0a 100%);
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(100, 150, 120, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100, 150, 120, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
  }
}

.rangefinder-frame {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(100, 150, 120, 0.3) 20%,
    rgba(100, 150, 120, 0.3) 80%,
    transparent 100%
  );

  &.top { top: 60px; }
  &.bottom { bottom: 60px; }
}

.split-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.split-frame {
  position: relative;
  width: 480px;
  height: 320px;
  transform-origin: center;
  overflow: hidden;
  border-radius: 4px;
}

.split-half {
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  overflow: hidden;

  &.top {
    top: 0;
    clip-path: inset(0 0 50% 0);
  }

  &.bottom {
    bottom: 0;
    clip-path: inset(50% 0 0 0);
  }

  .half-inner {
    position: absolute;
    inset: 0;

    img {
      width: 100%;
      height: 200%;
      object-fit: cover;
      object-position: center;
    }
  }

  .rgb-layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    mix-blend-mode: screen;
    opacity: 0.5;

    img {
      width: 100%;
      height: 200%;
      object-fit: cover;
      object-position: center;
    }

    &.red {
      filter: hue-rotate(340deg) saturate(2);
    }

    &.blue {
      filter: hue-rotate(200deg) saturate(2);
    }
  }
}

.split-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(200, 255, 200, 0.8);
  transform: translateY(-50%);
  box-shadow: 0 0 4px rgba(200, 255, 200, 0.6);
  pointer-events: none;
}

.split-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 65% 55% at center, transparent 25%, rgba(0, 0, 0, 0.85) 100%);
}

.split-coating {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow:
    inset 0 0 40px rgba(100, 200, 120, 0.12),
    inset 0 0 80px rgba(80, 180, 100, 0.06);
}

.focus-indicator {
  position: absolute;
  top: 50%;
  right: -100px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;

  .indicator-ring {
    position: absolute;
    border: 1px solid rgba(100, 150, 120, 0.3);
    border-radius: 50%;

    &.outer {
      width: 40px;
      height: 40px;
    }

    &.inner {
      width: 20px;
      height: 20px;
    }
  }

  .indicator-dot {
    width: 4px;
    height: 4px;
    background: rgba(100, 200, 120, 0.6);
    border-radius: 50%;
  }
}

.split-title {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  h2 {
    font-size: 38px;
    font-weight: 200;
    color: #c8e8d0;
    margin: 0 0 10px;
    letter-spacing: 10px;
    text-transform: uppercase;
    text-shadow: 0 0 40px rgba(100, 200, 120, 0.3);
  }

  p {
    font-size: 14px;
    color: rgba(150, 200, 160, 0.5);
    margin: 0;
    letter-spacing: 6px;
  }
}

.split-decoration {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;

  .decoration-line {
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(100, 150, 120, 0.3));

    &.left {
      background: linear-gradient(90deg, transparent, rgba(100, 150, 120, 0.3));
    }

    &.right {
      background: linear-gradient(90deg, rgba(100, 150, 120, 0.3), transparent);
    }
  }

  .decoration-circle {
    width: 6px;
    height: 6px;
    border: 1px solid rgba(100, 150, 120, 0.4);
    border-radius: 50%;
  }
}
</style>
