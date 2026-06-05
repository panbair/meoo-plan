<template>
  <section ref="rootRef" class="lt-root">
    <!-- 光绘主画布 -->
    <canvas ref="mainCanvasRef" class="lt-main-canvas"></canvas>
    <!-- 光粒子画布 -->
    <canvas ref="particleCanvasRef" class="lt-particle-canvas"></canvas>

    <div ref="scrollRef" class="lt-scroll">
      <div ref="trackRef" class="lt-track" :style="{ height: trackHeight }">
        <div class="lt-sticky">

          <header ref="headerRef" class="lt-header">
            <span class="lt-kicker">✨ Light Trail · 光绘长曝</span>
            <h1 class="lt-title">
              <span ref="tLight" class="lt-title__w">光绘</span>
              <span ref="tTrail" class="lt-title__w lt-title__w--alt">长曝</span>
            </h1>
            <div ref="headerLineRef" class="lt-line"></div>
            <p class="lt-sub">向下滚动 · 光线一笔一划描绘出画面 · 如同长曝光摄影</p>
          </header>

          <!-- 光源指示器 -->
          <div ref="lightSourceRef" class="lt-source">
            <div class="lt-source__core"></div>
            <div class="lt-source__glow"></div>
          </div>

          <div class="lt-stage">
            <article v-for="(f,idx) in frames" :key="f.id" :ref="(el)=>setFrameRef(el,idx)" class="lt-frame">
              <img :ref="(el)=>setImgRef(el,idx)" class="lt-frame__img" :src="f.image" :alt="f.alt" loading="lazy" crossorigin="anonymous" />
              <div :ref="(el)=>setCaptionRef(el,idx)" class="lt-caption">
                <span class="lt-caption__exp">EXP {{ f.label }}</span>
                <h2>{{ f.title }}</h2>
                <p>{{ f.description }}</p>
              </div>
            </article>
          </div>

          <div class="lt-progress"><div ref="progressRef" class="lt-progress__fill"></div></div>
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
  {id:'1/1000s',label:'1/1000s',title:'曝光开始',description:'快门打开，第一束光在黑暗中开始描绘轮廓。',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',alt:'光绘花朵'},
  {id:'1/500s',label:'1/500s',title:'光线蔓延',description:'更多光束加入，线条在黑暗中交织成复杂的图样。',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',alt:'光绘海浪'},
  {id:'1/250s',label:'1/250s',title:'轨迹叠加',description:'光迹层层叠加，画面从抽象线条中逐渐显现。',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',alt:'光绘山峦'},
  {id:'1/60s',label:'1/60s',title:'细节填充',description:'细密的光线填充了每一个角落，画面变得愈发清晰。',image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',alt:'光绘河流'},
  {id:'BULB',label:'BULB',title:'长曝完成',description:'快门关闭，光绘作品完美呈现——下一张画布即将展开。',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',alt:'光绘森林'},
]
const FC=frames.length;const trackHeight=`${(FC+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null),scrollRef=ref<HTMLElement|null>(null),trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null),headerLineRef=ref<HTMLElement|null>(null)
const tLight=ref<HTMLElement|null>(null),tTrail=ref<HTMLElement|null>(null)
const lightSourceRef=ref<HTMLElement|null>(null),progressRef=ref<HTMLElement|null>(null)
const mainCanvasRef=ref<HTMLCanvasElement|null>(null),particleCanvasRef=ref<HTMLCanvasElement|null>(null)

const frameRefs=ref<HTMLElement[]>([]),imgRefs=ref<HTMLImageElement[]>([])
const captionRefs=ref<HTMLElement[]>([])
const setFrameRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)frameRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const setCaptionRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)captionRefs.value[i]=el}
const cleanupFns:TweenCleanup[]=[]

// ── 光绘主画布 (绘制"光绘"效果) ──
interface LightPath{x:number;y:number;alpha:number;hue:number;life:number;maxLife:number}
let mainCtx:CanvasRenderingContext2D|null=null,particleCtx:CanvasRenderingContext2D|null=null
let cw=0,ch=0
const lightPaths:LightPath[]=[];const lightParticles:{x:number;y:number;vx:number;vy:number;r:number;alpha:number;hue:number;life:number;maxLife:number}[]=[]
let mainAnimId=0
let currentExposure=0 // 当前曝光进度 0-1

function initCanvas(){
  const mc=mainCanvasRef.value,pc=particleCanvasRef.value
  if(!mc||!pc)return;mainCtx=mc.getContext('2d');particleCtx=pc.getContext('2d')
  if(!mainCtx||!particleCtx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;mc.width=cw;mc.height=ch;pc.width=cw;pc.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))

  function an(){
    if(!mainCtx||!particleCtx)return
    // 粒子画布清除
    particleCtx.clearRect(0,0,cw,ch)

    // 生成光粒子 (从中心向外螺旋)
    if(currentExposure>0.01){
      const cx=cw/2,cy=ch/2
      const spawnCount=Math.floor(currentExposure*30)
      for(let i=0;i<spawnCount;i++){
        const angle=Math.random()*Math.PI*2
        const dist=Math.random()*Math.min(cw,ch)*.6
        lightParticles.push({
          x:cx+Math.cos(angle)*dist*.3,y:cy+Math.sin(angle)*dist*.3,
          vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,
          r:.8+Math.random()*2.5,
          alpha:.4+Math.random()*.6,
          hue:30+Math.random()*40, // 暖色光
          life:0,maxLife:80+Math.random()*160
        })
      }
    }
    while(lightParticles.length>400)lightParticles.shift()

    // 绘制光粒子
    for(let i=lightParticles.length-1;i>=0;i--){
      const p=lightParticles[i];p.life++;if(p.life>=p.maxLife){lightParticles.splice(i,1);continue}
      const t=p.life/p.maxLife,fade=t<.05?t/.05:t>.6?1-(t-.6)/.4:1
      p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.vy*=.99
      const g=particleCtx!.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4)
      g.addColorStop(0,`hsla(${p.hue},100%,75%,${p.alpha*fade})`)
      g.addColorStop(.4,`hsla(${p.hue},90%,55%,${p.alpha*fade*.5})`)
      g.addColorStop(1,`hsla(${p.hue},80%,40%,0)`)
      particleCtx!.beginPath();particleCtx!.arc(p.x,p.y,p.r*4,0,Math.PI*2);particleCtx!.fillStyle=g;particleCtx!.fill()
      if(p.x<-20)p.x=cw+20;if(p.x>cw+20)p.x=-20;if(p.y<-20)p.y=ch+20;if(p.y>ch+20)p.y=-20
    }
    mainAnimId=requestAnimationFrame(an)
  }
  mainAnimId=requestAnimationFrame(an)
}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!lightSourceRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tLight.value,{autoAlpha:0,scale:.3},{autoAlpha:1,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tTrail.value,{autoAlpha:0,scale:.3},{autoAlpha:1,scale:1,duration:.6,ease:'back.out(2)'},'-.45')
    .fromTo(headerLineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(lightSourceRef.value,{autoAlpha:0,scale:0},{autoAlpha:1,scale:1,duration:.7,ease:'back.out(2.2)'},'-.4')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupLightTrail(){
  if(!scrollRef.value||!trackRef.value)return
  const sc=scrollRef.value,track=trackRef.value,frs=frameRefs.value,imgs=imgRefs.value,caps=captionRefs.value
  if(!frs.length)return

  frs.forEach((fr,i)=>{
    gsap.set(fr,{position:'absolute',inset:0,zIndex:FC-i})
    if(i===0){gsap.set(fr,{autoAlpha:1});gsap.set(imgs[i],{opacity:1,scale:1,filter:'brightness(1.5) saturate(1.3)'});gsap.set(caps[i],{autoAlpha:1,y:0});currentExposure=.8}
    else{gsap.set(fr,{autoAlpha:0});gsap.set(imgs[i],{opacity:0,scale:1.05,filter:'brightness(0.05) saturate(0)'});gsap.set(caps[i],{autoAlpha:0,y:35});currentExposure=.02}
  })

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.15}})

  frs.forEach((_fr,i)=>{
    const o=i,img=imgs[i],cap=caps[i]

    // ✨ 光绘曝光：图片从黑暗中出现
    mtl.to(img,{opacity:1,filter:'brightness(1.5) saturate(1.3)',duration:.3,ease:'power2.out'},o+.05)
      .to(cap,{autoAlpha:1,y:0,duration:.25,ease:'back.out(1.5)'},o+.08)
    // 🎯 更新曝光值用于粒子生成
    mtl.call(()=>{currentExposure=.8},null,o+.1)

    // 驻留
    mtl.to(img,{filter:'brightness(1.6) saturate(1.35)',duration:.08},o+.4)
      .to(img,{filter:'brightness(1.5) saturate(1.3)',duration:.1},o+.48)

    // 快门关闭 → 画面变暗
    mtl.to(img,{opacity:0,filter:'brightness(0.05) saturate(0)',duration:.2,ease:'power3.in'},o+.52)
      .to(cap,{autoAlpha:0,y:-18,duration:.12},o+.5)
      .to(_fr,{autoAlpha:0,duration:.1},o+.58)
    mtl.call(()=>{currentExposure=.02},null,o+.55)

    if(i<FC-1){
      const nf=frs[i+1],nim=imgs[i+1],ncap=caps[i+1]
      mtl.to(nf,{autoAlpha:1,duration:.1},o+.56)
        .to(nim,{opacity:1,filter:'brightness(1.5) saturate(1.3)',duration:.28,ease:'power2.out'},o+.58)
        .to(ncap,{autoAlpha:1,y:0,duration:.22,ease:'back.out(1.5)'},o+.6)
      mtl.call(()=>{currentExposure=.8},null,o+.62)
    }
  })

  // 光源跳动
  if(lightSourceRef.value){frs.forEach((_fr,i)=>{mtl.to(lightSourceRef.value,{scale:2.2,opacity:1,duration:.08,ease:'power2.in'},i+.48).to(lightSourceRef.value,{scale:1,opacity:.8,duration:.2,ease:'power2.out'},i+.56)})}
  if(progressRef.value)mtl.to(progressRef.value,{width:'100%',duration:FC},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{initCanvas();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupLightTrail()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(mainAnimId);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;lightParticles.length=0})
</script>

<style scoped lang="scss">
.lt-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#020208;font-family:'Inter','PingFang SC',system-ui,sans-serif}
.lt-main-canvas,.lt-particle-canvas{position:absolute;inset:0;z-index:1;pointer-events:none}
.lt-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:2;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,200,100,.15)}}
.lt-track{position:relative;width:100%}.lt-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.lt-header{position:absolute;top:3.5vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,720px)}
.lt-kicker{display:inline-block;font-size:.64rem;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:rgba(255,200,120,.75);background:rgba(255,160,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(255,180,80,.15);border-radius:999px;padding:.25rem 1.1rem;margin-bottom:.5rem}
.lt-title{margin:0;display:flex;justify-content:center;gap:.2em}
.lt-title__w{font-size:clamp(2.2rem,5.5vw,4.5rem);font-weight:900;color:#ffd080;text-shadow:0 0 25px rgba(255,180,60,.5);will-change:transform,opacity;&--alt{background:linear-gradient(180deg,#fff4e0,#ffb840,#e07820);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.lt-line{width:80px;height:2px;margin:.35rem auto .5rem;border-radius:2px;background:linear-gradient(90deg,transparent,#ffb840,#ffd080,transparent);transform-origin:center}
.lt-sub{margin:0;font-size:clamp(.7rem,1.05vw,.8rem);color:rgba(200,160,100,.5);line-height:1.5;max-width:400px;margin-inline:auto}
.lt-source{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:15;pointer-events:none;will-change:transform,opacity}.lt-source__core{width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:0 0 15px #fff,0 0 40px rgba(255,200,80,.8),0 0 80px rgba(255,150,30,.5);margin:0 auto}.lt-source__glow{width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,80,.4),transparent);margin:-34px 0 0 -26px}
.lt-stage{position:absolute;inset:0;pointer-events:none}.lt-frame{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:opacity}
.lt-frame__img{width:100%;height:100%;object-fit:cover;will-change:opacity,filter}
.lt-caption{position:absolute;left:max(5vw,24px);bottom:10vh;z-index:20;max-width:min(80vw,520px);will-change:transform,opacity}
.lt-caption__exp{display:inline-flex;align-items:center;height:1.5rem;padding:0 .7rem;border-radius:3px;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);border:1px solid rgba(255,180,80,.2);font-size:.56rem;font-weight:700;letter-spacing:.2em;color:#ffb840;font-family:'Courier New',monospace}
.lt-caption h2{margin:.55rem 0 0;font-size:clamp(1.8rem,4.8vw,3.8rem);font-weight:900;line-height:1.1;color:#fff;text-shadow:0 2px 16px rgba(0,0,0,.6),0 0 40px rgba(255,160,40,.3)}
.lt-caption p{margin:.35rem 0 0;font-size:clamp(.74rem,1.15vw,.88rem);line-height:1.6;color:rgba(220,180,130,.8)}
.lt-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:2px;background:rgba(255,255,255,.03)}
.lt-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#e07820,#ffb840,#ffd080,#ffb840,#e07820);background-size:200% 100%;box-shadow:0 0 8px rgba(255,160,40,.5)}
@media(max-width:768px){.lt-title__w{font-size:1.8rem}.lt-caption h2{font-size:1.3rem}}
</style>
