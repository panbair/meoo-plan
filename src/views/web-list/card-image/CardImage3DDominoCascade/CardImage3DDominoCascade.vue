<template>
  <section ref="rootRef" class="dc-root">
    <div ref="scrollRef" class="dc-scroll">
      <div ref="trackRef" class="dc-track" :style="{ height: trackHeight }">
        <div class="dc-sticky">
          <header ref="headerRef" class="dc-header">
            <span class="dc-kicker">🀄 Domino Cascade · 多米诺倾泻</span>
            <h1 class="dc-title"><span ref="t1" class="dc-title__c">多米</span><span ref="t2" class="dc-title__c dc-title__c--alt">诺</span></h1>
            <div ref="lineRef" class="dc-line"></div>
            <p class="dc-sub">向下滚动 · 卡片如多米诺骨牌依次倾覆 · 再逐列回弹</p>
          </header>

          <div ref="sceneRef" class="dc-scene">
            <div ref="gridRef" class="dc-grid">
              <div v-for="(card, idx) in cards" :key="idx" :ref="(el) => setCardRef(el as HTMLElement, idx)" class="dc-card" :style="{ '--col': card.col, '--row': card.row }">
                <div class="dc-card__face">
                  <img :src="card.image" :alt="card.alt" class="dc-card__img" />
                  <div class="dc-card__shine"></div>
                  <span class="dc-card__label">{{ card.label }}</span>
                </div>
                <div class="dc-card__shadow"></div>
              </div>
            </div>
          </div>

          <div class="dc-progress"><div ref="progRef" class="dc-progress__fill"></div></div>
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

interface CardData { id: number; col: number; row: number; label: string; image: string; alt: string }
const COLS = 4; const ROWS = 6; const TOTAL = COLS * ROWS

const pool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80',
]
const labels = ['海','山','森','星','花','日']

const cards: CardData[] = Array.from({ length: TOTAL }, (_, i) => {
  const row = Math.floor(i / COLS); const col = i % COLS
  return { id: i, col, row, label: `${labels[row]}${col+1}`, image: pool[row], alt: labels[row] }
})

const trackHeight = `${(ROWS + 3) * 120}vh`

const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const headerRef = ref<HTMLElement|null>(null)
const lineRef = ref<HTMLElement|null>(null); const t1 = ref<HTMLElement|null>(null); const t2 = ref<HTMLElement|null>(null)
const sceneRef = ref<HTMLElement|null>(null); const gridRef = ref<HTMLElement|null>(null)
const progRef = ref<HTMLElement|null>(null)
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
  if (els.length) tl.fromTo(els,{autoAlpha:0,rotateX:90,z:-50},{autoAlpha:1,rotateX:0,z:0,duration:.45,stagger:.025,ease:'back.out(1.8)'},'-.25')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupDomino() {
  if (!scrollRef.value||!trackRef.value||!gridRef.value) return
  const sc=scrollRef.value; const track=trackRef.value
  const cardEls=cardRefs.value.filter(Boolean) as HTMLElement[]
  cardEls.forEach(el=>gsap.set(el,{rotateX:0,z:0}))
  if (sceneRef.value) gsap.set(sceneRef.value,{rotateX:35,rotateY:0})

  const master=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.6}})

  // 🔑 多米诺：对角线传播 (row+col) → 每张卡先倾倒(rotateX 85°)再弹回
  cardEls.forEach((el,idx)=>{
    const c=cards[idx]
    const phase=(c.row*0.22+c.col*0.12) // 对角线相位

    // 阶段1: 开始前倾
    master.to(el,{rotateX:45,z:-30,duration:.5,ease:'power2.in'},phase)
    // 阶段2: 完全倾覆
    master.to(el,{rotateX:85,z:-60,duration:.3,ease:'power3.in'},phase+.5)
    // 阶段3: 弹回 → 过冲
    master.to(el,{rotateX:-15,z:40,duration:.4,ease:'back.out(2.5)'},phase+.8)
    // 阶段4: 稳定回原位
    master.to(el,{rotateX:0,z:0,duration:.5,ease:'power2.out'},phase+1.2)
  })

  if (sceneRef.value) {
    master.to(sceneRef.value,{rotateX:50,rotateY:6,duration:ROWS*.8,ease:'sine.inOut'},0)
    master.to(sceneRef.value,{rotateX:30,rotateY:-4,duration:ROWS*.5,ease:'sine.inOut'},ROWS*.8)
  }
  if (progRef.value) master.to(progRef.value,{width:'100%',duration:ROWS},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupDomino()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.dc-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(160deg,#1a1a2e 0%,#16213e 30%,#0f3460 60%,#1a1a2e 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.dc-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(220,180,80,.15)}}
.dc-track{position:relative;width:100%}
.dc-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.dc-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.dc-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(220,180,80,.7);background:rgba(220,180,80,.06);backdrop-filter:blur(8px);border:1px solid rgba(220,180,80,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.4rem}
.dc-title{margin:0;display:flex;justify-content:center;gap:.08em}
.dc-title__c{font-size:clamp(1.8rem,4.5vw,3.8rem);font-weight:900;color:#d4a840;will-change:transform,opacity;&--alt{background:linear-gradient(135deg,#e8c860,#d4a040,#b88030);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.dc-line{width:70px;height:2px;margin:.3rem auto .45rem;border-radius:2px;background:linear-gradient(90deg,transparent,#d4a840,#e8c860,transparent);transform-origin:center}
.dc-sub{margin:0;font-size:clamp(.56rem,.8vw,.7rem);color:rgba(200,160,80,.3);max-width:460px;margin-inline:auto}
.dc-scene{position:absolute;top:52%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:650px;perspective-origin:50% 42%;will-change:transform}
.dc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;transform-style:preserve-3d;transform:rotateX(35deg);will-change:transform}
.dc-card{width:min(20vw,160px);height:min(15vw,120px);transform-style:preserve-3d;will-change:transform;transform-origin:bottom center;transition:filter .3s;cursor:pointer;&:hover{filter:brightness(1.2)}}
.dc-card__face{position:relative;width:100%;height:100%;border-radius:8px;overflow:hidden;backface-visibility:hidden;box-shadow:0 4px 22px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.15)}
.dc-card__img{width:100%;height:100%;object-fit:cover}
.dc-card__shine{position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 50%,rgba(255,255,255,.03) 100%);pointer-events:none}
.dc-card__label{position:absolute;bottom:4px;right:6px;z-index:2;font-size:.5rem;font-weight:700;letter-spacing:.08em;color:#fff;background:rgba(0,0,0,.25);backdrop-filter:blur(4px);border-radius:4px;padding:.06rem .35rem}
.dc-card__shadow{position:absolute;left:8%;bottom:-14px;width:84%;height:12px;background:radial-gradient(ellipse,rgba(0,0,0,.25) 0%,transparent 75%);border-radius:50%;transform:rotateX(90deg);pointer-events:none;will-change:transform,opacity}
.dc-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(220,180,80,.04)}
.dc-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#b88030,#e8c860,#b88030);box-shadow:0 0 10px rgba(220,180,80,.4)}
@media(max-width:768px){.dc-grid{gap:8px}.dc-card{width:20vw;height:15vw}.dc-title__c{font-size:1.4rem}}
</style>
