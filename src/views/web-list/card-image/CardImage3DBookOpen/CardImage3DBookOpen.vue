<template>
  <section ref="rootRef" class="book-root">
    <!-- 台灯光晕 -->
    <div ref="lampGlow" class="book-lamp"></div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="book-scroll">
      <div ref="trackRef" class="book-track" :style="{ height: trackHeight }">
        <div class="book-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="book-header">
            <span class="book-kicker">📖 CSS3 3D Book · 精装翻书 ◈</span>
            <h1 class="book-title">
              <span ref="tc1" class="book-title__c">精</span>
              <span ref="tc2" class="book-title__c book-title__c--page">装</span>
              <span ref="tc3" class="book-title__c">翻</span>
              <span ref="tc4" class="book-title__c book-title__c--page">书</span>
            </h1>
            <div ref="lineRef" class="book-line"></div>
            <p class="book-sub">向下滚动 · 精装书缓缓翻开 · 封面→扉页→内页→封底 · 一页一世界</p>
          </header>

          <!-- 🔑 3D 书本场景 -->
          <div ref="sceneRef" class="book-scene">
            <div ref="bookRef" class="book-object">

              <!-- 硬壳封面 (左半) -->
              <div ref="coverLeft" class="book-cover book-cover--left">
                <div class="book-cover__board">
                  <img :src="pages[0].image" :alt="pages[0].alt" class="book-cover__img" />
                  <div class="book-cover__spine-text">精装典藏</div>
                </div>
                <div class="book-cover__thickness"></div>
              </div>

              <!-- 硬壳封面 (右半) -->
              <div ref="coverRight" class="book-cover book-cover--right">
                <div class="book-cover__board">
                  <img :src="pages[4].image" :alt="pages[4].alt" class="book-cover__img" />
                  <div class="book-cover__spine-text">精装典藏</div>
                </div>
                <div class="book-cover__thickness"></div>
              </div>

              <!-- 内页1 (左) -->
              <div ref="page1" class="book-page book-page--1">
                <div class="book-page__content">
                  <img :src="pages[1].image" :alt="pages[1].alt" class="book-page__img" />
                  <span class="book-page__num">01</span>
                </div>
              </div>

              <!-- 内页2 (右) -->
              <div ref="page2" class="book-page book-page--2">
                <div class="book-page__content">
                  <img :src="pages[2].image" :alt="pages[2].alt" class="book-page__img" />
                  <span class="book-page__num">02</span>
                </div>
              </div>

              <!-- 内页3 (左) -->
              <div ref="page3" class="book-page book-page--3">
                <div class="book-page__content">
                  <img :src="pages[3].image" :alt="pages[3].alt" class="book-page__img" />
                  <span class="book-page__num">03</span>
                </div>
              </div>

              <!-- 书脊 -->
              <div class="book-spine">
                <div class="book-spine__rib"></div>
                <div class="book-spine__rib"></div>
                <div class="book-spine__rib"></div>
              </div>
            </div>
          </div>

          <!-- 页码指示 -->
          <div ref="pageIndicator" class="book-page-indicator">
            <span class="book-page-indicator__current">{{ currentPage + 1 }}</span>
            <span class="book-page-indicator__sep">/</span>
            <span class="book-page-indicator__total">{{ totalPages }}</span>
          </div>

          <div class="book-progress"><div ref="progRef" class="book-progress__fill"></div></div>
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
//  CardImage3DBookOpen — CSS3 3D 精装翻书
//
//  核心概念：CSS3D模拟真实精装书的翻开过程
//  1. 初始状态：书本合拢（封面朝上）
//  2. 用户竖滚 → 封面沿书脊旋转打开（rotateY -180°）
//  3. 接着内页逐张翻过（每页 rotateY 从 0→-180°）
//  4. 每张"页"都是一张全幅图片
//  5. 书脊侧可见纸张厚度和装订线
//
//  青春时尚配色：暖黄 · 书页米白 · 咖啡棕 · 鎏金
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface PageData {
  title: string; image: string; alt: string
}

const pages: PageData[] = [
  { title: '封面', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80', alt: '封面·海滩' },
  { title: '第一章', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=900&q=80', alt: '第一章·山谷' },
  { title: '第二章', image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=900&q=80', alt: '第二章·星空' },
  { title: '第三章', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80', alt: '第三章·森林' },
  { title: '封底', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80', alt: '封底·花朵' },
]

const totalPages = pages.length
const trackHeight = `${(totalPages + 2) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const bookRef = ref<HTMLElement | null>(null)
const coverLeft = ref<HTMLElement | null>(null)
const coverRight = ref<HTMLElement | null>(null)
const page1 = ref<HTMLElement | null>(null)
const page2 = ref<HTMLElement | null>(null)
const page3 = ref<HTMLElement | null>(null)
const pageIndicator = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const lampGlow = ref<HTMLElement | null>(null)

const currentPage = ref(0)
const cleanupFns: TweenCleanup[] = []

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value, scroller: scrollRef.value,
      start: 'top 75%', toggleActions: 'play none none reverse'
    }
  })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, rotateY: 90, scale: 0.5 }, { autoAlpha: 1, rotateY: 0, scale: 1, duration: 0.65, stagger: 0.1, ease: 'back.out(2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(sceneRef.value, { autoAlpha: 0, y: 100, rotateX: 20 }, { autoAlpha: 1, y: 0, rotateX: -5, duration: 1, ease: 'power4.out' }, '-=0.4')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupBookOpen() {
  if (!scrollRef.value || !trackRef.value || !bookRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  const coverL = coverLeft.value; const coverR = coverRight.value
  const pg1 = page1.value; const pg2 = page2.value; const pg3 = page3.value
  const scene = sceneRef.value

  // 初始状态：书本合拢（封面朝上），略微倾斜展示立体感
  if (scene) gsap.set(scene, { rotateX: -5, rotateY: -10 })

  // 🔑 关键 transform-origin 设置：
  // 左半边沿右边缘翻转（transform-origin: right center）
  // 右半边沿左边缘翻转（transform-origin: left center）
  if (coverL) gsap.set(coverL, { transformOrigin: 'right center' })
  if (coverR) gsap.set(coverR, { transformOrigin: 'left center' })
  if (pg1) gsap.set(pg1, { transformOrigin: 'right center' })
  if (pg2) gsap.set(pg2, { transformOrigin: 'left center' })
  if (pg3) gsap.set(pg3, { transformOrigin: 'right center' })

  // 合拢状态：右半边 rotateY(0) 覆盖在左半边之上
  if (coverR) gsap.set(coverR, { rotateY: 0 })
  if (coverL) gsap.set(coverL, { rotateY: 0 })
  if (pg1) gsap.set(pg1, { rotateY: 0 })
  if (pg2) gsap.set(pg2, { rotateY: 0 })
  if (pg3) gsap.set(pg3, { rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        const idx = Math.min(totalPages - 1, Math.max(0, Math.round(self.progress * (totalPages - 1))))
        currentPage.value = idx
      },
    },
  })

  // 📖 翻书动画序列：
  // 阶段0→1: 封面翻开（右半封面 rotateY: 0→-170°）
  if (coverR) {
    master.to(coverR, { rotateY: -175, duration: 1.2, ease: 'power2.inOut' }, 0)
    // 封面翻开后略微恢复（展示翻页后的自然弧度）
    master.to(coverR, { rotateY: -168, duration: 0.3, ease: 'sine.out' }, 1.2)
  }
  // 左半封面微微张开
  if (coverL) {
    master.to(coverL, { rotateY: -8, duration: 0.5, ease: 'power2.out' }, 0.3)
  }

  // 阶段1→2: 第一张内页翻过 (page1 从右翻到左)
  if (pg1) {
    master.to(pg1, { rotateY: -175, duration: 1.0, ease: 'power2.inOut' }, 1.5)
    master.to(pg1, { rotateY: -170, duration: 0.2, ease: 'sine.out' }, 2.5)
  }

  // 阶段2→3: 第二张内页翻过 (page2 从左翻到右)
  if (pg2) {
    master.to(pg2, { rotateY: 175, duration: 1.0, ease: 'power2.inOut' }, 2.7)
    master.to(pg2, { rotateY: 170, duration: 0.2, ease: 'sine.out' }, 3.7)
  }

  // 阶段3→4: 第三张内页翻过 (page3 从右翻到左)
  if (pg3) {
    master.to(pg3, { rotateY: -175, duration: 1.0, ease: 'power2.inOut' }, 3.9)
    master.to(pg3, { rotateY: -170, duration: 0.2, ease: 'sine.out' }, 4.9)
  }

  // 场景轻微旋转，让翻书过程更有立体感
  if (scene) {
    master.to(scene, { rotateY: 15, duration: 2, ease: 'sine.inOut' }, 0)
    master.to(scene, { rotateY: -10, duration: 2, ease: 'sine.inOut' }, 2.5)
    master.to(scene, { rotateY: 5, duration: 1, ease: 'sine.inOut' }, 4.5)
  }

  // 台灯光晕位移
  if (lampGlow.value) {
    master.to(lampGlow.value, { y: '-10vh', opacity: 0.85, scale: 1.1, duration: totalPages }, 0)
  }

  // 页码指示器
  if (pageIndicator.value) {
    for (let i = 0; i < totalPages; i++) {
      master.to(pageIndicator.value, { scale: 1.3, opacity: 1, duration: 0.1, ease: 'power2.out' }, i + 0.25)
      master.to(pageIndicator.value, { scale: 1, opacity: 0.7, duration: 0.25, ease: 'power2.in' }, i + 0.35)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: totalPages }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupBookOpen() }))
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
.book-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(170deg, #fdf8f0 0%, #faf3e6 20%, #fdf6ec 40%, #faf2e4 60%, #fcf5eb 80%, #fdf7ef 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', 'Georgia', serif;
}

.book-lamp {
  position: absolute; width: 45vw; height: 35vw; top: -5vh; left: 28vw;
  border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0;
  background: radial-gradient(circle, rgba(255,210,150,.5) 0%, rgba(255,180,100,.2) 40%, transparent 70%);
  will-change: transform, opacity;
}

.book-scroll {
  position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(200,150,100,.2); &:hover { background: rgba(200,150,100,.4); } }
}
.book-track { position: relative; width: 100%; }
.book-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.book-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.book-kicker { display: inline-block; font-size: .64rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(180,120,70,.8); background: rgba(200,140,80,.08); backdrop-filter: blur(8px); border: 1px solid rgba(200,130,70,.18); border-radius: 999px; padding: .28rem 1.1rem; margin-bottom: .5rem; }
.book-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.book-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #b07040; will-change: transform,opacity;
  &--page { background: linear-gradient(135deg, #c89050, #e0b870, #c89050); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 10px rgba(200,150,80,.4)); }
}
.book-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #c89050, #e0b870, #c89050, transparent); transform-origin: center; }
.book-sub { margin: 0; font-size: clamp(.68rem, .95vw, .82rem); color: rgba(160,110,60,.45); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 书本场景 ═══════════════════════ */
.book-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

.book-object {
  position: relative;
  width: min(75vw, 620px);
  height: min(52vw, 430px);
  margin-left: calc(min(75vw, 620px) / -2);
  margin-top: calc(min(52vw, 430px) / -2);
  transform-style: preserve-3d;
}

/* ═══════════ 封面 ═══════════ */
.book-cover {
  position: absolute;
  top: 0; width: 50%; height: 100%;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;

  &--left  { left: 0; }
  &--right { right: 0; }

  &__board {
    position: relative; width: 100%; height: 100%;
    border-radius: 2px; overflow: hidden;
    backface-visibility: hidden;
    box-shadow: 0 0 40px rgba(0,0,0,.2), inset 0 0 0 1px rgba(255,255,255,.15);
    background: #3a2218;
  }
  &__img { width: 100%; height: 100%; object-fit: cover; }
  &__thickness {
    position: absolute; top: 0; width: 6px; height: 100%;
    background: linear-gradient(90deg, #5a3a28, #3a2218, #2a1810);
    &--left { right: 0; transform: rotateY(90deg); }
    &--right { left: 0; transform: rotateY(-90deg); }
  }
  &__spine-text {
    position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 2;
    font-size: .55rem; font-weight: 700; letter-spacing: .2em;
    color: rgba(255,220,180,.6); text-transform: uppercase;
  }

  /* 左封面合上时覆盖在右封面上 */
  &--left { z-index: 20; }
  &--right { z-index: 19; }
}

/* ═══════════ 内页 ═══════════ */
.book-page {
  position: absolute;
  top: 0; width: 50%; height: 100%;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;

  &--1 { left: 50%; z-index: 18; }  // 右页
  &--2 { left: 0;   z-index: 17; }  // 左页
  &--3 { left: 50%; z-index: 16; }  // 右页

  &__content {
    position: relative; width: 100%; height: 100%;
    background: #fef9f3;
    border-radius: 1px; overflow: hidden;
    backface-visibility: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,.1), inset 0 0 0 1px rgba(0,0,0,.05);
  }
  &__img { width: 100%; height: 100%; object-fit: cover; }
  &__num {
    position: absolute; bottom: 10px; right: 12px; z-index: 2;
    font-size: .65rem; font-weight: 800; color: rgba(0,0,0,.3);
    font-family: 'Georgia', serif;
  }
}

/* ═══════════ 书脊 ═══════════ */
.book-spine {
  position: absolute; left: 50%; top: 0; width: 8px; height: 100%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #2a1810, #5a3a28, #2a1810);
  border-radius: 2px 0 0 2px;
  display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 20px;
  z-index: 25;
  &__rib { width: 5px; height: 3px; background: rgba(255,220,180,.3); border-radius: 1px; }
}

/* 页码指示器 */
.book-page-indicator {
  position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25;
  display: flex; align-items: baseline; gap: .15rem;
  pointer-events: none; will-change: transform, opacity; opacity: .7;
  font-family: 'Georgia', serif;
  &__current { font-size: 1.6rem; font-weight: 900; color: #b07040; }
  &__sep { font-size: .8rem; color: rgba(160,100,50,.4); }
  &__total { font-size: .8rem; color: rgba(160,100,50,.35); }
}

.book-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(200,140,80,.06); }
.book-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #c89050, #e0b870, #c89050); background-size: 200% 100%; box-shadow: 0 0 10px rgba(200,150,100,.4); }

@media (max-width: 768px) {
  .book-header { top: 2vh; } .book-kicker { font-size: .5rem; padding: .18rem .6rem; } .book-title__c { font-size: 1.6rem; }
  .book-object { width: 85vw; height: 60vw; margin-left: -42.5vw; margin-top: -30vw; }
  .book-spine { width: 5px; }
  .book-cover__thickness { width: 4px; }
}
</style>
