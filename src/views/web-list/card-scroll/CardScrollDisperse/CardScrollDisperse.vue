<template>
  <section ref="rootRef" class="dp-root">
    <div ref="particlesRef" class="dp-particles"><span v-for="p in plist" :key="p.id" class="dp-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="dp-stage">
      <div ref="bgRef" class="dp-bg"><img :src="imgs.bg" class="dp-bg__img" /></div>
      <div ref="overlayRef" class="dp-overlay"></div>

      <!-- 底层图（始终可见） -->
      <div class="dp-base" style="z-index:3"><img :src="imgs.base" class="dp-base__img" /></div>

      <!-- 散开层：8图从中心飞向八方 -->
      <div ref="l1Ref" class="dp-layer" style="z-index:5">
        <div v-for="(t,i) in cards1" :key="'d1-'+i" :ref="(e:any)=>setL1(e,i)" class="dp-card"><img :src="t.u" class="dp-card__img" /></div>
      </div>
      <div ref="l2Ref" class="dp-layer" style="z-index:7">
        <div v-for="(t,i) in cards2" :key="'d2-'+i" :ref="(e:any)=>setL2(e,i)" class="dp-card"><img :src="t.u" class="dp-card__img" /></div>
      </div>
      <div ref="l3Ref" class="dp-layer" style="z-index:9">
        <div v-for="(t,i) in cards3" :key="'d3-'+i" :ref="(e:any)=>setL3(e,i)" class="dp-card"><img :src="t.u" class="dp-card__img" /></div>
      </div>

      <header ref="hRef" class="dp-header"><span ref="kRef" class="dp-kicker">◎ 向下滚动 · 中心扩散 ◎</span><h1 class="dp-title"><span ref="t1Ref" class="dp-t__w dp-t__w--1">中</span><span ref="t2Ref" class="dp-t__w dp-t__w--2">心</span><span ref="t3Ref" class="dp-t__w dp-t__w--3">扩</span><span ref="t4Ref" class="dp-t__w dp-t__w--1">散</span></h1><div ref="dRef" class="dp-divider"></div><p ref="sRef" class="dp-sub">中心爆发 · 飞向八方 · 层层扩散</p></header>
      <div ref="dotsRef" class="dp-dots"><span ref="dot1Ref" class="dp-dots__d dp-dots__d--on"></span><span ref="dot2Ref" class="dp-dots__d"></span><span ref="dot3Ref" class="dp-dots__d"></span><span ref="dot4Ref" class="dp-dots__d"></span></div>
      <div class="dp-progress"><div ref="pfRef" class="dp-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';import { gsap } from 'gsap';import { ScrollTrigger } from 'gsap/ScrollTrigger';gsap.registerPlugin(ScrollTrigger);type TC=()=>void
const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',base:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80'}
const u='https://images.unsplash.com/photo'
const cards1=[{u:`${u}-1498579150354-977475b7ea0b?w=250&q=80`},{u:`${u}-1441974231531-c6227db76b6e?w=250&q=80`},{u:`${u}-1507525428034-b723cf961d3e?w=250&q=80`},{u:`${u}-1465146344425-f00d5f5c8f07?w=250&q=80`},{u:`${u}-1470770903676-69b98201ea1c?w=250&q=80`},{u:`${u}-1490750967868-88aa4486c946?w=250&q=80`},{u:`${u}-1505144808419-1957a94ca61e?w=250&q=80`},{u:`${u}-1469474968028-56623f02e42e?w=250&q=80`}]
const cards2=[{u:`${u}-1501785888041-af3ef285b470?w=250&q=80`},{u:`${u}-1518837695005-2083093ee35b?w=250&q=80`},{u:`${u}-1472214103451-9374bd1c798e?w=250&q=80`},{u:`${u}-1500382017468-9049fed747ef?w=250&q=80`},{u:`${u}-1426604966848-d7adac402bff?w=250&q=80`},{u:`${u}-1447752875215-b2761acb3c5d?w=250&q=80`},{u:`${u}-1446329813274-7c9036bd9a1f?w=250&q=80`},{u:`${u}-1475924156734-496f6cac6ec1?w=250&q=80`}]
const cards3=[{u:`${u}-1506744038136-46273834b3fb?w=250&q=80`},{u:`${u}-1444464666168-49d633b86797?w=250&q=80`},{u:`${u}-1470071459604-3b5ec3a7fe05?w=250&q=80`},{u:`${u}-1454496522488-7a8e488e8606?w=250&q=80`},{u:`${u}-1498579150354-977475b7ea0b?w=250&q=80`},{u:`${u}-1470770903676-69b98201ea1c?w=250&q=80`},{u:`${u}-1507525428034-b723cf961d3e?w=250&q=80`},{u:`${u}-1441974231531-c6227db76b6e?w=250&q=80`}]
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:25},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
const l1Ref=ref<HTMLElement|null>(null),l2Ref=ref<HTMLElement|null>(null),l3Ref=ref<HTMLElement|null>(null)
const l1:HTMLElement[]=[],l2:HTMLElement[]=[],l3:HTMLElement[]=[]
function setL1(e:any,i:number){if(e instanceof HTMLElement)l1[i]=e};function setL2(e:any,i:number){if(e instanceof HTMLElement)l2[i]=e};function setL3(e:any,i:number){if(e instanceof HTMLElement)l3[i]=e}
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

function disperseLayer(tl:gsap.core.Timeline,cards:HTMLElement[],startT:number){
  // 初始：全部聚在中心
  cards.forEach(c=>gsap.set(c,{x:0,y:0,autoAlpha:1,scale:.5,rotation:0}))
  // 中心放大
  tl.to(cards,{scale:1,duration:.05,ease:'power2.out'},startT)
  // 飞散：向八个方向
  cards.forEach((c,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;tl.to(c,{x:Math.cos(a)*55+'vw',y:Math.sin(a)*55+'vh',autoAlpha:0,scale:.4,rotation:i%2?-40:40,duration:.16,ease:'power3.in'},startT+.06)})
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0})
  ;[l1,l2,l3].forEach(arr=>arr.forEach(c=>gsap.set(c,{autoAlpha:0})))
  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8})
  gsap.set(dotsRef.value,{autoAlpha:0});gsap.set(particlesRef.value,{opacity:.2})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 35%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  tl.to(st,{opacity:1,duration:.03},.01);tl.to(hRef.value,{autoAlpha:1,y:0,duration:.04},.02)
  tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.03},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.04,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.03},.06);tl.to(sRef.value,{autoAlpha:1,y:0,duration:.03},.07)
  tl.to(dotsRef.value,{autoAlpha:1,duration:.03},.07);tl.to(particlesRef.value,{opacity:.5,duration:.04},.02)
  tl.to(overlayRef.value,{autoAlpha:1,duration:.06},.06);tl.to(bgRef.value,{scale:1,filter:'brightness(0.4)',duration:.06},.06)

  disperseLayer(tl,l1,.10);tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.24);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.28)
  disperseLayer(tl,l2,.30);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.44);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.48)
  disperseLayer(tl,l3,.50);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.64);tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.68)

  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},.72)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},.74);tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},.76)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},.76);tl.to(st,{opacity:.35,duration:.03},.78)
  tl.to(pfRef.value,{width:'100%',duration:.8,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.dp-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.dp-particles{position:absolute;inset:0;z-index:1}.dp-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:dp-f var(--pd) var(--pdl) infinite ease-in-out}@keyframes dp-f{0%{transform:translateY(0)translateX(0)scale(1)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3)}100%{transform:translateY(0)translateX(0)scale(1)}}
.dp-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2}.dp-bg{position:absolute;inset:0;z-index:1}.dp-bg__img{width:100%;height:100%;object-fit:cover}.dp-overlay{position:absolute;inset:0;z-index:2;background:rgba(4,2,10,.6)}
.dp-base{position:absolute;inset:0}.dp-base__img{width:100%;height:100%;object-fit:cover}.dp-layer{position:absolute;inset:0}.dp-card{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:9vw;text-align:center;will-change:transform,opacity}.dp-card__img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:50%;display:block;box-shadow:0 0 0 2px rgba(255,190,140,.2),0 8px 24px rgba(0,0,0,.4)}
.dp-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px)}.dp-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}.dp-title{margin:0;display:flex;justify-content:center;gap:.04em}.dp-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}.dp-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}.dp-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.dp-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem}.dp-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15)}.dp-dots__d--on{background:rgba(255,170,110,.9)}
.dp-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.dp-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:dp-ps 4s linear infinite}@keyframes dp-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.dp-header{top:2.5vh}.dp-kicker{font-size:.44rem}.dp-t__w{font-size:1.5rem}.dp-sub{font-size:.48rem}}
</style>
