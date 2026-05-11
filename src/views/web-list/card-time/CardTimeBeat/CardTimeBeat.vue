<template>
  <div ref="containerRef" class="card-time-beat">
    <!-- 中心光晕 -->
    <div ref="centerGlowRef" class="center-glow"></div>

    <!-- 脉冲波纹 -->
    <div ref="pulseRing1Ref" class="pulse-ring"></div>
    <div ref="pulseRing2Ref" class="pulse-ring"></div>

    <!-- 粒子容器 -->
    <div ref="particlesRef" class="beat-particles"></div>

    <!-- 标题 -->
    <div ref="headerRef" class="beat-header">
      <h2 class="beat-title">Pulse Grid</h2>
      <p class="beat-subtitle">Neon Beat · 脉冲扩散</p>
    </div>

    <!-- 3x3 网格 -->
    <div ref="gridRef" class="beat-grid">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :ref="el => setCardRef(el, index)"
        class="beat-card"
        :class="{ core: index === 4 }"
      >
        <span class="card-icon">{{ card.icon }}</span>
        <span class="card-label">{{ card.label }}</span>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div ref="controlsRef" class="beat-controls">
      <button ref="replayBtnRef" class="beat-btn" @click="replayAnimation">
        重播脉冲
      </button>
      <button ref="loopBtnRef" class="beat-btn" @click="toggleLoop">
        {{ isLooping ? '停止循环' : '开启循环' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const controlsRef = ref<HTMLElement | null>(null)
const centerGlowRef = ref<HTMLElement | null>(null)
const pulseRing1Ref = ref<HTMLElement | null>(null)
const pulseRing2Ref = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const replayBtnRef = ref<HTMLElement | null>(null)
const loopBtnRef = ref<HTMLElement | null>(null)

const cardRefs: HTMLElement[] = []
const setCardRef = (el: any, index: number) => {
  if (el) cardRefs[index] = el as HTMLElement
}

const isLooping = ref(false)
let masterTL: gsap.core.Timeline | null = null
let loopTL: gsap.core.Timeline | null = null
const cleanupFns: TweenCleanup[] = []

const cards = [
  { icon: '🎵', label: '节奏' },
  { icon: '🎹', label: '旋律' },
  { icon: '🎸', label: '和声' },
  { icon: '🥁', label: '鼓点' },
  { icon: '💫', label: '核心' },
  { icon: '🎤', label: '人声' },
  { icon: '🎷', label: '爵士' },
  { icon: '🎻', label: '古典' },
  { icon: '🎧', label: '电子' },
]

const initParticles = () => {
  if (!particlesRef.value) return
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.className = 'beat-particle'
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.background = Math.random() > 0.5 ? '#ff4da6' : '#6c63ff'
    particle.style.width = `${Math.random() * 4 + 2}px`
    particle.style.height = particle.style.width
    particlesRef.value.appendChild(particle)
    cleanupFns.push(
      gsap.to(particle, {
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 2 + 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }) as unknown as TweenCleanup
    )
  }
}

const createPulseAnimation = () => {
  if (!gridRef.value) return

  // 设置初始状态
  gsap.set(cardRefs, {
    scale: 0.85,
    opacity: 0,
    borderColor: '#2d2d4a',
    boxShadow: '0 0 0px transparent',
  })

  if (headerRef.value) {
    gsap.set(headerRef.value, { y: 50, opacity: 0 })
  }
  if (controlsRef.value) {
    gsap.set(controlsRef.value, { y: 30, opacity: 0 })
  }

  // 中心光晕
  if (centerGlowRef.value) {
    gsap.set(centerGlowRef.value, { scale: 0, opacity: 0 })
  }

  // 脉冲波纹
  if (pulseRing1Ref.value) {
    gsap.set(pulseRing1Ref.value, { scale: 0, opacity: 0 })
  }
  if (pulseRing2Ref.value) {
    gsap.set(pulseRing2Ref.value, { scale: 0, opacity: 0 })
  }

  // 使用 ScrollTrigger 触发动画
  const scrollTrigger = ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 70%',
    onEnter: () => {
      // 标题入场
      gsap.to(headerRef.value, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      })

      // 中心光晕爆发
      if (centerGlowRef.value) {
        gsap.to(centerGlowRef.value, {
          scale: 2,
          opacity: 0.8,
          duration: 0.4,
          ease: 'power2.out',
        })
      }

      // 脉冲波纹
      if (pulseRing1Ref.value) {
        gsap.to(pulseRing1Ref.value, {
          scale: 4,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 0.1,
        })
      }
      if (pulseRing2Ref.value) {
        gsap.to(pulseRing2Ref.value, {
          scale: 3,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.3,
        })
      }

      // 脉冲动画 - 根据曼哈顿距离依次触发
      const pulseColors = ['#ff4da6', '#6c63ff', '#00d4ff', '#ff9f43', '#ee5a24']
      
      cardRefs.forEach((card, i) => {
        const row = Math.floor(i / 3)
        const col = i % 3
        const centerRow = 1
        const centerCol = 1
        const dist = Math.abs(row - centerRow) + Math.abs(col - centerCol)
        const delay = 0.2 + dist * 0.12

        const pulseColor = pulseColors[dist % pulseColors.length]

        // 卡片入场
        gsap.to(card, {
          scale: 0.95,
          opacity: 0.7,
          duration: 0.4,
          delay,
          ease: 'back.out(1.7)',
        })

        // 脉冲发光
        gsap.to(card, {
          scale: 1.15,
          borderColor: pulseColor,
          boxShadow: `0 0 35px ${pulseColor}`,
          duration: 0.25,
          delay: delay + 0.4,
          ease: 'power2.out',
        })

        // 回归
        gsap.to(card, {
          scale: 0.95,
          borderColor: '#6c63ff',
          boxShadow: '0 0 12px rgba(108, 99, 255, 0.5)',
          duration: 0.3,
          delay: delay + 0.65,
          ease: 'power2.out',
        })

        // 最终状态
        gsap.to(card, {
          scale: 0.92,
          borderColor: '#2d2d4a',
          boxShadow: '0 0 0px transparent',
          duration: 0.2,
          delay: delay + 0.95,
          ease: 'power2.in',
        })
      })

      // 控制按钮入场
      gsap.to(controlsRef.value, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: 1.5,
        ease: 'power2.out',
      })

      // 中心光晕消散
      if (centerGlowRef.value) {
        gsap.to(centerGlowRef.value, {
          scale: 0.5,
          opacity: 0.3,
          duration: 0.5,
          delay: 1.5,
        })
      }
    },
  })

  cleanupFns.push({
    kill: () => scrollTrigger.kill(),
  })
}

const replayAnimation = () => {
  // 重置状态
  gsap.set(cardRefs, {
    scale: 0.85,
    opacity: 0,
    borderColor: '#2d2d4a',
    boxShadow: '0 0 0px transparent',
  })

  if (centerGlowRef.value) {
    gsap.set(centerGlowRef.value, { scale: 0, opacity: 0 })
  }

  // 重新触发动画
  setTimeout(() => {
    // 中心光晕爆发
    if (centerGlowRef.value) {
      gsap.to(centerGlowRef.value, {
        scale: 2,
        opacity: 0.8,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    // 脉冲波纹
    if (pulseRing1Ref.value) {
      gsap.set(pulseRing1Ref.value, { scale: 0, opacity: 0 })
      gsap.to(pulseRing1Ref.value, {
        scale: 4,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.1,
      })
    }
    if (pulseRing2Ref.value) {
      gsap.set(pulseRing2Ref.value, { scale: 0, opacity: 0 })
      gsap.to(pulseRing2Ref.value, {
        scale: 3,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.3,
      })
    }

    // 脉冲动画
    const pulseColors = ['#ff4da6', '#6c63ff', '#00d4ff', '#ff9f43', '#ee5a24']
    
    cardRefs.forEach((card, i) => {
      const row = Math.floor(i / 3)
      const col = i % 3
      const dist = Math.abs(row - 1) + Math.abs(col - 1)
      const delay = 0.2 + dist * 0.12

      const pulseColor = pulseColors[dist % pulseColors.length]

      gsap.to(card, {
        scale: 0.95,
        opacity: 0.7,
        duration: 0.4,
        delay,
        ease: 'back.out(1.7)',
      })

      gsap.to(card, {
        scale: 1.15,
        borderColor: pulseColor,
        boxShadow: `0 0 35px ${pulseColor}`,
        duration: 0.25,
        delay: delay + 0.4,
        ease: 'power2.out',
      })

      gsap.to(card, {
        scale: 0.95,
        borderColor: '#6c63ff',
        boxShadow: '0 0 12px rgba(108, 99, 255, 0.5)',
        duration: 0.3,
        delay: delay + 0.65,
        ease: 'power2.out',
      })

      gsap.to(card, {
        scale: 0.92,
        borderColor: '#2d2d4a',
        boxShadow: '0 0 0px transparent',
        duration: 0.2,
        delay: delay + 0.95,
        ease: 'power2.in',
      })
    })

    if (centerGlowRef.value) {
      gsap.to(centerGlowRef.value, {
        scale: 0.5,
        opacity: 0.3,
        duration: 0.5,
        delay: 1.5,
      })
    }
  }, 50)
}

const toggleLoop = () => {
  isLooping.value = !isLooping.value

  if (isLooping.value) {
    loopTL = gsap.timeline({ repeat: -1 })
    cleanupFns.push({
      kill: () => loopTL?.kill(),
    })

    // 持续循环脉冲
    cardRefs.forEach((card, i) => {
      const row = Math.floor(i / 3)
      const col = i % 3
      const dist = Math.abs(row - 1) + Math.abs(col - 1)
      const delay = dist * 0.15

      loopTL!.to(card, {
        scale: 1.1,
        borderColor: '#ff4da6',
        boxShadow: '0 0 25px rgba(255, 77, 166, 0.7)',
        duration: 0.3,
        ease: 'power2.out',
      }, delay)

      loopTL!.to(card, {
        scale: 0.95,
        borderColor: '#6c63ff',
        boxShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
        duration: 0.4,
        ease: 'power2.inOut',
      }, `+=0.1`)
    })
  } else {
    loopTL?.kill()
    loopTL = null

    // 回归初始
    gsap.to(cardRefs, {
      scale: 0.95,
      opacity: 0.85,
      borderColor: '#2d2d4a',
      boxShadow: '0 0 0px transparent',
      duration: 0.4,
    })
  }
}

onMounted(() => {
  initParticles()
  createPulseAnimation()

  // 按钮入场
  gsap.from(controlsRef.value, {
    y: 20,
    opacity: 0,
    duration: 0.5,
    delay: 1.5,
  })

  // 按钮 hover 效果
  if (replayBtnRef.value) {
    replayBtnRef.value.addEventListener('mouseenter', () => {
      gsap.to(replayBtnRef.value, {
        scale: 1.05,
        duration: 0.2,
      })
    })
    replayBtnRef.value.addEventListener('mouseleave', () => {
      gsap.to(replayBtnRef.value, {
        scale: 1,
        duration: 0.2,
      })
    })
  }

  if (loopBtnRef.value) {
    loopBtnRef.value.addEventListener('mouseenter', () => {
      gsap.to(loopBtnRef.value, {
        scale: 1.05,
        duration: 0.2,
      })
    })
    loopBtnRef.value.addEventListener('mouseleave', () => {
      gsap.to(loopBtnRef.value, {
        scale: 1,
        duration: 0.2,
      })
    })
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-time-beat {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #0d0d1a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.1) 0%, transparent 50%),
      repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(108, 99, 255, 0.03) 50px, rgba(108, 99, 255, 0.03) 51px),
      repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(108, 99, 255, 0.03) 50px, rgba(108, 99, 255, 0.03) 51px);
    pointer-events: none;
  }

  .beat-header {
    text-align: center;
    margin-bottom: 50px;
    z-index: 2;

    .beat-title {
      font-size: 42px;
      font-weight: 900;
      color: #fff;
      letter-spacing: 8px;
      text-transform: uppercase;
      background: linear-gradient(135deg, #6c63ff, #ff4da6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 12px;
    }

    .beat-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 4px;
      text-transform: uppercase;
    }
  }

  .beat-grid {
    display: grid;
    grid-template-columns: repeat(3, 140px);
    gap: 20px;
    z-index: 2;
  }

  .beat-card {
    height: 140px;
    background: #1a1a2e;
    border: 2px solid #2d2d4a;
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    will-change: transform, opacity, border-color, box-shadow;
    transition: border-color 0.3s;

    &.core {
      background: rgba(108, 99, 255, 0.15);
      border-color: #6c63ff;
    }

    .card-icon {
      font-size: 28px;
      margin-bottom: 6px;
    }

    .card-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }

  .beat-controls {
    margin-top: 50px;
    display: flex;
    gap: 20px;
    z-index: 2;

    .beat-btn {
      padding: 12px 28px;
      background: transparent;
      border: 1px solid rgba(108, 99, 255, 0.4);
      border-radius: 30px;
      color: #6c63ff;
      font-size: 13px;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: rgba(108, 99, 255, 0.15);
        border-color: #6c63ff;
        box-shadow: 0 0 20px rgba(108, 99, 255, 0.3);
      }
    }
  }

  .pulse-ring {
    position: absolute;
    width: 200px;
    height: 200px;
    border: 2px solid #ff4da6;
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
    z-index: 1;
  }

  .center-glow {
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 77, 166, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
  }

  .beat-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #ff4da6;
    border-radius: 50%;
    opacity: 0.3;
    pointer-events: none;
  }
}
</style>
