<template>
  <section ref="parallaxSection" class="ip-section-7 ip-parallax-section-7">
    <div class="ip-hero-content-7">
      <h2 class="ip-section-title-7">沉浸式视差体验</h2>
      <p class="ip-subtitle-7">探索深度的视觉艺术</p>
    </div>
    <div class="ip-parallax-container-7" ref="parallaxContainer">
      <!-- 背景层 -->
      <div class="ip-parallax-layer-7 ip-layer-bg-7" ref="parallaxBg">
        <div class="ip-bg-gradient-7"></div>
        <div class="ip-particles-7" ref="particles">
          <div v-for="i in 20" :key="i" class="ip-particle-7" :style="getParticleStyle(i)"></div>
        </div>
      </div>

      <!-- 中层 - 图片卡片 -->
      <div class="ip-parallax-layer-7 ip-layer-mid-7" ref="parallaxMid">
        <div class="ip-card-wrapper-7">
          <div
            v-for="(item, index) in parallaxItems"
            :key="index"
            class="ip-parallax-card-7"
            :style="{ '--delay': index * 0.1 + 's' }"
          >
            <div class="ip-card-image-7">
              <img :src="item.image" :alt="item.title" />
              <div class="ip-card-overlay-7"></div>
            </div>
            <div class="ip-card-content-7">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 前层 - 浮动元素 -->
      <div class="ip-parallax-layer-7 ip-layer-front-7" ref="parallaxFront">
        <div class="ip-floating-elements-7">
          <div class="ip-float-element-7 ip-icon-1">🌸</div>
          <div class="ip-float-element-7 ip-icon-2">✨</div>
          <div class="ip-float-element-7 ip-icon-3">🎨</div>
          <div class="ip-float-element-7 ip-icon-4">💫</div>
        </div>
        <div class="ip-center-text-7">
          <div class="ip-main-text-7">视差滚动</div>
          <div class="ip-sub-text-7">Depth Parallax Effect</div>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="ip-stats-container-7" ref="statsContainer">
      <div class="ip-stat-item-7" v-for="stat in stats" :key="stat.label">
        <div class="ip-stat-value-7">{{ stat.value }}</div>
        <div class="ip-stat-label-7">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const parallaxSection = ref<HTMLElement>()
const parallaxContainer = ref<HTMLElement>()
const parallaxBg = ref<HTMLElement>()
const parallaxMid = ref<HTMLElement>()
const parallaxFront = ref<HTMLElement>()
const particles = ref<HTMLElement>()
const statsContainer = ref<HTMLElement>()

const parallaxItems = [
  {
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '自然之美',
    desc: '感受大自然的魅力'
  },
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '城市光影',
    desc: '现代都市的节奏'
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '艺术灵感',
    desc: '创意无限的世界'
  }
]

const stats = [
  { value: '99%', label: '满意度' },
  { value: '50+', label: '场景' },
  { value: '4K', label: '画质' },
  { value: '60fps', label: '流畅' }
]

const getParticleStyle = (index: number) => {
  const size = Math.random() * 6 + 2
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * 3
  const duration = Math.random() * 3 + 2

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

onMounted(() => {
  setTimeout(() => {
    initAnimations()
  }, 100)
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('*')
})

const initAnimations = () => {
  if (!parallaxContainer.value || !parallaxSection.value) return

  // 背景层视差 - 慢速向上
  if (parallaxBg.value) {
    gsap.to(parallaxBg.value, {
      y: -200,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    })
  }

  // 中层视差 - 中速向上
  if (parallaxMid.value) {
    gsap.to(parallaxMid.value, {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    })
  }

  // 前层视差 - 快速向下
  if (parallaxFront.value) {
    gsap.to(parallaxFront.value, {
      y: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
  }

  // 浮动元素独立动画
  gsap.utils.toArray<HTMLElement>('.ip-float-element-7').forEach((el, i) => {
    gsap.to(el, {
      y: -30 - i * 10,
      rotation: 360,
      duration: 3 + i * 0.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
  })

  // 卡片入场动画
  gsap.fromTo('.ip-parallax-card-7',
    {
      y: 100,
      opacity: 0,
      scale: 0.8
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.ip-card-wrapper-7',
        start: 'top 80%'
      }
    }
  )

  // 数据统计数字动画
  if (statsContainer.value) {
    gsap.from('.ip-stat-item-7', {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: statsContainer.value,
        start: 'top 85%'
      }
    })
  }

  // 中心文字淡入
  gsap.fromTo('.ip-center-text-7',
    {
      scale: 0.8,
      opacity: 0
    },
    {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top 60%'
      }
    }
  )
}
</script>

<style scoped lang="scss">
.ip-section-7 {
  min-height: 100vh;
  padding: 80px 20px 100px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  overflow: hidden;

  opacity: 1 !important;}

.ip-hero-content-7 {
  text-align: center;
  margin-bottom: 40px;
  z-index: 10;

  opacity: 1 !important;}

.ip-section-title-7 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  letter-spacing: 2px;

  opacity: 1 !important;}

.ip-subtitle-7 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
  letter-spacing: 4px;

  opacity: 1 !important;}

.ip-parallax-container-7 {
  position: relative;
  width: 100%;
  max-width: 1400px;
  height: 700px;
  overflow: hidden;
  border-radius: 30px;
  box-shadow: 0 25px 80px rgba(102, 126, 234, 0.3);

  opacity: 1 !important;}

.ip-parallax-layer-7 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

// 背景层
.ip-layer-bg-7 {
  z-index: 1;

  .ip-bg-gradient-7 {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    opacity: 0.3;
  }

  .ip-particles-7 {
    position: absolute;
    width: 100%;
    height: 100%;
  
  opacity: 1 !important;}

  .ip-particle-7 {
    position: absolute;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: floatParticle infinite ease-in-out;
  
  opacity: 1 !important;}
}

@keyframes floatParticle {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.8;
  }
}

// 中层 - 图片卡片
.ip-layer-mid-7 {
  z-index: 2;
  padding: 40px;

  .ip-card-wrapper-7 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    width: 100%;
    max-width: 1000px;
  
  opacity: 1 !important;}

  .ip-parallax-card-7 {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    
  opacity: 1 !important;}
  }

  .ip-card-image-7 {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    
  opacity: 1 !important;}

    .ip-card-overlay-7 {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover img {
      transform: scale(1.1);
    }

    &:hover .ip-card-overlay-7 {
      opacity: 1;
    }
  }

  .ip-card-content-7 {
    padding: 20px;

    h3 {
      font-size: 1.3rem;
      font-weight: bold;
      color: #fff;
      margin-bottom: 8px;
    
  opacity: 1 !important;}

    p {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
    }
  }
}

// 前层 - 浮动元素
.ip-layer-front-7 {
  z-index: 3;
  pointer-events: none;

  .ip-floating-elements-7 {
    position: absolute;
    width: 100%;
    height: 100%;
  
  opacity: 1 !important;}

  .ip-float-element-7 {
    position: absolute;
    font-size: 2.5rem;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  
  opacity: 1 !important;}

  .ip-icon-1 {
    top: 10%;
    left: 10%;
  }

  .ip-icon-2 {
    top: 20%;
    right: 15%;
  }

  .ip-icon-3 {
    bottom: 25%;
    left: 15%;
  }

  .ip-icon-4 {
    bottom: 15%;
    right: 10%;
  }

  .ip-center-text-7 {
    text-align: center;
    z-index: 4;

    .ip-main-text-7 {
      font-size: 4rem;
      font-weight: 900;
      background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 30px rgba(102, 126, 234, 0.5);
      letter-spacing: 8px;
      margin-bottom: 10px;
    
  opacity: 1 !important;}

    .ip-sub-text-7 {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 300;
      letter-spacing: 6px;
      text-transform: uppercase;
    
  opacity: 1 !important;}
  }
}

// 数据统计
.ip-stats-container-7 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  width: 100%;
  max-width: 1000px;
  margin-top: 60px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.ip-stat-item-7 {
  text-align: center;

  .ip-stat-value-7 {
    font-size: 2.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea, #f093fb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  
  opacity: 1 !important;}

  .ip-stat-label-7 {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 2px;
    text-transform: uppercase;
  
  opacity: 1 !important;}
}

@media (max-width: 1024px) {
  .ip-layer-mid-7 .ip-card-wrapper-7 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .ip-section-title-7 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .ip-parallax-container-7 {
    height: 500px;
  
  opacity: 1 !important;}

  .ip-layer-mid-7 {
    padding: 20px;

    .ip-card-wrapper-7 {
      grid-template-columns: 1fr;
      gap: 20px;
    
  opacity: 1 !important;}
  }

  .ip-center-text-7 .ip-main-text-7 {
    font-size: 2.5rem;
    letter-spacing: 4px;
  
  opacity: 1 !important;}

  .ip-stats-container-7 {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 30px;
  
  opacity: 1 !important;}

  .ip-stat-value-7 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
