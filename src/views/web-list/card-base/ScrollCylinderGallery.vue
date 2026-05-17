<template>
  <div class="scroll-cylinder-gallery-278">
    <div class="cylinder-gallery-container-278" ref="containerRef">
      <!-- 标题和控制面板 -->
      <div class="gallery-header-278">
        <h2 class="gallery-title-278">3D圆柱相册</h2>
        <div class="controls-278">
          <div class="control-group-278">
            <label>半径:</label>
            <input 
              type="range" 
              v-model="radius" 
              min="200" 
              max="500" 
              step="20"
              @input="updateCylinder"
            >
            <span>{{ radius }}px</span>
          </div>
          <div class="control-group-278">
            <label>高度:</label>
            <input 
              type="range" 
              v-model="height" 
              min="300" 
              max="600" 
              step="20"
              @input="updateCylinder"
            >
            <span>{{ height }}px</span>
          </div>
          <div class="control-group-278">
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

      <!-- 圆柱相册 -->
      <div class="cylinder-stage-278">
        <div class="cylinder-wrapper-278" ref="cylinderRef">
          <div class="cylinder-3d-278" ref="cylinder3DRef">
            <div 
              v-for="(image, index) in images" 
              :key="index"
              :ref="el => setCardRef(el, index)"
              :class="['cylinder-face-278', `face-${index}-278`]"
              :data-index="index"
              @click="selectImage(index)"
            >
              <div class="face-inner-278">
                <img :src="image.src" :alt="image.alt" class="face-image-278">
                <div class="face-overlay-278">
                  <h3>{{ image.alt }}</h3>
                  <p>{{ image.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 顶部和底部盖 -->
      <div class="cylinder-top-278" ref="topRef"></div>
      <div class="cylinder-bottom-278" ref="bottomRef"></div>

      <!-- 导航控制 -->
      <div class="nav-controls-278">
        <div class="control-row-278">
          <button class="control-btn-278" @click="rotateLeft">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="speed-control-278">
            <button class="speed-btn-278" @click="toggleAutoPlay">
              {{ isAutoPlaying ? '⏸' : '▶' }}
            </button>
          </div>
          <button class="control-btn-278" @click="rotateRight">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 实时状态 -->
      <div class="status-display-278">
        <div class="status-item-278">
          <span class="status-label-278">图片数:</span>
          <span class="status-value-278">{{ images.length }}</span>
        </div>
        <div class="status-item-278">
          <span class="status-label-278">当前:</span>
          <span class="status-value-278">{{ activeIndex + 1 }}</span>
        </div>
        <div class="status-item-278">
          <span class="status-label-278">角度:</span>
          <span class="status-value-278">{{ Math.round(rotationY) }}°</span>
        </div>
        <div class="status-item-278">
          <span class="status-label-278">滚动:</span>
          <span class="status-value-278">{{ Math.round(scrollProgress * 100) }}%</span>
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
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=500&fit=crop',
    alt: '星空峡谷',
    desc: '银河横跨峡谷'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400&h=500&fit=crop',
    alt: '日落海洋',
    desc: '金色的日落'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=400&h=500&fit=crop',
    alt: '雪山日出',
    desc: '第一缕阳光'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=400&h=500&fit=crop',
    alt: '瀑布云海',
    desc: '云海翻涌'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=400&h=500&fit=crop',
    alt: '森林晨光',
    desc: '穿过树叶的光'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=400&h=500&fit=crop',
    alt: '城市灯火',
    desc: '不夜之城'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695798522-6e208131916d?w=400&h=500&fit=crop',
    alt: '星空湖泊',
    desc: '镜面反射'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=400&h=500&fit=crop',
    alt: '彩虹山川',
    desc: '七彩山峦'
  }
]

const containerRef = ref<HTMLElement | null>(null)
const cylinderRef = ref<HTMLElement | null>(null)
const cylinder3DRef = ref<HTMLElement | null>(null)
const topRef = ref<HTMLElement | null>(null)
const bottomRef = ref<HTMLElement | null>(null)

const radius = ref(350)
const height = ref(450)
const speed = ref(1)
const activeIndex = ref(0)
const rotationY = ref(0)
const scrollProgress = ref(0)
const isAutoPlaying = ref(false)
const cardRefs = ref<(HTMLElement | null)[]>([])

const setCardRef = (el: HTMLElement | null, index: number) => {
  cardRefs.value[index] = el
}

const updateCylinder = () => {
  const angleStep = 360 / images.length
  
  cardRefs.value.forEach((face, index) => {
    if (!face) return
    
    const angle = index * angleStep
    const radians = angle * Math.PI / 180
    const x = Math.sin(radians) * radius.value
    
    gsap.set(face, {
      transform: `rotateY(${angle}deg) translateZ(${radius.value}px)`,
      width: '200px',
      height: height.value + 'px'
    })
  })
  
  // 更新圆柱整体旋转
  if (cylinder3DRef.value) {
    gsap.set(cylinder3DRef.value, {
      rotateY: rotationY.value
    })
  }
}

const selectImage = (index: number) => {
  activeIndex.value = index
  
  // 旋转圆柱使选中的图片面向前方
  const angleStep = 360 / images.length
  const targetRotation = -index * angleStep
  
  gsap.to(containerRef.value, {
    scrollProgress: 1,
    duration: 0
  })
  
  rotationY.value = targetRotation
  gsap.to(cylinder3DRef.value, {
    rotateY: targetRotation,
    duration: 0.5 * speed.value,
    ease: 'power2.out'
  })
}

const rotateLeft = () => {
  const angleStep = 360 / images.length
  rotationY.value -= angleStep
  gsap.to(cylinder3DRef.value, {
    rotateY: rotationY.value,
    duration: 0.5 * speed.value,
    ease: 'power2.out'
  })
  updateActiveIndex()
}

const rotateRight = () => {
  const angleStep = 360 / images.length
  rotationY.value += angleStep
  gsap.to(cylinder3DRef.value, {
    rotateY: rotationY.value,
    duration: 0.5 * speed.value,
    ease: 'power2.out'
  })
  updateActiveIndex()
}

const updateActiveIndex = () => {
  const angleStep = 360 / images.length
  const normalizedRotation = ((rotationY.value % 360) + 360) % 360
  const index = Math.round(normalizedRotation / angleStep)
  activeIndex.value = index % images.length
}

let autoPlayInterval: ReturnType<typeof setInterval> | null = null

const toggleAutoPlay = () => {
  isAutoPlaying.value = !isAutoPlaying.value
  if (isAutoPlaying.value) {
    autoPlayInterval = setInterval(() => {
      rotateRight()
    }, 2000 / speed.value)
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
    gsap.from('.cylinder-face-278', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.05,
      ease: 'power2.out'
    })

    // 初始化圆柱
    updateCylinder()

    // 滚动控制
    ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.value = self.progress
        
        // 滚动时旋转圆柱
        const maxRotation = 360
        rotationY.value = self.progress * maxRotation
        gsap.set(cylinder3DRef.value, {
          rotateY: rotationY.value
        })
        updateActiveIndex()
        
        // 动态调整半径和高度
        radius.value = 200 + self.progress * 300
        height.value = 300 + self.progress * 300
        updateCylinder()
      }
    })

    // 鼠标拖拽旋转
    let isDragging = false
    let startX = 0
    let startRotation = 0
    
    const stage = cylinderRef.value
    if (stage) {
      stage.addEventListener('mousedown', (e) => {
        isDragging = true
        startX = e.clientX
        startRotation = rotationY.value
      })
      
      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return
        const deltaX = e.clientX - startX
        rotationY.value = startRotation + deltaX * 0.5
        gsap.set(cylinder3DRef.value, {
          rotateY: rotationY.value
        })
        updateActiveIndex()
      })
      
      window.addEventListener('mouseup', () => {
        isDragging = false
      })
    }

    // 键盘导航
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') rotateLeft()
      if (e.key === 'ArrowRight') rotateRight()
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
.scroll-cylinder-gallery-278 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%);
  position: relative;
  overflow: hidden;
}

.gallery-header-278 {
  text-align: center;
  margin-bottom: 40px;
}

.gallery-title-278 {
  font-size: 2.5em;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(100, 200, 255, 0.5);
}

.controls-278 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.control-group-278 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.control-group-278 label {
  font-size: 0.9em;
  color: #aaa;
}

.control-group-278 input[type="range"] {
  width: 100px;
  accent-color: #64c8ff;
}

.cylinder-stage-278 {
  perspective: 2000px;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cylinder-wrapper-278 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 600px;
  transform-style: preserve-3d;
}

.cylinder-3d-278 {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: translateX(-50%) left: 50%;
}

.cylinder-face-278 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.cylinder-face-278:hover {
  box-shadow: 0 0 30px rgba(100, 200, 255, 0.5);
}

.face-inner-278 {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.face-image-278 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.face-overlay-278 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s;
}

.cylinder-face-278:hover .face-overlay-278 {
  opacity: 1;
}

.face-overlay-278 h3 {
  margin: 0 0 5px;
  font-size: 1.1em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.face-overlay-278 p {
  margin: 0;
  font-size: 0.9em;
  color: #aaa;
}

.cylinder-top-278,
.cylinder-bottom-278 {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(100, 200, 255, 0.1));
  border: 2px solid rgba(100, 200, 255, 0.3);
  transform: rotateX(90deg) translateZ(-50px);
}

.cylinder-top-278 {
  top: 50px;
  left: 50%;
  transform: rotateX(90deg) translateZ(-50px);
}

.cylinder-bottom-278 {
  bottom: 50px;
  left: 50%;
  transform: rotateX(-90deg) translateZ(-50px);
}

.nav-controls-278 {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.control-row-278 {
  display: flex;
  align-items: center;
  gap: 20px;
}

.control-btn-278,
.speed-btn-278 {
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

.control-btn-278:hover,
.speed-btn-278:hover {
  background: rgba(100, 200, 255, 0.3);
  transform: scale(1.1);
}

.status-display-278 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  padding: 15px 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  flex-wrap: wrap;
}

.status-item-278 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label-278 {
  color: #aaa;
  font-size: 0.9em;
}

.status-value-278 {
  color: #64c8ff;
  font-weight: bold;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .gallery-title-278 {
    font-size: 1.8em;
  }
  
  .controls-278 {
    flex-direction: column;
    align-items: center;
  }
  
  .cylinder-stage-278 {
    height: 550px;
  }
  
  .status-display-278 {
    gap: 15px;
  }
}
</style>
