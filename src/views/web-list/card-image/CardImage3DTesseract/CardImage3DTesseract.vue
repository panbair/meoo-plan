<template>
  <section ref="rootRef" class="ts-root">
    <div ref="hyperGlow" class="ts-hyper"></div>
    <div ref="dimGlow" class="ts-dim"></div>

    <div ref="scrollRef" class="ts-scroll">
      <div ref="trackRef" class="ts-track" :style="{ height: trackHeight }">
        <div class="ts-sticky">

          <header ref="headerRef" class="ts-header">
            <span class="ts-kicker">🔮 CSS3 3D Tesseract · 超立方体 ◈</span>
            <h1 class="ts-title">
              <span ref="tc1" class="ts-title__c">超</span><span ref="tc2" class="ts-title__c ts-title__c--hyper">立</span>
              <span ref="tc3" class="ts-title__c">方</span><span ref="tc4" class="ts-title__c ts-title__c--hyper">体</span>
            </h1>
            <div ref="lineRef" class="ts-line"></div>
            <p class="ts-sub">向下滚动 · 4D超立方体在3D空间旋转投影 · 8个立方体单元 · 各面贴图</p>
          </header>

          <div ref="sceneRef" class="ts-scene">
            <div ref="tesseractRef" class="ts-tesseract">
              <!-- 8个立方体单元 — 内层+外层各4个 -->
              <div v-for="cell in cells" :key="cell.id"
                :ref="(el)=>setCellRef(el as HTMLElement, cell.id)"
                class="ts-cell" :class="[`ts-cell--${cell.layer}`]"
              >
                <!-- 6面各贴一张图 -->
                <div class="ts-face ts-face--f">
                  <img :src="cell.images[0]" class="ts-face__img" />
                </div>
                <div class="ts-face ts-face--b">
                  <img :src="cell.images[1]" class="ts-face__img" />
                </div>
                <div class="ts-face ts-face--r">
                  <img :src="cell.images[2]" class="ts-face__img" />
                </div>
                <div class="ts-face ts-face--l">
                  <img :src="cell.images[3]" class="ts-face__img" />
                </div>
                <div class="ts-face ts-face--t">
                  <img :src="cell.images[4]" class="ts-face__img" />
                </div>
                <div class="ts-face ts-face--bo">
                  <img :src="cell.images[5]" class="ts-face__img" />
                </div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="ts-info">
            <span class="ts-info__dot"></span><span class="ts-info__text">{{ rotationAxis }}</span>
          </div>
          <div class="ts-progress"><div ref="progRef" class="ts-progress__fill"></div></div>
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

const trackHeight = `${8 * 100}vh`
const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=200&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=200&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=200&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&q=80',
]

// 8个单元 = 内层4个 + 外层4个
const cells = Array.from({length:8},(_,i)=>{
  const layer = i < 4 ? 'inner' : 'outer'
  const offset = i < 4 ? 50 : 110
  const sign = i % 2 === 0 ? 1 : -1
  let cx = 0, cy = 0, cz = 0
  if (i === 0 || i === 4) { cx = offset * (i<4?1:1); cz = 0 }
  else if (i === 1 || i === 5) { cx = -offset; cz = 0 }
  else if (i === 2 || i === 6) { cz = offset; cx = 0 }
  else { cz = -offset; cx = 0 }
  const imgs = Array.from({length:6},(_,j)=>imgPool[(i*6+j)%imgPool.length])
  return {id:i, layer, cx, cy, cz, images:imgs}
})

const rotationAxis=ref('XY旋转')
const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const tesseractRef=ref<HTMLElement|null>(null)
const hyperGlow=ref<HTMLElement|null>(null);const dimGlow=ref<HTMLElement|null>(null)
const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const cellRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setCellRef(el:HTMLElement|null,idx:number){cellRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,z:-600,scale:0,rotateX:90},{autoAlpha:1,z:0,scale:1,rotateX:0,duration:.8,stagger:.12,ease:'back.out(3)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-30,rotateY:-20,scale:.2},{autoAlpha:1,rotateX:-20,rotateY:30,scale:1,duration:1.3,ease:'power4.out'},'-.5')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupTesseract(){
  if(!scrollRef.value||!trackRef.value||!tesseractRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=cellRefs.value.filter(Boolean) as HTMLElement[]
  const tess=tesseractRef.value

  // 初始定位：内层4个+外层4个
  els.forEach((el,i)=>{
    const c=cells[i]
    gsap.set(el,{x:c.cx,y:c.cy,translateZ:c.cz,scale:c.layer==='inner'?.7:1,opacity:c.layer==='inner'?.5:.8})
  })
  if(tess)gsap.set(tess,{rotateX:-20,rotateY:30})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){
        if(self.progress<.33)rotationAxis.value='XY平面旋转'
        else if(self.progress<.66)rotationAxis.value='XZ平面旋转'
        else rotationAxis.value='YZ平面旋转'
      },
    },
  })

  // 🔮 超立方体旋转 — 内外层在不同轴向上旋转
  const innerCells=els.slice(0,4);const outerCells=els.slice(4,8)

  // 外层绕Y+Z旋转
  outerCells.forEach(el=>{
    for(let w=0;w<3;w++){master.to(el,{rotateY:30+w*40,rotateZ:15,duration:2,ease:'sine.inOut'},w*2.5);master.to(el,{rotateY:-20+w*40,rotateZ:-10,duration:2,ease:'sine.inOut'},w*2.5+2)}
  })
  // 内层绕X+Z反向旋转
  innerCells.forEach(el=>{
    for(let w=0;w<3;w++){master.to(el,{rotateX:40+w*50,rotateZ:-15,duration:2,ease:'sine.inOut'},w*2.5);master.to(el,{rotateX:-25+w*50,rotateZ:10,duration:2,ease:'sine.inOut'},w*2.5+2)}
  })

  // 整体旋转展示4D投影
  if(tess){master.to(tess,{rotateX:-20,rotateY:30,duration:1},0);master.to(tess,{rotateX:15,rotateY:-25,duration:3.5,ease:'sine.inOut'},1);master.to(tess,{rotateX:-10,rotateY:35,rotateZ:15,duration:3.5,ease:'sine.inOut'},4.5)}

  if(hyperGlow.value)master.to(hyperGlow.value,{scale:1.5,opacity:.5,duration:7},0)
  if(dimGlow.value)master.to(dimGlow.value,{rotate:45,opacity:.4,duration:7},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:7},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupTesseract()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.ts-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0a0c1a 0%,#040510 60%,#010204 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.ts-hyper{position:absolute;width:28vw;height:28vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(160,120,240,.12) 0%,rgba(80,180,240,.06) 30%,transparent 60%);filter:blur(60px);pointer-events:none;z-index:0;will-change:transform,opacity}
.ts-dim{position:absolute;width:25vw;height:25vw;top:50%;left:50%;transform:translate(-50%,-50%) rotate(30deg);border:1px solid rgba(180,140,240,.04);border-radius:50%;pointer-events:none;z-index:0;will-change:transform,opacity}
.ts-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(160,120,240,.12)}}
.ts-track{position:relative;width:100%}.ts-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.ts-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.ts-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(180,150,240,.7);background:rgba(120,60,200,.08);backdrop-filter:blur(8px);border:1px solid rgba(140,80,220,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.ts-title{margin:0;display:flex;justify-content:center;gap:.08em}
.ts-title__c{display:inline-block;font-size:clamp(1.9rem,4.5vw,3.8rem);font-weight:900;color:#b098e0;will-change:transform,opacity;&--hyper{background:linear-gradient(135deg,#b098e0,#60a0f0,#d080f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 18px rgba(160,130,230,.6))}}
.ts-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#b098e0,#60a0f0,#d080f0,transparent)}
.ts-sub{margin:0;font-size:clamp(.58rem,.82vw,.7rem);color:rgba(150,130,220,.3);max-width:550px;margin-inline:auto}
.ts-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:800px;perspective-origin:50% 50%;will-change:transform,opacity}
.ts-tesseract{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.ts-cell{position:absolute;width:min(10vw,80px);height:min(10vw,80px);margin-left:calc(min(10vw,80px) / -2);margin-top:calc(min(10vw,80px) / -2);transform-style:preserve-3d;will-change:transform,opacity;
  .ts-face{position:absolute;width:100%;height:100%;backface-visibility:hidden;overflow:hidden;border-radius:2px;box-shadow:0 0 8px rgba(0,0,0,.2);
    &__img{width:100%;height:100%;object-fit:cover;display:block}
    &--f{transform:translateZ(40px)}&--b{transform:translateZ(-40px) rotateY(180deg)}
    &--r{transform:translateX(40px) rotateY(90deg)}&--l{transform:translateX(-40px) rotateY(-90deg)}
    &--t{transform:translateY(-40px) rotateX(90deg)}&--bo{transform:translateY(40px) rotateX(-90deg)}
  }
  &--inner .ts-face{&--f{transform:translateZ(25px)}&--b{transform:translateZ(-25px) rotateY(180deg)}&--r{transform:translateX(25px) rotateY(90deg)}&--l{transform:translateX(-25px) rotateY(-90deg)}&--t{transform:translateY(-25px) rotateX(90deg)}&--bo{transform:translateY(25px) rotateX(-90deg)}}
}

.ts-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.ts-info__dot{width:6px;height:6px;border-radius:50%;background:#b098e0;box-shadow:0 0 14px rgba(160,130,230,.6);animation:ts-pulse 2s ease-in-out infinite}
@keyframes ts-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.ts-info__text{font-size:.6rem;font-weight:600;color:rgba(170,140,230,.6);letter-spacing:.1em}
.ts-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(140,80,220,.05)}
.ts-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#b098e0,#60a0f0,#d080f0,#b098e0);background-size:200% 100%;box-shadow:0 0 12px rgba(160,130,230,.5)}
@media(max-width:768px){.ts-header{top:2vh}.ts-kicker{font-size:.38rem;padding:.1rem .4rem}.ts-title__c{font-size:1.2rem}}
</style>
