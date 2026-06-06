<template>
  <section ref="rootRef" class="dna-root">
    <div ref="coreGlow" class="dna-core-glow"></div>
    <div ref="ambientPulse" class="dna-ambient"></div>

    <div ref="scrollRef" class="dna-scroll">
      <div ref="trackRef" class="dna-track" :style="{ height: trackHeight }">
        <div class="dna-sticky">

          <header ref="headerRef" class="dna-header">
            <span class="dna-kicker">🧬 CSS3 3D DNA Helix Tunnel · 双螺旋图片链 ◈</span>
            <h1 class="dna-title">
              <span ref="tc1" class="dna-title__c">双</span>
              <span ref="tc2" class="dna-title__c dna-title__c--helix">螺</span>
              <span ref="tc3" class="dna-title__c">旋</span>
              <span ref="tc4" class="dna-title__c dna-title__c--helix">链</span>
            </h1>
            <div ref="lineRef" class="dna-line"></div>
            <p class="dna-sub">向下滚动 · 双螺旋缠绕Z轴上升 · 两链各12张图片 · 基因之美</p>
          </header>

          <div ref="sceneRef" class="dna-scene">
            <div ref="helixRef" class="dna-helix">
              <!-- 链A — 12张图片卡片螺旋排列 -->
              <div
                v-for="card in strandA"
                :key="'A'+card.id"
                :ref="(el) => setCardARef(el as HTMLElement, card.id)"
                class="dna-card dna-card--strand-a"
              >
                <img :src="card.image" :alt="card.alt" class="dna-card__img" />
                <div class="dna-card__glow"></div>
                <span class="dna-card__idx">{{ card.id + 1 }}</span>
              </div>
              <!-- 链B — 12张图片卡片螺旋排列（错开180°） -->
              <div
                v-for="card in strandB"
                :key="'B'+card.id"
                :ref="(el) => setCardBRef(el as HTMLElement, card.id)"
                class="dna-card dna-card--strand-b"
              >
                <img :src="card.image" :alt="card.alt" class="dna-card__img" />
                <div class="dna-card__glow"></div>
                <span class="dna-card__idx">{{ card.id + 1 }}</span>
              </div>

              <!-- 连接横档 — 碱基对 -->
              <div
                v-for="rung in rungs"
                :key="'rung'+rung.id"
                :ref="(el) => setRungRef(el as HTMLElement, rung.id)"
                class="dna-rung"
              ></div>
            </div>
          </div>

          <div ref="helixInfo" class="dna-info">
            <span class="dna-info__dot"></span>
            <span class="dna-info__text">螺旋进度 {{ helixTurn }} 圈</span>
          </div>

          <div class="dna-progress"><div ref="progRef" class="dna-progress__fill"></div></div>
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
//  CardImage3DDNAHelixTunnel — CSS3 3D 双螺旋图片链
//
//  核心概念：DNA双螺旋结构沿Z轴排列，两链各搭载12张图片
//  1. 链A：12张卡片沿螺旋线A排列（相位=0°）
//  2. 链B：12张卡片沿螺旋线B排列（相位=180°）
//  3. 横档（碱基对）连接两链
//  4. 用户竖滚 → 整个螺旋结构绕Y轴旋转+沿Z轴推进
//  5. 呈现图片在双螺旋中穿行的视觉效果
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const CARD_COUNT = 12
const trackHeight = `${8 * 100}vh`

const imagePool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=350&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=350&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=350&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=350&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=350&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=350&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=350&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=350&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=350&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=350&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=350&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=350&q=80',
]

const strandA = Array.from({ length: CARD_COUNT }, (_, i) => ({
  id: i, image: imagePool[i], alt: `A链图${i + 1}`,
}))
const strandB = Array.from({ length: CARD_COUNT }, (_, i) => ({
  id: i, image: imagePool[(i + 6) % CARD_COUNT], alt: `B链图${i + 1}`,
}))
const rungs = Array.from({ length: CARD_COUNT }, (_, i) => ({ id: i }))

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const helixRef = ref<HTMLElement | null>(null)
const coreGlow = ref<HTMLElement | null>(null)
const ambientPulse = ref<HTMLElement | null>(null)
const helixInfo = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const cardARefs = ref<(HTMLElement | null)[]>([])
const cardBRefs = ref<(HTMLElement | null)[]>([])
const rungRefs = ref<(HTMLElement | null)[]>([])
const helixTurn = ref(0)
const cleanupFns: TweenCleanup[] = []

function setCardARef(el: HTMLElement | null, idx: number) { cardARefs.value[idx] = el }
function setCardBRef(el: HTMLElement | null, idx: number) { cardBRefs.value[idx] = el }
function setRungRef(el: HTMLElement | null, idx: number) { rungRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, y: 100, filter: 'blur(18px)', rotateY: 90 }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', rotateY: 0, duration: 0.65, stagger: 0.1, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(sceneRef.value, { autoAlpha: 0, rotateX: -25, scale: 0.7 }, { autoAlpha: 1, rotateX: -8, scale: 1, duration: 1, ease: 'power4.out' }, '-=0.4')
  // 卡片交错弹入
  const allCards = [...cardARefs.value, ...cardBRefs.value].filter(Boolean) as HTMLElement[]
  if (allCards.length) tl.fromTo(allCards, { autoAlpha: 0, scale: 0, rotateZ: 180 }, { autoAlpha: 1, scale: 1, rotateZ: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(2.8)' }, '-=0.8')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupDNAHelix() {
  if (!scrollRef.value || !trackRef.value || !helixRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  const aCards = cardARefs.value.filter(Boolean) as HTMLElement[]
  const bCards = cardBRefs.value.filter(Boolean) as HTMLElement[]
  const rungEls = rungRefs.value.filter(Boolean) as HTMLElement[]

  // 🧬 初始螺旋定位
  const Z_SPACING = 180
  const HELIX_RADIUS = 130
  aCards.forEach((el, i) => {
    const z = -i * Z_SPACING - 100
    const angle = (i * 60 * Math.PI) / 180 // 每步60°
    const x = Math.cos(angle) * HELIX_RADIUS
    const y = Math.sin(angle) * HELIX_RADIUS - 50
    gsap.set(el, { x, y, translateZ: z, scale: 0.7 + (1 - i * 0.04), opacity: 0.4 + (1 - i * 0.06) })
  })
  bCards.forEach((el, i) => {
    const z = -i * Z_SPACING - 100
    const angle = (i * 60 + 180) * Math.PI / 180 // 错开180°
    const x = Math.cos(angle) * HELIX_RADIUS
    const y = Math.sin(angle) * HELIX_RADIUS - 50
    gsap.set(el, { x, y, translateZ: z, scale: 0.7 + (1 - i * 0.04), opacity: 0.4 + (1 - i * 0.06) })
  })
  rungEls.forEach((el, i) => {
    const z = -i * Z_SPACING - 100
    gsap.set(el, { translateZ: z, scaleY: 0.7 + (1 - i * 0.05), opacity: 0.4 + (1 - i * 0.05) })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) { helixTurn.value = Math.round(self.progress * 6 * 10) / 10 },
    },
  })

  const totalDist = CARD_COUNT * Z_SPACING * 0.7

  // 🧬 双螺旋旋转+推进
  aCards.forEach((el, i) => {
    const startZ = -i * Z_SPACING - 100
    const startAngle = (i * 60 * Math.PI) / 180
    const endAngle = startAngle + Math.PI * 4 // 2圈
    master.fromTo(el,
      { x: Math.cos(startAngle) * HELIX_RADIUS, y: Math.sin(startAngle) * HELIX_RADIUS - 50, translateZ: startZ, scale: 0.7 + (1 - i * 0.04), opacity: 0.4 + (1 - i * 0.06) },
      { x: Math.cos(endAngle) * (HELIX_RADIUS + 30), y: Math.sin(endAngle) * HELIX_RADIUS - 50, translateZ: startZ + totalDist, scale: 1, opacity: 1, duration: 7, ease: 'power2.in' },
      0
    )
  })
  bCards.forEach((el, i) => {
    const startZ = -i * Z_SPACING - 100
    const startAngle = ((i * 60 + 180) * Math.PI) / 180
    const endAngle = startAngle + Math.PI * 4
    master.fromTo(el,
      { x: Math.cos(startAngle) * HELIX_RADIUS, y: Math.sin(startAngle) * HELIX_RADIUS - 50, translateZ: startZ, scale: 0.7 + (1 - i * 0.04), opacity: 0.4 + (1 - i * 0.06) },
      { x: Math.cos(endAngle) * (HELIX_RADIUS + 30), y: Math.sin(endAngle) * HELIX_RADIUS - 50, translateZ: startZ + totalDist, scale: 1, opacity: 1, duration: 7, ease: 'power2.in' },
      0
    )
  })
  rungEls.forEach((el, i) => {
    master.fromTo(el,
      { translateZ: -i * Z_SPACING - 100, scaleY: 0.7 + (1 - i * 0.05), opacity: 0.4 },
      { translateZ: -i * Z_SPACING - 100 + totalDist, scaleY: 1.3, opacity: 0.7, duration: 7, ease: 'power2.in' },
      0
    )
  })

  // 整体旋转展示
  if (helixRef.value) {
    master.to(helixRef.value, { rotateY: 20, duration: 3.5, ease: 'sine.inOut' }, 0)
    master.to(helixRef.value, { rotateY: -20, duration: 3.5, ease: 'sine.inOut' }, 3.5)
  }
  if (coreGlow.value) master.to(coreGlow.value, { scale: 2, opacity: 0.6, duration: 7, ease: 'power2.in' }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 7 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupDNAHelix() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.dna-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: radial-gradient(ellipse at 50% 50%, #0a0e22 0%, #060914 50%, #030510 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.dna-core-glow { position: absolute; width: 10vw; height: 80vh; top: 10vh; left: 50%; transform: translateX(-50%); background: linear-gradient(180deg, transparent 0%, rgba(80,200,180,.15) 30%, rgba(120,180,240,.2) 50%, rgba(160,120,240,.15) 70%, transparent 100%); filter: blur(40px); pointer-events: none; z-index: 0; will-change: transform,opacity; }
.dna-ambient { position: absolute; width: 50vw; height: 40vw; top: 20vh; left: 25vw; border-radius: 50%; background: radial-gradient(ellipse, rgba(100,160,220,.08) 0%, transparent 70%); filter: blur(60px); pointer-events: none; z-index: 0; }
.dna-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2; &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(100,180,220,.2); } }
.dna-track { position: relative; width: 100%; }
.dna-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.dna-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.dna-kicker { display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .3em; text-transform: uppercase; color: rgba(100,200,180,.7); background: rgba(60,180,160,.08); backdrop-filter: blur(8px); border: 1px solid rgba(80,180,160,.18); border-radius: 999px; padding: .22rem .9rem; margin-bottom: .5rem; }
.dna-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.dna-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #68c8b8; will-change: transform,opacity,filter;
  &--helix { background: linear-gradient(135deg, #68c8b8, #78a8f0, #a878e0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(100,200,180,.5)); }
}
.dna-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #68c8b8, #78a8f0, #a878e0, transparent); transform-origin: center; }
.dna-sub { margin: 0; font-size: clamp(.64rem, .9vw, .78rem); color: rgba(100,180,170,.3); max-width: 550px; margin-inline: auto; }

.dna-scene { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; perspective: 600px; perspective-origin: 50% 50%; will-change: transform,opacity; }
.dna-helix { position: relative; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

.dna-card {
  position: absolute; width: min(14vw, 110px); height: min(10vw, 80px);
  margin-left: calc(min(14vw, 110px) / -2); margin-top: calc(min(10vw, 80px) / -2);
  transform-style: preserve-3d; will-change: transform,opacity;
  border-radius: 6px; overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,.3);
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__glow { position: absolute; inset: 0; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); pointer-events: none; border-radius: 6px; }
  &__idx { position: absolute; top: 3px; left: 6px; font-size: .5rem; font-weight: 700; color: rgba(255,255,255,.7); text-shadow: 0 1px 3px rgba(0,0,0,.5); }
  &--strand-a { border: 2px solid rgba(100,200,180,.4); }
  &--strand-b { border: 2px solid rgba(160,120,240,.4); }
}

.dna-rung {
  position: absolute; width: 260px; height: 2px; left: -130px; top: -1px;
  background: linear-gradient(90deg, rgba(100,200,180,.5), rgba(160,120,240,.3), rgba(160,120,240,.3), rgba(100,200,180,.5));
  transform-style: preserve-3d; will-change: transform,opacity;
}

.dna-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; align-items: center; gap: .4rem; pointer-events: none; }
.dna-info__dot { width: 6px; height: 6px; border-radius: 50%; background: #68c8b8; box-shadow: 0 0 12px rgba(100,200,180,.6); animation: dna-pulse 2s ease-in-out infinite; }
@keyframes dna-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(2.4); opacity: .4; } }
.dna-info__text { font-size: .62rem; font-weight: 600; color: rgba(100,200,180,.6); letter-spacing: .12em; }
.dna-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(100,180,160,.05); }
.dna-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #68c8b8, #78a8f0, #a878e0, #68c8b8); background-size: 200% 100%; box-shadow: 0 0 12px rgba(100,200,180,.5); }

@media (max-width: 768px) { .dna-header { top: 2vh; } .dna-kicker { font-size: .42rem; padding: .1rem .4rem; } .dna-title__c { font-size: 1.3rem; } .dna-card { width: 16vw; height: 11vw; margin-left: -8vw; margin-top: -5.5vw; } }
</style>
