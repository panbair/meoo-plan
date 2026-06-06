<template>
  <section ref="rootRef" class="sp-root">
    <div ref="scrollRef" class="sp-scroll">
      <div ref="trackRef" class="sp-track" :style="{ height: trackHeight }">
        <div class="sp-sticky">

          <!-- 🔑 视频被圆形mask遮罩 -->
          <video ref="videoRef" class="sp-video"
            src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
            preload="auto" muted playsinline
          ></video>

          <!-- 🔑 聚光灯mask — 圆形区域透过视频 -->
          <div ref="spotRef" class="sp-spot">
            <div class="sp-spot__glow"></div>
          </div>

          <!-- 暗色覆盖层(挖孔) -->
          <div class="sp-dark"></div>

          <header ref="headerRef" class="sp-header">
            <span ref="badgeRef" class="sp-badge">◆ 视频聚光灯 · 圆形揭示 ◆</span>
            <h1 class="sp-title">
              <span ref="tc1" class="sp-title__c">聚</span>
              <span ref="tc2" class="sp-title__c g">光</span>
              <span ref="tc3" class="sp-title__c">揭</span>
              <span ref="tc4" class="sp-title__c g">示</span>
            </h1>
            <div ref="dividerRef" class="sp-divider"></div>
            <p ref="subRef" class="sp-sub">向下滚动 → 聚光灯扩大照亮视频全貌</p>
          </header>

          <div class="sp-progress"><div ref="progRef" class="sp-progress__fill"></div></div>
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

const rootRef = ref<HTMLElement | null>(null); const videoRef = ref<HTMLVideoElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const spotRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const badgeRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null); const subRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const cleanupFns: TweenCleanup[] = []

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

function setupSpotlight() {
  if (!scrollRef.value || !trackRef.value || !videoRef.value || !spotRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const video = videoRef.value; const spot = spotRef.value

  const initVideo = () => { video.pause(); video.currentTime = video.duration * .05 }
  if (video.readyState >= 2) initVideo()
  else video.addEventListener('loadedmetadata', initVideo, { once: true })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        if (video.readyState >= 2 && video.duration > 0) {
          video.currentTime = video.duration * .05 + self.progress * video.duration * .9
        }
        // 🔑 聚光灯从小变大
        const size = 40 + self.progress * 120 // 40px → 160px
        spot.style.width = `${size}vmin`
        spot.style.height = `${size}vmin`
        // 聚光灯位置从左上移到中央
        const x = 50 - (1 - self.progress) * 30
        const y = 50 - (1 - self.progress) * 25
        spot.style.left = `${x}%`
        spot.style.top = `${y}%`
        spot.style.opacity = String(.5 + self.progress * .5)
        if (progRef.value) progRef.value.style.width = `${self.progress * 100}%`
      },
    },
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupSpotlight() }))
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn()); cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.sp-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #050510; font-family: 'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif; }
.sp-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: scroll; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.1); }
}
.sp-track { position: relative; width: 100%; }
.sp-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.sp-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; pointer-events: none; }

/* 🔑 聚光灯 — 圆形视频可见区 */
.sp-spot {
  position: absolute; width: 40vmin; height: 40vmin; left: 20%; top: 25%;
  border-radius: 50%; z-index: 2; pointer-events: none;
  box-shadow: 0 0 0 9999px rgba(5,5,16,.85); // 挖孔!
  overflow: hidden;
  will-change: width, height, left, top, opacity;
}
.sp-spot__glow {
  position: absolute; inset: -20px; border-radius: 50%;
  box-shadow: inset 0 0 40px rgba(255,255,255,.1), 0 0 60px rgba(100,180,240,.15);
}

/* 暗色覆盖 — 覆盖整个屏幕, 但被 spotlight 的 box-shadow 挖孔 */
.sp-dark { position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: radial-gradient(ellipse 30% 30% at 20% 25%, transparent 0%, rgba(5,5,16,.6) 60%, rgba(5,5,16,.9) 100%);
}

.sp-header { position: absolute; top: 8vh; left: 50%; transform: translateX(-50%); z-index: 10; text-align: center; width: min(92vw,800px); pointer-events: none; }
.sp-badge { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .28em; color: rgba(255,255,255,.7); background: rgba(255,255,255,.06); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.12); border-radius: 999px; padding: .22rem 1.1rem; margin-bottom: .6rem; }
.sp-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.sp-title__c { display: inline-block; font-size: clamp(2.4rem,6vw,5rem); font-weight: 900; color: rgba(255,255,255,.8); will-change: transform,opacity,filter; text-shadow: 0 2px 20px rgba(0,0,0,.3);
  &.g { background: linear-gradient(150deg,#f0d060,#ffe080,#f0c040,#ffe0a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(240,200,60,.6)); }
}
.sp-divider { width: 100px; height: 2px; margin: .5rem auto .6rem; background: linear-gradient(90deg,transparent,rgba(255,255,255,.4),rgba(240,200,80,.5),rgba(255,255,255,.4),transparent); }
.sp-sub { margin: 0; font-size: clamp(.66rem,1vw,.82rem); color: rgba(255,255,255,.4); max-width: 500px; margin-inline: auto; }
.sp-progress { position: absolute; left: 0; bottom: 0; z-index: 20; width: 100%; height: 2px; background: rgba(255,255,255,.03); }
.sp-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#f0d060,#f0c040); }

@media (max-width: 768px) { .sp-header { top: 5vh; } .sp-badge { font-size: .44rem; } .sp-title__c { font-size: 1.8rem; } }
</style>
