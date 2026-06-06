<template>
  <section ref="rootRef" class="cr3-root">
    <div ref="glowA" class="cr3-glow cr3-glow--a"></div>
    <div ref="glowB" class="cr3-glow cr3-glow--b"></div>
    <canvas ref="canvasRef" class="cr3-canvas"></canvas>

    <div ref="scrollRef" class="cr3-scroll">
      <div ref="trackRef" class="cr3-track" :style="{ height: trackHeight }">
        <div class="cr3-sticky">

          <header ref="headerRef" class="cr3-header">
            <span class="cr3-kicker">🎠 CSS 3D Carousel · 旋转木马 🎠</span>
            <h1 class="cr3-title">
              <span ref="tc1" class="cr3-title__c">旋</span>
              <span ref="tc2" class="cr3-title__c cr3-title__c--3d">转</span>
              <span ref="tc3" class="cr3-title__c">木</span>
              <span ref="tc4" class="cr3-title__c cr3-title__c--3d">马</span>
            </h1>
            <div ref="lineRef" class="cr3-line"></div>
            <p class="cr3-sub">向下滚动 · 纯CSS3 3D旋转木马 · 8张图片环绕立体展示</p>
          </header>

          <!-- 🎠 3D旋转木马 -->
          <div ref="carouselStage" class="cr3-stage">
            <div ref="carouselRing" class="cr3-ring">
              <div
                v-for="(img, idx) in carouselImages"
                :key="idx"
                :ref="(el) => setPanelRef(el, idx)"
                class="cr3-panel"
                :style="panelStyle(idx)"
              >
                <img :src="img.src" :alt="img.alt" class="cr3-panel__img" loading="eager" />
                <span class="cr3-panel__label">{{ img.label }}</span>
              </div>
            </div>
          </div>

          <!-- 反射/阴影 -->
          <div ref="floorRef" class="cr3-floor"></div>

          <div ref="indicator" class="cr3-indicator">{{ carouselImages[currentIndex]?.label }}</div>
          <div class="cr3-progress"><div ref="progRef" class="cr3-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════
//  CardImage3DCarousel — CSS3 3D旋转木马
//  8张图片均匀分布在一个3D圆环上
//  rotateY(i * 45deg) + translateZ(radius) 形成圆环
//  用户竖滚 → 整个圆环绕Y轴旋转，图片依次转到正面
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface CarouselImage { label: string; src: string; alt: string }

const carouselImages: CarouselImage[] = [
  { label: '珊瑚海', src: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80', alt: '珊瑚海' },
  { label: '金色田', src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', alt: '金色田' },
  { label: '天空林', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', alt: '天空林' },
  { label: '暖阳山', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', alt: '暖阳山' },
  { label: '蜜桃花', src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80', alt: '蜜桃花' },
  { label: '云光峦', src: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', alt: '云光峦' },
  { label: '薄荷野', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', alt: '薄荷野' },
  { label: '绯红霞', src: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', alt: '绯红霞' },
]

const PANEL_COUNT = carouselImages.length
const ANGLE = 360 / PANEL_COUNT // 45°
// 根据面板数量计算半径，使相邻面板不重叠
const PANEL_WIDTH = 42 // vw (approx)
const RADIUS = PANEL_WIDTH / (2 * Math.tan(Math.PI / PANEL_COUNT)) // 保证面板边缘刚好接触

const trackHeight = `${(PANEL_COUNT + 2) * 100}vh`
const currentIndex = ref(0)

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const carouselStage = ref<HTMLElement | null>(null)
const carouselRing = ref<HTMLElement | null>(null)
const floorRef = ref<HTMLElement | null>(null)
const indicator = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)

const panelRefs = ref<HTMLElement[]>([])
const setPanelRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) panelRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

function panelStyle(idx: number) {
  const rotateY = idx * ANGLE
  const z = RADIUS
  return {
    transform: `rotateY(${rotateY}deg) translateZ(${z}vw)`,
  }
}

// Canvas 星光粒子
interface Spark { x: number; y: number; vy: number; size: number; alpha: number; hue: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
const sparks: Spark[] = []; let animId = 0

function createSpark(): Spark {
  return { x: Math.random() * cw, y: ch + 20, vy: -(0.8 + Math.random() * 2.5), size: 1 + Math.random() * 3, alpha: 0.3 + Math.random() * 0.5, hue: [20, 35, 195, 330, 45][Math.floor(Math.random() * 5)], life: 0, maxLife: 200 + Math.random() * 350 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 50; i++) sparks.push(createSpark())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (sparks.length < 50) sparks.push(createSpark())
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.life++
      if (s.life >= s.maxLife) { sparks.splice(i, 1); continue }
      const t = s.life / s.maxLife; const fade = t < 0.08 ? t / 0.08 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1
      s.y += s.vy
      const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2.5)
      grad.addColorStop(0, `hsla(${s.hue}, 80%, 75%, ${s.alpha * fade})`)
      grad.addColorStop(1, `hsla(${s.hue}, 60%, 50%, 0)`)
      ctx!.beginPath(); ctx!.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2)
      ctx!.fillStyle = grad; ctx!.fill()
      if (s.y < -30) { s.y = ch + 30; s.x = Math.random() * cw; s.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !carouselStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, z: -200, scale: 0.3 }, { autoAlpha: 1, z: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(carouselStage.value, { autoAlpha: 0, rotateX: 25, scale: 0.6 }, { autoAlpha: 1, rotateX: 8, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupCarousel() {
  if (!scrollRef.value || !trackRef.value || !carouselRing.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const ring = carouselRing.value

  gsap.set(ring, { rotateY: 0, rotateX: 8 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.15,
      onUpdate(self) {
        currentIndex.value = Math.min(PANEL_COUNT - 1, Math.max(0, Math.round((self.progress * (PANEL_COUNT - 1) + 0.0001) % PANEL_COUNT)))
      },
    },
  })

  // 完整旋转一圈（360°），每45°展示一个面板
  // 分段旋转，每段之间稍作停留
  for (let i = 0; i < PANEL_COUNT; i++) {
    const segmentStart = i
    const segEnd = i + 0.7
    // 每段旋转45度
    master.to(ring, { rotateY: (i + 1) * ANGLE, duration: 0.7, ease: 'power2.inOut' }, segmentStart)
    // 停留
    if (i < PANEL_COUNT - 1) {
      master.to(ring, { rotateY: (i + 1) * ANGLE, duration: 0.3, ease: 'none' }, segEnd)
    }
  }

  // 再加一圈回到原位
  master.to(ring, { rotateY: PANEL_COUNT * ANGLE + 360, duration: 1.5, ease: 'power2.inOut' }, PANEL_COUNT - 0.3)

  // 地板倾斜
  if (floorRef.value) {
    master.to(floorRef.value, { rotateX: 70, opacity: 0.5, duration: PANEL_COUNT }, 0)
  }

  // 全局呼吸
  for (let i = 0; i <= PANEL_COUNT; i++) {
    master.to(ring, { scale: 1.05, duration: 0.1, ease: 'sine.inOut' }, i + 0.3)
    master.to(ring, { scale: 1, duration: 0.15, ease: 'sine.inOut' }, i + 0.4)
  }

  if (glowA.value && glowB.value) {
    master.to(glowA.value, { x: '8vw', y: '-4vh', scale: 1.2, duration: PANEL_COUNT }, 0)
    master.to(glowB.value, { x: '-6vw', y: '6vh', scale: 1.25, duration: PANEL_COUNT }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: PANEL_COUNT }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupCarousel() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; sparks.length = 0
})
</script>

<style scoped lang="scss">
.cr3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(160deg, #fefaf6 0%, #fdf5f0 20%, #fef8f4 40%, #fdf6f1 60%, #fef9f5 80%, #fdf7f2 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }

.cr3-glow { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; will-change: transform; z-index: 0; }
.cr3-glow--a { width: 30vw; height: 30vw; top: -4vh; left: -2vw; background: radial-gradient(circle, rgba(255,150,130,.45) 0%, transparent 70%); }
.cr3-glow--b { width: 26vw; height: 26vw; bottom: -5vh; right: -2vw; background: radial-gradient(circle, rgba(130,190,230,.4) 0%, transparent 70%); }

.cr3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.cr3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,140,130,.3); &:hover { background: rgba(255,140,130,.5); } }
}
.cr3-track { position: relative; width: 100%; }
.cr3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.cr3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.cr3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,120,100,.8); background: rgba(255,140,120,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,130,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.cr3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.cr3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c87058; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #ff7b5a, #60b8f0, #ffb347); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(100,170,230,.45)); }
}
.cr3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #ff7b5a, #60b8f0, transparent); transform-origin: center; }
.cr3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,110,90,.5); max-width: 480px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 旋转木马 ═══════════════════════ */
.cr3-stage {
  position: absolute; top: 48%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0;
  z-index: 10;
  perspective: 1100px;
  perspective-origin: 50% 40%;
  will-change: transform, opacity;
}

/* 🔑 3D旋转圆环 */
.cr3-ring {
  position: absolute;
  width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* 🔑 每个面板位于圆环上的不同角度 */
.cr3-panel {
  position: absolute;
  width: 42vw; max-width: 380px;
  height: 30vw; max-height: 270px;
  margin-left: calc(-21vw / 1);
  margin-top: calc(-15vw / 1);
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0,0,0,.2);
  border: 2px solid rgba(255,255,255,.35);

  // 当面板在后方时降低亮度（天然backface-visibility处理大部分）
  @media (min-width: 1px) {
    // 正面面板更亮
    &:nth-child(1) { filter: brightness(1.08); }
  }
}

.cr3-panel__img { width: 100%; height: 100%; object-fit: cover; }
.cr3-panel__label {
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 2;
  font-size: .65rem; font-weight: 700; letter-spacing: .2em; color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,.5); background: rgba(0,0,0,.22);
  backdrop-filter: blur(6px); border-radius: 999px; padding: .2rem .8rem;
}

/* 地面反射暗示 */
.cr3-floor {
  position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%);
  width: 50vw; height: 6vw; max-width: 500px;
  background: radial-gradient(ellipse 50% 50%, rgba(0,0,0,.08), transparent);
  border-radius: 50%;
  z-index: 5; pointer-events: none; will-change: transform, opacity;
}

.cr3-indicator { position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); z-index: 25; font-size: .7rem; font-weight: 700; letter-spacing: .25em; color: #c87058; background: rgba(255,255,255,.4); backdrop-filter: blur(8px); border-radius: 999px; padding: .25rem 1rem; pointer-events: none; }

.cr3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,120,.06); }
.cr3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff7b5a, #60b8f0, #ffb347, #ff7b5a); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,130,100,.5); }

@media (max-width: 768px) {
  .cr3-header { top: 2vh; } .cr3-kicker { font-size: .54rem; padding: .2rem .65rem; } .cr3-title__c { font-size: 1.7rem; }
  .cr3-panel { width: 58vw; height: 42vw; margin-left: -29vw; margin-top: -21vw; }
  .cr3-floor { width: 70vw; }
}
</style>
