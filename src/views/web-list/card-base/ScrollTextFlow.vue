<template>
  <section class="text-flow-section-219">
    <div class="container">
      <div class="title-wrapper-219">
        <h2 class="section-title-219">
          <span class="title-text-219">文字流式</span>
          <span class="title-subtitle-219">Text Flow</span>
        </h2>
        <p class="description-219">
          文字像水流一样连续流动，创造无限循环的视觉体验
        </p>
      </div>

      <!-- 多向流动文字 -->
      <div class="flow-container-219">
        <!-- 从左到右流动 -->
        <div class="flow-row-219 flow-left-219">
          <div class="marquee-219">
            <span v-for="(text, i) in flowTexts.left" :key="`left-${i}`" class="flow-text-219">
              {{ text }}
            </span>
            <span v-for="(text, i) in flowTexts.left" :key="`left-dup-${i}`" class="flow-text-219">
              {{ text }}
            </span>
          </div>
        </div>

        <!-- 从右到左流动 -->
        <div class="flow-row-219 flow-right-219">
          <div class="marquee-219">
            <span v-for="(text, i) in flowTexts.right" :key="`right-${i}`" class="flow-text-219">
              {{ text }}
            </span>
            <span v-for="(text, i) in flowTexts.right" :key="`right-dup-${i}`" class="flow-text-219">
              {{ text }}
            </span>
          </div>
        </div>

        <!-- 从左到右流动（大字） -->
        <div class="flow-row-219 flow-left-large-219">
          <div class="marquee-219">
            <span v-for="(text, i) in flowTexts.large" :key="`large-${i}`" class="flow-text-large-219">
              {{ text }}
            </span>
            <span v-for="(text, i) in flowTexts.large" :key="`large-dup-${i}`" class="flow-text-large-219">
              {{ text }}
            </span>
          </div>
        </div>

        <!-- 从右到左流动（大字） -->
        <div class="flow-row-219 flow-right-large-219">
          <div class="marquee-219">
            <span v-for="(text, i) in flowTexts.largeReverse" :key="`large-rev-${i}`" class="flow-text-large-219">
              {{ text }}
            </span>
            <span v-for="(text, i) in flowTexts.largeReverse" :key="`large-rev-dup-${i}`" class="flow-text-large-219">
              {{ text }}
            </span>
          </div>
        </div>

        <!-- 垂直流动 -->
        <div class="flow-vertical-container-219">
          <div class="flow-column-219 flow-up-219">
            <div class="marquee-vertical-219">
              <div v-for="(text, i) in flowTexts.vertical" :key="`up-${i}`" class="flow-text-vertical-219">
                {{ text }}
              </div>
              <div v-for="(text, i) in flowTexts.vertical" :key="`up-dup-${i}`" class="flow-text-vertical-219">
                {{ text }}
              </div>
            </div>
          </div>

          <div class="flow-column-219 flow-down-219">
            <div class="marquee-vertical-219">
              <div v-for="(text, i) in flowTexts.verticalReverse" :key="`down-${i}`" class="flow-text-vertical-219">
                {{ text }}
              </div>
              <div v-for="(text, i) in flowTexts.verticalReverse" :key="`down-dup-${i}`" class="flow-text-vertical-219">
                {{ text }}
              </div>
            </div>
          </div>
        </div>

        <!-- 斜向流动 -->
        <div class="flow-diagonal-container-219">
          <div class="flow-diagonal-219 diagonal-left-219">
            <div class="marquee-diagonal-219">
              <span v-for="(text, i) in flowTexts.diagonal" :key="`diag-left-${i}`" class="flow-text-diagonal-219">
                {{ text }}
              </span>
              <span v-for="(text, i) in flowTexts.diagonal" :key="`diag-left-dup-${i}`" class="flow-text-diagonal-219">
                {{ text }}
              </span>
            </div>
          </div>

          <div class="flow-diagonal-219 diagonal-right-219">
            <div class="marquee-diagonal-219">
              <span v-for="(text, i) in flowTexts.diagonalReverse" :key="`diag-right-${i}`" class="flow-text-diagonal-219">
                {{ text }}
              </span>
              <span v-for="(text, i) in flowTexts.diagonalReverse" :key="`diag-right-dup-${i}`" class="flow-text-diagonal-219">
                {{ text }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 速度控制 -->
      <div class="speed-control-219">
        <div class="control-title-219">流动速度</div>
        <div class="control-buttons-219">
          <button class="speed-btn-219" @click="setSpeed('slow')">慢速</button>
          <button class="speed-btn-219 active-219" @click="setSpeed('normal')">正常</button>
          <button class="speed-btn-219" @click="setSpeed('fast')">快速</button>
        </div>
      </div>

      <!-- 粒子背景 -->
      <canvas class="flow-particles-219" ref="particlesCanvas"></canvas>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const particlesCanvas = ref(null)
let ctx = null
let particles = []
let animationFrame = null

const flowTexts = {
  left: [
    '✨ 创意无限',
    '🚀 持续创新',
    '💡 灵感迸发',
    '🎨 美学设计',
    '⚡ 高效开发'
  ],
  right: [
    '🌟 追求卓越',
    '🔮 前瞻视野',
    '💎 精雕细琢',
    '🎯 精准定位',
    '🌈 多彩未来'
  ],
  large: [
    'INFINITE CREATIVITY',
    'ENDLESS POSSIBILITIES',
    'LIMITLESS POTENTIAL'
  ],
  largeReverse: [
    'BEYOND BOUNDARIES',
    'BREAKING LIMITS',
    'PUSHING FORWARD'
  ],
  vertical: [
    '向上流动',
    '持续成长',
    '不断进步',
    '勇攀高峰'
  ],
  verticalReverse: [
    '向下渗透',
    '深入思考',
    '稳步前行',
    '脚踏实地'
  ],
  diagonal: [
    '斜向探索',
    '多元发展',
    '创新突破'
  ],
  diagonalReverse: [
    '交叉融合',
    '整合创新',
    '协同发展'
  ]
}

const currentSpeed = ref('normal')
const speedConfig = {
  slow: { duration: 20 },
  normal: { duration: 12 },
  fast: { duration: 6 }
}

// 设置速度
function setSpeed(speed) {
  currentSpeed.value = speed
  const marqueeElements = document.querySelectorAll('.marquee-219, .marquee-vertical-219, .marquee-diagonal-219')
  
  marqueeElements.forEach(el => {
    gsap.killTweensOf(el)
    
    if (el.classList.contains('marquee-vertical-219')) {
      gsap.to(el, {
        y: '-50%',
        duration: speedConfig[speed].duration * 1.5,
        repeat: -1,
        ease: 'none'
      })
    } else if (el.classList.contains('marquee-diagonal-219')) {
      gsap.to(el, {
        x: '-50%',
        duration: speedConfig[speed].duration * 1.2,
        repeat: -1,
        ease: 'none'
      })
    } else {
      gsap.to(el, {
        x: '-50%',
        duration: speedConfig[speed].duration,
        repeat: -1,
        ease: 'none'
      })
    }
  })

  // 更新按钮状态
  document.querySelectorAll('.speed-btn-219').forEach(btn => {
    btn.classList.remove('active-219')
  })
  event.target.classList.add('active-219')
}

// 创建粒子
function createParticles() {
  particles = []
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 60 + 180
    })
  }
}

// 绘制粒子
function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  
  particles.forEach(particle => {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`
    ctx.fill()
    
    particle.x += particle.speedX
    particle.y += particle.speedY
    
    if (particle.x < 0) particle.x = window.innerWidth
    if (particle.x > window.innerWidth) particle.x = 0
    if (particle.y < 0) particle.y = window.innerHeight
    if (particle.y > window.innerHeight) particle.y = 0
  })
  
  animationFrame = requestAnimationFrame(drawParticles)
}

onMounted(() => {
  // 初始化粒子
  if (particlesCanvas.value) {
    particlesCanvas.value.width = window.innerWidth
    particlesCanvas.value.height = window.innerHeight
    ctx = particlesCanvas.value.getContext('2d')
    createParticles()
    drawParticles()
  }

  // 水平流动动画
  gsap.to('.flow-left-219 .marquee-219', {
    x: '-50%',
    duration: 12,
    repeat: -1,
    ease: 'none'
  })

  gsap.to('.flow-right-219 .marquee-219', {
    x: '-50%',
    duration: 15,
    repeat: -1,
    ease: 'none'
  })

  gsap.to('.flow-left-large-219 .marquee-219', {
    x: '-50%',
    duration: 20,
    repeat: -1,
    ease: 'none'
  })

  gsap.to('.flow-right-large-219 .marquee-219', {
    x: '-50%',
    duration: 25,
    repeat: -1,
    ease: 'none'
  })

  // 垂直流动动画
  gsap.to('.flow-up-219 .marquee-vertical-219', {
    y: '-50%',
    duration: 18,
    repeat: -1,
    ease: 'none'
  })

  gsap.to('.flow-down-219 .marquee-vertical-219', {
    y: '-50%',
    duration: 22,
    repeat: -1,
    ease: 'none'
  })

  // 斜向流动动画
  gsap.to('.diagonal-left-219 .marquee-diagonal-219', {
    x: '-50%',
    duration: 16,
    repeat: -1,
    ease: 'none'
  })

  gsap.to('.diagonal-right-219 .marquee-diagonal-219', {
    x: '-50%',
    duration: 18,
    repeat: -1,
    ease: 'none'
  })

  // 入场动画
  const flowRows = document.querySelectorAll('.flow-row-219, .flow-column-219, .flow-diagonal-219')
  
  flowRows.forEach((row, index) => {
    gsap.fromTo(
      row,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: row,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // 标题入场
  gsap.fromTo(
    '.title-wrapper-219',
    {
      y: -50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: '.text-flow-section-219',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 速度控制入场
  gsap.fromTo(
    '.speed-control-219',
    {
      y: 30,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.speed-control-219',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    }
  )
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('.marquee-219')
  gsap.killTweensOf('.marquee-vertical-219')
  gsap.killTweensOf('.marquee-diagonal-219')
})
</script>

<style scoped>
.text-flow-section-219 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 80px 20px;
  overflow: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.title-wrapper-219 {
  text-align: center;
  margin-bottom: 60px;
}

.section-title-219 {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.title-text-219 {
  display: block;
}

.title-subtitle-219 {
  font-size: 1.5rem;
  font-weight: 300;
  color: #00d2ff;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.description-219 {
  font-size: 1.2rem;
  color: #fff;
  opacity: 0.7;
  margin-top: 20px;
}

.flow-container-219 {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 60px;
}

.flow-row-219 {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px 0;
  position: relative;
}

.flow-row-219::before,
.flow-row-219::after {
  content: '';
  position: absolute;
  top: 0;
  width: 100px;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.flow-row-219::before {
  left: 0;
  background: linear-gradient(to right, rgba(26, 26, 46, 1), transparent);
}

.flow-row-219::after {
  right: 0;
  background: linear-gradient(to left, rgba(26, 26, 46, 1), transparent);
}

.marquee-219 {
  display: flex;
  white-space: nowrap;
  will-change: transform;
}

.flow-text-219 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  padding: 0 60px;
  display: inline-block;
  text-shadow: 0 0 20px rgba(0, 210, 255, 0.5);
}

.flow-text-large-219 {
  font-size: 4rem;
  font-weight: 800;
  color: #00d2ff;
  padding: 0 80px;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 30px rgba(0, 210, 255, 0.7);
}

.flow-vertical-container-219 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 30px;
}

.flow-column-219 {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  height: 300px;
  position: relative;
}

.marquee-vertical-219 {
  display: flex;
  flex-direction: column;
  will-change: transform;
}

.flow-text-vertical-219 {
  font-size: 2rem;
  font-weight: 700;
  color: #3a7bd5;
  padding: 15px 0;
  text-align: center;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.flow-diagonal-container-219 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 30px;
}

.flow-diagonal-219 {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px 0;
  position: relative;
  transform: skewX(-10deg);
}

.marquee-diagonal-219 {
  display: flex;
  white-space: nowrap;
  will-change: transform;
}

.flow-text-diagonal-219 {
  font-size: 2rem;
  font-weight: 700;
  color: #00d2ff;
  padding: 0 50px;
  display: inline-block;
  transform: skewX(10deg);
}

.speed-control-219 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.control-title-219 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.control-buttons-219 {
  display: flex;
  gap: 15px;
}

.speed-btn-219 {
  padding: 12px 30px;
  background: rgba(0, 210, 255, 0.1);
  border: 1px solid rgba(0, 210, 255, 0.3);
  border-radius: 25px;
  color: #00d2ff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.speed-btn-219:hover {
  background: rgba(0, 210, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 210, 255, 0.3);
}

.speed-btn-219.active-219 {
  background: rgba(0, 210, 255, 0.3);
  border-color: #00d2ff;
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.5);
}

.flow-particles-219 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

@media (max-width: 768px) {
  .section-title-219 {
    font-size: 2rem;
  }

  .title-subtitle-219 {
    font-size: 1rem;
  }

  .flow-text-219 {
    font-size: 1.5rem;
  }

  .flow-text-large-219 {
    font-size: 2.5rem;
  }

  .flow-vertical-container-219,
  .flow-diagonal-container-219 {
    grid-template-columns: 1fr;
  }

  .flow-column-219 {
    height: 250px;
  }

  .flow-text-vertical-219 {
    font-size: 1.5rem;
  }

  .flow-text-diagonal-219 {
    font-size: 1.5rem;
  }

  .speed-control-219 {
    flex-direction: column;
  }
}
</style>
