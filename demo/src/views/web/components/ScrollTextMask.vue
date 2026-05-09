<template>
  <div class="text-mask-wrapper-196">
    <div class="tm-stage-196" ref="stageRef">
      <div class="tm-mask-bg-196">
        <div class="tm-mask-layer-196" v-for="i in 3" :key="i"></div>
      </div>
      <div class="tm-container-196" ref="containerRef">
        <h2 class="tm-title-196">MASKED TEXT</h2>
        <div class="tm-text-stage-196">
          <div class="tm-text-line-196" v-for="(line, lineIndex) in textLines" :key="lineIndex">
            <span
              class="tm-char-196"
              v-for="(char, charIndex) in line.split('')"
              :key="charIndex"
              :data-char="char"
            >
              {{ char }}
            </span>
          </div>
        </div>
        <div class="tm-mask-selector-196">
          <div 
            class="tm-mask-option-196" 
            v-for="mask in masks" 
            :key="mask.name"
            :class="{ active: activeMask === mask.name }"
            @click="changeMask(mask)"
          >
            {{ mask.label }}
          </div>
        </div>
        <p class="tm-hint-196">Click to change mask</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stageRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const activeMask = ref('gradient')
const textLines = ref(['TEXT MASKING', 'VIDEO EFFECT', 'DYNAMIC STYLE'])

const masks = [
  { name: 'gradient', label: 'Gradient', image: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96e6a1)' },
  { name: 'neon', label: 'Neon', image: 'linear-gradient(90deg, #f093fb, #f5576c, #4facfe, #00f2fe)' },
  { name: 'ocean', label: 'Ocean', image: 'linear-gradient(135deg, #667eea, #764ba2, #6B8DD6, #8E37D7)' },
  { name: 'fire', label: 'Fire', image: 'linear-gradient(45deg, #f12711, #f5af19, #ff6b6b, #feca57)' },
  { name: 'aurora', label: 'Aurora', image: 'linear-gradient(90deg, #a8ff78, #78ffd6, #00c6ff, #0072ff)' }
]

const currentMask = computed(() => {
  return masks.find(m => m.name === activeMask.value)?.image || masks[0].image
})

const changeMask = (mask: any) => {
  activeMask.value = mask.name
  const chars = gsap.utils.toArray('.tm-char-196')
  
  gsap.to(chars, {
    scale: 0.8,
    opacity: 0.5,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      gsap.to(chars, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
        stagger: 0.03
      })
    }
  })
}

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  if (!stage || !container) return

  const title = container.querySelector('.tm-title-196')
  const lines = container.querySelectorAll('.tm-text-line-196')
  const allChars = container.querySelectorAll('.tm-char-196')
  const maskLayers = gsap.utils.toArray('.tm-mask-layer-196') as HTMLElement[]
  const maskOptions = gsap.utils.toArray('.tm-mask-option-196') as HTMLElement[]

  // 初始状态
  gsap.set(title, { opacity: 0, y: -50 })
  gsap.set(allChars, { opacity: 0, scale: 0.5 })
  gsap.set(maskLayers, { opacity: 0, scale: 1.5 })
  gsap.set(maskOptions, { opacity: 0, y: 20 })

  // 遮罩背景层
  gsap.to(maskLayers, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    },
    opacity: 0.8,
    scale: 1,
    stagger: 0.3
  })

  maskLayers.forEach((layer, i) => {
    gsap.to(layer, {
      backgroundPosition: '200% 200%',
      duration: 8 + i * 2,
      repeat: -1,
      ease: 'none'
    })
  })

  // 标题入场
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 75%',
      end: 'top 60%',
      scrub: 1
    },
    opacity: 1,
    y: 0
  })

  // 逐行显示
  lines.forEach((line, lineIndex) => {
    const chars = line.querySelectorAll('.tm-char-196')
    
    gsap.to(chars, {
      scrollTrigger: {
        trigger: stage,
        start: `top ${70 - lineIndex * 15}%`,
        end: `top ${40 - lineIndex * 10}%`,
        scrub: 0.8
      },
      opacity: 1,
      scale: 1,
      stagger: 0.05
    })
  })

  // 遮罩选项
  gsap.to(maskOptions, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 40%',
      end: 'top 20%',
      scrub: 0.5
    },
    opacity: 1,
    y: 0,
    stagger: 0.1
  })

  // 字符悬停效果
  allChars.forEach((char: Element) => {
    const charEl = char as HTMLElement
    charEl.addEventListener('mouseenter', () => {
      gsap.to(charEl, {
        scale: 1.2,
        filter: 'brightness(1.3)',
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
    })

    charEl.addEventListener('mouseleave', () => {
      gsap.to(charEl, {
        scale: 1,
        filter: 'brightness(1)',
        duration: 0.3
      })
    })
  })

  // 持续流动动画
  gsap.to(allChars, {
    backgroundPosition: '200% center',
    duration: 3,
    repeat: -1,
    ease: 'none',
    stagger: {
      each: 0.1,
      from: 'random'
    }
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

.text-mask-wrapper-196 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #000;
  overflow: hidden;

  opacity: 1 !important;}

.tm-stage-196 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  opacity: 1 !important;}

.tm-mask-bg-196 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.tm-mask-layer-196 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96e6a1);
  background-size: 400% 400%;
  mix-blend-mode: overlay;
  opacity: 0;
}

.tm-container-196 {
  position: relative;
  text-align: center;
  z-index: 10;
  max-width: 900px;

  opacity: 1 !important;}

.tm-title-196 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 60px;
  letter-spacing: 6px;
  color: #ffffff;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.tm-text-stage-196 {
  padding: 40px 60px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;

  opacity: 1 !important;}

.tm-text-line-196 {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 35px;
}

.tm-char-196 {
  display: inline-block;
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 2px;
  background: v-bind(currentMask);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
  min-width: 20px;

  opacity: 1 !important;}

.tm-mask-selector-196 {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.tm-mask-option-196 {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;

  opacity: 1 !important;}

.tm-mask-option-196:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.tm-mask-option-196.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: #4ecdc4;
  color: #ffffff;
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.4);

  opacity: 1 !important;}

.tm-hint-196 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .tm-title-196 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .tm-char-196 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .tm-text-stage-196 {
    padding: 30px 20px;
  
  opacity: 1 !important;}

  .tm-mask-selector-196 {
    gap: 10px;
  }

  .tm-mask-option-196 {
    padding: 10px 16px;
    font-size: 0.85rem;
  
  opacity: 1 !important;}
}
</style>
