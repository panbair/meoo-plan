<template>
  <section ref="rootRef" class="gr-root">
    <div ref="scrollRef" class="gr-scroll">
      <div ref="trackRef" class="gr-track" :style="{ height: trackHeight }">
        <div class="gr-sticky">

          <!-- 🔑 视频背景 -->
          <video ref="videoRef" class="gr-video"
            src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
            preload="auto" muted playsinline
          ></video>

          <!-- 🔑 故障条带 — 8条水平切片 -->
          <div class="gr-strips">
            <div v-for="s in 8" :key="s"
              :ref="el => { stripRefs[s-1] = el as HTMLElement | null }"
              class="gr-strip"
              :style="{ top: `${(s-1)*12.5}%`, height: '12.5%' }"
            >
              <div class="gr-strip__slice"></div>
              <div class="gr-strip__glitch"></div>
            </div>
          </div>

          <!-- 扫描线 -->
          <div class="gr-scan"></div>

          <header ref="headerRef" class="gr-header">
            <span ref="badgeRef" class="gr-badge">◆ 视频故障艺术 · Glitch Reveal ◆</span>
            <h1 class="gr-title">
              <span ref="tc1" class="gr-title__c">故</span>
              <span ref="tc2" class="gr-title__c gl">障</span>
              <span ref="tc3" class="gr-title__c">艺</span>
              <span ref="tc4" class="gr-title__c gl">术</span>
            </h1>
            <div ref="dividerRef" class="gr-divider"></div>
            <p ref="subRef" class="gr-sub">向下滚动 → 故障条带归位 · 视频从破碎到完整</p>
          </header>

          <div class="gr-progress"><div ref="progRef" class="gr-progress__fill"></div></div>
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

const STRIPS = 8; const STAGES = 6
const trackHeight = `${(STAGES + 1) * 100}vh`

const rootRef = ref<HTMLElement | null>(null); const videoRef = ref<HTMLVideoElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const badgeRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null); const subRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const stripRefs = ref<(HTMLElement | null)[]>(Array(STRIPS).fill(null))
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

function setupGlitch() {
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
        // 🔑 故障条带归位
        stripRefs.value.forEach((el, i) => {
          if (!el) return
          const baseX = (i % 2 === 0 ? 1 : -1) * (30 + i * 8) * (1 - self.progress)
          const baseY = (i % 3 === 0 ? 1 : -1) * (15 + i * 4) * (1 - self.progress)
          const skew = (i % 2 === 0 ? 10 : -10) * (1 - self.progress)
          el.style.transform = `translateX(${baseX}px) translateY(${baseY}px) skewX(${skew}deg)`
          el.style.opacity = String(.3 + self.progress * .7)
        })
        if (progRef.value) progRef.value.style.width = `${self.progress * 100}%`
      },
    },
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupGlitch() }))
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn()); cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.gr-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #000; font-family: 'Courier New','Inter','PingFang SC',monospace; }
.gr-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: scroll; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(0,255,120,.12); }
}
.gr-track { position: relative; width: 100%; }
.gr-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.gr-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; pointer-events: none; filter: brightness(.7) saturate(1.3); }

/* 🔑 故障条带 */
.gr-strips { position: absolute; inset: 0; z-index: 2; pointer-events: none; overflow: hidden; }
.gr-strip { position: absolute; left: 0; right: 0; will-change: transform, opacity; }
.gr-strip__slice { position: absolute; inset: 0; background: inherit; }
.gr-strip__glitch {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(0,255,120,.08) 20%, transparent 40%, rgba(255,0,120,.06) 60%, transparent 80%);
  animation: gr-flicker .15s infinite;
}
@keyframes gr-flicker { 0%,100% { opacity: 0; } 50% { opacity: 1; } }

.gr-scan { position: absolute; left: 0; width: 100%; height: 2px; z-index: 3; pointer-events: none;
  background: rgba(0,255,120,.3); box-shadow: 0 0 10px rgba(0,255,120,.2);
  animation: gr-scan-line 3s linear infinite;
}
@keyframes gr-scan-line { 0% { top: -2px; } 100% { top: 100%; } }

.gr-header { position: absolute; top: 8vh; left: 50%; transform: translateX(-50%); z-index: 10; text-align: center; width: min(92vw,800px); pointer-events: none; }
.gr-badge { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .28em; color: rgba(0,255,120,.8); background: rgba(0,200,80,.08); backdrop-filter: blur(10px); border: 1px solid rgba(0,255,120,.2); border-radius: 999px; padding: .22rem 1.1rem; margin-bottom: .6rem; }
.gr-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.gr-title__c { display: inline-block; font-size: clamp(2.4rem,6vw,5rem); font-weight: 900; color: rgba(0,255,120,.7); will-change: transform,opacity,filter; text-shadow: 0 0 10px rgba(0,255,100,.3);
  &.gl { color: #0f0; text-shadow: 0 0 8px rgba(0,255,0,.5), 2px 0 0 rgba(255,0,120,.4); }
}
.gr-divider { width: 100px; height: 2px; margin: .5rem auto .6rem; background: linear-gradient(90deg,transparent,#0f0,rgba(255,0,120,.6),#0f0,transparent); }
.gr-sub { margin: 0; font-size: clamp(.66rem,1vw,.82rem); color: rgba(0,255,100,.5); max-width: 500px; margin-inline: auto; }
.gr-progress { position: absolute; left: 0; bottom: 0; z-index: 20; width: 100%; height: 2px; background: rgba(0,255,120,.04); }
.gr-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#0f0,rgba(255,0,120,.6),#0f0); }

@media (max-width: 768px) { .gr-header { top: 5vh; } .gr-badge { font-size: .44rem; } .gr-title__c { font-size: 1.8rem; } }
</style>
