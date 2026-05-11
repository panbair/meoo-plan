<template>
  <section class="stellar-orbit">
    <!-- 星空背景 -->
    <div ref="starfieldRef" class="starfield">
      <div class="stars stars-1"></div>
      <div class="stars stars-2"></div>
      <div class="stars stars-3"></div>
    </div>

    <!-- 轨道光环 -->
    <div ref="orbitRingsRef" class="orbit-rings">
      <div class="orbit-ring ring-1"></div>
      <div class="orbit-ring ring-2"></div>
      <div class="orbit-ring ring-3"></div>
    </div>

    <!-- 中心光晕 -->
    <div ref="singularityRef" class="singularity">
      <div class="singularity-core"></div>
      <div class="singularity-pulse"></div>
    </div>

    <!-- 卡片容器 -->
    <div ref="containerRef" class="orbit-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        :ref="(el) => setCardRef(el, index)"
        class="orbit-card"
        :style="{ '--card-gradient': card.gradient, '--card-accent': card.accent }"
      >
        <div class="card-inner">
          <div class="card-glow"></div>
          <div class="card-shine"></div>
          <div class="card-content">
            <span class="card-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
          </div>
          <div class="card-footer">
            <span class="card-tag">{{ card.tag }}</span>
            <div class="card-orb">
              <span class="orb-dot"></span>
            </div>
          </div>
        </div>
        <div class="card-border"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StarCard {
  id: number
  title: string
  desc: string
  tag: string
  gradient: string
  accent: string
}

const cards: StarCard[] = [
  { id: 1, title: 'Nova', desc: 'Stellar explosion releasing cosmic energy', tag: 'Event', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%)', accent: '#ff8787' },
  { id: 2, title: 'Pulsar', desc: 'Neutron star emitting rhythmic beams', tag: 'Signal', gradient: 'linear-gradient(135deg, #4dabf7 0%, #1864ab 100%)', accent: '#74c0fc' },
  { id: 3, title: 'Quasar', desc: 'Distant galaxy core with immense brightness', tag: 'Beacon', gradient: 'linear-gradient(135deg, #9775fa 0%, #6741d9 100%)', accent: '#b197fc' },
  { id: 4, title: 'Nebula', desc: 'Stellar nursery of new star formation', tag: 'Genesis', gradient: 'linear-gradient(135deg, #f783ac 0%, #a61e4d 100%)', accent: '#faa2c1' },
  { id: 5, title: 'Blackhole', desc: 'Gravity well distorting spacetime', tag: 'Gravity', gradient: 'linear-gradient(135deg, #495057 0%, #212529 100%)', accent: '#868e96' },
  { id: 6, title: 'Comet', desc: 'Icy wanderer blazing through cosmos', tag: 'Traveler', gradient: 'linear-gradient(135deg, #74c0fc 0%, #1c7ed6 100%)', accent: '#a5d8ff' },
  { id: 7, title: 'Galaxy', desc: ' billions of stars bound by gravity', tag: 'System', gradient: 'linear-gradient(135deg, #ffd43b 0%, #fab005 100%)', accent: '#ffe066' },
  { id: 8, title: 'Aurora', desc: 'Solar wind dancing with magnetosphere', tag: 'Light', gradient: 'linear-gradient(135deg, #69db7c 0%, #2f9e44 100%)', accent: '#8ce99a' },
]

const containerRef = ref<HTMLDivElement>()
const starfieldRef = ref<HTMLDivElement>()
const orbitRingsRef = ref<HTMLDivElement>()
const singularityRef = ref<HTMLDivElement>()
const cardRefs = ref<HTMLDivElement[]>([])

const setCardRef = (el: any, index: number) => {
  if (el) cardRefs.value[index] = el
}

let mainTimeline: gsap.Timeline | null = null
let scrollTriggerInstance: ScrollTrigger | null = null
let orbitTweens: gsap.core.Tween[] = []
let cleanupFns: (() => void)[] = []

const initAnimation = async () => {
  await nextTick()
  
  const container = containerRef.value
  const singularity = singularityRef.value
  const orbitRings = orbitRingsRef.value
  const allCards = cardRefs.value.filter(Boolean)

  if (!container || !allCards.length) return

  const { width, height } = container.getBoundingClientRect()
  const centerX = width / 2
  const centerY = height / 2

  // 3D 透视空间
  gsap.set(container, {
    perspective: 2000,
    transformStyle: 'preserve-3d',
    willChange: 'transform'
  })

  // ========== 初始状态：卡片在中心收缩 ==========
  gsap.set(allCards, (i) => ({
    x: centerX,
    y: centerY,
    z: -800,
    scale: 0,
    rotation: gsap.utils.random(-720, 720),
    opacity: 0,
    filter: 'blur(15px) brightness(0.3)',
    transformOrigin: 'center center',
    force3D: true
  }))

  // 中心光晕初始
  gsap.set(singularity, {
    scale: 0,
    opacity: 0
  })

  gsap.set(orbitRings, {
    scale: 0,
    opacity: 0,
    rotation: 0
  })

  // ========== 主时间线 ==========
  mainTimeline = gsap.timeline({
    defaults: { ease: 'power3.inOut' }
  })

  // 中心光晕显现
  mainTimeline.to(singularity, {
    scale: 1.5,
    opacity: 1,
    duration: 0.8
  }, 0)

  // 轨道光环旋转显现
  mainTimeline.to(orbitRings, {
    scale: 1,
    opacity: 0.5,
    rotation: 360,
    duration: 1.2,
    stagger: 0.2
  }, 0.2)

  // ========== 1. 卡片散开 ==========
  mainTimeline.to(allCards, {
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
    rotation: 0,
    opacity: 1,
    filter: 'blur(0px) brightness(1)',
    stagger: {
      each: 0.1,
      grid: [2, 4],
      from: 'center'
    },
    duration: 1.5
  }, 0.4)

  // ========== 2. 悬浮效果 ==========
  mainTimeline.to(allCards, {
    y: (i: number) => -30 + (i % 3) * 15,
    z: (i: number) => 40 + (i % 4) * 20,
    stagger: 0.05,
    duration: 1
  }, '-=0.6')

  // ========== 3. 归位 ==========
  mainTimeline.to(allCards, {
    y: 0,
    z: 0,
    rotation: 0,
    duration: 0.6
  }, '-=0.3')

  // 中心光晕缩小消失
  mainTimeline.to(singularity, {
    scale: 0,
    opacity: 0,
    duration: 0.5
  }, '-=0.5')

  // 光晕爆发效果
  mainTimeline.to('.singularity-core', {
    scale: 3,
    opacity: 0,
    duration: 0.5,
    ease: 'power4.out'
  }, 0.4)

  // ========== 4. 悬浮循环 ==========
  allCards.forEach((card, i) => {
    const floatTween = gsap.to(card, {
      y: `+=${gsap.utils.random(-20, 20)}`,
      rotation: `+=${gsap.utils.random(-8, 8)}`,
      scale: `+=${gsap.utils.random(-0.03, 0.03)}`,
      repeat: -1,
      yoyo: true,
      duration: 3 + (i % 3) * 0.5,
      ease: 'sine.inOut'
    })
    orbitTweens.push(floatTween)
  })

  // ========== ScrollTrigger 绑定 ==========
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: container,
    start: 'top 75%',
    end: 'top 15%',
    scrub: 1.5,
    animation: mainTimeline,
    toggleActions: 'play reverse play reverse',
    immediateRender: false
  })

  cleanupFns.push(() => {
    orbitTweens.forEach(t => t.kill())
    orbitTweens = []
  })
}

const handleResize = () => {
  cleanupFns.forEach(fn => fn())
  if (scrollTriggerInstance) scrollTriggerInstance.kill()
  if (mainTimeline) mainTimeline.kill()
  initAnimation()
}

onMounted(() => {
  initAnimation()
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  if (mainTimeline) mainTimeline.kill()
  if (scrollTriggerInstance) scrollTriggerInstance.kill()

  ScrollTrigger.getAll().forEach(instance => {
    if (instance.vars.trigger === containerRef.value) {
      instance.kill()
    }
  })

  if (cardRefs.value.length) {
    gsap.set(cardRefs.value, { clearProps: 'all' })
  }

  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.stellar-orbit {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 50%, #0a1628 0%, #050a14 60%, #020308 100%);
}

.starfield {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 50px 100px, rgba(255,255,255,0.9), transparent),
    radial-gradient(2px 2px at 150px 50px, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 250px 200px, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 350px 150px, rgba(0,240,255,0.6), transparent),
    radial-gradient(1px 1px at 450px 80px, rgba(255,255,255,0.9), transparent);
}

.stars-1 { animation: starFloat1 60s linear infinite; }
.stars-2 {
  background-size: 300px 300px;
  animation: starFloat2 80s linear infinite;
  opacity: 0.7;
}
.stars-3 {
  background-size: 500px 500px;
  animation: starFloat3 100s linear infinite;
  opacity: 0.5;
}

@keyframes starFloat1 {
  from { transform: translateY(0) translateX(0); }
  to { transform: translateY(-100vh) translateX(50px); }
}
@keyframes starFloat2 {
  from { transform: translateY(0) rotate(0deg); }
  to { transform: translateY(-100vh) rotate(10deg); }
}
@keyframes starFloat3 {
  from { transform: translateY(0) scale(1); }
  to { transform: translateY(-100vh) scale(0.8); }
}

.orbit-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid;
  opacity: 0.3;
}
.ring-1 {
  width: 30%;
  height: 30%;
  margin: -15% 0 0 -15%;
  border-color: rgba(255, 200, 100, 0.4);
}
.ring-2 {
  width: 50%;
  height: 50%;
  margin: -25% 0 0 -25%;
  border-color: rgba(255, 180, 80, 0.25);
}
.ring-3 {
  width: 70%;
  height: 70%;
  margin: -35% 0 0 -35%;
  border-color: rgba(255, 160, 60, 0.15);
}

.singularity {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  pointer-events: none;
  z-index: 5;
}

.singularity-core {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle,
    #ffcc00 0%,
    rgba(255, 180, 0, 0.6) 40%,
    rgba(255, 100, 0, 0.3) 70%,
    transparent 100%);
  box-shadow:
    0 0 60px rgba(255, 200, 0, 0.8),
    0 0 120px rgba(255, 150, 0, 0.4),
    inset 0 0 40px rgba(255, 255, 255, 0.4);
}

.singularity-pulse {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle,
    transparent 50%,
    rgba(255, 180, 0, 0.15) 70%,
    transparent 100%);
  animation: singularityPulse 2s ease-in-out infinite;
}

@keyframes singularityPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 1; }
}

.orbit-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 24px;
  padding: 60px 80px;
  position: relative;
  z-index: 10;
}

.orbit-card {
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 20px;
  background: var(--card-gradient);
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
    opacity: 0.8;
  }
}

.card-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle at 50% 0%,
    var(--card-accent) 0%,
    transparent 60%);
  opacity: 0.15;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.card-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 100%);
  border-radius: 20px 20px 0 0;
  pointer-events: none;
}

.orbit-card:hover .card-inner {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.6),
    0 0 40px var(--card-accent),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.orbit-card:hover .card-glow {
  opacity: 0.3;
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.card-index {
  font-family: 'Orbitron', monospace;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 3px;
}

.card-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin: 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}

.card-tag {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.card-orb {
  width: 28px;
  height: 28px;
  position: relative;
}

.orb-dot {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--card-accent);
  box-shadow: 0 0 15px var(--card-accent);
  animation: orbPulse 2s ease-in-out infinite;
}

@keyframes orbPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}
</style>
