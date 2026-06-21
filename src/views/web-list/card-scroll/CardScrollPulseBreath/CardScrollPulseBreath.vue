<template>
  <section ref="rootRef" class="pb-root">
    <div ref="particlesRef" class="pb-particles"><span v-for="p in plist" :key="p.id" class="pb-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="pb-stage">
      <div ref="bgRef" class="pb-bg"><img :src="imgs.bg" class="pb-bg__img" /></div>
      <div ref="overlayRef" class="pb-overlay"></div>

      <!-- 脉冲环层 -->
      <div ref="l1Ref" class="pb-pulse-layer" style="z-index:5">
        <div ref="l1RingRef" class="pb-ring"><img :src="imgs.i1" class="pb-ring__img" /></div>
      </div>
      <div ref="l2Ref" class="pb-pulse-layer" style="z-index:7">
        <div ref="l2RingRef" class="pb-ring"><img :src="imgs.i2" class="pb-ring__img" /></div>
      </div>
      <div ref="l3Ref" class="pb-pulse-layer" style="z-index:9">
        <div ref="l3RingRef" class="pb-ring"><img :src="imgs.i3" class="pb-ring__img" /></div>
      </div>
      <div ref="l4Ref" class="pb-pulse-layer" style="z-index:11">
        <div ref="l4RingRef" class="pb-ring"><img :src="imgs.i4" class="pb-ring__img" /></div>
      </div>

      <header ref="hRef" class="pb-header"><span ref="kRef" class="pb-kicker">◎ 向下滚动 · 脉冲呼吸 ◎</span><h1 class="pb-title"><span ref="t1Ref" class="pb-t__w pb-t__w--1">脉</span><span ref="t2Ref" class="pb-t__w pb-t__w--2">冲</span><span ref="t3Ref" class="pb-t__w pb-t__w--3">呼</span><span ref="t4Ref" class="pb-t__w pb-t__w--1">吸</span></h1><div ref="dRef" class="pb-divider"></div><p ref="sRef" class="pb-sub">环形脉冲 · 一呼一吸 · 层层扩散</p></header>
      <div ref="dotsRef" class="pb-dots"><span ref="dot1Ref" class="pb-dots__d pb-dots__d--on"></span><span ref="dot2Ref" class="pb-dots__d"></span><span ref="dot3Ref" class="pb-dots__d"></span><span ref="dot4Ref" class="pb-dots__d"></span></div>
      <div class="pb-progress"><div ref="pfRef" class="pb-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';import { gsap } from 'gsap';import { ScrollTrigger } from 'gsap/ScrollTrigger';gsap.registerPlugin(ScrollTrigger);type TC=()=>void
const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',i1:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80',i2:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',i3:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',i4:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'}
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:20},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
const l1Ref=ref<HTMLElement|null>(null),l1RingRef=ref<HTMLElement|null>(null),l2Ref=ref<HTMLElement|null>(null),l2RingRef=ref<HTMLElement|null>(null)
const l3Ref=ref<HTMLElement|null>(null),l3RingRef=ref<HTMLElement|null>(null),l4Ref=ref<HTMLElement|null>(null),l4RingRef=ref<HTMLElement|null>(null)
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

function pulseBreath(tl:gsap.core.Timeline,layer:HTMLElement,ring:HTMLElement,startT:number){
  // 初始：极小环 → 呼吸放大 → 收缩
  gsap.set(layer,{autoAlpha:1})
  gsap.set(ring,{scale:0.05,autoAlpha:0,borderRadius:'50%',overflow:'hidden'})
  // 吸气：放大到 1.4x
  tl.to(ring,{autoAlpha:1,duration:.03},startT)
  tl.to(ring,{scale:1.4,duration:.12,ease:'power2.out'},startT+.02)
  // 呼气：缩回到 1x 并稳定
  tl.to(ring,{scale:1,duration:.08,ease:'power2.inOut'},startT+.14)
  // 保持后缩小消失
  tl.to(ring,{scale:0.8,autoAlpha:0,duration:.08,ease:'power2.in'},startT+.26)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0})
  ;[l1RingRef,l2RingRef,l3RingRef,l4RingRef].forEach(r=>gsap.set(r.value,{scale:0.05,autoAlpha:0}))
  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8})
  gsap.set(dotsRef.value,{autoAlpha:0});gsap.set(particlesRef.value,{opacity:.2})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 30%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  tl.to(st,{opacity:1,duration:.03},.01);tl.to(hRef.value,{autoAlpha:1,y:0,duration:.04},.02)
  tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.03},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.04,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.03},.06);tl.to(sRef.value,{autoAlpha:1,y:0,duration:.03},.07)
  tl.to(dotsRef.value,{autoAlpha:1,duration:.03},.07);tl.to(particlesRef.value,{opacity:.5,duration:.04},.02)
  tl.to(overlayRef.value,{autoAlpha:1,duration:.06},.06);tl.to(bgRef.value,{scale:1,filter:'brightness(0.4)',duration:.06},.06)

  pulseBreath(tl,l1Ref.value!,l1RingRef.value!,.08);tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.24);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.28)
  pulseBreath(tl,l2Ref.value!,l2RingRef.value!,.30);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.46);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.50)
  pulseBreath(tl,l3Ref.value!,l3RingRef.value!,.52);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.68);tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.72)
  pulseBreath(tl,l4Ref.value!,l4RingRef.value!,.74)

  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},.90)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},.92);tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},.94)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},.94);tl.to(st,{opacity:.35,duration:.03},.96)
  tl.to(pfRef.value,{width:'100%',duration:1,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.pb-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.pb-particles{position:absolute;inset:0;z-index:1}.pb-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:pb-f var(--pd) var(--pdl) infinite ease-in-out}@keyframes pb-f{0%{transform:translateY(0)translateX(0)scale(1)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3)}100%{transform:translateY(0)translateX(0)scale(1)}}
.pb-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2}.pb-bg{position:absolute;inset:0;z-index:1}.pb-bg__img{width:100%;height:100%;object-fit:cover}.pb-overlay{position:absolute;inset:0;z-index:2;background:rgba(4,2,10,.6)}
.pb-pulse-layer{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:opacity}
.pb-ring{width:65vw;aspect-ratio:1;border-radius:50%;overflow:hidden;box-shadow:0 0 0 4px rgba(255,190,140,.25),0 0 60px rgba(200,150,255,.15);will-change:transform,opacity}
.pb-ring__img{width:100%;height:100%;object-fit:cover;display:block}
.pb-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px)}.pb-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}.pb-title{margin:0;display:flex;justify-content:center;gap:.04em}.pb-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}.pb-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}.pb-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.pb-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem}.pb-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15)}.pb-dots__d--on{background:rgba(255,170,110,.9)}
.pb-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.pb-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:pb-ps 4s linear infinite}@keyframes pb-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.pb-header{top:2.5vh}.pb-kicker{font-size:.44rem}.pb-t__w{font-size:1.5rem}.pb-sub{font-size:.48rem}.pb-ring{width:80vw}}
</style>
