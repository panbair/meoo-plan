<template>
  <section ref="rootRef" class="ff-root">
    <!-- 萤火虫主画布 -->
    <canvas ref="canvasRef" class="ff-canvas"></canvas>

    <!-- 场景 -->
    <div class="ff-scene" ref="sceneRef">
      <div class="ff-forest" ref="forestRef">
        <div v-for="(frame, idx) in frames" :key="frame.id"
          class="ff-photo" :ref="(el)=>setPhotoRef(el,idx)"
        >
          <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
            class="ff-photo__img" loading="eager" />
          <div class="ff-photo__glow"></div>
        </div>
      </div>
    </div>

    <div class="ff-vignette"></div>

    <div ref="scrollRef" class="ff-scroll">
      <div ref="trackRef" class="ff-track" :style="{height:trackHeight}">
        <div class="ff-sticky">

          <header ref="headerRef" class="ff-header">
            <span class="ff-kicker">🪲 Firefly Swarm · 萤火虫群</span>
            <h1 class="ff-title">
              <span ref="tFire" class="ff-title__w">萤火</span>
              <span ref="tFly" class="ff-title__w ff-title__w--alt">之舞</span>
            </h1>
            <div ref="headerLineRef" class="ff-line"></div>
            <p class="ff-sub">向下滚动 · 萤火虫在夜色森林中聚散 · 围绕每一张照片起舞</p>
          </header>

          <div ref="infoRef" class="ff-info">
            <span class="ff-info__no">✦ {{ frames[currentIndex]?.title }}</span>
          </div>

          <div class="ff-progress"><div ref="progressRef" class="ff-progress__fill"></div></div>
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
const forestRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const headerLineRef=ref<HTMLElement|null>(null)
const tFire=ref<HTMLElement|null>(null);const tFly=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progressRef=ref<HTMLElement|null>(null)
const canvasRef=ref<HTMLCanvasElement|null>(null)
const photoRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setPhotoRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)photoRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0)
const cleanupFns:TweenCleanup[]=[]

// ── 萤火虫系统 ──
interface Firefly{
  x:number;y:number;tx:number;ty:number  // 当前位置+目标位置
  vx:number;vy:number;r:number           // 速度+半径
  glow:number;flicker:number;hue:number  // 发光+闪烁+色调
}
let ctx:CanvasRenderingContext2D|null=null;let cw=0,ch=0
const fireflies:Firefly[]=[];const FCOUNT=280;let fid=0

function initFireflies(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))

  const cx=cw/2,cy=ch/2
  for(let i=0;i<FCOUNT;i++){
    // 初始：散布在屏幕中央区域
    const angle=Math.random()*Math.PI*2
    const dist=Math.random()*Math.min(cw,ch)*.45
    fireflies.push({
      x:cx+Math.cos(angle)*dist, y:cy+Math.sin(angle)*dist,
      tx:cx+Math.cos(angle)*dist, ty:cy+Math.sin(angle)*dist,
      vx:0,vy:0,
      r:.8+Math.random()*2.5,
      glow:18+Math.random()*35,
      flicker:Math.random()*Math.PI*2,
      hue:70+Math.random()*30, // 70-100 = 黄绿到绿
    })
  }

  function an(){
    if(!ctx)return;ctx.clearRect(0,0,cw,ch)
    const cx=cw/2,cy=ch/2

    for(const f of fireflies){
      // 向目标位置平滑移动 + 轻微随机漂移
      const dx=f.tx-f.x;const dy=f.ty-f.y
      f.vx+=(dx*.008-f.vx)*.06+(Math.random()-.5)*.25
      f.vy+=(dy*.008-f.vy)*.06+(Math.random()-.5)*.25
      f.vx*=0.94;f.vy*=0.94
      f.x+=f.vx;f.y+=f.vy

      // 闪烁
      f.flicker+=.03+Math.random()*.04
      const flickerAlpha=Math.max(.05, .4+Math.sin(f.flicker)*.35+Math.sin(f.flicker*2.7)*.1)

      // 绘制萤火虫光晕
      const glow=f.glow*flickerAlpha
      const g=ctx!.createRadialGradient(f.x,f.y,0,f.x,f.y,glow)
      const h=f.hue;const a=flickerAlpha
      g.addColorStop(0,`hsla(${h},90%,85%,${a})`)
      g.addColorStop(.15,`hsla(${h},80%,65%,${a*.8})`)
      g.addColorStop(.4,`hsla(${h},70%,45%,${a*.35})`)
      g.addColorStop(1,`hsla(${h},60%,30%,0)`)
      ctx!.beginPath();ctx!.arc(f.x,f.y,glow,0,Math.PI*2);ctx!.fillStyle=g;ctx!.fill()

      // 核心亮点
      ctx!.beginPath();ctx!.arc(f.x,f.y,f.r*flickerAlpha,0,Math.PI*2)
      ctx!.fillStyle=`rgba(255,255,200,${a*.9})`;ctx!.fill()
    }

    // 更新目标位置：萤火虫围绕当前活跃照片区域
    const activeCenterX=cx+(currentIndex.value-(N-1)/2)*cw*.08
    const activeCenterY=cy
    fireflies.forEach((f,i)=>{
      const angle=(i/FCOUNT)*Math.PI*2+Date.now()*.0001
      const dist=40+Math.sin(i*.7)*Math.min(cw,ch)*.35+Math.cos(i*1.3+Date.now()*.0003)*60
      f.tx=activeCenterX+Math.cos(angle)*dist
      f.ty=activeCenterY+Math.sin(angle)*dist*.6
    })

    fid=requestAnimationFrame(an)
  }
  fid=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tFire.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tFly.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(headerLineRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupSwarm(){
  if(!scrollRef.value||!trackRef.value||!forestRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const forest=forestRef.value
  const photos=photoRefs.value;const imgs=imgRefs.value
  if(!photos.length)return

  photos.forEach((p,i)=>{
    const z=-i*380
    const x=(i%2===0?-15:15)+'%'
    gsap.set(p,{x,z,rotateY:i%2===0?-6:6,rotateX:-2,scale:.85,opacity:i<=2?1:Math.max(.1,1-(i-2)*.22),filter:'brightness(0.7)'})
    gsap.set(imgs[i],{scale:1})
  })

  const totalZ=(N-1)*380+400
  const mtl=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}},
  })

  mtl.to(forest,{z:totalZ,duration:N,ease:'none'},0)

  photos.forEach((_p,i)=>{
    const moment=i/N;const dur=1/N
    mtl.to(photos[i],{filter:'brightness(1.15)',scale:.95,rotateY:0,rotateX:0,duration:dur*.22,ease:'power2.out'},Math.max(0,moment-dur*.08))
    mtl.to(photos[i],{filter:'brightness(0.7)',scale:.85,rotateY:i%2===0?-6:6,rotateX:-2,duration:dur*.35,ease:'power2.in'},moment+dur*.45)
    if(imgs[i]){mtl.to(imgs[i],{scale:1.06,duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06));mtl.to(imgs[i],{scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)}
  })

  if(progressRef.value)mtl.to(progressRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initFireflies();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupSwarm()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(fid);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;fireflies.length=0})
</script>

<style scoped lang="scss">
.ff-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 40% at 50% 45%,#0a1a08 0%,#050d04 60%,#020502 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.ff-canvas{position:absolute;inset:0;z-index:1}
.ff-scene{position:absolute;inset:0;z-index:2;perspective:900px;perspective-origin:50% 48%;transform-style:preserve-3d;pointer-events:none}
.ff-forest{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.ff-photo{position:absolute;transform-style:preserve-3d;will-change:transform,opacity,filter}
.ff-photo img{width:clamp(180px,28vw,300px);display:block;aspect-ratio:4/5;object-fit:cover;margin-left:calc(clamp(180px,28vw,300px)/-2);margin-top:calc(clamp(225px,36vw,380px)/-2);border-radius:6px;box-shadow:0 8px 40px rgba(0,0,0,.5),0 0 0 3px rgba(255,255,255,.04);will-change:transform}
.ff-photo__glow{position:absolute;inset:-20px;border-radius:12px;background:radial-gradient(ellipse,hsla(80,80%,50%,.08),transparent 70%);pointer-events:none}

.ff-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 55% 45% at 50% 48%,transparent 35%,rgba(2,5,2,.55) 100%)}

.ff-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(100,200,80,.1)}}
.ff-track{position:relative;width:100%}.ff-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}

.ff-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,560px)}
.ff-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(160,210,100,.55);background:rgba(0,0,0,.3);backdrop-filter:blur(6px);border:1px solid rgba(120,180,60,.1);border-radius:999px;padding:.14rem .7rem;margin-bottom:.3rem}
.ff-title{margin:0;display:flex;justify-content:center;gap:.06em}
.ff-title__w{font-size:clamp(1.7rem,4vw,3rem);font-weight:900;color:#b8d890;text-shadow:0 0 12px rgba(140,200,60,.15);will-change:transform,opacity}
.ff-title__w--alt{background:linear-gradient(180deg,#d8f0b0,#80c040,#408020);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ff-line{width:50px;height:1.5px;margin:.2rem auto .25rem;border-radius:2px;background:linear-gradient(90deg,transparent,#68a030,#90d050,transparent);transform-origin:center}
.ff-sub{margin:0;font-size:clamp(.52rem,.76vw,.62rem);color:rgba(140,190,100,.25);line-height:1.4}
.ff-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20}
.ff-info__no{font-size:.6rem;font-weight:300;letter-spacing:.08em;color:rgba(160,200,100,.3);font-family:'Georgia',serif}
.ff-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.ff-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#508020,#80c040,#508020);background-size:200% 100%}
@media(max-width:768px){.ff-photo img{width:140px;margin-left:-70px;margin-top:-105px}.ff-title__w{font-size:1.3rem}}
</style>
