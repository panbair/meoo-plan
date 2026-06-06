<template>
  <section ref="rootRef" class="dm-root">
    <div ref="trackLight" class="dm-light"></div>

    <div ref="scrollRef" class="dm-scroll">
      <div ref="trackRef" class="dm-track" :style="{ height: trackHeight }">
        <div class="dm-sticky">

          <header ref="headerRef" class="dm-header">
            <span class="dm-kicker">🁫 CSS3 3D Domino Chain · 多米诺链 ◈</span>
            <h1 class="dm-title">
              <span ref="tc1" class="dm-title__c">多</span>
              <span ref="tc2" class="dm-title__c dm-title__c--fall">米</span>
              <span ref="tc3" class="dm-title__c">诺</span>
              <span ref="tc4" class="dm-title__c dm-title__c--fall">链</span>
            </h1>
            <div ref="lineRef" class="dm-line"></div>
            <p class="dm-sub">向下滚动 · 48张多米诺骨牌3D依次倒下 · 连锁翻转 · 正反两面见不同图片</p>
          </header>

          <div ref="sceneRef" class="dm-scene">
            <div ref="dominoRef" class="dm-dominoes">
              <!-- 8列×6行多米诺骨牌 -->
              <div
                v-for="domino in dominoes"
                :key="domino.id"
                :ref="(el)=>setDominoRef(el as HTMLElement, domino.id)"
                class="dm-domino"
                :style="{ '--col': domino.col, '--row': domino.row }"
              >
                <!-- 正面 -->
                <div class="dm-domino__front">
                  <img :src="domino.frontImg" :alt="domino.alt" class="dm-domino__img" />
                </div>
                <!-- 背面 -->
                <div class="dm-domino__back">
                  <img :src="domino.backImg" :alt="domino.alt+'背'" class="dm-domino__img" />
                  <div class="dm-domino__dots">
                    <span class="dm-domino__dot" v-for="d in domino.dots" :key="d" :style="{'--dx':d%2===0?'-30%':'30%','--dy':d<3?'-30%':'30%'}"></span>
                  </div>
                </div>
                <!-- 厚度侧边 -->
                <div class="dm-domino__edge"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="dm-info">
            <span class="dm-info__icon">🁫</span>
            <span class="dm-info__text">已倒下 {{ fallenCount }}/{{ TOTAL }}</span>
          </div>

          <div class="dm-progress"><div ref="progRef" class="dm-progress__fill"></div></div>
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
const trackHeight = `${10 * 100}vh`

const frontPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=200&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=200&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80',
]
const backPool = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=200&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&q=80',
]

const dominoes = Array.from({ length: TOTAL }, (_, i) => ({
  id: i, col: i % COLS, row: Math.floor(i / COLS),
  frontImg: frontPool[i % frontPool.length],
  backImg: backPool[i % backPool.length],
  alt: `骨牌${i}`,
  dots: (i % 6) + 1, // 背面点数1~6
}))

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const dominoRef=ref<HTMLElement|null>(null)
const trackLight=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const fallenCount=ref(0)
const dominoRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setDominoRef(el:HTMLElement|null,idx:number){dominoRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,rotateX:-90,scale:.3},{autoAlpha:1,rotateX:0,scale:1,duration:.7,stagger:.12,ease:'back.out(2.5)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-20,scale:.6},{autoAlpha:1,rotateX:-8,scale:1,duration:1,ease:'power4.out'},'-.4')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupDominoChain(){
  if(!scrollRef.value||!trackRef.value||!dominoRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=dominoRefs.value.filter(Boolean) as HTMLElement[]

  // 🔑 transform-origin在底部 — 骨牌从底部向前倒下
  els.forEach(el=>{gsap.set(el,{transformOrigin:'50% 100%',rotateX:0})})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){fallenCount.value=Math.min(TOTAL,Math.max(0,Math.floor(self.progress*TOTAL*1.1)))},
    },
  })

  // 🁫 多米诺连锁倒下
  // 顺序：从左到右，从上到下
  els.forEach((el,i)=>{
    const d=dominoes[i]
    // 每行从左到右，行与行之间有时间差
    const baseDelay=d.row*0.6+d.col*0.08  // 行间0.6s延迟，列间0.08s

    // 骨牌倒下：rotateX 0→-85° (前倒)
    master.to(el,{rotateX:-85,duration:.5,ease:'power3.in'},baseDelay)

    // 倒下后微弹
    master.to(el,{rotateX:-88,duration:.08,ease:'sine.out'},baseDelay+.5)
    master.to(el,{rotateX:-84,duration:.12,ease:'sine.inOut'},baseDelay+.58)

    // 推倒下一个(水平相邻）的力 — 该骨牌碰到下一个的瞬间给一点向前的力
    if(d.col<COLS-1){
      const next=dominoes[i+1]
      const nextDelay=d.row*0.6+(d.col+1)*0.08
      // 当前骨牌倒下碰到下一个的瞬间
      master.to(el,{x:2,duration:.05,ease:'power2.out'},nextDelay-.05)
      master.to(el,{x:0,duration:.1,ease:'power2.in'},nextDelay)
    }
  })

  if(dominoRef.value){master.to(dominoRef.value,{rotateX:-8,duration:1},0);master.to(dominoRef.value,{rotateX:2,duration:1},4);master.to(dominoRef.value,{rotateX:-5,duration:1},8)}
  if(trackLight.value)master.to(trackLight.value,{x:'10vw',opacity:.6,duration:9},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:9},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupDominoChain()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.dm-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#1a1816 0%,#201c18 20%,#1c1a16 40%,#221e1a 60%,#181614 80%,#1a1816 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.dm-light{position:absolute;width:35vw;height:25vw;top:10vh;left:20vw;border-radius:50%;background:radial-gradient(ellipse,rgba(255,200,140,.15) 0%,transparent 60%);filter:blur(70px);pointer-events:none;z-index:0;will-change:transform,opacity}
.dm-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(200,150,100,.15)}}
.dm-track{position:relative;width:100%}.dm-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.dm-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.dm-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(220,160,80,.7);background:rgba(180,120,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(200,140,60,.16);border-radius:999px;padding:.22rem .9rem;margin-bottom:.5rem}
.dm-title{margin:0;display:flex;justify-content:center;gap:.08em}
.dm-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#d0a050;will-change:transform,opacity;&--fall{background:linear-gradient(135deg,#e0b060,#c08030,#f0c870);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(220,160,60,.5))}}
.dm-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#e0b060,#c08030,#f0c870,transparent);transform-origin:center}
.dm-sub{margin:0;font-size:clamp(.64rem,.9vw,.78rem);color:rgba(200,140,60,.3);max-width:550px;margin-inline:auto}
.dm-scene{position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 45%;will-change:transform,opacity}
.dm-dominoes{position:relative;width:min(60vw,520px);height:min(44vw,370px);margin-left:calc(min(60vw,520px) / -2);margin-top:calc(min(44vw,370px) / -2);transform-style:preserve-3d;will-change:transform;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(6,1fr);gap:4px}

.dm-domino{transform-style:preserve-3d;will-change:transform;position:relative;height:100%;
  &__front,&__back{position:absolute;inset:0;border-radius:3px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.2)}
  &__front{background:#fef9f4;z-index:1}
  &__back{background:#1a1410;transform:rotateY(180deg);display:flex;align-items:center;justify-content:center}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__dots{position:absolute;inset:25%;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:2px}
  &__dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.6);margin:auto}
  &__edge{position:absolute;top:0;left:0;width:100%;height:4px;background:linear-gradient(180deg,#3a2818,#5a4028);transform:rotateX(90deg);transform-origin:top;border-radius:0 0 2px 2px}
  // 背面的点隐藏不需要的
  [style*="--dx"]{position:absolute;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.4);left:calc(50% + var(--dx));top:calc(50% + var(--dy))}
}

.dm-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.dm-info__icon{font-size:.9rem}.dm-info__text{font-size:.6rem;font-weight:600;color:rgba(220,160,60,.6);letter-spacing:.1em}
.dm-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(200,140,40,.05)}
.dm-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#e0b060,#c08030,#f0c870,#e0b060);background-size:200% 100%;box-shadow:0 0 10px rgba(220,160,60,.5)}
@media(max-width:768px){.dm-header{top:2vh}.dm-kicker{font-size:.42rem;padding:.1rem .4rem}.dm-title__c{font-size:1.3rem}}
</style>
