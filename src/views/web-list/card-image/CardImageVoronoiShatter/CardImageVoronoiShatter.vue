<template>
  <section ref="rootRef" class="vs-root">
    <div class="vs-scene" ref="sceneRef">
      <div class="vs-world" ref="worldRef">
        <div v-for="(frame,fi) in frames" :key="frame.id"
          class="vs-frame" :ref="(el)=>setFrameRef(el,fi)">
          <div v-for="(cell,ci) in voronoiCells" :key="ci"
            class="vs-cell" :ref="(el)=>setCellRef(el,fi,ci)"
            :style="cellClipStyle(ci)">
            <div class="vs-cell__inner">
              <img :src="frame.image" :alt="frame.alt"
                class="vs-cell__img" loading="eager" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="vs-vignette"></div>
    <div ref="scrollRef" class="vs-scroll">
      <div ref="trackRef" class="vs-track" :style="{height:trackHeight}">
        <div class="vs-sticky">
          <header ref="headerRef" class="vs-header">
            <span class="vs-kicker">🔷 Voronoi Shatter · 泰森破碎</span>
            <h1 class="vs-title"><span ref="tV" class="vs-title__w">泰森</span><span ref="tS" class="vs-title__w vs-title__w--alt">破碎</span></h1>
            <div ref="hlRef" class="vs-line"></div>
            <p class="vs-sub">向下滚动 · 图像碎成Voronoi细胞 · 如有机体般解体又重组</p>
          </header>
          <div ref="infoRef" class="vs-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="vs-progress"><div ref="progRef" class="vs-progress__fill"></div></div>
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
const N=frames.length;const CELL_N=12
const trackHeight=`${(N+1)*100}vh`

// Voronoi细胞——预计算12个"种子点"分布在画面中
const seeds:{x:number;y:number}[]=[]
for(let i=0;i<CELL_N;i++){seeds.push({x:10+Math.random()*80,y:10+Math.random()*80})}

// 每帧的细胞偏移方向（随机，但固定）
const cellDrifts:{dx:number;dy:number}[]=[]
for(let i=0;i<CELL_N;i++){cellDrifts.push({dx:(Math.random()-.5)*250,dy:(Math.random()-.5)*300})}

// 为每个Voronoi细胞生成clip-path（多边形近似区域）
const voronoiCells=Array.from({length:CELL_N},(_,i)=>i)
function cellClipStyle(ci:number):Record<string,string>{
  // 简化：每个细胞是一个圆角多边形区域
  const s=seeds[ci];const r=18+Math.random()*8
  // 用圆形近似（真实Voronoi太复杂）
  return {clipPath:`circle(${r}% at ${s.x}% ${s.y}%)`,left:'0',top:'0',width:'100%',height:'100%'}
}

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const worldRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tV=ref<HTMLElement|null>(null);const tS=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const frameRefs=ref<HTMLElement[]>([])
const cellRefs=ref<HTMLElement[][][]>([]) // [frame][cell][0]
const setFrameRef=(el:Element|null,fi:number)=>{if(el instanceof HTMLElement)frameRefs.value[fi]=el}
const setCellRef=(el:Element|null,fi:number,ci:number)=>{if(el instanceof HTMLElement){if(!cellRefs.value[fi])cellRefs.value[fi]=[];if(!cellRefs.value[fi][ci])cellRefs.value[fi][ci]=[];cellRefs.value[fi][ci][0]=el}}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tV.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tS.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupVoronoi(){
  if(!scrollRef.value||!trackRef.value||!worldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const world=worldRef.value
  const cRefs=cellRefs.value
  if(!cRefs.length)return

  // 初始化：frame0细胞聚合
  cRefs.forEach((frameCells,fi)=>{
    frameCells.forEach((cellArr,ci)=>{
      const cell=cellArr[0];if(!cell)return
      if(fi===0){gsap.set(cell,{x:0,y:0,scale:1,opacity:1})}
      else{const d=cellDrifts[ci];gsap.set(cell,{x:d.dx,y:d.dy,scale:.3,opacity:0})}
    })
  })

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 每帧细胞散开+聚合
  cRefs.forEach((frameCells,fi)=>{
    const start=fi/N;const dur=1/N

    if(fi<N-1){
      // 细胞散开
      frameCells.forEach((cellArr,ci)=>{
        const cell=cellArr[0];if(!cell)return;const d=cellDrifts[ci]
        const stagger=ci/CELL_N*dur*.3
        mtl.to(cell,{x:d.dx,y:d.dy,scale:.25,opacity:0,duration:dur*.2,ease:'power3.in'},start+dur*.5+stagger)
      })
    }

    if(fi>0){
      // 细胞聚合
      frameCells.forEach((cellArr,ci)=>{
        const cell=cellArr[0];if(!cell)return
        const stagger=ci/CELL_N*dur*.25
        mtl.to(cell,{x:0,y:0,scale:1,opacity:1,duration:dur*.18,ease:'back.out(1.3)'},start+dur*.08+stagger)
      })
    }
  })

  // 世界微旋转
  if(world){mtl.to(world,{rotation:3,duration:N*.4,ease:'sine.inOut'},0);mtl.to(world,{rotation:-2,duration:N*.35,ease:'sine.inOut'},N*.4);mtl.to(world,{rotation:0,duration:N*.25,ease:'sine.inOut'},N*.75)}

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupVoronoi()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.vs-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 50% 40% at 50% 48%,#0a0e18 0%,#060810 60%,#020408 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.vs-scene{position:absolute;inset:0;z-index:2;pointer-events:none;display:flex;align-items:center;justify-content:center}
.vs-world{position:absolute;top:50%;left:50%;width:clamp(260px,42vw,460px);height:clamp(340px,54vw,590px);margin-left:calc(clamp(260px,42vw,460px)/-2);margin-top:calc(clamp(340px,54vw,590px)/-2);will-change:transform}
.vs-frame{position:absolute;inset:0}
.vs-cell{position:absolute;will-change:transform,opacity}
.vs-cell__inner{position:absolute;inset:-10px;overflow:hidden}
.vs-cell__img{width:100%;height:100%;object-fit:cover;display:block}
.vs-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 45% 35% at 50% 50%,transparent 25%,rgba(2,4,8,.5) 100%)}
.vs-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.05)}}
.vs-track{position:relative;width:100%}.vs-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.vs-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,460px)}
.vs-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(140,160,200,.4);background:rgba(0,0,0,.25);backdrop-filter:blur(6px);border:1px solid rgba(100,140,200,.08);border-radius:999px;padding:.1rem .55rem;margin-bottom:.2rem}
.vs-title{margin:0;display:flex;justify-content:center;gap:.05em}
.vs-title__w{font-size:clamp(1.4rem,3.2vw,2.4rem);font-weight:900;color:#a8c0e0;will-change:transform,opacity}
.vs-title__w--alt{background:linear-gradient(180deg,#c8d8f8,#5880c0,#2860b0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.vs-line{width:35px;height:1.5px;margin:.14rem auto .18rem;background:linear-gradient(90deg,transparent,#4878b8,#6898d0,transparent)}
.vs-sub{margin:0;font-size:clamp(.46rem,.64vw,.56rem);color:rgba(100,140,200,.18)}
.vs-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.52rem;color:rgba(120,160,210,.22);font-family:'Georgia',serif}
.vs-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.vs-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#3860b0,#5890d0,#3860b0);background-size:200% 100%}
</style>
