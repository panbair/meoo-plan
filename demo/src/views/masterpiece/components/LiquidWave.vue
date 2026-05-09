<template>
  <div ref="containerRef" class="liquid-container">
    <div class="liquid-title">流体波浪</div>
    <div class="wave-wrapper" ref="waveWrapper">
      <div class="wave" ref="wave1"></div>
      <div class="wave" ref="wave2"></div>
      <div class="wave" ref="wave3"></div>
    </div>
    <div class="liquid-content" ref="contentRef">
      <div class="liquid-text" ref="textRef">
        <div class="text-line" v-for="(text, index) in texts" :key="index">
          {{ text }}
        </div>
      </div>
      <div class="floating-elements">
        <div class="float-item" ref="floatItems" v-for="i in 6" :key="i"></div>
      </div>
    </div>
    <div class="liquid-controls">
      <button @click="changeTheme" class="theme-btn">切换主题</button>
      <button @click="triggerWave" class="wave-btn">波浪爆发</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const containerRef = ref<HTMLElement>()
const waveWrapper = ref<HTMLElement>()
const wave1 = ref<HTMLElement>()
const wave2 = ref<HTMLElement>()
const wave3 = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const textRef = ref<HTMLElement>()
const floatItems = ref<HTMLElement[]>([])

const texts = ref(['FLUID', 'DYNAMICS', 'PURE', 'ENERGY'])
let currentTheme = 0

const themes = [
  {
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    wave1: 'rgba(102, 126, 234, 0.6)',
    wave2: 'rgba(118, 75, 162, 0.5)',
    wave3: 'rgba(240, 147, 251, 0.4)'
  },
  {
    bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    wave1: 'rgba(240, 147, 251, 0.6)',
    wave2: 'rgba(245, 87, 108, 0.5)',
    wave3: 'rgba(79, 172, 254, 0.4)'
  },
  {
    bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    wave1: 'rgba(79, 172, 254, 0.6)',
    wave2: 'rgba(0, 242, 254, 0.5)',
    wave3: 'rgba(67, 233, 123, 0.4)'
  },
  {
    bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    wave1: 'rgba(67, 233, 123, 0.6)',
    wave2: 'rgba(56, 249, 215, 0.5)',
    wave3: 'rgba(102, 126, 234, 0.4)'
  }
]

const changeTheme = () => {
  currentTheme = (currentTheme + 1) % themes.length
  const theme = themes[currentTheme]
  
  // GSAP主题切换动画
  gsap.to(containerRef.value, {
    background: theme.bg,
    duration: 0.5,
    ease: 'power2.inOut'
  })
  
  gsap.to([wave1.value, wave2.value, wave3.value], {
    backgroundColor: [theme.wave1, theme.wave2, theme.wave3],
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.inOut'
  })
}

const triggerWave = () => {
  // 波浪爆发动画
  const timeline = gsap.timeline()
  
  timeline
    .to(waveWrapper.value, {
      y: -50,
      duration: 0.3,
      ease: 'power2.out'
    })
    .to(waveWrapper.value, {
      y: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    })
  
  // 粒子爆发
  floatItems.value.forEach((item, index) => {
    const angle = (index / 6) * Math.PI * 2
    const distance = 200
    
    gsap.fromTo(item,
      { x: 0, y: 0, scale: 0 },
      {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 2,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.05,
        ease: 'power2.out'
      }
    )
  })
}

const initWaveAnimation = () => {
  // 波浪动画
  const waveElements = [wave1.value, wave2.value, wave3.value]
  
  waveElements.forEach((wave, index) => {
    gsap.to(wave, {
      y: '+=30',
      duration: 3 + index * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.2
    })
  })
  
  // 文字动画
  const textLines = textRef.value?.children
  if (textLines) {
    gsap.fromTo(Array.from(textLines),
      { y: 50, opacity: 0, filter: 'blur(10px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
      }
    )
    
    gsap.to(Array.from(textLines), {
      y: '-=10',
      duration: 2,
      repeat: -1,
      yoyo: true,
      stagger: 0.1,
      ease: 'sine.inOut'
    })
  }
  
  // 浮动元素动画
  floatItems.value.forEach((item, index) => {
    const randomX = Math.random() * 400 - 200
    const randomY = Math.random() * 300 - 150
    const randomDuration = 3 + Math.random() * 2
    const randomDelay = Math.random() * 2
    
    gsap.to(item, {
      x: randomX,
      y: randomY,
      rotation: Math.random() * 360,
      duration: randomDuration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: randomDelay
    })
  })
  
  // 容器呼吸效果
  gsap.to(containerRef.value, {
    scale: 1.02,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
}

const onMouseMove = (e: MouseEvent) => {
  if (!containerRef.value || !waveWrapper.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const mouseX = e.clientX - centerX
  const mouseY = e.clientY - centerY
  
  // 波浪跟随鼠标
  gsap.to(waveWrapper.value, {
    x: mouseX * 0.1,
    y: mouseY * 0.1,
    duration: 0.5,
    ease: 'power2.out'
  })
  
  // 内容视差效果
  if (contentRef.value) {
    gsap.to(contentRef.value, {
      x: mouseX * 0.05,
      y: mouseY * 0.05,
      duration: 0.5,
      ease: 'power2.out'
    })
  }
}

onMounted(() => {
  // 设置初始主题
  const theme = themes[0]
  if (containerRef.value) {
    containerRef.value.style.background = theme.bg
  }
  
  initWaveAnimation()
  
  if (containerRef.value) {
    containerRef.value.addEventListener('mousemove', onMouseMove)
  }
})

onUnmounted(() => {
  gsap.killTweensOf(floatItems.value)
  
  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', onMouseMove)
  }
})
</script>

<style scoped lang="scss">
.liquid-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(102, 126, 234, 0.4);
}

.liquid-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  z-index: 10;
  letter-spacing: 4px;
}

.wave-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 300px;
  display: flex;
  gap: 50px;
  transform-origin: bottom center;
}

.wave {
  flex: 1;
  height: 100%;
  background: rgba(102, 126, 234, 0.6);
  border-radius: 50% 50% 0 0;
  filter: blur(2px);
  animation: waveMove 8s ease-in-out infinite;
  
  &:nth-child(1) {
    animation-delay: 0s;
    opacity: 0.7;
  }
  
  &:nth-child(2) {
    animation-delay: -2s;
    opacity: 0.5;
  }
  
  &:nth-child(3) {
    animation-delay: -4s;
    opacity: 0.3;
  }
}

@keyframes waveMove {
  0%, 100% {
    transform: translateX(0) scaleY(1);
  }
  50% {
    transform: translateX(-50px) scaleY(1.2);
  }
}

.liquid-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5;
  pointer-events: none;
}

.liquid-text {
  text-align: center;
  margin-bottom: 50px;
}

.text-line {
  font-size: 5rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: 10px;
  text-transform: uppercase;
  opacity: 0;
  filter: blur(10px);
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.float-item {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  filter: blur(4px);
  
  &:nth-child(odd) {
    width: 30px;
    height: 30px;
  }
  
  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.4);
  }
}

.liquid-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
}

.theme-btn,
.wave-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  backdrop-filter: blur(10px);
}

.theme-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
  }
}

.wave-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;

  &:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.5);
  }
}

// CSS3 动画效果
.liquid-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.liquid-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  animation: shimmer 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0%, 100% { opacity: 0; transform: translateX(-100%); }
  50% { opacity: 1; transform: translateX(100%); }
}
</style>
