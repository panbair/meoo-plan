<template>
  <section ref="rootRef" class="kal-root">
    <div ref="centerLight" class="kal-center-light"></div>

    <div ref="scrollRef" class="kal-scroll">
      <div ref="trackRef" class="kal-track" :style="{ height: trackHeight }">
        <div class="kal-sticky">

          <header ref="headerRef" class="kal-header">
            <span class="kal-kicker">🔮 CSS3 3D Kaleidoscope Tunnel · 万花筒隧镜 ◈</span>
            <h1 class="kal-title">
              <span ref="tc1" class="kal-title__c">万</span>
              <span ref="tc2" class="kal-title__c kal-title__c--kale">花</span>
              <span ref="tc3" class="kal-title__c">隧</span>
              <span ref="tc4" class="kal-title__c kal-title__c--kale">镜</span>
            </h1>
            <div ref="lineRef" class="kal-line"></div>
            <p class="kal-sub">向下滚动 · 六面镜反射隧道 · 图片碎片对称重复 · 万花筒深渊</p>
          </header>

          <div ref="sceneRef" class="kal-scene">
            <div ref="kaleRef" class="kal-kale">
              <!-- 6面镜壁（每面60°），递归10层 -->
              <div
                v-for="slice in slices"
                :key="slice.id"
                :ref="(el) => setSliceRef(el as HTMLElement, slice.id)"
                class="kal-slice"
              >
                <!-- 每面是一个三角形楔 -->
                <div class="kal-slice__panel">
                  <img :src="slice.image" :alt="slice.alt" class="kal-slice__img" />
                  <div class="kal-slice__reflect"></div>
                </div>
              </div>
            </div>
          </div>

          <div ref="kaleInfo" class="kal-info">
            <span class="kal-info__icon">🔮</span>
            <span class="kal-info__text">万花筒 {{ currentSegment }}/{{ SEGMENTS }} 瓣</span>
          </div>

          <div class="kal-progress"><div ref="progRef" class="kal-progress__fill"></div></div>
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

// ═══════════════════════════════════════════════════════════════════
//  CardImage3DKaleidoscopeTunnel — CSS3 3D 万花筒隧镜
//
//  核心概念：6面镜壁组成六边形隧道，图片碎片沿Z轴排列
//  1. 6个三角形楔形面（每面60°）构成六边形截面
//  2. 每个面上贴图片（利用CSS 3D旋转实现对称）
//  3. 12组图片碎片沿Z轴排列
//  4. 由于对称，万花筒效应：图片在6个方向重复反射
//  5. 用户竖滚 → 整体旋转+碎片向相机推进
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const SEGMENTS = 12
const trackHeight = `${7 * 100}vh`

const imagePool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
]

const slices = Array.from({ length: SEGMENTS }, (_, i) => ({
  id: i,
  image: imagePool[i % imagePool.length],
  alt: `花瓣${i + 1}`,
  z: -i * 220,
}))

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const kaleRef = ref<HTMLElement | null>(null)
const centerLight = ref<HTMLElement | null>(null)
const kaleInfo = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const sliceRefs = ref<(HTMLElement | null)[]>([])
const currentSegment = ref(1)
const cleanupFns: TweenCleanup[] = []

function setSliceRef(el: HTMLElement | null, idx: number) { sliceRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, scale: 0.1, rotateZ: 180, filter: 'blur(30px)' }, { autoAlpha: 1, scale: 1, rotateZ: 0, filter: 'blur(0px)', duration: 0.75, stagger: 0.12, ease: 'back.out(2.8)' }, '-=0.5')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.3')
    .fromTo(sceneRef.value, { autoAlpha: 0, rotateZ: 60, scale: 0.3 }, { autoAlpha: 1, rotateZ: 0, scale: 1, duration: 1.2, ease: 'power4.out' }, '-=0.5')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupKaleidoscope() {
  if (!scrollRef.value || !trackRef.value || !kaleRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  const els = sliceRefs.value.filter(Boolean) as HTMLElement[]

  // 初始：每个楔形片沿Z轴排列，等角度旋转
  els.forEach((el, i) => {
    const rotZ = i * 60 // 每60°一个楔形面
    gsap.set(el, { translateZ: slices[i].z, rotateZ: rotZ, scale: 1 - i * 0.1, opacity: 0.3 + (1 - i * 0.08) })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3,
      onUpdate(self) { currentSegment.value = Math.min(SEGMENTS, Math.max(1, Math.ceil(self.progress * SEGMENTS))) },
    },
  })

  const totalDist = SEGMENTS * 220 * 0.8
  // 🔮 所有楔形片向相机推进 + 各自绕Z轴旋转
  els.forEach((el, i) => {
    const rotZ = i * 60
    master.fromTo(el,
      { translateZ: slices[i].z, rotateZ: rotZ, scale: 1 - i * 0.1, opacity: 0.3 + (1 - i * 0.08) },
      { translateZ: slices[i].z + totalDist, rotateZ: rotZ + 120, scale: 1.3, opacity: 1, duration: 6, ease: 'power2.in' },
      0
    )
  })

  // 整体旋转
  if (kaleRef.value) {
    master.to(kaleRef.value, { rotateZ: 360, duration: 6, ease: 'sine.inOut' }, 0)
    master.to(kaleRef.value, { rotateX: -10, duration: 3, ease: 'sine.inOut' }, 0)
    master.to(kaleRef.value, { rotateX: 8, duration: 3, ease: 'sine.inOut' }, 3)
  }
  if (centerLight.value) master.to(centerLight.value, { scale: 2.5, opacity: 0.5, duration: 6, ease: 'power2.in' }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 6 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupKaleidoscope() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.kal-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: radial-gradient(circle at 50% 50%, #0a0a18 0%, #050510 70%, #020208 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.kal-center-light { position: absolute; width: 12vw; height: 12vw; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(circle, rgba(255,200,100,.35) 0%, rgba(255,150,50,.15) 30%, transparent 60%); filter: blur(50px); pointer-events: none; z-index: 0; will-change: transform,opacity; }
.kal-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2; &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,180,60,.2); } }
.kal-track { position: relative; width: 100%; }
.kal-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.kal-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.kal-kicker { display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .3em; text-transform: uppercase; color: rgba(255,180,80,.7); background: rgba(255,150,50,.08); backdrop-filter: blur(8px); border: 1px solid rgba(255,160,60,.18); border-radius: 999px; padding: .22rem .9rem; margin-bottom: .5rem; }
.kal-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.kal-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #f0b850; will-change: transform,opacity,filter;
  &--kale { background: linear-gradient(135deg, #f0b850, #ff8860, #e870c0, #70b8f0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 18px rgba(255,180,80,.6)); }
}
.kal-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #f0b850, #ff8860, #e870c0, #70b8f0, transparent); transform-origin: center; }
.kal-sub { margin: 0; font-size: clamp(.64rem, .9vw, .78rem); color: rgba(240,180,80,.3); max-width: 540px; margin-inline: auto; }

.kal-scene { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; perspective: 500px; perspective-origin: 50% 50%; will-change: transform,opacity; }
.kal-kale { position: relative; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

.kal-slice {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform,opacity;
  &__panel {
    position: absolute;
    width: min(24vw, 200px); height: min(36vw, 300px);
    margin-left: calc(min(24vw, 200px) / -2);
    margin-top: calc(min(36vw, 300px) / -2);
    // 楔形 - clip成三角形
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
    overflow: hidden; border-radius: 2px;
    box-shadow: 0 0 30px rgba(0,0,0,.4), 0 0 0 1px rgba(255,200,100,.1);
  }
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__reflect { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,200,100,.1) 0%, transparent 40%, transparent 70%, rgba(255,150,50,.08) 100%); pointer-events: none; }
}
.kal-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; align-items: center; gap: .4rem; pointer-events: none; }
.kal-info__icon { font-size: 1rem; }
.kal-info__text { font-size: .62rem; font-weight: 600; color: rgba(255,180,80,.6); letter-spacing: .12em; }
.kal-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,160,50,.05); }
.kal-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #f0b850, #ff8860, #e870c0, #70b8f0, #f0b850); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,180,80,.5); }

@media (max-width: 768px) { .kal-header { top: 2vh; } .kal-kicker { font-size: .42rem; padding: .1rem .4rem; } .kal-title__c { font-size: 1.3rem; } }
</style>
