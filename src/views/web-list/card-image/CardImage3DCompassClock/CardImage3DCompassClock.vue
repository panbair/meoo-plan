<template>
  <section ref="rootRef" class="cc-root">
    <div ref="glowA" class="cc-glow cc-glow--a"></div>
    <div ref="glowB" class="cc-glow cc-glow--b"></div>

    <div ref="scrollRef" class="cc-scroll">
      <div ref="trackRef" class="cc-track" :style="{ height: trackHeight }">
        <div class="cc-sticky">

          <header ref="headerRef" class="cc-header">
            <span class="cc-kicker">◎ CSS3 3D · 数学计算 · 罗盘时钟 ◎</span>
            <h1 class="cc-title">
              <span ref="tc1" class="cc-title__c">罗</span>
              <span ref="tc2" class="cc-title__c cc-title__c--mech">盘</span>
              <span ref="tc3" class="cc-title__c">时</span>
              <span ref="tc4" class="cc-title__c cc-title__c--mech">钟</span>
            </h1>
            <div ref="dividerRef" class="cc-divider"></div>
            <p ref="subRef" class="cc-sub">
              向下滚动旋转视角 · sin/cos 实时计算 · 3D悬浮机械罗盘 · {{ timeString }}
            </p>
          </header>

          <!-- ════════════════ 3D 时钟场景 ════════════════ -->
          <div ref="sceneRef" class="cc-scene">
            <div ref="stageRef" class="cc-stage">

              <!-- 🔑 外层陀螺仪环 (旋转) -->
              <div ref="gyroRing" class="cc-gyro">
                <!-- 罗盘方位标记 (N/S/E/W + 8个次级方位) -->
                <span
                  v-for="m in compassMarkings"
                  :key="m.label"
                  class="cc-compass-mark"
                  :style="{
                    transform: `rotate(${m.angle}deg) translateY(-148px) rotate(-${m.angle}deg)`,
                    color: m.isCardinal ? '#d4a860' : 'rgba(180,150,120,.5)',
                    fontSize: m.isCardinal ? '.7rem' : '.5rem',
                    fontWeight: m.isCardinal ? '900' : '600',
                  }"
                >{{ m.label }}</span>

                <!-- 🔑 60个刻度标记 (sin/cos定位) -->
                <span
                  v-for="tick in tickMarks"
                  :key="tick.id"
                  class="cc-tick"
                  :style="{
                    transform: `rotate(${tick.angle}deg) translateY(-138px)`,
                    width: tick.isHour ? '3px' : '1px',
                    height: tick.isHour ? '10px' : '5px',
                    background: tick.isHour ? 'rgba(200,160,100,.6)' : 'rgba(180,150,120,.25)',
                  }"
                ></span>
              </div>

              <!-- 🔑 钟面 (3D 圆盘) -->
              <div ref="clockFace" class="cc-face">
                <!-- 同心装饰环 -->
                <div class="cc-ring cc-ring--outer"></div>
                <div class="cc-ring cc-ring--inner"></div>
              </div>

              <!-- 🔑 时针 (sin/cos动态角度) -->
              <div
                ref="hourHand"
                class="cc-hand cc-hand--hour"
                :style="{ transform: `translateZ(10px) rotate(${hourAngle}deg)` }"
              >
                <div class="cc-hand__body"></div>
              </div>

              <!-- 🔑 分针 -->
              <div
                ref="minuteHand"
                class="cc-hand cc-hand--minute"
                :style="{ transform: `translateZ(14px) rotate(${minuteAngle}deg)` }"
              >
                <div class="cc-hand__body"></div>
              </div>

              <!-- 🔑 秒针 -->
              <div
                ref="secondHand"
                class="cc-hand cc-hand--second"
                :style="{ transform: `translateZ(18px) rotate(${secondAngle}deg)` }"
              >
                <div class="cc-hand__body"></div>
                <div class="cc-hand__counterweight"></div>
              </div>

              <!-- 🔑 中心轴承 -->
              <div class="cc-pivot">
                <div class="cc-pivot__jewel"></div>
              </div>

            </div>
          </div>

          <div ref="timePanel" class="cc-time-panel">
            <span class="cc-time-panel__label">{{ timeString }}</span>
          </div>

          <div class="cc-progress"><div ref="progRef" class="cc-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DCompassClock — CSS3 3D 罗盘时钟 · 数学与DOM融合
//
//  核心：三角函数( sin/cos ) + CSS 3D变换 = 精密机械罗盘时钟
//
//  数学应用：
//  1. 时针角度 = (hours % 12 + minutes / 60) * 30°
//  2. 分针角度 = (minutes + seconds / 60) * 6°
//  3. 秒针角度 = (seconds + milliseconds / 1000) * 6°
//  4. 60个刻度标记 = 360° / 60 = 6° 间隔 → rotate(angle) + translateY
//  5. 罗盘方位 = 360° / 16 = 22.5° 间隔 (N/NE/E/SE/S/SW/W/NW)
//
//  3D结构：
//  · 外层陀螺仪环 (rotateY 旋转)
//  · 钟面圆盘 (rotateX 倾斜)
//  · 指针 (translateZ 悬浮)
//  · 滚动驱动整体3D旋转
//
//  设计风格：暗色机械 · 黄铜/金色 · 精密仪表
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

// ═══════════════ 🔑 罗盘方位计算 ═══════════════
const compassMarkings = computed(() => {
  const cards: { label: string; angle: number; isCardinal: boolean }[] = []
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  const cardinals = new Set(['N','E','S','W','NE','SE','SW','NW'])
  dirs.forEach((d, i) => {
    cards.push({
      label: d,
      angle: i * 22.5, // 360/16 = 22.5
      isCardinal: cardinals.has(d),
    })
  })
  return cards
})

// ═══════════════ 🔑 60个刻度标记 (sin/cos定位) ═══════════════
const tickMarks = computed(() => {
  const ticks: { id: number; angle: number; isHour: boolean }[] = []
  for (let i = 0; i < 60; i++) {
    ticks.push({
      id: i,
      angle: i * 6, // 360/60 = 6°
      isHour: i % 5 === 0, // 每5个=整点标记
    })
  }
  return ticks
})

// ═══════════════ 🔑 时间计算 (sin/cos → 角度) ═══════════════
const hourAngle = ref(0)
const minuteAngle = ref(0)
const secondAngle = ref(0)
const timeString = ref('00:00:00')

function updateClock() {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  const s = now.getSeconds()
  const ms = now.getMilliseconds()

  // 🔑 三角函数原理：
  // 时间 → 角度 → CSS rotate(angle)
  // 极坐标 (angle, handLength) → 直角坐标 (x, y) 用于指针末端

  // 时针：12小时=360° → 每小时30°，每分钟偏移0.5°
  hourAngle.value = ((h % 12) + m / 60) * 30
  // 分针：60分钟=360° → 每分钟6°，每秒偏移0.1°
  minuteAngle.value = (m + s / 60) * 6
  // 秒针：60秒=360° → 每秒6°，含毫秒平滑
  secondAngle.value = (s + ms / 1000) * 6

  timeString.value = [
    String(h).padStart(2, '0'),
    String(m).padStart(2, '0'),
    String(s).padStart(2, '0'),
  ].join(':')
}

// ═══════════════ 罗盘指针末端 (直角坐标, 用于验证/展示) ═══════════════
// sin/cos 转换: x = cos(rad) * r,  y = sin(rad) * r
function polarToCart(angleDeg: number, radius: number) {
  const rad = (angleDeg - 90) * Math.PI / 180 // -90° 使0°指向12点方向
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  }
}

const SCROLL_STAGES = 4
const trackHeight = `${(SCROLL_STAGES + 1) * 100}vh`

// ── Refs ──
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const gyroRing = ref<HTMLElement | null>(null)
const clockFace = ref<HTMLElement | null>(null)
const hourHand = ref<HTMLElement | null>(null)
const minuteHand = ref<HTMLElement | null>(null)
const secondHand = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const timePanel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []
let clockRaf = 0

// ═══════════════════════ 入场 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .75, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: .3, filter: 'blur(8px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: .55, stagger: .08, ease: 'back.out(1.6)' }, '-=.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.inOut' }, '-=.15')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, '-=.08')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: .92 }, { autoAlpha: 1, scale: 1, duration: .85, ease: 'power3.out' }, '-=.25')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 3D 视角旋转 ═══════════════════════
function setupViewRotation() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = SCROLL_STAGES

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3 },
  })

  // 陀螺仪环独立旋转
  if (gyroRing.value) {
    master.to(gyroRing.value, { rotateY: 360, rotateX: 15, duration: D }, 0)
  }

  // 整体场景旋转 → 从不同角度观察时钟
  master.to(stage, { rotateX: 30, rotateY: 0, duration: D * .4 }, 0)
  master.to(stage, { rotateX: -20, rotateY: 45, duration: D * .5 }, D * .3)
  master.to(stage, { rotateX: 0, rotateY: 0, duration: D * .3 }, D * .7)

  if (glowA.value) master.to(glowA.value, { x: '5vw', y: '-3vh', duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '3vh', duration: D }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  updateClock()
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupViewRotation() }))
  window.addEventListener('resize', handleResize)
  // 🔑 实时时钟循环
  function clockLoop() { updateClock(); clockRaf = requestAnimationFrame(clockLoop) }
  clockRaf = requestAnimationFrame(clockLoop)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(clockRaf)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 机械暗室 ═══════════════════════ */
.cc-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #12101a 0%, #0a0812 50%, #040208 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
}

.cc-glow { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.cc-glow--a { width: 28vw; height: 28vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(200,160,100,.1) 0%, transparent 70%); }
.cc-glow--b { width: 24vw; height: 24vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(160,120,80,.08) 0%, transparent 70%); }

/* ── 滚动 ── */
.cc-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(200,160,100,.1); }
}
.cc-track { position: relative; width: 100%; }
.cc-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.cc-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.cc-kicker { display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .24em; color: rgba(200,150,100,.6); background: rgba(200,150,100,.04); backdrop-filter: blur(8px); border: 1px solid rgba(180,130,90,.12); border-radius: 999px; padding: .18rem .9rem; margin-bottom: .45rem; }
.cc-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.cc-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.4rem); font-weight: 900; color: #c8a878; will-change: transform,opacity,filter;
  &--mech {
    background: linear-gradient(150deg, #d4b080 0%, #e8c898 25%, #c09860 55%, #e0c090 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(200,160,100,.4));
  }
}
.cc-divider { width: 100px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, #d4b080, #c09860, #d4b080, transparent); }
.cc-sub { margin: 0; font-size: clamp(.58rem, 1vw, .76rem); color: rgba(180,140,100,.35); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ 3D 场景 ═══════════════════════ */
.cc-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1000px;
  perspective-origin: 50% 48%;
}
.cc-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════ 🔑 陀螺仪环 (外层) ═══════════════ */
.cc-gyro {
  position: absolute; transform-style: preserve-3d; will-change: transform;
  width: 320px; height: 320px;
  margin-left: -160px; margin-top: -160px;
  border-radius: 50%;
  border: 2px solid rgba(200,160,100,.25);
  box-shadow: 0 0 0 8px rgba(200,150,100,.04), 0 0 0 1px rgba(200,160,100,.08), 0 0 40px rgba(0,0,0,.3);
  background: radial-gradient(circle, transparent 60%, rgba(0,0,0,.1) 80%, rgba(0,0,0,.2) 100%);
}

/* 罗盘方位标记 — 极坐标定位 (rotate + translateY) */
.cc-compass-mark {
  position: absolute; top: 50%; left: 50%;
  transform-origin: 0 0;
  pointer-events: none;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 6px rgba(200,160,100,.3);
}

/* 刻度标记 — 极坐标定位 */
.cc-tick {
  position: absolute; top: 50%; left: 50%;
  transform-origin: 0 0;
  border-radius: 2px;
}

/* ═══════════════ 钟面圆盘 (3D) ═══════════════ */
.cc-face {
  position: absolute;
  width: 260px; height: 260px; border-radius: 50%;
  margin-left: -130px; margin-top: -130px;
  transform: translateZ(-4px);
  background: radial-gradient(circle, rgba(20,16,10,.9) 0%, rgba(15,12,8,.95) 60%, rgba(10,8,4,.98) 100%);
  box-shadow: 0 0 0 1px rgba(200,160,100,.15), 0 0 40px rgba(0,0,0,.4), inset 0 0 60px rgba(0,0,0,.3);
}

.cc-ring {
  position: absolute; border-radius: 50%; pointer-events: none;
  &--outer { inset: 12px; border: 1px solid rgba(200,160,100,.12); }
  &--inner { inset: 50px; border: 1px dashed rgba(200,160,100,.06); }
}

/* ═══════════════ 🔑 指针 (rotate角度 JS实时计算) ═══════════════ */
.cc-hand {
  position: absolute; top: 50%; left: 50%;
  transform-origin: 50% 100%; // 旋转轴在底部 (中心)
  will-change: transform;
}
.cc-hand__body { border-radius: 2px; }

/* 时针 — 宽短 */
.cc-hand--hour {
  width: 6px; height: 70px; margin-left: -3px; margin-top: -70px;
  z-index: 12;
  .cc-hand__body {
    width: 100%; height: 100%;
    background: linear-gradient(180deg, rgba(200,160,100,.9) 0%, rgba(180,140,80,.7) 60%, transparent 100%);
    box-shadow: 0 0 8px rgba(200,160,100,.3);
  }
}

/* 分针 — 细长 */
.cc-hand--minute {
  width: 4px; height: 100px; margin-left: -2px; margin-top: -100px;
  z-index: 14;
  .cc-hand__body {
    width: 100%; height: 100%;
    background: linear-gradient(180deg, rgba(220,180,120,.95) 0%, rgba(200,160,100,.8) 70%, transparent 100%);
    box-shadow: 0 0 6px rgba(220,180,120,.3);
  }
}

/* 秒针 — 极细红色 */
.cc-hand--second {
  width: 2px; height: 115px; margin-left: -1px; margin-top: -115px;
  z-index: 16;
  .cc-hand__body {
    width: 100%; height: 80%;
    background: linear-gradient(180deg, rgba(220,80,60,1) 0%, rgba(200,60,40,.9) 70%, transparent 100%);
    box-shadow: 0 0 4px rgba(220,80,60,.5);
  }
}
.cc-hand__counterweight {
  position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%);
  width: 8px; height: 18px; border-radius: 50%;
  background: rgba(220,80,60,.5);
  box-shadow: 0 0 6px rgba(220,80,60,.3);
}

/* ═══════════════ 中心轴承 ═══════════════ */
.cc-pivot {
  position: absolute; top: 50%; left: 50%;
  width: 18px; height: 18px; margin-left: -9px; margin-top: -9px;
  border-radius: 50%; z-index: 20;
  transform: translateZ(22px);
  background: radial-gradient(circle, rgba(255,240,210,.8) 0%, rgba(200,160,100,.5) 40%, rgba(150,110,60,.3) 100%);
  box-shadow: 0 0 12px rgba(200,160,100,.4), 0 0 30px rgba(180,140,80,.2);
}
.cc-pivot__jewel {
  position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.9) 0%, rgba(200,160,100,.4) 60%, transparent 100%);
}

/* ── 时间面板 ── */
.cc-time-panel { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; }
.cc-time-panel__label { font-size: .7rem; font-weight: 700; letter-spacing: .2em; font-family: 'Courier New', monospace; color: rgba(200,160,100,.6); background: rgba(10,8,4,.5); backdrop-filter: blur(8px); border-radius: 999px; padding: .15rem 1rem; border: 1px solid rgba(200,150,100,.12); }

.cc-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(200,150,100,.03); }
.cc-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #d4b080, #c09860, #d4b080); }

@media (max-width: 768px) {
  .cc-header { top: 2vh; } .cc-kicker { font-size: .38rem; } .cc-title__c { font-size: 1.4rem; }
  .cc-scene { perspective: 700px; }
  .cc-gyro { width: 240px; height: 240px; margin-left: -120px; margin-top: -120px; }
  .cc-face { width: 200px; height: 200px; margin-left: -100px; margin-top: -100px; }
  .cc-hand--hour { height: 50px; margin-top: -50px; }
  .cc-hand--minute { height: 75px; margin-top: -75px; }
  .cc-hand--second { height: 85px; margin-top: -85px; }
  .cc-compass-mark { font-size: 80%; }
}
</style>
