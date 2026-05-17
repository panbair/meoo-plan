<template>
  <div class="sisphere-273">
    <div class="sisphere-wrapper-273">
      <div class="sisphere-header-273">
        <h2 class="sisphere-title-273">🌐 球形轮播</h2>
        <div class="sisphere-controls-273">
          <button
            v-for="(type, index) in sphereTypes"
            :key="index"
            class="sisphere-type-btn-273"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="sisphere-sliders-273">
          <div class="sisphere-slider-group-273">
            <label>旋转速度: {{ rotationSpeed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="rotationSpeed"
              min="0.5"
              max="3"
              step="0.1"
              class="sisphere-slider-273"
            >
          </div>
          <div class="sisphere-slider-group-273">
            <label>半径: {{ radius.toFixed(0) }}px</label>
            <input
              type="range"
              v-model.number="radius"
              min="200"
              max="400"
              step="10"
              class="sisphere-slider-273"
            >
          </div>
        </div>
        <div class="sisphere-info-273">
          <span>类型: {{ sphereTypes[currentTypeIndex] }}</span>
          <span>图片数量: {{ images.length }}</span>
        </div>
      </div>

      <div class="sisphere-sphere-container-273">
        <div class="sisphere-sphere-273" ref="sphereRef">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="sisphere-item-273"
            :class="`sisphere-item-${index}-273`"
            :style="getSphereItemStyle(index)"
          >
            <img :src="image.src" :alt="image.alt" class="sisphere-item-image-273">
            <div class="sisphere-item-overlay-273"></div>
            <div class="sisphere-item-text-273">{{ index + 1 }}</div>
          </div>
        </div>
        <div class="sisphere-nav-btns-273">
          <button class="sisphere-nav-btn-273 sisphere-prev-273" @click="prevSlide">←</button>
          <button class="sisphere-nav-btn-273 sisphere-play-273" @click="togglePlay">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="sisphere-nav-btn-273 sisphere-next-273" @click="nextSlide">→</button>
        </div>
      </div>

      <div class="sisphere-preview-273">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="sisphere-preview-item-273"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        >
          <img :src="image.src" :alt="image.alt" class="sisphere-preview-image-273">
        </div>
      </div>

      <div class="sisphere-progress-273">
        <div class="sisphere-progress-bar-273" :style="{ width: `${progress}%` }"></div>
        <span class="sisphere-progress-text-273">{{ progress.toFixed(0) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const currentTypeIndex = ref(0)
const currentSlide = ref(0)
const rotationSpeed = ref(1.0)
const radius = ref(280)
const progress = ref(0)
const isPlaying = ref(true)
const sphereRef = ref(null)

const sphereTypes = ['水平旋转', '垂直旋转', '倾斜旋转', '螺旋旋转']

const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=200&h=200&fit=crop',
    alt: '图片1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=200&h=200&fit=crop',
    alt: '图片2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=200&h=200&fit=crop',
    alt: '图片3'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=200&h=200&fit=crop',
    alt: '图片4'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=200&h=200&fit=crop',
    alt: '图片5'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=200&h=200&fit=crop',
    alt: '图片6'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695798522-6e208131916d?w=200&h=200&fit=crop',
    alt: '图片7'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=200&h=200&fit=crop',
    alt: '图片8'
  }
]

let scrollTrigger = null
let autoPlayInterval = null
let sphereRotation = { x: 0, y: 0 }

const getSphereItemStyle = (index) => {
  const r = radius.value
  const phi = Math.acos(-1 + (2 * index + 1) / images.length)
  const theta = Math.sqrt(images.length * Math.PI) * phi

  const x = r * Math.sin(phi) * Math.cos(theta)
  const y = r * Math.sin(phi) * Math.sin(theta)
  const z = r * Math.cos(phi)

  return {
    transform: `translate3d(${x}px, ${y}px, ${z}px)`
  }
}

const updateSphere = () => {
  const sphere = sphereRef.value
  if (!sphere) return

  let targetRotateX = 0
  let targetRotateY = 0

  switch (currentTypeIndex.value) {
    case 0: // 水平旋转
      targetRotateY = currentSlide.value * -45
      targetRotateX = 0
      break
    case 1: // 垂直旋转
      targetRotateY = 0
      targetRotateX = currentSlide.value * -45
      break
    case 2: // 倾斜旋转
      targetRotateY = currentSlide.value * -45
      targetRotateX = currentSlide.value * -20
      break
    case 3: // 螺旋旋转
      targetRotateY = currentSlide.value * -45
      targetRotateX = currentSlide.value * -30
      break
  }

  gsap.to(sphereRotation, {
    x: targetRotateX,
    y: targetRotateY,
    duration: 1 / rotationSpeed.value,
    ease: 'power2.inOut',
    onUpdate: () => {
      gsap.set(sphere, {
        rotateX: sphereRotation.x,
        rotateY: sphereRotation.y
      })
    }
  })
}

const changeType = (index) => {
  currentTypeIndex.value = index
  updateSphere()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + images.length) % images.length
  updateSphere()
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.length
  updateSphere()
}

const goToSlide = (index) => {
  currentSlide.value = index
  updateSphere()
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

const startAutoPlay = () => {
  stopAutoPlay()
  autoPlayInterval = setInterval(() => {
    nextSlide()
  }, 3000 / rotationSpeed.value)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

const initAnimations = () => {
  const items = gsap.utils.toArray('.sisphere-item-273')

  items.forEach((item, index) => {
    gsap.fromTo(item,
      {
        opacity: 0,
        scale: 0
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: index * 0.05,
        ease: 'back.out(1.5)'
      }
    )

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: 1
      }
    })

    timeline
      .to(item, {
        boxShadow: '0 0 25px rgba(236, 72, 153, 0.5)',
        duration: 1,
        ease: 'power2.inOut'
      })
  })
}

onMounted(() => {
  updateSphere()
  initAnimations()
  startAutoPlay()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.sisphere-sphere-container-273',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
    onUpdate: (self) => {
      progress.value = self.progress * 100
    }
  })
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  stopAutoPlay()
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('sisphere-item-273')) {
      trigger.kill()
    }
  })
})

watch([rotationSpeed], () => {
  if (isPlaying.value) {
    startAutoPlay()
  }
})
</script>

<style scoped>
.sisphere-273 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1a2e 0%, #1a0a2e 50%, #0a0a1a 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.sisphere-273::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 60% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.sisphere-wrapper-273 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sisphere-header-273 {
  text-align: center;
  margin-bottom: 60px;
}

.sisphere-title-273 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #60a5fa, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
}

.sisphere-controls-273 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sisphere-type-btn-273 {
  padding: 12px 24px;
  background: rgba(59, 130, 246, 0.2);
  border: 2px solid rgba(59, 130, 246, 0.4);
  border-radius: 25px;
  color: #93c5fd;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sisphere-type-btn-273:hover {
  background: rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);
}

.sisphere-type-btn-273.active {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-color: #60a5fa;
  color: white;
  box-shadow: 0 5px 25px rgba(59, 130, 246, 0.6);
}

.sisphere-sliders-273 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sisphere-slider-group-273 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sisphere-slider-group-273 label {
  color: #93c5fd;
  font-size: 14px;
  font-weight: 600;
}

.sisphere-slider-273 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
  outline: none;
}

.sisphere-slider-273::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.5);
}

.sisphere-info-273 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.sisphere-info-273 span {
  color: #93c5fd;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.sisphere-sphere-container-273 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  perspective: 1200px;
}

.sisphere-sphere-273 {
  position: relative;
  width: 400px;
  height: 400px;
  transform-style: preserve-3d;
  transition: transform 1s ease;
}

.sisphere-item-273 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(59, 130, 246, 0.5);
  transform-style: preserve-3d;
  cursor: pointer;
}

.sisphere-item-image-273 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sisphere-item-overlay-273 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(236, 72, 153, 0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sisphere-item-273:hover .sisphere-item-overlay-273 {
  opacity: 1;
}

.sisphere-item-text-273 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.sisphere-nav-btns-273 {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.sisphere-nav-btn-273 {
  width: 50px;
  height: 50px;
  background: rgba(59, 130, 246, 0.3);
  border: 2px solid rgba(59, 130, 246, 0.5);
  border-radius: 50%;
  color: #93c5fd;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sisphere-nav-btn-273:hover {
  background: rgba(59, 130, 246, 0.6);
  transform: scale(1.1);
  box-shadow: 0 5px 20px rgba(59, 130, 246, 0.5);
}

.sisphere-preview-273 {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.sisphere-preview-item-273 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.sisphere-preview-item-273:hover {
  border-color: rgba(59, 130, 246, 0.6);
  transform: scale(1.1);
}

.sisphere-preview-item-273.active {
  border-color: #3b82f6;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
}

.sisphere-preview-image-273 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sisphere-progress-273 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  height: 8px;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.sisphere-progress-bar-273 {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa, #ec4899);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.sisphere-progress-text-273 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #93c5fd;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sisphere-title-273 {
    font-size: 32px;
  }

  .sisphere-sphere-273 {
    width: 300px;
    height: 300px;
  }

  .sisphere-item-273 {
    width: 60px;
    height: 60px;
  }

  .sisphere-sliders-273 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
