<template>
  <section ref="rootRef" class="vt-root">
    <div ref="sunGlow" class="vt-sun"></div>
    <div ref="fogLayer" class="vt-fog"></div>

    <div ref="scrollRef" class="vt-scroll">
      <div ref="trackRef" class="vt-track" :style="{ height: trackHeight }">
        <div class="vt-sticky">

          <header ref="headerRef" class="vt-header">
            <span class="vt-kicker">⛰ CSS3 3D Voxel Terrain · 体素地形 ◈</span>
            <h1 class="vt-title">
              <span ref="tc1" class="vt-title__c">体</span>
              <span ref="tc2" class="vt-title__c vt-title__c--peak">素</span>
              <span ref="tc3" class="vt-title__c">地</span>
              <span ref="tc4" class="vt-title__c vt-title__c--peak">形</span>
            </h1>
            <div ref="lineRef" class="vt-line"></div>
            <p class="vt-sub">向下滚动 · 3D体素山脉起伏 · 每块贴图 · 山峰峡谷 · 俯瞰大地</p>
          </header>

          <div ref="sceneRef" class="vt-scene">
            <div ref="terrainRef" class="vt-terrain">
              <div
                v-for="voxel in voxels"
                :key="voxel.id"
                :ref="(el)=>setVoxelRef(el as HTMLElement, voxel.id)"
                class="vt-voxel"
                :class="{ 'vt-voxel--peak': voxel.elevation > 0.7, 'vt-voxel--valley': voxel.elevation < 0.2 }"
                :style="{ '--ex': voxel.ex, '--ey': voxel.ey }"
              >
                <!-- 顶面 — 图片 -->
                <div class="vt-voxel__top">
                  <img :src="voxel.image" :alt="voxel.alt" class="vt-voxel__img" />
                </div>
                <!-- 四个侧面 — 颜色随高度 -->
                <div class="vt-voxel__side vt-voxel__side--n" :style="{height: voxel.sideHeight+'px'}"></div>
                <div class="vt-voxel__side vt-voxel__side--s" :style="{height: voxel.sideHeight+'px'}"></div>
                <div class="vt-voxel__side vt-voxel__side--e" :style="{height: voxel.sideHeight+'px'}"></div>
                <div class="vt-voxel__side vt-voxel__side--w" :style="{height: voxel.sideHeight+'px'}"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="vt-info">
            <span class="vt-info__icon">⛰</span>
            <span class="vt-info__text">海拔 {{ Math.round(avgElevation) }}m</span>
          </div>

          <div class="vt-progress"><div ref="progRef" class="vt-progress__fill"></div></div>
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

const COLS = 8, ROWS = 6, TOTAL = COLS * ROWS
const trackHeight = `${8 * 100}vh`

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=250&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=250&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=250&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=250&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=250&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=250&q=80',
]

// 用两层正弦波叠加生成地形高度图
const voxels = Array.from({ length: TOTAL }, (_, i) => {
  const col = i % COLS, row = Math.floor(i / COLS)
  const nx = col / (COLS - 1), ny = row / (ROWS - 1)
  // 多个正弦波叠加模拟自然地形
  const h1 = Math.sin(nx * Math.PI * 1.8) * Math.cos(ny * Math.PI * 1.5) * 0.6
  const h2 = Math.sin(nx * Math.PI * 3.5 + 1.2) * Math.sin(ny * Math.PI * 2.8 + 0.8) * 0.3
  const h3 = Math.cos(nx * Math.PI * 5.2) * Math.cos(ny * Math.PI * 4.1) * 0.1
  const raw = (h1 + h2 + h3 + 1) / 2 // 归一化到0~1
  const elevation = Math.max(0.05, Math.min(1, raw))
  const sideHeight = Math.round(elevation * 80)
  return {
    id: i, col, row,
    ex: (col - (COLS - 1) / 2) * 1.0,
    ey: (row - (ROWS - 1) / 2) * 1.0,
    elevation,
    sideHeight,
    image: imgPool[i % imgPool.length],
    alt: `地块${i}`,
  }
})

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const terrainRef=ref<HTMLElement|null>(null)
const sunGlow=ref<HTMLElement|null>(null);const fogLayer=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const avgElevation=ref(0)
const voxelRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setVoxelRef(el:HTMLElement|null,idx:number){voxelRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:100,filter:'blur(16px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-50,scale:.3},{autoAlpha:1,rotateX:-40,scale:1,duration:1.2,ease:'power4.out'},'-.5')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupVoxelTerrain(){
  if(!scrollRef.value||!trackRef.value||!terrainRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=voxelRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：所有体素 Z=0（平地）
  els.forEach((el,i)=>{gsap.set(el,{translateZ:0})})
  if(terrainRef.value)gsap.set(terrainRef.value,{rotateX:-40,rotateY:5})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){
        const sum=els.reduce((acc,el,i)=>acc+parseFloat(el.style.transform?.match(/translateZ\(([^)]+)\)/)?.[1]||'0')||0,0)
        avgElevation.value=Math.round((sum/els.length/80)*100)
      },
    },
  })

  // ⛰ 体素地形隆起
  els.forEach((el,i)=>{
    const v=voxels[i]
    const peakZ=v.elevation*80  // 最高80px

    // 从平地→隆起
    master.fromTo(el,{translateZ:0},{translateZ:peakZ,duration:4,ease:'power2.out'},0)
    // 山顶微弹
    if(v.elevation>0.6)master.to(el,{translateZ:peakZ+8,duration:.2,ease:'sine.inOut'},4+i*.01)
    if(v.elevation>0.6)master.to(el,{translateZ:peakZ,duration:.25,ease:'sine.inOut'},4.2+i*.01)
    // 回落
    master.to(el,{translateZ:peakZ*.3,duration:3,ease:'power2.in'},4.5)
    master.to(el,{translateZ:0,duration:1,ease:'power2.out'},7.5)
  })

  // 视角旋转 — 俯瞰地形
  if(terrainRef.value){
    master.to(terrainRef.value,{rotateX:-55,rotateY:15,duration:3,ease:'sine.inOut'},0)
    master.to(terrainRef.value,{rotateX:-30,rotateY:-10,duration:3,ease:'sine.inOut'},3)
    master.to(terrainRef.value,{rotateX:-45,rotateY:0,duration:2,ease:'sine.inOut'},6)
  }

  if(sunGlow.value)master.to(sunGlow.value,{x:'10vw',y:'-5vh',opacity:.6,duration:8},0)
  if(fogLayer.value)master.to(fogLayer.value,{opacity:.5,duration:8},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:8},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupVoxelTerrain()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.vt-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(180deg,#1a2838 0%,#1e3040 30%,#243848 60%,#1c2c3c 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.vt-sun{position:absolute;width:30vw;height:20vw;top:5vh;left:35vw;border-radius:50%;background:radial-gradient(ellipse,rgba(255,220,140,.2) 0%,transparent 60%);filter:blur(60px);pointer-events:none;z-index:0;will-change:transform,opacity}
.vt-fog{position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(180deg,transparent 0%,rgba(180,200,220,.06) 40%,rgba(160,180,200,.1) 70%,rgba(140,160,180,.15) 100%);will-change:opacity;opacity:.3}
.vt-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(140,180,200,.15)}}
.vt-track{position:relative;width:100%}.vt-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.vt-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.vt-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(180,200,220,.7);background:rgba(120,160,200,.08);backdrop-filter:blur(8px);border:1px solid rgba(140,180,210,.16);border-radius:999px;padding:.22rem .9rem;margin-bottom:.5rem}
.vt-title{margin:0;display:flex;justify-content:center;gap:.08em}
.vt-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#90b8d0;will-change:transform,opacity;&--peak{background:linear-gradient(135deg,#a0c8d8,#70a8b0,#80b090);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(120,180,180,.5))}}
.vt-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#a0c8d8,#70a8b0,#80b090,transparent);transform-origin:center}
.vt-sub{margin:0;font-size:clamp(.64rem,.9vw,.78rem);color:rgba(150,190,210,.3);max-width:540px;margin-inline:auto}
.vt-scene{position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:800px;perspective-origin:50% 40%;will-change:transform,opacity}
.vt-terrain{position:relative;width:min(56vw,480px);height:min(40vw,340px);margin-left:calc(min(56vw,480px) / -2);margin-top:calc(min(40vw,340px) / -2);transform-style:preserve-3d;will-change:transform;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(6,1fr);gap:1px}

.vt-voxel{transform-style:preserve-3d;will-change:transform;
  &__top{position:relative;width:100%;height:100%;overflow:hidden;border-radius:2px;box-shadow:0 0 6px rgba(0,0,0,.2)}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__side{position:absolute;width:100%;background:linear-gradient(180deg,rgba(80,120,60,.4),rgba(60,80,40,.6));border-radius:0 0 1px 1px;
    &--n{transform-origin:top;transform:rotateX(-90deg);top:100%}
    &--s{transform-origin:bottom;transform:rotateX(90deg);bottom:100%}
    &--e{transform-origin:right;transform:rotateY(90deg);right:0;width:4px;left:auto}&--w{transform-origin:left;transform:rotateY(-90deg);left:0;width:4px}
  }
  &--peak .vt-voxel__top{box-shadow:0 0 12px rgba(255,255,255,.1)}&--valley .vt-voxel__img{filter:brightness(.7)}
}

.vt-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.vt-info__icon{font-size:.9rem}.vt-info__text{font-size:.6rem;font-weight:600;color:rgba(160,200,210,.6);letter-spacing:.1em}
.vt-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(140,180,200,.05)}
.vt-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#a0c8d8,#70a8b0,#80b090,#a0c8d8);background-size:200% 100%;box-shadow:0 0 10px rgba(120,180,180,.5)}
@media(max-width:768px){.vt-header{top:2vh}.vt-kicker{font-size:.42rem;padding:.1rem .4rem}.vt-title__c{font-size:1.3rem}}
</style>
