<template>
  <section ref="rootRef" class="bf-root">
    <div ref="particlesRef" class="bf-particles"><span v-for="p in plist" :key="p.id" class="bf-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="bf-stage">
      <!-- 底层（始终可见） -->
      <div class="bf-layer" style="z-index:3"><img :src="imgs.i1" class="bf-layer__img" /></div>
      <!-- 第2层：8条横百叶 -->
      <div ref="l2Ref" class="bf-layer" style="z-index:4">
        <div v-for="i in 8" :key="'l2b'+i" :ref="(el:any)=>setBlind(el,2,i)" class="bf-blind" :style="{top:(i-1)*12.5+'%',height:'12.5%'}">
          <img :src="imgs.i2" class="bf-blind__img" :style="{top:-(i-1)*12.5+'%'}" />
        </div>
      </div>
      <!-- 第3层 -->
      <div ref="l3Ref" class="bf-layer" style="z-index:5">
        <div v-for="i in 8" :key="'l3b'+i" :ref="(el:any)=>setBlind(el,3,i)" class="bf-blind" :style="{top:(i-1)*12.5+'%',height:'12.5%'}">
          <img :src="imgs.i3" class="bf-blind__img" :style="{top:-(i-1)*12.5+'%'}" />
        </div>
      </div>
      <!-- 第4层 -->
      <div ref="l4Ref" class="bf-layer" style="z-index:6">
        <div v-for="i in 8" :key="'l4b'+i" :ref="(el:any)=>setBlind(el,4,i)" class="bf-blind" :style="{top:(i-1)*12.5+'%',height:'12.5%'}">
          <img :src="imgs.i4" class="bf-blind__img" :style="{top:-(i-1)*12.5+'%'}" />
        </div>
      </div>

      <header ref="hRef" class="bf-header">
        <span ref="kRef" class="bf-kicker">▬ 向下滚动 · 百叶翻转 ▬</span>
        <h1 class="bf-title"><span ref="t1Ref" class="bf-t__w bf-t__w--1">百</span><span ref="t2Ref" class="bf-t__w bf-t__w--2">叶</span><span ref="t3Ref" class="bf-t__w bf-t__w--3">千</span><span ref="t4Ref" class="bf-t__w bf-t__w--1">幻</span></h1>
        <div ref="dRef" class="bf-divider"></div><p ref="sRef" class="bf-sub">百叶翻转 · 条条波浪 · 层层揭新篇</p>
      </header>
      <div ref="dotsRef" class="bf-dots"><span ref="dot1Ref" class="bf-dots__d bf-dots__d--on"></span><span ref="dot2Ref" class="bf-dots__d"></span><span ref="dot3Ref" class="bf-dots__d"></span><span ref="dot4Ref" class="bf-dots__d"></span></div>
      <div class="bf-progress"><div ref="pfRef" class="bf-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TC = () => void

const imgs = { i1:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', i2:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80', i3:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', i4:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80' }
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:30},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.08+pr(i*2+5)*.28}`}})))

const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null)
const l2Ref=ref<HTMLElement|null>(null),l3Ref=ref<HTMLElement|null>(null),l4Ref=ref<HTMLElement|null>(null)
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null),dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null)
const dotsRef=ref<HTMLElement|null>(null),dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

const blindMap:Record<number,Record<number,HTMLElement>>={2:{},3:{},4:{}}
function setBlind(el:any,layer:number,idx:number){if(el instanceof HTMLElement) blindMap[layer][idx]=el}
function getBlinds(layer:number):HTMLElement[]{const a:HTMLElement[]=[];for(let i=1;i<=8;i++) if(blindMap[layer][i]) a.push(blindMap[layer][i]);return a}

// 百叶翻转：每条横条绕X轴旋转180度→露出下层
function blindsFlip(tl:gsap.core.Timeline,blinds:HTMLElement[],startT:number){
  gsap.set(blinds,{rotationX:0,autoAlpha:1,transformOrigin:'center center'})
  // 波浪式翻转：偶数条和奇数条时间错开，产生百叶窗效果
  const odds=blinds.filter((_,i)=>i%2===0)
  const evens=blinds.filter((_,i)=>i%2===1)
  tl.to(odds,{rotationX:180,autoAlpha:.05,duration:.14,stagger:.02,ease:'power3.in'},startT)
  tl.to(evens,{rotationX:180,autoAlpha:.05,duration:.14,stagger:.02,ease:'power3.in'},startT+.03)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!l2Ref.value)return
  const b2=getBlinds(2),b3=getBlinds(3),b4=getBlinds(4)
  gsap.set(st,{opacity:0})
  // 初始状态：百叶平铺可见
  ;[b2,b3,b4].forEach(b=>gsap.set(b,{rotationX:0,autoAlpha:1,transformOrigin:'center center'}))
  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8})
  gsap.set(dotsRef.value,{autoAlpha:0});gsap.set(particlesRef.value,{opacity:.25})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 40%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  tl.to(st,{opacity:1,duration:.04,ease:'power2.out'},.01)
  tl.to(hRef.value,{autoAlpha:1,y:0,duration:.05,ease:'power2.out'},.02)
  tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.04,ease:'power2.out'},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.05,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.04,ease:'power3.inOut'},.06)
  tl.to(sRef.value,{autoAlpha:1,y:0,duration:.04,ease:'power2.out'},.07)
  tl.to(dotsRef.value,{autoAlpha:1,duration:.04,ease:'power2.out'},.07)
  tl.to(particlesRef.value,{opacity:.6,duration:.06,ease:'power2.in'},.02)

  blindsFlip(tl,b2,.10)
  tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.04},.20)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.04},.26)

  blindsFlip(tl,b3,.28)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.04},.38)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.04},.44)

  blindsFlip(tl,b4,.46)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.04},.56)
  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.04},.62)

  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.04},.68)
  tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.06,ease:'power2.in'},.72)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.05,ease:'power2.in'},.72)
  tl.to(particlesRef.value,{opacity:.12,duration:.08},.76)
  tl.to(st,{opacity:.4,duration:.08},.78)
  tl.to(pfRef.value,{width:'100%',duration:1,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.bf-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.bf-particles{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity}
.bf-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:bf-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity}
@keyframes bf-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.bf-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2;will-change:opacity;perspective:1200px}
.bf-layer{position:absolute;inset:0}.bf-layer__img{width:100%;height:100%;object-fit:cover;display:block}
.bf-blind{position:absolute;left:0;width:100%;overflow:hidden;will-change:transform,opacity;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.bf-blind__img{position:absolute;left:0;width:100%;height:800%;object-fit:cover;display:block}
.bf-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px);pointer-events:none;will-change:transform,opacity}
.bf-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem;will-change:transform,opacity}
.bf-title{margin:0;display:flex;justify-content:center;gap:.04em}
.bf-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;will-change:transform,opacity;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}
.bf-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent);transform-origin:center;will-change:transform,opacity}
.bf-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto;will-change:transform,opacity}
.bf-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem;pointer-events:none;will-change:opacity}
.bf-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background-color .3s}
.bf-dots__d--on{background:rgba(255,170,110,.9)}
.bf-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.bf-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:bf-ps 4s linear infinite}@keyframes bf-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.bf-header{top:2.5vh}.bf-kicker{font-size:.44rem}.bf-t__w{font-size:1.5rem}.bf-sub{font-size:.48rem}}
</style>
