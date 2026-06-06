<template>
  <section ref="rootRef" class="ir-root" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <!-- 环境光 -->
    <div ref="glowA" class="ir-glow ir-glow--a"></div>
    <div ref="glowB" class="ir-glow ir-glow--b"></div>
    <div ref="glowC" class="ir-glow ir-glow--c"></div>

    <!-- 飘浮微粒 -->
    <div ref="moteField" class="ir-motes">
      <span v-for="m in motes" :key="m.id" class="ir-mote" :style="m.style"></span>
    </div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="ir-scroll">
      <div ref="trackRef" class="ir-track" :style="{ height: trackHeight }">
        <div class="ir-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="ir-header">
            <span class="ir-kicker">✦ CSS3 3D · 惯性飘带 · 物理拟真 ✦</span>
            <h1 class="ir-title">
              <span ref="tc1" class="ir-title__c">风</span>
              <span ref="tc2" class="ir-title__c ir-title__c--accent">拂</span>
              <span ref="tc3" class="ir-title__c">飘</span>
              <span ref="tc4" class="ir-title__c ir-title__c--accent">带</span>
            </h1>
            <div ref="dividerRef" class="ir-divider"></div>
            <p ref="subRef" class="ir-sub">
              向下滚动 · cubic-bezier 惯性拟真 · 飘带随风拂动 · 超调回弹
            </p>
          </header>

          <!-- ════════════════ CSS3 3D 飘带场景 ════════════════ -->
          <div ref="sceneRef" class="ir-scene">
            <div ref="stageRef" class="ir-stage">

              <!-- 5条飘带面板 -->
              <div
                v-for="(ribbon, i) in ribbons"
                :key="ribbon.id"
                :ref="el => { ribbonRefs[i] = el as HTMLElement | null }"
                class="ir-ribbon"
                :style="ribbonBaseStyle(i)"
              >
                <!-- 飘带面板主体 -->
                <div class="ir-panel">
                  <!-- 图片 -->
                  <div class="ir-panel__img-wrap">
                    <img
                      :src="ribbon.image"
                      :alt="ribbon.label"
                      class="ir-panel__img"
                      loading="lazy"
                    />
                    <!-- 光泽覆盖层 -->
                    <div class="ir-panel__sheen"></div>
                  </div>
                  <!-- 标签 -->
                  <span class="ir-panel__tag">{{ ribbon.label }}</span>
                </div>
                <!-- 飘带拖尾 -->
                <div class="ir-ribbon__trail"></div>
              </div>

            </div>
          </div>

          <!-- 惯性指示器 -->
          <div ref="inertiaIndicator" class="ir-inertia-indicator">
            <span class="ir-inertia-indicator__dot"></span>
            <span class="ir-inertia-indicator__label">
              惯性相位 {{ currentPhase }}/5 · {{ phaseLabel }}
            </span>
          </div>

          <div class="ir-progress"><div ref="progRef" class="ir-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DInertiaRibbon — CSS3 3D 惯性飘带 · 物理拟真
//
//  核心创新：摒弃机械匀速运动，模拟真实物理惯性
//
//  物理惯性技术栈：
//  1. cubic-bezier(0.175, 0.885, 0.32, 1.275) — 缓入→加速→超调→回弹
//  2. rotateX() + rotateY() — 构建飘带基础3D倾斜姿态
//  3. scale3d() — 沿Z轴拉伸强化纵深飘动感
//  4. 阵风模型 — 加速期(0.15s) → 超调期(0.1s) → 回弹期(0.2s)
//  5. 波纹传播 — staggered 相位差模拟风力沿飘带传播
//  6. 鼠标视差 — 光标位置微调飘带倾斜 (CSS transition)
//  7. 拖尾效果 — 每根飘带后方半透明拖尾模拟运动残影
//
//  设计风格：高端品牌 · 香槟金 · 玫瑰粉 · 奶油白 · 奢华轻盈
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

// ═══════════════─ 物理惯性缓动 ─═══════════════
// 🔑 核心缓动曲线：起始缓入 → 中段加速 → 末端超调回弹
// 等价于 GSAP: back.out(1.275) 或 elastic.out(1, 0.5)
const INERTIA_EASE = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
const GUST_IN = 'power3.in'        // 阵风骤起 (快速加速)
const GUST_OVERSHOOT = 'back.out(1.7)'  // 超调回弹
const SETTLE = 'power2.out'        // 自然衰减

interface RibbonData {
  id: number
  label: string
  image: string
  // 3D 基础姿态
  baseRotateX: number
  baseRotateY: number
  baseZ: number
  // 飘动参数
  flutterAmplitude: number  // 飘动幅度
  phaseOffset: number       // 相位偏移(秒)
}

const ribbons: RibbonData[] = [
  {
    id: 0, label: 'SILK.WHISPER',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    baseRotateX: -12, baseRotateY: -15, baseZ: -250,
    flutterAmplitude: 25, phaseOffset: 0,
  },
  {
    id: 1, label: 'VELVET.DRIFT',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    baseRotateX: -6, baseRotateY: 10, baseZ: -120,
    flutterAmplitude: 28, phaseOffset: 0.35,
  },
  {
    id: 2, label: 'CHIFFON.WAVE',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
    baseRotateX: 2, baseRotateY: -8, baseZ: 0,
    flutterAmplitude: 30, phaseOffset: 0.7,
  },
  {
    id: 3, label: 'SATIN.SWAY',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    baseRotateX: 8, baseRotateY: 12, baseZ: 120,
    flutterAmplitude: 27, phaseOffset: 1.05,
  },
  {
    id: 4, label: 'ORGANZA.FLOW',
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80',
    baseRotateX: 14, baseRotateY: -5, baseZ: 240,
    flutterAmplitude: 24, phaseOffset: 1.4,
  },
]

const RIBBON_COUNT = ribbons.length
const GUST_COUNT = 6 // 6次阵风
const trackHeight = `${(GUST_COUNT + 1) * 100}vh`

// ── 飘浮微粒 ──
interface Mote {
  id: number
  style: Record<string, string>
}
function genMotes(count: number): Mote[] {
  const hash = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    style: {
      '--mx': `${hash(i * 5 + 1) * 100}%`,
      '--my': `${15 + hash(i * 5 + 2) * 70}%`,
      '--ms': `${1 + hash(i * 7 + 3) * 3}px`,
      '--mdur': `${8 + hash(i * 11 + 5) * 14}s`,
      '--mdelay': `${hash(i * 13 + 7) * -10}s`,
      '--mdrift': `${(hash(i * 17 + 11) - 0.5) * 40}px`,
    },
  }))
}
const motes = ref<Mote[]>(genMotes(35))

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
const ribbonRefs = ref<(HTMLElement | null)[]>(Array(RIBBON_COUNT).fill(null))
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const glowC = ref<HTMLElement | null>(null)
const moteField = ref<HTMLElement | null>(null)
const inertiaIndicator = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const currentPhase = ref(1)
const phaseLabel = ref('微风初拂')
const cleanupFns: TweenCleanup[] = []

// ── 鼠标视差状态 ──
const mouseX = ref(0)
const mouseY = ref(0)
const mouseActive = ref(false)

function onMouseMove(e: MouseEvent) {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 2   // -1 ~ 1
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 2  // -1 ~ 1
  mouseActive.value = true
}
function onMouseLeave() {
  mouseActive.value = false
}

// ── 飘带基础样式 (含 CSS transition 惯性响应) ──
function ribbonBaseStyle(i: number) {
  const r = ribbons[i]
  return {
    transform: `
      translateZ(${r.baseZ}px)
      rotateX(${r.baseRotateX}deg)
      rotateY(${r.baseRotateY}deg)
    `,
    // 🔑 CSS transition 使用物理惯性贝塞尔曲线
    // 鼠标移动时，微调旋转通过 transition 自然过渡
    transition: `transform 0.9s ${INERTIA_EASE}, filter 0.6s ease-out`,
  }
}

const phaseLabels = ['微风初拂', '轻飘上扬', '阵风骤起', '疾风回旋', '飘带翻飞', '风息归宁']

// ═══════════════════════ 入场动画 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)

  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' },
  })

  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: INERTIA_EASE })
  // 标题字符 — 逐个用惯性缓动飞入
  tl.fromTo(chars, { autoAlpha: 0, z: -300, scale: 0.2, filter: 'blur(12px)' }, {
    autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)',
    duration: 0.75, stagger: 0.1,
    ease: INERTIA_EASE,  // 🔑 惯性超调回弹入场
  }, '-=0.4')
  tl.fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, '-=0.2')
  tl.fromTo(subRef.value, { autoAlpha: 0, y: 15, filter: 'blur(4px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }, '-=0.1')
  // 场景 — 飘带从远处飘入
  tl.fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.88, rotateX: 15, rotateY: -10 }, {
    autoAlpha: 1, scale: 1, rotateX: 0, rotateY: 0,
    duration: 1.0, ease: INERTIA_EASE,  // 🔑 场景入场也有惯性
  }, '-=0.35')

  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 核心：惯性飘带物理动画 ═══════════════════════
function setupInertiaRibbon() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value

  gsap.set(stage, { rotateX: 0, rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.8,
      onUpdate(self) {
        currentPhase.value = Math.min(GUST_COUNT, Math.max(1, Math.ceil(self.progress * GUST_COUNT)))
        phaseLabel.value = phaseLabels[currentPhase.value - 1] || '风息归宁'
      },
    },
  })

  const D = GUST_COUNT // 总持续 = 6次阵风周期

  // ═══════════════════════ 阵风模型 ═══════════════════════
  // 每次阵风分三阶段：
  //   ① 加速期 (0→0.15t): 飘带被风力推动 → rotateY 快速变化
  //   ② 超调期 (0.15→0.25t): 惯性导致超过平衡位置 → 反向微调
  //   ③ 回弹期 (0.25→0.4t): 飘带弹性回摆 → 逐渐稳定
  // 各飘带根据 phaseOffset 依次响应 (波纹传播)

  for (let gust = 0; gust < GUST_COUNT; gust++) {
    const t0 = gust // 阵风起始时间
    const gustDir = gust % 2 === 0 ? 1 : -1 // 交替方向
    const gustStrength = 0.7 + (gust % 3) * 0.3 // 0.7 ~ 1.3 变化强度

    // 场景级响应 — 整个舞台微倾
    master.to(stage, {
      rotateX: gustDir * 3 * gustStrength,
      rotateY: gustDir * -4 * gustStrength,
      duration: 0.12, ease: GUST_IN, // 🔑 风力骤起
    }, t0)
    master.to(stage, {
      rotateX: gustDir * 4.5 * gustStrength,
      rotateY: gustDir * -6 * gustStrength,
      duration: 0.1, ease: 'power2.out', // 🔑 超调过冲
    }, t0 + 0.12)
    master.to(stage, {
      rotateX: gustDir * 1.5 * gustStrength,
      rotateY: gustDir * -2 * gustStrength,
      duration: 0.25, ease: INERTIA_EASE, // 🔑 回弹稳定
    }, t0 + 0.22)

    // 🔑 每条飘带依次响应 (波纹传播)
    ribbonRefs.value.forEach((ribbonEl, i) => {
      if (!ribbonEl) return
      const r = ribbons[i]
      const phaseShift = r.phaseOffset

      // ① 加速期：飘带被风力推向一侧
      master.to(ribbonEl, {
        rotateY: r.baseRotateY + gustDir * r.flutterAmplitude * gustStrength,
        rotateX: r.baseRotateX + gustDir * (r.flutterAmplitude * 0.4) * gustStrength,
        scaleX: 1.03, scaleY: 0.98, // 🔑 飘带横向拉伸/纵向压缩
        duration: 0.13, ease: GUST_IN,
      }, t0 + phaseShift)

      // ② 超调期：惯性过冲
      master.to(ribbonEl, {
        rotateY: r.baseRotateY + gustDir * r.flutterAmplitude * 1.2 * gustStrength,
        rotateX: r.baseRotateX + gustDir * (r.flutterAmplitude * 0.55) * gustStrength,
        scaleX: 1.05, scaleY: 0.95,
        duration: 0.09, ease: GUST_OVERSHOOT, // 🔑 超调回弹
      }, t0 + phaseShift + 0.13)

      // ③ 回弹期：弹性恢复
      master.to(ribbonEl, {
        rotateY: r.baseRotateY + gustDir * r.flutterAmplitude * 0.15 * gustStrength,
        rotateX: r.baseRotateX + gustDir * (r.flutterAmplitude * 0.08) * gustStrength,
        scaleX: 1, scaleY: 1,
        duration: 0.22, ease: INERTIA_EASE, // 🔑 物理惯性恢复
      }, t0 + phaseShift + 0.22)

      // 🎨 飘带光泽变化 — 运动时更亮
      master.to(ribbonEl, {
        filter: `brightness(1.2) drop-shadow(0 4px 24px rgba(255,200,150,0.35))`,
        duration: 0.1, ease: GUST_IN,
      }, t0 + phaseShift)
      master.to(ribbonEl, {
        filter: `brightness(1.02) drop-shadow(0 2px 8px rgba(255,180,130,0.15))`,
        duration: 0.25, ease: INERTIA_EASE,
      }, t0 + phaseShift + 0.2)
    })
  }

  // ── 环境光漂移 ──
  if (glowA.value) master.to(glowA.value, { x: '8vw', y: '-6vh', scale: 1.2, duration: D }, 0)
  if (glowB.value) master.to(glowB.value, { x: '-6vw', y: '5vh', scale: 1.25, duration: D }, 0)
  if (glowC.value) master.to(glowC.value, { x: '4vw', y: '8vh', scale: 1.15, duration: D }, 0)

  // ── 微粒场 ──
  if (moteField.value) {
    master.to(moteField.value, { opacity: 0.5, duration: 0.5 }, 0)
    for (let g = 1; g < GUST_COUNT; g++) {
      master.to(moteField.value, { opacity: 0.85, duration: 0.15, ease: GUST_IN }, g + 0.05)
      master.to(moteField.value, { opacity: 0.45, duration: 0.3, ease: INERTIA_EASE }, g + 0.2)
    }
  }

  // ── 指示器脉冲 ──
  if (inertiaIndicator.value) {
    for (let g = 0; g < GUST_COUNT; g++) {
      master.to(inertiaIndicator.value, { scale: 1.2, opacity: 1, duration: 0.1, ease: GUST_IN }, g + 0.1)
      master.to(inertiaIndicator.value, { scale: 1, opacity: 0.65, duration: 0.3, ease: INERTIA_EASE }, g + 0.2)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

// ═══════════════════════ 鼠标视差 (CSS transition 响应) ═══════════════════════
let rafId = 0
function applyMouseParallax() {
  if (!mouseActive.value) {
    // 鼠标离开 — 所有飘带回归基础姿态
    ribbonRefs.value.forEach((el, i) => {
      if (!el) return
      const r = ribbons[i]
      el.style.transform = `
        translateZ(${r.baseZ}px)
        rotateX(${r.baseRotateX}deg)
        rotateY(${r.baseRotateY}deg)
        scale3d(1, 1, 1)
      `
    })
    if (stageRef.value) {
      stageRef.value.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }
    return
  }

  const mx = mouseX.value
  const my = mouseY.value

  // 舞台微倾 — 跟随光标
  if (stageRef.value) {
    stageRef.value.style.transform = `rotateX(${-my * 3}deg) rotateY(${mx * 4}deg)`
  }

  // 🔑 每条飘带根据深度有不同的视差响应
  ribbonRefs.value.forEach((el, i) => {
    if (!el) return
    const r = ribbons[i]
    const depthFactor = 0.6 + (i / RIBBON_COUNT) * 0.8 // 前景响应更大
    const px = mx * 8 * depthFactor
    const py = -my * 6 * depthFactor
    el.style.transform = `
      translateZ(${r.baseZ}px)
      rotateX(${r.baseRotateX + py}deg)
      rotateY(${r.baseRotateY + px}deg)
      scale3d(${1 + Math.abs(mx) * 0.03}, ${1 - Math.abs(my) * 0.02}, ${1 + Math.abs(mx) * 0.05})
    `
    // 🔑 所有变化通过 CSS transition: cubic-bezier(0.175, 0.885, 0.32, 1.275) 平滑过渡
  })

  rafId = requestAnimationFrame(applyMouseParallax)
}

// ═══════════════════════ 生命周期 ═══════════════════════
function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setupEntrance()
    setupInertiaRibbon()
  }))
  window.addEventListener('resize', handleResize)
  rafId = requestAnimationFrame(applyMouseParallax)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(rafId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 根容器 ═══════════════════════ */
.ir-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(170deg, #fdf8f4 0%, #fcf6f1 18%, #fef9f5 35%, #fdf7f2 55%, #fef8f4 75%, #fcf5f0 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  cursor: crosshair;
}

/* ── 环境光 ── */
.ir-glow { position: absolute; border-radius: 50%; filter: blur(75px); pointer-events: none; will-change: transform; z-index: 0; }
.ir-glow--a { width: 34vw; height: 34vw; top: -6vh; left: -4vw; background: radial-gradient(circle, rgba(255,200,160,.4) 0%, transparent 70%); }
.ir-glow--b { width: 30vw; height: 30vw; bottom: -5vh; right: -3vw; background: radial-gradient(circle, rgba(220,180,200,.35) 0%, transparent 70%); }
.ir-glow--c { width: 26vw; height: 26vw; top: 40vh; left: 55vw; background: radial-gradient(circle, rgba(240,210,170,.3) 0%, transparent 70%); }

/* ── 飘浮微粒 ── */
.ir-motes { position: absolute; inset: 0; z-index: 3; pointer-events: none; will-change: opacity; opacity: 0.55; }
.ir-mote {
  --mx: 50%; --my: 50%; --ms: 2px; --mdur: 12s; --mdelay: 0s; --mdrift: 0px;
  position: absolute; left: var(--mx); top: var(--my);
  width: var(--ms); height: var(--ms); border-radius: 50%;
  background: radial-gradient(circle, rgba(255,220,180,.7) 0%, rgba(255,180,140,.3) 50%, transparent 70%);
  box-shadow: 0 0 calc(var(--ms) * 3) rgba(255,200,150,.4);
  animation: mote-drift var(--mdur) var(--mdelay) infinite ease-in-out;
}
@keyframes mote-drift {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: .5; }
  25% { transform: translateY(-10vh) translateX(var(--mdrift)) scale(1.3); opacity: .8; }
  50% { transform: translateY(-20vh) translateX(calc(var(--mdrift) * -.5)) scale(.7); opacity: .3; }
  75% { transform: translateY(-8vh) translateX(calc(var(--mdrift) * .3)) scale(1.1); opacity: .6; }
  100% { transform: translateY(0) translateX(0) scale(1); opacity: .5; }
}

/* ── 滚动 ── */
.ir-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(220,160,120,.25); &:hover { background: rgba(220,160,120,.45); } }
}
.ir-track { position: relative; width: 100%; }
.ir-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.ir-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.ir-kicker { display: inline-block; font-size: .6rem; font-weight: 700; letter-spacing: .28em; color: rgba(180,130,100,.8); background: rgba(240,200,160,.12); backdrop-filter: blur(8px); border: 1px solid rgba(220,170,130,.22); border-radius: 999px; padding: .25rem 1.2rem; margin-bottom: .5rem; }
.ir-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.ir-title__c { display: inline-block; font-size: clamp(2.2rem, 6vw, 5rem); font-weight: 900; color: #c89870; will-change: transform,opacity,filter;
  &--accent {
    background: linear-gradient(150deg, #e8b880 0%, #d49560 25%, #f0c890 50%, #c88060 75%, #e8c090 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 12px rgba(220,160,100,.45));
  }
}
.ir-divider { width: 110px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #d4a070, #f0c890, #c89870, transparent); transform-origin: center; }
.ir-sub { margin: 0; font-size: clamp(.7rem, 1.1vw, .86rem); color: rgba(180,130,100,.45); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 场景 ═══════════════════════ */
.ir-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1200px;
  perspective-origin: 50% 45%;
  will-change: transform, opacity;
}

/* 🔑 3D 舞台 */
.ir-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
  // 🔑 舞台自身也有惯性过渡
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* ═══════════════════════ 飘带面板 ═══════════════════════ */
.ir-ribbon {
  position: absolute; transform-style: preserve-3d;
  will-change: transform, filter;
  // 🔑 核心：CSS transition 使用物理惯性贝塞尔曲线
  // GSAP 不直接操作此元素时，transition 接管鼠标视差平滑过渡
  transition: transform 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275),
              filter 0.6s ease-out;
}

.ir-panel {
  position: absolute;
  width: min(52vw, 400px); height: min(30vw, 240px);
  margin-left: calc(min(52vw, 400px) / -2);
  margin-top: calc(min(30vw, 240px) / -2);
  border-radius: 14px; overflow: hidden;
  box-shadow:
    0 16px 48px rgba(0,0,0,.12),
    0 0 0 1px rgba(255,255,255,.3),
    inset 0 0 0 1px rgba(255,255,255,.12);
  background: #faf6f0;
  backface-visibility: hidden;
}
.ir-panel__img-wrap { position: relative; width: 100%; height: 100%; overflow: hidden; }
.ir-panel__img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* 🔑 光泽覆盖层 — 模拟飘带丝绸光泽 */
.ir-panel__sheen {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background:
    linear-gradient(125deg,
      rgba(255,255,255,.18) 0%,
      rgba(255,255,255,.04) 25%,
      transparent 40%,
      rgba(255,255,255,.06) 60%,
      rgba(255,255,255,.12) 80%,
      rgba(255,255,255,.02) 100%
    ),
    linear-gradient(200deg,
      transparent 30%,
      rgba(255,240,220,.08) 50%,
      transparent 70%
    );
  mix-blend-mode: soft-light;
}

.ir-panel__tag {
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 3;
  font-size: .6rem; font-weight: 700; letter-spacing: .22em; white-space: nowrap;
  color: rgba(160,110,80,.75); font-family: 'Courier New', monospace;
  background: rgba(255,255,255,.45); backdrop-filter: blur(6px);
  border-radius: 999px; padding: .15rem .75rem;
  border: 1px solid rgba(200,150,110,.18);
}

/* 🔑 飘带拖尾 — 模拟运动残影 */
.ir-ribbon__trail {
  position: absolute;
  width: min(52vw, 400px); height: min(30vw, 240px);
  margin-left: calc(min(52vw, 400px) / -2);
  margin-top: calc(min(30vw, 240px) / -2);
  border-radius: 14px;
  background: linear-gradient(180deg,
    rgba(240,200,160,.12) 0%,
    rgba(220,180,140,.06) 40%,
    transparent 100%
  );
  filter: blur(12px);
  transform: translateZ(-30px) scale(1.06);
  z-index: -1;
  opacity: .5;
}

/* ── 惯性指示器 ── */
.ir-inertia-indicator { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; pointer-events: none; display: flex; align-items: center; gap: .5rem; opacity: .65; will-change: transform,opacity; }
.ir-inertia-indicator__dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, #e8b880, #d49560); box-shadow: 0 0 12px rgba(220,160,100,.5); animation: ir-dot-pulse 2s ease-in-out infinite; }
@keyframes ir-dot-pulse { 0%,100% { transform: scale(1); opacity: .6; } 50% { transform: scale(1.5); opacity: 1; } }
.ir-inertia-indicator__label { font-size: .66rem; font-weight: 600; letter-spacing: .18em; color: #c89870; background: rgba(255,255,255,.5); backdrop-filter: blur(8px); border-radius: 999px; padding: .22rem 1rem; border: 1px solid rgba(220,160,120,.2); white-space: nowrap; }

/* ── 进度条 ── */
.ir-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(220,160,120,.05); }
.ir-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #d4a070, #f0c890, #c89870, #e8c090, #d4a070); background-size: 200% 100%; box-shadow: 0 0 12px rgba(220,150,100,.4); }

/* ═══════════════════════ 响应式 ═══════════════════════ */
@media (max-width: 1024px) {
  .ir-scene { perspective: 900px; }
  .ir-panel { width: min(60vw, 340px); height: min(36vw, 210px); margin-left: calc(min(60vw, 340px) / -2); margin-top: calc(min(36vw, 210px) / -2); }
  .ir-ribbon__trail { width: min(60vw, 340px); height: min(36vw, 210px); margin-left: calc(min(60vw, 340px) / -2); margin-top: calc(min(36vw, 210px) / -2); }
}

@media (max-width: 768px) {
  .ir-header { top: 2vh; } .ir-kicker { font-size: .48rem; padding: .18rem .6rem; } .ir-title__c { font-size: 1.7rem; }
  .ir-scene { perspective: 700px; }
  .ir-panel { width: 72vw; height: 44vw; margin-left: -36vw; margin-top: -22vw; border-radius: 10px; }
  .ir-ribbon__trail { width: 72vw; height: 44vw; margin-left: -36vw; margin-top: -22vw; }
  .ir-panel__tag { font-size: .5rem; }
  .ir-inertia-indicator__label { font-size: .56rem; padding: .18rem .7rem; }
}
</style>
