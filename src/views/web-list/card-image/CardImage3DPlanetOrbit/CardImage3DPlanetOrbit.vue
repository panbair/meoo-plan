<template>
  <section ref="rootRef" class="orb-root">
    <div ref="starField" class="orb-stars"></div>
    <div ref="sunGlow" class="orb-sun-glow"></div>

    <div ref="scrollRef" class="orb-scroll">
      <div ref="trackRef" class="orb-track" :style="{ height: trackHeight }">
        <div class="orb-sticky">

          <header ref="headerRef" class="orb-header">
            <span class="orb-kicker">🪐 CSS3 3D Planet Orbit · 行星轨道 ◈</span>
            <h1 class="orb-title">
              <span ref="tc1" class="orb-title__c">行</span>
              <span ref="tc2" class="orb-title__c orb-title__c--orbit">星</span>
              <span ref="tc3" class="orb-title__c">轨</span>
              <span ref="tc4" class="orb-title__c orb-title__c--orbit">道</span>
            </h1>
            <div ref="lineRef" class="orb-line"></div>
            <p class="orb-sub">向下滚动 · 7颗图片行星绕日运行 · 椭圆轨道 · 各速不同 · 3D倾斜</p>
          </header>

          <div ref="sceneRef" class="orb-scene">
            <div ref="systemRef" class="orb-system">
              <!-- ☀️ 中心恒星 — 大图片 -->
              <div ref="sunRef" class="orb-sun">
                <img :src="sunImage" alt="太阳" class="orb-sun__img" />
                <div class="orb-sun__corona"></div>
              </div>

              <!-- 行星 — 各在3D椭圆轨道上 -->
              <div
                v-for="planet in planets"
                :key="planet.id"
                :ref="(el)=>setPlanetRef(el as HTMLElement, planet.id)"
                class="orb-planet"
              >
                <div class="orb-planet__body">
                  <img :src="planet.image" :alt="planet.name" class="orb-planet__img" />
                  <div class="orb-planet__atmo"></div>
                </div>
                <div class="orb-planet__label">{{ planet.name }}</div>
                <!-- 轨道环 -->
                <div class="orb-planet__trail" :style="{ width: planet.orbitRx*2+'px', height: planet.orbitRy*2+'px' }"></div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="orb-info">
            <span class="orb-info__icon">🪐</span>
            <span class="orb-info__text">轨道周期 {{ currentOrbit }}</span>
          </div>

          <div class="orb-progress"><div ref="progRef" class="orb-progress__fill"></div></div>
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
//  CardImage3DPlanetOrbit — CSS3 3D 行星轨道
//
//  核心概念：7颗图片"行星"在3D椭圆轨道上绕核心恒星运行
//  1. 中心是一张大图（恒星），周围7颗小图（行星）
//  2. 每颗行星有独立的椭圆轨道（不同半径、不同离心率）
//  3. 用户竖滚 → 所有行星沿轨道公转 + 系统整体旋转
//  4. 远近不同的轨道速度和角速度各不同（开普勒定律视觉化）
//  5. 场景以3D倾斜视角展示轨道平面
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const sunImage = 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&q=80'
const PLANET_COUNT = 7
const trackHeight = `${8 * 100}vh`

const planetData = [
  { name: '水星', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=250&q=80', alt:'水星', size: 36, orbitRx: 100, orbitRy: 85, speed: 4.2, tilt: -3 },
  { name: '金星', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=250&q=80', alt:'金星', size: 48, orbitRx: 150, orbitRy: 130, speed: 3.0, tilt: 5 },
  { name: '地球', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=250&q=80', alt:'地球', size: 50, orbitRx: 205, orbitRy: 180, speed: 2.2, tilt: -2 },
  { name: '火星', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=250&q=80', alt:'火星', size: 42, orbitRx: 265, orbitRy: 235, speed: 1.6, tilt: 7 },
  { name: '木星', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=250&q=80', alt:'木星', size: 68, orbitRx: 340, orbitRy: 300, speed: 1.0, tilt: -4 },
  { name: '土星', image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=250&q=80', alt:'土星', size: 58, orbitRx: 410, orbitRy: 365, speed: 0.7, tilt: 3 },
  { name: '天王星', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=250&q=80', alt:'天王星', size: 52, orbitRx: 480, orbitRy: 430, speed: 0.5, tilt: -6 },
]

const planets = planetData.map((p, i) => ({ id: i, ...p }))
const currentOrbit = ref('')

const rootRef = ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const systemRef=ref<HTMLElement|null>(null);const sunRef=ref<HTMLElement|null>(null)
const starField=ref<HTMLElement|null>(null);const sunGlow=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const planetRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setPlanetRef(el:HTMLElement|null,idx:number){planetRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,scale:0,rotateZ:180},{autoAlpha:1,scale:1,rotateZ:0,duration:.75,stagger:.14,ease:'back.out(3)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-40,scale:.3},{autoAlpha:1,rotateX:-15,scale:1,duration:1.2,ease:'power4.out'},'-.5')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupPlanetOrbit(){
  if(!scrollRef.value||!trackRef.value||!systemRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const system=systemRef.value
  // 系统倾斜 — 轨道面以3D视角呈现
  if(system)gsap.set(system,{rotateX:-55,rotateY:0})

  // 所有行星初始定位在轨道上的起始角度
  const els=planetRefs.value.filter(Boolean) as HTMLElement[]
  els.forEach((el,i)=>{
    const p=planets[i]
    const startAngle=(i*51)*Math.PI/180
    const x=Math.cos(startAngle)*p.orbitRx
    const y=Math.sin(startAngle)*p.orbitRy
    gsap.set(el,{x,y,scale:.85,opacity:.75})
  })

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){currentOrbit.value = `${Math.round(self.progress*10)/10} 圈`},
    },
  })

  // 🪐 每颗行星沿各自椭圆轨道公转
  els.forEach((el,i)=>{
    const p=planets[i]
    const startAngle=(i*51)*Math.PI/180
    const totalAngle=startAngle+Math.PI*2*p.speed*3 // 速度快的转更多圈

    // 用关键帧逼近椭圆轨迹（多段）
    const steps=8
    for(let s=0;s<steps;s++){
      const t0=s/steps;const t1=(s+1)/steps
      const a0=startAngle+(totalAngle-startAngle)*t0
      const a1=startAngle+(totalAngle-startAngle)*t1
      const x0=Math.cos(a0)*p.orbitRx;const y0=Math.sin(a0)*p.orbitRy
      const x1=Math.cos(a1)*p.orbitRx;const y1=Math.sin(a1)*p.orbitRy
      master.to(el,{x:x1,y:y1,duration:.875,ease:'sine.inOut'},t0*7)
    }
    // 缩放在近日点(离恒星近)变大
    for(let s=0;s<steps;s++){
      const t=(s+.5)/steps
      const a=startAngle+(totalAngle-startAngle)*t
      const dist=Math.sqrt(Math.pow(Math.cos(a)*p.orbitRx,2)+Math.pow(Math.sin(a)*p.orbitRy,2))/p.orbitRx
      const scl=.7+dist*.4
      master.to(el,{scale:scl,opacity:.6+dist*.4,duration:.87,ease:'sine.inOut'},t*7)
    }
  })

  // 太阳自转+呼吸
  if(sunRef.value){
    master.to(sunRef.value,{rotateZ:360,duration:7,ease:'sine.inOut'},0)
    for(let i=0;i<4;i++){master.to(sunRef.value,{scale:1.08,duration:.3,ease:'sine.inOut'},i*1.75);master.to(sunRef.value,{scale:1,duration:.35,ease:'sine.inOut'},i*1.75+.3)}
  }

  // 系统整体缓慢旋转
  if(system)master.to(system,{rotateY:30,duration:3.5,ease:'sine.inOut'},0)
  if(system)master.to(system,{rotateY:-20,duration:3.5,ease:'sine.inOut'},3.5)

  if(sunGlow.value)master.to(sunGlow.value,{scale:1.5,opacity:.7,duration:7,ease:'sine.inOut'},0)
  if(starField.value)master.to(starField.value,{scale:1.1,duration:7},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:7},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupPlanetOrbit()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.orb-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0a0e20 0%,#060910 60%,#020408 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif;}
.orb-stars{position:absolute;inset:0;z-index:0;pointer-events:none;background-image:radial-gradient(1px 1px at 15% 20%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 35% 55%,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 55% 15%,rgba(255,255,255,.6),transparent),radial-gradient(1px 1px at 75% 50%,rgba(255,255,255,.4),transparent),radial-gradient(1px 1px at 25% 75%,rgba(255,255,255,.6),transparent),radial-gradient(1px 1px at 65% 30%,rgba(255,255,255,.5),transparent);background-size:250px 180px;will-change:transform;}
.orb-sun-glow{position:absolute;width:25vw;height:25vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,200,80,.35) 0%,rgba(255,150,40,.15) 30%,transparent 60%);filter:blur(70px);pointer-events:none;z-index:0;will-change:transform,opacity;}
.orb-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,180,60,.15)}}
.orb-track{position:relative;width:100%}.orb-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.orb-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.orb-kicker{display:inline-block;font-size:.58rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,180,80,.7);background:rgba(255,150,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(255,160,50,.16);border-radius:999px;padding:.22rem .9rem;margin-bottom:.5rem}
.orb-title{margin:0;display:flex;justify-content:center;gap:.08em}
.orb-title__c{display:inline-block;font-size:clamp(2rem,5vw,4.2rem);font-weight:900;color:#f0a840;will-change:transform,opacity;&--orbit{background:linear-gradient(135deg,#f0b840,#ff8850,#f0d060);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 18px rgba(255,180,60,.6))}}
.orb-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#f0b840,#ff8850,#f0d060,transparent);transform-origin:center}
.orb-sub{margin:0;font-size:clamp(.64rem,.9vw,.78rem);color:rgba(240,170,60,.3);max-width:550px;margin-inline:auto}
.orb-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:800px;perspective-origin:50% 50%;will-change:transform,opacity}
.orb-system{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

// ☀️ 恒星
.orb-sun{position:absolute;width:min(18vw,150px);height:min(18vw,150px);margin-left:calc(min(18vw,150px)/-2);margin-top:calc(min(18vw,150px)/-2);transform-style:preserve-3d;border-radius:50%;overflow:hidden;box-shadow:0 0 60px rgba(255,180,60,.5),0 0 120px rgba(255,150,40,.3);will-change:transform;z-index:20;&__img{width:100%;height:100%;object-fit:cover;display:block}&__corona{position:absolute;inset:-8px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,80,.3) 60%,transparent 75%);pointer-events:none}}

// 🪐 行星
.orb-planet{position:absolute;top:0;left:0;transform-style:preserve-3d;will-change:transform;z-index:10;
  &__body{border-radius:50%;overflow:hidden;box-shadow:0 0 20px rgba(0,0,0,.3);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
  &__img{display:block;}
  &__atmo{position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 12px rgba(255,255,255,.1);pointer-events:none}
  &__label{position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:.46rem;font-weight:600;color:rgba(255,200,140,.5);letter-spacing:.12em;white-space:nowrap}
  &__trail{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(255,255,255,.04);pointer-events:none}
}
.orb-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.orb-info__icon{font-size:.9rem}.orb-info__text{font-size:.6rem;font-weight:600;color:rgba(255,180,80,.6);letter-spacing:.1em}
.orb-progress{position:absolute;left:0;bottom:0;z-index:30;width:100%;height:3px;background:rgba(255,160,40,.05)}
.orb-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#f0b840,#ff8850,#f0d060,#f0b840);background-size:200% 100%;box-shadow:0 0 14px rgba(255,180,80,.6)}
@media(max-width:768px){.orb-header{top:2vh}.orb-kicker{font-size:.42rem;padding:.1rem .4rem}.orb-title__c{font-size:1.3rem}}
</style>
