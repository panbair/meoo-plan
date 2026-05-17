<template>
  <div class="ice-text-wrapper-179">
    <div class="it-stage-179" ref="stageRef">
      <div class="it-ice-bg-179">
        <canvas class="it-ice-canvas-179" ref="iceCanvasRef"></canvas>
      </div>
      <div class="it-crystal-layer-179">
        <div class="it-crystal-179" v-for="i in 15" :key="i"></div>
      </div>
      <div class="it-ice-container-179" ref="containerRef">
        <h2 class="it-title-179">FROST GLACIER</h2>
        <div class="it-snowflakes-179">
          <div class="it-snowflake-179" v-for="i in 50" :key="i">❄</div>
        </div>
        <div class="it-ice-text-179">
          <span class="it-char-179" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="it-frost-lines-179">
          <div class="it-frost-line-179" v-for="i in 8" :key="i"></div>
        </div>
      </div>
      <div class="it-freeze-rays-179">
        <div class="it-freeze-ray-179" v-for="i in 6" :key="i"></div>
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
const iceCanvasRef = ref<HTMLCanvasElement>()
const text = 'ARCTIC FROST'

let ctx: gsap.Context
let iceAnimationId: number | null = null

// 冰晶效果
const initIceEffect = () => {
  const canvas = iceCanvasRef.value
  if (!canvas) return

  const stage = stageRef.value
  if (!stage) return

  canvas.width = stage.offsetWidth
  canvas.height = stage.offsetHeight

  const context = canvas.getContext('2d')
  if (!context) return

  type Particle = {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    angle: number
  }

  const particles: Particle[] = []

  const createParticle = (): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * 0.5,
      size: 1 + Math.random() * 3,
      angle: Math.random() * Math.PI * 2
    }
  }

  for (let i = 0; i < 80; i++) {
    particles.push(createParticle())
  }

  const update = () => {
    context.fillStyle = 'rgba(5, 20, 40, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.angle += 0.02

      if (particle.x < 0) particle.x = canvas.width
      if (particle.x > canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = canvas.height
      if (particle.y > canvas.height) particle.y = 0

      const gradient = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 3
      )

      gradient.addColorStop(0, `rgba(200, 230, 255, ${0.6 + Math.sin(particle.angle) * 0.2})`)
      gradient.addColorStop(0.5, `rgba(150, 200, 255, 0.3)`)
      gradient.addColorStop(1, 'rgba(100, 180, 255, 0)')

      context.fillStyle = gradient
      context.beginPath()
      context.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
      context.fill()
    })

    iceAnimationId = requestAnimationFrame(update)
  }

  update()
}

onMounted(() => {
  ctx = gsap.context(() => {
    const stage = stageRef.value
    const container = containerRef.value
    if (!stage || !container) return

    initIceEffect()

    const chars = gsap.utils.toArray('.it-char-179') as HTMLElement[]
    const snowflakes = gsap.utils.toArray('.it-snowflake-179') as HTMLElement[]
    const crystals = gsap.utils.toArray('.it-crystal-179') as HTMLElement[]
    const frostLines = gsap.utils.toArray('.it-frost-line-179') as HTMLElement[]
    const freezeRays = gsap.utils.toArray('.it-freeze-ray-179') as HTMLElement[]
    const title = stage.querySelector('.it-title-179')

    // 标题冰霜效果
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

      // 标题冰晶闪烁
      gsap.to(title, {
        textShadow: '0 0 20px #87ceeb, 0 0 40px #add8e6, 0 0 60px #b0e0e6',
        duration: 2,
        repeat: -1,
        yoyo: true
      })
    }

    // 冰晶背景
    gsap.fromTo(crystals,
      { scale: 0, opacity: 0, rotate: Math.random() * 360 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 70%',
          end: 'top 50%',
          scrub: 1
        },
        scale: 1,
        opacity: 0.6,
        rotate: 0,
        stagger: 0.1
      }
    )

    crystals.forEach((crystal, i) => {
      gsap.to(crystal, {
        rotate: 30 + Math.random() * 60,
        duration: 4 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        delay: i * 0.2
      })
    })

    // 雪花飘落
    gsap.fromTo(snowflakes,
      { opacity: 0, scale: 0, y: -50 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1
        },
        opacity: 0.8,
        scale: 1,
        y: 100,
        stagger: 0.02
      }
    )

    snowflakes.forEach((snowflake, i) => {
      const duration = 3 + Math.random() * 4
      gsap.to(snowflake, {
        x: Math.sin(i * 0.5) * 50,
        y: `+=${100 + Math.random() * 200}`,
        duration: duration,
        repeat: -1,
        ease: 'none'
      })
    })

    // 冰霜文字动画
    gsap.fromTo(chars,
      {
        color: '#001a33',
        textShadow: 'none',
        opacity: 0,
        y: -30
      },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 50%',
          end: 'center 50%',
          scrub: 1
        },
        color: '#87ceeb',
        textShadow: '0 0 10px #add8e6, 0 0 20px #b0e0e6',
        opacity: 1,
        y: 0,
        stagger: 0.08
      }
    )

    // 字符悬停结冰效果
    chars.forEach((char) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, {
          color: '#fff',
          textShadow: '0 0 30px #87ceeb, 0 0 60px #add8e6, 0 0 90px #b0e0e6',
          scale: 1.2,
          filter: 'brightness(1.5)',
          duration: 0.3
        })
      })
      char.addEventListener('mouseleave', () => {
        gsap.to(char, {
          color: '#87ceeb',
          textShadow: '0 0 10px #add8e6, 0 0 20px #b0e0e6',
          scale: 1,
          filter: 'brightness(1)',
          duration: 0.3
        })
      })
    })

    // 霜纹效果
    gsap.fromTo(frostLines,
      { scaleX: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 40%',
          end: 'bottom 20%',
          scrub: 1
        },
        scaleX: 1,
        opacity: 0.7,
        stagger: 0.15
      }
    )

    frostLines.forEach((line, i) => {
      gsap.to(line, {
        scaleX: 0.8 + Math.random() * 0.4,
        opacity: 0.4 + Math.random() * 0.4,
        duration: 1.5 + Math.random() * 1.5,
        repeat: -1,
        yoyo: true,
        delay: i * 0.2
      })
    })

    // 冻结光线
    gsap.fromTo(freezeRays,
      { scaleY: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 30%',
          end: 'bottom 10%',
          scrub: 1
        },
        scaleY: 1,
        opacity: 0.5,
        stagger: 0.2
      }
    )

    freezeRays.forEach((ray, i) => {
      gsap.to(ray, {
        scaleY: 0.7 + Math.random() * 0.6,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        delay: i * 0.3
      })
    })

    // 容器冰霜效果
    gsap.to(container, {
      boxShadow: '0 0 60px rgba(135, 206, 235, 0.5), 0 0 100px rgba(173, 216, 230, 0.3), inset 0 0 40px rgba(135, 206, 235, 0.1)',
      borderColor: '#87ceeb',
      scrollTrigger: {
        trigger: stage,
        start: 'top 20%',
        end: 'bottom 0%',
        scrub: 1
      }
    })

  }, stageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (iceAnimationId !== null) {
    cancelAnimationFrame(iceAnimationId)
  }
})
</script>

<style scoped lang="scss">
.ice-text-wrapper-179 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #051025 0%, #0a1525 50%, #051025 100%);
  overflow: hidden;

  opacity: 1 !important;}

.it-stage-179 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.it-ice-bg-179 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.it-ice-canvas-179 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
}

.it-crystal-layer-179 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.it-crystal-179 {
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(135, 206, 235, 0.4), rgba(173, 216, 230, 0.2));
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  transform-origin: center;

  opacity: 1 !important;}

.it-ice-container-179 {
  position: relative;
  text-align: center;
  padding: 100px 80px;
  background: rgba(10, 30, 50, 0.7);
  border: 2px solid rgba(135, 206, 235, 0.3);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.it-title-179 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: #87ceeb;
  text-transform: uppercase;
  letter-spacing: 6px;
  margin-bottom: 30px;

  opacity: 1 !important;}

.it-snowflakes-179 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  font-size: 20px;

  opacity: 1 !important;}

.it-snowflake-179 {
  position: absolute;
  color: #fff;
  opacity: 0.8;
  text-shadow: 0 0 10px #87ceeb;
}

.it-ice-text-179 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 50px 0;

  opacity: 1 !important;}

.it-char-179 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  color: #87ceeb;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.it-frost-lines-179 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 60px;
}

.it-frost-line-179 {
  width: 3px;
  height: 150px;
  background: linear-gradient(180deg, transparent, rgba(135, 206, 235, 0.6), rgba(173, 216, 230, 0.3), transparent);
  border-radius: 2px;
  transform-origin: center;

  opacity: 1 !important;}

.it-freeze-rays-179 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  pointer-events: none;

  opacity: 1 !important;}

.it-freeze-ray-179 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 50%;
  background: linear-gradient(180deg, transparent, rgba(135, 206, 235, 0.4), transparent);
  transform-origin: top center;

  opacity: 1 !important;}
</style>
