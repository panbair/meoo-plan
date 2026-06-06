<template>
  <section ref="rootRef" class="ss-root">
    <div ref="corePillar" class="ss-pillar-glow"></div>
    <div ref="downLight" class="ss-downlight"></div>

    <div ref="scrollRef" class="ss-scroll">
      <div ref="trackRef" class="ss-track" :style="{ height: trackHeight }">
        <div class="ss-sticky">

          <header ref="headerRef" class="ss-header">
            <span class="ss-kicker">🌀 CSS3 3D Spiral Staircase · 旋梯深渊 ◈</span>
            <h1 class="ss-title">
              <span ref="tc1" class="ss-title__c">旋</span>
              <span ref="tc2" class="ss-title__c ss-title__c--spiral">梯</span>
              <span ref="tc3" class="ss-title__c">深</span>
              <span ref="tc4" class="ss-title__c ss-title__c--spiral">渊</span>
            </h1>
            <div ref="lineRef" class="ss-line"></div>
            <p class="ss-sub">向下滚动 · 螺旋楼梯盘旋下降 · 中央柱挂图 · 外壁影像 · 无限深渊</p>
          </header>

          <div ref="sceneRef" class="ss-scene">
            <div ref="stairRef" class="ss-stair">
              <!-- 螺旋台阶 — 24级台阶沿Z轴螺旋下降 -->
              <div
                v-for="step in steps"
                :key="step.id"
                :ref="(el) => setStepRef(el as HTMLElement, step.id)"
                class="ss-step"
              >
                <!-- 台阶踏板 -->
                <div class="ss-step__tread">
                  <div class="ss-step__surface"></div>
                </div>
                <!-- 台阶上的图片（每隔一级挂一张） -->
                <div v-if="step.hasImage" class="ss-step__image">
                  <img :src="step.image" :alt="step.alt" class="ss-step__img" />
                  <div class="ss-step__img-frame"></div>
                </div>
                <!-- 中央柱上的图片面板 -->
                <div v-if="step.hasPillarImg" class="ss-step__pillar-img">
                  <img :src="step.pillarImage" :alt="step.pillarAlt" class="ss-step__pillar-src" />
                </div>
              </div>

              <!-- 中央旋转柱 -->
              <div ref="pillarRef" class="ss-pillar"></div>
            </div>
          </div>

          <div ref="ssInfo" class="ss-info">
            <span class="ss-info__dot"></span>
            <span class="ss-info__text">下降 {{ descentLevel }} 级</span>
          </div>

          <div class="ss-progress"><div ref="progRef" class="ss-progress__fill"></div></div>
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
//  CardImage3DSpiralStaircase — CSS3 3D 旋梯深渊
//
//  核心概念：螺旋楼梯沿Z轴向下延伸，图片挂在楼梯各处
//  1. 24级台阶沿Z轴螺旋排列（每级旋转15°）
//  2. 每隔一级台阶挂一张图片在"墙壁"上
//  3. 中央柱体上有圆形图片面板
//  4. 用户竖滚 → 沿楼梯螺旋下降，图片从身旁经过
//  5. 中央柱从上方有光照下
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const STEP_COUNT = 24
const trackHeight = `${10 * 100}vh`

const imgPool = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
]

const steps = Array.from({ length: STEP_COUNT }, (_, i) => ({
  id: i,
  angle: i * 15, // 每级旋转15°
  z: -i * 100,    // Z轴间距
  hasImage: i % 2 === 0,
  image: imgPool[i % imgPool.length],
  alt: `壁挂图${i + 1}`,
  hasPillarImg: i % 4 === 0,
  pillarImage: imgPool[(i + 3) % imgPool.length],
  pillarAlt: `柱图${i + 1}`,
}))

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const stairRef = ref<HTMLElement | null>(null)
const pillarRef = ref<HTMLElement | null>(null)
const corePillar = ref<HTMLElement | null>(null)
const downLight = ref<HTMLElement | null>(null)
const ssInfo = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const stepRefs = ref<(HTMLElement | null)[]>([])
const descentLevel = ref(0)
const cleanupFns: TweenCleanup[] = []

function setStepRef(el: HTMLElement | null, idx: number) { stepRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, y: 120, rotateX: 90 }, { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(sceneRef.value, { autoAlpha: 0, rotateX: -40, scale: 0.5 }, { autoAlpha: 1, rotateX: -15, scale: 1, duration: 1.1, ease: 'power4.out' }, '-=0.45')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupSpiralStaircase() {
  if (!scrollRef.value || !trackRef.value || !stairRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  const els = stepRefs.value.filter(Boolean) as HTMLElement[]
  const PILR_RADIUS = 60
  const STAIR_RADIUS = 200

  // 初始螺旋定位
  els.forEach((el, i) => {
    const step = steps[i]
    const rad = (step.angle * Math.PI) / 180
    const x = Math.cos(rad) * STAIR_RADIUS
    const y = Math.sin(rad) * STAIR_RADIUS
    gsap.set(el, {
      x, y,
      translateZ: step.z,
      rotateZ: step.angle,
      scale: 0.6 + (1 - i * 0.03),
      opacity: 0.25 + (1 - i * 0.04),
    })
  })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) { descentLevel.value = Math.min(STEP_COUNT, Math.max(1, Math.ceil(self.progress * STEP_COUNT))) },
    },
  })

  const totalZ = STEP_COUNT * 100 * 0.7

  // 🌀 螺旋下降 — 所有台阶向相机推进 + 绕Z轴旋转
  els.forEach((el, i) => {
    const step = steps[i]
    const rad = (step.angle * Math.PI) / 180
    const endRad = rad + Math.PI * 2.5
    master.fromTo(el,
      { x: Math.cos(rad) * STAIR_RADIUS, y: Math.sin(rad) * STAIR_RADIUS, translateZ: step.z, rotateZ: step.angle, scale: 0.6 + (1 - i * 0.03), opacity: 0.25 + (1 - i * 0.04) },
      { x: Math.cos(endRad) * (STAIR_RADIUS + 30), y: Math.sin(endRad) * STAIR_RADIUS, translateZ: step.z + totalZ, rotateZ: step.angle + 450, scale: 1.1, opacity: 1, duration: 9, ease: 'power2.in' },
      0
    )
  })

  // 整体视角
  if (stairRef.value) {
    master.to(stairRef.value, { rotateX: 20, rotateY: 10, duration: 4.5, ease: 'sine.inOut' }, 0)
    master.to(stairRef.value, { rotateX: -5, rotateY: -15, duration: 4.5, ease: 'sine.inOut' }, 4.5)
  }

  if (corePillar.value) master.to(corePillar.value, { scaleY: 0.3, opacity: 0.5, duration: 9, ease: 'power2.in' }, 0)
  if (downLight.value) master.to(downLight.value, { opacity: 0.6, duration: 9 }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 9 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }
onMounted(() => { requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupSpiralStaircase() })); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.ss-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: radial-gradient(ellipse at 50% 30%, #14101c 0%, #0c0a14 50%, #06040c 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }
.ss-pillar-glow { position: absolute; width: 6vw; height: 70vh; top: 15vh; left: 50%; transform: translateX(-50%); background: linear-gradient(180deg, rgba(200,170,100,.2) 0%, rgba(180,140,80,.08) 50%, transparent 100%); filter: blur(30px); pointer-events: none; z-index: 0; will-change: transform,opacity; }
.ss-downlight { position: absolute; width: 50vw; height: 30vh; top: -5vh; left: 25vw; background: radial-gradient(ellipse at 50% 0%, rgba(200,170,100,.12) 0%, transparent 70%); filter: blur(60px); pointer-events: none; z-index: 0; will-change: opacity; }
.ss-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2; &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(200,160,80,.15); } }
.ss-track { position: relative; width: 100%; }
.ss-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.ss-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.ss-kicker { display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: rgba(200,160,80,.7); background: rgba(180,120,40,.08); backdrop-filter: blur(8px); border: 1px solid rgba(200,140,50,.16); border-radius: 999px; padding: .22rem .9rem; margin-bottom: .5rem; }
.ss-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.ss-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #c89840; will-change: transform,opacity;
  &--spiral { background: linear-gradient(135deg, #d8a850, #c08030, #e0c070); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(200,150,70,.5)); }
}
.ss-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #d8a850, #c08030, #e0c070, transparent); transform-origin: center; }
.ss-sub { margin: 0; font-size: clamp(.64rem, .9vw, .78rem); color: rgba(180,140,70,.3); max-width: 550px; margin-inline: auto; }
.ss-scene { position: absolute; top: 55%; left: 50%; transform: translate(-50%, -50%); z-index: 10; perspective: 500px; perspective-origin: 50% 40%; will-change: transform,opacity; }
.ss-stair { position: relative; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

// 🌀 单级台阶
.ss-step {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d; will-change: transform,opacity;

  &__tread {
    position: absolute;
    width: min(36vw, 300px); height: 8px;
    margin-left: calc(min(36vw, 300px) / -2);
    margin-top: -4px;
    transform: rotateX(-90deg);
    transform-origin: center;
  }
  &__surface {
    width: 100%; height: 100%;
    background: linear-gradient(90deg, rgba(200,150,80,.2), rgba(180,130,60,.15), rgba(200,150,80,.2));
    box-shadow: 0 0 10px rgba(200,150,60,.1);
    border-radius: 2px;
  }

  // 墙壁上的画框
  &__image {
    position: absolute;
    width: min(16vw, 130px); height: min(11vw, 90px);
    margin-left: calc(min(36vw, 300px) / 2 + 15px); // 贴在楼梯外侧
    margin-top: calc(min(11vw, 90px) / -2);
    border-radius: 4px; overflow: hidden;
    box-shadow: 0 0 20px rgba(200,150,60,.15), 0 0 0 2px rgba(200,150,60,.25);
    backface-visibility: visible;
  }
  &__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &__img-frame { position: absolute; inset: 0; box-shadow: inset 0 0 0 1px rgba(255,255,255,.05); pointer-events: none; }

  // 中央柱上的圆形图片
  &__pillar-img {
    position: absolute;
    width: min(8vw, 70px); height: min(8vw, 70px);
    margin-left: calc(min(8vw, 70px) / -2);
    margin-top: calc(min(8vw, 70px) / -2 + 20px);
    border-radius: 50%; overflow: hidden;
    box-shadow: 0 0 15px rgba(200,150,60,.3), 0 0 0 2px rgba(200,160,80,.35);
  }
  &__pillar-src { width: 100%; height: 100%; object-fit: cover; display: block; }
}

// 中央柱
.ss-pillar { position: absolute; width: 14px; height: 100%; left: -7px; top: 0; background: linear-gradient(180deg, rgba(200,150,60,.4), rgba(160,120,40,.2), rgba(200,150,60,.4)); border-radius: 7px; transform: rotateX(90deg); transform-origin: top; pointer-events: none; }

.ss-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; align-items: center; gap: .4rem; pointer-events: none; }
.ss-info__dot { width: 5px; height: 5px; border-radius: 50%; background: #d8a850; box-shadow: 0 0 12px rgba(200,160,80,.6); animation: ss-pulse 2s ease-in-out infinite; }
@keyframes ss-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(2.5); opacity: .4; } }
.ss-info__text { font-size: .6rem; font-weight: 600; color: rgba(200,160,80,.6); letter-spacing: .1em; }
.ss-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(200,140,50,.05); }
.ss-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #d8a850, #c08030, #e0c070, #d8a850); background-size: 200% 100%; box-shadow: 0 0 12px rgba(200,160,80,.5); }

@media (max-width: 768px) { .ss-header { top: 2vh; } .ss-kicker { font-size: .42rem; padding: .1rem .4rem; } .ss-title__c { font-size: 1.3rem; } .ss-step__image { width: 18vw; height: 13vw; } }
</style>
