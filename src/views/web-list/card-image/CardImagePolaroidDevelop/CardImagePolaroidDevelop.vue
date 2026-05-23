<template>
  <section ref="sectionRef" class="polaroid-section">
    <!-- 背景粒子 -->
    <div class="bg-dust" ref="dustRef">
      <div v-for="n in 24" :key="n" class="dust-particle" :style="dustStyle(n)" />
    </div>

    <!-- 拍立得卡片 -->
    <div ref="cardRef" class="polaroid-card">
      <!-- 照片区域 -->
      <div class="photo-slot">
        <!-- 全彩原图 -->
        <img ref="imageRef" :src="imageUrl" alt="" class="photo-image" />
        <!-- 白色未显影覆盖层 -->
        <div ref="whiteCoverRef" class="white-cover" />
        <!-- 化学显影液渍（边缘随机斑点） -->
        <div ref="spotsRef" class="chem-spots" v-for="i in 6" :key="'s'+i" :style="spotStyle(i)" />
      </div>
      <!-- 拍立得底部文字区（更宽） -->
      <div class="caption-area">
        <span ref="titleRef" class="caption-title">拍立得显影</span>
        <span ref="subRef" class="caption-sub">Polaroid Develop · Chemical Reveal</span>
      </div>
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
const cardRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const whiteCoverRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)

// ==================== 背景粒子样式 ====================
function dustStyle(n: number) {
  const seed = (n * 14029) % 1000 / 1000
  return {
    left: `${30 + seed * 40}%`,
    top: `${20 + ((n * 37) % 1000) / 1000 * 60}%`,
    width: `${2 + seed * 6}px`,
    height: `${2 + seed * 6}px`,
    animationDelay: `${seed * 8}s`,
    animationDuration: `${6 + seed * 10}s`,
    opacity: `${0.3 + seed * 0.5}`,
  }
}

// ==================== 化学渍斑样式 ====================
function spotStyle(n: number) {
  const rng = () => ((n * 1723 + 42069 * n) % 10000) / 10000
  const cx = 30 + rng() * 40
  const cy = 25 + rng() * 50
  const size = 60 + (rng() * 100)
  return {
    left: `${cx}%`,
    top: `${cy}%`,
    width: `${size}px`,
    height: `${size * (0.6 + rng() * 0.8)}px`,
    transform: `rotate(${rng() * 360}deg)`,
  }
}

// ==================== 挂载 ====================
onMounted(() => {
  if (!sectionRef.value || !cardRef.value || !imageRef.value || !whiteCoverRef.value) return

  const section = sectionRef.value
  const card = cardRef.value
  const image = imageRef.value
  const whiteCover = whiteCoverRef.value

  // 初始状态：白色覆盖全图、图片 sepia 滤镜
  gsap.set(whiteCover, { clipPath: 'circle(0% at 50% 48%)' })
  gsap.set(image, { filter: 'sepia(0.95) brightness(0.85) contrast(1.1)' })

  // ========== 主控 ScrollTrigger ==========
  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top 82%',
    end: 'bottom 12%',
    scrub: 1.2,
    onUpdate(self) {
      const p = self.progress
      // 覆盖层：分阶段扩展
      // 0-8%：化学酝酿期（几乎不动）
      // 8-55%：显影爆发期
      // 55-100%：完全显影 + 清晰化
      let r: number
      if (p < 0.08) {
        r = p * 2.5 // 0→0.2%，微小
      } else if (p < 0.55) {
        const u = (p - 0.08) / 0.47
        r = 0.2 + u * u * 45 // 加速扩展
      } else {
        const u = (p - 0.55) / 0.45
        r = 45 + u * 55 // 线性扩展到 100%
      }
      gsap.set(whiteCover, {
        clipPath: `circle(${Math.min(r, 70)}% at 50% 48%)`,
      })

      // Sepia → 全彩过渡：35-80% 之间完成
      let sepiaVal = 0.95
      if (p < 0.35) {
        sepiaVal = 0.95
      } else if (p < 0.8) {
        const u = (p - 0.35) / 0.45
        sepiaVal = 0.95 * (1 - u * u) // 逐渐褪去 sepia
      } else {
        sepiaVal = 0
      }
      gsap.set(image, {
        filter: `sepia(${sepiaVal}) brightness(${0.85 + (0.95 - sepiaVal) * 0.2}) contrast(${1.1 - (0.95 - sepiaVal) * 0.1})`,
      })
    },
  })
  cleanupFns.push(() => st.kill())

  // ========== 卡片入场 ==========
  gsap.set(card, { opacity: 0, y: 60, scale: 0.92, rotation: 4 })
  const cardTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 90%',
      end: 'top 55%',
      scrub: 1.0,
    },
  })
  cardTl.to(card, { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1, ease: 'power3.out' })
  cleanupFns.push(() => { cardTl.scrollTrigger?.kill(); cardTl.kill() })

  // ========== 文字渐显 ==========
  if (titleRef.value) gsap.set(titleRef.value, { opacity: 0, y: 10 })
  if (subRef.value) gsap.set(subRef.value, { opacity: 0, y: 8 })

  const textTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 72%',
      end: 'top 35%',
      scrub: 1.0,
    },
  })
  if (titleRef.value) textTl.to(titleRef.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
  if (subRef.value) textTl.to(subRef.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.2)
  cleanupFns.push(() => { textTl.scrollTrigger?.kill(); textTl.kill() })
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.polaroid-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(ellipse 80% 70% at 50% 45%, #1a1820 0%, #0c0a10 50%, #06040a 100%);
}

/* ==================== 背景尘埃粒子 ==================== */
.bg-dust {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.dust-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 190, 180, 0.7) 0%, transparent 70%);
  animation: dust-float ease-in-out infinite alternate;
}

@keyframes dust-float {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-20px) scale(1.3); opacity: 0.15; }
}

/* ==================== 拍立得卡片 ==================== */
.polaroid-card {
  position: relative;
  z-index: 2;
  width: min(76vmin, 580px);
  background: #f8f5f0;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.25),
    0 12px 40px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  will-change: transform, opacity;
}

/* ==================== 照片区域 ==================== */
.photo-slot {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  padding: 4.5% 4.5% 0;
  box-sizing: border-box;
  overflow: hidden;

  // 模拟相纸边缘的印刷印记
  &::after {
    content: '';
    position: absolute;
    inset: 2.5%;
    border: 1px solid rgba(0, 0, 0, 0.06);
    pointer-events: none;
    z-index: 5;
  }
}

.photo-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: filter;
}

/* ==================== 白色未显影覆盖层 ==================== */
.white-cover {
  position: absolute;
  inset: 4.5% 4.5% 0;
  background: #f6f2ec;
  will-change: clip-path;
  z-index: 3;

  // 模拟相纸纹理
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.012) 2px,
        rgba(0, 0, 0, 0.012) 3px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 3px,
        rgba(0, 0, 0, 0.008) 3px,
        rgba(0, 0, 0, 0.008) 4px
      );
    opacity: 0.6;
  }
}

/* ==================== 化学显影液渍 ==================== */
.chem-spots {
  position: absolute;
  z-index: 4;
  border-radius: 40% 60% 55% 45%;
  background: radial-gradient(
    ellipse at 40% 35%,
    rgba(180, 150, 110, 0.18) 0%,
    rgba(140, 110, 70, 0.08) 40%,
    transparent 70%
  );
  filter: blur(4px);
  pointer-events: none;
  opacity: 0.5;
  will-change: opacity;
}

/* ==================== 底部文字区 ==================== */
.caption-area {
  padding: 5.5% 5% 7%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;

  // 顶部轻微分隔线
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 0, 0, 0.08) 30%,
      rgba(0, 0, 0, 0.08) 70%,
      transparent 100%
    );
  }
}

.caption-title {
  font-family: 'Georgia', 'SimSun', 'Noto Serif SC', serif;
  font-size: clamp(18px, 2.6vmin, 24px);
  color: #2a2520;
  letter-spacing: 0.04em;
  font-weight: 600;
}

.caption-sub {
  font-family: 'Georgia', 'SimSun', 'Noto Serif SC', serif;
  font-size: clamp(11px, 1.4vmin, 14px);
  color: #8a8078;
  letter-spacing: 0.08em;
  font-style: italic;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .polaroid-card {
    width: 85vmin;
  }
}

@media (max-width: 480px) {
  .polaroid-card {
    width: 92vmin;
  }
  .caption-area {
    padding: 6% 4% 8%;
  }
}
</style>
