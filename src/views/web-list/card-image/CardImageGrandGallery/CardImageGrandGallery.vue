<template>
  <section ref="rootRef" class="gg-root">
    <!-- 🌫 深度雾 -->
    <div class="gg-fog"></div>

    <!-- 🏛 博物馆建筑 -->
    <div class="gg-scene" ref="sceneRef">
      <!-- 天花板 -->
      <div class="gg-ceiling">
        <!-- 轨道射灯 -->
        <div v-for="n in 6" :key="'light-'+n" class="gg-track-light"
          :style="{left:`${10+n*14}%`,z:`${-n*400}px`}">
          <div class="gg-track-light__cone"></div>
          <div class="gg-track-light__bulb"></div>
        </div>
      </div>

      <!-- 左侧墙壁 -->
      <div class="gg-wall gg-wall--left"></div>
      <!-- 右侧墙壁 -->
      <div class="gg-wall gg-wall--right"></div>

      <!-- 大理石地板 -->
      <div class="gg-floor">
        <div class="gg-floor__tile"></div>
        <div class="gg-floor__gloss"></div>
      </div>

      <!-- 展品世界 -->
      <div class="gg-world" ref="worldRef">
        <!-- 照片展台 -->
        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="gg-exhibit" :ref="(el)=>setExhibitRef(el,idx)">
          <!-- 展台底座 -->
          <div class="gg-exhibit__pedestal">
            <div class="gg-exhibit__pedestal-top"></div>
            <div class="gg-exhibit__pedestal-body"></div>
          </div>
          <!-- 照片 -->
          <div class="gg-exhibit__frame">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="gg-exhibit__img" loading="eager" />
            <!-- 博物馆标签 -->
            <div class="gg-exhibit__plaque">
              <span class="gg-exhibit__plaque-num">{{ String(idx+1).padStart(2,'0') }}</span>
              <span class="gg-exhibit__plaque-title">{{ frame.title }}</span>
            </div>
          </div>
          <!-- 聚光灯效果 -->
          <div class="gg-exhibit__spot"></div>
          <!-- 地板倒影 -->
          <div class="gg-exhibit__reflect">
            <img :src="frame.image" class="gg-exhibit__reflect-img" />
            <div class="gg-exhibit__reflect-fade"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 光尘粒子 -->
    <canvas ref="canvasRef" class="gg-dust"></canvas>
    <div class="gg-vignette"></div>

    <div ref="scrollRef" class="gg-scroll">
      <div ref="trackRef" class="gg-track" :style="{height:trackHeight}">
        <div class="gg-sticky">
          <header ref="headerRef" class="gg-header">
            <span class="gg-kicker">🏛 Grand Gallery · 大画廊</span>
            <h1 class="gg-title"><span ref="tG" class="gg-title__w">大</span><span ref="tA" class="gg-title__w gg-title__w--alt">画廊</span></h1>
            <div ref="hlRef" class="gg-line"></div>
            <p class="gg-sub">向下滚动 · 漫步博物馆大厅 · 轨道灯照亮每一件展品</p>
          </header>
          <div ref="infoRef" class="gg-info">
            <span class="gg-info__no">EXHIBIT {{ String(currentIndex+1).padStart(2,'0') }}</span>
            <h3>{{ frames[currentIndex]?.title }}</h3>
          </div>
          <div class="gg-progress"><div ref="progRef" class="gg-progress__fill"></div></div>
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
const N=frames.length;const trackHeight=`${(N+2)*100}vh` // 更长的滚动距离

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const worldRef=ref<HTMLElement|null>(null);const canvasRef=ref<HTMLCanvasElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tG=ref<HTMLElement|null>(null);const tA=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const exhibitRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setExhibitRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)exhibitRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

// 光尘粒子
interface Dust{x:number;y:number;vx:number;vy:number;r:number;a:number;l:number;ml:number}
let ctx:CanvasRenderingContext2D|null=null;let cw=0,ch=0;const dusts:Dust[]=[];let did=0
function initDust(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<80;i++)dusts.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*.3,vy:-Math.random()*.4-.1,r:.3+Math.random()*1.2,a:.1+Math.random()*.3,l:0,ml:150+Math.random()*300})
  function an(){if(!ctx)return;ctx.clearRect(0,0,cw,ch);if(dusts.length<80&&Math.random()<.5)dusts.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*.3,vy:-Math.random()*.4-.1,r:.3+Math.random()*1.2,a:.1+Math.random()*.3,l:0,ml:150+Math.random()*300})
    for(let i=dusts.length-1;i>=0;i--){const d=dusts[i];d.l++;if(d.l>=d.ml){dusts.splice(i,1);continue}d.x+=d.vx;d.y+=d.vy;const t=d.l/d.ml,f=t<.08?t/.08:t>.7?1-(t-.7)/.3:1;ctx!.beginPath();ctx!.arc(d.x,d.y,d.r,0,Math.PI*2);ctx!.fillStyle=`rgba(255,240,210,${d.a*f})`;ctx!.fill()}did=requestAnimationFrame(an)}
  did=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tG.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tA.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupGrandGallery(){
  if(!scrollRef.value||!trackRef.value||!worldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const world=worldRef.value
  const exhibits=exhibitRefs.value;const imgs=imgRefs.value
  if(!exhibits.length)return

  // 🏛 展品排列：Z轴深入 + X轴微弧线 + Y轴随机微差
  exhibits.forEach((ex,i)=>{
    const z=-i*450
    const curveX=Math.sin(i*.35)*60 // S曲线弧度
    const wallSide=i%3===0?'left':i%3===1?'right':'center'
    const x=wallSide==='left'?-200:wallSide==='right'?200:curveX
    gsap.set(ex,{x,z,rotateY:wallSide==='left'?8:wallSide==='right'?-8:0,opacity:i<=2?1:Math.max(.08,1-(i-2)*.18),filter:'brightness(0.6) blur(1px)'})
    gsap.set(imgs[i],{scale:1})
  })

  const totalZ=(N-1)*450+500
  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.25,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 🎥 摄像机路径：Z轴推进 + X轴S曲线摆动
  mtl.to(world,{z:totalZ,duration:N,ease:'none'},0)
  mtl.to(world,{x:40,duration:N*.25,ease:'sine.inOut'},0)
  mtl.to(world,{x:-50,duration:N*.3,ease:'sine.inOut'},N*.25)
  mtl.to(world,{x:30,duration:N*.25,ease:'sine.inOut'},N*.55)
  mtl.to(world,{x:0,duration:N*.2,ease:'sine.inOut'},N*.8)

  // 🖼 每件展品到达前台时
  exhibits.forEach((_ex,i)=>{
    const moment=i/N;const dur=1/N
    // 前台：亮度恢复 + 清晰 + 标签亮起
    mtl.to(exhibits[i],{filter:'brightness(1.12) blur(0px)',rotateY:0,duration:dur*.22,ease:'power2.out'},Math.max(0,moment-dur*.08))
    mtl.to(exhibits[i],{filter:'brightness(0.6) blur(1px)',rotateY:i%3===0?8:i%3===1?-8:0,duration:dur*.35,ease:'power2.in'},moment+dur*.45)
    if(imgs[i]){mtl.to(imgs[i],{scale:1.06,duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06));mtl.to(imgs[i],{scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)}
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initDust();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupGrandGallery()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(did);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;dusts.length=0})
</script>

<style scoped lang="scss">
.gg-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#0d0d12;font-family:'Inter','PingFang SC',system-ui,sans-serif}

/* 🌫 深度雾 — 远处展品自然融入雾中 */
.gg-fog{position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(to bottom,rgba(14,14,20,0) 30%,rgba(14,14,20,.4) 60%,rgba(14,14,20,.8) 100%)}

/* 🏛 建筑环境 */
.gg-scene{position:absolute;inset:0;z-index:2;perspective:900px;perspective-origin:50% 45%;transform-style:preserve-3d;pointer-events:none}

/* 天花板 */
.gg-ceiling{position:absolute;top:0;left:0;width:100%;height:15vh;background:linear-gradient(to bottom,rgba(20,20,28,.9),rgba(16,16,22,.6),transparent);transform:rotateX(5deg);transform-origin:top}
.gg-track-light{position:absolute;top:2vh;transform:translateX(-50%);pointer-events:none}
.gg-track-light__cone{width:6px;height:30px;background:linear-gradient(to bottom,rgba(255,240,200,.4),rgba(255,220,150,.15),transparent);margin:0 auto;border-radius:3px;filter:blur(2px)}
.gg-track-light__bulb{width:8px;height:8px;border-radius:50%;background:#fff8e0;margin:-2px auto 0;box-shadow:0 0 10px rgba(255,240,200,.6),0 0 30px rgba(255,200,100,.3)}

/* 墙壁 */
.gg-wall{position:absolute;top:15vh;height:55vh;width:8vw;background:linear-gradient(180deg,rgba(25,25,32,.7),rgba(18,18,24,.5));pointer-events:none}
.gg-wall--left{left:0;transform:rotateY(8deg);transform-origin:left}
.gg-wall--right{right:0;transform:rotateY(-8deg);transform-origin:right}

/* 大理石地板 */
.gg-floor{position:absolute;bottom:0;left:0;width:100%;height:35vh;pointer-events:none}
.gg-floor__tile{position:absolute;inset:0;background:linear-gradient(170deg,rgba(30,28,35,.5) 0%,rgba(22,20,28,.3) 40%,rgba(28,26,33,.4) 100%);background-image:repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,.015) 40px,rgba(255,255,255,.015) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,.015) 40px,rgba(255,255,255,.015) 41px)}
.gg-floor__gloss{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(255,255,240,.03) 0%,rgba(255,255,240,.06) 15%,rgba(255,255,240,.02) 30%,transparent 60%)}

/* 🖼 展品世界 */
.gg-world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}
.gg-exhibit{position:absolute;transform-style:preserve-3d;will-change:transform,opacity,filter}

/* 展台底座 */
.gg-exhibit__pedestal{position:absolute;top:calc(clamp(300px,48vw,530px)/2 + 30px);left:50%;transform:translateX(-50%);pointer-events:none}
.gg-exhibit__pedestal-top{width:clamp(80px,12vw,140px);height:4px;background:rgba(200,200,210,.5);margin:0 auto;border-radius:2px}
.gg-exhibit__pedestal-body{width:clamp(50px,8vw,100px);height:60px;background:linear-gradient(to bottom,rgba(180,180,190,.3),rgba(140,140,150,.15));margin:0 auto;border-radius:2px}

/* 照片框 */
.gg-exhibit__frame{width:clamp(180px,28vw,320px);margin-left:calc(clamp(180px,28vw,320px)/-2);margin-top:calc(clamp(240px,38vw,430px)/-2);background:#fcfaf8;border-radius:4px;box-shadow:0 12px 40px rgba(0,0,0,.5),0 0 0 5px #fefcf8,0 0 0 8px rgba(0,0,0,.15),0 0 0 9px rgba(180,160,120,.3);overflow:hidden}
.gg-exhibit__img{width:100%;display:block;aspect-ratio:3/4;object-fit:cover;padding:10px 10px 0 10px;box-sizing:border-box;will-change:transform}

/* 博物馆标签 */
.gg-exhibit__plaque{position:absolute;bottom:-50px;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap}
.gg-exhibit__plaque-num{display:block;font-size:.45rem;font-weight:300;letter-spacing:.2em;color:rgba(200,190,160,.4);font-family:'Georgia',serif}
.gg-exhibit__plaque-title{display:block;font-size:.55rem;font-weight:400;color:rgba(200,190,160,.5);letter-spacing:.06em;margin-top:2px;font-family:'Georgia',serif}

/* 聚光灯 */
.gg-exhibit__spot{position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:clamp(220px,35vw,400px);height:150px;background:radial-gradient(ellipse at center,rgba(255,240,200,.08),transparent 70%);pointer-events:none}

/* 地板倒影 */
.gg-exhibit__reflect{position:absolute;top:100%;left:0;width:100%;height:30%;transform:scaleY(-1);overflow:hidden;opacity:.18;pointer-events:none}
.gg-exhibit__reflect-img{width:100%;height:100%;object-fit:cover}
.gg-exhibit__reflect-fade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(13,13,18,.2),rgba(13,13,18,.6) 55%,rgba(13,13,18,1) 100%)}

/* 光尘 */
.gg-dust{position:absolute;inset:0;z-index:3;pointer-events:none}
.gg-vignette{position:absolute;inset:0;z-index:4;pointer-events:none;background:radial-gradient(ellipse 45% 35% at 50% 48%,transparent 30%,rgba(8,8,12,.5) 100%)}
.gg-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.05)}}
.gg-track{position:relative;width:100%}.gg-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.gg-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,520px)}
.gg-kicker{display:inline-block;font-size:.52rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(200,180,140,.45);background:rgba(0,0,0,.3);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.06);border-radius:999px;padding:.12rem .7rem;margin-bottom:.25rem}
.gg-title{margin:0;display:flex;justify-content:center;gap:.06em}
.gg-title__w{font-size:clamp(1.6rem,3.8vw,2.8rem);font-weight:900;color:#d8c8a0;text-shadow:0 0 12px rgba(200,160,80,.15);will-change:transform,opacity}
.gg-title__w--alt{background:linear-gradient(180deg,#f0e4c8,#c8a060,#886030);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.gg-line{width:50px;height:1.5px;margin:.2rem auto .25rem;background:linear-gradient(90deg,transparent,#a08040,#c8a860,transparent)}
.gg-sub{margin:0;font-size:clamp(.5rem,.72vw,.6rem);color:rgba(180,150,100,.2);max-width:340px;margin-inline:auto}
.gg-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center}
.gg-info__no{font-size:.5rem;font-weight:300;letter-spacing:.15em;color:rgba(200,180,140,.25);font-family:'Georgia',serif}
.gg-info h3{margin:.1rem 0 0;font-size:.65rem;font-weight:500;color:rgba(200,180,140,.35)}
.gg-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.gg-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#886030,#c8a860,#886030);background-size:200% 100%}
@media(max-width:768px){.gg-exhibit__frame{width:150px;margin-left:-75px;margin-top:-110px}.gg-title__w{font-size:1.3rem}}
</style>
