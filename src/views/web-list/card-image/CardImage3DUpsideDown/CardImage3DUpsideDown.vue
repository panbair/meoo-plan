<template>
  <section ref="rootRef" class="ud-root">
    <div ref="horizonGlow" class="ud-horizon"></div>

    <div ref="scrollRef" class="ud-scroll">
      <div ref="trackRef" class="ud-track" :style="{ height: trackHeight }">
        <div class="ud-sticky">

          <header ref="headerRef" class="ud-header">
            <span class="ud-kicker">🔃 CSS3 3D Upside Down · 颠倒世界 ◈</span>
            <h1 class="ud-title">
              <span ref="tc1" class="ud-title__c">颠</span><span ref="tc2" class="ud-title__c ud-title__c--flip">倒</span>
              <span ref="tc3" class="ud-title__c">世</span><span ref="tc4" class="ud-title__c ud-title__c--flip">界</span>
            </h1>
            <div ref="lineRef" class="ud-line"></div>
            <p class="ud-sub">向下滚动 · 上下两个世界互为镜像颠倒 · 地平面为轴 · 颠倒流转</p>
          </header>

          <div ref="sceneRef" class="ud-scene">
            <!-- 上半世界 — 正立 -->
            <div ref="upperWorld" class="ud-world ud-world--upper">
              <img :src="upperImage" alt="上方世界" class="ud-world__img" />
              <div class="ud-world__content">
                <div class="ud-world__card" v-for="c in 4" :key="'U'+c"
                  :ref="(el)=>setCardRef(el as HTMLElement, 'U'+(c-1))">
                  <img :src="cardImgs[c-1]" :alt="`上卡片${c}`" class="ud-world__card-img" />
                </div>
              </div>
            </div>
            <!-- 地平线 -->
            <div ref="horizonLine" class="ud-hline">
              <div class="ud-hline__glow"></div>
            </div>
            <!-- 下半世界 — 颠倒 (scaleY(-1)) -->
            <div ref="lowerWorld" class="ud-world ud-world--lower">
              <div class="ud-world__reflect-wrap">
                <img :src="lowerImage" alt="下方世界" class="ud-world__img ud-world__img--flipped" />
                <div class="ud-world__ripple"></div>
              </div>
              <div class="ud-world__content ud-world__content--flipped">
                <div class="ud-world__card" v-for="c in 4" :key="'L'+c"
                  :ref="(el)=>setCardRef(el as HTMLElement, 'L'+(c-1))">
                  <img :src="cardImgs[c+3]" :alt="`下卡片${c}`" class="ud-world__card-img" />
                </div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="ud-info">
            <span class="ud-info__dot"></span><span class="ud-info__text">{{ flipState }}</span>
          </div>
          <div class="ud-progress"><div ref="progRef" class="ud-progress__fill"></div></div>
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

const upperImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
const lowerImage = 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80'
const cardImgs = [
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=200&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=200&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
]
const trackHeight = `${7 * 100}vh`
const flipState=ref('天在上 · 地在下')

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null)
const upperWorld=ref<HTMLElement|null>(null);const lowerWorld=ref<HTMLElement|null>(null);const horizonLine=ref<HTMLElement|null>(null)
const horizonGlow=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<Record<string,HTMLElement|null>>({});const cleanupFns:TweenCleanup[]=[]
function setCardRef(el:HTMLElement|null,key:string){cardRefs.value[key]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:120,filter:'blur(18px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupUpsideDown(){
  if(!scrollRef.value||!trackRef.value||!sceneRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value

  // 初始状态
  if(upperWorld.value)gsap.set(upperWorld.value,{rotateX:0})
  if(lowerWorld.value)gsap.set(lowerWorld.value,{rotateX:0})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){
        if(self.progress<.25)flipState.value='天在上 · 地在下'
        else if(self.progress<.5)flipState.value='🔃 世界倾斜...'
        else if(self.progress<.75)flipState.value='天地倒转中...'
        else flipState.value='地在上 · 天在下'
      },
    },
  })

  // 🔃 颠倒世界：上半逐渐旋转翻到下方，下半翻到上方
  if(upperWorld.value){
    master.to(upperWorld.value,{rotateX:15,duration:2,ease:'sine.inOut'},0)
    master.to(upperWorld.value,{rotateX:-15,rotateY:5,duration:2.5,ease:'power2.inOut'},2.5)
    master.to(upperWorld.value,{rotateX:-30,opacity:.6,duration:2,ease:'power2.inOut'},5)
  }
  if(lowerWorld.value){
    master.to(lowerWorld.value,{rotateX:-15,duration:2,ease:'sine.inOut'},0)
    master.to(lowerWorld.value,{rotateX:15,rotateY:-5,duration:2.5,ease:'power2.inOut'},2.5)
    master.to(lowerWorld.value,{rotateX:30,opacity:.6,duration:2,ease:'power2.inOut'},5)
  }

  // 地平线脉冲
  if(horizonLine.value){
    for(let w=0;w<6;w++){master.to(horizonLine.value,{scaleX:1.08,opacity:.7,duration:.3,ease:'sine.inOut'},w*1.1);master.to(horizonLine.value,{scaleX:1,opacity:.4,duration:.4,ease:'sine.inOut'},w*1.1+.3)}
  }

  // 卡片在各自世界中的悬浮微动
  const allCards=Object.values(cardRefs.value).filter(Boolean) as HTMLElement[]
  allCards.forEach((el,i)=>{
    for(let w=0;w<6;w++){master.to(el,{y:(i%2?8:-8),duration:.8,ease:'sine.inOut'},w*1.2+i*.1);master.to(el,{y:0,duration:.8,ease:'sine.inOut'},w*1.2+.8+i*.1)}
  })

  if(horizonGlow.value)master.to(horizonGlow.value,{opacity:.5,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupUpsideDown()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ud-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(180deg,#6088a8 0%,#7098b8 45%,#c0d0e0 50%,#d8e8f4 52%,#b8d0e0 55%,#5880a0 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.ud-horizon{position:absolute;width:100%;height:2px;top:50%;left:0;background:linear-gradient(90deg,transparent 5%,rgba(255,255,255,.5) 30%,rgba(255,255,255,.8) 50%,rgba(255,255,255,.5) 70%,transparent 95%);filter:blur(6px);pointer-events:none;z-index:0;will-change:opacity;opacity:.3}
.ud-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(100,160,200,.15)}}
.ud-track{position:relative;width:100%}.ud-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ud-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.ud-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(60,130,190,.7);background:rgba(180,220,240,.4);backdrop-filter:blur(8px);border:1px solid rgba(120,180,220,.25);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.ud-title{margin:0;display:flex;justify-content:center;gap:.08em}
.ud-title__c{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#4890c0;will-change:transform,opacity;&--flip{background:linear-gradient(135deg,#4890c0,#3090d0,#60b8e0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(50,130,200,.5))}}
.ud-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#4890c0,#3090d0,#60b8e0,transparent)}
.ud-sub{margin:0;font-size:clamp(.6rem,.85vw,.74rem);color:rgba(40,110,180,.3);max-width:550px;margin-inline:auto}
.ud-scene{position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;perspective:900px;perspective-origin:50% 50%}

.ud-world{position:absolute;left:0;width:100%;height:50%;transform-style:preserve-3d;will-change:transform,opacity;overflow:hidden;
  &--upper{top:0;transform-origin:50% 100%}
  &--lower{bottom:0;transform-origin:50% 0%}
  &__img{width:100%;height:200%;object-fit:cover;display:block;&--flipped{transform:scaleY(-1)}}
  &__reflect-wrap{position:absolute;inset:0}
  &__ripple{position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(255,255,255,.06) 25%,transparent 50%,rgba(255,255,255,.04) 75%,transparent 100%);background-size:100% 160px;pointer-events:none}
  &__content{position:absolute;inset:0;display:flex;justify-content:center;align-items:center;gap:min(3vw,24px);flex-wrap:wrap;padding:min(4vw,32px)}
  &__content--flipped{transform:scaleY(-1)} // 下世界的卡片也翻转
  &__card{width:min(13vw,100px);height:min(10vw,75px);border-radius:5px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.15);transform-style:preserve-3d;will-change:transform;
    &-img{width:100%;height:100%;object-fit:cover;display:block}
  }
}

.ud-hline{position:absolute;top:50%;left:0;width:100%;height:2px;z-index:15;transform:translateY(-50%);pointer-events:none;will-change:transform,opacity;opacity:.4;
  &__glow{width:100%;height:6px;background:linear-gradient(90deg,transparent 3%,rgba(255,255,255,.6) 25%,rgba(255,255,255,1) 50%,rgba(255,255,255,.6) 75%,transparent 97%);filter:blur(3px)}
}

.ud-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.ud-info__dot{width:6px;height:6px;border-radius:50%;background:#4890c0;box-shadow:0 0 12px rgba(50,130,200,.6);animation:ud-pulse 2s ease-in-out infinite}
@keyframes ud-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.ud-info__text{font-size:.6rem;font-weight:600;color:rgba(50,140,200,.6);letter-spacing:.1em}
.ud-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(40,120,190,.05)}
.ud-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#4890c0,#3090d0,#60b8e0,#4890c0);background-size:200% 100%;box-shadow:0 0 10px rgba(50,130,200,.5)}
@media(max-width:768px){.ud-header{top:2vh}.ud-kicker{font-size:.38rem;padding:.1rem .4rem}.ud-title__c{font-size:1.3rem}}
</style>
