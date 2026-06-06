<template>
  <section ref="rootRef" class="pop-root">
    <div ref="glowA" class="pop-glow pop-glow--a"></div>
    <div ref="glowB" class="pop-glow pop-glow--b"></div>

    <div ref="scrollRef" class="pop-scroll">
      <div ref="trackRef" class="pop-track" :style="{ height: trackHeight }">
        <div class="pop-sticky">

          <header ref="headerRef" class="pop-header">
            <span class="pop-kicker">📖 CSS3 3D Pop-up Book · 立体弹出书 ◈</span>
            <h1 class="pop-title">
              <span ref="tc1" class="pop-title__c">立</span>
              <span ref="tc2" class="pop-title__c pop-title__c--pop">体</span>
              <span ref="tc3" class="pop-title__c">弹</span>
              <span ref="tc4" class="pop-title__c pop-title__c--pop">出</span>
            </h1>
            <div ref="lineRef" class="pop-line"></div>
            <p class="pop-sub">向下滚动 · 书本打开 · 立体卡片从页面中弹起 · 每页一世界</p>
          </header>

          <div ref="sceneRef" class="pop-scene">
            <div ref="bookRef" class="pop-book">
              <!-- 左页 -->
              <div ref="leftPage" class="pop-page pop-page--left">
                <div class="pop-page__paper">
                  <img :src="spreads[currentSpread]?.leftImage" :alt="spreads[currentSpread]?.leftAlt" class="pop-page__img" />
                </div>
              </div>
              <!-- 右页 -->
              <div ref="rightPage" class="pop-page pop-page--right">
                <div class="pop-page__paper">
                  <img :src="spreads[currentSpread]?.rightImage" :alt="spreads[currentSpread]?.rightAlt" class="pop-page__img" />
                </div>
              </div>
              <!-- 🔑 弹出卡片 — 从书脊处3D立起 -->
              <div
                v-for="card in popupCards"
                :key="card.id"
                :ref="(el) => setCardRef(el as HTMLElement, card.id)"
                class="pop-card"
                :class="[`pop-card--${card.pos}`]"
              >
                <div class="pop-card__stand">
                  <img :src="card.image" :alt="card.alt" class="pop-card__img" />
                  <div class="pop-card__frame"></div>
                </div>
                <!-- 支撑结构 — 连接卡片和页面的"纸支架" -->
                <div class="pop-card__brace"></div>
              </div>
              <!-- 书脊 -->
              <div class="pop-spine"></div>
            </div>
          </div>

          <div ref="infoRef" class="pop-info">
            <span class="pop-info__dot"></span>
            <span class="pop-info__text">{{ spreads[currentSpread]?.title }}</span>
          </div>

          <div class="pop-progress"><div ref="progRef" class="pop-progress__fill"></div></div>
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
//  CardImage3DPopupBook — CSS3 3D 立体弹出书
//
//  核心概念：翻开书页后，图片卡片从页面中3D弹出站立
//  1. 书页在3D空间中打开（左页 rotateY 向左，右页 rotateY 向右）
//  2. 3张立体卡片从书脊处弹起（rotateX 从90°→0°）
//  3. 卡片各有Z轴偏移，形成层叠效果
//  4. 用户竖滚 → 书页翻开 + 卡片弹起 + 视角旋转
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface Spread {
  title: string; leftImage: string; leftAlt: string; rightImage: string; rightAlt: string
}

const spreads: Spread[] = [
  { title: '海洋世界', leftImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', leftAlt: '海滩', rightImage: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80', rightAlt: '海面' },
  { title: '山川大地', leftImage: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', leftAlt: '山谷', rightImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', rightAlt: '麦田' },
  { title: '星空宇宙', leftImage: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&q=80', leftAlt: '星空', rightImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80', rightAlt: '银河' },
  { title: '森林秘境', leftImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', leftAlt: '森林', rightImage: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600&q=80', rightAlt: '极光' },
  { title: '花园锦簇', leftImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80', leftAlt: '花朵', rightImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', rightAlt: '海滩2' },
]

// 3张从书页中弹出的立体卡片
const popupCardImages = [
  { pos: 'center' as const, image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80', alt: '星空卡', zPop: 0 },
  { pos: 'left' as const, image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80', alt: '山谷卡', zPop: -60 },
  { pos: 'right' as const, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', alt: '海滩卡', zPop: 60 },
]
const popupCards = Array.from({ length: 3 }, (_, i) => ({ id: i, ...popupCardImages[i] }))
const currentSpread = ref(0)
const trackHeight = `${ (spreads.length + 2) * 100 }vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const bookRef=ref<HTMLElement|null>(null)
const leftPage=ref<HTMLElement|null>(null);const rightPage=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const glowA=ref<HTMLElement|null>(null);const glowB=ref<HTMLElement|null>(null)
const cardRefs=ref<(HTMLElement|null)[]>([])
const cleanupFns: TweenCleanup[]=[]
function setCardRef(el:HTMLElement|null,idx:number){cardRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,rotateX:90,scale:.2},{autoAlpha:1,rotateX:0,scale:1,duration:.7,stagger:.12,ease:'back.out(2.8)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-30,scale:.5},{autoAlpha:1,rotateX:-10,scale:1,duration:1.1,ease:'power4.out'},'-.5')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupPopupBook(){
  if(!scrollRef.value||!trackRef.value||!bookRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const lp=leftPage.value;const rp=rightPage.value
  const cards=cardRefs.value.filter(Boolean) as HTMLElement[]

  // 🔑 transform-origin: 页面沿书脊旋转
  if(lp)gsap.set(lp,{transformOrigin:'100% 50%',rotateY:0})
  if(rp)gsap.set(rp,{transformOrigin:'0% 50%',rotateY:0})
  // 弹出卡片初始折叠 (rotateX: -90° 贴在页面上)
  cards.forEach(el=>gsap.set(el,{transformOrigin:'50% 100%',rotateX:-90,translateZ:0}))

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){currentSpread.value=Math.min(spreads.length-1,Math.max(0,Math.round(self.progress*(spreads.length-1))))},
    },
  })

  // 📖 书页翻开（通过整体book的Z旋转来模拟翻页）
  if(lp)master.to(lp,{rotateY:-150,duration:2,ease:'power2.inOut'},0)
  if(rp)master.to(rp,{rotateY:150,duration:2,ease:'power2.inOut'},0)

  // 🎴 立体卡片弹起（从折叠→站立）
  const cardTargets=[{rx:-5,z:-60},{rx:0,z:0},{rx:5,z:60}]
  cards.forEach((el,i)=>{
    const t=cardTargets[i]
    master.fromTo(el,{rotateX:-90,translateZ:0},{rotateX:t.rx,translateZ:t.z,duration:2.5,ease:'back.out(1.8)'},0.5+i*0.2)
    // 弹跳
    master.to(el,{rotateX:t.rx+4,duration:.2,ease:'sine.inOut'},3+i*.15)
    master.to(el,{rotateX:t.rx,duration:.3,ease:'sine.inOut'},3.2+i*.15)
  })

  // 视角变化
  if(bookRef.value){
    master.to(bookRef.value,{rotateX:-12,rotateY:5,duration:2,ease:'sine.inOut'},0)
    master.to(bookRef.value,{rotateX:8,rotateY:-8,duration:2,ease:'sine.inOut'},2.5)
    master.to(bookRef.value,{rotateX:0,rotateY:0,duration:1,ease:'power2.out'},4.5)
  }

  if(glowA.value)master.to(glowA.value,{scale:1.4,opacity:.6,duration:5},0)
  if(glowB.value)master.to(glowB.value,{scale:1.3,opacity:.5,duration:5},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:5},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupPopupBook()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.pop-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(170deg,#faf6f0 0%,#f8f2e8 20%,#fcf7f2 40%,#f6f0e6 60%,#faf4ec 80%,#f9f3ea 100%);font-family:'Inter','PingFang SC','Microsoft YaHei','Georgia',serif;}
.pop-glow{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0;will-change:transform,opacity;&--a{width:40vw;height:30vw;top:15vh;left:15vw;background:radial-gradient(ellipse,rgba(255,200,140,.2) 0%,transparent 70%);}&--b{width:35vw;height:25vw;bottom:10vh;right:10vw;background:radial-gradient(ellipse,rgba(200,180,140,.15) 0%,transparent 70%);}}
.pop-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px;}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(200,160,100,.15);}}
.pop-track{position:relative;width:100%;}.pop-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden;}
.pop-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px);}
.pop-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(180,130,70,.75);background:rgba(200,140,80,.08);backdrop-filter:blur(8px);border:1px solid rgba(200,140,70,.16);border-radius:999px;padding:.22rem 1rem;margin-bottom:.5rem;}
.pop-title{margin:0;display:flex;justify-content:center;gap:.08em;}
.pop-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#b87840;will-change:transform,opacity;&--pop{background:linear-gradient(135deg,#d4a060,#c08040,#e8c880);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(200,150,80,.5));}}
.pop-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#d4a060,#e8c880,#d4a060,transparent);transform-origin:center;}
.pop-sub{margin:0;font-size:clamp(.64rem,.9vw,.78rem);color:rgba(170,120,60,.35);max-width:530px;margin-inline:auto;}

.pop-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:1000px;perspective-origin:50% 50%;will-change:transform,opacity;}
.pop-book{position:relative;transform-style:preserve-3d;will-change:transform;}

$pageW:min(36vw,300px);$pageH:min(28vw,230px);
.pop-page{position:absolute;top:0;width:$pageW;height:$pageH;margin-top:calc($pageH / -2);transform-style:preserve-3d;backface-visibility:hidden;will-change:transform;
  &--left{left:0;margin-left:calc($pageW / -2);}
  &--right{right:0;margin-left:calc($pageW/2);}
  &__paper{width:100%;height:100%;border-radius:3px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,.12),inset 0 0 0 1px rgba(0,0,0,.04);background:#fefaf5;}
  &__img{width:100%;height:100%;object-fit:cover;display:block;}
}
.pop-spine{position:absolute;left:50%;top:0;width:4px;height:$pageH;margin-top:calc($pageH / -2);margin-left:-2px;background:linear-gradient(90deg,#c8a870,#e8d0a0,#c8a870);border-radius:1px;z-index:20;}

// 🔑 弹出卡片
.pop-card{position:absolute;bottom:0;left:50%;width:min(16vw,130px);height:min(18vw,150px);margin-left:calc(min(16vw,130px)/-2);transform-style:preserve-3d;will-change:transform;
  &--center{margin-bottom:calc($pageH / 2 + 30px);}
  &--left{margin-bottom:calc($pageH / 2 + 20px);margin-left:calc(min(16vw,130px) / -2 - 70px);}
  &--right{margin-bottom:calc($pageH / 2 + 20px);margin-left:calc(min(16vw,130px) / -2 + 70px);}
  &__stand{width:100%;height:100%;border-radius:4px;overflow:hidden;backface-visibility:hidden;box-shadow:0 8px 30px rgba(0,0,0,.2),0 0 0 2px rgba(200,150,80,.25);}
  &__img{width:100%;height:100%;object-fit:cover;display:block;}
  &__frame{position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);pointer-events:none;}
  &__brace{position:absolute;bottom:-20px;left:50%;width:2px;height:20px;margin-left:-1px;background:rgba(200,150,80,.3);transform:rotateX(90deg);transform-origin:top;}
}

.pop-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none;}
.pop-info__dot{width:6px;height:6px;border-radius:50%;background:#d4a060;box-shadow:0 0 12px rgba(200,150,80,.6);animation:pop-pulse 2s ease-in-out infinite;}
@keyframes pop-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.pop-info__text{font-size:.62rem;font-weight:600;color:rgba(180,130,70,.6);letter-spacing:.1em;}
.pop-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(200,140,70,.05);}
.pop-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#d4a060,#e8c880,#d4a060);background-size:200% 100%;box-shadow:0 0 10px rgba(200,150,80,.5);}
@media(max-width:768px){.pop-header{top:2vh}.pop-kicker{font-size:.42rem;padding:.1rem .4rem}.pop-title__c{font-size:1.3rem}}
</style>
