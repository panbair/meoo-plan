<template>
  <section ref="rootRef" class="cr-root">
    <div ref="coreGlow" class="cr-core-glow"></div>
    <div ref="prismLight" class="cr-prism"></div>

    <div ref="scrollRef" class="cr-scroll">
      <div ref="trackRef" class="cr-track" :style="{ height: trackHeight }">
        <div class="cr-sticky">

          <header ref="headerRef" class="cr-header">
            <span class="cr-kicker">💎 CSS3 3D Crystal Growth · 晶体生长 ◈</span>
            <h1 class="cr-title">
              <span ref="tc1" class="cr-title__c">晶</span><span ref="tc2" class="cr-title__c cr-title__c--crystal">体</span>
              <span ref="tc3" class="cr-title__c">生</span><span ref="tc4" class="cr-title__c cr-title__c--crystal">长</span>
            </h1>
            <div ref="lineRef" class="cr-line"></div>
            <p class="cr-sub">向下滚动 · 图片碎片从中心晶核向外结晶生长 · 六角晶柱 · 折射光效</p>
          </header>

          <div ref="sceneRef" class="cr-scene">
            <div ref="crystalRef" class="cr-crystal">
              <!-- 中心晶核 -->
              <div ref="nucleus" class="cr-nucleus">
                <img :src="nucleusImage" alt="晶核" class="cr-nucleus__img" />
                <div class="cr-nucleus__glow"></div>
              </div>
              <!-- 晶体枝干 — 6个方向辐射 -->
              <div v-for="branch in branches" :key="branch.id"
                :ref="(el)=>setBranchRef(el as HTMLElement, branch.id)"
                class="cr-branch"
                :style="{'--angle':branch.angle+'rad','--tilt':branch.tilt+'rad'}"
              >
                <!-- 枝干上的晶体面 -->
                <div v-for="seg in branch.segments" :key="seg.idx" class="cr-segment" :class="[`cr-segment--s${seg.idx}`]">
                  <img :src="seg.image" :alt="seg.alt" class="cr-segment__img" />
                  <div class="cr-segment__facet"></div>
                </div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="cr-info">
            <span class="cr-info__icon">💎</span><span class="cr-info__text">{{ growthStage }}</span>
          </div>
          <div class="cr-progress"><div ref="progRef" class="cr-progress__fill"></div></div>
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
const nucleusImage = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=300&q=80'

const segImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=200&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=200&q=80',
]

// 6个方向 × 4段 = 24个晶体面
const BRANCH_COUNT = 6, SEG_PER_BRANCH = 4
const branches = Array.from({length:BRANCH_COUNT},(_,i)=>({
  id:i, angle:(i/BRANCH_COUNT)*Math.PI*2, tilt:(i%3-1)*.35,
  segments: Array.from({length:SEG_PER_BRANCH},(_,s)=>({idx:s,image:segImages[(i*SEG_PER_BRANCH+s)%segImages.length],alt:`晶体面${i}-${s}`}))
}))

const growthStage=ref('晶核')
const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const crystalRef=ref<HTMLElement|null>(null);const nucleus=ref<HTMLElement|null>(null)
const coreGlow=ref<HTMLElement|null>(null);const prismLight=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const branchRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setBranchRef(el:HTMLElement|null,idx:number){branchRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,scale:.1,filter:'blur(30px)'},{autoAlpha:1,scale:1,filter:'blur(0px)',duration:.75,stagger:.12,ease:'back.out(3)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-20,scale:.4},{autoAlpha:1,rotateX:-6,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupCrystalGrowth(){
  if(!scrollRef.value||!trackRef.value||!crystalRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const bEls=branchRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：所有枝干收缩在晶核
  bEls.forEach(el=>gsap.set(el,{scale:0,opacity:0}))
  if(nucleus.value)gsap.set(nucleus.value,{scale:.8,opacity:.5})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){
        if(self.progress<.2)growthStage.value='晶核形成'
        else if(self.progress<.5)growthStage.value='晶体生长中...'
        else if(self.progress<.8)growthStage.value='枝干延伸'
        else growthStage.value='💎 结晶完成'
      },
    },
  })

  // 💎 晶核先亮起
  if(nucleus.value){
    master.to(nucleus.value,{scale:1,opacity:1,duration:1.5,ease:'power2.out'},0)
    master.to(nucleus.value,{scale:1.1,duration:.3,ease:'sine.inOut'},1.5)
    master.to(nucleus.value,{scale:1,duration:.3,ease:'sine.inOut'},1.8)
  }

  // 6个枝干从晶核向外生长
  bEls.forEach((el,i)=>{
    const delay=1.5+i*.15
    master.fromTo(el,{scale:0,opacity:0},{scale:1,opacity:.85,duration:2.5,ease:'power3.out'},delay)
    // 生长后微振
    master.to(el,{scale:1.05,opacity:.9,duration:.15,ease:'sine.inOut'},delay+2.5)
    master.to(el,{scale:1,opacity:.85,duration:.2,ease:'sine.inOut'},delay+2.65)
  })

  if(crystalRef.value){master.to(crystalRef.value,{rotateZ:60,duration:3,ease:'sine.inOut'},0);master.to(crystalRef.value,{rotateZ:-30,rotateX:-8,duration:3,ease:'sine.inOut'},3)}
  if(coreGlow.value)master.to(coreGlow.value,{scale:1.6,opacity:.6,duration:6},0)
  if(prismLight.value)master.to(prismLight.value,{opacity:.4,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupCrystalGrowth()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.cr-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0a0c18 0%,#040610 60%,#010208 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.cr-core-glow{position:absolute;width:20vw;height:20vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(100,200,240,.25) 0%,rgba(60,160,220,.1) 30%,transparent 60%);filter:blur(50px);pointer-events:none;z-index:0;will-change:transform,opacity}
.cr-prism{position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(135deg,transparent 40%,rgba(100,200,240,.03) 45%,rgba(200,150,240,.03) 50%,rgba(100,200,240,.03) 55%,transparent 60%);will-change:opacity;opacity:.2}
.cr-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(100,180,220,.15)}}
.cr-track{position:relative;width:100%}.cr-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.cr-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.cr-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.28em;color:rgba(120,200,240,.7);background:rgba(40,140,220,.08);backdrop-filter:blur(8px);border:1px solid rgba(60,160,220,.16);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.cr-title{margin:0;display:flex;justify-content:center;gap:.08em}
.cr-title__c{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#60c0e0;will-change:transform,opacity;&--crystal{background:linear-gradient(135deg,#60c0e0,#a0d0f0,#c080f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 16px rgba(80,200,240,.6))}}
.cr-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#60c0e0,#a0d0f0,#c080f0,transparent)}
.cr-sub{margin:0;font-size:clamp(.62rem,.88vw,.76rem);color:rgba(80,180,220,.3);max-width:540px;margin-inline:auto}
.cr-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:600px;perspective-origin:50% 50%;will-change:transform,opacity}
.cr-crystal{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.cr-nucleus{position:absolute;width:min(15vw,120px);height:min(15vw,120px);margin-left:calc(min(15vw,120px)/-2);margin-top:calc(min(15vw,120px)/-2);border-radius:50%;overflow:hidden;box-shadow:0 0 40px rgba(100,200,240,.3),0 0 0 2px rgba(255,255,255,.2);will-change:transform,opacity;&__img{width:100%;height:100%;object-fit:cover;display:block}&__glow{position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(circle,rgba(100,220,255,.3) 30%,transparent 70%);pointer-events:none}}

.cr-branch{position:absolute;width:0;height:0;transform-style:preserve-3d;will-change:transform,opacity;
  // 6个方向排列
  transform:rotate(var(--angle)) rotateX(var(--tilt));
}
.cr-segment{position:absolute;width:min(8vw,65px);height:min(10vw,80px);transform-style:preserve-3d;will-change:transform;border-radius:2px;overflow:hidden;box-shadow:0 0 12px rgba(100,200,240,.15);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__facet{position:absolute;inset:0;background:linear-gradient(180deg,rgba(200,240,255,.15) 0%,transparent 40%,rgba(100,200,240,.1) 100%);pointer-events:none}
  // 逐段向外排列
  &--s0{left:-32px;top:-40px;transform:translateZ(40px)}
  &--s1{left:-32px;top:-40px;transform:translateZ(100px)}
  &--s2{left:-32px;top:-40px;transform:translateZ(165px)}
  &--s3{left:-32px;top:-40px;transform:translateZ(235px)}
}

.cr-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.cr-info__icon{font-size:.9rem}.cr-info__text{font-size:.6rem;font-weight:600;color:rgba(100,200,240,.6);letter-spacing:.1em}
.cr-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(60,160,220,.05)}
.cr-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#60c0e0,#a0d0f0,#c080f0,#60c0e0);background-size:200% 100%;box-shadow:0 0 12px rgba(80,200,240,.5)}
@media(max-width:768px){.cr-header{top:2vh}.cr-kicker{font-size:.4rem;padding:.1rem .4rem}.cr-title__c{font-size:1.3rem}}
</style>
