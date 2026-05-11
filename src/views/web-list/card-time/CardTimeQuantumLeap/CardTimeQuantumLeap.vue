<template>
  <section ref="containerRef" class="card-time-quantum-leap">
    <!-- 背景层 -->
    <div ref="bgRef" class="quantum-bg">
      <div ref="gridRef" class="bg-grid"></div>
      <div ref="vortexRef" class="bg-vortex"></div>
      <div ref="particlesRef" class="bg-particles">
        <span v-for="i in 30" :key="i" class="particle" :style="getParticleStyle(i)"></span>
      </div>
    </div>

    <!-- 主标题 -->
    <div ref="headerRef" class="quantum-header">
      <div ref="badgeRef" class="quantum-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
        </span>
        <span class="badge-text">QUANTUM REALM</span>
      </div>
      <h1 ref="titleRef" class="quantum-title">QUANTUM LEAP</h1>
      <p ref="subtitleRef" class="quantum-subtitle">
        Enter the multidimensional space folding experience
      </p>
    </div>

    <!-- 量子面板容器 -->
    <div ref="panelsContainerRef" class="panels-container">
      <div
        v-for="(panel, index) in panels"
        :key="index"
        :ref="el => panelRefs[index] = el as HTMLElement"
        class="quantum-panel"
        :data-index="index"
      >
        <div class="panel-glow"></div>
        <div class="panel-content">
          <div class="panel-visual">
            <div class="visual-ring ring-outer"></div>
            <div class="visual-ring ring-middle"></div>
            <div class="visual-ring ring-inner"></div>
            <div class="visual-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path v-if="index % 3 === 0" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                <path v-else-if="index % 3 === 1" d="M12 2l-5.5 9h11L12 2zm0 4l3.5 6h-7L12 6z"/>
                <path v-else d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
            </div>
          </div>
          <div class="panel-body">
            <span class="panel-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="panel-title">{{ panel.title }}</h3>
            <p class="panel-desc">{{ panel.desc }}</p>
          </div>
          <div class="panel-meta">
            <span class="panel-tag">{{ panel.tag }}</span>
            <div class="panel-energy">
              <span class="energy-dot"></span>
              <span class="energy-value">{{ panel.energy }}</span>
            </div>
          </div>
        </div>
        <div class="panel-border"></div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div ref="footerRef" class="quantum-footer">
      <div ref="lineLeftRef" class="footer-line line-left"></div>
      <span ref="footerTextRef" class="footer-text">DIMENSIONAL TRAVEL</span>
      <div ref="lineRightRef" class="footer-line line-right"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const containerRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const vortexRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const panelsContainerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const lineLeftRef = ref<HTMLElement | null>(null)
const lineRightRef = ref<HTMLElement | null>(null)
const footerTextRef = ref<HTMLElement | null>(null)

const panelRefs = ref<(HTMLElement | null)[]>([])

const panels = [
  { title: 'Nexus', desc: 'Gateway between dimensional planes', tag: 'Gateway', energy: '89%' },
  { title: 'Flux', desc: 'Energy streams of pure quantum power', tag: 'Energy', energy: '94%' },
  { title: 'Prism', desc: 'Light refracted through space-time', tag: 'Prismatic', energy: '87%' },
  { title: 'Vortex', desc: 'Wormhole to infinite possibilities', tag: 'Portal', energy: '92%' },
  { title: 'Pulse', desc: 'Heartbeat of the multiverse', tag: 'Core', energy: '96%' },
  { title: 'Echo', desc: 'Resonance from parallel dimensions', tag: 'Sonic', energy: '85%' },
  { title: 'Nova', desc: 'Explosive release of dimensional energy', tag: 'Quantum', energy: '98%' },
  { title: 'Drift', desc: 'Silent navigation through dimensions', tag: 'Stealth', energy: '91%' }
]

const cleanupFns: TweenCleanup[] = []

const getParticleStyle = (index: number) => {
  const size = Math.random() * 3 + 1
  const delay = Math.random() * 5
  const duration = Math.random() * 3 + 4
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

onMounted(() => {
  const allPanels = panelRefs.value.filter(Boolean) as HTMLElement[]
  if (!allPanels.length) return

  const panelVisuals = allPanels.map(panel => panel.querySelector('.panel-visual') as HTMLElement)
  const panelCores = allPanels.map(panel => panel.querySelector('.visual-core') as HTMLElement)
  const panelGlows = allPanels.map(panel => panel.querySelector('.panel-glow') as HTMLElement)

  // 1. 初始化状态：所有面板压缩为一维线条，聚集在中心
  gsap.set(allPanels, {
    xPercent: 50,
    yPercent: 50,
    scaleX: 0.005,
    scaleY: 1,
    rotationX: () => gsap.utils.random(-180, 180),
    rotationY: () => gsap.utils.random(-180, 180),
    rotationZ: () => gsap.utils.random(-90, 90),
    opacity: 0,
    z: -800,
    filter: 'brightness(0) blur(30px)'
  })

  gsap.set(panelVisuals, {
    scale: 0,
    rotation: -180
  })

  gsap.set(panelCores, {
    scale: 0,
    opacity: 0
  })

  gsap.set(panelGlows, {
    opacity: 0,
    scale: 0
  })

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -60,
    filter: 'blur(20px)'
  })

  gsap.set([lineLeftRef.value, footerTextRef.value, lineRightRef.value], {
    opacity: 0,
    scaleX: 0
  })

  // 2. 入场动画：标题先出现
  const introTl = gsap.timeline({ paused: true })

  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  })

  introTl.to([lineLeftRef.value, footerTextRef.value, lineRightRef.value], {
    opacity: 1,
    scaleX: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.3')

  introTl.play()

  // 3. 滚动驱动时间线：量子跃迁展开效果
  const quantumTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 70%',
      end: 'top 10%',
      scrub: 1.5,
      toggleActions: 'play reverse play reverse'
    }
  })

  // 核心展开动画
  quantumTl.to(allPanels, {
    xPercent: 0,
    yPercent: 0,
    scaleX: 1,
    scaleY: 1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    opacity: 1,
    z: 0,
    filter: 'brightness(1.3) blur(0px)',
    duration: 1.8,
    stagger: {
      each: 0.06,
      from: 'random',
      amount: 1
    },
    ease: 'expo.out'
  })

  quantumTl.to(panelVisuals, {
    scale: 1,
    rotation: 0,
    duration: 1,
    stagger: 0.04,
    ease: 'back.out(1.5)'
  }, '-=1.4')

  quantumTl.to(panelCores, {
    scale: 1,
    opacity: 1,
    duration: 0.8,
    stagger: 0.04,
    ease: 'elastic.out(1, 0.5)'
  }, '-=0.8')

  quantumTl.to(panelGlows, {
    opacity: 1,
    scale: 1.2,
    duration: 1,
    stagger: 0.04,
    ease: 'power2.out'
  }, '-=0.6')

  // 4. 背景动画
  const bgTl = gsap.timeline({ paused: true })

  bgTl.to(gridRef.value, {
    scale: 1.2,
    opacity: 0.6,
    duration: 2,
    ease: 'power2.inOut'
  })

  bgTl.to(vortexRef.value, {
    rotation: 360,
    scale: 1.1,
    duration: 8,
    ease: 'none',
    repeat: -1
  }, 0)

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => bgTl.play(),
    onLeaveBack: () => bgTl.reverse()
  })

  // 5. 面板悬浮动画
  const floatTl = gsap.timeline({ paused: true })

  allPanels.forEach((panel, i) => {
    floatTl.to(panel, {
      y: () => gsap.utils.random(-15, -5),
      rotationX: () => gsap.utils.random(-3, 3),
      rotationY: () => gsap.utils.random(-3, 3),
      duration: 2 + Math.random(),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    }, i * 0.15)
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 50%',
    onEnter: () => floatTl.play(),
    onLeaveBack: () => floatTl.pause()
  })

  // 6. 能量核心脉冲
  panelCores.forEach((core, i) => {
    const pulseTl = gsap.timeline({ paused: true })
    pulseTl.to(core, {
      scale: 1.15,
      filter: 'brightness(1.4)',
      duration: 0.6 + Math.random() * 0.4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
    pulseTl.play()

    cleanupFns.push(() => pulseTl.kill())
  })

  // 保存清理函数
  cleanupFns.push(
    () => {
      introTl.kill()
      quantumTl.kill()
      bgTl.kill()
      floatTl.kill()
    }
  )
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style lang="scss" scoped>
.card-time-quantum-leap {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  perspective: 2000px;
}

.quantum-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-grid {
  position: absolute;
  inset: -50%;
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
  background-size: 80px 80px;
  transform-style: preserve-3d;
  transform: rotateX(60deg) translateZ(-200px);
}

.bg-vortex {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150vmax;
  height: 150vmax;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(0, 240, 255, 0.03),
    transparent,
    rgba(138, 43, 226, 0.03),
    transparent
  );
  border-radius: 50%;
  filter: blur(60px);
}

.bg-particles {
  position: absolute;
  inset: 0;

  .particle {
    position: absolute;
    background: rgba(0, 240, 255, 0.6);
    border-radius: 50%;
    animation: particleFloat linear infinite;

    @keyframes particleFloat {
      0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 0.3;
      }
      50% {
        transform: translateY(-30px) scale(1.5);
        opacity: 0.8;
      }
    }
  }
}

.quantum-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
  z-index: 10;
}

.quantum-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 240, 255, 0.9);
  letter-spacing: 4px;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 30px;
  background: rgba(0, 240, 255, 0.05);
  backdrop-filter: blur(10px);

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px;
      height: 14px;
      color: #00f0ff;
    }
  }
}

.quantum-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 72px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 12px;
  text-transform: uppercase;
  margin: 0;
  background: linear-gradient(135deg, #00f0ff 0%, #8a2be2 30%, #ff00ff 50%, #8a2be2 70%, #00f0ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(0, 240, 255, 0.5);
}

.quantum-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 3px;
  margin: 0;
  max-width: 500px;
}

.panels-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 1200px;
  padding: 20px;
  perspective: 1500px;
  transform-style: preserve-3d;
}

.quantum-panel {
  width: 220px;
  height: 320px;
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  cursor: pointer;

  &:hover {
    .panel-glow {
      opacity: 0.8 !important;
      transform: scale(1.5);
    }

    .panel-visual {
      transform: rotateY(5deg) rotateX(5deg);
    }

    .visual-core svg {
      filter: drop-shadow(0 0 20px currentColor);
    }
  }
}

.panel-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 240, 255, 0.3) 0%,
    rgba(138, 43, 226, 0.2) 40%,
    transparent 70%
  );
  border-radius: 30px;
  filter: blur(20px);
  z-index: -1;
  transition: all 0.5s ease;
}

.panel-content {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    145deg,
    rgba(20, 20, 50, 0.95) 0%,
    rgba(30, 30, 70, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 240, 255, 0.15);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 240, 255, 0.5),
      transparent
    );
  }
}

.panel-visual {
  width: 100px;
  height: 100px;
  position: relative;
  margin-bottom: 20px;
  transform-style: preserve-3d;
  transition: transform 0.4s ease;
}

.visual-ring {
  position: absolute;
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 50%;

  &.ring-outer {
    inset: 0;
    animation: ringRotate 12s linear infinite;
  }

  &.ring-middle {
    inset: 15px;
    animation: ringRotate 8s linear infinite reverse;
    border-color: rgba(138, 43, 226, 0.3);
  }

  &.ring-inner {
    inset: 30px;
    animation: ringRotate 5s linear infinite;
    border-color: rgba(0, 240, 255, 0.4);
  }

  @keyframes ringRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
}

.visual-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(138, 43, 226, 0.2));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.2);

  svg {
    width: 22px;
    height: 22px;
    color: #00f0ff;
    transition: filter 0.3s ease;
  }
}

.panel-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.panel-number {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 240, 255, 0.4);
  letter-spacing: 3px;
}

.panel-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.panel-desc {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin: 0;
}

.panel-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 240, 255, 0.1);
}

.panel-tag {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: #00f0ff;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 10px;
  background: rgba(0, 240, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 240, 255, 0.2);
}

.panel-energy {
  display: flex;
  align-items: center;
  gap: 6px;
}

.energy-dot {
  width: 6px;
  height: 6px;
  background: #00f0ff;
  border-radius: 50%;
  animation: energyPulse 1.5s ease-in-out infinite;

  @keyframes energyPulse {
    0%, 100% {
      opacity: 0.4;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
}

.energy-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #00f0ff;
}

.panel-border {
  position: absolute;
  inset: 0;
  border: 1px solid transparent;
  border-radius: 20px;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(0, 240, 255, 0.3),
    rgba(138, 43, 226, 0.3)
  ) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.quantum-panel:hover .panel-border {
  opacity: 1;
}

.quantum-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 40px;
  z-index: 10;
}

.footer-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 240, 255, 0.4),
    transparent
  );
}

.footer-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(0, 240, 255, 0.5);
  letter-spacing: 4px;
  text-transform: uppercase;
}

@media (max-width: 1200px) {
  .panels-container {
    max-width: 700px;
  }

  .quantum-panel {
    width: 200px;
    height: 290px;
  }

  .quantum-title {
    font-size: 56px;
    letter-spacing: 10px;
  }
}

@media (max-width: 768px) {
  .panels-container {
    max-width: 480px;
    gap: 16px;
  }

  .quantum-panel {
    width: 170px;
    height: 260px;
  }

  .panel-visual {
    width: 80px;
    height: 80px;
  }

  .quantum-title {
    font-size: 36px;
    letter-spacing: 6px;
  }

  .quantum-subtitle {
    font-size: 12px;
    letter-spacing: 2px;
  }
}
</style>
