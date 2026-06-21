<template>
  <section ref="rootRef" class="go-root">
    <div ref="particlesRef" class="go-particles">
      <span v-for="p in plist" :key="p.id" class="go-particle" :style="p.style"></span>
    </div>

    <div ref="stageRef" class="go-stage">
      <!-- ══════ 底层（始终可见，最后一层门后）══════ -->
      <div class="go-layer" style="z-index:3">
        <img :src="imgs.i1" class="go-layer__img" />
        <div class="go-layer__vignette"></div>
      </div>

      <!-- ══════ 第1层门 → 揭示第2层 ══════ -->
      <div ref="gate1Ref" class="go-gate-layer" style="z-index:4">
        <div ref="g1L" class="go-gate go-gate--left"><img :src="imgs.i2" class="go-gate__img go-gate__img--left" /><div class="go-gate__shadow go-gate__shadow--left"></div></div>
        <div ref="g1R" class="go-gate go-gate--right"><img :src="imgs.i2" class="go-gate__img go-gate__img--right" /><div class="go-gate__shadow go-gate__shadow--right"></div></div>
        <div ref="g1EdgeRef" class="go-edge"></div>
      </div>

      <!-- ══════ 第2层门 → 揭示第3层 ══════ -->
      <div ref="gate2Ref" class="go-gate-layer" style="z-index:5">
        <div ref="g2L" class="go-gate go-gate--left"><img :src="imgs.i3" class="go-gate__img go-gate__img--left" /><div class="go-gate__shadow go-gate__shadow--left"></div></div>
        <div ref="g2R" class="go-gate go-gate--right"><img :src="imgs.i3" class="go-gate__img go-gate__img--right" /><div class="go-gate__shadow go-gate__shadow--right"></div></div>
        <div ref="g2EdgeRef" class="go-edge"></div>
      </div>

      <!-- ══════ 第3层门 → 揭示底层 ══════ -->
      <div ref="gate3Ref" class="go-gate-layer" style="z-index:6">
        <div ref="g3L" class="go-gate go-gate--left"><img :src="imgs.i4" class="go-gate__img go-gate__img--left" /><div class="go-gate__shadow go-gate__shadow--left"></div></div>
        <div ref="g3R" class="go-gate go-gate--right"><img :src="imgs.i4" class="go-gate__img go-gate__img--right" /><div class="go-gate__shadow go-gate__shadow--right"></div></div>
        <div ref="g3EdgeRef" class="go-edge"></div>
      </div>

      <!-- ══════ 标题 ══════ -->
      <header ref="hRef" class="go-header">
        <span ref="kRef" class="go-kicker">◈ 向下滚动 · 双门开启 ◈</span>
        <h1 class="go-title">
          <span ref="t1Ref" class="go-t__w go-t__w--1">双</span>
          <span ref="t2Ref" class="go-t__w go-t__w--2">门</span>
          <span ref="t3Ref" class="go-t__w go-t__w--3">启</span>
          <span ref="t4Ref" class="go-t__w go-t__w--1">世</span>
        </h1>
        <div ref="dRef" class="go-divider"></div>
        <p ref="sRef" class="go-sub">双门开启 · 层层递进 · 每一扇门后都是新世界</p>
      </header>

      <div ref="dotsRef" class="go-dots">
        <span ref="dot1Ref" class="go-dots__d go-dots__d--on"></span>
        <span ref="dot2Ref" class="go-dots__d"></span>
        <span ref="dot3Ref" class="go-dots__d"></span>
        <span ref="dot4Ref" class="go-dots__d"></span>
      </div>

      <div class="go-progress"><div ref="pfRef" class="go-progress__fill"></div></div>
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
  i1: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  i2: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
  i3: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  i4: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
}

interface P { id: number; style: Record<string, string> }
const pr = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
const plist = ref<P[]>(Array.from({ length: 25 }, (_, i) => ({
  id: i, style: {
    '--px': `${pr(i * 3 + 1) * 100}%`, '--py': `${pr(i * 3 + 2) * 100}%`,
    '--ps': `${2 + pr(i * 3 + 3) * 3}px`, '--pd': `${8 + pr(i * 5 + 7) * 14}s`,
    '--pdl': `${pr(i * 7 + 13) * -15}s`, '--po': `${.08 + pr(i * 2 + 5) * .28}`,
  },
})))

const rootRef = ref<HTMLElement | null>(null), stageRef = ref<HTMLElement | null>(null)
const gate1Ref = ref<HTMLElement | null>(null), gate2Ref = ref<HTMLElement | null>(null), gate3Ref = ref<HTMLElement | null>(null)
const g1L = ref<HTMLElement | null>(null), g1R = ref<HTMLElement | null>(null), g1EdgeRef = ref<HTMLElement | null>(null)
const g2L = ref<HTMLElement | null>(null), g2R = ref<HTMLElement | null>(null), g2EdgeRef = ref<HTMLElement | null>(null)
const g3L = ref<HTMLElement | null>(null), g3R = ref<HTMLElement | null>(null), g3EdgeRef = ref<HTMLElement | null>(null)
const hRef = ref<HTMLElement | null>(null), kRef = ref<HTMLElement | null>(null)
const t1Ref = ref<HTMLElement | null>(null), t2Ref = ref<HTMLElement | null>(null), t3Ref = ref<HTMLElement | null>(null), t4Ref = ref<HTMLElement | null>(null)
const dRef = ref<HTMLElement | null>(null), sRef = ref<HTMLElement | null>(null)
const dotsRef = ref<HTMLElement | null>(null)
const dot1Ref = ref<HTMLElement | null>(null), dot2Ref = ref<HTMLElement | null>(null), dot3Ref = ref<HTMLElement | null>(null), dot4Ref = ref<HTMLElement | null>(null)
const pfRef = ref<HTMLElement | null>(null), particlesRef = ref<HTMLElement | null>(null)
const cleanupFns: TC[] = []

// 双门开启：左门绕左轴 rotateY，右门绕右轴 rotateY
function gateOpen(tl: gsap.core.Timeline, left: HTMLElement, right: HTMLElement, edge: HTMLElement, startT: number) {
  gsap.set(left, { rotationY: 0, autoAlpha: 1, transformOrigin: 'left center' })
  gsap.set(right, { rotationY: 0, autoAlpha: 1, transformOrigin: 'right center' })
  gsap.set(edge, { autoAlpha: 0, scaleY: 0.1 })

  // 门缝发光出现
  tl.to(edge, { autoAlpha: 0.6, scaleY: 0.5, duration: 0.04, ease: 'power2.out' }, startT)
  tl.to(edge, { autoAlpha: 1, scaleY: 1, duration: 0.04, ease: 'power2.out' }, startT + 0.03)
  // 双门旋转开启
  tl.to(left, { rotationY: -90, duration: 0.16, ease: 'power3.in' }, startT + 0.04)
  tl.to(right, { rotationY: 90, duration: 0.16, ease: 'power3.in' }, startT + 0.04)
  // 门淡出
  tl.to([left, right], { autoAlpha: 0, duration: 0.06, ease: 'power2.in' }, startT + 0.18)
  // 门缝消隐
  tl.to(edge, { autoAlpha: 0, duration: 0.08, ease: 'power2.in' }, startT + 0.20)
}

function setup() {
  const p = rootRef.value, st = stageRef.value
  if (!p || !st || !gate1Ref.value) return

  gsap.set(st, { opacity: 0 })
  // 门初始闭合
  ;[g1L.value,g1R.value,g2L.value,g2R.value,g3L.value,g3R.value].forEach(g => gsap.set(g,{rotationY:0,autoAlpha:1}))
  gsap.set(hRef.value, { autoAlpha: 0, y: 28 }); gsap.set(kRef.value, { autoAlpha: 0, scale: .7 })
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean), { autoAlpha: 0, y: 16, scale: .5 })
  gsap.set(dRef.value, { scaleX: 0, autoAlpha: 0 }); gsap.set(sRef.value, { autoAlpha: 0, y: 8 })
  gsap.set(dotsRef.value, { autoAlpha: 0 }); gsap.set(particlesRef.value, { opacity: .25 })

  const tl = gsap.timeline({ scrollTrigger: { trigger: p, start: 'top 100%', end: 'bottom 40%', scrub: 1.5, toggleActions: 'play reverse play reverse' } })
  tl.to(st, { opacity: 1, duration: .04, ease: 'power2.out' }, .01)
  tl.to(hRef.value, { autoAlpha: 1, y: 0, duration: .05, ease: 'power2.out' }, .02)
  tl.to(kRef.value, { autoAlpha: 1, scale: 1, duration: .04, ease: 'power2.out' }, .03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean), { autoAlpha: 1, y: 0, scale: 1, duration: .05, stagger: .03, ease: 'back.out(1.8)' }, .03)
  tl.to(dRef.value, { scaleX: 1, autoAlpha: 1, duration: .04, ease: 'power3.inOut' }, .06)
  tl.to(sRef.value, { autoAlpha: 1, y: 0, duration: .04, ease: 'power2.out' }, .07)
  tl.to(dotsRef.value, { autoAlpha: 1, duration: .04, ease: 'power2.out' }, .07)
  tl.to(particlesRef.value, { opacity: .6, duration: .06, ease: 'power2.in' }, .02)

  // 3次开门
  gateOpen(tl, g1L.value!, g1R.value!, g1EdgeRef.value!, .10)
  tl.to(dot1Ref.value, { backgroundColor: 'rgba(255,255,255,.15)', duration: .04 }, .20)
  tl.to(dot2Ref.value, { backgroundColor: 'rgba(255,180,110,.9)', duration: .04 }, .26)

  gateOpen(tl, g2L.value!, g2R.value!, g2EdgeRef.value!, .28)
  tl.to(dot2Ref.value, { backgroundColor: 'rgba(255,255,255,.15)', duration: .04 }, .38)
  tl.to(dot3Ref.value, { backgroundColor: 'rgba(255,180,110,.9)', duration: .04 }, .44)

  gateOpen(tl, g3L.value!, g3R.value!, g3EdgeRef.value!, .46)
  tl.to(dot3Ref.value, { backgroundColor: 'rgba(255,255,255,.15)', duration: .04 }, .56)
  tl.to(dot4Ref.value, { backgroundColor: 'rgba(255,180,110,.9)', duration: .04 }, .62)

  tl.to(dot4Ref.value, { backgroundColor: 'rgba(255,255,255,.12)', duration: .04 }, .68)
  tl.to(hRef.value, { autoAlpha: .15, y: -6, duration: .06, ease: 'power2.in' }, .72)
  tl.to(dotsRef.value, { autoAlpha: 0, duration: .05, ease: 'power2.in' }, .72)
  tl.to(particlesRef.value, { opacity: .12, duration: .08 }, .76)
  tl.to(st, { opacity: .4, duration: .08 }, .78)
  tl.to(pfRef.value, { width: '100%', duration: 1, ease: 'none' }, 0)
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function hr() { ScrollTrigger.refresh(true) }
onMounted(() => { requestAnimationFrame(() => setup()); window.addEventListener('resize', hr) })
onUnmounted(() => { window.removeEventListener('resize', hr); ScrollTrigger.getAll().forEach(s => s.kill()); cleanupFns.forEach(f => f()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.go-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #060410; font-family: 'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif }
.go-particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; will-change: opacity }
.go-particle { --px: 50%; --py: 50%; --ps: 3px; --pd: 12s; --pdl: 0s; --po: .3; position: absolute; left: var(--px); top: var(--py); width: var(--ps); height: var(--ps); border-radius: 50%; background: radial-gradient(circle, rgba(255,200,150,.85) 0%, rgba(150,120,220,.4) 40%, transparent 70%); box-shadow: 0 0 calc(var(--ps)*3) rgba(170,140,230,.4), 0 0 calc(var(--ps)*6) rgba(255,170,110,.2); opacity: var(--po); animation: go-f var(--pd) var(--pdl) infinite ease-in-out; will-change: transform, opacity }
@keyframes go-f { 0% { transform: translateY(0) translateX(0) scale(1); opacity: var(--po) } 25% { transform: translateY(-10vh) translateX(2vw) scale(1.5); opacity: calc(var(--po)*1.4) } 50% { transform: translateY(-20vh) translateX(-3vw) scale(.7); opacity: calc(var(--po)*.5) } 75% { transform: translateY(-7vh) translateX(4vw) scale(1.3); opacity: calc(var(--po)*1.1) } 100% { transform: translateY(0) translateX(0) scale(1); opacity: var(--po) } }
.go-stage { position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 2; will-change: opacity; perspective: 1200px }

.go-layer { position: absolute; inset: 0 }
.go-layer__img { width: 100%; height: 100%; object-fit: cover; display: block }
.go-layer__vignette { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 50% 40% at 50% 50%, transparent 30%, rgba(6,4,16,.5) 100%) }

/* ═══════════════════════ 双门 ═══════════════════════ */
.go-gate-layer { position: absolute; inset: 0 }
.go-gate { position: absolute; top: 0; width: 50%; height: 100%; overflow: hidden; will-change: transform, opacity; backface-visibility: hidden; -webkit-backface-visibility: hidden }
.go-gate--left { left: 0; transform-origin: left center }
.go-gate--right { right: 0; transform-origin: right center }
.go-gate__img { position: absolute; top: 0; width: 200%; height: 100%; object-fit: cover; display: block }
.go-gate__img--left { left: 0 }
.go-gate__img--right { right: 0 }

/* 门板内侧阴影 */
.go-gate__shadow { position: absolute; top: 0; width: 60px; height: 100%; pointer-events: none }
.go-gate__shadow--left { right: 0; background: linear-gradient(90deg, transparent, rgba(0,0,0,.3) 100%) }
.go-gate__shadow--right { left: 0; background: linear-gradient(270deg, transparent, rgba(0,0,0,.3) 100%) }

/* 门缝光 */
.go-edge { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 3px; height: 100%; z-index: 10; pointer-events: none; background: linear-gradient(180deg, transparent 0%, rgba(255,200,140,.3) 20%, rgba(255,240,210,.9) 50%, rgba(255,200,140,.3) 80%, transparent 100%); box-shadow: 0 0 14px rgba(255,170,110,.5), 0 0 36px rgba(255,140,80,.2); will-change: transform, opacity }

/* ═══════════════════════ 标题 ═══════════════════════ */
.go-header { position: absolute; top: 4vh; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: min(88vw,520px); pointer-events: none; will-change: transform, opacity }
.go-kicker { display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .22em; color: rgba(200,165,140,.6); background: rgba(10,5,20,.45); backdrop-filter: blur(8px); border: 1px solid rgba(170,130,220,.16); border-radius: 999px; padding: .2rem .8rem; margin-bottom: .4rem; will-change: transform, opacity }
.go-title { margin: 0; display: flex; justify-content: center; gap: .04em }
.go-t__w { font-size: clamp(2rem,5vw,3.8rem); font-weight: 900; will-change: transform, opacity; &--1 { background: linear-gradient(180deg,#ffa880,#f06848); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text } &--2 { background: linear-gradient(180deg,#90b0f0,#5078d8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text } &--3 { background: linear-gradient(180deg,#ffe0a8,#d09038); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter: drop-shadow(0 2px 10px rgba(240,180,100,.5)) } }
.go-divider { width: 60px; height: 1.5px; margin: .3rem auto .4rem; border-radius: 2px; background: linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent); transform-origin: center; will-change: transform, opacity }
.go-sub { margin: 0; font-size: clamp(.52rem,.78vw,.66rem); color: rgba(185,155,135,.36); max-width: 420px; margin-inline: auto; will-change: transform, opacity }
.go-dots { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 20; display: flex; gap: .6rem; pointer-events: none; will-change: opacity }
.go-dots__d { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.15); transition: background-color .3s }
.go-dots__d--on { background: rgba(255,170,110,.9) }
.go-progress { position: absolute; left: 0; bottom: 0; z-index: 25; width: 100%; height: 2px; background: rgba(255,170,110,.02) }
.go-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060); background-size: 300% 100%; box-shadow: 0 0 10px rgba(240,130,80,.4); animation: go-ps 4s linear infinite }
@keyframes go-ps { 0% { background-position: 0% 50% } 100% { background-position: 300% 50% } }
@media (max-width: 768px) { .go-header { top: 2.5vh } .go-kicker { font-size: .44rem } .go-t__w { font-size: 1.5rem } .go-sub { font-size: .48rem } }
</style>
