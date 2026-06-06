<template>
  <section ref="rootRef" class="atmos-root">
    <!-- 大气光晕背景层 -->
    <div ref="skyGradient" class="atmos-sky"></div>
    <div ref="glowA" class="atmos-ambient-glow atmos-ambient-glow--a"></div>
    <div ref="glowB" class="atmos-ambient-glow atmos-ambient-glow--b"></div>
    <div ref="glowC" class="atmos-ambient-glow atmos-ambient-glow--c"></div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="atmos-scroll">
      <div ref="trackRef" class="atmos-track" :style="{ height: trackHeight }">
        <div class="atmos-sticky">

          <!-- 标题层 -->
          <header ref="headerRef" class="atmos-header">
            <span class="atmos-kicker">✦ CSS3 3D · 大气透视景深 ✦</span>
            <h1 class="atmos-title">
              <span ref="tc1" class="atmos-title__char">深</span>
              <span ref="tc2" class="atmos-title__char atmos-title__char--accent">空</span>
              <span ref="tc3" class="atmos-title__char">之</span>
              <span ref="tc4" class="atmos-title__char atmos-title__char--accent">境</span>
            </h1>
            <div ref="dividerRef" class="atmos-divider"></div>
            <p ref="subRef" class="atmos-subtitle">
              向下滚动 · 穿越大气层 · 感受 CSS3 3D 景深的震撼
            </p>
          </header>

          <!-- ════════════════ CSS3 3D 场景 ════════════════ -->
          <div ref="sceneRef" class="atmos-scene">
            <div ref="cameraRig" class="atmos-camera-rig">

              <!-- 远景层 Z:-500 -->
              <div ref="layerBg" class="atmos-layer atmos-layer--bg">
                <div class="atmos-layer__card">
                  <img
                    :src="images.bg"
                    alt="远景山脉"
                    class="atmos-layer__img"
                    loading="lazy"
                  />
                  <div class="atmos-layer__fog atmos-layer__fog--far"></div>
                  <div class="atmos-layer__vignette"></div>
                </div>
                <span class="atmos-layer__label">远 景 · 山脉</span>
              </div>

              <!-- 大气散射雾层 Z:-350 -->
              <div ref="fogFar" class="atmos-fog-plane atmos-fog-plane--far"></div>

              <!-- 中远景层 Z:-200 -->
              <div ref="layerMgBack" class="atmos-layer atmos-layer--mg-back">
                <div class="atmos-layer__card">
                  <img
                    :src="images.mgBack"
                    alt="中景森林"
                    class="atmos-layer__img"
                    loading="lazy"
                  />
                  <div class="atmos-layer__fog atmos-layer__fog--mid"></div>
                </div>
                <span class="atmos-layer__label">中远景 · 森林</span>
              </div>

              <!-- 体积光射线层 Z:-100 -->
              <div ref="lightRays" class="atmos-light-rays">
                <div class="atmos-ray atmos-ray--1"></div>
                <div class="atmos-ray atmos-ray--2"></div>
                <div class="atmos-ray atmos-ray--3"></div>
                <div class="atmos-ray atmos-ray--4"></div>
                <div class="atmos-ray atmos-ray--5"></div>
              </div>

              <!-- 中近景层 Z:0 -->
              <div ref="layerMgFront" class="atmos-layer atmos-layer--mg-front">
                <div class="atmos-layer__card">
                  <img
                    :src="images.mgFront"
                    alt="湖面倒影"
                    class="atmos-layer__img"
                    loading="lazy"
                  />
                  <div class="atmos-layer__fog atmos-layer__fog--near"></div>
                </div>
                <span class="atmos-layer__label">中近景 · 湖面</span>
              </div>

              <!-- 前景雾层 Z:80 -->
              <div ref="fogNear" class="atmos-fog-plane atmos-fog-plane--near"></div>

              <!-- 前景层 Z:180 -->
              <div ref="layerFg" class="atmos-layer atmos-layer--fg">
                <div class="atmos-layer__card">
                  <img
                    :src="images.fg"
                    alt="前景花卉"
                    class="atmos-layer__img"
                    loading="lazy"
                  />
                </div>
                <span class="atmos-layer__label">前景 · 花卉</span>
              </div>

              <!-- 粒子场 -->
              <div ref="particleField" class="atmos-particles">
                <span
                  v-for="p in particles"
                  :key="p.id"
                  class="atmos-particle"
                  :style="p.style"
                ></span>
              </div>

            </div>
          </div>

          <!-- 深度指示器 -->
          <div ref="depthIndicator" class="atmos-depth-indicator">
            <span class="atmos-depth-indicator__dot"></span>
            <span class="atmos-depth-indicator__text">
              深度 {{ currentDepth }} / 4 · 穿越大气层
            </span>
          </div>

          <!-- 底部进度条 -->
          <div class="atmos-progress">
            <div ref="progressFill" class="atmos-progress__fill"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DAtmos — CSS3 3D 大气透视景深
//
//  核心概念：纯 CSS3 3D 多层大气透视
//  1. 4层图片分布在不同的 Z 深度（-500 → +180）
//  2. 大气散射模拟：远景偏蓝、低对比度、模糊
//  3. 体积光射线穿透场景
//  4. 40个浮动粒子在3D空间漂移
//  5. 用户竖滚 → 摄像机推入3D空间，各层视差移动
//  6. transform-style: preserve-3d + perspective 构建真3D
//
//  设计风格：青春时尚 — 珊瑚暖橙 · 天空湛蓝 · 金色光线 · 清新自然
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

// ── 图片资源 ──
const images = {
  bg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  mgBack: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
  mgFront: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
  fg: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
}

// ── 粒子生成 ──
interface Particle {
  id: number
  style: Record<string, string>
}

function generateParticles(count: number): Particle[] {
  // 使用确定性的伪随机（基于索引），避免 Math.random() 导致 SSR 不匹配
  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
  }

  return Array.from({ length: count }, (_, i) => {
    const r1 = pseudoRandom(i * 3 + 1)
    const r2 = pseudoRandom(i * 3 + 2)
    const r3 = pseudoRandom(i * 3 + 3)
    const r4 = pseudoRandom(i * 5 + 7)
    const r5 = pseudoRandom(i * 7 + 13)

    const size = 2 + r1 * 5 // 2-7px
    const x = r2 * 100 // 0-100%
    const y = 20 + r3 * 80 // 20-100% (避免顶部标题区)
    const duration = 10 + r4 * 16 // 10-26s
    const delay = r5 * -20 // -20 to 0s (负延迟使粒子初始分散)
    const opacity = 0.15 + r1 * 0.45 // 0.15-0.6

    return {
      id: i,
      style: {
        '--px': `${x}%`,
        '--py': `${y}%`,
        '--psize': `${size}px`,
        '--pduration': `${duration}s`,
        '--pdelay': `${delay}s`,
        '--popacity': `${opacity}`,
      },
    }
  })
}

const particles = ref<Particle[]>(generateParticles(40))

// ── 常量 ──
const DEPTH_STAGES = 4
const trackHeight = `${(DEPTH_STAGES + 1) * 100}vh` // 500vh

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null)
const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null)
const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const cameraRig = ref<HTMLElement | null>(null)
const layerBg = ref<HTMLElement | null>(null)
const layerMgBack = ref<HTMLElement | null>(null)
const layerMgFront = ref<HTMLElement | null>(null)
const layerFg = ref<HTMLElement | null>(null)
const fogFar = ref<HTMLElement | null>(null)
const fogNear = ref<HTMLElement | null>(null)
const lightRays = ref<HTMLElement | null>(null)
const particleField = ref<HTMLElement | null>(null)
const depthIndicator = ref<HTMLElement | null>(null)
const progressFill = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const glowC = ref<HTMLElement | null>(null)
const skyGradient = ref<HTMLElement | null>(null)

const currentDepth = ref(1)
const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 入场动画 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return

  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value,
      scroller,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  })

  // 标题字逐个从远方飞入
  tl.fromTo(
    headerRef.value,
    { autoAlpha: 0, y: 60 },
    { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' },
  )
  tl.fromTo(
    chars,
    { autoAlpha: 0, z: -300, scale: 0.4, filter: 'blur(12px)' },
    {
      autoAlpha: 1,
      z: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.7,
      stagger: 0.1,
      ease: 'back.out(1.8)',
    },
    '-=0.4',
  )
  tl.fromTo(
    dividerRef.value,
    { scaleX: 0, autoAlpha: 0 },
    { scaleX: 1, autoAlpha: 1, duration: 0.55, ease: 'power3.inOut' },
    '-=0.2',
  )
  tl.fromTo(
    subRef.value,
    { autoAlpha: 0, y: 20, filter: 'blur(6px)' },
    { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.65, ease: 'power2.out' },
    '-=0.15',
  )
  // 场景淡入
  tl.fromTo(
    sceneRef.value,
    { autoAlpha: 0, scale: 0.92 },
    { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power3.out' },
    '-=0.35',
  )

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
}

// ═══════════════════════ 主3D滚动动画 ═══════════════════════
function setup3DScroll() {
  if (!scrollRef.value || !trackRef.value || !cameraRig.value) return

  const scroller = scrollRef.value
  const track = trackRef.value
  const rig = cameraRig.value
  const scene = sceneRef.value

  // 初始状态
  gsap.set(rig, { translateZ: 0 })
  gsap.set(layerBg.value, { translateZ: -500 })
  gsap.set(layerMgBack.value, { translateZ: -200 })
  gsap.set(layerMgFront.value, { translateZ: 0 })
  gsap.set(layerFg.value, { translateZ: 180 })
  gsap.set(lightRays.value, { translateZ: -100 })
  gsap.set(fogFar.value, { translateZ: -350 })
  gsap.set(fogNear.value, { translateZ: 80 })
  gsap.set(particleField.value, { translateZ: 100 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track,
      scroller,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate(self) {
        currentDepth.value = Math.min(DEPTH_STAGES, Math.max(1, Math.ceil(self.progress * DEPTH_STAGES)))
      },
    },
  })

  const D = DEPTH_STAGES // 总时长 (秒，在timeline中)

  // ── 阶段1 (0→1): 远景展开 ──
  // 摄像机微微前推，远景清晰化
  master.to(rig, { translateZ: 120, duration: 0.8, ease: 'power2.inOut' }, 0)
  master.to(layerBg.value, { filter: 'brightness(1.05) blur(1.5px)', duration: 0.8, ease: 'power2.inOut' }, 0)

  // ── 阶段2 (1→2): 穿越中景 ──
  // 摄像机继续推进，中远景成为焦点
  master.to(rig, { translateZ: 280, duration: 0.8, ease: 'power2.inOut' }, 1)
  master.to(layerBg.value, { filter: 'brightness(1.15) blur(2.5px)', translateZ: -420, duration: 0.8, ease: 'power2.inOut' }, 1)
  master.to(layerMgBack.value, { filter: 'brightness(1.02) blur(0px)', translateZ: -120, duration: 0.8, ease: 'power2.inOut' }, 1)
  // 中远景雾消散
  master.to(fogFar.value, { opacity: 0.3, duration: 0.8, ease: 'power2.inOut' }, 1)

  // ── 阶段3 (2→3): 深入中近景 ──
  // 摄像机深入，前景开始清晰
  master.to(rig, { translateZ: 450, duration: 0.8, ease: 'power2.inOut' }, 2)
  master.to(layerBg.value, { filter: 'brightness(1.25) blur(4px)', translateZ: -350, duration: 0.8, ease: 'power2.inOut' }, 2)
  master.to(layerMgBack.value, { filter: 'brightness(1.08) blur(1px)', translateZ: -50, duration: 0.8, ease: 'power2.inOut' }, 2)
  master.to(layerMgFront.value, { filter: 'brightness(1) blur(0px)', translateZ: 80, duration: 0.8, ease: 'power2.inOut' }, 2)
  master.to(fogNear.value, { opacity: 0.25, duration: 0.8, ease: 'power2.inOut' }, 2)

  // ── 阶段4 (3→4): 前景极致特写 ──
  // 摄像机逼近前景，远景完全模糊（模拟微距景深）
  master.to(rig, { translateZ: 600, duration: 0.8, ease: 'power2.inOut' }, 3)
  master.to(layerBg.value, { filter: 'brightness(1.35) blur(6px)', translateZ: -280, duration: 0.8, ease: 'power2.inOut' }, 3)
  master.to(layerMgBack.value, { filter: 'brightness(1.15) blur(2px)', translateZ: 20, duration: 0.8, ease: 'power2.inOut' }, 3)
  master.to(layerMgFront.value, { filter: 'brightness(1.04) blur(0.5px)', translateZ: 140, duration: 0.8, ease: 'power2.inOut' }, 3)
  master.to(layerFg.value, { filter: 'brightness(0.95) blur(0px)', translateZ: 280, duration: 0.8, ease: 'power2.inOut' }, 3)
  master.to(fogNear.value, { opacity: 0.08, duration: 0.8, ease: 'power2.inOut' }, 3)

  // ── 光线旋转 ──
  if (lightRays.value) {
    master.to(lightRays.value, { rotation: 25, duration: D, ease: 'none' }, 0)
    master.to(lightRays.value, { opacity: 0.7, duration: 0.4 }, 0)
    master.to(lightRays.value, { opacity: 1, duration: 0.8 }, 1)
    master.to(lightRays.value, { opacity: 0.55, duration: 0.8 }, 2.5)
  }

  // ── 粒子场动画 ──
  if (particleField.value) {
    master.to(particleField.value, { translateZ: 250, duration: D, ease: 'none' }, 0)
    master.to(particleField.value, { opacity: 0.45, duration: 0.8 }, 0)
    master.to(particleField.value, { opacity: 1, duration: 1 }, 1.5)
    master.to(particleField.value, { opacity: 0.7, duration: 1 }, 3)
  }

  // ── 深度指示器脉冲 ──
  if (depthIndicator.value) {
    for (let stage = 0; stage < DEPTH_STAGES; stage++) {
      master.to(depthIndicator.value, { scale: 1.25, opacity: 1, duration: 0.1, ease: 'power2.out' }, stage + 0.4)
      master.to(depthIndicator.value, { scale: 1, opacity: 0.65, duration: 0.25, ease: 'power2.in' }, stage + 0.5)
    }
  }

  // ── 环境光晕漂移 ──
  if (glowA.value) master.to(glowA.value, { x: '8vw', y: '-4vh', scale: 1.2, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-6vw', y: '6vh', scale: 1.3, duration: D }, 0)
  if (glowC.value) master.to(glowC.value, { x: '3vw', y: '-8vh', scale: 1.15, duration: D }, 0)

  // ── 天空渐变色调变化 ──
  if (skyGradient.value) {
    master.to(skyGradient.value, { opacity: 1, duration: 0.5 }, 0)
    master.to(skyGradient.value, { opacity: 0.6, duration: 1.5 }, 2)
    master.to(skyGradient.value, { opacity: 0.35, duration: 1 }, 3)
  }

  // ── 进度条 ──
  if (progressFill.value) {
    master.to(progressFill.value, { width: '100%', duration: D }, 0)
  }

  cleanupFns.push(() => {
    master.scrollTrigger?.kill()
    master.kill()
  })
}

function handleResize() {
  ScrollTrigger.refresh(true)
}

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupEntrance()
      setup3DScroll()
    })
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach((st) => st.kill())
  cleanupFns.forEach((fn) => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 根容器 ═══════════════════════ */
.atmos-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(175deg, #fef9f4 0%, #fdf5f0 15%, #fef7f3 30%, #fcf4ef 50%, #fef8f5 70%, #fdf6f2 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 天空渐变背景 ── */
.atmos-sky {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255, 180, 140, 0.55) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 60%, rgba(120, 180, 240, 0.3) 0%, transparent 55%),
    radial-gradient(ellipse 50% 35% at 75% 40%, rgba(255, 200, 120, 0.35) 0%, transparent 55%),
    radial-gradient(ellipse 70% 45% at 50% 80%, rgba(200, 160, 220, 0.2) 0%, transparent 50%);
  pointer-events: none;
  will-change: opacity;
}

/* ── 环境光晕 ── */
.atmos-ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  will-change: transform;
  z-index: 1;
}
.atmos-ambient-glow--a {
  width: 35vw; height: 35vw;
  top: -8vh; left: -5vw;
  background: radial-gradient(circle, rgba(255, 150, 120, 0.45) 0%, transparent 70%);
}
.atmos-ambient-glow--b {
  width: 30vw; height: 30vw;
  bottom: -8vh; right: -4vw;
  background: radial-gradient(circle, rgba(120, 180, 240, 0.38) 0%, transparent 70%);
}
.atmos-ambient-glow--c {
  width: 26vw; height: 26vw;
  top: 35vh; left: 50vw;
  background: radial-gradient(circle, rgba(255, 200, 100, 0.32) 0%, transparent 70%);
}

/* ── 滚动容器 ── */
.atmos-scroll {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: auto;
  z-index: 2;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(255, 150, 120, 0.35);
    &:hover { background: rgba(255, 150, 120, 0.55); }
  }
}
.atmos-track { position: relative; width: 100%; }
.atmos-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* ── 标题 ── */
.atmos-header {
  position: absolute;
  top: 3.5vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  text-align: center;
  width: min(92vw, 800px);
  pointer-events: none;
}
.atmos-kicker {
  display: inline-block;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(200, 120, 100, 0.8);
  background: rgba(255, 160, 130, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 150, 120, 0.22);
  border-radius: 999px;
  padding: 0.3rem 1.3rem;
  margin-bottom: 0.6rem;
}
.atmos-title {
  margin: 0;
  display: flex;
  justify-content: center;
  gap: 0.06em;
}
.atmos-title__char {
  display: inline-block;
  font-size: clamp(2.4rem, 6vw, 5rem);
  font-weight: 900;
  color: #c87060;
  will-change: transform, opacity, filter;

  &--accent {
    background: linear-gradient(160deg, #ff7b6b 0%, #f5a860 30%, #6eb8f0 65%, #8ec8f8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 3px 16px rgba(110, 170, 240, 0.5));
  }
}
.atmos-divider {
  width: 100px;
  height: 2px;
  margin: 0.5rem auto 0.65rem;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #ff8b70, #f5b860, #6eb8f0, #8ec8f8, transparent);
  transform-origin: center;
  will-change: transform, opacity;
}
.atmos-subtitle {
  margin: 0;
  font-size: clamp(0.74rem, 1.1vw, 0.9rem);
  color: rgba(180, 110, 100, 0.5);
  max-width: 480px;
  margin-inline: auto;
  will-change: transform, opacity, filter;
}

/* ═══════════════════════ CSS3 3D 场景 ═══════════════════════ */
.atmos-scene {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  z-index: 10;
  perspective: 1200px;           /* 🔑 3D透视距离 */
  perspective-origin: 50% 45%;   /* 略微上移消失点，突出前景 */
  will-change: transform, opacity;
}

/* 🔑 摄像机支架 — 保持3D空间 */
.atmos-camera-rig {
  position: absolute;
  width: 0;
  height: 0;
  transform-style: preserve-3d;  /* 🔑 关键：保持所有子元素的3D空间 */
  will-change: transform;
}

/* ═══════════════════════ 图层通用 ═══════════════════════ */
.atmos-layer {
  position: absolute;
  transform-style: preserve-3d;
  will-change: transform, filter;
}
.atmos-layer__card {
  position: absolute;
  width: min(70vw, 500px);
  height: min(46vw, 330px);
  margin-left: calc(min(70vw, 500px) / -2);
  margin-top: calc(min(46vw, 330px) / -2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.18),
    0 0 0 1px rgba(255, 255, 255, 0.25),
    inset 0 0 0 1px rgba(255, 255, 255, 0.15);
  background: #f5f0ec;
}
.atmos-layer__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── 大气雾覆盖 ── */
.atmos-layer__fog {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.atmos-layer__fog--far {
  background: linear-gradient(180deg,
    rgba(180, 200, 235, 0.5) 0%,
    rgba(170, 190, 225, 0.35) 30%,
    rgba(200, 210, 230, 0.25) 60%,
    rgba(220, 215, 220, 0.2) 100%
  );
}
.atmos-layer__fog--mid {
  background: linear-gradient(180deg,
    rgba(190, 200, 220, 0.3) 0%,
    rgba(200, 205, 215, 0.2) 40%,
    rgba(220, 215, 210, 0.1) 100%
  );
}
.atmos-layer__fog--near {
  background: linear-gradient(180deg,
    rgba(210, 210, 215, 0.12) 0%,
    rgba(220, 215, 210, 0.06) 100%
  );
}

/* ── 暗角 ── */
.atmos-layer__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.15) 100%);
}

/* ── 图层标签 ── */
.atmos-layer__label {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(180, 110, 90, 0.7);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(8px);
  border-radius: 999px;
  padding: 0.2rem 0.9rem;
  border: 1px solid rgba(255, 160, 130, 0.2);
  white-space: nowrap;
}

/* ── 各层初始模糊/滤镜 ── */
.atmos-layer--bg {
  filter: brightness(1.05) blur(1.5px);
}
.atmos-layer--mg-back {
  filter: brightness(1.02) blur(0.6px);
}
.atmos-layer--mg-front {
  filter: brightness(1) blur(0px);
}
.atmos-layer--fg {
  filter: brightness(0.98) blur(0px);
}

/* ═══════════════════════ 大气雾平面 ═══════════════════════ */
.atmos-fog-plane {
  position: absolute;
  width: min(90vw, 700px);
  height: min(60vw, 480px);
  margin-left: calc(min(90vw, 700px) / -2);
  margin-top: calc(min(60vw, 480px) / -2);
  pointer-events: none;
  border-radius: 50%;
  will-change: transform, opacity;
}
.atmos-fog-plane--far {
  background: radial-gradient(ellipse 70% 60% at 50% 50%,
    rgba(160, 195, 235, 0.5) 0%,
    rgba(180, 200, 225, 0.3) 35%,
    rgba(200, 200, 220, 0.1) 65%,
    transparent 100%
  );
  filter: blur(20px);
}
.atmos-fog-plane--near {
  background: radial-gradient(ellipse 60% 55% at 50% 50%,
    rgba(230, 210, 200, 0.25) 0%,
    rgba(220, 205, 195, 0.12) 40%,
    transparent 75%
  );
  filter: blur(12px);
}

/* ═══════════════════════ 体积光射线 ═══════════════════════ */
.atmos-light-rays {
  position: absolute;
  width: min(100vw, 900px);
  height: min(100vw, 900px);
  margin-left: calc(min(100vw, 900px) / -2);
  margin-top: calc(min(100vw, 900px) / -2);
  pointer-events: none;
  will-change: transform, opacity;
  opacity: 0.85;
}

.atmos-ray {
  position: absolute;
  top: -20%;
  left: 50%;
  width: 3px;
  height: 140%;
  transform-origin: 50% 50%;
  opacity: 0;

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg,
      rgba(255, 220, 160, 0.7) 0%,
      rgba(255, 200, 140, 0.45) 25%,
      rgba(255, 180, 120, 0.2) 50%,
      rgba(255, 160, 100, 0.05) 75%,
      transparent 100%
    );
    filter: blur(3px);
  }
}

// 5条光线，不同角度和强度
.atmos-ray--1 { transform: rotate(-25deg); opacity: 0.55; width: 2px; }
.atmos-ray--2 { transform: rotate(-10deg); opacity: 0.7;  width: 3px; left: 48%; }
.atmos-ray--3 { transform: rotate(5deg);   opacity: 0.6;  width: 4px; left: 52%; }
.atmos-ray--4 { transform: rotate(20deg);  opacity: 0.45; width: 2px; left: 49%; }
.atmos-ray--5 { transform: rotate(35deg);  opacity: 0.35; width: 3px; left: 51%; }

/* ═══════════════════════ 粒子 ═══════════════════════ */
.atmos-particles {
  position: absolute;
  width: min(80vw, 600px);
  height: min(60vw, 450px);
  margin-left: calc(min(80vw, 600px) / -2);
  margin-top: calc(min(60vw, 450px) / -2);
  pointer-events: none;
  will-change: transform, opacity;
  opacity: 0.55;
}

.atmos-particle {
  --px: 50%;
  --py: 50%;
  --psize: 3px;
  --pduration: 15s;
  --pdelay: 0s;
  --popacity: 0.3;

  position: absolute;
  left: var(--px);
  top: var(--py);
  width: var(--psize);
  height: var(--psize);
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(255, 220, 170, 0.9) 0%,
    rgba(255, 180, 130, 0.5) 40%,
    transparent 70%
  );
  box-shadow:
    0 0 calc(var(--psize) * 3) rgba(255, 200, 150, 0.5),
    0 0 calc(var(--psize) * 6) rgba(255, 180, 140, 0.25);
  opacity: var(--popacity);
  animation: atmos-float var(--pduration) var(--pdelay) infinite ease-in-out;
  will-change: transform, opacity;
}

@keyframes atmos-float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: var(--popacity);
  }
  15% {
    transform: translateY(-15vh) translateX(3vw) scale(1.3);
    opacity: calc(var(--popacity) * 1.4);
  }
  35% {
    transform: translateY(-28vh) translateX(-2vw) scale(0.85);
    opacity: calc(var(--popacity) * 0.7);
  }
  55% {
    transform: translateY(-20vh) translateX(5vw) scale(1.2);
    opacity: calc(var(--popacity) * 1.1);
  }
  75% {
    transform: translateY(-8vh) translateX(-4vw) scale(0.7);
    opacity: calc(var(--popacity) * 0.5);
  }
  100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: var(--popacity);
  }
}

/* ═══════════════════════ 深度指示器 ═══════════════════════ */
.atmos-depth-indicator {
  position: absolute;
  bottom: 10vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.65;
  will-change: transform, opacity;
}
.atmos-depth-indicator__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff8b70, #f5a860);
  box-shadow: 0 0 12px rgba(255, 140, 100, 0.6);
  animation: atmos-dot-pulse 2s ease-in-out infinite;
}
@keyframes atmos-dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.6); opacity: 1; }
}
.atmos-depth-indicator__text {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: #c87060;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 999px;
  padding: 0.28rem 1.1rem;
  border: 1px solid rgba(255, 150, 120, 0.22);
  white-space: nowrap;
}

/* ── 进度条 ── */
.atmos-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 30;
  width: 100%;
  height: 3px;
  background: rgba(255, 160, 130, 0.06);
}
.atmos-progress__fill {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg,
    #ff8b70, #f5b860, #6eb8f0, #a0d8f0,
    #ff8b70, #f5b860
  );
  background-size: 200% 100%;
  box-shadow: 0 0 14px rgba(255, 140, 110, 0.55);
}

/* ═══════════════════════ 响应式 ═══════════════════════ */
@media (max-width: 1024px) {
  .atmos-scene {
    perspective: 900px;
  }
  .atmos-layer__card {
    width: min(78vw, 420px);
    height: min(50vw, 280px);
    margin-left: calc(min(78vw, 420px) / -2);
    margin-top: calc(min(50vw, 280px) / -2);
  }
}

@media (max-width: 768px) {
  .atmos-header { top: 2vh; }
  .atmos-kicker { font-size: 0.52rem; padding: 0.2rem 0.7rem; }
  .atmos-title__char { font-size: 1.8rem; }
  .atmos-subtitle { font-size: 0.66rem; }

  .atmos-scene {
    perspective: 700px;
  }
  .atmos-layer__card {
    width: 82vw;
    height: 54vw;
    margin-left: -41vw;
    margin-top: -27vw;
    border-radius: 12px;
  }
  .atmos-layer__label { font-size: 0.6rem; padding: 0.15rem 0.6rem; bottom: -22px; }

  .atmos-fog-plane {
    width: 95vw;
    height: 70vw;
    margin-left: -47.5vw;
    margin-top: -35vw;
  }

  .atmos-depth-indicator__text { font-size: 0.6rem; padding: 0.2rem 0.7rem; }
}
</style>
