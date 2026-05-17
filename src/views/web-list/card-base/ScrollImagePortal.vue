<template>
  <div class="siportal-263">
    <div class="siportal-wrapper-263">
      <div class="siportal-header-263">
        <h2 class="siportal-title-263">🌀 时空传送门</h2>
        <div class="siportal-controls-263">
          <button
            v-for="(type, index) in portalTypes"
            :key="index"
            class="siportal-type-btn-263"
            :class="{ active: currentTypeIndex === index }"
            @click="changeType(index)"
          >
            {{ type }}
          </button>
        </div>
        <div class="siportal-sliders-263">
          <div class="siportal-slider-group-263">
            <label>传送强度: {{ intensity.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="intensity"
              min="0.1"
              max="2"
              step="0.1"
              class="siportal-slider-263"
            >
          </div>
          <div class="siportal-slider-group-263">
            <label>动画速度: {{ speed.toFixed(1) }}x</label>
            <input
              type="range"
              v-model.number="speed"
              min="0.2"
              max="3"
              step="0.1"
              class="siportal-slider-263"
            >
          </div>
        </div>
        <div class="siportal-info-263">
          <span>类型: {{ portalTypes[currentTypeIndex] }}</span>
          <span>传送深度: {{ portalDepth.toFixed(0) }}%</span>
        </div>
      </div>

      <div class="siportal-images-container-263">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="siportal-image-wrapper-263"
          :class="`siportal-type-${currentTypeIndex}-263`"
        >
          <div class="siportal-portal-ring-263 siportal-ring-1-263"></div>
          <div class="siportal-portal-ring-263 siportal-ring-2-263"></div>
          <div class="siportal-portal-ring-263 siportal-ring-3-263"></div>
          <div class="siportal-portal-center-263">
            <img
              :src="image.src"
              :alt="image.alt"
              class="siportal-image-263"
            >
            <div class="siportal-vortex-263"></div>
            <div class="siportal-energy-263"></div>
            <div class="siportal-particles-263"></div>
          </div>
          <div class="siportal-glow-263"></div>
        </div>
      </div>

      <div class="siportal-progress-263">
        <div class="siportal-progress-bar-263" :style="{ width: `${progress}%` }"></div>
        <span class="siportal-progress-text-263">{{ progress.toFixed(0) }}%</span>
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
const portalDepth = ref(0)

const portalTypes = ['漩涡传送', '虫洞跳跃', '空间折叠', '维度穿越']

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '传送1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '传送2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '传送3'
  }
]

let scrollTrigger = null
let portalAnimations = []

const changeType = (index) => {
  currentTypeIndex.value = index
  initAnimations()
}

const initAnimations = () => {
  // 清除现有动画和ScrollTrigger
  portalAnimations.forEach(anim => anim.kill())
  portalAnimations = []
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger.classList && trigger.trigger.classList.contains('siportal-image-wrapper-263')) {
      trigger.kill()
    }
  })

  const wrappers = gsap.utils.toArray('.siportal-image-wrapper-263')

  wrappers.forEach((wrapper, wrapperIndex) => {
    const image = wrapper.querySelector('.siportal-image-263')
    const vortex = wrapper.querySelector('.siportal-vortex-263')
    const energy = wrapper.querySelector('.siportal-energy-263')
    const particles = wrapper.querySelector('.siportal-particles-263')
    const rings = wrapper.querySelectorAll('.siportal-portal-ring-263')
    const glow = wrapper.querySelector('.siportal-glow-263')

    const baseDelay = wrapperIndex * 0.15
    const animSpeed = 1 / speed.value

    // 根据类型创建不同动画
    let timeline

    switch (currentTypeIndex.value) {
      case 0: // 漩涡传送
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
            rotate: 360 * 2 * intensity.value,
            opacity: 0.5,
            duration: 1,
            ease: 'power2.inOut'
          })
          .to(vortex, {
            scale: 3 * intensity.value,
            rotate: -720,
            opacity: 0.8,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(rings, {
            scale: (i) => (1 + i * 0.5) * intensity.value,
            rotate: (i) => 360 * (i + 1) * 2,
            opacity: (i) => 0.9 - i * 0.2,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
          .to(energy, {
            scale: 2 * intensity.value,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            scale: 2.5,
            opacity: 0.8,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 1: // 虫洞跳跃
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
            scale: 4,
            opacity: 0.2,
            filter: 'blur(8px)',
            duration: 1,
            ease: 'power4.in'
          })
          .to(vortex, {
            scale: 5,
            rotate: 1080,
            duration: 1,
            ease: 'power4.in'
          }, 0)
          .to(rings, {
            scale: (i) => (2 + i) * intensity.value,
            borderWidth: (i) => (3 - i) + 'px',
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
          }, 0)
          .to(energy, {
            scale: 6 * intensity.value,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in'
          }, 0)
          .to(particles, {
            scale: 3,
            opacity: 0,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            scale: 8,
            opacity: 1,
            duration: 1,
            ease: 'power2.in'
          }, 0)
        break

      case 2: // 空间折叠
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
            scaleX: 0.1,
            scaleY: 3,
            skewY: 15 * intensity.value,
            opacity: 0.6,
            duration: 1,
            ease: 'power3.inOut'
          })
          .to(vortex, {
            scaleX: 4,
            scaleY: 0.3,
            rotate: 180,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(rings, {
            scaleX: (i) => (i + 1) * 2 * intensity.value,
            scaleY: (i) => 0.2 + i * 0.1,
            rotate: (i) => 90 + i * 45,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
          }, 0)
          .to(energy, {
            scaleX: 5,
            scaleY: 0.4,
            duration: 0.75,
            ease: 'elastic.out(1, 0.5)'
          }, 0)
          .to(glow, {
            scaleX: 6,
            scaleY: 0.5,
            opacity: 0.7,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break

      case 3: // 维度穿越
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
            scale: 0.1,
            opacity: 0,
            filter: 'blur(20px) brightness(2)',
            duration: 1,
            ease: 'power4.inOut'
          })
          .to(vortex, {
            scale: 6,
            rotate: -1440,
            duration: 1,
            ease: 'power2.inOut'
          }, 0)
          .to(rings, {
            scale: (i) => (3 + i) * intensity.value,
            rotate: (i) => 360 * (i + 2),
            opacity: (i) => 1 - i * 0.15,
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
          .to(energy, {
            scale: 8 * intensity.value,
            opacity: 0.5,
            duration: 0.5,
            ease: 'power3.out'
          }, 0)
          .to(particles, {
            scale: 4,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            scale: 10,
            opacity: 0.3,
            filter: 'blur(40px)',
            duration: 1,
            ease: 'power1.inOut'
          }, 0)
        break
    }

    if (timeline) {
      portalAnimations.push(timeline)
    }
  })
}

onMounted(() => {
  initAnimations()

  scrollTrigger = ScrollTrigger.create({
    trigger: '.siportal-images-container-263',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
    onUpdate: (self) => {
      progress.value = self.progress * 100
      portalDepth.value = self.progress * 100
    }
  })
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  portalAnimations.forEach(anim => anim.kill())
})

watch([intensity, speed], () => {
  initAnimations()
})
</script>

<style scoped>
.siportal-263 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.siportal-263::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(75, 0, 130, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.siportal-wrapper-263 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.siportal-header-263 {
  text-align: center;
  margin-bottom: 60px;
}

.siportal-title-263 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
}

.siportal-controls-263 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.siportal-type-btn-263 {
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

.siportal-type-btn-263:hover {
  background: rgba(139, 92, 246, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(139, 92, 246, 0.4);
}

.siportal-type-btn-263.active {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-color: #a78bfa;
  color: white;
  box-shadow: 0 5px 25px rgba(139, 92, 246, 0.6);
}

.siportal-sliders-263 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.siportal-slider-group-263 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.siportal-slider-group-263 label {
  color: #a78bfa;
  font-size: 14px;
  font-weight: 600;
}

.siportal-slider-263 {
  width: 200px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(139, 92, 246, 0.3);
  border-radius: 3px;
  outline: none;
}

.siportal-slider-263::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.5);
}

.siportal-info-263 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.siportal-info-263 span {
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.siportal-images-container-263 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  padding: 40px 0;
}

.siportal-image-wrapper-263 {
  position: relative;
  width: 100%;
  aspect-ratio: 3/2;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
}

.siportal-portal-ring-263 {
  position: absolute;
  border: 3px solid;
  border-radius: 50%;
  opacity: 0;
  filter: blur(2px);
}

.siportal-ring-1-263 {
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  transform: translate(-50%, -50%);
  border-color: rgba(139, 92, 246, 0.8);
}

.siportal-ring-2-263 {
  top: 50%;
  left: 50%;
  width: 140%;
  height: 140%;
  transform: translate(-50%, -50%);
  border-color: rgba(6, 182, 212, 0.6);
}

.siportal-ring-3-263 {
  top: 50%;
  left: 50%;
  width: 160%;
  height: 160%;
  transform: translate(-50%, -50%);
  border-color: rgba(236, 72, 153, 0.4);
}

.siportal-portal-center-263 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.siportal-image-263 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.siportal-vortex-263 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg,
    rgba(139, 92, 246, 0.3),
    rgba(6, 182, 212, 0.3),
    rgba(236, 72, 153, 0.3),
    rgba(139, 92, 246, 0.3)
  );
  border-radius: 50%;
  opacity: 0.5;
}

.siportal-energy-263 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  height: 60%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  filter: blur(20px);
}

.siportal-particles-263 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.6) 1px, transparent 1px);
  background-size: 50px 50px, 60px 60px, 70px 70px;
  opacity: 0.3;
}

.siportal-glow-263 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  filter: blur(30px);
  pointer-events: none;
}

.siportal-image-wrapper-263:hover .siportal-glow-263 {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.siportal-progress-263 {
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

.siportal-progress-bar-263 {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4, #ec4899);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.siportal-progress-text-263 {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .siportal-title-263 {
    font-size: 32px;
  }

  .siportal-images-container-263 {
    grid-template-columns: 1fr;
  }

  .siportal-sliders-263 {
    flex-direction: column;
    align-items: center;
  }
}
</style>
