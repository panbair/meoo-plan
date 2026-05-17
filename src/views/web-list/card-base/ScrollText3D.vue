<template>
  <section class="st3-scroll-text-3d-128">
    <div class="st3-container-128">
      <h2 class="st3-section-title-128">滚动3D文字</h2>
      <p class="st3-section-subtitle-128">Scroll 3D Text Animation</p>

      <div class="st3-3d-stage-128" ref="stage">
        <div class="st3-text-rows-128">
          <div
            v-for="(row, index) in textRowsData"
            :key="index"
            class="st3-text-row-128"
            :data-row="index"
            ref="textRows"
          >
            <div class="st3-text-layer-128" :style="getLayerStyle(index, 0)"></div>
            <div class="st3-text-layer-128" :style="getLayerStyle(index, 1)"></div>
            <div class="st3-text-layer-128" :style="getLayerStyle(index, 2)"></div>
            <div class="st3-text-content-128">
              <span class="st3-text-128">{{ row }}</span>
            </div>
          </div>
        </div>

        <div class="st3-floating-elements-128">
          <div
            v-for="n in 12"
            :key="n"
            class="st3-float-element-128"
            :style="getFloatStyle(n)"
            ref="floatElements"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stage = ref<HTMLElement | null>(null)
const textRows = ref<HTMLElement[]>([])
const floatElements = ref<HTMLElement[]>([])
let handleMouseMove: ((e: MouseEvent) => void) | null = null

const textRowsData = [
  'CREATE',
  'INNOVATE',
  'DESIGN',
  'INSPIRE',
  'TRANSFORM',
  'EVOLVE'
]

const getLayerStyle = (rowIndex: number, layerIndex: number) => {
  const hue = (rowIndex * 60 + layerIndex * 30) % 360
  const opacity = 0.3 - layerIndex * 0.1
  const translateZ = layerIndex * 20
  return {
    background: `linear-gradient(135deg, hsla(${hue}, 70%, 60%, ${opacity}) 0%, hsla(${hue + 60}, 70%, 60%, ${opacity}) 100%)`,
    transform: `translateZ(${translateZ}px) scale(${1 - layerIndex * 0.05})`
  }
}

const getFloatStyle = (index: number) => {
  const size = 20 + Math.random() * 40
  const hue = Math.random() * 360
  const left = Math.random() * 100
  const top = Math.random() * 100
  return {
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, hsla(${hue}, 70%, 60%, 0.6) 0%, transparent 70%)`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${3 + Math.random() * 2}s`
  }
}

let gsapCtx: gsap.Context

onMounted(() => {
  gsapCtx = gsap.context(() => {
    // 标题3D动画
    gsap.from('.st3-section-title-128', {
      scrollTrigger: {
        trigger: '.st3-scroll-text-3d-128',
        start: 'top 85%',
        end: 'top 60%',
        scrub: 1
      },
      rotateX: 60,
      rotateY: -30,
      scale: 1.5,
      opacity: 0,
      ease: 'power3.out'
    })

    // 副标题3D
    gsap.from('.st3-section-subtitle-128', {
      scrollTrigger: {
        trigger: '.st3-scroll-text-3d-128',
        start: 'top 80%',
        end: 'top 55%',
        scrub: 1
      },
      rotateX: 45,
      rotateZ: 10,
      opacity: 0,
      ease: 'power3.out'
    })

    // 3D文字行动画
    textRows.value.forEach((row, index) => {
      const text = row.querySelector('.st3-text-128') as HTMLElement

      // 初始3D状态 - 降低旋转角度，保持可见性
      gsap.set(row, {
        rotateX: 45,
        rotateY: (index - 2.5) * 15,
        translateZ: -100 * Math.abs(index - 2.5),
        scale: 0.9,
        opacity: 0.5
      })

      // 滚动触发3D变换 - 增强动画范围
      gsap.to(row, {
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 2
        },
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        scale: 1,
        opacity: 1,
        ease: 'power3.out'
      })

      // 持续轻微3D摆动动画 - 降低旋转幅度
      gsap.to(row, {
        rotateY: (currentRot) => {
          return currentRot + 3
        },
        duration: 8 + index * 0.5,
        repeat: -1,
        ease: 'sine.inOut',
        delay: index * 0.2
      })

      // 文字悬停效果 - 增强交互反馈
      row.addEventListener('mouseenter', () => {
        gsap.to(row, {
          rotateX: 10,
          rotateY: 15,
          scale: 1.08,
          translateZ: 30,
          duration: 0.6,
          ease: 'back.out(1.5)'
        })
      })

      row.addEventListener('mouseleave', () => {
        gsap.to(row, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          translateZ: 0,
          duration: 0.6,
          ease: 'power2.out'
        })
      })
    })

    // 浮动元素动画 - 增强效果
    floatElements.value.forEach((el, index) => {
      gsap.set(el, {
        scale: 0.5,
        opacity: 0
      })

      gsap.to(el, {
        scrollTrigger: {
          trigger: stage.value,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 1.5
        },
        scale: 1,
        opacity: 0.8,
        y: (progress) => {
          return -50 + progress * 100
        },
        ease: 'power1.inOut'
      })

      // 持续浮动 - 增强动画
      gsap.to(el, {
        y: -40,
        scale: 1.2,
        duration: 4 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      })

      // 旋转动画
      gsap.to(el, {
        rotation: 360,
        duration: 10 + Math.random() * 5,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 3
      })
    })

    // 鼠标视差效果 - 增强交互
    handleMouseMove = (e: MouseEvent) => {
      if (!stage.value) return

      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const deltaX = (e.clientX - centerX) / centerX
      const deltaY = (e.clientY - centerY) / centerY

      const textRowsEl = stage.value.querySelector('.st3-text-rows-128')
      if (textRowsEl) {
        gsap.to(textRowsEl, {
          rotateY: deltaX * 20,
          rotateX: -deltaY * 15,
          translateZ: deltaX * 50,
          duration: 0.8,
          ease: 'power2.out'
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
  if (handleMouseMove) {
    window.removeEventListener('mousemove', handleMouseMove)
  }
})
</script>

<style scoped lang="scss">
.st3-scroll-text-3d-128 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1e1e3f 50%, #0a0a1a 100%);
  position: relative;
  overflow: hidden;
  perspective: 2000px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 80%);
    pointer-events: none;
    animation: glow 8s ease-in-out infinite;
  
  opacity: 1 !important;}
}

.st3-container-128 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.st3-section-title-128 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #3b82f6, #ec4899, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(59, 130, 246, 0.4);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.st3-section-subtitle-128 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 150px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.st3-3d-stage-128 {
  position: relative;
  min-height: 600px;
  perspective: 1500px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.st3-text-rows-128 {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.st3-text-row-128 {
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  cursor: pointer;
  margin: 30px 0;

  opacity: 1 !important;}

.st3-text-layer-128 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  pointer-events: none;
  filter: blur(10px);

  opacity: 1 !important;}

.st3-text-content-128 {
  position: relative;
  z-index: 10;
  transform-style: preserve-3d;
}

.st3-text-128 {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.9) 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow:
    0 0 40px rgba(59, 130, 246, 0.4),
    0 0 80px rgba(236, 72, 153, 0.3),
    0 0 120px rgba(168, 85, 247, 0.2);
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.st3-floating-elements-128 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.st3-float-element-128 {
  position: absolute;
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

@keyframes glow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .st3-text-row-128 {
    height: 80px;
    margin: 20px 0;
  
  opacity: 1 !important;}

  .st3-text-128 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .st3-section-title-128 {
    margin-bottom: 80px;
  }

  .st3-section-subtitle-128 {
    margin-bottom: 80px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .st3-3d-stage-128 {
    min-height: 400px;
  
  opacity: 1 !important;}

  .st3-container-128 {
    padding: 0 20px;
  
  opacity: 1 !important;}
}
</style>
