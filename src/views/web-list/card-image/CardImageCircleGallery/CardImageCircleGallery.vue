<template>
  <section ref="rootRef" class="cg-root">
    <div class="cg-floor"></div>

    <div class="cg-scene" ref="sceneRef">
      <div class="cg-carousel" ref="carouselRef">
        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="cg-card"
          :ref="(el)=>setCardRef(el,idx)"
          :style="{transform:`rotateY(${idx*ANGLE}deg) translateZ(${RADIUS}px)`}"
        >
          <div class="cg-card__inner">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="cg-card__img" loading="eager" />
          </div>
          <div class="cg-card__reflect">
            <img :src="frame.image" class="cg-card__reflect-img" />
            <div class="cg-card__reflect-fade"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中心指示 -->
    <div class="cg-center">
      <div class="cg-center__ring cg-center__ring--1"></div>
      <div class="cg-center__ring cg-center__ring--2"></div>
      <div class="cg-center__dot"></div>
    </div>

    <div class="cg-vignette"></div>

    <div ref="scrollRef" class="cg-scroll">
      <div ref="trackRef" class="cg-track" :style="{height:trackHeight}">
        <div class="cg-sticky">
          <header ref="headerRef" class="cg-header">
            <span class="cg-kicker">⭕ Circle Gallery · 圆形展厅</span>
            <h1 class="cg-title"><span ref="tC" class="cg-title__w">圆形</span><span ref="tG" class="cg-title__w cg-title__w--alt">展厅</span></h1>
            <div ref="hlRef" class="cg-line"></div>
            <p class="cg-sub">向下滚动 · 环形展台旋转 · 照片环绕四周依次呈现</p>
          </header>
          <div ref="infoRef" class="cg-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="cg-progress"><div ref="progRef" class="cg-progress__fill"></div></div>
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
const ANGLE=360/N // 45°
const RADIUS=420 // px
const trackHeight=`${(N+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const carouselRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tC=ref<HTMLElement|null>(null);const tG=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tC.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tG.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupCarousel(){
  if(!scrollRef.value||!trackRef.value||!carouselRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const carousel=carouselRef.value
  const imgs=imgRefs.value
  if(!imgs.length)return

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 圆环绕Y轴旋转360°
  mtl.to(carousel,{rotationY:360,duration:N,ease:'none'},0)

  // 每张照片到前台时微放大
  imgs.forEach((_img,i)=>{
    const moment=i/N;const dur=1/N
    mtl.to(imgs[i],{scale:1.08,duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06))
    mtl.to(imgs[i],{scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupCarousel()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.cg-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 45% at 50% 45%,#1a1820 0%,#0e0c14 60%,#060408 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.cg-floor{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 50% 30% at 50% 55%,rgba(60,50,80,.15),transparent 70%)}

.cg-scene{position:absolute;inset:0;z-index:2;perspective:1000px;perspective-origin:50% 45%;transform-style:preserve-3d;pointer-events:none}
.cg-carousel{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}

/* 环形排列的卡片 */
.cg-card{position:absolute;transform-style:preserve-3d;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.cg-card__inner{width:clamp(140px,22vw,240px);margin-left:calc(clamp(140px,22vw,240px)/-2);margin-top:calc(clamp(175px,28vw,310px)/-2);background:#faf8f6;border-radius:3px;box-shadow:0 8px 30px rgba(0,0,0,.4),0 0 0 3px #fefcf8,0 0 0 5px rgba(0,0,0,.06);overflow:hidden}
.cg-card__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;padding:6px 6px 0 6px;box-sizing:border-box;will-change:transform}
.cg-card__reflect{position:absolute;top:100%;left:0;width:100%;height:28%;transform:scaleY(-1);overflow:hidden;opacity:.2;pointer-events:none}
.cg-card__reflect-img{width:100%;height:100%;object-fit:cover}
.cg-card__reflect-fade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(14,12,20,.1),rgba(14,12,20,.5) 55%,rgba(14,12,20,1) 100%)}

/* 中心标记 */
.cg-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;pointer-events:none}
.cg-center__ring{position:absolute;top:50%;left:50%;border-radius:50%;border:1px solid rgba(255,255,255,.08);transform:translate(-50%,-50%);&--1{width:80px;height:80px}&--2{width:50px;height:50px;border-color:rgba(255,255,255,.12)}}
.cg-center__dot{position:absolute;top:50%;left:50%;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:rgba(255,255,255,.4)}

.cg-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 50% 40% at 50% 48%,transparent 30%,rgba(4,2,8,.5) 100%)}
.cg-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.06)}}
.cg-track{position:relative;width:100%}.cg-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.cg-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,500px)}
.cg-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(180,170,210,.5);background:rgba(0,0,0,.2);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.05);border-radius:999px;padding:.12rem .65rem;margin-bottom:.28rem}
.cg-title{margin:0;display:flex;justify-content:center;gap:.06em}
.cg-title__w{font-size:clamp(1.6rem,3.8vw,2.8rem);font-weight:900;color:#c8c0e0;will-change:transform,opacity}
.cg-title__w--alt{background:linear-gradient(180deg,#e8e0f8,#9080c0,#5040a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.cg-line{width:45px;height:1.5px;margin:.18rem auto .22rem;background:linear-gradient(90deg,transparent,#7060a0,#a090d0,transparent)}
.cg-sub{margin:0;font-size:clamp(.5rem,.72vw,.6rem);color:rgba(160,150,200,.25)}
.cg-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.58rem;color:rgba(180,170,210,.3);font-family:'Georgia',serif}
.cg-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.cg-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#5040a0,#8070c0,#5040a0);background-size:200% 100%}
@media(max-width:768px){.cg-card__inner{width:120px;margin-left:-60px;margin-top:-85px}.cg-title__w{font-size:1.2rem}}
</style>
