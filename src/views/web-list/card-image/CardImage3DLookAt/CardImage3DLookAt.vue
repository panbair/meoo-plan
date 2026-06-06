<template>
  <section ref="rootRef" class="la-root" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <!-- 环境光 -->
    <div ref="glowA" class="la-glow la-glow--a"></div>
    <div ref="glowB" class="la-glow la-glow--b"></div>

    <!-- 光标辉光追随者 -->
    <div ref="cursorGlow" class="la-cursor-glow"></div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="la-scroll">
      <div ref="trackRef" class="la-track" :style="{ height: trackHeight }">
        <div class="la-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="la-header">
            <span class="la-kicker">◉ CSS3 3D · 视线追踪 · Look-at Effect ◉</span>
            <h1 class="la-title">
              <span ref="tc1" class="la-title__c">视</span>
              <span ref="tc2" class="la-title__c la-title__c--gaze">线</span>
              <span ref="tc3" class="la-title__c">追</span>
              <span ref="tc4" class="la-title__c la-title__c--gaze">踪</span>
            </h1>
            <div ref="dividerRef" class="la-divider"></div>
            <p ref="subRef" class="la-sub">
              移动光标 · CSS变量动态注入 · 3D元素实时注视 · 沉浸式交互
            </p>
          </header>

          <!-- ════════════════ CSS3 3D 视线追踪场景 ════════════════ -->
          <div ref="sceneRef" class="la-scene">
            <div ref="stageRef" class="la-stage">

              <!-- 🔑 中央主眼 (最灵敏的"注视者") -->
              <div
                ref="centerCardRef"
                class="la-card la-card--center"
                :style="centerGazeStyle"
              >
                <div class="la-card__face">
                  <img :src="images.center" alt="中央注视" class="la-card__img" loading="lazy" />
                  <!-- 镜面高光 — 随视线移动 -->
                  <div class="la-card__glint" :style="centerGlintStyle"></div>
                  <!-- 瞳孔/焦点指示器 -->
                  <div class="la-card__pupil" :style="centerPupilStyle"></div>
                </div>
                <!-- 阴影 — 随视线偏移 -->
                <div class="la-card__shadow" :style="centerShadowStyle"></div>
                <span class="la-card__label">PRIMARY.GAZE</span>
              </div>

              <!-- 🔑 环绕卡片 (6张，各有不同的注视个性) -->
              <div
                v-for="(card, i) in orbitCards"
                :key="card.id"
                :ref="el => { orbitRefs[i] = el as HTMLElement | null }"
                class="la-card la-card--orbit"
                :style="orbitGazeStyles[i]"
              >
                <div class="la-card__face">
                  <img :src="card.image" :alt="card.label" class="la-card__img" loading="lazy" />
                  <div class="la-card__glint" :style="orbitGlintStyles[i]"></div>
                </div>
                <div class="la-card__shadow" :style="orbitShadowStyles[i]"></div>
                <span class="la-card__label">{{ card.label }}</span>
              </div>

            </div>
          </div>

          <!-- 追踪状态 -->
          <div ref="trackStatus" class="la-status">
            <span class="la-status__pulse"></span>
            <span class="la-status__text">
              追踪中 · X:{{ Math.round(gazeX * 100) / 100 }} Y:{{ Math.round(gazeY * 100) / 100 }}
            </span>
          </div>

          <div class="la-progress"><div ref="progRef" class="la-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DLookAt — CSS3 3D 沉浸式视线追踪 (Look-at Effect)
//
//  核心创新：CSS变量桥接JS → 3D元素实时"注视"光标
//
//  视线追踪技术栈：
//  1. JS mousemove → 计算光标相对元素中心的偏移
//  2. 偏移量映射为 3D 旋转增量 (rotateX / rotateY)
//  3. CSS变量 --gaze-x / --gaze-y 动态注入每个元素
//  4. CSS transform: rotateX(var(--gx)) rotateY(var(--gy))
//  5. CSS transition 平滑追踪 (不同元素不同延迟 → 个性)
//  6. 镜面高光 + 阴影随视线方向联动偏移
//  7. 光标辉光追随者 (绝对定位div跟随鼠标)
//  8. 距离衰减 — 远处元素注视强度减弱
//
//  设计风格：暗色科技感 · 青蓝/品红点缀 · 沉浸式交互
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const images = {
  center: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
}

interface OrbitCard {
  id: number
  label: string
  image: string
  baseStyle: Record<string, string>
  // 🔑 注视个性参数
  followSpeed: number   // 追踪速度倍率 (1=即时, 0.3=慵懒)
  maxAngle: number      // 最大旋转角度
  reactDistance: number // 反应距离阈值 (0-1, 越小越近才反应)
}

const orbitCards: OrbitCard[] = [
  {
    id: 0, label: 'SWIFT.GAZE', followSpeed: 1, maxAngle: 28, reactDistance: 0,
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80',
    baseStyle: { transform: 'translateZ(-160px) translateY(-22vh) translateX(-18vw)' },
  },
  {
    id: 1, label: 'CALM.WATCH', followSpeed: 0.5, maxAngle: 20, reactDistance: 0,
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',
    baseStyle: { transform: 'translateZ(-80px) translateY(-16vh) translateX(16vw)' },
  },
  {
    id: 2, label: 'SHY.PEEK', followSpeed: 0.25, maxAngle: 12, reactDistance: 0.15,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    baseStyle: { transform: 'translateZ(-40px) translateY(2vh) translateX(-20vw)' },
  },
  {
    id: 3, label: 'KEEN.STARE', followSpeed: 0.8, maxAngle: 25, reactDistance: 0,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    baseStyle: { transform: 'translateZ(40px) translateY(4vh) translateX(18vw)' },
  },
  {
    id: 4, label: 'LAZY.GLANCE', followSpeed: 0.35, maxAngle: 14, reactDistance: 0.08,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',
    baseStyle: { transform: 'translateZ(80px) translateY(20vh) translateX(-14vw)' },
  },
  {
    id: 5, label: 'CURIOUS.TILT', followSpeed: 0.65, maxAngle: 22, reactDistance: 0,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    baseStyle: { transform: 'translateZ(120px) translateY(22vh) translateX(10vw)' },
  },
]

const ORBIT_COUNT = orbitCards.length
const trackHeight = '400vh'

// ── 注视状态 (CSS变量值) ──
const gazeX = ref(0)
const gazeY = ref(0)
const gazeActive = ref(false)

// 中央卡片注视样式
const centerGazeStyle = reactive<Record<string, string>>({})
const centerGlintStyle = reactive<Record<string, string>>({})
const centerPupilStyle = reactive<Record<string, string>>({})
const centerShadowStyle = reactive<Record<string, string>>({})

// 环绕卡片注视样式 (数组)
const orbitGazeStyles = reactive<Record<string, string>[]>(Array.from({ length: ORBIT_COUNT }, () => ({})))
const orbitGlintStyles = reactive<Record<string, string>[]>(Array.from({ length: ORBIT_COUNT }, () => ({})))
const orbitShadowStyles = reactive<Record<string, string>[]>(Array.from({ length: ORBIT_COUNT }, () => ({})))

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const centerCardRef = ref<HTMLElement | null>(null)
const orbitRefs = ref<(HTMLElement | null)[]>(Array(ORBIT_COUNT).fill(null))
const cursorGlow = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const trackStatus = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 🔑 视线追踪引擎 ═══════════════════════
let rafId = 0
let targetGazeX = 0
let targetGazeY = 0
let currentGazeX = 0
let currentGazeY = 0

function onMouseMove(e: MouseEvent) {
  // 🔑 计算光标相对于视口中心的位置 (-1 ~ 1)
  targetGazeX = (e.clientX / window.innerWidth - 0.5) * 2
  targetGazeY = (e.clientY / window.innerHeight - 0.5) * 2
  gazeActive.value = true

  // 🔑 光标辉光即时跟随
  if (cursorGlow.value) {
    cursorGlow.value.style.left = `${e.clientX}px`
    cursorGlow.value.style.top = `${e.clientY}px`
    cursorGlow.value.style.opacity = '0.7'
  }
}

function onMouseLeave() {
  gazeActive.value = false
  if (cursorGlow.value) cursorGlow.value.style.opacity = '0'
}

// 🔑 平滑追踪循环 — 使用缓动让注视更自然
function gazeLoop() {
  // 平滑插值 (lerp) — 模拟眼球运动的自然惯性
  const lerpFactor = 0.12
  currentGazeX += (targetGazeX - currentGazeX) * lerpFactor
  currentGazeY += (targetGazeY - currentGazeY) * lerpFactor

  if (!gazeActive.value) {
    // 鼠标离开 — 缓慢回归中心
    currentGazeX += (0 - currentGazeX) * 0.04
    currentGazeY += (0 - currentGazeY) * 0.04
    if (Math.abs(currentGazeX) < 0.001 && Math.abs(currentGazeY) < 0.001) {
      currentGazeX = 0; currentGazeY = 0
    }
  }

  gazeX.value = currentGazeX
  gazeY.value = currentGazeY

  // 🔑 中央卡片 — 最大注视角度 ±35°, CSS变量注入
  const cx = currentGazeX * 35
  const cy = currentGazeY * 30
  centerGazeStyle['--gx'] = `${cy.toFixed(3)}deg`   // rotateX (上下)
  centerGazeStyle['--gy'] = `${cx.toFixed(3)}deg`   // rotateY (左右)
  centerGazeStyle['--gi'] = '1'

  // 镜面高光偏移 — 光标方向驱赶高光到对面
  centerGlintStyle['--glint-x'] = `${-currentGazeX * 40}%`
  centerGlintStyle['--glint-y'] = `${-currentGazeY * 35}%`

  // 瞳孔偏移 — 在卡片表面移动
  centerPupilStyle['--pupil-x'] = `${currentGazeX * 18}px`
  centerPupilStyle['--pupil-y'] = `${currentGazeY * 14}px`

  // 阴影偏移 — 与视线方向一致
  centerShadowStyle['--sx'] = `${-currentGazeX * 14}px`
  centerShadowStyle['--sy'] = `${currentGazeY * 10}px`
  centerShadowStyle['--sb'] = `${6 + Math.abs(currentGazeX) * 10}px`

  // 🔑 环绕卡片 — 各有注视个性
  for (let i = 0; i < ORBIT_COUNT; i++) {
    const card = orbitCards[i]

    // 距离衰减：基于卡片位置计算与光标的"感知距离"
    const bx = parseFloat(String(card.baseStyle.transform).match(/translateX\(([-\d.]+)v/)?.[1] || '0')
    const by = parseFloat(String(card.baseStyle.transform).match(/translateY\(([-\d.]+)v/)?.[1] || '0')
    // 卡片在视口中的大致位置
    const cardScreenX = 0.5 + bx / 100
    const cardScreenY = 0.5 + by / 100
    // 光标到卡片的距离
    const distX = targetGazeX * 0.5 - (cardScreenX - 0.5)
    const distY = targetGazeY * 0.5 - (cardScreenY - 0.5)
    const distance = Math.sqrt(distX * distX + distY * distY)

    // 🔑 反应距离阈值 — 太远不反应 (SHY.PEEK个性)
    const intensity = distance < card.reactDistance + 0.5
      ? Math.max(0, 1 - distance / (card.reactDistance + 0.5))
      : Math.max(0, 1 - distance)

    const ox = currentGazeX * card.maxAngle * intensity
    const oy = currentGazeY * card.maxAngle * 0.85 * intensity

    // 🔑 构建完整 transform：基础3D位置 + 视线旋转（必须在JS中拼接）
    const baseT = card.baseStyle.transform
    orbitGazeStyles[i]['transform'] = `${baseT} rotateX(${oy.toFixed(3)}deg) rotateY(${ox.toFixed(3)}deg)`
    // 🔑 不同追踪速度 → 通过 CSS transition-duration 实现
    orbitGazeStyles[i]['transition'] = `transform ${(0.6 / card.followSpeed).toFixed(2)}s cubic-bezier(0.23, 1, 0.32, 1)`

    orbitGlintStyles[i]['--glint-x'] = `${-ox * 1.2}%`
    orbitGlintStyles[i]['--glint-y'] = `${-oy * 1.1}%`

    orbitShadowStyles[i]['--sx'] = `${-ox * 0.4}px`
    orbitShadowStyles[i]['--sy'] = `${oy * 0.3}px`
    orbitShadowStyles[i]['--sb'] = `${4 + intensity * 8}px`
  }

  rafId = requestAnimationFrame(gazeLoop)
}

// ═══════════════════════ 入场动画 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)

  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' },
  })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: 0.3, filter: 'blur(8px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.08, ease: 'back.out(1.8)' }, '-=0.35')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.2')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10, filter: 'blur(3px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power2.out' }, '-=0.1')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, '-=0.3')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 滚动深度动画 ═══════════════════════
function setupScrollDepth() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value

  gsap.set(stage, { rotateX: 0, rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5 },
  })

  // 场景随滚动微倾 + 卡片拉近
  master.to(stage, { rotateX: 8, rotateY: -6, duration: 1.5, ease: 'power2.inOut' }, 0)
  master.to(stage, { rotateX: -5, rotateY: 8, duration: 1.5, ease: 'power2.inOut' }, 2)
  master.to(stage, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power2.inOut' }, 3.5)

  // 中央卡片拉近
  if (centerCardRef.value) {
    master.to(centerCardRef.value, { translateZ: 60, duration: 2, ease: 'power2.inOut' }, 1)
    master.to(centerCardRef.value, { translateZ: 0, duration: 2, ease: 'power2.inOut' }, 3)
  }

  if (glowA.value) master.to(glowA.value, { x: '6vw', y: '-3vh', duration: 4 }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-4vw', y: '4vh', duration: 4 }, 0)

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 4 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupScrollDepth() }))
  window.addEventListener('resize', handleResize)
  rafId = requestAnimationFrame(gazeLoop)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(rafId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 暗色科技环境 ═══════════════════════ */
.la-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 60% 50% at 50% 45%, #14121a 0%, #0c0a10 60%, #060508 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 环境光 ── */
.la-glow { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; will-change: transform; z-index: 0; }
.la-glow--a { width: 32vw; height: 32vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(80,180,240,.15) 0%, transparent 70%); }
.la-glow--b { width: 28vw; height: 28vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(200,100,220,.12) 0%, transparent 70%); }

/* ── 光标辉光追随者 ── */
.la-cursor-glow {
  position: fixed; z-index: 40; pointer-events: none;
  width: 160px; height: 160px; margin-left: -80px; margin-top: -80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100,200,255,.12) 0%, rgba(80,160,240,.06) 30%, transparent 60%);
  filter: blur(20px);
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

/* ── 滚动 ── */
.la-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(100,180,220,.15); }
}
.la-track { position: relative; width: 100%; }
.la-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.la-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 35; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.la-kicker { display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .26em; color: rgba(120,190,230,.7); background: rgba(80,160,220,.06); backdrop-filter: blur(8px); border: 1px solid rgba(80,180,230,.15); border-radius: 999px; padding: .22rem 1.1rem; margin-bottom: .5rem; }
.la-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.la-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #7ab8e0; will-change: transform,opacity,filter;
  &--gaze {
    background: linear-gradient(150deg, #5ab8f0 0%, #a0d8ff 25%, #b060e0 55%, #d090f0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 10px rgba(100,180,240,.5));
  }
}
.la-divider { width: 110px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #5ab8f0, #b060e0, #5ab8f0, transparent); transform-origin: center; }
.la-sub { margin: 0; font-size: clamp(.66rem, 1vw, .82rem); color: rgba(120,180,210,.4); max-width: 480px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 场景 ═══════════════════════ */
.la-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1000px;
  perspective-origin: 50% 45%;
  will-change: transform, opacity;
}
.la-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════════════ 注视卡片 (通用) ═══════════════════════ */
.la-card {
  position: absolute; transform-style: preserve-3d;
  will-change: transform;
}
.la-card__face {
  position: absolute; overflow: hidden;
  background: #1a1822;
  box-shadow: 0 12px 40px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.06);
}
.la-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.la-card__label {
  position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); z-index: 4;
  font-size: .56rem; font-weight: 700; letter-spacing: .2em; white-space: nowrap;
  color: rgba(120,190,230,.6); font-family: 'Courier New', monospace;
  background: rgba(20,18,30,.6); backdrop-filter: blur(6px);
  border-radius: 999px; padding: .12rem .7rem;
  border: 1px solid rgba(80,180,220,.12);
}

/* ── 镜面高光 (随视线偏移) ── */
.la-card__glint {
  position: absolute; inset: 0; pointer-events: none; z-index: 3;
  --glint-x: 0%; --glint-y: 0%;
  background: radial-gradient(ellipse 25% 18% at calc(50% + var(--glint-x)) calc(50% + var(--glint-y)),
    rgba(255,255,255,.18) 0%, rgba(255,255,255,.05) 30%, transparent 60%);
}

/* ── 阴影 (随视线偏移) ── */
.la-card__shadow {
  --sx: 0px; --sy: 0px; --sb: 6px;
  position: absolute; z-index: -1;
  background: rgba(0,0,0,.5);
  border-radius: inherit;
  filter: blur(var(--sb));
  transform: translate(var(--sx), var(--sy));
}

/* ═══════════════════════ 🔑 中央主卡 ═══════════════════════ */
.la-card--center {
  --gx: 0deg; --gy: 0deg; --gi: 0;
  z-index: 20;
  // 🔑 CSS变量驱动3D旋转
  transform: translateZ(0px)
    rotateX(var(--gx))
    rotateY(var(--gy));
  // 🔑 极快响应 — 即时注视
  transition: transform 0.15s cubic-bezier(0.23, 1, 0.32, 1);
}
.la-card--center .la-card__face {
  width: min(38vw, 300px); height: min(50vw, 400px);
  margin-left: calc(min(38vw, 300px) / -2);
  margin-top: calc(min(50vw, 400px) / -2);
  border-radius: 16px;
}
.la-card--center .la-card__shadow {
  width: min(38vw, 300px); height: min(50vw, 400px);
  margin-left: calc(min(38vw, 300px) / -2);
  margin-top: calc(min(50vw, 400px) / -2);
  border-radius: 16px;
}

/* 🔑 瞳孔指示器 — 在中央卡片上移动的小圆点 */
.la-card__pupil {
  --pupil-x: 0px; --pupil-y: 0px;
  position: absolute; z-index: 5; pointer-events: none;
  width: 10px; height: 10px; border-radius: 50%;
  top: calc(50% + var(--pupil-y)); left: calc(50% + var(--pupil-x));
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(100,200,255,.8) 0%, rgba(80,160,240,.4) 40%, transparent 70%);
  box-shadow: 0 0 12px rgba(100,200,255,.5), 0 0 30px rgba(80,160,240,.25);
  transition: top 0.2s ease-out, left 0.2s ease-out;
}

/* ═══════════════════════ 🔑 环绕卡片 ═══════════════════════ */
.la-card--orbit {
  z-index: 12;
}

.la-card--orbit .la-card__face {
  width: min(26vw, 200px); height: min(18vw, 140px);
  margin-left: calc(min(26vw, 200px) / -2);
  margin-top: calc(min(18vw, 140px) / -2);
  border-radius: 10px;
}
.la-card--orbit .la-card__shadow {
  width: min(26vw, 200px); height: min(18vw, 140px);
  margin-left: calc(min(26vw, 200px) / -2);
  margin-top: calc(min(18vw, 140px) / -2);
  border-radius: 10px;
}

/* ── 追踪状态指示 ── */
.la-status { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 30; pointer-events: none; display: flex; align-items: center; gap: .4rem; opacity: .65; }
.la-status__pulse { width: 7px; height: 7px; border-radius: 50%; background: #5ab8f0; box-shadow: 0 0 10px rgba(90,180,240,.6); animation: la-pulse 1.5s ease-in-out infinite; }
@keyframes la-pulse { 0%,100% { transform: scale(1); opacity: .6; } 50% { transform: scale(1.5); opacity: 1; } }
.la-status__text { font-size: .58rem; font-weight: 600; letter-spacing: .12em; color: #7ab8e0; font-family: 'Courier New', monospace; background: rgba(20,18,30,.6); backdrop-filter: blur(8px); border-radius: 999px; padding: .18rem .8rem; border: 1px solid rgba(80,180,220,.15); white-space: nowrap; }

.la-progress { position: absolute; left: 0; bottom: 0; z-index: 35; width: 100%; height: 2px; background: rgba(80,180,220,.03); }
.la-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #5ab8f0, #b060e0, #5ab8f0); box-shadow: 0 0 8px rgba(90,180,240,.3); }

@media (max-width: 768px) {
  .la-header { top: 2vh; } .la-kicker { font-size: .44rem; } .la-title__c { font-size: 1.6rem; }
  .la-scene { perspective: 700px; }
  .la-card--center .la-card__face { width: 50vw; height: 66vw; margin-left: -25vw; margin-top: -33vw; }
  .la-card--orbit .la-card__face { width: 34vw; height: 24vw; margin-left: -17vw; margin-top: -12vw; }
}
</style>
