<template>
  <div class="sgv-galaxy-vortex-section-171" ref="componentRoot">
    <div class="sgv-container-171">
      <h2 class="sgv-title-171">星系漩涡</h2>
      <p class="sgv-subtitle-171">Galaxy Vortex</p>

      <div class="sgv-vortex-stage-171">
        <canvas ref="vortexCanvas" class="sgv-canvas-171"></canvas>

        <div class="sgv-vortex-center-171">
          <div class="sgv-black-hole-171">
            <div class="sgv-event-horizon-171"></div>
            <div class="sgv-accretion-disk-171">
              <div class="sgv-disk-ring-171" v-for="i in 4" :key="i"></div>
            </div>
          </div>
        </div>

        <div class="sgv-vortex-items-171">
          <div
            v-for="(item, index) in vortexItems"
            :key="index"
            class="sgv-vortex-item-171"
            :ref="el => { if (el) itemRefs[index] = el as HTMLElement }"
            :data-orbit="index"
          >
            <div class="sgv-orbit-ring-171"></div>
            <div class="sgv-item-content-171">
              <div class="sgv-item-icon-171">{{ item.icon }}</div>
              <h3 class="sgv-item-title-171">{{ item.title }}</h3>
              <p class="sgv-item-desc-171">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <div class="sgv-stardust-171">
          <div class="sgv-dust-particle-171" v-for="i in 50" :key="i"></div>
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
const vortexCanvas = ref<HTMLCanvasElement>()
const itemRefs = ref<HTMLElement[]>([])

interface VortexItem {
  icon: string
  title: string
  description: string
}

const vortexItems: VortexItem[] = [
  {
    icon: '🪐',
    title: '行星',
    description: 'PLANET'
  },
  {
    icon: '☄️',
    title: '彗星',
    description: 'COMET'
  },
  {
    icon: '🌟',
    title: '恒星',
    description: 'STAR'
  },
  {
    icon: '🛸',
    title: '飞船',
    description: 'SPACECRAFT'
  }
]

let gsapCtx: gsap.Context
let vortexCtx: CanvasRenderingContext2D | null = null
let animationFrame: number | null = null
let resizeCanvas: () => void = () => {}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    const canvas = vortexCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.8
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    vortexCtx = canvas.getContext('2d')
    if (!vortexCtx) return

    const particles = Array.from({ length: 300 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 50 + Math.random() * 300,
      speed: 0.001 + Math.random() * 0.002,
      size: Math.random() * 2 + 0.5,
      hue: Math.random() * 60 + 220,
      opacity: Math.random() * 0.5 + 0.3
    }))

    let time = 0

    const animateVortex = () => {
      if (!vortexCtx || !canvas) return

      vortexCtx.fillStyle = 'rgba(5, 5, 20, 0.05)'
      vortexCtx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      particles.forEach((particle) => {
        particle.angle += particle.speed

        const x = centerX + Math.cos(particle.angle + time * 0.5) * particle.radius
        const y = centerY + Math.sin(particle.angle + time * 0.5) * particle.radius * 0.6

        vortexCtx.beginPath()
        vortexCtx.arc(x, y, particle.size, 0, Math.PI * 2)
        vortexCtx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`
        vortexCtx.fill()
      })

      time += 0.01
      animationFrame = requestAnimationFrame(animateVortex)
    }

    animateVortex()

    gsapCtx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sgv-title-171', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sgv-subtitle-171', componentRoot.value)
      const blackHole = gsap.utils.toArray<HTMLElement>('.sgv-black-hole-171', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.sgv-vortex-stage-171', componentRoot.value)
      const vortexItems = gsap.utils.toArray<HTMLElement>('.sgv-vortex-item-171', componentRoot.value)
      const itemIcons = gsap.utils.toArray<HTMLElement>('.sgv-item-icon-171', componentRoot.value)
      const itemTitles = gsap.utils.toArray<HTMLElement>('.sgv-item-title-171', componentRoot.value)
      const itemDescs = gsap.utils.toArray<HTMLElement>('.sgv-item-desc-171', componentRoot.value)
      const dustParticles = gsap.utils.toArray<HTMLElement>('.sgv-dust-particle-171', componentRoot.value)

      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          scale: 0.8,
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

      if (blackHole.length) {
        gsap.from(blackHole, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          rotation: 180,
          duration: 1.5,
          ease: 'back.out(2)'
        })

        gsap.to(blackHole, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'none'
        })
      }

      if (vortexItems.length) {
        gsap.from(vortexItems, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          rotation: -180,
          duration: 1,
          stagger: 0.2,
          delay: 0.5,
          ease: 'back.out(2)'
        })

        vortexItems.forEach((item, index) => {
          gsap.to(item, {
            rotation: 360,
            duration: 10 + index * 2,
            repeat: -1,
            ease: 'none'
          })
        })
      }

      if (itemIcons.length) {
        gsap.from(itemIcons, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 1,
          ease: 'back.out(2)'
        })
      }

      if (itemTitles.length) {
        gsap.from(itemTitles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 1.2,
          ease: 'power3.out'
        })
      }

      if (itemDescs.length) {
        gsap.from(itemDescs, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 1.4,
          ease: 'power3.out'
        })
      }

      if (dustParticles.length) {
        gsap.from(dustParticles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1,
          stagger: {
            each: 0.02,
            from: 'random'
          },
          delay: 1.5,
          ease: 'back.out(1.5)'
        })

        dustParticles.forEach((particle) => {
          gsap.to(particle, {
            opacity: 0.3 + Math.random() * 0.7,
            duration: 3 + Math.random() * 4,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: Math.random() * 3
          })
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  gsapCtx?.revert()
  window.removeEventListener('resize', resizeCanvas)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped lang="scss">
.sgv-galaxy-vortex-section-171 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #020210 0%, #050520 50%, #020210 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse at 50% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse at 30% 70%, rgba(219, 39, 119, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.sgv-container-171 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.sgv-title-171 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed, #db2777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sgv-subtitle-171 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(79, 70, 229, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.sgv-vortex-stage-171 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 60px 0;
}

.sgv-canvas-171 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sgv-vortex-center-171 {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.sgv-black-hole-171 {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sgv-event-horizon-171 {
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #000 0%, rgba(0, 0, 0, 0.8) 100%);
  border-radius: 50%;
  box-shadow: 0 0 50px rgba(79, 70, 229, 0.8), 0 0 100px rgba(124, 58, 237, 0.5);
}

.sgv-accretion-disk-171 {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: rotateDisk 10s linear infinite;
}

@keyframes rotateDisk {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sgv-disk-ring-171 {
  position: absolute;
  border: 3px solid;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &:nth-child(1) {
    width: 180px;
    height: 180px;
    border-color: rgba(79, 70, 229, 0.6);
    animation: pulseRing 2s ease-in-out infinite;
  }

  &:nth-child(2) {
    width: 220px;
    height: 220px;
    border-color: rgba(124, 58, 237, 0.5);
    animation: pulseRing 2s ease-in-out infinite 0.4s;
  }

  &:nth-child(3) {
    width: 260px;
    height: 260px;
    border-color: rgba(219, 39, 119, 0.4);
    animation: pulseRing 2s ease-in-out infinite 0.8s;
  }

  &:nth-child(4) {
    width: 300px;
    height: 300px;
    border-color: rgba(79, 70, 229, 0.3);
    animation: pulseRing 2s ease-in-out infinite 1.2s;
  }
}

@keyframes pulseRing {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
}

.sgv-vortex-items-171 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 50px;
  max-width: 600px;
  z-index: 2;
}

.sgv-vortex-item-171 {
  position: relative;
  background: rgba(5, 5, 20, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  text-align: center;
  overflow: hidden;
}

.sgv-orbit-ring-171 {
  position: absolute;
  inset: -10px;
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-radius: 20px;
  animation: orbitPulse 3s ease-in-out infinite;
}

@keyframes orbitPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

.sgv-item-content-171 {
  position: relative;
}

.sgv-item-icon-171 {
  font-size: 3.5rem;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 20px rgba(79, 70, 229, 0.6));
}

.sgv-item-title-171 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
}

.sgv-item-desc-171 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.sgv-stardust-171 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.sgv-dust-particle-171 {
  position: absolute;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  top: 50%;
  left: 50%;
}

@media (max-width: 768px) {
  .sgv-vortex-items-171 {
    grid-template-columns: 1fr;
  }

  .sgv-vortex-center-171 {
    width: 220px;
    height: 220px;
  }

  .sgv-item-icon-171 {
    font-size: 2.5rem;
  }
}
</style>
