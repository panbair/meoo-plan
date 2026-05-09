<template>
  <div class="star-text-wrapper-181">
    <div class="st-stage-181" ref="stageRef">
      <div class="st-stars-bg-181">
        <canvas class="st-stars-canvas-181" ref="canvasRef"></canvas>
      </div>
      <div class="st-nebula-layer-181"></div>
      <div class="st-star-container-181" ref="containerRef">
        <h2 class="st-title-181">STELLAR GLOW</h2>
        <div class="st-twinkling-stars-181">
          <div class="st-star-181" v-for="i in 50" :key="i"></div>
        </div>
        <div class="st-star-text-181">
          <span class="st-char-181" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="st-shooting-stars-181">
          <div class="st-shooting-181" v-for="i in 5" :key="i"></div>
        </div>
      </div>
      <div class="st-constellation-181">
        <div class="st-constellation-dot-181" v-for="i in 12" :key="i"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stageRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const text = 'COSMIC DUST'

let ctx: gsap.Context
let starsAnimationId: number | null = null

const initStarsEffect = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const stage = stageRef.value
  if (!stage) return

  canvas.width = stage.offsetWidth
  canvas.height = stage.offsetHeight

  const context = canvas.getContext('2d')
  if (!context) return

  type Star = {
    x: number
    y: number
    size: number
    opacity: number
    twinkleSpeed: number
  }

  const stars: Star[] = []

  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 0.5 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.8,
      twinkleSpeed: 0.01 + Math.random() * 0.03
    })
  }

  let time = 0

  const update = () => {
    context.fillStyle = 'rgba(5, 5, 20, 0.05)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    time += 0.01

    stars.forEach(star => {
      star.opacity = 0.2 + Math.sin(time * star.twinkleSpeed * 100) * 0.3 + 0.5

      const gradient = context.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.size * 3
      )

      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
      gradient.addColorStop(0.5, `rgba(200, 220, 255, ${star.opacity * 0.5})`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      context.fillStyle = gradient
      context.beginPath()
      context.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
      context.fill()
    })

    starsAnimationId = requestAnimationFrame(update)
  }

  update()
}

onMounted(() => {
  ctx = gsap.context(() => {
    const stage = stageRef.value
    const container = containerRef.value
    if (!stage || !container) return

    initStarsEffect()

    const chars = gsap.utils.toArray('.st-char-181') as HTMLElement[]
    const stars = gsap.utils.toArray('.st-star-181') as HTMLElement[]
    const shootingStars = gsap.utils.toArray('.st-shooting-181') as HTMLElement[]
    const constellationDots = gsap.utils.toArray('.st-constellation-dot-181') as HTMLElement[]
    const title = stage.querySelector('.st-title-181')

    if (title) {
      gsap.fromTo(title,
        { opacity: 0, scale: 0.9, filter: 'blur(5px)' },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1
          },
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)'
        }
      )

      gsap.to(title, {
        textShadow: '0 0 20px #ffd700, 0 0 40px #ffff00, 0 0 60px #fff8dc',
        duration: 2,
        repeat: -1,
        yoyo: true
      })
    }

    gsap.fromTo(stars,
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 70%',
          end: 'top 50%',
          scrub: 1
        },
        scale: 1,
        opacity: 1,
        stagger: 0.03
      }
    )

    stars.forEach((star, i) => {
      gsap.to(star, {
        opacity: 0.3 + Math.random() * 0.7,
        scale: 0.5 + Math.random() * 0.5,
        duration: 0.5 + Math.random() * 1.5,
        repeat: -1,
        yoyo: true,
        delay: i * 0.05
      })
    })

    gsap.fromTo(chars,
      {
        color: '#0a0a20',
        textShadow: 'none',
        opacity: 0,
        rotateY: 45
      },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'center 50%',
          scrub: 1
        },
        color: '#ffd700',
        textShadow: '0 0 15px #ffff00, 0 0 30px #fff8dc',
        opacity: 1,
        rotateY: 0,
        stagger: 0.08
      }
    )

    chars.forEach((char) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, {
          color: '#fff',
          textShadow: '0 0 40px #ffd700, 0 0 80px #ffff00',
          scale: 1.3,
          rotateY: 15,
          duration: 0.3
        })
      })
      char.addEventListener('mouseleave', () => {
        gsap.to(char, {
          color: '#ffd700',
          textShadow: '0 0 15px #ffff00, 0 0 30px #fff8dc',
          scale: 1,
          rotateY: 0,
          duration: 0.3
        })
      })
    })

    gsap.fromTo(shootingStars,
      { opacity: 0, x: -200 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 50%',
          end: 'bottom 30%',
          scrub: 1
        },
        opacity: 1,
        x: 0,
        stagger: 0.2
      }
    )

    shootingStars.forEach((shooting) => {
      gsap.to(shooting, {
        x: '+=300',
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: 'none'
      })
    })

    gsap.fromTo(constellationDots,
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 40%',
          end: 'bottom 20%',
          scrub: 1
        },
        scale: 1,
        opacity: 0.8,
        stagger: 0.1
      }
    )

    gsap.to(container, {
      boxShadow: '0 0 60px rgba(255, 215, 0, 0.4), 0 0 100px rgba(255, 255, 0, 0.2)',
      scrollTrigger: {
        trigger: stage,
        start: 'top 30%',
        end: 'bottom 10%',
        scrub: 1
      }
    })

  }, stageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (starsAnimationId !== null) {
    cancelAnimationFrame(starsAnimationId)
  }
})
</script>

<style scoped lang="scss">
.star-text-wrapper-181 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #0a0a30 0%, #050515 50%, #000005 100%);
  overflow: hidden;

  opacity: 1 !important;}

.st-stage-181 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.st-stars-bg-181 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.st-stars-canvas-181 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.5;
}

.st-nebula-layer-181 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(147, 112, 219, 0.15), transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(255, 182, 193, 0.1), transparent 50%);
  pointer-events: none;

  opacity: 1 !important;}

.st-star-container-181 {
  position: relative;
  text-align: center;
  padding: 100px 80px;
  background: rgba(10, 10, 40, 0.6);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.st-title-181 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 6px;
  margin-bottom: 30px;

  opacity: 1 !important;}

.st-twinkling-stars-181 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.st-star-181 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #ffd700, 0 0 20px #ffff00;

  opacity: 1 !important;}

.st-star-text-181 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 50px 0;
  perspective: 1000px;

  opacity: 1 !important;}

.st-char-181 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  color: #ffd700;
  transition: all 0.3s ease;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.st-shooting-stars-181 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.st-shooting-181 {
  position: absolute;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, #fff, transparent);
  transform-origin: left center;
  box-shadow: 0 0 10px #ffd700;

  opacity: 1 !important;}

.st-constellation-181 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.st-constellation-dot-181 {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #ffd700;
  border-radius: 50%;
  box-shadow: 0 0 15px #ffff00, 0 0 30px #ffd700;

  opacity: 1 !important;}
</style>
