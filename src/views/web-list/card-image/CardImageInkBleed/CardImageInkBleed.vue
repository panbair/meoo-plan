<template>
  <section ref="parentRef" class="ink-bleed-container">
    <!-- ==================== SVG 滤镜 & 蒙版定义 ==================== -->
    <svg class="filter-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" aria-hidden="true">
      <defs>
        <!-- 墨迹边缘扩散纹理：模拟宣纸纤维毛细扩散的不规则锯齿 -->
        <filter id="ink-edge-distort" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.032"
            numOctaves="5"
            seed="17"
            result="fiber-noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="fiber-noise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>

        <!-- 墨迹中心浓→边缘淡的径向渐变 -->
        <radialGradient id="ink-spot-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="30%" stop-color="white" stop-opacity="0.98" />
          <stop offset="55%" stop-color="white" stop-opacity="0.85" />
          <stop offset="75%" stop-color="white" stop-opacity="0.45" />
          <stop offset="90%" stop-color="white" stop-opacity="0.1" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </radialGradient>

        <!-- 蒙版：黑色隐藏 → 白色圆形晕染区揭示图片 -->
        <mask id="ink-reveal-mask" maskUnits="objectBoundingBox">
          <rect x="0" y="0" width="1" height="1" fill="black" />
          <g filter="url(#ink-edge-distort)">
            <circle
              v-for="(dot, i) in inkDots"
              :key="i"
              :id="`ink-dot-${i}`"
              :cx="dot.cx / 1000"
              :cy="dot.cy / 1000"
              r="0"
              fill="url(#ink-spot-grad)"
            />
          </g>
        </mask>
      </defs>
    </svg>

    <!-- ==================== 第一层：宣纸底色 ==================== -->
    <div class="rice-paper-layer">
      <div class="paper-texture"></div>
      <div class="paper-fiber"></div>
    </div>

    <!-- ==================== 第二层：图片（SVG蒙版揭示） ==================== -->
    <div ref="imageLayerRef" class="image-reveal-layer">
      <img :src="imageUrl" alt="" class="main-image" />
    </div>

    <!-- ==================== 第三层：墨色叠层（浓度渐消） ==================== -->
    <div ref="inkStainRef" class="ink-stain-overlay"></div>

    <!-- ==================== 第四层：墨点飞溅粒子 ==================== -->
    <div class="splatter-layer">
      <div
        v-for="(sp, i) in splatterDots"
        :key="'sp' + i"
        :ref="(el) => setSplatterRef(el, i)"
        class="splatter-dot"
        :style="{
          left: sp.x + '%',
          top: sp.y + '%',
          width: sp.size + 'px',
          height: sp.size + 'px',
        }"
      ></div>
    </div>

    <!-- ==================== 第五层：画面文字信息 ==================== -->
    <div ref="contentRef" class="content-overlay">
      <div class="ink-seal">墨</div>
      <h2 class="title">水墨晕染</h2>
      <p class="subtitle">Ink Bleed · Rice Paper</p>
      <div class="divider"></div>
      <p class="desc">浓墨滴落 · 纤维扩散 · 层层晕开</p>
    </div>

    <!-- 四角暗框 -->
    <div ref="vignetteRef" class="vignette-frame"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
type TweenCleanup = () => void

// ==================== 墨点位置（5 个着墨点，覆盖画幅） ====================
const inkDots = [
  { cx: 220, cy: 320 },  // 左上
  { cx: 580, cy: 180 },  // 中上
  { cx: 780, cy: 520 },  // 右中
  { cx: 320, cy: 660 },  // 左下
  { cx: 600, cy: 720 },  // 右下
]

// ==================== 飞溅粒子（18 颗，均匀散布于墨点周围） ====================
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
const rand = seededRandom(59527)

const splatterDots = Array.from({ length: 18 }, () => {
  const dotIdx = Math.floor(rand() * inkDots.length)
  const base = inkDots[dotIdx]
  const angle = rand() * Math.PI * 2
  const dist = 30 + rand() * 140
  return {
    x: (base.cx + Math.cos(angle) * dist) / 10,
    y: (base.cy + Math.sin(angle) * dist) / 10,
    size: 3 + rand() * 7,
  }
})

// ==================== 模板引用 ====================
const parentRef = ref<HTMLElement | null>(null)
const imageLayerRef = ref<HTMLElement | null>(null)
const inkStainRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)
const splatterRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

// ==================== 图片 ====================
const imageUrl =
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80'

// ==================== 辅助函数 ====================
const setSplatterRef = (el: unknown, i: number) => {
  if (el) {
    splatterRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}

// ==================== 初始化 ====================
onMounted(() => {
  if (!parentRef.value) return
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) return

  const container = parentRef.value

  // 初始状态
  gsap.set(inkStainRef.value, { opacity: 0.85 })
  gsap.set(contentRef.value, { opacity: 0, y: 30 })
  gsap.set(vignetteRef.value, { opacity: 0.65 })

  // 飞溅粒子初始隐藏
  splatterRefs.filter(Boolean).forEach((dot) => {
    gsap.set(dot, { opacity: 0, scale: 0.3 })
  })

  // ========== 主时间线：ScrollTrigger scrub 驱动 ==========
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1.6,
    },
  })

  // --- 墨晕扩散：5 个圆点半径 0 → 550，错开启动 ---
  inkDots.forEach((_, i) => {
    const circle = document.getElementById(`ink-dot-${i}`)
    if (!circle) return
    // 第 0 个墨点立即开始，随后每隔 0.14 个进度比例错开
    mainTl.to(
      circle,
      {
        attr: { r: 0.55 }, // viewBox 1000 → 归一化 0~1 → r=0.55 = 覆盖 55% 区域
        duration: 0.7,
        ease: 'power2.out',
      },
      i * 0.14,
    )
  })

  // --- 墨色叠层消退：伴随晕染逐步减淡（先慢后快） ---
  mainTl.to(
    inkStainRef.value,
    { opacity: 0, duration: 0.65, ease: 'power3.in' },
    0.05,
  )

  // --- 四角暗框消退 ---
  mainTl.to(
    vignetteRef.value,
    { opacity: 0, duration: 0.6, ease: 'power2.in' },
    0.1,
  )

  // --- 文字渐显 ---
  mainTl.to(
    contentRef.value,
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    0.45,
  )

  // --- 飞溅粒子：依次闪现 ---
  splatterRefs.filter(Boolean).forEach((dot, i) => {
    const startPos = 0.05 + i * 0.025
    mainTl.to(dot, { opacity: 0.75, scale: 1, duration: 0.04 }, startPos)
    mainTl.to(
      dot,
      {
        opacity: 0,
        scale: 1.8,
        x: (rand() - 0.5) * 30,
        y: (rand() - 0.5) * 30,
        duration: 0.25,
        ease: 'power3.out',
      },
      startPos + 0.04,
    )
  })

  cleanupFns.push(() => {
    mainTl.scrollTrigger?.kill()
    mainTl.kill()
  })
}

// ==================== 清理 ====================
onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.ink-bleed-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f2ece0;
}

/* ==================== 隐藏 SVG ==================== */
.filter-svg {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ==================== 第一层：宣纸底色 & 纤维肌理 ==================== */
.rice-paper-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    /* 纸张底色 */
    linear-gradient(135deg, #f3ede4 0%, #efe8db 40%, #f2ece0 70%, #ede4d5 100%);
}

/* 微纸纹理 */
.paper-texture {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  background-image:
    radial-gradient(circle at 18% 25%, rgba(160, 130, 90, 0.12) 0.5px, transparent 0.5px),
    radial-gradient(circle at 72% 38%, rgba(150, 120, 80, 0.08) 0.8px, transparent 0.8px),
    radial-gradient(circle at 45% 65%, rgba(170, 140, 100, 0.1) 0.6px, transparent 0.6px),
    radial-gradient(circle at 85% 80%, rgba(155, 125, 85, 0.07) 0.7px, transparent 0.7px);
  background-size: 32px 32px, 48px 48px, 28px 28px, 36px 36px;
}

/* 纤维长丝纹理 */
.paper-fiber {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background:
    repeating-linear-gradient(
      92deg,
      transparent,
      transparent 80px,
      rgba(160, 130, 90, 0.06) 80px,
      rgba(160, 130, 90, 0.06) 81px
    ),
    repeating-linear-gradient(
      178deg,
      transparent,
      transparent 120px,
      rgba(150, 120, 80, 0.04) 120px,
      rgba(150, 120, 80, 0.04) 121px
    );
}

/* ==================== 第二层：图片揭示层 ==================== */
.image-reveal-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  mask-image: url(#ink-reveal-mask);
  -webkit-mask-image: url(#ink-reveal-mask);
  mask-size: cover;
  -webkit-mask-size: cover;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

/* ==================== 第三层：墨色叠层（初始浓墨覆盖感） ==================== */
.ink-stain-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(
    ellipse 80% 60% at 50% 45%,
    rgba(8, 6, 4, 0.15) 0%,
    rgba(12, 8, 6, 0.35) 30%,
    rgba(18, 12, 8, 0.55) 60%,
    rgba(22, 16, 10, 0.7) 80%,
    rgba(24, 18, 12, 0.8) 100%
  );
  mix-blend-mode: multiply;
  will-change: opacity;
}

/* ==================== 第四层：飞溅粒子 ==================== */
.splatter-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.splatter-dot {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 35%,
    rgba(30, 20, 10, 0.85) 0%,
    rgba(20, 14, 8, 0.5) 50%,
    rgba(15, 10, 6, 0) 100%
  );
  transform: translate(-50%, -50%);
  will-change: transform, opacity;
}

/* ==================== 第五层：文字信息 ==================== */
.content-overlay {
  position: absolute;
  inset: 0;
  z-index: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  will-change: transform, opacity;
}

/* 印章 */
.ink-seal {
  font-size: 3.2rem;
  font-weight: 900;
  font-family: 'STKaiti', 'KaiTi', '楷体', 'Noto Serif SC', serif;
  color: rgba(120, 30, 20, 0.55);
  width: 76px;
  height: 76px;
  line-height: 76px;
  text-align: center;
  border: 2.5px solid rgba(120, 30, 20, 0.5);
  border-radius: 50%;
  margin-bottom: 18px;
  text-shadow: 0 0 8px rgba(120, 30, 20, 0.3);
  letter-spacing: 0;
}

/* 标题 */
.title {
  font-size: 2.8rem;
  font-weight: 700;
  font-family: 'STSong', 'SimSun', '宋体', 'Noto Serif SC', 'Georgia', serif;
  color: rgba(255, 252, 248, 0.95);
  text-shadow:
    0 0 20px rgba(0, 0, 0, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(180, 140, 100, 0.4);
  margin: 0 0 8px 0;
  letter-spacing: 0.15em;
}

/* 副标题 */
.subtitle {
  font-size: 0.95rem;
  font-weight: 400;
  color: rgba(220, 210, 195, 0.85);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin: 0 0 16px 0;
}

/* 分隔线 */
.divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(180, 140, 100, 0.6) 20%,
    rgba(180, 140, 100, 0.9) 50%,
    rgba(180, 140, 100, 0.6) 80%,
    transparent
  );
  margin-bottom: 14px;
}

/* 描述文字 */
.desc {
  font-size: 0.82rem;
  color: rgba(200, 190, 170, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.18em;
  margin: 0;
}

/* ==================== 四角暗框（加重墨色氛围） ==================== */
.vignette-frame {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  background: radial-gradient(
    ellipse 75% 55% at 50% 45%,
    transparent 30%,
    rgba(20, 14, 8, 0.3) 65%,
    rgba(24, 18, 12, 0.55) 85%,
    rgba(24, 18, 12, 0.7) 100%
  );
  will-change: opacity;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  .ink-seal {
    width: 56px;
    height: 56px;
    line-height: 56px;
    font-size: 2.2rem;
    border-width: 2px;
  }
  .subtitle {
    font-size: 0.8rem;
  }
  .desc {
    font-size: 0.7rem;
  }
}
</style>
