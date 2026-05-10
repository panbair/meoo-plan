<template>
  <div class="sht-holographic-text-section-180" ref="componentRoot">
    <div class="sht-container-180">
      <h2 class="sht-title-180">全息文字</h2>
      <p class="sht-subtitle-180">Holographic Text</p>

      <div class="sht-text-stage-180">
        <div class="sht-hologram-base-180" ref="hologramBase">
          <div class="sht-base-ring-180"></div>
          <div class="sht-base-ring-180" style="animation-delay: -2s;"></div>
          <div class="sht-base-ring-180" style="animation-delay: -4s;"></div>
        </div>

        <div class="sht-text-container-180">
          <div
            v-for="(item, index) in hologramTexts"
            :key="index"
            class="sht-text-item-180"
            :ref="el => { if (el) textItemRefs[index] = el as HTMLElement }"
          >
            <div class="sht-hologram-180" :ref="el => { if (el) hologramRefs[index] = el as HTMLElement }">
              <div class="sht-scanlines-180"></div>
              <span class="sht-text-180">{{ item.text }}</span>
              <div class="sht-hologram-glow-180"></div>
            </div>
            <span class="sht-label-180">{{ item.label }}</span>
          </div>
        </div>

        <div class="sht-light-beam-180" ref="lightBeam">
          <div class="sht-beam-180"></div>
          <div class="sht-beam-180" style="animation-delay: -1.5s;"></div>
        </div>
      </div>

      <div class="sht-particles-180">
        <div
          v-for="n in 30"
          :key="n"
          class="sht-particle-180"
          :ref="el => { if (el) particleRefs[n] = el as HTMLElement }"
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
const hologramRefs = ref<HTMLElement[]>({})
const hologramBase = ref<HTMLElement>()
const lightBeam = ref<HTMLElement>()
const particleRefs = ref<Record<number, HTMLElement>>({})

interface HologramText {
  text: string
  label: string
}

const hologramTexts: HologramText[] = [
  { text: 'FUTURE', label: '未来' },
  { text: 'VISION', label: '愿景' },
  { text: 'REALITY', label: '现实' }
]

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sht-title-180', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sht-subtitle-180', componentRoot.value)
      const textItems = gsap.utils.toArray<HTMLElement>('.sht-text-item-180', componentRoot.value)
      const holograms = gsap.utils.toArray<HTMLElement>('.sht-hologram-180', componentRoot.value)
      const particles = gsap.utils.toArray<HTMLElement>('.sht-particle-180', componentRoot.value)

      // 标题动画 - 全息投影效果
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          opacity: 0,
          filter: 'blur(20px)',
          scale: 1.2,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        })

        // 标题全息闪烁
        gsap.to(titleEl, {
          opacity: 0.5,
          filter: 'blur(5px)',
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'none',
          delay: 1.5
        })

        gsap.to(titleEl, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.5,
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
          y: 50,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out'
        })
      }

      // 全息文字动画
      textItems.forEach((item: HTMLElement, index: number) => {
        const hologram = hologramRefs.value[index]

        if (!hologram) return

        // 初始状态
        gsap.set(hologram, {
          opacity: 0,
          scale: 0.1,
          rotateX: 90,
          rotateY: 0,
          filter: 'blur(30px)'
        })

        // 滚动全息动画
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.7
          }
        })

        // 第一阶段：投影上升
        tl.to(hologram, {
          opacity: 0.8,
          scale: 1,
          rotateX: 0,
          filter: 'blur(10px)',
          ease: 'power3.out'
        }, 0)

        // 第二阶段：全息旋转
        tl.to(hologram, {
          rotateY: 15,
          ease: 'sine.inOut'
        }, 0.5)

        tl.to(hologram, {
          rotateY: -15,
          ease: 'sine.inOut'
        }, 1)

        tl.to(hologram, {
          rotateY: 0,
          ease: 'power2.out'
        }, 1.5)

        // 第三阶段：清晰度提升
        tl.to(hologram, {
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1.1,
          ease: 'power3.out'
        }, 1.5)

        // 第四阶段：稳定
        tl.to(hologram, {
          scale: 1,
          ease: 'power2.out'
        }, 2.5)

        // 扫描线动画
        const scanlines = hologram.querySelector('.sht-scanlines-180')
        if (scanlines) {
          gsap.to(scanlines, {
            y: '100%',
            duration: 3,
            repeat: -1,
            ease: 'none'
          })
        }
      })

      // 基底环动画
      if (hologramBase.value) {
        gsap.from(hologramBase.value, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        })

        // 基底环持续旋转
        gsap.to('.sht-base-ring-180', {
          rotate: 360,
          duration: 20,
          repeat: -1,
          ease: 'none',
          stagger: {
            each: 0.5,
            from: 'end'
          }
        })
      }

      // 光束动画
      if (lightBeam.value) {
        gsap.to(lightBeam.value, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          scaleY: 1,
          ease: 'none'
        })

        // 光束闪烁
        gsap.to('.sht-beam-180', {
          opacity: 0.5,
          duration: 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'none',
          stagger: {
            each: 0.1
          }
        })
      }

      // 粒子动画
      if (particles.length) {
        gsap.from(particles, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.02,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        // 持续浮动
        particles.forEach((particle: HTMLElement, index: number) => {
          const angle = (index / particles.length) * Math.PI * 2
          const radius = 100 + Math.random() * 150

          gsap.to(particle, {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            duration: 4 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
          })

          // 粒子闪烁
          gsap.to(particle, {
            opacity: 0.2 + Math.random() * 0.6,
            scale: 0.8 + Math.random() * 0.4,
            duration: 0.5 + Math.random() * 1,
            repeat: -1,
            yoyo: true,
            ease: 'none'
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
.sht-holographic-text-section-180 {
  min-height: 100vh;
  padding: 100px 20px;
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a1a 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sht-container-180 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.sht-title-180 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.sht-subtitle-180 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(6, 182, 212, 0.6);
  margin-bottom: 120px;
  letter-spacing: 0.5em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sht-text-stage-180 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 100px;

  opacity: 1 !important;}

.sht-hologram-base-180 { position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 50px;
      opacity: 1;
    }

.sht-base-ring-180 {
  position: absolute;
  border: 2px solid rgba(6, 182, 212, 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: baseRingRotate-180 20s linear infinite;

  opacity: 1 !important;}

.sht-base-ring-180:nth-child(1) { width: 100%; height: 100%; }
.sht-base-ring-180:nth-child(2) { width: 80%; height: 80%; animation-delay: -5s; }
.sht-base-ring-180:nth-child(3) { width: 60%; height: 60%; animation-delay: -10s; }

@keyframes baseRingRotate-180 {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.sht-text-container-180 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 120px;
  z-index: 1;
}

.sht-text-item-180 {
  position: relative;
  width: 500px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1000px;

  opacity: 1 !important;}

.sht-hologram-180 { position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
      opacity: 1;
    }

.sht-scanlines-180 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(6, 182, 212, 0.1) 2px,
    rgba(6, 182, 212, 0.1) 4px
  );
  pointer-events: none;
  overflow: hidden;

  opacity: 1 !important;}

.sht-text-180 {
  font-size: clamp(4rem, 10vw, 6rem);
  font-weight: 900;
  color: rgba(6, 182, 212, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.3em;
  text-shadow: 
    0 0 10px rgba(6, 182, 212, 0.8),
    0 0 20px rgba(6, 182, 212, 0.6),
    0 0 40px rgba(6, 182, 212, 0.4);
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sht-hologram-glow-180 { position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(ellipse at center, rgba(6, 182, 212, 0.2) 0%, transparent 70%);
  pointer-events: none;
      opacity: 1;
    }

.sht-label-180 {
  margin-top: 20px;
  font-size: 1rem;
  color: rgba(6, 182, 212, 0.5);
  letter-spacing: 0.5em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sht-light-beam-180 {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  opacity: 1 !important;}

.sht-beam-180 { position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.6), rgba(3, 169, 244, 0.6), transparent);
  filter: blur(3px);
      opacity: 1;
    }

.sht-particles-180 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.sht-particle-180 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, transparent 70%);
  border-radius: 50%;

  opacity: 1 !important;}

@for $i from 1 through 30 {
  .sht-particle-180:nth-child(#{$i}) {
    top: #{10 + ($i % 8) * 12}%;
    left: #{10 + ($i % 9) * 10}%;
  }
}

@media (max-width: 768px) {
  .sht-text-item-180 {
    width: 320px;
    height: 120px;
  
  opacity: 1 !important;}

  .sht-text-180 {
    font-size: 3rem;
  
  opacity: 1 !important;}

  .sht-hologram-base-180 { width: 200px;
    height: 40px;
      opacity: 1;
    }
}
</style>
