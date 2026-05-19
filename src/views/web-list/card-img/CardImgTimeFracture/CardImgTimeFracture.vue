<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 配置 ====================
const imageUrl = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85'

const SLICE_COUNT = 8

// ==================== 时间切片数据 ====================
interface TimeSlice {
  left: number // 起始位置 %
  width: number // 宽度 %
  offsetY: number // 碎裂时的 Y 偏移量
  speed: number // 时间流速系数
  blur: number // 碎裂时的模糊度
  hue: string // 色相旋转 CSS filter 值
  timeLabel: string // 时间标记
}

const timeSlices = reactive<TimeSlice[]>([])

function initSlices() {
  timeSlices.length = 0
  const baseWidth = 100 / SLICE_COUNT

  for (let i = 0; i < SLICE_COUNT; i++) {
    // 距中心的距离决定色温和模糊
    const center = (SLICE_COUNT - 1) / 2
    const distFromCenter = (i - center) / center // -1 到 1

    // Y 偏移：中心小，边缘大，正负交替
    const direction = i % 2 === 0 ? 1 : -1
    const offsetY = direction * (20 + Math.abs(distFromCenter) * 80)

    // 色温：过去的蓝冷调(-30°)，到未来的金暖调(+30°)
    const hueShift = distFromCenter * 35
    const hue = `hue-rotate(${hueShift}deg) saturate(${1 + Math.abs(distFromCenter) * 0.3})`

    // 模糊：越远离中心越模糊
    const blur = Math.abs(distFromCenter) * 4

    // 时间标记
    const labels = ['-3h', '-2h', '-1h', '-30m', '+30m', '+1h', '+2h', '+3h']

    timeSlices.push({
      left: i * baseWidth,
      width: baseWidth,
      offsetY,
      speed: 0.5 + Math.abs(distFromCenter) * 1.5,
      blur,
      hue,
      timeLabel: labels[i] || '',
    })
  }
}

// ==================== Refs ====================
const sectionRef = ref<HTMLElement>()
const stageRef = ref<HTMLElement>()
const timelineRef = ref<HTMLElement>()
const cursorRef = ref<HTMLElement>()
const textRef = ref<HTMLElement>()

const sliceRefs = ref<HTMLElement[]>([])
const particleRefs = ref<HTMLElement[]>([])

const setSliceRef = (el: any, i: number) => {
  if (el) {
    sliceRefs.value[i] = el
  }
}
const setParticleRef = (el: any, i: number) => {
  if (el) {
    particleRefs.value[i - 1] = el
  }
}

const cleanupFns: Array<() => void> = []

// ==================== 动画 ====================
function initAnimations() {
  const section = sectionRef.value
  const stage = stageRef.value
  if (!section || !stage) {
    return
  }

  const slices = sliceRefs.value.filter(Boolean)
  const particles = particleRefs.value.filter(Boolean)

  // 初始化切片状态 — 图片水平偏移使每片显示正确区域
  slices.forEach((slice, i) => {
    const sliceData = timeSlices[i]
    const inner = slice.querySelector('.slice-inner') as HTMLElement
    const img = slice.querySelector('.slice-image') as HTMLElement
    if (inner && img) {
      // 让图片在切片内偏移到正确位置
      gsap.set(img, {
        width: `${100 / (sliceData.width / 100)}%`,
        marginLeft: `-${sliceData.left / (sliceData.width / 100)}%`,
      })
    }
    gsap.set(slice, { y: 0, filter: 'blur(0px) hue-rotate(0deg) saturate(1)' })

    // 时间标记隐藏
    const marker = slice.querySelector('.time-marker') as HTMLElement
    if (marker) {
      gsap.set(marker, { opacity: 0, y: 20 })
    }

    // 边缘隐藏
    const edges = slice.querySelectorAll('.slice-edge')
    gsap.set(edges, { opacity: 0 })
  })

  gsap.set(textRef.value, { opacity: 0, y: 50 })
  gsap.set(timelineRef.value, { opacity: 0 })

  // 粒子初始化
  particles.forEach((p) => {
    gsap.set(p, {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: 2 + Math.random() * 3,
      height: 2 + Math.random() * 3,
      opacity: 0,
    })
  })

  // 主时间线
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 2,
      toggleActions: 'play reverse play reverse',
    },})

  // 阶段1: 时间静止 (0-15%)
  tl.fromTo(
    stage,
    { opacity: 0, scale: 0.95 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.15,
      ease: 'power2.out',
    },
    0,
  )

  // 扫描线动画
  tl.to(stage, { '--scanline-y': '100%', duration: 0.1 }, 0.05)

  // 阶段2: 时间碎裂 (15-45%)
  // 时间轴出现
  tl.to(timelineRef.value, { opacity: 1, duration: 0.1 }, 0.15)

  // 切片分离
  slices.forEach((slice, i) => {
    const data = timeSlices[i]
    const delay = 0.18 + i * 0.015

    // Y 偏移（异速）
    tl.to(slice, { y: data.offsetY, duration: 0.25, ease: 'power2.out' }, delay)

    // 边缘发光显现
    const edges = slice.querySelectorAll('.slice-edge')
    tl.to(edges, { opacity: 0.7, duration: 0.1 }, delay + 0.05)

    // 时间标记显现
    const marker = slice.querySelector('.time-marker') as HTMLElement
    if (marker) {
      tl.to(marker, { opacity: 1, y: 0, duration: 0.08 }, delay + 0.1)
    }
  })

  // 阶段3: 时间流逝 — 最大分离 + 色温 + 模糊 (45-75%)
  slices.forEach((slice, i) => {
    const data = timeSlices[i]

    // 色温和模糊
    tl.to(
      slice,
      { filter: `blur(${data.blur}px) ${data.hue}`, duration: 0.2, ease: 'power1.inOut' },
      0.45,
    )

    // 微漂动
    const driftY = data.offsetY * 0.15 * (i % 2 === 0 ? 1 : -1)
    tl.to(slice, { y: `+=${driftY}`, duration: 0.2, ease: 'sine.inOut' }, 0.5)
  })

  // 粒子出现（模拟时间碎片）
  particles.forEach((p, i) => {
    tl.to(
      p,
      {
        opacity: 0.3 + Math.random() * 0.5,
        y: -30 - Math.random() * 60,
        duration: 0.3,
        ease: 'power1.out',
      },
      0.45 + i * 0.005,
    )
  })

  // 阶段4: 时间回归 (75-100%)
  // 切片归位
  slices.forEach((slice, i) => {
    const delay = 0.75 + i * 0.012

    tl.to(
      slice,
      {
        y: 0,
        filter: 'blur(0px) hue-rotate(0deg) saturate(1)',
        duration: 0.2,
        ease: 'back.out(1.2)',
      },
      delay,
    )

    // 边缘消失
    const edges = slice.querySelectorAll('.slice-edge')
    tl.to(edges, { opacity: 0, duration: 0.1 }, delay + 0.05)

    // 时间标记消失
    const marker = slice.querySelector('.time-marker') as HTMLElement
    if (marker) {
      tl.to(marker, { opacity: 0, y: 20, duration: 0.08 }, delay + 0.02)
    }
  })

  // 粒子消散
  particles.forEach((p, i) => {
    tl.to(p, { opacity: 0, duration: 0.15 }, 0.78 + i * 0.003)
  })

  // 时间轴消失
  tl.to(timelineRef.value, { opacity: 0, duration: 0.1 }, 0.9)

  // 文字入场
  tl.to(
    textRef.value,
    {
      opacity: 1,
      y: 0,
      duration: 0.1,
      ease: 'power2.out',
    },
    0.9,
  )

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
}

// ==================== 生命周期 ====================
onMounted(async () => {
  initSlices()
  await nextTick()
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<template>
  <section ref="sectionRef" class="time-fracture-section">
    <!-- 背景 -->
    <div class="tf-bg">
      <div class="tf-scanlines"></div>
      <div class="tf-grid"></div>
    </div>

    <!-- 时间切片舞台 -->
    <div ref="stageRef" class="tf-stage">
      <!-- 8个时间切片 -->
      <div
        v-for="(slice, i) in timeSlices"
        :key="i"
        :ref="(el) => setSliceRef(el, i)"
        class="time-slice"
        :style="{
          '--slice-left': `${slice.left}%`,
          '--slice-width': `${slice.width}%`,
          '--time-hue': slice.hue,
          zIndex: 10 + i
        }"
      >
        <div class="slice-inner">
          <img :src="imageUrl" alt="" class="slice-image" />
        </div>
        <!-- 切片边缘发光 -->
        <div class="slice-edge slice-edge-left"></div>
        <div class="slice-edge slice-edge-right"></div>
        <!-- 时间标记 -->
        <span class="time-marker">{{ slice.timeLabel }}</span>
      </div>

      <!-- 时间轴指示线 -->
      <div ref="timelineRef" class="tf-timeline">
        <div class="tl-line"></div>
        <div ref="cursorRef" class="tl-cursor">
          <span>NOW</span>
        </div>
      </div>
    </div>

    <!-- 时间粒子 -->
    <div class="tf-particles">
      <div
        v-for="i in 30"
        :key="`p-${i}`"
        :ref="(el) => setParticleRef(el, i)"
        class="time-particle"
      ></div>
    </div>

    <!-- 文字层 -->
    <div ref="textRef" class="tf-text">
      <span class="tf-label">TIME FRACTURE</span>
      <h2 class="tf-title">时间碎裂</h2>
      <p class="tf-desc">每一刻都是一个独立宇宙</p>
    </div>
  </section>
</template>

<style scoped>
.time-fracture-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #030308;
}

/* 背景 */
.tf-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.tf-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.015) 2px,
    rgba(255, 255, 255, 0.015) 4px
  );
  pointer-events: none;
}

.tf-grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(100, 200, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 200, 255, 0.025) 1px, transparent 1px);
  background-size: 80px 80px;
}

/* 舞台 */
.tf-stage {
  position: absolute;
  inset: 5%;
  z-index: 10;
  border-radius: 8px;
  overflow: visible;
}

/* 时间切片 */
.time-slice {
  position: absolute;
  left: var(--slice-left);
  top: 0;
  width: var(--slice-width);
  height: 100%;
  overflow: hidden;
  will-change: transform, filter;
}

.slice-inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slice-image {
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 切片边缘发光 */
.slice-edge {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  pointer-events: none;
  will-change: opacity;
}

.slice-edge-left {
  left: 0;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(100, 180, 255, 0.6),
    rgba(100, 180, 255, 0.8),
    rgba(100, 180, 255, 0.6),
    transparent
  );
  box-shadow: 0 0 8px 2px rgba(100, 180, 255, 0.3);
}

.slice-edge-right {
  right: 0;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(255, 180, 100, 0.6),
    rgba(255, 180, 100, 0.8),
    rgba(255, 180, 100, 0.6),
    transparent
  );
  box-shadow: 0 0 8px 2px rgba(255, 180, 100, 0.3);
}

/* 时间标记 */
.time-marker {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
  color: rgba(180, 220, 255, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid rgba(100, 180, 255, 0.2);
  white-space: nowrap;
  will-change: opacity, transform;
}

/* 时间轴 */
.tf-timeline {
  position: absolute;
  bottom: -30px;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 50;
}

.tl-line {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(80, 140, 255, 0.5),
    rgba(200, 200, 200, 0.8),
    rgba(255, 180, 80, 0.5)
  );
}

.tl-cursor {
  position: absolute;
  left: 50%;
  top: -10px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  color: #000;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  padding: 2px 8px;
  border-radius: 3px;
}

/* 时间粒子 */
.tf-particles {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
}

.time-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(150, 200, 255, 0.6);
  box-shadow: 0 0 6px 2px rgba(150, 200, 255, 0.3);
  will-change: transform, opacity;
}

/* 文字 */
.tf-text {
  position: absolute;
  bottom: 6%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 60;
  will-change: transform, opacity;
}

.tf-label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(150, 200, 255, 0.6);
  margin-bottom: 10px;
}

.tf-title {
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  text-shadow: 0 0 30px rgba(100, 180, 255, 0.3);
}

.tf-desc {
  font-size: clamp(13px, 2vw, 17px);
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .tf-stage {
    inset: 2%;
  }
  .time-marker {
    display: none;
  }
  .tf-timeline {
    display: none;
  }
}
</style>
