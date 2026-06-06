<template>
  <section ref="rootRef" class="wc-root">
    <div ref="breezeGlow" class="wc-breeze"></div>
    <div ref="lightSpec" class="wc-light-speck"></div>

    <div ref="scrollRef" class="wc-scroll">
      <div ref="trackRef" class="wc-track" :style="{ height: trackHeight }">
        <div class="wc-sticky">

          <header ref="headerRef" class="wc-header">
            <span class="wc-kicker">🎐 CSS3 3D Wind Chime · 风铃摇曳 ◈</span>
            <h1 class="wc-title">
              <span ref="tc1" class="wc-title__c">风</span>
              <span ref="tc2" class="wc-title__c wc-title__c--chime">铃</span>
              <span ref="tc3" class="wc-title__c">摇</span>
              <span ref="tc4" class="wc-title__c wc-title__c--chime">曳</span>
            </h1>
            <div ref="lineRef" class="wc-line"></div>
            <p class="wc-sub">向下滚动 · 图片挂在不同长度线上3D摇摆 · 风吹铃动 · 此起彼伏</p>
          </header>

          <div ref="sceneRef" class="wc-scene">
            <div ref="chimeRef" class="wc-chime">
              <!-- 顶环 -->
              <div class="wc-top-ring"></div>
              <!-- 悬挂线+图片风铃片 -->
              <div
                v-for="chime in chimes"
                :key="chime.id"
                :ref="(el)=>setChimeRef(el as HTMLElement, chime.id)"
                class="wc-hanger"
              >
                <!-- 线 -->
                <div class="wc-hanger__cord"></div>
                <!-- 图片片 -->
                <div class="wc-hanger__blade">
                  <img :src="chime.image" :alt="chime.alt" class="wc-hanger__img" />
                  <div class="wc-hanger__edge"></div>
                </div>
                <!-- 底部坠子 -->
                <div class="wc-hanger__weight"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="wc-info">
            <span class="wc-info__icon">🎐</span>
            <span class="wc-info__text">风力 {{ windLevel }}</span>
          </div>

          <div class="wc-progress"><div ref="progRef" class="wc-progress__fill"></div></div>
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

const CHIME_COUNT = 16
const trackHeight = `${7 * 100}vh`

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=250&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=250&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=250&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=250&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=250&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=250&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=250&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=250&q=80',
]

const chimes = Array.from({ length: CHIME_COUNT }, (_, i) => {
  const angle = (i / CHIME_COUNT) * Math.PI * 2
  const radius = min(24, 200) as number
  return {
    id: i,
    angle,
    x: Math.cos(angle) * 160,
    z: Math.sin(angle) * 160,
    cordLen: 100 + (i % 3) * 45 + Math.random() * 20, // 不同长度
    image: imgPool[i % imgPool.length],
    alt: `风铃片${i}`,
    swayDelay: Math.random() * 2,
  }
})
// workaround for SCSS $var issue
function min(a: number, _b: number) { return Math.min(a, _b) }

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const chimeRef=ref<HTMLElement|null>(null)
const breezeGlow=ref<HTMLElement|null>(null);const lightSpec=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const windLevel=ref('微风')
const chimeRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setChimeRef(el:HTMLElement|null,idx:number){chimeRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:80,filter:'blur(16px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.65,stagger:.1,ease:'power3.out'},'-.45')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-20,scale:.5},{autoAlpha:1,rotateX:-6,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupWindChime(){
  if(!scrollRef.value||!trackRef.value||!chimeRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=chimeRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：静止悬挂
  els.forEach((el,i)=>{
    const c=chimes[i]
    gsap.set(el,{x:c.x,translateZ:c.z,rotateX:0,rotateY:0,transformOrigin:'50% 0%'})
  })

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){
        if(self.progress<.2)windLevel.value='微风 🌬'
        else if(self.progress<.5)windLevel.value='清风 🍃'
        else if(self.progress<.8)windLevel.value='劲风 💨'
        else windLevel.value='狂风 🌪'
      },
    },
  })

  // 🎐 风铃摇摆：每根绕顶部悬挂点摆动
  els.forEach((el,i)=>{
    const c=chimes[i]
    const amp=(i%3===0?12:i%3===1?20:28) // 不同长度不同摆幅
    const period=1.5+(i%3)*.8

    // 持续摆动
    for(let w=0;w<8;w++){
      master.to(el,{rotateX:amp,duration:period*.5,ease:'sine.inOut'},w*period*.5+c.swayDelay*.3)
      master.to(el,{rotateX:-amp*.7,duration:period*.5,ease:'sine.inOut'},(w+.5)*period*.5+c.swayDelay*.3)
    }
    // Z轴微摆
    for(let w=0;w<6;w++){
      master.to(el,{translateZ:c.z+15,duration:1.2,ease:'sine.inOut'},w*2.4+c.swayDelay*.5)
      master.to(el,{translateZ:c.z-10,duration:1.2,ease:'sine.inOut'},(w+.5)*2.4+c.swayDelay*.5)
    }
  })

  if(chimeRef.value){master.to(chimeRef.value,{rotateY:15,duration:3,ease:'sine.inOut'},0);master.to(chimeRef.value,{rotateY:-10,duration:3,ease:'sine.inOut'},3)}
  if(breezeGlow.value)master.to(breezeGlow.value,{x:'8vw',opacity:.5,duration:6},0)
  if(lightSpec.value)master.to(lightSpec.value,{opacity:.4,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupWindChime()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.wc-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(180deg,#e8f0f4 0%,#ecf2f6 30%,#f0f4f8 60%,#e4ecf2 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.wc-breeze{position:absolute;width:40vw;height:25vw;top:20vh;left:15vw;border-radius:50%;background:radial-gradient(ellipse,rgba(180,200,220,.25) 0%,transparent 60%);filter:blur(60px);pointer-events:none;z-index:0;will-change:transform,opacity}
.wc-light-speck{position:absolute;width:10vw;height:10vw;top:10vh;right:20vw;border-radius:50%;background:radial-gradient(circle,rgba(255,255,220,.3) 0%,transparent 50%);filter:blur(30px);pointer-events:none;z-index:0;will-change:opacity;opacity:.2}
.wc-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(160,180,200,.15)}}
.wc-track{position:relative;width:100%}.wc-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.wc-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.wc-kicker{display:inline-block;font-size:.56rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(120,160,190,.7);background:rgba(200,220,240,.4);backdrop-filter:blur(8px);border:1px solid rgba(180,200,220,.25);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.wc-title{margin:0;display:flex;justify-content:center;gap:.08em}
.wc-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#80a8c0;will-change:transform,opacity;&--chime{background:linear-gradient(135deg,#80a8c0,#a0c8d8,#90b8c8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 12px rgba(120,160,200,.4))}}
.wc-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#80a8c0,#a0c8d8,#90b8c8,transparent);transform-origin:center}
.wc-sub{margin:0;font-size:clamp(.62rem,.88vw,.76rem);color:rgba(100,150,180,.3);max-width:530px;margin-inline:auto}
.wc-scene{position:absolute;top:45%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 40%;will-change:transform,opacity}
.wc-chime{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}
.wc-top-ring{position:absolute;width:320px;height:8px;margin-left:-160px;margin-top:-4px;border-radius:50%;background:linear-gradient(180deg,rgba(160,140,100,.5),rgba(120,100,70,.2));box-shadow:0 2px 10px rgba(0,0,0,.1)}

.wc-hanger{position:absolute;width:0;height:0;transform-style:preserve-3d;will-change:transform;
  &__cord{position:absolute;top:0;left:50%;width:1px;height:calc(var(--cord-len,120px) + 0px);margin-left:-.5px;background:linear-gradient(180deg,rgba(180,160,120,.6),rgba(180,160,120,.2));transform-origin:0 0}
  &__blade{position:absolute;top:120px;width:min(10vw,80px);height:min(14vw,110px);margin-left:calc(min(10vw,80px) / -2);border-radius:3px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.1);backface-visibility:hidden}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__edge{position:absolute;inset:0;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.3);pointer-events:none}
  &__weight{position:absolute;top:235px;left:50%;width:8px;height:12px;margin-left:-4px;border-radius:50%;background:radial-gradient(circle,#c0b080,#908050);box-shadow:0 2px 6px rgba(0,0,0,.15)}
}

// 🔑 不同长度的线
.wc-hanger:nth-child(3n+2){.wc-hanger__cord{height:145px}.wc-hanger__blade{top:145px}.wc-hanger__weight{top:260px}}
.wc-hanger:nth-child(3n+3){.wc-hanger__cord{height:170px}.wc-hanger__blade{top:170px}.wc-hanger__weight{top:285px}}

.wc-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.wc-info__icon{font-size:.9rem}.wc-info__text{font-size:.6rem;font-weight:600;color:rgba(120,160,190,.6);letter-spacing:.1em}
.wc-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(140,180,200,.05)}
.wc-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#80a8c0,#a0c8d8,#90b8c8,#80a8c0);background-size:200% 100%;box-shadow:0 0 10px rgba(120,160,200,.5)}
@media(max-width:768px){.wc-header{top:2vh}.wc-kicker{font-size:.4rem;padding:.1rem .4rem}.wc-title__c{font-size:1.3rem}}
</style>
