<template>
  <div ref="parentRef" class="carbon-blade-container">
    <!-- 深邃背景 -->
    <div ref="bgRef" class="blade-bg">
      <div class="bg-gradient"></div>
      <div class="bg-matrix-lines"></div>
    </div>

    <!-- 主内容区 -->
    <div ref="contentWrapperRef" class="content-wrapper">
      <!-- 外层碳黑闸门 -->
      <div ref="carbonGateRef" class="carbon-gate">
        <div class="gate-surface">
          <div class="brushed-metal"></div>
          <div class="milling-lines"></div>
          <div class="gate-edge-glow"></div>
        </div>
      </div>

      <!-- 内层云母光膜 -->
      <div ref="micaFilmRef" class="mica-film">
        <div class="mica-pearl-shimmer"></div>
        <div class="mica-iris-opening"></div>
      </div>

      <!-- 图片容器 -->
      <div ref="imageContainerRef" class="image-container">
        <img
          ref="imageRef"
          :src="imageUrl"
          alt="Carbon Blade"
          class="blade-image"
        />
        <!-- 云母碎片光晕 -->
        <div ref="micaFragmentsRef" class="mica-fragments">
          <div v-for="i in 12" :key="i" class="fragment" :class="`fragment-${i}`"></div>
        </div>
        <!-- 四角暗角 -->
        <div ref="vignetteRef" class="cinema-vignette"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="blade-title">
      <span class="title-cn">碳素刀锋</span>
      <span class="title-en">CARBON BLADE</span>
    </div>

    <!-- 微光缝隙 -->
    <div ref="lightSeamRef" class="light-seam"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const imageUrl = 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80'

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const contentWrapperRef = ref<HTMLElement | null>(null)
const carbonGateRef = ref<HTMLElement | null>(null)
const micaFilmRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const micaFragmentsRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const lightSeamRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !contentWrapperRef.value || !imageRef.value) return

  const ctx = gsap.context(() => {
    // ===== 初始状态设置 =====

    // 内容容器初始状态
    gsap.set(contentWrapperRef.value, {
      opacity: 0,
      scale: 0.95,
      y: 25,
    })

    // 图片初始状态 - 极重度模糊
    gsap.set(imageRef.value, {
      filter: 'blur(20px) brightness(0.3) contrast(0.85) hue-rotate(-2deg)',
      scale: 1.05,
    })

    // 外层碳黑闸门初始状态 - 完全覆盖
    gsap.set(carbonGateRef.value, {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
    })

    // 内层云母光膜初始状态
    gsap.set(micaFilmRef.value, {
      opacity: 1,
    })

    // 云母光膜虹彩初始状态
    gsap.set(micaFilmRef.value?.querySelector('.mica-pearl-shimmer'), {
      opacity: 0.1,
    })

    // 微光缝隙初始状态
    gsap.set(lightSeamRef.value, {
      opacity: 0.3,
    })

    // 云母碎片初始状态
    gsap.set(micaFragmentsRef.value, {
      opacity: 0.2,
    })

    // 四角暗角初始状态
    gsap.set(vignetteRef.value, {
      opacity: 0,
    })

    // 标题初始状态
    gsap.set(titleRef.value, {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
    })

    // ===== ScrollTrigger 主 Timeline =====
    const bladeTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5,
      },
    })

    // 1. 内容容器入场
    bladeTl.to(contentWrapperRef.value, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, 0)

    // 2. 标题显现
    bladeTl.to(titleRef.value, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.5,
      ease: 'power2.out',
    }, 0.15)

    // 3. 微光缝隙消失（暗示即将开启）
    bladeTl.to(lightSeamRef.value, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 0.5)

    // 4. 外层碳黑闸门滑落 - 三段式阻尼
    // 前20%: 克服静摩擦，缓慢启程
    bladeTl.to(carbonGateRef.value, {
      clipPath: 'inset(20% 0% 0% 0%)',
      duration: 0.3,
      ease: 'power2.out',
    }, 0.6)

    // 中段: 稳健滑行
    bladeTl.to(carbonGateRef.value, {
      clipPath: 'inset(60% 0% 0% 0%)',
      duration: 0.6,
      ease: 'none',
    }, 0.9)

    // 末段: 加速吸入
    bladeTl.to(carbonGateRef.value, {
      clipPath: 'inset(100% 0% 0% 0%)',
      duration: 0.3,
      ease: 'power4.in',
    }, 1.5)

    // 5. 内层云母光膜开始溶解（闸门滑至80%时启动）
    bladeTl.to(micaFilmRef.value, {
      opacity: 0.5,
      duration: 0.4,
      ease: 'power2.out',
    }, 1.8)

    // 6. 图片同步 - blur 衰减
    bladeTl.to(imageRef.value, {
      filter: 'blur(14px) brightness(0.45) contrast(0.9) hue-rotate(-1.5deg)',
      duration: 0.6,
      ease: 'power2.out',
    }, 1.8)

    // 7. 云母虹彩增强（70%时短暂闪烁）
    bladeTl.to(micaFilmRef.value?.querySelector('.mica-pearl-shimmer'), {
      opacity: 0.35,
      duration: 0.2,
      ease: 'power2.out',
    }, 2.2)

    // 8. 云母虹彩色散偏移
    bladeTl.to(micaFilmRef.value?.querySelector('.mica-iris-opening'), {
      opacity: 0.2,
      duration: 0.15,
      ease: 'power2.out',
    }, 2.35)

    bladeTl.to(micaFilmRef.value?.querySelector('.mica-iris-opening'), {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
    }, 2.5)

    // 9. 云母光膜加速溶解
    bladeTl.to(micaFilmRef.value, {
      opacity: 0,
      duration: 0.6,
      ease: 'power3.in',
    }, 2.4)

    // 10. 图片同步 - scale 微缩
    bladeTl.to(imageRef.value, {
      scale: 1.02,
      duration: 0.6,
      ease: 'power2.out',
    }, 2.2)

    // 11. 图片继续清晰化
    bladeTl.to(imageRef.value, {
      filter: 'blur(8px) brightness(0.6) contrast(0.95) hue-rotate(-1deg)',
      duration: 0.5,
      ease: 'power2.out',
    }, 2.6)

    bladeTl.to(imageRef.value, {
      filter: 'blur(4px) brightness(0.75) contrast(1.0) hue-rotate(-0.5deg)',
      duration: 0.4,
      ease: 'power2.out',
    }, 3.0)

    // 12. 图片最终锐利呈现
    bladeTl.to(imageRef.value, {
      filter: 'blur(0px) brightness(1) contrast(1.05) hue-rotate(0deg)',
      scale: 1.0,
      duration: 0.6,
      ease: 'power3.out',
    }, 3.4)

    // 13. 云母碎片光晕消散
    bladeTl.to(micaFragmentsRef.value, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 3.5)

    // 14. 四角暗角显现
    bladeTl.to(vignetteRef.value, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, 3.6)

    cleanupFns.push({
      revert: () => bladeTl.kill(),
    })

    // ===== 独立呼吸动画 =====

    // 四角暗角极低频呼吸
    const vignetteTl = gsap.timeline({ repeat: -1, yoyo: true })
    vignetteTl.to(vignetteRef.value, {
      opacity: 0.7,
      duration: 8,
      ease: 'sine.inOut',
    })
    cleanupFns.push({ revert: () => vignetteTl.kill() })

    // 碳闸门表面微光
    const gateGlowTl = gsap.timeline({ repeat: -1, yoyo: true })
    gateGlowTl.to(carbonGateRef.value?.querySelector('.gate-edge-glow'), {
      opacity: 0.15,
      duration: 4,
      ease: 'sine.inOut',
    })
    cleanupFns.push({ revert: () => gateGlowTl.kill() })

    // 云母碎片闪烁
    const fragments = micaFragmentsRef.value?.querySelectorAll('.fragment')
    fragments?.forEach((frag, index) => {
      gsap.to(frag, {
        opacity: 0.05 + Math.random() * 0.15,
        scale: 0.8 + Math.random() * 0.4,
        duration: 1.5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.1,
      })
    })

  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert?.())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.carbon-blade-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0a0a0c 0%,
    #121318 25%,
    #0d0f14 50%,
    #141620 75%,
    #0a0a0c 100%
  );
}

// 背景层
.blade-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 50% 40%, rgba(30, 32, 40, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 40% 35% at 30% 60%, rgba(25, 28, 35, 0.2) 0%, transparent 40%),
    radial-gradient(ellipse 45% 40% at 70% 55%, rgba(30, 30, 38, 0.15) 0%, transparent 45%);
}

.bg-matrix-lines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(255, 255, 255, 0.008) 3px,
    rgba(255, 255, 255, 0.008) 4px
  );
  opacity: 0.5;
}

// 内容容器
.content-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65vw;
  max-width: 880px;
  aspect-ratio: 16 / 10;
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 40px 100px rgba(0, 0, 0, 0.8),
    0 80px 150px rgba(15, 15, 20, 0.6);
  will-change: transform, opacity;
}

// 外层碳黑闸门
.carbon-gate {
  position: absolute;
  inset: 0;
  z-index: 15;
  background: linear-gradient(
    180deg,
    #0d0d0f 0%,
    #1a1a1e 15%,
    #222228 30%,
    #1e1e24 50%,
    #18181c 70%,
    #141416 85%,
    #0c0c0e 100%
  );
  will-change: clip-path, opacity;
}

.gate-surface {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

// 拉丝金属纹理
.brushed-metal {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent 0px,
    rgba(60, 60, 65, 0.03) 1px,
    transparent 2px,
    rgba(255, 255, 255, 0.02) 3px,
    transparent 4px
  );
  background-size: 4px 100%;
}

// 铣削光泽线条
.milling-lines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 8px,
    rgba(80, 80, 85, 0.04) 8px,
    rgba(80, 80, 85, 0.04) 9px,
    transparent 9px,
    transparent 20px
  );
  opacity: 0.6;
}

.gate-edge-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(100, 100, 110, 0.15) 20%,
    rgba(120, 120, 130, 0.2) 50%,
    rgba(100, 100, 110, 0.15) 80%,
    transparent 100%
  );
  opacity: 0.1;
  will-change: opacity;
}

// 内层云母光膜
.mica-film {
  position: absolute;
  inset: 0;
  z-index: 12;
  background: linear-gradient(
    180deg,
    rgba(200, 200, 210, 0.12) 0%,
    rgba(180, 180, 195, 0.15) 30%,
    rgba(160, 160, 180, 0.1) 50%,
    rgba(180, 180, 195, 0.12) 70%,
    rgba(200, 200, 210, 0.08) 100%
  );
  will-change: opacity;
}

.mica-pearl-shimmer {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 30%,
      rgba(200, 210, 220, 0.05) 50%,
      transparent 70%,
      rgba(220, 215, 225, 0.06) 100%
    );
  opacity: 0.1;
  will-change: opacity;
}

// 虹彩色散效果
.mica-iris-opening {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      45deg,
      rgba(255, 100, 100, 0.03) 0%,
      transparent 30%,
      rgba(100, 200, 255, 0.03) 70%,
      transparent 100%
    );
  opacity: 0;
  will-change: opacity;
  mix-blend-mode: screen;
}

// 图片容器
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #08080a;
}

.blade-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(20px) brightness(0.3) contrast(0.85) hue-rotate(-2deg);
  will-change: filter, transform;
}

// 云母碎片光晕
.mica-fragments {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.fragment {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(220, 220, 235, 0.4) 0%,
    rgba(200, 200, 215, 0.15) 40%,
    transparent 70%
  );

  &.fragment-1 { width: 4px; height: 4px; top: 8%; left: 12%; }
  &.fragment-2 { width: 3px; height: 3px; top: 15%; right: 18%; }
  &.fragment-3 { width: 5px; height: 5px; top: 25%; left: 5%; }
  &.fragment-4 { width: 3px; height: 3px; top: 35%; right: 8%; }
  &.fragment-5 { width: 4px; height: 4px; bottom: 40%; left: 10%; }
  &.fragment-6 { width: 3px; height: 3px; bottom: 30%; right: 15%; }
  &.fragment-7 { width: 5px; height: 5px; bottom: 20%; left: 20%; }
  &.fragment-8 { width: 3px; height: 3px; bottom: 25%; right: 25%; }
  &.fragment-9 { width: 4px; height: 4px; bottom: 15%; left: 8%; }
  &.fragment-10 { width: 3px; height: 3px; top: 45%; right: 5%; }
  &.fragment-11 { width: 4px; height: 4px; top: 60%; left: 15%; }
  &.fragment-12 { width: 3px; height: 3px; bottom: 10%; right: 12%; }
}

// 四角暗角
.cinema-vignette {
  position: absolute;
  inset: -20px;
  border-radius: 8px;
  background: radial-gradient(
    ellipse at center,
    transparent 35%,
    rgba(5, 5, 8, 0.3) 55%,
    rgba(3, 3, 5, 0.5) 70%,
    rgba(0, 0, 0, 0.75) 85%,
    rgba(0, 0, 0, 0.9) 100%
  );
  pointer-events: none;
  opacity: 0;
  will-change: opacity;
}

// 标题
.blade-title {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  will-change: transform, opacity, filter;

  .title-cn {
    display: block;
    font-size: 34px;
    font-weight: 700;
    color: #d8d8e0;
    letter-spacing: 14px;
    text-shadow:
      0 0 25px rgba(100, 100, 110, 0.4),
      0 0 50px rgba(80, 80, 90, 0.25),
      0 2px 4px rgba(0, 0, 0, 0.6);
    margin-bottom: 10px;
  }

  .title-en {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: rgba(180, 180, 190, 0.45);
    letter-spacing: 8px;
    text-transform: uppercase;
  }
}

// 微光缝隙
.light-seam {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 65vw;
  max-width: 880px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(200, 200, 210, 0.08) 20%,
    rgba(220, 220, 230, 0.12) 50%,
    rgba(200, 200, 210, 0.08) 80%,
    transparent 100%
  );
  pointer-events: none;
  opacity: 0.3;
  will-change: opacity;
  z-index: 25;
}
</style>
