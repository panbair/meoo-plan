<template>
  <section ref="rootRef" class="sp-root">
    <div ref="particlesRef" class="sp-particles"><span v-for="p in plist" :key="p.id" class="sp-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="sp-stage">
      <div ref="bgRef" class="sp-bg"><img :src="imgs.bg" class="sp-bg__img" /></div>
      <div ref="overlayRef" class="sp-overlay"></div>
      <div ref="centerGlowRef" class="sp-center-glow"></div>

      <!-- ══════ 第1层螺旋 ══════ -->
      <div ref="l1Ref" class="sp-spiral-layer" style="z-index:5">
        <div v-for="(t,i) in spiral1" :key="'s1-'+i" :ref="(el:any)=>setS1(el,i)" class="sp-orbital-card" :style="orbitalStyle(i,8)">
          <img :src="t.u" class="sp-orbital-card__img" /><span class="sp-orbital-card__label">{{t.l}}</span>
        </div>
      </div>
      <!-- ══════ 第2层螺旋 ══════ -->
      <div ref="l2Ref" class="sp-spiral-layer" style="z-index:7">
        <div v-for="(t,i) in spiral2" :key="'s2-'+i" :ref="(el:any)=>setS2(el,i)" class="sp-orbital-card" :style="orbitalStyle(i,8)">
          <img :src="t.u" class="sp-orbital-card__img" /><span class="sp-orbital-card__label">{{t.l}}</span>
        </div>
      </div>
      <!-- ══════ 第3层螺旋 ══════ -->
      <div ref="l3Ref" class="sp-spiral-layer" style="z-index:9">
        <div v-for="(t,i) in spiral3" :key="'s3-'+i" :ref="(el:any)=>setS3(el,i)" class="sp-orbital-card" :style="orbitalStyle(i,8)">
          <img :src="t.u" class="sp-orbital-card__img" /><span class="sp-orbital-card__label">{{t.l}}</span>
        </div>
      </div>

      <header ref="hRef" class="sp-header">
        <span ref="kRef" class="sp-kicker">◎ 向下滚动 · 螺旋画廊 ◎</span>
        <h1 class="sp-title"><span ref="t1Ref" class="sp-t__w sp-t__w--1">螺</span><span ref="t2Ref" class="sp-t__w sp-t__w--2">旋</span><span ref="t3Ref" class="sp-t__w sp-t__w--3">画</span><span ref="t4Ref" class="sp-t__w sp-t__w--1">廊</span></h1>
        <div ref="dRef" class="sp-divider"></div><p ref="sRef" class="sp-sub">螺旋轨道 · 图片环游 · 旋转之中见万象</p>
      </header>
      <div ref="dotsRef" class="sp-dots"><span ref="dot1Ref" class="sp-dots__d sp-dots__d--on"></span><span ref="dot2Ref" class="sp-dots__d"></span><span ref="dot3Ref" class="sp-dots__d"></span><span ref="dot4Ref" class="sp-dots__d"></span></div>
      <div class="sp-progress"><div ref="pfRef" class="sp-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TC=()=>void

const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
const u='https://images.unsplash.com/photo'
const spiral1=[{u:`${u}-1498579150354-977475b7ea0b?w=300&q=80`,l:'晨曦'},{u:`${u}-1507525428034-b723cf961d3e?w=300&q=80`,l:'海洋'},{u:`${u}-1470770903676-69b98201ea1c?w=300&q=80`,l:'湖泊'},{u:`${u}-1441974231531-c6227db76b6e?w=300&q=80`,l:'森林'},{u:`${u}-1465146344425-f00d5f5c8f07?w=300&q=80`,l:'花卉'},{u:`${u}-1490750967868-88aa4486c946?w=300&q=80`,l:'草原'},{u:`${u}-1505144808419-1957a94ca61e?w=300&q=80`,l:'湖光'},{u:`${u}-1469474968028-56623f02e42e?w=300&q=80`,l:'瀑布'}]
const spiral2=[{u:`${u}-1501785888041-af3ef285b470?w=300&q=80`,l:'山色'},{u:`${u}-1518837695005-2083093ee35b?w=300&q=80`,l:'海浪'},{u:`${u}-1472214103451-9374bd1c798e?w=300&q=80`,l:'秋色'},{u:`${u}-1500382017468-9049fed747ef?w=300&q=80`,l:'田野'},{u:`${u}-1426604966848-d7adac402bff?w=300&q=80`,l:'旷野'},{u:`${u}-1447752875215-b2761acb3c5d?w=300&q=80`,l:'秘境'},{u:`${u}-1446329813274-7c9036bd9a1f?w=300&q=80`,l:'自然'},{u:`${u}-1475924156734-496f6cac6ec1?w=300&q=80`,l:'海岸'}]
const spiral3=[{u:`${u}-1506744038136-46273834b3fb?w=300&q=80`,l:'山水'},{u:`${u}-1444464666168-49d633b86797?w=300&q=80`,l:'飞鸟'},{u:`${u}-1470071459604-3b5ec3a7fe05?w=300&q=80`,l:'远山'},{u:`${u}-1454496522488-7a8e488e8606?w=300&q=80`,l:'雪峰'},{u:`${u}-1498579150354-977475b7ea0b?w=300&q=80`,l:'晨曦'},{u:`${u}-1470770903676-69b98201ea1c?w=300&q=80`,l:'湖泊'},{u:`${u}-1465146344425-f00d5f5c8f07?w=300&q=80`,l:'花卉'},{u:`${u}-1507525428034-b723cf961d3e?w=300&q=80`,l:'海洋'}]
function orbitalStyle(i:number,total:number){
  const a=(i/total)*Math.PI*2-Math.PI/2;const r=28
  return {position:'absolute' as const,top:`calc(50% + ${Math.sin(a)*r}vh)`,left:`calc(50% + ${Math.cos(a)*r}vw)`,transform:'translate(-50%,-50%)',width:'12vw'}
}

interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:25},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null),centerGlowRef=ref<HTMLElement|null>(null)
const l1Ref=ref<HTMLElement|null>(null),l2Ref=ref<HTMLElement|null>(null),l3Ref=ref<HTMLElement|null>(null)
const s1:HTMLElement[]=[],s2:HTMLElement[]=[],s3:HTMLElement[]=[]
function setS1(e:any,i:number){if(e instanceof HTMLElement)s1[i]=e};function setS2(e:any,i:number){if(e instanceof HTMLElement)s2[i]=e};function setS3(e:any,i:number){if(e instanceof HTMLElement)s3[i]=e}
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

// 螺旋：卡片沿轨道旋转 + 向外扩散
function spiralLayer(tl:gsap.core.Timeline,refs:HTMLElement[],layer:HTMLElement,startT:number){
  gsap.set(layer,{rotation:0,autoAlpha:1})
  refs.forEach(c=>gsap.set(c,{autoAlpha:0,scale:.3,rotation:-30}))
  // 层旋转
  tl.to(layer,{rotation:360,duration:.25,ease:'none'},startT)
  // 卡片逐个弹出（从内向外）
  refs.forEach((c,i)=>tl.to(c,{autoAlpha:1,scale:1,rotation:0,duration:.05,ease:'back.out(2)'},startT+.02+i*.025))
  // 旋转加速 + 淡出
  tl.to(layer,{rotation:720,autoAlpha:0,duration:.10,ease:'power2.in'},startT+.22)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0});gsap.set(centerGlowRef.value,{autoAlpha:.5})
  ;[l1Ref,l2Ref,l3Ref].forEach(l=>gsap.set(l.value,{rotation:0,autoAlpha:1}));[...s1,...s2,...s3].forEach(c=>gsap.set(c,{autoAlpha:0,scale:.3}))
  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8})
  gsap.set(dotsRef.value,{autoAlpha:0});gsap.set(particlesRef.value,{opacity:.2})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 35%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  tl.to(st,{opacity:1,duration:.03},.01);tl.to(hRef.value,{autoAlpha:1,y:0,duration:.04},.02);tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.03},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.04,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.03},.06);tl.to(sRef.value,{autoAlpha:1,y:0,duration:.03},.07)
  tl.to(dotsRef.value,{autoAlpha:1,duration:.03},.07);tl.to(particlesRef.value,{opacity:.5,duration:.04},.02)
  tl.to(overlayRef.value,{autoAlpha:1,duration:.06},.06);tl.to(bgRef.value,{scale:1,filter:'brightness(0.4)',duration:.06},.06)

  spiralLayer(tl,s1,l1Ref.value!,.10);tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.28);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.32)
  spiralLayer(tl,s2,l2Ref.value!,.34);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.52);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.56)
  spiralLayer(tl,s3,l3Ref.value!,.58);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.76);tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.80)

  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},.84)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},.86);tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},.88)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},.88);tl.to(particlesRef.value,{opacity:.1,duration:.03},.90)
  tl.to(st,{opacity:.35,duration:.03},.92);tl.to(pfRef.value,{width:'100%',duration:1,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.sp-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.sp-particles{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity}
.sp-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:sp-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity}
@keyframes sp-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.sp-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2;will-change:opacity}
.sp-bg{position:absolute;inset:0;z-index:1}.sp-bg__img{width:100%;height:100%;object-fit:cover;display:block}
.sp-overlay{position:absolute;inset:0;z-index:2;pointer-events:none;background:rgba(4,2,10,.6);backdrop-filter:blur(1px);will-change:opacity}
.sp-center-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:30vw;height:30vw;border-radius:50%;z-index:3;pointer-events:none;background:radial-gradient(circle,rgba(200,150,255,.12) 0%,rgba(255,160,100,.06) 40%,transparent 70%);filter:blur(30px)}

.sp-spiral-layer{position:absolute;inset:0;will-change:transform,opacity}
.sp-orbital-card{text-align:center;will-change:transform,opacity}
.sp-orbital-card__img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:8px;display:block;box-shadow:0 0 0 2px rgba(255,190,140,.22),0 12px 36px rgba(0,0,0,.5)}
.sp-orbital-card__label{display:block;margin-top:.2rem;font-size:.42rem;font-weight:700;letter-spacing:.1em;color:rgba(220,180,150,.6)}

.sp-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px);pointer-events:none;will-change:transform,opacity}
.sp-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}
.sp-title{margin:0;display:flex;justify-content:center;gap:.04em}
.sp-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}
.sp-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}
.sp-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.sp-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem;pointer-events:none}.sp-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background-color .3s}.sp-dots__d--on{background:rgba(255,170,110,.9)}
.sp-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.sp-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:sp-ps 4s linear infinite}@keyframes sp-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.sp-header{top:2.5vh}.sp-kicker{font-size:.44rem}.sp-t__w{font-size:1.5rem}.sp-sub{font-size:.48rem}}
</style>
