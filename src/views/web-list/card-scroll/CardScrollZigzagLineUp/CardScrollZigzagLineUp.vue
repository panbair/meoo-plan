<template>
  <section ref="rootRef" class="zz-root">
    <div ref="particlesRef" class="zz-particles"><span v-for="p in plist" :key="p.id" class="zz-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="zz-stage">
      <div ref="bgRef" class="zz-bg"><img :src="imgs.bg" class="zz-bg__img" /></div>
      <div ref="overlayRef" class="zz-overlay"></div>

      <div ref="rowRef" class="zz-row" style="gap:25px">
        <div v-for="(t,i) in cards" :key="i" :ref="(e:any)=>setC(e,i)" class="zz-card"><img :src="t.u" class="zz-card__img" /><span class="zz-card__label">{{t.l}}</span></div>
      </div>

      <header ref="hRef" class="zz-header"><span ref="kRef" class="zz-kicker">▸ 向下滚动 · 之字上移 ▸</span><h1 class="zz-title"><span ref="t1Ref" class="zz-t__w zz-t__w--1">之</span><span ref="t2Ref" class="zz-t__w zz-t__w--2">字</span><span ref="t3Ref" class="zz-t__w zz-t__w--3">上</span><span ref="t4Ref" class="zz-t__w zz-t__w--1">移</span></h1><div ref="dRef" class="zz-divider"></div><p ref="sRef" class="zz-sub">左右交替 · 之字路线 · 依次登场</p></header>
      <div class="zz-progress"><div ref="pfRef" class="zz-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';import { gsap } from 'gsap';import { ScrollTrigger } from 'gsap/ScrollTrigger';gsap.registerPlugin(ScrollTrigger);type TC=()=>void
const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
const u='https://images.unsplash.com/photo'
const cards=[{u:`${u}-1498579150354-977475b7ea0b?w=600&q=80`,l:'晨 曦'},{u:`${u}-1507525428034-b723cf961d3e?w=600&q=80`,l:'海 洋'},{u:`${u}-1470770903676-69b98201ea1c?w=600&q=80`,l:'湖 泊'},{u:`${u}-1441974231531-c6227db76b6e?w=600&q=80`,l:'森 林'}]
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:20},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
const rowRef=ref<HTMLElement|null>(null);const cc:HTMLElement[]=[];function setC(e:any,i:number){if(e instanceof HTMLElement)cc[i]=e}
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0})
  gsap.set(rowRef.value,{autoAlpha:0})
  // 之字初始：交替从左下(-30vw)和右下(30vw)开始
  cc.forEach((c,i)=>{const isLeft=i%2===0;gsap.set(c,{y:'50vh',x:isLeft?'-20vw':'20vw',autoAlpha:0})})
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

  // 之字上移：每张从交替位置滑入
  tl.to(rowRef.value,{autoAlpha:1,duration:.02},.08)
  cc.forEach((c,i)=>{
    const isLeft=i%2===0
    tl.to(c,{autoAlpha:1,duration:.03,ease:'power2.out'},.10+i*.10)
    tl.to(c,{x:0,y:0,duration:.10,ease:'power3.out'},.10+i*.10)
  })

  tl.to(bgRef.value,{filter:'brightness(0.3)',duration:.06},.44)
  tl.to(overlayRef.value,{autoAlpha:.85,duration:.05},.50)
  tl.to(cc,{y:'-6vh',duration:.06},.52)
  tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},.54)
  tl.to(st,{opacity:.35,duration:.04},.56)
  tl.to(pfRef.value,{width:'100%',duration:.6,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.zz-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.zz-particles{position:absolute;inset:0;z-index:1}.zz-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:zz-f var(--pd) var(--pdl) infinite ease-in-out}@keyframes zz-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.zz-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2}.zz-bg{position:absolute;inset:0;z-index:1}.zz-bg__img{width:100%;height:100%;object-fit:cover}.zz-overlay{position:absolute;inset:0;z-index:2;background:rgba(4,2,10,.65);backdrop-filter:blur(2px)}
.zz-row{position:absolute;inset:0;z-index:3;display:flex;align-items:center;justify-content:center}.zz-card{width:calc((100vw - 130px)/4);text-align:center}.zz-card__img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:8px;display:block;box-shadow:0 0 0 2px rgba(255,190,140,.2),0 12px 36px rgba(0,0,0,.45)}.zz-card__label{display:block;margin-top:.35rem;font-size:.58rem;font-weight:700;letter-spacing:.14em;color:rgba(200,160,140,.6)}
.zz-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px)}.zz-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}.zz-title{margin:0;display:flex;justify-content:center;gap:.04em}.zz-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}.zz-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}.zz-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.zz-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.zz-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:zz-ps 4s linear infinite}@keyframes zz-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.zz-header{top:2.5vh}.zz-kicker{font-size:.44rem}.zz-t__w{font-size:1.5rem}.zz-sub{font-size:.48rem}.zz-card{width:calc((100vw - 70px)/4)}.zz-card__label{font-size:.45rem}}
</style>
