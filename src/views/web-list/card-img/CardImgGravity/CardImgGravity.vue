<template>
  <div ref="containerRef" class="gravity-container">
    <!-- 深空星野背景 -->
    <div ref="bgLayerRef" class="gravity-bg">
      <img
        class="bg-image"
        src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80"
        alt="Galaxy"
      />
      <div class="bg-overlay" />
    </div>

    <!-- 极光层 -->
    <div ref="auroraLayerRef" class="gravity-aurora">
      <img
        class="aurora-image"
        src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80"
        alt="Aurora"
      />
    </div>

    <!-- 引力透镜扭曲层 -->
    <div ref="warpLayerRef" class="gravity-warp">
      <svg ref="warpSvgRef" class="warp-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="gravityLens" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              ref="turbulenceRef"
              type="turbulence"
              baseFrequency="0.012 0.02"
              numOctaves="3"
              seed="12"
              result="turbulence"
            />
            <feDisplacementMap
              ref="displacementRef"
              in="SourceGraphic"
              in2="turbulence"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <g filter="url(#gravityLens)">
          <foreignObject x="0" y="0" width="100" height="100">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              class="warp-content"
              :style="{ backgroundImage: `url(https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80)` }"
            />
          </foreignObject>
        </g>
      </svg>
    </div>

    <!-- 爱因斯坦环层 -->
    <div ref="ringsRef" class="gravity-rings">
      <div ref="ring1Ref" class="ring ring-1">
        <div class="ring-image-wrapper">
          <img
            class="ring-image"
            src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80"
            alt="Nebula Ring"
          />
        </div>
      </div>
      <div ref="ring2Ref" class="ring ring-2">
        <div class="ring-image-wrapper">
          <img
            class="ring-image"
            src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80"
            alt="Stars Ring"
          />
        </div>
      </div>
      <div ref="ring3Ref" class="ring ring-3">
        <div class="ring-image-wrapper">
          <img
            class="ring-image"
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&q=80"
            alt="Space Ring"
          />
        </div>
      </div>
    </div>

    <!-- 引力源核心 -->
    <div ref="coreRef" class="gravity-core">
      <div class="core-glow" />
      <div class="core-ring-outer" />
      <div class="core-ring-inner" />
      <div class="core-center" />
    </div>

    <!-- 星芒效果 -->
    <div class="gravity-flares">
      <div class="flare flare-1" />
      <div class="flare flare-2" />
      <div class="flare flare-3" />
    </div>

    <!-- 空间噪点 -->
    <div ref="noiseRef" class="gravity-noise" />

    <!-- 曲率数据 -->
    <div class="gravity-data">
      <div class="data-item">
        <span class="data-label">时空曲率</span>
        <span ref="curvatureRef" class="data-value">0.00</span>
      </div>
      <div class="data-item">
        <span class="data-label">引力红移</span>
        <span ref="redshiftRef" class="data-value">z=0.00</span>
      </div>
    </div>
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
const bgLayerRef = ref<HTMLElement | null>(null)
const auroraLayerRef = ref<HTMLElement | null>(null)
const warpLayerRef = ref<HTMLElement | null>(null)
const ringsRef = ref<HTMLElement | null>(null)
const ring1Ref = ref<HTMLElement | null>(null)
const ring2Ref = ref<HTMLElement | null>(null)
const ring3Ref = ref<HTMLElement | null>(null)
const coreRef = ref<HTMLElement | null>(null)
const noiseRef = ref<HTMLElement | null>(null)
const curvatureRef = ref<HTMLElement | null>(null)
const redshiftRef = ref<HTMLElement | null>(null)
const turbulenceRef = ref<SVGFEPrimitiveObject | null>(null)
const displacementRef = ref<SVGFEDisplacementMapElement | null>(null)

const cleanupFns: TweenCleanup[] = []

let currentCurvature = 0

function initScrollAnimation() {
  if (!containerRef.value) return

  const ctx = gsap.context(() => {
    // 背景层极慢下沉
    if (bgLayerRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 2
        }
      })
      tl.to(bgLayerRef.value, { y: '20%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 极光层上浮
    if (auroraLayerRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.5
        }
      })
      tl.to(auroraLayerRef.value, { y: '-25%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 内环 - 快速旋转
    if (ring1Ref.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1
        }
      })
      tl.to(ring1Ref.value, {
        rotation: 360,
        scale: 0.88,
        duration: 1
      }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 中环 - 逆时针
    if (ring2Ref.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.2
        }
      })
      tl.to(ring2Ref.value, {
        rotation: -180,
        scale: 1.06,
        duration: 1
      }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 外环 - 慢速
    if (ring3Ref.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.5
        }
      })
      tl.to(ring3Ref.value, {
        rotation: 90,
        scale: 0.94,
        duration: 1
      }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 扭曲强度同步
    ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 0%',
      scrub: 1,
      onUpdate: (self) => {
        updateLensEffect(self.progress)
      }
    })

    // 引力核心脉冲
    if (coreRef.value) {
      gsap.to(coreRef.value.querySelector('.core-glow'), {
        scale: 1.6,
        opacity: 0.4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      gsap.to(coreRef.value.querySelector('.core-ring-outer'), {
        rotation: 360,
        duration: 6,
        repeat: -1,
        ease: 'linear'
      })

      gsap.to(coreRef.value.querySelector('.core-ring-inner'), {
        rotation: -360,
        duration: 4,
        repeat: -1,
        ease: 'linear'
      })
    }

    // 入场动画
    gsap.fromTo(containerRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' }
    )

    gsap.fromTo([ring1Ref.value, ring2Ref.value, ring3Ref.value],
      { scale: 0, opacity: 0, rotation: -180 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      }
    )

  }, containerRef.value)

  cleanupFns.push({ kill: () => ctx.revert() })
}

function updateLensEffect(progress: number) {
  const distortionScale = progress * 18

  if (displacementRef.value) {
    displacementRef.value.setAttribute('scale', distortionScale.toString())
  }

  const baseFreq = 0.012 + progress * 0.025
  if (turbulenceRef.value) {
    turbulenceRef.value.setAttribute('baseFrequency', `${baseFreq} ${baseFreq * 1.6}`)
  }

  currentCurvature = progress * 3.8
  if (curvatureRef.value) {
    curvatureRef.value.textContent = currentCurvature.toFixed(2)
  }

  const redshift = progress * 2.5
  if (redshiftRef.value) {
    redshiftRef.value.textContent = `z=${redshift.toFixed(2)}`
  }

  if (coreRef.value) {
    gsap.to(coreRef.value, {
      scale: 1 + progress * 0.7,
      duration: 0.3
    })
  }
}

function handleMouseMove(e: MouseEvent) {
  const x = (e.clientX / window.innerWidth - 0.5) * 100
  const y = (e.clientY / window.innerHeight - 0.5) * 100

  if (coreRef.value) {
    gsap.to(coreRef.value, {
      x: x * 2.2,
      y: y * 2.2,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  if (warpLayerRef.value) {
    gsap.to(warpLayerRef.value, {
      x: x * 0.6,
      y: y * 0.6,
      duration: 0.7,
      ease: 'power2.out'
    })
  }

  if (ring1Ref.value) {
    gsap.to(ring1Ref.value, {
      x: x * -0.4,
      y: y * -0.4,
      duration: 0.9
    })
  }

  if (ring2Ref.value) {
    gsap.to(ring2Ref.value, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 1.1
    })
  }
}

function handleMouseLeave() {
  if (coreRef.value) {
    gsap.to(coreRef.value, {
      x: 0,
      y: 0,
      duration: 1.8,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (warpLayerRef.value) {
    gsap.to(warpLayerRef.value, {
      x: 0,
      y: 0,
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (ring1Ref.value) {
    gsap.to(ring1Ref.value, {
      x: 0,
      y: 0,
      duration: 2
    })
  }

  if (ring2Ref.value) {
    gsap.to(ring2Ref.value, {
      x: 0,
      y: 0,
      duration: 2
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
.gravity-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #000005 0%, #0a0015 50%, #000008 100%);
  cursor: crosshair;
}

// 深空星野背景
.gravity-bg {
  position: absolute;
  inset: -20%;
  z-index: 1;

  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.7) saturate(1.1);
  }

  .bg-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 50% 40%,
      transparent 0%,
      rgba(5, 0, 15, 0.5) 50%,
      rgba(0, 0, 5, 0.9) 100%
    );
  }
}

// 极光层
.gravity-aurora {
  position: absolute;
  inset: -30%;
  z-index: 2;

  .aurora-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.5) saturate(1.3) hue-rotate(-30deg);
    mix-blend-mode: screen;
    opacity: 0.7;
  }
}

// 引力透镜扭曲层
.gravity-warp {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;

  .warp-svg {
    width: 100%;
    height: 100%;
  }

  .warp-content {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    filter: brightness(0.25) saturate(0.4) hue-rotate(180deg);
  }
}

// 爱因斯坦环层
.gravity-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: none;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow:
    0 0 40px rgba(100, 200, 255, 0.3),
    0 0 80px rgba(100, 150, 255, 0.15),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.ring-image-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;

  .ring-image {
    width: 200%;
    height: 200%;
    margin-left: -50%;
    margin-top: -50%;
    object-fit: cover;
    filter: brightness(0.75) saturate(1.2);
  }
}

.ring-1 {
  width: 260px;
  height: 260px;
  margin-left: -130px;
  margin-top: -130px;

  .ring-image {
    animation: ringRotate1 18s linear infinite;
  }
}

.ring-2 {
  width: 420px;
  height: 420px;
  margin-left: -210px;
  margin-top: -210px;
  opacity: 0.85;

  .ring-image {
    animation: ringRotate2 30s linear infinite reverse;
  }
}

.ring-3 {
  width: 620px;
  height: 620px;
  margin-left: -310px;
  margin-top: -310px;
  opacity: 0.65;

  .ring-image {
    animation: ringRotate3 45s linear infinite;
  }
}

@keyframes ringRotate1 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ringRotate2 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ringRotate3 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 引力源核心
.gravity-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  z-index: 10;
  pointer-events: none;
}

.core-glow {
  position: absolute;
  inset: -25px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(100, 220, 255, 0.5) 0%,
    rgba(100, 180, 255, 0.3) 40%,
    transparent 70%
  );
}

.core-ring-outer {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: rgba(100, 220, 255, 0.7);
  border-bottom-color: rgba(150, 100, 255, 0.5);
}

.core-ring-inner {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1px solid transparent;
  border-left-color: rgba(255, 200, 150, 0.6);
  border-right-color: rgba(100, 200, 255, 0.4);
}

.core-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    #fff 0%,
    rgba(150, 230, 255, 0.95) 30%,
    rgba(100, 180, 255, 0.7) 60%,
    transparent 100%
  );
  box-shadow:
    0 0 15px rgba(100, 220, 255, 0.9),
    0 0 30px rgba(100, 180, 255, 0.6),
    0 0 60px rgba(100, 150, 255, 0.4);
}

// 星芒效果
.gravity-flares {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.flare {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  box-shadow:
    0 0 10px #fff,
    0 0 20px rgba(100, 200, 255, 0.8),
    0 0 40px rgba(100, 180, 255, 0.5);

  &.flare-1 {
    top: 25%;
    left: 30%;
    animation: flareBlink1 3s ease-in-out infinite;
  }

  &.flare-2 {
    top: 60%;
    left: 70%;
    animation: flareBlink2 4s ease-in-out infinite 1s;
  }

  &.flare-3 {
    top: 40%;
    left: 80%;
    animation: flareBlink3 2.5s ease-in-out infinite 0.5s;
  }
}

@keyframes flareBlink1 {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

@keyframes flareBlink2 {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.3); }
}

@keyframes flareBlink3 {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
}

// 空间噪点
.gravity-noise {
  position: absolute;
  inset: 0;
  z-index: 15;
  pointer-events: none;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

// 数据面板
.gravity-data {
  position: absolute;
  bottom: 40px;
  right: 50px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  background: rgba(5, 10, 25, 0.75);
  border: 1px solid rgba(100, 200, 255, 0.25);
  border-radius: 10px;
  backdrop-filter: blur(12px);
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 35px;
}

.data-label {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: rgba(150, 200, 230, 0.75);
  letter-spacing: 3px;
  text-transform: uppercase;
}

.data-value {
  font-family: 'Courier New', monospace;
  font-size: 15px;
  color: rgba(100, 220, 255, 0.95);
  text-shadow: 0 0 12px rgba(100, 200, 255, 0.6);
  letter-spacing: 1px;
  font-weight: bold;
}
</style>
