<template>
  <section ref="rootRef" class="mc-root">
    <div ref="bgGlow" class="mc-glow"></div>
    <div ref="gridLines" class="mc-grid-bg"></div>

    <div ref="scrollRef" class="mc-scroll">
      <div ref="trackRef" class="mc-track" :style="{ height: trackHeight }">
        <div class="mc-sticky">

          <header ref="headerRef" class="mc-header">
            <span class="mc-kicker">🎲 CSS3 3D Magic Cube · 图片魔方 ◈</span>
            <h1 class="mc-title">
              <span ref="tc1" class="mc-title__c">图</span>
              <span ref="tc2" class="mc-title__c mc-title__c--cube">片</span>
              <span ref="tc3" class="mc-title__c">魔</span>
              <span ref="tc4" class="mc-title__c mc-title__c--cube">方</span>
            </h1>
            <div ref="lineRef" class="mc-line"></div>
            <p class="mc-sub">向下滚动 · 3×3×3魔方27个小立方体旋转 · 每面贴图 · 逐层转动</p>
          </header>

          <div ref="sceneRef" class="mc-scene">
            <div ref="cubeRef" class="mc-cube-whole">
              <!-- 27个小立方体 3×3×3 -->
              <div
                v-for="cell in cells"
                :key="cell.id"
                :ref="(el)=>setCellRef(el as HTMLElement, cell.id)"
                class="mc-cell"
                :class="{ 'mc-cell--visible': isCellVisible(cell) }"
                :style="{ '--lx': cell.lx, '--ly': cell.ly, '--lz': cell.lz }"
              >
                <!-- 小立方体6面 -->
                <div class="mc-face mc-face--f" v-if="cell.faceF"><img :src="faceImages[cell.faceF]" class="mc-face__img"/></div>
                <div class="mc-face mc-face--b" v-if="cell.faceB"><img :src="faceImages[cell.faceB]" class="mc-face__img"/></div>
                <div class="mc-face mc-face--r" v-if="cell.faceR"><img :src="faceImages[cell.faceR]" class="mc-face__img"/></div>
                <div class="mc-face mc-face--l" v-if="cell.faceL"><img :src="faceImages[cell.faceL]" class="mc-face__img"/></div>
                <div class="mc-face mc-face--t" v-if="cell.faceT"><img :src="faceImages[cell.faceT]" class="mc-face__img"/></div>
                <div class="mc-face mc-face--bo" v-if="cell.faceBo"><img :src="faceImages[cell.faceBo]" class="mc-face__img"/></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="mc-info">
            <span class="mc-info__icon">🎲</span>
            <span class="mc-info__text">旋转 {{ rotatingLayer }}</span>
          </div>

          <div class="mc-progress"><div ref="progRef" class="mc-progress__fill"></div></div>
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

// ═══════════════════════════════════════════════════════════════════
//  CardImage3DMagicCube — CSS3 3D 图片魔方
//
//  核心概念：3×3×3魔方，每面贴不同的Unsplash图片
//  1. 27个小立方体组成大魔方
//  2. 6个面各贴6张不同的Unsplash图
//  3. 用户竖滚 → 逐层旋转（R层→U层→F层→L层→D层→B层）
//  4. 旋转轴在层的中心
//  5. 未被旋转的层保持不动
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const SIZE = 3, TOTAL = SIZE * SIZE * SIZE
const CELL_SIZE = 70, GAP = 4
const trackHeight = `${8 * 100}vh`

const faceImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=300&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
]

interface Cell { id:number;lx:number;ly:number;lz:number;faceF:number|null;faceB:number|null;faceR:number|null;faceL:number|null;faceT:number|null;faceBo:number|null }

const cells: Cell[] = Array.from({ length: TOTAL }, (_, i) => {
  const x = i % SIZE, y = Math.floor(i / SIZE) % SIZE, z = Math.floor(i / (SIZE * SIZE))
  const lx = (x - 1) * (CELL_SIZE + GAP)
  const ly = (y - 1) * (CELL_SIZE + GAP)
  const lz = (z - 1) * (CELL_SIZE + GAP)
  return {
    id: i, lx, ly, lz,
    faceF: z === SIZE - 1 ? 0 : null, faceB: z === 0 ? 1 : null,
    faceR: x === SIZE - 1 ? 2 : null, faceL: x === 0 ? 3 : null,
    faceT: y === 0 ? 4 : null, faceBo: y === SIZE - 1 ? 5 : null,
  }
})

const rotatingLayer = ref('R层')
function isCellVisible(cell: Cell) { return !!(cell.faceF || cell.faceB || cell.faceR || cell.faceL || cell.faceT || cell.faceBo) }

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const cubeRef=ref<HTMLElement|null>(null)
const bgGlow=ref<HTMLElement|null>(null);const gridLines=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cellRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setCellRef(el:HTMLElement|null,idx:number){cellRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,rotateX:90,scale:.3},{autoAlpha:1,rotateX:0,scale:1,duration:.7,stagger:.12,ease:'back.out(2.5)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-30,rotateY:-20,scale:.4},{autoAlpha:1,rotateX:-20,rotateY:30,scale:1,duration:1.2,ease:'power4.out'},'-.5')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupMagicCube(){
  if(!scrollRef.value||!trackRef.value||!cubeRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const cube=cubeRef.value

  // 初始定位每个小立方体
  const els=cellRefs.value.filter(Boolean) as HTMLElement[]
  els.forEach((el,i)=>{
    const c=cells[i]
    gsap.set(el,{x:c.lx,y:c.ly,translateZ:c.lz,rotateX:0,rotateY:0,rotateZ:0})
  })
  if(cube)gsap.set(cube,{rotateX:-20,rotateY:30})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){
        const layers=['R层(右)','U层(上)','F层(前)','L层(左)','D层(下)','B层(后)']
        rotatingLayer.value=layers[Math.floor(self.progress*6)%6]||layers[0]
      },
    },
  })

  // 🎲 逐层旋转
  // R层旋转 (x==2的所有cell绕X轴转90°)
  const rLayer=els.filter((_,i)=>cells[i].lx>0)
  rLayer.forEach(el=>gsap.set(el,{transformOrigin:'50% 50%'}))
  master.to(rLayer,{rotateX:90,duration:1.2,ease:'power2.inOut'},0)
  master.to(rLayer,{rotateX:90,duration:.3,ease:'none'},1.2)

  // U层旋转 (y==0的所有cell绕Y轴转90°)
  const uLayer=els.filter((_,i)=>cells[i].ly<0)
  uLayer.forEach(el=>gsap.set(el,{transformOrigin:'50% 50%'}))
  master.to(uLayer,{rotateY:90,duration:1.2,ease:'power2.inOut'},1.5)
  master.to(uLayer,{rotateY:90,duration:.3,ease:'none'},2.7)

  // F层旋转 (z==2的所有cell绕Z轴转90°)
  const fLayer=els.filter((_,i)=>cells[i].lz>0)
  fLayer.forEach(el=>gsap.set(el,{transformOrigin:'50% 50%'}))
  master.to(fLayer,{rotateZ:90,duration:1.2,ease:'power2.inOut'},3)
  master.to(fLayer,{rotateZ:90,duration:.3,ease:'none'},4.2)

  // L层
  const lLayer=els.filter((_,i)=>cells[i].lx<0)
  lLayer.forEach(el=>gsap.set(el,{transformOrigin:'50% 50%'}))
  master.to(lLayer,{rotateX:-90,duration:1.2,ease:'power2.inOut'},4.5)
  master.to(lLayer,{rotateX:-90,duration:.3,ease:'none'},5.7)

  // 整体旋转展示
  if(cube){master.to(cube,{rotateY:30+60,duration:4,ease:'sine.inOut'},0);master.to(cube,{rotateY:-30+60,rotateX:-5,duration:4,ease:'sine.inOut'},4)}

  if(bgGlow.value)master.to(bgGlow.value,{scale:1.4,opacity:.7,duration:8},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:8},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupMagicCube()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.mc-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 40%,#0f1225 0%,#080a16 60%,#030408 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.mc-glow{position:absolute;width:35vw;height:35vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(80,140,240,.15) 0%,transparent 60%);filter:blur(60px);pointer-events:none;z-index:0;will-change:transform,opacity}
.mc-grid-bg{position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.04;background-image:linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px);background-size:40px 40px}
.mc-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(80,140,240,.15)}}
.mc-track{position:relative;width:100%}.mc-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.mc-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.mc-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:rgba(100,160,240,.7);background:rgba(60,120,220,.08);backdrop-filter:blur(8px);border:1px solid rgba(80,140,220,.16);border-radius:999px;padding:.22rem .9rem;margin-bottom:.5rem}
.mc-title{margin:0;display:flex;justify-content:center;gap:.08em}
.mc-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#6098e0;will-change:transform,opacity;&--cube{background:linear-gradient(135deg,#6098e0,#50c8b0,#a080e0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 16px rgba(80,150,230,.5))}}
.mc-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#6098e0,#50c8b0,#a080e0,transparent);transform-origin:center}
.mc-sub{margin:0;font-size:clamp(.64rem,.9vw,.78rem);color:rgba(100,160,220,.3);max-width:550px;margin-inline:auto}
.mc-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:900px;perspective-origin:50% 50%;will-change:transform,opacity}
.mc-cube-whole{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.mc-cell{position:absolute;width:70px;height:70px;margin-left:-35px;margin-top:-35px;transform-style:preserve-3d;will-change:transform;
  .mc-face{position:absolute;width:100%;height:100%;backface-visibility:hidden;overflow:hidden;border-radius:2px;box-shadow:0 0 8px rgba(0,0,0,.2);
    &__img{width:100%;height:100%;object-fit:cover;display:block}
    &--f{transform:translateZ(35px)}&--b{transform:translateZ(-35px) rotateY(180deg)}
    &--r{transform:translateX(35px) rotateY(90deg)}&--l{transform:translateX(-35px) rotateY(-90deg)}
    &--t{transform:translateY(-35px) rotateX(90deg)}&--bo{transform:translateY(35px) rotateX(-90deg)}
  }
}

.mc-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.mc-info__icon{font-size:.9rem}.mc-info__text{font-size:.6rem;font-weight:600;color:rgba(100,160,240,.6);letter-spacing:.1em}
.mc-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(80,140,220,.05)}
.mc-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#6098e0,#50c8b0,#a080e0,#6098e0);background-size:200% 100%;box-shadow:0 0 12px rgba(80,150,230,.5)}
@media(max-width:768px){.mc-header{top:2vh}.mc-kicker{font-size:.42rem;padding:.1rem .4rem}.mc-title__c{font-size:1.3rem}.mc-cell{width:50px;height:50px;margin-left:-25px;margin-top:-25px}
  .mc-face--f{transform:translateZ(25px)}.mc-face--b{transform:translateZ(-25px) rotateY(180deg)}.mc-face--r{transform:translateX(25px) rotateY(90deg)}.mc-face--l{transform:translateX(-25px) rotateY(-90deg)}.mc-face--t{transform:translateY(-25px) rotateX(90deg)}.mc-face--bo{transform:translateY(25px) rotateX(-90deg)}
}
</style>
