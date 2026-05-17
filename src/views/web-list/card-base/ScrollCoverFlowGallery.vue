<template>
  <div class="scroll-cover-flow-gallery-275">
    <div class="cover-flow-container-275" ref="containerRef">
      <!-- 标题和控制面板 -->
      <div class="gallery-header-275">
        <h2 class="gallery-title-275">3D封面流相册</h2>
        <div class="controls-275">
          <div class="control-group-275">
            <label>间距:</label>
            <input 
              type="range" 
              v-model="spacing" 
              min="100" 
              max="400" 
              step="20"
              @input="updateGallery"
            >
            <span>{{ spacing }}px</span>
          </div>
          <div class="control-group-275">
            <label>倾斜:</label>
            <input 
              type="range" 
              v-model="tilt" 
              min="20" 
              max="60" 
              step="5"
              @input="updateGallery"
            >
            <span>{{ tilt }}°</span>
          </div>
          <div class="control-group-275">
            <label>速度:</label>
            <input 
              type="range" 
              v-model="speed" 
              min="0.5" 
              max="3" 
              step="0.1"
            >
            <span>{{ speed }}x</span>
          </div>
        </div>
      </div>

      <!-- 封面流相册 -->
      <div class="cover-flow-stage-275">
        <div class="cover-flow-wrapper-275" ref="flowRef">
          <div 
            v-for="(image, index) in images" 
            :key="index"
            :ref="el => setCardRef(el, index)"
            :class="['cover-card-275', `card-${index}-275`]"
            :data-index="index"
            @click="selectCard(index)"
          >
            <div class="card-inner-275">
              <img :src="image.src" :alt="image.alt" class="card-image-275">
              <div class="card-reflection-275">
                <img :src="image.src" :alt="image.alt" class="reflection-image-275">
              </div>
              <div class="card-info-275">
                <h3>{{ image.alt }}</h3>
                <p>{{ image.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="nav-buttons-275">
        <button class="nav-btn-275 prev-btn-275" @click="prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="nav-btn-275 next-btn-275" @click="next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 指示点 -->
      <div class="indicators-275">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          :class="['indicator-275', { active: currentIndex === index }]"
          @click="selectCard(index)"
        ></div>
      </div>

      <!-- 实时状态 -->
      <div class="status-display-275">
        <div class="status-item-275">
          <span class="status-label-275">图片数:</span>
          <span class="status-value-275">{{ images.length }}</span>
        </div>
        <div class="status-item-275">
          <span class="status-label-275">当前:</span>
          <span class="status-value-275">{{ currentIndex + 1 }}</span>
        </div>
        <div class="status-item-275">
          <span class="status-label-275">滚动:</span>
          <span class="status-value-275">{{ Math.round(scrollProgress * 100) }}%</span>
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

interface Image {
  src: string
  alt: string
  desc: string
}

const images: Image[] = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=300&h=400&fit=crop',
    alt: '日出山脉',
    desc: '壮丽的日出景象'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=300&h=400&fit=crop',
    alt: '森林湖泊',
    desc: '宁静的湖泊'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=300&h=400&fit=crop',
    alt: '星空银河',
    desc: '璀璨的星空'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=300&h=400&fit=crop',
    alt: '日落海滩',
    desc: '金色海滩'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=300&h=400&fit=crop',
    alt: '雪景山川',
    desc: '冬日美景'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=300&h=400&fit=crop',
    alt: '瀑布溪流',
    desc: '流动的溪水'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695798522-6e208131916d?w=300&h=400&fit=crop',
    alt: '城市夜景',
    desc: '繁华都市'
  }
]

const containerRef = ref<HTMLElement | null>(null)
const flowRef = ref<HTMLElement | null>(null)
const spacing = ref(180)
const tilt = ref(45)
const speed = ref(1)
const currentIndex = ref(0)
const scrollProgress = ref(0)
const cardRefs = ref<(HTMLElement | null)[]>([])

const setCardRef = (el: HTMLElement | null, index: number) => {
  cardRefs.value[index] = el
}

const updateGallery = () => {
  cardRefs.value.forEach((card, index) => {
    if (!card) return
    
    const offset = index - currentIndex.value
    const absOffset = Math.abs(offset)
    
    if (absOffset === 0) {
      // 当前卡片
      gsap.to(card, {
        x: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        duration: 0.5 * speed.value
      })
    } else if (absOffset <= 2) {
      // 两侧卡片
      const direction = offset > 0 ? 1 : -1
      gsap.to(card, {
        x: direction * spacing.value * absOffset,
        z: -100 * absOffset,
        rotateY: -direction * tilt.value * absOffset,
        scale: 1 - 0.1 * absOffset,
        opacity: 1 - 0.2 * absOffset,
        duration: 0.5 * speed.value
      })
    } else {
      // 远端卡片
      const direction = offset > 0 ? 1 : -1
      gsap.to(card, {
        x: direction * spacing.value * 2.5,
        z: -200,
        rotateY: -direction * tilt.value * 2.5,
        scale: 0.7,
        opacity: 0.3,
        duration: 0.5 * speed.value
      })
    }
  })
}

const selectCard = (index: number) => {
  currentIndex.value = index
  updateGallery()
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    updateGallery()
  }
}

const next = () => {
  if (currentIndex.value < images.length - 1) {
    currentIndex.value++
    updateGallery()
  }
}

let autoPlayInterval: ReturnType<typeof setInterval> | null = null

const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    next()
  }, 3000 / speed.value)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始动画
    gsap.from('.cover-card-275', {
      y: 100,
      opacity: 0,
      rotationX: -90,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out'
    })

    // 初始化画廊
    updateGallery()

    // 滚动控制
    ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.value = self.progress
        
        // 滚动时自动切换卡片
        const totalCards = images.length
        const newIndex = Math.floor(self.progress * totalCards)
        if (newIndex !== currentIndex.value && newIndex < totalCards) {
          currentIndex.value = newIndex
          updateGallery()
        }
      }
    })

    // 启动自动播放
    startAutoPlay()

    // 鼠标悬停暂停
    const flowWrapper = flowRef.value
    if (flowWrapper) {
      flowWrapper.addEventListener('mouseenter', stopAutoPlay)
      flowWrapper.addEventListener('mouseleave', startAutoPlay)
    }
  }, containerRef.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
  stopAutoPlay()
  
  ScrollTrigger.getAll().forEach(trigger => {
    trigger.kill()
  })
})
</script>

<style scoped>
.scroll-cover-flow-gallery-275 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
}

.gallery-header-275 {
  text-align: center;
  margin-bottom: 40px;
}

.gallery-title-275 {
  font-size: 2.5em;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(100, 200, 255, 0.5);
}

.controls-275 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.control-group-275 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.control-group-275 label {
  font-size: 0.9em;
  color: #aaa;
}

.control-group-275 input[type="range"] {
  width: 100px;
  accent-color: #64c8ff;
}

.cover-flow-stage-275 {
  perspective: 1500px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cover-flow-wrapper-275 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 500px;
  transform-style: preserve-3d;
}

.cover-card-275 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.cover-card-275:hover {
  z-index: 100;
}

.card-inner-275 {
  position: relative;
  width: 250px;
  height: 350px;
  transform-style: preserve-3d;
}

.card-image-275 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.card-reflection-275 {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 100px;
  overflow: hidden;
  opacity: 0.3;
}

.reflection-image-275 {
  width: 100%;
  transform: scaleY(-1);
  filter: blur(2px);
}

.card-info-275 {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s;
  width: 100%;
}

.cover-card-275:hover .card-info-275 {
  opacity: 1;
}

.card-info-275 h3 {
  margin: 0;
  font-size: 1.1em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.card-info-275 p {
  margin: 5px 0 0;
  font-size: 0.9em;
  color: #aaa;
}

.nav-buttons-275 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.nav-btn-275 {
  width: 50px;
  height: 50px;
  border: 2px solid #64c8ff;
  background: rgba(100, 200, 255, 0.1);
  color: #64c8ff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.nav-btn-275:hover {
  background: rgba(100, 200, 255, 0.3);
  transform: scale(1.1);
}

.indicators-275 {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.indicator-275 {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator-275.active {
  background: #64c8ff;
  transform: scale(1.3);
}

.status-display-275 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  padding: 15px 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.status-item-275 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label-275 {
  color: #aaa;
  font-size: 0.9em;
}

.status-value-275 {
  color: #64c8ff;
  font-weight: bold;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .gallery-title-275 {
    font-size: 1.8em;
  }
  
  .controls-275 {
    flex-direction: column;
    align-items: center;
  }
  
  .card-inner-275 {
    width: 180px;
    height: 250px;
  }
  
  .cover-flow-stage-275 {
    height: 450px;
  }
}
</style>
