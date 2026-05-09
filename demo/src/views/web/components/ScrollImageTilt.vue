<template>
  <section class="image-tilt-section-218">
    <div class="container">
      <div class="title-wrapper-218">
        <h2 class="section-title-218">
          <span class="title-text-218">3D图片倾斜</span>
          <span class="title-subtitle-218">Image 3D Tilt</span>
        </h2>
        <p class="description-218">
          移动鼠标，感受3D空间中的图片跟随效果
        </p>
      </div>

      <div class="tilt-images-218">
        <div 
          v-for="(item, index) in tiltItems" 
          :key="index"
          class="tilt-wrapper-218"
          :class="`tilt-wrapper-218-${index}`"
          @mousemove="handleTilt($event, index)"
          @mouseleave="resetTilt(index)"
        >
          <div 
            class="tilt-card-218"
            :class="`tilt-card-218-${index}`"
            :style="{ 
              '--tiltX': tiltState[index].tiltX, 
              '--tiltY': tiltState[index].tiltY 
            }"
            ref="tiltCards"
          >
            <div class="tilt-image-218">
              <img 
                :src="item.image" 
                :alt="item.title"
                class="tilt-img-218"
              />
              <div class="tilt-overlay-218"></div>
            </div>
            <div class="tilt-content-218">
              <h3 class="tilt-title-218">{{ item.title }}</h3>
              <p class="tilt-text-218">{{ item.text }}</p>
              <div class="tilt-arrow-218">
                <span class="arrow-icon-218">↗</span>
              </div>
            </div>
            <div class="tilt-shine-218" :class="`tilt-shine-218-${index}`"></div>
          </div>
        </div>
      </div>

      <!-- 倾斜状态指示器 -->
      <div class="tilt-indicator-218">
        <div class="indicator-grid-218">
          <div class="indicator-axis-218">
            <span class="axis-label-218">X轴</span>
            <div class="axis-bar-218">
              <div class="axis-fill-218 axis-x-218" ref="axisXFill"></div>
              <div class="axis-marker-218 axis-x-marker-218" ref="axisXMarker"></div>
            </div>
          </div>
          <div class="indicator-axis-218">
            <span class="axis-label-218">Y轴</span>
            <div class="axis-bar-218">
              <div class="axis-fill-218 axis-y-218" ref="axisYFill"></div>
              <div class="axis-marker-218 axis-y-marker-218" ref="axisYMarker"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="tilt-hint-218" ref="hint">
        <div class="hint-icon-218">🖱️</div>
        <p class="hint-text-218">移动鼠标体验3D倾斜效果</p>
      </div>

      <!-- 背景粒子 -->
      <canvas class="tilt-particles-218" ref="particlesCanvas"></canvas>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const particlesCanvas = ref(null)
const tiltCards = ref([])
const axisXFill = ref(null)
const axisYFill = ref(null)
const axisXMarker = ref(null)
const axisYMarker = ref(null)
const hint = ref(null)
let ctx = null
let particles = []
let animationFrame = null

const tiltItems = [
  {
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop',
    title: '星空山峦',
    text: '在3D空间中探索自然的奥秘'
  },
  {
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=400&fit=crop',
    title: '森林秘境',
    text: '感受光影在三维空间中的流动'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    title: '海滨风光',
    text: '体验海浪起伏的立体感'
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    title: '城市夜景',
    text: '霓虹灯在空间中交织闪烁'
  }
]

const tiltState = ref(
  tiltItems.map(() => ({ tiltX: '0deg', tiltY: '0deg' }))
)

// 处理倾斜
function handleTilt(event, index) {
  const card = tiltCards.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  const tiltX = ((mouseY - centerY) / centerY) * -15
  const tiltY = ((mouseX - centerX) / centerX) * 15

  tiltState.value[index].tiltX = `${tiltX}deg`
  tiltState.value[index].tiltY = `${tiltY}deg`

  // 更新指示器
  if (index === 0) {
    updateIndicator(tiltX, tiltY)
  }
}

// 重置倾斜
function resetTilt(index) {
  gsap.to(tiltState.value[index], {
    duration: 0.5,
    tiltX: '0deg',
    tiltY: '0deg'
  })

  // 更新指示器
  if (index === 0) {
    updateIndicator(0, 0)
  }
}

// 更新指示器
function updateIndicator(tiltX, tiltY) {
  const maxX = 15
  const maxY = 15

  // 更新X轴指示器
  const xPercent = ((tiltX + maxX) / (maxX * 2)) * 100
  gsap.to(axisXMarker.value, {
    left: `${xPercent}%`,
    duration: 0.1
  })

  // 更新Y轴指示器
  const yPercent = ((tiltY + maxY) / (maxY * 2)) * 100
  gsap.to(axisYMarker.value, {
    left: `${yPercent}%`,
    duration: 0.1
  })
}

// 创建粒子
function createParticles() {
  particles = []
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.6 + 0.2
    })
  }
}

// 绘制粒子
function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  
  particles.forEach(particle => {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(100, 200, 255, ${particle.opacity})`
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

  // 卡片入场动画
  tiltItems.forEach((_, index) => {
    gsap.fromTo(
      `.tilt-wrapper-218-${index}`,
      {
        y: 100,
        opacity: 0,
        rotateX: 15
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: `.tilt-wrapper-218-${index}`,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // 指示器入场动画
  gsap.fromTo(
    axisXFill.value,
    { width: '0%' },
    {
      width: '50%',
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.tilt-indicator-218',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  gsap.fromTo(
    axisYFill.value,
    { width: '0%' },
    {
      width: '50%',
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.tilt-indicator-218',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 提示信息闪烁动画
  gsap.to(hint.value, {
    opacity: [1, 0.5, 1],
    duration: 2,
    repeat: -1,
    ease: 'power1.inOut'
  })
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
.image-tilt-section-218 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding: 80px 20px;
  overflow: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.title-wrapper-218 {
  text-align: center;
  margin-bottom: 60px;
}

.section-title-218 {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.title-text-218 {
  display: block;
}

.title-subtitle-218 {
  font-size: 1.5rem;
  font-weight: 300;
  color: #667eea;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.description-218 {
  font-size: 1.2rem;
  color: #fff;
  opacity: 0.7;
  margin-top: 20px;
}

.tilt-images-218 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.tilt-wrapper-218 { perspective: 1000px;
      opacity: 1;
    }

.tilt-card-218 {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transform: rotateX(var(--tiltX)) rotateY(var(--tiltY));
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  cursor: pointer;
}

.tilt-card-218:hover {
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.tilt-image-218 { position: relative;
  height: 350px;
  overflow: hidden;
      opacity: 1;
    }

.tilt-img-218 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tilt-card-218:hover .tilt-img-218 {
  transform: scale(1.1);
}

.tilt-overlay-218 {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.tilt-card-218:hover .tilt-overlay-218 {
  opacity: 0.6;
}

.tilt-content-218 { padding: 30px;
  transform: translateZ(30px);
      opacity: 1;
    }

.tilt-title-218 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.tilt-text-218 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.tilt-arrow-218 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  border: 1px solid rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.tilt-card-218:hover .tilt-arrow-218 {
  background: rgba(102, 126, 234, 0.4);
  transform: scale(1.2);
}

.arrow-icon-218 {
  font-size: 1.5rem;
  color: #667eea;
}

.tilt-shine-218 {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tilt-card-218:hover .tilt-shine-218 {
  opacity: 1;
}

.tilt-indicator-218 {
  margin-bottom: 40px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.indicator-grid-218 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.indicator-axis-218 {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.axis-label-218 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.axis-bar-218 {
  position: relative;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.axis-fill-218 { position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 50%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
      opacity: 1;
    }

.axis-x-218 {
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
}

.axis-y-218 {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

.axis-marker-218 {
  position: absolute;
  top: -4px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  transition: left 0.1s ease;
}

.tilt-hint-218 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  width: fit-content;
  margin: 0 auto;
}

.hint-icon-218 {
  font-size: 2rem;
}

.hint-text-218 {
  font-size: 1rem;
  color: #fff;
  opacity: 0.9;
}

.tilt-particles-218 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

@media (max-width: 768px) {
  .section-title-218 {
    font-size: 2rem;
  }

  .title-subtitle-218 {
    font-size: 1rem;
  }

  .tilt-images-218 {
    grid-template-columns: 1fr;
  }

  .tilt-image-218 { height: 280px;
      opacity: 1;
    }

  .tilt-title-218 {
    font-size: 1.5rem;
  }

  .indicator-grid-218 {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
