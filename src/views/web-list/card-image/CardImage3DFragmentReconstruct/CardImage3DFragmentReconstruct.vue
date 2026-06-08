<template>
  <section ref="rootRef" class="fr-root">
    <div ref="bgParticles" class="fr-particles"></div>
    <div ref="scrollRef" class="fr-scroll">
      <div ref="trackRef" class="fr-track" :style="{ height: trackHeight }">
        <div class="fr-sticky">
          <header ref="headerRef" class="fr-header">
            <span class="fr-kicker">🧩 Fragment Reconstruct · 碎片重构</span>
            <h1 class="fr-title"><span ref="t1" class="fr-title__c">碎片</span><span ref="t2" class="fr-title__c fr-title__c--alt">重构</span></h1>
            <div ref="lineRef" class="fr-line"></div>
            <p class="fr-sub">向下滚动 · 散落碎片从混沌中飞回 · 聚合重构完整画面</p>
          </header>

          <div ref="sceneRef" class="fr-scene">
            <div ref="gridRef" class="fr-grid" :style="gridStyle">
              <div v-for="card in cards" :key="card.id"
                :ref="(el) => setCardRef(el as HTMLElement, card.id)"
                class="fr-card"
                :style="{ gridColumn: card.homeCol+1, gridRow: card.homeRow+1 }"
              >
                <img :src="card.image" class="fr-card__img" />
              </div>
            </div>
          </div>

          <div ref="infoRef" class="fr-info">
            <span class="fr-info__pct">{{ reconstructPct }}%</span>
            <span class="fr-info__label">重构进度</span>
          </div>
          <div class="fr-progress"><div ref="progRef" class="fr-progress__fill"></div></div>
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
type TC = () => void

interface CardData { id: number; homeCol: number; homeRow: number; image: string
  scatterX: number; scatterY: number; scatterZ: number; scatterRotX: number; scatterRotY: number; scatterRotZ: number }

const COLS = 4; const ROWS = 4; const TOTAL = COLS * ROWS

// 用同一张大图的不同裁剪区域 (Unsplash 大图)
const baseImg = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80'
const baseImg2 = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'

function rng(min: number, max: number) { return min + Math.random() * (max - min) }
function rngSign(min: number, max: number) { return rng(min, max) * (Math.random() > 0.5 ? 1 : -1) }

const cards: CardData[] = Array.from({ length: TOTAL }, (_, i) => {
  const homeRow = Math.floor(i / COLS); const homeCol = i % COLS
  return {
    id: i, homeCol, homeRow,
    image: i < 8 ? baseImg : baseImg2,
    // 散落位置：大幅随机偏移
    scatterX: rngSign(150, 400),
    scatterY: rngSign(150, 350),
    scatterZ: rng(-200, 100),
    scatterRotX: rngSign(20, 90),
    scatterRotY: rngSign(20, 90),
    scatterRotZ: rngSign(15, 60),
  }
})

const trackHeight = `${(TOTAL + 3) * 120}vh`
const gridStyle = { gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }

const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const headerRef = ref<HTMLElement|null>(null)
const lineRef = ref<HTMLElement|null>(null); const t1 = ref<HTMLElement|null>(null); const t2 = ref<HTMLElement|null>(null)
const sceneRef = ref<HTMLElement|null>(null); const gridRef = ref<HTMLElement|null>(null)
const infoRef = ref<HTMLElement|null>(null); const progRef = ref<HTMLElement|null>(null)
const bgParticles = ref<HTMLElement|null>(null)
const reconstructPct = ref(0)
const cardRefs = ref<(HTMLElement|null)[]>([]); const cleanup: TC[] = []
function setCardRef(el: HTMLElement|null, idx: number) { cardRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value||!headerRef.value||!sceneRef.value) return
  const tl = gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo([t1.value,t2.value],{autoAlpha:0,y:80,filter:'blur(15px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.6,stagger:.1,ease:'power3.out'},'-.35')
    .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.45,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value,{autoAlpha:0},{autoAlpha:1,duration:.7,ease:'power2.out'},'-.2')
    .fromTo(infoRef.value,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.4,ease:'power2.out'},'-.1')
  cleanup.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupReconstruct() {
  if (!scrollRef.value||!trackRef.value) return
  const sc=scrollRef.value; const track=trackRef.value
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]

  // 🔑 初始：所有卡片散落（混沌状态）
  els.forEach((el,i)=>{
    const c=cards[i]
    gsap.set(el,{
      x:c.scatterX, y:c.scatterY, z:c.scatterZ,
      rotateX:c.scatterRotX, rotateY:c.scatterRotY, rotateZ:c.scatterRotZ,
      scale:.7, opacity:.5, filter:'blur(3px)',
    })
  })
  if (sceneRef.value) gsap.set(sceneRef.value,{rotateX:25,rotateY:0})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.4,
      onUpdate(self){reconstructPct.value=Math.round(self.progress*100)},
    },
  })

  // 🔑 重构：每张卡片从散落位置飞回原位
  els.forEach((el,i)=>{
    const midPhase=i/TOTAL*0.3 // 不同卡片在不同时刻开始重构（错开）
    const dur=0.5

    // 飞回原位
    master.to(el,{x:0,y:0,z:0,duration:dur*.4,ease:'power4.out'},midPhase)
    master.to(el,{rotateX:0,rotateY:0,rotateZ:0,duration:dur*.35,ease:'power3.out'},midPhase)
    master.to(el,{scale:1,opacity:1,filter:'blur(0px)',duration:dur*.3,ease:'power2.out'},midPhase+dur*.15)

    // 微弹跳（物理感）
    master.to(el,{scale:1.03,z:8,duration:.08,ease:'sine.out'},midPhase+dur*.35)
    master.to(el,{scale:1,z:0,duration:.12,ease:'power2.in'},midPhase+dur*.43)
  })

  // 场景视角从俯视→正视（配合重构）
  if (sceneRef.value) {
    master.to(sceneRef.value,{rotateX:45,rotateY:5,duration:TOTAL*.4,ease:'sine.inOut'},0)
    master.to(sceneRef.value,{rotateX:0,rotateY:0,duration:TOTAL*.4,ease:'power3.out'},TOTAL*.35)
  }
  if (progRef.value) master.to(progRef.value,{width:'100%',duration:TOTAL},0)
  cleanup.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function createParticles() {
  if (!bgParticles.value) return
  const c=bgParticles.value
  for (let i=0;i<40;i++) {
    const p=document.createElement('div'); p.className='fr-particle'
    p.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;animation-delay:${Math.random()*-8}s;animation-duration:${4+Math.random()*8}s;opacity:${.2+Math.random()*.3}`
    c.appendChild(p)
  }
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{
  createParticles()
  requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupReconstruct()}))
  window.addEventListener('resize',handleResize)
})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanup.forEach(f=>f());cleanup.length=0})
</script>

<style scoped lang="scss">
.fr-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#0a0c14 0%,#0f1220 30%,#0c0f1a 60%,#0a0c14 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.fr-particles{position:absolute;inset:0;z-index:0;pointer-events:none}
.fr-particle{position:absolute;border-radius:50%;background:rgba(180,200,240,.4);animation:frParticleFloat linear infinite}
@keyframes frParticleFloat{0%{transform:translateY(0) scale(1);opacity:0}20%{opacity:.5}80%{opacity:.3}100%{transform:translateY(-80vh) scale(.3);opacity:0}}
.fr-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.05)}}
.fr-track{position:relative;width:100%}
.fr-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.fr-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(90vw,640px)}
.fr-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(160,180,200,.45);background:rgba(255,255,255,.02);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.05);border-radius:999px;padding:.14rem .65rem;margin-bottom:.3rem}
.fr-title{margin:0;display:flex;justify-content:center;gap:.06em}
.fr-title__c{font-size:clamp(1.4rem,3.6vw,2.8rem);font-weight:900;color:#b0c0d8;will-change:transform,opacity;&--alt{background:linear-gradient(180deg,#e0dce8,#8070b0,#6050a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.fr-line{width:50px;height:1.5px;margin:.2rem auto .25rem;border-radius:2px;background:linear-gradient(90deg,transparent,#7060a0,#9080c0,transparent);transform-origin:center}
.fr-sub{margin:0;font-size:clamp(.44rem,.62vw,.54rem);color:rgba(140,160,180,.25);max-width:380px;margin-inline:auto}
.fr-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 45%;will-change:transform}
.fr-grid{display:grid;gap:6px;transform-style:preserve-3d;transform:rotateX(25deg);will-change:transform;width:min(52vw,420px)}
.fr-card{transform-style:preserve-3d;will-change:transform;border-radius:3px;overflow:hidden;aspect-ratio:1;box-shadow:0 4px 15px rgba(0,0,0,.3)}
.fr-card__img{width:100%;height:100%;object-fit:cover;display:block}
.fr-info{position:absolute;bottom:5vh;left:50%;transform:translateX(-50%);z-index:25;text-align:center;display:flex;flex-direction:column;align-items:center}
.fr-info__pct{font-size:1rem;font-weight:700;color:rgba(160,150,210,.35);font-family:'Georgia',serif}
.fr-info__label{font-size:.45rem;color:rgba(140,150,180,.2);letter-spacing:.1em}
.fr-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:1.5px;background:rgba(255,255,255,.01)}
.fr-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#6050a0,#8070c0,#6050a0)}
@media(max-width:768px){.fr-grid{width:70vw;gap:3px}}
</style>
