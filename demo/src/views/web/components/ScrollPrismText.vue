<template>
  <div class="spri-prism-text-section-176" ref="componentRoot">
    <div class="spri-container-176">
      <h2 class="spri-title-176">棱镜文字</h2>
      <p class="spri-subtitle-176">Prism Text</p>

      <div class="spri-text-stage-176">
        <div class="spri-prism-container-176">
          <div class="spri-prism-176" ref="mainPrism">
            <div class="spri-prism-face-176"></div>
            <div class="spri-prism-face-176"></div>
            <div class="spri-prism-face-176"></div>
          </div>
        </div>

        <div class="spri-text-container-176">
          <div
            v-for="(item, index) in prismTexts"
            :key="index"
            class="spri-text-item-176"
            :ref="el => { if (el) textItemRefs[index] = el as HTMLElement }"
          >
            <div class="spri-spectrum-176" :ref="el => { if (el) spectrumRefs[index] = el as HTMLElement }">
              <span
                v-for="(color, colorIndex) in colors"
                :key="colorIndex"
                class="spri-spectrum-text-176"
                :class="`spri-color-${colorIndex}-176`"
                :ref="el => { if (el) spectrumTextRefs[`${index}-${colorIndex}`] = el as HTMLElement }"
              >{{ item.text }}</span>
            </div>
            <span class="spri-main-text-176" :ref="el => { if (el) mainTextRefs[index] = el as HTMLElement }">{{ item.text }}</span>
          </div>
        </div>

        <div class="spri-light-rays-176">
          <div
            v-for="n in 8"
            :key="n"
            class="spri-light-ray-176"
            :ref="el => { if (el) lightRayRefs[n] = el as HTMLElement }"
          ></div>
        </div>
      </div>

      <div class="spri-prism-bg-176">
        <div
          v-for="n in 6"
          :key="n"
          class="spri-bg-prism-176"
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
const mainPrism = ref<HTMLElement>()
const textItemRefs = ref<HTMLElement[]>([])
const spectrumRefs = ref<HTMLElement[]>({})
const spectrumTextRefs = ref<Record<string, HTMLElement>>({})
const mainTextRefs = ref<HTMLElement[]>({})
const lightRayRefs = ref<Record<number, HTMLElement>>({})

const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']

interface PrismText {
  text: string
}

const prismTexts: PrismText[] = [
  { text: 'SPECTRUM' },
  { text: 'PRISM' },
  { text: 'LIGHT' }
]

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.spri-title-176', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.spri-subtitle-176', componentRoot.value)
      const lightRays = gsap.utils.toArray<HTMLElement>('.spri-light-ray-176', componentRoot.value)

      // 标题动画 - 棱镜折射效果
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          x: -100,
          opacity: 0,
          filter: 'hue-rotate(90deg)',
          duration: 1.2,
          ease: 'power4.out'
        })

        // 标题色相旋转
        gsap.to(titleEl, {
          filter: 'hue-rotate(0deg)',
          duration: 2,
          ease: 'power2.out',
          delay: 1.2
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          x: 100,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out'
        })
      }

      // 棱镜文字动画
      textItemRefs.value.forEach((item: HTMLElement, index: number) => {
        const spectrum = spectrumRefs.value[index]
        const mainText = mainTextRefs.value[index]

        if (!spectrum || !mainText) return

        // 获取光谱文字
        const spectrumTexts = Object.keys(spectrumTextRefs.value)
          .filter(key => key.startsWith(`${index}-`))
          .map(key => spectrumTextRefs.value[key])

        // 初始状态 - 光谱分散
        spectrumTexts.forEach((textEl: HTMLElement, textIndex: number) => {
          const offsetX = (textIndex - 3) * 30
          const opacity = textIndex === 3 ? 1 : 0.5

          gsap.set(textEl, {
            x: offsetX * 3,
            opacity: 0,
            filter: `hue-rotate(${textIndex * 30}deg)`
          })
        })

        gsap.set(mainText, {
          opacity: 0,
          scale: 0.8
        })

        // 滚动棱镜动画
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.5
          }
        })

        // 第一阶段：光谱分离
        spectrumTexts.forEach((textEl: HTMLElement, textIndex: number) => {
          const offsetX = (textIndex - 3) * 40

          tl.to(textEl, {
            x: offsetX,
            opacity: textIndex === 3 ? 1 : 0.6,
            ease: 'back.out(1.5)'
          }, textIndex * 0.1)
        })

        // 第二阶段：光谱汇聚
        spectrumTexts.forEach((textEl: HTMLElement) => {
          tl.to(textEl, {
            x: 0,
            ease: 'power2.inOut'
          }, 2)
        })

        // 第三阶段：主文字显现
        tl.to(mainText, {
          opacity: 1,
          scale: 1,
          ease: 'elastic.out(1, 0.5)'
        }, 2.5)

        // 第四阶段：色相流转
        tl.to(spectrum, {
          filter: 'hue-rotate(360deg)',
          ease: 'none'
        }, 0)

        // 持续动画
        spectrumTexts.forEach((textEl: HTMLElement, textIndex: number) => {
          gsap.to(textEl, {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 5,
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        })
      })

      // 主棱镜动画
      if (mainPrism.value) {
        gsap.from(mainPrism.value, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          rotateY: -180,
          scale: 0,
          opacity: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        })

        gsap.to(mainPrism.value, {
          rotateY: 360,
          duration: 20,
          repeat: -1,
          ease: 'none'
        })
      }

      // 光线动画
      if (lightRays.length) {
        gsap.from(lightRays, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleY: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.1,
            from: 'center'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        lightRays.forEach((ray: HTMLElement, index: number) => {
          const angle = (index / lightRays.length) * 360

          gsap.to(ray, {
            rotate: angle,
            duration: 5 + Math.random() * 5,
            repeat: -1,
            ease: 'none'
          })

          gsap.to(ray, {
            opacity: 0.3 + Math.random() * 0.4,
            scaleY: 0.8 + Math.random() * 0.4,
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
.spri-prism-text-section-176 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0a1a 50%, #0a0a2a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.spri-container-176 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.spri-title-176 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 100%;
  animation: spectrumShift-176 5s linear infinite;

  opacity: 1 !important;}

@keyframes spectrumShift-176 {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.spri-subtitle-176 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(147, 51, 234, 0.6);
  margin-bottom: 120px;
  letter-spacing: 0.5em;
  text-transform: uppercase;

  opacity: 1 !important;}

.spri-text-stage-176 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 80px;

  opacity: 1 !important;}

.spri-prism-container-176 {
  position: absolute;
  top: 10%;
  right: 10%;
  perspective: 1000px;
  z-index: 0;
}

.spri-prism-176 {
  position: relative;
  width: 150px;
  height: 150px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.spri-prism-face-176 {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3));
  border: 2px solid rgba(147, 51, 234, 0.5);
  transform-origin: center;

  opacity: 1 !important;}

.spri-prism-face-176:nth-child(1) { transform: rotateY(0deg) translateZ(50px); }
.spri-prism-face-176:nth-child(2) { transform: rotateY(120deg) translateZ(50px); }
.spri-prism-face-176:nth-child(3) { transform: rotateY(240deg) translateZ(50px); }

.spri-text-container-176 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
  z-index: 1;
}

.spri-text-item-176 {
  position: relative;
  width: 500px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.spri-spectrum-176 {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.spri-spectrum-text-176 {
  position: absolute;
  font-size: clamp(3rem, 8vw, 4.5rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  pointer-events: none;
  mix-blend-mode: screen;

  opacity: 1 !important;}

.spri-main-text-176 {
  position: relative;
  font-size: clamp(3rem, 8vw, 4.5rem);
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-shadow: 0 0 30px rgba(147, 51, 234, 0.8);
  z-index: 1;

  opacity: 1 !important;}

.spri-light-rays-176 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.spri-light-ray-176 {
  position: absolute;
  width: 2px;
  height: 200px;
  background: linear-gradient(180deg, transparent, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.4), transparent);
  top: 50%;
  left: 50%;
  transform-origin: top center;
  filter: blur(2px);

  opacity: 1 !important;}

.spri-prism-bg-176 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.spri-bg-prism-176 {
  position: absolute;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1));
  border: 1px solid rgba(147, 51, 234, 0.2);
  transform: rotate(45deg);
  animation: bgPrismFloat-176 10s ease-in-out infinite;

  opacity: 1 !important;}

@for $i from 1 through 6 {
  .spri-bg-prism-176:nth-child(#{$i}) {
    top: #{10 + ($i % 6) * 15}%;
    left: #{5 + ($i % 8) * 12}%;
    animation-delay: #{$i * -2}s;
  }
}

@keyframes bgPrismFloat-176 {
  0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.3; }
  50% { transform: rotate(45deg) translateY(-30px); opacity: 0.5; }
}

@media (max-width: 768px) {
  .spri-text-item-176 {
    width: 300px;
    height: 120px;
  
  opacity: 1 !important;}

  .spri-spectrum-text-176,
  .spri-main-text-176 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .spri-prism-container-176 {
    display: none;
  }
}
</style>
