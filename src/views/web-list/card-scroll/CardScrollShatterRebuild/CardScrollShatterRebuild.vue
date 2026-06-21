<template>
  <section ref="rootRef" class="sr-root">
    <div ref="particlesRef" class="sr-particles"><span v-for="p in plist" :key="p.id" class="sr-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="sr-stage">
      <!-- 4层碎片图片 -->
      <div ref="layer1Ref" class="sr-layer"><img :src="imgs.i1" class="sr-layer__img" /></div>
      <div ref="layer2Ref" class="sr-layer">
        <div v-for="r in 4" :key="'l2r'+r" class="sr-row">
          <div v-for="c in 4" :key="'l2c'+c" :ref="(el:any)=>setPiece(el,2,r,c)" class="sr-piece"><img :src="imgs.i2" class="sr-piece__img" :style="pieceStyle(2,r,c)" /></div>
        </div>
      </div>
      <div ref="layer3Ref" class="sr-layer">
        <div v-for="r in 4" :key="'l3r'+r" class="sr-row">
          <div v-for="c in 4" :key="'l3c'+c" :ref="(el:any)=>setPiece(el,3,r,c)" class="sr-piece"><img :src="imgs.i3" class="sr-piece__img" :style="pieceStyle(3,r,c)" /></div>
        </div>
      </div>
      <div ref="layer4Ref" class="sr-layer">
        <div v-for="r in 4" :key="'l4r'+r" class="sr-row">
          <div v-for="c in 4" :key="'l4c'+c" :ref="(el:any)=>setPiece(el,4,r,c)" class="sr-piece"><img :src="imgs.i4" class="sr-piece__img" :style="pieceStyle(4,r,c)" /></div>
        </div>
      </div>

      <header ref="hRef" class="sr-header">
        <span ref="kRef" class="sr-kicker">◈ 向下滚动 · 碎片重组 ◈</span>
        <h1 class="sr-title"><span ref="t1Ref" class="sr-t__w sr-t__w--1">碎</span><span ref="t2Ref" class="sr-t__w sr-t__w--2">片</span><span ref="t3Ref" class="sr-t__w sr-t__w--3">重</span><span ref="t4Ref" class="sr-t__w sr-t__w--1">生</span></h1>
        <div ref="dRef" class="sr-divider"></div><p ref="sRef" class="sr-sub">碎片飞散 · 重组新生 · 每一次破碎都是蜕变</p>
      </header>
      <div ref="dotsRef" class="sr-dots"><span ref="dot1Ref" class="sr-dots__d sr-dots__d--on"></span><span ref="dot2Ref" class="sr-dots__d"></span><span ref="dot3Ref" class="sr-dots__d"></span><span ref="dot4Ref" class="sr-dots__d"></span></div>
      <div class="sr-progress"><div ref="pfRef" class="sr-progress__fill"></div></div>
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
const layer1Ref=ref<HTMLElement|null>(null),layer2Ref=ref<HTMLElement|null>(null),layer3Ref=ref<HTMLElement|null>(null),layer4Ref=ref<HTMLElement|null>(null)
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null),dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null)
const dotsRef=ref<HTMLElement|null>(null),dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

// 4×4碎片系统：每层16块碎片
const pieceMap:Record<number,Record<number,Record<number,HTMLElement>>>={2:{1:{},2:{},3:{},4:{}},3:{1:{},2:{},3:{},4:{}},4:{1:{},2:{},3:{},4:{}}}
function setPiece(el:any,layer:number,row:number,col:number){if(el instanceof HTMLElement) pieceMap[layer][row][col]=el}
function pieceStyle(layer:number,row:number,col:number){
  const sx=-(col-1)*100+'%';const sy=-(row-1)*100+'%'
  return {position:'absolute' as const,width:'400%',height:'400%',top:sy,left:sx,objectFit:'cover' as const}
}
function getLayerPieces(layer:number):HTMLElement[]{
  const arr:HTMLElement[]=[]
  for(let r=1;r<=4;r++)for(let c=1;c<=4;c++) if(pieceMap[layer][r][c]) arr.push(pieceMap[layer][r][c])
  return arr
}

// 碎片重组：碎片散开→飞回原位
function shatterRebuild(tl:gsap.core.Timeline,pieces:HTMLElement[],startT:number){
  // 初始：碎片散落在四周
  pieces.forEach((p,i)=>{
    const angle=(i/pieces.length)*Math.PI*2
    const dist=60+Math.random()*40
    gsap.set(p,{x:Math.cos(angle)*dist+'vw',y:Math.sin(angle)*dist+'vh',rotation:Math.random()*60-30,autoAlpha:.7})
  })
  // 碎片飞回原位
  tl.to(pieces,{x:0,y:0,rotation:0,autoAlpha:1,duration:.16,stagger:.01,ease:'back.out(1.5)'},startT)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!layer1Ref.value)return
  gsap.set(st,{opacity:0})
  // 初始设置散落状态
  const p2=getLayerPieces(2),p3=getLayerPieces(3),p4=getLayerPieces(4)
  ;[p2,p3,p4].forEach(arr=>{
    arr.forEach((pp,i)=>{const a=(i/arr.length)*Math.PI*2;gsap.set(pp,{x:Math.cos(a)*70+'vw',y:Math.sin(a)*70+'vh',rotation:Math.random()*60-30,autoAlpha:.7})})
  })
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

  // 3次碎片重组
  shatterRebuild(tl,p2,.10)
  tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.04},.20)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.04},.26)

  shatterRebuild(tl,p3,.28)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.04},.38)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.04},.44)

  shatterRebuild(tl,p4,.46)
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
.sr-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.sr-particles{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity}
.sr-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:sr-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity}
@keyframes sr-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.sr-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2;will-change:opacity}
.sr-layer{position:absolute;inset:0}.sr-layer:nth-child(1){z-index:3}.sr-layer:nth-child(2){z-index:4}.sr-layer:nth-child(3){z-index:5}.sr-layer:nth-child(4){z-index:6}
.sr-layer__img{width:100%;height:100%;object-fit:cover;display:block}
.sr-row{display:flex;width:100%;height:25%}
.sr-piece{width:25%;height:100%;overflow:hidden;position:relative;will-change:transform,opacity}
.sr-piece__img{display:block}
.sr-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px);pointer-events:none;will-change:transform,opacity}
.sr-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem;will-change:transform,opacity}
.sr-title{margin:0;display:flex;justify-content:center;gap:.04em}
.sr-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;will-change:transform,opacity;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}
.sr-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent);transform-origin:center;will-change:transform,opacity}
.sr-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto;will-change:transform,opacity}
.sr-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem;pointer-events:none;will-change:opacity}
.sr-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background-color .3s}
.sr-dots__d--on{background:rgba(255,170,110,.9)}
.sr-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.sr-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:sr-ps 4s linear infinite}@keyframes sr-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.sr-header{top:2.5vh}.sr-kicker{font-size:.44rem}.sr-t__w{font-size:1.5rem}.sr-sub{font-size:.48rem}}
</style>
