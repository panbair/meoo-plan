<template>
  <div class="card-img-star-core" ref="containerRef">
    <div class="star-scene" ref="sceneRef">
      <!-- 星空背景 -->
      <div class="star-field" ref="starFieldRef">
        <div class="star-field-layer"></div>
      </div>

      <!-- 主图片层 -->
      <div class="star-image-container" ref="imageContainerRef">
        <img
          :src="imageUrl"
          alt="Star core resonance"
          class="star-image"
          ref="imageRef"
          loading="lazy"
        />
      </div>

      <!-- 光丝遮罩层 -->
      <div class="light-filament-mask" ref="maskRef">
        <div class="filament-layer" ref="filamentRef"></div>
      </div>

      <!-- 脉冲光环 -->
      <div class="pulse-ring" ref="pulseRingRef"></div>

      <!-- 星核光点 -->
      <div class="core-point" ref="coreRef"></div>

      <!-- 四角星光镶边 -->
      <div class="corner-starlight" ref="cornerRef">
        <div class="corner-star corner-tl"></div>
        <div class="corner-star corner-tr"></div>
        <div class="corner-star corner-bl"></div>
        <div class="corner-star corner-br"></div>
      </div>
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
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80'
})

// Refs
const containerRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const starFieldRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const maskRef = ref<HTMLElement | null>(null)
const filamentRef = ref<HTMLElement | null>(null)
const pulseRingRef = ref<HTMLElement | null>(null)
const coreRef = ref<HTMLElement | null>(null)
const cornerRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []
let breathTimeline: gsap.core.Timeline | null = null
let cornerTimeline: gsap.core.Timeline | null = null

// 创建星空背景
const initStarField = () => {
  if (!starFieldRef.value) return
  
  const layer = starFieldRef.value.querySelector('.star-field-layer') as HTMLElement
  if (!layer) return
  
  let stars = ''
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = Math.random() * 1.5 + 0.5
    const opacity = Math.random() * 0.5 + 0.2
    stars += `<div class="bg-star" style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;opacity:${opacity}"></div>`
  }
  layer.innerHTML = stars
}

// 创建星核共振动画
const createStarCoreAnimation = () => {
  if (!containerRef.value || !maskRef.value || !imageContainerRef.value || !pulseRingRef.value || !coreRef.value) return

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

  // 阶段1: 星核光点闪烁
  tl.fromTo(
    coreRef.value,
    {
      opacity: 0.9,
      scale: 0.3,
      boxShadow: '0 0 10px 5px rgba(0, 100, 255, 0.8)'
    },
    {
      opacity: 0.4,
      scale: 1,
      boxShadow: '0 0 20px 10px rgba(0, 150, 255, 0.4)',
      duration: 0.6,
      ease: 'power2.out'
    },
    0
  )

  // 阶段2: 光丝遮罩从中心扩张
  tl.fromTo(
    maskRef.value,
    {
      clipPath: 'radial-gradient(circle at center, transparent 3%, rgba(10, 20, 40, 0.98) 8%, rgba(5, 15, 35, 0.95) 20%, rgba(0, 10, 30, 0.9) 40%, rgba(0, 5, 25, 0.85) 60%, rgba(0, 0, 20, 0.8) 80%, rgba(0, 0, 15, 0.75) 100%)'
    },
    {
      clipPath: 'radial-gradient(circle at center, transparent 100%, transparent 100%)',
      duration: 2.2,
      ease: 'power4.out'
    },
    0.2
  )

  // 阶段3: 光丝层旋转松弛
  if (filamentRef.value) {
    tl.fromTo(
      filamentRef.value,
      {
        opacity: 0.6,
        transform: 'rotate(0deg) scale(1)'
      },
      {
        opacity: 0,
        transform: 'rotate(15deg) scale(1.1)',
        duration: 2.0,
        ease: 'power2.inOut'
      },
      0.3
    )
  }

  // 阶段4: 脉冲光环扩张
  tl.fromTo(
    pulseRingRef.value,
    {
      scale: 0,
      opacity: 0.9,
      borderColor: 'rgba(0, 150, 255, 0.9)'
    },
    {
      scale: 1.2,
      opacity: 0,
      borderColor: 'rgba(0, 200, 255, 0.3)',
      duration: 1.8,
      ease: 'power2.out'
    },
    0.4
  )

  // 阶段5: 脉冲过冲回弹
  tl.fromTo(
    pulseRingRef.value,
    {
      scale: 1.2,
      opacity: 0
    },
    {
      scale: 1.0,
      opacity: 0.15,
      duration: 0.6,
      ease: 'back.out(1.5)'
    },
    '-=0.3'
  )

  // 阶段6: 图片亮度揭示
  tl.fromTo(
    imageContainerRef.value,
    {
      filter: 'brightness(0.4)',
      scale: 1.0
    },
    {
      filter: 'brightness(0.85)',
      scale: 1.0,
      duration: 2.2,
      ease: 'power2.out'
    },
    0.3
  )

  // 阶段7: 四角星光镶边显现
  if (cornerRef.value) {
    tl.fromTo(
      cornerRef.value,
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out'
      },
      1.8
    )

    // 启动四角闪烁循环
    startCornerBlink()
  }

  // 阶段8: 启动画面呼吸循环
  tl.call(() => {
    startBreathingAnimation()
  }, [], 2.0)
}

// 画面呼吸动画
const startBreathingAnimation = () => {
  if (!imageContainerRef.value) return

  breathTimeline = gsap.timeline({ repeat: -1 })
  
  breathTimeline.to(imageContainerRef.value, {
    scale: 1.015,
    duration: 2.5,
    ease: 'sine.inOut'
  })
  
  breathTimeline.to(imageContainerRef.value, {
    scale: 1.0,
    duration: 2.5,
    ease: 'sine.inOut'
  })

  cleanupFns.push({
    kill: () => {
      breathTimeline?.kill()
    }
  })
}

// 四角闪烁循环
const startCornerBlink = () => {
  if (!cornerRef.value) return

  const corners = cornerRef.value.querySelectorAll('.corner-star')
  
  cornerTimeline = gsap.timeline({ repeat: -1 })
  
  corners.forEach((corner, i) => {
    cornerTimeline.to(corner as HTMLElement, {
      opacity: 0.35,
      scale: 1.2,
      duration: 1.75,
      ease: 'sine.inOut'
    }, i * 0.4)
    
    cornerTimeline.to(corner as HTMLElement, {
      opacity: 0.15,
      scale: 1.0,
      duration: 1.75,
      ease: 'sine.inOut'
    }, i * 0.4 + 1.75)
  })

  cleanupFns.push({
    kill: () => {
      cornerTimeline?.kill()
    }
  })
}

onMounted(() => {
  initStarField()
  requestAnimationFrame(() => {
    createStarCoreAnimation()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  breathTimeline?.kill()
  cornerTimeline?.kill()
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style lang="scss" scoped>
.card-img-star-core {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a14 0%, #050510 50%, #0a0a18 100%);
}

.star-scene {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

// 星空背景
.star-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  .star-field-layer {
    position: absolute;
    inset: 0;
    
    :deep(.bg-star) {
      position: absolute;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(200, 220, 255, 0.5) 50%, transparent 100%);
      border-radius: 50%;
    }
  }
}

// 主图片容器
.star-image-container {
  position: relative;
  width: 70vw;
  height: 75vh;
  max-width: 900px;
  border-radius: 8px;
  overflow: hidden;
  filter: brightness(0.4);

  .star-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 光丝遮罩层
.light-filament-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  clip-path: radial-gradient(circle at center, transparent 3%, rgba(10, 20, 40, 0.98) 8%, rgba(5, 15, 35, 0.95) 20%, rgba(0, 10, 30, 0.9) 40%, rgba(0, 5, 25, 0.85) 60%, rgba(0, 0, 20, 0.8) 80%, rgba(0, 0, 15, 0.75) 100%);

  .filament-layer {
    position: absolute;
    inset: 0;
    background: 
      repeating-conic-gradient(
        from 0deg at 50% 50%,
        rgba(100, 150, 255, 0.03) 0deg 3deg,
        transparent 3deg 6deg
      ),
      repeating-conic-gradient(
        from 45deg at 50% 50%,
        rgba(80, 130, 200, 0.02) 0deg 5deg,
        transparent 5deg 10deg
      );
    opacity: 0.6;
  }
}

// 脉冲光环
.pulse-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 70vw;
  height: 75vh;
  max-width: 900px;
  max-height: 85vh;
  transform: translate(-50%, -50%) scale(0);
  border-radius: 8px;
  border: 2px solid rgba(0, 150, 255, 0.9);
  box-shadow: 
    0 0 30px 10px rgba(0, 150, 255, 0.3),
    inset 0 0 30px 5px rgba(0, 150, 255, 0.1);
  pointer-events: none;
  opacity: 0;
}

// 星核光点
.core-point {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(100, 180, 255, 1) 0%,
    rgba(0, 120, 255, 0.8) 40%,
    rgba(0, 80, 200, 0.4) 70%,
    transparent 100%
  );
  border-radius: 50%;
  box-shadow: 0 0 10px 5px rgba(0, 100, 255, 0.8);
  pointer-events: none;
  z-index: 10;
}

// 四角星光镶边
.corner-starlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;

  .corner-star {
    position: absolute;
    width: 40px;
    height: 40px;
    background: radial-gradient(
      circle,
      rgba(100, 180, 255, 0.6) 0%,
      rgba(80, 150, 255, 0.3) 30%,
      transparent 70%
    );
    border-radius: 50%;
    filter: blur(2px);

    &.corner-tl {
      left: 5%;
      top: 5%;
    }
    &.corner-tr {
      right: 5%;
      top: 5%;
    }
    &.corner-bl {
      left: 5%;
      bottom: 5%;
    }
    &.corner-br {
      right: 5%;
      bottom: 5%;
    }
  }
}
</style>
