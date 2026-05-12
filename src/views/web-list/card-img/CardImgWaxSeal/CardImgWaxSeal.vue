<template>
  <div class="card-img-wax-seal" ref="parentRef">
    <!-- 背景层 -->
    <div class="background">
      <!-- 亚麻纹理 -->
      <div class="linen-texture"></div>
      <!-- 背景装饰线条 -->
      <div class="bg-lines">
        <div class="line line-1"></div>
        <div class="line line-2"></div>
        <div class="line line-3"></div>
      </div>
    </div>

    <!-- 主图片容器 -->
    <div class="image-wrapper" ref="wrapperRef">
      <img
        class="main-image"
        ref="mainImageRef"
        :src="imageUrl"
        alt="Wax Seal Reveal"
      />

      <!-- 圆形裁切遮罩 -->
      <div class="circle-mask" ref="maskRef">
        <!-- 蜡封边缘光晕 -->
        <div class="seal-glow" ref="glowRef"></div>
      </div>

      <!-- 四角蜡珠 -->
      <div class="wax-drops">
        <div class="drop drop-1" ref="drop1Ref"></div>
        <div class="drop drop-2" ref="drop2Ref"></div>
        <div class="drop drop-3" ref="drop3Ref"></div>
        <div class="drop drop-4" ref="drop4Ref"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="title-section" ref="titleRef">
      <h1 class="title">Wax Seal</h1>
      <p class="subtitle">火漆启缄 · 密函开启</p>
    </div>

    <!-- SVG滤镜 -->
    <svg class="svg-filters" aria-hidden="true">
      <defs>
        <filter id="organic-edge">
          <feTurbulence
            ref="turbulenceRef"
            type="turbulence"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  revert: () => void
}

const imageUrl = 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const mainImageRef = ref<HTMLImageElement | null>(null)
const maskRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const turbulenceRef = ref<SVGFEHrefElement | null>(null)
const drop1Ref = ref<HTMLElement | null>(null)
const drop2Ref = ref<HTMLElement | null>(null)
const drop3Ref = ref<HTMLElement | null>(null)
const drop4Ref = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !maskRef.value || !mainImageRef.value || !glowRef.value || !titleRef.value) {
    return
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.5,
    },
  })

  cleanupFns.push({
    revert: () => ScrollTrigger.getAll().forEach(t => t.kill()),
  })

  // 圆形裁切扩张
  tl.fromTo(
    maskRef.value,
    { clipPath: 'circle(8% at center)' },
    {
      clipPath: 'circle(100% at center)',
      duration: 1.5,
      ease: 'power3.inOut',
    },
    0
  )

  // 裁切边缘抖动
  tl.fromTo(
    maskRef.value,
    { filter: 'url(#organic-edge)' },
    {
      filter: 'none',
      duration: 1.5,
      ease: 'power3.inOut',
    },
    0
  )

  // 边缘光晕扩张
  tl.fromTo(
    glowRef.value,
    {
      opacity: 0.8,
      scale: 1.2,
    },
    {
      opacity: 0,
      scale: 1.8,
      duration: 1.5,
      ease: 'power3.inOut',
    },
    0
  )

  // 图片亮度提升
  tl.fromTo(
    mainImageRef.value,
    { filter: 'brightness(0.3)' },
    {
      filter: 'brightness(1)',
      duration: 1.5,
      ease: 'power3.inOut',
    },
    0
  )

  // 四角蜡珠显现
  const drops = [drop1Ref.value, drop2Ref.value, drop3Ref.value, drop4Ref.value]
  drops.forEach((drop, index) => {
    if (!drop) return

    tl.fromTo(
      drop,
      {
        opacity: 0,
        scale: 0,
        x: (index % 2 === 0 ? -1 : 1) * 20,
        y: (index < 2 ? -1 : 1) * 20,
      },
      {
        opacity: 0.4,
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      },
      1.4
    )

    tl.to(
      drop,
      {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      1.7
    )
  })

  // 标题淡入
  tl.fromTo(
    titleRef.value,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    },
    1.2
  )

  // 亚麻纹理渐显
  const linenTexture = parentRef.value?.querySelector('.linen-texture')
  if (linenTexture) {
    tl.fromTo(
      linenTexture,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      },
      1.5
    )
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert())
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.card-img-wax-seal {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1210 0%, #2d1f1a 50%, #1a1210 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.background {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.linen-texture {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(180, 160, 140, 0.03) 2px,
      rgba(180, 160, 140, 0.03) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(180, 160, 140, 0.03) 2px,
      rgba(180, 160, 140, 0.03) 4px
    );
  opacity: 0;
}

.bg-lines {
  position: absolute;
  inset: 40px;
  .line {
    position: absolute;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(180, 120, 80, 0.15) 20%,
      rgba(180, 120, 80, 0.15) 80%,
      transparent
    );
    &.line-1 {
      top: 15%;
      left: 0;
      right: 0;
      height: 1px;
    }
    &.line-2 {
      bottom: 15%;
      left: 0;
      right: 0;
      height: 1px;
    }
    &.line-3 {
      top: 50%;
      left: 10%;
      right: 10%;
      height: 1px;
      opacity: 0.5;
    }
  }
}

.image-wrapper {
  position: relative;
  width: 75vw;
  height: 70vh;
  max-width: 1000px;
  max-height: 700px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.3);
  border-radius: 4px;
  box-shadow:
    0 0 60px rgba(0, 0, 0, 0.5),
    inset 0 0 30px rgba(0, 0, 0, 0.2);
}

.circle-mask {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 4px;
}

.seal-glow {
  position: absolute;
  inset: -30px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(180, 60, 30, 0.4) 0%,
    rgba(180, 60, 30, 0.2) 40%,
    transparent 70%
  );
  pointer-events: none;
}

.wax-drops {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .drop {
    position: absolute;
    width: 8px;
    height: 8px;
    background: radial-gradient(
      circle at 30% 30%,
      #c45a3a,
      #8b3a2a
    );
    border-radius: 50%;
    opacity: 0;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 200, 180, 0.3);

    &.drop-1 {
      top: 8%;
      left: 8%;
    }
    &.drop-2 {
      top: 8%;
      right: 8%;
    }
    &.drop-3 {
      bottom: 8%;
      left: 8%;
    }
    &.drop-4 {
      bottom: 8%;
      right: 8%;
    }
  }
}

.title-section {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  opacity: 0;

  .title {
    font-family: 'Playfair Display', 'Georgia', serif;
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 600;
    color: #d4a574;
    margin: 0 0 8px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-shadow: 0 2px 10px rgba(180, 100, 60, 0.3);
  }

  .subtitle {
    font-family: 'Noto Serif SC', 'STSong', serif;
    font-size: clamp(12px, 2vw, 18px);
    color: rgba(200, 160, 120, 0.8);
    margin: 0;
    letter-spacing: 0.3em;
  }
}

.svg-filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}
</style>
