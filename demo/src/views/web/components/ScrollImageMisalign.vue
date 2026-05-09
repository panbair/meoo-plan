<template>
  <div class="sim-image-misalign-section-251" ref="componentRoot">
    <div class="sim-container-251">
      <h2 class="sim-title-251">图片错位动画</h2>
      <p class="sim-subtitle-251">Image Misalignment Effect</p>

      <!-- 控制面板 -->
      <div class="sim-control-panel-251">
        <div class="sim-control-group-251">
          <label class="sim-control-label-251">错位类型</label>
          <div class="sim-button-group-251">
            <button
              v-for="type in misalignTypes"
              :key="type.id"
              class="sim-type-btn-251"
              :class="{ 'sim-active-251': currentType === type.id }"
              @click="setType(type.id)"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <div class="sim-control-group-251">
          <label class="sim-control-label-251">错位强度: {{ intensityValue }}px</label>
          <input
            type="range"
            v-model="intensityValue"
            min="5"
            max="100"
            step="5"
            class="sim-slider-251"
          />
        </div>

        <div class="sim-control-group-251">
          <label class="sim-control-label-251">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model="speedValue"
            min="0.2"
            max="3"
            step="0.2"
            class="sim-slider-251"
          />
        </div>
      </div>

      <!-- 图片展示区 -->
      <div class="sim-gallery-251">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="sim-image-item-251"
          ref="imageItems"
        >
          <div class="sim-image-wrapper-251">
            <!-- RGB三层分离效果 -->
            <div class="sim-layers-251">
              <div class="sim-layer-251 sim-layer-r-251" :style="{ backgroundImage: `url(${item.image})` }"></div>
              <div class="sim-layer-251 sim-layer-g-251" :style="{ backgroundImage: `url(${item.image})` }"></div>
              <div class="sim-layer-251 sim-layer-b-251" :style="{ backgroundImage: `url(${item.image})` }"></div>
            </div>

            <!-- 图片信息 -->
            <div class="sim-overlay-251">
              <div class="sim-content-251">
                <h3 class="sim-card-title-251">{{ item.title }}</h3>
                <p class="sim-card-desc-251">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动进度 -->
      <div class="sim-progress-251">
        <div class="sim-progress-bar-251">
          <div class="sim-progress-fill-251" ref="progressFill"></div>
        </div>
        <div class="sim-progress-text-251" ref="progressText">0%</div>
      </div>

      <!-- 实时数据显示 -->
      <div class="sim-status-251">
        <div class="sim-status-item-251">
          <span class="sim-status-label-251">当前类型:</span>
          <span class="sim-status-value-251">{{ getTypeName(currentType) }}</span>
        </div>
        <div class="sim-status-item-251">
          <span class="sim-status-label-251">错位强度:</span>
          <span class="sim-status-value-251">{{ intensityValue }}px</span>
        </div>
        <div class="sim-status-item-251">
          <span class="sim-status-label-251">动画速度:</span>
          <span class="sim-status-value-251">{{ speedValue }}x</span>
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
const progressFill = ref<HTMLElement>()
const progressText = ref<HTMLElement>()

const currentType = ref<'rgb' | 'wave' | 'glitch' | 'slice'>('rgb')
const intensityValue = ref(30)
const speedValue = ref(1.0)

interface MisalignType {
  id: 'rgb' | 'wave' | 'glitch' | 'slice'
  name: string
}

const misalignTypes: MisalignType[] = [
  { id: 'rgb', name: 'RGB分离' },
  { id: 'wave', name: '波浪错位' },
  { id: 'glitch', name: '故障错位' },
  { id: 'slice', name: '切片错位' }
]

const getTypeName = (type: string): string => {
  const found = misalignTypes.find(t => t.id === type)
  return found ? found.name : type
}

interface GalleryItem {
  image: string
  title: string
  desc: string
}

const galleryItems = ref<GalleryItem[]>([
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    title: '山脉风景',
    desc: '雄伟的山脉景观'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    title: '海浪海滩',
    desc: '平静的海滩风光'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    title: '森林迷雾',
    desc: '神秘的森林雾气'
  },
  {
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600',
    title: '绿色森林',
    desc: '生机勃勃的绿色'
  }
])

let triggers: ScrollTrigger[] = []

const setType = (type: 'rgb' | 'wave' | 'glitch' | 'slice') => {
  currentType.value = type
  applyMisalignmentAnimation()
}

const applyMisalignmentAnimation = () => {
  if (!imageItems.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  // 重置所有图层
  gsap.utils.toArray<HTMLElement>('.sim-layer-251').forEach(layer => {
    gsap.set(layer, {
      x: 0,
      y: 0,
      opacity: 1
    })
  })

  imageItems.value.forEach((item, index) => {
    const layers = item.querySelectorAll('.sim-layer-251')
    const layerR = layers[0]
    const layerG = layers[1]
    const layerB = layers[2]

    if (!layerR || !layerG || !layerB) return

    const intensity = parseInt(intensityValue.value.toString())
    const duration = 2 / speedValue.value

    switch (currentType.value) {
      case 'rgb':
        // RGB分离效果 - 红绿蓝三层错位移动
        const rgbTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })

        rgbTimeline
          .to(layerR, { x: intensity, opacity: 0.8 }, 0)
          .to(layerG, { y: -intensity, opacity: 0.8 }, 0)
          .to(layerB, { x: -intensity, y: intensity, opacity: 0.8 }, 0)
          .to(layerR, { x: 0, opacity: 1 }, 0.5)
          .to(layerG, { y: 0, opacity: 1 }, 0.5)
          .to(layerB, { x: 0, y: 0, opacity: 1 }, 0.5)

        triggers.push(rgbTimeline.scrollTrigger!)
        break

      case 'wave':
        // 波浪错位效果
        const waveTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })

        waveTimeline
          .to(layerR, { x: 0, y: Math.sin(index * 0.5) * intensity }, 0)
          .to(layerG, { x: intensity * 0.5, y: Math.sin((index + 1) * 0.5) * intensity }, 0.2)
          .to(layerB, { x: -intensity * 0.5, y: Math.sin((index + 2) * 0.5) * intensity }, 0.4)
          .to(layerR, { x: 0, y: 0 }, 0.5)
          .to(layerG, { x: 0, y: 0 }, 0.5)
          .to(layerB, { x: 0, y: 0 }, 0.5)

        triggers.push(waveTimeline.scrollTrigger!)
        break

      case 'glitch':
        // 故障错位效果 - 快速抖动
        const glitchTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })

        for (let i = 0; i < 5; i++) {
          const offsetX = (Math.random() - 0.5) * intensity * 2
          const offsetY = (Math.random() - 0.5) * intensity * 2

          glitchTimeline
            .to(layerR, { x: offsetX }, i * 0.1)
            .to(layerG, { y: offsetY }, i * 0.1)
            .to(layerB, { x: -offsetX, y: -offsetY }, i * 0.1)
        }

        glitchTimeline.to([layerR, layerG, layerB], { x: 0, y: 0 }, 0.6)

        triggers.push(glitchTimeline.scrollTrigger!)
        break

      case 'slice':
        // 切片错位效果 - 水平切片移动
        const sliceTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })

        sliceTimeline
          .to(layerR, { x: 0, y: -intensity }, 0)
          .to(layerG, { x: intensity, y: intensity }, 0)
          .to(layerB, { x: -intensity, y: 0 }, 0)
          .to(layerR, { x: 0, y: 0 }, 0.5)
          .to(layerG, { x: 0, y: 0 }, 0.5)
          .to(layerB, { x: 0, y: 0 }, 0.5)

        triggers.push(sliceTimeline.scrollTrigger!)
        break
    }
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
  // 延迟初始化以确保DOM已渲染
  setTimeout(() => {
    applyMisalignmentAnimation()
    setupProgressIndicator()
  }, 100)
})

onUnmounted(() => {
  triggers.forEach(trigger => trigger.kill())
  triggers = []
})
</script>

<style scoped lang="scss">
.sim-image-misalign-section-251 {
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
    background: radial-gradient(circle at 50% 50%, rgba(100, 100, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
}

.sim-container-251 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sim-title-251 {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(100, 100, 255, 0.5);
}

.sim-subtitle-251 {
  font-size: 20px;
  color: #8888aa;
  text-align: center;
  margin-bottom: 40px;
}

.sim-control-panel-251 {
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

.sim-control-group-251 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.sim-control-label-251 {
  font-size: 14px;
  color: #aaaacc;
  font-weight: 500;
}

.sim-button-group-251 {
  display: flex;
  gap: 10px;
}

.sim-type-btn-251 {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &.sim-active-251 {
    background: rgba(100, 100, 255, 0.3);
    border-color: rgba(100, 100, 255, 0.6);
    box-shadow: 0 0 15px rgba(100, 100, 255, 0.4);
  }
}

.sim-slider-251 {
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
    background: linear-gradient(135deg, #6666ff, #9999ff);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(100, 100, 255, 0.5);
  }
}

.sim-gallery-251 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 40px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.sim-image-item-251 {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.sim-image-wrapper-251 {
  position: relative;
  width: 100%;
  padding-top: 66.67%; // 3:2 比例
  overflow: hidden;
  border-radius: 16px;
}

.sim-layers-251 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.sim-layer-251 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  mix-blend-mode: screen;
  pointer-events: none;
  transition: transform 0.1s ease-out;
}

.sim-layer-r-251 {
  filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="red-filter"><feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/></filter></svg>#red-filter');
  z-index: 3;
}

.sim-layer-g-251 {
  filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="green-filter"><feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"/></filter></svg>#green-filter');
  z-index: 2;
}

.sim-layer-b-251 {
  filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="blue-filter"><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"/></filter></svg>#blue-filter');
  z-index: 1;
}

.sim-overlay-251 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 30px;
  z-index: 10;
}

.sim-content-251 {
  color: #ffffff;
}

.sim-card-title-251 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.sim-card-desc-251 {
  font-size: 16px;
  color: #cccccc;
}

.sim-progress-251 {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.sim-progress-bar-251 {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.sim-progress-fill-251 {
  height: 100%;
  background: linear-gradient(90deg, #6666ff, #9999ff);
  width: 0%;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(100, 100, 255, 0.5);
}

.sim-progress-text-251 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  min-width: 50px;
  text-align: right;
}

.sim-status-251 {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.sim-status-item-251 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sim-status-label-251 {
  font-size: 14px;
  color: #8888aa;
}

.sim-status-value-251 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  padding: 4px 12px;
  background: rgba(100, 100, 255, 0.2);
  border-radius: 4px;
}
</style>
