<template>
  <section ref="rootRef" class="fs-root">
    <div ref="particlesRef" class="fs-particles"><span v-for="p in plist" :key="p.id" class="fs-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="fs-stage">

      <div class="fs-back"><img :src="imgs.i1" class="fs-back__img" /></div>

      <!-- ══════ 第1层：全图→分裂→半边化柱 ══════ -->
      <div ref="layer1Ref" class="fs-layer" style="z-index:5">
        <div ref="l1L" class="fs-half fs-half--left"><img :src="imgs.i2" class="fs-half__img fs-half__img--left" /></div>
        <div ref="l1R" class="fs-half fs-half--right"><img :src="imgs.i2" class="fs-half__img fs-half__img--right" /></div>
        <div ref="l1crackRef" class="fs-crack"></div>
        <!-- 半边化成的柱 -->
        <div ref="l1colL" class="fs-flow-col fs-flow-col--left">
          <div ref="l1cL1" class="fs-flow-card"><img :src="imgs.s1" class="fs-flow-card__img" /><span>晨 曦</span></div>
          <div ref="l1cL2" class="fs-flow-card"><img :src="imgs.s2" class="fs-flow-card__img" /><span>山 峦</span></div>
          <div ref="l1cL3" class="fs-flow-card"><img :src="imgs.s3" class="fs-flow-card__img" /><span>湖 泊</span></div>
        </div>
        <div ref="l1colR" class="fs-flow-col fs-flow-col--right">
          <div ref="l1cR1" class="fs-flow-card"><img :src="imgs.s4" class="fs-flow-card__img" /><span>海 洋</span></div>
          <div ref="l1cR2" class="fs-flow-card"><img :src="imgs.s5" class="fs-flow-card__img" /><span>森 林</span></div>
          <div ref="l1cR3" class="fs-flow-card"><img :src="imgs.s6" class="fs-flow-card__img" /><span>花 卉</span></div>
        </div>
      </div>

      <!-- 第1层内容 -->
      <div ref="c1Ref" class="fs-content" style="z-index:4"><div ref="c1InnerRef" class="fs-content__inner">
        <h2 ref="c1tRef" class="fs-content__title">裂变 · 第一重</h2>
        <p ref="c1dRef" class="fs-content__desc">全图分裂 · 半边化柱 · 流裂双生</p>
        <div ref="c1gRef" class="fs-content__grid">
          <div v-for="t in thumbs1" :key="t.l" class="fs-card"><img :src="t.u" class="fs-card__img" /><span class="fs-card__label">{{t.l}}</span></div>
        </div>
      </div></div>

      <!-- ══════ 第2层 ══════ -->
      <div ref="layer2Ref" class="fs-layer" style="z-index:7">
        <div ref="l2L" class="fs-half fs-half--left"><img :src="imgs.i3" class="fs-half__img fs-half__img--left" /></div>
        <div ref="l2R" class="fs-half fs-half--right"><img :src="imgs.i3" class="fs-half__img fs-half__img--right" /></div>
        <div ref="l2crackRef" class="fs-crack"></div>
        <div ref="l2colL" class="fs-flow-col fs-flow-col--left">
          <div ref="l2cL1" class="fs-flow-card"><img :src="imgs.s7" class="fs-flow-card__img" /><span>秋 色</span></div>
          <div ref="l2cL2" class="fs-flow-card"><img :src="imgs.s8" class="fs-flow-card__img" /><span>田 野</span></div>
          <div ref="l2cL3" class="fs-flow-card"><img :src="imgs.s9" class="fs-flow-card__img" /><span>山 色</span></div>
        </div>
        <div ref="l2colR" class="fs-flow-col fs-flow-col--right">
          <div ref="l2cR1" class="fs-flow-card"><img :src="imgs.s10" class="fs-flow-card__img" /><span>瀑 布</span></div>
          <div ref="l2cR2" class="fs-flow-card"><img :src="imgs.s11" class="fs-flow-card__img" /><span>旷 野</span></div>
          <div ref="l2cR3" class="fs-flow-card"><img :src="imgs.s12" class="fs-flow-card__img" /><span>秘 境</span></div>
        </div>
      </div>

      <div ref="c2Ref" class="fs-content" style="z-index:6"><div ref="c2InnerRef" class="fs-content__inner">
        <h2 ref="c2tRef" class="fs-content__title">裂变 · 第二重</h2>
        <p ref="c2dRef" class="fs-content__desc">再度裂变 · 柱涌新图 · 万象更新</p>
        <div ref="c2gRef" class="fs-content__grid">
          <div v-for="t in thumbs2" :key="t.l" class="fs-card"><img :src="t.u" class="fs-card__img" /><span class="fs-card__label">{{t.l}}</span></div>
        </div>
      </div></div>

      <!-- ══════ 第3层 ══════ -->
      <div ref="layer3Ref" class="fs-layer" style="z-index:9">
        <div ref="l3L" class="fs-half fs-half--left"><img :src="imgs.i4" class="fs-half__img fs-half__img--left" /></div>
        <div ref="l3R" class="fs-half fs-half--right"><img :src="imgs.i4" class="fs-half__img fs-half__img--right" /></div>
        <div ref="l3crackRef" class="fs-crack"></div>
        <div ref="l3colL" class="fs-flow-col fs-flow-col--left">
          <div ref="l3cL1" class="fs-flow-card"><img :src="imgs.s13" class="fs-flow-card__img" /><span>湖 光</span></div>
          <div ref="l3cL2" class="fs-flow-card"><img :src="imgs.s14" class="fs-flow-card__img" /><span>草 原</span></div>
          <div ref="l3cL3" class="fs-flow-card"><img :src="imgs.s15" class="fs-flow-card__img" /><span>自 然</span></div>
        </div>
        <div ref="l3colR" class="fs-flow-col fs-flow-col--right">
          <div ref="l3cR1" class="fs-flow-card"><img :src="imgs.s16" class="fs-flow-card__img" /><span>海 岸</span></div>
          <div ref="l3cR2" class="fs-flow-card"><img :src="imgs.s17" class="fs-flow-card__img" /><span>远 山</span></div>
          <div ref="l3cR3" class="fs-flow-card"><img :src="imgs.s18" class="fs-flow-card__img" /><span>飞 鸟</span></div>
        </div>
      </div>

      <div ref="c3Ref" class="fs-content" style="z-index:8"><div ref="c3InnerRef" class="fs-content__inner">
        <h2 ref="c3tRef" class="fs-content__title">裂变 · 终章</h2>
        <p ref="c3dRef" class="fs-content__desc">三重裂变 · 柱流不熄 · 盛世绽放</p>
        <div ref="c3gRef" class="fs-content__grid">
          <div v-for="t in thumbs3" :key="t.l" class="fs-card"><img :src="t.u" class="fs-card__img" /><span class="fs-card__label">{{t.l}}</span></div>
        </div>
      </div></div>

      <header ref="hRef" class="fs-header">
        <span ref="kRef" class="fs-kicker">◇ 向下滚动 · 流裂双生 ◇</span>
        <h1 class="fs-title"><span ref="t1Ref" class="fs-t__w fs-t__w--1">流</span><span ref="t2Ref" class="fs-t__w fs-t__w--2">裂</span><span ref="t3Ref" class="fs-t__w fs-t__w--3">双</span><span ref="t4Ref" class="fs-t__w fs-t__w--1">生</span></h1>
        <div ref="dRef" class="fs-divider"></div><p ref="sRef" class="fs-sub">全图分裂 · 半边化柱 · 柱涌如流 · 生生不息</p>
      </header>
      <div ref="dotsRef" class="fs-dots"><span ref="dot1Ref" class="fs-dots__d fs-dots__d--on"></span><span ref="dot2Ref" class="fs-dots__d"></span><span ref="dot3Ref" class="fs-dots__d"></span><span ref="dot4Ref" class="fs-dots__d"></span></div>
      <div class="fs-progress"><div ref="pfRef" class="fs-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TC=()=>void

const imgs={
  i1:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',i2:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  i3:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',i4:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  s1:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',s2:'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80',
  s3:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80',s4:'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=300&q=80',
  s5:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&q=80',s6:'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&q=80',
  s7:'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80',s8:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
  s9:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80',s10:'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80',
  s11:'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&q=80',s12:'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=300&q=80',
  s13:'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80',s14:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80',
  s15:'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=300&q=80',s16:'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80',
  s17:'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=300&q=80',s18:'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=300&q=80',
}
const u='https://images.unsplash.com/photo'
const thumbs1=[{u:`${u}-1441974231531-c6227db76b6e?w=300&q=80`,l:'森林'},{u:`${u}-1465146344425-f00d5f5c8f07?w=300&q=80`,l:'花卉'},{u:`${u}-1490750967868-88aa4486c946?w=300&q=80`,l:'草原'},{u:`${u}-1505144808419-1957a94ca61e?w=300&q=80`,l:'湖光'}]
const thumbs2=[{u:`${u}-1501785888041-af3ef285b470?w=300&q=80`,l:'山色'},{u:`${u}-1518837695005-2083093ee35b?w=300&q=80`,l:'海浪'},{u:`${u}-1472214103451-9374bd1c798e?w=300&q=80`,l:'秋色'},{u:`${u}-1500382017468-9049fed747ef?w=300&q=80`,l:'田野'}]
const thumbs3=[{u:`${u}-1469474968028-56623f02e42e?w=300&q=80`,l:'瀑布'},{u:`${u}-1426604966848-d7adac402bff?w=300&q=80`,l:'旷野'},{u:`${u}-1447752875215-b2761acb3c5d?w=300&q=80`,l:'秘境'},{u:`${u}-1446329813274-7c9036bd9a1f?w=300&q=80`,l:'自然'}]

interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:25},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.08+pr(i*2+5)*.28}`}})))

const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null)
// Layer 1
const layer1Ref=ref<HTMLElement|null>(null),l1L=ref<HTMLElement|null>(null),l1R=ref<HTMLElement|null>(null),l1crackRef=ref<HTMLElement|null>(null)
const l1colL=ref<HTMLElement|null>(null),l1colR=ref<HTMLElement|null>(null)
const l1cL1=ref<HTMLElement|null>(null),l1cL2=ref<HTMLElement|null>(null),l1cL3=ref<HTMLElement|null>(null)
const l1cR1=ref<HTMLElement|null>(null),l1cR2=ref<HTMLElement|null>(null),l1cR3=ref<HTMLElement|null>(null)
// Layer 2
const layer2Ref=ref<HTMLElement|null>(null),l2L=ref<HTMLElement|null>(null),l2R=ref<HTMLElement|null>(null),l2crackRef=ref<HTMLElement|null>(null)
const l2colL=ref<HTMLElement|null>(null),l2colR=ref<HTMLElement|null>(null)
const l2cL1=ref<HTMLElement|null>(null),l2cL2=ref<HTMLElement|null>(null),l2cL3=ref<HTMLElement|null>(null)
const l2cR1=ref<HTMLElement|null>(null),l2cR2=ref<HTMLElement|null>(null),l2cR3=ref<HTMLElement|null>(null)
// Layer 3
const layer3Ref=ref<HTMLElement|null>(null),l3L=ref<HTMLElement|null>(null),l3R=ref<HTMLElement|null>(null),l3crackRef=ref<HTMLElement|null>(null)
const l3colL=ref<HTMLElement|null>(null),l3colR=ref<HTMLElement|null>(null)
const l3cL1=ref<HTMLElement|null>(null),l3cL2=ref<HTMLElement|null>(null),l3cL3=ref<HTMLElement|null>(null)
const l3cR1=ref<HTMLElement|null>(null),l3cR2=ref<HTMLElement|null>(null),l3cR3=ref<HTMLElement|null>(null)
// Content
const c1Ref=ref<HTMLElement|null>(null),c1InnerRef=ref<HTMLElement|null>(null),c1tRef=ref<HTMLElement|null>(null),c1dRef=ref<HTMLElement|null>(null),c1gRef=ref<HTMLElement|null>(null)
const c2Ref=ref<HTMLElement|null>(null),c2InnerRef=ref<HTMLElement|null>(null),c2tRef=ref<HTMLElement|null>(null),c2dRef=ref<HTMLElement|null>(null),c2gRef=ref<HTMLElement|null>(null)
const c3Ref=ref<HTMLElement|null>(null),c3InnerRef=ref<HTMLElement|null>(null),c3tRef=ref<HTMLElement|null>(null),c3dRef=ref<HTMLElement|null>(null),c3gRef=ref<HTMLElement|null>(null)
// Header
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

// 核心：分裂 → 半边化柱 → 柱上流
function splitToColumns(
  tl:gsap.core.Timeline, cL:HTMLElement, cR:HTMLElement, crack:HTMLElement,
  colL:HTMLElement, colR:HTMLElement, cards:HTMLElement[], startT:number
){
  // 初始：全图闭合，柱隐藏在下
  gsap.set(cL,{x:0,autoAlpha:1});gsap.set(cR,{x:0,autoAlpha:1})
  gsap.set(crack,{autoAlpha:0,scaleY:.1})
  gsap.set(colL,{y:'40vh',autoAlpha:0});gsap.set(colR,{y:'40vh',autoAlpha:0})
  cards.forEach(c=>gsap.set(c,{autoAlpha:0,y:20,scale:.7}))

  // 裂缝出现
  tl.to(crack,{autoAlpha:.5,scaleY:.5,duration:.03,ease:'power2.out'},startT)
  tl.to(crack,{autoAlpha:1,scaleY:1,duration:.03,ease:'power2.out'},startT+.02)

  // 分裂 300px（SplitReveal一阶段）
  tl.to(cL,{x:-300,duration:.08,ease:'power3.out'},startT+.04)
  tl.to(cR,{x:300,duration:.08,ease:'power3.out'},startT+.04)

  // 半边化柱：柱从下方浮现（SideFlow）
  tl.to(colL,{y:0,autoAlpha:1,duration:.08,ease:'power3.out'},startT+.08)
  tl.to(colR,{y:0,autoAlpha:1,duration:.08,ease:'power3.out'},startT+.08)
  cards.forEach((c,i)=>tl.to(c,{autoAlpha:1,y:0,scale:1,duration:.05,stagger:.02,ease:'back.out(1.5)'},startT+.10+i*.015))

  // 半边继续拉到边缘并淡出
  tl.to(cL,{x:'-52vw',duration:.10,ease:'power3.in'},startT+.16)
  tl.to(cR,{x:'52vw',duration:.10,ease:'power3.in'},startT+.16)
  tl.to([cL,cR],{autoAlpha:0,duration:.04,ease:'power2.in'},startT+.26)

  // 柱开始上流
  tl.to(colL,{y:'-20vh',duration:.08,ease:'power2.in'},startT+.28)
  tl.to(colR,{y:'-20vh',duration:.08,ease:'power2.in'},startT+.28)

  // 裂缝消隐
  tl.to(crack,{autoAlpha:0,duration:.05,ease:'power2.in'},startT+.24)
}

function showC(tl:gsap.core.Timeline,cref:HTMLElement,cinner:HTMLElement,ct:HTMLElement,cd:HTMLElement,cg:HTMLElement,startT:number){
  tl.to(cref,{autoAlpha:1,duration:.03},startT)
  tl.to(cinner,{y:0,duration:.08,ease:'power3.out'},startT)
  tl.to(ct,{autoAlpha:1,y:0,duration:.04,ease:'power2.out'},startT+.02)
  tl.to(cd,{autoAlpha:1,y:0,duration:.04,ease:'power2.out'},startT+.04)
  tl.to(cg,{autoAlpha:1,y:0,duration:.06,ease:'power2.out'},startT+.06)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!layer1Ref.value)return
  gsap.set(st,{opacity:0})

  // 所有半图初始闭合
  ;[l1L.value,l1R.value,l2L.value,l2R.value,l3L.value,l3R.value].forEach(d=>gsap.set(d,{x:0,autoAlpha:1}))
  ;[l1crackRef.value,l2crackRef.value,l3crackRef.value].forEach(c=>gsap.set(c,{autoAlpha:0}))

  const layers=[
    {colL:l1colL,colR:l1colR,cards:[l1cL1,l1cL2,l1cL3,l1cR1,l1cR2,l1cR3]},
    {colL:l2colL,colR:l2colR,cards:[l2cL1,l2cL2,l2cL3,l2cR1,l2cR2,l2cR3]},
    {colL:l3colL,colR:l3colR,cards:[l3cL1,l3cL2,l3cL3,l3cR1,l3cR2,l3cR3]},
  ]
  layers.forEach(l=>{
    gsap.set(l.colL.value,{y:'40vh',autoAlpha:0});gsap.set(l.colR.value,{y:'40vh',autoAlpha:0})
    l.cards.forEach(c=>gsap.set(c.value,{autoAlpha:0,y:20,scale:.7}))
  })

  const contents=[
    {ref:c1Ref,inner:c1InnerRef,title:c1tRef,desc:c1dRef,grid:c1gRef},
    {ref:c2Ref,inner:c2InnerRef,title:c2tRef,desc:c2dRef,grid:c2gRef},
    {ref:c3Ref,inner:c3InnerRef,title:c3tRef,desc:c3dRef,grid:c3gRef},
  ]
  contents.forEach(c=>{
    gsap.set(c.ref.value,{autoAlpha:0});gsap.set(c.inner.value,{y:'15vh'})
    gsap.set(c.title.value,{autoAlpha:0,y:12});gsap.set(c.desc.value,{autoAlpha:0,y:8})
    gsap.set(c.grid.value,{autoAlpha:0,y:12})
  })

  gsap.set(hRef.value,{autoAlpha:0,y:28});gsap.set(kRef.value,{autoAlpha:0,scale:.7})
  gsap.set([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:0,y:16,scale:.5})
  gsap.set(dRef.value,{scaleX:0,autoAlpha:0});gsap.set(sRef.value,{autoAlpha:0,y:8})
  gsap.set(dotsRef.value,{autoAlpha:0});gsap.set(particlesRef.value,{opacity:.25})

  const tl=gsap.timeline({scrollTrigger:{trigger:p,start:'top 100%',end:'bottom 30%',scrub:1.5,toggleActions:'play reverse play reverse'}})
  tl.to(st,{opacity:1,duration:.04,ease:'power2.out'},.01)
  tl.to(hRef.value,{autoAlpha:1,y:0,duration:.05,ease:'power2.out'},.02)
  tl.to(kRef.value,{autoAlpha:1,scale:1,duration:.04,ease:'power2.out'},.03)
  tl.to([t1Ref.value,t2Ref.value,t3Ref.value,t4Ref.value].filter(Boolean),{autoAlpha:1,y:0,scale:1,duration:.05,stagger:.03,ease:'back.out(1.8)'},.03)
  tl.to(dRef.value,{scaleX:1,autoAlpha:1,duration:.04,ease:'power3.inOut'},.06)
  tl.to(sRef.value,{autoAlpha:1,y:0,duration:.04,ease:'power2.out'},.07)
  tl.to(dotsRef.value,{autoAlpha:1,duration:.04,ease:'power2.out'},.07)
  tl.to(particlesRef.value,{opacity:.6,duration:.06,ease:'power2.in'},.02)

  // Layer 1
  splitToColumns(tl,l1L.value!,l1R.value!,l1crackRef.value!,l1colL.value!,l1colR.value!,
    [l1cL1.value!,l1cL2.value!,l1cL3.value!,l1cR1.value!,l1cR2.value!,l1cR3.value!],.08)
  showC(tl,c1Ref.value!,c1InnerRef.value!,c1tRef.value!,c1dRef.value!,c1gRef.value!,.18)
  tl.to(c1InnerRef.value!,{y:'-10vh',duration:.08,ease:'none'},.26)
  tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.04},.28)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.04},.32)

  // Layer 2
  splitToColumns(tl,l2L.value!,l2R.value!,l2crackRef.value!,l2colL.value!,l2colR.value!,
    [l2cL1.value!,l2cL2.value!,l2cL3.value!,l2cR1.value!,l2cR2.value!,l2cR3.value!],.34)
  showC(tl,c2Ref.value!,c2InnerRef.value!,c2tRef.value!,c2dRef.value!,c2gRef.value!,.44)
  tl.to(c2InnerRef.value!,{y:'-10vh',duration:.08,ease:'none'},.52)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.04},.54)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.04},.58)

  // Layer 3
  splitToColumns(tl,l3L.value!,l3R.value!,l3crackRef.value!,l3colL.value!,l3colR.value!,
    [l3cL1.value!,l3cL2.value!,l3cL3.value!,l3cR1.value!,l3cR2.value!,l3cR3.value!],.60)
  showC(tl,c3Ref.value!,c3InnerRef.value!,c3tRef.value!,c3dRef.value!,c3gRef.value!,.70)
  tl.to(c3InnerRef.value!,{y:'-10vh',duration:.08,ease:'none'},.78)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.04},.80)
  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.04},.84)

  tl.to(dot4Ref.value,{backgroundColor:'rgba(255,255,255,.12)',duration:.04},.88)
  tl.to(hRef.value,{autoAlpha:.15,y:-6,duration:.05,ease:'power2.in'},.90)
  tl.to(dotsRef.value,{autoAlpha:0,duration:.04},.90)
  tl.to(particlesRef.value,{opacity:.12,duration:.06},.92)
  tl.to(st,{opacity:.4,duration:.06},.94)
  tl.to(pfRef.value,{width:'100%',duration:1,ease:'none'},0)
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}
function hr(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>setup());window.addEventListener('resize',hr)})
onUnmounted(()=>{window.removeEventListener('resize',hr);ScrollTrigger.getAll().forEach(s=>s.kill());cleanupFns.forEach(f=>f());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.fs-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.fs-particles{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity}
.fs-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:fs-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity}
@keyframes fs-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.fs-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2;will-change:opacity}
.fs-back{position:absolute;inset:0;z-index:3}.fs-back__img{width:100%;height:100%;object-fit:cover;display:block}

.fs-content{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:opacity}
.fs-content__inner{text-align:center;width:90vw;will-change:transform}
.fs-content__title{margin:0 0 .12rem;font-size:clamp(1.3rem,2.8vw,2rem);font-weight:900;background:linear-gradient(180deg,#ffe0b0,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.4));will-change:transform,opacity}
.fs-content__desc{margin:0 0 .8rem;font-size:clamp(.48rem,.68vw,.6rem);color:rgba(200,170,150,.35);will-change:transform,opacity}
.fs-content__grid{display:flex;justify-content:center;gap:.8vw;will-change:transform,opacity}
.fs-card{width:clamp(80px,15vw,180px);text-align:center}
.fs-card__img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:6px;display:block;box-shadow:0 0 0 1.5px rgba(255,190,140,.16),0 8px 24px rgba(0,0,0,.3)}
.fs-card__label{display:block;margin-top:.2rem;font-size:.48rem;font-weight:700;letter-spacing:.1em;color:rgba(200,160,140,.48)}

.fs-layer{position:absolute;inset:0}
.fs-half{position:absolute;top:0;width:50vw;height:100vh;overflow:hidden;will-change:transform,opacity}
.fs-half--left{left:0}.fs-half--right{right:0}
.fs-half__img{position:absolute;top:0;width:200%;height:100%;object-fit:cover;display:block}
.fs-half__img--left{left:0}.fs-half__img--right{right:0}

.fs-crack{position:absolute;top:0;left:50%;transform:translateX(-50%);width:3px;height:100%;z-index:10;pointer-events:none;background:linear-gradient(180deg,transparent 5%,rgba(255,200,140,.3) 30%,rgba(255,240,210,.9) 50%,rgba(255,200,140,.3) 70%,transparent 95%);box-shadow:0 0 14px rgba(255,170,110,.5),0 0 36px rgba(255,140,80,.2);will-change:transform,opacity}

/* 流动柱 */
.fs-flow-col{position:absolute;top:10vh;display:flex;flex-direction:column;gap:1vh;z-index:1;will-change:transform,opacity}
.fs-flow-col--left{left:3vw}.fs-flow-col--right{right:3vw}
.fs-flow-card{width:15vw;text-align:center;will-change:transform,opacity}
.fs-flow-card__img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:6px;display:block;box-shadow:0 0 0 1.5px rgba(255,190,140,.14),0 8px 24px rgba(0,0,0,.3)}
.fs-flow-card span{display:block;margin-top:.15rem;font-size:.42rem;font-weight:700;letter-spacing:.08em;color:rgba(200,160,140,.4)}

.fs-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px);pointer-events:none;will-change:transform,opacity}
.fs-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem;will-change:transform,opacity}
.fs-title{margin:0;display:flex;justify-content:center;gap:.04em}
.fs-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;will-change:transform,opacity;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}
.fs-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent);transform-origin:center;will-change:transform,opacity}
.fs-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto;will-change:transform,opacity}
.fs-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem;pointer-events:none;will-change:opacity}
.fs-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background-color .3s}.fs-dots__d--on{background:rgba(255,170,110,.9)}
.fs-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.fs-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:fs-ps 4s linear infinite}@keyframes fs-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.fs-header{top:2.5vh}.fs-kicker{font-size:.44rem}.fs-t__w{font-size:1.5rem}.fs-sub{font-size:.48rem}.fs-flow-card{width:18vw}.fs-card{width:65px}}
</style>
