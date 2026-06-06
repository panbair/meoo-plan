<template>
  <section ref="rootRef" class="pr-root">
    <div ref="scrollRef" class="pr-scroll">
      <div ref="trackRef" class="pr-track" :style="{ height: trackHeight }">
        <div class="pr-sticky">

          <!-- 🔑 棱镜折射 — RGB三通道分离 -->
          <div class="pr-prism">
            <!-- 红通道 -->
            <div ref="redRef" class="pr-channel pr-channel--red">
              <video ref="videoRef" class="pr-video"
                src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
                preload="auto" muted playsinline
              ></video>
            </div>
            <!-- 绿通道 -->
            <div ref="greenRef" class="pr-channel pr-channel--green">
              <div class="pr-channel__vid-wrap">
                <video class="pr-video"
                  src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
                  preload="auto" muted playsinline
                ></video>
              </div>
            </div>
            <!-- 蓝通道 -->
            <div ref="blueRef" class="pr-channel pr-channel--blue">
              <div class="pr-channel__vid-wrap">
                <video class="pr-video"
                  src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
                  preload="auto" muted playsinline
                ></video>
              </div>
            </div>
          </div>

          <header ref="headerRef" class="pr-header">
            <span ref="badgeRef" class="pr-badge">◆ 视频棱镜折射 · RGB色散 ◆</span>
            <h1 class="pr-title">
              <span ref="tc1" class="pr-title__c">棱</span>
              <span ref="tc2" class="pr-title__c r">镜</span>
              <span ref="tc3" class="pr-title__c">折</span>
              <span ref="tc4" class="pr-title__c r">射</span>
            </h1>
            <div ref="dividerRef" class="pr-divider"></div>
            <p ref="subRef" class="pr-sub">向下滚动 → RGB三通道色散归位 · 棱镜对焦</p>
          </header>

          <div class="pr-progress"><div ref="progRef" class="pr-progress__fill"></div></div>
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
const redRef = ref<HTMLElement | null>(null); const greenRef = ref<HTMLElement | null>(null)
const blueRef = ref<HTMLElement | null>(null)
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

function setupPrism() {
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
        // 🔑 RGB三通道色散 → 归位
        const f = 1 - self.progress
        if (redRef.value) redRef.value.style.transform = `translateX(${-18 * f}px) translateY(${-8 * f}px)`
        if (blueRef.value) blueRef.value.style.transform = `translateX(${18 * f}px) translateY(${8 * f}px)`
        if (greenRef.value) greenRef.value.style.transform = `translateY(${4 * f}px)`
        if (progRef.value) progRef.value.style.width = `${self.progress * 100}%`
      },
    },
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupPrism() }))
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn()); cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.pr-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #000; font-family: 'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif; }
.pr-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: scroll; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.1); }
}
.pr-track { position: relative; width: 100%; }
.pr-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* 🔑 棱镜RGB三通道 */
.pr-prism { position: absolute; inset: 0; z-index: 1; overflow: hidden; }
.pr-channel { position: absolute; inset: 0; will-change: transform; mix-blend-mode: screen; }
.pr-video { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }

.pr-channel--red .pr-video { filter: brightness(.4) sepia(1) hue-rotate(-30deg) saturate(5); }
.pr-channel--green .pr-video { filter: brightness(.4) sepia(1) hue-rotate(90deg) saturate(5); }
.pr-channel--blue .pr-video { filter: brightness(.4) sepia(1) hue-rotate(200deg) saturate(5); }

.pr-header { position: absolute; top: 8vh; left: 50%; transform: translateX(-50%); z-index: 10; text-align: center; width: min(92vw,800px); pointer-events: none; }
.pr-badge { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .28em; color: rgba(255,255,255,.7); background: rgba(255,255,255,.06); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.1); border-radius: 999px; padding: .22rem 1.1rem; margin-bottom: .6rem; }
.pr-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.pr-title__c { display: inline-block; font-size: clamp(2.4rem,6vw,5rem); font-weight: 900; color: rgba(255,255,255,.8); will-change: transform,opacity,filter; text-shadow: 0 2px 20px rgba(0,0,0,.3);
  &.r { background: linear-gradient(150deg,#f04040,#ff6060,#4040f0,#6060ff,#40f040,#60ff60); background-size: 300% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: pr-title-shift 2s linear infinite; }
}
@keyframes pr-title-shift { to { background-position: -300% 0; } }
.pr-divider { width: 100px; height: 2px; margin: .5rem auto .6rem; background: linear-gradient(90deg,transparent,#f40,#40f,#0f0,transparent); }
.pr-sub { margin: 0; font-size: clamp(.66rem,1vw,.82rem); color: rgba(255,255,255,.4); max-width: 500px; margin-inline: auto; }
.pr-progress { position: absolute; left: 0; bottom: 0; z-index: 20; width: 100%; height: 2px; background: rgba(255,255,255,.03); }
.pr-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#f40,#40f,#0f0); }

@media (max-width: 768px) { .pr-header { top: 5vh; } .pr-badge { font-size: .44rem; } .pr-title__c { font-size: 1.8rem; } }
</style>
