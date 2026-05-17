<template>
  <section class="sbp-background-pattern-225">
    <div class="sbp-header-225">
      <h2 class="sbp-title-225">背景图案动画</h2>
      <p class="sbp-subtitle-225">动态渐变 · 图案移动 · 滤镜变换</p>
    </div>

    <div class="sbp-container-225">
      <!-- 背景展示区域 -->
      <div class="sbp-background-stage-225">
        <div 
          class="sbp-background-display-225"
          :style="backgroundStyle"
          ref="backgroundDisplay"
        >
          <!-- 动态图案层 -->
          <div 
            v-for="(pattern, index) in activePatterns"
            :key="index"
            class="sbp-pattern-layer-225"
            :class="`sbp-pattern-${pattern.type}-225`"
            :style="{
              top: pattern.y + '%',
              left: pattern.x + '%',
              opacity: pattern.opacity,
              transform: `scale(${pattern.scale}) rotate(${pattern.rotation}deg)`
            }"
          ></div>

          <!-- 内容层 -->
          <div class="sbp-content-overlay-225">
            <h3 class="sbp-content-title-225">{{ currentBgType.name }}</h3>
            <p class="sbp-content-desc-225">{{ currentBgType.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const backgroundDisplay = ref(null)
let lastBgTypeIndex = -1

// 背景类型
const bgTypes = [
  { id: 'linear', name: '线性渐变', icon: '📊', description: '平滑的线性渐变背景' },
  { id: 'radial', name: '径向渐变', icon: '🎯', description: '从中心向外扩散的渐变' },
  { id: 'conic', name: '锥形渐变', icon: '🌀', description: '圆锥形旋转渐变效果' },
  { id: 'pattern', name: '图案背景', icon: '🎨', description: '重复的几何图案' },
  { id: 'wave', name: '波浪背景', icon: '🌊', description: '流动的波浪图案' },
  { id: 'grid', name: '网格背景', icon: '🔲', description: '现代网格设计' }
]

const currentBgType = ref(bgTypes[0])

// 颜色
const color1 = ref('#667eea')
const color2 = ref('#764ba2')
const color3 = ref('#f093fb')
const activeFilter = ref('none')
const animationSpeed = ref(1)
const patternDensity = ref(15)

// 图案数据
const activePatterns = ref([])

// 背景样式
const backgroundStyle = computed(() => {
  const bgType = currentBgType.value.id
  const c1 = color1.value
  const c2 = color2.value
  const c3 = color3.value
  const filter = activeFilter.value
  const speed = animationSpeed.value

  let gradient = ''

  switch (bgType) {
    case 'linear':
      gradient = `linear-gradient(${45 * speed}deg, ${c1}, ${c2}, ${c3})`
      break
    case 'radial':
      gradient = `radial-gradient(circle at ${50 * speed}%, ${c1}, ${c2}, ${c3})`
      break
    case 'conic':
      gradient = `conic-gradient(from ${0 * speed}deg at 50% 50%, ${c1}, ${c2}, ${c3}, ${c1})`
      break
    case 'pattern':
      gradient = `repeating-linear-gradient(${45 * speed}deg, ${c1}, ${c1} 10px, ${c2} 10px, ${c2} 20px)`
      break
    case 'wave':
      gradient = `linear-gradient(${180 + 10 * Math.sin(speed)}deg, ${c1}, ${c2}, ${c3}, ${c2}, ${c1})`
      break
    case 'grid':
      gradient = `
        linear-gradient(${c1} 1px, transparent 1px),
        linear-gradient(90deg, ${c1} 1px, transparent 1px),
        linear-gradient(${c2} 2px, transparent 2px),
        linear-gradient(90deg, ${c2} 2px, transparent 2px),
        ${c3}
      `
      break
    default:
      gradient = `linear-gradient(135deg, ${c1}, ${c2}, ${c3})`
  }

  return {
    background: gradient,
    backgroundSize: bgType === 'grid' ? '50px 50px, 50px 50px, 100px 100px, 100px 100px, 100% 100%' : '400% 400%',
    backgroundPosition: bgType === 'linear' ? `${speed * 10}% ${speed * 20}%` : 'center',
    filter: filter,
    animation: bgType === 'wave' ? `waveMotion ${3 / speed}s ease-in-out infinite` : 'none'
  }
})

// 生成图案
const generatePatterns = () => {
  const patterns = []
  const density = patternDensity.value
  const types = ['circle', 'square', 'triangle', 'star', 'diamond']

  for (let i = 0; i < density; i++) {
    patterns.push({
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.3 + 0.1
    })
  }

  activePatterns.value = patterns
}

// 设置背景类型
const setBgType = (typeId) => {
  currentBgType.value = bgTypes.find(t => t.id === typeId)
  generatePatterns()
}

// 初始化滚动动画
const initScrollAnimations = () => {
  gsap.from('.sbp-title-225', {
    scrollTrigger: {
      trigger: '.sbp-header-225',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from('.sbp-subtitle-225', {
    scrollTrigger: {
      trigger: '.sbp-header-225',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out'
  })

  gsap.from('.sbp-background-display-225', {
    scrollTrigger: {
      trigger: '.sbp-background-stage-225',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    scale: 0.8,
    opacity: 0,
    rotationX: 45,
    duration: 1.2,
    ease: 'power3.out'
  })

  // 滚动控制背景类型切换
  gsap.to({}, {
    scrollTrigger: {
      trigger: '.sbp-background-pattern-225',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5,
      onUpdate: (self) => {
        const totalTypes = bgTypes.length
        const typeIndex = Math.min(Math.floor(self.progress * totalTypes), totalTypes - 1)

        if (typeIndex !== lastBgTypeIndex && bgTypes[typeIndex]) {
          lastBgTypeIndex = typeIndex
          setBgType(bgTypes[typeIndex].id)

          // 根据滚动进度调整动画速度
          animationSpeed.value = 0.5 + (self.progress * 2)
        }

        // 根据滚动进度调整图案密度
        patternDensity.value = Math.floor(5 + (self.progress * 25))
      }
    }
  })
}

onMounted(() => {
  generatePatterns()
  initScrollAnimations()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.sbp-background-pattern-225 {
  min-height: 100vh;
  padding: 60px 40px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sbp-header-225 {
  text-align: center;
  margin-bottom: 40px;

  opacity: 1 !important;}

.sbp-title-225 {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899, #8b5cf6, #0ea5e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;

  opacity: 1 !important;}

.sbp-subtitle-225 {
  font-size: 1.2rem;
  color: #94a3b8;

  opacity: 1 !important;}

.sbp-container-225 {
  max-width: 1200px;
  margin: 0 auto;

  opacity: 1 !important;}

.sbp-background-stage-225 {
  position: relative;
  margin-bottom: 30px;
}

.sbp-background-display-225 {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease;

  opacity: 1 !important;}

.sbp-pattern-layer-225 {
  position: absolute;
  transition: all 0.3s ease;
  pointer-events: none;
}

.sbp-pattern-circle-225 {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.sbp-pattern-square-225 {
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(45deg);

  opacity: 1 !important;}

.sbp-pattern-triangle-225 {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 35px solid rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.sbp-pattern-star-225 {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);

  opacity: 1 !important;}

.sbp-pattern-diamond-225 {
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(45deg);

  opacity: 1 !important;}

.sbp-content-overlay-225 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;

  opacity: 1 !important;}

.sbp-content-title-225 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.sbp-content-desc-225 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

@keyframes waveMotion {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@media (max-width: 768px) {
  .sbp-title-225 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .sbp-subtitle-225 {
    font-size: 1rem;
  
  opacity: 1 !important;}

  .sbp-background-display-225 {
    height: 300px;
  
  opacity: 1 !important;}
}
</style>
