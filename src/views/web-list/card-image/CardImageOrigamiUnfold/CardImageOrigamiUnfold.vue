<template>
  <section ref="rootRef" class="ou-root">
    <div class="ou-scene" ref="sceneRef">
      <!-- 折纸 -->
      <div class="ou-paper" ref="paperRef">
        <div v-for="(frame,fi) in frames" :key="frame.id"
          class="ou-sheet" :ref="(el)=>setSheetRef(el,fi)">
          <div v-for="seg in SEGS" :key="seg"
            class="ou-fold"
            :ref="(el)=>setFoldRef(el,fi,seg-1)"
            :style="foldStyle(seg-1)">
            <div class="ou-fold__face">
              <img :src="frame.image" :alt="frame.alt"
                class="ou-fold__img" :style="foldImgStyle(seg-1)"
                loading="eager" />
            </div>
            <div class="ou-fold__crease"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="ou-vignette"></div>

    <div ref="scrollRef" class="ou-scroll">
      <div ref="trackRef" class="ou-track" :style="{height:trackHeight}">
        <div class="ou-sticky">
          <header ref="headerRef" class="ou-header">
            <span class="ou-kicker">📄 Origami Unfold · 折纸展开</span>
            <h1 class="ou-title"><span ref="tO" class="ou-title__w">折纸</span><span ref="tU" class="ou-title__w ou-title__w--alt">展开</span></h1>
            <div ref="hlRef" class="ou-line"></div>
            <p class="ou-sub">向下滚动 · 如同展开一张折纸 · 每一道折痕都藏着新的画面</p>
          </header>
          <div ref="infoRef" class="ou-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="ou-progress"><div ref="progRef" class="ou-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {onMounted,onUnmounted,ref} from 'vue'
import {gsap} from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TweenCleanup=()=>void

interface Frame{id:string;title:string;image:string;alt:string}
const frames:Frame[]=[
  {id:'aurora',title:'极光',image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',alt:'极光'},
  {id:'ocean',title:'海浪',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',alt:'海浪'},
  {id:'mountains',title:'远山',image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',alt:'远山'},
  {id:'flowers',title:'繁花',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',alt:'繁花'},
  {id:'desert',title:'沙漠',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',alt:'沙漠'},
  {id:'forest',title:'森林',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',alt:'森林'},
  {id:'valley',title:'峡谷',image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',alt:'峡谷'},
  {id:'sunrise',title:'日出',image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',alt:'日出'},
]
const N=frames.length;const SEGS=6
const trackHeight=`${(N+1)*100}vh`

function foldStyle(seg:number):Record<string,string>{
  const pct=100/SEGS;return {top:`${seg*pct}%`,height:`${pct}%`}
}
function foldImgStyle(seg:number):Record<string,string>{
  return {objectPosition:`50% ${seg*(100/(SEGS-1))}%`}
}

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const paperRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tO=ref<HTMLElement|null>(null);const tU=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const sheetRefs=ref<HTMLElement[]>([])
const foldRefs=ref<HTMLElement[][]>([]) // [frameIdx][segIdx]
const setSheetRef=(el:Element|null,fi:number)=>{if(el instanceof HTMLElement)sheetRefs.value[fi]=el}
const setFoldRef=(el:Element|null,fi:number,si:number)=>{if(el instanceof HTMLElement){if(!foldRefs.value[fi])foldRefs.value[fi]=[];foldRefs.value[fi][si]=el}}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tO.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tU.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupOrigami(){
  if(!scrollRef.value||!trackRef.value||!paperRef.value)return
  const sc=scrollRef.value;const track=trackRef.value
  const fRefs=foldRefs.value
  if(!fRefs.length)return

  // 初始化：frame0展开，其余折叠
  fRefs.forEach((frameFolds,fi)=>{
    frameFolds.forEach((fold,si)=>{
      gsap.set(fold,{rotateX:fi===0?0:90,transformOrigin:'top',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden'})
    })
  })

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 每帧的折叠/展开序列
  fRefs.forEach((frameFolds,fi)=>{
    const start=fi/N;const dur=1/N

    if(fi<N-1){
      // 📄折叠：从下到上逐段折起(0°→90°)
      frameFolds.forEach((fold,si)=>{
        const revSi=SEGS-1-si;const stagger=revSi/SEGS*dur*.35
        mtl.to(fold,{rotateX:90,duration:dur*.25,ease:'power3.in'},start+dur*.5+stagger)
      })
    }

    if(fi>0){
      // 📄展开：从上到下逐段打开(90°→0°)
      frameFolds.forEach((fold,si)=>{
        const stagger=si/SEGS*dur*.3
        mtl.to(fold,{rotateX:0,duration:dur*.2,ease:'back.out(1.3)'},start+dur*.08+stagger)
      })
    }
  })

  // 整张纸微微浮动
  if(paperRef.value){mtl.to(paperRef.value,{y:-10,duration:N*.3,ease:'sine.inOut'},0);mtl.to(paperRef.value,{y:10,duration:N*.4,ease:'sine.inOut'},N*.35);mtl.to(paperRef.value,{y:0,duration:N*.3,ease:'sine.inOut'},N*.7)}

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupOrigami()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ou-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#f5f0e8 0%,#ede6d8 30%,#f0ebe0 60%,#e8e0d0 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.ou-scene{position:absolute;inset:0;z-index:2;perspective:1000px;perspective-origin:50% 45%;pointer-events:none}
.ou-paper{position:absolute;top:50%;left:50%;width:clamp(260px,40vw,440px);height:clamp(340px,54vw,580px);margin-left:calc(clamp(260px,40vw,440px)/-2);margin-top:calc(clamp(340px,54vw,580px)/-2);transform-style:preserve-3d;will-change:transform}
.ou-sheet{position:absolute;inset:0;transform-style:preserve-3d}
.ou-fold{position:absolute;left:0;width:100%;transform-style:preserve-3d;will-change:transform}
.ou-fold__face{position:absolute;inset:0;overflow:hidden;border:1px solid rgba(0,0,0,.05);background:#faf8f4}
.ou-fold__img{width:100%;height:600%;object-fit:cover;display:block}
.ou-fold__crease{position:absolute;top:0;left:0;width:100%;height:1px;background:rgba(0,0,0,.08);z-index:2}
.ou-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 55% 45% at 50% 48%,transparent 40%,rgba(200,190,170,.4) 100%)}
.ou-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(0,0,0,.08)}}
.ou-track{position:relative;width:100%}.ou-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ou-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,480px)}
.ou-kicker{display:inline-block;font-size:.52rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(120,100,70,.45);background:rgba(255,255,255,.4);backdrop-filter:blur(6px);border:1px solid rgba(0,0,0,.06);border-radius:999px;padding:.1rem .6rem;margin-bottom:.22rem}
.ou-title{margin:0;display:flex;justify-content:center;gap:.05em}
.ou-title__w{font-size:clamp(1.5rem,3.5vw,2.6rem);font-weight:900;color:#5a4830;will-change:transform,opacity}
.ou-title__w--alt{background:linear-gradient(180deg,#8a7050,#5a4020,#3a2810);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ou-line{width:40px;height:1.5px;margin:.16rem auto .2rem;background:linear-gradient(90deg,transparent,#6a4a28,#8a6840,transparent)}
.ou-sub{margin:0;font-size:clamp(.48rem,.68vw,.58rem);color:rgba(100,80,50,.25)}
.ou-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.55rem;color:rgba(120,100,60,.3);font-family:'Georgia',serif}
.ou-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(0,0,0,.03)}
.ou-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#5a4020,#8a6840,#5a4020);background-size:200% 100%}
</style>
