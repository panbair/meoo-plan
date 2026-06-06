<template>
  <section ref="rootRef" class="mb-root">
    <div ref="ringGlow" class="mb-ring-glow"></div>

    <div ref="scrollRef" class="mb-scroll">
      <div ref="trackRef" class="mb-track" :style="{ height: trackHeight }">
        <div class="mb-sticky">

          <header ref="headerRef" class="mb-header">
            <span class="mb-kicker">∞ CSS3 3D Mobius Gallery · 莫比乌斯画廊 ◈</span>
            <h1 class="mb-title">
              <span ref="tc1" class="mb-title__c">莫</span><span ref="tc2" class="mb-title__c mb-title__c--mobius">比</span>
              <span ref="tc3" class="mb-title__c">乌</span><span ref="tc4" class="mb-title__c mb-title__c--mobius">斯</span>
            </h1>
            <div ref="lineRef" class="mb-line"></div>
            <p class="mb-sub">向下滚动 · 图片沿莫比乌斯环单面无限排列 · 扭转180° · 正面即背面</p>
          </header>

          <div ref="sceneRef" class="mb-scene">
            <div ref="mobiusRef" class="mb-mobius">
              <!-- 24张图片沿莫比乌斯环排列 -->
              <div v-for="card in cards" :key="card.id"
                :ref="(el)=>setCardRef(el as HTMLElement, card.id)"
                class="mb-card"
              >
                <img :src="card.image" :alt="card.alt" class="mb-card__img" />
                <div class="mb-card__glow"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="mb-info">
            <span class="mb-info__dot"></span><span class="mb-info__text">单面循环 · 正反归一</span>
          </div>
          <div class="mb-progress"><div ref="progRef" class="mb-progress__fill"></div></div>
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

const CARD_COUNT = 24
const trackHeight = `${7 * 100}vh`

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=180&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=180&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=180&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=180&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=180&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=180&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=180&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=180&q=80',
]

const RING_R = 180
const cards = Array.from({length:CARD_COUNT},(_,i)=>{
  const t = i / CARD_COUNT // 0→1 沿环一周
  const angle = t * Math.PI * 2
  const twist = t * Math.PI // 莫比乌斯扭转(180°)
  return {
    id:i,
    angle, twist,
    x: Math.cos(angle) * RING_R,
    y: Math.sin(angle) * 10, // 微弧
    z: Math.sin(angle) * RING_R,
    image: imgPool[i%imgPool.length],
    alt: `莫比乌斯${i}`,
  }
})

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const mobiusRef=ref<HTMLElement|null>(null)
const ringGlow=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cardRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setCardRef(el:HTMLElement|null,idx:number){cardRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,z:-400,scale:.1,rotateY:180},{autoAlpha:1,z:0,scale:1,rotateY:0,duration:.75,stagger:.12,ease:'back.out(2.5)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-25,scale:.3},{autoAlpha:1,rotateX:-10,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupMobiusGallery(){
  if(!scrollRef.value||!trackRef.value||!mobiusRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=cardRefs.value.filter(Boolean) as HTMLElement[]
  const mobius=mobiusRef.value

  // ∞ 初始定位：卡片沿莫比乌斯环排列
  els.forEach((el,i)=>{
    const c=cards[i]
    // 莫比乌斯扭转：rotateX = twist → 走到一半(180°)时卡片翻到背面
    gsap.set(el,{x:c.x,y:c.y,translateZ:c.z,rotateX:c.twist*180/Math.PI,rotateY:c.angle*180/Math.PI+90,scale:.7,opacity:.5})
  })
  if(mobius)gsap.set(mobius,{rotateX:-10})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2},
  })

  // ∞ 莫比乌斯环旋转 — 整体绕Y轴 + 卡片沿环流动
  els.forEach((el,i)=>{
    const c=cards[i]
    const newAngle = c.angle + Math.PI * 3 // 沿环转1.5圈
    const newTwist = c.twist + Math.PI * 1.5
    const nx = Math.cos(newAngle) * RING_R
    const nz = Math.sin(newAngle) * RING_R
    master.to(el,{
      x:nx, translateZ:nz,
      rotateY:(newAngle*180/Math.PI)+90,
      rotateX:(newTwist*180/Math.PI),
      scale:.85, opacity:.8,
      duration:6, ease:'sine.inOut',
    }, 0)
  })

  // 整体倾斜
  if(mobius){master.to(mobius,{rotateX:-10,rotateY:0,duration:1},0);master.to(mobius,{rotateX:8,rotateY:25,duration:3,ease:'sine.inOut'},1);master.to(mobius,{rotateX:-5,rotateY:-20,duration:3,ease:'sine.inOut'},4)}
  if(ringGlow.value)master.to(ringGlow.value,{scale:1.4,opacity:.5,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupMobiusGallery()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.mb-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0c0e1a 0%,#040510 60%,#010208 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.mb-ring-glow{position:absolute;width:35vw;height:15vw;top:40vh;left:32vw;border-radius:50%;background:radial-gradient(ellipse,rgba(100,200,180,.08) 0%,transparent 60%);filter:blur(50px);pointer-events:none;z-index:0;will-change:transform,opacity}
.mb-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(80,180,160,.12)}}
.mb-track{position:relative;width:100%}.mb-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.mb-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.mb-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(100,200,180,.7);background:rgba(40,160,140,.08);backdrop-filter:blur(8px);border:1px solid rgba(60,180,160,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.mb-title{margin:0;display:flex;justify-content:center;gap:.08em}
.mb-title__c{display:inline-block;font-size:clamp(1.9rem,4.5vw,3.8rem);font-weight:900;color:#50c8b0;will-change:transform,opacity;&--mobius{background:linear-gradient(135deg,#50c8b0,#60b0e0,#80d0c0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 16px rgba(60,200,170,.5))}}
.mb-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#50c8b0,#60b0e0,#80d0c0,transparent)}
.mb-sub{margin:0;font-size:clamp(.58rem,.82vw,.7rem);color:rgba(60,180,160,.3);max-width:560px;margin-inline:auto}
.mb-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 50%;will-change:transform,opacity}
.mb-mobius{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.mb-card{position:absolute;width:min(11vw,88px);height:min(8vw,66px);margin-left:calc(min(11vw,88px) / -2);margin-top:calc(min(8vw,66px) / -2);transform-style:preserve-3d;will-change:transform,opacity;border-radius:4px;overflow:hidden;box-shadow:0 0 14px rgba(0,0,0,.3);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__glow{position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06);border-radius:4px;pointer-events:none}
}

.mb-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.mb-info__dot{width:6px;height:6px;border-radius:50%;background:#50c8b0;box-shadow:0 0 14px rgba(60,200,170,.6);animation:mb-pulse 2s ease-in-out infinite}
@keyframes mb-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.mb-info__text{font-size:.6rem;font-weight:600;color:rgba(70,200,170,.6);letter-spacing:.1em}
.mb-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(40,160,140,.05)}
.mb-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#50c8b0,#60b0e0,#80d0c0,#50c8b0);background-size:200% 100%;box-shadow:0 0 12px rgba(60,200,170,.5)}
@media(max-width:768px){.mb-header{top:2vh}.mb-kicker{font-size:.38rem;padding:.1rem .4rem}.mb-title__c{font-size:1.2rem}}
</style>
