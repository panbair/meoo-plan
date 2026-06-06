<template>
  <section ref="rootRef" class="sh-root">
    <!-- 宇宙背景 -->
    <div ref="nebulaA" class="sh-nebula sh-nebula--a"></div>
    <div ref="nebulaB" class="sh-nebula sh-nebula--b"></div>
    <div ref="starField" class="sh-stars"></div>

    <!-- 中央光轴 -->
    <div ref="axisBeam" class="sh-axis">
      <div class="sh-axis__core"></div>
      <div class="sh-axis__pulse"></div>
      <div class="sh-axis__ring" v-for="r in 3" :key="r" :class="[`sh-axis__ring--r${r}`]"></div>
    </div>

    <div ref="scrollRef" class="sh-scroll">
      <div ref="trackRef" class="sh-track" :style="{ height: trackHeight }">
        <div class="sh-sticky">

          <header ref="headerRef" class="sh-header">
            <span class="sh-kicker">✨ CSS3 3D Cosmic Mirror · 镜像星轴 ◈</span>
            <h1 class="sh-title">
              <span ref="tc1" class="sh-title__c">镜</span><span ref="tc2" class="sh-title__c sh-title__c--cosmic">像</span>
              <span ref="tc3" class="sh-title__c">星</span><span ref="tc4" class="sh-title__c sh-title__c--cosmic">轴</span>
            </h1>
            <div ref="lineRef" class="sh-line"></div>
            <p class="sh-sub">向下滚动 · 8对图片绕中央光轴镜像漂浮 · 轨道旋转 · 能量丝连 · 宇宙平衡</p>
          </header>

          <div ref="sceneRef" class="sh-scene">
            <div ref="cosmosRef" class="sh-cosmos">

              <!-- 🔮 8对镜像图片 — 漂浮在光轴两侧 -->
              <div v-for="(orb, idx) in orbs" :key="'L'+idx"
                :ref="(el)=>setOrbRef(el as HTMLElement, 'L'+idx)"
                class="sh-orb sh-orb--left"
                :style="{'--orbit': orb.orbit, '--height': orb.height+'px'}"
              >
                <div class="sh-orb__card">
                  <img :src="orb.leftImg" :alt="orb.title" class="sh-orb__img" />
                  <div class="sh-orb__glow"></div>
                </div>
                <div class="sh-orb__trail"></div>
                <span class="sh-orb__label">{{ orb.title }}</span>
              </div>

              <div v-for="(orb, idx) in orbs" :key="'R'+idx"
                :ref="(el)=>setOrbRef(el as HTMLElement, 'R'+idx)"
                class="sh-orb sh-orb--right"
                :style="{'--orbit': orb.orbit, '--height': orb.height+'px'}"
              >
                <div class="sh-orb__card">
                  <img :src="orb.rightImg" :alt="orb.title+'右'" class="sh-orb__img" />
                  <div class="sh-orb__glow"></div>
                </div>
                <div class="sh-orb__trail"></div>
                <span class="sh-orb__label">{{ orb.title }}</span>
              </div>

              <!-- 连接能量丝 — 8条对称桥接 -->
              <div v-for="(orb, idx) in orbs" :key="'bridge'+idx"
                :ref="(el)=>setBridgeRef(el as HTMLElement, idx)"
                class="sh-bridge"
                :style="{'--height': orb.height+'px'}"
              >
                <div class="sh-bridge__thread"></div>
                <div class="sh-bridge__node sh-bridge__node--l"></div>
                <div class="sh-bridge__node sh-bridge__node--c"></div>
                <div class="sh-bridge__node sh-bridge__node--r"></div>
              </div>

            </div>
          </div>

          <div ref="infoRef" class="sh-info">
            <span class="sh-info__dot"></span><span class="sh-info__text">{{ orbs[currentOrb]?.title }} · 镜像平衡</span>
          </div>
          <div class="sh-progress"><div ref="progRef" class="sh-progress__fill"></div></div>
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

const ORB_COUNT = 8
const trackHeight = `${(ORB_COUNT+3)*100}vh`

const orbs = [
  {title:'海天', leftImg:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80', rightImg:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=300&q=80', orbit:80, height:-280},
  {title:'山谷', leftImg:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80', rightImg:'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=300&q=80', orbit:130, height:-200},
  {title:'星河', leftImg:'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=300&q=80', rightImg:'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=80', orbit:100, height:-120},
  {title:'林花', leftImg:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80', rightImg:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80', orbit:150, height:-40},
  {title:'原野', leftImg:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80', rightImg:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80', orbit:110, height:40},
  {title:'极光', leftImg:'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=300&q=80', rightImg:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80', orbit:140, height:120},
  {title:'麦浪', leftImg:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80', rightImg:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=300&q=80', orbit:90, height:200},
  {title:'星云', leftImg:'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=300&q=80', rightImg:'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=80', orbit:160, height:280},
]

const currentOrb=ref(0)
const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const cosmosRef=ref<HTMLElement|null>(null)
const axisBeam=ref<HTMLElement|null>(null)
const nebulaA=ref<HTMLElement|null>(null);const nebulaB=ref<HTMLElement|null>(null);const starField=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const orbRefs=ref<Record<string,HTMLElement|null>>({});const bridgeRefs=ref<(HTMLElement|null)[]>([])
const cleanupFns:TweenCleanup[]=[]
function setOrbRef(el:HTMLElement|null,key:string){orbRefs.value[key]=el}
function setBridgeRef(el:HTMLElement|null,idx:number){bridgeRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,z:-600,scale:0,rotateY:180},{autoAlpha:1,z:0,scale:1,rotateY:0,duration:.8,stagger:.14,ease:'back.out(3)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-30,scale:.2},{autoAlpha:1,rotateX:-8,scale:1,duration:1.2,ease:'power4.out'},'-.5')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupCosmicMirror(){
  if(!scrollRef.value||!trackRef.value||!cosmosRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const cosmos=cosmosRef.value
  const allOrbs=Object.values(orbRefs.value).filter(Boolean) as HTMLElement[]
  const bridges=bridgeRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：所有图片轨道定位
  allOrbs.forEach(el=>{gsap.set(el,{opacity:.45,scale:.7})})
  bridges.forEach(el=>{gsap.set(el,{opacity:.25,scaleX:.5})})
  if(cosmos)gsap.set(cosmos,{rotateX:-8})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){currentOrb.value=Math.min(ORB_COUNT-1,Math.max(0,Math.floor(self.progress*ORB_COUNT)))},
    },
  })

  // ✨ 所有镜像对沿Z轴推进+轨道旋转
  allOrbs.forEach((el,i)=>{
    const orbIdx=Math.floor(i/2)
    const isLeft=i%2===0
    const orb=orbs[orbIdx]
    const startZ=-orbIdx*200-100
    // 左片在光轴左侧，右片在右侧(镜像)
    const startX=isLeft?-orb.orbit:orb.orbit

    // Z轴推进
    master.fromTo(el,{translateZ:startZ,x:startX,scale:.7,opacity:.45},
      {translateZ:startZ+ORB_COUNT*180,scale:1,opacity:.9,duration:ORB_COUNT+3,ease:'power2.in'},0)
    // X轴微动（轨道呼吸）
    for(let w=0;w<4;w++){
      master.to(el,{x:startX+(isLeft?-15:15),duration:1.5,ease:'sine.inOut'},w*3)
      master.to(el,{x:startX+(isLeft?10:-10),duration:1.5,ease:'sine.inOut'},w*3+1.5)
    }
    // 绕自身旋转
    const rotY=isLeft?-15:15
    master.to(el,{rotateY:rotY,duration:4,ease:'sine.inOut'},0)
    master.to(el,{rotateY:-rotY,duration:4,ease:'sine.inOut'},4)
  })

  // 连接能量丝同步推进
  bridges.forEach((el,i)=>{
    const startZ=-i*200-100
    master.fromTo(el,{translateZ:startZ,scaleX:.5,opacity:.25},{translateZ:startZ+ORB_COUNT*180,scaleX:1,opacity:.55,duration:ORB_COUNT+3,ease:'power2.in'},0)
    for(let w=0;w<5;w++){master.to(el,{opacity:.6,duration:.3,ease:'sine.inOut'},w*2.2);master.to(el,{opacity:.4,duration:.3,ease:'sine.inOut'},w*2.2+.3)}
  })

  // 整体旋转
  if(cosmos){master.to(cosmos,{rotateY:25,duration:5,ease:'sine.inOut'},0);master.to(cosmos,{rotateY:-20,duration:5,ease:'sine.inOut'},5)}

  // 光轴脉冲
  if(axisBeam.value){for(let w=0;w<8;w++){master.to(axisBeam.value,{scaleY:1.05,opacity:.9,duration:.25,ease:'sine.inOut'},w*1.4);master.to(axisBeam.value,{scaleY:.98,opacity:.7,duration:.3,ease:'sine.inOut'},w*1.4+.25)}}

  // 星云
  if(nebulaA.value)master.to(nebulaA.value,{x:'-5vw',opacity:.5,duration:10},0)
  if(nebulaB.value)master.to(nebulaB.value,{x:'5vw',opacity:.45,duration:10},0)
  if(starField.value)master.to(starField.value,{scale:1.1,duration:10},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:ORB_COUNT+3},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupCosmicMirror()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.sh-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#080c1a 0%,#040610 60%,#010208 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}

// 宇宙背景
.sh-nebula{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0;will-change:transform,opacity;
  &--a{width:45vw;height:35vw;top:10vh;left:5vw;background:radial-gradient(ellipse,rgba(120,80,240,.12) 0%,rgba(60,160,240,.06) 40%,transparent 70%)}
  &--b{width:40vw;height:30vw;bottom:8vh;right:3vw;background:radial-gradient(ellipse,rgba(40,200,180,.1) 0%,rgba(160,100,240,.05) 35%,transparent 65%)}
}
.sh-stars{position:absolute;inset:0;z-index:0;pointer-events:none;background-image:
  radial-gradient(1px 1px at 15% 20%,rgba(255,255,255,.7),transparent),
  radial-gradient(1px 1px at 35% 55%,rgba(255,255,255,.5),transparent),
  radial-gradient(1.5px 1.5px at 55% 15%,rgba(200,200,255,.8),transparent),
  radial-gradient(1px 1px at 75% 50%,rgba(255,255,255,.4),transparent),
  radial-gradient(1px 1px at 25% 75%,rgba(255,255,255,.6),transparent),
  radial-gradient(1.5px 1.5px at 65% 30%,rgba(200,220,255,.7),transparent),
  radial-gradient(1px 1px at 45% 80%,rgba(255,255,255,.5),transparent),
  radial-gradient(1px 1px at 85% 40%,rgba(200,200,255,.6),transparent);
  background-size:280px 200px;will-change:transform}

// 中央光轴
.sh-axis{position:absolute;top:15%;left:50%;transform:translateX(-50%);width:2px;height:70%;z-index:5;pointer-events:none;will-change:transform,opacity;
  &__core{width:100%;height:100%;background:linear-gradient(180deg,transparent 0%,rgba(180,160,255,.6) 15%,rgba(200,220,255,.9) 50%,rgba(180,160,255,.6) 85%,transparent 100%);filter:blur(1px)}
  &__pulse{position:absolute;inset:-4px -8px;background:linear-gradient(180deg,transparent 0%,rgba(140,200,255,.2) 20%,rgba(180,220,255,.4) 50%,rgba(140,200,255,.2) 80%,transparent 100%);filter:blur(6px)}
  &__ring{position:absolute;left:50%;transform:translateX(-50%);border-radius:50%;border:1px solid rgba(180,200,255,.15);pointer-events:none;
    &--r1{top:15%;width:50px;height:50px;margin-left:-25px}&--r2{top:45%;width:70px;height:70px;margin-left:-35px}&--r3{top:75%;width:40px;height:40px;margin-left:-20px}
  }
}

.sh-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(140,120,220,.12)}}
.sh-track{position:relative;width:100%}.sh-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.sh-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.sh-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(180,160,240,.7);background:rgba(100,60,200,.1);backdrop-filter:blur(8px);border:1px solid rgba(140,100,220,.18);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.sh-title{margin:0;display:flex;justify-content:center;gap:.08em}
.sh-title__c{display:inline-block;font-size:clamp(1.9rem,5vw,4rem);font-weight:900;color:#b0a0e0;will-change:transform,opacity;&--cosmic{background:linear-gradient(135deg,#b0a0e0,#60b0f0,#c080f0,#60d0c0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 20px rgba(150,140,230,.7))}}
.sh-line{width:100px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#b0a0e0,#60b0f0,#c080f0,#60d0c0,transparent)}
.sh-sub{margin:0;font-size:clamp(.58rem,.82vw,.7rem);color:rgba(150,140,220,.3);max-width:560px;margin-inline:auto}
.sh-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 50%;will-change:transform,opacity}
.sh-cosmos{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

// 🪐 漂浮图片体
.sh-orb{position:absolute;width:min(17vw,140px);height:min(12vw,98px);transform-style:preserve-3d;will-change:transform,opacity;
  &__card{position:relative;width:100%;height:100%;border-radius:6px;overflow:hidden;box-shadow:0 0 25px rgba(140,120,240,.25),0 0 0 1px rgba(255,255,255,.1)}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__glow{position:absolute;inset:0;border-radius:6px;background:linear-gradient(135deg,rgba(200,180,255,.1) 0%,transparent 50%,rgba(100,200,240,.08) 100%);pointer-events:none}
  &__trail{position:absolute;top:50%;width:30px;height:1px;background:linear-gradient(90deg,transparent,rgba(180,160,255,.3),transparent);transform:translateY(-50%)}
  &__label{position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);font-size:.44rem;font-weight:600;color:rgba(180,160,240,.5);letter-spacing:.12em;white-space:nowrap}
  // 左片轨道
  &--left{margin-left:calc(min(17vw,140px) / -2 - var(--orbit));margin-top:var(--height);
    .sh-orb__trail{right:-30px}
  }
  // 右片轨道(镜像)
  &--right{margin-left:calc(min(17vw,140px) / -2 + var(--orbit));margin-top:var(--height);
    .sh-orb__trail{left:-30px}
  }
}

// ⚡ 能量桥
.sh-bridge{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform,opacity;pointer-events:none;
  margin-top:var(--height);
  &__thread{position:absolute;width:calc(var(--orbit, 100px) * 2 + min(17vw, 140px));height:1px;left:calc(var(--orbit, 100px) * -1 - min(17vw, 140px) / 2);background:linear-gradient(90deg,rgba(180,160,255,.1),rgba(180,200,255,.4) 30%,rgba(200,220,255,.6) 50%,rgba(180,200,255,.4) 70%,rgba(180,160,255,.1))}
  &__node{position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(200,220,255,.8);box-shadow:0 0 10px rgba(200,220,255,.6);top:-1px;
    &--l{left:calc(var(--orbit, 100px) * -1 - min(17vw, 140px) / 2)}&--c{left:calc(min(17vw, 140px) / -2)}&--r{left:calc(var(--orbit, 100px) - min(17vw, 140px) / 2)}
  }
}

.sh-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.sh-info__dot{width:6px;height:6px;border-radius:50%;background:#b0a0e0;box-shadow:0 0 16px rgba(160,150,230,.7);animation:sh-pulse 2s ease-in-out infinite}
@keyframes sh-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.3}}
.sh-info__text{font-size:.6rem;font-weight:600;color:rgba(170,160,230,.6);letter-spacing:.08em}
.sh-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(120,80,210,.05)}
.sh-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#b0a0e0,#60b0f0,#c080f0,#60d0c0,#b0a0e0);background-size:200% 100%;box-shadow:0 0 14px rgba(150,140,230,.6)}
@media(max-width:768px){.sh-header{top:2vh}.sh-kicker{font-size:.38rem;padding:.1rem .4rem}.sh-title__c{font-size:1.3rem}}
</style>
