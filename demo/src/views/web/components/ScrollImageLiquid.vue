<template>
  <section class="simd-image-liquid-section-255">
    <div class="simd-container-255">
      <!-- 标题 -->
      <h2 class="simd-title-255">液体图片变形</h2>

      <!-- 控制面板 -->
      <div class="simd-control-panel-255">
        <div class="simd-control-group-255">
          <button
            v-for="type in liquidTypes"
            :key="type.value"
            @click="changeLiquidType(type.value)"
            :class="['simd-btn-255', { 'simd-active-255': currentType === type.value }]"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="simd-slider-group-255">
          <label class="simd-label-255">变形强度: {{ intensityValue }}</label>
          <input
            type="range"
            v-model.number="intensityValue"
            min="0.1"
            max="2"
            step="0.1"
            class="simd-slider-255"
            @input="applyLiquidAnimation"
          />
        </div>

        <div class="simd-slider-group-255">
          <label class="simd-label-255">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model.number="speedValue"
            min="0.2"
            max="3"
            step="0.1"
            class="simd-slider-255"
            @input="applyLiquidAnimation"
          />
        </div>
      </div>

      <!-- 图片容器 -->
      <div class="simd-images-container-255">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="simd-image-item-255"
          ref="imageItems"
        >
          <div class="simd-image-wrapper-255">
            <img
              :src="img.src"
              :alt="img.alt"
              class="simd-image-255"
              :style="{ filter: getLiquidFilter(index) }"
            />
          </div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div class="simd-progress-255">
        <div class="simd-progress-bar-255" ref="progressBar"></div>
        <span class="simd-progress-text-255">滚动进度: {{ progress }}%</span>
      </div>

      <!-- 状态显示 -->
      <div class="simd-status-255">
        <div class="simd-status-item-255">
          <span class="simd-status-label-255">类型:</span>
          <span class="simd-status-value-255">{{ currentTypeLabel }}</span>
        </div>
        <div class="simd-status-item-255">
          <span class="simd-status-label-255">强度:</span>
          <span class="simd-status-value-255">{{ intensityValue }}x</span>
        </div>
        <div class="simd-status-item-255">
          <span class="simd-status-label-255">速度:</span>
          <span class="simd-status-value-255">{{ speedValue }}x</span>
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

// 液体变形类型
const liquidTypes = [
  { value: 'liquid', label: '液体波动' },
  { value: 'drip', label: '水滴效果' },
  { value: 'melt', label: '融化变形' },
  { value: 'bubble', label: '气泡效果' }
]

// 响应式数据
const currentType = ref('liquid')
const intensityValue = ref(1)
const speedValue = ref(1)
const progress = ref(0)
const imageItems = ref<HTMLElement[]>([])
const progressBar = ref<HTMLElement>()

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    alt: '山景1'
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
    alt: '自然2'
  },
  {
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=400&fit=crop',
    alt: '森林3'
  }
]

// 存储触发器
let triggers: ScrollTrigger[] = []
let mainTrigger: ScrollTrigger | null = null

// 计算当前类型标签
const currentTypeLabel = computed(() => {
  const type = liquidTypes.find(t => t.value === currentType.value)
  return type?.label || currentType.value
})

// 获取液体滤镜
const getLiquidFilter = (index: number) => {
  const offset = index * 30
  switch (currentType.value) {
    case 'liquid':
      return `url(#liquid-filter-255-${index})`
    case 'drip':
      return `url(#drip-filter-255-${index})`
    case 'melt':
      return `url(#melt-filter-255-${index})`
    case 'bubble':
      return `url(#bubble-filter-255-${index})`
    default:
      return 'none'
  }
}

// 改变液体类型
const changeLiquidType = (type: string) => {
  currentType.value = type
  applyLiquidAnimation()
}

// 应用液体动画
const applyLiquidAnimation = () => {
  if (!imageItems.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  // 重置所有图片
  gsap.utils.toArray<HTMLElement>('.simd-image-255').forEach(img => {
    gsap.set(img, {
      scale: 1,
      filter: 'none'
    })
  })

  imageItems.value.forEach((item, index) => {
    const img = item.querySelector('.simd-image-255')
    if (!img) return

    const intensity = intensityValue.value

    const liquidTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    switch (currentType.value) {
      case 'liquid':
        // 液体波动效果
        const liquidScale = 1 + (intensity * 0.3)
        liquidTimeline
          .fromTo(
            img,
            { scale: 0.95 },
            { scale: liquidScale, ease: 'power1.inOut' },
            0
          )
          .fromTo(
            img,
            { filter: 'blur(0px) saturate(100%)' },
            {
              filter: `blur(${2 * intensity}px) saturate(${120 + intensity * 30}%)`,
              ease: 'power1.inOut'
            },
            0
          )
        break

      case 'drip':
        // 水滴效果
        liquidTimeline
          .fromTo(
            img,
            { scale: 1 },
            { scale: 1 + (intensity * 0.4), ease: 'power2.out' },
            0
          )
          .fromTo(
            img,
            { filter: 'blur(0px)' },
            {
              filter: `blur(${3 * intensity}px)`,
              ease: 'power2.out'
            },
            0
          )
        break

      case 'melt':
        // 融化变形效果
        liquidTimeline
          .fromTo(
            img,
            { scale: 1, skewY: 0 },
            {
              scale: 1.1,
              skewY: intensity * 3,
              ease: 'power1.inOut'
            },
            0
          )
          .fromTo(
            img,
            { filter: 'blur(0px) contrast(100%)' },
            {
              filter: `blur(${2 * intensity}px) contrast(${110 + intensity * 20}%)`,
              ease: 'power1.inOut'
            },
            0
          )
        break

      case 'bubble':
        // 气泡效果
        liquidTimeline
          .fromTo(
            img,
            { scale: 1 },
            { scale: 1 + (intensity * 0.5), ease: 'elastic.out(1, 0.5)' },
            0
          )
          .fromTo(
            img,
            { filter: 'blur(0px) brightness(100%)' },
            {
              filter: `blur(${1.5 * intensity}px) brightness(${105 + intensity * 15}%)`,
              ease: 'elastic.out(1, 0.5)'
            },
            0
          )
        break
    }

    triggers.push(liquidTimeline.scrollTrigger!)
  })
}

// 初始化进度条动画
const initProgressBar = () => {
  if (!progressBar.value) return

  mainTrigger = ScrollTrigger.create({
    trigger: '.simd-images-container-255',
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
    applyLiquidAnimation()
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
.simd-image-liquid-section-255 {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.simd-container-255 {
  max-width: 1200px;
  margin: 0 auto;
}

.simd-title-255 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
}

.simd-control-panel-255 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.simd-control-group-255 {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.simd-btn-255 {
  padding: 10px 20px;
  background: rgba(102, 126, 234, 0.3);
  border: 2px solid rgba(102, 126, 234, 0.5);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.simd-btn-255:hover {
  background: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

.simd-active-255 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}

.simd-slider-group-255 {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.simd-label-255 {
  min-width: 120px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.simd-slider-255 {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
}

.simd-slider-255::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

.simd-images-container-255 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.simd-image-item-255 {
  aspect-ratio: 3/2;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.simd-image-wrapper-255 {
  width: 100%;
  height: 100%;
  position: relative;
}

.simd-image-255 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  display: block;
}

.simd-progress-255 {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: hidden;
}

.simd-progress-bar-255 {
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
}

.simd-progress-text-255 {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.simd-status-255 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
}

.simd-status-item-255 {
  display: flex;
  gap: 10px;
  align-items: center;
}

.simd-status-label-255 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.simd-status-value-255 {
  font-size: 0.9rem;
  font-weight: bold;
  color: #667eea;
}

@media (max-width: 768px) {
  .simd-title-255 {
    font-size: 1.8rem;
  }

  .simd-images-container-255 {
    grid-template-columns: 1fr;
  }

  .simd-status-255 {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
