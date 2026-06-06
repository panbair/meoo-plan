<template>
  <section ref="rootRef" class="fs-root">
    <div ref="creaseGlow" class="fs-crease"></div>

    <div ref="scrollRef" class="fs-scroll">
      <div ref="trackRef" class="fs-track" :style="{ height: trackHeight }">
        <div class="fs-sticky">

          <header ref="headerRef" class="fs-header">
            <span class="fs-kicker">📐 CSS3 3D Fold Space · 折叠空间 ◈</span>
            <h1 class="fs-title">
              <span ref="tc1" class="fs-title__c">折</span><span ref="tc2" class="fs-title__c fs-title__c--fold">叠</span>
              <span ref="tc3" class="fs-title__c">空</span><span ref="tc4" class="fs-title__c fs-title__c--fold">间</span>
            </h1>
            <div ref="lineRef" class="fs-line"></div>
            <p class="fs-sub">向下滚动 · 空间沿对角线折叠 · 两个半面各载图片世界 · 对折展开</p>
          </header>

          <div ref="sceneRef" class="fs-scene">
            <div ref="foldRef" class="fs-fold">
              <!-- 左下半空间 — 保持水平 -->
              <div ref="halfA" class="fs-half fs-half--a">
                <div class="fs-half__panel">
                  <img :src="worldA[0]" alt="A-远" class="fs-half__img" />
                </div>
                <div class="fs-half__panel fs-half__panel--r">
                  <img :src="worldA[1]" alt="A-右" class="fs-half__img" />
                </div>
                <div class="fs-half__panel fs-half__panel--b">
                  <img :src="worldA[2]" alt="A-底" class="fs-half__img" />
                </div>
                <!-- A空间中的悬浮卡片 -->
                <div v-for="c in 3" :key="'A'+c"
                  :ref="(el)=>setCardRef(el as HTMLElement, 'A'+(c-1))"
                  class="fs-card fs-card--a"
                >
                  <img :src="cardImgs[c-1]" class="fs-card__img" />
                </div>
              </div>
              <!-- 右上半空间 — 沿对角线折叠 -->
              <div ref="halfB" class="fs-half fs-half--b">
                <div class="fs-half__panel">
                  <img :src="worldB[0]" alt="B-远" class="fs-half__img" />
                </div>
                <div class="fs-half__panel fs-half__panel--l">
                  <img :src="worldB[1]" alt="B-左" class="fs-half__img" />
                </div>
                <div class="fs-half__panel fs-half__panel--t">
                  <img :src="worldB[2]" alt="B-顶" class="fs-half__img" />
                </div>
                <div v-for="c in 3" :key="'B'+c"
                  :ref="(el)=>setCardRef(el as HTMLElement, 'B'+(c-1))"
                  class="fs-card fs-card--b"
                >
                  <img :src="cardImgs[c+3]" class="fs-card__img" />
                </div>
              </div>
              <!-- 折叠线 -->
              <div ref="foldLine" class="fs-fold-line">
                <div class="fs-fold-line__glow"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="fs-info">
            <span class="fs-info__dot"></span><span class="fs-info__text">{{ foldState }}</span>
          </div>
          <div class="fs-progress"><div ref="progRef" class="fs-progress__fill"></div></div>
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
const worldA = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80',
]
const worldB = [
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
]
const cardImgs = [
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=150&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=150&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=150&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=150&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=150&q=80',
]
const foldState=ref('空间展开')

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const foldRef=ref<HTMLElement|null>(null)
const halfA=ref<HTMLElement|null>(null);const halfB=ref<HTMLElement|null>(null);const foldLine=ref<HTMLElement|null>(null)
const creaseGlow=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<Record<string,HTMLElement|null>>({});const cleanupFns:TweenCleanup[]=[]
function setCardRef(el:HTMLElement|null,key:string){cardRefs.value[key]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,rotateX:90,scale:.3},{autoAlpha:1,rotateX:0,scale:1,duration:.7,stagger:.12,ease:'back.out(2.5)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-30,scale:.4},{autoAlpha:1,rotateX:-10,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupFoldSpace(){
  if(!scrollRef.value||!trackRef.value||!foldRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value

  // 初始：两半展开（180°平）
  if(halfA.value)gsap.set(halfA.value,{rotateX:0})
  if(halfB.value)gsap.set(halfB.value,{rotateX:0,transformOrigin:'0% 0%'})
  if(foldLine.value)gsap.set(foldLine.value,{opacity:.4})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){
        if(self.progress<.25)foldState.value='空间平展'
        else if(self.progress<.5)foldState.value='📐 开始折叠...'
        else if(self.progress<.75)foldState.value='空间对折中...'
        else foldState.value='两面相对'
      },
    },
  })

  // 📐 折叠：B半绕折叠线旋转(rotateX)，从平展→折叠到与A半垂直
  if(halfB.value){
    master.to(halfB.value,{rotateX:15,duration:1.5,ease:'power2.inOut'},0) // 微抬
    master.to(halfB.value,{rotateX:-60,rotateY:10,duration:2.5,ease:'power3.out'},1.5) // 折叠
    master.to(halfB.value,{rotateX:-85,rotateY:5,duration:2,ease:'power2.out'},4) // 近乎对折
  }
  // A半微调保持稳定
  if(halfA.value){
    master.to(halfA.value,{rotateX:-8,duration:1.5,ease:'power2.inOut'},0)
    master.to(halfA.value,{rotateX:3,duration:3,ease:'sine.inOut'},2)
  }

  // 折叠线脉冲
  if(foldLine.value){
    for(let w=0;w<5;w++){master.to(foldLine.value,{opacity:.7,duration:.3,ease:'sine.inOut'},1+w*1.2);master.to(foldLine.value,{opacity:.3,duration:.4,ease:'sine.inOut'},1.3+w*1.2)}
  }

  // 悬浮卡片随空间折叠移动
  const aCards=[cardRefs.value['A0'],cardRefs.value['A1'],cardRefs.value['A2']].filter(Boolean) as HTMLElement[]
  const bCards=[cardRefs.value['B0'],cardRefs.value['B1'],cardRefs.value['B2']].filter(Boolean) as HTMLElement[]
  aCards.forEach((el,i)=>{master.to(el,{y:-10-i*8,duration:3,ease:'sine.inOut'},0);master.to(el,{y:5+i*5,duration:3,ease:'sine.inOut'},3)})
  bCards.forEach((el,i)=>{master.to(el,{y:-15-i*10,opacity:.8,duration:3.5,ease:'power2.out'},1);
    for(let w=0;w<4;w++){master.to(el,{x:(i%2?8:-8),duration:.6,ease:'sine.inOut'},w*1.5);master.to(el,{x:0,duration:.6,ease:'sine.inOut'},w*1.5+.6)}})

  if(creaseGlow.value)master.to(creaseGlow.value,{scale:1.8,opacity:.6,duration:6,ease:'power2.in'},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupFoldSpace()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.fs-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 40%,#101420 0%,#080a14 60%,#020408 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.fs-crease{position:absolute;width:60vw;height:3px;top:58%;left:20vw;background:linear-gradient(90deg,transparent 5%,rgba(255,200,100,.15) 30%,rgba(255,180,60,.3) 50%,rgba(255,200,100,.15) 70%,transparent 95%);filter:blur(4px);pointer-events:none;z-index:0;will-change:transform,opacity}
.fs-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,160,50,.1)}}
.fs-track{position:relative;width:100%}.fs-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.fs-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.fs-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(255,180,80,.7);background:rgba(200,120,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(220,140,50,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.fs-title{margin:0;display:flex;justify-content:center;gap:.08em}
.fs-title__c{display:inline-block;font-size:clamp(1.9rem,4.5vw,3.8rem);font-weight:900;color:#f0a840;will-change:transform,opacity;&--fold{background:linear-gradient(135deg,#f0a840,#ff7040,#f0c850);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 16px rgba(255,170,60,.6))}}
.fs-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f0a840,#ff7040,#f0c850,transparent)}
.fs-sub{margin:0;font-size:clamp(.58rem,.82vw,.7rem);color:rgba(240,160,50,.3);max-width:550px;margin-inline:auto}
.fs-scene{position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 50%;will-change:transform,opacity}
.fs-fold{position:relative;width:0;height:0;transform-style:preserve-3d}

.fs-half{position:absolute;width:min(38vw,320px);height:min(28vw,230px);transform-style:preserve-3d;will-change:transform;
  &--a{margin-left:calc(min(38vw,320px) / -2 - 80px);margin-top:calc(min(28vw,230px) / -2 + 40px)}
  &--b{margin-left:calc(min(38vw,320px) / -2 + 80px);margin-top:calc(min(28vw,230px) / -2 - 40px);transform-origin:0% 0%}
  &__panel{position:absolute;width:100%;height:100%;border-radius:4px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.25);backface-visibility:hidden;
    &--r{transform:translateX(50%) rotateY(90deg);transform-origin:left;width:60%}
    &--l{transform:translateX(-50%) rotateY(-90deg);transform-origin:right;width:60%}
    &--b{transform:translateY(50%) rotateX(-90deg);transform-origin:top;height:60%;width:100%}
    &--t{transform:translateY(-50%) rotateX(90deg);transform-origin:bottom;height:60%;width:100%}
  }
  &__img{width:100%;height:100%;object-fit:cover;display:block}
}

.fs-card{position:absolute;width:min(9vw,70px);height:min(6vw,50px);border-radius:3px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.2);transform-style:preserve-3d;will-change:transform;
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &--a{&:nth-child(4){top:-30px;left:-50px}&:nth-child(5){top:20px;left:-70px}&:nth-child(6){top:-10px;left:-90px}}
  &--b{&:nth-child(4){top:-40px;right:-50px}&:nth-child(5){top:10px;right:-70px}&:nth-child(6){top:-20px;right:-90px}}
}

.fs-fold-line{position:absolute;width:100%;height:2px;top:0;left:0;pointer-events:none;will-change:opacity;
  &__glow{width:100%;height:4px;background:linear-gradient(90deg,transparent 5%,rgba(255,200,80,.5) 30%,rgba(255,240,150,.8) 50%,rgba(255,200,80,.5) 70%,transparent 95%);filter:blur(3px)}
}

.fs-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.fs-info__dot{width:6px;height:6px;border-radius:50%;background:#f0a840;box-shadow:0 0 14px rgba(255,170,60,.6);animation:fs-pulse 2s ease-in-out infinite}
@keyframes fs-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.fs-info__text{font-size:.6rem;font-weight:600;color:rgba(250,170,50,.6);letter-spacing:.1em}
.fs-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(220,140,40,.05)}
.fs-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f0a840,#ff7040,#f0c850,#f0a840);background-size:200% 100%;box-shadow:0 0 12px rgba(255,170,60,.5)}
@media(max-width:768px){.fs-header{top:2vh}.fs-kicker{font-size:.38rem;padding:.1rem .4rem}.fs-title__c{font-size:1.2rem}}
</style>
