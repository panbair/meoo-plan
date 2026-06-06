<template>
  <section ref="rootRef" class="np-root">
    <div ref="scrollRef" class="np-scroll">
      <div ref="trackRef" class="np-track" :style="{ height: trackHeight }">
        <div class="np-sticky">

          <header ref="headerRef" class="np-header">
            <span class="np-kicker">◈ 纯CSS 伪3D材质 · 法线扰动 · 浮雕雕刻 ◈</span>
            <h1 class="np-title">
              <!-- 🔑 浮雕文字 — 多层box-shadow + drop-shadow 模拟金属雕刻 -->
              <span ref="tc1" class="np-title__c np-title__c--emboss">伪</span>
              <span ref="tc2" class="np-title__c np-title__c--emboss np-title__c--inset">3</span>
              <span ref="tc3" class="np-title__c np-title__c--emboss">材</span>
              <span ref="tc4" class="np-title__c np-title__c--emboss np-title__c--inset">质</span>
            </h1>
            <div ref="dividerRef" class="np-divider"></div>
            <p ref="subRef" class="np-sub">
              向下滚动 · 多层box-shadow指数叠加 · filter模拟物理光影 · 纯CSS骗过人眼
            </p>
          </header>

          <!-- ════════════════ 伪3D材质展示 ════════════════ -->
          <div ref="sceneRef" class="np-scene">
            <div ref="stageRef" class="np-stage">

              <!-- ═══════════ 🔑 金属面板 — 30层box-shadow + drop-shadow 模拟物理厚度 ═══════════ -->
              <div ref="metalPanel" class="np-metal-plate">
                <!-- 🔑 浮雕文字 — 凹刻效果 -->
                <div class="np-metal-plate__text">METAL</div>
                <!-- 🔑 镜面高光层 — 随滚动移动 -->
                <div ref="metalSpec" class="np-metal-plate__specular"></div>
                <!-- 🔑 边缘斜面 — inset shadow 模拟倒角 -->
                <div class="np-metal-plate__bevel"></div>
              </div>

              <!-- ═══════════ 🔑 玻璃拟态卡片 — backdrop-filter + drop-shadow 折射 ═══════════ -->
              <div ref="glassCard" class="np-glass-card">
                <img :src="imgUrl" alt="" class="np-glass-card__img" loading="lazy" />
                <!-- 🔑 玻璃折射层 -->
                <div class="np-glass-card__refract"></div>
                <!-- 🔑 边缘光 -->
                <div class="np-glass-card__rim"></div>
                <span class="np-glass-card__label">GLASS.REFRACT</span>
              </div>

              <!-- ═══════════ 🔑 立体深度铭牌 — 多阴影堆叠 ═══════════ -->
              <div ref="depthBadge" class="np-depth-badge">
                <div class="np-depth-badge__inner">
                  <span class="np-depth-badge__icon">◈</span>
                  <span class="np-depth-badge__text">DEPTH.MAP</span>
                </div>
                <div class="np-depth-badge__shadow-stack"></div>
              </div>

            </div>
          </div>

          <div ref="infoBar" class="np-info">
            <span class="np-info__text">
              光源角度 {{ Math.round(lightAngle) }}° · drop-shadow(brightness响应) · 30层box-shadow堆叠
            </span>
          </div>

          <div class="np-progress"><div ref="progRef" class="np-progress__fill"></div></div>
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

type TweenCleanup = () => void

const imgUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80'
const STAGES = 5
const trackHeight = `${(STAGES + 1) * 100}vh`

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
const metalPanel = ref<HTMLElement | null>(null)
const metalSpec = ref<HTMLElement | null>(null)
const glassCard = ref<HTMLElement | null>(null)
const depthBadge = ref<HTMLElement | null>(null)
const infoBar = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)

const lightAngle = ref(45)
const cleanupFns: TweenCleanup[] = []

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: .3 }, { autoAlpha: 1, z: 0, scale: 1, duration: .5, stagger: .07, ease: 'back.out(1.5)' }, '-=.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .4, ease: 'power3.inOut' }, '-=.12')
    .fromTo(subRef.value, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, '-=.06')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setupLightAngle() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = STAGES

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        const angle = self.progress * 360
        lightAngle.value = angle

        // 🔑 动态调整 drop-shadow 偏移 — 模拟光源旋转
        const rad = (angle - 90) * Math.PI / 180
        const dx = Math.round(Math.cos(rad) * 12)
        const dy = Math.round(Math.sin(rad) * 10)
        const intensity = 0.3 + Math.abs(Math.sin(rad)) * 0.4

        // 金属面板 — drop-shadow 偏移跟随光源
        if (metalPanel.value) {
          metalPanel.value.style.filter = [
            `drop-shadow(${dx}px ${dy}px ${8 + Math.abs(dx)}px rgba(0,0,0,${(0.3 + intensity * 0.3).toFixed(2)}))`,
            `drop-shadow(${dx * 2}px ${dy * 2}px ${16 + Math.abs(dx) * 2}px rgba(0,0,0,${(0.15 + intensity * 0.1).toFixed(2)}))`,
            `brightness(${(0.9 + intensity * 0.2).toFixed(2)})`,
          ].join(' ')
        }

        // 镜面高光 — 位置跟随光源
        if (metalSpec.value) {
          const sx = 40 + Math.cos(rad) * 30
          const sy = 35 + Math.sin(rad) * 25
          metalSpec.value.style.background = `
            radial-gradient(ellipse 30% 20% at ${sx}% ${sy}%,
              rgba(255,255,255,${(intensity * 0.6).toFixed(2)}) 0%,
              rgba(255,255,255,${(intensity * 0.2).toFixed(2)}) 35%,
              transparent 65%
            )
          `
        }
      },
    },
  })

  // 场景视角微调
  master.to(stage, { rotateX: 15, rotateY: -12, duration: D * .4 }, 0)
  master.to(stage, { rotateX: -10, rotateY: 10, duration: D * .5 }, D * .35)
  master.to(stage, { rotateX: 0, rotateY: 0, duration: D * .3 }, D * .7)

  // 玻璃卡片 — 亮度随光源变化
  if (glassCard.value) {
    master.to(glassCard.value, { rotateY: 15, duration: D * .4, ease: 'power2.inOut' }, 0)
    master.to(glassCard.value, { rotateY: -12, duration: D * .5, ease: 'power2.inOut' }, D * .35)
    master.to(glassCard.value, { rotateY: 0, duration: D * .3, ease: 'power2.inOut' }, D * .7)
  }

  // 深度铭牌 — 微浮动
  if (depthBadge.value) {
    master.to(depthBadge.value, { translateZ: 30, duration: D * .3, ease: 'sine.inOut' }, 0)
    master.to(depthBadge.value, { translateZ: -20, duration: D * .4, ease: 'sine.inOut' }, D * .3)
    master.to(depthBadge.value, { translateZ: 1, duration: D * .3, ease: 'sine.inOut' }, D * .7)
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupLightAngle() }))
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
/* ═══════════════════════ 材质展示暗室 ═══════════════════════ */
.np-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 45%, #0e0c14 0%, #06040c 55%, #020106 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
}

.np-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(120,100,160,.08); }
}
.np-track { position: relative; width: 100%; }
.np-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.np-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.np-kicker { display: inline-block; font-size: .5rem; font-weight: 700; letter-spacing: .22em; color: rgba(160,140,200,.55); background: rgba(120,100,180,.04); backdrop-filter: blur(8px); border: 1px solid rgba(120,100,180,.1); border-radius: 999px; padding: .14rem .8rem; margin-bottom: .45rem; }
.np-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.np-title__c {
  display: inline-block; font-size: clamp(2.2rem, 6vw, 4.8rem); font-weight: 900;
  // 🔑 12层 box-shadow 模拟凸起金属雕刻
  color: #b8a8d0;
  text-shadow:
    // 亮面 (左上光源)
    -1px -1px 0 rgba(255,255,255,.15),
    -2px -2px 1px rgba(255,255,255,.06),
    // 暗面 (右下阴影)
    1px 1px 0 rgba(0,0,0,.3),
    2px 2px 1px rgba(0,0,0,.2),
    3px 3px 2px rgba(0,0,0,.15),
    4px 4px 3px rgba(0,0,0,.1),
    5px 5px 4px rgba(0,0,0,.07),
    6px 6px 5px rgba(0,0,0,.05),
    8px 8px 8px rgba(0,0,0,.04),
    12px 12px 12px rgba(0,0,0,.03),
    16px 16px 16px rgba(0,0,0,.02),
    24px 24px 24px rgba(0,0,0,.01);

  // 🔑 凹刻文字变体
  &--inset {
    color: #9080b0;
    text-shadow:
      // 亮面在右下 (光源左上 → 凹处亮面在对面)
      1px 1px 0 rgba(255,255,255,.1),
      2px 2px 1px rgba(255,255,255,.04),
      // 暗面在左上
      -1px -1px 0 rgba(0,0,0,.35),
      -2px -2px 1px rgba(0,0,0,.2),
      -3px -3px 2px rgba(0,0,0,.12),
      -4px -4px 3px rgba(0,0,0,.08),
      -6px -6px 6px rgba(0,0,0,.05);
  }
}
.np-divider { width: 110px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, #9080c0, #c0a0e0, #9080c0, transparent); }
.np-sub { margin: 0; font-size: clamp(.5rem, 1vw, .66rem); color: rgba(120,100,180,.3); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ 3D 场景 ═══════════════════════ */
.np-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: 900px;
  perspective-origin: 50% 48%;
}
.np-stage { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

/* ═══════════════ 🔑 金属面板 — 30层box-shadow模拟物理厚度+drop-shadow动态光影 ═══════════════ */
.np-metal-plate {
  position: absolute;
  width: 280px; height: 180px;
  margin-left: -140px; margin-top: -160px;
  border-radius: 12px;
  transform: translateZ(-40px) rotateX(8deg);
  transform-style: preserve-3d;
  will-change: filter;
  background: linear-gradient(160deg, #252030 0%, #1a1622 30%, #201c28 60%, #181420 100%);

  // 🔑 30层 box-shadow 指数级叠加 → 模拟物理厚度!
  // 近层锐利 (紧贴表面) → 远层扩散 (环境光遮蔽)
  box-shadow:
    // 紧贴层 (锐利, 模拟边缘厚度)
    0 1px 0 rgba(255,255,255,.04),
    0 -1px 0 rgba(0,0,0,.15),
    // 近层 (2-8px, 半锐利)
    0 2px 4px rgba(0,0,0,.25),
    0 3px 6px rgba(0,0,0,.2),
    0 4px 8px rgba(0,0,0,.16),
    0 5px 10px rgba(0,0,0,.13),
    0 6px 12px rgba(0,0,0,.11),
    // 中层 (8-20px, 扩散)
    0 8px 16px rgba(0,0,0,.1),
    0 10px 20px rgba(0,0,0,.08),
    0 12px 24px rgba(0,0,0,.07),
    0 14px 28px rgba(0,0,0,.06),
    // 远层 (20-40px, 环境遮蔽)
    0 18px 36px rgba(0,0,0,.05),
    0 22px 44px rgba(0,0,0,.04),
    0 28px 56px rgba(0,0,0,.03),
    0 36px 72px rgba(0,0,0,.02);

  // 🔑 filter drop-shadow — 动态光源响应
  filter: drop-shadow(4px 3px 8px rgba(0,0,0,.35)) drop-shadow(8px 6px 16px rgba(0,0,0,.15)) brightness(1);
  transition: filter .15s ease;
}

/* 金属面板上的浮雕文字 */
.np-metal-plate__text {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 2.4rem; font-weight: 900; letter-spacing: .2em;
  color: #302840;
  // 🔑 凹刻效果 — text-shadow亮面在右下(光源左上)
  text-shadow:
    1px 1px 0 rgba(255,255,255,.06),
    2px 2px 1px rgba(255,255,255,.03),
    -1px -1px 0 rgba(0,0,0,.4),
    -2px -2px 1px rgba(0,0,0,.25),
    -3px -3px 2px rgba(0,0,0,.15);
}

/* 镜面高光层 — JS动态位置 */
.np-metal-plate__specular {
  position: absolute; inset: 0; border-radius: 12px; pointer-events: none; z-index: 2;
  mix-blend-mode: soft-light;
  transition: background .15s ease;
}

/* 边缘斜面 — inset shadow 模拟金属倒角 */
.np-metal-plate__bevel {
  position: absolute; inset: 0; border-radius: 12px; pointer-events: none; z-index: 1;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.2),
              inset 1px 0 0 rgba(255,255,255,.03), inset -1px 0 0 rgba(0,0,0,.12);
}

/* ═══════════════ 🔑 玻璃拟态卡片 — backdrop-filter + 折射 ═══════════════ */
.np-glass-card {
  position: absolute;
  width: 200px; height: 140px;
  margin-left: -100px; margin-top: 50px;
  border-radius: 10px; overflow: hidden;
  transform: translateZ(30px);
  transform-style: preserve-3d; will-change: transform;
  box-shadow: 0 12px 40px rgba(0,0,0,.35);

  // 🔑 玻璃效果 = 半透明背景 + backdrop-filter模糊 + 轻边框
  background: rgba(30,25,40,.25);
  backdrop-filter: blur(2px) saturate(1.1);
  border: 1px solid rgba(255,255,255,.08);
}
.np-glass-card__img { width: 100%; height: 100%; object-fit: cover; display: block; mix-blend-mode: overlay; opacity: .7; }

/* 玻璃折射层 */
.np-glass-card__refract {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background:
    radial-gradient(ellipse 35% 25% at 30% 30%, rgba(255,255,255,.15) 0%, transparent 55%),
    radial-gradient(ellipse 20% 15% at 70% 70%, rgba(255,255,255,.06) 0%, transparent 45%);
}

/* 玻璃边缘光 */
.np-glass-card__rim {
  position: absolute; inset: 0; border-radius: 10px; pointer-events: none; z-index: 1;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.12), inset 0 -1px 0 rgba(0,0,0,.15);
}
.np-glass-card__label {
  position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); z-index: 3;
  font-size: .5rem; font-weight: 700; letter-spacing: .18em; white-space: nowrap;
  color: rgba(255,255,255,.65); font-family: 'Courier New', monospace;
  text-shadow: 0 1px 3px rgba(0,0,0,.4);
}

/* ═══════════════ 🔑 深度铭牌 — 多阴影堆叠 + drop-shadow ═══════════════ */
.np-depth-badge {
  position: absolute;
  width: 160px; height: 60px;
  margin-left: -80px; margin-top: 80px;
  transform: translateZ(1px) translateX(160px);
  transform-style: preserve-3d; will-change: transform;
}
.np-depth-badge__inner {
  width: 100%; height: 100%; border-radius: 30px;
  background: linear-gradient(160deg, #302840 0%, #252030 50%, #201c28 100%);
  display: flex; align-items: center; justify-content: center; gap: .4rem;
  // 🔑 15层阴影堆叠厚度
  box-shadow:
    0 1px 2px rgba(0,0,0,.3),
    0 2px 4px rgba(0,0,0,.22),
    0 3px 6px rgba(0,0,0,.18),
    0 4px 8px rgba(0,0,0,.14),
    0 6px 12px rgba(0,0,0,.1),
    0 8px 16px rgba(0,0,0,.08),
    0 10px 20px rgba(0,0,0,.06),
    0 14px 28px rgba(0,0,0,.04);
  // 🔑 顶部高光 — inset模拟表面弧度
  box-shadow:
    0 1px 2px rgba(0,0,0,.3),
    0 2px 4px rgba(0,0,0,.22),
    0 3px 6px rgba(0,0,0,.18),
    0 4px 8px rgba(0,0,0,.14),
    0 6px 12px rgba(0,0,0,.1),
    0 8px 16px rgba(0,0,0,.08),
    0 10px 20px rgba(0,0,0,.06),
    0 14px 28px rgba(0,0,0,.04),
    inset 0 1px 0 rgba(255,255,255,.06),
    inset 0 -2px 4px rgba(0,0,0,.15);
}
.np-depth-badge__icon { font-size: .8rem; color: rgba(180,160,220,.5); }
.np-depth-badge__text { font-size: .5rem; font-weight: 700; letter-spacing: .14em; color: rgba(180,160,220,.55); font-family: 'Courier New', monospace; }

.np-info { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 35; pointer-events: none; }
.np-info__text { font-size: .5rem; font-weight: 600; letter-spacing: .08em; color: rgba(120,100,180,.4); font-family: 'Courier New', monospace; white-space: nowrap; }

.np-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(120,100,180,.02); }
.np-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #9080c0, #c0a0e0, #9080c0); }

@media (max-width: 768px) {
  .np-header { top: 2vh; } .np-kicker { font-size: .32rem; }
  .np-metal-plate { width: 220px; height: 140px; margin-left: -110px; margin-top: -130px; }
  .np-metal-plate__text { font-size: 1.6rem; }
  .np-glass-card { width: 150px; height: 105px; margin-left: -75px; }
  .np-depth-badge { transform: translateZ(1px) translateX(100px); width: 130px; height: 50px; margin-left: -65px; }
}
</style>
