<template>
  <section class="sid-image-distort-section-256">
    <div class="sid-container-256">
      <!-- 标题 -->
      <h2 class="sid-title-256">图片扭曲变形</h2>

      <!-- 控制面板 -->
      <div class="sid-control-panel-256">
        <div class="sid-control-group-256">
          <button
            v-for="type in distortTypes"
            :key="type.value"
            @click="changeDistortType(type.value)"
            :class="['sid-btn-256', { 'sid-active-256': currentType === type.value }]"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="sid-slider-group-256">
          <label class="sid-label-256">扭曲强度: {{ intensityValue }}</label>
          <input
            type="range"
            v-model.number="intensityValue"
            min="0.1"
            max="2"
            step="0.1"
            class="sid-slider-256"
            @input="applyDistortAnimation"
          />
        </div>

        <div class="sid-slider-group-256">
          <label class="sid-label-256">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model.number="speedValue"
            min="0.2"
            max="3"
            step="0.1"
            class="sid-slider-256"
            @input="applyDistortAnimation"
          />
        </div>
      </div>

      <!-- 图片容器 -->
      <div class="sid-images-container-256">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="sid-image-item-256"
          ref="imageItems"
        >
          <div class="sid-image-wrapper-256">
            <img
              :src="img.src"
              :alt="img.alt"
              class="sid-image-256"
            />
            <div class="sid-distort-layer-256"></div>
          </div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div class="sid-progress-256">
        <div class="sid-progress-bar-256" ref="progressBar"></div>
        <span class="sid-progress-text-256">滚动进度: {{ progress }}%</span>
      </div>

      <!-- 状态显示 -->
      <div class="sid-status-256">
        <div class="sid-status-item-256">
          <span class="sid-status-label-256">类型:</span>
          <span class="sid-status-value-256">{{ currentTypeLabel }}</span>
        </div>
        <div class="sid-status-item-256">
          <span class="sid-status-label-256">强度:</span>
          <span class="sid-status-value-256">{{ intensityValue }}x</span>
        </div>
        <div class="sid-status-item-256">
          <span class="sid-status-label-256">速度:</span>
          <span class="sid-status-value-256">{{ speedValue }}x</span>
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

// 扭曲变形类型
const distortTypes = [
  { value: 'wave', label: '波浪扭曲' },
  { value: 'spiral', label: '螺旋扭曲' },
  { value: 'ripple', label: '涟漪扭曲' },
  { value: 'zigzag', label: '锯齿扭曲' }
]

// 响应式数据
const currentType = ref('wave')
const intensityValue = ref(1)
const speedValue = ref(1)
const progress = ref(0)
const imageItems = ref<HTMLElement[]>([])
const progressBar = ref<HTMLElement>()

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '自然1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '自然2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '自然3'
  }
]

// 存储触发器
let triggers: ScrollTrigger[] = []
let mainTrigger: ScrollTrigger | null = null

// 计算当前类型标签
const currentTypeLabel = computed(() => {
  const type = distortTypes.find(t => t.value === currentType.value)
  return type?.label || currentType.value
})

// 改变扭曲类型
const changeDistortType = (type: string) => {
  currentType.value = type
  applyDistortAnimation()
}

// 应用扭曲动画
const applyDistortAnimation = () => {
  if (!imageItems.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  // 重置所有图片
  gsap.utils.toArray<HTMLElement>('.sid-image-256').forEach(img => {
    gsap.set(img, {
      scale: 1,
      rotate: 0,
      skewX: 0,
      skewY: 0,
      filter: 'none'
    })
  })

  imageItems.value.forEach((item, index) => {
    const img = item.querySelector('.sid-image-256')
    const distortLayer = item.querySelector('.sid-distort-layer-256')
    if (!img || !distortLayer) return

    const intensity = intensityValue.value

    const distortTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    switch (currentType.value) {
      case 'wave':
        // 波浪扭曲效果
        const waveAmount = intensity * 20
        distortTimeline
          .fromTo(
            img,
            { scale: 1 },
            { scale: 1.1, ease: 'sine.inOut' },
            0
          )
          .fromTo(
            img,
            { skewX: 0 },
            { skewX: waveAmount, ease: 'sine.inOut' },
            0
          )
          .fromTo(
            distortLayer,
            { opacity: 0 },
            { opacity: 0.3, ease: 'sine.inOut' },
            0
          )
        break

      case 'spiral':
        // 螺旋扭曲效果
        const spiralRotate = intensity * 45
        distortTimeline
          .fromTo(
            img,
            { rotate: 0 },
            { rotate: spiralRotate, ease: 'power1.inOut' },
            0
          )
          .fromTo(
            img,
            { scale: 1 },
            { scale: 1.2, ease: 'power1.inOut' },
            0
          )
          .fromTo(
            distortLayer,
            { opacity: 0, rotate: 0 },
            { opacity: 0.4, rotate: -spiralRotate, ease: 'power1.inOut' },
            0
          )
        break

      case 'ripple':
        // 涟漪扭曲效果
        const rippleScale = 1 + (intensity * 0.3)
        distortTimeline
          .fromTo(
            img,
            { scale: 0.9 },
            { scale: rippleScale, ease: 'elastic.out(1, 0.5)' },
            0
          )
          .fromTo(
            img,
            { filter: 'blur(0px)' },
            { filter: `blur(${intensity * 3}px)`, ease: 'elastic.out(1, 0.5)' },
            0
          )
          .fromTo(
            distortLayer,
            { opacity: 0, scale: 0.5 },
            { opacity: 0.5, scale: 1.5, ease: 'elastic.out(1, 0.5)' },
            0
          )
        break

      case 'zigzag':
        // 锯齿扭曲效果
        const zigzagSkew = intensity * 25
        distortTimeline
          .fromTo(
            img,
            { skewX: 0 },
            { skewX: zigzagSkew, ease: 'steps(5)' },
            0
          )
          .fromTo(
            img,
            { scale: 1 },
            { scale: 1.15, ease: 'steps(5)' },
            0
          )
          .fromTo(
            distortLayer,
            { opacity: 0 },
            { opacity: 0.4, ease: 'steps(5)' },
            0
          )
        break
    }

    triggers.push(distortTimeline.scrollTrigger!)
  })
}

// 初始化进度条动画
const initProgressBar = () => {
  if (!progressBar.value) return

  mainTrigger = ScrollTrigger.create({
    trigger: '.sid-images-container-256',
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
    applyDistortAnimation()
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
.sid-image-distort-section-256 {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.sid-container-256 {
  max-width: 1200px;
  margin: 0 auto;
}

.sid-title-256 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
}

.sid-control-panel-256 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sid-control-group-256 {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.sid-btn-256 {
  padding: 10px 20px;
  background: rgba(240, 147, 251, 0.3);
  border: 2px solid rgba(240, 147, 251, 0.5);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.sid-btn-256:hover {
  background: rgba(240, 147, 251, 0.5);
  transform: translateY(-2px);
}

.sid-active-256 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-color: #f093fb;
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.5);
}

.sid-slider-group-256 {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.sid-label-256 {
  min-width: 120px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.sid-slider-256 {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
}

.sid-slider-256::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(240, 147, 251, 0.5);
}

.sid-images-container-256 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.sid-image-item-256 {
  aspect-ratio: 3/2;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.sid-image-wrapper-256 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.sid-image-256 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  display: block;
}

.sid-distort-layer-256 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.3) 0%, rgba(245, 87, 108, 0.3) 100%);
  pointer-events: none;
  mix-blend-mode: overlay;
}

.sid-progress-256 {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: hidden;
}

.sid-progress-bar-256 {
  height: 4px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
}

.sid-progress-text-256 {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.sid-status-256 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
}

.sid-status-item-256 {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sid-status-label-256 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.sid-status-value-256 {
  font-size: 0.9rem;
  font-weight: bold;
  color: #f093fb;
}

@media (max-width: 768px) {
  .sid-title-256 {
    font-size: 1.8rem;
  }

  .sid-images-container-256 {
    grid-template-columns: 1fr;
  }

  .sid-status-256 {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
