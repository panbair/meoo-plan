<template>
  <section ref="rootRef" class="lu-root">
    <div ref="particlesRef" class="lu-particles"><span v-for="p in plist" :key="p.id" class="lu-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="lu-stage">

      <div ref="bgRef" class="lu-bg"><img :src="imgs.bg" class="lu-bg__img" /></div>
      <div ref="overlayRef" class="lu-overlay"></div>

      <!-- ══════ 4张图一字排开 ══════ -->
      <div ref="rowRef" class="lu-row">
        <div ref="card0Ref" class="lu-card">
          <img :src="imgs.i1" class="lu-card__img" />
          <span class="lu-card__label">晨 曦 山 峦</span>
        </div>
        <div ref="card1Ref" class="lu-card">
          <img :src="imgs.i2" class="lu-card__img" />
          <span class="lu-card__label">海 洋 落 日</span>
        </div>
        <div ref="card2Ref" class="lu-card">
          <img :src="imgs.i3" class="lu-card__img" />
          <span class="lu-card__label">湖 泊 倒 影</span>
        </div>
        <div ref="card3Ref" class="lu-card">
          <img :src="imgs.i4" class="lu-card__img" />
          <span class="lu-card__label">森 林 花 卉</span>
        </div>
      </div>

      <header ref="hRef" class="lu-header">
        <span ref="kRef" class="lu-kicker">▸ 向下滚动 · 列队上移 ◂</span>
        <h1 class="lu-title"><span ref="t1Ref" class="lu-t__w lu-t__w--1">列</span><span ref="t2Ref" class="lu-t__w lu-t__w--2">队</span><span ref="t3Ref" class="lu-t__w lu-t__w--3">上</span><span ref="t4Ref" class="lu-t__w lu-t__w--1">移</span></h1>
        <div ref="dRef" class="lu-divider"></div><p ref="sRef" class="lu-sub">依次登场 · 列队前行 · 四图铺满屏</p>
      </header>

      <div class="lu-progress"><div ref="pfRef" class="lu-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TC = () => void

const imgs = {
  bg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  i1: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80',
  i2: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  i3: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',
  i4: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
}

interface P { id: number; style: Record<string, string> }
const pr = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
const plist = ref<P[]>(Array.from({ length: 20 }, (_, i) => ({
  id: i, style: { '--px': `${pr(i * 3 + 1) * 100}%`, '--py': `${pr(i * 3 + 2) * 100}%`, '--ps': `${2 + pr(i * 3 + 3) * 3}px`, '--pd': `${8 + pr(i * 5 + 7) * 14}s`, '--pdl': `${pr(i * 7 + 13) * -15}s`, '--po': `${.06 + pr(i * 2 + 5) * .2}` },
})))

const rootRef = ref<HTMLElement | null>(null), stageRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null), overlayRef = ref<HTMLElement | null>(null)
const rowRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null), card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null), card3Ref = ref<HTMLElement | null>(null)
const hRef = ref<HTMLElement | null>(null), kRef = ref<HTMLElement | null>(null)
const t1Ref = ref<HTMLElement | null>(null), t2Ref = ref<HTMLElement | null>(null), t3Ref = ref<HTMLElement | null>(null), t4Ref = ref<HTMLElement | null>(null)
const dRef = ref<HTMLElement | null>(null), sRef = ref<HTMLElement | null>(null)
const pfRef = ref<HTMLElement | null>(null), particlesRef = ref<HTMLElement | null>(null)
const cleanupFns: TC[] = []

function setup() {
  const p = rootRef.value, st = stageRef.value
  if (!p || !st || !bgRef.value || !overlayRef.value) return

  // 初始状态
  gsap.set(st, { opacity: 0 })
  gsap.set(bgRef.value, { autoAlpha: 1, scale: 1.04 })
  gsap.set(overlayRef.value, { autoAlpha: 0 })

  // 4张卡片初始在屏幕下方（从底部外开始）
  const cards = [card0Ref.value, card1Ref.value, card2Ref.value, card3Ref.value]
  cards.forEach((c, i) => {
    gsap.set(c, { y: '60vh', autoAlpha: 0 })
  })

  gsap.set(hRef.value, { autoAlpha: 0, y: 28 })
  gsap.set(kRef.value, { autoAlpha: 0, scale: .7 })
  gsap.set([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean), { autoAlpha: 0, y: 16, scale: .5 })
  gsap.set(dRef.value, { scaleX: 0, autoAlpha: 0 })
  gsap.set(sRef.value, { autoAlpha: 0, y: 8 })
  gsap.set(particlesRef.value, { opacity: .2 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: p,
      start: 'top 100%',
      end: 'bottom 25%',
      scrub: 1.5,
      toggleActions: 'play reverse play reverse',
    },
  })

  // —— 入场 ——
  tl.to(st, { opacity: 1, duration: .03, ease: 'power2.out' }, .01)
  tl.to(hRef.value, { autoAlpha: 1, y: 0, duration: .04, ease: 'power2.out' }, .02)
  tl.to(kRef.value, { autoAlpha: 1, scale: 1, duration: .03, ease: 'power2.out' }, .03)
  tl.to([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean), { autoAlpha: 1, y: 0, scale: 1, duration: .04, stagger: .03, ease: 'back.out(1.8)' }, .03)
  tl.to(dRef.value, { scaleX: 1, autoAlpha: 1, duration: .03, ease: 'power3.inOut' }, .06)
  tl.to(sRef.value, { autoAlpha: 1, y: 0, duration: .03, ease: 'power2.out' }, .07)
  tl.to(particlesRef.value, { opacity: .5, duration: .04, ease: 'power2.in' }, .02)

  // 遮罩淡入
  tl.to(overlayRef.value, { autoAlpha: 1, duration: .06, ease: 'power2.in' }, .06)
  tl.to(bgRef.value, { scale: 1, filter: 'brightness(0.4)', duration: .06, ease: 'power2.out' }, .06)

  // ══════ 4张图依次从底部向上移动 ══════
  // 第1张：0.10 开始上移，从 60vh → 0
  tl.to(card0Ref.value, { autoAlpha: 1, duration: .03, ease: 'power2.out' }, .10)
  tl.to(card0Ref.value, { y: 0, duration: .12, ease: 'power3.out' }, .10)

  // 第2张：0.18 开始上移
  tl.to(card1Ref.value, { autoAlpha: 1, duration: .03, ease: 'power2.out' }, .18)
  tl.to(card1Ref.value, { y: 0, duration: .12, ease: 'power3.out' }, .18)

  // 第3张：0.26 开始上移
  tl.to(card2Ref.value, { autoAlpha: 1, duration: .03, ease: 'power2.out' }, .26)
  tl.to(card2Ref.value, { y: 0, duration: .12, ease: 'power3.out' }, .26)

  // 第4张：0.34 开始上移
  tl.to(card3Ref.value, { autoAlpha: 1, duration: .03, ease: 'power2.out' }, .34)
  tl.to(card3Ref.value, { y: 0, duration: .12, ease: 'power3.out' }, .34)

  // 四张到位后定格
  tl.to(bgRef.value, { filter: 'brightness(0.3)', duration: .08, ease: 'power2.in' }, .46)

  // 收尾
  tl.to(overlayRef.value, { autoAlpha: .85, duration: .06, ease: 'power2.in' }, .54)
  tl.to([card0Ref.value, card1Ref.value, card2Ref.value, card3Ref.value], { y: '-8vh', duration: .08, ease: 'power2.in' }, .56)
  tl.to(hRef.value, { autoAlpha: .15, y: -6, duration: .04, ease: 'power2.in' }, .58)
  tl.to(particlesRef.value, { opacity: .1, duration: .04 }, .60)
  tl.to(st, { opacity: .35, duration: .04 }, .62)

  tl.to(pfRef.value, { width: '100%', duration: .7, ease: 'none' }, 0)
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function hr() { ScrollTrigger.refresh(true) }
onMounted(() => { requestAnimationFrame(() => setup()); window.addEventListener('resize', hr) })
onUnmounted(() => { window.removeEventListener('resize', hr); ScrollTrigger.getAll().forEach(s => s.kill()); cleanupFns.forEach(f => f()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.lu-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #060410; font-family: 'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif }
.lu-particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; will-change: opacity }
.lu-particle { --px: 50%; --py: 50%; --ps: 3px; --pd: 12s; --pdl: 0s; --po: .3; position: absolute; left: var(--px); top: var(--py); width: var(--ps); height: var(--ps); border-radius: 50%; background: radial-gradient(circle, rgba(255,200,150,.85) 0%, rgba(150,120,220,.4) 40%, transparent 70%); box-shadow: 0 0 calc(var(--ps)*3) rgba(170,140,230,.4), 0 0 calc(var(--ps)*6) rgba(255,170,110,.2); opacity: var(--po); animation: lu-f var(--pd) var(--pdl) infinite ease-in-out; will-change: transform, opacity }
@keyframes lu-f { 0% { transform: translateY(0) translateX(0) scale(1); opacity: var(--po) } 25% { transform: translateY(-10vh) translateX(2vw) scale(1.5); opacity: calc(var(--po)*1.4) } 50% { transform: translateY(-20vh) translateX(-3vw) scale(.7); opacity: calc(var(--po)*.5) } 75% { transform: translateY(-7vh) translateX(4vw) scale(1.3); opacity: calc(var(--po)*1.1) } 100% { transform: translateY(0) translateX(0) scale(1); opacity: var(--po) } }
.lu-stage { position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 2; will-change: opacity }
.lu-bg { position: absolute; inset: 0; z-index: 1; will-change: transform, filter }
.lu-bg__img { width: 100%; height: 100%; object-fit: cover; display: block }
.lu-overlay { position: absolute; inset: 0; z-index: 2; pointer-events: none; background: rgba(4,2,10,.65); backdrop-filter: blur(2px); will-change: opacity }

/* 一字排开 */
.lu-row { position: absolute; inset: 0; z-index: 3; display: flex; align-items: center; justify-content: center; gap: 30px }
.lu-card { width: calc((100vw - 150px) / 4); text-align: center; will-change: transform, opacity }
.lu-card__img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 10px; display: block; box-shadow: 0 0 0 3px rgba(255,190,140,.25), 0 16px 48px rgba(0,0,0,.55) }
.lu-card__label { display: block; margin-top: .4rem; font-size: .62rem; font-weight: 700; letter-spacing: .16em; color: rgba(220,180,150,.7) }

.lu-header { position: absolute; top: 4vh; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: min(88vw,520px); pointer-events: none; will-change: transform, opacity }
.lu-kicker { display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .22em; color: rgba(200,165,140,.6); background: rgba(10,5,20,.45); backdrop-filter: blur(8px); border: 1px solid rgba(170,130,220,.16); border-radius: 999px; padding: .2rem .8rem; margin-bottom: .4rem; will-change: transform, opacity }
.lu-title { margin: 0; display: flex; justify-content: center; gap: .04em }
.lu-t__w { font-size: clamp(2rem,5vw,3.8rem); font-weight: 900; will-change: transform, opacity; &--1 { background: linear-gradient(180deg,#ffa880,#f06848); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text } &--2 { background: linear-gradient(180deg,#90b0f0,#5078d8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text } &--3 { background: linear-gradient(180deg,#ffe0a8,#d09038); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter: drop-shadow(0 2px 10px rgba(240,180,100,.5)) } }
.lu-divider { width: 60px; height: 1.5px; margin: .3rem auto .4rem; border-radius: 2px; background: linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent); transform-origin: center; will-change: transform, opacity }
.lu-sub { margin: 0; font-size: clamp(.52rem,.78vw,.66rem); color: rgba(185,155,135,.36); max-width: 420px; margin-inline: auto; will-change: transform, opacity }

.lu-progress { position: absolute; left: 0; bottom: 0; z-index: 25; width: 100%; height: 2px; background: rgba(255,170,110,.02) }
.lu-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060); background-size: 300% 100%; box-shadow: 0 0 10px rgba(240,130,80,.4); animation: lu-ps 4s linear infinite }
@keyframes lu-ps { 0% { background-position: 0% 50% } 100% { background-position: 300% 50% } }

@media (max-width: 768px) {
  .lu-header { top: 2.5vh } .lu-kicker { font-size: .44rem } .lu-t__w { font-size: 1.5rem } .lu-sub { font-size: .48rem }
  .lu-row { gap: 15px } .lu-card { width: calc((100vw - 75px) / 4) } .lu-card__label { font-size: .45rem }
}
</style>
