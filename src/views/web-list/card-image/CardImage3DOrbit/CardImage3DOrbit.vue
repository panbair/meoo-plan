<template>
  <section ref="rootRef" class="do-root">
    <canvas ref="canvasRef" class="do-canvas"></canvas>

    <div ref="scrollRef" class="do-scroll">
      <div ref="trackRef" class="do-track" :style="{ height: trackHeight }">
        <div class="do-sticky">

          <header ref="headerRef" class="do-header">
            <span class="do-kicker">🎥 3D Depth Flow · 景深穿越</span>
            <h1 class="do-title">
              <span ref="tFlow" class="do-title__w">景深</span>
              <span ref="tTitle" class="do-title__w do-title__w--alt">穿越</span>
            </h1>
            <div ref="headerLineRef" class="do-line"></div>
            <p class="do-sub">向下滚动 · 图片在3D空间中依次穿越视野 · 扑面而来</p>
          </header>

          <div class="do-stage" ref="stageRef">
            <div
              v-for="(frame, idx) in frames"
              :key="frame.id"
              class="do-card"
              :ref="(el) => setCardRef(el, idx)"
            >
              <img
                :ref="(el) => setImgRef(el, idx)"
                :src="frame.image"
                :alt="frame.alt"
                class="do-card__img"
                loading="eager"
                fetchpriority="high"
              />
              <div class="do-card__glow"></div>
            </div>
          </div>

          <div ref="infoRef" class="do-info">
            <div class="do-info__dots">
              <span v-for="(_,i) in frames" :key="i" class="do-info__dot" :class="{'do-info__dot--on': currentIndex===i}"></span>
            </div>
            <span class="do-info__idx">{{ String(currentIndex+1).padStart(2,'0') }} / {{ frames.length }}</span>
            <h3>{{ frames[currentIndex]?.title }}</h3>
          </div>

          <div class="do-progress"><div ref="progressRef" class="do-progress__fill"></div></div>

        </div>
      </div>
    </div>

    <div class="do-vignette"></div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

interface Frame { id: string; title: string; image: string; alt: string }
const frames: Frame[] = [
  { id:'aurora', title:'极光降临', image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80', alt:'极光' },
  { id:'ocean', title:'深海之光', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', alt:'海浪' },
  { id:'mountains', title:'远山呼唤', image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', alt:'远山' },
  { id:'flowers', title:'繁花秘境', image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80', alt:'繁花' },
  { id:'desert', title:'沙漠行者', image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80', alt:'沙漠' },
  { id:'forest', title:'森林呼吸', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', alt:'森林' },
  { id:'valley', title:'峡谷回响', image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80', alt:'峡谷' },
  { id:'sunrise', title:'黎明破晓', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80', alt:'日出' },
]
const N = frames.length
const trackHeight = `${(N + 1) * 100}vh`

const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const stageRef = ref<HTMLElement|null>(null)
const headerRef = ref<HTMLElement|null>(null); const headerLineRef = ref<HTMLElement|null>(null)
const tFlow = ref<HTMLElement|null>(null); const tTitle = ref<HTMLElement|null>(null)
const infoRef = ref<HTMLElement|null>(null); const progressRef = ref<HTMLElement|null>(null)
const canvasRef = ref<HTMLCanvasElement|null>(null)
const cardRefs = ref<HTMLElement[]>([]); const imgRefs = ref<HTMLImageElement[]>([])
const setCardRef = (el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef = (el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex = ref(0)
const cleanupFns: TweenCleanup[] = []

// ── 粒子 ──
interface Star { x:number;y:number;z:number;r:number;a:number;s:number }
let ctx:CanvasRenderingContext2D|null=null; let cw=0,ch=0
const stars:Star[]=[]; let sid=0
function initStars(){
  const c=canvasRef.value; if(!c)return; ctx=c.getContext('2d'); if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<220;i++)stars.push({x:Math.random()*cw,y:Math.random()*ch,z:Math.random()*1000,r:.4+Math.random()*2,a:.15+Math.random()*.5,s:.5+Math.random()*3})
  function an(){
    if(!ctx)return;ctx.clearRect(0,0,cw,ch);const cx=cw/2,cy=ch/2
    for(const s of stars){s.z-=s.s;if(s.z<=0){s.z=1000;s.x=Math.random()*cw;s.y=Math.random()*ch;s.s=.5+Math.random()*3}
      const sc=1000/s.z;const sx=cx+(s.x-cx)*sc;const sy=cy+(s.y-cy)*sc;const sr=s.r*sc;const sa=s.a*Math.min(1,sc*.7)
      if(sx<-20||sx>cw+20||sy<-20||sy>ch+20)continue
      const g=ctx!.createRadialGradient(sx,sy,0,sx,sy,sr*2);g.addColorStop(0,`rgba(200,220,255,${sa})`);g.addColorStop(.5,`rgba(120,160,220,${sa*.4})`);g.addColorStop(1,'rgba(40,80,180,0)')
      ctx!.beginPath();ctx!.arc(sx,sy,sr*2,0,Math.PI*2);ctx!.fillStyle=g;ctx!.fill()}
    sid=requestAnimationFrame(an)
  }
  sid=requestAnimationFrame(an)
}

// ── 入场 ──
function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!stageRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tFlow.value!,{autoAlpha:0,x:-35,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tTitle.value!,{autoAlpha:0,x:35,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(headerLineRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(stageRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

// ── 核心3D穿越 ──
function setupFlow(){
  if(!scrollRef.value||!trackRef.value||!stageRef.value)return
  const sc=scrollRef.value; const track=trackRef.value
  const cards=cardRefs.value; const imgs=imgRefs.value
  if(!cards.length)return

  const W=window.innerWidth
  const OFF_RIGHT=W*1.35; const OFF_LEFT=-W*1.35; const CENTER=0

  // 初始化：第0张在中间可见，其余在右侧远处
  cards.forEach((card,i)=>{
    if(i===0){
      gsap.set(card,{x:CENTER,rotateY:0,scale:1,z:0,opacity:1,filter:'brightness(1.05) blur(0px)',zIndex:N})
      gsap.set(imgs[i],{scale:1.1})
    }else{
      gsap.set(card,{x:OFF_RIGHT,rotateY:70,scale:.55,z:-600,opacity:0,filter:'brightness(.6) blur(10px)',zIndex:N-i})
      gsap.set(imgs[i],{scale:1})
    }
  })

  const mtl=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{
      trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))},
    },
  })

  // 进度条
  if(progressRef.value)mtl.to(progressRef.value,{width:'100%',duration:N},0)

  cards.forEach((card,i)=>{
    const start=i/N; const dur=1/N

    if(i===0){
      // 第0张：驻留前半→飞离
      mtl.to(card,{x:CENTER,rotateY:0,scale:1,z:0,opacity:1,duration:dur*.45,ease:'none'},start)
      if(imgs[i]){mtl.to(imgs[i],{scale:1.12,duration:dur*.2,ease:'sine.inOut'},start);mtl.to(imgs[i],{scale:1.1,duration:dur*.25,ease:'sine.inOut'},start+dur*.2)}
      mtl.to(card,{x:OFF_LEFT,rotateY:-70,scale:.55,z:-600,opacity:0,filter:'brightness(.6) blur(10px)',duration:dur*.55,ease:'power3.in'},start+dur*.45)
    }else{
      // 其余：右侧飞入→驻留→左侧飞离
      mtl.to(card,{x:CENTER,rotateY:0,scale:1,z:0,opacity:1,filter:'brightness(1.05) blur(0px)',duration:dur*.35,ease:'power3.out'},start)
      if(imgs[i])mtl.to(imgs[i],{scale:1.1,duration:dur*.28,ease:'power2.out'},start)
      mtl.to(card,{x:CENTER,rotateY:0,scale:1,z:0,opacity:1,duration:dur*.12,ease:'none'},start+dur*.35)
      if(imgs[i]){mtl.to(imgs[i],{scale:1.12,duration:dur*.05,ease:'sine.inOut'},start+dur*.28);mtl.to(imgs[i],{scale:1.1,duration:dur*.07,ease:'sine.inOut'},start+dur*.33)}
      mtl.to(card,{x:OFF_LEFT,rotateY:-70,scale:.55,z:-600,opacity:0,filter:'brightness(.6) blur(10px)',duration:dur*.53,ease:'power3.in'},start+dur*.47)
    }
  })

  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

// 预加载所有图片，确保浏览器已经缓存
function preloadImages(): Promise<void[]> {
  return Promise.all(frames.map(f =>
    new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve() // 即使失败也继续
      img.src = f.image
    })
  ))
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async ()=>{
  initStars()
  // 先预加载所有图片，再初始化动画
  await preloadImages()
  requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupFlow()}))
  window.addEventListener('resize',handleResize)
})
onUnmounted(()=>{
  window.removeEventListener('resize',handleResize);cancelAnimationFrame(sid)
  ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;stars.length=0
})
</script>

<style scoped lang="scss">
.do-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 45% at 50% 45%,#0e1625 0%,#060b14 70%,#020408 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.do-canvas{position:absolute;inset:0;z-index:0;pointer-events:none}

/* ── 滚动容器 ── */
.do-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(50,110,190,.16)}}
.do-track{position:relative;width:100%}
.do-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}

/* ── 标题 ── */
.do-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,680px)}
.do-kicker{display:inline-block;font-size:.6rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:rgba(130,170,215,.68);background:rgba(30,80,160,.1);backdrop-filter:blur(8px);border:1px solid rgba(50,110,200,.14);border-radius:999px;padding:.2rem .9rem;margin-bottom:.38rem}
.do-title{margin:0;display:flex;justify-content:center;gap:.1em}
.do-title__w{font-size:clamp(1.8rem,4.5vw,3.4rem);font-weight:900;color:#a8c4e4;text-shadow:0 0 16px rgba(70,120,200,.3);will-change:transform,opacity}
.do-title__w--alt{background:linear-gradient(180deg,#d0e0ff,#4880cc,#2058b0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.do-line{width:60px;height:1.5px;margin:.3rem auto .38rem;border-radius:2px;background:linear-gradient(90deg,transparent,#4078c0,#68a0e0,transparent);transform-origin:center}
.do-sub{margin:0;font-size:clamp(.6rem,.9vw,.7rem);color:rgba(110,150,195,.4);line-height:1.4;max-width:340px;margin-inline:auto}

/* ── 舞台+卡片 ── */
.do-stage{position:absolute;inset:0;z-index:2;perspective:1000px;perspective-origin:50% 50%}
.do-card{position:absolute;top:50%;left:50%;width:min(68vw,780px);height:min(76vh,540px);margin-left:calc(min(68vw,780px)/-2);margin-top:calc(min(76vh,540px)/-2);backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:20px;overflow:hidden;will-change:transform,opacity,filter;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.04) inset}
.do-card__img{width:100%;height:100%;object-fit:cover;display:block;will-change:transform;transform-origin:center}
.do-card__glow{position:absolute;inset:0;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.06),transparent 40%,transparent 60%,rgba(80,140,220,.04))}

/* ── 信息栏 ── */
.do-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.3rem}
.do-info__dots{display:flex;gap:8px}
.do-info__dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.12);transition:all .35s}
.do-info__dot--on{background:#fff;box-shadow:0 0 8px #fff,0 0 18px rgba(70,140,230,.6)}
.do-info__idx{font-size:.54rem;font-weight:700;letter-spacing:.2em;color:rgba(130,170,215,.4);font-family:'Courier New',monospace}
.do-info h3{margin:0;font-size:clamp(.9rem,1.8vw,1.3rem);font-weight:700;color:rgba(180,205,235,.7)}

/* ── 进度条 ── */
.do-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:2px;background:rgba(255,255,255,.04)}
.do-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#3068b0,#5090d8,#70b0f0,#3068b0);background-size:200% 100%;box-shadow:0 0 8px rgba(60,120,210,.4)}

/* ── 暗角覆盖 ── */
.do-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 65% 55% at 50% 50%,transparent 45%,rgba(3,6,12,.55) 100%)}

@media(max-width:768px){.do-card{width:82vw;height:55vh;margin-left:-41vw;margin-top:-27.5vh}.do-title__w{font-size:1.4rem}}
</style>
