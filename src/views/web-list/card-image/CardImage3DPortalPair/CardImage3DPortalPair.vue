<template>
  <section ref="rootRef" class="pp-root">
    <div ref="spaceGlow" class="pp-space"></div>

    <div ref="scrollRef" class="pp-scroll">
      <div ref="trackRef" class="pp-track" :style="{ height: trackHeight }">
        <div class="pp-sticky">

          <header ref="headerRef" class="pp-header">
            <span class="pp-kicker">🌀 CSS3 3D Portal Pair · 传送门对 ◈</span>
            <h1 class="pp-title">
              <span ref="tc1" class="pp-title__c">传</span><span ref="tc2" class="pp-title__c pp-title__c--portal">送</span>
              <span ref="tc3" class="pp-title__c">门</span><span ref="tc4" class="pp-title__c pp-title__c--portal">对</span>
            </h1>
            <div ref="lineRef" class="pp-line"></div>
            <p class="pp-sub">向下滚动 · 两个椭圆传送门在3D空间遥相呼应 · 穿过一个看到另一个</p>
          </header>

          <div ref="sceneRef" class="pp-scene">
            <div ref="portalsRef" class="pp-portals">
              <!-- 传送门A — 近处 -->
              <div ref="portalA" class="pp-portal pp-portal--a">
                <div class="pp-portal__ring">
                  <div class="pp-portal__ring-inner"></div>
                </div>
                <div class="pp-portal__window">
                  <img :src="portalAImage" alt="传送门A" class="pp-portal__view" />
                  <div class="pp-portal__swirl"></div>
                </div>
                <div class="pp-portal__glow"></div>
              </div>
              <!-- 传送门B — 远处 -->
              <div ref="portalB" class="pp-portal pp-portal--b">
                <div class="pp-portal__ring">
                  <div class="pp-portal__ring-inner"></div>
                </div>
                <div class="pp-portal__window">
                  <img :src="portalBImage" alt="传送门B" class="pp-portal__view" />
                  <div class="pp-portal__swirl"></div>
                </div>
                <div class="pp-portal__glow"></div>
              </div>
              <!-- 两个门之间的连接桥 — 弯曲的3D管道 -->
              <div ref="bridgeRef" class="pp-bridge">
                <div class="pp-bridge__segment" v-for="seg in 8" :key="seg" :class="[`pp-bridge__segment--s${seg}`]"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="pp-info">
            <span class="pp-info__dot"></span><span class="pp-info__text">{{ connectionState }}</span>
          </div>
          <div class="pp-progress"><div ref="progRef" class="pp-progress__fill"></div></div>
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

const portalAImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80'
const portalBImage = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80'
const trackHeight = `${7 * 100}vh`
const connectionState=ref('未连接')

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const portalsRef=ref<HTMLElement|null>(null)
const portalA=ref<HTMLElement|null>(null);const portalB=ref<HTMLElement|null>(null);const bridgeRef=ref<HTMLElement|null>(null)
const spaceGlow=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cleanupFns:TweenCleanup[]=[]

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,rotateX:90,scale:.3},{autoAlpha:1,rotateX:0,scale:1,duration:.7,stagger:.12,ease:'back.out(2.5)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-20,scale:.4},{autoAlpha:1,rotateX:-8,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupPortalPair(){
  if(!scrollRef.value||!trackRef.value||!portalsRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value

  // 初始：门A在近处，门B在远处
  if(portalA.value)gsap.set(portalA.value,{x:-120,y:0,translateZ:0,rotateY:20,scale:1})
  if(portalB.value)gsap.set(portalB.value,{x:120,y:0,translateZ:-400,rotateY:-20,scale:.4,opacity:.5})
  if(bridgeRef.value)gsap.set(bridgeRef.value,{opacity:.15,scaleX:0})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){
        if(self.progress<.3)connectionState.value='门扉分离'
        else if(self.progress<.6)connectionState.value='🌀 建立连接...'
        else connectionState.value='空间贯通'
      },
    },
  })

  // 🌀 传送门逐渐靠近+连接
  // 门A：向右移 → 略微向Z深处转
  if(portalA.value){
    master.to(portalA.value,{x:-60,rotateY:35,translateZ:-50,duration:3,ease:'power2.inOut'},0)
    master.to(portalA.value,{scale:1.1,duration:.3,ease:'sine.inOut'},3)
    master.to(portalA.value,{scale:1,duration:.3,ease:'sine.inOut'},3.3)
  }
  // 门B：向左移 → 从远处拉近
  if(portalB.value){
    master.to(portalB.value,{x:60,translateZ:-150,rotateY:-35,scale:.7,opacity:.9,duration:3,ease:'power2.inOut'},0)
    master.to(portalB.value,{scale:.75,duration:.3,ease:'sine.inOut'},3)
    master.to(portalB.value,{scale:.7,duration:.3,ease:'sine.inOut'},3.3)
  }
  // 连接桥渐显+伸展
  if(bridgeRef.value){
    master.to(bridgeRef.value,{scaleX:1,opacity:.5,duration:2.5,ease:'power3.out'},.5)
  }

  // 整体旋转展示空间关系
  if(portalsRef.value){master.to(portalsRef.value,{rotateY:25,duration:3.5,ease:'sine.inOut'},0);master.to(portalsRef.value,{rotateY:-20,rotateX:-6,duration:3.5,ease:'sine.inOut'},3.5)}
  if(spaceGlow.value)master.to(spaceGlow.value,{scale:1.4,opacity:.5,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupPortalPair()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.pp-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0c1028 0%,#060918 60%,#020410 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.pp-space{position:absolute;width:40vw;height:35vw;top:25vh;left:30vw;border-radius:50%;background:radial-gradient(ellipse,rgba(60,140,240,.08) 0%,rgba(40,200,180,.05) 30%,transparent 60%);filter:blur(70px);pointer-events:none;z-index:0;will-change:transform,opacity}
.pp-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(60,160,220,.12)}}
.pp-track{position:relative;width:100%}.pp-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.pp-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.pp-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(80,180,230,.7);background:rgba(40,140,220,.08);backdrop-filter:blur(8px);border:1px solid rgba(60,160,220,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.pp-title{margin:0;display:flex;justify-content:center;gap:.08em}
.pp-title__c{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#50b8e0;will-change:transform,opacity;&--portal{background:linear-gradient(135deg,#50b8e0,#40d8b0,#a060e0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 18px rgba(60,180,230,.6))}}
.pp-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#50b8e0,#40d8b0,#a060e0,transparent)}
.pp-sub{margin:0;font-size:clamp(.6rem,.85vw,.74rem);color:rgba(60,160,220,.3);max-width:550px;margin-inline:auto}
.pp-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 50%;will-change:transform,opacity}
.pp-portals{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.pp-portal{position:absolute;width:min(28vw,220px);height:min(38vw,300px);margin-left:calc(min(28vw,220px) / -2);margin-top:calc(min(38vw,300px) / -2);transform-style:preserve-3d;will-change:transform,opacity;
  &__ring{position:absolute;inset:-8px;border-radius:50%;border:3px solid;overflow:hidden;pointer-events:none}
  &__ring-inner{position:absolute;inset:2px;border-radius:50%;border:1px solid rgba(255,255,255,.08)}
  &__window{position:absolute;inset:6px;border-radius:50%;overflow:hidden;box-shadow:0 0 40px rgba(60,180,240,.2)}
  &__view{width:100%;height:100%;object-fit:cover;display:block}
  &__swirl{position:absolute;inset:0;background:conic-gradient(from 0deg,transparent 0%,rgba(60,200,240,.2) 20%,transparent 40%,rgba(160,100,240,.15) 60%,transparent 80%,rgba(60,200,240,.2) 100%);border-radius:50%}
  &__glow{position:absolute;inset:-20px;border-radius:50%;background:radial-gradient(circle,rgba(60,180,240,.15) 50%,transparent 75%);filter:blur(15px);pointer-events:none}
  &--a .pp-portal__ring{border-color:rgba(60,200,240,.5)}
  &--b .pp-portal__ring{border-color:rgba(160,100,240,.5)}
}

.pp-bridge{position:absolute;width:240px;height:3px;left:-120px;top:-1px;transform-origin:left center;will-change:transform,opacity;
  &__segment{position:absolute;height:100%;border-radius:1px;background:rgba(100,180,220,.3);
    &--s1{left:0;width:30px}&--s2{left:30px;width:30px}&--s3{left:60px;width:30px}&--s4{left:90px;width:30px}
    &--s5{left:120px;width:30px}&--s6{left:150px;width:30px}&--s7{left:180px;width:30px}&--s8{left:210px;width:30px}
  }
}

.pp-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.pp-info__dot{width:6px;height:6px;border-radius:50%;background:#50b8e0;box-shadow:0 0 14px rgba(60,180,230,.7);animation:pp-pulse 2s ease-in-out infinite}
@keyframes pp-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.pp-info__text{font-size:.6rem;font-weight:600;color:rgba(70,180,230,.6);letter-spacing:.1em}
.pp-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(40,150,210,.05)}
.pp-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#50b8e0,#40d8b0,#a060e0,#50b8e0);background-size:200% 100%;box-shadow:0 0 12px rgba(60,180,230,.5)}
@media(max-width:768px){.pp-header{top:2vh}.pp-kicker{font-size:.38rem;padding:.1rem .4rem}.pp-title__c{font-size:1.3rem}}
</style>
