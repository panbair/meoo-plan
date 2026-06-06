<template>
  <section ref="rootRef" class="im-root">
    <div ref="glowA" class="im-glow im-glow--a"></div>
    <div ref="glowB" class="im-glow im-glow--b"></div>
    <div class="im-vanishing-point"></div>

    <div ref="scrollRef" class="im-scroll">
      <div ref="trackRef" class="im-track" :style="{ height: trackHeight }">
        <div class="im-sticky">

          <header ref="headerRef" class="im-header">
            <span class="im-kicker">◈ CSS3 极限透视 · 无限深渊 · 图片时空隧道 ◈</span>
            <h1 class="im-title">
              <span ref="tc1" class="im-title__c">图</span>
              <span ref="tc2" class="im-title__c im-title__c--void">像</span>
              <span ref="tc3" class="im-title__c">深</span>
              <span ref="tc4" class="im-title__c im-title__c--void">渊</span>
            </h1>
            <div ref="dividerRef" class="im-divider"></div>
            <p ref="subRef" class="im-sub">
              向下滚动 · perspective:400px · 20张图片Z轴穿越 · 第一人称时空隧道
            </p>
          </header>

          <!-- ════════════════ 🔑 图片无限深渊隧道 ════════════════ -->
          <div ref="tunnelRef" class="im-tunnel">

            <!-- 🔑 20个图片环 — Z轴均匀分布, @keyframes驱动前移 -->
            <div
              v-for="ring in rings"
              :key="ring.id"
              class="im-ring"
              :style="{
                '--base-z': ring.baseZ + 'px',
                '--delay': ring.delay + 's',
                '--duration': ring.duration + 's',
                '--scale-comp': ring.scaleComp,
              }"
            >
              <!-- 🔑 每环含3-4张图片 — 环绕排列 -->
              <div
                v-for="(img, ii) in ring.images"
                :key="ii"
                class="im-ring__img-wrap"
                :style="{
                  transform: `rotate(${ii * ring.angleStep}deg) translateX(${ring.radius}px) rotate(-${ii * ring.angleStep}deg)`,
                }"
              >
                <img :src="img.url" :alt="''" class="im-ring__img" loading="lazy" />
              </div>
              <!-- 环框发光 -->
              <div class="im-ring__glow-border"></div>
            </div>

            <!-- 🔑 地面网格 -->
            <div class="im-grid-floor"></div>
          </div>

          <!-- 速度指示 -->
          <div ref="speedPanel" class="im-speed">
            <span class="im-speed__bar">
              <span class="im-speed__fill" :style="{ width: speedPercent + '%' }"></span>
            </span>
            <span class="im-speed__label">穿越速度 {{ speedPercent }}% · {{ RING_COUNT }}图片环</span>
          </div>

          <div class="im-progress"><div ref="progRef" class="im-progress__fill"></div></div>
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

type TweenCleanup = () => void

// ═══════════════ 🔑 图片资源池 ═══════════════
const imagePool = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=300&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&q=80',
  'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=300&q=80',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=300&q=80',
]

// ═══════════════ 🔑 程序化生成20个图片环 ═══════════════
interface RingImage { url: string }
interface TunnelRing {
  id: number; baseZ: number; delay: number; duration: number
  scaleComp: number; radius: number; angleStep: number; images: RingImage[]
}

const RING_COUNT = 20
const Z_RANGE = 2200
const rings: TunnelRing[] = []
const hash = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }

for (let i = 0; i < RING_COUNT; i++) {
  const t = i / (RING_COUNT - 1)
  const imgCount = 3 + Math.round(hash(i * 13) * 2) // 3-5 张图环绕
  const ringImgs: RingImage[] = []
  for (let j = 0; j < imgCount; j++) {
    ringImgs.push({ url: imagePool[Math.floor(hash(i * 7 + j * 3) * imagePool.length)] })
  }
  rings.push({
    id: i,
    baseZ: Math.round(-2000 + t * Z_RANGE),
    delay: parseFloat((t * 3).toFixed(2)),
    duration: 3,
    scaleComp: parseFloat((1 - t * 0.7).toFixed(2)),
    radius: Math.round(200 + t * 260), // 远处小环 → 近处大环
    angleStep: 360 / imgCount,
    images: ringImgs,
  })
}

const TUNNEL_STAGES = 5
const trackHeight = `${(TUNNEL_STAGES + 1) * 100}vh`
const speedPercent = ref(50)

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const tunnelRef = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const speedPanel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const cleanupFns: TweenCleanup[] = []

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .75, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -500, scale: .2, filter: 'blur(12px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: .55, stagger: .08, ease: 'back.out(2)' }, '-=.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.inOut' }, '-=.15')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, '-=.08')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupTunnelSpeed() {
  if (!scrollRef.value || !trackRef.value || !tunnelRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const tunnel = tunnelRef.value
  const D = TUNNEL_STAGES
  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3,
      onUpdate(self) {
        const spd = 0.3 + self.progress * 2.7
        speedPercent.value = Math.round(spd * 33)
        tunnel.style.setProperty('--tunnel-speed', spd.toFixed(2))
      },
    },
  })
  master.to(tunnel, { rotateX: 8, rotateY: -5, duration: D * .4 }, 0)
  master.to(tunnel, { rotateX: -6, rotateY: 8, duration: D * .5 }, D * .35)
  master.to(tunnel, { rotateX: 0, rotateY: 0, duration: D * .3 }, D * .7)
  if (glowA.value) master.to(glowA.value, { x: '5vw', y: '-3vh', scale: 1.2, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '3vh', scale: 1.15, duration: D }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupTunnelSpeed() }))
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
/* ═══════════════ 🔑 @property 速度控制 ═══════════════ */
@property --tunnel-speed {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}

/* ═══════════════════════ 深渊暗空 ═══════════════════════ */
.im-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 50% 40% at 50% 50%, #08060e 0%, #020104 70%, #000 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
}

.im-glow { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.im-glow--a { width: 30vw; height: 30vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(0,200,240,.08) 0%, transparent 70%); }
.im-glow--b { width: 28vw; height: 28vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(200,0,200,.06) 0%, transparent 70%); }

.im-vanishing-point {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 30px; height: 30px; border-radius: 50%; z-index: 3; pointer-events: none;
  background: radial-gradient(circle, rgba(0,240,255,.5) 0%, rgba(0,200,240,.15) 30%, transparent 70%);
  box-shadow: 0 0 50px rgba(0,220,255,.35), 0 0 120px rgba(0,180,240,.12);
}

.im-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(0,200,240,.08); }
}
.im-track { position: relative; width: 100%; }
.im-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.im-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.im-kicker { display: inline-block; font-size: .5rem; font-weight: 700; letter-spacing: .22em; color: rgba(0,210,240,.55); background: rgba(0,180,220,.04); backdrop-filter: blur(8px); border: 1px solid rgba(0,180,220,.1); border-radius: 999px; padding: .15rem .8rem; margin-bottom: .45rem; }
.im-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.im-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.4rem); font-weight: 900; color: #30c0d8;
  &--void { background: linear-gradient(150deg, #00e0ff 0%, #40f0ff 30%, #d040f0 60%, #f060e0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 12px rgba(0,220,255,.6)); }
}
.im-divider { width: 110px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, #00e0ff, #d040f0, #00e0ff, transparent); }
.im-sub { margin: 0; font-size: clamp(.52rem, 1vw, .68rem); color: rgba(0,200,230,.3); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ 🔑 极限透视隧道 ═══════════════════════ */
.im-tunnel {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 400px; // 🔑 极限小 → 极度夸张纵深
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
  will-change: transform;
  --tunnel-speed: 1;
}

/* ═══════════════ 🔑 图片环 — @keyframes 从深处冲向眼前 ═══════════════ */
.im-ring {
  --base-z: 0px; --delay: 0s; --duration: 3s; --scale-comp: 1;
  position: absolute;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  transform: translateZ(var(--base-z)) scale(var(--scale-comp));
  opacity: 0;

  // 🔑 核心动画 — 从深处冲向眼前
  animation: im-tunnel-rush var(--duration) var(--delay) infinite linear;
}

/* 🔑 环内图片包装 — 环绕排列 */
.im-ring__img-wrap {
  position: absolute;
  width: 90px; height: 65px;
  margin-left: -45px; margin-top: -33px;
  backface-visibility: hidden;
  border-radius: 4px; overflow: hidden;
  box-shadow: 0 0 12px rgba(0,200,240,.2);
}
.im-ring__img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  filter: brightness(.8);
}

/* 环框发光 */
.im-ring__glow-border {
  position: absolute; top: 50%; left: 50%;
  width: 600px; height: 600px; margin-left: -300px; margin-top: -300px;
  border-radius: 50%;
  border: 1px solid rgba(0,220,240,.12);
  box-shadow: 0 0 30px rgba(0,200,240,.06), inset 0 0 30px rgba(0,200,240,.04);
  pointer-events: none;
  transform: translateZ(-1px);
}

/* ═══════════════ 🔑 @keyframes 时空穿越 ═══════════════ */
@keyframes im-tunnel-rush {
  0% {
    transform: translateZ(-2000px) scale(0.12);
    opacity: 0;
  }
  6%  { opacity: .35; }
  18% {
    transform: translateZ(-1000px) scale(0.3);
    opacity: .6;
  }
  40% {
    transform: translateZ(-300px) scale(0.6);
    opacity: .85;
  }
  60% {
    transform: translateZ(0px) scale(0.9);
    opacity: 1;
  }
  78% {
    transform: translateZ(120px) scale(1.6);
    opacity: .55;
  }
  92% {
    transform: translateZ(200px) scale(2.2);
    opacity: .15;
  }
  100% {
    transform: translateZ(280px) scale(3);
    opacity: 0;
  }
}

/* 🔑 地面网格 */
.im-grid-floor {
  position: absolute; top: 50%; left: 50%;
  width: 1200px; height: 1200px;
  margin-left: -600px; margin-top: 80px;
  transform: rotateX(80deg) translateZ(-150px);
  transform-style: preserve-3d; pointer-events: none;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,200,240,.05) 40px, rgba(0,200,240,.05) 41px),
    repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,200,240,.05) 40px, rgba(0,200,240,.05) 41px);
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 25%, transparent 70%);
  animation: im-grid-scroll 2s linear infinite;
}
@keyframes im-grid-scroll { to { background-position: 0 40px, 0 0; } }

.im-speed { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; align-items: center; gap: .5rem; }
.im-speed__bar { width: 60px; height: 3px; border-radius: 2px; background: rgba(0,200,240,.1); overflow: hidden; }
.im-speed__fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #00e0ff, #d040f0); box-shadow: 0 0 6px rgba(0,220,255,.3); transition: width .2s ease; }
.im-speed__label { font-size: .48rem; font-weight: 600; letter-spacing: .1em; font-family: 'Courier New', monospace; color: rgba(0,200,230,.45); white-space: nowrap; }

.im-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(0,200,240,.02); }
.im-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #00e0ff, #d040f0, #00e0ff); }

@media (max-width: 768px) {
  .im-header { top: 2vh; } .im-kicker { font-size: .32rem; } .im-title__c { font-size: 1.4rem; }
  .im-tunnel { perspective: 300px; }
  .im-ring__img-wrap { width: 60px; height: 44px; margin-left: -30px; margin-top: -22px; }
  .im-ring__glow-border { width: 400px; height: 400px; margin-left: -200px; margin-top: -200px; }
}
</style>
