<template>
  <section ref="rootRef" class="ds-root">
    <div ref="feltGlow" class="ds-felt"></div>
    <div ref="cardShadow" class="ds-shadow"></div>

    <div ref="scrollRef" class="ds-scroll">
      <div ref="trackRef" class="ds-track" :style="{ height: trackHeight }">
        <div class="ds-sticky">

          <header ref="headerRef" class="ds-header">
            <span class="ds-kicker">🃏 CSS3 3D Deck Shuffle · 扑克洗牌 ◈</span>
            <h1 class="ds-title">
              <span ref="tc1" class="ds-title__c">扑</span><span ref="tc2" class="ds-title__c ds-title__c--shuffle">克</span>
              <span ref="tc3" class="ds-title__c">洗</span><span ref="tc4" class="ds-title__c ds-title__c--shuffle">牌</span>
            </h1>
            <div ref="lineRef" class="ds-line"></div>
            <p class="ds-sub">向下滚动 · 图片卡牌在3D空间分叠洗牌 · 交错穿插 · 重新叠合</p>
          </header>

          <div ref="sceneRef" class="ds-scene">
            <div ref="deckRef" class="ds-deck">
              <!-- 左叠 — 15张 -->
              <div v-for="card in leftPile" :key="'L'+card.id"
                :ref="(el)=>setCardRef(el as HTMLElement, 'L'+card.id)"
                class="ds-card ds-card--left"
              >
                <img :src="card.image" :alt="card.alt" class="ds-card__img" />
              </div>
              <!-- 右叠 — 15张 -->
              <div v-for="card in rightPile" :key="'R'+card.id"
                :ref="(el)=>setCardRef(el as HTMLElement, 'R'+card.id)"
                class="ds-card ds-card--right"
              >
                <img :src="card.image" :alt="card.alt" class="ds-card__img" />
              </div>
            </div>
          </div>

          <div ref="infoRef" class="ds-info">
            <span class="ds-info__icon">🃏</span><span class="ds-info__text">{{ shufflePhase }}</span>
          </div>
          <div class="ds-progress"><div ref="progRef" class="ds-progress__fill"></div></div>
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

const PILE_SIZE = 15
const trackHeight = `${7 * 100}vh`

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=200&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=200&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=200&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&q=80',
]

const leftPile = Array.from({length:PILE_SIZE},(_,i)=>({id:i,image:imgPool[i%imgPool.length],alt:`左牌${i}`}))
const rightPile = Array.from({length:PILE_SIZE},(_,i)=>({id:i,image:imgPool[(i+4)%imgPool.length],alt:`右牌${i}`}))

const shufflePhase=ref('叠好')
const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const deckRef=ref<HTMLElement|null>(null)
const feltGlow=ref<HTMLElement|null>(null);const cardShadow=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<Record<string,HTMLElement|null>>({});const cleanupFns:TweenCleanup[]=[]
function setCardRef(el:HTMLElement|null,key:string){cardRefs.value[key]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,rotateY:90,scale:.2},{autoAlpha:1,rotateY:0,scale:1,duration:.7,stagger:.12,ease:'back.out(2.5)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-15,scale:.5},{autoAlpha:1,rotateX:-5,scale:1,duration:1,ease:'power4.out'},'-.4')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupDeckShuffle(){
  if(!scrollRef.value||!trackRef.value||!deckRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value

  // 初始：两叠牌各在一边，叠好
  const allLeft=Object.entries(cardRefs.value).filter(([k])=>k.startsWith('L')).map(([,el])=>el!).filter(Boolean)
  const allRight=Object.entries(cardRefs.value).filter(([k])=>k.startsWith('R')).map(([,el])=>el!).filter(Boolean)
  allLeft.forEach((el,i)=>{gsap.set(el,{x:-100,y:i*3-25,z:i*2})})
  allRight.forEach((el,i)=>{gsap.set(el,{x:100,y:i*3-25,z:i*2})})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){
        if(self.progress<.25)shufflePhase.value='两叠分离'
        else if(self.progress<.5)shufflePhase.value='🃏 洗牌中...'
        else if(self.progress<.75)shufflePhase.value='交错穿插'
        else shufflePhase.value='叠合完成'
      },
    },
  })

  // 🃏 洗牌动画：两叠向中间移动→拉起→交错→落下叠合
  allLeft.forEach((el,i)=>{
    // 向中间推开
    master.to(el,{x:-37,rotateZ:-5,duration:.8,ease:'power2.inOut'},i*.04)
    // 向上拉起
    master.to(el,{y:-37-i*5,z:75+i*4,rotateX:-15,duration:.8,ease:'power2.out'},1.2+i*.03)
    // 向右偏移（交错）
    master.to(el,{x:18,rotateZ:3,duration:.6,ease:'power2.inOut'},2.5+i*.03)
    // 落下叠合
    master.to(el,{y:0,z:0,x:0,duration:1,ease:'power2.in'},3.5+i*.04)
  })
  allRight.forEach((el,i)=>{
    master.to(el,{x:37,rotateZ:5,duration:.8,ease:'power2.inOut'},i*.04)
    master.to(el,{y:-37-i*5,z:75+i*4,rotateX:-15,duration:.8,ease:'power2.out'},1.2+i*.03)
    master.to(el,{x:-18,rotateZ:-3,duration:.6,ease:'power2.inOut'},2.5+i*.03)
    master.to(el,{y:0,z:0,x:0,duration:1,ease:'power2.in'},3.5+i*.04)
  })

  if(deckRef.value){master.to(deckRef.value,{rotateX:-5,duration:1},0);master.to(deckRef.value,{rotateY:20,duration:2.5,ease:'sine.inOut'},2);master.to(deckRef.value,{rotateY:-10,duration:2,ease:'sine.inOut'},5)}
  if(feltGlow.value)master.to(feltGlow.value,{scale:1.2,opacity:.5,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupDeckShuffle()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ds-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#1a2820 0%,#0e1a14 60%,#060c08 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.ds-felt{position:absolute;width:50vw;height:30vh;top:55vh;left:25vw;border-radius:50%;background:radial-gradient(ellipse,rgba(40,120,60,.1) 0%,transparent 60%);filter:blur(50px);pointer-events:none;z-index:0;will-change:transform,opacity}
.ds-shadow{position:absolute;width:40vw;height:10vh;top:70vh;left:30vw;border-radius:50%;background:radial-gradient(ellipse,rgba(0,0,0,.3) 0%,transparent 70%);filter:blur(15px);pointer-events:none;z-index:0}
.ds-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(60,140,80,.15)}}
.ds-track{position:relative;width:100%}.ds-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ds-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.ds-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.28em;color:rgba(100,200,120,.7);background:rgba(40,140,60,.08);backdrop-filter:blur(8px);border:1px solid rgba(60,160,80,.16);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.ds-title{margin:0;display:flex;justify-content:center;gap:.08em}
.ds-title__c{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#50c070;will-change:transform,opacity;&--shuffle{background:linear-gradient(135deg,#50c070,#40a060,#80d890);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(60,180,80,.5))}}
.ds-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#50c070,#40a060,#80d890,transparent)}
.ds-sub{margin:0;font-size:clamp(.62rem,.88vw,.76rem);color:rgba(60,160,80,.3);max-width:530px;margin-inline:auto}
.ds-scene{position:absolute;top:48%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:600px;perspective-origin:50% 50%;will-change:transform,opacity}
.ds-deck{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.ds-card{position:absolute;width:min(12.5vw,100px);height:min(17.5vw,140px);margin-left:calc(min(12.5vw,100px)/-2);margin-top:calc(min(17.5vw,140px)/-2);transform-style:preserve-3d;will-change:transform,opacity;border-radius:4px;overflow:hidden;box-shadow:0 3px 14px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.1);backface-visibility:hidden;
  &__img{width:100%;height:100%;object-fit:cover;display:block}
}

.ds-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.ds-info__icon{font-size:.9rem}.ds-info__text{font-size:.6rem;font-weight:600;color:rgba(80,180,100,.6);letter-spacing:.1em}
.ds-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(40,140,60,.05)}
.ds-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#50c070,#40a060,#80d890,#50c070);background-size:200% 100%;box-shadow:0 0 10px rgba(60,180,80,.5)}
@media(max-width:768px){.ds-header{top:2vh}.ds-kicker{font-size:.4rem;padding:.1rem .4rem}.ds-title__c{font-size:1.3rem}}
</style>
