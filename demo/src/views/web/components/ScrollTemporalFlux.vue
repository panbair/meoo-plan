<template>
  <div class="stf-temporal-flux-section-177" ref="componentRoot">
    <div class="stf-container-177">
      <h2 class="stf-title-177">时空流变</h2>
      <p class="stf-subtitle-177">Temporal Flux Effect</p>

      <div class="stf-flux-stage-177">
        <canvas ref="fluxCanvas" class="stf-canvas-177"></canvas>

        <div class="stf-timeline-177">
          <div class="stf-timeline-line-177" ref="timelineLine">
            <div class="stf-progress-bar-177" ref="progressBar"></div>
          </div>

          <div class="stf-time-points-177">
            <div
              v-for="(point, index) in timePoints"
              :key="index"
              class="stf-time-point-177"
              :ref="el => { if (el) pointRefs[index] = el as HTMLElement }"
            >
              <div class="stf-point-marker-177"></div>
              <div class="stf-point-content-177">
                <div class="stf-point-time-177">{{ point.time }}</div>
                <div class="stf-point-title-177">{{ point.title }}</div>
                <div class="stf-point-desc-177">{{ point.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="stf-portal-177" ref="portal">
          <div class="stf-portal-ring-177 stf-ring-1-177"></div>
          <div class="stf-portal-ring-177 stf-ring-2-177"></div>
          <div class="stf-portal-ring-177 stf-ring-3-177"></div>
          <div class="stf-portal-core-177"></div>
          <div class="stf-time-particles-177">
            <div
              v-for="n in 20"
              :key="n"
              class="stf-time-particle-177"
              :ref="el => { if (el) particleRefs[n] = el as HTMLElement }"
            ></div>
          </div>
        </div>
      </div>

      <div class="stf-flux-metrics-177">
        <div
          v-for="(metric, index) in fluxMetrics"
          :key="index"
          class="stf-metric-177"
          :ref="el => { if (el) metricRefs[index] = el as HTMLElement }"
        >
          <div class="stf-metric-value-177">{{ metric.value }}</div>
          <div class="stf-metric-label-177">{{ metric.label }}</div>
          <div class="stf-metric-wave-177"></div>
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
const fluxCanvas = ref<HTMLCanvasElement>()
const timelineLine = ref<HTMLElement>()
const progressBar = ref<HTMLElement>()
const portal = ref<HTMLElement>()
const pointRefs = ref<HTMLElement[]>([])
const particleRefs = ref<Record<number, HTMLElement>>({})
const metricRefs = ref<HTMLElement[]>([])

interface TimePoint {
  time: string
  title: string
  description: string
}

const timePoints: TimePoint[] = [
  { time: 'PAST', title: '起源', description: 'Origin' },
  { time: 'PRESENT', title: '现在', description: 'Now' },
  { time: 'FUTURE', title: '未来', description: 'Future' }
]

interface FluxMetric {
  value: string
  label: string
}

const fluxMetrics: FluxMetric[] = [
  { value: '∞', label: 'INFINITY' },
  { value: 'Ω', label: 'OMEGA' },
  { value: 'α', label: 'ALPHA' }
]

let ctx: gsap.Context
let animationFrame: number | null = null
let resizeCanvas: () => void = () => {}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    // Canvas 时空流动画
    const canvas = fluxCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.7
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) return

    const fluxParticles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      hue: 280 + Math.random() * 60,
      opacity: Math.random() * 0.5 + 0.2
    }))

    let time = 0

    const animateFlux = () => {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

      fluxParticles.forEach(particle => {
        particle.x += particle.speedX + Math.sin(time * 0.01 + particle.y * 0.01) * 0.5
        particle.y += particle.speedY + Math.cos(time * 0.01 + particle.x * 0.01) * 0.5

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        canvasCtx.beginPath()
        canvasCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        canvasCtx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`
        canvasCtx.fill()

        // 粒子轨迹
        const prevX = particle.x - particle.speedX * 10
        const prevY = particle.y - particle.speedY * 10
        canvasCtx.beginPath()
        canvasCtx.moveTo(prevX, prevY)
        canvasCtx.lineTo(particle.x, particle.y)
        canvasCtx.strokeStyle = `hsla(${particle.hue}, 80%, 60%, 0.2)`
        canvasCtx.lineWidth = 1
        canvasCtx.stroke()
      })

      time += 0.016
      animationFrame = requestAnimationFrame(animateFlux)
    }

    animateFlux()

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.stf-title-177', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.stf-subtitle-177', componentRoot.value)
      const timePointsEl = gsap.utils.toArray<HTMLElement>('.stf-time-point-177', componentRoot.value)
      const pointMarkers = gsap.utils.toArray<HTMLElement>('.stf-point-marker-177', componentRoot.value)
      const pointContents = gsap.utils.toArray<HTMLElement>('.stf-point-content-177', componentRoot.value)
      const pointTimes = gsap.utils.toArray<HTMLElement>('.stf-point-time-177', componentRoot.value)
      const pointTitles = gsap.utils.toArray<HTMLElement>('.stf-point-title-177', componentRoot.value)
      const pointDescs = gsap.utils.toArray<HTMLElement>('.stf-point-desc-177', componentRoot.value)
      const portalRings = gsap.utils.toArray<HTMLElement>('.stf-portal-ring-177', componentRoot.value)
      const portalCore = gsap.utils.toArray<HTMLElement>('.stf-portal-core-177', componentRoot.value)
      const timeParticles = gsap.utils.toArray<HTMLElement>('.stf-time-particle-177', componentRoot.value)
      const metrics = gsap.utils.toArray<HTMLElement>('.stf-metric-177', componentRoot.value)

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

      // 时间线动画
      if (timelineLine.value) {
        gsap.from(timelineLine.value, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          scaleY: 0,
          duration: 1,
          ease: 'power3.out'
        })
      }

      // 进度条动画
      if (progressBar.value) {
        gsap.to(progressBar.value, {
          height: '100%',
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 70%',
            end: 'bottom 20%',
            scrub: 1
          },
          ease: 'none'
        })
      }

      // 时间点动画
      if (timePointsEl.length) {
        gsap.from(timePointsEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          x: -80,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.3,
          ease: 'power3.out'
        })
      }

      if (pointMarkers.length) {
        gsap.from(pointMarkers, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          duration: 0.5,
          stagger: 0.2,
          delay: 0.5,
          ease: 'back.out(2)'
        })
      }

      if (pointContents.length) {
        gsap.from(pointContents, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 25,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.6,
          ease: 'power3.out'
        })
      }

      if (pointTimes.length) {
        gsap.from(pointTimes, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          filter: 'blur(8px)',
          duration: 0.6,
          stagger: 0.2,
          delay: 0.7,
          ease: 'power3.out'
        })
      }

      if (pointTitles.length) {
        gsap.from(pointTitles, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 15,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.8,
          ease: 'power3.out'
        })
      }

      if (pointDescs.length) {
        gsap.from(pointDescs, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 15,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.9,
          ease: 'power3.out'
        })
      }

      // 传送门动画
      if (portal.value) {
        gsap.from(portal.value, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.2,
          delay: 0.4,
          ease: 'elastic.out(1, 0.5)'
        })
      }

      if (portalRings.length) {
        gsap.from(portalRings, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          rotation: -180,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.5,
          ease: 'back.out(1.7)'
        })

        // 滚动控制环旋转
        ScrollTrigger.create({
          trigger: componentRoot.value,
          start: 'top 70%',
          end: 'bottom 20%',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress
            const rotation = progress * 720

            portalRings.forEach((ring: HTMLElement, index: number) => {
              const direction = index % 2 === 0 ? 1 : -1
              gsap.set(ring, { rotation: rotation * direction })
            })
          }
        })
      }

      if (portalCore.length) {
        // 核心脉动
        gsap.to(portalCore, {
          scale: 1.2,
          opacity: 0.8,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }

      // 时间粒子动画
      if (timeParticles.length) {
        gsap.from(timeParticles, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 0.6,
          stagger: {
            each: 0.03,
            from: 'random'
          },
          ease: 'back.out(1.5)'
        })

        // 粒子轨道运动
        timeParticles.forEach((particle: HTMLElement, index: number) => {
          const angle = (index / 20) * Math.PI * 2
          const radius = 80 + Math.random() * 40

          gsap.to(particle, {
            rotation: 360,
            duration: 5 + Math.random() * 3,
            repeat: -1,
            ease: 'none',
            transformOrigin: `${-Math.cos(angle) * radius}px ${-Math.sin(angle) * radius}px`
          })
        })
      }

      // 指标动画
      if (metrics.length) {
        gsap.from(metrics, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 50%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
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
})
</script>

<style scoped lang="scss">
.stf-temporal-flux-section-177 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0a2a 50%, #0a0a1a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.stf-container-177 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.stf-title-177 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899, #f43f5e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(139, 92, 246, 0.5);

  opacity: 1 !important;}

.stf-subtitle-177 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(139, 92, 246, 0.6);
  margin-bottom: 100px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.stf-flux-stage-177 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 60px;
  margin-bottom: 60px;

  opacity: 1 !important;}

.stf-canvas-177 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.stf-timeline-177 {
  position: relative;
  display: flex;
  gap: 100px;
  align-items: flex-start;
  z-index: 10;
}

.stf-timeline-line-177 {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(139, 92, 246, 0.3);
  transform: translateX(-50%);
  overflow: hidden;

  opacity: 1 !important;}

.stf-progress-bar-177 {
  width: 100%;
  height: 0;
  background: linear-gradient(180deg, #8b5cf6, #ec4899);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);

  opacity: 1 !important;}

.stf-time-points-177 {
  display: flex;
  gap: 100px;
}

.stf-time-point-177 {
  position: relative;
  width: 200px;
  text-align: center;

  opacity: 1 !important;}

.stf-point-marker-177 {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: #8b5cf6;
  border-radius: 50%;
  box-shadow:
    0 0 20px rgba(139, 92, 246, 0.8),
    0 0 40px rgba(139, 92, 246, 0.4);
  z-index: 2;

  opacity: 1 !important;}

.stf-point-content-177 {
  position: relative;
  margin-top: 40px;
  background: rgba(139, 92, 246, 0.1);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  z-index: 1;

  opacity: 1 !important;}

.stf-point-time-177 {
  font-size: 0.8rem;
  color: rgba(139, 92, 246, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 10px;
  font-family: 'Courier New', monospace;

  opacity: 1 !important;}

.stf-point-title-177 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.stf-point-desc-177 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.stf-portal-177 {
  position: relative;
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  opacity: 1 !important;}

.stf-portal-ring-177 {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;

  opacity: 1 !important;}

.stf-ring-1-177 {
  width: 80px;
  height: 80px;
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);

  opacity: 1 !important;}

.stf-ring-2-177 {
  width: 150px;
  height: 150px;
  border-color: rgba(236, 72, 153, 0.5);
  box-shadow: 0 0 30px rgba(236, 72, 153, 0.3);

  opacity: 1 !important;}

.stf-ring-3-177 {
  width: 230px;
  height: 230px;
  border-color: rgba(244, 63, 94, 0.4);
  box-shadow: 0 0 40px rgba(244, 63, 94, 0.2);

  opacity: 1 !important;}

.stf-portal-core-177 {
  position: absolute;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #8b5cf6 0%, #ec4899 100%);
  border-radius: 50%;
  box-shadow:
    0 0 40px rgba(139, 92, 246, 0.8),
    0 0 80px rgba(236, 72, 153, 0.5);
  z-index: 10;

  opacity: 1 !important;}

.stf-time-particles-177 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.stf-time-particle-177 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #8b5cf6;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);

  opacity: 1 !important;}

.stf-flux-metrics-177 {
  display: flex;
  gap: 60px;
  justify-content: center;
  flex-wrap: wrap;
}

.stf-metric-177 {
  text-align: center;
  position: relative;

  opacity: 1 !important;}

.stf-metric-value-177 {
  font-size: 3rem;
  font-weight: 900;
  color: #8b5cf6;
  margin-bottom: 10px;
  text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);

  opacity: 1 !important;}

.stf-metric-label-177 {
  font-size: 0.9rem;
  color: rgba(139, 92, 246, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 15px;

  opacity: 1 !important;}

.stf-metric-wave-177 {
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  animation: wave-flow 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes wave-flow {
  0%, 100% {
    transform: scaleX(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scaleX(1.2);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .stf-timeline-177 {
    gap: 40px;
  }

  .stf-time-points-177 {
    gap: 40px;
  }

  .stf-time-point-177 {
    width: 150px;
  
  opacity: 1 !important;}

  .stf-point-content-177 {
    padding: 20px;
  
  opacity: 1 !important;}

  .stf-portal-177 {
    width: 180px;
    height: 180px;
  
  opacity: 1 !important;}

  .stf-ring-1-177 {
    width: 60px;
    height: 60px;
  
  opacity: 1 !important;}

  .stf-ring-2-177 {
    width: 110px;
    height: 110px;
  
  opacity: 1 !important;}

  .stf-ring-3-177 {
    width: 160px;
    height: 160px;
  
  opacity: 1 !important;}

  .stf-portal-core-177 {
    width: 30px;
    height: 30px;
  
  opacity: 1 !important;}

  .stf-flux-metrics-177 {
    gap: 30px;
  }

  .stf-metric-value-177 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
