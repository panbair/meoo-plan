<template>
  <div class="mir-section-145" ref="sectionRef">
    <!-- 沙漠热浪背景 -->
    <div class="mir-bg-145">
      <canvas ref="mirageCanvasRef" class="mir-bg-canvas-145"></canvas>
      <div class="mir-heat-layer-145"></div>
    </div>

    <!-- 内容区 -->
    <div class="mir-content-145" ref="contentRef">
      <!-- 标题 -->
      <div class="mir-header-145" ref="headerRef">
        <div class="mir-kana-145" ref="kanaRef">M I R A G E · 幻 象</div>
        <h2 class="mir-title-145" ref="titleRef">
          <span class="mir-title-main-145">海市蜃楼</span>
          <span class="mir-title-sub-145" ref="titleSubRef">真实与虚幻的边界</span>
        </h2>
        <p class="mir-intro-145" ref="introRef">
          当光线穿越不同密度的热空气，弯曲折射，在地平线上凝结成幻象——
          <em>那是真实的光，折射的景象，永恒的迷途。</em>
        </p>
      </div>

      <!-- 视觉分栏 -->
      <div class="mir-split-145" ref="splitRef">
        <!-- 左侧：现象描述 -->
        <div class="mir-left-145" ref="leftRef">
          <div class="mir-phenom-145">
            <div class="mir-phenom-img-145">
              <div class="mir-img-shimmer-145"></div>
              <div class="mir-img-reflect-145"></div>
            </div>
            <h3 class="mir-phenom-title-145">折射原理</h3>
            <p class="mir-phenom-desc-145">
              太阳加热地面，地面附近空气温度极高，密度极低。远处的光线在温度梯度中弯曲，
              将天空的蓝色投射到地面，形成水的假象。
            </p>
          </div>
        </div>

        <!-- 右侧：哲学延伸 -->
        <div class="mir-right-145" ref="rightRef">
          <div
            v-for="(item, i) in mirageItems"
            :key="i"
            class="mir-item-145"
            :ref="el => setItemRef(el as HTMLElement, i)"
          >
            <div class="mir-item-dot-145" :style="{ background: item.color }"></div>
            <div class="mir-item-body-145">
              <h4 class="mir-item-title-145">{{ item.title }}</h4>
              <p class="mir-item-desc-145">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部引文区 -->
      <div class="mir-footer-145" ref="footerRef">
        <div class="mir-footer-grid-145">
          <div
            v-for="(q, i) in quotes"
            :key="i"
            class="mir-quote-card-145"
            :ref="el => setQuoteRef(el as HTMLElement, i)"
          >
            <div class="mir-quote-shimmer-145"></div>
            <p class="mir-quote-text-145">{{ q.text }}</p>
            <div class="mir-quote-author-145">— {{ q.author }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 唯一后缀: 145

const sectionRef = ref<HTMLElement | null>(null)
const mirageCanvasRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const kanaRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const titleSubRef = ref<HTMLElement | null>(null)
const introRef = ref<HTMLElement | null>(null)
const splitRef = ref<HTMLElement | null>(null)
const leftRef = ref<HTMLElement | null>(null)
const rightRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

const itemRefs = ref<(HTMLElement | null)[]>([])
const quoteRefs = ref<(HTMLElement | null)[]>([])

const setItemRef = (el: HTMLElement | null, i: number) => { if (el) itemRefs.value[i] = el }
const setQuoteRef = (el: HTMLElement | null, i: number) => { if (el) quoteRefs.value[i] = el }

const mirageItems = [
  { color: '#f59e0b', title: '下蜃楼（下现蜃景）', desc: '在炎热的沙漠或公路上，地面附近空气最热，光线向上弯曲，天空倒映于地面，酷似水洼。' },
  { color: '#3b82f6', title: '上蜃楼（上现蜃景）', desc: '在极地或寒冷海面上，地面附近空气最冷，光线向下弯曲，远处物体被"抬升"至空中，如空中城市。' },
  { color: '#8b5cf6', title: '侧蜃楼', desc: '温度梯度呈水平分布时，光线横向弯曲，形成侧向的幻象。在悬崖、建筑等侧面偶有发现。' },
  { color: '#10b981', title: '幻影重叠', desc: '多个温度层叠加，导致同一物体出现多个像，上下颠倒交替叠加，如同多重曝光的梦境。' },
]

const quotes = [
  { text: '你所见的一切，都是光在欺骗你。但那光是真实的，欺骗也是真实的。', author: '柏拉图的洞穴' },
  { text: '沙漠中的行人追逐海市蜃楼中的水，直到渴死。那水是真实的折射，不是谎言。', author: '诺贝尔奖得主 费曼' },
  { text: '每一个文明的边界，都有一片蜃楼——那是人类欲望投射在现实弧面上的倒影。', author: '鲍德里亚《拟象与仿真》' },
]

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let animFrameId: number | null = null

// 热浪扭曲背景动画
const initMirage = () => {
  const canvas = mirageCanvasRef.value
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

  let t = 0
  const draw = () => {
    t += 0.005
    const w = canvas.width, h = canvas.height
    c.clearRect(0, 0, w, h)

    // 渐变沙漠天空背景
    const skyGrad = c.createLinearGradient(0, 0, 0, h * 0.6)
    skyGrad.addColorStop(0, 'rgba(251, 140, 40, 0.04)')
    skyGrad.addColorStop(1, 'rgba(245, 158, 11, 0.01)')
    c.fillStyle = skyGrad
    c.fillRect(0, 0, w, h)

    // 热浪扭曲线条
    for (let i = 0; i < 6; i++) {
      c.beginPath()
      const y = h * 0.6 + Math.sin(t * 0.5 + i) * 30
      c.moveTo(0, y)
      for (let x = 0; x <= w; x += 5) {
        const wave = Math.sin(x * 0.01 + t * 1.5 + i * 0.8) * 8
        c.lineTo(x, y + wave)
      }
      c.strokeStyle = `rgba(245, 158, 11, ${0.04 + i * 0.01})`
      c.lineWidth = 1.5
      c.stroke()
    }

    // 地平线光晕
    const horizGrad = c.createLinearGradient(0, h * 0.55, 0, h * 0.7)
    horizGrad.addColorStop(0, 'rgba(251, 191, 36, 0.06)')
    horizGrad.addColorStop(1, 'transparent')
    c.fillStyle = horizGrad
    c.fillRect(0, h * 0.55, w, h * 0.15)

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

  initMirage()

  ctx = gsap.context(() => {
    // kana标签 - 热浪闪烁效果
    if (kanaRef.value) {
      const t = gsap.fromTo(kanaRef.value,
        { opacity: 0, letterSpacing: '1em', filter: 'blur(4px)' },
        {
          opacity: 1,
          letterSpacing: '0.3em',
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.value, start: 'top 80%', end: 'top 35%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 标题 - 海市蜃楼效果：模糊中出现
    if (titleRef.value) {
      const t = gsap.fromTo(titleRef.value,
        {
          opacity: 0,
          y: 60,
          filter: 'blur(20px)',
          scaleY: 1.3,
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          scaleY: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.value, start: 'top 75%', end: 'top 20%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 副标题波动
    if (titleSubRef.value) {
      const t = gsap.fromTo(titleSubRef.value,
        { opacity: 0, y: 30, scaleX: 0.8 },
        {
          opacity: 1, y: 0, scaleX: 1, duration: 1, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: headerRef.value, start: 'top 70%', end: 'top 20%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 简介
    if (introRef.value) {
      const t = gsap.fromTo(introRef.value,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: headerRef.value, start: 'top 65%', end: 'top 15%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 左侧图像区 - 蜃楼出现效果
    if (leftRef.value) {
      const t = gsap.fromTo(leftRef.value,
        { opacity: 0, scale: 0.9, filter: 'blur(15px)', y: 40 },
        {
          opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: splitRef.value, start: 'top 80%', end: 'top 20%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 右侧条目
    const validItems = itemRefs.value.filter(Boolean)
    if (validItems.length > 0) {
      const t = gsap.fromTo(validItems,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: { trigger: splitRef.value, start: 'top 80%', end: 'top 15%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 底部引文卡片
    const validQuotes = quoteRefs.value.filter(Boolean)
    if (validQuotes.length > 0) {
      const t = gsap.fromTo(validQuotes,
        { y: 70, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: footerRef.value, start: 'top 85%', end: 'top 15%', scrub: 1.5 }
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
  itemRefs.value = []
  quoteRefs.value = []
})
</script>

<style scoped>
.mir-section-145 {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(170deg, #0c0a08 0%, #1a1206 25%, #0f0e0a 55%, #0c0a05 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mir-bg-145 {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.mir-bg-canvas-145 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.mir-heat-layer-145 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(0deg, rgba(245, 158, 11, 0.04) 0%, transparent 100%);
}

.mir-content-145 {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  padding: 80px 40px;
  margin: 0 auto;
}

.mir-header-145 {
  text-align: center;
  margin-bottom: 80px;
}

.mir-kana-145 {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: #d97706;
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 20px;
}

.mir-title-145 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.mir-title-main-145 {
  display: block;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  background: linear-gradient(135deg, #fde68a 0%, #fbbf24 35%, #f59e0b 60%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.4));
  letter-spacing: 0.1em;
}

.mir-title-sub-145 {
  display: block;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 300;
  color: #78716c;
  letter-spacing: 0.3em;
}

.mir-intro-145 {
  font-size: 1.05rem;
  color: #a8a29e;
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto;
}

.mir-intro-145 em {
  color: #fbbf24;
  font-style: normal;
}

.mir-split-145 {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 50px;
  margin-bottom: 70px;
  align-items: start;
}

@media (max-width: 900px) {
  .mir-split-145 { grid-template-columns: 1fr; }
}

.mir-phenom-145 {
  background: rgba(245, 158, 11, 0.04);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 16px;
  padding: 28px;
}

.mir-phenom-img-145 {
  width: 100%;
  height: 160px;
  position: relative;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 10px;
  background: linear-gradient(180deg, #1e3a5f 0%, #2d5a8e 40%, #fbbf24 60%, #d97706 100%);
}

.mir-img-shimmer-145 {
  position: absolute;
  bottom: 30%;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(0deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.05));
  animation: mir-shimmer-145 3s ease-in-out infinite;
}

@keyframes mir-shimmer-145 {
  0%, 100% { transform: scaleY(1); opacity: 0.6; }
  50% { transform: scaleY(1.3); opacity: 1; }
}

.mir-img-reflect-145 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35%;
  background: linear-gradient(180deg, rgba(29, 78, 216, 0.3), rgba(37, 99, 235, 0.1));
  filter: blur(2px);
}

.mir-phenom-title-145 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fde68a;
  margin-bottom: 10px;
}

.mir-phenom-desc-145 {
  font-size: 0.9rem;
  color: #78716c;
  line-height: 1.6;
}

.mir-item-145 {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(245, 158, 11, 0.08);
}

.mir-item-145:last-child { border-bottom: none; }

.mir-item-dot-145 {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
  box-shadow: 0 0 8px currentColor;
}

.mir-item-title-145 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #d6d3d1;
  margin-bottom: 6px;
}

.mir-item-desc-145 {
  font-size: 0.85rem;
  color: #78716c;
  line-height: 1.5;
}

.mir-footer-145 { margin-top: 20px; }

.mir-footer-grid-145 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .mir-footer-grid-145 { grid-template-columns: 1fr; }
}

.mir-quote-card-145 {
  position: relative;
  background: rgba(245, 158, 11, 0.03);
  border: 1px solid rgba(245, 158, 11, 0.12);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.mir-quote-card-145:hover {
  border-color: rgba(245, 158, 11, 0.3);
}

.mir-quote-shimmer-145 {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.04), transparent);
  animation: mir-card-sweep-145 6s linear infinite;
}

@keyframes mir-card-sweep-145 {
  0% { left: -100%; }
  100% { left: 100%; }
}

.mir-quote-text-145 {
  font-size: 0.9rem;
  color: #a8a29e;
  line-height: 1.7;
  font-style: italic;
  margin-bottom: 12px;
  position: relative;
}

.mir-quote-author-145 {
  font-size: 0.75rem;
  color: #d97706;
  font-weight: 600;
  letter-spacing: 0.05em;
  position: relative;
}
</style>

