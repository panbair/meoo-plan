<template>
  <section ref="rootRef" class="ss-root">
    <!-- ═══════════════ 背景：暗黑虚空 ═══════════════ -->
    <div class="ss-bg">
      <div class="ss-bg__void"></div>
      <div class="ss-bg__stars"></div>
      <div class="ss-bg__dust"></div>
    </div>

    <!-- ═══════════════ 追光光源（跟随scroll移动的暖光区） ═══════════════ -->
    <div class="ss-light-source" ref="lightSourceRef">
      <div class="ss-light-source__core"></div>
      <div class="ss-light-source__rays"></div>
      <div class="ss-light-source__spill"></div>
    </div>

    <!-- ═══════════════ 3D场景 ═══════════════ -->
    <div class="ss-scene" ref="sceneRef">
      <!-- 深度雾层（近→远） -->
      <div class="ss-depth-haze dh-near"></div>
      <div class="ss-depth-haze dh-far"></div>

      <!-- ===== 近景层 (Z=0, 5张) ===== -->
      <div class="ss-plane ss-plane--near" ref="planeNearRef">
        <div
          v-for="img in nearImages" :key="img.id"
          class="ss-card-slot"
          :style="{ transform: `translateX(${img.x}) translateY(${img.y})` }"
        >
          <div class="ss-card ss-card--near" :ref="(el) => setCardRef(el, img.id)">
            <div class="ss-card__glow" :style="{ '--glow': img.glow }"></div>
            <div class="ss-card__inner">
              <img :src="img.image" :alt="img.alt" class="ss-card__img" loading="eager" />
              <div class="ss-card__border"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 中景层 (Z=-380, 5张) ===== -->
      <div class="ss-plane ss-plane--mid" ref="planeMidRef">
        <div
          v-for="img in midImages" :key="img.id"
          class="ss-card-slot"
          :style="{ transform: `translateX(${img.x}) translateY(${img.y})` }"
        >
          <div class="ss-card ss-card--mid" :ref="(el) => setCardRef(el, img.id)">
            <div class="ss-card__glow" :style="{ '--glow': img.glow }"></div>
            <div class="ss-card__inner">
              <img :src="img.image" :alt="img.alt" class="ss-card__img" loading="eager" />
              <div class="ss-card__border"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 远景层 (Z=-760, 5张) ===== -->
      <div class="ss-plane ss-plane--far" ref="planeFarRef">
        <div
          v-for="img in farImages" :key="img.id"
          class="ss-card-slot"
          :style="{ transform: `translateX(${img.x}) translateY(${img.y})` }"
        >
          <div class="ss-card ss-card--far" :ref="(el) => setCardRef(el, img.id)">
            <div class="ss-card__glow" :style="{ '--glow': img.glow }"></div>
            <div class="ss-card__inner">
              <img :src="img.image" :alt="img.alt" class="ss-card__img" loading="eager" />
              <div class="ss-card__border"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ 氛围遮罩 ═══════════════ -->
    <div class="ss-vignette"></div>

    <!-- ═══════════════ 滚动 & UI ═══════════════ -->
    <div ref="scrollRef" class="ss-scroll">
      <div ref="trackRef" class="ss-track" :style="{ height: trackHeight }">
        <div class="ss-sticky">
          <header ref="headerRef" class="ss-header">
            <span class="ss-kicker">💡 Spotlight Sweep · 追光扫射</span>
            <h1 class="ss-title">
              <span ref="tSpot" class="ss-title__w">追光</span>
              <span ref="tSweep" class="ss-title__w ss-title__w--alt">画廊</span>
            </h1>
            <div ref="headerLineRef" class="ss-line"></div>
            <p class="ss-sub">向下滚动 · 暖光从左向右扫过三层空间 · 照片逐次绽放</p>
          </header>

          <div ref="infoRef" class="ss-info">
            <span class="ss-info__hint">{{ spotlightHint }}</span>
            <span class="ss-info__no">{{ spotlightCount }}</span>
            <h3>{{ spotlightTitle }}</h3>
          </div>

          <div class="ss-progress"><div ref="progressRef" class="ss-progress__fill"></div></div>
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

// ── 图片数据模型 ──
interface SpotImage {
  id: string; title: string; image: string; alt: string
  x: string; y: string; glow: string
}

// ═══════════════════════════════════════════
// 三层 × 每层5张 = 15张照片
// = 按 X 坐标从左到右排列，追光从左扫到右
// ═══════════════════════════════════════════
const nearImages: SpotImage[] = [
  { id:'n1', title:'极光',   image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', alt:'极光',   x:'-52vw', y:'-8vh',  glow:'rgba(100,220,180,0.7)' },
  { id:'n2', title:'森林',   image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', alt:'森林',   x:'-26vw', y:'6vh',   glow:'rgba(80,200,100,0.65)' },
  { id:'n3', title:'繁花',   image:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80', alt:'繁花',   x:'0vw',   y:'-3vh',  glow:'rgba(240,140,180,0.7)' },
  { id:'n4', title:'海浪',   image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', alt:'海浪',   x:'26vw',  y:'8vh',   glow:'rgba(60,160,220,0.65)' },
  { id:'n5', title:'日出',   image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', alt:'日出',   x:'52vw',  y:'-5vh',  glow:'rgba(240,160,80,0.7)' },
]

const midImages: SpotImage[] = [
  { id:'m1', title:'远山',   image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', alt:'远山',   x:'-45vw', y:'10vh',  glow:'rgba(200,180,140,0.5)' },
  { id:'m2', title:'沙漠',   image:'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', alt:'沙漠',   x:'-15vw', y:'-12vh', glow:'rgba(240,180,100,0.5)' },
  { id:'m3', title:'峡谷',   image:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', alt:'峡谷',   x:'10vw',  y:'14vh',  glow:'rgba(180,150,100,0.48)' },
  { id:'m4', title:'星河',   image:'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=600&q=80', alt:'星河',   x:'38vw',  y:'-10vh', glow:'rgba(140,120,220,0.5)' },
  { id:'m5', title:'星云',   image:'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&q=80', alt:'星云',   x:'-38vw', y:'-6vh',  glow:'rgba(100,180,220,0.48)' },
]

const farImages: SpotImage[] = [
  { id:'f1', title:'星系',   image:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80', alt:'星系',   x:'-48vw', y:'-14vh', glow:'rgba(180,100,200,0.3)' },
  { id:'f2', title:'彗星',   image:'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80', alt:'彗星',   x:'-20vw', y:'16vh',  glow:'rgba(200,200,240,0.3)' },
  { id:'f3', title:'极光2',  image:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', alt:'极光2',  x:'5vw',   y:'-18vh', glow:'rgba(120,200,180,0.28)' },
  { id:'f4', title:'星空',   image:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80', alt:'星空',   x:'30vw',  y:'15vh',  glow:'rgba(150,180,220,0.3)' },
  { id:'f5', title:'深空',   image:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80', alt:'深空',   x:'-35vw', y:'0vh',   glow:'rgba(100,140,200,0.28)' },
]

const allImages = [...nearImages, ...midImages, ...farImages]
const totalImages = allImages.length
const trackHeight = `${(totalImages + 2) * 105}vh`

// ── 追光状态 ──
const spotlightCount = ref('01')
const spotlightTitle = ref('极光')
const spotlightHint = ref('追光扫过 · 近景层')

// ── Refs ──
const rootRef = ref<HTMLElement|null>(null)
const scrollRef = ref<HTMLElement|null>(null)
const trackRef = ref<HTMLElement|null>(null)
const sceneRef = ref<HTMLElement|null>(null)
const lightSourceRef = ref<HTMLElement|null>(null)
const planeNearRef = ref<HTMLElement|null>(null)
const planeMidRef = ref<HTMLElement|null>(null)
const planeFarRef = ref<HTMLElement|null>(null)
const headerRef = ref<HTMLElement|null>(null)
const headerLineRef = ref<HTMLElement|null>(null)
const tSpot = ref<HTMLElement|null>(null)
const tSweep = ref<HTMLElement|null>(null)
const infoRef = ref<HTMLElement|null>(null)
const progressRef = ref<HTMLElement|null>(null)
const cardRefs = ref<Record<string, HTMLElement>>({})
const setCardRef = (el: Element|null, id: string) => { if (el instanceof HTMLElement) cardRefs.value[id] = el }
const cleanupFns: TweenCleanup[] = []

// ── 预加载 ──
function preload(): Promise<void[]> {
  return Promise.all(allImages.map(f =>
    new Promise<void>(r => { const i = new Image(); i.onload = () => r(); i.onerror = () => r(); i.src = f.image })
  ))
}

// ── 入场动画 ──
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !infoRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  tl.fromTo(headerRef.value, { autoAlpha:0, y:48 }, { autoAlpha:1, y:0, duration:.8, ease:'power3.out' })
    .fromTo(tSpot.value!, { autoAlpha:0, x:-35, scale:.5 }, { autoAlpha:1, x:0, scale:1, duration:.6, ease:'back.out(2)' }, '-=.35')
    .fromTo(tSweep.value!, { autoAlpha:0, x:35, scale:.5 }, { autoAlpha:1, x:0, scale:1, duration:.6, ease:'back.out(2)' }, '-=.4')
    .fromTo(headerLineRef.value!, { scaleX:0 }, { scaleX:1, duration:.5, ease:'power3.inOut' }, '-=.2')
    .fromTo(sceneRef.value!, { autoAlpha:0 }, { autoAlpha:1, duration:.7, ease:'power2.out' }, '-=.25')
    .fromTo(lightSourceRef.value!, { autoAlpha:0 }, { autoAlpha:1, duration:.8, ease:'power2.out' }, '-=.35')
    .fromTo(infoRef.value!, { autoAlpha:0, y:20 }, { autoAlpha:1, y:0, duration:.5, ease:'power2.out' }, '-=.15')

  // 照片以"追光激活"顺序交错入场
  // near 层: X从左到右 (-52vw → 52vw)
  const nearOrdered = [...nearImages].sort((a,b) => parseFloat(a.x) - parseFloat(b.x))
  const midOrdered  = [...midImages].sort((a,b) => parseFloat(a.x) - parseFloat(b.x))
  const farOrdered  = [...farImages].sort((a,b) => parseFloat(a.x) - parseFloat(b.x))
  const ordered = [...nearOrdered, ...midOrdered, ...farOrdered]

  ordered.forEach((img, i) => {
    const card = cardRefs.value[img.id]
    if (card) {
      tl.fromTo(card, { autoAlpha:0, scale:0.4, y:25 }, { autoAlpha:1, scale:1, y:0, duration:.55, ease:'back.out(1.5)' }, `-=${.5 - i * .04}`)
    }
  })

  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ── 核心：追光扫射动画 ──
// 每张照片在其X位置对应的scroll时刻触发"绽放"（brightness↑ scale↑ filter恢复）
function setupSpotlightSweep() {
  if (!scrollRef.value || !trackRef.value) return
  const sc = scrollRef.value; const track = trackRef.value

  // 按X位置映射scroll时刻：X=-60vw→0%, X=+60vw→100%
  // 但为了给首尾照片留出充分展示空间，映射范围略宽
  const X_MIN = -58; const X_MAX = 58 // vw

  function xToProgress(xVw: string): number {
    const v = parseFloat(xVw)
    return gsap.utils.clamp(0.05, 0.95, (v - X_MIN) / (X_MAX - X_MIN))
  }

  const mtl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller: sc,
      start: 'top top', end: 'bottom bottom', scrub: 1.3,
      onUpdate(self) {
        const p = self.progress
        // 找到离追光中心最近的照片
        const spotX = X_MIN + p * (X_MAX - X_MIN)
        let bestImg: SpotImage|null = null; let bestDist = Infinity
        allImages.forEach(img => {
          const d = Math.abs(parseFloat(img.x) - spotX)
          if (d < bestDist) { bestDist = d; bestImg = img }
        })
        if (bestImg) {
          const idx = allImages.indexOf(bestImg!)
          spotlightCount.value = String(idx + 1).padStart(2, '0')
          spotlightTitle.value = bestImg!.title
          if (nearImages.includes(bestImg!)) spotlightHint.value = '追光扫过 · 近景层'
          else if (midImages.includes(bestImg!)) spotlightHint.value = '追光扫过 · 中景层'
          else spotlightHint.value = '追光扫过 · 远景层'
        }
      },
    },
  })

  // 追光光源移动（光源在X轴上从-60vw滑到+60vw）
  if (lightSourceRef.value) {
    mtl.fromTo(lightSourceRef.value, { xPercent: -100 }, { xPercent: 100, duration: totalImages, ease:'none' }, 0)
  }

  // ── 为每张照片创建"追光绽放"tween序列 ──
  // 设计方案：每张照片在3个维度上同时响应追光
  //   (a) brightness: 暗→亮→暗, 通过CSS filter控制
  //   (b) scale: 照片微放大 (scale 1→1.07→1)
  //   (c) glow aura: 光晕透明度 低→高→低

  allImages.forEach((img) => {
    const card = cardRefs.value[img.id]
    if (!card) return

    const center = xToProgress(img.x)       // 追光中心到达该照片的时刻
    const dur = 1.4 / totalImages            // 追光在该照片上的持续时间（窗口宽度）
    const isNear = nearImages.includes(img)
    const isMid = midImages.includes(img)

    // 不同深度层使用不同的窗口宽度和峰值
    const windowMult = isNear ? 0.8 : (isMid ? 1.1 : 1.5)  // 近=窄峰(锐利), 远=宽峰(柔和)
    const w = dur * windowMult
    const peakBrightness = isNear ? 1.35 : (isMid ? 1.22 : 1.12)
    const peakScale = isNear ? 1.07 : (isMid ? 1.05 : 1.03)

    // (a) brightness: 使用GSAP的filter属性
    mtl.to(card, {
      filter: `brightness(${peakBrightness})`,
      duration: w * 0.35, ease: 'power2.out'
    }, Math.max(0, center - w * 0.35))
    mtl.to(card, {
      filter: 'brightness(0.35)',
      duration: w * 0.5, ease: 'power2.in'
    }, Math.max(0, center + w * 0.1))

    // (b) scale: 微放大弹跳
    mtl.to(card, {
      scale: peakScale,
      duration: w * 0.3, ease: 'back.out(1.3)'
    }, Math.max(0, center - w * 0.28))
    mtl.to(card, {
      scale: 0.88,
      duration: w * 0.45, ease: 'power2.in'
    }, Math.max(0, center + w * 0.08))

    // (c) 光晕透明度 → 通过CSS变量控制
    const glowEl = card.querySelector('.ss-card__glow') as HTMLElement|null
    if (glowEl) {
      mtl.to(glowEl, {
        opacity: isNear ? 0.8 : (isMid ? 0.55 : 0.35),
        duration: w * 0.3, ease: 'power2.out'
      }, Math.max(0, center - w * 0.25))
      mtl.to(glowEl, {
        opacity: 0.08,
        duration: w * 0.5, ease: 'power2.in'
      }, Math.max(0, center + w * 0.12))
    }
  })

  // 进度条
  if (progressRef.value) {
    mtl.to(progressRef.value, { width: '100%', duration: totalImages }, 0)
  }

  cleanupFns.push(() => { mtl.scrollTrigger?.kill(); mtl.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(async () => {
  await preload()
  // 设置初始卡片为暗态
  Object.values(cardRefs.value).forEach(card => {
    gsap.set(card, { filter: 'brightness(0.35)', scale: 0.88 })
  })
  // 设置初始光晕为暗
  Object.values(cardRefs.value).forEach(card => {
    const glow = card.querySelector('.ss-card__glow') as HTMLElement|null
    if (glow) gsap.set(glow, { opacity: 0.08 })
  })

  requestAnimationFrame(() => requestAnimationFrame(() => {
    setupEntrance()
    setupSpotlightSweep()
  }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(s => s.kill())
  cleanupFns.forEach(f => f()); cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════ 根容器 ═══════════════ */
.ss-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: #030812;
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

/* ═══════════════ 背景 ═══════════════ */
.ss-bg { position: absolute; inset: 0; z-index: 0; }
.ss-bg__void {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 50% 38% at 50% 42%, #0a1222 0%, #050a18 50%, #020510 100%);
}
.ss-bg__stars {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(0.6px 0.6px at 5% 10%, rgba(200,210,240,0.45), transparent),
    radial-gradient(0.4px 0.4px at 18% 22%, rgba(255,255,255,0.35), transparent),
    radial-gradient(0.8px 0.8px at 32% 8%, rgba(180,200,240,0.5), transparent),
    radial-gradient(0.5px 0.5px at 48% 28%, rgba(220,220,250,0.4), transparent),
    radial-gradient(0.7px 0.7px at 62% 12%, rgba(190,210,240,0.45), transparent),
    radial-gradient(0.4px 0.4px at 78% 35%, rgba(255,255,255,0.3), transparent),
    radial-gradient(0.9px 0.9px at 12% 48%, rgba(180,200,240,0.55), transparent),
    radial-gradient(0.5px 0.5px at 42% 55%, rgba(210,220,250,0.35), transparent),
    radial-gradient(0.6px 0.6px at 70% 52%, rgba(190,200,240,0.4), transparent),
    radial-gradient(0.4px 0.4px at 88% 18%, rgba(200,210,250,0.4), transparent),
    radial-gradient(0.7px 0.7px at 8% 68%, rgba(180,200,240,0.35), transparent),
    radial-gradient(0.5px 0.5px at 55% 72%, rgba(200,210,240,0.3), transparent),
    radial-gradient(0.3px 0.3px at 92% 58%, rgba(255,255,255,0.25), transparent);
  pointer-events: none;
}
.ss-bg__dust {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 30% 20% at 25% 45%, rgba(40,60,100,0.06), transparent),
    radial-gradient(ellipse 25% 15% at 70% 40%, rgba(30,50,80,0.05), transparent),
    radial-gradient(ellipse 35% 25% at 50% 50%, rgba(20,40,70,0.04), transparent);
  pointer-events: none;
}

/* ═══════════════ 追光光源 ═══════════════ */
.ss-light-source {
  position: absolute; top: 50%; left: 50%; width: 0; height: 0; z-index: 5;
  transform-style: preserve-3d; pointer-events: none;
  will-change: transform;
}
.ss-light-source__core {
  position: absolute;
  width: 60px; height: 60px; margin-left: -30px; margin-top: -30px;
  background: radial-gradient(circle, rgba(255,240,220,0.25) 0%, rgba(255,200,140,0.08) 40%, transparent 70%);
  border-radius: 50%;
}
.ss-light-source__rays {
  position: absolute;
  width: 500px; height: 500px; margin-left: -250px; margin-top: -250px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg, rgba(255,220,180,0.02) 8deg, transparent 16deg,
    transparent 60deg, rgba(255,200,150,0.015) 68deg, transparent 76deg,
    transparent 120deg, rgba(255,220,180,0.02) 128deg, transparent 136deg,
    transparent 180deg, rgba(255,200,150,0.015) 188deg, transparent 196deg,
    transparent 240deg, rgba(255,220,180,0.02) 248deg, transparent 256deg,
    transparent 300deg, rgba(255,200,150,0.015) 308deg, transparent 316deg,
    transparent 360deg
  );
  border-radius: 50%;
  animation: ssRaysSpin 20s linear infinite;
}
@keyframes ssRaysSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.ss-light-source__spill {
  position: absolute;
  width: 200px; height: 400px; margin-left: -100px; margin-top: -200px;
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,210,150,0.06), transparent 70%);
  filter: blur(30px);
}

/* ═══════════════ 3D场景 ═══════════════ */
.ss-scene {
  position: absolute; inset: 0; z-index: 2;
  perspective: 1000px;
  perspective-origin: 50% 40%;
  transform-style: preserve-3d;
  pointer-events: none;
}

/* 深度雾层 */
.ss-depth-haze {
  position: absolute; left: -5%; width: 110%; pointer-events: none; filter: blur(35px);
}
.dh-near { top: 0; height: 50%; z-index: 6;
  background: radial-gradient(ellipse 60% 70% at 50% 100%, rgba(15,25,45,0.15), transparent 65%); }
.dh-far  { top: 0; height: 65%; z-index: 16;
  background: radial-gradient(ellipse 50% 60% at 50% 100%, rgba(10,18,35,0.2), transparent 60%); }

/* ── 空间平面 ── */
.ss-plane {
  position: absolute; top: 50%; left: 50%; width: 0; height: 0;
  transform-style: preserve-3d;
}
.ss-plane--near { transform: translateZ(0px);    z-index: 13; }
.ss-plane--mid  { transform: translateZ(-380px); z-index: 12; }
.ss-plane--far  { transform: translateZ(-760px); z-index: 11; }

/* ── 卡片槽 ── */
.ss-card-slot {
  position: absolute; top: 0; left: 0; width: 0; height: 0;
  transform-style: preserve-3d;
}

/* ── 卡片基础 ── */
.ss-card {
  position: absolute; transform-style: preserve-3d;
  will-change: transform, filter;
}

/* 近景卡 (大, 清晰, 锐利响应追光) */
.ss-card--near {
  width: clamp(145px, 22vw, 240px);
  height: clamp(242px, 36.7vw, 400px);
  margin-left: calc(clamp(145px, 22vw, 240px) / -2);
  margin-top: calc(clamp(242px, 36.7vw, 400px) / -2);
}
.ss-card--near .ss-card__inner {
  box-shadow: 0 16px 40px rgba(0,0,0,0.48), 0 0 0 3px rgba(255,255,255,0.16), 0 0 0 5px rgba(0,0,0,0.16);
}

/* 中景卡 (中) */
.ss-card--mid {
  width: clamp(105px, 15.8vw, 173px);
  height: clamp(175px, 26.4vw, 288px);
  margin-left: calc(clamp(105px, 15.8vw, 173px) / -2);
  margin-top: calc(clamp(175px, 26.4vw, 288px) / -2);
}
.ss-card--mid .ss-card__inner {
  box-shadow: 0 10px 28px rgba(0,0,0,0.38), 0 0 0 2px rgba(255,255,255,0.1), 0 0 0 3px rgba(0,0,0,0.1);
}

/* 远景卡 (小, 模糊, 柔和响应追光) */
.ss-card--far {
  width: clamp(72px, 10.8vw, 118px);
  height: clamp(120px, 18vw, 197px);
  margin-left: calc(clamp(72px, 10.8vw, 118px) / -2);
  margin-top: calc(clamp(120px, 18vw, 197px) / -2);
}
.ss-card--far .ss-card__inner {
  box-shadow: 0 6px 18px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05), 0 0 0 2px rgba(0,0,0,0.06);
}

/* ── 光晕 ── */
.ss-card__glow {
  position: absolute; inset: -20px; border-radius: 5px; z-index: -1;
  background: radial-gradient(ellipse 60% 50% at 50% 50%, var(--glow, rgba(100,160,220,0.5)), transparent 75%);
  filter: blur(15px); opacity: 0.08; pointer-events: none;
  will-change: opacity;
}

/* ── 照片主体 ── */
.ss-card__inner {
  position: relative; width: 100%; height: 100%; border-radius: 3px; overflow: hidden;
}
.ss-card__img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.ss-card__border {
  position: absolute; inset: 0; pointer-events: none;
  border: 1px solid rgba(255,255,255,0.07); border-radius: 3px;
}

/* ═══════════════ 暗角 ═══════════════ */
.ss-vignette {
  position: absolute; inset: 0; z-index: 4; pointer-events: none;
  background: radial-gradient(ellipse 52% 40% at 50% 42%, transparent 28%, rgba(2,4,12,0.7) 100%);
}

/* ═══════════════ 滚动 & UI ═══════════════ */
.ss-scroll {
  position: relative; width: 100%; height: 100%;
  overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 1;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,255,255,.05); }
}
.ss-track { position: relative; width: 100%; }
.ss-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.ss-header {
  position: absolute; top: 3vh; left: 50%; transform: translateX(-50%);
  z-index: 30; text-align: center; width: min(90vw, 640px);
}
.ss-kicker {
  display: inline-block; font-size: .5rem; font-weight: 700; letter-spacing: .18em;
  text-transform: uppercase; color: rgba(160,180,210,.48);
  background: rgba(255,255,255,.02); backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,.04); border-radius: 999px;
  padding: .14rem .65rem; margin-bottom: .26rem;
}
.ss-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.ss-title__w {
  font-size: clamp(1.35rem, 3.4vw, 2.5rem); font-weight: 900;
  color: #b4c8e0; text-shadow: 0 0 12px rgba(180,160,100,.2);
  will-change: transform, opacity;
}
.ss-title__w--alt {
  background: linear-gradient(180deg, #ffe8c8, #d4a050, #b07030);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ss-line {
  width: 48px; height: 1.5px; margin: .16rem auto .2rem; border-radius: 2px;
  background: linear-gradient(90deg, transparent, #c09050, #d4a860, transparent);
  transform-origin: center;
}
.ss-sub {
  margin: 0; font-size: clamp(.46rem, .65vw, .56rem);
  color: rgba(140,130,110,.25); line-height: 1.4; max-width: 310px; margin-inline: auto;
}

/* ── 信息面板 ── */
.ss-info {
  position: absolute; bottom: 5vh; left: 50%; transform: translateX(-50%);
  z-index: 30; text-align: center; display: flex; flex-direction: column; align-items: center; gap: .06rem;
}
.ss-info__hint {
  font-size: .46rem; font-weight: 600; letter-spacing: .14em;
  color: rgba(160,140,100,.3); text-transform: uppercase;
}
.ss-info__no {
  font-size: .58rem; font-weight: 300; letter-spacing: .08em;
  color: rgba(200,180,140,.25); font-family: 'Georgia', serif;
}
.ss-info h3 { margin: 0; font-size: clamp(.62rem, 1.1vw, .84rem); font-weight: 600; color: rgba(180,150,110,.45); letter-spacing: .04em; }

/* ── 进度条 ── */
.ss-progress {
  position: absolute; left: 0; bottom: 0; z-index: 30;
  width: 100%; height: 1.5px; background: rgba(255,255,255,.01);
}
.ss-progress__fill {
  width: 0; height: 100%;
  background: linear-gradient(90deg, #805030, #c09050, #805030);
  background-size: 200% 100%;
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .ss-card--near { width: 115px; height: 192px; margin-left: -57px; margin-top: -96px; }
  .ss-card--mid  { width: 83px;  height: 138px; margin-left: -41px; margin-top: -69px; }
  .ss-card--far  { width: 58px;  height: 97px;  margin-left: -29px; margin-top: -48px; }
  .ss-title__w { font-size: 1.05rem; }
  .ss-light-source__core { width: 40px; height: 40px; margin-left: -20px; margin-top: -20px; }
  .ss-light-source__rays { width: 300px; height: 300px; margin-left: -150px; margin-top: -150px; }
}
</style>
