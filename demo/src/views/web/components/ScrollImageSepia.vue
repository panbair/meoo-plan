<template>
  <section class="image-sepia-section-217">
    <div class="container">
      <div class="title-wrapper-217">
        <h2 class="section-title-217">
          <span class="title-text-217">复古滤镜过渡</span>
          <span class="title-subtitle-217">Sepia Filter Transition</span>
        </h2>
        <p class="description-217">
          从复古到现代的平滑过渡，展现时光的变迁
        </p>
      </div>

      <div class="sepia-images-217">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="sepia-image-wrapper-217"
          :class="`sepia-card-217-${index}`"
        >
          <div class="sepia-image-container-217" :class="`sepia-image-217-${index}`">
            <img 
              :src="image.src" 
              :alt="image.title"
              class="sepia-img-217"
            />
            <div class="sepia-overlay-217" :class="`sepia-overlay-217-${index}`"></div>
          </div>
          <div class="sepia-info-217" :class="`sepia-info-217-${index}`">
            <h3 class="sepia-title-217">{{ image.title }}</h3>
            <p class="sepia-description-217">{{ image.description }}</p>
            <div class="sepia-badge-217" :class="`sepia-badge-217-${index}`">
              <span class="badge-era-217">复古</span>
              <span class="badge-arrow-217">→</span>
              <span class="badge-modern-217">现代</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 滤镜强度指示器 -->
      <div class="sepia-indicator-217" ref="indicator">
        <div class="indicator-bar-217">
          <div class="indicator-fill-217" ref="indicatorFill"></div>
        </div>
        <div class="indicator-labels-217">
          <span class="label-sepia-217">Sepia 100%</span>
          <span class="label-current-217" ref="labelCurrent">0%</span>
          <span class="label-color-217">Color 0%</span>
        </div>
      </div>

      <!-- 粒子背景 -->
      <canvas class="sepia-particles-217" ref="particlesCanvas"></canvas>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const particlesCanvas = ref(null)
const indicator = ref(null)
const indicatorFill = ref(null)
const labelCurrent = ref(null)
let ctx = null
let particles = []
let animationFrame = null

const images = [
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
    title: '山川岁月',
    description: '从黑白记忆到多彩现实'
  },
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
    title: '湖光山色',
    description: '时光流转中的自然之美'
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop',
    title: '迷雾森林',
    description: '探索古老与现代的交织'
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    title: '绿意盎然',
    description: '色彩苏醒的瞬间'
  }
]

// 创建粒子
function createParticles() {
  particles = []
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    })
  }
}

// 绘制粒子
function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  
  particles.forEach(particle => {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 215, 0, ${particle.opacity})`
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

  // 图片淡入动画
  images.forEach((_, index) => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: `.sepia-image-217-${index}`,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    // 图片从模糊到清晰，从复古到彩色
    timeline
      .fromTo(
        `.sepia-image-217-${index} .sepia-img-217`,
        {
          filter: 'sepia(100%) blur(10px) brightness(0.8)',
          scale: 0.9
        },
        {
          filter: 'sepia(0%) blur(0px) brightness(1)',
          scale: 1,
          duration: 1.5,
          ease: 'power2.out'
        }
      )
      .fromTo(
        `.sepia-info-217-${index}`,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        },
        '-=1'
      )
      .fromTo(
        `.sepia-badge-217-${index}`,
        {
          scaleX: 0,
          opacity: 0
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        },
        '-=0.4'
      )
  })

  // 指示器动画
  gsap.to(indicatorFill.value, {
    width: '100%',
    scrollTrigger: {
      trigger: indicator.value,
      start: 'top 90%',
      end: 'bottom 10%',
      scrub: true
    }
  })

  // 更新当前百分比
  ScrollTrigger.create({
    trigger: indicator.value,
    start: 'top 90%',
    end: 'bottom 10%',
    onUpdate: (self) => {
      if (labelCurrent.value) {
        labelCurrent.value.textContent = `${Math.round(self.progress * 100)}%`
      }
    }
  })

  // 卡片交错过场
  gsap.utils.toArray('.sepia-card-217').forEach((card, i) => {
    gsap.fromTo(
      card,
      {
        x: i % 2 === 0 ? -100 : 100,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.2,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
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
/* GSAP opacity fix: ensure content is always visible */

.image-sepia-section-217 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 80px 20px;
  overflow: hidden;

  opacity: 1 !important;}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.title-wrapper-217 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.section-title-217 {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;

  opacity: 1 !important;}

.title-text-217 {
  display: block;
}

.title-subtitle-217 {
  font-size: 1.5rem;
  font-weight: 300;
  color: #f5af19;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.description-217 {
  font-size: 1.2rem;
  color: #fff;
  opacity: 0.7;
  margin-top: 20px;
}

.sepia-images-217 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.sepia-image-wrapper-217 {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.sepia-image-wrapper-217:hover {
  transform: translateY(-10px);
}

.sepia-image-container-217 {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;

  opacity: 1 !important;}

.sepia-img-217 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.sepia-image-wrapper-217:hover .sepia-img-217 {
  transform: scale(1.05);
}

.sepia-overlay-217 {
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

.sepia-image-wrapper-217:hover .sepia-overlay-217 {
  opacity: 0.6;
}

.sepia-info-217 {
  padding: 30px;
  position: relative;
  z-index: 2;

  opacity: 1 !important;}

.sepia-title-217 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;

  opacity: 1 !important;}

.sepia-description-217 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;

  opacity: 1 !important;}

.sepia-badge-217 {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 24px;
  background: rgba(245, 175, 25, 0.1);
  border: 1px solid rgba(245, 175, 25, 0.3);
  border-radius: 50px;
  width: fit-content;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.sepia-image-wrapper-217:hover .sepia-badge-217 {
  background: rgba(245, 175, 25, 0.2);
  box-shadow: 0 0 30px rgba(245, 175, 25, 0.3);

  opacity: 1 !important;}

.badge-era-217 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f5af19;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.badge-arrow-217 {
  font-size: 1.5rem;
  color: #fff;
  opacity: 0.8;
}

.badge-modern-217 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.sepia-indicator-217 {
  margin-top: 60px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.indicator-bar-217 {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  opacity: 1 !important;}

.indicator-fill-217 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #f5af19 0%, #f12711 100%);
  border-radius: 4px;
  transition: width 0.3s ease;

  opacity: 1 !important;}

.indicator-labels-217 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.label-sepia-217 {
  color: #f5af19;

  opacity: 1 !important;}

.label-current-217 {
  color: #fff;
  font-size: 1.5rem;
  min-width: 60px;
  text-align: center;

  opacity: 1 !important;}

.label-color-217 {
  color: #f12711;

  opacity: 1 !important;}

.sepia-particles-217 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .section-title-217 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .title-subtitle-217 {
    font-size: 1rem;
  
  opacity: 1 !important;}

  .sepia-images-217 {
    grid-template-columns: 1fr;
  }

  .sepia-image-container-217 {
    height: 300px;
  
  opacity: 1 !important;}

  .sepia-title-217 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
}
</style>
