<template>
  <div class="sir-spectrum-section-227" ref="componentRoot">
    <div class="sir-container-227">
      <h2 class="sir-title-227">图片光谱扫描</h2>
      <p class="sir-subtitle-227">Image Spectrum Scanner</p>

      <!-- 扫描控制 -->
      <div class="sir-control-panel-227">
        <div class="sir-control-group-227">
          <label class="sir-label-227">扫描速度</label>
          <input
            type="range"
            min="1"
            max="10"
            v-model.number="scanSpeed"
            class="sir-slider-227"
          />
          <span class="sir-value-227">{{ scanSpeed }}x</span>
        </div>
        <div class="sir-control-group-227">
          <label class="sir-label-227">光谱宽度</label>
          <input
            type="range"
            min="10"
            max="100"
            v-model.number="spectrumWidth"
            class="sir-slider-227"
          />
          <span class="sir-value-227">{{ spectrumWidth }}px</span>
        </div>
        <div class="sir-control-group-227">
          <label class="sir-label-227">扫描模式</label>
          <div class="sir-mode-buttons-227">
            <button
              v-for="mode in modes"
              :key="mode.id"
              class="sir-mode-btn-227"
              :class="{ 'sir-active-227': currentMode === mode.id }"
              @click="setMode(mode.id)"
            >
              {{ mode.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 光谱画廊 -->
      <div class="sir-spectrum-gallery-227">
        <div
          v-for="(item, index) in galleryItems"
          :key="index"
          class="sir-spectrum-item-227"
          ref="spectrumItems"
          :data-mode="currentMode"
        >
          <div class="sir-spectrum-wrapper-227">
            <div class="sir-image-layers-227">
              <img :src="item.image" :alt="item.title" class="sir-base-image-227" @error="handleImageError" />
              <div class="sir-fallback-bg-227" :style="getFallbackBg(index)"></div>
              <div class="sir-spectrum-scan-227" :style="{ width: `${spectrumWidth}px` }">
                <div class="sir-spectrum-gradient-227"></div>
              </div>
              <div class="sir-spectrum-rgb-227">
                <div class="sir-channel-227 sir-red-227"></div>
                <div class="sir-channel-227 sir-green-227"></div>
                <div class="sir-channel-227 sir-blue-227"></div>
              </div>
            </div>
            <div class="sir-overlay-227">
              <div class="sir-content-227">
                <h3 class="sir-card-title-227">{{ item.title }}</h3>
                <p class="sir-card-desc-227">{{ item.desc }}</p>
                <div class="sir-scanner-227">
                  <div class="sir-scan-line-227"></div>
                  <div class="sir-scan-dots-227"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 实时扫描指示器 -->
      <div class="sir-live-scanner-227" ref="liveScanner">
        <div class="sir-scanner-frame-227">
          <div class="sir-scan-bar-227" ref="scanBar"></div>
          <div class="sir-spectrum-display-227">
            <div class="sir-color-bar-227" v-for="i in 3" :key="i"></div>
          </div>
        </div>
        <div class="sir-scanner-info-227">
          <span class="sir-info-label-227">扫描状态</span>
          <span class="sir-info-value-227">{{ scanStatus }}</span>
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
const spectrumItems = ref<HTMLElement[]>([])
const liveScanner = ref<HTMLElement>()
const scanBar = ref<HTMLElement>()

const scanSpeed = ref(5)
const spectrumWidth = ref(40)
const currentMode = ref<'horizontal' | 'vertical' | 'diagonal'>('horizontal')

const scanStatus = computed(() => {
  return `扫描中 - 速度 ${scanSpeed.value}x - 模式 ${currentMode.value}`
})

interface ScanMode {
  id: 'horizontal' | 'vertical' | 'diagonal'
  name: string
}

const modes: ScanMode[] = [
  { id: 'horizontal', name: '水平' },
  { id: 'vertical', name: '垂直' },
  { id: 'diagonal', name: '对角' }
]

interface GalleryItem {
  image: string
  title: string
  desc: string
}

const galleryItems: GalleryItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    title: '星空山脉',
    desc: '银河下壮丽的山脉景观'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    title: '碧海蓝天',
    desc: '宁静的海边日出时刻'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    title: '迷雾森林',
    desc: '晨雾笼罩的神秘森林'
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    title: '雪山之巅',
    desc: '雄伟的雪山山峰'
  }
]

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none' // 隐藏失败的图片，显示背景
}

// 获取备用背景
const getFallbackBg = (index: number) => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  ]
  return {
    background: gradients[index % gradients.length]
  }
}

let ctx: gsap.Context

const setMode = (mode: 'horizontal' | 'vertical' | 'diagonal') => {
  currentMode.value = mode
}

const initAnimations = () => {
  // 清理之前的动画
  if (ctx) {
    ctx.revert()
  }

  ctx = gsap.context(() => {
    const items = gsap.utils.toArray('.sir-spectrum-item-227') as HTMLElement[]

    if (items.length === 0) {
      console.warn('[ScrollImageSpectrum] No items found')
      return
    }

    items.forEach((item, index) => {
      const wrapper = item.querySelector('.sir-spectrum-wrapper-227') as HTMLElement
      const scanLine = item.querySelector('.sir-spectrum-scan-227') as HTMLElement
      const spectrumGradient = item.querySelector('.sir-spectrum-gradient-227') as HTMLElement
      const overlay = item.querySelector('.sir-overlay-227') as HTMLElement
      const rgbChannels = item.querySelector('.sir-spectrum-rgb-227') as HTMLElement

      if (!wrapper || !scanLine || !overlay) {
        console.warn(`[ScrollImageSpectrum] Missing elements in item ${index}`)
        return
      }

      // Spectrum scan animation based on mode
      const getScanAnimation = () => {
        switch (currentMode.value) {
          case 'horizontal':
            return { x: '-100%' }
          case 'vertical':
            return { y: '-100%' }
          case 'diagonal':
            return { x: '-100%', y: '-100%' }
          default:
            return { x: '-100%' }
        }
      }

      // Initial state - 确保元素可见
      gsap.set(scanLine, { opacity: 0.8, x: 0, y: 0 })

      // Reveal animation
      gsap.fromTo(
        wrapper,
        { y: 100, opacity: 0, rotateX: 15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
          }
        }
      )

      // Spectrum scan animation - 修复位置问题
      const scanAnim = gsap.fromTo(
        scanLine,
        { opacity: 0.8, ...getScanAnimation() },
        {
          opacity: 0.8,
          x: currentMode.value === 'vertical' ? 0 : scanLine.offsetWidth,
          y: currentMode.value === 'horizontal' ? 0 : scanLine.offsetHeight,
          duration: 2 / (scanSpeed.value / 5),
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          }
        }
      )

      // RGB color separation effect
      if (rgbChannels) {
        gsap.fromTo(
          rgbChannels,
          { opacity: 0.8 },
          {
            opacity: 0.2,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
              trigger: item,
              start: 'top 60%',
              end: 'top 20%',
              scrub: 1
            }
          }
        )
      }

      // Overlay content reveal
      gsap.fromTo(
        overlay,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 40%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Text stagger
      const textElements = overlay.querySelectorAll('h3, p, .sir-scanner-227')
      gsap.from(textElements, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 35%',
          toggleActions: 'play none none reverse'
        }
      })

      // Internal scanner animation
      const scannerDots = overlay.querySelector('.sir-scan-dots-227')
      if (scannerDots) {
        const dotsWidth = scannerDots.offsetWidth || 100
        gsap.to(scannerDots, {
          x: dotsWidth * 2,
          duration: 2 / (scanSpeed.value / 5),
          ease: 'none',
          repeat: -1,
          yoyo: true,
          scrollTrigger: {
            trigger: item,
            start: 'top 40%',
            end: 'bottom 20%',
            toggleActions: 'play pause pause pause'
          }
        })
      }
    })

    // Live scanner indicator
    if (liveScanner.value && scanBar.value) {
      // 计算扫描条的最大移动距离
      const maxDistance = 240 // 像素值
      gsap.to(scanBar.value, {
        x: maxDistance,
        duration: 2 / (scanSpeed.value / 5),
        ease: 'none',
        repeat: -1,
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play pause pause pause'
        }
      })
    }
  }, componentRoot.value)
}

// Update animations when settings change
watch([scanSpeed, currentMode], () => {
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
.sir-spectrum-section-227 {
  min-height: auto;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  position: relative;
  overflow: visible;

  opacity: 1 !important;}

.sir-container-227 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sir-title-227 {
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #f7b731);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: sir-gradient-shift-227 8s ease infinite;

  opacity: 1 !important;}

@keyframes sir-gradient-shift-227 {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.sir-subtitle-227 {
  text-align: center;
  color: #94a3b8;
  font-size: 1.2rem;
  margin-bottom: 40px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.sir-control-panel-227 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 50px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.sir-control-group-227 {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sir-label-227 {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  opacity: 1 !important;}

.sir-slider-227 {
  width: 120px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(255, 107, 107, 0.5);
  
  opacity: 1 !important;}
}

.sir-value-227 {
  color: #4ecdc4;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;

  opacity: 1 !important;}

.sir-mode-buttons-227 {
  display: flex;
  gap: 8px;
}

.sir-mode-btn-227 {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(78, 205, 196, 0.5);
  
  opacity: 1 !important;}

  &.sir-active-227 {
    background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
    border-color: transparent;
    color: white;
    font-weight: 600;
  
  opacity: 1 !important;}
}

.sir-spectrum-gallery-227 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.sir-spectrum-item-227 {
  perspective: 2000px;
}

.sir-spectrum-wrapper-227 {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sir-image-layers-227 {
  position: relative;
  overflow: hidden;
  min-height: 400px;
  background: linear-gradient(135deg, #1a1a3a 0%, #0a0a2a 100%);

  opacity: 1 !important;}

.sir-fallback-bg-227 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 0;

  opacity: 1 !important;}

.sir-base-image-227 {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
  background: transparent;
  min-width: 100%;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sir-spectrum-scan-227 {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  opacity: 0.8;
  z-index: 2;
  pointer-events: none;
  overflow: visible;
}

.sir-spectrum-gradient-227 {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 0) 0%,
    rgba(255, 0, 0, 0.3) 25%,
    rgba(0, 255, 0, 0.3) 50%,
    rgba(0, 0, 255, 0.3) 75%,
    rgba(255, 0, 0, 0) 100%
  );
  filter: blur(20px);

  opacity: 1 !important;}

.sir-spectrum-rgb-227 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;

  opacity: 1 !important;}

.sir-channel-227 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: screen;

  opacity: 1 !important;}

.sir-red-227 {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="rgba(255, 0, 0, 0.1)"/></svg>');
  transform: translateX(2px);

  opacity: 1 !important;}

.sir-green-227 {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="rgba(0, 255, 0, 0.1)"/></svg>');
  transform: translateX(-2px);

  opacity: 1 !important;}

.sir-rgb-227 {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="rgba(0, 0, 255, 0.2)"/></svg>');
  transform: translateY(0);

  opacity: 1 !important;}

.sir-overlay-227 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  z-index: 10;

  opacity: 1 !important;}

.sir-content-227 {
  transform: translateZ(30px);
}

.sir-card-title-227 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.sir-card-desc-227 {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 20px;
  line-height: 1.6;

  opacity: 1 !important;}

.sir-scanner-227 {
  position: relative;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;

  opacity: 1 !important;}

.sir-scan-line-227 {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4ecdc4, transparent);
  transform: translateY(-50%);
  animation: sir-scan-227 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes sir-scan-227 {
  0%, 100% { transform: translateY(-50%) translateX(-100%); }
  50% { transform: translateY(-50%) translateX(100%); }
}

.sir-scan-dots-227 {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 10px,
    rgba(78, 205, 196, 0.5) 10px,
    rgba(78, 205, 196, 0.5) 20px
  );

  opacity: 1 !important;}

.sir-live-scanner-227 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.sir-scanner-frame-227 {
  width: 300px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  opacity: 1 !important;}

.sir-scan-bar-227 {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 60px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.5);

  opacity: 1 !important;}

.sir-spectrum-display-227 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 5px;
  width: 20px;
  height: 12px;

  opacity: 1 !important;}

.sir-color-bar-227 {
  flex: 1;
  border-radius: 2px;

  &:nth-child(1) { background: #ff6b6b; 
  opacity: 1 !important;}
  &:nth-child(2) { background: #4ecdc4; }
  &:nth-child(3) { background: #45b7d1; }
}

.sir-scanner-info-227 {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 200px;

  opacity: 1 !important;}

.sir-info-label-227 {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.sir-info-value-227 {
  font-size: 16px;
  font-weight: 600;
  color: #4ecdc4;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .sir-title-227 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .sir-spectrum-gallery-227 {
    grid-template-columns: 1fr;
  }

  .sir-control-panel-227 {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
