<template>
  <section ref="rootRef" class="cd-root">
    <div ref="particlesRef" class="cd-particles"><span v-for="p in plist" :key="p.id" class="cd-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="cd-stage">
      <div ref="bgRef" class="cd-bg"><img :src="imgs.bg" class="cd-bg__img" /></div>
      <div ref="overlayRef" class="cd-overlay"></div>

      <!-- ══════ 幕帘：5条垂直布幔 ══════ -->
      <div ref="curtains1Ref" class="cd-curtains" style="z-index:5">
        <div v-for="i in 5" :key="'c1-'+i" :ref="(el:any)=>setC1(el,i-1)" class="cd-strip" :style="{left:(i-1)*20+'%',width:'20%'}">
          <img :src="imgs.strip1" class="cd-strip__img" :style="{left:-(i-1)*20+'%'}" />
          <div class="cd-strip__wave"></div>
        </div>
      </div>
      <div ref="curtains2Ref" class="cd-curtains" style="z-index:7">
        <div v-for="i in 5" :key="'c2-'+i" :ref="(el:any)=>setC2(el,i-1)" class="cd-strip" :style="{left:(i-1)*20+'%',width:'20%'}">
          <img :src="imgs.strip2" class="cd-strip__img" :style="{left:-(i-1)*20+'%'}" />
          <div class="cd-strip__wave"></div>
        </div>
      </div>
      <div ref="curtains3Ref" class="cd-curtains" style="z-index:9">
        <div v-for="i in 5" :key="'c3-'+i" :ref="(el:any)=>setC3(el,i-1)" class="cd-strip" :style="{left:(i-1)*20+'%',width:'20%'}">
          <img :src="imgs.strip3" class="cd-strip__img" :style="{left:-(i-1)*20+'%'}" />
          <div class="cd-strip__wave"></div>
        </div>
      </div>

      <header ref="hRef" class="cd-header">
        <span ref="kRef" class="cd-kicker">▬ 向下滚动 · 幕帘垂落 ▬</span>
        <h1 class="cd-title"><span ref="t1Ref" class="cd-t__w cd-t__w--1">幕</span><span ref="t2Ref" class="cd-t__w cd-t__w--2">帘</span><span ref="t3Ref" class="cd-t__w cd-t__w--3">垂</span><span ref="t4Ref" class="cd-t__w cd-t__w--1">落</span></h1>
        <div ref="dRef" class="cd-divider"></div><p ref="sRef" class="cd-sub">五道布幔 · 依次垂落 · 幕帘之后见新境</p>
      </header>
      <div ref="dotsRef" class="cd-dots"><span ref="dot1Ref" class="cd-dots__d cd-dots__d--on"></span><span ref="dot2Ref" class="cd-dots__d"></span><span ref="dot3Ref" class="cd-dots__d"></span><span ref="dot4Ref" class="cd-dots__d"></span></div>
      <div class="cd-progress"><div ref="pfRef" class="cd-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TC=()=>void

const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',strip1:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',strip2:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',strip3:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80'}
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:25},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
const curtains1Ref=ref<HTMLElement|null>(null),curtains2Ref=ref<HTMLElement|null>(null),curtains3Ref=ref<HTMLElement|null>(null)
const c1:HTMLElement[]=[],c2:HTMLElement[]=[],c3:HTMLElement[]=[]
function setC1(e:any,i:number){if(e instanceof HTMLElement)c1[i]=e};function setC2(e:any,i:number){if(e instanceof HTMLElement)c2[i]=e};function setC3(e:any,i:number){if(e instanceof HTMLElement)c3[i]=e}
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

// 幕帘垂落：5条布幔依次从上往下掉落
function curtainDrop(tl:gsap.core.Timeline,strips:HTMLElement[],startT:number){
  strips.forEach(s=>gsap.set(s,{y:'-100vh',autoAlpha:1}))
  // 5条依次垂落，像幕布掉下来
  strips.forEach((s,i)=>tl.to(s,{y:0,duration:.10,ease:'bounce.out'},startT+i*.06))
  // 停留后继续下落淡出
  tl.to(strips,{y:'100vh',autoAlpha:0,duration:.10,stagger:.03,ease:'power2.in'},startT+.30)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0})
  ;[c1,c2,c3].forEach(arr=>arr.forEach(s=>gsap.set(s,{y:'-100vh',autoAlpha:1})))
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

  curtainDrop(tl,c1,.10);tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.32);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.36)
  curtainDrop(tl,c2,.38);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.60);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.64)
  curtainDrop(tl,c3,.66);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.88);tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.92)

  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},.96)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},.98);tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},1.0)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},1.0);tl.to(particlesRef.value,{opacity:.1,duration:.03},1.02)
  tl.to(st,{opacity:.35,duration:.03},1.04);tl.to(pfRef.value,{width:'100%',duration:1.1,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.cd-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.cd-particles{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity}
.cd-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:cd-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity}
@keyframes cd-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.cd-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2;will-change:opacity}
.cd-bg{position:absolute;inset:0;z-index:1}.cd-bg__img{width:100%;height:100%;object-fit:cover;display:block}
.cd-overlay{position:absolute;inset:0;z-index:2;pointer-events:none;background:rgba(4,2,10,.6);backdrop-filter:blur(1px);will-change:opacity}

.cd-curtains{position:absolute;inset:0}
.cd-strip{position:absolute;top:0;height:100%;overflow:hidden;will-change:transform,opacity}
.cd-strip__img{position:absolute;top:0;width:500%;height:100%;object-fit:cover;display:block}
.cd-strip__wave{position:absolute;bottom:0;left:0;width:100%;height:20px;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(255,200,140,.15));filter:blur(4px)}

.cd-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px);pointer-events:none;will-change:transform,opacity}
.cd-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}
.cd-title{margin:0;display:flex;justify-content:center;gap:.04em}
.cd-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}
.cd-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}
.cd-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.cd-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem;pointer-events:none}.cd-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background-color .3s}.cd-dots__d--on{background:rgba(255,170,110,.9)}
.cd-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.cd-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:cd-ps 4s linear infinite}@keyframes cd-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.cd-header{top:2.5vh}.cd-kicker{font-size:.44rem}.cd-t__w{font-size:1.5rem}.cd-sub{font-size:.48rem}}
</style>
