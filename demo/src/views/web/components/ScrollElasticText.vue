<template>
  <div class="set-elastic-text-section-173" ref="componentRoot">
    <div class="set-container-173">
      <h2 class="set-title-173">弹性文字</h2>
      <p class="set-subtitle-173">Elastic Text</p>

      <div class="set-text-stage-173">
        <div class="set-text-container-173">
          <div
            v-for="(item, index) in elasticTexts"
            :key="index"
            class="set-text-row-173"
            :ref="el => { if (el) textRowRefs[index] = el as HTMLElement }"
          >
            <div class="set-letters-173">
              <span
                v-for="(char, charIndex) in item.letters"
                :key="charIndex"
                class="set-letter-173"
                :ref="el => { if (el) letterRefs[`${index}-${charIndex}`] = el as HTMLElement }"
              >{{ char }}</span>
            </div>
          </div>
        </div>

        <div class="set-elastic-bands-173">
          <div
            v-for="n in 5"
            :key="n"
            class="set-elastic-band-173"
            :ref="el => { if (el) elasticBandRefs[n] = el as HTMLElement }"
          ></div>
        </div>

        <div class="set-bounce-particles-173">
          <div
            v-for="n in 20"
            :key="n"
            class="set-bounce-particle-173"
            :ref="el => { if (el) bounceParticleRefs[n] = el as HTMLElement }"
          ></div>
        </div>
      </div>

      <div class="set-spring-lines-173">
        <div
          v-for="n in 10"
          :key="n"
          class="set-spring-line-173"
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
const elasticBandRefs = ref<Record<number, HTMLElement>>({})
const bounceParticleRefs = ref<Record<number, HTMLElement>>({})

interface ElasticText {
  letters: string[]
}

const elasticTexts: ElasticText[] = [
  { letters: ['B', 'O', 'U', 'N', 'C', 'E'] },
  { letters: ['S', 'T', 'R', 'E', 'T', 'C', 'H'] },
  { letters: ['E', 'L', 'A', 'S', 'T', 'I', 'C'] }
]

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.set-title-173', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.set-subtitle-173', componentRoot.value)
      const elasticBands = gsap.utils.toArray<HTMLElement>('.set-elastic-band-173', componentRoot.value)
      const bounceParticles = gsap.utils.toArray<HTMLElement>('.set-bounce-particle-173', componentRoot.value)

      // 标题动画 - 弹性效果
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: -200,
          scaleY: 2,
          opacity: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        })

        // 标题持续弹跳
        gsap.to(titleEl, {
          y: -10,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: 1.5
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleX: 3,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: 'elastic.out(1, 0.5)'
        })
      }

      // 弹性文字动画
      textRowRefs.value.forEach((row: HTMLElement, index: number) => {
        const letterSpans = Object.keys(letterRefs.value)
          .filter(key => key.startsWith(`${index}-`))
          .map(key => letterRefs.value[key])

        if (!letterSpans.length) return

        // 初始状态 - 字母拉伸
        letterSpans.forEach((span: HTMLElement, spanIndex: number) => {
          const stretchY = 2 + Math.random()
          const scaleY = 0.1 + Math.random() * 0.2

          gsap.set(span, {
            scaleY: scaleY,
            y: (Math.random() - 0.5) * 100,
            opacity: 0.3 + Math.random() * 0.4,
            filter: 'blur(5px)'
          })
        })

        // 滚动弹性动画
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.4
          }
        })

        // 第一阶段：字母拉伸释放
        letterSpans.forEach((span: HTMLElement, spanIndex: number) => {
          const delay = spanIndex * 0.1

          tl.to(span, {
            scaleY: 1,
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'elastic.out(1, 0.5)'
          }, delay)
        })

        // 第二阶段：波浪弹性
        letterSpans.forEach((span: HTMLElement, spanIndex: number) => {
          const waveY = Math.sin(spanIndex * 0.8) * 30

          tl.to(span, {
            y: waveY,
            ease: 'sine.inOut'
          }, 1.5)
        })

        // 第三阶段：字母独立弹跳
        letterSpans.forEach((span: HTMLElement, spanIndex: number) => {
          const bounceY = -20 - Math.random() * 20

          tl.to(span, {
            y: bounceY,
            ease: 'elastic.out(1, 0.3)'
          }, 2.5)

          tl.to(span, {
            y: 0,
            ease: 'elastic.out(1, 0.5)'
          }, 2.5 + 0.2 + Math.random() * 0.3)
        })

        // 持续弹跳动画
        letterSpans.forEach((span: HTMLElement) => {
          gsap.to(span, {
            y: -5 + Math.random() * 10,
            duration: 0.5 + Math.random() * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random()
          })
        })
      })

      // 弹性带动画
      if (elasticBands.length) {
        gsap.from(elasticBands, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleY: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.1
          },
          ease: 'elastic.out(1, 0.5)'
        })

        elasticBands.forEach((band: HTMLElement, index: number) => {
          gsap.to(band, {
            scaleY: 0.8 + Math.random() * 0.4,
            duration: 1 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        })
      }

      // 弹跳粒子动画
      if (bounceParticles.length) {
        gsap.from(bounceParticles, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: -200,
          scale: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.05,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        bounceParticles.forEach((particle: HTMLElement) => {
          gsap.to(particle, {
            y: -100 - Math.random() * 100,
            duration: 1 + Math.random(),
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
.set-elastic-text-section-173 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a1a2a 0%, #1a2a4a 50%, #0a1a2a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.set-container-173 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.set-title-173 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.set-subtitle-173 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(6, 182, 212, 0.6);
  margin-bottom: 120px;
  letter-spacing: 0.5em;
  text-transform: uppercase;

  opacity: 1 !important;}

.set-text-stage-173 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 80px;

  opacity: 1 !important;}

.set-text-container-173 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
  z-index: 1;
}

.set-text-row-173 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.set-letters-173 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.05em;
  font-size: clamp(4rem, 10vw, 7rem);
  font-weight: 900;

  opacity: 1 !important;}

.set-letter-173 {
  position: relative;
  display: inline-block;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.set-elastic-bands-173 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.set-elastic-band-173 {
  position: absolute;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2), transparent);
  transform-origin: center;

  opacity: 1 !important;}

@for $i from 1 through 5 {
  .set-elastic-band-173:nth-child(#{$i}) {
    top: #{20 + ($i - 1) * 15}%;
  }
}

.set-bounce-particles-173 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.set-bounce-particle-173 {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(59, 130, 246, 0.3) 70%, transparent 100%);
  border-radius: 50%;

  opacity: 1 !important;}

@for $i from 1 through 20 {
  .set-bounce-particle-173:nth-child(#{$i}) {
    left: #{5 + ($i % 18) * 5}%;
    animation: bounceParticleFloat-173 #{2 + ($i % 3)}s ease-in-out infinite;
    animation-delay: #{$i * -0.1}s;
  }
}

@keyframes bounceParticleFloat-173 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-50px); }
}

.set-spring-lines-173 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.set-spring-line-173 {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1), transparent);
  animation: springLinePulse-173 2s ease-in-out infinite;

  opacity: 1 !important;}

@for $i from 1 through 10 {
  .set-spring-line-173:nth-child(#{$i}) {
    left: #{($i - 1) * 10 + 5}%;
    animation-delay: #{$i * -0.2}s;
  }
}

@keyframes springLinePulse-173 {
  0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
  50% { opacity: 0.6; transform: scaleY(1.2); }
}

@media (max-width: 768px) {
  .set-letters-173 {
    font-size: 3rem;
  
  opacity: 1 !important;}

  .set-text-container-173 {
    gap: 60px;
  }
}
</style>
