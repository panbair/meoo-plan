<template>
  <section ref="rootRef" class="lan-root">
    <div ref="warmGlow" class="lan-warm"></div>
    <div ref="candleLight" class="lan-candle"></div>

    <div ref="scrollRef" class="lan-scroll">
      <div ref="trackRef" class="lan-track" :style="{ height: trackHeight }">
        <div class="lan-sticky">

          <header ref="headerRef" class="lan-header">
            <span class="lan-kicker">🏮 CSS3 3D Chinese Lantern · 走马灯 ◈</span>
            <h1 class="lan-title">
              <span ref="tc1" class="lan-title__c">走</span>
              <span ref="tc2" class="lan-title__c lan-title__c--lantern">马</span>
              <span ref="tc3" class="lan-title__c">灯</span>
              <span ref="tc4" class="lan-title__c lan-title__c--lantern">转</span>
            </h1>
            <div ref="lineRef" class="lan-line"></div>
            <p class="lan-sub">向下滚动 · 六角走马灯3D旋转 · 每面一图 · 内烛光影 · 流转不息</p>
          </header>

          <div ref="sceneRef" class="lan-scene">
            <div ref="lanternRef" class="lan-lantern">
              <!-- 灯笼主体 — 六面体 -->
              <div class="lan-body">
                <!-- 6个面 -->
                <div
                  v-for="(face, idx) in lanternFaces"
                  :key="idx"
                  class="lan-face"
                  :class="[`lan-face--${idx}`]"
                >
                  <img :src="face.image" :alt="face.alt" class="lan-face__img" />
                  <!-- 灯面纸纹 -->
                  <div class="lan-face__paper"></div>
                  <!-- 框架 -->
                  <div class="lan-face__frame">
                    <div class="lan-face__rib lan-face__rib--t"></div>
                    <div class="lan-face__rib lan-face__rib--b"></div>
                    <div class="lan-face__rib lan-face__rib--l"></div>
                    <div class="lan-face__rib lan-face__rib--r"></div>
                  </div>
                  <!-- 剪纸装饰 -->
                  <div class="lan-face__cutout"></div>
                </div>
              </div>
              <!-- 顶部龙骨 -->
              <div class="lan-top">
                <div class="lan-top__cap"></div>
                <div class="lan-top__ring"></div>
              </div>
              <!-- 底部龙骨+流苏 -->
              <div class="lan-bottom">
                <div class="lan-bottom__ring"></div>
                <div class="lan-bottom__cap"></div>
              </div>
              <div ref="tasselRef" class="lan-tassel">
                <div class="lan-tassel__cord"></div>
                <div class="lan-tassel__knot"></div>
                <div class="lan-tassel__fringe"></div>
              </div>
              <!-- 内部烛光 -->
              <div ref="innerGlow" class="lan-inner-glow"></div>
            </div>
          </div>

          <div ref="infoRef" class="lan-info">
            <span class="lan-info__icon">🏮</span>
            <span class="lan-info__text">{{ lanternFaces[currentFace]?.name }}</span>
          </div>

          <div class="lan-progress"><div ref="progRef" class="lan-progress__fill"></div></div>
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

// ═══════════════════════════════════════════════════════════════════
//  CardImage3DChineseLantern — CSS3 3D 走马灯
//
//  核心概念：传统六角走马灯在3D空间中旋转
//  1. 六面体灯笼（6个矩形面构成正六棱柱）
//  2. 每面贴一张Unsplash图片 + 纸质纹理
//  3. 用户竖滚 → 灯笼绕Y轴旋转，各面依次展现
//  4. 内部有烛光暖光源透出
//  5. 顶部/底部龙骨装饰 + 流苏摆动
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface FaceData { name: string; image: string; alt: string }

const lanternFaces: FaceData[] = [
  { name: '山水', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80', alt: '山水' },
  { name: '花鸟', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80', alt: '花鸟' },
  { name: '星月', image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80', alt: '星月' },
  { name: '松竹', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80', alt: '松竹' },
  { name: '云海', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80', alt: '云海' },
  { name: '日出', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', alt: '日出' },
]

const currentFace = ref(0)
const trackHeight = `${6 * 100}vh`

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const lanternRef=ref<HTMLElement|null>(null)
const tasselRef=ref<HTMLElement|null>(null);const innerGlow=ref<HTMLElement|null>(null)
const warmGlow=ref<HTMLElement|null>(null);const candleLight=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cleanupFns:TweenCleanup[]=[]

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:100,filter:'blur(20px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,scale:.4,rotateX:-30},{autoAlpha:1,scale:1,rotateX:-5,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupLantern(){
  if(!scrollRef.value||!trackRef.value||!lanternRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const lantern=lanternRef.value

  if(lantern)gsap.set(lantern,{rotateX:-5,rotateY:0})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){currentFace.value=Math.min(5,Math.max(0,Math.floor((self.progress*6)%6)))},
    },
  })

  // 🏮 灯笼绕Y轴旋转 — 展示六个面
  // 旋转3圈让每个面充分展示
  for(let i=0;i<3;i++){
    master.to(lantern!,{rotateY:360*(i+1),duration:2,ease:'sine.inOut'},i*2)
  }

  // 轻微上下摆动
  if(lantern){
    for(let i=0;i<6;i++){master.to(lantern,{y:-8,duration:.3,ease:'sine.inOut'},i*1);master.to(lantern,{y:0,duration:.35,ease:'sine.inOut'},i*1+.3)}
    master.to(lantern,{rotateX:-8,duration:3,ease:'sine.inOut'},0)
    master.to(lantern,{rotateX:3,duration:3,ease:'sine.inOut'},3)
  }

  // 流苏摆动
  if(tasselRef.value){
    master.to(tasselRef.value,{rotateZ:12,duration:1,ease:'sine.inOut'},0)
    master.to(tasselRef.value,{rotateZ:-10,duration:1,ease:'sine.inOut'},1)
    master.to(tasselRef.value,{rotateZ:8,duration:1,ease:'sine.inOut'},2)
    master.to(tasselRef.value,{rotateZ:-6,duration:1,ease:'sine.inOut'},3)
    master.to(tasselRef.value,{rotateZ:0,duration:1,ease:'sine.inOut'},4)
  }

  // 烛光呼吸
  if(innerGlow.value){
    for(let i=0;i<12;i++){master.to(innerGlow.value,{opacity:.9,scale:1.2,duration:.15,ease:'sine.inOut'},i*.5);master.to(innerGlow.value,{opacity:.6,scale:1,duration:.2,ease:'sine.inOut'},i*.5+.15)}
  }
  if(warmGlow.value)master.to(warmGlow.value,{scale:1.3,opacity:.7,duration:6,ease:'sine.inOut'},0)
  if(candleLight.value)master.to(candleLight.value,{scale:1.2,opacity:.8,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupLantern()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.lan-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 40%,#1c1410 0%,#0f0a08 60%,#080504 100%);font-family:'Inter','PingFang SC','Microsoft YaHei','Georgia',serif;}
.lan-warm{position:absolute;width:45vw;height:35vw;top:20vh;left:27vw;border-radius:50%;background:radial-gradient(ellipse,rgba(255,150,40,.2) 0%,rgba(255,100,20,.08) 40%,transparent 70%);filter:blur(90px);pointer-events:none;z-index:0;will-change:transform,opacity;}
.lan-candle{position:absolute;width:15vw;height:15vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,180,60,.25) 0%,rgba(255,140,30,.1) 35%,transparent 60%);filter:blur(40px);pointer-events:none;z-index:0;will-change:transform,opacity;}
.lan-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,140,40,.15)}}
.lan-track{position:relative;width:100%}.lan-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.lan-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.lan-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,160,60,.75);background:rgba(200,100,30,.08);backdrop-filter:blur(8px);border:1px solid rgba(220,120,40,.18);border-radius:999px;padding:.22rem .9rem;margin-bottom:.5rem}
.lan-title{margin:0;display:flex;justify-content:center;gap:.08em}
.lan-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#e08830;will-change:transform,opacity;&--lantern{background:linear-gradient(135deg,#f0a040,#ff7040,#f0c050);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 16px rgba(255,160,50,.6))}}
.lan-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f0a040,#ff7040,#f0c050,transparent);transform-origin:center}
.lan-sub{margin:0;font-size:clamp(.64rem,.9vw,.78rem);color:rgba(220,140,50,.3);max-width:550px;margin-inline:auto}
.lan-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:800px;perspective-origin:50% 50%;will-change:transform,opacity}
.lan-lantern{position:relative;transform-style:preserve-3d;will-change:transform}

$lanW:min(30vw,260px);$lanH:min(40vw,350px);$halfW:calc($lanW/2);$halfH:calc($lanH/2);

.lan-body{position:absolute;width:0;height:0;transform-style:preserve-3d;}
.lan-face{position:absolute;width:$lanW;height:$lanH;margin-left:calc($halfW*-1);margin-top:calc($halfH*-1);backface-visibility:hidden;overflow:hidden;border-radius:3px;box-shadow:0 0 20px rgba(0,0,0,.3);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__paper{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,200,100,.08) 0%,transparent 30%,transparent 70%,rgba(255,150,50,.08) 100%);pointer-events:none}
  &__frame{position:absolute;inset:0;pointer-events:none}
  &__rib{position:absolute;background:linear-gradient(180deg,#8b4513,#a0522d,#6b3410);
    &--t{top:0;left:0;width:100%;height:3px}
    &--b{bottom:0;left:0;width:100%;height:3px}
    &--l{left:0;top:0;width:3px;height:100%}
    &--r{right:0;top:0;width:3px;height:100%}
  }
  &__cutout{position:absolute;inset:10px;border:1px solid rgba(255,180,80,.08);border-radius:2px;pointer-events:none}
  &--0{transform:translateZ($halfW)}
  &--1{transform:translateZ(calc($halfW*-1)) rotateY(180deg)}
  &--2{transform:translateX($halfW) rotateY(90deg)}
  &--3{transform:translateX(calc($halfW*-1)) rotateY(-90deg)}
  &--4{transform:translateY(calc($halfH*-1)) rotateX(90deg);width:$lanW;height:$lanW;margin-left:calc($halfW*-1);margin-top:calc($lanW/-2)}
  &--5{transform:translateY($halfH) rotateX(-90deg);width:$lanW;height:$lanW;margin-left:calc($halfW*-1);margin-top:calc($lanW/-2)}
}

// 顶部龙骨
.lan-top{position:absolute;top:calc($halfH*-1);left:50%;transform:translateX(-50%);transform-style:preserve-3d;
  &__cap{width:calc($lanW*.7);height:14px;margin-left:calc($lanW*-.35);border-radius:50% 50% 0 0;background:linear-gradient(180deg,#a0522d,#6b3410);box-shadow:0 2px 8px rgba(0,0,0,.4)}
  &__ring{width:calc($lanW*.5);height:6px;margin-left:calc($lanW*-.25);margin-top:12px;border-radius:50%;border:2px solid rgba(200,120,40,.4);background:rgba(160,80,30,.3)}
}
.lan-bottom{position:absolute;bottom:calc($halfH*-1);left:50%;transform:translateX(-50%);transform-style:preserve-3d;
  &__ring{width:calc($lanW*.5);height:6px;margin-left:calc($lanW*-.25);border-radius:50%;border:2px solid rgba(200,120,40,.4);background:rgba(160,80,30,.3)}
  &__cap{width:calc($lanW*.6);height:10px;margin-left:calc($lanW*-.3);margin-top:4px;border-radius:0 0 50% 50%;background:linear-gradient(180deg,#6b3410,#a0522d);box-shadow:0 2px 8px rgba(0,0,0,.4)}
}

// 流苏
.lan-tassel{position:absolute;top:calc($halfH + 20px);left:50%;transform:translateX(-50%);transform-style:preserve-3d;will-change:transform;
  &__cord{width:2px;height:40px;margin-left:-1px;background:linear-gradient(180deg,#c88040,#d4a060)}
  &__knot{width:12px;height:14px;margin-left:-6px;border-radius:50%;background:radial-gradient(circle,#e0b070,#a06030);box-shadow:0 2px 6px rgba(0,0,0,.3)}
  &__fringe{width:20px;height:40px;margin-left:-10px;margin-top:14px;background:linear-gradient(180deg,rgba(200,140,80,.6),rgba(180,120,60,.2));clip-path:polygon(20% 0%,80% 0%,100% 100%,70% 100%,50% 70%,30% 100%,0% 100%)}
}

.lan-inner-glow{position:absolute;width:$lanW;height:$lanH;margin-left:calc($halfW*-1);margin-top:calc($halfH*-1);border-radius:3px;background:radial-gradient(ellipse at 50% 50%,rgba(255,160,50,.25) 0%,rgba(255,120,30,.05) 60%,transparent 90%);pointer-events:none;transform:translateZ(0);will-change:opacity,transform}
.lan-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.lan-info__icon{font-size:.9rem}.lan-info__text{font-size:.6rem;font-weight:600;color:rgba(255,160,60,.6);letter-spacing:.1em}
.lan-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(255,140,40,.05)}
.lan-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f0a040,#ff7040,#f0c050,#f0a040);background-size:200% 100%;box-shadow:0 0 12px rgba(255,160,50,.6)}
@media(max-width:768px){.lan-header{top:2vh}.lan-kicker{font-size:.42rem;padding:.1rem .4rem}.lan-title__c{font-size:1.3rem}}
</style>
