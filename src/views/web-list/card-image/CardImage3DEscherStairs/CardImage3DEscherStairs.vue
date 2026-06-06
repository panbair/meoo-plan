<template>
  <section ref="rootRef" class="es-root">
    <div ref="voidGlow" class="es-void"></div>
    <div ref="ambientA" class="es-ambient es-ambient--a"></div>
    <div ref="ambientB" class="es-ambient es-ambient--b"></div>

    <div ref="scrollRef" class="es-scroll">
      <div ref="trackRef" class="es-track" :style="{ height: trackHeight }">
        <div class="es-sticky">

          <header ref="headerRef" class="es-header">
            <span class="es-kicker">🪜 CSS3 3D Escher Stairs · 图片无限楼梯 ◈</span>
            <h1 class="es-title">
              <span ref="tc1" class="es-title__c">图</span><span ref="tc2" class="es-title__c es-title__c--escher">梯</span>
              <span ref="tc3" class="es-title__c">循</span><span ref="tc4" class="es-title__c es-title__c--escher">环</span>
            </h1>
            <div ref="lineRef" class="es-line"></div>
            <p class="es-sub">向下滚动 · 每级踏板一幅图 · 墙壁挂图 · 深渊藏图 · 永无止境</p>
          </header>

          <div ref="sceneRef" class="es-scene">
            <div ref="stairsRef" class="es-stairs">

              <!-- === 4段楼梯构成彭罗斯不可能循环 === -->
              <div v-for="seg in 4" :key="seg"
                :ref="(el)=>setSegRef(el as HTMLElement, seg-1)"
                class="es-segment" :class="[`es-segment--s${seg}`]"
              >
                <!-- 外侧墙壁 — 大幅挂图 -->
                <div class="es-outer-wall">
                  <img :src="wallPool[seg-1]" :alt="`外壁${seg}`" class="es-outer-wall__img" />
                  <div class="es-outer-wall__vignette"></div>
                  <span class="es-outer-wall__label">{{ wallLabels[seg-1] }}</span>
                </div>

                <!-- 内侧墙壁(面向深渊) — 小幅挂图 -->
                <div class="es-inner-wall">
                  <img :src="wallPool[(seg+2)%4]" :alt="`内壁${seg}`" class="es-inner-wall__img" />
                </div>

                <!-- 6级台阶 — 每级踏板都贴图 -->
                <div v-for="step in 6" :key="step"
                  class="es-step" :class="[`es-step--t${step}`]"
                >
                  <!-- 踏板面 — 图片 -->
                  <div class="es-step__tread">
                    <img :src="treadImages[(seg-1)*6+step-1]" :alt="`梯面${seg}-${step}`" class="es-step__tread-img" />
                    <div class="es-step__tread-shine"></div>
                  </div>
                  <!-- 踢脚板 — 图片 -->
                  <div class="es-step__riser">
                    <img :src="riserImages[(seg-1)*6+step-1]" :alt="`踢面${seg}-${step}`" class="es-step__riser-img" />
                  </div>
                </div>
              </div>

              <!-- === 中心深渊 — 终极影像 === -->
              <div ref="abyssRef" class="es-abyss">
                <img :src="abyssImage" alt="深渊之图" class="es-abyss__img" />
                <div class="es-abyss__vortex"></div>
                <div class="es-abyss__label">✦ 无尽深处 ✦</div>
              </div>

              <!-- === 悬浮图片卡 — 6张卡片在不可能空间中漂浮 === -->
              <div v-for="fc in 6" :key="'fc'+fc"
                :ref="(el)=>setFloatRef(el as HTMLElement, fc-1)"
                class="es-float-card"
                :class="[`es-float-card--p${fc}`]"
              >
                <img :src="floatImages[fc-1]" :alt="`悬浮卡${fc}`" class="es-float-card__img" />
                <div class="es-float-card__edge"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="es-info">
            <span class="es-info__dot"></span><span class="es-info__text">已循环 {{ loopCount }} 圈 · 永无止境</span>
          </div>
          <div class="es-progress"><div ref="progRef" class="es-progress__fill"></div></div>
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

const trackHeight = `${9 * 100}vh`

// === 图片资源 ===
const wallPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
]
const wallLabels = ['🌊 海天之境', '⛰ 山谷回响', '✨ 星河浩瀚', '🌲 密林深处']

// 踏板图 — 24张 (4段×6级)
const treadSrc = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=200&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=200&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=200&q=80',
]
const treadImages = Array.from({length:24},(_,i)=>treadSrc[i%treadSrc.length])
const riserImages = Array.from({length:24},(_,i)=>treadSrc[(i+3)%treadSrc.length])

const abyssImage = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80'

const floatPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=180&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=180&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=180&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=180&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=180&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=180&q=80',
]
const floatImages = floatPool

const loopCount=ref(0)

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const stairsRef=ref<HTMLElement|null>(null);const abyssRef=ref<HTMLElement|null>(null)
const voidGlow=ref<HTMLElement|null>(null);const ambientA=ref<HTMLElement|null>(null);const ambientB=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const segRefs=ref<(HTMLElement|null)[]>([]);const floatRefs=ref<(HTMLElement|null)[]>([])
const cleanupFns:TweenCleanup[]=[]
function setSegRef(el:HTMLElement|null,idx:number){segRefs.value[idx]=el}
function setFloatRef(el:HTMLElement|null,idx:number){floatRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,z:-500,scale:.1,rotateY:90},{autoAlpha:1,z:0,scale:1,rotateY:0,duration:.8,stagger:.12,ease:'back.out(2.5)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-40,scale:.3},{autoAlpha:1,rotateX:-15,scale:1,duration:1.2,ease:'power4.out'},'-.5')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupEscherStairs(){
  if(!scrollRef.value||!trackRef.value||!stairsRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const segs=segRefs.value.filter(Boolean) as HTMLElement[]
  const floats=floatRefs.value.filter(Boolean) as HTMLElement[]
  const stairs=stairsRef.value

  // 4段楼梯 — 方形循环，各段旋转+Z偏移
  const offsets=[
    {x:0,y:0,z:0,rz:0},
    {x:220,y:0,z:-90,rz:90},
    {x:150,y:-90,z:-220,rz:180},
    {x:-70,y:-90,z:-130,rz:270},
  ]
  segs.forEach((el,i)=>{gsap.set(el,{x:offsets[i].x,y:offsets[i].y,translateZ:offsets[i].z,rotateZ:offsets[i].rz,scale:.88+(i*.02),opacity:.75+(i*.05)})})

  // 悬浮卡片初始位置 — 散布在空间各处
  const floatPositions=[
    {x:60,y:-40,z:-50},{x:-50,y:-20,z:-100},{x:100,y:-60,z:-180},
    {x:-30,y:-70,z:-80},{x:80,y:-30,z:-150},{x:0,y:-50,z:-200},
  ]
  floats.forEach((el,i)=>{gsap.set(el,{x:floatPositions[i].x,y:floatPositions[i].y,translateZ:floatPositions[i].z,scale:.65,opacity:.5})})

  // 深渊初始
  if(abyssRef.value)gsap.set(abyssRef.value,{scale:.6,opacity:.35})
  if(stairs)gsap.set(stairs,{rotateX:-15})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){loopCount.value=Math.round(self.progress*8*10)/10},
    },
  })

  // 🪜 段循环推进
  segs.forEach((el,i)=>{
    const off=offsets[i]
    master.fromTo(el,{translateZ:off.z,rotateZ:off.rz},{translateZ:off.z+650,rotateZ:off.rz+150,duration:8,ease:'power2.in'},0)
    master.to(el,{x:off.x+25,opacity:.92,duration:4,ease:'sine.inOut'},0)
    master.to(el,{x:off.x-15,opacity:.72,duration:4,ease:'sine.inOut'},4)
  })

  // 🎴 悬浮卡片在空间中漂移
  floats.forEach((el,i)=>{
    const fp=floatPositions[i]
    master.fromTo(el,{translateZ:fp.z},{translateZ:fp.z+400,scale:.8,opacity:.7,duration:8,ease:'power2.in'},0)
    master.to(el,{y:fp.y-15,duration:2.5,ease:'sine.inOut'},0)
    master.to(el,{y:fp.y+10,duration:2.5,ease:'sine.inOut'},2.5)
    master.to(el,{y:fp.y-8,duration:2.5,ease:'sine.inOut'},5)
  })

  // 整体旋转
  if(stairs){master.to(stairs,{rotateZ:120,rotateY:25,duration:4,ease:'sine.inOut'},0);master.to(stairs,{rotateZ:-80,rotateY:-18,duration:4,ease:'sine.inOut'},4)}

  // 深渊影像呼吸+旋转
  if(abyssRef.value){
    master.to(abyssRef.value,{scale:1,opacity:.7,rotateZ:30,duration:3,ease:'power2.out'},0.5)
    for(let w=0;w<5;w++){master.to(abyssRef.value,{scale:1.08,duration:.4,ease:'sine.inOut'},2+w*1.2);master.to(abyssRef.value,{scale:.95,duration:.5,ease:'sine.inOut'},2.4+w*1.2)}
    master.to(abyssRef.value,{scale:1.2,opacity:.85,duration:2,ease:'power2.in'},7)
  }

  if(voidGlow.value)master.to(voidGlow.value,{scale:1.6,opacity:.5,duration:8},0)
  if(ambientA.value)master.to(ambientA.value,{x:'5vw',opacity:.4,duration:8},0)
  if(ambientB.value)master.to(ambientB.value,{x:'-5vw',opacity:.35,duration:8},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:8},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupEscherStairs()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.es-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0e1020 0%,#060812 60%,#020308 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.es-void{position:absolute;width:22vw;height:22vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(140,100,220,.12) 0%,transparent 60%);filter:blur(70px);pointer-events:none;z-index:0;will-change:transform,opacity}
.es-ambient{position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none;z-index:0;will-change:transform,opacity;
  &--a{width:30vw;height:25vw;top:10vh;left:15vw;background:radial-gradient(ellipse,rgba(100,160,240,.06) 0%,transparent 70%)}
  &--b{width:28vw;height:22vw;bottom:8vh;right:12vw;background:radial-gradient(ellipse,rgba(160,100,220,.05) 0%,transparent 70%)}
}
.es-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(140,100,220,.15)}}
.es-track{position:relative;width:100%}.es-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.es-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.es-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(160,130,230,.7);background:rgba(100,60,200,.08);backdrop-filter:blur(8px);border:1px solid rgba(120,80,210,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.es-title{margin:0;display:flex;justify-content:center;gap:.08em}
.es-title__c{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#a090d0;will-change:transform,opacity;&--escher{background:linear-gradient(135deg,#a090d0,#60a0e0,#c090e0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 18px rgba(140,120,210,.6))}}
.es-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#a090d0,#60a0e0,#c090e0,transparent)}
.es-sub{margin:0;font-size:clamp(.6rem,.85vw,.74rem);color:rgba(140,120,200,.3);max-width:560px;margin-inline:auto}
.es-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:600px;perspective-origin:50% 50%;will-change:transform,opacity}
.es-stairs{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

// ═══════════ 楼梯段 ═══════════
.es-segment{position:absolute;width:0;height:0;transform-style:preserve-3d;will-change:transform,opacity}

// 外侧墙壁
.es-outer-wall{position:absolute;width:min(22vw,180px);height:min(16vw,130px);margin-left:calc(min(22vw,180px) / -2);margin-top:calc(min(16vw,130px) / -2 - 30px);border-radius:4px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.35);transform:rotateX(90deg);transform-origin:center;
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__vignette{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.1) 0%,transparent 40%,transparent 60%,rgba(0,0,0,.2) 100%);pointer-events:none}
  &__label{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);font-size:.5rem;font-weight:700;letter-spacing:.14em;color:#fff;background:rgba(0,0,0,.3);backdrop-filter:blur(4px);border-radius:999px;padding:.1rem .6rem;text-shadow:0 1px 4px rgba(0,0,0,.5)}
}

// 内侧墙壁(面向深渊)
.es-inner-wall{position:absolute;width:min(14vw,110px);height:min(10vw,80px);margin-left:calc(min(14vw,110px) / -2 + 80px);margin-top:calc(min(10vw,80px) / -2 - 20px);border-radius:3px;overflow:hidden;box-shadow:0 3px 14px rgba(0,0,0,.3);transform:rotateX(90deg) rotateY(180deg);transform-origin:center;opacity:.8;
  &__img{width:100%;height:100%;object-fit:cover;display:block}
}

// ═══════════ 台阶 ═══════════
.es-step{position:absolute;width:min(18vw,145px);height:10px;margin-left:calc(min(18vw,145px) / -2);
  &__tread{position:relative;width:100%;height:100%;border-radius:2px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.25)}
  &__tread-img{width:100%;height:100%;object-fit:cover;display:block}
  &__tread-shine{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.08) 0%,transparent 60%);pointer-events:none}
  &__riser{position:absolute;top:100%;width:100%;height:12px;overflow:hidden;border-radius:0 0 2px 2px;box-shadow:0 2px 6px rgba(0,0,0,.2);transform:rotateX(-90deg);transform-origin:top}
  &__riser-img{width:100%;height:100%;object-fit:cover;display:block}

  // 6级台阶的垂直定位
  &--t1{margin-top:-48px}&--t2{margin-top:-32px}&--t3{margin-top:-16px}
  &--t4{margin-top:0}&--t5{margin-top:16px}&--t6{margin-top:32px}
}
// 2/4段台阶从"高"到"低"反向排列
.es-segment--s2 .es-step,.es-segment--s4 .es-step{
  &--t1{margin-top:48px}&--t2{margin-top:32px}&--t3{margin-top:16px}
  &--t4{margin-top:0}&--t5{margin-top:-16px}&--t6{margin-top:-32px}
}

// ═══════════ 深渊影像 ═══════════
.es-abyss{position:absolute;width:min(24vw,190px);height:min(24vw,190px);margin-left:calc(min(24vw,190px) / -2);margin-top:calc(min(24vw,190px) / -2);border-radius:50%;overflow:hidden;box-shadow:0 0 60px rgba(140,100,220,.3),0 0 0 3px rgba(255,255,255,.1);will-change:transform,opacity;z-index:5;
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__vortex{position:absolute;inset:0;background:conic-gradient(from 0deg,transparent 0%,rgba(140,100,220,.2) 25%,transparent 50%,rgba(100,160,240,.15) 75%,transparent 100%);border-radius:50%;animation:es-spin 8s linear infinite}
  &__label{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-size:.55rem;font-weight:700;letter-spacing:.18em;color:#fff;background:rgba(80,40,160,.35);backdrop-filter:blur(6px);border-radius:999px;padding:.12rem .7rem;text-shadow:0 0 8px rgba(180,140,240,.6);border:1px solid rgba(255,255,255,.12)}
}
@keyframes es-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

// ═══════════ 悬浮图片卡 ═══════════
.es-float-card{position:absolute;width:min(10vw,80px);height:min(7vw,58px);margin-left:calc(min(10vw,80px) / -2);margin-top:calc(min(7vw,58px) / -2);transform-style:preserve-3d;will-change:transform,opacity;border-radius:4px;overflow:hidden;box-shadow:0 0 18px rgba(140,100,220,.2),0 0 0 1px rgba(255,255,255,.08);z-index:8;
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__edge{position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(255,255,255,.05);border-radius:4px;pointer-events:none}
}

.es-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.es-info__dot{width:6px;height:6px;border-radius:50%;background:#a090d0;box-shadow:0 0 14px rgba(140,120,210,.6);animation:es-pulse 2s ease-in-out infinite}
@keyframes es-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.es-info__text{font-size:.6rem;font-weight:600;color:rgba(150,130,210,.6);letter-spacing:.1em}
.es-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(120,80,200,.05)}
.es-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#a090d0,#60a0e0,#c090e0,#a090d0);background-size:200% 100%;box-shadow:0 0 12px rgba(140,120,210,.5)}
@media(max-width:768px){.es-header{top:2vh}.es-kicker{font-size:.38rem;padding:.1rem .4rem}.es-title__c{font-size:1.3rem}}
</style>
