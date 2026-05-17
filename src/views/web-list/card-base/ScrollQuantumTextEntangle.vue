<template>
  <div class="qte-quantum-text-section-166" ref="componentRoot">
    <div class="qte-container-166">
      <h2 class="qte-title-166">量子文字纠缠</h2>
      <p class="qte-subtitle-166">Quantum Text Entanglement</p>

      <div class="qte-text-stage-166">
        <div class="qte-quantum-container-166">
          <div
            v-for="(text, index) in quantumTexts"
            :key="index"
            class="qte-quantum-text-166"
            :ref="el => { if (el) textRefs[index] = el as HTMLElement }"
          >
            <div class="qte-particle-layer-166" :ref="el => { if (el) particleRefs[index] = el as HTMLElement }">
              <span
                v-for="(char, charIndex) in text.chars"
                :key="charIndex"
                class="qte-particle-166"
                :ref="el => { if (el) charRefs[`${index}-${charIndex}`] = el as HTMLElement }"
              >{{ char }}</span>
            </div>
            <span class="qte-entangled-166">{{ text.entangled }}</span>
          </div>
        </div>

        <div class="qte-quantum-field-166" ref="quantumField">
          <canvas ref="quantumCanvas"></canvas>
        </div>

        <div class="qte-progress-ring-166" ref="progressRing">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="rgba(168, 85, 247, 0.1)"
              stroke-width="2"
            />
            <circle
              ref="progressCircle"
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#gradient-166)"
              stroke-width="3"
              stroke-linecap="round"
              stroke-dasharray="502.65"
              stroke-dashoffset="502.65"
              transform="rotate(-90 100 100)"
            />
            <defs>
              <linearGradient id="gradient-166" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#a855f7" />
                <stop offset="50%" stop-color="#ec4899" />
                <stop offset="100%" stop-color="#f43f5e" />
              </linearGradient>
            </defs>
            <text
              ref="progressText"
              x="100"
              y="105"
              text-anchor="middle"
              fill="white"
              font-size="24"
              font-weight="bold"
              class="qte-progress-text-166"
            >0%</text>
          </svg>
        </div>
      </div>

      <div class="qte-entanglement-lines-166">
        <div
          v-for="n in 12"
          :key="n"
          class="qte-entangle-line-166"
          :ref="el => { if (el) lineRefs[n] = el as HTMLElement }"
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
const textRefs = ref<HTMLElement[]>([])
const particleRefs = ref<HTMLElement[]>({})
const charRefs = ref<Record<string, HTMLElement>>({})
const lineRefs = ref<Record<number, HTMLElement>>({})
const progressRing = ref<HTMLElement>()
const progressCircle = ref<SVGCircleElement>()
const progressText = ref<SVGTextElement>()
const quantumField = ref<HTMLElement>()
const quantumCanvas = ref<HTMLCanvasElement>()

interface QuantumText {
  chars: string[]
  entangled: string
}

const quantumTexts: QuantumText[] = [
  { chars: ['量', '子'], entangled: 'QUANTUM' },
  { chars: ['纠', '缠'], entangled: 'ENTANGLE' },
  { chars: ['超', '距'], entangled: 'DISTANCE' }
]

let ctx: gsap.Context
let animationFrame: number
let particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number }> = []

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.qte-title-166', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.qte-subtitle-166', componentRoot.value)
      const quantumTextsEl = gsap.utils.toArray<HTMLElement>('.qte-quantum-text-166', componentRoot.value)
      const particleLayers = gsap.utils.toArray<HTMLElement>('.qte-particle-layer-166', componentRoot.value)
      const entangledTexts = gsap.utils.toArray<HTMLElement>('.qte-entangled-166', componentRoot.value)
      const entangleLines = gsap.utils.toArray<HTMLElement>('.qte-entangle-line-166', componentRoot.value)

      // 标题动画 - 故障效果
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          filter: 'blur(20px)',
          scale: 1.2,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)'
        })

        // 标题故障闪烁
        gsap.to(titleEl, {
          textShadow: '5px 0 #ff0000, -5px 0 #00ffff',
          duration: 0.1,
          repeat: 10,
          yoyo: true,
          ease: 'none',
          delay: 1.2
        })

        gsap.to(titleEl, {
          textShadow: 'none',
          duration: 0.3,
          ease: 'power2.out'
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
          letterSpacing: '1em',
          duration: 1,
          delay: 0.3,
          ease: 'power3.out'
        })
      }

      // 量子文字纠缠动画
      quantumTextsEl.forEach((textEl: HTMLElement, index: number) => {
        const particleLayer = particleRefs.value[index]
        const entangled = entangledTexts[index]
        const particleSpans = Object.keys(charRefs.value)
          .filter(key => key.startsWith(`${index}-`))
          .map(key => charRefs.value[key])

        // 初始状态 - 粒子散开
        gsap.set(particleLayer, {
          opacity: 1,
          scale: 1
        })

        particleSpans.forEach((span: HTMLElement, spanIndex: number) => {
          const angle = (spanIndex / particleSpans.length) * Math.PI * 2
          const distance = 100 + Math.random() * 50

          gsap.set(span, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0.3,
            rotation: Math.random() * 360
          })
        })

        gsap.set(entangled, {
          opacity: 0,
          scale: 2,
          filter: 'blur(30px)',
          letterSpacing: '1em'
        })

        // 滚动纠缠动画
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: textEl,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.7
          }
        })

        // 粒子向中心聚集
        particleSpans.forEach((span: HTMLElement, spanIndex: number) => {
          const delay = spanIndex * 0.05

          tl.to(span, {
            x: 0,
            y: 0,
            opacity: 1,
            rotation: 0,
            ease: 'power2.inOut'
          }, delay)
        })

        // 粒子层缩小并淡出
        tl.to(particleLayer, {
          opacity: 0,
          scale: 0.5,
          filter: 'blur(10px)',
          ease: 'power2.in'
        }, 0.5)

        // 纠缠文字淡入
        tl.to(entangled, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          letterSpacing: '0.2em',
          ease: 'power2.out'
        }, 0.6)

        // 3D旋转效果
        tl.to(textEl, {
          rotateY: 360,
          rotateX: 15,
          ease: 'none'
        }, 0)

        // 能量波动
        tl.to(textEl, {
          scale: 1.1,
          ease: 'power1.inOut'
        }, 0.3)

        tl.to(textEl, {
          scale: 1,
          ease: 'power1.inOut'
        }, 0.7)
      })

      // 量子场Canvas动画
      initQuantumField()

      // 纠缠线动画
      if (entangleLines.length) {
        gsap.from(entangleLines, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleY: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.05,
            from: 'center'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        // 持续波动
        entangleLines.forEach((line: HTMLElement, index: number) => {
          const isLeft = index < 6
          const baseX = isLeft ? index * 15 : (11 - index) * 15

          gsap.set(line, { left: `${baseX}%` })

          gsap.to(line, {
            scaleY: 0.5 + Math.random() * 1.5,
            duration: 1.5 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.1
          })

          // 横向漂移
          gsap.to(line, {
            x: isLeft ? -20 : 20,
            duration: 3 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        })
      }

      // 进度环动画
      if (progressCircle.value && progressText.value) {
        const totalLength = 502.65

        gsap.to(progressCircle.value, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          ease: 'none'
        })

        // 进度文字和颜色
        ScrollTrigger.create({
          trigger: componentRoot.value,
          start: 'top 80%',
          end: 'bottom 20%',
          onUpdate: (self) => {
            const progress = Math.round(self.progress * 100)
            const hue = 260 + progress * 0.8

            if (progressText.value) {
              progressText.value.textContent = `${progress}%`
            }

            gsap.set(progressCircle.value, {
              stroke: `hsl(${hue}, 80%, 60%)`,
              filter: `drop-shadow(0 0 10px hsl(${hue}, 80%, 60%))`
            })
          }
        })

        // 环的旋转
        gsap.to(progressRing.value, {
          rotate: 360,
          duration: 20,
          repeat: -1,
          ease: 'none'
        })
      }
    }, componentRoot.value)
  }, 100)
})

function initQuantumField() {
  const canvas = quantumCanvas.value
  if (!canvas || !quantumField.value) return

  const field = quantumField.value
  canvas.width = field.offsetWidth
  canvas.height = field.offsetHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 创建粒子
  const particleCount = 80
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.4
    })
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制粒子
    particles.forEach((p, i) => {
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`
      ctx.fill()

      // 绘制连接线
      particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(236, 72, 153, ${(1 - distance / 120) * 0.3})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
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
.qte-quantum-text-section-166 {
  min-height: 100vh;
  padding: 120px 20px;
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a1a 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.qte-container-166 {
  position: relative;
  max-width: 1600px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.qte-title-166 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7, #ec4899, #f43f5e, #ff6b35);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift-166 8s ease infinite;

  opacity: 1 !important;}

@keyframes gradientShift-166 {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.qte-subtitle-166 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(168, 85, 247, 0.6);
  margin-bottom: 140px;
  letter-spacing: 0.5em;
  text-transform: uppercase;

  opacity: 1 !important;}

.qte-text-stage-166 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 100px;

  opacity: 1 !important;}

.qte-quantum-container-166 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 120px;
}

.qte-quantum-text-166 {
  position: relative;
  width: 500px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.qte-particle-layer-166 {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.1em;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;

  opacity: 1 !important;}

.qte-particle-166 {
  position: relative;
  display: inline-block;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.8));
  transition: all 0.3s ease;

  opacity: 1 !important;}

.qte-entangled-166 {
  position: absolute;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(236, 72, 153, 0.8));

  opacity: 1 !important;}

.qte-quantum-field-166 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}

.qte-quantum-field-166 canvas {
  width: 100%;
  height: 100%;
}

.qte-progress-ring-166 {
  position: absolute;
  bottom: 80px;
  right: 80px;
  width: 200px;
  height: 200px;

  opacity: 1 !important;}

.qte-progress-text-166 {
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 10px rgba(168, 85, 247, 0.8);
}

.qte-entanglement-lines-166 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.qte-entangle-line-166 {
  position: absolute;
  width: 1px;
  height: 80px;
  background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4), transparent);
  transform-origin: top center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .qte-quantum-text-166 {
    width: 320px;
    height: 90px;
  
  opacity: 1 !important;}

  .qte-quantum-container-166 {
    gap: 80px;
  }

  .qte-progress-ring-166 {
    bottom: 40px;
    right: 50%;
    transform: translateX(50%);
    width: 150px;
    height: 150px;
  
  opacity: 1 !important;}

  .qte-entangle-line-166 {
    height: 50px;
  
  opacity: 1 !important;}
}
</style>
