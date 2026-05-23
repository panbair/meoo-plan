<template>
  <section ref="sectionRef" class="peel-section">
    <!-- 暗色背景 -->
    <div class="stage-bg">
      <div class="bg-texture"></div>
    </div>

    <!-- 主舞台：照片框 -->
    <div class="photo-frame">
      <!-- 底层：被揭示的图片 B -->
      <div ref="bottomLayerRef" class="image-layer image-bottom">
        <img :src="bottomUrl" alt="" crossorigin="anonymous" />
        <!-- 底部图片渐亮光泽 -->
        <div ref="bottomGlowRef" class="bottom-glow"></div>
      </div>

      <!-- 顶层：正在剥离的图片 A（clip-path 对角线裁切） -->
      <div ref="topLayerRef" class="image-layer image-top">
        <img :src="topUrl" alt="" crossorigin="anonymous" />
        <!-- 照片纸纹理 -->
        <div class="photo-texture"></div>
      </div>

      <!-- 剥离阴影线（沿对角线） -->
      <div ref="peelShadowRef" class="peel-shadow-bar"></div>

      <!-- 剥离高光线 -->
      <div ref="peelHighlightRef" class="peel-highlight-bar"></div>

      <!-- 卷角：剥离后的角落 3D 卷曲 -->
      <div ref="cornerCurlRef" class="corner-curl"></div>

      <!-- 浮尘粒子容器 -->
      <div ref="particlesRef" class="lift-particles"></div>

      <!-- 角落提示标签 -->
      <div ref="hintRef" class="peel-hint">
        <svg viewBox="0 0 24 24" class="hint-arrow">
          <path d="M22 2L12 12M22 2v8M22 2h-8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>PEEL</span>
      </div>
    </div>

    <!-- 文字叠加层 -->
    <div ref="contentRef" class="content-overlay">
      <h2 class="title">Peel & Reveal</h2>
      <p class="subtitle">Sticker Lift · Diagonal Uncover · Hidden Beneath</p>
      <div class="divider"></div>
      <p class="desc">贴纸剥离揭示 · 对角撕开 · 层叠影像 · 暗藏惊喜</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

// 使用对比鲜明的两张图：都市建筑 → 自然风光
const topUrl    = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=960&q=80'
const bottomUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=960&q=80'

// ==================== Refs ====================
const sectionRef      = ref<HTMLElement | null>(null)
const topLayerRef     = ref<HTMLElement | null>(null)
const bottomLayerRef  = ref<HTMLElement | null>(null)
const bottomGlowRef   = ref<HTMLElement | null>(null)
const peelShadowRef   = ref<HTMLElement | null>(null)
const peelHighlightRef= ref<HTMLElement | null>(null)
const cornerCurlRef   = ref<HTMLElement | null>(null)
const particlesRef    = ref<HTMLElement | null>(null)
const hintRef         = ref<HTMLElement | null>(null)
const contentRef      = ref<HTMLElement | null>(null)

// ==================== 工具函数：clip-path 多边形 ====================
function diagPolygon(p: number): string {
  // p ∈ [0, 1]: 从右下角向左上角剥离
  // 剥离线：(100%, p*100%) → ((1-p)*100%, 100%)
  // 未剥离区域 = 多边形 5 点
  return `polygon(
    0 0,
    100% 0,
    100% ${(p * 100).toFixed(1)}%,
    ${((1 - p) * 100).toFixed(1)}% 100%,
    0 100%
  )`
}

function diagLineTransform(p: number, el: HTMLElement | null) {
  if (!el) return
  // 对角线从 (100%, p%) → ((1-p)%, 100%)，角度固定 45°
  const midX = 100 - p * 50
  const midY = p * 50
  el.style.top  = `${midY.toFixed(1)}%`
  el.style.left = `${midX.toFixed(1)}%`
}

// ==================== 粒子生成 ====================
function spawnLiftParticles() {
  if (!particlesRef.value) return
  const container = particlesRef.value
  while (container.children.length > 30) {
    container.firstChild?.remove()
  }
  for (let i = 0; i < 2; i++) {
    const p = document.createElement('span')
    p.className = 'lift-particle'
    const angle = Math.random() * Math.PI * 2
    const dist  = 20 + Math.random() * 55
    p.style.setProperty('--px', `${Math.cos(angle) * dist}px`)
    p.style.setProperty('--py', `${Math.sin(angle) * dist - 10}px`)
    p.style.bottom = `${30 + Math.random() * 40}%`
    p.style.right  = `${10 + Math.random() * 45}%`
    container.appendChild(p)
    setTimeout(() => p.remove(), 1100)
  }
}

let lastParticleP = 0

// ==================== 挂载 ====================
onMounted(async () => {
  if (!sectionRef.value) return
  await nextTick()

  // ========== 初始化 ==========
  if (topLayerRef.value) {
    gsap.set(topLayerRef.value, { clipPath: diagPolygon(0) })
  }
  if (peelShadowRef.value) {
    gsap.set(peelShadowRef.value, { opacity: 0 })
  }
  if (peelHighlightRef.value) {
    gsap.set(peelHighlightRef.value, { opacity: 0 })
  }
  if (cornerCurlRef.value) {
    gsap.set(cornerCurlRef.value, { opacity: 0, scale: 0.6 })
  }
  if (bottomGlowRef.value) {
    gsap.set(bottomGlowRef.value, { opacity: 0 })
  }

  // ========== 剥离动画：ScrollTrigger ==========
  const peelProxy = { p: 0 }

  const peelSt = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 72%',
    end: 'bottom 28%',
    scrub: 1.4,
    onUpdate(self) {
      const p = self.progress
      peelProxy.p = p

      // 1. clip-path 对角线剥离
      if (topLayerRef.value) {
        topLayerRef.value.style.clipPath = diagPolygon(p)
      }

      // 2. 剥离阴影线跟随对角线
      diagLineTransform(p, peelShadowRef.value)
      diagLineTransform(p, peelHighlightRef.value)

      // 3. 粒子
      if (Math.abs(p - lastParticleP) > 0.018 && p > 0.03 && p < 0.92) {
        spawnLiftParticles()
        lastParticleP = p
      }

      // 4. 底部图片渐亮
      if (bottomGlowRef.value) {
        bottomGlowRef.value.style.opacity = `${0.4 * p}`
      }

      // 5. 角落提示淡出
      if (hintRef.value) {
        hintRef.value.style.opacity = `${Math.max(0, 1 - p * 4)}`
      }
    },
    onLeaveBack() {
      if (topLayerRef.value) {
        topLayerRef.value.style.clipPath = diagPolygon(0)
      }
      if (bottomGlowRef.value) {
        bottomGlowRef.value.style.opacity = '0'
      }
      if (hintRef.value) {
        hintRef.value.style.opacity = '1'
      }
      lastParticleP = 0
    },
  })
  cleanupFns.push(() => peelSt.kill())

  // ========== 剥离阴影和卷角：时间线 ==========
  const fxTl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 72%',
      end: 'bottom 28%',
      scrub: 1.4,
    },
  })
  // 阴影线 0→1→0（中间最明显）
  fxTl
    .fromTo(peelShadowRef.value,   { opacity: 0 }, { opacity: 0.65, duration: 0.12 }, 0.02)
    .fromTo(peelHighlightRef.value,{ opacity: 0 }, { opacity: 0.35, duration: 0.10 }, 0.03)
    .to(peelShadowRef.value,       { opacity: 0.65, duration: 0.72 }, 0.12)
    .to(peelHighlightRef.value,    { opacity: 0.35, duration: 0.72 }, 0.10)
    .to(peelShadowRef.value,       { opacity: 0,    duration: 0.16 }, 0.84)
    .to(peelHighlightRef.value,    { opacity: 0,    duration: 0.16 }, 0.84)

  // 卷角
  fxTl
    .fromTo(cornerCurlRef.value,
      { opacity: 0, scale: 0.4 },
      { opacity: 0.55, scale: 1, duration: 0.18, ease: 'back.out(1.5)' }, 0.04)
    .to(cornerCurlRef.value,
      { opacity: 0.55, scale: 1, duration: 0.64 }, 0.22)
    .to(cornerCurlRef.value,
      { opacity: 0, scale: 1.3, duration: 0.18, ease: 'power2.in' }, 0.86)

  cleanupFns.push(() => fxTl.kill())

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
.peel-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==================== 暗色背景 ==================== */
.stage-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse at 55% 50%, #26242b 0%, #18171c 55%, #0e0d12 100%);
}

.bg-texture {
  position: absolute;
  inset: 0;
  background:
    repeating-conic-gradient(
      rgba(255,255,255,0.01) 0% 25%,
      transparent 0% 50%
    ) 0 0 / 2px 2px;
  mask-image: radial-gradient(ellipse at 55% 50%, black 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at 55% 50%, black 40%, transparent 80%);
}

/* ==================== 照片框 ==================== */
.photo-frame {
  position: relative;
  z-index: 3;
  width: min(460px, 76vw);
  aspect-ratio: 4 / 3;
  box-shadow:
    0 12px 48px rgba(0,0,0,0.55),
    0 0 0 1px rgba(255,255,255,0.05),
    inset 0 0 0 2px rgba(255,255,255,0.03);
  overflow: hidden;
  border-radius: 4px;
}

/* ==================== 图片层 ==================== */
.image-layer {
  position: absolute;
  inset: 0;
}

.image-layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 底层：被揭示的图片 */
.image-bottom {
  z-index: 1;
}

/* 底部渐亮光泽（剥离越多越亮） */
.bottom-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 70% 40%,
    rgba(255,255,255,0.18) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* 顶层：正在剥离的图片 */
.image-top {
  z-index: 2;
  /* 初始不裁切，由 JS 动态设置 clip-path */
}

/* 照片纸纹理（顶层） */
.photo-texture {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 3px
    );
  pointer-events: none;
}

/* ==================== 剥离阴影线 ==================== */
.peel-shadow-bar {
  position: absolute;
  z-index: 3;
  width: 0;
  height: 0;
  pointer-events: none;
  /* 沿 45° 对角线的大阴影带 */
}

.peel-shadow-bar::before {
  content: '';
  position: absolute;
  left: -24px;
  top: -38px;
  width: 56px;
  height: 90px;
  transform: rotate(-45deg);
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(0,0,0,0.15) 15%,
    rgba(0,0,0,0.35) 40%,
    rgba(0,0,0,0.28) 60%,
    rgba(0,0,0,0.05) 85%,
    transparent 100%
  );
  filter: blur(4px);
}

/* ==================== 剥离高光线 ==================== */
.peel-highlight-bar {
  position: absolute;
  z-index: 4;
  width: 0;
  height: 0;
  pointer-events: none;
}

.peel-highlight-bar::before {
  content: '';
  position: absolute;
  left: -10px;
  top: -14px;
  width: 22px;
  height: 36px;
  transform: rotate(-45deg);
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255,255,255,0.25) 30%,
    rgba(255,255,255,0.08) 60%,
    transparent 100%
  );
  filter: blur(1.5px);
}

/* ==================== 卷角 ==================== */
.corner-curl {
  position: absolute;
  z-index: 5;
  bottom: 0;
  right: 0;
  width: 28%;
  height: 28%;
  pointer-events: none;
  transform-origin: bottom right;
}

.corner-curl::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 100% 100%,
    rgba(0,0,0,0.28) 0%,
    rgba(0,0,0,0.12) 30%,
    transparent 70%
  );
  border-radius: 0 0 4px 0;
}

.corner-curl::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 100% 100%,
    rgba(255,255,255,0.12) 0%,
    transparent 55%
  );
  border-radius: 0 0 4px 0;
  opacity: 0.7;
}

/* ==================== 浮尘粒子 ==================== */
.lift-particles {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  overflow: hidden;
}

:global(.lift-particle) {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(200,195,185,0.85);
  border-radius: 50%;
  animation: dust-rise 1s ease-out forwards;
  pointer-events: none;
}

:global(.lift-particle)::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: rgba(230,225,215,0.35);
  border-radius: 50%;
  filter: blur(2px);
}

@keyframes dust-rise {
  0% {
    opacity: 0.8;
    transform: translate(0, 0) scale(1);
  }
  60% {
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: translate(var(--px), var(--py)) scale(0.15);
  }
}

/* ==================== 角落提示标签 ==================== */
.peel-hint {
  position: absolute;
  z-index: 10;
  bottom: 5%;
  right: 5%;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: bold;
  color: rgba(255,255,255,0.45);
  letter-spacing: 2px;
  pointer-events: none;
  opacity: 1;
}

.hint-arrow {
  width: 16px;
  height: 16px;
  color: rgba(255,255,255,0.4);
  animation: hint-bounce 1.8s ease-in-out infinite;
}

@keyframes hint-bounce {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(3px, -3px); }
}

/* ==================== 文字叠加层 ==================== */
.content-overlay {
  position: absolute;
  z-index: 20;
  bottom: 11%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
}

.title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: bold;
  color: #efece4;
  margin: 0;
  letter-spacing: 3px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.subtitle {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.66rem, 1.15vw, 0.8rem);
  color: rgba(190,185,175,0.65);
  margin: 6px 0 0;
  letter-spacing: 1px;
}

.divider {
  width: 56px;
  height: 2px;
  background: rgba(190,185,175,0.3);
  margin: 14px auto 0;
}

.desc {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(0.72rem, 1.25vw, 0.85rem);
  color: rgba(180,175,165,0.45);
  margin: 10px 0 0;
  letter-spacing: 1.5px;
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .photo-frame {
    width: 84vw;
    aspect-ratio: 4 / 3.3;
  }

  .corner-curl {
    width: 32%;
    height: 32%;
  }
}
</style>
