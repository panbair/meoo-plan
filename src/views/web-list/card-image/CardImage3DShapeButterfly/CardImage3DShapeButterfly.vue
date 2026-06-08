<template>
  <section ref="rootRef" class="bf-root">
    <div ref="flower1" class="bf-flower bf-flower--1"></div>
    <div ref="flower2" class="bf-flower bf-flower--2"></div>

    <div ref="scrollRef" class="bf-scroll">
      <div ref="trackRef" class="bf-track" :style="{ height: trackHeight }">
        <div class="bf-sticky">
          <header ref="headerRef" class="bf-header">
            <span class="bf-kicker">🦋 Shape · 蝴蝶振翅</span>
            <h1 class="bf-title"><span ref="t1" class="bf-title__c">蝴蝶</span><span ref="t2" class="bf-title__c bf-title__c--alt">振翅</span></h1>
            <div ref="lineRef" class="bf-line"></div>
            <p class="bf-sub">向下滚动 · 双翼对称扇动 · 身体微浮 · 如花间起舞</p>
          </header>

          <div ref="sceneRef" class="bf-scene">
            <div ref="shapeRef" class="bf-shape" :style="gridStyle">
              <div v-for="card in cards" :key="card.id" :ref="(el) => setCardRef(el as HTMLElement, card.id)" class="bf-card" :style="{ gridColumn: card.col+1, gridRow: card.row+1, '--wingSign': card.col < cx ? -1 : 1 }">
                <img :src="card.image" :alt="'img'" class="bf-card__img" />
                <div class="bf-card__shadow"></div>
              </div>
            </div>
          </div>

          <div class="bf-progress"><div ref="progRef" class="bf-progress__fill"></div></div>
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

// 🦋 蝴蝶形状 (左右对称)
const SHAPE = [
  '1...........1',
  '11.........11',
  '.11.......11.',
  '..111...111..',
  '...111.111...',
  '....11111....',
  '...111.111...',
  '..111...111..',
  '.11.......11.',
  '11.........11',
  '.....111.....',  // 身体
]
const ROWS = SHAPE.length; const COLS = SHAPE[0].length; const cx = (COLS-1)/2

interface CardData { id: number; col: number; row: number; image: string }
const pool = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=200&q=80',
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
const flower1 = ref<HTMLElement|null>(null); const flower2 = ref<HTMLElement|null>(null)
const cardRefs = ref<(HTMLElement|null)[]>([]); const cleanup: TCleanup[] = []
function setCardRef(el: HTMLElement|null, idx: number) { cardRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value||!headerRef.value||!sceneRef.value) return
  const tl = gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo([t1.value,t2.value],{autoAlpha:0,y:80,filter:'blur(15px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.6,stagger:.1,ease:'power3.out'},'-.35')
    .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.45,ease:'power3.inOut'},'-.2')
  const els = cardRefs.value.filter(Boolean) as HTMLElement[]
  if (els.length) tl.fromTo(els,{autoAlpha:0,scale:0,z:-50},{autoAlpha:1,scale:1,z:0,duration:.3,stagger:.015,ease:'back.out(2)'},'-.25')
  cleanup.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupFlap() {
  if (!scrollRef.value||!trackRef.value||!shapeRef.value) return
  const sc=scrollRef.value; const track=trackRef.value
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]
  els.forEach(el=>gsap.set(el,{rotateY:0,z:0}))
  if (sceneRef.value) gsap.set(sceneRef.value,{rotateX:20,rotateY:0})

  const master=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.4}})

  // 🔑 振翅: 左翼 rotateY<0, 右翼 rotateY>0, 翼尖幅度最大
  els.forEach((el,i)=>{
    const c=cards[i]
    const wingDist = Math.abs(c.col - cx) / cx // 0(身体) → 1(翼尖)
    const isLeft = c.col < cx
    const isBody = c.col === cx || Math.abs(c.col - cx) <= 0.5
    const phase = (1 - wingDist) * 0.35 // 翼尖先动(phase小), 身体后动

    if (isBody) {
      // 身体: Z轴小幅度浮沉
      master.to(el,{z:25,duration:.5,ease:'sine.inOut'},phase)
      master.to(el,{z:-10,duration:.5,ease:'sine.inOut'},phase+.5)
      master.to(el,{z:0,duration:.5,ease:'sine.inOut'},phase+1)
    } else {
      // 翅膀: rotateY 扇动 (翼尖幅度大)
      const peakRot = (isLeft ? -1 : 1) * wingDist * 55
      // 合拢 → 张开 → 合拢 (一个完整扇动周期)
      master.to(el,{rotateY:peakRot,z:30*wingDist,duration:.5,ease:'power2.out'},phase)
      master.to(el,{rotateY:peakRot*1.15,z:45*wingDist,duration:.2,ease:'sine.inOut'},phase+.5)
      master.to(el,{rotateY:peakRot*.2,z:10*wingDist,duration:.55,ease:'power2.in'},phase+.7)
      // 第二拍 (较小幅度)
      master.to(el,{rotateY:peakRot*.7,z:25*wingDist,duration:.45,ease:'power2.out'},phase+1.4)
      master.to(el,{rotateY:0,z:0,duration:.5,ease:'power2.in'},phase+1.85)
    }
  })

  if (sceneRef.value) {
    master.to(sceneRef.value,{rotateX:35,rotateY:3,duration:ROWS*.6,ease:'sine.inOut'},0)
    master.to(sceneRef.value,{rotateX:15,rotateY:-2,duration:ROWS*.5,ease:'sine.inOut'},ROWS*.6)
  }
  if (flower1.value) master.to(flower1.value,{x:'-5vw',y:'-3vh',scale:1.2,opacity:.5,duration:ROWS},0)
  if (flower2.value) master.to(flower2.value,{x:'4vw',y:'2vh',scale:1.1,opacity:.4,duration:ROWS},0)
  if (progRef.value) master.to(progRef.value,{width:'100%',duration:ROWS},0)
  cleanup.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupFlap()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanup.forEach(f=>f());cleanup.length=0})
</script>

<style scoped lang="scss">
.bf-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#fef9f5 0%,#fdf5f0 20%,#fef8f6 45%,#fdf4f2 65%,#fef9f5 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.bf-flower{position:absolute;border-radius:50%;pointer-events:none;z-index:0;will-change:transform,opacity;filter:blur(50px);&--1{width:22vw;height:22vw;top:10vh;left:12vw;background:radial-gradient(circle,rgba(255,180,160,.25),transparent 60%)}&--2{width:18vw;height:18vw;bottom:15vh;right:10vw;background:radial-gradient(circle,rgba(255,160,200,.2),transparent 60%)}}
.bf-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(220,150,130,.15)}}
.bf-track{position:relative;width:100%}
.bf-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.bf-header{position:absolute;top:2.5vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(90vw,700px)}
.bf-kicker{display:inline-block;font-size:.52rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(200,120,140,.55);background:rgba(255,220,210,.3);backdrop-filter:blur(6px);border:1px solid rgba(255,200,190,.3);border-radius:999px;padding:.16rem .7rem;margin-bottom:.35rem}
.bf-title{margin:0;display:flex;justify-content:center;gap:.06em}
.bf-title__c{font-size:clamp(1.6rem,4vw,3.2rem);font-weight:900;color:#d08090;will-change:transform,opacity;&--alt{background:linear-gradient(135deg,#e890a0,#d06080,#c04070);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.bf-line{width:55px;height:1.5px;margin:.25rem auto .35rem;border-radius:2px;background:linear-gradient(90deg,transparent,#d08090,#e0a0b0,transparent);transform-origin:center}
.bf-sub{margin:0;font-size:clamp(.5rem,.7vw,.6rem);color:rgba(200,120,140,.28);max-width:400px;margin-inline:auto}
.bf-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:550px;perspective-origin:50% 48%;will-change:transform}
.bf-shape{display:grid;gap:4px;transform-style:preserve-3d;transform:rotateX(20deg);will-change:transform;width:min(65vw,450px)}
.bf-card{transform-style:preserve-3d;will-change:transform;border-radius:3px;overflow:hidden;box-shadow:0 3px 10px rgba(0,0,0,.15);cursor:pointer;aspect-ratio:1;transition:filter .2s;&:hover{filter:brightness(1.15)}}
.bf-card__img{width:100%;height:100%;object-fit:cover;display:block}
.bf-card__shadow{position:absolute;bottom:-4px;left:10%;width:80%;height:6px;background:radial-gradient(ellipse,rgba(0,0,0,.15) 0%,transparent 70%);border-radius:50%;transform:rotateX(90deg);pointer-events:none}
.bf-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:2px;background:rgba(200,120,140,.05)}
.bf-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#d06080,#e890a0,#d06080);box-shadow:0 0 8px rgba(200,100,130,.3)}
@media(max-width:768px){.bf-shape{width:80vw;gap:2px}.bf-title__c{font-size:1.2rem}}
</style>
