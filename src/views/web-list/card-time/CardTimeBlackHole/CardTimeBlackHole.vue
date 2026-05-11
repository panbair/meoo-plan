<template>
  <section ref="containerRef" class="card-time-blackhole">
    <!-- 黑洞背景 -->
    <div ref="blackholeBgRef" class="blackhole-bg">
      <div ref="eventHorizonRef" class="event-horizon"></div>
      <div ref="accretionDiskRef" class="accretion-disk"></div>
      <div ref="singularityRef" class="singularity"></div>
      <div class="gravitational-waves">
        <span v-for="i in 12" :key="i" class="wave-ring" :style="getWaveStyle(i)"></span>
      </div>
      <div class="space-dust">
        <span v-for="i in 50" :key="i" class="dust-particle" :style="getDustStyle(i)"></span>
      </div>
    </div>

    <!-- 主标题 -->
    <div ref="headerRef" class="blackhole-header">
      <div ref="badgeRef" class="blackhole-badge">
        <span class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
          </svg>
        </span>
        <span class="badge-text">GRAVITATIONAL ANOMALY</span>
      </div>
      <h1 ref="titleRef" class="blackhole-title">BLACK HOLE</h1>
      <p ref="subtitleRef" class="blackhole-subtitle">
        Witness the cosmic power of gravitational distortion
      </p>
    </div>

    <!-- 引力扭曲卡片容器 -->
    <div ref="cardsContainerRef" class="cards-container">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :ref="el => cardRefs[index] = el as HTMLElement"
        class="gravity-card"
        :data-index="index"
      >
        <div class="card-warp-field"></div>
        <div class="card-inner">
          <div class="card-horizon">
            <div class="horizon-ring ring-1"></div>
            <div class="horizon-ring ring-2"></div>
            <div class="horizon-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path v-if="index % 4 === 0" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                <path v-else-if="index % 4 === 1" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path v-else-if="index % 4 === 2" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v8l6 3"/>
                <path v-else d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v4l3 3"/>
              </svg>
            </div>
          </div>
          <div class="card-body">
            <span class="card-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
          </div>
          <div class="card-footer">
            <span class="card-tag">{{ card.tag }}</span>
            <div class="card-mass">
              <span class="mass-icon">⚫</span>
              <span class="mass-value">{{ card.mass }}</span>
            </div>
          </div>
        </div>
        <div class="card-gravitational-lens"></div>
      </div>
    </div>

    <!-- 底部能量条 -->
    <div ref="footerRef" class="blackhole-footer">
      <div ref="energyBarRef" class="energy-bar">
        <div class="energy-fill"></div>
      </div>
      <span ref="footerTextRef" class="footer-text">SINGULARITY POINT</span>
      <div class="energy-bar">
        <div class="energy-fill"></div>
      </div>
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
const blackholeBgRef = ref<HTMLElement | null>(null)
const eventHorizonRef = ref<HTMLElement | null>(null)
const accretionDiskRef = ref<HTMLElement | null>(null)
const singularityRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const footerTextRef = ref<HTMLElement | null>(null)
const energyBarRef = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])

const cards = [
  { title: 'Event Horizon', desc: 'Point of no return beyond which nothing escapes', tag: 'Boundary', mass: '∞ M☉' },
  { title: 'Singularity', desc: 'Infinitely dense point of collapsed spacetime', tag: 'Core', mass: '10⁹ M☉' },
  { title: 'Accretion Disk', desc: 'Superheated matter spiraling into the void', tag: 'Matter', mass: '0.5 M☉' },
  { title: 'Gravitational Lens', desc: 'Light bent by extreme spacetime curvature', tag: 'Optical', mass: '∞' },
  { title: 'Relativistic Jet', desc: 'High-energy plasma ejected at light speed', tag: 'Energy', mass: '10⁶ M☉' },
  { title: 'Hawking Radiation', desc: 'Theoretical quantum emission from the edge', tag: 'Quantum', mass: 'P' }
]

const cleanupFns: TweenCleanup[] = []

const getWaveStyle = (index: number) => ({
  width: `${150 + index * 80}px`,
  height: `${150 + index * 80}px`,
  animationDelay: `${index * 0.3}s`,
  borderColor: `rgba(123, 31, 162, ${0.3 - index * 0.02})`
})

const getDustStyle = (index: number) => {
  const size = Math.random() * 3 + 1
  const delay = Math.random() * 8
  const duration = Math.random() * 6 + 8
  const x = Math.random() * 100
  const y = Math.random() * 100
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

onMounted(() => {
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  if (!allCards.length) return

  const cardInners = allCards.map(card => card.querySelector('.card-inner') as HTMLElement)
  const cardHorizons = allCards.map(card => card.querySelector('.card-horizon') as HTMLElement)
  const horizonCores = allCards.map(card => card.querySelector('.horizon-core') as HTMLElement)
  const gravitationalLens = allCards.map(card => card.querySelector('.card-gravitational-lens') as HTMLElement)

  // 1. 初始化状态：所有卡片被黑洞引力吸附在中心奇点
  gsap.set(allCards, {
    xPercent: 50,
    yPercent: 50,
    scale: 0,
    z: -800,
    rotationX: () => gsap.utils.random(-180, 180),
    rotationY: () => gsap.utils.random(-180, 180),
    rotationZ: () => gsap.utils.random(-360, 360),
    opacity: 0,
    filter: 'blur(30px) brightness(0)',
    transformOrigin: 'center center',
    force3D: true
  })

  gsap.set(cardInners, {
    opacity: 0,
    scale: 0.5
  })

  gsap.set(cardHorizons, {
    rotation: 0,
    scale: 0
  })

  gsap.set(horizonCores, {
    opacity: 0,
    scale: 0
  })

  gsap.set(gravitationalLens, {
    opacity: 0,
    scale: 0
  })

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 0,
    y: -80,
    filter: 'blur(20px)'
  })

  gsap.set(footerTextRef.value, {
    opacity: 0,
    scale: 0
  })

  // 背景元素初始化
  gsap.set(eventHorizonRef.value, {
    scale: 0,
    rotation: 0,
    opacity: 0
  })

  gsap.set(accretionDiskRef.value, {
    rotation: 0,
    opacity: 0
  })

  gsap.set(singularityRef.value, {
    scale: 0,
    opacity: 0
  })

  // 2. 入场动画：标题和背景
  const introTl = gsap.timeline({ paused: true })

  introTl.to(eventHorizonRef.value, {
    scale: 1,
    opacity: 1,
    rotation: 360,
    duration: 3,
    ease: 'power2.inOut'
  }, 0)

  introTl.to(accretionDiskRef.value, {
    opacity: 0.8,
    rotation: 360,
    duration: 10,
    ease: 'none',
    repeat: -1
  }, 0)

  introTl.to(singularityRef.value, {
    scale: 1,
    opacity: 1,
    duration: 2,
    ease: 'elastic.out(1, 0.5)'
  }, 0.5)

  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out'
  }, 0.3)

  introTl.to(footerTextRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: 'back.out(1.5)'
  }, 0.8)

  introTl.play()

  // 3. 滚动驱动时间线：挣脱黑洞引力 → 爆炸扩散
  const gravityTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 75%',
      end: 'top 25%',
      scrub: 1.2,
      toggleActions: 'play reverse play reverse',
      immediateRender: false
    }
  })

  // 核心震撼动画：挣脱黑洞 → 爆炸扩散
  gravityTl.to(allCards, {
    xPercent: 0,
    yPercent: 0,
    z: 0,
    scale: 1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    opacity: 1,
    filter: 'blur(0px) brightness(1.4) drop-shadow(0 0 15px rgba(123, 31, 162, 0.6))',
    duration: 2,
    stagger: {
      each: 0.05,
      from: 'random',
      amount: 1.2
    },
    ease: 'elastic.out(1.2, 0.8)',
    transformOrigin: 'center'
  })

  gravityTl.to(cardInners, {
    opacity: 1,
    scale: 1,
    duration: 1.5,
    stagger: 0.03,
    ease: 'power2.out'
  }, '-=1.8')

  gravityTl.to(cardHorizons, {
    rotation: 360,
    scale: 1,
    duration: 2,
    stagger: 0.03,
    ease: 'power2.out'
  }, '-=1.5')

  gravityTl.to(horizonCores, {
    opacity: 1,
    scale: 1,
    duration: 1,
    stagger: 0.03,
    ease: 'elastic.out(1, 0.6)'
  }, '-=1.2')

  gravityTl.to(gravitationalLens, {
    opacity: 0.6,
    scale: 1.3,
    duration: 1.5,
    stagger: 0.03,
    ease: 'power2.out'
  }, '-=1')

  // 4. 卡片悬浮动画
  const floatTl = gsap.timeline({ paused: true })

  allCards.forEach((card, i) => {
    floatTl.to(card, {
      y: () => gsap.utils.random(-20, -8),
      rotationX: () => gsap.utils.random(-5, 5),
      rotationY: () => gsap.utils.random(-5, 5),
      duration: 2.5 + Math.random(),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    }, i * 0.1)
  })

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 60%',
    onEnter: () => floatTl.play(),
    onLeaveBack: () => floatTl.pause()
  })

  // 5. 吸积盘旋转动画
  const diskTl = gsap.timeline({ paused: true })
  diskTl.to(accretionDiskRef.value, {
    rotation: 360,
    duration: 20,
    ease: 'none',
    repeat: -1
  }, 0)

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => diskTl.play(),
    onLeaveBack: () => diskTl.pause()
  })

  // 6. 引力波脉冲动画
  const waveRings = containerRef.value?.querySelectorAll('.wave-ring')
  if (waveRings) {
    waveRings.forEach((ring, i) => {
      const ringPulse = gsap.timeline({ paused: true })
      ringPulse.to(ring, {
        scale: 1.5,
        opacity: 0,
        duration: 2 + Math.random(),
        ease: 'power2.out',
        repeat: -1
      }, i * 0.2)

      ScrollTrigger.create({
        trigger: containerRef.value,
        start: 'top 70%',
        onEnter: () => ringPulse.play(),
        onLeaveBack: () => ringPulse.pause()
      })
    })
  }

  // 7. 能量条动画
  const energyFill = containerRef.value?.querySelectorAll('.energy-fill')
  if (energyFill) {
    energyFill.forEach((fill) => {
      gsap.to(fill, {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true
      })
    })
  }

  // 保存清理函数
  cleanupFns.push(
    () => {
      introTl.kill()
      gravityTl.kill()
      floatTl.kill()
      diskTl.kill()
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
  gsap.killTweensOf('.wave-ring')
  gsap.killTweensOf('.energy-fill')
})
</script>

<style lang="scss" scoped>
.card-time-blackhole {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0015 0%, #1a0a2e 50%, #0a0015 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  perspective: 2000px;
}

.blackhole-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.event-horizon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    #000000 0%,
    #000000 30%,
    rgba(123, 31, 162, 0.1) 50%,
    transparent 70%
  );
  box-shadow:
    0 0 100px rgba(123, 31, 162, 0.3),
    inset 0 0 80px rgba(0, 0, 0, 1);
  border: 2px solid rgba(123, 31, 162, 0.3);
}

.accretion-disk {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%) rotateX(75deg);
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(255, 100, 50, 0.4),
    rgba(123, 31, 162, 0.6),
    rgba(255, 50, 100, 0.3),
    rgba(75, 0, 130, 0.5),
    transparent
  );
  filter: blur(3px);
  opacity: 0;
}

.singularity {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    #ffffff 0%,
    #7b1fa2 30%,
    #000000 100%
  );
  box-shadow:
    0 0 50px rgba(123, 31, 162, 0.8),
    0 0 100px rgba(123, 31, 162, 0.4);
}

.gravitational-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .wave-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid rgba(123, 31, 162, 0.3);
    animation: waveExpand linear infinite;
  }

  @keyframes waveExpand {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
}

.space-dust {
  position: absolute;
  inset: 0;

  .dust-particle {
    position: absolute;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: dustFloat linear infinite;

    @keyframes dustFloat {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0.3;
      }
      50% {
        transform: translate(30px, -50px) scale(1.5);
        opacity: 0.8;
      }
      100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.3;
      }
    }
  }
}

.blackhole-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  z-index: 10;
}

.blackhole-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(123, 31, 162, 0.9);
  letter-spacing: 4px;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 1px solid rgba(123, 31, 162, 0.4);
  border-radius: 30px;
  background: rgba(123, 31, 162, 0.08);
  backdrop-filter: blur(10px);

  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px;
      height: 14px;
      color: #7b1fa2;
    }
  }
}

.blackhole-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 72px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 14px;
  text-transform: uppercase;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #7b1fa2 30%, #e040fb 50%, #7b1fa2 70%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(123, 31, 162, 0.6);
}

.blackhole-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 3px;
  margin: 0;
  max-width: 500px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  max-width: 1100px;
  padding: 20px;
  perspective: 1500px;
  transform-style: preserve-3d;
}

.gravity-card {
  width: 240px;
  height: 340px;
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  cursor: pointer;

  &:hover {
    .card-gravitational-lens {
      opacity: 0.9 !important;
      transform: scale(1.5);
    }

    .card-inner {
      border-color: rgba(123, 31, 162, 0.6);
      box-shadow: 0 30px 60px rgba(123, 31, 162, 0.4);
    }

    .horizon-core svg {
      filter: drop-shadow(0 0 20px #7b1fa2);
    }
  }
}

.card-warp-field {
  position: absolute;
  inset: -30px;
  background: radial-gradient(
    ellipse at center,
    rgba(123, 31, 162, 0.2) 0%,
    transparent 70%
  );
  filter: blur(15px);
  border-radius: 30px;
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    145deg,
    rgba(25, 10, 40, 0.95) 0%,
    rgba(40, 20, 60, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(123, 31, 162, 0.25);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(123, 31, 162, 0.6),
      rgba(224, 64, 251, 0.4),
      transparent
    );
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(123, 31, 162, 0.3),
      transparent
    );
  }
}

.card-horizon {
  width: 100px;
  height: 100px;
  position: relative;
  margin-bottom: 20px;
  transform-style: preserve-3d;
}

.horizon-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(123, 31, 162, 0.3);

  &.ring-1 {
    inset: 0;
    animation: horizonRotate 15s linear infinite;
    border-color: rgba(224, 64, 251, 0.3);
  }

  &.ring-2 {
    inset: 20px;
    animation: horizonRotate 10s linear infinite reverse;
    border-color: rgba(123, 31, 162, 0.4);
  }

  @keyframes horizonRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
}

.horizon-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, rgba(123, 31, 162, 0.3), rgba(224, 64, 251, 0.2));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(123, 31, 162, 0.4);
  box-shadow:
    0 0 30px rgba(123, 31, 162, 0.3),
    inset 0 0 20px rgba(123, 31, 162, 0.2);

  svg {
    width: 24px;
    height: 24px;
    color: #e040fb;
    transition: filter 0.3s ease;
  }
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.card-index {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(123, 31, 162, 0.5);
  letter-spacing: 3px;
}

.card-title {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 16px;
  border-top: 1px solid rgba(123, 31, 162, 0.15);
}

.card-tag {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: #e040fb;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 4px 10px;
  background: rgba(123, 31, 162, 0.15);
  border-radius: 10px;
  border: 1px solid rgba(123, 31, 162, 0.25);
}

.card-mass {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mass-icon {
  font-size: 10px;
  color: #7b1fa2;
  animation: massPulse 2s ease-in-out infinite;

  @keyframes massPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
}

.mass-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #e040fb;
}

.card-gravitational-lens {
  position: absolute;
  inset: -10px;
  border-radius: 25px;
  background: radial-gradient(
    ellipse at center,
    rgba(123, 31, 162, 0.15) 0%,
    transparent 70%
  );
  filter: blur(10px);
  pointer-events: none;
  transition: all 0.4s ease;
}

.blackhole-footer {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  z-index: 10;
}

.energy-bar {
  width: 80px;
  height: 3px;
  background: rgba(123, 31, 162, 0.2);
  border-radius: 2px;
  overflow: hidden;

  .energy-fill {
    height: 100%;
    width: 30%;
    background: linear-gradient(90deg, #7b1fa2, #e040fb);
    border-radius: 2px;
  }
}

.footer-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(123, 31, 162, 0.6);
  letter-spacing: 4px;
  text-transform: uppercase;
}

@media (max-width: 1200px) {
  .cards-container {
    max-width: 800px;
  }

  .gravity-card {
    width: 220px;
    height: 310px;
  }

  .blackhole-title {
    font-size: 56px;
    letter-spacing: 10px;
  }
}

@media (max-width: 768px) {
  .cards-container {
    max-width: 500px;
    gap: 16px;
  }

  .gravity-card {
    width: 180px;
    height: 280px;
  }

  .card-horizon {
    width: 80px;
    height: 80px;
  }

  .blackhole-title {
    font-size: 36px;
    letter-spacing: 6px;
  }

  .blackhole-subtitle {
    font-size: 12px;
    letter-spacing: 2px;
  }
}
</style>
