<template>
  <div class="sihelix-274">
    <div class="sihelix-wrapper-274">
      <div class="sihelix-header-274">
        <h2 class="sihelix-title-274">🌀 螺旋轮播</h2>
        <div class="sihelix-controls-274">
          <button
            v-for="(type, index) in helixTypes"
            :key="index"
            class="sihelix-type-btn-274"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="sihelix-sliders-274">
          <div class="sihelix-slider-group-274">
            <label>旋转速度: {{ rotationSpeed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="rotationSpeed"
              min="0.5"
              max="3"
              step="0.1"
              class="sihelix-slider-274"
            >
          </div>
          <div class="sihelix-slider-group-274">
            <label>螺旋高度: {{ helixHeight.toFixed(0) }}px</label>
            <input
              type="range"
              v-model.number="helixHeight"
              min="300"
              max="600"
              step="10"
              class="sihelix-slider-274"
            >
          </div>
        </div>
        <div class="sihelix-info-274">
          <span>类型: {{ helixTypes[currentTypeIndex] }}</span>
          <span>卡片数量: {{ images.length }}</span>
        </div>
      </div>

      <div class="sihelix-helix-container-274">
        <div class="sihelix-helix-274" ref="helixRef">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="sihelix-card-274"
            :class="`sihelix-card-${index}-274`"
            :style="getHelixCardStyle(index)"
          >
            <div class="sihelix-card-inner-274">
              <img :src="image.src" :alt="image.alt" class="sihelix-card-image-274">
              <div class="sihelix-card-overlay-274"></div>
              <div class="sihelix-card-info-274">
                <h3>{{ image.alt }}</h3>
                <p>卡片 {{ index + 1 }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="sihelix-nav-btns-274">
          <button class="sihelix-nav-btn-274 sihelix-prev-274" @click="prevCard">←</button>
          <button class="sihelix-nav-btn-274 sihelix-play-274" @click="togglePlay">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button class="sihelix-nav-btn-274 sihelix-next-274" @click="nextCard">→</button>
        </div>
      </div>

      <div class="sihelix-indicators-274">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="sihelix-indicator-274"
          :class="{ active: currentCard === index }"
          @click="goToCard(index)"
        ></div>
      </div>

      <div class="sihelix-progress-274">
        <div class="sihelix-progress-bar-274" :style="{ width: `${progress}%` }"></div>
        <span class="sihelix-progress-text-274">{{ progress.toFixed(0) }}%</span>
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
const currentCard = ref(0)
const rotationSpeed = ref(1.0)
const helixHeight = ref(450)
const progress = ref(0)
const isPlaying = ref(true)
const helixRef = ref(null)

const helixTypes = ['单螺旋', '双螺旋', '三螺旋', '波浪螺旋']

const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=300&h=200&fit=crop',
    alt: '卡片1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=300&h=200&fit=crop',
    alt: '卡片2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=300&h=200&fit=crop',
    alt: '卡片3'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=300&h=200&fit=crop',
    alt: '卡片4'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=300&h=200&fit=crop',
    alt: '卡片5'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=300&h=200&fit=crop',
    alt: '卡片6'
  }
]

let scrollTrigger = null
let autoPlayInterval = null
let helixRotation = { x: 0, y: 0 }

const getHelixCardStyle = (index) => {
  const height = helixHeight.value
  const radius = 180
  const angleStep = 60
  const verticalStep = height / images.length

  const angle = index * angleStep
  const verticalPos = index * verticalStep - height / 2

  return {
    transform: `translateY(${verticalPos}px) rotateY(${angle}deg) translateZ(${radius}px)`
  }
}

const updateHelix = () => {
  const helix = helixRef.value
  if (!helix) return

  let targetRotateY = 0

  switch (currentTypeIndex.value) {
    case 0: // 单螺旋
      targetRotateY = currentCard.value * -60
      break
    case 1: // 双螺旋
      targetRotateY = currentCard.value * -90
      break
    case 2: // 三螺旋
      targetRotateY = currentCard.value * -120
      break
    case 3: // 波浪螺旋
      targetRotateY = currentCard.value * -80
      break
  }

  gsap.to(helixRotation, {
    y: targetRotateY,
    duration: 1 / rotationSpeed.value,
    ease: 'power2.inOut',
    onUpdate: () => {
      gsap.set(helix, {
        rotateY: helixRotation.y
      })
    }
  })
}

const changeType = (index) => {
  currentTypeIndex.value = index
  updateHelix()
}

const prevCard = () => {
  currentCard.value = (currentCard.value - 1 + images.length) % images.length
  updateHelix()
}

const nextCard = () => {
  currentCard.value = (currentCard.value + 1) % images.length
  updateHelix()
}

const goToCard = (index) => {
  currentCard.value = index
  updateHelix()
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
    nextCard()
  }, 3000 / rotationSpeed.value)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

const initAnimations = () => {
  const cards = gsap.utils.toArray('.sihelix-card-274')

  cards.forEach((card, index) => {
    gsap.fromTo(card,
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
        trigger: card,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: 1
      }
    })

    timeline
      .to(card, {
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)',
        duration: 1,
        ease: 'power2.inOut'
      })
  })
}

onMounted(() => {
  updateHelix()
  initAnimations()
  startAutoPlay()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.sihelix-helix-container-274',
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
    if (trigger.trigger.classList && trigger.trigger.classList.contains('sihelix-card-274')) {
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
.sihelix-274 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0a2e 0%, #0a1a2e 50%, #0a0a1a 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.sihelix-274::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.sihelix-wrapper-274 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sihelix-header-274 {
  text-align: center;
  margin-bottom: 60px;
}

.sihelix-title-274 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #a855f7, #c084fc, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
}

.sihelix-controls-274 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sihelix-type-btn-274 {
  padding: 12px 24px;
  background: rgba(168, 85, 247, 0.2);
  border: 2px solid rgba(168, 85, 247, 0.4);
  border-radius: 25px;
  color: #e9d5ff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sihelix-type-btn-274:hover {
  background: rgba(168, 85, 247, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(168, 85, 247, 0.4);
}

.sihelix-type-btn-274.active {
  background: linear-gradient(135deg, #a855f7, #9333ea);
  border-color: #c084fc;
  color: white;
  box-shadow: 0 5px 25px rgba(168, 85, 247, 0.6);
}

.sihelix-sliders-274 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sihelix-slider-group-274 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sihelix-slider-group-274 label {
  color: #e9d5ff;
  font-size: 14px;
  font-weight: 600;
}

.sihelix-slider-274 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(168, 85, 247, 0.3);
  border-radius: 3px;
  outline: none;
}

.sihelix-slider-274::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #a855f7, #9333ea);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(168, 85, 247, 0.5);
}

.sihelix-info-274 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.sihelix-info-274 span {
  color: #e9d5ff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(168, 85, 247, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.sihelix-helix-container-274 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  perspective: 1200px;
}

.sihelix-helix-274 {
  position: relative;
  width: 300px;
  height: 500px;
  transform-style: preserve-3d;
  transition: transform 1s ease;
}

.sihelix-card-274 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 240px;
  height: 160px;
  margin-left: -120px;
  margin-top: -80px;
  border-radius: 15px;
  overflow: hidden;
  transform-style: preserve-3d;
  cursor: pointer;
}

.sihelix-card-inner-274 {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1));
  border: 2px solid rgba(168, 85, 247, 0.4);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.sihelix-card-image-274 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sihelix-card-overlay-274 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sihelix-card-274:hover .sihelix-card-overlay-274 {
  opacity: 1;
}

.sihelix-card-info-274 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 15px 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.sihelix-card-274:hover .sihelix-card-info-274 {
  transform: translateY(0);
}

.sihelix-card-info-274 h3 {
  font-size: 16px;
  margin-bottom: 3px;
}

.sihelix-card-info-274 p {
  font-size: 12px;
  opacity: 0.8;
}

.sihelix-nav-btns-274 {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.sihelix-nav-btn-274 {
  width: 50px;
  height: 50px;
  background: rgba(168, 85, 247, 0.3);
  border: 2px solid rgba(168, 85, 247, 0.5);
  border-radius: 50%;
  color: #e9d5ff;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sihelix-nav-btn-274:hover {
  background: rgba(168, 85, 247, 0.6);
  transform: scale(1.1);
  box-shadow: 0 5px 20px rgba(168, 85, 247, 0.5);
}

.sihelix-indicators-274 {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
}

.sihelix-indicator-274 {
  width: 12px;
  height: 12px;
  background: rgba(168, 85, 247, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sihelix-indicator-274:hover {
  background: rgba(168, 85, 247, 0.6);
  transform: scale(1.2);
}

.sihelix-indicator-274.active {
  background: linear-gradient(135deg, #a855f7, #c084fc);
  transform: scale(1.3);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
}

.sihelix-progress-274 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  height: 8px;
  background: rgba(168, 85, 247, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.sihelix-progress-bar-274 {
  height: 100%;
  background: linear-gradient(90deg, #a855f7, #c084fc, #ec4899);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.sihelix-progress-text-274 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #e9d5ff;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sihelix-title-274 {
    font-size: 32px;
  }

  .sihelix-helix-274 {
    width: 260px;
    height: 450px;
  }

  .sihelix-card-274 {
    width: 200px;
    height: 140px;
    margin-left: -100px;
    margin-top: -70px;
  }

  .sihelix-sliders-274 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
