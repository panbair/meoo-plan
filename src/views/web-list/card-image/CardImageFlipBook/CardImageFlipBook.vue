<template>
  <section ref="rootRef" class="fb-root">
    <!-- 书本场景 -->
    <div class="fb-scene" ref="sceneRef">
      <div class="fb-book" ref="bookRef">
        <!-- 书脊 -->
        <div class="fb-spine"></div>

        <!-- 页面 -->
        <div v-for="(frame, idx) in frames" :key="frame.id"
          class="fb-page"
          :ref="(el)=>setPageRef(el,idx)"
          :style="{zIndex: N-idx}"
        >
          <!-- 正面（当前照片） -->
          <div class="fb-page__front">
            <img :ref="(el)=>setImgRef(el,idx)" :src="frame.image" :alt="frame.alt"
              class="fb-page__img" loading="eager" />
            <div class="fb-page__label">{{ frame.title }}</div>
          </div>
          <!-- 背面 -->
          <div class="fb-page__back">
            <div class="fb-page__back-texture"></div>
          </div>
          <!-- 翻页阴影 -->
          <div class="fb-page__fold-shadow"></div>
        </div>

        <!-- 书本阴影 -->
        <div class="fb-book-shadow"></div>
      </div>
    </div>

    <div class="fb-vignette"></div>

    <div ref="scrollRef" class="fb-scroll">
      <div ref="trackRef" class="fb-track" :style="{height:trackHeight}">
        <div class="fb-sticky">

          <header ref="headerRef" class="fb-header">
            <span class="fb-kicker">📖 Flip Book · 翻页相册</span>
            <h1 class="fb-title">
              <span ref="tFlip" class="fb-title__w">翻页</span>
              <span ref="tBook" class="fb-title__w fb-title__w--alt">相册</span>
            </h1>
            <div ref="headerLineRef" class="fb-line"></div>
            <p class="fb-sub">向下滚动 · 如同翻阅一本精装相册 · 每页翻转露出新的回忆</p>
          </header>

          <div ref="infoRef" class="fb-info">
            <span class="fb-info__no">P.{{ String(currentIndex+1).padStart(2,'0') }}</span>
            <h3>{{ frames[currentIndex]?.title }}</h3>
          </div>

          <div class="fb-progress"><div ref="progressRef" class="fb-progress__fill"></div></div>
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

interface Frame{id:string;title:string;image:string;alt:string}
const frames:Frame[]=[
  {id:'aurora',title:'极光之页',image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',alt:'极光'},
  {id:'ocean',title:'海浪之页',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',alt:'海浪'},
  {id:'mountains',title:'远山之页',image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',alt:'远山'},
  {id:'flowers',title:'繁花之页',image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',alt:'繁花'},
  {id:'desert',title:'沙漠之页',image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',alt:'沙漠'},
  {id:'forest',title:'森林之页',image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',alt:'森林'},
  {id:'valley',title:'峡谷之页',image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',alt:'峡谷'},
  {id:'sunrise',title:'日出之页',image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',alt:'日出'},
]
const N=frames.length
const PAGES_PER_SCROLL=2 // 每2个屏幕高度翻一页 → 更慢更真实
const trackHeight=`${(N*PAGES_PER_SCROLL+1)*100}vh`

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null)
const trackRef=ref<HTMLElement|null>(null);const sceneRef=ref<HTMLElement|null>(null)
const bookRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const headerLineRef=ref<HTMLElement|null>(null)
const tFlip=ref<HTMLElement|null>(null);const tBook=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progressRef=ref<HTMLElement|null>(null)
const pageRefs=ref<HTMLElement[]>([]);const imgRefs=ref<HTMLImageElement[]>([])
const setPageRef=(el:Element|null,i:number)=>{if(el instanceof HTMLElement)pageRefs.value[i]=el}
const setImgRef=(el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex=ref(0)
const cleanupFns:TweenCleanup[]=[]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tFlip.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tBook.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(headerLineRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupFlipBook(){
  if(!scrollRef.value||!trackRef.value||!bookRef.value)return
  const sc=scrollRef.value;const track=trackRef.value
  const pages=pageRefs.value;const imgs=imgRefs.value
  if(!pages.length)return

  // 初始化：第0页打开，其余已翻过
  pages.forEach((page,i)=>{
    gsap.set(page,{
      rotateY:i===0?0:-170,
      z:i===0?0:-2,
      transformOrigin:'left center',
      backfaceVisibility:'hidden',
      WebkitBackfaceVisibility:'hidden',
    })
    gsap.set(imgs[i],{scale:1})
  })

  const mtl=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.3,onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))}},
  })

  // 📖 每页的三段式真实翻页
  pages.forEach((page,i)=>{
    const start=i/N;const dur=1/N

    if(i<N-1){
      // 阶段1: 起页 — 缓慢掀起(0°→-25°)，页面微抬
      mtl.to(page,{rotateY:-25,z:12,duration:dur*.25,ease:'power2.out'},start+dur*.4)
      // 阶段2: 甩页 — 加速翻过(-25°→-155°)
      mtl.to(page,{rotateY:-155,z:8,duration:dur*.25,ease:'power3.inOut'},start+dur*.55)
      // 阶段3: 落页 — 减速归位(-155°→-170°)
      mtl.to(page,{rotateY:-170,z:-2,duration:dur*.2,ease:'power2.in'},start+dur*.72)
      if(imgs[i])mtl.to(imgs[i],{scale:.82,duration:dur*.15,ease:'power2.in'},start+dur*.55)
    }

    if(i>0){
      // 前一页翻过去后，这一页从-170°翻开到0°
      const prevStart=(i-1)/N;const prevDur=1/N
      mtl.to(page,{rotateY:0,z:0,duration:prevDur*.25,ease:'power2.out'},prevStart+prevDur*.75)
      if(imgs[i])mtl.to(imgs[i],{scale:1,duration:prevDur*.2,ease:'power2.out'},prevStart+prevDur*.76)
    }
  })

  // 书本呼吸式微动
  if(bookRef.value){
    mtl.to(bookRef.value,{rotateY:4,duration:N*.25,ease:'sine.inOut'},0)
    mtl.to(bookRef.value,{rotateY:-2,duration:N*.25,ease:'sine.inOut'},N*.3)
    mtl.to(bookRef.value,{rotateY:0,duration:N*.5,ease:'sine.inOut'},N*.55)
  }

  if(progressRef.value)mtl.to(progressRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{await preload();requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupFlipBook()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.fb-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#1a1512 0%,#2a2218 30%,#1e1814 60%,#14100e 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}

/* ── 3D场景 ── */
.fb-scene{position:absolute;inset:0;z-index:2;perspective:1200px;perspective-origin:50% 50%;pointer-events:none}
.fb-book{position:absolute;top:12vh;left:50%;width:clamp(320px,50vw,560px);height:clamp(400px,64vw,720px);margin-left:calc(clamp(320px,50vw,560px)/-2);transform-style:preserve-3d;will-change:transform}

/* ── 书脊 ── */
.fb-spine{position:absolute;left:-4px;top:0;width:8px;height:100%;background:linear-gradient(90deg,rgba(0,0,0,.4),rgba(0,0,0,.1),rgba(0,0,0,.3));border-radius:3px 0 0 3px;z-index:20}

/* ── 页面 ── */
.fb-page{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform}
.fb-page__front{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:0 6px 6px 0;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.3),2px 0 8px rgba(0,0,0,.15);background:#faf8f5}
.fb-page__img{width:100%;height:100%;object-fit:cover;display:block;will-change:transform}
.fb-page__label{position:absolute;bottom:18px;left:0;right:0;text-align:center;font-size:.65rem;font-weight:500;color:#666;letter-spacing:.06em;font-family:'Georgia',serif}
.fb-page__back{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:6px 0 0 6px;overflow:hidden;transform:rotateY(180deg);background:#e8e4e0}
.fb-page__back-texture{width:100%;height:100%;background:linear-gradient(135deg,rgba(0,0,0,.02),transparent 50%,rgba(0,0,0,.04) 100%)}
.fb-page__fold-shadow{position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.25) 0%,rgba(0,0,0,.08) 8%,transparent 20%,transparent 80%,rgba(0,0,0,.03) 95%,rgba(0,0,0,.12) 100%);z-index:5;border-radius:0 6px 6px 0;will-change:opacity}

/* ── 书本阴影 ── */
.fb-book-shadow{position:absolute;left:50%;top:5px;width:60%;height:30px;transform:translateX(-30%);background:radial-gradient(ellipse,rgba(0,0,0,.35),transparent);filter:blur(12px);pointer-events:none;z-index:-1}

/* ── 暗角 ── */
.fb-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(ellipse 55% 45% at 50% 48%,transparent 35%,rgba(10,8,6,.5) 100%)}

/* ── 滚动 ── */
.fb-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.06)}}
.fb-track{position:relative;width:100%}.fb-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}

/* ── 标题 ── */
.fb-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(90vw,560px)}
.fb-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(200,180,150,.5);background:rgba(0,0,0,.25);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.06);border-radius:999px;padding:.14rem .7rem;margin-bottom:.3rem}
.fb-title{margin:0;display:flex;justify-content:center;gap:.06em}
.fb-title__w{font-size:clamp(1.7rem,4vw,3rem);font-weight:900;color:#d8c8b0;text-shadow:0 0 10px rgba(180,140,100,.1);will-change:transform,opacity}
.fb-title__w--alt{background:linear-gradient(180deg,#f0e8d8,#c8a870,#987030);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.fb-line{width:50px;height:1.5px;margin:.2rem auto .25rem;border-radius:2px;background:linear-gradient(90deg,transparent,#987030,#c8a870,transparent);transform-origin:center}
.fb-sub{margin:0;font-size:clamp(.52rem,.76vw,.62rem);color:rgba(180,150,120,.25);line-height:1.4}
.fb-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center}
.fb-info__no{font-size:.6rem;font-weight:300;letter-spacing:.1em;color:rgba(200,170,130,.28);font-family:'Georgia',serif}
.fb-info h3{margin:.15rem 0 0;font-size:.75rem;font-weight:500;color:rgba(200,170,130,.45)}
.fb-progress{position:absolute;left:0;bottom:0;z-index:20;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.fb-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#886030,#b89850,#886030);background-size:200% 100%}
@media(max-width:768px){.fb-book{width:280px;height:370px;margin-left:-140px}.fb-title__w{font-size:1.3rem}}
</style>
