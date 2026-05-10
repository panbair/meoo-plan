<template>
  <section ref="sectionRef" class="bio-container">
    <!-- 深海背景 -->
    <div class="deep-sea">
      <div class="sea-gradient"></div>
      <div class="caustics" ref="causticsRef"></div>
    </div>

    <!-- 动态光波 -->
    <div class="light-waves">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
    </div>

    <!-- 漂浮水母群 -->
    <div class="jellyfish-swarm" ref="jellySwarmRef"></div>

    <!-- 荧光粒子 -->
    <div class="glow-particles" ref="particlesRef"></div>

    <!-- 气泡 -->
    <div class="rising-bubbles" ref="bubblesRef"></div>

    <!-- 底部沙床 -->
    <div class="sandy-floor"></div>

    <!-- 主内容 -->
    <div class="bio-content" ref="contentRef">
      <!-- 标题区 -->
      <div class="bio-title-section" ref="titleSectionRef">
        <div class="title-badge" ref="badgeRef">05</div>
        <div class="title-icon" ref="iconRef">
          <svg viewBox="0 0 120 140" class="jelly-svg">
            <defs>
              <radialGradient id="bellGrad" cx="50%" cy="20%" r="70%">
                <stop offset="0%" stop-color="#e0f7fa"/>
                <stop offset="40%" stop-color="#80deea"/>
                <stop offset="100%" stop-color="#00bcd4" stop-opacity="0.6"/>
              </radialGradient>
              <radialGradient id="innerGlow" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stop-color="#fff" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#00bcd4" stop-opacity="0"/>
              </radialGradient>
              <filter id="jellyBlur">
                <feGaussianBlur stdDeviation="1.5"/>
              </filter>
            </defs>
            <!-- 伞盖 -->
            <ellipse cx="60" cy="45" rx="45" ry="35" fill="url(#bellGrad)" filter="url(#jellyBlur)"/>
            <ellipse cx="60" cy="40" rx="30" ry="20" fill="url(#innerGlow)"/>
            <!-- 伞盖纹理 -->
            <path d="M25 50 Q30 35 60 30 Q90 35 95 50" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
            <path d="M30 55 Q35 42 60 38 Q85 42 90 55" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            <!-- 触手 -->
            <g class="tentacles">
              <path class="tentacle t1" d="M25 70 Q20 100 28 130" stroke="rgba(128,222,234,0.7)" stroke-width="3" fill="none" stroke-linecap="round"/>
              <path class="tentacle t2" d="M38 72 Q35 105 40 135" stroke="rgba(128,222,234,0.6)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <path class="tentacle t3" d="M50 74 Q48 108 52 138" stroke="rgba(128,222,234,0.65)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <path class="tentacle t4" d="M60 75 Q60 110 58 140" stroke="rgba(128,222,234,0.7)" stroke-width="3" fill="none" stroke-linecap="round"/>
              <path class="tentacle t5" d="M70 74 Q72 108 68 138" stroke="rgba(128,222,234,0.65)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <path class="tentacle t6" d="M82 72 Q85 105 80 135" stroke="rgba(128,222,234,0.6)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <path class="tentacle t7" d="M95 70 Q100 100 92 130" stroke="rgba(128,222,234,0.7)" stroke-width="3" fill="none" stroke-linecap="round"/>
            </g>
            <!-- 发光点 -->
            <circle cx="45" cy="50" r="4" fill="#fff" opacity="0.6">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="75" cy="50" r="4" fill="#fff" opacity="0.6">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" begin="0.3s"/>
            </circle>
          </svg>
        </div>
        <h1 class="main-title" ref="mainTitleRef">生物荧光</h1>
        <p class="main-subtitle" ref="subtitleRef">BIOLUMINESCENCE OCEAN</p>
      </div>

      <!-- 中心视觉 -->
      <div class="center-visual" ref="centerRef">
        <div class="central-glow"></div>
        <div class="pulse-ring ring-1"></div>
        <div class="pulse-ring ring-2"></div>
        <div class="pulse-ring ring-3"></div>
      </div>

      <!-- 卡片网格 -->
      <div class="bio-grid" ref="gridRef">
        <article
          v-for="(item, index) in cardsData"
          :key="item.id"
          class="bio-card"
          :ref="el => cardRefs[index] = el as HTMLElement"
        >
          <div class="card-pulse"></div>
          <div class="card-particles" :ref="el => particleRefs[index] = el as HTMLElement"></div>
          <span class="card-index">{{ item.id }}</span>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-desc">{{ item.description }}</p>
          <div class="card-border"></div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const sectionRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleSectionRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)
const mainTitleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const centerRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const particleRefs = ref<HTMLElement[]>([])
const causticsRef = ref<HTMLElement | null>(null)
const jellySwarmRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const bubblesRef = ref<HTMLElement | null>(null)

const cardsData = [
  { id: '01', title: '深海水母', description: '在漆黑的深海中，这些精灵通过化学反应发出幽蓝光芒' },
  { id: '02', title: '夜光藻类', description: '当海浪拍打海岸，数十亿的藻类同时点亮，形成蓝色星河' },
  { id: '03', title: '萤火鱿鱼', description: '腕足上的发光器官如同夜空繁星，在深海中闪烁' },
  { id: '04', title: '生物警示', description: '某些生物用荧光迷惑捕食者，或吸引猎物，展现生存智慧' }
]

let cleanupFns: TweenCleanup[] = []
let anims: gsap.core.Tween[] = []
let timelines: gsap.core.Timeline[] = []

// 生成焦散纹理
const generateCaustics = () => {
  if (!causticsRef.value) return
  let html = ''
  for (let i = 0; i < 8; i++) {
    const left = 5 + Math.random() * 90
    const top = Math.random() * 40
    const size = 100 + Math.random() * 150
    html += `<div class="caustic" style="
      left: ${left}%;
      top: ${top}%;
      width: ${size}px;
      height: ${size * 0.6}px;
      animation-delay: ${Math.random() * 3}s;
    "></div>`
  }
  causticsRef.value.innerHTML = html
}

// 生成水母群
const generateJellyfish = () => {
  if (!jellySwarmRef.value) return
  let html = ''
  for (let i = 0; i < 8; i++) {
    const left = 5 + Math.random() * 90
    const top = 10 + Math.random() * 60
    const size = 30 + Math.random() * 50
    const delay = Math.random() * 5
    const dur = 8 + Math.random() * 6
    html += `<div class="jellyfish" style="
      left: ${left}%;
      top: ${top}%;
      width: ${size}px;
      height: ${size * 1.2}px;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    ">
      <div class="jelly-bell"></div>
      <div class="jelly-tentacles">
        <div class="jt" style="height: ${size * 0.8}px; animation-delay: ${delay + 0.2}s;"></div>
        <div class="jt" style="height: ${size * 1}px; animation-delay: ${delay + 0.5}s;"></div>
        <div class="jt" style="height: ${size * 0.9}px; animation-delay: ${delay + 0.8}s;"></div>
      </div>
    </div>`
  }
  jellySwarmRef.value.innerHTML = html
}

// 生成荧光粒子
const generateParticles = () => {
  if (!particlesRef.value) return
  let html = ''
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = 2 + Math.random() * 5
    const delay = Math.random() * 6
    const dur = 4 + Math.random() * 4
    const hue = 180 + Math.random() * 30
    html += `<div class="glow-particle" style="
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      background: hsl(${hue}, 100%, 70%);
      box-shadow: 0 0 ${size * 3}px hsl(${hue}, 100%, 60%);
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    "></div>`
  }
  particlesRef.value.innerHTML = html
}

// 生成气泡
const generateBubbles = () => {
  if (!bubblesRef.value) return
  let html = ''
  for (let i = 0; i < 35; i++) {
    const x = Math.random() * 100
    const size = 3 + Math.random() * 10
    const delay = Math.random() * 6
    const dur = 6 + Math.random() * 5
    html += `<div class="sea-bubble" style="
      left: ${x}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    "></div>`
  }
  bubblesRef.value.innerHTML = html
}

// 生成卡片粒子
const generateCardParticles = (container: HTMLElement | null) => {
  if (!container) return
  let html = ''
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = 1 + Math.random() * 3
    const delay = Math.random() * 3
    html += `<div class="card-dot" style="
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${delay}s;
    "></div>`
  }
  container.innerHTML = html
}

const initAnimations = () => {
  const content = contentRef.value
  if (!content) return

  // 主时间线
  const tl = gsap.timeline()

  // 内容区从下方滑入
  tl.fromTo(content,
    { y: '100%', opacity: 0, visibility: 'hidden' },
    { y: 0, opacity: 1, visibility: 'visible', duration: 1.4, ease: 'expo.out' }
  )

  // 标题区淡入上移
  if (titleSectionRef.value) {
    tl.fromTo(titleSectionRef.value,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '-=0.8'
    )
  }

  // Badge 弹入
  if (badgeRef.value) {
    tl.fromTo(badgeRef.value,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(2)' },
      '-=0.6'
    )
  }

  // 水母图标弹入
  if (iconRef.value) {
    tl.fromTo(iconRef.value,
      { scale: 0, y: -100, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.4)' },
      '-=0.5'
    )
  }

  // 主标题
  if (mainTitleRef.value) {
    tl.fromTo(mainTitleRef.value,
      { y: 100, opacity: 0, filter: 'blur(20px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
      '-=0.7'
    )
  }

  // 副标题
  if (subtitleRef.value) {
    tl.fromTo(subtitleRef.value,
      { y: 60, opacity: 0, letterSpacing: '20px' },
      { y: 0, opacity: 1, letterSpacing: '8px', duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
  }

  // 中心视觉
  if (centerRef.value) {
    tl.fromTo(centerRef.value,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.5)' },
      '-=0.8'
    )
  }

  // 脉冲环依次出现
  const rings = document.querySelectorAll('.pulse-ring')
  rings.forEach((ring, i) => {
    if (ring) {
      tl.fromTo(ring,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' },
        `-=${0.5 - i * 0.15}`
      )
    }
  })

  // 卡片依次弹入
  cardRefs.value.forEach((card, i) => {
    if (card) {
      tl.fromTo(card,
        {
          y: 120,
          opacity: 0,
          scale: 0.7,
          rotationY: 30
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: 'back.out(1.4)'
        },
        `-=${0.6 - i * 0.1}`
      )
    }
  })

  timelines.push(tl)

  // ScrollTrigger - 向上滑出
  const scrollTriggerInstance = ScrollTrigger.create({
    trigger: content,
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1.5,
    onUpdate: (self) => {
      const p = self.progress
      gsap.set(content, {
        y: -250 * p,
        opacity: Math.max(0, 1 - p * 2.5),
        scale: 1 - p * 0.15,
        visibility: p < 1 ? 'visible' : 'hidden'
      })

      if (centerRef.value) {
        gsap.set(centerRef.value, {
          scale: 1 - p * 0.5,
          opacity: 1 - p * 1.5,
          rotation: 180 * p
        })
      }

      if (iconRef.value) {
        gsap.set(iconRef.value, {
          y: -100 * p,
          scale: 1 - p * 0.4,
          opacity: 1 - p * 2
        })
      }
    }
  })

  cleanupFns.push(() => scrollTriggerInstance.kill())

  // 持续动画

  // 中心光球脉动
  if (centerRef.value) {
    const centralPulse = gsap.timeline({ repeat: -1, yoyo: true })
    centralPulse
      .to('.central-glow', {
        scale: 1.4,
        filter: 'brightness(1.6)',
        duration: 2,
        ease: 'sine.inOut'
      })
      .to('.pulse-ring', {
        scale: 1.2,
        opacity: 0.6,
        duration: 2,
        ease: 'sine.inOut'
      }, '<')
    anims.push(centralPulse)
  }

  // 脉冲环旋转
  const pulseRings = document.querySelectorAll('.pulse-ring')
  pulseRings.forEach((ring, i) => {
    const dir = i % 2 === 0 ? 360 : -360
    const rotAnim = gsap.to(ring, {
      rotation: dir,
      duration: 15 + i * 5,
      repeat: -1,
      ease: 'none'
    })
    anims.push(rotAnim)
  })

  // 荧光粒子漂浮
  const glowParticles = particlesRef.value?.querySelectorAll('.glow-particle')
  glowParticles?.forEach((p, i) => {
    const floatAnim = gsap.to(p, {
      y: -40 - Math.random() * 60,
      x: (Math.random() - 0.5) * 50,
      scale: 0.3 + Math.random() * 0.7,
      opacity: 0.2 + Math.random() * 0.6,
      duration: 5 + Math.random() * 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.1
    })
    if (floatAnim) anims.push(floatAnim)
  })

  // 气泡上升
  const bubbles = bubblesRef.value?.querySelectorAll('.sea-bubble')
  bubbles?.forEach((b, i) => {
    const riseAnim = gsap.to(b, {
      y: -window.innerHeight,
      x: (Math.random() - 0.5) * 40,
      opacity: 0,
      duration: 8 + Math.random() * 6,
      repeat: -1,
      ease: 'power0.none',
      delay: i * 0.15
    })
    if (riseAnim) anims.push(riseAnim)
  })

  // 水母漂浮
  const jellyfish = jellySwarmRef.value?.querySelectorAll('.jellyfish')
  jellyfish?.forEach((j, i) => {
    const jellyAnim = gsap.to(j, {
      y: -30 - Math.random() * 40,
      x: (Math.random() - 0.5) * 30,
      scale: 0.8 + Math.random() * 0.4,
      duration: 10 + Math.random() * 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.8
    })
    if (jellyAnim) anims.push(jellyAnim)
  })

  // 水母触须摆动
  const tentacles = document.querySelectorAll('.tentacle')
  tentacles.forEach((t, i) => {
    gsap.to(t, {
      attr: {
        d: `M${30 + i * 15} ${70 + Math.floor(i / 4) * 5} Q${25 + i * 15} ${100 + Math.floor(i / 2) * 10} ${30 + i * 15} ${135}`
      },
      duration: 2 + i * 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })
}

onMounted(() => {
  generateCaustics()
  generateJellyfish()
  generateParticles()
  generateBubbles()

  // 延迟生成卡片粒子，确保 DOM 已渲染
  setTimeout(() => {
    particleRefs.value.forEach(p => generateCardParticles(p))
    initAnimations()
  }, 100)
})

onBeforeUnmount(() => {
  cleanupFns.forEach(fn => fn())
  anims.forEach(a => a.kill())
  timelines.forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
.bio-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg,
    #0a1628 0%,
    #0d2137 30%,
    #0a1a2e 60%,
    #071018 100%
  );
}

// 深海背景
.deep-sea {
  position: absolute;
  inset: 0;
  z-index: 1;

  .sea-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 0%, rgba(0, 150, 200, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 20%, rgba(0, 100, 150, 0.15) 0%, transparent 40%),
      linear-gradient(180deg, #0d2845 0%, #0a1f38 50%, #071525 100%);
  }
}

// 焦散纹理
.caustics {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  pointer-events: none;
  overflow: hidden;

  .caustic {
    position: absolute;
    background: radial-gradient(ellipse, rgba(125, 249, 255, 0.08) 0%, transparent 70%);
    filter: blur(20px);
    animation: causticMove 8s ease-in-out infinite;

    @for $i from 1 through 8 {
      &:nth-child(#{$i}) {
        animation-duration: #{10 + $i}s;
      }
    }
  }
}

@keyframes causticMove {
  0%, 100% { transform: translateX(0) scale(1); opacity: 0.5; }
  50% { transform: translateX(30px) scale(1.2); opacity: 0.8; }
}

// 光波
.light-waves {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;

  .wave {
    position: absolute;
    left: -100%;
    width: 300%;
    height: 200px;
    background: linear-gradient(90deg,
      transparent,
      rgba(125, 249, 255, 0.05),
      rgba(0, 188, 212, 0.08),
      rgba(125, 249, 255, 0.05),
      transparent
    );
    transform-origin: center;

    &.wave-1 {
      top: 5%;
      animation: waveFlow 12s linear infinite;
    }

    &.wave-2 {
      top: 10%;
      animation: waveFlow 15s linear infinite 2s;
      opacity: 0.7;
    }

    &.wave-3 {
      top: 15%;
      animation: waveFlow 18s linear infinite 4s;
      opacity: 0.5;
    }
  }
}

@keyframes waveFlow {
  0% { transform: translateX(0) rotate(3deg); }
  100% { transform: translateX(33%) rotate(3deg); }
}

// 水母群
.jellyfish-swarm {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;

  .jellyfish {
    position: absolute;
    animation: jellyFloat ease-in-out infinite;

    .jelly-bell {
      width: 100%;
      height: 60%;
      background: radial-gradient(ellipse at 50% 30%,
        rgba(125, 249, 255, 0.6) 0%,
        rgba(0, 188, 212, 0.4) 50%,
        rgba(0, 150, 180, 0.2) 100%
      );
      border-radius: 50% 50% 40% 40%;
      box-shadow: 0 0 30px rgba(125, 249, 255, 0.4);
    }

    .jelly-tentacles {
      display: flex;
      justify-content: space-around;
      padding: 0 15%;

      .jt {
        width: 3px;
        background: linear-gradient(180deg,
          rgba(125, 249, 255, 0.5),
          rgba(0, 188, 212, 0.2),
          transparent
        );
        border-radius: 0 0 50% 50%;
        animation: tentacleWave ease-in-out infinite;
      }
    }
  }
}

@keyframes jellyFloat {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-25px) rotate(3deg); }
}

@keyframes tentacleWave {
  0%, 100% { transform: skewX(-5deg); }
  50% { transform: skewX(5deg); }
}

// 荧光粒子
.glow-particles {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;

  .glow-particle {
    position: absolute;
    border-radius: 50%;
    animation: particleGlow ease-in-out infinite;
  }
}

@keyframes particleGlow {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.3); }
}

// 气泡
.rising-bubbles {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;

  .sea-bubble {
    position: absolute;
    bottom: -20px;
    border: 1px solid rgba(125, 249, 255, 0.4);
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: bubbleRise linear infinite;
  }
}

@keyframes bubbleRise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.4; }
  100% { transform: translateY(-110vh) translateX(30px); opacity: 0; }
}

// 沙床
.sandy-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 15%;
  background: linear-gradient(180deg,
    transparent,
    rgba(30, 60, 80, 0.3) 30%,
    rgba(20, 40, 55, 0.5)
  );
  z-index: 6;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 80%, rgba(60, 100, 120, 0.2) 0%, transparent 40%),
      radial-gradient(ellipse at 80% 90%, rgba(50, 90, 110, 0.15) 0%, transparent 35%);
  }
}

// 主内容
.bio-content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

// 标题区
.bio-title-section {
  text-align: center;
  margin-bottom: 30px;

  .title-badge {
    display: inline-block;
    padding: 8px 22px;
    background: linear-gradient(135deg, rgba(0, 188, 212, 0.25), rgba(125, 249, 255, 0.2));
    border: 1px solid rgba(125, 249, 255, 0.5);
    border-radius: 30px;
    font-size: 14px;
    font-weight: 700;
    color: #7df9ff;
    letter-spacing: 3px;
    margin-bottom: 20px;
    text-shadow: 0 0 20px rgba(125, 249, 255, 0.8);
  }

  .title-icon {
    width: 120px;
    height: 140px;
    margin: 0 auto 20px;

    .jelly-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 35px rgba(125, 249, 255, 0.7));
    }

    .tentacles {
      .tentacle {
        transition: d 0.5s ease;
      }
    }
  }

  .main-title {
    font-size: 58px;
    font-weight: 800;
    background: linear-gradient(135deg, #fff 0%, #7df9ff 40%, #00bcd4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 14px;
    letter-spacing: 8px;
    text-shadow: 0 0 60px rgba(125, 249, 255, 0.5);
  }

  .main-subtitle {
    font-size: 14px;
    color: #80deea;
    letter-spacing: 8px;
    text-transform: uppercase;
    margin: 0;
  }
}

// 中心视觉
.center-visual {
  position: relative;
  width: 160px;
  height: 160px;
  margin-bottom: 35px;

  .central-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: radial-gradient(circle,
      #fff 0%,
      #7df9ff 30%,
      #00bcd4 70%,
      transparent 100%
    );
    border-radius: 50%;
    box-shadow:
      0 0 50px 20px rgba(125, 249, 255, 0.6),
      0 0 100px 40px rgba(0, 188, 212, 0.3);
  }

  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    border: 2px solid transparent;
    transform: translate(-50%, -50%);

    &.ring-1 {
      width: 100px;
      height: 100px;
      border-top-color: rgba(125, 249, 255, 0.8);
      border-right-color: rgba(0, 188, 212, 0.5);
    }

    &.ring-2 {
      width: 130px;
      height: 130px;
      border-width: 1.5px;
      border-bottom-color: rgba(0, 150, 180, 0.6);
      border-left-color: rgba(125, 249, 255, 0.3);
    }

    &.ring-3 {
      width: 160px;
      height: 160px;
      border-width: 1px;
      border-top-color: rgba(144, 224, 239, 0.4);
    }
  }
}

// 卡片网格
.bio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 920px;
  width: 100%;
}

.bio-card {
  position: relative;
  background: linear-gradient(145deg,
    rgba(10, 30, 50, 0.92),
    rgba(15, 45, 70, 0.88)
  );
  border: 1px solid rgba(125, 249, 255, 0.25);
  border-radius: 24px;
  padding: 32px;
  overflow: hidden;
  cursor: pointer;
  backdrop-filter: blur(20px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  perspective: 1000px;

  .card-pulse {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%,
      rgba(125, 249, 255, 0.12) 0%,
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .card-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;

    .card-dot {
      position: absolute;
      background: #7df9ff;
      border-radius: 50%;
      animation: dotTwinkle ease-in-out infinite;
    }
  }

  @keyframes dotTwinkle {
    0%, 100% { opacity: 0.1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.5); }
  }

  &:hover {
    transform: translateY(-12px) rotateX(3deg) rotateY(-2deg);
    border-color: rgba(125, 249, 255, 0.7);
    box-shadow:
      0 30px 60px rgba(0, 40, 60, 0.5),
      0 0 60px rgba(125, 249, 255, 0.25),
      inset 0 0 40px rgba(125, 249, 255, 0.05);

    .card-pulse { opacity: 1; }
    .card-index {
      transform: scale(1.2) translateZ(20px);
      text-shadow: 0 0 35px rgba(125, 249, 255, 1);
    }
    .card-title {
      transform: translateZ(15px);
      color: #e0f7fa;
    }
  }

  .card-index {
    font-size: 40px;
    font-weight: 800;
    background: linear-gradient(135deg, #7df9ff, #00bcd4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 14px;
    transition: all 0.4s ease;
  }

  .card-title {
    font-size: 24px;
    font-weight: 600;
    color: #b2ebf2;
    margin: 0 0 12px;
    transition: all 0.4s ease;
  }

  .card-desc {
    font-size: 14px;
    color: #80deea;
    line-height: 1.8;
    margin: 0;
  }

  .card-border {
    position: absolute;
    inset: 0;
    border-radius: 24px;
    background: linear-gradient(145deg,
      rgba(125, 249, 255, 0.2),
      transparent 50%,
      rgba(0, 188, 212, 0.1)
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
}
</style>
