<template>
  <div class="scroll-accordion-gallery-277">
    <div class="accordion-gallery-container-277" ref="containerRef">
      <!-- 标题和控制面板 -->
      <div class="gallery-header-277">
        <h2 class="gallery-title-277">3D手风琴相册</h2>
        <div class="controls-277">
          <div class="control-group-277">
            <label>展开宽度:</label>
            <input 
              type="range" 
              v-model="expandedWidth" 
              min="400" 
              max="700" 
              step="20"
              @input="updateAccordion"
            >
            <span>{{ expandedWidth }}px</span>
          </div>
          <div class="control-group-277">
            <label>倾斜度:</label>
            <input 
              type="range" 
              v-model="tilt" 
              min="0" 
              max="30" 
              step="2"
              @input="updateAccordion"
            >
            <span>{{ tilt }}°</span>
          </div>
          <div class="control-group-277">
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

      <!-- 手风琴相册 -->
      <div class="accordion-stage-277">
        <div class="accordion-wrapper-277" ref="accordionRef">
          <div 
            v-for="(image, index) in images" 
            :key="index"
            :ref="el => setCardRef(el, index)"
            :class="['accordion-card-277', { expanded: activeIndex === index }]"
            :data-index="index"
            @click="toggleAccordion(index)"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave"
          >
            <div class="card-inner-277">
              <img :src="image.src" :alt="image.alt" class="card-image-277">
              <div class="card-content-277">
                <h3>{{ image.alt }}</h3>
                <p>{{ image.desc }}</p>
                <div class="card-meta-277">
                  <span>{{ image.location }}</span>
                  <span>{{ image.date }}</span>
                </div>
              </div>
              <div class="card-shine-277"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="nav-buttons-277">
        <button class="nav-btn-277 prev-btn-277" @click="prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="nav-btn-277" @click="toggleAutoPlay">
          {{ isAutoPlaying ? '暂停' : '自动播放' }}
        </button>
        <button class="nav-btn-277 next-btn-277" @click="next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 实时状态 -->
      <div class="status-display-277">
        <div class="status-item-277">
          <span class="status-label-277">图片数:</span>
          <span class="status-value-277">{{ images.length }}</span>
        </div>
        <div class="status-item-277">
          <span class="status-label-277">当前:</span>
          <span class="status-value-277">{{ activeIndex + 1 }}</span>
        </div>
        <div class="status-item-277">
          <span class="status-label-277">滚动:</span>
          <span class="status-value-277">{{ Math.round(scrollProgress * 100) }}%</span>
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
  location: string
  date: string
}

const images: Image[] = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&h=600&fit=crop',
    alt: '极光之境',
    desc: '绚丽的北极光在夜空中舞动，如同天空中最美丽的画卷',
    location: '冰岛',
    date: '2024.01'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=500&h=600&fit=crop',
    alt: '深海秘境',
    desc: '神秘的深海世界，充满了未知的生物和景观',
    location: '太平洋',
    date: '2024.02'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=500&h=600&fit=crop',
    alt: '星空之城',
    desc: '璀璨的星空下，城市灯火如梦如幻',
    location: '东京',
    date: '2024.03'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=500&h=600&fit=crop',
    alt: '樱花绽放',
    desc: '春天樱花盛开，粉色的花瓣如雨落下',
    location: '京都',
    date: '2024.04'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=500&h=600&fit=crop',
    alt: '雪山之巅',
    desc: '雄伟的雪山，云雾缭绕，宛如仙境',
    location: '阿尔卑斯',
    date: '2024.05'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=500&h=600&fit=crop',
    alt: '沙漠绿洲',
    desc: '茫茫沙漠中的一片绿洲，生命的奇迹',
    location: '撒哈拉',
    date: '2024.06'
  }
]

const containerRef = ref<HTMLElement | null>(null)
const accordionRef = ref<HTMLElement | null>(null)
const expandedWidth = ref(550)
const tilt = ref(15)
const speed = ref(1)
const activeIndex = ref(0)
const scrollProgress = ref(0)
const isAutoPlaying = ref(false)
const cardRefs = ref<(HTMLElement | null)[]>([])

const setCardRef = (el: HTMLElement | null, index: number) => {
  cardRefs.value[index] = el
}

const updateAccordion = () => {
  const totalWidth = 1000
  const collapsedWidth = (totalWidth - expandedWidth.value) / (images.length - 1)
  
  cardRefs.value.forEach((card, index) => {
    if (!card) return
    
    if (index === activeIndex.value) {
      // 展开的卡片
      gsap.to(card, {
        width: expandedWidth.value + 'px',
        rotateY: 0,
        scale: 1,
        zIndex: 10,
        duration: 0.5 * speed.value,
        ease: 'power2.out'
      })
    } else {
      // 收缩的卡片
      gsap.to(card, {
        width: collapsedWidth + 'px',
        rotateY: -tilt.value,
        scale: 0.95,
        zIndex: 5,
        duration: 0.5 * speed.value,
        ease: 'power2.out'
      })
    }
  })
}

const toggleAccordion = (index: number) => {
  if (activeIndex.value !== index) {
    activeIndex.value = index
    updateAccordion()
  }
}

const handleMouseEnter = (index: number) => {
  if (activeIndex.value !== index) {
    gsap.to(cardRefs.value[index], {
      scale: 0.98,
      duration: 0.3
    })
  }
}

const handleMouseLeave = () => {
  updateAccordion()
}

const prev = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
    updateAccordion()
  }
}

const next = () => {
  if (activeIndex.value < images.length - 1) {
    activeIndex.value++
    updateAccordion()
  }
}

let autoPlayInterval: ReturnType<typeof setInterval> | null = null

const toggleAutoPlay = () => {
  isAutoPlaying.value = !isAutoPlaying.value
  if (isAutoPlaying.value) {
    autoPlayInterval = setInterval(() => {
      if (activeIndex.value < images.length - 1) {
        activeIndex.value++
      } else {
        activeIndex.value = 0
      }
      updateAccordion()
    }, 3000 / speed.value)
  } else {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      autoPlayInterval = null
    }
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始动画
    gsap.from('.accordion-card-277', {
      x: -100,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out'
    })

    // 初始化手风琴
    updateAccordion()

    // 滚动控制
    ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.value = self.progress
        
        // 滚动时自动切换
        const totalCards = images.length
        const newIndex = Math.floor(self.progress * totalCards)
        if (newIndex !== activeIndex.value && newIndex < totalCards) {
          activeIndex.value = newIndex
          updateAccordion()
        }
      }
    })

    // 键盘导航
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    })
  }, containerRef.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
  
  ScrollTrigger.getAll().forEach(trigger => {
    trigger.kill()
  })
})
</script>

<style scoped>
.scroll-accordion-gallery-277 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
}

.gallery-header-277 {
  text-align: center;
  margin-bottom: 40px;
}

.gallery-title-277 {
  font-size: 2.5em;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(100, 200, 255, 0.5);
}

.controls-277 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.control-group-277 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.control-group-277 label {
  font-size: 0.9em;
  color: #aaa;
}

.control-group-277 input[type="range"] {
  width: 100px;
  accent-color: #64c8ff;
}

.accordion-stage-277 {
  perspective: 1500px;
  height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.accordion-wrapper-277 {
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 550px;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
}

.accordion-card-277 {
  height: 500px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: box-shadow 0.3s;
  overflow: hidden;
  border-radius: 12px;
}

.accordion-card-277:hover {
  z-index: 20;
}

.card-inner-277 {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.card-image-277 {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: transform 0.5s;
}

.card-content-277 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent);
  color: #fff;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s;
}

.accordion-card-277.expanded .card-content-277 {
  opacity: 1;
  transform: translateY(0);
}

.card-content-277 h3 {
  margin: 0 0 10px;
  font-size: 1.8em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.card-content-277 p {
  margin: 0 0 15px;
  font-size: 1em;
  line-height: 1.6;
  color: #ccc;
}

.card-meta-277 {
  display: flex;
  gap: 20px;
  font-size: 0.9em;
  color: #64c8ff;
}

.card-shine-277 {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: skewX(-20deg);
  transition: left 0.5s;
}

.accordion-card-277:hover .card-shine-277 {
  left: 150%;
}

.nav-buttons-277 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.nav-btn-277 {
  padding: 12px 30px;
  border: 2px solid #64c8ff;
  background: rgba(100, 200, 255, 0.1);
  color: #64c8ff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95em;
}

.nav-btn-277:hover {
  background: rgba(100, 200, 255, 0.3);
  transform: translateY(-2px);
}

.status-display-277 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  padding: 15px 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.status-item-277 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label-277 {
  color: #aaa;
  font-size: 0.9em;
}

.status-value-277 {
  color: #64c8ff;
  font-weight: bold;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .gallery-title-277 {
    font-size: 1.8em;
  }
  
  .controls-277 {
    flex-direction: column;
    align-items: center;
  }
  
  .accordion-wrapper-277 {
    max-width: 100%;
    overflow-x: auto;
  }
  
  .accordion-card-277 {
    height: 400px;
  }
  
  .card-content-277 {
    padding: 20px;
  }
  
  .card-content-277 h3 {
    font-size: 1.4em;
  }
}
</style>
