<template>
  <section ref="rootRef" class="m3d-root">
    <canvas ref="canvasRef" class="m3d-canvas"></canvas>

    <div ref="scrollRef" class="m3d-scroll">
      <div ref="trackRef" class="m3d-track" :style="{ height: trackHeight }">
        <div class="m3d-sticky">

          <header ref="headerRef" class="m3d-header">
            <span class="m3d-kicker">🪟 3D Mask Blinds · 百叶窗3D</span>
            <h1 class="m3d-title">
              <span ref="tBlind" class="m3d-title__w">百叶</span>
              <span ref="t3d" class="m3d-title__w m3d-title__w--alt">3D</span>
            </h1>
            <div ref="headerLineRef" class="m3d-line"></div>
            <p class="m3d-sub">向下滚动 · mask-image切割画面 · 百叶逐片翻转 · 3D穿越</p>
          </header>

          <!-- 百叶窗舞台 -->
          <div class="m3d-stage" ref="stageRef">
            <div
              v-for="(frame, fi) in frames"
              :key="frame.id"
              class="m3d-frame"
              :ref="(el) => setFrameRef(el, fi)"
            >
              <div
                v-for="si in SLAT_COUNT"
                :key="si"
                class="m3d-slat"
                :ref="(el) => setSlatRef(el, fi, si - 1)"
                :style="slatMaskStyle(si - 1)"
              >
                <img
                  :src="frame.image"
                  :alt="frame.alt"
                  class="m3d-slat__img"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          <div ref="infoRef" class="m3d-info">
            <div class="m3d-info__nums">
              <span v-for="(_, i) in frames" :key="i" class="m3d-info__num" :class="{'m3d-info__num--on': currentIndex===i}"></span>
            </div>
            <h3>{{ frames[currentIndex]?.title }}</h3>
          </div>

          <div class="m3d-progress"><div ref="progressRef" class="m3d-progress__fill"></div></div>

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

interface Frame { id: string; title: string; image: string; alt: string }
const frames: Frame[] = [
  { id:'aurora', title:'极光降临', image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80', alt:'极光' },
  { id:'ocean', title:'深海之光', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', alt:'海浪' },
  { id:'mountains', title:'远山呼唤', image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', alt:'远山' },
  { id:'flowers', title:'繁花秘境', image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80', alt:'繁花' },
  { id:'desert', title:'沙漠行者', image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80', alt:'沙漠' },
  { id:'forest', title:'森林呼吸', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', alt:'森林' },
  { id:'valley', title:'峡谷回响', image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80', alt:'峡谷' },
  { id:'sunrise', title:'黎明破晓', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80', alt:'日出' },
]

const N = frames.length
const SLAT_COUNT = 8
const trackHeight = `${(N + 1) * 100}vh`
const BAND_PCT = 100 / SLAT_COUNT // 12.5%

// 为每个slat生成mask-image CSS
function slatMaskStyle(si: number): Record<string, string> {
  const top = si * BAND_PCT
  const bottom = (si + 1) * BAND_PCT
  const mask = `linear-gradient(to bottom,
    transparent 0%, transparent ${top}%,
    black ${top}%, black ${bottom}%,
    transparent ${bottom}%, transparent 100%
  )`
  return {
    maskImage: mask,
    WebkitMaskImage: mask,
    zIndex: SLAT_COUNT - si, // 顶部slat的z-index最高
  }
}

// ── Refs ──
const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const stageRef = ref<HTMLElement|null>(null)
const headerRef = ref<HTMLElement|null>(null); const headerLineRef = ref<HTMLElement|null>(null)
const tBlind = ref<HTMLElement|null>(null); const t3d = ref<HTMLElement|null>(null)
const infoRef = ref<HTMLElement|null>(null); const progressRef = ref<HTMLElement|null>(null)
const canvasRef = ref<HTMLCanvasElement|null>(null)

// 2D ref数组: frameRefs[fi], slatRefs[fi][si]
const frameRefs = ref<HTMLElement[]>([])
const slatRefs = ref<HTMLElement[][]>([])
const setFrameRef = (el: Element|null, fi: number) => { if (el instanceof HTMLElement) frameRefs.value[fi] = el }
const setSlatRef = (el: Element|null, fi: number, si: number) => {
  if (el instanceof HTMLElement) {
    if (!slatRefs.value[fi]) slatRefs.value[fi] = []
    slatRefs.value[fi][si] = el
  }
}

const currentIndex = ref(0)
const cleanupFns: TweenCleanup[] = []

// ── 背景粒子 ──
interface Pt { x:number;y:number;vx:number;vy:number;r:number;a:number }
let ctx:CanvasRenderingContext2D|null=null; let cw=0,ch=0
const pts:Pt[]=[]; let sid=0
function initPts(){
  const c=canvasRef.value; if(!c)return; ctx=c.getContext('2d'); if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<80;i++)pts.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*.6,vy:-Math.random()*1.2-.3,r:.5+Math.random()*1.8,a:.15+Math.random()*.4})
  function an(){
    if(!ctx)return;ctx.clearRect(0,0,cw,ch)
    for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.y<-20){p.y=ch+20;p.x=Math.random()*cw}
      ctx!.beginPath();ctx!.arc(p.x,p.y,p.r,0,Math.PI*2);ctx!.fillStyle=`rgba(180,210,240,${p.a})`;ctx!.fill()}
    sid=requestAnimationFrame(an)
  }
  sid=requestAnimationFrame(an)
}

// ── 入场 ──
function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!stageRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tBlind.value!,{autoAlpha:0,x:-40,scale:.6},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(t3d.value!,{autoAlpha:0,x:40,scale:.6},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(headerLineRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(stageRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.6,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

// ── 预加载 ──
function preloadImages(): Promise<void[]> {
  return Promise.all(frames.map(f => new Promise<void>((resolve) => {
    const img = new Image(); img.onload = () => resolve(); img.onerror = () => resolve(); img.src = f.image
  })))
}

// ── 核心：百叶窗3D翻转 ──
function setupBlinds(){
  if(!scrollRef.value||!trackRef.value||!stageRef.value)return
  const sc=scrollRef.value; const track=trackRef.value
  const sRefs=slatRefs.value; const fRefs=frameRefs.value
  if(!sRefs.length||!fRefs.length)return

  // 初始化：frame0可见(slats=0°)，其余frame隐藏(slats=90°)
  fRefs.forEach((_fr, fi) => {
    const frameSlats = sRefs[fi]
    if (!frameSlats) return
    frameSlats.forEach((slat, si) => {
      gsap.set(slat, {
        rotateX: fi === 0 ? 0 : 90,
        transformOrigin: 'top',
        backfaceVisibility: 'hidden',
      })
    })
  })

  const mtl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller: sc,
      start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) { currentIndex.value = Math.min(N-1, Math.max(0, Math.round(self.progress * (N-1)))) },
    },
  })

  if (progressRef.value) mtl.to(progressRef.value, { width: '100%', duration: N }, 0)

  // 每帧的百叶窗翻转序列
  fRefs.forEach((_fr, fi) => {
    const frameSlats = sRefs[fi]
    if (!frameSlats) return
    const start = fi / N
    const dur = 1 / N

    if (fi < N - 1) {
      // 🔽 逐片翻下（0°→90°）：从上到下，stagger
      frameSlats.forEach((slat, si) => {
        const staggerOffset = (si / SLAT_COUNT) * dur * 0.7
        mtl.to(slat, {
          rotateX: 90,
          duration: dur * 0.3,
          ease: 'power2.in',
        }, start + dur * 0.55 + staggerOffset)
      })
    }

    if (fi > 0) {
      // 🔼 逐片翻上（90°→0°）：从下到上，stagger
      const prevStart = (fi - 1) / N
      const prevDur = 1 / N
      // 在前一帧开始翻下后，本帧的slats从底部开始翻上
      // 取frameSlats的反序（从下到上）
      frameSlats.forEach((slat, si) => {
        const revSi = SLAT_COUNT - 1 - si // 反转索引：底部先翻
        const staggerOffset = (revSi / SLAT_COUNT) * prevDur * 0.7
        mtl.to(slat, {
          rotateX: 0,
          duration: prevDur * 0.3,
          ease: 'power2.out',
        }, prevStart + prevDur * 0.6 + staggerOffset)
      })
    }
  })

  cleanupFns.push(() => { mtl.scrollTrigger?.kill(); mtl.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(async () => {
  initPts()
  await preloadImages()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupBlinds() }))
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize); cancelAnimationFrame(sid)
  ScrollTrigger.getAll().forEach(s => s.kill()); cleanupFns.forEach(f => f()); cleanupFns.length = 0; pts.length = 0
})
</script>

<style scoped lang="scss">
.m3d-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 45%, #0a1020 0%, #040810 70%, #010308 100%);
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

.m3d-canvas { position: absolute; inset: 0; z-index: 0; pointer-events: none; }

.m3d-scroll {
  position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto;
  overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(60,120,200,.16); }
}
.m3d-track { position: relative; width: 100%; }
.m3d-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.m3d-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(90vw, 660px); }
.m3d-kicker { display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: rgba(130,170,215,.65); background: rgba(30,80,160,.1); backdrop-filter: blur(8px); border: 1px solid rgba(50,110,200,.12); border-radius: 999px; padding: .18rem .8rem; margin-bottom: .35rem; }
.m3d-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.m3d-title__w { font-size: clamp(1.8rem, 4.5vw, 3.4rem); font-weight: 900; color: #a0bce0; text-shadow: 0 0 14px rgba(60,110,190,.3); will-change: transform, opacity; }
.m3d-title__w--alt { background: linear-gradient(180deg, #c8dcf8, #4078c0, #1e50a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.m3d-line { width: 60px; height: 1.5px; margin: .25rem auto .35rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #3870b8, #60a0e0, transparent); transform-origin: center; }
.m3d-sub { margin: 0; font-size: clamp(.58rem, .85vw, .68rem); color: rgba(100,140,190,.4); line-height: 1.4; max-width: 330px; margin-inline: auto; }

/* ── 舞台 ── */
.m3d-stage {
  position: absolute; inset: 0; z-index: 2;
  perspective: 800px; perspective-origin: 50% 40%;
}

/* ── Frame: 一组8片百叶 ── */
.m3d-frame {
  position: absolute; inset: 0;
  transform-style: preserve-3d;
}

/* ── Slat: 单片百叶 ── */
.m3d-slat {
  position: absolute; inset: 0;
  transform-origin: top;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  will-change: transform;
  overflow: hidden;

  // mask-image 由JS动态设置
}

.m3d-slat__img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}

/* ── 信息 ── */
.m3d-info { position: absolute; bottom: 7vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; display: flex; flex-direction: column; align-items: center; gap: .25rem; }
.m3d-info__nums { display: flex; gap: 7px; }
.m3d-info__num { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.1); transition: all .35s; }
.m3d-info__num--on { background: #fff; box-shadow: 0 0 6px #fff, 0 0 14px rgba(60,130,220,.6); }
.m3d-info h3 { margin: 0; font-size: clamp(.85rem, 1.7vw, 1.2rem); font-weight: 700; color: rgba(170,200,230,.7); }

/* ── 进度 ── */
.m3d-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 2px; background: rgba(255,255,255,.03); }
.m3d-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #2858a8, #4888d0, #68a8e8, #2858a8); background-size: 200% 100%; box-shadow: 0 0 6px rgba(50,110,200,.35); }

@media (max-width: 768px) { .m3d-title__w { font-size: 1.4rem; } }
</style>
