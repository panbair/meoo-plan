<template>
  <section ref="rootRef" class="eb-root">
    <canvas ref="canvasRef" class="eb-canvas"></canvas>

    <div class="eb-scene" ref="sceneRef">
      <div v-for="(frame,idx) in frames" :key="frame.id"
        class="eb-card" :ref="(el)=>setCardRef(el,idx)">
        <div class="eb-card__spring" :ref="(el)=>setSpringRef(el,idx)"></div>
        <div class="eb-card__body" :ref="(el)=>setBodyRef(el,idx)">
          <img :src="frame.image" :alt="frame.alt"
            class="eb-card__img" loading="eager" />
        </div>
      </div>
    </div>

    <div class="eb-vignette"></div>

    <div ref="scrollRef" class="eb-scroll">
      <div ref="trackRef" class="eb-track" :style="{height:trackHeight}">
        <div class="eb-sticky">
          <header ref="headerRef" class="eb-header">
            <span class="eb-kicker">🫧 Elastic Bounce · 弹性弹跳</span>
            <h1 class="eb-title"><span ref="tE" class="eb-title__w">弹性</span><span ref="tB" class="eb-title__w eb-title__w--alt">弹跳</span></h1>
            <div ref="hlRef" class="eb-line"></div>
            <p class="eb-sub">向下滚动 · 照片如同弹簧连接 · 弹跳伸缩 · 充满活力</p>
          </header>
          <div ref="infoRef" class="eb-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="eb-progress"><div ref="progRef" class="eb-progress__fill"></div></div>
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

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const canvasRef=ref<HTMLCanvasElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tE=ref<HTMLElement|null>(null);const tB=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const bodyRefs=ref<HTMLElement[]>([])
const springRefs=ref<HTMLElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setBodyRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)bodyRefs.value[i]=el}
const setSpringRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)springRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

// 弹跳粒子
interface BounceP{x:number;y:number;vy:number;r:number;a:number;l:number;ml:number}
let ctx:CanvasRenderingContext2D|null=null;let cw=0,ch=0;const bps:BounceP[]=[];let bid=0
function initBounce(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<40;i++)bps.push({x:Math.random()*cw,y:ch+Math.random()*100,vy:-(2+Math.random()*5),r:2+Math.random()*4,a:.3+Math.random()*.5,l:0,ml:60+Math.random()*100})
  function an(){if(!ctx)return;ctx.clearRect(0,0,cw,ch);if(bps.length<40&&Math.random()<.3)bps.push({x:Math.random()*cw,y:ch+10,vy:-(2+Math.random()*5),r:2+Math.random()*4,a:.3+Math.random()*.5,l:0,ml:60+Math.random()*100})
    for(let i=bps.length-1;i>=0;i--){const p=bps[i];p.l++;if(p.l>=p.ml||p.y<-50){bps.splice(i,1);continue}p.vy+=.15;p.y+=p.vy;const t=p.l/p.ml,f=t<.1?t/.1:t>.7?1-(t-.7)/.3:1;ctx!.beginPath();ctx!.arc(p.x,p.y,p.r,0,Math.PI*2);ctx!.fillStyle=`rgba(255,180,220,${p.a*f})`;ctx!.fill()}bid=requestAnimationFrame(an)}
  bid=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tE.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tB.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupBounce(){
  if(!scrollRef.value||!trackRef.value||!sceneRef.value)return
  const sc=scrollRef.value;const track=trackRef.value
  const cards=cardRefs.value;const bodies=bodyRefs.value;const springs=springRefs.value
  if(!cards.length)return

  const W=window.innerWidth
  // 初始：第0张在中心，其余悬挂在上方/下方
  cards.forEach((card,i)=>{
    gsap.set(card,{x:(i-(N-1)/2)*W*.15,opacity:i<=2?1:Math.max(.1,1-(i-2)*.2)})
    gsap.set(bodies[i],{y:i===0?0:(i%2?-120:120),scale:i===0?1:.6})
    gsap.set(springs[i],{scaleY:i===0?1:2.5})
  })

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.25,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 🫧 弹性弹跳动画 — 用elastic easing实现弹簧物理
  cards.forEach((_c,i)=>{
    const start=i/N;const dur=1/N

    // 💥 弹入：从上方/下方弹跳到中心
    const fromY=i%2?-150:150
    mtl.fromTo(bodies[i],{y:fromY,scale:.3},{y:0,scale:1,duration:dur*.25,ease:'elastic.out(1,.7)'},Math.max(0,start-dur*.05))
    // 弹簧压缩→伸展
    mtl.to(springs[i],{scaleY:.5,duration:dur*.12,ease:'power2.in'},Math.max(0,start-dur*.03))
    mtl.to(springs[i],{scaleY:1,duration:dur*.15,ease:'elastic.out(1,.5)'},start+dur*.08)

    // 💥 弹出：弹跳到对面方向
    const toY=i%2?120:-120
    mtl.to(bodies[i],{y:toY,scale:.55,duration:dur*.22,ease:'power3.in'},start+dur*.5)
    mtl.to(springs[i],{scaleY:2.2,duration:dur*.18,ease:'power2.in'},start+dur*.5)
  })

  // 整体呼吸
  if(sceneRef.value){mtl.to(sceneRef.value,{scale:1.03,duration:N*.2,ease:'sine.inOut'},0);mtl.to(sceneRef.value,{scale:.97,duration:N*.3,ease:'sine.inOut'},N*.25);mtl.to(sceneRef.value,{scale:1,duration:N*.5,ease:'sine.inOut'},N*.55)}

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initBounce();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupBounce()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(bid);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;bps.length=0})
</script>

<style scoped lang="scss">
.eb-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 45% at 50% 48%,#1a1020 0%,#0e0818 60%,#060410 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.eb-canvas{position:absolute;inset:0;z-index:0;pointer-events:none}
.eb-scene{position:absolute;top:50%;left:50%;width:0;height:0;z-index:2;will-change:transform}
.eb-card{position:absolute;will-change:opacity}
.eb-card__spring{position:absolute;bottom:100%;left:50%;width:3px;height:40px;margin-left:-1.5px;background:linear-gradient(to bottom,transparent,rgba(200,150,220,.4),rgba(180,120,200,.6));border-radius:2px;will-change:transform;transform-origin:bottom}
.eb-card__body{will-change:transform}
.eb-card__img{width:clamp(140px,22vw,240px);display:block;aspect-ratio:4/5;object-fit:cover;margin-left:calc(clamp(140px,22vw,240px)/-2);margin-top:calc(clamp(175px,28vw,300px)/-2);border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.4),0 0 0 3px rgba(200,160,230,.2)}
.eb-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 50% 40% at 50% 50%,transparent 30%,rgba(4,2,10,.5) 100%)}
.eb-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(180,120,200,.1)}}
.eb-track{position:relative;width:100%}.eb-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.eb-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,460px)}
.eb-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(200,160,220,.4);background:rgba(0,0,0,.2);backdrop-filter:blur(6px);border:1px solid rgba(180,120,200,.08);border-radius:999px;padding:.1rem .55rem;margin-bottom:.2rem}
.eb-title{margin:0;display:flex;justify-content:center;gap:.05em}
.eb-title__w{font-size:clamp(1.4rem,3.2vw,2.4rem);font-weight:900;color:#d0b8e8;will-change:transform,opacity}
.eb-title__w--alt{background:linear-gradient(180deg,#f0c0ff,#c060d0,#8030a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.eb-line{width:35px;height:1.5px;margin:.14rem auto .18rem;background:linear-gradient(90deg,transparent,#b060d0,#d090e8,transparent)}
.eb-sub{margin:0;font-size:clamp(.46rem,.64vw,.56rem);color:rgba(180,140,200,.18)}
.eb-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.52rem;color:rgba(200,160,220,.22);font-family:'Georgia',serif}
.eb-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.eb-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#9040b0,#c060d0,#9040b0);background-size:200% 100%}
</style>
