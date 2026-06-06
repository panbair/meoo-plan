<template>
  <section ref="rootRef" class="pr-root">
    <div ref="centerLight" class="pr-center"></div>
    <div ref="ringGlow" class="pr-ring"></div>

    <div ref="scrollRef" class="pr-scroll">
      <div ref="trackRef" class="pr-track" :style="{ height: trackHeight }">
        <div class="pr-sticky">

          <header ref="headerRef" class="pr-header">
            <span class="pr-kicker">🔭 CSS3 3D Panorama Ring · 全景环廊 ◈</span>
            <h1 class="pr-title">
              <span ref="tc1" class="pr-title__c">全</span><span ref="tc2" class="pr-title__c pr-title__c--ring">景</span>
              <span ref="tc3" class="pr-title__c">环</span><span ref="tc4" class="pr-title__c pr-title__c--ring">廊</span>
            </h1>
            <div ref="lineRef" class="pr-line"></div>
            <p class="pr-sub">向下滚动 · 12幅图环绕360° · 你站在圆心环顾 · 舒适间距 · 全景视野</p>
          </header>

          <div ref="sceneRef" class="pr-scene">
            <div ref="panoramaRef" class="pr-panorama">
              <div v-for="(view, idx) in views" :key="idx"
                :ref="(el)=>setViewRef(el as HTMLElement, idx)"
                class="pr-view"
              >
                <img :src="view.image" :alt="view.title" class="pr-view__img" />
                <span class="pr-view__label">{{ view.title }}</span>
              </div>
              <!-- 中心指示台 -->
              <div ref="podestRef" class="pr-podest">
                <div class="pr-podest__top"></div>
                <div class="pr-podest__pillar"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="pr-info">
            <span class="pr-info__dot"></span><span class="pr-info__text">{{ views[currentView]?.title }} · {{ currentView+1 }}/12</span>
          </div>
          <div class="pr-progress"><div ref="progRef" class="pr-progress__fill"></div></div>
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

const VIEW_COUNT = 12
const RING_R = 300
const trackHeight = `${8*100}vh`

const views = [
  {title:'海滩',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80'},
  {title:'山谷',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80'},
  {title:'星空',image:'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80'},
  {title:'森林',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80'},
  {title:'花海',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80'},
  {title:'麦田',image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80'},
  {title:'极光',image:'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&q=80'},
  {title:'银河',image:'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80'},
  {title:'海面',image:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80'},
  {title:'沙漠',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80'},
  {title:'雪山',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80'},
  {title:'星云',image:'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80'},
]

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const panoramaRef=ref<HTMLElement|null>(null);const podestRef=ref<HTMLElement|null>(null)
const centerLight=ref<HTMLElement|null>(null);const ringGlow=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const currentView=ref(0)
const viewRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setViewRef(el:HTMLElement|null,idx:number){viewRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,rotateY:90,scale:.3},{autoAlpha:1,rotateY:0,scale:1,duration:.7,stagger:.12,ease:'back.out(2.2)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,scale:.4},{autoAlpha:1,scale:1,duration:1,ease:'power4.out'},'-.4')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupPanoramaRing(){
  if(!scrollRef.value||!trackRef.value||!panoramaRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=viewRefs.value.filter(Boolean) as HTMLElement[]
  const pano=panoramaRef.value

  // 🔭 12幅图环绕360°排列
  els.forEach((el,i)=>{
    const angle = (i/VIEW_COUNT)*Math.PI*2
    const x = Math.cos(angle)*RING_R
    const z = Math.sin(angle)*RING_R
    const ry = -angle*180/Math.PI+90 // 面向圆心
    gsap.set(el,{x,translateZ:z,rotateY:ry})
  })
  if(pano)gsap.set(pano,{rotateX:0})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){currentView.value=Math.floor(((self.progress*VIEW_COUNT*3)%VIEW_COUNT))},
    },
  })

  // 环廊旋转 — 观众在中心环顾四周
  els.forEach((el,i)=>{
    const startAngle = (i/VIEW_COUNT)*Math.PI*2
    const endAngle = startAngle + Math.PI*4 // 转2圈
    const sx=Math.cos(startAngle)*RING_R,sz=Math.sin(startAngle)*RING_R
    const ex=Math.cos(endAngle)*RING_R,ez=Math.sin(endAngle)*RING_R
    const sry=-startAngle*180/Math.PI+90,ery=-endAngle*180/Math.PI+90
    master.fromTo(el,{x:sx,translateZ:sz,rotateY:sry},{x:ex,translateZ:ez,rotateY:ery,duration:VIEW_COUNT,ease:'sine.inOut'},0)
  })

  // 整体轻微俯仰
  if(pano){master.to(pano,{rotateX:5,duration:4,ease:'sine.inOut'},0);master.to(pano,{rotateX:-4,duration:4,ease:'sine.inOut'},4)}
  if(centerLight.value)master.to(centerLight.value,{scale:1.3,opacity:.5,duration:8},0)
  if(ringGlow.value)master.to(ringGlow.value,{rotate:60,opacity:.3,duration:8},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:8},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupPanoramaRing()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.pr-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#141820 0%,#0a0c14 60%,#040408 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.pr-center{position:absolute;width:18vw;height:18vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(180,200,220,.08) 0%,transparent 55%);filter:blur(50px);pointer-events:none;z-index:0;will-change:transform,opacity}
.pr-ring{position:absolute;width:50vw;height:50vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(180,200,220,.03);pointer-events:none;z-index:0;will-change:transform,opacity}
.pr-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(160,180,200,.1)}}
.pr-track{position:relative;width:100%}.pr-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.pr-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.pr-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(180,200,220,.7);background:rgba(120,160,200,.08);backdrop-filter:blur(8px);border:1px solid rgba(140,180,210,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.pr-title{margin:0;display:flex;justify-content:center;gap:.08em}
.pr-title__c{display:inline-block;font-size:clamp(1.8rem,4.5vw,3.8rem);font-weight:900;color:#b0c8e0;will-change:transform,opacity;&--ring{background:linear-gradient(135deg,#b0c8e0,#80a8d0,#d0e0f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 12px rgba(160,190,220,.4))}}
.pr-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#b0c8e0,#80a8d0,#d0e0f0,transparent)}
.pr-sub{margin:0;font-size:clamp(.58rem,.82vw,.7rem);color:rgba(150,180,210,.3);max-width:550px;margin-inline:auto}
.pr-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 50%;will-change:transform,opacity}
.pr-panorama{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.pr-view{position:absolute;width:min(18vw,150px);height:min(22vw,185px);margin-left:calc(min(18vw,150px) / -2);margin-top:calc(min(22vw,185px) / -2);transform-style:preserve-3d;will-change:transform;border-radius:4px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,.3);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__label{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);font-size:.46rem;font-weight:600;color:#fff;background:rgba(0,0,0,.35);backdrop-filter:blur(4px);border-radius:3px;padding:.1rem .5rem;letter-spacing:.08em;text-shadow:0 1px 3px rgba(0,0,0,.4)}
}

.pr-podest{position:absolute;width:0;height:0;transform-style:preserve-3d;
  &__top{position:absolute;width:40px;height:40px;margin-left:-20px;margin-top:-20px;border-radius:50%;background:radial-gradient(circle,rgba(180,200,220,.3),rgba(120,140,160,.15));transform:rotateX(80deg)}
  &__pillar{position:absolute;width:3px;height:60px;margin-left:-1px;background:linear-gradient(180deg,rgba(180,200,220,.2),rgba(120,140,160,.05))}
}

.pr-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.pr-info__dot{width:6px;height:6px;border-radius:50%;background:#b0c8e0;box-shadow:0 0 12px rgba(160,190,220,.5);animation:pr-pulse 2s ease-in-out infinite}
@keyframes pr-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2);opacity:.5}}
.pr-info__text{font-size:.6rem;font-weight:600;color:rgba(170,200,220,.6);letter-spacing:.06em}
.pr-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(140,180,210,.05)}
.pr-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#b0c8e0,#80a8d0,#d0e0f0,#b0c8e0);background-size:200% 100%;box-shadow:0 0 10px rgba(160,190,220,.4)}
@media(max-width:768px){.pr-header{top:2vh}.pr-kicker{font-size:.38rem;padding:.1rem .4rem}.pr-title__c{font-size:1.2rem}}
</style>
