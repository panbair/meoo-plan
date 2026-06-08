<template>
  <section ref="rootRef" class="sc-root">
    <div ref="scrollRef" class="sc-scroll">
      <div ref="trackRef" class="sc-track" :style="{ height: trackHeight }">
        <div class="sc-sticky">
          <header ref="headerRef" class="sc-header">
            <span class="sc-kicker">🪀 Spring Coil · 弹簧线圈</span>
            <h1 class="sc-title"><span ref="t1" class="sc-title__c">弹簧</span><span ref="t2" class="sc-title__c sc-title__c--alt">线圈</span></h1>
            <div ref="lineRef" class="sc-line"></div>
            <p class="sc-sub">向下滚动 · 线圈压缩蓄力 · 释放弹开 · 旋转展开</p>
          </header>

          <div ref="sceneRef" class="sc-scene">
            <div ref="coilRef" class="sc-coil">
              <div v-for="card in cards" :key="card.id"
                :ref="(el) => setCardRef(el as HTMLElement, card.id)"
                class="sc-card"
                :style="{ '--angle': card.angle+'rad', '--y': card.baseY+'px', '--r': card.radius+'px' }"
              >
                <img :src="card.image" :alt="card.alt" class="sc-card__img" />
              </div>
            </div>
          </div>

          <div ref="infoRef" class="sc-info">
            <span class="sc-info__state">{{ coilState }}</span>
          </div>
          <div class="sc-progress"><div ref="progRef" class="sc-progress__fill"></div></div>
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
type TC = () => void

interface CardData { id: number; angle: number; baseY: number; radius: number; image: string; alt: string }
const pool = [
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
]

const TURNS = 4; const CARDS_PER_TURN = 5; const TOTAL = TURNS * CARDS_PER_TURN
const COIL_RADIUS = 160
const TURN_HEIGHT = 55 // 每圈高度

const cards: CardData[] = Array.from({ length: TOTAL }, (_, i) => {
  const turn = Math.floor(i / CARDS_PER_TURN)
  const angle = (i % CARDS_PER_TURN) / CARDS_PER_TURN * Math.PI * 2 + turn * 0.6 // 每圈错开角度
  const baseY = turn * TURN_HEIGHT
  return { id: i, angle, baseY, radius: COIL_RADIUS - turn * 8, image: pool[i % pool.length], alt: `img${i}` }
})

const trackHeight = `${(TOTAL + 3) * 90}vh`

const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const headerRef = ref<HTMLElement|null>(null)
const lineRef = ref<HTMLElement|null>(null); const t1 = ref<HTMLElement|null>(null); const t2 = ref<HTMLElement|null>(null)
const sceneRef = ref<HTMLElement|null>(null); const coilRef = ref<HTMLElement|null>(null)
const infoRef = ref<HTMLElement|null>(null); const progRef = ref<HTMLElement|null>(null)
const coilState = ref('释放状态')
const cardRefs = ref<(HTMLElement|null)[]>([]); const cleanup: TC[] = []
function setCardRef(el: HTMLElement|null, idx: number) { cardRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value||!headerRef.value||!sceneRef.value) return
  const tl = gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo([t1.value,t2.value],{autoAlpha:0,y:80,filter:'blur(15px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.6,stagger:.1,ease:'power3.out'},'-.35')
    .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.45,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value,{autoAlpha:0},{autoAlpha:1,duration:.7,ease:'power2.out'},'-.2')
    .fromTo(infoRef.value,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.4,ease:'power2.out'},'-.1')
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]
  els.forEach((el,i)=>{
    tl.fromTo(el,{autoAlpha:0,scale:0},{autoAlpha:1,scale:1,duration:.3,ease:'back.out(2)'},`-=${.3-i*.01}`)
  })
  cleanup.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupCoil() {
  if (!scrollRef.value||!trackRef.value||!coilRef.value) return
  const sc=scrollRef.value; const track=trackRef.value
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]

  // 🔑 初始：弹簧释放状态 (卡片Y间距=1.0x)
  els.forEach(el=>gsap.set(el,{y:0,z:0}))
  if (sceneRef.value) gsap.set(sceneRef.value,{rotateX:35,rotateY:0})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller:sc,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){
        const p=self.progress
        if(p<.25) coilState.value='释放状态'
        else if(p<.45) coilState.value='压缩中...'
        else if(p<.55) coilState.value='🔴 最大压缩'
        else if(p<.75) coilState.value='回弹释放!'
        else coilState.value='释放状态'
      },
    },
  })

  // 🔑 线圈压缩/释放：
  // 阶段1 (0→45%): Y间距缩小 → 线圈压缩, 每张卡向中心Y收拢
  // 阶段2 (45→55%): 最大压缩, 短暂保持 + 微弹
  // 阶段3 (55→100%): 释放弹开, Y间距恢复
  const COMPRESS_FACTOR = 0.3 // 压缩到原来的30%

  els.forEach((el,i)=>{
    const c=cards[i]
    const compressY = -c.baseY * (1 - COMPRESS_FACTOR) // 压缩时Y偏移量
    const phase=i/TOTAL*.15 // 不同卡片微错开

    // 压缩
    master.to(el,{y:compressY,duration:.35,ease:'power3.in'},phase+.05)
    // 最大压缩 + 微弹
    master.to(el,{y:compressY*1.05,z:15,duration:.06,ease:'sine.out'},phase+.4)
    master.to(el,{y:compressY,z:-10,duration:.08,ease:'sine.in'},phase+.46)
    // 释放弹开 (弹跳)
    master.to(el,{y:compressY*-.15,z:25,duration:.15,ease:'back.out(1.8)'},phase+.54)
    master.to(el,{y:0,z:0,duration:.25,ease:'power2.out'},phase+.69)
  })

  // 整根弹簧在压缩时微微旋转
  if (coilRef.value) {
    master.to(coilRef.value,{rotateY:0,duration:TOTAL*.4},0)
    master.to(coilRef.value,{rotateY:40,duration:TOTAL*.15,ease:'power2.in'},TOTAL*.35)
    master.to(coilRef.value,{rotateY:-5,duration:TOTAL*.2,ease:'back.out(1.5)'},TOTAL*.5)
    master.to(coilRef.value,{rotateY:0,duration:TOTAL*.25,ease:'power2.out'},TOTAL*.7)
  }
  if (sceneRef.value) {
    master.to(sceneRef.value,{rotateX:30,rotateY:0,duration:TOTAL*.4},0)
    master.to(sceneRef.value,{rotateX:55,rotateY:-8,duration:TOTAL*.2,ease:'sine.inOut'},TOTAL*.3)
    master.to(sceneRef.value,{rotateX:25,rotateY:5,duration:TOTAL*.3,ease:'sine.inOut'},TOTAL*.5)
  }
  if (progRef.value) master.to(progRef.value,{width:'100%',duration:TOTAL},0)
  cleanup.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupCoil()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(s=>s.kill());cleanup.forEach(f=>f());cleanup.length=0})
</script>

<style scoped lang="scss">
.sc-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#141820 0%,#181e28 25%,#141a22 55%,#10161c 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.sc-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.05)}}
.sc-track{position:relative;width:100%}
.sc-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.sc-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(90vw,640px)}
.sc-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(180,200,180,.45);background:rgba(255,255,255,.02);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.05);border-radius:999px;padding:.14rem .65rem;margin-bottom:.3rem}
.sc-title{margin:0;display:flex;justify-content:center;gap:.06em}
.sc-title__c{font-size:clamp(1.4rem,3.6vw,2.8rem);font-weight:900;color:#b0d0b8;will-change:transform,opacity;&--alt{background:linear-gradient(180deg,#d0e8d0,#70a070,#509050);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.sc-line{width:50px;height:1.5px;margin:.2rem auto .25rem;border-radius:2px;background:linear-gradient(90deg,transparent,#60a060,#80c080,transparent);transform-origin:center}
.sc-sub{margin:0;font-size:clamp(.44rem,.62vw,.54rem);color:rgba(140,160,140,.25);max-width:380px;margin-inline:auto}
/* ── 3D场景 ── */
.sc-scene{position:absolute;inset:0;z-index:10;perspective:800px;perspective-origin:50% 42%;transform-style:preserve-3d;pointer-events:none;will-change:transform}
/* ── 线圈容器 ── */
.sc-coil{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}
/* ── 卡片：螺旋排列 ── */
.sc-card{
  position:absolute;top:0;left:0;
  width:clamp(100px,14vw,160px);height:clamp(140px,19.6vw,224px);
  margin-left:calc(clamp(100px,14vw,160px) / -2);
  margin-top:calc(clamp(140px,19.6vw,224px) / -2);
  // 🔑 螺旋公式: rotateY(角度) → translateZ(半径) → rotateY(-角度) → translateY(高度)
  transform:
    rotateY(calc(var(--angle) * 1rad))
    translateZ(var(--r))
    rotateY(calc(var(--angle) * -1rad))
    translateY(var(--y));
  transform-style:preserve-3d;
  will-change:transform;
  border-radius:3px;overflow:hidden;
  box-shadow:0 8px 22px rgba(0,0,0,.35),0 0 0 2px rgba(255,255,255,.08);
}
.sc-card__img{width:100%;height:100%;object-fit:cover;display:block}
/* ── 信息 ── */
.sc-info{position:absolute;bottom:5vh;left:50%;transform:translateX(-50%);z-index:25;text-align:center}
.sc-info__state{font-size:.55rem;font-weight:600;letter-spacing:.08em;color:rgba(160,200,160,.3)}
.sc-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:1.5px;background:rgba(255,255,255,.01)}
.sc-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#509050,#80c080,#509050)}
@media(max-width:768px){.sc-card{width:75px;height:105px;margin-left:-37px;margin-top:-52px}}
</style>
