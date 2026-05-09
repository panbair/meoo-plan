<template>
  <div class="sic-image-crossfade-section-252" ref="componentRoot">
    <div class="sic-container-252">
      <h2 class="sic-title-252">图片交错动画</h2>
      <p class="sic-subtitle-252">Image Crossfade Animation</p>

      <!-- 控制面板 -->
      <div class="sic-control-panel-252">
        <div class="sic-control-group-252">
          <label class="sic-control-label-252">动画类型</label>
          <div class="sic-button-group-252">
            <button
              v-for="type in animationTypes"
              :key="type.id"
              class="sic-type-btn-252"
              :class="{ 'sic-active-252': currentType === type.id }"
              @click="setType(type.id)"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <div class="sic-control-group-252">
          <label class="sic-control-label-252">动画速度: {{ speedValue }}x</label>
          <input
            type="range"
            v-model="speedValue"
            min="0.2"
            max="3"
            step="0.2"
            class="sic-slider-252"
          />
        </div>

        <div class="sic-control-group-252">
          <label class="sic-control-label-252">动画强度: {{ intensityValue }}%</label>
          <input
            type="range"
            v-model="intensityValue"
            min="20"
            max="100"
            step="10"
            class="sic-slider-252"
          />
        </div>

        <div class="sic-control-group-252">
          <label class="sic-control-label-252">交错过渡: {{ overlapValue }}%</label>
          <input
            type="range"
            v-model="overlapValue"
            min="0"
            max="50"
            step="10"
            class="sic-slider-252"
          />
        </div>
      </div>

      <!-- 图片展示区 -->
      <div class="sic-gallery-252">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="sic-image-item-252"
          ref="imageItems"
        >
          <div class="sic-image-wrapper-252">
            <!-- 图片1 -->
            <div class="sic-image-container-252 sic-image-container-1-252">
              <img
                :src="item.image1"
                :alt="item.title1"
                class="sic-image-252"
                ref="images1"
              />
            </div>

            <!-- 图片2 -->
            <div class="sic-image-container-252 sic-image-container-2-252">
              <img
                :src="item.image2"
                :alt="item.title2"
                class="sic-image-252"
                ref="images2"
              />
            </div>

            <!-- 内容遮罩 -->
            <div class="sic-content-overlay-252">
              <div class="sic-content-252">
                <h3 class="sic-card-title-252">{{ item.title }}</h3>
                <p class="sic-card-desc-252">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动进度 -->
      <div class="sic-progress-252">
        <div class="sic-progress-bar-252">
          <div class="sic-progress-fill-252" ref="progressFill"></div>
        </div>
        <div class="sic-progress-text-252" ref="progressText">0%</div>
      </div>

      <!-- 实时数据显示 -->
      <div class="sic-status-252">
        <div class="sic-status-item-252">
          <span class="sic-status-label-252">动画类型:</span>
          <span class="sic-status-value-252">{{ getTypeName(currentType) }}</span>
        </div>
        <div class="sic-status-item-252">
          <span class="sic-status-label-252">速度:</span>
          <span class="sic-status-value-252">{{ speedValue }}x</span>
        </div>
        <div class="sic-status-item-252">
          <span class="sic-status-label-252">强度:</span>
          <span class="sic-status-value-252">{{ intensityValue }}%</span>
        </div>
        <div class="sic-status-item-252">
          <span class="sic-status-label-252">交错:</span>
          <span class="sic-status-value-252">{{ overlapValue }}%</span>
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
const images1 = ref<HTMLElement[]>([])
const images2 = ref<HTMLElement[]>([])
const progressFill = ref<HTMLElement>()
const progressText = ref<HTMLElement>()

const currentType = ref<'crossfade' | 'crosszoom' | 'crossslide' | 'crossmorph' | 'crossrotate'>('crossfade')
const speedValue = ref(1.0)
const intensityValue = ref(60)
const overlapValue = ref(20)

interface AnimationType {
  id: 'crossfade' | 'crosszoom' | 'crossslide' | 'crossmorph' | 'crossrotate'
  name: string
}

const animationTypes: AnimationType[] = [
  { id: 'crossfade', name: '交错淡入淡出' },
  { id: 'crosszoom', name: '交错缩放' },
  { id: 'crossslide', name: '交错滑动' },
  { id: 'crossmorph', name: '交错变形' },
  { id: 'crossrotate', name: '交错旋转' }
]

const getTypeName = (type: string): string => {
  const found = animationTypes.find(t => t.id === type)
  return found ? found.name : type
}

interface GalleryItem {
  image1: string
  image2: string
  title1: string
  title2: string
  title: string
  desc: string
}

const galleryItems = ref<GalleryItem[]>([
  {
    image1: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    image2: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    title1: '山脉风景',
    title2: '雪山远景',
    title: '山脉对比',
    desc: '从不同角度欣赏山脉之美'
  },
  {
    image1: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    image2: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600',
    title1: '平静海滩',
    title2: '日落海滩',
    title: '海滩风光',
    desc: '不同时刻的海滩景色'
  },
  {
    image1: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    image2: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
    title1: '森林迷雾',
    title2: '阳光森林',
    title: '森林四季',
    desc: '森林在不同天气下的变化'
  },
  {
    image1: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600',
    image2: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600',
    title1: '绿色森林',
    title2: '秋日森林',
    title: '色彩对比',
    desc: '森林色彩的丰富变化'
  }
])

let triggers: ScrollTrigger[] = []

const setType = (type: 'crossfade' | 'crosszoom' | 'crossslide' | 'crossmorph' | 'crossrotate') => {
  currentType.value = type
  applyCrossfadeAnimation()
}

const applyCrossfadeAnimation = () => {
  if (!imageItems.value.length || !images1.value.length || !images2.value.length) return

  // 清除之前的动画
  triggers.forEach(trigger => trigger.kill())
  triggers = []

  // 重置所有图片
  gsap.utils.toArray('.sic-image-252').forEach(img => {
    gsap.set(img, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0,
      borderRadius: '0px'
    })
  })

  imageItems.value.forEach((item, index) => {
    const img1 = images1.value[index]
    const img2 = images2.value[index]

    if (!img1 || !img2) return

    const speed = parseFloat(speedValue.value.toString())
    const intensity = parseInt(intensityValue.value.toString()) / 100
    const overlap = parseInt(overlapValue.value.toString()) / 100

    const duration = 1 / speed

    switch (currentType.value) {
      case 'crossfade':
        // 交错淡入淡出
        const fadeTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })

        fadeTimeline
          .to(img1, { opacity: 0 }, 0)
          .fromTo(img2, { opacity: 0 }, { opacity: 1 }, 0.5 * (1 - overlap))

        triggers.push(fadeTimeline.scrollTrigger!)
        break

      case 'crosszoom':
        // 交错缩放
        const zoomTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })

        const zoomScale = 1 + (intensity * 0.5)

        zoomTimeline
          .to(img1, { scale: zoomScale, opacity: 0 }, 0)
          .fromTo(
            img2,
            { scale: 1 - (intensity * 0.3), opacity: 0 },
            { scale: 1, opacity: 1 },
            0.5 * (1 - overlap)
          )

        triggers.push(zoomTimeline.scrollTrigger!)
        break

      case 'crossslide':
        // 交错滑动
        const slideTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })

        const slideDistance = 100 * intensity

        slideTimeline
          .to(img1, { x: -slideDistance, opacity: 0 }, 0)
          .fromTo(
            img2,
            { x: slideDistance, opacity: 0 },
            { x: 0, opacity: 1 },
            0.5 * (1 - overlap)
          )

        triggers.push(slideTimeline.scrollTrigger!)
        break

      case 'crossmorph':
        // 交错变形
        const morphTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })

        const borderRadius = 50 * intensity

        morphTimeline
          .to(img1, {
            borderRadius: `${borderRadius}px`,
            scale: 0.8,
            rotate: 15,
            opacity: 0
          }, 0)
          .fromTo(
            img2,
            {
              borderRadius: `${borderRadius}px`,
              scale: 0.8,
              rotate: -15,
              opacity: 0
            },
            {
              borderRadius: '0px',
              scale: 1,
              rotate: 0,
              opacity: 1
            },
            0.5 * (1 - overlap)
          )

        triggers.push(morphTimeline.scrollTrigger!)
        break

      case 'crossrotate':
        // 交错旋转
        const rotateTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        })

        const rotation = 180 * intensity

        rotateTimeline
          .to(img1, {
            rotation: rotation,
            scale: 0.5,
            opacity: 0
          }, 0)
          .fromTo(
            img2,
            {
              rotation: -rotation,
              scale: 0.5,
              opacity: 0
            },
            {
              rotation: 0,
              scale: 1,
              opacity: 1
            },
            0.5 * (1 - overlap)
          )

        triggers.push(rotateTimeline.scrollTrigger!)
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
  setTimeout(() => {
    applyCrossfadeAnimation()
    setupProgressIndicator()
  }, 100)
})

onUnmounted(() => {
  triggers.forEach(trigger => trigger.kill())
  triggers = []
})
</script>

<style scoped lang="scss">
.sic-image-crossfade-section-252 {
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
    background: radial-gradient(circle at 50% 50%, rgba(147, 112, 219, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
}

.sic-container-252 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.sic-title-252 {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(147, 112, 219, 0.5);
}

.sic-subtitle-252 {
  font-size: 20px;
  color: #8888aa;
  text-align: center;
  margin-bottom: 40px;
}

.sic-control-panel-252 {
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

.sic-control-group-252 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.sic-control-label-252 {
  font-size: 14px;
  color: #aaaacc;
  font-weight: 500;
}

.sic-button-group-252 {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sic-type-btn-252 {
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

  &.sic-active-252 {
    background: rgba(147, 112, 219, 0.3);
    border-color: rgba(147, 112, 219, 0.6);
    box-shadow: 0 0 15px rgba(147, 112, 219, 0.4);
  }
}

.sic-slider-252 {
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
    background: linear-gradient(135deg, #9370db, #dda0dd);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(147, 112, 219, 0.5);
  }
}

.sic-gallery-252 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 40px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.sic-image-item-252 {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.sic-image-wrapper-252 {
  position: relative;
  width: 100%;
  padding-top: 66.67%;
  overflow: hidden;
  border-radius: 16px;
}

.sic-image-container-252 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;
}

.sic-image-container-1-252 {
  z-index: 2;
}

.sic-image-container-2-252 {
  z-index: 1;
}

.sic-image-252 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.sic-content-overlay-252 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 30px;
  z-index: 10;
  pointer-events: none;
}

.sic-content-252 {
  color: #ffffff;
}

.sic-card-title-252 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.sic-card-desc-252 {
  font-size: 16px;
  color: #cccccc;
}

.sic-progress-252 {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.sic-progress-bar-252 {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.sic-progress-fill-252 {
  height: 100%;
  background: linear-gradient(90deg, #9370db, #dda0dd);
  width: 0%;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(147, 112, 219, 0.5);
}

.sic-progress-text-252 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  min-width: 50px;
  text-align: right;
}

.sic-status-252 {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.sic-status-item-252 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sic-status-label-252 {
  font-size: 14px;
  color: #8888aa;
}

.sic-status-value-252 {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  padding: 4px 12px;
  background: rgba(147, 112, 219, 0.2);
  border-radius: 4px;
}
</style>
