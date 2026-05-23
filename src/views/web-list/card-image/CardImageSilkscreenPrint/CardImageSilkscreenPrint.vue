<template>
  <section ref="sectionRef" class="silkscreen-section">
    <!-- 工作室背景 -->
    <div class="workshop-bg"></div>

    <!-- 印刷台 -->
    <div class="print-bed" ref="printBedRef">
      <!-- 纸张纤维纹理 -->
      <svg class="paper-fiber" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <filter id="paperFiber-silk">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" result="noise" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.96   0 0 0 0 0.93   0 0 0 0 0.89   0 0 0 0.07 0"
            in="noise"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperFiber-silk)" opacity="0.45" />
      </svg>

      <!-- 丝网 mesh（始终可见的细密网纹） -->
      <div class="screen-mesh"></div>

      <!-- 已印刷图像层（clip-path 跟随刮刀揭示） -->
      <div ref="imageRevealRef" class="image-reveal">
        <img :src="imageUrl" alt="" class="print-image" />
      </div>

      <!-- 油墨池（刮刀前方，向下推的墨水） -->
      <div ref="inkPoolRef" class="ink-pool">
        <div class="ink-body"></div>
        <div class="ink-sheen"></div>
      </div>

      <!-- 墨点飞溅 -->
      <div
        v-for="i in 8"
        :key="'sp'+i"
        ref="splatterRefs"
        class="ink-splatter"
      />

      <!-- 刮板工具总成 -->
      <div ref="squeegeeRef" class="squeegee-tool">
        <!-- 木手柄 -->
        <div class="squeegee-handle">
          <div class="handle-grain"></div>
        </div>
        <!-- 金属连接夹 -->
        <div class="squeegee-bracket">
          <div class="bracket-rivet" v-for="n in 3" :key="'rivet'+n"></div>
        </div>
        <!-- 橡胶刮刀 -->
        <div class="squeegee-blade">
          <div class="blade-body"></div>
          <div class="blade-edge"></div>
        </div>
      </div>
    </div>

    <!-- 文字覆盖 -->
    <div ref="contentRef" class="content-overlay">
      <span class="tag">SCREEN PRINT</span>
      <h2 class="title">丝网印刷</h2>
      <div class="divider"></div>
      <p class="desc">手工刮板 · 油墨渗透 · 逐色叠印</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const printBedRef = ref<HTMLElement | null>(null)
const imageRevealRef = ref<HTMLElement | null>(null)
const inkPoolRef = ref<HTMLElement | null>(null)
const squeegeeRef = ref<HTMLElement | null>(null)
const splatterRefs = ref<HTMLElement[]>([])
const contentRef = ref<HTMLElement | null>(null)

// ==================== 动画状态 ====================
let printBedHeight = 0
let printBedWidth = 0

// ==================== 辅助函数 ====================

/** 根据滚动进度计算图像滤镜（灰度 → 暖棕 → 全彩） */
function getImageFilter(progress: number): string {
  if (progress < 0.12) {
    // 阶段0：酝酿，纯灰度
    const g = 1 - progress * 1.5
    return `grayscale(${Math.max(g, 0.82)}) contrast(1.3) brightness(0.88)`
  }
  if (progress < 0.35) {
    // 阶段1：灰度消退，暖棕介入
    const u = (progress - 0.12) / 0.23
    const g = 0.82 - u * 0.5
    const s = u * 0.5
    return `grayscale(${g}) sepia(${s}) contrast(${1.3 - u * 0.15}) brightness(${0.88 + u * 0.08})`
  }
  if (progress < 0.65) {
    // 阶段2：sepia 高峰期，色彩逐步回归
    const u = (progress - 0.35) / 0.3
    const g = 0.32 - u * 0.32
    const s = 0.5 + u * 0.35
    return `grayscale(${Math.max(g, 0)}) sepia(${Math.min(s, 0.85)}) contrast(${1.15 - u * 0.1}) brightness(${0.96 + u * 0.04})`
  }
  // 阶段3：全彩渐显
  const u = (progress - 0.65) / 0.35
  const s = 0.85 * (1 - u)
  return `sepia(${s}) contrast(${1.05 - u * 0.03}) brightness(${1.0 + u * 0.05}) saturate(${0.9 + u * 0.3})`
}

/** 油墨池颜色（随进度从深石墨→深棕→饱满墨色） */
function getInkColor(progress: number): string {
  if (progress < 0.12) return 'rgba(30,28,26,'
  if (progress < 0.35) {
    const u = (progress - 0.12) / 0.23
    const r = 30 + u * 50
    const g = 28 + u * 22
    const b = 26 + u * 12
    return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},`
  }
  const u = Math.min((progress - 0.35) / 0.5, 1)
  const r = 80 + u * 40
  const g = 50 + u * 25
  const b = 38 + u * 15
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},`
}

/** 更新刮刀和所有关联元素的位置 */
function updateSqueegee(progress: number) {
  if (!printBedRef.value || !squeegeeRef.value || !imageRevealRef.value || !inkPoolRef.value) return

  const bed = printBedRef.value
  const imageEl = imageRevealRef.value
  const squeegee = squeegeeRef.value
  const inkPool = inkPoolRef.value

  // 刮刀垂直位置：从 bed 顶部 -2% 移动到 bed 底部 +2%
  const bladeY = progress * 104 - 2
  // squeeze 移动区间内 clip-path 揭示比例（映射到 0~1）
  const revealP = Math.max(0, Math.min(1, (progress * 104 - 2) / 100))

  // --- 图像 clip-path：刮刀上方全部揭示 ---
  imageEl.style.clipPath = `inset(0 0 ${((1 - revealP) * 100).toFixed(1)}% 0 0)`

  // --- 图像滤镜 ---
  imageEl.style.filter = getImageFilter(progress)

  // --- 刮刀位置 ---
  squeegee.style.top = `${bladeY}%`
  // 刮刀到达底部后保持、轻微淡出
  squeegee.style.opacity = progress > 0.94 ? String(Math.max(0, 1 - (progress - 0.94) * 18)) : '1'

  // --- 油墨池：紧贴刮刀上方12% ---
  inkPool.style.top = `${bladeY - 12}%`
  inkPool.style.opacity = progress > 0.92 ? String(Math.max(0, 1 - (progress - 0.92) * 15)) : '0.85'
  inkPool.style.setProperty('--ink-color', getInkColor(progress))

  // --- 墨点飞溅：随机散布在刮刀边缘附近 ---
  const splatters = splatterRefs.value.filter(Boolean)
  splatters.forEach((el, i) => {
    const seed = (i * 173 + 42069) % 1000 / 1000
    const spreadX = (seed - 0.5) * 30
    const spreadY = (seed * 0.5 - 0.1) * 10
    el.style.left = `${50 + spreadX}%`
    el.style.top = `${bladeY + spreadY}%`
    el.style.opacity = progress < 0.02 || progress > 0.98 ? '0' : String(0.15 + seed * 0.35)
    el.style.transform = `scale(${0.5 + seed * 0.8})`
  })
}

// ==================== 挂载 ====================
onMounted(() => {
  if (!sectionRef.value || !printBedRef.value) return

  const section = sectionRef.value
  const bed = printBedRef.value

  // 初始状态
  if (imageRevealRef.value) {
    gsap.set(imageRevealRef.value, {
      clipPath: 'inset(0 0 100% 0 0)',
      filter: 'grayscale(1) contrast(1.3) brightness(0.88)',
    })
  }
  if (squeegeeRef.value) {
    gsap.set(squeegeeRef.value, { top: '-2%', opacity: '1' })
  }
  if (inkPoolRef.value) {
    gsap.set(inkPoolRef.value, { top: '-14%', opacity: '0' })
  }

  // ========== 主控 ScrollTrigger ==========
  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top 78%',
    end: 'bottom 10%',
    scrub: 1.0,
    onUpdate(self) {
      updateSqueegee(self.progress)
    },
  })
  cleanupFns.push(() => st.kill())

  // ========== 油墨池初始淡入（页面加载时） ==========
  if (inkPoolRef.value) {
    const poolEnter = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 95%',
        end: 'top 82%',
        scrub: 0.5,
      },
    })
    poolEnter.to(inkPoolRef.value, { opacity: 0.85, duration: 1, ease: 'power2.out' })
    cleanupFns.push(() => { poolEnter.scrollTrigger?.kill(); poolEnter.kill() })
  }

  // ========== 印刷台轻微入场 ==========
  if (bed) {
    gsap.set(bed, { y: 30, opacity: 0 })
    const bedEnter = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 98%',
        end: 'top 70%',
        scrub: 1.0,
      },
    })
    bedEnter.to(bed, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' })
    cleanupFns.push(() => { bedEnter.scrollTrigger?.kill(); bedEnter.kill() })
  }

  // ========== 文字渐显 ==========
  if (contentRef.value) {
    gsap.set(contentRef.value, { opacity: 0, y: 20 })
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 72%',
        end: 'top 28%',
        scrub: 1.0,
      },
    })
    textTl.to(contentRef.value, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
    cleanupFns.push(() => { textTl.scrollTrigger?.kill(); textTl.kill() })
  }

  // ========== 响应式：缓存印刷台尺寸 ==========
  const updateBedSize = () => {
    if (printBedRef.value) {
      printBedHeight = printBedRef.value.offsetHeight
      printBedWidth = printBedRef.value.offsetWidth
    }
  }
  updateBedSize()
  window.addEventListener('resize', updateBedSize)
  cleanupFns.push(() => window.removeEventListener('resize', updateBedSize))
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.silkscreen-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #1a1816;
}

/* ==================== 工作室背景 ==================== */
.workshop-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse 100% 60% at 50% 40%, #2a2520 0%, #1a1816 45%, #0e0d0b 100%);
  // 墙上木纹暗示（极淡）
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 60px,
        rgba(255, 255, 255, 0.008) 60px,
        rgba(255, 255, 255, 0.008) 61px
      );
  }
}

/* ==================== 印刷台 ==================== */
.print-bed {
  position: relative;
  z-index: 2;
  width: min(74vmin, 560px);
  // 保持 3:4 近似比例
  aspect-ratio: 3 / 4;
  background: #f5f0e8;
  border-radius: 2px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 8px 30px rgba(0, 0, 0, 0.25),
    0 1px 0 rgba(255, 255, 255, 0.06) inset;
  overflow: hidden;
  will-change: transform, opacity;
}

/* ==================== 纸张纤维纹理 ==================== */
.paper-fiber {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

/* ==================== 丝网 mesh ==================== */
.screen-mesh {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 1.5px,
      rgba(0, 0, 0, 0.025) 1.5px,
      rgba(0, 0, 0, 0.025) 2px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 1.5px,
      rgba(0, 0, 0, 0.02) 1.5px,
      rgba(0, 0, 0, 0.02) 2px
    );
  opacity: 0.6;
}

/* ==================== 已印刷图像层 ==================== */
.image-reveal {
  position: absolute;
  inset: 0;
  z-index: 4;
  will-change: clip-path, filter;

  .print-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

/* ==================== 油墨池 ==================== */
.ink-pool {
  position: absolute;
  left: 2%;
  width: 96%;
  height: 18%;
  z-index: 7;
  pointer-events: none;
  will-change: top, opacity;

  .ink-body {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      var(--ink-color, rgba(70, 48, 35, 0.0)) 15%,
      var(--ink-color, rgba(70, 48, 35, 0.55)) 55%,
      var(--ink-color, rgba(70, 48, 35, 0.85)) 85%,
      var(--ink-color, rgba(70, 48, 35, 0.95)) 100%
    );
    border-radius: 0 0 8px 8px;
    // 油墨池底部与刮刀接触处的不规则边缘
    filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='ink-edge'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.06 0.15' numOctaves='4' result='n'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='n' scale='3' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3C/svg%3E#ink-edge");
  }

  .ink-sheen {
    position: absolute;
    top: 15%;
    left: 8%;
    width: 25%;
    height: 30%;
    background: radial-gradient(
      ellipse at 40% 50%,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    border-radius: 50%;
  }
}

/* ==================== 墨点飞溅 ==================== */
.ink-splatter {
  position: absolute;
  z-index: 8;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--ink-color, rgba(70, 48, 35, 0.9)) 0%,
    transparent 70%
  );
  pointer-events: none;
  will-change: left, top, opacity, transform;
}

/* ==================== 刮板工具总成 ==================== */
.squeegee-tool {
  position: absolute;
  left: -1%;
  width: 102%;
  z-index: 10;
  will-change: top, opacity;
  pointer-events: none;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.35));
}

/* --- 木手柄 --- */
.squeegee-handle {
  position: relative;
  height: clamp(14px, 2.8vmin, 22px);
  margin: 0 auto;
  width: 88%;
  background: linear-gradient(
    180deg,
    #b8946a 0%,
    #9b7a56 20%,
    #8a6d4a 40%,
    #a6845e 55%,
    #7a5e3e 75%,
    #8a6d4a 100%
  );
  border-radius: 8px 8px 3px 3px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15);

  .handle-grain {
    position: absolute;
    inset: 20% 8%;
    background:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 1px,
        rgba(0, 0, 0, 0.04) 1px,
        rgba(0, 0, 0, 0.04) 2px
      );
    border-radius: 2px;
  }
}

/* --- 金属连接夹 --- */
.squeegee-bracket {
  position: relative;
  height: clamp(8px, 1.4vmin, 12px);
  margin: 0 auto;
  width: 82%;
  background: linear-gradient(
    180deg,
    #909090 0%,
    #787878 30%,
    #989898 50%,
    #686868 70%,
    #808080 100%
  );
  border-radius: 0 0 4px 4px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);

  .bracket-rivet {
    position: absolute;
    top: 50%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: radial-gradient(circle, #aaa 0%, #666 100%);
    transform: translateY(-50%);

    &:nth-child(1) { left: 12%; }
    &:nth-child(2) { left: 50%; }
    &:nth-child(3) { left: 84%; }
  }
}

/* --- 橡胶刮刀 --- */
.squeegee-blade {
  position: relative;
  margin: 0 auto;
  width: 86%;
}

.blade-body {
  height: clamp(10px, 1.6vmin, 16px);
  background: linear-gradient(
    180deg,
    #404040 0%,
    #303030 30%,
    #383838 60%,
    #282828 100%
  );
  // 刮刀持角度：稍微向前倾斜
  transform: skewX(-1.5deg);
  transform-origin: center bottom;
  border-radius: 1px 1px 0 0;
}

.blade-edge {
  height: clamp(3px, 0.6vmin, 5px);
  background: linear-gradient(
    180deg,
    #1a1a1a 0%,
    #222222 50%,
    #111111 100%
  );
  border-radius: 0 0 2px 2px;
  // 刮刀底部与印刷面接触的边缘
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.5),
    0 0 1px rgba(0, 0, 0, 0.3) inset;
}

/* ==================== 文字覆盖 ==================== */
.content-overlay {
  position: absolute;
  z-index: 20;
  bottom: 10%;
  right: 8%;
  text-align: right;
  pointer-events: none;
  will-change: opacity, transform;

  .tag {
    display: block;
    font-family: 'Georgia', 'SimSun', serif;
    font-size: clamp(10px, 1.2vmin, 13px);
    color: rgba(200, 190, 170, 0.5);
    letter-spacing: 0.4em;
    margin-bottom: 10px;
  }

  .title {
    margin: 0;
    font-family: 'Georgia', 'SimSun', 'Noto Serif SC', serif;
    font-size: clamp(28px, 4.5vmin, 50px);
    color: #e8e2d6;
    letter-spacing: 0.06em;
    font-weight: 700;
    line-height: 1.15;
    text-shadow: 0 0 30px rgba(180, 160, 130, 0.2);
  }

  .divider {
    width: 50px;
    height: 1px;
    margin: 14px 0 14px auto;
    background: linear-gradient(270deg, rgba(180, 160, 140, 0.4), transparent);
  }

  .desc {
    margin: 0;
    font-size: clamp(12px, 1.4vmin, 15px);
    color: #8a8078;
    letter-spacing: 0.08em;
  }
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .print-bed {
    width: 82vmin;
  }
  .content-overlay {
    bottom: 8%;
    right: 5%;
  }
}

@media (max-width: 480px) {
  .print-bed {
    width: 90vmin;
    aspect-ratio: 3 / 4.5;
  }
  .content-overlay {
    bottom: 5%;
    right: 4%;
  }
}
</style>
