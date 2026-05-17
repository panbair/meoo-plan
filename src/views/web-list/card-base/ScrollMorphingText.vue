<template>
  <div class="smt-morphing-text-section-165" ref="componentRoot">
    <div class="smt-container-165">
      <h2 class="smt-title-165">变形文字</h2>
      <p class="smt-subtitle-165">Morphing Text Effect</p>

      <div class="smt-text-stage-165">
        <div class="smt-morph-container-165">
          <div
            v-for="(text, index) in morphTexts"
            :key="index"
            class="smt-morph-text-165"
            :ref="el => { if (el) textRefs[index] = el as HTMLElement }"
          >
            <span class="smt-original-165">{{ text.original }}</span>
            <span class="smt-morphed-165">{{ text.morphed }}</span>
          </div>
        </div>

        <div class="smt-progress-bar-165" ref="progressBar">
          <div class="smt-progress-fill-165" ref="progressFill"></div>
        </div>
      </div>

      <div class="smt-decoration-165">
        <div
          v-for="n in 8"
          :key="n"
          class="smt-deco-line-165"
          :ref="el => { if (el) decoRefs[n] = el as HTMLElement }"
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
const decoRefs = ref<Record<number, HTMLElement>>({})
const progressBar = ref<HTMLElement>()
const progressFill = ref<HTMLElement>()

interface MorphText {
  original: string
  morphed: string
}

const morphTexts: MorphText[] = [
  { original: '创造', morphed: 'CREATE' },
  { original: '变形', morphed: 'MORPH' },
  { original: '进化', morphed: 'EVOLVE' }
]

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.smt-title-165', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.smt-subtitle-165', componentRoot.value)
      const morphTextsEl = gsap.utils.toArray<HTMLElement>('.smt-morph-text-165', componentRoot.value)
      const originalTexts = gsap.utils.toArray<HTMLElement>('.smt-original-165', componentRoot.value)
      const morphedTexts = gsap.utils.toArray<HTMLElement>('.smt-morphed-165', componentRoot.value)
      const decoLines = gsap.utils.toArray<HTMLElement>('.smt-deco-line-165', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          filter: 'blur(10px)',
          duration: 1,
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
          y: 30,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 变形文字动画
      morphTextsEl.forEach((textEl: HTMLElement, index: number) => {
        const original = textEl.querySelector('.smt-original-165') as HTMLElement
        const morphed = textEl.querySelector('.smt-morphed-165') as HTMLElement

        // 初始状态
        gsap.set(morphed, {
          opacity: 0,
          y: 20,
          filter: 'blur(10px)',
          letterSpacing: '0.5em'
        })

        // 滚动变形动画 - 使用scrub
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: textEl,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.5
          }
        })

        // 原始文字淡出和变形
        tl.to(original, {
          opacity: 0,
          scale: 0.7,
          letterSpacing: '0em',
          filter: 'blur(10px)',
          ease: 'none'
        }, 0)

        // 变形文字淡入和变形
        tl.to(morphed, {
          opacity: 1,
          y: 0,
          scale: 1,
          letterSpacing: '0.3em',
          filter: 'blur(0px)',
          ease: 'none'
        }, 0)

        // 整体扭曲
        tl.to(textEl, {
          skewX: 15,
          ease: 'power1.inOut'
        }, 0.5)

        tl.to(textEl, {
          skewX: -15,
          ease: 'power1.inOut'
        }, 0.5)

        tl.to(textEl, {
          skewX: 0,
          ease: 'none'
        })
      })

      // 装饰线动画
      if (decoLines.length) {
        gsap.from(decoLines, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleX: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.1,
            from: 'center'
          },
          ease: 'power3.inOut'
        })

        decoLines.forEach((line: HTMLElement, index: number) => {
          const isLeft = index < 4
          const xMove = isLeft ? -50 : 50

          gsap.to(line, {
            x: xMove,
            duration: 2 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2
          })
        })
      }

      // 进度条动画
      if (progressFill.value && progressBar.value) {
        gsap.to(progressFill.value, {
          width: '100%',
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          ease: 'none'
        })

        // 进度条颜色渐变
        ScrollTrigger.create({
          trigger: componentRoot.value,
          start: 'top 80%',
          end: 'bottom 20%',
          onUpdate: (self) => {
            const progress = self.progress
            const hue = 280 + progress * 60
            gsap.set(progressFill.value, {
              background: `hsl(${hue}, 80%, 60%)`,
              boxShadow: `0 0 20px hsl(${hue}, 80%, 60%, 0.5)`
            })
          }
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
.smt-morphing-text-section-165 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a2a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.smt-container-165 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.smt-title-165 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7, #ec4899, #f43f5e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.smt-subtitle-165 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(168, 85, 247, 0.6);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.smt-text-stage-165 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 80px;

  opacity: 1 !important;}

.smt-morph-container-165 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
}

.smt-morph-text-165 { position: relative;
  width: 400px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
      opacity: 1;
    }

.smt-original-165,
.smt-morphed-165 {
  position: absolute;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.smt-original-165 {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(168, 85, 247, 0.5);

  opacity: 1 !important;}

.smt-morphed-165 {
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(236, 72, 153, 0.5);

  opacity: 1 !important;}

.smt-progress-bar-165 {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 600px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.smt-progress-fill-165 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #a855f7, #ec4899);
  border-radius: 2px;
  transition: width 0.1s ease;

  opacity: 1 !important;}

.smt-decoration-165 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.smt-deco-line-165 {
  position: absolute;
  width: 2px;
  height: 100px;
  background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.3), transparent);
  transform-origin: top center;

  opacity: 1 !important;}

.smt-deco-line-165:nth-child(1) { left: 10%; top: 20%; }
.smt-deco-line-165:nth-child(2) { left: 15%; top: 40%; }
.smt-deco-line-165:nth-child(3) { left: 20%; top: 60%; }
.smt-deco-line-165:nth-child(4) { left: 25%; top: 80%; }
.smt-deco-line-165:nth-child(5) { right: 10%; top: 20%; }
.smt-deco-line-165:nth-child(6) { right: 15%; top: 40%; }
.smt-deco-line-165:nth-child(7) { right: 20%; top: 60%; }
.smt-deco-line-165:nth-child(8) { right: 25%; top: 80%; }

@media (max-width: 768px) {
  .smt-morph-text-165 { width: 300px;
    height: 80px;
      opacity: 1;
    }

  .smt-morph-container-165 {
    gap: 60px;
  }

  .smt-progress-bar-165 {
    width: 90%;
  
  opacity: 1 !important;}

  .smt-deco-line-165 {
    height: 60px;
  
  opacity: 1 !important;}
}
</style>
