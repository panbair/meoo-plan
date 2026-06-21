<template>
  <section ref="rootRef" class="ps-root">
    <div ref="particlesRef" class="ps-particles"><span v-for="p in plist" :key="p.id" class="ps-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="ps-stage">
      <div ref="bgRef" class="ps-bg"><img :src="imgs.bg" class="ps-bg__img" /></div>
      <div ref="overlayRef" class="ps-overlay"></div>

      <!-- ══════ 第1层棱镜 ══════ -->
      <div ref="l1Ref" class="ps-prism-layer" style="z-index:5">
        <div ref="l1L" class="ps-band ps-band--left"><img :src="imgs.p1" class="ps-band__img ps-band__img--left" /><div class="ps-band__edge ps-band__edge--r"></div></div>
        <div ref="l1C" class="ps-band ps-band--center"><img :src="imgs.p1" class="ps-band__img ps-band__img--center" /></div>
        <div ref="l1R" class="ps-band ps-band--right"><img :src="imgs.p1" class="ps-band__img ps-band__img--right" /><div class="ps-band__edge ps-band__edge--l"></div></div>
      </div>

      <div ref="l2Ref" class="ps-prism-layer" style="z-index:7">
        <div ref="l2L" class="ps-band ps-band--left"><img :src="imgs.p2" class="ps-band__img ps-band__img--left" /><div class="ps-band__edge ps-band__edge--r"></div></div>
        <div ref="l2C" class="ps-band ps-band--center"><img :src="imgs.p2" class="ps-band__img ps-band__img--center" /></div>
        <div ref="l2R" class="ps-band ps-band--right"><img :src="imgs.p2" class="ps-band__img ps-band__img--right" /><div class="ps-band__edge ps-band__edge--l"></div></div>
      </div>

      <div ref="l3Ref" class="ps-prism-layer" style="z-index:9">
        <div ref="l3L" class="ps-band ps-band--left"><img :src="imgs.p3" class="ps-band__img ps-band__img--left" /><div class="ps-band__edge ps-band__edge--r"></div></div>
        <div ref="l3C" class="ps-band ps-band--center"><img :src="imgs.p3" class="ps-band__img ps-band__img--center" /></div>
        <div ref="l3R" class="ps-band ps-band--right"><img :src="imgs.p3" class="ps-band__img ps-band__img--right" /><div class="ps-band__edge ps-band__edge--l"></div></div>
      </div>

      <header ref="hRef" class="ps-header">
        <span ref="kRef" class="ps-kicker">◇ 向下滚动 · 棱镜偏移 ◇</span>
        <h1 class="ps-title"><span ref="t1Ref" class="ps-t__w ps-t__w--1">棱</span><span ref="t2Ref" class="ps-t__w ps-t__w--2">镜</span><span ref="t3Ref" class="ps-t__w ps-t__w--3">偏</span><span ref="t4Ref" class="ps-t__w ps-t__w--1">移</span></h1>
        <div ref="dRef" class="ps-divider"></div><p ref="sRef" class="ps-sub">三色棱镜 · 光谱分离 · 偏移之中见真彩</p>
      </header>
      <div ref="dotsRef" class="ps-dots"><span ref="dot1Ref" class="ps-dots__d ps-dots__d--on"></span><span ref="dot2Ref" class="ps-dots__d"></span><span ref="dot3Ref" class="ps-dots__d"></span><span ref="dot4Ref" class="ps-dots__d"></span></div>
      <div class="ps-progress"><div ref="pfRef" class="ps-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TC=()=>void

const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',p1:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',p2:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',p3:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80'}
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:25},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
const l1Ref=ref<HTMLElement|null>(null),l1L=ref<HTMLElement|null>(null),l1C=ref<HTMLElement|null>(null),l1R=ref<HTMLElement|null>(null)
const l2Ref=ref<HTMLElement|null>(null),l2L=ref<HTMLElement|null>(null),l2C=ref<HTMLElement|null>(null),l2R=ref<HTMLElement|null>(null)
const l3Ref=ref<HTMLElement|null>(null),l3L=ref<HTMLElement|null>(null),l3C=ref<HTMLElement|null>(null),l3R=ref<HTMLElement|null>(null)
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

function prismShift(tl:gsap.core.Timeline,left:HTMLElement,center:HTMLElement,right:HTMLElement,startT:number){
  gsap.set(left,{x:0,y:0,autoAlpha:1});gsap.set(center,{y:0,autoAlpha:1});gsap.set(right,{x:0,y:0,autoAlpha:1})
  // 三带向不同方向偏移 — 棱镜分光
  tl.to(left,{x:'-20vw',y:'-5vh',duration:.10,ease:'power3.out'},startT)
  tl.to(center,{y:'-10vh',filter:'brightness(1.2)',duration:.10,ease:'power2.out'},startT+.03)
  tl.to(right,{x:'20vw',y:'5vh',duration:.10,ease:'power3.out'},startT+.03)
  // 加速偏移到边缘
  tl.to(left,{x:'-55vw',autoAlpha:0,duration:.12,ease:'power3.in'},startT+.14)
  tl.to(center,{y:'-50vh',autoAlpha:0,duration:.12,ease:'power3.in'},startT+.16)
  tl.to(right,{x:'55vw',autoAlpha:0,duration:.12,ease:'power3.in'},startT+.14)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0})
  ;[l1L,l1C,l1R,l2L,l2C,l2R,l3L,l3C,l3R].forEach(d=>gsap.set(d.value,{x:0,y:0,autoAlpha:1}))
  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8})
  gsap.set(dotsRef.value,{autoAlpha:0});gsap.set(particlesRef.value,{opacity:.2})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 35%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  tl.to(st,{opacity:1,duration:.03},.01)
  tl.to(hRef.value,{autoAlpha:1,y:0,duration:.04},.02)
  tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.03},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.04,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.03},.06)
  tl.to(sRef.value,{autoAlpha:1,y:0,duration:.03},.07)
  tl.to(dotsRef.value,{autoAlpha:1,duration:.03},.07)
  tl.to(particlesRef.value,{opacity:.5,duration:.04},.02)
  tl.to(overlayRef.value,{autoAlpha:1,duration:.06},.06)
  tl.to(bgRef.value,{scale:1,filter:'brightness(0.4)',duration:.06},.06)

  prismShift(tl,l1L.value!,l1C.value!,l1R.value!,.10)
  tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.30)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.34)

  prismShift(tl,l2L.value!,l2C.value!,l2R.value!,.36)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.56)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.60)

  prismShift(tl,l3L.value!,l3C.value!,l3R.value!,.62)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.82)
  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.86)

  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},.90)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},.92)
  tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},.94)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},.94)
  tl.to(particlesRef.value,{opacity:.1,duration:.03},.96)
  tl.to(st,{opacity:.35,duration:.03},.97)
  tl.to(pfRef.value,{width:'100%',duration:1,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ps-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.ps-particles{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity}
.ps-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:ps-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity}
@keyframes ps-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.ps-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2;will-change:opacity}
.ps-bg{position:absolute;inset:0;z-index:1}.ps-bg__img{width:100%;height:100%;object-fit:cover;display:block}
.ps-overlay{position:absolute;inset:0;z-index:2;pointer-events:none;background:rgba(4,2,10,.6);backdrop-filter:blur(1px);will-change:opacity}

.ps-prism-layer{position:absolute;inset:0}
.ps-band{position:absolute;top:0;width:34vw;height:100%;overflow:hidden;will-change:transform,opacity,filter}
.ps-band--left{left:0}.ps-band--center{left:33vw;width:34vw}.ps-band--right{right:0}
.ps-band__img{position:absolute;top:0;height:100%;width:300%;object-fit:cover;display:block}
.ps-band__img--left{left:0}.ps-band__img--center{left:-100%}.ps-band__img--right{right:0}

/* 棱镜色散边缘 */
.ps-band__edge{position:absolute;top:0;width:8px;height:100%;pointer-events:none}
.ps-band__edge--r{right:0;background:linear-gradient(90deg,transparent,rgba(255,100,80,.3),rgba(80,160,255,.15),transparent)}
.ps-band__edge--l{left:0;background:linear-gradient(270deg,transparent,rgba(80,160,255,.3),rgba(255,100,80,.15),transparent)}

.ps-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px);pointer-events:none;will-change:transform,opacity}
.ps-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}
.ps-title{margin:0;display:flex;justify-content:center;gap:.04em}
.ps-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}
.ps-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}
.ps-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.ps-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem;pointer-events:none}.ps-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background-color .3s}.ps-dots__d--on{background:rgba(255,170,110,.9)}
.ps-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.ps-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:ps-ps 4s linear infinite}@keyframes ps-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.ps-header{top:2.5vh}.ps-kicker{font-size:.44rem}.ps-t__w{font-size:1.5rem}.ps-sub{font-size:.48rem}}
</style>
