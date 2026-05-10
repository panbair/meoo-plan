<template>
  <section class="smf-scroll-magnetic-fluid-133">
    <div class="smf-container-133">
      <h2 class="smf-section-title-133">磁性流体</h2>
      <p class="smf-section-subtitle-133">Magnetic Fluid Animation</p>

      <div class="smf-fluid-container-133" ref="container">
        <div class="smf-fluid-stage-133" ref="fluidStageRef">
          <div
            v-for="n in 12"
            :key="n"
            class="smf-fluid-blob-133"
            :ref="el => { if (el) blobRefs[n] = el as HTMLElement }"
            :style="getBlobStyle(n)"
          ></div>
        </div>

        <div class="smf-content-133">
          <div
            v-for="(item, index) in contentItems"
            :key="index"
            class="smf-content-item-133"
            :ref="el => { if (el) contentRefs[index] = el as HTMLElement }"
          >
            <div class="smf-number-133">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="smf-text-133">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
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

const container = ref<HTMLElement>()
const fluidStageRef = ref<HTMLElement>()
const blobRefs = ref<Record<number, HTMLElement>>({})
const contentRefs = ref<HTMLElement[]>([])

const contentItems = [
  {
    title: '流动之美',
    description: '磁流体的自然流动形态'
  },
  {
    title: '动态平衡',
    description: '在运动中保持完美的平衡'
  },
  {
    title: '视觉震撼',
    description: '令人惊叹的视觉效果'
  },
  {
    title: '科学艺术',
    description: '科学与艺术的完美结合'
  }
]

const getBlobStyle = (index: number) => {
  const hue = (index * 30 + 260) % 360
  const size = 150 + Math.random() * 100
  return {
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, hsla(${hue}, 70%, 60%, 0.6) 0%, hsla(${hue + 30}, 70%, 50%, 0.3) 50%, transparent 70%)`,
    left: `${10 + Math.random() * 80}%`,
    top: `${10 + Math.random() * 80}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${4 + Math.random() * 4}s`
  }
}

let gsapCtx: gsap.Context
let handleMouseMove: ((e: MouseEvent) => void) | null = null

onMounted(() => {
  handleMouseMove = (e: MouseEvent) => {
    if (!fluidStageRef.value) return

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const deltaX = (e.clientX - centerX) / centerX
    const deltaY = (e.clientY - centerY) / centerY

    gsap.to(fluidStageRef.value, {
      x: deltaX * 50,
      y: deltaY * 30,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  gsapCtx = gsap.context(() => {
    // 标题磁性吸引
    gsap.from('.smf-section-title-133', {
      scrollTrigger: {
        trigger: '.smf-scroll-magnetic-fluid-133',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      scale: 0.85,
      opacity: 0,
      filter: 'blur(15px)',
      ease: 'power3.out'
    })

    gsap.from('.smf-section-subtitle-133', {
      scrollTrigger: {
        trigger: '.smf-scroll-magnetic-fluid-133',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      y: 40,
      opacity: 0,
      ease: 'power3.out'
    })

    // 流体Blob动画
    Object.values(blobRefs.value).forEach((blob, index) => {
      gsap.set(blob, {
        scale: 0.3,
        opacity: 0.2
      })

      // 出现动画 - 扩大滚动范围
      gsap.to(blob, {
        scrollTrigger: {
          trigger: container.value,
          start: 'top 90%',
          end: 'top 40%',
          scrub: 2
        },
        scale: 1,
        opacity: 0.8,
        ease: 'power2.out'
      })

      // 持续变形
      gsap.to(blob, {
        scale: 0.8 + Math.random() * 0.6,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // 旋转动画
      gsap.to(blob, {
        rotation: 360,
        duration: 15 + Math.random() * 10,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 5
      })

      // 螺旋移动 - 增强移动范围
      gsap.to(blob, {
        x: (progress) => {
          return Math.sin(progress * Math.PI * 2) * 150
        },
        y: (progress) => {
          return Math.cos(progress * Math.PI * 2) * 80
        },
        duration: 8 + Math.random() * 6,
        repeat: -1,
        ease: 'sine.inOut',
        delay: Math.random() * 3
      })
    })

    // 内容项动画
    contentRefs.value.forEach((item, index) => {
      const number = item.querySelector('.smf-number-133') as HTMLElement
      const text = item.querySelector('.smf-text-133') as HTMLElement

      // 初始状态 - 改为半可见状态
      gsap.set(item, {
        x: -80,
        opacity: 0.4,
        filter: 'blur(3px)'
      })

      gsap.set(number, {
        scale: 0.5,
        rotation: -90,
        opacity: 0.5
      })

      // 滑入动画 - 扩大滚动范围
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 2
        },
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power3.out'
      })

      // 数字旋转进入 - 扩大滚动范围
      gsap.to(number, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 45%',
          scrub: 2
        },
        scale: 1,
        rotation: 0,
        opacity: 1,
        ease: 'back.out(1.5)'
      })

      // 持续微动
      gsap.to(item, {
        x: () => (Math.random() - 0.5) * 20,
        duration: 3 + index,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // 悬停磁性效果
      item.addEventListener('mouseenter', () => {
        gsap.to(number, {
          scale: 1.2,
          rotation: 10,
          duration: 0.5,
          ease: 'back.out(1.7)'
        })
        gsap.to(text, {
          x: 10,
          duration: 0.5,
          ease: 'power2.out'
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(number, {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(text, {
          x: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

    window.addEventListener('mousemove', handleMouseMove)
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
  if (handleMouseMove) {
    window.removeEventListener('mousemove', handleMouseMove)
    handleMouseMove = null
  }
})
</script>

<style scoped lang="scss">
.smf-scroll-magnetic-fluid-133 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0f0f2a 60%, #1a1a3a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
    pointer-events: none;
    animation: bg-glow 12s ease-in-out infinite;
  
  opacity: 1 !important;}
}

@keyframes bg-glow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.smf-container-133 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.smf-section-title-133 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ec4899, #a855f7, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(168, 85, 247, 0.5);

  opacity: 1 !important;}

.smf-section-subtitle-133 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.smf-fluid-container-133 {
  position: relative;
  min-height: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1500px;

  opacity: 1 !important;}

.smf-fluid-stage-133 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.smf-fluid-blob-133 {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.2;
  will-change: transform;
  animation: blob-pulse 4s ease-in-out infinite;
}

@keyframes blob-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.smf-content-133 {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 120px;
  padding: 50px;

  opacity: 1 !important;}

.smf-content-item-133 {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(236, 72, 153, 0.3);
    box-shadow: 0 15px 50px rgba(236, 72, 153, 0.2);
  
  opacity: 1 !important;}
}

.smf-number-133 {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ec4899, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-width: 100px;
  text-align: center;
  text-shadow: 0 0 40px rgba(236, 72, 153, 0.5);

  opacity: 1 !important;}

.smf-text-133 {
  flex: 1;

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 10px;
  
  opacity: 1 !important;}

  p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .smf-content-133 {
    padding: 20px;
    gap: 40px;
  
  opacity: 1 !important;}

  .smf-content-item-133 {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 30px;
  
  opacity: 1 !important;}

  .smf-number-133 {
    font-size: 2.5rem;
    min-width: auto;
  
  opacity: 1 !important;}

  .smf-section-title-133 {
    margin-bottom: 80px;
  }

  .smf-section-subtitle-133 {
    margin-bottom: 80px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}
}
</style>
