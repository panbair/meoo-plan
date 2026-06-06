<template>
  <section ref="rootRef" class="vf-root">
    <!-- 🔑 内部滚动容器 — .page 父级 overflow:hidden 要求必须内部滚动 -->
    <div ref="scrollRef" class="vf-scroll">
      <div ref="trackRef" class="vf-track" :style="{ height: trackHeight }">
        <div class="vf-sticky">

          <!-- 封面图 -->
          <img :src="posterUrl" alt="" class="vf-poster" />
          <!-- 视频 -->
          <video ref="videoRef" class="vf-video"
            src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
            preload="auto" muted playsinline
          ></video>

          <!-- 内容 -->
          <header ref="headerRef" class="vf-header">
            <span ref="badgeRef" class="vf-badge">◆ 滚动驱动视频 · Apple 风格 ◆</span>
            <h1 class="vf-title">
              <span ref="tc1" class="vf-title__c">视</span>
              <span ref="tc2" class="vf-title__c g">界</span>
              <span ref="tc3" class="vf-title__c">流</span>
              <span ref="tc4" class="vf-title__c g">光</span>
            </h1>
            <div ref="dividerRef" class="vf-divider"></div>
            <p ref="subRef" class="vf-sub">向下滚动 → 视频随滚动逐帧播放</p>
          </header>

          <div ref="midTextRef" class="vf-mid">
            <span class="vf-mid__icon">◈</span>
            <p class="vf-mid__text">每一帧都是风景<br />每一次滚动都是探索</p>
          </div>

          <div ref="bottomHintRef" class="vf-hint">
            <span class="vf-hint__arrow">↓</span>
            <span class="vf-hint__text">继续探索</span>
          </div>

          <div class="vf-progress"><div ref="progRef" class="vf-progress__fill"></div></div>
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

const posterUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
const STAGES = 6
const trackHeight = `${(STAGES + 1) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const midTextRef = ref<HTMLElement | null>(null)
const bottomHintRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const cleanupFns: TweenCleanup[] = []

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)

  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' },
  })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: .85, ease: 'power3.out' })
    .fromTo(badgeRef.value, { autoAlpha: 0, scale: .8, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: .6, ease: 'back.out(1.5)' }, '-=.5')
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: .3, filter: 'blur(10px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: .65, stagger: .1, ease: 'back.out(1.8)' }, '-=.35')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power3.inOut' }, '-=.2')
    .fromTo(subRef.value, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: .55, ease: 'power2.out' }, '-=.1')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupVideoScrub() {
  if (!scrollRef.value || !trackRef.value || !videoRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const video = videoRef.value

  // 🔑 暂停视频，完全由 scroll 控制帧位
  const initVideo = () => {
    video.pause()
    video.currentTime = video.duration * .05 // 跳至首帧
  }
  if (video.readyState >= 2) { initVideo() }
  else { video.addEventListener('loadedmetadata', initVideo, { once: true }) }

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        if (video.readyState >= 2 && video.duration > 0) {
          // 滚动进度 → 视频时间 (跳过首尾黑屏)
          video.currentTime = video.duration * .05 + self.progress * video.duration * .9
        }
        if (progRef.value) progRef.value.style.width = `${self.progress * 100}%`
      },
    },
  })

  master.fromTo(midTextRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.5, ease: 'power2.inOut' }, .8)
  master.to(midTextRef.value, { autoAlpha: 0, y: -30, duration: 1, ease: 'power2.in' }, 3)
  master.fromTo(bottomHintRef.value, { autoAlpha: 0, y: 20 }, { autoAlpha: .8, y: 0, duration: 1, ease: 'power2.out' }, 3.5)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupVideoScrub() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.vf-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #0a1628; font-family: 'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif; }

/* 🔑 内部滚动 — 标准模式 */
.vf-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: scroll; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.12); }
}
.vf-track { position: relative; width: 100%; }
.vf-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* 封面 + 视频 */
.vf-poster { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
.vf-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; filter: brightness(.85) saturate(1.1); pointer-events: none; }

/* 内容 */
.vf-header { position: absolute; top: 8vh; left: 50%; transform: translateX(-50%); z-index: 10; text-align: center; width: min(92vw,800px); pointer-events: none; }
.vf-badge { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .28em; color: rgba(255,255,255,.75); background: rgba(255,255,255,.08); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.15); border-radius: 999px; padding: .22rem 1.1rem; margin-bottom: .6rem; }
.vf-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.vf-title__c { display: inline-block; font-size: clamp(2.4rem,6vw,5rem); font-weight: 900; color: rgba(255,255,255,.85); will-change: transform,opacity,filter; text-shadow: 0 2px 20px rgba(0,0,0,.3);
  &.g { background: linear-gradient(150deg,#60c0f0,#a0e0ff,#d080f0,#f0a0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(100,180,240,.6)); }
}
.vf-divider { width: 100px; height: 2px; margin: .5rem auto .6rem; background: linear-gradient(90deg,transparent,rgba(255,255,255,.5),rgba(200,180,240,.6),rgba(255,255,255,.5),transparent); }
.vf-sub { margin: 0; font-size: clamp(.66rem,1vw,.82rem); color: rgba(255,255,255,.45); max-width: 500px; margin-inline: auto; }

.vf-mid { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 10; text-align: center; pointer-events: none; }
.vf-mid__icon { font-size: 2rem; color: rgba(255,255,255,.3); display: block; margin-bottom: .8rem; }
.vf-mid__text { margin: 0; font-size: clamp(1rem,2vw,1.6rem); font-weight: 300; line-height: 1.8; color: rgba(255,255,255,.6); }

.vf-hint { position: absolute; bottom: 8vh; left: 50%; transform: translateX(-50%); z-index: 10; text-align: center; pointer-events: none; }
.vf-hint__arrow { display: block; font-size: 1.2rem; color: rgba(255,255,255,.35); animation: vf-bounce 2s ease-in-out infinite; }
@keyframes vf-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
.vf-hint__text { font-size: .6rem; font-weight: 500; letter-spacing: .2em; color: rgba(255,255,255,.25); margin-top: .3rem; }

.vf-progress { position: absolute; left: 0; bottom: 0; z-index: 20; width: 100%; height: 2px; background: rgba(255,255,255,.04); }
.vf-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#60c0f0,#d080f0); }

@media (max-width: 768px) { .vf-header { top: 5vh; } .vf-badge { font-size: .44rem; } .vf-title__c { font-size: 1.8rem; } }
</style>
