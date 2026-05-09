<template>
  <div class="gradient-text-wrapper-194">
    <div class="gt-stage-194" ref="stageRef">
      <div class="gt-gradient-bg-194">
        <div class="gt-gradient-layer-194" v-for="i in 4" :key="i"></div>
      </div>
      <div class="gt-light-rays-194">
        <div class="gt-ray-194" v-for="i in 8" :key="i"></div>
      </div>
      <div class="gt-container-194" ref="containerRef">
        <h2 class="gt-title-194">GRADIENT FLOW</h2>
        <div class="gt-text-container-194">
          <div class="gt-gradient-line-194" v-for="(line, lineIndex) in textLines" :key="lineIndex">
            <span
              class="gt-char-194"
              v-for="(char, charIndex) in line.split('')"
              :key="charIndex"
            >
              {{ char }}
            </span>
          </div>
        </div>
        <div class="gt-flow-indicator-194">
          <div class="gt-flow-bar-194" v-for="i in 12" :key="i"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stageRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const textLines = ref(['COLORFUL STREAM', 'VIBRANT ENERGY', 'ENDLESS FLOW'])

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  if (!stage || !container) return

  const title = container.querySelector('.gt-title-194')
  const lines = container.querySelectorAll('.gt-gradient-line-194')
  const allChars = container.querySelectorAll('.gt-char-194')
  const gradientLayers = gsap.utils.toArray('.gt-gradient-layer-194') as HTMLElement[]
  const rays = gsap.utils.toArray('.gt-ray-194') as HTMLElement[]
  const flowBars = gsap.utils.toArray('.gt-flow-bar-194') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50, backgroundPosition: '0% center' })
  gsap.set(lines, { opacity: 0 })
  gsap.set(allChars, { opacity: 0, backgroundPosition: '0% center' })
  gsap.set(gradientLayers, { opacity: 0, scale: 1.2 })
  gsap.set(rays, { scaleX: 0, opacity: 0 })
  gsap.set(flowBars, { scaleX: 0 })

  // 标题流光入场
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1
    },
    opacity: 1,
    y: 0,
    backgroundPosition: '200% center',
    duration: 3
  })

  // 渐变层
  gsap.to(gradientLayers, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 75%',
      end: 'top 50%',
      scrub: 1
    },
    opacity: 0.6,
    scale: 1,
    stagger: 0.2
  })

  // 持续渐变动画
  gradientLayers.forEach((layer, i) => {
    gsap.to(layer, {
      backgroundPosition: '200% center',
      duration: 5 + i,
      repeat: -1,
      ease: 'none'
    })
  })

  // 光线扩散
  gsap.to(rays, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 70%',
      end: 'top 40%',
      scrub: 0.5
    },
    scaleX: 1,
    opacity: 0.4,
    stagger: 0.15
  })

  // 持续光线动画
  rays.forEach((ray, i) => {
    gsap.to(ray, {
      rotation: i * 45,
      duration: 10,
      repeat: -1,
      ease: 'none'
    })
  })

  // 流动指示器
  gsap.to(flowBars, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 60%',
      end: 'top 30%',
      scrub: 0.5
    },
    scaleX: 1,
    stagger: 0.08
  })

  // 持续流动动画
  flowBars.forEach((bar, i) => {
    gsap.to(bar, {
      scaleX: 0.3 + Math.random() * 0.7,
      duration: 1 + i * 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    gsap.to(bar, {
      backgroundPosition: '200% center',
      duration: 2 + i * 0.2,
      repeat: -1,
      ease: 'none'
    })
  })

  // 逐行显示
  lines.forEach((line, lineIndex) => {
    gsap.to(line, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 65%',
        end: 'top 35%',
        scrub: 1
      },
      opacity: 1
    })

    const chars = line.querySelectorAll('.gt-char-194')
    chars.forEach((char, charIndex) => {
      gsap.to(char, {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'top 30%',
          scrub: 0.5
        },
        opacity: 1,
        delay: lineIndex * 0.1 + charIndex * 0.02
      })

      // 流光动画
      gsap.to(char, {
        backgroundPosition: '200% center',
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 0.5
        },
        duration: 2,
        repeat: -1,
        ease: 'none'
      })
    })
  })

  // 字符悬停效果
  allChars.forEach((char, i) => {
    char.addEventListener('mouseenter', () => {
      gsap.to(char, {
        scale: 1.3,
        textShadow: '0 0 30px rgba(255, 107, 107, 0.8)',
        duration: 0.3
      })

      gsap.to(char, {
        backgroundPosition: '400% center',
        duration: 0.5,
        ease: 'none'
      })
    })

    char.addEventListener('mouseleave', () => {
      gsap.to(char, {
        scale: 1,
        textShadow: 'none',
        duration: 0.3
      })
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.gradient-text-wrapper-194 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  overflow: hidden;

  opacity: 1 !important;}

.gt-stage-194 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.gt-gradient-bg-194 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.gt-gradient-layer-194 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    #ff6b6b,
    #feca57,
    #48dbfb,
    #ff9ff3,
    #54a0ff,
    #5f27cd,
    #ff6b6b
  );
  background-size: 400% 400%;
  filter: blur(40px);

  opacity: 1 !important;}

.gt-light-rays-194 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  pointer-events: none;

  opacity: 1 !important;}

.gt-ray-194 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform-origin: left center;

  opacity: 1 !important;}

.gt-container-194 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 900px;

  opacity: 1 !important;}

.gt-title-194 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 60px;
  letter-spacing: 6px;
  background: linear-gradient(
    90deg,
    #ff6b6b,
    #feca57,
    #48dbfb,
    #ff9ff3,
    #54a0ff,
    #5f27cd,
    #ff6b6b
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 107, 107, 0.5);

  opacity: 1 !important;}

.gt-text-container-194 {
  padding: 40px 60px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 107, 107, 0.3);
  margin-bottom: 40px;

  opacity: 1 !important;}

.gt-gradient-line-194 {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 25px;
}

.gt-char-194 {
  display: inline-block;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(
    90deg,
    #ff6b6b,
    #feca57,
    #48dbfb,
    #ff9ff3,
    #54a0ff,
    #5f27cd,
    #ff6b6b
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
  min-width: 20px;

  opacity: 1 !important;}

.gt-flow-indicator-194 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.gt-flow-bar-194 {
  width: 10px;
  height: 40px;
  border-radius: 5px;
  background: linear-gradient(
    180deg,
    #ff6b6b,
    #feca57,
    #48dbfb,
    #ff9ff3,
    #54a0ff,
    #5f27cd
  );
  background-size: 100% 400%;
  transform-origin: bottom;

  opacity: 1 !important;}

@keyframes gradientFlow {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

@media (max-width: 768px) {
  .gt-title-194 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .gt-char-194 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
}
</style>
