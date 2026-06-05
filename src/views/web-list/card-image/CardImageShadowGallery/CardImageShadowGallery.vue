<template>
  <section ref="rootRef" class="sg-root">
    <!-- 地板纹理 -->
    <div class="sg-floor"></div>
    <!-- 光束 -->
    <div class="sg-light-beam" ref="beamRef"></div>
    <!-- 光粒子 -->
    <canvas ref="canvasRef" class="sg-canvas"></canvas>

    <!-- 3D场景 -->
    <div class="sg-scene" ref="sceneRef">
      <div class="sg-world" ref="worldRef">

        <div v-for="(frame, idx) in frames" :key="frame.id"
          class="sg-card"
          :ref="(el) => setCardRef(el, idx)"
        >
          <!-- 照片 -->
          <div class="sg-card__frame">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="sg-card__img" loading="eager" />
          </div>
          <!-- 动态阴影 -->
          <div class="sg-card__shadow" :ref="(el)=>setShadowRef(el,idx)"></div>
        </div>

      </div>
    </div>

    <!-- 光源指示器 -->
    <div class="sg-light-source" ref="lightSourceRef">
      <div class="sg-light-source__bulb"></div>
    </div>

    <div class="sg-vignette"></div>

    <div ref="scrollRef" class="sg-scroll">
      <div ref="trackRef" class="sg-track" :style="{height:trackHeight}">
        <div class="sg-sticky">

          <header ref="headerRef" class="sg-header">
            <span class="sg-kicker">💡 Shadow Theater · 光影剧场</span>
            <h1 class="sg-title">
              <span ref="tLight" class="sg-title__w">光影</span>
              <span ref="tShadow" class="sg-title__w sg-title__w--alt">剧场</span>
            </h1>
            <div ref="headerLineRef" class="sg-line"></div>
            <p class="sg-sub">向下滚动 · 灯光环绕移动 · 阴影随之舞动 · 每一帧都有独特的光影</p>
          </header>

          <div ref="infoRef" class="sg-info">
            <span class="sg-info__no">{{ String(currentIndex+1).padStart(2,'0') }} · {{ frames[currentIndex]?.title }}</span>
          </div>

          <div class="sg-progress"><div ref="progressRef" class="sg-progress__fill"></div></div>

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
const worldRef=ref<HTMLElement|null>(null);const beamRef=ref<HTMLElement|null>(null)
const lightSourceRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const headerLineRef=ref<HTMLElement|null>(null)
const tLight=ref<HTMLElement|null>(null);const tShadow=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progressRef=ref<HTMLElement|null>(null)
const canvasRef=ref<HTMLCanvasElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([]);const shadowRefs=ref<HTMLElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const setShadowRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)shadowRefs.value[i]=el}
const currentIndex=ref(0)
const cleanupFns:TweenCleanup[]=[]

// ── 光尘粒子 ──
interface Dust{x:number;y:number;vx:number;vy:number;r:number;a:number;life:number;maxLife:number}
let ctx:CanvasRenderingContext2D|null=null;let cw=0,ch=0
const dusts:Dust[]=[];let sid=0
function initDust(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<60;i++)dusts.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*.4,vy:-Math.random()*.8-.2,r:.3+Math.random()*1.2,a:.2+Math.random()*.5,life:0,maxLife:120+Math.random()*250})
  function an(){
    if(!ctx)return;ctx.clearRect(0,0,cw,ch)
    if(dusts.length<60&&Math.random()<.5)dusts.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*.4,vy:-Math.random()*.8-.2,r:.3+Math.random()*1.2,a:.2+Math.random()*.5,life:0,maxLife:120+Math.random()*250})
    for(let i=dusts.length-1;i>=0;i--){const d=dusts[i];d.life++;if(d.life>=d.maxLife){dusts.splice(i,1);continue}
      d.x+=d.vx;d.y+=d.vy;const t=d.life/d.maxLife;const f=t<.1?t/.1:t>.7?1-(t-.7)/.3:1
      ctx!.beginPath();ctx!.arc(d.x,d.y,d.r,0,Math.PI*2);ctx!.fillStyle=`rgba(255,220,160,${d.a*f})`;ctx!.fill()}
    sid=requestAnimationFrame(an)
  }
  sid=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tLight.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tShadow.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(headerLineRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

// ── 核心：光影剧场 ──
// 布局: [x%(转为px), y%(转为px), z(px), rotateX(deg), rotateY(deg)]
const photoLayoutPct:[number,number,number,number,number][] = [
  [-18, -8,   0,   -3,  5 ],
  [ 22, 12, -350,   4, -3 ],
  [-28,-16, -700,  -5,  4 ],
  [ 16,-20,-1050,   3, -6 ],
  [-20, -4,-1400,  -4,  5 ],
  [ 25, 18,-1750,   6, -4 ],
  [-24,-22,-2100,  -3,  6 ],
  [ 20,-10,-2450,   5, -5 ],
]

function toPx(vwPct:number, base:number):number{return (vwPct/100)*base}

function setupShadowTheater(){
  if(!scrollRef.value||!trackRef.value||!worldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const world=worldRef.value
  const cards=cardRefs.value;const imgs=imgRefs.value;const shadows=shadowRefs.value
  if(!cards.length)return

  const W=window.innerWidth;const H=window.innerHeight

  // 初始化照片位置（转百分比为像素）
  cards.forEach((card,i)=>{
    const [xp,yp,z,rx,ry]=photoLayoutPct[i]
    gsap.set(card,{x:toPx(xp,W),y:toPx(yp,H),z,rotateX:rx,rotateY:ry,opacity:i<=2?1:Math.max(.15,1-(i-2)*.2),filter:'brightness(0.85)'})
    gsap.set(imgs[i],{scale:1})
  })

  const totalZ=Math.abs(photoLayoutPct[photoLayoutPct.length-1][2])+450

  const mtl=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{
      trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))},
    },
  })

  // 世界推进
  mtl.to(world,{z:totalZ,duration:N,ease:'none'},0)

  // 🎭 光源环绕移动：从左→中→右→中→左...
  if(lightSourceRef.value){
    mtl.to(lightSourceRef.value,{x:'-35vw',duration:N*.25,ease:'sine.inOut'},0)
    mtl.to(lightSourceRef.value,{x:'35vw',duration:N*.25,ease:'sine.inOut'},N*.25)
    mtl.to(lightSourceRef.value,{x:'-25vw',duration:N*.25,ease:'sine.inOut'},N*.5)
    mtl.to(lightSourceRef.value,{x:'30vw',duration:N*.25,ease:'sine.inOut'},N*.75)
  }
  // 光束跟随
  if(beamRef.value){
    mtl.to(beamRef.value,{opacity:.35,x:'-35vw',duration:N*.25,ease:'sine.inOut'},0)
    mtl.to(beamRef.value,{opacity:.4,x:'35vw',duration:N*.25,ease:'sine.inOut'},N*.25)
    mtl.to(beamRef.value,{opacity:.3,x:'-25vw',duration:N*.25,ease:'sine.inOut'},N*.5)
    mtl.to(beamRef.value,{opacity:.45,x:'30vw',duration:N*.25,ease:'sine.inOut'},N*.75)
  }

  // 每张照片的阴影动态变化
  // 阴影动画：rotateZ摆动 + scaleX伸缩 + opacity变化
  shadows.forEach((shadow,i)=>{
    // 阴影角度和长度随scroll周期性变化，每张照片相位不同
    const phase=i*0.3
    mtl.to(shadow,{rotateZ:-25,scaleX:1.8,opacity:.7,duration:N*.3,ease:'sine.inOut'},phase)
    mtl.to(shadow,{rotateZ:25,scaleX:1.3,opacity:.5,duration:N*.3,ease:'sine.inOut'},N*.25+phase)
    mtl.to(shadow,{rotateZ:-15,scaleX:2,opacity:.65,duration:N*.3,ease:'sine.inOut'},N*.5+phase)
    mtl.to(shadow,{rotateZ:20,scaleX:1.5,opacity:.55,duration:N*.3,ease:'sine.inOut'},N*.75+phase)
  })

  // 照片前台动画
  cards.forEach((_card,i)=>{
    const moment=i/N;const dur=1/N
    mtl.to(cards[i],{filter:'brightness(1.2)',rotateY:0,rotateX:0,duration:dur*.22,ease:'power2.out'},Math.max(0,moment-dur*.08))
    mtl.to(cards[i],{filter:'brightness(0.85)',rotateY:photoLayoutPct[i][4],rotateX:photoLayoutPct[i][3],duration:dur*.35,ease:'power2.in'},moment+dur*.45)
    if(imgs[i]){mtl.to(imgs[i],{scale:1.08,duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06));mtl.to(imgs[i],{scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)}
  })

  if(progressRef.value)mtl.to(progressRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initDust();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupShadowTheater()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(sid);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;dusts.length=0})
</script>

<style scoped lang="scss">
.sg-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 50% 35% at 50% 45%,#2d1a0a 0%,#1a0c04 55%,#0a0402 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}

/* ── 地板 ── */
.sg-floor{position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(to bottom,rgba(0,0,0,0) 40%,rgba(25,12,4,.6) 70%,rgba(15,6,2,.9) 100%)}

/* ── 光束 ── */
.sg-light-beam{position:absolute;top:-20%;left:50%;width:30vw;height:140%;z-index:1;pointer-events:none;opacity:.3;background:linear-gradient(180deg,rgba(255,200,100,.15) 0%,rgba(255,180,60,.08) 40%,transparent 80%);transform:translateX(-50%) skewX(-5deg);will-change:opacity,transform;filter:blur(30px)}

/* ── Canvas光尘 ── */
.sg-canvas{position:absolute;inset:0;z-index:1;pointer-events:none}

/* ── 3D场景 ── */
.sg-scene{position:absolute;inset:0;z-index:2;perspective:900px;perspective-origin:50% 48%;transform-style:preserve-3d;pointer-events:none}
.sg-world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}

/* ── 照片卡片 ── */
.sg-card{position:absolute;transform-style:preserve-3d;will-change:transform,opacity,filter}
.sg-card__frame{width:clamp(160px,26vw,280px);margin-left:calc(clamp(160px,26vw,280px)/-2);margin-top:calc(clamp(200px,34vw,370px)/-2);background:#faf8f5;border-radius:3px;box-shadow:0 10px 35px rgba(0,0,0,.5),0 0 0 5px #fcfaf8,0 0 0 7px rgba(0,0,0,.1);overflow:hidden;position:relative;z-index:2}
.sg-card__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;padding:8px 8px 0 8px;box-sizing:border-box;will-change:transform}

/* ── 动态阴影 ── */
.sg-card__shadow{position:absolute;top:calc(100% + 4px);left:50%;width:60%;height:40px;margin-left:-30%;transform-origin:top center;background:linear-gradient(to bottom,rgba(15,6,2,.6),rgba(15,6,2,0));filter:blur(6px);pointer-events:none;will-change:transform,opacity;z-index:1}

/* ── 光源 ── */
.sg-light-source{position:absolute;top:12vh;left:50%;transform:translateX(-50%);z-index:3;pointer-events:none;will-change:transform}
.sg-light-source__bulb{width:40px;height:40px;border-radius:50%;background:radial-gradient(circle,rgba(255,240,200,1) 0%,rgba(255,200,100,.6) 20%,rgba(255,160,40,.2) 50%,transparent 70%);box-shadow:0 0 40px rgba(255,200,80,.5),0 0 100px rgba(255,160,40,.3),0 0 200px rgba(255,120,20,.15)}

/* ── 柔光 ── */
.sg-vignette{position:absolute;inset:0;z-index:4;pointer-events:none;background:radial-gradient(ellipse 55% 45% at 50% 48%,transparent 30%,rgba(8,3,1,.55) 100%)}

/* ── 滚动 ── */
.sg-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,200,100,.1)}}
.sg-track{position:relative;width:100%}.sg-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}

/* ── 标题 ── */
.sg-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(90vw,600px)}
.sg-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(240,200,140,.6);background:rgba(0,0,0,.3);backdrop-filter:blur(6px);border:1px solid rgba(255,200,100,.1);border-radius:999px;padding:.16rem .75rem;margin-bottom:.32rem}
.sg-title{margin:0;display:flex;justify-content:center;gap:.06em}
.sg-title__w{font-size:clamp(1.7rem,4.2vw,3.2rem);font-weight:900;color:#e8d0a0;text-shadow:0 0 15px rgba(255,180,60,.2);will-change:transform,opacity}
.sg-title__w--alt{background:linear-gradient(180deg,#ffe8c0,#e8a040,#a06020);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sg-line{width:55px;height:1.5px;margin:.22rem auto .28rem;border-radius:2px;background:linear-gradient(90deg,transparent,#d09040,#e8b860,transparent);transform-origin:center}
.sg-sub{margin:0;font-size:clamp(.54rem,.78vw,.64rem);color:rgba(200,160,100,.3);line-height:1.4;max-width:320px;margin-inline:auto}
.sg-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center}
.sg-info__no{font-size:.62rem;font-weight:300;letter-spacing:.1em;color:rgba(220,180,120,.35);font-family:'Georgia',serif}
.sg-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.sg-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#986020,#d09040,#986020);background-size:200% 100%}

@media(max-width:768px){.sg-card__frame{width:140px;margin-left:-70px;margin-top:-100px}.sg-title__w{font-size:1.3rem}}
</style>
