<template>
  <div class="comparison-section-67">
    <div class="ic-header-67">
      <h2 class="ic-title-67">图片对比</h2>
      <p class="ic-subtitle-67">Before / After Comparison</p>
    </div>

    <div class="comparison-container-67">
      <div class="comparison-item-67" v-for="(item, index) in comparisons" :key="index">
        <div class="comparison-label-67">{{ item.label }}</div>
        <div class="comparison-wrapper-67" ref="comparisonRef" @mousemove="handleMouseMove($event, index)" @mouseleave="handleMouseLeave(index)">
          <div class="comparison-image-67" :style="{ backgroundImage: `url(${item.after})` }"></div>
          <div class="comparison-overlay-67" ref="overlayRef" :style="{ width: sliderPosition[index] + '%', backgroundImage: `url(${item.before})` }"></div>
          <div class="comparison-slider-67" ref="sliderRef" :style="{ left: sliderPosition[index] + '%' }">
            <div class="slider-button-67">
              <span class="slider-arrow-left-67">◀</span>
              <span class="slider-arrow-right-67">▶</span>
            </div>
          </div>
          <div class="comparison-labels-67">
            <span class="label-before-67">Before</span>
            <span class="label-after-67">After</span>
          </div>
        </div>
      </div>
    </div>

    <div class="ic-controls-67">
      <button class="ic-btn-67" @click="resetSliders">重置</button>
      <button class="ic-btn-67" @click="autoPlay">自动播放</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const comparisonRef = ref<HTMLElement[]>([])
const overlayRef = ref<HTMLElement[]>([])
const sliderRef = ref<HTMLElement[]>([])
const sliderPosition = ref([50, 50, 50])
let autoPlayInterval: number | null = null
let ctx: gsap.Context

const comparisons = [
  {
    label: '照片处理',
    before: new URL('@/assets/image/1.png', import.meta.url).href,
    after: new URL('@/assets/image/2.png', import.meta.url).href
  },
  {
    label: '色彩调整',
    before: new URL('@/assets/image/3.png', import.meta.url).href,
    after: new URL('@/assets/image/4.png', import.meta.url).href
  },
  {
    label: '滤镜效果',
    before: new URL('@/assets/image/5.png', import.meta.url).href,
    after: new URL('@/assets/image/6.png', import.meta.url).href
  }
]

const handleMouseMove = (event: MouseEvent, index: number) => {
  const wrapper = comparisonRef.value[index]
  if (!wrapper) return

  const rect = wrapper.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = (x / rect.width) * 100
  sliderPosition.value[index] = Math.max(0, Math.min(100, percentage))

  if (sliderRef.value[index]) {
    gsap.to(sliderRef.value[index], {
      left: percentage + '%',
      duration: 0.1,
      ease: 'none'
    })
  }

  if (overlayRef.value[index]) {
    gsap.to(overlayRef.value[index], {
      width: percentage + '%',
      duration: 0.1,
      ease: 'none'
    })
  }
}

const handleMouseLeave = (index: number) => {
  sliderPosition.value[index] = 50
  if (sliderRef.value[index]) {
    gsap.to(sliderRef.value[index], {
      left: '50%',
      duration: 0.4,
      ease: 'power2.out'
    })
  }
  if (overlayRef.value[index]) {
    gsap.to(overlayRef.value[index], {
      width: '50%',
      duration: 0.4,
      ease: 'power2.out'
    })
  }
}

const resetSliders = () => {
  sliderPosition.value.forEach((_, i) => {
    sliderPosition.value[i] = 50
    if (sliderRef.value[i]) {
      gsap.to(sliderRef.value[i], {
        left: '50%',
        duration: 0.4,
        ease: 'power2.out'
      })
    }
    if (overlayRef.value[i]) {
      gsap.to(overlayRef.value[i], {
        width: '50%',
        duration: 0.4,
        ease: 'power2.out'
      })
    }
  })
}

const autoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  } else {
    let direction = 1
    autoPlayInterval = window.setInterval(() => {
      sliderPosition.value.forEach((pos, i) => {
        const newPos = pos + direction * 2
        if (newPos >= 100) {
          sliderPosition.value[i] = 100
          direction = -1
        } else if (newPos <= 0) {
          sliderPosition.value[i] = 0
          direction = 1
        } else {
          sliderPosition.value[i] = newPos
          if (sliderRef.value[i]) {
            sliderRef.value[i].style.left = newPos + '%'
          }
          if (overlayRef.value[i]) {
            overlayRef.value[i].style.width = newPos + '%'
          }
        }
      })
    }, 20)
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.ic-title-67', {
      scrollTrigger: { trigger: '.comparison-section-67', start: 'top 80%' },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    gsap.from('.ic-subtitle-67', {
      scrollTrigger: { trigger: '.comparison-section-67', start: 'top 75%' },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    gsap.from('.comparison-item-67', {
      scrollTrigger: { trigger: '.comparison-container-67', start: 'top 70%' },
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out'
    })

    gsap.from('.comparison-label-67', {
      scrollTrigger: { trigger: '.comparison-container-67', start: 'top 65%' },
      y: 20,
      opacity: 0,
      stagger: 0.15,
      delay: 0.1,
      duration: 0.5,
      ease: 'power3.out'
    })

    gsap.from('.ic-btn-67', {
      scrollTrigger: { trigger: '.ic-controls-67', start: 'top 90%' },
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power3.out'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})
</script>

<style scoped lang="scss">
.comparison-section-67 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(180deg, #141e30 0%, #243b55 50%, #141e30 100%);
}

.ic-header-67 {
  text-align: center;
  margin-bottom: 60px;
}

.ic-title-67 {
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ic-subtitle-67 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 4px;
  text-transform: uppercase;
}

.comparison-container-67 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 60px;
}

.comparison-item-67 {
  text-align: center;
}

.comparison-label-67 {
  display: inline-block;
  padding: 10px 24px;
  background: rgba(240, 147, 251, 0.2);
  border-radius: 30px;
  color: #f093fb;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(240, 147, 251, 0.3);
}

.comparison-wrapper-67 {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 450px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  cursor: ew-resize;
}

.comparison-image-67 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.comparison-overlay-67 {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  width: 50%;
}

.comparison-slider-67 {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: rgba(255, 255, 255, 0.8);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.slider-button-67 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  cursor: ew-resize;
}

.slider-arrow-left-67,
.slider-arrow-right-67 {
  font-size: 12px;
  color: #fff;
}

.comparison-labels-67 {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: none;
}

.label-before-67,
.label-after-67 {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
}

.ic-controls-67 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 60px;
}

.ic-btn-67 {
  padding: 14px 36px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(240, 147, 251, 0.4);
  }
}

@media (max-width: 768px) {
  .ic-title-67 {
    font-size: 2.2rem;
  }

  .comparison-wrapper-67 {
    height: 300px;
  }

  .slider-button-67 {
    width: 40px;
    height: 40px;
  }
}
</style>
