<template>
  <div ref="parentRef" class="negative-reveal-container">
    <!-- 深邃渐变背景 -->
    <div ref="bgRef" class="reveal-bg">
      <div class="bg-gradient"></div>
      <div class="bg-light-rays"></div>
    </div>

    <!-- 主内容区 -->
    <div ref="contentWrapperRef" class="content-wrapper">
      <!-- 外层颗粒幕布（黑白银盐） -->
      <div ref="grainMaskRef" class="grain-curtain">
        <div class="grain-texture"></div>
        <div class="grain-flow-particles"></div>
      </div>

      <!-- 内层灰阶雾膜 -->
      <div ref="fogMaskRef" class="fog-mask">
        <div class="fog-radial"></div>
        <div class="fog-texture"></div>
      </div>

      <!-- 图片容器 -->
      <div ref="imageContainerRef" class="image-container">
        <img
          ref="imageRef"
          :src="imageUrl"
          alt="Negative Reveal"
          class="reveal-image"
        />
        <!-- 定影液水渍 -->
        <div ref="fixativeStainRef" class="fixative-stain"></div>
        <!-- 边缘光晕 -->
        <div ref="edgeGlowRef" class="image-edge-glow"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="reveal-title">
      <span class="title-cn">负片揭幕</span>
      <span class="title-en">NEGATIVE REVEAL</span>
    </div>

    <!-- 银盐噪点 SVG 滤镜 -->
    <svg class="grain-svg-filter" aria-hidden="true">
      <defs>
        <filter id="silver-grain-negative" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            ref="feTurbulenceRef"
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="5"
            seed="15"
            result="grainNoise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="grainNoise"
            result="monoGrain"
          />
          <feComponentTransfer in="monoGrain" result="adjustedGrain">
            <feFuncR type="linear" slope="1.5" intercept="-0.1"/>
            <feFuncG type="linear" slope="1.5" intercept="-0.1"/>
            <feFuncB type="linear" slope="1.5" intercept="-0.1"/>
          </feComponentTransfer>
          <feBlend
            in="SourceGraphic"
            in2="adjustedGrain"
            mode="overlay"
            result="grainBlend"
          />
        </filter>

        <filter id="fog-texture-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="3"
            result="fogNoise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="fogNoise"
            result="grayFog"
          />
          <feGaussianBlur in="grayFog" stdDeviation="3" result="blurredFog"/>
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

type TweenCleanup = () => void

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const contentWrapperRef = ref<HTMLElement | null>(null)
const grainMaskRef = ref<HTMLElement | null>(null)
const fogMaskRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const fixativeStainRef = ref<HTMLElement | null>(null)
const edgeGlowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const feTurbulenceRef = ref<SVGFEPrimeTransferTextureElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !contentWrapperRef.value || !imageRef.value) return

  const ctx = gsap.context(() => {
    // ===== 初始状态设置 =====
    
    // 内容容器初始状态
    gsap.set(contentWrapperRef.value, {
      opacity: 0,
      scale: 0.92,
      y: 30,
    })

    // 图片初始状态 - 极度朦胧
    gsap.set(imageRef.value, {
      filter: 'blur(18px) brightness(0.35) contrast(0.9) hue-rotate(-3deg)',
      scale: 1.06,
    })

    // 外层颗粒幕布初始状态 - 完全覆盖
    gsap.set(grainMaskRef.value, {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
    })

    // 内层灰阶雾膜初始状态 - 完全覆盖
    gsap.set(fogMaskRef.value, {
      opacity: 1,
    })

    // 定影液痕迹初始状态
    gsap.set(fixativeStainRef.value, {
      opacity: 0.15,
    })

    // 边缘光晕初始状态
    gsap.set(edgeGlowRef.value, {
      opacity: 0,
    })

    // 标题初始状态
    gsap.set(titleRef.value, {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
    })

    // 创建银盐颗粒（外层幕布流动效果）
    if (grainMaskRef.value) {
      const particlesContainer = grainMaskRef.value.querySelector('.grain-flow-particles') as HTMLElement
      if (particlesContainer) {
        for (let i = 0; i < 80; i++) {
          const particle = document.createElement('div')
          particle.className = 'flow-particle'
          const size = 1 + Math.random() * 2
          particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            opacity: ${0.2 + Math.random() * 0.4};
            animation-duration: ${3 + Math.random() * 6}s;
            animation-delay: ${Math.random() * 4}s;
          `
          particlesContainer.appendChild(particle)
        }
      }
    }

    // ===== ScrollTrigger 主动画 Timeline =====
    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5,
      },
    })

    // 1. 内容容器入场
    revealTl.to(contentWrapperRef.value, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, 0)

    // 2. 标题显现（提前一点）
    revealTl.to(titleRef.value, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'power2.out',
    }, 0.2)

    // 3. 外层颗粒幕布从顶部滑落（duration: 1.2s, ease: power3.in）
    revealTl.to(grainMaskRef.value, {
      clipPath: 'inset(100% 0% 0% 0%)',
      duration: 1.2,
      ease: 'power3.in',
    }, 0.4)

    // 4. 内层灰阶雾膜从中心向外溶解（径向渐变消退）
    revealTl.to(fogMaskRef.value, {
      opacity: 0,
      duration: 1.0,
      ease: 'power2.out',
    }, 1.6)

    // 5. 图片同步属性联动 - blur 衰减
    revealTl.to(imageRef.value, {
      filter: 'blur(12px) brightness(0.5) contrast(0.95) hue-rotate(-2deg)',
      duration: 1.0,
      ease: 'power2.out',
    }, 1.6)

    // 6. 图片同步 - scale 微缩归位
    revealTl.to(imageRef.value, {
      scale: 1.02,
      duration: 1.0,
      ease: 'power2.out',
    }, 1.6)

    // 7. 图片色温过渡 - 冷灰到微暖
    revealTl.to(imageRef.value, {
      filter: 'blur(6px) brightness(0.65) contrast(1.0) hue-rotate(-1deg)',
      duration: 0.8,
      ease: 'power2.inOut',
    }, 2.0)

    // 8. 图片继续清晰化
    revealTl.to(imageRef.value, {
      filter: 'blur(2px) brightness(0.8) contrast(1.05) hue-rotate(0deg)',
      duration: 0.6,
      ease: 'power2.out',
    }, 2.4)

    // 9. 图片最终锐利呈现
    revealTl.to(imageRef.value, {
      filter: 'blur(0px) brightness(1) contrast(1) hue-rotate(0deg)',
      scale: 1.0,
      duration: 0.8,
      ease: 'power3.out',
    }, 2.8)

    // 10. 边缘光晕显现
    revealTl.to(edgeGlowRef.value, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, 2.8)

    // 11. 定影液水渍痕迹消退
    revealTl.to(fixativeStainRef.value, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, 3.0)

    cleanupFns.push({
      revert: () => revealTl.kill(),
    })

    // ===== 独立呼吸动画 =====
    
    // 边缘光晕脉冲
    const edgeGlowTl = gsap.timeline({ repeat: -1, yoyo: true })
    edgeGlowTl.to(edgeGlowRef.value, {
      opacity: 0.6,
      scale: 1.02,
      duration: 3,
      ease: 'sine.inOut',
    })
    cleanupFns.push({ revert: () => edgeGlowTl.kill() })

    // 定影液痕迹微弱闪烁
    const stainTl = gsap.timeline({ repeat: -1, yoyo: true })
    stainTl.to(fixativeStainRef.value, {
      opacity: 0.08,
      duration: 2.5,
      ease: 'sine.inOut',
    })
    cleanupFns.push({ revert: () => stainTl.kill() })

    // 银盐颗粒流动动画
    const particles = grainMaskRef.value?.querySelectorAll('.flow-particle')
    particles?.forEach((particle, index) => {
      gsap.to(particle, {
        y: `-=${20 + Math.random() * 30}`,
        x: `+=${(Math.random() - 0.5) * 20}`,
        opacity: 0.1 + Math.random() * 0.3,
        duration: 2 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      })
    })

    // ===== 背景光效动画 =====
    const bgLightTl = gsap.timeline({ repeat: -1, yoyo: true })
    bgLightTl.to('.bg-light-rays', {
      opacity: 0.4,
      rotation: 5,
      duration: 8,
      ease: 'sine.inOut',
    })
    cleanupFns.push({ revert: () => bgLightTl.kill() })

  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.negative-reveal-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0d0c0f 0%,
    #1a1520 20%,
    #0f0d12 40%,
    #1c1825 60%,
    #12101a 80%,
    #0d0c0f 100%
  );
}

// 背景层
.reveal-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 60% at 50% 30%, rgba(60, 50, 80, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 30% 70%, rgba(80, 60, 100, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse 50% 40% at 70% 50%, rgba(50, 70, 100, 0.08) 0%, transparent 40%);
}

.bg-light-rays {
  position: absolute;
  inset: -50%;
  background: 
    conic-gradient(from 0deg at 50% 50%, 
      transparent 0deg, 
      rgba(100, 80, 120, 0.03) 30deg, 
      transparent 60deg,
      rgba(80, 100, 120, 0.02) 90deg,
      transparent 120deg,
      rgba(100, 80, 100, 0.03) 150deg,
      transparent 180deg,
      rgba(80, 90, 120, 0.02) 210deg,
      transparent 240deg,
      rgba(90, 80, 110, 0.03) 270deg,
      transparent 300deg,
      rgba(100, 90, 100, 0.02) 330deg,
      transparent 360deg
    );
  opacity: 0.3;
  will-change: opacity, transform;
}

// 内容容器
.content-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70vw;
  max-width: 900px;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.7),
    0 60px 120px rgba(20, 15, 30, 0.5);
  will-change: transform, opacity;
}

// 外层颗粒幕布（银盐黑白）
.grain-curtain {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: 
    linear-gradient(180deg, 
      #1a1a1a 0%, 
      #2a2a2a 30%, 
      #222222 50%, 
      #2a2a2a 70%, 
      #1a1a1a 100%
    );
  will-change: clip-path, opacity;
}

.grain-texture {
  position: absolute;
  inset: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(255, 255, 255, 0.01) 1px,
      rgba(255, 255, 255, 0.01) 2px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 1px,
      rgba(255, 255, 255, 0.01) 1px,
      rgba(255, 255, 255, 0.01) 2px
    );
  animation: grainShift 0.5s steps(3) infinite;
}

@keyframes grainShift {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-1px, 1px); }
  66% { transform: translate(1px, -1px); }
  100% { transform: translate(0, 0); }
}

.grain-flow-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  mix-blend-mode: screen;
}

.flow-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(180, 180, 180, 0.3) 50%, transparent 70%);
  border-radius: 50%;
  filter: blur(0.5px);
}

// 内层灰阶雾膜
.fog-mask {
  position: absolute;
  inset: 0;
  z-index: 9;
  background: rgba(80, 75, 85, 0.7);
  will-change: opacity;
}

.fog-radial {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    rgba(100, 95, 105, 0.5) 0%,
    rgba(70, 65, 75, 0.7) 40%,
    rgba(50, 48, 55, 0.85) 70%,
    rgba(40, 38, 45, 0.95) 100%
  );
}

.fog-texture {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.3;
  mix-blend-mode: overlay;
}

// 图片容器
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #0a0a0c;
}

.reveal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(18px) brightness(0.35) contrast(0.9) hue-rotate(-3deg);
  will-change: filter, transform;
}

// 定影液水渍痕迹
.fixative-stain {
  position: absolute;
  inset: 0;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: 
    radial-gradient(ellipse 2% 3% at 15% 25%, rgba(255, 255, 255, 0.05) 0%, transparent 100%),
    radial-gradient(ellipse 3% 2% at 85% 15%, rgba(255, 255, 255, 0.04) 0%, transparent 100%),
    radial-gradient(ellipse 2% 4% at 90% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 100%),
    radial-gradient(ellipse 4% 2% at 10% 75%, rgba(255, 255, 255, 0.04) 0%, transparent 100%);
  pointer-events: none;
  will-change: opacity;
}

// 边缘光晕
.image-edge-glow {
  position: absolute;
  inset: -4px;
  border-radius: 10px;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(100, 90, 120, 0.15) 80%,
    rgba(80, 70, 100, 0.1) 90%,
    transparent 100%
  );
  pointer-events: none;
  opacity: 0;
  will-change: opacity, transform;
}

// 标题
.reveal-title {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  will-change: transform, opacity, filter;

  .title-cn {
    display: block;
    font-size: 32px;
    font-weight: 600;
    color: #e8e4f0;
    letter-spacing: 12px;
    text-shadow: 
      0 0 20px rgba(120, 100, 150, 0.5),
      0 0 40px rgba(100, 80, 130, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.5);
    margin-bottom: 10px;
  }

  .title-en {
    display: block;
    font-size: 11px;
    font-weight: 400;
    color: rgba(200, 195, 215, 0.5);
    letter-spacing: 8px;
    text-transform: uppercase;
  }
}

// SVG 滤镜容器
.grain-svg-filter {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}
</style>
