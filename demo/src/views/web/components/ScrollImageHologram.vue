<template>
  <section class="sih-image-hologram-section-259">
    <div class="sih-container-259">
      <!-- 标题 -->
      <h2 class="sih-title-259">全息图片投影</h2>

      <!-- 控制面板 -->
      <div class="sih-control-panel-259">
        <div class="sih-control-group-259">
          <button
            v-for="type in hologramTypes"
            :key="type.value"
            @click="changeHologramType(type.value)"
            :class="['sih-btn-259', { 'sih-active-259': currentType === type.value }]"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="sih-slider-group-259">
          <label class="sih-label-259">投影强度: {{ intensityValue }}</label>
          <input
            type="range"
            v-model.number="intensityValue"
            min="0.1"
            max="2"
            step="0.1"
            class="sih-slider-259"
            @input="applyHologramAnimation"
          />
        </div>

        <div class="sih-slider-group-259">
          <label class="sih-label-259">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model.number="speedValue"
            min="0.2"
            max="3"
            step="0.1"
            class="sih-slider-259"
            @input="applyHologramAnimation"
          />
        </div>
      </div>

      <!-- 图片容器 -->
      <div class="sih-images-container-259">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="sih-image-item-259"
          ref="imageItems"
        >
          <div class="sih-hologram-wrapper-259">
            <!-- 扫描线层 -->
            <div class="sih-scanline-259"></div>
            <!-- 光栅效果层 -->
            <div class="sih-raster-259"></div>
            <!-- 全息层1 -->
            <div class="sih-hologram-layer-1-259"></div>
            <!-- 全息层2 -->
            <div class="sih-hologram-layer-2-259"></div>
            <!-- 主图片 -->
            <img
              :src="img.src"
              :alt="img.alt"
              class="sih-image-259"
            />
            <!-- 光晕效果 -->
            <div class="sih-glow-259"></div>
          </div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div class="sih-progress-259">
        <div class="sih-progress-bar-259" ref="progressBar"></div>
        <span class="sih-progress-text-259">滚动进度: {{ progress }}%</span>
      </div>

      <!-- 状态显示 -->
      <div class="sih-status-259">
        <div class="sih-status-item-259">
          <span class="sih-status-label-259">类型:</span>
          <span class="sih-status-value-259">{{ currentTypeLabel }}</span>
        </div>
        <div class="sih-status-item-259">
          <span class="sih-status-label-259">强度:</span>
          <span class="sih-status-value-259">{{ intensityValue }}x</span>
        </div>
        <div class="sih-status-item-259">
          <span class="sih-status-label-259">速度:</span>
          <span class="sih-status-value-259">{{ speedValue }}x</span>
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

// 全息投影类型
const hologramTypes = [
  { value: 'scan', label: '扫描投影' },
  { value: 'particle', label: '粒子投影' },
  { value: 'wave', label: '波浪投影' },
  { value: 'matrix', label: '矩阵投影' }
]

// 响应式数据
const currentType = ref('scan')
const intensityValue = ref(1)
const speedValue = ref(1)
const progress = ref(0)
const imageItems = ref<HTMLElement[]>([])
const progressBar = ref<HTMLElement>()

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '全息1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '全息2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '全息3'
  }
]

// 存储触发器
let triggers: ScrollTrigger[] = []
let mainTrigger: ScrollTrigger | null = null

// 计算当前类型标签
const currentTypeLabel = computed(() => {
  const type = hologramTypes.find(t => t.value === currentType.value)
  return type?.label || currentType.value
})

// 改变全息类型
const changeHologramType = (type: string) => {
  currentType.value = type
  applyHologramAnimation()
}

// 应用全息动画
const applyHologramAnimation = () => {
  if (!imageItems.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  // 重置所有元素
  gsap.utils.toArray<HTMLElement>('.sih-scanline-259').forEach(el => {
    gsap.set(el, { y: '-100%', opacity: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sih-raster-259').forEach(el => {
    gsap.set(el, { opacity: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sih-hologram-layer-1-259').forEach(el => {
    gsap.set(el, { opacity: 0, x: -50 })
  })
  gsap.utils.toArray<HTMLElement>('.sih-hologram-layer-2-259').forEach(el => {
    gsap.set(el, { opacity: 0, x: 50 })
  })
  gsap.utils.toArray<HTMLElement>('.sih-glow-259').forEach(el => {
    gsap.set(el, { opacity: 0, scale: 0.5 })
  })
  gsap.utils.toArray<HTMLElement>('.sih-image-259').forEach(img => {
    gsap.set(img, { filter: 'none', scale: 1 })
  })

  imageItems.value.forEach((item, index) => {
    const scanline = item.querySelector('.sih-scanline-259') as HTMLElement
    const raster = item.querySelector('.sih-raster-259') as HTMLElement
    const layer1 = item.querySelector('.sih-hologram-layer-1-259') as HTMLElement
    const layer2 = item.querySelector('.sih-hologram-layer-2-259') as HTMLElement
    const glow = item.querySelector('.sih-glow-259') as HTMLElement
    const img = item.querySelector('.sih-image-259') as HTMLElement

    if (!scanline || !raster || !layer1 || !layer2 || !glow || !img) return

    const intensity = intensityValue.value

    const hologramTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    switch (currentType.value) {
      case 'scan':
        // 扫描投影效果
        hologramTimeline
          .to(scanline, {
            y: '200%',
            opacity: 1,
            duration: 2,
            ease: 'none'
          }, 0)
          .to(raster, { opacity: 0.3 * intensity }, 0)
          .to(img, {
            filter: `brightness(1.2) contrast(1.1) hue-rotate(${intensity * 30}deg)`,
            ease: 'power1.inOut'
          }, 0)
          .to(glow, { opacity: 0.4 * intensity, scale: 1.2 }, 0)
        break

      case 'particle':
        // 粒子投影效果
        hologramTimeline
          .fromTo(
            layer1,
            { opacity: 0, x: -100 },
            { opacity: 0.5 * intensity, x: 0, ease: 'power2.out' },
            0
          )
          .fromTo(
            layer2,
            { opacity: 0, x: 100 },
            { opacity: 0.5 * intensity, x: 0, ease: 'power2.out' },
            0.1
          )
          .to(img, {
            filter: `brightness(1.3) saturate(1.2) blur(${intensity * 2}px)`,
            ease: 'power2.out'
          }, 0)
          .to(glow, {
            opacity: 0.6 * intensity,
            scale: 1.5,
            ease: 'elastic.out(1, 0.5)'
          }, 0)
        break

      case 'wave':
        // 波浪投影效果
        hologramTimeline
          .to(scanline, {
            y: '200%',
            opacity: 0.8,
            ease: 'sine.inOut'
          }, 0)
          .to(layer1, {
            opacity: 0.6 * intensity,
            x: 20,
            ease: 'sine.inOut'
          }, 0)
          .to(layer2, {
            opacity: 0.6 * intensity,
            x: -20,
            ease: 'sine.inOut'
          }, 0)
          .to(img, {
            filter: `brightness(1.4) contrast(1.2) hue-rotate(${intensity * 45}deg)`,
            ease: 'sine.inOut'
          }, 0)
          .to(glow, {
            opacity: 0.5 * intensity,
            scale: 1.3,
            ease: 'sine.inOut'
          }, 0)
        break

      case 'matrix':
        // 矩阵投影效果
        hologramTimeline
          .to(raster, { opacity: 0.5 * intensity }, 0)
          .fromTo(
            layer1,
            { opacity: 0, x: -50, rotate: -5 },
            { opacity: 0.4 * intensity, x: 0, rotate: 0, ease: 'steps(5)' },
            0
          )
          .fromTo(
            layer2,
            { opacity: 0, x: 50, rotate: 5 },
            { opacity: 0.4 * intensity, x: 0, rotate: 0, ease: 'steps(5)' },
            0.05
          )
          .to(img, {
            filter: `brightness(1.5) contrast(1.3) saturate(1.5)`,
            ease: 'steps(5)'
          }, 0)
          .to(glow, {
            opacity: 0.7 * intensity,
            scale: 1.4,
            ease: 'steps(5)'
          }, 0)
        break
    }

    triggers.push(hologramTimeline.scrollTrigger!)
  })
}

// 初始化进度条动画
const initProgressBar = () => {
  if (!progressBar.value) return

  mainTrigger = ScrollTrigger.create({
    trigger: '.sih-images-container-259',
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
    applyHologramAnimation()
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
.sih-image-hologram-section-259 {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.sih-container-259 {
  max-width: 1200px;
  margin: 0 auto;
}

.sih-title-259 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #00f5ff 0%, #00a8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
  text-shadow: 0 0 30px rgba(0, 245, 255, 0.5);
}

.sih-control-panel-259 {
  background: rgba(0, 245, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 245, 255, 0.2);
}

.sih-control-group-259 {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.sih-btn-259 {
  padding: 10px 20px;
  background: rgba(0, 245, 255, 0.2);
  border: 2px solid rgba(0, 245, 255, 0.4);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.sih-btn-259:hover {
  background: rgba(0, 245, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
}

.sih-active-259 {
  background: linear-gradient(135deg, #00f5ff 0%, #00a8ff 100%);
  border-color: #00f5ff;
  box-shadow: 0 0 30px rgba(0, 245, 255, 0.6);
}

.sih-slider-group-259 {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.sih-label-259 {
  min-width: 120px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.sih-slider-259 {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(0, 245, 255, 0.2);
  border-radius: 3px;
  outline: none;
}

.sih-slider-259::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #00f5ff 0%, #00a8ff 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
}

.sih-images-container-259 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.sih-image-item-259 {
  aspect-ratio: 3/2;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 245, 255, 0.2);
  position: relative;
}

.sih-hologram-wrapper-259 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.sih-image-259 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 15px;
}

.sih-scanline-259 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 245, 255, 0.8) 50%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 3;
}

.sih-raster-259 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 245, 255, 0.1) 2px,
    rgba(0, 245, 255, 0.1) 4px
  );
  pointer-events: none;
  z-index: 2;
}

.sih-hologram-layer-1-259,
.sih-hologram-layer-2-259 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  z-index: 1;
}

.sih-hologram-layer-1-259 {
  background: linear-gradient(135deg, rgba(0, 245, 255, 0.3) 0%, transparent 100%);
}

.sih-hologram-layer-2-259 {
  background: linear-gradient(135deg, transparent 0%, rgba(0, 168, 255, 0.3) 100%);
}

.sih-glow-259 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(0, 245, 255, 0.4) 0%, transparent 70%);
  pointer-events: none;
  z-index: 4;
}

.sih-progress-259 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid rgba(0, 245, 255, 0.2);
}

.sih-progress-bar-259 {
  height: 4px;
  background: linear-gradient(135deg, #00f5ff 0%, #00a8ff 100%);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
}

.sih-progress-text-259 {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.sih-status-259 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(0, 245, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(0, 245, 255, 0.1);
}

.sih-status-item-259 {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sih-status-label-259 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.sih-status-value-259 {
  font-size: 0.9rem;
  font-weight: bold;
  color: #00f5ff;
}

@media (max-width: 768px) {
  .sih-title-259 {
    font-size: 1.8rem;
  }

  .sih-images-container-259 {
    grid-template-columns: 1fr;
  }

  .sih-status-259 {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
