<template>
  <div class="sitor-270">
    <div class="sitor-wrapper-270">
      <div class="sitor-header-270">
        <h2 class="sitor-title-270">🍩 3D环形体图片</h2>
        <div class="sitor-controls-270">
          <button
            v-for="(type, index) in torusTypes"
            :key="index"
            class="sitor-type-btn-270"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="sitor-sliders-270">
          <div class="sitor-slider-group-270">
            <label>旋转强度: {{ intensity.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="intensity"
              min="0.1"
              max="2"
              step="0.1"
              class="sitor-slider-270"
            >
          </div>
          <div class="sitor-slider-group-270">
            <label>动画速度: {{ speed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="speed"
              min="0.2"
              max="3"
              step="0.1"
              class="sitor-slider-270"
            >
          </div>
        </div>
        <div class="sitor-info-270">
          <span>类型: {{ torusTypes[currentTypeIndex] }}</span>
          <span>环半径: {{ torusRadius.toFixed(0) }}px</span>
        </div>
      </div>

      <div class="sitor-images-container-270">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="sitor-torus-wrapper-270"
          :class="`sitor-type-${currentTypeIndex}-270`"
        >
          <div class="sitor-torus-270">
            <div class="sitor-ring-270" v-for="i in 12" :key="i">
              <img :src="image.src" :alt="`环段${i}`" class="sitor-ring-image-270">
            </div>
          </div>
          <div class="sitor-glow-270"></div>
          <div class="sitor-shadow-270"></div>
        </div>
      </div>

      <div class="sitor-progress-270">
        <div class="sitor-progress-bar-270" :style="{ width: `${progress}%` }"></div>
        <span class="sitor-progress-text-270">{{ progress.toFixed(0) }}%</span>
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
const torusRadius = ref(100)

const torusTypes = ['环形体旋转', '环形体膨胀', '环形体扭曲', '环形体分裂']

const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '环形体1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '环形体2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '环形体3'
  }
]

let scrollTrigger = null
let torusAnimations = []

const changeType = (index) => {
  currentTypeIndex.value = index
  initAnimations()
}

const initAnimations = () => {
  torusAnimations.forEach(anim => anim.kill())
  torusAnimations = []
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('sitor-torus-wrapper-270')) {
      trigger.kill()
    }
  })

  const wrappers = gsap.utils.toArray('.sitor-torus-wrapper-270')

  wrappers.forEach((wrapper, wrapperIndex) => {
    const torus = wrapper.querySelector('.sitor-torus-270')
    const glow = wrapper.querySelector('.sitor-glow-270')
    const shadow = wrapper.querySelector('.sitor-shadow-270')
    const rings = wrapper.querySelectorAll('.sitor-ring-270')

    const baseDelay = wrapperIndex * 0.15
    const animSpeed = 1 / speed.value

    let timeline

    switch (currentTypeIndex.value) {
      case 0: // 环形体旋转
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(torus, {
            rotateY: 360 * intensity.value,
            rotateZ: 180 * intensity.value,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(rings, {
            rotateZ: (i) => 30 * i * intensity.value,
            duration: 1,
            ease: 'sine.inOut'
          }, 0)
          .to(glow, {
            scale: 1.4,
            opacity: 0.7,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
          .to(shadow, {
            scale: 1.2,
            opacity: 0.6,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 1: // 环形体膨胀
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(torus, {
            scale: 1.8,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(rings, {
            scale: (i) => 1 + (i % 3) * 0.3,
            opacity: (i) => 0.8 - (i % 2) * 0.2,
            duration: 1,
            ease: 'sine.inOut'
          }, 0)
          .to(glow, {
            scale: 2,
            opacity: 0.9,
            duration: 1,
            ease: 'power2.out'
          }, 0)
          .to(shadow, {
            scale: 1.5,
            opacity: 0.7,
            blur: 15,
            duration: 1,
            ease: 'power2.out'
          }, 0)
        break

      case 2: // 环形体扭曲
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(torus, {
            rotateX: 360 * intensity.value,
            rotateY: 540 * intensity.value,
            skewX: 15 * intensity.value,
            duration: 1,
            ease: 'power3.inOut'
          })
          .to(rings, {
            rotateZ: (i) => 45 * i * intensity.value,
            scale: (i) => 1 + Math.sin(i) * 0.3,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
          }, 0)
          .to(glow, {
            scale: 1.6,
            opacity: 0.8,
            duration: 1,
            ease: 'power2.out'
          }, 0)
          .to(shadow, {
            scale: 1.3,
            opacity: 0.5,
            blur: 20,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
        break

      case 3: // 环形体分裂
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(torus, {
            rotateY: 720 * intensity.value,
            duration: 1,
            ease: 'power3.inOut'
          })
          .to(rings, {
            translateX: (i) => Math.cos(i * 30 * Math.PI / 180) * 60 * intensity.value,
            translateY: (i) => Math.sin(i * 30 * Math.PI / 180) * 60 * intensity.value,
            scale: (i) => 1.2 + (i % 2) * 0.3,
            opacity: (i) => 0.9 - i * 0.05,
            duration: 1,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            scale: 3,
            opacity: 1,
            filter: 'blur(40px)',
            duration: 1,
            ease: 'power3.out'
          }, 0)
          .to(shadow, {
            scale: 0.3,
            opacity: 0.1,
            blur: 30,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
        break
    }

    if (timeline) {
      torusAnimations.push(timeline)
    }
  })
}

onMounted(() => {
  initAnimations()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.sitor-images-container-270',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
    onUpdate: (self) => {
      progress.value = self.progress * 100
      torusRadius.value = 100 + self.progress * 50 * intensity.value
    }
  })
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  torusAnimations.forEach(anim => anim.kill())
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})

watch([intensity, speed], () => {
  initAnimations()
})
</script>

<style scoped>
.sitor-270 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.sitor-270::before {
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

.sitor-wrapper-270 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sitor-header-270 {
  text-align: center;
  margin-bottom: 60px;
}

.sitor-title-270 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899, #f472b6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(236, 72, 153, 0.5);
}

.sitor-controls-270 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sitor-type-btn-270 {
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

.sitor-type-btn-270:hover {
  background: rgba(236, 72, 153, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(236, 72, 153, 0.4);
}

.sitor-type-btn-270.active {
  background: linear-gradient(135deg, #ec4899, #db2777);
  border-color: #f472b6;
  color: white;
  box-shadow: 0 5px 25px rgba(236, 72, 153, 0.6);
}

.sitor-sliders-270 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sitor-slider-group-270 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sitor-slider-group-270 label {
  color: #fda4af;
  font-size: 14px;
  font-weight: 600;
}

.sitor-slider-270 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(236, 72, 153, 0.3);
  border-radius: 3px;
  outline: none;
}

.sitor-slider-270::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ec4899, #db2777);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(236, 72, 153, 0.5);
}

.sitor-info-270 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.sitor-info-270 span {
  color: #fda4af;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.sitor-images-container-270 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 60px;
  padding: 40px 0;
  perspective: 1000px;
}

.sitor-torus-wrapper-270 {
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.sitor-torus-270 {
  position: relative;
  width: 220px;
  height: 220px;
  transform-style: preserve-3d;
  transform: rotateX(-30deg) rotateY(30deg);
  transition: transform 0.1s linear;
}

.sitor-ring-270 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(236, 72, 153, 0.3);
  box-shadow: inset 0 0 15px rgba(236, 72, 153, 0.2);
  transform-origin: center;
}

.sitor-ring-image-270 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.sitor-ring-270:nth-child(1) { transform: rotateY(0deg) translateX(100px); }
.sitor-ring-270:nth-child(2) { transform: rotateY(30deg) translateX(100px); }
.sitor-ring-270:nth-child(3) { transform: rotateY(60deg) translateX(100px); }
.sitor-ring-270:nth-child(4) { transform: rotateY(90deg) translateX(100px); }
.sitor-ring-270:nth-child(5) { transform: rotateY(120deg) translateX(100px); }
.sitor-ring-270:nth-child(6) { transform: rotateY(150deg) translateX(100px); }
.sitor-ring-270:nth-child(7) { transform: rotateY(180deg) translateX(100px); }
.sitor-ring-270:nth-child(8) { transform: rotateY(210deg) translateX(100px); }
.sitor-ring-270:nth-child(9) { transform: rotateY(240deg) translateX(100px); }
.sitor-ring-270:nth-child(10) { transform: rotateY(270deg) translateX(100px); }
.sitor-ring-270:nth-child(11) { transform: rotateY(300deg) translateX(100px); }
.sitor-ring-270:nth-child(12) { transform: rotateY(330deg) translateX(100px); }

.sitor-glow-270 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0;
  pointer-events: none;
}

.sitor-shadow-270 {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(236, 72, 153, 0.4) 0%, transparent 70%);
  filter: blur(10px);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.sitor-torus-wrapper-270:hover .sitor-torus-270 {
  transform: rotateX(-15deg) rotateY(45deg) scale(1.1);
  transition: transform 0.5s ease;
}

.sitor-torus-wrapper-270:hover .sitor-glow-270 {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.sitor-progress-270 {
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

.sitor-progress-bar-270 {
  height: 100%;
  background: linear-gradient(90deg, #ec4899, #f472b6, #a855f7);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.sitor-progress-text-270 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #fda4af;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sitor-title-270 {
    font-size: 32px;
  }

  .sitor-images-container-270 {
    grid-template-columns: 1fr;
  }

  .sitor-torus-270 {
    width: 200px;
    height: 200px;
  }

  .sitor-ring-270 {
    width: 50px;
    height: 50px;
  }

  .sitor-sliders-270 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
