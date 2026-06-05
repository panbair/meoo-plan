<template>
  <section ref="rootRef" class="th-root">
    <!-- 曼陀罗光晕 -->
    <div class="th-mandala" ref="mandalaRef">
      <div class="th-mandala__ring th-mandala__ring--1"></div>
      <div class="th-mandala__ring th-mandala__ring--2"></div>
      <div class="th-mandala__ring th-mandala__ring--3"></div>
    </div>

    <!-- 光线放射 -->
    <div class="th-rays" ref="raysRef">
      <span v-for="n in 24" :key="n" class="th-ray"
        :style="{transform:`rotate(${n*15}deg)`}"></span>
    </div>

    <!-- 金色粒子 -->
    <canvas ref="canvasRef" class="th-canvas"></canvas>

    <!-- 3D场景 -->
    <div class="th-scene" ref="sceneRef">
      <div class="th-world" ref="worldRef">
        <!-- 外围弧线照片 — "千手" -->
        <div v-for="(frame,idx) in arcFrames" :key="frame.id"
          class="th-hand" :ref="(el)=>setHandRef(el,idx)"
          :style="arcStyle(idx)">
          <div class="th-hand__inner">
            <img :src="frame.image" :alt="frame.alt"
              class="th-hand__img" loading="eager" />
            <div class="th-hand__glow"></div>
          </div>
        </div>

        <!-- 中央主照片 — "观音" -->
        <div class="th-center" ref="centerRef">
          <div class="th-center__inner">
            <img :ref="(el)=>setCenterImgRef(el)" :src="centerFrame.image" :alt="centerFrame.alt"
              class="th-center__img" loading="eager" />
            <div class="th-center__aura"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="th-vignette"></div>

    <div ref="scrollRef" class="th-scroll">
      <div ref="trackRef" class="th-track" :style="{height:trackHeight}">
        <div class="th-sticky">
          <header ref="headerRef" class="th-header">
            <span class="th-kicker">🪷 Thousand Hands · 千手观音</span>
            <h1 class="th-title"><span ref="tT" class="th-title__w">千手</span><span ref="tG" class="th-title__w th-title__w--alt">观音</span></h1>
            <div ref="hlRef" class="th-line"></div>
            <p class="th-sub">向下滚动 · 千手观音曼陀罗旋转 · 照片如千臂展开</p>
          </header>
          <div ref="infoRef" class="th-info"><span>🪷 {{ centerFrame.title }}</span></div>
          <div class="th-progress"><div ref="progRef" class="th-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {onMounted,onUnmounted,ref,computed} from 'vue'
import {gsap} from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TweenCleanup=()=>void

interface Frame{id:string;title:string;image:string;alt:string}
const frames:Frame[]=[
  {id:'aurora',title:'极光',image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',alt:'极光'},
  {id:'ocean',title:'海浪',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',alt:'海浪'},
  {id:'mountains',title:'远山',image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',alt:'远山'},
  {id:'flowers',title:'繁花',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',alt:'繁花'},
  {id:'desert',title:'沙漠',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',alt:'沙漠'},
  {id:'forest',title:'森林',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',alt:'森林'},
  {id:'valley',title:'峡谷',image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',alt:'峡谷'},
  {id:'sunrise',title:'日出',image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',alt:'日出'},
]
const N=frames.length
const trackHeight=`${(N+1)*100}vh`

// 外围弧线照片（7张）
const arcFrames=computed(()=>frames.filter((_,i)=>i!==currentIndex.value))
// 中央照片（当前）
const centerFrame=computed(()=>frames[currentIndex.value])

// 弧线布局：7张照片排列在扇形中
const ARC_INNER=3;const ARC_OUTER=4
function arcStyle(idx:number):Record<string,string>{
  const total=ARC_INNER+ARC_OUTER
  if(idx<ARC_INNER){
    // 内弧：-50°, -25°, +25° (围绕中央偏下)
    const angles=[-50,-25,25]
    const r=200
    const a=angles[idx]*(Math.PI/180)
    const x=Math.sin(a)*r;const z=-Math.cos(a)*r-100
    return {transform:`translate3d(${x}px,20px,${z}px) rotateY(${angles[idx]*.4}deg)`,zIndex:'1'}
  }else{
    // 外弧：-65°, -38°, +38°, +65°
    const angles=[-65,-38,38,65]
    const r=320
    const a=angles[idx-ARC_INNER]*(Math.PI/180)
    const x=Math.sin(a)*r;const z=-Math.cos(a)*r-180
    return {transform:`translate3d(${x}px,50px,${z}px) rotateY(${angles[idx-ARC_INNER]*.3}deg)`,zIndex:'0'}
  }
}

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const worldRef=ref<HTMLElement|null>(null);const centerRef=ref<HTMLElement|null>(null)
const mandalaRef=ref<HTMLElement|null>(null);const raysRef=ref<HTMLElement|null>(null)
const canvasRef=ref<HTMLCanvasElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tT=ref<HTMLElement|null>(null);const tG=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const handRefs=ref<HTMLElement[]>([]);const centerImgRef=ref<HTMLImageElement|null>(null)
const setHandRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)handRefs.value[i]=el}
const setCenterImgRef=(el:Element|null)=>{if(el instanceof HTMLImageElement)centerImgRef.value=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

// 金粉粒子
interface GoldP{x:number;y:number;vx:number;vy:number;r:number;a:number;l:number;ml:number}
let ctx:CanvasRenderingContext2D|null=null;let cw=0,ch=0;const gps:GoldP[]=[];let gid=0
function initGold(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<50;i++)gps.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*.5,vy:-Math.random()*1-.3,r:.4+Math.random()*1.5,a:.2+Math.random()*.5,l:0,ml:100+Math.random()*250})
  function an(){if(!ctx)return;ctx.clearRect(0,0,cw,ch);if(gps.length<50&&Math.random()<.4)gps.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*.5,vy:-Math.random()*1-.3,r:.4+Math.random()*1.5,a:.2+Math.random()*.5,l:0,ml:100+Math.random()*250})
    for(let i=gps.length-1;i>=0;i--){const p=gps[i];p.l++;if(p.l>=p.ml){gps.splice(i,1);continue}p.x+=p.vx;p.y+=p.vy;const t=p.l/p.ml,f=t<.1?t/.1:t>.7?1-(t-.7)/.3:1;ctx!.beginPath();ctx!.arc(p.x,p.y,p.r,0,Math.PI*2);ctx!.fillStyle=`rgba(255,200,100,${p.a*f})`;ctx!.fill()}gid=requestAnimationFrame(an)}
  gid=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tT.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tG.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
    .fromTo(mandalaRef.value!,{autoAlpha:0,scale:.5},{autoAlpha:1,scale:1,duration:.7,ease:'power2.out'},'-.3')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupMandala(){
  if(!scrollRef.value||!trackRef.value||!worldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const world=worldRef.value
  const center=centerRef.value;const mandala=mandalaRef.value;const rays=raysRef.value
  if(!center)return

  gsap.set(center,{scale:1,opacity:1})

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.25,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 🪷 世界旋转
  mtl.to(world,{rotationY:360,duration:N,ease:'none'},0)

  // 中央照片呼吸
  mtl.to(center,{scale:1.08,duration:N*.15,ease:'sine.inOut'},0)
  mtl.to(center,{scale:1,duration:N*.2,ease:'sine.inOut'},N*.2)
  mtl.to(center,{scale:1.06,duration:N*.15,ease:'sine.inOut'},N*.45)
  mtl.to(center,{scale:1,duration:N*.2,ease:'sine.inOut'},N*.65)
  mtl.to(center,{scale:1.08,duration:N*.15,ease:'sine.inOut'},N*.85)

  // 曼陀罗光晕旋转
  if(mandala){mtl.to(mandala,{rotation:180,duration:N,ease:'none'},0)}

  // 光线旋转
  if(rays){mtl.to(rays,{rotation:360,duration:N*1.5,ease:'none'},0)}

  // 中央图片切换时微动
  if(centerImgRef.value){
    mtl.to(centerImgRef.value,{scale:1.1,duration:.08,ease:'sine.inOut'},.12)
    mtl.to(centerImgRef.value,{scale:1,duration:.12,ease:'sine.inOut'},.25)
    mtl.to(centerImgRef.value,{scale:1.08,duration:.06,ease:'sine.inOut'},.42)
    mtl.to(centerImgRef.value,{scale:1,duration:.1,ease:'sine.inOut'},.52)
  }

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initGold();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupMandala()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(gid);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;gps.length=0})
</script>

<style scoped lang="scss">
.th-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 45% at 50% 48%,#1a1008 0%,#0d0704 60%,#050202 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}

/* 🪷 曼陀罗光晕 */
.th-mandala{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1;pointer-events:none;will-change:transform}
.th-mandala__ring{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(200,150,60,.12)}
.th-mandala__ring--1{width:350px;height:350px;border-style:dashed;animation:th-ring 8s linear infinite}
.th-mandala__ring--2{width:500px;height:500px;border-color:rgba(200,150,60,.08);animation:th-ring 12s linear infinite reverse}
.th-mandala__ring--3{width:650px;height:650px;border-color:rgba(200,150,60,.05);border-style:dotted;animation:th-ring 16s linear infinite}
@keyframes th-ring{0%{transform:translate(-50%,-50%) rotate(0deg)}100%{transform:translate(-50%,-50%) rotate(360deg)}}

/* ✨ 光线 */
.th-rays{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:0;pointer-events:none;will-change:transform}
.th-ray{position:absolute;top:50%;left:50%;width:1px;height:400px;margin-top:-400px;background:linear-gradient(to top,rgba(200,150,60,.1),transparent);transform-origin:bottom}

/* 🎨 金粉 */
.th-canvas{position:absolute;inset:0;z-index:2;pointer-events:none}

/* 3D场景 */
.th-scene{position:absolute;inset:0;z-index:3;perspective:900px;perspective-origin:50% 48%;transform-style:preserve-3d;pointer-events:none}
.th-world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}

/* 🤲 外围弧线照片 — 千手 */
.th-hand{position:absolute;transform-style:preserve-3d;will-change:transform}
.th-hand__inner{width:clamp(80px,12vw,130px);margin-left:calc(clamp(80px,12vw,130px)/-2);margin-top:calc(clamp(100px,15vw,160px)/-2);border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 2px rgba(200,150,60,.2);opacity:.7}
.th-hand__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover}
.th-hand__glow{position:absolute;inset:-4px;border-radius:8px;background:radial-gradient(ellipse,rgba(200,150,60,.08),transparent 60%);pointer-events:none}

/* 🪷 中央主照片 — 观音 */
.th-center{position:absolute;transform-style:preserve-3d;will-change:transform}
.th-center__inner{width:clamp(200px,30vw,340px);margin-left:calc(clamp(200px,30vw,340px)/-2);margin-top:calc(clamp(260px,38vw,430px)/-2);border-radius:8px;overflow:hidden;box-shadow:0 15px 60px rgba(0,0,0,.6),0 0 0 6px rgba(200,150,60,.3),0 0 0 12px rgba(200,150,60,.08),0 0 80px rgba(200,150,40,.2)}
.th-center__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;will-change:transform}
.th-center__aura{position:absolute;inset:-30px;border-radius:20px;background:radial-gradient(ellipse,rgba(200,150,60,.1),transparent 60%);pointer-events:none}

.th-vignette{position:absolute;inset:0;z-index:4;pointer-events:none;background:radial-gradient(ellipse 40% 35% at 50% 48%,transparent 25%,rgba(4,2,1,.55) 100%)}
.th-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(200,150,60,.12)}}
.th-track{position:relative;width:100%}.th-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.th-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,480px)}
.th-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(220,180,100,.4);background:rgba(0,0,0,.3);backdrop-filter:blur(6px);border:1px solid rgba(200,150,60,.1);border-radius:999px;padding:.1rem .55rem;margin-bottom:.2rem}
.th-title{margin:0;display:flex;justify-content:center;gap:.05em}
.th-title__w{font-size:clamp(1.5rem,3.5vw,2.6rem);font-weight:900;color:#e0c080;text-shadow:0 0 15px rgba(200,150,40,.25);will-change:transform,opacity}
.th-title__w--alt{background:linear-gradient(180deg,#ffe8c0,#d09838,#885818);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.th-line{width:40px;height:1.5px;margin:.14rem auto .18rem;background:linear-gradient(90deg,transparent,#b08030,#d8b858,transparent)}
.th-sub{margin:0;font-size:clamp(.44rem,.64vw,.54rem);color:rgba(200,160,80,.18)}
.th-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.52rem;color:rgba(220,180,100,.25);font-family:'Georgia',serif}
.th-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.th-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#785020,#c89830,#785020);background-size:200% 100%}
</style>
