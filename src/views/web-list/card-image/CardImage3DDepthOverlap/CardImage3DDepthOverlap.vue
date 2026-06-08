<template>
  <section ref="rootRef" class="cf-root">
    <div ref="scrollRef" class="cf-scroll">
      <div ref="trackRef" class="cf-track" :style="{ height: trackHeight }">
        <div class="cf-sticky">
          <header ref="headerRef" class="cf-header">
            <span class="cf-kicker">🃏 Cascade Fan · 扇形层叠</span>
            <h1 class="cf-title"><span ref="t1" class="cf-title__c">扇叠</span><span ref="t2" class="cf-title__c cf-title__c--alt">画廊</span></h1>
            <div ref="lineRef" class="cf-line"></div>
            <p class="cf-sub">向下滚动 · 卡片扇形展开 · 层层可见 · 3D阶梯透视</p>
          </header>

          <div ref="sceneRef" class="cf-scene">
            <!-- 每张卡片独立控制，阶梯式错位排列 -->
            <div
              v-for="(card, idx) in cards"
              :key="card.id"
              :ref="(el) => setCardRef(el as HTMLElement, idx)"
              class="cf-card"
              :style="{
                '--step-x': card.stepX + 'px',
                '--step-y': card.stepY + 'px',
                '--step-z': card.stepZ + 'px',
                '--rot-y': card.rotY + 'deg',
                zIndex: totalCards - idx,
              }"
            >
              <img :src="card.image" :alt="card.alt" class="cf-card__img" />
              <div class="cf-card__label">{{ idx + 1 }}</div>
            </div>
          </div>

          <div ref="infoRef" class="cf-info">
            <span class="cf-info__no">{{ String(currentIdx + 1).padStart(2, '0') }} / {{ totalCards }}</span>
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
type TC = () => void

interface CardData { id: number; image: string; alt: string; stepX: number; stepY: number; stepZ: number; rotY: number }
const pool = [
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80',
]

const totalCards = 12

// 🔑 阶梯式错位：每张卡向右下方向偏移，同时Z轴后退，形成"可以看到每一张"的扇形层叠
const cards: CardData[] = Array.from({ length: totalCards }, (_, i) => {
  const stepX = i * 28   // X轴: 每张右移28px (扇形展开)
  const stepY = i * 16   // Y轴: 每张下移16px
  const stepZ = i * 35   // Z轴: 每张后退35px (深度层次)
  const rotY = i * 2.5   // Y轴微转: 越往后转越多
  return { id: i, image: pool[i % pool.length], alt: `img${i}`, stepX, stepY, stepZ, rotY }
})

const trackHeight = `${(totalCards + 3) * 100}vh`

const rootRef = ref<HTMLElement|null>(null); const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null); const headerRef = ref<HTMLElement|null>(null)
const lineRef = ref<HTMLElement|null>(null); const t1 = ref<HTMLElement|null>(null); const t2 = ref<HTMLElement|null>(null)
const sceneRef = ref<HTMLElement|null>(null)
const infoRef = ref<HTMLElement|null>(null); const progRef = ref<HTMLElement|null>(null)
const currentIdx = ref(0)
const cardRefs = ref<(HTMLElement|null)[]>([]); const cleanup: TC[] = []
function setCardRef(el: HTMLElement|null, idx: number) { cardRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value||!headerRef.value||!sceneRef.value) return
  const tl = gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'})
    .fromTo([t1.value,t2.value],{autoAlpha:0,y:80,filter:'blur(15px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.6,stagger:.1,ease:'power3.out'},'-.35')
    .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.45,ease:'power3.inOut'},'-.2')
    .fromTo(sceneRef.value,{autoAlpha:0},{autoAlpha:1,duration:.7,ease:'power2.out'},'-.2')
  // 卡片从第一张到最后一张依次入场
  const els = cardRefs.value.filter(Boolean) as HTMLElement[]
  els.forEach((el,i)=>{
    tl.fromTo(el,{autoAlpha:0,y:60+i*5,scale:.6},{autoAlpha:1,y:0,scale:1,duration:.4,ease:'back.out(1.6)'},`-=${.35-i*.03}`)
  })
  cleanup.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupFanSpread() {
  if (!scrollRef.value||!trackRef.value) return
  const sc=scrollRef.value; const track=trackRef.value
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]

  // 初始状态：紧凑层叠
  els.forEach((el,i)=>{
    gsap.set(el, {
      x: cards[i].stepX * 0.3,
      y: cards[i].stepY * 0.3,
      z: cards[i].stepZ,
      rotateY: cards[i].rotY,
      rotateX: 0,
    })
  })
  if (sceneRef.value) gsap.set(sceneRef.value, { rotateX: 35, rotateY: -8 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller: sc, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        currentIdx.value = Math.min(totalCards-1, Math.max(0, Math.floor(self.progress * totalCards)))
      },
    },
  })

  // 🔑 扇形展开：每张卡在X/Y上向外展开，间距增大，Z轴保持层次
  els.forEach((el, i) => {
    const phase = i / totalCards
    const dur = 1.2 / totalCards

    // 阶段1: 从紧凑状态展开到完整扇形
    const fullX = cards[i].stepX
    const fullY = cards[i].stepY

    // 展开 (每张卡向外推到完整位置)
    master.to(el, {
      x: fullX,
      y: fullY,
      rotateX: -3 - i * 0.3,
      duration: dur * 0.7, ease: 'power2.out',
    }, Math.max(0, phase - dur * 0.15))

    // 微弹跳归位
    master.to(el, {
      x: fullX * 0.95,
      rotateX: -1,
      duration: dur * 0.3, ease: 'sine.inOut',
    }, phase + dur * 0.55)

    // 回缩
    master.to(el, {
      x: fullX * 0.3,
      y: fullY * 0.3,
      rotateX: 0,
      duration: dur * 0.6, ease: 'power2.in',
    }, phase + dur * 0.85)
  })

  // 场景微动增强透视感
  if (sceneRef.value) {
    master.to(sceneRef.value, { rotateX: 50, rotateY: 0, duration: totalCards * 0.6, ease: 'sine.inOut' }, 0)
    master.to(sceneRef.value, { rotateX: 30, rotateY: -12, duration: totalCards * 0.5, ease: 'sine.inOut' }, totalCards * 0.6)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: totalCards }, 0)
  cleanup.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupFanSpread() }))
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(s => s.kill()); cleanup.forEach(f => f()); cleanup.length = 0
})
</script>

<style scoped lang="scss">
.cf-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(160deg,#1a1a28 0%,#1e2234 25%,#1a1e2c 55%,#161a26 100%);font-family:'Inter','PingFang SC',system-ui,sans-serif}
.cf-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,255,255,.06)}}
.cf-track{position:relative;width:100%}
.cf-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}

.cf-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(90vw,640px)}
.cf-kicker{display:inline-block;font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(180,180,200,.45);background:rgba(255,255,255,.02);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.05);border-radius:999px;padding:.14rem .65rem;margin-bottom:.3rem}
.cf-title{margin:0;display:flex;justify-content:center;gap:.06em}
.cf-title__c{font-size:clamp(1.4rem,3.6vw,2.8rem);font-weight:900;color:#c0c0d8;will-change:transform,opacity;&--alt{background:linear-gradient(180deg,#e0dce8,#9888b8,#7868a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}
.cf-line{width:50px;height:1.5px;margin:.2rem auto .25rem;border-radius:2px;background:linear-gradient(90deg,transparent,#8878a8,#a898c0,transparent);transform-origin:center}
.cf-sub{margin:0;font-size:clamp(.44rem,.62vw,.54rem);color:rgba(150,140,180,.25);max-width:350px;margin-inline:auto}

/* ═══════════════ 3D场景 ═══════════════ */
.cf-scene{
  position:absolute;inset:0;z-index:10;
  perspective:800px;
  perspective-origin:50% 45%;
  transform-style:preserve-3d;
  pointer-events:none;
  will-change:transform;
}

/* ── 卡片：绝对居中 + 阶梯偏移 ── */
.cf-card{
  position:absolute;top:50%;left:50%;
  width:clamp(130px,18vw,200px);
  height:clamp(185px,25.7vw,285px);
  margin-left:calc(clamp(130px,18vw,200px) / -2);
  margin-top:calc(clamp(185px,25.7vw,285px) / -2);
  transform:
    translateX(var(--step-x))
    translateY(var(--step-y))
    translateZ(var(--step-z))
    rotateY(var(--rot-y));
  transform-style:preserve-3d;
  will-change:transform;
  border-radius:4px;overflow:hidden;
  box-shadow:0 10px 30px rgba(0,0,0,.4), 0 0 0 2px rgba(255,255,255,.1);
  cursor:pointer;
  transition:filter .25s;
  &:hover{filter:brightness(1.2)}
}

.cf-card__img{width:100%;height:100%;object-fit:cover;display:block}
.cf-card__label{
  position:absolute;bottom:6px;right:8px;
  font-size:.52rem;font-weight:700;color:#fff;
  background:rgba(0,0,0,.35);backdrop-filter:blur(4px);
  border-radius:3px;padding:.06rem .35rem;
}

/* ── 信息 ── */
.cf-info{position:absolute;bottom:5vh;left:50%;transform:translateX(-50%);z-index:25;text-align:center}
.cf-info__no{font-size:.55rem;font-weight:300;letter-spacing:.08em;color:rgba(160,150,190,.25);font-family:'Georgia',serif}

.cf-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:1.5px;background:rgba(255,255,255,.01)}
.cf-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#6858a0,#9888c0,#6858a0)}

@media(max-width:768px){
  .cf-card{width:100px;height:143px;margin-left:-50px;margin-top:-71px}
}
</style>
