<template>
  <div class="seo-energy-orb-section-164" ref="componentRoot">
    <div class="seo-container-164">
      <h2 class="seo-title-164">能量光球</h2>
      <p class="seo-subtitle-164">Energy Orb Effect</p>

      <div class="seo-orb-stage-164">
        <canvas ref="orbCanvas" class="seo-canvas-164"></canvas>

        <div class="seo-orb-container-164">
          <div class="seo-energy-orb-164" ref="energyOrb">
            <div class="seo-orb-core-164"></div>
            <div class="seo-orb-ring-164 seo-ring-1-164"></div>
            <div class="seo-orb-ring-164 seo-ring-2-164"></div>
            <div class="seo-orb-ring-164 seo-ring-3-164"></div>
            <div class="seo-orb-glow-164"></div>
          </div>
        </div>

        <div class="seo-energy-particles-164">
          <div
            v-for="n in 30"
            :key="n"
            class="seo-particle-164"
            :ref="el => { if (el) particleRefs[n] = el as HTMLElement }"
            :style="getParticleStyle(n)"
          ></div>
        </div>
      </div>

      <div class="seo-data-display-164">
        <div
          v-for="(data, index) in dataItems"
          :key="index"
          class="seo-data-item-164"
          :ref="el => { if (el) dataRefs[index] = el as HTMLElement }"
        >
          <div class="seo-data-value-164">{{ data.value }}</div>
          <div class="seo-data-label-164">{{ data.label }}</div>
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
const orbCanvas = ref<HTMLCanvasElement>()
const energyOrb = ref<HTMLElement>()
const particleRefs = ref<Record<number, HTMLElement>>({})
const dataRefs = ref<HTMLElement[]>([])

interface DataItem {
  value: string
  label: string
}

const dataItems: DataItem[] = [
  { value: '98%', label: 'Energy' },
  { value: '100', label: 'Power' },
  { value: '∞', label: 'Force' }
]

const getParticleStyle = (index: number) => {
  const angle = (index / 30) * Math.PI * 2
  const radius = 150 + Math.random() * 50
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const hue = 40 + Math.random() * 60 // 金黄色系
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    background: `hsl(${hue}, 100%, 60%)`,
    width: `${3 + Math.random() * 4}px`,
    height: `${3 + Math.random() * 4}px`,
    animationDelay: `${Math.random() * 2}s`
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

    // Canvas 能量流动画
    const canvas = orbCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.6
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) return

    const energyLines = Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      length: 100 + i * 20,
      speed: 0.02 + i * 0.005,
      color: `hsla(${45 + i * 10}, 100%, 60%, 0.5)`
    }))

    let time = 0

    const animateEnergy = () => {
      // 性能优化：组件不可见时停止动画
      if (!isVisible) return

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      energyLines.forEach(line => {
        const startAngle = line.angle + time * line.speed
        const endAngle = startAngle + 0.3

        canvasCtx.beginPath()
        canvasCtx.strokeStyle = line.color
        canvasCtx.lineWidth = 2
        canvasCtx.arc(centerX, centerY, line.length, startAngle, endAngle)
        canvasCtx.stroke()
      })

      time += 0.016
      animationFrame = requestAnimationFrame(animateEnergy)
    }

    // 设置IntersectionObserver优化性能
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting
          if (isVisible && !animationFrame) {
            animateEnergy()
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

    animateEnergy()

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.seo-title-164', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.seo-subtitle-164', componentRoot.value)
      const orbEl = gsap.utils.toArray<HTMLElement>('.seo-energy-orb-164', componentRoot.value)
      const orbCore = gsap.utils.toArray<HTMLElement>('.seo-orb-core-164', componentRoot.value)
      const orbRings = gsap.utils.toArray<HTMLElement>('.seo-orb-ring-164', componentRoot.value)
      const orbGlow = gsap.utils.toArray<HTMLElement>('.seo-orb-glow-164', componentRoot.value)
      const particles = gsap.utils.toArray<HTMLElement>('.seo-particle-164', componentRoot.value)
      const dataItemsEl = gsap.utils.toArray<HTMLElement>('.seo-data-item-164', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          scale: 0.9,
          filter: 'blur(20px)',
          duration: 1.2,
          ease: 'power3.out'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 能量球核心动画
      if (orbEl.length) {
        gsap.from(orbEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        })
      }

      if (orbCore.length) {
        gsap.from(orbCore, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          rotation: 360,
          duration: 1.2,
          delay: 0.3,
          ease: 'back.out(2)'
        })
      }

      // 环的动画
      if (orbRings.length) {
        gsap.from(orbRings, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          rotation: (i) => (i % 2 === 0 ? 180 : -180),
          duration: 1,
          stagger: 0.15,
          delay: 0.4,
          ease: 'back.out(1.7)'
        })

        // 滚动时环的旋转
        orbRings.forEach((ring: HTMLElement, index: number) => {
          const speed = index % 2 === 0 ? 1 : -1
          gsap.to(ring, {
            rotation: `+=${360 * speed}`,
            duration: 4 + index,
            repeat: -1,
            ease: 'none'
          })
        })

        // 滚动控制环的旋转速度和缩放
        ScrollTrigger.create({
          trigger: componentRoot.value,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress
            orbRings.forEach((ring: HTMLElement, index: number) => {
              const tweens = gsap.getTweensOf(ring)
              tweens.forEach(tween => {
                tween.timeScale(1 + progress * 3)
              })
              const scale = 1 + (index * 0.1) * progress
              gsap.set(ring, { scale })
            })
          }
        })
      }

      if (orbGlow.length) {
        // 滚动控制光晕脉冲
        ScrollTrigger.create({
          trigger: componentRoot.value,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress
            const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.3
            const opacity = 0.3 + Math.sin(progress * Math.PI * 2) * 0.2
            gsap.set(orbGlow[0], { scale, opacity })
          }
        })
      }

      // 粒子动画
      if (particles.length) {
        gsap.from(particles, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.02,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        // 粒子轨道运动
        particles.forEach((particle: HTMLElement, index: number) => {
          const angle = (index / 30) * Math.PI * 2
          const radius = 150 + Math.random() * 50

          gsap.to(particle, {
            rotation: 360,
            duration: 10 + Math.random() * 5,
            repeat: -1,
            ease: 'none',
            transformOrigin: `${-Math.cos(angle) * radius}px ${-Math.sin(angle) * radius}px`
          })
        })
      }

      // 数据显示动画
      if (dataItemsEl.length) {
        gsap.from(dataItemsEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.8,
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
.seo-energy-orb-section-164 {
  min-height: 100vh;
  padding: 100px 20px;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a1a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.seo-container-164 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.seo-title-164 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffd700, #ff8c00, #ff4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(255, 215, 0, 0.5);

  opacity: 1 !important;}

.seo-subtitle-164 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 215, 0, 0.6);
  margin-bottom: 100px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.seo-orb-stage-164 {
  position: relative;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.seo-canvas-164 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.seo-orb-container-164 {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seo-energy-orb-164 {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.seo-orb-core-164 {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #fff 0%, #ffd700 30%, #ff8c00 70%, transparent 100%);
  border-radius: 50%;
  box-shadow:
    0 0 60px rgba(255, 215, 0, 0.8),
    0 0 120px rgba(255, 140, 0, 0.6),
    0 0 180px rgba(255, 69, 0, 0.4);
  z-index: 3;
  animation: core-pulse 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes core-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

.seo-orb-ring-164 {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);

  opacity: 1 !important;}

.seo-ring-1-164 {
  width: 150px;
  height: 150px;
  z-index: 2;

  opacity: 1 !important;}

.seo-ring-2-164 {
  width: 200px;
  height: 200px;
  border-color: rgba(255, 140, 0, 0.4);
  z-index: 1;

  opacity: 1 !important;}

.seo-ring-3-164 {
  width: 280px;
  height: 280px;
  border-color: rgba(255, 69, 0, 0.3);
  z-index: 0;

  opacity: 1 !important;}

.seo-orb-glow-164 {
  position: absolute;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;

  opacity: 1 !important;}

.seo-energy-particles-164 {
  position: absolute;
  width: 300px;
  height: 300px;
  pointer-events: none;
  z-index: 4;

  opacity: 1 !important;}

.seo-particle-164 {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.seo-data-display-164 {
  display: flex;
  gap: 60px;
  justify-content: center;
  flex-wrap: wrap;
}

.seo-data-item-164 {
  text-align: center;
  background: rgba(255, 215, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);

  opacity: 1 !important;}

.seo-data-value-164 {
  font-size: 3rem;
  font-weight: 900;
  color: #ffd700;
  margin-bottom: 10px;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);

  opacity: 1 !important;}

.seo-data-label-164 {
  font-size: 1rem;
  color: rgba(255, 215, 0, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.2em;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .seo-energy-orb-164 {
    width: 200px;
    height: 200px;
  
  opacity: 1 !important;}

  .seo-orb-core-164 {
    width: 70px;
    height: 70px;
  
  opacity: 1 !important;}

  .seo-ring-1-164 {
    width: 100px;
    height: 100px;
  
  opacity: 1 !important;}

  .seo-ring-2-164 {
    width: 140px;
    height: 140px;
  
  opacity: 1 !important;}

  .seo-ring-3-164 {
    width: 190px;
    height: 190px;
  
  opacity: 1 !important;}

  .seo-orb-glow-164 {
    width: 230px;
    height: 230px;
  
  opacity: 1 !important;}

  .seo-energy-particles-164 {
    width: 200px;
    height: 200px;
  
  opacity: 1 !important;}

  .seo-data-display-164 {
    gap: 20px;
  }

  .seo-data-item-164 {
    padding: 20px 30px;
  
  opacity: 1 !important;}

  .seo-data-value-164 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
