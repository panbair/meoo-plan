<template>
  <section ref="rootRef" class="df-root">
    <!-- 3D舞台 -->
    <div class="df-scene" ref="sceneRef">
      <!-- 镜面地板 -->
      <div class="df-floor"></div>

      <!-- 方向罗盘 -->
      <div class="df-compass" ref="compassRef">
        <span class="df-compass__arrow df-compass__arrow--t">▲</span>
        <span class="df-compass__arrow df-compass__arrow--r">▶</span>
        <span class="df-compass__arrow df-compass__arrow--b">▼</span>
        <span class="df-compass__arrow df-compass__arrow--l">◀</span>
      </div>

      <!-- 卡片世界 -->
      <div class="df-world" ref="worldRef">
        <div v-for="(frame,idx) in frames" :key="frame.id"
          class="df-card" :ref="(el)=>setCardRef(el,idx)">
          <!-- 照片主体 -->
          <div class="df-card__body">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="df-card__img" loading="eager" />
          </div>
          <!-- 3D地板倒影 -->
          <div class="df-card__reflect">
            <div class="df-card__reflect-inner">
              <img :src="frame.image" class="df-card__reflect-img" />
              <div class="df-card__reflect-fade"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="df-vignette"></div>

    <div ref="scrollRef" class="df-scroll">
      <div ref="trackRef" class="df-track" :style="{height:trackHeight}">
        <div class="df-sticky">
          <header ref="headerRef" class="df-header">
            <span class="df-kicker">🧭 3D Directional Flow · 3D方向流入</span>
            <h1 class="df-title"><span ref="tD" class="df-title__w">3D</span><span ref="tF" class="df-title__w df-title__w--alt">流入</span></h1>
            <div ref="hlRef" class="df-line"></div>
            <p class="df-sub">向下滚动 · 照片从四方3D翻转飞入 · 镜面地板倒影</p>
          </header>
          <div ref="infoRef" class="df-info">
            <span class="df-info__dir">{{ dirLabel }}</span>
            <span>{{ frames[currentIndex]?.title }}</span>
          </div>
          <div class="df-progress"><div ref="progRef" class="df-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {onMounted,onUnmounted,ref,computed} from 'vue'
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
const DIRS=['top','right','bottom','left'] as const
type Dir=typeof DIRS[number]
const trackHeight=`${(N+1)*100}vh`

const dirLabel=computed(()=>{
  const d=DIRS[currentIndex.value%4]
  return {top:'⬇ 从上翻转',right:'⬅ 从右翻转',bottom:'⬆ 从下翻转',left:'➡ 从左翻转'}[d]
})

// 方向→3D起始变换 {x, y, rotateX, rotateY, rotateZ}
function dir3DStart(d:Dir,W:number,H:number):{x:number;y:number;rx:number;ry:number;rz:number;z:number}{
  const m=.8
  switch(d){
    case 'top':    return {x:0,y:-H*m,rx:-35,ry:0,rz:0,z:-80}
    case 'right':  return {x:W*m,y:0,rx:0,ry:35,rz:0,z:-80}
    case 'bottom': return {x:0,y:H*m,rx:35,ry:0,rz:0,z:-80}
    case 'left':   return {x:-W*m,y:0,rx:0,ry:-35,rz:0,z:-80}
  }
}

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const worldRef=ref<HTMLElement|null>(null);const compassRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const hlRef=ref<HTMLElement|null>(null)
const tD=ref<HTMLElement|null>(null);const tF=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setCardRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0);const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power2.out'})
    .fromTo(tD.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tF.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(hlRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power2.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
    .fromTo(compassRef.value!,{autoAlpha:0,scale:.4},{autoAlpha:1,scale:1,duration:.6,ease:'back.out(2)'},'-.3')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setup3DFlow(){
  if(!scrollRef.value||!trackRef.value||!worldRef.value)return
  const sc=scrollRef.value;const track=trackRef.value;const world=worldRef.value
  const cards=cardRefs.value;const imgs=imgRefs.value
  if(!cards.length)return

  const W=window.innerWidth;const H=window.innerHeight

  // 初始化：第0张在中央3D状态
  cards.forEach((card,i)=>{
    if(i===0){gsap.set(card,{x:0,y:0,z:0,rotateX:0,rotateY:0,rotateZ:0,scale:1,opacity:1,filter:'brightness(1.05)'})}
    else{const d=DIRS[i%4];const s=dir3DStart(d,W,H);gsap.set(card,{x:s.x,y:s.y,z:s.z,rotateX:s.rx,rotateY:s.ry,rotateZ:s.rz,scale:.6,opacity:0,filter:'brightness(.7) blur(2px)'})}
    gsap.set(imgs[i],{scale:1})
  })

  const mtl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.25,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}}})

  // 世界微呼吸
  mtl.to(world,{y:-15,duration:N*.25,ease:'sine.inOut'},0)
  mtl.to(world,{y:10,duration:N*.35,ease:'sine.inOut'},N*.3)
  mtl.to(world,{y:0,duration:N*.4,ease:'sine.inOut'},N*.65)

  // 罗盘旋转
  if(compassRef.value){mtl.to(compassRef.value,{rotation:360,duration:N,ease:'none'},0)}

  cards.forEach((_card,i)=>{
    const start=i/N;const dur=1/N
    const d=DIRS[i%4] as Dir
    const enterS=dir3DStart(d,W,H)
    const exitD=DIRS[(i+2)%4] as Dir
    const exitS=dir3DStart(exitD,W,H)

    // 🚀 3D飞入：从远处翻转进入
    if(i>0){
      mtl.fromTo(cards[i],
        {x:enterS.x,y:enterS.y,z:enterS.z,rotateX:enterS.rx,rotateY:enterS.ry,rotateZ:enterS.rz,scale:.65,opacity:0,filter:'brightness(.7) blur(2px)'},
        {x:0,y:0,z:0,rotateX:0,rotateY:0,rotateZ:0,scale:1,opacity:1,filter:'brightness(1.03) blur(0px)',duration:dur*.35,ease:'power2.out'},start)
      if(imgs[i])mtl.fromTo(imgs[i],{scale:1.3},{scale:1.06,duration:dur*.3,ease:'power2.out'},start)
    }

    // 📍 驻留
    mtl.to(cards[i],{x:0,y:0,z:0,rotateX:0,rotateY:0,rotateZ:0,scale:1,duration:dur*.12,ease:'none'},start+dur*.35)
    if(imgs[i]){mtl.to(imgs[i],{scale:1.1,duration:dur*.05,ease:'sine.inOut'},start+dur*.3);mtl.to(imgs[i],{scale:1.06,duration:dur*.07,ease:'sine.inOut'},start+dur*.35)}

    // 🚀 3D飞出
    if(i<N-1){
      mtl.to(cards[i],{x:exitS.x,y:exitS.y,z:exitS.z,rotateX:exitS.rx,rotateY:exitS.ry,rotateZ:exitS.rz,scale:.65,opacity:0,filter:'brightness(.7) blur(2px)',duration:dur*.3,ease:'power2.in'},start+dur*.5)
    }
  })

  if(progRef.value)mtl.to(progRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setup3DFlow()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.df-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse 50% 38% at 50% 45%,#0e1220 0%,#060a14 60%,#020408 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}

/* 🏛 3D场景 */
.df-scene{position:absolute;inset:0;z-index:2;perspective:1000px;perspective-origin:50% 45%;transform-style:preserve-3d;pointer-events:none}

/* 🪞 镜面地板 */
.df-floor{position:absolute;bottom:0;left:0;width:100%;height:40%;background:linear-gradient(to bottom,rgba(20,22,30,.05),rgba(20,22,30,.3) 40%,rgba(15,16,24,.6) 100%);transform:rotateX(65deg);transform-origin:bottom;pointer-events:none}

/* 3D世界 */
.df-world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}

/* 🧭 罗盘 */
.df-compass{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;z-index:5;pointer-events:none;will-change:transform}
.df-compass__arrow{position:absolute;font-size:.8rem;color:rgba(255,255,255,.1);transition:all .3s}
.df-compass__arrow--t{top:0;left:50%;transform:translateX(-50%)}.df-compass__arrow--r{top:50%;right:0;transform:translateY(-50%)}
.df-compass__arrow--b{bottom:0;left:50%;transform:translateX(-50%)}.df-compass__arrow--l{top:50%;left:0;transform:translateY(-50%)}

/* 🖼 卡片(3D) */
.df-card{position:absolute;transform-style:preserve-3d;will-change:transform,opacity,filter}
.df-card__body{width:clamp(200px,30vw,340px);margin-left:calc(clamp(200px,30vw,340px)/-2);margin-top:calc(clamp(250px,38vw,430px)/-2);background:#faf8f6;border-radius:5px;box-shadow:0 15px 50px rgba(0,0,0,.5),0 0 0 4px #fefcf8,0 0 0 6px rgba(0,0,0,.08);overflow:hidden;position:relative;z-index:2}
.df-card__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;padding:8px 8px 0 8px;box-sizing:border-box;will-change:transform}

/* 🪞 倒影 */
.df-card__reflect{position:absolute;top:100%;left:0;width:100%;height:38%;transform:scaleY(-1);overflow:hidden;opacity:.25;pointer-events:none;z-index:1}
.df-card__reflect-inner{position:relative;width:100%;height:100%}
.df-card__reflect-img{width:100%;height:100%;object-fit:cover;display:block}
.df-card__reflect-fade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(6,10,20,.15),rgba(6,10,20,.45) 45%,rgba(6,10,20,.8) 80%,rgba(6,10,20,1) 100%)}

.df-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 45% 38% at 50% 50%,transparent 30%,rgba(2,3,8,.5) 100%)}
.df-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.04)}}
.df-track{position:relative;width:100%}.df-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.df-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,480px)}
.df-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(150,170,210,.35);background:rgba(0,0,0,.2);backdrop-filter:blur(6px);border:1px solid rgba(120,150,200,.06);border-radius:999px;padding:.1rem .55rem;margin-bottom:.2rem}
.df-title{margin:0;display:flex;justify-content:center;gap:.05em}
.df-title__w{font-size:clamp(1.4rem,3.2vw,2.4rem);font-weight:900;color:#a8bce0;will-change:transform,opacity}
.df-title__w--alt{background:linear-gradient(180deg,#ff9999,#9999ff,#66ccff,#66ff99);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.df-line{width:35px;height:1.5px;margin:.14rem auto .18rem;background:linear-gradient(90deg,transparent,#7888b8,#98a8d8,transparent)}
.df-sub{margin:0;font-size:clamp(.44rem,.62vw,.54rem);color:rgba(110,140,190,.15)}
.df-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;display:flex;flex-direction:column;gap:.06rem}
.df-info__dir{font-size:.5rem;font-weight:600;letter-spacing:.12em;color:rgba(180,190,230,.25)}
.df-info span:last-child{font-size:.48rem;color:rgba(150,170,200,.18);font-family:'Georgia',serif}
.df-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.df-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#ff8888,#8888ff,#88ff88,#ffcc66,#ff8888);background-size:400% 100%}
</style>
