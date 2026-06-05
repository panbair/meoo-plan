<template>
  <section ref="rootRef" class="pr-root">
    <!-- RGB三层分离 -->
    <div class="pr-scene" ref="sceneRef">
      <div v-for="(frame,idx) in frames" :key="frame.id"
        class="pr-photo" :ref="(el)=>setPhotoRef(el,idx)">
        <!-- R通道 -->
        <div class="pr-channel pr-channel--r" :ref="(el)=>setChRef(el,idx,0)">
          <img :src="frame.image" :alt="frame.alt" class="pr-channel__img" loading="eager" />
        </div>
        <!-- G通道 -->
        <div class="pr-channel pr-channel--g" :ref="(el)=>setChRef(el,idx,1)">
          <img :src="frame.image" :alt="frame.alt" class="pr-channel__img" loading="eager" />
        </div>
        <!-- B通道 -->
        <div class="pr-channel pr-channel--b" :ref="(el)=>setChRef(el,idx,2)">
          <img :src="frame.image" :alt="frame.alt" class="pr-channel__img" loading="eager" />
        </div>
      </div>
    </div>

    <!-- 棱镜光效 -->
    <div class="pr-light-shaft"></div>
    <div class="pr-vignette"></div>

    <div ref="scrollRef" class="pr-scroll">
      <div ref="trackRef" class="pr-track" :style="{height:trackHeight}">
        <div class="pr-sticky">
          <header ref="headerRef" class="pr-header">
            <span class="pr-kicker">🔮 Prism Spectrum · 棱镜光谱</span>
            <h1 class="pr-title"><span ref="tP" class="pr-title__w">棱镜</span><span ref="tS" class="pr-title__w pr-title__w--alt">光谱</span></h1>
            <div ref="hlRef" class="pr-line"></div>
            <p class="pr-sub">向下滚动 · 白光分解为RGB三色 · 通道分离又聚合</p>
          </header>
          <div ref="infoRef" class="pr-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="pr-progress"><div ref="progRef" class="pr-progress__fill"></div></div>
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
const N=frames.length;const trackHeight=`${(N+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tP=ref<HTMLElement|null>(null);const tS=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const photoRefs=ref<HTMLElement[]>([])
const chRefs=ref<HTMLElement[][][]>([]) // [frame][channel][element] where channel: 0=R,1=G,2=B
const setPhotoRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)photoRefs.value[i]=el}
const setChRef=(el:Element|null,fi:number,ci:number)=>{if(el instanceof HTMLElement){if(!chRefs.value[fi])chRefs.value[fi]=[];if(!chRefs.value[fi][ci])chRefs.value[fi][ci]=[];chRefs.value[fi][ci][0]=el}}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tP.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tS.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupSpectrum(){
  if(!scrollRef.value||!trackRef.value||!sceneRef.value)return
  const sc=scrollRef.value;const track=trackRef.value
  const cRefs=chRefs.value
  if(!cRefs.length)return

  // 初始化：frame0 RGB聚合，其余分散
  cRefs.forEach((frameChs,fi)=>{
    const chR=frameChs[0]?.[0];const chG=frameChs[1]?.[0];const chB=frameChs[2]?.[0]
    if(fi===0){
      gsap.set(chR,{x:0,y:0,opacity:1});gsap.set(chG,{x:0,y:0,opacity:1});gsap.set(chB,{x:0,y:0,opacity:1})
    }else{
      gsap.set(chR,{x:-25,y:-15,opacity:0});gsap.set(chG,{x:0,y:0,opacity:0});gsap.set(chB,{x:25,y:15,opacity:0})
    }
  })

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  cRefs.forEach((frameChs,fi)=>{
    const start=fi/N;const dur=1/N
    const chR=frameChs[0]?.[0];const chG=frameChs[1]?.[0];const chB=frameChs[2]?.[0]
    if(!chR||!chG||!chB)return

    if(fi<N-1){
      // 🔮 色散：RGB三通道分离
      mtl.to(chR,{x:-22,y:-12,opacity:.8,duration:dur*.2,ease:'power2.out'},start+dur*.5)
      mtl.to(chG,{x:0,y:0,opacity:.6,duration:dur*.15,ease:'power2.in'},start+dur*.5)
      mtl.to(chB,{x:22,y:12,opacity:.8,duration:dur*.2,ease:'power2.out'},start+dur*.5)
      // RG消失
      mtl.to(chR,{opacity:0,duration:dur*.15},start+dur*.7)
      mtl.to(chB,{opacity:0,duration:dur*.15},start+dur*.7)
      mtl.to(chG,{opacity:0,duration:dur*.12},start+dur*.72)
    }

    if(fi>0){
      // 🔮 聚合：RGB三通道合并
      mtl.to(chR,{x:0,y:0,opacity:1,duration:dur*.18,ease:'power2.out'},start+dur*.06)
      mtl.to(chG,{x:0,y:0,opacity:1,duration:dur*.14,ease:'power2.out'},start+dur*.08)
      mtl.to(chB,{x:0,y:0,opacity:1,duration:dur*.18,ease:'power2.out'},start+dur*.06)
    }
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupSpectrum()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.pr-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#0a0a10;font-family:'Inter','PingFang SC',system-ui,sans-serif}
.pr-scene{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;pointer-events:none}
.pr-photo{position:absolute;width:clamp(240px,38vw,420px);height:clamp(300px,48vw,530px);margin-left:calc(clamp(240px,38vw,420px)/-2);margin-top:calc(clamp(300px,48vw,530px)/-2)}
.pr-channel{position:absolute;inset:0;will-change:transform,opacity;mix-blend-mode:screen}
.pr-channel__img{width:100%;height:100%;object-fit:cover;display:block;border-radius:4px}

// R通道：红色偏移
.pr-channel--r{filter:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='r'><feColorMatrix type='matrix' values='1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter></svg>#r") brightness(1.1)}
// 用CSS滤镜：保留红色，压制绿蓝
.pr-channel--r{filter:brightness(1.1) sepia(1) hue-rotate(-40deg) saturate(3)}
.pr-channel--g{filter:brightness(1.1) sepia(1) hue-rotate(100deg) saturate(3)}
.pr-channel--b{filter:brightness(1.1) sepia(1) hue-rotate(200deg) saturate(3)}

.pr-light-shaft{position:absolute;top:-30%;left:50%;transform:translateX(-50%);width:30vw;height:160%;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.08) 0%,rgba(200,200,255,.04) 30%,rgba(255,200,200,.03) 50%,transparent 80%);filter:blur(40px)}
.pr-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 45% 40% at 50% 50%,transparent 25%,rgba(5,5,12,.5) 100%)}
.pr-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:4;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.06)}}
.pr-track{position:relative;width:100%}.pr-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.pr-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,460px)}
.pr-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(180,160,220,.4);background:rgba(0,0,0,.25);backdrop-filter:blur(6px);border:1px solid rgba(120,100,200,.1);border-radius:999px;padding:.1rem .55rem;margin-bottom:.2rem}
.pr-title{margin:0;display:flex;justify-content:center;gap:.05em}
.pr-title__w{font-size:clamp(1.4rem,3.2vw,2.4rem);font-weight:900;color:#c0b0e8;will-change:transform,opacity}
.pr-title__w--alt{background:linear-gradient(180deg,#ff8080,#80ff80,#8080ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.pr-line{width:35px;height:1.5px;margin:.14rem auto .18rem;background:linear-gradient(90deg,transparent,#ff6666,#66ff66,#6666ff,transparent)}
.pr-sub{margin:0;font-size:clamp(.46rem,.64vw,.56rem);color:rgba(160,140,200,.18)}
.pr-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.52rem;color:rgba(180,160,220,.22);font-family:'Georgia',serif}
.pr-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.pr-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#ff6666,#66ff66,#6666ff,#ff6666);background-size:300% 100%}
</style>
