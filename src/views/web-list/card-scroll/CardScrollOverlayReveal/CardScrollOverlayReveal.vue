<template>
  <section ref="rootRef" class="or-root">
    <div ref="particlesRef" class="or-particles"><span v-for="p in plist" :key="p.id" class="or-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="or-stage">

      <!-- 背景全屏图 -->
      <div ref="bgRef" class="or-bg"><img :src="imgs.bg" class="or-bg__img" /></div>

      <!-- 半透明遮罩 -->
      <div ref="overlayRef" class="or-overlay"></div>

      <!-- 图片网格：2排×4列 -->
      <div ref="gridRef" class="or-grid">
        <!-- 第一排 -->
        <div ref="row1Ref" class="or-row">
          <div v-for="(t,i) in row1" :key="'r1-'+i" :ref="(el:any)=>setR1(el,i)" class="or-card">
            <img :src="t.u" class="or-card__img" />
            <span class="or-card__label">{{ t.l }}</span>
          </div>
        </div>
        <!-- 第二排 -->
        <div ref="row2Ref" class="or-row">
          <div v-for="(t,i) in row2" :key="'r2-'+i" :ref="(el:any)=>setR2(el,i)" class="or-card">
            <img :src="t.u" class="or-card__img" />
            <span class="or-card__label">{{ t.l }}</span>
          </div>
        </div>
      </div>

      <!-- 标题 -->
      <header ref="hRef" class="or-header">
        <span ref="kRef" class="or-kicker">◇ 向下滚动 · 浮层揭图 ◇</span>
        <h1 class="or-title"><span ref="t1Ref" class="or-t__w or-t__w--1">浮</span><span ref="t2Ref" class="or-t__w or-t__w--2">层</span><span ref="t3Ref" class="or-t__w or-t__w--3">揭</span><span ref="t4Ref" class="or-t__w or-t__w--1">图</span></h1>
        <div ref="dRef" class="or-divider"></div><p ref="sRef" class="or-sub">半遮半掩 · 层层揭开 · 八图尽现</p>
      </header>

      <div class="or-progress"><div ref="pfRef" class="or-progress__fill"></div></div>
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
}
const u = 'https://images.unsplash.com/photo'
const row1 = [
  { u: `${u}-1498579150354-977475b7ea0b?w=500&q=80`, l: '晨 曦' },
  { u: `${u}-1507525428034-b723cf961d3e?w=500&q=80`, l: '海 洋' },
  { u: `${u}-1470770903676-69b98201ea1c?w=500&q=80`, l: '湖 泊' },
  { u: `${u}-1441974231531-c6227db76b6e?w=500&q=80`, l: '森 林' },
]
const row2 = [
  { u: `${u}-1465146344425-f00d5f5c8f07?w=500&q=80`, l: '花 卉' },
  { u: `${u}-1490750967868-88aa4486c946?w=500&q=80`, l: '草 原' },
  { u: `${u}-1505144808419-1957a94ca61e?w=500&q=80`, l: '湖 光' },
  { u: `${u}-1469474968028-56623f02e42e?w=500&q=80`, l: '瀑 布' },
]

interface P { id: number; style: Record<string, string> }
const pr = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
const plist = ref<P[]>(Array.from({ length: 20 }, (_, i) => ({
  id: i, style: { '--px': `${pr(i * 3 + 1) * 100}%`, '--py': `${pr(i * 3 + 2) * 100}%`, '--ps': `${2 + pr(i * 3 + 3) * 3}px`, '--pd': `${8 + pr(i * 5 + 7) * 14}s`, '--pdl': `${pr(i * 7 + 13) * -15}s`, '--po': `${.06 + pr(i * 2 + 5) * .22}` },
})))

const rootRef = ref<HTMLElement | null>(null), stageRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null), overlayRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null), row1Ref = ref<HTMLElement | null>(null), row2Ref = ref<HTMLElement | null>(null)
const r1Cards: HTMLElement[] = [], r2Cards: HTMLElement[] = []
function setR1(el: any, i: number) { if (el instanceof HTMLElement) r1Cards[i] = el }
function setR2(el: any, i: number) { if (el instanceof HTMLElement) r2Cards[i] = el }
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
  gsap.set(bgRef.value, { autoAlpha: 1, scale: 1.05 })
  // 遮罩初始透明
  gsap.set(overlayRef.value, { autoAlpha: 0 })
  // 两排图初始在下方
  gsap.set(gridRef.value, { autoAlpha: 0 })
  gsap.set(row1Ref.value, { y: '30vh', autoAlpha: 0 })
  gsap.set(row2Ref.value, { y: '30vh', autoAlpha: 0 })
  // 每张卡片初始
  ;[...r1Cards, ...r2Cards].forEach(c => gsap.set(c, { autoAlpha: 0, y: 20, scale: .85 }))
  // 标题
  gsap.set(hRef.value, { autoAlpha: 0, y: 28 }); gsap.set(kRef.value, { autoAlpha: 0, scale: .7 })
  gsap.set([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean), { autoAlpha: 0, y: 16, scale: .5 })
  gsap.set(dRef.value, { scaleX: 0, autoAlpha: 0 }); gsap.set(sRef.value, { autoAlpha: 0, y: 8 })
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

  // —— 0.00–0.05: 入场 ——
  tl.to(st, { opacity: 1, duration: .03, ease: 'power2.out' }, .01)
  tl.to(hRef.value, { autoAlpha: 1, y: 0, duration: .04, ease: 'power2.out' }, .02)
  tl.to(kRef.value, { autoAlpha: 1, scale: 1, duration: .03, ease: 'power2.out' }, .03)
  tl.to([t1Ref.value, t2Ref.value, t3Ref.value, t4Ref.value].filter(Boolean), { autoAlpha: 1, y: 0, scale: 1, duration: .04, stagger: .03, ease: 'back.out(1.8)' }, .03)
  tl.to(dRef.value, { scaleX: 1, autoAlpha: 1, duration: .03, ease: 'power3.inOut' }, .05)
  tl.to(sRef.value, { autoAlpha: 1, y: 0, duration: .03, ease: 'power2.out' }, .06)
  tl.to(particlesRef.value, { opacity: .5, duration: .05, ease: 'power2.in' }, .02)

  // —— 0.06–0.15: 半透明遮罩淡入 + 背景微缩放 ——
  tl.to(overlayRef.value, { autoAlpha: 1, duration: .09, ease: 'power2.inOut' }, .06)
  tl.to(bgRef.value, { scale: 1, filter: 'brightness(0.5)', duration: .09, ease: 'power2.out' }, .06)

  // —— 0.12–0.55: 第一排 4 张依次上移出现（每张慢 ~500ms）——
  tl.to(gridRef.value, { autoAlpha: 1, duration: .02 }, .12)
  tl.to(row1Ref.value, { y: 0, autoAlpha: 1, duration: .14, ease: 'power3.out' }, .12)
  r1Cards.forEach((c, i) => {
    tl.to(c, { autoAlpha: 1, y: 0, scale: 1, duration: .06, ease: 'back.out(1.5)' }, .14 + i * .12)
  })

  // —— 0.50–0.93: 第二排 4 张依次上移出现 ——
  tl.to(row2Ref.value, { y: 0, autoAlpha: 1, duration: .14, ease: 'power3.out' }, .50)
  r2Cards.forEach((c, i) => {
    tl.to(c, { autoAlpha: 1, y: 0, scale: 1, duration: .06, ease: 'back.out(1.5)' }, .52 + i * .12)
  })

  // —— 0.88–0.94: 两排定格，背景继续暗 ——
  tl.to(bgRef.value, { filter: 'brightness(0.3)', duration: .10, ease: 'power2.in' }, .88)

  // —— 0.94–1.00: 收尾 ——
  tl.to(overlayRef.value, { autoAlpha: .85, duration: .06, ease: 'power2.in' }, .94)
  tl.to([row1Ref.value, row2Ref.value], { y: '-8vh', duration: .08, ease: 'power2.in' }, .94)
  tl.to(hRef.value, { autoAlpha: .15, y: -6, duration: .04, ease: 'power2.in' }, .95)
  tl.to(particlesRef.value, { opacity: .1, duration: .04 }, .96)
  tl.to(st, { opacity: .35, duration: .04 }, .97)

  tl.to(pfRef.value, { width: '100%', duration: 1, ease: 'none' }, 0)
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function hr() { ScrollTrigger.refresh(true) }
onMounted(() => { requestAnimationFrame(() => setup()); window.addEventListener('resize', hr) })
onUnmounted(() => { window.removeEventListener('resize', hr); ScrollTrigger.getAll().forEach(s => s.kill()); cleanupFns.forEach(f => f()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.or-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #060410; font-family: 'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif }
.or-particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; will-change: opacity }
.or-particle { --px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:or-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity }
@keyframes or-f { 0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)} }
.or-stage { position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 2; will-change: opacity }

/* 背景全屏图 */
.or-bg { position: absolute; inset: 0; z-index: 1; will-change: transform, filter }
.or-bg__img { width: 100%; height: 100%; object-fit: cover; display: block }

/* 半透明遮罩 */
.or-overlay { position: absolute; inset: 0; z-index: 2; pointer-events: none; background: rgba(4,2,10,.7); backdrop-filter: blur(2px); will-change: opacity }

/* 图片网格 */
.or-grid { position: absolute; inset: 0; z-index: 3; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; will-change: opacity }

.or-row { display: flex; gap: 30px; will-change: transform, opacity }

.or-card { width: calc((100vw - 150px) / 4); text-align: center; will-change: transform, opacity }
.or-card__img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 8px; display: block; box-shadow: 0 0 0 2px rgba(255,190,140,.22), 0 14px 40px rgba(0,0,0,.5) }
.or-card__label { display: block; margin-top: .35rem; font-size: .6rem; font-weight: 700; letter-spacing: .14em; color: rgba(220,180,150,.7) }

/* 标题 */
.or-header { position: absolute; top: 4vh; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: min(88vw,520px); pointer-events: none; will-change: transform, opacity }
.or-kicker { display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .22em; color: rgba(200,165,140,.6); background: rgba(10,5,20,.45); backdrop-filter: blur(8px); border: 1px solid rgba(170,130,220,.16); border-radius: 999px; padding: .2rem .8rem; margin-bottom: .4rem; will-change: transform, opacity }
.or-title { margin: 0; display: flex; justify-content: center; gap: .04em }
.or-t__w { font-size: clamp(2rem,5vw,3.8rem); font-weight: 900; will-change: transform, opacity; &--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))} }
.or-divider { width: 60px; height: 1.5px; margin: .3rem auto .4rem; border-radius: 2px; background: linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent); transform-origin: center; will-change: transform, opacity }
.or-sub { margin: 0; font-size: clamp(.52rem,.78vw,.66rem); color: rgba(185,155,135,.36); max-width: 420px; margin-inline: auto; will-change: transform, opacity }

.or-progress { position: absolute; left: 0; bottom: 0; z-index: 25; width: 100%; height: 2px; background: rgba(255,170,110,.02) }
.or-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060); background-size: 300% 100%; box-shadow: 0 0 10px rgba(240,130,80,.4); animation: or-ps 4s linear infinite }
@keyframes or-ps { 0%{background-position:0% 50%}100%{background-position:300% 50%} }

@media (max-width:768px) {
  .or-header{top:2.5vh}.or-kicker{font-size:.44rem}.or-t__w{font-size:1.5rem}.or-sub{font-size:.48rem}
  .or-row{gap:15px}.or-grid{gap:15px}.or-card{width:calc((100vw - 75px)/4)}.or-card__label{font-size:.45rem}
}
</style>
