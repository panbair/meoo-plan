<template>
  <div class="card-steel">
    <div class="steel-bg">
      <div class="bg-gradient"></div>
      <div class="bg-grid"></div>
      <div class="rail-line top"></div>
      <div class="rail-line bottom"></div>
    </div>

    <div ref="parentRef" class="steel-container">
      <!-- 背景金属板装饰 -->
      <div class="metal-decoration">
        <div class="metal-panel"></div>
        <div class="metal-panel"></div>
      </div>

      <!-- 钢板主体 -->
      <div ref="steelRef" class="steel-plate">
        <!-- 钢板阴影 -->
        <div ref="shadowRef" class="steel-shadow"></div>

        <!-- 钢板表面 -->
        <div ref="plateRef" class="steel-surface">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85"
            alt=""
          />
          <!-- 冰蓝色刀痕光泽 -->
          <div ref="cutLineRef" class="cut-mark"></div>
        </div>

        <!-- 边缘高光 -->
        <div class="edge-highlight"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="steel-title">
      <h2>Cold Rolling</h2>
      <p>精密导轨滑入</p>
    </div>

    <!-- 装饰 -->
    <div class="steel-decoration">
      <div class="decoration-point left"></div>
      <div class="decoration-line"></div>
      <div class="decoration-point right"></div>
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
const steelRef = ref<HTMLElement | null>(null)
const plateRef = ref<HTMLElement | null>(null)
const shadowRef = ref<HTMLElement | null>(null)
const cutLineRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// 高频微颤效果
let vibrateInterval: number | null = null

const startVibrate = () => {
  if (vibrateInterval) return
  let count = 0
  vibrateInterval = window.setInterval(() => {
    if (count < 8 && steelRef.value) {
      const offset = count % 2 === 0 ? 0.5 : -0.5
      gsap.set(steelRef.value, { x: `+=${offset}` })
      count++
    } else if (vibrateInterval) {
      clearInterval(vibrateInterval)
      vibrateInterval = null
    }
  }, 25)
}

onMounted(() => {
  // 初始状态：从左侧滑入
  gsap.set(steelRef.value, {
    x: '-120%',
    rotateY: 3,
    transformPerspective: 1200
  })
  gsap.set(plateRef.value, {
    filter: 'brightness(0.85) saturate(0.9)'
  })
  gsap.set(shadowRef.value, {
    x: -50,
    opacity: 0.5,
    skewX: 10
  })
  gsap.set(cutLineRef.value, { opacity: 0 })
  gsap.set(titleRef.value, { opacity: 0, x: 30 })

  let vibrateTriggered = false

  const trigger = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 85%',
    end: 'bottom 20%',
    scrub: 1.5,
    onEnter: () => {
      gsap.set(steelRef.value, {
        x: '-120%',
        rotateY: 3,
        transformPerspective: 1200
      })
      gsap.set(shadowRef.value, {
        x: -50,
        opacity: 0.5,
        skewX: 10
      })
      gsap.set(cutLineRef.value, { opacity: 0 })
      vibrateTriggered = false
    },
    onUpdate: (self) => {
      const p = self.progress
      const steel = steelRef.value
      const plate = plateRef.value
      const shadow = shadowRef.value

      if (!steel || !plate || !shadow) return

      // 主属性：translateX
      // 静摩擦效果：前段极慢
      let moveP: number
      if (p < 0.2) {
        moveP = Math.pow(p / 0.2, 3) * 0.2
      } else if (p < 0.8) {
        moveP = 0.2 + (p - 0.2) * 0.75
      } else {
        moveP = 0.95 + (p - 0.8) * 0.25
      }

      const x = -120 * (1 - moveP)

      // 回弹效果（接近终点）
      let bounceX = 0
      let bounceRotate = 0
      if (p >= 0.88) {
        const bounceP = (p - 0.88) / 0.12
        if (bounceP < 0.4) {
          // 骤停回弹
          bounceX = -4 * Math.sin(bounceP / 0.4 * Math.PI) * (1 - bounceP)
          bounceRotate = 0.3 * Math.sin(bounceP / 0.4 * Math.PI)
        }
      }

      // rotateY 前段先扶正
      const rotateP = Math.min(p / 0.6, 1)
      const rotateY = 3 * (1 - Math.pow(rotateP, 0.8))

      gsap.set(steel, {
        x: x + bounceX,
        rotateY: rotateY - bounceRotate
      })

      // 高频微颤（末段）
      if (p >= 0.88 && !vibrateTriggered) {
        vibrateTriggered = true
        startVibrate()
      }

      // 阴影变化
      const shadowX = -50 * (1 - Math.pow(p, 0.5))
      const shadowOpacity = 0.5 * (1 - Math.pow(p, 0.6))
      const shadowSkew = 10 * (1 - Math.pow(p, 0.7))
      gsap.set(shadow, {
        x: shadowX,
        opacity: shadowOpacity,
        skewX: shadowSkew
      })

      // 金属表面亮度
      const brightness = 0.85 + 0.15 * Math.pow(p, 0.4)
      gsap.set(plate, { filter: `brightness(${brightness}) saturate(${0.9 + 0.1 * p})` })

      // 冰蓝色刀痕光泽（落位后）
      if (p >= 0.9) {
        const cutP = (p - 0.9) / 0.1
        let cutOpacity: number
        if (cutP < 0.3) {
          // 骤升
          cutOpacity = 0.3 + 0.5 * (cutP / 0.3)
        } else if (cutP < 0.5) {
          // 回落
          cutOpacity = 0.8 - 0.5 * ((cutP - 0.3) / 0.2)
        } else {
          // 低频呼吸
          cutOpacity = 0.2 + 0.1 * Math.sin(Date.now() / 800)
        }
        gsap.set(cutLineRef.value, { opacity: cutOpacity })
      }

      // 标题
      if (p >= 0.7) {
        const titleP = (p - 0.7) / 0.3
        gsap.set(titleRef.value, { opacity: titleP, x: 30 * (1 - titleP) })
      }
    },
    onLeaveBack: () => {
      gsap.set(steelRef.value, {
        x: '-120%',
        rotateY: 3,
        transformPerspective: 1200
      })
      gsap.set(shadowRef.value, {
        x: -50,
        opacity: 0.5,
        skewX: 10
      })
      gsap.set(cutLineRef.value, { opacity: 0 })
      gsap.set(titleRef.value, { opacity: 0, x: 30 })
      vibrateTriggered = false
    }
  })

  cleanupFns.push(() => trigger.kill())

  // 刀痕持续呼吸
  const cutAnim = gsap.to(cutLineRef.value, {
    opacity: 0.35,
    duration: 6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    paused: true
  })
  cleanupFns.push(() => cutAnim.kill())

  // 导轨装饰动画
  const railAnim = gsap.fromTo(
    '.rail-line',
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 1,
      ease: 'power2.out'
    }
  )
  cleanupFns.push(() => railAnim.kill())
})

onUnmounted(() => {
  if (vibrateInterval) {
    clearInterval(vibrateInterval)
    vibrateInterval = null
  }
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.card-steel {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0e14 0%, #141a24 50%, #0a0e14 100%);
}

.steel-bg {
  position: absolute;
  inset: 0;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 35% 30% at 40% 50%, rgba(100, 150, 200, 0.05) 0%, transparent 70%);
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(100, 150, 200, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100, 150, 200, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
}

.rail-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    rgba(150, 200, 255, 0.2) 30%,
    rgba(150, 200, 255, 0.2) 70%,
    transparent
  );
  transform-origin: left center;

  &.top {
    top: 35%;
  }

  &.bottom {
    top: 65%;
  }
}

.steel-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.metal-decoration {
  position: absolute;
  display: flex;
  gap: 20px;

  .metal-panel {
    width: 80px;
    height: 120px;
    background: linear-gradient(135deg, rgba(80, 100, 130, 0.1) 0%, rgba(60, 80, 110, 0.05) 100%);
    border: 1px solid rgba(150, 200, 255, 0.1);
    border-radius: 2px;

    &:first-child {
      margin-right: 60px;
    }

    &:last-child {
      margin-left: 60px;
    }
  }
}

.steel-plate {
  position: relative;
  transform-style: preserve-3d;
}

.steel-shadow {
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 100%;
  height: 40px;
  background: radial-gradient(ellipse 50% 100% at 50% 0%, rgba(0, 0, 0, 0.5) 0%, transparent 70%);
  pointer-events: none;
}

.steel-surface {
  position: relative;
  width: 500px;
  height: 350px;
  border-radius: 3px;
  overflow: hidden;
  box-shadow:
    -2px 0 0 rgba(200, 230, 255, 0.08),
    0 15px 50px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(100, 150, 200, 0.08);
  transform-origin: left center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cut-mark {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow:
    inset 0 0 30px rgba(150, 220, 255, 0.15),
    inset 0 0 60px rgba(100, 200, 255, 0.08);
  border-radius: 3px;
}

.edge-highlight {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(
    180deg,
    rgba(200, 230, 255, 0.15) 0%,
    rgba(180, 220, 255, 0.1) 50%,
    rgba(200, 230, 255, 0.15) 100%
  );
  pointer-events: none;
}

.steel-title {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  h2 {
    font-size: 38px;
    font-weight: 300;
    color: #c8ddf0;
    margin: 0 0 10px;
    letter-spacing: 8px;
    text-transform: uppercase;
    text-shadow: 0 0 40px rgba(100, 180, 255, 0.3);
  }

  p {
    font-size: 14px;
    color: rgba(150, 200, 230, 0.5);
    margin: 0;
    letter-spacing: 6px;
  }
}

.steel-decoration {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 15px;

  .decoration-line {
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.3), transparent);
  }

  .decoration-point {
    width: 6px;
    height: 6px;
    border: 1px solid rgba(100, 180, 255, 0.4);
    border-radius: 50%;

    &.left {
      background: rgba(100, 180, 255, 0.2);
    }

    &.right {
      background: rgba(100, 180, 255, 0.2);
    }
  }
}
</style>
