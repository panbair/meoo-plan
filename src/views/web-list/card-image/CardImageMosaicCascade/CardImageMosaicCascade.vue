<template>
  <section ref="rootRef" class="mc-root">
    <div class="mc-scene" ref="sceneRef">
      <!-- 马赛克网格 -->
      <div class="mc-mosaic" ref="mosaicRef">
        <template v-for="(frame,fi) in frames" :key="frame.id">
          <div
            v-for="(tile,ti) in tiles"
            :key="`${fi}-${ti}`"
            class="mc-tile"
            :ref="(el)=>setTileRef(el,fi,ti)"
            :style="tileStyle(ti)"
          >
            <div class="mc-tile__inner">
              <img :src="frame.image" :alt="frame.alt"
                class="mc-tile__img" :style="tileImgStyle(ti)" loading="eager" />
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="mc-vignette"></div>

    <div ref="scrollRef" class="mc-scroll">
      <div ref="trackRef" class="mc-track" :style="{height:trackHeight}">
        <div class="mc-sticky">
          <header ref="headerRef" class="mc-header">
            <span class="mc-kicker">🔲 Mosaic Cascade · 马赛克瀑布</span>
            <h1 class="mc-title"><span ref="tM" class="mc-title__w">马赛克</span><span ref="tC" class="mc-title__w mc-title__w--alt">瀑布</span></h1>
            <div ref="hlRef" class="mc-line"></div>
            <p class="mc-sub">向下滚动 · 图片碎成马赛克瓷砖 · 如瀑布般倾泻重组</p>
          </header>
          <div ref="infoRef" class="mc-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="mc-progress"><div ref="progRef" class="mc-progress__fill"></div></div>
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
const COLS=5;const ROWS=4;const TILE_N=COLS*ROWS // 20块瓷砖
const tiles=Array.from({length:TILE_N},(_,i)=>i)
const trackHeight=`${(N+1)*100}vh`

// 瓷砖网格样式
function tileStyle(i:number):Record<string,string>{
  const col=i%COLS;const row=Math.floor(i/COLS)
  const w=100/COLS;const h=100/ROWS
  return {left:`${col*w}%`,top:`${row*h}%`,width:`${w}%`,height:`${h}%`}
}
function tileImgStyle(i:number):Record<string,string>{
  const col=i%COLS;const row=Math.floor(i/COLS)
  return {width:`${COLS*100}%`,height:`${ROWS*100}%`,objectPosition:`${col*(100/(COLS-1))}% ${row*(100/(ROWS-1))}%`}
}

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const mosaicRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tM=ref<HTMLElement|null>(null);const tC=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
// tileRefs[frameIndex][tileIndex]
const tileRefs=ref<HTMLElement[][]>([])
const setTileRef=(el:Element|null,fi:number,ti:number)=>{if(el instanceof HTMLElement){if(!tileRefs.value[fi])tileRefs.value[fi]=[];tileRefs.value[fi][ti]=el}}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tM.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tC.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupMosaic(){
  if(!scrollRef.value||!trackRef.value||!mosaicRef.value)return
  const sc=scrollRef.value;const track=trackRef.value
  const tRefs=tileRefs.value
  if(!tRefs.length)return

  // 初始化所有帧的瓷砖：frame0完整、其余散落
  tRefs.forEach((frameTiles,fi)=>{
    frameTiles.forEach((tile,ti)=>{
      if(fi===0){
        gsap.set(tile,{opacity:1,scale:1,rotateZ:0,x:0,y:0,z:0})
      }else{
        const rx=(Math.random()-.5)*300;const ry=(Math.random()-.5)*400;const rz=(Math.random()-.5)*60
        gsap.set(tile,{opacity:0,scale:.3,rotateZ:rz,x:rx,y:ry,z:-100})
      }
    })
  })

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 每帧的马赛克瀑布动画
  tRefs.forEach((frameTiles,fi)=>{
    const start=fi/N;const dur=1/N

    if(fi<N-1){
      // 当前帧瓷砖散开（瀑布落下）
      frameTiles.forEach((tile,ti)=>{
        const col=ti%COLS;const row=Math.floor(ti/COLS)
        const rx=(Math.random()-.5)*350;const ry=200+Math.random()*400;const rz=(Math.random()-.5)*80
        const stagger=(row*COLS+col)/(TILE_N)*dur*.4 // 从上到下逐行散开
        mtl.to(tile,{opacity:0,scale:.2,rotateZ:rz,x:rx,y:ry,z:-150,duration:dur*.3,ease:'power3.in'},start+dur*.5+stagger)
      })
    }

    if(fi>0){
      // 下一帧瓷砖聚集（重组）
      frameTiles.forEach((tile,ti)=>{
        const col=ti%COLS;const row=Math.floor(ti/COLS)
        const stagger=(row*COLS+col)/(TILE_N)*dur*.35 // 从上到下逐行聚拢
        mtl.to(tile,{opacity:1,scale:1,rotateZ:0,x:0,y:0,z:0,duration:dur*.25,ease:'back.out(1.4)'},start+dur*.06+stagger)
      })
    }
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupMosaic()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.mc-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 55% 45% at 50% 45%,#14141a 0%,#0a0a10 60%,#040408 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.mc-scene{position:absolute;inset:0;z-index:2;perspective:600px;perspective-origin:50% 50%;pointer-events:none}
.mc-mosaic{position:absolute;top:50%;left:50%;width:min(68vw,700px);height:min(85vh,560px);margin-left:calc(min(68vw,700px)/-2);margin-top:calc(min(85vh,560px)/-2);transform-style:preserve-3d}

/* 瓷砖 */
.mc-tile{position:absolute;transform-style:preserve-3d;will-change:transform,opacity}
.mc-tile__inner{position:absolute;inset:2px;overflow:hidden;border-radius:2px;box-shadow:0 0 0 1px rgba(255,255,255,.06)}
.mc-tile__img{display:block;object-fit:cover;will-change:transform}

.mc-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 50% 40% at 50% 50%,transparent 30%,rgba(3,3,6,.5) 100%)}
.mc-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.04)}}
.mc-track{position:relative;width:100%}.mc-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.mc-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,500px)}
.mc-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(180,180,200,.4);background:rgba(0,0,0,.25);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.04);border-radius:999px;padding:.1rem .6rem;margin-bottom:.22rem}
.mc-title{margin:0;display:flex;justify-content:center;gap:.05em}
.mc-title__w{font-size:clamp(1.5rem,3.5vw,2.6rem);font-weight:900;color:#c0c0d8;will-change:transform,opacity}
.mc-title__w--alt{background:linear-gradient(180deg,#e0e0f0,#7878b0,#4848a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.mc-line{width:40px;height:1.5px;margin:.16rem auto .2rem;background:linear-gradient(90deg,transparent,#585898,#8888c0,transparent)}
.mc-sub{margin:0;font-size:clamp(.48rem,.68vw,.58rem);color:rgba(140,140,180,.18)}
.mc-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.55rem;color:rgba(160,160,200,.25);font-family:'Georgia',serif}
.mc-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.mc-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#4848a0,#7878c0,#4848a0);background-size:200% 100%}
</style>
