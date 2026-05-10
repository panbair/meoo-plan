<template>
  <section ref="sectionRef" class="dna-section">
    <!-- 背景 -->
    <div class="dna-bg"></div>

    <!-- DNA 螺旋轨道 -->
    <div class="helix-orbit" ref="helixOrbitRef">
      <div class="helix-strand strand-1">
        <div v-for="i in 20" :key="i" class="strand-node" :style="{ '--i': i }"></div>
      </div>
      <div class="helix-strand strand-2">
        <div v-for="i in 20" :key="i" class="strand-node" :style="{ '--i': i }"></div>
      </div>
      <div class="base-pairs">
        <div v-for="i in 10" :key="i" class="base-pair" :style="{ '--i': i }">
          <span class="base base-1">{{ ['A', 'T', 'G', 'C'][i % 4] }}</span>
          <span class="pair-line"></span>
          <span class="base base-2">{{ ['T', 'A', 'C', 'G'][i % 4] }}</span>
        </div>
      </div>
    </div>

    <!-- 基因卡片组 -->
    <div class="gene-cards-container" ref="cardsContainerRef">
      <div v-for="(card, i) in geneCards" :key="i" 
           class="gene-card"
           :class="`card-${i + 1}`"
           :style="{ '--i': i }"
           ref="cardRefs">
        <div class="card-helix-bg"></div>
        <div class="card-content">
          <div class="card-header">
            <span class="card-badge">{{ card.badge }}</span>
            <span class="card-chr">{{ card.chromosome }}</span>
          </div>
          <div class="card-sequence">
            <span v-for="(base, j) in card.sequence" :key="j" 
                  class="sequence-base"
                  :class="`base-${base}`">
              {{ base }}
            </span>
          </div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-description">{{ card.description }}</p>
          <div class="card-stats">
            <div class="stat">
              <span class="stat-value">{{ card.gcContent }}%</span>
              <span class="stat-label">GC含量</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ card.length }}</span>
              <span class="stat-label">碱基对</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ card.exons }}</span>
              <span class="stat-label">外显子</span>
            </div>
          </div>
          <div class="card-footer">
            <span class="gene-id">{{ card.geneId }}</span>
            <div class="card-tags">
              <span v-for="(tag, j) in card.tags" :key="j" class="card-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中心信息面板 -->
    <div class="info-panel" ref="infoPanelRef">
      <div class="panel-content">
        <h2>DNA 双螺旋</h2>
        <p>生命的密码，遗传的基石</p>
        <div class="base-legend">
          <div class="legend-item" v-for="base in baseInfo" :key="base.letter">
            <span class="legend-letter" :class="`legend-${base.letter.toLowerCase()}`">{{ base.letter }}</span>
            <span class="legend-name">{{ base.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 浮动基因符号 -->
    <div class="floating-symbols">
      <span v-for="i in 12" :key="i" class="float-symbol" :style="{ '--i': i }">
        {{ ['A', 'T', 'G', 'C'][i % 4] }}
      </span>
    </div>

    <!-- 角落装饰 -->
    <div class="corner-dna top-left">
      <svg viewBox="0 0 80 80" class="corner-svg">
        <path d="M10,70 Q20,50 40,40 Q60,30 70,10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,4"/>
        <circle cx="10" cy="70" r="3" fill="currentColor"/>
        <circle cx="40" cy="40" r="4" fill="currentColor"/>
        <circle cx="70" cy="10" r="3" fill="currentColor"/>
      </svg>
    </div>
    <div class="corner-dna bottom-right">
      <svg viewBox="0 0 80 80" class="corner-svg">
        <path d="M10,10 Q30,30 40,40 Q50,60 70,70" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,4"/>
        <circle cx="10" cy="10" r="3" fill="currentColor"/>
        <circle cx="40" cy="40" r="4" fill="currentColor"/>
        <circle cx="70" cy="70" r="3" fill="currentColor"/>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 保存所有动画实例用于清理
let triggers: ScrollTrigger[] = []
let tweens: gsap.core.Tween[] = []

// 基因卡片数据
const geneCards = ref([
  {
    badge: '编码基因',
    chromosome: '1号染色体',
    sequence: 'ATGCGATCGATCGATCGATCG',
    title: '生长因子基因',
    description: '调控细胞增殖与分化的关键因子，在组织修复和发育过程中发挥重要作用。',
    gcContent: 58,
    length: '2.1kb',
    exons: 3,
    geneId: 'GF-001',
    tags: ['生长', '发育', '修复']
  },
  {
    badge: '调控基因',
    chromosome: '7号染色体',
    sequence: 'GCTAGCTAGCTAGCTAGCTA',
    title: '转录因子X',
    description: '特异性结合DNA调控区域的蛋白因子，参与基因表达的精准调控网络。',
    gcContent: 52,
    length: '1.8kb',
    exons: 2,
    geneId: 'TF-007',
    tags: ['转录', '调控', '表达']
  },
  {
    badge: '结构基因',
    chromosome: '12号染色体',
    sequence: 'TTAATTAATTAATTAATTAA',
    title: '细胞骨架蛋白',
    description: '构成细胞内部支撑结构，维持细胞形态与内部组织的关键蛋白家族。',
    gcContent: 35,
    length: '3.2kb',
    exons: 5,
    geneId: 'CK-012',
    tags: ['结构', '形态', '支撑']
  }
])

// 碱基信息
const baseInfo = [
  { letter: 'A', name: 'Adenine 腺嘌呤' },
  { letter: 'T', name: 'Thymine 胸腺嘧啶' },
  { letter: 'G', name: 'Guanine 鸟嘌呤' },
  { letter: 'C', name: 'Cytosine 胞嘧啶' }
]

// 模板引用
const sectionRef = ref<HTMLElement | null>(null)
const helixOrbitRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const infoPanelRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

// 初始化动画
const initAnimations = () => {
  if (!sectionRef.value) return

  // ========== 入场动画 ==========
  const tl = gsap.timeline({ delay: 0.2 })

  // DNA 螺旋入场：缩放 + 旋转 + 渐显
  tl.fromTo('.helix-orbit',
    { scale: 0, opacity: 0, rotation: -180 },
    { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'power3.out' }
  )

  // 螺旋链条节点动画：依次缩放出现
  tl.fromTo('.strand-node',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, stagger: { each: 0.05, from: 'center' }, ease: 'back.out(2)' },
    '-=0.8'
  )

  // 碱基对动画：从中心向两侧展开
  tl.fromTo('.base-pair',
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 1, duration: 0.4, stagger: { each: 0.08, from: 'center' }, ease: 'power2.out' },
    '-=0.6'
  )

  // 卡片依次入场：3D 翻转 + 位移 + 缩放
  tl.fromTo('.gene-card',
    { y: 80, opacity: 0, rotationX: -45, scale: 0.8, filter: 'blur(10px)' },
    {
      y: 0,
      opacity: 1,
      rotationX: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.2)'
    },
    '-=0.4'
  )

  // 信息面板入场
  tl.fromTo(infoPanelRef.value,
    { y: 40, opacity: 0, filter: 'blur(5px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' },
    '-=0.3'
  )

  // 浮动符号入场
  tl.fromTo('.float-symbol',
    { y: 20, opacity: 0, rotation: -90, scale: 0.5 },
    {
      y: 0,
      opacity: 1,
      rotation: 0,
      scale: 1,
      duration: 0.4,
      stagger: 0.03,
      ease: 'back.out(1.5)'
    },
    '-=0.5'
  )

  tweens.push(tl)

  // ========== 持续动画 ==========
  
  // DNA 螺旋持续旋转
  const helixTween = gsap.to('.helix-orbit', {
    rotation: 360,
    duration: 40,
    ease: 'none',
    repeat: -1,
    transformOrigin: 'center center'
  })
  tweens.push(helixTween)

  // 链条节点脉动
  const strandTween = gsap.to('.strand-node', {
    scale: 1.4,
    duration: 1.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    stagger: { each: 0.08, from: 'center', repeat: -1 }
  })
  tweens.push(strandTween)

  // 碱基对脉动
  const baseTween = gsap.to('.base-pair', {
    opacity: 0.6,
    scale: 1.08,
    duration: 1.0,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    stagger: { each: 0.06, from: 'center' }
  })
  tweens.push(baseTween)

  // 卡片悬浮效果
  cardRefs.value.forEach((card, i) => {
    if (!card) return
    const cardFloat = gsap.to(card, {
      y: -12,
      rotationY: i === 0 ? 3 : i === 2 ? -3 : 0,
      duration: 2.2 + i * 0.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.1
    })
    tweens.push(cardFloat)
  })

  // 浮动符号动画（修复 random 语法）
  const floatSymbols = document.querySelectorAll('.float-symbol')
  floatSymbols.forEach((symbol, i) => {
    const randomY = gsap.utils.random(-15, 15)
    const randomX = gsap.utils.random(-8, 8)
    const randomRot = gsap.utils.random(-25, 25)
    const randomDur = gsap.utils.random(3, 5)
    
    const floatTween = gsap.to(symbol, {
      y: randomY,
      x: randomX,
      rotation: randomRot,
      duration: randomDur,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.15
    })
    tweens.push(floatTween)
  })

  // ========== 滚动动画 ==========
  // 设置初始状态
  gsap.set(helixOrbitRef.value, { scale: 1, filter: 'blur(0px) brightness(1)' })
  gsap.set('.gene-card', { y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set(infoPanelRef.value, { y: 0, opacity: 1, filter: 'blur(0px)' })
  gsap.set('.float-symbol', { opacity: 1 })

  // DNA 螺旋滚动：放大 + 模糊 + 变亮
  const helixScroll = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: '40% top',
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(helixOrbitRef.value, {
        scale: 1 + p * 0.8,
        filter: `blur(${p * 8}px) brightness(${1 + p * 0.5})`
      })
    }
  })
  triggers.push(helixScroll)

  // 卡片滚动消失：各自独立触发
  const cardScrolls = cardRefs.value.map((card, i) => {
    if (!card) return null
    const directions = [
      { x: -60, y: -80, rot: -15 },  // 左上
      { x: 0, y: -100, rot: 0 },     // 正上
      { x: 60, y: -80, rot: 15 }     // 右上
    ]
    const dir = directions[i] || directions[1]
    
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        gsap.set(card, {
          x: dir.x * p,
          y: dir.y * p,
          opacity: 1 - p * 1.5,
          rotation: dir.rot * p,
          scale: 1 - p * 0.4,
          filter: `blur(${p * 6}px)`
        })
      }
    })
    return trigger
  })
  triggers.push(...cardScrolls.filter(Boolean) as ScrollTrigger[])

  // 信息面板滚动消失
  const panelScroll = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: '70% top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(infoPanelRef.value, {
        y: 60 * p,
        opacity: 1 - p * 1.5,
        rotation: -8 * p,
        filter: `blur(${p * 4}px)`
      })
    }
  })
  triggers.push(panelScroll)

  // 浮动符号滚动消失
  const symbolsScroll = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: '60% top',
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set('.float-symbol', {
        opacity: 1 - p * 2,
        scale: 1 - p * 0.3,
        y: -30 * p
      })
    }
  })
  triggers.push(symbolsScroll)
}

// 生命周期
onMounted(() => initAnimations())

onUnmounted(() => {
  tweens.forEach(t => t.kill())
  tweens = []
  triggers.forEach(t => t.kill())
  triggers = []
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.dna-section {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0d0d20 100%);
}

.dna-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(0, 200, 150, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(100, 50, 200, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(0, 100, 200, 0.05) 0%, transparent 60%);
}

// DNA 螺旋轨道
.helix-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 600px;
  z-index: 5;
}

.helix-strand {
  position: absolute;
  width: 100%;
  height: 100%;

  &.strand-1 {
    .strand-node:nth-child(odd) {
      left: 20px;
      background: linear-gradient(135deg, #00c896, #00a67e);
      box-shadow: 0 0 15px rgba(0, 200, 150, 0.6);
    }
    .strand-node:nth-child(even) {
      right: 20px;
      left: auto;
      background: linear-gradient(135deg, #ff6b9d, #ff4777);
      box-shadow: 0 0 15px rgba(255, 71, 119, 0.6);
    }
  }

  &.strand-2 {
    .strand-node:nth-child(odd) {
      right: 20px;
      left: auto;
      background: linear-gradient(135deg, #ffd93d, #ffb800);
      box-shadow: 0 0 15px rgba(255, 184, 0, 0.6);
    }
    .strand-node:nth-child(even) {
      left: 20px;
      background: linear-gradient(135deg, #6c5ce7, #5f4dd0);
      box-shadow: 0 0 15px rgba(108, 92, 231, 0.6);
    }
  }
}

.strand-node {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  top: calc(50% + (var(--i) - 10.5) * 25px);
  transform: translateX(-50%);
  transition: transform 0.3s;
}

.base-pairs {
  position: absolute;
  width: 100%;
  height: 100%;
}

.base-pair {
  position: absolute;
  top: calc(50% + (var(--i) - 5.5) * 50px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  transform-origin: center;
}

.base {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  
  &.base-A { background: linear-gradient(135deg, #00c896, #00a67e); }
  &.base-T { background: linear-gradient(135deg, #ff6b9d, #ff4777); }
  &.base-G { background: linear-gradient(135deg, #ffd93d, #ffb800); }
  &.base-C { background: linear-gradient(135deg, #6c5ce7, #5f4dd0); }
}

.pair-line {
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.6), rgba(255,255,255,0.3));
}

// 基因卡片容器
.gene-cards-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 30px;
  z-index: 15;
  perspective: 1000px;
}

.gene-card {
  width: 280px;
  background: linear-gradient(145deg, rgba(20, 20, 45, 0.95) 0%, rgba(10, 10, 30, 0.98) 100%);
  border: 1px solid rgba(0, 200, 150, 0.2);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-10px) scale(1.03);
    border-color: rgba(0, 200, 150, 0.5);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.4),
      0 0 40px rgba(0, 200, 150, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);

    .card-helix-bg {
      opacity: 0.3;
      animation: helixSpin 2s linear infinite;
    }

    .card-badge {
      background: linear-gradient(135deg, #00c896, #00a67e);
    }
  }

  &.card-1 { transform: translateX(-80px) rotateY(5deg); }
  &.card-2 { z-index: 2; }
  &.card-3 { transform: translateX(80px) rotateY(-5deg); }
}

.card-helix-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%);
  background: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0, 200, 150, 0.03) 10px,
      rgba(0, 200, 150, 0.03) 20px
    );
  opacity: 0.15;
  pointer-events: none;
  transition: opacity 0.3s;
}

@keyframes helixSpin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 10px;
  background: rgba(0, 200, 150, 0.2);
  border: 1px solid rgba(0, 200, 150, 0.3);
  border-radius: 20px;
  color: #00c896;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s;
}

.card-chr {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.card-sequence {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.sequence-base {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  border-radius: 4px;
  
  &.base-A { background: rgba(0, 200, 150, 0.7); }
  &.base-T { background: rgba(255, 71, 119, 0.7); }
  &.base-G { background: rgba(255, 184, 0, 0.7); }
  &.base-C { background: rgba(108, 92, 231, 0.7); }
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
}

.card-description {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin: 0 0 16px;
}

.card-stats {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 12px;
}

.stat {
  text-align: center;
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #00c896;
}

.stat-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gene-id {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  font-family: monospace;
}

.card-tags {
  display: flex;
  gap: 6px;
}

.card-tag {
  font-size: 0.6rem;
  padding: 2px 8px;
  background: rgba(0, 200, 150, 0.1);
  border: 1px solid rgba(0, 200, 150, 0.2);
  border-radius: 10px;
  color: rgba(0, 200, 150, 0.8);
}

// 信息面板
.info-panel {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  background: rgba(10, 10, 30, 0.8);
  padding: 20px 40px;
  border-radius: 16px;
  border: 1px solid rgba(0, 200, 150, 0.2);
  backdrop-filter: blur(10px);
}

.panel-content {
  h2 {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, #00c896 0%, #6c5ce7 50%, #ff6b9d 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 4px;
    letter-spacing: 0.1em;
  }

  p {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 16px;
    letter-spacing: 0.2em;
  }
}

.base-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-letter {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;

  &.legend-a { background: linear-gradient(135deg, #00c896, #00a67e); }
  &.legend-t { background: linear-gradient(135deg, #ff6b9d, #ff4777); }
  &.legend-g { background: linear-gradient(135deg, #ffd93d, #ffb800); }
  &.legend-c { background: linear-gradient(135deg, #6c5ce7, #5f4dd0); }
}

.legend-name {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
}

// 浮动基因符号
.floating-symbols {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.float-symbol {
  position: absolute;
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(0, 200, 150, 0.3);

  &:nth-child(1) { top: 10%; left: 10%; }
  &:nth-child(2) { top: 15%; right: 15%; }
  &:nth-child(3) { top: 30%; left: 5%; }
  &:nth-child(4) { top: 35%; right: 8%; }
  &:nth-child(5) { top: 50%; left: 3%; }
  &:nth-child(6) { top: 55%; right: 5%; }
  &:nth-child(7) { top: 70%; left: 8%; }
  &:nth-child(8) { top: 75%; right: 12%; }
  &:nth-child(9) { top: 85%; left: 15%; }
  &:nth-child(10) { top: 20%; left: 50%; }
  &:nth-child(11) { top: 80%; right: 20%; }
  &:nth-child(12) { top: 45%; left: 85%; }
}

// 角落装饰
.corner-dna {
  position: absolute;
  width: 80px;
  height: 80px;
  z-index: 10;

  &.top-left {
    top: 20px;
    left: 20px;
  }

  &.bottom-right {
    bottom: 20px;
    right: 20px;
    transform: rotate(180deg);
  }
}

.corner-svg {
  width: 100%;
  height: 100%;
  color: rgba(0, 200, 150, 0.3);
}

// 响应式
@media (max-width: 1024px) {
  .gene-cards-container {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .gene-card {
    width: 320px;
    transform: none !important;

    &.card-1, &.card-2, &.card-3 {
      transform: none;
    }
  }

  .helix-orbit {
    width: 200px;
    height: 400px;
  }

  .base-pair {
    top: calc(50% + (var(--i) - 5.5) * 35px);
  }

  .strand-node {
    top: calc(50% + (var(--i) - 10.5) * 17px);
  }
}

@media (max-width: 768px) {
  .gene-card {
    width: 280px;
    padding: 18px;
  }

  .base-legend {
    flex-wrap: wrap;
    gap: 12px;
  }

  .info-panel {
    padding: 16px 24px;
  }

  .panel-content h2 {
    font-size: 1.4rem;
  }
}
</style>
