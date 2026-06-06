<template>
  <section ref="rootRef" class="rp-root">
    <div ref="waterGlow" class="rp-water-glow"></div>
    <div ref="causticA" class="rp-caustic rp-caustic--a"></div>
    <div ref="causticB" class="rp-caustic rp-caustic--b"></div>

    <div ref="scrollRef" class="rp-scroll">
      <div ref="trackRef" class="rp-track" :style="{ height: trackHeight }">
        <div class="rp-sticky">

          <header ref="headerRef" class="rp-header">
            <span class="rp-kicker">🌊 CSS3 3D Ripple Pond · 涟漪池塘 ◈</span>
            <h1 class="rp-title">
              <span ref="tc1" class="rp-title__c">涟</span>
              <span ref="tc2" class="rp-title__c rp-title__c--wave">漪</span>
              <span ref="tc3" class="rp-title__c">池</span>
              <span ref="tc4" class="rp-title__c rp-title__c--wave">塘</span>
            </h1>
            <div ref="lineRef" class="rp-line"></div>
            <p class="rp-sub">向下滚动 · 中心投石 · 圆形涟漪向外扩散 · 图片随波纹起伏</p>
          </header>

          <div ref="sceneRef" class="rp-scene">
            <div ref="pondRef" class="rp-pond">
              <div
                v-for="card in rippleCards"
                :key="card.id"
                :ref="(el)=>setCardRef(el as HTMLElement, card.id)"
                class="rp-card"
                :style="{ '--dist': card.dist, '--angle': card.angle+'rad' }"
              >
                <img :src="card.image" :alt="card.alt" class="rp-card__img" />
                <div class="rp-card__watermark"></div>
                <!-- 水滴投影 -->
                <div class="rp-card__shadow"></div>
              </div>
              <!-- 中心投石点 -->
              <div ref="dropPoint" class="rp-drop-point">
                <div class="rp-drop-point__core"></div>
                <div class="rp-drop-point__ring rp-drop-point__ring--1"></div>
                <div class="rp-drop-point__ring rp-drop-point__ring--2"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="rp-info">
            <span class="rp-info__dot"></span>
            <span class="rp-info__text">波纹 {{ currentWave }} / {{ MAX_WAVES }}</span>
          </div>

          <div class="rp-progress"><div ref="progRef" class="rp-progress__fill"></div></div>
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

const COLS = 9, ROWS = 7, TOTAL = COLS * ROWS, MAX_WAVES = 5
const trackHeight = `${8 * 100}vh`

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=300&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=300&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=80',
]

const rippleCards = Array.from({ length: TOTAL }, (_, i) => {
  const col = i % COLS, row = Math.floor(i / COLS)
  const cx = (col - (COLS - 1) / 2), cy = (row - (ROWS - 1) / 2)
  const dist = Math.sqrt(cx * cx + cy * cy)  // 到中心的欧几里得距离
  const angle = Math.atan2(cy, cx)
  return { id: i, col, row, dist, angle, image: imgPool[i % imgPool.length], alt: `卡${i}` }
})

const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const headerRef = ref<HTMLElement|null>(null)
const lineRef = ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const pondRef=ref<HTMLElement|null>(null)
const dropPoint=ref<HTMLElement|null>(null)
const waterGlow=ref<HTMLElement|null>(null);const causticA=ref<HTMLElement|null>(null);const causticB=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const currentWave=ref(1)
const cardRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setCardRef(el:HTMLElement|null,idx:number){cardRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:120,filter:'blur(20px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-35,scale:.5},{autoAlpha:1,rotateX:-20,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  // 卡片从中心向外弹入
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]
  if(els.length)tl.fromTo(els,{autoAlpha:0,scale:0,translateZ:-100},{autoAlpha:1,scale:1,translateZ:0,duration:.45,stagger:.03,ease:'back.out(2)'},'-.6')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupRipplePond(){
  if(!scrollRef.value||!trackRef.value||!pondRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：所有卡片平展
  els.forEach(el=>gsap.set(el,{translateZ:0,rotateX:0,rotateY:0}))
  if(pondRef.value)gsap.set(pondRef.value,{rotateX:-20})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){currentWave.value=Math.min(MAX_WAVES,Math.max(1,Math.ceil(self.progress*MAX_WAVES)))},
    },
  })

  const WAVE_AMP = 80, WAVE_SPEED = 0.6

  // 🌊 圆形涟漪：每张卡片根据到中心的距离获得相位延迟
  els.forEach((el,i)=>{
    const card=rippleCards[i]
    const phase=card.dist*0.18  // 距离越远延迟越大

    // 波形1: 升起→落下 (第一波涟漪)
    master.to(el,{translateZ:WAVE_AMP,rotateX:-8,rotateY:card.angle>0?5:-5,duration:.6,ease:'power2.out'},phase*WAVE_SPEED)
    master.to(el,{translateZ:-20,rotateX:3,rotateY:0,duration:.7,ease:'power2.in'},phase*WAVE_SPEED+.6)
    // 波形2: 第二波较弱
    master.to(el,{translateZ:WAVE_AMP*.5,rotateX:-4,duration:.5,ease:'power2.out'},phase*WAVE_SPEED+2)
    master.to(el,{translateZ:0,rotateX:0,rotateY:0,duration:.6,ease:'power2.in'},phase*WAVE_SPEED+2.5)
    // 波形3: 第三波更弱
    master.to(el,{translateZ:WAVE_AMP*.25,rotateX:-2,duration:.4,ease:'power2.out'},phase*WAVE_SPEED+3.8)
    master.to(el,{translateZ:0,rotateX:0,duration:.5,ease:'power2.in'},phase*WAVE_SPEED+4.2)
  })

  // 投石点脉冲
  if(dropPoint.value){
    for(let w=0;w<MAX_WAVES;w++){
      master.to(dropPoint.value,{scale:2,opacity:.8,duration:.15,ease:'power4.out'},w*1.6)
      master.to(dropPoint.value,{scale:1,opacity:.4,duration:.4,ease:'power2.in'},w*1.6+.15)
    }
  }

  // 水光
  if(waterGlow.value)master.to(waterGlow.value,{scale:1.5,opacity:.6,duration:7,ease:'sine.inOut'},0)
  if(causticA.value)master.to(causticA.value,{x:'5vw',y:'-3vh',opacity:.4,duration:7},0)
  if(causticB.value)master.to(causticB.value,{x:'-3vw',y:'5vh',opacity:.3,duration:7},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:7},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupRipplePond()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.rp-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#0a1620 0%,#0c1a28 20%,#0b1824 40%,#0d1c2a 60%,#0a1520 80%,#09141c 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.rp-water-glow{position:absolute;width:40vw;height:30vw;top:25vh;left:30vw;border-radius:50%;background:radial-gradient(ellipse,rgba(40,140,220,.15) 0%,transparent 60%);filter:blur(80px);pointer-events:none;z-index:0;will-change:transform,opacity}
.rp-caustic{position:absolute;border-radius:50%;filter:blur(50px);pointer-events:none;z-index:0;will-change:transform,opacity;&--a{width:25vw;height:18vw;top:15vh;left:20vw;background:radial-gradient(ellipse,rgba(60,180,240,.12) 0%,transparent 70%)}&--b{width:20vw;height:15vw;bottom:20vh;right:18vw;background:radial-gradient(ellipse,rgba(40,160,220,.1) 0%,transparent 70%)}}
.rp-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(60,160,220,.15)}}
.rp-track{position:relative;width:100%}.rp-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.rp-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.rp-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(80,180,240,.7);background:rgba(40,140,220,.08);backdrop-filter:blur(8px);border:1px solid rgba(60,160,220,.16);border-radius:999px;padding:.22rem .9rem;margin-bottom:.5rem}
.rp-title{margin:0;display:flex;justify-content:center;gap:.08em}
.rp-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#50a0d8;will-change:transform,opacity;&--wave{background:linear-gradient(135deg,#50a0d8,#40c8d0,#80b8f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 16px rgba(60,160,230,.5))}}
.rp-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#50a0d8,#40c8d0,#80b8f0,transparent);transform-origin:center}
.rp-sub{margin:0;font-size:clamp(.64rem,.9vw,.78rem);color:rgba(80,160,220,.3);max-width:530px;margin-inline:auto}
.rp-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 50%;will-change:transform,opacity}
.rp-pond{position:relative;width:min(62vw,560px);height:min(44vw,390px);margin-left:calc(min(62vw,560px) / -2);margin-top:calc(min(44vw,390px) / -2);transform-style:preserve-3d;will-change:transform;display:grid;grid-template-columns:repeat(9,1fr);grid-template-rows:repeat(7,1fr);gap:3px}

.rp-card{transform-style:preserve-3d;will-change:transform,opacity;border-radius:4px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.2);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__watermark{position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(40,140,220,.08) 100%);pointer-events:none}
  &__shadow{position:absolute;bottom:-6px;left:10%;width:80%;height:8px;background:radial-gradient(ellipse,rgba(0,0,0,.25) 0%,transparent 70%);border-radius:50%;transform:rotateX(90deg);pointer-events:none}
}

.rp-drop-point{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:20;pointer-events:none;will-change:transform,opacity;opacity:.4;
  &__core{width:10px;height:10px;margin-left:-5px;margin-top:-5px;border-radius:50%;background:#80d0f0;box-shadow:0 0 20px rgba(100,200,240,.8)}
  &__ring{position:absolute;top:50%;left:50%;border-radius:50%;border:1px solid rgba(100,200,240,.3);transform:translate(-50%,-50%);
    &--1{width:30px;height:30px}&--2{width:50px;height:50px}
  }
}

.rp-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.rp-info__dot{width:6px;height:6px;border-radius:50%;background:#50a0d8;box-shadow:0 0 12px rgba(60,160,230,.6);animation:rp-pulse 2s ease-in-out infinite}
@keyframes rp-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.rp-info__text{font-size:.6rem;font-weight:600;color:rgba(80,170,230,.6);letter-spacing:.1em}
.rp-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(60,150,220,.05)}
.rp-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#50a0d8,#40c8d0,#80b8f0,#50a0d8);background-size:200% 100%;box-shadow:0 0 12px rgba(60,160,230,.5)}
@media(max-width:768px){.rp-header{top:2vh}.rp-kicker{font-size:.42rem;padding:.1rem .4rem}.rp-title__c{font-size:1.3rem}}
</style>
