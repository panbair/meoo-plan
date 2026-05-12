<template>
  <div ref="parentRef" class="card-img-film">
    <!-- 背景 -->
    <div class="film-bg">
      <div class="bg-vignette"></div>
    </div>

    <!-- 胶片容器 -->
    <div ref="filmContainerRef" class="film-container">
      <!-- 胶片格1 -->
      <div ref="strip1Ref" class="film-strip">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="胶片帧1"
          class="strip-image"
        />
        <div class="strip-glow"></div>
      </div>

      <!-- 胶片格2 -->
      <div ref="strip2Ref" class="film-strip">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="胶片帧2"
          class="strip-image"
        />
        <div class="strip-glow"></div>
      </div>

      <!-- 胶片格3 -->
      <div ref="strip3Ref" class="film-strip">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="胶片帧3"
          class="strip-image"
        />
        <div class="strip-glow"></div>
      </div>

      <!-- 胶片格4 -->
      <div ref="strip4Ref" class="film-strip">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="胶片帧4"
          class="strip-image"
        />
        <div class="strip-glow"></div>
      </div>

      <!-- 胶片格5 -->
      <div ref="strip5Ref" class="film-strip">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="胶片帧5"
          class="strip-image"
        />
        <div class="strip-glow"></div>
      </div>

      <!-- 分隔线 -->
      <div ref="dividersRef" class="film-dividers">
        <div class="divider-line line-1"></div>
        <div class="divider-line line-2"></div>
        <div class="divider-line line-3"></div>
        <div class="divider-line line-4"></div>
      </div>
    </div>

    <!-- 齿孔装饰 -->
    <div class="sprocket-holes sprocket-left">
      <div v-for="i in 6" :key="'left-' + i" class="sprocket-hole"></div>
    </div>
    <div class="sprocket-holes sprocket-right">
      <div v-for="i in 6" :key="'right-' + i" class="sprocket-hole"></div>
    </div>

    <!-- 细微尘 -->
    <div ref="dustRef" class="film-dust">
      <div v-for="i in 20" :key="'dust-' + i" class="dust-particle" :style="getDustStyle(i)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const filmContainerRef = ref<HTMLElement | null>(null)
const strip1Ref = ref<HTMLElement | null>(null)
const strip2Ref = ref<HTMLElement | null>(null)
const strip3Ref = ref<HTMLElement | null>(null)
const strip4Ref = ref<HTMLElement | null>(null)
const strip5Ref = ref<HTMLElement | null>(null)
const dividersRef = ref<HTMLElement | null>(null)
const dustRef = ref<HTMLElement | null>(null)

const strips = [strip1Ref, strip2Ref, strip3Ref, strip4Ref, strip5Ref]

const getDustStyle = (i: number) => {
  const x = 10 + (i * 17) % 80
  const y = 10 + (i * 23) % 80
  const size = 1 + (i % 3)
  const delay = (i * 0.3) % 2
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`
  }
}

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !filmContainerRef.value) return
  if (!dividersRef.value || !dustRef.value) return

  // 初始状态
  strips.forEach((stripRef) => {
    if (stripRef.value) {
      const img = stripRef.value.querySelector('.strip-image') as HTMLElement
      if (img) {
        gsap.set(img, {
          filter: 'blur(15px) brightness(0.3)',
          opacity: 0
        })
      }
      gsap.set(stripRef.value, { opacity: 1 })
    }
  })

  gsap.set(dividersRef.value, { opacity: 1 })
  gsap.set(dustRef.value, { opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  // 依次点亮五格
  strips.forEach((stripRef, index) => {
    if (!stripRef.value) return
    
    const img = stripRef.value.querySelector('.strip-image') as HTMLElement
    const glow = stripRef.value.querySelector('.strip-glow') as HTMLElement
    
    if (!img) return

    const delay = index * 0.18

    // 主体渐显
    tl.to(img, {
      opacity: 1,
      filter: 'blur(0px) brightness(1)',
      duration: 0.6,
      ease: 'power3.in'
    }, delay)

    // 过冲锐化
    tl.to(img, {
      filter: 'blur(-0.8px) brightness(1.1)',
      duration: 0.1,
      ease: 'power2.out'
    }, delay + 0.3)
    tl.to(img, {
      filter: 'blur(0px) brightness(1)',
      duration: 0.1,
      ease: 'power2.out'
    }, delay + 0.4)

    // 发光边缘
    if (glow) {
      tl.fromTo(glow,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.out' },
        delay
      )
      tl.to(glow, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, delay + 0.5)
    }
  })

  // 分隔线发光
  tl.to(dividersRef.value, {
    boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
    duration: 0.4,
    ease: 'power2.out'
  }, 0.9)
  tl.to(dividersRef.value, {
    boxShadow: '0 0 2px rgba(255, 255, 255, 0.1)',
    duration: 0.4,
    ease: 'power2.in'
  }, 1.2)

  // 细微尘噪点
  tl.to(dustRef.value, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, 1.4)

  cleanupFns.push(() => {
    ScrollTrigger.getAll().forEach(st => st.kill())
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-img-film {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0a0a0a 0%, #151515 50%, #0a0a0a 100%);
  overflow: hidden;
  position: relative;
}

.film-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 40%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }
}

.film-container {
  position: relative;
  width: 60vmin;
  height: 48vmin;
  max-width: 600px;
  max-height: 480px;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
}

.film-strip {
  position: relative;
  flex: 1;
  overflow: hidden;
  border-bottom: 1px solid rgba(30, 30, 30, 0.8);
}

.strip-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(15px) brightness(0.3);
  opacity: 0;
}

.strip-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  pointer-events: none;
  opacity: 0;
}

.film-dividers {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.divider-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(20, 20, 20, 0.9);
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.05);

  &.line-1 { top: 20%; }
  &.line-2 { top: 40%; }
  &.line-3 { top: 60%; }
  &.line-4 { top: 80%; }
}

// 齿孔
.sprocket-holes {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 0;
}

.sprocket-left {
  left: 8px;
}

.sprocket-right {
  right: 8px;
}

.sprocket-hole {
  width: 10px;
  height: 6px;
  background: #0a0a0a;
  border: 1px solid rgba(40, 40, 40, 0.8);
  border-radius: 1px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.8);
}

// 细微尘噪点
.film-dust {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
}

.dust-particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: dustFloat 4s ease-in-out infinite;

  @keyframes dustFloat {
    0%, 100% {
      opacity: 0.1;
      transform: translate(0, 0);
    }
    25% {
      opacity: 0.25;
      transform: translate(1px, -1px);
    }
    50% {
      opacity: 0.15;
      transform: translate(-1px, 1px);
    }
    75% {
      opacity: 0.2;
      transform: translate(1px, 1px);
    }
  }
}
</style>
