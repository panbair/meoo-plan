<template>
  <section ref="rootRef" class="gs-root">
    <div ref="particlesRef" class="gs-particles"><span v-for="p in plist" :key="p.id" class="gs-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="gs-stage">
      <div ref="bgRef" class="gs-bg"><img :src="imgs.bg" class="gs-bg__img" /></div>
      <div ref="overlayRef" class="gs-overlay"></div>

      <!-- ══════ 第1层网格 ══════ -->
      <div ref="l1Ref" class="gs-grid-layer" style="z-index:5">
        <div v-for="r in 3" :key="'l1r'+r" class="gs-grid-row">
          <div v-for="c in 3" :key="'l1c'+c" :ref="(el:any)=>setG1(el,(r-1)*3+(c-1))" class="gs-cell" :style="{width:'33.333%'}">
            <img :src="imgs.g1" class="gs-cell__img" :style="{left:-(c-1)*100+'%',top:-(r-1)*100+'%'}" />
          </div>
        </div>
      </div>
      <div ref="l2Ref" class="gs-grid-layer" style="z-index:7">
        <div v-for="r in 3" :key="'l2r'+r" class="gs-grid-row">
          <div v-for="c in 3" :key="'l2c'+c" :ref="(el:any)=>setG2(el,(r-1)*3+(c-1))" class="gs-cell" :style="{width:'33.333%'}">
            <img :src="imgs.g2" class="gs-cell__img" :style="{left:-(c-1)*100+'%',top:-(r-1)*100+'%'}" />
          </div>
        </div>
      </div>
      <div ref="l3Ref" class="gs-grid-layer" style="z-index:9">
        <div v-for="r in 3" :key="'l3r'+r" class="gs-grid-row">
          <div v-for="c in 3" :key="'l3c'+c" :ref="(el:any)=>setG3(el,(r-1)*3+(c-1))" class="gs-cell" :style="{width:'33.333%'}">
            <img :src="imgs.g3" class="gs-cell__img" :style="{left:-(c-1)*100+'%',top:-(r-1)*100+'%'}" />
          </div>
        </div>
      </div>

      <header ref="hRef" class="gs-header">
        <span ref="kRef" class="gs-kicker">▦ 向下滚动 · 网格漂移 ▦</span>
        <h1 class="gs-title"><span ref="t1Ref" class="gs-t__w gs-t__w--1">网</span><span ref="t2Ref" class="gs-t__w gs-t__w--2">格</span><span ref="t3Ref" class="gs-t__w gs-t__w--3">漂</span><span ref="t4Ref" class="gs-t__w gs-t__w--1">移</span></h1>
        <div ref="dRef" class="gs-divider"></div><p ref="sRef" class="gs-sub">九宫格裂 · 各行其道 · 漂移之中见新颜</p>
      </header>
      <div ref="dotsRef" class="gs-dots"><span ref="dot1Ref" class="gs-dots__d gs-dots__d--on"></span><span ref="dot2Ref" class="gs-dots__d"></span><span ref="dot3Ref" class="gs-dots__d"></span><span ref="dot4Ref" class="gs-dots__d"></span></div>
      <div class="gs-progress"><div ref="pfRef" class="gs-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TC=()=>void

const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',g1:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',g2:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',g3:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80'}
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:25},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
const l1Ref=ref<HTMLElement|null>(null),l2Ref=ref<HTMLElement|null>(null),l3Ref=ref<HTMLElement|null>(null)
const g1:HTMLElement[]=[],g2:HTMLElement[]=[],g3:HTMLElement[]=[]
function setG1(e:any,i:number){if(e instanceof HTMLElement)g1[i]=e};function setG2(e:any,i:number){if(e instanceof HTMLElement)g2[i]=e};function setG3(e:any,i:number){if(e instanceof HTMLElement)g3[i]=e}
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

// 网格漂移：3×3九宫格各行向不同方向漂移
function gridShift(tl:gsap.core.Timeline,cells:HTMLElement[],startT:number){
  // 初始：所有格子正常位置
  cells.forEach((c,i)=>{const row=Math.floor(i/3);gsap.set(c,{x:0,y:0,autoAlpha:1,rotation:0})})
  // 第1行：向左上漂移
  tl.to([cells[0],cells[1],cells[2]],{x:'-25vw',y:'-20vh',rotation:-8,duration:.10,ease:'power3.out'},startT)
  // 第2行：向左右交替漂移
  tl.to(cells[3],{x:'-30vw',y:'5vh',rotation:5,duration:.10,ease:'power3.out'},startT+.03)
  tl.to(cells[4],{y:'-15vh',scale:1.1,duration:.10,ease:'power2.out'},startT+.05)
  tl.to(cells[5],{x:'30vw',y:'5vh',rotation:-5,duration:.10,ease:'power3.out'},startT+.03)
  // 第3行：向右下漂移
  tl.to([cells[6],cells[7],cells[8]],{x:'25vw',y:'20vh',rotation:8,duration:.10,ease:'power3.out'},startT+.04)
  // 全部飞散淡出
  tl.to(cells,{autoAlpha:0,scale:.8,duration:.08,stagger:.02,ease:'power2.in'},startT+.16)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0})
  ;[g1,g2,g3].forEach(arr=>arr.forEach(c=>gsap.set(c,{x:0,y:0,autoAlpha:1,rotation:0})))
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

  gridShift(tl,g1,.10);tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.26);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.30)
  gridShift(tl,g2,.32);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.48);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.52)
  gridShift(tl,g3,.54);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.70);tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.74)

  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},.78)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},.80);tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},.82)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},.82);tl.to(particlesRef.value,{opacity:.1,duration:.03},.84)
  tl.to(st,{opacity:.35,duration:.03},.86);tl.to(pfRef.value,{width:'100%',duration:.9,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.gs-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.gs-particles{position:absolute;inset:0;z-index:1;pointer-events:none}
.gs-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:gs-f var(--pd) var(--pdl) infinite ease-in-out}
@keyframes gs-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.gs-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2;will-change:opacity}
.gs-bg{position:absolute;inset:0;z-index:1}.gs-bg__img{width:100%;height:100%;object-fit:cover;display:block}
.gs-overlay{position:absolute;inset:0;z-index:2;pointer-events:none;background:rgba(4,2,10,.6);backdrop-filter:blur(1px)}

.gs-grid-layer{position:absolute;inset:0;display:flex;flex-direction:column}
.gs-grid-row{display:flex;height:33.333%}
.gs-cell{height:100%;overflow:hidden;position:relative;will-change:transform,opacity}
.gs-cell__img{position:absolute;width:300%;height:300%;object-fit:cover;display:block}

.gs-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px);pointer-events:none}
.gs-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}
.gs-title{margin:0;display:flex;justify-content:center;gap:.04em}
.gs-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}
.gs-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}
.gs-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.gs-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem;pointer-events:none}.gs-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background-color .3s}.gs-dots__d--on{background:rgba(255,170,110,.9)}
.gs-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.gs-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:gs-ps 4s linear infinite}@keyframes gs-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.gs-header{top:2.5vh}.gs-kicker{font-size:.44rem}.gs-t__w{font-size:1.5rem}.gs-sub{font-size:.48rem}}
</style>
