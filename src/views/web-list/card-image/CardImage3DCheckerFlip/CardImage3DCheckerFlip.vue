<template>
  <section ref="rootRef" class="cf-root">
    <div ref="boardGlow" class="cf-board-glow"></div>

    <div ref="scrollRef" class="cf-scroll">
      <div ref="trackRef" class="cf-track" :style="{ height: trackHeight }">
        <div class="cf-sticky">

          <header ref="headerRef" class="cf-header">
            <span class="cf-kicker">🏁 CSS3 3D Checker Flip · 棋盘翻转 ◈</span>
            <h1 class="cf-title">
              <span ref="tc1" class="cf-title__c">棋</span>
              <span ref="tc2" class="cf-title__c cf-title__c--flip">盘</span>
              <span ref="tc3" class="cf-title__c">翻</span>
              <span ref="tc4" class="cf-title__c cf-title__c--flip">转</span>
            </h1>
            <div ref="lineRef" class="cf-line"></div>
            <p class="cf-sub">向下滚动 · 棋盘格依次3D翻转 · 正面A图·背面B图 · 交替波浪</p>
          </header>

          <div ref="sceneRef" class="cf-scene">
            <div ref="boardRef" class="cf-board">
              <div
                v-for="tile in tiles"
                :key="tile.id"
                :ref="(el)=>setTileRef(el as HTMLElement, tile.id)"
                class="cf-tile"
                :class="{
                  'cf-tile--dark': tile.isDark,
                  'cf-tile--flipping': tile.isDark,
                }"
              >
                <!-- 正面 -->
                <div class="cf-tile__front">
                  <img :src="tile.frontImg" :alt="tile.alt" class="cf-tile__img" />
                </div>
                <!-- 背面 -->
                <div class="cf-tile__back">
                  <img :src="tile.backImg" :alt="tile.alt+'背'" class="cf-tile__img" />
                </div>
                <!-- 边缘厚度 -->
                <div class="cf-tile__edge"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="cf-info">
            <span class="cf-info__dot"></span>
            <span class="cf-info__text">{{ flipPhase }}</span>
          </div>

          <div class="cf-progress"><div ref="progRef" class="cf-progress__fill"></div></div>
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
const trackHeight = `${9 * 100}vh`

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

const tiles = Array.from({ length: TOTAL }, (_, i) => {
  const col = i % COLS, row = Math.floor(i / COLS)
  return {
    id: i, col, row,
    isDark: (col + row) % 2 === 1,
    frontImg: frontPool[i % frontPool.length],
    backImg: backPool[(i + 2) % backPool.length],
    alt: `格${i}`,
  }
})

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const boardRef=ref<HTMLElement|null>(null)
const boardGlow=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const flipPhase=ref('暗格翻')
const tileRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setTileRef(el:HTMLElement|null,idx:number){tileRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:100,filter:'blur(18px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-30,scale:.4},{autoAlpha:1,rotateX:-12,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupCheckerFlip(){
  if(!scrollRef.value||!trackRef.value||!boardRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=tileRefs.value.filter(Boolean) as HTMLElement[]

  // 🔑 棋盘格在棋盘中交替翻转
  els.forEach(el=>gsap.set(el,{transformOrigin:'50% 50%',rotateX:0,rotateY:0}))

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){
        const p=self.progress
        if(p<.25)flipPhase.value='暗格依次翻'
        else if(p<.5)flipPhase.value='暗格复原'
        else if(p<.75)flipPhase.value='亮格依次翻'
        else flipPhase.value='全部复原'
      },
    },
  })

  // 🏁 交替翻转模式
  // 阶段1 (0-25%): 暗格从左上到右下依次翻转180°
  // 阶段2 (25-50%): 暗格依次翻回
  // 阶段3 (50-75%): 亮格从左上到右下依次翻转
  // 阶段4 (75-100%): 亮格依次翻回

  els.forEach((el,i)=>{
    const tile=tiles[i]
    const baseDelay=(tile.row*.15+tile.col*.06)

    if(tile.isDark){
      // 暗格：先翻再回
      master.to(el,{rotateX:180,duration:.6,ease:'power3.in'},baseDelay*.5)    // 翻
      master.to(el,{rotateX:180,duration:.3,ease:'none'},baseDelay*.5+.6)       // 停
      master.to(el,{rotateX:0,duration:.6,ease:'power3.out'},baseDelay*.5+3.5)  // 回
    }else{
      // 亮格：在暗格之后翻
      master.to(el,{rotateX:180,duration:.6,ease:'power3.in'},baseDelay*.5+4.5)  // 翻
      master.to(el,{rotateX:180,duration:.3,ease:'none'},baseDelay*.5+5.1)       // 停
      master.to(el,{rotateX:0,duration:.6,ease:'power3.out'},baseDelay*.5+8)     // 回
    }
  })

  if(boardRef.value){master.to(boardRef.value,{rotateX:-12,duration:1},0);master.to(boardRef.value,{rotateY:10,duration:4,ease:'sine.inOut'},2);master.to(boardRef.value,{rotateY:-8,duration:3,ease:'sine.inOut'},6)}
  if(boardGlow.value)master.to(boardGlow.value,{scale:1.3,opacity:.5,duration:9},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:9},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupCheckerFlip()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.cf-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(160deg,#15181c 0%,#1a1e24 20%,#161a20 40%,#1c2026 60%,#14181c 80%,#15181c 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.cf-board-glow{position:absolute;width:38vw;height:28vw;top:25vh;left:31vw;border-radius:50%;background:radial-gradient(ellipse,rgba(100,140,200,.12) 0%,transparent 60%);filter:blur(70px);pointer-events:none;z-index:0;will-change:transform,opacity}
.cf-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(120,160,200,.15)}}
.cf-track{position:relative;width:100%}.cf-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.cf-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.cf-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(140,180,220,.7);background:rgba(80,120,200,.08);backdrop-filter:blur(8px);border:1px solid rgba(100,140,210,.16);border-radius:999px;padding:.22rem .9rem;margin-bottom:.5rem}
.cf-title{margin:0;display:flex;justify-content:center;gap:.08em}
.cf-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#80a8d0;will-change:transform,opacity;&--flip{background:linear-gradient(135deg,#80a8d0,#50b8c0,#a088d0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(100,150,210,.5))}}
.cf-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#80a8d0,#50b8c0,#a088d0,transparent);transform-origin:center}
.cf-sub{margin:0;font-size:clamp(.64rem,.9vw,.78rem);color:rgba(120,160,210,.3);max-width:540px;margin-inline:auto}
.cf-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:750px;perspective-origin:50% 50%;will-change:transform,opacity}
.cf-board{position:relative;width:min(56vw,480px);height:min(40vw,340px);margin-left:calc(min(56vw,480px) / -2);margin-top:calc(min(40vw,340px) / -2);transform-style:preserve-3d;will-change:transform;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(6,1fr);gap:2px}

.cf-tile{transform-style:preserve-3d;will-change:transform;position:relative;
  &__front,&__back{position:absolute;inset:0;border-radius:2px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.2)}
  &__front{background:#f8f6f2;z-index:1}
  &__back{background:#1a1e24;transform:rotateX(180deg)}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__edge{position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(180deg,#3a4048,#505860);transform:rotateX(90deg);transform-origin:top;border-radius:0 0 1px 1px}
  &--dark .cf-tile__front{filter:brightness(.85)}
}

.cf-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.cf-info__dot{width:6px;height:6px;border-radius:50%;background:#80a8d0;box-shadow:0 0 12px rgba(100,150,210,.6);animation:cf-pulse 2s ease-in-out infinite}
@keyframes cf-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.cf-info__text{font-size:.6rem;font-weight:600;color:rgba(120,160,210,.6);letter-spacing:.1em}
.cf-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(100,140,200,.05)}
.cf-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#80a8d0,#50b8c0,#a088d0,#80a8d0);background-size:200% 100%;box-shadow:0 0 12px rgba(100,150,210,.5)}
@media(max-width:768px){.cf-header{top:2vh}.cf-kicker{font-size:.42rem;padding:.1rem .4rem}.cf-title__c{font-size:1.3rem}}
</style>
