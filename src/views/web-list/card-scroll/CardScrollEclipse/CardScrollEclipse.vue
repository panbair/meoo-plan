<template>
  <section ref="rootRef" class="ec-root">
    <div ref="particlesRef" class="ec-particles"><span v-for="p in plist" :key="p.id" class="ec-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="ec-stage">
      <div ref="bgRef" class="ec-bg"><img :src="imgs.bg" class="ec-bg__img" /></div>
      <div ref="overlayRef" class="ec-overlay"></div>

      <!-- 日轮（底层） -->
      <div ref="sunRef" class="ec-sun"><img :src="imgs.sun" class="ec-sun__img" /></div>

      <!-- 月轮遮罩层 -->
      <div ref="moon1Ref" class="ec-moon"><div class="ec-moon__disc"></div></div>
      <div ref="moon2Ref" class="ec-moon"><div class="ec-moon__disc"></div></div>
      <div ref="moon3Ref" class="ec-moon"><div class="ec-moon__disc"></div></div>

      <!-- 被蚀出的新图 -->
      <div ref="eclipse1Ref" class="ec-eclipse"><img :src="imgs.e1" class="ec-eclipse__img" /></div>
      <div ref="eclipse2Ref" class="ec-eclipse"><img :src="imgs.e2" class="ec-eclipse__img" /></div>
      <div ref="eclipse3Ref" class="ec-eclipse"><img :src="imgs.e3" class="ec-eclipse__img" /></div>

      <header ref="hRef" class="ec-header"><span ref="kRef" class="ec-kicker">◎ 向下滚动 · 日蚀轮转 ◎</span><h1 class="ec-title"><span ref="t1Ref" class="ec-t__w ec-t__w--1">日</span><span ref="t2Ref" class="ec-t__w ec-t__w--2">蚀</span><span ref="t3Ref" class="ec-t__w ec-t__w--3">轮</span><span ref="t4Ref" class="ec-t__w ec-t__w--1">转</span></h1><div ref="dRef" class="ec-divider"></div><p ref="sRef" class="ec-sub">月掩日轮 · 蚀出新境 · 层层轮转</p></header>
      <div ref="dotsRef" class="ec-dots"><span ref="dot1Ref" class="ec-dots__d ec-dots__d--on"></span><span ref="dot2Ref" class="ec-dots__d"></span><span ref="dot3Ref" class="ec-dots__d"></span><span ref="dot4Ref" class="ec-dots__d"></span></div>
      <div class="ec-progress"><div ref="pfRef" class="ec-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';import { gsap } from 'gsap';import { ScrollTrigger } from 'gsap/ScrollTrigger';gsap.registerPlugin(ScrollTrigger);type TC=()=>void
const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',sun:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1000&q=80',e1:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1000&q=80',e2:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',e3:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&q=80'}
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:25},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
const sunRef=ref<HTMLElement|null>(null),moon1Ref=ref<HTMLElement|null>(null),moon2Ref=ref<HTMLElement|null>(null),moon3Ref=ref<HTMLElement|null>(null)
const eclipse1Ref=ref<HTMLElement|null>(null),eclipse2Ref=ref<HTMLElement|null>(null),eclipse3Ref=ref<HTMLElement|null>(null)
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

function eclipsePass(tl:gsap.core.Timeline,moon:HTMLElement,eclipse:HTMLElement,startT:number){
  // 初始：月轮在左侧外，蚀图不可见
  gsap.set(moon,{x:'-60vw',autoAlpha:1})
  gsap.set(eclipse,{clipPath:'circle(0% at 50% 50%)',autoAlpha:1})
  // 月轮划过 → 蚀出图像
  tl.to(moon,{x:'60vw',duration:.16,ease:'none'},startT)
  // 月轮划过中心时蚀图出现
  tl.to(eclipse,{clipPath:'circle(50% at 50% 50%)',duration:.04,ease:'power2.out'},startT+.06)
  tl.to(eclipse,{clipPath:'circle(100% at 50% 50%)',duration:.06,ease:'power2.out'},startT+.10)
  // 蚀图消失 + 月轮隐
  tl.to(eclipse,{clipPath:'circle(0% at 50% 50%)',duration:.06,ease:'power2.in'},startT+.20)
  tl.to(moon,{autoAlpha:0,duration:.03},startT+.22)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0})
  gsap.set(sunRef.value,{autoAlpha:1})
  ;[moon1Ref,moon2Ref,moon3Ref].forEach(m=>gsap.set(m.value,{x:'-60vw',autoAlpha:0}))
  ;[eclipse1Ref,eclipse2Ref,eclipse3Ref].forEach(e=>gsap.set(e.value,{clipPath:'circle(0% at 50% 50%)',autoAlpha:1}))
  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8})
  gsap.set(dotsRef.value,{autoAlpha:0});gsap.set(particlesRef.value,{opacity:.2})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 28%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  tl.to(st,{opacity:1,duration:.03},.01);tl.to(hRef.value,{autoAlpha:1,y:0,duration:.04},.02)
  tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.03},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.04,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.03},.06);tl.to(sRef.value,{autoAlpha:1,y:0,duration:.03},.07)
  tl.to(dotsRef.value,{autoAlpha:1,duration:.03},.07);tl.to(particlesRef.value,{opacity:.5,duration:.04},.02)
  tl.to(overlayRef.value,{autoAlpha:1,duration:.06},.06);tl.to(bgRef.value,{scale:1,filter:'brightness(0.4)',duration:.06},.06)

  eclipsePass(tl,moon1Ref.value!,eclipse1Ref.value!,.08);tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.20);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.24)
  eclipsePass(tl,moon2Ref.value!,eclipse2Ref.value!,.26);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.38);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.42)
  eclipsePass(tl,moon3Ref.value!,eclipse3Ref.value!,.44);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.56);tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.60)

  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},.64)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},.66);tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},.68)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},.68);tl.to(st,{opacity:.35,duration:.03},.70)
  tl.to(pfRef.value,{width:'100%',duration:.75,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ec-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.ec-particles{position:absolute;inset:0;z-index:1}.ec-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:ec-f var(--pd) var(--pdl) infinite ease-in-out}@keyframes ec-f{0%{transform:translateY(0)translateX(0)scale(1)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3)}100%{transform:translateY(0)translateX(0)scale(1)}}
.ec-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2}.ec-bg{position:absolute;inset:0;z-index:1}.ec-bg__img{width:100%;height:100%;object-fit:cover}.ec-overlay{position:absolute;inset:0;z-index:2;background:rgba(4,2,10,.55)}

/* 日轮 */
.ec-sun{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:65vw;aspect-ratio:1;z-index:3}.ec-sun__img{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;box-shadow:0 0 0 4px rgba(255,180,100,.3),0 0 60px rgba(255,140,60,.2)}

/* 月轮 */
.ec-moon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:66vw;aspect-ratio:1;z-index:5;pointer-events:none;will-change:transform}
.ec-moon__disc{width:100%;height:100%;border-radius:50%;background:rgba(6,4,16,.9);box-shadow:0 0 30px rgba(6,4,16,.8),0 0 80px rgba(6,4,16,.5)}

/* 蚀出图像 */
.ec-eclipse{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60vw;aspect-ratio:1;z-index:4;will-change:clip-path}.ec-eclipse__img{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block}

.ec-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px)}.ec-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}.ec-title{margin:0;display:flex;justify-content:center;gap:.04em}.ec-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}.ec-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}.ec-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.ec-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem}.ec-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15)}.ec-dots__d--on{background:rgba(255,170,110,.9)}
.ec-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.ec-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:ec-ps 4s linear infinite}@keyframes ec-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.ec-header{top:2.5vh}.ec-kicker{font-size:.44rem}.ec-t__w{font-size:1.5rem}.ec-sub{font-size:.48rem}.ec-sun{width:80vw}.ec-moon{width:82vw}.ec-eclipse{width:74vw}}
</style>
