<template>
  <div class="card-image-carbon-crystal" ref="parentRef">
    <div class="scene-container" ref="sceneRef">
      <!-- 背景图片 -->
      <div class="image-container" ref="imageContainerRef">
        <img
          ref="imageRef"
          :src="imageUrl"
          :alt="title"
          class="main-image"
        />
      </div>

      <!-- 碳纤维斜纹网格 -->
      <div class="carbon-grid-container" ref="carbonGridRef">
        <div
          v-for="(stripe, index) in stripes"
          :key="index"
          class="carbon-stripe"
          :ref="el => { if (el) stripeRefs[index] = el as HTMLElement }"
          :style="getStripeStyle(index)"
        >
          <div class="stripe-glow"></div>
        </div>
      </div>

      <!-- 四角网格暗角 -->
      <div class="grid-vignette" ref="vignetteRef"></div>
    </div>

    <!-- 内容 -->
    <div class="content-overlay" ref="contentRef">
      <h2 class="title">{{ title }}</h2>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = { revert: () => void }

const props = withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  title: '碳素晶格',
  subtitle: '斜纹光蚀逐格消隐'
})

const parentRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const carbonGridRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)

const stripeRefs = ref<(HTMLElement | null)[]>([])

let cleanupFns: TweenCleanup[] = []

// 生成斜纹：沿45度对角线排列
const stripeCount = 48 // 48条条纹
const stripes = Array.from({ length: stripeCount }, (_, i) => i)

const getStripeStyle = (index: number) => {
  // 对角线排序：col + row
  const cols = 12
  const stripeWidth = 100 / cols // 每条宽度百分比
  const leftPos = index * stripeWidth // 左边距百分比

  return {
    '--stripe-width': `${stripeWidth}%`,
    '--stripe-left': `${leftPos}%`,
    '--diagonal-index': Math.floor(index / cols) + (index % cols)
  }
}

onMounted(() => {
  if (!parentRef.value) return

  const ctx = gsap.context(() => {
    // ========== 碳纤维条纹消隐动画 ==========
    const validStripes = stripeRefs.value.filter(Boolean)
    if (validStripes.length > 0) {
      const stripeTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({
        revert: () => stripeTl.kill()
      })

      validStripes.forEach((stripe, index) => {
        const row = Math.floor(index / 12)
        const col = index % 12
        const diagonalOrder = row + col

        // 条纹消隐：从黑色渐变至透明
        stripeTl.fromTo(stripe,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.inOut', duration: 0.45 },
          diagonalOrder * 0.07
        )

        // 激光蚀刻边缘高光
        const glow = stripe.querySelector('.stripe-glow')
        if (glow) {
          // 高光瞬间闪烁
          stripeTl.fromTo(glow,
            { opacity: 0, boxShadow: 'none' },
            {
              opacity: 0.7,
              boxShadow: '0 0 3px rgba(180, 220, 255, 0.9), 0 0 8px rgba(150, 200, 240, 0.6)',
              duration: 0.08
            },
            diagonalOrder * 0.07
          )
          stripeTl.to(glow,
            { opacity: 0, duration: 0.12 },
            diagonalOrder * 0.07 + 0.08
          )
        }
      })
    }

    // ========== 图片亮度与色温过渡 ==========
    if (imageRef.value) {
      const imageTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({
        revert: () => imageTl.kill()
      })

      // 亮度从幽暗缓升至标准
      imageTl.fromTo(imageRef.value,
        {
          filter: 'brightness(0.65) saturate(0.9)'
        },
        {
          filter: 'brightness(1.0) saturate(1.0)',
          ease: 'power2.out',
          duration: 1
        },
        0
      )

      // 色温微冷至中性
      imageTl.fromTo(imageRef.value,
        { filter: 'hue-rotate(-5deg)' },
        { filter: 'hue-rotate(0deg)', ease: 'power2.inOut', duration: 0.8 },
        0
      )
    }

    // ========== 四角网格暗角 ==========
    if (vignetteRef.value) {
      const vignetteTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({
        revert: () => vignetteTl.kill()
      })

      // 暗角在条纹消隐后渐显
      vignetteTl.fromTo(vignetteRef.value,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.inOut', duration: 0.6 },
        3.5 // 条纹基本消隐后
      )

      // 低频呼吸
      vignetteTl.to(vignetteRef.value,
        { opacity: 0.4, duration: 3, ease: 'sine.inOut' },
        4
      )
      vignetteTl.to(vignetteRef.value,
        { opacity: 1, duration: 3, ease: 'sine.inOut' },
        7
      )
    }

    // ========== 内容入场动画 ==========
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1
      }
    })

    cleanupFns.push({
      revert: () => contentTl.kill()
    })

    if (contentRef.value) {
      contentTl.fromTo(contentRef.value,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: 'power3.out' },
        0
      )
    }

  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert?.())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.card-image-carbon-crystal {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #080a0c;
}

.scene-container {
  position: relative;
  width: 100%;
  height: 100%;
}

// ========== 背景图片 ==========
.image-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.65) saturate(0.9) hue-rotate(-5deg);
}

// ========== 碳纤维斜纹网格 ==========
.carbon-grid-container {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
}

.carbon-stripe {
  position: absolute;
  width: calc(var(--stripe-width) + 2px);
  height: calc(200% + 10px);
  left: var(--stripe-left);
  top: -50%;
  background: linear-gradient(
    45deg,
    #0a0a0a 0%,
    #151515 20%,
    #0d0d0d 40%,
    #1a1a1a 60%,
    #0a0a0a 80%,
    #151515 100%
  );
  transform: rotate(45deg);
  transform-origin: center center;

  // 碳纤维哑光纹理
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 1px,
        rgba(30, 30, 30, 0.3) 1px,
        rgba(30, 30, 30, 0.3) 2px
      ),
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 1px,
        rgba(40, 40, 40, 0.2) 1px,
        rgba(40, 40, 40, 0.2) 2px
      );
    background-size: 4px 4px;
  }

  // 边缘细微高光
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(60, 60, 60, 0.1) 0%,
      transparent 10%,
      transparent 90%,
      rgba(60, 60, 60, 0.1) 100%
    );
  }
}

.stripe-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(200, 230, 255, 0.5) 0%,
    rgba(180, 220, 255, 0.3) 50%,
    transparent 100%
  );
  opacity: 0;
  pointer-events: none;
}

// ========== 四角网格暗角 ==========
.grid-vignette {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  box-shadow:
    inset 0 0 120px rgba(0, 0, 0, 0.7),
    inset 0 0 200px rgba(0, 0, 0, 0.5);

  // 网格纹理暗角
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(
        45deg,
        transparent 0px,
        transparent 8px,
        rgba(20, 25, 30, 0.1) 8px,
        rgba(20, 25, 30, 0.1) 10px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent 0px,
        transparent 8px,
        rgba(20, 25, 30, 0.1) 8px,
        rgba(20, 25, 30, 0.1) 10px
      );
  }

  // 四角框架
  &::after {
    content: '';
    position: absolute;
    inset: 30px;
    border: 1px solid rgba(60, 70, 80, 0.2);
  }
}

// ========== 内容层 ==========
.content-overlay {
  position: absolute;
  bottom: 12vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  opacity: 0;
}

.title {
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: transparent;
  background: linear-gradient(135deg,
    #d8e4ec 0%,
    #b8c8d4 30%,
    #98b0c0 70%,
    #c0d0dc 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  letter-spacing: 0.4em;
  text-shadow: 0 0 40px rgba(200, 220, 235, 0.3);
  margin-bottom: 1rem;
}

.subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(180, 195, 205, 0.7);
  letter-spacing: 0.5em;
  font-weight: 300;
}
</style>
