<template>
  <section ref="rootRef" class="ns-root">
    <div ref="coreLight" class="ns-core-light"></div>
    <div ref="orbitGlow" class="ns-orbit"></div>

    <div ref="scrollRef" class="ns-scroll">
      <div ref="trackRef" class="ns-track" :style="{ height: trackHeight }">
        <div class="ns-sticky">

          <header ref="headerRef" class="ns-header">
            <span class="ns-kicker">🫧 CSS3 3D Nested Spheres · 嵌套球壳 ◈</span>
            <h1 class="ns-title">
              <span ref="tc1" class="ns-title__c">嵌</span><span ref="tc2" class="ns-title__c ns-title__c--sphere">套</span>
              <span ref="tc3" class="ns-title__c">球</span><span ref="tc4" class="ns-title__c ns-title__c--sphere">壳</span>
            </h1>
            <div ref="lineRef" class="ns-line"></div>
            <p class="ns-sub">向下滚动 · 3层透明球壳嵌套旋转 · 每层贴不同世界图 · 穿透表层见内层</p>
          </header>

          <div ref="sceneRef" class="ns-scene">
            <div ref="spheresRef" class="ns-spheres">
              <!-- 外层球壳 — 最大 -->
              <div ref="outerSphere" class="ns-sphere ns-sphere--outer">
                <img :src="sphereImages[0]" alt="外层球" class="ns-sphere__img" />
                <div class="ns-sphere__fade"></div>
              </div>
              <!-- 中层球壳 -->
              <div ref="midSphere" class="ns-sphere ns-sphere--mid">
                <img :src="sphereImages[1]" alt="中层球" class="ns-sphere__img" />
                <div class="ns-sphere__fade"></div>
              </div>
              <!-- 内层球核 -->
              <div ref="innerSphere" class="ns-sphere ns-sphere--inner">
                <img :src="sphereImages[2]" alt="内核球" class="ns-sphere__img" />
                <div class="ns-sphere__core-glow"></div>
              </div>
              <!-- 球壳间的漂浮图片碎片 -->
              <div v-for="frag in 8" :key="frag"
                :ref="(el)=>setFragRef(el as HTMLElement, frag-1)"
                class="ns-frag"
              >
                <img :src="fragImages[frag-1]" class="ns-frag__img" />
              </div>
            </div>
          </div>

          <div ref="infoRef" class="ns-info">
            <span class="ns-info__dot"></span><span class="ns-info__text">{{ layerView }}</span>
          </div>
          <div class="ns-progress"><div ref="progRef" class="ns-progress__fill"></div></div>
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
const sphereImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
]
const fragImages = [
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=120&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=120&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=120&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=120&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=120&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=120&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=120&q=80',
]
const layerView=ref('外层视野')

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const spheresRef=ref<HTMLElement|null>(null)
const outerSphere=ref<HTMLElement|null>(null);const midSphere=ref<HTMLElement|null>(null);const innerSphere=ref<HTMLElement|null>(null)
const coreLight=ref<HTMLElement|null>(null);const orbitGlow=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const fragRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setFragRef(el:HTMLElement|null,idx:number){fragRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,z:-400,scale:.1,filter:'blur(20px)'},{autoAlpha:1,z:0,scale:1,filter:'blur(0px)',duration:.75,stagger:.12,ease:'back.out(2.5)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-20,scale:.3},{autoAlpha:1,rotateX:-8,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupNestedSpheres(){
  if(!scrollRef.value||!trackRef.value||!spheresRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const outer=outerSphere.value;const mid=midSphere.value;const inner=innerSphere.value
  const frags=fragRefs.value.filter(Boolean) as HTMLElement[]

  // 初始状态
  if(outer)gsap.set(outer,{scale:1,opacity:.85})
  if(mid)gsap.set(mid,{scale:.7,opacity:.55})
  if(inner)gsap.set(inner,{scale:.4,opacity:.4})
  // 碎片散布在球壳间
  frags.forEach((el,i)=>{const a=(i/frags.length)*Math.PI*2;gsap.set(el,{x:Math.cos(a)*140,y:Math.sin(a)*100-20,translateZ:Math.sin(a)*80,scale:.5,opacity:.4})})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){
        if(self.progress<.33)layerView.value='外层球壳'
        else if(self.progress<.66)layerView.value='中层球壳'
        else layerView.value='内核显现'
      },
    },
  })

  // 🫧 三层球壳各自绕不同轴旋转
  if(outer)master.to(outer,{rotateX:60,rotateY:30,duration:3,ease:'sine.inOut'},0)
  if(outer)master.to(outer,{rotateX:-40,rotateY:-25,duration:3,ease:'sine.inOut'},3)
  if(mid)master.to(mid,{rotateY:-80,rotateX:-20,duration:3,ease:'sine.inOut'},0)
  if(mid)master.to(mid,{rotateY:50,rotateX:15,duration:3,ease:'sine.inOut'},3)
  if(inner)master.to(inner,{rotateZ:360,rotateX:30,duration:6,ease:'sine.inOut'},0)

  // 外层逐渐透明 → 看到内层
  if(outer){master.to(outer,{opacity:.65,duration:3,ease:'power2.out'},1);master.to(outer,{opacity:.4,duration:2,ease:'power2.out'},4)}
  if(mid){master.to(mid,{scale:.78,opacity:.7,duration:3,ease:'power2.out'},1.5);master.to(mid,{opacity:.5,duration:2,ease:'power2.out'},4.5)}
  if(inner){master.to(inner,{scale:.55,opacity:.85,duration:3,ease:'power3.out'},2);master.to(inner,{scale:.65,opacity:.95,duration:2,ease:'power2.out'},5)}

  // 碎片在球壳间漂移
  frags.forEach((el,i)=>{
    const a=(i/frags.length)*Math.PI*2
    master.to(el,{x:Math.cos(a+2)*160,y:Math.sin(a+2)*110,translateZ:Math.sin(a+1.5)*90,scale:.65,opacity:.6,duration:6,ease:'sine.inOut'},0)
  })

  if(spheresRef.value){master.to(spheresRef.value,{rotateX:-8,duration:1},0);master.to(spheresRef.value,{rotateY:20,duration:3,ease:'sine.inOut'},1);master.to(spheresRef.value,{rotateY:-15,duration:3,ease:'sine.inOut'},4)}
  if(coreLight.value)master.to(coreLight.value,{scale:1.8,opacity:.7,duration:6,ease:'power2.in'},0)
  if(orbitGlow.value)master.to(orbitGlow.value,{rotate:60,opacity:.4,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupNestedSpheres()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ns-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#080c18 0%,#030510 60%,#000108 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.ns-core-light{position:absolute;width:15vw;height:15vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(200,180,255,.2) 0%,rgba(120,160,240,.08) 30%,transparent 55%);filter:blur(50px);pointer-events:none;z-index:0;will-change:transform,opacity}
.ns-orbit{position:absolute;width:45vw;height:45vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(160,180,220,.04);pointer-events:none;z-index:0;will-change:transform,opacity}
.ns-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(140,160,220,.1)}}
.ns-track{position:relative;width:100%}.ns-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ns-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.ns-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(180,200,240,.7);background:rgba(100,140,220,.08);backdrop-filter:blur(8px);border:1px solid rgba(120,160,220,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.ns-title{margin:0;display:flex;justify-content:center;gap:.08em}
.ns-title__c{display:inline-block;font-size:clamp(1.9rem,4.5vw,3.8rem);font-weight:900;color:#a0b8e0;will-change:transform,opacity;&--sphere{background:linear-gradient(135deg,#a0b8e0,#80a0d0,#c0d0f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(150,180,220,.5))}}
.ns-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#a0b8e0,#80a0d0,#c0d0f0,transparent)}
.ns-sub{margin:0;font-size:clamp(.58rem,.82vw,.7rem);color:rgba(140,180,220,.3);max-width:550px;margin-inline:auto}
.ns-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:600px;perspective-origin:50% 50%;will-change:transform,opacity}
.ns-spheres{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.ns-sphere{position:absolute;border-radius:50%;overflow:hidden;transform-style:preserve-3d;will-change:transform,opacity;box-shadow:0 0 50px rgba(0,0,0,.3);
  --sOuter: min(48vw, 400px); --sMid: min(34vw, 280px); --sInner: min(20vw, 170px);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__fade{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,transparent 40%,rgba(5,8,20,.2) 65%,rgba(5,8,20,.5) 85%,rgba(5,8,20,.8) 100%);pointer-events:none}
  &__core-glow{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(200,180,255,.25) 20%,transparent 60%);pointer-events:none}
  &--outer{width:var(--sOuter);height:var(--sOuter);margin-left:calc(var(--sOuter) / -2);margin-top:calc(var(--sOuter) / -2);z-index:10}
  &--mid{width:var(--sMid);height:var(--sMid);margin-left:calc(var(--sMid) / -2);margin-top:calc(var(--sMid) / -2);z-index:11}
  &--inner{width:var(--sInner);height:var(--sInner);margin-left:calc(var(--sInner) / -2);margin-top:calc(var(--sInner) / -2);z-index:12}
}

.ns-frag{position:absolute;width:min(6vw,48px);height:min(6vw,48px);border-radius:50%;overflow:hidden;transform-style:preserve-3d;will-change:transform,opacity;box-shadow:0 0 12px rgba(160,180,220,.15);z-index:15;
  &__img{width:100%;height:100%;object-fit:cover;display:block}
}

.ns-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.ns-info__dot{width:6px;height:6px;border-radius:50%;background:#a0b8e0;box-shadow:0 0 14px rgba(150,180,220,.6);animation:ns-pulse 2s ease-in-out infinite}
@keyframes ns-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.ns-info__text{font-size:.6rem;font-weight:600;color:rgba(160,190,220,.6);letter-spacing:.1em}
.ns-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(120,160,210,.05)}
.ns-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#a0b8e0,#80a0d0,#c0d0f0,#a0b8e0);background-size:200% 100%;box-shadow:0 0 10px rgba(150,180,220,.5)}
@media(max-width:768px){.ns-header{top:2vh}.ns-kicker{font-size:.38rem;padding:.1rem .4rem}.ns-title__c{font-size:1.2rem}}
</style>
