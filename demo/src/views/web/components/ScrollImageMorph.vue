<template>
  <div class="sim-image-morph-section-253" ref="componentRoot">
    <div class="sim-container-253">
      <h2 class="sim-title-253">图片变形动画</h2>
      <p class="sim-subtitle-253">Image Morphing Animation</p>

      <!-- 控制面板 -->
      <div class="sim-control-panel-253">
        <div class="sim-control-group-253">
          <label class="sim-control-label-253">变形类型</label>
          <div class="sim-button-group-253">
            <button
              v-for="type in morphTypes"
              :key="type.id"
              class="sim-type-btn-253"
              :class="{ 'sim-active-253': currentType === type.id }"
              @click="setType(type.id)"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <div class="sim-control-group-253">
          <label class="sim-control-label-253">变形程度: {{ morphIntensity }}%</label>
          <input
            type="range"
            v-model="morphIntensity"
            min="10"
            max="100"
            step="10"
            class="sim-slider-253"
          />
        </div>

        <div class="sim-control-group-253">
          <label class="sim-control-label-253">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model="speedValue"
            min="0.2"
            max="3"
            step="0.2"
            class="sim-slider-253"
          />
        </div>

        <div class="sim-control-group-253">
          <label class="sim-control-label-253">弹性: {{ elasticityValue }}</label>
          <input
            type="range"
            v-model="elasticityValue"
            min="0.1"
            max="1"
            step="0.1"
            class="sim-slider-253"
          />
        </div>
      </div>

      <!-- 图片展示区 -->
      <div class="sim-gallery-253">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="sim-image-item-253"
          ref="imageItems"
        >
          <div class="sim-morph-wrapper-253">
            <!-- 原始图片 -->
            <div class="sim-morph-container-253 sim-morph-original-253">
              <img
                :src="item.original"
                :alt="item.title"
                class="sim-morph-image-253"
                ref="originalImages"
              />
              <div class="sim-morph-overlay-253">
                <div class="sim-morph-content-253">
                  <h3 class="sim-card-title-253">{{ item.title }}</h3>
                  <p class="sim-card-desc-253">原始状态</p>
                </div>
              </div>
            </div>

            <!-- 变形图片 -->
            <div class="sim-morph-container-253 sim-morph-transformed-253">
              <img
                :src="item.transformed"
                :alt="item.title"
                class="sim-morph-image-253"
                ref="transformedImages"
              />
              <div class="sim-morph-overlay-253">
                <div class="sim-morph-content-253">
                  <h3 class="sim-card-title-253">{{ item.title }}</h3>
                  <p class="sim-card-desc-253">变形状态</p>
                </div>
              </div>
            </div>

            <!-- 装饰元素 -->
            <div class="sim-morph-decorations-253">
              <div class="sim-decoration-253 sim-deco-1-253"></div>
              <div class="sim-decoration-253 sim-deco-2-253"></div>
              <div class="sim-decoration-253 sim-deco-3-253"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动进度 -->
      <div class="sim-progress-253">
        <div class="sim-progress-bar-253">
          <div class="sim-progress-fill-253" ref="progressFill"></div>
        </div>
        <div class="sim-progress-text-253" ref="progressText">0%</div>
      </div>

      <!-- 实时数据显示 -->
      <div class="sim-status-253">
        <div class="sim-status-item-253">
          <span class="sim-status-label-253">变形类型:</span>
          <span class="sim-status-value-253">{{ getTypeName(currentType) }}</span>
        </div>
        <div class="sim-status-item-253">
          <span class="sim-status-label-253">变形程度:</span>
          <span class="sim-status-value-253">{{ morphIntensity }}%</span>
        </div>
        <div class="sim-status-item-253">
          <span class="sim-status-label-253">速度:</span>
          <span class="sim-status-value-253">{{ speedValue }}x</span>
        </div>
        <div class="sim-status-item-253">
          <span class="sim-status-label-253">弹性:</span>
          <span class="sim-status-value-253">{{ elasticityValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const imageItems = ref<HTMLElement[]>([])
const originalImages = ref<HTMLElement[]>([])
const transformedImages = ref<HTMLElement[]>([])
const progressFill = ref<HTMLElement>()
const progressText = ref<HTMLElement>()

const currentType = ref<'circle' | 'triangle' | 'star' | 'diamond' | 'hexagon' | 'wave'>('circle')
const morphIntensity = ref(60)
const speedValue = ref(1.0)
const elasticityValue = ref(0.5)

interface MorphType {
  id: 'circle' | 'triangle' | 'star' | 'diamond' | 'hexagon' | 'wave'
  name: string
  clipPath: string
}

const morphTypes: MorphType[] = [
  { id: 'circle', name: '圆形', clipPath: 'circle(50% at 50% 50%)' },
  { id: 'triangle', name: '三角形', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  { id: 'star', name: '星形', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  { id: 'diamond', name: '菱形', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
  { id: 'hexagon', name: '六边形', clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
  { id: 'wave', name: '波浪', clipPath: 'polygon(0% 50%, 25% 0%, 50% 50%, 75% 100%, 100% 50%, 75% 0%, 50% 50%, 25% 100%)' }
]

const getTypeName = (type: string): string => {
  const found = morphTypes.find(t => t.id === type)
  return found ? found.name : type
}

interface GalleryItem {
  original: string
  transformed: string
  title: string
  desc: string
}

const galleryItems = ref<GalleryItem[]>([
  {
    original: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    transformed: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    title: '山脉变形',
    desc: '从不同角度欣赏山脉'
  },
  {
    original: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    transformed: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600',
    title: '海滩变形',
    desc: '不同时刻的海滩景色'
  },
  {
    original: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    transformed: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
    title: '森林变形',
    desc: '森林在不同天气下的变化'
  }
])

let triggers: ScrollTrigger[] = []

const setType = (type: 'circle' | 'triangle' | 'star' | 'diamond' | 'hexagon' | 'wave') => {
  currentType.value = type
  applyMorphAnimation()
}

const applyMorphAnimation = () => {
  if (!imageItems.value.length || !originalImages.value.length || !transformedImages.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  const currentMorphType = morphTypes.find(t => t.id === currentType.value)
  if (!currentMorphType) return

  const morphClipPath = currentMorphType.clipPath

  // 重置所有元素
  gsap.utils.toArray('.sim-morph-container-253').forEach(container => {
    gsap.set(container, {
      clipPath: 'none',
      borderRadius: '0px',
      rotation: 0,
      scale: 1,
      opacity: 1
    })
  })

  imageItems.value.forEach((item, index) => {
    const originalContainer = item.querySelector('.sim-morph-original-253') as HTMLElement
    const transformedContainer = item.querySelector('.sim-morph-transformed-253') as HTMLElement
    const deco1 = item.querySelector('.sim-deco-1-253') as HTMLElement
    const deco2 = item.querySelector('.sim-deco-2-253') as HTMLElement
    const deco3 = item.querySelector('.sim-deco-3-253') as HTMLElement

    if (!originalContainer || !transformedContainer) return

    const intensity = parseInt(morphIntensity.value.toString()) / 100
    const speed = parseFloat(speedValue.value.toString())
    const elasticity = parseFloat(elasticityValue.toString())

    const morphTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    // 原始图片变形效果
    morphTimeline
      .to(originalContainer, {
        clipPath: morphClipPath,
        borderRadius: `${50 * intensity}px`,
        rotation: -15 * intensity,
        scale: 1 - (0.2 * intensity),
        opacity: 0.3,
        duration: 1 / speed,
        ease: `elastic.out(${elasticity}, 0.5)`
      }, 0)

    // 变形图片显现效果
    morphTimeline.fromTo(
      transformedContainer,
      {
        clipPath: morphClipPath,
        borderRadius: `${50 * intensity}px`,
        rotation: 15 * intensity,
        scale: 0.8,
        opacity: 0
      },
      {
        clipPath: 'none',
        borderRadius: '0px',
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 1 / speed,
        ease: `elastic.out(${elasticity}, 0.5)`
      },
      0.2
    )

    // 装饰元素动画
    if (deco1) {
      morphTimeline.fromTo(
        deco1,
        { scale: 0, rotation: 0, opacity: 0 },
        { scale: 1, rotation: 360, opacity: 0.5 },
        0.3
      )
    }

    if (deco2) {
      morphTimeline.fromTo(
        deco2,
        { scale: 0, rotation: 0, opacity: 0 },
        { scale: 1.5, rotation: -360, opacity: 0.3 },
        0.4
      )
    }

    if (deco3) {
      morphTimeline.fromTo(
        deco3,
        { scale: 0, rotation: 0, opacity: 0 },
        { scale: 2, rotation: 180, opacity: 0.2 },
        0.5
      )
    }

    triggers.push(morphTimeline.scrollTrigger!)
  })
}

const setupProgressIndicator = () => {
  if (!componentRoot.value || !progressFill.value || !progressText.value) return

  const progressTrigger = ScrollTrigger.create({
    trigger: componentRoot.value,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const progress = Math.round(self.progress * 100)
      if (progressFill.value) {
        progressFill.value.style.width = `${progress}%`
      }
      if (progressText.value) {
        progressText.value.textContent = `${progress}%`
      }
    }
  })

  triggers.push(progressTrigger)
}

onMounted(() => {
  setTimeout(() => {
    applyMorphAnimation()
    setupProgressIndicator()
  }, 100)
})

onUnmounted(() => {
  triggers.forEach(trigger => trigger.kill())
  triggers = []
})
</script>

<style scoped lang="scss">
.sim-image-morph-section-253 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(0, 191, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
}

.sim-container-253 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sim-title-253 {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
}

.sim-subtitle-253 {
  font-size: 20px;
  color: #8888aa;
  text-align: center;
  margin-bottom: 40px;
}

.sim-control-panel-253 {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 50px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.sim-control-group-253 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.sim-control-label-253 {
  font-size: 14px;
  color: #aaaacc;
  font-weight: 500;
}

.sim-button-group-253 {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sim-type-btn-253 {
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &.sim-active-253 {
    background: rgba(0, 191, 255, 0.3);
    border-color: rgba(0, 191, 255, 0.6);
    box-shadow: 0 0 15px rgba(0, 191, 255, 0.4);
  }
}

.sim-slider-253 {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #00bfff, #1e90ff);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
  }
}

.sim-gallery-253 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(700px, 1fr));
  gap: 50px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.sim-image-item-253 {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  padding: 20px;
  position: relative;
}

.sim-morph-wrapper-253 {
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.sim-morph-container-253 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sim-morph-original-253 {
  z-index: 2;
}

.sim-morph-transformed-253 {
  z-index: 1;
}

.sim-morph-image-253 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform, clip-path;
}

.sim-morph-overlay-253 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 20px;
  z-index: 10;
}

.sim-morph-content-253 {
  color: #ffffff;
}

.sim-card-title-253 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.sim-card-desc-253 {
  font-size: 14px;
  color: #cccccc;
}

.sim-morph-decorations-253 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.sim-decoration-253 {
  position: absolute;
  border: 2px solid rgba(0, 191, 255, 0.3);
  border-radius: 50%;
}

.sim-deco-1-253 {
  top: 10%;
  left: 10%;
  width: 80px;
  height: 80px;
}

.sim-deco-2-253 {
  top: 60%;
  right: 10%;
  width: 120px;
  height: 120px;
}

.sim-deco-3-253 {
  bottom: 10%;
  left: 30%;
  width: 60px;
  height: 60px;
}

.sim-progress-253 {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.sim-progress-bar-253 {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.sim-progress-fill-253 {
  height: 100%;
  background: linear-gradient(90deg, #00bfff, #1e90ff);
  width: 0%;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}

.sim-progress-text-253 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  min-width: 50px;
  text-align: right;
}

.sim-status-253 {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.sim-status-item-253 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sim-status-label-253 {
  font-size: 14px;
  color: #8888aa;
}

.sim-status-value-253 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  padding: 4px 12px;
  background: rgba(0, 191, 255, 0.2);
  border-radius: 4px;
}
</style>
