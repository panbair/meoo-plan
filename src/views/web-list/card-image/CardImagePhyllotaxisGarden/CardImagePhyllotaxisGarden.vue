<template>
  <section ref="rootRef" class="pg-root">
    <div class="pg-scene" ref="sceneRef">
      <div class="pg-garden" ref="gardenRef">
        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="pg-seed" :ref="(el)=>setSeedRef(el,idx)"
          :style="phyllotaxisStyle(idx)">
          <div class="pg-seed__inner">
            <img :src="frame.image" :alt="frame.alt"
              class="pg-seed__img" loading="eager" />
          </div>
        </div>
      </div>
    </div>
    <div class="pg-center"></div>
    <div class="pg-vignette"></div>
    <div ref="scrollRef" class="pg-scroll">
      <div ref="trackRef" class="pg-track" :style="{height:trackHeight}">
        <div class="pg-sticky">
          <header ref="headerRef" class="pg-header">
            <span class="pg-kicker">🌻 Phyllotaxis Garden · 叶序花园</span>
            <h1 class="pg-title"><span ref="tP" class="pg-title__w">叶序</span><span ref="tG" class="pg-title__w pg-title__w--alt">花园</span></h1>
            <div ref="hlRef" class="pg-line"></div>
            <p class="pg-sub">向下滚动 · 如向日葵种子螺旋排列 · 黄金角度137.5°</p>
          </header>
          <div ref="infoRef" class="pg-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="pg-progress"><div ref="progRef" class="pg-progress__fill"></div></div>
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
const N=frames.length
const GOLDEN_ANGLE=137.508 // 黄金角度（度）
const trackHeight=`${(N+1)*100}vh`

// 叶序排列：n从0到N-1，r=sqrt(n)*C，θ=n*137.508°
function phyllotaxisStyle(idx:number):Record<string,string>{
  const angle=(idx*GOLDEN_ANGLE)*(Math.PI/180)
  const radius=Math.sqrt(idx+1)*80 // 越远越大
  const x=Math.cos(angle)*radius
  const y=Math.sin(angle)*radius
  const scale=.6+(idx/(N-1))*.4 // 0.6→1.0
  return {left:`${x}px`,top:`${y}px`,transform:`scale(${scale})`}
}

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const gardenRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tP=ref<HTMLElement|null>(null);const tG=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const seedRefs=ref<HTMLElement[]>([])
const setSeedRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)seedRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tP.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tG.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupGarden(){
  if(!scrollRef.value||!trackRef.value||!gardenRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const garden=gardenRef.value
  const seeds=seedRefs.value
  if(!seeds.length)return

  // 初始透明度
  seeds.forEach((seed,i)=>{gsap.set(seed,{opacity:i<=2?1:Math.max(.2,1-(i-2)*.2)});gsap.set(seed.querySelector('img'),{scale:1})})

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 🌻 花园旋转（顺时针）+缩放呼吸
  mtl.to(garden,{rotation:180,duration:N*.5,ease:'none'},0)
  mtl.to(garden,{rotation:360,duration:N*.5,ease:'none'},N*.5)
  mtl.to(garden,{scale:1.15,duration:N*.25,ease:'sine.inOut'},0)
  mtl.to(garden,{scale:.9,duration:N*.3,ease:'sine.inOut'},N*.3)
  mtl.to(garden,{scale:1,duration:N*.45,ease:'sine.inOut'},N*.6)

  // 每颗种子开花（scale弹跳）
  seeds.forEach((seed,i)=>{
    const moment=i/N;const dur=1/N
    if(seed.querySelector('img')){
      const img=seed.querySelector('img')!
      mtl.to(img,{scale:1.15,duration:dur*.18,ease:'back.out(1.5)'},Math.max(0,moment-dur*.06))
      mtl.to(img,{scale:1,duration:dur*.22,ease:'power2.in'},moment+dur*.4)
    }
    mtl.to(seed,{opacity:1,scale:1.15,duration:dur*.15,ease:'power2.out'},Math.max(0,moment-dur*.05))
    mtl.to(seed,{opacity:i<=2?1:Math.max(.2,1-(i-2)*.2),scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupGarden()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.pg-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 45% at 50% 48%,#0a1a08 0%,#050d04 60%,#020502 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.pg-scene{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;pointer-events:none}
.pg-garden{position:relative;width:0;height:0;will-change:transform}
.pg-seed{position:absolute;will-change:transform,opacity}
.pg-seed__inner{width:clamp(90px,14vw,150px);margin-left:calc(clamp(90px,14vw,150px)/-2);margin-top:calc(clamp(110px,18vw,190px)/-2);border-radius:50%;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,.4),0 0 0 3px rgba(100,180,80,.2);transition:transform .3s}
.pg-seed__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;will-change:transform}
.pg-center{position:absolute;top:50%;left:50%;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;z-index:5;pointer-events:none;background:radial-gradient(circle,rgba(200,240,150,.6),transparent 70%);box-shadow:0 0 20px rgba(140,200,80,.3)}
.pg-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 45% 35% at 50% 50%,transparent 30%,rgba(2,5,2,.5) 100%)}
.pg-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(100,180,60,.1)}}
.pg-track{position:relative;width:100%}.pg-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.pg-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,460px)}
.pg-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(140,200,100,.4);background:rgba(0,0,0,.25);backdrop-filter:blur(6px);border:1px solid rgba(100,180,60,.1);border-radius:999px;padding:.1rem .55rem;margin-bottom:.2rem}
.pg-title{margin:0;display:flex;justify-content:center;gap:.05em}
.pg-title__w{font-size:clamp(1.4rem,3.2vw,2.4rem);font-weight:900;color:#a8d880;will-change:transform,opacity}
.pg-title__w--alt{background:linear-gradient(180deg,#d0f0a0,#68b038,#387020);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.pg-line{width:35px;height:1.5px;margin:.14rem auto .18rem;background:linear-gradient(90deg,transparent,#58a030,#80c050,transparent)}
.pg-sub{margin:0;font-size:clamp(.46rem,.64vw,.56rem);color:rgba(120,180,80,.18)}
.pg-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.52rem;color:rgba(140,200,90,.22);font-family:'Georgia',serif}
.pg-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.pg-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#488020,#78b040,#488020);background-size:200% 100%}
</style>
