<template>
  <section ref="rootRef" class="sg-root">
    <div ref="particlesRef" class="sg-particles"><span v-for="p in plist" :key="p.id" class="sg-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="sg-stage">

      <!-- 背景图 -->
      <div ref="bgRef" class="sg-bg"><img :src="imgs.bg" class="sg-bg__img" /></div>
      <!-- 半透明遮罩 -->
      <div ref="overlayRef" class="sg-overlay"></div>

      <!-- ══════ 第1层 ══════ -->
      <div ref="layer1Ref" class="sg-layer" style="z-index:5">
        <!-- 中心主图 -->
        <div ref="l1CenterRef" class="sg-center">
          <img :src="imgs.c1" class="sg-center__img" />
          <div class="sg-center__glow"></div>
        </div>
        <!-- 左侧画廊 -->
        <div ref="l1colL" class="sg-col sg-col--left">
          <div v-for="(t,i) in gallery1L" :key="'l1L'+i" :ref="(el:any)=>setL1L(el,i)" class="sg-card">
            <img :src="t.u" class="sg-card__img" /><span class="sg-card__label">{{t.l}}</span>
          </div>
        </div>
        <!-- 右侧画廊 -->
        <div ref="l1colR" class="sg-col sg-col--right">
          <div v-for="(t,i) in gallery1R" :key="'l1R'+i" :ref="(el:any)=>setL1R(el,i)" class="sg-card">
            <img :src="t.u" class="sg-card__img" /><span class="sg-card__label">{{t.l}}</span>
          </div>
        </div>
      </div>

      <!-- ══════ 第2层 ══════ -->
      <div ref="layer2Ref" class="sg-layer" style="z-index:7">
        <div ref="l2CenterRef" class="sg-center">
          <img :src="imgs.c2" class="sg-center__img" />
          <div class="sg-center__glow"></div>
        </div>
        <div ref="l2colL" class="sg-col sg-col--left">
          <div v-for="(t,i) in gallery2L" :key="'l2L'+i" :ref="(el:any)=>setL2L(el,i)" class="sg-card">
            <img :src="t.u" class="sg-card__img" /><span class="sg-card__label">{{t.l}}</span>
          </div>
        </div>
        <div ref="l2colR" class="sg-col sg-col--right">
          <div v-for="(t,i) in gallery2R" :key="'l2R'+i" :ref="(el:any)=>setL2R(el,i)" class="sg-card">
            <img :src="t.u" class="sg-card__img" /><span class="sg-card__label">{{t.l}}</span>
          </div>
        </div>
      </div>

      <!-- ══════ 第3层 ══════ -->
      <div ref="layer3Ref" class="sg-layer" style="z-index:9">
        <div ref="l3CenterRef" class="sg-center">
          <img :src="imgs.c3" class="sg-center__img" />
          <div class="sg-center__glow"></div>
        </div>
        <div ref="l3colL" class="sg-col sg-col--left">
          <div v-for="(t,i) in gallery3L" :key="'l3L'+i" :ref="(el:any)=>setL3L(el,i)" class="sg-card">
            <img :src="t.u" class="sg-card__img" /><span class="sg-card__label">{{t.l}}</span>
          </div>
        </div>
        <div ref="l3colR" class="sg-col sg-col--right">
          <div v-for="(t,i) in gallery3R" :key="'l3R'+i" :ref="(el:any)=>setL3R(el,i)" class="sg-card">
            <img :src="t.u" class="sg-card__img" /><span class="sg-card__label">{{t.l}}</span>
          </div>
        </div>
      </div>

      <!-- 标题 -->
      <header ref="hRef" class="sg-header">
        <span ref="kRef" class="sg-kicker">◇ 向下滚动 · 侧廊画廊 ◇</span>
        <h1 class="sg-title"><span ref="t1Ref" class="sg-t__w sg-t__w--1">侧</span><span ref="t2Ref" class="sg-t__w sg-t__w--2">廊</span><span ref="t3Ref" class="sg-t__w sg-t__w--3">画</span><span ref="t4Ref" class="sg-t__w sg-t__w--1">廊</span></h1>
        <div ref="dRef" class="sg-divider"></div><p ref="sRef" class="sg-sub">中央不动 · 两侧画廊 · 层层涌流</p>
      </header>
      <div ref="dotsRef" class="sg-dots"><span ref="dot1Ref" class="sg-dots__d sg-dots__d--on"></span><span ref="dot2Ref" class="sg-dots__d"></span><span ref="dot3Ref" class="sg-dots__d"></span><span ref="dot4Ref" class="sg-dots__d"></span></div>
      <div class="sg-progress"><div ref="pfRef" class="sg-progress__fill"></div></div>
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
  c1: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80',
  c2: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  c3: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
}
const u = 'https://images.unsplash.com/photo'
const gallery1L=[{u:`${u}-1441974231531-c6227db76b6e?w=300&q=80`,l:'森林'},{u:`${u}-1465146344425-f00d5f5c8f07?w=300&q=80`,l:'花卉'},{u:`${u}-1490750967868-88aa4486c946?w=300&q=80`,l:'草原'}]
const gallery1R=[{u:`${u}-1505144808419-1957a94ca61e?w=300&q=80`,l:'湖光'},{u:`${u}-1501785888041-af3ef285b470?w=300&q=80`,l:'山色'},{u:`${u}-1518837695005-2083093ee35b?w=300&q=80`,l:'海浪'}]
const gallery2L=[{u:`${u}-1472214103451-9374bd1c798e?w=300&q=80`,l:'秋色'},{u:`${u}-1500382017468-9049fed747ef?w=300&q=80`,l:'田野'},{u:`${u}-1469474968028-56623f02e42e?w=300&q=80`,l:'瀑布'}]
const gallery2R=[{u:`${u}-1426604966848-d7adac402bff?w=300&q=80`,l:'旷野'},{u:`${u}-1447752875215-b2761acb3c5d?w=300&q=80`,l:'秘境'},{u:`${u}-1446329813274-7c9036bd9a1f?w=300&q=80`,l:'自然'}]
const gallery3L=[{u:`${u}-1475924156734-496f6cac6ec1?w=300&q=80`,l:'海岸'},{u:`${u}-1506744038136-46273834b3fb?w=300&q=80`,l:'山水'},{u:`${u}-1444464666168-49d633b86797?w=300&q=80`,l:'飞鸟'}]
const gallery3R=[{u:`${u}-1470071459604-3b5ec3a7fe05?w=300&q=80`,l:'远山'},{u:`${u}-1507525428034-b723cf961d3e?w=300&q=80`,l:'海洋'},{u:`${u}-1454496522488-7a8e488e8606?w=300&q=80`,l:'雪峰'}]

interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:20},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))

const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
// Layer 1
const layer1Ref=ref<HTMLElement|null>(null),l1CenterRef=ref<HTMLElement|null>(null),l1colL=ref<HTMLElement|null>(null),l1colR=ref<HTMLElement|null>(null)
const l1L:HTMLElement[]=[],l1R:HTMLElement[]=[];function setL1L(e:any,i:number){if(e instanceof HTMLElement)l1L[i]=e};function setL1R(e:any,i:number){if(e instanceof HTMLElement)l1R[i]=e}
// Layer 2
const layer2Ref=ref<HTMLElement|null>(null),l2CenterRef=ref<HTMLElement|null>(null),l2colL=ref<HTMLElement|null>(null),l2colR=ref<HTMLElement|null>(null)
const l2L:HTMLElement[]=[],l2R:HTMLElement[]=[];function setL2L(e:any,i:number){if(e instanceof HTMLElement)l2L[i]=e};function setL2R(e:any,i:number){if(e instanceof HTMLElement)l2R[i]=e}
// Layer 3
const layer3Ref=ref<HTMLElement|null>(null),l3CenterRef=ref<HTMLElement|null>(null),l3colL=ref<HTMLElement|null>(null),l3colR=ref<HTMLElement|null>(null)
const l3L:HTMLElement[]=[],l3R:HTMLElement[]=[];function setL3L(e:any,i:number){if(e instanceof HTMLElement)l3L[i]=e};function setL3R(e:any,i:number){if(e instanceof HTMLElement)l3R[i]=e}
// Header
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

// 画廊层函数：中心图淡入 + 两侧卡片依次上流
function galleryLayer(
  tl:gsap.core.Timeline, center:HTMLElement,
  colL:HTMLElement,colR:HTMLElement, cardsL:HTMLElement[],cardsR:HTMLElement[],
  startT:number
){
  // 初始
  gsap.set(center,{autoAlpha:0,scale:.9,y:15})
  gsap.set(colL,{y:'30vh',autoAlpha:0});gsap.set(colR,{y:'30vh',autoAlpha:0})
  ;[...cardsL,...cardsR].forEach(c=>gsap.set(c,{autoAlpha:0,y:20,scale:.8}))

  // 中心图淡入放大
  tl.to(center,{autoAlpha:1,scale:1,y:0,duration:.05,ease:'power3.out'},startT)

  // 两侧列上移
  tl.to(colL,{y:0,autoAlpha:1,duration:.06,ease:'power3.out'},startT+.02)
  tl.to(colR,{y:0,autoAlpha:1,duration:.06,ease:'power3.out'},startT+.02)

  // 卡片依次出现（每张慢500ms感觉）
  cardsL.forEach((c,i)=>tl.to(c,{autoAlpha:1,y:0,scale:1,duration:.04,ease:'back.out(1.5)'},startT+.04+i*.08))
  cardsR.forEach((c,i)=>tl.to(c,{autoAlpha:1,y:0,scale:1,duration:.04,ease:'back.out(1.5)'},startT+.05+i*.08))

  // 列继续上流 + 中心图淡出
  tl.to([colL,colR],{y:'-15vh',duration:.06,ease:'power2.in'},startT+.26)
  tl.to(center,{autoAlpha:.2,scale:1.01,duration:.05,ease:'power2.in'},startT+.28)
  tl.to([colL,colR],{autoAlpha:0,y:'-25vh',duration:.05,ease:'power2.in'},startT+.30)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0})
  gsap.set(bgRef.value,{autoAlpha:1,scale:1.04})
  gsap.set(overlayRef.value,{autoAlpha:0})

  const layers=[
    {center:l1CenterRef,colL:l1colL,colR:l1colR,cL:l1L,cR:l1R},
    {center:l2CenterRef,colL:l2colL,colR:l2colR,cL:l2L,cR:l2R},
    {center:l3CenterRef,colL:l3colL,colR:l3colR,cL:l3L,cR:l3R},
  ]
  layers.forEach(l=>{
    gsap.set(l.center.value,{autoAlpha:0});gsap.set(l.colL.value,{y:'30vh',autoAlpha:0});gsap.set(l.colR.value,{y:'30vh',autoAlpha:0})
    ;[...l.cL,...l.cR].forEach(c=>gsap.set(c,{autoAlpha:0,y:20,scale:.8}))
  })

  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8})
  gsap.set(dotsRef.value,{autoAlpha:0});gsap.set(particlesRef.value,{opacity:.2})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 25%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  // 入场
  tl.to(st,{opacity:1,duration:.03,ease:'power2.out'},.01)
  tl.to(hRef.value,{autoAlpha:1,y:0,duration:.04,ease:'power2.out'},.02)
  tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.03,ease:'power2.out'},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.04,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.03,ease:'power3.inOut'},.05)
  tl.to(sRef.value,{autoAlpha:1,y:0,duration:.03,ease:'power2.out'},.06)
  tl.to(dotsRef.value,{autoAlpha:1,duration:.03,ease:'power2.out'},.06)
  tl.to(particlesRef.value,{opacity:.5,duration:.04,ease:'power2.in'},.02)

  // 遮罩淡入
  tl.to(overlayRef.value,{autoAlpha:1,duration:.06,ease:'power2.in'},.06)
  tl.to(bgRef.value,{scale:1,filter:'brightness(0.45)',duration:.08,ease:'power2.out'},.06)

  // Layer 1
  galleryLayer(tl,l1CenterRef.value!,l1colL.value!,l1colR.value!,l1L,l1R,.10)
  tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.32)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.36)

  // Layer 2
  galleryLayer(tl,l2CenterRef.value!,l2colL.value!,l2colR.value!,l2L,l2R,.36)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.58)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.62)

  // Layer 3
  galleryLayer(tl,l3CenterRef.value!,l3colL.value!,l3colR.value!,l3L,l3R,.62)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.84)
  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.88)

  // 收尾 (0.92–1.00)
  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},.92)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},.93)
  tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04,ease:'power2.in'},.94)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},.94)
  tl.to(particlesRef.value,{opacity:.1,duration:.03},.95)
  tl.to(st,{opacity:.35,duration:.03},.96)
  tl.to(pfRef.value,{width:'100%',duration:1,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.sg-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.sg-particles{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity}
.sg-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:sg-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity}
@keyframes sg-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.sg-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2;will-change:opacity}
.sg-bg{position:absolute;inset:0;z-index:1;will-change:transform,filter}.sg-bg__img{width:100%;height:100%;object-fit:cover;display:block}
.sg-overlay{position:absolute;inset:0;z-index:2;pointer-events:none;background:rgba(4,2,10,.65);backdrop-filter:blur(1px);will-change:opacity}

.sg-layer{position:absolute;inset:0}

/* 中心图 */
.sg-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:42vw;z-index:2;will-change:transform,opacity}
.sg-center__img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:10px;display:block;box-shadow:0 0 0 3px rgba(255,200,150,.25),0 20px 50px rgba(0,0,0,.5)}
.sg-center__glow{position:absolute;inset:-10px;border-radius:14px;pointer-events:none;background:radial-gradient(ellipse 60% 60% at 50% 50%,rgba(200,150,255,.12) 0%,transparent 60%);filter:blur(12px)}

/* 侧廊 */
.sg-col{position:absolute;top:12vh;display:flex;flex-direction:column;gap:1.2vh;z-index:1;will-change:transform,opacity}
.sg-col--left{left:2.5vw}.sg-col--right{right:2.5vw}
.sg-card{width:16vw;text-align:center;will-change:transform,opacity}
.sg-card__img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:6px;display:block;box-shadow:0 0 0 1.5px rgba(255,190,140,.14),0 8px 24px rgba(0,0,0,.3)}
.sg-card__label{display:block;margin-top:.2rem;font-size:.45rem;font-weight:700;letter-spacing:.1em;color:rgba(200,160,140,.5)}

.sg-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px);pointer-events:none;will-change:transform,opacity}
.sg-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem;will-change:transform,opacity}
.sg-title{margin:0;display:flex;justify-content:center;gap:.04em}
.sg-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;will-change:transform,opacity;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}
.sg-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent);transform-origin:center;will-change:transform,opacity}
.sg-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto;will-change:transform,opacity}
.sg-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem;pointer-events:none;will-change:opacity}
.sg-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background-color .3s}.sg-dots__d--on{background:rgba(255,170,110,.9)}
.sg-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.sg-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:sg-ps 4s linear infinite}@keyframes sg-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.sg-header{top:2.5vh}.sg-kicker{font-size:.44rem}.sg-t__w{font-size:1.5rem}.sg-sub{font-size:.48rem}.sg-center{width:50vw}.sg-card{width:20vw}}
</style>
