<template>
  <section ref="rootRef" class="mg-root">
    <div ref="fieldGlow" class="mg-field-glow"></div>
    <div ref="northPole" class="mg-pole mg-pole--n"></div>
    <div ref="southPole" class="mg-pole mg-pole--s"></div>

    <div ref="scrollRef" class="mg-scroll">
      <div ref="trackRef" class="mg-track" :style="{ height: trackHeight }">
        <div class="mg-sticky">

          <header ref="headerRef" class="mg-header">
            <span class="mg-kicker">🧲 CSS3 3D Magnetic Field · 磁场重构 ◈</span>
            <h1 class="mg-title">
              <span ref="tc1" class="mg-title__c">磁</span>
              <span ref="tc2" class="mg-title__c mg-title__c--attract">场</span>
              <span ref="tc3" class="mg-title__c">重</span>
              <span ref="tc4" class="mg-title__c mg-title__c--attract">构</span>
            </h1>
            <div ref="lineRef" class="mg-line"></div>
            <p class="mg-sub">向下滚动 · 图片卡片沿磁力线排列 · 两极吸引 · 随场重构</p>
          </header>

          <div ref="sceneRef" class="mg-scene">
            <div ref="fieldRef" class="mg-field">
              <!-- 磁力线弧 -->
              <svg class="mg-flux-svg" viewBox="0 0 500 400">
                <path v-for="fl in 5" :key="fl" class="mg-flux-line" :d="fluxPath(fl)" />
              </svg>
              <!-- 图片铁屑 -->
              <div
                v-for="filing in filings"
                :key="filing.id"
                :ref="(el)=>setFilingRef(el as HTMLElement, filing.id)"
                class="mg-filing"
                :class="{ 'mg-filing--aligned': filing.aligned }"
              >
                <img :src="filing.image" :alt="filing.alt" class="mg-filing__img" />
                <!-- 磁化方向指示 -->
                <div class="mg-filing__pole mg-filing__pole--n"></div>
                <div class="mg-filing__pole mg-filing__pole--s"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="mg-info">
            <span class="mg-info__icon">🧲</span>
            <span class="mg-info__text">场强 {{ fieldStrength }}%</span>
          </div>

          <div class="mg-progress"><div ref="progRef" class="mg-progress__fill"></div></div>
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

const FILING_COUNT = 36
const trackHeight = `${7 * 100}vh`

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=180&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=180&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=180&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=180&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=180&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=180&q=80',
]

// 铁屑散布 → 被磁化后沿磁力线排列
const filings = Array.from({ length: FILING_COUNT }, (_, i) => {
  const scatterAngle = (i / FILING_COUNT) * Math.PI * 2
  const scatterR = 80 + Math.random() * 180
  // 目标位置：沿磁力线（从N到S的弧形路径上）
  const t = i / (FILING_COUNT - 1) // 0(N极) → 1(S极)
  const fluxY = t * 360 - 180
  const fluxX = Math.sin(t * Math.PI) * 120 // 弧线向外凸
  return {
    id: i,
    image: imgPool[i % imgPool.length], alt: `铁屑${i}`,
    scatterX: Math.cos(scatterAngle) * scatterR,
    scatterY: Math.sin(scatterAngle) * scatterR,
    scatterZ: (Math.random() - .5) * 200,
    fluxX, fluxY,
    fluxZ: (Math.random() - .5) * 40,
    scatterRX: Math.random() * 360, scatterRY: Math.random() * 360,
    aligned: false,
  }
})

const fluxPath = (fl: number) => {
  const amp = 30 + fl * 20
  return `M 250 20 Q ${250 + amp} 200 250 380`
}

const fieldStrength = ref(0)
const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const fieldRef=ref<HTMLElement|null>(null)
const fieldGlow=ref<HTMLElement|null>(null);const northPole=ref<HTMLElement|null>(null);const southPole=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const filingRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setFilingRef(el:HTMLElement|null,idx:number){filingRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,scale:.1,rotateZ:90},{autoAlpha:1,scale:1,rotateZ:0,duration:.7,stagger:.12,ease:'back.out(2.8)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-25,scale:.4},{autoAlpha:1,rotateX:-10,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupMagneticField(){
  if(!scrollRef.value||!trackRef.value||!fieldRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=filingRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：铁屑随机散布
  els.forEach((el,i)=>{
    const f=filings[i]
    gsap.set(el,{x:f.scatterX,y:f.scatterY,translateZ:f.scatterZ,rotateX:f.scatterRX,rotateY:f.scatterRY,scale:.5,opacity:.4})
  })

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){fieldStrength.value=Math.round(self.progress*100)},
    },
  })

  // 🧲 磁场增强 → 铁屑沿磁力线排列
  els.forEach((el,i)=>{
    const f=filings[i]
    const delay=f.id*.03
    // 旋转归正
    master.to(el,{rotateX:0,rotateY:0,scale:.8,duration:1.5,ease:'power2.inOut'},delay)
    // 移动到磁力线位置
    master.to(el,{x:f.fluxX,y:f.fluxY,translateZ:f.fluxZ,opacity:.85,duration:2.5,ease:'power3.out'},delay+1.5)
    // 磁场稳定后微振
    for(let w=0;w<4;w++){master.to(el,{x:f.fluxX+(Math.random()-.5)*8,y:f.fluxY+(Math.random()-.5)*6,duration:.25,ease:'sine.inOut'},delay+4+w*.5)}
  })

  // 磁极脉冲
  if(northPole.value){for(let w=0;w<5;w++){master.to(northPole.value,{scale:1.5,opacity:.7,duration:.2,ease:'power4.out'},w*1.2);master.to(northPole.value,{scale:1,opacity:.4,duration:.3,ease:'power2.in'},w*1.2+.2)}}
  if(southPole.value){for(let w=0;w<5;w++){master.to(southPole.value,{scale:1.5,opacity:.7,duration:.2,ease:'power4.out'},w*1.2+.3);master.to(southPole.value,{scale:1,opacity:.4,duration:.3,ease:'power2.in'},w*1.2+.5)}}
  if(fieldGlow.value)master.to(fieldGlow.value,{scale:1.4,opacity:.5,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupMagneticField()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.mg-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#12141c 0%,#0a0c14 60%,#040408 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.mg-field-glow{position:absolute;width:30vw;height:50vh;top:25vh;left:35vw;border-radius:50%;background:radial-gradient(ellipse,rgba(60,120,240,.08) 0%,transparent 60%);filter:blur(60px);pointer-events:none;z-index:0;will-change:transform,opacity}
.mg-pole{position:absolute;border-radius:50%;pointer-events:none;z-index:0;will-change:transform,opacity;&--n{width:16px;height:16px;top:10vh;left:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,#ff4040,rgba(255,60,60,.4));box-shadow:0 0 30px rgba(255,60,60,.5)}&--s{width:16px;height:16px;bottom:10vh;left:50%;transform:translate(-50%,50%);background:radial-gradient(circle,#4040ff,rgba(60,60,255,.4));box-shadow:0 0 30px rgba(60,60,255,.5)}}
.mg-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(80,140,240,.15)}}
.mg-track{position:relative;width:100%}.mg-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.mg-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.mg-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(120,170,230,.7);background:rgba(60,120,220,.08);backdrop-filter:blur(8px);border:1px solid rgba(80,140,220,.16);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.mg-title{margin:0;display:flex;justify-content:center;gap:.08em}
.mg-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#78a8e0;will-change:transform,opacity;&--attract{background:linear-gradient(135deg,#ff5060,#78a8e0,#4050ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 16px rgba(100,150,230,.6))}}
.mg-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#ff5060,#78a8e0,#4050ff,transparent);transform-origin:center}
.mg-sub{margin:0;font-size:clamp(.62rem,.88vw,.76rem);color:rgba(100,150,220,.3);max-width:540px;margin-inline:auto}
.mg-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:600px;perspective-origin:50% 50%;will-change:transform,opacity}
.mg-field{position:relative;width:0;height:0;transform-style:preserve-3d}

.mg-flux-svg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(40vw,340px);height:min(55vw,440px);margin-left:calc(min(40vw,340px) / -2);margin-top:calc(min(55vw,440px) / -2);pointer-events:none;opacity:.12}
.mg-flux-line{stroke:rgba(100,160,240,.5);stroke-width:1;fill:none;stroke-dasharray:3 6}

.mg-filing{position:absolute;width:min(8vw,64px);height:min(5.5vw,46px);margin-left:calc(min(8vw,64px) / -2);margin-top:calc(min(5.5vw,46px) / -2);transform-style:preserve-3d;will-change:transform,opacity;border-radius:3px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.25);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__pole{position:absolute;width:3px;height:8px;top:50%;transform:translateY(-50%);border-radius:1px;&--n{left:2px;background:rgba(255,80,80,.4)}&--s{right:2px;background:rgba(80,80,255,.4)}}
}

.mg-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.mg-info__icon{font-size:.9rem}.mg-info__text{font-size:.6rem;font-weight:600;color:rgba(120,170,230,.6);letter-spacing:.1em}
.mg-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(80,140,220,.05)}
.mg-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#ff5060,#78a8e0,#4050ff,#ff5060);background-size:200% 100%;box-shadow:0 0 12px rgba(100,150,230,.5)}
@media(max-width:768px){.mg-header{top:2vh}.mg-kicker{font-size:.4rem;padding:.1rem .4rem}.mg-title__c{font-size:1.3rem}}
</style>
