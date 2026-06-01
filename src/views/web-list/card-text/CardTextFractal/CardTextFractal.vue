<template>
  <div class="frac-section-142" ref="sectionRef">
    <!-- 动态背景 -->
    <div class="frac-bg-142">
      <canvas ref="bgCanvasRef" class="frac-bg-canvas-142"></canvas>
    </div>

    <!-- 主内容 -->
    <div class="frac-main-142" ref="mainRef">
      <!-- 标题区 -->
      <div class="frac-header-142" ref="headerRef">
        <div class="frac-label-142" ref="labelRef">FRACTAL · 分形</div>
        <h2 class="frac-title-142" ref="titleRef">
          <span class="frac-word-142" v-for="(word, i) in titleWords" :key="i"
            :ref="el => setWordRef(el as HTMLElement, i)"
          >{{ word }}</span>
        </h2>
        <p class="frac-subtitle-142" ref="subtitleRef">
          自然界最深的秘密——无限重复中的完美秩序
        </p>
      </div>

      <!-- 分形展示区 -->
      <div class="frac-showcase-142" ref="showcaseRef">
        <!-- 中心分形图案 -->
        <div class="frac-center-142" ref="centerRef">
          <div class="frac-tree-142">
            <div v-for="level in 5" :key="level" class="frac-level-142" :class="`frac-l${level}-142`">
              <div v-for="node in Math.pow(2, level - 1)" :key="node" class="frac-node-142"></div>
            </div>
          </div>
        </div>

        <!-- 内容卡片 -->
        <div class="frac-cards-142">
          <div
            v-for="(card, i) in fractalCards"
            :key="i"
            class="frac-card-142"
            :ref="el => setCardRef(el as HTMLElement, i)"
          >
            <div class="frac-card-num-142">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="frac-card-title-142">{{ card.title }}</h3>
            <p class="frac-card-desc-142">{{ card.desc }}</p>
            <div class="frac-card-bar-142">
              <div class="frac-bar-fill-142" :style="{ width: card.pct + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部数据 -->
      <div class="frac-stats-142" ref="statsRef">
        <div v-for="(stat, i) in stats" :key="i" class="frac-stat-142" :ref="el => setStatRef(el as HTMLElement, i)">
          <div class="frac-stat-num-142">{{ stat.num }}</div>
          <div class="frac-stat-label-142">{{ stat.label }}</div>
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

// 唯一后缀: 142

const sectionRef = ref<HTMLElement | null>(null)
const bgCanvasRef = ref<HTMLCanvasElement | null>(null)
const mainRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const labelRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const showcaseRef = ref<HTMLElement | null>(null)
const centerRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)

const titleWords = ['自相似', '无限', '循环', '之美']
const wordRefs = ref<(HTMLElement | null)[]>([])
const cardRefs = ref<(HTMLElement | null)[]>([])
const statRefs = ref<(HTMLElement | null)[]>([])

const setWordRef = (el: HTMLElement | null, i: number) => { if (el) wordRefs.value[i] = el }
const setCardRef = (el: HTMLElement | null, i: number) => { if (el) cardRefs.value[i] = el }
const setStatRef = (el: HTMLElement | null, i: number) => { if (el) statRefs.value[i] = el }

const fractalCards = [
  { title: '自相似性', desc: '分形的核心特征：局部与整体在不同尺度下保持相似的几何形态，宏观与微观之间存在深刻的对应关系。', pct: 95 },
  { title: '无限细节', desc: '无论放大多少倍，分形边界的复杂程度保持不变。这种无限精细的结构使其维度介于整数之间。', pct: 88 },
  { title: '迭代生成', desc: '通过简单规则的反复迭代，可以生成极为复杂的图案。曼德布罗特集合由单一公式演化出无限复杂的边界。', pct: 92 },
  { title: '自然分形', desc: '海岸线、树枝、雪花、山脉都具有分形特征。自然界用分形语言书写了最优雅的几何学。', pct: 79 },
]

const stats = [
  { num: '∞', label: '迭代深度' },
  { num: '1.26', label: '分形维度' },
  { num: '1678', label: '曼德布罗特发现年份' },
  { num: '∂z', label: '复数迭代公式' },
]

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let animFrameId: number | null = null

// 绘制分形背景粒子
const initBgCanvas = () => {
  const canvas = bgCanvasRef.value
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

  interface Particle { x: number; y: number; size: number; angle: number; speed: number; depth: number }
  const particles: Particle[] = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3 + 1,
    angle: Math.random() * Math.PI * 2,
    speed: 0.002 + Math.random() * 0.004,
    depth: Math.random()
  }))

  const draw = () => {
    c.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.angle += p.speed
      p.x += Math.cos(p.angle) * 0.5
      p.y += Math.sin(p.angle * 0.7) * 0.3
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0

      c.beginPath()
      c.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      c.fillStyle = `rgba(${p.depth > 0.5 ? '139, 92, 246' : '245, 158, 11'}, ${p.depth * 0.4})`
      c.fill()
    })
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

  initBgCanvas()

  ctx = gsap.context(() => {
    // label入场
    if (labelRef.value) {
      const t = gsap.fromTo(labelRef.value,
        { opacity: 0, letterSpacing: '1em', x: -30 },
        {
          opacity: 1,
          letterSpacing: '0.3em',
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.value, start: 'top 80%', end: 'top 30%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 标题词语入场 - 裂碎重组效果
    const validWords = wordRefs.value.filter(Boolean)
    if (validWords.length > 0) {
      const t = gsap.fromTo(validWords,
        {
          opacity: 0,
          y: () => gsap.utils.random(-60, 60),
          x: () => gsap.utils.random(-40, 40),
          rotation: () => gsap.utils.random(-20, 20),
          scale: 0.6,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: headerRef.value, start: 'top 75%', end: 'top 20%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 副标题
    if (subtitleRef.value) {
      const t = gsap.fromTo(subtitleRef.value,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: headerRef.value, start: 'top 70%', end: 'top 20%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 中心分形树动画
    if (centerRef.value) {
      const t = gsap.fromTo(centerRef.value,
        { scale: 0.3, opacity: 0, rotation: -180 },
        {
          scale: 1, opacity: 1, rotation: 0, duration: 1.5, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: showcaseRef.value, start: 'top 80%', end: 'top 30%', scrub: 2 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 卡片入场
    const validCards = cardRefs.value.filter(Boolean)
    if (validCards.length > 0) {
      const t = gsap.fromTo(validCards,
        { x: 80, opacity: 0, scale: 0.9 },
        {
          x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: showcaseRef.value, start: 'top 80%', end: 'top 15%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 统计数字
    const validStats = statRefs.value.filter(Boolean)
    if (validStats.length > 0) {
      const t = gsap.fromTo(validStats,
        { y: 50, opacity: 0, scale: 0.8 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)',
          stagger: 0.1,
          scrollTrigger: { trigger: statsRef.value, start: 'top 85%', end: 'top 30%', scrub: 1.5 }
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
  wordRefs.value = []
  cardRefs.value = []
  statRefs.value = []
})
</script>

<style scoped>
.frac-section-142 {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0a1e 0%, #1a0d2e 30%, #0d1a1e 70%, #0a0f1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.frac-bg-142 {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.frac-bg-canvas-142 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.frac-main-142 {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  padding: 80px 40px;
  margin: 0 auto;
}

.frac-header-142 {
  text-align: center;
  margin-bottom: 70px;
}

.frac-label-142 {
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  color: #a78bfa;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-weight: 500;
}

.frac-title-142 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.2em;
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 900;
  margin-bottom: 20px;
  line-height: 1.1;
}

.frac-word-142 {
  display: inline-block;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #a78bfa 60%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 12px rgba(167, 139, 250, 0.4));
}

.frac-subtitle-142 {
  font-size: 1.05rem;
  color: #94a3b8;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.frac-showcase-142 {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  margin-bottom: 60px;
  align-items: start;
}

@media (max-width: 900px) {
  .frac-showcase-142 { grid-template-columns: 1fr; }
}

.frac-center-142 {
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
}

.frac-tree-142 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.frac-level-142 {
  display: flex;
  gap: 6px;
}

.frac-node-142 {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
}

.frac-l1-142 .frac-node-142 { width: 24px; height: 24px; }
.frac-l2-142 .frac-node-142 { width: 18px; height: 18px; }
.frac-l3-142 .frac-node-142 { width: 14px; height: 14px; }
.frac-l4-142 .frac-node-142 { width: 10px; height: 10px; opacity: 0.8; }
.frac-l5-142 .frac-node-142 { width: 7px; height: 7px; opacity: 0.5; }

.frac-cards-142 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.frac-card-142 {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 12px;
  padding: 20px 24px;
  transition: border-color 0.3s, background 0.3s;
}

.frac-card-142:hover {
  border-color: rgba(139, 92, 246, 0.4);
  background: rgba(139, 92, 246, 0.06);
}

.frac-card-num-142 {
  font-size: 0.75rem;
  color: #a78bfa;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}

.frac-card-title-142 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
}

.frac-card-desc-142 {
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 12px;
}

.frac-card-bar-142 {
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.frac-bar-fill-142 {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
  border-radius: 2px;
}

.frac-stats-142 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .frac-stats-142 { grid-template-columns: repeat(2, 1fr); }
}

.frac-stat-142 {
  text-align: center;
  padding: 24px 16px;
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 12px;
}

.frac-stat-num-142 {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 900;
  background: linear-gradient(135deg, #fbbf24, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
}

.frac-stat-label-142 {
  font-size: 0.8rem;
  color: #64748b;
  letter-spacing: 0.05em;
}
</style>

