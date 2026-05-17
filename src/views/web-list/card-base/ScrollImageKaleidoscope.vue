<template>
  <div class="sik-kaleidoscope-section-230" ref="componentRoot">
    <div class="sik-container-230">
      <h2 class="sik-title-230">万花筒图片</h2>
      <p class="sik-subtitle-230">Image Kaleidoscope Effect</p>

      <!-- 万花筒控制面板 -->
      <div class="sik-kaleido-control-panel-230">
        <div class="sik-control-group-230">
          <label class="sik-label-230">分段数量</label>
          <input
            type="range"
            min="4"
            max="12"
            v-model.number="segmentCount"
            class="sik-slider-230"
          />
          <span class="sik-value-230">{{ segmentCount }}</span>
        </div>
        <div class="sik-control-group-230">
          <label class="sik-label-230">旋转速度</label>
          <input
            type="range"
            min="1"
            max="10"
            v-model.number="rotationSpeed"
            class="sik-slider-230"
          />
          <span class="sik-value-230">{{ rotationSpeed }}x</span>
        </div>
        <div class="sik-control-group-230">
          <label class="sik-label-230">万花筒模式</label>
          <div class="sik-mode-buttons-230">
            <button
              v-for="mode in modes"
              :key="mode.id"
              class="sik-mode-btn-230"
              :class="{ 'sik-active-230': currentMode === mode.id }"
              @click="setMode(mode.id)"
            >
              {{ mode.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 万花筒画廊 -->
      <div class="sik-kaleidoscope-gallery-230">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="sik-kaleidoscope-item-230"
          ref="kaleidoItems"
        >
          <div class="sik-kaleidoscope-wrapper-230">
            <!-- 万花筒容器 -->
            <div class="sik-kaleidoscope-container-230">
              <div class="sik-kaleidoscope-rotation-230" ref="kaleidoRotations">
                <!-- 多个镜像片段 -->
                <div
                  v-for="i in segmentCount"
                  :key="i"
                  class="sik-segment-230"
                  :style="{
                    transform: `rotate(${(i - 1) * (360 / segmentCount)}deg)`,
                    clipPath: `polygon(50% 0%, ${50 + 100 * Math.sin(Math.PI / segmentCount)}% 0%, ${50 + 100 * Math.sin(Math.PI / segmentCount)}% ${100 * Math.cos(Math.PI / segmentCount)}%, 50% ${100 * Math.cos(Math.PI / segmentCount)}%)`
                  }"
                >
                  <div class="sik-segment-content-230">
                    <img :src="item.image" :alt="item.title" class="sik-segment-image-230" />
                  </div>
                </div>
              </div>

              <!-- 中心图案 -->
              <div class="sik-center-pattern-230">
                <div class="sik-center-ring-230"></div>
                <div class="sik-center-core-230"></div>
              </div>

              <!-- 万花筒粒子效果 -->
              <div class="sik-kaleido-particles-230" ref="kaleidoParticles">
                <div class="sik-particle-230" v-for="i in 12" :key="i" :style="{ '--angle': (i * 30) + 'deg' }"></div>
              </div>
            </div>

            <!-- 原始图片预览 -->
            <div class="sik-original-preview-230">
              <img :src="item.image" :alt="item.title" class="sik-preview-image-230" />
            </div>

            <!-- 信息覆盖层 -->
            <div class="sik-kaleidoscope-overlay-230">
              <div class="sik-kaleidoscope-content-230">
                <div class="sik-kaleido-badge-230">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {{ segmentCount }}段
                </div>
                <h3 class="sik-card-title-230">{{ item.title }}</h3>
                <p class="sik-card-desc-230">{{ item.desc }}</p>
                <div class="sik-kaleido-metrics-230">
                  <div class="sik-metric-230">
                    <span class="sik-metric-label-230">旋转</span>
                    <span class="sik-metric-value-230">{{ rotationSpeed }}x</span>
                  </div>
                  <div class="sik-metric-230">
                    <span class="sik-metric-label-230">角度</span>
                    <span class="sik-metric-value-230">{{ 360 / segmentCount }}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 万花筒状态指示器 -->
      <div class="sik-kaleidoscope-status-230" ref="statusIndicator">
        <div class="sik-kaleido-display-230">
          <div class="sik-kaleido-icon-230">
            <svg viewBox="0 0 100 100" class="sik-icon-svg-230">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2"/>
              <g v-for="i in 6" :key="i" :transform="`rotate(${i * 60} 50 50)`">
                <path d="M50 5 L55 45 L50 50 L45 45 Z" fill="currentColor"/>
              </g>
            </svg>
          </div>
          <div class="sik-status-info-230">
            <span class="sik-status-label-230">万花筒引擎</span>
            <span class="sik-status-text-230">{{ statusText }}</span>
          </div>
        </div>
        <div class="sik-kaleido-rings-230">
          <div class="sik-status-ring-230" v-for="i in 3" :key="i"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const kaleidoItems = ref<HTMLElement[]>([])
const kaleidoRotations = ref<HTMLElement[]>([])
const kaleidoParticles = ref<HTMLElement[]>([])
const statusIndicator = ref<HTMLElement>()

const segmentCount = ref(6)
const rotationSpeed = ref(3)
const currentMode = ref<'rotate' | 'pulse' | 'zoom'>('rotate')

const statusText = computed(() => {
  return `模式: ${currentMode.value} | 段数: ${segmentCount.value}`
})

interface KaleidoMode {
  id: 'rotate' | 'pulse' | 'zoom'
  name: string
}

const modes: KaleidoMode[] = [
  { id: 'rotate', name: '旋转' },
  { id: 'pulse', name: '脉冲' },
  { id: 'zoom', name: '缩放' }
]

interface GalleryItem {
  image: string
  title: string
  desc: string
}

const galleryItems: GalleryItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    title: '星空万花筒',
    desc: '银河系的对称之美'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    title: '森林万花筒',
    desc: '自然的几何图案'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    title: '海洋万花筒',
    desc: '波浪的完美对称'
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    title: '山川万花筒',
    desc: '山峰的镜像艺术'
  }
]

let ctx: gsap.Context

const setMode = (mode: 'rotate' | 'pulse' | 'zoom') => {
  currentMode.value = mode
  ScrollTrigger.refresh()
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    const items = gsap.utils.toArray('.sik-kaleidoscope-item-230') as HTMLElement[]

    items.forEach((item, index) => {
      const wrapper = item.querySelector('.sik-kaleidoscope-wrapper-230') as HTMLElement
      const kaleidoContainer = item.querySelector('.sik-kaleidoscope-container-230') as HTMLElement
      const kaleidoRotation = item.querySelector('.sik-kaleidoscope-rotation-230') as HTMLElement
      const centerPattern = item.querySelector('.sik-center-pattern-230') as HTMLElement
      const originalPreview = item.querySelector('.sik-original-preview-230') as HTMLElement
      const particleContainer = item.querySelector('.sik-kaleido-particles-230') as HTMLElement
      const overlay = item.querySelector('.sik-kaleidoscope-overlay-230') as HTMLElement

      // Initial reveal animation
      gsap.fromTo(
        wrapper,
        { y: 120, opacity: 0, scale: 0.85, rotateY: 20 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1
          }
        }
      )

      // Kaleidoscope rotation based on mode
      if (currentMode.value === 'rotate') {
        gsap.to(kaleidoRotation, {
          rotation: 360,
          duration: 20 / rotationSpeed.value,
          ease: 'none',
          repeat: -1,
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            end: 'bottom 20%',
            toggleActions: 'play pause pause pause'
          }
        })
      } else if (currentMode.value === 'pulse') {
        gsap.to(kaleidoContainer, {
          scale: 1.1,
          duration: 2 / rotationSpeed.value,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            end: 'bottom 20%',
            toggleActions: 'play pause pause pause'
          }
        })
      } else if (currentMode.value === 'zoom') {
        gsap.fromTo(
          kaleidoContainer,
          { scale: 0.8 },
          {
            scale: 1.2,
            duration: 4 / rotationSpeed.value,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            scrollTrigger: {
              trigger: item,
              start: 'top 60%',
              end: 'bottom 20%',
              toggleActions: 'play pause pause pause'
            }
          }
        )
      }

      // Center pattern rotation
      const centerRing = centerPattern.querySelector('.sik-center-ring-230') as HTMLElement
      const centerCore = centerPattern.querySelector('.sik-center-core-230') as HTMLElement

      gsap.to(centerRing, {
        rotation: -360,
        duration: 15 / rotationSpeed.value,
        ease: 'none',
        repeat: -1
      })

      gsap.to(centerCore, {
        scale: 0.8,
        duration: 1.5 / rotationSpeed.value,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })

      // Original preview reveal
      gsap.fromTo(
        originalPreview,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 0.3,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1
          }
        }
      )

      // Particles animation
      const particles = particleContainer.querySelectorAll('.sik-particle-230')
      particles.forEach((particle) => {
        const angle = parseFloat(particle.style.getPropertyValue('--angle'))
        const radius = 100 + Math.random() * 50

        gsap.to(particle, {
          rotation: angle + 360,
          duration: 10 / rotationSpeed.value,
          ease: 'none',
          repeat: -1,
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            end: 'bottom 20%',
            toggleActions: 'play pause pause pause'
          }
        })

        gsap.to(particle, {
          x: Math.cos(angle * Math.PI / 180) * radius,
          y: Math.sin(angle * Math.PI / 180) * radius,
          duration: 2 / rotationSpeed.value,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        })
      })

      // Overlay reveal
      gsap.fromTo(
        overlay,
        { opacity: 0, y: 70 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 45%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Content stagger animation
      const contentElements = overlay.querySelectorAll('.sik-kaleido-badge-230, h3, p, .sik-kaleido-metrics-230')
      gsap.from(contentElements, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 40%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    // Status indicator animation
    if (statusIndicator.value) {
      const iconSvg = statusIndicator.value.querySelector('.sik-icon-svg-230')
      const rings = statusIndicator.value.querySelectorAll('.sik-status-ring-230')

      gsap.to(iconSvg, {
        rotation: 360,
        duration: 10,
        ease: 'none',
        repeat: -1
      })

      gsap.to(rings, {
        scale: 1.2,
        opacity: 0.5,
        duration: 1.5,
        stagger: 0.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })
    }
  }, componentRoot.value)
}

// Update animations when settings change
watch([segmentCount, rotationSpeed, currentMode], () => {
  ScrollTrigger.refresh()
})

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  if (ctx) ctx.revert()
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.sik-kaleidoscope-section-230 {
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
    background:
      radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sik-container-230 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sik-title-230 {
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #a855f7, #ec4899, #f97316, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
  animation: sik-gradient-rotate-230 8s linear infinite;

  opacity: 1 !important;}

@keyframes sik-gradient-rotate-230 {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

.sik-subtitle-230 {
  text-align: center;
  color: #a855f7;
  font-size: 1.2rem;
  margin-bottom: 40px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.sik-kaleido-control-panel-230 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 50px;
  padding: 25px;
  background: rgba(168, 85, 247, 0.03);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.sik-control-group-230 {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sik-label-230 {
  color: #a855f7;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;

  opacity: 1 !important;}

.sik-slider-230 {
  width: 120px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(168, 85, 247, 0.2);
  border-radius: 3px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: linear-gradient(135deg, #a855f7, #ec4899);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.8);
  
  opacity: 1 !important;}
}

.sik-value-230 {
  color: #ec4899;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;

  opacity: 1 !important;}

.sik-mode-buttons-230 {
  display: flex;
  gap: 8px;
}

.sik-mode-btn-230 {
  padding: 8px 16px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #a855f7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;

  &:hover {
    background: rgba(168, 85, 247, 0.2);
    border-color: rgba(168, 85, 247, 0.6);
  
  opacity: 1 !important;}

  &.sik-active-230 {
    background: linear-gradient(135deg, #a855f7, #ec4899);
    border-color: transparent;
    color: white;
    font-weight: 600;
  
  opacity: 1 !important;}
}

.sik-kaleidoscope-gallery-230 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 60px;
  margin-bottom: 60px;
}

.sik-kaleidoscope-item-230 {
  perspective: 2000px;
}

.sik-kaleidoscope-wrapper-230 {
  position: relative;
  border-radius: 20px;
  padding: 40px;
  background: rgba(10, 10, 26, 0.8);
  border: 1px solid rgba(168, 85, 247, 0.3);
  box-shadow:
    0 0 60px rgba(168, 85, 247, 0.2),
    inset 0 0 60px rgba(168, 85, 247, 0.05);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sik-kaleidoscope-container-230 {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto 30px;
  border-radius: 50%;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;

  opacity: 1 !important;}

.sik-kaleidoscope-rotation-230 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sik-segment-230 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 50% 50%;

  opacity: 1 !important;}

.sik-segment-content-230 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 50% 50%;

  opacity: 1 !important;}

.sik-segment-image-230 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.5) brightness(1.1);

  opacity: 1 !important;}

.sik-center-pattern-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.sik-center-ring-230 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(168, 85, 247, 0.5);
  border-radius: 50%;

  opacity: 1 !important;}

.sik-center-core-230 {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);

  opacity: 1 !important;}

.sik-kaleido-particles-230 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.sik-particle-230 {
  position: absolute;
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.8);

  opacity: 1 !important;}

.sik-original-preview-230 {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  opacity: 0.3;
  border: 2px solid rgba(168, 85, 247, 0.3);
}

.sik-preview-image-230 {
  width: 100%;
  height: 100%;
  object-fit: cover;

  opacity: 1 !important;}

.sik-kaleidoscope-overlay-230 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(transparent, rgba(10, 10, 26, 0.95));
  z-index: 10;
  border-top: 1px solid rgba(168, 85, 247, 0.3);

  opacity: 1 !important;}

.sik-kaleidoscope-content-230 {
  transform: translateZ(20px);
}

.sik-kaleido-badge-230 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
  border-radius: 6px;
  color: #a855f7;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;

  opacity: 1 !important;}

.sik-card-title-230 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ec4899;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(236, 72, 153, 0.5);

  opacity: 1 !important;}

.sik-card-desc-230 {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 20px;
  line-height: 1.6;

  opacity: 1 !important;}

.sik-kaleido-metrics-230 {
  display: flex;
  gap: 20px;
}

.sik-metric-230 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sik-metric-label-230 {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.sik-metric-value-230 {
  font-size: 14px;
  color: #ec4899;
  font-weight: 600;

  opacity: 1 !important;}

.sik-kaleidoscope-status-230 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 30px;
  background: rgba(168, 85, 247, 0.03);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.sik-kaleido-display-230 {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sik-kaleido-icon-230 {
  width: 50px;
  height: 50px;
  color: #a855f7;

  opacity: 1 !important;}

.sik-icon-svg-230 {
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.sik-status-info-230 {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sik-status-label-230 {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.sik-status-text-230 {
  font-size: 14px;
  color: #ec4899;
  font-weight: 600;

  opacity: 1 !important;}

.sik-kaleido-rings-230 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 80px;
  height: 80px;

  opacity: 1 !important;}

.sik-status-ring-230 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(168, 85, 247, 0.3);
  border-radius: 50%;


  &:nth-child(1) { width: 40px; height: 40px; 
  opacity: 1 !important;}
  &:nth-child(2) { width: 60px; height: 60px; }
  &:nth-child(3) { width: 80px; height: 80px; }
}

@media (max-width: 768px) {
  .sik-title-230 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .sik-kaleidoscope-gallery-230 {
    grid-template-columns: 1fr;
  }

  .sik-kaleido-control-panel-230 {
    flex-direction: column;
    gap: 20px;
  }

  .sik-kaleidoscope-container-230 {
    width: 300px;
    height: 300px;
  
  opacity: 1 !important;}
}
</style>
