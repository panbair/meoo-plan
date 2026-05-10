<template>
  <section class="si3-image-3d-section-258">
    <div class="si3-container-258">
      <!-- 标题 -->
      <h2 class="si3-title-258">图片3D变换</h2>

      <!-- 控制面板 -->
      <div class="si3-control-panel-258">
        <div class="si3-control-group-258">
          <button
            v-for="type in threeDTypes"
            :key="type.value"
            @click="change3DType(type.value)"
            :class="['si3-btn-258', { 'si3-active-258': currentType === type.value }]"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="si3-slider-group-258">
          <label class="si3-label-258">3D强度: {{ intensityValue }}</label>
          <input
            type="range"
            v-model.number="intensityValue"
            min="0.1"
            max="2"
            step="0.1"
            class="si3-slider-258"
            @input="apply3DAnimation"
          />
        </div>

        <div class="si3-slider-group-258">
          <label class="si3-label-258">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model.number="speedValue"
            min="0.2"
            max="3"
            step="0.1"
            class="si3-slider-258"
            @input="apply3DAnimation"
          />
        </div>
      </div>

      <!-- 图片容器 -->
      <div class="si3-images-container-258">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="si3-image-item-258"
          ref="imageItems"
        >
          <div class="si3-image-wrapper-258">
            <img
              :src="img.src"
              :alt="img.alt"
              class="si3-image-258"
            />
          </div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div class="si3-progress-258">
        <div class="si3-progress-bar-258" ref="progressBar"></div>
        <span class="si3-progress-text-258">滚动进度: {{ progress }}%</span>
      </div>

      <!-- 状态显示 -->
      <div class="si3-status-258">
        <div class="si3-status-item-258">
          <span class="si3-status-label-258">类型:</span>
          <span class="si3-status-value-258">{{ currentTypeLabel }}</span>
        </div>
        <div class="si3-status-item-258">
          <span class="si3-status-label-258">强度:</span>
          <span class="si3-status-value-258">{{ intensityValue }}x</span>
        </div>
        <div class="si3-status-item-258">
          <span class="si3-status-label-258">速度:</span>
          <span class="si3-status-value-258">{{ speedValue }}x</span>
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

// 3D变换类型
const threeDTypes = [
  { value: 'flip', label: '翻转效果' },
  { value: 'rotate', label: '旋转效果' },
  { value: 'tilt', label: '倾斜效果' },
  { value: 'cube', label: '立方体效果' }
]

// 响应式数据
const currentType = ref('flip')
const intensityValue = ref(1)
const speedValue = ref(1)
const progress = ref(0)
const imageItems = ref<HTMLElement[]>([])
const progressBar = ref<HTMLElement>()

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '建筑1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '建筑2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '建筑3'
  }
]

// 存储触发器
let triggers: ScrollTrigger[] = []
let mainTrigger: ScrollTrigger | null = null

// 计算当前类型标签
const currentTypeLabel = computed(() => {
  const type = threeDTypes.find(t => t.value === currentType.value)
  return type?.label || currentType.value
})

// 改变3D类型
const change3DType = (type: string) => {
  currentType.value = type
  apply3DAnimation()
}

// 应用3D动画
const apply3DAnimation = () => {
  if (!imageItems.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  // 重置所有图片
  gsap.utils.toArray<HTMLElement>('.si3-image-wrapper-258').forEach(wrapper => {
    gsap.set(wrapper, {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      transformPerspective: 1000
    })
  })

  imageItems.value.forEach((item, index) => {
    const wrapper = item.querySelector('.si3-image-wrapper-258') as HTMLElement
    if (!wrapper) return

    const intensity = intensityValue.value

    const threeDTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    switch (currentType.value) {
      case 'flip':
        // 翻转效果
        const flipRotateY = intensity * 180
        threeDTimeline
          .fromTo(
            wrapper,
            { rotateY: -flipRotateY, opacity: 0 },
            { rotateY: flipRotateY, opacity: 1, ease: 'power1.inOut' },
            0
          )
          .fromTo(
            wrapper,
            { scale: 0.8 },
            { scale: 1.1, ease: 'power1.inOut' },
            0
          )
        break

      case 'rotate':
        // 旋转效果
        const rotateAmount = intensity * 360
        threeDTimeline
          .fromTo(
            wrapper,
            { rotateZ: -rotateAmount, scale: 0.8 },
            { rotateZ: rotateAmount, scale: 1.2, ease: 'power2.inOut' },
            0
          )
          .fromTo(
            wrapper,
            { rotateX: 0 },
            { rotateX: intensity * 30, ease: 'power2.inOut' },
            0
          )
        break

      case 'tilt':
        // 倾斜效果
        const tiltAmount = intensity * 45
        threeDTimeline
          .fromTo(
            wrapper,
            { rotateX: -tiltAmount },
            { rotateX: tiltAmount, ease: 'sine.inOut' },
            0
          )
          .fromTo(
            wrapper,
            { rotateY: -tiltAmount },
            { rotateY: tiltAmount, ease: 'sine.inOut' },
            0
          )
          .fromTo(
            wrapper,
            { scale: 1 },
            { scale: 1.15, ease: 'sine.inOut' },
            0
          )
        break

      case 'cube':
        // 立方体效果
        const cubeRotate = intensity * 90
        threeDTimeline
          .fromTo(
            wrapper,
            { rotateX: -cubeRotate, rotateY: 0 },
            { rotateX: 0, rotateY: cubeRotate, ease: 'power2.inOut' },
            0
          )
          .fromTo(
            wrapper,
            { scale: 0.85 },
            { scale: 1.25, ease: 'power2.inOut' },
            0
          )
          .fromTo(
            wrapper,
            { rotateZ: 0 },
            { rotateZ: intensity * 15, ease: 'power2.inOut' },
            0
          )
        break
    }

    triggers.push(threeDTimeline.scrollTrigger!)
  })
}

// 初始化进度条动画
const initProgressBar = () => {
  if (!progressBar.value) return

  mainTrigger = ScrollTrigger.create({
    trigger: '.si3-images-container-258',
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
    apply3DAnimation()
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
.si3-image-3d-section-258 {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.si3-container-258 {
  max-width: 1200px;
  margin: 0 auto;
}

.si3-title-258 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
}

.si3-control-panel-258 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.si3-control-group-258 {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.si3-btn-258 {
  padding: 10px 20px;
  background: rgba(168, 237, 234, 0.3);
  border: 2px solid rgba(168, 237, 234, 0.5);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.si3-btn-258:hover {
  background: rgba(168, 237, 234, 0.5);
  transform: translateY(-2px);
}

.si3-active-258 {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-color: #a8edea;
  box-shadow: 0 0 20px rgba(168, 237, 234, 0.5);
}

.si3-slider-group-258 {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.si3-label-258 {
  min-width: 120px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.si3-slider-258 {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
}

.si3-slider-258::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(168, 237, 234, 0.5);
}

.si3-images-container-258 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.si3-image-item-258 {
  aspect-ratio: 3/2;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  perspective: 1000px;
}

.si3-image-wrapper-258 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.si3-image-258 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 15px;
}

.si3-progress-258 {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: hidden;
}

.si3-progress-bar-258 {
  height: 4px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
}

.si3-progress-text-258 {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.si3-status-258 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
}

.si3-status-item-258 {
  display: flex;
  gap: 10px;
  align-items: center;
}

.si3-status-label-258 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.si3-status-value-258 {
  font-size: 0.9rem;
  font-weight: bold;
  color: #a8edea;
}

@media (max-width: 768px) {
  .si3-title-258 {
    font-size: 1.8rem;
  }

  .si3-images-container-258 {
    grid-template-columns: 1fr;
  }

  .si3-status-258 {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
