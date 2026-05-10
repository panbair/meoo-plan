<template>
  <div class="sip-image-parallax-section-254" ref="componentRoot">
    <div class="sip-container-254">
      <h2 class="sip-title-254">图片多层视差</h2>
      <p class="sip-subtitle-254">Multi-layer Image Parallax</p>

      <!-- 控制面板 -->
      <div class="sip-control-panel-254">
        <div class="sip-control-group-254">
          <label class="sip-control-label-254">视差模式</label>
          <div class="sip-button-group-254">
            <button
              v-for="mode in parallaxModes"
              :key="mode.id"
              class="sip-mode-btn-254"
              :class="{ 'sip-active-254': currentMode === mode.id }"
              @click="setMode(mode.id)"
            >
              {{ mode.name }}
            </button>
          </div>
        </div>

        <div class="sip-control-group-254">
          <label class="sip-control-label-254">视差强度: {{ parallaxIntensity }}x</label>
          <input
            type="range"
            v-model="parallaxIntensity"
            min="0.2"
            max="2"
            step="0.2"
            class="sip-slider-254"
          />
        </div>

        <div class="sip-control-group-254">
          <label class="sip-control-label-254">层级数量: {{ layerCount }}</label>
          <div class="sip-layer-buttons-254">
            <button
              v-for="count in [3, 4, 5, 6]"
              :key="count"
              class="sip-layer-btn-254"
              :class="{ 'sip-active-254': layerCount === count }"
              @click="layerCount = count; applyParallaxAnimation()"
            >
              {{ count }}层
            </button>
          </div>
        </div>

        <div class="sip-control-group-254">
          <label class="sip-control-label-254">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model="speedValue"
            min="0.2"
            max="3"
            step="0.2"
            class="sip-slider-254"
          />
        </div>
      </div>

      <!-- 图片展示区 -->
      <div class="sip-gallery-254">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="sip-image-item-254"
          ref="imageItems"
        >
          <div class="sip-parallax-wrapper-254">
            <!-- 多层图片 -->
            <div class="sip-layers-254">
              <div
                v-for="layer in layerCount"
                :key="layer"
                class="sip-layer-254"
                :class="`sip-layer-${layer}-254`"
                :style="{
                  backgroundImage: `url(${item.image})`,
                  zIndex: layer
                }"
              ></div>
            </div>

            <!-- 装饰元素 -->
            <div class="sip-particles-254">
              <div
                v-for="i in 8"
                :key="i"
                class="sip-particle-254"
                :class="`sip-particle-${i}-254`"
              ></div>
            </div>

            <!-- 内容遮罩 -->
            <div class="sip-content-overlay-254">
              <div class="sip-content-254">
                <h3 class="sip-card-title-254">{{ item.title }}</h3>
                <p class="sip-card-desc-254">{{ item.desc }}</p>
                <div class="sip-layers-info-254">
                  <span>{{ layerCount }}层视差</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动进度 -->
      <div class="sip-progress-254">
        <div class="sip-progress-bar-254">
          <div class="sip-progress-fill-254" ref="progressFill"></div>
        </div>
        <div class="sip-progress-text-254" ref="progressText">0%</div>
      </div>

      <!-- 实时数据显示 -->
      <div class="sip-status-254">
        <div class="sip-status-item-254">
          <span class="sip-status-label-254">视差模式:</span>
          <span class="sip-status-value-254">{{ getModeName(currentMode) }}</span>
        </div>
        <div class="sip-status-item-254">
          <span class="sip-status-label-254">强度:</span>
          <span class="sip-status-value-254">{{ parallaxIntensity }}x</span>
        </div>
        <div class="sip-status-item-254">
          <span class="sip-status-label-254">层数:</span>
          <span class="sip-status-value-254">{{ layerCount }}</span>
        </div>
        <div class="sip-status-item-254">
          <span class="sip-status-label-254">速度:</span>
          <span class="sip-status-value-254">{{ speedValue }}x</span>
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

const currentMode = ref<'vertical' | 'horizontal' | 'diagonal' | 'radial'>('vertical')
const parallaxIntensity = ref(1.0)
const layerCount = ref(4)
const speedValue = ref(1.0)

interface ParallaxMode {
  id: 'vertical' | 'horizontal' | 'diagonal' | 'radial'
  name: string
}

const parallaxModes: ParallaxMode[] = [
  { id: 'vertical', name: '垂直视差' },
  { id: 'horizontal', name: '水平视差' },
  { id: 'diagonal', name: '对角视差' },
  { id: 'radial', name: '径向视差' }
]

const getModeName = (mode: string): string => {
  const found = parallaxModes.find(m => m.id === mode)
  return found ? found.name : mode
}

interface GalleryItem {
  image: string
  title: string
  desc: string
}

const galleryItems = ref<GalleryItem[]>([
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    title: '山脉深景',
    desc: '多层山脉视差效果'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    title: '海洋深蓝',
    desc: '海洋层次视差效果'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    title: '森林迷雾',
    desc: '森林层次视差效果'
  },
  {
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    title: '星空银河',
    desc: '星空层次视差效果'
  }
])

let triggers: ScrollTrigger[] = []

const setMode = (mode: 'vertical' | 'horizontal' | 'diagonal' | 'radial') => {
  currentMode.value = mode
  applyParallaxAnimation()
}

const applyParallaxAnimation = () => {
  if (!imageItems.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  // 重置所有图层
  gsap.utils.toArray('.sip-layer-254').forEach(layer => {
    gsap.set(layer, {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1
    })
  })

  imageItems.value.forEach((item, index) => {
    const layers = item.querySelectorAll('.sip-layer-254')
    const particles = item.querySelectorAll('.sip-particle-254')

    if (!layers.length) return

    const intensity = parseFloat(parallaxIntensity.value.toString())
    const speed = parseFloat(speedValue.value.toString())

    const parallaxTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })

    // 根据视差模式应用动画
    layers.forEach((layer, layerIndex) => {
      const depth = (layerIndex + 1) / layers.length
      const layerIntensity = intensity * depth

      switch (currentMode.value) {
        case 'vertical':
          // 垂直视差
          parallaxTimeline.to(
            layer,
            {
              y: 50 * layerIntensity,
              scale: 1 + (0.1 * depth),
              duration: 1 / speed
            },
            0
          )
          break

        case 'horizontal':
          // 水平视差
          parallaxTimeline.to(
            layer,
            {
              x: 50 * layerIntensity,
              scale: 1 + (0.1 * depth),
              duration: 1 / speed
            },
            0
          )
          break

        case 'diagonal':
          // 对角视差
          parallaxTimeline.to(
            layer,
            {
              x: 30 * layerIntensity,
              y: 30 * layerIntensity,
              scale: 1 + (0.1 * depth),
              duration: 1 / speed
            },
            0
          )
          break

        case 'radial':
          // 径向视差（缩放+旋转）
          parallaxTimeline.to(
            layer,
            {
              scale: 1 + (0.3 * depth),
              rotate: 5 * layerIntensity,
              duration: 1 / speed
            },
            0
          )
          break
      }
    })

    // 粒子动画
    particles.forEach((particle, pIndex) => {
      const pIntensity = intensity * ((pIndex + 1) / particles.length)

      parallaxTimeline.to(
        particle,
        {
          x: (Math.random() - 0.5) * 100 * pIntensity,
          y: (Math.random() - 0.5) * 100 * pIntensity,
          scale: 1 + Math.random() * 0.5,
          rotate: Math.random() * 360,
          opacity: 0.3 + Math.random() * 0.4,
          duration: 1 / speed
        },
        0
      )
    })

    triggers.push(parallaxTimeline.scrollTrigger!)
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
    applyParallaxAnimation()
    setupProgressIndicator()
  }, 100)
})

onUnmounted(() => {
  triggers.forEach(trigger => trigger.kill())
  triggers = []
})
</script>

<style scoped lang="scss">
.sip-image-parallax-section-254 {
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
    background: radial-gradient(circle at 50% 50%, rgba(255, 99, 71, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
}

.sip-container-254 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sip-title-254 {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(255, 99, 71, 0.5);
}

.sip-subtitle-254 {
  font-size: 20px;
  color: #8888aa;
  text-align: center;
  margin-bottom: 40px;
}

.sip-control-panel-254 {
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

.sip-control-group-254 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.sip-control-label-254 {
  font-size: 14px;
  color: #aaaacc;
  font-weight: 500;
}

.sip-button-group-254 {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sip-mode-btn-254 {
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

  &.sip-active-254 {
    background: rgba(255, 99, 71, 0.3);
    border-color: rgba(255, 99, 71, 0.6);
    box-shadow: 0 0 15px rgba(255, 99, 71, 0.4);
  }
}

.sip-layer-buttons-254 {
  display: flex;
  gap: 8px;
}

.sip-layer-btn-254 {
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

  &.sip-active-254 {
    background: rgba(255, 99, 71, 0.3);
    border-color: rgba(255, 99, 71, 0.6);
    box-shadow: 0 0 15px rgba(255, 99, 71, 0.4);
  }
}

.sip-slider-254 {
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
    background: linear-gradient(135deg, #ff6347, #ff8c69);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 99, 71, 0.5);
  }
}

.sip-gallery-254 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 40px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.sip-image-item-254 {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.sip-parallax-wrapper-254 {
  position: relative;
  width: 100%;
  padding-top: 66.67%;
  overflow: hidden;
  border-radius: 16px;
}

.sip-layers-254 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.sip-layer-254 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.sip-particles-254 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.sip-particle-254 {
  position: absolute;
  background: rgba(255, 99, 71, 0.3);
  border-radius: 50%;
  will-change: transform, opacity;
}

.sip-particle-1-254 { top: 10%; left: 10%; width: 8px; height: 8px; }
.sip-particle-2-254 { top: 20%; right: 15%; width: 12px; height: 12px; }
.sip-particle-3-254 { top: 40%; left: 20%; width: 6px; height: 6px; }
.sip-particle-4-254 { top: 60%; right: 25%; width: 10px; height: 10px; }
.sip-particle-5-254 { bottom: 30%; left: 30%; width: 8px; height: 8px; }
.sip-particle-6-254 { bottom: 20%; right: 20%; width: 14px; height: 14px; }
.sip-particle-7-254 { top: 50%; left: 50%; width: 6px; height: 6px; }
.sip-particle-8-254 { bottom: 10%; right: 10%; width: 10px; height: 10px; }

.sip-content-overlay-254 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 30px;
  z-index: 20;
}

.sip-content-254 {
  color: #ffffff;
}

.sip-card-title-254 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.sip-card-desc-254 {
  font-size: 16px;
  color: #cccccc;
  margin-bottom: 12px;
}

.sip-layers-info-254 {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 99, 71, 0.3);
  border-radius: 4px;
  font-size: 12px;
  color: #ffffff;
}

.sip-progress-254 {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.sip-progress-bar-254 {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.sip-progress-fill-254 {
  height: 100%;
  background: linear-gradient(90deg, #ff6347, #ff8c69);
  width: 0%;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(255, 99, 71, 0.5);
}

.sip-progress-text-254 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  min-width: 50px;
  text-align: right;
}

.sip-status-254 {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.sip-status-item-254 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sip-status-label-254 {
  font-size: 14px;
  color: #8888aa;
}

.sip-status-value-254 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  padding: 4px 12px;
  background: rgba(255, 99, 71, 0.2);
  border-radius: 4px;
}
</style>
