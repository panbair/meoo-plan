<template>
  <section class="sipr-image-prism-section-260">
    <div class="sipr-container-260">
      <!-- 标题 -->
      <h2 class="sipr-title-260">棱镜光影效果</h2>

      <!-- 控制面板 -->
      <div class="sipr-control-panel-260">
        <div class="sipr-control-group-260">
          <button
            v-for="type in prismTypes"
            :key="type.value"
            @click="changePrismType(type.value)"
            :class="['sipr-btn-260', { 'sipr-active-260': currentType === type.value }]"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="sipr-slider-group-260">
          <label class="sipr-label-260">折射强度: {{ intensityValue }}</label>
          <input
            type="range"
            v-model.number="intensityValue"
            min="0.1"
            max="2"
            step="0.1"
            class="sipr-slider-260"
            @input="applyPrismAnimation"
          />
        </div>

        <div class="sipr-slider-group-260">
          <label class="sipr-label-260">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model.number="speedValue"
            min="0.2"
            max="3"
            step="0.1"
            class="sipr-slider-260"
            @input="applyPrismAnimation"
          />
        </div>
      </div>

      <!-- 图片容器 -->
      <div class="sipr-images-container-260">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="sipr-image-item-260"
          ref="imageItems"
        >
          <div class="sipr-prism-wrapper-260">
            <!-- 光谱层 -->
            <div class="sipr-spectrum-layer-260">
              <div class="sipr-spectrum-bar-260" style="background: #ff0000"></div>
              <div class="sipr-spectrum-bar-260" style="background: #ff7f00"></div>
              <div class="sipr-spectrum-bar-260" style="background: #ffff00"></div>
              <div class="sipr-spectrum-bar-260" style="background: #00ff00"></div>
              <div class="sipr-spectrum-bar-260" style="background: #0000ff"></div>
              <div class="sipr-spectrum-bar-260" style="background: #4b0082"></div>
              <div class="sipr-spectrum-bar-260" style="background: #9400d3"></div>
            </div>
            <!-- 折射层 -->
            <div class="sipr-refraction-layer-260"></div>
            <!-- 主图片 -->
            <img
              :src="img.src"
              :alt="img.alt"
              class="sipr-image-260"
            />
            <!-- 光效层 -->
            <div class="sipr-light-260"></div>
          </div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div class="sipr-progress-260">
        <div class="sipr-progress-bar-260" ref="progressBar"></div>
        <span class="sipr-progress-text-260">滚动进度: {{ progress }}%</span>
      </div>

      <!-- 状态显示 -->
      <div class="sipr-status-260">
        <div class="sipr-status-item-260">
          <span class="sipr-status-label-260">类型:</span>
          <span class="sipr-status-value-260">{{ currentTypeLabel }}</span>
        </div>
        <div class="sipr-status-item-260">
          <span class="sipr-status-label-260">强度:</span>
          <span class="sipr-status-value-260">{{ intensityValue }}x</span>
        </div>
        <div class="sipr-status-item-260">
          <span class="sipr-status-label-260">速度:</span>
          <span class="sipr-status-value-260">{{ speedValue }}x</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 棱镜类型
const prismTypes = [
  { value: 'rainbow', label: '彩虹折射' },
  { value: 'split', label: '光线分离' },
  { value: 'scatter', label: '光线散射' },
  { value: 'rotate', label: '旋转光谱' }
]

// 响应式数据
const currentType = ref('rainbow')
const intensityValue = ref(1)
const speedValue = ref(1)
const progress = ref(0)
const imageItems = ref<HTMLElement[]>([])
const progressBar = ref<HTMLElement>()

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '棱镜1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '棱镜2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '棱镜3'
  }
]

// 存储触发器
let triggers: ScrollTrigger[] = []
let mainTrigger: ScrollTrigger | null = null

// 计算当前类型标签
const currentTypeLabel = computed(() => {
  const type = prismTypes.find(t => t.value === currentType.value)
  return type?.label || currentType.value
})

// 改变棱镜类型
const changePrismType = (type: string) => {
  currentType.value = type
  applyPrismAnimation()
}

// 应用棱镜动画
const applyPrismAnimation = () => {
  if (!imageItems.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  // 重置所有元素
  gsap.utils.toArray<HTMLElement>('.sipr-spectrum-bar-260').forEach(bar => {
    gsap.set(bar, { opacity: 0, x: 0, rotate: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sipr-refraction-layer-260').forEach(layer => {
    gsap.set(layer, { opacity: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sipr-light-260').forEach(light => {
    gsap.set(light, { opacity: 0, scale: 0.5 })
  })
  gsap.utils.toArray<HTMLElement>('.sipr-image-260').forEach(img => {
    gsap.set(img, { filter: 'none', scale: 1 })
  })

  imageItems.value.forEach((item, index) => {
    const spectrumBars = item.querySelectorAll('.sipr-spectrum-bar-260') as NodeListOf<HTMLElement>
    const refractionLayer = item.querySelector('.sipr-refraction-layer-260') as HTMLElement
    const light = item.querySelector('.sipr-light-260') as HTMLElement
    const img = item.querySelector('.sipr-image-260') as HTMLElement

    if (!spectrumBars.length || !refractionLayer || !light || !img) return

    const intensity = intensityValue.value

    const prismTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    switch (currentType.value) {
      case 'rainbow':
        // 彩虹折射效果
        spectrumBars.forEach((bar, i) => {
          const offset = i * 0.1
          prismTimeline.to(bar, {
            opacity: 0.7 * intensity,
            x: 30 * intensity,
            duration: 2,
            ease: 'power1.inOut'
          }, offset)
        })
        prismTimeline
          .to(refractionLayer, { opacity: 0.4 * intensity }, 0)
          .to(img, {
            filter: `brightness(1.3) saturate(1.5) hue-rotate(${intensity * 20}deg)`,
            ease: 'power1.inOut'
          }, 0)
          .to(light, { opacity: 0.5 * intensity, scale: 1.3 }, 0)
        break

      case 'split':
        // 光线分离效果
        spectrumBars.forEach((bar, i) => {
          const splitOffset = (i - 3) * 15 * intensity
          prismTimeline.to(bar, {
            opacity: 0.8 * intensity,
            x: splitOffset,
            duration: 2,
            ease: 'elastic.out(1, 0.5)'
          }, i * 0.05)
        })
        prismTimeline
          .to(refractionLayer, { opacity: 0.5 * intensity }, 0)
          .to(img, {
            filter: `brightness(1.4) contrast(1.2)`,
            ease: 'elastic.out(1, 0.5)'
          }, 0)
          .to(light, { opacity: 0.6 * intensity, scale: 1.4 }, 0)
        break

      case 'scatter':
        // 光线散射效果
        spectrumBars.forEach((bar, i) => {
          const angle = (i / 7) * 360
          const x = Math.cos(angle * Math.PI / 180) * 40 * intensity
          const y = Math.sin(angle * Math.PI / 180) * 40 * intensity
          prismTimeline.to(bar, {
            opacity: 0.6 * intensity,
            x,
            y,
            scale: 1.2,
            duration: 2,
            ease: 'power2.out'
          }, 0)
        })
        prismTimeline
          .to(refractionLayer, { opacity: 0.6 * intensity }, 0)
          .to(img, {
            filter: `brightness(1.5) saturate(1.8) blur(${intensity}px)`,
            ease: 'power2.out'
          }, 0)
          .to(light, { opacity: 0.7 * intensity, scale: 1.5 }, 0)
        break

      case 'rotate':
        // 旋转光谱效果
        spectrumBars.forEach((bar, i) => {
          prismTimeline.to(bar, {
            opacity: 0.75 * intensity,
            rotate: 360,
            scale: 1.3,
            duration: 2,
            ease: 'power2.inOut',
            transformOrigin: 'center center'
          }, i * 0.05)
        })
        prismTimeline
          .to(refractionLayer, { opacity: 0.5 * intensity }, 0)
          .to(img, {
            filter: `brightness(1.4) saturate(1.6) hue-rotate(${intensity * 360}deg)`,
            ease: 'power2.inOut'
          }, 0)
          .to(light, { opacity: 0.6 * intensity, scale: 1.5, rotate: 180 }, 0)
        break
    }

    triggers.push(prismTimeline.scrollTrigger!)
  })
}

// 初始化进度条动画
const initProgressBar = () => {
  if (!progressBar.value) return

  mainTrigger = ScrollTrigger.create({
    trigger: '.sipr-images-container-260',
    start: 'top center',
    end: 'bottom center',
    onUpdate: (self) => {
      progress.value = Math.round(self.progress * 100)
      if (progressBar.value) {
        progressBar.value.style.width = `${progress.value}%`
      }
    }
  })
}

// 生命周期钩子
onMounted(() => {
  setTimeout(() => {
    applyPrismAnimation()
    initProgressBar()
  }, 100)
})

onUnmounted(() => {
  triggers.forEach(trigger => trigger.kill())
  if (mainTrigger) {
    mainTrigger.kill()
  }
  ScrollTrigger.refresh()
})
</script>

<style scoped>
.sipr-image-prism-section-260 {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #4a2c7a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.sipr-container-260 {
  max-width: 1200px;
  margin: 0 auto;
}

.sipr-title-260 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 0%, #48dbfb 0%, #ff9ff3 0%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
  filter: drop-shadow(0 0 30px rgba(255, 107, 107, 0.5));
}

.sipr-control-panel-260 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sipr-control-group-260 {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.sipr-btn-260 {
  padding: 10px 20px;
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid rgba(255, 107, 107, 0.4);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.sipr-btn-260:hover {
  background: rgba(255, 107, 107, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
}

.sipr-active-260 {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%);
  border-color: #ff6b6b;
  box-shadow: 0 0 30px rgba(255, 107, 107, 0.6);
}

.sipr-slider-group-260 {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.sipr-label-260 {
  min-width: 120px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.sipr-slider-260 {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%);
  border-radius: 3px;
  outline: none;
}

.sipr-slider-260::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.sipr-images-container-260 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.sipr-image-item-260 {
  aspect-ratio: 3/2;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(255, 107, 107, 0.3);
  position: relative;
}

.sipr-prism-wrapper-260 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.sipr-image-260 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 15px;
}

.sipr-spectrum-layer-260 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sipr-spectrum-bar-260 {
  position: absolute;
  width: 14%;
  height: 100%;
  opacity: 0;
  mix-blend-mode: screen;
}

.sipr-refraction-layer-260 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(255, 107, 107, 0.3) 0%,
    rgba(254, 202, 87, 0.3) 50%,
    rgba(72, 219, 251, 0.3) 100%
  );
  pointer-events: none;
  mix-blend-mode: overlay;
  z-index: 1;
}

.sipr-light-260 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
  pointer-events: none;
  z-index: 3;
}

.sipr-progress-260 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sipr-progress-bar-260 {
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
}

.sipr-progress-text-260 {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.sipr-status-260 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sipr-status-item-260 {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sipr-status-label-260 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.sipr-status-value-260 {
  font-size: 0.9rem;
  font-weight: bold;
  color: #feca57;
}

@media (max-width: 768px) {
  .sipr-title-260 {
    font-size: 1.8rem;
  }

  .sipr-images-container-260 {
    grid-template-columns: 1fr;
  }

  .sipr-status-260 {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
