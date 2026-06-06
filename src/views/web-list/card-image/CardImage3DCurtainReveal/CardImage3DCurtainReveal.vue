<template>
  <section ref="rootRef" class="cur-root">
    <!-- 剧场聚光灯 -->
    <div ref="spotTop" class="cur-spot cur-spot--top"></div>
    <div ref="spotBot" class="cur-spot cur-spot--bot"></div>

    <div ref="scrollRef" class="cur-scroll">
      <div ref="trackRef" class="cur-track" :style="{ height: trackHeight }">
        <div class="cur-sticky">

          <header ref="headerRef" class="cur-header">
            <span class="cur-kicker">◈ CSS3 3D Curtain Reveal · 帷幕拉开 ◈</span>
            <h1 class="cur-title">
              <span ref="tc1" class="cur-title__c">帷</span>
              <span ref="tc2" class="cur-title__c cur-title__c--open">幕</span>
              <span ref="tc3" class="cur-title__c">拉</span>
              <span ref="tc4" class="cur-title__c cur-title__c--open">开</span>
            </h1>
            <div ref="lineRef" class="cur-line"></div>
            <p class="cur-sub">向下滚动 · 3D帷幕旋转拉开 · 12道幕布 · 揭开震撼全景</p>
          </header>

          <!-- 🔑 帷幕场景 -->
          <div ref="sceneRef" class="cur-scene">
            <!-- 背景图片 — 帷幕后的完整图 -->
            <div ref="revealBg" class="cur-reveal-bg">
              <img :src="masterImage" alt="全场图" class="cur-reveal-bg__img" />
              <div class="cur-reveal-bg__glow"></div>
            </div>

            <!-- 帷幕面板 -->
            <div ref="curtainRef" class="cur-curtains">
              <div
                v-for="panel in panels"
                :key="panel.id"
                :ref="(el) => setPanelRef(el as HTMLElement, panel.id)"
                class="cur-panel"
                :class="[`cur-panel--${panel.side}`]"
                :style="{ '--delay': panel.delay }"
              >
                <!-- 幕布正面 -->
                <div class="cur-panel__front">
                  <div class="cur-panel__fabric">
                    <div class="cur-panel__pleat" v-for="p in 4" :key="p"></div>
                  </div>
                  <div class="cur-panel__edge-glow"></div>
                </div>
                <!-- 幕布背面 -->
                <div class="cur-panel__back"></div>
                <!-- 幕布厚度 -->
                <div class="cur-panel__thickness"></div>
              </div>
            </div>
          </div>

          <!-- 开合度 -->
          <div ref="stageMeter" class="cur-stage-meter">
            <span class="cur-stage-meter__dot"></span>
            <span class="cur-stage-meter__text">{{ isOpen ? '大幕已开' : '帷幕徐徐...' }}</span>
          </div>

          <div class="cur-progress"><div ref="progRef" class="cur-progress__fill"></div></div>
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
//  CardImage3DCurtainReveal — CSS3 3D 帷幕拉开
//
//  核心概念：12道垂直幕布在3D空间中旋转拉开，揭示幕后图片
//  1. 12道面板排成一行覆盖整个画面
//  2. 每道 transform-origin 在边缘，像真实幕布折叠
//  3. 左侧6道向右旋转(rotateY)，右侧6道向左旋转
//  4. 用户竖滚 → 幕布从中间向两侧旋转打开
//  5. 幕布正面有织物纹理和褶皱
//  6. 背后是完整的全景图片
//
//  青春时尚配色：天鹅绒红 · 金丝镶边 · 暗夜蓝
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const PANEL_COUNT = 12
const HALF = PANEL_COUNT / 2

interface PanelData {
  id: number; side: 'left' | 'right'; delay: number
}

const panels: PanelData[] = Array.from({ length: PANEL_COUNT }, (_, i) => ({
  id: i,
  side: i < HALF ? 'left' : 'right' as const,
  delay: i < HALF ? (HALF - 1 - i) * 0.06 : (i - HALF) * 0.06,
}))

const masterImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80'
const trackHeight = `${7 * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const revealBg = ref<HTMLElement | null>(null)
const curtainRef = ref<HTMLElement | null>(null)
const spotTop = ref<HTMLElement | null>(null)
const spotBot = ref<HTMLElement | null>(null)
const stageMeter = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const isOpen = ref(false)
const panelRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: TweenCleanup[] = []

function setPanelRef(el: HTMLElement | null, idx: number) { panelRefs.value[idx] = el }

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' }
  })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, scale: 0.2, filter: 'blur(20px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.12, ease: 'back.out(2.5)' }, '-=0.5')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.3')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1, ease: 'power4.out' }, '-=0.45')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupCurtainReveal() {
  if (!scrollRef.value || !trackRef.value || !curtainRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value

  const els = panelRefs.value.filter(Boolean) as HTMLElement[]

  // 🔑 transform-origin 设置 — 左侧面板右边缘旋转，右侧面板左边缘旋转
  els.forEach((el, i) => {
    if (panels[i].side === 'left') {
      gsap.set(el, { transformOrigin: '100% 50%' }) // 右侧为轴
    } else {
      gsap.set(el, { transformOrigin: '0% 50%' })   // 左侧为轴
    }
    gsap.set(el, { rotateY: 0 })
  })

  // 幕布初始覆盖整个画面
  if (revealBg.value) gsap.set(revealBg.value, { opacity: 0.2 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        isOpen.value = self.progress > 0.7
      },
    },
  })

  // 🎭 帷幕拉开
  els.forEach((el, i) => {
    const panel = panels[i]
    // 左侧面板：rotateY 从 0 → -130° (向内折叠)
    // 右侧面板：rotateY 从 0 → +130° (向内折叠)
    const targetAngle = panel.side === 'left' ? -130 : 130

    master.to(el, {
      rotateY: targetAngle,
      duration: 4.5,
      ease: 'power2.inOut',
    }, panel.delay) // 中间的先动，两侧后动
  })

  // 背景图片渐显
  if (revealBg.value) {
    master.to(revealBg.value, {
      opacity: 1,
      scale: 1.03,
      duration: 4,
      ease: 'power3.out',
    }, 0.5)
  }

  // 聚光灯移动
  if (spotTop.value) {
    master.to(spotTop.value, { x: '-10vw', opacity: 0.6, duration: 4 }, 0)
  }
  if (spotBot.value) {
    master.to(spotBot.value, { x: '8vw', opacity: 0.5, duration: 4 }, 0)
  }

  if (stageMeter.value) {
    master.fromTo(stageMeter.value, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 2)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 5 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupCurtainReveal() }))
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
.cur-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #0a080c; font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }

.cur-spot { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; will-change: transform,opacity;
  &--top { width: 35vw; height: 25vw; top: -3vh; left: 20vw; background: radial-gradient(ellipse, rgba(255,200,140,.15) 0%, transparent 70%); filter: blur(50px); }
  &--bot { width: 30vw; height: 20vw; bottom: -5vh; right: 15vw; background: radial-gradient(ellipse, rgba(255,180,100,.12) 0%, transparent 70%); filter: blur(50px); }
}

.cur-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(180,80,60,.2); &:hover { background: rgba(180,80,60,.4); } }
}
.cur-track { position: relative; width: 100%; }
.cur-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.cur-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.cur-kicker { display: inline-block; font-size: .6rem; font-weight: 700; letter-spacing: .3em; text-transform: uppercase; color: rgba(220,140,80,.75); background: rgba(180,80,40,.08); backdrop-filter: blur(8px); border: 1px solid rgba(200,100,50,.18); border-radius: 999px; padding: .24rem 1rem; margin-bottom: .5rem; }
.cur-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.cur-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #d08850; will-change: transform,opacity,filter;
  &--open { background: linear-gradient(135deg, #e0a060, #f0c870, #d08850); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(220,150,80,.5)); }
}
.cur-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #e0a060, #f0c870, #e0a060, transparent); transform-origin: center; }
.cur-sub { margin: 0; font-size: clamp(.66rem, .9vw, .8rem); color: rgba(200,140,70,.35); max-width: 550px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 帷幕场景 ═══════════════════════ */
.cur-scene {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

/* 帷幕后全景 */
.cur-reveal-bg {
  position: absolute; inset: 0; z-index: 1;
  overflow: hidden;
  will-change: transform, opacity;
  &__img { width: 100%; height: 100%; object-fit: cover; }
  &__glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,8,12,.6) 100%);
    pointer-events: none;
  }
}

/* 帷幕容器 */
.cur-curtains {
  position: absolute; inset: 0; z-index: 10;
  display: flex;
  perspective: 900px;
}

/* 🔑 帷幕面板 */
.cur-panel {
  flex: 1;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
  position: relative;

  &__front {
    position: absolute; inset: 0;
    backface-visibility: hidden;
    background: linear-gradient(180deg, #6b1a1a 0%, #8b2020 15%, #7a1c1c 30%, #8f2222 60%, #6b1818 85%, #5a1212 100%);
    overflow: hidden;
  }

  // 幕布褶皱纹理
  &__fabric {
    position: absolute; inset: 0;
    display: flex;
  }
  &__pleat {
    flex: 1;
    background: linear-gradient(90deg,
      rgba(255,255,255,.02) 0%, transparent 20%,
      transparent 80%, rgba(0,0,0,.08) 100%
    );
    &:nth-child(even) { background: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.05) 30%, rgba(0,0,0,.05) 70%, transparent 100%); }
  }

  // 边缘鎏金
  &__edge-glow {
    position: absolute; top: 0; bottom: 0; width: 2px;
    background: linear-gradient(180deg, transparent 0%, rgba(240,200,120,.4) 20%, rgba(240,200,120,.6) 50%, rgba(240,200,120,.4) 80%, transparent 100%);
  }
  &--left .cur-panel__edge-glow { right: 0; }
  &--right .cur-panel__edge-glow { left: 0; }

  // 幕布背面
  &__back {
    position: absolute; inset: 0;
    backface-visibility: hidden;
    background: #3a1010;
    transform: rotateY(180deg);
  }

  // 幕布厚度
  &__thickness {
    position: absolute; top: 0; bottom: 0; width: 6px;
    background: linear-gradient(180deg, #4a1414, #3a1010, #4a1414);
  }
  &--left .cur-panel__thickness { right: 0; transform: rotateY(90deg); transform-origin: right; }
  &--right .cur-panel__thickness { left: 0; transform: rotateY(-90deg); transform-origin: left; }
}

/* 舞台指示 */
.cur-stage-meter { position: absolute; bottom: 12vh; left: 50%; transform: translateX(-50%); z-index: 25; display: flex; align-items: center; gap: .4rem; pointer-events: none; will-change: transform,opacity; }
.cur-stage-meter__dot { width: 6px; height: 6px; border-radius: 50%; background: #e0a060; box-shadow: 0 0 12px rgba(240,200,120,.6); animation: cur-dot-pulse 2s ease-in-out infinite; }
@keyframes cur-dot-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(2.5); opacity: .4; } }
.cur-stage-meter__text { font-size: .64rem; font-weight: 600; color: rgba(220,160,80,.7); letter-spacing: .15em; }

.cur-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(180,80,40,.05); }
.cur-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #e0a060, #f0c870, #e0a060); background-size: 200% 100%; box-shadow: 0 0 10px rgba(220,150,80,.5); }

@media (max-width: 768px) {
  .cur-header { top: 2vh; } .cur-kicker { font-size: .44rem; padding: .12rem .45rem; } .cur-title__c { font-size: 1.4rem; }
  .cur-stage-meter { bottom: 8vh; }
}
</style>
