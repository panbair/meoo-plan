<template>
  <section ref="rootRef" class="tc-root">
    <!-- 舞台聚光灯 -->
    <div class="tc-spotlight" ref="spotlightRef"></div>
    <!-- 光尘粒子 -->
    <canvas ref="canvasRef" class="tc-canvas"></canvas>

    <!-- 左侧帷幕 -->
    <div class="tc-curtain tc-curtain--left" ref="curtainLRef">
      <div class="tc-curtain__drape"></div>
      <div class="tc-curtain__fold tc-curtain__fold--1"></div>
      <div class="tc-curtain__fold tc-curtain__fold--2"></div>
      <div class="tc-curtain__tassel"></div>
    </div>
    <!-- 右侧帷幕 -->
    <div class="tc-curtain tc-curtain--right" ref="curtainRRef">
      <div class="tc-curtain__drape"></div>
      <div class="tc-curtain__fold tc-curtain__fold--1"></div>
      <div class="tc-curtain__fold tc-curtain__fold--2"></div>
      <div class="tc-curtain__tassel"></div>
    </div>

    <!-- 舞台上的照片 -->
    <div class="tc-stage" ref="stageRef">
      <div v-for="(frame,idx) in frames" :key="frame.id"
        class="tc-photo" :ref="(el)=>setPhotoRef(el,idx)">
        <div class="tc-photo__frame">
          <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
            class="tc-photo__img" loading="eager" />
        </div>
        <div class="tc-photo__plaque">{{ frame.title }}</div>
      </div>
    </div>

    <!-- 舞台地板 -->
    <div class="tc-floor"></div>
    <div class="tc-vignette"></div>

    <div ref="scrollRef" class="tc-scroll">
      <div ref="trackRef" class="tc-track" :style="{height:trackHeight}">
        <div class="tc-sticky">
          <header ref="headerRef" class="tc-header">
            <span class="tc-kicker">🎭 Theater Curtain · 剧院帷幕</span>
            <h1 class="tc-title"><span ref="tT" class="tc-title__w">剧院</span><span ref="tC" class="tc-title__w tc-title__w--alt">帷幕</span></h1>
            <div ref="hlRef" class="tc-line"></div>
            <p class="tc-sub">向下滚动 · 帷幕徐徐拉开 · 每一张照片都是一场演出</p>
          </header>
          <div ref="infoRef" class="tc-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="tc-progress"><div ref="progRef" class="tc-progress__fill"></div></div>
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
  {id:'aurora',title:'第一幕：极光',image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',alt:'极光'},
  {id:'ocean',title:'第二幕：海浪',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',alt:'海浪'},
  {id:'mountains',title:'第三幕：远山',image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',alt:'远山'},
  {id:'flowers',title:'第四幕：繁花',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',alt:'繁花'},
  {id:'desert',title:'第五幕：沙漠',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',alt:'沙漠'},
  {id:'forest',title:'第六幕：森林',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',alt:'森林'},
  {id:'valley',title:'第七幕：峡谷',image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',alt:'峡谷'},
  {id:'sunrise',title:'终幕：日出',image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',alt:'日出'},
]
const N=frames.length;const trackHeight=`${(N+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const stageRef=ref<HTMLElement|null>(null)
const curtainLRef=ref<HTMLElement|null>(null);const curtainRRef=ref<HTMLElement|null>(null)
const spotlightRef=ref<HTMLElement|null>(null);const canvasRef=ref<HTMLCanvasElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tT=ref<HTMLElement|null>(null);const tC=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const photoRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setPhotoRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)photoRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

// 光尘
interface Dust{x:number;y:number;vx:number;vy:number;r:number;a:number;l:number;ml:number}
let ctx:CanvasRenderingContext2D|null=null;let cw=0,ch=0;const dusts:Dust[]=[];let sid=0
function initDust(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<50;i++)dusts.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*.4,vy:-Math.random()*.6-.2,r:.3+Math.random()*1,a:.15+Math.random()*.35,l:0,ml:100+Math.random()*200})
  function an(){if(!ctx)return;ctx.clearRect(0,0,cw,ch);if(dusts.length<50&&Math.random()<.4)dusts.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*.4,vy:-Math.random()*.6-.2,r:.3+Math.random()*1,a:.15+Math.random()*.35,l:0,ml:100+Math.random()*200})
    for(let i=dusts.length-1;i>=0;i--){const d=dusts[i];d.l++;if(d.l>=d.ml){dusts.splice(i,1);continue}d.x+=d.vx;d.y+=d.vy;const t=d.l/d.ml,f=t<.1?t/.1:t>.7?1-(t-.7)/.3:1;ctx!.beginPath();ctx!.arc(d.x,d.y,d.r,0,Math.PI*2);ctx!.fillStyle=`rgba(255,220,160,${d.a*f})`;ctx!.fill()}sid=requestAnimationFrame(an)}
  sid=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!stageRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tT.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tC.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(stageRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupCurtainShow(){
  if(!scrollRef.value||!trackRef.value)return
  const sc=scrollRef.value;const track=trackRef.value
  const L=curtainLRef.value;const R=curtainRRef.value
  const photos=photoRefs.value;const imgs=imgRefs.value
  if(!photos.length||!L||!R)return

  // 初始化：帷幕闭合，第0张在台上等待
  gsap.set(L,{x:0});gsap.set(R,{x:0})
  photos.forEach((p,i)=>{gsap.set(p,{autoAlpha:i===0?1:0,scale:i===0?1:.85});gsap.set(imgs[i],{scale:1})})

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.3,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 聚光灯
  if(spotlightRef.value){mtl.to(spotlightRef.value,{opacity:.7,scale:1.1,duration:N*.15,ease:'sine.inOut'},0);mtl.to(spotlightRef.value,{opacity:.5,scale:1,duration:N*.7,ease:'none'},N*.15)}

  photos.forEach((_p,i)=>{
    const start=i/N;const dur=1/N

    // 🎭 帷幕打开：0→0.15 (3/20 of duration)
    if(i===0){mtl.to(L,{x:'-48vw',duration:dur*.15,ease:'power3.out'},start);mtl.to(R,{x:'48vw',duration:dur*.15,ease:'power3.out'},start)}
    else{
      // 前一张谢幕时，帷幕先闭合再打开
      mtl.to(L,{x:0,duration:dur*.12,ease:'power3.in'},start)
      mtl.to(R,{x:0,duration:dur*.12,ease:'power3.in'},start)
      mtl.to(L,{x:'-48vw',duration:dur*.15,ease:'power3.out'},start+dur*.14)
      mtl.to(R,{x:'48vw',duration:dur*.15,ease:'power3.out'},start+dur*.14)
    }

    // 照片：帷幕打开后亮相
    mtl.to(photos[i],{autoAlpha:1,scale:1,duration:dur*.12,ease:'power2.out'},start+dur*.15)
    if(imgs[i]){mtl.to(imgs[i],{scale:1.06,duration:dur*.1,ease:'power2.out'},start+dur*.15);mtl.to(imgs[i],{scale:1,duration:dur*.1,ease:'sine.inOut'},start+dur*.25)}

    // 谢幕：帷幕关闭
    if(i<N-1){
      mtl.to(photos[i],{autoAlpha:0,scale:.9,duration:dur*.08,ease:'power2.in'},start+dur*.55)
      // 关闭
    }
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initDust();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupCurtainShow()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(sid);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;dusts.length=0})
</script>

<style scoped lang="scss">
.tc-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 45% at 50% 45%,#1a1015 0%,#0c060a 60%,#040204 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.tc-spotlight{position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:60vw;height:140%;z-index:4;pointer-events:none;opacity:.5;background:radial-gradient(ellipse 40% 60% at 50% 60%,rgba(255,220,160,.15),transparent 70%);will-change:opacity,transform}
.tc-canvas{position:absolute;inset:0;z-index:3;pointer-events:none}

/* 帷幕 */
.tc-curtain{position:absolute;top:0;width:52vw;height:100%;z-index:10;pointer-events:none;will-change:transform}
.tc-curtain--left{left:0;transform-origin:right center}
.tc-curtain--right{right:0;transform-origin:left center}
.tc-curtain__drape{position:absolute;inset:0;background:linear-gradient(170deg,#6b2025 0%,#8b2830 15%,#5a1820 40%,#7a2228 60%,#4a1018 80%,#3a0c12 100%)}
.tc-curtain__fold{position:absolute;top:0;width:18%;height:100%;background:linear-gradient(90deg,rgba(0,0,0,.2),transparent 50%,rgba(255,255,255,.03) 80%)}
.tc-curtain__fold--1{left:15%}.tc-curtain__fold--2{left:55%}
.tc-curtain__tassel{position:absolute;bottom:-10px;width:30px;height:80px;background:linear-gradient(to bottom,rgba(180,140,60,.4),rgba(180,140,60,.1));border-radius:0 0 15px 15px}
.tc-curtain--left .tc-curtain__tassel{right:5px}.tc-curtain--right .tc-curtain__tassel{left:5px}

/* 舞台 */
.tc-stage{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;pointer-events:none}
.tc-photo{position:absolute;will-change:transform,opacity}
.tc-photo__frame{width:clamp(220px,35vw,380px);margin-left:calc(clamp(220px,35vw,380px)/-2);margin-top:calc(clamp(280px,45vw,480px)/-2);background:#fcfaf8;border-radius:4px;box-shadow:0 12px 50px rgba(0,0,0,.5),0 0 0 12px #2a1518,0 0 0 18px #d4b060,0 0 0 20px #2a1518;overflow:hidden}
.tc-photo__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;padding:10px 10px 0 10px;box-sizing:border-box;will-change:transform}
.tc-photo__plaque{text-align:center;margin-top:10px;font-size:.55rem;font-weight:500;color:#c8b080;letter-spacing:.12em;font-family:'Georgia',serif;text-shadow:0 0 8px rgba(200,160,80,.3)}

.tc-floor{position:absolute;bottom:0;left:0;width:100%;height:25%;z-index:2;pointer-events:none;background:linear-gradient(to bottom,transparent,rgba(10,5,8,.6) 60%,rgba(4,2,4,.9) 100%)}
.tc-vignette{position:absolute;inset:0;z-index:6;pointer-events:none;background:radial-gradient(ellipse 50% 40% at 50% 50%,transparent 30%,rgba(3,1,3,.6) 100%)}
.tc-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(200,150,60,.1)}}
.tc-track{position:relative;width:100%}.tc-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.tc-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,500px)}
.tc-kicker{display:inline-block;font-size:.52rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(220,180,100,.45);background:rgba(0,0,0,.3);backdrop-filter:blur(6px);border:1px solid rgba(200,160,60,.1);border-radius:999px;padding:.1rem .6rem;margin-bottom:.25rem}
.tc-title{margin:0;display:flex;justify-content:center;gap:.05em}
.tc-title__w{font-size:clamp(1.5rem,3.5vw,2.6rem);font-weight:900;color:#d8c090;will-change:transform,opacity}
.tc-title__w--alt{background:linear-gradient(180deg,#f8e8c0,#c89838,#885020);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.tc-line{width:40px;height:1.5px;margin:.16rem auto .2rem;background:linear-gradient(90deg,transparent,#a08030,#d8b860,transparent)}
.tc-sub{margin:0;font-size:clamp(.48rem,.68vw,.58rem);color:rgba(200,160,90,.2)}
.tc-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.55rem;color:rgba(220,180,100,.25);font-family:'Georgia',serif}
.tc-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.tc-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#885020,#c89838,#885020);background-size:200% 100%}
</style>
