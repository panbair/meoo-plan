<template>
  <section ref="rootRef" class="km-root">
    <!-- 悬挂线 -->
    <div class="km-wire" ref="wireRef"></div>

    <!-- 动态平衡装置 -->
    <div class="km-scene" ref="sceneRef">
      <!-- 主横梁 -->
      <div class="km-beam km-beam--main" ref="beamMainRef">
        <div class="km-beam__pivot"></div>
        <!-- 左臂子横梁 -->
        <div class="km-beam km-beam--sub km-beam--sub-l" ref="beamSubLRef">
          <div class="km-beam__pivot"></div>
          <div v-for="(frame,idx) in leftFrames" :key="frame.id"
            class="km-card km-card--left" :ref="(el)=>setCardRef(el,idx)"
            :style="leftCardStyle(idx)">
            <img :src="frame.image" :alt="frame.alt" class="km-card__img" loading="eager" />
            <div class="km-card__string"></div>
          </div>
        </div>
        <!-- 右臂子横梁 -->
        <div class="km-beam km-beam--sub km-beam--sub-r" ref="beamSubRRef">
          <div class="km-beam__pivot"></div>
          <div v-for="(frame,idx) in rightFrames" :key="frame.id"
            class="km-card km-card--right" :ref="(el)=>setCardRefR(el,idx)"
            :style="rightCardStyle(idx)">
            <img :src="frame.image" :alt="frame.alt" class="km-card__img" loading="eager" />
            <div class="km-card__string"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="km-vignette"></div>
    <div ref="scrollRef" class="km-scroll">
      <div ref="trackRef" class="km-track" :style="{height:trackHeight}">
        <div class="km-sticky">
          <header ref="headerRef" class="km-header">
            <span class="km-kicker">🎪 Kinetic Mobile · 动态平衡</span>
            <h1 class="km-title"><span ref="tK" class="km-title__w">动态</span><span ref="tM" class="km-title__w km-title__w--alt">平衡</span></h1>
            <div ref="hlRef" class="km-line"></div>
            <p class="km-sub">向下滚动 · 如同Calder动态雕塑 · 照片在平衡臂上旋转摆动</p>
          </header>
          <div ref="infoRef" class="km-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="km-progress"><div ref="progRef" class="km-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {onMounted,onUnmounted,ref,computed} from 'vue'
import {gsap} from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TweenCleanup=()=>void

interface Frame{id:string;title:string;image:string;alt:string}
const frames:Frame[]=[
  {id:'aurora',title:'极光',image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80',alt:'极光'},
  {id:'ocean',title:'海浪',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',alt:'海浪'},
  {id:'mountains',title:'远山',image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',alt:'远山'},
  {id:'flowers',title:'繁花',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',alt:'繁花'},
  {id:'desert',title:'沙漠',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',alt:'沙漠'},
  {id:'forest',title:'森林',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',alt:'森林'},
  {id:'valley',title:'峡谷',image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',alt:'峡谷'},
  {id:'sunrise',title:'日出',image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',alt:'日出'},
]
const N=frames.length;const trackHeight=`${(N+1)*100}vh`
const leftFrames=computed(()=>frames.filter((_,i)=>i%2===0))
const rightFrames=computed(()=>frames.filter((_,i)=>i%2===1))
function leftCardStyle(idx:number):Record<string,string>{const x=-(80+idx*70);return{left:`${x}px`,bottom:'-180px'}}
function rightCardStyle(idx:number):Record<string,string>{const x=30+idx*70;return{left:`${x}px`,bottom:'-180px'}}

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const beamMainRef=ref<HTMLElement|null>(null);const beamSubLRef=ref<HTMLElement|null>(null)
const beamSubRRef=ref<HTMLElement|null>(null);const wireRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tK=ref<HTMLElement|null>(null);const tM=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const cardRefsR=ref<HTMLElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setCardRefR=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefsR.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tK.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tM.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupMobile(){
  if(!scrollRef.value||!trackRef.value)return
  const sc=scrollRef.value;const track=trackRef.value
  const main=beamMainRef.value;const subL=beamSubLRef.value;const subR=beamSubRRef.value;const wire=wireRef.value
  if(!main||!subL||!subR)return

  gsap.set(sceneRef.value,{autoAlpha:1})

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.25,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 🎪 多层旋转动画 — 模拟动态平衡装置的复杂运动
  // 主梁：缓慢摇摆 ±8°
  mtl.to(main,{rotation:-8,duration:N*.3,ease:'sine.inOut'},0)
  mtl.to(main,{rotation:6,duration:N*.35,ease:'sine.inOut'},N*.3)
  mtl.to(main,{rotation:-4,duration:N*.35,ease:'sine.inOut'},N*.65)

  // 左子梁：在父梁基础上叠加旋转
  mtl.to(subL,{rotation:-15,duration:N*.25,ease:'sine.inOut'},0)
  mtl.to(subL,{rotation:12,duration:N*.3,ease:'sine.inOut'},N*.25)
  mtl.to(subL,{rotation:-8,duration:N*.25,ease:'sine.inOut'},N*.55)
  mtl.to(subL,{rotation:0,duration:N*.2,ease:'sine.inOut'},N*.8)

  // 右子梁：反向旋转
  mtl.to(subR,{rotation:12,duration:N*.25,ease:'sine.inOut'},0)
  mtl.to(subR,{rotation:-15,duration:N*.3,ease:'sine.inOut'},N*.25)
  mtl.to(subR,{rotation:6,duration:N*.25,ease:'sine.inOut'},N*.55)
  mtl.to(subR,{rotation:0,duration:N*.2,ease:'sine.inOut'},N*.8)

  // 悬挂线摇摆
  if(wire){mtl.to(wire,{rotation:-3,duration:N*.4,ease:'sine.inOut'},0);mtl.to(wire,{rotation:2,duration:N*.35,ease:'sine.inOut'},N*.4);mtl.to(wire,{rotation:0,duration:N*.25,ease:'sine.inOut'},N*.75)}

  // 微升降
  if(sceneRef.value){mtl.to(sceneRef.value,{y:-15,duration:N*.3,ease:'sine.inOut'},0);mtl.to(sceneRef.value,{y:10,duration:N*.4,ease:'sine.inOut'},N*.35);mtl.to(sceneRef.value,{y:0,duration:N*.3,ease:'sine.inOut'},N*.7)}

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupMobile()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.km-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#f8f4ec 0%,#f0e8d8 30%,#f5f0e4 60%,#ebe0d0 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.km-wire{position:absolute;top:0;left:50%;width:1px;height:12vh;background:linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.2));transform-origin:top center;z-index:5;pointer-events:none;will-change:transform}
.km-scene{position:absolute;top:9vh;left:50%;width:0;height:0;z-index:2;will-change:transform}
.km-beam{position:absolute;transform-origin:top center;will-change:transform}
.km-beam--main{top:0;left:-3px;width:6px;height:200px;background:linear-gradient(to bottom,rgba(0,0,0,.15),rgba(0,0,0,.25));border-radius:3px}
.km-beam--sub{position:absolute;bottom:0;width:3px;background:linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.2));border-radius:2px;transform-origin:top center}
.km-beam--sub-l{left:-100px;height:120px}.km-beam--sub-r{left:80px;height:140px}
.km-beam__pivot{position:absolute;top:-4px;left:50%;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:rgba(0,0,0,.3);border:1px solid rgba(0,0,0,.15)}
.km-card{position:absolute;will-change:transform}
.km-card__img{width:clamp(80px,12vw,140px);display:block;aspect-ratio:4/5;object-fit:cover;border-radius:3px;box-shadow:0 4px 15px rgba(0,0,0,.2),0 0 0 3px #fcfaf6}
.km-card__string{position:absolute;bottom:100%;left:50%;width:1px;height:20px;background:rgba(0,0,0,.12)}

.km-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 50% 35% at 50% 40%,transparent 40%,rgba(200,190,170,.35) 100%)}
.km-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(0,0,0,.06)}}
.km-track{position:relative;width:100%}.km-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.km-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,460px)}
.km-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(100,80,60,.4);background:rgba(255,255,255,.3);backdrop-filter:blur(6px);border:1px solid rgba(0,0,0,.05);border-radius:999px;padding:.1rem .55rem;margin-bottom:.2rem}
.km-title{margin:0;display:flex;justify-content:center;gap:.05em}
.km-title__w{font-size:clamp(1.4rem,3.2vw,2.4rem);font-weight:900;color:#5a4028;will-change:transform,opacity}
.km-title__w--alt{background:linear-gradient(180deg,#8a6840,#5a3820,#3a2010);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.km-line{width:35px;height:1.5px;margin:.14rem auto .18rem;background:linear-gradient(90deg,transparent,#6a4a28,#8a6040,transparent)}
.km-sub{margin:0;font-size:clamp(.46rem,.64vw,.56rem);color:rgba(100,80,50,.2)}
.km-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.52rem;color:rgba(120,90,50,.25);font-family:'Georgia',serif}
.km-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(0,0,0,.02)}
.km-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#5a3820,#8a6040,#5a3820);background-size:200% 100%}
</style>
