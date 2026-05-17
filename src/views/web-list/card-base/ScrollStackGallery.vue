<template>
  <div class="scroll-stack-gallery-276">
    <div class="stack-gallery-container-276" ref="containerRef">
      <!-- 标题和控制面板 -->
      <div class="gallery-header-276">
        <h2 class="gallery-title-276">3D堆叠相册</h2>
        <div class="controls-276">
          <div class="control-group-276">
            <label>深度:</label>
            <input 
              type="range" 
              v-model="depth" 
              min="20" 
              max="80" 
              step="5"
              @input="updateStack"
            >
            <span>{{ depth }}px</span>
          </div>
          <div class="control-group-276">
            <label>旋转:</label>
            <input 
              type="range" 
              v-model="rotation" 
              min="0" 
              max="15" 
              step="1"
              @input="updateStack"
            >
            <span>{{ rotation }}°</span>
          </div>
          <div class="control-group-276">
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

      <!-- 堆叠相册 -->
      <div class="stack-stage-276">
        <div class="stack-wrapper-276" ref="stackRef">
          <div 
            v-for="(image, index) in images" 
            :key="index"
            :ref="el => setCardRef(el, index)"
            :class="['stack-card-276', `card-${index}-276`]"
            :data-index="index"
            @click="moveToTop(index)"
          >
            <div class="card-inner-276">
              <img :src="image.src" :alt="image.alt" class="card-image-276">
              <div class="card-shadow-276"></div>
              <div class="card-overlay-276">
                <h3>{{ image.alt }}</h3>
                <p>{{ image.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="nav-buttons-276">
        <button class="nav-btn-276" @click="shuffle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          随机打乱
        </button>
        <button class="nav-btn-276" @click="spread">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 8V4h4M4 16v4h4M16 4h4v4M16 20h4v-4M8 8l8 8M8 16l8-8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          展开堆叠
        </button>
        <button class="nav-btn-276" @click="reset">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 3v5h5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          重置
        </button>
      </div>

      <!-- 实时状态 -->
      <div class="status-display-276">
        <div class="status-item-276">
          <span class="status-label-276">图片数:</span>
          <span class="status-value-276">{{ images.length }}</span>
        </div>
        <div class="status-item-276">
          <span class="status-label-276">顶层:</span>
          <span class="status-value-276">{{ topIndex + 1 }}</span>
        </div>
        <div class="status-item-276">
          <span class="status-label-276">滚动:</span>
          <span class="status-value-276">{{ Math.round(scrollProgress * 100) }}%</span>
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
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=280&h=380&fit=crop',
    alt: '山谷晨雾',
    desc: '神秘的山谷'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=280&h=380&fit=crop',
    alt: '湖畔日落',
    desc: '宁静的湖畔'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=280&h=380&fit=crop',
    alt: '星空山峰',
    desc: '壮观的星空'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=280&h=380&fit=crop',
    alt: '森林小径',
    desc: '幽深的森林'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=280&h=380&fit=crop',
    alt: '雪山之巅',
    desc: '宏伟的雪山'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=280&h=380&fit=crop',
    alt: '河流峡谷',
    desc: '奔腾的河流'
  }
]

const containerRef = ref<HTMLElement | null>(null)
const stackRef = ref<HTMLElement | null>(null)
const depth = ref(40)
const rotation = ref(5)
const speed = ref(1)
const topIndex = ref(0)
const scrollProgress = ref(0)
const cardRefs = ref<(HTMLElement | null)[]>([])

const setCardRef = (el: HTMLElement | null, index: number) => {
  cardRefs.value[index] = el
}

const updateStack = () => {
  cardRefs.value.forEach((card, index) => {
    if (!card) return
    
    const offset = (images.length - 1 - index) * depth.value
    const rotOffset = (images.length - 1 - index) * rotation.value
    
    gsap.to(card, {
      x: -offset * 0.3,
      y: -offset * 0.5,
      z: -offset,
      rotateX: rotOffset,
      rotateY: rotOffset * 0.5,
      rotateZ: -rotOffset * 0.2,
      scale: 1 - offset * 0.001,
      duration: 0.6 * speed.value,
      ease: 'power2.out'
    })
    
    // 更新z-index
    gsap.set(card, {
      zIndex: index
    })
  })
}

const moveToTop = (index: number) => {
  // 将选中的卡片移到顶部
  const temp = images[index]
  images.splice(index, 1)
  images.unshift(temp)
  topIndex.value = 0
  updateStack()
}

const shuffle = () => {
  // Fisher-Yates洗牌算法
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[images[i], images[j]] = [images[j], images[i]]
  }
  topIndex.value = 0
  updateStack()
}

const spread = () => {
  // 展开堆叠效果
  cardRefs.value.forEach((card, index) => {
    if (!card) return
    
    const angle = (index / (images.length - 1)) * 30 - 15
    const radius = 300
    
    gsap.to(card, {
      x: Math.sin(angle * Math.PI / 180) * radius,
      y: Math.cos(angle * Math.PI / 180) * radius,
      z: -index * 10,
      rotateZ: angle,
      scale: 0.9,
      duration: 0.8 * speed.value,
      ease: 'back.out(1.7)'
    })
  })
}

const reset = () => {
  updateStack()
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始动画
    gsap.from('.stack-card-276', {
      y: 200,
      opacity: 0,
      scale: 0.8,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out'
    })

    // 初始化堆叠
    updateStack()

    // 滚动控制
    ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.value = self.progress
        
        // 滚动时自动改变深度和旋转
        const depthValue = 20 + self.progress * 60
        const rotValue = 0 + self.progress * 15
        depth.value = Math.round(depthValue)
        rotation.value = Math.round(rotValue)
        updateStack()
      }
    })

    // 鼠标移动视差
    const container = containerRef.value
    if (container) {
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        
        gsap.to('.stack-card-276', {
          rotateX: y * 5,
          rotateY: -x * 5,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
      
      container.addEventListener('mouseleave', () => {
        updateStack()
      })
    }
  }, containerRef.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
  
  ScrollTrigger.getAll().forEach(trigger => {
    trigger.kill()
  })
})
</script>

<style scoped>
.scroll-stack-gallery-276 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%);
  position: relative;
  overflow: hidden;
}

.gallery-header-276 {
  text-align: center;
  margin-bottom: 40px;
}

.gallery-title-276 {
  font-size: 2.5em;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(100, 200, 255, 0.5);
}

.controls-276 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.control-group-276 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.control-group-276 label {
  font-size: 0.9em;
  color: #aaa;
}

.control-group-276 input[type="range"] {
  width: 100px;
  accent-color: #64c8ff;
}

.stack-stage-276 {
  perspective: 2000px;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.stack-wrapper-276 {
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 600px;
  transform-style: preserve-3d;
}

.stack-card-276 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  cursor: pointer;
  transition: transform 0.3s;
}

.stack-card-276:hover {
  transform: scale(1.05) !important;
}

.card-inner-276 {
  position: relative;
  width: 260px;
  height: 360px;
  transform-style: preserve-3d;
}

.card-image-276 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

.card-shadow-276 {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: -10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  z-index: -1;
  filter: blur(10px);
}

.card-overlay-276 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s;
}

.stack-card-276:hover .card-overlay-276 {
  opacity: 1;
}

.card-overlay-276 h3 {
  margin: 0;
  font-size: 1.1em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.card-overlay-276 p {
  margin: 5px 0 0;
  font-size: 0.9em;
  color: #aaa;
}

.nav-buttons-276 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.nav-btn-276 {
  padding: 12px 24px;
  border: 2px solid #64c8ff;
  background: rgba(100, 200, 255, 0.1);
  color: #64c8ff;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  font-size: 0.95em;
}

.nav-btn-276:hover {
  background: rgba(100, 200, 255, 0.3);
  transform: translateY(-2px);
}

.status-display-276 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  padding: 15px 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.status-item-276 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label-276 {
  color: #aaa;
  font-size: 0.9em;
}

.status-value-276 {
  color: #64c8ff;
  font-weight: bold;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .gallery-title-276 {
    font-size: 1.8em;
  }
  
  .controls-276 {
    flex-direction: column;
    align-items: center;
  }
  
  .card-inner-276 {
    width: 200px;
    height: 280px;
  }
  
  .stack-stage-276 {
    height: 550px;
  }
}
</style>
