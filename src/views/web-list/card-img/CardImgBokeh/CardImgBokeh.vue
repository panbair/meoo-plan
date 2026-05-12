<template>
  <div class="card-img-bokeh" ref="containerRef">
    <div class="bokeh-scene" ref="sceneRef">
      <!-- 远景：散景光斑层 -->
      <div class="bokeh-layer-far" ref="farLayerRef">
        <div 
          v-for="spot in bokehSpots" 
          :key="spot.id"
          class="bokeh-spot"
          :ref="el => setSpotRef(el, spot.id)"
          :style="{
            '--spot-x': spot.x + '%',
            '--spot-y': spot.y + '%',
            '--spot-size': spot.size + 'px',
            '--spot-hue': spot.hue,
            '--spot-delay': spot.delay + 's'
          }"
        ></div>
      </div>

      <!-- 中景：高清图片 -->
      <div class="bokeh-layer-mid" ref="midLayerRef">
        <div class="mid-image-wrapper" ref="midImageWrapperRef">
          <img
            :src="imageUrl"
            alt="Bokeh reveal"
            class="mid-image"
            ref="midImageRef"
            loading="lazy"
          />
          <div class="mid-image-overlay" ref="midImageOverlayRef"></div>
        </div>
      </div>

      <!-- 前景：文案 -->
      <div class="bokeh-layer-near" ref="nearLayerRef">
        <div class="near-content" ref="nearContentRef">
          <h2 class="bokeh-title" ref="titleRef">{{ title }}</h2>
          <p class="bokeh-subtitle" ref="subtitleRef">{{ subtitle }}</p>
          <div class="bokeh-divider" ref="dividerRef"></div>
          <p class="bokeh-description" ref="descriptionRef">{{ description }}</p>
          <button class="bokeh-cta" ref="ctaRef">{{ ctaText }}</button>
        </div>
      </div>

      <!-- 光斑粒子 -->
      <div class="bokeh-particles" ref="particlesRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
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
  title: 'Dream Horizon',
  subtitle: '光影交织的梦幻视界',
  description: '在虚与实的边界，光斑如星辰般闪烁，编织出令人沉醉的光影诗篇。每一帧都是一场视觉的邂逅。',
  ctaText: '探索更多'
})

// Refs
const containerRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const farLayerRef = ref<HTMLElement | null>(null)
const midLayerRef = ref<HTMLElement | null>(null)
const midImageWrapperRef = ref<HTMLElement | null>(null)
const midImageRef = ref<HTMLImageElement | null>(null)
const midImageOverlayRef = ref<HTMLElement | null>(null)
const nearLayerRef = ref<HTMLElement | null>(null)
const nearContentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []
const spotRefs: Map<number, HTMLElement> = new Map()

// 生成散景光斑数据
const bokehSpots = computed(() => {
  const spots = []
  const hues = [260, 280, 320, 340, 30, 45, 60] // 紫到黄
  
  for (let i = 0; i < 25; i++) {
    spots.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 30 + Math.random() * 120,
      hue: hues[Math.floor(Math.random() * hues.length)],
      delay: Math.random() * 2
    })
  }
  return spots
})

const setSpotRef = (el: any, id: number) => {
  if (el) spotRefs.set(id, el as HTMLElement)
}

// 初始化粒子
const initParticles = () => {
  if (!particlesRef.value) return
  
  const container = particlesRef.value
  container.innerHTML = ''
  
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div')
    particle.className = 'bokeh-particle'
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = 2 + Math.random() * 4
    const delay = Math.random() * 3
    
    particle.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${delay}s;
      --particle-hue: ${250 + Math.random() * 80};
    `
    container.appendChild(particle)
  }
}

// 创建散景视差动画
const createBokehAnimation = () => {
  if (!containerRef.value) return

  // ===== 远景层：光斑飘移 (速度最慢 0.05) =====
  spotRefs.forEach((spot, id) => {
    const spotData = bokehSpots.value.find(s => s.id === id)
    if (!spotData) return
    
    const hueStart = spotData.hue
    const hueEnd = spotData.hue + (Math.random() > 0.5 ? 40 : -40)
    
    const spotTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'bottom 0%',
        scrub: 2
      }
    })
    
    cleanupFns.push({
      kill: () => {
        spotTl.kill()
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.data && st.vars.data.spotId === id) {
            st.kill()
          }
        })
      }
    })
    
    // Y轴移动
    spotTl.fromTo(spot,
      { y: 0 },
      { y: -150, ease: 'none' },
      0
    )
    
    // Scale呼吸
    spotTl.fromTo(spot,
      { scale: 1 },
      { 
        scale: 1.04,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      },
      0
    )
    
    // Opacity起伏
    spotTl.fromTo(spot,
      { opacity: 0.6 },
      { 
        opacity: 0.8,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      },
      0
    )
    
    // 色相变化
    spotTl.to(spot,
      {
        '--spot-hue': hueEnd,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      },
      0
    )
  })

  // ===== 中景层：图片推进 (速度中 0.2) =====
  const midTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  cleanupFns.push({
    kill: () => {
      midTl.kill()
    }
  })

  // 图片Y轴移动
  midTl.fromTo(midLayerRef.value,
    { y: 0 },
    { y: -80, ease: 'none' },
    0
  )

  // 图片透明度
  midTl.fromTo(midImageWrapperRef.value,
    { opacity: 0.75 },
    { opacity: 1, ease: 'none' },
    0
  )

  // 图片模糊变化
  midTl.fromTo(midImageRef.value,
    { filter: 'blur(2px)' },
    { filter: 'blur(0px)', ease: 'none' },
    0
  )

  // 遮罩淡出
  midTl.to(midImageOverlayRef.value,
    { opacity: 0, ease: 'none' },
    0
  )

  // ===== 前景层：文案掠过 (速度最快 0.45) =====
  const nearTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  cleanupFns.push({
    kill: () => {
      nearTl.kill()
    }
  })

  // 文案Y轴快速移动
  nearTl.fromTo(nearContentRef.value,
    { y: 0 },
    { y: -120, ease: 'none' },
    0
  )

  // 标题淡入
  nearTl.fromTo(titleRef.value,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, ease: 'power2.out' },
    0.1
  )

  // 副标题淡入
  nearTl.fromTo(subtitleRef.value,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, ease: 'power2.out' },
    0.2
  )

  // 分割线展开
  nearTl.fromTo(dividerRef.value,
    { scaleX: 0 },
    { scaleX: 1, ease: 'power2.out' },
    0.3
  )

  // 描述淡入
  nearTl.fromTo(descriptionRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, ease: 'power2.out' },
    0.4
  )

  // CTA按钮
  nearTl.fromTo(ctaRef.value,
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, ease: 'back.out(1.7)' },
    0.5
  )

  // ===== 粒子动画 =====
  if (particlesRef.value) {
    const particles = particlesRef.value.querySelectorAll('.bokeh-particle')
    
    particles.forEach((particle, i) => {
      const particleTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.5
        }
      })
      
      cleanupFns.push({
        kill: () => particleTl.kill()
      })
      
      particleTl.fromTo(particle,
        { 
          y: 0,
          opacity: 0.3,
          scale: 0.5
        },
        { 
          y: -200,
          opacity: 0.8,
          scale: 1.5,
          ease: 'none'
        },
        0
      )
    })
  }
}

onMounted(() => {
  initParticles()
  requestAnimationFrame(() => {
    createBokehAnimation()
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
.card-img-bokeh {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #1a1625 0%,
    #2d2640 25%,
    #1f1a30 50%,
    #251d35 75%,
    #1a1528 100%
  );
}

.bokeh-scene {
  width: 100%;
  height: 100%;
  position: relative;
}

// ===== 远景：散景光斑层 =====
.bokeh-layer-far {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.bokeh-spot {
  position: absolute;
  left: var(--spot-x);
  top: var(--spot-y);
  width: var(--spot-size);
  height: var(--spot-size);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle at center,
    hsla(var(--spot-hue), 70%, 70%, 0.4) 0%,
    hsla(calc(var(--spot-hue) + 20), 60%, 60%, 0.2) 40%,
    hsla(calc(var(--spot-hue) + 40), 50%, 50%, 0.1) 60%,
    transparent 80%
  );
  filter: blur(8px);
  opacity: 0.6;
  animation: bokehFloat 8s ease-in-out infinite;
  animation-delay: var(--spot-delay);

  &::before {
    content: '';
    position: absolute;
    inset: 20%;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      hsla(var(--spot-hue), 80%, 80%, 0.5) 0%,
      transparent 70%
    );
    filter: blur(4px);
  }

  @keyframes bokehFloat {
    0%, 100% {
      transform: translate(-50%, -50%) translateY(0);
    }
    50% {
      transform: translate(-50%, -50%) translateY(-20px);
    }
  }
}

// ===== 中景：图片层 =====
.bokeh-layer-mid {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mid-image-wrapper {
  position: relative;
  width: 60vw;
  height: 70vh;
  max-width: 800px;
  max-height: 900px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.5),
    0 15px 50px rgba(0, 0, 0, 0.3);

  .mid-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(2px) brightness(0.7);
  }

  .mid-image-overlay {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(
        ellipse at 30% 40%,
        rgba(180, 140, 255, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 70% 60%,
        rgba(255, 180, 140, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
}

// ===== 前景：文案层 =====
.bokeh-layer-near {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8vw;
}

.near-content {
  max-width: 450px;
  text-align: right;
}

.bokeh-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5em;
  letter-spacing: 0.05em;
  text-shadow: 
    0 0 40px rgba(180, 140, 255, 0.5),
    0 4px 20px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
}

.bokeh-subtitle {
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 1.5em;
  letter-spacing: 0.15em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.bokeh-divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 200, 150, 0.8) 50%,
    transparent 100%
  );
  margin: 0 0 1.5em;
  margin-left: auto;
  box-shadow: 0 0 20px rgba(255, 200, 150, 0.4);
}

.bokeh-description {
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin: 0 0 2em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.bokeh-cta {
  display: inline-block;
  padding: 1em 2.5em;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #1a1625;
  background: linear-gradient(
    135deg,
    #ffd700 0%,
    #ffb347 50%,
    #ffd700 100%
  );
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 20px rgba(255, 200, 100, 0.4),
    0 2px 10px rgba(255, 180, 80, 0.3);
  
  &:hover {
    transform: scale(1.05);
    box-shadow:
      0 6px 30px rgba(255, 200, 100, 0.6),
      0 3px 15px rgba(255, 180, 80, 0.4);
  }
}

// ===== 粒子层 =====
.bokeh-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;

  :deep(.bokeh-particle) {
    position: absolute;
    background: radial-gradient(
      circle at center,
      hsla(var(--particle-hue), 70%, 80%, 0.9) 0%,
      hsla(calc(var(--particle-hue) + 30), 60%, 70%, 0.5) 40%,
      transparent 70%
    );
    border-radius: 50%;
    filter: blur(1px);
    box-shadow: 0 0 8px hsla(var(--particle-hue), 70%, 70%, 0.5);
    animation: particleGlow 4s ease-in-out infinite;

    @keyframes particleGlow {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.2);
      }
    }
  }
}
</style>
