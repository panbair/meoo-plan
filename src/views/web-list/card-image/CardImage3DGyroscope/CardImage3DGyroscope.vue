<template>
  <section ref="rootRef" class="gyr-root">
    <!-- 太空背景 -->
    <div ref="starField" class="gyr-stars"></div>
    <div ref="nebulaA" class="gyr-nebula gyr-nebula--a"></div>
    <div ref="nebulaB" class="gyr-nebula gyr-nebula--b"></div>
    <!-- 背景星盘影像 -->
    <div ref="bgPlate" class="gyr-bg-plate">
      <img :src="bgPlateImage" alt="背景星图" class="gyr-bg-plate__img" />
      <div class="gyr-bg-plate__fade"></div>
    </div>

    <div ref="scrollRef" class="gyr-scroll">
      <div ref="trackRef" class="gyr-track" :style="{ height: trackHeight }">
        <div class="gyr-sticky">

          <header ref="headerRef" class="gyr-header">
            <span class="gyr-kicker">◎ CSS3 3D Gyroscope · 图片星盘仪 ◎</span>
            <h1 class="gyr-title">
              <span ref="tc1" class="gyr-title__c">星</span>
              <span ref="tc2" class="gyr-title__c gyr-title__c--spin">盘</span>
              <span ref="tc3" class="gyr-title__c">仪</span>
              <span ref="tc4" class="gyr-title__c gyr-title__c--spin">转</span>
            </h1>
            <div ref="lineRef" class="gyr-line"></div>
            <p class="gyr-sub">向下滚动 · 三环嵌套旋转 · 核心影像 · 环载图片 · 卫星轨道</p>
          </header>

          <!-- 🔑 陀螺仪场景 -->
          <div ref="sceneRef" class="gyr-scene">
            <div ref="gyroRef" class="gyr-gyro">

              <!-- === 最外环 — 绕X轴 + 4幅全景图嵌在环上 === -->
              <div ref="outerRing" class="gyr-ring gyr-ring--outer">
                <!-- 环面 — 4幅图在四个方向 -->
                <div class="gyr-ring__panel gyr-ring__panel--0">
                  <img :src="ringImages[0]" alt="环图1" class="gyr-ring__panel-img" />
                </div>
                <div class="gyr-ring__panel gyr-ring__panel--1">
                  <img :src="ringImages[1]" alt="环图2" class="gyr-ring__panel-img" />
                </div>
                <div class="gyr-ring__panel gyr-ring__panel--2">
                  <img :src="ringImages[2]" alt="环图3" class="gyr-ring__panel-img" />
                </div>
                <div class="gyr-ring__panel gyr-ring__panel--3">
                  <img :src="ringImages[3]" alt="环图4" class="gyr-ring__panel-img" />
                </div>
                <div class="gyr-ring__track gyr-ring__track--outer"></div>
              </div>

              <!-- === 中环 — 绕Y轴 + 6幅小图环绕 === -->
              <div ref="midRing" class="gyr-ring gyr-ring--mid">
                <div
                  class="gyr-ring__thumb"
                  v-for="t in 6" :key="'mt'+t"
                  :style="{ '--angle': (t-1)*60+'deg' }"
                >
                  <img :src="ringImages[(t+3)%6]" alt="缩略图" class="gyr-ring__thumb-img" />
                </div>
                <div class="gyr-ring__track gyr-ring__track--mid"></div>
              </div>

              <!-- === 内环 — 绕Z轴 + 核心大图 + 6张小图在环周 === -->
              <div ref="innerRing" class="gyr-ring gyr-ring--inner">
                <!-- 核心大图 -->
                <div class="gyr-core">
                  <img :src="coreImage" alt="核心影像" class="gyr-core__img" />
                  <div class="gyr-core__shine"></div>
                  <div class="gyr-core__label">{{ currentCoreLabel }}</div>
                </div>
                <!-- 环周6张缩略图 -->
                <div
                  class="gyr-ring__sat"
                  v-for="s in 6" :key="'is'+s"
                  :style="{ '--angle': (s-1)*60+'deg' }"
                >
                  <img :src="ringImages[(s+1)%6]" alt="卫星图" class="gyr-ring__sat-img" />
                </div>
                <div class="gyr-ring__track gyr-ring__track--inner"></div>
              </div>

              <!-- === 8颗自由轨道卫星 — 在3D空间中独立悬浮 === -->
              <div
                v-for="orb in orbitingSatellites"
                :key="'orb'+orb.id"
                :ref="(el) => setOrbiterRef(el as HTMLElement, orb.id)"
                class="gyr-orbiter"
              >
                <img :src="orb.image" :alt="orb.alt" class="gyr-orbiter__img" />
                <div class="gyr-orbiter__trail"></div>
              </div>

              <!-- 轴十字 -->
              <div class="gyr-axes">
                <div class="gyr-axis gyr-axis--x"></div>
                <div class="gyr-axis gyr-axis--y"></div>
              </div>
            </div>
          </div>

          <!-- 信息面板 -->
          <div ref="infoPanel" class="gyr-info">
            <div class="gyr-info__item">外环<span class="gyr-info__val">{{ rx }}°</span></div>
            <div class="gyr-info__item gyr-info__item--core">核心<span class="gyr-info__val gyr-info__val--highlight">{{ currentCoreLabel }}</span></div>
            <div class="gyr-info__item">内环<span class="gyr-info__val">{{ rz }}°</span></div>
          </div>

          <div class="gyr-progress"><div ref="progRef" class="gyr-progress__fill"></div></div>
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

// ═══════════════════════════════════════════════════════════════════
//  CardImage3DGyroscope — CSS3 3D 图片星盘仪
//
//  重新设计 — 图片成为核心元素：
//  1. 核心：大尺寸圆形图片（ø140px），随内环绕Z轴自转
//  2. 外环：4幅全景图嵌在环的四个方向（0°/90°/180°/270°）
//  3. 中环：6幅缩略图环绕排列（60°间隔）
//  4. 内环：核心大图 + 6张卫星缩略图（60°间隔）
//  5. 8颗自由轨道卫星：小图卡片在3D空间中独立悬浮旋转
//  6. 背景星盘：一张超大星云图在后方，随scroll浮现
//
//  青春时尚配色：电光蓝 · 霓虹青 · 紫罗兰 · 星光银
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const ringImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
]

const coreImage = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&q=80'
const bgPlateImage = 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80'

const coreLabels = ['银河', '极光', '星空', '日出', '花海', '麦田']
const currentCoreLabel = ref('银河')

// 8颗自由轨道卫星
const orbiterImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=300&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=300&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=80',
]

const orbitingSatellites = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  image: orbiterImages[i],
  alt: `卫星${i + 1}`,
  // 每颗卫星在不同高度/半径的轨道
  orbitRadius: 160 + i * 25,   // 轨道半径
  orbitTilt: (i - 4) * 20,     // 轨道倾斜
  startAngle: i * 45,          // 初始角度
}))

const trackHeight = `${7 * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const gyroRef = ref<HTMLElement | null>(null)
const outerRing = ref<HTMLElement | null>(null)
const midRing = ref<HTMLElement | null>(null)
const innerRing = ref<HTMLElement | null>(null)
const bgPlate = ref<HTMLElement | null>(null)
const starField = ref<HTMLElement | null>(null)
const nebulaA = ref<HTMLElement | null>(null)
const nebulaB = ref<HTMLElement | null>(null)
const infoPanel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const orbiterRefs = ref<(HTMLElement | null)[]>([])
const rx = ref(0); const ry = ref(0); const rz = ref(0)
const cleanupFns: TweenCleanup[] = []

function setOrbiterRef(el: HTMLElement | null, idx: number) { orbiterRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, rotateX: 90, scale: 0.3 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(2.5)' }, '-=0.5')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.3')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.5, rotateZ: 45 }, { autoAlpha: 1, scale: 1, rotateZ: 0, duration: 1.1, ease: 'power4.out' }, '-=0.5')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupGyroscope() {
  if (!scrollRef.value || !trackRef.value || !gyroRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  const outer = outerRing.value; const mid = midRing.value
  const inner = innerRing.value

  // 初始
  if (outer) gsap.set(outer, { rotateX: 0 })
  if (mid) gsap.set(mid, { rotateY: 0 })
  if (inner) gsap.set(inner, { rotateZ: 0 })

  // 轨道卫星初始位置 — 分散在3D空间
  const orbiters = orbiterRefs.value.filter(Boolean) as HTMLElement[]
  orbiters.forEach((el, i) => {
    const sat = orbitingSatellites[i]
    const angleRad = (sat.startAngle * Math.PI) / 180
    const x = Math.cos(angleRad) * sat.orbitRadius
    const z = Math.sin(angleRad) * sat.orbitRadius - 200
    const y = sat.orbitTilt
    gsap.set(el, { x, y, translateZ: z, scale: 0.8, opacity: 0.55 })
  })

  // 背景星盘
  if (bgPlate.value) gsap.set(bgPlate.value, { translateZ: -500, scale: 1.5, opacity: 0.2 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        rx.value = Math.round(self.progress * 360)
        ry.value = Math.round(self.progress * 540)
        rz.value = Math.round(self.progress * 720)
        currentCoreLabel.value = coreLabels[Math.floor(self.progress * coreLabels.length) % coreLabels.length]
      },
    },
  })

  // 🔄 三环独立旋转
  if (outer) master.to(outer, { rotateX: 360, duration: 6, ease: 'sine.inOut' }, 0)
  if (mid) master.to(mid, { rotateY: 540, duration: 6, ease: 'sine.inOut' }, 0)
  if (inner) master.to(inner, { rotateZ: 720, duration: 6, ease: 'sine.inOut' }, 0)

  // 🛰️ 自由轨道卫星 — 每颗沿自己的3D轨道运动
  orbiters.forEach((el, i) => {
    const sat = orbitingSatellites[i]
    // 轨道运动：在XY平面做圆周 + Z轴前后摆动
    const angleRadStart = (sat.startAngle * Math.PI) / 180
    const angleRadEnd = angleRadStart + Math.PI * 3 // 1.5圈

    // 用GSAP同时驱动X/Y/Z实现3D轨道
    master.fromTo(el,
      {
        x: Math.cos(angleRadStart) * sat.orbitRadius,
        y: sat.orbitTilt,
        translateZ: Math.sin(angleRadStart) * sat.orbitRadius - 200,
        scale: 0.75, opacity: 0.5,
      },
      {
        x: Math.cos(angleRadEnd) * (sat.orbitRadius + 40),
        y: sat.orbitTilt + (i % 2 === 0 ? 30 : -30),
        translateZ: Math.sin(angleRadEnd) * sat.orbitRadius,
        scale: 0.85, opacity: 0.8,
        duration: 6, ease: 'sine.inOut',
      },
      0
    )
  })

  // 背景星盘渐显
  if (bgPlate.value) {
    master.to(bgPlate.value, { translateZ: -300, scale: 1.2, opacity: 0.5, duration: 3, ease: 'power2.in' }, 0)
    master.to(bgPlate.value, { translateZ: -150, scale: 1, opacity: 0.7, duration: 3, ease: 'power2.out' }, 3)
  }

  // 整体视角
  if (gyroRef.value) {
    master.to(gyroRef.value, { rotateX: 12, rotateY: -5, duration: 3, ease: 'sine.inOut' }, 0)
    master.to(gyroRef.value, { rotateX: -8, rotateY: 8, duration: 3, ease: 'sine.inOut' }, 3)
  }

  // 背景
  if (starField.value) master.to(starField.value, { scale: 1.15, opacity: 0.85, duration: 6 }, 0)
  if (nebulaA.value) master.to(nebulaA.value, { x: '-8vw', opacity: 0.5, duration: 6 }, 0)
  if (nebulaB.value) master.to(nebulaB.value, { x: '6vw', opacity: 0.4, duration: 6 }, 0)

  if (infoPanel.value) master.fromTo(infoPanel.value, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.3)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 6 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupGyroscope() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.gyr-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: radial-gradient(ellipse at 50% 50%, #0d1028 0%, #080b1c 50%, #040610 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }

.gyr-stars { position: absolute; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.6), transparent), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,.4), transparent), radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,.5), transparent), radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,.3), transparent), radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,.5), transparent), radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,.4), transparent); background-size: 200px 200px; will-change: transform,opacity; }
.gyr-nebula { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; will-change: transform,opacity;
  &--a { width: 45vw; height: 35vw; top: 10vh; left: 8vw; background: radial-gradient(ellipse, rgba(60,120,220,.2) 0%, transparent 70%); }
  &--b { width: 40vw; height: 30vw; bottom: 8vh; right: 5vw; background: radial-gradient(ellipse, rgba(40,200,180,.15) 0%, transparent 70%); }
}

/* 背景星盘 */
.gyr-bg-plate {
  position: absolute; top: 50%; left: 50%;
  width: min(72vw, 600px); height: min(54vw, 450px);
  margin-left: calc(min(72vw, 600px) / -2);
  margin-top: calc(min(54vw, 450px) / -2);
  z-index: 1; pointer-events: none;
  border-radius: 50%; overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  &__img { width: 100%; height: 100%; object-fit: cover; }
  &__fade { position: absolute; inset: 0; background: radial-gradient(circle, transparent 20%, rgba(5,8,20,.5) 55%, rgba(4,6,16,.85) 75%, rgba(4,6,16,1) 100%); }
}

.gyr-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(80,140,220,.2); &:hover { background: rgba(80,140,220,.4); } }
}
.gyr-track { position: relative; width: 100%; }
.gyr-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.gyr-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.gyr-kicker { display: inline-block; font-size: .6rem; font-weight: 700; letter-spacing: .3em; text-transform: uppercase; color: rgba(120,180,240,.7); background: rgba(60,120,220,.08); backdrop-filter: blur(8px); border: 1px solid rgba(80,140,220,.16); border-radius: 999px; padding: .24rem 1rem; margin-bottom: .5rem; }
.gyr-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.gyr-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #78b0e8; will-change: transform,opacity;
  &--spin { background: linear-gradient(135deg, #78b0e8, #50d0b8, #a088e0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 18px rgba(80,150,230,.6)); }
}
.gyr-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #78b0e8, #50d0b8, #a088e0, transparent); transform-origin: center; }
.gyr-sub { margin: 0; font-size: clamp(.66rem, .9vw, .8rem); color: rgba(120,170,220,.3); max-width: 580px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 陀螺仪 ═══════════════════════ */
.gyr-scene {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  z-index: 10;
  perspective: 700px;
  perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.gyr-gyro {
  position: relative; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

$outerDia: min(54vw, 460px);
$midDia:   min(40vw, 340px);
$innerDia: min(26vw, 220px);

/* ═══════════ 陀螺环基础 ═══════════ */
.gyr-ring {
  position: absolute; border-radius: 50%;
  transform-style: preserve-3d;
  will-change: transform;

  &__track {
    position: absolute; inset: 0; border-radius: 50%; pointer-events: none;
    &--outer { border: 3px solid rgba(80,140,230,.45); box-shadow: 0 0 30px rgba(80,140,230,.2), inset 0 0 20px rgba(80,140,230,.04); }
    &--mid { border: 2px solid rgba(60,200,170,.45); box-shadow: 0 0 22px rgba(60,200,170,.18), inset 0 0 14px rgba(60,200,170,.04); }
    &--inner { border: 2px solid rgba(160,130,230,.45); box-shadow: 0 0 18px rgba(160,130,230,.2); }
  }

  // 外环
  &--outer {
    width: $outerDia; height: $outerDia;
    margin-left: calc($outerDia / -2); margin-top: calc($outerDia / -2);
  }

  // 中环
  &--mid {
    width: $midDia; height: $midDia;
    margin-left: calc($midDia / -2); margin-top: calc($midDia / -2);
  }

  // 内环
  &--inner {
    width: $innerDia; height: $innerDia;
    margin-left: calc($innerDia / -2); margin-top: calc($innerDia / -2);
  }
}

/* ═══════════ 外环4幅全景面板 ═══════════ */
$outerR: calc($outerDia / 2);
.gyr-ring__panel {
  position: absolute; width: min(12vw, 100px); height: min(9vw, 75px);
  border-radius: 6px; overflow: hidden;
  box-shadow: 0 0 20px rgba(80,140,230,.25);
  backface-visibility: visible;

  // 四个方向面板 — 用三角函数定位在环上
  &--0 { top: calc(50% - min(9vw, 75px) - 10px); left: 50%; transform: translate(-50%, -50%); } // 上(0°)
  &--1 { top: 50%; left: calc(50% + $outerR - 10px); transform: translate(-50%, -50%); }           // 右(90°)
  &--2 { top: calc(50% + $outerR - 10px); left: 50%; transform: translate(-50%, -50%); }           // 下(180°)
  &--3 { top: 50%; left: calc(50% - $outerR + 10px); transform: translate(-50%, -50%); }           // 左(270°)

  &-img { width: 100%; height: 100%; object-fit: cover; display: block; }
}

/* ═══════════ 中环6幅缩略图 ═══════════ */
$midR: calc($midDia / 2);
.gyr-ring__thumb {
  position: absolute; top: 50%; left: 50%;
  width: min(8vw, 64px); height: min(8vw, 64px);
  margin-left: min(calc(8vw / -2), -32px);
  margin-top: calc($midR * -1);
  border-radius: 50%; overflow: hidden;
  transform-origin: 50% $midR;
  transform: translateY(-50%) rotate(var(--angle));
  box-shadow: 0 0 14px rgba(60,200,170,.3), 0 0 0 2px rgba(60,200,170,.35);
  &-img { width: 100%; height: 100%; object-fit: cover; display: block; }
}

/* ═══════════ 内环核心+卫星 ═══════════ */
$innerR: calc($innerDia / 2);
.gyr-core {
  position: absolute; inset: 24px; border-radius: 50%; overflow: hidden;
  box-shadow: 0 0 40px rgba(160,130,230,.4), 0 0 80px rgba(160,130,230,.15), 0 0 0 3px rgba(255,255,255,.15);
  z-index: 5;
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__shine {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.2) 0%, transparent 45%);
    pointer-events: none;
  }
  &__label {
    position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); z-index: 3;
    font-size: .6rem; font-weight: 700; letter-spacing: .16em;
    color: #fff; background: rgba(0,0,0,.35); backdrop-filter: blur(4px);
    border-radius: 999px; padding: .1rem .7rem;
    text-shadow: 0 1px 4px rgba(0,0,0,.5);
  }
}

// 内环卫星缩略图
.gyr-ring__sat {
  position: absolute; top: 50%; left: 50%;
  width: min(7vw, 56px); height: min(7vw, 56px);
  margin-left: min(calc(7vw / -2), -28px);
  margin-top: calc($innerR * -1);
  border-radius: 8px; overflow: hidden;
  transform-origin: 50% $innerR;
  transform: translateY(-50%) rotate(var(--angle));
  box-shadow: 0 0 12px rgba(160,130,230,.3), 0 0 0 1px rgba(255,255,255,.12);
  z-index: 4;
  &-img { width: 100%; height: 100%; object-fit: cover; display: block; }
}

/* ═══════════ 自由轨道卫星 ═══════════ */
.gyr-orbiter {
  position: absolute; top: 50%; left: 50%;
  width: min(9vw, 72px); height: min(6.5vw, 54px);
  margin-left: calc(min(9vw, 72px) / -2);
  margin-top: calc(min(6.5vw, 54px) / -2);
  transform-style: preserve-3d;
  will-change: transform, opacity;
  border-radius: 6px; overflow: hidden;
  box-shadow: 0 0 20px rgba(120,180,240,.25), 0 0 0 1px rgba(255,255,255,.1);
  z-index: 15;
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__trail {
    position: absolute; inset: -2px;
    border-radius: 6px;
    box-shadow: 0 0 12px rgba(80,160,240,.3);
    pointer-events: none;
  }
}

/* 轴十字 */
.gyr-axes {
  position: absolute; width: 0; height: 0; pointer-events: none;
  .gyr-axis {
    position: absolute; background: rgba(255,255,255,.06);
    &--x { width: calc($outerDia + 30px); height: 1px; margin-left: calc(($outerDia + 30px) / -2); }
    &--y { width: 1px; height: calc($outerDia + 30px); margin-top: calc(($outerDia + 30px) / -2); }
  }
}

/* 信息面板 */
.gyr-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; gap: 1.4rem; pointer-events: none; will-change: transform,opacity; }
.gyr-info__item { display: flex; flex-direction: column; align-items: center; gap: .1rem; font-size: .54rem; font-weight: 500; color: rgba(140,180,220,.35); letter-spacing: .1em;
  &--core { min-width: 70px; }
}
.gyr-info__val { font-size: .85rem; font-weight: 700; color: rgba(120,180,240,.7); font-family: 'SF Mono', 'Consolas', monospace;
  &--highlight { font-size: .7rem; font-weight: 700; color: rgba(200,170,255,.8); letter-spacing: .08em; font-family: 'Inter', 'PingFang SC', sans-serif; }
}

.gyr-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(80,140,220,.05); }
.gyr-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #78b0e8, #50d0b8, #a088e0, #78b0e8); background-size: 200% 100%; box-shadow: 0 0 12px rgba(80,150,230,.5); }

@media (max-width: 768px) {
  .gyr-header { top: 2vh; } .gyr-kicker { font-size: .44rem; padding: .12rem .45rem; } .gyr-title__c { font-size: 1.3rem; }
  .gyr-info { bottom: 7vh; gap: .6rem; } .gyr-info__val { font-size: .65rem; }
  .gyr-core { inset: 20px; }
}
</style>
