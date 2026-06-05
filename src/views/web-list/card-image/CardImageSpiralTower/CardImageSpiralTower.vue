<template>
  <section ref="rootRef" class="st-root">
    <canvas ref="canvasRef" class="st-canvas"></canvas>
    <div class="st-scene" ref="sceneRef">
      <div class="st-spiral" ref="spiralRef">
        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="st-card" :ref="(el)=>setCardRef(el,idx)"
          :style="spiralTransform(idx)">
          <div class="st-card__inner">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="st-card__img" loading="eager" />
          </div>
        </div>
      </div>
    </div>
    <div class="st-vignette"></div>
    <div ref="scrollRef" class="st-scroll">
      <div ref="trackRef" class="st-track" :style="{height:trackHeight}">
        <div class="st-sticky">
          <header ref="headerRef" class="st-header">
            <span class="st-kicker">🧬 Spiral Tower · 螺旋塔</span>
            <h1 class="st-title"><span ref="tS" class="st-title__w">螺旋</span><span ref="tT" class="st-title__w st-title__w--alt">塔</span></h1>
            <div ref="hlRef" class="st-line"></div>
            <p class="st-sub">向下滚动 · 照片沿3D螺旋上升 · 如同DNA双螺旋结构</p>
          </header>
          <div ref="infoRef" class="st-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="st-progress"><div ref="progRef" class="st-progress__fill"></div></div>
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
const ANGLE_STEP=50;const RADIUS=340;const Y_STEP=50
const trackHeight=`${(N+1)*100}vh`

// 螺旋姿态：每张照片在不同角度+高度
function spiralTransform(idx:number):Record<string,string>{
  const angle=idx*ANGLE_STEP*(Math.PI/180)
  const x=Math.sin(angle)*RADIUS
  const z=-Math.cos(angle)*RADIUS - RADIUS - 150 // 初始都在屏幕后方
  const y=-(idx*Y_STEP)+(N*Y_STEP/2)
  const ry=idx*ANGLE_STEP // 面向外侧
  return {transform:`translate3d(${x}px,${y}px,${z}px) rotateY(${ry}deg)`}
}

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const spiralRef=ref<HTMLElement|null>(null);const canvasRef=ref<HTMLCanvasElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tS=ref<HTMLElement|null>(null);const tT=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

// 粒子
interface Pt{x:number;y:number;vx:number;vy:number;r:number;a:number}
let ctx:CanvasRenderingContext2D|null=null;let cw=0,ch=0;const pts:Pt[]=[];let sid=0
function initPts(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<60;i++)pts.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*.5,vy:-Math.random()*1-.3,r:.5+Math.random()*1.5,a:.2+Math.random()*.4})
  function an(){if(!ctx)return;ctx.clearRect(0,0,cw,ch);for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.y<-20){p.y=ch+20;p.x=Math.random()*cw}ctx!.beginPath();ctx!.arc(p.x,p.y,p.r,0,Math.PI*2);ctx!.fillStyle=`rgba(180,200,240,${p.a})`;ctx!.fill()}sid=requestAnimationFrame(an)}
  sid=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tS.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tT.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupSpiral(){
  if(!scrollRef.value||!trackRef.value||!spiralRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const spiral=spiralRef.value
  const imgs=imgRefs.value
  if(!imgs.length)return

  const totalDeg=N*ANGLE_STEP
  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 螺旋绕Y轴旋转
  mtl.to(spiral,{rotationY:totalDeg,duration:N,ease:'none'},0)
  // 同时微微升降
  mtl.to(spiral,{y:-(N*Y_STEP*.6),duration:N,ease:'none'},0)

  // 每张照片到前台时微放大
  imgs.forEach((_img,i)=>{const moment=i/N;const dur=1/N;mtl.to(imgs[i],{scale:1.08,duration:dur*.18,ease:'power2.out'},Math.max(0,moment-dur*.05));mtl.to(imgs[i],{scale:1,duration:dur*.28,ease:'power2.in'},moment+dur*.38)})

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initPts();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupSpiral()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(sid);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;pts.length=0})
</script>

<style scoped lang="scss">
.st-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 45% at 50% 45%,#0a0e1a 0%,#050810 60%,#020408 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.st-canvas{position:absolute;inset:0;z-index:0;pointer-events:none}
.st-scene{position:absolute;inset:0;z-index:2;perspective:1000px;perspective-origin:50% 45%;transform-style:preserve-3d;pointer-events:none}
.st-spiral{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}
.st-card{position:absolute;transform-style:preserve-3d;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.st-card__inner{width:clamp(130px,20vw,220px);margin-left:calc(clamp(130px,20vw,220px)/-2);margin-top:calc(clamp(160px,25vw,280px)/-2);background:#faf8f6;border-radius:3px;box-shadow:0 6px 25px rgba(0,0,0,.4),0 0 0 3px #fefcf8;overflow:hidden}
.st-card__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;padding:5px 5px 0 5px;box-sizing:border-box;will-change:transform}
.st-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 50% 40% at 50% 48%,transparent 30%,rgba(2,3,8,.5) 100%)}
.st-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.05)}}
.st-track{position:relative;width:100%}.st-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.st-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,480px)}
.st-kicker{display:inline-block;font-size:.52rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(160,180,220,.45);background:rgba(0,0,0,.2);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.04);border-radius:999px;padding:.1rem .6rem;margin-bottom:.25rem}
.st-title{margin:0;display:flex;justify-content:center;gap:.05em}
.st-title__w{font-size:clamp(1.5rem,3.5vw,2.6rem);font-weight:900;color:#b8c8e8;will-change:transform,opacity}
.st-title__w--alt{background:linear-gradient(180deg,#d8e4f8,#5880c0,#2850a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.st-line{width:40px;height:1.5px;margin:.16rem auto .2rem;background:linear-gradient(90deg,transparent,#4868a0,#7898d0,transparent)}
.st-sub{margin:0;font-size:clamp(.48rem,.68vw,.58rem);color:rgba(120,150,200,.2)}
.st-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.55rem;color:rgba(140,170,210,.25);font-family:'Georgia',serif}
.st-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.st-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#3050a0,#5880c0,#3050a0);background-size:200% 100%}
</style>
