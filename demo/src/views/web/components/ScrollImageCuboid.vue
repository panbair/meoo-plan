<template>
  <div class="sicub-267">
    <div class="sicub-wrapper-267">
      <div class="sicub-header-267">
        <h2 class="sicub-title-267">🧊 3D长方体图片</h2>
        <div class="sicub-controls-267">
          <button
            v-for="(type, index) in cuboidTypes"
            :key="index"
            class="sicub-type-btn-267"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="sicub-sliders-267">
          <div class="sicub-slider-group-267">
            <label>旋转强度: {{ intensity.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="intensity"
              min="0.1"
              max="2"
              step="0.1"
              class="sicub-slider-267"
            >
          </div>
          <div class="sicub-slider-group-267">
            <label>动画速度: {{ speed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="speed"
              min="0.2"
              max="3"
              step="0.1"
              class="sicub-slider-267"
            >
          </div>
        </div>
        <div class="sicub-info-267">
          <span>类型: {{ cuboidTypes[currentTypeIndex] }}</span>
          <span>旋转角度: {{ rotationAngle.toFixed(0) }}°</span>
        </div>
      </div>

      <div class="sicub-images-container-267">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="sicub-cuboid-wrapper-267"
          :class="`sicub-type-${currentTypeIndex}-267`"
        >
          <div class="sicub-cuboid-267">
            <div class="sicub-face-267 sicub-front-267">
              <img :src="image.src" :alt="image.alt" class="sicub-face-image-267">
            </div>
            <div class="sicub-face-267 sicub-back-267">
              <img :src="image.src" :alt="image.alt" class="sicub-face-image-267">
            </div>
            <div class="sicub-face-267 sicub-right-267">
              <img :src="image.src" :alt="image.alt" class="sicub-face-image-267">
            </div>
            <div class="sicub-face-267 sicub-left-267">
              <img :src="image.src" :alt="image.alt" class="sicub-face-image-267">
            </div>
            <div class="sicub-face-267 sicub-top-267">
              <img :src="image.src" :alt="image.alt" class="sicub-face-image-267">
            </div>
            <div class="sicub-face-267 sicub-bottom-267">
              <img :src="image.src" :alt="image.alt" class="sicub-face-image-267">
            </div>
          </div>
          <div class="sicub-shadow-267"></div>
        </div>
      </div>

      <div class="sicub-progress-267">
        <div class="sicub-progress-bar-267" :style="{ width: `${progress}%` }"></div>
        <span class="sicub-progress-text-267">{{ progress.toFixed(0) }}%</span>
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
const intensity = ref(1.0)
const speed = ref(1.0)
const progress = ref(0)
const rotationAngle = ref(0)

const cuboidTypes = ['水平翻转', '垂直翻转', '对角翻转', '螺旋翻转']

const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '长方体1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '长方体2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '长方体3'
  }
]

let scrollTrigger = null
let cuboidAnimations = []

const changeType = (index) => {
  currentTypeIndex.value = index
  initAnimations()
}

const initAnimations = () => {
  cuboidAnimations.forEach(anim => anim.kill())
  cuboidAnimations = []
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('sicub-cuboid-wrapper-267')) {
      trigger.kill()
    }
  })

  const wrappers = gsap.utils.toArray('.sicub-cuboid-wrapper-267')

  wrappers.forEach((wrapper, wrapperIndex) => {
    const cuboid = wrapper.querySelector('.sicub-cuboid-267')
    const shadow = wrapper.querySelector('.sicub-shadow-267')

    const baseDelay = wrapperIndex * 0.15
    const animSpeed = 1 / speed.value

    let timeline

    switch (currentTypeIndex.value) {
      case 0: // 水平翻转
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(cuboid, {
            rotateY: 360 * intensity.value,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(shadow, {
            scale: 0.8,
            opacity: 0.5,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 1: // 垂直翻转
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(cuboid, {
            rotateX: 360 * intensity.value,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(shadow, {
            scale: 1.2,
            opacity: 0.7,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 2: // 对角翻转
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(cuboid, {
            rotateX: 180 * intensity.value,
            rotateY: 180 * intensity.value,
            duration: 1,
            ease: 'power3.inOut'
          })
          .to(shadow, {
            scale: 1.5,
            opacity: 0.9,
            blur: 10,
            duration: 1,
            ease: 'power2.out'
          }, 0)
        break

      case 3: // 螺旋翻转
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(cuboid, {
            rotateX: 540 * intensity.value,
            rotateY: 360 * intensity.value,
            rotateZ: 180 * intensity.value,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(shadow, {
            scale: 0.6,
            opacity: 0.3,
            blur: 20,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break
    }

    if (timeline) {
      cuboidAnimations.push(timeline)
    }
  })
}

onMounted(() => {
  initAnimations()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.sicub-images-container-267',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
    onUpdate: (self) => {
      progress.value = self.progress * 100
      rotationAngle.value = self.progress * 360 * intensity.value
    }
  })
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  cuboidAnimations.forEach(anim => anim.kill())
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})

watch([intensity, speed], () => {
  initAnimations()
})
</script>

<style scoped>
.sicub-267 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.sicub-267::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.sicub-wrapper-267 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sicub-header-267 {
  text-align: center;
  margin-bottom: 60px;
}

.sicub-title-267 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
}

.sicub-controls-267 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sicub-type-btn-267 {
  padding: 12px 24px;
  background: rgba(139, 92, 246, 0.2);
  border: 2px solid rgba(139, 92, 246, 0.4);
  border-radius: 25px;
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sicub-type-btn-267:hover {
  background: rgba(139, 92, 246, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(139, 92, 246, 0.4);
}

.sicub-type-btn-267.active {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-color: #a78bfa;
  color: white;
  box-shadow: 0 5px 25px rgba(139, 92, 246, 0.6);
}

.sicub-sliders-267 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sicub-slider-group-267 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sicub-slider-group-267 label {
  color: #a78bfa;
  font-size: 14px;
  font-weight: 600;
}

.sicub-slider-267 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(139, 92, 246, 0.3);
  border-radius: 3px;
  outline: none;
}

.sicub-slider-267::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.5);
}

.sicub-info-267 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.sicub-info-267 span {
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.sicub-images-container-267 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 60px;
  padding: 40px 0;
  perspective: 1000px;
}

.sicub-cuboid-wrapper-267 {
  position: relative;
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.sicub-cuboid-267 {
  position: relative;
  width: 300px;
  height: 200px;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(30deg);
  transition: transform 0.1s linear;
}

.sicub-face-267 {
  position: absolute;
  width: 300px;
  height: 200px;
  backface-visibility: visible;
  overflow: hidden;
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.2);
}

.sicub-face-image-267 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sicub-front-267 {
  transform: translateZ(50px);
}

.sicub-back-267 {
  transform: rotateY(180deg) translateZ(50px);
}

.sicub-right-267 {
  transform: rotateY(90deg) translateZ(50px);
}

.sicub-left-267 {
  transform: rotateY(-90deg) translateZ(50px);
}

.sicub-top-267 {
  transform: rotateX(90deg) translateZ(50px);
}

.sicub-bottom-267 {
  transform: rotateX(-90deg) translateZ(50px);
}

.sicub-shadow-267 {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  filter: blur(10px);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.sicub-cuboid-wrapper-267:hover .sicub-cuboid-267 {
  transform: rotateX(-10deg) rotateY(45deg) scale(1.05);
  transition: transform 0.5s ease;
}

.sicub-progress-267 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  height: 8px;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.sicub-progress-bar-267 {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4, #ec4899);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.sicub-progress-text-267 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sicub-title-267 {
    font-size: 32px;
  }

  .sicub-images-container-267 {
    grid-template-columns: 1fr;
  }

  .sicub-cuboid-267 {
    width: 250px;
    height: 180px;
  }

  .sicub-face-267 {
    width: 250px;
    height: 180px;
  }

  .sicub-sliders-267 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
