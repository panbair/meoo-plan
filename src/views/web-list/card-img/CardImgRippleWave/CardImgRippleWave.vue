<template>
  <section ref="parentRef" class="ripple-wave">
    <!-- 背景 -->
    <div class="ripple-bg">
      <div class="bg-radial" />
      <div class="bg-grid" />
    </div>

    <!-- 涟漪扩散环 -->
    <div class="ripple-rings">
      <div ref="ring1Ref" class="ripple-ring ripple-ring-1" />
      <div ref="ring2Ref" class="ripple-ring ripple-ring-2" />
      <div ref="ring3Ref" class="ripple-ring ripple-ring-3" />
    </div>

    <!-- 图片容器 -->
    <div class="ripple-container">
      <div
        v-for="(img, index) in images"
        :key="index"
        :ref="el => setCardRef(el, index)"
        class="ripple-card"
      >
        <div class="card-mask">
          <img :src="img.src" :alt="img.alt" class="ripple-img" />
        </div>
        <div class="card-glow" />
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="ripple-title">
      <span class="title-line">涟漪扩散</span>
      <span class="title-sub">Ripple Reveal</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ImageItem {
  src: string
  alt: string
}

const images: ImageItem[] = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', alt: 'Mountain' },
  { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=85', alt: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=85', alt: 'Forest' },
  { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=85', alt: 'Landscape' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=85', alt: 'Valley' },
  { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=85', alt: 'Path' },
  { src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=85', alt: 'Waterfall' },
  { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=85', alt: 'Aerial' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=85', alt: 'Sunlight' }
]

// DOM refs
const parentRef = ref<HTMLElement | null>(null)
const ring1Ref = ref<HTMLElement | null>(null)
const ring2Ref = ref<HTMLElement | null>(null)
const ring3Ref = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const setCardRef = (el: unknown, index: number) => {
  if (el) {
    const element = (el as { $el?: HTMLElement }).$el ?? el as HTMLElement
    cardRefs.value[index] = element
  }
}

// Animation state
let scrollTriggerInstance: ScrollTrigger | null = null
let breathingTween: gsap.core.Tween | null = null
let isAnimated = false

const initAnimations = () => {
  if (!parentRef.value) return

  // 设置初始状态 - 全部隐藏
  gsap.set([ring1Ref.value, ring2Ref.value, ring3Ref.value], { scale: 0, opacity: 0 })
  gsap.set(titleRef.value, { opacity: 0, y: 40 })

  cardRefs.value.forEach((card) => {
    if (!card) return
    gsap.set(card, { scale: 0, opacity: 0, y: 30 })
  })

  // 创建 ScrollTrigger - 使用 scrub 模式
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 80%',
    end: 'bottom 30%',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress

      // 涟漪环扩散
      if (ring1Ref.value) {
        const ring1Scale = progress * 1.5
        const ring1Opacity = Math.max(0, 0.8 - progress * 1.2)
        gsap.set(ring1Ref.value, { scale: ring1Scale, opacity: ring1Opacity })
      }

      if (ring2Ref.value) {
        const ring2Scale = progress * 1.8
        const ring2Opacity = Math.max(0, 0.5 - progress * 0.8)
        gsap.set(ring2Ref.value, { scale: ring2Scale, opacity: ring2Opacity })
      }

      if (ring3Ref.value) {
        const ring3Scale = progress * 2
        const ring3Opacity = Math.max(0, 0.3 - progress * 0.5)
        gsap.set(ring3Ref.value, { scale: ring3Scale, opacity: ring3Opacity })
      }

      // 卡片显现 - 从中心向外
      const centerIndex = Math.floor(images.length / 2)
      cardRefs.value.forEach((card, index) => {
        if (!card) return

        const row = Math.floor(index / 3)
        const col = index % 3
        const centerRow = Math.floor(centerIndex / 3)
        const centerCol = centerIndex % 3
        const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol)

        // 每层距离的延迟
        const cardProgress = Math.max(0, Math.min(1, (progress - distance * 0.06) * 2))

        if (cardProgress > 0) {
          const scale = 0 + 1 * cardProgress
          const opacity = cardProgress
          const y = 30 - 30 * cardProgress
          gsap.set(card, { scale, opacity, y })
        }
      })

      // 标题
      if (progress > 0.7) {
        const titleProgress = (progress - 0.7) / 0.3
        gsap.set(titleRef.value, {
          opacity: titleProgress,
          y: 40 - 40 * titleProgress
        })
      } else {
        gsap.set(titleRef.value, { opacity: 0, y: 40 })
      }

      // 呼吸效果 - 动画完成后开始
      if (progress > 0.8 && !isAnimated) {
        isAnimated = true
        startBreathing()
      } else if (progress < 0.6 && isAnimated) {
        isAnimated = false
        stopBreathing()
      }
    }
  })
}

const startBreathing = () => {
  if (breathingTween) {
    breathingTween.kill()
  }

  breathingTween = gsap.to(cardRefs.value, {
    y: -3,
    duration: 1.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    stagger: {
      each: 0.08,
      from: 'center'
    }
  })
}

const stopBreathing = () => {
  if (breathingTween) {
    breathingTween.kill()
    breathingTween = null
  }
}

onMounted(() => {
  nextTick(() => {
    initAnimations()
  })
})

onUnmounted(() => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
    scrollTriggerInstance = null
  }

  if (breathingTween) {
    breathingTween.kill()
    breathingTween = null
  }

  gsap.killTweensOf(cardRefs.value)
  gsap.killTweensOf([ring1Ref.value, ring2Ref.value, ring3Ref.value])
})
</script>

<style scoped lang="scss">
.ripple-wave {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #0c1222 0%, #0a0f1a 50%, #0d1526 100%);
}

.ripple-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-radial {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 50% 40% at 50% 50%,
    rgba(64, 132, 206, 0.12) 0%,
    transparent 70%
  );
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(100, 180, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 180, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.ripple-rings {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.ripple-ring {
  position: absolute;
  border: 1px solid rgba(100, 180, 255, 0.4);
  border-radius: 50%;
  box-shadow:
    0 0 15px rgba(100, 180, 255, 0.2),
    inset 0 0 15px rgba(100, 180, 255, 0.1);
}

.ripple-ring-1 {
  width: 200px;
  height: 200px;
}

.ripple-ring-2 {
  width: 350px;
  height: 350px;
  border-color: rgba(100, 180, 255, 0.25);
}

.ripple-ring-3 {
  width: 500px;
  height: 500px;
  border-color: rgba(100, 180, 255, 0.15);
}

.ripple-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 30px;
  position: relative;
  z-index: 2;
}

.ripple-card {
  position: relative;
  width: 160px;
  height: 110px;
  transform-origin: center center;

  .card-mask {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.4),
      0 0 20px rgba(100, 180, 255, 0.15);
  }

  .ripple-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .card-glow {
    position: absolute;
    inset: -5px;
    border-radius: 14px;
    background: linear-gradient(
      135deg,
      rgba(100, 180, 255, 0.3) 0%,
      transparent 50%,
      rgba(100, 180, 255, 0.2) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover .card-glow {
    opacity: 1;
  }

  &:hover .ripple-img {
    transform: scale(1.05);
  }
}

.ripple-title {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;

  .title-line {
    display: block;
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: 28px;
    font-weight: 600;
    color: #e8f4ff;
    letter-spacing: 10px;
    text-shadow: 0 0 30px rgba(100, 180, 255, 0.6);
  }

  .title-sub {
    display: block;
    font-family: 'Playfair Display', 'Times New Roman', serif;
    font-size: 12px;
    color: rgba(100, 180, 255, 0.6);
    letter-spacing: 6px;
    margin-top: 10px;
    text-transform: uppercase;
  }
}

@media (max-width: 768px) {
  .ripple-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 20px;
  }

  .ripple-card {
    width: 110px;
    height: 75px;
  }

  .ripple-ring-1 { width: 140px; height: 140px; }
  .ripple-ring-2 { width: 240px; height: 240px; }
  .ripple-ring-3 { width: 340px; height: 340px; }

  .ripple-title {
    bottom: 50px;

    .title-line {
      font-size: 20px;
      letter-spacing: 6px;
    }

    .title-sub {
      font-size: 10px;
      letter-spacing: 3px;
    }
  }
}

@media (max-width: 480px) {
  .ripple-container {
    gap: 8px;
    padding: 15px;
  }

  .ripple-card {
    width: 90px;
    height: 62px;
  }
}
</style>
