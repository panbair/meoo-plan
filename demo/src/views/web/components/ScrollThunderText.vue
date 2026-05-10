<template>
  <div class="thunder-text-wrapper-180">
    <div class="tt-stage-180" ref="stageRef">
      <div class="tt-thunder-bg-180">
        <canvas class="tt-lightning-canvas-180" ref="canvasRef"></canvas>
      </div>
      <div class="tt-thunder-container-180" ref="containerRef">
        <h2 class="tt-title-180">THUNDER STRIKE</h2>
        <div class="tt-bolts-180">
          <div class="tt-bolt-180" v-for="i in 6" :key="i"></div>
        </div>
        <div class="tt-thunder-text-180">
          <span class="tt-char-180" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="tt-electric-arcs-180">
          <div class="tt-arc-180" v-for="i in 5" :key="i"></div>
        </div>
      </div>
      <div class="tt-spark-particles-180">
        <div class="tt-spark-180" v-for="i in 40" :key="i"></div>
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
const text = 'ELECTRIC POWER'

let ctx: gsap.Context
let lightningAnimationId: number | null = null

const initLightningEffect = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const stage = stageRef.value
  if (!stage) return

  canvas.width = stage.offsetWidth
  canvas.height = stage.offsetHeight

  const context = canvas.getContext('2d')
  if (!context) return

  type Flash = {
    x: number
    y: number
    points: { x: number; y: number }[]
    life: number
    opacity: number
  }

  const flashes: Flash[] = []

  const createFlash = (): Flash => {
    const x = Math.random() * canvas.width
    const points: { x: number; y: number }[] = []
    let currentX = x
    let currentY = 0

    for (let i = 0; i < 15; i++) {
      points.push({ x: currentX, y: currentY })
      currentX += (Math.random() - 0.5) * 40
      currentY += canvas.height / 15
    }

    return {
      x,
      y: 0,
      points,
      life: 1,
      opacity: 0.8 + Math.random() * 0.2
    }
  }

  const update = () => {
    context.fillStyle = 'rgba(5, 10, 25, 0.15)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    if (Math.random() < 0.03 && flashes.length < 3) {
      flashes.push(createFlash())
    }

    flashes.forEach((flash, index) => {
      flash.life -= 0.02

      if (flash.life <= 0) {
        flashes.splice(index, 1)
        return
      }

      context.beginPath()
      context.moveTo(flash.points[0].x, flash.points[0].y)

      flash.points.forEach(point => {
        context.lineTo(point.x, point.y)
      })

      context.strokeStyle = `rgba(180, 200, 255, ${flash.opacity * flash.life})`
      context.lineWidth = 3
      context.lineCap = 'round'
      context.stroke()

      context.strokeStyle = `rgba(255, 255, 255, ${flash.opacity * flash.life * 0.5})`
      context.lineWidth = 1
      context.stroke()
    })

    lightningAnimationId = requestAnimationFrame(update)
  }

  update()
}

onMounted(() => {
  ctx = gsap.context(() => {
    const stage = stageRef.value
    const container = containerRef.value
    if (!stage || !container) return

    initLightningEffect()

    const chars = gsap.utils.toArray('.tt-char-180') as HTMLElement[]
    const bolts = gsap.utils.toArray('.tt-bolt-180') as HTMLElement[]
    const arcs = gsap.utils.toArray('.tt-arc-180') as HTMLElement[]
    const sparks = gsap.utils.toArray('.tt-spark-180') as HTMLElement[]
    const title = stage.querySelector('.tt-title-180')

    if (title) {
      gsap.fromTo(title,
        { opacity: 0, scale: 0.8, filter: 'blur(8px)' },
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
        textShadow: '0 0 30px #7b68ee, 0 0 60px #9370db, 0 0 90px #ba55d3',
        duration: 0.3,
        repeat: -1,
        yoyo: true
      })
    }

    gsap.fromTo(bolts,
      { scaleY: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 70%',
          end: 'top 50%',
          scrub: 1
        },
        scaleY: 1,
        opacity: 1,
        stagger: 0.1
      }
    )

    bolts.forEach((bolt) => {
      gsap.to(bolt, {
        opacity: 0.3 + Math.random() * 0.7,
        duration: 0.1 + Math.random() * 0.2,
        repeat: -1,
        yoyo: true
      })
    })

    gsap.fromTo(chars,
      {
        color: '#1a0033',
        textShadow: 'none',
        opacity: 0,
        scale: 0.5
      },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'center 50%',
          scrub: 1
        },
        color: '#e6e6fa',
        textShadow: '0 0 15px #9370db, 0 0 30px #ba55d3',
        opacity: 1,
        scale: 1,
        stagger: 0.06
      }
    )

    chars.forEach((char) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, {
          color: '#fff',
          textShadow: '0 0 40px #9370db, 0 0 80px #ba55d3, 0 0 120px #da70d6',
          scale: 1.3,
          duration: 0.2
        })
      })
      char.addEventListener('mouseleave', () => {
        gsap.to(char, {
          color: '#e6e6fa',
          textShadow: '0 0 15px #9370db, 0 0 30px #ba55d3',
          scale: 1,
          duration: 0.2
        })
      })
    })

    gsap.fromTo(arcs,
      { scaleX: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 50%',
          end: 'bottom 30%',
          scrub: 1
        },
        scaleX: 1,
        opacity: 0.8,
        stagger: 0.15
      }
    )

    gsap.fromTo(sparks,
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 40%',
          end: 'bottom 20%',
          scrub: 1
        },
        scale: 1,
        opacity: 1,
        stagger: 0.02
      }
    )

    sparks.forEach((spark) => {
      gsap.to(spark, {
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        opacity: 0.2 + Math.random() * 0.8,
        duration: 0.2 + Math.random() * 0.3,
        repeat: -1,
        yoyo: true
      })
    })

    gsap.to(container, {
      boxShadow: '0 0 80px rgba(147, 112, 219, 0.5), 0 0 120px rgba(186, 85, 211, 0.3)',
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
  if (lightningAnimationId !== null) {
    cancelAnimationFrame(lightningAnimationId)
  }
})
</script>

<style scoped lang="scss">
.thunder-text-wrapper-180 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #050a15 0%, #0a0f25 50%, #050a15 100%);
  overflow: hidden;

  opacity: 1 !important;}

.tt-stage-180 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.tt-thunder-bg-180 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.tt-lightning-canvas-180 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.6;
}

.tt-thunder-container-180 {
  position: relative;
  text-align: center;
  padding: 100px 80px;
  background: rgba(10, 15, 35, 0.7);
  border: 3px solid rgba(147, 112, 219, 0.4);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.tt-title-180 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: #ba55d3;
  text-transform: uppercase;
  letter-spacing: 6px;
  margin-bottom: 30px;

  opacity: 1 !important;}

.tt-bolts-180 {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.tt-bolt-180 {
  width: 4px;
  height: 80px;
  background: linear-gradient(180deg, #9370db, #ba55d3, #da70d6);
  transform-origin: top center;
  box-shadow: 0 0 20px #9370db, 0 0 40px #ba55d3;

  opacity: 1 !important;}

.tt-thunder-text-180 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 50px 0;

  opacity: 1 !important;}

.tt-char-180 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  color: #e6e6fa;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.tt-electric-arcs-180 {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 60px;
}

.tt-arc-180 {
  width: 150px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #9370db, #ba55d3, transparent);
  transform-origin: center;
  box-shadow: 0 0 15px #9370db;

  opacity: 1 !important;}

.tt-spark-particles-180 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.tt-spark-180 {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #9370db, 0 0 20px #ba55d3;

  opacity: 1 !important;}
</style>
