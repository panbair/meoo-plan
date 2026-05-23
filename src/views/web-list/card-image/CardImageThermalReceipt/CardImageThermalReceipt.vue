<template>
  <section ref="sectionRef" class="thermal-section">
    <!-- 收据纸背景 -->
    <div class="paper-bg">
      <div class="paper-texture"></div>
    </div>

    <!-- 主舞台：收据纸条 -->
    <div class="receipt-stage">
      <!-- 底层：原始图片（最终揭示） -->
      <div class="image-layer image-original">
        <img :src="imageUrl" alt="" crossorigin="anonymous" />
      </div>

      <!-- 上层：热敏已显影区域（clip-path 从上向下扩展） -->
      <div ref="thermalLayerRef" class="image-layer image-thermal">
        <img :src="imageUrl" alt="" crossorigin="anonymous" />
      </div>

      <!-- 扫描线热源发光条 -->
      <div ref="scanLineRef" class="scan-line-glow"></div>

      <!-- 扫描线锯齿边缘 -->
      <div ref="jitterEdgeRef" class="jitter-edge"></div>

      <!-- SVG 滤镜定义 -->
      <svg class="svg-filters" width="0" height="0">
        <defs>
          <filter id="thermal-jitter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.06 0.6"
              numOctaves="4"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <!-- 收据装饰：虚线裁剪线（顶部） -->
      <div class="receipt-cut-line cut-top"></div>
      <!-- 收据装饰：虚线裁剪线（底部） -->
      <div class="receipt-cut-line cut-bottom"></div>

      <!-- 收据底部文本 -->
      <div ref="receiptInfoRef" class="receipt-info">
        <span class="receipt-store">★★ MEOO MART ★★</span>
        <span class="receipt-date">2024-05-24  14:32:07</span>
        <span class="receipt-divider">=========================</span>
        <span class="receipt-item">THERMAL RECEIPT .......... ¥0.00</span>
        <span class="receipt-thanks">THANK YOU — PLEASE COME AGAIN</span>
      </div>
    </div>

    <!-- 文字叠加层 -->
    <div ref="contentRef" class="content-overlay">
      <h2 class="title">Thermal Receipt</h2>
      <p class="subtitle">Direct Thermal Printing · Heat Development</p>
      <div class="divider"></div>
      <p class="desc">热敏收据显影 · 高温扫描线 · 棕黑化学色 · 锯齿打印头</p>
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

const imageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80'

// ==================== Refs ====================
const sectionRef      = ref<HTMLElement | null>(null)
const thermalLayerRef = ref<HTMLElement | null>(null)
const scanLineRef     = ref<HTMLElement | null>(null)
const jitterEdgeRef   = ref<HTMLElement | null>(null)
const receiptInfoRef  = ref<HTMLElement | null>(null)
const contentRef      = ref<HTMLElement | null>(null)

// ==================== 挂载 ====================
onMounted(() => {
  if (!sectionRef.value) return

  // ========== 热敏扫描线：clip-path 从上向下扩展 ==========
  const scanProxy = { pct: 0 }
  if (thermalLayerRef.value) {
    gsap.set(thermalLayerRef.value, { clipPath: 'inset(0 0 100% 0)' })
  }

  const thermalSt = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 75%',
    end: 'bottom 30%',
    scrub: 1.2,
    onUpdate(self) {
      scanProxy.pct = self.progress * 100
      // clip-path: inset(top right bottom left) — 从上方向下扩展
      // bottom=100% 表示全部隐藏, bottom=0% 表示全部显示
      const hiddenPct = 100 - scanProxy.pct
      if (thermalLayerRef.value) {
        thermalLayerRef.value.style.clipPath = `inset(0 0 ${hiddenPct.toFixed(2)}% 0)`
      }
      // 扫描线位置同步
      if (scanLineRef.value) {
        scanLineRef.value.style.top = `${scanProxy.pct.toFixed(2)}%`
      }
      // 锯齿边缘位置同步
      if (jitterEdgeRef.value) {
        jitterEdgeRef.value.style.top = `${scanProxy.pct.toFixed(2)}%`
      }
    },
  })
  cleanupFns.push(() => thermalSt.kill())

  // ========== 扫描线热源发光（初始隐藏） ==========
  if (scanLineRef.value) {
    gsap.set(scanLineRef.value, { top: '0%', opacity: 0 })
  }
  if (jitterEdgeRef.value) {
    gsap.set(jitterEdgeRef.value, { top: '0%', opacity: 0 })
  }

  // 扫描线渐显 → 持续 → 渐隐
  const scanGlowTl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 75%',
      end: 'bottom 30%',
      scrub: 1.2,
    },
  })
  scanGlowTl
    .fromTo(scanLineRef.value, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0)
    .fromTo(jitterEdgeRef.value, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.02)
    .to(scanLineRef.value, { opacity: 1, duration: 0.84 }, 0.08)
    .to(jitterEdgeRef.value, { opacity: 1, duration: 0.84 }, 0.10)
    // 最后 8% 扫描线渐隐（显影完成）
    .to(scanLineRef.value, { opacity: 0, duration: 0.08 }, 0.92)
    .to(jitterEdgeRef.value, { opacity: 0, duration: 0.08 }, 0.92)
  cleanupFns.push(() => scanGlowTl.kill())

  // ========== 最终褪色：热敏 sepia → 真实色彩（微微偏黄） ==========
  if (thermalLayerRef.value) {
    // 显影完成后 sepia 逐渐减弱
    const fadeSt = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 52%',
      end: 'top 18%',
      scrub: 1.0,
      onUpdate(self) {
        const p = self.progress
        // sepia: 0.85 → 0.15, brightness: 0.8 → 0.95, contrast: 1.3 → 1.05
        const sep     = 0.85 - 0.70 * p
        const bri     = 0.80 + 0.15 * p
        const con     = 1.30 - 0.25 * p
        if (thermalLayerRef.value) {
          thermalLayerRef.value.style.filter =
            `sepia(${sep.toFixed(2)}) ` +
            `brightness(${bri.toFixed(2)}) ` +
            `contrast(${con.toFixed(2)})`
        }
      },
    })
    cleanupFns.push(() => fadeSt.kill())
  }

  // ========== 收据底部信息渐显 ==========
  if (receiptInfoRef.value) {
    gsap.set(receiptInfoRef.value, { opacity: 0, y: 12 })
    const infoTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 62%',
        end: 'top 28%',
        scrub: 0.9,
      },
    })
    infoTl.to(receiptInfoRef.value, { opacity: 1, y: 0, duration: 1 })
    cleanupFns.push(() => infoTl.kill())
  }

  // ========== 文字渐显 ==========
  if (contentRef.value) {
    gsap.set(contentRef.value, { opacity: 0, y: 20 })
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 58%',
        end: 'top 22%',
        scrub: 1.0,
      },
    })
    textTl.to(contentRef.value, { opacity: 1, y: 0, duration: 1 })
    cleanupFns.push(() => textTl.kill())
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped>
/* ==================== 容器 ==================== */
.thermal-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==================== 收据纸背景 ==================== */
.paper-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse at 50% 40%, #fafaf7 0%, #f0ede6 40%, #e8e4db 100%);
}

.paper-texture {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.012) 2px,
      rgba(0,0,0,0.012) 3px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,0.008) 3px,
      rgba(0,0,0,0.008) 4px
    );
  mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%);
}

/* ==================== 主舞台（收据纸条） ==================== */
.receipt-stage {
  position: relative;
  z-index: 3;
  width: min(420px, 72vw);
  aspect-ratio: 3 / 4;
  background: #fafaf5;
  box-shadow:
    0 2px 20px rgba(0,0,0,0.10),
    0 0 0 1px rgba(0,0,0,0.06);
  overflow: hidden;
}

/* ==================== 图片层 ==================== */
.image-layer {
  position: absolute;
  inset: 3%;
}

.image-layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 底层：原始图片（opacity 0，最终褪色完成后渐显） */
.image-original {
  z-index: 1;
  opacity: 0;
}

/* 上层：热敏显影层（clip-path 动态扩展 + sepia 滤镜） */
.image-thermal {
  z-index: 2;
  filter: sepia(0.85) brightness(0.8) contrast(1.3);
}

/* ==================== 扫描线热源发光条 ==================== */
.scan-line-glow {
  position: absolute;
  z-index: 3;
  left: 0;
  right: 0;
  height: 22px;
  transform: translateY(-50%);
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255,160,30,0.35) 15%,
    rgba(255,200,60,0.55) 35%,
    rgba(255,140,20,0.50) 50%,
    rgba(255,200,60,0.35) 65%,
    rgba(255,160,30,0.15) 85%,
    transparent 100%
  );
  pointer-events: none;
  mix-blend-mode: overlay;
  filter: blur(1.5px);
}

/* 扫描线热源发光条：中心最亮层 */
.scan-line-glow::after {
  content: '';
  position: absolute;
  inset: 30% 5% 30% 5%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255,220,80,0.55) 20%,
    rgba(255,250,150,0.75) 50%,
    rgba(255,220,80,0.55) 80%,
    transparent 100%
  );
  filter: blur(2px);
}

/* ==================== 锯齿边缘（SVG displacement） ==================== */
.jitter-edge {
  position: absolute;
  z-index: 4;
  left: 0;
  right: 0;
  height: 18px;
  transform: translateY(-50%);
  background:
    linear-gradient(to bottom,
      rgba(80,30,0,0.08) 0%,
      rgba(50,25,5,0.15) 40%,
      rgba(30,15,0,0.08) 60%,
      transparent 100%
    );
  filter: url(#thermal-jitter);
  pointer-events: none;
}

/* ==================== SVG 滤镜 ==================== */
.svg-filters {
  position: absolute;
  width: 0;
  height: 0;
  visibility: hidden;
}

/* ==================== 收据装饰线 ==================== */
.receipt-cut-line {
  position: absolute;
  left: 8%;
  right: 8%;
  height: 1px;
  z-index: 5;
  background-image: repeating-linear-gradient(
    to right,
    rgba(0,0,0,0.18) 0px,
    rgba(0,0,0,0.18) 6px,
    transparent 6px,
    transparent 11px
  );
}

.cut-top {
  top: 6%;
}

.cut-bottom {
  bottom: 6%;
}

/* ==================== 收据底部信息 ==================== */
.receipt-info {
  position: absolute;
  z-index: 6;
  left: 8%;
  right: 8%;
  bottom: 9%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 9px;
  color: rgba(40,35,30,0.7);
  pointer-events: none;
}

.receipt-store {
  font-weight: bold;
  letter-spacing: 1px;
  color: rgba(40,35,30,0.85);
}

.receipt-date {
  letter-spacing: 0.5px;
}

.receipt-divider {
  color: rgba(40,35,30,0.35);
  letter-spacing: -1px;
}

.receipt-item {
  letter-spacing: 0.5px;
}

.receipt-thanks {
  margin-top: 4px;
  font-size: 8px;
  letter-spacing: 0.3px;
  color: rgba(40,35,30,0.5);
}

/* ==================== 文字叠加层 ==================== */
.content-overlay {
  position: absolute;
  z-index: 20;
  top: 12%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
}

.title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: bold;
  color: #3a3228;
  margin: 0;
  letter-spacing: 2px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.08);
}

.subtitle {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.7rem, 1.2vw, 0.85rem);
  color: rgba(80,70,60,0.65);
  margin: 6px 0 0;
  letter-spacing: 0.8px;
}

.divider {
  width: 60px;
  height: 2px;
  background: rgba(100,80,60,0.35);
  margin: 14px auto 0;
}

.desc {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(0.75rem, 1.3vw, 0.9rem);
  color: rgba(80,60,45,0.5);
  margin: 10px 0 0;
  letter-spacing: 1px;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .receipt-stage {
    width: 78vw;
    aspect-ratio: 3 / 4.2;
  }

  .receipt-info {
    font-size: 8px;
    gap: 1px;
  }

  .receipt-thanks {
    font-size: 7px;
  }
}
</style>
