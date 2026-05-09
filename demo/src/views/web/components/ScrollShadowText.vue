<template>
  <div class="sst-shadow-text-section-189" ref="componentRoot">
    <div class="sst-container-189">
      <h2 class="sst-title-189">文字阴影控制</h2>
      <p class="sst-subtitle-189">Shadow Text Control</p>

      <div class="sst-text-stage-189">
        <div class="sst-shadow-container-189">
          <div
            v-for="(item, index) in shadowTexts"
            :key="index"
            class="sst-shadow-item-189"
            :ref="el => { if (el) shadowItemRefs[index] = el as HTMLElement }"
          >
            <span
              class="sst-shadow-text-189"
              :ref="el => { if (el) textRefs[index] = el as HTMLElement }"
            >{{ item.text }}</span>
            <div class="sst-info-189">{{ item.info }}</div>
          </div>
        </div>

        <div class="sst-visualizer-189">
          <div class="sst-preview-box-189" ref="previewBox">
            <span class="sst-preview-text-189" ref="previewText">SHADOW</span>
          </div>
          <div class="sst-controls-189">
            <div class="sst-control-item-189">
              <span class="sst-label-189">Blur</span>
              <div class="sst-bar-189" ref="blurBar">
                <div class="sst-fill-189" ref="blurFill"></div>
              </div>
            </div>
            <div class="sst-control-item-189">
              <span class="sst-label-189">Spread</span>
              <div class="sst-bar-189" ref="spreadBar">
                <div class="sst-fill-189" ref="spreadFill"></div>
              </div>
            </div>
            <div class="sst-control-item-189">
              <span class="sst-label-189">Opacity</span>
              <div class="sst-bar-189" ref="opacityBar">
                <div class="sst-fill-189" ref="opacityFill"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="sst-light-source-189" ref="lightSource">
          <div class="sst-light-orb-189"></div>
          <div class="sst-light-rays-189">
            <div v-for="n in 8" :key="n" class="sst-ray-189"></div>
          </div>
        </div>
      </div>

      <div class="sst-background-shadows-189">
        <div
          v-for="n in 12"
          :key="n"
          class="sst-bg-shadow-189"
          :ref="el => { if (el) bgShadowRefs[n] = el as HTMLElement }"
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
const shadowItemRefs = ref<HTMLElement[]>([])
const bgShadowRefs = ref<Record<number, HTMLElement>>({})
const previewBox = ref<HTMLElement>()
const previewText = ref<HTMLElement>()
const blurBar = ref<HTMLElement>()
const blurFill = ref<HTMLElement>()
const spreadBar = ref<HTMLElement>()
const spreadFill = ref<HTMLElement>()
const opacityBar = ref<HTMLElement>()
const opacityFill = ref<HTMLElement>()
const lightSource = ref<HTMLElement>()

interface ShadowText {
  text: string
  info: string
}

const shadowTexts: ShadowText[] = [
  { text: 'NEON', info: '霓虹发光' },
  { text: 'GLOW', info: '柔和辉光' },
  { text: 'BURN', info: '烈焰燃烧' },
  { text: 'ECHO', info: '多重回响' }
]

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sst-title-189', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sst-subtitle-189', componentRoot.value)
      const shadowItems = gsap.utils.toArray<HTMLElement>('.sst-shadow-item-189', componentRoot.value)
      const shadowTextsEl = gsap.utils.toArray<HTMLElement>('.sst-shadow-text-189', componentRoot.value)
      const bgShadows = gsap.utils.toArray<HTMLElement>('.sst-bg-shadow-189', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 85%',
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
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 阴影文字动画
      shadowItems.forEach((item: HTMLElement, index: number) => {
        const text = shadowTextsEl[index]

        if (text) {
          // 初始状态
          gsap.set(text, {
            textShadow: '0 0 0px rgba(168, 85, 247, 0)'
          })

          // 滚动控制阴影动画
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top 75%',
              end: 'top 25%',
              scrub: 0.8
            }
          })

          // 不同文字的不同阴影效果
          switch (index) {
            case 0: // NEON - 霓虹发光
              tl.to(text, {
                textShadow: '0 0 10px rgba(168, 85, 247, 0.8), 0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(168, 85, 247, 0.4)',
                ease: 'none'
              }, 0)
              tl.to(text, {
                textShadow: '0 0 5px rgba(236, 72, 153, 1), 0 0 15px rgba(236, 72, 153, 0.8), 0 0 30px rgba(236, 72, 153, 0.6)',
                ease: 'none'
              }, 0.5)
              break

            case 1: // GLOW - 柔和辉光
              tl.to(text, {
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(168, 85, 247, 0.3)',
                ease: 'none'
              }, 0)
              tl.to(text, {
                textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(236, 72, 153, 0.4)',
                ease: 'none'
              }, 0.5)
              break

            case 2: // BURN - 烈焰燃烧
              tl.to(text, {
                textShadow: '5px 0px 0px rgba(255, 100, 0, 0.5), -5px 0px 0px rgba(255, 200, 0, 0.5)',
                ease: 'none'
              }, 0)
              tl.to(text, {
                textShadow: '10px 0px 0px rgba(255, 0, 0, 0.8), -10px 0px 0px rgba(255, 100, 0, 0.6), 0 20px 20px rgba(255, 50, 0, 0.5)',
                ease: 'none'
              }, 0.5)
              break

            case 3: // ECHO - 多重回响
              tl.to(text, {
                textShadow: '2px 2px 0px rgba(168, 85, 247, 0.3), 4px 4px 0px rgba(168, 85, 247, 0.2)',
                ease: 'none'
              }, 0)
              tl.to(text, {
                textShadow: '4px 4px 0px rgba(236, 72, 153, 0.4), 8px 8px 0px rgba(236, 72, 153, 0.3), 12px 12px 0px rgba(236, 72, 153, 0.2)',
                ease: 'none'
              }, 0.5)
              break
          }

          // 文字缩放配合阴影
          tl.to(text, {
            scale: 1.1,
            ease: 'power1.inOut'
          }, 0.3)

          tl.to(text, {
            scale: 1,
            ease: 'power1.inOut'
          }, 0.7)
        }
      })

      // 预览框动画
      if (previewText.value && blurFill.value && spreadFill.value && opacityFill.value) {
        // 预览文字阴影控制
        gsap.to(previewText.value, {
          scrollTrigger: {
            trigger: previewBox.value,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress

              // 动态阴影
              const blur = 10 + progress * 40
              const spread = 0 + progress * 20
              const offsetX = Math.sin(progress * Math.PI * 4) * 10
              const offsetY = Math.cos(progress * Math.PI * 4) * 10

              gsap.set(previewText.value, {
                textShadow: `${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(168, 85, 247, ${0.3 + progress * 0.5})`
              })
            }
          },
          ease: 'none'
        })

        // 控制条动画
        gsap.to(blurFill.value, {
          width: '100%',
          scrollTrigger: {
            trigger: previewBox.value,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          ease: 'none'
        })

        gsap.to(spreadFill.value, {
          width: '100%',
          scrollTrigger: {
            trigger: previewBox.value,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          ease: 'none',
          delay: 0.1
        })

        gsap.to(opacityFill.value, {
          width: '100%',
          scrollTrigger: {
            trigger: previewBox.value,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          ease: 'none',
          delay: 0.2
        })
      }

      // 光源动画
      if (lightSource.value) {
        gsap.to(lightSource.value, {
          x: () => window.innerWidth * 0.4,
          y: () => -window.innerHeight * 0.3,
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          ease: 'power1.inOut'
        })

        // 光源脉冲
        gsap.to('.sst-light-orb-189', {
          scale: 1.5,
          opacity: 0.6,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })

        // 光线旋转
        gsap.to('.sst-light-rays-189', {
          rotate: 360,
          duration: 30,
          repeat: -1,
          ease: 'none'
        })
      }

      // 背景阴影动画
      if (bgShadows.length) {
        gsap.from(bgShadows, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          scale: 0.5,
          duration: 1.5,
          stagger: {
            each: 0.05,
            from: 'random'
          },
          ease: 'power3.out'
        })

        // 持续浮动
        bgShadows.forEach((shadow: HTMLElement, index: number) => {
          gsap.to(shadow, {
            y: -20 - Math.random() * 30,
            opacity: 0.1 + Math.random() * 0.2,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
          })

          // 阴影扩散效果
          gsap.to(shadow, {
            scale: 1.5,
            filter: 'blur(30px)',
            duration: 2 + Math.random(),
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
.sst-shadow-text-section-189 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a2a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sst-container-189 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.sst-title-189 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7, #ec4899, #f43f5e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.sst-subtitle-189 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(168, 85, 247, 0.6);
  margin-bottom: 120px;
  letter-spacing: 0.5em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sst-text-stage-189 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;

  opacity: 1 !important;}

.sst-shadow-container-189 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  width: 100%;
  max-width: 800px;

  opacity: 1 !important;}

.sst-shadow-item-189 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.sst-shadow-text-189 {
  font-size: clamp(4rem, 10vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #fff;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.sst-info-189 {
  margin-top: 15px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sst-visualizer-189 {
  width: 100%;
  max-width: 600px;
  padding: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.sst-preview-box-189 {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  margin-bottom: 30px;

  opacity: 1 !important;}

.sst-preview-text-189 {
  font-size: 4rem;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.3em;

  opacity: 1 !important;}

.sst-controls-189 {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sst-control-item-189 {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sst-label-189 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sst-bar-189 {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;

  opacity: 1 !important;}

.sst-fill-189 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #a855f7, #ec4899);
  border-radius: 3px;
  transition: width 0.1s ease;

  opacity: 1 !important;}

.sst-light-source-189 {
  position: absolute;
  top: 20%;
  left: 10%;
  z-index: 0;
}

.sst-light-orb-189 {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(168, 85, 247, 0.4) 50%, transparent 100%);
  border-radius: 50%;
  position: relative;
  margin: 0 auto;

  opacity: 1 !important;}

.sst-light-rays-189 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;

  opacity: 1 !important;}

.sst-ray-189 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 40px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent);
  transform-origin: bottom center;

  opacity: 1 !important;}

@for $i from 1 through 8 {
  .sst-ray-189:nth-child(#{$i}) {
    transform: translate(-50%, -100%) rotate(#{$i * 45}deg);
  }
}

.sst-background-shadows-189 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.sst-bg-shadow-189 {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);

  opacity: 1 !important;}

@for $i from 1 through 12 {
  .sst-bg-shadow-189:nth-child(#{$i}) {
    left: #{($i - 1) * 8 + 5}%;
    top: #{20 + ($i % 5) * 15}%;
  }
}

@media (max-width: 768px) {
  .sst-shadow-container-189 {
    gap: 50px;
  }

  .sst-shadow-item-189 {
    padding: 30px;
  
  opacity: 1 !important;}

  .sst-shadow-text-189 {
    font-size: 3rem;
  
  opacity: 1 !important;}

  .sst-visualizer-189 {
    padding: 30px;
  
  opacity: 1 !important;}

  .sst-preview-text-189 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}
}
</style>
