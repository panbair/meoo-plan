<template>
  <div class="sicube-272">
    <div class="sicube-wrapper-272">
      <div class="sicube-header-272">
        <h2 class="sicube-title-272">🎲 立方体轮播</h2>
        <div class="sicube-controls-272">
          <button
            v-for="(type, index) in cubeTypes"
            :key="index"
            class="sicube-type-btn-272"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="sicube-sliders-272">
          <div class="sicube-slider-group-272">
            <label>旋转速度: {{ rotationSpeed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="rotationSpeed"
              min="0.5"
              max="3"
              step="0.1"
              class="sicube-slider-272"
            >
          </div>
          <div class="sicube-slider-group-272">
            <label>立方体大小: {{ cubeSize.toFixed(0) }}px</label>
            <input
              type="range"
              v-model.number="cubeSize"
              min="200"
              max="350"
              step="10"
              class="sicube-slider-272"
            >
          </div>
        </div>
        <div class="sicube-info-272">
          <span>类型: {{ cubeTypes[currentTypeIndex] }}</span>
          <span>面数: {{ images.length }}</span>
        </div>
      </div>

      <div class="sicube-cube-container-272">
        <div class="sicube-scene-272">
          <div class="sicube-cube-272" ref="cubeRef">
            <div
              v-for="(image, index) in images"
              :key="index"
              class="sicube-face-272"
              :class="`sicube-face-${index}-272`"
              :style="getFaceStyle(index)"
            >
              <img :src="image.src" :alt="image.alt" class="sicube-face-image-272">
              <div class="sicube-face-overlay-272"></div>
              <div class="sicube-face-number-272">{{ index + 1 }}</div>
            </div>
          </div>
        </div>
        <div class="sicube-nav-btns-272">
          <button class="sicube-nav-btn-272 sicube-prev-272" @click="prevFace">←</button>
          <button class="sicube-nav-btn-272 sicube-play-272" @click="togglePlay">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="sicube-nav-btn-272 sicube-next-272" @click="nextFace">→</button>
        </div>
      </div>

      <div class="sicube-thumbs-272">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="sicube-thumb-272"
          :class="{ active: currentFace === index }"
          @click="goToFace(index)"
        >
          <img :src="image.src" :alt="image.alt" class="sicube-thumb-image-272">
        </div>
      </div>

      <div class="sicube-progress-272">
        <div class="sicube-progress-bar-272" :style="{ width: `${progress}%` }"></div>
        <span class="sicube-progress-text-272">{{ progress.toFixed(0) }}%</span>
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
const currentFace = ref(0)
const rotationSpeed = ref(1.0)
const cubeSize = ref(250)
const progress = ref(0)
const isPlaying = ref(true)
const cubeRef = ref(null)

const cubeTypes = ['水平旋转', '垂直旋转', '对角旋转', '随机旋转']

const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop',
    alt: '面1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400&h=400&fit=crop',
    alt: '面2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=400&h=400&fit=crop',
    alt: '面3'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=400&h=400&fit=crop',
    alt: '面4'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=400&h=400&fit=crop',
    alt: '面5'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=400&h=400&fit=crop',
    alt: '面6'
  }
]

let scrollTrigger = null
let rotationAnimation = null
let autoPlayInterval = null

const getFaceStyle = (index) => {
  const size = cubeSize.value
  const offset = size / 2
  const faces = 6

  const styles = {
    0: { transform: `rotateY(0deg) translateZ(${offset}px)` },
    1: { transform: `rotateY(90deg) translateZ(${offset}px)` },
    2: { transform: `rotateY(180deg) translateZ(${offset}px)` },
    3: { transform: `rotateY(270deg) translateZ(${offset}px)` },
    4: { transform: `rotateX(90deg) translateZ(${offset}px)` },
    5: { transform: `rotateX(-90deg) translateZ(${offset}px)` }
  }

  return styles[index] || styles[0]
}

const updateCube = () => {
  const cube = cubeRef.value
  if (!cube) return

  let targetRotateX = 0
  let targetRotateY = currentFace.value * -90

  switch (currentTypeIndex.value) {
    case 0: // 水平旋转
      targetRotateY = currentFace.value * -90
      targetRotateX = 0
      break
    case 1: // 垂直旋转
      targetRotateY = 0
      targetRotateX = currentFace.value * -90
      break
    case 2: // 对角旋转
      targetRotateY = currentFace.value * -90
      targetRotateX = currentFace.value * -30
      break
    case 3: // 随机旋转
      targetRotateY = currentFace.value * -90 + (currentFace.value % 2) * 45
      targetRotateX = (currentFace.value % 2) * 90
      break
  }

  gsap.to(cube, {
    rotateX: targetRotateX,
    rotateY: targetRotateY,
    duration: 1 / rotationSpeed.value,
    ease: 'power2.inOut'
  })
}

const changeType = (index) => {
  currentTypeIndex.value = index
  updateCube()
}

const prevFace = () => {
  currentFace.value = (currentFace.value - 1 + images.length) % images.length
  updateCube()
}

const nextFace = () => {
  currentFace.value = (currentFace.value + 1) % images.length
  updateCube()
}

const goToFace = (index) => {
  currentFace.value = index
  updateCube()
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
    nextFace()
  }, 3000 / rotationSpeed.value)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

const initAnimations = () => {
  const faces = gsap.utils.toArray('.sicube-face-272')

  faces.forEach((face, index) => {
    gsap.fromTo(face,
      {
        opacity: 0,
        scale: 0.8
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'back.out(1.5)'
      }
    )

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: face,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: 1
      }
    })

    timeline
      .to(face, {
        boxShadow: '0 0 30px rgba(124, 58, 237, 0.6)',
        duration: 1,
        ease: 'power2.inOut'
      })
  })
}

onMounted(() => {
  updateCube()
  initAnimations()
  startAutoPlay()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.sicube-cube-container-272',
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
  if (rotationAnimation) rotationAnimation.kill()
  stopAutoPlay()
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('sicube-face-272')) {
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
.sicube-272 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.sicube-272::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.sicube-wrapper-272 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sicube-header-272 {
  text-align: center;
  margin-bottom: 60px;
}

.sicube-title-272 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899, #f472b6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(236, 72, 153, 0.5);
}

.sicube-controls-272 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sicube-type-btn-272 {
  padding: 12px 24px;
  background: rgba(236, 72, 153, 0.2);
  border: 2px solid rgba(236, 72, 153, 0.4);
  border-radius: 25px;
  color: #fda4af;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sicube-type-btn-272:hover {
  background: rgba(236, 72, 153, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(236, 72, 153, 0.4);
}

.sicube-type-btn-272.active {
  background: linear-gradient(135deg, #ec4899, #db2777);
  border-color: #f472b6;
  color: white;
  box-shadow: 0 5px 25px rgba(236, 72, 153, 0.6);
}

.sicube-sliders-272 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sicube-slider-group-272 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sicube-slider-group-272 label {
  color: #fda4af;
  font-size: 14px;
  font-weight: 600;
}

.sicube-slider-272 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(236, 72, 153, 0.3);
  border-radius: 3px;
  outline: none;
}

.sicube-slider-272::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ec4899, #db2777);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(236, 72, 153, 0.5);
}

.sicube-info-272 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.sicube-info-272 span {
  color: #fda4af;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.sicube-cube-container-272 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  perspective: 1000px;
}

.sicube-scene-272 {
  position: relative;
  perspective: 1000px;
  margin-bottom: 40px;
}

.sicube-cube-272 {
  position: relative;
  width: 250px;
  height: 250px;
  transform-style: preserve-3d;
  transition: transform 1s ease;
}

.sicube-face-272 {
  position: absolute;
  width: 250px;
  height: 250px;
  overflow: hidden;
  border: 2px solid rgba(236, 72, 153, 0.5);
  backface-visibility: visible;
}

.sicube-face-image-272 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sicube-face-overlay-272 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sicube-face-272:hover .sicube-face-overlay-272 {
  opacity: 1;
}

.sicube-face-number-272 {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  background: rgba(236, 72, 153, 0.8);
  color: white;
  font-size: 20px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 0 10px rgba(236, 72, 153, 0.8);
}

.sicube-nav-btns-272 {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.sicube-nav-btn-272 {
  width: 50px;
  height: 50px;
  background: rgba(236, 72, 153, 0.3);
  border: 2px solid rgba(236, 72, 153, 0.5);
  border-radius: 50%;
  color: #fda4af;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sicube-nav-btn-272:hover {
  background: rgba(236, 72, 153, 0.6);
  transform: scale(1.1);
  box-shadow: 0 5px 20px rgba(236, 72, 153, 0.5);
}

.sicube-thumbs-272 {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.sicube-thumb-272 {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.sicube-thumb-272:hover {
  border-color: rgba(236, 72, 153, 0.6);
  transform: scale(1.1);
}

.sicube-thumb-272.active {
  border-color: #ec4899;
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.6);
}

.sicube-thumb-image-272 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sicube-progress-272 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  height: 8px;
  background: rgba(236, 72, 153, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.sicube-progress-bar-272 {
  height: 100%;
  background: linear-gradient(90deg, #ec4899, #f472b6, #a855f7);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.sicube-progress-text-272 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #fda4af;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sicube-title-272 {
    font-size: 32px;
  }

  .sicube-cube-272 {
    width: 200px;
    height: 200px;
  }

  .sicube-face-272 {
    width: 200px;
    height: 200px;
  }

  .sicube-sliders-272 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
