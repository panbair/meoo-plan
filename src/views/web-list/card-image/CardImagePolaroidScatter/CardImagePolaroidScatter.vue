<template>
  <section ref="rootRef" class="ps-root">
    <!-- 桌面纹理 -->
    <div class="ps-surface"></div>

    <!-- 3D场景 -->
    <div class="ps-scene" ref="sceneRef">
      <div class="ps-table" ref="tableRef">
        <!-- 散落的拍立得 -->
        <div
          v-for="(frame, idx) in frames"
          :key="frame.id"
          class="ps-card"
          :ref="(el) => setCardRef(el, idx)"
        >
          <!-- 拍立得相纸 -->
          <div class="ps-card__paper">
            <img
              :ref="(el) => setImgRef(el, idx)"
              :src="frame.image"
              :alt="frame.alt"
              class="ps-card__img"
              loading="eager"
            />
            <!-- 底部手写区域 -->
            <div class="ps-card__caption">{{ frame.title }}</div>
          </div>
          <!-- 桌面阴影 -->
          <div class="ps-card__shadow"></div>
        </div>
      </div>
    </div>

    <!-- 柔光 -->
    <div class="ps-vignette"></div>

    <!-- UI -->
    <div ref="scrollRef" class="ps-scroll">
      <div ref="trackRef" class="ps-track" :style="{ height: trackHeight }">
        <div class="ps-sticky">

          <header ref="headerRef" class="ps-header">
            <span class="ps-kicker">📸 Polaroid Scatter · 拍立得散落</span>
            <h1 class="ps-title">
              <span ref="tPola" class="ps-title__w">拍立</span>
              <span ref="tRoid" class="ps-title__w ps-title__w--alt">得</span>
            </h1>
            <div ref="headerLineRef" class="ps-line"></div>
            <p class="ps-sub">向下滚动 · 在散落的拍立得之间穿行 · 每一张都有独特的姿态</p>
          </header>

          <div ref="infoRef" class="ps-info">
            <span class="ps-info__no">{{ String(currentIndex + 1).padStart(2, '0') }}</span>
            <h3>{{ frames[currentIndex]?.title }}</h3>
          </div>

          <div class="ps-progress"><div ref="progressRef" class="ps-progress__fill"></div></div>

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
type TweenCleanup = () => void

interface Frame { id: string; title: string; image: string; alt: string }
const frames: Frame[] = [
  { id:'aurora', title:'极光', image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', alt:'极光' },
  { id:'ocean', title:'海浪', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', alt:'海浪' },
  { id:'mountains', title:'远山', image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', alt:'远山' },
  { id:'flowers', title:'繁花', image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80', alt:'繁花' },
  { id:'desert', title:'沙漠', image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', alt:'沙漠' },
  { id:'forest', title:'森林', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', alt:'森林' },
  { id:'valley', title:'峡谷', image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', alt:'峡谷' },
  { id:'sunrise', title:'日出', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', alt:'日出' },
]

const N = frames.length
const trackHeight = `${(N + 1) * 100}vh`

// ── Refs ──
const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const sceneRef = ref<HTMLElement|null>(null)
const tableRef = ref<HTMLElement|null>(null)
const headerRef = ref<HTMLElement|null>(null); const headerLineRef = ref<HTMLElement|null>(null)
const tPola = ref<HTMLElement|null>(null); const tRoid = ref<HTMLElement|null>(null)
const infoRef = ref<HTMLElement|null>(null); const progressRef = ref<HTMLElement|null>(null)
const cardRefs = ref<HTMLElement[]>([]); const imgRefs = ref<HTMLImageElement[]>([])
const setCardRef = (el:Element|null,i:number)=>{if(el instanceof HTMLElement)cardRefs.value[i]=el}
const setImgRef = (el:Element|null,i:number)=>{if(el instanceof HTMLImageElement)imgRefs.value[i]=el}
const currentIndex = ref(0)
const cleanupFns: TweenCleanup[] = []

// 每张拍立得的散落姿态数据 [x(%), y(%), rotateZ(deg), z(px)]
const scatter: [string,string,number,number,number,number][] = [
  ['-15%','-20%', -12,  0,   -4,  3  ],
  ['28%', '15%',   8,  -280,  5,  -2  ],
  ['-30%','25%',  -18, -550, -3,   5  ],
  ['20%', '-28%',  5,  -820,  6,  -4  ],
  ['-22%','-10%',-10, -1100, -5,   2  ],
  ['32%', '22%',  15, -1380,  4,  -5  ],
  ['-25%','-30%',-7,  -1680, -2,   4  ],
  ['18%', '-15%', 11, -1980,  6,  -3  ],
]

function preload(){return Promise.all(frames.map(f=>new Promise<void>(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src=f.image})))}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!infoRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo(tPola.value!,{autoAlpha:0,x:-30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.35')
    .fromTo(tRoid.value!,{autoAlpha:0,x:30,scale:.5},{autoAlpha:1,x:0,scale:1,duration:.6,ease:'back.out(2)'},'-.4')
    .fromTo(headerLineRef.value!,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value!,{autoAlpha:0},{autoAlpha:1,duration:.65,ease:'power2.out'},'-.25')
    .fromTo(infoRef.value!,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'},'-.15')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupScatter(){
  if(!scrollRef.value||!trackRef.value||!tableRef.value)return
  const sc=scrollRef.value; const track=trackRef.value; const table=tableRef.value
  const cards=cardRefs.value; const imgs=imgRefs.value
  if(!cards.length)return

  // 初始化：每张拍立得以独特姿态散落
  cards.forEach((card,i)=>{
    const [x,y,rz,z,rx,ry] = scatter[i]
    gsap.set(card,{
      x, y, z,
      rotateZ: rz,
      rotateX: rx,
      rotateY: ry,
      opacity: i<=2?1:Math.max(0.1,1-(i-2)*0.2),
      filter: i===0?'brightness(1.05)':'brightness(0.9)',
    })
    gsap.set(imgs[i],{scale:1})
  })

  // 总移动 = 最远Z绝对值 + 额外余量
  const totalZ = Math.abs(scatter[scatter.length-1][3]) + 400

  const mtl=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{
      trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){currentIndex.value=Math.min(N-1,Math.max(0,Math.round(self.progress*(N-1))))},
    },
  })

  // 整张"桌子"向前推进
  mtl.to(table,{z:totalZ,duration:N,ease:'none'},0)

  // 每张拍立得到达前台时：摆正+提亮+放大
  cards.forEach((_card,i)=>{
    const moment=i/N; const dur=1/N

    // rotateZ归零 → 摆正
    mtl.to(cards[i],{rotateZ:scatter[i][2]*0.2,duration:dur*.25,ease:'power2.out'},Math.max(0,moment-dur*.1))
    mtl.to(cards[i],{rotateZ:scatter[i][2],duration:dur*.35,ease:'power2.in'},moment+dur*.45)

    // 提亮
    mtl.to(cards[i],{filter:'brightness(1.12)',duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.08))
    mtl.to(cards[i],{filter:'brightness(0.9)',duration:dur*.3,ease:'power2.in'},moment+dur*.4)

    // 图片微放
    if(imgs[i]){
      mtl.to(imgs[i],{scale:1.08,duration:dur*.2,ease:'power2.out'},Math.max(0,moment-dur*.08))
      mtl.to(imgs[i],{scale:1,duration:dur*.3,ease:'power2.in'},moment+dur*.4)
    }
  })

  if(progressRef.value)mtl.to(progressRef.value,{width:'100%',duration:N},0)
  cleanupFns.push(()=>{mtl.scrollTrigger?.kill();mtl.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(async()=>{
  await preload()
  requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupScatter()}))
  window.addEventListener('resize',handleResize)
})
onUnmounted(()=>{
  window.removeEventListener('resize',handleResize)
  ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0
})
</script>

<style scoped lang="scss">
.ps-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#2c2416 0%,#3d3420 30%,#2a2218 60%,#1e1810 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}

/* ── 桌面 ── */
.ps-surface{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 50% 30% at 50% 55%,rgba(80,60,35,.25),transparent 70%),radial-gradient(ellipse 70% 50% at 50% 50%,rgba(0,0,0,0),rgba(0,0,0,.3) 100%)}

/* ── 3D场景 ── */
.ps-scene{position:absolute;inset:0;z-index:2;perspective:900px;perspective-origin:50% 48%;transform-style:preserve-3d;pointer-events:none}
.ps-table{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}

/* ── 拍立得卡片 ── */
.ps-card{position:absolute;transform-style:preserve-3d;will-change:transform,opacity,filter}
.ps-card__paper{width:clamp(160px,26vw,280px);margin-left:calc(clamp(160px,26vw,280px)/-2);margin-top:calc(clamp(220px,36vw,390px)/-2);background:#f8f5f0;border-radius:3px;box-shadow:0 8px 30px rgba(0,0,0,.4),0 0 0 8px #faf8f5,0 0 0 10px rgba(0,0,0,.08);overflow:hidden}
.ps-card__img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;padding:10px 10px 0 10px;box-sizing:border-box;will-change:transform}
.ps-card__caption{height:40px;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:500;color:#555;letter-spacing:.04em;font-family:'Georgia','KaiTi',serif}
.ps-card__shadow{position:absolute;top:5px;left:50%;width:70%;height:30px;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(0,0,0,.3),transparent);filter:blur(8px);pointer-events:none}

/* ── 柔光 ── */
.ps-vignette{position:absolute;inset:0;z-index:4;pointer-events:none;background:radial-gradient(ellipse 60% 50% at 50% 48%,transparent 35%,rgba(20,15,8,.5) 100%)}

/* ── 滚动 ── */
.ps-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:1;&::-webkit-scrollbar{width:4px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.08)}}
.ps-track{position:relative;width:100%}.ps-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}

/* ── 标题 ── */
.ps-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(90vw,600px)}
.ps-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(220,200,170,.6);background:rgba(0,0,0,.25);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.06);border-radius:999px;padding:.16rem .75rem;margin-bottom:.32rem}
.ps-title{margin:0;display:flex;justify-content:center;gap:.06em}
.ps-title__w{font-size:clamp(1.7rem,4vw,3rem);font-weight:900;color:#d4c8b0;text-shadow:0 0 10px rgba(180,150,100,.15);will-change:transform,opacity}
.ps-title__w--alt{background:linear-gradient(180deg,#f0e8d8,#c8a870,#a07838);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ps-line{width:50px;height:1.5px;margin:.22rem auto .28rem;border-radius:2px;background:linear-gradient(90deg,transparent,#a08858,#c8a870,transparent);transform-origin:center}
.ps-sub{margin:0;font-size:clamp(.54rem,.78vw,.64rem);color:rgba(180,160,130,.3);line-height:1.4;max-width:300px;margin-inline:auto}

/* ── 信息 ── */
.ps-info{position:absolute;bottom:7vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.1rem}
.ps-info__no{font-size:.65rem;font-weight:300;letter-spacing:.12em;color:rgba(200,180,150,.3);font-family:'Georgia',serif}
.ps-info h3{margin:0;font-size:clamp(.75rem,1.4vw,1rem);font-weight:600;color:rgba(200,180,150,.55);letter-spacing:.06em}

/* ── 进度 ── */
.ps-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:1.5px;background:rgba(255,255,255,.02)}
.ps-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#886838,#b89858,#886838);background-size:200% 100%}

@media(max-width:768px){.ps-card__paper{width:140px;margin-left:-70px;margin-top:-105px}.ps-title__w{font-size:1.3rem}}
</style>
