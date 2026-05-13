<template>
  <div class="card-image-curtain-rise" ref="parentRef">
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

      <!-- 左帷幕 -->
      <div class="curtain-wrapper curtain-left" ref="leftCurtainRef">
        <div class="curtain-panel" ref="leftPanelRef">
          <div class="curtain-texture"></div>
          <div class="curtain-fringe"></div>
          <div class="curtain-glow-edge"></div>
        </div>
      </div>

      <!-- 右帷幕 -->
      <div class="curtain-wrapper curtain-right" ref="rightCurtainRef">
        <div class="curtain-panel" ref="rightPanelRef">
          <div class="curtain-texture"></div>
          <div class="curtain-fringe"></div>
          <div class="curtain-glow-edge"></div>
        </div>
      </div>

      <!-- 中线光缝 -->
      <div class="center-light-seam" ref="lightSeamRef">
        <div class="seam-inner"></div>
      </div>

      <!-- 四角暗影 -->
      <div class="corner-vignette" ref="vignetteRef"></div>
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
  title: '帷幕聚拢',
  subtitle: '合幕成光开幕'
})

const parentRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const leftCurtainRef = ref<HTMLElement | null>(null)
const rightCurtainRef = ref<HTMLElement | null>(null)
const leftPanelRef = ref<HTMLElement | null>(null)
const rightPanelRef = ref<HTMLElement | null>(null)
const lightSeamRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value) return

  const ctx = gsap.context(() => {
    // ========== 主动画 Timeline ==========
    // 统一管理帷幕、图片、光缝效果
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top bottom',    // 元素底部进入视口顶部时开始
        end: 'bottom top',       // 元素顶部离开视口底部时结束
        scrub: 1.5
      }
    })

    cleanupFns.push({
      revert: () => {
        mainTl.kill()
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === parentRef.value) {
            st.kill()
          }
        })
      }
    })

    // ========== 帷幕聚拢/分开动画 ==========
    // 向下滚动(0→1): 帷幕从外侧合拢
    // 向上滚动(1→0): 帷幕从中间分开
    if (leftCurtainRef.value && rightCurtainRef.value) {
      // 左帷幕：-120% → 0%
      mainTl.to(leftCurtainRef.value, {
        x: '0%',
        ease: 'power2.inOut',
        duration: 1
      }, 0)

      // 右帷幕：+120% → 0%
      mainTl.to(rightCurtainRef.value, {
        x: '0%',
        ease: 'power2.inOut',
        duration: 1
      }, 0)
    }

    // 帷幕可见性：合拢后渐隐
    if (leftPanelRef.value && rightPanelRef.value) {
      mainTl.to([leftPanelRef.value, rightPanelRef.value], {
        opacity: 0,
        ease: 'power2.in',
        duration: 0.5
      }, 1.2)
    }

    // ========== 中线金色光缝 ==========
    if (lightSeamRef.value) {
      // 光缝在帷幕即将合拢时闪现
      mainTl.fromTo(lightSeamRef.value,
        { opacity: 0, scaleX: 0 },
        { opacity: 0.95, scaleX: 1, ease: 'power4.out', duration: 0.15 },
        0.85
      )

      // 光缝快速消散
      mainTl.to(lightSeamRef.value, {
        opacity: 0,
        scaleX: 0.5,
        ease: 'power2.in',
        duration: 0.2
      }, 1.0)
    }

    // ========== 帷幕光泽涌动 ==========
    if (leftPanelRef.value && rightPanelRef.value) {
      mainTl.fromTo([leftPanelRef.value, rightPanelRef.value],
        { boxShadow: 'inset 0 0 30px rgba(139, 90, 43, 0.3)' },
        { boxShadow: 'inset 0 0 80px rgba(255, 215, 100, 0.5), inset 0 0 40px rgba(200, 160, 80, 0.4)', ease: 'power2.inOut', duration: 0.2 },
        0.85
      )
    }

    // ========== 帷幕弹性回缩 ==========
    if (leftCurtainRef.value && rightCurtainRef.value) {
      mainTl.to(leftCurtainRef.value, { x: '+=3', ease: 'power2.out', duration: 0.05 }, 1.2)
      mainTl.to(leftCurtainRef.value, { x: '-=3', ease: 'back.out(1.2)', duration: 0.1 }, 1.25)

      mainTl.to(rightCurtainRef.value, { x: '-=3', ease: 'power2.out', duration: 0.05 }, 1.2)
      mainTl.to(rightCurtainRef.value, { x: '+=3', ease: 'back.out(1.2)', duration: 0.1 }, 1.25)
    }

    // ========== 图片亮度与色温 ==========
    // 向下滚动：图片从暗淡变明亮
    // 向上滚动：图片从明亮变暗淡
    if (imageRef.value) {
      mainTl.fromTo(imageRef.value,
        { filter: 'brightness(0.7) saturate(0.85)' },
        { filter: 'brightness(1.0) saturate(1.0)', ease: 'power2.out', duration: 1 },
        0
      )

      mainTl.fromTo(imageRef.value,
        { filter: 'hue-rotate(-8deg)' },
        { filter: 'hue-rotate(0deg)', ease: 'power2.inOut', duration: 0.8 },
        0
      )
    }

    // ========== 四角暗影 ==========
    if (vignetteRef.value) {
      mainTl.fromTo(vignetteRef.value,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.inOut', duration: 0.6 },
        1.4
      )

      // 低频呼吸 5s 周期
      mainTl.to(vignetteRef.value, { opacity: 0.5, duration: 2.5, ease: 'sine.inOut' }, 2)
      mainTl.to(vignetteRef.value, { opacity: 0.25, duration: 2.5, ease: 'sine.inOut' }, 4.5)
    }

    // ========== 内容入场动画 ==========
    if (contentRef.value) {
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 75%',
          end: 'top 20%',
          scrub: 1
        }
      })

      cleanupFns.push({
        revert: () => contentTl.kill()
      })

      contentTl.fromTo(contentRef.value,
        { opacity: 0, y: 50 },
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
.card-image-curtain-rise {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0806;
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
  filter: brightness(0.7) saturate(0.85);
}

// ========== 帷幕 ==========
.curtain-wrapper {
  position: absolute;
  top: 0;
  width: 55%;
  height: 100%;
  z-index: 5;
  overflow: hidden;
}

.curtain-left {
  left: 0;
  transform: translateX(-120%);
}

.curtain-right {
  right: 0;
  transform: translateX(120%);
}

.curtain-panel {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    #1a1208 0%,
    #2d1f0f 15%,
    #3d2a14 30%,
    #4a3419 50%,
    #3d2a14 70%,
    #2d1f0f 85%,
    #1a1208 100%
  );
  box-shadow:
    inset 0 0 30px rgba(139, 90, 43, 0.3),
    inset 0 0 60px rgba(100, 60, 20, 0.2);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(90deg, rgba(60, 40, 20, 0.15) 0px, rgba(80, 50, 25, 0.2) 1px, rgba(60, 40, 20, 0.15) 3px),
      repeating-linear-gradient(0deg, rgba(80, 50, 25, 0.1) 0px, rgba(100, 70, 35, 0.15) 2px, rgba(80, 50, 25, 0.1) 4px);
    background-size: 6px 8px, 8px 6px;
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(180, 140, 80, 0.1) 0%, transparent 20%, transparent 80%, rgba(180, 140, 80, 0.05) 100%);
  }
}

.curtain-texture {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200, 160, 100, 0.08) 0%, transparent 60%);
}

.curtain-fringe {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: repeating-linear-gradient(90deg, #2d1f0f 0px, #3d2a14 4px, #2d1f0f 8px);
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(to bottom, transparent, rgba(60, 40, 20, 0.5));
  }
}

.curtain-glow-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, rgba(255, 215, 100, 0.3) 0%, rgba(255, 200, 80, 0.5) 50%, rgba(255, 180, 60, 0.3) 100%);
  filter: blur(2px);
}

.curtain-left .curtain-glow-edge { right: 0; }
.curtain-right .curtain-glow-edge { left: 0; }

// ========== 中线光缝 ==========
.center-light-seam {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(255, 230, 150, 0.9) 0%, rgba(255, 215, 0, 1) 30%, rgba(255, 240, 180, 0.95) 50%, rgba(255, 215, 0, 1) 70%, rgba(255, 230, 150, 0.9) 100%);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 200, 50, 0.6), 0 0 100px rgba(255, 180, 0, 0.4);
  z-index: 10;
  opacity: 0;
  scaleX: 0;

  &::before {
    content: '';
    position: absolute;
    inset: -20px 0;
    background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  }
}

.seam-inner {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 245, 200, 0.8) 0%, rgba(255, 255, 220, 0.9) 50%, rgba(255, 245, 200, 0.8) 100%);
}

// ========== 四角暗影 ==========
.corner-vignette {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  box-shadow: inset 0 0 150px rgba(10, 8, 6, 0.6), inset 0 0 250px rgba(10, 8, 6, 0.4);

  &::before {
    content: '';
    position: absolute;
    inset: 40px;
    border: 1px solid rgba(139, 90, 43, 0.15);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 30% 30% at 0% 0%, rgba(45, 31, 15, 0.4) 0%, transparent 100%),
      radial-gradient(ellipse 30% 30% at 100% 0%, rgba(45, 31, 15, 0.4) 0%, transparent 100%),
      radial-gradient(ellipse 30% 30% at 0% 100%, rgba(45, 31, 15, 0.4) 0%, transparent 100%),
      radial-gradient(ellipse 30% 30% at 100% 100%, rgba(45, 31, 15, 0.4) 0%, transparent 100%);
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
  background: linear-gradient(135deg, #f5e6d0 0%, #e8d4b8 30%, #d4c4a8 70%, #f0e0c8 100%);
  background-clip: text;
  -webkit-background-clip: text;
  letter-spacing: 0.5em;
  text-shadow: 0 0 40px rgba(245, 230, 208, 0.3);
  margin-bottom: 1rem;
}

.subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(220, 200, 170, 0.7);
  letter-spacing: 0.6em;
  font-weight: 300;
}
</style>
