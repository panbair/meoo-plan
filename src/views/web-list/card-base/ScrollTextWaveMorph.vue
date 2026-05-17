<template>
  <div class="twm-wrapper-219">
    <div class="twm-container-219">
      <!-- 标题区域 -->
      <div class="twm-header-219">
        <h2 class="twm-title-219">文字波浪变形</h2>
        <p class="twm-subtitle-219">六种波浪类型 · 动态字符效果</p>
      </div>

      <!-- 波浪类型选择按钮 -->
      <div class="twm-controls-219">
        <button class="twm-btn-219" @click="playWave('upward')" :class="{ active: currentWaveType === 'upward' }">
          <span class="twm-btn-icon-219">↑</span>
          向上波浪
        </button>
        <button class="twm-btn-219" @click="playWave('downward')" :class="{ active: currentWaveType === 'downward' }">
          <span class="twm-btn-icon-219">↓</span>
          向下波浪
        </button>
        <button class="twm-btn-219" @click="playWave('left')" :class="{ active: currentWaveType === 'left' }">
          <span class="twm-btn-icon-219">←</span>
          左侧波浪
        </button>
        <button class="twm-btn-219" @click="playWave('right')" :class="{ active: currentWaveType === 'right' }">
          <span class="twm-btn-icon-219">→</span>
          右侧波浪
        </button>
        <button class="twm-btn-219 twm-btn-primary-219" @click="playWave('explosion')" :class="{ active: currentWaveType === 'explosion' }">
          <span class="twm-btn-icon-219">✨</span>
          爆炸散开
        </button>
        <button class="twm-btn-219" @click="playWave('vortex')" :class="{ active: currentWaveType === 'vortex' }">
          <span class="twm-btn-icon-219">🌀</span>
          漩涡旋转
        </button>
      </div>

      <!-- 文字展示区域 -->
      <div class="twm-text-stage-219" id="twm-text-stage-219">
        <div
          v-for="(word, wIndex) in displayWords"
          :key="wIndex"
          class="twm-word-219"
          :id="`twm-word-${wIndex}-219`"
        >
          <span
            v-for="(char, cIndex) in word.split('')"
            :key="cIndex"
            class="twm-char-219"
            :id="`twm-char-${wIndex}-${cIndex}-219`"
            @mouseenter="onCharHover(wIndex, cIndex)"
            @mouseleave="onCharLeave(wIndex, cIndex)"
          >
            {{ char }}
          </span>
        </div>
      </div>

      <!-- 状态信息显示 -->
      <div class="twm-info-219">
        <div class="twm-info-item-219">
          <span class="twm-info-value-219" id="twm-wave-type-219">UPWARD</span>
          <span class="twm-info-label-219">波浪类型</span>
        </div>
        <div class="twm-info-item-219">
          <span class="twm-info-value-219" id="twm-char-count-219">{{ totalChars }}</span>
          <span class="twm-info-label-219">字符数量</span>
        </div>
        <div class="twm-info-item-219">
          <span class="twm-info-value-219" id="twm-wave-speed-219">{{ waveSpeed }}x</span>
          <span class="twm-info-label-219">波浪速度</span>
        </div>
      </div>

      <!-- 控制滑块 -->
      <div class="twm-sliders-219">
        <div class="twm-slider-group-219">
          <label class="twm-slider-label-219">波浪幅度</label>
          <input
            type="range"
            class="twm-slider-219"
            v-model="waveAmplitude"
            min="10"
            max="100"
            @input="updateWaveParams"
          />
          <span class="twm-slider-value-219">{{ waveAmplitude }}px</span>
        </div>
        <div class="twm-slider-group-219">
          <label class="twm-slider-label-219">波浪频率</label>
          <input
            type="range"
            class="twm-slider-219"
            v-model="waveFrequency"
            min="0.1"
            max="2"
            step="0.1"
            @input="updateWaveParams"
          />
          <span class="twm-slider-value-219">{{ waveFrequency }}x</span>
        </div>
        <div class="twm-slider-group-219">
          <label class="twm-slider-label-219">字符间距</label>
          <input
            type="range"
            class="twm-slider-219"
            v-model="charSpacing"
            min="0"
            max="0.15"
            step="0.01"
            @input="updateSpacing"
          />
          <span class="twm-slider-value-219">{{ charSpacing }}em</span>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="twm-progress-219">
        <div class="twm-progress-bar-219" id="twm-progress-bar-219"></div>
      </div>
    </div>

    <!-- Canvas 背景效果 -->
    <canvas class="twm-canvas-219" id="twm-canvas-219"></canvas>
    <!-- 粒子效果 -->
    <div class="twm-particles-219" id="twm-particles-219"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 响应式数据
const words = ref(['WAVE', 'MORPH', 'ANIMATION', 'EFFECTS'])
const displayWords = computed(() => words.value)

const waveAmplitude = ref(60)
const waveFrequency = ref(0.8)
const charSpacing = ref(0.05)
const waveSpeed = ref(1.0)
const currentWaveType = ref('upward')

const totalChars = computed(() => words.value.join('').length)

// Canvas 相关
const canvas = ref(null)
let ctx = null
let animationFrame = null
let particles = []

// 初始化 Canvas
const initCanvas = () => {
  canvas.value = document.getElementById('twm-canvas-219')
  ctx = canvas.value.getContext('2d')
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
}

const resizeCanvas = () => {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

// 绘制动态波浪背景
const drawWaveTrail = () => {
  if (!ctx || !canvas.value) return

  // 淡出效果
  ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

  const time = Date.now() * 0.001
  const centerY = canvas.value.height / 2

  // 绘制多层波浪
  for (let layer = 0; layer < 3; layer++) {
    ctx.beginPath()
    ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 - layer * 0.05})`
    ctx.lineWidth = 2 - layer * 0.5

    for (let x = 0; x < canvas.value.width; x += 3) {
      const waveY =
        centerY +
        Math.sin(x * 0.005 * waveFrequency.value + time + layer) *
          waveAmplitude.value *
          (1.5 - layer * 0.3) +
        Math.sin(x * 0.01 + time * 1.5 + layer * 2) * 20

      if (x === 0) {
        ctx.moveTo(x, waveY)
      } else {
        ctx.lineTo(x, waveY)
      }
    }
    ctx.stroke()
  }

  animationFrame = requestAnimationFrame(drawWaveTrail)
}

// 创建粒子效果
const createParticles = () => {
  const container = document.getElementById('twm-particles-219')
  if (!container) return

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'twm-particle-219'
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%);
    `
    container.appendChild(particle)

    const duration = 4 + Math.random() * 6
    gsap.to(particle, {
      y: -150 - Math.random() * 150,
      x: (Math.random() - 0.5) * 80,
      opacity: 0,
      duration,
      repeat: -1,
      delay: Math.random() * 3,
      ease: 'none'
    })

    gsap.to(particle, {
      scale: 0,
      duration: duration * 0.4,
      repeat: -1,
      delay: Math.random() * 3,
      ease: 'power1.in'
    })
  }
}

// 播放波浪动画
const playWave = (type) => {
  currentWaveType.value = type
  const waveTypeEl = document.getElementById('twm-wave-type-219')
  if (waveTypeEl) {
    waveTypeEl.textContent = type.toUpperCase()
  }

  const chars = gsap.utils.toArray('.twm-char-219')
  const words = gsap.utils.toArray('.twm-word-219')

  // 停止所有现有动画
  gsap.killTweensOf(chars)
  gsap.killTweensOf(words)

  const amplitude = waveAmplitude.value
  const frequency = waveFrequency.value

  switch (type) {
    case 'upward':
      chars.forEach((char, index) => {
        const delay = index * 0.03
        gsap.fromTo(
          char,
          { y: -amplitude * 2, opacity: 0, scale: 0.5 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay,
            ease: 'back.out(1.5)',
            onComplete: () => {
              gsap.to(char, {
                y: () => Math.sin(index * 0.5 + Date.now() * 0.003) * 15,
                duration: 2 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
              })
            }
          }
        )
      })
      break

    case 'downward':
      chars.forEach((char, index) => {
        const delay = index * 0.03
        gsap.fromTo(
          char,
          { y: -amplitude * 2, opacity: 0, scale: 0.5 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay,
            ease: 'back.out(1.5)',
            onComplete: () => {
              gsap.to(char, {
                y: () => Math.sin(index * 0.5 + Date.now() * 0.003 + Math.PI) * 15,
                duration: 2 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
              })
            }
          }
        )
      })
      break

    case 'left':
      chars.forEach((char, index) => {
        const delay = index * 0.03
        gsap.fromTo(
          char,
          { x: -amplitude * 2, opacity: 0, scale: 0.5 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay,
            ease: 'back.out(1.5)',
            onComplete: () => {
              gsap.to(char, {
                x: () => Math.sin(index * 0.5 + Date.now() * 0.003) * 15,
                duration: 2 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
              })
            }
          }
        )
      })
      break

    case 'right':
      chars.forEach((char, index) => {
        const delay = index * 0.03
        gsap.fromTo(
          char,
          { x: -amplitude * 2, opacity: 0, scale: 0.5 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay,
            ease: 'back.out(1.5)',
            onComplete: () => {
              gsap.to(char, {
                x: () => Math.sin(index * 0.5 + Date.now() * 0.003 + Math.PI) * 15,
                duration: 2 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
              })
            }
          }
        )
      })
      break

    case 'explosion':
      chars.forEach((char, index) => {
        const angle = (index / chars.length) * Math.PI * 2
        const distance = amplitude * 2.5

        gsap.fromTo(
          char,
          { scale: 0, opacity: 0, rotation: Math.random() * 180 - 90 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            delay: index * 0.015,
            ease: 'elastic.out(1, 0.5)',
            onComplete: () => {
              gsap.to(char, {
                x: Math.cos(angle) * distance * 0.3,
                y: Math.sin(angle) * distance * 0.3,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => {
                  gsap.to(char, {
                    x: 0,
                    y: 0,
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)'
                  })
                }
              })
            }
          }
        )
      })
      break

    case 'vortex':
      chars.forEach((char, index) => {
        const radius = amplitude * 1.5
        const startAngle = (index / chars.length) * Math.PI * 2

        gsap.fromTo(
          char,
          {
            x: Math.cos(startAngle) * radius,
            y: Math.sin(startAngle) * radius,
            scale: 0,
            opacity: 0,
            rotation: -720
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            delay: index * 0.02,
            ease: 'back.out(1.5)'
          }
        )
      })
      break
  }

  // 波浪类型动画反馈
  if (waveTypeEl) {
    gsap.fromTo(
      waveTypeEl,
      { scale: 0.8, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
    )
  }
}

// 字符悬停效果
const onCharHover = (wIndex, cIndex) => {
  const char = document.getElementById(`twm-char-${wIndex}-${cIndex}-219`)
  if (!char) return

  gsap.to(char, {
    scale: 1.4,
    color: '#a855f7',
    textShadow: '0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)',
    duration: 0.3,
    ease: 'back.out(1.7)'
  })

  // 相邻字符轻微效果
  const adjacentChars = [
    document.getElementById(`twm-char-${wIndex}-${cIndex - 1}-219`),
    document.getElementById(`twm-char-${wIndex}-${cIndex + 1}-219`)
  ]

  adjacentChars.forEach((adj) => {
    if (adj) {
      gsap.to(adj, { scale: 1.1, duration: 0.3, ease: 'power2.out' })
    }
  })
}

const onCharLeave = (wIndex, cIndex) => {
  const char = document.getElementById(`twm-char-${wIndex}-${cIndex}-219`)
  if (!char) return

  gsap.to(char, {
    scale: 1,
    color: '',
    textShadow: '',
    duration: 0.3,
    ease: 'power2.out'
  })

  // 恢复相邻字符
  const adjacentChars = [
    document.getElementById(`twm-char-${wIndex}-${cIndex - 1}-219`),
    document.getElementById(`twm-char-${wIndex}-${cIndex + 1}-219`)
  ]

  adjacentChars.forEach((adj) => {
    if (adj) {
      gsap.to(adj, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }
  })
}

// 更新波浪参数
const updateWaveParams = () => {
  const chars = gsap.utils.toArray('.twm-char-219')
  chars.forEach((char, index) => {
    gsap.killTweensOf(char)
    gsap.to(char, {
      y: Math.sin(index * waveFrequency.value * 0.5) * (waveAmplitude.value * 0.25),
      duration: 0.5,
      ease: 'power2.out'
    })
  })
}

// 更新字符间距
const updateSpacing = () => {
  const chars = gsap.utils.toArray('.twm-char-219')
  chars.forEach((char) => {
    char.style.marginRight = `${charSpacing.value}em`
  })
}

// 初始化滚动动画
const initScrollAnimations = () => {
  // 标题动画
  gsap.from('.twm-title-219', {
    y: -60,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '.twm-container-219',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  gsap.from('.twm-subtitle-219', {
    y: -30,
    opacity: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.twm-container-219',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  })

  // 控制按钮动画
  gsap.from('.twm-btn-219', {
    y: 40,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: 'back.out(1.5)',
    scrollTrigger: {
      trigger: '.twm-controls-219',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })

  // 文字动画
  gsap.from('.twm-word-219', {
    y: 80,
    opacity: 0,
    scale: 0.8,
    stagger: 0.15,
    duration: 0.7,
    ease: 'back.out(1.5)',
    scrollTrigger: {
      trigger: '.twm-text-stage-219',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  // 信息卡片动画
  gsap.from('.twm-info-item-219', {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.twm-info-219',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })

  // 滑块动画
  gsap.from('.twm-slider-group-219', {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.twm-sliders-219',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })

  // 进度条滚动动画
  gsap.to('#twm-progress-bar-219', {
    width: '100%',
    scrollTrigger: {
      trigger: '.twm-container-219',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1
    }
  })
}

// 组件挂载
onMounted(() => {
  initCanvas()
  drawWaveTrail()
  createParticles()
  initScrollAnimations()
  updateSpacing()

  // 延迟播放初始波浪
  setTimeout(() => {
    playWave('upward')
  }, 800)
})

// 组件卸载
onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped lang="scss">
.twm-wrapper-219 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  overflow: visible;
  padding: 60px 20px;

  opacity: 1 !important;}

.twm-container-219 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 10;

  opacity: 1 !important;}

.twm-header-219 {
  text-align: center;
  margin-bottom: 50px;

  opacity: 1 !important;}

.twm-title-219 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  text-shadow: 0 0 60px rgba(168, 85, 247, 0.4);

  opacity: 1 !important;}

.twm-subtitle-219 {
  font-size: 1.1rem;
  color: #94a3b8;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.twm-controls-219 {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.twm-btn-219 {
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  color: #e2e8f0;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 8px;

  &.active {
    background: rgba(168, 85, 247, 0.2);
    border-color: rgba(168, 85, 247, 0.6);
    color: #a855f7;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
  
  opacity: 1 !important;}

  &:hover {
    background: rgba(168, 85, 247, 0.15);
    border-color: rgba(168, 85, 247, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(168, 85, 247, 0.2);
  }
}

.twm-btn-primary-219 {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  border-color: transparent;
  color: #fff;

  &:hover {
    background: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
    box-shadow: 0 8px 30px rgba(236, 72, 153, 0.4);
  
  opacity: 1 !important;}
}

.twm-btn-icon-219 {
  font-size: 1.1rem;

  opacity: 1 !important;}

.twm-text-stage-219 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  margin-bottom: 60px;
  min-height: 350px;
  justify-content: center;

  opacity: 1 !important;}

.twm-word-219 {
  display: flex;
  gap: 0;
  perspective: 1000px;
}

.twm-char-219 {
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 900;
  color: #a855f7;
  display: inline-block;
  transition: color 0.3s, text-shadow 0.3s;
  text-shadow: 0 0 50px rgba(168, 85, 247, 0.4);
  cursor: pointer;
  will-change: transform;
  user-select: none;

  opacity: 1 !important;}

.twm-info-219 {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.twm-info-item-219 {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 18px 28px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(168, 85, 247, 0.3);
    transform: translateY(-3px);
  
  opacity: 1 !important;}
}

.twm-info-value-219 {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;

  opacity: 1 !important;}

.twm-info-label-219 {
  font-size: 0.8rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;

  opacity: 1 !important;}

.twm-sliders-219 {
  display: flex;
  justify-content: center;
  gap: 35px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.twm-slider-group-219 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 180px;

  opacity: 1 !important;}

.twm-slider-label-219 {
  font-size: 0.85rem;
  color: #e2e8f0;
  font-weight: 600;

  opacity: 1 !important;}

.twm-slider-219 {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(168, 85, 247, 0.4);
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    
  opacity: 1 !important;}
  }
}

.twm-slider-value-219 {
  font-size: 0.8rem;
  color: #94a3b8;
  text-align: right;

  opacity: 1 !important;}

.twm-progress-219 {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.twm-progress-bar-219 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%);
  border-radius: 2px;

  opacity: 1 !important;}

.twm-canvas-219 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;}

.twm-particles-219 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;}

.twm-particle-219 {
  position: absolute;
  border-radius: 50%;
  filter: blur(1px);
}

// 响应式设计
@media (max-width: 768px) {
  .twm-title-219 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .twm-subtitle-219 {
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .twm-controls-219 {
    gap: 8px;
  }

  .twm-btn-219 {
    padding: 10px 16px;
    font-size: 0.75rem;
  
  opacity: 1 !important;}

  .twm-char-219 {
    font-size: clamp(2rem, 8vw, 4rem);
  
  opacity: 1 !important;}

  .twm-info-219 {
    gap: 15px;
  }

  .twm-info-item-219 {
    padding: 14px 20px;
    min-width: 90px;
  
  opacity: 1 !important;}

  .twm-info-value-219 {
    font-size: 1.4rem;
  
  opacity: 1 !important;}

  .twm-sliders-219 {
    gap: 20px;
  }

  .twm-slider-group-219 {
    min-width: 140px;
  
  opacity: 1 !important;}
}
</style>
