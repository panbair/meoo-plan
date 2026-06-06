<template>
  <section ref="rootRef" class="ws-root">
    <div ref="skyReflect" class="ws-sky"></div>

    <div ref="scrollRef" class="ws-scroll">
      <div ref="trackRef" class="ws-track" :style="{ height: trackHeight }">
        <div class="ws-sticky">

          <header ref="headerRef" class="ws-header">
            <span class="ws-kicker">💧 CSS3 3D Water Surface · 水面倒影 ◈</span>
            <h1 class="ws-title">
              <span ref="tc1" class="ws-title__c">水</span><span ref="tc2" class="ws-title__c ws-title__c--water">面</span>
              <span ref="tc3" class="ws-title__c">倒</span><span ref="tc4" class="ws-title__c ws-title__c--water">影</span>
            </h1>
            <div ref="lineRef" class="ws-line"></div>
            <p class="ws-sub">向下滚动 · 图片倒映动态水面 · 波纹涟漪扭曲倒影 · 如镜如幻</p>
          </header>

          <div ref="sceneRef" class="ws-scene">
            <!-- 上半 — 真实图片 -->
            <div ref="aboveRef" class="ws-above">
              <img :src="masterImage" alt="水上" class="ws-above__img" />
            </div>
            <!-- 水线 -->
            <div ref="waterline" class="ws-waterline">
              <div class="ws-waterline__glow"></div>
            </div>
            <!-- 下半 — 倒影（scaleY(-1) + 动态波纹） -->
            <div ref="belowRef" class="ws-below">
              <div ref="reflectWrap" class="ws-below__reflect">
                <img :src="masterImage" alt="倒影" class="ws-below__img" />
                <div class="ws-below__ripple ws-below__ripple--1"></div>
                <div class="ws-below__ripple ws-below__ripple--2"></div>
                <div class="ws-below__ripple ws-below__ripple--3"></div>
              </div>
              <div class="ws-below__fade"></div>
            </div>
            <!-- 水面波纹圆圈 -->
            <div ref="rippleRing1" class="ws-ripple-ring ws-ripple-ring--1"></div>
            <div ref="rippleRing2" class="ws-ripple-ring ws-ripple-ring--2"></div>
          </div>

          <div ref="infoRef" class="ws-info">
            <span class="ws-info__icon">💧</span><span class="ws-info__text">波纹强度 {{ rippleStr }}</span>
          </div>
          <div class="ws-progress"><div ref="progRef" class="ws-progress__fill"></div></div>
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

const masterImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
const trackHeight = `${7 * 100}vh`
const rippleStr=ref('静水')

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null)
const aboveRef=ref<HTMLElement|null>(null);const belowRef=ref<HTMLElement|null>(null);const reflectWrap=ref<HTMLElement|null>(null)
const waterline=ref<HTMLElement|null>(null)
const rippleRing1=ref<HTMLElement|null>(null);const rippleRing2=ref<HTMLElement|null>(null)
const skyReflect=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cleanupFns:TweenCleanup[]=[]

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:100,filter:'blur(20px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,scale:.7},{autoAlpha:1,scale:1,duration:1,ease:'power4.out'},'-.4')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupWaterSurface(){
  if(!scrollRef.value||!trackRef.value||!sceneRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value

  if(aboveRef.value)gsap.set(aboveRef.value,{rotateX:0})
  if(belowRef.value)gsap.set(belowRef.value,{rotateX:0})
  if(reflectWrap.value)gsap.set(reflectWrap.value,{scaleY:-1})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){
        if(self.progress<.3)rippleStr.value='镜面'
        else if(self.progress<.6)rippleStr.value='微澜'
        else rippleStr.value='🌊 荡漾'
      },
    },
  })

  // 💧 水面效果：上下两部分整体3D倾斜 + 倒影波动
  if(aboveRef.value){
    master.to(aboveRef.value,{rotateX:15,duration:2,ease:'sine.inOut'},0) // 上部分前倾
    master.to(aboveRef.value,{rotateX:-5,duration:2,ease:'sine.inOut'},3)
    master.to(aboveRef.value,{rotateX:8,duration:2,ease:'sine.inOut'},5)
  }
  if(belowRef.value){
    master.to(belowRef.value,{rotateX:-15,duration:2,ease:'sine.inOut'},0) // 下部分后仰
    master.to(belowRef.value,{rotateX:5,duration:2,ease:'sine.inOut'},3)
    master.to(belowRef.value,{rotateX:-8,duration:2,ease:'sine.inOut'},5)
  }

  // 倒影波纹扭曲（scaleY微动+模糊模拟水波）
  if(reflectWrap.value){
    for(let w=0;w<8;w++){
      master.to(reflectWrap.value,{scaleY:-.95,filter:'blur(1px)',duration:.6,ease:'sine.inOut'},w*1.2)
      master.to(reflectWrap.value,{scaleY:-1.05,filter:'blur(2.5px)',duration:.6,ease:'sine.inOut'},w*1.2+.6)
    }
  }

  // 水面涟漪环
  if(rippleRing1.value){
    for(let w=0;w<5;w++){master.fromTo(rippleRing1.value,{scale:.5,opacity:.5},{scale:2,opacity:0,duration:1.5,ease:'power3.out'},w*1.8)}
  }
  if(rippleRing2.value){
    for(let w=0;w<5;w++){master.fromTo(rippleRing2.value,{scale:.3,opacity:.4},{scale:1.5,opacity:0,duration:1.2,ease:'power3.out'},w*1.8+.5)}
  }

  if(waterline.value)master.to(waterline.value,{scaleX:1.05,duration:1.5,ease:'sine.inOut'},0)
  if(skyReflect.value)master.to(skyReflect.value,{opacity:.5,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupWaterSurface()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ws-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(180deg,#c8d8e8 0%,#d0dce8 48%,#6088a8 50%,#406080 52%,#305070 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.ws-sky{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 50% 35%,rgba(255,255,255,.4) 0%,transparent 60%);will-change:opacity;opacity:.3}
.ws-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(100,160,200,.15)}}
.ws-track{position:relative;width:100%}.ws-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ws-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.ws-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.28em;color:rgba(60,140,200,.7);background:rgba(180,220,240,.4);backdrop-filter:blur(8px);border:1px solid rgba(120,180,220,.25);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.ws-title{margin:0;display:flex;justify-content:center;gap:.08em}
.ws-title__c{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#3890c0;will-change:transform,opacity;&--water{background:linear-gradient(135deg,#3890c0,#60c0e0,#4098d0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(40,140,200,.5))}}
.ws-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#3890c0,#60c0e0,#4098d0,transparent)}
.ws-sub{margin:0;font-size:clamp(.62rem,.88vw,.76rem);color:rgba(40,120,180,.3);max-width:540px;margin-inline:auto}
.ws-scene{position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;perspective:900px;perspective-origin:50% 50%}

.ws-above{position:absolute;top:0;left:0;width:100%;height:50%;transform-style:preserve-3d;will-change:transform;overflow:hidden;transform-origin:50% 100%;
  &__img{width:100%;height:200%;object-fit:cover;object-position:top;display:block}
}
.ws-below{position:absolute;bottom:0;left:0;width:100%;height:50%;transform-style:preserve-3d;will-change:transform;overflow:hidden;transform-origin:50% 0%;
  &__reflect{position:absolute;inset:0;will-change:transform,filter}
  &__img{width:100%;height:200%;object-fit:cover;object-position:bottom;display:block;transform:scaleY(-1)}
  &__ripple{position:absolute;inset:0;pointer-events:none;
    &--1{background:linear-gradient(180deg,transparent 0%,rgba(255,255,255,.08) 15%,transparent 30%,rgba(255,255,255,.06) 50%,transparent 70%,rgba(255,255,255,.04) 85%,transparent 100%);background-size:100% 200px}
    &--2{background:linear-gradient(180deg,transparent 0%,rgba(255,255,255,.05) 20%,transparent 40%,rgba(255,255,255,.07) 60%,transparent 80%);background-size:100% 160px}
    &--3{background:linear-gradient(180deg,transparent 0%,rgba(255,255,255,.03) 25%,transparent 50%,rgba(255,255,255,.05) 75%,transparent 100%);background-size:100% 240px}
  }
  &__fade{position:absolute;bottom:0;left:0;width:100%;height:40%;background:linear-gradient(180deg,transparent,rgba(48,80,112,.7));pointer-events:none}
}

.ws-waterline{position:absolute;top:50%;left:0;width:100%;height:2px;z-index:15;transform:translateY(-50%);pointer-events:none;will-change:transform;
  &__glow{width:100%;height:4px;background:linear-gradient(90deg,transparent 5%,rgba(255,255,255,.5) 30%,rgba(255,255,255,.8) 50%,rgba(255,255,255,.5) 70%,transparent 95%);filter:blur(2px)}
}
.ws-ripple-ring{position:absolute;top:50%;left:50%;width:20vw;height:5vh;margin-left:-10vw;margin-top:-2.5vh;border-radius:50%;border:1px solid rgba(255,255,255,.2);pointer-events:none;z-index:12;will-change:transform,opacity;&--1{width:18vw;height:4vh;margin-left:-9vw;margin-top:-2vh}&--2{width:25vw;height:6vh;margin-left:-12.5vw;margin-top:-3vh}}

.ws-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.ws-info__icon{font-size:.9rem}.ws-info__text{font-size:.6rem;font-weight:600;color:rgba(60,150,210,.6);letter-spacing:.1em}
.ws-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(40,130,200,.05)}
.ws-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#3890c0,#60c0e0,#4098d0,#3890c0);background-size:200% 100%;box-shadow:0 0 10px rgba(40,140,200,.5)}
@media(max-width:768px){.ws-header{top:2vh}.ws-kicker{font-size:.4rem;padding:.1rem .4rem}.ws-title__c{font-size:1.3rem}}
</style>
