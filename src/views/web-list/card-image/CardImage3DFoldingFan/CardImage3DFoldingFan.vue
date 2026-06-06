<template>
  <section ref="rootRef" class="fan-root">
    <!-- 背景氛围 -->
    <div ref="bgGlow" class="fan-bg-glow"></div>
    <div ref="bgRing1" class="fan-bg-ring fan-bg-ring--1"></div>
    <div ref="bgRing2" class="fan-bg-ring fan-bg-ring--2"></div>

    <div ref="scrollRef" class="fan-scroll">
      <div ref="trackRef" class="fan-track" :style="{ height: trackHeight }">
        <div class="fan-sticky">

          <header ref="headerRef" class="fan-header">
            <span class="fan-kicker">◈ CSS3 3D Folding Fan · 巨扇展开 ◈</span>
            <h1 class="fan-title">
              <span ref="tc1" class="fan-title__c">巨</span>
              <span ref="tc2" class="fan-title__c fan-title__c--gilded">扇</span>
              <span ref="tc3" class="fan-title__c">展</span>
              <span ref="tc4" class="fan-title__c fan-title__c--gilded">开</span>
            </h1>
            <div ref="lineRef" class="fan-line"></div>
            <p class="fan-sub">向下滚动 · 24根扇骨3D巨幅展开240° · 从合拢一线到遮天扇面</p>
          </header>

          <div ref="sceneRef" class="fan-scene">
            <div ref="fanRef" class="fan">

              <!-- 🔑 扇骨 — 24根 -->
              <div
                v-for="(rib, idx) in ribs"
                :key="idx"
                :ref="(el) => setRibRef(el as HTMLElement, idx)"
                class="fan-rib"
                :class="{
                  'fan-rib--outer': idx === 0 || idx === RIB_COUNT - 1,
                  'fan-rib--accent': idx % 4 === 0,
                  'fan-rib--center': idx === Math.floor(RIB_COUNT / 2),
                }"
                :style="{ '--rib-idx': idx, '--total': RIB_COUNT }"
              >
                <!-- 扇面纸 — 楔形 -->
                <div class="fan-leaf">
                  <img :src="rib.image" :alt="rib.alt" class="fan-leaf__img" />
                  <!-- 金边装饰线 -->
                  <div class="fan-leaf__edge"></div>
                  <!-- 渐变从图到透明边缘 -->
                  <div class="fan-leaf__blend"></div>
                </div>
                <!-- 扇骨本体 -->
                <div class="fan-bone">
                  <div class="fan-bone__body"></div>
                  <div class="fan-bone__tip"></div>
                </div>
              </div>

              <!-- 扇轴（鎏金） -->
              <div class="fan-pivot">
                <div class="fan-pivot__outer"></div>
                <div class="fan-pivot__mid"></div>
                <div class="fan-pivot__core"></div>
                <div class="fan-pivot__spark"></div>
              </div>

              <!-- 展开的绸带弧线 -->
              <svg ref="arcSVG" class="fan-arc-svg" viewBox="0 0 600 400">
                <path ref="arcPath" class="fan-arc-path" d="M 300 380 Q 300 50 300 30" fill="none" />
              </svg>
            </div>
          </div>

          <!-- 展开数据 -->
          <div ref="infoBar" class="fan-info-bar">
            <span class="fan-info-bar__marker">◈</span>
            <span class="fan-info-bar__text">展开幅度</span>
            <span class="fan-info-bar__deg">{{ Math.round(currentAngle) }}°</span>
            <span class="fan-info-bar__seg">/ {{ TOTAL_ANGLE }}°</span>
          </div>

          <div class="fan-progress"><div ref="progRef" class="fan-progress__fill"></div></div>
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
//  CardImage3DFoldingFan — CSS3 3D 巨扇展开 (重新设计)
//
//  核心改变：
//  1. TOTAL_ANGLE: 170° → 240°（从半圆不到 → 超过2/3圆）
//  2. RIB_COUNT: 16 → 24（更密集的扇骨 = 更平滑的扇面）
//  3. 扇面用楔形 clip-path 而非矩形，相邻扇面无缝邻接
//  4. 展开动画：从中心向两侧波浪式展开（staggered）
//  5. 扇骨高度增大，视觉冲击力更强
//  6. 闭合状态：全部重叠在0°；展开：-120°→+120°
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const RIB_COUNT = 24
const TOTAL_ANGLE = 240
const trackHeight = `${8 * 100}vh`

const imgLib = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=500&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=500&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80',
]

const ribs = Array.from({ length: RIB_COUNT }, (_, i) => {
  const angle = (i / (RIB_COUNT - 1)) * TOTAL_ANGLE - TOTAL_ANGLE / 2
  return {
    id: i,
    image: imgLib[i % imgLib.length],
    alt: `扇面${i + 1}`,
    openAngle: angle, // -120° → +120°
  }
})

const currentAngle = ref(0)
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const fanRef = ref<HTMLElement | null>(null)
const arcSVG = ref<HTMLElement | null>(null)
const arcPath = ref<HTMLElement | null>(null)
const infoBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const bgGlow = ref<HTMLElement | null>(null)
const bgRing1 = ref<HTMLElement | null>(null)
const bgRing2 = ref<HTMLElement | null>(null)

const ribRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: TweenCleanup[] = []

function setRibRef(el: HTMLElement | null, idx: number) { ribRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power4.out' })
    .fromTo(chars, { autoAlpha: 0, z: -500, scale: 0, rotateY: 180 }, { autoAlpha: 1, z: 0, scale: 1, rotateY: 0, duration: 0.8, stagger: 0.14, ease: 'back.out(3)' }, '-=0.5')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.3')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.4, rotateX: 40 }, { autoAlpha: 1, scale: 1, rotateX: -10, duration: 1.2, ease: 'power4.out' }, '-=0.5')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupFoldingFan() {
  if (!scrollRef.value || !trackRef.value || !fanRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value
  const els = ribRefs.value.filter(Boolean) as HTMLElement[]

  // 🔑 关键：transform-origin 在底部，旋转轴在枢轴点
  els.forEach(el => gsap.set(el, { transformOrigin: '50% 100%' }))
  // 初始：全部合拢 rotateY=0，叠成一条线
  els.forEach(el => gsap.set(el, { rotateY: 0 }))

  // 场景初始俯角 — 能看到扇面
  if (sceneRef.value) gsap.set(sceneRef.value, { rotateX: -10 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3,
      onUpdate(self) {
        currentAngle.value = self.progress * TOTAL_ANGLE
      },
    },
  })

  // 🪭 展开动画 — 从中心向两侧波浪式展开
  // 中心扇骨先动，两侧依次延迟
  const centerIdx = Math.floor(RIB_COUNT / 2)
  els.forEach((el, i) => {
    const targetAngle = ribs[i].openAngle
    // 距离中心越远，延迟越多
    const distFromCenter = Math.abs(i - centerIdx) / centerIdx
    const delay = distFromCenter * 0.8

    // 从0°旋转到目标角度
    master.fromTo(el,
      { rotateY: 0 },
      {
        rotateY: targetAngle,
        duration: 5,
        ease: 'power3.out',
      },
      delay
    )

    // 到达后微弹
    const bounceTime = delay + 5
    master.to(el, {
      rotateY: targetAngle + (i % 2 === 0 ? 2.5 : -2.5),
      duration: 0.25,
      ease: 'sine.inOut',
    }, bounceTime)
    master.to(el, {
      rotateY: targetAngle,
      duration: 0.35,
      ease: 'sine.inOut',
    }, bounceTime + 0.25)
  })

  // 场景整体视角变化 — 从俯视→平视，展示扇面
  if (fanRef.value) {
    master.to(fanRef.value, { rotateX: -15, rotateY: 0, duration: 0.5 }, 0)
    master.to(fanRef.value, { rotateX: -6, rotateY: 10, duration: 3, ease: 'sine.inOut' }, 0.5)
    master.to(fanRef.value, { rotateX: 5, rotateY: -8, duration: 3, ease: 'sine.inOut' }, 3.5)
    master.to(fanRef.value, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power2.out' }, 6.5)
  }

  // 背景光晕
  if (bgGlow.value) master.to(bgGlow.value, { scale: 1.6, opacity: 0.8, duration: 7 }, 0)
  if (bgRing1.value) master.to(bgRing1.value, { scale: 1.4, opacity: 0.5, duration: 7 }, 0)
  if (bgRing2.value) master.to(bgRing2.value, { rotate: 45, scale: 1.3, opacity: 0.4, duration: 7 }, 0)

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 7 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupFoldingFan() }))
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
.fan-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(175deg, #0f0a08 0%, #18120e 20%, #140e0a 40%, #1a1410 60%, #100c08 80%, #0f0a08 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', 'Georgia', serif; }

.fan-bg-glow { position: absolute; width: 55vw; height: 40vw; top: 25vh; left: 22vw; border-radius: 50%; background: radial-gradient(ellipse, rgba(240,180,80,.12) 0%, rgba(200,120,40,.05) 40%, transparent 70%); filter: blur(90px); pointer-events: none; z-index: 0; will-change: transform,opacity; }
.fan-bg-ring { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; will-change: transform,opacity; border: 1px solid rgba(240,180,80,.04);
  &--1 { width: 65vw; height: 45vw; top: 20vh; left: 17vw; }
  &--2 { width: 50vw; height: 35vw; top: 28vh; left: 25vw; transform: rotate(30deg); }
}

.fan-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(220,140,50,.15); &:hover { background: rgba(220,140,50,.35); } }
}
.fan-track { position: relative; width: 100%; }
.fan-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.fan-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 820px); }
.fan-kicker { display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .32em; text-transform: uppercase; color: rgba(240,180,80,.7); background: rgba(200,120,40,.1); backdrop-filter: blur(10px); border: 1px solid rgba(220,150,60,.2); border-radius: 999px; padding: .24rem 1rem; margin-bottom: .5rem; }
.fan-title { margin: 0; display: flex; justify-content: center; gap: .1em; }
.fan-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.8rem); font-weight: 900; color: #d89840; will-change: transform,opacity;
  &--gilded { background: linear-gradient(180deg, #f0c060 0%, #e0a030 30%, #f5d080 50%, #d89020 70%, #f0c060 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 20px rgba(240,180,80,.6)); }
}
.fan-line { width: 120px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #f0c060, #e0a030, #f5d080, #e0a030, transparent); transform-origin: center; }
.fan-sub { margin: 0; font-size: clamp(.66rem, .95vw, .82rem); color: rgba(220,160,70,.3); max-width: 580px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 巨扇场景 ═══════════════════════ */
.fan-scene {
  position: absolute; top: 58%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  perspective: 1000px;
  perspective-origin: 50% 40%;
  will-change: transform, opacity;
}

.fan {
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════ 扇骨 ═══════════ */
$ribHeight: min(50vw, 440px);
$leafWideWidth: min(26vw, 220px); // 楔形顶部宽度 — 足够宽以覆盖相邻扇骨间距

.fan-rib {
  position: absolute;
  bottom: 0; left: 50%;
  width: 2px; // 扇骨极细
  height: $ribHeight;
  margin-left: -1px;
  transform-style: preserve-3d;
  will-change: transform;

  // 强调扇骨稍粗
  &--accent { width: 4px; margin-left: -2px; }
  // 最外侧两根最粗
  &--outer { width: 5px; margin-left: -2px; }
  &--center { width: 3px; margin-left: -1px; }
}

/* 楔形扇面纸 */
.fan-leaf {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: $leafWideWidth;
  height: 96%;
  margin-left: calc($leafWideWidth / -2);
  // 🔑 clip-path: 从枢轴窄→顶部宽的楔形
  clip-path: polygon(
    48% 100%,   // 底部靠近枢轴，微细
    0% 0%,      // 顶部左边缘
    100% 0%     // 顶部右边缘
  );
  overflow: hidden;
  backface-visibility: hidden;
  box-shadow: 0 0 16px rgba(0,0,0,.2);
  border-radius: 0 0 3px 3px;

  &__img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  &__edge {
    position: absolute; inset: 0;
    box-shadow: inset 0 0 0 1px rgba(240,200,100,.15);
    pointer-events: none;
  }
  &__blend {
    position: absolute; inset: 0;
    // 左右边缘渐变透明 → 模拟扇面纸的薄透边缘
    background: linear-gradient(90deg,
      rgba(15,10,8,.35) 0%, transparent 12%,
      transparent 88%, rgba(15,10,8,.35) 100%
    );
    pointer-events: none;
  }
}

/* 扇骨本体 */
.fan-bone {
  position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 3px; height: 100%; z-index: 2;
  &__body {
    width: 100%; height: calc(100% - 14px);
    background: linear-gradient(180deg, #2a1810 0%, #5a3820 25%, #4a2a18 55%, #2a1810 100%);
    border-radius: 1px 1px 0 0;
    box-shadow: inset 0 1px 2px rgba(255,200,120,.15);
  }
  &__tip {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 10px; height: 10px;
    background: radial-gradient(circle, #f8d890, #c89030);
    border-radius: 50%;
    box-shadow: 0 0 14px rgba(240,200,100,.7);
  }
}
.fan-rib--accent .fan-bone { width: 5px; }
.fan-rib--outer .fan-bone { width: 6px; }
.fan-rib--accent .fan-bone__tip { width: 14px; height: 14px; }
.fan-rib--outer .fan-bone__tip { width: 16px; height: 16px; }

/* ═══════════ 鎏金扇轴 ═══════════ */
.fan-pivot {
  position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%);
  z-index: 100;
  &__outer { width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(240,200,100,.35); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 20px rgba(240,180,60,.15); }
  &__mid { width: 22px; height: 22px; border-radius: 50%; border: 1px solid rgba(240,200,100,.5); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
  &__core { width: 12px; height: 12px; border-radius: 50%; background: radial-gradient(circle, #f8e0a0, #d09030); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 24px rgba(240,200,100,.8); }
  &__spark { width: 4px; height: 4px; border-radius: 50%; background: #fff; position: absolute; top: calc(50% - 3px); left: calc(50% - 2px); box-shadow: 0 0 8px #fff; animation: fan-sparkle 2s ease-in-out infinite; }
}
@keyframes fan-sparkle { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .3; transform: scale(1.8); } }

/* 装饰弧线SVG */
.fan-arc-svg { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(60vw, 500px); height: min(50vw, 420px); margin-left: calc(min(60vw, 500px) / -2); margin-top: calc(min(50vw, 420px) / -2); pointer-events: none; z-index: 5; opacity: .12; }
.fan-arc-path { stroke: rgba(240,200,100,.6); stroke-width: 1; stroke-dasharray: 4 8; }

/* 信息栏 */
.fan-info-bar { position: absolute; bottom: 12vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; align-items: baseline; gap: .35rem; pointer-events: none; background: rgba(20,14,10,.4); backdrop-filter: blur(10px); border: 1px solid rgba(240,180,60,.15); border-radius: 999px; padding: .3rem 1rem; }
.fan-info-bar__marker { font-size: .5rem; color: rgba(240,180,60,.5); }
.fan-info-bar__text { font-size: .56rem; font-weight: 500; color: rgba(220,160,60,.5); letter-spacing: .1em; }
.fan-info-bar__deg { font-size: 1.4rem; font-weight: 900; color: #f0c060; font-family: 'Georgia', serif; line-height: 1; }
.fan-info-bar__seg { font-size: .6rem; color: rgba(220,150,50,.35); }

.fan-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(220,140,40,.05); }
.fan-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #f0c060, #e0a030, #f5d080, #f0c060); background-size: 200% 100%; box-shadow: 0 0 14px rgba(240,180,80,.6); }

@media (max-width: 768px) {
  .fan-header { top: 2vh; } .fan-kicker { font-size: .44rem; padding: .12rem .5rem; } .fan-title__c { font-size: 1.5rem; }
  .fan-info-bar { bottom: 8vh; padding: .2rem .7rem; } .fan-info-bar__deg { font-size: 1.1rem; }
}
</style>
