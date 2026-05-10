<template>
  <div class="siq-264">
    <div class="siq-wrapper-264">
      <div class="siq-header-264">
        <h2 class="siq-title-264">⚛️ 量子态图片</h2>
        <div class="siq-controls-264">
          <button
            v-for="(type, index) in quantumTypes"
            :key="index"
            class="siq-type-btn-264"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="siq-sliders-264">
          <div class="siq-slider-group-264">
            <label>量子强度: {{ intensity.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="intensity"
              min="0.1"
              max="2"
              step="0.1"
              class="siq-slider-264"
            >
          </div>
          <div class="siq-slider-group-264">
            <label>态变速度: {{ speed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="speed"
              min="0.2"
              max="3"
              step="0.1"
              class="siq-slider-264"
            >
          </div>
        </div>
        <div class="siq-info-264">
          <span>类型: {{ quantumTypes[currentTypeIndex] }}</span>
          <span>叠加态: {{ superposition.toFixed(0) }}%</span>
        </div>
      </div>

      <div class="siq-images-container-264">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="siq-image-wrapper-264"
          :class="`siq-type-${currentTypeIndex}-264`"
        >
          <div class="siq-wave-1-264"></div>
          <div class="siq-wave-2-264"></div>
          <div class="siq-wave-3-264"></div>
          <div class="siq-particle-layer-264"></div>
          <div class="siq-image-container-264">
            <img
              :src="image.src"
              :alt="image.alt"
              class="siq-image-264"
            >
            <div class="siq-entanglement-264"></div>
            <div class="siq-tunneling-264"></div>
            <div class="siq-coherence-264"></div>
          </div>
          <div class="siq-quantum-glow-264"></div>
        </div>
      </div>

      <div class="siq-progress-264">
        <div class="siq-progress-bar-264" :style="{ width: `${progress}%` }"></div>
        <span class="siq-progress-text-264">{{ progress.toFixed(0) }}%</span>
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
const superposition = ref(0)

const quantumTypes = ['叠加态', '纠缠态', '隧穿效应', '相干态']

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '量子1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '量子2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '量子3'
  }
]

let scrollTrigger = null
let quantumAnimations = []

const changeType = (index) => {
  currentTypeIndex.value = index
  initAnimations()
}

const initAnimations = () => {
  quantumAnimations.forEach(anim => anim.kill())
  quantumAnimations = []
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('siq-image-wrapper-264')) {
      trigger.kill()
    }
  })

  const wrappers = gsap.utils.toArray('.siq-image-wrapper-264')

  wrappers.forEach((wrapper, wrapperIndex) => {
    const image = wrapper.querySelector('.siq-image-264')
    const entanglement = wrapper.querySelector('.siq-entanglement-264')
    const tunneling = wrapper.querySelector('.siq-tunneling-264')
    const coherence = wrapper.querySelector('.siq-coherence-264')
    const waves = wrapper.querySelectorAll('[class^="siq-wave-"]')
    const glow = wrapper.querySelector('.siq-quantum-glow-264')

    const baseDelay = wrapperIndex * 0.15
    const animSpeed = 1 / speed.value

    let timeline

    switch (currentTypeIndex.value) {
      case 0: // 叠加态
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
            opacity: 0.4,
            filter: 'blur(4px) contrast(1.5)',
            scale: 1.1,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(waves, {
            scale: (i) => (1.5 + i * 0.5) * intensity.value,
            opacity: (i) => 0.6 - i * 0.15,
            duration: 1,
            ease: 'sine.inOut'
          }, 0)
          .to(coherence, {
            scale: 2,
            opacity: 0.8,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            scale: 1.8,
            opacity: 0.6,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 1: // 纠缠态
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
            scaleX: 1.5,
            skewX: 10 * intensity.value,
            opacity: 0.6,
            filter: 'hue-rotate(90deg)',
            duration: 1,
            ease: 'power3.inOut'
          })
          .to(entanglement, {
            scale: 2.5,
            rotate: 180,
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(waves, {
            scale: (i) => (1.2 + i * 0.3) * intensity.value,
            rotate: (i) => 45 + i * 30,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
          }, 0)
          .to(glow, {
            scale: 2,
            filter: 'hue-rotate(180deg)',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 2: // 隧穿效应
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
            translateX: '50%',
            scale: 0.8,
            opacity: 0.3,
            filter: 'blur(10px)',
            duration: 1,
            ease: 'power4.inOut'
          })
          .to(tunneling, {
            scale: 3 * intensity.value,
            opacity: 0.9,
            duration: 0.5,
            ease: 'power3.out'
          }, 0)
          .to(waves, {
            scale: (i) => 2 - i * 0.3,
            opacity: (i) => 0.8 - i * 0.2,
            translateX: (i) => (i + 1) * 30 * intensity.value + '%',
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(coherence, {
            scale: 1.5,
            opacity: 0,
            duration: 0.75,
            ease: 'power2.in'
          }, 0)
          .to(glow, {
            scale: 2.5,
            opacity: 0.4,
            filter: 'blur(20px)',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 3: // 相干态
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
            scale: 1.3,
            opacity: 0.7,
            filter: 'brightness(1.3) contrast(1.2)',
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(coherence, {
            scale: 3 * intensity.value,
            rotate: 360,
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(waves, {
            scale: (i) => (1.3 + i * 0.2) * intensity.value,
            opacity: (i) => 0.7 - i * 0.1,
            rotate: (i) => i * 60,
            duration: 1,
            ease: 'sine.inOut'
          }, 0)
          .to(entanglement, {
            scale: 1.8,
            opacity: 0.6,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            scale: 2.2,
            opacity: 0.7,
            filter: 'blur(15px)',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break
    }

    if (timeline) {
      quantumAnimations.push(timeline)
    }
  })
}

onMounted(() => {
  initAnimations()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.siq-images-container-264',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
    onUpdate: (self) => {
      progress.value = self.progress * 100
      superposition.value = self.progress * 100
    }
  })
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  quantumAnimations.forEach(anim => anim.kill())
})

watch([intensity, speed], () => {
  initAnimations()
})
</script>

<style scoped>
.siq-264 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.siq-264::before {
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

.siq-wrapper-264 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.siq-header-264 {
  text-align: center;
  margin-bottom: 60px;
}

.siq-title-264 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
}

.siq-controls-264 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.siq-type-btn-264 {
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

.siq-type-btn-264:hover {
  background: rgba(139, 92, 246, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(139, 92, 246, 0.4);
}

.siq-type-btn-264.active {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-color: #a78bfa;
  color: white;
  box-shadow: 0 5px 25px rgba(139, 92, 246, 0.6);
}

.siq-sliders-264 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.siq-slider-group-264 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.siq-slider-group-264 label {
  color: #a78bfa;
  font-size: 14px;
  font-weight: 600;
}

.siq-slider-264 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(139, 92, 246, 0.3);
  border-radius: 3px;
  outline: none;
}

.siq-slider-264::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.5);
}

.siq-info-264 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.siq-info-264 span {
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.siq-images-container-264 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  padding: 40px 0;
}

.siq-image-wrapper-264 {
  position: relative;
  width: 100%;
  aspect-ratio: 3/2;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
}

.siq-wave-1-264,
.siq-wave-2-264,
.siq-wave-3-264 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid;
  opacity: 0;
}

.siq-wave-1-264 {
  width: 110%;
  height: 110%;
  border-color: rgba(139, 92, 246, 0.6);
}

.siq-wave-2-264 {
  width: 125%;
  height: 125%;
  border-color: rgba(6, 182, 212, 0.5);
}

.siq-wave-3-264 {
  width: 140%;
  height: 140%;
  border-color: rgba(16, 185, 129, 0.4);
}

.siq-particle-layer-264 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.4) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.4) 1px, transparent 1px),
    radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.4) 1px, transparent 1px);
  background-size: 40px 40px, 50px 50px, 60px 60px;
  opacity: 0.5;
}

.siq-image-container-264 {
  position: relative;
  width: 100%;
  height: 100%;
}

.siq-image-264 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.siq-entanglement-264 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(139, 92, 246, 0.3) 0%,
    rgba(6, 182, 212, 0.3) 50%,
    rgba(139, 92, 246, 0.3) 100%
  );
  opacity: 0;
}

.siq-tunneling-264 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  filter: blur(10px);
}

.siq-coherence-264 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border: 3px solid rgba(139, 92, 246, 0.6);
  border-radius: 50%;
  opacity: 0;
}

.siq-quantum-glow-264 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
  opacity: 0;
  pointer-events: none;
}

.siq-image-wrapper-264:hover .siq-quantum-glow-264 {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.siq-progress-264 {
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

.siq-progress-bar-264 {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4, #10b981);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.siq-progress-text-264 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .siq-title-264 {
    font-size: 32px;
  }

  .siq-images-container-264 {
    grid-template-columns: 1fr;
  }

  .siq-sliders-264 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
