<template>
  <section ref="rootRef" class="sp-root">
    <div ref="tableGlow" class="sp-table"></div>
    <div ref="scrollRef" class="sp-scroll">
      <div ref="trackRef" class="sp-track" :style="{ height: trackHeight }">
        <div class="sp-sticky">
          <header ref="headerRef" class="sp-header">
            <span class="sp-kicker">🂡 Deck Spread · 展牌平铺</span>
            <h1 class="sp-title"><span ref="t1" class="sp-title__c">展牌</span><span ref="t2" class="sp-title__c sp-title__c--alt">平铺</span></h1>
            <div ref="lineRef" class="sp-line"></div>
            <p class="sp-sub">向下滚动 · 牌叠从中心逐张飞出 · 最终平铺成一行</p>
          </header>

          <div ref="sceneRef" class="sp-scene">
            <div v-for="card in cards" :key="card.id"
              :ref="(el) => setCardRef(el as HTMLElement, card.id)"
              class="sp-card"
            >
              <img :src="card.image" :alt="card.alt" class="sp-card__img" />
              <span class="sp-card__no">{{ card.id + 1 }}</span>
            </div>
          </div>

          <div ref="infoRef" class="sp-info">
            <span class="sp-info__text">{{ spreadLabel }}</span>
          </div>
          <div class="sp-progress"><div ref="progRef" class="sp-progress__fill"></div></div>
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

const TOTAL = 15
const trackHeight = `${7 * 100}vh`

const pool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=200&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=200&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&q=80',
]
const cards = Array.from({length:TOTAL},(_,i)=>({id:i,image:pool[i%pool.length],alt:`牌${i}`}))

const spreadLabel=ref('牌叠中')
const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const t1=ref<HTMLElement|null>(null);const t2=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null)
const tableGlow=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<(HTMLElement|null)[]>([]);const cleanup:TC[]=[]
function setCardRef(el:HTMLElement|null,idx:number){cardRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo([t1.value,t2.value],{autoAlpha:0,y:80,filter:'blur(15px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.6,stagger:.1,ease:'power3.out'},'-.35')
    .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.45,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value,{autoAlpha:0},{autoAlpha:1,duration:.7,ease:'power2.out'},'-.2')
    .fromTo(infoRef.value,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.4,ease:'power2.out'},'-.1')
  cleanup.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupSpread(){
  if(!scrollRef.value||!trackRef.value)return
  const sc=scrollRef.value;const track=trackRef.value
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]

  // 🔑 牌叠初始：所有牌堆在中心，微偏移显示层叠
  const SPREAD_WIDTH = 560 // 平铺总宽度
  const startX = -SPREAD_WIDTH / 2
  const stepX = SPREAD_WIDTH / (TOTAL - 1)

  els.forEach((el,i)=>{
    gsap.set(el,{x:0,y:i*2-15,z:i*2,rotateX:0,rotateY:0,rotateZ:0,scale:1})
  })
  if(sceneRef.value) gsap.set(sceneRef.value,{rotateX:10,rotateY:0})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){
        const p=self.progress
        if(p<.15) spreadLabel.value='牌叠中...'
        else if(p<.5) spreadLabel.value='🂡 展开中...'
        else if(p<.85) spreadLabel.value='平铺排列'
        else spreadLabel.value='全部展开 ✓'
      },
    },
  })

  // 🔑 展牌动画：逐张飞出到横向位置
  els.forEach((el,i)=>{
    const targetX = startX + stepX * i
    const phase = i * 0.04 // 牌顶(大i)先飞

    // 轻微抬起
    master.to(el,{z:30+i*2,rotateX:-8,duration:.4,ease:'power2.out'},phase)
    // 飞向目标X + Y归零
    master.to(el,{x:targetX,y:0,z:15,rotateX:-3,duration:.7,ease:'power3.out'},phase+.25)
    // 微弹落位
    master.to(el,{z:0,rotateX:0,duration:.3,ease:'back.out(1.5)'},phase+.8)
    // 微呼吸（后半段）
    master.to(el,{z:3,rotateX:-1,duration:.15,ease:'sine.inOut'},phase+1.5)
    master.to(el,{z:0,rotateX:0,duration:.2,ease:'power2.in'},phase+1.65)
  })

  if(sceneRef.value){
    master.to(sceneRef.value,{rotateX:25,rotateY:5,duration:4,ease:'sine.inOut'},0)
    master.to(sceneRef.value,{rotateX:5,rotateY:0,duration:2.5,ease:'power2.out'},3)
  }
  if(tableGlow.value) master.to(tableGlow.value,{scale:1.3,opacity:.6,duration:6},0)
  if(progRef.value) master.to(progRef.value,{width:'100%',duration:6},0)
  cleanup.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupSpread()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanup.forEach(f=>f());cleanup.length=0})
</script>

<style scoped lang="scss">
.sp-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#1a2820 0%,#0e1a14 60%,#060c08 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.sp-table{position:absolute;width:60vw;height:20vh;top:58vh;left:20vw;border-radius:50%;background:radial-gradient(ellipse,rgba(40,120,60,.12) 0%,transparent 60%);filter:blur(50px);pointer-events:none;z-index:0;will-change:transform,opacity}
.sp-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(60,140,80,.12)}}
.sp-track{position:relative;width:100%}.sp-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.sp-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(90vw,640px)}
.sp-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;color:rgba(100,200,120,.6);background:rgba(40,140,60,.06);backdrop-filter:blur(6px);border:1px solid rgba(60,160,80,.12);border-radius:999px;padding:.14rem .7rem;margin-bottom:.3rem}
.sp-title{margin:0;display:flex;justify-content:center;gap:.06em}
.sp-title__c{font-size:clamp(1.4rem,3.6vw,2.6rem);font-weight:900;color:#50c070;will-change:transform,opacity;&--alt{background:linear-gradient(135deg,#50c070,#40a060,#80d890);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.sp-line{width:55px;height:1.5px;margin:.2rem auto .25rem;border-radius:2px;background:linear-gradient(90deg,transparent,#50c070,#40a060,#80d890,transparent)}
.sp-sub{margin:0;font-size:clamp(.44rem,.6vw,.52rem);color:rgba(60,160,80,.25);max-width:380px;margin-inline:auto}
.sp-scene{position:absolute;top:48%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 50%;will-change:transform,opacity;width:0;height:0;transform-style:preserve-3d}

.sp-card{position:absolute;width:min(12.5vw,100px);height:min(17.5vw,140px);margin-left:calc(min(12.5vw,100px)/-2);margin-top:calc(min(17.5vw,140px)/-2);transform-style:preserve-3d;will-change:transform;border-radius:4px;overflow:hidden;box-shadow:0 3px 14px rgba(0,0,0,.35),0 0 0 1px rgba(255,255,255,.1);cursor:pointer;transition:filter .2s;&:hover{filter:brightness(1.15);z-index:99}}
.sp-card__img{width:100%;height:100%;object-fit:cover;display:block}
.sp-card__no{position:absolute;bottom:4px;right:6px;font-size:.45rem;font-weight:700;color:#fff;background:rgba(0,0,0,.3);border-radius:3px;padding:.04rem .3rem}

.sp-info{position:absolute;bottom:6vh;left:50%;transform:translateX(-50%);z-index:25;text-align:center}
.sp-info__text{font-size:.55rem;font-weight:600;color:rgba(80,180,100,.5);letter-spacing:.08em}
.sp-progress{position:absolute;left:0;bottom:0;width:100%;height:2px;background:rgba(40,140,60,.04)}
.sp-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#50c070,#40a060,#80d890,#50c070);background-size:200% 100%}
@media(max-width:768px){.sp-card{width:17vw;height:24vw;margin-left:calc(17vw/-2);margin-top:calc(24vw/-2)}}
</style>
