<template>
  <section ref="rootRef" class="cl-root">
    <div ref="particlesRef" class="cl-particles"><span v-for="p in plist" :key="p.id" class="cl-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="cl-stage">
      <div ref="bgRef" class="cl-bg"><img :src="imgs.bg" class="cl-bg__img" /></div>
      <div ref="overlayRef" class="cl-overlay"></div>

      <!-- 中心大图 -->
      <div ref="centerRef" class="cl-center"><img :src="imgs.center" class="cl-center__img" /><div class="cl-center__glow"></div></div>
      <!-- 左侧3张 -->
      <div ref="colLRef" class="cl-col cl-col--l" style="gap:15px">
        <div v-for="(t,i) in sideL" :key="'sl'+i" :ref="(e:any)=>setSL(e,i)" class="cl-card"><img :src="t.u" class="cl-card__img" /><span class="cl-card__label">{{t.l}}</span></div>
      </div>
      <!-- 右侧3张 -->
      <div ref="colRRef" class="cl-col cl-col--r" style="gap:15px">
        <div v-for="(t,i) in sideR" :key="'sr'+i" :ref="(e:any)=>setSR(e,i)" class="cl-card"><img :src="t.u" class="cl-card__img" /><span class="cl-card__label">{{t.l}}</span></div>
      </div>

      <header ref="hRef" class="cl-header"><span ref="kRef" class="cl-kicker">▸ 向下滚动 · 中心上移 ▸</span><h1 class="cl-title"><span ref="t1Ref" class="cl-t__w cl-t__w--1">中</span><span ref="t2Ref" class="cl-t__w cl-t__w--2">心</span><span ref="t3Ref" class="cl-t__w cl-t__w--3">上</span><span ref="t4Ref" class="cl-t__w cl-t__w--1">移</span></h1><div ref="dRef" class="cl-divider"></div><p ref="sRef" class="cl-sub">中心不动 · 两侧列队上移 · 六图环绕</p></header>
      <div class="cl-progress"><div ref="pfRef" class="cl-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';import { gsap } from 'gsap';import { ScrollTrigger } from 'gsap/ScrollTrigger';gsap.registerPlugin(ScrollTrigger);type TC=()=>void
const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',center:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80'}
const u='https://images.unsplash.com/photo'
const sideL=[{u:`${u}-1441974231531-c6227db76b6e?w=300&q=80`,l:'森林'},{u:`${u}-1465146344425-f00d5f5c8f07?w=300&q=80`,l:'花卉'},{u:`${u}-1490750967868-88aa4486c946?w=300&q=80`,l:'草原'}]
const sideR=[{u:`${u}-1507525428034-b723cf961d3e?w=300&q=80`,l:'海洋'},{u:`${u}-1470770903676-69b98201ea1c?w=300&q=80`,l:'湖泊'},{u:`${u}-1505144808419-1957a94ca61e?w=300&q=80`,l:'湖光'}]
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:20},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
const centerRef=ref<HTMLElement|null>(null),colLRef=ref<HTMLElement|null>(null),colRRef=ref<HTMLElement|null>(null)
const sL:HTMLElement[]=[],sR:HTMLElement[]=[];function setSL(e:any,i:number){if(e instanceof HTMLElement)sL[i]=e};function setSR(e:any,i:number){if(e instanceof HTMLElement)sR[i]=e}
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0})
  gsap.set(centerRef.value,{autoAlpha:0,scale:.85})
  gsap.set(colLRef.value,{y:'50vh',autoAlpha:0});gsap.set(colRRef.value,{y:'50vh',autoAlpha:0})
  ;[...sL,...sR].forEach(c=>gsap.set(c,{autoAlpha:0,y:25}))
  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8});gsap.set(particlesRef.value,{opacity:.2})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 25%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  tl.to(st,{opacity:1,duration:.03},.01);tl.to(hRef.value,{autoAlpha:1,y:0,duration:.04},.02)
  tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.03},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.04,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.03},.06);tl.to(sRef.value,{autoAlpha:1,y:0,duration:.03},.07)
  tl.to(particlesRef.value,{opacity:.5,duration:.04},.02)
  tl.to(overlayRef.value,{autoAlpha:1,duration:.06},.06);tl.to(bgRef.value,{scale:1,filter:'brightness(0.4)',duration:.06},.06)

  // 中心图淡入
  tl.to(centerRef.value,{autoAlpha:1,scale:1,duration:.08,ease:'power3.out'},.08)
  // 左侧列上移
  tl.to(colLRef.value,{y:0,autoAlpha:1,duration:.10,ease:'power3.out'},.12)
  sL.forEach((c,i)=>tl.to(c,{autoAlpha:1,y:0,duration:.05,ease:'back.out(1.5)'},.14+i*.08))
  // 右侧列上移
  tl.to(colRRef.value,{y:0,autoAlpha:1,duration:.10,ease:'power3.out'},.16)
  sR.forEach((c,i)=>tl.to(c,{autoAlpha:1,y:0,duration:.05,ease:'back.out(1.5)'},.18+i*.08))

  tl.to(bgRef.value,{filter:'brightness(0.3)',duration:.06},.40)
  tl.to(overlayRef.value,{autoAlpha:.85,duration:.05},.46)
  tl.to([colLRef.value,colRRef.value],{y:'-6vh',duration:.06},.48)
  tl.to(centerRef.value,{autoAlpha:.3,duration:.04},.48)
  tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},.50)
  tl.to(st,{opacity:.35,duration:.04},.52)
  tl.to(pfRef.value,{width:'100%',duration:.6,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.cl-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.cl-particles{position:absolute;inset:0;z-index:1}.cl-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:cl-f var(--pd) var(--pdl) infinite ease-in-out}@keyframes cl-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.cl-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2}.cl-bg{position:absolute;inset:0;z-index:1}.cl-bg__img{width:100%;height:100%;object-fit:cover}.cl-overlay{position:absolute;inset:0;z-index:2;background:rgba(4,2,10,.65);backdrop-filter:blur(2px)}
.cl-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:28vw;z-index:4;text-align:center}.cl-center__img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:10px;display:block;box-shadow:0 0 0 3px rgba(255,200,150,.25),0 20px 50px rgba(0,0,0,.5)}.cl-center__glow{position:absolute;inset:-8px;border-radius:14px;background:radial-gradient(ellipse 60% 60% at 50% 50%,rgba(200,150,255,.12) 0%,transparent 60%);filter:blur(15px);pointer-events:none}
.cl-col{position:absolute;top:12vh;z-index:3;display:flex;flex-direction:column}.cl-col--l{left:3vw}.cl-col--r{right:3vw}
.cl-card{width:15vw;text-align:center}.cl-card__img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:6px;display:block;box-shadow:0 0 0 1.5px rgba(255,190,140,.14),0 8px 24px rgba(0,0,0,.3)}.cl-card__label{display:block;margin-top:.2rem;font-size:.45rem;font-weight:700;letter-spacing:.1em;color:rgba(200,160,140,.5)}
.cl-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px)}.cl-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}.cl-title{margin:0;display:flex;justify-content:center;gap:.04em}.cl-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}.cl-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}.cl-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.cl-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.cl-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:cl-ps 4s linear infinite}@keyframes cl-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.cl-header{top:2.5vh}.cl-kicker{font-size:.44rem}.cl-t__w{font-size:1.5rem}.cl-sub{font-size:.48rem}.cl-center{width:34vw}.cl-card{width:18vw}.cl-card__label{font-size:.38rem}}
</style>
