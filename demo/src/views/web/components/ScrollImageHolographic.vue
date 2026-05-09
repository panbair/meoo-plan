<template>
  <div class="sih-holographic-section-228" ref="componentRoot">
    <div class="sih-container-228">
      <h2 class="sih-title-228">全息图片投影</h2>
      <p class="sih-subtitle-228">Holographic Image Projection</p>

      <!-- 全息控制面板 -->
      <div class="sih-holo-control-panel-228">
        <div class="sih-control-group-228">
          <label class="sih-label-228">投影强度</label>
          <input
            type="range"
            min="0"
            max="100"
            v-model.number="holoIntensity"
            class="sih-slider-228"
          />
          <span class="sih-value-228">{{ holoIntensity }}%</span>
        </div>
        <div class="sih-control-group-228">
          <label class="sih-label-228">扫描线密度</label>
          <input
            type="range"
            min="1"
            max="10"
            v-model.number="scanlineDensity"
            class="sih-slider-228"
          />
          <span class="sih-value-228">{{ scanlineDensity }}x</span>
        </div>
        <div class="sih-control-group-228">
          <label class="sih-label-228">全息模式</label>
          <div class="sih-mode-buttons-228">
            <button
              v-for="mode in modes"
              :key="mode.id"
              class="sih-mode-btn-228"
              :class="{ 'sih-active-228': currentMode === mode.id }"
              @click="setMode(mode.id)"
            >
              {{ mode.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 全息画廊 -->
      <div class="sih-holographic-gallery-228">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="sih-holographic-item-228"
          ref="holoItems"
        >
          <div class="sih-holographic-wrapper-228">
            <!-- 全息背景环 -->
            <div class="sih-holo-ring-228" :class="`sih-ring-${index}-228`"></div>
            <div class="sih-holo-ring-228 sih-ring-inner-228" :class="`sih-ring-inner-${index}-228`"></div>

            <!-- 全息投影区域 -->
            <div class="sih-hologram-container-228">
              <div class="sih-hologram-base-228">
                <img :src="item.image" :alt="item.title" class="sih-hologram-image-228" />
              </div>

              <!-- 全息层 -->
              <div class="sih-hologram-layer-228" :style="{ opacity: holoIntensity / 100 }">
                <div class="sih-hologram-tint-228"></div>
                <div class="sih-scanlines-228" :style="{ backgroundSize: `100% ${100 / scanlineDensity}px` }"></div>
                <div class="sih-hologram-noise-228"></div>
              </div>

              <!-- 3D投影层 -->
              <div class="sih-hologram-3d-228" :style="{ opacity: holoIntensity / 200 }">
                <div class="sih-hologram-rear-228">
                  <img :src="item.image" :alt="item.title" class="sih-hologram-image-228" />
                </div>
              </div>

              <!-- 全息发光效果 -->
              <div class="sih-hologram-glow-228" :style="{ opacity: holoIntensity / 150 }"></div>
            </div>

            <!-- 扫描线动画 -->
            <div class="sih-holo-scanline-228" ref="scanlines">
              <div class="sih-scan-line-228"></div>
            </div>

            <!-- 信息覆盖层 -->
            <div class="sih-hologram-overlay-228">
              <div class="sih-hologram-content-228">
                <div class="sih-hologram-badge-228">HOLOGRAM</div>
                <h3 class="sih-card-title-228">{{ item.title }}</h3>
                <p class="sih-card-desc-228">{{ item.desc }}</p>
                <div class="sih-hologram-metrics-228">
                  <div class="sih-metric-228">
                    <span class="sih-metric-label-228">投影</span>
                    <span class="sih-metric-value-228">{{ holoIntensity }}%</span>
                  </div>
                  <div class="sih-metric-228">
                    <span class="sih-metric-label-228">扫描</span>
                    <span class="sih-metric-value-228">{{ scanlineDensity }}x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 全息投影状态指示器 -->
      <div class="sih-hologram-status-228" ref="statusIndicator">
        <div class="sih-status-display-228">
          <div class="sih-hologram-icon-228">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div class="sih-status-info-228">
            <span class="sih-status-label-228">全息投影系统</span>
            <span class="sih-status-text-228">{{ statusText }}</span>
          </div>
        </div>
        <div class="sih-status-wave-228">
          <div class="sih-wave-line-228" v-for="i in 5" :key="i"></div>
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
const holoItems = ref<HTMLElement[]>([])
const scanlines = ref<HTMLElement[]>([])
const statusIndicator = ref<HTMLElement>()

const holoIntensity = ref(75)
const scanlineDensity = ref(5)
const currentMode = ref<'static' | 'scan' | 'pulse'>('scan')

const statusText = computed(() => {
  return `模式: ${currentMode.value} | 强度: ${holoIntensity.value}%`
})

interface HoloMode {
  id: 'static' | 'scan' | 'pulse'
  name: string
}

const modes: HoloMode[] = [
  { id: 'static', name: '静态' },
  { id: 'scan', name: '扫描' },
  { id: 'pulse', name: '脉冲' }
]

interface GalleryItem {
  image: string
  title: string
  desc: string
}

const galleryItems: GalleryItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    title: '雪山全息',
    desc: '3D雪山立体投影效果'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    title: '森林全息',
    desc: '森林全息沉浸式体验'
  },
  {
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    title: '星空全息',
    desc: '银河系全息投影'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    title: '海洋全息',
    desc: '海底世界全息展示'
  }
]

let ctx: gsap.Context

const setMode = (mode: 'static' | 'scan' | 'pulse') => {
  currentMode.value = mode
  ScrollTrigger.refresh()
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    const items = gsap.utils.toArray('.sih-holographic-item-228') as HTMLElement[]

    items.forEach((item, index) => {
      const wrapper = item.querySelector('.sih-holographic-wrapper-228') as HTMLElement
      const holoContainer = item.querySelector('.sih-hologram-container-228') as HTMLElement
      const holoRing = item.querySelector('.sih-holo-ring-228') as HTMLElement
      const holoRingInner = item.querySelector('.sih-ring-inner-228') as HTMLElement
      const holoLayer = item.querySelector('.sih-hologram-layer-228') as HTMLElement
      const holo3d = item.querySelector('.sih-hologram-3d-228') as HTMLElement
      const holoGlow = item.querySelector('.sih-hologram-glow-228') as HTMLElement
      const scanline = item.querySelector('.sih-scan-line-228') as HTMLElement
      const overlay = item.querySelector('.sih-hologram-overlay-228') as HTMLElement

      // Ring rotation animation
      gsap.to(holoRing, {
        rotation: 360,
        duration: 20 + index * 2,
        ease: 'none',
        repeat: -1
      })

      gsap.to(holoRingInner, {
        rotation: -360,
        duration: 15 + index * 2,
        ease: 'none',
        repeat: -1
      })

      // Initial reveal animation
      gsap.fromTo(
        wrapper,
        { y: 150, opacity: 0, scale: 0.9, rotateX: 10 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
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

      // Hologram projection animation
      gsap.fromTo(
        holoContainer,
        { rotateY: -15, scale: 0.8 },
        {
          rotateY: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 1
          }
        }
      )

      // Hologram layer pulse based on mode
      if (currentMode.value === 'pulse') {
        gsap.to(holoLayer, {
          opacity: (holoIntensity.value / 100) * 0.5 + 0.5,
          duration: 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          scrollTrigger: {
            trigger: item,
            start: 'top 50%',
            end: 'bottom 20%',
            toggleActions: 'play pause pause pause'
          }
        })
      }

      // 3D hologram effect
      gsap.fromTo(
        holo3d,
        { opacity: 0, translateZ: -50 },
        {
          opacity: holoIntensity.value / 200,
          translateZ: 50,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            end: 'top 25%',
            scrub: 1
          }
        }
      )

      // Hologram glow effect
      gsap.to(holoGlow, {
        boxShadow: `0 0 ${holoIntensity.value}px ${holoIntensity.value / 2}px rgba(100, 200, 255, 0.5)`,
        duration: 1,
        scrollTrigger: {
          trigger: item,
          start: 'top 50%',
          end: 'bottom 20%',
          scrub: 1
        }
      })

      // Scanline animation
      if (currentMode.value === 'scan') {
        gsap.to(scanline, {
          y: '200%',
          duration: 3 / (scanlineDensity.value / 5),
          ease: 'none',
          repeat: -1,
          scrollTrigger: {
            trigger: item,
            start: 'top 40%',
            end: 'bottom 10%',
            toggleActions: 'play pause pause pause'
          }
        })
      }

      // Overlay reveal
      gsap.fromTo(
        overlay,
        { opacity: 0, y: 60 },
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
      const contentElements = overlay.querySelectorAll('.sih-hologram-badge-228, h3, p, .sih-hologram-metrics-228')
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

    // Status indicator wave animation
    if (statusIndicator.value) {
      const waveLines = statusIndicator.value.querySelectorAll('.sih-wave-line-228')
      gsap.to(waveLines, {
        scaleY: 0.3,
        duration: 0.5,
        stagger: 0.1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })
    }
  }, componentRoot.value)
}

// Update animations when settings change
watch([holoIntensity, scanlineDensity, currentMode], () => {
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
.sih-holographic-section-228 {
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
      radial-gradient(circle at 20% 30%, rgba(100, 200, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(100, 200, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sih-container-228 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sih-title-228 {
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #64c8ff, #00ffff, #64c8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(100, 200, 255, 0.3);
  animation: sih-holo-pulse-228 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes sih-holo-pulse-228 {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.sih-subtitle-228 {
  text-align: center;
  color: #64c8ff;
  font-size: 1.2rem;
  margin-bottom: 40px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.sih-holo-control-panel-228 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 50px;
  padding: 25px;
  background: rgba(100, 200, 255, 0.03);
  border: 1px solid rgba(100, 200, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.sih-control-group-228 {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sih-label-228 {
  color: #64c8ff;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  opacity: 1 !important;}

.sih-slider-228 {
  width: 120px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(100, 200, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: linear-gradient(135deg, #64c8ff, #00ffff);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(100, 200, 255, 0.8);
  
  opacity: 1 !important;}
}

.sih-value-228 {
  color: #00ffff;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;

  opacity: 1 !important;}

.sih-mode-buttons-228 {
  display: flex;
  gap: 8px;
}

.sih-mode-btn-228 {
  padding: 8px 16px;
  background: rgba(100, 200, 255, 0.1);
  border: 1px solid rgba(100, 200, 255, 0.3);
  color: #64c8ff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;

  &:hover {
    background: rgba(100, 200, 255, 0.2);
    border-color: rgba(100, 200, 255, 0.6);
  
  opacity: 1 !important;}

  &.sih-active-228 {
    background: linear-gradient(135deg, #64c8ff, #00ffff);
    border-color: transparent;
    color: #0a0a1a;
    font-weight: 600;
  
  opacity: 1 !important;}
}

.sih-holographic-gallery-228 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 60px;
  margin-bottom: 60px;
}

.sih-holographic-item-228 {
  perspective: 2000px;
}

.sih-holographic-wrapper-228 {
  position: relative;
  border-radius: 20px;
  padding: 40px;
  background: rgba(10, 10, 26, 0.8);
  border: 1px solid rgba(100, 200, 255, 0.3);
  box-shadow:
    0 0 60px rgba(100, 200, 255, 0.2),
    inset 0 0 60px rgba(100, 200, 255, 0.05);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sih-holo-ring-228 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  border: 2px solid rgba(100, 200, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;

  opacity: 1 !important;}

.sih-ring-inner-228 {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(100, 200, 255, 0.2);

  opacity: 1 !important;}

.sih-hologram-container-228 {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.sih-hologram-base-228 {
  position: relative;
  z-index: 1;
}

.sih-hologram-image-228 {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;

  opacity: 1 !important;}

.sih-hologram-layer-228 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;

  opacity: 1 !important;}

.sih-hologram-tint-228 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(100, 200, 255, 0.1), rgba(0, 255, 255, 0.05));
  mix-blend-mode: color-dodge;

  opacity: 1 !important;}

.sih-scanlines-228 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(100, 200, 255, 0.1) 2px,
    rgba(100, 200, 255, 0.1) 4px
  );
  background-size: 100% 20px;

  opacity: 1 !important;}

.sih-hologram-noise-228 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.05;
  mix-blend-mode: overlay;
}

.sih-hologram-3d-228 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  transform: translateZ(-30px);
  opacity: 0.5;
  filter: blur(3px);
}

.sih-hologram-rear-228 {
  position: relative;
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.sih-hologram-glow-228 {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 22px;
  z-index: 0;
  background: transparent;
  filter: blur(20px);
  pointer-events: none;

  opacity: 1 !important;}

.sih-holo-scanline-228 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;

  opacity: 1 !important;}

.sih-scan-line-228 {
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(
    0deg,
    transparent,
    rgba(100, 200, 255, 0.5),
    transparent
  );

  opacity: 1 !important;}

.sih-hologram-overlay-228 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(transparent, rgba(10, 10, 26, 0.95));
  z-index: 10;
  border-top: 1px solid rgba(100, 200, 255, 0.3);

  opacity: 1 !important;}

.sih-hologram-content-228 {
  transform: translateZ(20px);
}

.sih-hologram-badge-228 {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(100, 200, 255, 0.2);
  border: 1px solid rgba(100, 200, 255, 0.4);
  border-radius: 4px;
  color: #00ffff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;

  opacity: 1 !important;}

.sih-card-title-228 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #64c8ff;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(100, 200, 255, 0.5);

  opacity: 1 !important;}

.sih-card-desc-228 {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 20px;
  line-height: 1.6;

  opacity: 1 !important;}

.sih-hologram-metrics-228 {
  display: flex;
  gap: 20px;
}

.sih-metric-228 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sih-metric-label-228 {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.sih-metric-value-228 {
  font-size: 14px;
  color: #00ffff;
  font-weight: 600;

  opacity: 1 !important;}

.sih-hologram-status-228 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 30px;
  background: rgba(100, 200, 255, 0.03);
  border: 1px solid rgba(100, 200, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.sih-status-display-228 {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sih-hologram-icon-228 {
  width: 50px;
  height: 50px;
  color: #00ffff;
  animation: sih-icon-pulse-228 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes sih-icon-pulse-228 {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

.sih-status-info-228 {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sih-status-label-228 {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.sih-status-text-228 {
  font-size: 14px;
  color: #00ffff;
  font-weight: 600;

  opacity: 1 !important;}

.sih-status-wave-228 {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;

  opacity: 1 !important;}

.sih-wave-line-228 {
  width: 3px;
  height: 100%;
  background: linear-gradient(to top, #64c8ff, #00ffff);
  border-radius: 2px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .sih-title-228 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .sih-holographic-gallery-228 {
    grid-template-columns: 1fr;
  }

  .sih-holo-control-panel-228 {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
