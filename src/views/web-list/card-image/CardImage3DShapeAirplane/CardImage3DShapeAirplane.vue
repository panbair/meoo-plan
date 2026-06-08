<template>
  <section ref="rootRef" class="ap-root">
    <div ref="cloud1" class="ap-cloud ap-cloud--1"></div>
    <div ref="cloud2" class="ap-cloud ap-cloud--2"></div>
    <div ref="cloud3" class="ap-cloud ap-cloud--3"></div>

    <div ref="scrollRef" class="ap-scroll">
      <div ref="trackRef" class="ap-track" :style="{ height: trackHeight }">
        <div class="ap-sticky">
          <header ref="headerRef" class="ap-header">
            <span class="ap-kicker">✈ Shape · 飞机编队</span>
            <h1 class="ap-title"><span ref="t1" class="ap-title__c">飞机</span><span ref="t2" class="ap-title__c ap-title__c--alt">起飞</span></h1>
            <div ref="lineRef" class="ap-line"></div>
            <p class="ap-sub">向下滚动 · 机头扬起 · 机翼展开 · 冲向云霄</p>
          </header>

          <div ref="sceneRef" class="ap-scene">
            <div ref="shapeRef" class="ap-shape" :style="gridStyle">
              <div v-for="card in cards" :key="card.id" :ref="(el) => setCardRef(el as HTMLElement, card.id)" class="ap-card" :style="{ gridColumn: card.col+1, gridRow: card.row+1 }">
                <img :src="card.image" :alt="'img'" class="ap-card__img" />
                <div class="ap-card__shadow"></div>
              </div>
            </div>
          </div>

          <div class="ap-progress"><div ref="progRef" class="ap-progress__fill"></div></div>
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

// ✈ 飞机形状矩阵 (1=有卡片, 0=空)
const SHAPE = [
  '.......1.......',
  '......111......',
  '.....11111.....',
  '....1111111....',
  '...111111111...',
  '..11111111111..',
  '111111111111111', // 机翼
  '..11111111111..',
  '...111111111...',
  '....1111111....',
  '.....11111.....',
  '......111......',
  '......111......', // 尾翼
]
const ROWS = SHAPE.length; const COLS = SHAPE[0].length

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
const cloud1 = ref<HTMLElement|null>(null); const cloud2 = ref<HTMLElement|null>(null); const cloud3 = ref<HTMLElement|null>(null)
const cardRefs = ref<(HTMLElement|null)[]>([]); const cleanup: TCleanup[] = []
function setCardRef(el: HTMLElement|null, idx: number) { cardRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value||!headerRef.value||!sceneRef.value) return
  const tl = gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo([t1.value,t2.value],{autoAlpha:0,y:80,filter:'blur(15px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.6,stagger:.1,ease:'power3.out'},'-.35')
    .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.45,ease:'power3.inOut'},'-.2')
  const els = cardRefs.value.filter(Boolean) as HTMLElement[]
  if (els.length) tl.fromTo(els,{autoAlpha:0,scale:0,z:-80},{autoAlpha:1,scale:1,z:0,duration:.35,stagger:.02,ease:'back.out(2)'},'-.3')
  cleanup.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupTakeoff() {
  if (!scrollRef.value||!trackRef.value||!shapeRef.value) return
  const sc=scrollRef.value; const track=trackRef.value
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]
  els.forEach(el=>gsap.set(el,{z:0,rotateX:0,rotateY:0}))
  if (sceneRef.value) gsap.set(sceneRef.value,{rotateX:30,rotateY:0})

  const master=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.3}})

  // 🔑 起飞动画: 机头(上排)先扬起 → 机身跟随 → 两翼展开
  els.forEach((el,i)=>{
    const c=cards[i]
    const isWing = c.row >= 5 && c.row <= 7  // 机翼行
    const isNose = c.row <= 2                  // 机头
    const colCenter = (COLS-1)/2
    const wingDist = (c.col - colCenter) / colCenter // -1(左翼尖) ~ +1(右翼尖)

    const phase = c.row * 0.15 // 从上到下传播

    if (isWing) {
      // 机翼: rotateY 展开 + Z轴起伏 (扇动)
      const wingFlap = wingDist * 35 // 翼尖转动最大
      master.to(el,{rotateY:wingFlap,z:40*Math.abs(wingDist),duration:.7,ease:'power2.out'},phase)
      master.to(el,{rotateY:wingFlap*1.2,z:60*Math.abs(wingDist),duration:.25,ease:'sine.inOut'},phase+.7)
      master.to(el,{rotateY:wingFlap*.3,z:15*Math.abs(wingDist),duration:.55,ease:'power2.in'},phase+.95)
      master.to(el,{rotateY:0,z:0,duration:.5,ease:'power2.out'},phase+1.5)
    } else if (isNose) {
      // 机头: translateZ 大幅扬起 + rotateX 上仰
      master.to(el,{z:70,rotateX:-20,duration:.6,ease:'power2.out'},phase)
      master.to(el,{z:90,rotateX:-25,duration:.2,ease:'sine.inOut'},phase+.6)
      master.to(el,{z:20,rotateX:-5,duration:.7,ease:'power2.in'},phase+.8)
      master.to(el,{z:0,rotateX:0,duration:.5,ease:'power2.out'},phase+1.5)
    } else {
      // 机身/尾翼: 跟随Z轴波浪
      master.to(el,{z:50,rotateX:-10,duration:.65,ease:'power2.out'},phase)
      master.to(el,{z:60,duration:.2,ease:'sine.inOut'},phase+.65)
      master.to(el,{z:10,rotateX:0,duration:.7,ease:'power2.in'},phase+.85)
      master.to(el,{z:0,duration:.5,ease:'power2.out'},phase+1.55)
    }
  })

  // 整机旋转 (爬升时微微倾斜)
  if (sceneRef.value) {
    master.to(sceneRef.value,{rotateX:50,rotateY:8,duration:ROWS*.7,ease:'sine.inOut'},0)
    master.to(sceneRef.value,{rotateX:25,rotateY:-5,duration:ROWS*.5,ease:'sine.inOut'},ROWS*.7)
  }
  // 云朵飘动
  if (cloud1.value) master.to(cloud1.value,{x:'-8vw',opacity:.6,duration:ROWS},0)
  if (cloud2.value) master.to(cloud2.value,{x:'5vw',opacity:.45,duration:ROWS},0)
  if (cloud3.value) master.to(cloud3.value,{x:'-3vw',y:'-3vh',opacity:.5,duration:ROWS},0)
  if (progRef.value) master.to(progRef.value,{width:'100%',duration:ROWS},0)
  cleanup.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupTakeoff()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanup.forEach(f=>f());cleanup.length=0})
</script>

<style scoped lang="scss">
.ap-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(180deg,#87CEEB 0%,#b8d8f0 25%,#e8f0f8 50%,#d0e8f8 75%,#a0c8e8 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.ap-cloud{position:absolute;border-radius:50%;background:rgba(255,255,255,.7);filter:blur(40px);pointer-events:none;z-index:0;will-change:transform,opacity;&--1{width:30vw;height:15vw;top:12vh;left:8vw}&--2{width:25vw;height:12vw;top:28vh;right:5vw}&--3{width:20vw;height:10vw;bottom:18vh;left:25vw}}
.ap-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(100,160,220,.2)}}
.ap-track{position:relative;width:100%}
.ap-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ap-header{position:absolute;top:2.5vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(90vw,700px)}
.ap-kicker{display:inline-block;font-size:.52rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(60,100,160,.6);background:rgba(255,255,255,.25);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:.16rem .7rem;margin-bottom:.35rem}
.ap-title{margin:0;display:flex;justify-content:center;gap:.06em}
.ap-title__c{font-size:clamp(1.6rem,4vw,3.2rem);font-weight:900;color:#4a80b8;will-change:transform,opacity;&--alt{background:linear-gradient(135deg,#6098d0,#4088c0,#3068a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.ap-line{width:60px;height:1.5px;margin:.25rem auto .35rem;border-radius:2px;background:linear-gradient(90deg,transparent,#6098d0,#80b8e0,transparent);transform-origin:center}
.ap-sub{margin:0;font-size:clamp(.5rem,.7vw,.6rem);color:rgba(60,100,160,.3);max-width:400px;margin-inline:auto}
.ap-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:600px;perspective-origin:50% 45%;will-change:transform}
.ap-shape{display:grid;gap:4px;transform-style:preserve-3d;transform:rotateX(35deg);will-change:transform;width:min(70vw,500px)}
.ap-card{transform-style:preserve-3d;will-change:transform;border-radius:3px;overflow:hidden;box-shadow:0 3px 12px rgba(0,0,0,.18);cursor:pointer;aspect-ratio:1;transition:filter .2s;&:hover{filter:brightness(1.2)}}
.ap-card__img{width:100%;height:100%;object-fit:cover;display:block}
.ap-card__shadow{position:absolute;bottom:-4px;left:10%;width:80%;height:6px;background:radial-gradient(ellipse,rgba(0,0,0,.2) 0%,transparent 70%);border-radius:50%;transform:rotateX(90deg);pointer-events:none}
.ap-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:2px;background:rgba(100,160,220,.06)}
.ap-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#5088c0,#80b8e0,#5088c0);box-shadow:0 0 8px rgba(80,140,200,.3)}
@media(max-width:768px){.ap-shape{width:85vw;gap:2px}.ap-title__c{font-size:1.2rem}}
</style>
