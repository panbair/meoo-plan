<template>
  <div class="card-img-sand" ref="containerRef">
    <div class="sand-scene" ref="sceneRef">
      <!-- SVG 滤镜 -->
      <svg class="sand-filter">
        <defs>
          <filter id="sandRippleDistort" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.02"
              numOctaves="3"
              seed="15"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="sandGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sandShimmer">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>
      </svg>

      <!-- 主图片层 -->
      <div class="sand-image-container" ref="imageContainerRef">
        <img
          :src="imageUrl"
          alt="Sand ripple reveal"
          class="sand-image"
          ref="imageRef"
          loading="lazy"
        />
        
        <!-- 多层涟漪沙面 -->
        <div class="ripple-canvas" ref="rippleCanvasRef">
          <!-- 涟漪层1 - 最内层 -->
          <div class="ripple-layer layer-1" ref="layer1Ref">
            <div class="ripple-wave wave-inner"></div>
          </div>
          
          <!-- 涟漪层2 -->
          <div class="ripple-layer layer-2" ref="layer2Ref">
            <div class="ripple-wave wave-mid"></div>
          </div>
          
          <!-- 涟漪层3 -->
          <div class="ripple-layer layer-3" ref="layer3Ref">
            <div class="ripple-wave wave-outer"></div>
          </div>
          
          <!-- 涟漪层4 - 最外层 -->
          <div class="ripple-layer layer-4" ref="layer4Ref">
            <div class="ripple-wave wave-edge"></div>
          </div>
        </div>
        
        <!-- 中心冲击波核心 -->
        <div class="impact-core" ref="impactCoreRef">
          <div class="core-glow"></div>
          <div class="core-pulse pulse-1"></div>
          <div class="core-pulse pulse-2"></div>
          <div class="core-pulse pulse-3"></div>
          <div class="core-sparkle">
            <span v-for="i in 8" :key="i" class="spark" :style="{ '--i': i }"></span>
          </div>
        </div>
        
        <!-- 波纹粒子 -->
        <div class="ripple-particles" ref="particlesRef"></div>
        
        <!-- 水珠效果 -->
        <div class="water-drops" ref="waterDropsRef"></div>
      </div>

      <!-- 边缘湿润光晕 -->
      <div class="moisture-glow" ref="moistureGlowRef"></div>
      
      <!-- 底部沙砾堆积 -->
      <div class="sand-sediment" ref="sedimentRef"></div>
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
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
})

// Refs
const containerRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const rippleCanvasRef = ref<HTMLElement | null>(null)
const layer1Ref = ref<HTMLElement | null>(null)
const layer2Ref = ref<HTMLElement | null>(null)
const layer3Ref = ref<HTMLElement | null>(null)
const layer4Ref = ref<HTMLElement | null>(null)
const impactCoreRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const waterDropsRef = ref<HTMLElement | null>(null)
const moistureGlowRef = ref<HTMLElement | null>(null)
const sedimentRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []
let rippleProgress = { value: 0 }

// 初始化波纹粒子
const initRippleParticles = () => {
  if (!particlesRef.value) return
  
  const container = particlesRef.value
  container.innerHTML = ''
  
  // 创建散射粒子
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'ripple-particle'
    const angle = (i / 50) * 360
    const delay = Math.random() * 0.5
    const duration = 1.5 + Math.random() * 1
    const size = 1 + Math.random() * 2
    
    particle.style.cssText = `
      --angle: ${angle}deg;
      --delay: ${delay}s;
      --duration: ${duration}s;
      --size: ${size}px;
      --max-distance: ${40 + Math.random() * 60}px;
    `
    container.appendChild(particle)
  }
}

// 初始化水珠
const initWaterDrops = () => {
  if (!waterDropsRef.value) return
  
  const container = waterDropsRef.value
  container.innerHTML = ''
  
  for (let i = 0; i < 12; i++) {
    const drop = document.createElement('div')
    drop.className = 'water-drop'
    const angle = (i / 12) * 360 + Math.random() * 20
    const distance = 15 + Math.random() * 25
    const size = 2 + Math.random() * 3
    const delay = Math.random() * 1.5
    
    drop.style.cssText = `
      --drop-angle: ${angle}deg;
      --drop-distance: ${distance}%;
      --drop-size: ${size}px;
      --drop-delay: ${delay}s;
    `
    container.appendChild(drop)
  }
}

// 创建涟漪扩散动画
const createRippleAnimation = () => {
  if (!containerRef.value) return

  const layers = [layer1Ref.value, layer2Ref.value, layer3Ref.value, layer4Ref.value]
  const core = impactCoreRef.value
  const moisture = moistureGlowRef.value
  const sediment = sedimentRef.value

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 10%',
      scrub: 1
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

  // ===== 第一阶段：核心激活 =====
  if (core) {
    // 核心光芒绽放
    tl.fromTo(core, 
      { opacity: 0, scale: 0.1 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' },
      0
    )
    
    // 脉冲光环序列
    const pulses = core.querySelectorAll('.core-pulse')
    pulses.forEach((pulse, i) => {
      tl.fromTo(pulse,
        { opacity: 0, scale: 0.5 },
        { 
          opacity: [0, 0.9, 0],
          scale: [1, 2.5, 4],
          duration: 1,
          ease: 'power2.out',
          repeat: -1,
          repeatDelay: 2.5
        },
        0
      )
    })
    
    // 光芒闪烁
    const sparks = core.querySelectorAll('.spark')
    sparks.forEach((spark, i) => {
      tl.fromTo(spark,
        { opacity: 0, scale: 0 },
        { 
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          duration: 0.3,
          ease: 'power2.inOut',
          repeat: -1,
          repeatDelay: 0.8
        },
        0
      )
    })
  }

  // ===== 第二阶段：涟漪层扩散 =====
  layers.forEach((layer, index) => {
    if (!layer) return
    
    const delay = index * 0.15
    const scaleEnd = 1 + (index * 0.2)
    
    // 涟漪层展开
    tl.fromTo(layer,
      { 
        opacity: 0,
        clipPath: 'circle(8% at 50% 50%)',
        filter: 'blur(8px)'
      },
      { 
        opacity: 0.85,
        clipPath: 'circle(100% at 50% 50%)',
        filter: 'blur(0px)',
        duration: 1.8,
        ease: 'power2.out'
      },
      delay
    )
    
    // 涟漪呼吸效果
    tl.fromTo(layer,
      { transform: 'translate(-50%, -50%) scale(1)' },
      { 
        transform: `translate(-50%, -50%) scale(${scaleEnd})`,
        duration: 0.6,
        ease: 'sine.inOut',
        repeat: 2,
        yoyo: true
      },
      delay + 0.5
    )
  })

  // ===== 第三阶段：图片揭示 =====
  tl.fromTo(imageContainerRef.value,
    { filter: 'brightness(0.25) saturate(0.5)' },
    { 
      filter: 'brightness(1) saturate(1)',
      duration: 2.5,
      ease: 'power2.inOut'
    },
    0.2
  )

  // 图片微微放大
  tl.fromTo(imageContainerRef.value,
    { scale: 0.95 },
    { 
      scale: 1,
      duration: 2.5,
      ease: 'power2.out'
    },
    0.3
  )

  // ===== 第四阶段：粒子散射 =====
  if (particlesRef.value) {
    const particles = particlesRef.value.querySelectorAll('.ripple-particle')
    
    tl.fromTo(particlesRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      0.5
    )
    
    particles.forEach((particle, i) => {
      const angle = (i / 50) * 360
      const distance = 40 + Math.random() * 60
      
      gsap.fromTo(particle,
        { 
          opacity: 0,
          x: 0,
          y: 0,
          scale: 0
        },
        {
          opacity: 0.9,
          x: Math.cos(angle * Math.PI / 180) * distance,
          y: Math.sin(angle * Math.PI / 180) * distance,
          scale: 1,
          duration: 1.5,
          ease: 'power2.out',
          delay: 0.5 + Math.random() * 0.5,
          scrollTrigger: {
            trigger: containerRef.value,
            start: 'top 100%',
            end: 'bottom 10%',
            scrub: 1
          }
        }
      )
    })
  }

  // ===== 第五阶段：水珠弹跳 =====
  if (waterDropsRef.value) {
    const drops = waterDropsRef.value.querySelectorAll('.water-drop')
    
    tl.fromTo(waterDropsRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      0.8
    )
    
    drops.forEach((drop, i) => {
      tl.fromTo(drop,
        { 
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0)'
        },
        { 
          opacity: 0.7,
          transform: 'translate(-50%, -50%) scale(1)',
          duration: 0.4,
          ease: 'back.out(2)'
        },
        1 + Math.random() * 0.8
      )
    })
  }

  // ===== 第六阶段：涟漪渐隐 =====
  tl.to([layer1Ref.value, layer2Ref.value, layer3Ref.value, layer4Ref.value],
    { 
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      stagger: 0.1
    },
    '-=1'
  )

  // ===== 第七阶段：湿润边缘光 =====
  if (moisture) {
    tl.fromTo(moisture,
      { 
        opacity: 0,
        scale: 0.9
      },
      { 
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
      },
      '-=0.8'
    )
  }

  // ===== 第八阶段：沙砾沉淀 =====
  if (sediment) {
    tl.fromTo(sediment,
      { 
        opacity: 0,
        y: 20
      },
      { 
        opacity: 0.6,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      },
      '-=0.5'
    )
  }
}

onMounted(() => {
  initRippleParticles()
  initWaterDrops()
  requestAnimationFrame(() => {
    createRippleAnimation()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style lang="scss" scoped>
.card-img-sand {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: 
    radial-gradient(ellipse at 50% 60%, #e8e0d4 0%, transparent 50%),
    linear-gradient(180deg, #f5efe6 0%, #e8dfd2 50%, #f0ebe3 100%);
}

.sand-scene {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.sand-filter {
  position: absolute;
  width: 0;
  height: 0;
}

// 主图片容器
.sand-image-container {
  position: relative;
  width: 70vw;
  height: 75vh;
  max-width: 900px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.15),
    0 15px 40px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  .sand-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.25) saturate(0.5);
    transform: scale(0.95);
  }
}

// ===== 涟漪画布 =====
.ripple-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// 涟漪层基础样式
.ripple-layer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 12px;
  opacity: 0;
  pointer-events: none;
}

// 层1 - 内层涟漪
.layer-1 {
  background: 
    radial-gradient(
      circle at 50% 50%,
      rgba(245, 238, 225, 0.95) 0%,
      rgba(230, 220, 200, 0.9) 20%,
      rgba(210, 195, 170, 0.85) 40%,
      rgba(190, 175, 150, 0.8) 60%,
      rgba(170, 155, 130, 0.7) 80%,
      rgba(150, 135, 110, 0.6) 100%
    );
  
  .ripple-wave {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity: 0.3;
      mix-blend-mode: soft-light;
    }
  }
}

// 层2 - 中层涟漪
.layer-2 {
  background: 
    radial-gradient(
      circle at 50% 50%,
      rgba(220, 205, 185, 0.9) 0%,
      rgba(200, 185, 165, 0.85) 30%,
      rgba(180, 165, 145, 0.8) 50%,
      rgba(160, 145, 125, 0.7) 70%,
      rgba(140, 125, 105, 0.6) 100%
    );
  
  .ripple-wave::before {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.02 0.05' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.25;
  }
}

// 层3 - 外层涟漪
.layer-3 {
  background: 
    radial-gradient(
      circle at 50% 50%,
      rgba(200, 185, 165, 0.85) 0%,
      rgba(180, 165, 145, 0.8) 25%,
      rgba(160, 145, 125, 0.75) 50%,
      rgba(140, 125, 105, 0.65) 75%,
      rgba(120, 105, 85, 0.5) 100%
    );
  
  .ripple-wave::before {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.35;
    mix-blend-mode: overlay;
  }
}

// 层4 - 最外层涟漪
.layer-4 {
  background: 
    radial-gradient(
      circle at 50% 50%,
      rgba(180, 165, 145, 0.8) 0%,
      rgba(160, 145, 125, 0.75) 20%,
      rgba(140, 125, 105, 0.65) 40%,
      rgba(120, 105, 85, 0.55) 60%,
      rgba(100, 85, 65, 0.4) 80%,
      rgba(80, 65, 45, 0.3) 100%
    );
  
  .ripple-wave::before {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.4;
    mix-blend-mode: multiply;
  }
}

// ===== 冲击波核心 =====
.impact-core {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  pointer-events: none;
  z-index: 20;
  opacity: 0;

  .core-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle,
      rgba(255, 255, 245, 1) 0%,
      rgba(255, 250, 230, 0.9) 20%,
      rgba(255, 240, 200, 0.7) 40%,
      rgba(255, 225, 170, 0.4) 60%,
      transparent 80%
    );
    border-radius: 50%;
    box-shadow:
      0 0 30px rgba(255, 250, 230, 0.9),
      0 0 60px rgba(255, 240, 200, 0.6),
      0 0 100px rgba(255, 230, 180, 0.3);
  }

  .core-pulse {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50px;
    height: 50px;
    transform: translate(-50%, -50%);
    border: 2px solid rgba(255, 250, 230, 0.6);
    border-radius: 50%;
  }

  .core-pulse-1 { animation: pulse 1.5s ease-out infinite; }
  .core-pulse-2 { animation: pulse 1.5s ease-out infinite 0.3s; }
  .core-pulse-3 { animation: pulse 1.5s ease-out infinite 0.6s; }

  @keyframes pulse {
    0% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(4);
    }
  }

  .core-sparkle {
    position: absolute;
    inset: 0;
    
    .spark {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 3px;
      height: 3px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      transform-origin: center;
      transform: 
        rotate(calc(var(--i) * 45deg))
        translateX(12px);
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
    }
  }
}

// ===== 波纹粒子 =====
.ripple-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;

  :deep(.ripple-particle) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: var(--size);
    height: var(--size);
    background: radial-gradient(
      circle,
      rgba(255, 250, 235, 0.95) 0%,
      rgba(255, 240, 210, 0.7) 40%,
      rgba(255, 225, 180, 0.3) 70%,
      transparent 100%
    );
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(255, 250, 230, 0.6);
  }
}

// ===== 水珠效果 =====
.water-drops {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;

  :deep(.water-drop) {
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--drop-size);
    height: var(--drop-size);
    transform: translate(
      calc(-50% + cos(var(--drop-angle)) * var(--drop-distance)),
      calc(-50% + sin(var(--drop-angle)) * var(--drop-distance))
    );
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(240, 240, 230, 0.6) 50%,
      rgba(220, 220, 200, 0.3) 100%
    );
    border-radius: 50%;
    box-shadow: 
      0 0 6px rgba(255, 255, 255, 0.5),
      inset 0 0 3px rgba(255, 255, 255, 0.5);
    filter: blur(0.5px);
  }
}

// ===== 湿润边缘光晕 =====
.moisture-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(70vw + 60px);
  height: calc(75vh + 60px);
  transform: translate(-50%, -50%);
  border-radius: 20px;
  pointer-events: none;
  opacity: 0;
  background: 
    radial-gradient(
      ellipse at 50% 50%,
      transparent 40%,
      rgba(200, 190, 170, 0.15) 50%,
      rgba(180, 170, 150, 0.2) 55%,
      rgba(160, 150, 130, 0.15) 60%,
      transparent 70%
    );
  filter: blur(15px);
  animation: moistureBreath 5s ease-in-out infinite;

  @keyframes moistureBreath {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
}

// ===== 沙砾沉淀 =====
.sand-sediment {
  position: absolute;
  bottom: 10vh;
  left: 50%;
  transform: translateX(-50%);
  width: 60vw;
  height: 8px;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(180, 165, 145, 0.3) 20%,
    rgba(200, 185, 165, 0.4) 50%,
    rgba(180, 165, 145, 0.3) 80%,
    transparent 100%
  );
  filter: blur(3px);
  border-radius: 50%;
}
</style>
