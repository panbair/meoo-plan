<template>
  <section class="sicy-image-cyber-section-262">
    <div class="sicy-container-262">
      <!-- 标题 -->
      <h2 class="sicy-title-262">赛博朋克风格</h2>

      <!-- 控制面板 -->
      <div class="sicy-control-panel-262">
        <div class="sicy-control-group-262">
          <button
            v-for="type in cyberTypes"
            :key="type.value"
            @click="changeCyberType(type.value)"
            :class="['sicy-btn-262', { 'sicy-active-262': currentType === type.value }]"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="sicy-slider-group-262">
          <label class="sicy-label-262">故障强度: {{ intensityValue }}</label>
          <input
            type="range"
            v-model.number="intensityValue"
            min="0.1"
            max="2"
            step="0.1"
            class="sicy-slider-262"
            @input="applyCyberAnimation"
          />
        </div>

        <div class="sicy-slider-group-262">
          <label class="sicy-label-262">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model.number="speedValue"
            min="0.2"
            max="3"
            step="0.1"
            class="sicy-slider-262"
            @input="applyCyberAnimation"
          />
        </div>
      </div>

      <!-- 图片容器 -->
      <div class="sicy-images-container-262">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="sicy-image-item-262"
          ref="imageItems"
        >
          <div class="sicy-cyber-wrapper-262">
            <!-- 数字雨层 -->
            <canvas class="sicy-digital-rain-262" ref="digitalRainCanvas"></canvas>
            <!-- 故障层 -->
            <div class="sicy-glitch-layer-262"></div>
            <!-- 扫描线层 -->
            <div class="sicy-scanline-layer-262"></div>
            <!-- RGB分离层 -->
            <div class="sicy-rgb-r-262"></div>
            <div class="sicy-rgb-g-262"></div>
            <div class="sicy-rgb-b-262"></div>
            <!-- 主图片 -->
            <img
              :src="img.src"
              :alt="img.alt"
              class="sicy-image-262"
            />
            <!-- 全息网格层 -->
            <div class="sicy-grid-262"></div>
          </div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div class="sicy-progress-262">
        <div class="sicy-progress-bar-262" ref="progressBar"></div>
        <span class="sicy-progress-text-262">滚动进度: {{ progress }}%</span>
      </div>

      <!-- 状态显示 -->
      <div class="sicy-status-262">
        <div class="sicy-status-item-262">
          <span class="sicy-status-label-262">类型:</span>
          <span class="sicy-status-value-262">{{ currentTypeLabel }}</span>
        </div>
        <div class="sicy-status-item-262">
          <span class="sicy-status-label-262">强度:</span>
          <span class="sicy-status-value-262">{{ intensityValue }}x</span>
        </div>
        <div class="sicy-status-item-262">
          <span class="sicy-status-label-262">速度:</span>
          <span class="sicy-status-value-262">{{ speedValue }}x</span>
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

// 赛博类型
const cyberTypes = [
  { value: 'matrix', label: '矩阵风格' },
  { value: 'cyber', label: '赛博故障' },
  { value: 'terminal', label: '终端风格' },
  { value: 'neural', label: '神经网格' }
]

// 响应式数据
const currentType = ref('matrix')
const intensityValue = ref(1)
const speedValue = ref(1)
const progress = ref(0)
const imageItems = ref<HTMLElement[]>([])
const progressBar = ref<HTMLElement>()
const digitalRainCanvas = ref<HTMLCanvasElement[]>([])

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '赛博1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '赛博2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '赛博3'
  }
]

// 存储触发器
let triggers: ScrollTrigger[] = []
let mainTrigger: ScrollTrigger | null = null
let canvasAnimations: number[] = []

// 计算当前类型标签
const currentTypeLabel = computed(() => {
  const type = cyberTypes.find(t => t.value === currentType.value)
  return type?.label || currentType.value
})

// 改变赛博类型
const changeCyberType = (type: string) => {
  currentType.value = type
  applyCyberAnimation()
}

// 应用赛博动画
const applyCyberAnimation = () => {
  if (!imageItems.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []
  canvasAnimations.forEach(id => cancelAnimationFrame(id))
  canvasAnimations = []

  // 重置所有元素
  gsap.utils.toArray<HTMLElement>('.sicy-glitch-layer-262').forEach(layer => {
    gsap.set(layer, { opacity: 0, x: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sicy-scanline-layer-262').forEach(layer => {
    gsap.set(layer, { opacity: 0, y: '-100%' })
  })
  gsap.utils.toArray<HTMLElement>('.sicy-rgb-r-262').forEach(layer => {
    gsap.set(layer, { opacity: 0, x: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sicy-rgb-g-262').forEach(layer => {
    gsap.set(layer, { opacity: 0, x: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sicy-rgb-b-262').forEach(layer => {
    gsap.set(layer, { opacity: 0, x: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sicy-grid-262').forEach(grid => {
    gsap.set(grid, { opacity: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sicy-image-262').forEach(img => {
    gsap.set(img, { filter: 'none', scale: 1 })
  })

  imageItems.value.forEach((item, index) => {
    const glitchLayer = item.querySelector('.sicy-glitch-layer-262') as HTMLElement
    const scanlineLayer = item.querySelector('.sicy-scanline-layer-262') as HTMLElement
    const rgbR = item.querySelector('.sicy-rgb-r-262') as HTMLElement
    const rgbG = item.querySelector('.sicy-rgb-g-262') as HTMLElement
    const rgbB = item.querySelector('.sicy-rgb-b-262') as HTMLElement
    const grid = item.querySelector('.sicy-grid-262') as HTMLElement
    const img = item.querySelector('.sicy-image-262') as HTMLElement
    const canvas = item.querySelector('.sicy-digital-rain-262') as HTMLCanvasElement

    if (!glitchLayer || !scanlineLayer || !rgbR || !rgbG || !rgbB || !grid || !img || !canvas) return

    const intensity = intensityValue.value

    const cyberTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    switch (currentType.value) {
      case 'matrix':
        // 矩阵风格
        cyberTimeline
          .to(grid, { opacity: 0.4 * intensity }, 0)
          .to(scanlineLayer, {
            opacity: 0.6 * intensity,
            y: '200%',
            ease: 'none'
          }, 0)
          .to(img, {
            filter: `brightness(1.2) contrast(1.3) saturate(1.5) hue-rotate(120deg)`,
            ease: 'power1.inOut'
          }, 0)
        break

      case 'cyber':
        // 赛博故障
        cyberTimeline
          .to(glitchLayer, { opacity: 0.5 * intensity, x: 10 }, 0)
          .to(rgbR, { opacity: 0.4 * intensity, x: 15 * intensity }, 0)
          .to(rgbG, { opacity: 0.4 * intensity, x: -10 * intensity }, 0.1)
          .to(rgbB, { opacity: 0.4 * intensity, x: 5 * intensity }, 0.2)
          .to(scanlineLayer, {
            opacity: 0.5 * intensity,
            y: '200%',
            ease: 'none'
          }, 0)
          .to(img, {
            filter: `brightness(1.4) contrast(1.5) saturate(1.8)`,
            ease: 'power1.inOut'
          }, 0)
        break

      case 'terminal':
        // 终端风格
        cyberTimeline
          .to(grid, { opacity: 0.5 * intensity }, 0)
          .to(scanlineLayer, {
            opacity: 0.7 * intensity,
            y: '200%',
            ease: 'steps(3)'
          }, 0)
          .to(img, {
            filter: `brightness(1.3) contrast(1.4) grayscale(0.3)`,
            ease: 'steps(3)'
          }, 0)
        break

      case 'neural':
        // 神经网格
        cyberTimeline
          .to(grid, { opacity: 0.6 * intensity }, 0)
          .to(rgbR, { opacity: 0.3 * intensity, x: 20 * intensity }, 0)
          .to(rgbG, { opacity: 0.3 * intensity, x: -20 * intensity }, 0)
          .to(scanlineLayer, {
            opacity: 0.6 * intensity,
            y: '200%',
            ease: 'sine.inOut'
          }, 0)
          .to(img, {
            filter: `brightness(1.5) contrast(1.6) saturate(1.7) hue-rotate(60deg)`,
            ease: 'sine.inOut'
          }, 0)
        break
    }

    triggers.push(cyberTimeline.scrollTrigger!)
  })
}

// 初始化进度条动画
const initProgressBar = () => {
  if (!progressBar.value) return

  mainTrigger = ScrollTrigger.create({
    trigger: '.sicy-images-container-262',
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
    applyCyberAnimation()
    initProgressBar()
  }, 100)
})

onUnmounted(() => {
  triggers.forEach(trigger => trigger.kill())
  canvasAnimations.forEach(id => cancelAnimationFrame(id))
  if (mainTrigger) {
    mainTrigger.kill()
  }
  ScrollTrigger.refresh()
})
</script>

<style scoped>
.sicy-image-cyber-section-262 {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.sicy-container-262 {
  max-width: 1200px;
  margin: 0 auto;
}

.sicy-title-262 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #00ff00 0%, #00ffff 50%, #ff00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
  text-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
  letter-spacing: 2px;
}

.sicy-control-panel-262 {
  background: rgba(0, 255, 0, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.sicy-control-group-262 {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.sicy-btn-262 {
  padding: 10px 20px;
  background: rgba(0, 255, 0, 0.2);
  border: 2px solid rgba(0, 255, 0, 0.4);
  border-radius: 8px;
  color: #00ff00;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
}

.sicy-btn-262:hover {
  background: rgba(0, 255, 0, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
}

.sicy-active-262 {
  background: linear-gradient(135deg, #00ff00 0%, #00ffff 100%);
  border-color: #00ff00;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.6);
}

.sicy-slider-group-262 {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.sicy-label-262 {
  min-width: 120px;
  font-size: 0.9rem;
  color: rgba(0, 255, 0, 0.8);
  font-family: 'Courier New', monospace;
}

.sicy-slider-262 {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(90deg, #00ff00 0%, #00ffff 100%);
  border-radius: 3px;
  outline: none;
}

.sicy-slider-262::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #00ff00;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.sicy-images-container-262 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.sicy-image-item-262 {
  aspect-ratio: 3/2;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 255, 0, 0.3);
  position: relative;
}

.sicy-cyber-wrapper-262 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.sicy-image-262 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 15px;
  position: relative;
  z-index: 1;
}

.sicy-digital-rain-262 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  z-index: 2;
  pointer-events: none;
}

.sicy-glitch-layer-262 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.1) 2px,
    rgba(0, 255, 0, 0.1) 4px
  );
  opacity: 0;
  z-index: 3;
  pointer-events: none;
}

.sicy-scanline-layer-262 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(0, 255, 0, 0.8),
    transparent
  );
  opacity: 0;
  z-index: 4;
  pointer-events: none;
}

.sicy-rgb-r-262,
.sicy-rgb-g-262,
.sicy-rgb-b-262 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 3;
  pointer-events: none;
  mix-blend-mode: screen;
}

.sicy-rgb-r-262 {
  background: rgba(255, 0, 0, 0.3);
}

.sicy-rgb-g-262 {
  background: rgba(0, 255, 0, 0.3);
}

.sicy-rgb-b-262 {
  background: rgba(0, 0, 255, 0.3);
}

.sicy-grid-262 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0;
  z-index: 2;
  pointer-events: none;
}

.sicy-progress-262 {
  background: rgba(0, 255, 0, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.sicy-progress-bar-262 {
  height: 4px;
  background: linear-gradient(90deg, #00ff00 0%, #00ffff 100%);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.sicy-progress-text-262 {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: rgba(0, 255, 0, 0.7);
  font-family: 'Courier New', monospace;
}

.sicy-status-262 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(0, 255, 0, 0.05);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(0, 255, 0, 0.2);
}

.sicy-status-item-262 {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sicy-status-label-262 {
  font-size: 0.85rem;
  color: rgba(0, 255, 0, 0.6);
  font-family: 'Courier New', monospace;
}

.sicy-status-value-262 {
  font-size: 0.9rem;
  font-weight: bold;
  color: #00ff00;
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  .sicy-title-262 {
    font-size: 1.8rem;
  }

  .sicy-images-container-262 {
    grid-template-columns: 1fr;
  }

  .sicy-status-262 {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
