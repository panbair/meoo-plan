<template>
  <section ref="rootRef" class="py3-root">
    <div ref="glowA" class="py3-glow py3-glow--a"></div>
    <div ref="glowB" class="py3-glow py3-glow--b"></div>
    <canvas ref="canvasRef" class="py3-canvas"></canvas>

    <div ref="scrollRef" class="py3-scroll">
      <div ref="trackRef" class="py3-track" :style="{ height: trackHeight }">
        <div class="py3-sticky">

          <header ref="headerRef" class="py3-header">
            <span class="py3-kicker">🔺 CSS 3D Pyramid · 立体金字塔 🔺</span>
            <h1 class="py3-title">
              <span ref="tc1" class="py3-title__c">金</span>
              <span ref="tc2" class="py3-title__c py3-title__c--3d">字</span>
              <span ref="tc3" class="py3-title__c">塔</span>
              <span ref="tc4" class="py3-title__c py3-title__c--3d">顶</span>
            </h1>
            <div ref="lineRef" class="py3-line"></div>
            <p class="py3-sub">向下滚动 · 4面金字塔旋转 · 每面三角切面展示图片</p>
          </header>

          <!-- 🔺 3D金字塔 -->
          <div ref="pyStage" class="py3-stage">
            <div ref="pyramidRef" class="py3-pyramid">
              <!-- 4个三角侧面 -->
              <div v-for="(face, idx) in pyramidFaces" :key="idx"
                :ref="(el) => setFaceRef(el, idx)" class="py3-face"
                :style="faceStyle(idx)">
                <img :src="face.src" :alt="face.alt" class="py3-face__img" />
                <span class="py3-face__label">{{ face.label }}</span>
              </div>
              <!-- 底面 -->
              <div ref="baseRef" class="py3-base">
                <img :src="baseImg" class="py3-base__img" />
              </div>
            </div>
          </div>

          <div ref="infoLabel" class="py3-info">{{ pyramidFaces[currentFace]?.label }}</div>
          <div class="py3-progress"><div ref="progRef" class="py3-progress__fill"></div></div>
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
//  CardImage3DPyramid — CSS3 3D金字塔
//
//  4个三角侧面 + 1个正方形底面
//  侧面：rotateX(65°) → 向上倾斜形成金字塔斜面
//  每面绕Y轴旋转0°/90°/180°/270°
//  使用 clip-path: polygon() 裁剪为三角形
//  用户竖滚 → 金字塔绕Y轴旋转展示各面
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface PyramidFace { label: string; src: string; alt: string }

const pyramidFaces: PyramidFace[] = [
  { label: '金色沙漠', src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', alt: '金色' },
  { label: '珊瑚海岸', src: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=500&q=80', alt: '珊瑚' },
  { label: '远山落日', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80', alt: '远山' },
  { label: '绿野森林', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80', alt: '森林' },
]
const baseImg = 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80'
const currentFace = ref(0)
const trackHeight = `${(pyramidFaces.length + 2) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const pyStage = ref<HTMLElement | null>(null); const pyramidRef = ref<HTMLElement | null>(null)
const baseRef = ref<HTMLElement | null>(null); const infoLabel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null); const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)

const faceRefs = ref<HTMLElement[]>([])
const setFaceRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) faceRefs.value[i] = el }
const cleanupFns: TweenCleanup[] = []

function faceStyle(idx: number) {
  const ry = idx * 90
  // 三角面从底面边缘向上倾斜65度汇聚到顶点
  return { transform: `rotateY(${ry}deg) rotateX(65deg) translateZ(14vw)` }
}

// Canvas 金沙粒子
interface Sand { x: number; y: number; vy: number; size: number; alpha: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
let animId = 0; const sands: Sand[] = []

function createSand(): Sand {
  return { x: Math.random() * cw, y: ch + 20, vy: -(0.5 + Math.random() * 2), size: 0.8 + Math.random() * 2, alpha: 0.3 + Math.random() * 0.4, life: 0, maxLife: 140 + Math.random() * 280 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 50; i++) sands.push(createSand())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (sands.length < 50) sands.push(createSand())
    for (let i = sands.length - 1; i >= 0; i--) {
      const s = sands[i]; s.life++
      if (s.life >= s.maxLife) { sands.splice(i, 1); continue }
      s.y += s.vy
      const t = s.life / s.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      ctx!.beginPath(); ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(210,180,140,${s.alpha * fade})`; ctx!.fill()
      if (s.y < -20) { s.y = ch + 20; s.x = Math.random() * cw; s.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !pyStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, z: -200, scale: 0.3 }, { autoAlpha: 1, z: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(pyStage.value, { autoAlpha: 0, scale: 0.4, rotateY: 45 }, { autoAlpha: 1, scale: 1, rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupPyramid() {
  if (!scrollRef.value || !trackRef.value || !pyramidRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const py = pyramidRef.value

  gsap.set(py, { rotateY: 0, rotateX: 15 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.1,
      onUpdate(self) { currentFace.value = Math.floor((self.progress * pyramidFaces.length) % pyramidFaces.length) },
    },
  })

  // 金字塔绕Y轴旋转2圈
  master.to(py, { rotateY: 180, duration: 1.5, ease: 'power2.inOut' }, 0)
  master.to(py, { rotateY: 360, duration: 1.5, ease: 'power2.inOut' }, 1.5)
  master.to(py, { rotateY: 540, duration: 1.5, ease: 'power2.inOut' }, 2.5)

  // 倾斜角度微变
  master.to(py, { rotateX: 20, duration: 1, ease: 'sine.inOut' }, 0.5)
  master.to(py, { rotateX: 10, duration: 1, ease: 'sine.inOut' }, 1.5)
  master.to(py, { rotateX: 18, duration: 1, ease: 'sine.inOut' }, 2.5)

  for (let i = 0; i <= 3; i++) {
    master.to(py, { scale: 1.04, duration: 0.08, ease: 'sine.inOut' }, i + 0.3)
    master.to(py, { scale: 1, duration: 0.1, ease: 'sine.inOut' }, i + 0.4)
  }

  // 底面独立旋转
  if (baseRef.value) {
    master.to(baseRef.value, { rotateY: 360, duration: 4, ease: 'none' }, 0)
  }

  if (glowA.value && glowB.value) {
    master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: 4 }, 0)
    master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: 4 }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 4 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupPyramid() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; sands.length = 0
})
</script>

<style scoped lang="scss">
.py3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefaf7 0%, #fcf5ee 20%, #fdf7f2 40%, #fcf6ef 60%, #fdf8f3 80%, #fcf6f0 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.py3-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.py3-glow--a { width: 28vw; height: 28vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(240,200,140,.4) 0%, transparent 70%); }
.py3-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -1vw; background: radial-gradient(circle, rgba(220,180,130,.38) 0%, transparent 70%); }
.py3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.py3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(210,170,130,.3); &:hover { background: rgba(210,170,130,.5); } }
}
.py3-track { position: relative; width: 100%; }
.py3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.py3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.py3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(190,150,100,.8); background: rgba(220,180,130,.12); backdrop-filter: blur(8px); border: 1px solid rgba(200,160,120,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.py3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.py3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c89848; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #f0c860, #d4a030, #c89848, #e8c050); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(240,200,96,.5)); }
}
.py3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; background: linear-gradient(90deg, transparent, #d4a030, #e8c050, transparent); }
.py3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(170,130,90,.5); max-width: 460px; margin-inline: auto; }

/* ═══════════════ 3D金字塔 ═══════════════ */
.py3-stage {
  position: absolute; top: 48%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 800px; perspective-origin: 50% 40%;
  will-change: transform, opacity;
}

.py3-pyramid {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform;
}

/* 🔺 三角侧面 */
.py3-face {
  position: absolute;
  width: 28vw; max-width: 260px;
  height: 28vw; max-height: 260px;
  margin-left: -14vw; margin-top: -14vw;
  backface-visibility: hidden;
  overflow: hidden;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%); // 正三角
  transform-origin: 50% 100%; // 底部为旋转轴
}

.py3-face__img { width: 100%; height: 100%; object-fit: cover; }

.py3-face__label {
  position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); z-index: 2;
  font-size: .52rem; font-weight: 700; letter-spacing: .1em;
  color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,.5);
  background: rgba(0,0,0,.2); border-radius: 999px; padding: .08rem .5rem;
}

/* 正方形底面 */
.py3-base {
  position: absolute;
  width: 30vw; max-width: 280px;
  height: 30vw; max-height: 280px;
  margin-left: -15vw; margin-top: -15vw;
  backface-visibility: hidden;
  transform: rotateX(90deg) translateZ(-14vw);
  border-radius: 4px; overflow: hidden;
  box-shadow: 0 0 5px rgba(0,0,0,.15);
}
.py3-base__img { width: 100%; height: 100%; object-fit: cover; }

.py3-info { position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); z-index: 25; font-size: .7rem; font-weight: 700; letter-spacing: .25em; color: #c89848; background: rgba(255,255,255,.45); backdrop-filter: blur(8px); border-radius: 999px; padding: .25rem 1rem; pointer-events: none; }
.py3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(210,170,120,.06); }
.py3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #d4a030, #e8c050, #f0c860, #d4a030); background-size: 200% 100%; box-shadow: 0 0 12px rgba(220,180,80,.5); }
@media (max-width: 768px) { .py3-header { top: 2vh; } .py3-kicker { font-size: .54rem; } .py3-title__c { font-size: 1.7rem; } .py3-face { width: 38vw; height: 38vw; margin-left: -19vw; margin-top: -19vw; } }
</style>
