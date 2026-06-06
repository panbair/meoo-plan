<template>
  <section ref="rootRef" class="im-root">
    <div ref="frameGlow" class="im-frame"></div>

    <div ref="scrollRef" class="im-scroll">
      <div ref="trackRef" class="im-track" :style="{ height: trackHeight }">
        <div class="im-sticky">

          <header ref="headerRef" class="im-header">
            <span class="im-kicker">🪞 CSS3 3D Infinity Mirror · 无限镜渊 ◈</span>
            <h1 class="im-title">
              <span ref="tc1" class="im-title__c">无</span><span ref="tc2" class="im-title__c im-title__c--mirror">限</span>
              <span ref="tc3" class="im-title__c">镜</span><span ref="tc4" class="im-title__c im-title__c--mirror">渊</span>
            </h1>
            <div ref="lineRef" class="im-line"></div>
            <p class="im-sub">向下滚动 · 两面镜对望 · 图片在无限反射隧道中层层递进 · 永无尽头</p>
          </header>

          <div ref="sceneRef" class="im-scene">
            <div ref="mirrorRef" class="im-mirror-tunnel">
              <!-- 10层镜面框 — 模拟无限反射 -->
              <div v-for="layer in 10" :key="layer"
                :ref="(el)=>setLayerRef(el as HTMLElement, layer-1)"
                class="im-layer"
              >
                <div class="im-layer__frame">
                  <!-- 图片 — 每层不同，越远越小 -->
                  <img :src="layerImages[layer-1]" :alt="`反射层${layer}`" class="im-layer__img" />
                  <div class="im-layer__reflect"></div>
                </div>
                <div class="im-layer__border"></div>
              </div>
              <!-- 最深处光点 -->
              <div ref="deepPoint" class="im-deep-point"></div>
            </div>
          </div>

          <div ref="infoRef" class="im-info">
            <span class="im-info__dot"></span><span class="im-info__text">反射深度 {{ depthLevel }}/10</span>
          </div>
          <div class="im-progress"><div ref="progRef" class="im-progress__fill"></div></div>
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

const layerImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=300&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=300&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=300&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
]
const trackHeight = `${7 * 100}vh`
const depthLevel=ref(1)

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const mirrorRef=ref<HTMLElement|null>(null);const deepPoint=ref<HTMLElement|null>(null)
const frameGlow=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const layerRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setLayerRef(el:HTMLElement|null,idx:number){layerRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,z:-400,scale:.1},{autoAlpha:1,z:0,scale:1,duration:.75,stagger:.12,ease:'back.out(2.5)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,scale:.3},{autoAlpha:1,scale:1,duration:1.1,ease:'power4.out'},'-.4')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupInfinityMirror(){
  if(!scrollRef.value||!trackRef.value||!mirrorRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=layerRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：层层向Z轴深处排列，scale递减
  els.forEach((el,i)=>{gsap.set(el,{translateZ:-i*140,scale:1-i*.1,opacity:.2+(1-i*.08)})})
  if(deepPoint.value)gsap.set(deepPoint.value,{translateZ:-1400,scale:.05,opacity:.3})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){depthLevel.value=Math.min(10,Math.max(1,Math.ceil(self.progress*10)))},
    },
  })

  const totalDist=10*140*.7
  // 🪞 无限镜：所有层向相机推进
  els.forEach((el,i)=>{
    master.fromTo(el,{translateZ:-i*140,scale:1-i*.1,opacity:.2+(1-i*.08)},{translateZ:-i*140+totalDist,scale:1,opacity:.9,duration:6,ease:'power2.in'},0)
  })

  // 最深处的光点逐渐拉近
  if(deepPoint.value){
    master.fromTo(deepPoint.value,{translateZ:-1400,scale:.05,opacity:.3},{translateZ:-200,scale:1.2,opacity:.9,duration:5.5,ease:'power3.in'},.5)
  }

  // 整体旋转
  if(mirrorRef.value){master.to(mirrorRef.value,{rotateY:15,duration:3,ease:'sine.inOut'},0);master.to(mirrorRef.value,{rotateY:-12,duration:3,ease:'sine.inOut'},3)}
  if(frameGlow.value)master.to(frameGlow.value,{scale:1.4,opacity:.5,duration:6},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupInfinityMirror()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.im-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0e0e18 0%,#060610 60%,#020204 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.im-frame{position:absolute;width:30vw;height:25vw;top:25vh;left:35vw;border-radius:10px;border:2px solid rgba(180,200,220,.08);box-shadow:0 0 50px rgba(150,180,200,.05),inset 0 0 40px rgba(150,180,200,.03);pointer-events:none;z-index:0;will-change:transform,opacity}
.im-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(160,180,200,.1)}}
.im-track{position:relative;width:100%}.im-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.im-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.im-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(180,200,220,.7);background:rgba(120,160,200,.08);backdrop-filter:blur(8px);border:1px solid rgba(140,180,210,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.im-title{margin:0;display:flex;justify-content:center;gap:.08em}
.im-title__c{display:inline-block;font-size:clamp(2rem,5vw,4rem);font-weight:900;color:#b0c8e0;will-change:transform,opacity;&--mirror{background:linear-gradient(135deg,#b0c8e0,#80a0c0,#d0e0f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(160,190,220,.5))}}
.im-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#b0c8e0,#80a0c0,#d0e0f0,transparent)}
.im-sub{margin:0;font-size:clamp(.6rem,.85vw,.74rem);color:rgba(150,180,210,.3);max-width:540px;margin-inline:auto}
.im-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:400px;perspective-origin:50% 50%;will-change:transform,opacity}
.im-mirror-tunnel{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.im-layer{position:absolute;width:min(40vw,340px);height:min(28vw,240px);margin-left:calc(min(40vw,340px) / -2);margin-top:calc(min(28vw,240px) / -2);transform-style:preserve-3d;will-change:transform,opacity;
  &__frame{border-radius:6px;overflow:hidden;box-shadow:0 0 30px rgba(0,0,0,.3);background:#1a1a24;width:100%;height:100%}
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__reflect{position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.08) 0%,transparent 40%,transparent 60%,rgba(180,200,220,.06) 100%);pointer-events:none}
  &__border{position:absolute;inset:-4px;border-radius:8px;border:1px solid rgba(180,200,220,.12);pointer-events:none}
}

.im-deep-point{position:absolute;width:8px;height:8px;margin-left:-4px;margin-top:-4px;border-radius:50%;background:#d0e8ff;box-shadow:0 0 30px rgba(200,220,255,.8),0 0 60px rgba(180,200,240,.4);will-change:transform,opacity}

.im-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.im-info__dot{width:6px;height:6px;border-radius:50%;background:#b0c8e0;box-shadow:0 0 14px rgba(160,190,220,.6);animation:im-pulse 2s ease-in-out infinite}
@keyframes im-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.im-info__text{font-size:.6rem;font-weight:600;color:rgba(170,200,220,.6);letter-spacing:.1em}
.im-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(140,180,210,.05)}
.im-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#b0c8e0,#80a0c0,#d0e0f0,#b0c8e0);background-size:200% 100%;box-shadow:0 0 10px rgba(160,190,220,.5)}
@media(max-width:768px){.im-header{top:2vh}.im-kicker{font-size:.38rem;padding:.1rem .4rem}.im-title__c{font-size:1.3rem}}
</style>
