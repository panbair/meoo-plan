<template>
  <section ref="rootRef" class="ch-root">
    <div ref="tableGlow" class="ch-glow"></div>
    <div ref="spotlight" class="ch-spot"></div>

    <div ref="scrollRef" class="ch-scroll">
      <div ref="trackRef" class="ch-track" :style="{ height: trackHeight }">
        <div class="ch-sticky">

          <header ref="headerRef" class="ch-header">
            <span class="ch-kicker">🏠 CSS3 3D Card House · 纸牌屋 ◈</span>
            <h1 class="ch-title">
              <span ref="tc1" class="ch-title__c">纸</span><span ref="tc2" class="ch-title__c ch-title__c--house">牌</span>
              <span ref="tc3" class="ch-title__c">屋</span><span ref="tc4" class="ch-title__c ch-title__c--house">塔</span>
            </h1>
            <div ref="lineRef" class="ch-line"></div>
            <p class="ch-sub">向下滚动 · 图片卡片搭成3D金字塔塔 · 逐层搭建 · 纸牌结构</p>
          </header>

          <div ref="sceneRef" class="ch-scene">
            <div ref="towerRef" class="ch-tower">
              <!-- 底层 — 5对三角形支撑 -->
              <div v-for="level in 4" :key="level" class="ch-level" :class="[`ch-level--l${level}`]">
                <div v-for="pair in (6-level)" :key="pair" class="ch-pair" :class="[`ch-pair--p${pair}`]">
                  <!-- 左倾牌 -->
                  <div :ref="(el)=>setCardRef(el as HTMLElement, `L${level}-${pair}`)" class="ch-card ch-card--left">
                    <img :src="cardImage((level-1)*10+(pair-1)*2)" class="ch-card__img" />
                  </div>
                  <!-- 右倾牌 -->
                  <div :ref="(el)=>setCardRef(el as HTMLElement, `R${level}-${pair}`)" class="ch-card ch-card--right">
                    <img :src="cardImage((level-1)*10+(pair-1)*2+1)" class="ch-card__img" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="ch-info">
            <span class="ch-info__icon">🏠</span><span class="ch-info__text">纸牌塔 {{ builtLevels }}/4 层</span>
          </div>
          <div class="ch-progress"><div ref="progRef" class="ch-progress__fill"></div></div>
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
const cardImage = (i: number) => imgPool[i % imgPool.length]

// 总共: 5+4+3+2=14对=28张牌
const totalPairs = 5+4+3+2
const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const towerRef=ref<HTMLElement|null>(null)
const tableGlow=ref<HTMLElement|null>(null);const spotlight=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const builtLevels=ref(0)
const cardRefs=ref<Record<string,HTMLElement|null>>({});const cleanupFns:TweenCleanup[]=[]
function setCardRef(el:HTMLElement|null,key:string){cardRefs.value[key]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:100,filter:'blur(16px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-25,scale:.5},{autoAlpha:1,rotateX:-10,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupCardHouse(){
  if(!scrollRef.value||!trackRef.value||!towerRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const tower=towerRef.value

  // 所有牌初始折叠(rotateX:85° 平躺)→搭建
  const allCards=Object.values(cardRefs.value).filter(Boolean) as HTMLElement[]
  allCards.forEach(el=>{gsap.set(el,{transformOrigin:'50% 100%',rotateX:85,opacity:.3})})
  if(tower)gsap.set(tower,{rotateX:-10})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){builtLevels.value=Math.min(4,Math.max(0,Math.floor(self.progress*4.2)))},
    },
  })

  // 🏠 逐层搭建（从底层到顶层）
  const levels=[5,4,3,2] // 每层对数
  let totalDelay=0
  levels.forEach((pairs,lvl)=>{
    for(let p=0;p<pairs;p++){
      const lKey=`L${lvl+1}-${p+1}`;const rKey=`R${lvl+1}-${p+1}`
      const lCard=cardRefs.value[lKey];const rCard=cardRefs.value[rKey]
      const delay=totalDelay+p*.15+lvl*.3
      // 左牌立起(rotateX:85→0, rotateZ:-15°)
      if(lCard){
        master.fromTo(lCard,{rotateX:85,rotateZ:0},{rotateX:0,rotateZ:-15,opacity:1,duration:.8,ease:'power2.out'},delay)
        master.to(lCard,{rotateZ:-18,duration:.08,ease:'sine.out'},delay+.8)
        master.to(lCard,{rotateZ:-14,duration:.12,ease:'sine.inOut'},delay+.88)
      }
      // 右牌立起(rotateX:85→0, rotateZ:+15°)
      if(rCard){
        master.fromTo(rCard,{rotateX:85,rotateZ:0},{rotateX:0,rotateZ:15,opacity:1,duration:.8,ease:'power2.out'},delay+.15)
        master.to(rCard,{rotateZ:18,duration:.08,ease:'sine.out'},delay+.95)
        master.to(rCard,{rotateZ:14,duration:.12,ease:'sine.inOut'},delay+1.03)
      }
    }
    totalDelay+=pairs*.15+lvl*.3+1
  })

  if(tower){master.to(tower,{rotateY:15,duration:3,ease:'sine.inOut'},0);master.to(tower,{rotateY:-8,duration:3,ease:'sine.inOut'},3.5)}
  if(tableGlow.value)master.to(tableGlow.value,{scale:1.3,opacity:.5,duration:6},0)
  if(spotlight.value)master.to(spotlight.value,{y:'-3vh',opacity:.4,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupCardHouse()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ch-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 45%,#1c1814 0%,#100c08 60%,#080604 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.ch-glow{position:absolute;width:40vw;height:25vw;top:30vh;left:30vw;border-radius:50%;background:radial-gradient(ellipse,rgba(255,200,140,.08) 0%,transparent 60%);filter:blur(60px);pointer-events:none;z-index:0;will-change:transform,opacity}
.ch-spot{position:absolute;width:30vw;height:20vw;top:10vh;left:35vw;border-radius:50%;background:radial-gradient(ellipse at 50% 0%,rgba(255,220,160,.15) 0%,transparent 70%);filter:blur(50px);pointer-events:none;z-index:0}
.ch-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(200,150,100,.15)}}
.ch-track{position:relative;width:100%}.ch-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ch-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.ch-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.28em;color:rgba(220,160,80,.7);background:rgba(180,120,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(200,140,60,.16);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.ch-title{margin:0;display:flex;justify-content:center;gap:.08em}
.ch-title__c{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#d0a050;will-change:transform,opacity;&--house{background:linear-gradient(135deg,#e0b060,#c08030,#f0c870);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(220,160,60,.5))}}
.ch-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#e0b060,#c08030,#f0c870,transparent)}
.ch-sub{margin:0;font-size:clamp(.62rem,.88vw,.76rem);color:rgba(200,140,60,.3);max-width:530px;margin-inline:auto}
.ch-scene{position:absolute;top:52%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 45%;will-change:transform,opacity}
.ch-tower{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.ch-level{position:absolute;width:0;height:0;transform-style:preserve-3d;
  &--l1{margin-top:60px}&--l2{margin-top:0}&--l3{margin-top:-50px}&--l4{margin-top:-95px}
}
.ch-pair{position:absolute;width:0;height:0;transform-style:preserve-3d;
  &--p1{left:-180px}&--p2{left:-90px}&--p3{left:0}&--p4{left:90px}&--p5{left:180px}
}

$cardW:min(11vw,90px);$cardH:min(16vw,130px);
.ch-card{position:absolute;bottom:0;width:$cardW;height:$cardH;transform-style:preserve-3d;will-change:transform,opacity;border-radius:3px;overflow:hidden;box-shadow:0 3px 12px rgba(0,0,0,.3);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &--left{left:0;transform-origin:50% 100%}
  &--right{left:calc($cardW - 4px);transform-origin:50% 100%}
}

.ch-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.ch-info__icon{font-size:.9rem}.ch-info__text{font-size:.6rem;font-weight:600;color:rgba(220,160,60,.6);letter-spacing:.1em}
.ch-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(200,140,40,.05)}
.ch-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#e0b060,#c08030,#f0c870,#e0b060);background-size:200% 100%;box-shadow:0 0 10px rgba(220,160,60,.5)}
@media(max-width:768px){.ch-header{top:2vh}.ch-kicker{font-size:.4rem;padding:.1rem .4rem}.ch-title__c{font-size:1.3rem}}
</style>
