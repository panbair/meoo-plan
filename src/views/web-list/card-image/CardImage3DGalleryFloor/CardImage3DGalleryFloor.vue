<template>
  <section ref="rootRef" class="gf-root">
    <!-- 3D展厅 -->
    <div class="gf-scene" ref="sceneRef">
      <!-- 地面 -->
      <div class="gf-floor"></div>

      <!-- 图片画廊 -->
      <div class="gf-gallery" ref="galleryRef">
        <div
          v-for="(frame, idx) in frames"
          :key="frame.id"
          class="gf-card"
          :ref="(el) => setCardRef(el, idx)"
        >
          <!-- 照片主体 + 真实3D倒影 -->
          <div class="gf-card__inner">
            <!-- 主照片 -->
            <img
              :ref="(el) => setImgRef(el, idx)"
              :src="frame.image"
              :alt="frame.alt"
              class="gf-card__img"
              loading="eager"
            />
            <div class="gf-card__border"></div>

            <!-- 地板倒影：翻转+透视渐变 -->
            <div class="gf-card__reflect">
              <img
                :src="frame.image"
                :alt="frame.alt"
                class="gf-card__reflect-img"
              />
              <div class="gf-card__reflect-fade"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 光源光晕 -->
      <div class="gf-spotlight"></div>
    </div>

    <!-- 暗角 -->
    <div class="gf-vignette"></div>

    <!-- UI -->
    <div ref="scrollRef" class="gf-scroll">
      <div ref="trackRef" class="gf-track" :style="{ height: trackHeight }">
        <div class="gf-sticky">

          <header ref="headerRef" class="gf-header">
            <span class="gf-kicker">🏛 3D Gallery Floor · 展厅地板</span>
            <h1 class="gf-title">
              <span ref="tGallery" class="gf-title__w">3D</span>
              <span ref="tFloor" class="gf-title__w gf-title__w--alt">展厅</span>
            </h1>
            <div ref="headerLineRef" class="gf-line"></div>
            <p class="gf-sub">向下滚动 · 漫步3D展厅 · 照片矗立地板之上 · 倒影如镜</p>
          </header>

          <div ref="infoRef" class="gf-info">
            <span class="gf-info__no">{{ String(currentIndex + 1).padStart(2, '0') }}</span>
            <h3>{{ frames[currentIndex]?.title }}</h3>
          </div>

          <div class="gf-progress"><div ref="progressRef" class="gf-progress__fill"></div></div>

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
  { id:'aurora', title:'极光', image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', alt:'极光' },
  { id:'ocean', title:'海浪', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', alt:'海浪' },
  { id:'mountains', title:'远山', image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', alt:'远山' },
  { id:'flowers', title:'繁花', image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80', alt:'繁花' },
  { id:'desert', title:'沙漠', image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', alt:'沙漠' },
  { id:'forest', title:'森林', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', alt:'森林' },
  { id:'valley', title:'峡谷', image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', alt:'峡谷' },
  { id:'sunrise', title:'日出', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', alt:'日出' },
]

const N = frames.length
const CARD_Z_GAP = 450 // 卡片之间Z轴间距
const trackHeight = `${(N + 1) * 100}vh`

// ── Refs ──
const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const sceneRef = ref<HTMLElement|null>(null)
const galleryRef = ref<HTMLElement|null>(null)
const headerRef = ref<HTMLElement|null>(null); const headerLineRef = ref<HTMLElement|null>(null)
const tGallery = ref<HTMLElement|null>(null); const tFloor = ref<HTMLElement|null>(null)
const infoRef = ref<HTMLElement|null>(null); const progressRef = ref<HTMLElement|null>(null)
const cardRefs = ref<HTMLElement[]>([]); const imgRefs = ref<HTMLImageElement[]>([])
const setCardRef = (el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef = (el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex = ref(0)
const cleanupFns: TweenCleanup[] = []

// ── 预加载 ──
function preload(): Promise<void[]> {
  return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))
}

// ── 入场 ──
function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value||!galleryRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tGallery.value!,{autoAlpha:0,x:-35,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tFloor.value!,{autoAlpha:0,x:35,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(headerLineRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

// ── 核心：3D散开布局 ──
function setupGallery(){
  if(!scrollRef.value||!trackRef.value||!galleryRef.value)return
  const sc=scrollRef.value; const track=trackRef.value; const gal=galleryRef.value
  const cards=cardRefs.value; const imgs=imgRefs.value
  if(!cards.length)return

  // ── 散开布局：每张卡片在X/Z轴上错落分布 ──
  // X轴: 左右交替散开 | Z轴: 每张间隔650px | rotateY: 微微转向
  const layout = [
    { x: '-32vw', z: 0,     ry: -8,  rx: -1 },   // 左前
    { x: '30vw',  z: -650,  ry: 7,   rx: -2 },   // 右
    { x: '-22vw', z: -1300, ry: -5,  rx: 0 },    // 左
    { x: '35vw',  z: -1950, ry: 10,  rx: -3 },   // 右
    { x: '-28vw', z: -2600, ry: -9,  rx: -1 },   // 左
    { x: '25vw',  z: -3250, ry: 6,   rx: -2 },   // 右
    { x: '-35vw', z: -3900, ry: -7,  rx: 0 },    // 左
    { x: '32vw',  z: -4550, ry: 8,   rx: -3 },   // 右
  ]

  cards.forEach((card,i)=>{
    const L = layout[i]
    gsap.set(card, {
      x: L.x, z: L.z, rotateY: L.ry, rotateX: L.rx,
      filter: i===0 ? 'brightness(1.05)' : `brightness(${1 - i*0.04})`,
      opacity: i <= 2 ? 1 : Math.max(0.15, 1 - (i-2)*0.18),
    })
    gsap.set(imgs[i], { scale: 1 })
  })

  // 最后一张的Z绝对值 = 总移动距离
  const totalZ = Math.abs(layout[layout.length-1].z) + 650

  const mtl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller: sc,
      start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        currentIndex.value = Math.min(N-1, Math.max(0, Math.round(self.progress * (N-1))))
      },
    },
  })

  // 整体向前推进 → 照片依次到达眼前
  mtl.to(gal, { z: totalZ, duration: N, ease: 'none' }, 0)

  // 每张照片到达前台时微动 + 提亮
  cards.forEach((_card, i) => {
    const moment = i / N; const dur = 1 / N

    // rotateY 归零 → 照片在眼前时正对观众
    mtl.to(cards[i], { rotateY: layout[i].ry * 0.3, duration: dur * 0.3, ease: 'power2.out' }, Math.max(0, moment - dur * 0.12))
    mtl.to(cards[i], { rotateY: layout[i].ry, duration: dur * 0.35, ease: 'power2.in' }, moment + dur * 0.5)

    // brightness 变化
    mtl.to(cards[i], { filter: 'brightness(1.12)', duration: dur * 0.25, ease: 'power2.out' }, Math.max(0, moment - dur * 0.08))
    mtl.to(cards[i], { filter: `brightness(${1 - i*0.06})`, duration: dur * 0.35, ease: 'power2.in' }, moment + dur * 0.45)

    // 图片微放大
    if (imgs[i]) {
      mtl.to(imgs[i], { scale: 1.06, duration: dur * 0.25, ease: 'power2.out' }, Math.max(0, moment - dur * 0.1))
      mtl.to(imgs[i], { scale: 1, duration: dur * 0.3, ease: 'power2.in' }, moment + dur * 0.45)
    }
  })

  if (progressRef.value) mtl.to(progressRef.value, { width: '100%', duration: N }, 0)
  cleanupFns.push(() => { mtl.scrollTrigger?.kill(); mtl.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(async () => {
  await preload()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupGallery() }))
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(s => s.kill()); cleanupFns.forEach(f => f()); cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.gf-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 50% 40% at 50% 45%, #141a24 0%, #0a0e16 60%, #040608 100%);
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

/* ── 3D展厅 ── */
.gf-scene {
  position: absolute; inset: 0; z-index: 2;
  perspective: 1000px;
  perspective-origin: 50% 45%;
  transform-style: preserve-3d;
  pointer-events: none; // 让滚动事件穿透到下层scroll容器
}

/* ── 地面（镜面地板） ── */
.gf-floor {
  position: absolute;
  bottom: 0; left: 0; width: 100%; height: 50%;
  background:
    linear-gradient(to bottom, rgba(20, 30, 50, 0.1) 0%, rgba(20, 30, 50, 0.4) 30%, rgba(10, 15, 25, 0.7) 100%);
  transform: rotateX(70deg);
  transform-origin: bottom;
  pointer-events: none;
}

/* ── 画廊容器 ── */
.gf-gallery {
  position: absolute;
  top: 50%; left: 50%;
  width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ── 照片卡片 ── */
.gf-card {
  position: absolute;
  // 300×500 比例 → 使用clamp响应式
  width: clamp(180px, 28vw, 300px);
  height: clamp(300px, 46.7vw, 500px); // width * 5/3
  margin-left: calc(clamp(180px, 28vw, 300px) / -2);
  margin-top: calc(clamp(300px, 46.7vw, 500px) / -2);
  transform-style: preserve-3d;
  will-change: transform, filter, opacity;
}

/* ── 照片主体 ── */
.gf-card__inner {
  position: relative;
  width: 100%; height: 100%;
  border-radius: 4px;
  overflow: visible; // 让倒影可以超出
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 0 0 4px #fff,
    0 0 0 7px rgba(0, 0, 0, 0.25);
}

.gf-card__img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 4px;
  will-change: transform;
}

.gf-card__border {
  position: absolute; inset: 0; pointer-events: none;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

/* ── 真实3D地板倒影 ── */
.gf-card__reflect {
  position: absolute;
  top: 100%;                          // 从照片底部开始
  left: 0;
  width: 100%;
  height: 35%;                        // 倒影深度 — 短倒影更自然
  transform: scaleY(-1);              // 垂直翻转 — 底部画面倒影贴近地板
  transform-origin: center center;
  overflow: hidden;
  border-radius: 4px;
  opacity: 0.3;
  pointer-events: none;
}

.gf-card__reflect-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}

// 短倒影渐变 — 快速融入地板
.gf-card__reflect-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 15, 25, 0.1) 0%,
    rgba(10, 15, 25, 0.4) 40%,
    rgba(10, 15, 25, 0.8) 75%,
    rgba(10, 15, 25, 1) 100%
  );
  pointer-events: none;
}

/* ── 聚光灯 ── */
.gf-spotlight {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 40% 60% at 50% 45%, rgba(255,255,240,0.03), transparent 60%);
}

/* ── 暗角 ── */
.gf-vignette {
  position: absolute; inset: 0; z-index: 4; pointer-events: none;
  background: radial-gradient(ellipse 60% 50% at 50% 45%, transparent 40%, rgba(3,5,10,0.55) 100%);
}

/* ── 滚动 ── */
.gf-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 1;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.1); }
}
.gf-track { position: relative; width: 100%; }
.gf-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.gf-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(90vw, 640px); }
.gf-kicker { display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: rgba(180,200,220,.6); background: rgba(255,255,255,.04); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,.08); border-radius: 999px; padding: .18rem .8rem; margin-bottom: .35rem; }
.gf-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.gf-title__w { font-size: clamp(1.7rem, 4.2vw, 3.2rem); font-weight: 900; color: #c8d8ec; text-shadow: 0 0 12px rgba(150,180,220,.2); will-change: transform, opacity; }
.gf-title__w--alt { background: linear-gradient(180deg, #e8f0f8, #6898c8, #3868a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.gf-line { width: 55px; height: 1.5px; margin: .25rem auto .3rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #5888b8, #78a8d8, transparent); transform-origin: center; }
.gf-sub { margin: 0; font-size: clamp(.56rem, .8vw, .66rem); color: rgba(140,170,200,.35); line-height: 1.4; max-width: 320px; margin-inline: auto; }

/* ── 信息 ── */
.gf-info { position: absolute; bottom: 7vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; display: flex; flex-direction: column; align-items: center; gap: .15rem; }
.gf-info__no { font-size: .7rem; font-weight: 300; letter-spacing: .15em; color: rgba(200,215,230,.35); font-family: 'Georgia', serif; }
.gf-info h3 { margin: 0; font-size: clamp(.8rem, 1.5vw, 1.1rem); font-weight: 600; color: rgba(180,200,225,.6); letter-spacing: .06em; }

/* ── 进度 ── */
.gf-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 1.5px; background: rgba(255,255,255,.02); }
.gf-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #4878a8, #78a8d0, #4878a8); background-size: 200% 100%; }

@media (max-width: 768px) {
  .gf-card { width: 160px; height: 267px; margin-left: -80px; margin-top: -133px; }
  .gf-title__w { font-size: 1.4rem; }
}
</style>
