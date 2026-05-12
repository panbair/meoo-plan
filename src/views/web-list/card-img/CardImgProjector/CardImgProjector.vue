<template>
  <div class="card-projector">
    <div class="projector-bg">
      <div class="bg-gradient"></div>
      <div class="bg-grain"></div>
      <div class="film-strip top"></div>
      <div class="film-strip bottom"></div>
    </div>

    <div ref="parentRef" class="projector-container">
      <!-- 胶片颗粒 SVG 滤镜 -->
      <svg class="filter-svg">
        <defs>
          <filter id="grain-filter">
            <feTurbulence
              ref="turbulenceRef"
              type="fractalNoise"
              baseFrequency="0.08"
              numOctaves="4"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" result="mono" />
            <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
          </filter>
        </defs>
      </svg>

      <!-- 电影画面容器 -->
      <div ref="frameRef" class="projector-frame">
        <!-- RGB 通道层 -->
        <div ref="redChannelRef" class="channel-layer red">
          <img
            src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=85"
            alt=""
          />
        </div>
        <div ref="greenChannelRef" class="channel-layer green">
          <img
            src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=85"
            alt=""
          />
        </div>
        <div ref="blueChannelRef" class="channel-layer blue">
          <img
            src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=85"
            alt=""
          />
        </div>

        <!-- 暗角遮罩 -->
        <div ref="vignetteRef" class="projector-vignette"></div>

        <!-- 胶片颗粒层 -->
        <div ref="grainRef" class="projector-grain"></div>
      </div>

      <!-- 光晕效果 -->
      <div ref="glowRef" class="projector-glow"></div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="projector-title">
      <h2>Cinema</h2>
      <p>放映机启动</p>
    </div>

    <!-- 边框装饰 -->
    <div class="projector-frame-ornament">
      <div class="ornament-corner tl"></div>
      <div class="ornament-corner tr"></div>
      <div class="ornament-corner bl"></div>
      <div class="ornament-corner br"></div>
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
const redChannelRef = ref<HTMLElement | null>(null)
const greenChannelRef = ref<HTMLElement | null>(null)
const blueChannelRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const grainRef = ref<HTMLElement | null>(null)
const turbulenceRef = ref<SVGElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  // 初始状态
  gsap.set(frameRef.value, {
    scale: 0.05,
    filter: 'blur(20px)',
    clipPath: 'circle(5% at center)'
  })
  gsap.set(redChannelRef.value, { x: -4, opacity: 0.8 })
  gsap.set(greenChannelRef.value, { x: 0, opacity: 0.8 })
  gsap.set(blueChannelRef.value, { x: 4, opacity: 0.8 })
  gsap.set(vignetteRef.value, { opacity: 0 })
  gsap.set(grainRef.value, { opacity: 0.4 })
  gsap.set(glowRef.value, { opacity: 0 })
  gsap.set(titleRef.value, { opacity: 0, y: 20 })

  // 设置胶片颗粒滤镜初始值
  if (turbulenceRef.value) {
    gsap.set(turbulenceRef.value, { attr: { baseFrequency: 0.08 } })
  }

  const trigger = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 85%',
    end: 'bottom 20%',
    scrub: 1.5,
    onEnter: () => {
      gsap.set(frameRef.value, {
        scale: 0.05,
        filter: 'blur(20px)',
        clipPath: 'circle(5% at center)'
      })
      gsap.set(redChannelRef.value, { x: -4 })
      gsap.set(greenChannelRef.value, { x: 0 })
      gsap.set(blueChannelRef.value, { x: 4 })
      gsap.set(vignetteRef.value, { opacity: 0 })
    },
    onUpdate: (self) => {
      const p = self.progress
      const frame = frameRef.value
      if (!frame) return

      // 主属性：scale + blur
      const scale = 0.05 + (1 - 0.05) * Math.pow(p, 0.6)
      const blur = 20 * (1 - Math.pow(p, 0.7))

      // 对焦过冲（80%-90%）
      let focusOver = 0
      if (p >= 0.8 && p < 0.9) {
        const overP = (p - 0.8) / 0.1
        focusOver = 1.5 * Math.sin(overP * Math.PI)
      }

      gsap.set(frame, {
        scale,
        filter: `blur(${blur + focusOver}px)`
      })

      // clip-path：从圆形到宽银幕
      if (p < 0.7) {
        const circleP = p / 0.7
        const circleRadius = 5 + 45 * Math.pow(circleP, 0.8)
        gsap.set(frame, { clipPath: `circle(${circleRadius}% at center)` })
      } else {
        const rectP = (p - 0.7) / 0.3
        const insetX = 8 * (1 - rectP)
        gsap.set(frame, { clipPath: `inset(0 ${insetX}%)` })
      }

      // RGB 通道色散校正
      const channelOffset = 4 * (1 - Math.pow(p, 1.2))
      gsap.set(redChannelRef.value, { x: -channelOffset })
      gsap.set(greenChannelRef.value, { x: 0 })
      gsap.set(blueChannelRef.value, { x: channelOffset })

      // 暗角
      if (p >= 0.6) {
        const vigP = (p - 0.6) / 0.4
        gsap.set(vignetteRef.value, { opacity: 0.7 * Math.pow(vigP, 0.5) })
      }

      // 胶片颗粒（通过透明度模拟）
      if (p >= 0.3) {
        const grainP = (p - 0.3) / 0.7
        gsap.set(grainRef.value, { opacity: 0.4 * (1 - Math.pow(grainP, 0.8)) })
      }

      // 光晕
      if (p >= 0.85) {
        const glowP = (p - 0.85) / 0.15
        const glowOpacity = 0.15 + 0.08 * Math.sin(Date.now() / 500)
        gsap.set(glowRef.value, { opacity: glowOpacity })
      }

      // 标题
      if (p >= 0.7) {
        const titleP = (p - 0.7) / 0.3
        gsap.set(titleRef.value, { opacity: titleP, y: 20 * (1 - titleP) })
      }
    },
    onLeaveBack: () => {
      gsap.set(frameRef.value, {
        scale: 0.05,
        filter: 'blur(20px)',
        clipPath: 'circle(5% at center)'
      })
      gsap.set(redChannelRef.value, { x: -4 })
      gsap.set(blueChannelRef.value, { x: 4 })
      gsap.set(vignetteRef.value, { opacity: 0 })
      gsap.set(glowRef.value, { opacity: 0 })
      gsap.set(titleRef.value, { opacity: 0, y: 20 })
    }
  })

  cleanupFns.push(() => trigger.kill())

  // 持续光晕呼吸
  const glowAnim = gsap.to(glowRef.value, {
    opacity: 0.25,
    duration: 4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    paused: true
  })
  cleanupFns.push(() => glowAnim.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.card-projector {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a0808;
}

.projector-bg {
  position: absolute;
  inset: 0;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255, 200, 150, 0.03) 0%, transparent 70%),
      linear-gradient(180deg, #0a0808 0%, #12100e 50%, #0a0808 100%);
  }

  .bg-grain {
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
}

.film-strip {
  position: absolute;
  left: 0;
  right: 0;
  height: 24px;
  background: linear-gradient(90deg,
    #1a1816 0%,
    #2a2824 2%,
    #1a1816 4%,
    #2a2824 6%,
    #1a1816 8%,
    #2a2824 10%
  );
  background-size: 50px 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: #3a3836;
    border-radius: 2px;
  }

  &.top {
    top: 30px;

    &::before { left: 20px; }
    &::after { right: 20px; }
  }

  &.bottom {
    bottom: 30px;

    &::before { left: 20px; }
    &::after { right: 20px; }
  }
}

.projector-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-svg {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.projector-frame {
  position: relative;
  width: 520px;
  height: 340px;
  transform-origin: center;
  overflow: hidden;
}

.channel-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.red {
    mix-blend-mode: screen;
    filter: url('#red-filter');

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255, 0, 0, 0.1);
    }
  }

  &.green {
    mix-blend-mode: screen;
    filter: url('#green-filter');
  }

  &.blue {
    mix-blend-mode: screen;
    filter: url('#blue-filter');

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 255, 0.1);
    }
  }
}

.projector-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 70% 60% at center, transparent 30%, rgba(0, 0, 0, 0.8) 100%);
}

.projector-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.4;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

.projector-glow {
  position: absolute;
  inset: -40px;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(255, 220, 180, 0.15) 0%, transparent 60%);
  border-radius: 8px;
}

.projector-title {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  h2 {
    font-size: 42px;
    font-weight: 200;
    color: #ffeedd;
    margin: 0 0 10px;
    letter-spacing: 12px;
    text-transform: uppercase;
    text-shadow: 0 0 40px rgba(255, 200, 150, 0.4);
  }

  p {
    font-size: 14px;
    color: rgba(255, 220, 180, 0.5);
    margin: 0;
    letter-spacing: 6px;
  }
}

.projector-frame-ornament {
  .ornament-corner {
    position: absolute;
    width: 60px;
    height: 60px;
    opacity: 0.2;

    &.tl {
      top: 50px;
      left: 50px;
      border-top: 1px solid rgba(255, 220, 180, 0.4);
      border-left: 1px solid rgba(255, 220, 180, 0.4);
    }

    &.tr {
      top: 50px;
      right: 50px;
      border-top: 1px solid rgba(255, 220, 180, 0.4);
      border-right: 1px solid rgba(255, 220, 180, 0.4);
    }

    &.bl {
      bottom: 50px;
      left: 50px;
      border-bottom: 1px solid rgba(255, 220, 180, 0.4);
      border-left: 1px solid rgba(255, 220, 180, 0.4);
    }

    &.br {
      bottom: 50px;
      right: 50px;
      border-bottom: 1px solid rgba(255, 220, 180, 0.4);
      border-right: 1px solid rgba(255, 220, 180, 0.4);
    }
  }
}
</style>
