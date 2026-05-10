<template>
  <div class="sld-liquid-distort-section-190" ref="componentRoot">
    <div class="sld-container-190">
      <h2 class="sld-title-190">液体扭曲</h2>
      <p class="sld-subtitle-190">Liquid Distortion</p>

      <div class="sld-liquid-stage-190">
        <canvas ref="liquidCanvas" class="sld-canvas-190"></canvas>

        <div class="sld-images-190">
          <div
            v-for="(item, index) in liquidItems"
            :key="index"
            class="sld-liquid-item-190"
            :ref="el => { if (el) itemRefs[index] = el as HTMLElement }"
            @mousemove="handleLiquidMove($event, index)"
            @mouseleave="handleLiquidLeave(index)"
          >
            <div class="sld-image-container-190">
              <div class="sld-image-190" :style="{ backgroundImage: `url(${item.image})` }"></div>
              <div class="sld-liquid-overlay-190"></div>
              <div class="sld-ripple-190" v-for="i in 5" :key="i"></div>
            </div>
            <div class="sld-item-content-190">
              <h3 class="sld-item-title-190">{{ item.title }}</h3>
              <p class="sld-item-desc-190">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <div class="sld-particles-190">
          <div class="sld-particle-190" v-for="i in 30" :key="i"></div>
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
const liquidCanvas = ref<HTMLCanvasElement>()
const itemRefs = ref<HTMLElement[]>([])

interface LiquidItem {
  image: string
  title: string
  description: string
}

const liquidItems: LiquidItem[] = [
  {
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '流动',
    description: 'Flow'
  },
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '波动',
    description: 'Wave'
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '涟漪',
    description: 'Ripple'
  },
  {
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    title: '漩涡',
    description: 'Vortex'
  }
]

let gsapCtx: gsap.Context
let animationFrame: number | null = null
let resizeCanvas: () => void = () => {}

const handleLiquidMove = (event: MouseEvent, index: number) => {
  const item = itemRefs.value[index]
  if (!item) return

  const rect = item.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1

  const image = item.querySelector('.sld-image-190') as HTMLElement
  if (image) {
    gsap.to(image, {
      scale: 1.1 + Math.abs(x) * 0.1,
      translateX: x * 15,
      translateY: y * 15,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  const overlay = item.querySelector('.sld-liquid-overlay-190') as HTMLElement
  if (overlay) {
    gsap.to(overlay, {
      opacity: 0.4 + Math.abs(x) * 0.3,
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  const ripples = item.querySelectorAll('.sld-ripple-190') as NodeListOf<HTMLElement>
  ripples.forEach((ripple, i) => {
    gsap.fromTo(ripple,
      {
        scale: 0,
        opacity: 0.5
      },
      {
        scale: 2,
        opacity: 0,
        duration: 1.5,
        delay: i * 0.2,
        ease: 'power2.out'
      }
    )
  })
}

const handleLiquidLeave = (index: number) => {
  const item = itemRefs.value[index]
  if (!item) return

  const image = item.querySelector('.sld-image-190') as HTMLElement
  if (image) {
    gsap.to(image, {
      scale: 1,
      translateX: 0,
      translateY: 0,
      duration: 0.6,
      ease: 'power2.out'
    })
  }

  const overlay = item.querySelector('.sld-liquid-overlay-190') as HTMLElement
  if (overlay) {
    gsap.to(overlay, {
      opacity: 0.3,
      duration: 0.6,
      ease: 'power2.out'
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    const canvas = liquidCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.8
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const liquidCtx = canvas.getContext('2d')
    if (!liquidCtx) return

    const drops = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 30 + 10,
      speedY: Math.random() * 2 + 1,
      radiusGrow: Math.random() * 0.5 + 0.1
    }))

    const animateLiquid = () => {
      liquidCtx.clearRect(0, 0, canvas.width, canvas.height)

      drops.forEach((drop) => {
        drop.y += drop.speedY
        drop.radius += drop.radiusGrow

        if (drop.y > canvas.height + 50) {
          drop.y = -50
          drop.x = Math.random() * canvas.width
          drop.radius = Math.random() * 30 + 10
        }

        const gradient = liquidCtx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.radius)
        gradient.addColorStop(0, 'rgba(100, 200, 255, 0.6)')
        gradient.addColorStop(0.5, 'rgba(50, 150, 255, 0.3)')
        gradient.addColorStop(1, 'transparent')

        liquidCtx.beginPath()
        liquidCtx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2)
        liquidCtx.fillStyle = gradient
        liquidCtx.fill()
      })

      animationFrame = requestAnimationFrame(animateLiquid)
    }

    animateLiquid()

    gsapCtx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sld-title-190', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sld-subtitle-190', componentRoot.value)
      const liquidItems = gsap.utils.toArray<HTMLElement>('.sld-liquid-item-190', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.sld-liquid-stage-190', componentRoot.value)
      const itemTitles = gsap.utils.toArray<HTMLElement>('.sld-item-title-190', componentRoot.value)
      const itemDescs = gsap.utils.toArray<HTMLElement>('.sld-item-desc-190', componentRoot.value)
      const particles = gsap.utils.toArray<HTMLElement>('.sld-particle-190', componentRoot.value)

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

      if (liquidItems.length) {
        gsap.from(liquidItems, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          opacity: 0,
          scale: 0.9,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)'
        })

        liquidItems.forEach((item) => {
          gsap.to(item, {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
          })
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
          delay: 0.5,
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
          delay: 0.7,
          ease: 'power3.out'
        })
      }

      if (particles.length) {
        gsap.from(particles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.05,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        particles.forEach((particle) => {
          const duration = 3 + Math.random() * 4
          gsap.to(particle, {
            y: -window.innerHeight * 0.5,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration,
            repeat: -1,
            delay: Math.random() * 2,
            ease: 'none'
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
.sld-liquid-distort-section-190 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a20 0%, #0f0a30 50%, #0a0a20 100%);
  position: relative;
  overflow: hidden;
}

.sld-container-190 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

.sld-title-190 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #64c8ff, #4a90e2, #7eb8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(100, 200, 255, 0.5);
}

.sld-subtitle-190 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(100, 200, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.sld-liquid-stage-190 {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sld-canvas-190 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sld-images-190 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  max-width: 1200px;
  z-index: 2;
}

.sld-liquid-item-190 {
  position: relative;
  background: rgba(10, 10, 30, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(100, 200, 255, 0.2);
  cursor: pointer;
  transition: border-color 0.4s ease;

  &:hover {
    border-color: rgba(100, 200, 255, 0.5);
  }
}

.sld-image-container-190 {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.sld-image-190 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.sld-liquid-overlay-190 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(100, 200, 255, 0.3), rgba(74, 144, 226, 0.3));
  opacity: 0.3;
  transition: opacity 0.5s ease;
}

.sld-ripple-190 {
  position: absolute;
  border: 2px solid rgba(100, 200, 255, 0.5);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.sld-item-content-190 {
  position: relative;
  padding: 30px;
  text-align: center;
}

.sld-item-title-190 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(100, 200, 255, 0.5);
}

.sld-item-desc-190 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.sld-particles-190 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.sld-particle-190 {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, rgba(100, 200, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -20px;
}

@media (max-width: 768px) {
  .sld-images-190 {
    grid-template-columns: 1fr;
  }

  .sld-item-title-190 {
    font-size: 1.5rem;
  }
}
</style>
