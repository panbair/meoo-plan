<template>
  <section ref="rootRef" class="kl-root">
    <div ref="particlesRef" class="kl-particles"><span v-for="p in plist" :key="p.id" class="kl-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="kl-stage" style="perspective:1000px">
      <div ref="bgRef" class="kl-bg"><img :src="imgs.bg" class="kl-bg__img" /></div>
      <div ref="overlayRef" class="kl-overlay"></div>
      <div ref="centerGlowRef" class="kl-center-glow"></div>

      <!-- 万花筒层：6个三角扇区 -->
      <div ref="l1Ref" class="kl-kaleido-layer" style="z-index:5">
        <div v-for="i in 6" :key="'k1-'+i" :ref="(e:any)=>setK1(e,i-1)" class="kl-wedge" :style="wedgeStyle(i-1,6)"><img :src="imgs.k1" class="kl-wedge__img" :style="wedgeImgStyle(i-1,6)" /></div>
      </div>
      <div ref="l2Ref" class="kl-kaleido-layer" style="z-index:7">
        <div v-for="i in 6" :key="'k2-'+i" :ref="(e:any)=>setK2(e,i-1)" class="kl-wedge" :style="wedgeStyle(i-1,6)"><img :src="imgs.k2" class="kl-wedge__img" :style="wedgeImgStyle(i-1,6)" /></div>
      </div>
      <div ref="l3Ref" class="kl-kaleido-layer" style="z-index:9">
        <div v-for="i in 6" :key="'k3-'+i" :ref="(e:any)=>setK3(e,i-1)" class="kl-wedge" :style="wedgeStyle(i-1,6)"><img :src="imgs.k3" class="kl-wedge__img" :style="wedgeImgStyle(i-1,6)" /></div>
      </div>

      <header ref="hRef" class="kl-header"><span ref="kRef" class="kl-kicker">✧ 向下滚动 · 万花筒 ✧</span><h1 class="kl-title"><span ref="t1Ref" class="kl-t__w kl-t__w--1">万</span><span ref="t2Ref" class="kl-t__w kl-t__w--2">花</span><span ref="t3Ref" class="kl-t__w kl-t__w--3">筒</span></h1><div ref="dRef" class="kl-divider"></div><p ref="sRef" class="kl-sub">六角镜像 · 旋转对称 · 层层变幻</p></header>
      <div ref="dotsRef" class="kl-dots"><span ref="dot1Ref" class="kl-dots__d kl-dots__d--on"></span><span ref="dot2Ref" class="kl-dots__d"></span><span ref="dot3Ref" class="kl-dots__d"></span><span ref="dot4Ref" class="kl-dots__d"></span></div>
      <div class="kl-progress"><div ref="pfRef" class="kl-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';import { gsap } from 'gsap';import { ScrollTrigger } from 'gsap/ScrollTrigger';gsap.registerPlugin(ScrollTrigger);type TC=()=>void
const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',k1:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80',k2:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',k3:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80'}
function wedgeStyle(i:number,t:number):Record<string,string>{const a=(i/t)*360;return{position:'absolute' as const,top:'50%',left:'50%',width:'70vw',height:'70vw',transform:`translate(-50%,-50%) rotate(${a}deg)`,clipPath:'polygon(50% 50%, 50% 0%, 100% 0%, 100% 20%)',overflow:'hidden'}}
function wedgeImgStyle(i:number,t:number):Record<string,string>{const a=(i/t)*360;return{position:'absolute' as const,top:'50%',left:'50%',width:'100%',height:'100%',objectFit:'cover' as const,transform:`translate(-50%,-50%) rotate(${-a}deg) scale(1.3)`}}
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:20},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null),centerGlowRef=ref<HTMLElement|null>(null)
const l1Ref=ref<HTMLElement|null>(null),l2Ref=ref<HTMLElement|null>(null),l3Ref=ref<HTMLElement|null>(null)
const k1:HTMLElement[]=[],k2:HTMLElement[]=[],k3:HTMLElement[]=[]
function setK1(e:any,i:number){if(e instanceof HTMLElement)k1[i]=e};function setK2(e:any,i:number){if(e instanceof HTMLElement)k2[i]=e};function setK3(e:any,i:number){if(e instanceof HTMLElement)k3[i]=e}
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

function kaleidoLayer(tl:gsap.core.Timeline,layer:HTMLElement,wedges:HTMLElement[],startT:number){
  gsap.set(layer,{rotation:0,autoAlpha:1,scale:.3})
  wedges.forEach(w=>gsap.set(w,{autoAlpha:0}))
  // 万花筒旋转展开
  tl.to(layer,{scale:1,autoAlpha:1,duration:.06,ease:'power2.out'},startT)
  wedges.forEach((w,i)=>tl.to(w,{autoAlpha:1,duration:.03,ease:'power2.out'},startT+.03+i*.02))
  tl.to(layer,{rotation:120,duration:.16,ease:'none'},startT+.06)
  // 收缩消失
  tl.to(layer,{scale:.2,rotation:240,autoAlpha:0,duration:.10,ease:'power2.in'},startT+.24)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0});gsap.set(centerGlowRef.value,{autoAlpha:.4})
  ;[l1Ref,l2Ref,l3Ref].forEach(l=>gsap.set(l.value,{scale:.3,autoAlpha:0}))
  ;[k1,k2,k3].forEach(arr=>arr.forEach(w=>gsap.set(w,{autoAlpha:0})))
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

  kaleidoLayer(tl,l1Ref.value!,k1,.08);tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.26);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.30)
  kaleidoLayer(tl,l2Ref.value!,k2,.32);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.50);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.54)
  kaleidoLayer(tl,l3Ref.value!,k3,.56);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.74);tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.78)

  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},.82)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},.84);tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},.86)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},.86);tl.to(st,{opacity:.35,duration:.03},.88)
  tl.to(pfRef.value,{width:'100%',duration:.9,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.kl-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.kl-particles{position:absolute;inset:0;z-index:1}.kl-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:kl-f var(--pd) var(--pdl) infinite ease-in-out}@keyframes kl-f{0%{transform:translateY(0)translateX(0)scale(1)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3)}100%{transform:translateY(0)translateX(0)scale(1)}}
.kl-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2}.kl-bg{position:absolute;inset:0;z-index:1}.kl-bg__img{width:100%;height:100%;object-fit:cover}.kl-overlay{position:absolute;inset:0;z-index:2;background:rgba(4,2,10,.6)}
.kl-center-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:20vw;height:20vw;border-radius:50%;z-index:3;background:radial-gradient(circle,rgba(200,150,255,.15),transparent 60%);filter:blur(20px);pointer-events:none}
.kl-kaleido-layer{position:absolute;inset:0;will-change:transform,opacity}.kl-wedge{will-change:transform,opacity;backface-visibility:hidden}
.kl-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px)}.kl-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}.kl-title{margin:0;display:flex;justify-content:center;gap:.04em}.kl-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}.kl-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}.kl-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.kl-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem}.kl-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15)}.kl-dots__d--on{background:rgba(255,170,110,.9)}
.kl-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.kl-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:kl-ps 4s linear infinite}@keyframes kl-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.kl-header{top:2.5vh}.kl-kicker{font-size:.44rem}.kl-t__w{font-size:1.5rem}.kl-sub{font-size:.48rem}}
</style>
