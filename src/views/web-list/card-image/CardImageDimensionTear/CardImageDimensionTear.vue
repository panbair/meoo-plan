<template>
  <section ref="parentRef" class="dimension-container">
    <!-- 深空背景 -->
    <div class="dim-bg">
      <div class="dim-grid"></div>
      <div class="dim-nebula dim-n1"></div>
      <div class="dim-nebula dim-n2"></div>
    </div>

    <!-- 维度层 — 5层独立空间 -->
    <div ref="stageRef" class="dimension-stage">
      <div
        v-for="(layer, i) in dimensionLayers"
        :key="i"
        :ref="el => setLayerRef(el, i)"
        class="dim-layer"
        :style="{
          clipPath: layer.clipPath,
          '--hue': `${layer.hue}deg`,
          zIndex: 10 + i,
        }"
      >
        <img :src="imageUrl" :alt="`维度 ${i + 1}`" class="dim-image" />
        <div class="dim-tint"></div>
      </div>

      <!-- 裂缝能量线 -->
      <div
        v-for="(crack, i) in cracks"
        :key="`crack-${i}`"
        :ref="el => setCrackRef(el, i)"
        class="dim-crack"
        :style="{
          '--cx': crack.x,
          '--cy': crack.y,
          '--ca': `${crack.angle}deg`,
          '--cl': crack.length,
        }"
      ></div>
    </div>

    <!-- 引力核心 -->
    <div ref="gravityCoreRef" class="gravity-core">
      <div class="grav-ring grav-r1"></div>
      <div class="grav-ring grav-r2"></div>
      <div class="grav-dot"></div>
    </div>

    <!-- 文字层 -->
    <div ref="textRef" class="dim-text">
      <span class="dim-label">DIMENSION TEAR</span>
      <h2 class="dim-title">维度撕裂</h2>
      <p class="dim-desc">穿越平行空间的视觉旅程</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 配置 ====================
const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85'

// ==================== 维度层定义 ====================
// 5层裁剪区，初始状态拼合成完整图片
interface DimensionLayer {
  // 初始 clip-path（合在一起 = 完整图片）
  clipPath: string
  // 撕裂后的 clip-path
  tornClipPath: string
  // 3D 偏移值（撕裂态）
  tx: number; ty: number; tz: number
  rotX: number; rotY: number; rotZ: number
  // 色相偏移
  hue: number
}

const dimensionLayers = reactive<DimensionLayer[]>([
  {
    clipPath: 'polygon(0% 0%, 52% 0%, 48% 45%, 30% 100%, 0% 100%)',
    tornClipPath: 'polygon(0% 0%, 52% 0%, 48% 45%, 30% 100%, 0% 100%)',
    tx: -120, ty: -40, tz: 80,
    rotX: 8, rotY: -15, rotZ: -3,
    hue: 0,
  },
  {
    clipPath: 'polygon(52% 0%, 100% 0%, 100% 40%, 72% 55%, 48% 45%)',
    tornClipPath: 'polygon(52% 0%, 100% 0%, 100% 40%, 72% 55%, 48% 45%)',
    tx: 100, ty: -60, tz: 60,
    rotX: -6, rotY: 12, rotZ: 2,
    hue: 30,
  },
  {
    clipPath: 'polygon(100% 40%, 100% 100%, 65% 100%, 55% 70%, 72% 55%)',
    tornClipPath: 'polygon(100% 40%, 100% 100%, 65% 100%, 55% 70%, 72% 55%)',
    tx: 80, ty: 70, tz: 100,
    rotX: 10, rotY: 8, rotZ: -5,
    hue: -20,
  },
  {
    clipPath: 'polygon(30% 100%, 48% 45%, 72% 55%, 55% 70%, 65% 100%)',
    tornClipPath: 'polygon(30% 100%, 48% 45%, 72% 55%, 55% 70%, 65% 100%)',
    tx: -20, ty: 50, tz: 120,
    rotX: -12, rotY: -5, rotZ: 4,
    hue: 50,
  },
  {
    // 中心碎片 — 最后归位
    clipPath: 'polygon(48% 45%, 52% 42%, 55% 55%, 50% 58%)',
    tornClipPath: 'polygon(48% 45%, 52% 42%, 55% 55%, 50% 58%)',
    tx: 0, ty: 0, tz: 200,
    rotX: 0, rotY: 0, rotZ: 180,
    hue: 80,
  },
])

// 裂缝位置
interface Crack { x: string; y: string; angle: number; length: string }
const cracks = reactive<Crack[]>([
  { x: '48%', y: '22%', angle: -75, length: '35vh' },
  { x: '72%', y: '48%', angle: 30, length: '28vh' },
  { x: '55%', y: '72%', angle: -120, length: '30vh' },
  { x: '40%', y: '70%', angle: 60, length: '25vh' },
])

// ==================== Refs ====================
const parentRef = ref<HTMLElement>()
const stageRef = ref<HTMLElement>()
const gravityCoreRef = ref<HTMLElement>()
const textRef = ref<HTMLElement>()

const layerRefs = ref<HTMLElement[]>([])
const crackRefs = ref<HTMLElement[]>([])

const setLayerRef = (el: any, i: number) => { if (el) layerRefs.value[i] = el }
const setCrackRef = (el: any, i: number) => { if (el) crackRefs.value[i] = el }

const cleanupFns: Array<() => void> = []

// ==================== 动画 ====================
function initAnimations() {
  const parent = parentRef.value
  const stage = stageRef.value
  if (!parent || !stage) return

  const layers = layerRefs.value.filter(Boolean)
  const crackEls = crackRefs.value.filter(Boolean)

  // 初始状态
  gsap.set(stage, { perspective: 1200, transformStyle: 'preserve-3d' })
  layers.forEach(layer => {
    gsap.set(layer, {
      x: 0, y: 0, z: 0,
      rotateX: 0, rotateY: 0, rotateZ: 0,
      transformStyle: 'preserve-3d',
    })
  })
  crackEls.forEach(crack => gsap.set(crack, { opacity: 0, scaleY: 0 }))
  gsap.set(gravityCoreRef.value, { scale: 0, opacity: 0 })
  gsap.set(textRef.value, { opacity: 0, y: 50 })

  // 主时间线
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 100%',
      end: 'bottom -100%',
      scrub: 2,
      toggleActions: 'play reverse play reverse',
    },
  })

  // 阶段1: 完整展示 + 微光呼吸 (0-20%)
  tl.fromTo(stage, { scale: 0.92, opacity: 0 }, {
    scale: 1, opacity: 1,
    duration: 0.2,
    ease: 'power2.out',
  }, 0)

  // 阶段2: 维度裂开 (20-50%)
  // 裂缝显现
  crackEls.forEach((crack, i) => {
    tl.to(crack, {
      opacity: 1, scaleY: 1,
      duration: 0.08,
      ease: 'power3.out',
    }, 0.2 + i * 0.03)
  })

  // 各层分离
  layers.forEach((layer, i) => {
    const cfg = dimensionLayers[i]
    tl.to(layer, {
      x: cfg.tx, y: cfg.ty, z: cfg.tz,
      rotateX: cfg.rotX, rotateY: cfg.rotY, rotateZ: cfg.rotZ,
      duration: 0.3,
      ease: 'power2.out',
    }, 0.22 + i * 0.02)

    // 色相偏移
    tl.to(layer.querySelector('.dim-tint'), {
      opacity: 0.25,
      duration: 0.2,
    }, 0.28)
  })

  // 阶段3: 独立视差漂移 (50-70%)
  layers.forEach((layer, i) => {
    const drift = (i % 2 === 0 ? 1 : -1) * 15
    tl.to(layer, {
      y: `+=${drift}`,
      rotateY: `+=${drift * 0.3}`,
      duration: 0.2,
      ease: 'sine.inOut',
    }, 0.5)
  })

  // 引力核心出现
  tl.to(gravityCoreRef.value, {
    scale: 1, opacity: 1,
    duration: 0.1,
    ease: 'back.out(1.5)',
  }, 0.6)

  // 阶段4: 引力坍缩归位 (70-100%)
  // 裂缝消失
  crackEls.forEach((crack, i) => {
    tl.to(crack, {
      opacity: 0, scaleY: 0,
      duration: 0.1,
    }, 0.72 + i * 0.02)
  })

  // 各层归位
  layers.forEach((layer, i) => {
    const delay = 0.72 + (layers.length - 1 - i) * 0.03
    tl.to(layer, {
      x: 0, y: 0, z: 0,
      rotateX: 0, rotateY: 0, rotateZ: 0,
      duration: 0.2,
      ease: 'back.out(1.2)',
    }, delay)

    // 色相恢复
    tl.to(layer.querySelector('.dim-tint'), {
      opacity: 0,
      duration: 0.15,
    }, delay + 0.1)
  })

  // 引力核心消失
  tl.to(gravityCoreRef.value, {
    scale: 3, opacity: 0,
    duration: 0.15,
    ease: 'power2.out',
  }, 0.88)

  // 文字入场
  tl.to(textRef.value, {
    opacity: 1, y: 0,
    duration: 0.1,
    ease: 'power2.out',
  }, 0.9)

  cleanupFns.push(() => {
    tl.scrollTrigger?.kill()
    tl.kill()
  })
}

onMounted(async () => {
  await nextTick()
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped>
.dimension-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #050510;
}

/* 背景 */
.dim-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.dim-grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(100, 100, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 100, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.dim-nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.1;
}
.dim-n1 {
  width: 50vw; height: 50vh;
  left: -5%; top: 10%;
  background: radial-gradient(circle, rgba(80, 60, 200, 0.5), transparent 70%);
}
.dim-n2 {
  width: 40vw; height: 40vh;
  right: -5%; bottom: 15%;
  background: radial-gradient(circle, rgba(200, 60, 140, 0.4), transparent 70%);
}

/* 维度舞台 */
.dimension-stage {
  position: absolute;
  inset: 5%;
  z-index: 10;
  will-change: transform;
}

/* 维度层 */
.dim-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  will-change: transform;
  backface-visibility: hidden;
}

.dim-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dim-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    hsla(var(--hue), 80%, 50%, 0.4),
    hsla(calc(var(--hue) + 60), 70%, 40%, 0.3)
  );
  mix-blend-mode: overlay;
  opacity: 0;
  pointer-events: none;
}

/* 裂缝能量线 */
.dim-crack {
  position: absolute;
  left: var(--cx);
  top: var(--cy);
  width: 2px;
  height: var(--cl);
  transform-origin: top center;
  transform: rotate(var(--ca));
  background: linear-gradient(
    180deg,
    rgba(200, 180, 255, 0.9),
    rgba(200, 180, 255, 0.3),
    transparent
  );
  box-shadow:
    0 0 8px 2px rgba(180, 160, 255, 0.5),
    0 0 30px 6px rgba(140, 120, 255, 0.2);
  z-index: 50;
  pointer-events: none;
  will-change: transform, opacity;
}

/* 引力核心 */
.gravity-core {
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  z-index: 60;
  will-change: transform, opacity;
}

.grav-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 20px 8px rgba(200, 180, 255, 0.6);
}

.grav-ring {
  position: absolute;
  border: 1px solid rgba(180, 160, 255, 0.3);
  border-radius: 50%;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  animation: grav-spin 4s linear infinite;
}
.grav-r1 { width: 60px; height: 60px; }
.grav-r2 { width: 100px; height: 100px; animation-direction: reverse; }

@keyframes grav-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 文字 */
.dim-text {
  position: absolute;
  bottom: 6%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 70;
  will-change: transform, opacity;
}

.dim-label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(180, 160, 255, 0.6);
  margin-bottom: 10px;
}

.dim-title {
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  text-shadow: 0 0 30px rgba(140, 120, 255, 0.3);
}

.dim-desc {
  font-size: clamp(13px, 2vw, 17px);
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .dimension-stage { inset: 2%; }
  .dim-grid { background-size: 40px 40px; }
}
</style>



