<template>
  <section ref="sectionRef" class="cyber-section">
    <div ref="gridBgRef" class="grid-background"></div>
    <div ref="nodeBgRef" class="node-background"></div>

    <div ref="headerRef" class="cyber-header">
      <div ref="badgeRef" class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
          <path d="M8 21H16M12 17V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M7 8L10 11L7 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h1 ref="titleRef" class="cyber-title">赛博空间</h1>
      <p ref="subtitleRef" class="cyber-subtitle">CYBERSPACE</p>
    </div>

    <div class="cards-container">
      <div ref="card0Ref" class="cyber-card" data-index="0">
        <div class="card-terminal-line"></div>
        <div class="card-scan-effect"></div>
        <div class="card-hex-grid"></div>
        <div class="card-content">
          <span class="card-index">01</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="2"/>
              <path d="M6 6H10V10H6V6Z" stroke="currentColor" stroke-width="2"/>
              <path d="M14 6H18V10H14V6Z" stroke="currentColor" stroke-width="2"/>
              <path d="M6 14H10V18H6V14Z" stroke="currentColor" stroke-width="2"/>
              <path d="M14 14H18V18H14V14Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h3 class="card-title">数据矩阵</h3>
          <p class="card-desc">信息的数字化呈现</p>
        </div>
      </div>

      <div ref="card1Ref" class="cyber-card" data-index="1">
        <div class="card-terminal-line"></div>
        <div class="card-scan-effect"></div>
        <div class="card-hex-grid"></div>
        <div class="card-content">
          <span class="card-index">02</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 2V12L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="card-title">网络拓扑</h3>
          <p class="card-desc">节点连接的结构</p>
        </div>
      </div>

      <div ref="card2Ref" class="cyber-card" data-index="2">
        <div class="card-terminal-line"></div>
        <div class="card-scan-effect"></div>
        <div class="card-hex-grid"></div>
        <div class="card-content">
          <span class="card-index">03</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">层级协议</h3>
          <p class="card-desc">通信的规则定义</p>
        </div>
      </div>

      <div ref="card3Ref" class="cyber-card" data-index="3">
        <div class="card-terminal-line"></div>
        <div class="card-scan-effect"></div>
        <div class="card-hex-grid"></div>
        <div class="card-content">
          <span class="card-index">04</span>
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2Z" stroke="currentColor" stroke-width="2"/>
              <path d="M2 12H22" stroke="currentColor" stroke-width="2"/>
              <path d="M12 2C14.5 5 16 8.5 16 12C16 15.5 14.5 19 12 22C9.5 19 8 15.5 8 12C8 8.5 9.5 5 12 2Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h3 class="card-title">加密隧道</h3>
          <p class="card-desc">安全的数据通道</p>
        </div>
      </div>
    </div>

    <footer ref="footerRef" class="cyber-footer">
      <span>CardCyberspace</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const gridBgRef = ref<HTMLElement | null>(null)
const nodeBgRef = ref<HTMLElement | null>(null)
const card0Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)

let cleanupFns: TweenCleanup[] = []
let bgAnimations: gsap.core.Tween[] = []

const ANIMATION_DISTANCE = 200

const createCyberBackground = () => {
  if (!nodeBgRef.value) return

  const nodes: { x: number; y: number }[] = []
  for (let i = 0; i < 20; i++) {
    nodes.push({
      x: Math.random() * 100,
      y: Math.random() * 100
    })
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = document.createElement('div')
    node.className = 'cyber-node'
    node.style.cssText = `
      position: absolute;
      left: ${nodes[i].x}%;
      top: ${nodes[i].y}%;
      width: 4px;
      height: 4px;
      background: #00ffff;
      border-radius: 50%;
      box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
      pointer-events: none;
    `
    nodeBgRef.value.appendChild(node)

    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x
      const dy = nodes[j].y - nodes[i].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 25) {
        const line = document.createElement('div')
        line.className = 'cyber-line'
        const angle = Math.atan2(dy, dx) * 180 / Math.PI
        line.style.cssText = `
          position: absolute;
          left: ${nodes[i].x}%;
          top: ${nodes[i].y}%;
          width: ${dist}%;
          height: 1px;
          background: linear-gradient(90deg, rgba(0, 255, 255, 0.6), rgba(0, 255, 255, 0.1));
          transform: rotate(${angle}deg);
          transform-origin: left center;
          pointer-events: none;
        `
        nodeBgRef.value.appendChild(line)

        const lineTl = gsap.timeline({ repeat: -1 })
        lineTl.fromTo(line,
          { opacity: 0.2 },
          { opacity: 0.8, duration: 1 + Math.random() * 2, ease: 'sine.inOut' }
        ).to(line,
          { opacity: 0.2, duration: 1 + Math.random() * 2, ease: 'sine.inOut' },
          '+=1'
        )
        bgAnimations.push(lineTl)
      }
    }

    const nodeTl = gsap.timeline({ repeat: -1 })
    nodeTl.fromTo(node,
      { scale: 0.5, opacity: 0.3 },
      { scale: 1.5, opacity: 1, duration: 1 + Math.random() * 2, ease: 'sine.inOut' }
    ).to(node,
      { scale: 0.5, opacity: 0.3, duration: 1 + Math.random() * 2, ease: 'sine.inOut' },
      '+=1'
    )
    bgAnimations.push(nodeTl)
  }
}

const initAnimations = () => {
  createCyberBackground()

  const tl = gsap.timeline({ delay: 0.3 })

  // zoom-in-down: from top with scale
  tl.fromTo(badgeRef.value,
    { y: -ANIMATION_DISTANCE, scale: 0.5, opacity: 0, filter: 'blur(20px)' },
    { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'back.out(1.8)' }
  )
  .fromTo(titleRef.value,
    { y: -ANIMATION_DISTANCE * 0.8, scale: 0.6, opacity: 0, filter: 'blur(15px)' },
    { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
    '-=0.5'
  )
  .fromTo(subtitleRef.value,
    { y: -ANIMATION_DISTANCE * 0.5, scale: 0.8, opacity: 0, letterSpacing: '30px' },
    { y: 0, scale: 1, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
    '-=0.4'
  )

  const cards = [card0Ref.value, card1Ref.value, card2Ref.value, card3Ref.value]

  cards.forEach((card, i) => {
    if (!card) return
    tl.fromTo(card,
      { y: -ANIMATION_DISTANCE, scale: 0.6, opacity: 0, filter: 'blur(15px)' },
      { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
      `=-${0.6 - i * 0.1}`
    )
  })

  tl.fromTo(footerRef.value,
    { y: -ANIMATION_DISTANCE * 0.3, scale: 0.8, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.3'
  )

  cleanupFns.push(() => tl.kill())

  gsap.set('.cyber-card', { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' })
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' })
  gsap.set(footerRef.value, { y: 0, scale: 1, opacity: 1 })

  // ScrollTrigger - cards zoom-out-down
  cards.forEach((card, i) => {
    if (!card) return

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        const dir = self.direction

        if (dir > 0) {
          gsap.set(card, {
            y: 200 * p,
            scale: 1 - p * 0.8,
            opacity: Math.max(0, 1 - p * 2),
            filter: `blur(${p * 10}px)`,
            rotation: p * 15
          })
        } else {
          gsap.set(card, {
            y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', rotation: 0
          })
        }
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // Header scroll - zoom-out-down
  const headerTrigger = ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top top',
    end: '20% top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(headerRef.value, {
        y: 100 * p,
        scale: 1 - p * 0.5,
        opacity: 1 - p * 2,
        filter: `blur(${p * 8}px)`
      })
    }
  })
  cleanupFns.push(() => headerTrigger.kill())

  // Footer scroll - fade out
  const footerTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: '80% top',
    end: 'bottom top',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(footerRef.value, {
        y: 50 * p,
        scale: 1 - p * 0.5,
        opacity: 1 - p * 2,
        filter: `blur(${p * 6}px)`
      })
    }
  })
  cleanupFns.push(() => footerTrigger.kill())
}

onMounted(() => initAnimations())

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  bgAnimations.forEach(t => t.kill())
  if (nodeBgRef.value) {
    nodeBgRef.value.innerHTML = ''
  }
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style lang="scss" scoped>
.cyber-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a0f 0%, #0f1a2a 50%, #0a0a0f 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  perspective: 1200px;
}

.grid-background {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 20s linear infinite;
  pointer-events: none;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 40px 40px; }
}

.node-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.cyber-node {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.cyber-line {
  position: absolute;
  pointer-events: none;
}

.cyber-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 10;
}

.header-badge {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #00ffff, #00b4d8, #0077b6);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  box-shadow: 
    0 0 40px rgba(0, 255, 255, 0.6),
    0 0 80px rgba(0, 180, 216, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.3);

  svg { width: 50px; height: 50px; }
}

.cyber-title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #caf0f8, #00ffff, #00b4d8);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
}

.cyber-subtitle {
  font-size: 18px;
  color: rgba(0, 255, 255, 0.6);
  letter-spacing: 6px;
  font-weight: 300;
}

.cards-container {
  display: flex;
  gap: 25px;
  position: relative;
  z-index: 10;
}

.cyber-card {
  position: relative;
  width: 260px;
  height: 340px;
  padding: 32px;
  background: linear-gradient(180deg, 
    rgba(0, 255, 255, 0.08) 0%, 
    rgba(0, 180, 216, 0.05) 50%,
    rgba(0, 119, 182, 0.08) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
  }

  &:hover {
    transform: translateY(-15px) scale(1.05);
    border-color: rgba(0, 255, 255, 0.5);
    box-shadow: 
      0 20px 40px rgba(0, 255, 255, 0.2),
      0 0 60px rgba(0, 180, 216, 0.15),
      inset 0 0 40px rgba(0, 255, 255, 0.05);
    
    .card-terminal-line {
      animation: terminalType 0.5s steps(20) forwards;
    }
    .card-scan-effect {
      animation: scanDown 1.5s linear infinite;
    }
  }
}

.card-terminal-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 0;
  background: linear-gradient(180deg, #00ffff, transparent);
  pointer-events: none;
  opacity: 0;
}

@keyframes terminalType {
  0% { height: 0; opacity: 1; }
  100% { height: 100%; opacity: 0; }
}

.card-scan-effect {
  position: absolute;
  left: 0;
  top: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, 
    transparent 0%,
    rgba(0, 255, 255, 0.1) 50%,
    transparent 100%);
  pointer-events: none;
  opacity: 0;
}

@keyframes scanDown {
  0% { top: -100%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.card-hex-grid {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;

  .cyber-card:hover & {
    opacity: 1;
  }
}

.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-index {
  font-size: 48px;
  font-weight: 900;
  color: #00ffff;
  opacity: 0.15;
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}

.card-icon {
  width: 64px;
  height: 64px;
  color: #00ffff;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.6));
  
  svg { width: 100%; height: 100%; }
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: auto;
}

.cyber-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(0, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
