<template>
  <div class="sipy-268">
    <div class="sipy-wrapper-268">
      <div class="sipy-header-268">
        <h2 class="sipy-title-268">🔺 3D金字塔图片</h2>
        <div class="sipy-controls-268">
          <button
            v-for="(type, index) in pyramidTypes"
            :key="index"
            class="sipy-type-btn-268"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="sipy-sliders-268">
          <div class="sipy-slider-group-268">
            <label>旋转强度: {{ intensity.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="intensity"
              min="0.1"
              max="2"
              step="0.1"
              class="sipy-slider-268"
            >
          </div>
          <div class="sipy-slider-group-268">
            <label>动画速度: {{ speed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="speed"
              min="0.2"
              max="3"
              step="0.1"
              class="sipy-slider-268"
            >
          </div>
        </div>
        <div class="sipy-info-268">
          <span>类型: {{ pyramidTypes[currentTypeIndex] }}</span>
          <span>金字塔高度: {{ pyramidHeight.toFixed(0) }}px</span>
        </div>
      </div>

      <div class="sipy-images-container-268">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="sipy-pyramid-wrapper-268"
          :class="`sipy-type-${currentTypeIndex}-268`"
        >
          <div class="sipy-pyramid-268">
            <div class="sipy-base-268"></div>
            <div class="sipy-face-268 sipy-front-268">
              <img :src="image.src" :alt="image.alt" class="sipy-face-image-268">
            </div>
            <div class="sipy-face-268 sipy-back-268">
              <img :src="image.src" :alt="image.alt" class="sipy-face-image-268">
            </div>
            <div class="sipy-face-268 sipy-left-268">
              <img :src="image.src" :alt="image.alt" class="sipy-face-image-268">
            </div>
            <div class="sipy-face-268 sipy-right-268">
              <img :src="image.src" :alt="image.alt" class="sipy-face-image-268">
            </div>
          </div>
          <div class="sipy-aura-268"></div>
          <div class="sipy-shadow-268"></div>
        </div>
      </div>

      <div class="sipy-progress-268">
        <div class="sipy-progress-bar-268" :style="{ width: `${progress}%` }"></div>
        <span class="sipy-progress-text-268">{{ progress.toFixed(0) }}%</span>
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
const pyramidHeight = ref(150)

const pyramidTypes = ['金字塔旋转', '金字塔升降', '金字塔展开', '金字塔旋转升降']

const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '金字塔1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '金字塔2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '金字塔3'
  }
]

let scrollTrigger = null
let pyramidAnimations = []

const changeType = (index) => {
  currentTypeIndex.value = index
  initAnimations()
}

const initAnimations = () => {
  pyramidAnimations.forEach(anim => anim.kill())
  pyramidAnimations = []
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('sipy-pyramid-wrapper-268')) {
      trigger.kill()
    }
  })

  const wrappers = gsap.utils.toArray('.sipy-pyramid-wrapper-268')

  wrappers.forEach((wrapper, wrapperIndex) => {
    const pyramid = wrapper.querySelector('.sipy-pyramid-268')
    const aura = wrapper.querySelector('.sipy-aura-268')
    const shadow = wrapper.querySelector('.sipy-shadow-268')

    const baseDelay = wrapperIndex * 0.15
    const animSpeed = 1 / speed.value

    let timeline

    switch (currentTypeIndex.value) {
      case 0: // 金字塔旋转
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(pyramid, {
            rotateY: 360 * intensity.value,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(aura, {
            scale: 1.5,
            opacity: 0.8,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
          .to(shadow, {
            scale: 1.2,
            opacity: 0.7,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 1: // 金字塔升降
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(pyramid, {
            y: -100 * intensity.value,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(aura, {
            scale: 2,
            opacity: 0.6,
            duration: 1,
            ease: 'power2.out'
          }, 0)
          .to(shadow, {
            scale: 0.6,
            opacity: 0.3,
            blur: 20,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
        break

      case 2: // 金字塔展开
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(pyramid, {
            scaleY: 1.5,
            rotateX: 30 * intensity.value,
            duration: 1,
            ease: 'power3.inOut'
          })
          .to(aura, {
            scale: 1.8,
            opacity: 0.9,
            duration: 1,
            ease: 'power2.out'
          }, 0)
          .to(shadow, {
            scale: 1.5,
            opacity: 0.8,
            blur: 15,
            duration: 1,
            ease: 'power2.out'
          }, 0)
        break

      case 3: // 金字塔旋转升降
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(pyramid, {
            rotateY: 540 * intensity.value,
            y: -80 * intensity.value,
            rotateX: 20 * intensity.value,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(aura, {
            scale: 2.5,
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
          }, 0)
          .to(shadow, {
            scale: 0.5,
            opacity: 0.2,
            blur: 30,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
        break
    }

    if (timeline) {
      pyramidAnimations.push(timeline)
    }
  })
}

onMounted(() => {
  initAnimations()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.sipy-images-container-268',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
    onUpdate: (self) => {
      progress.value = self.progress * 100
      pyramidHeight.value = 150 + self.progress * 100 * intensity.value
    }
  })
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  pyramidAnimations.forEach(anim => anim.kill())
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})

watch([intensity, speed], () => {
  initAnimations()
})
</script>

<style scoped>
.sipy-268 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.sipy-268::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.sipy-wrapper-268 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sipy-header-268 {
  text-align: center;
  margin-bottom: 60px;
}

.sipy-title-268 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(251, 191, 36, 0.5);
}

.sipy-controls-268 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sipy-type-btn-268 {
  padding: 12px 24px;
  background: rgba(251, 191, 36, 0.2);
  border: 2px solid rgba(251, 191, 36, 0.4);
  border-radius: 25px;
  color: #fde68a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sipy-type-btn-268:hover {
  background: rgba(251, 191, 36, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(251, 191, 36, 0.4);
}

.sipy-type-btn-268.active {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-color: #fcd34d;
  color: #1f2937;
  box-shadow: 0 5px 25px rgba(251, 191, 36, 0.6);
}

.sipy-sliders-268 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sipy-slider-group-268 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sipy-slider-group-268 label {
  color: #fde68a;
  font-size: 14px;
  font-weight: 600;
}

.sipy-slider-268 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(251, 191, 36, 0.3);
  border-radius: 3px;
  outline: none;
}

.sipy-slider-268::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(251, 191, 36, 0.5);
}

.sipy-info-268 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.sipy-info-268 span {
  color: #fde68a;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(251, 191, 36, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.sipy-images-container-268 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 60px;
  padding: 40px 0;
  perspective: 1000px;
}

.sipy-pyramid-wrapper-268 {
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.sipy-pyramid-268 {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(30deg);
  transition: transform 0.1s linear;
}

.sipy-base-268 {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) rotateX(90deg);
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(217, 119, 6, 0.3));
  border: 2px solid rgba(251, 191, 36, 0.5);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

.sipy-face-268 {
  position: absolute;
  width: 141px;
  height: 141px;
  backface-visibility: visible;
  overflow: hidden;
  border: 1px solid rgba(251, 191, 36, 0.4);
  box-shadow: inset 0 0 20px rgba(251, 191, 36, 0.2);
}

.sipy-face-image-268 {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sipy-front-268 {
  transform: translateZ(50px) translateY(-50px) rotateX(35deg);
}

.sipy-back-268 {
  transform: rotateY(180deg) translateZ(50px) translateY(-50px) rotateX(35deg);
}

.sipy-left-268 {
  transform: rotateY(-90deg) translateZ(50px) translateY(-50px) rotateX(35deg);
}

.sipy-right-268 {
  transform: rotateY(90deg) translateZ(50px) translateY(-50px) rotateX(35deg);
}

.sipy-aura-268 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0;
  pointer-events: none;
}

.sipy-shadow-268 {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(251, 191, 36, 0.4) 0%, transparent 70%);
  filter: blur(10px);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.sipy-pyramid-wrapper-268:hover .sipy-pyramid-268 {
  transform: rotateX(-10deg) rotateY(45deg) scale(1.1);
  transition: transform 0.5s ease;
}

.sipy-pyramid-wrapper-268:hover .sipy-aura-268 {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.sipy-progress-268 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  height: 8px;
  background: rgba(251, 191, 36, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.sipy-progress-bar-268 {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b, #d97706);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.sipy-progress-text-268 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #fde68a;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sipy-title-268 {
    font-size: 32px;
  }

  .sipy-images-container-268 {
    grid-template-columns: 1fr;
  }

  .sipy-pyramid-268 {
    width: 180px;
    height: 180px;
  }

  .sipy-face-268 {
    width: 127px;
    height: 127px;
  }

  .sipy-sliders-268 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
