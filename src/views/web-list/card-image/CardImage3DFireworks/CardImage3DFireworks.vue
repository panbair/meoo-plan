<template>
  <section ref="rootRef" class="fw-root">
    <div ref="skyGlow" class="fw-sky"></div>
    <div ref="burstCenter" class="fw-burst-center"></div>

    <div ref="scrollRef" class="fw-scroll">
      <div ref="trackRef" class="fw-track" :style="{ height: trackHeight }">
        <div class="fw-sticky">

          <header ref="headerRef" class="fw-header">
            <span class="fw-kicker">🎆 CSS3 3D Fireworks · 图片烟花 ◈</span>
            <h1 class="fw-title">
              <span ref="tc1" class="fw-title__c">烟</span>
              <span ref="tc2" class="fw-title__c fw-title__c--burst">花</span>
              <span ref="tc3" class="fw-title__c">绽</span>
              <span ref="tc4" class="fw-title__c fw-title__c--burst">放</span>
            </h1>
            <div ref="lineRef" class="fw-line"></div>
            <p class="fw-sub">向下滚动 · 图片碎片如烟花从中心3D炸开 · 拖尾光迹 · 绚丽绽放</p>
          </header>

          <div ref="sceneRef" class="fw-scene">
            <div ref="fireworkRef" class="fw-firework">
              <!-- 多层花瓣环 -->
              <div
                v-for="spark in sparks"
                :key="spark.id"
                :ref="(el)=>setSparkRef(el as HTMLElement, spark.id)"
                class="fw-spark"
                :class="[`fw-spark--ring${spark.ring}`]"
              >
                <div class="fw-spark__head">
                  <img :src="spark.image" :alt="spark.alt" class="fw-spark__img" />
                </div>
                <div class="fw-spark__trail"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="fw-info">
            <span class="fw-info__dot"></span>
            <span class="fw-info__text">{{ burstPhase }}</span>
          </div>

          <div class="fw-progress"><div ref="progRef" class="fw-progress__fill"></div></div>
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

const SPARK_COUNT = 36, RINGS = 3
const trackHeight = `${7 * 100}vh`

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=150&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=150&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=150&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=150&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=150&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=150&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=150&q=80',
]

const sparks = Array.from({ length: SPARK_COUNT }, (_, i) => {
  const ring = i % RINGS
  const angleInRing = Math.floor(i / RINGS) / (SPARK_COUNT / RINGS) * Math.PI * 2
  return {
    id: i, ring,
    angle: angleInRing + ring * 0.5, // 每层错开角度
    dist: 80 + ring * 55,  // 外层更远
    image: imgPool[i % imgPool.length],
    alt: `火花${i}`,
  }
})

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const fireworkRef=ref<HTMLElement|null>(null)
const skyGlow=ref<HTMLElement|null>(null);const burstCenter=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const burstPhase=ref('蓄势')
const sparkRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setSparkRef(el:HTMLElement|null,idx:number){sparkRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,scale:.1,filter:'blur(30px)'},{autoAlpha:1,scale:1,filter:'blur(0px)',duration:.75,stagger:.12,ease:'back.out(3)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,scale:.5},{autoAlpha:1,scale:1,duration:1,ease:'power4.out'},'-.4')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupFireworks(){
  if(!scrollRef.value||!trackRef.value||!fireworkRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=sparkRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：所有火花收拢在中心
  els.forEach(el=>{gsap.set(el,{x:0,y:0,translateZ:0,scale:.1,opacity:0})})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){
        if(self.progress<.15)burstPhase.value='蓄势...'
        else if(self.progress<.4)burstPhase.value='🎆 绽放!'
        else if(self.progress<.7)burstPhase.value='漫天散落'
        else burstPhase.value='渐渐消逝'
      },
    },
  })

  // 🎆 烟花：从中心3D放射状炸开
  els.forEach((el,i)=>{
    const s=sparks[i]
    const targetX=Math.cos(s.angle)*s.dist
    const targetY=Math.sin(s.angle)*s.dist-20
    const targetZ=(s.ring-1)*60 // 不同环不同Z深度
    const rotX=(Math.random()>.5?1:-1)*(60+Math.random()*200)
    const rotZ=(Math.random()>.5?1:-1)*(80+Math.random()*200)

    // 蓄势→炸开
    master.fromTo(el,
      {x:0,y:0,translateZ:0,scale:.1,opacity:0},
      {x:targetX,y:targetY,translateZ:targetZ,scale:1,rotateX:rotX,rotateZ:rotZ,opacity:1,duration:2.5,ease:'power4.out'},
      .5+s.ring*.15
    )
    // 散开缓慢漂移
    master.to(el,{x:targetX*1.25,y:targetY*1.2-15,translateZ:targetZ+20,opacity:.7,duration:2.5,ease:'power2.out'},3.5+s.ring*.1)
    // 逐渐消逝
    master.to(el,{opacity:0,scale:.3,duration:1.5,ease:'power2.in'},6)
  })

  // 中心炸点脉冲
  if(burstCenter.value){
    master.to(burstCenter.value,{scale:5,opacity:1,duration:.3,ease:'power4.out'},.5)
    master.to(burstCenter.value,{scale:1,opacity:.3,duration:.8,ease:'power2.in'},.8)
    master.to(burstCenter.value,{scale:3,opacity:.7,duration:.3,ease:'power4.out'},2)
    master.to(burstCenter.value,{scale:0,opacity:0,duration:1,ease:'power2.in'},2.3)
  }

  if(skyGlow.value)master.to(skyGlow.value,{scale:1.5,opacity:.6,duration:1.5,ease:'power2.out'},.5)
  if(skyGlow.value)master.to(skyGlow.value,{opacity:.1,duration:4,ease:'power2.in'},3)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:7},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupFireworks()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.fw-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0a0c18 0%,#060810 60%,#020308 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.fw-sky{position:absolute;width:30vw;height:30vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(120,80,220,.08) 0%,transparent 60%);filter:blur(60px);pointer-events:none;z-index:0;will-change:transform,opacity}
.fw-burst-center{position:absolute;width:8px;height:8px;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:#fff;box-shadow:0 0 30px rgba(255,200,100,.9),0 0 60px rgba(255,150,50,.5);pointer-events:none;z-index:0;will-change:transform,opacity;opacity:.3}
.fw-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(160,100,220,.15)}}
.fw-track{position:relative;width:100%}.fw-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.fw-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.fw-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:rgba(200,150,240,.7);background:rgba(120,60,200,.08);backdrop-filter:blur(8px);border:1px solid rgba(140,80,220,.16);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.fw-title{margin:0;display:flex;justify-content:center;gap:.08em}
.fw-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#c0a0f0;will-change:transform,opacity;&--burst{background:linear-gradient(135deg,#f0a060,#ff4080,#a060f0,#40a0f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 20px rgba(200,150,240,.7))}}
.fw-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f0a060,#ff4080,#a060f0,#40a0f0,transparent);transform-origin:center}
.fw-sub{margin:0;font-size:clamp(.62rem,.88vw,.76rem);color:rgba(180,130,230,.3);max-width:540px;margin-inline:auto}
.fw-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:600px;perspective-origin:50% 50%;will-change:transform,opacity}
.fw-firework{position:relative;width:0;height:0;transform-style:preserve-3d}

.fw-spark{position:absolute;width:min(9vw,70px);height:min(6.5vw,52px);margin-left:calc(min(9vw,70px) / -2);margin-top:calc(min(6.5vw,52px) / -2);transform-style:preserve-3d;will-change:transform,opacity;
  &__head{border-radius:4px;overflow:hidden;box-shadow:0 0 16px rgba(255,180,60,.3)}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__trail{position:absolute;top:50%;left:50%;width:2px;height:30px;margin-left:-1px;margin-top:10px;background:linear-gradient(0deg,rgba(255,200,100,.6),transparent);transform-origin:50% 0;transform:rotateX(90deg)}
}

.fw-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.fw-info__dot{width:6px;height:6px;border-radius:50%;background:#f0a060;box-shadow:0 0 14px rgba(255,160,80,.7);animation:fw-pulse 2s ease-in-out infinite}
@keyframes fw-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.fw-info__text{font-size:.6rem;font-weight:600;color:rgba(240,160,80,.6);letter-spacing:.1em}
.fw-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(180,100,220,.05)}
.fw-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f0a060,#ff4080,#a060f0,#40a0f0,#f0a060);background-size:200% 100%;box-shadow:0 0 12px rgba(200,150,240,.6)}
@media(max-width:768px){.fw-header{top:2vh}.fw-kicker{font-size:.4rem;padding:.1rem .4rem}.fw-title__c{font-size:1.3rem}}
</style>
