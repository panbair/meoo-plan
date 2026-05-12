<template>
  <div ref="containerRef" class="film-container">
    <!-- 远层 - 暗室颗粒 -->
    <div ref="grainLayerRef" class="film-grain">
      <div class="grain-overlay" />
    </div>

    <!-- 中层 - 负片主画面 -->
    <div ref="negativeLayerRef" class="film-negative">
      <img
        class="negative-image"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        alt="Film Base"
      />
      <div class="negative-overlay">
        <!-- 齿孔 -->
        <div class="sprocket-holes sprocket-left">
          <div v-for="i in 12" :key="'left-' + i" class="sprocket-hole" />
        </div>
        <div class="sprocket-holes sprocket-right">
          <div v-for="i in 12" :key="'right-' + i" class="sprocket-hole" />
        </div>
      </div>
    </div>

    <!-- 近层 - 刮痕与灰尘 -->
    <div ref="scratchLayerRef" class="film-scratches">
      <div
        v-for="i in 8"
        :key="'scratch-' + i"
        class="scratch"
        :class="`scratch-${i}`"
        :style="{ '--delay': `${i * 0.3}s`, '--x': `${10 + i * 12}%` }"
      />
      <div
        v-for="i in 15"
        :key="'dust-' + i"
        class="dust"
        :class="`dust-${i}`"
        :style="{ '--delay': `${i * 0.2}s`, '--x': `${5 + i * 6}%` }"
      />
    </div>

    <!-- 漏光效果 -->
    <div ref="leakEffectRef" class="film-leak-effect" />

    <!-- 光斑跟随 -->
    <div ref="flareFollowRef" class="flare-follow" />

    <!-- 胶片边框 -->
    <div class="film-border">
      <div class="border-left">
        <div v-for="i in 16" :key="'border-left-' + i" class="border-hole" />
      </div>
      <div class="border-right">
        <div v-for="i in 16" :key="'border-right-' + i" class="border-hole" />
      </div>
    </div>

    <!-- 胶片计数器 -->
    <div class="film-counter">
      <span class="counter-label">FRAME</span>
      <span ref="frameCountRef" class="counter-value">001</span>
    </div>

    <!-- 噪点层 -->
    <div ref="noiseRef" class="film-noise" />
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
const grainLayerRef = ref<HTMLElement | null>(null)
const negativeLayerRef = ref<HTMLElement | null>(null)
const scratchLayerRef = ref<HTMLElement | null>(null)
const leakEffectRef = ref<HTMLElement | null>(null)
const flareFollowRef = ref<HTMLElement | null>(null)
const noiseRef = ref<HTMLElement | null>(null)
const frameCountRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

let frameCounter = 1
let filmWobbleTimer: number | null = null

function initScrollAnimation() {
  if (!containerRef.value) return

  const ctx = gsap.context(() => {
    // 颗粒底层 - 极慢
    if (grainLayerRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 2.5
        }
      })
      tl.to(grainLayerRef.value, { y: '8%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 负片中层 - 中速
    if (negativeLayerRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.5
        }
      })
      tl.to(negativeLayerRef.value, { y: '30%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 刮痕近层 - 最快
    if (scratchLayerRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.value,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 0.8
        }
      })
      tl.to(scratchLayerRef.value, { y: '80%', duration: 1 }, 0)
      cleanupFns.push({ kill: () => tl.kill() })
    }

    // 齿孔滚动
    initSprocketScroll()

    // 帧计数器
    ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 0%',
      scrub: 1,
      onUpdate: (self) => {
        frameCounter = Math.floor(self.progress * 36) + 1
        if (frameCountRef.value) {
          frameCountRef.value.textContent = String(frameCounter).padStart(3, '0')
        }
      }
    })

    // 胶片横向摆动
    initFilmWobble()

    // 入场动画
    gsap.fromTo(containerRef.value,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
    )

  }, containerRef.value)

  cleanupFns.push({ kill: () => ctx.revert() })
}

function initSprocketScroll() {
  if (!negativeLayerRef.value) return

  const leftHoles = negativeLayerRef.value.querySelectorAll('.sprocket-left .sprocket-hole')
  const rightHoles = negativeLayerRef.value.querySelectorAll('.sprocket-right .sprocket-hole')

  gsap.to([...leftHoles, ...rightHoles], {
    backgroundPositionY: '100%',
    duration: 4,
    repeat: -1,
    ease: 'none'
  })
}

function initFilmWobble() {
  let wobbleTime = 0

  const wobble = () => {
    wobbleTime += 0.02

    if (negativeLayerRef.value) {
      const wobbleX = Math.sin(wobbleTime * 2) * 2
      const wobbleRotate = Math.sin(wobbleTime * 1.5) * 0.3
      negativeLayerRef.value.style.transform = `translateY(var(--y, 0)) translateX(${wobbleX}px) rotate(${wobbleRotate}deg)`
    }

    filmWobbleTimer = window.setTimeout(wobble, 50)
  }

  wobble()
}

function handleMouseMove(e: MouseEvent) {
  const x = e.clientX
  const y = e.clientY

  // 光斑跟随
  if (flareFollowRef.value) {
    gsap.to(flareFollowRef.value, {
      x: x - 80,
      y: y - 80,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 局部负片反转
  if (negativeLayerRef.value) {
    gsap.to(negativeLayerRef.value, {
      '--invert-mask-x': `${x}px`,
      '--invert-mask-y': `${y}px`,
      duration: 0.4
    })
  }

  // 漏光效果
  if (leakEffectRef.value) {
    gsap.to(leakEffectRef.value, {
      opacity: 0.6,
      duration: 0.3
    })
  }
}

function handleMouseLeave() {
  // 光斑消失
  if (flareFollowRef.value) {
    gsap.to(flareFollowRef.value, {
      opacity: 0,
      scale: 0,
      duration: 1.5,
      ease: 'power2.out'
    })
  }

  // 负片恢复
  if (negativeLayerRef.value) {
    gsap.to(negativeLayerRef.value, {
      '--invert-strength': 0,
      duration: 2,
      ease: 'power2.out'
    })
  }

  // 漏光消退
  if (leakEffectRef.value) {
    gsap.to(leakEffectRef.value, {
      opacity: 0,
      duration: 2,
      ease: 'power2.out'
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

  if (filmWobbleTimer) {
    clearTimeout(filmWobbleTimer)
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
.film-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0a0805;
  cursor: crosshair;
  --invert-mask-x: 50%;
  --invert-mask-y: 50%;
  --invert-strength: 0;
  --y: 0;
}

// 远层 - 暗室颗粒
.film-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  .grain-overlay {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(80, 70, 50, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(60, 50, 40, 0.15) 0%, transparent 50%);
    animation: grainFlicker 0.1s steps(2) infinite;
  }
}

@keyframes grainFlicker {
  0% { opacity: 0.8; transform: translate(0, 0); }
  50% { opacity: 1; transform: translate(1px, -1px); }
  100% { opacity: 0.9; transform: translate(-1px, 1px); }
}

// 中层 - 负片主画面
.film-negative {
  position: absolute;
  inset: 0;
  z-index: 2;
  transform: translateY(var(--y, 0));

  .negative-image {
    width: 100%;
    height: 140%;
    object-fit: cover;
    filter:
      invert(1)
      hue-rotate(180deg)
      saturate(0.7)
      brightness(0.85)
      contrast(1.1);
    transition: filter 0.4s ease;
  }

  .negative-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
}

// 齿孔
.sprocket-holes {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px 0;
}

.sprocket-left {
  left: 0;
}

.sprocket-right {
  right: 0;
}

.sprocket-hole {
  width: 28px;
  height: 18px;
  background: rgba(10, 8, 5, 0.9);
  border-radius: 3px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.8);
}

// 近层 - 刮痕与灰尘
.film-scratches {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  transform: translateY(var(--y, 0));
}

.scratch {
  position: absolute;
  top: -20%;
  left: var(--x);
  width: 2px;
  height: 120%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 250, 240, 0.15) 10%,
    rgba(255, 250, 240, 0.25) 50%,
    rgba(255, 250, 240, 0.15) 90%,
    transparent 100%
  );
  animation: scratchFall 3s linear infinite;
  animation-delay: var(--delay);

  &.scratch-1, &.scratch-5 { opacity: 0.3; width: 1px; }
  &.scratch-3, &.scratch-7 { opacity: 0.2; height: 80%; }
}

@keyframes scratchFall {
  0% { top: -120%; }
  100% { top: 120%; }
}

.dust {
  position: absolute;
  top: -10%;
  left: var(--x);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 250, 245, 0.4);
  animation: dustFloat 4s linear infinite;
  animation-delay: var(--delay);

  &.dust-2, &.dust-5, &.dust-10 { width: 3px; height: 3px; opacity: 0.3; }
  &.dust-7, &.dust-12 { width: 5px; height: 5px; opacity: 0.5; }
}

@keyframes dustFloat {
  0% {
    top: -10%;
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    top: 110%;
    opacity: 0;
  }
}

// 漏光效果
.film-leak-effect {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(255, 200, 100, 0.15) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 70%, rgba(255, 180, 80, 0.1) 0%, transparent 35%),
    radial-gradient(ellipse at 60% 20%, rgba(255, 220, 150, 0.12) 0%, transparent 30%);
}

// 光斑跟随
.flare-follow {
  position: fixed;
  top: 0;
  left: 0;
  width: 160px;
  height: 160px;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transform: scale(0);
  background: radial-gradient(
    circle,
    rgba(255, 230, 180, 0.3) 0%,
    rgba(255, 200, 120, 0.15) 40%,
    transparent 70%
  );
  filter: blur(20px);
}

// 胶片边框
.film-border {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.border-left,
.border-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 15px 0;
  background: linear-gradient(
    90deg,
    rgba(10, 8, 5, 0.95) 0%,
    rgba(10, 8, 5, 0.7) 60%,
    transparent 100%
  );
}

.border-right {
  right: 0;
  background: linear-gradient(
    270deg,
    rgba(10, 8, 5, 0.95) 0%,
    rgba(10, 8, 5, 0.7) 60%,
    transparent 100%
  );
}

.border-hole {
  width: 32px;
  height: 20px;
  margin: 0 auto;
  background: rgba(30, 25, 20, 0.9);
  border-radius: 4px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.9);
}

// 胶片计数器
.film-counter {
  position: absolute;
  bottom: 30px;
  left: 70px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(20, 15, 10, 0.85);
  border-radius: 4px;
  border: 1px solid rgba(255, 250, 240, 0.15);
}

.counter-label {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: rgba(200, 180, 150, 0.7);
  letter-spacing: 2px;
}

.counter-value {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  color: rgba(255, 250, 240, 0.9);
  text-shadow: 0 0 8px rgba(255, 240, 200, 0.4);
  letter-spacing: 3px;
}

// 噪点层
.film-noise {
  position: absolute;
  inset: 0;
  z-index: 15;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
  animation: noiseScratch 0.15s steps(3) infinite;
}

@keyframes noiseScratch {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-1px, 1px); }
  66% { transform: translate(1px, -1px); }
  100% { transform: translate(0, 0); }
}
</style>
