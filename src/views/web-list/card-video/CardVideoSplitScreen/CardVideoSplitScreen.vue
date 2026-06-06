<template>
  <section ref="rootRef" class="ss-root">
    <div ref="scrollRef" class="ss-scroll">
      <div ref="trackRef" class="ss-track" :style="{ height: trackHeight }">
        <div class="ss-sticky">

          <!-- 🔑 3列分屏 — 各显示视频不同区域 -->
          <div class="ss-splits">
            <div ref="leftColRef" class="ss-col ss-col--left">
              <video ref="videoRef" class="ss-video"
                src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
                preload="auto" muted playsinline
              ></video>
            </div>
            <div ref="midColRef" class="ss-col ss-col--mid">
              <div class="ss-col__vid-wrap">
                <video class="ss-video"
                  src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
                  preload="auto" muted playsinline
                ></video>
              </div>
            </div>
            <div ref="rightColRef" class="ss-col ss-col--right">
              <div class="ss-col__vid-wrap">
                <video class="ss-video"
                  src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
                  preload="auto" muted playsinline
                ></video>
              </div>
            </div>
          </div>

          <header ref="headerRef" class="ss-header">
            <span ref="badgeRef" class="ss-badge">◆ 视频分屏 · 三列错位 ◆</span>
            <h1 class="ss-title">
              <span ref="tc1" class="ss-title__c">分</span>
              <span ref="tc2" class="ss-title__c g">屏</span>
              <span ref="tc3" class="ss-title__c">错</span>
              <span ref="tc4" class="ss-title__c g">位</span>
            </h1>
            <div ref="dividerRef" class="ss-divider"></div>
            <p ref="subRef" class="ss-sub">向下滚动 → 三列视频上下错位移动 · 拼合为完整画面</p>
          </header>

          <div class="ss-progress"><div ref="progRef" class="ss-progress__fill"></div></div>
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
const leftColRef = ref<HTMLElement | null>(null); const midColRef = ref<HTMLElement | null>(null)
const rightColRef = ref<HTMLElement | null>(null)
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

function setupSplits() {
  if (!scrollRef.value || !trackRef.value || !videoRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const video = videoRef.value

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
        // 🔑 三列错位归位
        const f = 1 - self.progress
        if (leftColRef.value) leftColRef.value.style.transform = `translateY(${-40 * f}vh)`
        if (midColRef.value) midColRef.value.style.transform = `translateY(${30 * f}vh)`
        if (rightColRef.value) rightColRef.value.style.transform = `translateY(${-20 * f}vh)`
        if (progRef.value) progRef.value.style.width = `${self.progress * 100}%`
      },
    },
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupSplits() }))
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn()); cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.ss-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #000; font-family: 'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif; }
.ss-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: scroll; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.1); }
}
.ss-track { position: relative; width: 100%; }
.ss-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* 🔑 三列分屏 */
.ss-splits { display: flex; height: 100%; position: absolute; inset: 0; z-index: 1; }
.ss-col { flex: 1; overflow: hidden; position: relative; will-change: transform; border-right: 1px solid rgba(255,255,255,.08); }
.ss-col--left .ss-video { position: absolute; top: 0; left: 0; width: 300%; height: 100%; object-fit: cover; }
.ss-col--mid .ss-video { position: absolute; top: 0; left: -100%; width: 300%; height: 100%; object-fit: cover; }
.ss-col--right .ss-video { position: absolute; top: 0; left: -200%; width: 300%; height: 100%; object-fit: cover; }
.ss-video { pointer-events: none; filter: brightness(.9); }

.ss-header { position: absolute; top: 8vh; left: 50%; transform: translateX(-50%); z-index: 10; text-align: center; width: min(92vw,800px); pointer-events: none; }
.ss-badge { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .28em; color: rgba(255,255,255,.7); background: rgba(255,255,255,.06); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.1); border-radius: 999px; padding: .22rem 1.1rem; margin-bottom: .6rem; }
.ss-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.ss-title__c { display: inline-block; font-size: clamp(2.4rem,6vw,5rem); font-weight: 900; color: rgba(255,255,255,.8); will-change: transform,opacity,filter; text-shadow: 0 2px 20px rgba(0,0,0,.3);
  &.g { background: linear-gradient(150deg,#f060a0,#ff80c0,#60a0f0,#80c0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(240,100,160,.6)); }
}
.ss-divider { width: 100px; height: 2px; margin: .5rem auto .6rem; background: linear-gradient(90deg,transparent,rgba(255,255,255,.4),rgba(240,100,180,.4),rgba(255,255,255,.4),transparent); }
.ss-sub { margin: 0; font-size: clamp(.66rem,1vw,.82rem); color: rgba(255,255,255,.4); max-width: 500px; margin-inline: auto; }
.ss-progress { position: absolute; left: 0; bottom: 0; z-index: 20; width: 100%; height: 2px; background: rgba(255,255,255,.03); }
.ss-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#f060a0,#60a0f0); }

@media (max-width: 768px) { .ss-header { top: 5vh; } .ss-badge { font-size: .44rem; } .ss-title__c { font-size: 1.8rem; } }
</style>
