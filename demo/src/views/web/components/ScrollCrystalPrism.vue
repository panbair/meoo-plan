<template>
  <div class="scp-crystal-prism-section-169" ref="componentRoot">
    <div class="scp-container-169">
      <h2 class="scp-title-169">水晶棱镜</h2>
      <p class="scp-subtitle-169">Crystal Prism</p>

      <div class="scp-prism-stage-169">
        <canvas ref="prismCanvas" class="scp-canvas-169"></canvas>

        <div class="scp-prisms-169">
          <div
            v-for="(prism, index) in prisms"
            :key="index"
            class="scp-prism-169"
            :ref="el => { if (el) prismRefs[index] = el as HTMLElement }"
            :data-prism="index"
            @mouseenter="handlePrismEnter(index)"
            @mouseleave="handlePrismLeave(index)"
          >
            <div class="scp-prism-body-169" :style="{ background: prism.gradient }">
              <div class="scp-prism-facet-169" v-for="i in 3" :key="i"></div>
            </div>
            <div class="scp-prism-light-169">
              <div class="scp-light-ray-169" v-for="i in 6" :key="i" :style="`--angle: ${i * 60}deg`"></div>
            </div>
            <div class="scp-prism-label-169">{{ prism.label }}</div>
          </div>
        </div>

        <div class="scp-spectrum-169">
          <div class="scp-spectrum-color-169" v-for="(color, index) in spectrumColors" :key="index" :style="{ background: color }"></div>
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
const prismCanvas = ref<HTMLCanvasElement>()
const prismRefs = ref<HTMLElement[]>([])

interface Prism {
  label: string
  gradient: string
}

const prisms: Prism[] = [
  {
    label: '红',
    gradient: 'linear-gradient(135deg, #ff0000, #ff6666)'
  },
  {
    label: '橙',
    gradient: 'linear-gradient(135deg, #ff8800, #ffaa44)'
  },
  {
    label: '黄',
    gradient: 'linear-gradient(135deg, #ffff00, #ffff66)'
  },
  {
    label: '绿',
    gradient: 'linear-gradient(135deg, #00ff00, #66ff66)'
  },
  {
    label: '蓝',
    gradient: 'linear-gradient(135deg, #0088ff, #66aaff)'
  },
  {
    label: '紫',
    gradient: 'linear-gradient(135deg, #8800ff, #aa66ff)'
  }
]

const spectrumColors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff']

let gsapCtx: gsap.Context
let prismCtx: CanvasRenderingContext2D | null = null
let animationFrame: number | null = null
let resizeCanvas: () => void = () => {}

const handlePrismEnter = (index: number) => {
  const prism = prismRefs.value[index]
  if (!prism) return

  gsap.to(prism, {
    scale: 1.15,
    rotateY: 20,
    duration: 0.4,
    ease: 'power2.out'
  })

  const rays = prism.querySelectorAll('.scp-light-ray-169') as NodeListOf<HTMLElement>
  rays.forEach((ray, i) => {
    gsap.to(ray, {
      opacity: 1,
      scaleY: 1.5,
      duration: 0.3,
      delay: i * 0.05,
      ease: 'power2.out'
    })
  })
}

const handlePrismLeave = (index: number) => {
  const prism = prismRefs.value[index]
  if (!prism) return

  gsap.to(prism, {
    scale: 1,
    rotateY: 0,
    duration: 0.4,
    ease: 'power2.out'
  })

  const rays = prism.querySelectorAll('.scp-light-ray-169') as NodeListOf<HTMLElement>
  rays.forEach((ray) => {
    gsap.to(ray, {
      opacity: 0.5,
      scaleY: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  })
}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    const canvas = prismCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.8
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    prismCtx = canvas.getContext('2d')
    if (!prismCtx) return

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 1,
      speedY: (Math.random() - 0.5) * 1,
      color: spectrumColors[Math.floor(Math.random() * spectrumColors.length)],
      opacity: Math.random() * 0.5 + 0.3
    }))

    const animatePrism = () => {
      if (!prismCtx || !canvas) return

      prismCtx.fillStyle = 'rgba(5, 5, 15, 0.05)'
      prismCtx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        prismCtx.beginPath()
        prismCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        prismCtx.fillStyle = particle.color
        prismCtx.globalAlpha = particle.opacity
        prismCtx.fill()
      })

      prismCtx.globalAlpha = 1
      animationFrame = requestAnimationFrame(animatePrism)
    }

    animatePrism()

    gsapCtx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.scp-title-169', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.scp-subtitle-169', componentRoot.value)
      const prismsEl = gsap.utils.toArray<HTMLElement>('.scp-prism-169', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.scp-prism-stage-169', componentRoot.value)
      const spectrumEl = gsap.utils.toArray<HTMLElement>('.scp-spectrum-169', componentRoot.value)

      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out'
        })

        gsap.to(titleEl, {
          background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)',
          duration: 3,
          repeat: -1,
          ease: 'none'
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

      if (prismsEl.length) {
        gsap.from(prismsEl, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          rotateY: 180,
          duration: 1,
          stagger: 0.15,
          ease: 'back.out(2)'
        })

        prismsEl.forEach((prism, index) => {
          gsap.to(prism, {
            rotateY: (index % 2 === 0 ? 15 : -15),
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        })
      }

      if (spectrumEl.length) {
        gsap.from(spectrumEl, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          scaleX: 0,
          opacity: 0,
          duration: 1.5,
          stagger: 0.1,
          delay: 1,
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
.scp-crystal-prism-section-169 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #050515 0%, #0f0f25 50%, #050515 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse at 30% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 50%, rgba(255, 255, 0, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.scp-container-169 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.scp-title-169 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff0000, #ff8800, #ffff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.scp-subtitle-169 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.scp-prism-stage-169 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 80px;
}

.scp-canvas-169 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.scp-prisms-169 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  z-index: 2;
  perspective: 1000px;
}

.scp-prism-169 {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.4s ease;
}

.scp-prism-body-169 {
  position: relative;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  overflow: hidden;
}

.scp-prism-facet-169 {
  position: absolute;
  inset: 20%;
  background: rgba(255, 255, 255, 0.2);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);

  &:nth-child(1) { transform: rotate(0deg) scale(0.6); }
  &:nth-child(2) { transform: rotate(90deg) scale(0.4); }
  &:nth-child(3) { transform: rotate(180deg) scale(0.2); }
}

.scp-prism-light-169 {
  position: absolute;
  inset: -30px;
  pointer-events: none;
}

.scp-light-ray-169 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 120px;
  background: linear-gradient(to top, currentColor, transparent);
  transform-origin: bottom center;
  transform: translate(-50%, -100%) rotate(var(--angle));
  opacity: 0.5;
}

.scp-prism-label-169 {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  white-space: nowrap;
}

.scp-spectrum-169 {
  position: relative;
  display: flex;
  gap: 0;
  height: 8px;
  width: 100%;
  max-width: 800px;
  border-radius: 4px;
  overflow: hidden;
  z-index: 2;
}

.scp-spectrum-color-169 {
  flex: 1;
  height: 100%;
  transition: height 0.3s ease;

  &:hover {
    height: 20px;
  }
}

@media (max-width: 768px) {
  .scp-prisms-169 {
    grid-template-columns: repeat(2, 1fr);
  }

  .scp-prism-169 {
    width: 140px;
    height: 140px;
  }
}
</style>
