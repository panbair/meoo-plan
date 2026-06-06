<template>
  <section
    ref="rootRef"
    class="ia-root"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <div ref="glowA" class="ia-glow ia-glow--a"></div>
    <div ref="glowB" class="ia-glow ia-glow--b"></div>

    <!-- 光标指示器 -->
    <div ref="cursorDot" class="ia-cursor-dot"></div>

    <div ref="scrollRef" class="ia-scroll">
      <div ref="trackRef" class="ia-track" :style="{ height: trackHeight }">
        <div class="ia-sticky">

          <header ref="headerRef" class="ia-header">
            <span class="ia-kicker">☉ CSS3 3D · 主动控制 · 交互增强 ☉</span>
            <h1 class="ia-title">
              <span ref="tc1" class="ia-title__c">主</span>
              <span ref="tc2" class="ia-title__c ia-title__c--active">动</span>
              <span ref="tc3" class="ia-title__c">控</span>
              <span ref="tc4" class="ia-title__c ia-title__c--active">制</span>
            </h1>
            <div ref="dividerRef" class="ia-divider"></div>
            <p ref="subRef" class="ia-sub">
              移动光标倾斜 · 滚动透视穿梭 · 点击深度聚焦 · 从被动观看到主动交互
            </p>
          </header>

          <!-- ════════════════ 3D 交互场景 ════════════════ -->
          <!-- 🔑 perspective-origin 由 scroll 动态驱动 -->
          <div ref="sceneRef" class="ia-scene">
            <div ref="stageRef" class="ia-stage">

              <!-- 🔑 可交互卡片 — 鼠标倾斜 + 点击聚焦 -->
              <div
                v-for="(card, i) in cards"
                :key="card.id"
                :ref="el => { cardRefs[i] = el as HTMLElement | null }"
                class="ia-card"
                :style="card.baseStyle"
                :data-index="i"
              >
                <div class="ia-card__body">
                  <img :src="card.url" :alt="card.label" class="ia-card__img" loading="lazy" />
                  <!-- 悬停高光 -->
                  <div class="ia-card__highlight"></div>
                </div>
                <!-- 阴影盘 -->
                <div class="ia-card__shadow"></div>
                <!-- 深度指示环 -->
                <div class="ia-card__ring"></div>
                <span class="ia-card__tag">{{ card.label }}</span>
              </div>

            </div>
          </div>

          <!-- 交互状态面板 -->
          <div ref="statusPanel" class="ia-status">
            <span class="ia-status__item">🖱 倾斜 X:{{ Math.round(tiltX) }}° Y:{{ Math.round(tiltY) }}°</span>
            <span class="ia-status__item">👁 透视 {{ perspectiveLabel }}</span>
            <span class="ia-status__item">🎯 {{ focusedCard || '点击卡片聚焦' }}</span>
          </div>

          <div class="ia-progress"><div ref="progRef" class="ia-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DInteractive — 从"被动观看"到"主动控制"的交互增强
//
//  三大交互维度：
//
//  1. 🖱 鼠标跟随3D倾斜 — 每张卡片随光标位置独立倾斜
//     移动鼠标 → 实时计算每张卡片的光标相对位置
//     → rotateX/rotateY 动态倾斜 → 模拟"立体感应"
//
//  2. 👁 滚动驱动透视穿梭 — perspective-origin 随滚动动态偏移
//     向下滚动 → perspective-origin 从顶部移到底部
//     → 视角从俯视变为仰视 → 戏剧性空间穿梭感
//
//  3. 🎯 点击深度聚焦 — 点击卡片触发聚焦动画
//     点击卡片 → 卡片 translateZ 前移 + scale 放大
//     → 其他卡片退后 → 深度聚焦效果
//
//  设计风格：暗色科技感 · 主动交互 · 多维控制
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface CardData {
  id: number; label: string; url: string
  baseStyle: Record<string, string>
}

const cards: CardData[] = [
  { id: 0, label: 'FOCUS.ONE',   url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', baseStyle: { transform: 'translateZ(-120px) translateY(-18vh) translateX(-16vw)' } },
  { id: 1, label: 'FOCUS.TWO',   url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', baseStyle: { transform: 'translateZ(-40px) translateY(-8vh) translateX(14vw)' } },
  { id: 2, label: 'FOCUS.THREE', url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', baseStyle: { transform: 'translateZ(40px) translateY(4vh) translateX(-12vw)' } },
  { id: 3, label: 'FOCUS.FOUR',  url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', baseStyle: { transform: 'translateZ(100px) translateY(14vh) translateX(10vw)' } },
  { id: 4, label: 'FOCUS.FIVE',  url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80', baseStyle: { transform: 'translateZ(160px) translateY(20vh) translateX(-6vw)' } },
]

const CARD_COUNT = cards.length
const SHIFT_STAGES = 5
const trackHeight = `${(SHIFT_STAGES + 1) * 100}vh`

// ── 交互状态 ──
const mouseX = ref(0); const mouseY = ref(0); const mouseActive = ref(false)
const tiltX = ref(0); const tiltY = ref(0)
const focusedCard = ref('')
const perspectiveLabel = ref('正视')

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
const cardRefs = ref<(HTMLElement | null)[]>(Array(CARD_COUNT).fill(null))
const cursorDot = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const statusPanel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []
let focusTween: gsap.core.Tween | null = null

// ═══════════════════════ 🖱 鼠标交互 ═══════════════════════
function onMouseMove(e: MouseEvent) {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 2
  mouseActive.value = true
  if (cursorDot.value) {
    cursorDot.value.style.left = `${e.clientX}px`
    cursorDot.value.style.top = `${e.clientY}px`
    cursorDot.value.style.opacity = '0.8'
  }
}
function onMouseLeave() {
  mouseActive.value = false
  if (cursorDot.value) cursorDot.value.style.opacity = '0'
}

// 🔑 点击聚焦
function onClick(e: MouseEvent) {
  const target = (e.target as HTMLElement).closest('.ia-card') as HTMLElement | null
  if (!target) { focusedCard.value = ''; resetAllCards(); return }

  const idx = parseInt(target.dataset.index || '0')
  const card = cards[idx]
  focusedCard.value = card.label

  // 🔑 聚焦动画：选中卡片前移 + 放大，其他卡片退后
  cardRefs.value.forEach((el, i) => {
    if (!el) return
    if (focusTween) focusTween.kill()
    if (i === idx) {
      focusTween = gsap.to(el, {
        translateZ: 280, scale: 1.15,
        filter: 'brightness(1.25) drop-shadow(0 8px 32px rgba(255,255,255,.15))',
        duration: 0.5, ease: 'back.out(1.4)',
      })
    } else {
      gsap.to(el, {
        translateZ: -100, scale: 0.9,
        filter: 'brightness(0.6) blur(2px)',
        duration: 0.4, ease: 'power2.out',
      })
    }
  })
}

function resetAllCards() {
  cardRefs.value.forEach((el, i) => {
    if (!el) return
    const card = cards[i]
    const bz = parseFloat(card.baseStyle.transform.match(/translateZ\(([-\d.]+)p/)?.[1] || '0')
    gsap.to(el, {
      translateZ: bz, scale: 1,
      filter: 'brightness(1) drop-shadow(0 0 0px transparent)',
      duration: 0.5, ease: 'power2.inOut',
    })
  })
}

// 🔑 鼠标倾斜循环
let tiltRaf = 0
let currentTx = 0; let currentTy = 0
function tiltLoop() {
  const targetTx = mouseActive.value ? mouseX.value * 20 : 0
  const targetTy = mouseActive.value ? -mouseY.value * 16 : 0
  currentTx += (targetTx - currentTx) * 0.1
  currentTy += (targetTy - currentTy) * 0.1
  tiltX.value = currentTx; tiltY.value = currentTy

  cardRefs.value.forEach((el, i) => {
    if (!el) return
    const card = cards[i]
    const bz = parseFloat(card.baseStyle.transform.match(/translateZ\(([-\d.]+)p/)?.[1] || '0')
    const bx = parseFloat(card.baseStyle.transform.match(/translateX\(([-\d.]+)v/)?.[1] || '0')
    const by = parseFloat(card.baseStyle.transform.match(/translateY\(([-\d.]+)v/)?.[1] || '0')

    // 🔑 每张卡片根据自身位置微调倾斜量 → 形成差异化响应
    const depthFactor = 0.6 + (bz + 200) / 500
    el.style.transform = `
      translateZ(${bz}px)
      translateX(${bx}vw)
      translateY(${by}vh)
      rotateY(${currentTx * depthFactor}deg)
      rotateX(${currentTy * depthFactor}deg)
    `
  })

  tiltRaf = requestAnimationFrame(tiltLoop)
}

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

// ═══════════════════════ 👁 滚动驱动透视穿梭 ═══════════════════════
function setupPerspectiveShift() {
  if (!scrollRef.value || !trackRef.value || !sceneRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const scene = sceneRef.value
  const D = SHIFT_STAGES

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        // 🔑 滚动驱动 perspective-origin 动态偏移
        const pY = 20 + self.progress * 60 // 20% → 80% (从上到下)
        const pX = 30 + Math.sin(self.progress * Math.PI) * 40 // 30% ↔ 70% (左右摆动)
        scene.style.perspectiveOrigin = `${pX}% ${pY}%`

        // 🔑 透视值动态变化 → 近大远小效果增强
        const persp = 800 + self.progress * 600 // 800 → 1400
        scene.style.perspective = `${persp}px`

        perspectiveLabel.value = self.progress < 0.33 ? '俯视穿梭' : self.progress < 0.66 ? '平视巡航' : '仰视升空'
      },
    },
  })

  // 场景微旋转
  if (stageRef.value) {
    master.to(stageRef.value, { rotateX: 8, rotateY: -6, duration: D * 0.4 }, 0)
    master.to(stageRef.value, { rotateX: -6, rotateY: 8, duration: D * 0.5 }, D * 0.3)
    master.to(stageRef.value, { rotateX: 0, rotateY: 0, duration: D * 0.3 }, D * 0.7)
  }

  if (glowA.value) master.to(glowA.value, { x: '6vw', y: '-4vh', scale: 1.2, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-4vw', y: '5vh', scale: 1.15, duration: D }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupPerspectiveShift() }))
  window.addEventListener('resize', handleResize)
  tiltRaf = requestAnimationFrame(tiltLoop)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(tiltRaf)
  if (focusTween) focusTween.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 主动交互空间 ═══════════════════════ */
.ia-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #0e0c18 0%, #06040c 55%, #020106 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  cursor: none; // 隐藏默认光标
}

.ia-glow { position: absolute; border-radius: 50%; filter: blur(65px); pointer-events: none; will-change: transform; z-index: 0; }
.ia-glow--a { width: 30vw; height: 30vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(80,160,240,.12) 0%, transparent 70%); }
.ia-glow--b { width: 28vw; height: 28vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(200,120,220,.1) 0%, transparent 70%); }

/* 🔑 自定义光标 */
.ia-cursor-dot {
  position: fixed; z-index: 100; pointer-events: none;
  width: 16px; height: 16px; margin-left: -8px; margin-top: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(120,200,255,.9) 0%, rgba(80,160,240,.4) 50%, transparent 70%);
  box-shadow: 0 0 20px rgba(100,180,240,.5), 0 0 50px rgba(80,150,220,.2);
  opacity: 0;
  transition: opacity .3s ease;
}

/* ── 滚动 ── */
.ia-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(80,160,220,.1); }
}
.ia-track { position: relative; width: 100%; }
.ia-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.ia-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.ia-kicker { display: inline-block; font-size: .54rem; font-weight: 700; letter-spacing: .24em; color: rgba(100,170,230,.6); background: rgba(60,140,220,.04); backdrop-filter: blur(8px); border: 1px solid rgba(60,140,220,.1); border-radius: 999px; padding: .18rem .9rem; margin-bottom: .45rem; }
.ia-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.ia-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.4rem); font-weight: 900; color: #68a8d8; will-change: transform,opacity,filter;
  &--active {
    background: linear-gradient(150deg, #40a0e0 0%, #70d0f8 30%, #e070d0 60%, #f0a0e0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 10px rgba(80,180,230,.5));
  }
}
.ia-divider { width: 110px; height: 2px; margin: .35rem auto .45rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #40a0e0, #e070d0, #40a0e0, transparent); }
.ia-sub { margin: 0; font-size: clamp(.6rem, 1vw, .76rem); color: rgba(80,150,210,.3); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ 🔑 3D 场景 (perspective-origin 由JS动态驱动) ═══════════════════════ */
.ia-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px; // JS 动态调整
  perspective-origin: 50% 45%; // 🔑 JS 滚动驱动偏移
  will-change: perspective, perspective-origin;
  transition: perspective .3s ease; // 平滑透视变化
}
.ia-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════════════ 交互卡片 ═══════════════════════ */
.ia-card {
  position: absolute; will-change: transform, filter;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  cursor: pointer;
  // 🔑 CSS transition 处理点击后的弹性恢复
  transition: filter .4s ease;
}
.ia-card__body {
  position: absolute;
  width: min(30vw, 240px); height: min(20vw, 160px);
  margin-left: calc(min(30vw, 240px) / -2);
  margin-top: calc(min(20vw, 160px) / -2);
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,.38), 0 0 0 1px rgba(255,255,255,.05);
}
.ia-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ia-card__highlight {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 40% 30% at var(--hx, 50%) var(--hy, 50%), rgba(255,255,255,.1) 0%, transparent 60%);
  opacity: 0; transition: opacity .3s ease;
}
.ia-card:hover .ia-card__highlight { opacity: 1; }

.ia-card__shadow {
  position: absolute;
  width: min(30vw, 240px); height: min(20vw, 160px);
  margin-left: calc(min(30vw, 240px) / -2);
  margin-top: calc(min(20vw, 160px) / -2);
  border-radius: 10px; background: rgba(0,0,0,.4);
  transform: translateZ(-1px); filter: blur(12px); z-index: -1;
}
.ia-card__ring {
  position: absolute; inset: -4px; border-radius: 14px; pointer-events: none;
  border: 1px solid rgba(100,180,230,.1);
  transform: translateZ(2px);
  transition: border-color .3s ease;
}
.ia-card:hover .ia-card__ring { border-color: rgba(100,180,230,.35); }

.ia-card__tag {
  position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
  font-size: .5rem; font-weight: 700; letter-spacing: .16em; white-space: nowrap;
  color: rgba(80,160,220,.5); font-family: 'Courier New', monospace;
  background: rgba(6,4,12,.5); backdrop-filter: blur(6px);
  border-radius: 999px; padding: .08rem .6rem;
  border: 1px solid rgba(60,140,220,.08);
}

/* ── 交互状态面板 ── */
.ia-status { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; gap: .8rem; }
.ia-status__item { font-size: .5rem; font-weight: 600; letter-spacing: .08em; font-family: 'Courier New', monospace; color: rgba(80,160,220,.5); background: rgba(6,4,12,.5); backdrop-filter: blur(8px); border-radius: 999px; padding: .15rem .7rem; border: 1px solid rgba(60,140,220,.08); white-space: nowrap; }

.ia-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(60,140,220,.02); }
.ia-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #40a0e0, #e070d0, #40a0e0); box-shadow: 0 0 6px rgba(80,180,230,.15); }

@media (max-width: 768px) {
  .ia-header { top: 2vh; } .ia-kicker { font-size: .38rem; } .ia-title__c { font-size: 1.4rem; }
  .ia-card__body { width: 38vw; height: 26vw; margin-left: -19vw; margin-top: -13vw; }
  .ia-cursor-dot { display: none; }
  .ia-root { cursor: auto; }
}
</style>
