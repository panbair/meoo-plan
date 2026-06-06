<template>
  <section ref="rootRef" class="al-root">
    <div ref="glowA" class="al-glow al-glow--a"></div>
    <div ref="glowB" class="al-glow al-glow--b"></div>

    <div ref="scrollRef" class="al-scroll">
      <div ref="trackRef" class="al-track" :style="{ height: trackHeight }">
        <div class="al-sticky">

          <header ref="headerRef" class="al-header">
            <span class="al-kicker">⟐ 算法生成 · 程序化 3D 艺术 · 数学波场 ⟐</span>
            <h1 class="al-title">
              <span ref="tc1" class="al-title__c">算</span>
              <span ref="tc2" class="al-title__c al-title__c--algo">法</span>
              <span ref="tc3" class="al-title__c">波</span>
              <span ref="tc4" class="al-title__c al-title__c--algo">场</span>
            </h1>
            <div ref="dividerRef" class="al-divider"></div>
            <p ref="subRef" class="al-sub">
              向下滚动 · {{ COLS }}×{{ ROWS }}={{ COLS*ROWS }}程序化节点 · sin/cos波函数驱动 · 3D粒子海洋
            </p>
          </header>

          <!-- ════════════════ 3D 算法波场场景 ════════════════ -->
          <div ref="sceneRef" class="al-scene">
            <div ref="stageRef" class="al-stage">

              <!-- 🔑 程序化生成的3D节点网格 -->
              <div
                v-for="node in nodes"
                :key="node.id"
                :ref="el => { nodeRefs[node.id] = el as HTMLElement | null }"
                class="al-node"
                :style="{
                  width: nodeW + 'px', height: nodeH + 'px',
                  marginLeft: (nodeW / -2) + 'px',
                  marginTop: (nodeH / -2) + 'px',
                  // 🔑 基础3D位置 (XY平面)
                  transform: `translateX(${node.x}px) translateY(${node.y}px)`,
                  // 🔑 颜色由波函数值映射
                  '--hue': node.hue,
                  '--light': node.lightness,
                }"
              >
                <!-- 节点正面 -->
                <div class="al-node__face">
                  <img :src="imageUrl" alt="" class="al-node__img"
                    :style="{
                      objectPosition: `${node.bgX}% ${node.bgY}%`,
                      objectFit: 'cover',
                    }"
                    loading="lazy" />
                </div>
                <!-- 节点顶面 (3D厚度) -->
                <div class="al-node__top"></div>
              </div>

            </div>
          </div>

          <!-- 波函数参数面板 -->
          <div ref="paramPanel" class="al-params">
            <span class="al-params__item">λ₁={{ waveParams.lambda1 }} λ₂={{ waveParams.lambda2 }}</span>
            <span class="al-params__item">A={{ waveParams.amplitude }}</span>
            <span class="al-params__item">φ={{ Math.round(wavePhase * 100) / 100 }}</span>
          </div>

          <div class="al-progress"><div ref="progRef" class="al-progress__fill"></div></div>
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
//  CardImage3DAlgorithmic — 程序化 3D 算法艺术 (CSS-Doodle 风格)
//
//  核心：用数学算法动态生成数百个3D节点，形成波浪粒子海洋
//
//  算法技术栈：
//  1. 网格生成 — COLS×ROWS 矩形网格均匀分布
//  2. 🔑 多层波函数叠加 — Z轴位移由复合波决定
//     z(x,y) = sin(f1·x + φ)·cos(f1·y + φ)·A +
//              sin(f2·x + φ₂)·sin(f2·y)·A₂ +
//              cos(f3·x)·cos(f3·y + φ₃)·A₃
//  3. 颜色映射 — 波高 → HSL色相/亮度
//  4. 程序化生成 — 所有节点参数由算法计算，非手工编写
//  5. preserve-3d 批量应用 — 每个节点都是3D子元素
//  6. GSAP 驱动波相位移 → 节点起伏如海浪
//
//  设计风格：数字艺术 · 算法美学 · 3D 粒子海洋
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const COLS = 14
const ROWS = 9
const TOTAL = COLS * ROWS // 126 个程序化节点
const nodeW = 70
const nodeH = 50
const gapX = 76
const gapY = 56
const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80'

// ═══════════════ 🔑 波函数参数 (可调) ═══════════════
const waveParams = reactive({
  lambda1: 0.35,   // 主波频率
  lambda2: 0.55,   // 次波频率
  lambda3: 0.22,   // 第三波频率
  amplitude: 75,   // 波幅 (Z轴最大位移)
})

// ═══════════════ 🔑 程序化节点生成 ═══════════════
interface AlgoNode {
  id: number; col: number; row: number
  x: number; y: number  // XY平面位置
  // 图像切片参数
  bgX: number; bgY: number
  // 🔑 颜色参数 (由波函数计算)
  hue: number; lightness: number
}

const nodes: AlgoNode[] = []
const totalW = (COLS - 1) * gapX
const totalH = (ROWS - 1) * gapY
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const id = r * COLS + c
    // 归一化坐标 (-1 ~ 1)
    const nx = (c / (COLS - 1) - 0.5) * 2
    const ny = (r / (ROWS - 1) - 0.5) * 2
    // 🔑 初始波高 (用于颜色)
    const z0 = computeWaveZ(nx, ny, 0)
    nodes.push({
      id, col: c, row: r,
      x: c * gapX - totalW / 2,
      y: r * gapY - totalH / 2,
      bgX: (c / (COLS - 1)) * 100,
      bgY: (r / (ROWS - 1)) * 100,
      hue: 200 + z0 * 0.6,       // 200-260 (青→蓝→紫)
      lightness: 45 + z0 * 0.3,  // 亮度随波高
    })
  }
}

// ═══════════════ 🔑 多层复合波函数 ═══════════════
// z = Σ sin(freq_i · x + phase_i) · cos(freq_i · y) · amplitude
function computeWaveZ(nx: number, ny: number, phase: number): number {
  const { lambda1, lambda2, lambda3, amplitude } = waveParams
  // 主波：对角传播
  const w1 = Math.sin(lambda1 * nx * 8 + phase) * Math.cos(lambda1 * ny * 6 + phase * 0.7)
  // 次波：径向波纹
  const dist = Math.sqrt(nx * nx + ny * ny)
  const w2 = Math.sin(lambda2 * dist * 10 + phase * 1.3) * 0.5
  // 第三波：X方向涟漪
  const w3 = Math.cos(lambda3 * nx * 12 + phase * 0.5) * Math.sin(lambda3 * ny * 8 + phase * 1.1) * 0.4
  // 🔑 复合
  return (w1 * 1.0 + w2 * 0.5 + w3 * 0.4) * amplitude
}

const wavePhase = ref(0)

// ── 更新所有节点Z轴位置 ──
function updateAllNodes(phase: number) {
  wavePhase.value = phase
  nodeRefs.value.forEach((el, id) => {
    if (!el) return
    const node = nodes[id]
    const nx = (node.col / (COLS - 1) - 0.5) * 2
    const ny = (node.row / (ROWS - 1) - 0.5) * 2
    const z = computeWaveZ(nx, ny, phase)
    // 🔑 设置translateZ → 波高影响Z轴位置
    el.style.transform = `
      translateX(${node.x}px)
      translateY(${node.y}px)
      translateZ(${z}px)
      rotateX(${z * 0.05}deg)
      rotateY(${z * 0.03}deg)
    `
    // 动态颜色
    el.style.setProperty('--hue', String(200 + z * 0.6))
    el.style.setProperty('--light', String(45 + z * 0.3))
  })
}

const WAVE_STAGES = 5
const trackHeight = `${(WAVE_STAGES + 1) * 100}vh`

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
const nodeRefs = ref<(HTMLElement | null)[]>(Array(TOTAL).fill(null))
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const paramPanel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

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
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: .9 }, { autoAlpha: 1, scale: 1, duration: .85, ease: 'power3.out' }, '-=.25')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 🔑 波相位移驱动 ═══════════════════════
function setupWavePropagation() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = WAVE_STAGES

  // 初始状态
  updateAllNodes(0)

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.4,
      onUpdate(self) {
        // 🔑 相位 0 → 4π (两个完整波周期)
        const phase = self.progress * Math.PI * 4
        updateAllNodes(phase)
      },
    },
  })

  // 场景旋转
  master.to(stage, { rotateX: 40, rotateY: -10, duration: D * .4 }, 0)
  master.to(stage, { rotateX: -15, rotateY: 15, duration: D * .5 }, D * .3)
  master.to(stage, { rotateX: 40, rotateY: 0, duration: D * .3 }, D * .7)

  if (glowA.value) master.to(glowA.value, { x: '4vw', y: '-3vh', duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-3vw', y: '4vh', duration: D }, 0)
  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupWavePropagation() }))
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
/* ═══════════════════════ 算法艺术空间 ═══════════════════════ */
.al-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 48%, #0a0818 0%, #040210 55%, #010004 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
}

.al-glow { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.al-glow--a { width: 30vw; height: 30vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(60,140,220,.1) 0%, transparent 70%); }
.al-glow--b { width: 28vw; height: 28vw; bottom: -4vh; right: -2vw; background: radial-gradient(circle, rgba(160,100,220,.08) 0%, transparent 70%); }

/* ── 滚动 ── */
.al-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(60,140,220,.08); }
}
.al-track { position: relative; width: 100%; }
.al-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.al-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.al-kicker { display: inline-block; font-size: .52rem; font-weight: 700; letter-spacing: .22em; color: rgba(80,160,220,.55); background: rgba(40,120,200,.04); backdrop-filter: blur(8px); border: 1px solid rgba(40,120,200,.1); border-radius: 999px; padding: .16rem .85rem; margin-bottom: .45rem; }
.al-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.al-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.2rem); font-weight: 900; color: #5898d0;
  &--algo {
    background: linear-gradient(150deg, #3098e0 0%, #60d0f8 30%, #c060e0 60%, #e080f0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 10px rgba(60,160,230,.5));
  }
}
.al-divider { width: 100px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, #3098e0, #c060e0, #3098e0, transparent); }
.al-sub { margin: 0; font-size: clamp(.56rem, 1vw, .72rem); color: rgba(60,140,210,.3); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ 3D 场景 ═══════════════════════ */
.al-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(.7);
  width: 0; height: 0; z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 45%;
}
.al-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════ 🔑 程序化3D节点 ═══════════════ */
.al-node {
  --hue: 220; --light: 50;
  position: absolute;
  transform-style: preserve-3d;
  will-change: transform;
  backface-visibility: hidden;
}

.al-node__face {
  position: absolute; inset: 0; border-radius: 2px; overflow: hidden;
  background: hsl(var(--hue), 60%, var(--light));
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
  // 🔑 颜色跟随波高变化 (JS setProperty)
  transition: background .3s ease;
}
.al-node__img {
  display: block; object-fit: cover;
  width: 100%; height: 100%;
  opacity: .75;
  mix-blend-mode: overlay;
}

/* 🔑 3D厚度顶面 (translateZ + rotateX) */
.al-node__top {
  position: absolute; top: 0; left: 0; right: 0; height: 4px; border-radius: 2px 2px 0 0;
  background: hsl(var(--hue), 40%, calc(var(--light) + 15));
  transform: translateZ(4px) rotateX(-90deg);
  transform-origin: top center;
}

/* ── 波函数参数面板 ── */
.al-params { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; display: flex; gap: .6rem; }
.al-params__item { font-size: .48rem; font-weight: 600; letter-spacing: .1em; font-family: 'Courier New', monospace; color: rgba(60,150,220,.45); background: rgba(4,2,8,.45); backdrop-filter: blur(8px); border-radius: 999px; padding: .12rem .65rem; border: 1px solid rgba(40,120,200,.08); }

.al-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(40,120,200,.02); }
.al-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #3098e0, #c060e0, #3098e0); }

@media (max-width: 768px) {
  .al-header { top: 2vh; } .al-kicker { font-size: .34rem; } .al-title__c { font-size: 1.4rem; }
  .al-scene { transform: translate(-50%, -50%) scale(.45); perspective: 600px; }
}
</style>
