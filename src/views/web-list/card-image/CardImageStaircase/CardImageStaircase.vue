<template>
  <section ref="rootRef" class="sc-root">
    <div class="sc-scene" ref="sceneRef">
      <div class="sc-world" ref="worldRef">
        <!-- 阶梯台阶 -->
        <div v-for="si in N" :key="'step-'+si" class="sc-step"
          :style="{z:(-(si-1)*STEP_DEPTH)+'px',y:((si-1)*STEP_RISE)+'px'}"
        ></div>

        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="sc-card" :ref="(el)=>setCardRef(el,idx)">
          <div class="sc-card__frame">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="sc-card__img" loading="eager" />
          </div>
          <div class="sc-card__reflect">
            <img :src="frame.image" class="sc-card__reflect-img" />
            <div class="sc-card__reflect-fade"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="sc-vignette"></div>

    <div ref="scrollRef" class="sc-scroll">
      <div ref="trackRef" class="sc-track" :style="{height:trackHeight}">
        <div class="sc-sticky">
          <header ref="headerRef" class="sc-header">
            <span class="sc-kicker">🏛 Staircase · 阶梯画廊</span>
            <h1 class="sc-title"><span ref="t1" class="sc-title__w">阶梯</span><span ref="t2" class="sc-title__w sc-title__w--alt">画廊</span></h1>
            <div ref="hlRef" class="sc-line"></div>
            <p class="sc-sub">向下滚动 · 照片矗立在层层台阶之上 · 拾级而上</p>
          </header>
          <div ref="infoRef" class="sc-info"><span>{{ frames[currentIndex]?.title }}</span></div>
          <div class="sc-progress"><div ref="progRef" class="sc-progress__fill"></div></div>
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
const STEP_DEPTH=380;const STEP_RISE=22 // px per step
const trackHeight=`${(N+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const worldRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const t1=ref<HTMLElement|null>(null);const t2=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(t1.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(t2.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupStaircase(){
  if(!scrollRef.value||!trackRef.value||!worldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const world=worldRef.value
  const cards=cardRefs.value;const imgs=imgRefs.value
  if(!cards.length)return

  // 阶梯布局：X交替偏移 + Y逐级上升 + Z逐级深入
  cards.forEach((card,i)=>{
    const x=(i%2===0?-18:18)+'vw'
    const y=-(i*STEP_RISE)+'px' // 越远越高 → 阶梯上升
    const z=-i*STEP_DEPTH
    gsap.set(card,{x,y,z,rotateX:0,rotateY:i%2===0?-4:4,opacity:i<=2?1:Math.max(.12,1-(i-2)*.2),filter:'brightness(0.8)'})
    gsap.set(imgs[i],{scale:1})
  })

  const totalZ=(N-1)*STEP_DEPTH+450
  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  mtl.to(world,{z:totalZ,duration:N,ease:'none'},0)

  cards.forEach((_c,i)=>{
    const moment=i/N;const dur=1/N
    mtl.to(cards[i],{filter:'brightness(1.15)',rotateY:0,duration:dur*.22,ease:'power2.out'},Math.max(0,moment-dur*.08))
    mtl.to(cards[i],{filter:'brightness(0.8)',rotateY:i%2===0?-4:4,duration:dur*.35,ease:'power2.in'},moment+dur*.45)
    if(imgs[i]){mtl.to(imgs[i],{scale:1.06,duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.06));mtl.to(imgs[i],{scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)}
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupStaircase()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.sc-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#1a1814 0%,#282318 30%,#1e1a14 60%,#141210 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.sc-scene{position:absolute;inset:0;z-index:2;perspective:900px;perspective-origin:50% 42%;transform-style:preserve-3d;pointer-events:none}
.sc-world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}

/* 台阶 */
.sc-step{position:absolute;width:80vw;height:4px;margin-left:-40vw;background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent);transform:rotateX(0deg);pointer-events:none}

/* 卡片 */
.sc-card{position:absolute;transform-style:preserve-3d;will-change:transform,opacity,filter}
.sc-card__frame{width:clamp(150px,24vw,260px);margin-left:calc(clamp(150px,24vw,260px)/-2);margin-top:calc(clamp(190px,30vw,340px)/-2);background:#fcfaf8;border-radius:3px;box-shadow:0 8px 30px rgba(0,0,0,.45),0 0 0 4px #fefcf8,0 0 0 6px rgba(0,0,0,.08);overflow:hidden}
.sc-card__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;padding:7px 7px 0 7px;box-sizing:border-box;will-change:transform}
.sc-card__reflect{position:absolute;top:100%;left:0;width:100%;height:30%;transform:scaleY(-1);overflow:hidden;opacity:.25;pointer-events:none}
.sc-card__reflect-img{width:100%;height:100%;object-fit:cover;display:block}
.sc-card__reflect-fade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(20,18,14,.1),rgba(20,18,14,.5) 60%,rgba(20,18,14,1) 100%)}

.sc-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 55% 45% at 50% 45%,transparent 30%,rgba(10,8,6,.5) 100%)}
.sc-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.06)}}
.sc-track{position:relative;width:100%}.sc-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.sc-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,520px)}
.sc-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(200,180,150,.5);background:rgba(0,0,0,.2);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.05);border-radius:999px;padding:.12rem .65rem;margin-bottom:.28rem}
.sc-title{margin:0;display:flex;justify-content:center;gap:.06em}
.sc-title__w{font-size:clamp(1.6rem,3.8vw,2.8rem);font-weight:900;color:#d8c8b0;will-change:transform,opacity}
.sc-title__w--alt{background:linear-gradient(180deg,#f0e4d0,#c0a070,#886030);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sc-line{width:45px;height:1.5px;margin:.18rem auto .22rem;background:linear-gradient(90deg,transparent,#907040,#c0a070,transparent)}
.sc-sub{margin:0;font-size:clamp(.5rem,.72vw,.6rem);color:rgba(180,150,120,.25)}
.sc-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;font-size:.58rem;color:rgba(200,170,130,.3);font-family:'Georgia',serif}
.sc-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.sc-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#785828,#b09050,#785828);background-size:200% 100%}
@media(max-width:768px){.sc-card__frame{width:130px;margin-left:-65px;margin-top:-90px}.sc-title__w{font-size:1.2rem}}
</style>
