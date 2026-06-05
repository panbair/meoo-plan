<template>
  <section ref="rootRef" class="mf-root">
    <canvas ref="canvasRef" class="mf-canvas"></canvas>

    <div class="mf-scene" ref="sceneRef">
      <div class="mf-field" ref="fieldRef">
        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="mf-card" :ref="(el)=>setCardRef(el,idx)">
          <div class="mf-card__inner">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="mf-card__img" loading="eager" />
          </div>
          <!-- 磁力粒子环 -->
          <div class="mf-card__ring"></div>
        </div>
      </div>
    </div>

    <div class="mf-vignette"></div>

    <div ref="scrollRef" class="mf-scroll">
      <div ref="trackRef" class="mf-track" :style="{height:trackHeight}">
        <div class="mf-sticky">
          <header ref="headerRef" class="mf-header">
            <span class="mf-kicker">🧲 Magnetic Float · 磁力浮游</span>
            <h1 class="mf-title"><span ref="tM" class="mf-title__w">磁力</span><span ref="tF" class="mf-title__w mf-title__w--alt">浮游</span></h1>
            <div ref="hlRef" class="mf-line"></div>
            <p class="mf-sub">向下滚动 · 照片在磁场中悬浮 · 被无形之力牵引旋转</p>
          </header>
          <div ref="infoRef" class="mf-info"><span>◈ {{ frames[currentIndex]?.title }}</span></div>
          <div class="mf-progress"><div ref="progRef" class="mf-progress__fill"></div></div>
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
const fieldRef=ref<HTMLElement|null>(null);const canvasRef=ref<HTMLCanvasElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tM=ref<HTMLElement|null>(null);const tF=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

// 磁力粒子
interface MagP{x:number;y:number;vx:number;vy:number;r:number;a:number;l:number;ml:number;h:number}
let ctx:CanvasRenderingContext2D|null=null;let cw=0,ch=0;const magPs:MagP[]=[];let mid=0
function initMag(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<100;i++)magPs.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,r:.3+Math.random()*1.5,a:.3+Math.random()*.5,l:0,ml:80+Math.random()*200,h:200+Math.random()*60})
  function an(){if(!ctx)return;ctx.clearRect(0,0,cw,ch);const cx=cw/2,cy=ch/2
    for(let i=magPs.length-1;i>=0;i--){const p=magPs[i];p.l++;if(p.l>=p.ml){magPs.splice(i,1);magPs.push({x:cx+(Math.random()-.5)*cw*.6,y:cy+(Math.random()-.5)*ch*.6,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,r:.3+Math.random()*1.5,a:.3+Math.random()*.5,l:0,ml:80+Math.random()*200,h:200+Math.random()*60});continue}
      // 粒子被中心磁力吸引
      const dx=cx-p.x;const dy=cy-p.y;const dist=Math.sqrt(dx*dx+dy*dy)+1
      p.vx+=dx/dist*.08;p.vy+=dy/dist*.08;p.vx*=.96;p.vy*=.96;p.x+=p.vx;p.y+=p.vy
      const t=p.l/p.ml,f=t<.08?t/.08:t>.6?1-(t-.6)/.4:1
      ctx!.beginPath();ctx!.arc(p.x,p.y,p.r,0,Math.PI*2);ctx!.fillStyle=`hsla(${p.h},70%,60%,${p.a*f})`;ctx!.fill()
      // 轨道路径微光
      ctx!.beginPath();ctx!.arc(p.x-p.vx*8,p.y-p.vy*8,p.r*.4,0,Math.PI*2);ctx!.fillStyle=`hsla(${p.h},80%,75%,${p.a*f*.4})`;ctx!.fill()}
    mid=requestAnimationFrame(an)}
  mid=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tM.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tF.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupMagnetic(){
  if(!scrollRef.value||!trackRef.value||!fieldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const field=fieldRef.value
  const cards=cardRefs.value;const imgs=imgRefs.value
  if(!cards.length)return

  const W=window.innerWidth
  // 浮游布局：散落在3D空间中
  cards.forEach((card,i)=>{
    const angle=i*(Math.PI*2/N);const dist=W*.3;const x=Math.cos(angle)*dist;const z=-Math.sin(angle)*dist-i*300;const y=(Math.sin(i*1.4))*80
    gsap.set(card,{x,y,z,rotateY:angle*30,rotateZ:Math.sin(i)*8,opacity:i<=2?1:Math.max(.1,1-(i-2)*.2),filter:'brightness(0.7)'})
    gsap.set(imgs[i],{scale:1})
  })

  const totalZ=(N-1)*350+500
  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 磁场旋转
  mtl.to(field,{rotationY:360,rotationX:8,duration:N,ease:'none'},0)
  mtl.to(field,{z:totalZ,duration:N,ease:'none'},0)

  // 每张卡片到达前台
  cards.forEach((_c,i)=>{
    const moment=i/N;const dur=1/N
    mtl.to(cards[i],{filter:'brightness(1.15)',rotateY:0,rotateZ:0,duration:dur*.22,ease:'power2.out'},Math.max(0,moment-dur*.08))
    mtl.to(cards[i],{filter:'brightness(0.7)',rotateY:(i*(Math.PI*2/N))*30,rotateZ:Math.sin(i)*8,duration:dur*.35,ease:'power2.in'},moment+dur*.45)
    if(imgs[i]){mtl.to(imgs[i],{scale:1.08,duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06));mtl.to(imgs[i],{scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)}
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initMag();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupMagnetic()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(mid);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;magPs.length=0})
</script>

<style scoped lang="scss">
.mf-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 45% at 50% 45%,#0a0a14 0%,#060610 60%,#020208 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.mf-canvas{position:absolute;inset:0;z-index:0;pointer-events:none}
.mf-scene{position:absolute;inset:0;z-index:2;perspective:1000px;perspective-origin:50% 48%;transform-style:preserve-3d;pointer-events:none}
.mf-field{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}
.mf-card{position:absolute;transform-style:preserve-3d;will-change:transform,opacity,filter}
.mf-card__inner{width:clamp(150px,24vw,260px);margin-left:calc(clamp(150px,24vw,260px)/-2);margin-top:calc(clamp(190px,30vw,330px)/-2);background:rgba(30,30,50,.8);backdrop-filter:blur(10px);border-radius:4px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.5),0 0 0 1px rgba(120,140,220,.2),0 0 20px rgba(100,120,220,.15)}
.mf-card__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;padding:5px 5px 0 5px;box-sizing:border-box;will-change:transform}
.mf-card__ring{position:absolute;inset:-8px;border-radius:8px;border:1px solid rgba(120,140,220,.1);pointer-events:none;animation:mf-ring 3s linear infinite}
@keyframes mf-ring{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.mf-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 50% 40% at 50% 48%,transparent 30%,rgba(2,2,8,.5) 100%)}
.mf-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(100,120,200,.1)}}
.mf-track{position:relative;width:100%}.mf-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.mf-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,480px)}
.mf-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(140,160,220,.4);background:rgba(0,0,0,.25);backdrop-filter:blur(6px);border:1px solid rgba(100,140,200,.08);border-radius:999px;padding:.1rem .6rem;margin-bottom:.22rem}
.mf-title{margin:0;display:flex;justify-content:center;gap:.05em}
.mf-title__w{font-size:clamp(1.5rem,3.5vw,2.6rem);font-weight:900;color:#a0b8e0;will-change:transform,opacity}
.mf-title__w--alt{background:linear-gradient(180deg,#c8d8f8,#5880c0,#3060b0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.mf-line{width:40px;height:1.5px;margin:.16rem auto .2rem;background:linear-gradient(90deg,transparent,#4878b8,#6898d0,transparent)}
.mf-sub{margin:0;font-size:clamp(.48rem,.68vw,.58rem);color:rgba(100,140,200,.18)}
.mf-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.55rem;color:rgba(140,170,220,.22);font-family:'Georgia',serif}
.mf-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.mf-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#3860b0,#5888d0,#3860b0);background-size:200% 100%}
</style>
