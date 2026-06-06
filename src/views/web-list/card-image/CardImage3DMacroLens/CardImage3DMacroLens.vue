<template>
  <section ref="rootRef" class="macro-root" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <!-- 微距环境光 -->
    <div ref="ambientA" class="macro-ambient macro-ambient--a"></div>
    <div ref="ambientB" class="macro-ambient macro-ambient--b"></div>

    <div ref="scrollRef" class="macro-scroll">
      <div ref="trackRef" class="macro-track" :style="{ height: trackHeight }">
        <div class="macro-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="macro-header">
            <span class="macro-kicker">◈ CSS3 3D · 微距景深结构 · 伪元素立体部件 ◈</span>
            <h1 class="macro-title">
              <span ref="tc1" class="macro-title__c">微</span>
              <span ref="tc2" class="macro-title__c macro-title__c--lens">距</span>
              <span ref="tc3" class="macro-title__c">透</span>
              <span ref="tc4" class="macro-title__c macro-title__c--lens">视</span>
            </h1>
            <div ref="dividerRef" class="macro-divider"></div>
            <p ref="subRef" class="macro-sub">
              向下滚动 · translateZ 微距堆叠 · ::before/::after 立体部件 · 独立阴影平面
            </p>
          </header>

          <!-- ════════════════ CSS3 3D 微距场景 ════════════════ -->
          <div ref="sceneRef" class="macro-scene">
            <div ref="stageRef" class="macro-stage">

              <!-- ═══════════════ 阴影平面层 (后→前) ═══════════════ -->
              <!-- 🔑 每个深度层拥有独立的阴影 — 模拟地面投影随角度变化 -->
              <div ref="shadowDeep" class="macro-shadow-plane macro-shadow-plane--deep">
                <!-- 深层环境光遮蔽阴影 — 最大偏移、最模糊 -->
              </div>
              <div ref="shadowMid" class="macro-shadow-plane macro-shadow-plane--mid">
                <!-- 主体投影 — 中等偏移和模糊 -->
              </div>
              <div ref="shadowNear" class="macro-shadow-plane macro-shadow-plane--near">
                <!-- 接触阴影 — 最小偏移、最清晰 -->
              </div>

              <!-- ═══════════════ 产品主体 ═══════════════ -->
              <!-- Z:0 — 核心产品卡片 -->
              <div ref="productCard" class="macro-product">
                <img
                  :src="productImage"
                  alt="Luxury Watch"
                  class="macro-product__img"
                  loading="lazy"
                />
                <!-- 🔑 ::before — 水晶表镜 (Z:+18, 前面凸起) -->
                <!-- 🔑 ::after  — 内部机械阴影层 (Z:-10, 后面凹陷) -->
              </div>

              <!-- ═══════════════ 微距结构部件 ═══════════════ -->
              <!-- Z:+12 — 外表圈刻度环 -->
              <div ref="bezelOuter" class="macro-bezel macro-bezel--outer">
                <!-- 🔑 ::before — 12个刻度标记 -->
                <span
                  v-for="i in 12"
                  :key="i"
                  class="macro-bezel__tick"
                  :style="{ transform: `rotate(${i * 30}deg) translateY(-82px)` }"
                ></span>
              </div>

              <!-- Z:-6 — 内表圈结构环 -->
              <div ref="bezelInner" class="macro-bezel macro-bezel--inner">
                <!-- 🔑 ::after — 内圈刻度 -->
              </div>

              <!-- ═══════════════ 镜面高光 ═══════════════ -->
              <!-- Z:+28 — 主高光反射点 (最靠近观察者) -->
              <div ref="highlightMain" class="macro-highlight macro-highlight--main"></div>
              <!-- Z:+22 — 边缘弧光 -->
              <div ref="highlightEdge" class="macro-highlight macro-highlight--edge"></div>

              <!-- ═══════════════ 微距浮尘 (镜头最近处) ═══════════════ -->
              <div ref="lensDust" class="macro-lens-dust">
                <span
                  v-for="d in dustParticles"
                  :key="d.id"
                  class="macro-dust"
                  :style="d.style"
                ></span>
              </div>

            </div>
          </div>

          <!-- 深度指示 -->
          <div ref="depthInfo" class="macro-depth-info">
            <span class="macro-depth-info__dot"></span>
            <span class="macro-depth-info__label">
              景深 {{ currentDepth }}/6 · 倾角 {{ tiltLabel }}
            </span>
          </div>

          <div class="macro-progress"><div ref="progRef" class="macro-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════════
//  CardImage3DMacroLens — CSS3 3D 微距景深结构
//
//  核心创新：打破单一平面，用 translateZ + 伪元素构建微距3D结构
//
//  微距3D技术栈：
//  1. translateZ 精细分层 (−60 → +35px) — 模拟微距镜头的极浅景深
//  2. ::before / ::after 伪元素 — 构建立体部件：
//     · ::before → 水晶表镜（玻璃凸起 + 反射渐变）
//     · ::after  → 内部机械阴影层（暗部凹陷）
//     · 外表圈::before → 12个刻度标记环
//     · 内表圈::after  → 内圈刻度线
//  3. 独立阴影平面 (3层) — 每层模拟地面投影：
//     · 深层阴影：translateZ(-60) + 大偏移 + 高模糊
//     · 中层阴影：translateZ(-30) + 中偏移 + 中模糊
//     · 近层阴影：translateZ(-10) + 小偏移 + 低模糊 (接触阴影)
//  4. z-index 栈 — 精确控制微距层次
//  5. 镜面高光点 — 模拟曲面反射
//  6. 微距浮尘 — 镜头最近处的漂浮微粒
//
//  设计风格：高端腕表展示 · 暗色微距 · 精密机械质感
// ═══════════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

const productImage = 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'

const DEPTH_STAGES = 6
const trackHeight = `${(DEPTH_STAGES + 1) * 100}vh`

// ── 镜头浮尘 ──
interface DustParticle { id: number; style: Record<string, string> }
function genDust(count: number): DustParticle[] {
  const hash = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  return Array.from({ length: count }, (_, i) => {
    const size = 1 + hash(i * 3 + 1) * 3
    return {
      id: i,
      style: {
        '--dx': `${hash(i * 5 + 1) * 100}%`,
        '--dy': `${hash(i * 5 + 2) * 100}%`,
        '--ds': `${size}px`,
        '--do': `${0.06 + hash(i * 7 + 3) * 0.18}`,
      },
    }
  })
}
const dustParticles = ref<DustParticle[]>(genDust(18))

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
const productCard = ref<HTMLElement | null>(null)
const shadowDeep = ref<HTMLElement | null>(null)
const shadowMid = ref<HTMLElement | null>(null)
const shadowNear = ref<HTMLElement | null>(null)
const bezelOuter = ref<HTMLElement | null>(null)
const bezelInner = ref<HTMLElement | null>(null)
const highlightMain = ref<HTMLElement | null>(null)
const highlightEdge = ref<HTMLElement | null>(null)
const lensDust = ref<HTMLElement | null>(null)
const ambientA = ref<HTMLElement | null>(null)
const ambientB = ref<HTMLElement | null>(null)
const depthInfo = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const currentDepth = ref(1)
const tiltLabel = ref('正面')
const tiltLabels = ['正面', '右倾5°', '仰视8°', '左倾12°', '俯视6°', '右旋10°']
const cleanupFns: TweenCleanup[] = []

// ── 鼠标视差 ──
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
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: 0.3, filter: 'blur(8px)' }, { autoAlpha: 1, z: 0, scale: 1, filter: 'blur(0px)', duration: 0.65, stagger: 0.08, ease: 'back.out(1.6)' }, '-=0.35')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.2')
    .fromTo(subRef.value, { autoAlpha: 0, y: 10, filter: 'blur(3px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power2.out' }, '-=0.1')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, '-=0.3')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════════════ 核心：微距3D景深动画 ═══════════════════════
function setupMacroLens() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value || !productCard.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = DEPTH_STAGES

  gsap.set(stage, { rotateX: 0, rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.6,
      onUpdate(self) {
        currentDepth.value = Math.min(D, Math.max(1, Math.ceil(self.progress * D)))
        tiltLabel.value = tiltLabels[currentDepth.value - 1] || '正面'
      },
    },
  })

  // ═══════════════ 6阶段微距旋转观察 ═══════════════

  // Stage 0→1: 正面 → 略微右倾 (展示水晶表镜厚度)
  master.to(stage, { rotateY: 8, rotateX: 2, duration: 0.7, ease: 'power2.inOut' }, 0)
  // 阴影响应 — 深层阴影向右偏移
  master.to(shadowDeep.value, { x: 8, filter: 'blur(18px)', opacity: 0.55, duration: 0.7 }, 0)
  master.to(shadowMid.value, { x: 5, filter: 'blur(10px)', opacity: 0.45, duration: 0.7 }, 0)
  master.to(shadowNear.value, { x: 2, filter: 'blur(3px)', opacity: 0.35, duration: 0.7 }, 0)
  // 高光跟随视角移动
  master.to(highlightMain.value, { x: 12, y: -8, opacity: 0.7, duration: 0.7 }, 0)

  // Stage 1→2: 仰视角度 (展示底部结构深度)
  master.to(stage, { rotateY: 4, rotateX: -12, duration: 0.7, ease: 'power2.inOut' }, 1)
  master.to(shadowDeep.value, { x: 4, y: 12, filter: 'blur(20px)', opacity: 0.6, duration: 0.7 }, 1)
  master.to(shadowMid.value, { x: 2, y: 8, filter: 'blur(12px)', opacity: 0.48, duration: 0.7 }, 1)
  master.to(shadowNear.value, { x: 1, y: 3, filter: 'blur(4px)', opacity: 0.38, duration: 0.7 }, 1)
  master.to(highlightMain.value, { x: -4, y: 18, opacity: 0.55, duration: 0.7 }, 1)
  master.to(highlightEdge.value, { opacity: 0.5, x: -30, duration: 0.7 }, 1)

  // Stage 2→3: 左倾观察 (展示外表圈刻度环)
  master.to(stage, { rotateY: -15, rotateX: -4, duration: 0.7, ease: 'power2.inOut' }, 2)
  master.to(shadowDeep.value, { x: -14, y: 6, filter: 'blur(22px)', opacity: 0.65, duration: 0.7 }, 2)
  master.to(shadowMid.value, { x: -9, y: 4, filter: 'blur(13px)', opacity: 0.5, duration: 0.7 }, 2)
  master.to(shadowNear.value, { x: -4, y: 1, filter: 'blur(5px)', opacity: 0.4, duration: 0.7 }, 2)
  master.to(highlightMain.value, { x: -20, y: -4, opacity: 0.75, duration: 0.7 }, 2)
  master.to(highlightEdge.value, { opacity: 0.65, x: 25, y: -5, duration: 0.7 }, 2)
  // 外表圈微旋转
  master.to(bezelOuter.value, { rotateZ: 8, duration: 0.7 }, 2)

  // Stage 3→4: 俯视角度 (展示表镜反射全貌)
  master.to(stage, { rotateY: -2, rotateX: 10, duration: 0.7, ease: 'power2.inOut' }, 3)
  master.to(shadowDeep.value, { x: -6, y: -10, filter: 'blur(16px)', opacity: 0.5, duration: 0.7 }, 3)
  master.to(shadowMid.value, { x: -4, y: -6, filter: 'blur(9px)', opacity: 0.42, duration: 0.7 }, 3)
  master.to(shadowNear.value, { x: -2, y: -2, filter: 'blur(3px)', opacity: 0.32, duration: 0.7 }, 3)
  master.to(highlightMain.value, { x: 6, y: -22, opacity: 0.8, duration: 0.7 }, 3)
  master.to(highlightEdge.value, { opacity: 0.3, duration: 0.7 }, 3)
  master.to(bezelOuter.value, { rotateZ: -5, duration: 0.7 }, 3)
  master.to(bezelInner.value, { rotateZ: 3, duration: 0.7 }, 3)

  // Stage 4→5: 右旋观察 (展示侧面层次)
  master.to(stage, { rotateY: 18, rotateX: 0, duration: 0.7, ease: 'power2.inOut' }, 4)
  master.to(shadowDeep.value, { x: 16, y: -2, filter: 'blur(19px)', opacity: 0.58, duration: 0.7 }, 4)
  master.to(shadowMid.value, { x: 10, y: -1, filter: 'blur(11px)', opacity: 0.46, duration: 0.7 }, 4)
  master.to(shadowNear.value, { x: 5, y: 0, filter: 'blur(4px)', opacity: 0.36, duration: 0.7 }, 4)
  master.to(highlightMain.value, { x: 28, y: 4, opacity: 0.6, duration: 0.7 }, 4)
  master.to(highlightEdge.value, { opacity: 0.7, x: 35, y: 8, duration: 0.7 }, 4)
  master.to(bezelOuter.value, { rotateZ: 15, duration: 0.7 }, 4)
  master.to(bezelInner.value, { rotateZ: -8, duration: 0.7 }, 4)

  // Stage 5→6: 回归正面 (展示全层堆叠)
  master.to(stage, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power2.inOut' }, 5)
  master.to(shadowDeep.value, { x: 0, y: 0, filter: 'blur(15px)', opacity: 0.5, duration: 0.7 }, 5)
  master.to(shadowMid.value, { x: 0, y: 0, filter: 'blur(8px)', opacity: 0.4, duration: 0.7 }, 5)
  master.to(shadowNear.value, { x: 0, y: 0, filter: 'blur(2px)', opacity: 0.3, duration: 0.7 }, 5)
  master.to(highlightMain.value, { x: 0, y: 0, opacity: 0.65, duration: 0.7 }, 5)
  master.to(highlightEdge.value, { opacity: 0.4, x: 0, y: 0, duration: 0.7 }, 5)
  master.to(bezelOuter.value, { rotateZ: 0, duration: 0.7 }, 5)
  master.to(bezelInner.value, { rotateZ: 0, duration: 0.7 }, 5)

  // ── 浮尘微动 ──
  if (lensDust.value) {
    for (let s = 0; s < D; s++) {
      master.to(lensDust.value, { x: (s % 2 === 0 ? 6 : -4), y: (s % 3 === 0 ? -4 : 3), duration: 0.6 }, s + 0.1)
    }
  }

  // ── 环境光 ──
  if (ambientA.value) master.to(ambientA.value, { x: '5vw', y: '-4vh', scale: 1.15, duration: D }, 0)
  if (ambientB.value) master.to(ambientB.value, { x: '-4vw', y: '3vh', scale: 1.2, duration: D }, 0)

  // ── 深度指示 ──
  if (depthInfo.value) {
    for (let s = 0; s < D; s++) {
      master.to(depthInfo.value, { scale: 1.18, opacity: 1, duration: 0.08, ease: 'power2.out' }, s + 0.45)
      master.to(depthInfo.value, { scale: 1, opacity: 0.65, duration: 0.25, ease: 'power2.in' }, s + 0.53)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

// ═══════════════════════ 鼠标视差 (微距级微调) ═══════════════════════
let rafId = 0
function applyMouseParallax() {
  if (!stageRef.value || !mouseActive.value) {
    if (stageRef.value) stageRef.value.style.transform = ''
    rafId = requestAnimationFrame(applyMouseParallax)
    return
  }
  // 🔑 微距级微小偏移 — 模拟手持微距镜头时的轻微晃动
  const mx = mouseX.value * 2.5
  const my = mouseY.value * 2
  if (stageRef.value) {
    stageRef.value.style.transform = `rotateX(${-my}deg) rotateY(${mx}deg)`
  }
  rafId = requestAnimationFrame(applyMouseParallax)
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupMacroLens() }))
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
/* ═══════════════════════ 微距暗室环境 ═══════════════════════ */
.macro-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(165deg, #0d0a08 0%, #100c0a 25%, #0e0b09 50%, #0f0c0a 75%, #0d0a08 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  cursor: crosshair;
}

/* ── 环境光 ── */
.macro-ambient { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; will-change: transform; z-index: 0; }
.macro-ambient--a { width: 28vw; height: 28vw; top: 8vh; left: 25vw; background: radial-gradient(circle, rgba(180,160,140,.18) 0%, transparent 70%); }
.macro-ambient--b { width: 24vw; height: 24vw; bottom: 12vh; right: 28vw; background: radial-gradient(circle, rgba(140,150,170,.14) 0%, transparent 70%); }

/* ── 滚动 ── */
.macro-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(180,160,140,.2); &:hover { background: rgba(180,160,140,.35); } }
}
.macro-track { position: relative; width: 100%; }
.macro-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ── 标题 ── */
.macro-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 35; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.macro-kicker { display: inline-block; font-size: .58rem; font-weight: 700; letter-spacing: .26em; color: rgba(180,160,140,.7); background: rgba(180,160,140,.06); backdrop-filter: blur(8px); border: 1px solid rgba(180,160,140,.15); border-radius: 999px; padding: .22rem 1.1rem; margin-bottom: .5rem; }
.macro-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.macro-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #b8a898; will-change: transform,opacity,filter;
  &--lens {
    background: linear-gradient(150deg, #d4c8b8 0%, #e8d8c0 25%, #c8b898 50%, #e0d0b8 75%, #d8c8b0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(200,180,150,.4));
  }
}
.macro-divider { width: 100px; height: 1.5px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #c8b898, #e0d0b8, #b8a898, transparent); transform-origin: center; }
.macro-sub { margin: 0; font-size: clamp(.66rem, 1vw, .82rem); color: rgba(170,150,130,.4); max-width: 480px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 微距场景 ═══════════════════════ */
.macro-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 700px;          // 🔑 短焦距 — 微距镜头感
  perspective-origin: 50% 45%;
  will-change: transform, opacity;
}

.macro-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* ═══════════════════════ 独立阴影平面 (3层) ═══════════════════════ */
/*
  🔑 微距阴影系统：
  每层深度拥有独立的阴影平面，模拟地面投影随角度变化的位移与模糊度。
  深层→大偏移+高模糊 / 近层→小偏移+低模糊(接触阴影)
*/
.macro-shadow-plane {
  position: absolute; border-radius: 50%; pointer-events: none;
  will-change: transform, filter, opacity;
  background: rgba(0,0,0,.7);
}

/* 深层阴影 — translateZ(-60px), 最大偏移+最高模糊 */
.macro-shadow-plane--deep {
  width: min(48vw, 360px); height: min(28vw, 220px);
  margin-left: calc(min(48vw, 360px) / -2);
  margin-top: calc(min(28vw, 220px) / -2);
  transform: translateZ(-60px) translateY(12px);
  filter: blur(16px);
  opacity: .5;
}

/* 中层阴影 — translateZ(-30px), 中等偏移+中模糊 */
.macro-shadow-plane--mid {
  width: min(44vw, 330px); height: min(26vw, 200px);
  margin-left: calc(min(44vw, 330px) / -2);
  margin-top: calc(min(26vw, 200px) / -2);
  transform: translateZ(-30px) translateY(6px);
  filter: blur(8px);
  opacity: .4;
}

/* 近层阴影 — translateZ(-10px), 最小偏移+低模糊 (接触阴影) */
.macro-shadow-plane--near {
  width: min(40vw, 300px); height: min(24vw, 180px);
  margin-left: calc(min(40vw, 300px) / -2);
  margin-top: calc(min(24vw, 180px) / -2);
  transform: translateZ(-10px) translateY(2px);
  filter: blur(2px);
  opacity: .3;
}

/* ═══════════════════════ 产品主体 (Z:0) ═══════════════════════ */
.macro-product {
  position: absolute;
  width: min(42vw, 320px); height: min(42vw, 320px);
  margin-left: calc(min(42vw, 320px) / -2);
  margin-top: calc(min(42vw, 320px) / -2);
  border-radius: 50%;
  overflow: visible;
  transform-style: preserve-3d;
  z-index: 10;
  box-shadow:
    0 0 0 3px rgba(200,180,150,.25),     // 表圈外环
    0 0 0 8px rgba(180,160,130,.12),     // 表圈中环
    0 8px 32px rgba(0,0,0,.5);           // 主体环境阴影
}

.macro-product__img {
  width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 50%;
  filter: contrast(1.05) saturate(0.9);
}

/* ═══════════════════════ 🔑 ::before — 水晶表镜 (Z:+18) ═══════════════════════ */
/*
  伪元素构建前部立体部件：
  · 半透明渐变模拟凸面玻璃表镜
  · 弧形高光反射 (模拟环境光源在曲面玻璃上的反射)
  · 边缘暗角 (玻璃厚度感)
*/
.macro-product::before {
  content: '';
  position: absolute; inset: -4px; border-radius: 50%; z-index: 15;
  pointer-events: none;
  transform: translateZ(18px);
  // 🔑 水晶玻璃材质：
  background:
    // 主反射弧光 — 左上角弧形高光
    radial-gradient(ellipse 35% 25% at 35% 30%,
      rgba(255,255,255,.35) 0%,
      rgba(255,255,255,.12) 30%,
      transparent 55%
    ),
    // 次级反射 — 右下角弱反光
    radial-gradient(ellipse 20% 18% at 65% 70%,
      rgba(255,255,255,.1) 0%,
      transparent 50%
    ),
    // 玻璃边缘暗角 — 模拟曲面厚度
    radial-gradient(circle at 50% 50%,
      transparent 60%,
      rgba(0,0,0,.08) 82%,
      rgba(0,0,0,.18) 92%,
      rgba(0,0,0,.25) 100%
    );
  // 玻璃边框高光
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.15),
    0 0 20px rgba(200,180,150,.08);
  // 🔑 微妙的蓝色镀膜 (高端腕表蓝宝石表镜的反光色)
  backdrop-filter: blur(0px); // 保持清晰，仅用渐变模拟
}

/* ═══════════════════════ 🔑 ::after — 内部机械阴影层 (Z:-10) ═══════════════════════ */
/*
  伪元素构建后部深度结构：
  · 暗色渐变模拟表盘下方的机械阴影
  · 内圈纹理暗示
*/
.macro-product::after {
  content: '';
  position: absolute; inset: 6px; border-radius: 50%; z-index: 5;
  pointer-events: none;
  transform: translateZ(-10px);
  // 🔑 内部凹陷阴影 — 表盘下方的暗部
  background:
    radial-gradient(circle at 50% 50%,
      rgba(0,0,0,.25) 0%,
      rgba(0,0,0,.15) 40%,
      rgba(0,0,0,.05) 70%,
      transparent 100%
    );
  // 内圈刻度环暗示
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.2);
}

/* ═══════════════════════ 外表圈刻度环 (Z:+12) ═══════════════════════ */
.macro-bezel {
  position: absolute; border-radius: 50%; transform-style: preserve-3d;
  pointer-events: none;
}

.macro-bezel--outer {
  width: min(46vw, 350px); height: min(46vw, 350px);
  margin-left: calc(min(46vw, 350px) / -2);
  margin-top: calc(min(46vw, 350px) / -2);
  transform: translateZ(12px);
  z-index: 20;
  border: 1px solid rgba(200,180,150,.3);
  box-shadow: 0 0 0 3px rgba(180,160,130,.08);
  will-change: transform;
}

/* 🔑 ::before — 12个刻度标记 (外表圈的立体部件) */
.macro-bezel--outer::before {
  content: '';
  position: absolute; inset: -6px; border-radius: 50%;
  border: 1px dashed rgba(200,180,150,.12);
}

.macro-bezel__tick {
  position: absolute; top: 50%; left: 50%;
  width: 2px; height: 8px; margin-left: -1px; margin-top: -4px;
  background: rgba(200,180,150,.5);
  border-radius: 1px;
  transform-origin: 50% 50%;
}

/* 内表圈 (Z:-6) */
.macro-bezel--inner {
  width: min(36vw, 270px); height: min(36vw, 270px);
  margin-left: calc(min(36vw, 270px) / -2);
  margin-top: calc(min(36vw, 270px) / -2);
  transform: translateZ(-6px);
  z-index: 8;
  border: 1px solid rgba(160,140,120,.18);
  box-shadow: inset 0 0 30px rgba(0,0,0,.2);
  will-change: transform;
}

/* 🔑 ::after — 内表圈刻度线 */
.macro-bezel--inner::after {
  content: '';
  position: absolute; inset: 4px; border-radius: 50%;
  border: 1px dotted rgba(160,140,120,.15);
}

/* ═══════════════════════ 镜面高光 ═══════════════════════ */
.macro-highlight {
  position: absolute; border-radius: 50%; pointer-events: none; will-change: transform, opacity;
}

/* 主高光 — 模拟点光源在曲面上的反射 (Z:+28, 最前) */
.macro-highlight--main {
  width: 18px; height: 10px;
  margin-left: -9px; margin-top: -5px;
  transform: translateZ(28px) translateY(-60px) translateX(-20px);
  z-index: 25;
  background: radial-gradient(ellipse 100% 100% at 50% 50%,
    rgba(255,255,255,.9) 0%,
    rgba(255,255,255,.3) 40%,
    transparent 100%
  );
  filter: blur(1px);
  opacity: .65;
}

/* 边缘弧光 — 表圈边缘的弧形反光 (Z:+22) */
.macro-highlight--edge {
  width: 4px; height: 30px;
  margin-left: -2px; margin-top: -15px;
  transform: translateZ(22px) translateY(-50px) translateX(80px);
  z-index: 22;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(255,255,255,.5) 30%,
    rgba(255,255,255,.7) 50%,
    rgba(255,255,255,.3) 70%,
    transparent 100%
  );
  border-radius: 2px;
  filter: blur(2px);
  opacity: .4;
}

/* ═══════════════════════ 微距浮尘 (Z:+35) ═══════════════════════ */
.macro-lens-dust {
  position: absolute;
  width: min(50vw, 380px); height: min(50vw, 380px);
  margin-left: calc(min(50vw, 380px) / -2);
  margin-top: calc(min(50vw, 380px) / -2);
  transform: translateZ(35px);
  z-index: 30; pointer-events: none;
  will-change: transform;
}
.macro-dust {
  --dx: 50%; --dy: 50%; --ds: 2px; --do: 0.1;
  position: absolute; left: var(--dx); top: var(--dy);
  width: var(--ds); height: var(--ds); border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.7) 0%, transparent 60%);
  opacity: var(--do);
}

/* ── 深度指示器 ── */
.macro-depth-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 30; pointer-events: none; display: flex; align-items: center; gap: .5rem; opacity: .65; will-change: transform,opacity; }
.macro-depth-info__dot { width: 7px; height: 7px; border-radius: 50%; background: radial-gradient(circle, #d4c8b8, #a89880); box-shadow: 0 0 10px rgba(200,180,150,.4); animation: macro-dot-pulse 2.5s ease-in-out infinite; }
@keyframes macro-dot-pulse { 0%,100% { transform: scale(1); opacity: .6; } 50% { transform: scale(1.4); opacity: 1; } }
.macro-depth-info__label { font-size: .62rem; font-weight: 600; letter-spacing: .16em; color: #b8a898; background: rgba(20,16,12,.6); backdrop-filter: blur(8px); border-radius: 999px; padding: .2rem .9rem; border: 1px solid rgba(180,160,140,.15); white-space: nowrap; }

/* ── 进度条 ── */
.macro-progress { position: absolute; left: 0; bottom: 0; z-index: 35; width: 100%; height: 2px; background: rgba(180,160,140,.04); }
.macro-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #c8b898, #e0d0b8, #b8a898); box-shadow: 0 0 8px rgba(200,180,150,.35); }

@media (max-width: 768px) {
  .macro-header { top: 2vh; } .macro-kicker { font-size: .46rem; padding: .16rem .6rem; } .macro-title__c { font-size: 1.6rem; }
  .macro-scene { perspective: 500px; }
  .macro-product { width: 60vw; height: 60vw; margin-left: -30vw; margin-top: -30vw; }
  .macro-shadow-plane--deep { width: 65vw; height: 40vw; margin-left: -32.5vw; margin-top: -20vw; }
  .macro-shadow-plane--mid { width: 60vw; height: 36vw; margin-left: -30vw; margin-top: -18vw; }
  .macro-shadow-plane--near { width: 55vw; height: 32vw; margin-left: -27.5vw; margin-top: -16vw; }
  .macro-bezel--outer { width: 64vw; height: 64vw; margin-left: -32vw; margin-top: -32vw; }
  .macro-bezel--inner { width: 50vw; height: 50vw; margin-left: -25vw; margin-top: -25vw; }
}
</style>
