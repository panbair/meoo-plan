<template>
  <section ref="rootRef" class="cf-root">
    <div ref="particlesRef" class="cf-particles"><span v-for="p in plist" :key="p.id" class="cf-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="cf-stage">
      <div ref="bgRef" class="cf-bg"><img :src="imgs.bg" class="cf-bg__img" /></div>
      <div ref="overlayRef" class="cf-overlay"></div>

      <!-- 十字穿流：4方向图片进入并汇聚成网格 -->
      <div ref="l1Ref" class="cf-layer" style="z-index:5">
        <div ref="l1TopRef" class="cf-stream cf-stream--top" style="gap:20px">
          <div v-for="(t,i) in flow1T" :key="'t'+i" :ref="(e:any)=>setT1(e,i)" class="cf-card"><img :src="t.u" class="cf-card__img" /><span>{{t.l}}</span></div>
        </div>
        <div ref="l1BotRef" class="cf-stream cf-stream--bot" style="gap:20px">
          <div v-for="(t,i) in flow1B" :key="'b'+i" :ref="(e:any)=>setB1(e,i)" class="cf-card"><img :src="t.u" class="cf-card__img" /><span>{{t.l}}</span></div>
        </div>
      </div>
      <div ref="l2Ref" class="cf-layer" style="z-index:7">
        <div ref="l2TopRef" class="cf-stream cf-stream--top" style="gap:20px">
          <div v-for="(t,i) in flow2T" :key="'t2'+i" :ref="(e:any)=>setT2(e,i)" class="cf-card"><img :src="t.u" class="cf-card__img" /><span>{{t.l}}</span></div>
        </div>
        <div ref="l2BotRef" class="cf-stream cf-stream--bot" style="gap:20px">
          <div v-for="(t,i) in flow2B" :key="'b2'+i" :ref="(e:any)=>setB2(e,i)" class="cf-card"><img :src="t.u" class="cf-card__img" /><span>{{t.l}}</span></div>
        </div>
      </div>

      <header ref="hRef" class="cf-header"><span ref="kRef" class="cf-kicker">✚ 向下滚动 · 十字穿流 ✚</span><h1 class="cf-title"><span ref="t1Ref" class="cf-t__w cf-t__w--1">十</span><span ref="t2Ref" class="cf-t__w cf-t__w--2">字</span><span ref="t3Ref" class="cf-t__w cf-t__w--3">穿</span><span ref="t4Ref" class="cf-t__w cf-t__w--1">流</span></h1><div ref="dRef" class="cf-divider"></div><p ref="sRef" class="cf-sub">上下对穿 · 十字汇聚 · 四方来朝</p></header>
      <div ref="dotsRef" class="cf-dots"><span ref="dot1Ref" class="cf-dots__d cf-dots__d--on"></span><span ref="dot2Ref" class="cf-dots__d"></span><span ref="dot3Ref" class="cf-dots__d"></span></div>
      <div class="cf-progress"><div ref="pfRef" class="cf-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';import { gsap } from 'gsap';import { ScrollTrigger } from 'gsap/ScrollTrigger';gsap.registerPlugin(ScrollTrigger);type TC=()=>void
const imgs={bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
const u='https://images.unsplash.com/photo'
const flow1T=[{u:`${u}-1498579150354-977475b7ea0b?w=400&q=80`,l:'晨曦'},{u:`${u}-1441974231531-c6227db76b6e?w=400&q=80`,l:'森林'}]
const flow1B=[{u:`${u}-1507525428034-b723cf961d3e?w=400&q=80`,l:'海洋'},{u:`${u}-1470770903676-69b98201ea1c?w=400&q=80`,l:'湖泊'}]
const flow2T=[{u:`${u}-1465146344425-f00d5f5c8f07?w=400&q=80`,l:'花卉'},{u:`${u}-1490750967868-88aa4486c946?w=400&q=80`,l:'草原'}]
const flow2B=[{u:`${u}-1505144808419-1957a94ca61e?w=400&q=80`,l:'湖光'},{u:`${u}-1469474968028-56623f02e42e?w=400&q=80`,l:'瀑布'}]
interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:20},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.06+pr(i*2+5)*.2}`}})))
const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null),bgRef=ref<HTMLElement|null>(null),overlayRef=ref<HTMLElement|null>(null)
const l1Ref=ref<HTMLElement|null>(null),l1TopRef=ref<HTMLElement|null>(null),l1BotRef=ref<HTMLElement|null>(null)
const l2Ref=ref<HTMLElement|null>(null),l2TopRef=ref<HTMLElement|null>(null),l2BotRef=ref<HTMLElement|null>(null)
const t1c:HTMLElement[]=[],b1c:HTMLElement[]=[],t2c:HTMLElement[]=[],b2c:HTMLElement[]=[]
function setT1(e:any,i:number){if(e instanceof HTMLElement)t1c[i]=e};function setB1(e:any,i:number){if(e instanceof HTMLElement)b1c[i]=e}
function setT2(e:any,i:number){if(e instanceof HTMLElement)t2c[i]=e};function setB2(e:any,i:number){if(e instanceof HTMLElement)b2c[i]=e}
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

function crossFlow(tl:gsap.core.Timeline,topStream:HTMLElement,botStream:HTMLElement,tCards:HTMLElement[],bCards:HTMLElement[],startT:number){
  gsap.set(topStream,{y:'-40vh',autoAlpha:1});gsap.set(botStream,{y:'40vh',autoAlpha:1})
  ;[...tCards,...bCards].forEach(c=>gsap.set(c,{autoAlpha:0,scale:.7}))
  // 上排下移 + 下排上移 → 十字对穿
  tl.to(topStream,{y:0,duration:.10,ease:'power3.out'},startT)
  tl.to(botStream,{y:0,duration:.10,ease:'power3.out'},startT+.02)
  tCards.forEach((c,i)=>tl.to(c,{autoAlpha:1,scale:1,duration:.05,ease:'back.out(1.5)'},startT+.06+i*.08))
  bCards.forEach((c,i)=>tl.to(c,{autoAlpha:1,scale:1,duration:.05,ease:'back.out(1.5)'},startT+.08+i*.08))
  // 穿过后继续移动淡出
  tl.to(topStream,{y:'-20vh',autoAlpha:0,duration:.08,ease:'power2.in'},startT+.24)
  tl.to(botStream,{y:'20vh',autoAlpha:0,duration:.08,ease:'power2.in'},startT+.24)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!bgRef.value||!overlayRef.value)return
  gsap.set(st,{opacity:0});gsap.set(bgRef.value,{autoAlpha:1,scale:1.04});gsap.set(overlayRef.value,{autoAlpha:0})
  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8})
  gsap.set(dotsRef.value,{autoAlpha:0});gsap.set(particlesRef.value,{opacity:.2})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 30%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  tl.to(st,{opacity:1,duration:.03},.01);tl.to(hRef.value,{autoAlpha:1,y:0,duration:.04},.02)
  tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.03},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.04,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.03},.06);tl.to(sRef.value,{autoAlpha:1,y:0,duration:.03},.07)
  tl.to(dotsRef.value,{autoAlpha:1,duration:.03},.07);tl.to(particlesRef.value,{opacity:.5,duration:.04},.02)
  tl.to(overlayRef.value,{autoAlpha:1,duration:.06},.06);tl.to(bgRef.value,{scale:1,filter:'brightness(0.4)',duration:.06},.06)

  crossFlow(tl,l1TopRef.value!,l1BotRef.value!,t1c,b1c,.10)
  tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.26);tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.30)

  crossFlow(tl,l2TopRef.value!,l2BotRef.value!,t2c,b2c,.32)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.03},.48);tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.03},.52)

  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.03},.56)
  tl.to(overlayRef.value,{autoAlpha:.8,duration:.04},.58);tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.04},.60)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.03},.60);tl.to(st,{opacity:.35,duration:.03},.62)
  tl.to(pfRef.value,{width:'100%',duration:.7,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.cf-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.cf-particles{position:absolute;inset:0;z-index:1}.cf-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:cf-f var(--pd) var(--pdl) infinite ease-in-out}@keyframes cf-f{0%{transform:translateY(0)translateX(0)scale(1)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3)}100%{transform:translateY(0)translateX(0)scale(1)}}
.cf-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2}.cf-bg{position:absolute;inset:0;z-index:1}.cf-bg__img{width:100%;height:100%;object-fit:cover}.cf-overlay{position:absolute;inset:0;z-index:2;background:rgba(4,2,10,.6)}
.cf-layer{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px}
.cf-stream{display:flex}.cf-stream span{display:block;margin-top:.2rem;font-size:.42rem;font-weight:700;letter-spacing:.1em;color:rgba(200,160,140,.5);text-align:center}
.cf-card{width:calc((100vw - 100px)/4);text-align:center}.cf-card__img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:6px;display:block;box-shadow:0 0 0 1.5px rgba(255,190,140,.16),0 8px 24px rgba(0,0,0,.35)}
.cf-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px)}.cf-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem}.cf-title{margin:0;display:flex;justify-content:center;gap:.04em}.cf-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}.cf-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent)}.cf-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto}
.cf-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem}.cf-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15)}.cf-dots__d--on{background:rgba(255,170,110,.9)}
.cf-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.cf-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:cf-ps 4s linear infinite}@keyframes cf-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.cf-header{top:2.5vh}.cf-kicker{font-size:.44rem}.cf-t__w{font-size:1.5rem}.cf-sub{font-size:.48rem}.cf-card{width:calc((100vw - 60px)/4)}}
</style>
