<template>
  <section ref="rootRef" class="gw-root">
    <div class="gw-scene" ref="sceneRef">
      <div class="gw-wall" ref="wallRef">
        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="gw-frame" :ref="(el)=>setFrameRef(el,idx)"
          :style="frameStyle(idx)">
          <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
            class="gw-frame__img" loading="eager" />
          <!-- 画框 -->
          <div class="gw-frame__border"></div>
          <!-- 墙上灯光 -->
          <div class="gw-frame__spotlight"></div>
        </div>
      </div>
    </div>
    <div class="gw-vignette"></div>
    <div ref="scrollRef" class="gw-scroll">
      <div ref="trackRef" class="gw-track" :style="{height:trackHeight}">
        <div class="gw-sticky">
          <header ref="headerRef" class="gw-header">
            <span class="gw-kicker">🖼 Gallery Wall · 画廊墙</span>
            <h1 class="gw-title"><span ref="tG" class="gw-title__w">画廊</span><span ref="tW" class="gw-title__w gw-title__w--alt">墙</span></h1>
            <div ref="hlRef" class="gw-line"></div>
            <p class="gw-sub">向下滚动 · 镜头横扫巨型画廊墙 · 如同漫步博物馆大厅</p>
          </header>
          <div ref="infoRef" class="gw-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="gw-progress"><div ref="progRef" class="gw-progress__fill"></div></div>
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
const trackHeight=`${(N+1)*100}vh`

// 画廊墙布局 — 模拟沙龙式挂画：不同大小、不同高度
const wallLayout=[
  {col:0,row:0,w:1,h:1},{col:1,row:0,w:1,h:1},
  {col:0,row:1,w:2,h:1},{col:2,row:0,w:1,h:2},
  {col:1,row:2,w:1,h:1},{col:2,row:2,w:1,h:1},
  {col:0,row:3,w:1,h:1},{col:1,row:3,w:2,h:1},
]
const COL_W=340;const ROW_H=280;const GAP=20
function frameStyle(idx:number):Record<string,string>{
  const L=wallLayout[idx]
  const left=L.col*(COL_W+GAP)+'px'
  const top=L.row*(ROW_H+GAP)+'px'
  const w=L.w*COL_W+(L.w-1)*GAP+'px'
  const h=L.h*ROW_H+(L.h-1)*GAP+'px'
  return {left,top,width:w,height:h}
}

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const wallRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tG=ref<HTMLElement|null>(null);const tW=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const frameRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setFrameRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)frameRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tG.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tW.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupWall(){
  if(!scrollRef.value||!trackRef.value||!wallRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const wall=wallRef.value
  const frames_=frameRefs.value;const imgs=imgRefs.value
  if(!frames_.length)return

  // 初始化：照片挂在墙上，微有深度
  frames_.forEach((f,i)=>{
    const z=(i%3===0)?20:(i%3===1)?-15:35 // 不同的Z深度模拟画框厚度
    gsap.set(f,{z,opacity:i<=2?1:Math.max(.15,1-(i-2)*.2),filter:'brightness(0.75)'})
    gsap.set(imgs[i],{scale:1})
  })

  // 镜头横扫：wall在X和Z轴上移动
  const totalX=-(wallLayout[wallLayout.length-1].col*COL_W-200)
  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 镜头横扫：X轴平移 + 微Z推进
  mtl.to(wall,{x:totalX,duration:N,ease:'none'},0)
  mtl.to(wall,{z:200,duration:N*.5,ease:'sine.inOut'},0)
  mtl.to(wall,{z:0,duration:N*.5,ease:'sine.inOut'},N*.5)

  // 每张画到达视野中心时亮起
  frames_.forEach((_f,i)=>{
    const moment=i/N;const dur=1/N
    mtl.to(frames_[i],{filter:'brightness(1.15)',duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06))
    mtl.to(frames_[i],{filter:'brightness(0.75)',duration:dur*.3,ease:'power2.in'},moment+dur*.4)
    if(imgs[i]){mtl.to(imgs[i],{scale:1.05,duration:dur*.18,ease:'power2.out'},Math.max(0,moment-dur*.04));mtl.to(imgs[i],{scale:1,duration:dur*.28,ease:'power2.in'},moment+dur*.35)}
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupWall()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.gw-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 45% at 50% 45%,#1a1814 0%,#100e0c 60%,#080604 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.gw-scene{position:absolute;inset:0;z-index:2;perspective:800px;perspective-origin:50% 48%;transform-style:preserve-3d;pointer-events:none}
.gw-wall{position:absolute;top:10vh;left:15vw;width:1200px;height:80vh;transform-style:preserve-3d;will-change:transform}
.gw-frame{position:absolute;transform-style:preserve-3d;will-change:opacity,filter;border-radius:6px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.5)}
.gw-frame__img{width:100%;height:100%;object-fit:cover;display:block;will-change:transform}
.gw-frame__border{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 0 6px rgba(255,255,255,.08),inset 0 0 0 8px rgba(0,0,0,.15)}
.gw-frame__spotlight{position:absolute;inset:-30px;pointer-events:none;background:radial-gradient(ellipse at center,rgba(255,240,200,.06),transparent 60%);opacity:.6}
.gw-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 50% 40% at 50% 48%,transparent 25%,rgba(6,4,2,.5) 100%)}
.gw-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.05)}}
.gw-track{position:relative;width:100%}.gw-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.gw-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,480px)}
.gw-kicker{display:inline-block;font-size:.52rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(200,180,140,.45);background:rgba(0,0,0,.25);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.04);border-radius:999px;padding:.1rem .6rem;margin-bottom:.25rem}
.gw-title{margin:0;display:flex;justify-content:center;gap:.05em}
.gw-title__w{font-size:clamp(1.5rem,3.5vw,2.6rem);font-weight:900;color:#d8c8a8;will-change:transform,opacity}
.gw-title__w--alt{background:linear-gradient(180deg,#f0e4c8,#b89850,#886030);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.gw-line{width:40px;height:1.5px;margin:.16rem auto .2rem;background:linear-gradient(90deg,transparent,#886030,#b89850,transparent)}
.gw-sub{margin:0;font-size:clamp(.48rem,.68vw,.58rem);color:rgba(180,150,110,.2)}
.gw-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.55rem;color:rgba(200,170,120,.25);font-family:'Georgia',serif}
.gw-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.gw-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#785828,#b09050,#785828);background-size:200% 100%}
</style>
