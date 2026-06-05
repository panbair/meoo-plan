<template>
  <section ref="rootRef" class="ds-root">
    <!-- 3D空间场景 -->
    <div ref="space3dRef" class="ds-space3d">
      <div class="ds-billboard" v-for="(f,idx) in frames" :key="f.id"
        :ref="(el)=>setBoardRef(el,idx)"
        :style="{zIndex:FC-idx,transform:`translateZ(${(idx-FC)*200}px)`}"
      >
        <img :ref="(el)=>setImgRef(el,idx)" :src="f.image" :alt="f.alt" loading="lazy" />
      </div>
    </div>

    <!-- FPV OSD 覆盖层 -->
    <div class="ds-osd">
      <div class="ds-osd__cross"></div>
      <div class="ds-osd__horizon" ref="horizonRef"></div>
      <div class="ds-osd__info ds-osd__info--tl">
        <span>ALT <b ref="altRef">120m</b></span>
        <span>SPD <b ref="spdRef">45km/h</b></span>
      </div>
      <div class="ds-osd__info ds-osd__info--tr">
        <span>SAT 12</span>
        <span>BATT 15.2V</span>
      </div>
      <div class="ds-osd__info ds-osd__info--bl">
        <span>LAT 31.2304</span>
        <span>LON 121.4737</span>
      </div>
      <div class="ds-osd__info ds-osd__info--br">
        <span ref="modeRef">ACRO</span>
      </div>
    </div>

    <div ref="scrollRef" class="ds-scroll">
      <div ref="trackRef" class="ds-track" :style="{height:trackHeight}">
        <div class="ds-sticky">

          <header ref="headerRef" class="ds-header">
            <span class="ds-kicker">🛸 FPV Drone Sweep · 穿越飞行</span>
            <h1 class="ds-title">
              <span ref="tDrone" class="ds-title__p">FPV</span>
              <span ref="tDiv" class="ds-title__div">·</span>
              <span ref="tSweep" class="ds-title__p">穿越</span>
            </h1>
            <div ref="headerLineRef" class="ds-line"></div>
            <p class="ds-sub">向下滚动 · 第一人称视角 · 3D空间飞行 · 俯冲拉升穿越画面</p>
          </header>

          <div class="ds-stage">
            <article v-for="(f,idx) in frames" :key="f.id" :ref="(el)=>setFrameRef(el,idx)" class="ds-frame">
              <div :ref="(el)=>setCaptionRef(el,idx)" class="ds-caption">
                <span class="ds-caption__tag">{{ f.label }}</span>
                <h2>{{ f.title }}</h2>
                <p>{{ f.description }}</p>
              </div>
            </article>
          </div>

          <div class="ds-progress"><div ref="progressRef" class="ds-progress__fill"></div></div>
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
type TweenCleanup=()=>void

interface Frame{id:string;label:string;title:string;description:string;image:string;alt:string}
const frames:Frame[]=[
  {id:'launch',label:'TAKEOFF',title:'起飞升空',description:'无人机从地面弹射升空，穿越云层进入高速巡航。',image:'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',alt:'山峦航拍'},
  {id:'dive',label:'DIVE',title:'急速俯冲',description:'FPV视角急剧俯冲，画面扑面而来，肾上腺素飙升。',image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',alt:'俯冲视角'},
  {id:'bank',label:'BANK TURN',title:'倾斜转弯',description:'无人机侧倾45度急转弯，地平线在视野中剧烈倾斜。',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',alt:'侧倾转弯'},
  {id:'climb',label:'CLIMB',title:'垂直拉升',description:'全油门垂直爬升，大地在脚下急速缩小。',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',alt:'垂直爬升'},
  {id:'land',label:'LANDING',title:'穿越着陆',description:'穿越狭窄间隙，精准着陆于目标之上。',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',alt:'着陆目标'},
]
const FC=frames.length;const trackHeight=`${(FC+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null),scrollRef=ref<HTMLElement|null>(null),trackRef=ref<HTMLElement|null>(null)
const space3dRef=ref<HTMLElement|null>(null),headerRef=ref<HTMLElement|null>(null),headerLineRef=ref<HTMLElement|null>(null)
const tDrone=ref<HTMLElement|null>(null),tDiv=ref<HTMLElement|null>(null),tSweep=ref<HTMLElement|null>(null)
const horizonRef=ref<HTMLElement|null>(null),altRef=ref<HTMLElement|null>(null),spdRef=ref<HTMLElement|null>(null),modeRef=ref<HTMLElement|null>(null)
const progressRef=ref<HTMLElement|null>(null)

const boardRefs=ref<HTMLElement[]>([]),imgRefs=ref<HTMLImageElement[]>([])
const frameRefs=ref<HTMLElement[]>([]),captionRefs=ref<HTMLElement[]>([])
const setBoardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)boardRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const setFrameRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)frameRefs.value[i]=el}
const setCaptionRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)captionRefs.value[i]=el}
const cleanupFns:TweenCleanup[]=[]

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tDrone.value,{autoAlpha:0,x:-50,rotation:-20},{autoAlpha:1,x:0,rotation:0,duration:.65,ease:'back.out(2)'},'-.4')
    .fromTo(tDiv.value,{autoAlpha:0,scale:0,rotation:180},{autoAlpha:1,scale:1,rotation:0,duration:.4,ease:'back.out(2.5)'},'-.4')
    .fromTo(tSweep.value,{autoAlpha:0,x:50,rotation:20},{autoAlpha:1,x:0,rotation:0,duration:.65,ease:'back.out(2)'},'-.5')
    .fromTo(headerLineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
    .fromTo(space3dRef.value,{opacity:0},{opacity:1,duration:.7,ease:'power2.out'},'-.35')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupDroneFlight(){
  if(!scrollRef.value||!trackRef.value||!space3dRef.value)return
  const sc=scrollRef.value,track=trackRef.value,boards=boardRefs.value,imgs=imgRefs.value,caps=captionRefs.value,frs=frameRefs.value
  if(!boards.length)return

  // 初始化广告牌位置
  boards.forEach((b,i)=>{
    gsap.set(b,{opacity:i===0?1:0})
    gsap.set(imgs[i],{scale:i===0?1:1.4})
  })
  frs.forEach((fr,i)=>{
    gsap.set(fr,{position:'absolute',inset:0,zIndex:FC-i,autoAlpha:i===0?1:0})
    gsap.set(caps[i],{autoAlpha:i===0?1:0,y:i===0?0:35})
  })

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.1}})

  frs.forEach((_fr,i)=>{
    const o=i,board=boards[i],img=imgs[i],cap=caps[i]

    // 🛸 无人机飞向当前画面
    mtl.to(board,{opacity:1,duration:.2,ease:'power2.in'},o)
      .to(space3dRef.value!,{rotateX:5,rotateY:-8,rotateZ:3,duration:.25,ease:'power2.out'},o)
      .to(img,{scale:1,duration:.25,ease:'power2.out'},o)
      .to(frs[i],{autoAlpha:1,duration:.15},o)
      .to(cap,{autoAlpha:1,y:0,duration:.25,ease:'back.out(1.5)'},o+.08)

    // 🎯 穿越 → 俯冲加速
    mtl.to(space3dRef.value!,{rotateX:15,rotateY:10,rotateZ:-5,duration:.2,ease:'power2.in'},o+.5)
      .to(img,{scale:1.2,duration:.15,ease:'power2.in'},o+.5)
      .to(board,{opacity:0,duration:.12,ease:'power2.in'},o+.55)
      .to(cap,{autoAlpha:0,y:-20,duration:.12},o+.5)
      .to(frs[i],{autoAlpha:0,duration:.1},o+.58)

    if(i<FC-1){
      const nb=boards[i+1],nim=imgs[i+1],ncap=caps[i+1]
      mtl.to(space3dRef.value!,{rotateX:-10,rotateY:-15,rotateZ:8,duration:.2,ease:'power2.out'},o+.56)
        .to(nb,{opacity:1,duration:.15,ease:'power2.out'},o+.58)
        .to(nim,{scale:1,duration:.22,ease:'power2.out'},o+.58)
        .to(frs[i+1],{autoAlpha:1,duration:.12},o+.58)
        .to(ncap,{autoAlpha:1,y:0,duration:.22,ease:'back.out(1.5)'},o+.6)
    }
  })

  // OSD数据更新
  const altValues=[120,45,80,200,15],spdValues=[45,120,90,150,30],modes=['ACRO','DIVE','BANK','CLIMB','LAND']
  if(altRef.value&&spdRef.value&&modeRef.value){
    frs.forEach((_fr,i)=>{
      mtl.call(()=>{if(altRef.value)altRef.value.textContent=`${altValues[i]}m`;if(spdRef.value)spdRef.value.textContent=`${spdValues[i]}km/h`;if(modeRef.value)modeRef.value.textContent=modes[i]},null,i+.05)
    })
  }

  // 地平线倾斜
  if(horizonRef.value){
    frs.forEach((_fr,i)=>{
      mtl.to(horizonRef.value!,{rotation:[0,5,-8,12,-3][i]||0,duration:.15,ease:'power2.inOut'},i)
        .to(horizonRef.value!,{rotation:[8,-5,15,-10,0][i]||0,duration:.12,ease:'power2.in'},i+.5)
    })
  }

  if(progressRef.value)mtl.to(progressRef.value,{width:'100%',duration:FC},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupDroneFlight()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ds-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#87CEEB 0%,#b8d4e8 25%,#d4e4f0 50%,#a8d0e8 75%,#7ec8e3 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.ds-space3d{position:absolute;inset:0;z-index:1;perspective:800px;transform-style:preserve-3d;will-change:transform,opacity}
.ds-billboard{position:absolute;inset:0;transform-style:preserve-3d;display:flex;align-items:center;justify-content:center;will-change:opacity,transform}
.ds-billboard img{width:100%;height:100%;object-fit:cover;will-change:transform}
.ds-osd{position:absolute;inset:0;z-index:15;pointer-events:none;color:rgba(255,255,255,.85);font-family:'Courier New',monospace}
.ds-osd__cross{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;&::before,&::after{content:'';position:absolute;background:rgba(255,255,255,.5)}&::before{top:50%;left:0;width:100%;height:1px;transform:translateY(-50%)}&::after{left:50%;top:0;height:100%;width:1px;transform:translateX(-50%)}}
.ds-osd__horizon{position:absolute;top:50%;left:0;width:100%;height:1px;background:rgba(0,255,100,.6);transform:translateY(-50%);will-change:transform}
.ds-osd__info{position:absolute;display:flex;flex-direction:column;gap:4px;font-size:.6rem;letter-spacing:.08em;text-shadow:0 1px 4px rgba(0,0,0,.5);&--tl{top:max(4vh,28px);left:20px}&--tr{top:max(4vh,28px);right:20px;text-align:right}&--bl{bottom:max(5vh,32px);left:20px}&--br{bottom:max(5vh,32px);right:20px;text-align:right}b{color:#0f0;margin-left:4px}}
.ds-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:2;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.25)}}
.ds-track{position:relative;width:100%}.ds-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ds-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,740px)}
.ds-kicker{display:inline-block;font-size:.62rem;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:rgba(40,60,80,.75);background:rgba(255,255,255,.25);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:.25rem 1rem;margin-bottom:.5rem}
.ds-title{margin:0;display:flex;justify-content:center;align-items:center;gap:.2em}
.ds-title__p{font-size:clamp(2.2rem,5.5vw,4.5rem);font-weight:900;color:#1a3a5c;text-shadow:0 2px 4px rgba(255,255,255,.4);will-change:transform,opacity;&:last-child{background:linear-gradient(180deg,#1a5a3c,#0d8a5c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.ds-title__div{font-size:clamp(1.8rem,4vw,3.5rem);font-weight:200;color:rgba(30,60,90,.4);will-change:transform,opacity}
.ds-line{width:70px;height:2px;margin:.35rem auto .5rem;border-radius:2px;background:linear-gradient(90deg,transparent,#0d8a5c,#1a5a3c,transparent);transform-origin:center}
.ds-sub{margin:0;font-size:clamp(.7rem,1.05vw,.8rem);color:rgba(40,70,100,.55);line-height:1.4;max-width:400px;margin-inline:auto}
.ds-stage{position:absolute;inset:0;pointer-events:none}.ds-frame{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:opacity}
.ds-caption{position:absolute;left:max(5vw,24px);bottom:10vh;z-index:20;max-width:min(80vw,520px);will-change:transform,opacity}
.ds-caption__tag{display:inline-flex;align-items:center;height:1.5rem;padding:0 .7rem;border-radius:3px;background:rgba(0,0,0,.35);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);font-size:.56rem;font-weight:700;letter-spacing:.2em;color:#0f0;font-family:'Courier New',monospace}
.ds-caption h2{margin:.5rem 0 0;font-size:clamp(1.8rem,4.8vw,3.6rem);font-weight:900;line-height:1.1;color:#fff;text-shadow:0 2px 16px rgba(0,0,0,.5)}
.ds-caption p{margin:.35rem 0 0;font-size:clamp(.74rem,1.1vw,.88rem);line-height:1.6;color:rgba(255,255,255,.8);text-shadow:0 1px 6px rgba(0,0,0,.4)}
.ds-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:2px;background:rgba(255,255,255,.06)}
.ds-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#0d8a5c,#1a5a3c,#0d8a5c);background-size:200% 100%}
@media(max-width:768px){.ds-title__p{font-size:1.6rem}.ds-caption h2{font-size:1.3rem}}
</style>
