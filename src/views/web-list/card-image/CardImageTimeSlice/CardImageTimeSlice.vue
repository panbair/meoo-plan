<template>
  <section ref="parentRef" class="ts-container">
    <!-- ==================== Layer 1-36: 12 条切片 × 3 时间节点 ==================== -->
    <div
      v-for="(_, index) in 12"
      :key="index"
      class="ts-strip"
      :class="[`ts-strip-${index}`, index % 2 === 0 ? 'ts-strip-even' : 'ts-strip-odd']"
    >
      <!-- 黎明层 -->
      <img
        :src="dawnSrc"
        class="ts-img ts-img-dawn"
        crossorigin="anonymous"
        :style="{ clipPath: `inset(0 ${rightGap(index)}% 0 ${leftGap(index)}%)` }"
      />
      <!-- 正午层 -->
      <img
        :src="noonSrc"
        class="ts-img ts-img-noon"
        crossorigin="anonymous"
        :style="{ clipPath: `inset(0 ${rightGap(index)}% 0 ${leftGap(index)}%)` }"
      />
      <!-- 黄昏层 -->
      <img
        :src="duskSrc"
        class="ts-img ts-img-dusk"
        crossorigin="anonymous"
        :style="{ clipPath: `inset(0 ${rightGap(index)}% 0 ${leftGap(index)}%)` }"
      />
      <!-- 切片边缘辉光线 -->
      <div
        class="ts-strip-edge ts-strip-edge-left"
        :style="{ left: `${index * stripPct + gapPct}%` }"
      ></div>
      <div
        class="ts-strip-edge ts-strip-edge-right"
        :style="{ left: `${(index + 1) * stripPct - gapPct}%` }"
      ></div>
    </div>

    <!-- ==================== Layer 37: 时间轴指示器 ==================== -->
    <div ref="indicatorRef" class="ts-indicator">
      <div class="ts-indicator-track">
        <div ref="indicatorFillRef" class="ts-indicator-fill"></div>
      </div>
      <div class="ts-indicator-labels">
        <span class="ts-indicator-label" :class="{ 'ts-indicator-active': activeLabel === 0 }">DAWN</span>
        <span class="ts-indicator-label" :class="{ 'ts-indicator-active': activeLabel === 1 }">NOON</span>
        <span class="ts-indicator-label" :class="{ 'ts-indicator-active': activeLabel === 2 }">DUSK</span>
      </div>
      <div ref="indicatorDotRef" class="ts-indicator-dot"></div>
    </div>

    <!-- ==================== Layer 38: 时钟装饰层 ==================== -->
    <div ref="clockRef" class="ts-clock">
      <svg viewBox="0 0 120 120" class="ts-clock-svg">
        <!-- 表盘刻度 -->
        <circle cx="60" cy="60" r="52" class="ts-clock-ring" />
        <g v-for="h in 12" :key="'tick-' + h">
          <line
            :x1="60 + 43 * Math.cos((h - 3) * Math.PI / 6)"
            :y1="60 + 43 * Math.sin((h - 3) * Math.PI / 6)"
            :x2="60 + 48 * Math.cos((h - 3) * Math.PI / 6)"
            :y2="60 + 48 * Math.sin((h - 3) * Math.PI / 6)"
            class="ts-clock-tick"
            :class="{'ts-clock-tick-major': h % 3 === 0}"
          />
        </g>
        <!-- 时针 -->
        <line x1="60" y1="60" x2="60" y2="32" ref="hourHandRef" class="ts-clock-hand ts-clock-hour" />
        <!-- 分针 -->
        <line x1="60" y1="60" x2="60" y2="22" ref="minuteHandRef" class="ts-clock-hand ts-clock-minute" />
        <!-- 中心点 -->
        <circle cx="60" cy="60" r="3" class="ts-clock-center" />
      </svg>
      <!-- 模拟时间显示 -->
      <div class="ts-clock-time">
        <span ref="clockTimeRef" class="ts-clock-digital">06:00</span>
        <span class="ts-clock-period">AM</span>
      </div>
    </div>

    <!-- ==================== 色温滤镜覆盖层 ==================== -->
    <div ref="overlayRef" class="ts-overlay"></div>

    <!-- ==================== 标题标签 ==================== -->
    <div ref="titleRef" class="ts-title">
      <h2 class="ts-title-main">时间切片流转</h2>
      <p class="ts-title-sub">TIME SLICE FLOW</p>
      <div class="ts-title-divider"></div>
      <p class="ts-title-desc">黎明 · 正午 · 黄昏</p>
    </div>

    <!-- ==================== 进度条 ==================== -->
    <div ref="progressRef" class="ts-progress">
      <div ref="progressBarRef" class="ts-progress-bar"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ======== 类型 ========
type TweenCleanup = () => void

// ======== 模板引用 ========
const parentRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const indicatorFillRef = ref<HTMLElement | null>(null)
const indicatorDotRef = ref<HTMLElement | null>(null)
const clockRef = ref<HTMLElement | null>(null)
const hourHandRef = ref<SVGLineElement | null>(null)
const minuteHandRef = ref<SVGLineElement | null>(null)
const clockTimeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

// ======== 响应式状态 ========
const activeLabel = ref(0)
const cleanupFns: TweenCleanup[] = []

// ======== 图片资源 ========
const dawnSrc = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80'
const noonSrc = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80'
const duskSrc = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400&q=80'

// ======== 切片计算 ========
const stripCount = 12
const stripPct = 100 / stripCount
const gapPct = 0.25

const leftGap = (index: number): number => {
  return index * stripPct + gapPct
}

const rightGap = (index: number): number => {
  return (stripCount - 1 - index) * stripPct + gapPct
}

// ======== 初始化 ========
onMounted(() => {
  if (!parentRef.value) return
  requestAnimationFrame(() => setup())
})

const setup = () => {
  const container = parentRef.value
  if (!container) return

  // ===== 查询所有切片 DOM =====
  const strips = container.querySelectorAll<HTMLElement>('.ts-strip')
  const stripEdges = container.querySelectorAll<HTMLElement>('.ts-strip-edge')

  // ===== 初始状态 =====
  strips.forEach((strip) => {
    const noonImg = strip.querySelector<HTMLImageElement>('.ts-img-noon')
    const duskImg = strip.querySelector<HTMLImageElement>('.ts-img-dusk')
    if (noonImg) gsap.set(noonImg, { opacity: 0 })
    if (duskImg) gsap.set(duskImg, { opacity: 0 })
  })

  // 边缘辉光初始隐藏
  stripEdges.forEach((edge) => {
    gsap.set(edge, { opacity: 0 })
  })

  // 覆盖层初始 — 黎明冷蓝色调
  gsap.set(overlayRef.value, {
    background: 'linear-gradient(180deg, rgba(30,60,120,0.08) 0%, rgba(20,40,100,0.04) 100%)',
  })

  // 时钟初始
  gsap.set(hourHandRef.value, { rotation: -60 })
  gsap.set(minuteHandRef.value, { rotation: 0 })

  // 标题初始
  gsap.set(titleRef.value, { opacity: 0, y: 20 })

  // 进度条初始
  gsap.set(progressBarRef.value, { width: '0%' })

  // 指示器点初始
  gsap.set(indicatorDotRef.value, { left: '0%' })

  activeLabel.value = 0

  // ===== 主时间线 =====
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.2,
    },
  })

  // ===== 核心动画：通过 onUpdate 逐帧更新 =====
  mainTl.to(
    {},
    {
      duration: 1,
      onUpdate: () => {
        const p = mainTl.progress() // 0 → 1

        // --- 更新每个切片 ---
        strips.forEach((strip, i) => {
          const isOdd = i % 2 === 1
          const isEven = i % 2 === 0

          // 错峰偏移：奇数条先行，偶数条后行
          // 奇数条偏移量小（0~0.06），偶数条偏移量大（0.18~0.22）
          const baseDelay = isEven ? 0.18 : i * 0.012
          const span = 0.72 // 动画持续 72% 的滚动区间
          const localProgress = Math.max(0, Math.min(1, (p - baseDelay) / span))

          // 三阶段透明度计算
          let dawnOpacity = 1
          let noonOpacity = 0
          let duskOpacity = 0

          if (localProgress < 0.35) {
            // 黎明 → 正午
            const t = localProgress / 0.35
            dawnOpacity = 1 - t
            noonOpacity = t
          } else if (localProgress < 0.65) {
            // 正午保持
            dawnOpacity = 0
            noonOpacity = 1
          } else {
            // 正午 → 黄昏
            const t = (localProgress - 0.65) / 0.35
            noonOpacity = 1 - t
            duskOpacity = t
          }

          const dawnImg = strip.querySelector<HTMLImageElement>('.ts-img-dawn')
          const noonImg = strip.querySelector<HTMLImageElement>('.ts-img-noon')
          const duskImg = strip.querySelector<HTMLImageElement>('.ts-img-dusk')

          if (dawnImg) dawnImg.style.opacity = String(dawnOpacity)
          if (noonImg) noonImg.style.opacity = String(noonOpacity)
          if (duskImg) duskImg.style.opacity = String(duskOpacity)
        })

        // --- 切片边缘辉光：转换过程中发光 ---
        stripEdges.forEach((edge, edgeIdx) => {
          const stripEl = edge.parentElement
          const imgEl = stripEl?.querySelector<HTMLImageElement>('.ts-img-noon')
          if (imgEl) {
            const noonOp = parseFloat(imgEl.style.opacity || '0')
            const duskEl = stripEl.querySelector<HTMLImageElement>('.ts-img-dusk')
            const duskOpParsed = parseFloat(duskEl?.style.opacity || '0')
            // 辉光强度 = noon 在中间段的闪烁 + dusk 转换时的闪烁
            const glowIntensity = Math.max(
              noonOp > 0.15 && noonOp < 0.85 ? 0.5 : 0,
              duskOpParsed > 0.15 && duskOpParsed < 0.85 ? 0.5 : 0
            )
            // 加上随机微闪
            const flicker = Math.sin(p * 60 + edgeIdx) * 0.15

            edge.style.opacity = String(Math.max(0, Math.min(1, glowIntensity + flicker)))
          }
        })

        // --- 色温滤镜 ---
        const overlay = overlayRef.value
        if (overlay) {
          // 黎明(冷蓝) → 正午(中性) → 黄昏(暖橙)
          let r: number, g: number, b: number, alpha: number

          if (p < 0.35) {
            // 黎明→正午：冷蓝 → 中性
            const t = p / 0.35
            r = Math.round(30 + t * 200)
            g = Math.round(60 + t * 180)
            b = Math.round(120 - t * 60)
            alpha = 0.08 - t * 0.04
          } else if (p < 0.65) {
            // 正午：中性微偏
            r = Math.round(220 + (p - 0.35) * 30 / 0.3)
            g = Math.round(230 + (p - 0.35) * 20 / 0.3)
            b = Math.round(60 + (p - 0.35) * 30 / 0.3)
            alpha = 0.04 + (p - 0.35) * 0.06 / 0.3
          } else {
            // 正午→黄昏：中性 → 暖橙
            const t = (p - 0.65) / 0.35
            r = Math.round(250)
            g = Math.round(250 - t * 140)
            b = Math.round(90 - t * 50)
            alpha = 0.1 + t * 0.1
          }

          overlay.style.background =
            `linear-gradient(180deg, rgba(${r},${g},${b},${alpha}) 0%, rgba(${Math.round(r * 0.8)},${Math.round(g * 0.7)},${Math.round(b * 0.9)},${alpha * 0.6}) 100%)`
        }

        // --- 时间轴指示器 ---
        const dot = indicatorDotRef.value
        const fill = indicatorFillRef.value
        if (dot) dot.style.left = `${p * 100}%`
        if (fill) fill.style.width = `${p * 100}%`

        // 活跃标签高亮
        if (p < 0.17) {
          activeLabel.value = 0
        } else if (p < 0.83) {
          activeLabel.value = 1
        } else {
          activeLabel.value = 2
        }

        // --- 时钟旋转 ---
        const hourHand = hourHandRef.value
        const minuteHand = minuteHandRef.value
        const clockTime = clockTimeRef.value

        if (hourHand) {
          // 时针从 6:00(180°) → 12:00(360°) → 18:00(540°)
          hourHand.style.transform = `rotate(${-60 + p * 240}deg)`
        }
        if (minuteHand) {
          // 分针转 5 圈
          minuteHand.style.transform = `rotate(${p * 1800}deg)`
        }

        // 数字时间
        if (clockTime) {
          const totalMinutes = Math.floor(6 * 60 + p * 12 * 60) // 6:00 AM to 6:00 PM
          const hours = Math.floor(totalMinutes / 60) % 24
          const minutes = totalMinutes % 60
          const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
          const period = hours < 12 ? 'AM' : 'PM'
          const timeStr = `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
          clockTime.textContent = timeStr

          // 更新 period
          const periodEl = clockTime.parentElement?.querySelector('.ts-clock-period')
          if (periodEl) periodEl.textContent = period
        }
      },
    },
    0,
  )

  // ===== 标题入场 =====
  mainTl.to(titleRef.value, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.02)
  // 标题保持后淡出
  mainTl.to(titleRef.value, { opacity: 0.15, duration: 0.3 }, 0.85)

  // ===== 进度条 =====
  mainTl.to(progressBarRef.value, { width: '100%', duration: 0.98, ease: 'none' }, 0.01)

  // ===== 注册清理 =====
  cleanupFns.push(() => {
    mainTl.scrollTrigger?.kill()
    mainTl.kill()
  })
}

// ======== 卸载 ========
onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.ts-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #06060e;
}

/* ==================== 切片条带 ==================== */
.ts-strip {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.ts-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: opacity;
}

/* 图片层级：黎明底 → 正午中 → 黄昏顶 */
.ts-img-dawn {
  z-index: 1;
}

.ts-img-noon {
  z-index: 2;
}

.ts-img-dusk {
  z-index: 3;
}

/* ==================== 切片边缘辉光线 ==================== */
.ts-strip-edge {
  position: absolute;
  top: 0;
  width: 1.5px;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  will-change: opacity;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 15%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.6) 85%,
    transparent 100%
  );
  filter: blur(1px);
}

.ts-strip-edge-left {
  box-shadow: -2px 0 8px rgba(180, 210, 255, 0.4);
}

.ts-strip-edge-right {
  box-shadow: 2px 0 8px rgba(255, 200, 160, 0.4);
}

/* ==================== 色温滤镜覆盖层 ==================== */
.ts-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  mix-blend-mode: overlay;
  will-change: background;
}

/* ==================== 时间轴指示器 ==================== */
.ts-indicator {
  position: absolute;
  bottom: 8%;
  left: 8%;
  right: 8%;
  z-index: 30;
  pointer-events: none;
}

.ts-indicator-track {
  position: relative;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
}

.ts-indicator-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: linear-gradient(
    90deg,
    rgba(100, 160, 255, 0.6),
    rgba(255, 230, 180, 0.4),
    rgba(255, 160, 80, 0.6)
  );
  border-radius: 1px;
  will-change: width;
}

.ts-indicator-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.ts-indicator-label {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.2);
  transition: color 0.5s ease, text-shadow 0.5s ease;

  &.ts-indicator-active {
    color: rgba(255, 255, 255, 0.85);
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
  }
}

.ts-indicator-dot {
  position: absolute;
  top: -3px;
  left: 0%;
  width: 7px;
  height: 7px;
  background: #fff;
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow:
    0 0 8px rgba(255, 255, 255, 0.6),
    0 0 20px rgba(255, 255, 255, 0.3);
  will-change: left;
}

/* ==================== 时钟装饰层 ==================== */
.ts-clock {
  position: absolute;
  top: 6%;
  right: 6%;
  z-index: 30;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ts-clock-svg {
  width: 80px;
  height: 80px;
  opacity: 0.7;
}

.ts-clock-ring {
  fill: none;
  stroke: rgba(255, 255, 255, 0.15);
  stroke-width: 1.5;
}

.ts-clock-tick {
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 0.8;
}

.ts-clock-tick-major {
  stroke: rgba(255, 255, 255, 0.35);
  stroke-width: 1.2;
}

.ts-clock-hand {
  stroke: rgba(255, 255, 255, 0.75);
  stroke-linecap: round;
  transform-origin: 60px 60px;
}

.ts-clock-hour {
  stroke-width: 2;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.3));
}

.ts-clock-minute {
  stroke-width: 1;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.2));
}

.ts-clock-center {
  fill: rgba(255, 255, 255, 0.8);
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
}

.ts-clock-time {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 6px;
}

.ts-clock-digital {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
}

.ts-clock-period {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
}

/* ==================== 标题标签 ==================== */
.ts-title {
  position: absolute;
  top: 10%;
  left: 8%;
  z-index: 30;
  pointer-events: none;
  will-change: opacity, transform;
}

.ts-title-main {
  margin: 0 0 4px;
  font-size: clamp(20px, 2.8vw, 32px);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 8px;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
}

.ts-title-sub {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 5px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
}

.ts-title-divider {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg,
    rgba(100, 160, 255, 0.4),
    rgba(255, 180, 100, 0.4)
  );
  margin: 8px 0;
}

.ts-title-desc {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.25);
}

/* ==================== 进度条 ==================== */
.ts-progress {
  position: absolute;
  bottom: 3%;
  left: 8%;
  right: 8%;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.04);
  z-index: 30;
  pointer-events: none;
}

.ts-progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(
    90deg,
    rgba(100, 160, 255, 0.4),
    rgba(255, 230, 180, 0.3),
    rgba(255, 140, 60, 0.5)
  );
  will-change: width;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  .ts-clock {
    top: 5%;
    right: 5%;
  }

  .ts-clock-svg {
    width: 56px;
    height: 56px;
  }

  .ts-clock-digital {
    font-size: 11px;
  }

  .ts-title {
    top: 8%;
    left: 5%;
  }

  .ts-title-main {
    font-size: clamp(16px, 5vw, 22px);
    letter-spacing: 4px;
  }

  .ts-indicator {
    bottom: 6%;
    left: 5%;
    right: 5%;
  }

  .ts-indicator-label {
    font-size: 8px;
    letter-spacing: 2px;
  }

  .ts-progress {
    bottom: 2%;
    left: 5%;
    right: 5%;
  }
}
</style>
