<template>
  <div ref="containerRef" class="static-container">
    <!-- 隐藏的原始图像 -->
    <div ref="imageLayerRef" class="static-image-layer">
      <img
        class="hidden-image"
        src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80"
        alt="Hidden"
      />
    </div>

    <!-- 远景细腻噪点 -->
    <div ref="fineNoiseRef" class="static-layer static-fine">
      <svg ref="fineSvgRef" class="noise-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="fineNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              ref="fineTurbulenceRef"
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              seed="5"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.3 0"
              in="noise"
            />
          </filter>
        </defs>
        <rect width="100" height="100" filter="url(#fineNoise)" />
      </svg>
    </div>

    <!-- 中景粒子 -->
    <div ref="midNoiseRef" class="static-layer static-mid">
      <svg ref="midSvgRef" class="noise-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="midNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              ref="midTurbulenceRef"
              type="turbulence"
              baseFrequency="0.05"
              numOctaves="3"
              seed="25"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.5 0"
              in="noise"
            />
          </filter>
        </defs>
        <rect width="100" height="100" filter="url(#midNoise)" />
      </svg>
    </div>

    <!-- 近景粗粒噪点 -->
    <div ref="coarseNoiseRef" class="static-layer static-coarse">
      <svg ref="coarseSvgRef" class="noise-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="coarseNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              ref="coarseTurbulenceRef"
              type="turbulence"
              baseFrequency="0.12"
              numOctaves="2"
              seed="88"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.7 0"
              in="noise"
            />
          </filter>
        </defs>
        <rect width="100" height="100" filter="url(#coarseNoise)" />
      </svg>
    </div>

    <!-- 信号扫描线 -->
    <div ref="scanlineRef" class="static-scanlines">
      <div class="scanline" v-for="i in 60" :key="i" :style="{ '--i': i }" />
    </div>

    <!-- 信号指示器 -->
    <div class="signal-indicator">
      <div class="signal-bar" v-for="i in 5" :key="i" :class="`bar-${i}`" />
      <span ref="signalTextRef" class="signal-text">SIGNAL LOST</span>
    </div>

    <!-- 噪点层 -->
    <div ref="noiseOverlayRef" class="static-noise-overlay" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

const containerRef = ref<HTMLElement | null>(null)
const imageLayerRef = ref<HTMLElement | null>(null)
const fineNoiseRef = ref<HTMLElement | null>(null)
const midNoiseRef = ref<HTMLElement | null>(null)
const coarseNoiseRef = ref<HTMLElement | null>(null)
const scanlineRef = ref<HTMLElement | null>(null)
const noiseOverlayRef = ref<HTMLElement | null>(null)
const signalTextRef = ref<HTMLElement | null>(null)
const fineTurbulenceRef = ref<SVGFEPrimitiveObject | null>(null)
const midTurbulenceRef = ref<SVGFEPrimitiveObject | null>(null)
const coarseTurbulenceRef = ref<SVGFEPrimitiveObject | null>(null)

const cleanupFns: TweenCleanup[] = []

let noiseSeed = 0
let noiseTimer: number | null = null
let isRevealing = false

function initScrollAnimation() {
  if (!containerRef.value) return

  const ctx = gsap.context(() => {
    // 细腻噪点 - 极慢
    if (fineNoiseRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 2.5
        }
      })
      tl.to(fineNoiseRef.value, { y: '6%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 中景粒子 - 中速
    if (midNoiseRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.5
        }
      })
      tl.to(midNoiseRef.value, { y: '25%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 粗粒噪点 - 最快
    if (coarseNoiseRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 0.8
        }
      })
      tl.to(coarseNoiseRef.value, { y: '60%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 噪点持续刷新
    initNoiseRefresh()

    // 入场动画
    gsap.fromTo(containerRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' }
    )

    // 信号强度动画
    animateSignal()

  }, containerRef.value)

  cleanupFns.push({ kill: () => ctx.revert() })
}

function initNoiseRefresh() {
  const refreshNoise = () => {
    noiseSeed += 1

    if (fineTurbulenceRef.value) {
      fineTurbulenceRef.value.setAttribute('seed', String((noiseSeed * 7) % 100))
    }
    if (midTurbulenceRef.value) {
      midTurbulenceRef.value.setAttribute('seed', String((noiseSeed * 13) % 100))
    }
    if (coarseTurbulenceRef.value) {
      coarseTurbulenceRef.value.setAttribute('seed', String((noiseSeed * 19) % 100))
    }

    noiseTimer = window.setTimeout(refreshNoise, 80)
  }

  refreshNoise()
}

function animateSignal() {
  if (!signalTextRef.value) return

  gsap.to(signalTextRef.value, {
    opacity: () => Math.random() * 0.5 + 0.3,
    duration: 0.1,
    repeat: -1,
    yoyo: true,
    onUpdate: function() {
      if (Math.random() > 0.95 && signalTextRef.value) {
        signalTextRef.value.textContent = Math.random() > 0.5 ? 'SIGNAL LOST' : 'SEARCHING...'
      }
    }
  })
}

function handleMouseMove(e: MouseEvent) {
  const x = e.clientX
  const y = e.clientY

  // 图像层跟随鼠标显示
  if (imageLayerRef.value) {
    const strength = 0.7 + Math.random() * 0.2
    gsap.to(imageLayerRef.value, {
      opacity: strength,
      x: (x - window.innerWidth / 2) * 0.02,
      y: (y - window.innerHeight / 2) * 0.02,
      duration: 0.3
    })
  }

  // 噪点层在鼠标附近减弱
  if (fineNoiseRef.value) {
    gsap.to(fineNoiseRef.value, {
      opacity: 0.3,
      duration: 0.4
    })
  }

  if (midNoiseRef.value) {
    gsap.to(midNoiseRef.value, {
      opacity: 0.4,
      duration: 0.35
    })
  }

  if (coarseNoiseRef.value) {
    gsap.to(coarseNoiseRef.value, {
      opacity: 0.5,
      duration: 0.3
    })
  }

  // 信号强度增强
  if (signalTextRef.value) {
    signalTextRef.value.textContent = 'SIGNAL FOUND'
    signalTextRef.value.style.color = 'rgba(100, 255, 150, 0.9)'
  }

  isRevealing = true
}

function handleMouseLeave() {
  // 图像层消失
  if (imageLayerRef.value) {
    gsap.to(imageLayerRef.value, {
      opacity: 0,
      x: 0,
      y: 0,
      duration: 2,
      ease: 'power2.out'
    })
  }

  // 噪点层恢复
  if (fineNoiseRef.value) {
    gsap.to(fineNoiseRef.value, {
      opacity: 1,
      duration: 2,
      ease: 'power2.out'
    })
  }

  if (midNoiseRef.value) {
    gsap.to(midNoiseRef.value, {
      opacity: 1,
      duration: 1.8,
      ease: 'power2.out'
    })
  }

  if (coarseNoiseRef.value) {
    gsap.to(coarseNoiseRef.value, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    })
  }

  // 信号恢复
  if (signalTextRef.value) {
    setTimeout(() => {
      if (signalTextRef.value && !isRevealing) {
        signalTextRef.value.textContent = 'SIGNAL LOST'
        signalTextRef.value.style.color = 'rgba(255, 80, 80, 0.8)'
      }
    }, 2000)
  }

  isRevealing = false
}

onMounted(() => {
  initScrollAnimation()

  if (containerRef.value) {
    containerRef.value.addEventListener('mousemove', handleMouseMove)
    containerRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())

  if (noiseTimer) {
    clearTimeout(noiseTimer)
  }

  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', handleMouseMove)
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }

  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.static-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
  cursor: crosshair;
}

// 隐藏的原始图像
.static-image-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  pointer-events: none;

  .hidden-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(1.2) saturate(1.3) contrast(1.1);
  }
}

// 噪点层基础
.static-layer {
  position: absolute;
  inset: -20%;
  pointer-events: none;

  .noise-svg {
    width: 100%;
    height: 100%;
  }
}

// 细腻噪点
.static-fine {
  z-index: 2;
  opacity: 1;
  mix-blend-mode: screen;
}

// 中景粒子
.static-mid {
  z-index: 3;
  opacity: 1;
  mix-blend-mode: overlay;
}

// 粗粒噪点
.static-coarse {
  z-index: 4;
  opacity: 1;
  mix-blend-mode: lighten;
}

// 扫描线
.static-scanlines {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.scanline {
  flex: 1;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);

  &:nth-child(odd) {
    background: rgba(255, 255, 255, 0.02);
  }
}

// 信号指示器
.signal-indicator {
  position: absolute;
  bottom: 40px;
  right: 50px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 80, 80, 0.3);
  border-radius: 6px;
  backdrop-filter: blur(8px);
}

.signal-bar {
  width: 4px;
  height: 16px;
  background: rgba(255, 80, 80, 0.9);
  border-radius: 2px;

  &.bar-1 { height: 8px; animation: barBlink 0.8s ease-in-out infinite; }
  &.bar-2 { height: 12px; animation: barBlink 0.6s ease-in-out infinite 0.1s; }
  &.bar-3 { height: 16px; animation: barBlink 0.7s ease-in-out infinite 0.2s; }
  &.bar-4 { height: 20px; animation: barBlink 0.5s ease-in-out infinite 0.15s; }
  &.bar-5 { height: 24px; animation: barBlink 0.9s ease-in-out infinite 0.25s; }
}

@keyframes barBlink {
  0%, 100% { opacity: 0.3; background: rgba(255, 80, 80, 0.9); }
  50% { opacity: 1; background: rgba(100, 255, 150, 0.9); }
}

.signal-text {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: rgba(255, 80, 80, 0.9);
  letter-spacing: 2px;
  margin-left: 8px;
  animation: textFlicker 0.1s steps(2) infinite;
}

@keyframes textFlicker {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.9; }
}

// 噪点覆盖层
.static-noise-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  opacity: 0.15;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
  animation: overlayNoise 0.08s steps(2) infinite;
}

@keyframes overlayNoise {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(1px, -2px); }
  75% { transform: translate(-1px, -1px); }
  100% { transform: translate(0, 0); }
}
</style>
