<template>
  <section ref="rootRef" class="cm-root">
    <!-- 星图背景网格 -->
    <div class="cm-grid"></div>

    <!-- 星空+连线画布 -->
    <canvas ref="starCanvasRef" class="cm-stars"></canvas>
    <!-- 连线画布 -->
    <canvas ref="lineCanvasRef" class="cm-lines"></canvas>

    <!-- 照片（带星图叠加） -->
    <div class="cm-scene" ref="sceneRef">
      <div class="cm-world" ref="worldRef">
        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="cm-card" :ref="(el)=>setCardRef(el,idx)">
          <div class="cm-card__inner">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="cm-card__img" loading="eager" />
            <!-- 星图叠加层 -->
            <div class="cm-card__overlay"></div>
          </div>
          <div class="cm-card__label">{{ frame.title }}</div>
        </div>
      </div>
    </div>

    <div class="cm-vignette"></div>

    <div ref="scrollRef" class="cm-scroll">
      <div ref="trackRef" class="cm-track" :style="{height:trackHeight}">
        <div class="cm-sticky">
          <header ref="headerRef" class="cm-header">
            <span class="cm-kicker">🌌 Constellation · 星座星图</span>
            <h1 class="cm-title"><span ref="tCon" class="cm-title__w">星座</span><span ref="tMap" class="cm-title__w cm-title__w--alt">星图</span></h1>
            <div ref="hlRef" class="cm-line"></div>
            <p class="cm-sub">向下滚动 · 星光连成星座 · 每一张照片都是一幅星图</p>
          </header>
          <div ref="infoRef" class="cm-info"><span>✦ {{ frames[currentIndex]?.title }}</span></div>
          <div class="cm-progress"><div ref="progRef" class="cm-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {onMounted,onUnmounted,ref} from 'vue'
import {gsap} from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TweenCleanup=()=>void

interface Frame{id:string;title:string;image:string;alt:string}
const frames:Frame[]=[
  {id:'aurora',title:'极光座',image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',alt:'极光'},
  {id:'ocean',title:'海神座',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',alt:'海浪'},
  {id:'mountains',title:'山岳座',image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',alt:'远山'},
  {id:'flowers',title:'花语座',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',alt:'繁花'},
  {id:'desert',title:'沙丘座',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',alt:'沙漠'},
  {id:'forest',title:'森林座',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',alt:'森林'},
  {id:'valley',title:'峡谷座',image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',alt:'峡谷'},
  {id:'sunrise',title:'太阳座',image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',alt:'日出'},
]
const N=frames.length;const trackHeight=`${(N+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const worldRef=ref<HTMLElement|null>(null)
const starCanvasRef=ref<HTMLCanvasElement|null>(null);const lineCanvasRef=ref<HTMLCanvasElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tCon=ref<HTMLElement|null>(null);const tMap=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

// 星空+星座连线
interface StarPt{x:number;y:number;r:number;a:number;tw:number;conn:number[]}
let sctx:CanvasRenderingContext2D|null=null;let lctx:CanvasRenderingContext2D|null=null
let cw=0,ch=0;const starPts:StarPt[]=[];let sid=0
const STAR_N=180

function initStars(){
  const sc=starCanvasRef.value;const lc=lineCanvasRef.value
  if(!sc||!lc)return;sctx=sc.getContext('2d');lctx=lc.getContext('2d')
  if(!sctx||!lctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;sc.width=cw;sc.height=ch;lc.width=cw;lc.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))

  for(let i=0;i<STAR_N;i++)starPts.push({x:Math.random()*cw,y:Math.random()*ch,r:.4+Math.random()*2,a:.2+Math.random()*.6,tw:Math.random()*Math.PI*2,conn:[]})

  // 随机生成星座连线（每颗星连接1-3颗邻近星）
  starPts.forEach((s,i)=>{const n=2+Math.floor(Math.random()*3);for(let j=0;j<n;j++){const t=Math.floor(Math.random()*STAR_N);if(t!==i&&!s.conn.includes(t))s.conn.push(t)}})

  function an(){
    if(!sctx||!lctx)return
    sctx.clearRect(0,0,cw,ch);lctx.clearRect(0,0,cw,ch)

    // 绘制连线
    lctx.strokeStyle='rgba(120,160,220,.12)';lctx.lineWidth=.5
    starPts.forEach(s=>{s.conn.forEach(ti=>{if(ti<STAR_N){const t=starPts[ti];lctx!.beginPath();lctx!.moveTo(s.x,s.y);lctx!.lineTo(t.x,t.y);lctx!.stroke()}})})

    // 绘制星星
    starPts.forEach(s=>{s.tw+=.02;const a=s.a*(.5+Math.sin(s.tw)*.5);sctx!.beginPath();sctx!.arc(s.x,s.y,s.r,0,Math.PI*2);sctx!.fillStyle=`rgba(200,220,255,${a})`;sctx!.fill()
      if(s.r>1.2){const g=sctx!.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*3);g.addColorStop(0,`rgba(220,240,255,${a*.6})`);g.addColorStop(1,'rgba(100,140,200,0)');sctx!.beginPath();sctx!.arc(s.x,s.y,s.r*3,0,Math.PI*2);sctx!.fillStyle=g;sctx!.fill()}})
    sid=requestAnimationFrame(an)
  }
  sid=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tCon.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tMap.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupConstellation(){
  if(!scrollRef.value||!trackRef.value||!worldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const world=worldRef.value
  const cards=cardRefs.value;const imgs=imgRefs.value
  if(!cards.length)return

  const W=window.innerWidth
  cards.forEach((card,i)=>{
    const x=((i/(N-1))-.5)*W*.6;const z=-i*350
    gsap.set(card,{x,z,rotateY:i%2?-5:5,opacity:i<=2?1:Math.max(.12,1-(i-2)*.22),filter:'brightness(0.6) saturate(0.5)'})
    gsap.set(imgs[i],{scale:1})
  })

  const totalZ=(N-1)*350+400
  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  mtl.to(world,{z:totalZ,duration:N,ease:'none'},0)

  cards.forEach((_c,i)=>{
    const moment=i/N;const dur=1/N
    // 前台：星图变清晰照片
    mtl.to(cards[i],{filter:'brightness(1.1) saturate(1.2)',rotateY:0,duration:dur*.22,ease:'power2.out'},Math.max(0,moment-dur*.08))
    mtl.to(cards[i],{filter:'brightness(0.6) saturate(0.5)',rotateY:i%2?-5:5,duration:dur*.35,ease:'power2.in'},moment+dur*.45)
    if(imgs[i]){mtl.to(imgs[i],{scale:1.06,duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06));mtl.to(imgs[i],{scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)}
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initStars();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupConstellation()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(sid);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;starPts.length=0})
</script>

<style scoped lang="scss">
.cm-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#020818 0%,#050d24 30%,#020a1c 60%,#010610 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.cm-grid{position:absolute;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(40,60,100,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(40,60,100,.06) 1px,transparent 1px);background-size:40px 40px}
.cm-stars,.cm-lines{position:absolute;inset:0;z-index:1;pointer-events:none}
.cm-scene{position:absolute;inset:0;z-index:2;perspective:800px;perspective-origin:50% 48%;transform-style:preserve-3d;pointer-events:none}
.cm-world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}
.cm-card{position:absolute;transform-style:preserve-3d;will-change:transform,opacity,filter}
.cm-card__inner{width:clamp(180px,28vw,300px);margin-left:calc(clamp(180px,28vw,300px)/-2);margin-top:calc(clamp(225px,36vw,380px)/-2);border-radius:4px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.5),0 0 0 2px rgba(120,160,220,.15)}
.cm-card__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;will-change:transform}
.cm-card__overlay{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(20,40,80,.25),transparent 70%);mix-blend-mode:screen}
.cm-card__label{text-align:center;margin-top:6px;font-size:.5rem;letter-spacing:.2em;color:rgba(140,180,220,.35);font-family:'Courier New',monospace}
.cm-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 50% 40% at 50% 48%,transparent 30%,rgba(1,3,8,.5) 100%)}
.cm-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(60,100,180,.1)}}
.cm-track{position:relative;width:100%}.cm-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.cm-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,480px)}
.cm-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(140,180,220,.4);background:rgba(0,0,0,.25);backdrop-filter:blur(6px);border:1px solid rgba(100,140,200,.08);border-radius:999px;padding:.1rem .6rem;margin-bottom:.22rem}
.cm-title{margin:0;display:flex;justify-content:center;gap:.05em}
.cm-title__w{font-size:clamp(1.5rem,3.5vw,2.6rem);font-weight:900;color:#a0c0e8;will-change:transform,opacity}
.cm-title__w--alt{background:linear-gradient(180deg,#d0e4f8,#5080c0,#2050a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.cm-line{width:40px;height:1.5px;margin:.16rem auto .2rem;background:linear-gradient(90deg,transparent,#4068a0,#6898d0,transparent)}
.cm-sub{margin:0;font-size:clamp(.48rem,.68vw,.58rem);color:rgba(100,140,200,.18)}
.cm-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.55rem;color:rgba(140,180,220,.25);font-family:'Georgia',serif}
.cm-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.cm-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#305898,#5890c8,#305898);background-size:200% 100%}
</style>
