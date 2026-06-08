<template>
  <section ref="rootRef" class="kt-root">
    <div ref="wind1" class="kt-wind kt-wind--1"></div>
    <div ref="wind2" class="kt-wind kt-wind--2"></div>

    <div ref="scrollRef" class="kt-scroll">
      <div ref="trackRef" class="kt-track" :style="{ height: trackHeight }">
        <div class="kt-sticky">
          <header ref="headerRef" class="kt-header">
            <span class="kt-kicker">🪁 Shape · 风筝飘扬</span>
            <h1 class="kt-title"><span ref="t1" class="kt-title__c">风筝</span><span ref="t2" class="kt-title__c kt-title__c--alt">飘扬</span></h1>
            <div ref="lineRef" class="kt-line"></div>
            <p class="kt-sub">向下滚动 · 筝面随风波动 · 尾穗摇曳 · 扶摇直上</p>
          </header>

          <div ref="sceneRef" class="kt-scene">
            <div ref="shapeRef" class="kt-shape" :style="gridStyle">
              <div v-for="card in cards" :key="card.id" :ref="(el) => setCardRef(el as HTMLElement, card.id)" class="kt-card" :style="{ gridColumn: card.col+1, gridRow: card.row+1 }">
                <img :src="card.image" :alt="'img'" class="kt-card__img" />
                <div class="kt-card__shadow"></div>
              </div>
            </div>
          </div>

          <div class="kt-progress"><div ref="progRef" class="kt-progress__fill"></div></div>
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
type TCleanup = () => void

// 🪁 风筝形状 (菱形筝面 + 尾穗)
const SHAPE = [
  '....1....',
  '...111...',
  '..11111..',
  '.1111111.',
  '111111111',
  '.1111111.',
  '..11111..',
  '...111...',
  '....1....',
  '....1....',
  '....1....',
  '....1....',
  '....1....',
]
const ROWS = SHAPE.length; const COLS = SHAPE[0].length; const cx = (COLS-1)/2

interface CardData { id: number; col: number; row: number; image: string }
const pool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=200&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=200&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80',
]
const cards: CardData[] = []
let id = 0
SHAPE.forEach((rowStr, row) => {
  for (let col = 0; col < rowStr.length; col++) {
    if (rowStr[col] === '1') cards.push({ id: id++, col, row, image: pool[id % pool.length] })
  }
})

const trackHeight = `${(ROWS + 4) * 100}vh`
const gridStyle = { gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }

const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const headerRef = ref<HTMLElement|null>(null)
const lineRef = ref<HTMLElement|null>(null); const t1 = ref<HTMLElement|null>(null); const t2 = ref<HTMLElement|null>(null)
const sceneRef = ref<HTMLElement|null>(null); const shapeRef = ref<HTMLElement|null>(null)
const progRef = ref<HTMLElement|null>(null)
const wind1 = ref<HTMLElement|null>(null); const wind2 = ref<HTMLElement|null>(null)
const cardRefs = ref<(HTMLElement|null)[]>([]); const cleanup: TCleanup[] = []
function setCardRef(el: HTMLElement|null, idx: number) { cardRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value||!headerRef.value||!sceneRef.value) return
  const tl = gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo([t1.value,t2.value],{autoAlpha:0,y:80,filter:'blur(15px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.6,stagger:.1,ease:'power3.out'},'-.35')
    .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.45,ease:'power3.inOut'},'-.2')
  const els = cardRefs.value.filter(Boolean) as HTMLElement[]
  if (els.length) tl.fromTo(els,{autoAlpha:0,scale:0,z:-60},{autoAlpha:1,scale:1,z:0,duration:.3,stagger:.015,ease:'back.out(2)'},'-.25')
  cleanup.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupSway() {
  if (!scrollRef.value||!trackRef.value||!shapeRef.value) return
  const sc=scrollRef.value; const track=trackRef.value
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]
  els.forEach(el=>gsap.set(el,{x:0,y:0,z:0,rotateZ:0}))
  if (sceneRef.value) gsap.set(sceneRef.value,{rotateX:25,rotateY:0})

  const master=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.35}})

  // 🔑 风筝飘扬: X轴正弦摇摆 + Y轴下沉(尾穗) + rotateZ微扭 + Z轴随风起伏
  const isTail = (row: number) => row >= 9 // 尾穗行

  els.forEach((el,i)=>{
    const c=cards[i]
    const distFromCenter = Math.abs(c.col - cx) / cx // 距中轴
    const tailPhase = isTail(c.row) ? (c.row - 9) * 0.15 : 0
    const phase = c.row * 0.12 + tailPhase

    if (isTail(c.row)) {
      // 尾穗: X轴大幅度左右摇摆
      const swayAmp = 30 + (c.row - 9) * 12 // 越往下摆幅越大
      master.to(el,{x:swayAmp*0.6,y:10,z:15,rotateZ:8,duration:.6,ease:'power2.out'},phase)
      master.to(el,{x:-swayAmp*0.5,y:20,z:25,rotateZ:-6,duration:.7,ease:'sine.inOut'},phase+.6)
      master.to(el,{x:swayAmp*0.3,y:5,z:10,rotateZ:4,duration:.6,ease:'power2.in'},phase+1.3)
      master.to(el,{x:0,y:0,z:0,rotateZ:0,duration:.5,ease:'power2.out'},phase+1.9)
    } else {
      // 筝面: X轴正弦摇摆 + Z轴呼吸
      const swayAmp = 15 * (1 + distFromCenter * 0.5)
      master.to(el,{x:swayAmp*0.7,z:35,rotateZ:4*(c.col<cx?-1:1),duration:.65,ease:'power2.out'},phase)
      master.to(el,{x:-swayAmp*0.5,z:50,rotateZ:-3*(c.col<cx?-1:1),duration:.55,ease:'sine.inOut'},phase+.65)
      master.to(el,{x:swayAmp*0.25,z:15,rotateZ:0,duration:.6,ease:'power2.in'},phase+1.2)
      master.to(el,{x:0,z:0,duration:.5,ease:'power2.out'},phase+1.8)
    }
  })

  if (sceneRef.value) {
    master.to(sceneRef.value,{rotateX:40,rotateY:5,duration:ROWS*.6,ease:'sine.inOut'},0)
    master.to(sceneRef.value,{rotateX:20,rotateY:-3,duration:ROWS*.5,ease:'sine.inOut'},ROWS*.6)
  }
  if (wind1.value) master.to(wind1.value,{x:'-10vw',y:'-5vh',opacity:.4,duration:ROWS},0)
  if (wind2.value) master.to(wind2.value,{x:'8vw',y:'3vh',opacity:.35,duration:ROWS},0)
  if (progRef.value) master.to(progRef.value,{width:'100%',duration:ROWS},0)
  cleanup.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupSway()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanup.forEach(f=>f());cleanup.length=0})
</script>

<style scoped lang="scss">
.kt-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(175deg,#e8f4e8 0%,#e0f0e8 20%,#f0f4e8 45%,#e8f0f0 65%,#e8f4e8 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.kt-wind{position:absolute;border-radius:30%;pointer-events:none;z-index:0;will-change:transform,opacity;filter:blur(60px);&--1{width:35vw;height:8vw;top:20vh;left:15vw;background:rgba(180,210,180,.2);transform:rotate(-8deg)}&--2{width:28vw;height:6vw;top:40vh;right:10vw;background:rgba(160,200,180,.15);transform:rotate(5deg)}}
.kt-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(120,180,140,.12)}}
.kt-track{position:relative;width:100%}
.kt-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.kt-header{position:absolute;top:2.5vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(90vw,700px)}
.kt-kicker{display:inline-block;font-size:.52rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(100,160,120,.5);background:rgba(200,230,200,.25);backdrop-filter:blur(6px);border:1px solid rgba(180,220,180,.3);border-radius:999px;padding:.16rem .7rem;margin-bottom:.35rem}
.kt-title{margin:0;display:flex;justify-content:center;gap:.06em}
.kt-title__c{font-size:clamp(1.6rem,4vw,3.2rem);font-weight:900;color:#60a070;will-change:transform,opacity;&--alt{background:linear-gradient(135deg,#80c090,#50a060,#308040);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.kt-line{width:55px;height:1.5px;margin:.25rem auto .35rem;border-radius:2px;background:linear-gradient(90deg,transparent,#60a070,#80c090,transparent);transform-origin:center}
.kt-sub{margin:0;font-size:clamp(.5rem,.7vw,.6rem);color:rgba(80,140,100,.25);max-width:400px;margin-inline:auto}
.kt-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:550px;perspective-origin:50% 45%;will-change:transform}
.kt-shape{display:grid;gap:4px;transform-style:preserve-3d;transform:rotateX(25deg);will-change:transform;width:min(45vw,320px)}
.kt-card{transform-style:preserve-3d;will-change:transform;border-radius:3px;overflow:hidden;box-shadow:0 3px 10px rgba(0,0,0,.12);cursor:pointer;aspect-ratio:1;transition:filter .2s;&:hover{filter:brightness(1.15)}}
.kt-card__img{width:100%;height:100%;object-fit:cover;display:block}
.kt-card__shadow{position:absolute;bottom:-4px;left:10%;width:80%;height:6px;background:radial-gradient(ellipse,rgba(0,0,0,.13) 0%,transparent 70%);border-radius:50%;transform:rotateX(90deg);pointer-events:none}
.kt-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:2px;background:rgba(100,160,120,.05)}
.kt-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#50a060,#80c090,#50a060);box-shadow:0 0 8px rgba(80,150,100,.3)}
@media(max-width:768px){.kt-shape{width:60vw;gap:2px}.kt-title__c{font-size:1.2rem}}
</style>
