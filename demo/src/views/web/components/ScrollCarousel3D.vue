<template>
  <div class="si3d-271">
    <div class="si3d-wrapper-271">
      <div class="si3d-header-271">
        <h2 class="si3d-title-271">🎠 3D轮播画廊</h2>
        <div class="si3d-controls-271">
          <button
            v-for="(type, index) in carouselTypes"
            :key="index"
            class="si3d-type-btn-271"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="si3d-sliders-271">
          <div class="si3d-slider-group-271">
            <label>旋转角度: {{ rotationAngle.toFixed(0) }}°</label>
            <input
              type="range"
              v-model.number="rotationAngle"
              min="30"
              max="90"
              step="5"
              class="si3d-slider-271"
            >
          </div>
          <div class="si3d-slider-group-271">
            <label>间距: {{ spacing.toFixed(0) }}px</label>
            <input
              type="range"
              v-model.number="spacing"
              min="100"
              max="300"
              step="10"
              class="si3d-slider-271"
            >
          </div>
        </div>
        <div class="si3d-info-271">
          <span>类型: {{ carouselTypes[currentTypeIndex] }}</span>
          <span>卡片数量: {{ images.length }}</span>
        </div>
      </div>

      <div class="si3d-carousel-container-271">
        <div class="si3d-carousel-271" ref="carouselRef">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="si3d-card-271"
            :class="`si3d-card-${index}-271`"
          >
            <div class="si3d-card-inner-271">
              <img :src="image.src" :alt="image.alt" class="si3d-card-image-271">
              <div class="si3d-card-overlay-271"></div>
              <div class="si3d-card-text-271">
                <h3>{{ image.alt }}</h3>
                <p>卡片 {{ index + 1 }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="si3d-nav-btns-271">
          <button class="si3d-nav-btn-271 si3d-prev-271" @click="prevSlide">←</button>
          <button class="si3d-nav-btn-271 si3d-next-271" @click="nextSlide">→</button>
        </div>
      </div>

      <div class="si3d-dots-271">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="si3d-dot-271"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        ></div>
      </div>

      <div class="si3d-progress-271">
        <div class="si3d-progress-bar-271" :style="{ width: `${progress}%` }"></div>
        <span class="si3d-progress-text-271">{{ progress.toFixed(0) }}%</span>
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
const rotationAngle = ref(60)
const spacing = ref(180)
const progress = ref(0)
const carouselRef = ref(null)

const carouselTypes = ['3D旋转轮播', '3D缩放轮播', '3D翻转轮播', '3D波浪轮播']

const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=500&fit=crop',
    alt: '风景1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400&h=500&fit=crop',
    alt: '风景2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=400&h=500&fit=crop',
    alt: '风景3'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=400&h=500&fit=crop',
    alt: '风景4'
  },
  {
    src: 'https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=400&h=500&fit=crop',
    alt: '风景5'
  }
]

let scrollTrigger = null
let carouselAnimations = []

const updateCarousel = () => {
  const cards = gsap.utils.toArray('.si3d-card-271')
  const angle = rotationAngle.value
  const gap = spacing.value

  cards.forEach((card, index) => {
    let offset = index - currentSlide.value
    const normalizedOffset = ((offset + images.length) % images.length) - images.length / 2

    switch (currentTypeIndex.value) {
      case 0: // 3D旋转轮播
        gsap.to(card, {
          rotateY: normalizedOffset * angle,
          translateZ: -Math.abs(normalizedOffset) * gap,
          opacity: 1 - Math.abs(normalizedOffset) * 0.3,
          scale: 1 - Math.abs(normalizedOffset) * 0.15,
          zIndex: images.length - Math.abs(normalizedOffset),
          duration: 0.6,
          ease: 'power2.out'
        })
        break

      case 1: // 3D缩放轮播
        gsap.to(card, {
          rotateY: normalizedOffset * angle * 0.5,
          translateX: normalizedOffset * gap,
          scale: 1 - Math.abs(normalizedOffset) * 0.2,
          opacity: 1 - Math.abs(normalizedOffset) * 0.25,
          zIndex: images.length - Math.abs(normalizedOffset),
          duration: 0.5,
          ease: 'back.out(1.2)'
        })
        break

      case 2: // 3D翻转轮播
        gsap.to(card, {
          rotateY: normalizedOffset * angle,
          rotateX: normalizedOffset * 10,
          translateZ: -Math.abs(normalizedOffset) * gap * 0.5,
          scale: 1 - Math.abs(normalizedOffset) * 0.1,
          opacity: 1 - Math.abs(normalizedOffset) * 0.2,
          zIndex: images.length - Math.abs(normalizedOffset),
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)'
        })
        break

      case 3: // 3D波浪轮播
        const waveY = Math.sin(normalizedOffset * 0.8) * 40
        gsap.to(card, {
          rotateY: normalizedOffset * angle * 0.7,
          translateX: normalizedOffset * gap * 0.8,
          translateY: waveY,
          translateZ: -Math.abs(normalizedOffset) * gap * 0.3,
          scale: 1 - Math.abs(normalizedOffset) * 0.12,
          opacity: 1 - Math.abs(normalizedOffset) * 0.2,
          zIndex: images.length - Math.abs(normalizedOffset),
          duration: 0.6,
          ease: 'power2.inOut'
        })
        break
    }
  })
}

const changeType = (index) => {
  currentTypeIndex.value = index
  updateCarousel()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + images.length) % images.length
  updateCarousel()
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.length
  updateCarousel()
}

const goToSlide = (index) => {
  currentSlide.value = index
  updateCarousel()
}

const initAnimations = () => {
  carouselAnimations.forEach(anim => anim.kill())
  carouselAnimations = []

  const cards = gsap.utils.toArray('.si3d-card-271')

  cards.forEach((card, index) => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: 1,
        toggleActions: 'play none none reverse'
      }
    })

    timeline
      .from(card, {
        rotateY: index * 30,
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .to(card, {
        rotateY: index * 30 + 20,
        scale: 1.05,
        duration: 1,
        ease: 'power2.inOut'
      })

    carouselAnimations.push(timeline)
  })
}

onMounted(() => {
  updateCarousel()
  initAnimations()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.si3d-carousel-container-271',
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
  carouselAnimations.forEach(anim => anim.kill())
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('si3d-card-271')) {
      trigger.kill()
    }
  })
})

watch([rotationAngle, spacing], () => {
  updateCarousel()
})
</script>

<style scoped>
.si3d-271 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f2332 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.si3d-271::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.si3d-wrapper-271 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.si3d-header-271 {
  text-align: center;
  margin-bottom: 60px;
}

.si3d-title-271 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #7c3aed, #a855f7, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
}

.si3d-controls-271 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.si3d-type-btn-271 {
  padding: 12px 24px;
  background: rgba(124, 58, 237, 0.2);
  border: 2px solid rgba(124, 58, 237, 0.4);
  border-radius: 25px;
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.si3d-type-btn-271:hover {
  background: rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(124, 58, 237, 0.4);
}

.si3d-type-btn-271.active {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  border-color: #a855f7;
  color: white;
  box-shadow: 0 5px 25px rgba(124, 58, 237, 0.6);
}

.si3d-sliders-271 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.si3d-slider-group-271 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.si3d-slider-group-271 label {
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 600;
}

.si3d-slider-271 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(124, 58, 237, 0.3);
  border-radius: 3px;
  outline: none;
}

.si3d-slider-271::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(124, 58, 237, 0.5);
}

.si3d-info-271 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.si3d-info-271 span {
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(124, 58, 237, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.si3d-carousel-container-271 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  perspective: 1200px;
  position: relative;
}

.si3d-carousel-271 {
  position: relative;
  width: 300px;
  height: 400px;
  transform-style: preserve-3d;
}

.si3d-card-271 {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  cursor: pointer;
}

.si3d-card-inner-271 {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(59, 130, 246, 0.1));
  border: 2px solid rgba(124, 58, 237, 0.3);
}

.si3d-card-image-271 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.si3d-card-overlay-271 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(59, 130, 246, 0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.si3d-card-271:hover .si3d-card-overlay-271 {
  opacity: 1;
}

.si3d-card-text-271 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px 20px 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.si3d-card-271:hover .si3d-card-text-271 {
  transform: translateY(0);
}

.si3d-card-text-271 h3 {
  font-size: 20px;
  margin-bottom: 5px;
}

.si3d-card-text-271 p {
  font-size: 14px;
  opacity: 0.8;
}

.si3d-nav-btns-271 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
}

.si3d-nav-btn-271 {
  width: 50px;
  height: 50px;
  background: rgba(124, 58, 237, 0.3);
  border: 2px solid rgba(124, 58, 237, 0.5);
  border-radius: 50%;
  color: #c4b5fd;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.si3d-nav-btn-271:hover {
  background: rgba(124, 58, 237, 0.6);
  transform: scale(1.1);
  box-shadow: 0 5px 20px rgba(124, 58, 237, 0.5);
}

.si3d-prev-271 {
  transform: translateX(-200px);
}

.si3d-next-271 {
  transform: translateX(200px);
}

.si3d-nav-btns-271:hover .si3d-prev-271,
.si3d-nav-btns-271:hover .si3d-next-271 {
  transform: translateX(0);
}

.si3d-dots-271 {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
}

.si3d-dot-271 {
  width: 12px;
  height: 12px;
  background: rgba(124, 58, 237, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.si3d-dot-271:hover {
  background: rgba(124, 58, 237, 0.6);
  transform: scale(1.2);
}

.si3d-dot-271.active {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  transform: scale(1.3);
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.6);
}

.si3d-progress-271 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  height: 8px;
  background: rgba(124, 58, 237, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.si3d-progress-bar-271 {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #a855f7, #3b82f6);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.si3d-progress-text-271 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .si3d-title-271 {
    font-size: 32px;
  }

  .si3d-carousel-271 {
    width: 250px;
    height: 350px;
  }

  .si3d-nav-btns-271 {
    bottom: -30px;
  }

  .si3d-sliders-271 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
