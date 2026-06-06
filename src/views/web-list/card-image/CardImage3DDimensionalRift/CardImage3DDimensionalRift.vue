<template>
  <section ref="rootRef" class="dr-root">
    <div ref="tearGlow" class="dr-tear-glow"></div>

    <div ref="scrollRef" class="dr-scroll">
      <div ref="trackRef" class="dr-track" :style="{ height: trackHeight }">
        <div class="dr-sticky">

          <header ref="headerRef" class="dr-header">
            <span class="dr-kicker">⚡ CSS3 3D Dimensional Rift · 维度裂缝 ◈</span>
            <h1 class="dr-title">
              <span ref="tc1" class="dr-title__c">维</span><span ref="tc2" class="dr-title__c dr-title__c--rift">度</span>
              <span ref="tc3" class="dr-title__c">裂</span><span ref="tc4" class="dr-title__c dr-title__c--rift">缝</span>
            </h1>
            <div ref="lineRef" class="dr-line"></div>
            <p class="dr-sub">向下滚动 · 2D图片面裂开 · 碎片向两侧剥离 · 露出内部3D空间</p>
          </header>

          <div ref="sceneRef" class="dr-scene">
            <!-- 内部3D空间 — 藏在裂缝后 -->
            <div ref="innerSpace" class="dr-inner">
              <div class="dr-inner__depth">
                <img :src="innerImage" alt="内部空间" class="dr-inner__img" />
                <div class="dr-inner__particles">
                  <span v-for="p in 8" :key="p" class="dr-inner__particle" :style="{'--px':(p*45)+'deg','--pd':(1+p*0.3)+'s'}"></span>
                </div>
              </div>
            </div>
            <!-- 剥落的图片碎片 — 左右各6片 -->
            <div ref="peelLeft" class="dr-peel dr-peel--left">
              <div v-for="s in 6" :key="'L'+s" :ref="(el)=>setPeelRef(el as HTMLElement, 'L'+(s-1))" class="dr-fragment dr-fragment--left">
                <img :src="fragmentImg(s-1)" class="dr-fragment__img" />
              </div>
            </div>
            <div ref="peelRight" class="dr-peel dr-peel--right">
              <div v-for="s in 6" :key="'R'+s" :ref="(el)=>setPeelRef(el as HTMLElement, 'R'+(s-1))" class="dr-fragment dr-fragment--right">
                <img :src="fragmentImg(s+5)" class="dr-fragment__img" />
              </div>
            </div>
            <!-- 撕裂中心线 -->
            <div ref="riftLine" class="dr-rift-line">
              <div class="dr-rift-line__core"></div>
              <div class="dr-rift-line__energy"></div>
            </div>
          </div>

          <div ref="infoRef" class="dr-info">
            <span class="dr-info__dot"></span><span class="dr-info__text">{{ riftState }}</span>
          </div>
          <div class="dr-progress"><div ref="progRef" class="dr-progress__fill"></div></div>
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

const trackHeight = `${8 * 100}vh`
const innerImage = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80'
const fragImgs = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=250&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=250&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=250&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=250&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=250&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=250&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=250&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=250&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=250&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=250&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=250&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=250&q=80',
]
const fragmentImg = (i:number)=>fragImgs[i%fragImgs.length]
const riftState=ref('完整')

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const innerSpace=ref<HTMLElement|null>(null)
const peelLeft=ref<HTMLElement|null>(null);const peelRight=ref<HTMLElement|null>(null);const riftLine=ref<HTMLElement|null>(null)
const tearGlow=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const peelRefs=ref<Record<string,HTMLElement|null>>({});const cleanupFns:TweenCleanup[]=[]
function setPeelRef(el:HTMLElement|null,key:string){peelRefs.value[key]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,scale:.1,filter:'blur(30px)'},{autoAlpha:1,scale:1,filter:'blur(0px)',duration:.75,stagger:.12,ease:'back.out(3)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupDimensionalRift(){
  if(!scrollRef.value||!trackRef.value||!sceneRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const allFrags=Object.values(peelRefs.value).filter(Boolean) as HTMLElement[]

  // 初始：碎片平展覆盖（完整状态）
  allFrags.forEach(el=>gsap.set(el,{x:0,y:0,translateZ:0,rotateX:0,rotateY:0,scale:1,opacity:1}))
  // 内部空间初始隐藏
  if(innerSpace.value)gsap.set(innerSpace.value,{scale:.3,opacity:0})
  if(riftLine.value)gsap.set(riftLine.value,{scaleY:0,opacity:0})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){
        if(self.progress<.2)riftState.value='表面完整'
        else if(self.progress<.5)riftState.value='⚡ 裂缝出现'
        else if(self.progress<.8)riftState.value='维度撕裂中...'
        else riftState.value='内部空间显现'
      },
    },
  })

  // ⚡ 维度撕裂：碎片向两侧3D剥离
  allFrags.forEach((el,i)=>{
    const isLeft=i<6
    const stripIdx=isLeft?i:i-6
    const delay=stripIdx*.12
    // 左碎片向左+Z向后剥离
    if(isLeft){
      master.to(el,{x:-60-stripIdx*20,translateZ:-40-stripIdx*30,rotateY:-15-stripIdx*8,rotateX:stripIdx*5,opacity:.85,duration:3,ease:'power3.out'},delay+0.5)
    }else{
      master.to(el,{x:60+stripIdx*20,translateZ:-40-stripIdx*30,rotateY:15+stripIdx*8,rotateX:stripIdx*5,opacity:.85,duration:3,ease:'power3.out'},delay+0.5)
    }
  })

  // 内部3D空间从裂缝中展现
  if(innerSpace.value){
    master.to(innerSpace.value,{scale:1,opacity:1,duration:2.5,ease:'power3.out'},1)
    master.to(innerSpace.value,{rotateX:-5,rotateY:8,duration:2,ease:'sine.inOut'},3.5)
    master.to(innerSpace.value,{rotateX:3,rotateY:-5,duration:2,ease:'sine.inOut'},5.5)
  }
  // 裂缝线
  if(riftLine.value){
    master.to(riftLine.value,{scaleY:1,opacity:.8,duration:.8,ease:'power3.out'},.5)
    for(let w=0;w<6;w++){master.to(riftLine.value,{opacity:.9,duration:.15,ease:'sine.inOut'},1.3+w*.8);master.to(riftLine.value,{opacity:.5,duration:.2,ease:'sine.inOut'},1.45+w*.8)}
  }

  if(tearGlow.value)master.to(tearGlow.value,{scale:2,opacity:.6,duration:5,ease:'power2.in'},0.5)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:7},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupDimensionalRift()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.dr-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0c0c18 0%,#04040c 60%,#000 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.dr-tear-glow{position:absolute;width:3vw;height:50vh;top:25vh;left:50%;transform:translateX(-50%);background:linear-gradient(180deg,transparent 0%,rgba(255,200,100,.3) 20%,rgba(255,150,50,.5) 50%,rgba(255,200,100,.3) 80%,transparent 100%);filter:blur(20px);pointer-events:none;z-index:0;will-change:transform,opacity;opacity:.3}
.dr-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,160,50,.1)}}
.dr-track{position:relative;width:100%}.dr-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.dr-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.dr-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(255,180,100,.7);background:rgba(200,120,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(220,140,50,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.dr-title{margin:0;display:flex;justify-content:center;gap:.08em}
.dr-title__c{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#f0a040;will-change:transform,opacity;&--rift{background:linear-gradient(135deg,#f0a040,#ff7040,#f0c050);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 18px rgba(255,160,50,.7))}}
.dr-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f0a040,#ff7040,#f0c050,transparent)}
.dr-sub{margin:0;font-size:clamp(.6rem,.85vw,.74rem);color:rgba(240,160,50,.3);max-width:540px;margin-inline:auto}
.dr-scene{position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;perspective:600px;perspective-origin:50% 50%}

.dr-inner{position:absolute;inset:8% 15%;z-index:5;transform-style:preserve-3d;will-change:transform,opacity;overflow:hidden;border-radius:6px;
  &__depth{position:relative;width:100%;height:100%}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__particles{position:absolute;inset:0;pointer-events:none}
  &__particle{position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(255,200,100,.6);top:50%;left:50%;animation:dr-float 3s ease-in-out infinite;animation-delay:var(--pd);transform:translate(-50%,-50%) rotate(var(--px)) translateX(80px)}
}
@keyframes dr-float{0%,100%{opacity:.2;transform:translate(-50%,-50%) rotate(var(--px)) translateX(40px)}50%{opacity:.8;transform:translate(-50%,-50%) rotate(var(--px)) translateX(120px)}}

.dr-peel{position:absolute;inset:0;z-index:10;display:flex;flex-direction:column;justify-content:center;align-items:center;
  &--left{left:0;right:52%}&--right{right:0;left:52%}
}
.dr-fragment{position:absolute;width:min(18vw,150px);height:min(5vw,45px);transform-style:preserve-3d;will-change:transform,opacity;border-radius:3px;overflow:hidden;box-shadow:0 3px 16px rgba(0,0,0,.35);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &--left{left:0;margin-top:calc(var(--idx,0)*55px - 160px)}
  &--right{right:0;margin-top:calc(var(--idx,0)*55px - 160px)}
}
// 6个碎片分别定位
.dr-fragment--left:nth-child(1){--idx:0}.dr-fragment--left:nth-child(2){--idx:1}.dr-fragment--left:nth-child(3){--idx:2}
.dr-fragment--left:nth-child(4){--idx:3}.dr-fragment--left:nth-child(5){--idx:4}.dr-fragment--left:nth-child(6){--idx:5}
.dr-fragment--right:nth-child(1){--idx:0}.dr-fragment--right:nth-child(2){--idx:1}.dr-fragment--right:nth-child(3){--idx:2}
.dr-fragment--right:nth-child(4){--idx:3}.dr-fragment--right:nth-child(5){--idx:4}.dr-fragment--right:nth-child(6){--idx:5}

.dr-rift-line{position:absolute;top:15%;left:50%;transform:translateX(-50%);width:3px;height:70%;z-index:15;pointer-events:none;will-change:transform,opacity;
  &__core{width:100%;height:100%;background:linear-gradient(180deg,transparent 0%,rgba(255,200,80,.9) 20%,rgba(255,255,200,1) 50%,rgba(255,200,80,.9) 80%,transparent 100%);filter:blur(1px)}
  &__energy{position:absolute;inset:-8px -4px;background:linear-gradient(180deg,transparent 0%,rgba(255,150,30,.4) 20%,rgba(255,220,100,.6) 50%,rgba(255,150,30,.4) 80%,transparent 100%);filter:blur(8px)}
}

.dr-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.dr-info__dot{width:6px;height:6px;border-radius:50%;background:#f0a040;box-shadow:0 0 14px rgba(255,160,50,.7);animation:dr-pulse 2s ease-in-out infinite}
@keyframes dr-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.dr-info__text{font-size:.6rem;font-weight:600;color:rgba(255,170,60,.6);letter-spacing:.1em}
.dr-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(220,140,40,.05)}
.dr-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f0a040,#ff7040,#f0c050,#f0a040);background-size:200% 100%;box-shadow:0 0 12px rgba(255,160,50,.5)}
@media(max-width:768px){.dr-header{top:2vh}.dr-kicker{font-size:.38rem;padding:.1rem .4rem}.dr-title__c{font-size:1.3rem}}
</style>
