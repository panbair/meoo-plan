<template>
  <section ref="rootRef" class="fb3-root">
    <div ref="ambL" class="fb3-amb fb3-amb--l"></div>
    <div ref="ambR" class="fb3-amb fb3-amb--r"></div>
    <canvas ref="canvasRef" class="fb3-canvas"></canvas>

    <div ref="scrollRef" class="fb3-scroll">
      <div ref="trackRef" class="fb3-track" :style="{ height: trackHeight }">
        <div class="fb3-sticky">

          <header ref="headerRef" class="fb3-header">
            <span class="fb3-kicker">📖 CSS 3D FlipBook · 立体翻书 📖</span>
            <h1 class="fb3-title">
              <span ref="tc1" class="fb3-title__c">立</span>
              <span ref="tc2" class="fb3-title__c fb3-title__c--3d">体</span>
              <span ref="tc3" class="fb3-title__c">翻</span>
              <span ref="tc4" class="fb3-title__c fb3-title__c--3d">书</span>
            </h1>
            <div ref="lineRef" class="fb3-line"></div>
            <p class="fb3-sub">向下滚动 · 3D书页翻动 · 每翻一页都是新的画面</p>
          </header>

          <!-- 📖 3D翻书场景 -->
          <div ref="bookStage" class="fb3-stage">
            <!-- 书本体 -->
            <div ref="bookRef" class="fb3-book">
              <!-- 左侧封底（固定） -->
              <div class="fb3-book__back">
                <img :src="pages[0].image" :alt="pages[0].alt" class="fb3-book__img" />
              </div>

              <!-- 右侧可翻页页 -->
              <div
                v-for="(page, idx) in pages"
                :key="page.id"
                :ref="(el) => setPageRef(el, idx)"
                class="fb3-page"
              >
                <!-- 页正面 -->
                <div class="fb3-page__front">
                  <img :src="page.image" :alt="page.alt" class="fb3-page__img" />
                  <span class="fb3-page__num">{{ page.label }}</span>
                </div>
                <!-- 页背面（下一页的镜像） -->
                <div class="fb3-page__back">
                  <img v-if="idx < pages.length - 1" :src="pages[idx + 1].image" :alt="pages[idx + 1].alt" class="fb3-page__img" />
                </div>
              </div>
            </div>
          </div>

          <div ref="pageLabel" class="fb3-label">{{ pages[currentPage]?.title }}</div>
          <div class="fb3-progress"><div ref="progRef" class="fb3-progress__fill"></div></div>
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
//  CardImage3DFlipBook — CSS3 3D立体翻书
//
//  核心概念：真实3D翻书效果
//  1. 每页是独立的3D平面
//  2. 翻页 = rotateY(0° → -180°) + transform-origin: left center
//  3. 页正面和背面各是一张图片（backface-visibility: hidden）
//  4. 翻页时页面有透视变形（perspective）
//  5. 翻过的页堆积在左侧，未翻的在右侧堆叠
//
//  用户竖滚 → 逐页翻动 → 如同翻阅一本精美的摄影集
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface BookPage {
  id: string; label: string; title: string; image: string; alt: string
}

const pages: BookPage[] = [
  { id: 'pg1', label: '01', title: '珊瑚海', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=900&q=80', alt: '珊瑚海' },
  { id: 'pg2', label: '02', title: '金色田', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80', alt: '金色田' },
  { id: 'pg3', label: '03', title: '蜜桃花', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80', alt: '蜜桃花' },
  { id: 'pg4', label: '04', title: '暖阳山', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80', alt: '暖阳山' },
  { id: 'pg5', label: '05', title: '天空林', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80', alt: '天空林' },
]

const PAGE_COUNT = pages.length
const trackHeight = `${(PAGE_COUNT + 2) * 100}vh`
const currentPage = ref(0)

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const bookStage = ref<HTMLElement | null>(null)
const bookRef = ref<HTMLElement | null>(null)
const pageLabel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ambL = ref<HTMLElement | null>(null)
const ambR = ref<HTMLElement | null>(null)

const pageRefs = ref<HTMLElement[]>([])
const setPageRef = (el: Element | null, i: number) => { if (el instanceof HTMLElement) pageRefs.value[i] = el }

const cleanupFns: TweenCleanup[] = []

// ═══════════════════════════ Canvas 翻书粒子 ═══════════════════════════
interface DustParticle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; maxLife: number }
let ctx: CanvasRenderingContext2D | null = null; let cw = 0; let ch = 0
const dusts: DustParticle[] = []; let animId = 0

function createDust(): DustParticle {
  return { x: Math.random() * cw, y: ch + 20, vx: (Math.random() - 0.5) * 0.6, vy: -(0.3 + Math.random() * 1.5), size: 1 + Math.random() * 2.5, alpha: 0.2 + Math.random() * 0.35, life: 0, maxLife: 180 + Math.random() * 300 }
}

function initCanvas() {
  const c = canvasRef.value; if (!c) return
  ctx = c.getContext('2d'); if (!ctx) return
  const resize = () => { cw = window.innerWidth; ch = window.innerHeight; c.width = cw; c.height = ch }
  resize(); window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))
  for (let i = 0; i < 40; i++) dusts.push(createDust())

  function animate() {
    if (!ctx) return; ctx.clearRect(0, 0, cw, ch)
    while (dusts.length < 40) dusts.push(createDust())
    for (let i = dusts.length - 1; i >= 0; i--) {
      const d = dusts[i]; d.life++
      if (d.life >= d.maxLife) { dusts.splice(i, 1); continue }
      d.x += d.vx; d.y += d.vy
      const t = d.life / d.maxLife; const fade = t < 0.1 ? t / 0.1 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
      ctx!.beginPath(); ctx!.arc(d.x, d.y, d.size, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(200,170,140,${d.alpha * fade})`; ctx!.fill()
      if (d.y < -20) { d.y = ch + 20; d.x = Math.random() * cw; d.life = 0 }
    }
    animId = requestAnimationFrame(animate)
  }
  animId = requestAnimationFrame(animate)
}

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !bookStage.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo([tc1.value, tc2.value, tc3.value, tc4.value], { autoAlpha: 0, z: -200, scale: 0.3 }, { autoAlpha: 1, z: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(bookStage.value, { autoAlpha: 0, rotateX: -15, scale: 0.85 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupFlipBook() {
  if (!scrollRef.value || !trackRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value
  const pages_ = pageRefs.value
  if (!pages_.length) return

  // 🔑 初始化所有页面
  pages_.forEach((page, i) => {
    // 每页初始：都在右侧堆叠（未翻状态 rotateY=0）
    // 前一页翻过后，当前页才能看到
    gsap.set(page, {
      zIndex: PAGE_COUNT - i,
      transformOrigin: 'left center',
      rotateY: 0,
    })
    // 已翻过的页旋转到-180°（翻到左边）
    if (i === 0) {
      // 第一页是封面，未翻
      gsap.set(page, { rotateY: 0 })
    }
  })

  // 书本整体3D透视
  if (bookStage.value) {
    gsap.set(bookStage.value, { perspective: 900 })
  }

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        currentPage.value = Math.min(PAGE_COUNT - 1, Math.max(0, Math.floor(self.progress * PAGE_COUNT)))
      },
    },
  })

  // 🔑 逐页翻动
  pages_.forEach((page, i) => {
    if (i >= PAGE_COUNT - 1) return // 最后一页不翻
    const o = i

    // 翻页动画：rotateY: 0° → -180°
    master.to(page, {
      rotateY: -180,
      duration: 0.7,
      ease: 'power2.inOut',
    }, o + 0.15)

    // 翻完后zIndex降低（放到已翻堆中）
    master.set(page, { zIndex: i }, o + 0.85)
  })

  // 书本整体轻微运动
  if (bookRef.value) {
    for (let i = 0; i < PAGE_COUNT; i++) {
      master.to(bookRef.value, { rotateY: 2, duration: 0.15, ease: 'sine.inOut' }, i + 0.15)
      master.to(bookRef.value, { rotateY: 0, duration: 0.2, ease: 'sine.inOut' }, i + 0.4)
    }
  }

  if (ambL.value && ambR.value) {
    master.to(ambL.value, { x: '6vw', y: '-4vh', scale: 1.15, duration: PAGE_COUNT }, 0)
    master.to(ambR.value, { x: '-4vw', y: '5vh', scale: 1.2, duration: PAGE_COUNT }, 0)
  }
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: PAGE_COUNT }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  initCanvas()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupFlipBook() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0; dusts.length = 0
})
</script>

<style scoped lang="scss">
.fb3-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(155deg, #fefaf7 0%, #fdf6f0 20%, #fef9f5 40%, #fdf7f1 60%, #fef8f4 80%, #fdf7f2 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }

.fb3-amb { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.fb3-amb--l { width: 28vw; height: 28vw; top: -4vh; left: 25vw; background: radial-gradient(circle, rgba(255,180,150,.4) 0%, transparent 70%); }
.fb3-amb--r { width: 24vw; height: 24vw; bottom: -4vh; right: 25vw; background: radial-gradient(circle, rgba(180,200,220,.35) 0%, transparent 70%); }

.fb3-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

.fb3-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(200,160,130,.3); &:hover { background: rgba(200,160,130,.5); } }
}
.fb3-track { position: relative; width: 100%; }
.fb3-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.fb3-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.fb3-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(180,130,100,.8); background: rgba(200,160,120,.1); backdrop-filter: blur(8px); border: 1px solid rgba(180,140,110,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.fb3-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.fb3-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #b88a60; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #c8956c, #8ab8d0, #b8a080); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 12px rgba(180,150,120,.4)); }
}
.fb3-line { width: 90px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #c8956c, #8ab8d0, transparent); transform-origin: center; }
.fb3-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(160,120,90,.5); max-width: 460px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 翻书 ═══════════════════════ */
.fb3-stage {
  position: absolute; top: 48%; left: 50%;
  transform: translate(-50%, -54%);
  width: 0; height: 0;
  z-index: 10;
  perspective: 900px;                  // 🔑 翻书透视
  perspective-origin: 55% 50%;
  will-change: transform, opacity;
}

.fb3-book {
  position: absolute;
  width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* 左侧底板（第一页作为底） */
.fb3-book__back {
  position: absolute;
  width: 36vw; max-width: 340px;
  height: 48vw; max-height: 440px;
  margin-left: calc(-36vw + 1px);
  margin-top: calc(-24vw);
  border-radius: 4px 12px 12px 4px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,.15);
}
.fb3-book__img { width: 100%; height: 100%; object-fit: cover; }

/* 🔑 可翻页 */
.fb3-page {
  position: absolute;
  width: 36vw; max-width: 340px;
  height: 48vw; max-height: 440px;
  margin-left: calc(-36vw + 1px);
  margin-top: calc(-24vw);
  transform-style: preserve-3d;
  will-change: transform;
}

/* 页正面 */
.fb3-page__front {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  border-radius: 4px 12px 12px 4px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,.15);
}

/* 页背面 */
.fb3-page__back {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  transform: rotateY(180deg);          // 🔑 背面镜像
  border-radius: 12px 4px 4px 12px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,.15);
}

.fb3-page__img { width: 100%; height: 100%; object-fit: cover; }

.fb3-page__num {
  position: absolute; bottom: 10px; right: 12px; z-index: 2;
  font-size: .58rem; font-weight: 700; letter-spacing: .15em;
  color: #fff; text-shadow: 0 2px 6px rgba(0,0,0,.5);
  background: rgba(0,0,0,.2); backdrop-filter: blur(4px);
  border-radius: 999px; padding: .15rem .6rem;
}

.fb3-label { position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); z-index: 25; font-size: .7rem; font-weight: 700; letter-spacing: .25em; color: #b88a60; background: rgba(255,255,255,.45); backdrop-filter: blur(8px); border-radius: 999px; padding: .25rem 1rem; pointer-events: none; }

.fb3-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(200,160,120,.06); }
.fb3-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #c8956c, #8ab8d0, #b8a080, #c8956c); background-size: 200% 100%; box-shadow: 0 0 10px rgba(180,140,110,.45); }

@media (max-width: 768px) {
  .fb3-header { top: 2vh; } .fb3-kicker { font-size: .54rem; padding: .2rem .65rem; } .fb3-title__c { font-size: 1.7rem; }
  .fb3-page, .fb3-book__back { width: 50vw; height: 65vw; margin-left: calc(-50vw + 2px); margin-top: -32.5vw; }
}
</style>
