<template>
  <section ref="rootRef" class="sa-root">
    <!-- 轨迹画布 -->
    <canvas ref="canvasRef" class="sa-canvas"></canvas>

    <div class="sa-scene" ref="sceneRef">
      <div v-for="(frame,idx) in frames" :key="frame.id"
        class="sa-node" :ref="(el)=>setNodeRef(el,idx)">
        <img :src="frame.image" :alt="frame.alt"
          class="sa-node__img" loading="eager" />
        <div class="sa-node__trail"></div>
      </div>
    </div>

    <div class="sa-vignette"></div>
    <div ref="scrollRef" class="sa-scroll">
      <div ref="trackRef" class="sa-track" :style="{height:trackHeight}">
        <div class="sa-sticky">
          <header ref="headerRef" class="sa-header">
            <span class="sa-kicker">🦋 Strange Attractor · 奇异吸引子</span>
            <h1 class="sa-title"><span ref="tS" class="sa-title__w">奇异</span><span ref="tA" class="sa-title__w sa-title__w--alt">吸引子</span></h1>
            <div ref="hlRef" class="sa-line"></div>
            <p class="sa-sub">向下滚动 · 照片沿混沌轨道运行 · 永远不重复的优美轨迹</p>
          </header>
          <div ref="infoRef" class="sa-info"><span>∞ {{ frames[currentIndex]?.title }}</span></div>
          <div class="sa-progress"><div ref="progRef" class="sa-progress__fill"></div></div>
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
const N=frames.length;const trackHeight=`${(N+1)*100}vh`

// 简化Lorenz吸引子参数
const A=10;const B=28;const C=8/3;const DT=.008
// 每帧的吸引子初始状态
const attractors:{x:number;y:number;z:number}[]=[]
for(let i=0;i<N;i++){attractors.push({x:Math.random()*2-1,y:Math.random()*2-1,z:Math.random()*30})}

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const canvasRef=ref<HTMLCanvasElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tS=ref<HTMLElement|null>(null);const tA=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const nodeRefs=ref<HTMLElement[]>([])
const setNodeRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)nodeRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

// 轨迹Canvas
let ctx:CanvasRenderingContext2D|null=null;let cw=0,ch=0
const trailHistory:{x:number;y:number;z:number}[][]=[] // 每个吸引子的轨迹历史
let aid=0

function initAttractor(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  // 初始化轨迹历史
  for(let i=0;i<N;i++){trailHistory.push([])}

  function an(){
    if(!ctx)return
    ctx.fillStyle='rgba(2,3,6,.08)';ctx.fillRect(0,0,cw,ch) // 拖尾效果

    const cx=cw/2;const cy=ch/2;const sc=8

    // 更新每个吸引子
    attractors.forEach((at,ai)=>{
      // Lorenz方程
      const dx=A*(at.y-at.x)*DT;const dy=(at.x*(B-at.z)-at.y)*DT;const dz=(at.x*at.y-C*at.z)*DT
      at.x+=dx;at.y+=dy;at.z+=dz

      // 映射到屏幕
      const sx=cx+at.x*sc;const sy=cy-(at.z-27)*sc*1.2
      trailHistory[ai].push({x:sx,y:sy,z:at.z})
      if(trailHistory[ai].length>80)trailHistory[ai].shift()

      // 绘制轨迹
      if(trailHistory[ai].length>1){
        for(let j=1;j<trailHistory[ai].length;j++){
          const p=trailHistory[ai][j-1];const n=trailHistory[ai][j]
          const alpha=j/trailHistory[ai].length*.35
          const hue=220+ai*15
          ctx!.beginPath();ctx!.moveTo(p.x,p.y);ctx!.lineTo(n.x,n.y)
          ctx!.strokeStyle=`hsla(${hue},70%,55%,${alpha})`;ctx!.lineWidth=1;ctx!.stroke()
        }
      }
    })

    aid=requestAnimationFrame(an)
  }
  aid=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tS.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tA.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupAttractor(){
  if(!scrollRef.value||!trackRef.value)return
  const sc=scrollRef.value;const track=trackRef.value
  const nodes=nodeRefs.value
  if(!nodes.length)return

  // 每帧照片随吸引子位置移动
  const W=window.innerWidth;const H=window.innerHeight
  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){
    currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))
    // 实时更新照片位置为吸引子当前值
    const cx=W/2;const cy=H/2;const sc2=8
    nodes.forEach((node,i)=>{if(!node||i>=attractors.length)return;const a=attractors[i];node.style.left=`${cx+a.x*sc2}px`;node.style.top=`${cy-(a.z-27)*sc2*1.2}px`;node.style.opacity=String(i<=currentIndex.value+1&&i>=currentIndex.value-1?Math.max(.3,1-Math.abs(currentIndex.value-i)*.35):.1)})
  }}})

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initAttractor();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupAttractor()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(aid);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;trailHistory.length=0})
</script>

<style scoped lang="scss">
.sa-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#020306;font-family:'Inter','PingFang SC',system-ui,sans-serif}
.sa-canvas{position:absolute;inset:0;z-index:0}
.sa-scene{position:absolute;inset:0;z-index:2;pointer-events:none}
.sa-node{position:absolute;will-change:transform;transition:opacity .5s}
.sa-node__img{width:clamp(100px,16vw,170px);display:block;aspect-ratio:4/5;object-fit:cover;margin-left:calc(clamp(100px,16vw,170px)/-2);margin-top:calc(clamp(125px,20vw,210px)/-2);border-radius:4px;box-shadow:0 8px 25px rgba(0,0,0,.6),0 0 0 1px rgba(100,160,240,.2)}
.sa-node__trail{position:absolute;inset:-3px;border-radius:6px;border:1px solid rgba(100,160,240,.08)}

.sa-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 45% 35% at 50% 50%,transparent 25%,rgba(1,2,3,.5) 100%)}
.sa-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(60,120,200,.1)}}
.sa-track{position:relative;width:100%}.sa-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.sa-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,480px)}
.sa-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(120,160,220,.4);background:rgba(0,0,0,.25);backdrop-filter:blur(6px);border:1px solid rgba(80,140,200,.08);border-radius:999px;padding:.1rem .55rem;margin-bottom:.2rem}
.sa-title{margin:0;display:flex;justify-content:center;gap:.05em}
.sa-title__w{font-size:clamp(1.4rem,3.2vw,2.4rem);font-weight:900;color:#90b8e8;will-change:transform,opacity}
.sa-title__w--alt{background:linear-gradient(180deg,#b8d8f8,#5088c8,#2058a8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sa-line{width:35px;height:1.5px;margin:.14rem auto .18rem;background:linear-gradient(90deg,transparent,#4078b8,#6098d8,transparent)}
.sa-sub{margin:0;font-size:clamp(.46rem,.64vw,.56rem);color:rgba(100,140,200,.18)}
.sa-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.52rem;color:rgba(120,160,220,.22);font-family:'Georgia',serif}
.sa-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.sa-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#2860b0,#5898d8,#2860b0);background-size:200% 100%}
</style>
