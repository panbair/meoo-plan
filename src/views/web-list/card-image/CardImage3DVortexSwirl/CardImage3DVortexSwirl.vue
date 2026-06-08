<template>
  <section ref="rootRef" class="vs-root">
    <div ref="vortexRing1" class="vs-vortex-bg"></div>
    <div ref="vortexRing2" class="vs-vortex-bg vs-vortex-bg--2"></div>

    <div ref="scrollRef" class="vs-scroll">
      <div ref="trackRef" class="vs-track" :style="{ height: trackHeight }">
        <div class="vs-sticky">
          <header ref="headerRef" class="vs-header">
            <span class="vs-kicker">🌀 Vortex Swirl · 漩涡矩阵</span>
            <h1 class="vs-title"><span ref="t1" class="vs-title__c">漩涡</span><span ref="t2" class="vs-title__c vs-title__c--alt">矩阵</span></h1>
            <div ref="lineRef" class="vs-line"></div>
            <p class="vs-sub">向下滚动 · 矩阵向中心漩涡卷入 · 外层旋转更快更深</p>
          </header>

          <div ref="sceneRef" class="vs-scene">
            <div ref="gridRef" class="vs-grid">
              <div v-for="(card, idx) in cards" :key="idx" :ref="(el) => setCardRef(el as HTMLElement, idx)" class="vs-card" :style="{ '--col': card.col, '--row': card.row, '--dist': card.dist }">
                <div class="vs-card__face">
                  <img :src="card.image" :alt="card.alt" class="vs-card__img" />
                  <div class="vs-card__shine"></div>
                  <span class="vs-card__label">{{ card.label }}</span>
                </div>
                <div class="vs-card__shadow"></div>
              </div>
            </div>
          </div>

          <div class="vs-progress"><div ref="progRef" class="vs-progress__fill"></div></div>
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

interface CardData { id: number; col: number; row: number; label: string; image: string; alt: string; dist: number }
const COLS = 5; const ROWS = 5; const TOTAL = COLS * ROWS
const CX = (COLS - 1) / 2

const pool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80',
]
const labels = ['海','山','森','星','花']

const cards: CardData[] = Array.from({ length: TOTAL }, (_, i) => {
  const row = Math.floor(i / COLS); const col = i % COLS
  const dist = Math.abs(col - CX) // distance from center column
  return { id: i, col, row, label: `${labels[row]}${col+1}`, image: pool[row], alt: labels[row], dist }
})

const maxDist = CX
const trackHeight = `${(ROWS + 3) * 115}vh`

const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const headerRef = ref<HTMLElement|null>(null)
const lineRef = ref<HTMLElement|null>(null); const t1 = ref<HTMLElement|null>(null); const t2 = ref<HTMLElement|null>(null)
const sceneRef = ref<HTMLElement|null>(null); const gridRef = ref<HTMLElement|null>(null)
const progRef = ref<HTMLElement|null>(null); const vortexRing1 = ref<HTMLElement|null>(null); const vortexRing2 = ref<HTMLElement|null>(null)
const cardRefs = ref<(HTMLElement|null)[]>([])
const cleanupFns: TweenCleanup[] = []
function setCardRef(el: HTMLElement|null, idx: number) { cardRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value||!headerRef.value||!sceneRef.value) return
  const tl = gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo([t1.value,t2.value],{autoAlpha:0,y:80,filter:'blur(15px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.12,ease:'power3.out'},'-.4')
    .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.45,ease:'power3.inOut'},'-.25')
  const els = cardRefs.value.filter(Boolean) as HTMLElement[]
  if (els.length) tl.fromTo(els,{autoAlpha:0,scale:.3,rotateY:90},{autoAlpha:1,scale:1,rotateY:0,duration:.45,stagger:.025,ease:'back.out(1.5)'},'-.2')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupVortex() {
  if (!scrollRef.value||!trackRef.value||!gridRef.value) return
  const sc=scrollRef.value; const track=trackRef.value
  const cardEls=cardRefs.value.filter(Boolean) as HTMLElement[]
  cardEls.forEach(el=>gsap.set(el,{rotateY:0,z:0}))
  if (sceneRef.value) gsap.set(sceneRef.value,{rotateX:45,rotateY:0})

  const master=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.5}})

  // 🔑 漩涡：每列旋转Y角度和Z深度由距中心的距离决定
  // 外列旋转角度大、Z轴后退深 → 形成漩涡卷入效果
  cardEls.forEach((el,idx)=>{
    const c=cards[idx]
    const distFactor=c.dist/maxDist // 0(center) → 1(edge)

    // 左半部分逆时针旋转，右半部分顺时针旋转
    const ySign=c.col<CX?-1:1
    const peakRotY=ySign*distFactor*55 // 外列最多转55°
    const peakZ=-distFactor*100 // 外列后退更深

    const phase=c.row*0.18 // 行级相位（前面行先动）
    const dur=1.2

    // 阶段1: 旋转+后退（卷入）
    master.to(el,{rotateY:peakRotY*0.7,z:peakZ*0.6,duration:dur*.35,ease:'power2.out'},phase)
    // 阶段2: 峰值
    master.to(el,{rotateY:peakRotY,z:peakZ,duration:dur*.15,ease:'sine.inOut'},phase+dur*.35)
    // 阶段3: 回弹
    master.to(el,{rotateY:peakRotY*-.2,z:20,duration:dur*.3,ease:'power2.in'},phase+dur*.5)
    // 阶段4: 恢复
    master.to(el,{rotateY:0,z:0,duration:dur*.25,ease:'power2.out'},phase+dur*.8)
  })

  if (sceneRef.value) {
    master.to(sceneRef.value,{rotateX:60,rotateY:8,duration:ROWS*.6,ease:'sine.inOut'},0)
    master.to(sceneRef.value,{rotateX:40,rotateY:-6,duration:ROWS*.5,ease:'sine.inOut'},ROWS*.6)
  }
  if (vortexRing1.value) master.to(vortexRing1.value,{rotate:180,scale:1.4,opacity:.3,duration:ROWS},0)
  if (vortexRing2.value) master.to(vortexRing2.value,{rotate:-120,scale:1.7,opacity:.2,duration:ROWS},0)
  if (progRef.value) master.to(progRef.value,{width:'100%',duration:ROWS},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupVortex()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.vs-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(135deg,#0c0c1d 0%,#141030 25%,#0d1828 55%,#0c0c1d 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.vs-vortex-bg{position:absolute;border-radius:50%;pointer-events:none;z-index:0;will-change:transform,opacity;left:50%;top:50%;transform:translate(-50%,-50%);width:35vw;height:35vw;border:1px solid rgba(140,100,220,.1);&--2{width:55vw;height:55vw;border-color:rgba(160,120,240,.05);border-style:dashed}}
.vs-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(140,100,220,.15)}}
.vs-track{position:relative;width:100%}
.vs-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.vs-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.vs-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(150,120,220,.65);background:rgba(140,110,220,.06);backdrop-filter:blur(8px);border:1px solid rgba(140,110,220,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.4rem}
.vs-title{margin:0;display:flex;justify-content:center;gap:.08em}
.vs-title__c{font-size:clamp(1.8rem,4.5vw,3.8rem);font-weight:900;color:#9070d0;will-change:transform,opacity;&--alt{background:linear-gradient(135deg,#a080e0,#7060c0,#5040a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.vs-line{width:75px;height:2px;margin:.3rem auto .45rem;border-radius:2px;background:linear-gradient(90deg,transparent,#8060c0,#a080e0,transparent);transform-origin:center}
.vs-sub{margin:0;font-size:clamp(.56rem,.8vw,.7rem);color:rgba(140,110,200,.3);max-width:460px;margin-inline:auto}
.vs-scene{position:absolute;top:52%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:650px;perspective-origin:50% 42%;will-change:transform}
.vs-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;transform-style:preserve-3d;transform:rotateX(45deg);will-change:transform}
.vs-card{width:min(15vw,130px);height:min(12vw,105px);transform-style:preserve-3d;will-change:transform;transition:filter .3s;cursor:pointer;&:hover{filter:brightness(1.15)}}
.vs-card__face{position:relative;width:100%;height:100%;border-radius:8px;overflow:hidden;backface-visibility:hidden;box-shadow:0 5px 24px rgba(0,0,0,.25),0 0 0 1px rgba(255,255,255,.18)}
.vs-card__img{width:100%;height:100%;object-fit:cover}
.vs-card__shine{position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.16) 0%,transparent 50%,rgba(255,255,255,.04) 100%);pointer-events:none}
.vs-card__label{position:absolute;bottom:4px;right:5px;z-index:2;font-size:.5rem;font-weight:700;letter-spacing:.08em;color:#fff;background:rgba(0,0,0,.22);backdrop-filter:blur(4px);border-radius:4px;padding:.06rem .35rem}
.vs-card__shadow{position:absolute;left:8%;bottom:-14px;width:84%;height:12px;background:radial-gradient(ellipse,rgba(0,0,0,.2) 0%,transparent 75%);border-radius:50%;transform:rotateX(90deg);pointer-events:none;will-change:transform,opacity}
.vs-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(140,100,220,.04)}
.vs-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#6040a0,#a080e0,#6040a0);box-shadow:0 0 10px rgba(140,100,220,.4)}
@media(max-width:768px){.vs-grid{gap:6px}.vs-card{width:15vw;height:12vw}.vs-title__c{font-size:1.4rem}}
</style>
