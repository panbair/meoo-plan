<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ═══════════════════════════════════════════
//  Grid Dissolve Pro — 网格碎片溶解飘散（增强版）
//
//  核心概念:
//  1. 自动切割图片为高清网格碎片 (10×8 = 80片)
//  2. 碎片初始状态：高模糊(20-30px) + 全透明 + 随机偏移(±80px) + 随机旋转(±30°) + 缩放(0.6-0.9)
//  3. 滚动触发：溶解效果（模糊度降低 + 透明度提升 + 归位）
//  4. 飘散归位：随机位移和旋转逐步归零，带弹性回弹
//  5. stagger 时序：从中心向外爆发扩散，模拟能量释放
//  6. power3.out 缓动：先快后慢的震撼质感
//  7. 全屏设计：100vw × 100vh 沉浸式体验
//  8. 明亮色彩：渐变紫蓝配色，科技感十足
// ═══════════════════════════════════════════

const imageA = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' // 山景
const imageB = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80' // 谷景

// ==== 网格配置 ====
const COLS = 10
const ROWS = 8
const TOTAL = COLS * ROWS

interface GridFragment {
  id: number
  col: number
  row: number
  offsetX: number // 随机飘散偏移 X (±80px)
  offsetY: number // 随机飘散偏移 Y (±80px)
  rotation: number // 随机旋转角度 (±30°)
  blur: number // 初始模糊度 (20-30px)
  scale: number // 初始缩放 (0.6-0.9)
}

// 生成网格碎片数据（增强随机性）
const fragments: GridFragment[] = []
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    fragments.push({
      id: r * COLS + c,
      col: c,
      row: r,
      offsetX: (Math.random() - 0.5) * 160, // ±80px 增强飘散幅度
      offsetY: (Math.random() - 0.5) * 160,
      rotation: (Math.random() - 0.5) * 60, // ±30° 增强旋转
      blur: 20 + Math.random() * 10, // 20-30px 增强模糊
      scale: 0.6 + Math.random() * 0.3 // 0.6-0.9 增强缩放差异
    })
  }
}

// ==== Refs ====
const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const fragmentRefs = ref<HTMLElement[]>([])
const statusRef = ref<HTMLElement | null>(null)
const statusFillRef = ref<HTMLElement | null>(null)
const statusCountRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const heroTagRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroLineRef = ref<HTMLElement | null>(null)
const heroSubRef = ref<HTMLElement | null>(null)

// 清理列表
const cleanupFns: CleanupFn[] = []

// ==== 生命周期 ====
onMounted(async () => {
  if (!sectionRef.value || !stageRef.value) {
    return
  }
  await nextTick()
  await nextTick()

  // 缓存碎片 DOM
  fragmentRefs.value = Array.from(stageRef.value.querySelectorAll('.gd-fragment'))

  // ==== GSAP Context ====
  const ctx = gsap.context(() => {
    // 入场动画
    if (heroRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top 70%',
          end: 'top 25%',
          scrub: 0.8
        }
      })
      tl.fromTo(heroRef.value, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 0)
      tl.fromTo(heroTagRef.value, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.5 }, 0.05)
      tl.fromTo(
        heroTitleRef.value,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
        0.08
      )
      tl.fromTo(
        heroLineRef.value,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6 },
        0.12
      )
      tl.fromTo(heroSubRef.value, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.15)
      cleanupFns.push(() => tl.kill())
    }

    // 碎片溶解飘散动画（增强版）
    const fragmentTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top 75%', // 重要内容提前展示
        end: 'bottom 15%',
        scrub: 1.8, // 更流畅的响应
        toggleActions: 'play none none reverse'
      }
    })

    // 使用 fromTo 实现震撼的溶解飘散效果
    fragmentTl.fromTo(
      fragmentRefs.value,
      {
        opacity: 0,
        filter: (i: number) => `blur(${fragments[i].blur}px)`,
        x: (i: number) => fragments[i].offsetX,
        y: (i: number) => fragments[i].offsetY,
        rotation: (i: number) => fragments[i].rotation,
        scale: (i: number) => fragments[i].scale
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 1.2,
        stagger: {
          amount: 1.2, // 增加总错开时间，更有层次感
          grid: [COLS, ROWS],
          from: 'center', // 从中心向外爆发
          ease: 'power2.inOut'
        },
        ease: 'power3.out' // 更强烈的先快后慢质感
      }
    )

    // 状态栏动画
    const statusSt = ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: 'top 75%',
      end: 'bottom 15%',
      scrub: true,
      onUpdate(self) {
        const progress = self.progress
        const assembledCount = Math.round(progress * TOTAL)
        if (statusFillRef.value) {
          statusFillRef.value.style.width = `${progress * 100}%`
        }
        if (statusCountRef.value) {
          statusCountRef.value.textContent = String(assembledCount)
        }
        if (statusRef.value) {
          statusRef.value.style.opacity = progress > 0.05 ? '1' : '0'
        }
      }
    })

    cleanupFns.push(() => {
      fragmentTl.kill()
      statusSt.kill()
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
  if (sectionRef.value) {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.value) {
        st.kill()
      }
    })
  }
})
</script>

<template>
  <div ref="sectionRef" class="gd-section">
    <div class="gd-bg"></div>

    <div ref="stageRef" class="gd-stage">
      <!-- 网格碎片 -->
      <div
        v-for="frag in fragments"
        :key="frag.id"
        ref="fragmentRefs"
        class="gd-fragment"
        :style="{
          left: `${(frag.col * 100) / COLS}%`,
          top: `${(frag.row * 100) / ROWS}%`,
          width: `${100 / COLS}%`,
          height: `${100 / ROWS}%`
        }"
      >
        <div
          class="gd-fragment-face gd-front"
          :style="{
            backgroundImage: `url(${imageA})`,
            backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
            backgroundPosition: `${(frag.col / (COLS - 1)) * 100}% ${(frag.row / (ROWS - 1)) * 100}%`
          }"
        ></div>
        <div
          class="gd-fragment-face gd-back"
          :style="{
            backgroundImage: `url(${imageB})`,
            backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
            backgroundPosition: `${(frag.col / (COLS - 1)) * 100}% ${(frag.row / (ROWS - 1)) * 100}%`
          }"
        ></div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div ref="statusRef" class="gd-status">
      <div class="gd-status-track">
        <div ref="statusFillRef" class="gd-status-fill"></div>
      </div>
      <div class="gd-status-info">
        <span ref="statusCountRef" class="gd-status-count">0</span>
        <span class="gd-status-label">/ {{ TOTAL }} FRAGMENTS</span>
      </div>
    </div>

    <!-- 标题覆盖 -->
    <div ref="heroRef" class="gd-hero">
      <div ref="heroTagRef" class="gd-hero-tag">GRID DISSOLVE PRO</div>
      <h2 ref="heroTitleRef" class="gd-hero-title">网格溶解</h2>
      <div ref="heroLineRef" class="gd-hero-line"></div>
      <p ref="heroSubRef" class="gd-hero-sub">Dissolve · Scatter · Assemble · Energy Burst</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
// ═══════════════════════════════════════════
//  Grid Dissolve Pro 样式
// ═══════════════════════════════════════════

.gd-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', 'PingFang SC', system-ui, sans-serif;
}

.gd-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(255, 255, 255, 0.15), transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(255, 255, 255, 0.1), transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(102, 126, 234, 0.2), transparent 70%);
}

// ==== 舞台 - 全屏 ====
.gd-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  z-index: 2;
  overflow: hidden;
}

// ==== 网格碎片 ====
.gd-fragment {
  position: absolute;
  overflow: hidden;
  will-change: transform, opacity, filter;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.gd-fragment-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: block;
  background-repeat: no-repeat;
}

.gd-front {
  transform: rotateY(0deg) translateZ(1px);
}

.gd-back {
  transform: rotateY(180deg) translateZ(1px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

// Hover 翻转显示背面
.gd-fragment:hover .gd-back {
  opacity: 1;
}

// ==== 底部状态栏 ====
.gd-status {
  position: absolute;
  bottom: clamp(20px, 5vh, 50px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
}
.gd-status-track {
  width: clamp(160px, 30vw, 320px);
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}
.gd-status-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 200, 100, 0.9),
    rgba(255, 100, 200, 0.85)
  );
  border-radius: 2px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
  transition: width 0.1s linear;
}
.gd-status-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.gd-status-count {
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  font-variant-numeric: tabular-nums;
  min-width: 2.5ch;
  text-align: right;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}
.gd-status-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
}

// ==== 标题 ====
.gd-hero {
  position: absolute;
  top: clamp(20px, 5vh, 60px);
  left: clamp(20px, 6vw, 80px);
  z-index: 15;
  text-align: left;
  opacity: 0;
}
.gd-hero-tag {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}
.gd-hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  text-shadow:
    0 0 40px rgba(255, 255, 255, 0.6),
    0 0 80px rgba(255, 200, 100, 0.4);
  letter-spacing: 0.05em;
}
.gd-hero-line {
  width: clamp(50px, 12vw, 90px);
  height: 3px;
  margin: 12px 0 15px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 200, 100, 0.8),
    transparent
  );
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
.gd-hero-sub {
  font-size: clamp(0.65rem, 1.5vw, 0.9rem);
  font-weight: 500;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .gd-hero-title {
    font-size: 2rem;
  }
  .gd-status-count {
    font-size: 1.1rem;
  }
}
</style>
