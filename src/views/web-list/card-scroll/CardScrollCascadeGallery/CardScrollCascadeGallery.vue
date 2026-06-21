<template>
  <section ref="rootRef" class="cg-root">
    <div ref="particlesRef" class="cg-particles"><span v-for="p in plist" :key="p.id" class="cg-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="cg-stage">

      <div ref="bgRef" class="cg-bg"><img :src="imgs.bg1" class="cg-bg__img" /></div>
      <div ref="overlayRef" class="cg-overlay"></div>

      <!-- ══════ 第1层瀑布 ══════ -->
      <div ref="layer1Ref" class="cg-layer" style="z-index:5">
        <div ref="l1row1" class="cg-row">
          <div v-for="(t,i) in cascade1R1" :key="'l1r1-'+i" :ref="(el:any)=>setL1R1(el,i)" class="cg-card">
            <img :src="t.u" class="cg-card__img" /><span class="cg-card__label">{{t.l}}</span>
          </div>
        </div>
        <div ref="l1row2" class="cg-row">
          <div v-for="(t,i) in cascade1R2" :key="'l1r2-'+i" :ref="(el:any)=>setL1R2(el,i)" class="cg-card">
            <img :src="t.u" class="cg-card__img" /><span class="cg-card__label">{{t.l}}</span>
          </div>
        </div>
      </div>

      <!-- ══════ 第2层瀑布 ══════ -->
      <div ref="layer2Ref" class="cg-layer" style="z-index:7">
        <div ref="l2row1" class="cg-row">
          <div v-for="(t,i) in cascade2R1" :key="'l2r1-'+i" :ref="(el:any)=>setL2R1(el,i)" class="cg-card">
            <img :src="t.u" class="cg-card__img" /><span class="cg-card__label">{{t.l}}</span>
          </div>
        </div>
        <div ref="l2row2" class="cg-row">
          <div v-for="(t,i) in cascade2R2" :key="'l2r2-'+i" :ref="(el:any)=>setL2R2(el,i)" class="cg-card">
            <img :src="t.u" class="cg-card__img" /><span class="cg-card__label">{{t.l}}</span>
          </div>
        </div>
      </div>

      <!-- ══════ 第3层瀑布 ══════ -->
      <div ref="layer3Ref" class="cg-layer" style="z-index:9">
        <div ref="l3row1" class="cg-row">
          <div v-for="(t,i) in cascade3R1" :key="'l3r1-'+i" :ref="(el:any)=>setL3R1(el,i)" class="cg-card">
            <img :src="t.u" class="cg-card__img" /><span class="cg-card__label">{{t.l}}</span>
          </div>
        </div>
        <div ref="l3row2" class="cg-row">
          <div v-for="(t,i) in cascade3R2" :key="'l3r2-'+i" :ref="(el:any)=>setL3R2(el,i)" class="cg-card">
            <img :src="t.u" class="cg-card__img" /><span class="cg-card__label">{{t.l}}</span>
          </div>
        </div>
      </div>

      <header ref="hRef" class="cg-header">
        <span ref="kRef" class="cg-kicker">◇ 向下滚动 · 瀑布画廊 ◇</span>
        <h1 class="cg-title"><span ref="t1Ref" class="cg-t__w cg-t__w--1">瀑</span><span ref="t2Ref" class="cg-t__w cg-t__w--2">布</span><span ref="t3Ref" class="cg-t__w cg-t__w--3">画</span><span ref="t4Ref" class="cg-t__w cg-t__w--1">廊</span></h1>
        <div ref="dRef" class="cg-divider"></div><p ref="sRef" class="cg-sub">倾泻而下 · 瀑布成廊 · 层层跌落入画来</p>
      </header>
      <div ref="dotsRef" class="cg-dots"><span ref="dot1Ref" class="cg-dots__d cg-dots__d--on"></span><span ref="dot2Ref" class="cg-dots__d"></span><span ref="dot3Ref" class="cg-dots__d"></span><span ref="dot4Ref" class="cg-dots__d"></span></div>
      <div class="cg-progress"><div ref="pfRef" class="cg-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TC=()=>void

const imgs={bg1:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
const u='https://images.unsplash.com/photo'
const cascade1R1=[{u:`${u}-1498579150354-977475b7ea0b?w=500&q=80`,l:'晨 曦'},{u:`${u}-1507525428034-b723cf961d3e?w=500&q=80`,l:'海 洋'},{u:`${u}-1470770903676-69b98201ea1c?w=500&q=80`,l:'湖 泊'},{u:`${u}-1441974231531-c6227db76b6e?w=500&q=80`,l:'森 林'}]
const cascade1R2=[{u:`${u}-1465146344425-f00d5f5c8f07?w=500&q=80`,l:'花 卉'},{u:`${u}-1490750967868-88aa4486c946?w=500&q=80`,l:'草 原'},{u:`${u}-1505144808419-1957a94ca61e?w=500&q=80`,l:'湖 光'},{u:`${u}-1469474968028-56623f02e42e?w=500&q=80`,l:'瀑 布'}]
const cascade2R1=[{u:`${u}-1501785888041-af3ef285b470?w=500&q=80`,l:'山 色'},{u:`${u}-1518837695005-2083093ee35b?w=500&q=80`,l:'海 浪'},{u:`${u}-1472214103451-9374bd1c798e?w=500&q=80`,l:'秋 色'},{u:`${u}-1500382017468-9049fed747ef?w=500&q=80`,l:'田 野'}]
const cascade2R2=[{u:`${u}-1426604966848-d7adac402bff?w=500&q=80`,l:'旷 野'},{u:`${u}-1447752875215-b2761acb3c5d?w=500&q=80`,l:'秘 境'},{u:`${u}-1446329813274-7c9036bd9a1f?w=500&q=80`,l:'自 然'},{u:`${u}-1475924156734-496f6cac6ec1?w=500&q=80`,l:'海 岸'}]
const cascade3R1=[{u:`${u}-1506744038136-46273834b3fb?w=500&q=80`,l:'山 水'},{u:`${u}-1444464666168-49d633b86797?w=500&q=80`,l:'飞 鸟'},{u:`${u}-1470071459604-3b5ec3a7fe05?w=500&q=80`,l:'远 山'},{u:`${u}-1454496522488-7a8e488e8606?w=500&q=80`,l:'雪 峰'}]
const cascade3R2=[{u:`${u}-1507525428034-b723cf961d3e?w=500&q=80`,l:'海 洋'},{u:`${u}-1498579150354-977475b7ea0b?w=500&q=80`,l:'晨 曦'},{u:`${u}-1470770903676-69b98201ea1c?w=500&q=80`,l:'湖 泊'},{u:`${u}-1441974231531-c6227db76b6e?w=500&q=80`,l:'森 林'}]

interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:25},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.22}`}})))

const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
// Layer 1
const layer1Ref=ref<HTMLElement|null>(null),l1row1=ref<HTMLElement|null>(null),l1row2=ref<HTMLElement|null>(null)
const l1r1:HTMLElement[]=[],l1r2:HTMLElement[]=[];function setL1R1(e:any,i:number){if(e instanceof HTMLElement)l1r1[i]=e};function setL1R2(e:any,i:number){if(e instanceof HTMLElement)l1r2[i]=e}
// Layer 2
const layer2Ref=ref<HTMLElement|null>(null),l2row1=ref<HTMLElement|null>(null),l2row2=ref<HTMLElement|null>(null)
const l2r1:HTMLElement[]=[],l2r2:HTMLElement[]=[];function setL2R1(e:any,i:number){if(e instanceof HTMLElement)l2r1[i]=e};function setL2R2(e:any,i:number){if(e instanceof HTMLElement)l2r2[i]=e}
// Layer 3
const layer3Ref=ref<HTMLElement|null>(null),l3row1=ref<HTMLElement|null>(null),l3row2=ref<HTMLElement|null>(null)
const l3r1:HTMLElement[]=[],l3r2:HTMLElement[]=[];function setL3R1(e:any,i:number){if(e instanceof HTMLElement)l3r1[i]=e};function setL3R2(e:any,i:number){if(e instanceof HTMLElement)l3r2[i]=e}
// Header
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

// 瀑布函数：卡片从上方倾泻而下，弹跳落入位置
function cascadeLayer(tl:gsap.core.Timeline,row1:HTMLElement,row2:HTMLElement,r1Cards:HTMLElement[],r2Cards:HTMLElement[],startT:number){
  gsap.set(row1,{y:'-40vh',autoAlpha:0});gsap.set(row2,{y:'-40vh',autoAlpha:0})
  ;[...r1Cards,...r2Cards].forEach(c=>gsap.set(c,{autoAlpha:0,y:-60,scale:.6,rotation:-8}))

  // Row 1 倾泻而下（4张依次，瀑布效果）
  tl.to(row1,{y:0,autoAlpha:1,duration:.08,ease:'power2.in'},startT)
  r1Cards.forEach((c,i)=>tl.to(c,{autoAlpha:1,y:0,scale:1,rotation:0,duration:.06,ease:'back.out(2)'},startT+.02+i*.10))

  // Row 2 紧随其后
  tl.to(row2,{y:0,autoAlpha:1,duration:.08,ease:'power2.in'},startT+.15)
  r2Cards.forEach((c,i)=>tl.to(c,{autoAlpha:1,y:0,scale:1,rotation:0,duration:.06,ease:'back.out(2)'},startT+.17+i*.10))

  // 两排定格片刻后上流淡出
  tl.to([row1,row2],{y:'-10vh',duration:.06,ease:'power2.in'},startT+.38)
  tl.to([row1,row2],{autoAlpha:0,y:'-30vh',duration:.06,ease:'power2.in'},startT+.42)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0})

  const layers=[
    {row1:l1row1,row2:l1row2,r1:l1r1,r2:l1r2},
    {row1:l2row1,row2:l2row2,r1:l2r1,r2:l2r2},
    {row1:l3row1,row2:l3row2,r1:l3r1,r2:l3r2},
  ]
  layers.forEach(l=>{
    gsap.set(l.row1.value,{y:'-40vh',autoAlpha:0});gsap.set(l.row2.value,{y:'-40vh',autoAlpha:0})
    ;[...l.r1,...l.r2].forEach(c=>gsap.set(c,{autoAlpha:0,y:-60,scale:.6,rotation:-8}))
  })

  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8})
  gsap.set(dotsRef.value,{autoAlpha:0});gsap.set(particlesRef.value,{opacity:.2})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 30%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  tl.to(st,{opacity:1,duration:.03,ease:'power2.out'},.01)
  tl.to(hRef.value,{autoAlpha:1,y:0,duration:.04,ease:'power2.out'},.02)
  tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.03,ease:'power2.out'},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.04,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.03,ease:'power3.inOut'},.06)
  tl.to(sRef.value,{autoAlpha:1,y:0,duration:.03,ease:'power2.out'},.07)
  tl.to(dotsRef.value,{autoAlpha:1,duration:.03,ease:'power2.out'},.07)
  tl.to(particlesRef.value,{opacity:.5,duration:.04,ease:'power2.in'},.02)

  // 遮罩
  tl.to(overlayRef.value,{autoAlpha:1,duration:.06,ease:'power2.in'},.06)
  tl.to(bgRef.value,{scale:1,filter:'brightness(0.4)',duration:.08,ease:'power2.out'},.06)

  // Layer 1
  cascadeLayer(tl,l1row1.value!,l1row2.value!,l1r1,l1r2,.10)
  tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.38)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.42)

  // Layer 2
  cascadeLayer(tl,l2row1.value!,l2row2.value!,l2r1,l2r2,.44)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.72)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.76)

  // Layer 3
  cascadeLayer(tl,l3row1.value!,l3row2.value!,l3r1,l3r2,.78)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},1.06)
  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},1.10)

  // 收尾
  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},1.14)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},1.16)
  tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04,ease:'power2.in'},1.18)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},1.18)
  tl.to(particlesRef.value,{opacity:.1,duration:.03},1.20)
  tl.to(st,{opacity:.35,duration:.03},1.22)
  tl.to(pfRef.value,{width:'100%',duration:1.3,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.cg-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.cg-particles{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity}
.cg-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:cg-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity}
@keyframes cg-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.cg-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2;will-change:opacity}
.cg-bg{position:absolute;inset:0;z-index:1;will-change:transform,filter}.cg-bg__img{width:100%;height:100%;object-fit:cover;display:block}
.cg-overlay{position:absolute;inset:0;z-index:2;pointer-events:none;background:rgba(4,2,10,.65);backdrop-filter:blur(1px);will-change:opacity}

.cg-layer{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}

.cg-row{display:flex;gap:30px;will-change:transform,opacity}
.cg-card{width:calc((100vw - 150px)/4);text-align:center;will-change:transform,opacity}
.cg-card__img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:8px;display:block;box-shadow:0 0 0 2px rgba(255,190,140,.22),0 14px 40px rgba(0,0,0,.5)}
.cg-card__label{display:block;margin-top:.3rem;font-size:.58rem;font-weight:700;letter-spacing:.12em;color:rgba(220,180,150,.65)}

.cg-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px);pointer-events:none;will-change:transform,opacity}
.cg-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem;will-change:transform,opacity}
.cg-title{margin:0;display:flex;justify-content:center;gap:.04em}
.cg-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;will-change:transform,opacity;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}
.cg-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent);transform-origin:center;will-change:transform,opacity}
.cg-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto;will-change:transform,opacity}
.cg-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem;pointer-events:none;will-change:opacity}
.cg-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background-color .3s}.cg-dots__d--on{background:rgba(255,170,110,.9)}
.cg-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.cg-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:cg-ps 4s linear infinite}@keyframes cg-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.cg-header{top:2.5vh}.cg-kicker{font-size:.44rem}.cg-t__w{font-size:1.5rem}.cg-sub{font-size:.48rem}.cg-row{gap:15px}.cg-layer{gap:15px}.cg-card{width:calc((100vw - 75px)/4)}.cg-card__label{font-size:.45rem}}
</style>
