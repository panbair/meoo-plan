<template>
  <section ref="rootRef" class="kv-root">
    <div ref="scrollRef" class="kv-scroll">
      <div ref="trackRef" class="kv-track" :style="{ height: trackHeight }">
        <div class="kv-sticky">

          <!-- 🔑 视频背景 -->
          <video ref="videoRef" class="kv-video"
            src="https://videos.pexels.com/video-files/34957693/14808289_360_640_30fps.mp4"
            preload="auto" muted playsinline
          ></video>

          <!-- 🔑 碎片覆盖层 — 4×3=12片 -->
          <div class="kv-mosaic">
            <div v-for="tile in tiles" :key="tile.id"
              :ref="el => { tileRefs[tile.id] = el as HTMLElement | null }"
              class="kv-tile"
              :style="{ '--tx': tile.x + 'px', '--ty': tile.y + 'px', '--rot': tile.rot + 'deg' }"
            ></div>
          </div>

          <header ref="headerRef" class="kv-header">
            <span ref="badgeRef" class="kv-badge">◆ 视频马赛克 · 碎片拼接 ◆</span>
            <h1 class="kv-title">
              <span ref="tc1" class="kv-title__c">碎</span>
              <span ref="tc2" class="kv-title__c g">片</span>
              <span ref="tc3" class="kv-title__c">拼</span>
              <span ref="tc4" class="kv-title__c g">接</span>
            </h1>
            <div ref="dividerRef" class="kv-divider"></div>
            <p ref="subRef" class="kv-sub">向下滚动 → 碎片从四周飞来拼合成完整视频</p>
          </header>

          <div class="kv-progress"><div ref="progRef" class="kv-progress__fill"></div></div>
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

const COLS = 4; const ROWS = 3; const TOTAL = COLS * ROWS

// 碎片初始偏移 — 从四周飞入
const tiles = Array.from({ length: TOTAL }, (_, i) => {
  const col = i % COLS; const row = Math.floor(i / COLS)
  const cx = (COLS - 1) / 2; const ry = (ROWS - 1) / 2
  const dx = (col - cx) * 300; const dy = (row - ry) * 250
  const dist = Math.sqrt(dx * dx + dy * dy)
  return { id: i, x: dx, y: dy, rot: (Math.random() - .5) * 60, dist }
})

const STAGES = 6; const trackHeight = `${(STAGES + 1) * 100}vh`

const rootRef = ref<HTMLElement | null>(null); const videoRef = ref<HTMLVideoElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null); const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null); const badgeRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null); const subRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const tileRefs = ref<(HTMLElement | null)[]>(Array(TOTAL).fill(null))
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

function setupMosaic() {
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
        if (progRef.value) progRef.value.style.width = `${self.progress * 100}%`
        // 🔑 碎片归位 — 越接近100%越聚拢
        tileRefs.value.forEach((el, i) => {
          if (!el) return
          const t = tiles[i]
          const p = self.progress
          const tx = t.x * (1 - p); const ty = t.y * (1 - p) // 从远处回归
          const rot = t.rot * (1 - p)
          const opacity = .3 + p * .7
          const gap = (1 - p) * 12 // 拼合间隙逐渐缩小
          el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`
          el.style.opacity = String(opacity)
          el.style.setProperty('--gap', gap + 'px')
        })
      },
    },
  })

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupMosaic() }))
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn()); cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.kv-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #000; font-family: 'Inter','PingFang SC','Microsoft YaHei',system-ui,sans-serif; }
.kv-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: scroll; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.12); }
}
.kv-track { position: relative; width: 100%; }
.kv-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.kv-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; filter: brightness(.9); pointer-events: none; }

/* 🔑 碎片马赛克 */
.kv-mosaic { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(3, 1fr); pointer-events: none; }
.kv-tile { --gap: 12px; --tx: 0px; --ty: 0px; --rot: 0deg;
  background: #0a1628; border: 1px solid rgba(255,255,255,.06);
  will-change: transform, opacity;
}

.kv-header { position: absolute; top: 8vh; left: 50%; transform: translateX(-50%); z-index: 10; text-align: center; width: min(92vw,800px); pointer-events: none; }
.kv-badge { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .28em; color: rgba(255,255,255,.75); background: rgba(255,255,255,.08); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.15); border-radius: 999px; padding: .22rem 1.1rem; margin-bottom: .6rem; }
.kv-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.kv-title__c { display: inline-block; font-size: clamp(2.4rem,6vw,5rem); font-weight: 900; color: rgba(255,255,255,.85); will-change: transform,opacity,filter; text-shadow: 0 2px 20px rgba(0,0,0,.3);
  &.g { background: linear-gradient(150deg,#f0a060,#ffc080,#f08060,#ffa070); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(240,150,80,.6)); }
}
.kv-divider { width: 100px; height: 2px; margin: .5rem auto .6rem; background: linear-gradient(90deg,transparent,rgba(255,255,255,.5),rgba(240,160,100,.6),rgba(255,255,255,.5),transparent); }
.kv-sub { margin: 0; font-size: clamp(.66rem,1vw,.82rem); color: rgba(255,255,255,.45); max-width: 500px; margin-inline: auto; }
.kv-progress { position: absolute; left: 0; bottom: 0; z-index: 20; width: 100%; height: 2px; background: rgba(255,255,255,.04); }
.kv-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg,#f0a060,#f08060); }

@media (max-width: 768px) { .kv-header { top: 5vh; } .kv-badge { font-size: .44rem; } .kv-title__c { font-size: 1.8rem; } }
</style>
