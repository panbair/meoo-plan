<template>
  <section ref="rootRef" class="sh-root">
    <div ref="shockwave" class="sh-shockwave"></div>
    <div ref="particleField" class="sh-particles"></div>

    <div ref="scrollRef" class="sh-scroll">
      <div ref="trackRef" class="sh-track" :style="{ height: trackHeight }">
        <div class="sh-sticky">

          <header ref="headerRef" class="sh-header">
            <span class="sh-kicker">💥 CSS3 3D Shatter Rebuild · 碎片重组 ◈</span>
            <h1 class="sh-title">
              <span ref="tc1" class="sh-title__c">碎</span>
              <span ref="tc2" class="sh-title__c sh-title__c--shatter">片</span>
              <span ref="tc3" class="sh-title__c">重</span>
              <span ref="tc4" class="sh-title__c sh-title__c--shatter">组</span>
            </h1>
            <div ref="lineRef" class="sh-line"></div>
            <p class="sh-sub">向下滚动 · 图片崩解为碎片在3D空间飞散 · 逆向滚动碎片聚合成图</p>
          </header>

          <div ref="sceneRef" class="sh-scene">
            <div ref="fragmentsRef" class="sh-fragments">
              <!-- 碎片网格 6×8=48 片 -->
              <div
                v-for="frag in fragments"
                :key="frag.id"
                :ref="(el)=>setFragRef(el as HTMLElement, frag.id)"
                class="sh-frag"
                :style="{
                  '--bg-x': frag.bgX+'%',
                  '--bg-y': frag.bgY+'%',
                  '--col': frag.col,
                  '--row': frag.row,
                }"
              >
                <div class="sh-frag__piece" :style="{ backgroundImage: 'url('+masterImage+')', backgroundPosition: frag.bgX+'% '+frag.bgY+'%', backgroundSize: (COLS*100)+'% '+(ROWS*100)+'%' }"></div>
                <div class="sh-frag__edge"></div>
              </div>
            </div>
          </div>

          <div ref="stateRef" class="sh-state">
            <span class="sh-state__dot"></span>
            <span class="sh-state__text">{{ isShattered ? '💥 崩解中' : '🧩 聚合中' }}</span>
          </div>

          <div class="sh-progress"><div ref="progRef" class="sh-progress__fill"></div></div>
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
//  CardImage3DShatterRebuild — CSS3 3D 碎片重组
//
//  核心概念：图片切割成48块碎片在3D空间中崩解飞散再重组
//  1. 使用 background-position 将一张大图切成6×8=48块碎片
//  2. 初始状态：所有碎片聚合 = 完整图
//  3. 用户竖滚 → 碎片向Z轴前后左右随机飞散（崩解）
//  4. 每片独立 translateZ + rotateX/Y + 随机偏移
//  5. 达到最大散开后再逐渐聚回
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const COLS = 8, ROWS = 6, TOTAL = COLS * ROWS
const masterImage = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1200&q=80'
const trackHeight = `${8 * 100}vh`

const fragments = Array.from({ length: TOTAL }, (_, i) => {
  const col = i % COLS, row = Math.floor(i / COLS)
  return { id: i, col, row, bgX: (col / (COLS - 1)) * 100, bgY: (row / (ROWS - 1)) * 100 }
})

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const fragmentsRef=ref<HTMLElement|null>(null)
const shockwave=ref<HTMLElement|null>(null);const particleField=ref<HTMLElement|null>(null)
const stateRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const isShattered=ref(false)
const fragRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setFragRef(el:HTMLElement|null,idx:number){fragRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,scale:.1,rotateZ:90},{autoAlpha:1,scale:1,rotateZ:0,duration:.7,stagger:.12,ease:'back.out(2.8)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupShatterRebuild(){
  if(!scrollRef.value||!trackRef.value||!fragmentsRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=fragRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：所有碎片聚合
  els.forEach(el=>gsap.set(el,{translateZ:0,rotateX:0,rotateY:0,x:0,y:0,scale:1,opacity:1}))

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){isShattered.value=self.progress>.3&&self.progress<.7},
    },
  })

  // 💥 崩解→重组 循环
  // 0→40%: 逐渐崩解
  // 40%→60%: 最大散开
  // 60%→100%: 逐渐聚合

  els.forEach((el,i)=>{
    const frag=fragments[i]
    // 每个碎片的随机飞散参数
    const distZ=(i%3-1)*180+(Math.random()*.5|0)*100
    const distX=((frag.col-COLS/2)*40)+((Math.random()*.5|0)*30)
    const distY=((frag.row-ROWS/2)*30)+((Math.random()*.5|0)*25)
    const rotX=(Math.random()>.5?1:-1)*(60+Math.random()*120)
    const rotY=(Math.random()>.5?1:-1)*(60+Math.random()*120)

    // 阶段1: 聚合→崩解
    master.fromTo(el,
      {translateZ:0,x:0,y:0,rotateX:0,rotateY:0,scale:1,opacity:1},
      {translateZ:distZ,x:distX,y:distY,rotateX:rotX,rotateY:rotY,scale:.7,opacity:.55,duration:3,ease:'power2.out'},
      0
    )
    // 阶段2: 最大散开停留（微小抖动）
    master.to(el,{translateZ:distZ+(i%2?15:-15),rotateX:rotX+10,duration:.5,ease:'sine.inOut'},3)
    master.to(el,{translateZ:distZ,rotateX:rotX,duration:.5,ease:'sine.inOut'},3.5)
    // 阶段3: 崩解→聚合
    master.to(el,
      {translateZ:0,x:0,y:0,rotateX:0,rotateY:0,scale:1,opacity:1,duration:3,ease:'power2.in'},
      4
    )
  })

  // 冲击波
  if(shockwave.value){master.to(shockwave.value,{scale:3,opacity:.4,duration:2,ease:'power3.out'},0);master.to(shockwave.value,{scale:0,opacity:0,duration:1,ease:'power3.in'},3);master.to(shockwave.value,{scale:2.5,opacity:.35,duration:2,ease:'power3.out'},4.5)}
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:7},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupShatterRebuild()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.sh-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0d0d18 0%,#060610 60%,#020204 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.sh-shockwave{position:absolute;width:20vw;height:20vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(255,200,100,.3);pointer-events:none;z-index:0;will-change:transform,opacity}
.sh-particles{position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.2;background-image:radial-gradient(1px 1px at 30% 40%,rgba(255,180,100,.6),transparent),radial-gradient(1px 1px at 60% 30%,rgba(255,200,120,.5),transparent),radial-gradient(1px 1px at 45% 70%,rgba(255,160,80,.5),transparent)}
.sh-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,160,60,.15)}}
.sh-track{position:relative;width:100%}.sh-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.sh-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.sh-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,180,100,.7);background:rgba(255,120,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(255,150,50,.16);border-radius:999px;padding:.22rem .9rem;margin-bottom:.5rem}
.sh-title{margin:0;display:flex;justify-content:center;gap:.08em}
.sh-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#f09040;will-change:transform,opacity;&--shatter{background:linear-gradient(135deg,#f09040,#ffc050,#ff7040);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 18px rgba(255,140,50,.6))}}
.sh-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f09040,#ffc050,#ff7040,transparent);transform-origin:center}
.sh-sub{margin:0;font-size:clamp(.64rem,.9vw,.78rem);color:rgba(240,150,60,.3);max-width:550px;margin-inline:auto}
.sh-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:600px;perspective-origin:50% 50%;will-change:transform,opacity}
.sh-fragments{position:relative;width:min(48vw,400px);height:min(34vw,280px);margin-left:calc(min(48vw,400px) / -2);margin-top:calc(min(34vw,280px) / -2);transform-style:preserve-3d;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(6,1fr);gap:2px}

.sh-frag{transform-style:preserve-3d;will-change:transform,opacity;
  &__piece{width:100%;height:100%;border-radius:2px;box-shadow:0 0 8px rgba(0,0,0,.3)}
  &__edge{position:absolute;inset:0;border-radius:2px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.05);pointer-events:none}
}
.sh-state{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.sh-state__dot{width:6px;height:6px;border-radius:50%;background:#f09040;box-shadow:0 0 14px rgba(255,140,50,.7);animation:sh-pulse 2s ease-in-out infinite}
@keyframes sh-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.sh-state__text{font-size:.62rem;font-weight:600;color:rgba(255,160,60,.6);letter-spacing:.1em}
.sh-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(255,140,40,.05)}
.sh-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f09040,#ffc050,#ff7040,#f09040);background-size:200% 100%;box-shadow:0 0 12px rgba(255,150,50,.5)}
@media(max-width:768px){.sh-header{top:2vh}.sh-kicker{font-size:.42rem;padding:.1rem .4rem}.sh-title__c{font-size:1.3rem}}
</style>
