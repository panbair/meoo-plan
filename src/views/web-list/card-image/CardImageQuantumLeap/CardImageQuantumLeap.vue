<template>
  <section ref="rootRef" class="ql-root">
    <!-- SVG 滤镜层 (量子干涉) -->
    <svg class="ql-svg" width="0" height="0">
      <defs>
        <filter id="ql-interference" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence ref="turbRef" type="fractalNoise" baseFrequency="0.015" numOctaves="4" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0" result="blurred" />
        </filter>
        <filter id="ql-wave" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency="0.03 0.08" numOctaves="3" seed="7" result="wave" />
          <feDisplacementMap in="SourceGraphic" in2="wave" scale="0" xChannelSelector="R" yChannelSelector="B" />
        </filter>
      </defs>
    </svg>

    <!-- 概率云背景 -->
    <canvas ref="canvasRef" class="ql-canvas"></canvas>

    <div ref="scrollRef" class="ql-scroll">
      <div ref="trackRef" class="ql-track" :style="{ height: trackHeight }">
        <div class="ql-sticky">

          <header ref="headerRef" class="ql-header">
            <span class="ql-kicker">⚛ Quantum Leap · 量子叠加</span>
            <h1 class="ql-title">
              <span ref="tw1" class="ql-title__w">量子</span>
              <span ref="tw2" class="ql-title__w">叠加</span>
            </h1>
            <div ref="headerLineRef" class="ql-line"></div>
            <p class="ql-sub">向下滚动 = 观测行为 · 波函数坍缩 · 从概率云中实体化</p>
          </header>

          <!-- 叠加态指示器 -->
          <div ref="superposRef" class="ql-superpos">
            <div class="ql-superpos__orb" v-for="n in 5" :key="n" :style="{animationDelay:`${n*0.3}s`}"></div>
            <span class="ql-superpos__label">SUPERPOSITION</span>
          </div>

          <div class="ql-stage">
            <article v-for="(f,idx) in frames" :key="f.id" :ref="(el)=>setFrameRef(el,idx)" class="ql-frame">
              <!-- 干涉图样叠加层 -->
              <div :ref="(el)=>setInterfRef(el,idx)" class="ql-frame__interference"></div>
              <!-- 图片 (应用SVG滤镜) -->
              <div :ref="(el)=>setImgBoxRef(el,idx)" class="ql-frame__imgbox" :style="{filter: idx===0?'url(#ql-interference)':'url(#ql-wave)'}">
                <img :ref="(el)=>setImgRef(el,idx)" class="ql-frame__img" :src="f.image" :alt="f.alt" loading="lazy" />
              </div>
              <!-- 波函数可视化 -->
              <div :ref="(el)=>setWaveRef(el,idx)" class="ql-frame__wave"></div>
              <div :ref="(el)=>setCaptionRef(el,idx)" class="ql-caption">
                <span class="ql-caption__state">{{ f.label }}</span>
                <h2>{{ f.title }}</h2>
                <p>{{ f.description }}</p>
              </div>
            </article>
          </div>

          <div class="ql-progress"><div ref="progressRef" class="ql-progress__fill"></div></div>
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
  {id:'superpos',label:'Superposition',title:'叠加态',description:'所有可能的画面同时存在，如同薛定谔的猫既死又活。',image:'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80',alt:'量子星云'},
  {id:'interfere',label:'Interference',title:'干涉图样',description:'概率波相互干涉，在叠加中产生美丽的波纹图样。',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',alt:'干涉花'},
  {id:'collapse',label:'Wave Collapse',title:'波函数坍缩',description:'观测行为触发了坍缩，一个确定的现实从概率云中浮现。',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',alt:'坍缩海浪'},
  {id:'reality',label:'Reality',title:'现实凝固',description:'量子态退相干完成，此刻的画面成为观测到的确定现实。',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',alt:'确定现实'},
  {id:'leap',label:'Quantum Leap',title:'量子跃迁',description:'在不确定性中再次叠加，跃迁向全新的量子态。',image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',alt:'量子跃迁'},
]
const FC=frames.length;const trackHeight=`${(FC+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null),scrollRef=ref<HTMLElement|null>(null),trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null),headerLineRef=ref<HTMLElement|null>(null)
const tw1=ref<HTMLElement|null>(null),tw2=ref<HTMLElement|null>(null)
const superposRef=ref<HTMLElement|null>(null),progressRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null)

const frameRefs=ref<HTMLElement[]>([]),interfRefs=ref<HTMLElement[]>([])
const imgBoxRefs=ref<HTMLElement[]>([]),imgRefs=ref<HTMLImageElement[]>([])
const waveRefs=ref<HTMLElement[]>([]),captionRefs=ref<HTMLElement[]>([])
const setFrameRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)frameRefs.value[i]=el}
const setInterfRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)interfRefs.value[i]=el}
const setImgBoxRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)imgBoxRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const setWaveRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)waveRefs.value[i]=el}
const setCaptionRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)captionRefs.value[i]=el}
const cleanupFns:TweenCleanup[]=[]

// ── 概率云粒子 ──
interface ProbP{x:number;y:number;vx:number;vy:number;r:number;alpha:number;phase:number;life:number;maxLife:number}
let ctx:CanvasRenderingContext2D|null=null,cw=0,ch=0;const probParticles:ProbP[]=[];let animId=0
function initCanvas(){
  const c=canvasRef.value;if(!c)return;ctx=c.getContext('2d');if(!ctx)return
  const rs=()=>{cw=window.innerWidth;ch=window.innerHeight;c.width=cw;c.height=ch};rs()
  window.addEventListener('resize',rs);cleanupFns.push(()=>window.removeEventListener('resize',rs))
  for(let i=0;i<120;i++)probParticles.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*1.2,vy:(Math.random()-.5)*1.2,r:1+Math.random()*3,alpha:.15+Math.random()*.35,phase:Math.random()*Math.PI*2,life:0,maxLife:150+Math.random()*300})
  function an(){
    if(!ctx)return;ctx.clearRect(0,0,cw,ch)
    if(probParticles.length<120&&Math.random()<.4)probParticles.push({x:Math.random()*cw,y:Math.random()*ch,vx:(Math.random()-.5)*1.2,vy:(Math.random()-.5)*1.2,r:1+Math.random()*3,alpha:.15+Math.random()*.35,phase:Math.random()*Math.PI*2,life:0,maxLife:150+Math.random()*300})
    for(let i=probParticles.length-1;i>=0;i--){const p=probParticles[i];p.life++;if(p.life>=p.maxLife){probParticles.splice(i,1);continue}
      p.x+=p.vx+Math.sin(p.phase+p.life*.03)*.3;p.y+=p.vy+Math.cos(p.phase+p.life*.03)*.3;p.phase+=.02
      const t=p.life/p.maxLife,fade=t<.15?t/.15:t>.7?1-(t-.7)/.3:1
      const g=ctx!.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8)
      g.addColorStop(0,`rgba(100,200,255,${p.alpha*fade})`);g.addColorStop(.4,`rgba(60,150,240,${p.alpha*fade*.5})`);g.addColorStop(1,'rgba(30,100,220,0)')
      ctx!.beginPath();ctx!.arc(p.x,p.y,p.r*8,0,Math.PI*2);ctx!.fillStyle=g;ctx!.fill()
      if(p.x<-30)p.x=cw+30;if(p.x>cw+30)p.x=-30;if(p.y<-30)p.y=ch+30;if(p.y>ch+30)p.y=-30
    }
    animId=requestAnimationFrame(an)
  }
  animId=requestAnimationFrame(an)
}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!superposRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:44},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tw1.value,{autoAlpha:0,x:-40,scale:.6},{autoAlpha:1,x:0,scale:1,duration:.65,ease:'back.out(2)'},'-.4')
    .fromTo(tw2.value,{autoAlpha:0,x:40,scale:.6},{autoAlpha:1,x:0,scale:1,duration:.65,ease:'back.out(2)'},'-.5')
    .fromTo(headerLineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
    .fromTo(superposRef.value,{autoAlpha:0,scale:.3},{autoAlpha:1,scale:1,duration:.75,ease:'back.out(2)'},'-.35')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupQuantum(){
  if(!scrollRef.value||!trackRef.value)return
  const sc=scrollRef.value,track=trackRef.value,frs=frameRefs.value,interfs=interfRefs.value,imgBoxes=imgBoxRefs.value,imgs=imgRefs.value,waves=waveRefs.value,caps=captionRefs.value
  if(!frs.length)return

  // 初始化：所有帧以叠加态存在(半透明+干涉)
  frs.forEach((fr,i)=>{
    gsap.set(fr,{position:'absolute',inset:0,zIndex:FC-i})
    if(i===0){gsap.set(fr,{autoAlpha:1});gsap.set(imgBoxes[i],{opacity:1,scale:1,filter:'url(#ql-interference)'});gsap.set(interfs[i],{opacity:.6});gsap.set(waves[i],{opacity:.4,scaleY:.3});gsap.set(caps[i],{autoAlpha:1,y:0})}
    else{gsap.set(fr,{autoAlpha:.3});gsap.set(imgBoxes[i],{opacity:.35,scale:.85,filter:'url(#ql-wave)'});gsap.set(interfs[i],{opacity:.9});gsap.set(waves[i],{opacity:.8,scaleY:2});gsap.set(caps[i],{autoAlpha:0,y:35})}
  })

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.15}})

  frs.forEach((_fr,i)=>{
    const o=i,interf=interfs[i],imgBox=imgBoxes[i],wave=waves[i],cap=caps[i]

    // 📡 坍缩 → 从叠加态变为确定态
    mtl.to(imgBox,{opacity:1,scale:1,filter:'blur(0px)',duration:.35,ease:'power2.out'},o+.05)
      .to(interf,{opacity:0,duration:.3,ease:'power2.out'},o+.08)
      .to(wave,{opacity:0,scaleY:.1,duration:.3,ease:'power2.in'},o+.05)
      .to(cap,{autoAlpha:1,y:0,duration:.28,ease:'power2.out'},o+.1)

    // ⚛ 驻留期：确定态
    mtl.to(imgBox,{opacity:1,scale:1.02,duration:.08},o+.4).to(imgBox,{opacity:1,scale:1,duration:.12},o+.48)

    // 🌊 退相干 → 重新叠加
    mtl.to(imgBox,{opacity:.35,scale:.85,filter:'url(#ql-wave)',duration:.2,ease:'power3.in'},o+.55)
      .to(interf,{opacity:.9,duration:.18,ease:'power2.in'},o+.56)
      .to(wave,{opacity:.8,scaleY:2,duration:.18,ease:'power2.in'},o+.55)
      .to(cap,{autoAlpha:0,y:-20,duration:.12},o+.55)
      .to(_fr,{autoAlpha:.3,duration:.15},o+.62)

    if(i<FC-1){
      const nf=frs[i+1],nBox=imgBoxes[i+1],nInterf=interfs[i+1],nWave=waves[i+1],nCap=caps[i+1]
      mtl.to(nf,{autoAlpha:1,duration:.1},o+.58)
        .to(nBox,{opacity:1,scale:1,filter:'blur(0px)',duration:.3,ease:'power2.out'},o+.62)
        .to(nInterf,{opacity:0,duration:.28,ease:'power2.out'},o+.64)
        .to(nWave,{opacity:0,scaleY:.1,duration:.28,ease:'power2.in'},o+.62)
        .to(nCap,{autoAlpha:1,y:0,duration:.25,ease:'back.out(1.5)'},o+.65)
    }
  })

  // 叠加态指示器脉动
  if(superposRef.value){frs.forEach((_fr,i)=>{mtl.to(superposRef.value,{scale:1.4,opacity:1,duration:.1,ease:'power2.in'},i+.52).to(superposRef.value,{scale:1,opacity:.7,duration:.2,ease:'power2.out'},i+.62)})}
  if(progressRef.value)mtl.to(progressRef.value,{width:'100%',duration:FC},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{initCanvas();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupQuantum()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(animId);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0;probParticles.length=0})
</script>

<style scoped lang="scss">
.ql-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(160deg,#000510 0%,#001030 30%,#000a25 60%,#000515 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.ql-svg{position:absolute;width:0;height:0;z-index:-1}
.ql-canvas{position:absolute;inset:0;z-index:0;pointer-events:none}
.ql-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:2;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(60,160,240,.2);&:hover{background:rgba(60,160,240,.4)}}}
.ql-track{position:relative;width:100%}.ql-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ql-header{position:absolute;top:3.5vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,760px)}
.ql-kicker{display:inline-block;font-size:.64rem;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:rgba(120,200,255,.8);background:rgba(40,120,220,.12);backdrop-filter:blur(8px);border:1px solid rgba(60,140,240,.2);border-radius:999px;padding:.26rem 1.1rem;margin-bottom:.5rem}
.ql-title{margin:0;display:flex;justify-content:center;gap:.25em}
.ql-title__w{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;background:linear-gradient(180deg,#b0e0ff,#4098e0,#1050b0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 18px rgba(60,150,240,.5));will-change:transform,opacity}
.ql-line{width:70px;height:2px;margin:.35rem auto .5rem;border-radius:2px;background:linear-gradient(90deg,transparent,#3088d0,#60b0f0,transparent);transform-origin:center}
.ql-sub{margin:0;font-size:clamp(.7rem,1.05vw,.8rem);color:rgba(120,180,220,.6);line-height:1.5;max-width:420px;margin-inline:auto}
.ql-superpos{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:15;pointer-events:none;will-change:transform,opacity;opacity:.7}.ql-superpos__orb{position:absolute;top:50%;left:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:radial-gradient(circle,rgba(80,200,255,.7),transparent);animation:ql-orb 2.5s ease-in-out infinite}.ql-superpos__label{position:absolute;top:calc(100% + 18px);left:50%;transform:translateX(-50%);white-space:nowrap;font-size:.56rem;letter-spacing:.3em;color:rgba(100,200,255,.5)}
@keyframes ql-orb{0%{transform:rotate(0deg) translateX(0) scale(1)}25%{transform:rotate(72deg) translateX(55px) scale(1.5)}50%{transform:rotate(144deg) translateX(80px) scale(2)}75%{transform:rotate(216deg) translateX(55px) scale(1.5)}100%{transform:rotate(360deg) translateX(0) scale(1)}}
.ql-stage{position:absolute;inset:0;pointer-events:none}.ql-frame{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:opacity}
.ql-frame__interference{position:absolute;inset:-5%;z-index:5;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(60,160,240,.08) 3px,transparent 4px),repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(80,180,255,.06) 3px,transparent 4px);will-change:opacity}
.ql-frame__imgbox{width:100%;height:100%;will-change:opacity,transform,filter}.ql-frame__img{width:100%;height:100%;object-fit:cover}
.ql-frame__wave{position:absolute;bottom:0;left:0;width:100%;height:30%;z-index:4;pointer-events:none;background:linear-gradient(0deg,rgba(40,140,240,.25) 0%,rgba(20,80,200,.1) 40%,transparent 100%);will-change:opacity,transform;transform-origin:bottom}
.ql-caption{position:absolute;left:max(5vw,24px);bottom:10vh;z-index:20;max-width:min(80vw,540px);will-change:transform,opacity}
.ql-caption__state{display:inline-flex;align-items:center;height:1.55rem;padding:0 .75rem;border-radius:999px;background:rgba(30,100,200,.25);backdrop-filter:blur(10px);border:1px solid rgba(60,150,240,.3);font-size:.6rem;font-weight:700;letter-spacing:.18em;color:#70c0f0}
.ql-caption h2{margin:.55rem 0 0;font-size:clamp(1.8rem,4.8vw,3.5rem);font-weight:900;line-height:1.1;color:#fff;text-shadow:0 3px 18px rgba(0,0,0,.6),0 0 45px rgba(60,150,240,.35)}
.ql-caption p{margin:.35rem 0 0;font-size:clamp(.76rem,1.15vw,.9rem);line-height:1.6;color:rgba(160,210,240,.8)}
.ql-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:2px;background:rgba(255,255,255,.04)}
.ql-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#2080d0,#40a0e0,#60c0f0,#2080d0);background-size:200% 100%;box-shadow:0 0 10px rgba(40,140,240,.5)}
@media(max-width:768px){.ql-title__w{font-size:1.6rem}.ql-caption h2{font-size:1.3rem}}
</style>
