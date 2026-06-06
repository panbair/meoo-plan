<template>
  <section ref="rootRef" class="forge-root">
    <!-- 锻造环境光 -->
    <div ref="ambientGlow" class="forge-ambient"></div>
    <div ref="lightSource" class="forge-light-source"></div>
    <div ref="sparkField" class="forge-spark-field">
      <span v-for="s in sparks" :key="s.id" class="forge-spark" :style="s.style"></span>
    </div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="forge-scroll">
      <div ref="trackRef" class="forge-track" :style="{ height: trackHeight }">
        <div class="forge-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="forge-header">
            <span class="forge-kicker">⚒ CSS3 3D · 金属锻造质感 · 动态光影 ⚒</span>
            <h1 class="forge-title">
              <span ref="tc1" class="forge-title__c">金</span>
              <span ref="tc2" class="forge-title__c forge-title__c--metal">属</span>
              <span ref="tc3" class="forge-title__c">锻</span>
              <span ref="tc4" class="forge-title__c forge-title__c--metal">造</span>
            </h1>
            <div ref="dividerRef" class="forge-divider"></div>
            <p ref="subRef" class="forge-sub">
              向下滚动 · 3D金属环旋转 · filter 动态响应虚拟光源
            </p>
          </header>

          <!-- ════════════════ 3D 金属锻造场景 ════════════════ -->
          <div ref="sceneRef" class="forge-scene">
            <div ref="carouselRef" class="forge-carousel">
              <!-- 6张金属卡片，等距分布在3D环上 -->
              <div
                v-for="(card, i) in metalCards"
                :key="card.id"
                :ref="el => { cardRefs[i] = el as HTMLElement | null }"
                class="forge-card"
                :style="{ transform: card.baseTransform }"
              >
                <!-- 金属表面 -->
                <div class="forge-card__face">
                  <img :src="card.image" :alt="card.label" class="forge-card__img" loading="lazy" />
                  <!-- 金属渐变叠加层 -->
                  <div class="forge-card__metal-overlay"></div>
                  <!-- 镜面高光（动态移动） -->
                  <div class="forge-card__specular" :ref="el => { specularRefs[i] = el as HTMLElement | null }"></div>
                  <!-- 边缘光泽 -->
                  <div class="forge-card__rim-light"></div>
                </div>
                <!-- 环境光遮蔽阴影 -->
                <div class="forge-card__shadow"></div>
                <span class="forge-card__label">{{ card.label }}</span>
              </div>
            </div>

            <!-- 虚拟光源指示器 -->
            <div ref="lightIndicator" class="forge-light-indicator">
              <span class="forge-light-indicator__dot"></span>
              <span class="forge-light-indicator__glow"></span>
            </div>
          </div>

          <!-- 当前光照信息 -->
          <div ref="infoPanel" class="forge-info">
            <span class="forge-info__icon">✦</span>
            <span class="forge-info__text">
              光照角度 {{ Math.round(currentLightAngle) }}° ·
              {{ currentMetalType }} · 亮度 {{ currentBrightness }}
            </span>
          </div>

          <div class="forge-progress"><div ref="progRef" class="forge-progress__fill"></div></div>
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
//  CardImage3DMetalForge — CSS3 3D 金属锻造质感 · 动态光影
//
//  核心创新：突破纯几何变换，结合 CSS filter 模拟真实物理材质
//
//  金属质感技术栈：
//  1. filter: brightness() — 动态响应虚拟光源角度
//  2. filter: drop-shadow() — 模拟金属边缘高光反射
//  3. filter: contrast() + saturate() — 增强金属质感
//  4. 镜面高光层 — CSS gradient 模拟 specular highlight
//  5. 环境光遮蔽 — 多层 box-shadow 模拟 AO
//  6. 金属渐变叠加 — linear-gradient 多层混合
//  7. 边缘光泽 — rim light 模拟菲涅尔效应
//  8. GSAP 动态驱动 — 所有 filter 参数随滚动实时变化
//
//  设计风格：暗黑锻造坊 · 金色/铜色/银色金属 · 暖橙光源
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface MetalCard {
  id: number
  label: string
  image: string
  baseTransform: string
  metalType: 'gold' | 'copper' | 'silver' | 'bronze' | 'rosegold' | 'platinum'
}

const metalCards: MetalCard[] = [
  {
    id: 0, label: '黄金', metalType: 'gold',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    baseTransform: 'rotateY(0deg) translateZ(320px)',
  },
  {
    id: 1, label: '紫铜', metalType: 'copper',
    image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80',
    baseTransform: 'rotateY(60deg) translateZ(320px)',
  },
  {
    id: 2, label: '白银', metalType: 'silver',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
    baseTransform: 'rotateY(120deg) translateZ(320px)',
  },
  {
    id: 3, label: '青铜', metalType: 'bronze',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    baseTransform: 'rotateY(180deg) translateZ(320px)',
  },
  {
    id: 4, label: '玫瑰金', metalType: 'rosegold',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    baseTransform: 'rotateY(240deg) translateZ(320px)',
  },
  {
    id: 5, label: '铂金', metalType: 'platinum',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    baseTransform: 'rotateY(300deg) translateZ(320px)',
  },
]

const CARD_COUNT = metalCards.length
const trackHeight = `${(CARD_COUNT + 1) * 100}vh`

// ── 火花粒子 ──
interface Spark {
  id: number
  style: Record<string, string>
}
function genSparks(count: number): Spark[] {
  const hash = (seed: number) => { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    style: {
      '--sx': `${hash(i * 3 + 1) * 100}%`,
      '--sy': `${20 + hash(i * 3 + 2) * 80}%`,
      '--ssize': `${1 + hash(i * 5 + 7) * 3}px`,
      '--sdur': `${2 + hash(i * 7 + 13) * 4}s`,
      '--sdelay': `${hash(i * 11 + 17) * -5}s`,
      '--sdrift': `${(hash(i * 13 + 19) - 0.5) * 30}px`,
    },
  }))
}
const sparks = ref<Spark[]>(genSparks(30))

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
const carouselRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>(Array(CARD_COUNT).fill(null))
const specularRefs = ref<(HTMLElement | null)[]>(Array(CARD_COUNT).fill(null))
const ambientGlow = ref<HTMLElement | null>(null)
const lightSource = ref<HTMLElement | null>(null)
const sparkField = ref<HTMLElement | null>(null)
const lightIndicator = ref<HTMLElement | null>(null)
const infoPanel = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const currentLightAngle = ref(0)
const currentMetalType = ref('黄金')
const currentBrightness = ref('1.0')
const cleanupFns: TweenCleanup[] = []

// ═══════════════════════ 入场动画 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)

  const tl = gsap.timeline({
    scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' },
  })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: 0.3, filter: 'blur(10px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.08, ease: 'back.out(2)' }, '-=0.35')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.2')
    .fromTo(subRef.value, { autoAlpha: 0, y: 15, filter: 'blur(4px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }, '-=0.1')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, '-=0.3')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 核心：金属3D旋转 + 动态光影 ═══════════════════════
function setupMetalForge() {
  if (!scrollRef.value || !trackRef.value || !carouselRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const carousel = carouselRef.value

  gsap.set(carousel, { rotateY: 0 })

  // 🔑 虚拟光源固定在左前方约 30° 位置
  // 卡片面向光源时 (卡片法线≈光源方向) → 亮度最高、高光最强
  // 卡片背离光源时 → 亮度最低、仅有边缘光
  const LIGHT_SOURCE_ANGLE = 330 // 光源方向 (以场景坐标系)
  const LIGHT_FACING_OFFSET = 180 // 卡片法线 = 卡片旋转角 + 180°(卡片面朝外)

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        const carouselAngle = self.progress * 360
        currentLightAngle.value = carouselAngle

        // 🔑 动态计算每张卡片的 filter 参数
        cardRefs.value.forEach((cardEl, i) => {
          if (!cardEl) return
          const cardAngle = (carouselAngle + i * 60) % 360
          const cardNormal = (cardAngle + 180) % 360 // 卡片法线方向

          // 计算卡片法线与光源方向的角度差
          let angleDiff = Math.abs(cardNormal - LIGHT_SOURCE_ANGLE)
          if (angleDiff > 180) angleDiff = 360 - angleDiff

          // 🔑 光源响应因子 (0-1)：0°差=完全面对光源, 90°+=背离光源
          const lightFactor = Math.max(0, Math.cos(angleDiff * Math.PI / 180))
          // 使用更陡峭的曲线，让高光更集中
          const specularFactor = Math.pow(lightFactor, 3)

          // 🎨 金属 filter 动态计算
          const brightness = (0.35 + lightFactor * 0.95).toFixed(2)        // 0.35-1.3
          const contrast = (0.85 + lightFactor * 0.35).toFixed(2)          // 0.85-1.2
          const saturate = (0.6 + lightFactor * 0.5).toFixed(2)            // 0.6-1.1
          const shadowBlur = (4 + specularFactor * 28).toFixed(0)          // 4-32px
          const shadowAlpha = (0.08 + specularFactor * 0.55).toFixed(2)    // 0.08-0.63
          const shadowColor = lightFactor > 0.6
            ? `rgba(255,200,100,${shadowAlpha})`
            : `rgba(255,180,120,${shadowAlpha})`

          // 🔑 应用 filter：brightness + contrast + saturate + drop-shadow
          cardEl.style.filter = [
            `brightness(${brightness})`,
            `contrast(${contrast})`,
            `saturate(${saturate})`,
            `drop-shadow(0 0 ${shadowBlur}px ${shadowColor})`,
            // 背离光源时添加第二层微弱阴影（环境光遮蔽）
            lightFactor < 0.3 ? `drop-shadow(0 4px 8px rgba(0,0,0,0.4))` : '',
          ].filter(Boolean).join(' ')

          // 🎨 更新金属类型标签
          if (lightFactor > 0.85 && i === Math.round(carouselAngle / 60) % CARD_COUNT) {
            currentMetalType.value = metalCards[i].label
            currentBrightness.value = brightness
          }
        })

        // 🎨 镜面高光动态偏移
        specularRefs.value.forEach((specEl, i) => {
          if (!specEl) return
          const cardAngle = (carouselAngle + i * 60) % 360
          const cardNormal = (cardAngle + 180) % 360
          let angleDiff = Math.abs(cardNormal - LIGHT_SOURCE_ANGLE)
          if (angleDiff > 180) angleDiff = 360 - angleDiff
          const specFactor = Math.pow(Math.max(0, Math.cos(angleDiff * Math.PI / 180)), 4)

          // 高光在卡片表面移动
          const highlightX = 50 + (1 - specFactor) * 40 - (cardNormal - LIGHT_SOURCE_ANGLE) * 0.3
          specEl.style.opacity = `${(specFactor * 0.8).toFixed(2)}`
          specEl.style.background = `
            radial-gradient(ellipse 60% 50% at ${Math.max(5, Math.min(95, highlightX))}% 40%,
              rgba(255,255,255,${(specFactor * 0.7).toFixed(2)}) 0%,
              rgba(255,240,200,${(specFactor * 0.3).toFixed(2)}) 30%,
              transparent 70%
            )
          `
        })
      },
    },
  })

  // 🔑 3D 金属环旋转（完整一圈）
  master.to(carousel, { rotateY: 360, duration: CARD_COUNT, ease: 'none' }, 0)

  // 虚拟光源脉动（模拟锻造火光）
  if (lightSource.value) {
    for (let i = 0; i <= CARD_COUNT; i++) {
      master.to(lightSource.value, { scale: 1.25, opacity: 0.9, duration: 0.12, ease: 'power2.out' }, i + 0.15)
      master.to(lightSource.value, { scale: 1, opacity: 0.7, duration: 0.35, ease: 'power2.in' }, i + 0.27)
      master.to(lightSource.value, { scale: 1.15, opacity: 0.85, duration: 0.1, ease: 'power2.out' }, i + 0.55)
      master.to(lightSource.value, { scale: 1, opacity: 0.7, duration: 0.3, ease: 'power2.in' }, i + 0.65)
    }
  }

  // 环境光漂移
  if (ambientGlow.value) {
    master.to(ambientGlow.value, { x: '6vw', y: '-4vh', duration: CARD_COUNT, ease: 'none' }, 0)
  }

  // 火花场
  if (sparkField.value) {
    master.to(sparkField.value, { opacity: 0.5, duration: 0.5 }, 0)
    master.to(sparkField.value, { opacity: 1, duration: 1 }, 1.5)
    master.to(sparkField.value, { opacity: 0.4, duration: 1.5 }, 3.5)
    master.to(sparkField.value, { opacity: 0.85, duration: 1 }, 5)
  }

  // 信息面板
  if (infoPanel.value) {
    for (let i = 0; i < CARD_COUNT; i++) {
      master.to(infoPanel.value, { scale: 1.15, opacity: 1, duration: 0.12, ease: 'power2.out' }, i + 0.45)
      master.to(infoPanel.value, { scale: 1, opacity: 0.7, duration: 0.3, ease: 'power2.in' }, i + 0.57)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: CARD_COUNT }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupMetalForge() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 锻造坊环境 ═══════════════════════ */
.forge-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(170deg, #1a1410 0%, #1c1512 20%, #181210 45%, #1b1410 65%, #191310 85%, #1a1410 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* ── 环境光 ── */
.forge-ambient {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 50% 40% at 30% 30%, rgba(255,160,80,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 40% 35% at 65% 55%, rgba(255,200,140,0.08) 0%, transparent 55%),
    radial-gradient(ellipse 60% 30% at 50% 80%, rgba(200,120,60,0.06) 0%, transparent 50%);
  will-change: transform;
}

/* ── 虚拟光源（锻造火光） ── */
.forge-light-source {
  position: absolute;
  top: 15vh; left: 18vw;
  width: 18vw; height: 18vw; max-width: 200px; max-height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(255,200,120,0.5) 0%,
    rgba(255,160,70,0.3) 25%,
    rgba(255,120,40,0.12) 50%,
    transparent 70%
  );
  filter: blur(30px);
  z-index: 1; pointer-events: none;
  will-change: transform, opacity;
}

/* ── 火花粒子 ── */
.forge-spark-field { position: absolute; inset: 0; z-index: 3; pointer-events: none; will-change: opacity; opacity: 0.7; }
.forge-spark {
  --sx: 50%; --sy: 50%; --ssize: 2px; --sdur: 3s; --sdelay: 0s; --sdrift: 0px;
  position: absolute; left: var(--sx); top: var(--sy);
  width: var(--ssize); height: var(--ssize); border-radius: 50%;
  background: radial-gradient(circle, rgba(255,220,150,0.9) 0%, rgba(255,150,60,0.6) 40%, transparent 70%);
  box-shadow: 0 0 calc(var(--ssize) * 2) rgba(255,180,100,0.6), 0 0 calc(var(--ssize) * 5) rgba(255,140,60,0.3);
  animation: forge-spark-float var(--sdur) var(--sdelay) infinite ease-out;
}
@keyframes forge-spark-float {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
  20% { transform: translateY(-12vh) translateX(var(--sdrift)) scale(1.4); opacity: 1; }
  50% { transform: translateY(-22vh) translateX(calc(var(--sdrift) * -0.5)) scale(0.6); opacity: 0.3; }
  100% { transform: translateY(-30vh) translateX(calc(var(--sdrift) * 0.3)) scale(0.2); opacity: 0; }
}

/* ── 滚动 ── */
.forge-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,160,80,.25); &:hover { background: rgba(255,160,80,.45); } }
}
.forge-track { position: relative; width: 100%; }
.forge-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.forge-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.forge-kicker { display: inline-block; font-size: .62rem; font-weight: 700; letter-spacing: .28em; color: rgba(220,170,100,.8); background: rgba(255,160,80,.08); backdrop-filter: blur(8px); border: 1px solid rgba(255,160,80,.2); border-radius: 999px; padding: .28rem 1.2rem; margin-bottom: .5rem; }
.forge-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.forge-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.8rem); font-weight: 900; color: #c89060; will-change: transform,opacity,filter;
  &--metal {
    background: linear-gradient(170deg, #ffd580 0%, #e8a850 20%, #ffcc70 35%, #c88030 55%, #ffe0a0 70%, #d49540 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(255,180,80,.5)) drop-shadow(0 0 20px rgba(255,160,60,.3));
  }
}
.forge-divider { width: 110px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #e8a850, #ffd580, #c89060, #ffe0a0, transparent); transform-origin: center; }
.forge-sub { margin: 0; font-size: clamp(.72rem, 1.1vw, .88rem); color: rgba(200,160,110,.45); max-width: 460px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 场景 ═══════════════════════ */
.forge-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1100px;
  perspective-origin: 50% 45%;
  will-change: transform, opacity;
}

/* 🔑 3D 金属环 */
.forge-carousel {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* 🔑 金属卡片 */
.forge-card {
  position: absolute;
  transform-style: preserve-3d;
  will-change: transform, filter;
}
.forge-card__face {
  position: absolute;
  width: min(48vw, 340px); height: min(32vw, 230px);
  margin-left: calc(min(48vw, 340px) / -2);
  margin-top: calc(min(32vw, 230px) / -2);
  border-radius: 12px; overflow: hidden;
  // 🔑 多层次阴影模拟环境光遮蔽(AO)
  box-shadow:
    0 0 0 1px rgba(255,200,140,.15),
    0 8px 32px rgba(0,0,0,.5),
    inset 0 0 0 1px rgba(255,255,255,.08);
  background: #2a2018;
  backface-visibility: hidden;
}
.forge-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }

// 🔑 金属渐变叠加层（模拟金属表面反射）
.forge-card__metal-overlay {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background:
    // 斜向金属拉丝纹理
    linear-gradient(145deg,
      rgba(255,255,255,.12) 0%,
      rgba(255,255,255,.03) 15%,
      rgba(0,0,0,.04) 30%,
      rgba(255,255,255,.06) 45%,
      rgba(0,0,0,.05) 60%,
      rgba(255,255,255,.08) 75%,
      rgba(0,0,0,.03) 90%
    ),
    // 垂直渐变模拟曲面曲率
    linear-gradient(180deg,
      rgba(255,255,255,.08) 0%,
      rgba(255,255,255,.02) 20%,
      rgba(0,0,0,.02) 50%,
      rgba(255,255,255,.04) 70%,
      rgba(0,0,0,.06) 100%
    );
  mix-blend-mode: overlay;
}

// 🔑 镜面高光层（动态位置由 GSAP onUpdate 控制）
.forge-card__specular {
  position: absolute; inset: 0; pointer-events: none; z-index: 3;
  opacity: 0; // GSAP 动态控制
  mix-blend-mode: soft-light;
  transition: none;
}

// 🔑 边缘光泽（菲涅尔效果模拟）
.forge-card__rim-light {
  position: absolute; inset: 0; pointer-events: none; z-index: 1;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(255,220,180,.18);
  background: transparent;
}

.forge-card__shadow {
  position: absolute;
  width: min(48vw, 340px); height: min(32vw, 230px);
  margin-left: calc(min(48vw, 340px) / -2);
  margin-top: calc(min(32vw, 230px) / -2);
  border-radius: 12px;
  transform: translateZ(-1px);
  background: rgba(0,0,0,.4);
  filter: blur(20px);
  z-index: -1;
}

.forge-card__label {
  position: absolute; bottom: -26px; left: 50%; transform: translateX(-50%); z-index: 4;
  font-size: .68rem; font-weight: 700; letter-spacing: .22em; white-space: nowrap;
  color: rgba(220,180,120,.8);
  background: rgba(20,16,12,.7); backdrop-filter: blur(8px);
  border-radius: 999px; padding: .18rem .8rem;
  border: 1px solid rgba(255,180,100,.2);
}

/* ── 光源指示器 ── */
.forge-light-indicator {
  position: absolute; top: 12vh; left: 15vw; z-index: 15; pointer-events: none;
  display: flex; align-items: center; gap: .4rem;
}
.forge-light-indicator__dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,220,140,1) 0%, rgba(255,160,60,.8) 50%, transparent 70%);
  box-shadow: 0 0 16px rgba(255,180,80,.8), 0 0 40px rgba(255,140,40,.4);
  animation: forge-light-pulse 1.5s ease-in-out infinite;
}
@keyframes forge-light-pulse {
  0%,100% { transform: scale(1); opacity: .8; }
  50% { transform: scale(1.5); opacity: 1; }
}
.forge-light-indicator__glow {
  width: 40px; height: 40px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,180,100,.3) 0%, transparent 70%);
  filter: blur(10px);
}

/* ── 信息面板 ── */
.forge-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; pointer-events: none; display: flex; align-items: center; gap: .5rem; opacity: .7; will-change: transform,opacity; }
.forge-info__icon { font-size: .8rem; color: #f0b860; animation: forge-icon-spin 3s linear infinite; }
@keyframes forge-icon-spin { to { transform: rotate(360deg); } }
.forge-info__text { font-size: .7rem; font-weight: 600; letter-spacing: .16em; color: #d4a870; background: rgba(20,16,12,.65); backdrop-filter: blur(10px); border-radius: 999px; padding: .25rem 1rem; border: 1px solid rgba(255,180,100,.18); white-space: nowrap; }

/* ── 进度条 ── */
.forge-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,160,80,.05); }
.forge-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #e8a850, #ffd580, #c89060, #ffe0a0, #e8a850); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,170,70,.5); }

@media (max-width: 768px) {
  .forge-header { top: 2vh; } .forge-kicker { font-size: .5rem; padding: .18rem .6rem; } .forge-title__c { font-size: 1.7rem; }
  .forge-card__face { width: 62vw; height: 42vw; margin-left: -31vw; margin-top: -21vw; }
  .forge-scene { perspective: 800px; }
  .forge-light-source { top: 10vh; left: 12vw; width: 22vw; height: 22vw; }
}
</style>
