<template>
  <section ref="rootRef" class="dc-root">
    <div ref="glowA" class="dc-glow dc-glow--a"></div>
    <div ref="glowB" class="dc-glow dc-glow--b"></div>

    <div ref="scrollRef" class="dc-scroll">
      <div ref="trackRef" class="dc-track" :style="{ height: trackHeight }">
        <div class="dc-sticky">

          <header ref="headerRef" class="dc-header">
            <span class="dc-kicker">🁫 CSS3 3D · 多米诺连锁 · 骨牌效应 ◈</span>
            <h1 class="dc-title">
              <span ref="tc1" class="dc-title__c">骨</span>
              <span ref="tc2" class="dc-title__c dc-title__c--fall">牌</span>
              <span ref="tc3" class="dc-title__c">连</span>
              <span ref="tc4" class="dc-title__c dc-title__c--fall">锁</span>
            </h1>
            <div ref="dividerRef" class="dc-divider"></div>
            <p ref="subRef" class="dc-sub">
              向下滚动 · {{ COLS }}×{{ ROWS }}={{ TOTAL }}张骨牌3D依次倒下 · 正反双面图片 · 物理连锁
            </p>
          </header>

          <!-- ════════════════ 3D 多米诺场景 ════════════════ -->
          <div ref="sceneRef" class="dc-scene">
            <div ref="stageRef" class="dc-stage">

              <!-- 🔑 多米诺骨牌 — 更大、更清晰 -->
              <div
                v-for="domino in dominoes"
                :key="domino.id"
                :ref="el => { dominoRefs[domino.id] = el as HTMLElement | null }"
                class="dc-domino"
                :style="{
                  transform: `translateX(${domino.x}px) translateY(${domino.y}px)`,
                }"
              >
                <!-- 骨牌主体 -->
                <div class="dc-domino__body">
                  <!-- 正面 — 图片 -->
                  <div class="dc-domino__face dc-domino__face--front">
                    <img :src="domino.frontImg" :alt="''" class="dc-domino__img" loading="lazy" />
                    <span class="dc-domino__index">{{ domino.id + 1 }}</span>
                  </div>
                  <!-- 背面 — 不同图片 -->
                  <div class="dc-domino__face dc-domino__face--back">
                    <img :src="domino.backImg" :alt="''" class="dc-domino__img" loading="lazy" />
                  </div>
                  <!-- 🔑 3D厚度 — 4个侧边 -->
                  <div class="dc-domino__edge dc-domino__edge--top"></div>
                  <div class="dc-domino__edge dc-domino__edge--bottom"></div>
                  <div class="dc-domino__edge dc-domino__edge--left"></div>
                  <div class="dc-domino__edge dc-domino__edge--right"></div>
                </div>
                <!-- 🔑 倒影阴影 -->
                <div class="dc-domino__shadow"></div>
              </div>

            </div>
          </div>

          <div ref="infoRef" class="dc-info">
            <span class="dc-info__icon">🁫</span>
            <span class="dc-info__text">已倒下 {{ fallenCount }}/{{ TOTAL }} · 连锁反应中</span>
          </div>

          <div class="dc-progress"><div ref="progRef" class="dc-progress__fill"></div></div>
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

// ═══════════════ 更大更清晰的骨牌布局 ═══════════════
const COLS = 5; const ROWS = 3; const TOTAL = COLS * ROWS
const trackHeight = `${10 * 100}vh`

// 图片池
const frontPool = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80',
]
const backPool = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80',
  'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=400&q=80',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&q=80',
]

// 🔑 骨牌在3D空间中的位置 (蛇形排列 — 从左到右, 来回)
const dominoW = 130; const dominoH = 180
const gapX = 20; const gapY = 40
const totalW = (COLS - 1) * (dominoW + gapX)
const totalH = (ROWS - 1) * (dominoH + gapY)

const dominoes = Array.from({ length: TOTAL }, (_, i) => {
  const row = Math.floor(i / COLS)
  const col = i % COLS
  // 蛇形排列：偶数行左→右，奇数行右→左
  const actualCol = row % 2 === 0 ? col : (COLS - 1 - col)
  return {
    id: i,
    col: actualCol,
    row,
    x: actualCol * (dominoW + gapX) - totalW / 2,
    y: row * (dominoH + gapY) - totalH / 2,
    frontImg: frontPool[i % frontPool.length],
    backImg: backPool[i % backPool.length],
  }
})

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null); const glowB = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null); const progRef = ref<HTMLElement | null>(null)
const fallenCount = ref(0)
const dominoRefs = ref<(HTMLElement | null)[]>(Array(TOTAL).fill(null))
const cleanupFns: TweenCleanup[] = []

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: .85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, rotateX: -90, scale: .3 }, { autoAlpha: 1, rotateX: 0, scale: 1, duration: .7, stagger: .12, ease: 'back.out(2.5)' }, '-.5')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power3.inOut' }, '-.25')
    .fromTo(sceneRef.value, { autoAlpha: 0, rotateX: -15, scale: .85 }, { autoAlpha: 1, rotateX: -6, scale: 1, duration: 1, ease: 'power4.out' }, '-.4')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupDominoChain() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const els = dominoRefs.value.filter(Boolean) as HTMLElement[]

  // 🔑 初始状态：骨牌竖直站立
  els.forEach(el => {
    gsap.set(el, { transformOrigin: '50% 100%', rotateX: 0 })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        fallenCount.value = Math.min(TOTAL, Math.max(0, Math.floor(self.progress * TOTAL * 1.15)))
      },
    },
  })

  // 🔑 蛇形连锁倒下
  // 每行内从左到右依次倒下，行间有传播延迟
  els.forEach((el, i) => {
    const d = dominoes[i]
    // 蛇形顺序确保物理正确
    const chainOrder = d.row * COLS + d.col
    const baseDelay = chainOrder * 0.12 // 每张骨牌间隔0.12s

    // ① 骨牌开始倾斜 (被前一张推倒)
    master.to(el, { rotateX: -75, duration: .35, ease: 'power3.in' }, baseDelay)

    // ② 加速倒下 (重力作用)
    master.to(el, { rotateX: -88, duration: .1, ease: 'power2.in' }, baseDelay + .35)

    // ③ 撞击地面微弹
    master.to(el, { rotateX: -86, duration: .06, ease: 'sine.out' }, baseDelay + .45)
    master.to(el, { rotateX: -90, duration: .15, ease: 'power2.in' }, baseDelay + .51)

    // 🔑 当前骨牌撞击下一张的瞬间 — 施加向前推力
    if (chainOrder < TOTAL - 1) {
      const nextDelay = (chainOrder + 1) * 0.12
      master.to(el, { x: '+=3', duration: .04, ease: 'power2.out' }, nextDelay - .04)
      master.to(el, { x: '-=3', duration: .08, ease: 'power2.in' }, nextDelay)
    }
  })

  // 🔑 场景视角微调 — 见证连锁反应
  master.to(stage, { rotateX: -8, rotateY: 3, duration: 2, ease: 'sine.inOut' }, 0)
  master.to(stage, { rotateX: -4, rotateY: -2, duration: 2, ease: 'sine.inOut' }, 3)
  master.to(stage, { rotateX: -10, rotateY: 0, duration: 2, ease: 'sine.inOut' }, 6)
  master.to(stage, { rotateX: -6, rotateY: 0, duration: 2, ease: 'sine.inOut' }, 8)

  // 环境光
  if (glowA.value) master.to(glowA.value, { x: '8vw', y: '-4vh', scale: 1.2, duration: 9 }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-5vw', y: '3vh', scale: 1.15, duration: 9 }, 0)

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 9 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupDominoChain() }))
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
/* ═══════════════ 暗色骨牌空间 ═══════════════ */
.dc-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #141210 0%, #0a0806 55%, #020100 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.dc-glow { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.dc-glow--a { width: 30vw; height: 30vw; top: 5vh; left: 15vw; background: radial-gradient(circle, rgba(220,160,80,.12) 0%, transparent 70%); }
.dc-glow--b { width: 26vw; height: 26vw; bottom: 8vh; right: 12vw; background: radial-gradient(circle, rgba(200,140,60,.08) 0%, transparent 70%); }

.dc-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(220,160,80,.12); }
}
.dc-track { position: relative; width: 100%; }
.dc-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.dc-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.dc-kicker { display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .26em; color: rgba(220,160,80,.65); background: rgba(200,140,60,.06); backdrop-filter: blur(8px); border: 1px solid rgba(200,140,60,.15); border-radius: 999px; padding: .2rem .85rem; margin-bottom: .5rem; }
.dc-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.dc-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.4rem); font-weight: 900; color: #d0a050; will-change: transform,opacity;
  &--fall { background: linear-gradient(140deg, #e8b860 0%, #c88030 25%, #f0c870 50%, #d09040 75%, #e8b860 100%); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 12px rgba(220,160,60,.5)); }
}
.dc-divider { width: 100px; height: 2px; margin: .4rem auto .55rem; background: linear-gradient(90deg, transparent, #e8b860, #c88030, #f0c870, transparent); transform-origin: center; }
.dc-sub { margin: 0; font-size: clamp(.6rem, .9vw, .74rem); color: rgba(200,140,60,.3); max-width: 550px; margin-inline: auto; }

/* ═══════════════ 3D 场景 ═══════════════ */
.dc-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 42%;
  will-change: transform, opacity;
}
.dc-stage { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

/* ═══════════════ 🔑 骨牌 ═══════════════ */
.dc-domino {
  position: absolute; transform-style: preserve-3d;
  will-change: transform;
}
.dc-domino__body {
  position: absolute; transform-style: preserve-3d;
  width: 130px; height: 180px;
  margin-left: -65px; margin-top: -180px; // 🔑 旋转轴在底部 (transform-origin: 50% 100%)
}

/* 正面/背面 */
.dc-domino__face {
  position: absolute; inset: 0; border-radius: 4px; overflow: hidden;
  backface-visibility: hidden;
}
.dc-domino__face--front {
  background: #1a1814;
  box-shadow: 0 0 0 1px rgba(255,255,255,.06), 0 4px 16px rgba(0,0,0,.3);
}
.dc-domino__face--back {
  background: #0e0c08;
  transform: rotateY(180deg);
  box-shadow: 0 0 0 1px rgba(255,255,255,.04), 0 4px 16px rgba(0,0,0,.3);
}
.dc-domino__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.dc-domino__index {
  position: absolute; top: 6px; left: 8px;
  font-size: .7rem; font-weight: 900; color: rgba(255,255,255,.6);
  text-shadow: 0 1px 3px rgba(0,0,0,.5); font-family: 'Courier New', monospace;
}

/* 🔑 3D厚度 — 4个侧边 */
.dc-domino__edge {
  position: absolute; background: linear-gradient(180deg, #2a1a0c, #4a3020);
  backface-visibility: hidden;
}
.dc-domino__edge--top {
  top: 0; left: 0; right: 0; height: 6px;
  transform: rotateX(90deg); transform-origin: top center;
  border-radius: 4px 4px 0 0;
}
.dc-domino__edge--bottom {
  bottom: 0; left: 0; right: 0; height: 6px;
  transform: rotateX(-90deg); transform-origin: bottom center;
  border-radius: 0 0 4px 4px;
}
.dc-domino__edge--left {
  top: 0; bottom: 0; left: 0; width: 6px;
  transform: rotateY(-90deg); transform-origin: left center;
}
.dc-domino__edge--right {
  top: 0; bottom: 0; right: 0; width: 6px;
  transform: rotateY(90deg); transform-origin: right center;
}

/* 🔑 倒影阴影 */
.dc-domino__shadow {
  position: absolute; bottom: -8px; left: 50%;
  width: 100px; height: 12px; margin-left: -50px;
  background: rgba(0,0,0,.4); border-radius: 50%;
  filter: blur(6px);
  transform: translateZ(-2px);
}

.dc-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; align-items: center; gap: .4rem; pointer-events: none; }
.dc-info__icon { font-size: .9rem; }
.dc-info__text { font-size: .58rem; font-weight: 600; color: rgba(220,160,60,.55); letter-spacing: .08em; }

.dc-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(200,140,40,.04); }
.dc-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #e8b860, #c88030, #f0c870, #e8b860); background-size: 200% 100%; box-shadow: 0 0 10px rgba(220,160,60,.4); }

@media (max-width: 768px) {
  .dc-header { top: 2vh; } .dc-kicker { font-size: .38rem; } .dc-title__c { font-size: 1.5rem; }
  .dc-domino__body { width: 90px; height: 126px; margin-left: -45px; margin-top: -126px; }
  .dc-scene { perspective: 600px; }
}
</style>
