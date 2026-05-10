<template>
  <section ref="foldSection" class="fold-section-233">
    <!-- 动态背景 -->
    <div class="fold-bg-grid-233"></div>
    <div class="fold-bg-glow-233"></div>

    <!-- 标题区域 -->
    <div class="fold-header-233">
      <h2 class="fold-title-233">
        <span class="fold-title-main-233">ORIGAMI</span>
        <span class="fold-title-sub-233">FOLD</span>
      </h2>
      <p class="fold-subtitle-233">折纸艺术 · 空间折叠变换</p>
    </div>

    <!-- 折纸展示区 -->
    <div class="fold-display-233">
      <div ref="origamiContainer" class="fold-origami-233">
        <div
          v-for="(panel, index) in panels"
          :key="index"
          :ref="el => { if (el) panelRefs[index] = el as HTMLElement }"
          class="fold-panel-233"
          :class="`fold-panel-${index}`"
          :style="panel.style"
        >
          <div class="fold-panel-image-233" :style="panel.imageStyle"></div>
          <div class="fold-panel-shine-233"></div>
          <div class="fold-panel-shadow-233"></div>
        </div>
      </div>

      <!-- 中心发光 -->
      <div ref="centerGlow" class="fold-center-glow-233"></div>
    </div>

    <!-- 折痕指示器 -->
    <div class="fold-lines-233">
      <div
        v-for="i in config.segments - 1"
        :key="i"
        :ref="el => { if (el) lineRefs[i] = el as HTMLElement }"
        class="fold-line-233"
        :class="`fold-line-${i}`"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const foldSection = ref<HTMLElement>()
const origamiContainer = ref<HTMLElement>()
const centerGlow = ref<HTMLElement>()
const panelRefs = ref<HTMLElement[]>([])
const lineRefs = ref<HTMLElement[]>([])

// 配置
const config = ref({
  mode: 'horizontal',
  segments: 4,
  speed: 1
})

// 面板数据
interface Panel {
  style: Record<string, string>
  imageStyle: Record<string, string>
}

const panels = ref<Panel[]>([])

// 图片
const currentImageIndex = ref(0)
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href
]

const currentImage = computed(() => images[currentImageIndex.value])

// 生成面板
const generatePanels = () => {
  const segments = config.value.segments
  const mode = config.value.mode
  const newPanels: Panel[] = []

  for (let i = 0; i < segments; i++) {
    const progress = i / (segments - 1)
    let width = '100%'
    let height = '100%'
    let left = '0%'
    let top = '0%'
    let bgPosition = '0% 0%'
    let bgSize = '100% 100%'
    let transformOrigin = 'center center'
    let zIndex = 1

    switch (mode) {
      case 'horizontal':
        width = `${100 / segments}%`
        left = `${progress * 100}%`
        bgPosition = `${-progress * 100}% 0%`
        bgSize = `${segments * 100}% 100%`
        transformOrigin = i % 2 === 0 ? 'right center' : 'left center'
        break

      case 'vertical':
        height = `${100 / segments}%`
        top = `${progress * 100}%`
        bgPosition = `0% ${-progress * 100}%`
        bgSize = `100% ${segments * 100}%`
        transformOrigin = i % 2 === 0 ? 'center bottom' : 'center top'
        break

      case 'cross':
        if (i < segments / 2) {
          height = `${50 / (segments / 2)}%`
          top = `${progress * 50}%`
          bgPosition = `0% ${-progress * 100}%`
          bgSize = `100% 200%`
          transformOrigin = i % 2 === 0 ? 'center bottom' : 'center top'
        } else {
          width = `${50 / (segments / 2)}%`
          left = `${((i - segments / 2) / (segments / 2)) * 50}%`
          bgPosition = `${-((i - segments / 2) / (segments / 2)) * 100}% 0%`
          bgSize = `200% 100%`
          transformOrigin = i % 2 === 0 ? 'right center' : 'left center'
        }
        break

      case 'spiral':
        const scale = 1 - progress * 0.8
        width = `${scale * 100}%`
        height = `${scale * 100}%`
        left = `${(1 - scale) * 50}%`
        top = `${(1 - scale) * 50}%`
        bgPosition = `${-(progress * 50)}% ${-(progress * 50)}%`
        bgSize = '200% 200%'
        zIndex = segments - i
        transformOrigin = 'center center'
        break

      case 'wave':
        width = `${100 / segments}%`
        left = `${progress * 100}%`
        bgPosition = `${-progress * 100}% 0%`
        bgSize = `${segments * 100}% 100%`
        transformOrigin = 'center bottom'
        break
    }

    newPanels.push({
      style: {
        width,
        height,
        left,
        top,
        transformOrigin,
        zIndex,
        position: 'absolute'
      },
      imageStyle: {
        backgroundImage: `url(${currentImage.value})`,
        backgroundSize: bgSize,
        backgroundPosition: bgPosition
      }
    })
  }

  panels.value = newPanels
}

let ctx: gsap.Context

// 初始化折叠动画
const initFoldAnimation = () => {
  if (!origamiContainer.value || !foldSection.value) return

  ctx = gsap.context(() => {
    const mode = config.value.mode

    // 面板折叠动画
    panelRefs.value.forEach((panel, index) => {
      const isEven = index % 2 === 0

      let fromTransform: any = {}
      let toTransform: any = {}

      switch (mode) {
        case 'horizontal':
          fromTransform = { rotateY: isEven ? -180 : 180 }
          toTransform = { rotateY: 0 }
          break

        case 'vertical':
          fromTransform = { rotateX: isEven ? -180 : 180 }
          toTransform = { rotateX: 0 }
          break

        case 'cross':
          if (index < panelRefs.value.length / 2) {
            fromTransform = { rotateX: isEven ? -180 : 180 }
            toTransform = { rotateX: 0 }
          } else {
            fromTransform = { rotateY: isEven ? -180 : 180 }
            toTransform = { rotateY: 0 }
          }
          break

        case 'spiral':
          const spiralProgress = index / panelRefs.value.length
          fromTransform = {
            rotateX: -360 * spiralProgress,
            rotateY: -360 * spiralProgress,
            scale: 0.3
          }
          toTransform = {
            rotateX: 0,
            rotateY: 0,
            scale: 1
          }
          break

        case 'wave':
          const waveOffset = Math.sin((index / panelRefs.value.length) * Math.PI) * 60
          fromTransform = {
            rotateX: -180 + waveOffset,
            scale: 0.8
          }
          toTransform = {
            rotateX: 0,
            scale: 1
          }
          break
      }

      gsap.from(panel,
        {
          ...fromTransform,
          opacity: 0.2,
          scrollTrigger: {
            trigger: foldSection.value,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5
          }
        }
      )

      // 悬停效果
      panel.addEventListener('mouseenter', () => {
        gsap.to(panel, {
          scale: 1.05,
          boxShadow: '0 15px 40px rgba(250, 204, 21, 0.3)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      panel.addEventListener('mouseleave', () => {
        gsap.to(panel, {
          scale: 1,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    })

    // 中心发光动画
    if (centerGlow.value) {
      gsap.from(centerGlow.value, {
        scale: 0,
        opacity: 0,
        scrollTrigger: {
          trigger: foldSection.value,
          start: 'top bottom',
          end: 'center center',
          scrub: 1
        }
      })
    }

    // 折痕线动画
    lineRefs.value.forEach((line, index) => {
      gsap.from(line, {
        opacity: 0,
        scaleX: 0,
        scrollTrigger: {
          trigger: foldSection.value,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.2
        }
      })
    })
  }, foldSection.value)
}

onMounted(() => {
  setTimeout(() => {
    generatePanels()
    setTimeout(() => {
      initFoldAnimation()
    }, 50)
  }, 200)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.fold-section-233 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0f0a1a 0%, #1a0a2f 50%, #0a0f2a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;

  opacity: 1 !important;}

// 动态背景
.fold-bg-grid-233 {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(250, 204, 21, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(250, 204, 21, 0.04) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 40s linear infinite;
  pointer-events: none;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-50px, -50px); }
}

.fold-bg-glow-233 {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 40%, rgba(250, 204, 21, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(251, 146, 60, 0.1) 0%, transparent 50%);
  pointer-events: none;

  opacity: 1 !important;}

// 标题
.fold-header-233 {
  text-align: center;
  margin-bottom: 50px;
  z-index: 10;

  opacity: 1 !important;}

.fold-title-233 {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  letter-spacing: 6px;

  opacity: 1 !important;}

.fold-title-main-233 {
  background: linear-gradient(135deg, #facc15, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(250, 204, 21, 0.5);
  animation: titleGlow 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes titleGlow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(250, 204, 21, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(251, 146, 60, 0.8));
  }
}

.fold-title-sub-233 {
  background: linear-gradient(135deg, #fb923c, #f87171);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.fold-subtitle-233 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 6px;
  text-transform: uppercase;
  font-weight: 500;

  opacity: 1 !important;}

// 展示区
.fold-display-233 {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 450px;
  perspective: 2000px;
  margin-bottom: 40px;
  z-index: 10;

  opacity: 1 !important;}

.fold-origami-233 {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #facc15, #f97316, #fb923c);
    border-radius: 22px;
    z-index: -1;
    opacity: 0.3;
    filter: blur(15px);
    animation: borderGlow 3s ease-in-out infinite;
  }
}

@keyframes borderGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.fold-panel-233 {
  width: 100%;
  height: 100%;
  overflow: hidden;
  backface-visibility: hidden;
  transition: box-shadow 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  opacity: 1 !important;}

.fold-panel-image-233 {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;

  opacity: 1 !important;}

.fold-panel-shine-233 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;

  opacity: 1 !important;}

.fold-panel-shadow-233 {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  pointer-events: none;

  opacity: 1 !important;}

.fold-center-glow-233 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(250, 204, 21, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

// 折痕线
.fold-lines-233 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;

  opacity: 1 !important;}

.fold-line-233 {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.5), transparent);
  height: 1px;
  opacity: 0.3;
}

// 响应式
@media (max-width: 768px) {
  .fold-title-233 {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 10px;
    letter-spacing: 4px;
  
  opacity: 1 !important;}

  .fold-display-233 {
    height: 350px;
  
  opacity: 1 !important;}
}
</style>
