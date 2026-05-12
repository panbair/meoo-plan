<template>
  <div class="card-img-pearl" ref="containerRef">
    <div class="pearl-scene" ref="sceneRef">
      <!-- 缎面背景 -->
      <div class="satin-backdrop" ref="backdropRef"></div>
      
      <!-- 主图片容器 -->
      <div class="pearl-frame" ref="frameRef">
        <!-- 主图片 -->
        <div class="pearl-image-wrapper" ref="imageWrapperRef">
          <img
            :src="imageUrl"
            alt="Pearl luster"
            class="pearl-image"
            ref="imageRef"
            loading="lazy"
          />
          
          <!-- 珍珠母贝虹彩层 -->
          <div class="pearl-iridescence" ref="iridescenceRef">
            <div class="iridescence-gradient"></div>
          </div>
        </div>
        
        <!-- 缎面边缘光泽 -->
        <div class="satin-edge" ref="satinEdgeRef"></div>
        
        <!-- 外框投影 -->
        <div class="frame-shadow" ref="frameShadowRef"></div>
      </div>
      
      <!-- 晨雾散去粒子 -->
      <div class="mist-particles" ref="mistRef"></div>
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
  imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80'
})

// Refs
const containerRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const backdropRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const iridescenceRef = ref<HTMLElement | null>(null)
const satinEdgeRef = ref<HTMLElement | null>(null)
const frameShadowRef = ref<HTMLElement | null>(null)
const mistRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// 创建晨雾粒子
const initMistParticles = () => {
  if (!mistRef.value) return
  
  const container = mistRef.value
  container.innerHTML = ''
  
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div')
    particle.className = 'mist-particle'
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${Math.random() * 80 + 40}px;
      height: ${Math.random() * 60 + 30}px;
      animation-delay: ${Math.random() * 3}s;
      animation-duration: ${Math.random() * 4 + 6}s;
    `
    container.appendChild(particle)
  }
}

// 创建珍珠光泽溶解动画
const createPearlAnimation = () => {
  if (!containerRef.value || !frameRef.value || !imageWrapperRef.value) return

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

  // 阶段1: 晨雾缓慢散去 - 模糊溶解
  tl.fromTo(
    imageWrapperRef.value,
    {
      filter: 'blur(10px) brightness(0.85)',
      opacity: 0.8,
      scale: 1.02
    },
    {
      filter: 'blur(0px) brightness(1)',
      opacity: 1,
      scale: 1,
      duration: 2.0,
      ease: 'sine.inOut'
    }
  )

  // 阶段2: 轻柔回正旋转 + 上浮
  tl.fromTo(
    frameRef.value,
    {
      rotateZ: -2,
      y: 10
    },
    {
      rotateZ: 0,
      y: 0,
      duration: 1.8,
      ease: 'sine.inOut'
    },
    0.2
  )

  // 阶段3: 旋转惯性过冲 - 珍珠轻颤
  tl.to(
    frameRef.value,
    {
      rotateZ: 0.4,
      duration: 0.2,
      ease: 'power2.out'
    },
    '-=0.4'
  )

  tl.to(
    frameRef.value,
    {
      rotateZ: 0,
      duration: 0.8,
      ease: 'elastic.out(1.2, 0.6)'
    }
  )

  // 阶段4: 珍珠母贝虹彩 - 从边缘蔓延后消退
  if (iridescenceRef.value) {
    const gradient = iridescenceRef.value.querySelector('.iridescence-gradient') as HTMLElement
    
    if (gradient) {
      tl.fromTo(
        gradient,
        {
          opacity: 0.9,
          background: 'radial-gradient(ellipse at 25% 15%, rgba(255,240,250,0.6) 0%, rgba(245,230,255,0.3) 30%, transparent 60%)'
        },
        {
          opacity: 0,
          background: 'radial-gradient(ellipse at 25% 15%, rgba(255,240,250,0) 0%, rgba(245,230,255,0) 30%, transparent 60%)',
          duration: 2.0,
          ease: 'sine.out'
        },
        0.4
      )
    }
  }

  // 阶段5: 缎面边缘光泽 - 柔和闪现
  if (satinEdgeRef.value) {
    tl.fromTo(
      satinEdgeRef.value,
      {
        opacity: 0.7,
        boxShadow: 'inset 0 0 30px 5px rgba(255, 250, 245, 0.4), inset 0 0 60px 10px rgba(255, 245, 240, 0.2)'
      },
      {
        opacity: 0,
        boxShadow: 'inset 0 0 0 0 rgba(255, 250, 245, 0), inset 0 0 0 0 rgba(255, 245, 240, 0)',
        duration: 1.5,
        ease: 'sine.in'
      },
      0.6
    )
  }

  // 阶段6: 晨雾粒子飘散
  if (mistRef.value) {
    tl.fromTo(
      mistRef.value,
      { opacity: 0.6 },
      { opacity: 0, duration: 2.5, ease: 'sine.out' },
      0
    )
  }

  // 阶段7: 外框投影渐渐显现
  if (frameShadowRef.value) {
    tl.fromTo(
      frameShadowRef.value,
      {
        opacity: 0,
        boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)'
      },
      {
        opacity: 1,
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.12), 0 10px 30px rgba(0, 0, 0, 0.08)',
        duration: 1.5,
        ease: 'sine.out'
      },
      0.8
    )
  }

  // 阶段8: 缎面背景渐入
  if (backdropRef.value) {
    tl.fromTo(
      backdropRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'sine.out' },
      0.5
    )
  }
}

onMounted(() => {
  initMistParticles()
  requestAnimationFrame(() => {
    createPearlAnimation()
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
.card-img-pearl {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #fefcfb 0%, #fdf8f5 50%, #fff9f5 100%);
}

.pearl-scene {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

// 缎面背景
.satin-backdrop {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: 
    radial-gradient(ellipse at 30% 20%, rgba(255, 252, 250, 0.8) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(255, 248, 245, 0.6) 0%, transparent 50%),
    linear-gradient(135deg, #fefcfb 0%, #fff8f5 50%, #fefcfb 100%);
  pointer-events: none;
}

// 主框架
.pearl-frame {
  position: relative;
  width: 72vw;
  height: 78vh;
  max-width: 960px;
  border-radius: 6px;
  overflow: visible;
}

.pearl-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
  filter: blur(10px) brightness(0.85);
  opacity: 0.8;
  transform: scale(1.02);

  .pearl-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .pearl-iridescence {
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 6px;
    overflow: hidden;

    .iridescence-gradient {
      position: absolute;
      inset: 0;
      opacity: 0.9;
      mix-blend-mode: soft-light;
    }
  }
}

// 缎面边缘光泽
.satin-edge {
  position: absolute;
  inset: -3px;
  pointer-events: none;
  border-radius: 9px;
  opacity: 0.7;
  box-shadow: 
    inset 0 0 30px 5px rgba(255, 250, 245, 0.4),
    inset 0 0 60px 10px rgba(255, 245, 240, 0.2);
}

// 外框投影
.frame-shadow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 6px;
  opacity: 0;
  z-index: -1;
}

// 晨雾粒子
.mist-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.6;

  :deep(.mist-particle) {
    position: absolute;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 250, 248, 0.4) 40%,
      transparent 70%
    );
    border-radius: 50%;
    filter: blur(8px);
    animation: mistFloat 8s ease-in-out infinite;

    @keyframes mistFloat {
      0%, 100% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0.6;
      }
      33% {
        transform: translateY(-20px) translateX(15px) scale(1.1);
        opacity: 0.8;
      }
      66% {
        transform: translateY(-10px) translateX(-10px) scale(0.95);
        opacity: 0.5;
      }
    }
  }
}
</style>
