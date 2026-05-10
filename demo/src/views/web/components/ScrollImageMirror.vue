<template>
  <div class="smi-section-231" ref="componentRoot">
    <div class="smi-container-231">
      <h2 class="smi-title-231">镜像图片展示</h2>
      <p class="smi-subtitle-231">Mirror Image Gallery</p>

      <!-- 控制面板 -->
      <div class="smi-control-panel-231">
        <div class="smi-control-group-231">
          <label class="smi-label-231">镜像距离</label>
          <input
            type="range"
            min="0"
            max="100"
            v-model.number="mirrorDistance"
            class="smi-slider-231"
          />
          <span class="smi-value-231">{{ mirrorDistance }}px</span>
        </div>
        <div class="smi-control-group-231">
          <label class="smi-label-231">反射强度</label>
          <input
            type="range"
            min="0"
            max="100"
            v-model.number="reflectionIntensity"
            class="smi-slider-231"
          />
          <span class="smi-value-231">{{ reflectionIntensity }}%</span>
        </div>
        <div class="smi-control-group-231">
          <label class="smi-label-231">镜像角度</label>
          <input
            type="range"
            min="0"
            max="180"
            v-model.number="mirrorAngle"
            class="smi-slider-231"
          />
          <span class="smi-value-231">{{ mirrorAngle }}°</span>
        </div>
      </div>

      <!-- 镜像画廊 -->
      <div class="smi-mirror-gallery-231">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="smi-mirror-item-231"
          :class="{ 'smi-active-231': currentIndex === index }"
          @click="setCurrentImage(index)"
        >
          <div class="smi-mirror-stage-231">
            <!-- 原始图片 -->
            <div class="smi-original-231">
              <img
                :src="image.src"
                :alt="image.title"
                class="smi-base-image-231"
              />
              <div class="smi-original-overlay-231">
                <div class="smi-overlay-gradient-231"></div>
              </div>
            </div>

            <!-- 镜面 -->
            <div class="smi-mirror-surface-231" :style="getMirrorStyle()">
              <div class="smi-mirror-glow-231"></div>
            </div>

            <!-- 镜像图片 -->
            <div class="smi-reflection-231">
              <img
                :src="image.src"
                :alt="image.title"
                class="smi-reflection-image-231"
                :style="getReflectionStyle()"
              />
              <div class="smi-reflection-overlay-231">
                <div class="smi-reflection-ripple-231" v-for="i in 3" :key="i"></div>
              </div>
            </div>
          </div>

          <div class="smi-image-info-231">
            <h3 class="smi-image-title-231">{{ image.title }}</h3>
            <p class="smi-image-desc-231">{{ image.desc }}</p>
          </div>
        </div>
      </div>

      <!-- 镜像特效开关 -->
      <div class="smi-effect-toggles-231">
        <label class="smi-toggle-231">
          <input type="checkbox" v-model="enableRipple" />
          <span>水波纹效果</span>
        </label>
        <label class="smi-toggle-231">
          <input type="checkbox" v-model="enableGlow" />
          <span>镜像光晕</span>
        </label>
        <label class="smi-toggle-231">
          <input type="checkbox" v-model="enableBlur" />
          <span>边缘模糊</span>
        </label>
      </div>

      <!-- 镜像状态指示器 -->
      <div class="smi-mirror-status-231">
        <div class="smi-status-bar-231">
          <div class="smi-status-fill-231" :style="{ width: mirrorStatus + '%' }"></div>
        </div>
        <div class="smi-status-info-231">
          <span class="smi-status-label-231">镜像完整性</span>
          <span class="smi-status-value-231">{{ Math.round(mirrorStatus) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const currentIndex = ref(0)
const mirrorDistance = ref(30)
const reflectionIntensity = ref(70)
const mirrorAngle = ref(0)
const mirrorStatus = ref(100)
const enableRipple = ref(true)
const enableGlow = ref(true)
const enableBlur = ref(true)

interface MirrorImage {
  src: string
  title: string
  desc: string
}

const images: MirrorImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    title: '山川镜像',
    desc: 'Mountain Mirror'
  },
  {
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600',
    title: '海洋倒影',
    desc: 'Ocean Reflection'
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
    title: '森林镜面',
    desc: 'Forest Mirror'
  },
  {
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
    title: '星空反射',
    desc: 'Starry Reflection'
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    title: '都市镜像',
    desc: 'City Mirror'
  }
]

const setCurrentImage = (index: number) => {
  currentIndex.value = index
}

const getMirrorStyle = () => {
  return {
    height: `${mirrorDistance.value}px`,
    transform: `rotateX(${mirrorAngle.value}deg)`,
    background: enableGlow.value
      ? `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)`
      : 'transparent'
  }
}

const getReflectionStyle = () => {
  return {
    opacity: reflectionIntensity.value / 100,
    transform: `scaleY(-1) rotateX(${mirrorAngle.value}deg)`,
    filter: enableBlur.value ? 'blur(2px) brightness(0.8)' : 'none'
  }
}

let rippleAnimations: gsap.core.Tween[] = []
let statusInterval: number | null = null

const initMirrorEffects = () => {
  const items = document.querySelectorAll('.smi-mirror-item-231')
  const reflections = document.querySelectorAll('.smi-reflection-image-231')
  const ripples = document.querySelectorAll('.smi-reflection-ripple-231')
  const glows = document.querySelectorAll('.smi-mirror-glow-231')

  // 水波纹效果
  if (enableRipple.value) {
    rippleAnimations = Array.from(ripples).map((ripple, index) => {
      return gsap.to(ripple, {
        scale: 1.5,
        opacity: 0,
        duration: 2 + index,
        repeat: -1,
        ease: 'power1.out',
        delay: index * 0.5
      })
    })
  }

  // 镜像光晕
  gsap.to(glows, {
    opacity: 0.5,
    scale: 1.1,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  // 滚动触发
  items.forEach((item, index) => {
    gsap.fromTo(item,
      {
        y: 100,
        opacity: 0,
        rotationX: 15
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'top 25%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // 状态指示器动画
  statusInterval = window.setInterval(() => {
    const variation = Math.sin(Date.now() / 1000) * 5
    mirrorStatus.value = 95 + variation
  }, 50)

  // 鼠标交互
  items.forEach(item => {
    const mirrorStage = item.querySelector('.smi-mirror-stage-231') as HTMLElement

    mirrorStage.addEventListener('mousemove', (e) => {
      const rect = mirrorStage.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      gsap.to(item.querySelector('.smi-base-image-231'), {
        scale: 1 + x * 0.1,
        duration: 0.3,
        ease: 'power2.out'
      })

      gsap.to(item.querySelector('.smi-reflection-image-231'), {
        scale: 1 - x * 0.1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    mirrorStage.addEventListener('mouseleave', () => {
      gsap.to([item.querySelector('.smi-base-image-231'), item.querySelector('.smi-reflection-image-231')], {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      })
    })
  })
}

const cleanup = () => {
  rippleAnimations.forEach(anim => anim.kill())
  if (statusInterval) {
    clearInterval(statusInterval)
    statusInterval = null
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

onMounted(() => {
  initMirrorEffects()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped lang="scss">
.smi-section-231 {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0a2a 0%, #2a1a3a 50%, #1a2a3a 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.smi-section-231::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(244, 114, 182, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.smi-container-231 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.smi-title-231 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #c084fc, #f472b6, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;

  opacity: 1 !important;}

.smi-subtitle-231 {
  font-size: 1.2rem;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 40px;

  opacity: 1 !important;}

.smi-control-panel-231 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;

  opacity: 1 !important;}

.smi-control-group-231 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;

  opacity: 1 !important;}

.smi-label-231 {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;

  opacity: 1 !important;}

.smi-slider-231 {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #c084fc, #f472b6);
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    
  opacity: 1 !important;}
  }
}

.smi-value-231 {
  font-size: 13px;
  color: #c084fc;
  font-weight: 600;

  opacity: 1 !important;}

.smi-mirror-gallery-231 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.smi-mirror-item-231 {
  position: relative;
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s;

  &.smi-active-231 {
    border-color: #c084fc;
    box-shadow: 0 0 30px rgba(192, 132, 252, 0.3);
  
  opacity: 1 !important;}

  &:hover {
    transform: translateY(-5px);
    border-color: #f472b6;
  }
}

.smi-mirror-stage-231 {
  position: relative;
  height: 400px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  perspective: 1000px;

  opacity: 1 !important;}

.smi-original-231 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  overflow: hidden;

  opacity: 1 !important;}

.smi-base-image-231 {
  width: 100%;
  height: 100%;
  object-fit: cover;

  opacity: 1 !important;}

.smi-original-overlay-231 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.smi-overlay-gradient-231 {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%);

  opacity: 1 !important;}

.smi-mirror-surface-231 {
  position: absolute;
  left: 0;
  right: 0;
  top: 200px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;

  opacity: 1 !important;}

.smi-mirror-glow-231 {
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(192, 132, 252, 0.3) 0%, transparent 70%);
  opacity: 0;
}

.smi-reflection-231 {
  position: absolute;
  top: 200px;
  left: 0;
  right: 0;
  height: 200px;
  overflow: hidden;
  pointer-events: none;

  opacity: 1 !important;}

.smi-reflection-image-231 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;

  opacity: 1 !important;}

.smi-reflection-overlay-231 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.smi-reflection-ripple-231 {
  position: absolute;
  width: 100%;
  height: 20px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(192, 132, 252, 0.3) 50%,
    transparent 100%
  );
  filter: blur(10px);

  opacity: 1 !important;}

.smi-image-info-231 {
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.smi-image-title-231 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 5px;

  opacity: 1 !important;}

.smi-image-desc-231 {
  font-size: 0.9rem;
  color: #94a3b8;

  opacity: 1 !important;}

.smi-effect-toggles-231 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.smi-toggle-231 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e2e8f0;
  cursor: pointer;
  user-select: none;

  input {
    width: 18px;
    height: 18px;
    accent-color: #c084fc;
  
  opacity: 1 !important;}

  span {
    font-size: 14px;
    font-weight: 500;
  }
}

.smi-mirror-status-231 {
  text-align: center;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.smi-status-bar-231 {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;

  opacity: 1 !important;}

.smi-status-fill-231 {
  height: 100%;
  background: linear-gradient(90deg, #c084fc, #f472b6, #fb923c);
  transition: width 0.1s;

  opacity: 1 !important;}

.smi-status-info-231 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.smi-status-label-231 {
  font-size: 13px;
  color: #94a3b8;

  opacity: 1 !important;}

.smi-status-value-231 {
  font-size: 16px;
  font-weight: 600;
  color: #c084fc;

  opacity: 1 !important;}
</style>
