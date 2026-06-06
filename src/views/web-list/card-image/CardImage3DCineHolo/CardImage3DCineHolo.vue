<template>
  <section ref="rootRef" class="ch-root" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <!-- 电影级暗房背景 -->
    <div class="ch-bg-grid"></div>
    <div ref="scanLineRef" class="ch-scanline"></div>

    <!-- 虚拟光源 -->
    <div ref="lightSource" class="ch-light-source"></div>
    <div ref="ambientGlow" class="ch-ambient"></div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="ch-scroll">
      <div ref="trackRef" class="ch-track" :style="{ height: trackHeight }">
        <div class="ch-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="ch-header">
            <span class="ch-kicker">◈ CSS3 3D · 电影级光影 · 全息锻造 ◈</span>
            <h1 class="ch-title">
              <span ref="tc1" class="ch-title__c">光</span>
              <span ref="tc2" class="ch-title__c ch-title__c--metal">影</span>
              <span ref="tc3" class="ch-title__c">锻</span>
              <span ref="tc4" class="ch-title__c ch-title__c--holo">造</span>
            </h1>
            <div ref="dividerRef" class="ch-divider"></div>
            <p ref="subRef" class="ch-sub">
              向下滚动 · filter 动态光照响应 · mix-blend-mode:screen 全息投影 · 金属+全息双模切换
            </p>
          </header>

          <!-- ════════════════ 3D 电影级场景 ════════════════ -->
          <div ref="sceneRef" class="ch-scene">
            <div ref="stageRef" class="ch-stage">

              <!-- 🔑 6张双模面板 (金属⇄全息) 组成3D晶体结构 -->
              <div
                v-for="(panel, i) in panels"
                :key="panel.id"
                :ref="el => { panelRefs[i] = el as HTMLElement | null }"
                class="ch-panel"
                :style="panel.baseTransform"
              >
                <!-- 面板主体 -->
                <div class="ch-panel__body">
                  <!-- 🔑 金属质感层 (filter响应) -->
                  <div class="ch-panel__metal" :ref="el => { metalRefs[i] = el as HTMLElement | null }">
                    <img :src="panel.image" :alt="panel.label" class="ch-panel__img" loading="lazy" />
                    <!-- 金属拉丝叠加 -->
                    <div class="ch-panel__brushed"></div>
                    <!-- 镜面高光 -->
                    <div class="ch-panel__specular" :ref="el => { specRefs[i] = el as HTMLElement | null }"></div>
                  </div>

                  <!-- 🔑 全息投影层 (mix-blend-mode:screen) -->
                  <div class="ch-panel__holo" :ref="el => { holoRefs[i] = el as HTMLElement | null }">
                    <div class="ch-panel__holo-chroma ch-panel__holo-chroma--cyan"></div>
                    <div class="ch-panel__holo-chroma ch-panel__holo-chroma--magenta"></div>
                    <div class="ch-panel__holo-scan"></div>
                  </div>

                  <!-- 🔑 全息发光边框 -->
                  <div class="ch-panel__holo-edge" :ref="el => { edgeRefs[i] = el as HTMLElement | null }"></div>
                </div>

                <!-- 标签 -->
                <span class="ch-panel__label">{{ panel.label }}</span>
              </div>

            </div>
          </div>

          <!-- 双模状态 -->
          <div ref="modeIndicator" class="ch-mode">
            <span class="ch-mode__dot" :class="currentMode === 'metal' ? 'ch-mode__dot--metal' : 'ch-mode__dot--holo'"></span>
            <span class="ch-mode__label">
              {{ currentMode === 'metal' ? '◆ 金属反射模式' : '◈ 全息投影模式' }} · 面板 {{ activePanel }}/{{ PANEL_COUNT }}
            </span>
          </div>

          <div class="ch-progress"><div ref="progRef" class="ch-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DCineHolo — 电影级光影 · 全息锻造 (双模融合)
//
//  核心创新：金属质感(filter) + 全息投影(mix-blend-mode) 合二为一
//
//  双模切换机制：
//  · 面板面对虚拟光源 → 金属反射模式 (brightness↑ drop-shadow↑ holo↓)
//  · 面板背离虚拟光源 → 全息投影模式 (screen blend↑ 青光↑ 扫描线↑)
//  · 旋转过程中平滑过渡 → 同一面板兼具金属实体和全息幻象
//
//  技术栈：
//  1. filter: brightness() + drop-shadow() — 金属动态光照响应
//  2. mix-blend-mode: screen — 全息投影在黑色背景上发光
//  3. 光角计算 → 实时切换金属/全息双模权重
//  4. 镜面高光 + 金属拉丝 — 金属质感层次
//  5. 色散层(cyan+magenta) + 扫描线 — 全息质感层次
//  6. 全息边框脉动 — 面板边缘的发光轮廓
//  7. 电影级暗房 + 虚拟光源 + 扫描线 — 氛围营造
//
//  设计风格：电影级暗房 · 金属锻造 · 赛博全息 · 冷暖双色
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface PanelData {
  id: number
  label: string
  image: string
  baseTransform: string
}

const panels: PanelData[] = [
  { id: 0, label: 'AURELIAN', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', baseTransform: 'translateZ(0px) rotateY(0deg) rotateX(0deg)' },
  { id: 1, label: 'ARGENTUM', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80', baseTransform: 'translateZ(0px) rotateY(60deg) rotateX(0deg)' },
  { id: 2, label: 'AURUM', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80', baseTransform: 'translateZ(0px) rotateY(120deg) rotateX(0deg)' },
  { id: 3, label: 'PLATINA', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', baseTransform: 'translateZ(0px) rotateY(180deg) rotateX(0deg)' },
  { id: 4, label: 'CUPRUM', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', baseTransform: 'translateZ(0px) rotateY(240deg) rotateX(0deg)' },
  { id: 5, label: 'FERRIUM', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', baseTransform: 'translateZ(0px) rotateY(300deg) rotateX(0deg)' },
]

const PANEL_COUNT = panels.length
const trackHeight = `${(PANEL_COUNT + 1) * 100}vh`

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
const stageRef = ref<HTMLElement | null>(null)
const panelRefs = ref<(HTMLElement | null)[]>(Array(PANEL_COUNT).fill(null))
const metalRefs = ref<(HTMLElement | null)[]>(Array(PANEL_COUNT).fill(null))
const specRefs = ref<(HTMLElement | null)[]>(Array(PANEL_COUNT).fill(null))
const holoRefs = ref<(HTMLElement | null)[]>(Array(PANEL_COUNT).fill(null))
const edgeRefs = ref<(HTMLElement | null)[]>(Array(PANEL_COUNT).fill(null))
const lightSource = ref<HTMLElement | null>(null)
const ambientGlow = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)
const modeIndicator = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const currentMode = ref('metal')
const activePanel = ref(1)
const cleanupFns: TweenCleanup[] = []

// ── 鼠标 ──
const mouseX = ref(0); const mouseY = ref(0); const mouseActive = ref(false)
function onMouseMove(e: MouseEvent) { mouseX.value = (e.clientX / window.innerWidth - 0.5) * 2; mouseY.value = (e.clientY / window.innerHeight - 0.5) * 2; mouseActive.value = true }
function onMouseLeave() { mouseActive.value = false }

// ═══════════════════════ 入场 ═══════════════════════
function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -250, scale: 0.3, filter: 'blur(10px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: 0.65, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.35')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.2')
    .fromTo(subRef.value, { autoAlpha: 0, y: 12, filter: 'blur(3px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power2.out' }, '-=0.1')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.3')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 🔑 双模融合核心动画 ═══════════════════════
function setupCineHolo() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value

  gsap.set(stage, { rotateY: 0 })

  // 🔑 虚拟光源固定在左前方30° (场景坐标系330°)
  const LIGHT_WORLD_ANGLE = 330

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.3,
      onUpdate(self) {
        const stageAngle = self.progress * 360

        // 🔑 逐面板计算光角 → 双模权重
        panelRefs.value.forEach((panelEl, i) => {
          const panelWorldAngle = (stageAngle + i * 60) % 360
          const panelNormal = (panelWorldAngle + 180) % 360 // 面板法线(面朝外)

          let angleDiff = Math.abs(panelNormal - LIGHT_WORLD_ANGLE)
          if (angleDiff > 180) angleDiff = 360 - angleDiff

          // 🔑 光照因子：0°差=面向光源, 90°+=背离
          const lightFactor = Math.max(0, Math.cos(angleDiff * Math.PI / 180))
          // 🔑 双模权重：metalWeight + holoWeight ≈ 1
          const metalWeight = Math.pow(lightFactor, 2.5)  // 陡峭曲线，快速切换
          const holoWeight = 1 - metalWeight

          // 更新最亮面板指示
          if (lightFactor > 0.9) {
            activePanel.value = i + 1
            currentMode.value = 'metal'
          } else if (holoWeight > 0.85) {
            currentMode.value = 'holo'
          }

          // ═══════════ 🎨 金属层动态filter ═══════════
          const metalEl = metalRefs.value[i]
          if (metalEl) {
            const brightness = (0.3 + metalWeight * 1.05).toFixed(2)
            const contrast = (0.75 + metalWeight * 0.4).toFixed(2)
            const shadowBlur = (3 + metalWeight * 30).toFixed(0)
            const shadowAlpha = (0.05 + metalWeight * 0.55).toFixed(2)
            metalEl.style.filter = [
              `brightness(${brightness})`,
              `contrast(${contrast})`,
              `saturate(${(0.5 + metalWeight * 0.55).toFixed(2)})`,
              `drop-shadow(0 0 ${shadowBlur}px rgba(255,200,120,${shadowAlpha}))`,
            ].join(' ')
            metalEl.style.opacity = `${(0.3 + metalWeight * 0.7).toFixed(2)}`
          }

          // ═══════════ 🎨 镜面高光动态 ═══════════
          const specEl = specRefs.value[i]
          if (specEl) {
            const specIntensity = Math.pow(metalWeight, 4)
            specEl.style.opacity = `${(specIntensity * 0.75).toFixed(2)}`
            specEl.style.background = `
              radial-gradient(ellipse 55% 40% at ${40 + (1 - metalWeight) * 50}% 35%,
                rgba(255,255,255,${(specIntensity * 0.6).toFixed(2)}) 0%,
                rgba(255,240,200,${(specIntensity * 0.25).toFixed(2)}) 30%,
                transparent 65%
              )
            `
          }

          // ═══════════ 🎨 全息层动态 ═══════════
          const holoEl = holoRefs.value[i]
          if (holoEl) {
            holoEl.style.opacity = `${(holoWeight * 0.85).toFixed(2)}`
            holoEl.style.filter = `hue-rotate(${(holoWeight * 40).toFixed(0)}deg)`
          }

          // ═══════════ 🎨 全息边框动态 ═══════════
          const edgeEl = edgeRefs.value[i]
          if (edgeEl) {
            edgeEl.style.opacity = `${(0.15 + holoWeight * 0.75).toFixed(2)}`
            edgeEl.style.boxShadow = [
              `0 0 ${(holoWeight * 16).toFixed(0)}px rgba(0,240,255,${(holoWeight * 0.5).toFixed(2)})`,
              `0 0 ${(holoWeight * 30).toFixed(0)}px rgba(255,0,200,${(holoWeight * 0.3).toFixed(2)})`,
            ].join(', ')
          }
        })
      },
    },
  })

  const D = PANEL_COUNT

  // ═══════════ 3D晶体旋转 ═══════════
  master.to(stage, { rotateY: 360, duration: D, ease: 'none' }, 0)

  // 光源脉动 (模拟电影灯光闪烁)
  if (lightSource.value) {
    for (let i = 0; i <= D; i++) {
      master.to(lightSource.value, { scale: 1.2, opacity: 0.85, duration: 0.1, ease: 'power2.out' }, i + 0.2)
      master.to(lightSource.value, { scale: 1, opacity: 0.6, duration: 0.3, ease: 'power2.in' }, i + 0.3)
    }
  }

  // 环境光
  if (ambientGlow.value) {
    master.to(ambientGlow.value, { x: '5vw', y: '-3vh', scale: 1.2, duration: D }, 0)
  }

  // 扫描线
  if (scanLineRef.value) {
    for (let i = 0; i < D; i++) {
      master.fromTo(scanLineRef.value, { top: '-2%' }, { top: '102%', duration: 0.8, ease: 'none' }, i + 0.1)
    }
  }

  // 模式指示器
  if (modeIndicator.value) {
    for (let i = 0; i < PANEL_COUNT; i++) {
      master.to(modeIndicator.value, { scale: 1.2, opacity: 1, duration: 0.1, ease: 'power2.out' }, i + 0.45)
      master.to(modeIndicator.value, { scale: 1, opacity: 0.65, duration: 0.25, ease: 'power2.in' }, i + 0.55)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

// ── 鼠标视差 ──
let rafId = 0
function applyMouseParallax() {
  if (!stageRef.value || !mouseActive.value) { rafId = requestAnimationFrame(applyMouseParallax); return }
  stageRef.value.style.transform = `rotateX(${-mouseY.value * 4}deg) rotateY(${mouseX.value * 5}deg)`
  rafId = requestAnimationFrame(applyMouseParallax)
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupCineHolo() }))
  window.addEventListener('resize', handleResize)
  rafId = requestAnimationFrame(applyMouseParallax)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(rafId)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 电影级暗房 ═══════════════════════ */
.ch-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 45%, #0e0c14 0%, #06050a 55%, #020104 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  cursor: crosshair;
}

/* ── 网格背景 ── */
.ch-bg-grid {
  position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: .06;
  background-image:
    linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse 65% 55% at 50% 50%, black 25%, transparent 70%);
}

/* ── 扫描线 ── */
.ch-scanline { position: absolute; left: 0; width: 100%; height: 1.5px; z-index: 2; pointer-events: none; top: -2%; background: linear-gradient(90deg, transparent, rgba(0,240,255,.3) 20%, rgba(0,240,255,.5) 50%, rgba(0,240,255,.3) 80%, transparent); box-shadow: 0 0 30px rgba(0,200,255,.2); }

/* ── 虚拟光源 ── */
.ch-light-source { position: absolute; top: 12vh; left: 15vw; width: 16vw; height: 16vw; max-width: 180px; max-height: 180px; border-radius: 50%; background: radial-gradient(circle, rgba(255,200,130,.45) 0%, rgba(255,150,60,.2) 35%, transparent 65%); filter: blur(25px); z-index: 1; pointer-events: none; will-change: transform,opacity; }
.ch-ambient { position: absolute; inset: 0; z-index: 0; pointer-events: none; background: radial-gradient(ellipse 50% 40% at 30% 30%, rgba(255,160,80,.06) 0%, transparent 55%), radial-gradient(ellipse 40% 30% at 65% 55%, rgba(0,200,240,.05) 0%, transparent 50%); will-change: transform; }

/* ── 滚动 ── */
.ch-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(0,200,240,.12); }
}
.ch-track { position: relative; width: 100%; }
.ch-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.ch-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 35; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.ch-kicker { display: inline-block; font-size: .56rem; font-weight: 700; letter-spacing: .26em; color: rgba(200,170,120,.7); background: rgba(255,180,100,.05); backdrop-filter: blur(8px); border: 1px solid rgba(200,160,100,.15); border-radius: 999px; padding: .22rem 1.1rem; margin-bottom: .5rem; }
.ch-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.ch-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c8a878; will-change: transform,opacity,filter;
  &--metal { background: linear-gradient(160deg, #ffd080 0%, #e8a850 25%, #ffcc70 50%, #c88040 75%, #ffe0a0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 10px rgba(255,180,80,.5)); }
  &--holo { background: linear-gradient(160deg, #00f0ff 0%, #80e8ff 25%, #ff40ff 55%, #ff90e0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(0,220,255,.6)); }
}
.ch-divider { width: 120px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #e8a850, #00f0ff, #ff40ff, #e8a850, transparent); transform-origin: center; }
.ch-sub { margin: 0; font-size: clamp(.64rem, 1vw, .8rem); color: rgba(180,150,120,.35); max-width: 500px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 场景 ═══════════════════════ */
.ch-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 1100px;
  perspective-origin: 50% 45%;
  will-change: transform, opacity;
}
.ch-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* ═══════════════════════ 双模面板 ═══════════════════════ */
.ch-panel {
  position: absolute; transform-style: preserve-3d;
  will-change: transform;
}
.ch-panel__body {
  position: absolute;
  width: min(44vw, 320px); height: min(30vw, 220px);
  margin-left: calc(min(44vw, 320px) / -2);
  margin-top: calc(min(30vw, 220px) / -2);
  border-radius: 10px; overflow: hidden;
  background: #0a0810;
}

/* ═══════════ 🎨 金属质感层 ═══════════ */
.ch-panel__metal {
  position: absolute; inset: 0; z-index: 2;
  will-change: filter, opacity;
  opacity: .65;
}
.ch-panel__img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* 金属拉丝纹理 */
.ch-panel__brushed {
  position: absolute; inset: 0; pointer-events: none; z-index: 3;
  background:
    linear-gradient(140deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,.02) 18%, rgba(0,0,0,.03) 35%, rgba(255,255,255,.05) 50%, rgba(0,0,0,.04) 65%, rgba(255,255,255,.06) 80%, rgba(0,0,0,.02) 100%),
    linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(0,0,0,.02) 45%, rgba(255,255,255,.03) 100%);
  mix-blend-mode: overlay;
}

/* 镜面高光 (JS动态) */
.ch-panel__specular {
  position: absolute; inset: 0; pointer-events: none; z-index: 4;
  mix-blend-mode: soft-light;
  opacity: 0;
}

/* ═══════════ 🎨 全息投影层 ═══════════ */
.ch-panel__holo {
  position: absolute; inset: 0; z-index: 5;
  mix-blend-mode: screen;  // 🔑 screen混合 → 黑色背景上发光
  opacity: 0;
  will-change: opacity, filter;
  isolation: isolate;
}

/* 色散层 — 青色通道 */
.ch-panel__holo-chroma--cyan {
  position: absolute; inset: 0;
  background: linear-gradient(150deg, rgba(0,240,255,.4) 0%, transparent 35%, rgba(0,200,240,.35) 60%, transparent 100%);
  mix-blend-mode: screen;
  animation: ch-holo-chroma 4s ease-in-out infinite;
}

/* 色散层 — 品红通道 */
.ch-panel__holo-chroma--magenta {
  position: absolute; inset: 0;
  background: linear-gradient(210deg, transparent 30%, rgba(255,0,200,.3) 50%, transparent 70%, rgba(200,0,255,.25) 100%);
  mix-blend-mode: screen;
  animation: ch-holo-chroma 4s ease-in-out infinite reverse;
}
@keyframes ch-holo-chroma {
  0%,100% { opacity: .4; filter: hue-rotate(0deg); }
  25% { opacity: .55; filter: hue-rotate(12deg); }
  50% { opacity: .35; filter: hue-rotate(-8deg); }
  75% { opacity: .5; filter: hue-rotate(6deg); }
}

/* 全息扫描线 */
.ch-panel__holo-scan {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.06) 2px, rgba(0,0,0,.06) 4px);
  mix-blend-mode: multiply; opacity: .55;
}

/* ═══════════ 🎨 全息边框 ═══════════ */
.ch-panel__holo-edge {
  position: absolute; inset: -2px; border-radius: 12px; z-index: 1;
  pointer-events: none; opacity: .2;
  will-change: opacity, box-shadow;
  box-shadow:
    0 0 8px rgba(0,240,255,.3),
    0 0 20px rgba(255,0,200,.15);
}

.ch-panel__label {
  position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); z-index: 6;
  font-size: .56rem; font-weight: 700; letter-spacing: .2em; white-space: nowrap;
  color: rgba(200,170,120,.6); font-family: 'Courier New', monospace;
  background: rgba(10,8,16,.6); backdrop-filter: blur(6px);
  border-radius: 999px; padding: .12rem .7rem;
  border: 1px solid rgba(200,160,100,.12);
}

/* ── 双模指示器 ── */
.ch-mode { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 30; pointer-events: none; display: flex; align-items: center; gap: .45rem; opacity: .65; will-change: transform,opacity; }
.ch-mode__dot { width: 8px; height: 8px; border-radius: 50%; transition: all .3s ease; }
.ch-mode__dot--metal { background: radial-gradient(circle, #ffd080, #e8a850); box-shadow: 0 0 12px rgba(255,180,80,.6); }
.ch-mode__dot--holo { background: radial-gradient(circle, #00f0ff, #b060e0); box-shadow: 0 0 12px rgba(0,240,255,.6); }
.ch-mode__label { font-size: .58rem; font-weight: 600; letter-spacing: .14em; color: #c8a878; font-family: 'Courier New', monospace; background: rgba(10,8,16,.6); backdrop-filter: blur(8px); border-radius: 999px; padding: .18rem .8rem; border: 1px solid rgba(200,160,100,.12); white-space: nowrap; }

.ch-progress { position: absolute; left: 0; bottom: 0; z-index: 35; width: 100%; height: 2px; background: rgba(200,160,100,.03); }
.ch-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #e8a850, #00f0ff, #ff40ff, #e8a850); background-size: 200% 100%; box-shadow: 0 0 8px rgba(255,180,80,.3); }

@media (max-width: 768px) {
  .ch-header { top: 2vh; } .ch-kicker { font-size: .42rem; } .ch-title__c { font-size: 1.6rem; }
  .ch-scene { perspective: 700px; }
  .ch-panel__body { width: 58vw; height: 40vw; margin-left: -29vw; margin-top: -20vw; }
  .ch-light-source { top: 8vh; left: 10vw; width: 20vw; height: 20vw; }
}
</style>
