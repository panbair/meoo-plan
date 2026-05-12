<template>
  <div ref="parentRef" class="card-img-thermal">
    <!-- 背景层 - 使用 sticky 代替 fixed -->
    <div class="thermal-bg-container">
      <!-- 冷色底层 - 最慢 -->
      <div ref="coldLayerRef" class="thermal-layer thermal-cold">
        <img
          class="thermal-image"
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80"
          alt="Cold"
          loading="eager"
        />
        <div class="thermal-cold-overlay"></div>
      </div>

      <!-- 中温过渡层 -->
      <div ref="midLayerRef" class="thermal-layer thermal-mid">
        <img
          class="thermal-image"
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80"
          alt="Mid"
          loading="eager"
        />
        <div class="thermal-mid-overlay"></div>
      </div>

      <!-- 暖色表层 - 最快 -->
      <div ref="hotLayerRef" class="thermal-layer thermal-hot">
        <img
          class="thermal-image"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Hot"
          loading="eager"
        />
        <div class="thermal-hot-overlay"></div>
      </div>

      <!-- 噪点层 -->
      <div ref="noiseLayerRef" class="thermal-noise"></div>

      <!-- 等温线层 -->
      <svg ref="contourRef" class="thermal-contour" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="contour-filter">
            <feTurbulence
              ref="turbulenceRef"
              type="fractalNoise"
              baseFrequency="0.01 0.02"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <rect class="contour-rect" width="100" height="100" filter="url(#contour-filter)" />
      </svg>
    </div>

    <!-- 热源光标追踪层 -->
    <div ref="heatSpotRef" class="heat-spot"></div>
    <div ref="heatGlowRef" class="heat-glow"></div>

    <!-- 内容层 -->
    <div ref="contentRef" class="thermal-content">
      <div class="thermal-badge">
        <span class="badge-icon">◉</span>
        <span class="badge-text">INFRARED MODE</span>
      </div>

      <div class="thermal-info">
        <h2 class="info-title">热力对流</h2>
        <p class="info-desc">红外视差漫游 · 温度分层</p>
        <div class="thermal-stats">
          <div class="stat">
            <span class="stat-label">顶层温度</span>
            <span class="stat-value hot">32°C</span>
          </div>
          <div class="stat">
            <span class="stat-label">中层温度</span>
            <span class="stat-value mid">18°C</span>
          </div>
          <div class="stat">
            <span class="stat-label">底层温度</span>
            <span class="stat-value cold">5°C</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 温度指示器 -->
    <div ref="tempIndicatorRef" class="temp-indicator">
      <div class="temp-scale">
        <div class="scale-hot"></div>
        <div class="scale-mid"></div>
        <div class="scale-cold"></div>
      </div>
      <div ref="tempNeedleRef" class="temp-needle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const parentRef = ref<HTMLElement | null>(null)
const coldLayerRef = ref<HTMLElement | null>(null)
const midLayerRef = ref<HTMLElement | null>(null)
const hotLayerRef = ref<HTMLElement | null>(null)
const noiseLayerRef = ref<HTMLElement | null>(null)
const contourRef = ref<HTMLElement | null>(null)
const turbulenceRef = ref<SVGFEBlendElement | null>(null)
const heatSpotRef = ref<HTMLElement | null>(null)
const heatGlowRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const tempIndicatorRef = ref<HTMLElement | null>(null)
const tempNeedleRef = ref<HTMLElement | null>(null)

const mouseX = ref(0)
const mouseY = ref(0)

// 入场动画
function initEntryAnimation() {
  if (!contentRef.value || !hotLayerRef.value || !midLayerRef.value || !coldLayerRef.value) return

  gsap.set(contentRef.value, { opacity: 0, y: 50 })
  gsap.set([hotLayerRef.value, midLayerRef.value, coldLayerRef.value], { opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5
    }
  })

  tl.to([coldLayerRef.value, midLayerRef.value, hotLayerRef.value], {
    opacity: 1,
    duration: 1,
    stagger: 0.2
  })
  tl.to(contentRef.value, {
    opacity: 1,
    y: 0,
    duration: 1
  }, 0.5)

  cleanupFns.push(() => tl.kill())
}

// 三层视差滚动
function initParallaxScroll() {
  if (!parentRef.value || !hotLayerRef.value || !midLayerRef.value || !coldLayerRef.value) return

  // 暖色表层 - 最快 0.32
  const tlHot = gsap.to(hotLayerRef.value, {
    yPercent: -32,
    ease: 'none',
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  })
  cleanupFns.push(() => tlHot.kill())

  // 中温层 - 中速 0.18
  const tlMid = gsap.to(midLayerRef.value, {
    yPercent: -18,
    ease: 'none',
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  })
  cleanupFns.push(() => tlMid.kill())

  // 冷色底层 - 最慢 0.06
  const tlCold = gsap.to(coldLayerRef.value, {
    yPercent: -6,
    ease: 'none',
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  })
  cleanupFns.push(() => tlCold.kill())
}

// 等温线动画
function initContourAnimation() {
  if (!contourRef.value) return

  gsap.to('.contour-rect', {
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    onUpdate: function() {
      const time = this.progress() * 0.02
      const filter = contourRef.value?.querySelector('#contour-filter')
      if (filter) {
        const feTurbulence = filter.querySelector('feTurbulence') as SVGFEBlendElement | null
        if (feTurbulence) {
          feTurbulence.setAttribute('baseFrequency', `${0.008 + time} ${0.015 + time}`)
        }
      }
    }
  })

  cleanupFns.push(() => gsap.killTweensOf('.contour-rect'))
}

// 噪点呼吸动画
function initNoiseBreath() {
  if (!noiseLayerRef.value) return

  const tl = gsap.to(noiseLayerRef.value, {
    opacity: 0.15,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  cleanupFns.push(() => tl.kill())
}

// 热源鼠标追踪
function initHeatTracking() {
  if (!parentRef.value || !heatSpotRef.value || !heatGlowRef.value) return

  const quickX = gsap.quickTo(heatSpotRef.value, 'x', { duration: 0.3, ease: 'power2.out' })
  const quickY = gsap.quickTo(heatSpotRef.value, 'y', { duration: 0.3, ease: 'power2.out' })
  const quickGlowX = gsap.quickTo(heatGlowRef.value, 'x', { duration: 0.5, ease: 'power2.out' })
  const quickGlowY = gsap.quickTo(heatGlowRef.value, 'y', { duration: 0.5, ease: 'power2.out' })

  function handleMouseMove(e: MouseEvent) {
    const rect = parentRef.value!.getBoundingClientRect()
    mouseX.value = e.clientX - rect.left
    mouseY.value = e.clientY - rect.top

    quickX(mouseX.value - 100)
    quickY(mouseY.value - 100)
    quickGlowX(mouseX.value - 200)
    quickGlowY(mouseY.value - 200)

    // 局部热源效果
    if (hotLayerRef.value && midLayerRef.value && coldLayerRef.value) {
      const distance = Math.sqrt(
        Math.pow((mouseX.value - window.innerWidth / 2) / 50, 2) +
        Math.pow((mouseY.value - window.innerHeight / 2) / 50, 2)
      )
      const heatIntensity = Math.max(0, 1 - distance / 3)

      gsap.to(hotLayerRef.value, {
        filter: `brightness(${1.2 + heatIntensity * 0.5}) saturate(1.5)`,
        duration: 0.3
      })
      gsap.to(midLayerRef.value, {
        filter: `hue-rotate(-${heatIntensity * 30}deg) brightness(${1 + heatIntensity * 0.3})`,
        duration: 0.4
      })
      gsap.to(coldLayerRef.value, {
        filter: `brightness(${0.8 - heatIntensity * 0.2})`,
        duration: 0.5
      })
    }
  }

  function handleMouseLeave() {
    if (hotLayerRef.value && midLayerRef.value && coldLayerRef.value) {
      gsap.to([hotLayerRef.value, midLayerRef.value, coldLayerRef.value], {
        filter: 'brightness(1) saturate(1) hue-rotate(0deg)',
        duration: 1.5,
        ease: 'power2.out'
      })
    }
  }

  parentRef.value.addEventListener('mousemove', handleMouseMove)
  parentRef.value.addEventListener('mouseleave', handleMouseLeave)

  cleanupFns.push(() => {
    parentRef.value?.removeEventListener('mousemove', handleMouseMove)
    parentRef.value?.removeEventListener('mouseleave', handleMouseLeave)
  })
}

// 温度指示器动画
function initTempIndicator() {
  if (!tempIndicatorRef.value || !tempNeedleRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'bottom -50%',
      scrub: 1.5
    }
  })

  tl.to(tempNeedleRef.value, {
    rotation: 45,
    duration: 1
  })
  tl.to(tempNeedleRef.value, {
    rotation: -30,
    duration: 2,
    ease: 'sine.inOut'
  }, 1)
  tl.to(tempNeedleRef.value, {
    rotation: 20,
    duration: 1.5,
    ease: 'sine.inOut'
  })

  cleanupFns.push(() => tl.kill())
}

// 温度数据动态更新
function initTempDataUpdate() {
  if (!parentRef.value) return

  ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress
      const hotTemp = Math.round(25 + progress * 15 + Math.sin(progress * Math.PI * 4) * 3)
      const midTemp = Math.round(12 + progress * 10 + Math.cos(progress * Math.PI * 3) * 2)
      const coldTemp = Math.round(2 + progress * 8 + Math.sin(progress * Math.PI * 2) * 1)

      const hotEl = document.querySelector('.stat-value.hot')
      const midEl = document.querySelector('.stat-value.mid')
      const coldEl = document.querySelector('.stat-value.cold')

      if (hotEl) hotEl.textContent = `${hotTemp}°C`
      if (midEl) midEl.textContent = `${midTemp}°C`
      if (coldEl) coldEl.textContent = `${coldTemp}°C`
    }
  })
}

onMounted(() => {
  initEntryAnimation()
  initParallaxScroll()
  initContourAnimation()
  initNoiseBreath()
  initHeatTracking()
  initTempIndicator()
  initTempDataUpdate()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.card-img-thermal {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden; // 组件内部不阻止滚动
}

// 背景容器 - 改为普通定位
.thermal-bg-container {
  position: absolute;
  inset: 0;
  z-index: 1;
}

// 热成像层
.thermal-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  will-change: transform, filter;
}

.thermal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.2);
}

// 冷色底层
.thermal-cold {
  z-index: 1;
  mix-blend-mode: screen;
  filter: hue-rotate(200deg) brightness(0.8) saturate(1.5);
}

.thermal-cold-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 50, 100, 0.4) 0%,
    rgba(0, 30, 80, 0.3) 50%,
    rgba(20, 60, 120, 0.5) 100%
  );
  mix-blend-mode: multiply;
}

// 中温过渡层
.thermal-mid {
  z-index: 2;
  mix-blend-mode: overlay;
  filter: hue-rotate(100deg) brightness(1) saturate(1.2);
}

.thermal-mid-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 100, 80, 0.3) 0%,
    rgba(80, 100, 0, 0.2) 50%,
    rgba(100, 60, 0, 0.3) 100%
  );
  mix-blend-mode: soft-light;
}

// 暖色表层
.thermal-hot {
  z-index: 3;
  mix-blend-mode: luminosity;
  filter: hue-rotate(-20deg) brightness(1.1) saturate(1.8);
}

.thermal-hot-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 100, 0, 0.3) 0%,
    rgba(255, 180, 50, 0.2) 50%,
    rgba(255, 50, 0, 0.3) 100%
  );
  mix-blend-mode: overlay;
}

// 噪点层
.thermal-noise {
  position: absolute;
  inset: 0;
  z-index: 4;
  opacity: 0.08;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
  animation: noiseShift 0.5s steps(10) infinite;
}

@keyframes noiseShift {
  0% { transform: translate(0, 0); }
  10% { transform: translate(-2%, -2%); }
  20% { transform: translate(2%, 2%); }
  30% { transform: translate(-1%, 1%); }
  40% { transform: translate(1%, -1%); }
  50% { transform: translate(-2%, 2%); }
  60% { transform: translate(2%, -2%); }
  70% { transform: translate(-1%, -1%); }
  80% { transform: translate(1%, 1%); }
  90% { transform: translate(-2%, -1%); }
  100% { transform: translate(0, 0); }
}

// 等温线
.thermal-contour {
  position: absolute;
  inset: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  pointer-events: none;
}

.contour-rect {
  fill: none;
  stroke: rgba(255, 150, 50, 0.4);
  stroke-width: 0.5;
}

// 热源追踪
.heat-spot {
  position: fixed;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  z-index: 10;
  pointer-events: none;
  background: radial-gradient(
    circle at center,
    rgba(255, 150, 50, 0.4) 0%,
    rgba(255, 100, 0, 0.2) 30%,
    rgba(255, 50, 0, 0.1) 60%,
    transparent 80%
  );
  filter: blur(10px);
  opacity: 0;
  transition: opacity 0.3s;
  transform: translate(-100px, -100px);
}

.heat-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  z-index: 9;
  pointer-events: none;
  background: radial-gradient(
    circle at center,
    rgba(255, 200, 100, 0.2) 0%,
    rgba(255, 150, 50, 0.1) 40%,
    transparent 70%
  );
  filter: blur(30px);
  opacity: 0;
  transition: opacity 0.3s;
  transform: translate(-200px, -200px);
}

.card-img-thermal:hover .heat-spot,
.card-img-thermal:hover .heat-glow {
  opacity: 1;
}

// 内容层
.thermal-content {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

// 标签
.thermal-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(255, 100, 50, 0.1);
  border: 1px solid rgba(255, 150, 50, 0.3);
  border-radius: 50px;
  backdrop-filter: blur(10px);
  margin-bottom: 40px;
}

.badge-icon {
  font-size: 16px;
  color: #ff6b35;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.badge-text {
  font-size: 12px;
  font-weight: 600;
  color: #ffb366;
  letter-spacing: 3px;
}

// 信息
.thermal-info {
  text-align: center;
}

.info-title {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  text-shadow:
    0 0 40px rgba(255, 100, 50, 0.5),
    0 0 80px rgba(255, 150, 50, 0.3);
  background: linear-gradient(135deg, #ff6b35 0%, #ffb366 50%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-desc {
  font-size: 16px;
  color: rgba(255, 200, 150, 0.7);
  margin: 0 0 30px;
  letter-spacing: 2px;
}

// 温度统计
.thermal-stats {
  display: flex;
  gap: 40px;
  justify-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  font-family: 'SF Mono', monospace;

  &.hot {
    color: #ff6b35;
    text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
  }

  &.mid {
    color: #ffcc00;
    text-shadow: 0 0 20px rgba(255, 204, 0, 0.5);
  }

  &.cold {
    color: #00d4ff;
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
  }
}

// 温度指示器
.temp-indicator {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 25;
  width: 24px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.temp-scale {
  width: 8px;
  height: 180px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.scale-hot {
  flex: 1;
  background: linear-gradient(to bottom, #ff3300, #ff6600, #ff9900);
}

.scale-mid {
  flex: 1;
  background: linear-gradient(to bottom, #ffcc00, #99cc00, #66cc66);
}

.scale-cold {
  flex: 1;
  background: linear-gradient(to bottom, #00ccff, #0066cc, #003399);
}

.temp-needle {
  width: 16px;
  height: 3px;
  background: #fff;
  border-radius: 2px;
  margin-top: 8px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  transform-origin: center center;
}
</style>
