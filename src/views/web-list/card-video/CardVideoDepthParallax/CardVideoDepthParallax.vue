<template>
  <section ref="rootRef" class="dp-root">
    <div ref="scrollRef" class="dp-scroll">
      <div ref="trackRef" class="dp-track" :style="{ height: trackHeight }">
        <div class="dp-sticky">

          <!-- 🔑 3D 景深场景 -->
          <div ref="sceneRef" class="dp-scene">
            <div ref="stageRef" class="dp-stage">

              <!-- 远景视频层 Z:-300 -->
              <div class="dp-layer dp-layer--far">
                <video ref="videoFarRef" class="dp-video"
                  src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
                  preload="auto" muted playsinline
                ></video>
                <div class="dp-layer__fog"></div>
                <span class="dp-layer__tag">远景 · 0.3×</span>
              </div>

              <!-- 中景视频层 Z:0 -->
              <div class="dp-layer dp-layer--mid">
                <video ref="videoMidRef" class="dp-video"
                  src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
                  preload="auto" muted playsinline
                ></video>
                <span class="dp-layer__tag">中景 · 1×</span>
              </div>

              <!-- 近景视频层 Z:+200 -->
              <div class="dp-layer dp-layer--near">
                <video ref="videoNearRef" class="dp-video"
                  src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
                  preload="auto" muted playsinline
                ></video>
                <span class="dp-layer__tag">近景 · 2×</span>
              </div>

            </div>
          </div>

          <header ref="headerRef" class="dp-header">
            <span ref="badgeRef" class="dp-badge">◆ 视频景深视差 · 3层深度 ◆</span>
            <h1 class="dp-title">
              <span ref="tc1" class="dp-title__c">景</span>
              <span ref="tc2" class="dp-title__c g">深</span>
              <span ref="tc3" class="dp-title__c">视</span>
              <span ref="tc4" class="dp-title__c g">差</span>
            </h1>
            <div ref="dividerRef" class="dp-divider"></div>
            <p ref="subRef" class="dp-sub">向下滚动 → 3层视频不同深度不同速度流动</p>
          </header>

          <div class="dp-progress"><div ref="progRef" class="dp-progress__fill"></div></div>
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

const STAGES = 6; const trackHeight = `${(STAGES + 1) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const videoFarRef = ref<HTMLVideoElement | null>(null)
const videoMidRef = ref<HTMLVideoElement | null>(null)
const videoNearRef = ref<HTMLVideoElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null); const stageRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const badgeRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null); const subRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const cleanupFns: TweenCleanup[] = []

function initVideo(v: HTMLVideoElement) {
  if (v.readyState >= 2) { v.pause(); v.currentTime = v.duration * .05 }
  else v.addEventListener('loadedmetadata', () => { v.pause(); v.currentTime = v.duration * .05 }, { once: true })
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: .85, ease: 'power3.out' })
    .fromTo(badgeRef.value, { autoAlpha: 0, scale: .8, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: .6, ease: 'back.out(1.5)' }, '-=.5')
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: .3, filter: 'blur(10px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: .65, stagger: .1, ease: 'back.out(1.8)' }, '-=.35')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power3.inOut' }, '-=.2')
    .fromTo(subRef.value, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: .55, ease: 'power2.out' }, '-=.1')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupDepthParallax() {
  if (!scrollRef.value || !trackRef.value || !videoMidRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value
  const vFar = videoFarRef.value; const vMid = videoMidRef.value; const vNear = videoNearRef.value
  if (vFar) initVideo(vFar); if (vMid) initVideo(vMid); if (vNear) initVideo(vNear)

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        // 🔑 3层不同的播放速度 → 景深视差
        const update = (v: HTMLVideoElement | null, speed: number) => {
          if (!v || v.readyState < 2 || v.duration <= 0) return
          v.currentTime = v.duration * .05 + (self.progress * speed % 1) * v.duration * .9
        }
        update(vFar, 0.3)   // 远景慢
        update(vMid, 1.0)   // 中景正常
        update(vNear, 2.0)  // 近景快
        if (progRef.value) progRef.value.style.width = `${self.progress * 100}%`
      },
    },
  })

  // 场景旋转
  if (stageRef.value) {
    master.to(stageRef.value, { rotateX: 10, rotateY: -8, duration: 3, ease: 'sine.inOut' }, 0)
    master.to(stageRef.value, { rotateX: -6, rotateY: 6, duration: 3, ease: 'sine.inOut' }, 3)
  }

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupDepthParallax() }))
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn()); cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.dp-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #000; font-family: 'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif; }
.dp-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: scroll; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.12); }
}
.dp-track { position: relative; width: 100%; }
.dp-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* 🔑 3D场景 */
.dp-scene { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 0; height: 0; perspective: 1000px; perspective-origin: 50% 48%; }
.dp-stage { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

/* 景深层 */
.dp-layer { position: absolute; overflow: hidden; border-radius: 8px; will-change: transform; }
.dp-video { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
.dp-layer__fog { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(100,140,200,.2), transparent 50%, rgba(80,100,160,.15)); pointer-events: none; }
.dp-layer__tag { position: absolute; bottom: 6px; right: 8px; font-size: .4rem; font-weight: 700; letter-spacing: .12em; color: rgba(255,255,255,.5); font-family: 'Courier New',monospace; text-shadow: 0 1px 3px rgba(0,0,0,.4); }

/* 远景 */
.dp-layer--far { width: 500px; height: 340px; margin-left: -250px; margin-top: -170px; transform: translateZ(-300px); opacity: .6; filter: blur(2px) brightness(1.2) saturate(.7); }
/* 中景 */
.dp-layer--mid { width: 400px; height: 270px; margin-left: -200px; margin-top: -135px; transform: translateZ(0px); opacity: .85; }
/* 近景 */
.dp-layer--near { width: 320px; height: 210px; margin-left: -160px; margin-top: -105px; transform: translateZ(200px); opacity: 1; }

.dp-header { position: absolute; top: 8vh; left: 50%; transform: translateX(-50%); z-index: 10; text-align: center; width: min(92vw,800px); pointer-events: none; }
.dp-badge { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .28em; color: rgba(255,255,255,.75); background: rgba(255,255,255,.08); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.15); border-radius: 999px; padding: .22rem 1.1rem; margin-bottom: .6rem; }
.dp-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.dp-title__c { display: inline-block; font-size: clamp(2.4rem,6vw,5rem); font-weight: 900; color: rgba(255,255,255,.85); will-change: transform,opacity,filter; text-shadow: 0 2px 20px rgba(0,0,0,.3);
  &.g { background: linear-gradient(150deg,#60d0a0,#80f0c0,#40b0d0,#60e0f0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(80,200,160,.6)); }
}
.dp-divider { width: 100px; height: 2px; margin: .5rem auto .6rem; background: linear-gradient(90deg,transparent,rgba(255,255,255,.5),rgba(80,210,160,.5),rgba(255,255,255,.5),transparent); }
.dp-sub { margin: 0; font-size: clamp(.66rem,1vw,.82rem); color: rgba(255,255,255,.45); max-width: 500px; margin-inline: auto; }
.dp-progress { position: absolute; left: 0; bottom: 0; z-index: 20; width: 100%; height: 2px; background: rgba(255,255,255,.04); }
.dp-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#60d0a0,#40b0d0); }

@media (max-width: 768px) {
  .dp-header { top: 5vh; } .dp-badge { font-size: .44rem; } .dp-title__c { font-size: 1.8rem; }
  .dp-layer--far { width: 340px; height: 230px; margin-left: -170px; margin-top: -115px; }
  .dp-layer--mid { width: 280px; height: 190px; margin-left: -140px; margin-top: -95px; }
  .dp-layer--near { width: 220px; height: 150px; margin-left: -110px; margin-top: -75px; }
}
</style>
