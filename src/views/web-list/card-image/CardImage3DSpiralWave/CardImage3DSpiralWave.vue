<template>
  <section ref="rootRef" class="sw-root">
    <div ref="vortexA" class="sw-vortex sw-vortex--a"></div>
    <div ref="vortexB" class="sw-vortex sw-vortex--b"></div>

    <div ref="scrollRef" class="sw-scroll">
      <div ref="trackRef" class="sw-track" :style="{ height: trackHeight }">
        <div class="sw-sticky">

          <header ref="headerRef" class="sw-header">
            <span class="sw-kicker">🌀 CSS3 3D Spiral Wave · 螺旋波 ◈</span>
            <h1 class="sw-title">
              <span ref="tc1" class="sw-title__c">螺</span>
              <span ref="tc2" class="sw-title__c sw-title__c--spin">旋</span>
              <span ref="tc3" class="sw-title__c">波</span>
              <span ref="tc4" class="sw-title__c sw-title__c--spin">浪</span>
            </h1>
            <div ref="lineRef" class="sw-line"></div>
            <p class="sw-sub">向下滚动 · 阿基米德螺旋从中心向外扩散 · 图片卡随螺旋波起伏</p>
          </header>

          <div ref="sceneRef" class="sw-scene">
            <div ref="spiralRef" class="sw-spiral">
              <div
                v-for="card in spiralCards"
                :key="card.id"
                :ref="(el)=>setCardRef(el as HTMLElement, card.id)"
                class="sw-card"
                :style="{ '--phase': card.phase, '--dist': card.dist }"
              >
                <img :src="card.image" :alt="card.alt" class="sw-card__img" />
                <div class="sw-card__glow"></div>
                <div class="sw-card__shadow"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="sw-info">
            <span class="sw-info__dot"></span>
            <span class="sw-info__text">螺旋 {{ currentTurn.toFixed(1) }} 圈</span>
          </div>

          <div class="sw-progress"><div ref="progRef" class="sw-progress__fill"></div></div>
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

const COLS = 9, ROWS = 7, TOTAL = COLS * ROWS
const trackHeight = `${8 * 100}vh`

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=280&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=280&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=280&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=280&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=280&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=280&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=280&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=280&q=80',
]

// 阿基米德螺旋：dist从中心到外 + angle=dist*旋转因子
const spiralCards = Array.from({ length: TOTAL }, (_, i) => {
  const col = i % COLS, row = Math.floor(i / COLS)
  const cx = col - (COLS - 1) / 2, cy = row - (ROWS - 1) / 2
  const dist = Math.sqrt(cx * cx + cy * cy)
  const angle = Math.atan2(cy, cx)  // 极坐标角度
  // 螺旋相位 = dist * 常数 + angle
  const phase = dist * 0.7 + angle * 0.5
  return { id: i, col, row, dist, angle, phase, image: imgPool[i % imgPool.length], alt: `螺旋卡${i}` }
})

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const spiralRef=ref<HTMLElement|null>(null)
const vortexA=ref<HTMLElement|null>(null);const vortexB=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const currentTurn=ref(0)
const cardRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setCardRef(el:HTMLElement|null,idx:number){cardRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,rotateZ:180,scale:0},{autoAlpha:1,rotateZ:0,scale:1,duration:.7,stagger:.12,ease:'back.out(3)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-25,scale:.4},{autoAlpha:1,rotateX:-12,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupSpiralWave(){
  if(!scrollRef.value||!trackRef.value||!spiralRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]

  els.forEach(el=>gsap.set(el,{translateZ:0,rotateX:0,rotateY:0}))
  if(spiralRef.value)gsap.set(spiralRef.value,{rotateX:-12})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){currentTurn.value=self.progress*5},
    },
  })

  const AMP = 70, SPIRAL_SPEED = 2.5

  // 🌀 螺旋波：相位 = dist*0.7 + angle*0.5 + scroll*SPIRAL_SPEED
  // scroll变化 → 波沿着螺旋线向外传播
  els.forEach((el,i)=>{
    const card=spiralCards[i]
    const basePhase=card.phase

    // 波形1：螺旋波峰到达→升起→落下
    master.to(el,{translateZ:AMP,rotateX:-6,rotateY:card.angle>0?4:-4,duration:.7,ease:'power2.out'},basePhase*.3)
    master.to(el,{translateZ:-15,rotateX:2,rotateY:0,duration:.6,ease:'power2.in'},basePhase*.3+.7)
    // 波形2
    master.to(el,{translateZ:AMP*.6,rotateX:-4,duration:.55,ease:'power2.out'},basePhase*.3+2.2)
    master.to(el,{translateZ:0,rotateX:0,rotateY:0,duration:.55,ease:'power2.in'},basePhase*.3+2.75)
    // 波形3 更弱
    master.to(el,{translateZ:AMP*.3,duration:.4,ease:'power2.out'},basePhase*.3+4)
    master.to(el,{translateZ:0,duration:.45,ease:'power2.in'},basePhase*.3+4.4)
  })

  if(spiralRef.value){
    master.to(spiralRef.value,{rotateZ:90,duration:4,ease:'sine.inOut'},0)
    master.to(spiralRef.value,{rotateZ:-60,duration:4,ease:'sine.inOut'},4)
  }
  if(vortexA.value)master.to(vortexA.value,{scale:1.4,opacity:.5,duration:7,ease:'sine.inOut'},0)
  if(vortexB.value)master.to(vortexB.value,{rotate:45,scale:1.3,opacity:.4,duration:7},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:7},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupSpiralWave()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.sw-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0f1028 0%,#080a18 60%,#040510 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.sw-vortex{position:absolute;border-radius:50%;pointer-events:none;z-index:0;will-change:transform,opacity;&--a{width:30vw;height:30vw;top:50%;left:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(140,60,220,.2) 0%,transparent 60%);filter:blur(70px)}&--b{width:25vw;height:25vw;top:50%;left:50%;transform:translate(-50%,-50%) rotate(30deg);border:1px solid rgba(160,80,240,.06);border-radius:50%}}
.sw-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(160,100,240,.15)}}
.sw-track{position:relative;width:100%}.sw-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.sw-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.sw-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(180,120,240,.7);background:rgba(120,60,200,.08);backdrop-filter:blur(8px);border:1px solid rgba(140,80,220,.16);border-radius:999px;padding:.22rem .9rem;margin-bottom:.5rem}
.sw-title{margin:0;display:flex;justify-content:center;gap:.08em}
.sw-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#b080e0;will-change:transform,opacity;&--spin{background:linear-gradient(135deg,#b080e0,#60a0f0,#50c8a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 16px rgba(150,100,230,.6))}}
.sw-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#b080e0,#60a0f0,#50c8a0,transparent);transform-origin:center}
.sw-sub{margin:0;font-size:clamp(.64rem,.9vw,.78rem);color:rgba(160,120,220,.3);max-width:540px;margin-inline:auto}
.sw-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:650px;perspective-origin:50% 50%;will-change:transform,opacity}
.sw-spiral{position:relative;width:min(60vw,520px);height:min(44vw,370px);margin-left:calc(min(60vw,520px) / -2);margin-top:calc(min(44vw,370px) / -2);transform-style:preserve-3d;will-change:transform;display:grid;grid-template-columns:repeat(9,1fr);grid-template-rows:repeat(7,1fr);gap:3px}

.sw-card{transform-style:preserve-3d;will-change:transform,opacity;border-radius:4px;overflow:hidden;box-shadow:0 3px 14px rgba(0,0,0,.25);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__glow{position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06);border-radius:4px;pointer-events:none}
  &__shadow{position:absolute;bottom:-5px;left:8%;width:84%;height:7px;background:radial-gradient(ellipse,rgba(0,0,0,.2) 0%,transparent 70%);border-radius:50%;transform:rotateX(90deg);pointer-events:none}
}

.sw-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.sw-info__dot{width:6px;height:6px;border-radius:50%;background:#b080e0;box-shadow:0 0 14px rgba(150,100,230,.6);animation:sw-pulse 2s ease-in-out infinite}
@keyframes sw-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.sw-info__text{font-size:.6rem;font-weight:600;color:rgba(160,120,230,.6);letter-spacing:.1em}
.sw-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(140,80,220,.05)}
.sw-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#b080e0,#60a0f0,#50c8a0,#b080e0);background-size:200% 100%;box-shadow:0 0 12px rgba(150,100,230,.5)}
@media(max-width:768px){.sw-header{top:2vh}.sw-kicker{font-size:.42rem;padding:.1rem .4rem}.sw-title__c{font-size:1.3rem}}
</style>
