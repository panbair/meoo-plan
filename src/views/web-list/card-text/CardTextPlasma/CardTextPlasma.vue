<template>
  <div class="pla-section-144" ref="sectionRef">
    <!-- 等离子体画布 -->
    <canvas ref="plasmaCanvasRef" class="pla-canvas-144"></canvas>

    <!-- 内容 -->
    <div class="pla-content-144" ref="contentRef">
      <!-- 主标题区 -->
      <div class="pla-hero-144" ref="heroRef">
        <div class="pla-badge-144" ref="badgeRef">
          <span class="pla-badge-pulse-144"></span>
          PLASMA · ENERGY CORE
        </div>
        <h1 class="pla-title-144">
          <div class="pla-title-row-144" ref="titleRow1Ref">
            <span v-for="(char, i) in line1" :key="'l1-'+i" class="pla-tchar-144 pla-tchar-top-144" :ref="el => setTChar1Ref(el as HTMLElement, i)">{{ char }}</span>
          </div>
          <div class="pla-title-row-144" ref="titleRow2Ref">
            <span v-for="(char, i) in line2" :key="'l2-'+i" class="pla-tchar-144 pla-tchar-bot-144" :ref="el => setTChar2Ref(el as HTMLElement, i)">{{ char }}</span>
          </div>
        </h1>
        <p class="pla-tagline-144" ref="taglineRef">
          第四态物质——超越固液气的存在，宇宙中最常见的物质形态
        </p>
      </div>

      <!-- 核心数据面板 -->
      <div class="pla-panels-144" ref="panelsRef">
        <div
          v-for="(panel, i) in panels"
          :key="i"
          class="pla-panel-144"
          :ref="el => setPanelRef(el as HTMLElement, i)"
        >
          <div class="pla-panel-glow-144" :style="{ background: panel.glow }"></div>
          <div class="pla-panel-icon-144">{{ panel.icon }}</div>
          <div class="pla-panel-value-144">{{ panel.value }}</div>
          <div class="pla-panel-label-144">{{ panel.label }}</div>
          <p class="pla-panel-desc-144">{{ panel.desc }}</p>
        </div>
      </div>

      <!-- 长文本段落 -->
      <div class="pla-text-section-144" ref="textSectionRef">
        <div class="pla-text-divider-144" ref="dividerRef">
          <div class="pla-div-line-144"></div>
          <div class="pla-div-center-144">⚡</div>
          <div class="pla-div-line-144"></div>
        </div>
        <p
          v-for="(text, i) in bodyTexts"
          :key="i"
          class="pla-body-144"
          :ref="el => setBodyRef(el as HTMLElement, i)"
        >{{ text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 唯一后缀: 144

const sectionRef = ref<HTMLElement | null>(null)
const plasmaCanvasRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRow1Ref = ref<HTMLElement | null>(null)
const titleRow2Ref = ref<HTMLElement | null>(null)
const taglineRef = ref<HTMLElement | null>(null)
const panelsRef = ref<HTMLElement | null>(null)
const textSectionRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)

const line1 = '等离子'.split('')
const line2 = '能量场'.split('')
const tChar1Refs = ref<(HTMLElement | null)[]>([])
const tChar2Refs = ref<(HTMLElement | null)[]>([])
const panelRefs = ref<(HTMLElement | null)[]>([])
const bodyRefs = ref<(HTMLElement | null)[]>([])

const setTChar1Ref = (el: HTMLElement | null, i: number) => { if (el) tChar1Refs.value[i] = el }
const setTChar2Ref = (el: HTMLElement | null, i: number) => { if (el) tChar2Refs.value[i] = el }
const setPanelRef = (el: HTMLElement | null, i: number) => { if (el) panelRefs.value[i] = el }
const setBodyRef = (el: HTMLElement | null, i: number) => { if (el) bodyRefs.value[i] = el }

const panels = [
  { icon: '🌡️', value: '10⁷ K', label: '核心温度', desc: '等离子体核心温度可达太阳表面温度的数百倍，远超普通物质的存在极限。', glow: 'radial-gradient(circle, rgba(239,68,68,0.3), transparent)' },
  { icon: '⚡', value: '99.9%', label: '电离率', desc: '几乎所有原子都失去电子，形成自由移动的带电粒子群，产生强烈的电磁效应。', glow: 'radial-gradient(circle, rgba(251,191,36,0.3), transparent)' },
  { icon: '🌀', value: '∞ Hz', label: '振荡频率', desc: '等离子体内部的电磁振荡频率理论上趋于无穷，呈现出远超人类感知的复杂波动。', glow: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent)' },
  { icon: '🔮', value: '4th', label: '物质形态', desc: '继固态、液态、气态之后的第四种物质形态，占宇宙中可见物质总量的99%以上。', glow: 'radial-gradient(circle, rgba(59,130,246,0.3), transparent)' },
]

const bodyTexts = [
  '等离子体是由自由移动的带电粒子——电子和离子——组成的气态物质状态。与普通气体不同，等离子体中的粒子之间存在强烈的电磁相互作用，使其表现出集体行为，形成宏观上的波动、涡旋和复杂结构。',
  '在宇宙中，等离子体无处不在：恒星内部的热核反应、星际介质中的电离氢云、行星磁层中的粒子流、地球极光背后的高能电子……人类肉眼可见的星光，几乎都来自等离子体状态的物质。',
  '在地球上，等离子体技术正在改变世界：核聚变反应堆试图驾驭等离子体实现清洁能源，等离子体切割机以超高温精准加工金属，医疗等离子体刀在微创手术中展现奇效，甚至普通的霓虹灯管也藏有等离子体的光芒。',
]

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let animFrameId: number | null = null

// 等离子体动态背景
const initPlasma = () => {
  const canvas = plasmaCanvasRef.value
  const section = sectionRef.value
  if (!canvas || !section) return

  const resize = () => {
    canvas.width = section.offsetWidth
    canvas.height = section.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))

  const c = canvas.getContext('2d')
  if (!c) return

  let time = 0
  const draw = () => {
    time += 0.008
    const w = canvas.width, h = canvas.height

    c.clearRect(0, 0, w, h)

    // 多层等离子体光晕
    const plasmaPoints = [
      { x: w * 0.3 + Math.sin(time) * w * 0.15, y: h * 0.4 + Math.cos(time * 0.7) * h * 0.2, r: [255, 100, 50], radius: 300 },
      { x: w * 0.7 + Math.cos(time * 0.8) * w * 0.1, y: h * 0.6 + Math.sin(time * 1.1) * h * 0.15, r: [100, 50, 255], radius: 250 },
      { x: w * 0.5 + Math.sin(time * 1.3) * w * 0.12, y: h * 0.3 + Math.cos(time * 0.6) * h * 0.15, r: [50, 150, 255], radius: 200 },
    ]

    plasmaPoints.forEach(p => {
      const grad = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
      grad.addColorStop(0, `rgba(${p.r[0]}, ${p.r[1]}, ${p.r[2]}, 0.12)`)
      grad.addColorStop(0.5, `rgba(${p.r[0]}, ${p.r[1]}, ${p.r[2]}, 0.05)`)
      grad.addColorStop(1, 'transparent')
      c.fillStyle = grad
      c.fillRect(0, 0, w, h)
    })

    // 绘制等离子体弧线
    for (let i = 0; i < 5; i++) {
      const arc = {
        x1: Math.sin(time + i * 1.2) * w * 0.4 + w * 0.5,
        y1: Math.cos(time * 0.7 + i) * h * 0.3 + h * 0.5,
        x2: Math.sin(time * 1.3 + i * 0.8) * w * 0.3 + w * 0.5,
        y2: Math.cos(time + i * 1.5) * h * 0.3 + h * 0.5,
      }
      c.beginPath()
      c.moveTo(arc.x1, arc.y1)
      const mx = (arc.x1 + arc.x2) / 2 + Math.sin(time * 2 + i) * 80
      const my = (arc.y1 + arc.y2) / 2 + Math.cos(time * 1.5 + i) * 60
      c.quadraticCurveTo(mx, my, arc.x2, arc.y2)
      c.strokeStyle = `rgba(${100 + i * 30}, ${50 + i * 20}, 255, 0.06)`
      c.lineWidth = 1.5
      c.stroke()
    }

    animFrameId = requestAnimationFrame(draw)
  }
  draw()

  const vis = () => {
    if (document.hidden) { if (animFrameId) cancelAnimationFrame(animFrameId) }
    else draw()
  }
  document.addEventListener('visibilitychange', vis)
  cleanupFns.push(() => document.removeEventListener('visibilitychange', vis))
}

onMounted(() => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  initPlasma()

  ctx = gsap.context(() => {
    // badge入场
    if (badgeRef.value) {
      const t = gsap.fromTo(badgeRef.value,
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: heroRef.value, start: 'top 80%', end: 'top 40%', scrub: 1 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 第一行字符 - 从左飞入
    const valid1 = tChar1Refs.value.filter(Boolean)
    if (valid1.length > 0) {
      const t = gsap.fromTo(valid1,
        { x: -80, opacity: 0, rotateY: -90 },
        {
          x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: heroRef.value, start: 'top 75%', end: 'top 25%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 第二行字符 - 从右飞入
    const valid2 = tChar2Refs.value.filter(Boolean)
    if (valid2.length > 0) {
      const t = gsap.fromTo(valid2,
        { x: 80, opacity: 0, rotateY: 90 },
        {
          x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: 'expo.out',
          stagger: { amount: 0.4, from: 'end' },
          scrollTrigger: { trigger: heroRef.value, start: 'top 72%', end: 'top 22%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // tagline
    if (taglineRef.value) {
      const t = gsap.fromTo(taglineRef.value,
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: heroRef.value, start: 'top 68%', end: 'top 20%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // panels入场
    const validPanels = panelRefs.value.filter(Boolean)
    if (validPanels.length > 0) {
      const t = gsap.fromTo(validPanels,
        { y: 80, opacity: 0, scale: 0.85 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: panelsRef.value, start: 'top 85%', end: 'top 15%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // divider
    if (dividerRef.value) {
      const t = gsap.fromTo(dividerRef.value,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: textSectionRef.value, start: 'top 85%', end: 'top 50%', scrub: 1 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 正文段落
    const validBodies = bodyRefs.value.filter(Boolean)
    if (validBodies.length > 0) {
      const t = gsap.fromTo(validBodies,
        { opacity: 0, y: 50, x: -20 },
        {
          opacity: 1, y: 0, x: 0, duration: 1, ease: 'power2.out',
          stagger: 0.2,
          scrollTrigger: { trigger: textSectionRef.value, start: 'top 80%', end: 'top 10%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }
  }, rootEl)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  if (animFrameId) cancelAnimationFrame(animFrameId)
  ctx?.revert()
  ctx = null
  tChar1Refs.value = []
  tChar2Refs.value = []
  panelRefs.value = []
  bodyRefs.value = []
})
</script>

<style scoped>
.pla-section-144 {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #080010 0%, #100825 30%, #0a1020 60%, #060010 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pla-canvas-144 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.pla-content-144 {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  padding: 80px 40px;
  margin: 0 auto;
}

.pla-hero-144 {
  margin-bottom: 80px;
  text-align: center;
}

.pla-badge-144 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #f97316;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 24px;
  padding: 6px 16px;
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 20px;
  background: rgba(249, 115, 22, 0.08);
}

.pla-badge-pulse-144 {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f97316;
  box-shadow: 0 0 10px #f97316;
  animation: pla-pulse-144 1.5s ease-in-out infinite;
}

@keyframes pla-pulse-144 {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
}

.pla-title-144 {
  font-size: clamp(3.5rem, 9vw, 7rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 24px;
}

.pla-title-row-144 {
  display: flex;
  justify-content: center;
  gap: 0.05em;
  perspective: 600px;
}

.pla-tchar-144 {
  display: inline-block;
  background: linear-gradient(135deg, #fde68a 0%, #f97316 40%, #ef4444 70%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 15px rgba(249, 115, 22, 0.5));
}

.pla-tchar-bot-144 {
  background: linear-gradient(135deg, #a855f7 0%, #6366f1 40%, #3b82f6 70%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.5));
}

.pla-tagline-144 {
  font-size: 1.05rem;
  color: #94a3b8;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.pla-panels-144 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 70px;
}

@media (max-width: 1024px) { .pla-panels-144 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .pla-panels-144 { grid-template-columns: 1fr; } }

.pla-panel-144 {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px 20px;
  overflow: hidden;
  text-align: center;
  transition: border-color 0.3s;
}

.pla-panel-144:hover { border-color: rgba(249, 115, 22, 0.3); }

.pla-panel-glow-144 {
  position: absolute;
  inset: -50%;
  pointer-events: none;
  opacity: 0.8;
}

.pla-panel-icon-144 {
  font-size: 2rem;
  margin-bottom: 10px;
  position: relative;
}

.pla-panel-value-144 {
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #fde68a, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
  position: relative;
}

.pla-panel-label-144 {
  font-size: 0.8rem;
  color: #cbd5e1;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
  position: relative;
}

.pla-panel-desc-144 {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.5;
  position: relative;
}

.pla-text-section-144 {
  max-width: 800px;
  margin: 0 auto;
}

.pla-text-divider-144 {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}

.pla-div-line-144 {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.4), transparent);
}

.pla-div-center-144 {
  font-size: 1.5rem;
  color: #f97316;
}

.pla-body-144 {
  font-size: 1.05rem;
  color: #cbd5e1;
  line-height: 1.9;
  margin-bottom: 28px;
  text-align: justify;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  border-left: 3px solid rgba(249, 115, 22, 0.3);
}
</style>

