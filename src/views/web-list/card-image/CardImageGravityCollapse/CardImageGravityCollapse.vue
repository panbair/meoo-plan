<template>
  <section ref="rootRef" class="gc-root">
    <!-- 时空背景 -->
    <div ref="spacetimeRef" class="gc-spacetime"></div>
    <!-- 事件视界光环 -->
    <div ref="horizonRef" class="gc-horizon">
      <div class="gc-horizon__ring gc-horizon__ring--1"></div>
      <div class="gc-horizon__ring gc-horizon__ring--2"></div>
      <div class="gc-horizon__ring gc-horizon__ring--3"></div>
      <div class="gc-horizon__singularity"></div>
    </div>
    <!-- 吸积盘粒子 -->
    <canvas ref="canvasRef" class="gc-canvas"></canvas>

    <div ref="scrollRef" class="gc-scroll">
      <div ref="trackRef" class="gc-track" :style="{ height: trackHeight }">
        <div class="gc-sticky">

          <header ref="headerRef" class="gc-header">
            <span class="gc-kicker">⭕ Gravity Collapse · 引力坍缩</span>
            <h1 class="gc-title">
              <span ref="t1" class="gc-title__c">引</span><span ref="t2" class="gc-title__c">力</span>
              <span ref="t3" class="gc-title__c">坍</span><span ref="t4" class="gc-title__c">缩</span>
            </h1>
            <div ref="headerLineRef" class="gc-line"></div>
            <p class="gc-sub">向下滚动 · 时空弯曲 · 图片坠入奇点 · 新宇宙从爆炸中诞生</p>
          </header>

          <div class="gc-stage">
            <article v-for="(f, idx) in frames" :key="f.id" :ref="(el) => setFrameRef(el, idx)" class="gc-frame">
              <div :ref="(el) => setWarpRef(el, idx)" class="gc-frame__warp">
                <img :ref="(el) => setImgRef(el, idx)" class="gc-frame__img" :src="f.image" :alt="f.alt" loading="lazy" />
              </div>
              <div :ref="(el) => setFlashRef(el, idx)" class="gc-frame__flash"></div>
              <div :ref="(el) => setCaptionRef(el, idx)" class="gc-caption">
                <span class="gc-caption__label">{{ f.label }}</span>
                <h2>{{ f.title }}</h2>
                <p>{{ f.description }}</p>
              </div>
            </article>
          </div>

          <div class="gc-progress"><div ref="progressRef" class="gc-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

interface Frame { id: string; label: string; title: string; description: string; image: string; alt: string }
const frames: Frame[] = [
  { id:'cosmos', label:'Event Horizon', title:'事件视界', description:'时空在此处弯曲到极致，连光也无法逃脱引力的掌控。', image:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80', alt:'宇宙深空星云' },
  { id:'nebula', label:'Singularity', title:'奇点深渊', description:'一切物质被拉伸成原子细丝，坠入无限致密的奇点之中。', image:'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80', alt:'紫色星云尘埃' },
  { id:'stretch', label:'Spaghettification', title:'面条拉伸', description:'引力梯度将画面撕裂拉长，如同意大利面条般被吸入。', image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80', alt:'山脊被阳光照亮' },
  { id:'bigbang', label:'Big Bang', title:'大爆炸重生', description:'奇点反弹，新宇宙在剧烈的能量爆发中喷涌而出。', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', alt:'海浪冲击' },
  { id:'newborn', label:'New Universe', title:'新宇宙诞生', description:'从爆炸余晖中，全新的世界在星尘中凝聚成形。', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', alt:'阳光森林' },
]
const FC = frames.length
const trackHeight = `${(FC+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null), scrollRef=ref<HTMLElement|null>(null), trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null), headerLineRef=ref<HTMLElement|null>(null)
const t1=ref<HTMLElement|null>(null),t2=ref<HTMLElement|null>(null),t3=ref<HTMLElement|null>(null),t4=ref<HTMLElement|null>(null)
const horizonRef=ref<HTMLElement|null>(null), spacetimeRef=ref<HTMLElement|null>(null)
const progressRef=ref<HTMLElement|null>(null), canvasRef=ref<HTMLCanvasElement|null>(null)

const frameRefs=ref<HTMLElement[]>([]), warpRefs=ref<HTMLElement[]>([])
const imgRefs=ref<HTMLImageElement[]>([]), flashRefs=ref<HTMLElement[]>([])
const captionRefs=ref<HTMLElement[]>([])
const setFrameRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)frameRefs.value[i]=el}
const setWarpRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)warpRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const setFlashRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)flashRefs.value[i]=el}
const setCaptionRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)captionRefs.value[i]=el}
const cleanupFns:TweenCleanup[]=[]

// ── 吸积盘粒子 ──
interface AccP { x:number;y:number;angle:number;r:number;speed:number;alpha:number;life:number;maxLife:number }
let ctx:CanvasRenderingContext2D|null=null,cw=0,ch=0
const particles:AccP[]=[]; let animId=0
function initCanvas(){
  const c=canvasRef.value; if(!c)return; ctx=c.getContext('2d'); if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch}; rs()
  window.addEventListener('resize',rs); cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<180;i++) particles.push({x:0,y:0,angle:Math.random()*Math.PI*2,r:60+Math.random()*300,speed:0.3+Math.random()*2.5,alpha:0.3+Math.random()*0.7,life:0,maxLife:200+Math.random()*400})
  function an(){
    if(!ctx)return; ctx.clearRect(0,0,cw,ch); const cx=cw/2,cy=ch/2
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life++;if(p.life>=p.maxLife){particles.splice(i,1);particles.push({x:0,y:0,angle:Math.random()*Math.PI*2,r:60+Math.random()*300,speed:0.3+Math.random()*2.5,alpha:0.3+Math.random()*0.7,life:0,maxLife:200+Math.random()*400});continue}
      p.angle+=p.speed*0.008; const r2=p.r+(p.life*0.3); p.x=cx+Math.cos(p.angle)*r2; p.y=cy+Math.sin(p.angle)*r2*0.4
      const t=p.life/p.maxLife,fade=t<0.15?t/0.15:t>0.7?1-(t-0.7)/0.3:1
      const g=ctx!.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*0.15)
      g.addColorStop(0,`rgba(255,200,100,${p.alpha*fade})`); g.addColorStop(0.5,`rgba(255,140,40,${p.alpha*fade*0.5})`); g.addColorStop(1,'rgba(255,80,20,0)')
      ctx!.beginPath(); ctx!.arc(p.x,p.y,p.r*0.15,0,Math.PI*2); ctx!.fillStyle=g; ctx!.fill()
      // 轨道拖尾
      const tx=cx+Math.cos(p.angle-0.05)*r2,ty=cy+Math.sin(p.angle-0.05)*r2*0.4
      ctx!.beginPath();ctx!.moveTo(tx,ty);ctx!.lineTo(p.x,p.y);ctx!.strokeStyle=`rgba(255,180,60,${p.alpha*fade*0.4})`;ctx!.lineWidth=1.5;ctx!.stroke()
    }
    animId=requestAnimationFrame(an)
  }
  animId=requestAnimationFrame(an)
}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!horizonRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:0.85,ease:'power3.out'})
    .fromTo([t1.value,t2.value,t3.value,t4.value],{autoAlpha:0,y:50,scale:0.2,rotation:30},{autoAlpha:1,y:0,scale:1,rotation:0,duration:0.7,stagger:0.08,ease:'back.out(2.2)'},'-=0.4')
    .fromTo(headerLineRef.value,{scaleX:0},{scaleX:1,duration:0.55,ease:'power3.inOut'},'-=0.3')
    .fromTo(horizonRef.value,{autoAlpha:0,scale:0},{autoAlpha:1,scale:1,duration:0.9,ease:'back.out(2)'},'-=0.4')
    .fromTo(spacetimeRef.value,{opacity:0},{opacity:1,duration:0.8},'-=0.6')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupGravity(){
  if(!scrollRef.value||!trackRef.value)return
  const sc=scrollRef.value,track=trackRef.value,frs=frameRefs.value,warps=warpRefs.value,imgs=imgRefs.value,fls=flashRefs.value,caps=captionRefs.value
  if(!frs.length)return

  frs.forEach((fr,i)=>{
    gsap.set(fr,{position:'absolute',inset:0,zIndex:FC-i})
    if(i===0){gsap.set(fr,{autoAlpha:1});gsap.set(warps[i],{scale:1,filter:'blur(0px) brightness(1)',borderRadius:'0px'});gsap.set(fls[i],{opacity:0,scale:0});gsap.set(caps[i],{autoAlpha:1,y:0})}
    else{gsap.set(fr,{autoAlpha:0});gsap.set(warps[i],{scale:0.02,filter:'blur(20px) brightness(3)',borderRadius:'50%'});gsap.set(fls[i],{opacity:1,scale:3});gsap.set(caps[i],{autoAlpha:0,y:40})}
  })

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2}})

  frs.forEach((_fr,i)=>{
    const o=i,warp=warps[i],img=imgs[i],fl=fls[i],cap=caps[i]

    // ☄ 坍缩: 图片被拉向奇点
    mtl.to(warp,{scale:0.02,filter:'blur(18px) brightness(3.5)',borderRadius:'50%',duration:0.4,ease:'power3.in'},o+0.5)
      .to(fl,{opacity:1,scale:3,duration:0.35,ease:'power2.in'},o+0.55)
      .to(cap,{autoAlpha:0,y:-30,duration:0.15},o+0.52)
      .to(_fr,{autoAlpha:0,duration:0.12},o+0.6)

    if(i<FC-1){
      const nf=frs[i+1],nw=warps[i+1],nim=imgs[i+1],nfl=fls[i+1],ncap=caps[i+1]
      // 💥 大爆炸: 新图从奇点炸出
      mtl.to(nf,{autoAlpha:1,duration:0.08},o+0.58)
        .to(nw,{scale:1.15,filter:'blur(6px) brightness(2)',borderRadius:'30%',duration:0.15,ease:'power2.out'},o+0.6)
        .to(nfl,{opacity:0.6,scale:2,duration:0.12,ease:'power2.out'},o+0.6)
        .to(nw,{scale:0.92,filter:'blur(2px) brightness(1.1)',borderRadius:'8px',duration:0.15,ease:'power2.inOut'},o+0.72)
        .to(nw,{scale:1,filter:'blur(0px) brightness(1)',borderRadius:'0px',duration:0.12,ease:'sine.inOut'},o+0.84)
        .to(nfl,{opacity:0,scale:0.5,duration:0.15,ease:'power2.in'},o+0.78)
        .to(ncap,{autoAlpha:1,y:0,duration:0.25,ease:'back.out(1.5)'},o+0.7)
    }
  })

  // 事件视界脉动
  if(horizonRef.value){frs.forEach((_fr,i)=>{mtl.to(horizonRef.value,{scale:1.6,opacity:1,duration:0.1,ease:'power2.in'},i+0.5).to(horizonRef.value,{scale:1,opacity:0.85,duration:0.25,ease:'power2.out'},i+0.6)})}
  // 时空背景扭曲
  if(spacetimeRef.value){frs.forEach((_fr,i)=>{mtl.to(spacetimeRef.value,{opacity:1.2,scale:1.05,duration:0.15,ease:'power2.in'},i+0.5).to(spacetimeRef.value,{opacity:1,scale:1,duration:0.3,ease:'power2.out'},i+0.6)})}
  if(progressRef.value)mtl.to(progressRef.value,{width:'100%',duration:FC},0)

  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{initCanvas();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupGravity()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(animId);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;particles.length=0})
</script>

<style scoped lang="scss">
.gc-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#020010;font-family:'Inter','PingFang SC',system-ui,sans-serif}
.gc-spacetime{position:absolute;inset:-10%;z-index:0;background:radial-gradient(ellipse 40% 35% at 50% 50%,rgba(80,40,180,0.3) 0%,rgba(20,10,60,0.5) 40%,transparent 70%),radial-gradient(ellipse 60% 50% at 50% 55%,rgba(10,5,30,0.8) 0%,#020010 100%);will-change:opacity,transform}
.gc-horizon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:5;pointer-events:none;will-change:transform,opacity;opacity:.85}
.gc-horizon__ring{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(200,160,255,0.3);&--1{width:220px;height:220px;box-shadow:0 0 60px rgba(180,120,255,.3),0 0 120px rgba(100,60,200,.15),inset 0 0 60px rgba(180,120,255,.1);animation:gc-ring1 4s linear infinite}&--2{width:150px;height:150px;border-width:2px;border-color:rgba(220,180,255,.45);box-shadow:0 0 40px rgba(200,150,255,.4),inset 0 0 40px rgba(200,150,255,.15);animation:gc-ring2 3s linear infinite}&--3{width:80px;height:80px;border-width:2.5px;border-color:rgba(240,210,255,.6);box-shadow:0 0 30px rgba(220,180,255,.5),inset 0 0 30px rgba(220,180,255,.2);animation:gc-ring3 2s linear infinite}}
@keyframes gc-ring1{0%{transform:translate(-50%,-50%) rotate(0deg) scale(1)}100%{transform:translate(-50%,-50%) rotate(360deg) scale(1.08)}}
@keyframes gc-ring2{0%{transform:translate(-50%,-50%) rotate(0deg) scale(1.05)}100%{transform:translate(-50%,-50%) rotate(-360deg) scale(1)}}
@keyframes gc-ring3{0%{transform:translate(-50%,-50%) rotate(0deg) scale(0.95)}100%{transform:translate(-50%,-50%) rotate(360deg) scale(1.1)}}
.gc-horizon__singularity{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 0 20px #fff,0 0 50px rgba(200,160,255,.8),0 0 100px rgba(150,100,220,.5),0 0 180px rgba(100,50,200,.3)}
.gc-canvas{position:absolute;inset:0;z-index:2;pointer-events:none}
.gc-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:3;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(180,130,255,.2);&:hover{background:rgba(180,130,255,.4)}}}
.gc-track{position:relative;width:100%}.gc-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.gc-header{position:absolute;top:3.5vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,780px)}
.gc-kicker{display:inline-block;font-size:.66rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(200,170,255,.8);background:rgba(120,80,200,.12);backdrop-filter:blur(8px);border:1px solid rgba(150,100,220,.2);border-radius:999px;padding:.28rem 1.2rem;margin-bottom:.55rem}
.gc-title{margin:0;display:flex;justify-content:center;gap:.08em}
.gc-title__c{display:inline-block;font-size:clamp(2.2rem,5.5vw,4.5rem);font-weight:900;background:linear-gradient(180deg,#e8d0ff,#a060e0,#6020c0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 20px rgba(150,100,220,.5));will-change:transform,opacity}
.gc-line{width:75px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#9060d0,#c090f0,transparent);transform-origin:center}
.gc-sub{margin:0;font-size:clamp(.72rem,1.1vw,.84rem);color:rgba(180,150,220,.6);line-height:1.5;max-width:440px;margin-inline:auto}
.gc-stage{position:absolute;inset:0;pointer-events:none}.gc-frame{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:opacity}
.gc-frame__warp{width:100%;height:100%;will-change:transform,filter,border-radius;overflow:hidden}
.gc-frame__img{width:100%;height:100%;object-fit:cover;transform-origin:center}
.gc-frame__flash{position:absolute;inset:-5%;z-index:10;pointer-events:none;background:radial-gradient(ellipse 40% 35% at 50% 50%,rgba(255,255,255,1) 0%,rgba(220,200,255,.8) 25%,rgba(150,100,255,.3) 55%,transparent 80%);will-change:opacity,transform}
.gc-caption{position:absolute;left:max(5vw,24px);bottom:10vh;z-index:20;max-width:min(80vw,560px);will-change:transform,opacity}
.gc-caption__label{display:inline-flex;align-items:center;height:1.6rem;padding:0 .8rem;border-radius:999px;background:rgba(80,40,160,.3);backdrop-filter:blur(10px);border:1px solid rgba(150,100,220,.3);font-size:.62rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#c0a0f0}
.gc-caption h2{margin:.6rem 0 0;font-size:clamp(1.9rem,5vw,3.8rem);font-weight:900;line-height:1.1;color:#fff;text-shadow:0 3px 20px rgba(0,0,0,.6),0 0 50px rgba(150,100,220,.4)}
.gc-caption p{margin:.4rem 0 0;font-size:clamp(.78rem,1.2vw,.95rem);line-height:1.6;color:rgba(210,190,240,.8)}
.gc-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:2px;background:rgba(255,255,255,.05)}
.gc-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#8040d0,#a060e0,#c080f0,#8040d0);background-size:200% 100%;box-shadow:0 0 10px rgba(150,100,220,.5)}
@media(max-width:768px){.gc-title__c{font-size:1.7rem}.gc-horizon__ring{&--1{width:120px;height:120px}&--2{width:80px;height:80px}&--3{width:45px;height:45px}}.gc-caption h2{font-size:1.4rem}}
</style>
