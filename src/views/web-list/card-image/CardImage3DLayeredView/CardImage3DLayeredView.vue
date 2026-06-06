<template>
  <section ref="rootRef" class="lv-root">
    <div ref="depthFog" class="lv-fog"></div>

    <div ref="scrollRef" class="lv-scroll">
      <div ref="trackRef" class="lv-track" :style="{ height: trackHeight }">
        <div class="lv-sticky">

          <header ref="headerRef" class="lv-header">
            <span class="lv-kicker">🪟 CSS3 3D Layered View · 层次窗景 ◈</span>
            <h1 class="lv-title">
              <span ref="tc1" class="lv-title__c">层</span><span ref="tc2" class="lv-title__c lv-title__c--layer">次</span>
              <span ref="tc3" class="lv-title__c">窗</span><span ref="tc4" class="lv-title__c lv-title__c--layer">景</span>
            </h1>
            <div ref="lineRef" class="lv-line"></div>
            <p class="lv-sub">向下滚动 · 5层图片在不同Z深度层叠 · 每层错位不遮挡 · 深远通透</p>
          </header>

          <div ref="sceneRef" class="lv-scene">
            <div ref="layersRef" class="lv-layers">
              <!-- 5层 — 从远到近 -->
              <div v-for="(layer, idx) in layers" :key="idx"
                :ref="(el)=>setLayerRef(el as HTMLElement, idx)"
                class="lv-layer"
              >
                <div class="lv-layer__panel">
                  <img :src="layer.image" :alt="layer.title" class="lv-layer__img" />
                  <div class="lv-layer__vignette"></div>
                </div>
                <div class="lv-layer__label">{{ layer.title }}</div>
                <!-- 层间连接虚线 -->
                <div v-if="idx < layers.length-1" class="lv-layer__connector">
                  <span v-for="d in 4" :key="d" class="lv-layer__connector-dot"></span>
                </div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="lv-info">
            <span class="lv-info__dot"></span><span class="lv-info__text">当前层: {{ layers[currentLayer]?.title }}</span>
          </div>
          <div class="lv-progress"><div ref="progRef" class="lv-progress__fill"></div></div>
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

const LAYER_COUNT = 5
const trackHeight = `${(LAYER_COUNT+2)*100}vh`

const layers = [
  {title:'远山', image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80'},
  {title:'林间', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80'},
  {title:'花前', image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80'},
  {title:'海滨', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80'},
  {title:'星空', image:'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80'},
]

const currentLayer=ref(0)
const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const layersRef=ref<HTMLElement|null>(null)
const depthFog=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const layerRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setLayerRef(el:HTMLElement|null,idx:number){layerRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,y:80,filter:'blur(14px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.6,stagger:.1,ease:'power3.out'},'-.4')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.25')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-10,scale:.5},{autoAlpha:1,rotateX:-3,scale:1,duration:1,ease:'power4.out'},'-.4')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupLayeredView(){
  if(!scrollRef.value||!trackRef.value||!layersRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=layerRefs.value.filter(Boolean) as HTMLElement[]
  const container=layersRef.value

  // 🪟 5层错位排列 — 每层在Z轴不同深度 + XY偏移不遮挡
  const offsets = [
    {x:0,y:0,z:-300,scale:.6,opacity:.35},    // 最远
    {x:30,y:-15,z:-180,scale:.7,opacity:.55},
    {x:-20,y:10,z:-80,scale:.8,opacity:.75},  // 中间
    {x:15,y:-5,z:0,scale:.9,opacity:.9},
    {x:-10,y:5,z:80,scale:1,opacity:1},       // 最近
  ]
  els.forEach((el,i)=>{gsap.set(el,{x:offsets[i].x,y:offsets[i].y,translateZ:offsets[i].z,scale:offsets[i].scale,opacity:offsets[i].opacity})})
  if(container)gsap.set(container,{rotateX:-3})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.3,
      onUpdate(self){currentLayer.value=Math.min(LAYER_COUNT-1,Math.max(0,Math.floor(self.progress*LAYER_COUNT)))},
    },
  })

  // 层次推进 — 所有层向相机移动+展开
  const totalAdvance = 500
  els.forEach((el,i)=>{
    const o=offsets[i]
    master.fromTo(el,
      {translateZ:o.z,scale:o.scale,opacity:o.opacity},
      {translateZ:o.z+totalAdvance,scale:Math.min(1.1,o.scale+.3),opacity:Math.min(1,o.opacity+.25),duration:LAYER_COUNT+2,ease:'power2.in'},
      0
    )
    // 每层到位后微侧移 — 展现层次
    master.to(el,{x:o.x+(i%2?12:-12),duration:1.5,ease:'sine.inOut'},LAYER_COUNT*.8+i*.3)
  })

  // 整体旋转 — 层叠关系更清晰
  if(container){master.to(container,{rotateY:12,rotateX:-6,duration:3,ease:'sine.inOut'},1);master.to(container,{rotateY:-8,rotateX:2,duration:3,ease:'sine.inOut'},4)}
  if(depthFog.value)master.to(depthFog.value,{opacity:.4,duration:LAYER_COUNT+2},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:LAYER_COUNT+2},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupLayeredView()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.lv-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:linear-gradient(175deg,#0e101a 0%,#141820 20%,#10141c 40%,#161a22 60%,#0e1018 80%,#0e101a 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.lv-fog{position:absolute;width:35vw;height:30vw;top:25vh;left:32vw;border-radius:50%;background:radial-gradient(ellipse,rgba(100,140,200,.05) 0%,transparent 60%);filter:blur(60px);pointer-events:none;z-index:0;will-change:opacity;opacity:.2}
.lv-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(120,160,200,.08)}}
.lv-track{position:relative;width:100%}.lv-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.lv-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.lv-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.28em;color:rgba(140,180,220,.7);background:rgba(80,140,220,.08);backdrop-filter:blur(8px);border:1px solid rgba(100,160,220,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.lv-title{margin:0;display:flex;justify-content:center;gap:.08em}
.lv-title__c{display:inline-block;font-size:clamp(1.8rem,4.5vw,3.8rem);font-weight:900;color:#80b0d8;will-change:transform,opacity;&--layer{background:linear-gradient(135deg,#80b0d8,#6098c0,#a0c8e8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 12px rgba(100,160,220,.4))}}
.lv-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#80b0d8,#6098c0,#a0c8e8,transparent)}
.lv-sub{margin:0;font-size:clamp(.58rem,.82vw,.7rem);color:rgba(100,150,210,.3);max-width:530px;margin-inline:auto}
.lv-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:700px;perspective-origin:50% 50%;will-change:transform,opacity}
.lv-layers{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.lv-layer{position:absolute;width:min(30vw,250px);height:min(22vw,185px);margin-left:calc(min(30vw,250px) / -2);margin-top:calc(min(22vw,185px) / -2);transform-style:preserve-3d;will-change:transform,opacity;
  &__panel{width:100%;height:100%;border-radius:6px;overflow:hidden;box-shadow:0 6px 28px rgba(0,0,0,.25)}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__vignette{position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(10,15,25,.3) 100%);pointer-events:none}
  &__label{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);font-size:.5rem;font-weight:600;color:rgba(140,180,220,.5);letter-spacing:.1em;white-space:nowrap}
  // 层间连接线
  &__connector{position:absolute;top:50%;right:-20px;width:20px;height:2px;transform:translateY(-50%);display:flex;justify-content:space-between;align-items:center}
  &__connector-dot{width:3px;height:3px;border-radius:50%;background:rgba(140,180,220,.2)}
}

.lv-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.lv-info__dot{width:6px;height:6px;border-radius:50%;background:#80b0d8;box-shadow:0 0 12px rgba(100,160,220,.5);animation:lv-pulse 2s ease-in-out infinite}
@keyframes lv-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2);opacity:.5}}
.lv-info__text{font-size:.6rem;font-weight:600;color:rgba(120,170,220,.6);letter-spacing:.06em}
.lv-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(80,140,210,.05)}
.lv-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#80b0d8,#6098c0,#a0c8e8,#80b0d8);background-size:200% 100%;box-shadow:0 0 10px rgba(100,160,220,.4)}
@media(max-width:768px){.lv-header{top:2vh}.lv-kicker{font-size:.38rem;padding:.1rem .4rem}.lv-title__c{font-size:1.2rem}}
</style>
