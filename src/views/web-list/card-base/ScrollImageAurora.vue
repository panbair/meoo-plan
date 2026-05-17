<template>
  <div class="sia-265">
    <div class="sia-wrapper-265">
      <div class="sia-header-265">
        <h2 class="sia-title-265">🌌 极光图片效果</h2>
        <div class="sia-controls-265">
          <button
            v-for="(type, index) in auroraTypes"
            :key="index"
            class="sia-type-btn-265"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="sia-sliders-265">
          <div class="sia-slider-group-265">
            <label>极光强度: {{ intensity.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="intensity"
              min="0.1"
              max="2"
              step="0.1"
              class="sia-slider-265"
            >
          </div>
          <div class="sia-slider-group-265">
            <label>流动速度: {{ speed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="speed"
              min="0.2"
              max="3"
              step="0.1"
              class="sia-slider-265"
            >
          </div>
        </div>
        <div class="sia-info-265">
          <span>类型: {{ auroraTypes[currentTypeIndex] }}</span>
          <span>极光高度: {{ auroraHeight.toFixed(0) }}%</span>
        </div>
      </div>

      <div class="sia-images-container-265">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="sia-image-wrapper-265"
          :class="`sia-type-${currentTypeIndex}-265`"
        >
          <div class="sia-aurora-curtain-265"></div>
          <div class="sia-aurora-wave-1-265"></div>
          <div class="sia-aurora-wave-2-265"></div>
          <div class="sia-aurora-wave-3-265"></div>
          <div class="sia-image-container-265">
            <img
              :src="image.src"
              :alt="image.alt"
              class="sia-image-265"
            >
            <div class="sia-aurora-overlay-265"></div>
            <div class="sia-stardust-265"></div>
          </div>
          <div class="sia-aurora-glow-265"></div>
        </div>
      </div>

      <div class="sia-progress-265">
        <div class="sia-progress-bar-265" :style="{ width: `${progress}%` }"></div>
        <span class="sia-progress-text-265">{{ progress.toFixed(0) }}%</span>
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
const auroraHeight = ref(0)

const auroraTypes = ['北极光', '南极光', '极光帷幕', '星空极光']

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '极光1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '极光2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '极光3'
  }
]

let scrollTrigger = null
let auroraAnimations = []

const changeType = (index) => {
  currentTypeIndex.value = index
  initAnimations()
}

const initAnimations = () => {
  auroraAnimations.forEach(anim => anim.kill())
  auroraAnimations = []
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('sia-image-wrapper-265')) {
      trigger.kill()
    }
  })

  const wrappers = gsap.utils.toArray('.sia-image-wrapper-265')

  wrappers.forEach((wrapper, wrapperIndex) => {
    const image = wrapper.querySelector('.sia-image-265')
    const overlay = wrapper.querySelector('.sia-aurora-overlay-265')
    const stardust = wrapper.querySelector('.sia-stardust-265')
    const curtain = wrapper.querySelector('.sia-aurora-curtain-265')
    const waves = wrapper.querySelectorAll('[class^="sia-aurora-wave-"]')
    const glow = wrapper.querySelector('.sia-aurora-glow-265')

    const baseDelay = wrapperIndex * 0.15
    const animSpeed = 1 / speed.value

    let timeline

    switch (currentTypeIndex.value) {
      case 0: // 北极光
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
            opacity: 0.7,
            filter: 'brightness(1.2) contrast(1.1) saturate(1.3)',
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(curtain, {
            opacity: 0.8,
            height: '100%',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
          .to(waves, {
            translateY: (i) => (i + 1) * -20 * intensity.value + '%',
            opacity: (i) => 0.6 - i * 0.15,
            duration: 1,
            ease: 'sine.inOut'
          }, 0)
          .to(overlay, {
            opacity: 0.5,
            mixBlendMode: 'overlay',
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            opacity: 0.6,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 1: // 南极光
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
            opacity: 0.6,
            filter: 'brightness(1.3) hue-rotate(20deg)',
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(curtain, {
            opacity: 0.7,
            height: '80%',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
          .to(waves, {
            translateY: (i) => (i + 1) * 25 * intensity.value + '%',
            scaleY: (i) => 1.2 - i * 0.1,
            duration: 1,
            ease: 'sine.inOut'
          }, 0)
          .to(overlay, {
            opacity: 0.4,
            mixBlendMode: 'screen',
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(stardust, {
            scale: 1.5,
            opacity: 0.8,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            opacity: 0.5,
            filter: 'blur(20px)',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 2: // 极光帷幕
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
            opacity: 0.5,
            filter: 'blur(2px) brightness(1.4)',
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(curtain, {
            opacity: 0.9,
            height: '120%',
            scaleY: 1.5 * intensity.value,
            duration: 1,
            ease: 'power3.inOut'
          }, 0)
          .to(waves, {
            translateY: (i) => Math.sin(i) * 30 * intensity.value + '%',
            scaleX: (i) => 1.3 - i * 0.1,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
          }, 0)
          .to(overlay, {
            opacity: 0.6,
            mixBlendMode: 'multiply',
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            opacity: 0.7,
            scaleY: 1.8,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 3: // 星空极光
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
            filter: 'brightness(1.5) contrast(1.3)',
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(curtain, {
            opacity: 0.5,
            height: '100%',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
          .to(waves, {
            translateY: (i) => (i + 1) * 15 * intensity.value + '%',
            opacity: (i) => 0.7 - i * 0.1,
            duration: 1,
            ease: 'sine.inOut'
          }, 0)
          .to(overlay, {
            opacity: 0.5,
            mixBlendMode: 'color-dodge',
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(stardust, {
            scale: 2,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            opacity: 0.8,
            filter: 'blur(25px)',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break
    }

    if (timeline) {
      auroraAnimations.push(timeline)
    }
  })
}

onMounted(() => {
  initAnimations()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.sia-images-container-265',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
    onUpdate: (self) => {
      progress.value = self.progress * 100
      auroraHeight.value = self.progress * 100
    }
  })
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  auroraAnimations.forEach(anim => anim.kill())
})

watch([intensity, speed], () => {
  initAnimations()
})
</script>

<style scoped>
.sia-265 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.sia-265::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.sia-wrapper-265 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sia-header-265 {
  text-align: center;
  margin-bottom: 60px;
}

.sia-title-265 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
}

.sia-controls-265 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sia-type-btn-265 {
  padding: 12px 24px;
  background: rgba(16, 185, 129, 0.2);
  border: 2px solid rgba(16, 185, 129, 0.4);
  border-radius: 25px;
  color: #6ee7b7;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sia-type-btn-265:hover {
  background: rgba(16, 185, 129, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
}

.sia-type-btn-265.active {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #34d399;
  color: white;
  box-shadow: 0 5px 25px rgba(16, 185, 129, 0.6);
}

.sia-sliders-265 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.sia-slider-group-265 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sia-slider-group-265 label {
  color: #6ee7b7;
  font-size: 14px;
  font-weight: 600;
}

.sia-slider-265 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(16, 185, 129, 0.3);
  border-radius: 3px;
  outline: none;
}

.sia-slider-265::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.5);
}

.sia-info-265 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.sia-info-265 span {
  color: #6ee7b7;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.sia-images-container-265 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  padding: 40px 0;
}

.sia-image-wrapper-265 {
  position: relative;
  width: 100%;
  aspect-ratio: 3/2;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
}

.sia-aurora-curtain-265 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0%;
  background: linear-gradient(
    180deg,
    rgba(16, 185, 129, 0.4) 0%,
    rgba(6, 182, 212, 0.3) 50%,
    rgba(139, 92, 246, 0.2) 100%
  );
  opacity: 0;
  pointer-events: none;
}

.sia-aurora-wave-1-265,
.sia-aurora-wave-2-265,
.sia-aurora-wave-3-265 {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(16, 185, 129, 0.3) 25%,
    rgba(6, 182, 212, 0.3) 50%,
    rgba(16, 185, 129, 0.3) 75%,
    transparent 100%
  );
  transform: translateY(-50%);
  opacity: 0;
  filter: blur(10px);
}

.sia-aurora-wave-1-265 {
  top: 30%;
}

.sia-aurora-wave-2-265 {
  top: 50%;
}

.sia-aurora-wave-3-265 {
  top: 70%;
}

.sia-image-container-265 {
  position: relative;
  width: 100%;
  height: 100%;
}

.sia-image-265 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.sia-aurora-overlay-265 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.2) 0%,
    rgba(6, 182, 212, 0.2) 50%,
    rgba(139, 92, 246, 0.2) 100%
  );
  opacity: 0;
}

.sia-stardust-265 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
    radial-gradient(circle at 30% 80%, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
    radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.6) 1px, transparent 1px);
  background-size: 60px 60px, 70px 70px, 80px 80px, 50px 50px, 90px 90px;
  opacity: 0.6;
}

.sia-aurora-glow-265 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
  opacity: 0;
  pointer-events: none;
}

.sia-image-wrapper-265:hover .sia-aurora-glow-265 {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.sia-progress-265 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  height: 8px;
  background: rgba(16, 185, 129, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.sia-progress-bar-265 {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.sia-progress-text-265 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #6ee7b7;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sia-title-265 {
    font-size: 32px;
  }

  .sia-images-container-265 {
    grid-template-columns: 1fr;
  }

  .sia-sliders-265 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
