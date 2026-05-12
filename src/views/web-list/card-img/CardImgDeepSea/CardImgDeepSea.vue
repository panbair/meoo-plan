<template>
  <div ref="parentRef" class="card-img-deep-sea">
    <!-- 背景图片层 -->
    <div class="deep-sea-image-layer" ref="imageLayerRef">
      <img
        ref="deepSeaImageRef"
        class="deep-sea-image"
        src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1920&q=80"
        alt="Deep Sea"
      />
      <div class="deep-sea-image-overlay"></div>
    </div>

    <!-- 深海蓝幕层 - 最远层，几乎静止 -->
    <div ref="deepLayerRef" class="deep-sea-layer deep-sea-background">
      <div class="deep-gradient"></div>
    </div>

    <!-- 光柱层 - 缓慢移动 -->
    <div ref="lightBeamLayerRef" class="deep-sea-layer light-beam-layer">
      <div ref="beam1Ref" class="light-beam beam-1"></div>
      <div ref="beam2Ref" class="light-beam beam-2"></div>
      <div ref="beam3Ref" class="light-beam beam-3"></div>
    </div>

    <!-- 浮游粒子层 -->
    <div ref="particleLayerRef" class="deep-sea-layer particle-layer">
      <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>
    </div>

    <!-- 焦散光斑层 -->
    <div ref="causticsLayerRef" class="deep-sea-layer caustics-layer">
      <svg class="caustics-svg" ref="causticsSvgRef">
        <defs>
          <filter id="caustics-filter">
            <feTurbulence ref="turbulenceRef" type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div ref="causticSpotsRef" class="caustic-spots"></div>
    </div>

    <!-- 内容层 -->
    <div ref="contentLayerRef" class="deep-sea-content">
      <div ref="contentInnerRef" class="content-inner">
        <h1 ref="titleRef" class="deep-sea-title">DEEP SEA</h1>
        <p ref="subtitleRef" class="deep-sea-subtitle">探索深海的奥秘</p>
        <div ref="lineRef" class="deep-sea-line"></div>
        <p ref="descriptionRef" class="deep-sea-description">
          在这片幽蓝的深海中，光线穿透层层海水，<br/>
          带来神秘而宁静的美感。每一道光束都诉说着<br/>
          深海的故事。
        </p>
        <div ref="exploreBtnRef" class="deep-sea-btn">
          <span>开始探索</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 气泡粒子 -->
    <div ref="bubblesLayerRef" class="deep-sea-layer bubbles-layer">
      <div v-for="i in 20" :key="i" class="bubble" :style="getBubbleStyle(i)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const parentRef = ref<HTMLElement | null>(null)
const imageLayerRef = ref<HTMLElement | null>(null)
const deepSeaImageRef = ref<HTMLImageElement | null>(null)
const deepLayerRef = ref<HTMLElement | null>(null)
const lightBeamLayerRef = ref<HTMLElement | null>(null)
const beam1Ref = ref<HTMLElement | null>(null)
const beam2Ref = ref<HTMLElement | null>(null)
const beam3Ref = ref<HTMLElement | null>(null)
const particleLayerRef = ref<HTMLElement | null>(null)
const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
const causticsLayerRef = ref<HTMLElement | null>(null)
const causticsSvgRef = ref<SVGElement | null>(null)
const turbulenceRef = ref<SVGElement | null>(null)
const causticSpotsRef = ref<HTMLElement | null>(null)
const contentLayerRef = ref<HTMLElement | null>(null)
const contentInnerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const exploreBtnRef = ref<HTMLElement | null>(null)
const bubblesLayerRef = ref<HTMLElement | null>(null)

let particleCtx: CanvasRenderingContext2D | null = null
let particles: Array<{
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
}> = []
let animationId: number | null = null
let hueRotation = 180

const getBubbleStyle = (index: number) => {
  const size = 4 + Math.random() * 12
  return {
    left: `${5 + (index * 4.75) % 90}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${8 + Math.random() * 6}s`,
    width: `${size}px`,
    height: `${size}px`
  }
}

const initParticles = () => {
  const canvas = particleCanvasRef.value
  if (!canvas) return

  particleCtx = canvas.getContext('2d')
  if (!particleCtx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  particles = []
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1 + Math.random() * 3,
      speedY: 0.2 + Math.random() * 0.8,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: 0.3 + Math.random() * 0.5
    })
  }
}

const animateParticles = () => {
  if (!particleCtx || !particleCanvasRef.value) return

  const canvas = particleCanvasRef.value
  particleCtx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(p => {
    p.y -= p.speedY
    p.x += p.speedX + Math.sin(p.y * 0.01) * 0.2

    if (p.y < -10) {
      p.y = canvas.height + 10
      p.x = Math.random() * canvas.width
    }
    if (p.x < 0) p.x = canvas.width
    if (p.x > canvas.width) p.x = 0

    particleCtx!.beginPath()
    particleCtx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    particleCtx!.fillStyle = `rgba(120, 200, 255, ${p.opacity})`
    particleCtx!.fill()
  })

  animationId = requestAnimationFrame(animateParticles)
}

const initScrollAnimations = () => {
  if (!parentRef.value) return

  // 背景图片动画 - 缓慢缩放
  if (deepSeaImageRef.value) {
    gsap.set(deepSeaImageRef.value, { scale: 1.1 })

    const t0 = gsap.to(deepSeaImageRef.value, {
      scale: 1.2,
      ease: 'none',
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 2
      }
    })
    cleanupFns.push(() => t0.kill())
  }

  // 图片层跟随滚动
  if (imageLayerRef.value) {
    const t01 = gsap.to(imageLayerRef.value, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })
    cleanupFns.push(() => t01.kill())
  }

  // 深海蓝幕层 - 0.02速度，几乎静止
  if (deepLayerRef.value) {
    const t1 = gsap.to(deepLayerRef.value, {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })
    cleanupFns.push(() => t1.kill())
  }

  // 光柱层 - 0.08速度
  if (lightBeamLayerRef.value) {
    const t2 = gsap.to(lightBeamLayerRef.value, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })
    cleanupFns.push(() => t2.kill())
  }

  // 光柱角度变化
  if (beam1Ref.value && beam2Ref.value && beam3Ref.value) {
    const beams = [beam1Ref.value, beam2Ref.value, beam3Ref.value]
    beams.forEach((beam, i) => {
      const t = gsap.to(beam, {
        rotate: (i % 2 === 0 ? 3 : -3),
        ease: 'none',
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 2
        }
      })
      cleanupFns.push(() => t.kill())
    })
  }

  // 浮游粒子层 - 0.2速度
  if (particleLayerRef.value) {
    const t3 = gsap.to(particleLayerRef.value, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })
    cleanupFns.push(() => t3.kill())
  }

  // 焦散光斑层 - 0.35速度，最快
  if (causticsLayerRef.value) {
    const t4 = gsap.to(causticsLayerRef.value, {
      yPercent: -80,
      xPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    })
    cleanupFns.push(() => t4.kill())
  }

  // 色调变化
  const t5 = gsap.to(parentRef.value, {
    '--hue-rotate': 60,
    ease: 'none',
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 3
    }
  })
  cleanupFns.push(() => t5.kill())
}

const initMouseInteraction = () => {
  if (!parentRef.value) return

  const mouseX = { val: 0 }
  const mouseY = { val: 0 }

  const onMouseMove = (e: MouseEvent) => {
    gsap.to(mouseX, { val: e.clientX, duration: 0.8, ease: 'power2.out' })
    gsap.to(mouseY, { val: e.clientY, duration: 0.8, ease: 'power2.out' })

    // 光柱跟随鼠标
    if (lightBeamLayerRef.value) {
      gsap.to(lightBeamLayerRef.value, {
        x: (mouseX.val - window.innerWidth / 2) * 0.03,
        y: (mouseY.val - window.innerHeight / 2) * 0.02,
        duration: 1,
        ease: 'power2.out'
      })
    }

    // 焦散光斑跟随鼠标
    if (causticsLayerRef.value) {
      gsap.to(causticsLayerRef.value, {
        x: (mouseX.val - window.innerWidth / 2) * 0.05,
        y: (mouseY.val - window.innerHeight / 2) * 0.05,
        duration: 0.8,
        ease: 'power2.out'
      })
    }

    // 图片轻微跟随鼠标
    if (deepSeaImageRef.value) {
      gsap.to(deepSeaImageRef.value, {
        x: (mouseX.val - window.innerWidth / 2) * 0.02,
        y: (mouseY.val - window.innerHeight / 2) * 0.02,
        duration: 1,
        ease: 'power2.out'
      })
    }
  }

  parentRef.value.addEventListener('mousemove', onMouseMove)
  cleanupFns.push(() => parentRef.value?.removeEventListener('mousemove', onMouseMove))
}

const initCausticsAnimation = () => {
  if (!turbulenceRef.value) return

  let seed = 1
  const animateTurbulence = () => {
    if (turbulenceRef.value) {
      seed += 0.01
      turbulenceRef.value.setAttribute('seed', String(Math.floor(seed)))
    }
    requestAnimationFrame(animateTurbulence)
  }
  animateTurbulence()
}

const initBubbleAnimation = () => {
  if (!bubblesLayerRef.value) return

  const bubbles = bubblesLayerRef.value.querySelectorAll('.bubble')
  bubbles.forEach((bubble) => {
    gsap.to(bubble, {
      y: -window.innerHeight - 50,
      duration: 8 + Math.random() * 6,
      repeat: -1,
      yoyo: false,
      ease: 'none'
    })
  })
}

const initEntryAnimation = () => {
  if (!contentInnerRef.value) return

  const elements = [
    titleRef.value,
    subtitleRef.value,
    lineRef.value,
    descriptionRef.value,
    exploreBtnRef.value
  ].filter(Boolean) as HTMLElement[]

  gsap.set(elements, { opacity: 0, y: 60 })

  const tl = gsap.timeline({ delay: 0.3 })

  tl.to(titleRef.value, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out'
  })
    .to(
      subtitleRef.value,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      },
      '-=0.6'
    )
    .to(
      lineRef.value,
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
      },
      '-=0.4'
    )
    .to(
      descriptionRef.value,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      },
      '-=0.4'
    )
    .to(
      exploreBtnRef.value,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      },
      '-=0.6'
    )

  cleanupFns.push(() => tl.kill())
}

const handleResize = () => {
  if (particleCanvasRef.value) {
    particleCanvasRef.value.width = window.innerWidth
    particleCanvasRef.value.height = window.innerHeight
  }
}

onMounted(() => {
  initParticles()
  animateParticles()
  initScrollAnimations()
  initMouseInteraction()
  initCausticsAnimation()
  initBubbleAnimation()
  initEntryAnimation()

  window.addEventListener('resize', handleResize)
  cleanupFns.push(() => window.removeEventListener('resize', handleResize))
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0

  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.card-img-deep-sea {
  --hue-rotate: 180;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: hsl(220, 100%, 3%);
}

// 背景图片层
.deep-sea-image-layer {
  position: absolute;
  inset: -10%;
  z-index: 0;
  overflow: hidden;
}

.deep-sea-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
  filter: brightness(0.6) saturate(1.2);
}

.deep-sea-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 20, 60, 0.5) 0%,
    rgba(0, 30, 80, 0.3) 30%,
    rgba(0, 20, 60, 0.4) 60%,
    rgba(0, 10, 40, 0.6) 100%
  );
}

.deep-sea-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

// 深海蓝幕层
.deep-sea-background {
  .deep-gradient {
    width: 100%;
    height: 100%;
    background: radial-gradient(
      ellipse at 50% 0%,
      rgba(0, 50, 100, 0.4) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 20% 80%,
      rgba(0, 30, 60, 0.3) 0%,
      transparent 40%
    ),
    radial-gradient(
      ellipse at 80% 60%,
      rgba(0, 40, 80, 0.3) 0%,
      transparent 35%
    );
  }
}

// 光柱层
.light-beam-layer {
  mix-blend-mode: screen;
  filter: brightness(1.2);
}

.light-beam {
  position: absolute;
  background: linear-gradient(
    180deg,
    rgba(120, 200, 255, 0.15) 0%,
    rgba(80, 180, 255, 0.08) 50%,
    transparent 100%
  );
  transform-origin: top center;
}

.beam-1 {
  top: -20%;
  left: 15%;
  width: 180px;
  height: 140%;
  transform: rotate(-15deg);
  background: linear-gradient(
    180deg,
    rgba(150, 220, 255, 0.2) 0%,
    rgba(100, 200, 255, 0.1) 40%,
    transparent 100%
  );
}

.beam-2 {
  top: -10%;
  left: 45%;
  width: 250px;
  height: 130%;
  transform: rotate(-8deg);
  background: linear-gradient(
    180deg,
    rgba(180, 230, 255, 0.18) 0%,
    rgba(120, 200, 255, 0.08) 50%,
    transparent 100%
  );
}

.beam-3 {
  top: -15%;
  right: 10%;
  width: 200px;
  height: 135%;
  transform: rotate(10deg);
  background: linear-gradient(
    180deg,
    rgba(140, 210, 255, 0.16) 0%,
    rgba(90, 180, 255, 0.06) 50%,
    transparent 100%
  );
}

// 粒子层
.particle-layer {
  z-index: 3;
}

.particle-canvas {
  width: 100%;
  height: 100%;
}

// 焦散光斑层
.caustics-layer {
  z-index: 4;
}

.caustics-svg {
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.caustic-spots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse 80px 60px at 20% 30%,
    rgba(100, 200, 255, 0.15) 0%,
    transparent 70%
  ),
  radial-gradient(
    ellipse 60px 80px at 60% 50%,
    rgba(80, 180, 255, 0.12) 0%,
    transparent 70%
  ),
  radial-gradient(
    ellipse 100px 70px at 80% 25%,
    rgba(120, 200, 255, 0.1) 0%,
    transparent 70%
  ),
  radial-gradient(
    ellipse 50px 50px at 35% 70%,
    rgba(90, 180, 255, 0.08) 0%,
    transparent 70%
  );
  animation: causticMove 8s ease-in-out infinite;
}

@keyframes causticMove {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  25% {
    transform: translate(20px, -10px) scale(1.1);
    opacity: 1;
  }
  50% {
    transform: translate(-10px, 20px) scale(0.95);
    opacity: 0.9;
  }
  75% {
    transform: translate(-20px, -15px) scale(1.05);
    opacity: 0.85;
  }
}

// 气泡层
.bubbles-layer {
  z-index: 5;
}

.bubble {
  position: absolute;
  bottom: -20px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(100, 200, 255, 0.2) 50%,
    transparent 70%
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: bubbleRise linear infinite;
}

@keyframes bubbleRise {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

// 内容层
.deep-sea-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 40px;
}

.content-inner {
  text-align: center;
  max-width: 700px;
}

.deep-sea-title {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 900;
  letter-spacing: 0.3em;
  color: transparent;
  background: linear-gradient(
    180deg,
    rgba(180, 230, 255, 0.9) 0%,
    rgba(100, 180, 255, 0.6) 50%,
    rgba(60, 140, 200, 0.4) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  text-shadow: 0 0 60px rgba(100, 200, 255, 0.5);
  margin-bottom: 20px;
}

.deep-sea-subtitle {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(16px, 2vw, 24px);
  color: rgba(150, 210, 255, 0.8);
  letter-spacing: 0.5em;
  margin-bottom: 30px;
}

.deep-sea-line {
  width: 80px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(100, 200, 255, 0.6) 50%,
    transparent 100%
  );
  margin: 0 auto 30px;
  transform-origin: center;
  transform: scaleX(0);
}

.deep-sea-description {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(14px, 1.5vw, 18px);
  line-height: 2;
  color: rgba(120, 180, 220, 0.7);
  margin-bottom: 40px;
}

.deep-sea-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  color: rgba(180, 230, 255, 0.9);
  border: 1px solid rgba(100, 180, 255, 0.4);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.4s ease;
  background: rgba(0, 50, 100, 0.2);

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: rgba(0, 80, 150, 0.4);
    border-color: rgba(100, 200, 255, 0.7);
    box-shadow: 0 0 30px rgba(100, 200, 255, 0.3);

    svg {
      transform: translateX(5px);
    }
  }
}
</style>
