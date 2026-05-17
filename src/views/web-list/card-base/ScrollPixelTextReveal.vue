<template>
  <div class="spr-pixel-text-section-185" ref="componentRoot">
    <div class="spr-container-185">
      <h2 class="spr-title-185">像素文字揭示</h2>
      <p class="spr-subtitle-185">Pixel Text Reveal</p>

      <div class="spr-text-stage-185">
        <div class="spr-grid-container-185">
          <div
            v-for="(item, index) in pixelTexts"
            :key="index"
            class="spr-text-item-185"
            :ref="el => { if (el) textItemRefs[index] = el as HTMLElement }"
          >
            <div class="spr-pixel-grid-185" :ref="el => { if (el) gridRefs[index] = el as HTMLElement }">
              <div
                v-for="n in item.pixels"
                :key="n"
                class="spr-pixel-185"
                :ref="el => { if (el) pixelRefs[`${index}-${n}`] = el as HTMLElement }"
              ></div>
            </div>
            <span class="spr-text-185" :ref="el => { if (el) finalTextRefs[index] = el as HTMLElement }">{{ item.text }}</span>
          </div>
        </div>

        <div class="spr-glitch-container-185" ref="glitchContainer">
          <div class="spr-scanline-185"></div>
          <div class="spr-noise-185"></div>
        </div>

        <div class="spr-data-stream-185">
          <div
            v-for="n in 10"
            :key="n"
            class="spr-data-column-185"
            :ref="el => { if (el) dataColumnRefs[n] = el as HTMLElement }"
          ></div>
        </div>
      </div>

      <div class="spr-circuit-lines-185">
        <div
          v-for="n in 15"
          :key="n"
          class="spr-circuit-185"
          :ref="el => { if (el) circuitRefs[n] = el as HTMLElement }"
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
const textItemRefs = ref<HTMLElement[]>([])
const gridRefs = ref<HTMLElement[]>({})
const pixelRefs = ref<Record<string, HTMLElement>>({})
const finalTextRefs = ref<HTMLElement[]>({})
const glitchContainer = ref<HTMLElement>()
const dataColumnRefs = ref<Record<number, HTMLElement>>({})
const circuitRefs = ref<Record<number, HTMLElement>>({})

interface PixelText {
  text: string
  pixels: number
}

const pixelTexts: PixelText[] = [
  { text: 'PIXEL', pixels: 64 },
  { text: 'DIGITAL', pixels: 81 },
  { text: 'MATRIX', pixels: 64 }
]

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.spr-title-185', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.spr-subtitle-185', componentRoot.value)
      const textItems = gsap.utils.toArray<HTMLElement>('.spr-text-item-185', componentRoot.value)
      const dataColumns = gsap.utils.toArray<HTMLElement>('.spr-data-column-185', componentRoot.value)
      const circuits = gsap.utils.toArray<HTMLElement>('.spr-circuit-185', componentRoot.value)

      // 标题动画 - 像素化进入
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          filter: 'blur(5px)',
          duration: 1,
          ease: 'power4.out'
        })

        // 标题故障闪烁
        gsap.to(titleEl, {
          x: -5,
          duration: 0.05,
          repeat: 5,
          yoyo: true,
          ease: 'none',
          delay: 1
        })

        gsap.to(titleEl, {
          textShadow: '3px 0 #ff0000, -3px 0 #00ffff',
          duration: 0.1,
          repeat: 10,
          yoyo: true,
          ease: 'none',
          delay: 1.2
        })

        gsap.to(titleEl, {
          x: 0,
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
          y: 30,
          opacity: 0,
          letterSpacing: '0.8em',
          duration: 1,
          delay: 0.3,
          ease: 'power3.out'
        })
      }

      // 像素文字揭示动画
      textItems.forEach((item: HTMLElement, index: number) => {
        const grid = gridRefs.value[index]
        const finalText = finalTextRefs.value[index]
        const pixels = Object.keys(pixelRefs.value)
          .filter(key => key.startsWith(`${index}-`))
          .map(key => pixelRefs.value[key])

        if (!finalText || !pixels.length) return

        // 初始状态 - 像素分散
        pixels.forEach((pixel: HTMLElement, pixelIndex: number) => {
          const x = (Math.random() - 0.5) * 400
          const y = (Math.random() - 0.5) * 200
          const scale = 0.2 + Math.random() * 0.6

          gsap.set(pixel, {
            x: x,
            y: y,
            scale: scale,
            opacity: 0.1 + Math.random() * 0.3,
            backgroundColor: ['#a855f7', '#ec4899', '#f43f5e', '#3b82f6'][Math.floor(Math.random() * 4)]
          })
        })

        gsap.set(finalText, {
          opacity: 0,
          scale: 2,
          filter: 'blur(10px)'
        })

        // 滚动像素动画
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.6
          }
        })

        // 第一阶段：像素聚合
        pixels.forEach((pixel: HTMLElement, pixelIndex: number) => {
          const delay = pixelIndex * 0.02
          const row = Math.floor(pixelIndex / 8)
          const col = pixelIndex % 8
          const targetX = (col - 3.5) * 12
          const targetY = (row - 3.5) * 12

          tl.to(pixel, {
            x: targetX,
            y: targetY,
            scale: 1,
            opacity: 0.8,
            ease: 'back.out(1.5)'
          }, delay)
        })

        // 第二阶段：像素闪烁
        pixels.forEach((pixel: HTMLElement) => {
          tl.to(pixel, {
            opacity: 0.2 + Math.random() * 0.6,
            ease: 'none'
          }, 1.5)
        })

        // 第三阶段：像素淡出
        pixels.forEach((pixel: HTMLElement, pixelIndex: number) => {
          const delay = pixelIndex * 0.01
          tl.to(pixel, {
            opacity: 0,
            scale: 1.5,
            ease: 'power2.in'
          }, delay + 2)
        })

        // 文字淡入
        tl.to(finalText, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          ease: 'power3.out'
        }, 2.5)

        // 故障效果
        tl.to(finalText, {
          x: 3,
          textShadow: '2px 0 #ff0000',
          duration: 0.05,
          ease: 'none'
        }, 2.5)

        tl.to(finalText, {
          x: -3,
          textShadow: '-2px 0 #00ffff',
          duration: 0.05,
          ease: 'none'
        }, 2.55)

        tl.to(finalText, {
          x: 0,
          textShadow: 'none',
          duration: 0.1,
          ease: 'power2.out'
        }, 2.6)
      })

      // 故障容器动画
      if (glitchContainer.value) {
        gsap.to(glitchContainer.value, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress
              const glitchIntensity = Math.sin(progress * Math.PI * 10) * 5

              gsap.set(glitchContainer.value, {
                x: glitchIntensity,
                filter: `hue-rotate(${progress * 60}deg) contrast(${1 + progress * 0.5})`
              })
            }
          },
          ease: 'none'
        })
      }

      // 数据流动画
      if (dataColumns.length) {
        gsap.from(dataColumns, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          height: 0,
          opacity: 0,
          duration: 1,
          stagger: {
            each: 0.05,
            from: 'random'
          },
          ease: 'power2.out'
        })

        // 数据流动
        dataColumns.forEach((column: HTMLElement, index: number) => {
          gsap.to(column, {
            y: -100 + Math.random() * 200,
            duration: 1.5 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
          })

          // 闪烁效果
          gsap.to(column, {
            opacity: 0.2 + Math.random() * 0.6,
            duration: 0.1 + Math.random() * 0.2,
            repeat: -1,
            yoyo: true,
            ease: 'none'
          })
        })
      }

      // 电路线动画
      if (circuits.length) {
        gsap.from(circuits, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleX: 0,
          scaleY: 0,
          duration: 1.5,
          stagger: {
            each: 0.03,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        // 电路流动
        circuits.forEach((circuit: HTMLElement, index: number) => {
          const flowDirection = index % 2 === 0 ? 1 : -1

          gsap.to(circuit, {
            x: flowDirection * 50,
            opacity: 0.1 + Math.random() * 0.3,
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.spr-pixel-text-section-185 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0a2a 50%, #0a0a1a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.spr-container-185 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.spr-title-185 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7, #ec4899, #f43f5e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.spr-subtitle-185 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(168, 85, 247, 0.6);
  margin-bottom: 120px;
  letter-spacing: 0.5em;
  text-transform: uppercase;

  opacity: 1 !important;}

.spr-text-stage-185 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 100px;

  opacity: 1 !important;}

.spr-grid-container-185 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
  z-index: 1;
}

.spr-text-item-185 {
  position: relative;
  width: 400px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.spr-pixel-grid-185 {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(8, 10px);
  grid-template-rows: repeat(8, 10px);
  gap: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spr-pixel-185 {
  width: 10px;
  height: 10px;
  border-radius: 1px;
  background: rgba(168, 85, 247, 0.6);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.spr-text-185 {
  position: relative;
  font-size: clamp(3rem, 8vw, 4.5rem);
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-shadow: 0 0 30px rgba(168, 85, 247, 0.8);

  opacity: 1 !important;}

.spr-glitch-container-185 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  opacity: 1 !important;}

.spr-scanline-185 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(168, 85, 247, 0.3);
  animation: scanlineMove-185 8s linear infinite;

  opacity: 1 !important;}

@keyframes scanlineMove-185 {
  0% { top: 0; opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { top: 100%; opacity: 0.3; }
}

.spr-noise-185 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  animation: noiseMove-185 0.5s steps(5) infinite;
}

@keyframes noiseMove-185 {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-1%, 1%); }
  50% { transform: translate(1%, -1%); }
  75% { transform: translate(-1%, -1%); }
}

.spr-data-stream-185 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  opacity: 1 !important;}

.spr-data-column-185 {
  position: absolute;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4), transparent);

  opacity: 1 !important;}

@for $i from 1 through 10 {
  .spr-data-column-185:nth-child(#{$i}) {
    left: #{($i - 1) * 10 + 5}%;
    opacity: #{1 - ($i - 1) * 0.08};
  }
}

.spr-circuit-lines-185 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.spr-circuit-185 {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3), transparent);
  height: 1px;

  opacity: 1 !important;}

@for $i from 1 through 15 {
  .spr-circuit-185:nth-child(#{$i}) {
    width: #{100 + ($i % 5) * 50}px;
    top: #{10 + ($i % 8) * 12}%;
    left: #{($i - 1) * 6 + 2}%;
  }
}

@media (max-width: 768px) {
  .spr-text-item-185 {
    width: 300px;
    height: 100px;
  
  opacity: 1 !important;}

  .spr-text-185 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .spr-pixel-grid-185 {
    grid-template-columns: repeat(8, 8px);
    grid-template-rows: repeat(8, 8px);
    gap: 1px;
  }

  .spr-pixel-185 {
    width: 8px;
    height: 8px;
  
  opacity: 1 !important;}
}
</style>
