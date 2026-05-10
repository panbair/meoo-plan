<template>
  <section class="sin-image-neon-section-261">
    <div class="sin-container-261">
      <!-- 标题 -->
      <h2 class="sin-title-261">霓虹光效图片</h2>

      <!-- 控制面板 -->
      <div class="sin-control-panel-261">
        <div class="sin-control-group-261">
          <button
            v-for="type in neonTypes"
            :key="type.value"
            @click="changeNeonType(type.value)"
            :class="['sin-btn-261', { 'sin-active-261': currentType === type.value }]"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="sin-slider-group-261">
          <label class="sin-label-261">光效强度: {{ intensityValue }}</label>
          <input
            type="range"
            v-model.number="intensityValue"
            min="0.1"
            max="2"
            step="0.1"
            class="sin-slider-261"
            @input="applyNeonAnimation"
          />
        </div>

        <div class="sin-slider-group-261">
          <label class="sin-label-261">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model.number="speedValue"
            min="0.2"
            max="3"
            step="0.1"
            class="sin-slider-261"
            @input="applyNeonAnimation"
          />
        </div>
      </div>

      <!-- 图片容器 -->
      <div class="sin-images-container-261">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="sin-image-item-261"
          ref="imageItems"
        >
          <div class="sin-neon-wrapper-261">
            <!-- 霓虹边框 -->
            <div class="sin-neon-border-261"></div>
            <!-- 光晕层 -->
            <div class="sin-glow-layer-261"></div>
            <!-- 霓虹发光层 -->
            <div class="sin-neon-glow-261"></div>
            <!-- 主图片 -->
            <img
              :src="img.src"
              :alt="img.alt"
              class="sin-image-261"
            />
            <!-- 反射层 -->
            <div class="sin-reflection-261"></div>
          </div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div class="sin-progress-261">
        <div class="sin-progress-bar-261" ref="progressBar"></div>
        <span class="sin-progress-text-261">滚动进度: {{ progress }}%</span>
      </div>

      <!-- 状态显示 -->
      <div class="sin-status-261">
        <div class="sin-status-item-261">
          <span class="sin-status-label-261">类型:</span>
          <span class="sin-status-value-261">{{ currentTypeLabel }}</span>
        </div>
        <div class="sin-status-item-261">
          <span class="sin-status-label-261">强度:</span>
          <span class="sin-status-value-261">{{ intensityValue }}x</span>
        </div>
        <div class="sin-status-item-261">
          <span class="sin-status-label-261">速度:</span>
          <span class="sin-status-value-261">{{ speedValue }}x</span>
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

// 霓虹类型
const neonTypes = [
  { value: 'cyan', label: '青色霓虹' },
  { value: 'magenta', label: '洋红霓虹' },
  { value: 'rainbow', label: '彩虹霓虹' },
  { value: 'pulse', label: '脉冲霓虹' }
]

// 响应式数据
const currentType = ref('cyan')
const intensityValue = ref(1)
const speedValue = ref(1)
const progress = ref(0)
const imageItems = ref<HTMLElement[]>([])
const progressBar = ref<HTMLElement>()

// 示例图片
const images = [
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop',
    alt: '霓虹1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop',
    alt: '霓虹2'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=600&h=400&fit=crop',
    alt: '霓虹3'
  }
]

// 存储触发器
let triggers: ScrollTrigger[] = []
let mainTrigger: ScrollTrigger | null = null

// 计算当前类型标签
const currentTypeLabel = computed(() => {
  const type = neonTypes.find(t => t.value === currentType.value)
  return type?.label || currentType.value
})

// 改变霓虹类型
const changeNeonType = (type: string) => {
  currentType.value = type
  applyNeonAnimation()
}

// 应用霓虹动画
const applyNeonAnimation = () => {
  if (!imageItems.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  // 重置所有元素
  gsap.utils.toArray<HTMLElement>('.sin-neon-border-261').forEach(border => {
    gsap.set(border, { opacity: 0, scale: 0.8 })
  })
  gsap.utils.toArray<HTMLElement>('.sin-glow-layer-261').forEach(glow => {
    gsap.set(glow, { opacity: 0, scale: 0.5 })
  })
  gsap.utils.toArray<HTMLElement>('.sin-neon-glow-261').forEach(neon => {
    gsap.set(neon, { opacity: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sin-reflection-261').forEach(ref => {
    gsap.set(ref, { opacity: 0 })
  })
  gsap.utils.toArray<HTMLElement>('.sin-image-261').forEach(img => {
    gsap.set(img, { filter: 'none', scale: 1 })
  })

  imageItems.value.forEach((item, index) => {
    const border = item.querySelector('.sin-neon-border-261') as HTMLElement
    const glowLayer = item.querySelector('.sin-glow-layer-261') as HTMLElement
    const neonGlow = item.querySelector('.sin-neon-glow-261') as HTMLElement
    const reflection = item.querySelector('.sin-reflection-261') as HTMLElement
    const img = item.querySelector('.sin-image-261') as HTMLElement

    if (!border || !glowLayer || !neonGlow || !reflection || !img) return

    const intensity = intensityValue.value

    const neonTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    switch (currentType.value) {
      case 'cyan':
        // 青色霓虹效果
        neonTimeline
          .to(border, {
            opacity: 1,
            scale: 1.1,
            boxShadow: `0 0 ${30 * intensity}px #00ffff, 0 0 ${60 * intensity}px #00ffff`,
            ease: 'power2.out'
          }, 0)
          .to(glowLayer, {
            opacity: 0.6 * intensity,
            scale: 1.3,
            boxShadow: `0 0 ${50 * intensity}px #00ffff, 0 0 ${100 * intensity}px #00ffff`,
            ease: 'power2.out'
          }, 0)
          .to(neonGlow, {
            opacity: 0.5 * intensity,
            background: 'radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%)',
            ease: 'power2.out'
          }, 0)
          .to(img, {
            filter: `brightness(1.3) contrast(1.2) saturate(1.4)`,
            ease: 'power2.out'
          }, 0)
          .to(reflection, {
            opacity: 0.4 * intensity,
            ease: 'power2.out'
          }, 0)
        break

      case 'magenta':
        // 洋红霓虹效果
        neonTimeline
          .to(border, {
            opacity: 1,
            scale: 1.1,
            boxShadow: `0 0 ${30 * intensity}px #ff00ff, 0 0 ${60 * intensity}px #ff00ff`,
            ease: 'power2.out'
          }, 0)
          .to(glowLayer, {
            opacity: 0.6 * intensity,
            scale: 1.3,
            boxShadow: `0 0 ${50 * intensity}px #ff00ff, 0 0 ${100 * intensity}px #ff00ff`,
            ease: 'power2.out'
          }, 0)
          .to(neonGlow, {
            opacity: 0.5 * intensity,
            background: 'radial-gradient(circle, rgba(255, 0, 255, 0.4) 0%, transparent 70%)',
            ease: 'power2.out'
          }, 0)
          .to(img, {
            filter: `brightness(1.3) contrast(1.2) saturate(1.4) hue-rotate(120deg)`,
            ease: 'power2.out'
          }, 0)
          .to(reflection, {
            opacity: 0.4 * intensity,
            ease: 'power2.out'
          }, 0)
        break

      case 'rainbow':
        // 彩虹霓虹效果
        neonTimeline
          .to(border, {
            opacity: 1,
            scale: 1.1,
            boxShadow: `0 0 ${30 * intensity}px #ff0000, 0 0 ${30 * intensity}px #00ff00, 0 0 ${30 * intensity}px #0000ff`,
            ease: 'power2.out'
          }, 0)
          .to(glowLayer, {
            opacity: 0.6 * intensity,
            scale: 1.3,
            boxShadow: `0 0 ${50 * intensity}px #ff0000, 0 0 ${50 * intensity}px #00ff00, 0 0 ${50 * intensity}px #0000ff`,
            ease: 'power2.out'
          }, 0)
          .to(neonGlow, {
            opacity: 0.5 * intensity,
            background: 'linear-gradient(45deg, rgba(255, 0, 0, 0.3) 0%, rgba(0, 255, 0, 0.3) 50%, rgba(0, 0, 255, 0.3) 100%)',
            ease: 'power2.out'
          }, 0)
          .to(img, {
            filter: `brightness(1.4) contrast(1.3) saturate(1.6)`,
            ease: 'power2.out'
          }, 0)
          .to(reflection, {
            opacity: 0.5 * intensity,
            ease: 'power2.out'
          }, 0)
        break

      case 'pulse':
        // 脉冲霓虹效果
        neonTimeline
          .to(border, {
            opacity: 1,
            scale: 1.2,
            boxShadow: `0 0 ${40 * intensity}px #00ffff, 0 0 ${80 * intensity}px #00ffff`,
            ease: 'elastic.out(1, 0.5)'
          }, 0)
          .to(glowLayer, {
            opacity: 0.7 * intensity,
            scale: 1.5,
            boxShadow: `0 0 ${60 * intensity}px #00ffff, 0 0 ${120 * intensity}px #00ffff`,
            ease: 'elastic.out(1, 0.5)'
          }, 0)
          .to(neonGlow, {
            opacity: 0.6 * intensity,
            scale: 1.8,
            background: 'radial-gradient(circle, rgba(0, 255, 255, 0.5) 0%, transparent 70%)',
            ease: 'elastic.out(1, 0.5)'
          }, 0)
          .to(img, {
            filter: `brightness(1.5) contrast(1.3) saturate(1.5)`,
            scale: 1.05,
            ease: 'elastic.out(1, 0.5)'
          }, 0)
          .to(reflection, {
            opacity: 0.5 * intensity,
            ease: 'elastic.out(1, 0.5)'
          }, 0)
        break
    }

    triggers.push(neonTimeline.scrollTrigger!)
  })
}

// 初始化进度条动画
const initProgressBar = () => {
  if (!progressBar.value) return

  mainTrigger = ScrollTrigger.create({
    trigger: '.sin-images-container-261',
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
    applyNeonAnimation()
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
.sin-image-neon-section-261 {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.sin-container-261 {
  max-width: 1200px;
  margin: 0 auto;
}

.sin-title-261 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
}

.sin-control-panel-261 {
  background: rgba(0, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.sin-control-group-261 {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.sin-btn-261 {
  padding: 10px 20px;
  background: rgba(0, 255, 255, 0.2);
  border: 2px solid rgba(0, 255, 255, 0.4);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.sin-btn-261:hover {
  background: rgba(0, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

.sin-active-261 {
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  border-color: #00ffff;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
}

.sin-slider-group-261 {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.sin-label-261 {
  min-width: 120px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.sin-slider-261 {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(90deg, #00ffff 0%, #ff00ff 100%);
  border-radius: 3px;
  outline: none;
}

.sin-slider-261::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.sin-images-container-261 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.sin-image-item-261 {
  aspect-ratio: 3/2;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 255, 255, 0.2);
  position: relative;
}

.sin-neon-wrapper-261 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.sin-image-261 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 15px;
  position: relative;
  z-index: 1;
}

.sin-neon-border-261 {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 20px;
  border: 3px solid #00ffff;
  opacity: 0;
  z-index: 3;
  pointer-events: none;
}

.sin-glow-layer-261 {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 25px;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  z-index: 2;
  pointer-events: none;
}

.sin-neon-glow-261 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 4;
  pointer-events: none;
  mix-blend-mode: screen;
}

.sin-reflection-261 {
  position: absolute;
  bottom: -50%;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  z-index: 5;
  pointer-events: none;
  transform: scaleY(-1);
}

.sin-progress-261 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.sin-progress-bar-261 {
  height: 4px;
  background: linear-gradient(90deg, #00ffff 0%, #ff00ff 100%);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.sin-progress-text-261 {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.sin-status-261 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(0, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(0, 255, 255, 0.1);
}

.sin-status-item-261 {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sin-status-label-261 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.sin-status-value-261 {
  font-size: 0.9rem;
  font-weight: bold;
  color: #00ffff;
}

@media (max-width: 768px) {
  .sin-title-261 {
    font-size: 1.8rem;
  }

  .sin-images-container-261 {
    grid-template-columns: 1fr;
  }

  .sin-status-261 {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
