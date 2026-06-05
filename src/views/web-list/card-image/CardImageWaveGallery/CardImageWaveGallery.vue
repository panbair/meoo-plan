<template>
  <section ref="rootRef" class="wg-root">
    <div class="wg-scene" ref="sceneRef">
      <div class="wg-world" ref="worldRef">
        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="wg-card" :ref="(el)=>setCardRef(el,idx)">
          <div class="wg-card__frame">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="wg-card__img" loading="eager" />
          </div>
          <!-- 倒影 -->
          <div class="wg-card__reflect">
            <img :src="frame.image" class="wg-card__reflect-img" />
            <div class="wg-card__reflect-fade"></div>
          </div>
          <!-- 水波纹 -->
          <div class="wg-card__ripple" :ref="(el)=>setRippleRef(el,idx)"></div>
        </div>
      </div>
    </div>

    <!-- 水面光效 -->
    <div class="wg-water-light"></div>
    <div class="wg-vignette"></div>

    <div ref="scrollRef" class="wg-scroll">
      <div ref="trackRef" class="wg-track" :style="{height:trackHeight}">
        <div class="wg-sticky">
          <header ref="headerRef" class="wg-header">
            <span class="wg-kicker">🌊 Wave Gallery · 波浪画廊</span>
            <h1 class="wg-title"><span ref="tw1" class="wg-title__w">波浪</span><span ref="tw2" class="wg-title__w wg-title__w--alt">画廊</span></h1>
            <div ref="hlRef" class="wg-line"></div>
            <p class="wg-sub">向下滚动 · 照片随波浪起伏 · 在潮汐中漂浮荡漾</p>
          </header>
          <div ref="infoRef" class="wg-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="wg-progress"><div ref="progRef" class="wg-progress__fill"></div></div>
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
const trackHeight=`${(N+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const worldRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tw1=ref<HTMLElement|null>(null);const tw2=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const rippleRefs=ref<HTMLElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const setRippleRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)rippleRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tw1.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tw2.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupWave(){
  if(!scrollRef.value||!trackRef.value||!worldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const world=worldRef.value
  const cards=cardRefs.value;const imgs=imgRefs.value;const ripples=rippleRefs.value
  if(!cards.length)return

  const W=window.innerWidth

  // 波浪布局：X正弦错落 + Y正弦起伏 + Z深度 + rotateZ摇摆
  cards.forEach((card,i)=>{
    const xPct=-20+(i/(N-1))*40 // -20% → +20% 均匀展开
    const xPx=(xPct/100)*W
    const yPx=Math.sin(i*1.1)*60 // 正弦波Y偏移 ±60px
    const z=-i*380
    const rz=Math.sin(i*.8)*10 // rotateZ摇摆 ±10°
    gsap.set(card,{x:xPx,y:yPx,z,rotateZ:rz,rotateX:-2,opacity:i<=2?1:Math.max(.12,1-(i-2)*.2),filter:'brightness(0.8)'})
    gsap.set(imgs[i],{scale:1})
    gsap.set(ripples[i],{opacity:.3})
  })

  const totalZ=(N-1)*380+450
  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  mtl.to(world,{z:totalZ,duration:N,ease:'none'},0)

  // 🌊 每张照片的波浪动画：Y轴上下浮动 + rotateZ摇摆 + 倒影波纹
  cards.forEach((_c,i)=>{
    const moment=i/N;const dur=1/N;const phase=i*0.6

    // Y轴正弦浮动
    const baseY=Math.sin(i*1.1)*60
    mtl.to(cards[i],{y:baseY-20,duration:dur*.25,ease:'sine.inOut'},moment)
    mtl.to(cards[i],{y:baseY+25,duration:dur*.3,ease:'sine.inOut'},moment+dur*.3)
    mtl.to(cards[i],{y:baseY-15,duration:dur*.25,ease:'sine.inOut'},moment+dur*.6)
    mtl.to(cards[i],{y:baseY,duration:dur*.2,ease:'sine.inOut'},moment+dur*.8)

    // rotateZ摇摆
    const baseRz=Math.sin(i*.8)*10
    mtl.to(cards[i],{rotateZ:baseRz+8,duration:dur*.3,ease:'sine.inOut'},moment)
    mtl.to(cards[i],{rotateZ:baseRz-6,duration:dur*.35,ease:'sine.inOut'},moment+dur*.35)
    mtl.to(cards[i],{rotateZ:baseRz,duration:dur*.35,ease:'sine.inOut'},moment+dur*.65)

    // 前台提亮
    mtl.to(cards[i],{filter:'brightness(1.15)',duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.08))
    mtl.to(cards[i],{filter:'brightness(0.8)',duration:dur*.3,ease:'power2.in'},moment+dur*.45)

    // 图片微放
    if(imgs[i]){mtl.to(imgs[i],{scale:1.06,duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06));mtl.to(imgs[i],{scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)}

    // 水波纹闪烁
    if(ripples[i]){
      mtl.to(ripples[i],{opacity:.6,scale:1.2,duration:dur*.15,ease:'sine.inOut'},Math.max(0,moment-dur*.05))
      mtl.to(ripples[i],{opacity:.3,scale:1,duration:dur*.25,ease:'sine.inOut'},moment+dur*.15)
    }
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupWave()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.wg-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#0a1620 0%,#0d1c2a 30%,#091420 60%,#060e18 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}

.wg-scene{position:absolute;inset:0;z-index:2;perspective:900px;perspective-origin:50% 45%;transform-style:preserve-3d;pointer-events:none}
.wg-world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.wg-card{position:absolute;transform-style:preserve-3d;will-change:transform,opacity,filter}
.wg-card__frame{width:clamp(150px,24vw,260px);margin-left:calc(clamp(150px,24vw,260px)/-2);margin-top:calc(clamp(190px,30vw,340px)/-2);background:#fcfaf8;border-radius:4px;box-shadow:0 8px 30px rgba(0,0,0,.4),0 0 0 4px #fefcf8,0 0 0 6px rgba(0,0,0,.06);overflow:hidden}
.wg-card__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;padding:7px 7px 0 7px;box-sizing:border-box;will-change:transform}

/* 倒影 */
.wg-card__reflect{position:absolute;top:100%;left:0;width:100%;height:32%;transform:scaleY(-1);overflow:hidden;opacity:.22;pointer-events:none}
.wg-card__reflect-img{width:100%;height:100%;object-fit:cover}
.wg-card__reflect-fade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(9,20,32,.1),rgba(9,20,32,.5) 55%,rgba(9,20,32,1) 100%)}

/* 水波纹 */
.wg-card__ripple{position:absolute;top:100%;left:50%;width:60px;height:60px;margin-left:-30px;margin-top:-30px;border-radius:50%;border:1px solid rgba(100,180,220,.15);pointer-events:none;will-change:opacity,transform}

.wg-water-light{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 50% 30% at 50% 55%,rgba(30,80,120,.08),transparent 70%)}
.wg-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 50% 40% at 50% 48%,transparent 30%,rgba(4,8,14,.5) 100%)}
.wg-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(80,140,200,.08)}}
.wg-track{position:relative;width:100%}.wg-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.wg-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,520px)}
.wg-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(140,190,220,.5);background:rgba(0,0,0,.2);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.05);border-radius:999px;padding:.12rem .65rem;margin-bottom:.28rem}
.wg-title{margin:0;display:flex;justify-content:center;gap:.06em}
.wg-title__w{font-size:clamp(1.6rem,3.8vw,2.8rem);font-weight:900;color:#b8d0e8;will-change:transform,opacity}
.wg-title__w--alt{background:linear-gradient(180deg,#d8e8f8,#6098c8,#2868a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.wg-line{width:45px;height:1.5px;margin:.18rem auto .22rem;background:linear-gradient(90deg,transparent,#4878a8,#78a8d0,transparent)}
.wg-sub{margin:0;font-size:clamp(.5rem,.72vw,.6rem);color:rgba(120,160,200,.25)}
.wg-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.58rem;color:rgba(140,180,210,.28);font-family:'Georgia',serif}
.wg-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.wg-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#2868a0,#58a0d0,#2868a0);background-size:200% 100%}
@media(max-width:768px){.wg-card__frame{width:130px;margin-left:-65px;margin-top:-90px}.wg-title__w{font-size:1.2rem}}
</style>
