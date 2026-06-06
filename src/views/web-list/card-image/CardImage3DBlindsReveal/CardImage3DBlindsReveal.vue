<template>
  <section ref="rootRef" class="bl-root">
    <div ref="windowLight" class="bl-window-light"></div>

    <div ref="scrollRef" class="bl-scroll">
      <div ref="trackRef" class="bl-track" :style="{ height: trackHeight }">
        <div class="bl-sticky">

          <header ref="headerRef" class="bl-header">
            <span class="bl-kicker">🪟 CSS3 3D Blinds Reveal · 百叶窗揭开 ◈</span>
            <h1 class="bl-title">
              <span ref="tc1" class="bl-title__c">百</span><span ref="tc2" class="bl-title__c bl-title__c--blind">叶</span>
              <span ref="tc3" class="bl-title__c">揭</span><span ref="tc4" class="bl-title__c bl-title__c--blind">开</span>
            </h1>
            <div ref="lineRef" class="bl-line"></div>
            <p class="bl-sub">向下滚动 · 水平百叶叶片3D旋转翻开 · 透出背后震撼全景大图</p>
          </header>

          <div ref="sceneRef" class="bl-scene">
            <!-- 背后全景大图 -->
            <div ref="bgReveal" class="bl-bg">
              <img :src="masterImage" alt="全景" class="bl-bg__img" />
            </div>
            <!-- 百叶窗叶片 — 12片 -->
            <div ref="blindsRef" class="bl-blinds">
              <div v-for="slat in slats" :key="slat.id"
                :ref="(el)=>setSlatRef(el as HTMLElement, slat.id)"
                class="bl-slat"
              >
                <div class="bl-slat__front">
                  <img :src="slat.image" :alt="slat.alt" class="bl-slat__img" />
                  <div class="bl-slat__wood"></div>
                </div>
                <div class="bl-slat__back"></div>
                <div class="bl-slat__edge"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="bl-info">
            <span class="bl-info__dot"></span><span class="bl-info__text">{{ openState }}</span>
          </div>
          <div class="bl-progress"><div ref="progRef" class="bl-progress__fill"></div></div>
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

const SLAT_COUNT = 12
const trackHeight = `${7 * 100}vh`
const masterImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'

const slatImgs = [
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=300&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80',
]

const slats = Array.from({length:SLAT_COUNT},(_,i)=>({id:i,image:slatImgs[i%slatImgs.length],alt:`叶片${i}`}))
const openState=ref('关闭')

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const blindsRef=ref<HTMLElement|null>(null);const bgReveal=ref<HTMLElement|null>(null)
const windowLight=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const slatRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setSlatRef(el:HTMLElement|null,idx:number){slatRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:80,filter:'blur(14px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupBlindsReveal(){
  if(!scrollRef.value||!trackRef.value||!blindsRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=slatRefs.value.filter(Boolean) as HTMLElement[]

  // 🔑 百叶窗每片绕上边缘旋转
  els.forEach(el=>{gsap.set(el,{transformOrigin:'50% 0%',rotateX:0})})
  if(bgReveal.value)gsap.set(bgReveal.value,{opacity:.15})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){
        if(self.progress<.2)openState.value='叶片闭合'
        else if(self.progress<.6)openState.value='🪟 叶片翻转中...'
        else openState.value='全景展现'
      },
    },
  })

  // 🪟 百叶窗叶片依次翻转（中间先翻→两端后翻）
  const center=Math.floor(SLAT_COUNT/2)
  els.forEach((el,i)=>{
    const distFromCenter=Math.abs(i-center)/center
    const delay=distFromCenter*.5
    // 向前翻 -85° (从水平→近乎垂直，露出后面)
    master.to(el,{rotateX:-85,duration:2.5,ease:'power3.out'},delay)
    // 到位微弹
    master.to(el,{rotateX:-88,duration:.1,ease:'sine.out'},delay+2.5)
    master.to(el,{rotateX:-84,duration:.15,ease:'sine.inOut'},delay+2.6)
  })

  // 背景图渐显
  if(bgReveal.value){
    master.to(bgReveal.value,{opacity:1,scale:1.03,duration:4,ease:'power3.out'},.5)
  }

  if(blindsRef.value){master.to(blindsRef.value,{rotateX:-4,duration:1},0);master.to(blindsRef.value,{rotateX:2,duration:1},3.5)}
  if(windowLight.value)master.to(windowLight.value,{opacity:.6,duration:5},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:5},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupBlindsReveal()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.bl-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#1a1c20;font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.bl-window-light{position:absolute;width:35vw;height:30vh;top:20vh;left:32vw;border-radius:50%;background:radial-gradient(ellipse,rgba(255,220,160,.15) 0%,transparent 60%);filter:blur(60px);pointer-events:none;z-index:0;will-change:opacity;opacity:.3}
.bl-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(200,160,100,.15)}}
.bl-track{position:relative;width:100%}.bl-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.bl-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.bl-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.28em;color:rgba(220,180,80,.7);background:rgba(180,120,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(200,140,60,.16);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.bl-title{margin:0;display:flex;justify-content:center;gap:.08em}
.bl-title__c{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#d0b050;will-change:transform,opacity;&--blind{background:linear-gradient(135deg,#e0c060,#d0a030,#f0d870);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(220,180,70,.5))}}
.bl-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#e0c060,#d0a030,#f0d870,transparent)}
.bl-sub{margin:0;font-size:clamp(.62rem,.88vw,.76rem);color:rgba(200,160,60,.3);max-width:540px;margin-inline:auto}
.bl-scene{position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;perspective:800px;perspective-origin:50% 50%}

.bl-bg{position:absolute;inset:0;z-index:1;will-change:transform,opacity;
  &__img{width:100%;height:100%;object-fit:cover}
}
.bl-blinds{position:absolute;inset:0;z-index:10;transform-style:preserve-3d;will-change:transform;display:flex;flex-direction:column}

.bl-slat{flex:1;transform-style:preserve-3d;will-change:transform;position:relative;
  &__front{position:absolute;inset:0;backface-visibility:hidden;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.2)}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__wood{position:absolute;inset:0;background:linear-gradient(180deg,rgba(139,90,43,.5),rgba(101,67,33,.4),rgba(139,90,43,.5));mix-blend-mode:multiply;pointer-events:none}
  &__back{position:absolute;inset:0;backface-visibility:hidden;background:#3a2818;transform:rotateX(180deg)}
  &__edge{position:absolute;top:0;left:0;width:100%;height:4px;background:linear-gradient(180deg,#8b5a2b,#654321);transform:rotateX(90deg);transform-origin:top}
}

.bl-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.bl-info__dot{width:6px;height:6px;border-radius:50%;background:#d0b050;box-shadow:0 0 12px rgba(220,180,70,.6);animation:bl-pulse 2s ease-in-out infinite}
@keyframes bl-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.bl-info__text{font-size:.6rem;font-weight:600;color:rgba(220,180,70,.6);letter-spacing:.1em}
.bl-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(200,140,40,.05)}
.bl-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#e0c060,#d0a030,#f0d870,#e0c060);background-size:200% 100%;box-shadow:0 0 10px rgba(220,180,70,.5)}
@media(max-width:768px){.bl-header{top:2vh}.bl-kicker{font-size:.4rem;padding:.1rem .4rem}.bl-title__c{font-size:1.3rem}}
</style>
