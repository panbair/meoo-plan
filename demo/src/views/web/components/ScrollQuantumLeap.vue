<template>
  <div class="sql-quantum-leap-section-188" ref="componentRoot">
    <div class="sql-container-188">
      <h2 class="sql-title-188">量子跃迁</h2>
      <p class="sql-subtitle-188">Quantum Leap Effect</p>

      <div class="sql-quantum-stage-188">
        <canvas ref="quantumCanvas" class="sql-canvas-188"></canvas>

        <div class="sql-quantum-particles-188">
          <div
            v-for="n in 50"
            :key="n"
            class="sql-quantum-particle-188"
            :ref="el => { if (el) particleRefs[n] = el as HTMLElement }"
            :style="getParticleStyle(n)"
          ></div>
        </div>

        <div class="sql-quantum-orb-188" ref="quantumOrb">
          <div class="sql-orb-core-188"></div>
          <div class="sql-orb-shell-1-188"></div>
          <div class="sql-orb-shell-2-188"></div>
          <div class="sql-orb-shell-3-188"></div>
          <div class="sql-electron-1-188" ref="electron1"></div>
          <div class="sql-electron-2-188" ref="electron2"></div>
          <div class="sql-electron-3-188" ref="electron3"></div>
        </div>
      </div>

      <div class="sql-quantum-info-188">
        <div
          v-for="(info, index) in quantumInfo"
          :key="index"
          class="sql-info-item-188"
          :ref="el => { if (el) infoRefs[index] = el as HTMLElement }"
        >
          <div class="sql-info-icon-188">{{ info.icon }}</div>
          <div class="sql-info-content-188">
            <div class="sql-info-title-188">{{ info.title }}</div>
            <div class="sql-info-desc-188">{{ info.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const quantumCanvas = ref<HTMLCanvasElement>()
const quantumOrb = ref<HTMLElement>()
const electron1 = ref<HTMLElement>()
const electron2 = ref<HTMLElement>()
const electron3 = ref<HTMLElement>()
const particleRefs = ref<Record<number, HTMLElement>>({})
const infoRefs = ref<HTMLElement[]>([])

interface QuantumInfo {
  icon: string
  title: string
  description: string
}

const quantumInfo: QuantumInfo[] = [
  { icon: '⚛️', title: 'QUANTUM', description: 'Superposition' },
  { icon: '🌀', title: 'ENTANGLEMENT', description: 'Quantum State' },
  { icon: '✨', title: 'ENERGY', description: 'Wave Function' }
]

const getParticleStyle = (index: number) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const hue = 180 + Math.random() * 60 // 青蓝紫系
  const size = 2 + Math.random() * 3
  return {
    left: `${x}%`,
    top: `${y}%`,
    background: `hsl(${hue}, 80%, 60%)`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${Math.random() * 3}s`
  }
}

let ctx: gsap.Context
let animationFrame: number | null = null
let resizeCanvas: () => void = () => {}
let isVisible = true // 性能优化：可见性标志

// IntersectionObserver 用于性能优化
let observer: IntersectionObserver | null = null

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    // Canvas 量子波动画
    const canvas = quantumCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.7
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) return

    const waves = Array.from({ length: 3 }, (_, i) => ({
      amplitude: 30 + i * 10,
      frequency: 0.01 + i * 0.002,
      phase: i * Math.PI * 0.3,
      speed: 0.02 + i * 0.005,
      color: `hsla(${200 + i * 20}, 80%, 60%, 0.3)`
    }))

    let time = 0

    const animateQuantum = () => {
      // 性能优化：组件不可见时停止动画
      if (!isVisible) return

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
      const centerY = canvas.height / 2

      waves.forEach((wave, index) => {
        canvasCtx.beginPath()
        canvasCtx.strokeStyle = wave.color
        canvasCtx.lineWidth = 3

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = centerY + Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude
          if (x === 0) {
            canvasCtx.moveTo(x, y)
          } else {
            canvasCtx.lineTo(x, y)
          }
        }
        canvasCtx.stroke()
      })

      time += 0.016
      animationFrame = requestAnimationFrame(animateQuantum)
    }

    // 设置IntersectionObserver优化性能
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting
          if (isVisible && !animationFrame) {
            animateQuantum()
          } else if (!isVisible && animationFrame) {
            cancelAnimationFrame(animationFrame)
            animationFrame = null
          }
        })
      },
      { threshold: 0.1 }
    )

    if (componentRoot.value) {
      observer.observe(componentRoot.value)
    }

    animateQuantum()

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sql-title-188', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sql-subtitle-188', componentRoot.value)
      const orbEl = gsap.utils.toArray<HTMLElement>('.sql-quantum-orb-188', componentRoot.value)
      const orbCore = gsap.utils.toArray<HTMLElement>('.sql-orb-core-188', componentRoot.value)
      const orbShells = gsap.utils.toArray<HTMLElement>('[class^="sql-orb-shell"]', componentRoot.value)
      const electrons = gsap.utils.toArray<HTMLElement>('[class^="sql-electron"]', componentRoot.value)
      const particles = gsap.utils.toArray<HTMLElement>('.sql-quantum-particle-188', componentRoot.value)
      const infoItems = gsap.utils.toArray<HTMLElement>('.sql-info-item-188', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          filter: 'blur(10px)',
          duration: 1,
          ease: 'power3.out'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.1,
          ease: 'power3.out'
        })
      }

      // 量子球动画
      if (orbEl.length) {
        gsap.from(orbEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)'
        })
      }

      if (orbCore.length) {
        gsap.from(orbCore, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'back.out(2)'
        })

        // 核心脉动
        gsap.to(orbCore, {
          scale: 1.2,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }

      // 电子壳层动画
      if (orbShells.length) {
        gsap.from(orbShells, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.3,
          ease: 'back.out(1.7)'
        })

        // 滚动控制壳层旋转
        ScrollTrigger.create({
          trigger: componentRoot.value,
          start: 'top 70%',
          end: 'bottom 20%',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress
            const rotation = progress * 360 * 3
            gsap.set(orbShells, { rotation })
          }
        })
      }

      // 电子轨道动画
      if (electrons.length) {
        gsap.from(electrons, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.4,
          ease: 'back.out(2)'
        })

        // 电子轨道运动
        electrons.forEach((electron: HTMLElement, index: number) => {
          const speed = 1 + index * 0.5
          const radius = 80 + index * 30
          const startX = Math.cos(0) * radius
          const startY = Math.sin(0) * radius

          gsap.set(electron, {
            x: startX,
            y: startY,
            transformOrigin: `${-startX}px ${-startY}px`
          })

          gsap.to(electron, {
            rotation: 360,
            duration: 2 / speed,
            repeat: -1,
            ease: 'none'
          })
        })

        // 滚动控制电子速度
        ScrollTrigger.create({
          trigger: componentRoot.value,
          start: 'top 70%',
          end: 'bottom 20%',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress
            const timeScale = 1 + progress * 5

            electrons.forEach((electron: HTMLElement) => {
              const tweens = gsap.getTweensOf(electron)
              tweens.forEach(tween => {
                tween.timeScale(timeScale)
              })
            })
          }
        })
      }

      // 量子粒子动画
      if (particles.length) {
        gsap.from(particles, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: {
            each: 0.01,
            from: 'random'
          },
          ease: 'back.out(1.5)'
        })

        // 粒子波动
        particles.forEach((particle: HTMLElement, index: number) => {
          const duration = 3 + Math.random() * 2
          const delay = Math.random() * 2

          gsap.to(particle, {
            y: -15 + Math.random() * 30,
            x: (Math.random() - 0.5) * 20,
            scale: 0.8 + Math.random() * 0.4,
            opacity: 0.4 + Math.random() * 0.4,
            duration,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay
          })
        })
      }

      // 信息卡片动画
      if (infoItems.length) {
        gsap.from(infoItems, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 50%',
            toggleActions: 'play none none reverse'
          },
          y: 50,
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)'
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
  window.removeEventListener('resize', resizeCanvas)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped lang="scss">
.sql-quantum-leap-section-188 {
  min-height: 100vh;
  padding: 80px 20px;
  background: radial-gradient(ellipse at center, #0a1a2a 0%, #0a0a1a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sql-container-188 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.sql-title-188 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(6, 182, 212, 0.5);

  opacity: 1 !important;}

.sql-subtitle-188 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(6, 182, 212, 0.6);
  margin-bottom: 100px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sql-quantum-stage-188 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.sql-canvas-188 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.sql-quantum-particles-188 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;

  opacity: 1 !important;}

.sql-quantum-particle-188 {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

.sql-quantum-orb-188 {
  position: relative;
  width: 350px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.sql-orb-core-188 {
  position: absolute;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, #fff 0%, #06b6d4 50%, #8b5cf6 100%);
  border-radius: 50%;
  box-shadow:
    0 0 60px rgba(6, 182, 212, 0.8),
    0 0 120px rgba(139, 92, 246, 0.5),
    0 0 180px rgba(236, 72, 153, 0.3);
  z-index: 5;

  opacity: 1 !important;}

.sql-orb-shell-1-188,
.sql-orb-shell-2-188,
.sql-orb-shell-3-188 {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);

  opacity: 1 !important;}

.sql-orb-shell-1-188 {
  width: 120px;
  height: 120px;

  opacity: 1 !important;}

.sql-orb-shell-2-188 {
  width: 200px;
  height: 200px;

  opacity: 1 !important;}

.sql-orb-shell-3-188 {
  width: 300px;
  height: 300px;

  opacity: 1 !important;}

.sql-electron-1-188,
.sql-electron-2-188,
.sql-electron-3-188 {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  box-shadow:
    0 0 20px #06b6d4,
    0 0 40px #8b5cf6;
  z-index: 10;

  opacity: 1 !important;}

.sql-quantum-info-188 {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.sql-info-item-188 {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(6, 182, 212, 0.1);
  backdrop-filter: blur(10px);
  padding: 25px 35px;
  border-radius: 20px;
  border: 1px solid rgba(6, 182, 212, 0.2);

  opacity: 1 !important;}

.sql-info-icon-188 {
  font-size: 2.5rem;

  opacity: 1 !important;}

.sql-info-title-188 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.sql-info-desc-188 {
  font-size: 0.9rem;
  color: rgba(6, 182, 212, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .sql-quantum-orb-188 {
    width: 250px;
    height: 250px;
  
  opacity: 1 !important;}

  .sql-orb-core-188 {
    width: 40px;
    height: 40px;
  
  opacity: 1 !important;}

  .sql-orb-shell-1-188 {
    width: 80px;
    height: 80px;
  
  opacity: 1 !important;}

  .sql-orb-shell-2-188 {
    width: 140px;
    height: 140px;
  
  opacity: 1 !important;}

  .sql-orb-shell-3-188 {
    width: 210px;
    height: 210px;
  
  opacity: 1 !important;}

  .sql-quantum-info-188 {
    gap: 20px;
  }

  .sql-info-item-188 {
    padding: 20px 25px;
    flex-direction: column;
    text-align: center;
  
  opacity: 1 !important;}

  .sql-info-icon-188 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
