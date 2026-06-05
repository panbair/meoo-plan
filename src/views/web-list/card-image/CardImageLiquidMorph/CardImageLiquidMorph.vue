<template>
  <section ref="rootRef" class="lm-root">
    <!-- SVG滤镜：液态变形核心 -->
    <svg width="0" height="0" class="lm-svg">
      <defs>
        <filter id="lm-melt" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="5" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="melt" />
          <feGaussianBlur in="melt" stdDeviation="0" result="blur" />
        </filter>
        <filter id="lm-droplet" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="turbulence" baseFrequency="0.05 0.02" numOctaves="3" seed="5" result="wave" />
          <feDisplacementMap in="SourceGraphic" in2="wave" scale="0" xChannelSelector="R" yChannelSelector="B" result="drop" />
        </filter>
      </defs>
    </svg>

    <!-- 液态金属背景光 -->
    <div ref="metalBgRef" class="lm-metal-bg"></div>
    <canvas ref="canvasRef" class="lm-canvas"></canvas>

    <div ref="scrollRef" class="lm-scroll">
      <div ref="trackRef" class="lm-track" :style="{ height: trackHeight }">
        <div class="lm-sticky">

          <header ref="headerRef" class="lm-header">
            <span class="lm-kicker">💧 Liquid Morph · 液态变形</span>
            <h1 class="lm-title">
              <span ref="twLiquid" class="lm-title__w">液态</span>
              <span ref="twMorph" class="lm-title__w lm-title__w--alt">变形</span>
            </h1>
            <div ref="headerLineRef" class="lm-line"></div>
            <p class="lm-sub">向下滚动 · 画面如液态金属般融化流淌 · 重新凝聚为新形态</p>
          </header>

          <!-- 液态核心指示器 -->
          <div ref="dropletRef" class="lm-droplet">
            <div class="lm-droplet__body"></div>
            <div class="lm-droplet__shine"></div>
          </div>

          <div class="lm-stage">
            <article v-for="(f,idx) in frames" :key="f.id" :ref="(el)=>setFrameRef(el,idx)" class="lm-frame">
              <div :ref="(el)=>setMeltRef(el,idx)" class="lm-frame__melt"
                :style="{filter:'url(#lm-melt)',webkitFilter:'url(#lm-melt)'}">
                <img :ref="(el)=>setImgRef(el,idx)" class="lm-frame__img" :src="f.image" :alt="f.alt" loading="lazy" />
              </div>
              <div :ref="(el)=>setGlossRef(el,idx)" class="lm-frame__gloss"></div>
              <div :ref="(el)=>setCaptionRef(el,idx)" class="lm-caption">
                <span class="lm-caption__tag">{{ f.label }}</span>
                <h2>{{ f.title }}</h2>
                <p>{{ f.description }}</p>
              </div>
            </article>
          </div>

          <div class="lm-progress"><div ref="progressRef" class="lm-progress__fill"></div></div>
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
  {id:'solid',label:'Solid State',title:'固态',description:'画面以完整形态呈现，等待变形的触发。',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',alt:'海洋'},
  {id:'melt',label:'Melting',title:'融化',description:'像素和色彩开始像液态金属般软化、流淌。',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',alt:'花'},
  {id:'flow',label:'Flowing',title:'流动',description:'画面完全液化，如汞滴般在表面上自由流动。',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',alt:'山'},
  {id:'coalesce',label:'Coalescing',title:'凝聚',description:'液滴开始相互吸引、融合，新的形态逐渐成型。',image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',alt:'河'},
  {id:'reshape',label:'Reshaped',title:'重塑',description:'液态完全凝固，全新的画面从液态中完美浮现。',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',alt:'林'},
]
const FC=frames.length;const trackHeight=`${(FC+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null),scrollRef=ref<HTMLElement|null>(null),trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null),headerLineRef=ref<HTMLElement|null>(null)
const twLiquid=ref<HTMLElement|null>(null),twMorph=ref<HTMLElement|null>(null)
const dropletRef=ref<HTMLElement|null>(null),metalBgRef=ref<HTMLElement|null>(null)
const progressRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null)

const frameRefs=ref<HTMLElement[]>([]),meltRefs=ref<HTMLElement[]>([])
const imgRefs=ref<HTMLImageElement[]>([]),glossRefs=ref<HTMLElement[]>([])
const captionRefs=ref<HTMLElement[]>([])
const setFrameRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)frameRefs.value[i]=el}
const setMeltRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)meltRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const setGlossRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)glossRefs.value[i]=el}
const setCaptionRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)captionRefs.value[i]=el}
const cleanupFns:TweenCleanup[]=[]

// ── 液态金属粒子 ──
interface MercuryP{x:number;y:number;vx:number;vy:number;r:number;alpha:number;life:number;maxLife:number}
let ctx:CanvasRenderingContext2D|null=null,cw=0,ch=0;const mercuryPs:MercuryP[]=[];let animId=0
function initCanvas(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<50;i++)mercuryPs.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*1.5,vy:-Math.random()*2-.5,r:2+Math.random()*5,alpha:.2+Math.random()*.4,life:0,maxLife:150+Math.random()*300})
  function an(){
    if(!ctx)return;ctx.clearRect(0,0,cw,ch)
    if(mercuryPs.length<50&&Math.random()<.3)mercuryPs.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*1.5,vy:-Math.random()*2-.5,r:2+Math.random()*5,alpha:.2+Math.random()*.4,life:0,maxLife:150+Math.random()*300})
    for(let i=mercuryPs.length-1;i>=0;i--){const p=mercuryPs[i];p.life++;if(p.life>=p.maxLife){mercuryPs.splice(i,1);continue}
      p.x+=p.vx;p.y+=p.vy;p.vx*=.998;p.vy*=.998
      const t=p.life/p.maxLife,fade=t<.15?t/.15:t>.7?1-(t-.7)/.3:1
      const g=ctx!.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3)
      g.addColorStop(0,`rgba(220,225,235,${p.alpha*fade})`);g.addColorStop(.5,`rgba(180,190,210,${p.alpha*fade*.4})`);g.addColorStop(1,'rgba(140,150,180,0)')
      ctx!.beginPath();ctx!.arc(p.x,p.y,p.r*3,0,Math.PI*2);ctx!.fillStyle=g;ctx!.fill()
      if(p.x<-20)p.x=cw+20;if(p.x>cw+20)p.x=-20;if(p.y<-20)p.y=ch+20;if(p.y>ch+20)p.y=-20
    }
    animId=requestAnimationFrame(an)
  }
  animId=requestAnimationFrame(an)
}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!dropletRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:44},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(twLiquid.value,{autoAlpha:0,y:40,scale:.5},{autoAlpha:1,y:0,scale:1,duration:.65,ease:'back.out(2)'},'-.4')
    .fromTo(twMorph.value,{autoAlpha:0,y:-40,scale:.5},{autoAlpha:1,y:0,scale:1,duration:.65,ease:'back.out(2)'},'-.45')
    .fromTo(headerLineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
    .fromTo(dropletRef.value,{autoAlpha:0,y:-30,scale:0},{autoAlpha:1,y:0,scale:1,duration:.75,ease:'elastic.out(1,.6)'},'-.35')
    .fromTo(metalBgRef.value,{opacity:0},{opacity:1,duration:.7},'-.5')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupLiquidMorph(){
  if(!scrollRef.value||!trackRef.value)return
  const sc=scrollRef.value,track=trackRef.value,frs=frameRefs.value,melts=meltRefs.value,imgs=imgRefs.value,glosses=glossRefs.value,caps=captionRefs.value
  if(!frs.length)return

  // 动态获取SVG滤镜元素用于GSAP动画
  const turbEl=document.querySelector('#lm-melt feTurbulence') as SVGFETurbulenceElement|null
  const dispEl=document.querySelector('#lm-melt feDisplacementMap') as SVGFEDisplacementMapElement|null
  const turbEl2=document.querySelector('#lm-droplet feTurbulence') as SVGFETurbulenceElement|null
  const dispEl2=document.querySelector('#lm-droplet feDisplacementMap') as SVGFEDisplacementMapElement|null

  frs.forEach((fr,i)=>{
    gsap.set(fr,{position:'absolute',inset:0,zIndex:FC-i})
    if(i===0){gsap.set(fr,{autoAlpha:1});gsap.set(melts[i],{opacity:1,scale:1,filter:'url(#lm-melt)',borderRadius:'0px'});gsap.set(glosses[i],{opacity:.15});gsap.set(caps[i],{autoAlpha:1,y:0})}
    else{gsap.set(fr,{autoAlpha:0});gsap.set(melts[i],{opacity:.3,scale:.6,filter:'url(#lm-droplet)',borderRadius:'50%'});gsap.set(glosses[i],{opacity:.6});gsap.set(caps[i],{autoAlpha:0,y:40})}
  })

  // 为SVG滤镜属性创建GSAP动画对象
  const turbProxy={freq:0.035}
  const dispProxy={scale:0}
  const turbProxy2={freq:0.05}
  const dispProxy2={scale:0}

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2}})

  frs.forEach((_fr,i)=>{
    const o=i,melt=melts[i],gloss=glosses[i],cap=caps[i]

    // 💧 融化：液态变形 → 滤镜强度增大 → 凝聚成液滴
    mtl.to(melt,{opacity:.3,scale:.6,borderRadius:'50%',duration:.35,ease:'power3.in'},o+.5)
      .to(gloss,{opacity:.6,duration:.3,ease:'power2.in'},o+.52)
      .to(cap,{autoAlpha:0,y:-20,duration:.14},o+.5)
      .to(_fr,{autoAlpha:0,duration:.12},o+.6)

    if(i<FC-1){
      const nf=frs[i+1],nmelt=melts[i+1],ngloss=glosses[i+1],ncap=caps[i+1]
      // ✨ 重塑：液滴展开 → 新图凝固
      mtl.to(nf,{autoAlpha:1,duration:.08},o+.58)
        .to(nmelt,{opacity:1,scale:1.08,borderRadius:'25%',duration:.18,ease:'power2.out'},o+.6)
        .to(ngloss,{opacity:.3,duration:.15,ease:'power2.out'},o+.6)
        .to(nmelt,{opacity:1,scale:.97,borderRadius:'5px',duration:.12,ease:'power2.inOut'},o+.75)
        .to(nmelt,{opacity:1,scale:1,borderRadius:'0px',duration:.1,ease:'sine.inOut'},o+.84)
        .to(ngloss,{opacity:.15,duration:.1},o+.8)
        .to(ncap,{autoAlpha:1,y:0,duration:.25,ease:'back.out(1.5)'},o+.7)
    }
  })

  // 液滴指示器弹跳
  if(dropletRef.value){frs.forEach((_fr,i)=>{mtl.to(dropletRef.value,{scale:1.6,y:-10,duration:.1,ease:'power2.in'},i+.48).to(dropletRef.value,{scale:1,y:0,duration:.25,ease:'elastic.out(1,.5)'},i+.58)})}
  // 液态金属背景
  if(metalBgRef.value){frs.forEach((_fr,i)=>{mtl.to(metalBgRef.value,{opacity:1,scale:1.05,duration:.15,ease:'power2.in'},i+.5).to(metalBgRef.value,{opacity:.8,scale:1,duration:.25,ease:'power2.out'},i+.62)})}
  if(progressRef.value)mtl.to(progressRef.value,{width:'100%',duration:FC},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{initCanvas();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupLiquidMorph()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(animId);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;mercuryPs.length=0})
</script>

<style scoped lang="scss">
.lm-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(160deg,#1a1c22 0%,#252830 30%,#1e2028 60%,#16181e 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.lm-svg{position:absolute;width:0;height:0;z-index:-1}
.lm-metal-bg{position:absolute;inset:-5%;z-index:0;opacity:.8;background:radial-gradient(ellipse 45% 40% at 50% 50%,rgba(200,205,215,.15) 0%,transparent 60%),linear-gradient(135deg,rgba(120,130,150,.08),rgba(160,170,190,.05),rgba(100,110,130,.06))}
.lm-canvas{position:absolute;inset:0;z-index:1;pointer-events:none}
.lm-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:2;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(180,190,210,.2)}}
.lm-track{position:relative;width:100%}.lm-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.lm-header{position:absolute;top:3.5vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,740px)}
.lm-kicker{display:inline-block;font-size:.64rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:rgba(180,195,215,.75);background:rgba(255,255,255,.06);backdrop-filter:blur(8px);border:1px solid rgba(200,210,225,.15);border-radius:999px;padding:.26rem 1.1rem;margin-bottom:.5rem}
.lm-title{margin:0;display:flex;justify-content:center;gap:.2em}
.lm-title__w{font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#c8d0e0;text-shadow:0 0 20px rgba(180,200,220,.3);will-change:transform,opacity;&--alt{background:linear-gradient(180deg,#e0e5f0,#a0b0c8,#788898);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.lm-line{width:70px;height:2px;margin:.35rem auto .5rem;border-radius:2px;background:linear-gradient(90deg,transparent,#8898b0,#a0b0c8,transparent);transform-origin:center}
.lm-sub{margin:0;font-size:clamp(.7rem,1.05vw,.8rem);color:rgba(160,175,195,.55);line-height:1.5;max-width:420px;margin-inline:auto}
.lm-droplet{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:15;pointer-events:none;will-change:transform}.lm-droplet__body{width:50px;height:65px;background:radial-gradient(ellipse 40% 35% at 35% 30%,rgba(255,255,255,.7),rgba(180,195,215,.4),rgba(120,140,160,.2));border-radius:50% 50% 50% 50% / 40% 40% 60% 60%;box-shadow:0 4px 20px rgba(180,195,215,.3)}.lm-droplet__shine{position:absolute;top:10px;left:12px;width:10px;height:8px;border-radius:50%;background:rgba(255,255,255,.8)}
.lm-stage{position:absolute;inset:0;pointer-events:none}.lm-frame{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:opacity}
.lm-frame__melt{width:100%;height:100%;overflow:hidden;will-change:opacity,transform,border-radius}.lm-frame__img{width:100%;height:100%;object-fit:cover}
.lm-frame__gloss{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 30%,transparent 60%,rgba(200,210,225,.1) 100%);will-change:opacity}
.lm-caption{position:absolute;left:max(5vw,24px);bottom:10vh;z-index:20;max-width:min(80vw,520px);will-change:transform,opacity}
.lm-caption__tag{display:inline-flex;align-items:center;height:1.5rem;padding:0 .75rem;border-radius:999px;background:rgba(255,255,255,.08);backdrop-filter:blur(10px);border:1px solid rgba(200,210,225,.15);font-size:.6rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#a0b0c8}
.lm-caption h2{margin:.55rem 0 0;font-size:clamp(1.8rem,4.8vw,3.5rem);font-weight:900;line-height:1.1;color:#e8ecf4;text-shadow:0 2px 16px rgba(0,0,0,.4)}
.lm-caption p{margin:.35rem 0 0;font-size:clamp(.74rem,1.15vw,.88rem);line-height:1.6;color:rgba(180,195,215,.75)}
.lm-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:2px;background:rgba(255,255,255,.04)}
.lm-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#788898,#a0b0c8,#c8d0e0,#788898);background-size:200% 100%}
@media(max-width:768px){.lm-title__w{font-size:1.6rem}.lm-caption h2{font-size:1.3rem}}
</style>
