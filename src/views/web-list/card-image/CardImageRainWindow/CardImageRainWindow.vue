<template>
  <section ref="rootRef" class="rw-root">
    <!-- 雨滴画布 -->
    <canvas ref="rainCanvasRef" class="rw-rain"></canvas>

    <!-- 窗内照片 -->
    <div class="rw-scene" ref="sceneRef">
      <div class="rw-world" ref="worldRef">
        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="rw-photo" :ref="(el)=>setPhotoRef(el,idx)">
          <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
            class="rw-photo__img" loading="eager" />
        </div>
      </div>
    </div>

    <!-- 窗框+玻璃反光 -->
    <div class="rw-window">
      <div class="rw-window__frame"></div>
      <div class="rw-window__glare"></div>
    </div>
    <div class="rw-vignette"></div>

    <div ref="scrollRef" class="rw-scroll">
      <div ref="trackRef" class="rw-track" :style="{height:trackHeight}">
        <div class="rw-sticky">
          <header ref="headerRef" class="rw-header">
            <span class="rw-kicker">🌧 Rain Window · 雨窗画廊</span>
            <h1 class="rw-title"><span ref="tR" class="rw-title__w">雨窗</span><span ref="tW" class="rw-title__w rw-title__w--alt">画廊</span></h1>
            <div ref="hlRef" class="rw-line"></div>
            <p class="rw-sub">向下滚动 · 透过雨痕斑驳的玻璃窗 · 欣赏窗外的风景</p>
          </header>
          <div ref="infoRef" class="rw-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="rw-progress"><div ref="progRef" class="rw-progress__fill"></div></div>
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
const worldRef=ref<HTMLElement|null>(null);const rainCanvasRef=ref<HTMLCanvasElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tR=ref<HTMLElement|null>(null);const tW=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const photoRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setPhotoRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)photoRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

// 🌧 雨滴系统
interface RainDrop{x:number;y:number;vy:number;len:number;r:number;a:number;life:number;ml:number}
interface RainStreak{x:number;y:number;w:number;h:number;a:number;life:number;ml:number}
let rctx:CanvasRenderingContext2D|null=null;let cw=0,ch=0
const drops:RainDrop[]=[];const streaks:RainStreak[]=[];let rid=0

function initRain(){
  const c=rainCanvasRef.value;if(!c)return;rctx=c.getContext('2d');if(!rctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))

  function an(){
    if(!rctx)return;rctx.clearRect(0,0,cw,ch)

    // 生成新雨滴
    if(Math.random()<.7){drops.push({x:Math.random()*cw,y:-10,vy:4+Math.random()*8,len:8+Math.random()*20,r:.5+Math.random()*1,a:.15+Math.random()*.3,life:0,ml:40+Math.random()*80})}
    if(Math.random()<.15){streaks.push({x:Math.random()*cw,y:Math.random()*ch*.6,w:1+Math.random()*2,h:20+Math.random()*50,a:.04+Math.random()*.08,life:0,ml:100+Math.random()*300})}

    // 雨滴下落
    for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.life++;if(d.life>=d.ml||d.y>ch+20){drops.splice(i,1);continue}d.y+=d.vy;const t=d.life/d.ml,f=t<.05?t/.05:t>.7?1-(t-.7)/.3:1;rctx!.strokeStyle=`rgba(180,200,220,${d.a*f})`;rctx!.lineWidth=d.r;rctx!.beginPath();rctx!.moveTo(d.x,d.y);rctx!.lineTo(d.x,d.y-d.len);rctx!.stroke()}

    // 水痕
    for(let i=streaks.length-1;i>=0;i--){const s=streaks[i];s.life++;if(s.life>=s.ml){streaks.splice(i,1);continue}const t=s.life/s.ml,f=t<.08?t/.08:t>.6?1-(t-.6)/.4:1;rctx!.fillStyle=`rgba(160,190,210,${s.a*f})`;rctx!.fillRect(s.x,s.y,s.w,s.h)}

    // 水珠凝结
    for(let i=0;i<8;i++){const x=Math.random()*cw;const y=Math.random()*ch;const rr=.3+Math.random()*1.5;rctx!.beginPath();rctx!.arc(x,y,rr,0,Math.PI*2);rctx!.fillStyle=`rgba(200,215,225,${.03+Math.random()*.06})`;rctx!.fill()}

    rid=requestAnimationFrame(an)
  }
  rid=requestAnimationFrame(an)
}

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tR.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tW.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupRainWindow(){
  if(!scrollRef.value||!trackRef.value||!worldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const world=worldRef.value
  const photos=photoRefs.value;const imgs=imgRefs.value
  if(!photos.length)return

  photos.forEach((p,i)=>{
    const z=-i*400
    gsap.set(p,{z,opacity:i<=2?1:Math.max(.1,1-(i-2)*.22),filter:'brightness(0.6) blur(2px)'})
    gsap.set(imgs[i],{scale:1})
  })

  const totalZ=(N-1)*400+450
  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  mtl.to(world,{z:totalZ,duration:N,ease:'none'},0)

  photos.forEach((_p,i)=>{
    const moment=i/N;const dur=1/N
    // 雨停→清晰
    mtl.to(photos[i],{filter:'brightness(1.1) blur(0px)',duration:dur*.25,ease:'power2.out'},Math.max(0,moment-dur*.08))
    mtl.to(photos[i],{filter:'brightness(0.6) blur(2px)',duration:dur*.35,ease:'power2.in'},moment+dur*.45)
    if(imgs[i]){mtl.to(imgs[i],{scale:1.05,duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06));mtl.to(imgs[i],{scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)}
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{initRain();await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupRainWindow()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(rid);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;drops.length=0;streaks.length=0})
</script>

<style scoped lang="scss">
.rw-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#1a2028 0%,#242e38 30%,#1c242c 60%,#141c22 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.rw-rain{position:absolute;inset:0;z-index:3;pointer-events:none}
.rw-scene{position:absolute;inset:0;z-index:1;perspective:800px;perspective-origin:50% 50%;transform-style:preserve-3d;pointer-events:none}
.rw-world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}
.rw-photo{position:absolute;transform-style:preserve-3d;will-change:opacity,filter}
.rw-photo img{width:clamp(240px,38vw,420px);display:block;aspect-ratio:4/5;object-fit:cover;margin-left:calc(clamp(240px,38vw,420px)/-2);margin-top:calc(clamp(300px,48vw,530px)/-2);border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.4);will-change:transform}

/* 窗户 */
.rw-window{position:absolute;inset:0;z-index:4;pointer-events:none}
.rw-window__frame{position:absolute;inset:10px;border:6px solid rgba(30,35,40,.8);border-radius:0;box-shadow:inset 0 0 0 2px rgba(0,0,0,.3),0 0 0 10px rgba(20,24,28,.6)}
.rw-window__glare{position:absolute;inset:16px;background:linear-gradient(135deg,rgba(255,255,255,.04) 0%,transparent 30%,transparent 60%,rgba(200,220,240,.06) 80%,rgba(255,255,255,.02) 100%)}

.rw-vignette{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse 50% 40% at 50% 50%,transparent 30%,rgba(10,14,18,.45) 100%)}
.rw-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:5;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.06)}}
.rw-track{position:relative;width:100%}.rw-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.rw-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,480px)}
.rw-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(160,190,210,.4);background:rgba(0,0,0,.2);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.04);border-radius:999px;padding:.1rem .6rem;margin-bottom:.22rem}
.rw-title{margin:0;display:flex;justify-content:center;gap:.05em}
.rw-title__w{font-size:clamp(1.5rem,3.5vw,2.6rem);font-weight:900;color:#c0d0e0;will-change:transform,opacity}
.rw-title__w--alt{background:linear-gradient(180deg,#d8e8f8,#6898c0,#3870a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.rw-line{width:40px;height:1.5px;margin:.16rem auto .2rem;background:linear-gradient(90deg,transparent,#5888b0,#80a8d0,transparent)}
.rw-sub{margin:0;font-size:clamp(.48rem,.68vw,.58rem);color:rgba(120,160,200,.18)}
.rw-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.55rem;color:rgba(140,180,210,.22);font-family:'Georgia',serif}
.rw-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.rw-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#4078a8,#68a0d0,#4078a8);background-size:200% 100%}
</style>
