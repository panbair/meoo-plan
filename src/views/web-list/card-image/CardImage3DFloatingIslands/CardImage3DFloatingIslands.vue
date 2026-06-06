<template>
  <section ref="rootRef" class="fi-root">
    <div ref="skyGrad" class="fi-sky"></div>
    <div ref="cloudA" class="fi-cloud fi-cloud--a"></div>
    <div ref="cloudB" class="fi-cloud fi-cloud--b"></div>
    <div ref="cloudC" class="fi-cloud fi-cloud--c"></div>

    <div ref="scrollRef" class="fi-scroll">
      <div ref="trackRef" class="fi-track" :style="{ height: trackHeight }">
        <div class="fi-sticky">

          <header ref="headerRef" class="fi-header">
            <span class="fi-kicker">🏝 CSS3 3D Floating Islands · 浮空岛屿 ◈</span>
            <h1 class="fi-title">
              <span ref="tc1" class="fi-title__c">浮</span>
              <span ref="tc2" class="fi-title__c fi-title__c--float">空</span>
              <span ref="tc3" class="fi-title__c">岛</span>
              <span ref="tc4" class="fi-title__c fi-title__c--float">屿</span>
            </h1>
            <div ref="lineRef" class="fi-line"></div>
            <p class="fi-sub">向下滚动 · 图片如浮空岛屿在不同Z深度悬浮 · 云海穿行 · 上下微动</p>
          </header>

          <div ref="sceneRef" class="fi-scene">
            <div ref="archRef" class="fi-arch">
              <!-- 12座浮空岛 -->
              <div
                v-for="island in islands"
                :key="island.id"
                :ref="(el)=>setIslandRef(el as HTMLElement, island.id)"
                class="fi-island"
                :class="[`fi-island--size${island.size}`]"
              >
                <!-- 岛面图片 -->
                <div class="fi-island__plate">
                  <img :src="island.image" :alt="island.alt" class="fi-island__img" />
                  <div class="fi-island__grass"></div>
                </div>
                <!-- 岛底锥形 -->
                <div class="fi-island__base"></div>
                <!-- 悬浮阴影 -->
                <div class="fi-island__float-shadow"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="fi-info">
            <span class="fi-info__icon">🏝</span>
            <span class="fi-info__text">海拔 {{ altitude }}m</span>
          </div>

          <div class="fi-progress"><div ref="progRef" class="fi-progress__fill"></div></div>
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

const ISLAND_COUNT = 12
const trackHeight = `${8 * 100}vh`

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
]

// 浮空岛 — 散布在3D空间
const islands = Array.from({ length: ISLAND_COUNT }, (_, i) => {
  const size = (i % 3) + 1  // 1=小 2=中 3=大
  return {
    id: i, size,
    x: (i - ISLAND_COUNT / 2) * 70 + (Math.random() * 40 - 20),
    y: (i % 4 - 1.5) * 60 + (Math.random() * 30 - 15),
    z: -i * 120 - Math.random() * 60,
    image: imgPool[i % imgPool.length],
    alt: `浮岛${i}`,
    floatAmp: 8 + Math.random() * 16, // 上下浮动幅度
    floatSpeed: 0.8 + Math.random() * 1.5,
  }
})

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const archRef=ref<HTMLElement|null>(null)
const skyGrad=ref<HTMLElement|null>(null);const cloudA=ref<HTMLElement|null>(null);const cloudB=ref<HTMLElement|null>(null);const cloudC=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const altitude=ref(0)
const islandRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setIslandRef(el:HTMLElement|null,idx:number){islandRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:80,filter:'blur(14px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-20,scale:.6},{autoAlpha:1,rotateX:-8,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupFloatingIslands(){
  if(!scrollRef.value||!trackRef.value||!archRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=islandRefs.value.filter(Boolean) as HTMLElement[]
  const arch=archRef.value

  // 初始定位
  els.forEach((el,i)=>{
    const isl=islands[i]
    gsap.set(el,{x:isl.x,y:isl.y,translateZ:isl.z,scale:.7+(1-i*.05),opacity:.35+(1-i*.06)})
  })
  if(arch)gsap.set(arch,{rotateX:-8})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){altitude.value=Math.round(self.progress*1000)},
    },
  })

  const totalDist=ISLAND_COUNT*120*.75

  // 🏝 所有浮岛向相机推进（穿越云海）
  els.forEach((el,i)=>{
    const isl=islands[i]
    master.fromTo(el,
      {translateZ:isl.z,scale:.7+(1-i*.05),opacity:.35+(1-i*.06)},
      {translateZ:isl.z+totalDist,scale:1.1,opacity:.9,duration:7,ease:'power2.in'},
      0
    )
    // 上下浮动
    for(let w=0;w<6;w++){
      master.to(el,{y:isl.y-isl.floatAmp,duration:isl.floatSpeed*.5,ease:'sine.inOut'},w*isl.floatSpeed*.5)
      master.to(el,{y:isl.y+isl.floatAmp,duration:isl.floatSpeed*.5,ease:'sine.inOut'},(w+.5)*isl.floatSpeed*.5)
    }
  })

  if(arch){master.to(arch,{rotateY:20,rotateX:-4,duration:3.5,ease:'sine.inOut'},0);master.to(arch,{rotateY:-15,rotateX:-10,duration:3.5,ease:'sine.inOut'},3.5)}
  if(skyGrad.value)master.to(skyGrad.value,{opacity:.8,duration:7},0)
  if(cloudA.value)master.to(cloudA.value,{x:'8vw',opacity:.5,duration:7},0)
  if(cloudB.value)master.to(cloudB.value,{x:'-5vw',opacity:.4,duration:7},0)
  if(cloudC.value)master.to(cloudC.value,{y:'-3vh',opacity:.35,duration:7},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:7},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupFloatingIslands()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.fi-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(180deg,#c8e0f0 0%,#d8e8f4 20%,#e0ecf6 40%,#d0e0f0 70%,#b8d4e8 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.fi-sky{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 50% 30%,rgba(255,255,255,.6) 0%,transparent 60%);will-change:opacity;opacity:.5}
.fi-cloud{position:absolute;border-radius:50%;pointer-events:none;z-index:0;will-change:transform,opacity;filter:blur(40px);
  &--a{width:35vw;height:18vw;top:15vh;left:10vw;background:rgba(255,255,255,.6)}&--b{width:28vw;height:14vw;top:40vh;right:5vw;background:rgba(255,255,255,.5)}&--c{width:22vw;height:12vw;top:55vh;left:25vw;background:rgba(255,255,255,.45)}
}
.fi-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(140,180,200,.2)}}
.fi-track{position:relative;width:100%}.fi-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.fi-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.fi-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(100,160,200,.7);background:rgba(200,230,255,.4);backdrop-filter:blur(8px);border:1px solid rgba(150,200,230,.25);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.fi-title{margin:0;display:flex;justify-content:center;gap:.08em}
.fi-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#60a0c8;will-change:transform,opacity;&--float{background:linear-gradient(135deg,#60a0c8,#80c8e0,#50a0d0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(80,160,210,.4))}}
.fi-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#60a0c8,#80c8e0,#50a0d0,transparent);transform-origin:center}
.fi-sub{margin:0;font-size:clamp(.62rem,.88vw,.76rem);color:rgba(80,140,190,.35);max-width:550px;margin-inline:auto}
.fi-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:650px;perspective-origin:50% 50%;will-change:transform,opacity}
.fi-arch{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.fi-island{position:absolute;transform-style:preserve-3d;will-change:transform,opacity;
  &__plate{position:relative;border-radius:50%;overflow:hidden;box-shadow:0 6px 30px rgba(0,0,0,.12);background:#f8f6f0}
  &__img{display:block;object-fit:cover}
  &__grass{position:absolute;top:0;left:0;right:0;height:8px;background:linear-gradient(180deg,rgba(100,180,80,.3),transparent);pointer-events:none}
  &__base{position:absolute;bottom:-20px;left:15%;width:70%;height:20px;background:linear-gradient(180deg,rgba(140,100,60,.5),rgba(100,70,40,.2));border-radius:50%;transform:rotateX(70deg);transform-origin:top;filter:blur(2px)}
  &__float-shadow{position:absolute;bottom:-40px;left:10%;width:80%;height:12px;background:radial-gradient(ellipse,rgba(0,0,0,.08) 0%,transparent 70%);border-radius:50%;transform:rotateX(80deg)}

  &--size1{.fi-island__plate{width:min(14vw,110px);height:min(10vw,80px);margin-left:calc(min(14vw,110px)/-2);margin-top:calc(min(10vw,80px)/-2)}.fi-island__img{width:100%;height:100%}}
  &--size2{.fi-island__plate{width:min(18vw,145px);height:min(13vw,105px);margin-left:calc(min(18vw,145px)/-2);margin-top:calc(min(13vw,105px)/-2)}.fi-island__img{width:100%;height:100%}}
  &--size3{.fi-island__plate{width:min(22vw,180px);height:min(16vw,130px);margin-left:calc(min(22vw,180px)/-2);margin-top:calc(min(16vw,130px)/-2)}.fi-island__img{width:100%;height:100%}}
}

.fi-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.fi-info__icon{font-size:.9rem}.fi-info__text{font-size:.6rem;font-weight:600;color:rgba(80,150,200,.6);letter-spacing:.1em}
.fi-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(100,160,200,.05)}
.fi-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#60a0c8,#80c8e0,#50a0d0,#60a0c8);background-size:200% 100%;box-shadow:0 0 10px rgba(80,160,210,.5)}
@media(max-width:768px){.fi-header{top:2vh}.fi-kicker{font-size:.4rem;padding:.1rem .4rem}.fi-title__c{font-size:1.3rem}}
</style>
