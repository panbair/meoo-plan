<template>
  <section class="sig-image-glitch-section-257">
    <div class="sig-container-257">
      <!-- 标题 -->
      <h2 class="sig-title-257">图片故障艺术</h2>

      <!-- 控制面板 -->
      <div class="sig-control-panel-257">
        <div class="sig-control-group-257">
          <button
            v-for="type in glitchTypes"
            :key="type.value"
            @click="changeGlitchType(type.value)"
            :class="['sig-btn-257', { 'sig-active-257': currentType === type.value }]"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="sig-slider-group-257">
          <label class="sig-label-257">故障强度: {{ intensityValue }}</label>
          <input
            type="range"
            v-model.number="intensityValue"
            min="0.1"
            max="2"
            step="0.1"
            class="sig-slider-257"
            @input="applyGlitchAnimation"
          />
        </div>

        <div class="sig-slider-group-257">
          <label class="sig-label-257">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model.number="speedValue"
            min="0.2"
            max="3"
            step="0.1"
            class="sig-slider-257"
            @input="applyGlitchAnimation"
          />
        </div>
      </div>

      <!-- 图片容器 -->
      <div class="sig-images-container-257">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="sig-image-item-257"
          ref="imageItems"
        >
          <div class="sig-image-wrapper-257">
            <img
              :src="img.src"
              :alt="img.alt"
              class="sig-image-257"
            />
            <div class="sig-glitch-layer-r-257"></div>
            <div class="sig-glitch-layer-g-257"></div>
            <div class="sig-glitch-layer-b-257"></div>
          </div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div class="sig-progress-257">
        <div class="sig-progress-bar-257" ref="progressBar"></div>
        <span class="sig-progress-text-257">滚动进度: {{ progress }}%</span>
      </div>

      <!-- 状态显示 -->
      <div class="sig-status-257">
        <div class="sig-status-item-257">
          <span class="sig-status-label-257">类型:</span>
          <span class="sig-status-value-257">{{ currentTypeLabel }}</span>
        </div>
        <div class="sig-status-item-257">
          <span class="sig-status-label-257">强度:</span>
          <span class="sig-status-value-257">{{ intensityValue }}x</span>
        </div>
        <div class="sig-status-item-257">
          <span class="sig-status-label-257">速度:</span>
          <span class="sig-status-value-257">{{ speedValue }}x</span>
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

// 故障类型
const glitchTypes = [
  { value: 'rgb', label: 'RGB分离' },
  { value: 'shake', label: '震动效果' },
  { value: 'scanline', label: '扫描线' },
  { value: 'pixel', label: '像素化' }
]

// 响应式数据
const currentType = ref('rgb')
const intensityValue = ref(1)
const speedValue = ref(1)
const progress = ref(0)
const imageItems = ref<HTMLElement[]>([])
const progressBar = ref<HTMLElement>()

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '城市1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '城市2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '城市3'
  }
]

// 存储触发器
let triggers: ScrollTrigger[] = []
let mainTrigger: ScrollTrigger | null = null

// 计算当前类型标签
const currentTypeLabel = computed(() => {
  const type = glitchTypes.find(t => t.value === currentType.value)
  return type?.label || currentType.value
})

// 改变故障类型
const changeGlitchType = (type: string) => {
  currentType.value = type
  applyGlitchAnimation()
}

// 应用故障动画
const applyGlitchAnimation = () => {
  if (!imageItems.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  // 重置所有图层
  gsap.utils.toArray<HTMLElement>('.sig-glitch-layer-r-257').forEach(layer => {
    gsap.set(layer, { x: 0, y: 0, opacity: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sig-glitch-layer-g-257').forEach(layer => {
    gsap.set(layer, { x: 0, y: 0, opacity: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sig-glitch-layer-b-257').forEach(layer => {
    gsap.set(layer, { x: 0, y: 0, opacity: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sig-image-257').forEach(img => {
    gsap.set(img, { filter: 'none', skewX: 0, skewY: 0 })
  })

  imageItems.value.forEach((item, index) => {
    const img = item.querySelector('.sig-image-257') as HTMLElement
    const layerR = item.querySelector('.sig-glitch-layer-r-257') as HTMLElement
    const layerG = item.querySelector('.sig-glitch-layer-g-257') as HTMLElement
    const layerB = item.querySelector('.sig-glitch-layer-b-257') as HTMLElement

    if (!img || !layerR || !layerG || !layerB) return

    const intensity = intensityValue.value

    const glitchTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    switch (currentType.value) {
      case 'rgb':
        // RGB分离效果
        const rgbOffset = intensity * 20
        glitchTimeline
          .to(layerR, { x: rgbOffset, opacity: 0.5 }, 0)
          .to(layerG, { x: -rgbOffset, y: 5, opacity: 0.5 }, 0)
          .to(layerB, { y: -rgbOffset, opacity: 0.5 }, 0)
        break

      case 'shake':
        // 震动效果
        const shakeAmount = intensity * 10
        glitchTimeline
          .to(img, { skewX: shakeAmount }, 0)
          .to(img, { skewX: -shakeAmount }, 0.25)
          .to(img, { skewY: shakeAmount }, 0.5)
          .to(img, { skewY: -shakeAmount }, 0.75)
          .to(img, { skewX: 0, skewY: 0 }, 1)
        break

      case 'scanline':
        // 扫描线效果
        glitchTimeline
          .to(layerR, { opacity: 0.8, x: 5 }, 0)
          .to(layerG, { opacity: 0.8, x: -5 }, 0)
          .to(layerB, { opacity: 0.8 }, 0)
          .to(img, { filter: `contrast(${150 + intensity * 50}%)` }, 0)
        break

      case 'pixel':
        // 像素化效果
        const pixelSize = intensity * 8
        glitchTimeline
          .to(img, { filter: `blur(${pixelSize}px) contrast(200%)` }, 0)
          .to(layerR, { opacity: 0.6, x: 3 }, 0)
          .to(layerG, { opacity: 0.6, x: -3 }, 0)
          .to(layerB, { opacity: 0.6 }, 0)
        break
    }

    triggers.push(glitchTimeline.scrollTrigger!)
  })
}

// 初始化进度条动画
const initProgressBar = () => {
  if (!progressBar.value) return

  mainTrigger = ScrollTrigger.create({
    trigger: '.sig-images-container-257',
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
    applyGlitchAnimation()
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
.sig-image-glitch-section-257 {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.sig-container-257 {
  max-width: 1200px;
  margin: 0 auto;
}

.sig-title-257 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
}

.sig-control-panel-257 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sig-control-group-257 {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.sig-btn-257 {
  padding: 10px 20px;
  background: rgba(0, 210, 255, 0.3);
  border: 2px solid rgba(0, 210, 255, 0.5);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.sig-btn-257:hover {
  background: rgba(0, 210, 255, 0.5);
  transform: translateY(-2px);
}

.sig-active-257 {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  border-color: #00d2ff;
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.5);
}

.sig-slider-group-257 {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.sig-label-257 {
  min-width: 120px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.sig-slider-257 {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
}

.sig-slider-257::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
}

.sig-images-container-257 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.sig-image-item-257 {
  aspect-ratio: 3/2;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.sig-image-wrapper-257 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.sig-image-257 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sig-glitch-layer-r-257,
.sig-glitch-layer-g-257,
.sig-glitch-layer-b-257 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
}

.sig-glitch-layer-r-257 {
  background: rgba(255, 0, 0, 0.3);
}

.sig-glitch-layer-g-257 {
  background: rgba(0, 255, 0, 0.3);
}

.sig-glitch-layer-b-257 {
  background: rgba(0, 0, 255, 0.3);
}

.sig-progress-257 {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: hidden;
}

.sig-progress-bar-257 {
  height: 4px;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
}

.sig-progress-text-257 {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.sig-status-257 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
}

.sig-status-item-257 {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sig-status-label-257 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.sig-status-value-257 {
  font-size: 0.9rem;
  font-weight: bold;
  color: #00d2ff;
}

@media (max-width: 768px) {
  .sig-title-257 {
    font-size: 1.8rem;
  }

  .sig-images-container-257 {
    grid-template-columns: 1fr;
  }

  .sig-status-257 {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
