<template>
  <div ref="containerRef" class="fog-container">
    <!-- 远景山峦 -->
    <div ref="mountainRef" class="fog-mountain">
      <img
        class="mountain-img"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        alt="Mountain"
      />
    </div>

    <!-- 中景薄雾 -->
    <div ref="midFogRef" class="fog-layer fog-mid">
      <svg ref="midFogSvgRef" class="fog-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="fogFilterMid" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              ref="midTurbulenceRef"
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="4"
              seed="15"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 18 -7"
              in="noise"
              result="fog"
            />
          </filter>
        </defs>
        <rect width="100" height="100" filter="url(#fogFilterMid)" fill="rgba(200, 220, 240, 0.6)" />
      </svg>
    </div>

    <!-- 近景浓雾 -->
    <div ref="nearFogRef" class="fog-layer fog-near">
      <svg ref="nearFogSvgRef" class="fog-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="fogFilterNear" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              ref="nearTurbulenceRef"
              type="fractalNoise"
              baseFrequency="0.025"
              numOctaves="5"
              seed="42"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 15 -6"
              in="noise"
              result="fog"
            />
          </filter>
        </defs>
        <rect width="100" height="100" filter="url(#fogFilterNear)" fill="rgba(220, 230, 245, 0.7)" />
      </svg>
    </div>

    <!-- 极近浓雾团 -->
    <div ref="denseFogRef" class="fog-layer fog-dense">
      <svg ref="denseFogSvgRef" class="fog-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="fogFilterDense" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              ref="denseTurbulenceRef"
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              seed="88"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 12 -5"
              in="noise"
              result="fog"
            />
          </filter>
        </defs>
        <rect width="100" height="100" filter="url(#fogFilterDense)" fill="rgba(235, 240, 250, 0.8)" />
      </svg>
    </div>

    <!-- 噪点层 -->
    <div ref="noiseRef" class="fog-noise" />

    <!-- 时间进度条 -->
    <div class="fog-progress">
      <div class="progress-label">晨 → 暮</div>
      <div class="progress-bar">
        <div ref="progressFillRef" class="progress-fill" />
      </div>
    </div>

    <!-- SVG 滤镜定义 -->
    <svg class="fog-svg-defs">
      <defs>
        <filter id="fogGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
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
const mountainRef = ref<HTMLElement | null>(null)
const midFogRef = ref<HTMLElement | null>(null)
const nearFogRef = ref<HTMLElement | null>(null)
const denseFogRef = ref<HTMLElement | null>(null)
const noiseRef = ref<HTMLElement | null>(null)
const progressFillRef = ref<HTMLElement | null>(null)
const midTurbulenceRef = ref<SVGFEPrimitiveObject | null>(null)
const nearTurbulenceRef = ref<SVGFEPrimitiveObject | null>(null)
const denseTurbulenceRef = ref<SVGFEPrimitiveObject | null>(null)

const cleanupFns: TweenCleanup[] = []

let fogWaveTimer: number | null = null

function initScrollAnimation() {
  if (!containerRef.value) return

  const ctx = gsap.context(() => {
    // 远景山峦 - 极慢下移
    if (mountainRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.5
        }
      })
      tl.to(mountainRef.value, { y: '20%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 中景薄雾 - 中速上浮
    if (midFogRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.5
        }
      })
      tl.to(midFogRef.value, { y: '-15%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 近景浓雾 - 较快横向漂移
    if (nearFogRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.5
        }
      })
      tl.to(nearFogRef.value, { x: '-8%', y: '-10%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 极近浓雾 - 快速漂移
    if (denseFogRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.5
        }
      })
      tl.to(denseFogRef.value, { x: '5%', y: '-18%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 进度条更新
    if (progressFillRef.value) {
      ScrollTrigger.create({
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'bottom 0%',
        scrub: 1,
        onUpdate: (self) => {
          if (progressFillRef.value) {
            progressFillRef.value.style.width = `${self.progress * 100}%`
          }
        }
      })
    }

    // 雾气持续蠕动
    initFogWave()

    // 入场动画
    gsap.fromTo(containerRef.value, 
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.out' }
    )

  }, containerRef.value)

  cleanupFns.push({ kill: () => ctx.revert() })
}

function initFogWave() {
  let seed = 0
  const waveFogLayers = () => {
    if (!containerRef.value) return

    seed += 0.3

    const midFreq = 0.015 + Math.sin(seed * 0.5) * 0.003
    const nearFreq = 0.025 + Math.sin(seed * 0.7 + 1) * 0.005
    const denseFreq = 0.04 + Math.sin(seed * 0.9 + 2) * 0.008

    const midSvg = midFogRef.value?.querySelector('feTurbulence')
    const nearSvg = nearFogRef.value?.querySelector('feTurbulence')
    const denseSvg = denseFogRef.value?.querySelector('feTurbulence')

    if (midSvg) midSvg.setAttribute('baseFrequency', midFreq.toString())
    if (nearSvg) nearSvg.setAttribute('baseFrequency', nearFreq.toString())
    if (denseSvg) denseSvg.setAttribute('baseFrequency', denseFreq.toString())

    fogWaveTimer = window.setTimeout(waveFogLayers, 100)
  }

  waveFogLayers()
}

function handleMouseMove(e: MouseEvent) {
  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  // 鼠标推动雾气
  if (nearFogRef.value) {
    gsap.to(nearFogRef.value, {
      x: (x - 0.5) * 30,
      y: (y - 0.5) * 20,
      duration: 1.5,
      ease: 'power2.out'
    })
  }

  if (denseFogRef.value) {
    gsap.to(denseFogRef.value, {
      x: (x - 0.5) * -25,
      y: (y - 0.5) * -15,
      duration: 1.8,
      ease: 'power2.out'
    })
  }
}

function handleMouseLeave() {
  // 雾气回流
  if (nearFogRef.value) {
    gsap.to(nearFogRef.value, {
      x: 0,
      y: '-10%',
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (denseFogRef.value) {
    gsap.to(denseFogRef.value, {
      x: '5%',
      y: '-18%',
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })
  }
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

  if (fogWaveTimer) {
    clearTimeout(fogWaveTimer)
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
.fog-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #e8f0f8 0%,
    #d4e4f0 30%,
    #c5d8e8 60%,
    #b8ccdc 100%
  );
  cursor: crosshair;
}

// 远景山峦
.fog-mountain {
  position: absolute;
  inset: 0;
  z-index: 1;

  .mountain-img {
    width: 100%;
    height: 120%;
    object-fit: cover;
    filter: brightness(0.7) saturate(0.8);
  }
}

// 雾气层基础样式
.fog-layer {
  position: absolute;
  inset: -20%;
  pointer-events: none;

  .fog-svg {
    width: 100%;
    height: 100%;
  }
}

// 中景薄雾
.fog-mid {
  z-index: 2;
  mix-blend-mode: soft-light;
  opacity: 0.8;
}

// 近景浓雾
.fog-near {
  z-index: 3;
  mix-blend-mode: screen;
  opacity: 0.6;
}

// 极近浓雾团
.fog-dense {
  z-index: 4;
  mix-blend-mode: overlay;
  opacity: 0.5;
}

// 噪点层
.fog-noise {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  animation: noiseMove 0.5s steps(3) infinite;
}

@keyframes noiseMove {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-2%, -2%); }
  66% { transform: translate(2%, 1%); }
  100% { transform: translate(-1%, 2%); }
}

// 时间进度条
.fog-progress {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.progress-label {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: rgba(60, 80, 100, 0.7);
  letter-spacing: 4px;
  text-transform: uppercase;
}

.progress-bar {
  width: 200px;
  height: 2px;
  background: rgba(100, 130, 160, 0.2);
  border-radius: 1px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #6a8caf, #8fa5b8, #c4a882);
  border-radius: 1px;
}

// SVG 滤镜定义隐藏
.fog-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
