<template>
  <div class="siv-266">
    <div class="siv-wrapper-266">
      <div class="siv-header-266">
        <h2 class="siv-title-266">🌀 漩涡图片效果</h2>
        <div class="siv-controls-266">
          <button
            v-for="(type, index) in vortexTypes"
            :key="index"
            class="siv-type-btn-266"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="siv-sliders-266">
          <div class="siv-slider-group-266">
            <label>漩涡强度: {{ intensity.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="intensity"
              min="0.1"
              max="2"
              step="0.1"
              class="siv-slider-266"
            >
          </div>
          <div class="siv-slider-group-266">
            <label>旋转速度: {{ speed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="speed"
              min="0.2"
              max="3"
              step="0.1"
              class="siv-slider-266"
            >
          </div>
        </div>
        <div class="siv-info-266">
          <span>类型: {{ vortexTypes[currentTypeIndex] }}</span>
          <span>漩涡深度: {{ vortexDepth.toFixed(0) }}%</span>
        </div>
      </div>

      <div class="siv-images-container-266">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="siv-image-wrapper-266"
          :class="`siv-type-${currentTypeIndex}-266`"
        >
          <div class="siv-vortex-core-266"></div>
          <div class="siv-spiral-1-266"></div>
          <div class="siv-spiral-2-266"></div>
          <div class="siv-spiral-3-266"></div>
          <div class="siv-image-container-266">
            <img
              :src="image.src"
              :alt="image.alt"
              class="siv-image-266"
            >
            <div class="siv-distortion-266"></div>
            <div class="siv-ripple-266"></div>
          </div>
          <div class="siv-vortex-glow-266"></div>
        </div>
      </div>

      <div class="siv-progress-266">
        <div class="siv-progress-bar-266" :style="{ width: `${progress}%` }"></div>
        <span class="siv-progress-text-266">{{ progress.toFixed(0) }}%</span>
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
const vortexDepth = ref(0)

const vortexTypes = ['黑洞漩涡', '星系漩涡', '水漩涡', '能量漩涡']

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '漩涡1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '漩涡2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '漩涡3'
  }
]

let scrollTrigger = null
let vortexAnimations = []

const changeType = (index) => {
  currentTypeIndex.value = index
  initAnimations()
}

const initAnimations = () => {
  vortexAnimations.forEach(anim => anim.kill())
  vortexAnimations = []
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('siv-image-wrapper-266')) {
      trigger.kill()
    }
  })

  const wrappers = gsap.utils.toArray('.siv-image-wrapper-266')

  wrappers.forEach((wrapper, wrapperIndex) => {
    const image = wrapper.querySelector('.siv-image-266')
    const distortion = wrapper.querySelector('.siv-distortion-266')
    const ripple = wrapper.querySelector('.siv-ripple-266')
    const core = wrapper.querySelector('.siv-vortex-core-266')
    const spirals = wrapper.querySelectorAll('[class^="siv-spiral-"]')
    const glow = wrapper.querySelector('.siv-vortex-glow-266')

    const baseDelay = wrapperIndex * 0.15
    const animSpeed = 1 / speed.value

    let timeline

    switch (currentTypeIndex.value) {
      case 0: // 黑洞漩涡
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(image, {
            scale: 0.3,
            rotate: 720 * intensity.value,
            opacity: 0.5,
            filter: 'blur(6px) brightness(0.5)',
            duration: 1,
            ease: 'power4.inOut'
          })
          .to(core, {
            scale: 0.1,
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(spirals, {
            scale: (i) => (1.5 + i * 0.5) * intensity.value,
            rotate: (i) => 360 * (i + 2) * intensity.value,
            opacity: (i) => 0.7 - i * 0.2,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(distortion, {
            scale: 2,
            opacity: 0.8,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            scale: 3,
            opacity: 0.6,
            filter: 'blur(30px)',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 1: // 星系漩涡
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(image, {
            scale: 0.8,
            rotate: 540 * intensity.value,
            opacity: 0.6,
            filter: 'brightness(1.3) contrast(1.2)',
            duration: 1,
            ease: 'power3.inOut'
          })
          .to(core, {
            scale: 0.5,
            opacity: 0.8,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(spirals, {
            scale: (i) => (1.3 + i * 0.3) * intensity.value,
            rotate: (i) => 360 * (i + 1.5) * intensity.value,
            opacity: (i) => 0.6 - i * 0.15,
            duration: 1,
            ease: 'sine.inOut'
          }, 0)
          .to(ripple, {
            scale: 2.5,
            opacity: 0.7,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            scale: 2.5,
            opacity: 0.7,
            filter: 'blur(25px)',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 2: // 水漩涡
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(image, {
            scale: 0.6,
            rotate: 360 * intensity.value,
            opacity: 0.7,
            filter: 'blur(3px) saturate(1.4)',
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(core, {
            scale: 0.3,
            opacity: 0.6,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
          }, 0)
          .to(spirals, {
            scale: (i) => (1.2 + i * 0.4) * intensity.value,
            rotate: (i) => 360 * (i + 1) * intensity.value,
            opacity: (i) => 0.5 - i * 0.1,
            duration: 1,
            ease: 'sine.inOut'
          }, 0)
          .to(distortion, {
            scale: 1.8,
            opacity: 0.6,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(ripple, {
            scale: 3,
            opacity: 0.8,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            scale: 2.2,
            opacity: 0.5,
            filter: 'blur(20px)',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 3: // 能量漩涡
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
        timeline
          .to(image, {
            scale: 0.4,
            rotate: 900 * intensity.value,
            opacity: 0.4,
            filter: 'blur(8px) brightness(2)',
            duration: 1,
            ease: 'power4.inOut'
          })
          .to(core, {
            scale: 0.05,
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(spirals, {
            scale: (i) => (1.8 + i * 0.6) * intensity.value,
            rotate: (i) => 360 * (i + 3) * intensity.value,
            opacity: (i) => 0.8 - i * 0.2,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(distortion, {
            scale: 2.5,
            opacity: 0.9,
            duration: 0.75,
            ease: 'power3.out'
          }, 0)
          .to(glow, {
            scale: 4,
            opacity: 0.8,
            filter: 'blur(40px)',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break
    }

    if (timeline) {
      vortexAnimations.push(timeline)
    }
  })
}

onMounted(() => {
  initAnimations()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.siv-images-container-266',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
    onUpdate: (self) => {
      progress.value = self.progress * 100
      vortexDepth.value = self.progress * 100
    }
  })
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  vortexAnimations.forEach(anim => anim.kill())
})

watch([intensity, speed], () => {
  initAnimations()
})
</script>

<style scoped>
.siv-266 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.siv-266::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.siv-wrapper-266 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.siv-header-266 {
  text-align: center;
  margin-bottom: 60px;
}

.siv-title-266 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
}

.siv-controls-266 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.siv-type-btn-266 {
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

.siv-type-btn-266:hover {
  background: rgba(139, 92, 246, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(139, 92, 246, 0.4);
}

.siv-type-btn-266.active {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border-color: #c4b5fd;
  color: white;
  box-shadow: 0 5px 25px rgba(139, 92, 246, 0.6);
}

.siv-sliders-266 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.siv-slider-group-266 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.siv-slider-group-266 label {
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 600;
}

.siv-slider-266 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(139, 92, 246, 0.3);
  border-radius: 3px;
  outline: none;
}

.siv-slider-266::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.5);
}

.siv-info-266 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.siv-info-266 span {
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.siv-images-container-266 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  padding: 40px 0;
}

.siv-image-wrapper-266 {
  position: relative;
  width: 100%;
  aspect-ratio: 3/2;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
}

.siv-vortex-core-266 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  height: 30%;
  background: radial-gradient(circle, rgba(139, 92, 246, 1) 0%, rgba(99, 102, 241, 0.8) 50%, transparent 70%);
  border-radius: 50%;
  opacity: 0.6;
  filter: blur(5px);
}

.siv-spiral-1-266,
.siv-spiral-2-266,
.siv-spiral-3-266 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid;
  opacity: 0;
}

.siv-spiral-1-266 {
  width: 60%;
  height: 60%;
  border-color: rgba(139, 92, 246, 0.6);
}

.siv-spiral-2-266 {
  width: 80%;
  height: 80%;
  border-color: rgba(6, 182, 212, 0.5);
}

.siv-spiral-3-266 {
  width: 100%;
  height: 100%;
  border-color: rgba(168, 85, 247, 0.4);
}

.siv-image-container-266 {
  position: relative;
  width: 100%;
  height: 100%;
}

.siv-image-266 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.siv-distortion-266 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(139, 92, 246, 0.3) 90deg,
    transparent 180deg,
    rgba(6, 182, 212, 0.3) 270deg,
    transparent 360deg
  );
  opacity: 0;
}

.siv-ripple-266 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  border-radius: 50%;
  border: 3px solid rgba(139, 92, 246, 0.5);
  opacity: 0;
}

.siv-vortex-glow-266 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  opacity: 0;
  pointer-events: none;
}

.siv-image-wrapper-266:hover .siv-vortex-glow-266 {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.siv-progress-266 {
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

.siv-progress-bar-266 {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #a855f7, #6366f1);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.siv-progress-text-266 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .siv-title-266 {
    font-size: 32px;
  }

  .siv-images-container-266 {
    grid-template-columns: 1fr;
  }

  .siv-sliders-266 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
