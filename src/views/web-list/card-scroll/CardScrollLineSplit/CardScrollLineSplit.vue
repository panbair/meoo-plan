<template>
  <section ref="rootRef" class="ls-root">
    <div ref="particlesRef" class="ls-particles"><span v-for="p in plist" :key="p.id" class="ls-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="ls-stage">

      <!-- ══════ 底层 ══════ -->
      <div class="ls-back"><img :src="imgs.i1" class="ls-back__img" /></div>

      <!-- ══════ 第1层内容 ══════ -->
      <div ref="c1Ref" class="ls-content" style="z-index:4">
        <div ref="c1InnerRef" class="ls-content__inner">
          <h2 ref="c1tRef" class="ls-content__title">第一重</h2>
          <p ref="c1dRef" class="ls-content__desc">线启鸿蒙 · 裂变初开</p>
          <div ref="c1gRef" class="ls-content__grid">
            <div v-for="t in thumbs1" :key="t.l" class="ls-card"><img :src="t.u" class="ls-card__img" /><span class="ls-card__label">{{ t.l }}</span></div>
          </div>
        </div>
      </div>

      <!-- ══════ 第1层：线→矩形→分裂 ══════ -->
      <div ref="layer1Ref" class="ls-layer" style="z-index:5">
        <div ref="l1L" class="ls-half ls-half--left"><img :src="imgs.i2" class="ls-half__img ls-half__img--left" /></div>
        <div ref="l1R" class="ls-half ls-half--right"><img :src="imgs.i2" class="ls-half__img ls-half__img--right" /></div>
        <div ref="l1LineRef" class="ls-glow-line ls-glow-line--h"></div>
      </div>

      <!-- ══════ 第2层内容 ══════ -->
      <div ref="c2Ref" class="ls-content" style="z-index:7">
        <div ref="c2InnerRef" class="ls-content__inner">
          <h2 ref="c2tRef" class="ls-content__title">第二重</h2>
          <p ref="c2dRef" class="ls-content__desc">裂变新生 · 万象初萌</p>
          <div ref="c2gRef" class="ls-content__grid">
            <div v-for="t in thumbs2" :key="t.l" class="ls-card"><img :src="t.u" class="ls-card__img" /><span class="ls-card__label">{{ t.l }}</span></div>
          </div>
        </div>
      </div>

      <!-- ══════ 第2层：线→矩形→分裂 ══════ -->
      <div ref="layer2Ref" class="ls-layer" style="z-index:8">
        <div ref="l2L" class="ls-half ls-half--left"><img :src="imgs.i3" class="ls-half__img ls-half__img--left" /></div>
        <div ref="l2R" class="ls-half ls-half--right"><img :src="imgs.i3" class="ls-half__img ls-half__img--right" /></div>
        <div ref="l2LineRef" class="ls-glow-line ls-glow-line--h"></div>
      </div>

      <!-- ══════ 第3层内容 ══════ -->
      <div ref="c3Ref" class="ls-content" style="z-index:10">
        <div ref="c3InnerRef" class="ls-content__inner">
          <h2 ref="c3tRef" class="ls-content__title">第三重</h2>
          <p ref="c3dRef" class="ls-content__desc">三重蜕变 · 万象归真</p>
          <div ref="c3gRef" class="ls-content__grid">
            <div v-for="t in thumbs3" :key="t.l" class="ls-card"><img :src="t.u" class="ls-card__img" /><span class="ls-card__label">{{ t.l }}</span></div>
          </div>
        </div>
      </div>

      <!-- ══════ 第3层：线→矩形→分裂 ══════ -->
      <div ref="layer3Ref" class="ls-layer" style="z-index:11">
        <div ref="l3L" class="ls-half ls-half--left"><img :src="imgs.i4" class="ls-half__img ls-half__img--left" /></div>
        <div ref="l3R" class="ls-half ls-half--right"><img :src="imgs.i4" class="ls-half__img ls-half__img--right" /></div>
        <div ref="l3LineRef" class="ls-glow-line ls-glow-line--h"></div>
      </div>

      <!-- ══════ 标题 ══════ -->
      <header ref="hRef" class="ls-header">
        <span ref="kRef" class="ls-kicker">◇ 向下滚动 · 线启分裂 ◇</span>
        <h1 class="ls-title"><span ref="t1Ref" class="ls-t__w ls-t__w--1">线</span><span ref="t2Ref" class="ls-t__w ls-t__w--2">启</span><span ref="t3Ref" class="ls-t__w ls-t__w--3">分</span><span ref="t4Ref" class="ls-t__w ls-t__w--1">裂</span></h1>
        <div ref="dRef" class="ls-divider"></div><p ref="sRef" class="ls-sub">一线启幕 · 裂变重生 · 层层蜕变见真章</p>
      </header>
      <div ref="dotsRef" class="ls-dots"><span ref="dot1Ref" class="ls-dots__d ls-dots__d--on"></span><span ref="dot2Ref" class="ls-dots__d"></span><span ref="dot3Ref" class="ls-dots__d"></span><span ref="dot4Ref" class="ls-dots__d"></span></div>
      <div class="ls-progress"><div ref="pfRef" class="ls-progress__fill"></div></div>
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
  i1: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
  i2: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  i3: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
  i4: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
}
const u = 'https://images.unsplash.com/photo'
const thumbs1 = [{u:`${u}-1441974231531-c6227db76b6e?w=300&q=80`,l:'森 林'},{u:`${u}-1465146344425-f00d5f5c8f07?w=300&q=80`,l:'花 卉'},{u:`${u}-1490750967868-88aa4486c946?w=300&q=80`,l:'草 原'},{u:`${u}-1505144808419-1957a94ca61e?w=300&q=80`,l:'湖 光'}]
const thumbs2 = [{u:`${u}-1501785888041-af3ef285b470?w=300&q=80`,l:'山 色'},{u:`${u}-1518837695005-2083093ee35b?w=300&q=80`,l:'海 浪'},{u:`${u}-1472214103451-9374bd1c798e?w=300&q=80`,l:'秋 色'},{u:`${u}-1500382017468-9049fed747ef?w=300&q=80`,l:'田 野'}]
const thumbs3 = [{u:`${u}-1469474968028-56623f02e42e?w=300&q=80`,l:'瀑 布'},{u:`${u}-1426604966848-d7adac402bff?w=300&q=80`,l:'旷 野'},{u:`${u}-1447752875215-b2761acb3c5d?w=300&q=80`,l:'秘 境'},{u:`${u}-1446329813274-7c9036bd9a1f?w=300&q=80`,l:'自 然'}]

interface P { id: number; style: Record<string, string> }
const pr = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
const plist = ref<P[]>(Array.from({ length: 25 }, (_, i) => ({ id: i, style: { '--px': `${pr(i * 3 + 1) * 100}%`, '--py': `${pr(i * 3 + 2) * 100}%`, '--ps': `${2 + pr(i * 3 + 3) * 3}px`, '--pd': `${8 + pr(i * 5 + 7) * 14}s`, '--pdl': `${pr(i * 7 + 13) * -15}s`, '--po': `${.08 + pr(i * 2 + 5) * .28}` } })))

const rootRef = ref<HTMLElement | null>(null), stageRef = ref<HTMLElement | null>(null)
const layer1Ref = ref<HTMLElement | null>(null), l1L = ref<HTMLElement | null>(null), l1R = ref<HTMLElement | null>(null), l1LineRef = ref<HTMLElement | null>(null)
const layer2Ref = ref<HTMLElement | null>(null), l2L = ref<HTMLElement | null>(null), l2R = ref<HTMLElement | null>(null), l2LineRef = ref<HTMLElement | null>(null)
const layer3Ref = ref<HTMLElement | null>(null), l3L = ref<HTMLElement | null>(null), l3R = ref<HTMLElement | null>(null), l3LineRef = ref<HTMLElement | null>(null)
const c1Ref = ref<HTMLElement | null>(null), c1InnerRef = ref<HTMLElement | null>(null), c1tRef = ref<HTMLElement | null>(null), c1dRef = ref<HTMLElement | null>(null), c1gRef = ref<HTMLElement | null>(null)
const c2Ref = ref<HTMLElement | null>(null), c2InnerRef = ref<HTMLElement | null>(null), c2tRef = ref<HTMLElement | null>(null), c2dRef = ref<HTMLElement | null>(null), c2gRef = ref<HTMLElement | null>(null)
const c3Ref = ref<HTMLElement | null>(null), c3InnerRef = ref<HTMLElement | null>(null), c3tRef = ref<HTMLElement | null>(null), c3dRef = ref<HTMLElement | null>(null), c3gRef = ref<HTMLElement | null>(null)
const hRef = ref<HTMLElement | null>(null), kRef = ref<HTMLElement | null>(null), t1Ref = ref<HTMLElement | null>(null), t2Ref = ref<HTMLElement | null>(null), t3Ref = ref<HTMLElement | null>(null), t4Ref = ref<HTMLElement | null>(null)
const dRef = ref<HTMLElement | null>(null), sRef = ref<HTMLElement | null>(null), dotsRef = ref<HTMLElement | null>(null)
const dot1Ref = ref<HTMLElement | null>(null), dot2Ref = ref<HTMLElement | null>(null), dot3Ref = ref<HTMLElement | null>(null), dot4Ref = ref<HTMLElement | null>(null)
const pfRef = ref<HTMLElement | null>(null), particlesRef = ref<HTMLElement | null>(null)
const cleanupFns: TC[] = []

// 核心混合函数：线→纵向伸展→横向展开→分裂
function lineGrowThenSplit(
  tl: gsap.core.Timeline,
  left: HTMLElement, right: HTMLElement,
  lineEl: HTMLElement, startT: number,
) {
  // 初始：图片闭合（高度为极细线），line 可见
  gsap.set(left, { x: 0, autoAlpha: 1, height: '50px', width: '50vw', clipPath: 'inset(0 0 0 0)' })
  gsap.set(right, { x: 0, autoAlpha: 1, height: '50px', width: '50vw', clipPath: 'inset(0 0 0 0)' })
  gsap.set(lineEl, { autoAlpha: 1, scaleX: 1 })

  // 阶段1 (LineExpand): 纵向伸展 50px → 100vh
  tl.to([left, right], { height: '100vh', duration: 0.10, ease: 'power2.inOut' }, startT)
  tl.to(lineEl, { autoAlpha: 1.2, duration: 0.06, ease: 'power2.in' }, startT + 0.06)

  // 阶段2 (SplitReveal): 水平分裂 300px
  tl.to(left, { x: -300, duration: 0.10, ease: 'power3.out' }, startT + 0.12)
  tl.to(right, { x: 300, duration: 0.10, ease: 'power3.out' }, startT + 0.12)
  tl.to(lineEl, { autoAlpha: 1.5, scaleX: 1.5, duration: 0.08, ease: 'power2.in' }, startT + 0.14)

  // 阶段3: 加速拉到边缘
  tl.to(left, { x: '-52vw', duration: 0.12, ease: 'power3.in' }, startT + 0.24)
  tl.to(right, { x: '52vw', duration: 0.12, ease: 'power3.in' }, startT + 0.24)
  tl.to(lineEl, { autoAlpha: 0, scaleX: 3, duration: 0.10, ease: 'power2.in' }, startT + 0.28)
  tl.to([left, right], { autoAlpha: 0, duration: 0.05, ease: 'power2.in' }, startT + 0.34)
}

function showContent(
  tl: gsap.core.Timeline,
  cref: HTMLElement, cinner: HTMLElement,
  ctitle: HTMLElement, cdesc: HTMLElement, cgrid: HTMLElement,
  startT: number,
) {
  tl.to(cref, { autoAlpha: 1, duration: 0.03 }, startT)
  tl.to(cinner, { y: 0, duration: 0.10, ease: 'power3.out' }, startT)
  tl.to(ctitle, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, startT + 0.02)
  tl.to(cdesc, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, startT + 0.04)
  tl.to(cgrid, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, startT + 0.06)
}

function setup() {
  const p = rootRef.value, st = stageRef.value
  if (!p || !st || !layer1Ref.value) return

  gsap.set(st, { opacity: 0 })

  // 初始状态
  ;[l1L.value,l1R.value,l2L.value,l2R.value,l3L.value,l3R.value].forEach(d => gsap.set(d, { height: '50px', x: 0, autoAlpha: 1 }))
  ;[l1LineRef.value,l2LineRef.value,l3LineRef.value].forEach(l => gsap.set(l, { autoAlpha: 0 }))

  const contents = [
    { ref: c1Ref, inner: c1InnerRef, title: c1tRef, desc: c1dRef, grid: c1gRef },
    { ref: c2Ref, inner: c2InnerRef, title: c2tRef, desc: c2dRef, grid: c2gRef },
    { ref: c3Ref, inner: c3InnerRef, title: c3tRef, desc: c3dRef, grid: c3gRef },
  ]
  contents.forEach(c => {
    gsap.set(c.ref.value, { autoAlpha: 0 }); gsap.set(c.inner.value, { y: '25vh' })
    gsap.set(c.title.value, { autoAlpha: 0, y: 15 }); gsap.set(c.desc.value, { autoAlpha: 0, y: 10 })
    gsap.set(c.grid.value, { autoAlpha: 0, y: 15 })
  })

  gsap.set(hRef.value, { autoAlpha: 0, y: 28 }); gsap.set(kRef.value, { autoAlpha: 0, scale: .7 })
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean), { autoAlpha: 0, y: 16, scale: .5 })
  gsap.set(dRef.value, { scaleX: 0, autoAlpha: 0 }); gsap.set(sRef.value, { autoAlpha: 0, y: 8 })
  gsap.set(dotsRef.value, { autoAlpha: 0 }); gsap.set(particlesRef.value, { opacity: .25 })

  const tl = gsap.timeline({ scrollTrigger: { trigger: p, start: 'top 100%', end: 'bottom 30%', scrub: 1.5, toggleActions: 'play reverse play reverse' } })

  // 入场
  tl.to(st, { opacity: 1, duration: .04, ease: 'power2.out' }, .01)
  tl.to(hRef.value, { autoAlpha: 1, y: 0, duration: .05, ease: 'power2.out' }, .02)
  tl.to(kRef.value, { autoAlpha: 1, scale: 1, duration: .04, ease: 'power2.out' }, .03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean), { autoAlpha: 1, y: 0, scale: 1, duration: .05, stagger: .03, ease: 'back.out(1.8)' }, .03)
  tl.to(dRef.value, { scaleX: 1, autoAlpha: 1, duration: .04, ease: 'power3.inOut' }, .06)
  tl.to(sRef.value, { autoAlpha: 1, y: 0, duration: .04, ease: 'power2.out' }, .07)
  tl.to(dotsRef.value, { autoAlpha: 1, duration: .04, ease: 'power2.out' }, .07)
  tl.to(particlesRef.value, { opacity: .6, duration: .06, ease: 'power2.in' }, .02)

  // ══════ 第1层: 线→伸展→分裂 ══════
  lineGrowThenSplit(tl, l1L.value!, l1R.value!, l1LineRef.value!, .08)
  showContent(tl, c1Ref.value!, c1InnerRef.value!, c1tRef.value!, c1dRef.value!, c1gRef.value!, .20)
  tl.to(c1InnerRef.value!, { y: '-15vh', duration: .12, ease: 'none' }, .28)
  tl.to(dot1Ref.value, { backgroundColor: 'rgba(255,255,255,.15)', duration: .04 }, .30)
  tl.to(dot2Ref.value, { backgroundColor: 'rgba(255,180,110,.9)', duration: .04 }, .34)

  // ══════ 第2层 ══════
  lineGrowThenSplit(tl, l2L.value!, l2R.value!, l2LineRef.value!, .36)
  showContent(tl, c2Ref.value!, c2InnerRef.value!, c2tRef.value!, c2dRef.value!, c2gRef.value!, .48)
  tl.to(c2InnerRef.value!, { y: '-15vh', duration: .12, ease: 'none' }, .56)
  tl.to(dot2Ref.value, { backgroundColor: 'rgba(255,255,255,.15)', duration: .04 }, .58)
  tl.to(dot3Ref.value, { backgroundColor: 'rgba(255,180,110,.9)', duration: .04 }, .62)

  // ══════ 第3层 ══════
  lineGrowThenSplit(tl, l3L.value!, l3R.value!, l3LineRef.value!, .64)
  showContent(tl, c3Ref.value!, c3InnerRef.value!, c3tRef.value!, c3dRef.value!, c3gRef.value!, .76)
  tl.to(c3InnerRef.value!, { y: '-15vh', duration: .12, ease: 'none' }, .84)
  tl.to(dot3Ref.value, { backgroundColor: 'rgba(255,255,255,.15)', duration: .04 }, .86)
  tl.to(dot4Ref.value, { backgroundColor: 'rgba(255,180,110,.9)', duration: .04 }, .90)

  tl.to(dot4Ref.value, { backgroundColor: 'rgba(255,255,255,.12)', duration: .04 }, .94)
  tl.to(hRef.value, { autoAlpha: .15, y: -6, duration: .05, ease: 'power2.in' }, .95)
  tl.to(dotsRef.value, { autoAlpha: 0, duration: .04 }, .95)
  tl.to(particlesRef.value, { opacity: .12, duration: .06 }, .96)
  tl.to(st, { opacity: .4, duration: .06 }, .97)
  tl.to(pfRef.value, { width: '100%', duration: 1, ease: 'none' }, 0)
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function hr() { ScrollTrigger.refresh(true) }
onMounted(() => { requestAnimationFrame(() => setup()); window.addEventListener('resize', hr) })
onUnmounted(() => { window.removeEventListener('resize', hr); ScrollTrigger.getAll().forEach(s => s.kill()); cleanupFns.forEach(f => f()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.ls-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #060410; font-family: 'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif }
.ls-particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; will-change: opacity }
.ls-particle { --px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:ls-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity }
@keyframes ls-f { 0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)} }
.ls-stage { position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 2; will-change: opacity }

.ls-back { position: absolute; inset: 0; z-index: 3 }
.ls-back__img { width: 100%; height: 100%; object-fit: cover; display: block }

/* ── 内容 ── */
.ls-content { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity }
.ls-content__inner { text-align: center; width: 90vw; will-change: transform }
.ls-content__title { margin: 0 0 .15rem; font-size: clamp(1.4rem,3vw,2.2rem); font-weight: 900; background: linear-gradient(180deg,#ffe0b0,#d09038); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter: drop-shadow(0 2px 10px rgba(240,180,100,.4)); will-change: transform, opacity }
.ls-content__desc { margin: 0 0 1rem; font-size: clamp(.5rem,.7vw,.62rem); color: rgba(200,170,150,.38); will-change: transform, opacity }
.ls-content__grid { display: flex; justify-content: center; gap: 1vw; will-change: transform, opacity }
.ls-card { width: clamp(90px,16vw,200px); text-align: center }
.ls-card__img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 6px; display: block; box-shadow: 0 0 0 1.5px rgba(255,190,140,.18), 0 10px 30px rgba(0,0,0,.35) }
.ls-card__label { display: block; margin-top: .25rem; font-size: .5rem; font-weight: 700; letter-spacing: .1em; color: rgba(200,160,140,.5) }

/* ── 图层 + 半图 ── */
.ls-layer { position: absolute; inset: 0 }
.ls-half { position: absolute; top: 50%; width: 50vw; overflow: hidden; will-change: transform, height, opacity }
.ls-half--left { left: 0; transform-origin: center center }
.ls-half--right { right: 0; transform-origin: center center }
.ls-half__img { position: absolute; top: 0; width: 200%; height: 100vh; object-fit: cover; display: block }
.ls-half__img--left { left: 0 }
.ls-half__img--right { right: 0 }

/* ── 发光横线（LineExpand精华）── */
.ls-glow-line { position: absolute; left: 0; width: 100%; z-index: 15; pointer-events: none; will-change: transform, opacity }
.ls-glow-line--h { top: 50%; height: 2px; transform: translateY(-50%); background: linear-gradient(90deg, transparent 5%, rgba(255,200,140,.3) 30%, rgba(255,240,210,.9) 50%, rgba(255,200,140,.3) 70%, transparent 95%); box-shadow: 0 0 14px rgba(255,170,110,.5), 0 0 36px rgba(255,140,80,.2) }

/* ═══════════════════════ 标题 ═══════════════════════ */
.ls-header { position: absolute; top: 4vh; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: min(88vw,520px); pointer-events: none; will-change: transform, opacity }
.ls-kicker { display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .22em; color: rgba(200,165,140,.6); background: rgba(10,5,20,.45); backdrop-filter: blur(8px); border: 1px solid rgba(170,130,220,.16); border-radius: 999px; padding: .2rem .8rem; margin-bottom: .4rem; will-change: transform, opacity }
.ls-title { margin: 0; display: flex; justify-content: center; gap: .04em }
.ls-t__w { font-size: clamp(2rem,5vw,3.8rem); font-weight: 900; will-change: transform, opacity; &--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))} }
.ls-divider { width: 60px; height: 1.5px; margin: .3rem auto .4rem; border-radius: 2px; background: linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent); transform-origin: center; will-change: transform, opacity }
.ls-sub { margin: 0; font-size: clamp(.52rem,.78vw,.66rem); color: rgba(185,155,135,.36); max-width: 420px; margin-inline: auto; will-change: transform, opacity }
.ls-dots { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 20; display: flex; gap: .6rem; pointer-events: none; will-change: opacity }
.ls-dots__d { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.15); transition: background-color .3s }
.ls-dots__d--on { background: rgba(255,170,110,.9) }
.ls-progress { position: absolute; left: 0; bottom: 0; z-index: 25; width: 100%; height: 2px; background: rgba(255,170,110,.02) }
.ls-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060); background-size: 300% 100%; box-shadow: 0 0 10px rgba(240,130,80,.4); animation: ls-ps 4s linear infinite }
@keyframes ls-ps { 0%{background-position:0% 50%}100%{background-position:300% 50%} }
@media(max-width:768px){.ls-header{top:2.5vh}.ls-kicker{font-size:.44rem}.ls-t__w{font-size:1.5rem}.ls-sub{font-size:.48rem}.ls-card{width:70px}}
</style>
