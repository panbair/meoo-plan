<template>
  <div class="card-image-obsidian-split" ref="parentRef">
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

      <!-- 左金属帷幕 -->
      <div class="metal-curtain metal-curtain-left" ref="leftCurtainRef">
        <div class="metal-panel" ref="leftPanelRef">
          <div class="metal-brush-texture" ref="leftBrushRef"></div>
          <div class="metal-edge-glow"></div>
        </div>
        <div class="metal-frame-accent metal-frame-left"></div>
      </div>

      <!-- 右金属帷幕 -->
      <div class="metal-curtain metal-curtain-right" ref="rightCurtainRef">
        <div class="metal-panel" ref="rightPanelRef">
          <div class="metal-brush-texture" ref="rightBrushRef"></div>
          <div class="metal-edge-glow"></div>
        </div>
        <div class="metal-frame-accent metal-frame-right"></div>
      </div>

      <!-- 中线冷白光隙 -->
      <div class="center-cold-seam" ref="coldSeamRef">
        <div class="seam-line"></div>
        <div class="seam-glow"></div>
      </div>

      <!-- 四角金属框架阴影 -->
      <div class="metal-frame-shadow" ref="frameShadowRef"></div>
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
  imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80',
  title: '曜黑对开',
  subtitle: '双幕合拢商务启幕'
})

const parentRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const leftCurtainRef = ref<HTMLElement | null>(null)
const rightCurtainRef = ref<HTMLElement | null>(null)
const leftPanelRef = ref<HTMLElement | null>(null)
const rightPanelRef = ref<HTMLElement | null>(null)
const leftBrushRef = ref<HTMLElement | null>(null)
const rightBrushRef = ref<HTMLElement | null>(null)
const coldSeamRef = ref<HTMLElement | null>(null)
const frameShadowRef = ref<HTMLElement | null>(null)
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
        end: 'bottom top',      // 元素顶部离开视口底部时结束
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
      // 左帷幕：-110% → 0%
      mainTl.to(leftCurtainRef.value, {
        x: '0%',
        ease: 'power2.inOut',
        duration: 1
      }, 0)

      // 右帷幕：+110% → 0%
      mainTl.to(rightCurtainRef.value, {
        x: '0%',
        ease: 'power2.inOut',
        duration: 1
      }, 0)
    }

    // 帷幕可见性：初始可见，动画结束后渐隐
    if (leftPanelRef.value && rightPanelRef.value) {
      mainTl.to([leftPanelRef.value, rightPanelRef.value], {
        opacity: 0,
        ease: 'power2.in',
        duration: 0.5
      }, 1.2)
    }

    // ========== 中线光缝效果 ==========
    if (coldSeamRef.value) {
      const seamLine = coldSeamRef.value.querySelector('.seam-line')
      const seamGlow = coldSeamRef.value.querySelector('.seam-glow')

      // 光隙在帷幕即将合拢时闪现
      mainTl.fromTo(coldSeamRef.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.15, ease: 'power4.out' },
        0.85
      )

      // 光隙快速消散
      mainTl.to(coldSeamRef.value, {
        opacity: 0,
        ease: 'power2.in',
        duration: 0.2
      }, 1.0)

      // 冷光脉冲 box-shadow
      if (seamLine) {
        mainTl.fromTo(seamLine,
          {
            boxShadow: '0 0 2px rgba(200, 220, 255, 0)',
            width: '1px'
          },
          {
            boxShadow: '0 0 25px rgba(200, 220, 255, 0.9), 0 0 50px rgba(180, 200, 240, 0.6)',
            width: '3px',
            ease: 'power3.out',
            duration: 0.15
          },
          0.85
        )

        mainTl.to(seamLine, {
          boxShadow: '0 0 2px rgba(200, 220, 255, 0)',
          width: '1px',
          ease: 'power2.in',
          duration: 0.2
        }, 1.0)
      }

      // 光隙扩散
      if (seamGlow) {
        mainTl.fromTo(seamGlow,
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 0.6, ease: 'power2.out', duration: 0.12 },
          0.85
        )

        mainTl.to(seamGlow, {
          scaleY: 1.5,
          opacity: 0,
          ease: 'expo.out',
          duration: 0.18
        }, 0.97)
      }
    }

    // ========== 拉丝纹理涟漪 ==========
    if (leftBrushRef.value && rightBrushRef.value) {
      mainTl.fromTo(leftBrushRef.value,
        { backgroundPositionY: '0%' },
        { backgroundPositionY: '-80%', ease: 'power2.inOut', duration: 0.3 },
        0.9
      )

      mainTl.fromTo(rightBrushRef.value,
        { backgroundPositionY: '0%' },
        { backgroundPositionY: '80%', ease: 'power2.inOut', duration: 0.3 },
        0.9
      )
    }

    // ========== 帷幕冷光脉冲 ==========
    if (leftPanelRef.value && rightPanelRef.value) {
      mainTl.fromTo([leftPanelRef.value, rightPanelRef.value],
        { boxShadow: 'inset 0 0 30px rgba(30, 35, 45, 0.2)' },
        { boxShadow: 'inset 0 0 80px rgba(180, 200, 230, 0.4), 0 0 25px rgba(150, 180, 220, 0.3)', ease: 'power2.inOut', duration: 0.2 },
        0.85
      )
    }

    // ========== 帷幕弹性回缩 ==========
    if (leftCurtainRef.value && rightCurtainRef.value) {
      mainTl.to(leftCurtainRef.value, { x: '+=2', ease: 'power2.out', duration: 0.05 }, 1.2)
      mainTl.to(leftCurtainRef.value, { x: '-=2', ease: 'back.out(1.5)', duration: 0.1 }, 1.25)

      mainTl.to(rightCurtainRef.value, { x: '-=2', ease: 'power2.out', duration: 0.05 }, 1.2)
      mainTl.to(rightCurtainRef.value, { x: '+=2', ease: 'back.out(1.5)', duration: 0.1 }, 1.25)
    }

    // ========== 图片亮度与对比度 ==========
    // 向下滚动：图片从暗淡变明亮
    // 向上滚动：图片从明亮变暗淡
    if (imageRef.value) {
      mainTl.fromTo(imageRef.value,
        {
          filter: 'brightness(0.7) contrast(1.05) saturate(0.8)'
        },
        {
          filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
          ease: 'power2.out',
          duration: 1
        },
        0
      )
    }

    // ========== 四角金属框架阴影 ==========
    if (frameShadowRef.value) {
      mainTl.fromTo(frameShadowRef.value,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.inOut', duration: 0.6 },
        1.4
      )

      // 低频呼吸
      mainTl.to(frameShadowRef.value, { opacity: 0.5, duration: 2, ease: 'sine.inOut' }, 2)
      mainTl.to(frameShadowRef.value, { opacity: 0.2, duration: 2, ease: 'sine.inOut' }, 4)
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
.card-image-obsidian-split {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #050608;
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
  filter: brightness(0.7) contrast(1.05) saturate(0.8);
}

// ========== 金属帷幕 ==========
.metal-curtain {
  position: absolute;
  top: 0;
  width: 55%;
  height: 100%;
  z-index: 5;
  overflow: hidden;
}

.metal-curtain-left {
  left: 0;
  transform: translateX(-110%);
}

.metal-curtain-right {
  right: 0;
  transform: translateX(110%);
}

.metal-panel {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    #0a0b0e 0%,
    #12141a 15%,
    #1a1d25 30%,
    #22262f 50%,
    #1a1d25 70%,
    #12141a 85%,
    #0a0b0e 100%
  );
  box-shadow:
    inset 0 0 40px rgba(30, 35, 45, 0.2),
    inset 0 0 80px rgba(20, 25, 35, 0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 30% 20%, rgba(60, 70, 90, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 70% 80%, rgba(40, 50, 70, 0.1) 0%, transparent 50%);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(100, 120, 150, 0.08) 0%, transparent 15%, transparent 85%, rgba(100, 120, 150, 0.05) 100%);
  }
}

.metal-brush-texture {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    rgba(30, 35, 45, 0.3) 0px,
    rgba(50, 55, 70, 0.2) 1px,
    rgba(30, 35, 45, 0.3) 2px
  );
  background-size: 3px 100%;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      180deg,
      transparent 0px,
      rgba(80, 100, 130, 0.08) 2px,
      transparent 4px,
      rgba(60, 80, 110, 0.05) 6px,
      transparent 8px
    );
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(100, 130, 170, 0.05) 0%, transparent 70%);
  }
}

.metal-edge-glow {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, rgba(180, 200, 230, 0.2) 0%, rgba(200, 220, 255, 0.35) 50%, rgba(180, 200, 230, 0.2) 100%);
  filter: blur(1px);
}

.metal-curtain-left .metal-edge-glow { right: 0; }
.metal-curtain-right .metal-edge-glow { left: 0; }

.metal-frame-accent {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent 0%, rgba(80, 100, 140, 0.3) 20%, rgba(100, 130, 170, 0.4) 50%, rgba(80, 100, 140, 0.3) 80%, transparent 100%);
}

.metal-frame-left { right: 10px; }
.metal-frame-right { left: 10px; }

// ========== 中线冷白光隙 ==========
.center-cold-seam {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 60px;
  transform: translateX(-50%);
  z-index: 10;
  opacity: 0;
  pointer-events: none;
}

.seam-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(220, 235, 255, 0.95) 0%, rgba(255, 255, 255, 1) 30%, rgba(220, 235, 255, 0.98) 70%, rgba(255, 255, 255, 0.95) 100%);
  box-shadow: 0 0 15px rgba(200, 220, 255, 0.8), 0 0 30px rgba(180, 200, 240, 0.5);
}

.seam-glow {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 80px;
  transform: translateX(-50%) scaleY(0);
  background: radial-gradient(ellipse at center, rgba(200, 220, 255, 0.6) 0%, rgba(180, 200, 240, 0.3) 40%, transparent 70%);
  transform-origin: center center;
}

// ========== 四角金属框架阴影 ==========
.metal-frame-shadow {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  box-shadow: inset 0 0 150px rgba(5, 6, 8, 0.5), inset 0 0 250px rgba(5, 6, 8, 0.3);

  &::before {
    content: '';
    position: absolute;
    inset: 30px;
    border: 1px solid rgba(60, 80, 110, 0.15);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 25% 25% at 0% 0%, rgba(20, 25, 35, 0.5) 0%, transparent 100%),
      radial-gradient(ellipse 25% 25% at 100% 0%, rgba(20, 25, 35, 0.5) 0%, transparent 100%),
      radial-gradient(ellipse 25% 25% at 0% 100%, rgba(20, 25, 35, 0.5) 0%, transparent 100%),
      radial-gradient(ellipse 25% 25% at 100% 100%, rgba(20, 25, 35, 0.5) 0%, transparent 100%);
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
  background: linear-gradient(135deg, #e8eef4 0%, #c8d8e8 30%, #a8bcd0 70%, #d8e4f0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  letter-spacing: 0.5em;
  text-shadow: 0 0 40px rgba(200, 220, 240, 0.3);
  margin-bottom: 1rem;
}

.subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(180, 200, 220, 0.7);
  letter-spacing: 0.6em;
  font-weight: 300;
}
</style>
