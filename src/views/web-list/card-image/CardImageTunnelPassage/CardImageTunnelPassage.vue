<template>
  <section ref="rootRef" class="tp-root">
    <!-- 隧道壁纹理 -->
    <div class="tp-tunnel-bg"></div>

    <div class="tp-scene" ref="sceneRef">
      <div class="tp-world" ref="worldRef">
        <!-- 左侧墙壁照片 -->
        <div v-for="(frame,idx) in frames" :key="'l-'+frame.id"
          class="tp-card tp-card--left" :ref="(el)=>setCardRef(el,idx)"
          :style="{z:(-idx*CARD_GAP)+'px'}">
          <div class="tp-card__inner">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="tp-card__img" loading="eager" />
          </div>
          <!-- 壁灯光晕 -->
          <div class="tp-card__light"></div>
        </div>
        <!-- 右侧墙壁照片 -->
        <div v-for="(frame,idx) in frames" :key="'r-'+frame.id"
          class="tp-card tp-card--right" :ref="(el)=>setCardRefR(el,idx)"
          :style="{z:(-idx*CARD_GAP-200)+'px'}">
          <div class="tp-card__inner">
            <img :src="frame.image" :alt="frame.alt" class="tp-card__img" loading="eager" />
          </div>
          <div class="tp-card__light"></div>
        </div>
      </div>
    </div>

    <div class="tp-vignette"></div>

    <div ref="scrollRef" class="tp-scroll">
      <div ref="trackRef" class="tp-track" :style="{height:trackHeight}">
        <div class="tp-sticky">
          <header ref="headerRef" class="tp-header">
            <span class="tp-kicker">🚇 Tunnel Passage · 隧道长廊</span>
            <h1 class="tp-title"><span ref="tT" class="tp-title__w">隧道</span><span ref="tP" class="tp-title__w tp-title__w--alt">长廊</span></h1>
            <div ref="hlRef" class="tp-line"></div>
            <p class="tp-sub">向下滚动 · 穿越两侧挂满照片的地下长廊</p>
          </header>
          <div ref="infoRef" class="tp-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="tp-progress"><div ref="progRef" class="tp-progress__fill"></div></div>
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
const N=frames.length
const CARD_GAP=380;const trackHeight=`${(N+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const worldRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tT=ref<HTMLElement|null>(null);const tP=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const cardRefsR=ref<HTMLElement[]>([])
const imgRefs=ref<HTMLImageElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setCardRefR=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefsR.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tT.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tP.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupTunnel(){
  if(!scrollRef.value||!trackRef.value||!worldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const world=worldRef.value
  const leftCards=cardRefs.value;const rightCards=cardRefsR.value;const imgs=imgRefs.value
  if(!leftCards.length)return

  // 初始化
  leftCards.forEach((card,i)=>{gsap.set(card,{opacity:i<=2?1:Math.max(.1,1-(i-2)*.22),filter:'brightness(0.7)'})})
  rightCards.forEach((card,i)=>{gsap.set(card,{opacity:i<=2?1:Math.max(.1,1-(i-2)*.22),filter:'brightness(0.7)'})})
  imgs.forEach((img,i)=>{gsap.set(img,{scale:1})})

  const totalZ=(N-1)*CARD_GAP+400
  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 穿越隧道
  mtl.to(world,{z:totalZ,duration:N,ease:'none'},0)

  // 左右墙壁照片逐对亮起
  leftCards.forEach((_c,i)=>{
    const moment=i/N;const dur=1/N
    // 左侧
    mtl.to(leftCards[i],{filter:'brightness(1.2)',duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06))
    mtl.to(leftCards[i],{filter:'brightness(0.7)',duration:dur*.3,ease:'power2.in'},moment+dur*.4)
    // 右侧
    mtl.to(rightCards[i],{filter:'brightness(1.2)',duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.03))
    mtl.to(rightCards[i],{filter:'brightness(0.7)',duration:dur*.3,ease:'power2.in'},moment+dur*.42)
    // 图片微放
    if(imgs[i]){mtl.to(imgs[i],{scale:1.06,duration:dur*.18,ease:'power2.out'},Math.max(0,moment-dur*.04));mtl.to(imgs[i],{scale:1,duration:dur*.28,ease:'power2.in'},moment+dur*.36)}
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupTunnel()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.tp-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 40% 35% at 50% 45%,#181818 0%,#0a0a0a 70%,#020202 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.tp-tunnel-bg{position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.4) 0%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 75%,rgba(0,0,0,.4) 100%)}
.tp-scene{position:absolute;inset:0;z-index:2;perspective:800px;perspective-origin:50% 50%;transform-style:preserve-3d;pointer-events:none}
.tp-world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}

/* 隧道墙壁照片 */
.tp-card{position:absolute;transform-style:preserve-3d;will-change:opacity,filter}
.tp-card--left{transform:translateX(-38vw) rotateY(22deg)}
.tp-card--right{transform:translateX(38vw) rotateY(-22deg)}
.tp-card__inner{width:clamp(120px,18vw,200px);margin-left:calc(clamp(120px,18vw,200px)/-2);margin-top:calc(clamp(150px,22vw,250px)/-2);background:#faf8f5;border-radius:3px;box-shadow:0 6px 20px rgba(0,0,0,.5),0 0 0 2px #fcfaf8;overflow:hidden}
.tp-card__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;padding:4px 4px 0 4px;box-sizing:border-box;will-change:transform}
.tp-card__light{position:absolute;inset:-15px;pointer-events:none;background:radial-gradient(ellipse,rgba(255,200,100,.06),transparent 60%)}

.tp-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 35% 30% at 50% 50%,transparent 20%,rgba(0,0,0,.6) 100%)}
.tp-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.05)}}
.tp-track{position:relative;width:100%}.tp-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.tp-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,480px)}
.tp-kicker{display:inline-block;font-size:.52rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(180,180,180,.4);background:rgba(0,0,0,.3);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.04);border-radius:999px;padding:.1rem .6rem;margin-bottom:.25rem}
.tp-title{margin:0;display:flex;justify-content:center;gap:.05em}
.tp-title__w{font-size:clamp(1.5rem,3.5vw,2.6rem);font-weight:900;color:#c8c8c8;will-change:transform,opacity}
.tp-title__w--alt{background:linear-gradient(180deg,#f0f0f0,#888,#444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.tp-line{width:40px;height:1.5px;margin:.16rem auto .2rem;background:linear-gradient(90deg,transparent,#666,#999,transparent)}
.tp-sub{margin:0;font-size:clamp(.48rem,.68vw,.58rem);color:rgba(150,150,150,.18)}
.tp-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.55rem;color:rgba(170,170,170,.22);font-family:'Georgia',serif}
.tp-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.tp-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#444,#888,#444);background-size:200% 100%}
</style>
