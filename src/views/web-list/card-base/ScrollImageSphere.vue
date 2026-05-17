<template>
  <div class="sisp-269">
    <div class="sisp-wrapper-269">
      <div class="sisp-header-269">
        <h2 class="sisp-title-269">🔮 3D球体图片</h2>
        <div class="sisp-controls-269">
          <button
            v-for="(type, index) in sphereTypes"
            :key="index"
            class="sisp-type-btn-269"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="sisp-sliders-269">
          <div class="sisp-slider-group-269">
            <label>旋转强度: {{ intensity.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="intensity"
              min="0.1"
              max="2"
              step="0.1"
              class="sisp-slider-269"
            >
          </div>
          <div class="sisp-slider-group-269">
            <label>动画速度: {{ speed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="speed"
              min="0.2"
              max="3"
              step="0.1"
              class="sisp-slider-269"
            >
          </div>
        </div>
        <div class="sisp-info-269">
          <span>类型: {{ sphereTypes[currentTypeIndex] }}</span>
          <span>球体半径: {{ sphereRadius.toFixed(0) }}px</span>
        </div>
      </div>

      <div class="sisp-images-container-269">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="sisp-sphere-wrapper-269"
          :class="`sisp-type-${currentTypeIndex}-269`"
        >
          <div class="sisp-sphere-269">
            <div class="sisp-sphere-face-269" v-for="i in 6" :key="i" :class="`sisp-face-${i}-269`">
              <img :src="image.src" :alt="`球面${i}`" class="sisp-face-image-269">
            </div>
          </div>
          <div class="sisp-atmosphere-269"></div>
          <div class="sisp-shadow-269"></div>
        </div>
      </div>

      <div class="sisp-progress-269">
        <div class="sisp-progress-bar-269" :style="{ width: `${progress}%` }"></div>
        <span class="sisp-progress-text-269">{{ progress.toFixed(0) }}%</span>
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
const sphereRadius = ref(80)

const sphereTypes = ['球体旋转', '球体脉冲', '球体轨道', '球体爆炸']

const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '球体1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '球体2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '球体3'
  }
]

let scrollTrigger = null
let sphereAnimations = []

const changeType = (index) => {
  currentTypeIndex.value = index
  initAnimations()
}

const initAnimations = () => {
  sphereAnimations.forEach(anim => anim.kill())
  sphereAnimations = []
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('sisp-sphere-wrapper-269')) {
      trigger.kill()
    }
  })

  const wrappers = gsap.utils.toArray('.sisp-sphere-wrapper-269')

  wrappers.forEach((wrapper, wrapperIndex) => {
    const sphere = wrapper.querySelector('.sisp-sphere-269')
    const atmosphere = wrapper.querySelector('.sisp-atmosphere-269')
    const shadow = wrapper.querySelector('.sisp-shadow-269')
    const faces = wrapper.querySelectorAll('.sisp-sphere-face-269')

    const baseDelay = wrapperIndex * 0.15
    const animSpeed = 1 / speed.value

    let timeline

    switch (currentTypeIndex.value) {
      case 0: // 球体旋转
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(sphere, {
            rotateY: 360 * intensity.value,
            rotateX: 180 * intensity.value,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(atmosphere, {
            scale: 1.3,
            opacity: 0.7,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
          .to(shadow, {
            scale: 1.1,
            opacity: 0.6,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 1: // 球体脉冲
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(sphere, {
            scale: 1.5,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(faces, {
            opacity: (i) => 0.7 + (i % 2) * 0.3,
            duration: 1,
            ease: 'sine.inOut'
          }, 0)
          .to(atmosphere, {
            scale: 2,
            opacity: 0.9,
            duration: 1,
            ease: 'power2.out'
          }, 0)
          .to(shadow, {
            scale: 0.7,
            opacity: 0.4,
            blur: 15,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
        break

      case 2: // 球体轨道
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(sphere, {
            rotateY: 540 * intensity.value,
            rotateZ: 360 * intensity.value,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(atmosphere, {
            scale: 1.6,
            opacity: 0.8,
            duration: 1,
            ease: 'power2.out'
          }, 0)
          .to(shadow, {
            scale: 1.3,
            opacity: 0.7,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 3: // 球体爆炸
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(sphere, {
            scale: 2.5,
            rotateY: 720 * intensity.value,
            opacity: 0.6,
            duration: 1,
            ease: 'power3.inOut'
          })
          .to(faces, {
            translateX: (i) => Math.cos(i * 60 * Math.PI / 180) * 80 * intensity.value,
            translateY: (i) => Math.sin(i * 60 * Math.PI / 180) * 80 * intensity.value,
            translateZ: (i) => Math.random() * 50 * intensity.value,
            opacity: (i) => 0.8 - i * 0.1,
            duration: 1,
            ease: 'power2.out'
          }, 0)
          .to(atmosphere, {
            scale: 3,
            opacity: 1,
            filter: 'blur(30px)',
            duration: 1,
            ease: 'power3.out'
          }, 0)
          .to(shadow, {
            scale: 0.4,
            opacity: 0.2,
            blur: 25,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
        break
    }

    if (timeline) {
      sphereAnimations.push(timeline)
    }
  })
}

onMounted(() => {
  initAnimations()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.sisp-images-container-269',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
    onUpdate: (self) => {
      progress.value = self.progress * 100
      sphereRadius.value = 80 + self.progress * 40 * intensity.value
    }
  })
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  sphereAnimations.forEach(anim => anim.kill())
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})

watch([intensity, speed], () => {
  initAnimations()
})
</script>

<style scoped>
.sisp-269 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.sisp-269::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 60% 40%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.sisp-wrapper-269 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sisp-header-269 {
  text-align: center;
  margin-bottom: 60px;
}

.sisp-title-269 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #06b6d4, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
}

.sisp-controls-269 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sisp-type-btn-269 {
  padding: 12px 24px;
  background: rgba(6, 182, 212, 0.2);
  border: 2px solid rgba(6, 182, 212, 0.4);
  border-radius: 25px;
  color: #67e8f9;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sisp-type-btn-269:hover {
  background: rgba(6, 182, 212, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(6, 182, 212, 0.4);
}

.sisp-type-btn-269.active {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-color: #22d3ee;
  color: white;
  box-shadow: 0 5px 25px rgba(6, 182, 212, 0.6);
}

.sisp-sliders-269 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sisp-slider-group-269 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sisp-slider-group-269 label {
  color: #67e8f9;
  font-size: 14px;
  font-weight: 600;
}

.sisp-slider-269 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(6, 182, 212, 0.3);
  border-radius: 3px;
  outline: none;
}

.sisp-slider-269::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(6, 182, 212, 0.5);
}

.sisp-info-269 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.sisp-info-269 span {
  color: #67e8f9;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.sisp-images-container-269 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 60px;
  padding: 40px 0;
  perspective: 1000px;
}

.sisp-sphere-wrapper-269 {
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.sisp-sphere-269 {
  position: relative;
  width: 160px;
  height: 160px;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(30deg);
  transition: transform 0.1s linear;
}

.sisp-sphere-face-269 {
  position: absolute;
  width: 160px;
  height: 160px;
  backface-visibility: visible;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid rgba(6, 182, 212, 0.3);
  box-shadow: inset 0 0 20px rgba(6, 182, 212, 0.2);
}

.sisp-face-image-269 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.sisp-face-1-269 { transform: rotateY(0deg) translateZ(80px); }
.sisp-face-2-269 { transform: rotateY(60deg) translateZ(80px); }
.sisp-face-3-269 { transform: rotateY(120deg) translateZ(80px); }
.sisp-face-4-269 { transform: rotateY(180deg) translateZ(80px); }
.sisp-face-5-269 { transform: rotateY(240deg) translateZ(80px); }
.sisp-face-6-269 { transform: rotateY(300deg) translateZ(80px); }

.sisp-atmosphere-269 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(15px);
  opacity: 0;
  pointer-events: none;
}

.sisp-shadow-269 {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(6, 182, 212, 0.4) 0%, transparent 70%);
  filter: blur(10px);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.sisp-sphere-wrapper-269:hover .sisp-sphere-269 {
  transform: rotateX(-10deg) rotateY(45deg) scale(1.1);
  transition: transform 0.5s ease;
}

.sisp-sphere-wrapper-269:hover .sisp-atmosphere-269 {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.sisp-progress-269 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  height: 8px;
  background: rgba(6, 182, 212, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.sisp-progress-bar-269 {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #a855f7, #ec4899);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.sisp-progress-text-269 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #67e8f9;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sisp-title-269 {
    font-size: 32px;
  }

  .sisp-images-container-269 {
    grid-template-columns: 1fr;
  }

  .sisp-sphere-269 {
    width: 140px;
    height: 140px;
  }

  .sisp-sphere-face-269 {
    width: 140px;
    height: 140px;
  }

  .sisp-sliders-269 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
