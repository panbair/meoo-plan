<template>
  <section ref="rootRef" class="wr-root">
    <div ref="particlesRef" class="wr-particles"><span v-for="p in plist" :key="p.id" class="wr-particle" :style="p.style"></span></div>
    <div ref="stageRef" class="wr-stage">

      <!-- ══════ 底层 ══════ -->
      <div class="wr-back"><img :src="imgs.i1" class="wr-back__img" /></div>

      <!-- ══════ 第1层内容 ══════ -->
      <div ref="c1Ref" class="wr-content" style="z-index:4">
        <div ref="c1InnerRef" class="wr-content__inner">
          <h2 ref="c1tRef" class="wr-content__title">展翼 · 第一章</h2>
          <p ref="c1dRef" class="wr-content__desc">中心裂变 · 羽翼新生</p>
          <div ref="c1gRef" class="wr-content__grid">
            <div v-for="t in thumbs1" :key="t.l" class="wr-card"><img :src="t.u" class="wr-card__img" /><span class="wr-card__label">{{ t.l }}</span></div>
          </div>
        </div>
      </div>

      <!-- ══════ 第1层：中心图 + 双侧翼 ══════ -->
      <div ref="layer1Ref" class="wr-layer" style="z-index:5">
        <!-- 左翼 -->
        <div ref="l1wL" class="wr-wing wr-wing--left">
          <div ref="l1sL1" class="wr-wing__slot"><img :src="imgs.s1" class="wr-wing__img" /></div>
          <div ref="l1sL2" class="wr-wing__slot"><img :src="imgs.s2" class="wr-wing__img" /></div>
        </div>
        <!-- 右翼 -->
        <div ref="l1wR" class="wr-wing wr-wing--right">
          <div ref="l1sR1" class="wr-wing__slot"><img :src="imgs.s3" class="wr-wing__img" /></div>
          <div ref="l1sR2" class="wr-wing__slot"><img :src="imgs.s4" class="wr-wing__img" /></div>
        </div>
        <!-- 中心 -->
        <div ref="l1CenterRef" class="wr-center">
          <div ref="l1cL" class="wr-center__half wr-center__half--left"><img :src="imgs.i2" class="wr-center__img wr-center__img--left" /></div>
          <div ref="l1cR" class="wr-center__half wr-center__half--right"><img :src="imgs.i2" class="wr-center__img wr-center__img--right" /></div>
          <div ref="l1crackRef" class="wr-crack"></div>
        </div>
      </div>

      <!-- ══════ 第2层内容 ══════ -->
      <div ref="c2Ref" class="wr-content" style="z-index:7">
        <div ref="c2InnerRef" class="wr-content__inner">
          <h2 ref="c2tRef" class="wr-content__title">展翼 · 第二章</h2>
          <p ref="c2dRef" class="wr-content__desc">再度裂变 · 万象更新</p>
          <div ref="c2gRef" class="wr-content__grid">
            <div v-for="t in thumbs2" :key="t.l" class="wr-card"><img :src="t.u" class="wr-card__img" /><span class="wr-card__label">{{ t.l }}</span></div>
          </div>
        </div>
      </div>

      <!-- ══════ 第2层 ══════ -->
      <div ref="layer2Ref" class="wr-layer" style="z-index:8">
        <div ref="l2wL" class="wr-wing wr-wing--left">
          <div ref="l2sL1" class="wr-wing__slot"><img :src="imgs.s5" class="wr-wing__img" /></div>
          <div ref="l2sL2" class="wr-wing__slot"><img :src="imgs.s6" class="wr-wing__img" /></div>
        </div>
        <div ref="l2wR" class="wr-wing wr-wing--right">
          <div ref="l2sR1" class="wr-wing__slot"><img :src="imgs.s7" class="wr-wing__img" /></div>
          <div ref="l2sR2" class="wr-wing__slot"><img :src="imgs.s8" class="wr-wing__img" /></div>
        </div>
        <div ref="l2CenterRef" class="wr-center">
          <div ref="l2cL" class="wr-center__half wr-center__half--left"><img :src="imgs.i3" class="wr-center__img wr-center__img--left" /></div>
          <div ref="l2cR" class="wr-center__half wr-center__half--right"><img :src="imgs.i3" class="wr-center__img wr-center__img--right" /></div>
          <div ref="l2crackRef" class="wr-crack"></div>
        </div>
      </div>

      <!-- ══════ 第3层内容 ══════ -->
      <div ref="c3Ref" class="wr-content" style="z-index:10">
        <div ref="c3InnerRef" class="wr-content__inner">
          <h2 ref="c3tRef" class="wr-content__title">展翼 · 终章</h2>
          <p ref="c3dRef" class="wr-content__desc">羽翼丰满 · 盛世绽放</p>
          <div ref="c3gRef" class="wr-content__grid">
            <div v-for="t in thumbs3" :key="t.l" class="wr-card"><img :src="t.u" class="wr-card__img" /><span class="wr-card__label">{{ t.l }}</span></div>
          </div>
        </div>
      </div>

      <!-- ══════ 第3层 ══════ -->
      <div ref="layer3Ref" class="wr-layer" style="z-index:11">
        <div ref="l3wL" class="wr-wing wr-wing--left">
          <div ref="l3sL1" class="wr-wing__slot"><img :src="imgs.s9" class="wr-wing__img" /></div>
          <div ref="l3sL2" class="wr-wing__slot"><img :src="imgs.s10" class="wr-wing__img" /></div>
        </div>
        <div ref="l3wR" class="wr-wing wr-wing--right">
          <div ref="l3sR1" class="wr-wing__slot"><img :src="imgs.s11" class="wr-wing__img" /></div>
          <div ref="l3sR2" class="wr-wing__slot"><img :src="imgs.s12" class="wr-wing__img" /></div>
        </div>
        <div ref="l3CenterRef" class="wr-center">
          <div ref="l3cL" class="wr-center__half wr-center__half--left"><img :src="imgs.i4" class="wr-center__img wr-center__img--left" /></div>
          <div ref="l3cR" class="wr-center__half wr-center__half--right"><img :src="imgs.i4" class="wr-center__img wr-center__img--right" /></div>
          <div ref="l3crackRef" class="wr-crack"></div>
        </div>
      </div>

      <!-- ══════ 标题 ══════ -->
      <header ref="hRef" class="wr-header">
        <span ref="kRef" class="wr-kicker">◇ 向下滚动 · 翼展揭晓 ◇</span>
        <h1 class="wr-title"><span ref="t1Ref" class="wr-t__w wr-t__w--1">翼</span><span ref="t2Ref" class="wr-t__w wr-t__w--2">展</span><span ref="t3Ref" class="wr-t__w wr-t__w--3">揭</span><span ref="t4Ref" class="wr-t__w wr-t__w--1">晓</span></h1>
        <div ref="dRef" class="wr-divider"></div><p ref="sRef" class="wr-sub">中心裂变 · 羽翼两侧 · 层层展翅见新天</p>
      </header>
      <div ref="dotsRef" class="wr-dots"><span ref="dot1Ref" class="wr-dots__d wr-dots__d--on"></span><span ref="dot2Ref" class="wr-dots__d"></span><span ref="dot3Ref" class="wr-dots__d"></span><span ref="dot4Ref" class="wr-dots__d"></span></div>
      <div class="wr-progress"><div ref="pfRef" class="wr-progress__fill"></div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
type TC = () => void

const imgs = {
  i1: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
  i2: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  i3: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80',
  i4: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  s1:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80', s2:'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80',
  s3:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80', s4:'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=300&q=80',
  s5:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&q=80', s6:'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&q=80',
  s7:'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80', s8:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
  s9:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80', s10:'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80',
  s11:'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&q=80', s12:'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=300&q=80',
}
const u = 'https://images.unsplash.com/photo'
const thumbs1=[{u:`${u}-1441974231531-c6227db76b6e?w=300&q=80`,l:'森林'},{u:`${u}-1465146344425-f00d5f5c8f07?w=300&q=80`,l:'花卉'},{u:`${u}-1490750967868-88aa4486c946?w=300&q=80`,l:'草原'},{u:`${u}-1505144808419-1957a94ca61e?w=300&q=80`,l:'湖光'}]
const thumbs2=[{u:`${u}-1501785888041-af3ef285b470?w=300&q=80`,l:'山色'},{u:`${u}-1518837695005-2083093ee35b?w=300&q=80`,l:'海浪'},{u:`${u}-1472214103451-9374bd1c798e?w=300&q=80`,l:'秋色'},{u:`${u}-1500382017468-9049fed747ef?w=300&q=80`,l:'田野'}]
const thumbs3=[{u:`${u}-1469474968028-56623f02e42e?w=300&q=80`,l:'瀑布'},{u:`${u}-1426604966848-d7adac402bff?w=300&q=80`,l:'旷野'},{u:`${u}-1447752875215-b2761acb3c5d?w=300&q=80`,l:'秘境'},{u:`${u}-1446329813274-7c9036bd9a1f?w=300&q=80`,l:'自然'}]

interface P{id:number;style:Record<string,string>}
const pr=(s:number)=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const plist=ref<P[]>(Array.from({length:25},(_,i)=>({id:i,style:{'--px':`${pr(i*3+1)*100}%`,'--py':`${pr(i*3+2)*100}%`,'--ps':`${2+pr(i*3+3)*3}px`,'--pd':`${8+pr(i*5+7)*14}s`,'--pdl':`${pr(i*7+13)*-15}s`,'--po':`${.08+pr(i*2+5)*.28}`}})))

const rootRef=ref<HTMLElement|null>(null),stageRef=ref<HTMLElement|null>(null)
const layer1Ref=ref<HTMLElement|null>(null),l1cL=ref<HTMLElement|null>(null),l1cR=ref<HTMLElement|null>(null),l1crackRef=ref<HTMLElement|null>(null)
const l1wL=ref<HTMLElement|null>(null),l1wR=ref<HTMLElement|null>(null),l1sL1=ref<HTMLElement|null>(null),l1sL2=ref<HTMLElement|null>(null),l1sR1=ref<HTMLElement|null>(null),l1sR2=ref<HTMLElement|null>(null)
const layer2Ref=ref<HTMLElement|null>(null),l2cL=ref<HTMLElement|null>(null),l2cR=ref<HTMLElement|null>(null),l2crackRef=ref<HTMLElement|null>(null)
const l2wL=ref<HTMLElement|null>(null),l2wR=ref<HTMLElement|null>(null),l2sL1=ref<HTMLElement|null>(null),l2sL2=ref<HTMLElement|null>(null),l2sR1=ref<HTMLElement|null>(null),l2sR2=ref<HTMLElement|null>(null)
const layer3Ref=ref<HTMLElement|null>(null),l3cL=ref<HTMLElement|null>(null),l3cR=ref<HTMLElement|null>(null),l3crackRef=ref<HTMLElement|null>(null)
const l3wL=ref<HTMLElement|null>(null),l3wR=ref<HTMLElement|null>(null),l3sL1=ref<HTMLElement|null>(null),l3sL2=ref<HTMLElement|null>(null),l3sR1=ref<HTMLElement|null>(null),l3sR2=ref<HTMLElement|null>(null)
const c1Ref=ref<HTMLElement|null>(null),c1InnerRef=ref<HTMLElement|null>(null),c1tRef=ref<HTMLElement|null>(null),c1dRef=ref<HTMLElement|null>(null),c1gRef=ref<HTMLElement|null>(null)
const c2Ref=ref<HTMLElement|null>(null),c2InnerRef=ref<HTMLElement|null>(null),c2tRef=ref<HTMLElement|null>(null),c2dRef=ref<HTMLElement|null>(null),c2gRef=ref<HTMLElement|null>(null)
const c3Ref=ref<HTMLElement|null>(null),c3InnerRef=ref<HTMLElement|null>(null),c3tRef=ref<HTMLElement|null>(null),c3dRef=ref<HTMLElement|null>(null),c3gRef=ref<HTMLElement|null>(null)
const hRef=ref<HTMLElement|null>(null),kRef=ref<HTMLElement|null>(null),t1Ref=ref<HTMLElement|null>(null),t2Ref=ref<HTMLElement|null>(null),t3Ref=ref<HTMLElement|null>(null),t4Ref=ref<HTMLElement|null>(null)
const dRef=ref<HTMLElement|null>(null),sRef=ref<HTMLElement|null>(null),dotsRef=ref<HTMLElement|null>(null)
const dot1Ref=ref<HTMLElement|null>(null),dot2Ref=ref<HTMLElement|null>(null),dot3Ref=ref<HTMLElement|null>(null),dot4Ref=ref<HTMLElement|null>(null)
const pfRef=ref<HTMLElement|null>(null),particlesRef=ref<HTMLElement|null>(null)
const cleanupFns:TC[]=[]

// 核心：中心分裂 + 两翼上移
function centerSplitWithWings(
  tl:gsap.core.Timeline,
  cL:HTMLElement,cR:HTMLElement,crack:HTMLElement,
  wL:HTMLElement,wR:HTMLElement,
  wSlots:HTMLElement[],
  startT:number
){
  // 初始：中心闭合，翼在两侧
  gsap.set(cL,{x:0,autoAlpha:1});gsap.set(cR,{x:0,autoAlpha:1})
  gsap.set(crack,{autoAlpha:0,scaleY:.1})
  gsap.set(wL,{y:0,autoAlpha:1});gsap.set(wR,{y:0,autoAlpha:1})
  wSlots.forEach(s=>gsap.set(s,{autoAlpha:1,y:0}))

  // 裂缝光出现
  tl.to(crack,{autoAlpha:.6,scaleY:.5,duration:.03,ease:'power2.out'},startT)
  tl.to(crack,{autoAlpha:1,scaleY:1,duration:.03,ease:'power2.out'},startT+.03)

  // 中心分裂 300px
  tl.to(cL,{x:-300,duration:.10,ease:'power3.out'},startT+.04)
  tl.to(cR,{x:300,duration:.10,ease:'power3.out'},startT+.04)

  // 两翼开始上移（SideFlow精华）
  tl.to(wL,{y:'-30vh',duration:.12,ease:'power2.in'},startT+.06)
  tl.to(wR,{y:'-30vh',duration:.12,ease:'power2.in'},startT+.06)
  wSlots.forEach((s,i)=>tl.to(s,{autoAlpha:.3,y:-20,duration:.10,ease:'power2.in'},startT+.08+i*.01))

  // 中心加速拉到边缘
  tl.to(cL,{x:'-52vw',duration:.12,ease:'power3.in'},startT+.16)
  tl.to(cR,{x:'52vw',duration:.12,ease:'power3.in'},startT+.16)

  // 翼继续上移出屏
  tl.to(wL,{y:'-80vh',autoAlpha:0,duration:.10,ease:'power2.in'},startT+.20)
  tl.to(wR,{y:'-80vh',autoAlpha:0,duration:.10,ease:'power2.in'},startT+.20)

  // 中心淡出 + 裂缝消隐
  tl.to(crack,{autoAlpha:0,duration:.06,ease:'power2.in'},startT+.24)
  tl.to([cL,cR],{autoAlpha:0,duration:.05,ease:'power2.in'},startT+.26)
}

function showContent(tl:gsap.core.Timeline,cref:HTMLElement,cinner:HTMLElement,ct:HTMLElement,cd:HTMLElement,cg:HTMLElement,startT:number){
  tl.to(cref,{autoAlpha:1,duration:.03},startT)
  tl.to(cinner,{y:0,duration:.10,ease:'power3.out'},startT)
  tl.to(ct,{autoAlpha:1,y:0,duration:.05,ease:'power2.out'},startT+.02)
  tl.to(cd,{autoAlpha:1,y:0,duration:.05,ease:'power2.out'},startT+.04)
  tl.to(cg,{autoAlpha:1,y:0,duration:.07,ease:'power2.out'},startT+.06)
}

function setup(){
  const p=rootRef.value,st=stageRef.value;if(!p||!st||!layer1Ref.value)return
  gsap.set(st,{opacity:0})

  // 所有层初始可见
  ;[l1cL.value,l1cR.value,l2cL.value,l2cR.value,l3cL.value,l3cR.value].forEach(d=>gsap.set(d,{x:0,autoAlpha:1}))
  ;[l1crackRef.value,l2crackRef.value,l3crackRef.value].forEach(c=>gsap.set(c,{autoAlpha:0}))
  ;[l1wL.value,l1wR.value,l2wL.value,l2wR.value,l3wL.value,l3wR.value].forEach(w=>gsap.set(w,{y:0,autoAlpha:1}))

  const contents=[
    {ref:c1Ref,inner:c1InnerRef,title:c1tRef,desc:c1dRef,grid:c1gRef},
    {ref:c2Ref,inner:c2InnerRef,title:c2tRef,desc:c2dRef,grid:c2gRef},
    {ref:c3Ref,inner:c3InnerRef,title:c3tRef,desc:c3dRef,grid:c3gRef},
  ]
  contents.forEach(c=>{
    gsap.set(c.ref.value,{autoAlpha:0});gsap.set(c.inner.value,{y:'20vh'})
    gsap.set(c.title.value,{autoAlpha:0,y:15});gsap.set(c.desc.value,{autoAlpha:0,y:10})
    gsap.set(c.grid.value,{autoAlpha:0,y:15})
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

  // 第1层
  const w1=[l1sL1.value!,l1sL2.value!,l1sR1.value!,l1sR2.value!]
  centerSplitWithWings(tl,l1cL.value!,l1cR.value!,l1crackRef.value!,l1wL.value!,l1wR.value!,w1,.08)
  showContent(tl,c1Ref.value!,c1InnerRef.value!,c1tRef.value!,c1dRef.value!,c1gRef.value!,.18)
  tl.to(c1InnerRef.value!,{y:'-12vh',duration:.10,ease:'none'},.26)
  tl.to(dot1Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.04},.28)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.04},.32)

  // 第2层
  const w2=[l2sL1.value!,l2sL2.value!,l2sR1.value!,l2sR2.value!]
  centerSplitWithWings(tl,l2cL.value!,l2cR.value!,l2crackRef.value!,l2wL.value!,l2wR.value!,w2,.34)
  showContent(tl,c2Ref.value!,c2InnerRef.value!,c2tRef.value!,c2dRef.value!,c2gRef.value!,.44)
  tl.to(c2InnerRef.value!,{y:'-12vh',duration:.10,ease:'none'},.52)
  tl.to(dot2Ref.value,{backgroundColor:'rgba(255,255,255,.15)',duration:.04},.54)
  tl.to(dot3Ref.value,{backgroundColor:'rgba(255,180,110,.9)',duration:.04},.58)

  // 第3层
  const w3=[l3sL1.value!,l3sL2.value!,l3sR1.value!,l3sR2.value!]
  centerSplitWithWings(tl,l3cL.value!,l3cR.value!,l3crackRef.value!,l3wL.value!,l3wR.value!,w3,.60)
  showContent(tl,c3Ref.value!,c3InnerRef.value!,c3tRef.value!,c3dRef.value!,c3gRef.value!,.70)
  tl.to(c3InnerRef.value!,{y:'-12vh',duration:.10,ease:'none'},.78)
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
.wr-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:#060410;font-family:'PingFang SC','Inter','Microsoft YaHei',system-ui,sans-serif}
.wr-particles{position:absolute;inset:0;z-index:1;pointer-events:none;will-change:opacity}
.wr-particle{--px:50%;--py:50%;--ps:3px;--pd:12s;--pdl:0s;--po:.3;position:absolute;left:var(--px);top:var(--py);width:var(--ps);height:var(--ps);border-radius:50%;background:radial-gradient(circle,rgba(255,200,150,.85) 0%,rgba(150,120,220,.4) 40%,transparent 70%);box-shadow:0 0 calc(var(--ps)*3) rgba(170,140,230,.4),0 0 calc(var(--ps)*6) rgba(255,170,110,.2);opacity:var(--po);animation:wr-f var(--pd) var(--pdl) infinite ease-in-out;will-change:transform,opacity}
@keyframes wr-f{0%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}25%{transform:translateY(-10vh)translateX(2vw)scale(1.5);opacity:calc(var(--po)*1.4)}50%{transform:translateY(-20vh)translateX(-3vw)scale(.7);opacity:calc(var(--po)*.5)}75%{transform:translateY(-7vh)translateX(4vw)scale(1.3);opacity:calc(var(--po)*1.1)}100%{transform:translateY(0)translateX(0)scale(1);opacity:var(--po)}}
.wr-stage{position:relative;width:100%;height:100vh;overflow:hidden;z-index:2;will-change:opacity}
.wr-back{position:absolute;inset:0;z-index:3}.wr-back__img{width:100%;height:100%;object-fit:cover;display:block}

/* 内容 */
.wr-content{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:opacity}
.wr-content__inner{text-align:center;width:90vw;will-change:transform}
.wr-content__title{margin:0 0 .15rem;font-size:clamp(1.4rem,3vw,2.2rem);font-weight:900;background:linear-gradient(180deg,#ffe0b0,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.4));will-change:transform,opacity}
.wr-content__desc{margin:0 0 1rem;font-size:clamp(.5rem,.7vw,.62rem);color:rgba(200,170,150,.38);will-change:transform,opacity}
.wr-content__grid{display:flex;justify-content:center;gap:1vw;will-change:transform,opacity}
.wr-card{width:clamp(90px,16vw,200px);text-align:center}
.wr-card__img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:6px;display:block;box-shadow:0 0 0 1.5px rgba(255,190,140,.18),0 10px 30px rgba(0,0,0,.35)}
.wr-card__label{display:block;margin-top:.25rem;font-size:.5rem;font-weight:700;letter-spacing:.1em;color:rgba(200,160,140,.5)}

/* 图层 */
.wr-layer{position:absolute;inset:0}

/* 中心 */
.wr-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50vw;height:65vh;z-index:2}
.wr-center__half{position:absolute;top:0;width:50%;height:100%;overflow:hidden;will-change:transform,opacity}
.wr-center__half--left{left:0}.wr-center__half--right{right:0}
.wr-center__img{position:absolute;top:0;width:200%;height:100%;object-fit:cover;display:block}
.wr-center__img--left{left:0}.wr-center__img--right{right:0}

/* 两翼 */
.wr-wing{position:absolute;top:12vh;display:flex;flex-direction:column;gap:1vh;z-index:1;will-change:transform,opacity}
.wr-wing--left{left:2vw}.wr-wing--right{right:2vw}
.wr-wing__slot{width:15vw;aspect-ratio:3/4;border-radius:6px;overflow:hidden;box-shadow:0 0 0 1.5px rgba(255,190,140,.12),0 8px 24px rgba(0,0,0,.3);will-change:transform,opacity}
.wr-wing__img{width:100%;height:100%;object-fit:cover;display:block}

/* 裂缝 */
.wr-crack{position:absolute;top:0;left:50%;transform:translateX(-50%);width:3px;height:100%;z-index:10;pointer-events:none;background:linear-gradient(180deg,transparent 5%,rgba(255,200,140,.3) 30%,rgba(255,240,210,.9) 50%,rgba(255,200,140,.3) 70%,transparent 95%);box-shadow:0 0 14px rgba(255,170,110,.5),0 0 36px rgba(255,140,80,.2);will-change:transform,opacity}

/* 标题 */
.wr-header{position:absolute;top:4vh;left:50%;transform:translateX(-50%);z-index:20;text-align:center;width:min(88vw,520px);pointer-events:none;will-change:transform,opacity}
.wr-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.22em;color:rgba(200,165,140,.6);background:rgba(10,5,20,.45);backdrop-filter:blur(8px);border:1px solid rgba(170,130,220,.16);border-radius:999px;padding:.2rem .8rem;margin-bottom:.4rem;will-change:transform,opacity}
.wr-title{margin:0;display:flex;justify-content:center;gap:.04em}
.wr-t__w{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;will-change:transform,opacity;&--1{background:linear-gradient(180deg,#ffa880,#f06848);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--2{background:linear-gradient(180deg,#90b0f0,#5078d8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}&--3{background:linear-gradient(180deg,#ffe0a8,#d09038);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 10px rgba(240,180,100,.5))}}
.wr-divider{width:60px;height:1.5px;margin:.3rem auto .4rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09060,#b080d8,#6098e0,transparent);transform-origin:center;will-change:transform,opacity}
.wr-sub{margin:0;font-size:clamp(.52rem,.78vw,.66rem);color:rgba(185,155,135,.36);max-width:420px;margin-inline:auto;will-change:transform,opacity}
.wr-dots{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:.6rem;pointer-events:none;will-change:opacity}
.wr-dots__d{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background-color .3s}.wr-dots__d--on{background:rgba(255,170,110,.9)}
.wr-progress{position:absolute;left:0;bottom:0;z-index:25;width:100%;height:2px;background:rgba(255,170,110,.02)}.wr-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f06848,#f0a060,#b080d8,#5078d8,#b080d8,#f0a060);background-size:300% 100%;box-shadow:0 0 10px rgba(240,130,80,.4);animation:wr-ps 4s linear infinite}@keyframes wr-ps{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:768px){.wr-header{top:2.5vh}.wr-kicker{font-size:.44rem}.wr-t__w{font-size:1.5rem}.wr-sub{font-size:.48rem}.wr-center{width:60vw;height:50vh}.wr-wing__slot{width:18vw}.wr-card{width:70px}}
</style>
