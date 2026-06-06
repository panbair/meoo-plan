<template>
  <section ref="rootRef" class="rr-root">
    <div ref="depthGlow" class="rr-depth"></div>

    <div ref="scrollRef" class="rr-scroll">
      <div ref="trackRef" class="rr-track" :style="{ height: trackHeight }">
        <div class="rr-sticky">

          <header ref="headerRef" class="rr-header">
            <span class="rr-kicker">🪆 CSS3 3D Recursive Room · 递归房间 ◈</span>
            <h1 class="rr-title">
              <span ref="tc1" class="rr-title__c">递</span><span ref="tc2" class="rr-title__c rr-title__c--rec">归</span>
              <span ref="tc3" class="rr-title__c">房</span><span ref="tc4" class="rr-title__c rr-title__c--rec">间</span>
            </h1>
            <div ref="lineRef" class="rr-line"></div>
            <p class="rr-sub">向下滚动 · 房间中套房间再套房间 · 3层嵌套 · 每层四壁挂图 · 越来越深</p>
          </header>

          <div ref="sceneRef" class="rr-scene">
            <div ref="roomsRef" class="rr-rooms">
              <!-- 3层嵌套房间 — 大→中→小 -->
              <div v-for="room in rooms" :key="room.id"
                :ref="(el)=>setRoomRef(el as HTMLElement, room.id)"
                class="rr-room" :class="[`rr-room--l${room.id}`]"
              >
                <!-- 4面墙壁各贴一张图 -->
                <div class="rr-wall rr-wall--back">
                  <img :src="room.images[0]" class="rr-wall__img" /><div class="rr-wall__label">{{ room.labels[0] }}</div>
                </div>
                <div class="rr-wall rr-wall--left">
                  <img :src="room.images[1]" class="rr-wall__img" /><div class="rr-wall__label">{{ room.labels[1] }}</div>
                </div>
                <div class="rr-wall rr-wall--right">
                  <img :src="room.images[2]" class="rr-wall__img" /><div class="rr-wall__label">{{ room.labels[2] }}</div>
                </div>
                <div class="rr-wall rr-wall--floor">
                  <img :src="room.images[3]" class="rr-wall__img" />
                </div>
              </div>
            </div>
          </div>

          <div ref="infoRef" class="rr-info">
            <span class="rr-info__dot"></span><span class="rr-info__text">深入 {{ depthLevel }} 层</span>
          </div>
          <div class="rr-progress"><div ref="progRef" class="rr-progress__fill"></div></div>
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

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=350&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=350&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=350&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=350&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=350&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=350&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=350&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=350&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=350&q=80',
]

const rooms = [
  {id:0, images:[imgPool[0],imgPool[1],imgPool[2],imgPool[3]], labels:['🌊 外海','⛰ 外山','✨ 外星',''], scale:1.0, z:0},
  {id:1, images:[imgPool[4],imgPool[5],imgPool[6],imgPool[7]], labels:['🌲 中林','🌺 中花','🌾 中田',''], scale:.55, z:-180},
  {id:2, images:[imgPool[8],imgPool[0],imgPool[1],imgPool[2]], labels:['🔮 内晶','💎 内宝','🌟 内光',''], scale:.3, z:-350},
]
const trackHeight = `${7 * 100}vh`
const depthLevel=ref(1)

const rootRef=ref<HTMLElement|null>(null);const scrollRef=ref<HTMLElement|null>(null);const trackRef=ref<HTMLElement|null>(null)
const headerRef=ref<HTMLElement|null>(null);const lineRef=ref<HTMLElement|null>(null)
const tc1=ref<HTMLElement|null>(null);const tc2=ref<HTMLElement|null>(null);const tc3=ref<HTMLElement|null>(null);const tc4=ref<HTMLElement|null>(null)
const sceneRef=ref<HTMLElement|null>(null);const roomsRef=ref<HTMLElement|null>(null)
const depthGlow=ref<HTMLElement|null>(null);const infoRef=ref<HTMLElement|null>(null);const progRef=ref<HTMLElement|null>(null)
const roomRefs=ref<(HTMLElement|null)[]>([]);const cleanupFns:TweenCleanup[]=[]
function setRoomRef(el:HTMLElement|null,idx:number){roomRefs.value[idx]=el}

function setupEntrance(){
  if(!scrollRef.value||!headerRef.value||!sceneRef.value)return
  const tl=gsap.timeline({scrollTrigger:{trigger:scrollRef.value,scroller:scrollRef.value,start:'top 75%',toggleActions:'play none none reverse'}})
  const chars=[tc1.value,tc2.value,tc3.value,tc4.value]
  tl.fromTo(headerRef.value,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.9,ease:'power3.out'})
  .fromTo(chars,{autoAlpha:0,z:-500,scale:.1},{autoAlpha:1,z:0,scale:1,duration:.75,stagger:.12,ease:'back.out(2.5)'},'-.5')
  .fromTo(lineRef.value,{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},'-.3')
  .fromTo(sceneRef.value,{autoAlpha:0,rotateX:-25,scale:.4},{autoAlpha:1,rotateX:-8,scale:1,duration:1.1,ease:'power4.out'},'-.45')
  cleanupFns.push(()=>{tl.scrollTrigger?.kill();tl.kill()})
}

function setupRecursiveRoom(){
  if(!scrollRef.value||!trackRef.value||!roomsRef.value)return
  const scroller=scrollRef.value;const track=trackRef.value
  const els=roomRefs.value.filter(Boolean) as HTMLElement[]
  const roomsContainer=roomsRef.value

  // 初始：3层嵌套，scale递减
  els.forEach((el,i)=>{gsap.set(el,{translateZ:rooms[i].z,scale:rooms[i].scale,opacity:.4+(1-i*.2)})})
  if(roomsContainer)gsap.set(roomsContainer,{rotateX:-8})

  const master=gsap.timeline({
    defaults:{ease:'none'},
    scrollTrigger:{trigger:track,scroller,start:'top top',end:'bottom bottom',scrub:1.2,
      onUpdate(self){depthLevel.value=Math.min(3,Math.max(1,Math.ceil(self.progress*3.2)))},
    },
  })

  // 🪆 递归深入：所有房间向相机推进（外层经过后露出内层）
  const totalDist=600
  els.forEach((el,i)=>{
    master.fromTo(el,{translateZ:rooms[i].z,scale:rooms[i].scale},{translateZ:rooms[i].z+totalDist,scale:rooms[i].scale+(1-rooms[i].scale)*.7,opacity:.9,duration:6,ease:'power2.in'},0)
  })

  // 视角旋转 — 看到房间转角
  if(roomsContainer){master.to(roomsContainer,{rotateY:25,duration:3,ease:'sine.inOut'},0);master.to(roomsContainer,{rotateY:-18,duration:3,ease:'sine.inOut'},3)}
  if(depthGlow.value)master.to(depthGlow.value,{scale:2,opacity:.6,duration:6,ease:'power2.in'},0)
  if(progRef.value)master.to(progRef.value,{width:'100%',duration:6},0)
  cleanupFns.push(()=>{master.scrollTrigger?.kill();master.kill()})
}

function handleResize(){ScrollTrigger.refresh(true)}
onMounted(()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{setupEntrance();setupRecursiveRoom()}));window.addEventListener('resize',handleResize)})
onUnmounted(()=>{window.removeEventListener('resize',handleResize);ScrollTrigger.getAll().forEach(st=>st.kill());cleanupFns.forEach(fn=>fn());cleanupFns.length=0})
</script>

<style scoped lang="scss">
.rr-root{position:relative;width:100vw;height:100vh;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0c0c18 0%,#04040c 60%,#010104 100%);font-family:'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif}
.rr-depth{position:absolute;width:15vw;height:15vw;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(200,160,80,.12) 0%,transparent 55%);filter:blur(50px);pointer-events:none;z-index:0;will-change:transform,opacity}
.rr-scroll{position:relative;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:auto;z-index:2;&::-webkit-scrollbar{width:5px}&::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(200,160,60,.1)}}
.rr-track{position:relative;width:100%}.rr-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
.rr-header{position:absolute;top:3vh;left:50%;transform:translateX(-50%);z-index:30;text-align:center;width:min(92vw,800px)}
.rr-kicker{display:inline-block;font-size:.54rem;font-weight:700;letter-spacing:.3em;color:rgba(220,180,80,.7);background:rgba(180,120,40,.08);backdrop-filter:blur(8px);border:1px solid rgba(200,140,60,.15);border-radius:999px;padding:.2rem .85rem;margin-bottom:.5rem}
.rr-title{margin:0;display:flex;justify-content:center;gap:.08em}
.rr-title__c{display:inline-block;font-size:clamp(1.9rem,4.5vw,3.8rem);font-weight:900;color:#d0a840;will-change:transform,opacity;&--rec{background:linear-gradient(135deg,#e0b850,#c09030,#f0d060);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 14px rgba(220,170,60,.5))}}
.rr-line{width:90px;height:2px;margin:.4rem auto .55rem;border-radius:2px;background:linear-gradient(90deg,transparent,#e0b850,#c09030,#f0d060,transparent)}
.rr-sub{margin:0;font-size:clamp(.58rem,.82vw,.7rem);color:rgba(200,150,50,.3);max-width:560px;margin-inline:auto}
.rr-scene{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;perspective:600px;perspective-origin:50% 50%;will-change:transform,opacity}
.rr-rooms{position:relative;width:0;height:0;transform-style:preserve-3d;will-change:transform}

.rr-room{position:absolute;width:0;height:0;transform-style:preserve-3d;will-change:transform,opacity;
  --baseW: min(40vw, 340px); --baseH: min(28vw, 240px); --baseD: min(40vw, 340px);
  --hW: calc(var(--baseW) / 2); --hH: calc(var(--baseH) / 2); --hD: calc(var(--baseD) / 2);
}

.rr-wall{position:absolute;overflow:hidden;box-shadow:0 0 20px rgba(0,0,0,.3);
  &__img{width:100%;height:100%;object-fit:cover;display:block}
  &__label{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-size:.48rem;font-weight:600;color:#fff;background:rgba(0,0,0,.3);backdrop-filter:blur(4px);border-radius:999px;padding:.08rem .5rem;text-shadow:0 1px 3px rgba(0,0,0,.5)}
  &--back{width:var(--baseW);height:var(--baseH);margin-left:calc(var(--hW) * -1);margin-top:calc(var(--hH) * -1);transform:translateZ(calc(var(--hD) * -1))}
  &--left{width:var(--baseD);height:var(--baseH);margin-left:calc(var(--hD) * -1);margin-top:calc(var(--hH) * -1);transform:translateX(calc(var(--hW) * -1)) rotateY(90deg)}
  &--right{width:var(--baseD);height:var(--baseH);margin-left:calc(var(--hD) * -1);margin-top:calc(var(--hH) * -1);transform:translateX(var(--hW)) rotateY(-90deg)}
  &--floor{width:var(--baseW);height:var(--baseD);margin-left:calc(var(--hW) * -1);margin-top:calc(var(--hD) * -1);transform:translateY(var(--hH)) rotateX(-90deg)}
}

.rr-info{position:absolute;bottom:10vh;left:50%;transform:translateX(-50%);z-index:25;display:flex;align-items:center;gap:.4rem;pointer-events:none}
.rr-info__dot{width:6px;height:6px;border-radius:50%;background:#d0a840;box-shadow:0 0 14px rgba(220,170,60,.6);animation:rr-pulse 2s ease-in-out infinite}
@keyframes rr-pulse{0%,100%{transform:scale(1)}50%{transform:scale(2.5);opacity:.4}}
.rr-info__text{font-size:.6rem;font-weight:600;color:rgba(210,160,50,.6);letter-spacing:.1em}
.rr-progress{position:absolute;left:0;bottom:0;width:100%;height:3px;background:rgba(200,140,40,.05)}
.rr-progress__fill{width:0;height:100%;background:linear-gradient(90deg,#e0b850,#c09030,#f0d060,#e0b850);background-size:200% 100%;box-shadow:0 0 10px rgba(220,170,60,.5)}
@media(max-width:768px){.rr-header{top:2vh}.rr-kicker{font-size:.38rem;padding:.1rem .4rem}.rr-title__c{font-size:1.2rem}}
</style>
