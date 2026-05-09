<template>
  <div class="sqp-quantum-portal-section-167" ref="componentRoot">
    <div class="sqp-container-167">
      <h2 class="sqp-title-167">量子传送门</h2>
      <p class="sqp-subtitle-167">Quantum Portal</p>

      <div class="sqp-portal-stage-167">
        <canvas ref="portalCanvas" class="sqp-canvas-167"></canvas>

        <div class="sqp-portal-cores-167">
          <div
            v-for="(portal, index) in portals"
            :key="index"
            class="sqp-portal-core-167"
            :ref="el => { if (el) portalRefs[index] = el as HTMLElement }"
            :data-portal="index"
            @mouseenter="handlePortalEnter(index)"
            @mouseleave="handlePortalLeave(index)"
          >
            <div class="sqp-portal-ring-167" v-for="i in 3" :key="i"></div>
            <div class="sqp-portal-inner-167">
              <div class="sqp-portal-glow-167" :style="{ background: portal.color }"></div>
              <div class="sqp-portal-icon-167">{{ portal.icon }}</div>
            </div>
            <div class="sqp-portal-particles-167">
              <div class="sqp-particle-167" v-for="i in 8" :key="i"></div>
            </div>
          </div>
        </div>

        <div class="sqp-portal-info-167">
          <div
            v-for="(portal, index) in portals"
            :key="index"
            class="sqp-info-card-167"
            :ref="el => { if (el) infoRefs[index] = el as HTMLElement }"
          >
            <span class="sqp-info-number-167">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="sqp-info-title-167">{{ portal.title }}</h3>
            <p class="sqp-info-desc-167">{{ portal.description }}</p>
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
const portalCanvas = ref<HTMLCanvasElement>()
const portalRefs = ref<HTMLElement[]>([])
const infoRefs = ref<HTMLElement[]>([])

interface Portal {
  icon: string
  title: string
  description: string
  color: string
}

const portals: Portal[] = [
  {
    icon: '⚛️',
    title: '量子',
    description: 'QUANTUM REALM',
    color: 'radial-gradient(circle, rgba(138, 43, 226, 0.8) 0%, transparent 70%)'
  },
  {
    icon: '🌀',
    title: '漩涡',
    description: 'VORTEX GATE',
    color: 'radial-gradient(circle, rgba(0, 191, 255, 0.8) 0%, transparent 70%)'
  },
  {
    icon: '✨',
    title: '星尘',
    description: 'STARDUST PORTAL',
    color: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)'
  },
  {
    icon: '🔮',
    title: '预言',
    description: 'PROPHECY',
    color: 'radial-gradient(circle, rgba(255, 20, 147, 0.8) 0%, transparent 70%)'
  }
]

let gsapCtx: gsap.Context
let portalCtx: CanvasRenderingContext2D | null = null
let animationFrame: number | null = null
let resizeCanvas: () => void = () => {}

const handlePortalEnter = (index: number) => {
  const portal = portalRefs.value[index]
  if (!portal) return

  gsap.to(portal, {
    scale: 1.15,
    duration: 0.4,
    ease: 'back.out(1.7)'
  })

  const rings = portal.querySelectorAll('.sqp-portal-ring-167') as NodeListOf<HTMLElement>
  rings.forEach((ring, i) => {
    gsap.to(ring, {
      rotation: 360,
      duration: 2 + i * 0.5,
      repeat: -1,
      ease: 'none'
    })
  })
}

const handlePortalLeave = (index: number) => {
  const portal = portalRefs.value[index]
  if (!portal) return

  gsap.to(portal, {
    scale: 1,
    duration: 0.4,
    ease: 'power2.out'
  })

  const rings = portal.querySelectorAll('.sqp-portal-ring-167') as NodeListOf<HTMLElement>
  rings.forEach((ring) => {
    gsap.to(ring, {
      rotation: 0,
      duration: 0.5,
      ease: 'power2.out'
    })
  })
}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    const canvas = portalCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.8
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    portalCtx = canvas.getContext('2d')
    if (!portalCtx) return

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.3
    }))

    const animatePortal = () => {
      if (!portalCtx || !canvas) return

      portalCtx.fillStyle = 'rgba(5, 5, 20, 0.1)'
      portalCtx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.x += star.speedX
        star.y += star.speedY

        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        portalCtx.beginPath()
        portalCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        portalCtx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        portalCtx.fill()
      })

      animationFrame = requestAnimationFrame(animatePortal)
    }

    animatePortal()

    gsapCtx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sqp-title-167', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sqp-subtitle-167', componentRoot.value)
      const portalCores = gsap.utils.toArray<HTMLElement>('.sqp-portal-core-167', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.sqp-portal-stage-167', componentRoot.value)
      const infoCards = gsap.utils.toArray<HTMLElement>('.sqp-info-card-167', componentRoot.value)
      const infoNumbers = gsap.utils.toArray<HTMLElement>('.sqp-info-number-167', componentRoot.value)
      const infoTitles = gsap.utils.toArray<HTMLElement>('.sqp-info-title-167', componentRoot.value)
      const infoDescs = gsap.utils.toArray<HTMLElement>('.sqp-info-desc-167', componentRoot.value)

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

        gsap.to(titleEl, {
          textShadow: '0 0 30px #8a2be2, 0 0 60px #8a2be2',
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
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

      if (portalCores.length) {
        gsap.from(portalCores, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          rotation: 180,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(2)'
        })

        portalCores.forEach((portal) => {
          gsap.to(portal, {
            y: -15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
          })
        })
      }

      if (infoCards.length) {
        gsap.from(infoCards, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          x: -50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.5,
          ease: 'power3.out'
        })
      }

      if (infoNumbers.length) {
        gsap.from(infoNumbers, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.8,
          ease: 'back.out(2)'
        })
      }

      if (infoTitles.length) {
        gsap.from(infoTitles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 1,
          ease: 'power3.out'
        })
      }

      if (infoDescs.length) {
        gsap.from(infoDescs, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 1.2,
          ease: 'power3.out'
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
.sqp-quantum-portal-section-167 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #050515 0%, #0a0a25 50%, #050515 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at 50% 50%, rgba(138, 43, 226, 0.2) 0%, transparent 60%),
      radial-gradient(ellipse at 30% 70%, rgba(255, 0, 255, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }
}

.sqp-container-167 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.sqp-title-167 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #8a2be2, #00bfff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(138, 43, 226, 0.5);
}

.sqp-subtitle-167 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(138, 43, 226, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.sqp-portal-stage-167 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 60px;
}

.sqp-canvas-167 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sqp-portal-cores-167 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  z-index: 2;
  perspective: 1000px;
}

.sqp-portal-core-167 {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.4s ease;
}

.sqp-portal-ring-167 {
  position: absolute;
  border: 2px solid rgba(138, 43, 226, 0.5);
  border-radius: 50%;

  &:nth-child(1) {
    width: 100%;
    height: 100%;
    border-color: rgba(138, 43, 226, 0.3);
  }

  &:nth-child(2) {
    width: 80%;
    height: 80%;
    border-color: rgba(0, 191, 255, 0.4);
  }

  &:nth-child(3) {
    width: 60%;
    height: 60%;
    border-color: rgba(255, 215, 0, 0.5);
  }
}

.sqp-portal-inner-167 {
  position: relative;
  width: 50%;
  height: 50%;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sqp-portal-glow-167 {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  filter: blur(20px);
}

.sqp-portal-icon-167 {
  position: relative;
  font-size: 3rem;
  z-index: 1;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
}

.sqp-portal-particles-167 {
  position: absolute;
  inset: -20px;
  pointer-events: none;
}

.sqp-particle-167 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: orbit 4s linear infinite;
}

@keyframes orbit {
  from {
    transform: rotate(0deg) translateX(100px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(100px) rotate(-360deg);
  }
}

.sqp-portal-info-167 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  max-width: 1200px;
  z-index: 2;
}

.sqp-info-card-167 {
  background: rgba(10, 10, 30, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(138, 43, 226, 0.2);
  text-align: center;
}

.sqp-info-number-167 {
  position: absolute;
  top: -15px;
  left: 20px;
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #8a2be2, #00bfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.sqp-info-title-167 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
}

.sqp-info-desc-167 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .sqp-portal-cores-167,
  .sqp-portal-info-167 {
    grid-template-columns: repeat(2, 1fr);
  }

  .sqp-portal-core-167 {
    width: 140px;
    height: 140px;
  }

  .sqp-portal-icon-167 {
    font-size: 2.5rem;
  }

  .sqp-info-number-167 {
    font-size: 2.5rem;
  }

  .sqp-info-title-167 {
    font-size: 1.2rem;
  }
}
</style>
