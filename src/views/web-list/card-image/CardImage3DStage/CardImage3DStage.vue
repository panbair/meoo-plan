<template>
  <section ref="rootRef" class="t3d-root">
    <div ref="ambientA" class="t3d-ambient t3d-ambient--a"></div>
    <div ref="ambientB" class="t3d-ambient t3d-ambient--b"></div>

    <canvas ref="canvasRef" class="t3d-canvas"></canvas>

    <div ref="scrollRef" class="t3d-scroll">
      <div ref="trackRef" class="t3d-track" :style="{ height: trackHeight }">
        <div class="t3d-sticky">

          <header ref="headerRef" class="t3d-header">
            <span class="t3d-kicker">◈ CSS 3D Stage · 纵深舞台 ◈</span>
            <h1 class="t3d-title">
              <span ref="tw1" class="t3d-title__w">纵</span>
              <span ref="tw2" class="t3d-title__w t3d-title__w--z">深</span>
              <span ref="tw3" class="t3d-title__w">舞</span>
              <span ref="tw4" class="t3d-title__w t3d-title__w--z">台</span>
            </h1>
            <div ref="lineRef" class="t3d-line"></div>
            <p class="t3d-sub">向下滚动 · 相机穿越真实Z轴空间 · 五层深度立体展示</p>
          </header>

          <!-- 🎬 3D纵深舞台 -->
          <div ref="stageRef" class="t3d-stage">
            <!-- 第1层 — 最远 Z=-400 -->
            <div ref="layer1" class="t3d-layer t3d-layer--far">
              <img :src="frames[0].image" :alt="frames[0].alt" class="t3d-layer__img" />
              <div class="t3d-layer__caption">{{ frames[0].title }}</div>
            </div>
            <!-- 第2层 — Z=-200 -->
            <div ref="layer2" class="t3d-layer t3d-layer--midfar">
              <img :src="frames[1].image" :alt="frames[1].alt" class="t3d-layer__img" />
              <div class="t3d-layer__caption">{{ frames[1].title }}</div>
            </div>
            <!-- 第3层 — Z=0 锚点 -->
            <div ref="layer3" class="t3d-layer t3d-layer--anchor">
              <img :src="frames[2].image" :alt="frames[2].alt" class="t3d-layer__img" />
              <div class="t3d-layer__caption t3d-layer__caption--active">{{ frames[2].title }}</div>
            </div>
            <!-- 第4层 — Z=200 -->
            <div ref="layer4" class="t3d-layer t3d-layer--midnear">
              <img :src="frames[3].image" :alt="frames[3].alt" class="t3d-layer__img" />
              <div class="t3d-layer__caption">{{ frames[3].title }}</div>
            </div>
            <!-- 第5层 — 最近 Z=400 -->
            <div ref="layer5" class="t3d-layer t3d-layer--near">
              <img :src="frames[4].image" :alt="frames[4].alt" class="t3d-layer__img" />
              <div class="t3d-layer__caption">{{ frames[4].title }}</div>
            </div>
          </div>

          <div ref="depthBar" class="t3d-depth-bar">
            <span class="t3d-depth-bar__label">远</span>
            <div class="t3d-depth-bar__track">
              <div ref="depthFill" class="t3d-depth-bar__fill"></div>
            </div>
            <span class="t3d-depth-bar__label">近</span>
          </div>

          <div class="t3d-progress"><div ref="progRef" class="t3d-progress__fill"></div></div>
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
//  CardImage3DStage — CSS3 3D纵深舞台
//
//  核心概念：真实CSS3 Z轴空间 + 相机移动
//  1. 5层图片分别位于 translateZ: -400, -200, 0, 200, 400
//  2. perspective + transform-style: preserve-3d 构建3D场景
//  3. 用户竖滚 → "相机"在Z轴上前后移动
//  4. 近大远小、近快远慢的天然3D透视
//  5. 不同层级的blur模拟景深
//
//  青春时尚配色：蜜桃粉 · 天空蓝 · 薄荷绿 · 琥珀金 · 薰衣草紫
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface StageFrame {
  id: string; title: string; image: string; alt: string
}

const frames: StageFrame[] = [
  { id: 'far', title: '远山', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80', alt: '远山层' },
  { id: 'midfar', title: '森林', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', alt: '森林层' },
  { id: 'anchor', title: '海岸', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80', alt: '海岸层' },
  { id: 'midnear', title: '田野', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80', alt: '田野层' },
  { id: 'near', title: '花朵', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80', alt: '花朵层' },
]

const FRAME_COUNT = frames.length
const trackHeight = `${(FRAME_COUNT + 2) * 100}vh`
const LAYER_Z = [-400, -200, 0, 200, 400]

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tw1 = ref<HTMLElement | null>(null); const tw2 = ref<HTMLElement | null>(null)
const tw3 = ref<HTMLElement | null>(null); const tw4 = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const layer1 = ref<HTMLElement | null>(null); const layer2 = ref<HTMLElement | null>(null)
const layer3 = ref<HTMLElement | null>(null); const layer4 = ref<HTMLElement | null>(null)
const layer5 = ref<HTMLElement | null>(null)
const depthFill = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ambientA = ref<HTMLElement | null>(null)
const ambientB = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════════ Canvas 3D粒子 ═══════════════════════════
interface ZParticle { x: number; y: number; z: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null
let cw = 0; let ch = 0
const zParticles: ZParticle[] = []
let animId = 0

function createZParticle(): ZParticle {
  return {
    x: Math.random() * cw, y: ch + 30,
    z: Math.random() * 800 - 400,
    vy: -(0.5 + Math.random() * 2.5),
    size: 1 + Math.random() * 3.5,
    alpha: 0.2 + Math.random() * 0.5,
    hue: [15, 195, 155, 40, 280][Math.floor(Math.random() * 5)],
    life: 0, maxLife: 200 + Math.random() * 400,
  }
}

function zBurst(count: number) {
  for (let i = 0; i < count; i++) { zParticles.push(createZParticle()) }
  while (zParticles.length > 150) zParticles.shift()
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 60; i++) zParticles.push(createZParticle())

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, cw, ch)
    while (zParticles.length < 60) zParticles.push(createZParticle())
    for (let i = zParticles.length - 1; i >= 0; i--) {
      const p = zParticles[i]; p.life++
      if (p.life >= p.maxLife) { zParticles.splice(i, 1); continue }
      const t = p.life / p.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1
      p.y += p.vy

      // Z深度影响大小和模糊（远小近大）
      const zNorm = (p.z + 400) / 800 // 0(远) → 1(近)
      const screenSize = p.size * (0.5 + zNorm * 1.5)
      const screenAlpha = p.alpha * (0.4 + zNorm * 0.6) * fade

      const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, screenSize * 2)
      grad.addColorStop(0, `hsla(${p.hue}, 70%, ${70 + zNorm * 15}%, ${screenAlpha})`)
      grad.addColorStop(1, `hsla(${p.hue}, 50%, 50%, 0)`)

      ctx!.beginPath(); ctx!.arc(p.x, p.y, screenSize * 2, 0, Math.PI * 2)
      ctx!.fillStyle = grad; ctx!.fill()

      if (p.y < -60) { p.y = ch + 40; p.x = Math.random() * cw; p.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

// ═══════════════════════════ 入场 ═══════════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !stageRef.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  const chars = [tw1.value, tw2.value, tw3.value, tw4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -300, scale: 0.3 }, { autoAlpha: 1, z: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(stageRef.value, { autoAlpha: 0, rotateX: 15 }, { autoAlpha: 1, rotateX: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════════ 3D纵深舞台 ═══════════════════════════
function setup3DStage() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const layers = [layer1.value, layer2.value, layer3.value, layer4.value, layer5.value].filter(Boolean)

  if (!layers.length) return

  // 初始：所有层可见，位于各自的Z位置
  layers.forEach((layer, i) => {
    const z = LAYER_Z[i]
    const zNorm = (z + 400) / 800 // 0(远)→1(近)
    gsap.set(layer, {
      z, opacity: 0.5 + zNorm * 0.5,
      filter: `brightness(${0.9 + zNorm * 0.2}) blur(${(1 - zNorm) * 4}px)`,
      scale: 0.7 + zNorm * 0.6,
    })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3 },
  })

  // 🎬 相机沿Z轴移动：从后方(Z=-200) → 穿过场景 → 到前方(Z=600)
  // 整个stage的translateZ变化模拟相机推拉
  master
    // Stage 0-1: 相机从远处拉近，远景→中景
    .to(stage, { z: 150, duration: 1, ease: 'power2.inOut' }, 0)
    // Stage 1-2: 相机继续推进
    .to(stage, { z: 300, duration: 1, ease: 'power2.inOut' }, 1)
    // Stage 2-3: 接近最近层
    .to(stage, { z: 400, duration: 1, ease: 'power2.inOut' }, 2)
    // Stage 3-4: 穿越到前方
    .to(stage, { z: 500, duration: 1, ease: 'power3.in' }, 3)
    // Stage 4-5: 回到初始位置
    .to(stage, { z: 0, rotateY: 0, duration: 1, ease: 'power2.inOut' }, 4)

  // 同步每层的视觉变化（远近对调）
  // 远层在相机靠近时反而变得更远（Z轴相对位置变化）
  layers.forEach((layer, i) => {
    const z = LAYER_Z[i]
    const zNorm = (z + 400) / 800

    // 每层独立微调：相机靠近时，近层放大，远层相对缩小
    for (let s = 0; s < FRAME_COUNT; s++) {
      // 当该层处于"最舒适观看距离"时突出
      const comfortZone = s // 阶段s时，第s层最舒服
      const distFromComfort = Math.abs(i - comfortZone)
      const highlight = distFromComfort === 0 ? 1.15 : distFromComfort === 1 ? 1.05 : 1.0

      master.to(layer, {
        scale: (0.7 + zNorm * 0.6) * highlight,
        filter: `brightness(${0.9 + zNorm * 0.2 + (distFromComfort === 0 ? 0.15 : 0)}) blur(${(1 - zNorm) * 4 + distFromComfort * 1.5}px)`,
        opacity: 0.5 + zNorm * 0.5 + (distFromComfort === 0 ? 0.2 : 0),
        duration: 0.35, ease: 'power2.out',
      }, s + 0.3)
      master.to(layer, {
        scale: (0.7 + zNorm * 0.6),
        filter: `brightness(${0.9 + zNorm * 0.2}) blur(${(1 - zNorm) * 4}px)`,
        opacity: 0.5 + zNorm * 0.5,
        duration: 0.4, ease: 'power2.in',
      }, s + 0.65)
    }
  })

  // 深度指示条
  if (depthFill.value) {
    master.to(depthFill.value, { width: '100%', duration: FRAME_COUNT }, 0)
  }

  // 光晕
  if (ambientA.value && ambientB.value) {
    master.to(ambientA.value, { x: '8vw', y: '-5vh', scale: 1.15, duration: FRAME_COUNT }, 0)
    master.to(ambientB.value, { x: '-6vw', y: '6vh', scale: 1.2, duration: FRAME_COUNT }, 0)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: FRAME_COUNT }, 0)

  // 粒子爆发
  for (let i = 0; i < FRAME_COUNT; i++) {
    const st = ScrollTrigger.create({ trigger: track, scroller, start: `${((i + 0.3) / FRAME_COUNT) * 100}% top`, onEnter: () => zBurst(30) })
    cleanupFns.push(() => st.kill())
  }

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setup3DStage() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; zParticles.length = 0
})
</script>

<style scoped lang="scss">
.t3d-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fef9f6 0%, #fdf6f0 20%, #fef8f4 40%, #fdf7f2 60%, #fef9f5 80%, #fdf8f3 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }

.t3d-ambient { position: absolute; border-radius: 50%; filter: blur(75px); pointer-events: none; will-change: transform; z-index: 0; }
.t3d-ambient--a { width: 32vw; height: 32vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(255,160,140,.45) 0%, transparent 70%); }
.t3d-ambient--b { width: 28vw; height: 28vw; bottom: -5vh; right: -2vw; background: radial-gradient(circle, rgba(140,200,230,.4) 0%, transparent 70%); }

.t3d-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.t3d-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,150,130,.3); &:hover { background: rgba(255,150,130,.5); } }
}
.t3d-track { position: relative; width: 100%; }
.t3d-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.t3d-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.t3d-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,130,110,.8); background: rgba(255,150,130,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,140,120,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.t3d-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.t3d-title__w { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c87060; will-change: transform,opacity;
  &--z { background: linear-gradient(180deg, #ff8c69, #5ac8fa, #5ce0a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(100,180,230,.5)); }
}
.t3d-line { width: 90px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #ff8c69, #5ac8fa, #5ce0a0, transparent); transform-origin: center; }
.t3d-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,120,100,.5); max-width: 480px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D纵深舞台 ═══════════════════════ */
.t3d-stage {
  position: absolute; top: 48%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0;
  z-index: 10;
  perspective: 1000px;              // 🔑 3D透视
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;     // 🔑 保持3D空间
  will-change: transform;
}

/* 每层都是3D平面，位于不同的Z深度 */
.t3d-layer {
  position: absolute;
  width: min(62vw, 500px);
  height: min(44vw, 350px);
  margin-left: calc(min(62vw, 500px) / -2);
  margin-top: calc(min(44vw, 350px) / -2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,.18);
  will-change: transform, filter, opacity;
  transform-origin: center center;
}

.t3d-layer__img { width: 100%; height: 100%; object-fit: cover; }

.t3d-layer__caption {
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
  z-index: 2; font-size: .68rem; font-weight: 700; letter-spacing: .2em;
  color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.5);
  background: rgba(0,0,0,.2); backdrop-filter: blur(6px);
  border-radius: 999px; padding: .2rem .8rem;
  transition: all .3s;
  &--active { background: rgba(255,120,100,.5); transform: translateX(-50%) scale(1.15); }
}

/* Z轴位置 */
.t3d-layer--far     { z-index: 0; }  // Z=-400
.t3d-layer--midfar  { z-index: 1; }  // Z=-200
.t3d-layer--anchor  { z-index: 2; }  // Z=0
.t3d-layer--midnear { z-index: 3; }  // Z=200
.t3d-layer--near    { z-index: 4; }  // Z=400

/* 深度指示条 */
.t3d-depth-bar {
  position: absolute; bottom: 8vh; left: 50%; transform: translateX(-50%);
  z-index: 25; display: flex; align-items: center; gap: 10px;
  pointer-events: none;
}
.t3d-depth-bar__label { font-size: .58rem; font-weight: 700; letter-spacing: .2em; color: rgba(180,120,100,.6); }
.t3d-depth-bar__track { width: 160px; height: 3px; border-radius: 3px; background: rgba(200,140,120,.15); overflow: hidden; }
.t3d-depth-bar__fill { width: 0; height: 100%; background: linear-gradient(90deg, #a0c8e8, #ff8c69); border-radius: 3px; }

.t3d-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,120,.06); }
.t3d-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff8c69, #5ac8fa, #5ce0a0, #ff8c69); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,140,110,.5); }

@media (max-width: 768px) {
  .t3d-header { top: 2vh; } .t3d-kicker { font-size: .54rem; padding: .2rem .65rem; } .t3d-title__w { font-size: 1.7rem; }
  .t3d-layer { width: 78vw; height: 55vw; margin-left: -39vw; margin-top: -27.5vw; }
}
</style>
