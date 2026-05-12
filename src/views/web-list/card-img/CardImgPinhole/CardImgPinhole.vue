<template>
  <div class="card-pinhole">
    <div class="pinhole-bg">
      <div class="bg-texture"></div>
      <div class="bg-gradient"></div>
    </div>

    <div ref="parentRef" class="pinhole-container">
      <!-- 封面底板 -->
      <div ref="frameRef" class="pinhole-frame">
        <!-- 图片容器 -->
        <div ref="imgContainerRef" class="pinhole-image-container">
          <img
            ref="imgRef"
            class="pinhole-image"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85"
            alt=""
          />
          <!-- 裁切遮罩 -->
          <div ref="maskRef" class="pinhole-mask"></div>
          <!-- 柔边光晕 -->
          <div ref="glowEdgeRef" class="pinhole-glow-edge"></div>
        </div>

        <!-- 布纹底板 -->
        <div class="pinhole-texture-overlay"></div>

        <!-- 铜版画压痕 -->
        <div ref="embossRef" class="pinhole-emboss"></div>
      </div>

      <!-- 针孔指示器 -->
      <div class="pinhole-indicator">
        <div class="indicator-ring"></div>
        <div class="indicator-dot"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="pinhole-title">
      <h2>Pinhole</h2>
      <p>针孔显影</p>
    </div>

    <!-- 装饰 -->
    <div class="pinhole-decoration">
      <div class="decoration-frame">
        <div class="frame-corner tl"></div>
        <div class="frame-corner tr"></div>
        <div class="frame-corner bl"></div>
        <div class="frame-corner br"></div>
      </div>
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
const imgContainerRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLElement | null>(null)
const maskRef = ref<HTMLElement | null>(null)
const glowEdgeRef = ref<HTMLElement | null>(null)
const embossRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  // 初始状态 - 针孔大小
  gsap.set(maskRef.value, {
    clipPath: 'circle(0% at center)',
    opacity: 1
  })
  gsap.set(glowEdgeRef.value, {
    opacity: 0.8,
    scale: 0
  })
  gsap.set(imgRef.value, {
    filter: 'brightness(0.4)'
  })
  gsap.set(embossRef.value, { opacity: 0 })
  gsap.set(titleRef.value, { opacity: 0, y: 20 })

  // 呼吸效果
  const breatheAnim = gsap.to(maskRef.value, {
    clipPath: 'circle(0.5% at center)',
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  })
  cleanupFns.push(() => breatheAnim.kill())

  const trigger = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 85%',
    end: 'bottom 20%',
    scrub: 1.5,
    onEnter: () => {
      gsap.set(maskRef.value, {
        clipPath: 'circle(0% at center)'
      })
      gsap.set(glowEdgeRef.value, {
        opacity: 0.8,
        scale: 0
      })
      gsap.set(imgRef.value, {
        filter: 'brightness(0.4)'
      })
      gsap.set(embossRef.value, { opacity: 0 })
    },
    onUpdate: (self) => {
      const p = self.progress
      const mask = maskRef.value
      const glowEdge = glowEdgeRef.value
      const img = imgRef.value

      if (!mask || !glowEdge || !img) return

      // 圆形裁切扩张
      let circleRadius = 0
      if (p < 0.02) {
        // 初始针孔
        circleRadius = 0
      } else if (p < 0.96) {
        // 正常扩张
        circleRadius = 0.5 + (98 - 0.5) * Math.pow((p - 0.02) / 0.94, 0.7)
      } else {
        // 弹性过冲
        const overshootP = (p - 0.96) / 0.04
        if (overshootP < 0.5) {
          // 瞬间越过
          circleRadius = 98 + 4 * Math.sin(overshootP / 0.5 * Math.PI / 2)
        } else {
          // 回缩至 100
          const settleP = (overshootP - 0.5) / 0.5
          circleRadius = 102 - 2 * Math.pow(settleP, 2)
        }
      }

      gsap.set(mask, {
        clipPath: `circle(${circleRadius}% at center)`
      })

      // 柔边光晕
      if (p > 0.05) {
        const glowP = Math.min((p - 0.05) / 0.4, 1)
        const glowOpacity = 0.8 * (1 - Math.pow(glowP, 0.5))
        const glowScale = glowP * 1.2
        gsap.set(glowEdge, { opacity: glowOpacity, scale: glowScale })
      }

      // 亮度联动
      let brightness = 0.4
      if (p < 0.03) {
        brightness = 0.4
      } else {
        brightness = 0.4 + 0.6 * Math.pow((p - 0.03) / 0.97, 0.6)
      }
      gsap.set(img, { filter: `brightness(${brightness})` })

      // 铜版画压痕（完成后）
      if (p >= 0.98) {
        const embossP = (p - 0.98) / 0.02
        const embossOpacity = 0.3 * Math.pow(embossP, 0.3)
        gsap.set(embossRef.value, { opacity: embossOpacity })
      }

      // 标题
      if (p >= 0.7) {
        const titleP = (p - 0.7) / 0.3
        gsap.set(titleRef.value, { opacity: titleP, y: 20 * (1 - titleP) })
      }
    },
    onLeaveBack: () => {
      gsap.set(maskRef.value, {
        clipPath: 'circle(0% at center)'
      })
      gsap.set(glowEdgeRef.value, {
        opacity: 0.8,
        scale: 0
      })
      gsap.set(imgRef.value, {
        filter: 'brightness(0.4)'
      })
      gsap.set(embossRef.value, { opacity: 0 })
      gsap.set(titleRef.value, { opacity: 0, y: 20 })
    }
  })

  cleanupFns.push(() => trigger.kill())

  // 压痕持续呼吸
  const embossAnim = gsap.to(embossRef.value, {
    opacity: 0.5,
    duration: 4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    paused: true
  })
  cleanupFns.push(() => embossAnim.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.card-pinhole {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #1a1816;
}

.pinhole-bg {
  position: absolute;
  inset: 0;

  .bg-texture {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 40% 35% at 50% 50%, rgba(200, 180, 160, 0.04) 0%, transparent 70%),
      linear-gradient(180deg, #1a1816 0%, #242220 50%, #1a1816 100%);
  }
}

.pinhole-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pinhole-frame {
  position: relative;
  width: 400px;
  height: 540px;
  background: #f5f0eb;
  border-radius: 4px;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(180, 160, 140, 0.2);
  overflow: hidden;
}

.pinhole-image-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.pinhole-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pinhole-mask {
  position: absolute;
  inset: 0;
  background: #1a1816;
  pointer-events: none;
}

.pinhole-glow-edge {
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    circle at center,
    transparent 0%,
    rgba(255, 250, 240, 0.15) 30%,
    rgba(255, 245, 230, 0.08) 50%,
    transparent 70%
  );
  pointer-events: none;
  transform-origin: center;
  border-radius: 50%;
}

.pinhole-texture-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.pinhole-emboss {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow:
    inset 0 0 40px rgba(160, 140, 120, 0.1),
    inset 0 0 80px rgba(140, 120, 100, 0.05);
  border-radius: 4px;
}

.pinhole-indicator {
  position: absolute;
  top: 50%;
  right: -80px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;

  .indicator-ring {
    position: absolute;
    width: 30px;
    height: 30px;
    border: 1px solid rgba(180, 160, 140, 0.3);
    border-radius: 50%;
  }

  .indicator-dot {
    width: 4px;
    height: 4px;
    background: rgba(180, 160, 140, 0.5);
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(180, 160, 140, 0.3);
  }
}

.pinhole-title {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  h2 {
    font-size: 36px;
    font-weight: 300;
    color: #e8e0d8;
    margin: 0 0 10px;
    letter-spacing: 8px;
    text-transform: uppercase;
    text-shadow: 0 0 40px rgba(180, 160, 140, 0.2);
  }

  p {
    font-size: 14px;
    color: rgba(180, 160, 140, 0.5);
    margin: 0;
    letter-spacing: 6px;
  }
}

.pinhole-decoration {
  .decoration-frame {
    position: absolute;
    inset: 40px;
    pointer-events: none;
  }

  .frame-corner {
    position: absolute;
    width: 30px;
    height: 30px;
    opacity: 0.15;

    &.tl {
      top: 0;
      left: 0;
      border-top: 1px solid rgba(180, 160, 140, 0.5);
      border-left: 1px solid rgba(180, 160, 140, 0.5);
    }

    &.tr {
      top: 0;
      right: 0;
      border-top: 1px solid rgba(180, 160, 140, 0.5);
      border-right: 1px solid rgba(180, 160, 140, 0.5);
    }

    &.bl {
      bottom: 0;
      left: 0;
      border-bottom: 1px solid rgba(180, 160, 140, 0.5);
      border-left: 1px solid rgba(180, 160, 140, 0.5);
    }

    &.br {
      bottom: 0;
      right: 0;
      border-bottom: 1px solid rgba(180, 160, 140, 0.5);
      border-right: 1px solid rgba(180, 160, 140, 0.5);
    }
  }
}
</style>
