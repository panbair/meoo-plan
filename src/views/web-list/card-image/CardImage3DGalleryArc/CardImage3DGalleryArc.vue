<template>
  <section ref="rootRef" class="ga-root">
    <div ref="softLight" class="ga-light"></div>

    <div ref="scrollRef" class="ga-scroll">
      <div ref="trackRef" class="ga-track" :style="{ height: trackHeight }">
        <div class="ga-sticky">

          <header ref="headerRef" class="ga-header">
            <span class="ga-kicker">🏛 CSS3 3D Gallery Arc · 弧形画廊 ◈</span>
            <h1 class="ga-title">
              <span ref="tc1" class="ga-title__c">弧</span><span ref="tc2" class="ga-title__c ga-title__c--arc">形</span>
              <span ref="tc3" class="ga-title__c">画</span><span ref="tc4" class="ga-title__c ga-title__c--arc">廊</span>
            </h1>
            <div ref="lineRef" class="ga-line"></div>
            <p class="ga-sub">向下滚动 · 8幅作品沿优雅弧线等距排列 · 移步换景 · 舒适间距</p>
          </header>

          <div ref="sceneRef" class="ga-scene">
            <div ref="arcRef" class="ga-arc">
              <div v-for="(art, idx) in artworks" :key="idx"
                :ref="(el)=>setArtRef(el as HTMLElement, idx)"
                class="ga-art" :class="[`ga-art--p${idx}`]"
              >
                <!-- 画框 -->
                <div class="ga-art__frame">
                  <img :src="art.image" :alt="art.title" class="ga-art__img" />
                  <div class="ga-art__mat"></div>
                </div>
                <!-- 标签牌 -->
                <div class="ga-art__plaque">
                  <span class="ga-art__num">{{ String(idx+1).padStart(2,'0') }}</span>
                  <span class="ga-art__title">{{ art.title }}</span>
                </div>
                <!-- 地面投影 -->
                <div class="ga-art__floor-shadow"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="ga-info">
            <span class="ga-info__dot"></span><span class="ga-info__text">{{ artworks[currentArt]?.title }}</span>
          </div>
          <div class="ga-progress"><div ref="progRef" class="ga-progress__fill"></div></div>
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

const ART_COUNT = 8
const ARC_RADIUS = 320
const ARC_SPAN = 130 // 弧线跨度(度)
const trackHeight = `${(ART_COUNT+2)*100}vh`

const artworks = [
  { title:'晨曦海滩', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80' },
  { title:'山谷暮光', image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80' },
  { title:'璀璨星河', image:'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80' },
  { title:'密林深处', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80' },
  { title:'繁花似锦', image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80' },
  { title:'金色麦浪', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80' },
  { title:'极光之舞', image:'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=500&q=80' },
  { title:'银河拱桥', image:'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&q=80' },
]

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const arcRef=ref<HTMLElement|null>(null)
const softLight=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const currentArt=ref(0)
const artRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setArtRef(el:HTMLElement|null,idx:number){artRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:100,filter:'blur(16px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-15,scale:.5},{autoAlpha:1,rotateX:-3,scale:1,duration:1,ease:'power4.out'},'-.4')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupGalleryArc(){
  if(!scrollRef.value||!trackRef.value||!arcRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=artRefs.value.filter(Boolean) as HTMLElement[]
  const arc=arcRef.value

  // 🏛 8幅画沿弧线等距排列
  els.forEach((el,i)=>{
    const t = i/(ART_COUNT-1) // 0→1
    const angle = (t-.5)*ARC_SPAN * Math.PI/180 // 弧度
    const x = Math.sin(angle)*ARC_RADIUS
    const z = -Math.cos(angle)*ARC_RADIUS + ARC_RADIUS*.3 // Z轴沿弧线
    const scale = .85 + .15 * Math.cos(angle) // 中间的最清晰
    gsap.set(el,{x,translateZ:z,rotateY:angle*180/Math.PI,scale,opacity:.7+.3*Math.cos(angle)})
  })
  if(arc)gsap.set(arc,{rotateX:-3})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){currentArt.value=Math.min(ART_COUNT-1,Math.max(0,Math.round(self.progress*(ART_COUNT-1))))},
    },
  })

  // 沿弧线浏览 — 所有画绕Y轴旋转（模拟走过弧线）
  const totalRotation = ARC_SPAN * 1.1
  els.forEach((el,i)=>{
    const t = i/(ART_COUNT-1)
    const startAngle = (t-.5)*ARC_SPAN
    const endAngle = startAngle - totalRotation
    const startRad = startAngle*Math.PI/180, endRad = endAngle*Math.PI/180
    const sx = Math.sin(startRad)*ARC_RADIUS, sz = -Math.cos(startRad)*ARC_RADIUS+ARC_RADIUS*.3
    const ex = Math.sin(endRad)*ARC_RADIUS, ez = -Math.cos(endRad)*ARC_RADIUS+ARC_RADIUS*.3
    master.fromTo(el,{x:sx,translateZ:sz,rotateY:startAngle},{x:ex,translateZ:ez,rotateY:endAngle,duration:ART_COUNT,ease:'sine.inOut'},0)
  })

  // 视角微调
  if(arc){master.to(arc,{rotateX:-3,duration:1},0);master.to(arc,{rotateX:4,rotateY:8,duration:ART_COUNT*.5,ease:'sine.inOut'},1);master.to(arc,{rotateX:-2,rotateY:-6,duration:ART_COUNT*.5,ease:'sine.inOut'},ART_COUNT*.5+1)}
  if(softLight.value)master.to(softLight.value,{opacity:.6,duration:ART_COUNT},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:ART_COUNT},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupGalleryArc()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ga-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#1c1814 0%,#221c16 20%,#1e1a14 40%,#241e18 60%,#1a1612 80%,#1c1814 100%);font-family:'Inter','PingFang SC','Microsoft YaHei','Georgia',serif}
.ga-light{position:absolute;width:45vw;height:30vw;top:15vh;left:27vw;border-radius:50%;background:radial-gradient(ellipse,rgba(255,210,150,.08) 0%,transparent 60%);filter:blur(70px);pointer-events:none;z-index:0;will-change:opacity;opacity:.4}
.ga-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(200,150,100,.12)}}
.ga-track{position:relative;width:100%}.ga-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ga-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.ga-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(220,170,80,.7);background:rgba(180,120,40,.1);backdrop-filter:blur(8px);border:1px solid rgba(200,140,60,.18);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.ga-title{margin:0;display:flex;justify-content:center;gap:.08em}
.ga-title__c{display:inline-block;font-size:clamp(1.8rem,4.5vw,3.8rem);font-weight:900;color:#d0a850;will-change:transform,opacity;&--arc{background:linear-gradient(135deg,#e0b860,#c89030,#f0d070);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 12px rgba(220,170,60,.4))}}
.ga-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#e0b860,#c89030,#f0d070,transparent)}
.ga-sub{margin:0;font-size:clamp(.58rem,.82vw,.7rem);color:rgba(200,150,60,.3);max-width:540px;margin-inline:auto}
.ga-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:800px;perspective-origin:50% 50%;will-change:transform,opacity}
.ga-arc{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.ga-art{position:absolute;width:min(22vw,190px);height:min(28vw,240px);margin-left:calc(min(22vw,190px) / -2);margin-top:calc(min(28vw,240px) / -2);transform-style:preserve-3d;will-change:transform,opacity;
  &__frame{position:relative;width:100%;height:100%;border-radius:3px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.3),0 0 0 8px #f8f0e8,0 0 0 10px #d0c0a0,0 0 0 14px #f8f0e8}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__mat{position:absolute;inset:0;box-shadow:inset 0 0 0 3px rgba(0,0,0,.06);pointer-events:none}
  &__plaque{position:absolute;bottom:-36px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:.4rem;background:rgba(30,20,10,.7);backdrop-filter:blur(6px);border-radius:3px;padding:.2rem .6rem;white-space:nowrap}
  &__num{font-size:.52rem;font-weight:700;color:#d0a850;font-family:'Georgia',serif}
  &__title{font-size:.5rem;font-weight:500;color:rgba(255,220,180,.8);letter-spacing:.06em}
  &__floor-shadow{position:absolute;bottom:-44px;left:10%;width:80%;height:10px;background:radial-gradient(ellipse,rgba(0,0,0,.2) 0%,transparent 70%);border-radius:50%;transform:rotateX(80deg);pointer-events:none}
}

.ga-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.ga-info__dot{width:6px;height:6px;border-radius:50%;background:#d0a850;box-shadow:0 0 12px rgba(220,170,60,.5);animation:ga-pulse 2s ease-in-out infinite}
@keyframes ga-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2);opacity:.5}}
.ga-info__text{font-size:.6rem;font-weight:600;color:rgba(220,170,60,.6);letter-spacing:.08em}
.ga-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(200,140,40,.05)}
.ga-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#e0b860,#c89030,#f0d070,#e0b860);background-size:200% 100%;box-shadow:0 0 10px rgba(220,170,60,.4)}
@media(max-width:768px){.ga-header{top:2vh}.ga-kicker{font-size:.38rem;padding:.1rem .4rem}.ga-title__c{font-size:1.2rem}}
</style>
