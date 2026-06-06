<template>
  <section ref="rootRef" class="cw-root">
    <div ref="wallWash" class="cw-wash"></div>

    <div ref="scrollRef" class="cw-scroll">
      <div ref="trackRef" class="cw-track" :style="{ height: trackHeight }">
        <div class="cw-sticky">

          <header ref="headerRef" class="cw-header">
            <span class="cw-kicker">🖼 CSS3 3D Cascade Wall · 瀑布画廊 ◈</span>
            <h1 class="cw-title">
              <span ref="tc1" class="cw-title__c">瀑</span><span ref="tc2" class="cw-title__c cw-title__c--cascade">布</span>
              <span ref="tc3" class="cw-title__c">画</span><span ref="tc4" class="cw-title__c cw-title__c--cascade">廊</span>
            </h1>
            <div ref="lineRef" class="cw-line"></div>
            <p class="cw-sub">向下滚动 · 3列×4行图片瀑布墙 · 整齐格栅 · 舒适间距 · 一目了然</p>
          </header>

          <div ref="sceneRef" class="cw-scene">
            <div ref="wallRef" class="cw-wall">
              <div v-for="frame in frames" :key="frame.id"
                :ref="(el)=>setFrameRef(el as HTMLElement, frame.id-1)"
                class="cw-frame" :class="[`cw-frame--c${frame.col}`,`cw-frame--r${frame.row}`]"
              >
                <div class="cw-frame__mat">
                  <img :src="frame.image" :alt="frame.title" class="cw-frame__img" />
                </div>
                <div class="cw-frame__caption">{{ frame.title }}</div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="cw-info">
            <span class="cw-info__dot"></span><span class="cw-info__text">{{ frames[currentFrame]?.title }}</span>
          </div>
          <div class="cw-progress"><div ref="progRef" class="cw-progress__fill"></div></div>
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

const COLS=3,ROWS=4,TOTAL=COLS*ROWS
const trackHeight=`${(ROWS+3)*100}vh`

const titles = ['海滩','山谷','星空','森林','花海','麦田','极光','银河','海面','沙漠','雪山','星云']
const images = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80',
]

const frames = Array.from({length:TOTAL},(_,i)=>({
  id:i+1,col:(i%COLS)+1,row:Math.floor(i/COLS)+1,
  title:titles[i],image:images[i],
}))

const currentFrame=ref(0)
const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const wallRef=ref<HTMLElement|null>(null)
const wallWash=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const frameRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setFrameRef(el:HTMLElement|null,idx:number){frameRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:80,filter:'blur(16px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.6,stagger:.1,ease:'power3.out'},'-.4')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  // 画框从墙中弹出
  const els=frameRefs.value.filter(Boolean) as HTMLElement[]
  if(els.length)tl.fromTo(els,{autoAlpha:0,scale:.6,translateZ:-60},{autoAlpha:1,scale:1,translateZ:0,duration:.5,stagger:.05,ease:'back.out(1.5)'},'-.5')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupCascadeWall(){
  if(!scrollRef.value||!trackRef.value||!wallRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const wall=wallRef.value

  // 初始：3D墙面微倾
  if(wall)gsap.set(wall,{rotateX:5,rotateY:-8})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){currentFrame.value=Math.min(TOTAL-1,Math.max(0,Math.floor(self.progress*TOTAL)))},
    },
  })

  // 🖼 墙面在3D空间中缓慢变换视角 — 从左看到右，从上看到下
  if(wall){
    master.to(wall,{rotateX:5,rotateY:-8,duration:1},0)
    master.to(wall,{rotateX:-3,rotateY:8,duration:3,ease:'sine.inOut'},1)
    master.to(wall,{rotateX:2,rotateY:-5,duration:3,ease:'sine.inOut'},4)
    master.to(wall,{rotateX:-5,rotateY:3,duration:2,ease:'sine.inOut'},7)
  }

  if(wallWash.value)master.to(wallWash.value,{opacity:.5,duration:ROWS+2},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:ROWS+2},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupCascadeWall()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.cw-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(165deg,#1a1816 0%,#201c18 20%,#1c1a16 40%,#221e1a 60%,#181614 80%,#1a1816 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.cw-wash{position:absolute;width:50vw;height:40vh;top:20vh;left:25vw;border-radius:50%;background:radial-gradient(ellipse,rgba(255,200,140,.06) 0%,transparent 60%);filter:blur(50px);pointer-events:none;z-index:0;will-change:opacity;opacity:.3}
.cw-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(200,150,100,.1)}}
.cw-track{position:relative;width:100%}.cw-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.cw-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.cw-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.28em;color:rgba(220,170,80,.7);background:rgba(180,120,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(200,140,60,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.cw-title{margin:0;display:flex;justify-content:center;gap:.08em}
.cw-title__c{display:inline-block;font-size:clamp(1.8rem,4.5vw,3.8rem);font-weight:900;color:#d0a850;will-change:transform,opacity;&--cascade{background:linear-gradient(135deg,#e0b860,#c89030,#f0d070);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 12px rgba(220,170,60,.4))}}
.cw-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#e0b860,#c89030,#f0d070,transparent)}
.cw-sub{margin:0;font-size:clamp(.58rem,.82vw,.7rem);color:rgba(200,150,60,.3);max-width:530px;margin-inline:auto}
.cw-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:900px;perspective-origin:50% 50%;will-change:transform,opacity}
.cw-wall{transform-style:preserve-3d;will-change:transform;display:grid;grid-template-columns:repeat(3,min(20vw,170px));grid-template-rows:repeat(4,min(16vw,135px));gap:min(3vw,24px);width:max-content;margin-left:calc(min(60vw,510px) / -2 - min(3vw,24px));margin-top:calc(min(64vw,540px) / -2 - min(3vw,24px))}

.cw-frame{transform-style:preserve-3d;will-change:transform,opacity;border-radius:3px;
  &__mat{position:relative;width:100%;height:100%;border-radius:3px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.25),0 0 0 6px #faf6f0,0 0 0 8px #c8b898,0 0 0 12px #faf6f0}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__caption{position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);font-size:.46rem;font-weight:500;color:rgba(200,160,100,.6);letter-spacing:.08em;white-space:nowrap}
}

.cw-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.cw-info__dot{width:6px;height:6px;border-radius:50%;background:#d0a850;box-shadow:0 0 12px rgba(220,170,60,.5);animation:cw-pulse 2s ease-in-out infinite}
@keyframes cw-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2);opacity:.5}}
.cw-info__text{font-size:.6rem;font-weight:600;color:rgba(220,170,60,.6);letter-spacing:.06em}
.cw-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(200,140,40,.05)}
.cw-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#e0b860,#c89030,#f0d070,#e0b860);background-size:200% 100%;box-shadow:0 0 10px rgba(220,170,60,.4)}
@media(max-width:768px){.cw-header{top:2vh}.cw-kicker{font-size:.38rem;padding:.1rem .4rem}.cw-title__c{font-size:1.2rem}.cw-wall{grid-template-columns:repeat(3,min(22vw,120px));grid-template-rows:repeat(4,min(18vw,100px));gap:min(2vw,16px)}}
</style>
