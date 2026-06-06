<template>
  <section ref="rootRef" class="jig-root">
    <div ref="tableGlow" class="jig-table-glow"></div>

    <div ref="scrollRef" class="jig-scroll">
      <div ref="trackRef" class="jig-track" :style="{ height: trackHeight }">
        <div class="jig-sticky">

          <header ref="headerRef" class="jig-header">
            <span class="jig-kicker">🧩 CSS3 3D Jigsaw Puzzle · 拼图重组 ◈</span>
            <h1 class="jig-title">
              <span ref="tc1" class="jig-title__c">拼</span>
              <span ref="tc2" class="jig-title__c jig-title__c--piece">图</span>
              <span ref="tc3" class="jig-title__c">重</span>
              <span ref="tc4" class="jig-title__c jig-title__c--piece">组</span>
            </h1>
            <div ref="lineRef" class="jig-line"></div>
            <p class="jig-sub">向下滚动 · 拼图碎片在3D空间散落→旋转归位→拼成完整图片</p>
          </header>

          <div ref="sceneRef" class="jig-scene">
            <div ref="puzzleRef" class="jig-puzzle">
              <div
                v-for="piece in pieces"
                :key="piece.id"
                :ref="(el)=>setPieceRef(el as HTMLElement, piece.id)"
                class="jig-piece"
              >
                <div class="jig-piece__tile" :style="{ backgroundImage: 'url('+masterImage+')', backgroundPosition: piece.bgX+'% '+piece.bgY+'%', backgroundSize: (COLS*100)+'% '+(ROWS*100)+'%' }"></div>
                <!-- 拼图凹凸边缘(用clip-path模拟) -->
              </div>
            </div>
          </div>

          <div ref="infoRef" class="jig-info">
            <span class="jig-info__dot"></span>
            <span class="jig-info__text">拼合 {{ assembled }}/{{ TOTAL }}</span>
          </div>

          <div class="jig-progress"><div ref="progRef" class="jig-progress__fill"></div></div>
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

const COLS = 6, ROWS = 4, TOTAL = COLS * ROWS
const masterImage = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1000&q=80'
const trackHeight = `${8 * 100}vh`

const pieces = Array.from({ length: TOTAL }, (_, i) => {
  const col = i % COLS, row = Math.floor(i / COLS)
  return {
    id: i, col, row,
    bgX: (col / (COLS - 1)) * 100,
    bgY: (row / (ROWS - 1)) * 100,
    // 每个碎片的散落位置和目标位置
    scatterX: (col - (COLS - 1) / 2) * 70 + (Math.random() - .5) * 100,
    scatterY: (row - (ROWS - 1) / 2) * 60 + (Math.random() - .5) * 80,
    scatterZ: (Math.random() - .5) * 200,
    scatterRX: (Math.random() - .5) * 360,
    scatterRY: (Math.random() - .5) * 360,
  }
})

const assembled = ref(0)
const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const puzzleRef=ref<HTMLElement|null>(null)
const tableGlow=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const pieceRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setPieceRef(el:HTMLElement|null,idx:number){pieceRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,rotateZ:90,scale:.2},{autoAlpha:1,rotateZ:0,scale:1,duration:.7,stagger:.12,ease:'back.out(2.8)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-25,scale:.5},{autoAlpha:1,rotateX:-10,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupJigsawPuzzle(){
  if(!scrollRef.value||!trackRef.value||!puzzleRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=pieceRefs.value.filter(Boolean) as HTMLElement[]
  const puzzle=puzzleRef.value

  // 初始：所有碎片散落在3D空间
  els.forEach((el,i)=>{
    const p=pieces[i]
    gsap.set(el,{x:p.scatterX,y:p.scatterY,translateZ:p.scatterZ,rotateX:p.scatterRX,rotateY:p.scatterRY,scale:.7,opacity:.5})
  })

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){assembled.value=Math.min(TOTAL,Math.max(0,Math.floor(self.progress*TOTAL*1.05)))},
    },
  })

  // 🧩 碎片从散落→归位（从四周向中心聚合）
  els.forEach((el,i)=>{
    const p=pieces[i]
    const delay=(Math.abs(p.col-COLS/2)+Math.abs(p.row-ROWS/2))*.12
    // 先旋转归正
    master.to(el,{rotateX:0,rotateY:0,scale:1,duration:1.5,ease:'power2.inOut'},delay)
    // 再移动到目标位置
    master.to(el,{x:0,y:0,translateZ:0,opacity:1,duration:2.5,ease:'power3.out'},delay+1.5)
  })

  if(puzzle){master.to(puzzle,{rotateX:-10,duration:1},0);master.to(puzzle,{rotateY:15,duration:3,ease:'sine.inOut'},1.5);master.to(puzzle,{rotateY:-8,rotateX:-6,duration:2.5,ease:'sine.inOut'},5)}
  if(tableGlow.value)master.to(tableGlow.value,{scale:1.3,opacity:.6,duration:7},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:7},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupJigsawPuzzle()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.jig-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#1c1814 0%,#221c16 20%,#1e1a14 40%,#241e18 60%,#1a1612 80%,#1c1814 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.jig-table-glow{position:absolute;width:40vw;height:28vw;top:30vh;left:30vw;border-radius:50%;background:radial-gradient(ellipse,rgba(255,200,140,.1) 0%,transparent 60%);filter:blur(60px);pointer-events:none;z-index:0;will-change:transform,opacity}
.jig-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(200,150,100,.15)}}
.jig-track{position:relative;width:100%}.jig-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.jig-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.jig-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(220,160,80,.7);background:rgba(180,120,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(200,140,60,.16);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.jig-title{margin:0;display:flex;justify-content:center;gap:.08em}
.jig-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#d0a050;will-change:transform,opacity;&--piece{background:linear-gradient(135deg,#e0b060,#c08030,#f0c870);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(220,160,60,.5))}}
.jig-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#e0b060,#c08030,#f0c870,transparent);transform-origin:center}
.jig-sub{margin:0;font-size:clamp(.62rem,.88vw,.76rem);color:rgba(200,140,60,.3);max-width:540px;margin-inline:auto}
.jig-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:650px;perspective-origin:50% 50%;will-change:transform,opacity}
.jig-puzzle{position:relative;width:min(48vw,400px);height:min(30vw,250px);margin-left:calc(min(48vw,400px) / -2);margin-top:calc(min(30vw,250px) / -2);transform-style:preserve-3d;will-change:transform;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(4,1fr);gap:1px}

.jig-piece{transform-style:preserve-3d;will-change:transform,opacity;
  &__tile{width:100%;height:100%;border-radius:2px;box-shadow:0 2px 10px rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.06)}
}

.jig-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.jig-info__dot{width:6px;height:6px;border-radius:50%;background:#d0a050;box-shadow:0 0 12px rgba(220,160,60,.6);animation:jig-pulse 2s ease-in-out infinite}
@keyframes jig-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.jig-info__text{font-size:.6rem;font-weight:600;color:rgba(220,160,60,.6);letter-spacing:.1em}
.jig-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(200,140,40,.05)}
.jig-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#e0b060,#c08030,#f0c870,#e0b060);background-size:200% 100%;box-shadow:0 0 10px rgba(220,160,60,.5)}
@media(max-width:768px){.jig-header{top:2vh}.jig-kicker{font-size:.4rem;padding:.1rem .4rem}.jig-title__c{font-size:1.3rem}}
</style>
