<template>
  <div class="slt-liquid-text-section-186" ref="componentRoot">
    <div class="slt-container-186">
      <h2 class="slt-title-186">液体文字变形</h2>
      <p class="slt-subtitle-186">Liquid Text Morph</p>

      <div class="slt-text-stage-186">
        <div class="slt-liquid-pool-186" ref="liquidPool">
          <canvas ref="liquidCanvas"></canvas>
        </div>

        <div class="slt-text-container-186">
          <div
            v-for="(item, index) in liquidTexts"
            :key="index"
            class="slt-text-row-186"
            :ref="el => { if (el) textRowRefs[index] = el as HTMLElement }"
          >
            <div class="slt-letters-186">
              <span
                v-for="(char, charIndex) in item.letters"
                :key="charIndex"
                class="slt-letter-186"
                :ref="el => { if (el) letterRefs[`${index}-${charIndex}`] = el as HTMLElement }"
              >{{ char }}</span>
            </div>
          </div>
        </div>

        <div class="slt-droplet-container-186">
          <div
            v-for="n in 20"
            :key="n"
            class="slt-droplet-186"
            :ref="el => { if (el) dropletRefs[n] = el as HTMLElement }"
          ></div>
        </div>
      </div>

      <div class="slt-wave-lines-186">
        <div
          v-for="n in 8"
          :key="n"
          class="slt-wave-line-186"
          :ref="el => { if (el) waveLineRefs[n] = el as HTMLElement }"
        ></div>
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
const textRowRefs = ref<HTMLElement[]>([])
const letterRefs = ref<Record<string, HTMLElement>>({})
const dropletRefs = ref<Record<number, HTMLElement>>({})
const waveLineRefs = ref<Record<number, HTMLElement>>({})
const liquidPool = ref<HTMLElement>()
const liquidCanvas = ref<HTMLCanvasElement>()

interface LiquidText {
  letters: string[]
}

const liquidTexts: LiquidText[] = [
  { letters: ['F', 'L', 'O', 'W'] },
  { letters: ['M', 'E', 'L', 'T'] },
  { letters: ['M', 'O', 'R', 'P', 'H'] }
]

let ctx: gsap.Context
let animationFrame: number
let liquidParticles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; phase: number }> = []

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.slt-title-186', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.slt-subtitle-186', componentRoot.value)
      const textRows = gsap.utils.toArray<HTMLElement>('.slt-text-row-186', componentRoot.value)
      const droplets = gsap.utils.toArray<HTMLElement>('.slt-droplet-186', componentRoot.value)
      const waveLines = gsap.utils.toArray<HTMLElement>('.slt-wave-line-186', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          filter: 'blur(15px)',
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 液体文字变形动画
      textRows.forEach((row: HTMLElement, index: number) => {
        const letterSpans = Object.keys(letterRefs.value)
          .filter(key => key.startsWith(`${index}-`))
          .map(key => letterRefs.value[key])

        // 初始状态 - 字母分散
        letterSpans.forEach((span: HTMLElement, spanIndex: number) => {
          const offsetX = (Math.random() - 0.5) * 200
          const offsetY = (Math.random() - 0.5) * 100
          const rotate = (Math.random() - 0.5) * 180

          gsap.set(span, {
            x: offsetX,
            y: offsetY,
            rotate: rotate,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0.2 + Math.random() * 0.4,
            filter: 'blur(5px)'
          })
        })

        // 滚动变形动画
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.8
          }
        })

        // 第一阶段：聚集
        letterSpans.forEach((span: HTMLElement, spanIndex: number) => {
          const delay = spanIndex * 0.05

          tl.to(span, {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'back.out(1.7)'
          }, delay)
        })

        // 第二阶段：波浪扭曲
        letterSpans.forEach((span: HTMLElement, spanIndex: number) => {
          const waveY = Math.sin(spanIndex * 0.5) * 20

          tl.to(span, {
            y: waveY,
            skewX: 10,
            ease: 'sine.inOut'
          }, 1.5)
        })

        // 第三阶段：液体流动
        letterSpans.forEach((span: HTMLElement, spanIndex: number) => {
          const flowX = Math.sin(spanIndex * 0.8) * 30

          tl.to(span, {
            x: flowX,
            y: 0,
            skewX: 0,
            skewY: 5,
            ease: 'sine.inOut'
          }, 2.5)
        })

        // 第四阶段：恢复
        letterSpans.forEach((span: HTMLElement) => {
          tl.to(span, {
            x: 0,
            y: 0,
            skewY: 0,
            ease: 'power2.out'
          }, 3.5)
        })

        // 整体效果
        tl.to(row, {
          scale: 1.1,
          ease: 'power1.inOut'
        }, 2)

        tl.to(row, {
          scale: 1,
          ease: 'power1.inOut'
        }, 3.5)
      })

      // 液体池Canvas动画
      initLiquidPool()

      // 水滴动画
      if (droplets.length) {
        gsap.from(droplets, {
          scrollTrigger: {
            trigger: componentRoot.value,
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

        // 持续下落
        droplets.forEach((droplet: HTMLElement, index: number) => {
          gsap.to(droplet, {
            y: 100 + Math.random() * 200,
            duration: 2 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
          })

          // 涟漪效果
          gsap.to(droplet, {
            scale: 1.5,
            opacity: 0.3,
            duration: 1.5 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        })
      }

      // 波浪线动画
      if (waveLines.length) {
        gsap.from(waveLines, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleX: 0,
          duration: 1.5,
          stagger: {
            each: 0.1,
            from: 'center'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        // 持续波动
        waveLines.forEach((line: HTMLElement, index: number) => {
          gsap.to(line, {
            scaleY: 0.5 + Math.sin(index * 0.5) * 0.5,
            y: -10 + Math.sin(index * 0.8) * 20,
            duration: 2 + index * 0.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        })
      }
    }, componentRoot.value)
  }, 100)
})

function initLiquidPool() {
  const canvas = liquidCanvas.value
  if (!canvas || !liquidPool.value) return

  const pool = liquidPool.value
  canvas.width = pool.offsetWidth
  canvas.height = pool.offsetHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 创建液体粒子
  for (let i = 0; i < 60; i++) {
    liquidParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: 15 + Math.random() * 25,
      phase: Math.random() * Math.PI * 2
    })
  }

  let time = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    time += 0.02

    liquidParticles.forEach((p, i) => {
      p.x += p.vx
      p.y += p.vy

      // 边界反弹
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      // 波动效果
      const waveY = Math.sin(p.phase + time) * 10
      const dynamicRadius = p.radius + Math.sin(p.phase * 2 + time * 1.5) * 8

      // 创建渐变
      const gradient = ctx.createRadialGradient(p.x, p.y + waveY, 0, p.x, p.y + waveY, dynamicRadius)
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.6)')
      gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.3)')
      gradient.addColorStop(1, 'rgba(244, 63, 94, 0)')

      ctx.beginPath()
      ctx.arc(p.x, p.y + waveY, dynamicRadius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    })

    animationFrame = requestAnimationFrame(animate)
  }

  animate()
}

onUnmounted(() => {
  ctx?.revert()
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped lang="scss">
.slt-liquid-text-section-186 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #0a1a2a 50%, #1a0a2a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.slt-container-186 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.slt-title-186 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.slt-subtitle-186 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(6, 182, 212, 0.6);
  margin-bottom: 120px;
  letter-spacing: 0.5em;
  text-transform: uppercase;

  opacity: 1 !important;}

.slt-text-stage-186 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 60px;

  opacity: 1 !important;}

.slt-liquid-pool-186 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

.slt-liquid-pool-186 canvas {
  width: 100%;
  height: 100%;
}

.slt-text-container-186 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  z-index: 1;
}

.slt-text-row-186 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.slt-letters-186 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.1em;
  font-size: clamp(5rem, 12vw, 8rem);
  font-weight: 900;

  opacity: 1 !important;}

.slt-letter-186 {
  position: relative;
  display: inline-block;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
  transition: all 0.5s ease;

  opacity: 1 !important;}

.slt-droplet-container-186 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.slt-droplet-186 {
  position: absolute;
  width: 8px;
  height: 12px;
  background: radial-gradient(ellipse at center, rgba(6, 182, 212, 0.8) 0%, rgba(59, 130, 246, 0.3) 70%, transparent 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;

  opacity: 1 !important;}

.slt-wave-lines-186 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.slt-wave-line-186 {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3), transparent);
  transform-origin: left center;

  opacity: 1 !important;}

@for $i from 1 through 8 {
  .slt-wave-line-186:nth-child(#{$i}) {
    bottom: #{($i - 1) * 12 + 5}%;
    opacity: #{1 - ($i - 1) * 0.12};
  }
}

@media (max-width: 768px) {
  .slt-text-container-186 {
    gap: 50px;
  }

  .slt-letters-186 {
    font-size: 4rem;
  
  opacity: 1 !important;}
}
</style>
